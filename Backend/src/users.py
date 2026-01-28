from extension import db
from models import Utilisateur


def get_user(email):
    """
    Récupère un utilisateur par son email.
    """
    return Utilisateur.query.filter_by(email=email).first()
