/**
 * Japonais — protection du vocabulaire du domaine avant traduction. Règles pures.
 *
 * Mesuré avec NLLB-200 en local : la grammaire japonaise est correctement
 * rendue, **le vocabulaire de la série est massacré**. `孫悟空は界王拳を使った`
 * devient « Son-gu a utilisé le poing du roi » : le modèle translittère les noms
 * propres au son et traduit les techniques littéralement, parce qu'il ne les a
 * jamais vus. `ベジータ` ressort en « Végitta », `フリーザ` en « Frézza ».
 *
 * Or la forme française de ces termes, nous l'avons — dans la même ligne de base
 * que leur graphie japonaise. On masque donc chaque terme connu par un jeton
 * avant de traduire, puis on réinjecte la forme officielle. Le modèle ne traduit
 * plus que ce qu'il sait traduire : la phrase autour.
 *
 * Résultat sur les mêmes phrases : « **Son Goku** a utilisé… », « **Vegeta** est
 * le prince des **Saiyans** », « **Piccolo** et **Krilin** protègent la Terre ».
 *
 * Ce module ne charge aucun modèle : il prépare le texte et recompose la
 * sortie. L'inférence vit dans `scripts/ja-traduire.ts`, parce qu'elle demande
 * 87 s de chargement et ~3 s par phrase — un traitement par lot, pas une
 * fonctionnalité de page.
 */
import type { TermeLexique } from "./anomalies";

/**
 * Jetons de substitution.
 *
 * Un marqueur symbolique (« ⟦0⟧ », « __X__ ») ne survit pas : le modèle le
 * réécrit, le traduit ou le perd. Des noms propres latins courts et improbables
 * traversent intacts, parce qu'il les prend pour des noms à recopier — ce qui
 * est exactement le comportement recherché.
 */
const JETONS = [
	"Zeta", "Yuni", "Kilo", "Nova", "Orga", "Vira", "Puma", "Rexo",
	"Talo", "Miro", "Sano", "Delo", "Faro", "Gemo", "Hino", "Juno",
];

export interface TexteProtege {
	/** Texte à soumettre au modèle, termes du domaine masqués. */
	masque: string;
	/** Jeton → forme française officielle. */
	table: Map<string, string>;
	/** Termes du lexique présents mais non masqués, faute de jetons libres. */
	debordement: number;
}

/**
 * Masque les termes du lexique présents dans le texte.
 *
 * `lexTrie` doit être trié du plus long au plus court : sans quoi « サイヤ »
 * masquerait le début de « サイヤ人 » et laisserait un « 人 » orphelin.
 *
 * Le nombre de jetons est borné. Au-delà, les termes restants sont laissés tels
 * quels plutôt que réutiliser un jeton déjà pris — deux termes différents
 * derrière le même jeton produiraient une traduction fausse et silencieuse.
 * `debordement` remonte le compte pour que l'appelant sache que la protection
 * n'était pas totale.
 */
export function protegerTermes(texte: string, lexTrie: TermeLexique[]): TexteProtege {
	const table = new Map<string, string>();
	let masque = texte;
	let i = 0;
	let debordement = 0;

	for (const t of lexTrie) {
		if (!t.fr || !masque.includes(t.ja)) continue;
		if (i >= JETONS.length) {
			debordement++;
			continue;
		}
		const jeton = JETONS[i++];
		table.set(jeton, t.fr);
		masque = masque.replaceAll(t.ja, jeton);
	}
	return { masque, table, debordement };
}

/**
 * Réinjecte les formes françaises à la place des jetons.
 *
 * Les jetons sont remplacés du plus long au plus court pour la même raison que
 * le masquage procède ainsi — ici ils font tous quatre lettres, mais la règle
 * protège d'un ajout futur de jeton plus court.
 */
export function restaurerTermes(traduction: string, table: Map<string, string>): string {
	let out = traduction;
	for (const jeton of [...table.keys()].sort((a, b) => b.length - a.length)) {
		out = out.replaceAll(jeton, table.get(jeton)!);
	}
	return out;
}

/**
 * Découpe un texte japonais en segments traduisibles.
 *
 * Les modèles de traduction tronquent au-delà de quelques centaines de tokens,
 * et une planche peut faire 8 171 signes. On coupe aux fins de phrase japonaises
 * (`。`, `！`, `？`) et aux sauts de ligne, jamais au milieu d'une phrase : un
 * segment tronqué se traduit en contresens plutôt qu'en phrase incomplète.
 */
export function segmentsTraduisibles(texte: string, maxSignes = 300): string[] {
	const out: string[] = [];
	let courant = "";
	// Le séparateur est conservé avec le segment qui le précède.
	for (const morceau of texte.split(/(?<=[。！？\n])/)) {
		if (courant.length + morceau.length > maxSignes && courant.trim()) {
			out.push(courant.trim());
			courant = "";
		}
		courant += morceau;
	}
	if (courant.trim()) out.push(courant.trim());
	return out;
}
