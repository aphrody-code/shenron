#!/usr/bin/env bash
#
# scripts/fly-init.sh — bootstrap Fly.io en une commande.
#
# Prérequis : flyctl installé (`curl -L https://fly.io/install.sh | sh`)
#             + `fly auth login` fait
#
# Usage :
#   bash scripts/fly-init.sh                          # app "shenron-bot" en région cdg
#   APP=mon-bot REGION=ams bash scripts/fly-init.sh   # custom

set -euo pipefail

APP="${APP:-shenron-bot}"
REGION="${REGION:-cdg}"
VOLUME_SIZE="${VOLUME_SIZE:-3}"

C_B='\033[1;34m'; C_G='\033[1;32m'; C_Y='\033[1;33m'; C_R='\033[1;31m'; C_D='\033[2m'; C_X='\033[0m'
step()  { printf "\n${C_B}▸ %s${C_X}\n" "$*"; }
ok()    { printf "  ${C_G}✓${C_X} %s\n" "$*"; }
warn()  { printf "  ${C_Y}!${C_X} %s\n" "$*"; }
die()   { printf "\n${C_R}✗ %s${C_X}\n" "$*" >&2; exit 1; }

command -v fly >/dev/null 2>&1 || die "flyctl introuvable. Install : curl -L https://fly.io/install.sh | sh"

step "Launch (si l'app n'existe pas déjà)"
if fly status --app "$APP" >/dev/null 2>&1; then
	ok "App '$APP' existe déjà — skip launch"
else
	fly launch --no-deploy --copy-config --name "$APP" --region "$REGION" --yes
	ok "App '$APP' créée en région $REGION"
fi

step "Volume persistant (SQLite + data)"
if fly volumes list --app "$APP" 2>/dev/null | grep -q "shenron_data"; then
	ok "Volume shenron_data existe déjà"
else
	fly volumes create shenron_data --app "$APP" --region "$REGION" --size "$VOLUME_SIZE" --yes
	ok "Volume shenron_data créé ($VOLUME_SIZE GB)"
fi

step "Secrets (.env local → fly secrets)"
if [[ ! -f .env ]]; then
	die ".env introuvable — lance `bash scripts/setup.sh` d'abord"
fi

# Liste des vars à pusher (exclut commentaires, lignes vides, placeholders)
SECRETS_ARGS=()
while IFS= read -r line; do
	# skip comments + empty
	[[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
	key="${line%%=*}"
	val="${line#*=}"
	# trim
	val="${val%\"}"; val="${val#\"}"; val="${val%\'}"; val="${val#\'}"
	# skip placeholders / empty
	[[ -z "$val" || "$val" == "ton-token-ici" || "$val" == "TODO" ]] && continue
	SECRETS_ARGS+=("$key=$val")
done < .env

if [[ ${#SECRETS_ARGS[@]} -eq 0 ]]; then
	die "Aucun secret valide extrait de .env"
fi

printf "  ${C_D}À pusher : %s${C_X}\n" "$(printf '%s\n' "${SECRETS_ARGS[@]}" | cut -d= -f1 | tr '\n' ' ')"
fly secrets set --app "$APP" "${SECRETS_ARGS[@]}"
ok "${#SECRETS_ARGS[@]} secret(s) pushé(s)"

step "Deploy"
GH_PAT="${GH_PACKAGES_TOKEN:-}"
if [[ -z "$GH_PAT" && -f "$HOME/vps/.env" ]]; then
	GH_PAT=$(grep "^GITHUB_PAT=" "$HOME/vps/.env" | cut -d= -f2- | tr -d '"' | tr -d "'" || echo "")
fi
if [[ -z "$GH_PAT" ]]; then
	warn "GH_PACKAGES_TOKEN absent — si les packages @rpbey/* échouent,"
	warn "relance : fly deploy --build-arg GH_PACKAGES_TOKEN=<ton-PAT>"
	fly deploy --app "$APP"
else
	fly deploy --app "$APP" --build-arg "GH_PACKAGES_TOKEN=$GH_PAT"
fi

printf "\n${C_G}━━━ Fly.io prêt ━━━${C_X}\n"
printf "  Logs :    ${C_B}fly logs --app %s${C_X}\n" "$APP"
printf "  Status :  ${C_B}fly status --app %s${C_X}\n" "$APP"
printf "  SSH :     ${C_B}fly ssh console --app %s${C_X}\n" "$APP"
