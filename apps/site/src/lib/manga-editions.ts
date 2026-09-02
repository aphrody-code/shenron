/**
 * manga-editions.ts — Ce qui distingue une édition de manga d'une autre.
 *
 * Client-safe (aucun accès base, aucun `server-only`) : la grille de l'index,
 * la fiche tome et le lecteur s'en servent tous les trois, et deux d'entre eux
 * sont des composants client.
 *
 * L'édition ne se devinait jusqu'ici qu'au TITRE (`/full\s*color|couleur/i`,
 * connu de la seule grille de l'index) : le lecteur, la fiche tome, les
 * métadonnées et la navigation précédent/suivant l'ignoraient complètement. Un
 * titre est un support fragile pour une décision structurelle — il suffit qu'un
 * chapitre s'appelle « Les couleurs de Boo » pour basculer d'édition.
 *
 * La source de vérité est donc désormais la SÉRIE. Les chapitres couleur issus
 * du forum scan-db sont ingérés sous `DBFC`, ce qui règle du même coup un piège
 * que la détection par titre ne pouvait pas traiter : `dbUniverse.mangaChapter`
 * calcule le précédent/suivant sur `(series, chapter_number)`, donc des
 * chapitres couleur rangés sous `DB` se seraient intercalés dans la navigation
 * des tomes noir et blanc.
 *
 * La détection par titre est conservée en repli pour les quelques chapitres
 * couleur antérieurs, rangés sous `DB`.
 */

/** La série réservée à l'édition Full Color (forum scan-db, 520 chapitres). */
export const SERIE_COULEUR = "DBFC";

/** Repli historique : l'édition se lisait dans le titre du chapitre. */
const TITRE_COULEUR = /full\s*color|couleur/i;

/** Le minimum qu'il faut connaître d'un chapitre pour trancher son édition. */
export interface ChapitreEdition {
	readonly series: string;
	readonly title?: string | null;
}

/** Vrai si le chapitre relève de l'édition couleur. */
export function estChapitreCouleur(chapitre: ChapitreEdition): boolean {
	return chapitre.series === SERIE_COULEUR || TITRE_COULEUR.test(chapitre.title ?? "");
}

/** L'édition d'un chapitre, sous une forme utilisable en clé de regroupement. */
export type Edition = "couleur" | "nb";

export function editionDe(chapitre: ChapitreEdition): Edition {
	return estChapitreCouleur(chapitre) ? "couleur" : "nb";
}

/** Libellés d'édition, pour les sélecteurs et les intitulés. */
export const LIBELLE_EDITION: Record<Edition, string> = {
	nb: "Noir & blanc",
	couleur: "Couleur",
};

/**
 * La série « d'œuvre » d'un chapitre, éditions confondues.
 *
 * `DBFC` reste du Dragon Ball : partout où l'on raisonne en œuvre (libellé,
 * JSON-LD, fil d'Ariane) et non en édition, c'est cette valeur qu'il faut.
 */
export function serieOeuvre(series: string): string {
	return series === SERIE_COULEUR ? "DB" : series;
}

/** Libellé lisible d'une série, éditions comprises. */
export const LIBELLE_SERIE: Record<string, string> = {
	DB: "Dragon Ball",
	DBS: "Dragon Ball Super",
	DBZ: "Dragon Ball Z",
	[SERIE_COULEUR]: "Dragon Ball Full Color",
};

export function libelleSerie(series: string): string {
	return LIBELLE_SERIE[series] ?? series;
}
