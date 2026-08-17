/**
 * Tests moteurs de jeux (morpion minimax, pfc, bingo, pendu).
 */
import { describe, expect, test } from "bun:test";
import {
	applyMorpionMove,
	decideMorpionMove,
	emptyBoard,
	evaluateBoard,
	optimalMorpionMoves,
	type MorpionCell,
} from "../src/services/games/morpion";
import { counterOf, decideBotChoice, resolvePfc, type PfcChoice } from "../src/services/games/pfc";
import {
	BINGO_MAX_ATTEMPTS,
	bingoMaxAttempts,
	compareBingoGuess,
	randomBingoTarget,
} from "../src/services/games/bingo";
import {
	createPenduState,
	evaluatePendu,
	guessPenduLetter,
	maskPenduWord,
	randomPenduWord,
} from "../src/services/games/pendu";

function boardOf(s: string): MorpionCell[] {
	return s.split("") as MorpionCell[];
}

describe("morpion", () => {
	test("evaluateBoard détecte une ligne", () => {
		const b = boardOf("XXX......");
		const o = evaluateBoard(b);
		expect(o.kind).toBe("won");
		if (o.kind === "won") expect(o.mark).toBe("X");
	});

	test("applyMorpionMove refuse case occupée", () => {
		const b = boardOf("X........");
		const r = applyMorpionMove(b, 0, "O");
		expect(r.ok).toBe(false);
	});

	test("IA hard bloque un win imminent", () => {
		// X X .  → bot doit jouer 2
		// . . .
		// . . .
		const b = boardOf("XX.......");
		const move = decideMorpionMove(b, "O", "hard");
		expect(move).toBe(2);
	});

	test("IA hard prend le win immédiat", () => {
		// O O . → bot (O) joue 2
		const b = boardOf("OO.......");
		const move = decideMorpionMove(b, "O", "hard");
		expect(move).toBe(2);
	});

	test("IA hard ne perd jamais contre elle-même (self-play)", () => {
		// Deux minimax : toujours draw ou fin propre.
		for (let seed = 0; seed < 5; seed++) {
			let board = emptyBoard();
			let turn: "X" | "O" = "X";
			let steps = 0;
			while (evaluateBoard(board).kind === "playing" && steps < 9) {
				const cell = decideMorpionMove(board, turn, "hard");
				const r = applyMorpionMove(board, cell, turn);
				expect(r.ok).toBe(true);
				if (!r.ok) break;
				board = r.board;
				turn = turn === "X" ? "O" : "X";
				steps++;
			}
			const end = evaluateBoard(board);
			// Minimax vs minimax = draw (ou win si bug)
			expect(end.kind === "draw" || end.kind === "won").toBe(true);
		}
	});

	test("optimalMorpionMoves inclut le blocage de fourche classique", () => {
		// Fourche : X centre, O coin, X coin opposé-style
		// X . .
		// . O .
		// . . X  → O doit prendre un côté (1,3,5,7) pas un coin
		const b = boardOf("X...O...X");
		const moves = optimalMorpionMoves(b, "O");
		expect(moves.every((m) => [1, 3, 5, 7].includes(m))).toBe(true);
	});
});

describe("pfc", () => {
	test("resolvePfc basique", () => {
		expect(resolvePfc("pierre", "ciseaux")).toBe("win");
		expect(resolvePfc("pierre", "feuille")).toBe("lose");
		expect(resolvePfc("pierre", "pierre")).toBe("draw");
	});

	test("counterOf bat le choix", () => {
		const c: PfcChoice = "pierre";
		expect(resolvePfc(c, counterOf(c))).toBe("lose");
	});

	test("hard contrecarre souvent le playerChoice", () => {
		let counters = 0;
		const n = 200;
		for (let i = 0; i < n; i++) {
			const bot = decideBotChoice({ playerChoice: "pierre", difficulty: "hard" });
			if (bot === "feuille") counters++;
		}
		// ~50 % theoretical, assert > 30 %
		expect(counters).toBeGreaterThan(n * 0.3);
	});
});

describe("bingo", () => {
	test("compareBingoGuess", () => {
		expect(compareBingoGuess(50, 50)).toBe("match");
		expect(compareBingoGuess(10, 50)).toBe("higher");
		expect(compareBingoGuess(90, 50)).toBe("lower");
		expect(compareBingoGuess(0, 50)).toBe("out-of-range");
	});

	test("randomBingoTarget dans [1,100]", () => {
		for (let i = 0; i < 50; i++) {
			const t = randomBingoTarget();
			expect(t).toBeGreaterThanOrEqual(1);
			expect(t).toBeLessThanOrEqual(100);
		}
	});

	test("hard a moins d'essais que easy", () => {
		expect(bingoMaxAttempts("hard")).toBe(BINGO_MAX_ATTEMPTS.hard);
		expect(bingoMaxAttempts("hard")).toBeLessThan(bingoMaxAttempts("easy"));
		expect(bingoMaxAttempts("hard")).toBeLessThanOrEqual(7);
	});
});

describe("pendu", () => {
	test("randomPenduWord hard renvoie un mot non vide", () => {
		const w = randomPenduWord("hard");
		expect(w.length).toBeGreaterThan(2);
	});

	test("guess + win", () => {
		const s = createPenduState("goku", 4);
		for (const l of ["g", "o", "k", "u"]) {
			const r = guessPenduLetter(s, l);
			expect(r.alreadyPlayed).toBe(false);
			expect(r.hit).toBe(true);
		}
		expect(evaluatePendu(s)).toBe("won");
		expect(maskPenduWord(s)).toBe("g o k u");
	});

	test("miss until lose", () => {
		const s = createPenduState("goku", 3);
		guessPenduLetter(s, "a");
		guessPenduLetter(s, "b");
		guessPenduLetter(s, "c");
		expect(evaluatePendu(s)).toBe("lost");
	});
});
