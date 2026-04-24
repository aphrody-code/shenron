#!/usr/bin/env bash
#
# Shenron — launcher
#
# Usage :
#   bash scripts/start.sh              # mode watch (bun --watch)
#   bash scripts/start.sh --prod       # mode prod (bun src/index.ts)
#   bash scripts/start.sh --compiled   # utilise le binaire dist/shenron (doit exister)
#   bash scripts/start.sh --bg         # lance en arrière-plan + tail nohup.out
#
# Arrête avec Ctrl+C (ou `pkill -f 'bun src/index.ts'` si lancé en --bg).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MODE="dev"
BG=0
for arg in "$@"; do
	case "$arg" in
		--prod)     MODE="prod" ;;
		--compiled) MODE="compiled" ;;
		--bg)       BG=1 ;;
		-h|--help)
			sed -n '3,10p' "$0"
			exit 0
			;;
		*) echo "✗ Option inconnue : $arg (voir --help)" >&2; exit 1 ;;
	esac
done

# Préflight minimal
if [[ ! -f .env ]]; then
	echo "✗ .env introuvable. Lance d'abord : bash scripts/setup.sh" >&2
	exit 1
fi
if [[ ! -d node_modules ]]; then
	echo "! node_modules absent — bun install…"
	bun install
fi

case "$MODE" in
	dev)
		CMD=(bun --watch src/index.ts)
		;;
	prod)
		CMD=(bun src/index.ts)
		;;
	compiled)
		if [[ ! -x dist/shenron ]]; then
			echo "! dist/shenron absent — compilation…"
			bun build src/index.ts --compile --minify --sourcemap --outfile=dist/shenron
		fi
		CMD=("./dist/shenron")
		;;
esac

if [[ $BG -eq 1 ]]; then
	mkdir -p logs
	LOG="logs/shenron-$(date +%Y%m%d-%H%M%S).log"
	nohup "${CMD[@]}" > "$LOG" 2>&1 &
	echo "✓ Démarré en arrière-plan (PID $!) — logs : $LOG"
	echo "  tail -f $LOG"
	exit 0
fi

exec "${CMD[@]}"
