/**
 * Noms propres Dragon Ball mal lus — chaque garde testée, y compris (surtout)
 * les cas où la table ne DOIT pas s'appliquer. Tous les textes viennent du
 * corpus réel de dragonballfr.com, mesuré le 2026-08-25.
 */
import { describe, expect, test } from "bun:test";
import {
	NOMS_PROPRES_MAL_LUS,
	corrigerNomsPropres,
	detaillerNomsPropres,
} from "../src/lib/databooks-ocr/noms-propres";

describe("table des noms propres", () => {
	test("chaque paire retenue est corrigée quand elle forme un mot entier", () => {
		for (const f of NOMS_PROPRES_MAL_LUS) {
			const { texte, corrections } = detaillerNomsPropres(f.lu);
			expect(texte).toBe(f.correct);
			expect(corrections).toBe(1);
		}
	});

	test("aucune forme juste n'est elle-même une forme fautive", () => {
		// Sans quoi la table bougerait : A vers B, puis B vers C. C'est aussi
		// ce qui rend l'idempotence vraie plutôt qu'espérée.
		const fautives = new Set(NOMS_PROPRES_MAL_LUS.map((f) => f.lu));
		for (const f of NOMS_PROPRES_MAL_LUS) {
			expect(fautives.has(f.correct)).toBe(false);
		}
	});

	test("aucune forme juste n'est réécrite par la table", () => {
		// Le test qui interdit le scénario le plus coûteux : corriger un nom
		// déjà correct vers un autre personnage.
		for (const f of NOMS_PROPRES_MAL_LUS) {
			const { texte, corrections } = detaillerNomsPropres(f.correct);
			expect(texte).toBe(f.correct);
			expect(corrections).toBe(0);
		}
	});

	test("aucune graphie fautive n'apparaît deux fois", () => {
		const vues = new Set(NOMS_PROPRES_MAL_LUS.map((f) => f.lu));
		expect(vues.size).toBe(NOMS_PROPRES_MAL_LUS.length);
	});

	test("toute paire diffère par exactement un kana, à longueur égale", () => {
		// La classe traitée est la confusion sourde/sonore : un kana bascule,
		// la longueur ne change pas. Une paire qui violerait ça relèverait
		// d'une autre passe et n'a rien à faire ici.
		for (const f of NOMS_PROPRES_MAL_LUS) {
			const a = [...f.lu];
			const b = [...f.correct];
			expect(a.length).toBe(b.length);
			const differences = a.filter((c, i) => c !== b[i]).length;
			expect(differences).toBe(1);
		}
	});

	test("les quatre cibles non attestées sont celles qu'on sait nommer", () => {
		// Une cible à zéro occurrence n'est retenue que si le contexte
		// l'identifie sans équivoque — ici, des listes nominatives où tous les
		// noms voisins sont justes (représentants des univers 3 et 10, crédits
		// Dr. Slump). Figer la liste empêche qu'une cinquième s'y glisse sans
		// que quelqu'un l'ait regardée.
		const orphelines = NOMS_PROPRES_MAL_LUS.filter((f) => f.attesteJuste === 0).map((f) => f.lu);
		expect(orphelines.sort()).toEqual(["シルコル", "パバロニ", "ブビピンマン", "メチオーフ"].sort());
	});

	test("chaque paire porte un comptage réel", () => {
		for (const f of NOMS_PROPRES_MAL_LUS) {
			expect(f.occurrences).toBeGreaterThan(0);
			expect(f.planches).toBeGreaterThan(0);
			expect(f.planches).toBeLessThanOrEqual(f.occurrences);
			expect(f.fr.length).toBeGreaterThan(0);
		}
	});
});

describe("ベジタブル — la non-régression qui justifie toute la mécanique", () => {
	// Deux planches du corpus expliquent l'étymologie du nom de Végéta. Une
	// règle ancrée sur une sous-chaîne les détruirait exactement là où elles
	// disent quelque chose.
	const planche24 =
		"ッパ(菓葉)というのもいたし。で、その頂点に立つのが野菜の総称のベジタブル = ベジータリ。これには感心しましたね。";
	const planche6 = " * ベジータ…野菜の英語「ベジタブル」から\n * ラディッツ…野菜のラディッシュ（ハツカダイコン）か";

	test("les deux textes réels traversent intacts", () => {
		for (const texte of [planche24, planche6]) {
			const { texte: sortie, corrections } = detaillerNomsPropres(texte);
			expect(sortie).toBe(texte);
			expect(corrections).toBe(0);
		}
	});

	test("les variantes du mot restent du japonais, pas un personnage", () => {
		for (const texte of ["ベジタブル", "ベジタリアンの食事", "ミックスベジタブル"]) {
			expect(detaillerNomsPropres(texte).texte).toBe(texte);
		}
	});
});

describe("frontière de mot", () => {
	test("une forme fautive collée à d'autres katakana n'est pas touchée", () => {
		// Le mot n'est délimité que par le changement d'écriture : sans cette
		// borne, on parierait sur l'endroit où il commence.
		for (const texte of ["フリーサイズのTシャツ", "フロースト", "サーボンヌ", "コクウブラックス"]) {
			const { texte: sortie, corrections } = detaillerNomsPropres(texte);
			expect(sortie).toBe(texte);
			expect(corrections).toBe(0);
		}
	});

	test("le point médian vaut frontière", () => {
		// Cas réel #33 p.40 : « ミニ・シャネンバは2体のみの登場だし ».
		const { texte } = detaillerNomsPropres("ミニ・シャネンバは2体のみの登場だし");
		expect(texte).toBe("ミニ・ジャネンバは2体のみの登場だし");
	});

	test("une entrée qui contient elle-même un point médian se corrige", () => {
		// Cas réels #3 p.63 (Daizenshuu 4) et #133 p.26 (V Jump 1996).
		expect(detaillerNomsPropres("ミスター・サダン").texte).toBe("ミスター・サタン");
		expect(detaillerNomsPropres("トクター・ミューはこれまで").texte).toBe("ドクター・ミューはこれまで");
	});

	test("la forme longue gagne sur la forme courte qu'elle contient", () => {
		// `フロリー` est une entrée, et `バイオフロリー` en est une autre : la
		// seconde doit gagner, sans quoi on couperait le mot en deux.
		const { texte, details } = detaillerNomsPropres("暴走するバイオフロリーに、悟天とトランクスが");
		expect(texte).toBe("暴走するバイオブロリーに、悟天とトランクスが");
		expect(details).toEqual([{ lu: "バイオフロリー", correct: "バイオブロリー", n: 1 }]);
	});
});

describe("les paires refusées ne sont pas dans la table", () => {
	test("un mot japonais courant à un kana d'un nom propre traverse", () => {
		// Chacun de ces textes a été mesuré dans le corpus et serait cassé par
		// la paire correspondante. Ce test fige les huit refus : réintroduire
		// l'une d'elles le fera échouer.
		for (const texte of [
			"ドキトキのお楽しみ抽選会！！",
			"トキドキするね 堀井雄二&鳥山明",
			"フューはドギドキとの融合で超強化",
			"ドラゴンボール乙ガンバー孫悟飯",
			"悟空たちもシャンティが亡に余り出し",
			"カステルまじゅう魔神城",
			"ベジータの必殺技ビックバンアタックなど",
			"本名:ジャコ・ティリメンテンピポッシ",
		]) {
			const { texte: sortie, corrections } = detaillerNomsPropres(texte);
			expect(sortie).toBe(texte);
			expect(corrections).toBe(0);
		}
	});

	test("les emprunts écartés par JMdict traversent", () => {
		// Douze mots japonais réels que l'étape de génération visait, et que le
		// dictionnaire a sauvés. Ils ne doivent jamais entrer dans la table.
		for (const texte of [
			"ジャンパを着る",
			"スラックスとシャツ",
			"ドルビーサラウンド",
			"マルガリータ",
			"サーロインステーキ",
			"ブラバンの演奏",
			"ニューズウィーク",
			"ブレークタイム",
		]) {
			expect(detaillerNomsPropres(texte).texte).toBe(texte);
		}
	});
});

describe("cas réels du corpus", () => {
	test("la faute et la forme juste sur la même planche sont unifiées", () => {
		// #26 p.30 : la preuve que c'est une lecture et non une convention.
		const { texte, corrections } = detaillerNomsPropres(
			"ラストアタック\n\nカーリックJr.\n\nガーリックJr.の容赦ない猛攻に、",
		);
		expect(texte).toBe("ラストアタック\n\nガーリックJr.\n\nガーリックJr.の容赦ない猛攻に、");
		expect(corrections).toBe(1);
	});

	test("plusieurs fautes d'une même ligne partent ensemble", () => {
		// #18 p.180 : la liste des guerriers de Bojack, deux noms abîmés.
		const { texte, details } = detaillerNomsPropres("サンギャ\n\nフージン\n\nゴクア\n\nビドー");
		expect(texte).toBe("ザンギャ\n\nブージン\n\nゴクア\n\nビドー");
		expect(details.map((d) => d.lu).sort()).toEqual(["サンギャ", "フージン"]);
	});

	test("une planche qui répète la même faute la compte autant de fois", () => {
		// #25 p.23 porte サーボン sept fois ; le détail doit le dire, pour que
		// le relecteur sache ce qu'il regarde.
		const { details } = detaillerNomsPropres("サーボンも圧倒するベジータ! だがサーボンは、変身能力を隠していた");
		expect(details).toEqual([{ lu: "サーボン", correct: "ザーボン", n: 2 }]);
	});

	test("du japonais ordinaire traverse intact", () => {
		for (const texte of [
			"今日はカメラで写真を撮りました。",
			"孫悟空とベジータはナメック星で戦った。",
			"DRAGON BALL 1989 BIRD STUDIO",
			"",
		]) {
			const { texte: sortie, corrections } = detaillerNomsPropres(texte);
			expect(sortie).toBe(texte);
			expect(corrections).toBe(0);
		}
	});

	test("un caractère hors du plan de base n'est pas coupé en deux", () => {
		const { texte } = detaillerNomsPropres("🐉フロリー🐉あ");
		expect(texte).toBe("🐉ブロリー🐉あ");
	});
});

describe("corrigerNomsPropres", () => {
	test("rend un rapport à une seule règle", () => {
		const { texte, rapport } = corrigerNomsPropres("魔導師ビビティが造った時の姿に戻ったブウ。");
		expect(texte).toBe("魔導師ビビディが造った時の姿に戻ったブウ。");
		expect(rapport).toEqual([{ code: "noms-propres", corrections: 1 }]);
	});

	test("un texte sans faute rend un rapport à zéro", () => {
		const { texte, rapport } = corrigerNomsPropres("界王拳でミソカツツンを倒した悟空");
		expect(texte).toBe("界王拳でミソカツツンを倒した悟空");
		expect(rapport).toEqual([{ code: "noms-propres", corrections: 0 }]);
	});

	test("est idempotente", () => {
		const source = "悟空の父バータックとフリーサ、そしてコクウブラック、シャネンバ、ハビディ";
		const premier = corrigerNomsPropres(source).texte;
		const second = corrigerNomsPropres(premier).texte;
		expect(premier).toBe("悟空の父バーダックとフリーザ、そしてゴクウブラック、ジャネンバ、バビディ");
		expect(second).toBe(premier);
	});

	test("aucune paire ne change la longueur du texte", () => {
		// Le garde-fou du runner écarte une planche tombée sous 50 % de sa
		// longueur ; il ne devrait jamais avoir à se déclencher ici, puisque
		// chaque paire conserve le nombre de caractères.
		for (const f of NOMS_PROPRES_MAL_LUS) {
			expect(f.correct.length).toBe(f.lu.length);
		}
	});
});
