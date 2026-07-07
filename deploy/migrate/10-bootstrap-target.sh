#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# 10-bootstrap-target.sh — provisionne un VPS Ubuntu 26.04 NU pour la stack shenron.
#
# À exécuter SUR LA CIBLE, en tant qu'utilisateur `ubuntu` (avec sudo).
# Idempotent : relançable sans dommage. N'installe AUCUNE donnée applicative
# (cf. 20-transfer.sh) ni le code (cf. 30-deploy.sh).
#
#   SHENRON_PG_PASSWORD=<motdepasse-du-DATABASE_URL> bash 10-bootstrap-target.sh
#
# Le mot de passe PG DOIT être celui présent dans apps/site/.env (DATABASE_URL)
# et ~/.shenron-neon.env, sinon l'app ne pourra pas se connecter.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

log() { printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }

: "${SHENRON_PG_PASSWORD:?définir SHENRON_PG_PASSWORD (= mot de passe du rôle shenron dans DATABASE_URL)}"

# ── 1. Paquets système ───────────────────────────────────────────────────────
log "apt update + paquets système"
sudo apt-get update -qq
sudo apt-get install -y -qq \
  git curl ca-certificates gnupg unzip rsync jq openssl \
  build-essential pkg-config \
  postgresql postgresql-contrib \
  redis-server \
  nginx libnginx-mod-http-brotli-filter libnginx-mod-http-brotli-static \
  certbot python3-certbot-dns-ovh \
  ffmpeg fontconfig \
  libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev \
  tesseract-ocr tesseract-ocr-fra tesseract-ocr-jpn

# ── 2. Bun (runtime du bot, du site et du MCP) ───────────────────────────────
log "Bun (utilisateur $(whoami))"
if [ ! -x "$HOME/.bun/bin/bun" ]; then
  curl -fsSL https://bun.sh/install | bash
fi
export PATH="$HOME/.bun/bin:$PATH"
# Doctrine CLAUDE.md : Bun canary (la source tourne en 1.4.0-canary).
"$HOME/.bun/bin/bun" upgrade --canary || true
"$HOME/.bun/bin/bun" --version

# ── 3. PostgreSQL : rôle shenron + base shenron_site (schémas public + bot) ───
log "PostgreSQL : rôle + base"
sudo systemctl enable --now postgresql
psql_su() { sudo -u postgres psql -v ON_ERROR_STOP=1 "$@"; }
psql_su -tAc "SELECT 1 FROM pg_roles WHERE rolname='shenron'" | grep -q 1 \
  || psql_su -c "CREATE ROLE shenron LOGIN PASSWORD '${SHENRON_PG_PASSWORD}'"
# (re)pose le mot de passe au cas où le rôle préexiste avec un autre secret
psql_su -c "ALTER ROLE shenron LOGIN PASSWORD '${SHENRON_PG_PASSWORD}'"
psql_su -tAc "SELECT 1 FROM pg_database WHERE datname='shenron_site'" | grep -q 1 \
  || psql_su -c "CREATE DATABASE shenron_site OWNER shenron"
psql_su -d shenron_site -c "CREATE SCHEMA IF NOT EXISTS bot AUTHORIZATION shenron;"
psql_su -d shenron_site -c "GRANT ALL ON SCHEMA public TO shenron;"
psql_su -d shenron_site -c "ALTER SCHEMA public OWNER TO shenron;"

# ── 4. Redis : activer + persistence RDB (comme la source) ───────────────────
log "Redis"
sudo systemctl enable --now redis-server
redis-cli ping >/dev/null && echo "redis OK"

# ── 5. nginx : prérequis http{} (zone rpb_api + brotli/gzip) via drop-in ─────
#    (les vhosts référencent la zone rpb_api et brotli_static ; sur une nginx
#     fraîche ces directives n'existent pas — on les pose ici, une seule fois.)
log "nginx : drop-in http-block + webroot ACME"
#    On n'ajoute QUE les directives absentes du nginx.conf par défaut d'Ubuntu
#    (gzip/server_tokens/ssl y sont déjà → les redéclarer = "directive is duplicate").
sudo tee /etc/nginx/conf.d/00-shenron-http.conf >/dev/null <<'NGINX'
# Prérequis http{} des vhosts shenron. brotli (module libnginx-mod-http-brotli-*)
# + la zone de rate-limit référencée par les location /api/. Le reste (gzip, ssl,
# server_tokens) provient du nginx.conf par défaut — ne PAS le redéclarer ici.
brotli on;
brotli_comp_level 6;
brotli_min_length 256;
brotli_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml application/xml+rss application/x-javascript application/wasm image/svg+xml font/woff2;
brotli_static on;
limit_req_zone $binary_remote_addr zone=rpb_api:10m rate=30r/s;
NGINX

sudo install -d -m 755 /var/www/html/.well-known/acme-challenge
sudo systemctl enable --now nginx
sudo nginx -t

log "Bootstrap terminé. Étapes suivantes : 20-transfer.sh (source) puis 30-deploy.sh (cible)."
