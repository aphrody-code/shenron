// Pool de scènes cinématiques de la home — curé à la main pour le contrôle
// visuel (les "key art" de sagas en DB sont des artworks de personnages, pas des
// plans larges, donc on les met en scène : ken-burns + color grade + grain +
// aura d'énergie par ère). Client-safe : zéro import server-only, juste des
// constantes consommées par les composants de la home (RSC + îlots client).
//
// Les chemins sont relatifs `./assets/...` → passés par `assetUrl()` côté rendu
// pour pointer sur le CDN bot (`bot.dragonballfr.com`).

export type Era =
	| "origin"
	| "saiyan"
	| "namek"
	| "android"
	| "buu"
	| "divine"
	| "summon";

export interface HomeScene {
	readonly id: string;
	readonly image: string;
	readonly video?: string;
	readonly title: string;
	readonly kicker: string;
	readonly era: Era;
	/** Accent OKLCH d'ère — pilote grade, aura, lueurs. */
	readonly accent: string;
}

/** Accent par ère (OKLCH, accordé sur la palette dbz-* du repo). */
export const ERA_ACCENT: Record<Era, string> = {
	origin: "oklch(0.78 0.17 65)", // or chaud — bâton magique / Dragon Ball
	saiyan: "oklch(0.72 0.2 35)", // rouge saiyan / armure
	namek: "oklch(0.8 0.18 150)", // vert namek / ki
	android: "oklch(0.72 0.16 250)", // bleu cybernétique
	buu: "oklch(0.7 0.22 350)", // magenta majin
	divine: "oklch(0.75 0.17 300)", // violet hakaï
	summon: "oklch(0.82 0.19 145)", // émeraude Shenron
};

/**
 * Scènes héro — rotation lente en fond du premier panneau (crossfade ken-burns).
 * Ordre = parcours chronologique de l'univers, du bâton magique à la divinité.
 */
export const HERO_SCENES: readonly HomeScene[] = [
	{
		id: "goku-origin",
		image: "./assets/dbz/characters/goku_normal.webp",
		video: "/wiki/gokupiccolojr.mp4",
		title: "Son Goku",
		kicker: "L'enfant venu des étoiles",
		era: "origin",
		accent: ERA_ACCENT.origin,
	},
	{
		id: "vegeta-saiyan",
		image: "./assets/dbz/characters/vegeta_normal.webp",
		video: "/wiki/vegetagokukaioken.mp4",
		title: "Vegeta",
		kicker: "Le prince des Saiyans",
		era: "saiyan",
		accent: ERA_ACCENT.saiyan,
	},
	{
		id: "freezer-namek",
		image: "./assets/dbz/characters/Freezer.webp",
		video: "/wiki/freezergoku2.mp4",
		title: "Freezer",
		kicker: "L'empereur de l'univers",
		era: "namek",
		accent: ERA_ACCENT.namek,
	},
	{
		id: "c17-android",
		image: "./assets/dbz/characters/17_Artwork.webp",
		video: "/wiki/trunks.mp4",
		title: "C-17",
		kicker: "La menace cybernétique",
		era: "android",
		accent: ERA_ACCENT.android,
	},
	{
		id: "buu-majin",
		image: "./assets/dbz/characters/BuuGordo_Universo7.webp",
		video: "/wiki/kidbuu.mp4",
		title: "Majin Boo",
		kicker: "La terreur née de la magie",
		era: "buu",
		accent: ERA_ACCENT.buu,
	},
	{
		id: "beerus-divine",
		image: "./assets/dbz/characters/Beerus_DBS_Broly_Artwork.webp",
		video: "/wiki/beerus.mp4",
		title: "Beerus",
		kicker: "Le dieu de la destruction",
		era: "divine",
		accent: ERA_ACCENT.divine,
	},
	{
		id: "broly-legend",
		image: "./assets/dbz/characters/Broly_DBS_Base.webp",
		video: "/wiki/ssjba.mp4",
		title: "Broly",
		kicker: "Le Super Saiyan légendaire",
		era: "saiyan",
		accent: ERA_ACCENT.saiyan,
	},
];

/** Fond dédié par section (id de section → scène). */
export const SECTION_SCENE: Record<string, HomeScene> = {
	universe: {
		id: "gohan-universe",
		image: "./assets/dbz/characters/gohan.webp",
		video: "/wiki/cellgoku.mp4",
		title: "L'anthologie",
		kicker: "Tout l'univers Dragon Ball",
		era: "namek",
		accent: ERA_ACCENT.namek,
	},
	guardians: {
		id: "beerus-guardians",
		image: "./assets/dbz/characters/Beerus_DBS_Broly_Artwork.webp",
		video: "/wiki/gfokufreezerjiren.mp4",
		title: "Les gardiens",
		kicker: "Six divinités, un seul serveur",
		era: "divine",
		accent: ERA_ACCENT.divine,
	},
	community: {
		id: "vegeta-community",
		image: "./assets/dbz/characters/vegeta_normal.webp",
		video: "/wiki/majinvegeta.mp4",
		title: "La communauté",
		kicker: "Des milliers de guerriers",
		era: "saiyan",
		accent: ERA_ACCENT.saiyan,
	},
	play: {
		id: "goku-play",
		image: "./assets/dbz/characters/goku_normal.webp",
		video: "/wiki/gokussj4daima.mp4",
		title: "Le terrain",
		kicker: "Jeux, économie, fusions",
		era: "origin",
		accent: ERA_ACCENT.origin,
	},
	summon: {
		id: "shenron-summon",
		image: "./assets/dbz/characters/picolo_normal.webp",
		video: "/wiki/gloorio.mp4",
		title: "L'invocation",
		kicker: "Fais ton vœu",
		era: "summon",
		accent: ERA_ACCENT.summon,
	},
};
