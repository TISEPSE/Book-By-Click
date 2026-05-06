# -*- coding: utf-8 -*-
"""
Route du formulaire de contact.

Accessible sans authentification : permet à tout visiteur d'envoyer
un message à l'équipe Book By Click.
"""

from flask    import Blueprint, request, jsonify
from src.mailer import send_contact_email

contact_bp = Blueprint('contact', __name__)


@contact_bp.route("/contact", methods=["POST"])
def contact():
    """
    Transfère le message du formulaire de contact par email.

    Corps JSON attendu :
        name, email, subject, message (obligatoires), phone (optionnel)

    Returns:
        JSON: success, HTTP 200.
        JSON: erreur, HTTP 400 si un champ obligatoire est manquant.
        JSON: erreur, HTTP 500 si l'envoi email échoue.
    """
    data    = request.json
    name    = data.get("name")
    email   = data.get("email")
    subject = data.get("subject", "").strip()
    message = data.get("message")

    if not name or not email or not subject or not message:
        return jsonify({"success": False, "error": "Tous les champs obligatoires sont requis"}), 400

    if send_contact_email(name, email, data.get("phone"), message, subject):
        return jsonify({"success": True, "message": "Message envoyé avec succès !"}), 200

    return jsonify({"success": False, "error": "Erreur lors de l'envoi du message"}), 500
