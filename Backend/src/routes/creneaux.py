# -*- coding: utf-8 -*-
"""
Routes de gestion des créneaux horaires.

Un créneau représente une plage de disponibilité d'une entreprise.
statut=True  → disponible à la réservation.
statut=False → occupé (réservation) ou bloqué (événement).

Toutes les routes sont limitées à l'entreprise du gérant connecté :
un professionnel ne peut pas modifier les créneaux d'une autre entreprise.
"""

from flask      import Blueprint, jsonify, request
from datetime   import datetime
from src.extension import db
from src.models import Creneau
from src.utils.auth import login_required, get_pro_entreprise

creneaux_bp = Blueprint('creneaux', __name__)


def _creneau_to_dict(c):
    """
    Sérialise un créneau en dictionnaire JSON.

    Args:
        c (Creneau): Instance de créneau.

    Returns:
        dict: Représentation JSON du créneau.
    """
    return {
        "id":                c.idCreneau,
        "dateHeureDebut":    c.dateHeureDebut.isoformat(),
        "dateHeureFin":      c.dateHeureFin.isoformat(),
        "statut":            c.statut,
        "nbMaxReservations": c.nbMaxReservations,
    }


@creneaux_bp.route('/api/entreprise/creneaux', methods=['GET'])
@login_required
def get_creneaux():
    """
    Retourne tous les créneaux de l'entreprise connectée.

    Returns:
        JSON: liste de créneaux, HTTP 200.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404
        return jsonify([
            _creneau_to_dict(c)
            for c in Creneau.query.filter_by(idPro=entreprise.idPro).all()
        ]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@creneaux_bp.route('/api/entreprise/creneaux', methods=['POST'])
@login_required
def create_creneau():
    """
    Crée un créneau de disponibilité pour l'entreprise connectée.

    Le créneau est créé avec statut=True (disponible) par défaut.

    Corps JSON attendu : dateHeureDebut (ISO), dateHeureFin (ISO),
                         nbMaxReservations (int, optionnel, défaut 1)

    Returns:
        JSON: créneau créé, HTTP 201.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        data    = request.json
        creneau = Creneau(
            idPro=entreprise.idPro,
            dateHeureDebut=datetime.fromisoformat(data['dateHeureDebut']),
            dateHeureFin=datetime.fromisoformat(data['dateHeureFin']),
            statut=True,
            nbMaxReservations=data.get('nbMaxReservations', 1)
        )
        db.session.add(creneau)
        db.session.commit()
        return jsonify(_creneau_to_dict(creneau)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@creneaux_bp.route('/api/entreprise/creneaux/<int:id_creneau>', methods=['PUT'])
@login_required
def update_creneau(id_creneau):
    """
    Modifie un créneau existant.

    Vérifie que le créneau appartient bien à l'entreprise du gérant connecté.

    Args (URL): id_creneau – identifiant du créneau.
    Corps JSON accepté : dateHeureDebut, dateHeureFin, statut, nbMaxReservations

    Returns:
        JSON: créneau mis à jour, HTTP 200.
        JSON: erreur, HTTP 403 si le créneau n'appartient pas à l'entreprise.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        creneau = Creneau.query.get_or_404(id_creneau)
        if creneau.idPro != entreprise.idPro:
            return jsonify({"error": "Non autorisé"}), 403

        data = request.json
        if 'dateHeureDebut'    in data: creneau.dateHeureDebut    = datetime.fromisoformat(data['dateHeureDebut'])
        if 'dateHeureFin'      in data: creneau.dateHeureFin      = datetime.fromisoformat(data['dateHeureFin'])
        if 'statut'            in data: creneau.statut            = data['statut']
        if 'nbMaxReservations' in data: creneau.nbMaxReservations = data['nbMaxReservations']

        db.session.commit()
        return jsonify(_creneau_to_dict(creneau)), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@creneaux_bp.route('/api/entreprise/creneaux/<int:id_creneau>', methods=['DELETE'])
@login_required
def delete_creneau(id_creneau):
    """
    Supprime définitivement un créneau.

    Args (URL): id_creneau – identifiant du créneau.

    Returns:
        JSON: success, HTTP 200.
        JSON: erreur, HTTP 403 si le créneau n'appartient pas à l'entreprise.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        creneau = Creneau.query.get_or_404(id_creneau)
        if creneau.idPro != entreprise.idPro:
            return jsonify({"error": "Non autorisé"}), 403

        db.session.delete(creneau)
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@creneaux_bp.route('/api/entreprise/calendrier', methods=['GET'])
@login_required
def get_calendar_events():
    """
    Retourne les créneaux au format react-big-calendar, enrichis des informations
    de réservation pour les créneaux occupés (nom client, prestation, id réservation).

    Returns:
        JSON: liste d'événements calendrier, HTTP 200.
    """
    try:
        from src.models import Reservation, Utilisateur
        from sqlalchemy.orm import joinedload

        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        creneaux = Creneau.query.filter_by(idPro=entreprise.idPro).all()

        # Pré-charger les réservations actives liées aux créneaux de cette entreprise
        reservations = {
            r.idCreneau: r
            for r in Reservation.query.options(
                joinedload(Reservation.client),
                joinedload(Reservation.prestation),
            ).filter_by(idPro=entreprise.idPro, estAnnulee=False).all()
            if r.idCreneau
        }

        events = []
        for c in creneaux:
            res = reservations.get(c.idCreneau)
            events.append({
                "id":    c.idCreneau,
                "start": c.dateHeureDebut.isoformat(),
                "end":   c.dateHeureFin.isoformat(),
                "title": f"{res.client.prenom} {res.client.nom}" if res else "Disponible",
                "extendedProps": {
                    "isTaken":       not c.statut,
                    "nbMax":         c.nbMaxReservations,
                    "reservationId": res.idReservation if res else None,
                    "clientName":    f"{res.client.prenom} {res.client.nom}" if res else None,
                    "serviceName":   res.prestation.libelle if res else None,
                    "clientEmail":   res.client.email if res else None,
                    "clientPhone":   res.client.telephone if res else None,
                },
            })

        return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
