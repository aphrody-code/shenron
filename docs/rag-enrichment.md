# RAG — enrichissement du corpus & reconstruction sans coupure

Le RAG hybride (BM25 `rag_chunks` FTS5 + embeddings denses `vec_chunks` vec0, fusion
RRF + rerank) sert la recherche du site, `/ask`, le Discord `/ask` et l'assistant.
Pipeline runtime : `apps/bot/src/lib/rag.ts`. Build : `apps/bot/scripts/rag-build.ts`.

## Tables (dans `apps/bot/data/bot.db`)

- `rag_chunks` — FTS5 (`kind, title, url, content, lang, source_id, entity`).
- `vec_chunks` — vec0 (`embedding float[384]`), aligné par **rowid** sur `rag_chunks`.
- `rag_meta` — (`model, dim, count, built_at`).

`rag-build.ts` lit la base (`RAG_DB` env, défaut `bot.db`) pour les entités
structurées **+** `data/rag/corpus.json` (full-text scrapé), chunke (sémantique,
~1400 chars, overlap 15 %), et **embed via le sidecar `:5007`** (`shenron-embed`,
`sqliteVec.load(db)`).

## Corpus (`apps/bot/data/rag/corpus.json`)

Format `{generatedAt, count, docs:[{id, name, url, markdown}]}`. État après
enrichissement 2026-06-22 : **8521 docs → 36 228 chunks** (vs 7093 / 27 653).

### Sources de full-text & crawlers

- **Fandom FR + EN** (`crawl-fandom-rag.ts --lang fr|en --cats "A,B,…" --out shard.json`)
  — `categorymembers` + récursion 1 niveau de sous-catégories, `action=parse` →
  wikitext nettoyé. FR ~2189 docs, EN ~5760 docs. ⚠️ passer `--cats` explicitement.
- **Kanzenshuu** (`crawl-kanzenshuu-rag.ts`) — databooks officiels (Daizenshuu,
  Chōzenshū…). BFS scopé `/databook/…`, extraction `<main id="content">`. ~342 docs.
- **Databooks traduits** (`crawl-databooks-rag.ts`) — Kanzentai (archives **Wayback**),
  forums Neoseeker (**via Wayback** car blocage direct 403), Toei officiel, fredcrash.
  ~28 docs.

### Fusion

`merge-corpus.ts shard-fr.json shard-en.json …` — dédupe par `id` (le markdown le plus
long gagne), garde les docs non-Fandom, **backup `corpus.json.bak`**.

## Reconstruction SANS coupure de recherche

> **Ne JAMAIS rebuild sur la base live** : `rag-build` `DROP TABLE rag_chunks` puis
> embed (~1 h) → la recherche casse pendant le build et risque de figer l'API du bot.

Procédure copy-swap :

```bash
# 1. Reverse-sync d'abord (la copie doit avoir la data structurée à jour)
sudo systemctl start shenron-neon-pull.service

# 2. Build sur une COPIE (le bot continue de servir l'ancien index)
sqlite3 apps/bot/data/bot.db ".backup /tmp/ragbuild.db"
RAG_DB=/tmp/ragbuild.db bun apps/bot/scripts/rag-build.ts   # ~45-90 min

# 3. Swap atomique (bot arrêté ~1-2 min) — préserve les rowid
sudo systemctl stop shenron
bun apps/bot/scripts/swap-rag-tables.ts        # ATTACH copie → remplace rag_chunks/vec_chunks/rag_meta
sudo systemctl start shenron
```

`swap-rag-tables.ts` charge sqlite-vec, recrée les tables FTS5/vec0 et copie les
lignes en préservant le **rowid** (alignement chunk↔vecteur). Source = `$RAG_COPY`
(défaut `/tmp/ragbuild.db`).

## Vérification

```bash
curl -s "https://bot.dragonballfr.com/api/public/rag/search?q=daizenshuu&limit=3"  # mode hybrid+rerank
sqlite3 apps/bot/data/bot.db "SELECT count(*) FROM rag_chunks"                       # = 36228
```

## Pièges

- **`/home/ubuntu/.gemini` manquant casse le boot du bot** (`226/NAMESPACE`) — l'unit
  `shenron.service` le référence dans `ReadWritePaths` ; s'il a été supprimé (nettoyage
  disque), `mkdir -p /home/ubuntu/.gemini` avant restart.
- **bxc** : le binaire compilé plante sur les commandes navigateur (`awaitPromise`) ;
  le `bxc` global route vers la source. Cf. [`docs/bxc.md`](#) / mémoire.
- `crawl-fandom-rag.ts` : le chemin par défaut sans `--cats` est buggé (array.split).
