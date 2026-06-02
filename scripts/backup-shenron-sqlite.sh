#!/usr/bin/env bash
# Backup VACUUM INTO du SQLite Shenron (chaud, WAL-safe).
# Conserve les 14 derniers jours. Cron quotidien 03:00 UTC.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC="$PROJECT_ROOT/apps/bot/data/bot.db"
DEST_DIR="$PROJECT_ROOT/data/backups/shenron-sqlite"
TS=$(date -u +%Y%m%d-%H%M%S)
DEST="$DEST_DIR/bot-$TS.db"

mkdir -p "$DEST_DIR"

# VACUUM INTO crée un snapshot consistent même avec WAL actif (bun:sqlite ouvert)
sqlite3 "$SRC" "VACUUM INTO '$DEST';"
gzip -9 "$DEST"

# Purge > 14 jours
find "$DEST_DIR" -name 'bot-*.db.gz' -mtime +14 -delete

# Log compact
SIZE=$(stat -c %s "$DEST.gz")
echo "[$TS] shenron sqlite backup: $(numfmt --to=iec $SIZE) → $DEST.gz"
