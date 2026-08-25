// SPDX-License-Identifier: Apache-2.0

/**
 * Transcriptions de databooks — **classement des défauts** (module pur).
 *
 * Sert de juge commun à tout ce qui touche la qualité d'une transcription :
 * la file de relecture (`scripts/planches-a-relire.ts`) et la reprise des lots
 * OCR d'origine (`scripts/meilleure-source-ocr.ts`) doivent noter un texte
 * EXACTEMENT de la même façon, sinon l'une redéposerait ce que l'autre vient de
 * signaler comme fautif.
 *
 * Le classement ne corrige rien et ne devine rien : il constate des signatures
 * mécaniques d'échec du modèle d'OCR, observées sur le corpus réel (11 778
 * planches, dont 2 223 fautives au 2026-08-25) :
 *
 *   - un alphabet sans rapport (cyrillique, arabe, thaï, coréen) au milieu du
 *     japonais n'est jamais une lecture, c'est une hallucination ;
 *   - des idéogrammes sans un seul kana sur une page japonaise = du chinois
 *     inventé (une page de databook a toujours des kana) ;
 *   - un segment répété en rafale = le modèle a bouclé jusqu'à sa limite ;
 *   - « � » = sortie coupée en plein caractère UTF-8.
 *
 * Aucune de ces signatures ne dépend de la langue du contenu attendu : une page
 * réellement anglaise (crédits, ISBN) ne déclenche rien.
 */

/** Défauts, du plus certain au plus discutable. */
export type Defaut =
	| "remplacement"
	| "etranger"
	| "han-sans-kana"
	| "boucle"
	| "courte"
	| "vide";

const ETRANGER = /[Ѐ-ӿ؀-ۿ฀-๿가-힯]/;
const KANA = /[぀-ヿ]/;
const HAN = /[一-鿿]/;
/** Segment de 4 à 40 signes répété au moins trois fois d'affilée. */
const BOUCLE = /(.{4,40}?)\1{2,}/s;

/** Longueur en dessous de laquelle une planche transcrite est jugée avortée. */
export const SEUIL_COURT = 15;

/** Le défaut d'un texte, ou `null` s'il ne porte aucune signature d'échec. */
export function classerDefaut(texte: string): Defaut | null {
	if (texte === "") return "vide";
	if (texte.includes("�")) return "remplacement";
	if (ETRANGER.test(texte)) return "etranger";
	if (HAN.test(texte) && !KANA.test(texte)) return "han-sans-kana";
	if (BOUCLE.test(texte)) return "boucle";
	if (texte.length < SEUIL_COURT) return "courte";
	return null;
}

/**
 * Note de qualité, pour départager deux transcriptions de la MÊME planche
 * (base contre lot d'origine). Plus c'est haut, mieux c'est.
 *
 * Un texte sans défaut bat tout texte fautif ; à défaut égal, le plus long
 * gagne — sur ce corpus, une sortie plus courte que sa rivale est presque
 * toujours une sortie qui a abandonné en route.
 */
export function noteQualite(texte: string): number {
	const defaut = classerDefaut(texte);
	const rang: Record<Defaut, number> = {
		vide: 0,
		remplacement: 1,
		boucle: 1,
		"han-sans-kana": 2,
		etranger: 2,
		courte: 3,
	};
	const base = defaut === null ? 10 : rang[defaut];
	// La longueur ne départage qu'à l'intérieur d'un même rang (facteur borné).
	return base * 1_000_000 + Math.min(texte.length, 999_999);
}

/** Nombre de signes fautifs — sert à trier « le pire d'abord » dans la file. */
export function gravite(texte: string, defaut: Defaut): number {
	if (defaut === "remplacement") return (texte.match(/�/g) ?? []).length;
	if (defaut === "etranger")
		return (texte.match(/[Ѐ-ӿ؀-ۿ฀-๿가-힯]/g) ?? []).length;
	return 1;
}
