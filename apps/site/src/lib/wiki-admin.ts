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
import { and, asc, count, desc, eq, ilike, isNull, like, or, type SQL } from "drizzle-orm";
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
	db_character_arcs: botSchema.botCharacterArcs,
	db_sagas: botSchema.botSagas,
	db_arcs: botSchema.botArcs,
	db_episodes: botSchema.botEpisodes,
	db_manga_volumes: botSchema.botMangaVolumes,
	db_manga_chapters: botSchema.botMangaChapters,
	db_movies: botSchema.botMovies,
	db_games: botSchema.botGames,
	db_game_characters: botSchema.botGameCharacters,
	db_wiki_sections: botSchema.botWikiSections,
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
	// Colonnes booléennes (ex. `visible` des sections) : accepte true/"true"/1/"1".
	if (dt === "boolean") {
		return value === true || value === "true" || value === 1 || value === "1";
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
	{ limit = 50, offset = 0, q }: { limit?: number; offset?: number; q?: string } = {}
): Promise<{ rows: Row[]; total: number; limit: number; offset: number }> {
	const spec = getSpec(table);
	if (!spec) throw new Error(`Table inconnue: ${table}`);
	const lim = Math.min(500, Math.max(1, limit));
	const off = Math.max(0, offset);
	// Recherche sur les colonnes « libellé » présentes (nom FR/JP, titre, slug).
	const labelCols = ["name", "title", "slug", "nameJa", "titleJa"].filter((k) =>
		spec.columns.includes(k)
	);
	const term = (q ?? "").trim();
	// Échappe les métacaractères LIKE (% _ \) → "100%" cherche bien le littéral.
	const safe = term.replace(/[\\%_]/g, (c) => `\\${c}`);
	const where =
		term && labelCols.length
			? or(...labelCols.map((k) => ilike(spec.table[k], `%${safe}%`)))
			: undefined;
	// Ordre déterministe : libellé PUIS pk (tie-break) → pagination stable même
	// quand plusieurs lignes partagent le même libellé.
	const pkCol = spec.table[pkCamelKeys(spec)[0]];
	const orderCol = labelCols[0] ? spec.table[labelCols[0]] : pkCol;
	const rows = (await db
		.select()
		.from(spec.table)
		.where(where)
		.orderBy(asc(orderCol), asc(pkCol))
		.limit(lim)
		.offset(off)) as Row[];
	const [{ value: total = 0 } = { value: 0 }] = await db
		.select({ value: count() })
		.from(spec.table)
		.where(where);
	return { rows, total: Number(total), limit: lim, offset: off };
}

/**
 * Options légères pour un picker de clé étrangère : seulement pk + libellé
 * (name/title/slug), triées, plafond élevé. Évite de rapatrier des lignes
 * complètes (jsonb compris) et la troncature à 500 de `listWiki`.
 */
export async function listWikiOptions(
	table: string
): Promise<{ value: string; label: string }[]> {
	const spec = getSpec(table);
	if (!spec) throw new Error(`Table inconnue: ${table}`);
	const pkKey = pkCamelKeys(spec)[0];
	const labelKey = ["name", "title", "slug"].find((k) => spec.columns.includes(k)) ?? pkKey;
	const rows = (await db
		.select({ value: spec.table[pkKey], label: spec.table[labelKey] })
		.from(spec.table)
		.orderBy(spec.table[labelKey])
		.limit(5000)) as { value: unknown; label: unknown }[];
	return rows.map((r) => ({ value: String(r.value), label: String(r.label ?? r.value) }));
}

/**
 * Relations N-N : ids liés dans une table de jointure. Ex. techniques d'un
 * personnage → `listWikiRelations("db_character_techniques", "characterId", "5",
 * "techniqueId")`. Colonnes validées contre le schéma (anti-injection).
 */
export async function listWikiRelations(
	table: string,
	col: string,
	id: string,
	target: string
): Promise<string[]> {
	const spec = getSpec(table);
	if (!spec) throw new Error(`Table inconnue: ${table}`);
	if (!spec.columns.includes(col) || !spec.columns.includes(target)) {
		throw new Error(`Colonne inconnue sur ${table}`);
	}
	const rows = (await db
		.select({ v: spec.table[target] })
		.from(spec.table)
		.where(eq(spec.table[col], coerceValue(spec, col, id) as never))) as { v: unknown }[];
	return rows.map((r) => String(r.v));
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
	// Tables de jointure (pk composite) : lier est idempotent → un re-lien d'une
	// paire existante est un no-op au lieu d'une erreur unique_violation brute.
	const isJoin = Array.isArray(spec.pk);
	const q = db.insert(spec.table).values(values as never);
	const inserted = (await (isJoin ? q.onConflictDoNothing() : q).returning()) as Row[];
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

// ── Visibilité éditoriale (colonne PG-only `visible`) ──────────────────────

/**
 * Tables « parcourables » du wiki portant la colonne `visible` (masquage du site
 * public sans suppression). Doit rester synchronisé avec `visibleCol` dans
 * `bot-schema.ts` et `scripts/add-wiki-visibility.ts`.
 */
export const VISIBILITY_TABLES = new Set<string>([
	"db_characters",
	"db_planets",
	"db_transformations",
	"db_races",
	"db_techniques",
	"db_sagas",
	"db_arcs",
	"db_episodes",
	"db_movies",
	"db_games",
	"db_manga_volumes",
	"db_manga_chapters",
]);

export function hasVisibility(table: string): boolean {
	return VISIBILITY_TABLES.has(table);
}

export interface VisibilityRow {
	id: string;
	label: string;
	image: string | null;
	/** Contexte secondaire (série, type…) pour désambiguïser. */
	extra: string | null;
	visible: boolean;
}

function ensureVisibility(table: string): ResolvedTable {
	const spec = getSpec(table);
	if (!spec) throw new Error(`Table inconnue: ${table}`);
	if (!VISIBILITY_TABLES.has(table)) throw new Error(`Table sans visibilité: ${table}`);
	return spec;
}

/** Liste id + libellé + image + état `visible` de toutes les lignes (pour le manager). */
export async function listWikiVisibility(
	table: string,
	{ q }: { q?: string } = {}
): Promise<VisibilityRow[]> {
	const spec = ensureVisibility(table);
	const pkKey = pkCamelKeys(spec)[0];
	const labelKey = ["name", "title"].find((k) => spec.columns.includes(k)) ?? pkKey;
	const imageKey = ["image", "cover", "poster"].find((k) => spec.columns.includes(k)) ?? null;
	const extraKey = ["series", "type"].find((k) => spec.columns.includes(k)) ?? null;

	const sel: Record<string, unknown> = {
		id: spec.table[pkKey],
		label: spec.table[labelKey],
		visible: spec.table.visible,
	};
	if (imageKey) sel.image = spec.table[imageKey];
	if (extraKey) sel.extra = spec.table[extraKey];

	const term = (q ?? "").trim();
	const safeTerm = term.replace(/[\\%_]/g, (c) => `\\${c}`);
	const where = term ? ilike(spec.table[labelKey], `%${safeTerm}%`) : undefined;

	const rows = (await db
		.select(sel as never)
		.from(spec.table)
		.where(where)
		.orderBy(asc(spec.table[labelKey]), asc(spec.table[pkKey]))
		.limit(5000)) as Array<{
		id: unknown;
		label: unknown;
		visible: unknown;
		image?: unknown;
		extra?: unknown;
	}>;
	return rows.map((r) => ({
		id: String(r.id),
		label: String(r.label ?? r.id),
		image: r.image != null ? String(r.image) : null,
		extra: r.extra != null ? String(r.extra) : null,
		// Défaut true : null/undefined (théorique) = visible.
		visible: r.visible !== false,
	}));
}

/** Bascule la visibilité d'une ligne. Lève si la pk est introuvable. */
export async function setWikiVisibility(
	table: string,
	id: string,
	visible: boolean
): Promise<void> {
	const spec = ensureVisibility(table);
	const updated = (await db
		.update(spec.table)
		.set({ visible })
		.where(pkCondition(spec, id))
		.returning()) as Row[];
	if (updated.length === 0) throw new Error(`Ligne introuvable: ${table}#${id}`);
}

/** Bascule TOUTES les lignes d'une table (« tout afficher / tout masquer »). Renvoie le nombre modifié. */
export async function setAllWikiVisibility(table: string, visible: boolean): Promise<number> {
	const spec = ensureVisibility(table);
	const updated = (await db
		.update(spec.table)
		.set({ visible })
		.returning({ id: spec.table[pkCamelKeys(spec)[0]] })) as Row[];
	return updated.length;
}

// ── Vue d'ensemble CMS : complétude du contenu par entité ──────────────────

/** Entités « contenu » suivies dans le tableau de bord CMS (/admin/wiki). */
export const CMS_ENTITY_TABLES = [
	"db_characters",
	"db_planets",
	"db_transformations",
	"db_races",
	"db_techniques",
	"db_sagas",
	"db_arcs",
	"db_episodes",
	"db_movies",
	"db_games",
	"db_manga_volumes",
] as const;

export interface CmsEntityStat {
	table: string;
	total: number;
	/** Lignes masquées du site public (visible = false). 0 si pas de colonne. */
	hidden: number;
	/** Lignes sans image/cover/poster. */
	missingImage: number;
	/** Lignes sans description/synopsis. */
	missingDesc: number;
	imageCol: string | null;
	descCol: string | null;
	hasVisibility: boolean;
}

/** Compte les lignes d'une table dont la colonne texte est NULL ou vide. */
async function countEmpty(spec: ResolvedTable, col: string): Promise<number> {
	const [{ value = 0 } = { value: 0 }] = await db
		.select({ value: count() })
		.from(spec.table)
		.where(or(isNull(spec.table[col]), eq(spec.table[col], "")));
	return Number(value);
}

/** Statistiques de complétude d'une entité (total, masquées, sans image/texte). */
async function tableStat(table: string): Promise<CmsEntityStat> {
	const spec = getSpec(table);
	if (!spec) return {
		table, total: 0, hidden: 0, missingImage: 0, missingDesc: 0,
		imageCol: null, descCol: null, hasVisibility: false,
	};
	const cols = spec.columns;
	const imageCol = ["image", "cover", "poster"].find((c) => cols.includes(c)) ?? null;
	const descCol = ["description", "synopsis"].find((c) => cols.includes(c)) ?? null;
	const hasVis = cols.includes("visible");
	const [total, hidden, missingImage, missingDesc] = await Promise.all([
		db.select({ value: count() }).from(spec.table).then((r) => Number(r[0]?.value ?? 0)),
		hasVis
			? db
					.select({ value: count() })
					.from(spec.table)
					.where(eq(spec.table.visible, false))
					.then((r) => Number(r[0]?.value ?? 0))
			: Promise.resolve(0),
		imageCol ? countEmpty(spec, imageCol) : Promise.resolve(0),
		descCol ? countEmpty(spec, descCol) : Promise.resolve(0),
	]);
	return {
		table,
		total,
		hidden,
		missingImage,
		missingDesc,
		imageCol,
		descCol,
		hasVisibility: hasVis,
	};
}

/**
 * Vue d'ensemble CMS : complétude de chaque entité « contenu » (comptes réels
 * Postgres). Alimente le tableau de bord /admin/wiki (cartes de complétude,
 * signaux de contenu manquant). Requêtes parallèles indexées.
 */
export async function getWikiCmsStats(): Promise<CmsEntityStat[]> {
	return Promise.all(CMS_ENTITY_TABLES.map((t) => tableStat(t)));
}

// ── Sections de contenu par entité (bot.db_wiki_sections) ──────────────────

export interface WikiSectionRow {
	id: number;
	entityType: string;
	entityId: number;
	key: string;
	label: string;
	accent: string | null;
	body: string | null;
	sortOrder: number;
	visible: boolean;
}

/**
 * Sections d'une entité pour l'ADMIN : toutes (masquées comprises), triées par
 * `sort_order` puis `id`. La lecture publique (`getWikiSections` de shenron.ts)
 * filtre en plus `visible = true`.
 */
export async function listWikiSectionsForEntity(
	entityType: string,
	entityId: number
): Promise<WikiSectionRow[]> {
	const t = botSchema.botWikiSections;
	const rows = (await db
		.select()
		.from(t)
		.where(and(eq(t.entityType, entityType), eq(t.entityId, entityId)))
		.orderBy(asc(t.sortOrder), asc(t.id))) as WikiSectionRow[];
	return rows.map((r) => ({
		id: Number(r.id),
		entityType: r.entityType,
		entityId: Number(r.entityId),
		key: r.key,
		label: r.label,
		accent: r.accent ?? null,
		body: r.body ?? null,
		sortOrder: Number(r.sortOrder ?? 0),
		visible: r.visible !== false,
	}));
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
