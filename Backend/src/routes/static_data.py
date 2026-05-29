# -*- coding: utf-8 -*-
"""
Routes de données de référence statiques.

Expose les listes de services (secteurs d'activité) et de communes françaises
utilisées pour l'autocomplétion des formulaires d'inscription et de recherche.

Les villes sont chargées une seule fois en mémoire (cache module-level)
pour éviter de relire le fichier JSON à chaque requête.
"""

import json
import os
from flask import Blueprint, request, jsonify

static_bp = Blueprint('static_data', __name__)

# Cache en mémoire des communes, initialisé au premier appel
_villes_cache = None


def _load_villes():
    """
    Charge et met en cache la liste des communes françaises depuis le fichier JSON.

    Le cache est conservé pour toute la durée de vie du processus Flask.

    Returns:
        list[str]: Liste des noms de communes au format standard.
    """
    global _villes_cache
    if _villes_cache is None:
        try:
            path = os.path.join(
                os.path.dirname(__file__), '..', 'data',
                'communes-france-avec-polygon-2025.json'
            )
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            _villes_cache = [c.get('nom_standard', '') for c in data.get('data', [])]
        except Exception:
            _villes_cache = []
    return _villes_cache


@static_bp.route("/api/services", methods=["GET"])
def get_services():
    """
    Retourne la liste des secteurs d'activité disponibles sur la plateforme.

    Supporte le filtrage par sous-chaîne via le paramètre de requête 'q'.
    Limité à 20 résultats pour les recherches filtrées.

    Query params : q (str, optionnel) – filtre de recherche

    Returns:
        JSON: liste de chaînes (noms de secteurs), HTTP 200.
    """
    try:
        path = os.path.join(os.path.dirname(__file__), '..', 'data', 'services.json')
        with open(path, 'r', encoding='utf-8') as f:
            services = json.load(f)
        q = request.args.get('q', '').lower()
        if q:
            return jsonify([s for s in services if q in s.lower()][:20])
        return jsonify(services)
    except Exception:
        return jsonify([]), 500


@static_bp.route("/api/villes", methods=["GET"])
def get_villes():
    """
    Retourne les communes françaises correspondant à la saisie.

    Filtre par préfixe (startswith) pour une autocomplétion naturelle.
    Limité à 15 résultats pour les recherches filtrées, 100 sans filtre.

    Query params : q (str, optionnel) – début du nom de commune

    Returns:
        JSON: liste de noms de communes, HTTP 200.
    """
    villes = _load_villes()
    q      = request.args.get('q', '').lower()
    if not q:
        return jsonify(villes[:100])
    return jsonify([v for v in villes if v.lower().startswith(q)][:15])
