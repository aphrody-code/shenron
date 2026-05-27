/**
 * sync-neon-to-sqlite.ts — Reverse-sync du WIKI ÉDITORIAL : Neon → SQLite.
 *
 * Depuis la migration du wiki côté Next.js, Neon `bot.*` est la SOURCE DE VÉRITÉ
 * du wiki éditorial (le site édite via Server Actions Drizzle ; les scripts
 * d'enrichissement écrivent Neon). Le bot, lui, garde un **replica de lecture
 * local en SQLite** pour ses commandes Discord `/wiki` + le build RAG (FTS5),
 * rapides et indépendants de Neon au runtime.
 *
 * Ce script rafraîchit ce replica : pour chaque table de `WIKI_EDITORIAL`, il
 * remplace les données SQLite par celles de Neon (DELETE + INSERT dans une
 * transaction, FK désactivées le temps du refresh, schéma SQLite préservé).
 *
 * Concurrence : le bot lit bot.db en WAL → les lecteurs voient l'état d'avant-
 * commit puis le nouvel état, jamais un état intermédiaire. `busy_timeout`
 * absorbe les rares contentions (le bot n'écrit jamais ces tables, il les lit).
 *
 * Env requis : DATABASE_URL = connection string Neon (via le timer systemd qui
 * charge /home/ubuntu/.shenron-neon.env). Usage : bun apps/bot/scripts/sync-neon-to-sqlite.ts
 */
import { Database } from "bun:sqlite";
import postgres from "postgres";
import { WIKI_EDITORIAL } from "./sync-sqlite-to-neon";

const SQLITE_PATH =
	process.env.BOT_DB ?? new URL("../data/bot.db", import.meta.url).pathname;
const NEON_URL = process.env.DATABASE_URL;
if (!NEON_URL) {
	console.error("✗ DATABASE_URL (Neon) requis dans l'environnement.");
	process.exit(1);
}

const sqlite = new Database(SQLITE_PATH); // read-write (replica local)
sqlite.exec("PRAGMA busy_timeout = 10000");
const sql = postgres(NEON_URL, { max: 4, prepare: false });

async function main() {
	const report: { table: string; neon: number; sqlite: number; ok: boolean }[] =
		[];

	for (const t of WIKI_EDITORIAL) {
		// Colonnes réellement présentes dans le SQLite local (tolère le drift :
		// on n'insère que des colonnes que la table SQLite connaît).
		const sqliteCols = (
			sqlite.query(`PRAGMA table_info("${t}")`).all() as { name: string }[]
		).map((c) => c.name);
		if (sqliteCols.length === 0) {
			console.warn(`! ${t} absente du SQLite local — skip`);
			continue;
		}

		// Données source depuis Neon (whitelist hardcodée → identifiant sûr).
		const rows = (await sql.unsafe(
			`SELECT * FROM bot."${t}"`,
		)) as unknown as Record<string, unknown>[];

		// Colonnes communes Neon ∩ SQLite, dans l'ordre SQLite.
		const neonCols = rows.length > 0 ? Object.keys(rows[0]) : sqliteCols;
		const cols = sqliteCols.filter((c) => neonCols.includes(c));
		const placeholders = cols.map(() => "?").join(", ");
		const insertSql = `INSERT INTO "${t}" (${cols
			.map((c) => `"${c}"`)
			.join(", ")}) VALUES (${placeholders})`;

		const refresh = sqlite.transaction(
			(items: Record<string, unknown>[]) => {
				sqlite.query(`DELETE FROM "${t}"`).run();
				const stmt = sqlite.query(insertSql);
				for (const r of items) {
					stmt.run(
						...cols.map((c) => {
							const v = r[c];
							if (v === null || v === undefined) return null;
							// postgres-js rend les bigint en string → laisse l'affinité
							// SQLite (INTEGER) convertir ; bool éventuels → 0/1.
							if (typeof v === "boolean") return v ? 1 : 0;
							if (v instanceof Date) return v.getTime();
							return v as string | number;
						}),
					);
				}
			},
		);

		// FK off le temps du refresh atomique (données Neon déjà cohérentes).
		sqlite.exec("PRAGMA foreign_keys = OFF");
		try {
			refresh(rows);
		} finally {
			sqlite.exec("PRAGMA foreign_keys = ON");
		}

		const cnt = (
			sqlite.query(`SELECT count(*) AS n FROM "${t}"`).get() as { n: number }
		).n;
		const ok = cnt === rows.length;
		report.push({ table: t, neon: rows.length, sqlite: cnt, ok });
		console.log(
			`${ok ? "✓" : "✗"} ${t.padEnd(26)} neon=${rows.length} sqlite=${cnt}`,
		);
	}

	const bad = report.filter((r) => !r.ok);
	console.log(
		`\n${report.length} tables wiki rafraîchies · ${bad.length} mismatch`,
	);

	await sql.end();
	sqlite.close();
	if (bad.length) {
		console.error("✗ Mismatch de counts — reverse-sync incomplète.");
		process.exit(1);
	}
	console.log("✓ Reverse-sync Neon → SQLite (wiki éditorial) complète.");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
