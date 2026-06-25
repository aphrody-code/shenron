# Dragon Ball — plugin Claude Code

Plugin Claude Code qui réunit, en une seule installation, l'accès à la base de
connaissance **Dragon Ball vivante et sourcée** de [dragonballfr.com](https://dragonballfr.com) :

1. **Skill `dragon-ball`** — guide d'utilisation + références embarquées (catalogue
   de l'API REST publique, lore canon condensé hors-ligne, connexion MCP/GraphQL)
   et un helper terminal `scripts/db.sh` (`ask` / `char` / `list` / `get` / `stats`…).
   Claude consulte ce skill pour toute question factuelle Dragon Ball et **cite les
   sources** au lieu de répondre de mémoire (le lore est dense et souvent mal restitué
   par les modèles).

2. **Serveur MCP public** `https://mcp.dragonballfr.com/mcp` — Streamable HTTP,
   **stateless, lecture seule, sans authentification**. 14 outils qui proxifient le
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
├── .claude-plugin/plugin.json     # manifeste + serveur MCP (streamable-http)
└── skills/dragon-ball/
    ├── SKILL.md                   # guide + déclencheurs
    ├── references/{api,lore,mcp-graphql}.md
    └── scripts/db.sh              # helper terminal (curl + jq)
```

Lecture seule, contenu francophone, sources citées. Licence Apache-2.0.
