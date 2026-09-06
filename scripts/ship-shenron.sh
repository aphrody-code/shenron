#!/usr/bin/env bash
# Commit, push and deploy the current Shenron main branch.
# Usage: bash scripts/ship-shenron.sh [--no-deploy]
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DEPLOY=1
for arg in "$@"; do
  case "$arg" in
    --no-deploy) DEPLOY=0 ;;
    -h|--help) sed -n '2,5p' "$0"; exit 0 ;;
    *) echo "arg inconnu: $arg" >&2; exit 2 ;;
  esac
done

test "$(git branch --show-current)" = main
git diff --check
bun run type-check
bun run test:all
git add -A
git diff --cached --check
if git diff --cached --quiet; then
  echo "Aucun changement à committer."
else
  git commit -m "chore(ops): synchronise et déploie Shenron"
fi
git push origin main

if [[ "$DEPLOY" -eq 1 ]]; then
  bash scripts/deploy-shenron.sh --pull
  bun apps/site/scripts/apply-bot-indexes.ts
  bash scripts/deploy-mcp.sh
  bash scripts/deploy-site.sh --pull
  bash scripts/healthcheck.sh
fi
