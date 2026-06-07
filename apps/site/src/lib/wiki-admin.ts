/**
 * wiki-admin — accès **lecture + écriture** direct à Neon (schéma `bot`) pour
 * l'admin du wiki Dragon Ball éditorial, sans aller-retour vers l'API REST du
 * bot. Neon `bot.*` est la **source de vérité** du wiki éditorial.
 *
 * Server-only : tape la DB Postgres via Drizzle (`@/lib/db`) → ne doit jamais
 * entrer dans un bundle client. Le route handler `/api/wiki-admin` et les Server
 * Components db-universe sont les seuls consommateurs.
 *
 * Contrat de sortie pour le route handler = **camelCase** (clés des objets
 * Drizzle `bot-schema.ts`), aligné 1:1 sur l'API bot `/api/database` → les
 * composants Client (`DbCrud`, éditeur générique) sont réutilisés verbatim.
 * Les Server Components db-universe consomment du **snake_case** historique :
 * `listWikiSnake` applique la conversion (miroir de `toSnake` de `_lib.ts`).
 *
 * Coercition de types : colonnes bigint (`int(...)` de bot-schema, `dataType
 * "number"`) → `Number(value)` (NaN/"" → null) ; text → `string|null`. La pk
 * auto (id) n'est jamais écrite à l'insert si absente du body.
 */
import "server-only";
import { and, asc, count, desc, eq, like, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import * as botSchema from "@/db/bot-schema";
import { WIKI_TABLE_SPECS, type WikiTableSpec } from "@/lib/wiki-tables";

// Les tables Drizzle bot-schema sont hétérogènes → any localisé et assumé
// (la règle no-explicit-any est déjà off dans eslint.config.mjs).
// biome-ignore lint/suspicious/noExplicitAny: tables Drizzle hétérogènes
type AnyTable = any;
type Row = Record<string, unknown>;

interface ResolvedTable extends WikiTableSpec {
	table: AnyTable;
	/** colonnes camelCase de l'objet Drizzle (toutes, pk incluse). */
	columns: string[];
}

/**
 * Registre runtime : associe chaque spec client-safe (`WIKI_TABLE_SPECS`) à son
 * objet Drizzle `bot-schema`. Garder synchronisé avec `wiki-tables.ts`.
 */
const TABLE_OBJECTS: Record<string, AnyTable> = {
	db_characters: botSchema.botCharacters,
	db_planets: botSchema.botPlanets,
	db_transformations: botSchema.botTransformations,
	db_races: botSchema.botRaces,
	db_techniques: botSchema.botTechniques,
	db_character_techniques: botSchema.botCharacterTechniques,
	db_sagas: botSchema.botSagas,
	db_arcs: botSchema.botArcs,
	db_episodes: botSchema.botEpisodes,
	db_manga_volumes: botSchema.botMangaVolumes,
	db_manga_chapters: botSchema.botMangaChapters,
	db_movies: botSchema.botMovies,
	db_games: botSchema.botGames,
	db_game_characters: botSchema.botGameCharacters,
	db_tools: botSchema.botTools,
	db_sources: botSchema.botSources,
	db_licenses: botSchema.botLicenses,
	db_assets: botSchema.botAssets,
};

export const WIKI_TABLES: Record<string, ResolvedTable> = Object.fromEntries(
	Object.entries(WIKI_TABLE_SPECS).map(([name, spec]) => {
		const table = TABLE_OBJECTS[name];
		if (!table) throw new Error(`[wiki-admin] table Drizzle absente: ${name}`);
		// Les clés camelCase exposées par l'objet Drizzle (colonnes du select).
		const columns = Object.keys(table).filter(
			(k) => table[k] && typeof table[k] === "object" && "name" in table[k]
		);
		return [name, { ...spec, table, columns }];
	})
);

export function isWikiTable(name: string): name is keyof typeof WIKI_TABLES {
	return name in WIKI_TABLES;
}

function getSpec(name: string): ResolvedTable | null {
	return WIKI_TABLES[name] ?? null;
}

/** dataType Drizzle de la colonne camelCase `key` ("number" | "string" | …). */
function colDataType(spec: ResolvedTable, key: string): string | undefined {
	const col = spec.table[key];
	return col?.dataType as string | undefined;
}

/** Coerce une valeur entrante vers le type de la colonne (number / string / null). */
function coerceValue(spec: ResolvedTable, key: string, value: unknown): unknown {
	if (value == null || value === "") return null;
	const dt = colDataType(spec, key);
	if (dt === "number") {
		const n = typeof value === "number" ? value : Number(value);
		return Number.isNaN(n) ? null : n;
	}
	// text et fallback : string
	return typeof value === "string" ? value : String(value);
}

/**
 * Filtre + coerce un body entrant aux colonnes mutables uniquement (whitelist).
 * `forInsert` autorise en plus la pk simple si fournie (jamais générée si absente).
 */
function buildValues(spec: ResolvedTable, body: Row, { forInsert }: { forInsert: boolean }): Row {
	const out: Row = {};
	const allowed = new Set(spec.mutableColumns);
	// À l'insert, on autorise aussi la/les pk si explicitement fournies.
	if (forInsert) {
		for (const pkCol of pkCamelKeys(spec)) {
			if (body[pkCol] !== undefined) allowed.add(pkCol);
		}
	}
	for (const key of allowed) {
		if (key in body) out[key] = coerceValue(spec, key, body[key]);
	}
	return out;
}

/** Clés camelCase de la/des colonne(s) pk (résout snake_case composite → camel). */
function pkCamelKeys(spec: ResolvedTable): string[] {
	const pks = Array.isArray(spec.pk) ? spec.pk : [spec.pk];
	return pks.map((snake) => {
		// pk simple "id"/"key"/"slug" sont déjà identiques en camel.
		if (spec.columns.includes(snake)) return snake;
		const camel = snake.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
		return spec.columns.includes(camel) ? camel : snake;
	});
}

/**
 * Condition WHERE sur la pk. `id` peut être :
 *   - simple : valeur brute
 *   - composite : "a,b" (ordre = ordre des colonnes pk) ou "a:b"
 */
function pkCondition(spec: ResolvedTable, id: string): SQL {
	const keys = pkCamelKeys(spec);
	const parts = keys.length > 1 ? id.split(/[,:]/) : [id];
	if (parts.length !== keys.length) {
		throw new Error(`pk composite ${spec.name} attend ${keys.length} valeurs (reçu "${id}")`);
	}
	const conds = keys.map((key, i) => {
		const raw = parts[i]?.trim() ?? "";
		const coerced = coerceValue(spec, key, raw);
		return eq(spec.table[key], coerced as never);
	});
	return (conds.length === 1 ? conds[0] : and(...conds)) as SQL;
}

// ── camelCase ↔ snake_case ────────────────────────────────────────────────
function toSnakeRow(row: Row): Row {
	const out: Row = {};
	for (const [k, v] of Object.entries(row)) {
		out[k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)] = v;
	}
	return out;
}

// ── API camelCase (route handler / contrat bot) ────────────────────────────

export async function listWiki(
	table: string,
	{ limit = 50, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<{ rows: Row[]; total: number; limit: number; offset: number }> {
	const spec = getSpec(table);
	if (!spec) throw new Error(`Table inconnue: ${table}`);
	const lim = Math.min(500, Math.max(1, limit));
	const off = Math.max(0, offset);
	const rows = (await db.select().from(spec.table).limit(lim).offset(off)) as Row[];
	const [{ value: total = 0 } = { value: 0 }] = await db
		.select({ value: count() })
		.from(spec.table);
	return { rows, total: Number(total), limit: lim, offset: off };
}

export async function getWikiRow(table: string, id: string): Promise<Row | null> {
	const spec = getSpec(table);
	if (!spec) throw new Error(`Table inconnue: ${table}`);
	const rows = (await db.select().from(spec.table).where(pkCondition(spec, id)).limit(1)) as Row[];
	return rows[0] ?? null;
}

export async function insertWiki(table: string, data: Row): Promise<Row> {
	const spec = getSpec(table);
	if (!spec) throw new Error(`Table inconnue: ${table}`);
	const values = buildValues(spec, data, { forInsert: true });
	if (Object.keys(values).length === 0) {
		throw new Error("Aucune colonne fournie.");
	}
	const inserted = (await db
		.insert(spec.table)
		.values(values as never)
		.returning()) as Row[];
	return inserted[0] ?? values;
}

export async function updateWiki(table: string, id: string, data: Row): Promise<Row> {
	const spec = getSpec(table);
	if (!spec) throw new Error(`Table inconnue: ${table}`);
	const values = buildValues(spec, data, { forInsert: false });
	if (Object.keys(values).length === 0) {
		throw new Error("Aucune colonne mutable fournie.");
	}
	const cond = pkCondition(spec, id);
	const updated = (await db.update(spec.table).set(values).where(cond).returning()) as Row[];
	// 0 ligne matchée = pk introuvable → ne JAMAIS renvoyer un faux succès
	// (l'admin croirait avoir sauvegardé). Le route handler mappe ça en 404.
	if (updated.length === 0) {
		throw new Error(`Ligne introuvable: ${table}#${id}`);
	}
	return updated[0];
}

export async function deleteWiki(table: string, id: string): Promise<void> {
	const spec = getSpec(table);
	if (!spec) throw new Error(`Table inconnue: ${table}`);
	await db.delete(spec.table).where(pkCondition(spec, id));
}

// ── API snake_case (Server Components db-universe) ─────────────────────────

/**
 * Variante snake_case de `listWiki` pour les pages db-universe (qui consomment
 * du snake_case, comme l'ancien `adminFetch` qui passait par `toSnake`).
 */
export async function listWikiSnake(
	table: string,
	{ limit = 500, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<Row[]> {
	const { rows } = await listWiki(table, { limit, offset });
	return rows.map(toSnakeRow);
}

// ── Lectures dédiées db-universe (snake_case, miroir des endpoints publics) ──

/** Épisodes d'une série, triés par numéro (snake_case). */
export async function listEpisodesBySeries(series: string, limit = 500): Promise<Row[]> {
	const t = botSchema.botEpisodes;
	const rows = (await db
		.select()
		.from(t)
		.where(eq(t.series, series))
		.orderBy(asc(t.numberInSeries))
		.limit(limit)) as Row[];
	return rows.map(toSnakeRow);
}

/** Total d'épisodes d'une série (pour l'affichage paginé). */
export async function countEpisodesBySeries(series: string): Promise<number> {
	const t = botSchema.botEpisodes;
	const [{ value = 0 } = { value: 0 }] = await db
		.select({ value: count() })
		.from(t)
		.where(eq(t.series, series));
	return Number(value);
}

/** Sources + jointure licence (license_name, license_url), snake_case. */
export async function listSourcesWithLicense(): Promise<Row[]> {
	const s = botSchema.botSources;
	const l = botSchema.botLicenses;
	const rows = await db
		.select({
			id: s.id,
			name: s.name,
			url: s.url,
			licenseKey: s.licenseKey,
			attributionTemplate: s.attributionTemplate,
			licenseName: l.name,
			licenseUrl: l.url,
		})
		.from(s)
		.leftJoin(l, eq(s.licenseKey, l.key))
		.orderBy(asc(s.id));
	return rows.map((r) => toSnakeRow(r as Row));
}

/** Assets filtrés par préfixe de chemin (bucket), id desc, snake_case. */
export async function listAssetsByBucket(bucket: string, limit = 60): Promise<Row[]> {
	const t = botSchema.botAssets;
	const rows = (await db
		.select({
			id: t.id,
			path: t.path,
			sourceId: t.sourceId,
			attribution: t.attribution,
			licenseKey: t.licenseKey,
			role: t.role,
		})
		.from(t)
		.where(like(t.path, `${bucket}%`))
		.orderBy(desc(t.id))
		.limit(limit)) as Row[];
	return rows.map(toSnakeRow);
}
