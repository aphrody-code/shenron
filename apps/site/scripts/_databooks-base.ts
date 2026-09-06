/**
 * Accès partagé de la chaîne databooks : base de données, jeton, chemin des
 * planches.
 *
 * Chaque script de la chaîne re-résolvait ces trois choses pour son compte, et
 * pas tout à fait de la même façon. Le piège est connu et coûteux :
 * `apps/site/.env` porte DEUX lignes `DATABASE_URL`, l'ancienne base Neon
 * (décommissionnée) en commentaire AVANT la locale — un `grep | head -1` tape
 * la base morte. Une seule lecture, ici, ancrée et prenant la DERNIÈRE.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

/** Racine du dépôt (ce fichier vit dans `apps/site/scripts/`). */
export const RACINE_SITE = join(import.meta.dir, "..");

/**
 * Où vivent RÉELLEMENT les images des planches.
 *
 * Le chemin stocké en base (`./assets/wiki/databooks/<uuid>.jpg`) n'est pas un
 * chemin de disque : `serveAsset` (apps/bot) route tout `assets/wiki/*` vers le
 * `public/wiki/` du SITE. Un contrôle d'intégrité mené depuis `apps/bot/`
 * déclare donc des milliers d'images manquantes alors qu'aucune ne l'est.
 */
export const RACINE_PLANCHES = join(RACINE_SITE, "public", "wiki");

/** Chemin de disque d'une image de planche, ou `null` si la forme est inconnue. */
export function cheminPlanche(image: string | null | undefined): string | null {
	const brut = (image ?? "").trim();
	if (!brut) return null;
	const m = /assets\/wiki\/(.+)$/.exec(brut.replace(/\\/g, "/"));
	if (!m) return null;
	return join(RACINE_PLANCHES, m[1]!);
}

/** L'URL de la base du site, lue une seule fois et correctement. */
export async function urlBase(): Promise<string> {
	const direct = process.env.DATABASE_URL?.trim();
	if (direct) return direct;
	const texte = await Bun.file(join(RACINE_SITE, ".env"))
		.text()
		.catch(() => "");
	// La DERNIÈRE ligne active gagne : le fichier garde l'URL Neon d'avant la
	// migration, en commentaire, plus haut.
	const ligne = texte
		.split("\n")
		.filter((l) => /^DATABASE_URL=/.test(l))
		.pop();
	const valeur = ligne?.slice("DATABASE_URL=".length).trim().replace(/^["']|["']$/g, "");
	if (!valeur) {
		throw new Error(
			"DATABASE_URL introuvable : exporte-la, ou vérifie apps/site/.env (ancrage ^DATABASE_URL=)",
		);
	}
	return valeur;
}

/** Une connexion à la base du site. À fermer par l'appelant (`sql.end()`). */
export async function connecte(): Promise<postgres.Sql> {
	return postgres(await urlBase(), { max: 4 });
}

/**
 * Le jeton d'écriture de l'API databooks.
 *
 * Les scripts de dépôt exigeaient qu'on l'exporte à la main avant chaque
 * lancement, alors qu'il est dans `apps/site/.env` à deux pas — une friction
 * pure, qui poussait à recopier le secret dans un shell d'historique.
 */
export async function jetonApi(): Promise<string> {
	const direct = (process.env.DATABOOKS_API_TOKEN ?? process.env.SHENRON_ADMIN_TOKEN ?? "").trim();
	if (direct) return direct;
	const texte = await Bun.file(join(RACINE_SITE, ".env"))
		.text()
		.catch(() => "");
	for (const nom of ["DATABOOKS_API_TOKEN", "SHENRON_ADMIN_TOKEN"]) {
		const ligne = texte
			.split("\n")
			.filter((l) => l.startsWith(`${nom}=`))
			.pop();
		const valeur = ligne?.slice(nom.length + 1).trim().replace(/^["']|["']$/g, "");
		if (valeur) return valeur;
	}
	throw new Error("jeton absent : exporte DATABOOKS_API_TOKEN ou SHENRON_ADMIN_TOKEN");
}

/** Le texte d'une planche, quelle que soit la forme sous laquelle il est stocké. */
export function texteDePlanche(page: unknown): string {
	const t = (page as { text?: unknown })?.text;
	if (typeof t === "string") return t;
	if (t && typeof t === "object" && "markdown" in t) {
		const md = (t as { markdown?: unknown }).markdown;
		return typeof md === "string" ? md : "";
	}
	return "";
}

/** La traduction française d'une planche, si elle en porte une. */
export function traductionDePlanche(page: unknown): string {
	const t = (page as { text_fr?: unknown })?.text_fr;
	if (typeof t === "string") return t;
	if (t && typeof t === "object" && "markdown" in t) {
		const md = (t as { markdown?: unknown }).markdown;
		return typeof md === "string" ? md : "";
	}
	return "";
}

/** Une planche telle qu'elle vit dans le jsonb `pages`. */
export type PlancheBrute = {
	image?: string;
	number?: number | string;
	text?: unknown;
	verifiee?: boolean;
	text_fr?: unknown;
	text_fr_by?: string;
	text_fr_at?: string;
};

/** Un ouvrage, réduit à ce dont la chaîne a besoin. */
export type Ouvrage = {
	id: number;
	title: string | null;
	category: string | null;
	visible: boolean | null;
	cover: string | null;
	pages: PlancheBrute[];
};

/** Charge les ouvrages qui portent des planches, filtrés au besoin. */
export async function chargeOuvrages(
	sql: postgres.Sql,
	filtre: { ids?: number[]; categorie?: string | null } = {},
): Promise<Ouvrage[]> {
	const { ids, categorie } = filtre;
	const lignes = await sql<
		{
			id: string | number;
			title: string | null;
			category: string | null;
			visible: boolean | null;
			cover: string | null;
			pages: PlancheBrute[] | null;
		}[]
	>`
		select id, title, category, visible, cover, pages
		from bot.db_databooks
		where pages is not null
		  ${ids?.length ? sql`and id in ${sql(ids)}` : sql``}
		  ${categorie ? sql`and category = ${categorie}` : sql``}
		order by id`;
	// `Number()` obligatoire : postgres-js rend les bigint en CHAÎNES, et une
	// comparaison lexicographique fait passer "163" pour plus petit que "35".
	return lignes.map((l) => ({
		id: Number(l.id),
		title: l.title,
		category: l.category,
		visible: l.visible,
		cover: l.cover,
		pages: Array.isArray(l.pages) ? l.pages : [],
	}));
}

/** Vrai si le fichier image d'une planche est réellement sur le disque. */
export function imagePresente(page: PlancheBrute): boolean {
	const chemin = cheminPlanche(page.image);
	return chemin !== null && existsSync(chemin);
}
