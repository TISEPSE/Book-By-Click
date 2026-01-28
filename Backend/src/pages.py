# -*- coding: utf-8 -*-
from flask import Blueprint, request, jsonify
from extension import cors, db
from models import Utilisateur, TypeUtilisateur, Entreprise, Creneau, Prestation, Reservation, EventEmail, Evenement, SemaineType
from mailer import send_contact_email
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os
from datetime import datetime
from src.users import get_user


pages_blueprint = Blueprint("pages", __name__)

@pages_blueprint.route("/api/register/user", methods=["POST"])
def register_form_user():
    data = request.get_json()
    
    email = data.get("email")
    password_raw = data.get("password")
    password = generate_password_hash(password_raw)
    nom = data.get("nom")
    prenom = data.get("prenom")
    dateNaissance = datetime.fromisoformat(data.get("dateNaissance")).date()
    telephone = data.get("telephone")
    estGerant = False

    
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
        idTypeUtilisateur=id_type_client,
        estGerant=estGerant,
    )
    
    db.session.add(u1)
    db.session.commit()
    
    return jsonify({"message":"utilisateur ajouté","id":u1.idClient})

@pages_blueprint.route("/api/register/pro", methods=["POST"])
def register_form_pro():
    data = request.get_json()

    # Vérifie si tous les champs requis sont présents
    required_fields = ["email", "password", "nom", "prenom", "dateNaissance", "telephone", "companyName", "sector", "slug", "address", "postalCode", "city", "country"]
    missing_fields = [field for field in required_fields if not data.get(field)]

    if missing_fields:
        return jsonify({
            "error": f"Champs manquants: {', '.join(missing_fields)}",
            "required_fields": required_fields
        }), 400

    password = generate_password_hash(data.get("password"))
    email = data.get("email")
    nom = data.get("nom")
    prenom = data.get("prenom")
    
    try:
        dateNaissance = datetime.fromisoformat(data.get("dateNaissance")).date()
    except (ValueError, TypeError):
        return jsonify({
            "error": "Format de date de naissance invalide. Utilisez le format ISO (YYYY-MM-DD)"
        }), 400
    
    telephone = data.get("telephone") 

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
        idTypeUtilisateur=id_type_pro,
        estGerant=True
    )

    db.session.add(u1)
    db.session.commit()

    # Pour l'entreprise, pareil : récupère depuis le JSON
    e1 = Entreprise(
        nomEntreprise=data.get("companyName"),
        nomSecteur=data.get("sector"),
        idGerant=u1.idClient,
        slugPublic=data.get("slug"),
        adresse=data.get("address"),
        codePostal=data.get("postalCode"),
        ville=data.get("city"),
        pays=data.get("country")
    )


    db.session.add(e1)
    db.session.commit()

    return jsonify({"message":"utilisateur et entreprise ajoutés","idClient":u1.idClient, "idPro":e1.idPro})


@pages_blueprint.route("/login", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")

    user = get_user(email)

    if user is None:
        print("YA PAS D'UTILISATEURS POTOOOOOOOOOO !!!!!!")
        return jsonify({"Message": "YA PAS D'UTILISATEURS POTOOOOOOOOOO !!!!!!"}, False)
    else:
        print(f"[LOGIN] Email: {email}  Password: {password}", flush=True)
    return jsonify({"email": email, "password": password, "Messages" : "données bien récupérer"}, True)


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

if __name__ == "__main__":
    from app import create_app
    app = create_app()
    app.run(port=5000)
