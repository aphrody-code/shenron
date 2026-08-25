import { describe, expect, it } from "bun:test";
import { classerDefaut, gravite, noteQualite } from "@/lib/databooks-defauts";

/**
 * Le classement des défauts décide de deux choses visibles : ce que la file de
 * relecture propose de rouvrir, et l'avertissement affiché sous une planche.
 * Les cas ci-dessous viennent tous du corpus réel — c'est pour ça qu'ils sont
 * écrits tels quels plutôt qu'inventés.
 */
describe("classerDefaut", () => {
	it("ne signale rien sur une transcription saine", () => {
		expect(classerDefaut("亀仙人に弟子入りした悟空、クリリンが修行を始めた時刻。")).toBeNull();
	});

	it("repère le signe perdu en plein caractère", () => {
		expect(classerDefaut("カプセルコー�")).toBe("remplacement");
	});

	it("repère un alphabet halluciné au milieu du japonais", () => {
		// « S・S・デッドリイюンバー » — un ю cyrillique sorti de nulle part.
		expect(classerDefaut("得意技はS・S・デッドリイюンバー。")).toBe("etranger");
	});

	it("repère du faux chinois (idéogrammes sans un seul kana)", () => {
		expect(classerDefaut("同时也进行了攻击")).toBe("han-sans-kana");
	});

	it("repère la boucle du modèle", () => {
		expect(classerDefaut("いるかといますいるかといますいるかといます")).toBe("boucle");
	});

	it("distingue une planche muette d'une planche à peine lisible", () => {
		expect(classerDefaut("")).toBe("vide");
		expect(classerDefaut("1992")).toBe("courte");
	});

	it("ne prend pas une page réellement latine pour un défaut", () => {
		expect(classerDefaut("SHUEISHA 1995 Printed in Japan — ISBN4-08-782752-6")).toBeNull();
	});
});

describe("noteQualite", () => {
	it("fait gagner le texte sain sur le texte fautif, même plus long", () => {
		const fautif = "レベルアップ".repeat(50);
		const sain = "オリジナルキャラクター";
		expect(noteQualite(sain)).toBeGreaterThan(noteQualite(fautif));
	});

	it("départage deux textes de même rang par la longueur", () => {
		expect(noteQualite("孫悟空とベジータが戦う場面。")).toBeGreaterThan(
			noteQualite("孫悟空が戦う。")
		);
	});
});

describe("gravite", () => {
	it("compte les signes fautifs pour trier le pire d'abord", () => {
		expect(gravite("あ�い�う�", "remplacement")).toBe(3);
		expect(gravite("デッドリイюンバーとспособ", "etranger")).toBeGreaterThan(1);
	});
});
