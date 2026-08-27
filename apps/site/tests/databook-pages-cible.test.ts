/**
 * Ciblage d'une planche de databook (`pages#42`).
 *
 * C'est ce qui ouvre les 1 911 transcriptions fautives à la correction
 * communautaire. Une erreur ici laisse passer une cible qui n'existe pas — ou,
 * pire, en refuse une valide et referme la porte sans le dire.
 */
import { describe, expect, test } from "bun:test";
import { estCiblePlanche, numeroDePlanche, PREFIXE_PLANCHE } from "@/lib/databook-pages-shared";

describe("numeroDePlanche", () => {
	test("lit le numéro d'une cible bien formée", () => {
		expect(numeroDePlanche("pages#42")).toBe(42);
		expect(numeroDePlanche("pages#1")).toBe(1);
	});

	test("refuse ce qui n'est pas un numéro de planche", () => {
		for (const c of ["article", "pages", "pages#", "pages#0", "pages#-3", "pages#1.5", "pages#abc"]) {
			expect(numeroDePlanche(c)).toBeNull();
		}
	});

	test("le préfixe est celui qu'on croit", () => {
		expect(PREFIXE_PLANCHE).toBe("pages#");
	});
});

describe("estCiblePlanche", () => {
	test("ne vaut que pour les databooks", () => {
		expect(estCiblePlanche("db_databooks", "pages#7")).toBe(true);
		// Une autre table avec un jsonb `pages` (chapitres de manga) ne doit pas
		// hériter du droit par accident.
		expect(estCiblePlanche("db_manga_chapters", "pages#7")).toBe(false);
		expect(estCiblePlanche("db_characters", "pages#7")).toBe(false);
	});

	test("une colonne ordinaire de databook n'est pas une planche", () => {
		expect(estCiblePlanche("db_databooks", "description")).toBe(false);
		expect(estCiblePlanche("db_databooks", "pages")).toBe(false);
	});
});
