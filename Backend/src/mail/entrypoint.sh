#!/bin/bash
set -e

echo "Configuration du serveur mail..."

# Attendre que le réseau soit prêt
sleep 2


if [ ! -z "$MAIL_DOMAIN" ]; then
    postconf -e "myhostname = mail.${MAIL_DOMAIN}"
    postconf -e "mydomain = ${MAIL_DOMAIN}"
fi


if [ ! -z "$RELAY_HOST" ] && [ ! -z "$RELAY_PORT" ]; then
    # Résoudre l'adresse IP du relay host
    RELAY_IP=$(dig ${RELAY_HOST} A +short | head -1)
    if [ ! -z "$RELAY_IP" ]; then
        echo "Configuration du relay SMTP: ${RELAY_HOST}:${RELAY_PORT} (résolu vers $RELAY_IP)"
        postconf -e "relayhost = [${RELAY_IP}]:${RELAY_PORT}"
        postconf -e "smtp_host_lookup = native"
    else
        echo "Configuration du relay SMTP: ${RELAY_HOST}:${RELAY_PORT}"
        postconf -e "relayhost = [${RELAY_HOST}]:${RELAY_PORT}"
    fi


    if [ ! -z "$RELAY_USER" ] && [ ! -z "$RELAY_PASS" ]; then
        echo "Configuration de l'authentification SMTP..."


        postconf -e "smtp_sasl_auth_enable = yes"
        postconf -e "smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd"
        postconf -e "smtp_sasl_security_options = noanonymous"
        postconf -e "smtp_tls_security_level = may"
        postconf -e "smtp_sasl_mechanism_filter = plain, login"


        # Ajouter les credentials pour le hostname ET pour l'IP
        echo "[${RELAY_HOST}]:${RELAY_PORT} ${RELAY_USER}:${RELAY_PASS}" > /etc/postfix/sasl_passwd
        if [ ! -z "$RELAY_IP" ]; then
            echo "[${RELAY_IP}]:${RELAY_PORT} ${RELAY_USER}:${RELAY_PASS}" >> /etc/postfix/sasl_passwd
        fi
        chmod 600 /etc/postfix/sasl_passwd
        postmap /etc/postfix/sasl_passwd

        echo "Authentification SMTP configurée (hostname + IP)"
    fi
else
    echo "Pas de relay SMTP configuré - mode serveur local"
fi


postconf -e "maillog_file = /dev/stdout"

# Forcer l'utilisation de DNS Google
echo "nameserver 8.8.8.8" > /etc/resolv.conf
echo "nameserver 8.8.4.4" >> /etc/resolv.conf

# Désactiver le cache DNS de Postfix et forcer l'utilisation de inet_protocols
postconf -e "disable_dns_lookups = no"
postconf -e "smtp_host_lookup = dns"

# Test DNS et ajout dans /etc/hosts pour éviter les problèmes de résolution
echo "Test de résolution DNS pour smtp.gmail.com..."
SMTP_IP=$(dig smtp.gmail.com A +short | head -1)
echo "IP trouvée pour smtp.gmail.com: $SMTP_IP"
echo "$SMTP_IP smtp.gmail.com" >> /etc/hosts

echo "Démarrage de Postfix..."

exec postfix start-fg
