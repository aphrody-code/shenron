#!/usr/bin/env bash
# Backup quotidien du PostgreSQL local du site (base shenron_site : schémas
# public + bot). pg_dump à chaud (consistent via snapshot MVCC), gzip -9,
# rétention 14 jours. Cron quotidien 03:30 UTC (timer shenron-pg-backup).
#
# Mis en place lors de la migration Neon → PostgreSQL local (2026-06-23).
# DATABASE_URL est fourni par l'EnvironmentFile ~/.shenron-neon.env (= URL du
# PG local depuis la migration), ou par l'environnement si lancé à la main.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# DATABASE_URL : env direct, sinon lu depuis ~/.shenron-neon.env.
if [[ -z "${DATABASE_URL:-}" && -f "$HOME/.shenron-neon.env" ]]; then
  DATABASE_URL="$(grep -E '^DATABASE_URL=' "$HOME/.shenron-neon.env" | tail -1 | cut -d= -f2-)"
fi
if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "✗ DATABASE_URL introuvable (ni env ni ~/.shenron-neon.env)" >&2
  exit 1
fi
if [[ "$DATABASE_URL" == *neon.tech* ]]; then
  echo "✗ DATABASE_URL pointe sur Neon — ce backup vise le PG local. Abandon." >&2
  exit 1
fi

DEST_DIR="$PROJECT_ROOT/data/backups/shenron-pg"
TS=$(date -u +%Y%m%d-%H%M%S)
DEST="$DEST_DIR/shenron_site-$TS.sql.gz"
mkdir -p "$DEST_DIR"

# Dump logique complet (public + bot + drizzle), portable. --no-owner pour
# pouvoir restaurer sous n'importe quel rôle (psql -v ON_ERROR_STOP=1 -f).
pg_dump "$DATABASE_URL" --no-owner --no-privileges | gzip -9 > "$DEST"

# Garde-fou : un dump quasi vide (< 10 Ko gz) trahit un échec → ne pas purger.
SIZE=$(stat -c %s "$DEST")
if (( SIZE < 10240 )); then
  echo "✗ dump suspect ($(numfmt --to=iec "$SIZE")) — conservé, purge annulée." >&2
  exit 1
fi

# Purge > 14 jours.
find "$DEST_DIR" -name 'shenron_site-*.sql.gz' -mtime +14 -delete

echo "[$TS] shenron pg backup: $(numfmt --to=iec "$SIZE") → $DEST"
