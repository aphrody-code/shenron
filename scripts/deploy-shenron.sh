#!/usr/bin/env bash
# Build dashboard + restart shenron.service.
#
# Etapes :
#   1. git pull (submodule, optionnel via --pull)
#   2. restore dashboard.html (Bun bundler le re-ecrit a chaque build)
#   3. purge dist/dashboard-* obsoletes
#   4. lint + tsc --noEmit
#   5. bun run build
#   6. sudo systemctl restart shenron
#   7. smoke test /auth/me
#
# Usage :
#   bash scripts/deploy-shenron.sh           # build complet + restart
#   bash scripts/deploy-shenron.sh --pull    # git pull + build + restart
#   bash scripts/deploy-shenron.sh --restart # restart seul
#   bash scripts/deploy-shenron.sh --build   # build seul (skip restart)
set -euo pipefail

APP_DIR="/home/ubuntu/shenron/apps/bot"
SERVICE="shenron"

PULL=0
BUILD=1
RESTART=1
for arg in "$@"; do
  case "$arg" in
    --pull)    PULL=1 ;;
    --restart) BUILD=0 ;;
    --build)   RESTART=0 ;;
    -h|--help) sed -n '2,16p' "$0"; exit 0 ;;
    *) echo "✗ arg inconnu: $arg" >&2; exit 2 ;;
  esac
done

cd "$APP_DIR"
export PATH="/home/ubuntu/.bun/bin:$PATH"

# Snapshot du commit courant pour rollback automatique en cas d'echec.
PREVIOUS_HEAD=$(git rev-parse HEAD 2>/dev/null || echo "")
echo "▶ snapshot HEAD : ${PREVIOUS_HEAD:0:12}"

if [[ $PULL -eq 1 ]]; then
  echo "▶ git pull --ff-only origin main (submodule)"
  git pull --ff-only origin main
fi

if [[ $BUILD -eq 1 ]]; then
  # IMPORTANT : le service systemd run le TS source (`bun src/index.ts`).
  # `bun run build` (offline) genere des chunks `dashboard-*.{js,css}` ET
  # ECRASE dashboard.html avec des refs vers ces chunks — qui ne sont JAMAIS
  # servis par Bun.serve runtime (qui fait son propre bundling au boot via
  # le HTML import et expose les chunks sur /chunk-*.{js,css}).
  # → on saute `bun run build` et on recompile uniquement le CSS Tailwind
  # (styles.compiled.css est la seule chose de bundler-offline qui est
  # effectivement importee par main.tsx au runtime).

  echo "▶ restore dashboard.html (au cas ou un ancien build l'aurait casse)"
  git checkout HEAD -- dashboard.html 2>/dev/null || true

  echo "▶ purge dist/dashboard-* (chunks offline obsoletes, jamais servis)"
  rm -f dist/dashboard-*.js dist/dashboard-*.css

  echo "▶ bun run lint"
  bun run lint

  echo "▶ bunx tsc --noEmit"
  bunx tsc --noEmit

  echo "▶ check-slash-lengths (Discord refuse description > 100 chars)"
  bun scripts/check-slash-lengths.ts

  echo "▶ bun run dashboard:css (Tailwind v4 → styles.compiled.css)"
  bun run dashboard:css
fi

if [[ $RESTART -eq 1 ]]; then
  echo "▶ sudo systemctl restart $SERVICE"
  sudo systemctl restart "$SERVICE"

  # L'API REST demarre ~3-5s APRES le bot ready (boot-audit + service singletons).
  # On retry /auth/me jusqu'a 200 (max 60s — laisse de la marge pour Discord
  # registration, ProtectSystem, BUN cache cold-start, etc.).
  HTTP="000"
  for i in $(seq 1 30); do
    HTTP=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 \
      http://127.0.0.1:5006/auth/me 2>/dev/null || echo "000")
    [[ "$HTTP" == "200" ]] && break
    sleep 2
  done

  ALIVE="no"
  sudo systemctl is-active --quiet "$SERVICE" && ALIVE="yes"

  if [[ "$ALIVE" == "yes" && "$HTTP" == "200" ]]; then
    echo "  ✓ $SERVICE actif · HTTP /auth/me = 200"
    sudo journalctl -u "$SERVICE" -n 8 --no-pager
  else
    echo "  ✗ deploy KO (active=$ALIVE, HTTP=$HTTP) — derniers logs :" >&2
    sudo journalctl -u "$SERVICE" -n 40 --no-pager >&2

    if [[ -n "$PREVIOUS_HEAD" ]]; then
      echo "  ⏪ rollback automatique vers ${PREVIOUS_HEAD:0:12}" >&2
      git reset --hard "$PREVIOUS_HEAD" || true
      [[ $BUILD -eq 1 ]] && bun run dashboard:css || true
      sudo systemctl restart "$SERVICE"
      sleep 5
      HTTP_RB="000"
      for i in $(seq 1 30); do
        HTTP_RB=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 \
          http://127.0.0.1:5006/auth/me 2>/dev/null || echo "000")
        [[ "$HTTP_RB" == "200" ]] && break
        sleep 2
      done
      if [[ "$HTTP_RB" == "200" ]]; then
        echo "  ✓ rollback réussi — service stable sur ancien commit" >&2
      else
        echo "  ✗ rollback KO également (HTTP=$HTTP_RB) — intervention manuelle requise" >&2
      fi
    fi
    exit 1
  fi
fi

echo "✓ deploy-shenron termine"
