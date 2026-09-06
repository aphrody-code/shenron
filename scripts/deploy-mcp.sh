#!/usr/bin/env bash
# Vérifie puis redémarre le MCP public et exige un upstream bot sain.
# Usage : bash scripts/deploy-mcp.sh [--pull]
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP="$ROOT/apps/mcp"
PULL=0
for arg in "$@"; do
  case "$arg" in
    --pull) PULL=1 ;;
    -h|--help) sed -n '2,3p' "$0"; exit 0 ;;
    *) echo "arg inconnu: $arg" >&2; exit 2 ;;
  esac
done

cd "$ROOT"
export PATH="$HOME/.bun/bin:$PATH"
if [[ "$PULL" -eq 1 ]]; then git pull --ff-only origin main; fi

cd "$APP"
bun run lint
bun run type-check
mkdir -p .bun-cache
sudo systemctl restart shenron-mcp

BODY=""
HTTP="000"
for _ in $(seq 1 20); do
  BODY=$(curl -sS --max-time 5 http://127.0.0.1:5010/health 2>/dev/null || true)
  HTTP=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:5010/health 2>/dev/null || echo "000")
  if [[ "$HTTP" == "200" && "$BODY" == *'"upstream":"ok"'* ]]; then break; fi
  sleep 2
done

if ! sudo systemctl is-active --quiet shenron-mcp || [[ "$HTTP" != "200" || "$BODY" != *'"upstream":"ok"'* ]]; then
  echo "MCP indisponible ou upstream non sain (HTTP=$HTTP)" >&2
  sudo journalctl -u shenron-mcp -n 40 --no-pager >&2
  exit 1
fi

echo "✓ shenron-mcp actif · /health 200 · upstream ok"
