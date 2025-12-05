from flask import Flask, Blueprint
from src.pages import pages_blueprint
import os
from extension import db, cors



def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI", "postgresql://appuser:apppassword@localhost:5432/appdb")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.register_blueprint(pages_blueprint)
    db.init_app(app)
    cors(app)

    with app.app_context():
        db.create_all()
        import seed


    return app