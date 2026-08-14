# CLAUDE.md — shenron

Monorepo standalone (sorti du VPS le 2026-05-16). Bot Discord DBZ multi-personas + site Next.js compagnon.

**Sources de vérité** :
- Bot prod : service systemd `shenron.service` sur le VPS (`WorkingDirectory=/home/ubuntu/shenron/apps/bot`).
- Site prod : **VPS** depuis le 2026-06-12 (migré de Vercel). `next start` sous Bun (unit systemd `shenron-site.service`, `WorkingDirectory=apps/site`, `127.0.0.1:3000`) fronté par nginx (`deploy/nginx/dragonballfr.com.conf`, TLS certbot `--dns-ovh`). **Domaine de prod unique : `https://dragonballfr.com`** (`www` → 301 apex au niveau nginx). Le projet **Vercel `dbfr`** (`prj_wxLn9COQIo9HAOUVis08ppKXx7zI`) est conservé en **standby** (repli : repointer l'A record apex `dragonballfr.com` sur Vercel `76.76.21.21` — DNS OVH, creds `~/.config/ovh/dbfr.conf`). L'API bot est servie côté VPS sur `bot.dragonballfr.com` (ex- `bot.rpbey.fr` / `shenron.rpbey.fr` legacy).
- DB bot : SQLite local `apps/bot/data/bot.db` (snapshot quotidien via timer VPS).
- DB site : **PostgreSQL local sur le VPS** depuis le **2026-06-23** (migré de Neon suite à un dépassement de quota de transfert qui avait mis le site DOWN). Base `shenron_site` sur `127.0.0.1:5432` (rôle `shenron`, schémas `public` + `bot`), service `postgresql.service` (PG 18). `DATABASE_URL` = URL locale dans `apps/site/.env` ET `~/.shenron-neon.env`. C'est un Postgres **distinct** de la DB bot (SQLite). **Neon décommissionné** (gardé en repli froid : ancienne `DATABASE_URL` Neon en commentaire dans les deux `.env` ; rebascule possible quand le quota se réinitialise). Backup quotidien `pg_dump` via `shenron-pg-backup.timer` (03:30 UTC).

## Lecture obligatoire

1. `GEMINI.md` — vision agent + règles dev (Bun-only, personas, DI tsyringe).
2. `DEPLOY.md` — guide déploiement (Fly / VPS systemd / Docker / binaire).
3. `README.md` — usage et architecture personas.
4. `CHANGELOG.md` — releases.

## Workflow PRODUCTION

### Bot (VPS)
- Le code vit ici dans `~/shenron/`. Le service systemd lit directement ce path.
- Déploiement = `git pull` dans `~/shenron/` puis `sudo systemctl restart shenron`. Le script **in-repo** `scripts/deploy-shenron.sh` automatise (pull + lint/tsc + dashboard:css + restart + smoke `/auth/me` + rollback auto).
- Réactivation complète = `bash scripts/reactivate.sh` (Nettoyage de tous les caches, bun install, migration DB, régénération des entrées, build RAG, compile CSS du dashboard, re-setup systemd et redémarrage propre de tous les services et timers de production).
- **Aucun build préalable** : Bun exécute `src/index.ts` en direct (TS natif).
- Backup DB quotidien : timer VPS `shenron-backup.timer` (03:00 UTC) → `VACUUM INTO` snapshot.
- Sync DB↔Discord quotidien : timer VPS `shenron-guild-sync.timer` (04:00 UTC).

### Site (VPS, ex-Vercel)
- **Migré de Vercel vers le VPS le 2026-06-12.** Le site tourne en `next start` sous Bun via l'unit systemd **`shenron-site.service`** (`ExecStart=bun --bun node_modules/next/dist/bin/next start -p 3000 -H 127.0.0.1`, `WorkingDirectory=apps/site`, `EnvironmentFile=apps/site/.env`, hardening calqué sur `shenron.service`, `ReadWritePaths=apps/site/.next apps/site/.bun-cache` pour le cache ISR). nginx (`deploy/nginx/dragonballfr.com.conf`) termine TLS/HTTP3, rate-limit `/api/`, et proxifie tout vers `127.0.0.1:3000` — Next garde routing/ISR/rewrite/middleware (`proxy.ts`) en process. `www` → 301 apex.
- **Déploiement = `bash scripts/deploy-site.sh [--pull] [--migrate]`** (build + restart `shenron-site` + smoke loopback + rollback auto). Provisioning unit+vhost : `bash deploy/install.sh --nginx` (le glob inclut `shenron-site.service` + `dragonballfr.com.conf`).
- **Env** : `apps/site/.env` (chmod 600, gitignored, **chargé au build ET au runtime** — les `NEXT_PUBLIC_*` sont bakés au build). `BETTER_AUTH_URL` / `NEXT_PUBLIC_SITE_URL` = `https://dragonballfr.com`, `SHENRON_API_URL` / `NEXT_PUBLIC_SHENRON_API_URL` = `https://bot.dragonballfr.com`. `SHENRON_ADMIN_TOKEN` == bot `API_ADMIN_TOKEN`, `SHENRON_USER_SECRET` == bot `API_USER_SECRET`. Secrets identiques à l'ex-prod Vercel (sessions préservées).
- **TLS** : cert apex+www via `certbot certonly --dns-ovh --dns-ovh-credentials /etc/letsencrypt/ovh-dbfr.ini -d dragonballfr.com -d www.dragonballfr.com` (creds OVH du compte `dragonballfr.com` = `~/.config/ovh/dbfr.conf`, compte `gl839461-ovh` — distinct du compte rosegriffon `~/.ovh.conf`). Renouvellement auto (certbot.timer, DNS-01).
- **DNS** : zone OVH `dragonballfr.com` (NS `ns109.ovh.net`). Bascule/repli de l'A record via `bun scripts/ovh-dns.ts` (`OVH_CONF=~/.config/ovh/dbfr.conf bun scripts/ovh-dns.ts setA dragonballfr.com <ip>`). Apex+www/bot/mcp → `51.255.162.6` (**nouveau VPS `vps-6732365f.vps.ovh.net`, Ubuntu 26.04 GRA6, depuis migration 2026-07-08**) ; ancien VPS `51.77.147.152` (arrêté, repli possible) ; repli Vercel = `76.76.21.21`. Kit de migration reproductible : `deploy/migrate/` (cf. son README).
- **Vercel `dbfr`** conservé en **standby** : workflows `.github/workflows/{deploy-vercel,neon-branch}.yml` passés en `workflow_dispatch` only (plus d'auto-deploy sur push). Au moment de la migration le projet Vercel renvoyait `402` (suspendu) — la migration a restauré le site.
- **Pas de `@vercel/analytics` / `@vercel/speed-insights`** (retirés : 404 hors Vercel). Télémétrie = GTM + first-party `/api/telemetry` (Neon) uniquement.
- Build : `bun --filter @shenron/site build` (canary Next 16 + Tailwind v4, ~60s sous Bun). `.vercelignore` exclut `apps/bot/`.

### Règles dures
1. **Pas d'édition manuelle sur le VPS dans `~/shenron/`** : tout passe par PR sur `github.com/aphrody-code/shenron` puis `git pull` côté VPS.
2. **Bun obligatoire** : pas de `node`/`npm`/`pnpm`/`yarn`/`tsx`. Utiliser `bun`, `bunx`, `bun --filter <app> <cmd>`.
   **Une seule exception, mesurée** : le **build** du site (`scripts/deploy-site.sh`) tourne sous **Node 22**. Sur ce VPS (11 Gio), à code identique, le build sous Bun s'est fait tuer par l'OOM killer (pics 9,5 et 10,5 Gio) alors que sous Node il passe en ~236 s avec un pic ~8 Gio. Le site reste **servi** par Bun (`next start`, `shenron-site.service`) : seule l'étape de build change de runtime. `--bun` force l'ancien comportement.
3. **Secrets** : jamais dans le repo. `.env` est gitignored. Production = `apps/bot/.env` (bot) + `apps/site/.env` (site), chargés par systemd via `EnvironmentFile`. Écrire les `.env` avec `printf` (jamais `echo` → pollution `\n` qui casse `DISCORD_CLIENT_SECRET`).
4. **Zéro FFI / Rust** : La stack Rust native `apps/bot/native/` est supprimée. Tout utilitaire (calcul de niveau, parsing) est écrit en TypeScript pur dans `apps/bot/src/lib/native.ts`.
5. **Catalog de Dépendances** : Toutes les versions de dépendances du monorepo doivent utiliser la syntaxe de catalogue de Bun (`catalog:`) définie dans le `package.json` racine.
6. **Paths et Déploiement Dynamiques** : Aucun chemin absolu codé en dur dans les templates systemd (`deploy/systemd/`) ou les scripts de déploiement. Ils doivent être résolus dynamiquement à l'installation.

## Style

- **Commits / PR** : 1 ligne `feat|fix|chore|refactor|docs|ops(scope):` français. Pas d'emoji, pas de `Generated with…`, pas de `Co-Authored-By: Claude`.
- **`*.md`** : seuls `README.md`, `CLAUDE.md`, `GEMINI.md`, `DEPLOY.md`, `DESIGN.md`, `CHANGELOG.md`, `SECURITY.md`, `PROMPT.md` et `docs/**` sont autorisés à la racine. Jamais de notes/plans/reports AI.
- **Lint** : `oxlint` partout, `eslint` (config-next) en plus sur `apps/site/`. Pas de Biome.
- **Type-check** : `bun run type-check` (turbo). TS 6 + types catalog.
- **Doctrine nightly (toujours)** : `next@canary`, `react@canary`, `react-dom@canary`, `typescript@next`, `bun upgrade --canary`. Pas de versions stables. Si Vercel build casse → downgrader temporairement la lib en cause, jamais l'ensemble. `framer-motion` → `motion` (motion.dev, mêmes API, 9 KB gz vs 60 KB framer). Animations préférer **View Transitions API native** + CSS `@scroll-timeline` quand possible, `motion/react` en fallback.

## Architecture monorepo

```
apps/
  bot/    → @shenron/bot  — Bun + discordx + drizzle + bun:sqlite + canvas (6 personas en 1 process) + dashboard admin React SPA (src/dashboard/, TanStack Router + Query)
  site/   → @shenron/site — Next.js 16 + Tailwind v4 + Drizzle + Postgres (Vercel) ; Pixi.js (@pixi/react, ex. KiCanvas) pour le rendu canvas, shadcn (components/ui) pour l'UI. Pas d'API métier propre : les route handlers proxifient l'API REST du bot (cf. piège proxy plus bas)
  mcp/    → @shenron/mcp  — Serveur MCP public (Bun.serve + @modelcontextprotocol/sdk, Streamable HTTP stateless, lecture seule). 14 outils proxifiant le RAG + l'API publique du bot. Servi sur `mcp.dragonballfr.com` (service `shenron-mcp`). Aucune DB/secret propre
packages/
  di/          → @rpbey/di — wrapper tsyringe
  discordy/    → @rpbey/discordy — wrapper fork discordx (multi-client injection)
  importer/    → @rpbey/importer — loader entries statiques
  internal/    → @rpbey/internal — utils partagés
  pagination/  → @rpbey/pagination — helpers pagination Discord
```

Le dossier physique est `packages/discordy/` (et non `discordx/`).

Pas de submodules. Tout est vendoré. Les 5 packages `packages/*` étaient des `@rpbey/*` côté ancien monorepo VPS, maintenant inlinés.

## Bot — personas

6 personas en 1 process (mapping `apps/bot/src/lib/personas.ts`) :
- Shenron, Beerus, Whis, Grand Prêtre, Enma, Kaïo.
- Tokens : `DISCORD_TOKEN_SHENRON`, `DISCORD_TOKEN_BEERUS`, … (cf. `apps/bot/.env`).
- Fork `@rpbey/discordy` requis pour le multi-client injection.

### Entries statiques

`apps/bot/src/_entries.ts` est généré par `bun run gen:entries`. **À regénérer après tout ajout/suppression de commande, event ou guard.**

## Site — auth Discord (Better Auth)

- Handler : `apps/site/src/app/api/auth/[...all]/route.ts` → `toNextJsHandler(auth)`.
- Config : `apps/site/src/lib/auth.ts`. Provider Discord avec scopes `identify, email, guilds, guilds.members.read` (alignés avec le bot pour pouvoir lire l'appartenance guilds côté front).
- DB : Postgres via `drizzle-orm/postgres-js` (`apps/site/src/lib/db.ts`).
- Sync : `databaseHooks.user.create.after` upsert dans `schema.users` (table métier) à la création d'un user better-auth Discord.
- Trusted origins (`auth.ts`) : `dragonballfr.com`, `www.dragonballfr.com`, `shenron.rpbey.fr`, `dbfr.vercel.app`, `localhost:3000` (+ `allowedHosts` du baseURL dynamique). Ajouter ici tout nouveau domaine.
- **Redirect URI Discord** : déterministe `{host}/api/auth/callback/discord` (dynamique par host). Tout nouveau domaine doit être déclaré côté Discord Developer Portal (app `1497194276025663680`) sinon `invalid redirect url`. Discord n'expose **aucune API** pour modifier les redirect URIs → action manuelle portail.
- **Coexistence** : le bot a son propre better-auth (`apps/bot/src/lib/better-auth.ts`) en SQLite pour le dashboard admin. **2 instances séparées, 2 DBs, 2 sets de sessions** — c'est intentionnel.

## Site — home cinématique & télémétrie

- **Home (`/`)** = expérience full-page « Codex Shenron » (`apps/site/src/components/home/*`). Deck **client** (`HomeExperience`, `"use client"`) en **scroll-snap document** (`html[data-home]` posé/retiré au mount) ; navigation molette/clavier/tactile → `scrollIntoView`. Données **SSR** (`page.tsx`) + **live** côté client (`useLiveBotState` : poll `bot.dragonballfr.com/api/public/{stats,personas}` + SSE `/api/a2a/events`, CORS OK). Fonds = scènes curées (`lib/home-scenes.ts`, client-safe) en ken-burns + grade d'ère (CSS dans `globals.css`). **Aucune session/cookies** → cache CDN préservé. **Cadrage éditorial** : « Voyage à travers l'univers Dragon Ball » — le mot « wiki » est banni de la vitrine (héro/summon/404, description SEO), on parle d'exploration de l'univers.
- **Wiki — IA & comptes** : index canoniques `/wiki/personnages` (grille filtrable `CharacterGrid`) + `/wiki/planetes` ; les **routes détail** restent sous `/wiki/dragon-ball/{character,planet,techniques}/…`. `/wiki/dragon-ball` (ancien fourre-tout) = **308 via `next.config` `redirects()`** → `/wiki/personnages` (jamais un `redirect()` en composant : dégrade en 200 + `<meta refresh>` à cause du streaming du layout `/wiki`). Tous les comptes affichés viennent de `dbUniverse.counts()` (Neon réel) — **zéro nombre codé en dur** (ils se désynchronisent dès que la DB grossit).
- **Télémétrie first-party** (`lib/telemetry.ts`) : `track(event, props)` typé → fan-out **Vercel Analytics + GTM dataLayer + `POST /api/telemetry`** (ingest Postgres `site_events`/`user_preferences`, anonymisation hash salé + `anonId` httpOnly). **Opt-in strict** + **Google Consent Mode v2** (`lib/consent.ts`, `ConsentGate`). Reco/perso server-only `lib/recommendations.ts`. GTM = `GTM-KLSS5787` via `@next/third-parties/google` (`layout.tsx`).
- **SEO (depuis `f6d7792`)** : composant **server** `components/SiteJsonLd.tsx` rendu dans le layout → JSON-LD `Organization` + `WebSite` avec `SearchAction` (sitelinks search box → `/wiki/search?q={search_term_string}`). **Inerte, sans cookie/header → cache CDN préservé.** `ogMeta` (`lib/og.ts`) prend un param `canonical` → `alternates.canonical` + `og:url` ; canonicals **auto-référentes** câblées sur ~30 pages (home + index + détails + page perso inline). **Pas de canonical globale** (pointerait toutes les pages vers la home). `robots.ts` : `/_next/` débloqué (ressources de rendu) ; `/wiki/search` en `noindex, follow` (évite l'indexation de la combinatoire `?q=`).

## DB & migrations

- **Bot** : `bun:sqlite` via Drizzle. Migrations dans `apps/bot/drizzle/`. Fichier prod : `apps/bot/data/bot.db`.
- **Site** : **PostgreSQL local VPS** (`shenron_site`, schémas `public` + `bot`) via Drizzle/postgres-js, depuis la migration Neon → PG local du **2026-06-23**. Migrations `public` générées dans `apps/site/src/db/migrations/`. Le schéma `public` complet a été matérialisé via `drizzle-kit push` (les 9 tables de base — `User`/`Post`/`Comment`/`Wiki*`/`ba_*` — n'ont **pas** de SQL de migration, créées historiquement par `push` ; `drizzle-kit migrate` seul est insuffisant). Le schéma `bot` est créé via `apps/site/drizzle.config.bot.ts` (`drizzle-kit generate` → DDL, schemaFilter `["bot"]`) puis seedé depuis le SQLite par `apps/bot/scripts/seed-pg-from-sqlite.ts` (intersection de colonnes ; colonnes Neon-only re-dérivées : `players` via `import-voiranime-players*.ts`, `pages` via `reconstruct-manga-pages-from-disk.ts`). **Piège** : `drizzle-kit migrate` plante silencieusement (exit 1) sous Bun → utiliser `push` (`migrate` non utilisé par `deploy-site.sh` sans `--migrate`). URL via `DATABASE_URL`.
- **Automatisation Neon ↔ GitHub ↔ Vercel (LEGACY, suspendue)** : workflows `.github/workflows/{neon-branch,deploy-vercel}.yml` en `workflow_dispatch` only. La branche Neon par PR n'a plus d'objet depuis la migration PG local. `NEON_PROJECT_ID=patient-star-28731823` (us-east-1) était le projet MCP **stale** ; la vraie prod Neon était `ep-purple-silence` (eu-central-1), aujourd'hui décommissionnée. Doc historique : `apps/site/docs/neon-automation.md`. Wiki-crawl manga récurrent → timer `shenron-wiki-crawl` (opt-in).
- Schéma partagé conceptuellement mais **physiquement séparé** (provider différent). Préfixe `ba_` pour better-auth tables (`ba_user`, `ba_session`, `ba_account`, `ba_verification`).
- **Source de vérité du wiki = `bot.*` du Postgres du site** (depuis `a572e3f`; **= PG local VPS depuis le 2026-06-23**, ex-Neon). Les scripts gardent leur nom historique (`*-neon-*`) mais pointent désormais le **PG local** via la `DATABASE_URL` de `~/.shenron-neon.env`. Sync **bidirectionnelle** par rôle de table (liste `apps/bot/scripts/_wiki-editorial.ts`) :
  - **Forward `sync-sqlite-to-neon.ts`** (timer `shenron-neon-sync.timer`, 30 min) : runtime (users/économie/…) **+ `db_news`** SQLite→PG. **Exclut le wiki éditorial.**
  - **Reverse `sync-neon-to-sqlite.ts`** (timer `shenron-neon-pull.timer`, 15 min) : wiki éditorial PG→SQLite (DELETE+INSERT par table, FK off, WAL-safe) → le SQLite du bot est un **replica de lecture** (commandes Discord `/wiki` + build RAG restent locaux, rapides, indépendants du PG). **Anti-truncate** : si la source est vide alors que le replica a des données, la table est skippée (ne vide jamais le SQLite, qui est la source de re-seed du PG).

### RAG hybride (depuis `100a8a3`)

- `/api/public/rag/search` + GraphQL `ragSearch` + Discord `/ask` + recherche du site (`dbUniverse.rag`) = **pipeline RAG SOTA** : étage 1 récupération **hybride** (BM25 `rag_chunks` FTS5 + embeddings denses `vec_chunks` cosinus exact brute-force, fusion **RRF**) → étage 2 **reranking cross-encoder** du top-15. Cf. `apps/bot/src/lib/rag.ts` (runtime léger, zéro modèle dans le bot). `mode` ∈ `hybrid+rerank | hybrid | lexical`.
- **Exploitation (depuis `4a0afd3`)** : `RagHit` expose un `score` ∈ [0,1] (hybrid+rerank = sigmoïde du logit cross-encoder ; sinon RRF/lexical = min-max planché à 0.4). **Comparable uniquement au sein d'une même réponse et d'un même `mode`** (pas un seuil absolu). **Déduplication/diversification** du top-N par URL canonique puis repli sur TITRE foldé (les chunks Fandom `kind=source` ont souvent une url vide) ; le **manga est exempté** (clé par rowid → préserve le quota manga ≥2). **Stopwords FR/EN** filtrés + fold d'accents dans `ftsMatch` (FTS5 en `remove_diacritics 2` → fold sûr ; garde-fou : on ne filtre que si >3 tokens et qu'il reste ≥2 tokens). Snippet de repli centré sur le 1er terme de requête. Propagé partout : API `rag/search` remonte `score` ; `rag/chat` a reçu CORS + rate-limit ; GraphQL `RagHit` expose `rowid` + `score` ; MCP `rag_search` gagne les filtres `lang`/`entity`/`sourceId` + `score` ; Discord `/ask` = citations numérotées `[n]` + icône de mode + % de pertinence ; site = puces de pertinence + `WikiRagArchives` (« passages liés » sourcés, `<Link>` internes, monté en îlot Suspense sur la page saga ⇒ revalidate de cette route 3600→300s).
- **Modèles** : embeddings `Xenova/multilingual-e5-small` (384d, FR+JP) + reranker `Xenova/bge-reranker-base` (cross-encoder multilingue). Servis par le **sidecar `shenron-embed.service`** (port 5007, modèles chauds, `MemoryMax=3G`, RSS ~1.6G) — le bot (1.5G) ne charge JAMAIS de modèle. Cache `apps/bot/.models` (gitignored). `apps/bot/src/lib/embeddings.ts` = heavy, importé seulement par le sidecar + `scripts/rag-build.ts`. Rerank cappé à 400 chars/passage (le cross-encoder tronque à 512 tokens ; 1.4s vs 4.8s), timeout 6s (`RAG_RERANK=0` pour désactiver).
- **Build** : `bun --filter @shenron/bot run rag:build` (embed offline in-process ; corpus ~**40 874 chunks** — wiki + manga OCR 147 tomes + 2058 docs Xenoverse 2 — ⇒ phase d'embedding ~**15 min** ; `RAG_DB=/path` pour tester sur copie). Après build sur prod → `systemctl restart shenron`. **Ne JAMAIS lancer `rag:build` au premier plan, en arrêtant le bot, ni en live** (le DDL `DROP` gèle les handlers) → cf. piège dédié + `scripts/rag-embed-vectors.ts` (re-embed `vec_chunks` sans downtime).
- **Dégradation gracieuse** : sidecar down/timeout → `mode:lexical` (BM25 seul), jamais de crash. Réponse inclut `mode: "hybrid"|"lexical"`.
- **Piège** : `Bun.serve` (listen) meurt en exit 144 dans le sandbox du Bash tool — tester la logique RAG sans serveur ; le sidecar tourne en prod via systemd.

### API GraphQL + OpenAPI (depuis `cb426bb` / `80c7551`)

- **GraphQL** read-only du wiki sur `/graphql` (Pothos code-first + graphql-yoga, monté sur le `Bun.serve` du bot, GraphiQL activé, CORS public, garde-fou profondeur max 10). `apps/bot/src/api/graphql.ts`. Entités + relations + `ragSearch` + `counts`.
- **OpenAPI 3.1** de l'API REST publique sur `/api/openapi.json`, UI **Scalar** sur `/api/docs` (CDN, zéro dep). `apps/bot/src/api/openapi.ts` (spec statique, à tenir à jour avec les routes).
  - Connexion DB dans `/home/ubuntu/.shenron-neon.env` (600, hors repo, format systemd — non sourçable en shell). **Depuis le 2026-06-23 = URL du PostgreSQL local** (`postgresql://shenron:…@127.0.0.1:5432/shenron_site`), pas Neon (ancienne URL Neon en commentaire pour repli). PK wiki en `IDENTITY` (inserts site).
- **Le site possède le wiki en read+write, 100 % Next.js, zéro API bot** (depuis `a572e3f`) :
  - **Lecture** : `apps/site/src/db/bot-schema.ts` (`pgSchema("bot")`) via Drizzle. Public → `shenron.ts`/`db-universe.ts` (server-only) ; admin db-universe → `wiki-admin.ts` (server-only).
  - **Écriture** : route handler `apps/site/src/app/api/wiki-admin/[...path]` (gaté `isCurrentUserAdmin`) → `wiki-admin.ts` → Drizzle Neon. L'éditeur générique + `DbCrud` routent les tables wiki vers `/api/wiki-admin` (`wiki-tables.ts` client-safe : `isWikiTable`/`crudBase`) ; les tables **non-wiki** + `db_news` restent sur le proxy `/api/bot-admin`.
  - **Côté bot** : l'API CRUD `db_*` est **lecture seule** (garde write 409). Seul le **runtime** (user/shop/leaderboard/stats/personas/commands/carte PNG/SSE/RAG) reste sur l'API. Cf. mémoire `site-wiki-reads-neon-direct`.
- **Tables site (Postgres `public`)** : auth (`ba_*`), métier (`users`, `posts`), **télémétrie `site_events` + `user_preferences`** (migration `apps/site/src/db/migrations/0000_*`, `out` = `src/db/migrations` ; le site utilisait `db:push` historiquement → appliquer la migration à la main). `bot.db_episodes` (Neon) a gagné `frames` (jsonb `EpisodeFrame[]`) + `scene_preview` pour les **scènes d'épisode** (extraction `scripts/{build-episode-scenes,extract-dbz-frames,scrape-dbz-fandom-frames}.ts` → ingest gardé `scripts/ingest-episode-frames.ts`).

## Services VPS (références)

| Service | Port | Vhost | Stack |
|---|---|---|---|
| shenron-site | 3000 (loopback) | dragonballfr.com (ex-Vercel, migré 2026-06-12) | Next.js 16 en `next start` sous Bun, fronté nginx `dragonballfr.com.conf`. DB = **PostgreSQL local** (depuis 2026-06-23). Vercel `dbfr` gardé en standby |
| postgresql | 5432 (loopback) | — | **PostgreSQL 18** local (base `shenron_site`, schémas `public` + `bot`) — DB du site depuis la migration Neon → PG local du 2026-06-23. Backup `shenron-pg-backup.timer` |
| shenron | 5006 | bot.dragonballfr.com (ex- bot.rpbey.fr) | Bun + discordx + drizzle + bun:sqlite + canvas. Sert aussi **GraphQL** `/graphql` (Pothos+yoga, GraphiQL) et **OpenAPI** `/api/openapi.json` + UI Scalar `/api/docs` |
| shenron-embed | 5007 (loopback) | — | Sidecar embeddings RAG (multilingual-e5-small, transformers.js). Modèle chaud, isolé du bot. Cf. RAG hybride |
| shenron-llm | 5008 (loopback) | — | **Serveur LLM conversationnel local** (llama.cpp, Qwen2.5-3B-Instruct GGUF, CPU). Sert `generateLlmAnswer` (chat bot + site) : conversation + raisonnement + mémoire Redis, faits via RAG. Aucune API externe. Cf. [`docs/llm-maison.md`](docs/llm-maison.md) |
| shenron-mcp | 5010 (loopback) | mcp.dragonballfr.com | **Serveur MCP public** (`apps/mcp`, `@shenron/mcp`) : Bun.serve + `@modelcontextprotocol/sdk` (transport **Streamable HTTP** Bun-natif `WebStandardStreamableHTTPServerTransport`, **stateless**, **lecture seule**, **auth `none`**). 14 outils qui **proxifient** l'API publique du bot (`127.0.0.1:5006/api/public/*`) + le RAG — aucun accès DB/secret. Endpoint `POST /mcp`, sonde `/health`, doc `/`. CORS `*` géré par l'app (nginx ne pose PAS de CORS). Compatible Claude web/desktop, Grok, Gemini, Ollama (bridge). Distribué aussi en **plugin Claude Code** `dragon-ball` (cf. § Agents & skills) qui déclare ce serveur MCP distant inline |
| shenron-backup.timer | — | — | `VACUUM INTO` SQLite bot quotidien 03:00 UTC → `data/backups/shenron-sqlite/` |
| shenron-pg-backup.timer | — | — | `pg_dump shenron_site` (gzip, retention 14j) quotidien 03:30 UTC → `data/backups/shenron-pg/` |
| shenron-guild-sync.timer | — | — | Script réconciliation DB↔Discord quotidien 04:00 UTC |
| shenron-neon-sync.timer | — | — | Forward SQLite → **PG local** (runtime + `db_news`, wiki exclu) toutes les 30 min |
| shenron-neon-pull.timer | — | — | Reverse **PG local** → SQLite (wiki éditorial, replica de lecture du bot) toutes les 15 min |
| shenron-watchdog.timer | — | — | Auto-remédiation prod toutes les 5 min : endpoints HTTP (site/bot/mcp) en échec 2×consécutif → `nginx reload`, 3×consécutif → restart du service applicatif concerné (rate-limité, cooldown 30 min) ; mémoire d'un service ≥90% de son `MemoryMax` → restart préventif ; swap ≥70% avec marge RAM suffisante → purge (`swapoff -a && swapon -a`, cooldown 2h). Script `scripts/watchdog.sh`, actif par défaut (`deploy/install.sh`) |
| shenron-refresh-players.timer | — | — | Toutes les 30 min : détecte les lecteurs voir-anime morts par petit lot roulant (curseur `players_checked_at`) et tente un **re-scrape live ciblé** (bxc, `apps/bot/scripts/refresh-dead-embed-players.ts` + `~/bxc/scripts/refresh-embed-players.ts`) avant purge — ne « répare » pas streamhide/voe/streamtape/filemoon (morts structurels, cf. piège lecteurs episodes/films), seulement mail.ru/yourupload (link rot partiel). Opt-in, `shenron-prune-players.timer` reste le filet de sécurité hebdo |

**Vendorées dans le repo (source de vérité, plus `~/vps/`)** : units `deploy/systemd/shenron*.{service,timer}`, vhosts `deploy/nginx/{bot.rpbey.fr,shenron}.conf`, installeur idempotent `deploy/install.sh`. Scripts d'ops `scripts/{backup-shenron-sqlite,shenron-guild-sync,deploy-shenron}.sh`. Provisioning d'un hôte nu : `bash deploy/install.sh --nginx --start` (cf. `deploy/README.md`).

## Pièges critiques

- **DB site = PostgreSQL local VPS (depuis 2026-06-23), plus Neon** : base `shenron_site` sur `127.0.0.1:5432`, schémas `public` (site/auth/télémétrie) + `bot` (wiki). Driver inchangé (`postgres-js`). Runbook complet : [`docs/migration-postgres-local.md`](docs/migration-postgres-local.md). Pièges spécifiques : (1) `drizzle-kit migrate` **plante silencieusement (exit 1) sous Bun** → `push` fonctionne ; le schéma `public` complet vient de `push` (les 9 tables de base n'ont pas de SQL de migration). (2) Les colonnes **Neon-only** (`db_episodes/db_movies.players`, `db_manga_chapters.pages`, `frames`, `stream_*`, `subtitles`) sont **jsonb absentes du SQLite** → le seed les laisse NULL, re-dérivées par `import-voiranime-players*.ts` (dataset bxc) et `reconstruct-manga-pages-from-disk.ts` (relit `assets/manga/<série>/ch<id>/*.webp`). (3) **`public.*` perdu** (sessions/posts/tierlists/télémétrie) car Neon était inaccessible au moment de la migration (quota) → repartis à neuf ; backfill possible quand le quota Neon se réinitialise (ancienne URL Neon en commentaire dans les 2 `.env`). (4) **Ordre de réactivation des syncs** : couper `shenron-neon-{sync,pull}.timer` AVANT de toucher la DB (le reverse-sync DELETE+INSERT pourrait vider le SQLite — source de re-seed) ; ne les ré-enable qu'après seed PG complet.
- **DI tsyringe + `import type`** : casse `Reflect.metadata("design:paramtypes")`. Toujours `import { Class }` (sans `type`) pour les classes injectées.
- **Bun parse `$VAR` dans `.env`** : substitue les vars shell. Escape avec `\$` (les quotes simples ne protègent PAS).
- **Multi-process Better Auth (bot ≠ site)** : changer le schéma `ba_*` côté site n'affecte pas le bot et inversement. Toujours migrer les deux si on touche les tables auth communes.
- **Catalog versions** : `bun install` au root recalcule pour tous les workspaces. Modifier `package.json#workspaces.catalog` puis `bun install` au root.
- **`apps/bot/data/bot.db`** : never commit. Gitignored. La perte du fichier = perte de toute la data runtime (cf. recovery commits `8d9fc49` / `eb99aae`). Backups timer obligatoire.
- **Personas tokens** : 6 tokens distincts requis pour démarrer. Si un seul manque, le bot crash au boot.
- **`_entries.ts` désynchro** : si on ajoute une commande sans regénérer, elle ne sera pas chargée. Ajouter `bun run gen:entries` au pre-commit ou CI.
- **`OOMScoreAdjust` & `MemoryMax=1.5G`** sur le service VPS : canvas + 6 clients Discord = sensible mémoire. Surveiller `peak`.
- **`bunfig.toml`** : registre forcé sur npmjs (`@rpbey` scope). Si on rebascule sur GitHub Packages, prévoir `NPM_TOKEN`.
- **Intent ↔ event mismatch silent** : retirer un intent (ex. `GuildMembers` sur kaio) ne casse rien au boot, mais `message.member` devient `null` et tous les handlers qui en dépendent (`handleLevelUp`, rôles auto, etc.) deviennent silencieusement no-op. Avant tout edit de `apps/bot/src/lib/personas.ts`, lancer le subagent `intent-auditor` (`.claude/agents/intent-auditor.md`). Cause racine du bug rôles level / Saiyan post-migration monorepo.
- **Vercel deploy depuis root uniquement** : `vercel deploy --prod --yes` doit être lancé depuis `/home/ubuntu/shenron/` (jamais depuis `apps/site/`). Le projet `dbfr` a `rootDirectory: apps/site` côté Vercel UI ; deploy depuis `apps/site/` produit un path invalide `apps/site/apps/site`. Pareil pour `git push` (toujours depuis root). Skill dédiée : `deploy-shenron-prod`.
- **Site = proxy de l'API bot, SAUF le wiki** : le site n'a pas d'API métier propre. Les route handlers `apps/site/src/app/api/bot-admin/[...path]/route.ts` et `bot-user/[...path]/route.ts` proxifient l'API REST du bot (`SHENRON_API_URL`) côté server, en gardant `SHENRON_ADMIN_TOKEN` server-only (jamais leak au browser). **Exception (depuis `d10f77b`)** : les pages publiques `/wiki/*` lisent le wiki directement dans Neon `bot.*` via Drizzle (server-only), pas via le proxy. `@trpc/*` figure dans les deps mais **n'est pas câblé** — ne pas l'utiliser comme référence d'archi.
- **URL/API du site = `lib/config.ts` (source unique, depuis `b165320`)** : `API_URL` (API bot), `ASSET_BASE` (assets bot), `SITE_URL`, `DISCORD_INVITE` + helpers `apiUrl()`/`assetBaseUrl()`. **Ne JAMAIS re-hardcoder** `https://bot.dragonballfr.com` / `https://discord.gg/dbfr` / `https://dragonballfr.com` ni refaire un `process.env.SHENRON_API_URL ?? "…"` — importer depuis `@/lib/config`. Module **client-safe** (lit `process.env` en public-first ; seule exception autorisée à « pas de `process.env` hors `env.ts` »). `env.ts` garde la validation zod des vars brutes ; `config.ts` résout les bases. **Épargnés** (déjà centralisés / sensibles) : `auth.ts`/`auth-client.ts` (Better Auth baseURL), allowlist host `api/telemetry`, branding OG. Migration de domaine = poser `NEXT_PUBLIC_SHENRON_API_URL` + `NEXT_PUBLIC_SITE_URL`, rien d'autre.
- **Wiki = Neon source de vérité ; SQLite bot = replica** : ne plus écrire le wiki dans SQLite. **Tous** les écrivains éditoriaux sont **gardés** via `src/db/wiki-write-guard.ts` (`process.exit(1)` sauf `ALLOW_SQLITE_WIKI_WRITE=1`) car le reverse-sync Neon→SQLite les écraserait : `scripts/ingest/*` (via `_db.ts` + import direct `~/db/wiki-write-guard` pour ceux en DI), `scripts/enrich-*.ts`, et les 5 seeds éditoriaux `src/db/seed-{wiki,media,games,manga,techniques}.ts`. **Exemption runtime (piège vécu)** : la garde teste `Bun.main` et NE s'enforce PAS quand l'entry est `src/index.ts` — le bot importe `runWikiSeed` pour l'auto-seed self-healing au boot, et un `process.exit(1)` top-level échappait au try/catch de l'auto-seed → **crash-loop systemd** (StartLimit → `reset-failed` requis). `db:seed-all` ne contient plus que du runtime (triggers + level-rewards + shop-banners). Migrer les tools éditoriaux vers Neon avant réactivation. Éditer le wiki = via le site (`/api/wiki-admin` → Neon).
- **Scripts de sync : pas de `main()` top-level importable** : `sync-neon-to-sqlite.ts` importe `WIKI_EDITORIAL` depuis `_wiki-editorial.ts` (constante pure), JAMAIS depuis `sync-sqlite-to-neon.ts` (dont le `main()` top-level s'exécuterait en side-effect → double sync). Bug attrapé `bea3d17`.
- **`shenron.ts` / `db-universe.ts` sont `server-only`** : ils tapent Neon via postgres-js. Tout Client Component qui a besoin de `assetUrl` (ou `getProfileCardUrl`/`subscribeBotEvents`) doit importer `@/lib/assets`, JAMAIS db-universe/shenron — sinon `postgres` fuite dans le bundle client et le build casse. `WikiMarkdown` est isomorphe (RSC + preview éditeur client) → règle critique.
- **Latence — JAMAIS de session (cookies/headers) dans le layout racine** : `SiteNav` lisait `getCurrentUser()` (→ `headers()`) → **toutes** les pages basculaient en `cache-control: private, no-store` (0 cache CDN, même avec `revalidate`). L'auth de la nav est un **îlot client** (`/api/me` + hook `useMe` → `NavAuth`/`MobileNav`). Tout `cookies()`/`headers()` dans `app/layout.tsx` (ou un composant qu'il rend en SSR) re-désactive le cache de TOUT le site. Vérif : `curl -sI https://dragonballfr.com/wiki/sagas | grep -i cache` → doit montrer `public` + `x-vercel-cache: HIT`.
- **Pages `[param]` : `generateStaticParams` OBLIGATOIRE pour le cache** : sous Next 16 canary, une route à segment dynamique SANS `generateStaticParams` est rendue **dynamiquement** (`no-store`) malgré `export const revalidate`. L'ajouter (lister ids/slugs via `dbUniverse.*`/`getShenron*`, guard `?? []` pour les helpers `safe()`) → pré-rendu build + ISR (`x-vercel-cache: HIT`). Les pages liste (sans param) se cachent sans. `dynamicParams` reste `true` (nouvelles entrées rendues on-demand).
- **OG images** : OG par page via helper `@/lib/og` `ogMeta({title,description,image})` (image = URL absolue, ex. `assetUrl(...)`) ; défaut de marque = `app/opengraph-image.tsx` (`next/og`, 1200×630) hérité partout ; `metadataBase` dans `app/layout.tsx`.
- **jsonb → Neon** : écrire avec `sql.json(value)` (postgres-js), JAMAIS `${JSON.stringify(value)}::jsonb` qui produit un **scalaire string** (pas un array exploitable) — cf. fix `db_episodes.players`.
- **Lecteurs épisode (`/wiki/episodes/[id]`)** : priorité `players` (lecteurs voir-anime VF/VOSTFR, iframes via `EpisodeLecteurs`) > `video_url` > `stream_url` > image. `video_url`/`stream_url` ont contenu un flux de test (mux.dev) / tokens HLS périmés → ne pas les remettre en tête. VF importée par `apps/bot/scripts/import-voiranime-players-vf.ts` (dataset bxc `dragon-ball-full.json`).
- **Captures / mesures visuelles & perf** : le plus simple = `chromium --headless --no-sandbox --hide-scrollbars --window-size=1440,900 --screenshot=/tmp/x.png <url>` (binaire `/usr/local/bin/chromium`, aucun dep). Pour du scripté : `bun add playwright-core` dans `/tmp/pw` + `chromium.launch({ executablePath: "/usr/local/bin/chromium" })` via `bun`. Test live anti-404 : `bun test apps/site/tests/no-404.test.ts`, hors CI (flaky).
- **Bot API qui se fige (lock SQLite)** : une op DB ad-hoc sur `apps/bot/data/bot.db` pendant que le bot tourne (`drizzle-kit migrate`/`generate`, `ALTER`, smoke d'un script qui lit la DB) peut laisser les handlers HTTP `Bun.serve` **bloqués** → `/health` répond `000` alors que le port `:5006` **écoute** et que systemd dit `active`. Fix : `sudo systemctl restart shenron` (relâche le lock + recharge le schéma TS). Vu en posant `db_episodes.{frames,scene_preview}`.
- **`EpisodeFrame` = type riche** : source de vérité `apps/bot/src/db/episode-frames.ts` (`imagePath`/`isNotable`/`characterNames`/`caption`/`tags`/`timecodeSec`/`sortOrder`…), écrit en jsonb sur `bot.db_episodes.frames`. Le site **duplique** ce type (pas d'import cross-app) dans `src/db/bot-schema.ts` — garder les deux alignés (`imagePath` PAS `path` ; `isNotable` PAS `notable`).
- **Télémétrie : tables avant deploy** : `site_events`/`user_preferences` doivent exister sur le Postgres du site AVANT de pousser le code d'ingest (sinon `POST /api/telemetry` insert → erreur). Appliquée à la main : `vercel env pull apps/site/.env.local --environment=production` → exécuter le `.sql` via postgres-js → supprimer le `.env.local` (secrets).
- **bxc (crawl)** = toolchain externe `/home/ubuntu/bxc` (`BXC_DIR`), invoquée en sous-process. v0.5.4 : `bxc scrape` sort du **JSON**, profils `static|fast|http|stealth|max` (`ghost` supprimé). `dragonball.news`/`bandai` fragiles depuis le VPS (cert expiré + IP datacenter filtrée) → proxy résidentiel pour un ingest fiable.
- **`rag:build` = ~15 min, JAMAIS en foreground / JAMAIS en stoppant le bot** : corpus ~40 874 chunks ⇒ la phase d'embedding dure ~15 min, et le build émet un DDL `DROP`/recreate qui **gèle les handlers HTTP** s'il tourne en live → downtime. Pour un re-embed après un `fix-*` data ou un build interrompu, utiliser `scripts/rag-embed-vectors.ts` : il recalcule **uniquement** `vec_chunks` depuis un `rag_chunks` déjà bon, **sans verrou d'écriture** (l'embedding n'est que des appels HTTP au sidecar) et avec **insertion finale atomique** (bascule nette lexical→hybride). `rag:build` complet = en tâche de fond, hors heures de pointe, puis `systemctl restart shenron`.
- **Fuite d'infobox Fandom (corrigé `78b2472`)** : l'ingest Fandom faisait fuiter des paramètres d'infobox dans des champs de `bot.db_characters` (`name_ja`/`name_romaji`/`race`/`affiliation` — ex. `name_ja = "|Décès = An 737"`, `race = "Giras|Concepteur=…}}"`). 306 cellules nettoyées via `scripts/fix-infobox-leak.ts` (idempotent ; corrige le **PG `bot.*` source de vérité** → propagé au SQLite par le reverse-sync `shenron-neon-pull`). Root cause fixée dans `scripts/ingest/ingest-fandom-full.ts` : `clean()` coupe la valeur au 1er `}}` / `|` de tête (wikilinks/templates résolus **avant** pour ne pas casser leurs séparateurs internes).

## Backups & recovery

- Backup auto SQLite : VPS timer `shenron-backup.timer` → `apps/bot/backups/bot-YYYY-MM-DD.db`.
- Recovery from Discord history : `apps/bot/scripts/reconstruct-from-discord.ts` (cf. commit `eb99aae`) — scanne l'historique des messages pour reconstruire users/levels.
- Sync structurel DB↔Discord : `apps/bot/scripts/sync-discord.ts` (cf. commit `9c3be8b`) — réconcilie users, niveaux, joins/leaves.

## Workflow d'édition

Pour toute modif applicative (`apps/bot/`, `apps/site/`, `packages/*`) :

1. Lire `GEMINI.md` + `CHANGELOG.md` récent.
2. Éditer dans `~/shenron/` (jamais ailleurs).
3. `bun run lint` puis `bun run type-check` au root (turbo cache).
4. Commit + push `github.com/aphrody-code/shenron`.
5. Bot : `scripts/deploy-shenron.sh --pull` (pull + build + restart systemd + smoke + rollback).
   Site : auto-deploy Vercel sur push `main`.
6. Vérifier `journalctl -u shenron -n 50` (bot) ou Vercel logs (site).

Pour toute modif infra (units, timers, vhosts, scripts ops) : éditer dans `deploy/` ou `scripts/` **du repo**, puis `bash deploy/install.sh [--nginx]` pour propager sur l'hôte. Le repo est self-contained — `~/vps/` n'est plus la source de vérité pour shenron.

## Commandes courantes

```bash
# Dev local
bun bot:dev          # bot en watch
bun site:dev         # site Next dev server

# Build / qualité
bun run build        # turbo build all (site: next build --turbopack ; bot: dashboard:css puis bun build) - packages use prebuilt dist
bun run lint         # oxlint + eslint (turbo)
bun run type-check   # tsc all (turbo)

# Tests — runner sur-mesure couvrant TOUS les scopes (scripts/test-all.ts)
bun run test:all                                # tous les scopes (matrice ; turbo skippe les scopes sans script `test`)
bun run test:ci                                 # --strict (CI) : échoue sur tout scope zéro-test
bun run test:live                               # ajoute le tier live (apps/site no-404, crawler prod flaky — hors défaut)
bun run test:cov                                # lcov + junit par scope
bun --filter @shenron/bot test                  # tous les tests bot (apps/bot/tests/)
bun test apps/bot/tests/wiki.test.ts            # un seul fichier de test (depuis le root)
# NB: le runner isole les scopes par cwd/process (preload bunfig bot = reflect-metadata + canvas shim + ./data/test.db ;
#     @singleton DI + DB de test partagée → ordre-dépendant : utiliser --randomize/--rerun-each pour chasser les flakes).
#     apps/site = tier `live` (opt-in --live) ; les 4 packages fork (di/importer/internal/pagination) ont désormais des suites réelles.

# Bot — utilitaires
bun --filter @shenron/bot run gen:entries  # regen _entries.ts
bun --filter @shenron/bot run db:migrate   # drizzle migrations
bun --filter @shenron/bot run db:seed-all  # seed RUNTIME only (triggers + level-rewards + shop-banners) ; wiki éditorial = Neon (reverse-sync), plus seedé en SQLite
bun --filter @shenron/bot run dashboard:css # recompile le CSS Tailwind du dashboard admin (requis avant build)

# RAG / data wiki (jamais en foreground ni en stoppant le bot — cf. pièges)
bun --filter @shenron/bot run rag:build              # rebuild complet rag_chunks + vec_chunks (~15 min, ~40 874 chunks)
bun apps/bot/scripts/rag-embed-vectors.ts            # re-embed UNIQUEMENT vec_chunks (sidecar HTTP, sans downtime, insertion atomique)
bun apps/bot/scripts/fix-infobox-leak.ts             # purge idempotente des fuites d'infobox Fandom dans bot.db_characters (PG source de vérité)

# Scènes d'épisode (frames → preview.mp4 → wiki) — déposer les masters dans apps/bot/data/dbz-sources/<série>/<num>.mkv
bun apps/bot/scripts/build-episode-scenes.ts --series DBZ --ep 1 --max 24   # extraction ffmpeg + preview + dataset (--dry-run pour tester)
bun apps/bot/scripts/scrape-dbz-fandom-frames.ts --series DBZ --from 1 --to 10 [--download]  # alt. sans vidéo (screencaps fandom)
sudo systemd-run --pipe -p EnvironmentFile=/home/ubuntu/.shenron-neon.env --working-directory=/home/ubuntu/shenron/apps/bot \
  bun scripts/ingest-episode-frames.ts --series DBZ --ep 1 --apply   # ingest Neon gardé, puis: systemctl start shenron-neon-pull.service

# Prod (VPS)
sudo systemctl restart shenron
sudo systemctl status shenron --no-pager
journalctl -u shenron -f
```

## CI

`.github/workflows/` :
- `ci.yml` — lint + type-check + tests sur PR.
- `codeql.yml` — analyse SAST.
- `deploy-fly.yml` — déploiement Fly.io (cible secondaire).
- `release.yml` — tags + changelog.
- `update-deps.yml` — bump auto deps.

## Agents & skills

Subagents repo (`.claude/agents/`) :
- `intent-auditor` — croise `@Bot("X")` ↔ `personas[X].intents` ↔ `@On({event:Y})` pour détecter les mismatches silencieux (cf. bug Kaio GuildMembers). À lancer après tout edit de `personas.ts` ou ajout d'event handler.

Skills globales utiles (`~/.claude/skills/`) :
- `persona-{shenron,beerus,whis,grandpretre,enma,kaio}` — fiche identité+code+API+commandes par persona.
- `bot-smoke-test` — 10 checks prod (6 personas online, API publique, site Vercel, DB, timers, logs).
- `deploy-shenron-prod` — orchestre push+vercel+systemctl dans le bon ordre depuis root (user-only).

Plugin Claude Code `dragon-ball` (`plugins/dragon-ball/`, depuis `644ccc3`) :
- Manifeste `.claude-plugin/plugin.json` + skill auto-découverte `skills/dragon-ball/` (SKILL.md + `references/` + `scripts/db.sh`) + serveur MCP distant déclaré **inline** (`mcpServers.dragonball = { "type": "streamable-http", "url": "https://mcp.dragonballfr.com/mcp" }`).
- **Marketplace `shenron`** à la racine (`.claude-plugin/marketplace.json`, source `./plugins/dragon-ball`). Install : `/plugin marketplace add aphrody-code/shenron` puis `/plugin install dragon-ball@shenron`. Validé via `claude plugin validate`.
- **Caveat** : héberger le plugin dans ce monorepo ⇒ `/plugin marketplace add` clone TOUT le dépôt (lourd) ; extraction dans un dépôt dédié possible pour des installs légères.

Hooks actifs (`.claude/settings.json`) :
- PostToolUse Edit/Write sur `apps/bot/src/{commands,events,guards}/` → auto `bun run gen:entries`.
- PreToolUse Edit/Write sur `apps/bot/src/lib/personas.ts` → warning intents critiques.
- PreToolUse Edit/Write sur `.env` → BLOQUÉ (exit 2).

Pour les tâches générales hors scope : `general-purpose` ou `Explore`.
