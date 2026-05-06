# -*- coding: utf-8 -*-
"""
Routes de consultation de la liste clients du tableau de bord professionnel.

Seuls les clients ayant au moins une réservation dans l'entreprise
sont retournés — pas l'ensemble des utilisateurs de la plateforme.
"""

from flask      import Blueprint, jsonify
from src.extension import db
from src.models import Utilisateur, Reservation
from src.utils.auth import login_required, get_pro_entreprise
from sqlalchemy.orm import joinedload

clients_bp = Blueprint('clients', __name__)


@clients_bp.route('/api/entreprise/clients', methods=['GET'])
@login_required
def get_all_clients():
    """
    Retourne la liste des clients ayant réservé dans l'entreprise connectée.

    Le nombre de réservations affiché est filtré par entreprise afin d'éviter
    de comptabiliser des réservations chez d'autres prestataires.

    Returns:
        JSON: liste { id, nom, prenom, email, telephone, dateInscription,
                      nbReservations }, HTTP 200.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        # Sous-requête pour récupérer uniquement les clients de cette entreprise
        client_ids = (
            db.session.query(Reservation.idClient)
            .filter_by(idPro=entreprise.idPro)
            .distinct()
        )
        clients = (
            Utilisateur.query
            .options(joinedload(Utilisateur.reservations))
            .filter(Utilisateur.idClient.in_(client_ids))
            .all()
        )

        return jsonify([{
            "id":              c.idClient,
            "nom":             c.nom,
            "prenom":          c.prenom,
            "email":           c.email,
            "telephone":       c.telephone,
            "dateInscription": c.dateInscription.strftime('%d/%m/%Y'),
            "nbReservations":  len([r for r in c.reservations if r.idPro == entreprise.idPro]),
        } for c in clients]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
