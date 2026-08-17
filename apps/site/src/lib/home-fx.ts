/**
 * Home VFX/SFX — types + resolve/apply purs (client-safe).
 *
 * Source unique pour :
 *  - defaults / merge du patch DB (`fx.sfxVolume` legacy absorbé) ;
 *  - catalogue de slots SFX mappables ;
 *  - application runtime via `configureSfx` (side-effect borné).
 */
import type { SfxKey } from "@/lib/sfx";

/** Slots SFX exposés en admin + mappables dans la config. */
export const HOME_SFX_SLOTS = [
	"click",
	"select",
	"whoosh",
	"kiCharge",
	"kamehameha",
	"powerUp",
	"teleport",
	"hit",
	"punch",
	"finalFlash",
	"galick",
	"over9000",
	"nimbus",
	"scream",
	"tapion",
] as const;

export type HomeSfxSlot = (typeof HOME_SFX_SLOTS)[number];

export const HOME_SFX_META: Record<
	HomeSfxSlot,
	{ label: string; defaultFile: string; description: string }
> = {
	click: { label: "Clic UI", defaultFile: "/sfx/click.mp3", description: "Clics atlas / rails" },
	select: { label: "Sélection", defaultFile: "/sfx/select.mp3", description: "Choix UI" },
	whoosh: { label: "Whoosh", defaultFile: "/sfx/whoosh.mp3", description: "Transition douce" },
	kiCharge: {
		label: "Charge ki",
		defaultFile: "/sfx/ki-charge.mp3",
		description: "Phase 1 du hold kame",
	},
	kamehameha: {
		label: "Kamehameha",
		defaultFile: "/sfx/kamehameha.mp3",
		description: "Onde (phase 2 hold)",
	},
	powerUp: {
		label: "Power-up",
		defaultFile: "/sfx/power-up.mp3",
		description: "Montée de puissance",
	},
	teleport: {
		label: "Téléportation",
		defaultFile: "/sfx/teleport.mp3",
		description: "Entrée de panneau (scroll)",
	},
	hit: { label: "Impact", defaultFile: "/sfx/hit.mp3", description: "Hit / sparks" },
	punch: { label: "Punch", defaultFile: "/sfx/punch.mp3", description: "Coup court" },
	finalFlash: {
		label: "Final Flash",
		defaultFile: "/sfx/final-flash.mp3",
		description: "Extra attaque",
	},
	galick: { label: "Galick Gun", defaultFile: "/sfx/galick.mp3", description: "Extra attaque" },
	over9000: {
		label: "Over 9000",
		defaultFile: "/sfx/over9000.mp3",
		description: "Réplique culte",
	},
	nimbus: { label: "Nuage magique", defaultFile: "/sfx/nimbus.mp3", description: "Nuage / vol" },
	scream: { label: "Cri", defaultFile: "/sfx/scream.mp3", description: "Cri de puissance" },
	tapion: {
		label: "Ocarina (Tapion)",
		defaultFile: "/sfx/tapion-ocarina.mp3",
		description: "Thème long — opt-in only",
	},
};

/** Fichiers MP3 connus sous `public/sfx/` (sélection admin, pas de FS côté client). */
export const HOME_SFX_FILE_OPTIONS: readonly string[] = [
	"/sfx/click.mp3",
	"/sfx/select.mp3",
	"/sfx/whoosh.mp3",
	"/sfx/ki-charge.mp3",
	"/sfx/kamehameha.mp3",
	"/sfx/kamehameha-wave.mp3",
	"/sfx/kamehameha-short.mp3",
	"/sfx/kamehameha-wave-sound-effect.mp3",
	"/sfx/gohan-kamehameha.mp3",
	"/sfx/power-up.mp3",
	"/sfx/powerup.mp3",
	"/sfx/teleport.mp3",
	"/sfx/teleport2.mp3",
	"/sfx/teleport3.mp3",
	"/sfx/teleport-alt.mp3",
	"/sfx/teleport-instant.mp3",
	"/sfx/teleport-tele.mp3",
	"/sfx/instant-transmission.mp3",
	"/sfx/dragon-ball-teleport.mp3",
	"/sfx/hit.mp3",
	"/sfx/punch.mp3",
	"/sfx/impact.mp3",
	"/sfx/explosion.mp3",
	"/sfx/final-flash.mp3",
	"/sfx/galick.mp3",
	"/sfx/over9000.mp3",
	"/sfx/over-9000.mp3",
	"/sfx/its-over-9000.mp3",
	"/sfx/nimbus.mp3",
	"/sfx/scream.mp3",
	"/sfx/tapion-ocarina.mp3",
	"/sfx/charging.mp3",
	"/sfx/kaioken.mp3",
	"/sfx/kaio-ken.mp3",
	"/sfx/kienzan.mp3",
	"/sfx/spirit-bomb.mp3",
	"/sfx/hakai.mp3",
	"/sfx/fusion.mp3",
	"/sfx/shenron.mp3",
	"/sfx/dragon-ball.mp3",
	"/sfx/goku.mp3",
	"/sfx/vegeta.mp3",
	"/sfx/ultra-instinct.mp3",
	"/sfx/official/click.mp3",
	"/sfx/official/select.mp3",
	"/sfx/official/whoosh.mp3",
	"/sfx/official/ki-charge.mp3",
	"/sfx/official/kamehameha.mp3",
	"/sfx/official/power-up.mp3",
	"/sfx/official/teleport.mp3",
	"/sfx/official/hit.mp3",
	"/sfx/official/punch.mp3",
	"/sfx/official/final-flash.mp3",
	"/sfx/official/galick.mp3",
	"/sfx/official/over9000.mp3",
	"/sfx/official/nimbus.mp3",
	"/sfx/official/scream.mp3",
	"/sfx/official/tapion-ocarina.mp3",
	"/sfx/official/spirit-bomb.mp3",
	"/sfx/official/gohan-kamehameha.mp3",
	"/sfx/official/instant-transmission.mp3",
];

export interface HomeVfxToggles {
	/** Burst CSS hold-kame (défaut ON). */
	kameCss: boolean;
	/** Canvas HomeBattleFx (défaut OFF — perf). */
	battleCanvas: boolean;
	/** Aura ki Pixi HomeKiAura (défaut OFF). */
	kiAura: boolean;
	/** Voile / scene-aura (défaut OFF — anti-voile bleu). */
	sceneAura: boolean;
}

export interface HomeFxConfig {
	/** Master enable SFX (mute global indépendant). */
	enabled: boolean;
	/** Volume maître 0–1. */
	sfxVolume: number;
	/** Override chemin par slot (null = défaut fichier). */
	sfxMap: Partial<Record<HomeSfxSlot, string | null>>;
	/** Jouer SECTION_ENTER_CUE au scroll entre panneaux. */
	sectionEnterSfx: boolean;
	vfx: HomeVfxToggles;
}

export const DEFAULT_HOME_FX: HomeFxConfig = {
	enabled: true,
	sfxVolume: 0.55,
	sfxMap: {},
	sectionEnterSfx: true,
	vfx: {
		kameCss: true,
		battleCanvas: false,
		kiAura: false,
		sceneAura: false,
	},
};

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

function asBool(v: unknown, dflt: boolean): boolean {
	if (typeof v === "boolean") return v;
	if (v === "true" || v === 1 || v === "1") return true;
	if (v === "false" || v === 0 || v === "0") return false;
	return dflt;
}

function asVolume(v: unknown, dflt: number): number {
	const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
	if (!Number.isFinite(n)) return dflt;
	return clamp01(n);
}

function sanitizeSfxPath(raw: unknown): string | null | undefined {
	if (raw === null) return null;
	if (typeof raw !== "string") return undefined;
	const t = raw.trim();
	if (!t) return null;
	// Autorise /sfx/... uniquement (anti path traversal).
	if (!t.startsWith("/sfx/") || t.includes("..")) return undefined;
	return t;
}

/**
 * Fusionne un patch partiel (DB) → HomeFxConfig.
 * Absorbe le legacy `fx: { sfxVolume: 0.4 }` sans le reste.
 */
export function resolveHomeFx(patch: unknown): HomeFxConfig {
	const d = DEFAULT_HOME_FX;
	if (!patch || typeof patch !== "object") {
		return {
			...d,
			sfxMap: { ...d.sfxMap },
			vfx: { ...d.vfx },
		};
	}
	const p = patch as Record<string, unknown>;
	const vfxRaw = (p.vfx && typeof p.vfx === "object" ? p.vfx : {}) as Record<string, unknown>;

	const sfxMap: Partial<Record<HomeSfxSlot, string | null>> = {};
	const mapRaw =
		p.sfxMap && typeof p.sfxMap === "object" ? (p.sfxMap as Record<string, unknown>) : {};
	for (const slot of HOME_SFX_SLOTS) {
		if (!(slot in mapRaw)) continue;
		const path = sanitizeSfxPath(mapRaw[slot]);
		if (path !== undefined) sfxMap[slot] = path;
	}

	return {
		enabled: asBool(p.enabled, d.enabled),
		sfxVolume: asVolume(p.sfxVolume, d.sfxVolume),
		sfxMap,
		sectionEnterSfx: asBool(p.sectionEnterSfx, d.sectionEnterSfx),
		vfx: {
			kameCss: asBool(vfxRaw.kameCss, d.vfx.kameCss),
			battleCanvas: asBool(vfxRaw.battleCanvas, d.vfx.battleCanvas),
			kiAura: asBool(vfxRaw.kiAura, d.vfx.kiAura),
			sceneAura: asBool(vfxRaw.sceneAura, d.vfx.sceneAura),
		},
	};
}

/** Convertit HomeFxConfig → args pour `configureSfx`. */
export function homeFxToConfigureArgs(fx: HomeFxConfig): {
	map: Partial<Record<SfxKey, string | null>>;
	opts: { volume: number; enabled: boolean };
} {
	const map: Partial<Record<SfxKey, string | null>> = {};
	for (const slot of HOME_SFX_SLOTS) {
		if (slot in fx.sfxMap) {
			const v = fx.sfxMap[slot];
			map[slot as SfxKey] = v === undefined ? undefined : v;
		}
	}
	// Remet les défauts pour slots non overridés n'est pas nécessaire :
	// configureSfx ne touche que les clés présentes.
	// Mais si sfxMap a une clé avec null → désactive le fichier (synth).
	return {
		map,
		opts: { volume: fx.sfxVolume, enabled: fx.enabled },
	};
}

/** Clone défensif pour ne jamais partager DEFAULT. */
export function cloneHomeFx(fx: HomeFxConfig): HomeFxConfig {
	return {
		enabled: fx.enabled,
		sfxVolume: fx.sfxVolume,
		sfxMap: { ...fx.sfxMap },
		sectionEnterSfx: fx.sectionEnterSfx,
		vfx: { ...fx.vfx },
	};
}
