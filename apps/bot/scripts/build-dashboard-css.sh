#!/usr/bin/env bash
# Compile le CSS Tailwind v4 du dashboard admin (styles.css → styles.compiled.css).
#
# Pourquoi pas juste `bunx @tailwindcss/cli` : le moteur natif @tailwindcss/oxide
# (Rust) SIGSEGV sous le runtime Bun sur certains kernels (le VPS de prod en
# particulier — cf. mémoire « build SIGSEGV sous Bun → utiliser node »). Les
# runners CI standards exécutent bunx sans souci. Ce wrapper tente donc Bun
# d'abord (rapide, conforme au repo Bun-only) et retombe sur node uniquement si
# Bun crashe — gardant la commande portable partout.
set -uo pipefail

cd "$(dirname "$0")/.."
IN=src/dashboard/styles.css
OUT=src/dashboard/styles.compiled.css

if bunx @tailwindcss/cli --input "$IN" --output "$OUT" --minify; then
	exit 0
fi

echo "⚠ bunx @tailwindcss/cli a échoué (probable SIGSEGV oxide sous Bun) → fallback node" >&2

# `npx` seul résout souvent vers le shim Bun (~/.bun/bin/npx) → re-crash.
# On force le vrai npx node : /usr/local/bin/npx (symlink fnm stable) en
# priorité, sinon le premier npx du PATH qui n'est pas le shim Bun.
NPX=""
for cand in /usr/local/bin/bunx "$(command -v bunx 2>/dev/null || true)"; do
	if [ -n "$cand" ] && [ -x "$cand" ] && ! readlink -f "$cand" 2>/dev/null | grep -q "/.bun/"; then
		NPX="$cand"
		break
	fi
done

if [ -z "$NPX" ]; then
	echo "✗ aucun bunx node trouvé pour le fallback (installe node ou répare /usr/local/bin/npx)" >&2
	exit 1
fi

exec "$NPX" --yes @tailwindcss/cli --input "$IN" --output "$OUT" --minify
