from flask import Flask, Blueprint
from pages import pages_blueprint
import os
from extension import db, cors



def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI", "postgresql://appuser:apppassword@localhost:5432/appdb")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.register_blueprint(pages_blueprint)
    db.init_app(app)
    cors(app)

    # Essayer de créer les tables, mais continuer même si la DB n'est pas disponible
    try:
        with app.app_context():
            db.create_all()
            import seed
    except Exception as e:
        print(f"Avertissement: Impossible de se connecter à la base de données: {e}")
        print("Le serveur continuera sans connexion à la base de données.")


    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)