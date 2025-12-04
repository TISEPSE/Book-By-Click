from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from models import db



def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI", "postgresql://appuser:apppassword@localhost:5432/appdb")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from models import Entreprise, Evenement, SemaineType, Utilisateur, TypeUtilisateur, EventEmail, Creneau, Prestation, Reservation

    with app.app_context():
        db.create_all()

    # récupérer les informations du formulaire quand il POST sur l'endpoint /register_form
    @app.route("/register_form", methods=["POST"])
    def register_form():
        email = request.form.get("email")
        password = request.form.get("password")
        nom = request.form.get("nom")
        print(f"La page de Register à récupérer => Nom: {nom} Email: {email}, Password: {password}", flush=True)
        return "OK"

    # -------------------------------------------
    # 1) LOGIN : renvoie un JSON propre
    # -------------------------------------------
    @app.route("/login_form", methods=["POST"])
    def login_form():
        email    = request.form.get("email")
        password = request.form.get("password")

        print(f"[LOGIN] Email: {email}  Password: {password}", flush=True)
        return jsonify({"email": email, "password": password})


    return app

# -------------------------------------------
# 2) LANCEMENT
# -------------------------------------------
if __name__ == "__main__":
    app = create_app()
    app.run(port=5000)