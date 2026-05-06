# -*- coding: utf-8 -*-
"""
Routes de gestion des événements bloquants.

Un événement (congés, fermeture, promotion) bloque automatiquement
tous les créneaux disponibles dans sa plage horaire.

Si des réservations actives existent sur la période, deux comportements
sont possibles selon le paramètre 'force' :
  - force=False (défaut) : refus de création, liste des conflits retournée.
  - force=True           : annulation des réservations impactées + notification
                           des clients par email, puis création de l'événement.
"""

from flask      import Blueprint, jsonify, request
from datetime   import datetime
from src.extension import db
from src.models import Evenement, Creneau, Reservation, EventEmail
from src.mailer import send_cancellation_email
from src.utils.auth import login_required, get_pro_entreprise
from sqlalchemy.orm import joinedload

evenements_bp = Blueprint('evenements', __name__)


@evenements_bp.route('/api/entreprise/evenements', methods=['GET'])
@login_required
def get_evenements():
    """
    Retourne les événements de l'entreprise triés par date de début croissante.

    Returns:
        JSON: liste d'événements, HTTP 200.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        return jsonify([{
            "id":            e.idEvenement,
            "titre":         e.titre,
            "description":   e.description,
            "dateDebut":     e.dateDebut.isoformat(),
            "dateFin":       e.dateFin.isoformat(),
            "typeEvenement": e.typeEvenement,
        } for e in Evenement.query
              .filter_by(idPro=entreprise.idPro)
              .order_by(Evenement.dateDebut.asc())
              .all()
        ]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@evenements_bp.route('/api/entreprise/evenements', methods=['POST'])
@login_required
def create_evenement():
    """
    Crée un événement bloquant et gère l'impact sur les créneaux existants.

    Flux :
    1. Recherche des créneaux dans la plage dateDebut–dateFin.
    2. Détection des réservations actives sur ces créneaux.
    3. Si conflit et force=False → 409 avec liste des réservations impactées.
    4. Si force=True → annulation + emails clients + blocage des créneaux.
    5. Création de l'événement en base.

    Corps JSON attendu :
        titre (str), description (str), typeEvenement (str),
        dateDebut (ISO), dateFin (ISO), force (bool, optionnel)

    Returns:
        JSON: success, id, blockedCount, cancelledCount, HTTP 201.
        JSON: conflict, message, reservations, HTTP 409.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        data        = request.json
        titre       = data.get("titre", "").strip()
        description = data.get("description", "").strip()
        type_evt    = data.get("typeEvenement", "Fermeture").strip()
        force       = data.get("force", False)

        if not titre:
            return jsonify({"error": "Le titre est obligatoire"}), 400

        try:
            date_debut = datetime.fromisoformat(data["dateDebut"])
            date_fin   = datetime.fromisoformat(data["dateFin"])
        except (KeyError, ValueError):
            return jsonify({"error": "Dates invalides (format ISO requis)"}), 400

        if date_fin <= date_debut:
            return jsonify({"error": "La date de fin doit être après la date de début"}), 400

        # Récupération de tous les créneaux dans la plage temporelle
        creneaux_concernes = Creneau.query.filter(
            Creneau.idPro          == entreprise.idPro,
            Creneau.dateHeureDebut >= date_debut,
            Creneau.dateHeureDebut <  date_fin,
        ).all()

        # Détection des créneaux déjà réservés (statut=False) avec réservation active
        ids_occupes = [c.idCreneau for c in creneaux_concernes if not c.statut]
        reservations_actives = []
        if ids_occupes:
            reservations_actives = Reservation.query.options(
                joinedload(Reservation.client),
                joinedload(Reservation.prestation),
            ).filter(
                Reservation.idCreneau.in_(ids_occupes),
                Reservation.estAnnulee == False,
            ).all()

        if reservations_actives and not force:
            return jsonify({
                "conflict": True,
                "message":  f"{len(reservations_actives)} réservation(s) active(s) sur cette période.",
                "reservations": [{
                    "id":      f"RDV-{r.idReservation:03d}",
                    "client":  f"{r.client.prenom} {r.client.nom}",
                    "service": r.prestation.libelle,
                } for r in reservations_actives],
            }), 409

        # Annulation forcée des réservations impactées avec notification email
        if force and reservations_actives:
            for res in reservations_actives:
                res.estAnnulee = True
                res.statut     = False
                log = EventEmail(
                    idReservation=res.idReservation,
                    email=res.client.email,
                    typeEmail="annulation",
                    dateEnvoi=datetime.now(),
                    statutEnvoi=False,
                )
                db.session.add(log)
                db.session.flush()
                if send_cancellation_email(res.client, res, res.prestation, res.creneau):
                    log.statutEnvoi = True

        # Blocage de tous les créneaux concernés
        for c in creneaux_concernes:
            c.statut = False

        evt = Evenement(
            idPro=entreprise.idPro,
            titre=titre,
            description=description,
            dateDebut=date_debut,
            dateFin=date_fin,
            typeEvenement=type_evt,
        )
        db.session.add(evt)
        db.session.commit()

        return jsonify({
            "success":        True,
            "id":             evt.idEvenement,
            "blockedCount":   len(creneaux_concernes),
            "cancelledCount": len(reservations_actives) if force else 0,
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@evenements_bp.route('/api/entreprise/evenements/<int:id_evt>', methods=['DELETE'])
@login_required
def delete_evenement(id_evt):
    """
    Supprime un événement et libère les créneaux qu'il bloquait.

    Seuls les créneaux sans réservation active sont libérés pour éviter
    de rendre disponible un créneau appartenant à une autre réservation.

    Args (URL): id_evt – identifiant de l'événement.

    Returns:
        JSON: success, liberatedCount, HTTP 200.
        JSON: erreur, HTTP 403 si l'événement n'appartient pas à l'entreprise.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        evt = Evenement.query.get_or_404(id_evt)
        if evt.idPro != entreprise.idPro:
            return jsonify({"error": "Non autorisé"}), 403

        liberes = 0
        for c in Creneau.query.filter(
            Creneau.idPro          == entreprise.idPro,
            Creneau.dateHeureDebut >= evt.dateDebut,
            Creneau.dateHeureDebut <  evt.dateFin,
            Creneau.statut         == False,
        ).all():
            if not Reservation.query.filter_by(idCreneau=c.idCreneau, estAnnulee=False).first():
                c.statut = True
                liberes += 1

        db.session.delete(evt)
        db.session.commit()
        return jsonify({"success": True, "liberatedCount": liberes}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
