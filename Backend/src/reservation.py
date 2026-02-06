# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify, request, session
from datetime import datetime
from src.extension import db
# Importation de tous les modèles nécessaires
from src.models import Reservation, Utilisateur, Prestation, Creneau, Entreprise, EventEmail
from sqlalchemy.orm import joinedload

# Définition du Blueprint
reservation_bp = Blueprint('reservation_api', __name__)

# --- 1. ROUTE POUR LE TABLEAU DES RÉSERVATIONS (AVEC DÉTAILS POUR L'OEIL) ---
@reservation_bp.route('/api/entreprise/reservations', methods=['GET'])
def get_dashboard_reservations():
    try:
        # On charge le client, la prestation ET les logs d'emails associés
        reservations_db = Reservation.query.options(
            joinedload(Reservation.client),
            joinedload(Reservation.prestation),
            joinedload(Reservation.EventEmails)
        ).order_by(Reservation.dateCreation.desc()).all()
        
        results = []
        for res in reservations_db:
            # Vérification si un email de confirmation a été envoyé avec succès
            mail_sent = any(e.statutEnvoi for e in res.EventEmails)
            
            results.append({
                "id": f"RDV-{res.idReservation:03d}",
                "db_id": res.idReservation,
                "clientName": f"{res.client.prenom} {res.client.nom}",
                "clientEmail": res.client.email,
                "clientPhone": res.client.telephone,                # Ajouté pour l'oeil
                "clientSince": res.client.dateInscription.strftime('%d/%m/%Y'), # Ajouté pour l'oeil
                "service": res.prestation.libelle,
                "duration": f"{res.prestation.dureeMinutes} min",
                "price": float(res.prestation.tarif) if res.prestation.tarif else 0,
                "date": res.dateCreation.strftime('%Y-%m-%d'),
                "time": res.dateCreation.strftime('%H:%M'),
                "status": "confirmed" if res.statut else "pending",
                "notes": res.commentaireClient or "",
                "mailStatus": mail_sent                        # Ajouté pour l'oeil
            })
        
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- 2. ROUTE POUR LE CALENDRIER (CRÉNEAUX & RÉSERVATIONS) ---
@reservation_bp.route('/api/entreprise/calendrier', methods=['GET'])
def get_calendar_events():
    try:
        # On récupère tous les créneaux
        creneaux = Creneau.query.all()
        
        calendar_events = []
        for c in creneaux:
            # statut True = Libre / False = Occupé
            is_taken = not c.statut
            
            calendar_events.append({
                "id": c.idCreneau,
                "start": c.dateHeureDebut.isoformat(),
                "end": c.dateHeureFin.isoformat(),
                "title": "Réservé" if is_taken else "Disponible",
                "extendedProps": {
                    "isTaken": is_taken,
                    "type": "creneau"
                }
            })
            
        return jsonify(calendar_events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- 3. ROUTE POUR MODIFIER LE STATUT D'UNE RÉSERVATION ---
@reservation_bp.route('/api/reservations/<int:id_res>/status', methods=['PATCH'])
def update_reservation_status(id_res):
    try:
        res = Reservation.query.get_or_404(id_res)
        data = request.json
        
        if 'status' in data:
            # "confirmed" -> True, autre -> False
            res.statut = (data['status'] == "confirmed")
            db.session.commit()
            return jsonify({"success": True}), 200
            
        return jsonify({"error": "Données manquantes"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# --- 4. MODIFIER LE COMMENTAIRE ---
@reservation_bp.route('/api/reservations/<int:id_res>/notes', methods=['PATCH'])
def update_reservation_notes(id_res):
    try:
        res = Reservation.query.get_or_404(id_res)
        data = request.json
        res.commentaireClient = data.get('notes', res.commentaireClient)
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# --- 5. ROUTE POUR RÉCUPÉRER UNIQUEMENT LES CLIENTS ---
@reservation_bp.route('/api/entreprise/clients', methods=['GET'])
def get_all_clients():
    try:
        # Récupère uniquement les clients (pas les gérants)
        clients = Utilisateur.query.options(
            joinedload(Utilisateur.reservations)
        ).filter(Utilisateur.estGerant == False).all()

        results = []
        for client in clients:
            nb_reservations = len(client.reservations)

            results.append({
                "id": client.idClient,
                "nom": client.nom,
                "prenom": client.prenom,
                "email": client.email,
                "telephone": client.telephone,
                "dateInscription": client.dateInscription.strftime('%d/%m/%Y'),
                "nbReservations": nb_reservations
            })

        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- 6. LISTER LES CRÉNEAUX DE L'ENTREPRISE ---
@reservation_bp.route('/api/entreprise/creneaux', methods=['GET'])
def get_creneaux():
    if "user_id" not in session:
        return jsonify({"error": "Non connecté"}), 401
    try:
        entreprise = Entreprise.query.filter_by(idGerant=session["user_id"]).first()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        creneaux = Creneau.query.filter_by(idPro=entreprise.idPro).all()

        results = []
        for c in creneaux:
            results.append({
                "id": c.idCreneau,
                "dateHeureDebut": c.dateHeureDebut.isoformat(),
                "dateHeureFin": c.dateHeureFin.isoformat(),
                "statut": c.statut,
                "nbMaxReservations": c.nbMaxReservations
            })

        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- 7. CRÉER UN CRÉNEAU ---
@reservation_bp.route('/api/entreprise/creneaux', methods=['POST'])
def create_creneau():
    if "user_id" not in session:
        return jsonify({"error": "Non connecté"}), 401
    try:
        entreprise = Entreprise.query.filter_by(idGerant=session["user_id"]).first()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        data = request.json
        debut = datetime.fromisoformat(data['dateHeureDebut'])
        fin = datetime.fromisoformat(data['dateHeureFin'])
        nb_max = data.get('nbMaxReservations', 1)

        creneau = Creneau(
            idPro=entreprise.idPro,
            dateHeureDebut=debut,
            dateHeureFin=fin,
            statut=True,
            nbMaxReservations=nb_max
        )
        db.session.add(creneau)
        db.session.commit()

        return jsonify({
            "id": creneau.idCreneau,
            "dateHeureDebut": creneau.dateHeureDebut.isoformat(),
            "dateHeureFin": creneau.dateHeureFin.isoformat(),
            "statut": creneau.statut,
            "nbMaxReservations": creneau.nbMaxReservations
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# --- 8. MODIFIER UN CRÉNEAU ---
@reservation_bp.route('/api/entreprise/creneaux/<int:id_creneau>', methods=['PUT'])
def update_creneau(id_creneau):
    if "user_id" not in session:
        return jsonify({"error": "Non connecté"}), 401
    try:
        entreprise = Entreprise.query.filter_by(idGerant=session["user_id"]).first()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        creneau = Creneau.query.get_or_404(id_creneau)
        if creneau.idPro != entreprise.idPro:
            return jsonify({"error": "Non autorisé"}), 403

        data = request.json
        if 'dateHeureDebut' in data:
            creneau.dateHeureDebut = datetime.fromisoformat(data['dateHeureDebut'])
        if 'dateHeureFin' in data:
            creneau.dateHeureFin = datetime.fromisoformat(data['dateHeureFin'])
        if 'statut' in data:
            creneau.statut = data['statut']
        if 'nbMaxReservations' in data:
            creneau.nbMaxReservations = data['nbMaxReservations']

        db.session.commit()

        return jsonify({
            "id": creneau.idCreneau,
            "dateHeureDebut": creneau.dateHeureDebut.isoformat(),
            "dateHeureFin": creneau.dateHeureFin.isoformat(),
            "statut": creneau.statut,
            "nbMaxReservations": creneau.nbMaxReservations
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# --- 9. SUPPRIMER UN CRÉNEAU ---
@reservation_bp.route('/api/entreprise/creneaux/<int:id_creneau>', methods=['DELETE'])
def delete_creneau(id_creneau):
    if "user_id" not in session:
        return jsonify({"error": "Non connecté"}), 401
    try:
        entreprise = Entreprise.query.filter_by(idGerant=session["user_id"]).first()
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