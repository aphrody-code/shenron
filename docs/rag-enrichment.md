# RAG — enrichissement du corpus & reconstruction sans coupure

Le RAG hybride (BM25 `rag_chunks` FTS5 + embeddings denses `vec_chunks` vec0, fusion
RRF + rerank) sert la recherche du site, `/ask`, le Discord `/ask` et l'assistant.
Pipeline runtime : `apps/bot/src/lib/rag.ts` (cf. **Exploitation** ci-dessous pour le
scoring/dédup/filtrage). Build : `apps/bot/scripts/rag-build.ts`.

## Exploitation (runtime — `apps/bot/src/lib/rag.ts`)

- **Score normalisé** : chaque `RagHit` porte un `score` ∈ [0,1]. En `hybrid+rerank` =
  sigmoïde du logit du cross-encoder ; en `hybrid`/`lexical` = min-max planché à 0.4.
  Le score est **sémantique par mode** et **comparable uniquement au sein d'une même
  réponse et d'un même `mode`** — pas de seuil absolu cross-requêtes.
- **Déduplication / diversification** du top-N par **URL canonique**, puis repli sur le
  **titre foldé** (les chunks Fandom `kind=source` ont souvent une `url` vide). Le
  **manga est exempté** (clé par rowid) pour préserver le quota manga ≥2.
- **Stopwords + fold d'accents** : `ftsMatch` retire les stopwords FR/EN et fold les
  accents avant la requête FTS5 (l'index est `remove_diacritics 2` → fold sûr).
  Garde-fou : on ne filtre que si la requête fait >3 tokens **et** qu'il en reste ≥2.
- **Snippet de repli centré** sur le 1er terme de la requête.
- Propagation : `/api/public/rag/search` remonte `score` ; `/api/public/rag/chat` a reçu
  CORS + rate-limit ; GraphQL `RagHit` expose `rowid` + `score` ; MCP `rag_search` gagne
  les filtres `lang`/`entity`/`sourceId` + `score` (et `rag_ask` se fie aux `hits`
  sourcés, le rédacteur LLM étant OFF) ; Discord `/ask` affiche citations `[n]` + mode +
  % de pertinence ; site = puces de pertinence + îlot `WikiRagArchives` sur la page saga.
- Tests : `apps/bot/tests/rag-filter.test.ts` (score ∈ [0,1], dédup URL, dédup
  titre-vide, manga non-fusionné, tolérance stopwords).

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
enrichissement 2026-06-22 : **8521 docs → 36 228 chunks** (vs 7093 / 27 653). Depuis,
fusion du **manga OCR (147 tomes)** + **2058 docs Xenoverse 2** au corpus → **~40 874
chunks** (la phase d'embedding de `rag:build` dure désormais ~15 min).

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
> embed (~15 min) → la recherche casse pendant le build, et le DDL `DROP` gèle les
> handlers `Bun.serve`. Ne jamais le lancer au premier plan, ni en arrêtant le bot
> (downtime), ni en live. Si seuls les vecteurs sont à recalculer, préférer
> `rag-embed-vectors.ts` (ci-dessous), sans downtime.

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

### Rebuild des vecteurs seuls (sans downtime)

`apps/bot/scripts/rag-embed-vectors.ts` (re)calcule **uniquement `vec_chunks`** depuis un
`rag_chunks` déjà bon, **sans arrêter le bot** : l'embedding ne fait que des appels HTTP
au sidecar (aucun verrou d'écriture), et l'insertion finale est **atomique** ⇒ bascule
nette `lexical`→`hybride`. À utiliser après un correctif data (`fix-*`) ou un `rag:build`
interrompu, plutôt que le copy-swap complet.

## Vérification

```bash
curl -s "https://bot.dragonballfr.com/api/public/rag/search?q=daizenshuu&limit=3"  # mode hybrid+rerank
sqlite3 apps/bot/data/bot.db "SELECT count(*) FROM rag_chunks"                       # ≈ 40874
```

## Pièges

- **`/home/ubuntu/.gemini` manquant casse le boot du bot** (`226/NAMESPACE`) — l'unit
  `shenron.service` le référence dans `ReadWritePaths` ; s'il a été supprimé (nettoyage
  disque), `mkdir -p /home/ubuntu/.gemini` avant restart.
- **bxc** : le binaire compilé plante sur les commandes navigateur (`awaitPromise`) ;
  le `bxc` global route vers la source. Cf. [`docs/bxc.md`](#) / mémoire.
- `crawl-fandom-rag.ts` : le chemin par défaut sans `--cats` est buggé (array.split).
- **Fuite d'infobox Fandom** : l'ingest pouvait faire fuiter des paramètres d'infobox
  dans des champs de `bot.db_characters` (`name_ja`, `name_romaji`, `race`,
  `affiliation`, ex. `race = "Giras|Concepteur=…}}"`) — donc dans le corpus structuré
  lu par `rag-build`. Root cause corrigée dans `scripts/ingest/ingest-fandom-full.ts`
  (`clean()` coupe au 1er `}}` / `|` de tête) ; data déjà polluée nettoyée par
  `scripts/fix-infobox-leak.ts` (idempotent, 306 cellules, sur le Postgres `bot.*`
  source de vérité → propagé au SQLite par le reverse-sync). Re-propager au RAG via
  `rag-embed-vectors.ts` (ou un rebuild si le texte des chunks a changé).
