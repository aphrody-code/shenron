#!/usr/bin/env bun
/**
 * Deploy pipeline composable — chaque étape est skippable via option.
 *
 * Usage:
 *   bun scripts/deploy.ts [options]
 *
 * Modes:
 *   --compile            Binaire standalone (défaut)
 *   --bundle             Bundle JS (dist/index.js)
 *   --no-build           Saute la phase de build
 *
 * Étapes (toutes actives par défaut, skippables) :
 *   --no-entries         Saute gen:entries
 *   --no-typecheck       Saute bunx tsc --noEmit
 *   --no-lint            Saute oxlint
 *   --no-migrate         Saute db:migrate
 *   --seed               Force db:seed-all (off par défaut)
 *
 * Post-deploy:
 *   --restart            systemctl restart <service>
 *   --service=<name>     Nom du service systemd (défaut: shenron)
 *   --user               systemctl --user (sinon sudo)
 *
 * Divers:
 *   --dry-run            Affiche le plan sans exécuter
 *   --verbose, -v        Log chaque commande
 *   --help, -h           Affiche cette aide
 */

import { $ } from "bun";
import { parseArgs } from "node:util";

const t0 = performance.now();

const { values: opts } = parseArgs({
	args: Bun.argv.slice(2),
	options: {
		compile: { type: "boolean", default: false },
		bundle: { type: "boolean", default: false },
		"no-build": { type: "boolean", default: false },
		"no-entries": { type: "boolean", default: false },
		"no-typecheck": { type: "boolean", default: false },
		"no-lint": { type: "boolean", default: false },
		"no-migrate": { type: "boolean", default: false },
		seed: { type: "boolean", default: false },
		restart: { type: "boolean", default: false },
		service: { type: "string", default: "shenron" },
		user: { type: "boolean", default: false },
		"dry-run": { type: "boolean", default: false },
		verbose: { type: "boolean", short: "v", default: false },
		help: { type: "boolean", short: "h", default: false },
	},
	strict: true,
	allowPositionals: false,
});

if (opts.help) {
	console.log(
		await Bun.file(import.meta.path)
			.text()
			.then((s) => s.match(/\/\*\*[\s\S]*?\*\//)?.[0] ?? ""),
	);
	process.exit(0);
}

if (opts.compile && opts.bundle) {
	console.error("✗ --compile et --bundle sont exclusifs");
	process.exit(1);
}

const mode: "compile" | "bundle" | "skip" = opts["no-build"]
	? "skip"
	: opts.bundle
		? "bundle"
		: "compile"; // défaut

const DRY = opts["dry-run"];
const VERBOSE = opts.verbose || DRY;

type Step = {
	name: string;
	skip?: boolean;
	run: () => Promise<unknown>;
};

const steps: Step[] = [
	{
		name: "gen:entries",
		skip: opts["no-entries"],
		run: () => $`bun scripts/gen-entries.ts`,
	},
	{
		name: "type-check",
		skip: opts["no-typecheck"],
		run: () => $`bunx tsc --noEmit`,
	},
	{
		name: "lint (oxlint)",
		skip: opts["no-lint"],
		run: () => $`bunx oxlint`,
	},
	{
		name: "db:migrate",
		skip: opts["no-migrate"],
		run: () => $`bun src/db/migrate.ts`,
	},
	{
		name: "db:seed-all",
		skip: !opts.seed,
		run: async () => {
			await $`bun src/db/seed-wiki.ts`;
			await $`bun src/db/seed-triggers.ts`;
		},
	},
	{
		name: `build (${mode})`,
		skip: mode === "skip",
		run: () =>
			mode === "compile"
				? $`bun build src/index.ts --compile --minify --sourcemap --outfile=dist/shenron`
				: $`bun build src/index.ts --target=bun --outfile=dist/index.js`,
	},
	{
		name: `systemctl restart ${opts.service}`,
		skip: !opts.restart,
		run: () =>
			opts.user
				? $`systemctl --user restart ${opts.service}`
				: $`sudo systemctl restart ${opts.service}`,
	},
];

const planned = steps.filter((s) => !s.skip);
const skipped = steps.filter((s) => s.skip);

console.log(
	`→ Deploy plan (${planned.length} étape${planned.length > 1 ? "s" : ""}) :`,
);
for (const s of planned) console.log(`  ✓ ${s.name}`);
if (skipped.length) {
	console.log(`  (skipped: ${skipped.map((s) => s.name).join(", ")})`);
}

if (DRY) {
	console.log("\n[dry-run] Rien n'a été exécuté.");
	process.exit(0);
}

for (const step of planned) {
	const tStep = performance.now();
	process.stdout.write(`\n▸ ${step.name}…`);
	try {
		const cmd = step.run();
		if (
			!VERBOSE &&
			typeof (cmd as { quiet?: () => unknown }).quiet === "function"
		) {
			await (cmd as { quiet: () => Promise<unknown> }).quiet();
		} else {
			await cmd;
		}
		const dt = ((performance.now() - tStep) / 1000).toFixed(2);
		console.log(` ok (${dt}s)`);
	} catch (err) {
		console.log(" ✗");
		console.error(err);
		process.exit(1);
	}
}

const total = ((performance.now() - t0) / 1000).toFixed(2);
console.log(`\n✓ Deploy ok (${total}s)`);
