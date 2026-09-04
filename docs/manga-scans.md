# Scans manga — self-hosting & ingestion

Architecture et outils des scans manga de DBFR. **Objectif : zéro hotlink** — toutes
les planches sont téléchargées sur le VPS et servies depuis `bot.dragonballfr.com`
(plus de « renvoi sur un autre site »).

## Hébergement & service

- **Sur disque** : `apps/bot/assets/manga/<SÉRIE>/...` (gitignored — VPS-only,
  régénérable par les scripts). Converti en **WebP**.
- **Servi** par le bot : route `/assets/*` (`apps/bot/src/api/server.ts` →
  `serveAsset`) → `bot.dragonballfr.com/assets/manga/...`.
- **En base (Neon)** : `bot.db_manga_chapters.pages` (jsonb, **Neon-only**) stocke
  des chemins relatifs `./assets/manga/...`. Le site lit Neon en direct et résout
  via `assetUrl()` (`apps/site/src/lib/assets.ts`). Le lecteur =
  `apps/site/src/components/manga/MangaReader.tsx`.
- Schéma de chemin : `assets/manga/<SÉRIE>/<sous-dossier>/<NNN>.webp`. Ex. :
  - DBS N&B : `assets/manga/DBS/ch<id>/NNN.webp`
  - DB original VF : `assets/manga/DB/regular/vol<N>/NNN.webp`
  - Couleur : `assets/manga/DB/fullcolor/enfance-goku/t<chapter_number>/NNN.webp`

## Contenu disponible

| Série                             | État                               | Source                      |
| --------------------------------- | ---------------------------------- | --------------------------- |
| **Dragon Ball Super** (N&B)       | complet (23 tomes / 103 chapitres) | scan-vf.net → self-host     |
| **Dragon Ball original VF** (N&B) | **complet — 42 tomes**             | Sushi Scan → CDN anime-sama |
| **Dragon Ball Full Color**        | « L'enfance de Goku » — 2 tomes    | Sushi Scan → CDN anime-sama |

Total : **~12 700 planches self-hostées**. Le manga JP (VO) n'est pas disponible
proprement depuis le VPS (MangaDex n'héberge pas le raw JP de DB ; les agrégateurs
de raws JP sont des SPA JS). Source JP candidate restante : `jmanga.nyc`.

### comic.dragonballcn.com — bibliographie, pas planches

`comic.dragonballcn.com` (鳥山明漫画資料館) a été **miroité pour ce qu'il sert** :
476 ouvrages sur 12 collections (les 42 tomes japonais, la kanzenban, la Full
Color, les éditions chinoises, les anime comics, Arale, les databooks), leurs
métadonnées d'éditeur — 87 ISBN, dates de première édition, prix, magazine — et
leurs **341 couvertures**, rangées sous `apps/bot/assets/dragonballcn/`
(cf. son [README](../apps/bot/assets/dragonballcn/README.md)). Les 12 pages de
catalogue sont archivées sous `apps/bot/data/catalogues/pages/`.

Ses **39 017 planches sont recensées mais pas reproduites**. Mesuré le 2026-09-04
à client honnête : les couvertures répondent `200`, les planches `403`, leurs
miniatures `403`, et les fiches de lecture `403`. Le dossier qui les porte
s'appelle `0.Dragon_Ball-buyao_daolian_ya` (不要盗链呀, « ne hotlinkez pas ») et le
`robots.txt` du site porte `use=reference` sous réservation expresse de droits
(directive UE 2019/790, art. 4). C'est un refus explicite, pas un obstacle
technique — le miroir s'y tient.

## Scripts d'ingestion (`apps/bot/scripts/`)

Tous prennent `DATABASE_URL` (Neon) et ont un **garde-fou disque** (stop sous un
seuil de Go libres) + conversion WebP (`sharp`).

- **`ingest-dragonball-volumes.ts`** — Dragon Ball original VF (42 tomes) depuis
  Sushi Scan (`sushiscan.fr/dragon-ball-volume-N-vf/` → parse `ts_reader.run({…})`
  → CDN `s22.anime-sama.me/.../Dragon Ball/N/...`). Niveau de gris + resize 1280 +
  WebP q55 (manga N&B compresse bien). 1 chapitre lisible par tome, rattaché au
  volume existant `Dragon Ball Vol. N`. `--from --to --force --dry-run`.
- **`ingest-fullcolor-manga.ts`** — édition couleur (parse `ts_reader`, images déjà
  WebP, pas de reconversion). Crée des chapitres `chapter_number` 90x.
- **`selfhost-manga-pages.ts`** — rapatrie les planches N&B externes (scan-vf,
  lelscanfr) déjà référencées : download + WebP + réécrit `pages` en chemins locaux.
  **Referer par hôte** (anti-hotlink). ⚠️ **Ne PAS envoyer de Referer `mangadex.org`**
  (mangadex renvoie du HTML/bloque) ; mangadex marche sans Referer mais bloque le
  VPS de façon intermittente → ses chapitres ont été retirés.
- **`crawl-dragonballcn.ts`** / **`volumetrie-dragonballcn.ts`** / **`assets-dragonballcn.ts`**
  — le trio comic.dragonballcn.com : relevé du catalogue, inventaire de pagination
  (via `bxc-mcp`, seul client que les fiches servent), puis constitution du miroir
  rangé sous `assets/dragonballcn/` (couvertures WebP + `index.json`). Aucune
  planche : cf. la section ci-dessus.
- **`clean-fullcolor-promos.ts`** — retire par **OCR** (tesseract fra+eng) les
  planches non-contenu : pubs « SUSHISCAN.FR » (texte « lisez … chapitres »), pages
  de crédits staff, pages blanches. Garde-fou : abort si > 18 % d'un tome retiré.

## UI (`apps/site/src/components/manga/`)

- `MangaVolumeGrid.tsx` — onglets DBS / **Dragon Ball (édition couleur)** / Scans /
  Succès. **Zéro placeholder** : seuls les tomes/chapitres ayant des scans sont
  affichés ; badge « Couleur » (`isColorChapter`).
- `VolumeChaptersList.tsx` — n'affiche que les chapitres disponibles (le « Bientôt
  disponible » a été supprimé).
- Routes : `/wiki/manga` (index ISR), `/wiki/manga/[id]` (lecteur, `generateStaticParams`),
  `/wiki/manga/volume/[id]`.

## Pièges

- **Disque** : le VPS est tendu — convertir en WebP, honorer le garde-fou.
- **`db_manga_chapters` est wiki-éditorial** (reverse-syncé Neon→SQLite) mais la
  colonne `pages` est Neon-only (exclue par intersection de colonnes).
- **Pubs scanlation** : Sushi Scan/anime-sama insèrent des pages pub/crédits → passer
  `clean-fullcolor-promos.ts` après toute ingestion couleur. Le DB régulier (Sushi
  Scan) n'a pas de pub aux bords.
- À venir : **OCR des planches → markdown** (cf. [`docs/ocr-manga.md`](ocr-manga.md)).
