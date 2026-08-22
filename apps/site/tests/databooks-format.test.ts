/**
 * Règles de mise en forme et de diagnostic des transcriptions de databooks.
 *
 * Les cas viennent du corpus réel, mesuré le 2026-08-22 sur les 5 302 planches
 * déjà transcrites : 121 planches contenant le caractère de remplacement,
 * 87 sous 15 signes, 75 avec des espaces multiples, 20 avec des lignes vides en
 * rafale, 18 avec des espaces en fin de ligne.
 *
 * Ce qui est vraiment sous test, c'est la frontière entre les deux familles de
 * défauts : `nettoyerOcr` ne doit corriger QUE la mise en forme, et ne jamais
 * toucher au texte lu — sinon la relecture porterait sur un texte que la
 * machine a réinterprété une seconde fois.
 */
import { describe, expect, test } from "bun:test";
import {
	aBesoinDeNettoyage,
	diagnostiquerPlanche,
	extraireSegments,
	nettoyerOcr,
} from "../src/lib/databooks-format";

describe("nettoyerOcr", () => {
	test("réduit les espaces multiples sans toucher à l'indentation", () => {
		expect(nettoyerOcr("孫悟空   と   ベジータ")).toBe("孫悟空 と ベジータ");
		// L'indentation porte la structure markdown (liste imbriquée, bloc de code) :
		// la raboter change le rendu.
		expect(nettoyerOcr("- a\n    - b")).toBe("- a\n    - b");
	});

	test("supprime les espaces en fin de ligne et normalise les fins de ligne", () => {
		expect(nettoyerOcr("ligne  \nautre\t\n")).toBe("ligne\nautre");
		expect(nettoyerOcr("a\r\nb\rc")).toBe("a\nb\nc");
	});

	test("ramène les sauts de ligne en rafale à un paragraphe vide", () => {
		expect(nettoyerOcr("un\n\n\n\n\ndeux")).toBe("un\n\ndeux");
		expect(nettoyerOcr("un\n\ndeux")).toBe("un\n\ndeux");
	});

	test("ne modifie ni les caractères, ni la ponctuation, ni les titres markdown", () => {
		const source = "# 「ドラゴンボール」関連本\n\n定価1600円(税込)!!";
		expect(nettoyerOcr(source)).toBe(source);
	});

	test("est idempotent", () => {
		const sale = "  # titre   \n\n\n\ncorps  avec   espaces  \n";
		const propre = nettoyerOcr(sale);
		expect(nettoyerOcr(propre)).toBe(propre);
	});

	test("aBesoinDeNettoyage ne signale rien sur un texte déjà propre", () => {
		expect(aBesoinDeNettoyage("# titre\n\ncorps")).toBe(false);
		expect(aBesoinDeNettoyage("corps  double")).toBe(true);
	});
});

describe("diagnostiquerPlanche", () => {
	test("un texte vide ou absent ne produit aucune anomalie", () => {
		expect(diagnostiquerPlanche(null)).toEqual([]);
		expect(diagnostiquerPlanche("")).toEqual([]);
		expect(diagnostiquerPlanche("   ")).toEqual([]);
	});

	test("signale les glyphes que le modèle n'a pas su lire", () => {
		const codes = diagnostiquerPlanche("鳥山明の�画�").map((a) => a.code);
		expect(codes).toContain("remplacement");
		// Aucun nettoyage ne répare une lecture ratée : il faut rouvrir le scan.
		const anomalie = diagnostiquerPlanche("鳥山明の�画").find((a) => a.code === "remplacement");
		expect(anomalie?.reparable).toBe(false);
	});

	test("signale une lecture trop courte", () => {
		expect(diagnostiquerPlanche("てんかすみ").map((a) => a.code)).toContain("tres-court");
		expect(diagnostiquerPlanche("あ".repeat(40)).map((a) => a.code)).not.toContain("tres-court");
	});

	test("signale une ligne longue répétée trois fois", () => {
		const boucle = "音楽 声優：古谷 徹 ヤング\n".repeat(3);
		expect(diagnostiquerPlanche(boucle).map((a) => a.code)).toContain("repetition");
	});

	test("ne prend pas une ligne courte répétée pour une boucle", () => {
		// Colonnes de tableau, numéros, noms : se répètent légitimement.
		const tableau = "悟空\n悟空\n悟空\n悟空\nベジータ";
		expect(diagnostiquerPlanche(tableau).map((a) => a.code)).not.toContain("repetition");
	});

	test("classe la mise en forme comme réparable, la qualité de lecture non", () => {
		const anomalies = diagnostiquerPlanche("これは十分に長い日本語のテキストです  余分な空白あり");
		const miseEnForme = anomalies.find((a) => a.code === "mise-en-forme");
		expect(miseEnForme?.reparable).toBe(true);
	});
});

describe("extraireSegments", () => {
	test("isole le terme cherché", () => {
		const segments = extraireSegments("ギニュー特戦隊が登場する", "特戦隊", { contexte: 5 });
		expect(segments.filter((s) => s.correspond).map((s) => s.texte)).toEqual(["特戦隊"]);
		// Le texte reste intégralement reconstituable : rien n'est perdu ni dupliqué.
		expect(segments.map((s) => s.texte).join("")).toContain("特戦隊が登場");
	});

	test("borne le nombre d'occurrences remontées", () => {
		const texte = "goku ".repeat(10);
		const segments = extraireSegments(texte, "goku", { max: 2 });
		expect(segments.filter((s) => s.correspond)).toHaveLength(2);
	});

	test("ignore la casse sur le texte latin", () => {
		const segments = extraireSegments("Akira Toriyama", "toriyama");
		expect(segments.filter((s) => s.correspond).map((s) => s.texte)).toEqual(["Toriyama"]);
	});

	test("sans correspondance, renvoie un début de texte non surligné", () => {
		const segments = extraireSegments("鳥山明", "ベジータ");
		expect(segments.every((s) => !s.correspond)).toBe(true);
	});

	test("un terme vide ne surligne rien", () => {
		expect(extraireSegments("texte", "  ").every((s) => !s.correspond)).toBe(true);
	});
});
