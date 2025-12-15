from flask import Blueprint, request, jsonify
from extension import cors, db
from models import db, Utilisateur, TypeUtilisateur, Entreprise, Creneau, Prestation, Reservation, EventEmail, Evenement, SemaineType
from mailer import send_contact_email


pages_blueprint = Blueprint("pages", __name__)


# récupérer les informations du formulaire quand il POST sur l'endpoint /register_form
@pages_blueprint.route("/register_form", methods=["POST"])
def register_form():
    email = request.form.get("email")
    password = request.form.get("password")
    nom = request.form.get("nom")
    print(
        f"La page de Register à récupérer => Nom: {nom} Email: {email}, Password: {password}",
        flush=True,
    )
    return "OK"


# -------------------------------------------
# 1) LOGIN : renvoie un JSON propre
# -------------------------------------------
@pages_blueprint.route("/login_form", methods=["POST"])
def login_form():
    email = request.form.get("email")
    password = request.form.get("password")

    print(f"[LOGIN] Email: {email}  Password: {password}", flush=True)
    return jsonify({"email": email, "password": password})


@pages_blueprint.route("/teste", methods=["POST"])
def recap():
    username = request.form.get("username")
    user = Utilisateur.query.filter(Utilisateur.nom == username).first()
    return jsonify({"id": user.idClient,"nom":user.nom,"prenom":user.prenom,"dateNaissance":user.dateNaissance,"email":user.email,"motDePasseHash":user.motDePasseHash,"telephone":user.telephone} )


# -------------------------------------------
# 2) CONTACT : envoie un email
# -------------------------------------------
@pages_blueprint.route("/contact", methods=["POST"])
def contact():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    message = data.get("message")

    
    if not name or not email or not message:
        return jsonify({"success": False, "error": "Tous les champs sont requis"}), 400

   
    success = send_contact_email(name, email, phone, message)

    if success:
        return jsonify({"success": True, "message": "Votre message a été envoyé avec succès !"}), 200
    else:
        return jsonify({"success": False, "error": "Erreur lors de l'envoi du message"}), 500


# -------------------------------------------
# 3) LANCEMENT
# -------------------------------------------
if __name__ == "__main__":
    app = create_app()
    app.run(port=5000)
