/**
 * Politique d'optimisation des images (client-safe).
 *
 * Le site servait **toutes** ses images en JPEG brut : `unoptimized: true` était
 * posé globalement dans `next.config.ts`. La raison était réelle — sur Vercel,
 * l'optimiseur figeait une image par URL source, si bien qu'un remplacement
 * depuis l'admin du wiki n'apparaissait jamais. Mais elle ne vaut plus : le site
 * est auto-hébergé depuis le 2026-06-12, et l'optimiseur local respecte le
 * `Cache-Control` de la source.
 *
 * Le coût de ce choix était lourd : une vignette d'épisode de 780×585 pèse
 * ~60 Kio en JPEG et ~15 Kio en AVIF à la largeur réellement rendue — **−73 %**
 * mesuré sur un échantillon. Une page de liste en affiche jusqu'à 85.
 *
 * On ne rétablit donc pas le problème d'origine : les seules images vraiment
 * modifiables en place sont les téléversements de l'admin (`assets/wiki/**`,
 * cf. `lib/assets.ts`). Celles-là restent NON optimisées, donc immédiatement
 * fraîches après un remplacement. Tout le reste — imports figés (`assets/ext/**`)
 * et médias immuables du bot (`/db/**`, `Cache-Control: immutable`) — passe par
 * l'optimiseur.
 */

/** Préfixe des images téléversées depuis l'admin, remplaçables au même chemin. */
const PREFIXE_EDITABLE = "assets/wiki/";

/**
 * L'image peut-elle être remplacée en place depuis l'admin ?
 *
 * Accepte aussi bien un chemin DB (`assets/wiki/x.png`, `./assets/wiki/x.png`)
 * qu'une URL absolue servie par le bot.
 */
export function isEditableAsset(src: string | null | undefined): boolean {
	if (!src) return false;
	return src.includes(PREFIXE_EDITABLE);
}
