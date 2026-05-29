# -*- coding: utf-8 -*-
"""
Routes de gestion de la semaine type et de la génération automatique de créneaux.

La semaine type définit le modèle de disponibilité hebdomadaire d'une entreprise :
jours ouverts (joursPattern) et plage horaire (heureDebut / heureFin).

La route de génération applique ce modèle sur une période donnée pour
créer automatiquement tous les créneaux correspondants, en sautant
ceux qui existent déjà (idempotence).
"""

from flask      import Blueprint, jsonify, request
from datetime   import datetime, date as date_type, timedelta
from src.extension import db
from src.models import SemaineType, Creneau
from src.utils.auth import login_required, get_pro_entreprise

semainetype_bp = Blueprint('semainetype', __name__)


def _st_to_dict(st):
    """
    Sérialise une SemaineType en dictionnaire JSON.

    Args:
        st (SemaineType): Instance de semaine type.

    Returns:
        dict: Représentation JSON incluant les valeurs par défaut si null.
    """
    return {
        "id":           st.idSemaineType,
        "libelle":      st.libelle      or "",
        "description":  st.description  or "",
        "joursPattern": st.joursPattern or "1111100",
        "heureDebut":   st.heureDebut   or "09:00",
        "heureFin":     st.heureFin     or "18:00",
    }


@semainetype_bp.route('/api/entreprise/semainetype', methods=['GET'])
@login_required
def get_semaine_type():
    """
    Retourne la semaine type de l'entreprise connectée.

    Si aucune semaine type n'existe encore, une entrée par défaut
    (lundi–vendredi, 09h00–18h00) est créée automatiquement.

    Returns:
        JSON: semaine type, HTTP 200.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        st = SemaineType.query.filter_by(idPro=entreprise.idPro).first()
        if not st:
            st = SemaineType(
                idPro=entreprise.idPro,
                libelle="Semaine standard",
                description="",
                joursPattern="1111100",
                heureDebut="09:00",
                heureFin="18:00",
            )
            db.session.add(st)
            db.session.commit()

        return jsonify(_st_to_dict(st)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@semainetype_bp.route('/api/entreprise/semainetype', methods=['PUT'])
@login_required
def update_semaine_type():
    """
    Met à jour la semaine type de l'entreprise connectée.

    La validation du joursPattern garantit qu'il s'agit d'une chaîne de
    exactement 7 caractères '0' ou '1', correspondant aux 7 jours de la
    semaine de lundi (index 0) à dimanche (index 6).

    Corps JSON accepté :
        libelle, description, joursPattern, heureDebut, heureFin

    Returns:
        JSON: semaine type mise à jour, HTTP 200.
        JSON: erreur, HTTP 400 si joursPattern invalide.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        st = SemaineType.query.filter_by(idPro=entreprise.idPro).first()
        if not st:
            st = SemaineType(idPro=entreprise.idPro)
            db.session.add(st)

        data = request.json
        if "libelle"      in data: st.libelle     = data["libelle"]
        if "description"  in data: st.description = data["description"]
        if "heureDebut"   in data: st.heureDebut  = data["heureDebut"]
        if "heureFin"     in data: st.heureFin    = data["heureFin"]
        if "joursPattern" in data:
            pattern = data["joursPattern"]
            if len(pattern) != 7 or not all(c in "01" for c in pattern):
                return jsonify({"error": "joursPattern invalide (7 caractères '0'/'1' requis)"}), 400
            st.joursPattern = pattern

        db.session.commit()
        return jsonify(_st_to_dict(st)), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@semainetype_bp.route('/api/entreprise/semainetype/generer', methods=['POST'])
@login_required
def generer_creneaux():
    """
    Génère automatiquement des créneaux horaires sur une période donnée.

    Applique le modèle de la semaine type : pour chaque jour ouvert dans
    la plage dateDebut–dateFin, crée un créneau par heure entre heureDebut
    et heureFin. Les créneaux déjà existants sont ignorés (idempotence).

    Corps JSON attendu :
        dateDebut (YYYY-MM-DD), dateFin (YYYY-MM-DD),
        nbMaxReservations (int, optionnel, défaut 1)

    Contraintes :
        - La période ne peut pas dépasser 365 jours.
        - heureFin doit être strictement après heureDebut.

    Returns:
        JSON: success, created, skipped, HTTP 201.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        st = SemaineType.query.filter_by(idPro=entreprise.idPro).first()
        if not st:
            return jsonify({"error": "Aucune semaine type configurée"}), 404

        data = request.json
        try:
            d_debut = date_type.fromisoformat(data["dateDebut"])
            d_fin   = date_type.fromisoformat(data["dateFin"])
        except (KeyError, ValueError):
            return jsonify({"error": "Dates invalides (format YYYY-MM-DD requis)"}), 400

        if d_fin < d_debut:
            return jsonify({"error": "La date de fin doit être après la date de début"}), 400
        if (d_fin - d_debut).days > 365:
            return jsonify({"error": "Période trop longue (maximum 365 jours)"}), 400

        pattern = st.joursPattern or "1111100"
        try:
            h_debut = int(st.heureDebut.split(":")[0])
            h_fin   = int(st.heureFin.split(":")[0])
        except (AttributeError, ValueError):
            h_debut, h_fin = 9, 18

        if h_fin <= h_debut:
            return jsonify({"error": "L'heure de fin doit être après l'heure de début"}), 400

        nb_max  = int(data.get("nbMaxReservations", 1))
        created = 0
        skipped = 0
        current = d_debut

        while current <= d_fin:
            # weekday() retourne 0=lundi … 6=dimanche, cohérent avec joursPattern
            if pattern[current.weekday()] == "1":
                for hour in range(h_debut, h_fin):
                    slot_debut = datetime.combine(current, datetime.min.time().replace(hour=hour))
                    slot_fin   = datetime.combine(current, datetime.min.time().replace(hour=hour + 1))

                    # Vérification d'existence pour éviter les doublons
                    if Creneau.query.filter_by(idPro=entreprise.idPro, dateHeureDebut=slot_debut).first():
                        skipped += 1
                    else:
                        db.session.add(Creneau(
                            idPro=entreprise.idPro,
                            dateHeureDebut=slot_debut,
                            dateHeureFin=slot_fin,
                            statut=True,
                            nbMaxReservations=nb_max,
                        ))
                        created += 1
            current += timedelta(days=1)

        db.session.commit()
        return jsonify({"success": True, "created": created, "skipped": skipped}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
