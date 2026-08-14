#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# deploy-site.sh — conservé pour compatibilité (habitudes, docs, CLAUDE.md).
#
# Le déploiement passe désormais par `scripts/ops/deploy-site.ts` : bascule
# BLEU/VERT sur versions figées (le nouveau build démarre sur un second port,
# est sondé, puis nginx bascule) au lieu d'un build en place + `systemctl
# restart` qui coupait le service et, pire, écrasait le `.next` que le process
# en service était en train de lire — panne vécue le 2026-08-14.
#
#   bash scripts/deploy-site.sh                    # = bun scripts/ops/deploy-site.ts
#   bash scripts/deploy-site.sh --pull             # git pull d'abord
#   bash scripts/deploy-site.sh --migrate          # + migrations Drizzle
#   bash scripts/deploy-site.sh --no-build         # republie le build existant
#   bash scripts/deploy-site.sh --allow-low-memory # passe outre le garde-fou RAM
#
# Autres commandes utiles (directement sur l'orchestrateur) :
#   bun scripts/ops/deploy-site.ts status    # slots, trafic, versions
#   bun scripts/ops/deploy-site.ts rollback  # rebascule sur la version d'avant
# ─────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

FORWARD=()
for a in "$@"; do
  case "$a" in
    --pull)
      echo "▶ git pull"
      git pull --ff-only || { echo "✗ git pull a échoué" >&2; exit 1; }
      ;;
    --migrate)
      echo "▶ migrations Drizzle"
      ( cd apps/site && bunx drizzle-kit migrate ) || { echo "✗ migrations échouées" >&2; exit 1; }
      ;;
    *) FORWARD+=("$a") ;;
  esac
done

exec bun scripts/ops/deploy-site.ts "${FORWARD[@]}"
