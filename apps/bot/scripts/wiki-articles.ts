/**
 * wiki-articles.ts — Orchestrateur de génération des ARTICLES de wiki (Fandom-like).
 *
 * Contexte. Les tables éditoriales `bot.*` (PostgreSQL du site, source de vérité)
 * n'avaient qu'un champ `description` court (~50-220 c). Ce script ajoute et
 * peuple un vrai champ `article` long-format (markdown façon Fandom), sourcé sur
 * le corpus RAG (Fandom FR + données structurées + débuts manga) avec citations.
 *
 * Colonnes ajoutées (PG-only, ignorées par le reverse-sync Neon→SQLite via
 * intersection de colonnes, comme `players`/`frames`/`pages`) :
 *   - article            text      → corps markdown long
 *   - article_sources    jsonb     → [{ n, label, url, kind }] citations
 *   - article_updated_at bigint    → epoch secondes
 *
 * Le site lit ces colonnes directement (Drizzle, schéma `bot`) et les rend via
 * <WikiMarkdown/>. AUCUNE écriture côté SQLite du bot (replica de lecture).
 *
 * Sous-commandes :
 *   migrate                              → DDL idempotent (ADD COLUMN IF NOT EXISTS)
 *   list <type> [--missing] [--limit N]  → entités à remplir (JSON)
 *        [--ids 1,2] [--names "a,b"] [--has-desc] [--with-relations]
 *   context <type> <id>                  → bundle de grounding RAG (texte sourcé)
 *   write <type> <id> --article-file F --sources-file F   → UPDATE PG
 *   stats                                → couverture article par table
 *
 * Types : characters | planets | sagas | arcs | techniques | transformations | races
 *
 * Grounding : retrieval LEXICAL via FTS5 (`rag_chunks`) sur une connexion bun:sqlite
 * READ-ONLY (aucun verrou d'écriture → ne fige jamais les handlers du bot, cf. piège
 * CLAUDE.md sur les ops DB ad-hoc). FR-biaisé, contenu complet récupéré par rowid.
 *
 * Env : DATABASE_URL = PG du site (via ~/.shenron-neon.env). BOT_DB = chemin sqlite.
 * Usage : bun apps/bot/scripts/wiki-articles.ts <cmd> [...]
 */
import { Database } from "bun:sqlite";
import { readFileSync } from "node:fs";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error("✗ DATABASE_URL (PG du site) requis dans l'environnement.");
	process.exit(1);
}
const BOT_DB = process.env.BOT_DB ?? new URL("../data/bot.db", import.meta.url).pathname;

// ── Config par type d'entité ────────────────────────────────────────────────
interface EntityType {
	/** Nom de table SQL (schéma bot). */
	table: string;
	/** Colonne d'affichage principale. */
	nameCol: string;
	/** Colonnes contextuelles à inclure dans le grounding. */
	extra: string[];
	/** Mot pour les requêtes RAG (« le personnage », « la planète »…). */
	noun: string;
	/** Facettes de requête RAG (FR). */
	facets: string[];
}

const TYPES: Record<string, EntityType> = {
	characters: {
		table: "db_characters",
		nameCol: "name",
		extra: ["name_ja", "name_romaji", "race", "gender", "affiliation", "ki", "max_ki"],
		noun: "le personnage",
		facets: [
			"histoire enfance origine naissance",
			"pouvoirs techniques transformations combats",
			"personnalite famille relations",
			"apparitions saga arc manga",
		],
	},
	planets: {
		table: "db_planets",
		nameCol: "name",
		extra: ["name_ja", "name_romaji", "is_destroyed"],
		noun: "la planete",
		facets: ["histoire habitants peuple", "destruction", "geographie environnement"],
	},
	sagas: {
		table: "db_sagas",
		nameCol: "name",
		extra: ["name_ja", "series"],
		noun: "la saga",
		facets: ["intrigue resume", "personnages affrontements", "arcs episodes"],
	},
	arcs: {
		table: "db_arcs",
		nameCol: "name",
		extra: ["name_ja"],
		noun: "l'arc",
		facets: ["intrigue resume", "combats personnages", "denouement"],
	},
	techniques: {
		table: "db_techniques",
		nameCol: "name",
		extra: ["name_ja", "name_romaji", "type"],
		noun: "la technique",
		facets: ["utilisateurs createur", "fonctionnement effet", "premiere apparition manga"],
	},
	transformations: {
		table: "db_transformations",
		nameCol: "name",
		extra: ["ki"],
		noun: "la transformation",
		facets: ["conditions activation", "apparence pouvoir", "premiere apparition"],
	},
	races: {
		table: "db_races",
		nameCol: "name",
		extra: ["name_ja"],
		noun: "la race",
		facets: ["caracteristiques biologie", "planete origine", "membres notables"],
	},
};

function pickType(name: string | undefined): EntityType {
	const t = name && TYPES[name];
	if (!t) {
		console.error(`✗ Type inconnu « ${name} ». Attendus : ${Object.keys(TYPES).join(", ")}`);
		process.exit(1);
	}
	return t;
}

// ── Helpers FTS5 ────────────────────────────────────────────────────────────
const STOP = new Set([
	"le","la","les","un","une","des","de","du","et","ou","a","au","aux","en","the","of","and",
	"son","sa","ses","ce","cette","dans","pour","par","sur","est","the","to","in",
]);

/** Fold accents + minuscule + alnum → tokens (le tokenizer FTS est remove_diacritics 2). */
function tokens(s: string): string[] {
	return s
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, " ")
		.split(/\s+/)
		.filter((w) => w.length >= 2 && !STOP.has(w));
}

/** Phrase FTS quotée à partir d'un nom (ex. `"son goku"`). */
function phrase(name: string): string {
	const t = tokens(name);
	return t.length ? `"${t.join(" ")}"` : "";
}

/** Groupe OR de tokens d'une facette (ex. `(histoire OR enfance OR origine)`). */
function orGroup(facet: string): string {
	const t = [...new Set(tokens(facet))];
	return t.length ? `(${t.join(" OR ")})` : "";
}

interface Hit {
	rowid: number;
	kind: string;
	title: string;
	url: string;
	content: string;
	lang: string;
}

/** Recherche FTS5 read-only, FR d'abord, repli toutes langues. */
function ftsSearch(db: Database, match: string, limit: number, frOnly: boolean): Hit[] {
	const sql = `SELECT rowid, kind, title, url, content, lang
		FROM rag_chunks WHERE rag_chunks MATCH ?${frOnly ? " AND lang = 'fr'" : ""}
		ORDER BY rank LIMIT ?`;
	try {
		return db.query(sql).all(match, limit) as unknown as Hit[];
	} catch {
		return [];
	}
}

// ── Commande: context ───────────────────────────────────────────────────────
async function cmdContext(typeName: string, idArg: string) {
	const T = pickType(typeName);
	const id = Number(idArg);
	const pg = postgres(DATABASE_URL!, { max: 2, prepare: false });
	const cols = [T.nameCol, "description", ...T.extra].map((c) => `"${c}"`).join(", ");
	const rows = (await pg.unsafe(
		`SELECT ${cols} FROM bot."${T.table}" WHERE id = ${id} LIMIT 1`
	)) as unknown as Record<string, unknown>[];
	await pg.end();
	if (!rows.length) {
		console.error(`✗ ${typeName} #${id} introuvable.`);
		process.exit(1);
	}
	const row = rows[0];
	const name = String(row[T.nameCol] ?? "");
	const desc = String(row.description ?? "");

	const db = new Database(BOT_DB, { readonly: true });
	const namePhrase = phrase(name);
	const seen = new Map<number, Hit>();
	const order: number[] = [];

	const addHits = (hits: Hit[], cap: number) => {
		let n = 0;
		for (const h of hits) {
			if (n >= cap) break;
			if (seen.has(h.rowid)) continue;
			// On veut de la prose : on écarte les stubs trop courts (titres manga ~73 c)
			// sauf s'ils référencent un débUT (utile en citation). On garde >120 c.
			if ((h.content?.length ?? 0) < 120) continue;
			seen.set(h.rowid, h);
			order.push(h.rowid);
			n++;
		}
	};

	if (namePhrase) {
		// 1) Le nom seul, FR d'abord (les pages dédiées remontent en tête).
		addHits(ftsSearch(db, namePhrase, 8, true), 6);
		// 2) Nom + facettes, FR.
		for (const f of T.facets) {
			const g = orGroup(f);
			if (g) addHits(ftsSearch(db, `${namePhrase} AND ${g}`, 4, true), 2);
		}
		// 3) Repli toutes langues si trop peu de FR.
		if (order.length < 6) addHits(ftsSearch(db, namePhrase, 8, false), 6);
	}
	db.close();

	const passages = order.map((rid) => seen.get(rid)!).slice(0, 14);
	// Cap de taille total (~11k c) en tronquant chaque passage.
	const PER = 1000;
	const sources: { n: number; label: string; url: string; kind: string }[] = [];
	const blocks: string[] = [];
	passages.forEach((h, i) => {
		const n = i + 1;
		const body = (h.content ?? "").replace(/\s+/g, " ").trim().slice(0, PER);
		const label = (h.title ?? "").trim() || `${h.kind} #${h.rowid}`;
		sources.push({ n, label, url: h.url ?? "", kind: h.kind ?? "" });
		blocks.push(`[${n}] (${h.kind}${h.lang ? "·" + h.lang : ""}) ${label}\n${body}`);
	});

	const extraFacts = T.extra
		.map((c) => (row[c] != null && String(row[c]).length ? `${c} = ${row[c]}` : null))
		.filter(Boolean)
		.join(" · ");

	// Sortie texte que l'agent rédacteur consomme.
	const out = [
		`ENTITÉ (${typeName} #${id}): ${name}`,
		extraFacts ? `FAITS STRUCTURÉS: ${extraFacts}` : "",
		desc ? `DESCRIPTION ACTUELLE: ${desc}` : "",
		"",
		passages.length
			? `PASSAGES SOURCÉS (${passages.length}) — cite-les en [n], n'invente rien hors de ces passages + faits structurés :`
			: "AUCUN PASSAGE RAG TROUVÉ — rédige à partir des seuls faits structurés + description, prudemment.",
		"",
		...blocks,
		"",
		`SOURCES_JSON: ${JSON.stringify(sources)}`,
	]
		.filter((l) => l !== "")
		.join("\n");
	process.stdout.write(out + "\n");
}

// ── Commande: list ──────────────────────────────────────────────────────────
async function cmdList(typeName: string, args: Args) {
	const T = pickType(typeName);
	const pg = postgres(DATABASE_URL!, { max: 2, prepare: false });
	const conds: string[] = [];
	if (args.flags.has("missing")) conds.push("(article IS NULL OR length(article) = 0)");
	if (args.flags.has("has-desc")) conds.push("length(coalesce(description,'')) > 0");
	if (args.opts.ids) {
		const ids = args.opts.ids.split(",").map((x) => Number(x.trim())).filter((n) => !isNaN(n));
		if (ids.length) conds.push(`id IN (${ids.join(",")})`);
	}
	if (args.opts.names) {
		const ns = args.opts.names.split(",").map((x) => x.trim().replace(/'/g, "''")).filter(Boolean);
		if (ns.length) conds.push(`lower(${T.nameCol}) IN (${ns.map((n) => `'${n.toLowerCase()}'`).join(",")})`);
	}
	const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
	const limit = args.opts.limit ? `LIMIT ${Number(args.opts.limit)}` : "";
	const cols = ["id", T.nameCol, ...T.extra].map((c) => `"${c}"`).join(", ");
	const rows = (await pg.unsafe(
		`SELECT ${cols} FROM bot."${T.table}" ${where} ORDER BY id ${limit}`
	)) as unknown as Record<string, unknown>[];
	await pg.end();
	for (const r of rows) r.type = typeName;
	process.stdout.write(JSON.stringify(rows) + "\n");
}

// ── Commande: write ─────────────────────────────────────────────────────────
async function cmdWrite(typeName: string, idArg: string, args: Args) {
	const T = pickType(typeName);
	const id = Number(idArg);
	const articleFile = args.opts["article-file"];
	const sourcesFile = args.opts["sources-file"];
	if (!articleFile) {
		console.error("✗ --article-file requis.");
		process.exit(1);
	}
	const article = readFileSync(articleFile, "utf8").trim();
	if (article.length < 200) {
		console.error(`✗ Article trop court (${article.length} c) — refus (min 200).`);
		process.exit(1);
	}
	let sources: unknown = [];
	if (sourcesFile) {
		try {
			sources = JSON.parse(readFileSync(sourcesFile, "utf8"));
		} catch (e) {
			console.error(`✗ sources-file JSON invalide: ${e}`);
			process.exit(1);
		}
	}
	const pg = postgres(DATABASE_URL!, { max: 2, prepare: false });
	// jsonb : `pg.json(value)` impératif — `JSON.stringify(...)::jsonb` produirait un
	// SCALAIRE string, pas un array exploitable (pitfall CLAUDE.md `db_episodes.players`).
	// `pg(T.table)` quote l'identifiant de table (schéma `bot` littéral, lowercase).
	const res = await pg`
		UPDATE bot.${pg(T.table)}
		SET article = ${article},
		    article_sources = ${pg.json(sources as never)},
		    article_updated_at = ${Math.floor(Date.now() / 1000)}
		WHERE id = ${id}
		RETURNING id`;
	await pg.end();
	if (!(res as unknown as unknown[]).length) {
		console.error(`✗ ${typeName} #${id} introuvable (0 lignes).`);
		process.exit(1);
	}
	console.log(`✓ ${typeName} #${id} : article ${article.length} c, ${(sources as unknown[]).length ?? 0} sources.`);
}

// ── Commande: migrate ───────────────────────────────────────────────────────
async function cmdMigrate() {
	const pg = postgres(DATABASE_URL!, { max: 2, prepare: false });
	for (const T of Object.values(TYPES)) {
		await pg.unsafe(`ALTER TABLE bot."${T.table}" ADD COLUMN IF NOT EXISTS article text`);
		await pg.unsafe(`ALTER TABLE bot."${T.table}" ADD COLUMN IF NOT EXISTS article_sources jsonb`);
		await pg.unsafe(`ALTER TABLE bot."${T.table}" ADD COLUMN IF NOT EXISTS article_updated_at bigint`);
		console.log(`✓ ${T.table} : colonnes article/article_sources/article_updated_at OK`);
	}
	await pg.end();
}

// ── Commande: stats ─────────────────────────────────────────────────────────
async function cmdStats() {
	const pg = postgres(DATABASE_URL!, { max: 2, prepare: false });
	console.log("type            total  article  %      avg_len");
	for (const [name, T] of Object.entries(TYPES)) {
		const r = (await pg.unsafe(
			`SELECT count(*)::int AS total,
			        count(*) FILTER (WHERE length(coalesce(article,''))>0)::int AS arts,
			        coalesce(round(avg(length(article)) FILTER (WHERE length(coalesce(article,''))>0)),0)::int AS avglen
			 FROM bot."${T.table}"`
		)) as unknown as { total: number; arts: number; avglen: number }[];
		const { total, arts, avglen } = r[0];
		const pct = total ? Math.round((arts / total) * 100) : 0;
		console.log(
			`${name.padEnd(15)} ${String(total).padStart(5)}  ${String(arts).padStart(6)}  ${String(pct).padStart(3)}%  ${String(avglen).padStart(6)}`
		);
	}
	await pg.end();
}

// ── Parsing CLI ─────────────────────────────────────────────────────────────
interface Args {
	flags: Set<string>;
	opts: Record<string, string>;
	positional: string[];
}
function parseArgs(argv: string[]): Args {
	const flags = new Set<string>();
	const opts: Record<string, string> = {};
	const positional: string[] = [];
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a.startsWith("--")) {
			const key = a.slice(2);
			const next = argv[i + 1];
			if (next !== undefined && !next.startsWith("--")) {
				opts[key] = next;
				i++;
			} else {
				flags.add(key);
			}
		} else {
			positional.push(a);
		}
	}
	return { flags, opts, positional };
}

async function main() {
	const [cmd, ...rest] = process.argv.slice(2);
	const args = parseArgs(rest);
	switch (cmd) {
		case "migrate":
			return cmdMigrate();
		case "stats":
			return cmdStats();
		case "list":
			return cmdList(args.positional[0], args);
		case "context":
			return cmdContext(args.positional[0], args.positional[1]);
		case "write":
			return cmdWrite(args.positional[0], args.positional[1], args);
		default:
			console.error(
				"Usage: bun apps/bot/scripts/wiki-articles.ts <migrate|stats|list|context|write> ..."
			);
			process.exit(1);
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
