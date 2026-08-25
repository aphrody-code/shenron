#!/usr/bin/env bun
/**
 * Amorce les **variantes de personnage par saga** (`bot.db_character_variants`)
 * — « Goku, saga Namek », « Vegeta, saga Cyborgs » — à partir de ce que la base
 * sait vraiment, et de rien d'autre.
 *
 * ── Pourquoi une mesure et pas une liste écrite à la main ────────────────────
 * La base ne savait pas qui apparaît dans quelle saga : `debut_saga_id` est
 * renseigné pour 1 personnage sur 1 323, `db_character_arcs` compte 4 lignes,
 * 36 épisodes sur 826 portent un arc. Écrire « Goku apparaît dans la saga
 * Namek » à la main, c'est recopier ce qu'on croit savoir — et c'est ainsi
 * qu'on finit par affirmer que Yamcha combat sur Namek.
 *
 * Le seul fait vérifiable dont on dispose est l'OCR VF du manga :
 * `bot.db_manga_pages` porte 8 222 planches pour les 42 tomes de Dragon Ball.
 * Croisé aux bornes de tomes de chaque saga (`db_sagas.manga_volume_*`, posées
 * par `--bornes`), il donne une présence MESURÉE, avec sa preuve : les tomes,
 * le nombre de planches, les graphies recherchées.
 *
 * ── Ce que le script ne fait PAS ─────────────────────────────────────────────
 * Il ne remplit ni la puissance, ni la forme atteinte, ni le récit de la saga :
 * l'OCR d'une bulle ne dit pas si Goku est Super Saiyan à ce moment-là. Ces
 * champs restent vides et se remplissent depuis le back-office. Une variante
 * amorcée est marquée `origin = 'ocr-manga'` ; une variante retouchée à la main
 * passe à `'editorial'` et n'est plus jamais écrasée par une nouvelle mesure.
 *
 * Il ne couvre que la série **DB** (42 tomes). Les planches `series='DBS'` sont
 * indexées par identifiant interne de chapitre (`ch1315`…), pas par numéro de
 * chapitre publié : les rattacher aux sagas Moro/Granolah/Black Freezer
 * demanderait une correspondance qu'on n'a pas — donc on s'abstient. GT, Daima
 * et les films n'ont pas de manga du tout.
 *
 * Usage :
 *   bun scripts/variantes-par-saga.ts --bornes [--appliquer]   # bornes de tomes des sagas
 *   bun scripts/variantes-par-saga.ts --mesure                 # simulation (n'écrit rien)
 *   bun scripts/variantes-par-saga.ts --mesure --personnage Goku
 *   bun scripts/variantes-par-saga.ts --mesure --appliquer     # écrit les variantes
 *   bun scripts/variantes-par-saga.ts --mesure --reinitialiser --appliquer  # remesure à neuf
 *   bun scripts/variantes-par-saga.ts --etat                   # ce qu'il y a en base
 */
import { join } from "node:path";
import postgres from "postgres";

const args = process.argv.slice(2);
const opt = (nom: string, defaut?: string) => {
	const i = args.indexOf(`--${nom}`);
	return i !== -1 && args[i + 1] ? args[i + 1]! : defaut;
};
const flag = (nom: string) => args.includes(`--${nom}`);

const APPLIQUER = flag("appliquer");

/** URL de la base, lue dans `apps/site/.env` (ancrage `^DATABASE_URL=` : le
 *  fichier porte une ligne Neon COMMENTÉE avant la ligne active). */
async function urlBase(): Promise<string> {
	const direct = process.env.DATABASE_URL?.trim();
	if (direct) return direct;
	const texte = await Bun.file(join(import.meta.dir, "..", ".env"))
		.text()
		.catch(() => "");
	const ligne = texte.split("\n").find((l) => l.startsWith("DATABASE_URL="));
	const valeur = ligne?.slice("DATABASE_URL=".length).trim().replace(/^["']|["']$/g, "");
	if (!valeur) {
		console.error("✗ DATABASE_URL introuvable (environnement ou apps/site/.env).");
		process.exit(1);
	}
	return valeur;
}

// ── Bornes des sagas dans le manga 42 tomes ─────────────────────────────────
// Découpage éditorial de la publication française (Glénat), volontairement posé
// en TOMES et non en chapitres : les frontières de chapitre varient d'une source
// à l'autre, celles de tome ne bougent pas. Les chevauchements aux charnières
// (un tome qui clôt une saga et en ouvre une autre) sont assumés : un tome
// charnière compte pour les deux sagas, ce qui est exact.
//
// Ces bornes vivent en BASE une fois posées (`db_sagas.manga_volume_*`) : les
// corriger se fait dans le back-office, sans toucher à ce fichier.
const BORNES_MANGA: Record<string, [number, number]> = {
	pilaf: [1, 2],
	"tournament-21": [2, 4],
	"red-ribbon": [5, 8],
	"uranai-baba": [8, 9],
	"tournament-22b": [9, 11],
	"piccolo-daimao": [11, 13],
	"tournament-23": [13, 16],
	saiyan: [17, 20],
	namek: [20, 24],
	saga_freezer: [24, 28],
	retour_sur_terre: [28, 29],
	androids: [29, 33],
	cell: [33, 36],
	"great-saiyaman": [36, 38],
	buu: [38, 42],
};

// ── Graphies : comment un personnage s'écrit dans l'OCR VF ──────────────────
// L'OCR rend des bulles en capitales, souvent sans accent et parfois abîmées.
// On cherche donc des formes normalisées (minuscules, sans accent), en mot
// entier. Les alias ne sont là que pour les noms dont la VF s'écarte du nom de
// la fiche — pas pour « améliorer » le rappel au jugé.
const ALIAS: Record<string, string[]> = {
	Goku: ["goku", "kakarot", "sangoku"],
	Vegeta: ["vegeta"],
	"Son Gohan": ["gohan"],
	Gohan: ["gohan"],
	Krilin: ["krilin", "kuririn"],
	Piccolo: ["piccolo", "petit coeur"],
	Boo: ["boo", "buu"],
	"Majin Boo": ["boo", "buu"],
	Tenshinhan: ["tenshinhan", "ten shin han"],
	Chaozu: ["chaozu", "chao zu"],
	"Tortue Géniale": ["tortue geniale", "kame sennin", "muten"],
	Freezer: ["freezer", "freeza"],
	Cell: ["cell"],
	Trunks: ["trunks"],
	Bulma: ["bulma"],
	Yamcha: ["yamcha"],
	Chichi: ["chichi", "chi chi"],
	Bardock: ["bardock", "baddack"],
	"Son Goten": ["goten"],
	Goten: ["goten"],
	Videl: ["videl"],
	Dendé: ["dende"],
	Kaïo: ["kaio"],
	"Kaïo du Nord": ["kaio"],
	"Mr Satan": ["satan", "hercule"],
	Babidi: ["babidi"],
	Dabra: ["dabra", "dabura"],
	Cooler: ["cooler"],
	Nappa: ["nappa"],
	Raditz: ["raditz"],
	Ginyu: ["ginyu", "ginyou"],
	Zabon: ["zabon"],
	Dodoria: ["dodoria"],
	Gotenks: ["gotenks"],
	Vegetto: ["vegetto", "vegeto"],
	Gogeta: ["gogeta"],
	Pilaf: ["pilaf"],
	Oolong: ["oolong", "plume"],
	Lunch: ["lunch"],
	Karin: ["karin"],
	"Dieu (Kami)": ["kami", "tout puissant"],
	Popo: ["popo"],
	Uub: ["uub", "oob"],
	Broly: ["broly"],
	Garlic: ["garlic"],
	"Garlic Jr.": ["garlic"],
};

/**
 * Graphies qu'on refuse de mesurer, avec la raison — chacune vient d'un faux
 * positif relevé sur la première passe, pas d'une précaution de principe.
 *
 * 1. MOTS_DU_RECIT — le nom de la fiche est d'abord un mot français courant.
 *    « Tard » (fiche 1189) remontait dans 10 sagas sur 15 : le compteur voyait
 *    « trois jours plus tard », « un jour de retard ». Aucun seuil ne sauve une
 *    mesure pareille — sur un texte français, ces noms ne sont PAS mesurables.
 *    Les personnages concernés se renseignent à la main, depuis le back-office.
 *
 * 2. HORS_DRAGON_BALL — autres œuvres d'Akira Toriyama, citées dans l'appareil
 *    éditorial du tome et non dans le récit. « Slump » remontait dans 8 sagas :
 *    les occurrences sont des notes de traduction (« référence au village
 *    d'Aralé dans Docteur Slump ») et la bio de l'auteur en fin de volume.
 */
const MOTS_DU_RECIT = new Set([
	"tard", "dieu", "note", "forte", "boing", "plume", "tortue", "singe", "roi",
	"reine", "ange", "diable", "mort", "vie", "force", "terre", "lune", "ciel",
	"sang", "coeur", "chef", "maitre", "monde", "univers", "espace", "mer",
	"vent", "feu", "glace", "tonnerre", "eclair", "pierre", "nuit", "jour",
	"temps", "guerre", "paix", "peur", "joie", "amour", "haine", "reve",
	"esprit", "corps", "tete", "main", "bras", "oeil", "epee", "sabre", "poing",
	"boule", "boules", "dragon", "robot", "monstre", "docteur", "general",
	"colonel", "sergent", "capitaine", "commandant", "soldat", "homme", "femme",
	"enfant", "grand", "petit", "jeune", "vieux", "nord", "ouest",
]);

const HORS_DRAGON_BALL = new Set([
	"slump", "arale", "kajika", "ackman", "cowa", "sandland", "wolf", "toriyama",
]);

function normalise(s: string): string {
	return s
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9 ]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Graphies à chercher pour un personnage.
 *
 * Trois refus délibérés, chacun venant d'un faux positif observé :
 *  - les noms de moins de 4 signes (« Boo » excepté par alias) : « ex », « oob »
 *    et consorts touchent une planche sur dix sans rien vouloir dire ;
 *  - les fiches à parenthèse (« Cell (présent) », « Chaozu (futur) ») : leur
 *    nom racine est déjà porté par la fiche principale, les compter deux fois
 *    ferait deux variantes concurrentes pour la même présence ;
 *  - les noms génériques d'une seule syllabe commune (« Roi », « Dieu »).
 */
function graphies(nom: string): string[] {
	const alias = ALIAS[nom];
	if (alias) return alias.length ? alias : [];
	if (/[()]/.test(nom)) return [];
	const base = normalise(nom.replace(/^son /i, ""));
	if (base.length < 4) return [];
	if (base.split(" ").length > 3) return [];
	if (MOTS_DU_RECIT.has(base) || HORS_DRAGON_BALL.has(base)) return [];
	return [base];
}

interface Saga {
	id: number;
	slug: string;
	name: string;
	orderIdx: number | null;
	debut: number;
	fin: number;
}

const sql = postgres(await urlBase(), { max: 2, prepare: false });

try {
	// ── --bornes : pose les plages de tomes sur db_sagas ────────────────────
	if (flag("bornes")) {
		const sagas = await sql<{ id: number; slug: string; name: string }[]>`
			select id, slug, name from bot.db_sagas order by id`;
		let posees = 0;
		for (const s of sagas) {
			const b = BORNES_MANGA[s.slug];
			if (!b) continue;
			posees++;
			if (APPLIQUER) {
				await sql`update bot.db_sagas
					set manga_volume_start = ${b[0]}, manga_volume_end = ${b[1]}
					where id = ${s.id}`;
			}
			console.log(`${APPLIQUER ? "✓" : "·"} ${s.name.padEnd(36)} tomes ${b[0]}–${b[1]}`);
		}
		const sans = sagas.length - posees;
		console.log(
			`\n${posees} saga(s) bornée(s), ${sans} sans support manga (GT, Daima, films, DBS anime).`
		);
		if (!APPLIQUER) console.log("Simulation — relancer avec --appliquer pour écrire.");
		process.exit(0);
	}

	// ── --etat : ce qu'il y a déjà en base ──────────────────────────────────
	if (flag("etat")) {
		const lignes = await sql<
			{ personnage: string; variantes: number; sagas: string; origines: string }[]
		>`
			select c.name as personnage,
			       count(*)::int as variantes,
			       string_agg(s.name, ', ' order by s.order_idx) as sagas,
			       string_agg(distinct v.origin, '/') as origines
			from bot.db_character_variants v
			join bot.db_characters c on c.id = v.character_id
			join bot.db_sagas s on s.id = v.saga_id
			group by c.name order by count(*) desc, c.name limit 40`;
		if (!lignes.length) {
			console.log("Aucune variante en base. Lancer --mesure --appliquer.");
		} else {
			for (const l of lignes) {
				console.log(`${l.personnage.padEnd(24)} ${String(l.variantes).padStart(2)}  [${l.origines}]  ${l.sagas}`);
			}
			const [t] = await sql<{ n: number }[]>`select count(*)::int as n from bot.db_character_variants`;
			console.log(`\n${t?.n ?? 0} variante(s) au total.`);
		}
		process.exit(0);
	}

	if (!flag("mesure")) {
		console.log("Rien à faire. Voir --bornes, --mesure, --etat (et --appliquer).");
		process.exit(0);
	}

	// ── --mesure : présence par saga, mesurée sur l'OCR du manga ────────────
	const sagas = (
		await sql<
			{
				id: number;
				slug: string;
				name: string;
				order_idx: number | null;
				manga_volume_start: number | null;
				manga_volume_end: number | null;
			}[]
		>`select id, slug, name, order_idx, manga_volume_start, manga_volume_end
		  from bot.db_sagas
		  where manga_volume_start is not null and manga_volume_end is not null
		  order by order_idx nulls last, id`
	).map(
		(s): Saga => ({
			id: s.id,
			slug: s.slug,
			name: s.name,
			orderIdx: s.order_idx,
			debut: s.manga_volume_start!,
			fin: s.manga_volume_end!,
		})
	);
	if (!sagas.length) {
		console.error("✗ Aucune saga bornée. Lancer d'abord : --bornes --appliquer");
		process.exit(1);
	}

	// Les 8 222 planches tiennent en mémoire (≈ 1,8 Mo de texte). On les
	// tokenise UNE fois : chercher 400 noms sur 8 222 planches par expression
	// régulière prendrait des minutes, un test d'appartenance à un ensemble
	// prend quelques secondes.
	const planches = await sql<{ tome: string; text: string | null }[]>`
		select tome, text from bot.db_manga_pages
		where series = 'DB' and tome like 'vol%' and text is not null`;

	interface PlancheIdx {
		tome: number;
		mots: Set<string>;
		/** Texte normalisé, pour les graphies en plusieurs mots. */
		plat: string;
	}
	const index: PlancheIdx[] = [];
	for (const p of planches) {
		const tome = Number.parseInt(p.tome.replace(/\D/g, ""), 10);
		if (!Number.isFinite(tome)) continue;
		const plat = normalise(p.text ?? "");
		index.push({ tome, plat, mots: new Set(plat.split(" ")) });
	}
	console.log(`${index.length} planches OCR indexées (série DB, tomes 1–42).`);

	const filtre = opt("personnage");
	const personnages = await sql<{ id: number; name: string; image: string | null }[]>`
		select id, name, image from bot.db_characters
		${filtre ? sql`where name ilike ${`%${filtre}%`}` : sql``}
		order by id`;

	// `--reinitialiser` : efface les variantes AMORCÉES avant de remesurer. Sans
	// lui, resserrer les graphies laisserait en base les faux positifs de la
	// passe précédente (rien ne les supprime, `on conflict` ne fait qu'ajouter).
	// Les variantes reprises à la main (`origin = 'editorial'`) sont épargnées.
	if (flag("reinitialiser") && APPLIQUER) {
		const supprimees = await sql`
			delete from bot.db_character_variants
			where origin is distinct from 'editorial' returning id`;
		console.log(`${supprimees.length} variante(s) amorcée(s) effacée(s) avant remesure.`);
	}

	const mesureAt = Date.now();
	let ecrites = 0;
	let personnagesTouches = 0;
	const apercu: string[] = [];

	for (const p of personnages) {
		const formes = graphies(p.name);
		if (!formes.length) continue;

		// Planches où l'une des graphies apparaît, par tome.
		const parTome = new Map<number, number>();
		for (const pl of index) {
			const vu = formes.some((f) => (f.includes(" ") ? pl.plat.includes(f) : pl.mots.has(f)));
			if (vu) parTome.set(pl.tome, (parTome.get(pl.tome) ?? 0) + 1);
		}
		if (!parTome.size) continue;

		const variantes: { saga: Saga; tomes: number[]; planches: number }[] = [];
		for (const s of sagas) {
			const tomes: number[] = [];
			let n = 0;
			for (let t = s.debut; t <= s.fin; t++) {
				const c = parTome.get(t);
				if (c) {
					tomes.push(t);
					n += c;
				}
			}
			// Seuil : trois planches au moins dans la saga. En dessous, on est
			// dans le bruit d'OCR (un nom mal lu, une couverture, un sommaire) —
			// mesuré sur « boo », qui touche 4 planches du tome 1 où il n'a
			// évidemment rien à faire.
			if (n >= 3) variantes.push({ saga: s, tomes, planches: n });
		}
		if (!variantes.length) continue;
		personnagesTouches++;

		if (apercu.length < 25) {
			apercu.push(
				`${p.name.padEnd(22)} ${variantes.map((v) => `${v.saga.name.replace(/^Saga /, "")}(${v.planches})`).join(" · ")}`
			);
		}

		if (!APPLIQUER) {
			ecrites += variantes.length;
			continue;
		}

		for (const v of variantes) {
			const slugSaga = v.saga.slug.replace(/_/g, "-");
			const slug = `${normalise(p.name).replace(/ /g, "-")}-${slugSaga}`;
			const evidence = {
				methode: "ocr-manga",
				tomes: v.tomes,
				planches: v.planches,
				graphies: formes,
				mesureAt,
			};
			// `where origin is distinct from 'editorial'` : une variante reprise à
			// la main n'est JAMAIS écrasée par une nouvelle mesure. C'est la seule
			// garantie qui rend ce script rejouable sans détruire du travail.
			await sql`
				insert into bot.db_character_variants
					(character_id, saga_id, slug, label, display_name,
					 first_volume, last_volume, origin, evidence, sort_order)
				values (${p.id}, ${v.saga.id}, ${slug}, ${v.saga.name},
					${`${p.name} — ${v.saga.name}`},
					${v.tomes[0]!}, ${v.tomes.at(-1)!}, 'ocr-manga', ${sql.json(evidence)},
					${v.saga.orderIdx ?? 0})
				on conflict (character_id, saga_id) do update set
					first_volume = excluded.first_volume,
					last_volume  = excluded.last_volume,
					evidence     = excluded.evidence,
					sort_order   = excluded.sort_order
				where bot.db_character_variants.origin is distinct from 'editorial'`;
			ecrites++;
		}
	}

	console.log(`\n${apercu.join("\n")}`);
	console.log(
		`\n${personnagesTouches} personnage(s) présent(s) dans au moins une saga, ${ecrites} variante(s) ${APPLIQUER ? "écrites" : "à écrire"}.`
	);
	if (!APPLIQUER) console.log("Simulation — relancer avec --appliquer pour écrire.");
} finally {
	await sql.end({ timeout: 5 });
}
