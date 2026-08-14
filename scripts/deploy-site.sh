#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# Déploie le SITE Next.js (dragonballfr.com) sur le VPS depuis le repo.
#
# Le site est servi par `next start` sous Bun (unit shenron-site.service) sur
# 127.0.0.1:3000, fronté par nginx (deploy/nginx/dragonballfr.com.conf). Ce
# script : (pull optionnel) -> build -> restart -> smoke -> rollback auto.
#
#   bash scripts/deploy-site.sh           # build + restart + smoke
#   bash scripts/deploy-site.sh --pull    # git pull d'abord (rollback si échec)
#   bash scripts/deploy-site.sh --migrate # applique aussi les migrations Drizzle Neon
#   bash scripts/deploy-site.sh --node    # build sous Node au lieu de Bun (mesure)
#   bash scripts/deploy-site.sh --allow-low-memory  # passe outre le garde-fou RAM
#
# Migrations : opt-in (--migrate). drizzle-kit migrate est idempotent ; lit
# DATABASE_URL depuis apps/site/.env (Neon prod). Aucun schéma touché sans le flag.
# ─────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

DO_PULL=0
DO_MIGRATE=0
DO_NODE=0
ALLOW_LOW_MEM=0
for a in "$@"; do
  case "$a" in
    --pull) DO_PULL=1 ;;
    --migrate) DO_MIGRATE=1 ;;
    --node) DO_NODE=1 ;;
    --allow-low-memory) ALLOW_LOW_MEM=1 ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) echo "✗ arg inconnu: $a" >&2; exit 2 ;;
  esac
done

# TMPDIR du build hors tmpfs. `/tmp` est un tmpfs de 5,7 Go **adossé à la RAM**
# sur ce VPS : les temporaires de Turbopack y mangeaient une part des 11 Go
# pendant que le build en réclamait déjà ~10, ce qui a nourri les OOM du
# 2026-08-14. On le pointe sur du disque (idée reprise de rose-griffon/rg).
BUILD_TMP="${BUILD_TMP:-$HOME/.shenron-build-tmp}"
mkdir -p "$BUILD_TMP"

# Garde-fou mémoire : le build du site a un pic mesuré à ~10,5 Gio (≈850 pages
# SSG). En dessous du seuil, l'OOM killer tranche — et même si bot/site sont
# protégés par OOMScoreAdjust, autant ne pas lancer un build voué à mourir.
# RAM disponible + swap libre, car le build swappe volontiers.
check_memory() {
  local avail swap_free budget need=11264
  avail=$(awk '/^MemAvailable:/{print int($2/1024)}' /proc/meminfo)
  swap_free=$(awk '/^SwapFree:/{print int($2/1024)}' /proc/meminfo)
  budget=$(( avail + swap_free ))
  echo "▶ mémoire : ${avail} Mio dispo + ${swap_free} Mio de swap libre = ${budget} Mio (besoin ~${need} Mio)"
  if [[ $budget -ge $need ]]; then return 0; fi
  if [[ $ALLOW_LOW_MEM -eq 1 ]]; then
    echo "  ⚠ sous le seuil mais --allow-low-memory demandé — on continue" >&2
    return 0
  fi
  echo "✗ mémoire insuffisante pour le build (${budget} Mio < ${need} Mio)." >&2
  echo "  Libérer de la RAM, ajouter du swap (cf. mémoire 'Build site OOM + swap')," >&2
  echo "  ou forcer avec --allow-low-memory." >&2
  exit 1
}

PREV_HEAD="$(git rev-parse HEAD)"
SITE_NEXT="$REPO/apps/site/.next"
SITE_NEXT_PREV="$REPO/apps/site/.next.prev"

# Sauvegarde le build courant AVANT un nouveau build. C'est la garde qui manquait
# lors de l'outage Neon 2026-06-23 : un build raté détruisait le .next sans filet,
# et le rebuild de rollback (toujours contre la même DB morte) échouait aussi →
# site mort. Un build valide a un BUILD_ID ; sinon le .next est cassé/incomplet
# → on le jette pour repartir propre.
snapshot_next() {
  if [[ -f "$SITE_NEXT/BUILD_ID" ]]; then
    rm -rf "$SITE_NEXT_PREV"
    mv "$SITE_NEXT" "$SITE_NEXT_PREV"
  elif [[ -d "$SITE_NEXT" ]]; then
    rm -rf "$SITE_NEXT"
  fi
}

# Restaure le dernier build valide (après git reset, donc cohérent avec le code).
restore_next() {
  if [[ -f "$SITE_NEXT_PREV/BUILD_ID" ]]; then
    rm -rf "$SITE_NEXT"
    mv "$SITE_NEXT_PREV" "$SITE_NEXT"
    return 0
  fi
  return 1
}

rollback() {
  # IMPORTANT : ne JAMAIS `git reset --hard` ici — ça efface le working tree
  # (et a déjà shippé une version incomplète en prod). On restaure seulement
  # le build `.next` précédent et on relance le service.
  echo "✗ échec déploiement site — rollback build (.next) uniquement" >&2
  if restore_next; then
    echo "  ↩ build précédent restauré depuis .next.prev (pas de rebuild, pas de git reset)"
  else
    echo "  ⚠ aucun build précédent valide — tentative de rebuild sur HEAD" >&2
    NEXT_DEPLOYMENT_ID="$(git rev-parse --short HEAD)" bun --filter @shenron/site build >/dev/null 2>&1 || true
  fi
  sudo systemctl restart shenron-site.service || true
  exit 1
}

if [[ $DO_PULL -eq 1 ]]; then
  echo "▶ git pull"
  git pull --ff-only || { echo "✗ git pull a échoué" >&2; exit 1; }
fi

# deploymentId = SHA court du commit déployé (version skew protection, cf.
# next.config.ts). La clé NEXT_SERVER_ACTIONS_ENCRYPTION_KEY (stable, dans
# apps/site/.env, chargée par Next au build) doit être présente DÈS le build :
# elle est embarquée dans l'output et réutilisée au runtime.
export NEXT_DEPLOYMENT_ID="$(git rev-parse --short HEAD)"
export NEXT_TELEMETRY_DISABLED=1
check_memory

# Runtime du build. Bun par défaut (règle Bun-only du repo) ; `--node` bascule
# sur Node 22 pour comparer l'empreinte mémoire — rose-griffon/rg build ses apps
# Next sous Node pour cette raison (et pour un bug de prerender sous Bun).
BUILD_RUNTIME="bun"
BUILD_CMD=(bun --filter @shenron/site build)
if [[ $DO_NODE -eq 1 ]]; then
  NODE_BIN="${NODE_BIN:-/usr/bin/node}"
  [[ -x "$NODE_BIN" ]] || NODE_BIN="$(command -v node || true)"
  [[ -n "$NODE_BIN" && -x "$NODE_BIN" ]] || { echo "✗ node introuvable" >&2; exit 127; }
  # Bun hoiste `next` à la racine du monorepo : pas de node_modules/next dans
  # apps/site, il faut viser le chemin absolu du root.
  NEXT_BIN="$REPO/node_modules/next/dist/bin/next"
  [[ -f "$NEXT_BIN" ]] || { echo "✗ next introuvable ($NEXT_BIN)" >&2; exit 127; }
  BUILD_RUNTIME="node ($("$NODE_BIN" --version))"
  BUILD_CMD=("$NODE_BIN" "$NEXT_BIN" build)
fi

echo "▶ build (@shenron/site) · deploymentId=$NEXT_DEPLOYMENT_ID · runtime=$BUILD_RUNTIME"
snapshot_next
build_start=$(date +%s)
# On ne se fie PAS au seul code retour : Next peut sortir non-zéro après avoir
# émis des artefacts valides (et inversement). La vérité = un BUILD_ID écrit
# APRÈS le début du build (garde reprise de rose-griffon/rg).
if [[ $DO_NODE -eq 1 ]]; then
  ( cd apps/site && env TMPDIR="$BUILD_TMP" NODE_ENV=production "${BUILD_CMD[@]}" ) || true
else
  env TMPDIR="$BUILD_TMP" "${BUILD_CMD[@]}" || true
fi
if [[ ! -f "$SITE_NEXT/BUILD_ID" ]] || [[ "$(stat -c %Y "$SITE_NEXT/BUILD_ID")" -lt "$build_start" ]]; then
  echo "✗ build échoué — BUILD_ID absent ou périmé" >&2
  rollback
fi
echo "  ✓ build en $(( $(date +%s) - build_start ))s · BUILD_ID=$(cat "$SITE_NEXT/BUILD_ID")"

if [[ $DO_MIGRATE -eq 1 ]]; then
  echo "▶ migrations Drizzle (Neon prod)"
  ( cd apps/site && bunx drizzle-kit migrate ) || rollback
fi

echo "▶ restart shenron-site.service"
sudo systemctl restart shenron-site.service
sleep 4
sudo systemctl is-active --quiet shenron-site.service || rollback

echo "▶ smoke (loopback :3000)"
for path in / /wiki/sagas /api/me; do
  code="$(curl -fsS -o /dev/null -w '%{http_code}' "http://127.0.0.1:3000$path" || echo 000)"
  echo "  $path -> $code"
  [[ "$code" == 2* || "$code" == 3* ]] || rollback
done

rm -rf "$SITE_NEXT_PREV"
echo "✓ site déployé · journalctl -u shenron-site -f"
