/**
 * Destinations du menu mobile complet. Cette liste client-safe est partagée
 * avec l'accueil : ajouter une entrée au menu oblige ainsi la home à la voir.
 */
export const MOBILE_PRIMARY_DESTINATIONS = [
	{ href: "/", label: "Accueil" },
	{ href: "/wiki/episodes", label: "Épisodes" },
	{ href: "/wiki/films", label: "Films" },
	{ href: "/wiki", label: "Univers" },
] as const;

export const MOBILE_MORE_DESTINATIONS = [
	{ href: "/wiki/manga", label: "Manga", note: "Tomes et chapitres" },
	{ href: "/wiki/databooks", label: "Databooks", note: "Daizenshuu et guides" },
	{ href: "/wiki/jeux", label: "Jeux", note: "Trente ans d'adaptations" },
	{ href: "/actualites", label: "News", note: "L'actualité de la licence" },
	{ href: "/classements", label: "Classements", note: "Les tops de la communauté" },
	{ href: "/tierlists", label: "Tier lists", note: "Classer et voter" },
	{ href: "/dashboard", label: "Mon espace", note: "Profil, favoris, progression" },
] as const;

export const MOBILE_MENU_DESTINATIONS = [
	...MOBILE_PRIMARY_DESTINATIONS,
	...MOBILE_MORE_DESTINATIONS,
] as const;
