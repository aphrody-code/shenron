#!/usr/bin/env bun
/**
 * File de TRADUCTION des planches de databook : japonais → français.
 *
 *   bun apps/site/scripts/planches-a-traduire.ts --compte
 *   bun apps/site/scripts/planches-a-traduire.ts --lot 40 --json /tmp/lot-01.json
 *   bun apps/site/scripts/planches-a-traduire.ts --databook 4 --pages 41-80 --json …
 *
 * Ce que le script garantit, et qui n'est pas négociable :
 *
 * 1. **Seules les planches saines sortent.** `classerDefaut` (le juge unique du
 *    corpus) écarte les transcriptions hallucinées : traduire une hallucination
 *    la blanchit en la rendant lisible, c'est le pire résultat possible.
 *    S'y ajoute `intraduisible()`, trois signatures que le juge du corpus ne
 *    connaît pas et que les traducteurs de la première passe ont dû écarter
 *    À LA MAIN, après lecture — donc après avoir payé la lecture. Mesuré :
 *    2 131 planches sur 9 356, soit 23 % du travail restant, économisées sans
 *    perdre une seule planche traduisible.
 * 2. **Seules les planches japonaises sortent** (au moins un kana) : les pages
 *    de crédits, ISBN et sommaires latins n'ont rien à traduire.
 * 3. **Le lexique du domaine voyage avec le lot.** Sans lui, un traducteur rend
 *    `界王拳` par « le poing du roi » et `ベジータ` par « Végitta » — mesuré.
 *    Le lot ne porte que les termes RÉELLEMENT présents dans ses planches, pour
 *    ne pas payer 4 000 entrées de lexique par lot.
 *
 *    L'appariement de ces termes est **tolérant**, et il a fallu une passe ratée
 *    pour le comprendre : cherchée à l'identique, la graphie de la base ne
 *    retrouve pas celle de la planche. La base écrit `ターレス` (Tullece), l'OCR
 *    a lu `タレス` — l'allongement manque, `includes` échoue, le terme sort du
 *    lexique du lot, et le traducteur, laissé sans forme officielle, rend
 *    « Tarles » à l'oreille. Même mécanique pour `ダーブラ`, qui n'existe en base
 *    qu'enrobé (`未来のダーブラ`, `ダーブラ：ゼノ`) et ressortait « Dâburâ ».
 *    On apparie donc sur une forme repliée (sans allongement, sans point médian,
 *    sans qualificatif de désambiguïsation) et on remonte au traducteur LES DEUX
 *    graphies : celle de la base et celle que porte réellement sa planche.
 * 4. **Les lots ne se recouvrent pas.** `--decalage` découpe la file d'un même
 *    appel, mais la file RÉTRÉCIT à mesure que les traductions se déposent :
 *    deux agents parallèles finiraient par se marcher dessus. `--pages 41-80`
 *    borne sur les numéros de planche, qui eux ne bougent pas — c'est la forme
 *    à employer dès qu'il y a plus d'un traducteur.
 *
 * Reprise : une planche déjà traduite (`text_fr` non vide dans le jsonb) ne
 * ressort jamais. Relancer après une interruption reprend là où on s'est arrêté.
 * `--retraduire` lève ce filtre, pour reprendre une planche dont le contrôle a
 * montré qu'elle avait été mal rendue.
 */
import postgres from "postgres";
import { classerDefaut } from "../src/lib/databooks-defauts";
import { trierLexique, type TermeLexique } from "../src/lib/ja/anomalies";
import { contientJaponais, normaliserJa } from "../src/lib/ja/normalisation";

const args = process.argv.slice(2);
const flag = (nom: string) => args.includes(`--${nom}`);
const opt = (nom: string, def?: string) => {
	const i = args.indexOf(`--${nom}`);
	return i >= 0 ? (args[i + 1] ?? def) : def;
};

const KANA = /[぀-ヿ]/;

/**
 * Sinogrammes simplifiés qui n'existent pas en japonais : la sortie a dérivé
 * vers du chinois. Le juge du corpus ne voit que le cas total (idéogrammes sans
 * un seul kana) ; ici la planche garde ses kana autour, et passe donc au travers.
 */
const SIMPLIFIES = /[个陆这说见门东车马鸟贝长风飞龙业习乡书买卖]/;

/**
 * Bruit latin greffé en plein mot japonais : « のability », « じolation », « がindo ».
 *
 * MINUSCULES seulement, et c'est le fruit d'une mesure : en majuscules, ce sont
 * des sigles parfaitement légitimes, omniprésents dans les V-Jump et les guides
 * de jeux — « 年WJNo », « ISBNコ », « 王OCG », « Switch版 », « をGET ». Les
 * compter écartait 3 468 planches au lieu de 1 682 : un quart du corpus jeté
 * pour cause de filtre trop gourmand.
 */
const LATIN_COLLE = /[぀-ヿ一-鿿][a-z]{3,}|[a-z]{3,}[぀-ヿ一-鿿]/;

/**
 * Boucle NON consécutive : le même bloc revient trois fois dans la planche sans
 * se suivre. `BOUCLE` du juge du corpus exige la répétition d'affilée (`\1{2,}`)
 * et rate ce cas, fréquent sur les tableaux (« ADVENTURE HISTORY ») où le modèle
 * reprend un paragraphe entier après une insertion.
 */
function boucleDispersee(texte: string): boolean {
	for (let i = 0; i + 30 <= texte.length; i += 15) {
		const bloc = texte.slice(i, i + 30);
		if (!/[぀-ヿ一-鿿]/.test(bloc)) continue;
		let n = 0;
		let j = 0;
		while ((j = texte.indexOf(bloc, j)) !== -1) {
			n++;
			j += 30;
		}
		if (n >= 3) return true;
	}
	return false;
}

/**
 * Signature d'échec qui rend une planche intraduisible, ou `null`.
 *
 * Délibérément SÉPARÉ de `classerDefaut` : ce dernier gouverne l'avertissement
 * public sur la page databook et les comptes du back-office. L'y fusionner
 * poserait un bandeau « planche mal lue » sur 2 131 fiches de plus, ce qui est
 * un autre débat — celui de ce qu'on montre au lecteur, pas de ce qu'on traduit.
 */
export function intraduisible(texte: string): string | null {
	if (SIMPLIFIES.test(texte)) return "chinois-simplifie";
	if (LATIN_COLLE.test(texte)) return "latin-colle";
	if (boucleDispersee(texte)) return "boucle-dispersee";
	return null;
}

/**
 * Forme repliée servant d'index d'appariement entre la graphie de la base et
 * celle de la planche. Elle efface ce que l'OCR mange ou ajoute le plus souvent :
 * le signe d'allongement `ー` (« ターレス » lu « タレス ») et les points médians
 * (les trois existent et se mélangent dans les sources).
 *
 * Repli délibérément agressif : il ne SUBSTITUE rien, il propose une entrée de
 * lexique au traducteur, qui garde l'arbitrage. Une collision (deux termes
 * distincts pliés pareil) coûte une ligne de lexique en trop, jamais une
 * traduction fausse.
 */
const replier = (s: string) => normaliserJa(s).replace(/ー/g, "");

/**
 * Noyau d'une graphie de base : `未来のダーブラ` et `ダーブラ：ゼノ` désignent le
 * même nom, que la planche écrit nu. Sans ce dépouillement, le terme n'entre
 * jamais dans le lexique d'un lot.
 */
function noyaux(ja: string): string[] {
	const formes = new Set([ja]);
	const nu = ja
		.replace(/^(未来の|少年|幼少期の)/, "")
		.replace(/[：:][ゼ][ノ]$/, "")
		.replace(/[（(][^）)]*[）)]$/, "")
		.trim();
	if (nu.length >= 2) formes.add(nu);
	return [...formes];
}

async function urlBase(): Promise<string> {
	const brut = await Bun.file(new URL("../.env", import.meta.url).pathname).text();
	// Le fichier porte DEUX lignes DATABASE_URL, l'ancienne Neon en commentaire
	// AVANT la locale : ancrer en début de ligne et prendre la DERNIÈRE.
	const lignes = brut.split("\n").filter((l) => l.startsWith("DATABASE_URL="));
	const url = lignes.at(-1)?.slice("DATABASE_URL=".length).replace(/^"|"$/g, "").trim();
	if (!url) throw new Error("DATABASE_URL introuvable dans apps/site/.env");
	return url;
}

const sql = postgres(await urlBase(), { max: 2, prepare: false });

interface PlancheBrute {
	databook_id: string | number;
	titre: string;
	page: number;
	texte: string;
	traduite: boolean;
}

try {
	const cibleId = Number(opt("databook") ?? 0) || 0;
	const categorie = opt("categorie");

	const brutes = await sql<PlancheBrute[]>`
		SELECT d.id AS databook_id,
		       d.title AS titre,
		       (e.value->>'number')::int AS page,
		       coalesce(e.value->>'text', '') AS texte,
		       coalesce(length(trim(coalesce(e.value->>'text_fr', ''))), 0) > 0 AS traduite
		FROM bot.db_databooks d, jsonb_array_elements(d.pages) e
		WHERE (${cibleId} = 0 OR d.id = ${cibleId})
		  AND (${categorie ?? null}::text IS NULL OR d.category = ${categorie ?? null})
		ORDER BY d.id, (e.value->>'number')::int
	`;

	// Le filtrage tient en JS parce que le juge des défauts y vit : le refaire en
	// SQL, c'est fabriquer un second juge qui divergera du premier (et la boucle
	// ne se détecte de toute façon pas en SQL en un temps raisonnable).
	const retraduire = flag("retraduire");
	const laxiste = flag("sans-filtre-etendu");
	const eligibles = brutes.filter(
		(p) =>
			(retraduire || !p.traduite) &&
			KANA.test(p.texte) &&
			classerDefaut(p.texte) === null &&
			(laxiste || intraduisible(p.texte) === null),
	);

	if (flag("compte")) {
		const par = new Map<string, { titre: string; reste: number; faites: number; signes: number }>();
		for (const p of brutes) {
			const cle = String(p.databook_id);
			const e = par.get(cle) ?? { titre: p.titre, reste: 0, faites: 0, signes: 0 };
			if (p.traduite) e.faites++;
			else if (KANA.test(p.texte) && classerDefaut(p.texte) === null && intraduisible(p.texte) === null) {
				e.reste++;
				e.signes += p.texte.length;
			}
			par.set(cle, e);
		}
		const lignes = [...par.entries()]
			.filter(([, e]) => e.reste > 0 || e.faites > 0)
			.sort((a, b) => b[1].reste - a[1].reste);
		for (const [id, e] of lignes) {
			console.log(
				`${id.padStart(4)}  reste ${String(e.reste).padStart(4)}  faites ${String(e.faites).padStart(4)}  ${String(Math.round(e.signes / 1000)).padStart(4)} k signes  ${e.titre}`,
			);
		}
		const reste = lignes.reduce((n, [, e]) => n + e.reste, 0);
		const faites = lignes.reduce((n, [, e]) => n + e.faites, 0);
		const signes = lignes.reduce((n, [, e]) => n + e.signes, 0);
		console.log(`\n${reste} planches à traduire, ${faites} déjà traduites, ${Math.round(signes / 1000)} k signes japonais restants.`);
		process.exit(0);
	}

	const plage = opt("pages");
	let candidates = eligibles;
	if (plage) {
		const m = /^(\d+)-(\d+)$/.exec(plage);
		if (!m) throw new Error(`--pages attend « début-fin » (reçu « ${plage} »)`);
		const [debut, fin] = [Number(m[1]), Number(m[2])];
		candidates = eligibles.filter((p) => p.page >= debut && p.page <= fin);
	}
	const taille = Number(opt("lot", "40"));
	const decalage = Number(opt("decalage", "0"));
	const tranche = candidates.slice(decalage, decalage + taille);
	if (tranche.length === 0) {
		console.error("aucune planche à traduire pour ces critères.");
		process.exit(3);
	}

	// Lexique du domaine : la base porte, sur la même ligne, la graphie japonaise
	// et la forme française officielle. C'est elle qui fait autorité, pas l'oreille
	// du traducteur.
	const brutLex = await sql<{ ja: string; fr: string; kind: string }[]>`
		SELECT name_ja AS ja, name AS fr, 'personnage' AS kind FROM bot.db_characters WHERE name_ja IS NOT NULL
		UNION ALL SELECT name_ja, name, 'planete'        FROM bot.db_planets         WHERE name_ja IS NOT NULL
		UNION ALL SELECT name_ja, name, 'race'           FROM bot.db_races           WHERE name_ja IS NOT NULL
		UNION ALL SELECT name_ja, name, 'saga'           FROM bot.db_sagas           WHERE name_ja IS NOT NULL
		UNION ALL SELECT name_ja, name, 'technique'      FROM bot.db_techniques      WHERE name_ja IS NOT NULL
	`;
	const vus = new Set<string>();
	const termes: TermeLexique[] = [];
	for (const l of brutLex) {
		for (const v of String(l.ja).split(/[,、;]/)) {
			const ja = v.trim().replace(/^[（(]+|[）)]+$/g, "").trim();
			if (ja.length < 2 || !contientJaponais(ja) || vus.has(ja)) continue;
			vus.add(ja);
			termes.push({ ja, fr: String(l.fr ?? "").replace(/\s*\([^)]*\)\s*$/, "").trim(), kind: l.kind });
		}
	}
	const tries = trierLexique(termes);
	const corpus = tranche.map((p) => p.texte).join("\n");
	const corpusReplie = replier(corpus);

	// Ne descend dans le lot que ce que le lot contient : sur 4 000 entrées, une
	// vingtaine sert, et un lexique qu'on ne relit pas est un lexique ignoré.
	const utiles: { ja: string; fr: string; kind: string; dansLaPlanche?: string }[] = [];
	const retenus = new Set<string>();
	for (const t of tries) {
		if (retenus.has(t.fr)) continue;
		for (const forme of noyaux(t.ja)) {
			if (forme.length < 2) continue;
			if (corpus.includes(forme)) {
				utiles.push({ ja: t.ja, fr: t.fr, kind: t.kind });
				retenus.add(t.fr);
				break;
			}
			// Appariement replié : la planche porte une graphie que l'OCR a rabotée.
			// On remonte la graphie RÉELLE de la planche, sans quoi le traducteur
			// chercherait dans son texte un terme qui ne s'y trouve pas.
			const cible = replier(forme);
			if (cible.length < 2 || !corpusReplie.includes(cible)) continue;
			const trouve = new RegExp(`${[...cible].map((c) => `${c}ー?`).join("[・･·]?")}`).exec(corpus);
			utiles.push({ ja: t.ja, fr: t.fr, kind: t.kind, dansLaPlanche: trouve?.[0] ?? undefined });
			retenus.add(t.fr);
			break;
		}
	}

	const sortie = {
		planches: tranche.map((p) => ({
			databookId: Number(p.databook_id),
			page: p.page,
			titre: p.titre,
			texte: p.texte,
		})),
		lexique: utiles,
		reste: candidates.length,
	};

	const chemin = opt("json");
	if (chemin) {
		await Bun.write(chemin, JSON.stringify(sortie, null, "\t"));
		const signes = tranche.reduce((n, p) => n + p.texte.length, 0);
		console.log(`${tranche.length} planches (${signes} signes) + ${utiles.length} termes de lexique → ${chemin}`);
		console.log(`(${candidates.length} planches éligibles pour ces critères, ${eligibles.length} sur tout l'ouvrage)`);
	} else {
		console.log(JSON.stringify(sortie, null, "\t"));
	}
} catch (e) {
	console.error(`✗ ${(e as Error).message}`);
	process.exitCode = 1;
} finally {
	await sql.end();
}
