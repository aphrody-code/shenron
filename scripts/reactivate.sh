#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# reactivate.sh — Reactivation complète et propre de SHENRON.
#
# Ce script installe les dépendances, exécute les migrations SQLite de production,
# régénère les entrées du bot, compile les styles du dashboard, génère l'index RAG,
# met à jour les units systemd et démarre le bot ainsi que son sidecar.
# ─────────────────────────────────────────────────────────────────────────────
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
cd "$ROOT"

echo "=== [SHENRON] Début de la réactivation ==="

# 1. Nettoyage initial de sécurité
echo "▶ Nettoyage des dossiers temporaires et des caches..."
rm -rf node_modules apps/*/node_modules packages/*/node_modules .turbo apps/*/.turbo packages/*/.turbo apps/site/.next apps/bot/.bun-cache apps/site/.bun-cache

# Recréer les répertoires nécessaires aux bacs à sable (namespaces) de systemd
mkdir -p apps/bot/.bun-cache apps/bot/.models apps/bot/dist apps/bot/assets/wiki apps/bot/assets/subtitles

# 2. Installation propre des dépendances
echo "▶ Installation propre des dépendances via Bun..."
bun install

# 3. Migrations de base de données SQLite locales
echo "▶ Application des migrations de la base de données..."
bun --filter=@shenron/bot run db:migrate

# 4. Génération des entrées et configuration du bot
echo "▶ Génération des entrées du bot (gen:entries)..."
bun --filter=@shenron/bot run gen:entries

# 5. Compilation des styles CSS Tailwind v4 du Dashboard
echo "▶ Compilation des styles CSS du Dashboard..."
bun --filter=@shenron/bot run dashboard:css

# 6. Génération et indexation RAG
echo "▶ Génération de l'index RAG (embeddings + vectors)..."
bun --filter=@shenron/bot run rag:build

# 7. Provisioning et installation des units systemd
echo "▶ Installation et configuration des units systemd..."
bash deploy/install.sh

# 8. Activation et démarrage des services & timers
echo "▶ Activation et redémarrage des services et timers de production..."
SERVICES=(
  "shenron-embed.service"
  "shenron.service"
)

TIMERS=(
  "shenron-backup.timer"
  "shenron-neon-sync.timer"
  "shenron-neon-pull.timer"
)

# Active et démarre les timers
for timer in "${TIMERS[@]}"; do
  echo "  · Activation du timer $timer..."
  sudo systemctl enable "$timer"
  sudo systemctl restart "$timer"
done

# Active et démarre les services principaux
for srv in "${SERVICES[@]}"; do
  echo "  · Démarrage de $srv..."
  sudo systemctl enable "$srv"
  sudo systemctl restart "$srv"
done

# 9. Validation finale (Healthcheck)
echo "▶ Vérification de l'état des services..."
sleep 5
for srv in "${SERVICES[@]}"; do
  if sudo systemctl is-active --quiet "$srv"; then
    echo "  ✓ $srv : Actif"
  else
    echo "  ✗ $srv : Inactif ! (Vérifier: journalctl -u $srv -n 30)" >&2
  fi
done

# Vérification HTTP de l'API bot (Port 5006)
URL="http://127.0.0.1:5006/auth/me"
echo "▶ Healthcheck sur $URL..."
HTTP_CODE="000"
for i in $(seq 1 15); do
  HTTP_CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "$URL" || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✓ API Bot accessible (HTTP 200)"
    break
  fi
  sleep 2
done

if [ "$HTTP_CODE" != "200" ]; then
  echo "  ⚠ Attention: L'API bot n'a pas répondu HTTP 200 (reçu: $HTTP_CODE)." >&2
fi

echo "=== [SHENRON] Réactivation terminée avec succès ! ==="
