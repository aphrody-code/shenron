/**
 * Rendu d'une transcription de planche.
 *
 * Le texte des planches est du **markdown** : produit par un modèle de vision
 * lisant des scans, il structure ce qu'il voit en titres et en listes — 1 357
 * planches commencent par un `#`. Il était pourtant affiché en
 * `whitespace-pre-wrap`, donc les dièses et les astérisques s'affichaient tels
 * quels au lecteur.
 *
 * Volontairement plus restreint que `WikiMarkdown` : celui-ci active
 * `rehype-raw` pour laisser l'admin écrire du HTML de mise en page, ce qui
 * impose une passe de sanitisation. Une transcription ne contient jamais de
 * HTML — n'activant pas `rehype-raw`, react-markdown échappe tout balisage brut,
 * et il n'y a plus rien à assainir.
 *
 * Isomorphe (pas de `"use client"`) : sert au rendu public comme à l'aperçu du
 * relecteur admin, pour que les deux montrent exactement la même chose.
 */
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

/** Hiragana, katakana, idéogrammes CJK, ponctuation japonaise. */
const CJK = /[　-〿぀-ゟ゠-ヿ㐀-䶿一-鿿＀-ﾟ]/;

/**
 * `lang` de la transcription, ou `undefined` si le texte est latin.
 *
 * Le corpus est majoritairement japonais, mais pas exclusivement (crédits,
 * titres occidentaux, quelques ouvrages traduits). Annoncer `ja` sur tout
 * serait faux là où ça compte : un lecteur d'écran ânonnerait du français avec
 * une voix japonaise. On ne le pose que si le texte contient réellement du CJK.
 */
function langue(texte: string): "ja" | undefined {
	return CJK.test(texte) ? "ja" : undefined;
}

export function TranscriptionTexte({ texte }: { texte: string }) {
	return (
		<div
			className="prose-transcription text-sm leading-relaxed text-white/85"
			lang={langue(texte)}
		>
			<ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{texte}</ReactMarkdown>
		</div>
	);
}
