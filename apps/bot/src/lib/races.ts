/**
 * Système de races (inspiré Dragon Ball Xenoverse 2).
 *
 * Un membre choisit UNE race qui module sa progression. Les traits sont une
 * transposition des traits FACTUELS des races CaC de Xenoverse 2
 * (cf. docs/races-systeme-niveau.md) sur les leviers du bot (XP, vocal, zéni, jeux).
 *
 * Module PUR (aucune dépendance DB/Discord) → testable. Les helpers prennent
 * l'id de race (string | null) et renvoient des multiplicateurs.
 */
export const RACE_IDS = ["terrien", "saiyen", "freezer", "namek", "majin"] as const;
export type RaceId = (typeof RACE_IDS)[number];

export interface RaceDef {
	id: RaceId;
	name: string;
	emoji: string;
	color: number; // couleur d'embed
	/** Trait factuel XV2 (verbatim du jeu). */
	trait: string;
	/** Effet concret côté bot. */
	perk: string;
	xpMessage: number; // multiplicateur XP par message
	xpVoice: number; // multiplicateur XP vocal
	zeni: number; // multiplicateur des gains de zéni (général)
	gameZeni: number; // multiplicateur supplémentaire des gains de jeux
	zenkai: boolean; // boost temporaire d'XP après un palier
	regen: boolean; // régén passive quotidienne (XP + zéni)
}

// Zenkai (Saiyen) : boost d'XP après une montée de niveau.
export const ZENKAI_MULT = 1.5;
export const ZENKAI_MS = 60 * 60_000; // 1 h

// Régén passive (Namek) : 1×/24 h, à la première activité.
export const REGEN_MS = 24 * 60 * 60_000;
export const REGEN_XP = 200;
export const REGEN_ZENI = 200;

export const RACES: Record<RaceId, RaceDef> = {
	terrien: {
		id: "terrien",
		name: "Terrien",
		emoji: "🌍",
		color: 0x4aa3df,
		trait: "Stats équilibrées ; objets plus efficaces ; récupération de Ki automatique.",
		perk: "+25 % de zéni sur tous les gains (drops, daily, jeux, paliers).",
		xpMessage: 1,
		xpVoice: 1,
		zeni: 1.25,
		gameZeni: 1,
		zenkai: false,
		regen: false,
	},
	saiyen: {
		id: "saiyen",
		name: "Saiyen",
		emoji: "⚡",
		color: 0xf5c518,
		trait: "Tribu de guerriers : monte vite, plus fort à basse santé, Zenkai après réanimation.",
		perk: "×1,25 XP (chat + vocal) + « Zenkai » : +50 % XP pendant 1 h après chaque palier.",
		xpMessage: 1.25,
		xpVoice: 1.25,
		zeni: 1,
		gameZeni: 1,
		zenkai: true,
		regen: false,
	},
	freezer: {
		id: "freezer",
		name: "Race de Freezer",
		emoji: "❄️",
		color: 0x9b59b6,
		trait: "Race rapide qui domine par la vitesse ; récupère son endurance en attaquant.",
		perk: "×1,4 XP en vocal (récompense la présence vocale).",
		xpMessage: 1,
		xpVoice: 1.4,
		zeni: 1,
		gameZeni: 1,
		zenkai: false,
		regen: false,
	},
	namek: {
		id: "namek",
		name: "Namek",
		emoji: "🟢",
		color: 0x2ecc71,
		trait: "Grande santé, régénération, attaque faible : patient et endurant.",
		perk: "×1,1 XP + régén passive quotidienne (+200 XP & +200 zéni à la 1re activité du jour).",
		xpMessage: 1.1,
		xpVoice: 1.1,
		zeni: 1,
		gameZeni: 1,
		zenkai: false,
		regen: true,
	},
	majin: {
		id: "majin",
		name: "Majin",
		emoji: "👹",
		color: 0xff69b4,
		trait: "Défensif, imprévisible, stats variables selon le sexe.",
		perk: "+50 % de zéni sur les gains aux mini-jeux (joueur né).",
		xpMessage: 1,
		xpVoice: 1,
		zeni: 1,
		gameZeni: 1.5,
		zenkai: false,
		regen: false,
	},
};

export function isRaceId(s: string | null | undefined): s is RaceId {
	return !!s && (RACE_IDS as readonly string[]).includes(s);
}

export function getRace(id: string | null | undefined): RaceDef | null {
	return isRaceId(id) ? RACES[id] : null;
}

/** Multiplicateur d'XP par message, Zenkai inclus si la fenêtre est active. */
export function messageXpMultiplier(
	race: string | null | undefined,
	boostUntil: number | null | undefined,
	now: number
): number {
	const def = getRace(race);
	if (!def) return 1;
	const zenkai = def.zenkai && boostUntil && boostUntil > now ? ZENKAI_MULT : 1;
	return def.xpMessage * zenkai;
}

/** Multiplicateur d'XP vocal, Zenkai inclus si la fenêtre est active. */
export function voiceXpMultiplier(
	race: string | null | undefined,
	boostUntil: number | null | undefined,
	now: number
): number {
	const def = getRace(race);
	if (!def) return 1;
	const zenkai = def.zenkai && boostUntil && boostUntil > now ? ZENKAI_MULT : 1;
	return def.xpVoice * zenkai;
}

/** Applique les multiplicateurs de zéni d'une race à un montant (>0). */
export function applyZeniRace(
	race: string | null | undefined,
	amount: number,
	isGame = false
): number {
	const def = getRace(race);
	if (!def || amount <= 0) return amount;
	const mult = def.zeni * (isGame ? def.gameZeni : 1);
	return Math.floor(amount * mult);
}

export function hasZenkai(race: string | null | undefined): boolean {
	return getRace(race)?.zenkai ?? false;
}

export function hasRegen(race: string | null | undefined): boolean {
	return getRace(race)?.regen ?? false;
}
