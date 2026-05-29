# -*- coding: utf-8 -*-
"""
Seed de données de test pour Book By Click.

Génère un jeu de données complet et réaliste couvrant :
- 6 entreprises dans 5 villes et 5 secteurs différents
- 6 professionnels, 15 clients, 1 admin
- Historique de 3 mois de réservations (passées, à venir, annulées)
- Créneaux passés et futurs
- Événements de types variés
- Semaines type configurées par entreprise
- Logs email avec statuts mixtes
"""

from src.models import (
    db, Utilisateur, TypeUtilisateur, Entreprise, Creneau,
    Prestation, Reservation, EventEmail, Evenement, SemaineType
)
from werkzeug.security import generate_password_hash
from datetime import datetime, date, timedelta
import random

# Graine fixe pour la reproductibilité des données aléatoires
random.seed(42)

TODAY = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)


# ─────────────────────────────────────────
#  Helpers
# ─────────────────────────────────────────

def make_slot(id_pro, dt, duration_h=1, nb_max=1, statut=True):
    """Crée un créneau à partir d'un datetime de début."""
    return Creneau(
        idPro=id_pro,
        dateHeureDebut=dt,
        dateHeureFin=dt + timedelta(hours=duration_h),
        statut=statut,
        nbMaxReservations=nb_max,
    )


def build_future_slots(id_pro, days=28, start_h=9, end_h=18, sat_end_h=14, nb_max=1):
    """
    Génère les créneaux des semaines à venir (disponibles, statut=True).
    Exclut le dimanche. Le samedi ferme plus tôt.
    """
    slots = []
    for offset in range(1, days + 1):
        day = TODAY + timedelta(days=offset)
        if day.weekday() == 6:          # dimanche
            continue
        close = sat_end_h if day.weekday() == 5 else end_h
        for h in range(start_h, close):
            slots.append(make_slot(id_pro, day.replace(hour=h), nb_max=nb_max))
    return slots


def build_past_slots(id_pro, days_back=90, start_h=9, end_h=18, sat_end_h=14, nb_max=1):
    """
    Génère les créneaux des semaines passées (tous statut=False, occupés).
    Permet de simuler un historique d'activité réaliste.
    """
    slots = []
    for offset in range(1, days_back + 1):
        day = TODAY - timedelta(days=offset)
        if day.weekday() == 6:
            continue
        close = sat_end_h if day.weekday() == 5 else end_h
        for h in range(start_h, close):
            slots.append(make_slot(id_pro, day.replace(hour=h), nb_max=nb_max, statut=False))
    return slots


# ─────────────────────────────────────────
#  Entrée principale
# ─────────────────────────────────────────

def run_seed():
    """Initialise la base de données si elle est vide."""
    if TypeUtilisateur.query.count() > 0:
        print("Données déjà présentes — seed ignoré.")
        return

    print("Initialisation des données de test...")

    # ════════════════════════════════════════
    #  1. TYPES D'UTILISATEURS
    # ════════════════════════════════════════
    t_admin  = TypeUtilisateur(role="admin",  description="Administrateur de la plateforme")
    t_pro    = TypeUtilisateur(role="pro",    description="Gérant d'une entreprise")
    t_client = TypeUtilisateur(role="client", description="Client utilisateur de la plateforme")
    db.session.add_all([t_admin, t_pro, t_client])
    db.session.commit()

    # ════════════════════════════════════════
    #  2. UTILISATEURS
    # ════════════════════════════════════════

    def mkuser(nom, prenom, naissance, email, tel, gerant, bloque, type_u, days_ago):
        return Utilisateur(
            nom=nom, prenom=prenom,
            dateNaissance=date.fromisoformat(naissance),
            email=email,
            motDePasseHash=generate_password_hash("password123"),
            telephone=tel,
            dateInscription=TODAY - timedelta(days=days_ago),
            idTypeUtilisateur=type_u.idType,
            estGerant=gerant,
            estBloque=bloque,
        )

    admin = Utilisateur(
        nom="Admin", prenom="Alice",
        dateNaissance=date(1985, 3, 22),
        email="admin@bookbyclick.com",
        motDePasseHash=generate_password_hash("admin"),
        telephone="0600000001",
        dateInscription=TODAY - timedelta(days=365),
        idTypeUtilisateur=t_admin.idType,
        estGerant=False, estBloque=False,
    )

    pros_data = [
        # nom, prenom, naissance, email, tel, days_ago
        ("Leroy",    "Marie",   "1991-04-02", "marie.leroy@example.com",    "0601000001", 300),
        ("Bernard",  "Nicolas", "1987-07-17", "nicolas.bernard@example.com","0601000002", 290),
        ("Roux",     "Sophie",  "1993-02-23", "sophie.roux@example.com",    "0601000003", 280),
        ("Fontaine", "Laurent", "1980-11-08", "laurent.fontaine@example.com","0601000004", 260),
        ("Morel",    "Isabelle","1989-06-15", "isabelle.morel@example.com", "0601000005", 250),
        ("Girard",   "Axel",    "1995-09-30", "axel.girard@example.com",    "0601000006", 240),
    ]
    pros = [mkuser(n, p, nb, e, t, True, False, t_pro, da) for n, p, nb, e, t, da in pros_data]

    clients_data = [
        # nom, prenom, naissance, email, tel, bloque, days_ago
        ("Martin",   "Claire",    "1995-03-15", "claire.martin@example.com",   "0611000001", False, 180),
        ("Dubois",   "Thomas",    "1992-11-05", "thomas.dubois@example.com",   "0611000002", False, 170),
        ("Petit",    "Camille",   "1998-06-08", "camille.petit@example.com",   "0611000003", False, 160),
        ("Moreau",   "Hugo",      "1990-09-12", "hugo.moreau@example.com",     "0611000004", False, 155),
        ("Lefevre",  "Ines",      "1996-12-01", "ines.lefevre@example.com",    "0611000005", False, 150),
        ("Garcia",   "Lucas",     "1989-08-21", "lucas.garcia@example.com",    "0611000006", False, 140),
        ("Faure",    "Emma",      "2000-05-30", "emma.faure@example.com",      "0611000007", False, 130),
        ("Noel",     "Jules",     "1997-01-19", "jules.noel@example.com",      "0611000008", False, 125),
        ("Blanc",    "Lea",       "1994-07-25", "lea.blanc@example.com",       "0611000009", False, 120),
        ("Clement",  "Arthur",    "1991-03-10", "arthur.clement@example.com",  "0611000010", False, 115),
        ("Rousseau", "Julie",     "1999-10-14", "julie.rousseau@example.com",  "0611000011", False, 110),
        ("David",    "Pierre",    "1986-02-28", "pierre.david@example.com",    "0611000012", False, 105),
        ("Schmitt",  "Nathalie",  "1978-08-17", "nathalie.schmitt@example.com","0611000013", False, 100),
        ("Durand",   "Kevin",     "2001-04-05", "kevin.durand@example.com",    "0611000014", False, 90),
        ("Laurent",  "Margot",    "1997-12-20", "margot.laurent@example.com",  "0611000015", True,  85),
    ]
    clients = [mkuser(n, p, nb, e, t, False, bl, t_client, da)
               for n, p, nb, e, t, bl, da in clients_data]

    db.session.add(admin)
    db.session.add_all(pros)
    db.session.add_all(clients)
    db.session.commit()

    # ════════════════════════════════════════
    #  3. ENTREPRISES
    # ════════════════════════════════════════
    entreprises_data = [
        # nomEntreprise, nomSecteur, pro_idx, slug, adresse, cp, ville
        ("Chez Marie Coiffure",   "Coiffeur",         0, "chez-marie-coiffure",   "12 rue de la Paix",         "75001", "Paris"),
        ("Barber Shop Bernard",   "Barbier",           1, "barber-shop-bernard",   "5 avenue Victor Hugo",      "69002", "Lyon"),
        ("Zen Beauty Studio",     "Esthetique",        2, "zen-beauty-studio",     "33 boulevard National",     "13001", "Marseille"),
        ("Atelier Ongles Lumiere","Manucure",          0, "atelier-ongles-lumiere","77 rue Faidherbe",          "59800", "Lille"),
        ("Kine Du Sport Bordeaux","Kinesitherapie",    3, "kine-du-sport-bordeaux","18 cours de l'Intendance",  "33000", "Bordeaux"),
        ("Coach Yoga Rennes",     "Bien-etre",         4, "coach-yoga-rennes",     "4 rue Saint-Melaine",       "35000", "Rennes"),
    ]
    entreprises = []
    for nom, secteur, pro_idx, slug, adresse, cp, ville in entreprises_data:
        entreprises.append(Entreprise(
            nomEntreprise=nom, nomSecteur=secteur,
            idGerant=pros[pro_idx].idClient,
            slugPublic=slug, adresse=adresse,
            codePostal=cp, ville=ville, pays="France",
        ))
    db.session.add_all(entreprises)
    db.session.commit()

    e_coiffure, e_barber, e_zen, e_ongles, e_kine, e_yoga = entreprises

    # ════════════════════════════════════════
    #  4. SEMAINES TYPE
    # ════════════════════════════════════════
    semaines = [
        SemaineType(idPro=e_coiffure.idPro, libelle="Semaine coiffure",
                    description="Lundi au samedi, ferme mardi matin.",
                    joursPattern="1111110", heureDebut="09:00", heureFin="18:00"),
        SemaineType(idPro=e_barber.idPro,   libelle="Semaine barbier",
                    description="Mardi au samedi — repos lundi et dimanche.",
                    joursPattern="0111110", heureDebut="10:00", heureFin="19:00"),
        SemaineType(idPro=e_zen.idPro,      libelle="Semaine esthetique",
                    description="Lundi au vendredi uniquement.",
                    joursPattern="1111100", heureDebut="09:00", heureFin="17:00"),
        SemaineType(idPro=e_ongles.idPro,   libelle="Semaine atelier",
                    description="Mardi au samedi.",
                    joursPattern="0111110", heureDebut="10:00", heureFin="18:00"),
        SemaineType(idPro=e_kine.idPro,     libelle="Semaine kine",
                    description="Lundi au vendredi, horaires etendus.",
                    joursPattern="1111100", heureDebut="08:00", heureFin="19:00"),
        SemaineType(idPro=e_yoga.idPro,     libelle="Semaine yoga",
                    description="Lundi, mercredi, vendredi et samedi matin.",
                    joursPattern="1010110", heureDebut="07:00", heureFin="12:00"),
    ]
    db.session.add_all(semaines)
    db.session.commit()

    # ════════════════════════════════════════
    #  5. PRESTATIONS
    # ════════════════════════════════════════
    presta_data = {
        e_coiffure.idPro: [
            ("Coupe femme",              45, 35.00),
            ("Coupe homme",              30, 22.00),
            ("Coloration complète",      90, 75.00),
            ("Balayage / mèches",       120, 95.00),
            ("Brushing",                 30, 24.00),
            ("Soin kératine",            60, 55.00),
        ],
        e_barber.idPro: [
            ("Coupe de cheveux",         30, 25.00),
            ("Taille de barbe",          20, 15.00),
            ("Coupe + barbe",            45, 35.00),
            ("Rituel barbe premium",     50, 40.00),
            ("Coupe enfant (- 12 ans)",  20, 15.00),
        ],
        e_zen.idPro: [
            ("Soin visage hydratant",    60, 58.00),
            ("Épilation jambes",         40, 29.00),
            ("Épilation demi-jambes",    25, 18.00),
            ("Massage relaxant",         60, 65.00),
            ("Massage duo",              60, 120.00),
            ("Gommage corps",            45, 45.00),
        ],
        e_ongles.idPro: [
            ("Pose vernis semi-permanent",45, 32.00),
            ("Nail art simple",           60, 45.00),
            ("Nail art complexe",         90, 65.00),
            ("Dépose + soin",             30, 22.00),
            ("Manucure classique",        30, 25.00),
        ],
        e_kine.idPro: [
            ("Séance kinésithérapie",     45, 50.00),
            ("Bilan postural",            60, 70.00),
            ("Rééducation dos",           45, 55.00),
            ("Massage sportif",           30, 45.00),
            ("Étirements guidés",         30, 35.00),
        ],
        e_yoga.idPro: [
            ("Cours yoga débutant",       60, 20.00),
            ("Cours yoga intermédiaire",  60, 22.00),
            ("Cours yoga avancé",         75, 25.00),
            ("Séance méditation",         45, 18.00),
            ("Cours particulier yoga",    60, 50.00),
        ],
    }
    prestations_by_pro = {}
    for id_pro, specs in presta_data.items():
        prestations_by_pro[id_pro] = []
        for libelle, duree, tarif in specs:
            p = Prestation(idPro=id_pro, libelle=libelle, dureeMinutes=duree, tarif=tarif)
            db.session.add(p)
            prestations_by_pro[id_pro].append(p)
    db.session.commit()

    # ════════════════════════════════════════
    #  6. CRÉNEAUX PASSÉS (historique)
    #     Tous statut=False, liés aux réservations passées
    # ════════════════════════════════════════

    # On crée des créneaux passés précis pour l'historique
    def past_slot(id_pro, days_ago, hour):
        dt = (TODAY - timedelta(days=days_ago)).replace(hour=hour)
        c = make_slot(id_pro, dt, statut=False)
        db.session.add(c)
        db.session.flush()
        return c

    # ════════════════════════════════════════
    #  7. CRÉNEAUX FUTURS (disponibles)
    # ════════════════════════════════════════
    future_slots = []
    future_slots += build_future_slots(e_coiffure.idPro, days=28, start_h=9,  end_h=18, sat_end_h=14)
    future_slots += build_future_slots(e_barber.idPro,   days=28, start_h=10, end_h=19, sat_end_h=15)
    future_slots += build_future_slots(e_zen.idPro,      days=28, start_h=9,  end_h=17, sat_end_h=13)
    future_slots += build_future_slots(e_ongles.idPro,   days=28, start_h=10, end_h=18, sat_end_h=14)
    future_slots += build_future_slots(e_kine.idPro,     days=28, start_h=8,  end_h=19, sat_end_h=12)
    future_slots += build_future_slots(e_yoga.idPro,     days=28, start_h=7,  end_h=12, sat_end_h=12)
    db.session.add_all(future_slots)
    db.session.commit()

    # Index des créneaux futurs disponibles par entreprise
    futurs_dispo = {}
    for c in Creneau.query.filter(
        Creneau.statut == True,
        Creneau.dateHeureDebut > TODAY
    ).order_by(Creneau.dateHeureDebut.asc()).all():
        futurs_dispo.setdefault(c.idPro, []).append(c)

    def pop_future(id_pro):
        """Prend le prochain créneau futur disponible et le marque occupé."""
        lst = futurs_dispo.get(id_pro, [])
        if not lst:
            return None
        c = lst.pop(0)
        c.statut = False
        return c

    # ════════════════════════════════════════
    #  8. RÉSERVATIONS
    # ════════════════════════════════════════
    """
    Structure de chaque spec :
      (entreprise, client_idx, presta_idx, commentaire, statut, estAnnulee, days_ago)
      days_ago=None → réservation future (utilise un créneau futur)
      days_ago=N    → réservation passée (crée un créneau passé dédié à l'heure)
    """

    specs = [
        # ── Chez Marie Coiffure (historique confirmé) ──
        (e_coiffure, 0,  0, "Première visite, cheveux longs",    True,  False, 82),
        (e_coiffure, 1,  1, "Coupe courte et nette",             True,  False, 75),
        (e_coiffure, 2,  2, "Coloration châtain doré",           True,  False, 68),
        (e_coiffure, 3,  4, "Brushing pour un mariage",          True,  False, 61),
        (e_coiffure, 4,  0, "Dégradé + frange",                  True,  False, 54),
        (e_coiffure, 5,  3, "Balayage naturel",                  True,  False, 47),
        (e_coiffure, 6,  5, "Soin avant l'été",                  True,  False, 40),
        (e_coiffure, 7,  1, "",                                   True,  False, 33),
        # ── Coiffure annulée ──
        (e_coiffure, 8,  0, "Empêchement de dernière minute",    False, True,  26),
        (e_coiffure, 9,  2, "Annulé — vacances",                 False, True,  19),
        # ── Coiffure à venir ──
        (e_coiffure, 0,  0, "Rafraîchir la coupe",               False, False, None),
        (e_coiffure, 1,  2, "Coloration automne",                False, False, None),
        (e_coiffure, 2,  4, "Brushing avant événement",          True,  False, None),

        # ── Barber Shop Bernard (historique) ──
        (e_barber,  10,  0, "Coupe classique côtés courts",      True,  False, 80),
        (e_barber,  11,  2, "Coupe + entretien barbe",           True,  False, 73),
        (e_barber,   0,  3, "Rituel complet — barbe pleine",     True,  False, 66),
        (e_barber,   1,  1, "Taille soigneuse de la barbe",      True,  False, 59),
        (e_barber,   3,  0, "",                                   True,  False, 52),
        (e_barber,   5,  2, "Coupe dégradé américain",           True,  False, 45),
        (e_barber,   7,  4, "Coupe enfant",                      True,  False, 38),
        # ── Barber annulé ──
        (e_barber,  12,  0, "Pas disponible finalement",         False, True,  31),
        # ── Barber à venir ──
        (e_barber,  10,  2, "Coupe avant vacances",              False, False, None),
        (e_barber,  11,  3, "Rituel premium — cadeau anniversaire",True, False, None),

        # ── Zen Beauty Studio (historique) ──
        (e_zen,      2,  0, "Soin hydratant urgent",             True,  False, 78),
        (e_zen,      4,  3, "Massage détente après le sport",    True,  False, 71),
        (e_zen,      6,  1, "Épilation été",                     True,  False, 64),
        (e_zen,      8,  4, "Massage duo avec ma sœur",          True,  False, 57),
        (e_zen,      0,  5, "Gommage avant la plage",            True,  False, 50),
        (e_zen,      1,  2, "",                                   True,  False, 43),
        (e_zen,      3,  0, "Soin anti-stress",                  True,  False, 36),
        # ── Zen annulé ──
        (e_zen,      9,  3, "Réservé en double par erreur",      False, True,  29),
        # ── Zen à venir ──
        (e_zen,      2,  3, "Massage relaxant",                  False, False, None),
        (e_zen,      4,  0, "Soin peau sensible",                True,  False, None),

        # ── Atelier Ongles Lumière (historique) ──
        (e_ongles,   5,  0, "Semi-permanent nude",               True,  False, 76),
        (e_ongles,   7,  1, "Nail art discret fleurs",           True,  False, 69),
        (e_ongles,   9,  3, "Dépose + nouveau vernis",           True,  False, 62),
        (e_ongles,  11,  4, "Manucure classique",                True,  False, 55),
        (e_ongles,  13,  2, "Nail art complexe graduation",      True,  False, 48),
        (e_ongles,   0,  0, "",                                   True,  False, 41),
        # ── Ongles à venir ──
        (e_ongles,   5,  1, "Nail art automne",                  False, False, None),
        (e_ongles,   7,  0, "Semi-permanent naturel",            True,  False, None),

        # ── Kiné Du Sport (historique) ──
        (e_kine,     1,  0, "Douleur lombaire persistante",      True,  False, 74),
        (e_kine,     3,  1, "Bilan après blessure genou",        True,  False, 67),
        (e_kine,     6,  3, "Massage post-marathon",             True,  False, 60),
        (e_kine,    10,  2, "Rééducation épaule",                True,  False, 53),
        (e_kine,    12,  4, "Étirements — running",              True,  False, 46),
        (e_kine,    14,  0, "Séance de suivi",                   True,  False, 39),
        # ── Kiné annulé ──
        (e_kine,     1,  0, "Annulé — guérison plus rapide",     False, True,  32),
        # ── Kiné à venir ──
        (e_kine,     1,  0, "Séance mensuelle de suivi",         False, False, None),
        (e_kine,     3,  1, "Bilan de fin de rééducation",       True,  False, None),
        (e_kine,     6,  3, "Massage avant compétition",         False, False, None),

        # ── Coach Yoga Rennes (historique) ──
        (e_yoga,     0,  0, "Débutante — premier cours",         True,  False, 72),
        (e_yoga,     2,  1, "",                                   True,  False, 65),
        (e_yoga,     4,  3, "Méditation du matin",               True,  False, 58),
        (e_yoga,     8,  2, "Yoga avancé — inversions",          True,  False, 51),
        (e_yoga,    11,  4, "Cours particulier — prépa examen",  True,  False, 44),
        (e_yoga,    13,  0, "",                                   True,  False, 37),
        # ── Yoga à venir ──
        (e_yoga,     0,  1, "Cours intermédiaire",               False, False, None),
        (e_yoga,     2,  3, "Séance méditation",                 True,  False, None),
    ]

    # Compteur d'heure décalé par entreprise pour éviter les doublons de créneaux passés
    past_hour_counters = {e.idPro: 9 for e in entreprises}

    reservations = []
    for e, c_idx, p_idx, commentaire, statut, estAnnulee, days_ago in specs:
        client     = clients[c_idx % len(clients)]
        prestation = prestations_by_pro[e.idPro][p_idx % len(prestations_by_pro[e.idPro])]

        if days_ago is not None:
            # Créneau passé dédié
            hour = past_hour_counters[e.idPro]
            past_hour_counters[e.idPro] = (hour % 17) + 9  # rotation entre 9h et 17h
            creneau = past_slot(e.idPro, days_ago, hour)
            date_creation = creneau.dateHeureDebut - timedelta(days=random.randint(1, 7))
        else:
            # Créneau futur disponible
            creneau      = pop_future(e.idPro)
            date_creation = TODAY - timedelta(hours=random.randint(1, 72))

        reservations.append(Reservation(
            idPro=e.idPro,
            idClient=client.idClient,
            idPrestation=prestation.idPrestation,
            idCreneau=creneau.idCreneau if creneau else None,
            commentaireClient=commentaire,
            statut=statut,
            estAnnulee=estAnnulee,
            dateCreation=date_creation,
        ))

    db.session.add_all(reservations)
    db.session.commit()

    # ════════════════════════════════════════
    #  9. LOGS EMAIL (EventEmail)
    # ════════════════════════════════════════
    client_by_id = {c.idClient: c for c in clients}
    logs = []
    for res in reservations:
        if res.estAnnulee:
            # Email de confirmation envoyé lors de la réservation, puis email d'annulation
            logs.append(EventEmail(
                idReservation=res.idReservation,
                email=client_by_id[res.idClient].email,
                typeEmail="confirmation",
                dateEnvoi=res.dateCreation + timedelta(minutes=2),
                statutEnvoi=True,
            ))
            logs.append(EventEmail(
                idReservation=res.idReservation,
                email=client_by_id[res.idClient].email,
                typeEmail="annulation",
                dateEnvoi=res.dateCreation + timedelta(days=random.randint(1, 5)),
                statutEnvoi=True,
            ))
        else:
            # Simulation : quelques emails n'ont pas abouti (problème SMTP simulé)
            sent = random.random() > 0.08
            logs.append(EventEmail(
                idReservation=res.idReservation,
                email=client_by_id[res.idClient].email,
                typeEmail="confirmation",
                dateEnvoi=res.dateCreation + timedelta(minutes=2),
                statutEnvoi=sent,
            ))
    db.session.add_all(logs)
    db.session.commit()

    # ════════════════════════════════════════
    #  10. ÉVÉNEMENTS BLOQUANTS
    # ════════════════════════════════════════
    evenements = [
        # Passés
        Evenement(idPro=e_coiffure.idPro, titre="Fermeture annuelle été",
                  description="Congés annuels du 1er au 15 août.",
                  dateDebut=TODAY - timedelta(days=60),
                  dateFin=TODAY   - timedelta(days=45),
                  typeEvenement="Conges"),
        Evenement(idPro=e_barber.idPro,  titre="Formation coupe tendance",
                  description="Fermeture pour formation professionnelle.",
                  dateDebut=TODAY - timedelta(days=50),
                  dateFin=TODAY   - timedelta(days=48),
                  typeEvenement="Fermeture"),
        Evenement(idPro=e_kine.idPro,    titre="Congrès kinésithérapie",
                  description="Participation au congrès national.",
                  dateDebut=TODAY - timedelta(days=30),
                  dateFin=TODAY   - timedelta(days=28),
                  typeEvenement="Evenement"),

        # À venir
        Evenement(idPro=e_coiffure.idPro, titre="Journée Découverte",
                  description="−20 % sur toutes les colorations. Sur RDV uniquement.",
                  dateDebut=TODAY + timedelta(days=7),
                  dateFin=TODAY   + timedelta(days=7, hours=9),
                  typeEvenement="Promotion"),
        Evenement(idPro=e_barber.idPro,  titre="Nocturne Barbier",
                  description="Ouverture exceptionnelle jusqu'à 21h avec un verre offert.",
                  dateDebut=TODAY + timedelta(days=10),
                  dateFin=TODAY   + timedelta(days=10, hours=5),
                  typeEvenement="Evenement"),
        Evenement(idPro=e_zen.idPro,     titre="Semaine du bien-être",
                  description="Offres spéciales sur les massages et soins visage.",
                  dateDebut=TODAY + timedelta(days=14),
                  dateFin=TODAY   + timedelta(days=21),
                  typeEvenement="Promotion"),
        Evenement(idPro=e_ongles.idPro,  titre="Atelier Nail Art Automne",
                  description="Démonstration gratuite — nouvelles tendances nail art.",
                  dateDebut=TODAY + timedelta(days=12),
                  dateFin=TODAY   + timedelta(days=12, hours=3),
                  typeEvenement="Atelier"),
        Evenement(idPro=e_kine.idPro,    titre="Congés Toussaint",
                  description="Cabinet fermé du 28 octobre au 4 novembre.",
                  dateDebut=TODAY + timedelta(days=30),
                  dateFin=TODAY   + timedelta(days=37),
                  typeEvenement="Conges"),
        Evenement(idPro=e_yoga.idPro,    titre="Stage Yoga Intensif",
                  description="Week-end de pratique intensive — inscriptions ouvertes.",
                  dateDebut=TODAY + timedelta(days=18),
                  dateFin=TODAY   + timedelta(days=19),
                  typeEvenement="Atelier"),
    ]
    db.session.add_all(evenements)
    db.session.commit()

    # ════════════════════════════════════════
    #  Résumé
    # ════════════════════════════════════════
    print(f"  {Utilisateur.query.count()} utilisateurs")
    print(f"  {Entreprise.query.count()} entreprises")
    print(f"  {Prestation.query.count()} prestations")
    print(f"  {Creneau.query.count()} créneaux")
    print(f"  {Reservation.query.count()} réservations "
          f"({Reservation.query.filter_by(estAnnulee=True).count()} annulées)")
    print(f"  {EventEmail.query.count()} logs email")
    print(f"  {Evenement.query.count()} événements")
    print("Seed terminé avec succès.")


# Exécution manuelle : python -m src.seed
if __name__ == "__main__":
    from src.app import create_app
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        run_seed()
