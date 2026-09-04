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

| Collection                  | Ouvrages | Couvertures | Planches recensées |
| --------------------------- | -------: | ----------: | -----------------: |
| `dragonball_jp_original`    |       42 |          42 |              3 146 |
| `dragonball_jp_kanzenban`   |       34 |          34 |              3 739 |
| `dragonball_full_color`     |       42 |          42 |              6 840 |
| `dragonball_zh_cn`          |       43 |          43 |              4 039 |
| `dragonball_zh_tw`          |       42 |          42 |              2 490 |
| `dragonball_zh_hk_ultimate` |       34 |          34 |              2 238 |
| `dragonball_anime_z`        |       39 |          39 |              3 717 |
| `dragonball_anime_movie`    |       20 |          20 |              2 054 |
| `arale_cn`                  |       18 |          18 |              2 092 |
| `arale_jp_lib`              |        9 |           9 |              2 196 |
| `arale_zh_hk`               |       18 |          18 |                976 |
| `divers`                    |      135 |           0 |              5 490 |
| **Total**                   |  **476** |     **341** |         **39 017** |

`divers` rassemble databooks, artbooks et hors-séries : le site les liste en texte,
sans vignette — d'où l'absence de dossier pour cette collection.

## Ce que porte `index.json`

Par ouvrage : `rang`, `did`, `url_fiche`, `titre`, `premiere_edition`, `isbn`,
`editeur`, `magazine`, `prix`, `planches_recensees`, et pour la couverture son
`chemin` local, sa `source_url`, ses dimensions, son poids et son `sha256`.

87 ouvrages portent un ISBN relevé chez l'éditeur. `planches_recensees` vient de
[`dragonballcn-inventaire.json`](../../data/catalogues/dragonballcn-inventaire.json) :
c'est un **compte**, pas un contenu.

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
