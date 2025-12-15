from app import create_app
from models import db, Utilisateur, TypeUtilisateur, Entreprise, Creneau, Prestation, Reservation, EventEmail, Evenement, SemaineType
from datetime import datetime, date, timedelta

app = create_app()

with app.app_context():

    print("🧹 Réinitialisation de la base…")
    db.drop_all()
    db.create_all()

    # ============================
    #  TYPE UTILISATEUR
    # ============================
    admin = TypeUtilisateur(role="admin", description="Administrateur du système")
    client = TypeUtilisateur(role="client", description="Client de base")
    db.session.add_all([admin, client])
    db.session.commit()

    # ============================
    #  UTILISATEURS
    # ============================
    u1 = Utilisateur(
        nom="Dupont",
        prenom="Jean",
        dateNaissance=date(1990, 5, 20),
        email="jean.dupont@example.com",
        motDePasseHash="hash123",
        telephone="0601020304",
        dateInscription=datetime.now(),
        idTypeUtilisateur=admin.idType
    )

    u2 = Utilisateur(
        nom="Martin",
        prenom="Claire",
        dateNaissance=date(1995, 3, 15),
        email="claire.martin@example.com",
        motDePasseHash="hash456",
        telephone="0605060708",
        dateInscription=datetime.now(),
        idTypeUtilisateur=client.idType
    )

    db.session.add_all([u1, u2])
    db.session.commit()

    # ============================
    #  ENTREPRISE
    # ============================
    e1 = Entreprise(
        nomEntreprise="Salon Beauté Zen",
        nomSecteur="Bien-être",
        idGerant=u1.idClient,
        slugPublic="beaute-zen",
        adresse="12 rue de la Paix",
        codePostal="75001",
        ville="Paris",
        pays="France"
    )

    db.session.add(e1)
    db.session.commit()

    # ============================
    #  PRESTATIONS
    # ============================
    p1 = Prestation(
        idPro=e1.idPro,
        libelle="Massage relaxant",
        dureeMinutes=60,
        tarif=59.90
    )

    p2 = Prestation(
        idPro=e1.idPro,
        libelle="Soin visage complet",
        dureeMinutes=45,
        tarif=39.90
    )

    db.session.add_all([p1, p2])
    db.session.commit()

    # ============================
    #  CRENEAUX
    # ============================
    c1 = Creneau(
        idPro=e1.idPro,
        dateHeureDebut=datetime.now() + timedelta(days=1),
        dateHeureFin=datetime.now() + timedelta(days=1, hours=1),
        statut=True
    )
    c2 = Creneau(
        idPro=e1.idPro,
        dateHeureDebut=datetime.now() + timedelta(days=2),
        dateHeureFin=datetime.now() + timedelta(days=2, hours=1),
        statut=True
    )

    db.session.add_all([c1, c2])
    db.session.commit()

    # ============================
    #  RÉSERVATION
    # ============================
    r1 = Reservation(
        idPro=e1.idPro,
        idClient=u2.idClient,
        idPrestation=p1.idPrestation,
        commentaireClient="Super hâte de tester !",
        statut=True,
        dateCreation=datetime.now()
    )

    db.session.add(r1)
    db.session.commit()

    # ============================
    #  EMAIL D'ÉVÈNEMENT
    # ============================
    mail1 = EventEmail(
        idReservation=r1.idReservation,
        email=u2.email,
        dateEnvoi=datetime.now(),
        statutEnvoi=True
    )

    db.session.add(mail1)
    db.session.commit()

    # ============================
    #  ÉVÈNEMENT
    # ============================
    ev1 = Evenement(
        idPro=e1.idPro,
        titre="Journée Découverte",
        description="Réductions sur toutes les prestations !",
        dateDebut=datetime.now() + timedelta(days=7),
        dateFin=datetime.now() + timedelta(days=7, hours=4),
        typeEvenement="Promotion"
    )

    db.session.add(ev1)
    db.session.commit()

    # ============================
    #  SEMAINE TYPE
    # ============================
    st1 = SemaineType(
        idPro=e1.idPro,
        libelle="Semaine normale",
        description="Ouverture standard",
        joursPattern="1111100"  # Lundi → Vendredi
    )

    db.session.add(st1)
    db.session.commit()

    print("🎉 Données de test insérées avec succès !")
