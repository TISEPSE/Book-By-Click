# -*- coding: utf-8 -*-
from src.models import db, Utilisateur, TypeUtilisateur, Entreprise, Creneau, Prestation, Reservation, EventEmail, Evenement, SemaineType
from werkzeug.security import generate_password_hash
from datetime import datetime, date, timedelta


def build_week_slots(id_pro, days=21, start_hour=9, end_hour=18, saturday_end_hour=14, nb_max=1):
    slots = []
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    for day_offset in range(1, days + 1):
        day = today + timedelta(days=day_offset)
        # weekday(): 0=lundi ... 6=dimanche
        if day.weekday() == 6:
            continue

        day_end = saturday_end_hour if day.weekday() == 5 else end_hour
        for hour in range(start_hour, day_end):
            slots.append(
                Creneau(
                    idPro=id_pro,
                    dateHeureDebut=day.replace(hour=hour, minute=0),
                    dateHeureFin=day.replace(hour=hour + 1, minute=0),
                    statut=True,
                    nbMaxReservations=nb_max,
                )
            )

    return slots


def run_seed():
    """Initialise les donnees de base si la DB est vide"""

    # Verifie si les donnees existent deja
    if TypeUtilisateur.query.count() > 0:
        print("Donnees deja presentes, seed ignore")
        return

    print("Initialisation des donnees de base...")

    # ============================
    #  TYPE UTILISATEUR
    # ============================
    admin = TypeUtilisateur(role="admin", description="Administrateur du systeme")
    pro = TypeUtilisateur(role="pro", description="Gerant d'une entreprise")
    client = TypeUtilisateur(role="client", description="Client de base")
    db.session.add_all([admin, pro, client])
    db.session.commit()

    # ============================
    #  UTILISATEURS
    # ============================
    users = [
        Utilisateur(
            nom="Admin",
            prenom="Alice",
            dateNaissance=date(1988, 1, 12),
            email="alice.admin@example.com",
            motDePasseHash=generate_password_hash("password123"),
            telephone="0600000001",
            dateInscription=datetime.now() - timedelta(days=240),
            idTypeUtilisateur=admin.idType,
            estGerant=False,
            estBloque=False,
        ),
        Utilisateur(
            nom="Leroy",
            prenom="Marie",
            dateNaissance=date(1991, 4, 2),
            email="marie.leroy@example.com",
            motDePasseHash=generate_password_hash("password123"),
            telephone="0600000002",
            dateInscription=datetime.now() - timedelta(days=170),
            idTypeUtilisateur=pro.idType,
            estGerant=True,
            estBloque=False,
        ),
        Utilisateur(
            nom="Bernard",
            prenom="Nicolas",
            dateNaissance=date(1987, 7, 17),
            email="nicolas.bernard@example.com",
            motDePasseHash=generate_password_hash("password123"),
            telephone="0600000003",
            dateInscription=datetime.now() - timedelta(days=160),
            idTypeUtilisateur=pro.idType,
            estGerant=True,
            estBloque=False,
        ),
        Utilisateur(
            nom="Roux",
            prenom="Sophie",
            dateNaissance=date(1993, 2, 23),
            email="sophie.roux@example.com",
            motDePasseHash=generate_password_hash("password123"),
            telephone="0600000004",
            dateInscription=datetime.now() - timedelta(days=150),
            idTypeUtilisateur=pro.idType,
            estGerant=True,
            estBloque=False,
        ),
    ]

    client_specs = [
        ("Martin", "Claire", date(1995, 3, 15), "claire.martin@example.com", "0605060708", False),
        ("Dubois", "Thomas", date(1992, 11, 5), "thomas.dubois@example.com", "0605060709", False),
        ("Petit", "Camille", date(1998, 6, 8), "camille.petit@example.com", "0605060710", False),
        ("Moreau", "Hugo", date(1990, 9, 12), "hugo.moreau@example.com", "0605060711", False),
        ("Lefevre", "Ines", date(1996, 12, 1), "ines.lefevre@example.com", "0605060712", False),
        ("Garcia", "Lucas", date(1989, 8, 21), "lucas.garcia@example.com", "0605060713", False),
        ("Faure", "Emma", date(2000, 5, 30), "emma.faure@example.com", "0605060714", False),
        ("Noel", "Jules", date(1997, 1, 19), "jules.noel@example.com", "0605060715", True),
    ]

    for idx, spec in enumerate(client_specs):
        nom, prenom, naissance, email, telephone, bloque = spec
        users.append(
            Utilisateur(
                nom=nom,
                prenom=prenom,
                dateNaissance=naissance,
                email=email,
                motDePasseHash=generate_password_hash("password123"),
                telephone=telephone,
                dateInscription=datetime.now() - timedelta(days=120 - idx * 5),
                idTypeUtilisateur=client.idType,
                estGerant=False,
                estBloque=bloque,
            )
        )

    db.session.add_all(users)
    db.session.commit()

    pros = [u for u in users if u.estGerant]
    clients = [u for u in users if not u.estGerant and u.idTypeUtilisateur == client.idType]

    # ============================
    #  ENTREPRISES
    # ============================
    entreprises = [
        Entreprise(
            nomEntreprise="Chez Marie Coiffure",
            nomSecteur="Coiffeur",
            idGerant=pros[0].idClient,
            slugPublic="chez-marie-coiffure",
            adresse="12 rue de la Paix",
            codePostal="75001",
            ville="Paris",
            pays="France",
        ),
        Entreprise(
            nomEntreprise="Barber Shop Bernard",
            nomSecteur="Barbier",
            idGerant=pros[1].idClient,
            slugPublic="barber-shop-bernard",
            adresse="5 avenue Victor Hugo",
            codePostal="69002",
            ville="Lyon",
            pays="France",
        ),
        Entreprise(
            nomEntreprise="Zen Beauty Studio",
            nomSecteur="Esthetique",
            idGerant=pros[2].idClient,
            slugPublic="zen-beauty-studio",
            adresse="33 boulevard National",
            codePostal="13001",
            ville="Marseille",
            pays="France",
        ),
        Entreprise(
            nomEntreprise="Atelier Ongles Lumiere",
            nomSecteur="Manucure",
            idGerant=pros[0].idClient,
            slugPublic="atelier-ongles-lumiere",
            adresse="77 rue Faidherbe",
            codePostal="59800",
            ville="Lille",
            pays="France",
        ),
    ]

    db.session.add_all(entreprises)
    db.session.commit()

    # ============================
    #  PRESTATIONS
    # ============================
    prestation_specs = {
        "chez-marie-coiffure": [
            ("Coupe femme", 45, 35.00),
            ("Coupe homme", 30, 22.00),
            ("Coloration complete", 90, 68.00),
            ("Brushing", 30, 24.00),
        ],
        "barber-shop-bernard": [
            ("Coupe de cheveux", 30, 25.00),
            ("Taille de barbe", 25, 18.00),
            ("Rituel barbe premium", 45, 35.00),
        ],
        "zen-beauty-studio": [
            ("Soin visage", 60, 55.00),
            ("Epilation jambes", 40, 29.00),
            ("Massage relaxant", 60, 65.00),
        ],
        "atelier-ongles-lumiere": [
            ("Pose vernis semi-permanent", 45, 32.00),
            ("Nail art", 60, 45.00),
            ("Depose + soin", 30, 20.00),
        ],
    }

    prestations = []
    for entreprise in entreprises:
        for libelle, duree, tarif in prestation_specs[entreprise.slugPublic]:
            prestations.append(
                Prestation(
                    idPro=entreprise.idPro,
                    libelle=libelle,
                    dureeMinutes=duree,
                    tarif=tarif,
                )
            )

    db.session.add_all(prestations)
    db.session.commit()

    # ============================
    #  CRENEAUX
    # ============================
    creneaux = []
    creneaux.extend(build_week_slots(entreprises[0].idPro, days=21, start_hour=9, end_hour=18, saturday_end_hour=14, nb_max=1))
    creneaux.extend(build_week_slots(entreprises[1].idPro, days=21, start_hour=10, end_hour=19, saturday_end_hour=15, nb_max=1))
    creneaux.extend(build_week_slots(entreprises[2].idPro, days=21, start_hour=9, end_hour=17, saturday_end_hour=13, nb_max=2))
    creneaux.extend(build_week_slots(entreprises[3].idPro, days=21, start_hour=10, end_hour=18, saturday_end_hour=14, nb_max=2))
    db.session.add_all(creneaux)
    db.session.commit()

    # Marquer quelques creneaux comme occupes
    occupied_slots = Creneau.query.order_by(Creneau.dateHeureDebut.asc()).limit(16).all()
    for slot in occupied_slots:
        slot.statut = False
    db.session.commit()

    # ============================
    #  RESERVATIONS
    # ============================
    entreprise_prestations = {}
    for entreprise in entreprises:
        entreprise_prestations[entreprise.idPro] = [
            p for p in prestations if p.idPro == entreprise.idPro
        ]

    reservations = []
    reservation_specs = [
        (entreprises[0].idPro, 0, 0, "Premier rendez-vous"),
        (entreprises[0].idPro, 1, 1, "Besoin d'une coupe rapide"),
        (entreprises[1].idPro, 2, 0, "Taille courte et propre"),
        (entreprises[1].idPro, 3, 2, "Rituel complet"),
        (entreprises[2].idPro, 4, 1, "Preferer en fin de journee"),
        (entreprises[2].idPro, 5, 2, "Massage detente"),
        (entreprises[3].idPro, 6, 0, "Semi permanent nude"),
        (entreprises[3].idPro, 0, 1, "Nail art discret"),
        (entreprises[0].idPro, 2, 3, "Brushing pour evenement"),
        (entreprises[2].idPro, 1, 0, "Soin avant week-end"),
        (entreprises[1].idPro, 4, 1, "Barbe uniquement"),
        (entreprises[3].idPro, 3, 2, "Depose + soin"),
    ]

    for idx, spec in enumerate(reservation_specs):
        id_pro, client_idx, prestation_idx, commentaire = spec
        selected_client = clients[client_idx % len(clients)]
        selected_prestation = entreprise_prestations[id_pro][prestation_idx]
        reservations.append(
            Reservation(
                idPro=id_pro,
                idClient=selected_client.idClient,
                idPrestation=selected_prestation.idPrestation,
                commentaireClient=commentaire,
                statut=(idx % 4 != 0),
                dateCreation=datetime.now() - timedelta(days=idx * 2),
            )
        )

    db.session.add_all(reservations)
    db.session.commit()

    # ============================
    #  EMAILS D'EVENEMENT
    # ============================
    event_emails = []
    client_by_id = {c.idClient: c for c in clients}
    for idx, reservation in enumerate(reservations):
        event_emails.append(
            EventEmail(
                idReservation=reservation.idReservation,
                email=client_by_id[reservation.idClient].email,
                dateEnvoi=reservation.dateCreation + timedelta(minutes=5),
                statutEnvoi=(idx % 5 != 0),
            )
        )

    db.session.add_all(event_emails)
    db.session.commit()

    # ============================
    #  EVENEMENTS
    # ============================
    evenements = [
        Evenement(
            idPro=entreprises[0].idPro,
            titre="Journee Decouverte",
            description="Reductions sur toutes les prestations.",
            dateDebut=datetime.now() + timedelta(days=5),
            dateFin=datetime.now() + timedelta(days=5, hours=6),
            typeEvenement="Promotion",
        ),
        Evenement(
            idPro=entreprises[1].idPro,
            titre="Nocturne du vendredi",
            description="Ouverture jusqu'a 21h avec boisson offerte.",
            dateDebut=datetime.now() + timedelta(days=9),
            dateFin=datetime.now() + timedelta(days=9, hours=4),
            typeEvenement="Evenement",
        ),
        Evenement(
            idPro=entreprises[2].idPro,
            titre="Semaine bien-etre",
            description="Offres speciales sur les soins visage et massages.",
            dateDebut=datetime.now() + timedelta(days=12),
            dateFin=datetime.now() + timedelta(days=18),
            typeEvenement="Promotion",
        ),
        Evenement(
            idPro=entreprises[3].idPro,
            titre="Atelier Nail Art",
            description="Demonstration gratuite des tendances du moment.",
            dateDebut=datetime.now() + timedelta(days=7),
            dateFin=datetime.now() + timedelta(days=7, hours=3),
            typeEvenement="Atelier",
        ),
    ]
    db.session.add_all(evenements)
    db.session.commit()

    # ============================
    #  SEMAINES TYPE
    # ============================
    semaines_type = [
        SemaineType(
            idPro=entreprises[0].idPro,
            libelle="Semaine standard",
            description="Ouverture du lundi au samedi.",
            joursPattern="1111110",
        ),
        SemaineType(
            idPro=entreprises[1].idPro,
            libelle="Semaine barbier",
            description="Ferme le dimanche, horaires etendus jeudi-vendredi.",
            joursPattern="1111110",
        ),
        SemaineType(
            idPro=entreprises[2].idPro,
            libelle="Semaine douceur",
            description="Lundi au samedi, fermeture plus tot.",
            joursPattern="1111110",
        ),
        SemaineType(
            idPro=entreprises[3].idPro,
            libelle="Semaine atelier",
            description="Ouvert du mardi au samedi.",
            joursPattern="0111110",
        ),
    ]
    db.session.add_all(semaines_type)
    db.session.commit()

    print("Donnees de test inserees avec succes.")


# Permet d'executer le seed manuellement: python -m src.seed
if __name__ == "__main__":
    from src.app import create_app
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        run_seed()
