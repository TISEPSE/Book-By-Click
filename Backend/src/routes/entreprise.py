# -*- coding: utf-8 -*-
"""
Routes publiques des entreprises.

Ces routes sont accessibles sans authentification et constituent
la vitrine publique de la plateforme : recherche d'entreprises
et affichage de leur page de détail.

Les entreprises dont le gérant est bloqué sont automatiquement
exclues des résultats de recherche et retournent une erreur 403
si accédées directement.
"""

from flask    import Blueprint, request, jsonify
from src.models import Entreprise, Utilisateur

entreprise_blueprint = Blueprint("entreprise", __name__)


def _format_entreprise_public(e):
    """
    Sérialise les informations publiques d'une entreprise.

    Args:
        e (Entreprise): Instance d'entreprise.

    Returns:
        dict: Données publiques (sans informations sensibles du gérant).
    """
    return {
        "secteur":     e.nomSecteur,
        "slug":        e.slugPublic,
        "adresse":     e.adresse,
        "code_postal": e.codePostal,
        "ville":       e.ville,
        "pays":        e.pays,
    }


@entreprise_blueprint.get("/api/entreprise/search")
def search():
    """
    Recherche des entreprises par secteur d'activité et/ou localisation.

    La recherche est insensible à la casse (ILIKE) et partielle (LIKE %…%).
    Au moins un des deux paramètres doit être fourni.

    Query params :
        service      (str, optionnel) – secteur d'activité
        localisation (str, optionnel) – ville

    Returns:
        JSON: dictionnaire { nomEntreprise: { secteur, slug, ... } }, HTTP 203.
        JSON: erreur, HTTP 400 si aucun paramètre n'est fourni.
    """
    service      = request.args.get("service")
    localisation = request.args.get("localisation")

    if not service and not localisation:
        return jsonify({"error": "Au moins un paramètre (service ou localisation) est requis"}), 400

    # Exclusion des entreprises dont le gérant est bloqué
    base = (
        Entreprise.query
        .join(Utilisateur, Entreprise.idGerant == Utilisateur.idClient)
        .filter(Utilisateur.estBloque == False)
    )

    if service:
        base = base.filter(Entreprise.nomSecteur.ilike(f"%{service}%"))
    if localisation:
        base = base.filter(Entreprise.ville.ilike(f"%{localisation}%"))

    entreprises = base.all()
    return jsonify({e.nomEntreprise: _format_entreprise_public(e) for e in entreprises}), 203


@entreprise_blueprint.get("/api/entreprise/slug/<string:slug>")
def get_entreprise_by_slug(slug):
    """
    Retourne les détails publics d'une entreprise identifiée par son slug.

    Utilisé par la page de détail et le calendrier de réservation
    pour afficher les prestations et les créneaux disponibles.

    Args (URL): slug – identifiant public de l'entreprise.

    Returns:
        JSON: données entreprise avec prestations et créneaux, HTTP 200.
        JSON: erreur, HTTP 404 (introuvable) ou 403 (gérant bloqué).
    """
    entreprise = Entreprise.query.filter_by(slugPublic=slug).first()
    if not entreprise:
        return jsonify({"error": "Entreprise introuvable"}), 404
    if entreprise.gerant and entreprise.gerant.estBloque:
        return jsonify({"error": "Entreprise indisponible"}), 403

    return jsonify({
        "idPro":         entreprise.idPro,
        "nomEntreprise": entreprise.nomEntreprise,
        "nomSecteur":    entreprise.nomSecteur,
        "slugPublic":    entreprise.slugPublic,
        "adresse":       entreprise.adresse,
        "codePostal":    entreprise.codePostal,
        "ville":         entreprise.ville,
        "pays":          entreprise.pays,
        "creneaux": [{
            "idCreneau":      c.idCreneau,
            "dateHeureDebut": c.dateHeureDebut.isoformat(),
            "dateHeureFin":   c.dateHeureFin.isoformat(),
            "statut":         c.statut,
        } for c in entreprise.creneaus],
        "prestations": [{
            "idPrestation": p.idPrestation,
            "libelle":      p.libelle,
            "dureeMinutes": p.dureeMinutes,
            "tarif":        float(p.tarif) if p.tarif else None,
        } for p in entreprise.prestations],
    }), 200


@entreprise_blueprint.get("/api/entreprise/<string:nom>")
def get_entreprise(nom):
    """
    Retourne les détails complets d'une entreprise par son nom exact.

    Contrairement à la route slug (usage client), cette route expose
    également les réservations, événements et semaine type.
    Réservée à un usage interne ou de debug.

    Args (URL): nom – nom exact de l'entreprise.

    Returns:
        JSON: données complètes de l'entreprise, HTTP 200.
        JSON: erreur, HTTP 404 ou 403.
    """
    entreprise = Entreprise.query.filter_by(nomEntreprise=nom).first()
    if not entreprise:
        return jsonify({"error": "Entreprise introuvable"}), 404
    if entreprise.gerant and entreprise.gerant.estBloque:
        return jsonify({"error": "Entreprise indisponible"}), 403

    return jsonify({
        "idPro":         entreprise.idPro,
        "nomEntreprise": entreprise.nomEntreprise,
        "nomSecteur":    entreprise.nomSecteur,
        "slugPublic":    entreprise.slugPublic,
        "adresse":       entreprise.adresse,
        "codePostal":    entreprise.codePostal,
        "ville":         entreprise.ville,
        "pays":          entreprise.pays,
        "creneaux": [{
            "idCreneau":      c.idCreneau,
            "dateHeureDebut": c.dateHeureDebut.isoformat(),
            "dateHeureFin":   c.dateHeureFin.isoformat(),
            "statut":         c.statut,
        } for c in entreprise.creneaus],
        "reservations": [{
            "idReservation":    r.idReservation,
            "idClient":         r.idClient,
            "idPrestation":     r.idPrestation,
            "commentaireClient": r.commentaireClient,
            "statut":           r.statut,
            "dateCreation":     r.dateCreation.isoformat(),
        } for r in entreprise.reservations],
        "prestations": [{
            "idPrestation": p.idPrestation,
            "libelle":      p.libelle,
            "dureeMinutes": p.dureeMinutes,
            "tarif":        float(p.tarif) if p.tarif else None,
        } for p in entreprise.prestations],
        "evenements": [{
            "idEvenement":   e.idEvenement,
            "titre":         e.titre,
            "description":   e.description,
            "dateDebut":     e.dateDebut.isoformat(),
            "dateFin":       e.dateFin.isoformat(),
            "typeEvenement": e.typeEvenement,
        } for e in entreprise.evenements],
        "semaineType": [{
            "idSemaineType": s.idSemaineType,
            "libelle":       s.libelle,
            "description":   s.description,
            "joursPattern":  s.joursPattern,
        } for s in entreprise.semainestype],
    }), 200
