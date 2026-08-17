# @shenron/mcp — Serveur MCP public Dragon Ball

Serveur **MCP** (Model Context Protocol) **public, sans authentification, en lecture seule**
qui expose le **RAG** et l'**API publique** Dragon Ball de [dragonballfr.com](https://dragonballfr.com)
en tant qu'outils, pour tout client compatible MCP.

- **Endpoint** : `https://mcp.dragonballfr.com/mcp` (transport **Streamable HTTP**, sans état)
- **Sonde** : `https://mcp.dragonballfr.com/health`
- **Doc** : `https://mcp.dragonballfr.com/`

## Architecture

```
client MCP  ──HTTP──▶  mcp.dragonballfr.com  (nginx, TLS)
                              │
                              ▼
                       shenron-mcp  (Bun.serve :5010)
                              │  proxy lecture seule
                              ▼
                       bot :5006/api/public/*  +  RAG hybride
```

Le serveur **ne touche jamais la base** : chaque outil proxifie l'API REST déjà publique
servie par le bot (`bot.dragonballfr.com/api/public/*`). Aucun secret, aucune écriture.

Stack : `Bun.serve` + `@modelcontextprotocol/sdk` (`WebStandardStreamableHTTPServerTransport`,
natif Bun — pas de `node:http`). Un serveur + un transport neufs **par requête** (`sessionIdGenerator: undefined`).

## Outils (14, tous `readOnlyHint`)

| Outil                                                             | Rôle                                                                                                                                                                                           |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rag_search`                                                      | Recherche hybride (BM25 + dense + rerank) → passages sourcés **dédupliqués**, avec `score` ∈ [0,1] (comparable au sein d'une même réponse) ; filtres optionnels `lang` / `entity` / `sourceId` |
| `rag_ask`                                                         | Renvoie surtout des `hits` sourcés (le rédacteur LLM est **OFF**) → s'appuyer sur les passages pour citer                                                                                      |
| `sources`                                                         | Sources/corpus indexés par le RAG                                                                                                                                                              |
| `wiki_search`                                                     | Recherche plein-texte du wiki                                                                                                                                                                  |
| `wiki_list`                                                       | Liste paginée d'entités (`characters`, `planets`, `races`, `techniques`, `transformations`, `sagas`, `episodes`, `movies`, `games`)                                                            |
| `wiki_get`                                                        | Détail d'une entité par id/slug                                                                                                                                                                |
| `manga_search` / `manga_tomes` / `manga_page`                     | Manga (recherche OCR, tomes, planches)                                                                                                                                                         |
| `bot_stats` / `bot_personas` / `bot_leaderboard` / `bot_commands` | Bot Discord (stats, 6 personas, classement, commandes)                                                                                                                                         |
| `news`                                                            | Actualités Dragon Ball                                                                                                                                                                         |

## Connexion

- **Plugin Claude Code (recommandé)** : `/plugin marketplace add aphrody-code/shenron` puis
  `/plugin install dragon-ball@shenron`. Le plugin `dragon-ball` (`plugins/dragon-ball/`) embarque la
  skill auto-découverte + ce serveur MCP distant déclaré inline (`mcpServers.dragonball`, transport
  `streamable-http` → `https://mcp.dragonballfr.com/mcp`) — aucune config manuelle.
  NB : la marketplace vit dans ce monorepo (`.claude-plugin/marketplace.json`) ⇒ l'`add` clone tout le dépôt.
- **Claude (web / desktop)** : Réglages → Connecteurs → _Ajouter un connecteur personnalisé_ →
  URL `https://mcp.dragonballfr.com/mcp`, authentification **Aucune**.
- **Claude Code (sans plugin)** : `claude mcp add --transport http shenron https://mcp.dragonballfr.com/mcp`
- **Gemini / Grok / autres** : ajouter un serveur MCP distant **Streamable HTTP** → `https://mcp.dragonballfr.com/mcp` (sans en-tête d'auth).
- **Ollama** (via bridge MCP type `mcphost` / Open WebUI) : déclarer un serveur HTTP `https://mcp.dragonballfr.com/mcp`.

## Développement

```bash
bun mcp:dev     # watch sur :5010 (SHENRON_API_URL=http://127.0.0.1:5006 par défaut)
bun mcp:start   # run
bun --filter @shenron/mcp type-check
bun --filter @shenron/mcp lint
```

Variables : `MCP_PORT` (5010), `MCP_HOST` (127.0.0.1), `MCP_PUBLIC_URL`,
`SHENRON_API_URL` (API bot proxifiée), `SHENRON_SITE_URL` (absolutisation des URLs `/wiki/...`).

## Déploiement (VPS)

Service systemd `shenron-mcp` + vhost `deploy/nginx/mcp.dragonballfr.com.conf`, propagés par
`bash deploy/install.sh --nginx`. TLS via `certbot --dns-ovh -d mcp.dragonballfr.com`.
