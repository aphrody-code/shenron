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
			(window as { webkitAudioContext?: typeof AudioContext })
				.webkitAudioContext;
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
	click: () => tone({ freq: 800, dur: 0.05, type: "square", gain: 0.05 }),
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
