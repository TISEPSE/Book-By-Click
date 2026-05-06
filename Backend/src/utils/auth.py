# -*- coding: utf-8 -*-
"""
Décorateurs d'authentification et utilitaires de session.

Ce module centralise la logique de contrôle d'accès afin qu'elle ne soit
définie qu'en un seul endroit et réutilisée par tous les blueprints.
"""

from functools import wraps
from flask     import jsonify, session
from src.models import Utilisateur, Entreprise


def login_required(f):
    """
    Décorateur qui protège une route en exigeant une session active.

    Vérifie successivement :
    - La présence d'un user_id en session.
    - L'existence du compte correspondant en base.
    - Que le compte n'est pas bloqué par un administrateur.

    En cas d'échec, la session est invalidée et une réponse 401 ou 403
    est renvoyée avant d'appeler la fonction décorée.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
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

        return f(*args, **kwargs)
    return decorated


def admin_required(f):
    """
    Décorateur qui restreint l'accès aux utilisateurs ayant le rôle 'admin'.

    Applique les mêmes vérifications que login_required, puis contrôle
    en plus que le rôle du compte est bien 'admin'.

    Retourne 403 si l'utilisateur est authentifié mais non administrateur.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
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
    return decorated


def get_pro_entreprise():
    """
    Retourne l'entreprise associée au gérant actuellement connecté.

    Utilisé dans toutes les routes du tableau de bord professionnel pour
    s'assurer qu'un gérant n'accède qu'aux données de sa propre entreprise.

    Returns:
        Entreprise | None: L'entreprise du gérant, ou None si introuvable.
    """
    user_id = session.get("user_id")
    if not user_id:
        return None
    return Entreprise.query.filter_by(idGerant=user_id).first()
