/**
 * Bingo — logique pure, sans dépendance Discord.
 * Concept : devine un nombre entre 1 et 100. Le moteur dit "plus haut" / "plus bas".
 * Source de vérité partagée par /bingo (Discord) et `POST /api/games/bingo/*`.
 */

export const BINGO_MIN = 1;
export const BINGO_MAX = 100;
export const BINGO_DEFAULT_TIMEOUT_MS = 60_000;
/**
 * Essais avant défaite sur la partie web (`POST /api/games/bingo/play`).
 *
 * La valeur vivait en dur des deux côtés — `attempts >= 10` dans `api/server.ts`,
 * « / 10 » dans l'écran du site — alors que ce module se présente comme la source
 * de vérité du jeu. La commande Discord, elle, limite par le temps et non par les
 * essais : elle n'utilise pas cette constante.
 */
export const BINGO_MAX_ATTEMPTS = 10;

export type BingoHint = "match" | "higher" | "lower" | "out-of-range";

export function randomBingoTarget(): number {
	return Math.floor(Math.random() * (BINGO_MAX - BINGO_MIN + 1)) + BINGO_MIN;
}

export function compareBingoGuess(guess: number, target: number): BingoHint {
	if (!Number.isInteger(guess) || guess < BINGO_MIN || guess > BINGO_MAX) {
		return "out-of-range";
	}
	if (guess === target) return "match";
	return guess < target ? "higher" : "lower";
}
