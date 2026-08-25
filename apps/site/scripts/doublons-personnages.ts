#!/usr/bin/env bun
/**
 * Fiches de personnage **en double** dans `bot.db_characters` — inventaire
 * mesuré, puis masquage de la fiche pauvre.
 *
 * Le wiki porte plusieurs fois le même personnage sous deux graphies : « Goku »
 * (id 1) et « Son Goku », « Krillin » et « Krilin », « Chi-Chi » et « Chichi »,
 * « Ten Shin Han » et « Tenshinhan ». Deux ingests successifs, deux
 * translittérations. Ça ne se voyait pas tant que rien ne listait les
 * personnages ensemble ; la liste des personnages d'une saga
 * (`db_character_variants`) les affiche côte à côte, et le doublon saute aux
 * yeux.
 *
 * ── Ce qui n'est PAS un doublon ─────────────────────────────────────────────
 * Les fiches à parenthèse — « Broly (DBS) », « Trunks (futur) », « Cell
 * (Xeno) », « Majin Boo (bon) » — sont des versions légitimes, que la fiche
 * principale présente déjà sous « Versions & apparitions ». Le script les
 * ignore : seules les fiches SANS parenthèse entrent dans un groupe.
 *
 * ── Comment on tranche ──────────────────────────────────────────────────────
 * La fiche gardée est la mieux dotée, sur un score de contenu réel (article,
 * description, image, techniques, transformations, sections éditoriales,
 * variantes). Les autres passent à `visible = false` : elles sortent du site
 * public et des listes, mais restent en base avec toutes leurs relations. Rien
 * n'est supprimé — `/admin/visibilite` rend le masquage en un clic.
 *
 * Quand DEUX fiches d'un groupe sont richement dotées, le script refuse de
 * choisir et le signale : fusionner du contenu écrit demande une lecture, pas
 * un score.
 *
 * Usage :
 *   bun scripts/doublons-personnages.ts              # inventaire (n'écrit rien)
 *   bun scripts/doublons-personnages.ts --appliquer  # masque les fiches pauvres
 *   bun scripts/doublons-personnages.ts --demasquer  # annule (remet visible=true)
 */
import { join } from "node:path";
import postgres from "postgres";

const args = process.argv.slice(2);
const flag = (nom: string) => args.includes(`--${nom}`);
const APPLIQUER = flag("appliquer");

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

/**
 * Clé de regroupement, volontairement agressive : accents retirés, préfixe
 * « Son » retiré, tout ce qui n'est pas alphanumérique supprimé, et lettres
 * répétées réduites à une seule. C'est cette dernière règle qui rapproche
 * « Krillin » de « Krilin » — sans elle, la moitié des doublons passe au
 * travers.
 */
function cle(nom: string): string {
	return nom
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/^son\s+/, "")
		.replace(/[^a-z0-9]/g, "")
		.replace(/(.)\1+/g, "$1");
}

interface Fiche {
	id: number;
	name: string;
	race: string | null;
	/** Nom japonais — le juge décisif quand il est renseigné des deux côtés. */
	nameJa: string | null;
	visible: boolean;
	aImage: boolean;
	aDescription: boolean;
	aArticle: boolean;
	techniques: number;
	transformations: number;
	sections: number;
	variantes: number;
}

/** Poids de contenu : ce qui serait perdu de vue si on masquait la fiche. */
function score(f: Fiche): number {
	return (
		(f.aArticle ? 6 : 0) +
		(f.aDescription ? 2 : 0) +
		(f.aImage ? 1 : 0) +
		f.techniques * 2 +
		f.transformations * 2 +
		f.sections * 3 +
		(f.variantes > 0 ? 1 : 0)
	);
}

const sql = postgres(await urlBase(), { max: 2, prepare: false });

try {
	if (flag("demasquer")) {
		const remises = await sql`
			update bot.db_characters set visible = true
			where visible = false returning id`;
		console.log(`${remises.length} fiche(s) de personnage remise(s) en visibilité.`);
		process.exit(0);
	}

	const fiches = (
		await sql<
			{
				id: number;
				name: string;
				race: string | null;
				name_ja: string | null;
				visible: boolean;
				a_image: boolean;
				a_description: boolean;
				a_article: boolean;
				techniques: number;
				transformations: number;
				sections: number;
				variantes: number;
			}[]
		>`
		select c.id, c.name, c.race, c.name_ja, c.visible,
			c.image is not null as a_image,
			coalesce(length(c.description), 0) > 40 as a_description,
			c.article is not null as a_article,
			(select count(*) from bot.db_character_techniques t where t.character_id = c.id)::int as techniques,
			(select count(*) from bot.db_transformations tr where tr.character_id = c.id)::int as transformations,
			(select count(*) from bot.db_wiki_sections w
			  where w.entity_type = 'character' and w.entity_id = c.id)::int as sections,
			(select count(*) from bot.db_character_variants v where v.character_id = c.id)::int as variantes
		from bot.db_characters c
		order by c.id`
	).map(
		(r): Fiche => ({
			id: r.id,
			name: r.name,
			race: r.race,
			nameJa: r.name_ja,
			visible: r.visible,
			aImage: r.a_image,
			aDescription: r.a_description,
			aArticle: r.a_article,
			techniques: r.techniques,
			transformations: r.transformations,
			sections: r.sections,
			variantes: r.variantes,
		})
	);

	// Seules les fiches SANS parenthèse : « Trunks (futur) » est une version, pas
	// un doublon.
	const groupes = new Map<string, Fiche[]>();
	for (const f of fiches) {
		if (/[()]/.test(f.name)) continue;
		const k = cle(f.name);
		if (k.length < 3) continue;
		groupes.set(k, [...(groupes.get(k) ?? []), f]);
	}

	let masquees = 0;
	let arbitrages = 0;
	const ambigus: string[] = [];

	/**
	 * Première graphie du nom japonais, normalisée. Le champ porte parfois le
	 * romaji à la suite (« マーロン, Māron ») — on ne compare que le japonais.
	 */
	const ja = (f: Fiche): string =>
		(f.nameJa ?? "").split(",")[0]!.replace(/[\s·・･]/g, "").trim();

	/**
	 * Deux fiches sont-elles vraiment la même personne ?
	 *
	 * Le nom japonais tranche dans les DEUX sens quand il existe des deux côtés,
	 * et il prime sur tout le reste : « Chi-Chi » (Human) et « Chichi »
	 * (Terrienne) portent tous deux チチ — même personne, races mal saisies.
	 * À l'inverse « Maron » (マロン, l'ex-petite amie de Krilin) et « Marron »
	 * (マーロン, sa fille) sont deux personnages que la seule graphie latine
	 * confondrait — c'est le piège classique de Dragon Ball, et il coûterait ici
	 * le masquage d'une vraie fiche.
	 *
	 * Sans nom japonais, la race sert de garde-fou : « Abra » (Neko Majin) n'est
	 * pas « Âbra » (Démon, le père de Dabra dans Daima).
	 */
	const memePersonne = (a: Fiche, b: Fiche): boolean => {
		const ja1 = ja(a);
		const ja2 = ja(b);
		if (ja1 && ja2) return ja1 === ja2;
		const r1 = (a.race ?? "").trim().toLowerCase();
		const r2 = (b.race ?? "").trim().toLowerCase();
		if (r1 && r2 && r1 !== r2) return false;
		return true;
	};

	let ecartes = 0;
	for (const [k, groupe] of [...groupes].sort()) {
		if (groupe.length < 2) continue;
		const classes = [...groupe].sort((a, b) => score(b) - score(a) || a.id - b.id);
		// On ne garde dans le groupe que ce qui est bien la même personne que la
		// fiche de tête ; le reste est une homonymie, pas un doublon.
		const tete = classes[0]!;
		const homonymes = classes.slice(1).filter((f) => !memePersonne(tete, f));
		if (homonymes.length) {
			ecartes += homonymes.length;
			console.log(
				`${k.padEnd(18)} homonymes distincts, laissés tels quels : ` +
					`${[tete, ...homonymes].map((f) => `${f.id}:${f.name}`).join(" ≠ ")}`
			);
		}
		const memes = classes.filter((f) => f === tete || memePersonne(tete, f));
		if (memes.length < 2) continue;
		const gardee = memes[0]!;
		const perdantes = memes.slice(1);

		// Deux fiches substantielles : on ne tranche pas au score. Fusionner du
		// contenu rédigé demande de le lire.
		const substantielles = memes.filter((f) => f.aArticle || f.sections > 0);
		if (substantielles.length > 1) {
			ambigus.push(`${k} → ${memes.map((f) => `${f.id}:${f.name}(${score(f)})`).join(" vs ")}`);
			continue;
		}

		arbitrages++;
		console.log(
			`${k.padEnd(18)} garde ${gardee.id}:${gardee.name} (${score(gardee)}) ` +
				`· masque ${perdantes.map((f) => `${f.id}:${f.name}(${score(f)})`).join(", ")}`
		);
		if (APPLIQUER) {
			for (const f of perdantes) {
				if (!f.visible) continue;
				await sql`update bot.db_characters set visible = false where id = ${f.id}`;
				masquees++;
			}
		} else {
			masquees += perdantes.filter((f) => f.visible).length;
		}
	}

	if (ambigus.length) {
		console.log(`\n${ambigus.length} groupe(s) à trancher à la main (contenu des deux côtés) :`);
		for (const a of ambigus) console.log(`  ${a}`);
	}
	console.log(
		`\n${arbitrages} groupe(s) de doublons, ${masquees} fiche(s) ${APPLIQUER ? "masquée(s)" : "à masquer"}` +
			`, ${ecartes} homonyme(s) écarté(s) par le nom japonais ou la race.`
	);
	if (!APPLIQUER) console.log("Simulation — relancer avec --appliquer pour écrire.");
} finally {
	await sql.end({ timeout: 5 });
}
