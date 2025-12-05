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

# Installe Flask si pas déjà installé
pip install --upgrade pip
pip install flask flask-cors

# Lancer l'API avec npm et installer les dépendances
npm install
npm run dev:all