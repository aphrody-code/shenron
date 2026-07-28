"use client";

/**
 * SFX synthétisés via Web Audio (pas d'assets requis).
 * `howler` est installé mais réservé pour quand on aura des fichiers audio
 * (futurs `apps/bot/assets/sfx/*.mp3` exposés via /assets/).
 *
 * Le synth tone offre déjà un feedback DBZ-like (squelette percussif jaune)
 * pour les boutons jeux sans dépendre d'assets externes.
 */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		const Ctor =
			window.AudioContext ??
			(window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!Ctor) return null;
		ctx = new Ctor();
	}
	if (ctx.state === "suspended") void ctx.resume();
	return ctx;
}

type ToneSpec = {
	freq: number;
	dur: number;
	type?: OscillatorType;
	gain?: number;
};

function tone({ freq, dur, type = "square", gain = 0.08 }: ToneSpec) {
	const c = audio();
	if (!c) return;
	const osc = c.createOscillator();
	const g = c.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, c.currentTime);
	g.gain.setValueAtTime(gain, c.currentTime);
	g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
	osc.connect(g).connect(c.destination);
	osc.start();
	osc.stop(c.currentTime + dur);
}

function sequence(specs: ToneSpec[]) {
	const c = audio();
	if (!c) return;
	let t = 0;
	for (const s of specs) {
		setTimeout(() => tone(s), t);
		t += s.dur * 1000;
	}
}

export const sfx = {
	/** Débloque l'AudioContext (gesture utilisateur) — no-op safe côté serveur. */
	unlock: () => {
		audio();
	},
	click: () => tone({ freq: 800, dur: 0.05, type: "square", gain: 0.05 }),
	select: () => tone({ freq: 660, dur: 0.06, type: "triangle", gain: 0.05 }),
	whoosh: () => tone({ freq: 280, dur: 0.12, type: "sawtooth", gain: 0.04 }),
	teleport: () =>
		sequence([
			{ freq: 880, dur: 0.04, type: "square", gain: 0.04 },
			{ freq: 1320, dur: 0.06, type: "triangle", gain: 0.05 },
		]),
	/** Charge ki (synth) — fallback sans MP3. */
	kiCharge: () => tone({ freq: 120, dur: 0.35, type: "sawtooth", gain: 0.05 }),
	kamehameha: () =>
		sequence([
			{ freq: 200, dur: 0.2, type: "sawtooth", gain: 0.07 },
			{ freq: 400, dur: 0.4, type: "square", gain: 0.08 },
		]),
	/** Séquence charge → onde (hold kamehameha). */
	kamehamehaFull: () => {
		sfx.kiCharge();
		window.setTimeout(() => sfx.kamehameha(), 350);
	},
	cancelKamehameha: () => {
		/* synth one-shots : rien à annuler */
	},
	powerUp: () => tone({ freq: 300, dur: 0.25, type: "triangle", gain: 0.06 }),
	hit: () => tone({ freq: 90, dur: 0.06, type: "square", gain: 0.06 }),
	punch: () => tone({ freq: 110, dur: 0.05, type: "square", gain: 0.05 }),
	finalFlash: () => tone({ freq: 500, dur: 0.3, type: "sawtooth", gain: 0.06 }),
	galick: () => tone({ freq: 450, dur: 0.25, type: "sawtooth", gain: 0.05 }),
	over9000: () => tone({ freq: 700, dur: 0.2, type: "triangle", gain: 0.05 }),
	nimbus: () => tone({ freq: 520, dur: 0.15, type: "sine", gain: 0.04 }),
	scream: () => tone({ freq: 900, dur: 0.2, type: "sawtooth", gain: 0.04 }),
	tapion: () => {
		/* file-only placeholder */
	},
	stopTapion: () => {
		/* no-op */
	},
	win: () =>
		sequence([
			{ freq: 523, dur: 0.08 },
			{ freq: 659, dur: 0.08 },
			{ freq: 784, dur: 0.18, type: "triangle", gain: 0.1 },
		]),
	lose: () =>
		sequence([
			{ freq: 220, dur: 0.18, type: "sawtooth", gain: 0.08 },
			{ freq: 165, dur: 0.25, type: "sawtooth", gain: 0.08 },
		]),
	draw: () => tone({ freq: 440, dur: 0.18, type: "triangle", gain: 0.06 }),
};
