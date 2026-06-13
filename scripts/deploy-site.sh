#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# Déploie le SITE Next.js (dragonballfr.com) sur le VPS depuis le repo.
#
# Le site est servi par `next start` sous Bun (unit shenron-site.service) sur
# 127.0.0.1:3000, fronté par nginx (deploy/nginx/dragonballfr.com.conf). Ce
# script : (pull optionnel) -> build -> restart -> smoke -> rollback auto.
#
#   bash scripts/deploy-site.sh           # build + restart + smoke
#   bash scripts/deploy-site.sh --pull    # git pull d'abord (rollback si échec)
#   bash scripts/deploy-site.sh --migrate # applique aussi les migrations Drizzle Neon
#
# Migrations : opt-in (--migrate). drizzle-kit migrate est idempotent ; lit
# DATABASE_URL depuis apps/site/.env (Neon prod). Aucun schéma touché sans le flag.
# ─────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

DO_PULL=0
DO_MIGRATE=0
for a in "$@"; do
  case "$a" in
    --pull) DO_PULL=1 ;;
    --migrate) DO_MIGRATE=1 ;;
    -h|--help) sed -n '2,18p' "$0"; exit 0 ;;
    *) echo "✗ arg inconnu: $a" >&2; exit 2 ;;
  esac
done

PREV_HEAD="$(git rev-parse HEAD)"

rollback() {
  echo "✗ échec déploiement site — rollback vers $PREV_HEAD" >&2
  git reset --hard "$PREV_HEAD" >/dev/null 2>&1 || true
  NEXT_DEPLOYMENT_ID="$(git rev-parse --short HEAD)" bun --filter @shenron/site build >/dev/null 2>&1 || true
  sudo systemctl restart shenron-site.service || true
  exit 1
}

if [[ $DO_PULL -eq 1 ]]; then
  echo "▶ git pull"
  git pull --ff-only || { echo "✗ git pull a échoué" >&2; exit 1; }
fi

# deploymentId = SHA court du commit déployé (version skew protection, cf.
# next.config.ts). La clé NEXT_SERVER_ACTIONS_ENCRYPTION_KEY (stable, dans
# apps/site/.env, chargée par Next au build) doit être présente DÈS le build :
# elle est embarquée dans l'output et réutilisée au runtime.
export NEXT_DEPLOYMENT_ID="$(git rev-parse --short HEAD)"
echo "▶ build (@shenron/site) · deploymentId=$NEXT_DEPLOYMENT_ID"
bun --filter @shenron/site build || rollback

if [[ $DO_MIGRATE -eq 1 ]]; then
  echo "▶ migrations Drizzle (Neon prod)"
  ( cd apps/site && bunx drizzle-kit migrate ) || rollback
fi

echo "▶ restart shenron-site.service"
sudo systemctl restart shenron-site.service
sleep 4
sudo systemctl is-active --quiet shenron-site.service || rollback

echo "▶ smoke (loopback :3000)"
for path in / /wiki/sagas /api/me; do
  code="$(curl -fsS -o /dev/null -w '%{http_code}' "http://127.0.0.1:3000$path" || echo 000)"
  echo "  $path -> $code"
  [[ "$code" == 2* || "$code" == 3* ]] || rollback
done

echo "✓ site déployé · journalctl -u shenron-site -f"
