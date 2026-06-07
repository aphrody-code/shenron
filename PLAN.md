# PLAN.md — RAG canon (bxc) + LLM Dragon Ball (aphrody)

> Roadmap exécutable pour porter le RAG Dragon Ball au niveau « corpus canon complet »
> via **bxc** (moteur de scraping), puis bâtir un **assistant LLM Dragon Ball** via
> **aphrody** (gateway Google AI : Gemini / Antigravity / NotebookLM). Chaque phase est
> autonome, vérifiable, et livrable indépendamment.

État au démarrage de ce plan : le RAG runtime est déjà **SOTA** (récupération hybride
BM25 + embeddings denses multilingues, fusion RRF, puis reranking cross-encoder — cf.
`apps/bot/src/lib/rag.ts`, commits `100a8a3` + `eaa3fd8`). Ce qui manque pour « le
meilleur RAG possible » n'est plus l'algorithme mais **le corpus** (1041 chunks, surtout
de la donnée structurée) et **la génération** (réponses en langage naturel). Ce plan
adresse exactement ces deux manques.

---

## 0. Contraintes dures (à garder en tête partout)

| Contrainte                                                           | Impact sur le plan                                                                                                                                                                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **VPS CPU-only** (Cirrus virtuel, pas de GPU)                        | Pas de fine-tuning/entraînement from-scratch on-VPS. Fine-tune = **GPU loué** (RunPod / Vast.ai / Modal) ou **distillation + RAG-grounded** (sans entraînement). Inférence d'un modèle 2-3B quantifié GGUF en CPU = viable mais lente.      |
| **aphrody n'est pas un trainer**                                     | C'est un client Google AI (`antigravity chat`, `gemini`, `notebooklm`, `chat`, `agent`). Il sert à **générer** (distillation de dataset, réponses grondées) — pas à entraîner des poids.                                                    |
| **bot à `MemoryMax=1.5G`**                                           | Tout modèle (embeddings, reranker, LLM) vit dans un **sidecar isolé**, jamais dans le process bot. Pattern déjà établi : `shenron-embed.service`.                                                                                           |
| **Ayants droit officiels** (Bandai/Shueisha/Toei — cf. profil owner) | Accès légitime aux sources canon. **Préserver l'attribution** (`db_sources`/`db_licenses`) à chaque chunk. Respecter robots.txt / ToS des sources tierces, proxy résidentiel pour les IP datacenter filtrées (`dragonball.news`, `bandai`). |
| **Wiki = Neon source de vérité, SQLite = replica**                   | Le corpus RAG (`rag_chunks`/`rag_vectors`) est **dérivé local** (pas du wiki éditorial) — pas concerné par les gardes `wiki-write-guard`. Mais les sources scrapées qui enrichissent `db_*` passent par Neon (`/api/wiki-admin`).           |
| **Coûts API Gemini**                                                 | La distillation (B3) peut générer des dizaines de milliers d'appels. Budgétiser, batcher, cacher, et plafonner.                                                                                                                             |

---

## PARTIE A — « Entraîner » le RAG : ingénierie de corpus via bxc

> « Train the RAG » ≠ entraîner un modèle. C'est **construire le meilleur corpus indexable
> possible** : couverture canon maximale, chunks propres et sémantiquement cohérents,
> métadonnées riches, et ré-indexation continue. La qualité du RAG est désormais bornée
> par le corpus, pas par l'algo.

Fondations déjà en place à étendre : `apps/bot/scripts/rag-recon.ts` (bxc recon → `data/rag/<slug>.md` + `corpus.json`), `apps/bot/scripts/ingest/bxc-ingest.ts`, `apps/bot/scripts/rag-build.ts` (chunk + embed + rerank-ready).

### A0 — Baseline & harnais d'évaluation _(préalable non négociable)_

- Construire un **gold set** : 50-100 questions FR réalistes (langage naturel, paraphrases, noms JP) → doc(s) attendu(s). Fichier `apps/bot/tests/rag-gold.jsonl` (`{query, expected_urls[], expected_kinds[]}`).
- Script d'éval `apps/bot/scripts/rag-eval.ts` : pour chaque question, lance `hybridSearch` (et les 3 modes : lexical / hybrid / hybrid+rerank) et calcule **Recall@{1,3,5,10}**, **MRR**, **nDCG@10**.
- **Mesurer la baseline AVANT tout changement de corpus.** Tout commit d'enrichissement doit améliorer (ou ne pas régresser) ces métriques → **gate CI**.
- Livrable : `apps/bot/reports/rag-eval-baseline.md`.

### A1 — Inventaire des sources & priorisation canon

- Lister depuis `db_sources` + compléter. **Priorité canon décroissante** :
  1. **Kanzenshuu** (Daizenshuu, guides, traductions de référence) — la bible fan canon.
  2. **Fandom** FR + EN + JA (`dragonball.fandom.com`) — personnages, sagas, techniques, épisodes (déjà partiellement ingéré : `ingest-fandom-*.ts`).
  3. **Officiel** : `dragon-ball-official.com` (FR/EN), `dragonball.jp`, Toei, Shueisha, Bandai (catalogues jeux), Viz/Shonen Jump+ (résumés manga).
  4. **Bases tierces** : `dragonball-api.com`, AniList/Jikan/Kitsu (métadonnées épisodes/films).
- Tagger chaque source : `license_key`, langue, type de contenu (lore / épisode / manga / jeu / news), fragilité (cert/IP).
- Livrable : `reference/db-recon/SOURCES-RAG.md` (matrice source × couverture × licence × stratégie de fetch).

### A2 — Récolte via bxc _(le cœur « bxc »)_

- Étendre `rag-recon.ts` → `rag-harvest.ts` orchestrant les bons sous-outils bxc selon la source :
  - `bxc recon <url>` → HTML propre → Markdown (pages lore).
  - `bxc scrape --selector <css>` → extraction ciblée (tableaux de techniques, listes d'épisodes).
  - `bxc mirror <url>` → site entier (sources compactes officielles).
  - `bxc search "<requête>"` → découverte de pages canon manquantes.
  - `bxc crawl-worker` (daemon 24/7) → crawl récursif borné par domaine pour la couverture de masse.
- Profils : `static|fast|http|stealth|max` selon l'anti-bot (cf. `BXC_PROFILE`). **Proxy résidentiel** (`--proxy`) pour `dragonball.news` / `bandai` (IP datacenter VPS filtrée).
- Discipline : rate-limit + backoff, `bxc har` pour rejouer/déboguer, jamais d'écriture destructive.
- Sortie : `apps/bot/data/rag/raw/<source>/<page>.md` + manifeste `harvest.json` (url, source_id, license, lang, fetched_at, hash).
- Livrable : corpus brut versionné (hash-tracké), rapport de couverture vs A1.

### A3 — Nettoyage & normalisation

- Strip boilerplate (nav, pubs, "modifier", catégories Fandom), normaliser le markdown.
- **Déduplication** cross-source : MinHash/SimHash sur shingles → fusionner les quasi-doublons (FR/EN qui se recouvrent), garder la version la plus riche + cumuler les attributions.
- **Canonicalisation des entités** : aliasing des noms (Son Goku = Sangoku = Kakarot = 孫悟空) via une table d'alias → meilleur rappel cross-langue.
- Détection de langue par chunk (champ `lang`).
- Livrable : `data/rag/clean/*.md` + `alias-map.json`.

### A4 — Chunking sémantique _(remplace le découpage naïf 900 chars)_

- Découpage **phrase-aware** par fenêtres de 256-512 tokens avec **overlap** 15 %, respectant les frontières de section (titres markdown).
- Métadonnées par chunk : `source_id`, `license_key`, `lang`, `entity` (résolu via alias-map), `section`, `url` profond.
- Garder la donnée structurée `db_*` (déjà excellente) comme chunks « fiche » + ajouter les chunks « narratif » du corpus.
- Livrable : `corpus.json` v2 (schéma enrichi) + `rag-build.ts` adapté pour ingérer ces métadonnées dans `rag_chunks` (colonnes `lang`, `source_id`, `entity`).

### A5 — Embeddings & index

- `rag:build` ré-embed tout (`multilingual-e5-small` actuel). **Décision de scale** :
  - Corpus < ~20 k chunks → brute-force cosine actuel reste optimal (zéro changement).
  - Corpus > ~50 k chunks → passer à `sqlite-vec` (ANN) ou monter le modèle (`bge-m3`, `multilingual-e5-base` 768d) si l'éval le justifie. Décider **par les métriques A0**, pas par dogme.
- Reranker déjà en place (`bge-reranker-base`) — réévaluer `bge-reranker-v2-m3` si gain mesuré.
- Livrable : `rag_vectors` reconstruit + `rag_meta` versionné.

### A6 — Évaluation & A/B

- Relancer `rag-eval.ts` → comparer à la baseline A0. Cibles : **Recall@5 ≥ 0.9**, **MRR ≥ 0.8** sur le gold set.
- Ablations : lexical vs hybrid vs hybrid+rerank ; impact taille corpus ; impact modèle.
- Livrable : `apps/bot/reports/rag-eval-<date>.md` + verdict go/no-go.

### A7 — Rafraîchissement continu

- `bxc crawl-worker` en daemon + nouveau timer `shenron-rag-refresh.timer` (hebdo) → fetch incrémental (par hash), re-chunk des pages changées, **ré-embed incrémental** (seulement les nouveaux/modifiés chunks).
- News : déjà `sync-news.ts` ; brancher l'ingest news dans le corpus RAG.
- Livrable : `deploy/systemd/shenron-rag-refresh.{service,timer}` + doc.

### A8 — Garde-fous

- **Attribution préservée** end-to-end (du chunk au snippet affiché) ; respect robots/ToS ; proxy pour les sources sensibles.
- **Gate qualité** : aucun déploiement de corpus si l'éval régresse (CI).
- Pas de fuite de contenu sous copyright dans des réponses verbatim longues (la génération B cite + paraphrase).

---

## PARTIE B — Assistant LLM Dragon Ball via aphrody

> Objectif produit : `/ask` (Discord) et une page `/ask` (site) qui répondent en **langage
> naturel**, en **voix de persona**, **grondées sur le RAG** (zéro hallucination, citations).
> Plus, à terme, un **modèle fine-tuné** propre. aphrody est le gateway de génération.

### B0 — Matrice de décision (quel « LLM » ?)

| Approche                                 | Entraînement | Infra               | Délai     | Qualité                        | Coût récurrent               |
| ---------------------------------------- | ------------ | ------------------- | --------- | ------------------------------ | ---------------------------- |
| **B1 RAG-grounded (Gemini via aphrody)** | aucun        | aphrody → Google AI | **jours** | très haute (Gemini 2.x)        | appels API                   |
| **B2 NotebookLM**                        | aucun        | aphrody notebooklm  | jours     | haute (grondé sources)         | quota Google                 |
| **B4 Fine-tune LoRA open model**         | GPU loué     | dataset B3 + RunPod | semaines  | haute, **souveraine, offline** | GPU one-shot + inférence CPU |

**Recommandation** : livrer **B1 maintenant** (valeur immédiate, c'est le vrai « LLM Dragon Ball » au sens produit), construire **B3 (dataset)** en parallèle comme actif, garder **B4 (fine-tune)** comme objectif souveraineté/offline activable quand le dataset est mûr.

### B1 — RAG-grounded generation _(SHIP EN PREMIER)_

- Nouveau module `apps/bot/src/lib/llm.ts` : `answer(question, persona)` =
  1. `hybridSearch(db, question, 8)` → passages (déjà SOTA).
  2. Construire un **prompt grondé** : contexte = passages cités + consignes anti-hallucination (« réponds UNIQUEMENT à partir du contexte ; si absent, dis-le ; cite les sources »).
  3. Génération via **`aphrody antigravity chat --model gemini-2.x --prompt <f>`** en sous-process (JSON out), parse `candidates[0].content`. Fallback `aphrody gemini` / `aphrody chat`.
  4. Post-traitement : injecter les liens sources, ton de la **persona** (Whis/Shenron — réutiliser les fiches persona skills).
- Sidecar dédié optionnel `shenron-llm.service` si on veut isoler/cacher (sinon appel direct aphrody depuis le bot, court-circuit réseau local).
- Brancher dans `/ask` (Discord) → réponse rédigée + sources (au lieu de la liste brute actuelle), et nouvelle page site `/ask` (streaming SSE).
- **Garde-fous** : timeout + dégradation vers la liste RAG brute actuelle si la génération échoue (jamais de régression). Cache des réponses (clé = hash question) pour coût + latence.
- Éval : faithfulness (la réponse est-elle dérivable du contexte ?), exactitude canon vs gold, cohérence persona.
- Livrables : `lib/llm.ts`, `/ask` v2, page site `/ask`, `reports/llm-eval-b1.md`.

### B2 — NotebookLM comme cerveau grondé _(alternative / complément éditorial)_

- `aphrody notebooklm create` → notebook « Dragon Ball Canon ».
- `aphrody notebooklm upload` → pousser le corpus A (URLs + `.md`) comme sources.
- `aphrody notebooklm chat` → Q/R grondées ; `generate`/`download` → artefacts (audio overview FR, study guides) réutilisables côté site/Discord.
- Usage : back-office éditorial (vérification canon, génération de synthèses), pas le hot-path runtime.
- Livrable : notebook provisionné + script `scripts/notebooklm-sync.ts` (upload corpus).

### B3 — Dataset d'instruction (distillation) _(l'actif pour B4)_

- Générer un dataset SFT Dragon Ball depuis le corpus A via **`aphrody antigravity chat` (Gemini)** :
  - Pour chaque entité/chunk → générer N paires `{instruction, input, output}` (questions factuelles, comparaisons de puissance, chronologie, « explique X », réécriture en voix de persona).
  - Schéma JSONL `apps/bot/data/llm/dbz-sft.jsonl` : `{instruction, input, output, persona, lang, source_urls[], quality}`.
- Qualité : filtrage (longueur, refus, doublons via embeddings), **grounding** (chaque output traçable à des sources), split train/val/test.
- Volume cible : 20-50 k exemples FR (+ sous-ensemble EN/JA).
- Script `scripts/llm/build-sft-dataset.ts` (batché, repris sur interruption, plafond de coût).
- Livrable : dataset versionné (hors git si volumineux — stockage objet) + `reports/dataset-card.md`.

### B4 — Fine-tune (off-VPS, GPU loué) _(souveraineté / offline)_

- **Base** : modèle ouvert multilingue petit — `google/gemma-2-2b-it` ou `Qwen/Qwen2.5-3B-Instruct` (bon FR+JP, quantifiable, inférence CPU viable).
- **Méthode** : LoRA/QLoRA via **Unsloth** ou **llama-factory** sur GPU loué (RunPod/Vast.ai/Modal, ~A10/A100 quelques heures). Dataset = B3.
- **Sortie** : merge LoRA → quantize **GGUF q4_k_m** (llama.cpp).
- **Eval** : perplexité + benchmark canon (gold set), comparaison vs B1 (Gemini) — n'adopter B4 que si l'écart qualité/coût/souveraineté le justifie.
- Livrable : `dbz-<base>-lora.gguf` + carte modèle.

### B5 — Service d'inférence on-VPS _(si B4 adopté)_

- `shenron-llm.service` : serveur **llama.cpp** (`llama-server`) chargeant le GGUF, loopback, MemoryMax dédié (2-3B q4 ≈ 2-3 Go RAM). On a la RAM (23 Go libres).
- `lib/llm.ts` route vers le LLM local (même contrat que B1) → **assistant 100 % souverain, offline, sans coût API**.
- Garder Gemini (B1) en fallback qualité.
- Livrable : unit systemd + bascule config (`LLM_BACKEND=local|gemini`).

### B6 — Évaluation & sûreté (transverse B)

- **Faithfulness / anti-hallucination** : la réponse doit être dérivable du contexte RAG (éval type RAGAS : answer-relevance, faithfulness, context-precision).
- **Exactitude canon** vs gold set ; **refus** sur hors-canon (« je n'ai pas cette info dans les archives »).
- **Cohérence persona** (Whis ≠ Beerus ≠ Shenron).
- Tests automatisés `apps/bot/tests/llm-*.test.ts`, gate avant deploy.

---

## Séquencement & jalons

| Jalon  | Contenu                                 | Dépend de       | Sortie mesurable                          |
| ------ | --------------------------------------- | --------------- | ----------------------------------------- |
| **M1** | A0 (éval) + B1 (RAG-grounded `/ask` v2) | RAG SOTA (fait) | gold set + `/ask` répond en FR grondé     |
| **M2** | A1→A6 (corpus canon complet via bxc)    | M1              | Recall@5 ≥ 0.9, corpus ≥ 10× chunks       |
| **M3** | A7 (refresh continu) + B2 (NotebookLM)  | M2              | timer hebdo + notebook canon              |
| **M4** | B3 (dataset distillation)               | M2 (corpus)     | `dbz-sft.jsonl` 20-50k, dataset-card      |
| **M5** | B4 + B5 (fine-tune + service local)     | M4              | GGUF déployé, assistant offline souverain |

**Chemin critique court (valeur immédiate)** : M1 → M2. Le fine-tune (M5) est optionnel/souveraineté.

## KPIs

- **RAG** : Recall@5, MRR, nDCG@10 (gold set) ; couverture corpus (entités canon couvertes %) ; fraîcheur (âge médian des chunks).
- **LLM** : faithfulness, exactitude canon, taux de refus correct (hors-canon), latence p50/p95, coût/req (B1) vs 0 (B5).
- **Produit** : usage `/ask`, satisfaction, part de réponses avec sources cliquées.

## Risques & mitigations

| Risque                     | Mitigation                                                                      |
| -------------------------- | ------------------------------------------------------------------------------- |
| IP VPS filtrée par sources | proxy résidentiel `--proxy`, profils stealth/max, `bxc har` debug               |
| Coût Gemini (distillation) | batch + cache + plafond ; NotebookLM en alternative quota                       |
| Hallucination LLM          | grounding strict + faithfulness gate + refus hors-contexte + fallback liste RAG |
| Pas de GPU                 | GPU loué one-shot (B4) ; sinon B1/B5 suffisent                                  |
| Régression corpus          | gate éval (A0) en CI, build idempotent reconstruisible                          |
| Droits/attribution         | attribution par chunk préservée, paraphrase (pas de verbatim long), robots/ToS  |

## Carte fichiers & commandes (récap)

```
apps/bot/
  scripts/
    rag-recon.ts            # existant — bxc recon → corpus (A2, à étendre en rag-harvest.ts)
    ingest/bxc-ingest.ts    # existant — ingest bxc
    rag-build.ts            # existant — chunk + embed (A4/A5)
    rag-eval.ts             # NOUVEAU — Recall@k/MRR/nDCG (A0/A6)
    llm/build-sft-dataset.ts# NOUVEAU — distillation Gemini → JSONL (B3)
    notebooklm-sync.ts      # NOUVEAU — upload corpus → NotebookLM (B2)
  src/lib/
    rag.ts                  # existant — pipeline hybride+rerank (runtime)
    embeddings.ts           # existant — modèles (sidecar only)
    llm.ts                  # NOUVEAU — answer(question, persona) grondé (B1/B5)
  tests/
    rag-gold.jsonl          # NOUVEAU — gold set (A0)
    llm-*.test.ts           # NOUVEAU — faithfulness/persona (B6)
  data/
    rag/{raw,clean}/        # corpus brut/propre (A2/A3)
    llm/dbz-sft.jsonl       # dataset SFT (B3)
deploy/systemd/
    shenron-rag-refresh.*   # NOUVEAU — refresh hebdo (A7)
    shenron-llm.service     # NOUVEAU — llama.cpp local (B5, si B4)
```

```bash
# A — corpus
bun apps/bot/scripts/rag-eval.ts                    # baseline / mesure (A0/A6)
BXC_DIR=/home/ubuntu/bxc bun apps/bot/scripts/rag-recon.ts   # récolte (A2)
bun --filter @shenron/bot run rag:build             # chunk + embed (A4/A5)
sudo systemctl restart shenron                      # recharge l'index

# B — LLM
aphrody antigravity chat --model gemini-2.0-flash --prompt "<grounded prompt>" | jq '.candidates[0].content'  # B1/B3
aphrody notebooklm create / upload / chat           # B2
# fine-tune off-VPS (RunPod) → GGUF → shenron-llm.service (B4/B5)
```

---

_Plan vivant — cocher/mettre à jour au fil des jalons. Source de vérité runtime : `apps/bot/src/lib/rag.ts`. Contexte : `CLAUDE.md` (sections RAG hybride, sidecar, GraphQL/OpenAPI)._
