import "server-only";

/**
 * Japonais — point d'entrée.
 *
 * Trois usages, tous adossés aux mêmes ressources :
 *   - **relire** : signaler les fautes de lecture d'une transcription ;
 *   - **lire** : poser un furigana sur les kanji ;
 *   - **chercher** : découper une requête japonaise en mots réels.
 */
export {
	besoinFurigana,
	contientJaponais,
	katakanaVersHiragana,
	normaliserJa,
	proportionJaponais,
} from "./normalisation";
export {
	distanceBornee,
	indexerLexique,
	retenirParFrequence,
	suggerer,
	trierLexique,
	type IndexLexique,
	type Suggestion,
	type TermeLexique,
} from "./anomalies";
export { lexiqueDomaine, oublierLexique } from "./lexique";
export { analyseur, graphiesJmdict, segmenter, type Token } from "./dictionnaire";

import { graphiesJmdict, segmenter } from "./dictionnaire";
import { indexerLexique, retenirParFrequence, suggerer, type Suggestion } from "./anomalies";
import { lexiqueDomaine } from "./lexique";
import { besoinFurigana, contientJaponais, katakanaVersHiragana, normaliserJa } from "./normalisation";

/**
 * Fautes de lecture probables dans un texte transcrit.
 *
 * `corpusDeReference` sert à départager : une correction n'est proposée que si
 * la forme correcte y apparaît plus souvent que la graphie suspecte. Sans ce
 * garde-fou, le détecteur invente des corrections vers des termes que personne
 * n'a jamais écrits. Passer le texte lui-même reste possible, mais un corpus
 * large (l'ouvrage entier, voire tous les databooks) donne un bien meilleur
 * arbitrage — une faute est rare, une graphie juste est répétée.
 */
export async function anomaliesJaponais(
	texte: string,
	corpusDeReference?: string
): Promise<Suggestion[]> {
	if (!contientJaponais(texte)) return [];

	const [tokens, jmdict, lex] = await Promise.all([
		segmenter(texte),
		graphiesJmdict(),
		lexiqueDomaine(),
	]);
	if (tokens.length === 0) return [];

	const index = indexerLexique(lex);
	const reference = normaliserJa(corpusDeReference ?? texte);
	const cache = new Map<string, number>();
	const occurrences = (graphie: string): number => {
		const cle = normaliserJa(graphie);
		const vu = cache.get(cle);
		if (vu !== undefined) return vu;
		const n = cle ? reference.split(cle).length - 1 : 0;
		cache.set(cle, n);
		return n;
	};

	const vues = new Set<string>();
	const out: Suggestion[] = [];
	for (const t of tokens) {
		if (!t.inconnu || !contientJaponais(t.surface)) continue;
		if (vues.has(t.surface)) continue;
		vues.add(t.surface);
		// JMdict absout les mots japonais réels qu'IPADIC ignore (emprunts).
		if (jmdict.has(t.surface)) continue;
		const s = suggerer(t.surface, lex, index, occurrences);
		if (s && retenirParFrequence(s, occurrences)) out.push(s);
	}
	return out;
}

export interface MotFurigana {
	surface: string;
	/** Lecture en hiragana, ou `null` si le mot n'en demande pas. */
	furigana: string | null;
}

/**
 * Découpe un texte en mots, avec leur lecture quand elle est utile.
 *
 * Seuls les mots portant un kanji reçoivent une lecture : annoter ce qui est
 * déjà en kana n'apprend rien et alourdit l'affichage.
 */
export async function avecFurigana(texte: string): Promise<MotFurigana[]> {
	const tokens = await segmenter(texte);
	return tokens.map((t) => ({
		surface: t.surface,
		furigana: besoinFurigana(t.surface, t.lecture) ? katakanaVersHiragana(t.lecture!) : null,
	}));
}

/**
 * Mots d'une requête japonaise, pour la recherche.
 *
 * Le japonais ne sépare pas ses mots : une requête « 孫悟空の界王拳 » est une
 * seule chaîne, dont l'index trigramme ne sait rien faire de mieux qu'une
 * sous-chaîne littérale. La découper en mots réels permet de chercher chacun.
 * Les particules et les signes de ponctuation sont écartés — ils apparient
 * partout et ne discriminent rien.
 */
export async function motsDeRequete(requete: string): Promise<string[]> {
	const tokens = await segmenter(requete);
	const ignores = new Set(["助詞", "助動詞", "記号", "フィラー"]);
	return tokens
		.filter((t) => !ignores.has(t.pos) && t.surface.trim().length > 1)
		.map((t) => t.surface);
}
