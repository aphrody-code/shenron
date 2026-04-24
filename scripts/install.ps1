# Shenron - installer PowerShell (Windows)
#
# Usage :
#   irm https://raw.githubusercontent.com/aphrody-code/shenron/main/scripts/install.ps1 | iex
#
# Variables d'env (optionnelles) :
#   $env:SHENRON_DIR    = "C:\bots\shenron"
#   $env:SHENRON_BRANCH = "dev"
#   $env:SKIP_WIKI_SEED = "1"

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$REPO   = if ($env:SHENRON_REPO)   { $env:SHENRON_REPO }   else { "https://github.com/aphrody-code/shenron.git" }
$BRANCH = if ($env:SHENRON_BRANCH) { $env:SHENRON_BRANCH } else { "main" }
$TARGET = if ($env:SHENRON_DIR)    { $env:SHENRON_DIR }    else { (Join-Path (Get-Location) "shenron") }

function Step($msg)  { Write-Host "`n▸ $msg" -ForegroundColor Cyan }
function Ok($msg)    { Write-Host "  OK  $msg" -ForegroundColor Green }
function Warn($msg)  { Write-Host "  !   $msg" -ForegroundColor Yellow }
function Die($msg)   { Write-Host "`nERROR: $msg" -ForegroundColor Red; exit 1 }

@"

    +=======================================+
    |   [DRAGON]  S H E N R O N  INSTALLER  |
    +=======================================+

"@ | Write-Host -ForegroundColor Magenta

# -- Préflight -------------------------------------------------------------
Step "Préflight"

# Git requis
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Die "git introuvable. Installe-le : winget install Git.Git"
}
Ok "git $((git --version).Split(' ')[-1])"

# Bun requis — tente install auto si absent
if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
    Warn "Bun absent — installation via script officiel"
    try {
        powershell -Command "irm bun.sh/install.ps1 | iex"
    } catch {
        Die "Échec installation Bun. Va sur https://bun.com/install"
    }
    # Recharge le PATH (Bun l'ajoute à %USERPROFILE%\.bun\bin)
    $env:Path = "$env:USERPROFILE\.bun\bin;$env:Path"
    if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
        Die "Bun installé mais introuvable dans PATH. Redémarre le shell puis relance."
    }
}
Ok "Bun $((bun --version).Trim())"

# -- Clone -----------------------------------------------------------------
Step "Clone (branche: $BRANCH)"
if (Test-Path (Join-Path $TARGET ".git")) {
    Ok "Repo existant — pull"
    git -C $TARGET fetch --quiet origin $BRANCH
    git -C $TARGET checkout --quiet $BRANCH
    git -C $TARGET pull --quiet --ff-only
} elseif (Test-Path $TARGET) {
    if ((Get-ChildItem $TARGET -Force | Measure-Object).Count -gt 0) {
        Die "$TARGET existe et n'est pas vide. Change `$env:SHENRON_DIR."
    }
    git clone --branch $BRANCH --quiet $REPO $TARGET
    Ok "Cloné dans $TARGET"
} else {
    git clone --branch $BRANCH --quiet $REPO $TARGET
    Ok "Cloné dans $TARGET"
}

Set-Location $TARGET

# -- bun install -----------------------------------------------------------
Step "Installation des dépendances"
bun install --frozen-lockfile 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { bun install }
Ok "node_modules prêts"

# -- .env ------------------------------------------------------------------
Step ".env"
$envPath = Join-Path $TARGET ".env"
if (-not (Test-Path $envPath)) {
    Copy-Item (Join-Path $TARGET ".env.example") $envPath
    # Windows n'a pas chmod — ACL minimale pour utilisateur courant
    $acl = Get-Acl $envPath
    $acl.SetAccessRuleProtection($true, $false)
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        $env:USERNAME, "FullControl", "Allow")
    $acl.SetAccessRule($rule)
    Set-Acl $envPath $acl
    Ok ".env créé depuis .env.example"
    Warn "Édite .env pour renseigner :"
    Write-Host "    - DISCORD_TOKEN  (portail dev Discord -> Bot -> Reset Token)"
    Write-Host "    - GUILD_ID       (clic droit serveur -> Copier l'ID)"
    Write-Host "    - OWNER_ID       (clic droit sur toi -> Copier l'ID)"
} else {
    Ok ".env existant — conservé"
}

# Vérifie les 3 champs critiques
$envContent = Get-Content $envPath -Raw
$missing = @()
foreach ($key in @("DISCORD_TOKEN", "GUILD_ID", "OWNER_ID")) {
    if ($envContent -match "(?m)^$key\s*=\s*(.*)$") {
        $val = $Matches[1].Trim()
        if (-not $val -or $val -eq "ton-token-ici" -or $val -eq "TODO") {
            $missing += $key
        }
    } else {
        $missing += $key
    }
}
if ($missing.Count -gt 0) {
    Warn ".env incomplet — manquant : $($missing -join ', ')"
    Warn "Édite .env puis relance bun scripts/install.ts"
    Write-Host "`n== Clone + deps OK. Édite .env pour continuer. ==" -ForegroundColor Green
    Write-Host "  cd $TARGET" -ForegroundColor Cyan
    exit 0
}
Ok "DISCORD_TOKEN, GUILD_ID, OWNER_ID présents"

# -- DB + seeds ------------------------------------------------------------
Step "Base de données"
New-Item -ItemType Directory -Force -Path (Join-Path $TARGET "data") | Out-Null
bun run db:migrate
Ok "Migrations appliquées"

Step "Seeds"
bun src/db/seed-triggers.ts
Ok "15 triggers seedés"

if ($env:SKIP_WIKI_SEED -ne "1") {
    Step "Seed wiki DBZ (~60 s)"
    try {
        bun src/db/seed-wiki.ts
        Ok "Wiki DBZ seedé"
    } catch {
        Warn "Seed wiki a échoué — relance plus tard : bun run db:seed-wiki"
    }
} else {
    Warn "Seed wiki sauté (SKIP_WIKI_SEED=1)"
}

# -- Fin -------------------------------------------------------------------
Write-Host "`n== Installation terminée ==" -ForegroundColor Green
Write-Host "  cd $TARGET" -ForegroundColor Cyan
Write-Host "  Démarrer : bun run dev" -ForegroundColor Cyan
