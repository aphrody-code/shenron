#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# 30-transfer-data.sh — transfère secrets + données live de la SOURCE vers la CIBLE.
# À exécuter SUR LA SOURCE (là où tournent le bot/site actuels), APRÈS que la cible
# ait passé 10-bootstrap + 20-clone. Streaming direct (rsync/ssh) : aucun gros dump
# local (la source peut être à court d'espace disque).
#
#   TARGET=newvps bash deploy/migrate/30-transfer-data.sh
#
# TARGET = alias SSH (dans ~/.ssh/config) OU user@ip de la cible.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
TARGET="${TARGET:-newvps}"
SRC="$HOME/shenron"
log() { printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }

ssh "$TARGET" 'test -d ~/shenron/apps/bot && test -d ~/shenron/apps/site' \
  || { echo "✗ la cible n'a pas ~/shenron cloné — lancer 20-clone-and-install.sh d'abord" >&2; exit 1; }

# ── 1. Secrets (perms 600 préservées par rsync -a) ───────────────────────────
log "secrets : .env bot/site + neon + ovh"
rsync -a "$SRC/apps/bot/.env"       "$TARGET":shenron/apps/bot/.env
rsync -a "$SRC/apps/site/.env"      "$TARGET":shenron/apps/site/.env
rsync -a "$HOME/.shenron-neon.env"  "$TARGET":.shenron-neon.env
rsync -a "$HOME/.ovh.conf"          "$TARGET":.ovh.conf
ssh "$TARGET" 'install -d -m 700 ~/.config/ovh'
rsync -a "$HOME/.config/ovh/dbfr.conf" "$TARGET":.config/ovh/dbfr.conf
log "credentials OVH pour certbot dns-ovh (/etc/letsencrypt/ovh-dbfr.ini)"
sudo cat /etc/letsencrypt/ovh-dbfr.ini \
  | ssh "$TARGET" 'sudo tee /etc/letsencrypt/ovh-dbfr.ini >/dev/null && sudo chmod 600 /etc/letsencrypt/ovh-dbfr.ini'

# ── 2. SQLite bot.db (snapshot cohérent sans arrêter le bot) ─────────────────
log "bot.db : snapshot VACUUM INTO puis rsync"
SNAP="$(mktemp /tmp/botdb-XXXXXX.db)"
sqlite3 "$SRC/apps/bot/data/bot.db" "VACUUM INTO '$SNAP'"
ssh "$TARGET" 'mkdir -p ~/shenron/apps/bot/data'
rsync -a "$SNAP" "$TARGET":shenron/apps/bot/data/bot.db
rm -f "$SNAP"

# ── 3. Données lourdes (rag + modèles + assets + llm) ────────────────────────
log "data/rag (~1.4G), .models (~2.2G), assets (~3G), data/llm (opt.)"
rsync -a --delete --info=progress2 "$SRC/apps/bot/data/rag/" "$TARGET":shenron/apps/bot/data/rag/
rsync -a --delete --info=progress2 "$SRC/apps/bot/.models/"  "$TARGET":shenron/apps/bot/.models/
rsync -a --delete --info=progress2 "$SRC/apps/bot/assets/"   "$TARGET":shenron/apps/bot/assets/
if [ -d "$SRC/apps/bot/data/llm" ]; then
  rsync -a --info=progress2 "$SRC/apps/bot/data/llm/" "$TARGET":shenron/apps/bot/data/llm/
fi

# ── 4. PostgreSQL shenron_site (public + bot), owners préservés ──────────────
log "PostgreSQL shenron_site : pg_dump | pg_restore (stream)"
ssh "$TARGET" 'sudo -u postgres psql -v ON_ERROR_STOP=1 -d shenron_site -c "DROP SCHEMA IF EXISTS bot CASCADE;"'
sudo -u postgres pg_dump -Fc shenron_site \
  | ssh "$TARGET" 'sudo -u postgres pg_restore -d shenron_site 2>&1 | grep -viE "already exists|errors ignored" || true'
ssh "$TARGET" 'sudo -u postgres psql -d shenron_site -tAc "SELECT (SELECT count(*) FROM information_schema.tables WHERE table_schema=\$\$public\$\$)||\$\$ public / \$\$||(SELECT count(*) FROM information_schema.tables WHERE table_schema=\$\$bot\$\$)||\$\$ bot tables\$\$"'

# ── 5. Redis (RDB complet — choix « dump/restore ») ─────────────────────────
log "Redis : BGSAVE source → remplacement RDB cible"
redis-cli BGSAVE >/dev/null
for _ in $(seq 1 60); do
  redis-cli INFO persistence 2>/dev/null | grep -q 'rdb_bgsave_in_progress:0' && break; sleep 1
done
ssh "$TARGET" 'sudo systemctl stop redis-server'
sudo cat /var/lib/redis/dump.rdb \
  | ssh "$TARGET" 'sudo tee /var/lib/redis/dump.rdb >/dev/null && sudo chown redis:redis /var/lib/redis/dump.rdb && sudo chmod 660 /var/lib/redis/dump.rdb'
ssh "$TARGET" 'sudo systemctl start redis-server && sleep 2 && echo "DBSIZE cible: $(redis-cli DBSIZE)"'

echo "✓ transfert terminé — enchaîner 40-deploy.sh sur la CIBLE"
