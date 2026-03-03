# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
from src.extension import db
from src.models import Entreprise


admin_blueprint = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_blueprint.get("/health")
def admin_health():
    return jsonify({"status": "ok", "module": "admin"}), 200


@admin_blueprint.get("/entreprises")
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
