// SPDX-License-Identifier: Apache-2.0

/**
 * Source unique des catégories de l'univers wiki (client-safe — aucun import
 * server-only). Partagée par `WikiCategoryNav` (server, pages d'index) et
 * `UniverseTabs` (client, page Univers) pour éviter la divergence des listes.
 * `countKey` mappe sur `dbUniverse.counts()`.
 *
 * `group` : `"media"` = déjà présent dans la **navbar principale** (SiteNav :
 * Sagas, Films, Épisodes, Manga, Jeux) → on ne le re-liste PAS dans la nav du
 * wiki (sinon doublon avec la sidebar). `"encyclopedia"` = sous-entités SANS
 * entrée propre dans la navbar → ce sont les seules qu'on surface dans l'Univers.
 */
export type WikiCategory = {
	key: string;
	label: string;
	href: string;
	countKey: string;
	group: "encyclopedia" | "media";
};

export const WIKI_CATEGORIES: WikiCategory[] = [
	{ key: "personnages", label: "Personnages", href: "/wiki/personnages", countKey: "characters", group: "encyclopedia" },
	{ key: "planetes", label: "Planètes", href: "/wiki/personnages?tab=planetes", countKey: "planets", group: "encyclopedia" },
	{ key: "races", label: "Races", href: "/wiki/races", countKey: "races", group: "encyclopedia" },
	{ key: "transformations", label: "Transformations", href: "/wiki/transformations", countKey: "transformations", group: "encyclopedia" },
	{ key: "techniques", label: "Techniques", href: "/wiki/dragon-ball/techniques", countKey: "techniques", group: "encyclopedia" },
	{ key: "arcs", label: "Arcs", href: "/wiki/arcs", countKey: "arcs", group: "encyclopedia" },
	{ key: "sagas", label: "Sagas", href: "/wiki/sagas", countKey: "sagas", group: "media" },
	{ key: "films", label: "Films", href: "/wiki/films", countKey: "movies", group: "media" },
	{ key: "episodes", label: "Épisodes", href: "/wiki/episodes", countKey: "episodes", group: "media" },
	{ key: "manga", label: "Manga", href: "/wiki/manga", countKey: "mangaVolumes", group: "media" },
	{ key: "jeux", label: "Jeux", href: "/wiki/jeux", countKey: "games", group: "media" },
	{ key: "databooks", label: "Databooks", href: "/wiki/databooks", countKey: "databooks", group: "media" },
];

/** Catégories à surfacer dans la nav du wiki (hors navbar → pas de doublon). */
export const ENCYCLOPEDIA_CATEGORIES = WIKI_CATEGORIES.filter((c) => c.group === "encyclopedia");
