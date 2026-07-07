#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# 20-clone-and-install.sh — clone le repo (public) et installe les deps.
# À exécuter SUR LA CIBLE (utilisateur ubuntu), APRÈS 10-bootstrap-target.sh.
# Pas de build ici : le build du site a besoin des .env (cf. 30-transfer puis 40).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
REPO_URL="${REPO_URL:-https://github.com/aphrody-code/shenron.git}"
DEST="$HOME/shenron"
export PATH="$HOME/.bun/bin:$PATH"
log() { printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }

log "clone / sync du repo → $DEST"
if [ -d "$DEST/.git" ]; then
  git -C "$DEST" fetch --all -q
  git -C "$DEST" reset --hard origin/main
else
  git clone -q "$REPO_URL" "$DEST"
fi

cd "$DEST"
log "bun install (workspace complet)"
bun install

log "gen:entries (chargement des commandes/events/guards du bot)"
bun --filter @shenron/bot run gen:entries

echo "✓ clone + install OK — enchaîner 30-transfer-data.sh (depuis la source)"
