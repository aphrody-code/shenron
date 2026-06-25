# API REST publique dragonballfr.com — catalogue complet

Base : `https://bot.dragonballfr.com` · préfixe : `/api/public` · **lecture seule,
sans authentification**, CORS ouvert. Réponses JSON (sauf images PNG). Spec
machine : `GET /api/openapi.json` ; UI : `https://bot.dragonballfr.com/api/docs`.

## Sommaire
- [RAG (recherche / réponse)](#rag)
- [Wiki — listes et fiches](#wiki)
- [Manga](#manga)
- [Bot & communauté](#bot--communauté)
- [Divers (news, sources, profils, eval)](#divers)
- [Champs des entités](#champs-des-entités)

---

## RAG

| Méthode & chemin | Paramètres | Renvoie |
|---|---|---|
| `GET /api/public/rag/search` | `q` (requis, ≥2 car.), `limit` (1–25, déf. 8) | `{ q, mode, results: RagHit[] }` |
| `GET\|POST /api/public/rag/chat` | `q`, `persona` (déf. `whis`), `lang`, `entity`, `sourceId` — en query-string **ou** body JSON | `{ answer, hits: RagHit[], mode }` |

`mode` ∈ `hybrid+rerank | hybrid | lexical` (dégradation gracieuse si le sidecar
sémantique est indisponible). `RagHit` = `{ kind, title, url, snippet }`.

```bash
curl -s "https://bot.dragonballfr.com/api/public/rag/search?q=comment+Goku+devient+super+saiyan&limit=5" | jq
curl -s -X POST "https://bot.dragonballfr.com/api/public/rag/chat" \
  -H 'content-type: application/json' -d '{"q":"qui est Vegeta ?"}' | jq '.hits'
```

> `rag/chat` renvoie aussi une prose rédigée, mais le rédacteur LLM est
> actuellement hors-ligne (réponse de repli) — **utilise `hits`**, pas `answer`.

## Wiki

Recherche plein-texte transverse : `GET /api/public/wiki/search?q=...&limit=` (1–50, déf. 20).

Chaque catégorie expose une **liste** (`?limit=` 1–200 déf. 50, `&offset=`) et une
**fiche** (par `id` numérique ou `slug`) :

| Catégorie | Liste | Fiche |
|---|---|---|
| Personnages | `GET .../wiki/characters` | `.../wiki/characters/{id}` |
| Planètes | `GET .../wiki/planets` | `.../wiki/planets/{id}` |
| Races | `GET .../wiki/races` | `.../wiki/races/{slug}` |
| Techniques | `GET .../wiki/techniques` | `.../wiki/techniques/{slug}` |
| Transformations | `GET .../wiki/transformations` | — |
| Sagas | `GET .../wiki/sagas` | `.../wiki/sagas/{slug}` |
| Arcs | — | `.../wiki/arcs/{slug}` |
| Épisodes | `GET .../wiki/episodes` | `.../wiki/episodes/{id}` |
| Films | `GET .../wiki/movies` | `.../wiki/movies/{slug}` |
| Jeux | `GET .../wiki/games` | `.../wiki/games/{slug}` |
| Outils/objets | `GET .../wiki/tools` | `.../wiki/tools/{slug}` |
| Tomes manga | `GET .../wiki/manga/volumes` | `.../wiki/manga/volumes/{id}` |
| Actus | `GET .../wiki/news` | — |

```bash
curl -s "https://bot.dragonballfr.com/api/public/wiki/sagas" | jq '.sagas[] | {name, series, order_idx, slug}'
curl -s "https://bot.dragonballfr.com/api/public/wiki/characters/1" | jq
curl -s "https://bot.dragonballfr.com/api/public/wiki/search?q=kamehameha&limit=5" | jq
```

## Manga

| Chemin | Paramètres | Renvoie |
|---|---|---|
| `GET /api/public/manga/tomes` | — | liste des tomes |
| `GET /api/public/manga/tomes/{series}/{tome}` | path | détail d'un tome + planches |
| `GET /api/public/manga/page/{series}/{tome}/{planche}` | path | métadonnées + URL image d'une planche |
| `GET /api/public/manga/search` | `q`, `limit` | recherche texte (OCR) dans les planches |

```bash
curl -s "https://bot.dragonballfr.com/api/public/manga/search?q=kamehameha&limit=5" | jq
```

## Bot & communauté

| Chemin | Paramètres | Renvoie |
|---|---|---|
| `GET /api/public/stats` | — | stats serveur Discord (membres, niveaux…) |
| `GET /api/public/presence` | — | présence/état temps réel |
| `GET /api/public/personas` | — | les 6 personas (Shenron, Beerus, Whis, Grand Prêtre, Enma, Kaïo) |
| `GET /api/public/commands` | — | commandes Discord publiques |
| `GET /api/public/leaderboard` | `limit` | classement par niveau/XP |
| `GET /api/public/user/{discordId}` | path | profil public d'un membre |
| `GET /api/public/shop` | — | boutique |
| `GET /api/public/profile/{discordId}/card.png` | path | **image PNG** carte de profil |
| `GET /api/public/profile/{discordId}/scan.png` | path | **image PNG** scouter |

## Divers

| Chemin | Renvoie |
|---|---|
| `GET /api/public/news` | actualités Dragon Ball (`?limit=`) |
| `GET /api/public/sources` | sources/corpus indexés par le RAG |
| `GET /api/public/assets` | assets exposés |
| `GET /api/public/eval/{cache-stats,reports,lore-stats}` | diagnostics (qualité RAG/LLM, stats lore) |
| `GET /graphql` | endpoint GraphQL (GraphiQL activé) — cf. `mcp-graphql.md` |
| `GET /api/openapi.json` · `GET /api/docs` | spec OpenAPI 3.1 + UI Scalar |
| `GET /health` | sonde |

## Champs des entités

- **Character** : `id, name, name_ja, name_romaji, race, gender, affiliation, ki,
  max_ki, origin_planet_id, description, image`. `ki`/`max_ki` sont indicatifs et
  dépendent du support (databook/anime) — à citer avec contexte.
- **Saga** : `id, name, name_ja, slug, series, order_idx, description, image`.
  Trie par `order_idx` pour l'ordre chronologique au sein d'une `series`.
- **Technique** : `id, name, name_ja, slug, type, creator_id, description`.
  `creator_id` → `characters/{id}` (le créateur).
- **Planet** : `id, name, slug, description, image` (+ habitants via `origin_planet_id`).
- **Race / Transformation** : `id, name, name_ja, slug, description, image`.
- **Episode / Movie / Game** : `id, title|name, slug, series/saga, description, …`.
- **RagHit** : `kind` (character|planet|race|technique|transformation|saga|movie|
  game|episode|source), `title`, `url` (relative au site → préfixer `https://dragonballfr.com`), `snippet`.

> Les `url` renvoyées par le RAG/wiki sont relatives (`/wiki/...`) : préfixe-les
> par `https://dragonballfr.com` pour un lien cliquable.
