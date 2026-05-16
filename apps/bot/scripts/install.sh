#!/usr/bin/env bash
#
# Shenron — installer one-liner
#
# Installe Bun si absent, clone le repo, lance setup.sh, lance doctor.sh.
#
# Usage :
#   curl -fsSL https://raw.githubusercontent.com/aphrody-code/shenron/main/scripts/install.sh | bash
#
#   # avec un dossier custom :
#   curl -fsSL .../install.sh | SHENRON_DIR=/opt/shenron bash
#
#   # branche custom :
#   curl -fsSL .../install.sh | SHENRON_BRANCH=dev bash

set -euo pipefail

REPO="${SHENRON_REPO:-https://github.com/aphrody-code/shenron.git}"
BRANCH="${SHENRON_BRANCH:-main}"
TARGET_DIR="${SHENRON_DIR:-$PWD/shenron}"

C_BLUE='\033[1;34m'; C_GREEN='\033[1;32m'; C_YELLOW='\033[1;33m'; C_RED='\033[1;31m'; C_DIM='\033[2m'; C_RESET='\033[0m'
step() { printf "\n${C_BLUE}▸ %s${C_RESET}\n" "$*"; }
ok()   { printf "  ${C_GREEN}✓${C_RESET} %s\n" "$*"; }
warn() { printf "  ${C_YELLOW}!${C_RESET} %s\n" "$*"; }
die()  { printf "\n${C_RED}✗ %s${C_RESET}\n" "$*" >&2; exit 1; }

# ── Banner ──────────────────────────────────────────────────────────────────
cat <<'BANNER'

    ╔═══════════════════════════════════════╗
    ║   🐉  S H E N R O N   —  INSTALLER    ║
    ╚═══════════════════════════════════════╝

BANNER

# ── Préflight ───────────────────────────────────────────────────────────────
step "Préflight"
command -v git >/dev/null 2>&1 || die "git introuvable. Installe-le d'abord (apt install git / brew install git)"
ok "git $(git --version | awk '{print $3}')"
command -v curl >/dev/null 2>&1 || die "curl introuvable"
ok "curl OK"

# Bun
if ! command -v bun >/dev/null 2>&1; then
	warn "Bun absent — installation"
	curl -fsSL https://bun.com/install | bash
	export BUN_INSTALL="$HOME/.bun"
	export PATH="$BUN_INSTALL/bin:$PATH"
	if ! command -v bun >/dev/null 2>&1; then
		die "L'installation de Bun a échoué. Installe-le manuellement : https://bun.com/install"
	fi
fi
ok "Bun $(bun --version)"

# ── Clone ──────────────────────────────────────────────────────────────────
step "Clone du repo (branche: $BRANCH)"
if [[ -d "$TARGET_DIR/.git" ]]; then
	ok "Repo déjà cloné dans $TARGET_DIR — pull"
	git -C "$TARGET_DIR" fetch --quiet origin "$BRANCH"
	git -C "$TARGET_DIR" checkout --quiet "$BRANCH"
	git -C "$TARGET_DIR" pull --quiet --ff-only
elif [[ -d "$TARGET_DIR" && -n "$(ls -A "$TARGET_DIR" 2>/dev/null)" ]]; then
	die "$TARGET_DIR existe et n'est pas vide. Supprime-le ou choisis un autre SHENRON_DIR=."
else
	git clone --branch "$BRANCH" --quiet "$REPO" "$TARGET_DIR"
	ok "Cloné dans $TARGET_DIR"
fi

cd "$TARGET_DIR"

# ── Setup ──────────────────────────────────────────────────────────────────
step "Lancement de scripts/setup.sh"
if [[ -t 0 ]]; then
	# stdin attaché (exécution directe) — setup interactif OK
	bash scripts/setup.sh
else
	# stdin = pipe (curl | bash) — skip le prompt interactif du wiki
	SKIP_WIKI_SEED=1 bash scripts/setup.sh </dev/null || true
	warn "Exécution via pipe curl — le seed wiki interactif a été sauté."
	warn "Tu peux le lancer plus tard avec : cd $TARGET_DIR && bun run db:seed-wiki"
fi

# ── Doctor ─────────────────────────────────────────────────────────────────
step "Health check"
bash scripts/doctor.sh || warn "Doctor a signalé des problèmes — lis-les ci-dessus"

# ── Fin ────────────────────────────────────────────────────────────────────
printf "\n${C_GREEN}━━━ Installation terminée ━━━${C_RESET}\n\n"
printf "  ${C_DIM}cd${C_RESET} ${C_BLUE}%s${C_RESET}\n" "$TARGET_DIR"
printf "  ${C_DIM}Édite .env si pas déjà fait (DISCORD_TOKEN, GUILD_ID, OWNER_ID)${C_RESET}\n"
printf "  ${C_DIM}Puis :${C_RESET} ${C_BLUE}bash scripts/start.sh${C_RESET}\n\n"
