# Traitement du japonais

Socle de parsing, de contrôle et (à terme) de traduction du japonais, au service
des transcriptions de databooks : **11 775 planches**, dont 5 912 transcrites au
2026-08-22 par lecture automatique de scans.

L'ordre de travail est délibéré — **maîtriser la langue, puis fiabiliser la
retranscription, et seulement ensuite traduire**. Traduire un texte mal lu ne
produit qu'un contresens bien formé.

## Mise en route

```bash
bun apps/site/scripts/ja-preparer.ts        # installe les ressources (~25 Mo)
```

Deux ressources, hors dépôt, dans `apps/site/.ja-data/` (gitignoré) :

| Ressource | Rôle | Poids |
|---|---|---|
| dictionnaire **kuromoji** (IPADIC) | découpage, nature, lecture, lemme | 18 Mo |
| index **JMdict** (EDRDG, CC BY-SA 4.0) | « ce mot existe-t-il en japonais ? » | 7,6 Mo |

JMdict est la base de [jisho.org](https://jisho.org) : 218 461 entrées, 464 819
graphies. Le script n'en garde que les formes écrites — le JSON d'origine pèse
113 Mo pour une question qui tient dans un `Set`.

## Modules

`apps/site/src/lib/ja/`

| Fichier | Contenu | Dépendances |
|---|---|---|
| `normalisation.ts` | écritures, `normaliserJa`, katakana → hiragana, furigana | aucune |
| `anomalies.ts` | distance bornée, index du lexique, suggestion | aucune |
| `lexique.ts` | lexique du domaine depuis `bot.*` | `server-only` |
| `dictionnaire.ts` | kuromoji + JMdict, chargement paresseux | fichiers |
| `index.ts` | `anomaliesJaponais`, `avecFurigana`, `motsDeRequete` | `server-only` |

Les deux premiers sont purs, donc testés sans dictionnaire ni base
(`apps/site/tests/ja.test.ts`).

## Détecter les fautes de lecture

```bash
bun apps/site/scripts/ja-analyser.ts [--limite N] [--seuil N] [--json f.json]
```

Une graphie n'est signalée que si **quatre** filtres la laissent passer, chacun
réglant une famille de faux positifs que le précédent laissait entrer :

1. **kuromoji** la marque inconnue d'IPADIC ;
2. **JMdict** ne la connaît pas non plus — c'est ce qui absout les emprunts à
   l'anglais (`コミックス` comics, `バーサス` versus, `スライム` slime), absents des
   dictionnaires morphologiques mais parfaitement corrects ;
3. elle n'est ni un terme du domaine, ni un **morceau** d'un terme du domaine —
   IPADIC découpe les noms qu'il ignore, et `ンクス` (bout de `トランクス`)
   remontait 105 fois comme mot inconnu ;
4. la forme correcte proposée existe vraiment dans le corpus, **et plus souvent**
   que la graphie suspecte.

Mesuré sur les 5 912 planches : 2 228 111 tokens en 70 s, 74 584 inconnus
d'IPADIC, 17 185 absous par JMdict, **1 217 corrections proposées**. Les plus
fréquentes sont justes — `プロリー → ブロリー` (212×), `ビッコロ → ピッコロ` (195×),
`フルマ → ブルマ` (98×). Vegeta est mal lu sous **quatre** graphies différentes.

**Rien n'est appliqué automatiquement, et ce n'est pas une précaution de façade :**
le taux de justesse est d'environ 85 %. `ギャリック` est « corrigé » en `ガーリック`
(Garlic) alors qu'il vient de `ギャリック砲`, le Galick Gun — faute de la moindre
technique en japonais dans notre base.

## Repérer le vocabulaire manquant

```bash
bun apps/site/scripts/ja-vocabulaire.ts [--min N] [--json f.json]
```

Même signal que le détecteur de fautes, lu **en sens inverse** : une graphie
inconnue partout mais **fréquente et stable d'un ouvrage à l'autre** n'est pas
une faute, c'est du vocabulaire qui nous manque.

Sur le corpus : 10 164 graphies inconnues, 353 fréquentes → **271 candidats de
vocabulaire** et 82 fautes renvoyées au détecteur. Trouvés ainsi : `スカウター`
(scouter, 477×), `マジュニア` (Ma Junior, 223×), `グレートサイヤマン`,
`カードダス`, `ポルンガ`, `マッスルタワー`, `メタルクウラ`.

## Limites connues

- **Aucune technique n'a de nom japonais en base** (0 sur 825). Ni `かめはめ波`,
  ni `界王拳`, ni `ギャリック砲`. C'est la première lacune à combler : elle
  produit à la fois des faux positifs et des traductions littérales.
- Les corrections ne sont proposées que **vers le lexique du domaine**. Étendre
  la recherche de voisins à JMdict attraperait `パンダイ → バンダイ`,
  `バワー → パワー`, `ベンギン → ペンギン` — toutes fréquentes dans le corpus.
- La qualité de la lecture automatique est inégale : `ドラゴンボール` lui-même
  est mal lu 95 fois.

## Traduction (non déployée)

Mesuré avec NLLB-200-distilled-600M via `@huggingface/transformers`, en local :
la grammaire est correcte, **le vocabulaire du domaine est massacré**.
`孫悟空は界王拳を使った` devient « Son-gu a utilisé le poing du roi ».

Masquer les termes du lexique avant traduction, puis réinjecter leur forme
française officielle, corrige l'essentiel : « **Son Goku** a utilisé… »,
« **Vegeta** est le prince des **Saiyans** ». Le modèle ne traduit plus que ce
qu'il sait traduire — la phrase autour.

Chiffres à connaître : 87 s de chargement, ~3 s par phrase. C'est un traitement
par lot, pas une fonctionnalité de page.
