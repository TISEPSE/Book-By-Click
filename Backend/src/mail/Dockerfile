FROM ubuntu:22.04


ENV DEBIAN_FRONTEND=noninteractive


RUN apt-get update && \
    apt-get install -y \
    postfix \
    mailutils \
    libsasl2-modules \
    ca-certificates \
    dnsutils \
    iputils-ping \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


RUN postconf -e "myhostname = mail.${MAIL_DOMAIN:-localhost}" \
    && postconf -e "mydestination = localhost" \
    && postconf -e "mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128 172.16.0.0/12 192.168.0.0/16" \
    && postconf -e "inet_interfaces = all" \
    && postconf -e "inet_protocols = ipv4"


COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


EXPOSE 25


ENTRYPOINT ["/entrypoint.sh"]
