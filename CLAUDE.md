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
   **Aucune exception, y compris le build du site.** Le build a tourné sous Node du 2026-08-14 au 2026-08-21, sur l'hypothèse qu'il y consommait moins de mémoire ; la mesure l'a démentie (**~10,5 Gio de mémoire anonyme quel que soit le runtime**, morts par OOM sous Node comme sous Bun). Le seul facteur qui décide est `vm.swappiness`, que `scripts/ops/deploy-site.ts` relève déjà le temps du build. Le build est donc repassé sous Bun le 2026-08-21 : `bun node_modules/next/dist/bin/next build` — en passant le FICHIER à bun, qui est alors le runtime (le shebang `#!/usr/bin/env node` n'est pas consulté). **Ne pas ajouter `--bun`** : ce drapeau se propage aux process enfants via `NODE_OPTIONS`, et Turbopack lance un pool de process Node pour évaluer PostCSS — lesquels refusent de démarrer (`node: --bun is not allowed in NODE_OPTIONS`). Build mesuré : 386 s, pic mémoire bien en deçà des 10,5 Gio attendus.
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

## Site — transcriptions de databooks

Les 11 778 planches de `bot.db_databooks.pages` portent une transcription produite par un modèle de vision. **Mesuré le 2026-08-25 : 1 911 planches sont fautives** (+ 262 emplacements sans scan, dont 228 pour le seul Daizenshuu 1 qui annonce 233 pages). Le modèle n'a pas « mal lu » : il a **halluciné** — cyrillique/arabe au milieu du japonais (720), boucles jusqu'à la limite de sortie (411), faux chinois (154), sortie coupée en plein caractère UTF-8 (116).

| Outil | Rôle |
|---|---|
| `src/lib/databooks-defauts.ts` | **Juge unique** des défauts (`classerDefaut`, `noteQualite`). Module pur, importé par la file, le back-office, l'avertissement public et les tests. Toute nouvelle notion de « planche fautive » passe par là |
| `scripts/corrige-transcriptions-ocr.ts` | Corrections **déterministes** (fautes de lecture validées, titres collés, boucles). `--simulation` d'abord, `--appliquer` ensuite |
| `scripts/planches-a-relire.ts` | File de relecture `--compte` / `--classe <défaut>` : donne le chemin de l'image et la clé de dépôt |
| `scripts/depose-transcriptions.ts` | Dépôt JSONL `{"image":"<fiche>-<page>.jpg","text":{"kind":"text","markdown":"…"}}`, mode `merge`, une révision `wiki_revisions` par écriture (réversible) |
| `scripts/decoupe-planche.ts` | Découpe une planche en tuiles lisibles (chevauchement 4 %, agrandissement ×2) — indispensable pour relire du texte vertical en corps 6 |
| `scripts/meilleure-source-ocr.ts` | Repêche une meilleure version dans les 43 lots d'origine. **Résultat mesuré : 3 planches** — les passes successives avaient déjà déposé leur meilleur texte |
| `src/lib/ja/*` + `scripts/ja-*.ts` | Chaîne japonaise : lexique du domaine, détection d'anomalies, cohérence des allongements, appariement `name_ja`. **JMdict + kuromoji vivent hors dépôt** dans `apps/site/.ja-data/` (`scripts/ja-preparer.ts`) — sans eux, `lib/ja` signale les emprunts courants (`コミックス`, `バトル`) comme des fautes |
| `scripts/exporte-base-connaissance.ts` | Export autonome (33 Mo, `~/base-connaissance-dragon-ball`) pour un agent de relecture hors dépôt : dump du schéma `bot`, lexique japonais, graphies du corpus avec leur fréquence, 11 778 planches + verdict, OpenAPI/GraphQL/MCP, copie des modules de règles |

### Règles dures

1. **Aucun OCR japonais utilisable sur le VPS.** `aphrody` n'a plus de sous-commande `ocr`, il n'y a pas d'accès à un modèle de vision, et les lots d'origine viennent d'un poste Windows. La seule voie fiable est la **relecture à l'image**, planche par planche.
2. **Découper avant de lire.** Un scan entier est illisible sur le petit texte vertical ; `scripts/decoupe-planche.ts` (2×2, agrandissement ×2) rend lisible même un scan de 1 000 px. Compter ~1 planche dense par 1 à 2 échanges.
3. **Jamais deviné.** Sur un scan basse définition (certaines fiches ne font que 400 px de large), on transcrit les titres lisibles et **on s'arrête** : une transcription plausible mais inventée est pire que l'absence de texte.
4. **Le lecteur est prévenu.** `components/databooks/TranscriptionTexte.tsx` affiche un bandeau sur toute planche que `classerDefaut` juge mal lue — on ne fait pas passer une hallucination pour une source.
5. **La boucle ne se détecte pas en SQL.** Le back-reference `(.{4,40}?)\1{2,}` met **plus de 5 minutes** sur les 11 778 planches côté Postgres (mesuré). Le total du back-office (`databooks-transcription.ts`) ne compte donc que les trois signatures peu coûteuses ; la boucle est détectée côté relecteur, en JS.
6. **Les scripts de dépôt visent le slot bleu/vert en ligne** (`scripts/_origine-site.ts` lit l'amont nginx). Coder `127.0.0.1:3000` en dur les cassait dès que le trafic passait sur le slot B.
7. **Le lexique japonais est très inégal** : `name_ja` couvre 96 % des databooks, 59 % des personnages et **2 % des techniques** (17 sur 825). Une graphie absente du lexique n'est donc **pas** une faute. Le critère qui tranche est le rapport de fréquence : une faute de lecture est toujours **moins** attestée que la forme dont elle dérive (`パトル` 444 contre `バトル` 1 884), un mot réel ne l'est pas (`アビリティ` 798 contre `レアリティ` 178). Comparer sur `normaliserJa` : le lexique écrit `ミスター·ポポ` (U+00B7), le corpus `ミスター・ポポ` (U+30FB).

## Wiki — rédaction sur sources (manga + databooks)

Depuis le 2026-08-26, le contenu éditorial se rédige **exclusivement** sur les deux corpus hébergés en propre : les tomes du manga (`bot.db_manga_pages`, OCR français, séries `DB` tomes `vol1`…`vol42` et `DBS` indexée par identifiant de chapitre) et les planches transcrites des databooks (`bot.db_databooks.pages`, japonais). **Fandom est banni**, y compris indirectement : le contenu déjà en base n'est pas une source (227 personnages, 61 planètes, 22 sagas portent des `article_sources` qui le citent), il se remplace, il ne se prolonge pas.

| Outil | Rôle |
|---|---|
| `apps/site/scripts/sources-wiki.ts` | **Robinet unique** des sources : `manga` / `page` / `tome`, `databook` / `planche` / `databooks`, `fiche <table> <id>`, `cherche <table> "<nom>"` (la graphie de la base fait autorité). Les planches que `classerDefaut` juge hallucinées sont écartées d'office — `--avec-fautives` les montre, marquées |
| `apps/site/scripts/depose-wiki.ts` | Dépôt d'un `champ` ou d'une `section`, **simulation par défaut**, une révision `public.wiki_revisions` par écriture. Refuse les tournures non sourcées (« probablement », « sans doute »). Ne sait ni créer de ligne ni écrire `NULL` → SQL à la main pour ces deux cas |

### Règles dures

1. **Ne pas passer par le RAG pour rédiger.** Il mélange manga, databooks *et* Fandom : c'est le chemin le plus court pour réintroduire ce qu'on vient de bannir. Il reste bon pour chercher, pas pour sourcer.
2. **`db_techniques` et `db_transformations` sont des imports de jeux vidéo.** Mesuré : sur 825 techniques, 252 sans description, dont **240 sont des libellés Xenoverse/Dokkan** (« Pose de combat G », « Wild Sense ») — 23 seulement viennent du manga. Sur 81 transformations, 38 pointent des portraits `xv2-portraits`. Corollaire : avant d'enrichir une fiche, vérifier de quel support elle relève.
3. **Les colonnes de ces tables mentaient aussi.** `creator_id` valait 18 (Bardock) sur 66 lignes et 34 (Whis) sur 51 — deux imports rattachés en bloc au personnage moissonné, ce qui créditait le Kaméhaméha à Bardock. Purgés le 2026-08-26 (117 lignes, valeurs journalisées en révision avant retrait), ainsi que 18 `ki` de jeu (« 9 Trillion »). Il reste 11 `creator_id`, tous posés sur une phrase explicite de databook.
4. **Les databooks les plus utiles ne sont pas les plus gros** : Daizenshuu 4 (World Guide) pour les lieux et les peuples, Daizenshuu 7 (Daijiten) pour les définitions, Daizenshuu 2 (Story Guide) et *Super Exciting Guide* pour les arcs, Chōzenshū 3/4 pour les films et GT. Le Daizenshuu 6 est largement inexploitable (transcriptions fautives) là où le Chōzenshū 3 réédite le même contenu proprement.
5. **La VF traduit tout.** Chercher une technique par sa romanisation ne donne presque rien (« kamehameha » : 1 planche sur 7 830) — chercher la formule française des bulles. Et un OCR qui entrelace deux bulles ne se reconstruit pas : une lecture plausible est interdite au même titre qu'une invention.

## Wiki — versions de personnage par saga

`bot.db_character_variants` (PG-only, créée par `apps/bot/scripts/add-character-variants.ts`) porte **une ligne par couple (personnage, saga)** — « Goku, saga Namek ». Pas de fiche dupliquée dans `db_characters` : l'identité reste une, la fiche gagne une frise de ses états successifs (`components/wiki/CharacterSagaVariants.tsx`, panneau « Au fil des sagas »), et la page saga gagne sa liste de personnages (`getShenronSagaCharacters`). Une variante ne porte que ce qui **change** d'une saga à l'autre (apparence, forme, puissance, rôle, faits marquants) ; tout champ NULL retombe sur `db_characters` à l'affichage.

L'amorçage est **mesuré, pas écrit** : `apps/site/scripts/variantes-par-saga.ts --mesure` croise **deux corpus** avec les bornes de chaque saga (`--bornes` les pose en base) :

| Source | Corpus | Bornes sur `db_sagas` | Seuil |
|---|---|---|---|
| `ocr-manga` | `bot.db_manga_pages`, 7 830 planches des 42 tomes (série DB) | `manga_volume_start/end` (15 sagas) | ≥ 3 planches |
| `synopsis-episodes` | `bot.db_episodes.synopsis`, 636 résumés FR | `episode_series` + `episode_start/end` (25 sagas) | ≥ 2 résumés |

Résultat au 2026-08-25 : **149 personnages, 451 variantes** (164 par le manga seul, 176 par les synopsis seuls, 111 par les deux). Chaque ligne garde sa preuve (`evidence` : tomes, planches, épisodes, résumés, graphies cherchées) et sa méthode. `key_episodes` liste en plus les épisodes dont le **titre** nomme le personnage (« #5 Son Goku sacrifie sa vie ») — le seul contenu éditorial de la variante qui se mesure.

### Règles dures

1. **La base ne savait pas qui apparaît où.** `debut_saga_id` est renseigné pour 1 personnage sur 1 323, `db_character_arcs` compte 4 lignes, 36 épisodes sur 826 portent un arc. Toute liste « personnages de la saga X » écrite à la main recopie ce qu'on croit savoir — d'où la mesure.
2. **Le relevé prouve une citation, pas une apparition.** Un personnage mort est nommé pendant des tomes. L'UI le dit mot pour mot (« Une citation n'est pas une apparition ») ; ne jamais présenter le comptage comme un casting vérifié.
3. **`origin = 'editorial'` est un verrou.** Le script ne réécrit jamais une variante reprise à la main (`where origin is distinct from 'editorial'`). Corollaire : après avoir resserré les graphies, relancer avec `--reinitialiser --appliquer`, sinon les faux positifs de la passe précédente restent en base.
4. **`Number()` sur toute borne lue en base.** postgres-js rend les `bigint` en **chaînes** : `"9" <= "11"` est faux lexicographiquement (la saga du 22e Tenkaichi ne mesurait rien) et `"163" <= "35"` est vrai (la saga Saiyan récupérait des épisodes de la saga Boo). Le bug coûtait ~100 variantes et en fabriquait de fausses ; il ne se voit qu'en relisant une ligne au hasard.
5. **Ni les transformations ni les techniques ne se mesurent.** Leurs libellés en base viennent des jeux vidéo (« Goku SSJ2 », « Pose de combat G », « MMI ») et la VF du manga traduit tout : « kamehameha » n'apparaît que sur **1** planche des 7 830, « genkidama » sur 2. Mesuré avant de coder — ne pas retenter sans un lexique de graphies écrit à la main.
6. **Un nom qui est aussi un mot français n'est pas mesurable.** La fiche « Tard » remontait dans 10 sagas (« trois jours plus tard »), « Slump » dans 8 (notes de traduction et bio de l'auteur en fin de tome). Deux listes d'exclusion documentées dans le script (`MOTS_DU_RECIT`, `HORS_DRAGON_BALL`) ; ces personnages se saisissent à la main.
7. **L'anime n'est pas le manga.** Une variante `synopsis-episodes` seule atteste une présence dans l'adaptation, qui peut être du remplissage : l'UI le dit (« cette saga n'a pas de manga »). 8 sagas n'ont AUCUNE source mesurable — films (Broly, Super Hero), OAV (Bardock, Post-Buu) et manga-only de Super (Moro, Granolah, Black Freezer, Patrouille Galactique) : les planches `series='DBS'` sont indexées par identifiant interne de chapitre (`ch1315`…), pas par numéro publié.
8. **`db_characters` portait 16 doublons**, masqués le 2026-08-25 par `apps/site/scripts/doublons-personnages.ts` (« Son Goku » quand « Goku » existe, « Chichi »/« Chi-Chi », les huit Kaïo/Kaïo Shin…). Masquage via `visible = false`, **jamais** de suppression — `--demasquer` annule tout. Le juge est le **nom japonais** : identique ⇒ même personne quelles que soient les races saisies (`チチ` pour Chi-Chi/Chichi) ; différent ⇒ homonymes à laisser tranquilles (`マロン` l'ex-petite amie de Krilin ≠ `マーロン` sa fille — le piège classique). Sans nom japonais, deux races renseignées et différentes suffisent à écarter (`Abra` Neko Majin ≠ `Âbra` Démon). Reste **un** arbitrage humain : `11:Krillin` et `706:Krilin` ont chacun un article long et 4 sections — fusionner demande de les lire.

## Site — contribution communautaire au wiki (depuis le 2026-08-26)

Le wiki n'avait que deux extrêmes : le **signalement** en texte libre (`site_reports`, tout le travail reste au modérateur) et l'**édition directe** (`/api/wiki-admin`, réservée aux admins). Un membre qui repérait une erreur ne pouvait pas la corriger. `public.wiki_contributions` (migration `0009`, **appliquée en prod le 2026-08-26**) porte l'entre-deux : une proposition de **valeur exacte** sur un couple (table, ligne, colonne), relue puis appliquée.

| Fichier | Rôle |
|---|---|
| `lib/contributions-shared.ts` | **Client-safe** : `CONTRIBUTABLE_COLUMNS` (la liste étroite des colonnes proposables), bornes de saisie, regex des tournures non sourcées (miroir de `depose-wiki.ts`) |
| `lib/wiki-contributions.ts` | Server-only : dépôt, liste, acceptation/refus, palmarès. L'acceptation passe par `updateWiki` + `recordRevision` — **un seul chemin d'écriture** |
| `lib/wiki-chantiers.ts` | Mesure publique des fiches vides par rubrique (SQL brut, `Number()` sur les `count()`) — c'est ce qui donne envie de contribuer, pas l'invitation générale |
| `components/wiki/WikiEditBar.tsx` | Remplace `WikiAdminBar` sur les 9 fiches détail : un bouton public de contribution + les actions admin. `WikiAdminBar` reste un alias déprécié de `WikiAdminActions` |
| `components/wiki/WikiContribute.tsx` | Îlot client : modale, sélecteur de champ, garde-fou de tournure. Ne reçoit **pas** le texte de départ en prop |
| `components/wiki/MesContributions.tsx` | La boucle de retour : le contributeur lit la réponse du relecteur sur `/wiki/contribuer` |
| `app/admin/wiki/contributions/page.tsx` | Modération : diff par lignes, sources, accepter/refuser (note obligatoire au refus) |

### Règles dures

1. **Le crédit va au contributeur, pas au modérateur.** `recordRevision` est appelée avec `actor = { id: authorId, name: authorName }`. C'est ce qui fait que `/admin/wiki/history` dit la vérité sur qui a écrit le wiki — et que le revert existant annule une contribution sans code supplémentaire.
2. **`valueBefore` n'est pas décoratif.** Comparée à la valeur en base au moment d'appliquer : si elle a bougé, la contribution passe en `superseded` au lieu d'écraser le travail d'un autre. La comparaison normalise CRLF et blancs de bord, sinon un copier-coller depuis un navigateur passerait pour un conflit.
3. **La surface proposable est étroite à dessein** : du texte éditorial (`article`, `description`, `synopsis`, `body`, `nameJa`…), jamais une image, une clé étrangère, un `sortOrder` ni un `visible`. Élargir `CONTRIBUTABLE_COLUMNS`, c'est élargir la surface de dégât d'une acceptation trop rapide — le faire colonne par colonne. Un test vérifie que tout champ ouvert est réellement dans les `mutableColumns` d'au moins une table (sinon le bouton échouerait au premier clic).
4. **Le texte de départ se charge à l'ouverture** (`/api/wiki/contributions/value`), jamais en prop : un article pèse des dizaines de Ko (la charge RSC de chaque fiche doublerait) et une fiche servie en ISR peut être périmée — partir de là fabriquerait un conflit.
5. **Toute page sous `/wiki` hors registre est fermée** (`proxy.ts` → mode `admin` par défaut). `/wiki/contribuer` a donc son entrée `alwaysOpen` dans `LAUNCH_CATEGORIES` ; l'oublier rendait la page invisible à tout le monde sauf aux admins.
6. **On corrige là où l'on lit.** Chaque rubrique affichée porte son propre bouton, visant le texte réellement rendu : une section de `db_wiki_sections` s'édite ligne à ligne (`body`), une rubrique issue de l'article s'édite dans l'`article`. Corollaire non négociable : les pages qui rendent des panneaux passent `sansArticle` à `WikiEditBar`. Sur les **266 fiches personnage pilotées par `db_wiki_sections`, l'`article` n'est pas rendu du tout** (`buildWikiContentPanels` donne la priorité aux sections DB) — y proposer une correction d'article la ferait accepter sans rien changer à l'écran.
7. **`article` n'était éditable par personne** avant cette passe — absent de `mutableColumns`, donc ni le studio ni l'API ne l'écrivaient, seulement les scripts. Ajouté sur les 7 tables qui en portent un, et déclaré `isRichTextColumn` pour l'éditeur markdown.

## Site — module d'édition (`components/editor/`)

**Une seule surface de saisie pour tout le site** (depuis le 2026-08-24) : elle remplace les quatre éditeurs qui coexistaient (Tiptap des articles, CodeMirror des pages wiki, CodeMirror des fiches, `<textarea>` nus). Deux composants exposés :

- **`ShenronEditor`** — éditeur riche. `format="doc"` (JSON ProseMirror, articles) ou `format="markdown"` (wiki, sections CMS, home, fiches). Trois vues : **Édition** (mise en page réelle de la publication), **Source** (markdown + HTML, CodeMirror), **Aperçu** (le vrai rendu public, injecté via `renderPreview`).
- **`PlainField`** — texte simple (commentaires, signalements, avis, champs d'admin). **À importer directement** (`@/components/editor/PlainField`) hors de `/admin` : le point d'entrée `@/components/editor` tire l'éditeur riche et ses CSS, inutiles dans le paquet d'une page publique.

Architecture :

| Fichier | Rôle |
|---|---|
| `schema.ts` | `buildExtensions(preset)` — **client-safe**, partagé par l'éditeur, le rendu serveur des articles (`lib/posts.ts`) et le pont markdown. Presets : `article`, `wiki`, `section`, `comment`, `note` |
| `commands.ts` | Catalogue **unique** des actions (barre, menu « / », feuille mobile, barre de sélection). Une action ajoutée ici apparaît partout |
| `nodes/` | Nœuds de mise en page produisant **exactement** le balisage déjà stocké (`wiki-callout`, `wiki-cols`, `details.wiki-section`, `figure.wiki-size-*`, `ki-power`, `wiki-btn`, `wiki-embed`, `wiki-banner`, `wiki-grid`, `wiki-spacer`) + filets `htmlContainer`/`htmlBlock` |
| `markdown/` | `parseMarkdown` (marked → HTML → schéma Tiptap) et `serializeMarkdown` (document → markdown du wiki). `roundTripReport()` = garde-fou de fidélité |
| `ui/` | Barres (bureau/mobile), feuilles, dialogues, menu « / », barre d'état, vue source |
| `hooks/` | Autosauvegarde, upload, clavier virtuel |

### Règles dures du module

1. **Le wiki stocke du markdown, pas du JSON.** C'est ce que lisent `WikiMarkdown`, le RAG, les scripts d'ingest et les commandes Discord. `format="markdown"` sérialise à chaque frappe ; ne jamais basculer une table wiki en JSON ProseMirror.
2. **Ne jamais perdre le HTML écrit à la main.** Le sanitizer du wiki est volontairement ouvert (cf. mémoire `wiki-design-sanitizer`) : les pages contiennent du HTML libre. `htmlContainer` (conteneur inconnu → balise/classes/style conservés, contenu éditable) et `htmlBlock` (verbatim) sont ce qui rend l'édition riche sûre sur le contenu historique. Toute nouvelle balise supportée doit passer par un nœud dédié **avec sa sérialisation**, sinon elle sera avalée par un filet.
3. **Le schéma accepte tous les niveaux de titre**, le preset ne restreint que ceux **proposés** dans la barre : une page wiki historique commence souvent par `# Titre`, et un niveau absent du schéma serait aplati en paragraphe au premier enregistrement.
4. **Fidélité mesurée sur le rendu, pas sur les octets.** `roundTripReport()` compare le HTML produit (un `_italique_` réécrit `*italique*` n'est pas une perte ; un bloc évaporé, si). Avant de toucher au sérialiseur, rejouer le corpus réel (`bot.db_*`, `db_wiki_sections`) : la référence est **3 543/3 544 rendus identiques**.
5. **Marques contiguës regroupées** à la sérialisation. Traiter chaque fragment isolément produit `**gras***italique***gras**`, illisible pour tout parseur — cas fréquent (chapeaux en gras citant des titres en italique).
6. **Mobile d'abord** : barre d'outils en bas suivie par `visualViewport` (le clavier virtuel recouvre un `bottom: 0`), cibles 44 px, champs 16 px (en dessous, iOS zoome au focus).

### Autosauvegarde

Table `public.editor_drafts` (migration `0008_editor_drafts.sql`, **appliquée en prod le 2026-08-24**) + route `/api/editor/draft` (GET/PUT/POST/DELETE, session requise). Clé logique par document (`post:<id>`, `wiki:<table>:<ligne>:<colonne>`…), **un brouillon par utilisateur**. Copie locale immédiate en plus (survit à la perte de session et au mode hors ligne).

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
- **Modèles** : embeddings `Xenova/multilingual-e5-small` (384d, FR+JP) + reranker `Xenova/bge-reranker-base` (cross-encoder multilingue). Servis par le **sidecar `shenron-embed.service`** (port 5007, modèles chauds, RSS ~1.6G, sans plafond cgroup depuis le 2026-08-14) — le bot (1.5G) ne charge JAMAIS de modèle. Cache `apps/bot/.models` (gitignored). `apps/bot/src/lib/embeddings.ts` = heavy, importé seulement par le sidecar + `scripts/rag-build.ts`. Rerank cappé à 400 chars/passage (le cross-encoder tronque à 512 tokens ; 1.4s vs 4.8s), timeout 6s (`RAG_RERANK=0` pour désactiver).
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
- **Tables site (Postgres `public`)** : auth (`ba_*`), métier (`users`, `posts`), **brouillons d'édition `editor_drafts`** (autosauvegarde du module d'édition), **télémétrie `site_events` + `user_preferences`** (migration `apps/site/src/db/migrations/0000_*`, `out` = `src/db/migrations` ; le site utilisait `db:push` historiquement → appliquer la migration à la main). `bot.db_episodes` (Neon) a gagné `frames` (jsonb `EpisodeFrame[]`) + `scene_preview` pour les **scènes d'épisode** (extraction `scripts/{build-episode-scenes,extract-dbz-frames,scrape-dbz-fandom-frames}.ts` → ingest gardé `scripts/ingest-episode-frames.ts`).

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

**Vendorées dans le repo (source de vérité, plus `~/vps/`)** : units `deploy/systemd/shenron*.{service,timer}`, vhosts `deploy/nginx/{dragonballfr.com,bot.dragonballfr.com,mcp.dragonballfr.com,files.dragonballfr.com}.conf`, installeur idempotent `deploy/install.sh`. **Les vhosts legacy `bot.rpbey.fr.conf` / `shenron.conf` ont été supprimés le 2026-08-14** : `install.sh --nginx` les recopiait dans `conf.d/`, où ils cassaient `nginx -t` (upstream `shenron_api` dupliqué + certificat `bot.rpbey.fr` inexistant sur ce VPS) — donc plus aucun `reload` possible, y compris le renouvellement certbot. Scripts d'ops `scripts/{backup-shenron-sqlite,shenron-guild-sync,deploy-shenron}.sh`. Provisioning d'un hôte nu : `bash deploy/install.sh --nginx --start` (cf. `deploy/README.md`).

## Pièges critiques

- **DB site = PostgreSQL local VPS (depuis 2026-06-23), plus Neon** : base `shenron_site` sur `127.0.0.1:5432`, schémas `public` (site/auth/télémétrie) + `bot` (wiki). Driver inchangé (`postgres-js`). Runbook complet : [`docs/migration-postgres-local.md`](docs/migration-postgres-local.md). Pièges spécifiques : (1) `drizzle-kit migrate` **plante silencieusement (exit 1) sous Bun** → `push` fonctionne ; le schéma `public` complet vient de `push` (les 9 tables de base n'ont pas de SQL de migration). (2) Les colonnes **Neon-only** (`db_episodes/db_movies.players`, `db_manga_chapters.pages`, `frames`, `stream_*`, `subtitles`) sont **jsonb absentes du SQLite** → le seed les laisse NULL, re-dérivées par `import-voiranime-players*.ts` (dataset bxc) et `reconstruct-manga-pages-from-disk.ts` (relit `assets/manga/<série>/ch<id>/*.webp`). (3) **`public.*` perdu** (sessions/posts/tierlists/télémétrie) car Neon était inaccessible au moment de la migration (quota) → repartis à neuf ; backfill possible quand le quota Neon se réinitialise (ancienne URL Neon en commentaire dans les 2 `.env`). (4) **Ordre de réactivation des syncs** : couper `shenron-neon-{sync,pull}.timer` AVANT de toucher la DB (le reverse-sync DELETE+INSERT pourrait vider le SQLite — source de re-seed) ; ne les ré-enable qu'après seed PG complet.
- **DI tsyringe + `import type`** : casse `Reflect.metadata("design:paramtypes")`. Toujours `import { Class }` (sans `type`) pour les classes injectées.
- **Bun parse `$VAR` dans `.env`** : substitue les vars shell. Escape avec `\$` (les quotes simples ne protègent PAS).
- **Multi-process Better Auth (bot ≠ site)** : changer le schéma `ba_*` côté site n'affecte pas le bot et inversement. Toujours migrer les deux si on touche les tables auth communes.
- **Catalog versions** : `bun install` au root recalcule pour tous les workspaces. Modifier `package.json#workspaces.catalog` puis `bun install` au root.
- **`apps/bot/data/bot.db`** : never commit. Gitignored. La perte du fichier = perte de toute la data runtime (cf. recovery commits `8d9fc49` / `eb99aae`). Backups timer obligatoire.
- **Personas tokens** : 6 tokens distincts requis pour démarrer. Si un seul manque, le bot crash au boot.
- **`_entries.ts` désynchro** : si on ajoute une commande sans regénérer, elle ne sera pas chargée. Ajouter `bun run gen:entries` au pre-commit ou CI.
- **Pas de plafond mémoire sur les units** (directive du 2026-08-14) : plus aucun `MemoryMax`/`MemoryHigh` dans `deploy/systemd/` hors `filebrowser`. `OOMScoreAdjust` et `MemoryLow` restent. Conséquence à connaître : la branche « mémoire ≥90 % de `MemoryMax` » de `scripts/watchdog.sh` ne se déclenche donc plus jamais sur `shenron`/`shenron-site` — elle log « indisponible, check sauté ». Le bot reste sensible (canvas + 6 clients Discord) : surveiller `peak`.
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
- **jsonb (tout écrivain postgres-js)** : écrire avec `sql.json(value)`, JAMAIS `${JSON.stringify(value)}::jsonb` — le driver type le paramètre d'après le cast et ré-encode la chaîne, donc la colonne reçoit un **scalaire string** (`jsonb_typeof` rend `string`, `jsonb_array_length` échoue). Vu sur `db_episodes.players`, puis re-vécu le 2026-08-26 sur `article_sources` **et** sur `wiki_revisions.before/after` — ce second cas casse silencieusement le revert de `/admin/wiki/history`, qui relit un objet. Réparation en place : `set col = (col #>> '{}')::jsonb where jsonb_typeof(col) = 'string'`. Les types de postgres-js refusent un **tableau** dans `sql.json()` alors que le driver le sérialise très bien : passer par un helper qui caste (cf. `apps/site/scripts/depose-wiki.ts`).
- **Lecteurs épisode (`/wiki/episodes/[id]`)** : priorité `players` (lecteurs voir-anime VF/VOSTFR, iframes via `EpisodeLecteurs`) > `video_url` > `stream_url` > image. `video_url`/`stream_url` ont contenu un flux de test (mux.dev) / tokens HLS périmés → ne pas les remettre en tête. VF importée par `apps/bot/scripts/import-voiranime-players-vf.ts` (dataset bxc `dragon-ball-full.json`).
- **Captures / mesures visuelles & perf** : le plus simple = `chromium --headless --no-sandbox --hide-scrollbars --window-size=1440,900 --screenshot=/tmp/x.png <url>` (binaire `/usr/local/bin/chromium`, aucun dep). Pour du scripté : `bun add playwright-core` dans `/tmp/pw` + `chromium.launch({ executablePath: "/usr/local/bin/chromium" })` via `bun`. Test live anti-404 : `bun test apps/site/tests/no-404.test.ts`, hors CI (flaky).
- **Bot API qui se fige (lock SQLite)** : une op DB ad-hoc sur `apps/bot/data/bot.db` pendant que le bot tourne (`drizzle-kit migrate`/`generate`, `ALTER`, smoke d'un script qui lit la DB) peut laisser les handlers HTTP `Bun.serve` **bloqués** → `/health` répond `000` alors que le port `:5006` **écoute** et que systemd dit `active`. Fix : `sudo systemctl restart shenron` (relâche le lock + recharge le schéma TS). Vu en posant `db_episodes.{frames,scene_preview}`.
- **`EpisodeFrame` = type riche** : source de vérité `apps/bot/src/db/episode-frames.ts` (`imagePath`/`isNotable`/`characterNames`/`caption`/`tags`/`timecodeSec`/`sortOrder`…), écrit en jsonb sur `bot.db_episodes.frames`. Le site **duplique** ce type (pas d'import cross-app) dans `src/db/bot-schema.ts` — garder les deux alignés (`imagePath` PAS `path` ; `isNotable` PAS `notable`).
- **Télémétrie : tables avant deploy** : `site_events`/`user_preferences` doivent exister sur le Postgres du site AVANT de pousser le code d'ingest (sinon `POST /api/telemetry` insert → erreur). Appliquée à la main : `vercel env pull apps/site/.env.local --environment=production` → exécuter le `.sql` via postgres-js → supprimer le `.env.local` (secrets).
- **bxc (crawl)** = toolchain externe `/home/ubuntu/bxc` (`BXC_DIR`), invoquée en sous-process. v0.5.4 : `bxc scrape` sort du **JSON**, profils `static|fast|http|stealth|max` (`ghost` supprimé). `dragonball.news`/`bandai` fragiles depuis le VPS (cert expiré + IP datacenter filtrée) → proxy résidentiel pour un ingest fiable.
- **Scroll-driven CSS : jamais de borne `cover` sur un conteneur haut** : `animation-range: entry 0% cover 30%` mesure « hauteur de l'élément + hauteur du viewport ». Posé sur le `<div>` racine d'une page longue (`/wiki/databooks`, ~25 000 px), le fondu de `.reveal-up` restait bloqué à ~11 % d'opacité — un voile noir sur toute la page, d'autant plus sombre que la liste est longue. Borner sur `entry` (plafonné par le viewport) et ne jamais révéler un conteneur de page : il est déjà à l'écran au chargement.
- **Le thème est en base, pas dans le code** : `/admin/design` injecte les `--dbz-*` en ligne. En prod `--dbz-orange` vaut **`#246dff` (bleu)** et `--dbz-red` `#6600ff` : un `text-dbz-orange` sort bleu, à côté d'éléments restés orange (`dbz-ember`, `title-gold`, bouton Discord). Vérifier avec `curl -s <url> | grep -o -- '--dbz-[a-z-]*:[^;"]*'` avant de conclure à un bug de couleur.
- **`bun site:dev` prend le port 3000 = un slot du bleu/vert** : lire `/etc/nginx/shenron-upstreams/shenron_site.conf` pour savoir quel slot sert (A `:3000` / B `:3010`) et lancer le dev ailleurs. Au passage, `next dev` **réécrit `apps/site/tsconfig.json`** → `git checkout -- apps/site/tsconfig.json` après.
- **`_next/image` n'accepte que `q=70`** (`qualities: [70]` dans `next.config.ts`) : un `curl` de contrôle avec `q=75` rend **400** et fait croire à une image cassée. Largeurs valides : 640/828/1080/1200/1920.
- **`apps/site/.env` porte DEUX `DATABASE_URL`** (l'ancienne Neon, en commentaire, placée AVANT la locale) : `grep … | head -1` tape la base morte. Ancrer `^DATABASE_URL=` et prendre la **dernière**.
- **`bun run type-check` couvre `apps/site/scripts/`** (via `tsconfig.tests.json`) : un brouillon `_tmp-*.ts` oublié dans le dossier casse le type-check de tout le monde. Écrire les brouillons hors du dépôt.
- **Avant un déploiement, libérer la RAM pour de vrai** : le garde-fou de `deploy-site.ts` raisonne sur RAM+swap, mais ce qui tue est la RAM **libre à l'instant t**. Build tué en OOM à 7,3 Gio le 2026-08-25 avec 2 Gio libres — un serveur de dev, des captures Chromium et le `crawl-worker` bxc tournaient encore. `ps -eo rss,args --sort=-rss | head` puis relancer.
- **Build du site = ~10,5 Gio de mémoire anonyme, et `vm.swappiness` décide de tout** : sur ce VPS de 11 Gio, `next build` (~850 pages SSG) demande **~10,5 Gio** — mesuré identique sous Bun et sous Node (le build tourne sous Bun depuis le 2026-08-21), à froid comme en incrémental, avec ou sans `output: standalone`. Il ne passe que si le noyau accepte d'évacuer vers le swap : **swappiness 100 → build OK ; swappiness 60 → tué par l'OOM killer à 10,2-10,5 Gio** (3 échecs consécutifs le 2026-08-14). `scripts/ops/deploy-site.ts` relève donc la swappiness le temps du build et la restaure ensuite (une swappiness haute en permanence dégrade la latence des services). Corollaire : garder du swap (≥12 Gio) et **ne pas conclure trop vite d'une RSS observée** — une RSS de 8 Gio pendant que le noyau swappe n'est pas la demande réelle.
- **Un import qui traverse les couches peut tuer le build** : `wiki-panels.tsx` (module de rendu importé par ~1 400 pages statiques) a importé `wiki-revalidate` pour six lignes de correspondance `entityType → table`. Ce module tire `next/cache` **et tout `wiki-admin`** (Drizzle + specs de toutes les tables) : **deux builds consécutifs morts en OOM (code 137) pendant la phase de compilation Turbopack**, pas pendant la génération statique — le journal s'arrête à « Creating an optimized production build ». Après avoir recopié les six lignes sur place, le build est repassé en 6 min. Symptôme à reconnaître : un OOM qui survient AVANT toute page générée pointe le graphe de modules, pas la mémoire de la machine — chercher ce qui vient d'être importé dans un module largement partagé, pas de la RAM à libérer.
- **Vider les tmpfs AVANT de builder — `/tmp` est de la RAM** : `/tmp` et `/dev/shm` sont des tmpfs de 5,7 Gio chacun ; tout ce qui y traîne est autant de mémoire en moins pour un build qui en réclame déjà 10,5 sur 11. Ces pages n'apparaissent pas dans `MemAvailable` (non récupérables) et doivent elles-mêmes migrer en swap sous pression : elles mangent **les deux termes du budget à la fois**. Vécu le 2026-08-23 — 1,2 Gio dormaient dans `/tmp` (transcripts d'agents + un `node_modules` de banc d'essai `onnxruntime-node`), le build est mort en OOM à 8 Gio alors que le garde-fou annonçait 22 799 Mio disponibles ; après ménage, il est passé. `checkMemory()` déduit désormais `Shmem` du budget, détaille l'occupation des tmpfs au-dessus de 256 Mio, et **exige un plancher de 2 Gio de RAM libre** — un budget composé à 80 % de swap ne protège de rien, puisque ce qui tue est le manque de mémoire libre à l'instant t (`order=1`), pas le volume total. Soupape si le build OOM malgré tout : `BUILD_CPUS=2 BUILD_STATIC_CONCURRENCY=4 bash scripts/deploy-site.sh` réduit le parallélisme de la génération statique (4 workers × 8 pages par défaut) — **mesurée le 2026-08-24 : elle ne sauve rien**. Avec 3,1 Gio de tmpfs occupés, le build est mort en OOM aux deux essais (6,9 puis 9,2 Gio d'anon-rss), parallélisme réduit compris ; en vidant les tmpfs (2,6 Gio de staging déplacés sur disque, RAM libre 3,1 → 6,4 Gio), le build par défaut est passé en 350 s. Le levier est la mémoire libre, pas le nombre de workers.
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
   Site : `bash scripts/deploy-site.sh [--pull]` (build + bascule bleu/vert + sondes + rollback). **Pas d'auto-deploy** : pousser sur `main` ne déploie rien depuis la sortie de Vercel.
6. Vérifier `journalctl -u shenron -n 50` (bot) ou `journalctl -u shenron-site -n 50` (site).

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
