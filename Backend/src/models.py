from extension import db


class Entreprise(db.Model):
    __tablename__ = "entreprise"
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
    prestations = db.relationship('Prestation', backref='entreprise')
    evenements = db.relationship('Evenement', backref='entreprise')
    semainestype = db.relationship('SemaineType', backref='entreprise')

class Evenement(db.Model):
    __tablename__ = "evenement"
    idEvenement = db.Column(db.Integer, primary_key=True)   
    idPro = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    titre = db.Column(db.String(), nullable=False)
    description = db.Column(db.String(), nullable=False)
    dateDebut = db.Column(db.DateTime, nullable=False)
    dateFin = db.Column(db.DateTime, nullable=False)
    typeEvenement = db.Column(db.String(), nullable=False)

class SemaineType(db.Model):
    __tablename__ = "semainetype"
    idSemaineType = db.Column(db.Integer, primary_key=True)
    idPro = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    libelle = db.Column(db.String())
    description = db.Column(db.String())
    joursPattern = db.Column(db.String())







class Utilisateur(db.Model):
    __tablename__ = "utilisateur"
    idClient = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(), nullable=False)
    prenom = db.Column(db.String(), nullable=False)
    dateNaissance = db.Column(db.Date, nullable=False)
    email = db.Column(db.String(), nullable=False)
    motDePasseHash = db.Column(db.String(), nullable=False)
    telephone = db.Column(db.String(), nullable=False)
    dateInscription = db.Column(db.DateTime, nullable=False)
    idTypeUtilisateur = db.Column(db.Integer, db.ForeignKey('typeutilisateur.idType'), nullable=False)
    

    entreprises = db.relationship('Entreprise', backref='gerant')
    reservations = db.relationship('Reservation', backref='client')

class TypeUtilisateur(db.Model):
    __tablename__ = "typeutilisateur"
    idType = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(), nullable=False)
    description = db.Column(db.String(), nullable=False)

    utilisateurs = db.relationship('Utilisateur', backref='type')


class EventEmail(db.Model):
    __tablename__ = "eventemail"
    idLog = db.Column(db.Integer, primary_key=True)
    idReservation = db.Column(db.Integer, db.ForeignKey('reservation.idReservation'), nullable=False)
    email = db.Column(db.String(), nullable=False)
    dateEnvoi = db.Column(db.DateTime, nullable=False)
    statutEnvoi = db.Column(db.Boolean, nullable=False)

class Creneau(db.Model):
    __tablename__ = "creneau"
    idCreneau = db.Column(db.Integer, primary_key=True)
    idPro = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    dateHeureDebut = db.Column(db.DateTime, nullable=False)
    dateHeureFin = db.Column(db.DateTime, nullable=False)
    statut = db.Column(db.Boolean, nullable=False)



class Prestation(db.Model):
    __tablename__ = "prestation"
    idPrestation = db.Column(db.Integer, primary_key=True)
    idPro = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    libelle = db.Column(db.String)
    dureeMinutes = db.Column(db.Integer, nullable=False)
    tarif = db.Column(db.Numeric(10,2))

    reservations = db.relationship('Reservation', backref="prestation")

class Reservation(db.Model):
    __tablename__ = "reservation"
    idReservation = db.Column(db.Integer, primary_key=True)
    idPro = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    idClient = db.Column(db.Integer, db.ForeignKey('utilisateur.idClient'), nullable=False)
    idPrestation = db.Column(db.Integer, db.ForeignKey('prestation.idPrestation'), nullable=False)
    commentaireClient = db.Column(db.String())
    statut = db.Column(db.Boolean, nullable=False)
    dateCreation = db.Column(db.DateTime, nullable=False)

    EventEmails = db.relationship('EventEmail', backref='reservation')