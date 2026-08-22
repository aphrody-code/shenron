import "server-only";

/**
 * Transcriptions de databooks — suivi de progression et recherche des planches.
 *
 * Deux besoins que la rubrique ne couvrait pas :
 *
 *  1. **Suivre.** La progression n'existait nulle part : le tableau
 *     `/admin/db-universe/databooks` affiche un total de planches, pas ce qui
 *     est transcrit, ni où il reste du travail, ni à quel rythme il avance.
 *  2. **Chercher.** Le texte des planches vit dans le jsonb `pages` et
 *     n'était atteignable par aucune requête — mesuré le 2026-08-22, une phrase
 *     japonaise pourtant présente dans une planche remontait 0 résultat.
 *     `bot.databook_pages_text()` + l'index trigramme `db_databooks_pages_text_trgm`
 *     (cf. `src/db/bot-indexes.sql`) y répondent ; ce module est leur seul appelant.
 *
 * Tout est agrégé côté Postgres. Charger 11 775 planches en mémoire pour les
 * compter en JavaScript coûterait les ~9,5 Mo du jsonb à chaque rendu.
 */
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

/** Progression d'un ouvrage. */
export interface ProgressionFiche {
	id: number;
	titre: string;
	titreJa: string | null;
	categorie: string | null;
	kind: string;
	cover: string | null;
	visible: boolean;
	planches: number;
	transcrites: number;
	avecImage: number;
	/** Planches contenant le caractère de remplacement U+FFFD (OCR en échec). */
	suspectes: number;
	/** Signes de texte transcrit, tous slots confondus. */
	signes: number;
	/** Dernier dépôt ou édition connu (via `public.wiki_revisions`). */
	derniereEdition: Date | null;
}

export interface ProgressionGlobale {
	fiches: ProgressionFiche[];
	total: {
		fiches: number;
		planches: number;
		transcrites: number;
		avecImage: number;
		suspectes: number;
		signes: number;
	};
	/** Nombre de planches transcrites par jour, du plus ancien au plus récent. */
	rythme: { jour: string; revisions: number }[];
}

/**
 * Progression de toutes les fiches, avec la date de dernière écriture.
 *
 * Une fiche sans aucune planche est incluse : c'est justement le signal qu'il
 * n'y a pas encore de scans à transcrire, et l'écraser dans un filtre
 * masquerait 21 fiches qui n'ont ni planche ni description.
 */
export async function progressionTranscription(): Promise<ProgressionGlobale> {
	const lignes = await db.execute<{
		id: string;
		titre: string;
		titre_ja: string | null;
		categorie: string | null;
		kind: string;
		cover: string | null;
		visible: boolean;
		planches: number;
		transcrites: number;
		avec_image: number;
		suspectes: number;
		signes: number;
		derniere_edition: Date | null;
	}>(sql`
		SELECT
			d.id,
			d.title            AS titre,
			d.title_ja         AS titre_ja,
			d.category         AS categorie,
			d.kind,
			d.cover,
			coalesce(d.visible, true) AS visible,
			coalesce(jsonb_array_length(
				CASE WHEN jsonb_typeof(d.pages) = 'array' THEN d.pages ELSE '[]'::jsonb END
			), 0)::int AS planches,
			count(p) FILTER (WHERE nullif(btrim(p ->> 'text'), '') IS NOT NULL)::int  AS transcrites,
			count(p) FILTER (WHERE nullif(btrim(p ->> 'image'), '') IS NOT NULL)::int AS avec_image,
			count(p) FILTER (WHERE p ->> 'text' LIKE '%' || U&'\FFFD' || '%')::int     AS suspectes,
			coalesce(sum(length(p ->> 'text')), 0)::int                               AS signes,
			r.derniere_edition
		FROM bot.db_databooks d
		LEFT JOIN LATERAL jsonb_array_elements(
			CASE WHEN jsonb_typeof(d.pages) = 'array' THEN d.pages ELSE '[]'::jsonb END
		) AS p ON true
		LEFT JOIN LATERAL (
			SELECT max(w."createdAt") AS derniere_edition
			FROM public.wiki_revisions w
			WHERE w."tableName" = 'db_databooks' AND w."rowId" = d.id::text
		) r ON true
		GROUP BY d.id, d.title, d.title_ja, d.category, d.kind, d.cover, d.visible,
		         d.pages, r.derniere_edition
		ORDER BY d.title
	`);

	const fiches: ProgressionFiche[] = lignes.map((l) => ({
		id: Number(l.id),
		titre: l.titre,
		titreJa: l.titre_ja,
		categorie: l.categorie,
		kind: l.kind,
		cover: l.cover,
		visible: l.visible !== false,
		planches: Number(l.planches),
		transcrites: Number(l.transcrites),
		avecImage: Number(l.avec_image),
		suspectes: Number(l.suspectes),
		signes: Number(l.signes),
		derniereEdition: l.derniere_edition ? new Date(l.derniere_edition) : null,
	}));

	const total = fiches.reduce(
		(acc, f) => ({
			fiches: acc.fiches + 1,
			planches: acc.planches + f.planches,
			transcrites: acc.transcrites + f.transcrites,
			avecImage: acc.avecImage + f.avecImage,
			suspectes: acc.suspectes + f.suspectes,
			signes: acc.signes + f.signes,
		}),
		{ fiches: 0, planches: 0, transcrites: 0, avecImage: 0, suspectes: 0, signes: 0 }
	);

	return { fiches, total, rythme: await rythmeRecent() };
}

/**
 * Dépôts par jour sur les 30 derniers jours.
 *
 * Compte les **révisions**, pas les planches : `wiki_revisions` garde un
 * instantané complet de la fiche, pas un delta par planche. Un point de la
 * courbe est donc « un lot déposé », l'unité réelle du travail en cours.
 */
async function rythmeRecent(): Promise<{ jour: string; revisions: number }[]> {
	const lignes = await db.execute<{ jour: string; n: number }>(sql`
		SELECT to_char(date_trunc('day', w."createdAt"), 'YYYY-MM-DD') AS jour,
		       count(*)::int AS n
		FROM public.wiki_revisions w
		WHERE w."tableName" = 'db_databooks'
		  AND w."createdAt" >= now() - interval '30 days'
		GROUP BY 1
		ORDER BY 1
	`);
	return lignes.map((l) => ({ jour: l.jour, revisions: Number(l.n) }));
}

/** Une planche qui répond à une recherche. */
export interface PlancheTrouvee {
	databookId: number;
	titre: string;
	categorie: string | null;
	cover: string | null;
	numero: number;
	image: string | null;
	texte: string;
}

export interface RechercheResultat {
	items: PlancheTrouvee[];
	/** Planches correspondantes au total (avant `limit`). */
	total: number;
	/** Fiches distinctes concernées. */
	fiches: number;
}

/** Neutralise les jokers `LIKE` d'un terme saisi par l'utilisateur. */
function echapperLike(terme: string): string {
	return terme.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/**
 * Cherche une chaîne dans le texte des planches.
 *
 * Sous-chaîne (`ILIKE`) et non plein texte : le corpus est majoritairement
 * japonais, une langue sans espaces que `to_tsvector` ne sait pas segmenter —
 * il en fait un lexème unique par séquence contiguë, donc chercher un mot
 * interne ne peut rien trouver. L'index trigramme, lui, découpe par caractères.
 *
 * Conséquence assumée : un terme de moins de 3 caractères ne peut pas utiliser
 * l'index (un trigramme en fait 3) et déclenche un balayage. Sur 318 fiches et
 * ~9,5 Mo de texte, la requête reste de l'ordre de la centaine de millisecondes.
 */
export async function chercherDansPlanches(
	terme: string,
	opts: { limit?: number; includeHidden?: boolean; databookId?: number } = {}
): Promise<RechercheResultat> {
	const cible = terme.trim();
	if (!cible) return { items: [], total: 0, fiches: 0 };

	const limit = Math.min(200, Math.max(1, opts.limit ?? 50));
	const motif = `%${echapperLike(cible)}%`;
	const visibles = opts.includeHidden ? sql`true` : sql`coalesce(d.visible, true)`;
	const uneFiche = opts.databookId
		? sql`AND d.id = ${opts.databookId}`
		: sql``;

	const lignes = await db.execute<{
		id: string;
		titre: string;
		categorie: string | null;
		cover: string | null;
		numero: number;
		image: string | null;
		texte: string;
		total: number;
		fiches: number;
	}>(sql`
		WITH candidats AS (
			-- Filtre porté par l'index trigramme : ne déroule les planches que des
			-- fiches qui contiennent réellement le terme.
			SELECT d.id, d.title, d.category, d.cover, d.pages
			FROM bot.db_databooks d
			WHERE ${visibles}
			  ${uneFiche}
			  AND bot.databook_pages_text(d.pages) ILIKE ${motif}
		),
		trouvees AS (
			-- Alias en français : le mapping TypeScript lit titre/categorie.
			-- Sans eux, SELECT t.* sort title/category et les deux champs
			-- arrivaient undefined côté client — vu en production.
			SELECT c.id, c.title AS titre, c.category AS categorie, c.cover,
			       coalesce((p ->> 'number')::int, ord::int) AS numero,
			       nullif(btrim(p ->> 'image'), '') AS image,
			       p ->> 'text' AS texte
			FROM candidats c,
			     LATERAL jsonb_array_elements(c.pages) WITH ORDINALITY AS t(p, ord)
			WHERE p ->> 'text' ILIKE ${motif}
		),
		-- count(DISTINCT ...) OVER () n'existe pas en fenêtre sous PostgreSQL :
		-- les totaux passent par un CTE d'agrégat joint à chaque ligne.
		compte AS (
			SELECT count(*)::int AS total, count(DISTINCT id)::int AS fiches FROM trouvees
		)
		SELECT t.*, c.total, c.fiches
		FROM trouvees t CROSS JOIN compte c
		ORDER BY t.titre, t.numero
		LIMIT ${limit}
	`);

	return {
		items: lignes.map((l) => ({
			databookId: Number(l.id),
			titre: l.titre,
			categorie: l.categorie,
			cover: l.cover,
			numero: Number(l.numero),
			image: l.image,
			texte: l.texte,
		})),
		total: lignes.length > 0 ? Number(lignes[0].total) : 0,
		fiches: lignes.length > 0 ? Number(lignes[0].fiches) : 0,
	};
}
