# Modele Conceptuel de Donnees - Book-By-Click

## MCD

```mermaid
erDiagram
    TypeUtilisateur ||--o{ Utilisateur : "1,1 ---- possede ---- 0,N"
    Utilisateur ||--o{ Entreprise : "1,1 ---- gere ---- 0,N"
    Utilisateur ||--o{ Reservation : "1,1 ---- effectue ---- 0,N"
    Entreprise ||--o{ Creneau : "1,1 ---- propose ---- 0,N"
    Entreprise ||--o{ Prestation : "1,1 ---- offre ---- 0,N"
    Entreprise ||--o{ Reservation : "1,1 ---- recoit ---- 0,N"
    Entreprise ||--o{ Evenement : "1,1 ---- organise ---- 0,N"
    Entreprise ||--o{ SemaineType : "1,1 ---- definit ---- 0,N"
    Prestation ||--o{ Reservation : "1,1 ---- concerne ---- 0,N"
    Reservation ||--o{ EventEmail : "1,1 ---- declenche ---- 0,N"

    TypeUtilisateur {
        int idType PK
        string role "admin | pro | client"
        string description
    }

    Utilisateur {
        int idClient PK
        string nom
        string prenom
        string email
        string telephone
        date dateNaissance
        datetime dateInscription
        string motDePasseHash
        boolean estGerant
        int idTypeUtilisateur FK "→ TypeUtilisateur"
    }

    Entreprise {
        int idPro PK
        string nomEntreprise
        string nomSecteur
        int idGerant FK "→ Utilisateur"
        string slugPublic
        string adresse
        string codePostal
        string ville
        string pays
    }

    Prestation {
        int idPrestation PK
        int idPro FK "→ Entreprise"
        string libelle
        int dureeMinutes
        decimal tarif "Numeric(10,2)"
    }

    Creneau {
        int idCreneau PK
        int idPro FK "→ Entreprise"
        datetime dateHeureDebut
        datetime dateHeureFin
        boolean statut "true=libre false=occupe"
        int nbMaxReservations "default 1"
    }

    Reservation {
        int idReservation PK
        int idPro FK "→ Entreprise"
        int idClient FK "→ Utilisateur"
        int idPrestation FK "→ Prestation"
        string commentaireClient
        boolean statut "true=confirme false=en attente"
        datetime dateCreation
    }

    EventEmail {
        int idLog PK
        int idReservation FK "→ Reservation"
        string email
        datetime dateEnvoi
        boolean statutEnvoi
    }

    Evenement {
        int idEvenement PK
        int idPro FK "→ Entreprise"
        string titre
        string description
        datetime dateDebut
        datetime dateFin
        string typeEvenement "ex: Promotion"
    }

    SemaineType {
        int idSemaineType PK
        int idPro FK "→ Entreprise"
        string libelle
        string description
        string joursPattern "ex: 1111100 = Lun-Ven"
    }
```

## Cardinalites

| Relation | Entite A | Cardinalite | Verbe | Cardinalite | Entite B |
|----------|----------|:-----------:|-------|:-----------:|----------|
| 1 | **TypeUtilisateur** | 1,N | possede | 1,1 | **Utilisateur** |
| 2 | **Utilisateur** | 0,N | gere | 1,1 | **Entreprise** |
| 3 | **Utilisateur** | 0,N | effectue | 1,1 | **Reservation** |
| 4 | **Entreprise** | 0,N | propose | 1,1 | **Creneau** |
| 5 | **Entreprise** | 0,N | offre | 1,1 | **Prestation** |
| 6 | **Entreprise** | 0,N | recoit | 1,1 | **Reservation** |
| 7 | **Entreprise** | 0,N | organise | 1,1 | **Evenement** |
| 8 | **Entreprise** | 0,N | definit | 1,1 | **SemaineType** |
| 9 | **Prestation** | 0,N | concerne | 1,1 | **Reservation** |
| 10 | **Reservation** | 0,N | declenche | 1,1 | **EventEmail** |

## Regles de gestion

- Un **Utilisateur** possede exactement un **TypeUtilisateur** (admin, pro ou client)
- Un **Utilisateur** avec `estGerant=true` peut gerer 0 a N **Entreprises**
- Un **Utilisateur** client peut effectuer 0 a N **Reservations**
- Une **Entreprise** appartient a exactement 1 gerant
- Une **Entreprise** propose 0 a N **Creneaux** de disponibilite
- Une **Entreprise** offre 0 a N **Prestations** (services avec duree et tarif)
- Une **Reservation** lie obligatoirement 1 Client, 1 Entreprise et 1 Prestation
- Un **Creneau** a un statut libre/occupe et un nombre max de reservations
- Une **SemaineType** definit un pattern hebdomadaire (ex: `1111100` = Lun-Ven)
- Un **Evenement** est une promotion ou actualite liee a une entreprise
