#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# Bootstrap Fly.io pour shenron — cible conteneur SANS VPS. Idempotent.
# À lancer depuis la RACINE du monorepo (fly.toml + Dockerfile y vivent).
#
#   bash scripts/fly-init.sh
#
# Variables (override possible) :
#   APP=shenron-bot   REGION=cdg   VOLUME_SIZE=3   ENV_FILE=apps/bot/.env
#   FLY_ORG=personal  GH_PACKAGES_TOKEN=<PAT pour @aphrody-code/canvas>
#
# Les secrets sont poussés via `fly secrets import` (stdin) → jamais affichés.
# ─────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

APP="${APP:-shenron-bot}"
REGION="${REGION:-cdg}"
VOLUME_SIZE="${VOLUME_SIZE:-3}"
ENV_FILE="${ENV_FILE:-apps/bot/.env}"
FLY_ORG="${FLY_ORG:-personal}"

command -v flyctl >/dev/null 2>&1 || command -v fly >/dev/null 2>&1 || {
  echo "✗ flyctl absent — install : https://fly.io/docs/flyctl/install/" >&2; exit 1; }
FLY="$(command -v flyctl || command -v fly)"

[[ -f fly.toml ]] || { echo "✗ fly.toml introuvable — lance depuis la racine du repo" >&2; exit 1; }

echo "▶ app Fly : $APP (region $REGION, org $FLY_ORG)"
if ! "$FLY" apps list 2>/dev/null | grep -qw "$APP"; then
  "$FLY" apps create "$APP" --org "$FLY_ORG"
else
  echo "  ✓ app déjà créée"
fi

echo "▶ volume persistant shenron_data ($VOLUME_SIZE GB → /data)"
if ! "$FLY" volumes list -a "$APP" 2>/dev/null | grep -qw shenron_data; then
  "$FLY" volumes create shenron_data -a "$APP" --region "$REGION" --size "$VOLUME_SIZE" --yes
else
  echo "  ✓ volume déjà provisionné"
fi

echo "▶ secrets depuis $ENV_FILE (valeurs masquées)"
if [[ -f "$ENV_FILE" ]]; then
  # KEY=VAL non commentés → fly secrets import (stdin). Aucune valeur en clair.
  grep -vE '^\s*(#|$)' "$ENV_FILE" | "$FLY" secrets import -a "$APP"
  echo "  ✓ secrets importés"
else
  echo "  ! $ENV_FILE absent — pousse manuellement : fly secrets set KEY=… -a $APP" >&2
fi

echo "▶ deploy (build au root, run apps/bot)"
"$FLY" deploy -a "$APP" \
  --build-arg GH_PACKAGES_TOKEN="${GH_PACKAGES_TOKEN:-}" \
  --wait-timeout 300

echo "✓ fly-init terminé — logs : $FLY logs -a $APP"
