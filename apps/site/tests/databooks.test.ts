/**
 * Databooks — normalisation des pages et garde d'identifiant.
 *
 * `bot.db_databooks.pages` est un jsonb : il a déjà été écrit en scalaire par le
 * passé (piège `sql.json` documenté dans CLAUDE.md), et 21 des 318 fiches n'ont
 * aucune page. Le lecteur ne doit jamais tomber là-dessus.
 *
 * L'identifiant, lui, arrivait en `parseInt(segment, 10)` : `/wiki/databooks/abc`
 * produisait `NaN`, Postgres rejetait `NaN` sur un `bigint`, et l'erreur était
 * avalée par `safe()` — un 404 finissait par s'afficher, après un aller-retour
 * base inutile et une ligne d'erreur par URL malformée.
 */
import { describe, expect, test } from "bun:test";
import { normalizePages, parseDatabookId } from "../src/lib/databooks-rules";

describe("normalizePages", () => {
	test("une valeur non tableau ne casse rien", () => {
		for (const v of [null, undefined, "pages", 42, { 0: "x" }]) {
			expect(normalizePages(v)).toEqual([]);
		}
	});

	test("les entrées non exploitables sont écartées", () => {
		expect(normalizePages([null, "x", 3, { number: 1, image: "a.jpg", text: null }])).toEqual([
			{ number: 1, image: "a.jpg", text: null },
		]);
	});

	test("un numéro absent ou aberrant retombe sur le rang", () => {
		const r = normalizePages([{ image: "a.jpg" }, { number: -4, image: "b.jpg" }]);
		expect(r.map((p) => p.number)).toEqual([1, 2]);
	});

	test("les chaînes vides deviennent null (pas de page fantôme au rendu)", () => {
		const [p] = normalizePages([{ number: 1, image: "   ", text: "" }]);
		expect(p).toEqual({ number: 1, image: null, text: null });
	});

	test("un numéro décimal est tronqué", () => {
		expect(normalizePages([{ number: 3.9, image: "a.jpg" }])[0]!.number).toBe(3);
	});
});

describe("garde d'identifiant", () => {
	test("accepte un entier positif", () => {
		expect(parseDatabookId("42")).toBe(42);
	});

	test("rejette tout ce qui ferait un NaN ou un bigint invalide côté Postgres", () => {
		for (const v of ["abc", "1abc", "-1", "0", "", " 1", "1.5", "1e3", "999999999999999999999"]) {
			expect(parseDatabookId(v)).toBeNull();
		}
	});
});
