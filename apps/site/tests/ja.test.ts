/**
 * Règles japonaises — normalisation et détection des fautes de lecture.
 *
 * Les cas viennent tous du corpus réel des databooks, mesuré le 2026-08-22 :
 * 5 302 planches transcrites depuis des scans japonais par un modèle de vision.
 * Chaque test verrouille une décision prise sur la foi d'une mesure, et la
 * plupart correspondent à un faux positif observé puis corrigé — ils échouent
 * si l'on revient en arrière.
 *
 * Rien ici ne charge de dictionnaire : ces règles sont pures, et c'est
 * exactement pour cela qu'elles sont testables.
 */
import { describe, expect, test } from "bun:test";
import {
	besoinFurigana,
	contientJaponais,
	katakanaVersHiragana,
	normaliserJa,
	proportionJaponais,
} from "../src/lib/ja/normalisation";
import {
	distanceBornee,
	indexerLexique,
	retenirParFrequence,
	suggerer,
	trierLexique,
	type TermeLexique,
} from "../src/lib/ja/anomalies";

const LEXIQUE: TermeLexique[] = trierLexique([
	{ ja: "ベジータ", fr: "Vegeta", kind: "personnage" },
	{ ja: "ベジータ王", fr: "Roi Vegeta", kind: "personnage" },
	{ ja: "ゴジータ", fr: "Gogeta", kind: "personnage" },
	{ ja: "ブルマ", fr: "Bulma", kind: "personnage" },
	{ ja: "ピッコロ", fr: "Piccolo", kind: "personnage" },
	{ ja: "トランクス", fr: "Trunks", kind: "personnage" },
	{ ja: "サイヤ人", fr: "Saiyan", kind: "race" },
	{ ja: "ミスター·ポポ", fr: "Mr. Popo", kind: "personnage" },
]);
const INDEX = indexerLexique(LEXIQUE);

describe("normalisation", () => {
	test("reconnaît les trois écritures", () => {
		expect(contientJaponais("ひらがな")).toBe(true);
		expect(contientJaponais("カタカナ")).toBe(true);
		expect(contientJaponais("漢字")).toBe(true);
		expect(contientJaponais("Toriyama")).toBe(false);
	});

	test("mesure la part de japonais d'un texte mixte", () => {
		// Les planches mêlent japonais, titres latins et chiffres : le corpus
		// mesuré est à 60 % de signes japonais, pas 100 %.
		expect(proportionJaponais("孫悟空")).toBe(1);
		expect(proportionJaponais("DRAGON BALL")).toBe(0);
		expect(proportionJaponais("孫悟空 GOKU")).toBeGreaterThan(0);
	});

	test("retire les trois points médians et les espaces", () => {
		// Le lexique écrit « ミスター·ポポ », le corpus « ミスターポポ ».
		expect(normaliserJa("ミスター·ポポ")).toBe("ミスターポポ");
		expect(normaliserJa("ミスター・ポポ")).toBe("ミスターポポ");
		expect(normaliserJa("ミスター･ポポ")).toBe("ミスターポポ");
	});

	test("convertit les lectures katakana en hiragana", () => {
		// kuromoji rend « ソンゴクウ », le furigana s'écrit « そんごくう ».
		expect(katakanaVersHiragana("ソンゴクウ")).toBe("そんごくう");
		// Le signe de prolongation n'appartient pas à la plage convertie.
		expect(katakanaVersHiragana("ベジータ")).toBe("べじーた");
	});

	test("n'annote que ce qui porte un kanji", () => {
		expect(besoinFurigana("界王拳", "カイオウケン")).toBe(true);
		// Déjà en kana : une lecture n'apprendrait rien.
		expect(besoinFurigana("ベジータ", "ベジータ")).toBe(false);
		expect(besoinFurigana("孫悟空", null)).toBe(false);
	});
});

describe("distance bornée", () => {
	test("compte les signes à changer", () => {
		expect(distanceBornee("フルマ", "ブルマ", 2)).toBe(1);
		expect(distanceBornee("ブルマ", "ブルマ", 2)).toBe(0);
	});

	test("abandonne au-delà du seuil au lieu de calculer la vraie distance", () => {
		// La valeur exacte n'a pas d'intérêt : seul compte « ça dépasse ».
		expect(distanceBornee("アイウエオ", "カキクケコ", 2)).toBeGreaterThan(2);
	});
});

describe("suggestion de correction", () => {
	test("repère une faute d'un signe sur un nom connu", () => {
		expect(suggerer("フルマ", LEXIQUE, INDEX)?.attendu).toBe("ブルマ");
		expect(suggerer("ビッコロ", LEXIQUE, INDEX)?.attendu).toBe("ピッコロ");
	});

	test("ne corrige pas une graphie qui EST au lexique", () => {
		// Régression : « ベジータ » se faisait corriger en « ベジータ王 », le
		// lexique étant parcouru du plus long au plus court et la recherche
		// s'arrêtant au premier voisin trouvé.
		expect(suggerer("ベジータ", LEXIQUE, INDEX)).toBeNull();
	});

	test("ne prend pas un morceau de terme connu pour une faute", () => {
		// L'analyseur ne connaît pas « トランクス » et le découpe : « ンクス »
		// remontait 105 fois comme mot inconnu, et se faisait « corriger ».
		expect(suggerer("ンクス", LEXIQUE, INDEX)).toBeNull();
		expect(suggerer("サイヤ", LEXIQUE, INDEX)).toBeNull();
	});

	test("départage deux voisins par leur poids", () => {
		// « ペジータ » est à un signe de ベジータ comme de ゴジータ. Sans poids,
		// l'ordre du lexique décidait — et donnait Gogeta.
		const poids = (ja: string) => (ja === "ベジータ" ? 197 : ja === "ゴジータ" ? 13 : 0);
		expect(suggerer("ペジータ", LEXIQUE, INDEX, poids)?.fr).toBe("Vegeta");
	});

	test("compare en forme normalisée", () => {
		// « ミスターボポ » vs « ミスター·ポポ » : un signe d'écart, plus le point médian.
		expect(suggerer("ミスターボポ", LEXIQUE, INDEX)?.fr).toBe("Mr. Popo");
	});

	test("ne suggère rien sous trois signes", () => {
		// À cette longueur tout ressemble à tout.
		expect(suggerer("ンク", LEXIQUE, INDEX)).toBeNull();
	});
});

describe("filtre par fréquence", () => {
	const s = { lu: "コミックス", attendu: "コニック", fr: "Cognic", kind: "personnage", distance: 2 };

	test("écarte une correction vers un terme absent du corpus", () => {
		// « コミックス » (comics) est un mot japonais réel ; « コニック »
		// n'apparaît nulle part. La correction n'a aucun sens.
		expect(retenirParFrequence(s, (g) => (g === "コミックス" ? 28 : 0))).toBe(false);
	});

	test("garde une correction vers une forme qui domine", () => {
		const vegeta = { lu: "ペジータ", attendu: "ベジータ", fr: "Vegeta", kind: "personnage", distance: 1 };
		expect(retenirParFrequence(vegeta, (g) => (g === "ベジータ" ? 197 : 10))).toBe(true);
	});
});
