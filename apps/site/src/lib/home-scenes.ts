// Pool de scènes cinématiques de la home — curé à la main pour le contrôle
// visuel (les "key art" de sagas en DB sont des artworks de personnages, pas des
// plans larges, donc on les met en scène : ken-burns + color grade + grain +
// aura d'énergie par ère). Client-safe : zéro import server-only, juste des
// constantes consommées par les composants de la home (RSC + îlots client).
//
// Les chemins sont relatifs `./assets/...` → passés par `assetUrl()` côté rendu
// pour pointer sur le CDN bot (`bot.dragonballfr.com`).

import {
	cloneHomeFx,
	DEFAULT_HOME_FX,
	resolveHomeFx,
	type HomeFxConfig,
} from "@/lib/home-fx";

export type { HomeFxConfig, HomeSfxSlot, HomeVfxToggles } from "@/lib/home-fx";
export {
	DEFAULT_HOME_FX,
	HOME_SFX_FILE_OPTIONS,
	HOME_SFX_META,
	HOME_SFX_SLOTS,
	homeFxToConfigureArgs,
	resolveHomeFx,
} from "@/lib/home-fx";

export type Era = "origin" | "saiyan" | "namek" | "android" | "buu" | "divine" | "summon";

export interface HomeScene {
	readonly id: string;
	readonly image: string;
	/** Poster (frame extraite de la vidéo) — affichage instantané + repli reduced-motion/save-data. */
	readonly poster?: string;
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
	// Clips additionnels — poster = frame extraite (le clip sert d'image aussi).
	{
		id: "bardock",
		image: "/wiki/bardock.poster.webp",
		poster: "/wiki/bardock.poster.webp",
		video: "/wiki/bardock.mp4",
		title: "Bardock",
		kicker: "Le père de Son Goku",
		era: "saiyan",
		accent: ERA_ACCENT.saiyan,
	},
	{
		id: "raditz",
		image: "/wiki/radditz.poster.webp",
		poster: "/wiki/radditz.poster.webp",
		video: "/wiki/radditz.mp4",
		title: "Raditz",
		kicker: "Le frère venu de l'espace",
		era: "saiyan",
		accent: ERA_ACCENT.saiyan,
	},
	{
		id: "guldo",
		image: "/wiki/guldo.poster.webp",
		poster: "/wiki/guldo.poster.webp",
		video: "/wiki/guldo.mp4",
		title: "Le commando Ginyu",
		kicker: "Les mercenaires de Freezer",
		era: "namek",
		accent: ERA_ACCENT.namek,
	},
	{
		id: "burter-jeice",
		image: "/wiki/buuttajeice.poster.webp",
		poster: "/wiki/buuttajeice.poster.webp",
		video: "/wiki/buuttajeice.mp4",
		title: "Burter & Jeice",
		kicker: "L'éclair et le feu",
		era: "namek",
		accent: ERA_ACCENT.namek,
	},
	{
		id: "miraigohan",
		image: "/wiki/miraigohan.poster.webp",
		poster: "/wiki/miraigohan.poster.webp",
		video: "/wiki/miraigohan.mp4",
		title: "Gohan du futur",
		kicker: "Le dernier rempart",
		era: "android",
		accent: ERA_ACCENT.android,
	},
	{
		id: "super17",
		image: "/wiki/sc17.poster.webp",
		poster: "/wiki/sc17.poster.webp",
		video: "/wiki/sc17.mp4",
		title: "Super C-17",
		kicker: "La fusion cybernétique",
		era: "android",
		accent: ERA_ACCENT.android,
	},
	{
		id: "buuhan",
		image: "/wiki/buuhan.poster.webp",
		poster: "/wiki/buuhan.poster.webp",
		video: "/wiki/buuhan.mp4",
		title: "Buuhan",
		kicker: "L'absorption ultime",
		era: "buu",
		accent: ERA_ACCENT.buu,
	},
	{
		id: "hit",
		image: "/wiki/hitgokukaioken.poster.webp",
		poster: "/wiki/hitgokukaioken.poster.webp",
		video: "/wiki/hitgokukaioken.mp4",
		title: "Hit",
		kicker: "L'assassin du 6e univers",
		era: "divine",
		accent: ERA_ACCENT.divine,
	},
	{
		id: "vegeta-daima",
		image: "/wiki/vegetadaima.poster.webp",
		poster: "/wiki/vegetadaima.poster.webp",
		video: "/wiki/vegetadaima.mp4",
		title: "Vegeta",
		kicker: "Fierté intacte",
		era: "divine",
		accent: ERA_ACCENT.divine,
	},
	{
		id: "taopaipai",
		image: "/wiki/taopaipai.poster.webp",
		poster: "/wiki/taopaipai.poster.webp",
		video: "/wiki/taopaipai.mp4",
		title: "Tao Pai Pai",
		kicker: "L'assassin légendaire",
		era: "origin",
		accent: ERA_ACCENT.origin,
	},
	{
		id: "tenshinhan",
		image: "/wiki/tenshihan.poster.webp",
		poster: "/wiki/tenshihan.poster.webp",
		video: "/wiki/tenshihan.mp4",
		title: "Tenshinhan",
		kicker: "Le maître des arts martiaux",
		era: "origin",
		accent: ERA_ACCENT.origin,
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
	pantheon: {
		id: "pantheon-section",
		image: "./assets/dbz/characters/gohan.webp",
		video: "/wiki/cellgoku.mp4",
		title: "Le panthéon",
		kicker: "Les guerriers du serveur",
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
	personnages: {
		id: "characters-section",
		image: "/wiki/kidbuu.poster.webp",
		poster: "/wiki/kidbuu.poster.webp",
		video: "/wiki/kidbuu.mp4",
		title: "Les personnages",
		kicker: "Guerriers, dieux et démons",
		era: "buu",
		accent: ERA_ACCENT.buu,
	},
	sagas: {
		id: "sagas-section",
		image: "/wiki/freezergoku2.poster.webp",
		poster: "/wiki/freezergoku2.poster.webp",
		video: "/wiki/freezergoku2.mp4",
		title: "Les sagas",
		kicker: "Le voyage à travers les ères",
		era: "namek",
		accent: ERA_ACCENT.namek,
	},
	bestof: {
		id: "bestof-section",
		image: "./assets/dbz/characters/goku_normal.webp",
		video: "/wiki/gfokufreezerjiren.mp4",
		title: "Le best of",
		kicker: "Les plus grands combats",
		era: "saiyan",
		accent: ERA_ACCENT.saiyan,
	},
	news: {
		id: "vegeta-daima-news",
		image: "/wiki/vegetadaima.poster.webp",
		poster: "/wiki/vegetadaima.poster.webp",
		video: "/wiki/vegetadaima.mp4",
		title: "Actualités",
		kicker: "Les dernières nouvelles",
		era: "divine",
		accent: ERA_ACCENT.divine,
	},
};

// Pool COMPLET de clips vidéo pour le champ dérivant du héro : tous les plans de
// HERO_SCENES + SECTION_SCENE qui portent une vidéo, dédupliqués par source. Le
// champ en pioche aléatoirement (client-side) → « tous les clips » sur la home,
// dans un ordre différent à chaque visite.
export const ALL_CLIP_SCENES: readonly HomeScene[] = (() => {
	const seen = new Set<string>();
	const out: HomeScene[] = [];
	for (const sc of [...HERO_SCENES, ...Object.values(SECTION_SCENE)]) {
		if (!sc.video || seen.has(sc.video)) continue;
		seen.add(sc.video);
		out.push(sc);
	}
	return out;
})();

// ─────────────────────────────────────────────────────────────────────────────
// Configuration éditable de la home (pilotée depuis /admin/home).
//
// Client-safe : ces types + défauts sont consommés à la fois par l'éditeur
// admin (Client Component) et par la page (RSC, via lib/home-config.ts qui lit
// la DB côté serveur). La DB ne stocke qu'un patch partiel ; `resolveHomeConfig`
// le fusionne au-dessus des défauts ci-dessous → si la table est vide/absente ou
// le JSON invalide, la home reste STRICTEMENT identique à la version en dur.
// ─────────────────────────────────────────────────────────────────────────────

export const ERAS: readonly Era[] = [
	"origin",
	"saiyan",
	"namek",
	"android",
	"buu",
	"divine",
	"summon",
];

/** Sections de contenu connues (rendues par HomeExperience). Le héro (index 0) est fixe. */
export type HomeSectionId =
	| "pantheon"
	| "universe"
	| "bestof"
	| "personnages"
	| "sagas"
	| "guardians"
	| "community"
	| "play"
	| "news";

interface HomeSectionMeta {
	navLabel: string;
	kanji: string;
	eyebrow: string;
	title: string;
	subtitle: string;
	defaultEnabled: boolean;
}

/** Métadonnées par défaut de chaque section (libellés/textes d'origine du code). */
export const SECTION_META: Record<HomeSectionId, HomeSectionMeta> = {
	pantheon: {
		navLabel: "Le panthéon",
		kanji: "番付",
		eyebrow: "Le panthéon",
		title: "Les guerriers les plus puissants",
		subtitle: "Le classement live du serveur, et qui combat en ce moment même.",
		defaultEnabled: true,
	},
	universe: {
		navLabel: "L'univers",
		kanji: "宇宙",
		eyebrow: "Le voyage",
		title: "Voyage à travers l'univers",
		subtitle:
			"Personnages, planètes, sagas, épisodes, films et chapitres — chaque recoin de la saga, vérifié et en lien avec les ayants droit. Choisis ta destination.",
		defaultEnabled: true,
	},
	bestof: {
		navLabel: "Best of sagas",
		kanji: "伝",
		eyebrow: "Le best of",
		title: "Les sagas légendaires",
		subtitle:
			"Choisis ta saga et replonge : les épisodes, les films et les tomes du manga qui ont fait la légende — en direct du wiki.",
		defaultEnabled: true,
	},
	// Masqués par défaut en bêta : les routes /wiki/personnages et /wiki/sagas sont
	// fermées côté proxy → activer ces panneaux nécessite de rouvrir ces routes.
	personnages: {
		navLabel: "Personnages",
		kanji: "戦士",
		eyebrow: "Les héros",
		title: "Les personnages de légende",
		subtitle:
			"Saiyans, dieux, démons et terriens — explore les figures qui ont façonné Dragon Ball, fiche par fiche.",
		defaultEnabled: false,
	},
	sagas: {
		navLabel: "Les sagas",
		kanji: "物語",
		eyebrow: "La chronologie",
		title: "Le voyage à travers les sagas",
		subtitle:
			"Des origines à la divinité — suis la saga complète : Dragon Ball, Z, Super et GT, arc après arc.",
		defaultEnabled: false,
	},
	guardians: {
		navLabel: "Les gardiens",
		kanji: "神",
		eyebrow: "Le bot",
		title: "Six gardiens, un seul process",
		subtitle: "Six personas Discord, six personnalités, une seule machine",
		defaultEnabled: true,
	},
	community: {
		navLabel: "Communauté",
		kanji: "仲間",
		eyebrow: "La communauté",
		title: "Des milliers de guerriers",
		subtitle: "Chiffres réels, mis à jour en direct depuis le bot.",
		defaultEnabled: true,
	},
	play: {
		navLabel: "Le terrain",
		kanji: "遊",
		eyebrow: "Le terrain",
		title: "Combats, économie, fusions",
		subtitle:
			"Le bot transforme le serveur en terrain de jeu : gagne de l'XP, dépense tes zénis, grimpe au classement.",
		defaultEnabled: true,
	},
	news: {
		navLabel: "Actualités",
		kanji: "報",
		eyebrow: "Actualités",
		title: "Les dernières nouvelles",
		subtitle: "",
		defaultEnabled: true,
	},
};

/** Ordre par défaut des sections (identique à la home actuelle une fois filtré `enabled`). */
export const SECTION_ORDER: readonly HomeSectionId[] = [
	"pantheon",
	"universe",
	"bestof",
	"personnages",
	"sagas",
	"guardians",
	"community",
	"play",
	"news",
];

/** Carte d'action du bloc « Le terrain » (section `play`). */
export interface PlayCard {
	href: string;
	title: string;
	desc: string;
	kanji: string;
}

export const DEFAULT_PLAY_CARDS: readonly PlayCard[] = [
	{
		href: "/jeux",
		title: "Mini-jeux",
		desc: "2048, Pierre-Feuille-Ciseaux, Morpion, Pendu, Bingo",
		kanji: "遊",
	},
	{ href: "/shop", title: "Boutique zéni", desc: "Rôles, bannières, cartes, fusions", kanji: "商" },
	{
		href: "/leaderboard",
		title: "Classement",
		desc: "Les guerriers les plus puissants",
		kanji: "番付",
	},
	{
		href: "/profil",
		title: "Ta carte de combat",
		desc: "Niveau, XP, succès, inventaire",
		kanji: "戦士",
	},
];

export interface HomeSectionConfig {
	/** Built-in = HomeSectionId ; custom = id préfixé `custom-` (réservé). */
	id: HomeSectionId | string;
	enabled: boolean;
	navLabel: string;
	kanji: string;
	eyebrow: string;
	title: string;
	subtitle: string;
	scene: HomeScene;
	/** Cartes d'action — utilisé uniquement par la section `play`. */
	cards?: PlayCard[];
	/** Corps markdown — sections personnalisées uniquement (rendu XSS-safe). */
	body?: string;
	/** true = section personnalisée (ajoutée en admin) ; absent/false = built-in. */
	isCustom?: boolean;
}

export interface HomeConfig {
	version: 1;
	hero: {
		scenes: HomeScene[];
		lede: string;
		ctaLabel: string;
		ctaHref: string;
	};
	/** Nombre de clips flottants dans le héro par largeur (téléphone = toujours 0). */
	clips: { desktop: number; tablet: number };
	sections: HomeSectionConfig[];
	/** VFX/SFX home — volume, mapping fichiers, toggles effets. */
	fx: HomeFxConfig;
}

/** Clip vidéo disponible pour le sélecteur de fond (exposé par /api/home-config). */
export interface HomeClip {
	id: string;
	/** Chemin `/wiki/<name>.mp4` (converti en `.web.mp4` au rendu). */
	video: string;
	/** Chemin poster `/wiki/<name>.poster.webp` si présent, sinon null. */
	poster: string | null;
}

export const DEFAULT_HERO_LEDE =
	"Un voyage à travers tout l'univers Dragon Ball : personnages, planètes, sagas, films et manga — en français, sourcé canon. Et six gardiens qui veillent sur la communauté.";

const CLIP_MAX = { desktop: 8, tablet: 6 } as const;

const clampInt = (v: unknown, min: number, max: number, dflt: number): number => {
	const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
	if (!Number.isFinite(n)) return dflt;
	return Math.max(min, Math.min(max, Math.round(n)));
};

const str = (v: unknown, dflt: string): string => (typeof v === "string" ? v : dflt);

/** Normalise une scène venue de la DB/de l'éditeur → forme `HomeScene` sûre (accent dérivé de l'ère). */
export function sanitizeScene(input: unknown, fallback: HomeScene): HomeScene {
	const o = (input ?? {}) as Record<string, unknown>;
	const era: Era = ERAS.includes(o.era as Era) ? (o.era as Era) : fallback.era;
	const video = str(o.video, fallback.video ?? "").trim();
	const poster = str(o.poster, fallback.poster ?? "").trim();
	return {
		id: str(o.id, fallback.id) || fallback.id,
		image: str(o.image, fallback.image),
		poster: poster || undefined,
		video: video || undefined,
		title: str(o.title, fallback.title),
		kicker: str(o.kicker, fallback.kicker),
		era,
		accent: ERA_ACCENT[era],
	};
}

const cloneScene = (s: HomeScene): HomeScene => sanitizeScene(s, s);

/** Config par défaut = reflet exact de la home en dur (avec un poil plus de clips). */
export const DEFAULT_HOME_CONFIG: HomeConfig = {
	version: 1,
	hero: {
		scenes: HERO_SCENES.map(cloneScene),
		lede: DEFAULT_HERO_LEDE,
		ctaLabel: "Commencer le voyage",
		ctaHref: "/wiki/episodes",
	},
	clips: { desktop: 8, tablet: 4 },
	sections: SECTION_ORDER.map((id) => ({
		id,
		enabled: SECTION_META[id].defaultEnabled,
		navLabel: SECTION_META[id].navLabel,
		kanji: SECTION_META[id].kanji,
		eyebrow: SECTION_META[id].eyebrow,
		title: SECTION_META[id].title,
		subtitle: SECTION_META[id].subtitle,
		scene: cloneScene(SECTION_SCENE[id] ?? HERO_SCENES[0]),
	})),
	fx: cloneHomeFx(DEFAULT_HOME_FX),
};

/**
 * Copie défensive d'une section : clone la scène et les cartes pour ne JAMAIS
 * partager de référence avec `DEFAULT_HOME_CONFIG`. Sans ce clone, la boucle de
 * complétion de `resolveHomeConfig` pousserait les objets par défaut tels quels
 * dans la config retournée → une mutation aval (`config.sections[i].enabled = …`)
 * corromprait `DEFAULT_HOME_CONFIG` pour tous les appels suivants.
 */
const cloneSection = (s: HomeSectionConfig): HomeSectionConfig => ({
	...s,
	scene: cloneScene(s.scene),
	...(s.cards ? { cards: s.cards.map((c) => ({ ...c })) } : {}),
});

const defaultSection = (id: HomeSectionId): HomeSectionConfig =>
	cloneSection(DEFAULT_HOME_CONFIG.sections.find((s) => s.id === id)!);

/**
 * Fusionne un patch partiel (JSON stocké en DB) au-dessus des défauts. Défensif :
 * toute valeur manquante/invalide retombe sur le défaut. L'ordre des sections =
 * l'ordre du patch (ids connus), puis les sections connues absentes sont ajoutées.
 */
export function resolveHomeConfig(patch: unknown): HomeConfig {
	// Clone sur le repli : ne jamais partager le singleton DEFAULT_HOME_CONFIG
	// (un consumer qui muterait `sections[i].enabled` corromprait le défaut global).
	if (!patch || typeof patch !== "object") return structuredClone(DEFAULT_HOME_CONFIG);
	const p = patch as Record<string, unknown>;

	// ── Héro ──
	const heroPatch = (p.hero ?? {}) as Record<string, unknown>;
	const rawScenes = Array.isArray(heroPatch.scenes) ? heroPatch.scenes : null;
	const scenes =
		rawScenes && rawScenes.length > 0
			? rawScenes.map((s, i) => sanitizeScene(s, HERO_SCENES[i % HERO_SCENES.length]))
			: // Clone : ne jamais partager les objets scène de DEFAULT_HOME_CONFIG (une
				// mutation aval les corromprait pour tous les appels suivants).
				DEFAULT_HOME_CONFIG.hero.scenes.map(cloneScene);

	const hero: HomeConfig["hero"] = {
		scenes,
		lede: str(heroPatch.lede, DEFAULT_HOME_CONFIG.hero.lede),
		ctaLabel: str(heroPatch.ctaLabel, DEFAULT_HOME_CONFIG.hero.ctaLabel),
		ctaHref: str(heroPatch.ctaHref, DEFAULT_HOME_CONFIG.hero.ctaHref),
	};

	// ── Clips ──
	const clipsPatch = (p.clips ?? {}) as Record<string, unknown>;
	const clips = {
		desktop: clampInt(clipsPatch.desktop, 0, CLIP_MAX.desktop, DEFAULT_HOME_CONFIG.clips.desktop),
		tablet: clampInt(clipsPatch.tablet, 0, CLIP_MAX.tablet, DEFAULT_HOME_CONFIG.clips.tablet),
	};

	// ── Sections (ordre du patch, puis complétion des built-in absentes) ──
	const rawSections = Array.isArray(p.sections) ? p.sections : [];
	const seen = new Set<string>();
	const sections: HomeSectionConfig[] = [];
	for (const raw of rawSections) {
		const so = (raw ?? {}) as Record<string, unknown>;
		const id = so.id;
		// Accepte tout id string non vide, dédupe. Ne PAS filtrer sur SECTION_META
		// (sinon les sections custom seraient jetées ici ET à l'écriture).
		if (typeof id !== "string" || !id || seen.has(id)) continue;
		seen.add(id);

		// Built-in ⟺ présent dans l'ordre canonique. Tout autre id (préfixe
		// `custom-`) = section personnalisée à corps de texte libre.
		if ((SECTION_ORDER as readonly string[]).includes(id)) {
			const dflt = defaultSection(id as HomeSectionId);
			sections.push({
				id,
				enabled: typeof so.enabled === "boolean" ? so.enabled : dflt.enabled,
				navLabel: str(so.navLabel, dflt.navLabel),
				kanji: str(so.kanji, dflt.kanji),
				eyebrow: str(so.eyebrow, dflt.eyebrow),
				title: str(so.title, dflt.title),
				subtitle: str(so.subtitle, dflt.subtitle),
				scene: sanitizeScene(so.scene, dflt.scene),
			});
		} else {
			// Section personnalisée : mêmes champs éditables + corps markdown borné.
			sections.push({
				id,
				isCustom: true,
				enabled: typeof so.enabled === "boolean" ? so.enabled : true,
				navLabel: str(so.navLabel, "Section"),
				kanji: str(so.kanji, "◆"),
				eyebrow: str(so.eyebrow, "Section"),
				title: str(so.title, ""),
				subtitle: str(so.subtitle, ""),
				body: str(so.body, "").slice(0, 8000),
				scene: sanitizeScene(so.scene, DEFAULT_HOME_CONFIG.sections[0].scene),
			});
		}
	}
	// Sections built-in absentes du patch → ajoutées à la fin (forward-compat).
	for (const id of SECTION_ORDER) {
		if (!seen.has(id)) sections.push(defaultSection(id));
	}

	// ── VFX/SFX (`fx`) — absorbe le legacy `{ sfxVolume: 0.4 }` seul ──
	const fx = resolveHomeFx(p.fx);

	return { version: 1, hero, clips, sections, fx };
}
