/**
 * Moteurs de jeux — morpion, pierre-feuille-ciseaux, bingo, pendu.
 *
 * Ce fichier ne s'exécutait PLUS DU TOUT : il importait `optimalMorpionMoves`,
 * `counterOf`, `bingoMaxAttempts` et un `BINGO_MAX_ATTEMPTS` par niveau, et
 * appelait `decideMorpionMove(b, "O", "hard")` / `decideBotChoice({ difficulty })`
 * / `randomPenduWord("hard")` — une notion de « difficulté » qui n'a jamais
 * existé dans ces modules. Bun échouait à charger le fichier (`SyntaxError` sur
 * l'import), donc les quatre suites étaient silencieusement absentes du total.
 *
 * Réécrit contre l'API réelle. L'IA du morpion n'est pas un minimax mais une
 * heuristique « gagner > bloquer > centre > coin > aléatoire » : c'est cette
 * priorité-là qui est vérifiée.
 */
import { describe, expect, test } from "bun:test";
import {
	applyMorpionMove,
	decideMorpionMove,
	emptyBoard,
	evaluateBoard,
	type MorpionCell,
} from "../src/services/games/morpion";
import { PFC_CHOICES, decideBotChoice, isPfcChoice, resolvePfc } from "../src/services/games/pfc";
import {
	BINGO_MAX,
	BINGO_MAX_ATTEMPTS,
	BINGO_MIN,
	compareBingoGuess,
	randomBingoTarget,
} from "../src/services/games/bingo";
import {
	PENDU_MAX_ERRORS_DEFAULT,
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
		const o = evaluateBoard(boardOf("XXX......"));
		expect(o.kind).toBe("won");
		if (o.kind === "won") expect(o.mark).toBe("X");
	});

	test("evaluateBoard distingue partie en cours et match nul", () => {
		expect(evaluateBoard(emptyBoard()).kind).toBe("playing");
		// Grille pleine sans alignement.
		expect(evaluateBoard(boardOf("XXOOOXXOX")).kind).toBe("draw");
	});

	test("applyMorpionMove refuse une case occupée et les hors-bornes", () => {
		expect(applyMorpionMove(boardOf("X........"), 0, "O").ok).toBe(false);
		expect(applyMorpionMove(emptyBoard(), -1, "O").ok).toBe(false);
		expect(applyMorpionMove(emptyBoard(), 9, "O").ok).toBe(false);
	});

	test("applyMorpionMove ne mute pas la grille passée", () => {
		const avant = emptyBoard();
		const r = applyMorpionMove(avant, 4, "X");
		expect(r.ok).toBe(true);
		expect(avant[4]).toBe(".");
	});

	test("l'IA prend le gain immédiat", () => {
		expect(decideMorpionMove(boardOf("OO......."), "O")).toBe(2);
	});

	test("l'IA bloque le gain adverse", () => {
		expect(decideMorpionMove(boardOf("XX......."), "O")).toBe(2);
	});

	test("gagner passe avant bloquer", () => {
		// O peut gagner en 2 ; X menace en 5. L'IA doit conclure, pas défendre.
		expect(decideMorpionMove(boardOf("OO.XX...."), "O")).toBe(2);
	});

	test("sans menace, l'IA prend le centre puis un coin", () => {
		expect(decideMorpionMove(emptyBoard(), "O")).toBe(4);
		expect([0, 2, 6, 8]).toContain(decideMorpionMove(boardOf("....X...."), "O"));
	});

	test("une partie IA contre IA se termine toujours proprement", () => {
		for (let partie = 0; partie < 20; partie++) {
			let board = emptyBoard();
			let tour: "X" | "O" = "X";
			let coups = 0;
			while (evaluateBoard(board).kind === "playing" && coups < 9) {
				const r = applyMorpionMove(board, decideMorpionMove(board, tour), tour);
				expect(r.ok).toBe(true);
				if (!r.ok) break;
				board = r.board;
				tour = tour === "X" ? "O" : "X";
				coups++;
			}
			expect(["draw", "won"]).toContain(evaluateBoard(board).kind);
		}
	});
});

describe("pierre-feuille-ciseaux", () => {
	test("resolvePfc couvre le cycle complet", () => {
		expect(resolvePfc("pierre", "ciseaux")).toBe("win");
		expect(resolvePfc("ciseaux", "feuille")).toBe("win");
		expect(resolvePfc("feuille", "pierre")).toBe("win");
		expect(resolvePfc("pierre", "feuille")).toBe("lose");
		for (const c of PFC_CHOICES) expect(resolvePfc(c, c)).toBe("draw");
	});

	test("le bot ne joue que des coups valides, et les trois", () => {
		const vus = new Set<string>();
		for (let i = 0; i < 300; i++) {
			const c = decideBotChoice();
			expect(isPfcChoice(c)).toBe(true);
			vus.add(c);
		}
		// Tirage uniforme : les trois coups doivent apparaître sur 300 essais.
		expect(vus.size).toBe(3);
	});

	test("isPfcChoice rejette n'importe quoi", () => {
		expect(isPfcChoice("papier")).toBe(false);
		expect(isPfcChoice(null)).toBe(false);
		expect(isPfcChoice(42)).toBe(false);
	});
});

describe("bingo", () => {
	test("compareBingoGuess", () => {
		expect(compareBingoGuess(50, 50)).toBe("match");
		expect(compareBingoGuess(10, 50)).toBe("higher");
		expect(compareBingoGuess(90, 50)).toBe("lower");
	});

	test("les bornes sont cohérentes avec le tirage", () => {
		expect(BINGO_MIN).toBeLessThan(BINGO_MAX);
		for (let i = 0; i < 200; i++) {
			const t = randomBingoTarget();
			expect(t).toBeGreaterThanOrEqual(BINGO_MIN);
			expect(t).toBeLessThanOrEqual(BINGO_MAX);
			expect(Number.isInteger(t)).toBe(true);
		}
	});

	test("hors bornes et non-entiers sont rejetés", () => {
		expect(compareBingoGuess(BINGO_MIN - 1, 50)).toBe("out-of-range");
		expect(compareBingoGuess(BINGO_MAX + 1, 50)).toBe("out-of-range");
		expect(compareBingoGuess(12.5, 50)).toBe("out-of-range");
		expect(compareBingoGuess(Number.NaN, 50)).toBe("out-of-range");
	});

	test("le plafond d'essais est partagé avec l'API", () => {
		// `api/server.ts` compare `attempts >= BINGO_MAX_ATTEMPTS` : la valeur
		// vivait en dur des deux côtés avant d'être hissée dans ce module.
		expect(BINGO_MAX_ATTEMPTS).toBe(10);
	});
});

describe("pendu", () => {
	test("randomPenduWord renvoie un mot du dictionnaire", () => {
		const w = randomPenduWord();
		expect(w.length).toBeGreaterThan(2);
		expect(w).toBe(w.toLowerCase());
	});

	test("deviner toutes les lettres gagne la partie", () => {
		const s = createPenduState("goku", 4);
		for (const l of ["g", "o", "k", "u"]) {
			const r = guessPenduLetter(s, l);
			expect(r).toEqual({ hit: true, alreadyPlayed: false });
		}
		expect(evaluatePendu(s)).toBe("won");
		expect(maskPenduWord(s)).toBe("g o k u");
	});

	test("assez d'erreurs et la partie est perdue", () => {
		const s = createPenduState("goku", 3);
		for (const l of ["a", "b", "c"]) guessPenduLetter(s, l);
		expect(evaluatePendu(s)).toBe("lost");
	});

	test("rejouer une lettre ne consomme pas d'essai", () => {
		const s = createPenduState("goku", 3);
		guessPenduLetter(s, "a");
		expect(guessPenduLetter(s, "a")).toEqual({ hit: false, alreadyPlayed: true });
		expect(s.missed.size).toBe(1);
		expect(evaluatePendu(s)).toBe("playing");
	});

	test("une saisie qui n'est pas une lettre est ignorée", () => {
		const s = createPenduState("goku");
		expect(s.maxErrors).toBe(PENDU_MAX_ERRORS_DEFAULT);
		for (const saisie of ["1", "", "ab", "é", "-"]) {
			expect(guessPenduLetter(s, saisie)).toEqual({ hit: false, alreadyPlayed: true });
		}
		expect(s.missed.size).toBe(0);
	});

	test("le masque ne révèle que les lettres trouvées", () => {
		const s = createPenduState("goku", 6);
		guessPenduLetter(s, "o");
		expect(maskPenduWord(s)).toBe("_ o _ _");
		expect(maskPenduWord(s, "·")).toBe("· o · ·");
	});
});
