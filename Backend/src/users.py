from src.extension import db
from src.models import Utilisateur


def get_user(email):
    """
    Récupère un utilisateur par son email et retourne l'objet SQLAlchemy.
    """
    return Utilisateur.query.filter_by(email=email).first()