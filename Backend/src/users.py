from extension import db
from models import Utilisateur


def get_user(email):
    """
    Récupère un utilisateur par son email et retourne l'objet SQLAlchemy.
    """
    user = Utilisateur.query.filter_by(email=email).first()
    if user:
      print(40 * "-")
      print(user)                                                                                                                                               
      print(user.idClient)        # 2                                                                                                                    
      print(user.nom)             # "Dupont"                                                                                                             
      print(user.prenom)          # "Jean"                                                                                                               
      print(user.email)           # "exemple@mail.com"                                                                                                   
      print(user.telephone)       # "0612345678"                                                                                                         
      print(user.estGerant)       # True/False                                                                                                           
      print(user.dateNaissance)   # date object                                                                                                          
      print(user.dateInscription) # datetime object 
      print(40 * "-")
    return user