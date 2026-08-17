# Serveur MCP + GraphQL

Deux façons d'interroger la base au-delà du REST : le **serveur MCP** (pour les
clients compatibles) et **GraphQL** (pour les requêtes relationnelles).

## Serveur MCP — `https://mcp.dragonballfr.com/mcp`

Serveur **MCP public, Streamable HTTP, sans auth, lecture seule** exposant 14
outils qui proxifient le RAG + l'API publique. Idéal pour brancher la base
Dragon Ball directement dans un assistant.

**Outils** : `rag_search`, `rag_ask`, `sources`, `wiki_search`, `wiki_list`,
`wiki_get`, `manga_search`, `manga_tomes`, `manga_page`, `bot_stats`,
`bot_personas`, `bot_leaderboard`, `bot_commands`, `news`.

**Connexion :**

- **Claude (web/desktop)** : Réglages → Connecteurs → _Ajouter un connecteur
  personnalisé_ → URL `https://mcp.dragonballfr.com/mcp`, authentification « Aucune ».
- **Claude Code** : `claude mcp add --transport http shenron https://mcp.dragonballfr.com/mcp`
- **Gemini / Grok / autres** : serveur MCP distant _Streamable HTTP_, même URL, sans en-tête d'auth.
- **Ollama** (via un bridge MCP, ex. `mcphost` / Open WebUI) : serveur HTTP, même URL.

Test rapide du handshake (JSON-RPC) :

```bash
curl -s -X POST https://mcp.dragonballfr.com/mcp \
  -H 'content-type: application/json' -H 'accept: application/json,text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | jq '.result.tools[].name'
```

Sonde : `GET https://mcp.dragonballfr.com/health`. Page de doc : la racine `/`.

## GraphQL — `https://bot.dragonballfr.com/graphql`

Endpoint **GraphQL read-only** (Pothos + graphql-yoga, GraphiQL activé, CORS
public, profondeur max 10). Utile pour suivre les **relations** en une requête
(un personnage → sa planète → les autres natifs ; une technique → son créateur)
là où le REST demanderait plusieurs appels.

Explore le schéma vivant dans **GraphiQL** (ouvre l'URL dans un navigateur) ou par
introspection :

```bash
curl -s -X POST https://bot.dragonballfr.com/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"{ __schema { queryType { fields { name } } } }"}' | jq
```

Champs de requête de premier niveau : `character(s)`, `planet(s)`, `race(s)`,
`technique(s)`, `transformations`, `saga(s)`, `episode(s)`, `movie(s)`, `game(s)`,
`mangaTomes`, `mangaPage(s)`, `mangaSearch`, **`ragSearch`** et **`counts`**.

- `ragSearch(q, limit)` → `{ mode, results { kind title url snippet } }`
- `counts` → `{ characters planets races techniques transformations sagas episodes movies games }`

```graphql
{
	ragSearch(q: "saga Cell", limit: 5) {
		mode
		results {
			kind
			title
			url
			snippet
		}
	}
	counts {
		characters
		planets
		sagas
		techniques
	}
}
```

```bash
curl -s -X POST https://bot.dragonballfr.com/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"{ ragSearch(q:\"saga Cell\", limit:3){ mode results { title url } } counts { characters sagas } }"}' | jq
```

> Si un nom de champ est refusé, introspecte d'abord (les noms exacts font foi),
> ou retombe sur le REST (`references/api.md`).
