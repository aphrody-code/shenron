# Dragon Ball — plugin Claude Code

Plugin Claude Code et Codex qui réunit, en une seule installation, l'accès à la base de
connaissance **Dragon Ball vivante et sourcée** de [dragonballfr.com](https://dragonballfr.com) :

1. **Skill `dragon-ball`** — guide d'utilisation + références embarquées (catalogue
   de l'API REST publique, lore canon condensé hors-ligne, connexion MCP/GraphQL)
   et un helper terminal `scripts/db.sh` (`ask` / `char` / `list` / `get` / `stats`…).
   Claude consulte ce skill pour toute question factuelle Dragon Ball et **cite les
   sources** au lieu de répondre de mémoire (le lore est dense et souvent mal restitué
   par les modèles).

2. **Skill `dragon-ball-japonais`** — vocabulaire, lexique et traduction du
   japonais Dragon Ball, adossés au corpus réel : plus de 6 000 planches de
   databooks japonais transcrites, et le lexique du wiki qui associe chaque
   graphie japonaise à sa forme française officielle. Elle répond au problème
   propre à ce domaine : `かめはめ波`, `界王拳`, `ベジータ` ne sont dans **aucun
   dictionnaire**, si bien qu'un modèle généraliste rend `孫悟空は界王拳を使った`
   par « Son-gu a utilisé le poing du roi ». Références embarquées : graphies
   vérifiées avec leur fréquence dans le corpus, jeux de mots de Toriyama,
   pièges de translittération, chaîne de traitement du dépôt.

3. **OCR visuel et trois subagents** (`agents/`), chacun ancré sur les sources plutôt que sur
   sa mémoire :
   - **Skill `databooks-ocr` + `dbfr-ocr`** — permettent à un parent de confier
     de petits lots à des sous-agents Claude ou Codex avec le scan dans leur
     contexte visuel. Ils produisent un JSONL compatible ; Shenron seul le
     valide et le dépose. Sans scan ouvert, l'agent signale l'entrée au lieu de
     l'inventer.
   - **`dbfr-traducteur`** — traduit le japonais Dragon Ball en protégeant le
     vocabulaire de la série par le lexique officiel, ce qui évite les deux
     dérives mesurées : noms propres translittérés au son (« Végitta ») et
     techniques traduites littéralement (`界王拳` → « le poing du roi »).
   - **`dbfr-wiki`** — rédige les fiches en s'appuyant sur le manga et les
     databooks, cite ses sources, distingue canon manga / anime / jeux, et
     laisse un champ vide plutôt que de l'inventer.

4. **Serveur MCP public** `https://mcp.dragonballfr.com/mcp` — Streamable HTTP,
   **stateless, lecture seule, sans authentification**. Des outils qui proxifient le
   **RAG hybride** (BM25 + embeddings + reranking, passages dédupliqués et scorés) et
   l'API publique : `rag_search`, `rag_ask`, `sources`, `wiki_search`, `wiki_list`,
   `wiki_get`, `manga_search`, `manga_tomes`, `manga_page`, `bot_stats`,
   `bot_personas`, `bot_leaderboard`, `bot_commands`, `news`. Aucun accès DB ni secret.

Le skill fonctionne seul (API REST + `db.sh`) ; le serveur MCP ajoute l'accès natif
pour les clients MCP. Les deux pointent la même base — manga auto-hébergé, Fandom et
databooks Toriyama.

## Installation

```bash
# 1. Ajouter le marketplace (depuis le dépôt GitHub)
/plugin marketplace add aphrody-code/shenron

# 2. Installer le plugin
/plugin install dragon-ball@shenron
```

Le serveur MCP démarre automatiquement à l'activation du plugin ; le skill
s'auto-déclenche sur les questions Dragon Ball.

## Vérifier / contribuer

```bash
# Valider les manifestes (plugin + marketplace) avant publication
claude plugin validate ./plugins/dragon-ball
claude plugin validate .
```

## Contenu

```
plugins/dragon-ball/
├── .claude-plugin/plugin.json     # manifeste Claude + serveur MCP
├── .codex-plugin/plugin.json      # manifeste Codex + skills auto-découvertes
├── agents/dbfr-ocr.md             # sous-agent Claude OCR visuel
└── skills/dragon-ball/
    ├── SKILL.md                   # guide + déclencheurs
    ├── references/{api,lore,mcp-graphql}.md
    └── scripts/db.sh              # helper terminal (curl + jq)
└── skills/databooks-ocr/SKILL.md  # contrat des sous-agents OCR visuels
```

Lecture seule, contenu francophone, sources citées. Licence Apache-2.0.
