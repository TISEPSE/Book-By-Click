#!/bin/bash

# Supprime le venv s'il existe pour une installation propre
if [ -d "venv" ]; then
    echo "Suppression de l'ancien virtualenv..."
    rm -rf venv
fi

# Création du virtualenv
echo "Création du virtualenv..."
python3 -m venv venv

# Active le virtualenv
source venv/bin/activate

# Met à jour pip
pip install --upgrade pip

# Installe toutes les dépendances Python du requirements.txt à la racine
if [ -f "requirements.txt" ]; then
    echo "Installation des packages Python depuis requirements.txt..."
    pip install -r requirements.txt
else
    echo "requirements.txt non trouvé à la racine !"
fi

# Installe les dépendances JS et lance l'app
npm install
npm run dev:all
