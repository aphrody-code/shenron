# Mémoire partagée Claude ↔ Gemini

Espace d'état persistant partagé par les 2 agents. À utiliser pour :
- Décisions architecturales communes
- État courant du sprint qui dépasse `.coord/tasks.json`
- Conventions API établies entre Claude (bot) et Gemini (site Vercel)
- Pointeurs vers ressources externes

Append-friendly : préfère ajouter une section datée plutôt que ré-écrire.

---

## API publique bot Shenron — contrat (2026-05-15)

Base URL : `https://shenron.rpbey.fr`

Routes consommables par le site `dbfr.fr` (CORS + ETag + Cache-Control public) :

| Route | TTL cache | Description |
|---|---|---|
| `GET /api/public/user/:discordId` | 30 s | Profil enrichi : level, xp, zeni, equipped, achievements, inventory (avec name shop) |
| `GET /api/public/shop` | 5 min | Items shop enabled |
| `GET /api/public/leaderboard?limit=N&enrich=1` | 1 min | Top users (enrich = username + avatar Discord) |
| `GET /api/public/stats` | 1 min | Compteurs globaux (users, totalXp, totalZeni, achievements) |
| `GET /api/public/wiki/characters?q=` | 1 h | Personnages DBZ (search optionnelle) |
| `GET /api/public/wiki/characters/:id` | 1 h | Détail personnage + transformations |
| `GET /api/public/wiki/planets` / `planets/:id` | 1 h | Planètes DBZ |
| `GET /api/public/profile/:discordId/card.png` | 1 h | Card profil dynamique (WebP auto si supporté) |
| `GET /api/public/profile/:discordId/scan.png` | 1 h | Scanner de ki dynamique |
| `GET /health/check` | 5 s | Statut bot (online, uptime, version) |
| `GET /health/latency` | 5 s | Latence WebSocket Discord + DB |

Toutes les routes : `Cache-Control: public, max-age=N, s-maxage=2N, stale-while-revalidate=4N` + `ETag` → Vercel CDN cache automatique.

Convention nom inventory : `{ type, key, name, description }` (name vient de shop_items.name).

## Sanction GIFs — servis localement (2026-05-15)

Avant : URLs Tenor + Discord CDN attachment → toutes purgées (404).
Maintenant : `https://shenron.rpbey.fr/assets/sanctions/<action>.gif`.

Présents : `jail.gif`, `purge.gif`. Override via SettingsService `gif.<action>`.

---

## Communication inter-agents (2026-05-15)

Setup en cours :
- **MCP server** : `mcp/coord-server.ts` exposé aux 2 CLIs
- **A2A** : `POST /api/a2a/jsonrpc` (sur API 5006)
- **Unix socket** : `/run/dbfr-a2a.sock` (low-latency local)
- **Memory** : `.coord/memory/{shared,claude,gemini}.md`
- **Messages** : `.coord/messages.jsonl` (append-only, JSONL)
- **Docs** : `.coord/docs/` (Markdown)
