import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_contact_email(name, email, phone, message):
    """
    Envoie un email depuis le formulaire de contact

    Args:
        name (str): Nom du client
        email (str): Email du client
        phone (str): Téléphone du client
        message (str): Message du client

    Returns:
        bool: True si l'envoi a réussi, False sinon
    """
    try:
        # Créer le message
        msg = MIMEMultipart()
        msg['From'] = 'Book By Click <noreply@bookbyclick.com>'
        msg['To'] = 'delacroixarthur016@gmail.com'
        msg['Subject'] = f'Nouveau message de contact - {name}'

        # Corps du message
        body = f"""
Vous avez reçu un nouveau message via le formulaire de contact :

Nom: {name}
Email: {email}
Téléphone: {phone}

Message:
{message}

---
Vous pouvez répondre directement à : {email}
"""

        msg.attach(MIMEText(body, 'plain'))

        # Connexion au serveur SMTP local (le conteneur mail)
        server = smtplib.SMTP('localhost', 25, timeout=10)
        server.send_message(msg)
        server.quit()

        print(f"Email envoyé avec succès pour {name}")
        return True

    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email: {e}")
        return False
