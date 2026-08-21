import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { db } from "@/lib/db";
import { posts } from "@/db/schema";
import {
	botEpisodes,
	botMovies,
	botMangaVolumes,
	botMangaChapters,
	botSagas,
	botArcs,
	botGames,
	botCharacters,
	botPlanets,
	botRaces,
	botTechniques,
	botDatabooks,
} from "@/db/bot-schema";
import { eq } from "drizzle-orm";
import { publicPostFilter } from "@/lib/posts";
import { getLaunchConfig } from "@/lib/wiki-launch-config";
import { isPathPublic, type AccessSnapshot } from "@/lib/wiki-launch";
import { isDatabookIndexable } from "@/lib/databooks-rules";

export const revalidate = 86400; // Cache le sitemap pendant 24 heures

/**
 * Sitemap **dérivé de la configuration d'accès réelle** (`public."WikiLaunch"`),
 * et non d'une liste écrite en dur.
 *
 * L'ancienne version figeait la liste bêta (episodes/films/manga/chronologie) en
 * constante. Le gating ayant migré en base, les deux ont divergé : au 2026-08-21,
 * `/wiki/sagas` (33 sagas) et `/wiki/jeux` (58 jeux) répondaient 200 en
 * production sans qu'aucune de leurs URL ne figure au sitemap — une centaine de
 * pages publiques invisibles de Google, et une régression garantie à chaque
 * ouverture de rubrique. Ici, ouvrir une rubrique depuis /admin/lancement la fait
 * entrer au sitemap à la revalidation suivante, sans toucher au code.
 *
 * `isPathPublic` est la MÊME fonction que celle qui décide d'émettre un lien
 * dans les pages : ce qu'on déclare à Google est ce qu'un anonyme obtient.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const cfg = await getLaunchConfig().catch(() => null);
	// Sans config lisible, on retombe sur « rien de /wiki » plutôt que de publier
	// des URL qui redirigeraient : un sitemap plein de 307 abîme le crawl.
	const snapshot: AccessSnapshot = cfg ?? { openKeys: [], access: {} };
	const isPublic = (path: string) => isPathPublic(path, snapshot);

	const entries: MetadataRoute.Sitemap = [];
	const push = (
		path: string,
		priority: number,
		changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly",
		lastModified: Date = new Date()
	) => {
		if (!isPublic(path)) return;
		entries.push({ url: `${SITE_URL}${path}`, lastModified, changeFrequency, priority });
	};

	// ── Pages fixes ───────────────────────────────────────────────────────────
	// Hors registre (mentions légales, à propos…) → `isPathPublic` les laisse
	// passer ; celles qui appartiennent à une rubrique sont filtrées comme le reste.
	push("", 1.0, "daily");
	for (const p of ["/about", "/credits", "/licence", "/confidentialite"]) push(p, 0.4, "monthly");
	push("/actualites", 0.8, "daily");
	for (const p of [
		"/jeux",
		"/jeux/2048",
		"/jeux/bingo",
		"/jeux/morpion",
		"/jeux/pfc",
		"/leaderboard",
		"/classements",
		"/personas",
		"/commands",
		"/stats",
		"/shop",
		"/ask",
	]) {
		push(p, 0.5);
	}
	for (const p of [
		"/wiki/episodes",
		"/wiki/films",
		"/wiki/chronologie",
		"/wiki/manga",
		"/wiki/sagas",
		"/wiki/arcs",
		"/wiki/jeux",
		"/wiki/personnages",
		"/wiki/races",
		"/wiki/transformations",
		"/wiki/dragon-ball/techniques",
		"/wiki/databooks",
	]) {
		push(p, 0.8);
	}

	// ── Entités ───────────────────────────────────────────────────────────────
	// Chaque bloc est indépendant : une table en échec ne doit pas vider tout le
	// sitemap. `visible` est filtré ici comme dans les pages publiques — un
	// contenu masqué en base ne doit jamais être annoncé à Google.
	const sec = (v: number | null) => (v ? new Date(Number(v) * 1000) : new Date());

	await Promise.all([
		block(entries, isPublic, async () => {
			const rows = await db
				.select({ id: botEpisodes.id, series: botEpisodes.series, airDate: botEpisodes.airDate })
				.from(botEpisodes)
				.where(eq(botEpisodes.visible, true));
			const out: Array<[string, number, Date]> = [];
			const series = new Set<string>();
			for (const r of rows) {
				out.push([`/wiki/episodes/${r.id}`, 0.6, sec(r.airDate)]);
				if (r.series) series.add(r.series);
			}
			for (const s of series) out.push([`/wiki/episodes/serie/${s}`, 0.7, new Date()]);
			return out;
		}),
		block(entries, isPublic, async () => {
			const rows = await db
				.select({ slug: botMovies.slug, releaseDate: botMovies.releaseDate })
				.from(botMovies)
				.where(eq(botMovies.visible, true));
			return rows.map((m) => [`/wiki/films/${m.slug}`, 0.7, sec(m.releaseDate)] as const);
		}),
		block(entries, isPublic, async () => {
			const vols = await db
				.select({ id: botMangaVolumes.id, publishedAt: botMangaVolumes.publishedAt })
				.from(botMangaVolumes)
				.where(eq(botMangaVolumes.visible, true));
			return vols.map((v) => [`/wiki/manga/volume/${v.id}`, 0.6, sec(v.publishedAt)] as const);
		}),
		block(entries, isPublic, async () => {
			const chaps = await db
				.select({ id: botMangaChapters.id, publishedAt: botMangaChapters.publishedAt })
				.from(botMangaChapters)
				.where(eq(botMangaChapters.visible, true));
			return chaps.map((c) => [`/wiki/manga/${c.id}`, 0.6, sec(c.publishedAt)] as const);
		}),
		block(entries, isPublic, async () => {
			const rows = await db
				.select({ slug: botSagas.slug })
				.from(botSagas)
				.where(eq(botSagas.visible, true));
			return rows.map((r) => [`/wiki/sagas/${r.slug}`, 0.7, new Date()] as const);
		}),
		block(entries, isPublic, async () => {
			const rows = await db
				.select({ slug: botArcs.slug })
				.from(botArcs)
				.where(eq(botArcs.visible, true));
			return rows.map((r) => [`/wiki/arcs/${r.slug}`, 0.6, new Date()] as const);
		}),
		block(entries, isPublic, async () => {
			const rows = await db
				.select({ slug: botGames.slug })
				.from(botGames)
				.where(eq(botGames.visible, true));
			return rows.map((r) => [`/wiki/jeux/${r.slug}`, 0.6, new Date()] as const);
		}),
		block(entries, isPublic, async () => {
			const rows = await db
				.select({ id: botCharacters.id })
				.from(botCharacters)
				.where(eq(botCharacters.visible, true));
			return rows.map((r) => [`/wiki/dragon-ball/character/${r.id}`, 0.6, new Date()] as const);
		}),
		block(entries, isPublic, async () => {
			const rows = await db
				.select({ id: botPlanets.id })
				.from(botPlanets)
				.where(eq(botPlanets.visible, true));
			return rows.map((r) => [`/wiki/dragon-ball/planet/${r.id}`, 0.5, new Date()] as const);
		}),
		block(entries, isPublic, async () => {
			const rows = await db
				.select({ slug: botRaces.slug })
				.from(botRaces)
				.where(eq(botRaces.visible, true));
			return rows.map((r) => [`/wiki/races/${r.slug}`, 0.5, new Date()] as const);
		}),
		block(entries, isPublic, async () => {
			const rows = await db
				.select({ slug: botTechniques.slug })
				.from(botTechniques)
				.where(eq(botTechniques.visible, true));
			return rows.map((r) => [`/wiki/dragon-ball/techniques/${r.slug}`, 0.5, new Date()] as const);
		}),
		block(entries, isPublic, async () => {
			// On n'annonce pas une fiche vide. 21 des 318 databooks n'ont ni planche
			// ni description — les lister, c'est promettre à un moteur un contenu
			// qui n'existe pas. `isDatabookIndexable` gouverne aussi le `robots` de
			// la page : le sitemap et la balise disent la même chose, par
			// construction. Le jour où la transcription arrive, la fiche revient.
			const rows = await db
				.select({
					id: botDatabooks.id,
					description: botDatabooks.description,
					pages: botDatabooks.pages,
				})
				.from(botDatabooks)
				.where(eq(botDatabooks.visible, true));
			return rows
				.filter((r) => isDatabookIndexable(r as never))
				.map((r) => [`/wiki/databooks/${r.id}`, 0.5, new Date()] as const);
		}),
		// Journal : `publicPostFilter()` et non `published = true` — un article
		// programmé est « publié » avec une date future, le lister l'exposerait
		// avant l'heure.
		block(entries, isPublic, async () => {
			const rows = await db
				.select({ slug: posts.slug, updatedAt: posts.updatedAt, tags: posts.tags })
				.from(posts)
				.where(publicPostFilter());
			const out: Array<readonly [string, number, Date]> = rows.map(
				(p) =>
					[`/actualites/${p.slug}`, 0.8, p.updatedAt ? new Date(p.updatedAt) : new Date()] as const
			);
			// Une page de thème n'est référencée que si elle a du contenu.
			const tags = new Set<string>();
			for (const p of rows) for (const t of p.tags ?? []) tags.add(t.toLowerCase());
			for (const tag of tags) {
				out.push([`/actualites/theme/${encodeURIComponent(tag)}`, 0.5, new Date()] as const);
			}
			return out;
		}),
	]);

	return entries;
}

/**
 * Exécute un bloc de collecte et pousse ses URL, en absorbant son échec : une
 * table injoignable ne doit pas amputer le sitemap des autres.
 */
async function block(
	entries: MetadataRoute.Sitemap,
	isPublic: (path: string) => boolean,
	fn: () => Promise<ReadonlyArray<readonly [string, number, Date]>>
): Promise<void> {
	try {
		for (const [path, priority, lastModified] of await fn()) {
			if (!isPublic(path)) continue;
			entries.push({
				url: `${SITE_URL}${path}`,
				lastModified,
				changeFrequency: "weekly",
				priority,
			});
		}
	} catch (error) {
		console.error("[sitemap] bloc ignoré :", error);
	}
}
