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
