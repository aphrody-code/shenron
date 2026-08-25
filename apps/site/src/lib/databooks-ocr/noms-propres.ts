/**
 * Transcriptions de databooks — noms propres Dragon Ball mal lus.
 *
 * Module autonome, volontairement séparé de `databooks-ocr-corrections.ts` :
 * il ne traite qu'UNE classe de défaut, la confusion entre une consonne
 * sourde et sa sonore (ou sa semi-sonore) sur un **nom propre**. Le dakuten
 * est deux petits traits en haut à droite d'un kana ; sur du texte imprimé
 * petit, c'est ce que le modèle de vision rate le plus. Sur un mot courant le
 * dictionnaire tranche ; sur `ブロリー` il n'a rien à dire, et la faute passe.
 *
 * # D'où vient cette table
 *
 * Elle n'a pas été écrite de mémoire — la mémoire est exactement ce qui
 * fabrique des noms plausibles et faux. Elle a été **dérivée** :
 *
 *   1. lecture des graphies japonaises officielles du wiki (`name_ja` des
 *      tables `bot.db_characters`, `db_planets`, `db_races`, `db_sagas`,
 *      `db_techniques`) — 779 graphies, dont 286 en katakana pur d'au moins
 *      quatre kana ;
 *   2. génération de toute variante obtenue en basculant **un seul** kana
 *      dans son groupe sourde/sonore/semi-sonore (ハ/バ/パ, ヒ/ビ/ピ, カ/ガ,
 *      サ/ザ, タ/ダ, ウ/ヴ…) — 788 variantes ;
 *   3. rejet automatique de toute variante qui est elle-même un mot de JMdict
 *      (464 819 graphies) ou une graphie officielle du wiki ;
 *   4. comptage de ce qui reste sur les 11 255 planches transcrites ;
 *   5. **lecture des occurrences réelles**, une par une pour les paires rares,
 *      exhaustivement pour celles qui touchent plus de trois planches.
 *
 * L'étape 3 n'est pas décorative : elle a écarté `ジャンパ` (le blouson) qui
 * visait `シャンパ` (Champa), `スラック` qui visait `スラッグ` (Slug),
 * `ドルビー` (Dolby) qui visait `トルビー`, `マルガリータ` (le cocktail),
 * `ニューズ`, `バスター`, `サーロイン`, `ブラバン`, `ブレーク`, `ターフル`,
 * `シブレット`, `プローズ`. Douze pièges, tous des mots japonais réels qu'une
 * règle par distance aurait réécrits en noms de personnages.
 *
 * L'étape 5 en a écarté huit de plus, que ni le dictionnaire ni la fréquence
 * ne pouvaient attraper — cf. REFUSÉES plus bas.
 *
 * # La garde qui décide de tout
 *
 * Une substitution n'a lieu que si la forme fautive est **un mot entier** :
 * ni le caractère qui précède ni celui qui suit ne peut être un katakana. Le
 * japonais ne sépare pas ses mots par des espaces, il les délimite par le
 * changement d'écriture ; sans cette borne, corriger reviendrait à parier sur
 * l'endroit où le mot commence.
 *
 * C'est cette borne qui protège `ベジタブル` — le passage où les databooks
 * expliquent que Végéta vient de « vegetable ». Une règle `ベジタ → ベジータ`
 * ancrée sur une sous-chaîne détruirait précisément l'explication qui la
 * justifie. Le cas est figé par un test de non-régression, avec les deux
 * textes réels du corpus (#24 p.47 et #6 p.48).
 *
 * Le point médian `・`, lui, compte comme une frontière et non comme un
 * katakana : c'est un séparateur de mots, et le refuser ferait manquer
 * `ミニ・シャネンバ` sans rien protéger.
 *
 * # REFUSÉES, et pourquoi
 *
 * Huit paires mesurées dans le corpus ne sont PAS dans la table. Chacune avait
 * une fréquence exploitable ; aucune n'avait de preuve d'illégitimité :
 *
 *   - `ドキトキ` → `トキトキ` (3×) : contre-exemple #212 « ドキトキのお楽しみ抽選会 » : c'est ドキドキ, pas Tokitoki.
 *   - `トキドキ` → `トキトキ` (1×) : contre-exemple #304 (V Jump 1997) « トキドキするね » : ときどき/ドキドキ, et Tokitoki date de 2015.
 *   - `ドギドキ` → `ドギドギ` (1×) : à un kana de ドキドキ autant que de ドギドギ ; 1 occurrence ne lève pas l'ambiguïté.
 *   - `ガンバー` → `カンバー` (1×) : contre-exemple #19 p.265 : titre de jeu de 1992, treize ans avant Cumber.
 *   - `シャンティ` → `シャンディ` (6×) : シャンディ jamais attesté dans le corpus (0×) et unique contexte illisible.
 *   - `カステル` → `ガステル` (1×) : カステル est un nom étranger courant (Castel) ; contexte dégradé, 1 occurrence.
 *   - `ビックバンアタック` → `ビッグバンアタック` (1×) : ビック est une graphie japonaise attestée de « big » (ビックカメラ) : variante éditoriale plausible.
 *   - `ジャコ・ティリメンテンピポッシ` → `ジャコ・ティリメンテンピボッシ` (1×) : cible jamais attestée (0×) et graphie canonique du nom long incertaine.
 *
 * Le critère commun de ces refus : on ne peut pas montrer que la forme lue est
 * impossible. Une correction fausse sur un corpus public coûte plus cher que
 * les quinze occurrences qu'elle aurait rattrapées.
 *
 * # Ce que ce module ne fait pas
 *
 * Rien sur les confusions ソ/ン et シ/ツ (≈50 % de faux positifs mesurés :
 * `ヤシ`, `ミート`, `キラー` sont justes), rien sur `一`→`ー` (95 % de
 * légitime : `一味`, `一家`, `一同`), rien sur les furigana, les boucles du
 * modèle ni la mise en page — d'autres modules s'en chargent. Et aucune image
 * n'est relue : tout se décide sur le texte.
 */

/**
 * Forme du rapport de règle, identique à celle de
 * `databooks-ocr-corrections.ts` — dupliquée plutôt qu'importée pour que ce
 * module reste indépendant du pipeline principal, dont l'union de codes est
 * fermée et appartient à un autre périmètre.
 */
export interface RapportRegle {
	code: "noms-propres";
	corrections: number;
}

/** Une graphie mal lue et sa forme juste, avec ce qui la prouve. */
export interface FauteNomPropre {
	/** La graphie telle que le modèle l'a rendue. */
	lu: string;
	/** La graphie officielle, celle du wiki. */
	correct: string;
	/** Le libellé français officiel — sert à retrouver l'entité au relecteur. */
	fr: string;
	/** Le kana en cause, sous la forme « lu/correct ». */
	confusion: string;
	/** Occurrences de `lu` dans le corpus, mesurées le 2026-08-25. */
	occurrences: number;
	/** Planches distinctes portant `lu`. */
	planches: number;
	/**
	 * Occurrences de `correct` dans le MÊME corpus. C'est la colonne qui
	 * tranche : elle montre que le terme y vit réellement, donc que la forme
	 * lue en est une lecture et non un mot venu d'ailleurs. Une cible à zéro
	 * n'est retenue que si le contexte l'identifie sans équivoque — une liste
	 * nominative d'ouvrage, où les noms voisins sont tous justes.
	 */
	attesteJuste: number;
}

/**
 * Les 86 paires retenues, triées par fréquence décroissante.
 *
 * Chaque commentaire porte le comptage réel : occurrences de la forme lue,
 * planches et ouvrages touchés, et attestation de la forme juste dans le même
 * corpus.
 */
export const NOMS_PROPRES_MAL_LUS: FauteNomPropre[] = [
	// Goku Black — コ/ゴ. 182 occurrences sur 7 planches, 6 ouvrages ; ゴクウブラック attesté 80× dans le même corpus.
	{ lu: "コクウブラック", correct: "ゴクウブラック", fr: "Goku Black", confusion: "コ/ゴ", occurrences: 182, planches: 7, attesteJuste: 80 },
	// Puerh — ブ/プ. 19 occurrences sur 15 planches, 12 ouvrages ; プーアル attesté 19× dans le même corpus.
	{ lu: "ブーアル", correct: "プーアル", fr: "Puerh", confusion: "ブ/プ", occurrences: 19, planches: 15, attesteJuste: 19 },
	// Gogeta (DBZ/GT) — シ/ジ. 16 occurrences sur 8 planches, 8 ouvrages ; ゴジータ attesté 340× dans le même corpus.
	{ lu: "ゴシータ", correct: "ゴジータ", fr: "Gogeta (DBZ/GT)", confusion: "シ/ジ", occurrences: 16, planches: 8, attesteJuste: 340 },
	// Garlic — カ/ガ. 14 occurrences sur 5 planches, 5 ouvrages ; ガーリック attesté 265× dans le même corpus.
	{ lu: "カーリック", correct: "ガーリック", fr: "Garlic", confusion: "カ/ガ", occurrences: 14, planches: 5, attesteJuste: 265 },
	// Zarbon — サ/ザ. 13 occurrences sur 7 planches, 6 ouvrages ; ザーボン attesté 100× dans le même corpus.
	{ lu: "サーボン", correct: "ザーボン", fr: "Zarbon", confusion: "サ/ザ", occurrences: 13, planches: 7, attesteJuste: 100 },
	// Janemba — シ/ジ. 12 occurrences sur 6 planches, 5 ouvrages ; ジャネンバ attesté 128× dans le même corpus.
	{ lu: "シャネンバ", correct: "ジャネンバ", fr: "Janemba", confusion: "シ/ジ", occurrences: 12, planches: 6, attesteJuste: 128 },
	// Paikûhan — バ/パ. 10 occurrences sur 7 planches, 7 ouvrages ; パイクーハン attesté 61× dans le même corpus.
	{ lu: "バイクーハン", correct: "パイクーハン", fr: "Paikûhan", confusion: "バ/パ", occurrences: 10, planches: 7, attesteJuste: 61 },
	// Ptéranodon — ブ/プ. 9 occurrences sur 3 planches, 2 ouvrages ; プテラノドン attesté 1× dans le même corpus.
	{ lu: "ブテラノドン", correct: "プテラノドン", fr: "Ptéranodon", confusion: "ブ/プ", occurrences: 9, planches: 3, attesteJuste: 1 },
	// Berserker (Race de Freezer) — パ/バ. 8 occurrences sur 4 planches, 4 ouvrages ; バーサーカー attesté 20× dans le même corpus.
	{ lu: "パーサーカー", correct: "バーサーカー", fr: "Berserker (Race de Freezer)", confusion: "パ/バ", occurrences: 8, planches: 4, attesteJuste: 20 },
	// Broly (DBZ) — フ/ブ. 8 occurrences sur 6 planches, 5 ouvrages ; ブロリー attesté 1030× dans le même corpus.
	{ lu: "フロリー", correct: "ブロリー", fr: "Broly (DBZ)", confusion: "フ/ブ", occurrences: 8, planches: 6, attesteJuste: 1030 },
	// Babidi — テ/デ. 7 occurrences sur 4 planches, 4 ouvrages ; バビディ attesté 323× dans le même corpus.
	{ lu: "バビティ", correct: "バビディ", fr: "Babidi", confusion: "テ/デ", occurrences: 7, planches: 4, attesteJuste: 323 },
	// Bubbles — パ/バ. 7 occurrences sur 5 planches, 4 ouvrages ; バブルス attesté 37× dans le même corpus.
	{ lu: "パブルス", correct: "バブルス", fr: "Bubbles", confusion: "パ/バ", occurrences: 7, planches: 5, attesteJuste: 37 },
	// Bibidi — テ/デ. 7 occurrences sur 4 planches, 4 ouvrages ; ビビディ attesté 51× dans le même corpus.
	{ lu: "ビビティ", correct: "ビビディ", fr: "Bibidi", confusion: "テ/デ", occurrences: 7, planches: 4, attesteJuste: 51 },
	// Poutine — ブ/プ. 7 occurrences sur 2 planches, 2 ouvrages ; プティン attesté 2× dans le même corpus.
	{ lu: "ブティン", correct: "プティン", fr: "Poutine", confusion: "ブ/プ", occurrences: 7, planches: 2, attesteJuste: 2 },
	// Freezer (futur) — サ/ザ. 7 occurrences sur 5 planches, 5 ouvrages ; フリーザ attesté 2754× dans le même corpus.
	{ lu: "フリーサ", correct: "フリーザ", fr: "Freezer (futur)", confusion: "サ/ザ", occurrences: 7, planches: 5, attesteJuste: 2754 },
	// Zangya — サ/ザ. 6 occurrences sur 6 planches, 3 ouvrages ; ザンギャ attesté 17× dans le même corpus.
	{ lu: "サンギャ", correct: "ザンギャ", fr: "Zangya", confusion: "サ/ザ", occurrences: 6, planches: 6, attesteJuste: 17 },
	// Ebifurya — ピ/ビ. 5 occurrences sur 5 planches, 5 ouvrages ; エビフリャー attesté 4× dans le même corpus.
	{ lu: "エピフリャー", correct: "エビフリャー", fr: "Ebifurya", confusion: "ピ/ビ", occurrences: 5, planches: 5, attesteJuste: 4 },
	// Gravy — ク/グ. 5 occurrences sur 1 planches, 1 ouvrages ; グレイビー attesté 8× dans le même corpus.
	{ lu: "クレイビー", correct: "グレイビー", fr: "Gravy", confusion: "ク/グ", occurrences: 5, planches: 1, attesteJuste: 8 },
	// Sharpner — ブ/プ. 5 occurrences sur 5 planches, 5 ouvrages ; シャプナー attesté 5× dans le même corpus.
	{ lu: "シャブナー", correct: "シャプナー", fr: "Sharpner", confusion: "ブ/プ", occurrences: 5, planches: 5, attesteJuste: 5 },
	// Tapikar — ビ/ピ. 5 occurrences sur 3 planches, 2 ouvrages ; タピカー attesté 2× dans le même corpus.
	{ lu: "タビカー", correct: "タピカー", fr: "Tapikar", confusion: "ビ/ピ", occurrences: 5, planches: 3, attesteJuste: 2 },
	// Bardock — タ/ダ. 5 occurrences sur 3 planches, 3 ouvrages ; バーダック attesté 510× dans le même corpus.
	{ lu: "バータック", correct: "バーダック", fr: "Bardock", confusion: "タ/ダ", occurrences: 5, planches: 3, attesteJuste: 510 },
	// Babidi — ハ/バ. 5 occurrences sur 4 planches, 4 ouvrages ; バビディ attesté 323× dans le même corpus.
	{ lu: "ハビディ", correct: "バビディ", fr: "Babidi", confusion: "ハ/バ", occurrences: 5, planches: 4, attesteJuste: 323 },
	// Poutine — フ/プ. 5 occurrences sur 3 planches, 3 ouvrages ; プティン attesté 2× dans le même corpus.
	{ lu: "フティン", correct: "プティン", fr: "Poutine", confusion: "フ/プ", occurrences: 5, planches: 3, attesteJuste: 2 },
	// Raditz — テ/デ. 5 occurrences sur 2 planches, 2 ouvrages ; ラディッツ attesté 230× dans le même corpus.
	{ lu: "ラティッツ", correct: "ラディッツ", fr: "Raditz", confusion: "テ/デ", occurrences: 5, planches: 2, attesteJuste: 230 },
	// Champa — バ/パ. 4 occurrences sur 4 planches, 4 ouvrages ; シャンパ attesté 95× dans le même corpus.
	{ lu: "シャンバ", correct: "シャンパ", fr: "Champa", confusion: "バ/パ", occurrences: 4, planches: 4, attesteJuste: 95 },
	// Barman — パ/バ. 4 occurrences sur 2 planches, 1 ouvrages ; バーテンダー attesté 1× dans le même corpus.
	{ lu: "パーテンダー", correct: "バーテンダー", fr: "Barman", confusion: "パ/バ", occurrences: 4, planches: 2, attesteJuste: 1 },
	// Frog — ク/グ. 4 occurrences sur 1 planches, 1 ouvrages ; フーログ attesté 2× dans le même corpus.
	{ lu: "フーロク", correct: "フーログ", fr: "Frog", confusion: "ク/グ", occurrences: 4, planches: 1, attesteJuste: 2 },
	// Froze — ス/ズ. 4 occurrences sur 3 planches, 3 ouvrages ; フローズ attesté 7× dans le même corpus.
	{ lu: "フロース", correct: "フローズ", fr: "Froze", confusion: "ス/ズ", occurrences: 4, planches: 3, attesteJuste: 7 },
	// Bonyû — ポ/ボ. 4 occurrences sur 1 planches, 1 ouvrages ; ボニュー attesté 2× dans le même corpus.
	{ lu: "ポニュー", correct: "ボニュー", fr: "Bonyû", confusion: "ポ/ボ", occurrences: 4, planches: 1, attesteJuste: 2 },
	// Gotenks — デ/テ. 3 occurrences sur 2 planches, 2 ouvrages ; ゴテンクス attesté 399× dans le même corpus.
	{ lu: "ゴデンクス", correct: "ゴテンクス", fr: "Gotenks", confusion: "デ/テ", occurrences: 3, planches: 2, attesteJuste: 399 },
	// Bourbon — ポ/ボ. 3 occurrences sur 2 planches, 1 ouvrages ; バーボン attesté 4× dans le même corpus.
	{ lu: "バーポン", correct: "バーボン", fr: "Bourbon", confusion: "ポ/ボ", occurrences: 3, planches: 2, attesteJuste: 4 },
	// Paragus (DBS) — バ/パ. 3 occurrences sur 3 planches, 3 ouvrages ; パラガス attesté 199× dans le même corpus.
	{ lu: "バラガス", correct: "パラガス", fr: "Paragus (DBS)", confusion: "バ/パ", occurrences: 3, planches: 3, attesteJuste: 199 },
	// Big bang — ピ/ビ. 3 occurrences sur 2 planches, 1 ouvrages ; ビッグバンアタック attesté 18× dans le même corpus.
	{ lu: "ピッグバンアタック", correct: "ビッグバンアタック", fr: "Big bang", confusion: "ピ/ビ", occurrences: 3, planches: 2, attesteJuste: 18 },
	// Pinich — ビ/ピ. 3 occurrences sur 3 planches, 2 ouvrages ; ピニッジ attesté 3× dans le même corpus.
	{ lu: "ビニッジ", correct: "ピニッジ", fr: "Pinich", confusion: "ビ/ピ", occurrences: 3, planches: 3, attesteJuste: 3 },
	// Vegetto — ペ/ベ. 3 occurrences sur 3 planches, 3 ouvrages ; ベジット attesté 288× dans le même corpus.
	{ lu: "ペジット", correct: "ベジット", fr: "Vegetto", confusion: "ペ/ベ", occurrences: 3, planches: 3, attesteJuste: 288 },
	// Yajirobé (futur) — シ/ジ. 3 occurrences sur 3 planches, 3 ouvrages ; ヤジロベー attesté 134× dans le même corpus.
	{ lu: "ヤシロベー", correct: "ヤジロベー", fr: "Yajirobé (futur)", confusion: "シ/ジ", occurrences: 3, planches: 3, attesteJuste: 134 },
	// Acqua — グ/ク. 2 occurrences sur 1 planches, 1 ouvrages ; アークア attesté 6× dans le même corpus.
	{ lu: "アーグア", correct: "アークア", fr: "Acqua", confusion: "グ/ク", occurrences: 2, planches: 1, attesteJuste: 6 },
	// Apple — ブ/プ. 2 occurrences sur 2 planches, 2 ouvrages ; アプール attesté 12× dans le même corpus.
	{ lu: "アブール", correct: "アプール", fr: "Apple", confusion: "ブ/プ", occurrences: 2, planches: 2, attesteJuste: 12 },
	// Idâsa — タ/ダ. 2 occurrences sur 1 planches, 1 ouvrages ; イダーサ attesté 6× dans le même corpus.
	{ lu: "イターサ", correct: "イダーサ", fr: "Idâsa", confusion: "タ/ダ", occurrences: 2, planches: 1, attesteJuste: 6 },
	// Captain Chicken — ブ/プ. 2 occurrences sur 1 planches, 1 ouvrages ; キャプテン・チキン attesté 2× dans le même corpus.
	{ lu: "キャブテン・チキン", correct: "キャプテン・チキン", fr: "Captain Chicken", confusion: "ブ/プ", occurrences: 2, planches: 1, attesteJuste: 2 },
	// Goku Black — フ/ブ. 2 occurrences sur 2 planches, 2 ouvrages ; ゴクウブラック attesté 80× dans le même corpus.
	{ lu: "ゴクウフラック", correct: "ゴクウブラック", fr: "Goku Black", confusion: "フ/ブ", occurrences: 2, planches: 2, attesteJuste: 80 },
	// Goku Black — プ/ブ. 2 occurrences sur 2 planches, 2 ouvrages ; ゴクウブラック attesté 80× dans le même corpus.
	{ lu: "ゴクウプラック", correct: "ゴクウブラック", fr: "Goku Black", confusion: "プ/ブ", occurrences: 2, planches: 2, attesteJuste: 80 },
	// Jimizu — ス/ズ. 2 occurrences sur 2 planches, 1 ouvrages ; ジーミズ attesté 1× dans le même corpus.
	{ lu: "ジーミス", correct: "ジーミズ", fr: "Jimizu", confusion: "ス/ズ", occurrences: 2, planches: 2, attesteJuste: 1 },
	// Bibidi — ヒ/ビ. 2 occurrences sur 2 planches, 2 ouvrages ; ビビディ attesté 51× dans le même corpus.
	{ lu: "ヒビディ", correct: "ビビディ", fr: "Bibidi", confusion: "ヒ/ビ", occurrences: 2, planches: 2, attesteJuste: 51 },
	// Bujin — フ/ブ. 2 occurrences sur 2 planches, 2 ouvrages ; ブージン attesté 21× dans le même corpus.
	{ lu: "フージン", correct: "ブージン", fr: "Bujin", confusion: "フ/ブ", occurrences: 2, planches: 2, attesteJuste: 21 },
	// Blueberry — ペ/ベ. 2 occurrences sur 1 planches, 1 ouvrages ; ブールベリ attesté 3× dans le même corpus.
	{ lu: "ブールペリ", correct: "ブールベリ", fr: "Blueberry", confusion: "ペ/ベ", occurrences: 2, planches: 1, attesteJuste: 3 },
	// Vegeta (SDBH) — ダ/タ. 2 occurrences sur 1 planches, 1 ouvrages ; ベジータ attesté 3577× dans le même corpus.
	{ lu: "ベジーダ", correct: "ベジータ", fr: "Vegeta (SDBH)", confusion: "ダ/タ", occurrences: 2, planches: 1, attesteJuste: 3577 },
	// Mr. Satan — ダ/タ. 2 occurrences sur 1 planches, 1 ouvrages ; ミスター・サタン attesté 229× dans le même corpus.
	{ lu: "ミスター・サダン", correct: "ミスター・サタン", fr: "Mr. Satan", confusion: "ダ/タ", occurrences: 2, planches: 1, attesteJuste: 229 },
	// Mechikabra — フ/ブ. 2 occurrences sur 2 planches, 2 ouvrages ; メチカブラ attesté 65× dans le même corpus.
	{ lu: "メチカフラ", correct: "メチカブラ", fr: "Mechikabra", confusion: "フ/ブ", occurrences: 2, planches: 2, attesteJuste: 65 },
	// Anguila — キ/ギ. 1 occurrence sur 1 planche, 1 ouvrage ; アンギラ attesté 12× dans le même corpus.
	{ lu: "アンキラ", correct: "アンギラ", fr: "Anguila", confusion: "キ/ギ", occurrences: 1, planches: 1, attesteJuste: 12 },
	// Obotchaman — ポ/ボ. 1 occurrence sur 1 planche, 1 ouvrage ; オボッチャマン attesté 4× dans le même corpus.
	{ lu: "オポッチャマン", correct: "オボッチャマン", fr: "Obotchaman", confusion: "ポ/ボ", occurrences: 1, planches: 1, attesteJuste: 4 },
	// Catopesra — ベ/ペ. 1 occurrence sur 1 planche, 1 ouvrage ; カトペスラ attesté 2× dans le même corpus.
	{ lu: "カトベスラ", correct: "カトペスラ", fr: "Catopesra", confusion: "ベ/ペ", occurrences: 1, planches: 1, attesteJuste: 2 },
	// Caterpy — ビ/ピ. 1 occurrence sur 1 planche, 1 ouvrage ; キャタピー attesté 3× dans le même corpus.
	{ lu: "キャタビー", correct: "キャタピー", fr: "Caterpy", confusion: "ビ/ピ", occurrences: 1, planches: 1, attesteJuste: 3 },
	// Grégory — ク/グ. 1 occurrence sur 1 planche, 1 ouvrage ; グレゴリー attesté 20× dans le même corpus.
	{ lu: "クレゴリー", correct: "グレゴリー", fr: "Grégory", confusion: "ク/グ", occurrences: 1, planches: 1, attesteJuste: 20 },
	// Sauzer — サ/ザ. 1 occurrence sur 1 planche, 1 ouvrage ; サウザー attesté 29× dans le même corpus.
	{ lu: "サウサー", correct: "サウザー", fr: "Sauzer", confusion: "サ/ザ", occurrences: 1, planches: 1, attesteJuste: 29 },
	// Janemba — パ/バ. 1 occurrence sur 1 planche, 1 ouvrage ; ジャネンバ attesté 128× dans le même corpus.
	{ lu: "ジャネンパ", correct: "ジャネンバ", fr: "Janemba", confusion: "パ/バ", occurrences: 1, planches: 1, attesteJuste: 128 },
	// Baby Janenba — ピ/ビ. 1 occurrence sur 1 planche, 1 ouvrage ; ジャネンバベビー attesté 2× dans le même corpus.
	{ lu: "ジャネンバベピー", correct: "ジャネンバベビー", fr: "Baby Janenba", confusion: "ピ/ビ", occurrences: 1, planches: 1, attesteJuste: 2 },
	// Baby Janenba — ペ/ベ. 1 occurrence sur 1 planche, 1 ouvrage ; ジャネンバベビー attesté 2× dans le même corpus.
	{ lu: "ジャネンバペビー", correct: "ジャネンバベビー", fr: "Baby Janenba", confusion: "ペ/ベ", occurrences: 1, planches: 1, attesteJuste: 2 },
	// Zircol — シ/ジ. 1 occurrence sur 1 planche, 1 ouvrage ; ジルコル attesté 0× dans le même corpus.
	{ lu: "シルコル", correct: "ジルコル", fr: "Zircol", confusion: "シ/ジ", occurrences: 1, planches: 1, attesteJuste: 0 },
	// Spopovitch — ピ/ビ. 1 occurrence sur 1 planche, 1 ouvrage ; スポポビッチ attesté 69× dans le même corpus.
	{ lu: "スポポピッチ", correct: "スポポビッチ", fr: "Spopovitch", confusion: "ピ/ビ", occurrences: 1, planches: 1, attesteJuste: 69 },
	// Tapikar — ダ/タ. 1 occurrence sur 1 planche, 1 ouvrage ; タピカー attesté 2× dans le même corpus.
	{ lu: "ダピカー", correct: "タピカー", fr: "Tapikar", confusion: "ダ/タ", occurrences: 1, planches: 1, attesteJuste: 2 },
	// Dr Mu — ト/ド. 1 occurrence sur 1 planche, 1 ouvrage ; ドクター・ミュー attesté 49× dans le même corpus.
	{ lu: "トクター・ミュー", correct: "ドクター・ミュー", fr: "Dr Mu", confusion: "ト/ド", occurrences: 1, planches: 1, attesteJuste: 49 },
	// Totappo — ド/ト. 1 occurrence sur 1 planche, 1 ouvrage ; トテッポ attesté 11× dans le même corpus.
	{ lu: "ドテッポ", correct: "トテッポ", fr: "Totappo", confusion: "ド/ト", occurrences: 1, planches: 1, attesteJuste: 11 },
	// Dodoria — ト/ド. 1 occurrence sur 1 planche, 1 ouvrage ; ドドリア attesté 74× dans le même corpus.
	{ lu: "トドリア", correct: "ドドリア", fr: "Dodoria", confusion: "ト/ド", occurrences: 1, planches: 1, attesteJuste: 74 },
	// Dodoria — ト/ド. 1 occurrence sur 1 planche, 1 ouvrage ; ドドリア attesté 74× dans le même corpus.
	{ lu: "ドトリア", correct: "ドドリア", fr: "Dodoria", confusion: "ト/ド", occurrences: 1, planches: 1, attesteJuste: 74 },
	// Trunks — ド/ト. 1 occurrence sur 1 planche, 1 ouvrage ; トランクス attesté 1578× dans le même corpus.
	{ lu: "ドランクス", correct: "トランクス", fr: "Trunks", confusion: "ド/ト", occurrences: 1, planches: 1, attesteJuste: 1578 },
	// Torbie — ピ/ビ. 1 occurrence sur 1 planche, 1 ouvrage ; トルビー attesté 12× dans le même corpus.
	{ lu: "トルピー", correct: "トルビー", fr: "Torbie", confusion: "ピ/ビ", occurrences: 1, planches: 1, attesteJuste: 12 },
	// Dorodabo — ト/ド. 1 occurrence sur 1 planche, 1 ouvrage ; ドロダボ attesté 9× dans le même corpus.
	{ lu: "トロダボ", correct: "ドロダボ", fr: "Dorodabo", confusion: "ト/ド", occurrences: 1, planches: 1, attesteJuste: 9 },
	// Dorodabo — タ/ダ. 1 occurrence sur 1 planche, 1 ouvrage ; ドロダボ attesté 9× dans le même corpus.
	{ lu: "ドロタボ", correct: "ドロダボ", fr: "Dorodabo", confusion: "タ/ダ", occurrences: 1, planches: 1, attesteJuste: 9 },
	// Neko Majin Z — シ/ジ. 1 occurrence sur 1 planche, 1 ouvrage ; ネコマジン attesté 216× dans le même corpus.
	{ lu: "ネコマシン", correct: "ネコマジン", fr: "Neko Majin Z", confusion: "シ/ジ", occurrences: 1, planches: 1, attesteJuste: 216 },
	// Bourbon — パ/バ. 1 occurrence sur 1 planche, 1 ouvrage ; バーボン attesté 4× dans le même corpus.
	{ lu: "パーボン", correct: "バーボン", fr: "Bourbon", confusion: "パ/バ", occurrences: 1, planches: 1, attesteJuste: 4 },
	// Bio Broly — フ/ブ. 1 occurrence sur 1 planche, 1 ouvrage ; バイオブロリー attesté 16× dans le même corpus.
	{ lu: "バイオフロリー", correct: "バイオブロリー", fr: "Bio Broly", confusion: "フ/ブ", occurrences: 1, planches: 1, attesteJuste: 16 },
	// Papperoni — バ/パ. 1 occurrence sur 1 planche, 1 ouvrage ; パパロニ attesté 0× dans le même corpus.
	{ lu: "パバロニ", correct: "パパロニ", fr: "Papperoni", confusion: "バ/パ", occurrences: 1, planches: 1, attesteJuste: 0 },
	// Babidi — ピ/ビ. 1 occurrence sur 1 planche, 1 ouvrage ; バビディ attesté 323× dans le même corpus.
	{ lu: "バピディ", correct: "バビディ", fr: "Babidi", confusion: "ピ/ビ", occurrences: 1, planches: 1, attesteJuste: 323 },
	// Bubbles — プ/ブ. 1 occurrence sur 1 planche, 1 ouvrage ; バブルス attesté 37× dans le même corpus.
	{ lu: "バプルス", correct: "バブルス", fr: "Bubbles", confusion: "プ/ブ", occurrences: 1, planches: 1, attesteJuste: 37 },
	// Videl — ヒ/ビ. 1 occurrence sur 1 planche, 1 ouvrage ; ビーデル attesté 340× dans le même corpus.
	{ lu: "ヒーデル", correct: "ビーデル", fr: "Videl", confusion: "ヒ/ビ", occurrences: 1, planches: 1, attesteJuste: 340 },
	// Hirudegân — カ/ガ. 1 occurrence sur 1 planche, 1 ouvrage ; ヒルデガーン attesté 156× dans le même corpus.
	{ lu: "ヒルデカーン", correct: "ヒルデガーン", fr: "Hirudegân", confusion: "カ/ガ", occurrences: 1, planches: 1, attesteJuste: 156 },
	// Piroshki — ヒ/ピ. 1 occurrence sur 1 planche, 1 ouvrage ; ピロシキ attesté 11× dans le même corpus.
	{ lu: "ヒロシキ", correct: "ピロシキ", fr: "Piroshki", confusion: "ヒ/ピ", occurrences: 1, planches: 1, attesteJuste: 11 },
	// Piroshki — ビ/ピ. 1 occurrence sur 1 planche, 1 ouvrage ; ピロシキ attesté 11× dans le même corpus.
	{ lu: "ビロシキ", correct: "ピロシキ", fr: "Piroshki", confusion: "ビ/ピ", occurrences: 1, planches: 1, attesteJuste: 11 },
	// Puerh — フ/プ. 1 occurrence sur 1 planche, 1 ouvrage ; プーアル attesté 19× dans le même corpus.
	{ lu: "フーアル", correct: "プーアル", fr: "Puerh", confusion: "フ/プ", occurrences: 1, planches: 1, attesteJuste: 19 },
	// Blueberry — プ/ブ. 1 occurrence sur 1 planche, 1 ouvrage ; ブールベリ attesté 3× dans le même corpus.
	{ lu: "プールベリ", correct: "ブールベリ", fr: "Blueberry", confusion: "プ/ブ", occurrences: 1, planches: 1, attesteJuste: 3 },
	// Bubibinman — ピ/ビ. 1 occurrence sur 1 planche, 1 ouvrage ; ブビビンマン attesté 0× dans le même corpus.
	{ lu: "ブビピンマン", correct: "ブビビンマン", fr: "Bubibinman", confusion: "ピ/ビ", occurrences: 1, planches: 1, attesteJuste: 0 },
	// Freezer (futur) — ブ/フ. 1 occurrence sur 1 planche, 1 ouvrage ; フリーザ attesté 2754× dans le même corpus.
	{ lu: "ブリーザ", correct: "フリーザ", fr: "Freezer (futur)", confusion: "ブ/フ", occurrences: 1, planches: 1, attesteJuste: 2754 },
	// Methiop — フ/プ. 1 occurrence sur 1 planche, 1 ouvrage ; メチオープ attesté 0× dans le même corpus.
	{ lu: "メチオーフ", correct: "メチオープ", fr: "Methiop", confusion: "フ/プ", occurrences: 1, planches: 1, attesteJuste: 0 },
	// Mohican — ビ/ヒ. 1 occurrence sur 1 planche, 1 ouvrage ; モヒカン attesté 5× dans le même corpus.
	{ lu: "モビカン", correct: "モヒカン", fr: "Mohican", confusion: "ビ/ヒ", occurrences: 1, planches: 1, attesteJuste: 5 },
	// Rhumush — ジ/シ. 1 occurrence sur 1 planche, 1 ouvrage ; ラムーシ attesté 7× dans le même corpus.
	{ lu: "ラムージ", correct: "ラムーシ", fr: "Rhumush", confusion: "ジ/シ", occurrences: 1, planches: 1, attesteJuste: 7 },
];

/** Le bloc katakana d'Unicode, prolongateur et point médian compris. */
const KATAKANA = /[゠-ヿｦ-ﾟ]/;

/**
 * Le point médian sépare les composants d'un nom étranger (`ミスター・サタン`).
 * C'est une frontière de mot, pas une lettre : le compter comme un katakana
 * ferait manquer `ミニ・シャネンバ` sans protéger quoi que ce soit.
 */
const SEPARATEUR = "・";

/**
 * Le caractère termine-t-il un mot katakana ?
 *
 * Le bord du texte et le point médian valent frontière ; tout autre katakana,
 * non. Le prolongateur reste bloquant : il fait partie du mot, et sans lui
 * une forme courte mordrait dans une forme allongée.
 */
function frontiere(c: string | undefined): boolean {
	return c === undefined || c === SEPARATEUR || !KATAKANA.test(c);
}

/**
 * Formes longues d'abord, pour qu'une entrée courte n'ampute pas une entrée
 * longue qui la contiendrait (`フロリー` dans `バイオフロリー`). La frontière
 * katakana suffirait ici, mais l'ordre doit être garanti plutôt que fortuit.
 */
const ORDRE: FauteNomPropre[] = [...NOMS_PROPRES_MAL_LUS].sort((a, b) => b.lu.length - a.lu.length);

/** Une substitution effectuée, telle qu'un relecteur doit pouvoir la revoir. */
export interface RemplacementNomPropre {
	lu: string;
	correct: string;
	/** Nombre de fois où cette paire a joué dans le texte. */
	n: number;
}

/**
 * Applique la table et rend le détail paire par paire.
 *
 * Balayage caractère par caractère plutôt que `String.replace` : il faut
 * connaître le caractère qui précède ET celui qui suit à chaque candidat, et
 * une expression régulière à double regard aurait imposé d'échapper des
 * graphies qui, elles, n'ont rien à échapper. Les katakana restent dans le
 * plan de base d'Unicode, donc l'avancée par unité UTF-16 ne peut couper aucun
 * de ces mots ; une paire de substitution rencontrée ailleurs est recopiée
 * telle quelle, moitié par moitié, sans altération.
 */
export function detaillerNomsPropres(texte: string): {
	texte: string;
	corrections: number;
	details: RemplacementNomPropre[];
} {
	let sortie = "";
	let corrections = 0;
	const comptes = new Map<string, RemplacementNomPropre>();
	let i = 0;

	while (i < texte.length) {
		let trouve: FauteNomPropre | undefined;
		if (frontiere(i > 0 ? texte[i - 1] : undefined)) {
			trouve = ORDRE.find((f) => texte.startsWith(f.lu, i) && frontiere(texte[i + f.lu.length]));
		}
		if (trouve) {
			sortie += trouve.correct;
			i += trouve.lu.length;
			corrections++;
			const deja = comptes.get(trouve.lu);
			if (deja) deja.n++;
			else comptes.set(trouve.lu, { lu: trouve.lu, correct: trouve.correct, n: 1 });
			continue;
		}
		sortie += texte[i];
		i++;
	}

	return { texte: sortie, corrections, details: [...comptes.values()] };
}

/**
 * Corrige les noms propres mal lus d'une transcription.
 *
 * Pure et idempotente : aucune forme juste de la table n'est elle-même une
 * forme fautive, donc un second passage ne change rien (figé par un test).
 */
export function corrigerNomsPropres(texte: string): { texte: string; rapport: RapportRegle[] } {
	const { texte: sortie, corrections } = detaillerNomsPropres(texte);
	return { texte: sortie, rapport: [{ code: "noms-propres", corrections }] };
}
