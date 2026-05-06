# -*- coding: utf-8 -*-
"""
Modèles SQLAlchemy de l'application Book By Click.

Chaque classe correspond à une table PostgreSQL.
Les relations entre tables sont gérées via les backrefs SQLAlchemy,
ce qui permet de naviguer dans les deux sens sans requête supplémentaire.
"""

from src.extension import db


class TypeUtilisateur(db.Model):
    """
    Table de référence des rôles utilisateurs.

    Valeurs attendues : 'client', 'pro', 'admin'.
    Utilisée pour la gestion des droits d'accès.
    """

    __tablename__ = "typeutilisateur"

    idType      = db.Column(db.Integer, primary_key=True)
    role        = db.Column(db.String(), nullable=False)
    description = db.Column(db.String(), nullable=False)

    utilisateurs = db.relationship('Utilisateur', backref='type')


class Utilisateur(db.Model):
    """
    Représente tout utilisateur de la plateforme : client, gérant ou administrateur.

    Le champ estGerant distingue les professionnels des clients simples.
    Le mot de passe n'est jamais stocké en clair (motDePasseHash via werkzeug).
    Les champs resetToken / resetTokenExpiry gèrent la réinitialisation du mot de passe.
    """

    __tablename__ = "utilisateur"

    idClient          = db.Column(db.Integer, primary_key=True)
    nom               = db.Column(db.String(), nullable=False)
    prenom            = db.Column(db.String(), nullable=False)
    dateNaissance     = db.Column(db.Date, nullable=False)
    email             = db.Column(db.String(), nullable=False)
    motDePasseHash    = db.Column(db.String(), nullable=False)
    estGerant         = db.Column(db.Boolean, nullable=False)
    estBloque         = db.Column(db.Boolean, nullable=False, default=False, server_default='false')
    telephone         = db.Column(db.String(), nullable=False)
    dateInscription   = db.Column(db.DateTime, nullable=False)
    idTypeUtilisateur = db.Column(db.Integer, db.ForeignKey('typeutilisateur.idType'), nullable=False)

    # Champs de réinitialisation du mot de passe (token à usage unique, durée 1h)
    resetToken       = db.Column(db.String(), nullable=True)
    resetTokenExpiry = db.Column(db.DateTime, nullable=True)

    entreprises  = db.relationship('Entreprise', backref='gerant')
    reservations = db.relationship('Reservation', backref='client')


class Entreprise(db.Model):
    """
    Représente un établissement professionnel inscrit sur la plateforme.

    Le slugPublic est un identifiant URL unique utilisé pour la page publique
    de l'entreprise (ex: /entreprise/chez-marie-coiffure).
    Une entreprise appartient à un seul gérant (Utilisateur avec estGerant=True).
    """

    __tablename__ = "entreprise"

    idPro         = db.Column(db.Integer, primary_key=True)
    nomEntreprise = db.Column(db.String(), nullable=False)
    nomSecteur    = db.Column(db.String(), nullable=False)
    idGerant      = db.Column(db.Integer, db.ForeignKey('utilisateur.idClient'), nullable=False)
    slugPublic    = db.Column(db.String(), nullable=False)
    adresse       = db.Column(db.String(), nullable=False)
    codePostal    = db.Column(db.String(), nullable=False)
    ville         = db.Column(db.String(), nullable=False)
    pays          = db.Column(db.String(), nullable=False)

    creneaus     = db.relationship('Creneau',      backref='entreprise')
    reservations = db.relationship('Reservation',  backref='entreprise')
    prestations  = db.relationship('Prestation',   backref='entreprise')
    evenements   = db.relationship('Evenement',    backref='entreprise')
    semainestype = db.relationship('SemaineType',  backref='entreprise')


class Prestation(db.Model):
    """
    Service proposé par une entreprise (ex : coupe femme, massage, manucure).

    La durée en minutes est utilisée pour calculer les chevauchements de créneaux
    lors d'une réservation.
    """

    __tablename__ = "prestation"

    idPrestation = db.Column(db.Integer, primary_key=True)
    idPro        = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    libelle      = db.Column(db.String)
    dureeMinutes = db.Column(db.Integer, nullable=False)
    tarif        = db.Column(db.Numeric(10, 2))

    reservations = db.relationship('Reservation', backref='prestation')


class Creneau(db.Model):
    """
    Plage horaire de disponibilité d'une entreprise.

    statut=True  → créneau disponible à la réservation.
    statut=False → créneau occupé ou bloqué (événement, réservation).

    Un créneau peut être bloqué par une réservation (idCreneau dans Reservation)
    ou par un événement (via la logique d'Evenement).
    """

    __tablename__ = "creneau"

    idCreneau         = db.Column(db.Integer, primary_key=True)
    idPro             = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    dateHeureDebut    = db.Column(db.DateTime, nullable=False)
    dateHeureFin      = db.Column(db.DateTime, nullable=False)
    statut            = db.Column(db.Boolean, nullable=False)
    nbMaxReservations = db.Column(db.Integer, nullable=False, default=1, server_default='1')


class Reservation(db.Model):
    """
    Rendez-vous entre un client et une entreprise pour une prestation donnée.

    statut=True  → réservation confirmée par le professionnel.
    statut=False → en attente de confirmation.
    estAnnulee   → indique une annulation (prioritaire sur statut).

    idCreneau est nullable pour les réservations créées manuellement par le pro
    ou pour les données de test sans créneau associé.
    """

    __tablename__ = "reservation"

    idReservation     = db.Column(db.Integer, primary_key=True)
    idPro             = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    idClient          = db.Column(db.Integer, db.ForeignKey('utilisateur.idClient'), nullable=False)
    idPrestation      = db.Column(db.Integer, db.ForeignKey('prestation.idPrestation'), nullable=False)
    idCreneau         = db.Column(db.Integer, db.ForeignKey('creneau.idCreneau'), nullable=True)
    commentaireClient = db.Column(db.String())
    statut            = db.Column(db.Boolean, nullable=False)
    estAnnulee        = db.Column(db.Boolean, nullable=False, default=False, server_default='false')
    dateCreation      = db.Column(db.DateTime, nullable=False)

    EventEmails = db.relationship('EventEmail', backref='reservation')
    creneau     = db.relationship('Creneau',    backref='reservations')


class EventEmail(db.Model):
    """
    Journal des emails transactionnels liés aux réservations.

    Chaque envoi (confirmation, annulation) génère une entrée.
    statutEnvoi permet de détecter les échecs d'envoi.
    typeEmail : 'confirmation' | 'annulation'.
    """

    __tablename__ = "eventemail"

    idLog         = db.Column(db.Integer, primary_key=True)
    idReservation = db.Column(db.Integer, db.ForeignKey('reservation.idReservation'), nullable=False)
    email         = db.Column(db.String(), nullable=False)
    typeEmail     = db.Column(db.String(), nullable=True)
    dateEnvoi     = db.Column(db.DateTime, nullable=False)
    statutEnvoi   = db.Column(db.Boolean, nullable=False)


class Evenement(db.Model):
    """
    Événement bloquant créé par un professionnel (congés, fermeture exceptionnelle, promotion).

    Lors de la création, tous les créneaux disponibles dans la plage dateDebut–dateFin
    sont automatiquement bloqués. Les réservations existantes peuvent être annulées
    de force si le professionnel le demande explicitement.
    """

    __tablename__ = "evenement"

    idEvenement   = db.Column(db.Integer, primary_key=True)
    idPro         = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    titre         = db.Column(db.String(), nullable=False)
    description   = db.Column(db.String(), nullable=False)
    dateDebut     = db.Column(db.DateTime, nullable=False)
    dateFin       = db.Column(db.DateTime, nullable=False)
    typeEvenement = db.Column(db.String(), nullable=False)


class SemaineType(db.Model):
    """
    Modèle de semaine de travail d'une entreprise.

    joursPattern est une chaîne de 7 caractères '0'/'1' représentant
    les jours ouverts de lundi (index 0) à dimanche (index 6).
    Exemple : '1111100' = ouvert du lundi au vendredi.

    heureDebut / heureFin définissent la plage horaire journalière
    utilisée lors de la génération automatique de créneaux.
    """

    __tablename__ = "semainetype"

    idSemaineType = db.Column(db.Integer, primary_key=True)
    idPro         = db.Column(db.Integer, db.ForeignKey('entreprise.idPro'), nullable=False)
    libelle       = db.Column(db.String())
    description   = db.Column(db.String())
    joursPattern  = db.Column(db.String())
    heureDebut    = db.Column(db.String(), nullable=False, default="09:00", server_default="09:00")
    heureFin      = db.Column(db.String(), nullable=False, default="18:00", server_default="18:00")
