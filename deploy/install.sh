#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# Provisionne / met à jour shenron sur un hôte Linux + systemd, DEPUIS LE REPO.
#
# Le repo est la **source de vérité** des units systemd et des vhosts nginx
# (plus de dépendance à `~/vps/`). Idempotent : ré-exécutable sans risque.
#
#   bash deploy/install.sh            # units systemd + (re)load + enable timers
#   bash deploy/install.sh --nginx    # idem + copie les vhosts nginx + reload
#   bash deploy/install.sh --start    # idem + démarre/redémarre le bot
#
# Hypothèses de chemins (cf. units) : repo cloné en /home/ubuntu/shenron,
# Bun installé en /home/ubuntu/.bun. Sur un autre layout, éditer
# deploy/systemd/*.service avant (WorkingDirectory / ExecStart / ReadWritePaths).
# ─────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SYSTEMD_SRC="$REPO/deploy/systemd"
NGINX_SRC="$REPO/deploy/nginx"

DO_NGINX=0
DO_START=0
for a in "$@"; do
  case "$a" in
    --nginx) DO_NGINX=1 ;;
    --start) DO_START=1 ;;
    -h|--help) sed -n '2,18p' "$0"; exit 0 ;;
    *) echo "✗ arg inconnu: $a" >&2; exit 2 ;;
  esac
done

CURRENT_USER=$(whoami)
CURRENT_GROUP=$(id -gn)
CURRENT_HOME=$HOME
CURRENT_REPO=$REPO

echo "▶ installation des units systemd ($SYSTEMD_SRC → /etc/systemd/system/)"
# Create a temporary directory to build the modified service files dynamically
TEMP_DIR=$(mktemp -d)
cp "$SYSTEMD_SRC"/*.service "$SYSTEMD_SRC"/*.timer "$TEMP_DIR"

# Replace User, Group, and hardcoded paths dynamically
for f in "$TEMP_DIR"/*.service; do
  sed -i "s|User=ubuntu|User=$CURRENT_USER|g" "$f"
  sed -i "s|Group=ubuntu|Group=$CURRENT_GROUP|g" "$f"
  sed -i "s|/home/ubuntu/shenron|$CURRENT_REPO|g" "$f"
  sed -i "s|/home/ubuntu|$CURRENT_HOME|g" "$f"
done

sudo cp "$TEMP_DIR"/*.service "$TEMP_DIR"/*.timer /etc/systemd/system/
rm -rf "$TEMP_DIR"
sudo systemctl daemon-reload

echo "▶ activation service + timers (backup 03:00, neon-sync /30min, neon-pull /15min, drive-sync daily)"
sudo systemctl enable shenron.service shenron-site.service shenron-embed.service shenron-backup.timer shenron-neon-sync.timer shenron-neon-pull.timer shenron-drive-sync.timer
sudo systemctl enable --now shenron-backup.timer shenron-neon-sync.timer shenron-neon-pull.timer shenron-drive-sync.timer >/dev/null 2>&1 || true
# Sidecar embeddings RAG (charge le modèle ; 1er boot télécharge ~120 Mo).
sudo systemctl enable --now shenron-embed.service >/dev/null 2>&1 || true
# Site Next.js (dragonballfr.com) — next start sous Bun sur 127.0.0.1:3000,
# fronté par nginx (deploy/nginx/dragonballfr.com.conf). Nécessite un build
# préalable : bun --filter @shenron/site build (cf. scripts/deploy-site.sh).
sudo systemctl enable --now shenron-site.service >/dev/null 2>&1 || true
# guild-sync : réconciliation lourde (scan Discord + reparse 24h). Disponible
# mais laissée désactivée par défaut. Pour l'activer :
#   sudo systemctl enable --now shenron-guild-sync.timer
# wiki-crawl : scrape planches manga (bxc headless) -> Neon, 1×/jour 04:30.
# Opt-in (dépend de bxc + réseau sortant lourd). Pour l'activer :
#   sudo systemctl enable --now shenron-wiki-crawl.timer
# stream-resolve : résolution flux vidéo (bxc headless) -> Neon, /2h. Opt-in :
#   sudo systemctl enable --now shenron-stream-resolve.timer
echo "  ✓ units installées · guild-sync/wiki-crawl/stream-resolve.timer laissés désactivés (opt-in)"

if [[ $DO_NGINX -eq 1 ]]; then
  echo "▶ vhosts nginx ($NGINX_SRC → /etc/nginx/conf.d/)"
  echo "  prérequis : zone 'limit_req zone=rpb_api …' dans nginx.conf (http{}),"
  echo "  et certs letsencrypt pour bot.dragonballfr.com / dragonballfr.com"
  echo "  (apex+www, ex. certbot --dns-ovh ; + legacy bot.rpbey.fr / shenron.rpbey.fr)."
  # Le glob *.conf inclut bot.dragonballfr.com.conf (nouveau vhost API bot) en
  # plus de bot.rpbey.fr.conf / shenron.conf.
  sudo cp "$NGINX_SRC"/*.conf /etc/nginx/conf.d/
  if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "  ✓ nginx rechargé"
  else
    echo "  ✗ nginx -t a échoué — vhosts copiés mais PAS rechargés" >&2
    exit 1
  fi
fi

if [[ $DO_START -eq 1 ]]; then
  echo "▶ (re)démarrage du bot"
  sudo systemctl restart shenron.service
  sleep 5
  sudo systemctl is-active --quiet shenron.service \
    && echo "  ✓ shenron actif" \
    || { echo "  ✗ shenron inactif — logs :" >&2; sudo journalctl -u shenron -n 30 --no-pager >&2; exit 1; }
  echo "▶ (re)démarrage du site"
  sudo systemctl restart shenron-site.service
  sleep 4
  sudo systemctl is-active --quiet shenron-site.service \
    && echo "  ✓ shenron-site actif" \
    || { echo "  ✗ shenron-site inactif — logs :" >&2; sudo journalctl -u shenron-site -n 30 --no-pager >&2; exit 1; }
fi

echo "✓ install terminé"
echo "  · état    : systemctl status shenron --no-pager"
echo "  · timers  : systemctl list-timers 'shenron*' --no-pager"
echo "  · démarrer: sudo systemctl start shenron   (si pas --start)"
