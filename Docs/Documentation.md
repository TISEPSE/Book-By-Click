# 🗺️ Les Routes

## 🎯 Concept de Base

### Une route = URL + Action

- Frontend (React) : Affiche les interfaces
- Backend (Flask) : Traite les données

## Flux d'une Requête

### Connexion Utilisateur

1. **Formulaire React** → Soumission
2. **POST /login_form** → Envoi données
3. **Flask Route** → Traitement
4. **Réponse "OK"** → Retour frontend

## 🛣️ Routes de l'Application

| Route | Méthode | Rôle |
|-------|---------|------|
| `/register_form` | POST | Création compte |
| `/login_form` | POST | Connexion utilisateur |

## 💻 Code Exemple

### Frontend (React)

```jsx
<form action="http://localhost:5000/login_form" method="POST">
  <input name="email" />
  <input name="password" type="password" />
</form>

Backend (Flask)
python

@app.route("/login_form", methods=["POST"])
def login_Form():
    email = request.form.get("email")
    password = request.form.get("password")
    return "OK"

## Configuration CORS

from flask_cors import CORS
CORS(app)  # Autorise communication front/back

Les routes = Communication entre interface et logique métier