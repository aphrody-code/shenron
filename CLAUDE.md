# CLAUDE.md — shenron

Monorepo Bun : bot Discord Dragon Ball (6 personas, 1 process) + site Next.js `dragonballfr.com`.
Tout tourne sur **un seul VPS** (`51.255.162.6`, Ubuntu 26.04) : bot, site, Postgres, RAG, MCP.

## Doctrine de travail

1. **Agir.** La tâche est claire ⇒ l'exécuter jusqu'au bout : correction, lint, type-check, commit, push, déploiement. Ne pas demander l'autorisation de faire ce qui est demandé, ne pas garer du travail en attendant une réponse.
2. **La base est incomplète par défaut — la compléter est le travail ordinaire.** Épisodes, tomes, chapitres, fiches, ISBN, images, noms japonais : s'il manque quelque chose et qu'une source honnête existe, le combler sans le demander. C'est le motif de la moitié des commits du dépôt.
3. **Mesurer avant de coder, et re-mesurer après.** Un compte SQL ou un `curl` tranche ce qu'une intuition ne tranche pas. Chaque commit annonce un chiffre vérifiable (« 63 noms nettoyés », « 51 à 87 ISBN »).
4. **Jamais inventer une donnée.** Un champ vide vaut mieux qu'un champ plausible. Sources autorisées : le manga et les databooks hébergés en propre, les catalogues d'éditeur, les API publiques (AniList, Jikan). **Fandom est banni** en rédaction.
5. **Réversible.** Toute écriture éditoriale passe par une révision `public.wiki_revisions` ; les suppressions se font par `visible = false`, jamais par `DELETE`.
6. **Rester dans le périmètre.** Proactif sur l'exécution, pas sur l'élargissement du sujet.
7. **Concis.** Réponses courtes, pas de récapitulatif, pas de narration d'étapes. Le code et les mesures parlent.

## Sources de vérité

| Quoi | Où |
|---|---|
| Code | `~/shenron/` sur le VPS — les services systemd lisent ce path. Jamais d'édition hors dépôt ; PR sur `github.com/aphrody-code/shenron` |
| Bot prod | `shenron.service` (`apps/bot`, port 5006, `bot.dragonballfr.com`) |
| Site prod | `shenron-site{,-b}.service` (Next 16 sous Bun, slots bleu/vert 3000/3010) derrière nginx, `dragonballfr.com` |
| DB site + **wiki** | **PostgreSQL 18 local** `shenron_site` (`127.0.0.1:5432`), schémas `public` (site/auth) + `bot` (wiki) |
| DB bot runtime | SQLite `apps/bot/data/bot.db` — **replica de lecture** du wiki, source des commandes Discord |
| Infra | `deploy/` (units systemd, vhosts nginx, `install.sh`) — vendoré, plus de `~/vps/` |

`DATABASE_URL` : `apps/site/.env` (ancrer `^DATABASE_URL=` et prendre la **dernière** ligne).

## Règles dures

1. **Bun uniquement.** Pas de `node`/`npm`/`pnpm`/`yarn`/`tsx`. Build du site : `bun <racine>/node_modules/next/dist/bin/next build`, **sans `--bun`** (le drapeau se propage via `NODE_OPTIONS` et casse les workers PostCSS).
2. **Secrets hors dépôt.** `.env` gitignored, écrits au `printf` (jamais `echo`). Édition de `.env` bloquée par un hook.
3. **Versions en `catalog:`** (racine `package.json`), doctrine nightly : `next@canary`, `react@canary`, `typescript@next`.
4. **Zéro FFI/Rust** dans le bot — tout en TS pur (`apps/bot/src/lib/native.ts`).
5. **Pas de chemin absolu** dans `deploy/systemd/` ni les scripts d'ops : résolution dynamique à l'installation.
6. **`*.md` à la racine** : seuls `README`, `CLAUDE`, `GEMINI`, `DEPLOY`, `DESIGN`, `CHANGELOG`, `SECURITY`, `PROMPT` et `docs/**`. Jamais de note ou de rapport d'agent.
7. **Commits** : une ligne française, `feat|fix|chore|refactor|docs|ops(scope):`, sans emoji.
8. **Après tout ajout de commande/event/guard** : `bun run gen:entries` (un hook le fait sur `apps/bot/src/{commands,events,guards}/`).
9. **La palette du site vit en base, pas dans le CSS** : la ligne `default` de `public."SiteTheme"` surcharge les `--dbz-*` à chaque rendu. La lire avant toute conclusion sur une couleur, l'écrire par `jsonb_set` ciblé.
10. **Le wiki s'écrit en Postgres, pas en SQLite** (`src/db/wiki-write-guard.ts` bloque) — le reverse-sync écraserait l'écriture.
11. **`rag:build` jamais au premier plan ni en live** (~2 h, DDL `DROP` qui gèle les handlers HTTP).

## Architecture

```
apps/bot/   @shenron/bot   Bun + discordx + drizzle + bun:sqlite + canvas ; 6 personas ; API REST + GraphQL + OpenAPI ; dashboard admin React
apps/site/  @shenron/site  Next 16 + Tailwind v4 + Drizzle/postgres-js ; lit le wiki en direct, proxifie le reste vers l'API bot
apps/mcp/   @shenron/mcp   serveur MCP public (mcp.dragonballfr.com), 14 outils lecture seule
packages/   di · discordy (fork discordx) · importer · internal · pagination
```

Personas (`apps/bot/src/lib/personas.ts`) : Shenron, Beerus, Whis, Grand Prêtre, Enma, Kaïo — 6 tokens requis au boot.

## Commandes

```bash
bun bot:dev / bun site:dev          # dev (site:dev prend le port d'un slot bleu/vert — vérifier l'amont nginx)
bun run lint && bun run type-check  # avant tout commit
bun run test:all                    # runner multi-scopes ; test:live pour le tier réseau

bash scripts/deploy-shenron.sh --pull   # bot : pull + checks + restart + smoke + rollback
bash scripts/deploy-site.sh [--pull]    # site : build + bascule bleu/vert + sondes + rollback
bash deploy/install.sh --nginx          # propage units + vhosts (en `ubuntu`, jamais en sudo)

psql "$(grep '^DATABASE_URL=' apps/site/.env | tail -1 | cut -d= -f2-)"   # DB site + wiki
journalctl -u shenron -f

bun apps/site/scripts/genere-kinto-un.ts --rendu   # SVG du Kinto-Un + PNG de contrôle (géométrie : apps/site/src/lib/kinto-un.ts)
bun apps/site/scripts/genere-icones.ts             # favicons site + bot + logo du bot, depuis l'icône carrée
```

Écritures de données : `apps/site/scripts/depose-wiki.ts` (fiches), `depose-transcriptions.ts` / `depose-traductions.ts` (databooks), `sources-wiki.ts` (lire les sources). Tous en simulation par défaut, `--appliquer` pour écrire.

## Où lire quand

| Sujet | Fichier |
|---|---|
| Pièges mesurés (build OOM, jsonb, cache, mobile, Bash cwd…) | [`docs/pieges.md`](docs/pieges.md) — **à lire avant tout diagnostic** |
| Services, timers, DB, migrations, RAG, API | [`docs/infra-vps.md`](docs/infra-vps.md) |
| Doctrine wiki : sources, variantes, contributions, éditeur | [`docs/wiki-editorial.md`](docs/wiki-editorial.md) |
| Charte visuelle mesurée sur la couverture de tankōbon (palette, typo, trait) | [`docs/couverture-analyse-visuelle.md`](docs/couverture-analyse-visuelle.md) |
| Databooks : transcription, traduction, juges de défaut | [`docs/databooks-doctrine.md`](docs/databooks-doctrine.md), [`docs/databooks-transcription.md`](docs/databooks-transcription.md) |
| Déploiement détaillé | [`DEPLOY.md`](DEPLOY.md) · vision agent [`GEMINI.md`](GEMINI.md) · releases [`CHANGELOG.md`](CHANGELOG.md) |

## Agents, skills, hooks

- Subagent `intent-auditor` — à lancer après tout edit de `personas.ts` (mismatch intent ↔ event silencieux).
- Skills : `dragon-ball` (API/RAG/wiki), `dragon-ball-japonais` (lexique et graphies), `toriyama-svg` (dessin vectoriel mesuré, favicons, animation), `persona-*`, `bot-smoke-test`.
- Plugin `dragon-ball` (`plugins/dragon-ball/`) + marketplace `shenron` à la racine.
- Hooks : `gen:entries` auto, avertissement sur `personas.ts`, édition de `.env` bloquée.

## Mémoire opérationnelle — exploration Codex (2026-09-06)

- Le bot utilise désormais un seul client Gateway Shenron ; les anciens IDs
  `beerus`, `whis`, `grandPretre`, `enma` et `kaio` restent des aliases API.
- Commit déployé : `60534039` (`refactor(bot): unifier le runtime et durcir l API`).
- Bot : `shenron.service` actif sur 5006 ; MCP : `shenron-mcp.service` actif sur
  5010 ; site actif en bleu/vert sur `shenron-site-b.service` (:3010), le slot
  `shenron-site.service` inactif est normal.
- Déploiement vérifié : bot `/auth/me` 200, MCP `/health` OK avec upstream bot,
  site public 200 ; build Next terminé en 521 s sans coupure.
- Ressources : RAM libre ~4 Gio, swap utilisée ~5,3 Gio après arrêt de VS Code
  Server fantôme et Chrome headless de test. Ne jamais tuer `shenron-embed` :
  son `embed-server.ts` est le service RAG actif.
- Validations : monorepo type-check réussi ; bot 125 tests passés ; lint avec
  warnings préexistants seulement. MCP expose actuellement 16 outils.
- Les fichiers locaux non suivis `plugins/dragon-ball/.codex-plugin/` et
  `plugins/dragon-ball/.mcp.json` sont à préserver et ne pas commit par défaut.
