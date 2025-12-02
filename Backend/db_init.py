from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app= Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = '' #path to database and its name
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app) 

class Entreprise(db.model):
    idPro = db.Column(db.Integer, primary_key=True)
    nomEntreprise = db.Column(db.String(), nullable=False)
    nomSecteur = db.Column(db.String(), nullable=False)
    idGerant = db.Column(db.Integer, db.ForeignKey('utilisateur.idClient'), nullable=False)
    slugPublic = db.Column(db.String(), nullable=False)
    adresse = db.Column(db.String(), nullable=False)
    codePostal = db.Column(db.String(), nullable=False)
    ville = db.Column(db.String(), nullable=False)
    pays = db.Column(db.String(), nullable=False)

    creneaus = db.relationship('Creneau', backref='entreprise')
    reservations = db.relationship('Reservation', backref='entreprise')
    prestations = db.relationsship('Prestation', backref='entreprise')

class Utilisateur(db.Model):
    idClient = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(), nullable=False)
    prenom = db.Column(db.String(), nullable=False)
    dateNaissance = db.Column(db.Date, nullable=False)
    email = db.Column(db.String(), nullable=False)
    motDePasseHash = db.Column(db.String(), nullable=False)
    telephone = db.Column(db.String(), nullable=False)
    dateInscription = db.Column(db.DateTime, nullable=False)
    

    entreprises = db.relationship('Entreprise', backref='gerant')
    reservations = db.relationship('Reservation', backref='client')

class LogEmail(db.Model):
    idLog = db.Column(db.Integer, primary_key=True)
    idReservation = db.Column(db.Integer, db.ForeignKey('reservation.idReservation'), nullable=False)
    email = db.Column(db.String(), nullable=False)
    dateEnvoi = db.Column(db.DateTime, nullable=False)
    statutEnvoi = db.Column(db.Boolean, nullable=False)

class Creneau(db.Model):
    idCreneau = db.Column(db.Integer, primary_key=True)
    idPro = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    dateHeureDebut = db.Column(db.DateTime, nullable=False)
    dateHeureFin = db.Column(db.DateTime, nullable=False)
    statut = db.Column(db.Boolean, nullable=False)



class Prestation(db.Model):
    idPrestation = db.Column(db.Integer, primary_key=True)
    idPro = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    libelle = db.Column(db.String)
    dureeMinutes = db.Column(db.Integer, nullable=False)
    tarif = db.Column(db.Numeric(10,2))

    reservations = db.relationship('Reservation', backref="prestation")

class Reservation(db.Model):
    idReservation = db.Column(db.Integer, primary_key=True)
    idPro = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    idClient = db.Column(db.Integer, db.ForeignKey('utilisateur.idClient'), nullable=False)
    idPrestation = db.Column(db.Integer, db.ForeignKey('prestation.idPrestation'), nullable=False)
    commentaireClient = db.Column(db.String())
    statut = db.Column(db.Boolean, nullable=False)
    dateCreation = db.Column(db.DateTime, nullable=False)

    LogEmails = db.relationship('LogEmail', backref='reservation')

    






















