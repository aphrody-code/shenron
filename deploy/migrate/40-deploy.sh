#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# 40-deploy.sh — build + services + certs TLS + nginx, sur la CIBLE.
# À exécuter SUR LA CIBLE (ubuntu), APRÈS 30-transfer-data.sh (secrets + données).
#
#   CERTBOT_EMAIL=you@example.com bash deploy/migrate/40-deploy.sh
#
# N.B. on ne pose QUE les 3 vhosts dragonballfr.com (les vhosts legacy *.rpbey.fr
# du repo référencent des certs d'un autre compte, absents ici).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$HOME/shenron"
export PATH="$HOME/.bun/bin:$PATH"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-contact@aphrody-code.dev}"
log() { printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }

# ── 1. Dossiers sandbox attendus par les units (ReadWritePaths) ──────────────
log "préparation des dossiers runtime"
mkdir -p apps/bot/.bun-cache apps/bot/dist apps/bot/assets/subtitles \
         apps/site/.next apps/site/.bun-cache apps/site/public/wiki \
         "$HOME/.gemini"

# ── 2. Génération + build ────────────────────────────────────────────────────
log "gen:entries + dashboard css"
bun --filter @shenron/bot run gen:entries
bun --filter @shenron/bot run dashboard:css
log "build du site Next (a besoin de apps/site/.env — déjà transféré)"
bun --filter @shenron/site build

# ── 3. Units systemd (install.sh résout User/paths par sed ; SANS --nginx) ───
log "install des units systemd"
bash deploy/install.sh

# ── 4. Certificats TLS (certbot dns-ovh — DNS-01, marche avant la bascule A) ─
log "certificats Let's Encrypt (dns-ovh) pour les 3 domaines dragonballfr"
issue() {
  sudo certbot certonly --dns-ovh --dns-ovh-credentials /etc/letsencrypt/ovh-dbfr.ini \
    --dns-ovh-propagation-seconds 30 --non-interactive --agree-tos -m "$CERTBOT_EMAIL" \
    --keep-until-expiring "$@"
}
issue -d dragonballfr.com -d www.dragonballfr.com
issue -d bot.dragonballfr.com
issue -d mcp.dragonballfr.com

# ── 5. Vhosts nginx — UNIQUEMENT dragonballfr.com (+ page d'erreur 50x) ──────
log "vhosts nginx dragonballfr + page d'erreur"
sudo cp deploy/nginx/dragonballfr.com.conf \
        deploy/nginx/bot.dragonballfr.com.conf \
        deploy/nginx/mcp.dragonballfr.com.conf /etc/nginx/conf.d/
sudo install -D -m 644 deploy/nginx/errorpages/50x.html /var/www/html/50x.html
sudo nginx -t && sudo systemctl reload nginx

# ── 6. Démarrage des services cœur ──────────────────────────────────────────
log "démarrage bot + site + embed + mcp"
sudo systemctl enable --now shenron.service shenron-site.service shenron-embed.service shenron-mcp.service
sudo systemctl restart shenron.service shenron-site.service

# ── 7. Smoke local (loopback, avant bascule DNS) ────────────────────────────
log "smoke local"
sleep 6
curl -fsS  http://127.0.0.1:5006/health   && echo "  ✓ bot /health"   || echo "  ✗ bot /health"
curl -fsS -o /dev/null -w "  site / -> %{http_code}\n" http://127.0.0.1:3000/ || true
curl -fsS -o /dev/null -w "  mcp /health -> %{http_code}\n" http://127.0.0.1:5010/health || true
echo
echo "✓ déploiement terminé. Vérifier: systemctl status shenron shenron-site shenron-embed shenron-mcp"
echo "  Puis bascule DNS (50-cutover-dns.sh) une fois les smoke verts."
