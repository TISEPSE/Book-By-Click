# -*- coding: utf-8 -*-
from src.models import db, Utilisateur, TypeUtilisateur, Entreprise, Creneau, Prestation, Reservation, EventEmail, Evenement, SemaineType
from werkzeug.security import generate_password_hash
from datetime import datetime, date, timedelta


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
    u1 = Utilisateur(
        nom="Dupont",
        prenom="Jean",
        dateNaissance=date(1990, 5, 20),
        email="jean.dupont@example.com",
        motDePasseHash=generate_password_hash("password123"),
        telephone="0601020304",
        dateInscription=datetime.now(),
        idTypeUtilisateur=admin.idType,
        estGerant=False
    )

    u2 = Utilisateur(
        nom="Martin",
        prenom="Claire",
        dateNaissance=date(1995, 3, 15),
        email="claire.martin@example.com",
        motDePasseHash=generate_password_hash("password123"),
        telephone="0605060708",
        dateInscription=datetime.now(),
        idTypeUtilisateur=client.idType,
        estGerant=False
    )

    db.session.add_all([u1, u2])
    db.session.commit()

    # ============================
    #  ENTREPRISE
    # ============================
    e1 = Entreprise(
        nomEntreprise="Chez Marie Coiffure",
        nomSecteur="Coiffeur",
        idGerant=u1.idClient,
        slugPublic="chez-marie-coiffure",
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
        libelle="Coupe femme",
        dureeMinutes=45,
        tarif=35.00
    )

    p2 = Prestation(
        idPro=e1.idPro,
        libelle="Coupe homme",
        dureeMinutes=30,
        tarif=20.00
    )

    p3 = Prestation(
        idPro=e1.idPro,
        libelle="Coloration complete",
        dureeMinutes=90,
        tarif=65.00
    )

    db.session.add_all([p1, p2, p3])
    db.session.commit()

    # ============================
    #  CRENEAUX (2 prochaines semaines, du lundi au samedi)
    # ============================
    creneaux = []
    now = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    for day_offset in range(1, 15):
        jour = now + timedelta(days=day_offset)
        # Pas de creneaux le dimanche (weekday 6)
        if jour.weekday() == 6:
            continue
        # Samedi : 9h-13h, sinon 9h-18h
        start_hour = 9
        end_hour = 13 if jour.weekday() == 5 else 18
        hour = start_hour
        while hour < end_hour:
            debut = jour.replace(hour=hour, minute=0)
            fin = jour.replace(hour=hour + 1, minute=0)
            creneaux.append(Creneau(
                idPro=e1.idPro,
                dateHeureDebut=debut,
                dateHeureFin=fin,
                statut=True
            ))
            hour += 1

    db.session.add_all(creneaux)
    db.session.commit()

    # ============================
    #  RESERVATION
    # ============================
    r1 = Reservation(
        idPro=e1.idPro,
        idClient=u2.idClient,
        idPrestation=p1.idPrestation,
        commentaireClient="Super hate de tester !",
        statut=True,
        dateCreation=datetime.now()
    )

    db.session.add(r1)
    db.session.commit()

    # ============================
    #  EMAIL D'EVENEMENT
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
    #  EVENEMENT
    # ============================
    ev1 = Evenement(
        idPro=e1.idPro,
        titre="Journee Decouverte",
        description="Reductions sur toutes les prestations !",
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
        joursPattern="1111100"  # Lundi - Vendredi
    )

    db.session.add(st1)
    db.session.commit()

    print("🎉 Donnees de test inserees avec succes !")


# Permet d'executer le seed manuellement: python -m src.seed
if __name__ == "__main__":
    from src.app import create_app
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        run_seed()
