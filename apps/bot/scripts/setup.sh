#!/usr/bin/env bash
#
# Shenron — setup one-shot
#
# Usage :   bash scripts/setup.sh
#
# Actions :
#   1. Vérifie / installe Bun ≥ 1.3
#   2. Installe les dépendances (bun install)
#   3. Copie .env.example → .env si absent, puis te demande tes IDs Discord
#   4. Applique les migrations SQL
#   5. (optionnel) Seed du wiki Dragon Ball (~60 s) + triggers de succès
#
# Idempotent — tu peux le relancer sans casser l'existant.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Couleurs
C_BLUE='\033[1;34m'; C_GREEN='\033[1;32m'; C_YELLOW='\033[1;33m'; C_RED='\033[1;31m'; C_DIM='\033[2m'; C_RESET='\033[0m'
step() { printf "\n${C_BLUE}▸ %s${C_RESET}\n" "$*"; }
ok()   { printf "  ${C_GREEN}✓${C_RESET} %s\n" "$*"; }
warn() { printf "  ${C_YELLOW}!${C_RESET} %s\n" "$*"; }
die()  { printf "\n${C_RED}✗ %s${C_RESET}\n" "$*" >&2; exit 1; }

# ── 1. Bun ──────────────────────────────────────────────────────────────────
step "Vérification de Bun"
if ! command -v bun >/dev/null 2>&1; then
	warn "Bun non trouvé — installation en cours"
	curl -fsSL https://bun.com/install | bash
	# shellcheck disable=SC1091
	export BUN_INSTALL="$HOME/.bun"
	export PATH="$BUN_INSTALL/bin:$PATH"
fi
BUN_VERSION="$(bun --version 2>/dev/null || echo 0)"
if [[ -z "$BUN_VERSION" || "$BUN_VERSION" == "0" ]]; then
	die "Impossible d'installer Bun. Va voir https://bun.com/install"
fi
MAJOR_MINOR=$(printf '%s' "$BUN_VERSION" | cut -d. -f1,2)
AWK_CHECK=$(awk -v v="$MAJOR_MINOR" 'BEGIN { print (v+0 >= 1.3) ? "ok" : "old" }')
if [[ "$AWK_CHECK" != "ok" ]]; then
	die "Bun $BUN_VERSION trop ancien — version minimale : 1.3. Mets à jour : bun upgrade"
fi
ok "Bun $BUN_VERSION"

# ── 2. Dépendances ──────────────────────────────────────────────────────────
step "Installation des dépendances"
bun install --frozen-lockfile 2>/dev/null || bun install
ok "node_modules prêts"

# ── 3. .env ─────────────────────────────────────────────────────────────────
step "Configuration (.env)"
if [[ ! -f .env ]]; then
	cp .env.example .env
	chmod 600 .env
	ok ".env créé depuis .env.example (perms 600)"
	warn "Tu dois éditer .env pour renseigner au minimum :"
	printf "    ${C_DIM}- DISCORD_TOKEN  (portail dev Discord → Bot → Reset Token)${C_RESET}\n"
	printf "    ${C_DIM}- GUILD_ID       (Discord → activer 'Developer Mode' → clic droit serveur → Copier l'ID)${C_RESET}\n"
	printf "    ${C_DIM}- OWNER_ID       (clic droit sur toi → Copier l'ID)${C_RESET}\n"
	printf "\n  Lien pour inviter le bot sur ton serveur (remplace CLIENT_ID par ton APP_ID) :\n"
	printf "    ${C_DIM}https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot+applications.commands&permissions=1099780074054${C_RESET}\n"
else
	ok ".env existant — conservé tel quel"
fi

# Vérifie les 3 champs critiques
missing=()
for key in DISCORD_TOKEN GUILD_ID OWNER_ID; do
	val=$(grep -E "^${key}=" .env | head -1 | cut -d= -f2- | tr -d ' ' || true)
	if [[ -z "$val" || "$val" == "ton-token-ici" || "$val" == "TODO" ]]; then
		missing+=("$key")
	fi
done
if [[ ${#missing[@]} -gt 0 ]]; then
	warn ".env incomplet — il manque : ${missing[*]}"
	warn "Ouvre .env dans ton éditeur, renseigne-les, puis relance ce script."
	exit 0
fi
ok "DISCORD_TOKEN, GUILD_ID, OWNER_ID présents"

# ── 4. DB ───────────────────────────────────────────────────────────────────
step "Base de données"
mkdir -p data
bun run db:migrate
ok "Migrations appliquées"

# ── 5. Seed ─────────────────────────────────────────────────────────────────
step "Seed des données DBZ"
bun src/db/seed-triggers.ts
ok "15 triggers de succès seedés"

if [[ "${SKIP_WIKI_SEED:-0}" != "1" ]]; then
	printf "  ${C_DIM}Seed du wiki Dragon Ball ? (fetch dragonball-api.com, ~60 s) [y/N] ${C_RESET}"
	read -r -n 1 answer < /dev/tty || answer="n"
	echo
	if [[ "$answer" =~ ^[yYoO]$ ]]; then
		bun src/db/seed-wiki.ts
		ok "Wiki DBZ seedé"
	else
		warn "Wiki sauté — tu pourras le lancer plus tard avec : bun run db:seed-wiki"
	fi
fi

# ── 6. Auto-detect IDs ──────────────────────────────────────────────────────
step "Auto-détection des IDs Discord (rôles + salons)"
printf "  ${C_DIM}Scanner ton serveur et auto-patcher les clés vides de .env ? [y/N] ${C_RESET}"
read -r -n 1 answer < /dev/tty || answer="n"
echo
if [[ "$answer" =~ ^[yYoO]$ ]]; then
	bun scripts/discover-ids.ts --patch || warn "Auto-détection échouée — pas bloquant"
else
	warn "Tu pourras lancer plus tard : bun run ids           # affiche la liste"
	warn "                              : bun run ids -- --patch  # auto-patch .env"
fi

# ── Fini ────────────────────────────────────────────────────────────────────
printf "\n${C_GREEN}━━━ Setup terminé ━━━${C_RESET}\n"
printf "  Lancer le bot en dev          : ${C_BLUE}bash scripts/start.sh${C_RESET}\n"
printf "  Vérifier la santé             : ${C_BLUE}bash scripts/doctor.sh${C_RESET}\n"
printf "  Lister les IDs du serveur     : ${C_BLUE}bun run ids${C_RESET}  (ou ${C_BLUE}/ids${C_RESET} dans Discord)\n"
printf "  Déployer avec options         : ${C_BLUE}bun scripts/deploy.ts --help${C_RESET}\n"
