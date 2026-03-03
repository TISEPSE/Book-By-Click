# -*- coding: utf-8 -*-
from functools import wraps
from flask import Blueprint, jsonify, session
from src.extension import db
from src.models import Entreprise, Utilisateur


admin_blueprint = Blueprint("admin", __name__, url_prefix="/api/admin")


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error": "Connexion requise"}), 401

        user = Utilisateur.query.get(user_id)
        if not user:
            session.clear()
            return jsonify({"error": "Non connecté"}), 401

        if user.estBloque:
            session.clear()
            return jsonify({"error": "Compte bloqué"}), 403

        if not user.type or user.type.role != "admin":
            return jsonify({"error": "Accès administrateur requis"}), 403

        return f(*args, **kwargs)
    return decorated_function


@admin_blueprint.get("/health")
@admin_required
def admin_health():
    return jsonify({"status": "ok", "module": "admin"}), 200


@admin_blueprint.get("/entreprises")
@admin_required
def get_all_entreprises():
    entreprises = Entreprise.query.all()

    return jsonify([
        {
            "idPro": entreprise.idPro,
            "nomEntreprise": entreprise.nomEntreprise,
            "nomSecteur": entreprise.nomSecteur,
            "idGerant": entreprise.idGerant,
            "slugPublic": entreprise.slugPublic,
            "adresse": entreprise.adresse,
            "codePostal": entreprise.codePostal,
            "ville": entreprise.ville,
            "pays": entreprise.pays,
            "estBloque": entreprise.gerant.estBloque if entreprise.gerant else False,
        }
        for entreprise in entreprises
    ]), 200


@admin_blueprint.patch("/entreprises/<int:id_pro>/bloquer")
@admin_required
def block_entreprise_manager(id_pro):
    entreprise = Entreprise.query.get_or_404(id_pro)

    if not entreprise.gerant:
        return jsonify({"error": "Gérant introuvable"}), 404

    entreprise.gerant.estBloque = True
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Utilisateur bloqué",
        "idPro": entreprise.idPro,
        "idGerant": entreprise.idGerant,
        "estBloque": entreprise.gerant.estBloque,
    }), 200
