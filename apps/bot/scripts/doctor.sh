#!/usr/bin/env bash
#
# Shenron — health check
#
# Usage : bash scripts/doctor.sh
#
# Vérifie : Bun, node_modules, .env (champs requis), DB (fichier + migrations),
# token Discord (ping REST API), process déjà en cours.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

C_G='\033[1;32m'; C_Y='\033[1;33m'; C_R='\033[1;31m'; C_B='\033[1;34m'; C_RESET='\033[0m'
ok()   { printf "${C_G}✓${C_RESET} %s\n" "$*"; }
warn() { printf "${C_Y}!${C_RESET} %s\n" "$*"; }
bad()  { printf "${C_R}✗${C_RESET} %s\n" "$*"; }
hdr()  { printf "\n${C_B}── %s ──${C_RESET}\n" "$*"; }

STATUS=0

# ── Bun ─────────────────────────────────────────────────────────────────────
hdr "Runtime"
if command -v bun >/dev/null 2>&1; then
	ok "Bun $(bun --version)"
else
	bad "Bun non installé"; STATUS=1
fi

# ── deps ────────────────────────────────────────────────────────────────────
hdr "Dépendances"
if [[ -d node_modules ]]; then
	ok "node_modules/ présent"
else
	bad "node_modules/ absent — lance : bun install"; STATUS=1
fi

# ── .env ────────────────────────────────────────────────────────────────────
hdr "Environnement (.env)"
if [[ ! -f .env ]]; then
	bad ".env absent — lance : bash scripts/setup.sh"; STATUS=1
else
	ok ".env présent"
	for key in DISCORD_TOKEN GUILD_ID OWNER_ID; do
		val=$(grep -E "^${key}=" .env | head -1 | cut -d= -f2- | tr -d ' ' || true)
		if [[ -z "$val" || "$val" == "ton-token-ici" || "$val" == "TODO" ]]; then
			bad "$key manquant ou placeholder"; STATUS=1
		else
			# Masque la valeur (garde 4 premiers / 4 derniers chars)
			masked="${val:0:4}…${val: -4}"
			ok "$key = $masked"
		fi
	done
fi

# ── DB ──────────────────────────────────────────────────────────────────────
hdr "Base de données"
DB_PATH=$(grep -E "^DATABASE_PATH=" .env 2>/dev/null | cut -d= -f2- | tr -d ' ' || echo "./data/bot.db")
DB_PATH="${DB_PATH:-./data/bot.db}"
if [[ -f "$DB_PATH" ]]; then
	SIZE=$(du -h "$DB_PATH" | cut -f1)
	ok "DB $DB_PATH ($SIZE)"
	# Compte les migrations appliquées
	if command -v bun >/dev/null 2>&1; then
		N=$(bun -e "import {Database} from 'bun:sqlite'; try { const d=new Database('$DB_PATH',{readonly:true}); const r=d.query(\"SELECT COUNT(*) c FROM __drizzle_migrations\").get(); console.log(r?.c ?? 0) } catch { console.log(0) }" 2>/dev/null || echo 0)
		if [[ "$N" -gt 0 ]]; then
			ok "$N migration(s) appliquée(s)"
		else
			warn "0 migration appliquée — lance : bun run db:migrate"
		fi
	fi
else
	warn "DB absente ($DB_PATH) — lance : bun run db:migrate"
fi

# ── Token Discord ───────────────────────────────────────────────────────────
hdr "Connexion Discord"
TOKEN=$(grep -E "^DISCORD_TOKEN=" .env 2>/dev/null | cut -d= -f2- | tr -d ' ' || true)
if [[ -n "${TOKEN:-}" && "$TOKEN" != "ton-token-ici" ]]; then
	HTTP=$(curl -s -o /tmp/shenron-doctor.json -w "%{http_code}" \
		-H "Authorization: Bot $TOKEN" \
		https://discord.com/api/v10/users/@me || echo 000)
	if [[ "$HTTP" == "200" ]]; then
		NAME=$(bun -e "console.log(JSON.parse(await Bun.file('/tmp/shenron-doctor.json').text()).username)" 2>/dev/null || echo "?")
		ok "Token valide — bot : $NAME"
	else
		bad "Token refusé (HTTP $HTTP)"; STATUS=1
	fi
	rm -f /tmp/shenron-doctor.json
else
	warn "Token absent — skip"
fi

# ── Process ─────────────────────────────────────────────────────────────────
hdr "Process"
PIDS=$(pgrep -f "bun.*src/index.ts" 2>/dev/null || true)
if [[ -n "$PIDS" ]]; then
	ok "Bot déjà en cours (PID $PIDS)"
else
	warn "Aucune instance en cours"
fi

# ── Résumé ──────────────────────────────────────────────────────────────────
hdr "Résumé"
if [[ $STATUS -eq 0 ]]; then
	ok "Tout est prêt — lance : bash scripts/start.sh"
else
	bad "Des problèmes empêchent le démarrage — corrige-les d'abord"
fi
exit $STATUS
