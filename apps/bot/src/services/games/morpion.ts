/**
 * Morpion (tic-tac-toe 3×3) — logique pure, sans dépendance Discord.
 * Source de vérité partagée par /morpion (Discord) et `POST /api/games/morpion/*`.
 */

export type MorpionCell = "." | "X" | "O";
export type MorpionMark = "X" | "O";

export const MORPION_WIN_LINES: ReadonlyArray<readonly [number, number, number]> = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

export type MorpionOutcome =
	| { kind: "playing" }
	| { kind: "won"; mark: MorpionMark; line: readonly number[] }
	| { kind: "draw" };

export function emptyBoard(): MorpionCell[] {
	return Array(9).fill(".") as MorpionCell[];
}

export function evaluateBoard(board: MorpionCell[]): MorpionOutcome {
	for (const line of MORPION_WIN_LINES) {
		const [a, b, c] = line;
		const v = board[a];
		if (v !== "." && v === board[b] && v === board[c]) {
			return { kind: "won", mark: v as MorpionMark, line };
		}
	}
	return board.includes(".") ? { kind: "playing" } : { kind: "draw" };
}

/**
 * IA défensive : gagner > bloquer > centre > coin > random.
 * `botMark` permet de réutiliser le moteur pour le bot jouant X ou O.
 */
export function decideMorpionMove(board: MorpionCell[], botMark: MorpionMark = "O"): number {
	const opponent: MorpionMark = botMark === "O" ? "X" : "O";
	for (const mark of [botMark, opponent] as const) {
		for (const [a, b, c] of MORPION_WIN_LINES) {
			const cells = [board[a], board[b], board[c]];
			if (cells.filter((x) => x === mark).length === 2 && cells.includes(".")) {
				return [a, b, c][cells.indexOf(".")]!;
			}
		}
	}
	if (board[4] === ".") return 4;
	for (const corner of [0, 2, 6, 8]) if (board[corner] === ".") return corner;
	const free = board.map((c, i) => (c === "." ? i : -1)).filter((i) => i >= 0);
	return free[Math.floor(Math.random() * free.length)] ?? 0;
}

/** Applique un coup, valide les bornes et l'occupation. Retourne new board ou erreur. */
export function applyMorpionMove(
	board: MorpionCell[],
	cell: number,
	mark: MorpionMark
): { ok: true; board: MorpionCell[] } | { ok: false; error: string } {
	if (!Number.isInteger(cell) || cell < 0 || cell > 8) {
		return { ok: false, error: "Cellule invalide" };
	}
	if (board[cell] !== ".") {
		return { ok: false, error: "Cellule occupée" };
	}
	const next = board.slice();
	next[cell] = mark;
	return { ok: true, board: next };
}
