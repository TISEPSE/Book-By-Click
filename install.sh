#!/bin/bash

# Vérifie si le venv existe
if [ ! -d "venv" ]; then
    echo "Création du virtualenv..."
    python3 -m venv venv
fi

# Active le virtualenv
source venv/bin/activate

# Installe Flask si pas déjà installé
pip install --upgrade pip
pip install flask

# Lancer l'API avec npm
npm run api
