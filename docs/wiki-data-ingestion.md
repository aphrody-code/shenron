# Données wiki — ingestion Fandom → Neon

Comment grossir les données de l'encyclopédie (personnages, planètes, arcs…) avec
des **vraies données** (images self-hostées, infobox, descriptions) et **zéro
placeholder**.

## Architecture (rappel)

Les tables wiki-éditoriales (`db_characters`, `db_planets`, `db_arcs`, `db_sagas`,
`db_techniques`, `db_transformations`, …) vivent dans **Neon** (source de vérité),
reverse-syncées Neon→SQLite toutes les 15 min (`shenron-neon-pull`, liste dans
`apps/bot/scripts/_wiki-editorial.ts`). Le **site lit Neon en direct** ; le **bot
Discord + le RAG lisent le réplica SQLite**.

> ⚠️ Les anciens `ingest-fandom-*.ts` (dans `scripts/ingest/`) écrivent en **SQLite
> (gardé par `wiki-write-guard`)** ET insèrent des **placeholders** (image = logo,
> race = « Inconnue »). **Ne pas les utiliser.** Pour grossir, écrire dans **Neon**.

## Outils (`apps/bot/scripts/ingest/`)

- **`ingest-fandom-full.ts`** — ingestion riche depuis `dragonball.fandom.com/fr`
  via l'**API MediaWiki** (officielle, paginée). `--cat characters|planets|locations
  [--limit N] [--dry-run]`.
  - `categorymembers` → liste des pages d'une catégorie (FR « Personnages » = 1271
    pages).
  - `prop=pageimages|extracts|revisions` (batch 25) → image originale + wikitext.
  - Parse l'**infobox FR** (`Race`, `Nom Original`=ja, `Statut`, `Origine`…).
  - **Télécharge + self-host l'image réelle** en WebP → `assets/wiki/<cat>/<slug>.webp`
    (gitignored). Upsert Neon.
  - **Zéro placeholder** : une ligne sans image réelle est **sautée** ; un champ absent
    reste **NULL** (jamais « Inconnu »). Pose `is_destroyed=0` pour les planètes (cf.
    piège reverse-sync).
- **`enrich-fandom-descriptions.ts`** — `--table db_characters|db_planets`. L'API
  `prop=extracts` est **cassée sur ce wiki** → on parse l'intro HTML de la section 0
  (`action=parse&prop=text&section=0`), strip infobox/refs/balises, 1er vrai
  paragraphe → `description`. Idempotent (ne touche que les NULL).
- **Arcs** : portés de la liste `seed-arcs.ts` vers Neon (map `sagaSlug` →
  `db_sagas.id`).

## Croissance obtenue (2026-06-22)

| Table | Avant | Après |
|---|---|---|
| `db_characters` | 108 | **1323** (904 descriptions) |
| `db_planets` | 20 | **62** |
| `db_arcs` | 0 | **23** |

Toutes les images wiki sont **self-hostées** (0 hotlink `http%`).

## Zéro placeholder (mandat)

- Pas de « Bientôt disponible » / « Inconnu » / image-logo.
- Champs absents → NULL → masqués gracieusement par les pages détail (qui testent
  `field && …`).
- `CharacterGrid` rend en **progressif** (« Voir plus ») pour encaisser 1300+ entrées.

## Piège critique — reverse-sync & NULL NOT-NULL

Le SQLite du bot a des colonnes **NOT NULL** que Neon autorise NULL. Un NULL en Neon
casse la reverse-sync (`SQLITE_CONSTRAINT_NOTNULL`, qui rollback toute la transaction
et fige la data du bot). Colonnes vues : `db_planets.is_destroyed` (bigint 0/1),
`db_assets.source_id|license_key|created_at`. **Toujours poser une valeur par défaut
en Neon** (jamais NULL) pour ces colonnes. Vérif après ingestion :
`systemctl start shenron-neon-pull.service` puis `systemctl is-active` (≠ failed).

## Flux complet

1. `env DATABASE_URL=… bun scripts/ingest/ingest-fandom-full.ts --cat characters`
2. `… enrich-fandom-descriptions.ts --table db_characters`
3. `systemctl start shenron-neon-pull.service` (→ bot SQLite à jour)
4. Le site montre la data (lecture Neon directe) ; redeploy pour figer l'ISR.
5. RAG : cf. [`docs/rag-enrichment.md`](rag-enrichment.md).
