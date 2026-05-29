# -*- coding: utf-8 -*-
"""
Routes d'analyse statistique du tableau de bord professionnel.

Les calculs sont effectués côté serveur à partir des données réelles
de réservations et de créneaux de l'entreprise connectée.
Aucune donnée fictive n'est retournée.
"""

from collections import defaultdict
from datetime    import datetime
from flask       import Blueprint, jsonify
from src.models  import Reservation, Creneau
from src.utils.auth import login_required, get_pro_entreprise
from sqlalchemy.orm  import joinedload

statistiques_bp = Blueprint('statistiques', __name__)


@statistiques_bp.route('/api/entreprise/statistiques', methods=['GET'])
@login_required
def get_statistiques():
    """
    Retourne les indicateurs clés de performance de l'entreprise.

    Calculs inclus :
    - KPIs : total, confirmées, en attente, annulées, CA total,
             nombre de clients uniques, créneaux total, taux d'occupation.
    - Évolution mensuelle du CA sur les 6 derniers mois.
    - Top 5 des prestations par nombre de réservations.

    Le taux d'occupation est calculé comme :
        (créneaux occupés / créneaux total) × 100

    Returns:
        JSON: { kpis, revenueByMonth, topServices }, HTTP 200.
    """
    try:
        entreprise = get_pro_entreprise()
        if not entreprise:
            return jsonify({"error": "Entreprise non trouvée"}), 404

        reservations = Reservation.query.options(
            joinedload(Reservation.prestation)
        ).filter_by(idPro=entreprise.idPro).all()

        # --- KPIs globaux ---
        total     = len(reservations)
        confirmed = sum(1 for r in reservations if r.statut and not r.estAnnulee)
        pending   = sum(1 for r in reservations if not r.statut and not r.estAnnulee)
        cancelled = sum(1 for r in reservations if r.estAnnulee)
        revenue   = sum(
            float(r.prestation.tarif)
            for r in reservations
            if r.statut and not r.estAnnulee and r.prestation and r.prestation.tarif
        )
        clients_uniq      = len({r.idClient for r in reservations if not r.estAnnulee})
        creneaux_total    = Creneau.query.filter_by(idPro=entreprise.idPro).count()
        creneaux_reserves = Creneau.query.filter_by(idPro=entreprise.idPro, statut=False).count()
        occupancy         = round((creneaux_reserves / creneaux_total * 100) if creneaux_total else 0, 1)

        # --- CA mensuel (6 derniers mois) ---
        rev_by_month   = defaultdict(float)
        count_by_month = defaultdict(int)
        for r in reservations:
            if r.statut and not r.estAnnulee and r.prestation and r.prestation.tarif:
                label = r.dateCreation.strftime("%b %Y")
                rev_by_month[label]   += float(r.prestation.tarif)
                count_by_month[label] += 1

        today  = datetime.now()
        months = []
        for i in range(5, -1, -1):
            m, y = today.month - i, today.year
            while m <= 0:
                m += 12
                y -= 1
            label = datetime(y, m, 1).strftime("%b %Y")
            months.append({
                "month":   label,
                "revenue": round(rev_by_month.get(label, 0), 2),
                "count":   count_by_month.get(label, 0),
            })

        # --- Top 5 prestations ---
        svc_count = defaultdict(int)
        svc_rev   = defaultdict(float)
        for r in reservations:
            if not r.estAnnulee and r.prestation:
                svc_count[r.prestation.libelle] += 1
                if r.statut and r.prestation.tarif:
                    svc_rev[r.prestation.libelle] += float(r.prestation.tarif)

        top_services = sorted(
            [{"name": k, "count": svc_count[k], "revenue": round(svc_rev[k], 2)} for k in svc_count],
            key=lambda x: x["count"],
            reverse=True
        )[:5]

        return jsonify({
            "kpis": {
                "total":         total,
                "confirmed":     confirmed,
                "pending":       pending,
                "cancelled":     cancelled,
                "revenue":       round(revenue, 2),
                "clientCount":   clients_uniq,
                "creneauxTotal": creneaux_total,
                "occupancyRate": occupancy,
            },
            "revenueByMonth": months,
            "topServices":    top_services,
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
