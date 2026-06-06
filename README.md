# Book By Click

Application web de prise de rendez-vous en ligne pour professionnels et clients, construite avec React et Flask.

## Fonctionnalités

**Clients**
- Recherche d'entreprises par secteur et ville
- Réservation de créneaux avec sélection de prestation
- Liste d'attente automatique sur les créneaux complets
- Suivi et annulation des réservations depuis le tableau de bord
- Réinitialisation de mot de passe par email

**Professionnels**
- Tableau de bord avec planning hebdomadaire et mensuel
- Gestion des créneaux et semaines types (génération automatique)
- Création d'événements bloquants (congés, fermetures)
- Gestion des réservations (confirmation, annulation)
- Statistiques d'activité et gestion de la liste clients

**Général**
- Emails transactionnels (confirmation, annulation, liste d'attente)
- Documentation API Swagger sur `/swagger`
- Rôles : client, professionnel, admin

## Stack

**Frontend**
- React 19 — framework UI
- React Router v7 — navigation
- Tailwind CSS 4 — styles
- Recharts — graphiques statistiques
- react-big-calendar — vues planning
- Vite (rolldown) — bundler

**Backend**
- Flask — serveur web
- SQLAlchemy — ORM
- Flask-Migrate — migrations de base de données
- PostgreSQL — base de données
- MailHog — serveur SMTP de développement (emails interceptés)

**Infrastructure**
- Docker Compose — PostgreSQL + MailHog
- python-venv — isolation des dépendances Python

## Prérequis

- Python 3.12+
- Node.js 18+ et npm
- Docker et Docker Compose

## Installation

### Mode Docker (recommandé)

Lance l'application complète (base de données, backend, frontend, mail) en une commande :

```bash
# Premier lancement (build des images)
docker compose up --build

# Lancements suivants
docker compose up
```

### Mode développement local

**Linux**
```bash
./install_Linux.sh
```

**Windows (PowerShell)**
```powershell
.\install_Windows.ps1
```

Ces scripts créent le virtualenv Python, installent les dépendances, démarrent les containers Docker (DB + mail) et lancent le frontend et le backend en parallèle.

**Étapes manuelles**

```bash
# 1. Installer les dépendances Python
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# 2. Installer les dépendances JS
npm install

# 3. Démarrer la base de données et MailHog
npm run db

# 4. Lancer le backend et le frontend en parallèle
npm run dev:lin   # Linux / macOS
npm run dev:win   # Windows
```

## Accès aux services

| Service       | URL                                                |
|---------------|----------------------------------------------------|
| Frontend      | http://localhost:5173                              |
| Backend API   | http://localhost:5000                              |
| Swagger       | http://localhost:5000/swagger                      |
| MailHog       | http://localhost:8025                              |
| PostgreSQL    | `localhost:5433` — user `appuser` / pass `apppassword` / db `appdb` |

## Comptes de test

| Rôle             | Email                          | Mot de passe |
|------------------|--------------------------------|--------------|
| Admin            | admin@bookbyclick.com          | admin        |
| Pro (Marie Coiffure) | marie.leroy@example.com    | password123  |
| Pro (Barber)     | nicolas.bernard@example.com    | password123  |
| Pro (Zen Beauty) | sophie.roux@example.com        | password123  |
| Client           | claire.martin@example.com      | password123  |
| Client           | thomas.dubois@example.com      | password123  |
| Client bloqué    | margot.laurent@example.com     | password123  |

## Commandes disponibles

```bash
npm run dev:lin      # Lance frontend + backend en parallèle (Linux)
npm run dev:win      # Lance frontend + backend en parallèle (Windows)
npm run db           # Démarre PostgreSQL + MailHog via Docker Compose
npm run api          # Lance uniquement le backend Flask
npm run web          # Lance uniquement le frontend Vite
npm run build        # Build de production du frontend
npm run lint         # Analyse ESLint
```

**Docker**
```bash
docker compose up --build      # Premier lancement
docker compose up -d           # En arrière-plan
docker compose down            # Arrête (données conservées)
docker compose down -v         # Arrête + reset complet de la DB
docker compose logs -f backend # Logs en temps réel d'un service
```

**Base de données**
```bash
# Peupler avec les données de test (mode Docker)
docker compose exec backend python -m src.seed

# Ouvrir psql
docker compose exec db psql -U appuser -d appdb
```

## Structure du projet

```
Backend/src/
├── app.py              # Factory Flask (create_app)
├── models.py           # Modèles SQLAlchemy (Utilisateur, Entreprise, Reservation, …)
├── extension.py        # Instances db, cors, migrate
├── mailer.py           # Emails transactionnels (SMTP)
├── seed.py             # Données de test
├── utils/
│   └── auth.py         # Décorateur @login_required
└── routes/
    ├── auth.py         # /login, /logout, /register
    ├── user.py         # Profil utilisateur
    ├── entreprise.py   # Pages et recherche d'entreprises
    ├── creneaux.py     # Gestion des créneaux
    ├── reservations.py # Réservations (création, statut, annulation)
    ├── evenements.py   # Événements bloquants
    ├── semainetype.py  # Modèles de semaine type
    ├── statistiques.py # Statistiques professionnels
    ├── clients.py      # Liste clients d'une entreprise
    ├── attente.py      # Liste d'attente
    ├── admin.py        # Routes admin
    ├── contact.py      # Formulaire de contact
    └── static_data.py  # Données statiques (villes, secteurs)

src/
├── App.jsx
├── components/         # Navbar, Footer, Calendar, Modal, Toast, …
├── hooks/              # useCalendar, useSubmitForm_pro, useSubmitForm_user
└── pages/
    ├── Home.jsx
    ├── Login.jsx
    ├── Register_User.jsx / Register_Pro.jsx
    ├── BookingCalendar.jsx / BookingConfirmation.jsx
    ├── EntrepriseDetail.jsx / PageResultatRecherche.jsx
    ├── Profile.jsx / ForgotPassword.jsx / ResetPassword.jsx
    ├── Admin.jsx
    └── dashboard/
        ├── DashboardClient.jsx
        ├── DashboardEntreprise.jsx
        └── sections/   # Planning, Réservations, Créneaux, Événements, Statistiques, …
```

## Variables d'environnement

Créer un fichier `.env` à la racine du projet :

| Variable                  | Description                            | Exemple                                              |
|---------------------------|----------------------------------------|------------------------------------------------------|
| `SQLALCHEMY_DATABASE_URI` | URL de connexion PostgreSQL            | `postgresql://appuser:apppassword@localhost:5432/appdb` |
| `SECRET_KEY`              | Clé secrète Flask (sessions)           | `une-chaine-aleatoire-longue`                        |
| `SMTP_HOST`               | Hôte SMTP (MailHog en dev)             | `mail` (Docker) ou `localhost` (local)               |
| `SMTP_PORT`               | Port SMTP                              | `1025`                                               |
