from flask import Flask, Blueprint, request, jsonify
from src.extension import db
from src.models import Entreprise






entreprise_blueprint = Blueprint("entreprise",__name__)


@entreprise_blueprint.route("/api/entreprise/search", methods=["POST"])
def search():
    data = request.get_json()
    service_entreprise = data.get("service")
    localisation = data.get("localisation")

    if not service_entreprise and not localisation:
        return jsonify({"error": "No data"}),400
    
    if service_entreprise and localisation:
        entreprises = Entreprise.query.filter(Entreprise.ville.ilike(f"%{localisation}%")).filter(Entreprise.nomSecteur.ilike(f"%{service_entreprise}%")).all()

        ret_dict = {}
        for entreprise in entreprises:
            ret_dict[entreprise.nomEntreprise] = {
                "secteur" : entreprise.nomSecteur,
                 "slug" : entreprise.slugPublic,
                "adresse" : entreprise.adresse,
                "code_postal" : entreprise.codePostal,
                "ville": entreprise.ville,
                "pays": entreprise.pays
                
                }
        return jsonify(ret_dict), 203

    
    if not service_entreprise:
        entreprises = Entreprise.query.filter(Entreprise.ville.ilike(f'%{localisation}%')).all()
        ret_dict = {}
        for entreprise in entreprises:
            ret_dict[entreprise.nomEntreprise] = {
                "secteur" : entreprise.nomSecteur,
                 "slug" : entreprise.slugPublic,
                "adresse" : entreprise.adresse,
                "code_postal" : entreprise.codePostal,
                "ville": entreprise.ville,
                "pays": entreprise.pays
                
                }
        return jsonify(ret_dict), 203

    if not localisation:
        entreprises = Entreprise.query.filter(Entreprise.nomSecteur.ilike(f'%{service_entreprise}%')).all()
        ret_dict = {}
        for entreprise in entreprises:
            ret_dict[entreprise.nomEntreprise] = {
                "secteur" : entreprise.nomSecteur,
                 "slug" : entreprise.slugPublic,
                "adresse" : entreprise.adresse,
                "code_postal" : entreprise.codePostal,
                "ville": entreprise.ville,
                "pays": entreprise.pays
                
                }
        return jsonify(ret_dict), 203
    return jsonify({"error": "error server"}), 500



