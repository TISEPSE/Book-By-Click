# -*- coding: utf-8 -*-
"""
Fabrique d'application Flask (Application Factory Pattern).

L'utilisation d'une fonction create_app() permet d'instancier plusieurs
configurations de l'application (test, développement, production) sans
modifier le code source, et évite les imports circulaires en retardant
l'association des extensions à l'instance Flask.
"""

import os
import time
import secrets
from pathlib import Path
from flask import Flask
from dotenv import load_dotenv

from src.extension       import db, cors, migrate
from src.routes.auth     import auth_bp
from src.routes.user     import user_bp
from src.routes.contact  import contact_bp
from src.routes.static_data  import static_bp
from src.routes.entreprise   import entreprise_blueprint
from src.routes.admin        import admin_blueprint
from src.routes.reservations import reservations_bp
from src.routes.creneaux     import creneaux_bp
from src.routes.evenements   import evenements_bp
from src.routes.semainetype  import semainetype_bp
from src.routes.statistiques import statistiques_bp
from src.routes.clients      import clients_bp
from flask_swagger_ui import get_swaggerui_blueprint

# Chargement des variables d'environnement depuis la racine du projet
load_dotenv(Path(__file__).resolve().parent.parent.parent / '.env')


def create_app():
    """
    Crée et configure l'instance Flask.

    Enregistre les extensions, les blueprints et initialise la base de données
    avec une logique de retry pour absorber le délai de démarrage du container
    PostgreSQL en environnement Docker.

    Returns:
        Flask: L'instance de l'application configurée et prête à servir.
    """
    app = Flask(__name__)

    # --- Configuration ---
    app.config["SECRET_KEY"]                  = os.getenv("SECRET_KEY", secrets.token_hex(32))
    app.config["SQLALCHEMY_DATABASE_URI"]     = os.getenv(
        "SQLALCHEMY_DATABASE_URI",
        "postgresql://appuser:apppassword@localhost:5432/appdb"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    # SameSite=Lax autorise l'envoi du cookie de session lors des requêtes cross-site
    # initiées par navigation (liens), tout en bloquant les requêtes de tiers (CSRF).
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"]   = False  # Passer à True en production (HTTPS)

    # --- Extensions ---
    db.init_app(app)
    migrate.init_app(app, db)
    cors(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:3000"])

    # --- Blueprints ---
    # Chaque blueprint encapsule un domaine fonctionnel distinct de l'API.
    for bp in [
        auth_bp, user_bp, contact_bp, static_bp,
        entreprise_blueprint, admin_blueprint,
        reservations_bp, creneaux_bp, evenements_bp,
        semainetype_bp, statistiques_bp, clients_bp,
    ]:
        app.register_blueprint(bp)

    # Interface Swagger disponible sur /swagger pour l'exploration de l'API
    app.register_blueprint(
        get_swaggerui_blueprint(
            "/swagger", "/static/swagger.json",
            config={"app_name": "Book-By-Click API"}
        ),
        url_prefix="/swagger"
    )

    # --- Initialisation de la base de données ---
    # Retry nécessaire : PostgreSQL peut mettre quelques secondes à accepter
    # des connexions après le démarrage du container Docker.
    max_attempts = 10
    for attempt in range(1, max_attempts + 1):
        try:
            with app.app_context():
                db.create_all()  # Crée les tables absentes sans écraser l'existant
                from src.seed import run_seed
                run_seed()
            break
        except Exception as e:
            if attempt == max_attempts:
                print(f"Avertissement : DB inaccessible après {max_attempts} tentatives : {e}")
            else:
                print(f"Connexion DB échouée (tentative {attempt}/{max_attempts}) : {e}")
                time.sleep(2)

    return app


if __name__ == "__main__":
    create_app().run(debug=True, port=5000)
