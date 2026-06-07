/**
 * Pendu — logique pure, sans dépendance Discord.
 * Source de vérité partagée par /pendu (Discord) et `POST /api/games/pendu/*`.
 */

export const PENDU_WORDS = [
	"kamehameha",
	"saiyan",
	"genkidama",
	"namek",
	"capsule",
	"dragonball",
	"chichi",
	"vegeta",
	"freezer",
	"cell",
	"bulma",
	"broly",
	"majinbuu",
	"piccolo",
	"tortue",
	"orange",
	"goku",
] as const;

export const PENDU_MAX_ERRORS_DEFAULT = 6;

export const PENDU_HANGMAN_FRAMES = [
	"        \n        \n        \n        \n        \n========",
	"  +---+\n  |   |\n      |\n      |\n      |\n========",
	"  +---+\n  |   |\n  O   |\n      |\n      |\n========",
	"  +---+\n  |   |\n  O   |\n  |   |\n      |\n========",
	"  +---+\n  |   |\n  O   |\n /|   |\n      |\n========",
	"  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n========",
	"  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n========",
] as const;

export type PenduState = {
	word: string;
	found: Set<string>;
	missed: Set<string>;
	maxErrors: number;
};

export function randomPenduWord(): string {
	return PENDU_WORDS[Math.floor(Math.random() * PENDU_WORDS.length)]!;
}

export function createPenduState(word: string, maxErrors = PENDU_MAX_ERRORS_DEFAULT): PenduState {
	return {
		word: word.toLowerCase(),
		found: new Set(),
		missed: new Set(),
		maxErrors: Math.max(3, Math.min(6, maxErrors)),
	};
}

export type PenduOutcome = "playing" | "won" | "lost";

export function evaluatePendu(state: PenduState): PenduOutcome {
	if ([...state.word].every((c) => state.found.has(c))) return "won";
	if (state.missed.size >= state.maxErrors) return "lost";
	return "playing";
}

/**
 * Joue une lettre. Retourne `{hit, alreadyPlayed}`. Mute state in place.
 * `letter` doit déjà être minuscule lettre unique.
 */
export function guessPenduLetter(
	state: PenduState,
	letter: string
): { hit: boolean; alreadyPlayed: boolean } {
	const l = letter.toLowerCase();
	if (!/^[a-z]$/.test(l)) {
		return { hit: false, alreadyPlayed: true };
	}
	if (state.found.has(l) || state.missed.has(l)) {
		return { hit: false, alreadyPlayed: true };
	}
	if (state.word.includes(l)) {
		state.found.add(l);
		return { hit: true, alreadyPlayed: false };
	}
	state.missed.add(l);
	return { hit: false, alreadyPlayed: false };
}

/** Mot affiché avec underscores pour les non-devinées. */
export function maskPenduWord(state: PenduState, hidden = "_"): string {
	return [...state.word].map((c) => (state.found.has(c) ? c : hidden)).join(" ");
}

/** ASCII frame courant. */
export function penduFrame(state: PenduState): string {
	const idx = Math.min(state.missed.size, PENDU_HANGMAN_FRAMES.length - 1);
	return PENDU_HANGMAN_FRAMES[idx]!;
}
