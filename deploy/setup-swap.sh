#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# setup-swap.sh — swap PERMANENT du VPS (idempotent, à relancer sans risque).
#
# Pourquoi 18 Gio de swap sur une machine de 11 Gio de RAM :
#   `next build` (site, ~850 pages SSG) réclame ~10,5 Gio de mémoire ANONYME.
#   Sur 11 Gio de RAM il ne peut aboutir QUE si le noyau évacue massivement
#   vers le swap. Mesuré le 2026-08-14 : avec 12 Gio de swap le build est mort
#   trois fois (OOM killer à ~10,5 Gio) ; à 18 Gio il passe. Le swap sert aussi
#   d'amortisseur au bot + au site, qui tournent désormais sans plafond mémoire.
#
# Avant ce script, les fichiers de swap étaient créés à la main et ABSENTS de
# /etc/fstab : un reboot repartait avec zéro swap — donc plus aucun déploiement
# du site possible, et une prod à la merci du premier pic mémoire.
#
#   bash deploy/setup-swap.sh                 # crée/déclare/active le swap
#   bash deploy/setup-swap.sh --apply-sysctl  # applique aussi la swappiness
#
# `--apply-sysctl` est séparé volontairement : appliquer la swappiness de
# régime (60) PENDANT un build du site le ferait tuer par l'OOM killer, le
# build ayant besoin d'une swappiness haute (scripts/ops/deploy-site.ts la
# relève le temps du build puis la restaure).
# ─────────────────────────────────────────────────────────────────────────
set -euo pipefail

APPLY_SYSCTL=0
[[ "${1:-}" == "--apply-sysctl" ]] && APPLY_SYSCTL=1

# fichier:taille — total 18 Gio. Noms historiques conservés : renommer
# imposerait un `swapoff` (donc une fenêtre sans swap) pour zéro gain.
SWAPFILES=(
  "/swapfile-build:4G"
  "/swapfile-build2:8G"
  "/swapfile-build3:6G"
)

SYSCTL_FILE=/etc/sysctl.d/99-shenron-swap.conf

echo "▶ swap permanent"
for entry in "${SWAPFILES[@]}"; do
  path="${entry%%:*}"
  size="${entry##*:}"

  if [[ ! -f "$path" ]]; then
    echo "  · création $path ($size)"
    sudo fallocate -l "$size" "$path" || { sudo rm -f "$path"; echo "  ✗ disque insuffisant pour $path" >&2; exit 1; }
    sudo chmod 600 "$path"
    sudo mkswap -q "$path"
  fi

  # Déclaration fstab — c'est CE qui manquait : sans elle, le swap disparaît au
  # reboot et `swapoff -a && swapon -a` (purge du watchdog) ne le remonte pas.
  if ! grep -qE "^${path}[[:space:]]" /etc/fstab; then
    echo "  · déclaration fstab de $path"
    printf '%s none swap sw 0 0\n' "$path" | sudo tee -a /etc/fstab >/dev/null
  fi

  if ! swapon --show=NAME --noheadings | grep -qx "$path"; then
    echo "  · activation $path"
    sudo swapon "$path"
  fi
done

# Swappiness de RÉGIME. Le noyau est à 60 par défaut ; on la fixe explicitement
# pour que l'intention soit lisible et survive à un changement de défaut distro.
if [[ ! -f "$SYSCTL_FILE" ]]; then
  echo "  · $SYSCTL_FILE"
  sudo tee "$SYSCTL_FILE" >/dev/null <<'EOF'
# Généré par deploy/setup-swap.sh.
# Swappiness de régime : 60. Le build du site a besoin de 100 (il réclame plus
# de RAM que la machine n'en a) — scripts/ops/deploy-site.ts la relève le temps
# du build puis restaure cette valeur. Ne pas monter 100 en permanence : les
# pages chaudes du bot et du site partiraient en swap, au prix de la latence.
vm.swappiness = 60
EOF
fi

if [[ $APPLY_SYSCTL -eq 1 ]]; then
  sudo sysctl --system >/dev/null
  echo "  · sysctl appliqué (swappiness=$(cat /proc/sys/vm/swappiness))"
else
  echo "  · sysctl NON appliqué (relancer avec --apply-sysctl hors build)"
fi

# zswap — cache compressé DEVANT le swap disque (pas du swap en RAM à la zram :
# zram prendrait de la RAM au process qui en manque déjà). Unit vendorée pour
# que le réglage survive au reboot.
if [[ -f /sys/module/zswap/parameters/enabled ]]; then
  echo "▶ zswap"
  sudo cp "$(dirname "${BASH_SOURCE[0]}")/systemd/shenron-zswap.service" /etc/systemd/system/
  sudo systemctl daemon-reload
  sudo systemctl enable --now shenron-zswap.service >/dev/null 2>&1 || true
  echo "  · zswap=$(cat /sys/module/zswap/parameters/enabled) compresseur=$(cat /sys/module/zswap/parameters/compressor) pool_max=$(cat /sys/module/zswap/parameters/max_pool_percent)%"
else
  echo "  · zswap indisponible sur ce noyau, ignoré"
fi

echo "✓ swap : $(free -g | awk '/^Swap:/{print $2}') Gio déclarés dans /etc/fstab"
swapon --show
