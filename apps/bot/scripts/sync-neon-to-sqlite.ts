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
import { WIKI_EDITORIAL } from "./_wiki-editorial";

const SQLITE_PATH = process.env.BOT_DB ?? new URL("../data/bot.db", import.meta.url).pathname;
const NEON_URL = process.env.DATABASE_URL;
if (!NEON_URL) {
	console.error("✗ DATABASE_URL (Neon) requis dans l'environnement.");
	process.exit(1);
}

const sqlite = new Database(SQLITE_PATH); // read-write (replica local)
sqlite.exec("PRAGMA busy_timeout = 10000");
const sql = postgres(NEON_URL, { max: 4, prepare: false });

/**
 * Colonnes Date stockées en SECONDES côté SQLite (Drizzle `mode: "timestamp"`,
 * cf. schema.ts:579/664/686/702/718/732). postgres-js renvoie ces colonnes
 * comme objets `Date` → il faut écrire `getTime()/1000`, pas `getTime()` (ms),
 * sinon les dates sont fausses d'un facteur 1000 (an ~57000) et le reverse-sync
 * réintroduit la corruption à CHAQUE tick. Toutes les autres colonnes Date des
 * tables WIKI_EDITORIAL sont en secondes (aucune en `timestamp_ms`).
 */
const SECONDS_TS_COLS = new Set([
	"db_assets.created_at",
	"db_episodes.air_date",
	"db_manga_volumes.published_at",
	"db_manga_chapters.published_at",
	"db_movies.release_date",
	"db_games.release_date",
]);

function encodeValue(table: string, col: string, v: unknown): string | number | null {
	if (v === null || v === undefined) return null;
	// postgres-js rend les bigint en string → laisse l'affinité SQLite (INTEGER)
	// convertir ; bool éventuels → 0/1.
	if (typeof v === "boolean") return v ? 1 : 0;
	if (v instanceof Date) {
		return SECONDS_TS_COLS.has(`${table}.${col}`) ? Math.floor(v.getTime() / 1000) : v.getTime();
	}
	return v as string | number;
}

interface TablePlan {
	table: string;
	cols: string[];
	insertSql: string;
	rows: Record<string, unknown>[];
	existing: number;
}

async function main() {
	const report: {
		table: string;
		neon: number;
		sqlite: number;
		ok: boolean;
	}[] = [];

	// ── Phase 1 — lire Neon + préparer les plans (hors transaction SQLite) ──
	const plans: TablePlan[] = [];
	for (const t of WIKI_EDITORIAL) {
		// Colonnes réellement présentes dans le SQLite local (tolère le drift :
		// on n'insère que des colonnes que la table SQLite connaît).
		const sqliteCols = (sqlite.query(`PRAGMA table_info("${t}")`).all() as { name: string }[]).map(
			(c) => c.name
		);
		if (sqliteCols.length === 0) {
			console.warn(`! ${t} absente du SQLite local — skip`);
			continue;
		}

		// Données source depuis Neon (whitelist hardcodée → identifiant sûr).
		const rows = (await sql.unsafe(`SELECT * FROM bot."${t}"`)) as unknown as Record<
			string,
			unknown
		>[];

		const existing = (sqlite.query(`SELECT count(*) AS n FROM "${t}"`).get() as { n: number }).n;

		// Garde anti-truncate : Neon momentanément vide (migration/reset/échec de
		// seed) alors que le replica a des données → NE PAS vider le SQLite.
		// On skip la table (pas de DELETE) et on marque la run en échec (exit≠0)
		// pour que le timer systemd logue l'anomalie.
		if (rows.length === 0 && existing > 0) {
			console.error(`✗ ${t.padEnd(26)} Neon=0 mais SQLite=${existing} → SKIP (anti-truncate)`);
			report.push({ table: t, neon: 0, sqlite: existing, ok: false });
			continue;
		}

		// Colonnes communes Neon ∩ SQLite, dans l'ordre SQLite.
		const neonCols = rows.length > 0 ? Object.keys(rows[0]) : sqliteCols;
		const cols = sqliteCols.filter((c) => neonCols.includes(c));
		const placeholders = cols.map(() => "?").join(", ");
		const insertSql = `INSERT INTO "${t}" (${cols
			.map((c) => `"${c}"`)
			.join(", ")}) VALUES (${placeholders})`;
		plans.push({ table: t, cols, insertSql, rows, existing });
	}

	// ── Phase 2 — UNE seule transaction globale (atomique cross-table) ──
	// Le bot ne voit jamais d'état intermédiaire entre tables (ex. db_characters
	// rafraîchi mais db_transformations pas encore). FK off le temps du refresh
	// (données Neon déjà cohérentes), hors transaction car PRAGMA ne change pas
	// à l'intérieur d'une transaction ouverte.
	// Une ligne source invalide au regard des contraintes SQLite (UNIQUE, NOT
	// NULL, CHECK) ne doit PAS faire tomber le refresh des 18 tables : SQLite
	// abandonne l'INSERT fautif (ON CONFLICT ABORT) sans annuler la transaction
	// en cours, donc on catch par ligne, on la skippe, et on la rapporte. Sans
	// ça, 3 doublons "Goku" créés depuis le studio ont figé le replica du bot
	// pendant un mois (167 épisodes manquants côté Discord/RAG) — cf. l'échec
	// de shenron-neon-pull du 2026-07-11 au 2026-08-13.
	const skipped = new Map<string, string[]>();
	sqlite.exec("PRAGMA foreign_keys = OFF");
	try {
		const apply = sqlite.transaction(() => {
			for (const p of plans) {
				sqlite.query(`DELETE FROM "${p.table}"`).run();
				const stmt = sqlite.query(p.insertSql);
				for (const r of p.rows) {
					try {
						stmt.run(...p.cols.map((c) => encodeValue(p.table, c, r[c])));
					} catch (e) {
						const errs = skipped.get(p.table) ?? [];
						errs.push(`id=${String(r.id ?? "?")} · ${(e as Error).message}`);
						skipped.set(p.table, errs);
					}
				}
			}
		});
		apply();
	} finally {
		sqlite.exec("PRAGMA foreign_keys = ON");
	}

	// ── Phase 3 — vérif counts ──
	for (const p of plans) {
		const cnt = (
			sqlite.query(`SELECT count(*) AS n FROM "${p.table}"`).get() as {
				n: number;
			}
		).n;
		const ok = cnt === p.rows.length;
		const skips = skipped.get(p.table) ?? [];
		report.push({ table: p.table, neon: p.rows.length, sqlite: cnt, ok });
		console.log(
			`${ok ? "✓" : "✗"} ${p.table.padEnd(26)} neon=${p.rows.length} sqlite=${cnt}` +
				(skips.length ? ` · ${skips.length} ligne(s) rejetée(s) — à corriger côté PG` : "")
		);
		for (const m of skips.slice(0, 5)) console.error(`    ↳ ${m}`);
		if (skips.length > 5) console.error(`    ↳ … ${skips.length - 5} autre(s)`);
	}

	const bad = report.filter((r) => !r.ok);
	console.log(`\n${report.length} tables wiki traitées · ${bad.length} anomalie(s)`);

	await sql.end();
	sqlite.close();
	if (bad.length) {
		console.error("✗ Reverse-sync incomplète (mismatch ou anti-truncate).");
		process.exit(1);
	}
	console.log("✓ Reverse-sync Neon → SQLite (wiki éditorial) complète.");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
