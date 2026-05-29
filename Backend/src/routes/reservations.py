# -*- coding: utf-8 -*-
"""
Routes de gestion des réservations.

Couvre le cycle de vie complet d'une réservation :
  - Création par un client (flux public)
  - Création manuelle par un professionnel
  - Modification du statut (confirmation / annulation)
  - Consultation par le pro (tableau de bord) et par le client
  - Mise à jour des notes

La logique de chevauchement garantit qu'une prestation de N minutes
bloque tous les créneaux qui tomberaient dans sa plage horaire,
et non seulement le créneau de départ.
"""

from flask        import Blueprint, jsonify, request, session
from datetime     import datetime, timedelta
from src.extension import db
from src.models   import Reservation, Utilisateur, Prestation, Creneau, Entreprise, EventEmail
from src.mailer   import send_confirmation_email, send_cancellation_email
from src.utils.auth import login_required, get_pro_entreprise
from sqlalchemy.orm import joinedload

reservations_bp = Blueprint('reservations', __name__)


#  Fonctions utilitaires internes

def _block_overlapping(creneau, prestation):
    """
    Marque comme indisponibles les créneaux chevauchés par la durée de la prestation.

    Exemple : une prestation de 90 min débutant à 09h00 doit bloquer
    le créneau de 10h00 (qui tombe avant 10h30, fin théorique du soin).

    Args:
        creneau    (Creneau)   : Créneau de départ de la réservation.
        prestation (Prestation): Prestation réservée, dont dureeMinutes est lu.
    """
    end = creneau.dateHeureDebut + timedelta(minutes=prestation.dureeMinutes)
    for c in Creneau.query.filter(
        Creneau.idPro        == creneau.idPro,
        Creneau.idCreneau    != creneau.idCreneau,
        Creneau.dateHeureDebut > creneau.dateHeureDebut,
        Creneau.dateHeureDebut < end,
        Creneau.statut       == True,
    ).all():
        c.statut = False


def _free_overlapping(res):
    """
    Libère les créneaux bloqués lors de l'annulation d'une réservation.

    Seuls les créneaux sans autre réservation active sont libérés,
    afin de ne pas remettre à disposition un créneau encore occupé
    par une autre réservation.

    Args:
        res (Reservation): Réservation en cours d'annulation.
    """
    if not res.creneau:
        return

    res.creneau.statut = True
    end = res.creneau.dateHeureDebut + timedelta(minutes=res.prestation.dureeMinutes)

    for c in Creneau.query.filter(
        Creneau.idPro          == res.idPro,
        Creneau.idCreneau      != res.creneau.idCreneau,
        Creneau.dateHeureDebut  > res.creneau.dateHeureDebut,
        Creneau.dateHeureDebut  < end,
        Creneau.statut         == False,
    ).all():
        # Ne libérer que si aucune autre réservation active n'occupe ce créneau
        if not Reservation.query.filter_by(idCreneau=c.idCreneau, estAnnulee=False).first():
            c.statut = True


def _serialize_res_status(res):
    """
    Traduit les flags booléens d'une réservation en chaîne de statut lisible.

    estAnnulee est prioritaire sur statut car une réservation annulée
    ne peut pas être confirmée.

    Args:
        res (Reservation): Instance de réservation à sérialiser.

    Returns:
        str: 'cancelled' | 'confirmed' | 'pending'
    """
    if res.estAnnulee: return "cancelled"
    if res.statut:     return "confirmed"
    return "pending"


#  Routes client

@reservations_bp.route('/api/reservations', methods=['POST'])
@login_required
def create_reservation():
    """
    Crée une réservation depuis le parcours client.

    Le créneau est verrouillé (statut=False) et les créneaux chevauchants
    sont également bloqués. Un email de confirmation est envoyé au client
    et l'envoi est journalisé dans EventEmail.

    La réservation est créée avec statut=False (en attente de confirmation
    par le professionnel).

    Corps JSON attendu : idCreneau, idPrestation, commentaireClient (optionnel)

    Returns:
        JSON: success, idReservation, HTTP 201.
        JSON: erreur, HTTP 400 / 404 / 409 / 500.
    """
    data          = request.json
    id_creneau    = data.get('idCreneau')
    id_prestation = data.get('idPrestation')

    if not id_creneau or not id_prestation:
        return jsonify({"error": "Données manquantes"}), 400

    try:
        creneau = Creneau.query.get(id_creneau)
        if not creneau:
            return jsonify({"error": "Créneau introuvable"}), 404
        if not creneau.statut:
            return jsonify({"error": "Créneau déjà réservé"}), 409

        prestation = Prestation.query.get(id_prestation)
        if not prestation:
            return jsonify({"error": "Prestation introuvable"}), 404

        reservation = Reservation(
            idPro=creneau.idPro,
            idClient=session["user_id"],
            idPrestation=id_prestation,
            idCreneau=id_creneau,
            commentaireClient=data.get('commentaireClient', ''),
            statut=False,       # En attente de confirmation professionnelle
            estAnnulee=False,
            dateCreation=datetime.now()
        )
        db.session.add(reservation)
        creneau.statut = False
        _block_overlapping(creneau, prestation)
        db.session.flush()  # Nécessaire pour obtenir idReservation avant le commit

        client = Utilisateur.query.get(session["user_id"])
        log = EventEmail(
            idReservation=reservation.idReservation,
            email=client.email,
            typeEmail="confirmation",
            dateEnvoi=datetime.now(),
            statutEnvoi=False
        )
        db.session.add(log)
        db.session.commit()

        if send_confirmation_email(client, reservation, prestation, creneau):
            log.statutEnvoi = True
            db.session.commit()

        return jsonify({"success": True, "idReservation": reservation.idReservation}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@reservations_bp.route('/api/client/reservations', methods=['GET'])
@login_required
def get_client_reservations():
    """
    Retourne les réservations du client connecté.

    Les réservations liées à une entreprise dont le gérant est bloqué
    sont exclues : le client ne doit pas voir de rendez-vous chez un
    prestataire suspendu par l'administration.

    Returns:
        JSON: liste de réservations avec entreprise, prestation, date, statut.
    """
    try:
        user_id = session["user_id"]
        reservations_db = (
            Reservation.query
            .join(Entreprise, Reservation.idPro == Entreprise.idPro)
            .join(Utilisateur, Entreprise.idGerant == Utilisateur.idClient)
            .filter(Reservation.idClient == user_id)
            .filter(Utilisateur.estBloque == False)
            .options(
                joinedload(Reservation.prestation),
                joinedload(Reservation.creneau),
                joinedload(Reservation.entreprise),
            )
            .order_by(Reservation.dateCreation.desc())
            .all()
        )

        results = []
        for res in reservations_db:
            # La date du RDV provient du créneau quand il est lié ;
            # dateCreation est utilisée en fallback pour les données de test.
            if res.creneau:
                rdv_date = res.creneau.dateHeureDebut.strftime('%Y-%m-%d')
                rdv_time = res.creneau.dateHeureDebut.strftime('%H:%M')
            else:
                rdv_date = res.dateCreation.strftime('%Y-%m-%d')
                rdv_time = res.dateCreation.strftime('%H:%M')

            results.append({
                "id":             f"RDV-{res.idReservation:03d}",
                "db_id":          res.idReservation,
                "entrepriseName": res.entreprise.nomEntreprise if res.entreprise else "—",
                "service":        res.prestation.libelle,
                "duration":       f"{res.prestation.dureeMinutes} min",
                "price":          float(res.prestation.tarif) if res.prestation.tarif else 0,
                "date":           rdv_date,
                "time":           rdv_time,
                "status":         _serialize_res_status(res),
                "notes":          res.commentaireClient or "",
            })

        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#  Routes partagées (client + pro)

@reservations_bp.route('/api/reservations/<int:id_res>/status', methods=['PATCH'])
@login_required
def update_reservation_status(id_res):
    """
    Modifie le statut d'une réservation.

    Règles d'accès :
      - Le professionnel peut confirmer ou annuler ses réservations.
      - Le client ne peut qu'annuler ses propres réservations.
      - Tout autre utilisateur reçoit un 403.

    En cas d'annulation, le créneau est libéré, un email est envoyé
    au client et l'opération est journalisée dans EventEmail.

    Args (URL): id_res – identifiant de la réservation.
    Corps JSON attendu : status ('confirmed' | 'cancelled' | 'pending')

    Returns:
        JSON: success, HTTP 200.
        JSON: erreur, HTTP 403 / 409 / 500.
    """
    try:
        res = Reservation.query.options(
            joinedload(Reservation.client),
            joinedload(Reservation.prestation),
            joinedload(Reservation.creneau),
            joinedload(Reservation.entreprise)
        ).filter_by(idReservation=id_res).first_or_404()

        user_id   = session["user_id"]
        is_client = (res.idClient == user_id)
        is_pro    = (res.entreprise and res.entreprise.idGerant == user_id)

        if not is_client and not is_pro:
            return jsonify({"error": "Non autorisé"}), 403

        new_status = (request.json or {}).get('status')
        if not new_status:
            return jsonify({"error": "Données manquantes"}), 400

        if is_client and not is_pro and new_status != "cancelled":
            return jsonify({"error": "Non autorisé"}), 403

        if new_status == "cancelled":
            if res.estAnnulee:
                return jsonify({"error": "Réservation déjà annulée"}), 409

            res.estAnnulee = True
            res.statut     = False
            _free_overlapping(res)
            db.session.flush()

            log = EventEmail(
                idReservation=res.idReservation,
                email=res.client.email,
                typeEmail="annulation",
                dateEnvoi=datetime.now(),
                statutEnvoi=False
            )
            db.session.add(log)
            db.session.commit()

            if send_cancellation_email(res.client, res, res.prestation, res.creneau):
                log.statutEnvoi = True
                db.session.commit()

        elif new_status == "confirmed":
            res.statut = True
            db.session.commit()
        else:
            res.statut = False
            db.session.commit()

        return jsonify({"success": True}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@reservations_bp.route('/api/reservations/<int:id_res>/notes', methods=['PATCH'])
@login_required
def update_reservation_notes(id_res):
    """
    Met à jour le commentaire associé à une réservation.

    Args (URL): id_res – identifiant de la réservation.
    Corps JSON attendu : notes (str)

    Returns:
        JSON: success, HTTP 200.
    """
    try:
        res = Reservation.query.get_or_404(id_res)
        res.commentaireClient = (request.json or {}).get('notes', res.commentaireClient)
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


#  Routes professionnel

@reservations_bp.route('/api/entreprise/reservations', methods=['GET'])
@login_required
def get_dashboard_reservations():
    """
    Retourne toutes les réservations de l'entreprise connectée.

    Utilisé par le tableau de bord professionnel pour afficher
    la liste complète avec les informations client, prestation,
    statut et suivi d'email.

    Returns:
        JSON: liste de réservations enrichies, HTTP 200.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        reservations_db = Reservation.query.options(
            joinedload(Reservation.client),
            joinedload(Reservation.prestation),
            joinedload(Reservation.EventEmails),
            joinedload(Reservation.creneau)
        ).filter_by(idPro=entreprise.idPro).order_by(Reservation.dateCreation.desc()).all()

        results = []
        for res in reservations_db:
            if res.creneau:
                rdv_date = res.creneau.dateHeureDebut.strftime('%Y-%m-%d')
                rdv_time = res.creneau.dateHeureDebut.strftime('%H:%M')
            else:
                rdv_date = res.dateCreation.strftime('%Y-%m-%d')
                rdv_time = res.dateCreation.strftime('%H:%M')

            results.append({
                "id":          f"RDV-{res.idReservation:03d}",
                "db_id":       res.idReservation,
                "clientName":  f"{res.client.prenom} {res.client.nom}",
                "clientEmail": res.client.email,
                "clientPhone": res.client.telephone,
                "clientSince": res.client.dateInscription.strftime('%d/%m/%Y'),
                "service":     res.prestation.libelle,
                "duration":    f"{res.prestation.dureeMinutes} min",
                "price":       float(res.prestation.tarif) if res.prestation.tarif else 0,
                "date":        rdv_date,
                "time":        rdv_time,
                "status":      _serialize_res_status(res),
                "notes":       res.commentaireClient or "",
                "mailStatus":  any(e.statutEnvoi for e in res.EventEmails),
            })

        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@reservations_bp.route('/api/entreprise/reservations/manuel', methods=['POST'])
@login_required
def create_reservation_manuel():
    """
    Permet au professionnel de créer manuellement une réservation.

    Contrairement au flux client, la réservation est directement confirmée
    (statut=True). L'envoi d'email est optionnel selon le choix du pro.

    Corps JSON attendu :
        idCreneau, idPrestation, idClient,
        commentaireClient (optionnel), sendEmail (bool, optionnel)

    Returns:
        JSON: success, idReservation, HTTP 201.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        data          = request.json
        id_creneau    = data.get("idCreneau")
        id_prestation = data.get("idPrestation")
        id_client     = data.get("idClient")

        if not id_creneau or not id_prestation or not id_client:
            return jsonify({"error": "idCreneau, idPrestation et idClient sont requis"}), 400

        creneau = Creneau.query.get(id_creneau)
        if not creneau or creneau.idPro != entreprise.idPro:
            return jsonify({"error": "Créneau introuvable"}), 404
        if not creneau.statut:
            return jsonify({"error": "Créneau déjà réservé"}), 409

        prestation = Prestation.query.get(id_prestation)
        if not prestation or prestation.idPro != entreprise.idPro:
            return jsonify({"error": "Prestation introuvable"}), 404

        client = Utilisateur.query.get(id_client)
        if not client:
            return jsonify({"error": "Client introuvable"}), 404

        reservation = Reservation(
            idPro=entreprise.idPro,
            idClient=id_client,
            idPrestation=id_prestation,
            idCreneau=id_creneau,
            commentaireClient=data.get("commentaireClient", ""),
            statut=True,        # Confirmée immédiatement par le professionnel
            estAnnulee=False,
            dateCreation=datetime.now(),
        )
        db.session.add(reservation)
        creneau.statut = False
        _block_overlapping(creneau, prestation)
        db.session.flush()

        if data.get("sendEmail", False):
            log = EventEmail(
                idReservation=reservation.idReservation,
                email=client.email,
                typeEmail="confirmation",
                dateEnvoi=datetime.now(),
                statutEnvoi=False,
            )
            db.session.add(log)
            db.session.commit()
            if send_confirmation_email(client, reservation, prestation, creneau):
                log.statutEnvoi = True

        db.session.commit()
        return jsonify({"success": True, "idReservation": reservation.idReservation}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@reservations_bp.route('/api/entreprise/mes-prestations', methods=['GET'])
@login_required
def get_mes_prestations():
    """
    Retourne la liste des prestations proposées par l'entreprise connectée.

    Utilisé par le modal de réservation manuelle pour peupler
    le sélecteur de prestations.

    Returns:
        JSON: liste { id, libelle, dureeMinutes, tarif }, HTTP 200.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404
        return jsonify([{
            "id":           p.idPrestation,
            "libelle":      p.libelle,
            "dureeMinutes": p.dureeMinutes,
            "tarif":        float(p.tarif) if p.tarif else 0,
        } for p in entreprise.prestations]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
