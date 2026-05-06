# -*- coding: utf-8 -*-
"""
Routes d'administration de la plateforme.

Accessibles uniquement aux utilisateurs ayant le rôle 'admin'.
Permettent la supervision et la modération des entreprises inscrites.
"""

from flask      import Blueprint, jsonify
from src.extension import db
from src.models import Entreprise
from src.utils.auth import admin_required

admin_blueprint = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_blueprint.get("/entreprises")
@admin_required
def get_all_entreprises():
    """
    Retourne la liste complète de toutes les entreprises avec leur statut.

    Returns:
        JSON: liste d'entreprises avec le flag estBloque du gérant, HTTP 200.
    """
    return jsonify([{
        "idPro":         e.idPro,
        "nomEntreprise": e.nomEntreprise,
        "nomSecteur":    e.nomSecteur,
        "idGerant":      e.idGerant,
        "slugPublic":    e.slugPublic,
        "adresse":       e.adresse,
        "codePostal":    e.codePostal,
        "ville":         e.ville,
        "pays":          e.pays,
        "estBloque":     e.gerant.estBloque if e.gerant else False,
    } for e in Entreprise.query.all()]), 200


@admin_blueprint.patch("/entreprises/<int:id_pro>/bloquer")
@admin_required
def block_entreprise_manager(id_pro):
    """
    Bloque le gérant d'une entreprise.

    Un gérant bloqué ne peut plus se connecter. Sa page publique
    renvoie une erreur 403 et ses réservations sont masquées côté client.

    Args (URL): id_pro – identifiant de l'entreprise.

    Returns:
        JSON: success, estBloque=True, HTTP 200.
    """
    entreprise = Entreprise.query.get_or_404(id_pro)
    if not entreprise.gerant:
        return jsonify({"error": "Gérant introuvable"}), 404

    entreprise.gerant.estBloque = True
    db.session.commit()
    return jsonify({"success": True, "message": "Utilisateur bloqué", "estBloque": True}), 200


@admin_blueprint.patch("/entreprises/<int:id_pro>/debloquer")
@admin_required
def unblock_entreprise_manager(id_pro):
    """
    Débloque le gérant d'une entreprise précédemment suspendu.

    Args (URL): id_pro – identifiant de l'entreprise.

    Returns:
        JSON: success, estBloque=False, HTTP 200.
    """
    entreprise = Entreprise.query.get_or_404(id_pro)
    if not entreprise.gerant:
        return jsonify({"error": "Gérant introuvable"}), 404

    entreprise.gerant.estBloque = False
    db.session.commit()
    return jsonify({"success": True, "message": "Utilisateur débloqué", "estBloque": False}), 200
