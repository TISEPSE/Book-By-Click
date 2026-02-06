from flask import Flask, Blueprint, request, jsonify
from src.extension import db
from src.models import Entreprise






entreprise_blueprint = Blueprint("entreprise",__name__)

#   /api/entreprise/search/<service>/<localisation>
#   /api/entreprise/search?service=abc&localisation=bcd

@entreprise_blueprint.get("/api/entreprise/search")
def search():
    service_entreprise = request.args.get("service")
    localisation = request.args.get("localisation")

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



@entreprise_blueprint.get("/api/entreprise/<string:nom>")
def get_entreprise(nom):
    entreprise = Entreprise.query.filter_by(nomEntreprise=nom).first()
nom
    if not entreprise:
        return jsonify({"error": "Entreprise not found"}), 404

    data = {
        "idPro": entreprise.idPro,
        "nomEntreprise": entreprise.nomEntreprise,
        "nomSecteur": entreprise.nomSecteur,
        "slugPublic": entreprise.slugPublic,
        "adresse": entreprise.adresse,
        "codePostal": entreprise.codePostal,
        "ville": entreprise.ville,
        "pays": entreprise.pays,

        "creneaux": [
            {
                "idCreneau": c.idCreneau,
                "dateHeureDebut": c.dateHeureDebut.isoformat(),
                "dateHeureFin": c.dateHeureFin.isoformat(),
                "statut": c.statut
            } for c in entreprise.creneaus
        ],

        "reservations": [
            {
                "idReservation": r.idReservation,
                "idClient": r.idClient,
                "idPrestation": r.idPrestation,
                "commentaireClient": r.commentaireClient,
                "statut": r.statut,
                "dateCreation": r.dateCreation.isoformat()
            } for r in entreprise.reservations
        ],

        "prestations": [
            {
                "idPrestation": p.idPrestation,
                "libelle": p.libelle,
                "dureeMinutes": p.dureeMinutes,
                "tarif": float(p.tarif) if p.tarif else None
            } for p in entreprise.prestations
        ],

        "evenements": [
            {
                "idEvenement": e.idEvenement,
                "titre": e.titre,
                "description": e.description,
                "dateDebut": e.dateDebut.isoformat(),
                "dateFin": e.dateFin.isoformat(),
                "typeEvenement": e.typeEvenement
            } for e in entreprise.evenements
        ],

        "semaineType": [
            {
                "idSemaineType": s.idSemaineType,
                "libelle": s.libelle,
                "description": s.description,
                "joursPattern": s.joursPattern
            } for s in entreprise.semainestype
        ]
    }

    return jsonify(data), 200


