/**
 * Helpers **client-safe** pour l'édition des entités wiki (`db_*`) : détection du
 * rôle d'une colonne (image / texte long / booléen), sous-dossier d'upload, URL
 * de la page publique, et éligibilité au studio d'édition visuelle.
 *
 * Aucune dépendance server-only — importé par l'éditeur DB, le studio wiki et la
 * vignette de grille (tous Client Components).
 */

/** Colonnes dont la valeur est une image (vignette + champ d'upload). */
export const IMAGE_COL_RE =
	/image|cover|poster|photo|avatar|icon|banner|thumb|sprite|portrait|logo|artwork/i;

export function isImageColumn(table: string, col: string): boolean {
	if (table === "db_assets" && col === "path") return true;
	return IMAGE_COL_RE.test(col);
}

/** Sous-dossier wiki d'upload déduit de la table (`db_characters` → `characters`). */
export function uploadSubdir(table: string): string {
	const base = table.replace(/^db_/, "").replace(/_/g, "-");
	return /^[a-z0-9-]{1,32}$/.test(base) ? base : "uploads";
}

/** Colonnes au contenu long → rendu en <textarea> (markdown). */
export function isLongTextColumn(col: string): boolean {
	return /desc|synops|^body$|summary|bio|overview|attribution|content/i.test(col);
}

/** Colonnes booléennes connues → rendu en interrupteur. */
const BOOL_COLS = new Set([
	"isDestroyed",
	"enabled",
	"active",
	"ended",
	"isNotable",
	"requiresAttribution",
	"shareAlike",
]);
export function isBoolColumn(col: string): boolean {
	return BOOL_COLS.has(col);
}

/** Colonnes date stockées en epoch (sec ou ms) → rendu en sélecteur de date. */
const DATE_COLS = new Set(["airDate", "releaseDate", "publishedAt"]);
export function isDateColumn(col: string): boolean {
	return DATE_COLS.has(col);
}

/**
 * Colonnes clé étrangère → table cible (pour un picker « choisir par nom »
 * plutôt que taper l'id brut). Mappé par nom de colonne (stable cross-table).
 */
const FK_TARGET: Record<string, { table: string; pk: string }> = {
	originPlanetId: { table: "db_planets", pk: "id" },
	homePlanetId: { table: "db_planets", pk: "id" },
	characterId: { table: "db_characters", pk: "id" },
	creatorId: { table: "db_characters", pk: "id" },
	sagaId: { table: "db_sagas", pk: "id" },
	arcId: { table: "db_arcs", pk: "id" },
	raceId: { table: "db_races", pk: "id" },
	volumeId: { table: "db_manga_volumes", pk: "id" },
	debutEpisodeId: { table: "db_episodes", pk: "id" },
	debutChapterId: { table: "db_manga_chapters", pk: "id" },
	targetGameId: { table: "db_games", pk: "id" },
	techniqueId: { table: "db_techniques", pk: "id" },
	gameId: { table: "db_games", pk: "id" },
	sourceId: { table: "db_sources", pk: "id" },
	licenseKey: { table: "db_licenses", pk: "key" },
};
export function fkTarget(col: string): { table: string; pk: string } | null {
	return FK_TARGET[col] ?? null;
}

/**
 * Valeurs possibles d'une colonne « enum » (text en base). `strict` → `<select>`
 * fermé ; sinon `<input list>` (suggestions + saisie libre, car de nouvelles
 * valeurs peuvent apparaître). Valeurs réelles relevées dans Neon.
 */
export const ENUM_OPTIONS: Record<string, { options: string[]; strict?: boolean }> = {
	"db_characters.gender": { options: ["Male", "Female"], strict: true },
	"db_techniques.type": { options: ["super", "ultimate", "evasive", "awoken"], strict: true },
	"shop_items.type": { options: ["card", "badge", "color", "title", "banner"], strict: true },
	"db_tools.category": { options: ["api", "modding", "shader", "utility"] },
	"db_episodes.series": { options: ["DB", "DBZ", "DBGT", "DBS", "DB_DAIMA"] },
	"db_arcs.series": { options: ["DB", "DBZ", "DBGT", "DBS", "DB_DAIMA"] },
	"db_sagas.series": {
		options: ["DB", "DBZ", "DBGT", "DBS", "DBS_MANGA", "DBS_MOVIE", "DB_DAIMA"],
	},
	"db_movies.series": {
		options: ["DB_MOVIE", "DBZ_MOVIE", "DBS_MOVIE", "DBZ_OVA", "DBZ_SPECIAL"],
	},
	"db_manga_volumes.series": { options: ["DB", "DBS"] },
	"db_manga_chapters.series": { options: ["DB", "DBS"] },
};
export function enumOptionsFor(table: string, col: string): { options: string[]; strict?: boolean } | null {
	return ENUM_OPTIONS[`${table}.${col}`] ?? null;
}

/**
 * Construit le body d'écriture (coercition de types unifiée pour TOUS les
 * éditeurs : studio, éditeur générique, db-universe). Règles :
 *   - jsonb (valeur d'origine objet) → JAMAIS réécrit (l'édition jsonb structurée
 *     n'est pas supportée ici → on évite de corrompre la colonne) ;
 *   - vide en édition d'un champ qui avait une valeur → "" (effacement explicite ;
 *     le serveur coerce "" → NULL). Vide ailleurs → omis (inchangé) ;
 *   - booléens → coercés ("true"/"1") ;
 *   - colonnes numériques connues (édition) → Number (NaN → omis, pas d'écrasement) ;
 *   - sinon → string : le serveur wiki (`coerceValue`) est schema-aware et SQLite
 *     applique l'affinité de type → pas de cast client qui corromprait un texte
 *     tout-chiffres (ISBN, snowflake Discord 18-19 chiffres > 2^53, etc.).
 */
export function buildSubmitBody(
	draft: Record<string, string>,
	original: Record<string, unknown> | null,
	cols: string[],
	opts: { mode: "create" | "edit" }
): Record<string, unknown> {
	const body: Record<string, unknown> = {};
	for (const c of cols) {
		const o = original?.[c];
		// jsonb : non éditable ici → ne jamais écrire (sinon corruption en string scalaire).
		if (o !== null && typeof o === "object") continue;
		const v = draft[c] ?? "";
		if (v === "") {
			// Effacement explicite : le champ avait une valeur, vidé en édition → NULL.
			if (opts.mode === "edit" && o != null && String(o) !== "") body[c] = "";
			continue;
		}
		if (isBoolColumn(c) || typeof o === "boolean") body[c] = v === "true" || v === "1";
		else if (typeof o === "number") {
			const n = Number(v);
			if (!Number.isNaN(n)) body[c] = n;
		} else body[c] = v;
	}
	return body;
}

/**
 * Tables wiki « contenu » éligibles au studio d'édition visuelle (pk simple,
 * page publique). Exclut les tables utilitaires (sources/licences/assets) et les
 * tables de jointure à pk composite.
 */
export const STUDIO_TABLES = new Set([
	"db_characters",
	"db_planets",
	"db_transformations",
	"db_sagas",
	"db_arcs",
	"db_races",
	"db_techniques",
	"db_episodes",
	"db_manga_volumes",
	"db_manga_chapters",
	"db_movies",
	"db_games",
	"db_tools",
]);
export function isStudioTable(table: string): boolean {
	return STUDIO_TABLES.has(table);
}

/**
 * Relations N-N éditables depuis le studio d'une entité (gérées via une table de
 * jointure). `selfCol`/`targetCol` = clés camelCase dans la jointure ; `pkOrder` =
 * colonnes pk de la jointure DANS L'ORDRE (pour construire l'id composite DELETE).
 */
export interface RelationSpec {
	label: string;
	joinTable: string;
	selfCol: string;
	targetCol: string;
	targetTable: string;
	pkOrder: [string, string];
}
export const ENTITY_RELATIONS: Record<string, RelationSpec[]> = {
	db_characters: [
		{
			label: "Techniques",
			joinTable: "db_character_techniques",
			selfCol: "characterId",
			targetCol: "techniqueId",
			targetTable: "db_techniques",
			pkOrder: ["characterId", "techniqueId"],
		},
		{
			label: "Jeux",
			joinTable: "db_game_characters",
			selfCol: "characterId",
			targetCol: "gameId",
			targetTable: "db_games",
			pkOrder: ["gameId", "characterId"],
		},
	],
	db_techniques: [
		{
			label: "Personnages",
			joinTable: "db_character_techniques",
			selfCol: "techniqueId",
			targetCol: "characterId",
			targetTable: "db_characters",
			pkOrder: ["characterId", "techniqueId"],
		},
	],
	db_games: [
		{
			label: "Personnages",
			joinTable: "db_game_characters",
			selfCol: "gameId",
			targetCol: "characterId",
			targetTable: "db_characters",
			pkOrder: ["gameId", "characterId"],
		},
	],
};
export function entityRelations(table: string): RelationSpec[] {
	return ENTITY_RELATIONS[table] ?? [];
}

/** Première colonne présente parmi `cands` (ordre = priorité). */
function pick(cols: string[], cands: string[]): string | undefined {
	return cands.find((c) => cols.includes(c));
}

/** Rôles d'affichage pour la vignette/preview, déduits des colonnes présentes. */
export function fieldRoles(cols: string[]): {
	image?: string;
	title?: string;
	titleJa?: string;
	titleRomaji?: string;
	description?: string;
} {
	return {
		image: pick(cols, ["image", "cover", "poster", "path"]),
		title: pick(cols, ["name", "title"]),
		titleJa: pick(cols, ["nameJa", "titleJa"]),
		titleRomaji: pick(cols, ["nameRomaji", "titleRomaji"]),
		description: pick(cols, ["description", "synopsis", "body", "overview"]),
	};
}

/**
 * URL de la page publique d'une entité (best-effort ; null si inconnue ou si la
 * clé requise — id/slug — n'est pas encore renseignée).
 */
export function publicEntityUrl(table: string, row: Record<string, unknown>): string | null {
	const id = row.id;
	const slug = typeof row.slug === "string" && row.slug ? row.slug : null;
	const hasId = id != null && id !== "";
	switch (table) {
		case "db_characters":
			return hasId ? `/wiki/dragon-ball/character/${id}` : null;
		case "db_planets":
			return hasId ? `/wiki/dragon-ball/planet/${id}` : null;
		case "db_techniques":
			return slug ? `/wiki/dragon-ball/techniques/${slug}` : null;
		case "db_games":
			return slug ? `/wiki/dragon-ball/games/${slug}` : null;
		case "db_sagas":
			return slug ? `/wiki/sagas/${slug}` : null;
		case "db_arcs":
			return slug ? `/wiki/arcs/${slug}` : null;
		case "db_races":
			return slug ? `/wiki/races/${slug}` : null;
		case "db_movies":
			return slug ? `/wiki/films/${slug}` : null;
		case "db_manga_volumes":
			return hasId ? `/wiki/manga/volume/${id}` : null;
		case "db_episodes":
			return hasId ? `/wiki/episodes/${id}` : null;
		default:
			return null;
	}
}
