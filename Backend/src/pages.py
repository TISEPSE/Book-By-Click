from flask import Blueprint, request, jsonify, session, redirect, url_for
from extension import cors, db
from models import db, Utilisateur, TypeUtilisateur, Entreprise, Creneau, Prestation, Reservation, EventEmail, Evenement, SemaineType


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
    if user != None:
        session["data_user"] ={"id": user.idClient,"nom":user.nom,"prenom":user.prenom,"dateNaissance":user.dateNaissance,"email":user.email,"motDePasseHash":user.motDePasseHash,"telephone":user.telephone} 
    else:
        session["data_user"] = {"erreur":"Non valide"}
    return redirect(url_for("pages.data_user"))

@pages_blueprint.route("/data_user")
def data_user():
    data = session.get("data_user")
    return jsonify(data)


# -------------------------------------------
# 2) LANCEMENT
# -------------------------------------------
if __name__ == "__main__":
    app = create_app()
    app.run(port=5000)
