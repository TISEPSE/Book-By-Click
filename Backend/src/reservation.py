from flask import Blueprint, jsonify, request
from datetime import datetime
from extension import db
# Importation de tous les modèles nécessaires
from models import Reservation, Utilisateur, Prestation, Creneau, Entreprise, EventEmail
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