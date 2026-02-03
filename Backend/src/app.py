# -*- coding: utf-8 -*-
from flask import Flask, Blueprint
from dotenv import load_dotenv
from src.pages import pages_blueprint
from src.reservation import reservation_bp
import os
import secrets
from src.extension import db, cors
from flask_swagger_ui import get_swaggerui_blueprint

load_dotenv()

def create_app():
    app = Flask(__name__)
    # Générer une clé secrète par défaut si elle n'est pas définie dans les variables d'environnement
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", secrets.token_hex(32))
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "SQLALCHEMY_DATABASE_URI", 
        "postgresql://appuser:apppassword@localhost:5432/appdb"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Blueprints
    app.register_blueprint(pages_blueprint)
    app.register_blueprint(reservation_bp)

    # Extensions
    db.init_app(app)
    cors(app, supports_credentials=True)

    # Essayer de créer les tables
    try:
        with app.app_context():
            db.create_all()
            import seed
    except Exception as e:
        print(f"Avertissement: Impossible de se connecter a la base de donnees: {e}")
        print("Le serveur continuera sans connexion a la base de donnees.")

    # Swagger
    SWAGGER_URL = "/swagger"
    API_URL = "/static/swagger.json"  # place ton swagger.json ici : Backend/static/swagger.json
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={"app_name": "Book-By-Click API"}
    )
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
