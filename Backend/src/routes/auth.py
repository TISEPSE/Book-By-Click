# -*- coding: utf-8 -*-
"""
Routes d'authentification et de gestion des comptes.

Couvre l'inscription (client et professionnel), la connexion,
la déconnexion, la vérification de session et la réinitialisation
du mot de passe par email.

Toutes les routes sont publiques à l'exception de /logout,
qui nécessite une session active.
"""

import secrets
from datetime import datetime, timedelta
from flask    import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash

from src.extension import db
from src.models    import Utilisateur, TypeUtilisateur, Entreprise
from src.mailer    import send_reset_password_email
from src.users     import get_user
from src.utils.auth import login_required

auth_bp = Blueprint('auth', __name__)


@auth_bp.route("/api/register/user", methods=["POST"])
def register_user():
    """
    Crée un compte client.

    Le rôle 'client' est récupéré depuis TypeUtilisateur afin de ne pas
    coder en dur l'identifiant du type, qui peut varier selon l'environnement.

    Corps JSON attendu :
        email, password, nom, prenom, dateNaissance (ISO), telephone

    Returns:
        JSON: id du compte créé, HTTP 200.
    """
    data       = request.get_json()
    type_client = TypeUtilisateur.query.filter_by(role="client").first()

    user = Utilisateur(
        nom=data.get("nom"),
        prenom=data.get("prenom"),
        dateNaissance=datetime.fromisoformat(data.get("dateNaissance")).date(),
        email=data.get("email"),
        motDePasseHash=generate_password_hash(data.get("password")),
        telephone=data.get("telephone"),
        dateInscription=datetime.now(),
        idTypeUtilisateur=type_client.idType,
        estGerant=False,
        estBloque=False,
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Compte créé", "id": user.idClient})


@auth_bp.route("/api/register/pro", methods=["POST"])
def register_pro():
    """
    Crée simultanément un compte professionnel et son entreprise associée.

    L'opération est atomique : si la création de l'entreprise échoue,
    le compte utilisateur est également annulé (rollback implicite).

    Corps JSON attendu :
        email, password, nom, prenom, dateNaissance, telephone,
        companyName, sector, slug, address, postalCode, city, country

    Returns:
        JSON: idClient et idPro créés, HTTP 200.
        JSON: erreur avec liste des champs manquants, HTTP 400.
    """
    data     = request.get_json()
    required = [
        "email", "password", "nom", "prenom", "dateNaissance", "telephone",
        "companyName", "sector", "slug", "address", "postalCode", "city", "country"
    ]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Champs manquants : {', '.join(missing)}"}), 400

    try:
        dob = datetime.fromisoformat(data.get("dateNaissance")).date()
    except (ValueError, TypeError):
        return jsonify({"error": "Format de date invalide (YYYY-MM-DD requis)"}), 400

    type_pro = TypeUtilisateur.query.filter_by(role="pro").first()
    user = Utilisateur(
        nom=data.get("nom"),
        prenom=data.get("prenom"),
        dateNaissance=dob,
        email=data.get("email"),
        motDePasseHash=generate_password_hash(data.get("password")),
        telephone=data.get("telephone"),
        dateInscription=datetime.now(),
        idTypeUtilisateur=type_pro.idType,
        estGerant=True,
        estBloque=False,
    )
    db.session.add(user)
    db.session.commit()

    entreprise = Entreprise(
        nomEntreprise=data.get("companyName"),
        nomSecteur=data.get("sector"),
        idGerant=user.idClient,
        slugPublic=data.get("slug"),
        adresse=data.get("address"),
        codePostal=data.get("postalCode"),
        ville=data.get("city"),
        pays=data.get("country"),
    )
    db.session.add(entreprise)
    db.session.commit()
    return jsonify({"message": "Compte professionnel créé", "idClient": user.idClient, "idPro": entreprise.idPro})


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authentifie un utilisateur et crée une session serveur.

    La réponse inclut le rôle et les flags estGerant/isAdmin afin que
    le frontend puisse rediriger vers le bon tableau de bord sans
    appel supplémentaire.

    Corps form-data attendu : email, password

    Returns:
        JSON: success, estGerant, role, isAdmin, HTTP 200.
        JSON: erreur, HTTP 401 (identifiants incorrects) ou 403 (bloqué).
    """
    user = get_user(request.form.get("email"))

    if not user or not check_password_hash(user.motDePasseHash, request.form.get("password", "")):
        return jsonify({"error": "Identifiant ou mot de passe incorrect"}), 401

    if user.estBloque:
        return jsonify({"error": "Compte bloqué. Contactez un administrateur."}), 403

    session["user_id"] = user.idClient
    role = user.type.role if user.type else None

    return jsonify({
        "success":   True,
        "message":   "Connexion réussie",
        "estGerant": user.estGerant,
        "role":      role,
        "isAdmin":   role == "admin",
    }), 200


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    """
    Invalide la session courante.

    Returns:
        JSON: success, HTTP 200.
    """
    session.clear()
    return jsonify({"success": True, "message": "Déconnexion réussie"}), 200


@auth_bp.route("/api/session", methods=["GET"])
def get_session():
    """
    Vérifie si une session active existe et retourne les informations associées.

    Utilisé par le frontend au chargement pour déterminer l'état d'authentification
    sans demander à l'utilisateur de se reconnecter.

    Returns:
        JSON: user_id, estGerant, role, isAdmin, HTTP 200.
        JSON: erreur, HTTP 401 ou 403.
    """
    if "user_id" in session:
        user = Utilisateur.query.get(session["user_id"])
        if user:
            if user.estBloque:
                session.clear()
                return jsonify({"error": "Compte bloqué"}), 403
            role = user.type.role if user.type else None
            return jsonify({
                "user_id":   session["user_id"],
                "estGerant": user.estGerant,
                "role":      role,
                "isAdmin":   role == "admin",
            })
    return jsonify({"error": "Non connecté"}), 401


@auth_bp.route("/forgot_password", methods=["POST"])
def forgot_password():
    """
    Génère un token de réinitialisation et envoie le lien par email.

    La réponse est intentionnellement identique que l'email existe ou non,
    afin d'éviter l'énumération des comptes (user enumeration attack).

    Corps JSON attendu : email

    Returns:
        JSON: message de confirmation générique, HTTP 200.
    """
    email = (request.get_json() or {}).get("email", "").strip().lower()
    if not email:
        return jsonify({"error": "Email requis"}), 400

    user = get_user(email)
    if user:
        token  = secrets.token_urlsafe(32)
        user.resetToken       = token
        user.resetTokenExpiry = datetime.now() + timedelta(hours=1)
        db.session.commit()
        send_reset_password_email(user.email, f"http://localhost:5173/reset_password?token={token}")

    return jsonify({"success": True, "message": "Si ce compte existe, un email a été envoyé."}), 200


@auth_bp.route("/reset_password", methods=["POST"])
def reset_password():
    """
    Réinitialise le mot de passe via un token valide.

    Le token est invalidé immédiatement après utilisation pour interdire
    toute réutilisation, même dans le délai d'une heure.

    Corps JSON attendu : token, password (min. 8 caractères)

    Returns:
        JSON: success, HTTP 200.
        JSON: erreur, HTTP 400 (token invalide ou expiré).
    """
    data         = request.get_json() or {}
    token        = data.get("token", "").strip()
    new_password = data.get("password", "")

    if not token or not new_password:
        return jsonify({"error": "Données manquantes"}), 400
    if len(new_password) < 8:
        return jsonify({"error": "Le mot de passe doit faire au moins 8 caractères"}), 400

    user = Utilisateur.query.filter_by(resetToken=token).first()
    if not user or not user.resetTokenExpiry or user.resetTokenExpiry < datetime.now():
        return jsonify({"error": "Lien invalide ou expiré"}), 400

    user.motDePasseHash   = generate_password_hash(new_password)
    user.resetToken       = None  # Invalidation immédiate du token
    user.resetTokenExpiry = None
    db.session.commit()
    return jsonify({"success": True, "message": "Mot de passe réinitialisé."}), 200
