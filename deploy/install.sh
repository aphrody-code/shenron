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

EXPECTED="/home/ubuntu/shenron"
if [[ "$REPO" != "$EXPECTED" ]]; then
  echo "⚠ repo en $REPO (≠ $EXPECTED attendu par les units). Vérifie les chemins" >&2
  echo "  absolus dans deploy/systemd/*.service avant de continuer." >&2
fi

echo "▶ installation des units systemd ($SYSTEMD_SRC → /etc/systemd/system/)"
sudo cp "$SYSTEMD_SRC"/*.service "$SYSTEMD_SRC"/*.timer /etc/systemd/system/
sudo systemctl daemon-reload

echo "▶ activation service + timers (backup 03:00, neon-sync /30min, neon-pull /15min)"
sudo systemctl enable shenron.service shenron-backup.timer shenron-neon-sync.timer shenron-neon-pull.timer
sudo systemctl enable --now shenron-backup.timer shenron-neon-sync.timer shenron-neon-pull.timer >/dev/null 2>&1 || true
# guild-sync : réconciliation lourde (scan Discord + reparse 24h). Disponible
# mais laissée désactivée par défaut. Pour l'activer :
#   sudo systemctl enable --now shenron-guild-sync.timer
echo "  ✓ units installées · guild-sync.timer laissé désactivé (opt-in)"

if [[ $DO_NGINX -eq 1 ]]; then
  echo "▶ vhosts nginx ($NGINX_SRC → /etc/nginx/conf.d/)"
  echo "  prérequis : zone 'limit_req zone=rpb_api …' dans nginx.conf (http{}),"
  echo "  et certs letsencrypt pour bot.dragonballfr.com / dragonballfr.com"
  echo "  (+ legacy bot.rpbey.fr / shenron.rpbey.fr conservés)."
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
fi

echo "✓ install terminé"
echo "  · état    : systemctl status shenron --no-pager"
echo "  · timers  : systemctl list-timers 'shenron*' --no-pager"
echo "  · démarrer: sudo systemctl start shenron   (si pas --start)"
