if (!(Test-Path "venv")) {
    Write-Host "Creation du virtualenv..."
    python -m venv venv
}

. .\venv\Scripts\Activate.ps1

.\venv\Scripts\python.exe -m pip install --upgrade pip

if (Test-Path "requirements.txt") {
    .\venv\Scripts\python.exe -m pip install -r requirements.txt
}

npm install

npm run dev:win

Write-Host "Installation terminée. Vous pouvez maintenant exécuter l'application."
