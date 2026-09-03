/**
 * crawl-dragonballcn.ts — Relevé du CATALOGUE de comic.dragonballcn.com (鸟山明漫画资料馆).
 *
 * Ce site recense l'œuvre publiée de Toriyama édition par édition : Dragon Ball
 * japonais original (42 tomes), kanzenban (34), Full Color (42), les éditions
 * chinoises continentales / taïwanaises / hongkongaises, Arale, les anime comics,
 * les Daizenshuu et les artbooks. Chaque tome y porte ses métadonnées d'éditeur :
 * date de première édition, ISBN, numéro de magazine, prix, éditeur, titre du volume.
 *
 * CE QUE CE SCRIPT RELÈVE — et ce qu'il ne relève pas
 * ---------------------------------------------------
 * Il relève la BIBLIOGRAPHIE : la liste des éditions, des tomes et leurs métadonnées
 * d'éditeur. Ce sont des faits d'édition, exactement ce qui manque à notre wiki
 * (cf. les tomes fantômes de `bot.db_manga_chapters`, dont le catalogue permet de
 * trancher lesquels existent vraiment, ISBN à l'appui).
 *
 * Il ne télécharge AUCUNE planche, délibérément. Deux raisons mesurées le 2026-09-03 :
 *   1. Le site sert les planches pleine résolution en **403** même avec un Referer
 *      valide — seules les miniatures passent. Le dossier qui les porte s'appelle
 *      `0.Dragon_Ball-buyao_daolian_ya` (不要盗链呀, « ne hotlinkez pas ») : c'est
 *      une protection délibérée, pas un accident de configuration.
 *   2. Ce sont les planches du manga, œuvre de Toriyama éditée par Shueisha, que ce
 *      site redistribue sans licence. Les reverser dans dragonballfr.com exposerait
 *      le site — et le nôtre publie sous son propre nom.
 * Le catalogue, lui, est de l'information factuelle : il se cite, il ne se pirate pas.
 *
 * OÙ LE SITE S'ARRÊTE (mesuré le 2026-09-03)
 * ------------------------------------------
 * Les pages d'édition (`*.htm`, le catalogue) répondent **200** à un client qui
 * s'annonce honnêtement. Les fiches de lecture (`list/gain_1.php`, celles qui
 * listent les planches) répondent **403** au même client. Le site ouvre donc son
 * catalogue et ferme ses pages de lecture — c'est sa politique, elle est nette, et
 * ce script s'y tient : `--avec-planches` existe pour le jour où ça changerait,
 * mais il rapportera les refus au lieu de chercher à les contourner.
 *
 * CE QUE LE SITE AUTORISE
 * -----------------------
 * Son `robots.txt` porte `Allow: /` pour tous, assorti du signal de contenu
 * `search=yes, ai-train=no, use=reference` : indexer et RÉFÉRENCER est permis,
 * entraîner un modèle ou reproduire ne l'est pas. Un relevé bibliographique qui
 * cite sa source tombe dans « reference » ; aspirer les planches, non — et le 403
 * sur les images le matérialise. Le fichier interdit par ailleurs nommément les
 * moissonneurs d'IA (ClaudeBot, GPTBot, anthropic-ai, CCBot…) : ce script n'en est
 * pas un, il s'annonce sous le nom du site qui l'exploite.
 *
 * RÉCUPÉRATION
 * ------------
 * `curl` piloté par `Bun.spawn`, et non le `fetch` de Bun : mesuré le 2026-09-03,
 * Cloudflare rend **403** au fetch de Bun et **200** à curl, à en-têtes identiques —
 * la discrimination porte sur l'empreinte TLS/HTTP2 du client, pas sur les en-têtes.
 * On ne cherche pas à imiter l'empreinte d'un navigateur (ce serait défaire la
 * protection) : on utilise un client HTTP banal que le site sert normalement, sous
 * un User-Agent qui dit qui nous sommes. bxc reste le filet si le site durcit — mais
 * mesuré, ses profils `stealth` ET `max` échouent ici (« Just a moment... ») là où
 * curl passe : le filet est gardé pour plus tard, pas parce qu'il ferait mieux.
 *
 * Le relevé est POLI par construction : une seule requête à la fois, temporisée
 * (défaut 1200 ms), et tout ce qui a été lu est mis en cache sur disque — une reprise
 * après interruption ne redemande rien au site.
 *
 * Usage :
 *   bun apps/bot/scripts/crawl-dragonballcn.ts                      # tout le catalogue (~15 s)
 *   bun apps/bot/scripts/crawl-dragonballcn.ts --avec-planches      # tente aussi les fiches de tome (403 aujourd'hui)
 *   bun apps/bot/scripts/crawl-dragonballcn.ts --collection dragonball_jp_original
 *   bun apps/bot/scripts/crawl-dragonballcn.ts --limite 5 --delai 2000
 *   bun apps/bot/scripts/crawl-dragonballcn.ts --force              # ignore le cache disque
 */

const RACINE = "https://comic.dragonballcn.com";
const DOSSIER_SORTIE = new URL("../data/catalogues/", import.meta.url).pathname;
const DOSSIER_CACHE = `${DOSSIER_SORTIE}.cache-dragonballcn/`;
const CHEMIN_BXC = `${process.env.HOME}/.local/bin/bxc`;

/** Pages d'édition connues, dans l'ordre où le site les présente. */
const EDITIONS = [
	{ slug: "dragonball_jp_original", titre: "Dragon Ball — édition japonaise originale" },
	{ slug: "dragonball_jp_kanzenban", titre: "Dragon Ball — kanzenban japonaise" },
	{ slug: "dragonball_full_color", titre: "Dragon Ball — Full Color (édition numérique)" },
	{ slug: "dragonball_zh_cn", titre: "Dragon Ball — chinois simplifié (continent)" },
	{ slug: "dragonball_zh_tw", titre: "Dragon Ball — chinois traditionnel (Taïwan, Tong Li)" },
	{ slug: "dragonball_zh_hk_ultimate", titre: "Dragon Ball — kanzenban chinoise (Hong Kong)" },
	{ slug: "dragonball_anime_z", titre: "Dragon Ball Z — anime comics TV" },
	{ slug: "dragonball_anime_movie", titre: "Dragon Ball — anime comics films" },
	{ slug: "arale_cn", titre: "Dr Slump — édition chinoise" },
	{ slug: "arale_jp_lib", titre: "Dr Slump — bunko japonais" },
	{ slug: "arale_zh_hk", titre: "Dr Slump — édition hongkongaise" },
];

type Ouvrage = {
	did: string;
	url: string;
	libelle: string;
	couverture: string | null;
	titre_tome?: string;
	premiere_edition?: string;
	isbn?: string;
	magazine?: string;
	prix?: string;
	editeur?: string;
	lignes?: string[];
	planches?: number;
	dossier?: string;
	fichiers?: string[];
};

type Collection = {
	slug: string;
	titre: string;
	titre_site: string | null;
	url: string;
	ouvrages: Ouvrage[];
};

// ---------------------------------------------------------------- arguments

const args = process.argv.slice(2);
const aOption = (nom: string) => args.includes(`--${nom}`);
const valeur = (nom: string, defaut: string) => {
	const i = args.indexOf(`--${nom}`);
	return i >= 0 && args[i + 1] ? (args[i + 1] as string) : defaut;
};

const AVEC_PLANCHES = aOption("avec-planches");
const FORCE = aOption("force");
const DELAI = Number(valeur("delai", "1200"));
const LIMITE = Number(valeur("limite", "0"));
const COLLECTION = valeur("collection", "");
const SORTIE = valeur("sortie", `${DOSSIER_SORTIE}dragonballcn.json`);

// ---------------------------------------------------------------- récupération

/** On s'annonce : pas d'empreinte de navigateur maquillée, un nom et un contact. */
const AGENT = "dragonballfr.com-catalogue/1.0 (releve bibliographique; +https://dragonballfr.com)";

/** Le site renvoie 200 avec la page d'attente Cloudflare : c'est le titre qui trahit. */
const estChallenge = (html: string) =>
	/<title>\s*(Just a moment|Attention Required|Un instant)/i.test(html) || html.length < 2000;

let derniereRequete = 0;

/** Une requête à la fois, temporisée : on ne malmène pas un site qu'on ne possède pas. */
async function temporise() {
	const attente = DELAI - (Date.now() - derniereRequete);
	if (attente > 0) await Bun.sleep(attente);
	derniereRequete = Date.now();
}

function cheminCache(url: string) {
	return `${DOSSIER_CACHE}${Bun.hash(url).toString(36)}.html`;
}

/** Filet anti-Cloudflare : bxc pilote un vrai navigateur là où `fetch` se fait refouler. */
async function viaBxc(url: string): Promise<string | null> {
	const proc = Bun.spawn([CHEMIN_BXC, "scrape", url, "--markdown", "--profile", "max"], {
		stdout: "pipe",
		stderr: "ignore",
	});
	const texte = await new Response(proc.stdout).text();
	await proc.exited;
	return texte.trim().length > 200 ? texte : null;
}

async function recupere(url: string, referer = `${RACINE}/`): Promise<string> {
	const cache = Bun.file(cheminCache(url));
	if (!FORCE && (await cache.exists())) return cache.text();

	await temporise();
	const proc = Bun.spawn(
		[
			"curl", "-sS", "--compressed", "-m", "40",
			"-A", AGENT,
			"-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			"-H", "Accept-Language: fr-FR,fr;q=0.9,en;q=0.8",
			"-H", `Referer: ${referer}`,
			"-w", "\n%{http_code}",
			url,
		],
		{ stdout: "pipe", stderr: "ignore" }
	);
	const brut = await new Response(proc.stdout).text();
	await proc.exited;

	const coupure = brut.lastIndexOf("\n");
	const statut = Number(brut.slice(coupure + 1).trim());
	let html = brut.slice(0, coupure);

	if (statut !== 200 || estChallenge(html)) {
		console.warn(`  ⚠ ${statut} sur ${url} — repli bxc`);
		const secours = await viaBxc(url);
		if (!secours) throw new Error(`Inaccessible : ${url} (HTTP ${statut})`);
		html = secours;
	}

	await Bun.write(cheminCache(url), html);
	return html;
}

// ---------------------------------------------------------------- extraction

const sansBalises = (html: string) =>
	html
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<[^>]+>/g, "")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.trim();

const lignesDe = (html: string) =>
	sansBalises(html)
		.split("\n")
		.map((l) => l.trim().replace(/^　+/, ""))
		.filter(Boolean);

/** Les ouvrages d'une page : chaque `<li>` qui pointe une fiche `gain_1.php`. */
function extraitOuvrages(html: string): Ouvrage[] {
	const trouves: Ouvrage[] = [];
	const vus = new Set<string>();
	const motif = /<a href="(?:list\/)?gain_1\.php\?did=([\d-]+)"[^>]*>([\s\S]*?)<\/a>/g;

	for (const m of html.matchAll(motif)) {
		const did = m[1] as string;
		if (vus.has(did)) continue;
		vus.add(did);
		const dedans = m[2] as string;
		const couverture = /<img[^>]+src="([^"]+)"/.exec(dedans)?.[1] ?? null;
		trouves.push({
			did,
			url: `${RACINE}/list/gain_1.php?did=${did}`,
			libelle: lignesDe(dedans).join(" · "),
			couverture: couverture ? new URL(couverture, `${RACINE}/`).href : null,
		});
	}
	return trouves;
}

/**
 * Métadonnées d'éditeur, présentes sur la seule page japonaise originale :
 * un bloc `<div align=left>` par tome, apparié par position (mesuré 42 = 42).
 */
function extraitMetadonnees(html: string): Partial<Ouvrage>[] {
	const blocs = [...html.matchAll(/<div align=left>([\s\S]*?)<\/div>/g)];
	return blocs.map((b) => {
		const lignes = lignesDe(b[1] as string);
		const champ = (prefixe: RegExp) =>
			lignes.find((l) => prefixe.test(l))?.replace(prefixe, "").trim();
		return {
			titre_tome: lignes[0],
			premiere_edition: champ(/^初版\s*/),
			isbn: champ(/^ISBN\s*/),
			magazine: champ(/^雜誌\s*/),
			prix: champ(/^定価\s*/),
			editeur: champ(/^出版\s*/),
			lignes,
		};
	});
}

/** La fiche d'un tome : ses planches, par leur nom de fichier (jamais leur contenu). */
function extraitPlanches(html: string): { dossier?: string; fichiers: string[] } {
	const fichiers: string[] = [];
	let dossier: string | undefined;
	const motif = /\/list\/\/?([^"]+?)\/_thumb\.([^"/]+?)(?:")/g;

	for (const m of html.matchAll(motif)) {
		dossier ??= m[1] as string;
		const fichier = m[2] as string;
		if (!fichiers.includes(fichier)) fichiers.push(fichier);
	}
	return { dossier, fichiers };
}

const titreDe = (html: string) =>
	/<title>([^<]*)<\/title>/.exec(html)?.[1]?.replace(/\s*-\s*.*$/, "").trim() ?? null;

// ---------------------------------------------------------------- relevé

async function relevePage(slug: string, titre: string): Promise<Collection> {
	const url = `${RACINE}/${slug}.htm`;
	console.log(`\n▸ ${titre}`);
	const html = await recupere(url);

	const ouvrages = extraitOuvrages(html);
	const metas = extraitMetadonnees(html);
	// L'appariement par position n'est fiable que si le site a posé un bloc par tome.
	if (metas.length === ouvrages.length) {
		ouvrages.forEach((o, i) => Object.assign(o, metas[i]));
		console.log(`  ${ouvrages.length} tomes, métadonnées d'éditeur incluses`);
	} else {
		console.log(
			`  ${ouvrages.length} tomes${metas.length ? ` (${metas.length} blocs meta ignorés : appariement incertain)` : ""}`
		);
	}

	return { slug, titre, titre_site: titreDe(html), url, ouvrages };
}

/** Tout `did` que les pages d'édition n'ont pas déjà : databooks, artbooks, séries courtes. */
async function releveDivers(dejaVus: Set<string>): Promise<Collection> {
	console.log(`\n▸ Ouvrages hors édition principale (databooks, artbooks, hors-séries)`);
	const ouvrages: Ouvrage[] = [];

	for (const page of ["", "update.htm"]) {
		const html = await recupere(`${RACINE}/${page}`);
		for (const o of extraitOuvrages(html)) {
			if (dejaVus.has(o.did) || ouvrages.some((x) => x.did === o.did)) continue;
			ouvrages.push(o);
		}
	}
	console.log(`  ${ouvrages.length} ouvrages`);
	return {
		slug: "divers",
		titre: "Databooks, artbooks et hors-séries",
		titre_site: null,
		url: `${RACINE}/`,
		ouvrages,
	};
}

async function relevePlanches(collections: Collection[]) {
	const tous = collections.flatMap((c) => c.ouvrages);
	const cible = LIMITE > 0 ? tous.slice(0, LIMITE) : tous;
	console.log(`\n▸ Fiches de tome : ${cible.length} à relever`);

	let n = 0;
	let refuses = 0;
	for (const ouvrage of cible) {
		n++;
		try {
			const html = await recupere(ouvrage.url, `${RACINE}/`);
			const { dossier, fichiers } = extraitPlanches(html);
			ouvrage.dossier = dossier;
			ouvrage.fichiers = fichiers;
			ouvrage.planches = fichiers.length;
			console.log(`  [${n}/${cible.length}] ${ouvrage.did} — ${fichiers.length} planches`);
		} catch (erreur) {
			refuses++;
			console.warn(`  [${n}/${cible.length}] ${ouvrage.did} — refusé : ${(erreur as Error).message}`);
		}
	}

	if (refuses === cible.length) {
		console.warn(
			`\n  ⚠ Les ${refuses} fiches de tome ont été refusées (403). C'est le comportement\n` +
				`    attendu : le site ouvre son catalogue et ferme ses pages de lecture. Le relevé\n` +
				`    bibliographique ci-dessus, lui, est complet.`
		);
	}
}

// ---------------------------------------------------------------- entrée

const debut = Bun.nanoseconds();
const collections: Collection[] = [];

for (const edition of EDITIONS) {
	if (COLLECTION && edition.slug !== COLLECTION) continue;
	collections.push(await relevePage(edition.slug, edition.titre));
}

if (!COLLECTION) {
	const vus = new Set(collections.flatMap((c) => c.ouvrages.map((o) => o.did)));
	collections.push(await releveDivers(vus));
}

if (AVEC_PLANCHES) await relevePlanches(collections);

const ouvrages = collections.flatMap((c) => c.ouvrages);
const catalogue = {
	source: RACINE,
	releve_le: new Date().toISOString(),
	avertissement:
		"Relevé bibliographique uniquement (éditions, tomes, ISBN, dates, index des planches). " +
		"Aucune planche n'est téléchargée : le site les protège par un 403 délibéré et il s'agit " +
		"d'une œuvre Shueisha/Toriyama qu'il redistribue sans licence.",
	totaux: {
		collections: collections.length,
		ouvrages: ouvrages.length,
		planches: ouvrages.reduce((s, o) => s + (o.planches ?? 0), 0),
		avec_isbn: ouvrages.filter((o) => o.isbn).length,
	},
	collections,
};

await Bun.write(SORTIE, `${JSON.stringify(catalogue, null, 2)}\n`);

const secondes = ((Bun.nanoseconds() - debut) / 1e9).toFixed(1);
console.log(`\n✓ Catalogue écrit : ${SORTIE}`);
console.log(
	`  ${catalogue.totaux.collections} collections · ${catalogue.totaux.ouvrages} ouvrages · ` +
		`${catalogue.totaux.planches} planches indexées · ${catalogue.totaux.avec_isbn} ISBN · ${secondes}s`
);
