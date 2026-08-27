// SPDX-License-Identifier: Apache-2.0

/**
 * Ciblage d'une planche de databook — **client-safe** (aucun accès DB).
 *
 * Les transcriptions vivent dans un `jsonb` par ouvrage
 * (`bot.db_databooks.pages`), pas dans une colonne : le modèle de contribution
 * du wiki, qui vise un couple (table, ligne, colonne), ne savait donc pas
 * désigner UNE planche — et les 1 911 planches hallucinées restaient hors
 * d'atteinte des contributeurs. La convention `pages#<numéro>` comble ce trou.
 *
 * Ces fonctions vivent à part de `databook-pages.ts` (server-only, accès DB)
 * parce que la modale de contribution en a besoin côté client : sans ce module
 * partagé, la même règle serait réécrite à la main des deux côtés — et les deux
 * finiraient par diverger.
 */

/** Préfixe de colonne des planches. */
export const PREFIXE_PLANCHE = "pages#";

/** `pages#42` → 42. `null` si ce n'est pas une cible de planche. */
export function numeroDePlanche(column: string): number | null {
	if (!column.startsWith(PREFIXE_PLANCHE)) return null;
	const brut = column.slice(PREFIXE_PLANCHE.length);
	// `Number("")` vaut 0 et `Number(" 4 ")` vaut 4 : sans ce garde-fou, `pages#`
	// et `pages# 4 ` passeraient pour des cibles valides.
	if (!/^\d+$/.test(brut)) return null;
	const n = Number(brut);
	return n > 0 ? n : null;
}

/** Cette cible désigne-t-elle une transcription de planche ? */
export function estCiblePlanche(table: string, column: string): boolean {
	return table === "db_databooks" && numeroDePlanche(column) !== null;
}

/** Libellé et consigne du champ, pour la modale comme pour la page dédiée. */
export function champPlanche(numero: number): { label: string; hint: string; long: boolean } {
	return {
		label: `Transcription de la planche ${numero}`,
		hint: "Le texte japonais tel qu'il est imprimé sur le scan. Ne complétez jamais ce que l'image ne montre pas : une transcription partielle vaut mieux qu'une lecture plausible mais inventée.",
		long: true,
	};
}
