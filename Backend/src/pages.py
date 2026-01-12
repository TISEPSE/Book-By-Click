from flask import Blueprint, request, jsonify
from extension import cors, db
from models import db, Utilisateur, TypeUtilisateur, Entreprise, Creneau, Prestation, Reservation, EventEmail, Evenement, SemaineType
from mailer import send_contact_email
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os
from datetime import datetime

pages_blueprint = Blueprint("pages", __name__)



@pages_blueprint.route("/api/register/user", methods=["POST"])
def register_form_user():
    '''récupérer les informations du formulaire quand il POST sur l'endpoint /api/register/user'''
    email = request.form.get("email")
    password = generate_password_hash(request.form.get("password")) 
    nom = request.form.get("nom")
    prenom = request.form.get("prenom")
    dateNaissance = request.form.get("birthDate")
    telephone = request.form.get("phone")
    
    client = TypeUtilisateur.query.filter(TypeUtilisateur.role=="client").first()
    id_type_client = client.idType

    u1 = Utilisateur(
        nom=nom,
        prenom=prenom,
        dateNaissance=dateNaissance,
        email=email,
        motDePasseHash=password,
        telephone=telephone,
        dateInscription=datetime.now(),
        idTypeUtilisateur=id_type_client
    )
    db.session.add(u1)
    db.session.commit()

    return jsonify({"message":"utilisateur ajouté","id":u1.idClient})


@pages_blueprint.route("/api/register/pro", methods=["POST"])
def register_form_pro():
    '''récupérer les informations du formulaire quand il POST sur l'endpoint /api/register/pro'''
    email = request.form.get("email")
    password = generate_password_hash(request.form.get("password"))
    nom = request.form.get("nom")
    prenom = request.form.get("prenom")
    dateNaissance = request.form.get("birthDate")
    telephone = request.form.get("phone") 

    pro = TypeUtilisateur.query.filter(TypeUtilisateur.role=="pro").first()
    id_type_pro = pro.idType

    u1 = Utilisateur(
        nom=nom,
        prenom=prenom,
        dateNaissance=dateNaissance,
        email=email,
        motDePasseHash=password,
        telephone=telephone,
        dateInscription=datetime.now(),
        idTypeUtilisateur=id_type_pro
    )

    try:
        db.session.add(u1)
        db.session.commit()
    except:
        return jsonify({"error":"Error adding user"}), 500
    
    nomEntreprise = request.form.get("nomEntreprise")
    nomSecteur = request.form.get("nomSecteur")
    slugPublic = request.form.get("slug")
    adresse = request.form.get("adresse")
    codePostal = request.form.get("codePostal")
    ville = request.form.get("ville")
    pays = request.form.get("pays")

    e1 = Entreprise(
        nomEntreprise=nomEntreprise,
        nomSecteur=nomSecteur,
        idGerant=u1.idClient,
        slugPublic=slugPublic,
        adresse=adresse,
        codePostal=codePostal,
        ville=ville,
        pays=pays
    )

    try:
        db.session.add(e1)
        db.session.commit()
    except:
        return jsonify({"error":"Error adding entreprise"}), 500

    return jsonify({"message":"utilisateur et entreprise ajoutés","idClient":u1.idClient, "idPro":e1.idPro})

# -------------------------------------------
# 3) LOGIN
# -------------------------------------------
@pages_blueprint.route("/login_form", methods=["POST"])
def login_form():
    email = request.form.get("email")
    password = request.form.get("password")
    print(f"[LOGIN] Email: {email}  Password: {password}", flush=True)
    return jsonify({"email": email, "password": password})

# -------------------------------------------
# 4) GET USER INFO
# -------------------------------------------
@pages_blueprint.route("/teste", methods=["POST"])
def recap():
    username = request.form.get("username")
    user = Utilisateur.query.filter(Utilisateur.nom == username).first()
    if not user:
        return jsonify({"error":"Utilisateur non trouvé"}), 404
    return jsonify({
        "id": user.idClient,
        "nom": user.nom,
        "prenom": user.prenom,
        "dateNaissance": user.dateNaissance,
        "email": user.email,
        "motDePasseHash": user.motDePasseHash,
        "telephone": user.telephone
    })

# -------------------------------------------
# 5) CONTACT
# -------------------------------------------
@pages_blueprint.route("/contact", methods=["POST"])
def contact():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"success": False, "error": "Tous les champs sont requis"}), 400

    success = send_contact_email(name, email, phone, message)

    if success:
        return jsonify({"success": True, "message": "Votre message a été envoyé avec succès !"}), 200
    else:
        return jsonify({"success": False, "error": "Erreur lors de l'envoi du message"}), 500

# -------------------------------------------
# 6) AUTOCOMPLETE SERVICES
# -------------------------------------------
@pages_blueprint.route("/api/services", methods=["GET"])
def get_services():
    try:
        data_dir = os.path.join(os.path.dirname(__file__), 'data')
        services_file = os.path.join(data_dir, 'services.json')
        with open(services_file, 'r', encoding='utf-8') as f:
            services = json.load(f)

        query = request.args.get('q', '').lower()
        if query:
            filtered = [s for s in services if query in s.lower()]
            return jsonify(filtered[:20])
        return jsonify(services)
    except Exception as e:
        print(f"Erreur lors du chargement des services: {e}")
        return jsonify([]), 500

# -------------------------------------------
# 7) AUTOCOMPLETE VILLES
# -------------------------------------------
_villes_cache = None
def load_villes_cache():
    global _villes_cache
    if _villes_cache is None:
        try:
            data_dir = os.path.join(os.path.dirname(__file__), 'data')
            communes_file = os.path.join(data_dir, 'communes-france-avec-polygon-2025.json')
            with open(communes_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            _villes_cache = [commune.get('nom_standard', '') for commune in data.get('data', [])]
            print(f"Cache des villes chargé : {len(_villes_cache)} communes")
        except Exception as e:
            print(f"Erreur lors du chargement du cache des villes: {e}")
            _villes_cache = []
    return _villes_cache

@pages_blueprint.route("/api/villes", methods=["GET"])
def get_villes():
    try:
        villes_cache = load_villes_cache()
        query = request.args.get('q', '').lower()
        if not query:
            return jsonify(villes_cache[:100])
        filtered = [v for v in villes_cache if v.lower().startswith(query)]
        return jsonify(filtered[:15])
    except Exception as e:
        print(f"Erreur lors de la recherche des villes: {e}")
        return jsonify([]), 500

# -------------------------------------------
# 8) LANCEMENT DIRECT (test/debug)
# -------------------------------------------
if __name__ == "__main__":
    from app import create_app
    app = create_app()
    app.run(port=5000)
