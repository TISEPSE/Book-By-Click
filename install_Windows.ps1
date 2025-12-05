Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   Installation Book-By-Click" -ForegroundColor Cyan
Write-Host "===================================="
Write-Host ""

Write-Host "[1/6] Vérification de Python et Node..." -ForegroundColor Yellow
if (!(Get-Command python -ErrorAction SilentlyContinue) -and !(Get-Command py -ErrorAction SilentlyContinue)) {
    Write-Host "  ERREUR: Python introuvable. Installe Python et ajoute-le au PATH." -ForegroundColor Red
    exit 1
}
if (!(Get-Command npm -ErrorAction SilentlyContinue) -or !(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  ERREUR: Node.js/npm introuvable. Installe Node.js (inclut npm)." -ForegroundColor Red
    exit 1
}
$pythonCmd = if (Get-Command python -ErrorAction SilentlyContinue) { "python" } else { "py -3" }
$pythonVersion = & $pythonCmd --version 2>&1
Write-Host "  Python trouvé: $pythonVersion" -ForegroundColor Green
$nodeVersion = & node --version 2>&1
Write-Host "  Node trouvé: $nodeVersion" -ForegroundColor Green

Write-Host "`n[2/6] Suppression (forcée) de l'ancien venv si présent..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Try {
        Remove-Item -Recurse -Force venv -ErrorAction Stop
        Write-Host "  Ancien venv supprimé." -ForegroundColor Green
    } Catch {
        Write-Host "  Attention: échec suppression venv, tentative de forcer la suppression..." -ForegroundColor Yellow
        Start-Sleep -Milliseconds 200
        Remove-Item -Recurse -Force venv -ErrorAction SilentlyContinue
        if (Test-Path "venv") {
            Write-Host "  ERREUR: Impossible de supprimer le venv (fichiers verrouillés)." -ForegroundColor Red
            exit 1
        } else {
            Write-Host "  Suppression forcée réussie." -ForegroundColor Green
        }
    }
} else {
    Write-Host "  Aucun venv trouvé." -ForegroundColor Green
}

Write-Host "`n[3/6] Création du nouveau virtualenv..." -ForegroundColor Yellow
Try {
    & $pythonCmd -m venv venv
    if ($LASTEXITCODE -ne 0) { throw "venv creation failed" }
    Write-Host "  Virtualenv créé avec succès." -ForegroundColor Green
} Catch {
    Write-Host "  ERREUR: Impossible de créer le virtualenv avec '$pythonCmd -m venv'." -ForegroundColor Red
    Write-Host "  Tentative avec 'python -m venv' si possible..." -ForegroundColor Yellow
    Try {
        python -m venv venv
        if ($LASTEXITCODE -ne 0) { throw "fallback failed" }
        Write-Host "  Virtualenv créé avec la commande fallback." -ForegroundColor Green
    } Catch {
        Write-Host "  ERREUR: Échec de la création du virtualenv. Vérifie l'installation Python et les permissions." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n[4/6] Activation du virtualenv et installation pip..." -ForegroundColor Yellow
$activateScript = Join-Path -Path (Get-Location) -ChildPath "venv\Scripts\Activate.ps1"
if (Test-Path $activateScript) {
    . $activateScript
    if ($?) {
        Write-Host "  Virtualenv activé." -ForegroundColor Green
    } else {
        Write-Host "  ERREUR: Impossible d'activer le virtualenv." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  ERREUR: Script d'activation introuvable: $activateScript" -ForegroundColor Red
    exit 1
}

Write-Host "  Mise à jour de pip..." -ForegroundColor Yellow
.\venv\Scripts\python.exe -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERREUR: Échec mise à jour pip." -ForegroundColor Red
    exit 1
}

if (Test-Path "requirements.txt") {
    Write-Host "  Installation des packages Python depuis requirements.txt..." -ForegroundColor Yellow
    .\venv\Scripts\python.exe -m pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ERREUR: Échec de l'installation des dépendances Python." -ForegroundColor Red
        exit 1
    }
    Write-Host "  Dépendances Python installées." -ForegroundColor Green
} else {
    Write-Host "  Pas de requirements.txt trouvé, saut de l'installation pip." -ForegroundColor Yellow
}

Write-Host "`n[5/6] Installation des dépendances Node.js (npm install)..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERREUR: Échec de l'installation npm." -ForegroundColor Red
    exit 1
}
Write-Host "  Dépendances Node.js installées." -ForegroundColor Green

Write-Host "`n[6/6] Démarrage de l'application (npm run dev:all)..." -ForegroundColor Yellow
npm run dev:win
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n  ERREUR: 'npm run dev:all' s'est terminé avec un code non nul." -ForegroundColor Red
    exit 1
}
