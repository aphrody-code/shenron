# comic.dragonballcn.com — miroir local

Miroir de ce que **comic.dragonballcn.com** (鳥山明漫画資料館, « musée de la bande
dessinée d'Akira Toriyama ») sert publiquement : sa **bibliographie** et les
**couvertures** qui identifient chaque édition.

Régénéré par [`apps/bot/scripts/assets-dragonballcn.ts`](../../scripts/assets-dragonballcn.ts).

## Rangement

```
assets/dragonballcn/
├── index.json                       manifeste : 12 collections → 476 ouvrages
├── <collection>/NNN.webp            couverture, NNN = rang de parution dans l'édition
└── README.md                        ce fichier
```

Les 12 pages de catalogue dont tout ceci est tiré sont archivées telles quelles
sous [`apps/bot/data/catalogues/pages/`](../../data/catalogues/pages/).

| Collection                  | Ouvrages | Couvertures | Datés | Paginés | Planches recensées |
| --------------------------- | -------: | ----------: | ----: | ------: | -----------------: |
| `dragonball_jp_original`    |       42 |          42 |    42 |      42 |              5 698 |
| `dragonball_jp_kanzenban`   |       34 |          34 |     5 |      34 |              6 576 |
| `dragonball_full_color`     |       42 |          42 |     7 |      42 |              7 383 |
| `dragonball_zh_cn`          |       43 |          43 |     5 |      43 |              6 253 |
| `dragonball_zh_tw`          |       42 |          42 |     5 |      40 |              4 093 |
| `dragonball_zh_hk_ultimate` |       34 |          34 |    32 |      34 |              3 408 |
| `dragonball_anime_z`        |       39 |          39 |     0 |      38 |              5 318 |
| `dragonball_anime_movie`    |       20 |          20 |     0 |      20 |              2 667 |
| `arale_cn`                  |       18 |          18 |     5 |      18 |              2 957 |
| `arale_jp_lib`              |        9 |           9 |     9 |       9 |              2 196 |
| `arale_zh_hk`               |       18 |          18 |    17 |      18 |              1 688 |
| `divers`                    |      135 |           0 |   122 |     126 |             12 326 |
| **Total**                   |  **476** |     **341** | **249** | **464** |        **60 563** |

Les **476 ouvrages** sont tous décrits. Ce qui varie, c'est ce que la source publie
sur chacun :

- **341 couvertures** — soit 100 % de celles que le site met en ligne. Les 135
  ouvrages de `divers` n'en ont pas : le site les présente en listes de liens
  textuels, sa seule image de bloc étant l'icône de rubrique, partagée par tous les
  ouvrages du bloc. Elle est enregistrée comme telle (`rubrique_icone`), pas
  maquillée en couverture.
- **464 paginations relevées** sur 476, en cinq passes (95 → 51 → 34 → 19 → 12
  fiches sans réponse). Les 12 dernières sont marquées `pagination: "fiche muette"` :
  le site ne rend pas leur fiche, et une absence de mesure n'est pas un zéro.
- **249 dates** et **87 ISBN** — l'éditeur ne figure que sur les pages qui portent
  un bloc de métadonnées ; ailleurs, la date vient de la liste d'index
  (`[1985|2013]` = parution originale | mise en ligne).

`divers` rassemble databooks, artbooks et hors-séries, rangés par la **rubrique**
éditoriale du site lui-même (ouvrages de référence, autres œuvres de Toriyama,
doujinshi, courts récits…).

## Ce que porte `index.json`

Par ouvrage : `rang`, `did`, `url_fiche`, `titre`, `rubrique`, `premiere_edition`,
`numerisation`, `date_affichee`, `isbn`, `editeur`, `magazine`, `prix`,
`fil_forum`, `planches_recensees`, `pagination`, et pour la couverture son
`chemin` local, sa `source_url`, ses dimensions, son poids et son `sha256`.

`fil_forum` conserve le fil de bbs.dragonballcn.com que le site crédite pour la
numérisation. `planches_recensees` vient de
[`dragonballcn-inventaire.json`](../../data/catalogues/dragonballcn-inventaire.json),
qui nomme et date chaque planche : c'est un **index**, pas un contenu.

## Ce qui n'est pas ici, et pourquoi

Les **39 017 planches ne sont pas reproduites**. Mesuré le 2026-09-04, à client
honnête (curl, User-Agent nominatif, Referer de la fiche) :

| Réponse | Ressource                                          |
| ------- | -------------------------------------------------- |
| `200`   | `images/cover/db_jp_or/01.gif` — les couvertures    |
| `403`   | `list/0.Dragon_Ball-buyao_daolian_ya/DB02_000….jpg` |
| `403`   | la miniature de cette même planche                  |
| `403`   | `list/gain_1.php?did=0-1-1` — la fiche qui les liste |

Le site ouvre son catalogue et ferme ses pages de lecture. Le dossier qui porte
les planches s'appelle `0.Dragon_Ball-buyao_daolian_ya` — 不要盗链呀, « ne
hotlinkez pas » : le refus est écrit dans le nom du dossier, ce n'est pas une
panne de configuration. Son `robots.txt` porte `Content-Signal: search=yes,
ai-train=no, use=reference`, sous mention expresse d'une réservation de droits au
titre de l'article 4 de la directive européenne 2019/790, et interdit nommément
les moissonneurs d'IA. Enfin ces planches sont l'œuvre de Toriyama éditée par
Shueisha, que ce site redistribue sans licence.

Référencer est permis, et c'est ce que fait ce miroir. Reproduire le corps de
l'œuvre à travers un refus explicite, non.

## Licence

`FAIR-USE-EDITORIAL`, comme les autres buckets bibliographiques de la base
(shueisha, viz, toei). Attribution : *comic.dragonballcn.com*. Les couvertures
restent la propriété de leurs éditeurs (集英社 / 東立 / 文化傳信 / 天下), reproduites
au format vignette pour identifier une édition dans une bibliographie.
