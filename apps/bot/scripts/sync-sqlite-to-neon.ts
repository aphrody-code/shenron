/**
 * sync-sqlite-to-neon.ts — Miroir read-only de la SQLite du bot vers Neon.
 *
 * Copie TOUTES les tables métier de `apps/bot/data/bot.db` dans le schéma
 * Postgres **`bot`** du Neon du site (isolé de `public.*` → ne touche JAMAIS
 * les tables du site : User, Post, Comment, Wiki*, ba_*).
 *
 * Idempotent : chaque table `bot.<t>` est DROP + CREATE + INSERT dans une
 * transaction. Relançable à volonté (one-shot ou via timer).
 *
 * Lecture SQLite en `readonly` + `safeIntegers` (snowflakes int64 préservés).
 *
 * Env requis : DATABASE_URL = connection string Neon du site (jamais commitée).
 *   vercel env pull → export DATABASE_URL → bun ... ce script. Cf. DEPLOY.md.
 *
 * Usage : bun apps/bot/scripts/sync-sqlite-to-neon.ts
 */
import { Database } from "bun:sqlite";
import postgres from "postgres";

const SQLITE_PATH =
	process.env.BOT_DB ?? new URL("../data/bot.db", import.meta.url).pathname;
const NEON_URL = process.env.DATABASE_URL;
if (!NEON_URL) {
	console.error("✗ DATABASE_URL (Neon) requis dans l'environnement.");
	process.exit(1);
}

// Tables à NE PAS mirrorer :
// - interne drizzle/SQLite
// - FTS5 (db_search + tables shadow) : non portables tel quel vers Postgres
// - ba_* : le site a ses propres tables better-auth dans public, ne pas mélanger
const SKIP = new Set([
	"__drizzle_migrations",
	"ba_user",
	"ba_session",
	"ba_account",
	"ba_verification",
	"db_search",
	"db_search_idx",
	"db_search_docsize",
	"db_search_content",
	"db_search_data",
	"db_search_config",
]);

function pgType(declared: string): string {
	const u = (declared || "").toUpperCase();
	if (u.includes("INT")) return "bigint";
	if (
		u.includes("REAL") ||
		u.includes("FLOA") ||
		u.includes("DOUB") ||
		u.includes("NUM") ||
		u.includes("DEC")
	)
		return "double precision";
	if (u.includes("BLOB")) return "bytea";
	return "text";
}

type Col = { name: string; type: string; pk: number };

const sqlite = new Database(SQLITE_PATH, { readonly: true });
const sql = postgres(NEON_URL, { max: 4, prepare: false });

async function main() {
	const tables = (
		sqlite
			.query(
				`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`,
			)
			.all() as { name: string }[]
	)
		.map((r) => r.name)
		.filter((n) => !SKIP.has(n) && !n.startsWith("rag_chunks"));

	await sql`CREATE SCHEMA IF NOT EXISTS bot`;
	await sql.unsafe(
		`COMMENT ON SCHEMA bot IS 'Miroir read-only de la SQLite du bot Shenron (sync VPS sqlite-to-neon). Ne pas ecrire a la main.'`,
	);

	const report: { table: string; src: number; dst: number; ok: boolean }[] = [];

	for (const t of tables) {
		const cols = sqlite.query(`PRAGMA table_info("${t}")`).all() as Col[];
		if (cols.length === 0) continue;
		const colNames = cols.map((c) => c.name);
		const pkCols = cols
			.filter((c) => c.pk > 0)
			.sort((a, b) => a.pk - b.pk)
			.map((c) => c.name);
		const defs = cols.map((c) => `"${c.name}" ${pgType(c.type)}`);
		const pkClause = pkCols.length
			? `, PRIMARY KEY (${pkCols.map((c) => `"${c}"`).join(",")})`
			: "";

		const rows = sqlite
			.query(`SELECT * FROM "${t}"`)
			.safeIntegers(true)
			.all() as Record<string, unknown>[];

		// Normalise : Uint8Array (BLOB) → Buffer pour bytea
		for (const row of rows) {
			for (const k of colNames) {
				const v = row[k];
				if (v instanceof Uint8Array && !(v instanceof Buffer)) {
					row[k] = Buffer.from(v);
				}
			}
		}

		await sql.begin(async (tx) => {
			await tx.unsafe(`DROP TABLE IF EXISTS bot."${t}" CASCADE`);
			await tx.unsafe(
				`CREATE TABLE bot."${t}" (${defs.join(", ")}${pkClause})`,
			);
			const BATCH = 500;
			for (let i = 0; i < rows.length; i += BATCH) {
				const chunk = rows.slice(i, i + BATCH);
				await tx`INSERT INTO bot.${tx(t)} ${tx(chunk, ...colNames)}`;
			}
		});

		const [{ count }] =
			await sql`SELECT count(*)::int AS count FROM bot.${sql(t)}`;
		const ok = rows.length === Number(count);
		report.push({ table: t, src: rows.length, dst: Number(count), ok });
		console.log(
			`${ok ? "✓" : "✗"} bot.${t.padEnd(28)} sqlite=${rows.length} neon=${count}`,
		);
	}

	const total = report.reduce((s, r) => s + r.dst, 0);
	const bad = report.filter((r) => !r.ok);
	console.log(
		`\n${report.length} tables mirrorées · ${total} lignes · ${bad.length} mismatch`,
	);

	await sql.end();
	sqlite.close();
	if (bad.length) {
		console.error("✗ Mismatch de counts — sync incomplète.");
		process.exit(1);
	}
	console.log("✓ Sync SQLite → Neon (schéma bot) complète et vérifiée.");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
