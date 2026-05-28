/**
 * resolve-streams.ts — Résout les épisodes voir-anime en flux HLS/mp4 directs
 * (+ headers Referer) et stocke le résultat dans Neon (`bot.db_episodes`
 * colonnes Neon-only `stream_url`, `stream_headers`, `stream_provider`,
 * `stream_at`). Le proxy HLS du site lit ces colonnes et relaie le flux à
 * notre player hls.js.
 *
 * La résolution lance le navigateur headless via le résolveur bxc
 * (`/home/ubuntu/bxc/scripts/resolve-episode.ts`) en sous-process → on l'exécute
 * dans un process transitoire (systemd-run), JAMAIS dans le bot durci.
 *
 * Les liens expirent (~12 h, `e=43200`) → relancer via timer toutes les ~6-8 h.
 * Idempotent : ne re-résout que ce qui est vide ou périmé (> STALE_H heures).
 *
 * Env requis : DATABASE_URL (Neon).
 * Optionnels : ONLY_SERIES, LIMIT, STALE_H (défaut 8), CONCURRENCY (défaut 2),
 *              BXC_DIR (défaut /home/ubuntu/bxc).
 * Usage : via systemd-run avec EnvironmentFile.
 */
import postgres from "postgres";

const NEON_URL = process.env.DATABASE_URL;
if (!NEON_URL) {
	console.error("✗ DATABASE_URL (Neon) requis.");
	process.exit(1);
}
const ONLY = process.env.ONLY_SERIES?.trim() || null;
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : Number.POSITIVE_INFINITY;
const STALE_H = process.env.STALE_H ? Number(process.env.STALE_H) : 8;
const CONCURRENCY = process.env.CONCURRENCY ? Number(process.env.CONCURRENCY) : 2;
const BXC_DIR = process.env.BXC_DIR ?? "/home/ubuntu/bxc";

// Map local lu par le proxy HLS du bot (le bot n'a pas d'accès Neon en runtime,
// et le flux est IP-bound → c'est le bot, même IP que le résolveur, qui fetch).
const STREAMS_JSON = `${import.meta.dir}/../data/streams.json`;
type StreamEntry = { url: string; headers: Record<string, string>; type: string; at: number };
const store: Record<string, StreamEntry> = await Bun.file(STREAMS_JSON)
	.json()
	.catch(() => ({}));

const sql = postgres(NEON_URL, { max: 3, prepare: false });
await sql`ALTER TABLE bot.db_episodes ADD COLUMN IF NOT EXISTS stream_url text`;
await sql`ALTER TABLE bot.db_episodes ADD COLUMN IF NOT EXISTS stream_headers jsonb`;
await sql`ALTER TABLE bot.db_episodes ADD COLUMN IF NOT EXISTS stream_provider text`;
await sql`ALTER TABLE bot.db_episodes ADD COLUMN IF NOT EXISTS stream_at bigint`;

const staleBefore = Date.now() - STALE_H * 3600_000;
type Row = { id: number; series: string; number_in_series: number };
const rows = (await sql`
	SELECT id, series, number_in_series FROM bot.db_episodes
	WHERE players IS NOT NULL
	  AND (stream_url IS NULL OR stream_at IS NULL OR stream_at < ${staleBefore})
	  ${ONLY ? sql`AND series = ${ONLY}` : sql``}
	ORDER BY series, number_in_series
`) as unknown as Row[];

const todo = Number.isFinite(LIMIT) ? rows.slice(0, LIMIT) : rows;
console.log(`→ ${todo.length} épisode(s) à résoudre (stale>${STALE_H}h, concurrency=${CONCURRENCY})`);

type Resolved = { type?: string; url?: string; headers?: Record<string, string>; provider?: string; error?: string };

async function resolveOne(r: Row): Promise<void> {
	const proc = Bun.spawn(
		["bun", "scripts/resolve-episode.ts", r.series, String(r.number_in_series)],
		{ cwd: BXC_DIR, stdout: "pipe", stderr: "ignore" },
	);
	const out = await new Response(proc.stdout).text();
	await proc.exited;
	let res: Resolved = {};
	const line = out.trim().split("\n").filter(Boolean).pop() ?? "";
	try {
		res = JSON.parse(line) as Resolved;
	} catch {
		res = { error: "parse" };
	}
	if (res.url && (res.type === "hls" || res.type === "mp4")) {
		await sql`
			UPDATE bot.db_episodes
			SET stream_url = ${res.url},
			    stream_headers = ${JSON.stringify(res.headers ?? {})}::jsonb,
			    stream_provider = ${res.provider ?? null},
			    stream_at = ${Date.now()}
			WHERE id = ${r.id}`;
		store[String(r.id)] = {
			url: res.url,
			headers: res.headers ?? {},
			type: res.type,
			at: Date.now(),
		};
		console.log(`  ✓ ${r.series} ${r.number_in_series} [${res.provider}] ${res.type}`);
	} else {
		console.log(`  · ${r.series} ${r.number_in_series} — ${res.error ?? "non résolu"}`);
	}
}

let idx = 0;
let ok = 0;
async function worker() {
	for (;;) {
		const i = idx++;
		if (i >= todo.length) break;
		try {
			await resolveOne(todo[i]);
			ok++;
		} catch (e) {
			console.log(`  ! ${todo[i].series} ${todo[i].number_in_series} ${String(e).slice(0, 80)}`);
		}
	}
}
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, todo.length) || 1 }, worker));
await Bun.write(STREAMS_JSON, JSON.stringify(store));
console.log(`✓ Terminé : ${ok}/${todo.length} traités. streams.json = ${Object.keys(store).length} entrées.`);
await sql.end();
