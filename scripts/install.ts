#!/usr/bin/env bun
/**
 * Shenron — installer cross-platform (Bun).
 *
 * Exécution directe depuis une URL :
 *   bun run https://raw.githubusercontent.com/aphrody-code/shenron/main/scripts/install.ts
 *
 * Variables d'env :
 *   SHENRON_REPO=...     (défaut: https://github.com/aphrody-code/shenron.git)
 *   SHENRON_BRANCH=...   (défaut: main)
 *   SHENRON_DIR=...      (défaut: ./shenron)
 *   SKIP_WIKI_SEED=1     (skip le fetch long du wiki DBZ)
 *
 * Équivalent de scripts/install.sh mais fonctionne aussi sur Windows (où bash n'existe pas)
 * via `bun run <URL>`.
 */

import { $ } from "bun";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const REPO =
	process.env.SHENRON_REPO ?? "https://github.com/aphrody-code/shenron.git";
const BRANCH = process.env.SHENRON_BRANCH ?? "main";
const TARGET = resolve(process.env.SHENRON_DIR ?? `${process.cwd()}/shenron`);
const SKIP_WIKI = process.env.SKIP_WIKI_SEED === "1";

const C = {
	blue: "\x1b[1;34m",
	green: "\x1b[1;32m",
	yellow: "\x1b[1;33m",
	red: "\x1b[1;31m",
	dim: "\x1b[2m",
	reset: "\x1b[0m",
};
const step = (s: string) => console.log(`\n${C.blue}▸ ${s}${C.reset}`);
const ok = (s: string) => console.log(`  ${C.green}✓${C.reset} ${s}`);
const warn = (s: string) => console.log(`  ${C.yellow}!${C.reset} ${s}`);
const die = (s: string): never => {
	console.error(`\n${C.red}✗ ${s}${C.reset}`);
	process.exit(1);
};

console.log(`
    ╔═══════════════════════════════════════╗
    ║   🐉  S H E N R O N   —  INSTALLER    ║
    ╚═══════════════════════════════════════╝
`);

// ── Préflight ─────────────────────────────────────────────────────────────
step("Préflight");

const gitOk = await $`git --version`.nothrow().quiet();
if (gitOk.exitCode !== 0) die("git introuvable. Installe-le d'abord.");
ok(`git ${gitOk.stdout.toString().trim().split(" ").pop()}`);

ok(`Bun ${Bun.version}`);
ok(`Plateforme ${process.platform} / ${process.arch}`);

// ── Clone ────────────────────────────────────────────────────────────────
step(`Clone (branche: ${BRANCH})`);
if (existsSync(`${TARGET}/.git`)) {
	ok(`Repo présent dans ${TARGET} — pull`);
	await $`git -C ${TARGET} fetch --quiet origin ${BRANCH}`;
	await $`git -C ${TARGET} checkout --quiet ${BRANCH}`;
	await $`git -C ${TARGET} pull --quiet --ff-only`;
} else if (existsSync(TARGET)) {
	const entries = await Array.fromAsync(new Bun.Glob("*").scan(TARGET));
	if (entries.length > 0)
		die(`${TARGET} existe et n'est pas vide. Change SHENRON_DIR.`);
	await $`git clone --branch ${BRANCH} --quiet ${REPO} ${TARGET}`;
	ok(`Cloné dans ${TARGET}`);
} else {
	await $`git clone --branch ${BRANCH} --quiet ${REPO} ${TARGET}`;
	ok(`Cloné dans ${TARGET}`);
}

// ── bun install ──────────────────────────────────────────────────────────
step("Installation des dépendances");
await $`bun install --frozen-lockfile`.cwd(TARGET).nothrow().quiet();
// Fallback sans lockfile strict si frozen échoue (ex. clone sur branche non alignée)
const installCheck = await $`test -d ${TARGET}/node_modules`.nothrow().quiet();
if (installCheck.exitCode !== 0) {
	await $`bun install`.cwd(TARGET);
}
ok("node_modules prêts");

// ── .env ─────────────────────────────────────────────────────────────────
step(".env");
const envPath = `${TARGET}/.env`;
if (!existsSync(envPath)) {
	await $`cp ${TARGET}/.env.example ${envPath}`;
	await $`chmod 600 ${envPath}`.nothrow().quiet();
	ok(".env créé depuis .env.example (perms 600)");
	warn("Tu dois éditer .env pour renseigner au minimum :");
	console.log(
		`    ${C.dim}- DISCORD_TOKEN  (portail dev Discord → Bot → Reset Token)${C.reset}`,
	);
	console.log(
		`    ${C.dim}- GUILD_ID       (clic droit serveur → Copier l'ID)${C.reset}`,
	);
	console.log(
		`    ${C.dim}- OWNER_ID       (clic droit sur toi → Copier l'ID)${C.reset}`,
	);
} else {
	ok(".env existant — conservé");
}

// Vérifie les 3 champs critiques
const envText = await Bun.file(envPath).text();
const envMap = new Map<string, string>();
for (const line of envText.split("\n")) {
	const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
	if (m) envMap.set(m[1]!, m[2]!.trim());
}
const missing = ["DISCORD_TOKEN", "GUILD_ID", "OWNER_ID"].filter((k) => {
	const v = envMap.get(k);
	return !v || v === "ton-token-ici" || v === "TODO";
});
if (missing.length > 0) {
	warn(`.env incomplet — manquant : ${missing.join(", ")}`);
	warn("Édite .env puis relance `bash scripts/setup.sh`.");
	console.log(
		`\n${C.green}━━━ Clone + deps OK. Édite .env pour continuer. ━━━${C.reset}\n`,
	);
	console.log(`  ${C.dim}cd${C.reset} ${C.blue}${TARGET}${C.reset}`);
	process.exit(0);
}
ok("DISCORD_TOKEN, GUILD_ID, OWNER_ID présents");

// ── DB + seeds ───────────────────────────────────────────────────────────
step("Base de données");
await $`mkdir -p ${TARGET}/data`;
await $`bun run db:migrate`.cwd(TARGET);
ok("Migrations appliquées");

step("Seeds");
await $`bun src/db/seed-triggers.ts`.cwd(TARGET);
ok("15 triggers de succès seedés");

if (!SKIP_WIKI) {
	step("Seed wiki DBZ (~60 s)");
	const res = await $`bun src/db/seed-wiki.ts`.cwd(TARGET).nothrow();
	if (res.exitCode === 0) ok("Wiki DBZ seedé");
	else
		warn("Seed wiki a échoué — relance plus tard avec `bun run db:seed-wiki`");
} else {
	warn("Seed wiki sauté (SKIP_WIKI_SEED=1)");
}

// ── Fin ──────────────────────────────────────────────────────────────────
console.log(`\n${C.green}━━━ Installation terminée ━━━${C.reset}\n`);
console.log(`  ${C.dim}cd${C.reset} ${C.blue}${TARGET}${C.reset}`);
console.log(
	`  ${C.dim}Démarrer :${C.reset} ${C.blue}bun run dev${C.reset}  (ou ${C.blue}bash scripts/start.sh${C.reset})`,
);
console.log(
	`  ${C.dim}Health check :${C.reset} ${C.blue}bash scripts/doctor.sh${C.reset}`,
);
console.log("");
