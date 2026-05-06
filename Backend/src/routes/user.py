# -*- coding: utf-8 -*-
"""
Routes de gestion du profil utilisateur.

Accessibles uniquement à l'utilisateur connecté.
Couvre la consultation et la mise à jour des informations personnelles,
le changement de mot de passe et la suppression du compte.
"""

from flask    import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash

from src.extension import db
from src.models    import Utilisateur, Entreprise, Reservation, Creneau, Prestation, Evenement, SemaineType, EventEmail
from src.utils.auth import login_required

user_bp = Blueprint('user', __name__)


@user_bp.route("/api/user", methods=["GET"])
@login_required
def get_user_info():
    """
    Retourne les informations du profil de l'utilisateur connecté.

    Returns:
        JSON: id, nom, prenom, email, telephone, dateNaissance, dateInscription.
        JSON: erreur, HTTP 404 si le compte est introuvable.
    """
    user = Utilisateur.query.get(session["user_id"])
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    return jsonify({
        "id":              user.idClient,
        "nom":             user.nom,
        "prenom":          user.prenom,
        "email":           user.email,
        "telephone":       user.telephone,
        "dateNaissance":   user.dateNaissance.isoformat() if user.dateNaissance else None,
        "dateInscription": user.dateInscription.isoformat() if user.dateInscription else None,
    })


@user_bp.route("/api/user", methods=["PATCH"])
@login_required
def update_user_info():
    """
    Met à jour les informations personnelles de l'utilisateur connecté.

    Vérifie l'unicité de l'email si celui-ci est modifié, afin d'éviter
    les doublons au niveau de la base de données.

    Corps JSON accepté : nom, prenom, email, telephone (tous optionnels)

    Returns:
        JSON: success, HTTP 200.
        JSON: erreur, HTTP 409 si l'email est déjà utilisé par un autre compte.
    """
    user = Utilisateur.query.get(session["user_id"])
    data = request.get_json() or {}

    if "nom"       in data: user.nom       = data["nom"].strip()
    if "prenom"    in data: user.prenom    = data["prenom"].strip()
    if "telephone" in data: user.telephone = data["telephone"].strip()
    if "email"     in data:
        new_email = data["email"].strip().lower()
        existing  = Utilisateur.query.filter_by(email=new_email).first()
        if existing and existing.idClient != user.idClient:
            return jsonify({"error": "Cet email est déjà utilisé"}), 409
        user.email = new_email

    db.session.commit()
    return jsonify({"success": True}), 200


@user_bp.route("/api/user/password", methods=["PATCH"])
@login_required
def change_password():
    """
    Modifie le mot de passe de l'utilisateur connecté.

    Exige la saisie du mot de passe actuel pour confirmer l'identité
    avant d'accepter le nouveau (protection contre les attaques de session).

    Corps JSON attendu : oldPassword, newPassword (min. 8 caractères)

    Returns:
        JSON: success, HTTP 200.
        JSON: erreur, HTTP 401 si l'ancien mot de passe est incorrect.
    """
    user = Utilisateur.query.get(session["user_id"])
    data = request.get_json() or {}

    old_password = data.get("oldPassword", "")
    new_password = data.get("newPassword", "")

    if not old_password or not new_password:
        return jsonify({"error": "Données manquantes"}), 400

    if not check_password_hash(user.motDePasseHash, old_password):
        return jsonify({"error": "Mot de passe actuel incorrect"}), 401

    if len(new_password) < 8:
        return jsonify({"error": "Le nouveau mot de passe doit faire au moins 8 caractères"}), 400

    user.motDePasseHash = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({"success": True}), 200


@user_bp.route("/api/user/delete", methods=["DELETE"])
@login_required
def delete_account():
    """
    Supprime définitivement le compte de l'utilisateur connecté et toutes ses données.

    Pour un gérant, supprime en cascade : entreprises, créneaux, prestations,
    événements, semaines type et réservations associées.
    Pour un client, supprime uniquement ses réservations et logs email.

    L'opération est irréversible. La session est invalidée à la fin.

    Returns:
        JSON: success, HTTP 200.
        JSON: erreur, HTTP 500 en cas d'échec transactionnel.
    """
    user = Utilisateur.query.get(session["user_id"])
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    try:
        if user.estGerant:
            for entreprise in user.entreprises:
                for reservation in entreprise.reservations:
                    EventEmail.query.filter_by(idReservation=reservation.idReservation).delete()
                Reservation.query.filter_by(idPro=entreprise.idPro).delete()
                Creneau.query.filter_by(idPro=entreprise.idPro).delete()
                Prestation.query.filter_by(idPro=entreprise.idPro).delete()
                Evenement.query.filter_by(idPro=entreprise.idPro).delete()
                SemaineType.query.filter_by(idPro=entreprise.idPro).delete()
                db.session.delete(entreprise)

        for reservation in user.reservations:
            EventEmail.query.filter_by(idReservation=reservation.idReservation).delete()
        Reservation.query.filter_by(idClient=user.idClient).delete()

        db.session.delete(user)
        db.session.commit()
        session.clear()
        return jsonify({"success": True, "message": "Compte supprimé"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
