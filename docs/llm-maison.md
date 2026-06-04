# LLM Dragon Ball maison (from-scratch)

Shenron a son **propre** LLM, entraîné de zéro, hébergé et servi par nous — pas un wrapper d'API tierce.
Au runtime, **aucun modèle tiers** : le bot et le site répondent via ce modèle (+ ancrage RAG).

## Pourquoi

L'ancien chemin de génération passait par un gateway distant (`aphrody antigravity chat`) qui
s'écroulait sous charge (sur 20 questions : ~8 réponses puis 12 vides, sans timeout ni retry). Objectif :
un LLM **fiable, possédé, qui ne renvoie jamais vide**.

## Architecture

- **Modèle** — `apps/bot/data/llm/dbz_llm.py` : décodeur Transformer **29,3 M params** (RMSNorm,
  attention causale, MLP SwiGLU, weight-tying), **tokenizer BPE byte-level** (~8k). Entraîné sur **CPU**
  (12 cœurs) en 2 phases : pré-entraînement langue sur ~606k tokens de corpus DBZ, puis **SFT** sur ~850
  paires d'instruction *ancrées* avec **masquage du prompt** (la loss ne porte que sur la réponse).
- **Données** — `apps/bot/data/llm/corpus_export.ts` lit une copie read-only de `bot.db`
  (`rag_chunks` + tables wiki) et produit `corpus.txt` (pré-entraînement) + `sft.jsonl`
  (`{context, persona, instruction, output}`). Filtre le japonais et l'espagnol (bruit pour un petit
  modèle FR), contextes courts (≤300c). Les 6 personas sont équilibrés.
- **Serveur** — `dbz_llm.py serve` sur **:5009** (stdlib http, modèle chaud) via
  `shenron-llm.service`. Endpoints : `GET /health`, `POST /generate {context, persona, query}`.
- **Wiring bot** — `apps/bot/src/lib/llm.ts` `generateLlmAnswer`, chaîne **résiliente, jamais vide** :
  1. cache sémantique Redis,
  2. **notre modèle** (`:5009`) avec **garde d'ancrage** (rejette si la réponse ne recouvre pas assez
     le contexte ou fuit en espagnol → anti-hallucination),
  3. fallback distant **optionnel** (`LLM_ALLOW_REMOTE_FALLBACK=1`, OFF par défaut),
  4. **repli extractif ancré** : phrases du contexte RAG les plus pertinentes à la question, habillées
     dans la voix du persona — toujours non vide, toujours factuellement correct.

## Limite honnête

Un modèle de 29 M entraîné sur CPU sur ~606k tokens **apprend parfaitement la voix des personas mais ne
sait pas ancrer les faits de façon fiable** (il hallucine entre les marqueurs de persona). C'est pourquoi
la **justesse factuelle vient du RAG** (garde d'ancrage + repli extractif), pas de la mémoire du modèle.
Le modèle porte le style ; le RAG porte les faits.

## Évaluation (honnête, reproductible)

`apps/bot/scripts/llm/eval-own.ts` — pas de juge LLM (l'ancien juge flaky tombait à 12/20). Métriques
objectives sur le gold-set : **% réponses non vides** (≈100%), **% grounding mots-clés** (~75%), latence
(~1,2 s). Pousse `dbz:eval:report:own` (+ `llm:latest`) dans Redis → dashboard admin `/admin/evaluations`.
L'auto-éval récurrente (`AutoEvalService`, boot + 24 h) utilise cette éval honnête et alerte sur Discord
si fiabilité/grounding/recall régressent.

## Reproduire / ré-entraîner

```bash
cd apps/bot
# export des données depuis une copie de la DB
cp data/bot.db /tmp/dbz-train.db
DBZ_DB=/tmp/dbz-train.db bun data/llm/corpus_export.ts
# entraînement complet (tokenizer + pretrain + sft), ~1 h CPU
DBZ_THREADS=8 data/llm/.venv/bin/python data/llm/dbz_llm.py train
# recharger le modèle servi
sudo systemctl restart shenron-llm
# éval honnête (serveur :5009 requis)
REDIS_URL=redis://127.0.0.1:6379/0 RAG_DB=/tmp/dbz-train.db bun scripts/llm/eval-own.ts --persona whis
```

Pipeline tout-en-un : `bash scripts/train-llm-pipeline.sh --train`.

## Gotchas

- **Poids/corpus/tokenizer gitignorés** — générés sur la machine (comme l'index RAG), jamais commités.
- **Redis db0** — le bot (systemd, sans `REDIS_URL`) écrit **db0**. Un shell avec `REDIS_URL=…/1`
  vise db1 : lancer les scripts d'ops/éval avec `REDIS_URL=redis://127.0.0.1:6379/0`.
- **Hot-swap** — le serveur charge le modèle au démarrage ; ré-entraîner écrase le `.pt` sans gêner le
  process en cours → `systemctl restart shenron-llm` pour appliquer.
- **venv** — `apps/bot/data/llm/.venv` (torch CPU + tokenizers), gitignoré.
