# -*- coding: utf-8 -*-
"""
Service d'envoi d'emails transactionnels.

En développement, les emails sont interceptés par MailHog (accessible sur
http://localhost:8025) via le container Docker 'mail' sur le port SMTP 1025.
Aucun email réel n'est envoyé, ce qui permet de tester le flux complet
sans configurer de compte email externe.

Variables d'environnement :
    SMTP_HOST : hôte du serveur SMTP (défaut : 'mail', nom du service Docker)
    SMTP_PORT : port SMTP (défaut : 1025 pour MailHog)
"""

import smtplib
import os
from email.mime.text       import MIMEText
from email.mime.multipart  import MIMEMultipart

SMTP_HOST = os.getenv("SMTP_HOST", "mail")
SMTP_PORT = int(os.getenv("SMTP_PORT", "1025"))


def _send(msg):
    """
    Envoie un message MIME via le serveur SMTP configuré.

    Args:
        msg (MIMEMultipart): Message déjà construit prêt à l'envoi.

    Returns:
        bool: True si l'envoi a réussi, False en cas d'erreur réseau ou SMTP.
    """
    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Erreur SMTP ({SMTP_HOST}:{SMTP_PORT}) : {e}")
        return False


def send_confirmation_email(client, reservation, prestation, creneau):
    """
    Envoie un email de confirmation de réservation au client.

    L'email contient le récapitulatif complet du rendez-vous : prestation,
    date, durée, tarif et numéro de référence.

    Args:
        client      (Utilisateur) : Destinataire de l'email.
        reservation (Reservation) : Réservation nouvellement créée.
        prestation  (Prestation)  : Prestation réservée.
        creneau     (Creneau)     : Créneau horaire associé.

    Returns:
        bool: True si l'email a été transmis au serveur SMTP.
    """
    date_str = creneau.dateHeureDebut.strftime('%A %d %B %Y à %Hh%M')
    tarif    = float(prestation.tarif) if prestation.tarif else 0

    msg            = MIMEMultipart()
    msg['From']    = 'Book By Click <noreply@bookbyclick.com>'
    msg['To']      = client.email
    msg['Subject'] = f'Confirmation de votre réservation – {prestation.libelle}'
    msg.attach(MIMEText(f"""Bonjour {client.prenom},

Votre réservation a bien été enregistrée.

--- Récapitulatif ---
Prestation : {prestation.libelle}
Date       : {date_str}
Durée      : {prestation.dureeMinutes} min
Prix       : {tarif:.2f} €
Référence  : RDV-{reservation.idReservation:03d}

Votre rendez-vous est en attente de confirmation par le professionnel.

À bientôt,
L'équipe Book By Click
""", 'plain'))

    return _send(msg)


def send_cancellation_email(client, reservation, prestation, creneau):
    """
    Envoie un email d'annulation de réservation au client.

    Args:
        client      (Utilisateur)      : Destinataire de l'email.
        reservation (Reservation)      : Réservation annulée.
        prestation  (Prestation)       : Prestation concernée.
        creneau     (Creneau | None)   : Créneau associé, peut être None
                                         pour les réservations sans créneau.

    Returns:
        bool: True si l'email a été transmis au serveur SMTP.
    """
    date_str = creneau.dateHeureDebut.strftime('%A %d %B %Y à %Hh%M') if creneau else "date inconnue"

    msg            = MIMEMultipart()
    msg['From']    = 'Book By Click <noreply@bookbyclick.com>'
    msg['To']      = client.email
    msg['Subject'] = f'Annulation de votre réservation – {prestation.libelle}'
    msg.attach(MIMEText(f"""Bonjour {client.prenom},

Votre réservation a été annulée.

--- Récapitulatif ---
Prestation : {prestation.libelle}
Date       : {date_str}
Référence  : RDV-{reservation.idReservation:03d}

Si vous avez des questions, contactez-nous via le formulaire de contact.

À bientôt,
L'équipe Book By Click
""", 'plain'))

    return _send(msg)


def send_reset_password_email(email, reset_link):
    """
    Envoie un email contenant le lien de réinitialisation du mot de passe.

    Le lien est valable 1 heure. Passé ce délai, le token est invalidé
    côté serveur et l'utilisateur devra refaire une demande.

    Args:
        email      (str): Adresse email du destinataire.
        reset_link (str): URL complète avec le token de réinitialisation.

    Returns:
        bool: True si l'email a été transmis au serveur SMTP.
    """
    msg            = MIMEMultipart()
    msg['From']    = 'Book By Click <noreply@bookbyclick.com>'
    msg['To']      = email
    msg['Subject'] = 'Réinitialisation de votre mot de passe'
    msg.attach(MIMEText(f"""Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe Book By Click.
Cliquez sur le lien ci-dessous (valable 1 heure) :

{reset_link}

Si vous n'avez pas fait cette demande, ignorez cet email.

L'équipe Book By Click
""", 'plain'))

    return _send(msg)


def send_contact_email(name, email, phone, message, subject=""):
    """
    Transfère un message issu du formulaire de contact vers l'équipe Book By Click.

    Args:
        name    (str): Nom de l'expéditeur.
        email   (str): Adresse email de l'expéditeur.
        phone   (str): Numéro de téléphone (optionnel).
        message (str): Corps du message.
        subject (str): Sujet sélectionné dans le formulaire.

    Returns:
        bool: True si l'email a été transmis au serveur SMTP.
    """
    msg            = MIMEMultipart()
    msg['From']    = 'Book By Click <noreply@bookbyclick.com>'
    msg['To']      = 'contact@bookbyclick.com'
    msg['Subject'] = f'[Contact] {subject} – {name}'
    msg.attach(MIMEText(f"""Nouveau message reçu via le formulaire de contact :

Nom       : {name}
Email     : {email}
Téléphone : {phone or 'non renseigné'}
Sujet     : {subject or 'non renseigné'}

Message :
{message}

---
Répondre directement à : {email}
""", 'plain'))

    return _send(msg)
