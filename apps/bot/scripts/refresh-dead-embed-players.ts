/**
 * refresh-dead-embed-players.ts — Détecte les lecteurs (players) voir-anime
 * morts et tente de les RAFRAÎCHIR (pas seulement les purger, contrairement à
 * `prune-dead-embed-players.ts`) : re-scrape la page source voir-anime.to au
 * moment du check pour récupérer une liste de lecteurs à jour, teste les
 * nouveaux candidats, et remplace les morts par les vivants trouvés.
 *
 * Tourne fréquemment (timer `shenron-refresh-players`, ~30 min) sur un petit
 * lot — curseur `players_checked_at` (least-recently-checked d'abord) — pour
 * répartir la charge : le check de vivacité est un simple fetch (pas cher),
 * mais le RE-SCRAPE déclenché quand un lecteur est mort lance un navigateur
 * headless en sous-process DANS le repo bxc
 * (`/home/ubuntu/bxc/scripts/refresh-embed-players.ts`), jamais dans ce
 * process — même isolation que `resolve-streams.ts`.
 *
 * Le prune hebdomadaire (`shenron-prune-players.timer`) reste le filet de
 * sécurité qui purge en bloc sur tout le catalogue si ce watcher n'a pas
 * encore eu le temps de repasser sur une ligne donnée.
 *
 * Env requis : DATABASE_URL (Neon).
 * Optionnels : LIMIT (défaut 15, par table), BXC_DIR (défaut ~/bxc).
 * Usage : bun apps/bot/scripts/refresh-dead-embed-players.ts [--dry-run]
 */
import os from "node:os";
import postgres from "postgres";

const NEON_URL = process.env.DATABASE_URL;
if (!NEON_URL) {
	console.error("✗ DATABASE_URL requis.");
	process.exit(1);
}
const DRY_RUN = process.argv.includes("--dry-run");
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : 15;
const BXC_DIR = process.env.BXC_DIR ?? `${os.homedir()}/bxc`;
const RESCRAPE_TIMEOUT_MS = 45_000;

// onnotice: no-op — sinon postgres.js dump un NOTICE bruyant à chaque run pour
// le `ADD COLUMN IF NOT EXISTS` (idempotent mais tourne à chaque invocation,
// /30min via le timer -> pollue journalctl pour rien).
const sql = postgres(NEON_URL, { max: 5, prepare: false, onnotice: () => {} });

type Player = { name: string; provider: string; embedUrl: string; lang?: "vf" | "vostfr" };

// Identique à prune-dead-embed-players.ts (dupliqué volontairement, cf. ce
// fichier pour le détail des cas rencontrés en conditions réelles).
const BLANKET_DEAD = new Set(["streamhide", "voe", "streamtape", "filemoon"]);
const TRUSTED = new Set(["vidmoly"]);
const DEAD_SIGNATURES = [
	/404 not found/i,
	/video is not exist/i,
	/content restricted/i,
	/dmca complaint/i,
	/file (was )?deleted/i,
	/this domain name may be for sale/i,
];

async function isDead(url: string): Promise<boolean> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8000);
	try {
		const res = await fetch(url, {
			signal: controller.signal,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
				Referer: "https://dragonballfr.com/",
			},
		});
		if (res.status === 404 || res.status === 410) return true;
		const body = await res.text();
		return DEAD_SIGNATURES.some((re) => re.test(body.slice(0, 4000)));
	} catch {
		return true;
	} finally {
		clearTimeout(timeout);
	}
}

async function withConcurrency<T, R>(
	items: T[],
	n: number,
	fn: (item: T) => Promise<R>
): Promise<R[]> {
	const results: R[] = Array.from({ length: items.length });
	let idx = 0;
	async function worker() {
		for (;;) {
			const i = idx++;
			if (i >= items.length) return;
			results[i] = await fn(items[i]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(n, items.length) || 1 }, worker));
	return results;
}

/** true si `p` est mort (bloqué sandbox ou fetch-check négatif) ; jamais vrai pour TRUSTED. */
async function checkOne(p: Player): Promise<boolean> {
	if (TRUSTED.has(p.provider)) return false;
	if (BLANKET_DEAD.has(p.provider)) return true;
	return isDead(p.embedUrl);
}

/** Lance le re-scrape live côté bxc (sous-process, navigateur headless). */
async function rescrape(args: string[]): Promise<Player[]> {
	const proc = Bun.spawn([process.execPath, "scripts/refresh-embed-players.ts", ...args], {
		cwd: BXC_DIR,
		stdout: "pipe",
		stderr: "ignore",
	});
	const timeout = setTimeout(() => proc.kill(), RESCRAPE_TIMEOUT_MS);
	const out = await new Response(proc.stdout).text();
	await proc.exited;
	clearTimeout(timeout);
	// oxlint-disable-next-line unicorn/prefer-array-find -- .pop() récupère la DERNIÈRE ligne non vide (le résultat), pas la première (souvent un log)
	const line = out.trim().split("\n").filter(Boolean).pop() ?? "";
	try {
		const parsed = JSON.parse(line);
		return Array.isArray(parsed) ? (parsed as Player[]) : [];
	} catch {
		return [];
	}
}

function dedupe(players: Player[]): Player[] {
	const seen = new Set<string>();
	const out: Player[] = [];
	for (const p of players) {
		if (seen.has(p.embedUrl)) continue;
		seen.add(p.embedUrl);
		out.push(p);
	}
	return out;
}

type EpisodeRow = {
	id: number;
	title: string;
	series: string;
	numberInSeries: number | null;
	players: Player[];
};
type MovieRow = { id: number; title: string; players: Player[] };

async function processEpisodes() {
	const rows = (await sql`
		SELECT id, title, series, number_in_series AS "numberInSeries", players
		FROM bot.db_episodes
		WHERE players IS NOT NULL AND jsonb_array_length(players) > 0
		ORDER BY players_checked_at ASC NULLS FIRST
		LIMIT ${LIMIT}
	`) as unknown as EpisodeRow[];
	console.log(`\n=== db_episodes — ${rows.length} ligne(s) à vérifier ===`);
	for (const row of rows) {
		if (row.numberInSeries == null) continue;
		await processRow("db_episodes", row.id, row.title, row.players, () =>
			rescrape(["episode", row.series, String(row.numberInSeries)])
		);
	}
}

async function processMovies() {
	const rows = (await sql`
		SELECT id, title, players
		FROM bot.db_movies
		WHERE players IS NOT NULL AND jsonb_array_length(players) > 0
		ORDER BY players_checked_at ASC NULLS FIRST
		LIMIT ${LIMIT}
	`) as unknown as MovieRow[];
	console.log(`\n=== db_movies — ${rows.length} ligne(s) à vérifier ===`);
	for (const row of rows) {
		await processRow("db_movies", row.id, row.title, row.players, () =>
			rescrape(["movie", String(row.id)])
		);
	}
}

async function processRow(
	table: "db_episodes" | "db_movies",
	id: number,
	title: string,
	players: Player[],
	fetchFresh: () => Promise<Player[]>
) {
	const deadFlags = await withConcurrency(players, 10, checkOne);
	const alive = players.filter((_, i) => !deadFlags[i]);
	const anyDead = alive.length !== players.length;

	let finalPlayers = players;
	if (anyDead) {
		console.log(
			`  ⚠ #${id} ${title.slice(0, 40)} : ${players.length - alive.length} mort(s) → re-scrape live...`
		);
		const fresh = await fetchFresh();
		let freshAlive: Player[] = [];
		if (fresh.length > 0) {
			const freshDead = await withConcurrency(fresh, 10, checkOne);
			freshAlive = fresh.filter((_, i) => !freshDead[i]);
		}
		finalPlayers = dedupe([...alive, ...freshAlive]);
		const delta = finalPlayers.length - players.length;
		console.log(
			`    → ${players.length} → ${finalPlayers.length} lecteur(s) (${freshAlive.length} candidat(s) frais vivant(s), ${delta >= 0 ? "+" : ""}${delta})`
		);
	}

	if (!DRY_RUN) {
		const changed = finalPlayers.length !== players.length || anyDead;
		if (changed) {
			await sql`
				UPDATE bot.${sql(table)}
				SET players = ${sql.json(finalPlayers)}, players_checked_at = ${Date.now()}
				WHERE id = ${id}
			`;
		} else {
			await sql`UPDATE bot.${sql(table)} SET players_checked_at = ${Date.now()} WHERE id = ${id}`;
		}
	}
}

console.log(DRY_RUN ? "[DRY RUN — aucune écriture]" : "[LIVE — écriture Postgres]");
await sql`ALTER TABLE bot.db_episodes ADD COLUMN IF NOT EXISTS players_checked_at bigint`;
await sql`ALTER TABLE bot.db_movies ADD COLUMN IF NOT EXISTS players_checked_at bigint`;
await processEpisodes();
await processMovies();
await sql.end();
console.log("\n✓ Terminé.");
