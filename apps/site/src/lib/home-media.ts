// SPDX-License-Identifier: Apache-2.0
/**
 * Pool média + atlas des destinations de la home.
 * Client-safe (pas d'import server-only) — scènes vidéo taguées par ère,
 * destinations site, helpers de tirage aléatoire pour une immersion
 * différente à chaque visite.
 */
import {
	ERA_ACCENT,
	type Era,
	type HomeScene,
	HERO_SCENES,
	SECTION_SCENE,
} from "@/lib/home-scenes";

/** Carte média featured (épisodes, films, jeux…) — type partagé RSC ↔ client. */
export interface FeaturedCard {
	id: number | string;
	href: string;
	title: string;
	subtitle?: string | null;
	image: string | null;
	badge?: string | null;
}

/** Destination cliquable dans l'atlas / les rails. */
export interface HomeDestination {
	readonly id: string;
	readonly href: string;
	readonly label: string;
	readonly kanji: string;
	readonly hint: string;
	readonly era: Era;
	/** Groupe pour sous-sections. */
	readonly group: "wiki" | "media" | "lore" | "play" | "community";
	/** Scène vidéo/image d'ambiance associée. */
	readonly sceneId?: string;
}

/** Tous les points d'entrée du site visibles depuis la home. */
export const HOME_DESTINATIONS: readonly HomeDestination[] = [
	// ── Wiki / lore ──────────────────────────────────────────────────────────
	{
		id: "personnages",
		href: "/wiki/personnages",
		label: "Personnages",
		kanji: "戦士",
		hint: "Saiyans, dieux, démons",
		era: "saiyan",
		group: "lore",
		sceneId: "characters-section",
	},
	{
		id: "sagas",
		href: "/wiki/sagas",
		label: "Sagas",
		kanji: "物語",
		hint: "Arc après arc",
		era: "namek",
		group: "lore",
		sceneId: "sagas-section",
	},
	{
		id: "planetes",
		href: "/wiki/cosmologie",
		label: "Cosmologie",
		kanji: "星",
		hint: "Namek, Terre, Yardrat…",
		era: "namek",
		group: "lore",
	},
	{
		id: "races",
		href: "/wiki/races",
		label: "Races",
		kanji: "種族",
		hint: "Saiyans, Namekians…",
		era: "saiyan",
		group: "lore",
	},
	{
		id: "transformations",
		href: "/wiki/transformations",
		label: "Transformations",
		kanji: "変",
		hint: "SSJ, God, Ultra Instinct",
		era: "divine",
		group: "lore",
	},
	{
		id: "techniques",
		href: "/wiki/techniques",
		label: "Techniques",
		kanji: "技",
		hint: "Kamehameha, Final Flash…",
		era: "origin",
		group: "lore",
	},
	{
		id: "arcs",
		href: "/wiki/arcs",
		label: "Arcs",
		kanji: "章",
		hint: "Découpage fin des sagas",
		era: "android",
		group: "lore",
	},
	{
		id: "chronologie",
		href: "/wiki/chronologie",
		label: "Chronologie",
		kanji: "時",
		hint: "La frise complète",
		era: "divine",
		group: "lore",
	},
	// ── Media ────────────────────────────────────────────────────────────────
	{
		id: "episodes",
		href: "/wiki/episodes",
		label: "Épisodes",
		kanji: "話",
		hint: "DB · Z · GT · Super · Daima",
		era: "origin",
		group: "media",
		sceneId: "goku-origin",
	},
	{
		id: "films",
		href: "/wiki/films",
		label: "Films",
		kanji: "映",
		hint: "Les longs métrages",
		era: "saiyan",
		group: "media",
		sceneId: "broly-legend",
	},
	{
		id: "manga",
		href: "/wiki/manga",
		label: "Manga",
		kanji: "漫",
		hint: "Tomes & chapitres",
		era: "origin",
		group: "media",
	},
	{
		id: "databooks",
		href: "/wiki/databooks",
		label: "Databooks",
		kanji: "書",
		hint: "Interviews & guides",
		era: "android",
		group: "media",
	},
	{
		id: "jeux-wiki",
		href: "/wiki/jeux",
		label: "Jeux vidéo",
		kanji: "遊",
		hint: "FighterZ, Dokkan, Legends…",
		era: "android",
		group: "media",
		sceneId: "goku-play",
	},
	// ── Terrain / communauté ─────────────────────────────────────────────────
	{
		id: "mini-jeux",
		href: "/jeux",
		label: "Mini-jeux",
		kanji: "闘",
		hint: "2048, morpion, pendu…",
		era: "origin",
		group: "play",
	},
	{
		id: "shop",
		href: "/shop",
		label: "Boutique zéni",
		kanji: "商",
		hint: "Rôles, cartes, fusions",
		era: "buu",
		group: "play",
	},
	{
		id: "leaderboard",
		href: "/leaderboard",
		label: "Classement",
		kanji: "番付",
		hint: "Les plus puissants",
		era: "saiyan",
		group: "community",
	},
	{
		id: "profil",
		href: "/profil",
		label: "Profil",
		kanji: "身",
		hint: "Ta carte de combat",
		era: "saiyan",
		group: "community",
	},
	{
		id: "personas",
		href: "/personas",
		label: "Gardiens",
		kanji: "神",
		hint: "Six personas Discord",
		era: "divine",
		group: "community",
	},
	{
		id: "news",
		href: "/actualites",
		label: "Actualités",
		kanji: "報",
		hint: "News de la communauté",
		era: "divine",
		group: "community",
	},
	{
		id: "commands",
		href: "/commands",
		label: "Commandes",
		kanji: "令",
		hint: "Le grimoire du bot",
		era: "summon",
		group: "community",
	},
	{
		id: "stats",
		href: "/stats",
		label: "Stats live",
		kanji: "数",
		hint: "Chiffres en direct",
		era: "android",
		group: "community",
	},
	{
		id: "tierlists",
		href: "/tierlists",
		label: "Tierlists",
		kanji: "階",
		hint: "Classe les guerriers",
		era: "buu",
		group: "play",
	},
];

export const ATLAS_GROUPS: readonly {
	id: HomeDestination["group"];
	label: string;
	kanji: string;
}[] = [
	{ id: "lore", label: "L'encyclopédie", kanji: "百科" },
	{ id: "media", label: "Anime & médias", kanji: "映像" },
	{ id: "play", label: "Le terrain", kanji: "遊" },
	{ id: "community", label: "Communauté", kanji: "仲間" },
];

/** Clip vidéo tagué (tous les plans wiki connus). */
export interface TaggedClip extends HomeScene {
	readonly tags: readonly string[];
}

/**
 * Catalogue immersif — chaque clip porte une ère + tags pour le matching
 * section → média « qui correspond vraiment ».
 */
export const TAGGED_CLIPS: readonly TaggedClip[] = [
	{
		id: "clip-goku-origin",
		image: "/wiki/gokupiccolojr.poster.webp",
		poster: "/wiki/gokupiccolojr.poster.webp",
		video: "/wiki/gokupiccolojr.mp4",
		title: "Goku vs Piccolo",
		kicker: "Les origines",
		era: "origin",
		accent: ERA_ACCENT.origin,
		tags: ["origin", "combat", "episodes", "personnages", "hero"],
	},
	{
		id: "clip-taopaipai",
		image: "/wiki/taopaipai.poster.webp",
		poster: "/wiki/taopaipai.poster.webp",
		video: "/wiki/taopaipai.mp4",
		title: "Tao Pai Pai",
		kicker: "L'assassin",
		era: "origin",
		accent: ERA_ACCENT.origin,
		tags: ["origin", "personnages", "combat"],
	},
	{
		id: "clip-tenshinhan",
		image: "/wiki/tenshihan.poster.webp",
		poster: "/wiki/tenshihan.poster.webp",
		video: "/wiki/tenshihan.mp4",
		title: "Tenshinhan",
		kicker: "Arts martiaux",
		era: "origin",
		accent: ERA_ACCENT.origin,
		tags: ["origin", "personnages", "play"],
	},
	{
		id: "clip-vegeta-kaioken",
		image: "/wiki/vegetagokukaioken.poster.webp",
		poster: "/wiki/vegetagokukaioken.poster.webp",
		video: "/wiki/vegetagokukaioken.mp4",
		title: "Goku vs Vegeta",
		kicker: "Kaio-ken",
		era: "saiyan",
		accent: ERA_ACCENT.saiyan,
		tags: ["saiyan", "combat", "sagas", "bestof", "personnages", "hero"],
	},
	{
		id: "clip-raditz",
		image: "/wiki/radditz.poster.webp",
		poster: "/wiki/radditz.poster.webp",
		video: "/wiki/radditz.mp4",
		title: "Raditz",
		kicker: "L'invasion saiyan",
		era: "saiyan",
		accent: ERA_ACCENT.saiyan,
		tags: ["saiyan", "sagas", "personnages", "episodes"],
	},
	{
		id: "clip-bardock",
		image: "/wiki/bardock.poster.webp",
		poster: "/wiki/bardock.poster.webp",
		video: "/wiki/bardock.mp4",
		title: "Bardock",
		kicker: "Le père de Goku",
		era: "saiyan",
		accent: ERA_ACCENT.saiyan,
		tags: ["saiyan", "films", "personnages", "sagas"],
	},
	{
		id: "clip-freezer",
		image: "/wiki/freezergoku2.poster.webp",
		poster: "/wiki/freezergoku2.poster.webp",
		video: "/wiki/freezergoku2.mp4",
		title: "Goku vs Freezer",
		kicker: "Namek",
		era: "namek",
		accent: ERA_ACCENT.namek,
		tags: ["namek", "combat", "sagas", "bestof", "planetes", "hero"],
	},
	{
		id: "clip-ginyu",
		image: "/wiki/guldo.poster.webp",
		poster: "/wiki/guldo.poster.webp",
		video: "/wiki/guldo.mp4",
		title: "Commando Ginyu",
		kicker: "Namek",
		era: "namek",
		accent: ERA_ACCENT.namek,
		tags: ["namek", "personnages", "sagas", "episodes"],
	},
	{
		id: "clip-burter",
		image: "/wiki/buuttajeice.poster.webp",
		poster: "/wiki/buuttajeice.poster.webp",
		video: "/wiki/buuttajeice.mp4",
		title: "Burter & Jeice",
		kicker: "Ginyu Force",
		era: "namek",
		accent: ERA_ACCENT.namek,
		tags: ["namek", "combat", "personnages"],
	},
	{
		id: "clip-trunks",
		image: "/wiki/trunks.poster.webp",
		poster: "/wiki/trunks.poster.webp",
		video: "/wiki/trunks.mp4",
		title: "Trunks",
		kicker: "Le futur sombre",
		era: "android",
		accent: ERA_ACCENT.android,
		tags: ["android", "sagas", "personnages", "films", "episodes"],
	},
	{
		id: "clip-cell",
		image: "/wiki/cellgoku.poster.webp",
		poster: "/wiki/cellgoku.poster.webp",
		video: "/wiki/cellgoku.mp4",
		title: "Cell Games",
		kicker: "Goku vs Cell",
		era: "android",
		accent: ERA_ACCENT.android,
		tags: ["android", "combat", "bestof", "sagas", "universe", "pantheon"],
	},
	{
		id: "clip-miraigohan",
		image: "/wiki/miraigohan.poster.webp",
		poster: "/wiki/miraigohan.poster.webp",
		video: "/wiki/miraigohan.mp4",
		title: "Gohan du futur",
		kicker: "Dernier rempart",
		era: "android",
		accent: ERA_ACCENT.android,
		tags: ["android", "personnages", "sagas", "community"],
	},
	{
		id: "clip-super17",
		image: "/wiki/sc17.poster.webp",
		poster: "/wiki/sc17.poster.webp",
		video: "/wiki/sc17.mp4",
		title: "Super C-17",
		kicker: "Fusion cyber",
		era: "android",
		accent: ERA_ACCENT.android,
		tags: ["android", "personnages", "sagas", "jeux"],
	},
	{
		id: "clip-majin-vegeta",
		image: "/wiki/majinvegeta.poster.webp",
		poster: "/wiki/majinvegeta.poster.webp",
		video: "/wiki/majinvegeta.mp4",
		title: "Majin Vegeta",
		kicker: "Fierté saiyan",
		era: "buu",
		accent: ERA_ACCENT.buu,
		tags: ["buu", "combat", "personnages", "community", "bestof"],
	},
	{
		id: "clip-kidbuu",
		image: "/wiki/kidbuu.poster.webp",
		poster: "/wiki/kidbuu.poster.webp",
		video: "/wiki/kidbuu.mp4",
		title: "Kid Buu",
		kicker: "Chaos pur",
		era: "buu",
		accent: ERA_ACCENT.buu,
		tags: ["buu", "combat", "sagas", "personnages", "play"],
	},
	{
		id: "clip-buuhan",
		image: "/wiki/buuhan.poster.webp",
		poster: "/wiki/buuhan.poster.webp",
		video: "/wiki/buuhan.mp4",
		title: "Buuhan",
		kicker: "Absorption",
		era: "buu",
		accent: ERA_ACCENT.buu,
		tags: ["buu", "sagas", "personnages"],
	},
	{
		id: "clip-beerus",
		image: "/wiki/beerus.poster.webp",
		poster: "/wiki/beerus.poster.webp",
		video: "/wiki/beerus.mp4",
		title: "Beerus",
		kicker: "Dieu de la destruction",
		era: "divine",
		accent: ERA_ACCENT.divine,
		tags: ["divine", "guardians", "films", "personnages", "hero"],
	},
	{
		id: "clip-hit",
		image: "/wiki/hitgokukaioken.poster.webp",
		poster: "/wiki/hitgokukaioken.poster.webp",
		video: "/wiki/hitgokukaioken.mp4",
		title: "Hit vs Goku",
		kicker: "Tournoi du pouvoir",
		era: "divine",
		accent: ERA_ACCENT.divine,
		tags: ["divine", "combat", "sagas", "bestof", "episodes"],
	},
	{
		id: "clip-jiren",
		image: "/wiki/gfokufreezerjiren.poster.webp",
		poster: "/wiki/gfokufreezerjiren.poster.webp",
		video: "/wiki/gfokufreezerjiren.mp4",
		title: "Goku · Freezer · Jiren",
		kicker: "Alliance divine",
		era: "divine",
		accent: ERA_ACCENT.divine,
		tags: ["divine", "bestof", "guardians", "sagas", "hero"],
	},
	{
		id: "clip-broly",
		image: "/wiki/ssjba.poster.webp",
		poster: "/wiki/ssjba.poster.webp",
		video: "/wiki/ssjba.mp4",
		title: "Broly",
		kicker: "Légendaire",
		era: "saiyan",
		accent: ERA_ACCENT.saiyan,
		tags: ["saiyan", "films", "combat", "personnages", "hero"],
	},
	{
		id: "clip-ssj4-daima",
		image: "/wiki/gokussj4daima.poster.webp",
		poster: "/wiki/gokussj4daima.poster.webp",
		video: "/wiki/gokussj4daima.mp4",
		title: "Goku SSJ4",
		kicker: "Daima",
		era: "origin",
		accent: ERA_ACCENT.origin,
		tags: ["origin", "play", "personnages", "episodes", "jeux"],
	},
	{
		id: "clip-vegeta-daima",
		image: "/wiki/vegetadaima.poster.webp",
		poster: "/wiki/vegetadaima.poster.webp",
		video: "/wiki/vegetadaima.mp4",
		title: "Vegeta Daima",
		kicker: "Fierté intacte",
		era: "divine",
		accent: ERA_ACCENT.divine,
		tags: ["divine", "news", "personnages", "episodes"],
	},
	{
		id: "clip-glorio",
		image: "/wiki/gloorio.poster.webp",
		poster: "/wiki/gloorio.poster.webp",
		video: "/wiki/gloorio.mp4",
		title: "Glorio",
		kicker: "Daima",
		era: "summon",
		accent: ERA_ACCENT.summon,
		tags: ["summon", "atlas", "personnages", "episodes"],
	},
];

/** Pool unifié (clips tagués + héros + sections) pour le champ flottant. */
export function buildFullClipPool(): HomeScene[] {
	const seen = new Set<string>();
	const out: HomeScene[] = [];
	for (const sc of [...TAGGED_CLIPS, ...HERO_SCENES, ...Object.values(SECTION_SCENE)]) {
		const key = sc.video ?? sc.image;
		if (!key || seen.has(key)) continue;
		seen.add(key);
		out.push(sc);
	}
	return out;
}

/** PRNG simple (mulberry32) pour un shuffle stable par session. */
export function mulberry32(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function shuffleWithSeed<T>(arr: readonly T[], seed: number): T[] {
	const out = arr.slice();
	const rand = mulberry32(seed);
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

/** Seed client (visite) — change à chaque chargement. */
export function visitSeed(): number {
	if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
		const buf = new Uint32Array(1);
		crypto.getRandomValues(buf);
		return buf[0] ?? Date.now();
	}
	return (Date.now() ^ (Math.random() * 0x100000000)) >>> 0;
}

/** Score un clip pour une section (tag exact ≫ ère ≫ combat générique). */
function scoreClip(c: TaggedClip, sectionId: string, era?: Era): number {
	let s = 0;
	if (c.tags.includes(sectionId)) s += 100;
	if (era && c.era === era) s += 40;
	// Affinités croisées (lore / combat / média).
	const affinity: Record<string, string[]> = {
		bestof: ["combat", "sagas", "hero"],
		tops: ["combat", "saiyan", "hero", "episodes", "films", "jeux"],
		atlas: ["hero", "summon", "divine"],
		universe: ["hero", "combat"],
		personnages: ["personnages", "combat"],
		sagas: ["sagas", "combat", "hero"],
		episodes: ["episodes", "combat"],
		films: ["films", "combat", "hero"],
		manga: ["origin", "personnages"],
		jeux: ["jeux", "combat", "play"],
		planetes: ["namek", "planetes"],
		databooks: ["android", "personnages"],
		pantheon: ["combat", "saiyan"],
		guardians: ["divine", "guardians"],
		community: ["community", "saiyan"],
		play: ["play", "combat"],
		news: ["divine", "news"],
		hero: ["hero", "combat"],
	};
	for (const t of affinity[sectionId] ?? []) {
		if (c.tags.includes(t) || c.era === t) s += 12;
	}
	if (c.tags.includes("combat")) s += 5;
	return s;
}

/**
 * Pool ordonné (meilleurs scores d'abord) pour une section.
 * Sert au fond dynamique + rotation cinématique.
 */
export function poolForSection(
	sectionId: string,
	era: Era | undefined,
	seed: number,
	max = 6
): HomeScene[] {
	const scored = TAGGED_CLIPS.map((c) => ({
		c,
		s: scoreClip(c, sectionId, era),
	})).sort((a, b) => b.s - a.s || a.c.id.localeCompare(b.c.id));

	const topScore = scored[0]?.s ?? 0;
	// Garde les clips vraiment pertinents (score ≥ 50 % du top, min 40).
	const threshold = Math.max(40, topScore * 0.5);
	let pool = scored.filter((x) => x.s >= threshold).map((x) => x.c as HomeScene);
	if (pool.length < 2) {
		pool = scored.slice(0, Math.min(4, scored.length)).map((x) => x.c);
	}
	// Shuffle stable du top pour varier la visite sans perdre la pertinence.
	return shuffleWithSeed(pool, seed + sectionId.length * 131).slice(0, max);
}

/**
 * Pioche un clip pour une section : scoring strict (tag + ère + affinités).
 */
export function pickSceneForSection(
	sectionId: string,
	era: Era | undefined,
	seed: number,
	offset = 0
): HomeScene {
	const pool = poolForSection(sectionId, era, seed, 8);
	const rand = mulberry32(seed + offset * 9973);
	const i = Math.floor(rand() * pool.length);
	return pool[i] ?? TAGGED_CLIPS[0];
}

/** Clip poster pour un portail atlas (matching destination → scène). */
export function sceneForDestination(destId: string, seed: number): HomeScene | null {
	const dest = HOME_DESTINATIONS.find((d) => d.id === destId);
	if (!dest) return null;
	return pickSceneForSection(dest.sceneId ?? dest.id, dest.era, seed, destId.length);
}

/** Cue SFX à l'entrée d'un panneau (clés sfx) — orchestration intentionnelle. */
export type SectionEnterCue =
	| "teleport"
	| "whoosh"
	| "kiCharge"
	| "powerUp"
	| "kamehameha"
	| "select"
	| "tapion"
	| "hit"
	| "finalFlash"
	| "nimbus";

/**
 * SFX d'entrée / scroll : téléportation sur tous les panneaux.
 * Les grosses attaques (kamehameha…) restent sur interaction volontaire.
 * `tapion` = thème long additionnel sur bestof uniquement.
 */
export const SECTION_ENTER_CUE: Record<string, SectionEnterCue> = {
	hero: "teleport",
	bestof: "teleport",
	tops: "teleport",
	atlas: "teleport",
	universe: "teleport",
	personnages: "teleport",
	sagas: "teleport",
	episodes: "teleport",
	films: "teleport",
	manga: "teleport",
	jeux: "teleport",
	planetes: "teleport",
	databooks: "teleport",
	pantheon: "teleport",
	guardians: "teleport",
	community: "teleport",
	play: "teleport",
	news: "teleport",
};

/** Bursts canvas à l'entrée — volontairement très rare (calme). */
export const SECTION_ENTER_BURST: Record<string, "hit" | "kamehameha" | "select" | "power"> = {
	// bestof uniquement : un soft select à l'arrivée sur le panneau phare
	bestof: "select",
};

/** Intensité visuelle par section (grade / aura / letterbox). */
export const SECTION_VISUAL_INTENSITY: Record<string, "low" | "mid" | "high" | "peak"> = {
	hero: "peak",
	bestof: "peak",
	tops: "high",
	atlas: "high",
	universe: "mid",
	personnages: "high",
	sagas: "high",
	episodes: "mid",
	films: "peak",
	manga: "low",
	jeux: "mid",
	planetes: "mid",
	databooks: "low",
	pantheon: "high",
	guardians: "peak",
	community: "mid",
	play: "mid",
	news: "low",
};

/** Libellé HUD scouter (ère / ambiance) pour le chrome immersif. */
export const SECTION_SCOUTER_LABEL: Record<string, string> = {
	hero: "SCAN · ORIGINE",
	bestof: "SCAN · SAGAS",
	tops: "SCAN · PODIUM",
	atlas: "SCAN · PORTAILS",
	universe: "SCAN · COSMOS",
	personnages: "SCAN · GUERRIERS",
	sagas: "SCAN · CHRONICLES",
	episodes: "SCAN · ANIME",
	films: "SCAN · CINÉMA",
	manga: "SCAN · MANGA",
	jeux: "SCAN · ARÈNE",
	planetes: "SCAN · MONDES",
	databooks: "SCAN · ARCHIVES",
	pantheon: "SCAN · RANG",
	guardians: "SCAN · DIVINITÉS",
	community: "SCAN · SERVEUR",
	play: "SCAN · TERRAIN",
	news: "SCAN · ACTU",
};
