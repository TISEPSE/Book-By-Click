@echo off

if not exist venv (
    echo Création du virtualenv...
    python -m venv venv
)

call venv\Scripts\activate.bat

pip install --upgrade pip
pip install flask

npm install
npm run api
