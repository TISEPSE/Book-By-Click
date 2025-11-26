if (!(Test-Path "venv")) {
    Write-Host "Création du virtualenv..."
    python -m venv venv
}

. venv/Scripts/Activate.ps1

pip install --upgrade pip
pip install flask

npm install

npm run dev:all
Write-Host "Installation terminée. Vous pouvez maintenant exécuter l'application."