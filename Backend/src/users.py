from src.extension import db
from src.models import Utilisateur


def get_user(email):
    """Récupère un utilisateur par son email."""
    user = Utilisateur.query.filter_by(email=email).first() 
    return user

def get_user_by_id(user_id):
   """Récupère les infos d'un user par son id"""
   return Utilisateur.query.get(user_id)