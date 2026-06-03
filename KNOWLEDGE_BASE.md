# 📚 Base de Connaissance Unifiée — 04/06/2026

> Ce fichier regroupe toute la documentation du projet pour faciliter le contexte et l'analyse.

## 🤖 Capacités & Agents

### 🛠 Skills & Compétences


### 🕵️ Agents Spécialisés


---

## 🗂 Sommaire

- [This is NOT the Next.js you know](#agents-md)
- [Changelog](#changelog-md)
- [CLAUDE.md — shenron](#claude-md)
- [Déploiement de Shenron](#deploy-md)
- [DESIGN.md — Système graphique DBFR](#design-md)
- [GEMINI.md](#gemini-md)
- [Shenron Monorepo — Learning Memory](#memory-md)
- [PLAN.md — RAG canon (bxc) + LLM Dragon Ball (aphrody)](#plan-md)
- [PROMPT.md — Sprint DBFR (Shenron bot + site public)](#prompt-md)
- [1. Bun ≥ 1.3](#readme-md)
- [Politique de sécurité](#security-md)
- [Recon report — https://anilist.co/](#apps-bot-data-rag-anilist-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball](#apps-bot-data-rag-bandai-eu-md)
- [Recon report — https://en.dragon-ball-official.com/](#apps-bot-data-rag-dbofficial-en-md)
- [Recon report — https://fr.dragon-ball-official.com/](#apps-bot-data-rag-dbofficial-fr-md)
- [Recon report — https://jikan.moe/](#apps-bot-data-rag-jikan-md)
- [Recon report — https://kanzenshuu.com/](#apps-bot-data-rag-kanzenshuu-md)
- [Recon report — https://kitsu.io/](#apps-bot-data-rag-kitsu-md)
- [Recon report — https://shonenjumpplus.com/](#apps-bot-data-rag-shonenjump-plus-md)
- [Recon report — https://www.shueisha.co.jp/](#apps-bot-data-rag-shueisha-md)
- [Recon report — https://www.toei-animation.com/catalog/dragon-ball/](#apps-bot-data-rag-toei-animation-md)
- [Recon report — https://www.viz.com/shonenjump/chapters/dragon-ball-super](#apps-bot-data-rag-viz-media-md)
- [Recon report — https://en.wikipedia.org/wiki/Dragon_Ball](#apps-bot-data-rag-wiki-db-md)
- [Recon report — https://en.wikipedia.org/wiki/Dragon_Ball_Super](#apps-bot-data-rag-wiki-dbsuper-md)
- [Recon report — https://en.wikipedia.org/wiki/Dragon_Ball_Z](#apps-bot-data-rag-wiki-dbz-md)
- [This is NOT the Next.js you know](#apps-site-agents-md)
- [CLAUDE.md](#apps-site-claude-md)
- [or](#apps-site-readme-md)
- [deploy/ — provisioning self-contained du monorepo](#deploy-readme-md)
- [🐉 Rapport d'Expansion de la Base de Données Dragon Ball](#docs-archive-db_expansion_report-md)
- [Recon report — https://fr.dragon-ball-official.com/](#docs-archive-dbo_fr-md)
- [Recon report — https://dragonball.fandom.com/fr/wiki/Wiki_Dragon_Ball](#docs-archive-fandom_fr-md)
- [Recon report — https://fr.dragon-ball-official.com/news/](#docs-archive-news-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero](#docs-archive-sparking-fast-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero](#docs-archive-sparking-md)
- [@discordx/di](#packages-di-changelog-md)
- [@rpbey/di](#packages-di-readme-md)
- [Security Policy](#packages-di-security-md)
- [discordx](#packages-discordy-changelog-md)
- [@rpbey/discordy](#packages-discordy-readme-md)
- [Security Policy](#packages-discordy-security-md)
- [@discordx/importer](#packages-importer-changelog-md)
- [@rpbey/importer](#packages-importer-readme-md)
- [Security Policy](#packages-importer-security-md)
- [@discordx/internal](#packages-internal-changelog-md)
- [@rpbey/internal](#packages-internal-readme-md)
- [Security Policy](#packages-internal-security-md)
- [@discordx/pagination](#packages-pagination-changelog-md)
- [@rpbey/pagination](#packages-pagination-readme-md)
- [Security Policy](#packages-pagination-security-md)

---

<a name="agents-md"></a>
## 📄 Fichier : `AGENTS.md`

**Titre original :** This is NOT the Next.js you know

<!-- BEGIN:nextjs-agent-rules -->
### This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- Project note (outside the managed block): the Next.js app is `apps/site`.
     `next` is hoisted to the repo-root `node_modules/`, so the docs path above is
     correct when working from the repo root. See `apps/site/AGENTS.md` and
     `CLAUDE.md`. -->


---

<a name="changelog-md"></a>
## 📄 Fichier : `CHANGELOG.md`

**Titre original :** Changelog

### Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).
Versionnement : date + courte description.

## [Unreleased] — 2026-06-02

### Changed

- **Next.js bumpé `16.3.0-canary.21` → `.37`** (catalog racine + override + `@next/env`) — doctrine nightly. Type-check, lint, `next build` et déploiement prod verts.

### Fixed

- **`better-auth` épinglé exact `1.6.11`** (catalog) — `@better-auth/kysely-adapter@1.6.13` importe `DEFAULT_MIGRATION_TABLE`, absent de `kysely@0.29.2` → casse le build Turbopack du site (Vercel re-résout `^1.6.11` vers la version cassée). Pin exact = résolution déterministe (1.6.11 verrouille lui-même `kysely@^0.28.17`).

### Ops

- **Open-source** — `aphrody-code/shenron` passé **public** (2026-06-02). Ajout `LICENSE` (**Apache-2.0**) + `SECURITY.md` racine ; README/CLAUDE.md alignés (badge, rationale deploy Vercel).
- **Historique git purgé de toute PII** — `git-filter-repo` sur **toutes les branches + refs PR** : suppression des dumps SQLite (`*.db`/`*.sqlite`, dont un backup de 5860 membres), `apps/bot/data/guild-scan.json` (scan de 5764 membres Discord), `.recovery-checkpoint.json`. `.gitignore` durci (`*.db`/`*.sqlite*` global + exports runtime). Audit : aucun secret/token n'était commité. `fr-episode-titles.json` (donnée publique) conservé.
- **Sync Neon↔SQLite rétablie** — timers `shenron-neon-sync.timer` (forward runtime+news, 30 min) + `shenron-neon-pull.timer` (reverse wiki éditorial, 15 min) réinstallés/activés + env `~/.shenron-neon.env` recréé (600). Resync forward vérifié (23 tables, 9146 lignes, 0 mismatch) ; wiki déjà aligné.

## [Unreleased] — 2026-06-01

### Added

- **RAG SOTA — récupération hybride + reranking** (`apps/bot/src/lib/{embeddings,rag}.ts`, `apps/bot/embed-server.ts`) — passage du FTS5 keyword pur à un pipeline 2 étages 100 % local, FR+JP : étage 1 = récupération **hybride** BM25 (`rag_chunks` FTS5) + embeddings denses multilingues (`rag_vectors`, modèle `Xenova/multilingual-e5-small` 384d, cosinus exact brute-force) fusionnés en **RRF** (k=60) ; étage 2 = **reranking cross-encoder** (`Xenova/bge-reranker-base`) du top-15. Sidecar dédié `shenron-embed.service` (port 5007 loopback, 2 modèles chauds, `MemoryMax=3G`) — `embeddings.ts` (heavy) n'est **jamais** importé par le bundle bot, `rag.ts` (runtime léger) fetch HTTP vers le sidecar. Build offline : `bun --filter @shenron/bot run rag:build` (override `RAG_DB=/path` pour tester sur copie). Dégradation gracieuse 3 niveaux (`mode` ∈ `hybrid+rerank | hybrid | lexical`). Consommateurs : `/api/public/rag/search` (REST), `ragSearch` (GraphQL), commande Discord `/ask`, recherche du site (`dbUniverse.rag`).
- **API GraphQL publique read-only** (`apps/bot/src/api/graphql.ts`) — endpoint `/graphql` sur le `Bun.serve` du bot, code-first **Pothos** + **graphql-yoga**, GraphiQL activé, CORS public, garde-fou profondeur max 10. Expose le wiki (`characters`/`planets`/`sagas`/`episodes`/`techniques`/`transformations`/`movies`/`games`/`races`) + relations + `ragSearch` (RAG hybride) + `counts`. Deps : `graphql@16 graphql-yoga@5 @pothos/core@4`.
- **OpenAPI 3.1 + UI Scalar** (`apps/bot/src/api/openapi.ts`) — spec statique servie à `/api/openapi.json` (CORS public, cache 1 h) et UI interactive **Scalar** à `/api/docs` (CDN, zéro dep). Couvre la surface REST publique (RAG / Wiki / Insights / Médias).
- **Commande Discord `/ask`** (`apps/bot/src/commands/wiki/Ask.ts`, persona Whis) — question FR en langage naturel → RAG hybride+rerank → embed sourcé (résultats classés, `kind` iconifié, snippets, liens vers le site) + bouton **« Ouvrir le meilleur résultat »**. Dégradation gracieuse.
- **Site — animations cinématiques** (`apps/site/src/components/ViewTransition.tsx`, `app/globals.css`, `next.config.ts`) — **View Transitions API** (morph d'élément partagé grille→fiche personnages/planètes, slides directionnels nav-forward/back via `ViewTransition` isomorphe + `experimental.viewTransition: true`), scroll-driven animations CSS natives (`animation-timeline: view()` reveal staggeré), ki-glow au survol (`@property --ki-angle`), hero ken-burns enrichi + wordmark glow. `prefers-reduced-motion` respecté, cache CDN préservé (pages Static/SSG), zéro framer-motion (motion / CSS natif).

## [Unreleased] — 2026-05-31

### Added

- **Home cinématique full-page « Codex Shenron »** (`apps/site/src/components/home/*`, `app/page.tsx`) — réécriture complète de la home en 7 panneaux plein écran scroll-snap (navigation molette + clavier + tactile), fonds animés des meilleures scènes DB (ken-burns + grade d'ère + grain + aura ki + letterbox), et état **réel + live** du bot (SSR + poll 25 s + SSE `a2a/events` → power-levels animés, gardiens en ligne, flux d'événements). Réutilise `motion` / CSS natif (`animation-timeline: view()`), zéro framer-motion.
- **Scènes d'épisode** (end-to-end) — colonnes `db_episodes.frames` (jsonb `EpisodeFrame[]`) + `scene_preview` ; extraction `scripts/extract-dbz-frames.ts` (ffmpeg vidéo locale) et `scripts/scrape-dbz-fandom-frames.ts` (API MediaWiki, méthode rpbey) ; orchestrateur `scripts/build-episode-scenes.ts` (frames + `preview.mp4`) ; ingest Neon gardé `scripts/ingest-episode-frames.ts` ; affichage wiki (`/wiki/episodes/[id]` : hero `AnimatedMedia` + galerie + export GIF).
- **Composants média site** (`apps/site/src/components/media/*`) — `AnimatedMedia` (video/gif lazy a11y), `BackgroundImage`/`HeroBackground` (next/image fill, variantes kenburns/parallax CSS), `encodeGif` (`modern-gif`, frames→GIF browser).
- **Télémétrie first-party RGPD** (`apps/site/src/lib/{telemetry,consent,recommendations}.ts`, `app/api/telemetry`, `components/{ConsentGate,TrackView}`) — `track()` typé fan-out **Vercel Analytics + GTM dataLayer + Postgres** (tables `site_events`/`user_preferences`), anonymisation (hash salé, anonId httpOnly), **Google Consent Mode v2**, fondation recommandations/personnalisation (co-vues + affinité + populaire).
- **Google Tag Manager** (`GTM-KLSS5787`) via `@next/third-parties/google` + `<noscript>`.
- **Pages wiki dédiées Personnages + Planètes** (`app/wiki/personnages`, `app/wiki/planetes`) — index manquants jusqu'ici (persos/planètes browsables uniquement via le fourre-tout `/wiki/dragon-ball`). `CharacterGrid` client (`components/wiki/`) : grille filtrable recherche + facettes par race, compteur live. Routes détail inchangées sous `/wiki/dragon-ball/{character,planet}/…`.
- **`lib/config.ts` — source unique des URL/API du site** (client-safe) : `API_URL` (API bot), `ASSET_BASE` (assets bot), `SITE_URL`, `DISCORD_INVITE` + helpers `apiUrl()`/`assetBaseUrl()`. `dbUniverse.counts()` (un round-trip groupé) pour les comptes réels du wiki.

### Changed

- **bxc crawl bumpé sur 0.5.4** — `scripts/ingest/bxc-ingest.ts` réécrit (sortie `bxc scrape` = JSON), `BXC_DIR`/`BXC_PROFILE` env, profils `static|fast|http|stealth|max` (le profil `ghost` n'existe plus).
- **Home recadrée « Voyage à travers l'univers Dragon Ball »** — narratif d'exploration centré contenu ; le mot « wiki » retiré de toute la vitrine (héro, summon, rôle Whis, description SEO globale, 404). CTA « Commencer le voyage », panneau univers titré « Voyage à travers l'univers ».
- **Hub `/wiki` à comptes dynamiques** — les ~9 nombres codés en dur (« 58 personnages », « 25 films »…) remplacés par `dbUniverse.counts()` (Neon réel) → plus de désynchro quand la DB grossit. Copies landing/metadata rendues evergreen.
- **Unification URL/API du site** — ~14 défauts `https://bot.dragonballfr.com`, ~9 littéraux `discord.gg/dbfr` et l'URL site, dispersés dans ~27 fichiers → collapsés sur `lib/config.ts`. Future migration de domaine = 2 env vars au lieu de 27 fichiers. `auth*` / allowlist télémétrie / branding OG volontairement épargnés ; bot (producteur unique d'API) non concerné.

### Fixed

- **`/wiki/dragon-ball` → 308 dur** via `next.config` `redirects()` vers `/wiki/personnages` (un `permanentRedirect()` en composant dégradait en page 200 + `<meta refresh>` à cause du streaming du layout `/wiki`). Fourre-tout « Encyclopédie » (doublon de Films/Jeux) supprimé.
- **FAB Discord invite cassée** — `DiscordInviteFAB` retombait sur `https://discord.gg/votre_invite_ici` si `NEXT_PUBLIC_DISCORD_INVITE_URL` absent → désormais `DISCORD_INVITE` (défaut `discord.gg/dbfr`).

### Ops

- **`ops(domaine)` : migration prod vers `dragonballfr.com`** — le site bascule sur `https://dragonballfr.com` (canonical, OG, liens publics) et l'API/assets du bot sur `https://bot.dragonballfr.com`. Les alias historiques `rpbey.fr` / `dbfr.vercel.app` (site) et `bot.rpbey.fr` (API) restent conservés (redirections / origines de confiance), mais ne sont plus le domaine de référence.
- **Infra dragonballfr.com** — vhost VPS `deploy/nginx/bot.dragonballfr.com.conf` (proxy `:5006` + cache CDN long sur `/assets/`), cert Let's Encrypt `bot.dragonballfr.com`, DNS OVH (apex/www → Vercel, `bot` → VPS), env Vercel (`BETTER_AUTH_URL`/`SHENRON_API_URL`/`NEXT_PUBLIC_SHENRON_API_URL`). Compte OVH `gl839461-ovh`.
- **Schémas** — colonnes Neon `bot.db_episodes.{frames,scene_preview}` ; tables Postgres site `site_events` + `user_preferences` (migration `apps/site/src/db/migrations/0000_*`, appliquée).
- **Discord OAuth** — redirect URIs à déclarer côté portail pour `dragonballfr.com`/`bot.dragonballfr.com` (app `1497194276025663680`).

## [Unreleased] — 2026-04-25

### Added

- **API REST (`Bun.serve`) tscord-compatible** — surface alignée sur les controllers de [`@rpbey/tscord`](../../packages/tscord/), permet à un fork de [`barthofu/tscord-dashboard`](https://github.com/barthofu/tscord-dashboard) de piloter shenron. Bind `127.0.0.1:5006` par défaut, auth Bearer (`API_ADMIN_TOKEN`).
  - **Health** : `/health/{check,latency}` (public) + `/health/{usage,host,monitoring,logs}` (admin)
  - **Stats** : `/stats/totals` (users/guilds/commands), `/stats/interaction/last`, `/stats/guilds/last`
  - **Bot** : `/bot/guilds`, `/bot/commands`, `/bot/commands/:name` (full schema avec options/choices)
  - **Cron** (`CronRegistry` centralisé, registres `voice-xp-tick`, `jail-expiry`, `bio-role-scan`) : `GET /cron` (last/next run, durée, erreurs) · `POST /cron/:name/trigger` (déclenchement manuel)
  - **Services** : `GET /services` (list whitelist) · `POST /services/:service/:action` (achievements.refresh, economy.addZeni, level.addXP, settings.set, translate.probe, moderation.countWarns, wiki.search…)
  - **Database CRUD générique** sur 16 tables whitelist : `GET /database/tables` · `GET /database/:table?limit&offset` · `GET/PUT/DELETE /database/:table/:id` · `POST /database/:table`. `mutableColumns` par table pour empêcher l'édition de colonnes sensibles.
  - **OpenAPI 3.0.1** auto-généré sur `/openapi`.
- **`StatsService`** — équivalent du `Stats` service tscord, sans deps `pidusage`/`node-os-utils` (lit `process.memoryUsage`/`process.cpuUsage` + `node:os` natifs).
- **`CronRegistry`** — singleton qui collecte les `setInterval` des events (VoiceXP, JailExpiry, BioRole) et expose `lastRunAt`, `lastDurationMs`, `runCount`, `lastError`, `nextRunAt`.
- **`ApiServer`** — Bun.serve natif avec `routes` Map, params `:name`/`:id` typés, error handler global, `Response.json` + `req.json()` web-standard. Lance dans `clientReady` après `boot-audit`.
- **`/translate`** — OCR d'image + traduction VF (ou EN/ES/DE/IT/JA), 100 % FOSS via **Tesseract** (Apache 2.0, `Bun.spawn` stdin) + **LibreTranslate** (AGPL-3.0, Docker self-host). Slash command **et** menu contextuel **"Traduire en VF"** (clic droit message → Apps). Hard caps prod : image ≤ 10 MiB, timeout tesseract 30 s, timeout LibreTranslate 8 s, garde SSRF (refuse `file://`, IPs privées, `localhost`). Probe au boot dans `boot-audit.ts` — la commande devient inactive avec message d'erreur explicite si l'un des deux est down.
- **`/config`** — slash group admin (dashboard MVP) : `/config list/set/unset` pour les overrides runtime (XP rates, cooldowns, salons), `/config channel <type> <salon>`, `/config level-reward-set/-remove/-rewards`. Persisté en table `guild_settings` (key/value, cache 30 s) → override les constantes hardcodées sans redéploiement. Vérifie la **hiérarchie de rôles** sur `level-reward-set` (refuse si rôle ≥ rôle bot).
- **Challenge buttons** — nouveau `src/lib/challenge.ts` (helper Accept/Decline réutilisable, customId `challenge:<scope>:<action>:<key>`). Câblé dans `/pendu joueur` et `/morpion joueur` : message de défi avec boutons **✅ Accepter** / **❌ Refuser** (timeout 60 s). La partie ne démarre qu'après acceptation explicite de l'adversaire.
- **`/pendu` amélioré** — embed avec **nombre de lettres** affiché, lettres trouvées vs ratées triées (`Array.toSorted`), 7 frames ASCII du pendu (0→6 erreurs), mot révélé en `||spoiler||` à la défaite.
- **`/morpion` amélioré** — embed dynamique, IA défensive (gagner > bloquer > centre > coin > random), ligne gagnante surlignée en vert.
- **Texte double-police** — nouveau `canvas-kit.ts::textDoubleFont` qui superpose deux polices avec offset/blur (Saiyan Sans glow + Inter Display Black net) pour effet relief DBZ. Appliqué au pseudo de `/scan` et au titre des gauges `/gay` / `/raciste`.
- **Salon des accomplissements séparé** — nouvelle var `ACHIEVEMENT_CHANNEL_ID` + `resolveAchievementChannel` (retombe sur `ANNOUNCE_CHANNEL_ID` si absent). Notifs 🏆 envoyées en `EmbedBuilder` brand au lieu de plain text.
- **Helpers embed** — `src/lib/embeds.ts` (`brandedEmbed`, `successEmbed`, `errorEmbed`, `warningEmbed`) inspirés de `@rpbey/tscord/utils/functions/embeds`, sans tirer la stack tscord complète.
- **Service `SettingsService`** — table `guild_settings` (migration `0001_lazy_scrambler.sql`), validation par type (int/snowflake/string/bool), invalidation cache après set, mono-guild assumed (le bot est verrouillé sur `env.GUILD_ID`).
- **Service `TranslateService`** — encapsule Tesseract CLI + LibreTranslate, méthode `probe()` au boot pour détecter la dispo runtime, validation URL anti-SSRF (`isIP`, ranges privés RFC1918/loopback/link-local/ULA).
- **`scripts/setup-translate.sh`** — script idempotent qui installe Tesseract via apt (packs `fra/eng/jpn/spa/deu/ita`) et lance LibreTranslate en Docker (`127.0.0.1:5000` bind, modèles `en,fr,ja,es,de,it`, `LT_DISABLE_WEB_UI=true`). Healthcheck 3 min.

### Changed

- **Workspace** — `apps/shenron` retiré de l'exclusion `!apps/shenron` du root `package.json` du monorepo VPS. Les packages `@rpbey/{di,discordx,importer,pagination}` passent en `workspace:*`, `discord.js` et `typescript` en `catalog:`.
- **`MessageXP.ts`** — `resolveAchievementChannel` est désormais résolu **lazy** uniquement si on a un succès à annoncer (`isFirstMessage || granted.length > 0`). Évite un `client.channels.fetch` HTTP par messageCreate (rate-limit Discord sur serveurs actifs).

### Fixed

- **Fuites mémoire potentielles `/morpion`** — Map `games` GC manquant. Ajout de `setTimeout(games.delete, 30 min).unref()` après chaque création.
- **Race condition `/pendu`** — un user qui clique "Accepter" après expiration démarrait quand même. Check `expiresAt <= Date.now()` dans `onChallengeButton`.
- **Tous les `setTimeout`** — `.unref()` ajouté pour ne pas garder l'event loop éveillé.
- **Tesseract hang sur image malicieuse** — hard kill via `setTimeout(proc.kill, 30s)` + cap `content-length` 10 MiB.
- **LibreTranslate freeze user 30 s** — timeout descendu à 8 s, message d'erreur explicite avec URL configurée.

## [Unreleased] — 2026-04-24

### Added

- **Salon de commandes dédié** — nouvelle var `COMMANDS_CHANNEL_ID` + guard `CommandsChannelOnly` appliqué aux commandes user-facing (`/shop`, `/buy`, `/eprofil`, `/fusion`, `/solde`, `/gay`, `/raciste`, `/scan`, `/bingo`, `/morpion`, `/pendu`, `/pfc`, `/profil`, `/top`, `/niveau`, `/wiki`, `/races`, `/planete`). Hors du salon ciblé → reply éphémère. Commandes modération / admin / tickets / vocaux restent utilisables partout.
- **Salon d'annonces** — nouvelle var `ANNOUNCE_CHANNEL_ID` + helper `src/lib/announce.ts::resolveAnnounceChannel`. Les messages de level-up (texte **et** vocal), quête quotidienne, premier message, succès pattern-based sont publiés dans ce salon unique au lieu du salon d'origine.
- **Level rewards DBZ** — seed automatique de la table `level_rewards` avec 10 rôles canoniques (Kaioken → Perfect Ultra Instinct) mappés aux paliers `LEVEL_THRESHOLDS`. Script `bun run db:seed-levels` + intégré dans `db:seed-all`.
- **Audit boot-time** — nouveau `src/lib/boot-audit.ts` exécuté à `clientReady`. Vérifie pour chaque ID env : existence du salon/rôle sur la guild, type attendu (text/category/voice), position hiérarchique vs bot. Signale les 10 rôles level-reward en cas d'injoinables. Log unique `✓ boot-audit OK` ou warnings détaillés.
- **Scan de la guild** — `scripts/scan-ids.ts` dump 172 salons + 185 rôles + 5756 users (avec rôles de chaque user) dans `data/guild-scan.json`. Sert de source de vérité pour le ciblage des vars env et le seed des level-rewards.

### Changed

- **GUILD_ID** basculé du serveur de test (`1497167233280118896`) vers la prod Dragon Ball FR (`934894610545770506`). 41 commandes ré-enregistrées sur la nouvelle guild.
- **`.env` rempli** depuis le scan :
  - `LOG_MESSAGE_CHANNEL_ID` / `LOG_SANCTION_CHANNEL_ID` / `LOG_ECONOMY_CHANNEL_ID` / `LOG_JOIN_LEAVE_CHANNEL_ID` / `LOG_LEVEL_ROLE_CHANNEL_ID` / `LOG_TICKET_CHANNEL_ID` → `1032622751845990401` (💾・logs, salon unique du serveur)
  - `MOD_NOTIFY_CHANNEL_ID` → `1142417515004317748` (🛠️・moderation)
  - `JAIL_ROLE_ID` → `1405635615827034194` (**Jugé par Enma**, 6 jailed actifs) — substitué au badge cosmétique *JAIL* (0 membre)
  - `URL_IN_BIO_ROLE_ID` → `935209498862317698` (.gg/dragonballfr)
  - `TICKET_CATEGORY_ID` → `1034596363096301719` (⌈🌟⌋ DB FR)
  - `SERVER_INVITE_URL` → `https://discord.gg/dragonballfr`
- **Wiki Dragon Ball** — DB peuplée via `bun run db:seed-all` : 58 personnages, 20 planètes, 43 transformations depuis `dragonball-api.com`. Descriptions en espagnol (endpoint FR upstream supprimé, confirmé via `?lang=fr`/`lang=en`/`Accept-Language`). Footer des embeds annote `source: dragonball-api.com`.

### Fixed

- **`/wiki` / `/races` / `/planete`** retournaient "introuvable" → DB seedée, les trois commandes fonctionnent avec autocomplete.
- **Level-up vocal silencieux** — `VoiceXP` ne passait pas de salon à `handleLevelUp`, aucun message posté. Désormais résout `ANNOUNCE_CHANNEL_ID` et publie correctement.

### Notes opérationnelles

- Le rôle **Shenron** (integration) doit rester **au-dessus** de tous les rôles attribués (.gg/dragonballfr à la position 97, rôles level-up jusqu'à 94). Boot-audit confirme position actuelle du bot = 148.
- Les tickets créés par `/ticket-panel` tomberont sous la catégorie DB FR (à côté de 🔖・ticket).
- `VOCAL_TEMPO_HUB_ID` laissé vide : aucun hub vocal "➕" unique sur le serveur (plusieurs par catégorie de jeu). Feature inactive tant qu'une var n'est pas définie.


---

<a name="claude-md"></a>
## 📄 Fichier : `CLAUDE.md`

**Titre original :** CLAUDE.md — shenron

### CLAUDE.md — shenron

Monorepo standalone (sorti du VPS le 2026-05-16). Bot Discord DBZ multi-personas + site Next.js compagnon.

**Sources de vérité** :
- Bot prod : service systemd `shenron.service` sur le VPS (`WorkingDirectory=/home/ubuntu/shenron/apps/bot`).
- Site prod : Vercel projet `dbfr` (`prj_wxLn9COQIo9HAOUVis08ppKXx7zI`), **domaine de prod : `https://dragonballfr.com`** (alias historique `dbfr.vercel.app` conservé). L'API bot est servie côté VPS sur `bot.dragonballfr.com` (ex- `bot.rpbey.fr`) ; vhost VPS `shenron.rpbey.fr` proxifie aussi le bot (legacy).
- DB bot : SQLite local `apps/bot/data/bot.db` (snapshot quotidien via timer VPS).
- DB site : **Postgres distinct** (Neon ou autre, via `DATABASE_URL`) — ce n'est PAS la même DB que le bot.

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

### Site (Vercel)
- Auto-deploy sur push `main` via **GitHub Actions** (`.github/workflows/deploy-vercel.yml` → `vercel deploy --prod`). Le projet Vercel `dbfr` n'est PAS encore connecté nativement au repo. **Le repo `aphrody-code/shenron` est PUBLIC depuis le 2026-06-02** ; il ne reste qu'une **action navigateur** pour passer au natif : autoriser la GitHub App Vercel sur le repo (`https://github.com/apps/vercel/installations/select_target` → compte `aphrody-code` → ajouter `shenron`), **puis** `vercel git connect` (échoue tant que l'App n'a pas accès). Une fois le natif confirmé : supprimer ce workflow (sinon double deploy) et les secrets repo `VERCEL_TOKEN` (`vcp_…`), `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` deviennent inutiles.
- Deploy manuel : `vercel deploy --prod --yes` depuis la racine du repo (jamais depuis `apps/site/`).
- Envs gérées dans Vercel UI (jamais commitées). Inclut `DATABASE_URL`, `DISCORD_CLIENT_ID/SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`.
- Build : `bun --filter @shenron/site build`. Pas de build VPS.
- `.vercelignore` exclut `apps/bot/` du build site.

### Règles dures
1. **Pas d'édition manuelle sur le VPS dans `~/shenron/`** : tout passe par PR sur `github.com/aphrody-code/shenron` puis `git pull` côté VPS.
2. **Bun obligatoire** : pas de `node`/`npm`/`pnpm`/`yarn`/`tsx`. Utiliser `bun`, `bunx`, `bun --filter <app> <cmd>`.
3. **Secrets** : jamais dans le repo. `.env` est gitignored. Production = envs Vercel ou `apps/bot/.env` chargé par systemd.
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

## DB & migrations

- **Bot** : `bun:sqlite` via Drizzle. Migrations dans `apps/bot/drizzle/`. Fichier prod : `apps/bot/data/bot.db`.
- **Site** : Postgres via Drizzle. Migrations dans `apps/site/drizzle/`. URL via `DATABASE_URL`.
- Schéma partagé conceptuellement mais **physiquement séparé** (provider différent). Préfixe `ba_` pour better-auth tables (`ba_user`, `ba_session`, `ba_account`, `ba_verification`).
- **Source de vérité du wiki = Neon `bot.*`** (depuis `a572e3f`). Sync **bidirectionnelle** par rôle de table (liste `apps/bot/scripts/_wiki-editorial.ts`) :
  - **Forward `sync-sqlite-to-neon.ts`** (timer `shenron-neon-sync.timer`, 30 min) : runtime (users/économie/…) **+ `db_news`** SQLite→Neon. **Exclut le wiki éditorial.**
  - **Reverse `sync-neon-to-sqlite.ts`** (timer `shenron-neon-pull.timer`, 15 min) : wiki éditorial Neon→SQLite (DELETE+INSERT par table, FK off, WAL-safe) → le SQLite du bot est un **replica de lecture** (commandes Discord `/wiki` + build RAG restent locaux, rapides, indépendants de Neon).

### RAG hybride (depuis `100a8a3`)

- `/api/public/rag/search` + GraphQL `ragSearch` + Discord `/ask` + recherche du site (`dbUniverse.rag`) = **pipeline RAG SOTA** : étage 1 récupération **hybride** (BM25 `rag_chunks` FTS5 + embeddings denses `rag_vectors` cosinus exact brute-force, fusion **RRF**) → étage 2 **reranking cross-encoder** du top-15. Cf. `apps/bot/src/lib/rag.ts` (runtime léger, zéro modèle dans le bot). `mode` ∈ `hybrid+rerank | hybrid | lexical`.
- **Modèles** : embeddings `Xenova/multilingual-e5-small` (384d, FR+JP) + reranker `Xenova/bge-reranker-base` (cross-encoder multilingue). Servis par le **sidecar `shenron-embed.service`** (port 5007, modèles chauds, `MemoryMax=3G`, RSS ~1.6G) — le bot (1.5G) ne charge JAMAIS de modèle. Cache `apps/bot/.models` (gitignored). `apps/bot/src/lib/embeddings.ts` = heavy, importé seulement par le sidecar + `scripts/rag-build.ts`. Rerank cappé à 400 chars/passage (le cross-encoder tronque à 512 tokens ; 1.4s vs 4.8s), timeout 6s (`RAG_RERANK=0` pour désactiver).
- **Build** : `bun --filter @shenron/bot run rag:build` (embed offline in-process, ~85s/1041 chunks ; `RAG_DB=/path` pour tester sur copie). Après build sur prod → `systemctl restart shenron`.
- **Dégradation gracieuse** : sidecar down/timeout → `mode:lexical` (BM25 seul), jamais de crash. Réponse inclut `mode: "hybrid"|"lexical"`.
- **Piège** : `Bun.serve` (listen) meurt en exit 144 dans le sandbox du Bash tool — tester la logique RAG sans serveur ; le sidecar tourne en prod via systemd.

### API GraphQL + OpenAPI (depuis `cb426bb` / `80c7551`)

- **GraphQL** read-only du wiki sur `/graphql` (Pothos code-first + graphql-yoga, monté sur le `Bun.serve` du bot, GraphiQL activé, CORS public, garde-fou profondeur max 10). `apps/bot/src/api/graphql.ts`. Entités + relations + `ragSearch` + `counts`.
- **OpenAPI 3.1** de l'API REST publique sur `/api/openapi.json`, UI **Scalar** sur `/api/docs` (CDN, zéro dep). `apps/bot/src/api/openapi.ts` (spec statique, à tenir à jour avec les routes).
  - Connexion Neon dans `/home/ubuntu/.shenron-neon.env` (600, hors repo, format systemd — non sourçable en shell). Projet Neon = `shenron-axum` (`patient-star-28731823`, us-east-1). PK wiki en `IDENTITY` (inserts site).
- **Le site possède le wiki en read+write, 100 % Next.js, zéro API bot** (depuis `a572e3f`) :
  - **Lecture** : `apps/site/src/db/bot-schema.ts` (`pgSchema("bot")`) via Drizzle. Public → `shenron.ts`/`db-universe.ts` (server-only) ; admin db-universe → `wiki-admin.ts` (server-only).
  - **Écriture** : route handler `apps/site/src/app/api/wiki-admin/[...path]` (gaté `isCurrentUserAdmin`) → `wiki-admin.ts` → Drizzle Neon. L'éditeur générique + `DbCrud` routent les tables wiki vers `/api/wiki-admin` (`wiki-tables.ts` client-safe : `isWikiTable`/`crudBase`) ; les tables **non-wiki** + `db_news` restent sur le proxy `/api/bot-admin`.
  - **Côté bot** : l'API CRUD `db_*` est **lecture seule** (garde write 409). Seul le **runtime** (user/shop/leaderboard/stats/personas/commands/carte PNG/SSE/RAG) reste sur l'API. Cf. mémoire `site-wiki-reads-neon-direct`.
- **Tables site (Postgres `public`)** : auth (`ba_*`), métier (`users`, `posts`), **télémétrie `site_events` + `user_preferences`** (migration `apps/site/src/db/migrations/0000_*`, `out` = `src/db/migrations` ; le site utilisait `db:push` historiquement → appliquer la migration à la main). `bot.db_episodes` (Neon) a gagné `frames` (jsonb `EpisodeFrame[]`) + `scene_preview` pour les **scènes d'épisode** (extraction `scripts/{build-episode-scenes,extract-dbz-frames,scrape-dbz-fandom-frames}.ts` → ingest gardé `scripts/ingest-episode-frames.ts`).

## Services VPS (références)

| Service | Port | Vhost | Stack |
|---|---|---|---|
| (site Vercel) | — | dragonballfr.com (ex- shenron.rpbey.fr) | Next.js 16 sur Vercel (projet `dbfr`) |
| shenron | 5006 | bot.dragonballfr.com (ex- bot.rpbey.fr) | Bun + discordx + drizzle + bun:sqlite + canvas. Sert aussi **GraphQL** `/graphql` (Pothos+yoga, GraphiQL) et **OpenAPI** `/api/openapi.json` + UI Scalar `/api/docs` |
| shenron-embed | 5007 (loopback) | — | Sidecar embeddings RAG (multilingual-e5-small, transformers.js). Modèle chaud, isolé du bot. Cf. RAG hybride |
| shenron-backup.timer | — | — | `VACUUM INTO` quotidien 03:00 UTC → `apps/bot/backups/` |
| shenron-guild-sync.timer | — | — | Script réconciliation DB↔Discord quotidien 04:00 UTC |
| shenron-neon-sync.timer | — | — | Forward SQLite → Neon (runtime + `db_news`, wiki exclu) toutes les 30 min |
| shenron-neon-pull.timer | — | — | Reverse Neon → SQLite (wiki éditorial, replica de lecture du bot) toutes les 15 min |

**Vendorées dans le repo (source de vérité, plus `~/vps/`)** : units `deploy/systemd/shenron*.{service,timer}`, vhosts `deploy/nginx/{bot.rpbey.fr,shenron}.conf`, installeur idempotent `deploy/install.sh`. Scripts d'ops `scripts/{backup-shenron-sqlite,shenron-guild-sync,deploy-shenron}.sh`. Provisioning d'un hôte nu : `bash deploy/install.sh --nginx --start` (cf. `deploy/README.md`).

## Pièges critiques

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
### Dev local
bun bot:dev          # bot en watch
bun site:dev         # site Next dev server

### Build / qualité
bun run build        # turbo build all (site: next build --turbopack ; bot: dashboard:css puis bun build) - packages use prebuilt dist
bun run lint         # oxlint + eslint (turbo)
bun run type-check   # tsc all (turbo)

### Tests — runner sur-mesure couvrant TOUS les scopes (scripts/test-all.ts)
bun run test:all                                # tous les scopes (matrice ; turbo skippe les scopes sans script `test`)
bun run test:ci                                 # --strict (CI) : échoue sur tout scope zéro-test
bun run test:live                               # ajoute le tier live (apps/site no-404, crawler prod flaky — hors défaut)
bun run test:cov                                # lcov + junit par scope
bun --filter @shenron/bot test                  # tous les tests bot (apps/bot/tests/)
bun test apps/bot/tests/wiki.test.ts            # un seul fichier de test (depuis le root)
### NB: le runner isole les scopes par cwd/process (preload bunfig bot = reflect-metadata + canvas shim + ./data/test.db ;
###     @singleton DI + DB de test partagée → ordre-dépendant : utiliser --randomize/--rerun-each pour chasser les flakes).
###     apps/site = tier `live` (opt-in --live) ; les 4 packages fork (di/importer/internal/pagination) ont désormais des suites réelles.

### Bot — utilitaires
bun --filter @shenron/bot run gen:entries  # regen _entries.ts
bun --filter @shenron/bot run db:migrate   # drizzle migrations
bun --filter @shenron/bot run db:seed-all  # seed RUNTIME only (triggers + level-rewards + shop-banners) ; wiki éditorial = Neon (reverse-sync), plus seedé en SQLite
bun --filter @shenron/bot run dashboard:css # recompile le CSS Tailwind du dashboard admin (requis avant build)

### Scènes d'épisode (frames → preview.mp4 → wiki) — déposer les masters dans apps/bot/data/dbz-sources/<série>/<num>.mkv
bun apps/bot/scripts/build-episode-scenes.ts --series DBZ --ep 1 --max 24   # extraction ffmpeg + preview + dataset (--dry-run pour tester)
bun apps/bot/scripts/scrape-dbz-fandom-frames.ts --series DBZ --from 1 --to 10 [--download]  # alt. sans vidéo (screencaps fandom)
sudo systemd-run --pipe -p EnvironmentFile=/home/ubuntu/.shenron-neon.env --working-directory=/home/ubuntu/shenron/apps/bot \
  bun scripts/ingest-episode-frames.ts --series DBZ --ep 1 --apply   # ingest Neon gardé, puis: systemctl start shenron-neon-pull.service

### Prod (VPS)
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

Hooks actifs (`.claude/settings.json`) :
- PostToolUse Edit/Write sur `apps/bot/src/{commands,events,guards}/` → auto `bun run gen:entries`.
- PreToolUse Edit/Write sur `apps/bot/src/lib/personas.ts` → warning intents critiques.
- PreToolUse Edit/Write sur `.env` → BLOQUÉ (exit 2).

Pour les tâches générales hors scope : `general-purpose` ou `Explore`.


---

<a name="deploy-md"></a>
## 📄 Fichier : `DEPLOY.md`

**Titre original :** Déploiement de Shenron

### Déploiement de Shenron

Guide complet de mise en production — choix d'hébergement, flow CI/CD, secrets, monitoring, backups et rollback.

## Sommaire

- [Choisir sa cible de déploiement](#choisir-sa-cible-de-déploiement)
- [1. Fly.io — recommandé](#1-flyio--recommandé)
- [2. VPS + systemd](#2-vps--systemd)
- [3. Docker standalone](#3-docker-standalone)
- [4. Binaire compilé (sans runtime)](#4-binaire-compilé-sans-runtime)
- [Gestion des secrets](#gestion-des-secrets)
- [Pipeline CI/CD](#pipeline-cicd)
- [Monitoring & issues auto](#monitoring--issues-auto)
- [Sauvegardes](#sauvegardes)
- [Mise à jour & rollback](#mise-à-jour--rollback)
- [Scaling / sharding](#scaling--sharding)
- [Checklist pré-production](#checklist-pré-production)

---

## Choisir sa cible de déploiement

| Cible | Coût | Simplicité | Maintenance | Contrôle | Pour qui |
|---|---|---|---|---|---|
| **Fly.io** | ~3 $/mo | ★★★★★ | ★★★★★ | ★★★ | Démarrage rapide, zéro devops |
| **VPS + systemd** | 3-8 €/mo | ★★★ | ★★ | ★★★★★ | Contrôle total, multi-bot sur même machine |
| **Docker standalone** | selon host | ★★★★ | ★★★★ | ★★★★ | Homelab, k8s, infra déjà conteneurisée |
| **Binaire compilé** | 0 € marginal | ★★ | ★★★ | ★★★★ | Embarqué, VPS minimal, pas de Docker |

**Recommandation par profil :**

- **Je veux juste que ça tourne** → Fly.io ([§1](#1-flyio--recommandé))
- **J'ai déjà un VPS** → systemd ([§2](#2-vps--systemd))
- **Je suis dans un cluster k8s** → Docker ([§3](#3-docker-standalone))
- **VPS riquiqui (256 MB RAM)** → binaire ([§4](#4-binaire-compilé-sans-runtime))

---

## 1. Fly.io — recommandé

### Prérequis

- Compte Fly.io ([fly.io/sign-up](https://fly.io/app/sign-up))
- CLI : `curl -L https://fly.io/install.sh | sh`
- `fly auth login`
- Un fichier `.env` local rempli (au moins `DISCORD_TOKEN`, `GUILD_ID`, `OWNER_ID`)

### Bootstrap en 1 commande

```bash
bash scripts/fly-init.sh
```

Ce que fait le script :
1. Crée l'app `shenron-bot` en région `cdg` (Paris) si elle n'existe pas
2. Provisionne le volume persistant `shenron_data` (3 GB SSD, mount `/data`)
3. Extrait chaque variable de `.env` et la pousse en secret Fly (masquée)
4. `fly deploy` avec `--build-arg GH_PACKAGES_TOKEN` (env, pour le fork `@aphrody-code/canvas`)

**Variables d'env du script** :

```bash
APP=mon-bot           # défaut : shenron-bot
REGION=ams            # défaut : cdg
VOLUME_SIZE=5         # défaut : 3 (GB)
GH_PACKAGES_TOKEN=… # fork privé @aphrody-code/canvas (GitHub Packages)
```

### Ce qui tourne dans le conteneur

- Image base : `oven/bun:1-debian` (single-stage, monorepo-aware : `Dockerfile` **à la racine**, contexte = racine pour résoudre les workspaces `packages/*`, run `apps/bot/src/index.ts`)
- User non-root : `shenron` (UID 1001)
- Volume persistant : `/data` pour `bot.db` (SQLite WAL)
- `release_command = "bun src/db/migrate.ts"` — migrations appliquées **avant** que la nouvelle version ne reçoive du trafic
- Pas de `[http_service]` — worker Gateway WebSocket uniquement, machine toujours-on par défaut

### Commandes quotidiennes

```bash
fly logs --app shenron-bot              # stream stdout (pino logs)
fly status --app shenron-bot            # état machine, uptime
fly ssh console --app shenron-bot       # shell dans le conteneur
fly secrets list --app shenron-bot      # noms (valeurs masquées)
fly secrets set KEY=val --app shenron-bot # ajoute/met à jour
fly secrets unset KEY --app shenron-bot

fly deploy                              # redeploy manuel
fly deploy --build-arg GH_PACKAGES_TOKEN=<PAT>
fly releases --app shenron-bot          # historique des deploys
fly machine list --app shenron-bot      # VMs actives
```

### Coût

| Poste | Prix (avril 2026) |
|---|---|
| VM `shared-cpu-1x` 1 GB | ~1,94 $/mo |
| Volume 3 GB | ~0,45 $/mo |
| Bande passante sortante | ~0,02 $/GB (généralement < 1 GB/mois) |
| **Total estimé** | **~2,50-3 $/mo** |

[Pricing Fly](https://fly.io/docs/about/pricing/).

---

## 2. VPS + systemd

Le plus classique — tu as le code dans `~/shenron`, tu veux qu'il tourne en service.

### Installation

```bash
### Sur le VPS
curl -fsSL https://raw.githubusercontent.com/aphrody-code/shenron/main/scripts/install.sh | bash
cd shenron
### Édite .env
bash scripts/doctor.sh              # valide tout
```

### Unit systemd

`/etc/systemd/system/shenron.service` :

```ini
[Unit]
Description=Shenron Discord bot
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/shenron
ExecStart=/home/ubuntu/.bun/bin/bun src/index.ts
EnvironmentFile=/home/ubuntu/shenron/.env

Restart=on-failure
RestartSec=5s
### Robustesse
MemoryMax=1G
LimitNOFILE=4096
### Sécurité
NoNewPrivileges=true
ProtectSystem=full
ProtectHome=read-only
ReadWritePaths=/home/ubuntu/shenron/data /home/ubuntu/shenron/logs

[Install]
WantedBy=multi-user.target
```

Activation :

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now shenron
sudo systemctl status shenron
journalctl -fu shenron                # logs en direct
```

### Sidecar embeddings RAG (`shenron-embed.service`)

La recherche RAG hybride+rerank charge ses 2 modèles transformers.js dans un **sidecar isolé** — jamais dans le process bot (qui reste à `MemoryMax=1.5G`).

| Service | Port | Mémoire | Rôle |
|---|---|---|---|
| `shenron-embed.service` | `127.0.0.1:5007` | `MemoryMax=3G` | Sidecar embeddings (`multilingual-e5-small` + `bge-reranker-base`), 2 modèles chauds |

- **Activation** : `bash deploy/install.sh` active l'unit avec les autres (units vendorées dans `deploy/systemd/`). Au **1er boot**, le service télécharge ~410 Mo de modèles dans `apps/bot/.models` (gitignored, cache persistant).
- **Rebuild du corpus RAG** : après tout changement du wiki, `bun --filter @shenron/bot run rag:build` (embed in-process, offline) puis `sudo systemctl restart shenron`.

### Version compilée (binaire standalone)

Avec `bun build --compile`, tu n'as même plus besoin de Bun au runtime :

```bash
bun run compile                         # → dist/shenron (~70 MB)
### ExecStart=/home/ubuntu/shenron/dist/shenron
```

---

## 3. Docker standalone

Pour k8s, docker-compose, Nomad, etc.

### Build

```bash
docker build \
  --build-arg GH_PACKAGES_TOKEN=<PAT> \
  -t shenron:latest .
```

### Run (docker)

```bash
docker run -d --name shenron \
  --restart=unless-stopped \
  -v shenron-data:/data \
  --env-file .env \
  shenron:latest
```

### docker-compose.yml

```yaml
services:
  shenron:
    build:
      context: .
      args:
        GH_PACKAGES_TOKEN: ${GH_PACKAGES_TOKEN}
    restart: unless-stopped
    env_file: .env
    volumes:
      - shenron-data:/data
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  shenron-data:
```

### Kubernetes (skeleton)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: shenron }
spec:
  replicas: 1                          # IMPORTANT : Discord interdit le multi-process Gateway
  strategy: { type: Recreate }
  selector: { matchLabels: { app: shenron } }
  template:
    metadata: { labels: { app: shenron } }
    spec:
      containers:
        - name: shenron
          image: ghcr.io/aphrody-code/shenron:latest
          envFrom:
            - secretRef: { name: shenron-env }
          resources:
            requests: { memory: "256Mi", cpu: "100m" }
            limits:   { memory: "1Gi",   cpu: "1" }
          volumeMounts:
            - name: data
              mountPath: /data
      volumes:
        - name: data
          persistentVolumeClaim: { claimName: shenron-data }
```

`PersistentVolumeClaim` avec `ReadWriteOnce` (SQLite = single writer).

---

## 4. Binaire compilé (sans runtime)

```bash
bun run compile                         # local
### ou télécharge depuis GitHub Release (voir .github/workflows/release.yml)
```

Sur la cible :

```bash
chmod +x shenron-bun-linux-x64
./shenron-bun-linux-x64                 # lit .env dans le CWD
```

Le binaire inclut Bun + tout le code JS. Il **n'inclut pas** `data/`, `assets/cards/`, ni `assets/backgrounds/` — à fournir à côté (ou via volumes).

---

## Gestion des secrets

Règle d'or : **jamais de secret dans git**, jamais de secret dans un log, jamais de secret dans un arg visible (`ps aux`).

### Local (.env)

- Créé par `scripts/setup.sh` avec `chmod 600`
- Ignoré par git
- Lu par Bun via `process.env` (auto-chargement)

### Fly.io

```bash
fly secrets set DISCORD_TOKEN=xxx GUILD_ID=yyy OWNER_ID=zzz
fly secrets import < .env       # alternative
```

### GitHub Actions

Secrets configurés sur le repo :

| Secret | Usage | Comment le générer |
|---|---|---|
| `GH_PACKAGES_TOKEN` | Auth `@rpbey/*` dans les workflows | PAT classic avec scope `read:packages` |
| `FLY_API_TOKEN` | Déploiement CI/CD | `fly auth token` |

### systemd

Utilise `EnvironmentFile=` pointant sur un `.env` en `chmod 600` + `User=` non-privilégié.

### Rotation

- **Token Discord volé** → Portail dev → **Bot → Reset Token** → met à jour `.env` / `fly secrets` → redémarre
- **PAT GitHub volé** → github.com → **Settings → Developer settings → Tokens → Revoke** → regen → `gh secret set GH_PACKAGES_TOKEN`

---

## Pipeline CI/CD

### Workflows actifs

| Workflow | Trigger | Fait |
|---|---|---|
| `ci.yml` | push/PR main | type-check, lint, test, build (matrix Ubuntu + macOS) + compile Linux x64 |
| `release.yml` | tag `v*` | Compile 5 targets (linux-x64/arm64, darwin-x64/arm64, windows-x64), SHA256SUMS, GitHub Release |
| `deploy-fly.yml` | push main (après CI vert) | `flyctl deploy --remote-only` |
| `update-deps.yml` | lundi 06:00 UTC | `bun update` → PR automatique si `bun.lock` change |
| `codeql.yml` | push/PR + mardi 07:00 UTC | Scan sécurité JS/TS |

### Flow de release

1. Commit sur `main` → `ci.yml` + `deploy-fly.yml` → push live
2. Pour marquer une version : `git tag v0.2.0 && git push --tags`
3. `release.yml` compile les 5 binaires + crée la GitHub Release publique

### Conventional Commits

Format recommandé : `<type>(<scope>): <message>`

```
feat(canvas): ajout du podium /top
fix(mod): /jail ne restaure pas les rôles
chore(deps): bun update
docs(readme): section Fly.io
refactor(canvas): extract canvas-kit
test(economy): smoke test /shop
ci: fix GH Packages auth
```

---

## Monitoring & issues auto

### Logs Fly

```bash
fly logs --app shenron-bot
fly logs --app shenron-bot --since 1h
fly logs --app shenron-bot | grep ERROR
```

### Logs systemd

```bash
journalctl -fu shenron                  # follow
journalctl -u shenron --since "1 hour ago" --priority=err
```

### Issues auto sur erreur

`scripts/log-watcher.ts` créé une issue GitHub dès qu'une erreur est détectée dans les logs (pino ERROR, Unhandled rejection, TypeError…), avec déduplication par fingerprint.

```bash
### En local (tail fichier)
GITHUB_TOKEN=<PAT> bun scripts/log-watcher.ts /home/ubuntu/shenron/logs/current.log

### Systemd unit préconfiguré
sudo cp scripts/log-watcher.service /etc/systemd/system/shenron-log-watcher.service
sudo systemctl enable --now shenron-log-watcher

### Pipe direct depuis journalctl
journalctl -fu shenron | GITHUB_TOKEN=<PAT> bun scripts/log-watcher.ts
```

**Comportement** :
- Nouvelle erreur → nouvelle issue `[auto] <message>` avec labels `bug` + `auto-detected`
- Erreur déjà vue (fingerprint identique) dans une issue **ouverte** → commentaire (+count, timestamp)
- Issue **fermée** avec le même fingerprint → ignoré (respect du jugement humain)
- Throttle : max 1 comment / minute / fingerprint

### Métriques Fly

```bash
fly metrics --app shenron-bot
```

Vues Grafana Fly intégrées à `fly.io/apps/<app>/metrics`.

---

## Sauvegardes

La DB SQLite est le seul état critique. Tout le reste est reconstructible depuis git + `.env`.

### Snapshot à chaud (WAL-safe)

```bash
bun -e "import {Database} from 'bun:sqlite'; \
  new Database('./data/bot.db').exec(\"VACUUM INTO './data/bot.bak.db'\")"
```

### Cron hebdomadaire (VPS)

```cron
0 3 * * 0 cd /home/ubuntu/shenron && bun -e "import {Database} from 'bun:sqlite'; new Database('./data/bot.db').exec(\"VACUUM INTO './data/bot-\\$(date +\\%F).bak.db'\")"
```

### Rotation + upload S3/Hetzner Storage Box

```bash
### Sur Fly
fly ssh console --app shenron-bot -C "cd /data && bun -e '...'"
### Puis rsync vers un bucket offsite
```

### Restauration

```bash
### Stop
sudo systemctl stop shenron      # OU fly scale count 0 --app shenron-bot

### Remplace la DB
cp data/bot-2026-04-24.bak.db data/bot.db

### Start
sudo systemctl start shenron     # OU fly scale count 1 --app shenron-bot
```

---

## Mise à jour & rollback

### Mise à jour

| Cible | Commande |
|---|---|
| Fly.io (manuel) | `fly deploy` |
| Fly.io (auto) | `git push` (CI vert → deploy auto) |
| systemd | `git pull && bun install && bun run gen:entries && sudo systemctl restart shenron` |
| Docker | `docker pull … && docker stop shenron && docker run …` |

### Rollback

**Fly.io** :

```bash
fly releases --app shenron-bot
### → liste des deploys, chaque ligne a un VERSION
fly deploy --image registry.fly.io/shenron-bot:deployment-<hash>
### ou
fly machine update <machine-id> --image … --app shenron-bot
```

**systemd** :

```bash
cd /home/ubuntu/shenron
git log --oneline -5
git checkout <commit-précédent>
bun install
sudo systemctl restart shenron
```

**Docker** :

```bash
docker run -d shenron:<previous-tag>
```

### Rollback DB (breaking migration)

Les migrations Drizzle ne sont pas réversibles par défaut. Pour revert :

1. Restaure un snapshot pré-migration (`cp data/bot.bak.db data/bot.db`)
2. Checkout le commit avant la migration
3. Relance

---

## Scaling / sharding

Discord impose **un seul process Gateway par bot** tant qu'on est < 2 500 guilds.

| Nombre de guilds | Config |
|---|---|
| 1 - 2 500 | 1 VM, `fly scale count 1`, `replicas: 1` |
| 2 500 - 250 000 | Sharding manuel : définir `totalShards` dans discord.js |
| > 250 000 | Architecture multi-process, Redis pour state partagé (hors scope Shenron) |

Shenron est codé single-shard. Pour sharder il faudra :
1. Passer à `ShardingManager` de discord.js
2. Extraire la DB en service partagé (Postgres ou SQLite centralisé)
3. Coordination cache (Redis)

**Pour l'instant (< 100 guilds) : n'y touche pas.**

---

## Checklist pré-production

Avant de marquer un release `v1.0.0` :

- [ ] `bun run type-check` passe
- [ ] `bun run lint` passe
- [ ] `bun run test` passe (42 smoke tests)
- [ ] `.env` prod créé, tous les IDs renseignés (ou acceptés vides = no-op)
- [ ] 3 Privileged Intents activés dans le portail dev
- [ ] Bot invité sur la guild prod avec les bonnes permissions
- [ ] `/ids` exécuté une fois pour récupérer les IDs et les coller dans `.env`
- [ ] `/ticket-panel` publié dans le salon dédié
- [ ] Triggers de succès seedés (`bun run db:seed-triggers`)
- [ ] Wiki DBZ seedé (`bun run db:seed-wiki`) — optionnel
- [ ] Backup cron configuré
- [ ] `log-watcher` activé
- [ ] Doctor passe (`bash scripts/doctor.sh` → exit 0)
- [ ] Token REST pingable (`doctor.sh` le fait)
- [ ] Page "Developer Portal" complétée (Name, Description, Tags, Privacy/Terms URL, icône)


---

<a name="design-md"></a>
## 📄 Fichier : `DESIGN.md`

**Titre original :** DESIGN.md — Système graphique DBFR

### DESIGN.md — Système graphique DBFR

Calibré sur l'analyse de l'identité Dragon Ball historique + officielle :
`fr.dragon-ball-official.com`, `www.toei-animation.com/catalog/dragon-ball/`,
`en.bandainamcoent.eu/dragon-ball`, dessins originaux Akira Toriyama (1984+).

---

## 1. Identité visuelle — pilier Toriyama × DB Official

Le style Dragon Ball est **chromatiquement chaud, contrasté, énergétique**.
Pas de pastel, pas de gradients subtils — couleurs primaires saturées, blanc
pur, noir profond. La signature : **orange ↔ bleu nuit ↔ jaune doré**.

| Élément | Référence | Codes |
|---|---|---|
| Gi de Goku | DBZ anime, manga couleur | `#FF6B1A` orange chaud |
| Ceinture / sky-blue Goku | Toriyama color guide | `#1976D2` bleu franc |
| Étoile de Dragon Ball | Site DB Official, logos officiels | `#FFB200` doré orangé |
| Logo "DRAGON BALL" rouge | Anime opening, jaquettes Bandai | `#E20613` rouge pur |
| Kanji 神龍 (Shenron) | Manga vol. 17, anime intro | `#C8A02E` doré ancien |
| Aura Super Saiyan | DBZ cellsaga, anime FX | `#FFD23F` jaune électrique |
| Ki sphere | Kamehameha, Genkidama | bleu clair → blanc `#9BD9FF → #FFFFFF` |
| Outline manga | trait Toriyama universel | `#0A0A0A` noir profond, jamais `#000` 100% |

**Notre palette site** (`apps/site/src/app/globals.css`) :

```css
--color-dbz-bg:         #0a0a0a;   /* noir profond DB officiel */
--color-dbz-card:       #141410;   /* surface chaude warm-tinted */
--color-dbz-border:     #2a2a26;   /* hairline subtle */
--color-dbz-orange:     #ffb200;   /* doré signature Site Officiel JP/FR */
--color-dbz-orange-dark:#d99700;   /* press state */
--color-dbz-blue:       #1e244d;   /* deep navy lisible */
--color-dbz-blue-light: #cdcdcd;   /* gris clair DB officiel */
--color-dbz-yellow:     #ffb200;   /* alias accent doré */
--color-dbz-red:        #ff0000;   /* rouge logo DB officiel */
```

**Règle d'or** : un seul accent dominant par bloc. Le doré est notre couleur
de hiérarchie principale, le rouge réservé aux états critiques (sanctions,
DMCA, erreurs). Le bleu est un secondaire calme (gris clair `#cdcdcd`).

---

## 2. Typographie — système 3 polices

| Tier | Police | Usage | Rationale |
|---|---|---|---|
| Display | **Oswald** (Google Fonts) | titres, nav, CTAs, labels | police signature `fr.dragon-ball-official.com` — condensée, gras, lisible en uppercase |
| Body | **Google Sans Flex** (Google Fonts variable, v20 TTF servie en local) | paragraphes, listes, descriptions | police corps officielle Google, variable axes wght+wdth+ital, publiée sur fonts.google.com/specimen/Google+Sans+Flex (chargée en `localFont` car next/font/google registry ne la liste pas encore) |
| Japonais | **Noto Sans JP** (Google Fonts) | 漢字, romaji, attaques (Kamehameha) | police officielle DB Site, support katakana + kanji complet |

**Hiérarchie de tailles** (calibrée sur `design.google` × DB Official) :

```
H1 hero    : 56-72px / 700 / tracking -0.01em / leading 1.05
H1 page    : 40-56px / 700 / tracking -0.01em / leading 1.05
H2 section : 24-28px / 700 / leading 1.2
H3 card    : 17-20px / 700 / leading 1.3
Body large : 17px    / 400 / leading 1.6
Body       : 15px    / 400 / leading 1.6
Caption    : 12-13px / 500 / tracking 0.08em / uppercase pour labels
Micro-label: 11-12px / 600 / tracking 0.16-0.18em / uppercase / couleur accent
```

**À éviter** : titres en `font-saiyan` jagged (police héritée fan-art) sur du
contenu éditorial — réserver aux héros visuels. La règle moderne 2026 :
Oswald gras propre > effet chrome jagged.

**Tracking pour les labels micro** : `0.16em-0.18em` est la signature DB
Official (vu en analyse `style-tree.json` sur leur nav et tagline).

---

## 3. Composition & layout

### Container
- Max-width principal : **1280px** (analyse `design.google` = 1440px max, on adapte)
- Max-width article : **920px**
- Padding latéral : `px-6 lg:px-10` (24px mobile, 40px desktop)
- Vertical rhythm : `py-16 lg:py-24` sections, `mb-12` titres → corps

### Grille
- Listes cartes : `grid-cols-{1|sm:2|lg:3|lg:4}` selon densité (cards 320-380px idéale)
- Personnages : portrait 3:4 (équivalent affiche cinéma)
- Films/posters : 2:3 (standard MAL/AniList/Kitsu)

### Espacement
- Card padding intérieur : `p-5` (20px) — `p-8` (32px) pour cards prioritaires
- Gap entre items : `gap-3` (12px) compact, `gap-5` (20px) confortable, `gap-px` (1px)
  + bg neutre pour grille bordée style "newspaper" (`UniverseGrid`)
- Border-radius : **0.75rem (12px)** standard, `rounded-2xl` (16px) pour hero
  cards, `rounded-full` pour CTAs/pills
- Hairline : `border-white/[0.06]` sur dark, jamais pleine ligne `border-white/20`
  (trop dur)

### Hiérarchie visuelle
- **Eyebrow label** : micro-label uppercase orange `text-dbz-orange` au-dessus
  de chaque H1 → ancre la section dans une catégorie ("Univers Dragon Ball",
  "Cinéma", "Anime"…)
- **Numérotation** : pour les listes ordonnées (sagas, arcs), index gros et
  orange aligné à gauche, padding `tabular-nums`
- **Asymétrie** : sur les heros, titre + lead à gauche, illustration à droite
  (orbite Dragon Balls). Pas de centrage par défaut.

---

## 4. Motifs & iconographie

### Symboles canon Dragon Ball à exploiter
- ★ **Étoiles de Dragon Ball** (1 à 7) — héro visuel, animation orbite
- 神龍 **Kanji Shenron** — accent décoratif vertical (kata-vert utility)
- 八 **Symbole Saiyan / Bardock crest** — pour les badges race
- ☼ **Aura solaire SS** — radial gradient orange + jaune en arrière-plan
- ⚡ **Genkidama** — sphère bleue avec halo

### Motifs DOM réutilisables
Définis dans `globals.css` (`@layer utilities`) :
- `.speed-lines` — repeating-conic-gradient radial, masque circulaire (manga FX)
- `.halftone` — pointillés tramés style impression manga
- `.starfield` + `.starfield-anim` — étoiles drift cosmique
- `.sunburst` — rayons solaires SS aura
- `.dbz-panel` — surface dark + border doré + box-shadow subtil
- `.dbz-button` — gradient orange→jaune→rouge + lift hover
- `.title-jagged` — gradient text effect pour titres hero (à utiliser avec parcimonie)
- `.ki-pulse` — animation pulse 2.4s pour micro-labels accent

### Ne pas inventer
Ne pas créer de "Dragon Ball Cyber-punk", "DB Vaporwave", "DB Glassmorphism
violet". L'univers est **chaud, manga, énergique**. Pas de cool tones, pas de
neon synthwave. Si on veut du moderne 2026 → **clean editorial Google × énergie
DB**, pas mode crypto.

---

## 5. Animations & FX

**Bibliothèque animations (2026)** : `motion` (motion.dev) — fork lean de
framer-motion par Matt Perry, **9 KB gz** (vs 60 KB framer-motion).
Import : `import { motion } from "motion/react"`. API identique à framer.

**WebGPU** : intégration native via `<canvas>` + WGSL shaders sans wrapper
React-three-fiber. KiCanvas (`apps/site/src/components/site/KiCanvas.tsx`)
est un composant client dynamic-imported (jamais dans le critical path).

**Préférer toujours d'abord** :
1. View Transitions API native (Chrome 111+, Safari 18+) → `next/transitions`
2. CSS `@scroll-timeline` + `@view-timeline` (Chrome 115+) → animations
   scroll-linked sans JS
3. CSS keyframes + `prefers-reduced-motion`
4. SVG SMIL natif pour micro-anims
5. En dernier recours : `motion/react`

**Réservées aux moments-clés**, pas saupoudrées partout.

| Élément | Animation | Durée | Easing |
|---|---|---|---|
| Hero text reveal | `motion.h1 initial scale=0.9 → 1` | 700ms | spring bounce 0.35 |
| CTA hover | `transform: translateY(-1px)` + box-shadow boost | 250ms | ease-out |
| Card hover | `border-color` + `bg-white/[0.07]` | 300ms | ease |
| Image hover (CharactersTeaser) | `scale-105` + `opacity 90→100` | 500ms | ease |
| Drawer mobile | `top-16 inset-0` slide + backdrop-blur | 200ms | linear |
| Scroll indicator | `scale-y 1→1.4 opacity 0.3→1` | 2s loop | ease-in-out |
| Aura `.ki-pulse` | `scale 1→1.04 opacity 0.85→1` | 2.4s loop | ease-in-out |
| `.starfield-anim` | `background-position` drift 600px | 240s linear | infinite |

**Bannir** : parallax scroll, animations chargement infinies (= placeholder),
flips 3D, glitch FX. Notre DB est moderne 2026, pas Flash 2008.

---

## 6. Composants signature

### Home cinématique (`apps/site/src/components/home/`)
Page d'accueil full-page **scroll-snap** : chaque ère Dragon Ball est une scène
plein écran avec fond animé tiré des meilleures scènes du manga/anime.
- Navigation **molette / clavier (↑↓, Page, Home/End) / tactile** entre scènes.
- Langage visuel : **sombre cinématique**, accent or DB `#ffb200`, fonds en
  **ken-burns** (pan/zoom lent) avec **color grade par ère** (saga = teinte),
  **grain** photographique léger et **aura ki** radiale en overlay.
- Typo : titres **Google Sans Flex en poids lourds** (display 800-900) pour
  l'impact cinéma, sous-titres JP discrets.
- **État live du bot** affiché en temps réel (`useLiveBotState` → personas
  online / stats). Composants : `HomeExperience.tsx`, `SceneBackdrop.tsx`.

### Header (`SiteNav.tsx`)
- Sticky top-0, hauteur 64px
- Surface : `rgba(10,10,10,0.82) + backdrop-blur-xl + backdrop-saturate-150`
- Hairline doré : `border-b border-[rgba(255,178,0,0.18)]`
- Wordmark "DB**FR**" : Oswald 700 24px, tracking `0.06em`, "FR" en doré
  signature DB Official
- Nav : Oswald 14px 600 uppercase, tracking `0.10em`, hover → doré
- Mobile : hamburger morphing croix + drawer fullscreen fond noir 97% opacité

### Footer (`SiteFooter.tsx`)
- Surface `#070707` (légèrement plus dark que le bg pour ancrage)
- 3 colonnes : Explorer / Communauté / Légal
- Copyright très petit (12px text-white/45) — mention complète ayants droit
  + lien `/credits`

### Cards
- Surface : `bg-white/[0.04] border border-white/[0.06] rounded-xl`
- Hover : `border-dbz-orange/60` (le doré illumine au survol)
- Padding : `p-5` standard, `p-8` pour hero/CTA cards
- Pas de drop-shadow lourde — préférer border-color shifts

### Boutons CTA
- Pill arrondie : `rounded-full h-12 px-7`
- Primaire : `bg-dbz-orange hover:bg-white text-black font-bold tracking-[0.10em] uppercase`
- Secondaire : `border border-white/20 hover:border-dbz-orange text-white`
- Pas de gradient bouton (réservé aux héros titres avec `.title-jagged`)

### Badges
- Pill compact : `text-[11px] font-display font-semibold tracking-[0.10em] uppercase`
- Couleurs : `bg-dbz-orange/15 text-dbz-orange` pour platforms/races

### Image attribution
Toutes les images servies via `/db/*` exposent des headers HTTP :
`X-DB-Attribution: © Toei Animation`, `X-DB-License: FAIR-USE-EDITORIAL`,
`X-DB-Source: toei-animation`, `X-DB-Served-Variant: avif|webp`. Le composant
front peut lire ces headers pour afficher tooltip de crédit au hover.

---

## 7. Format & optimisation

- **AVIF** prioritaire (-60% vs JPG) → fallback WebP → fallback original
- Content-Negotiation côté bot (`/db/*` lit `Accept:` header)
- Cache `public, max-age=31536000, immutable` + `Vary: Accept`
- Vercel CDN respecte le immutable → edge cache global 1 an
- Next/Image config (`next.config.ts`) :
  `formats: ['image/avif', 'image/webp']`
- `loading="lazy"` par défaut sauf hero (priority)
- Toujours `sizes` correct pour responsive (économie bandwidth massive)

---

## 8. Règles dures (do / don't)

### À faire
- **Hierarchy first** : un titre énorme, un lead court, des CTAs visibles
- **Espace négatif généreux** : `py-16 lg:py-24` minimum entre sections
- **Cohérence palette** : si tu poses du doré, c'est `--color-dbz-orange` —
  pas `text-yellow-300`, pas `#FFD700`
- **Bilingue FR/JP discret** : titre français principal + nom japonais en
  sous-titre `font-jp text-dbz-orange/80`
- **Mention source visible** sur chaque page de contenu (fiche perso, film,
  jeu) : "Source : MyAnimeList via Jikan API" en bas, 12px gris
- **Mobile-first** : tester sur 375px d'abord, desktop est l'amélioration

### À éviter
- ❌ Lettre initiale dans rond coloré comme avatar fallback (interdit, voir
  commit `fix(site): zéro placeholder`)
- ❌ "???" ou "Aucun résultat" comme valeur par défaut
- ❌ `placeholder="blur"` dataURL pré-générés (ralentit le build, pas notre style)
- ❌ Couleurs Discord (`#5865F2`) sur le site grand public — Dragon Ball
  prime
- ❌ Polices fan-art (`SaiyanSans` jagged) sur paragraphes corps
- ❌ Emoji décoratifs (⚔📖💎🏆) — supprimés du landing en commit dédié
- ❌ Phrases hallucinations tech (« 6 dieux 1 process », « Architecture mono-process »)
- ❌ Mention du bot Discord en premier sur la home → DB doit primer

---

## 9. Sources d'inspiration (analyses live)

Captures dans `reference/db-recon/`. Analyse exécutée le 2026-05-16 :

| Site | Apport pour notre design |
|---|---|
| `fr.dragon-ball-official.com` | Police **Oswald**, palette noir/jaune/rouge, structure éditoriale |
| `www.toei-animation.com/catalog/dragon-ball/` | Layout catalog cards grille, hover gold |
| `en.bandainamcoent.eu/dragon-ball` | Hero gaming banners full-width, CTAs orange grands |
| `design.google` | Typographie editorial Roboto Flex, espacement vertical, max-width 1440 |
| `dragonball.fandom.com` | Densité info encyclopédique (à NE PAS copier — trop chargé) |

---

## 10. Implémentation actuelle

| Composant | Fichier | Statut |
|---|---|---|
| Palette + tokens | `apps/site/src/app/globals.css` | ✅ DB Official |
| Polices | `apps/site/src/app/layout.tsx` | ✅ Roboto Flex + Oswald + Noto JP |
| Header | `apps/site/src/components/SiteNav.tsx` | ✅ 2026 sticky glass |
| Mobile nav | `apps/site/src/components/MobileNav.tsx` | ✅ drawer fullscreen |
| Footer | `apps/site/src/components/SiteFooter.tsx` | ✅ 3 cols + copyright |
| Hero landing | `apps/site/src/components/landing/LandingHero.tsx` | ✅ DB-first copy |
| Univers grid | `apps/site/src/components/landing/UniverseGrid.tsx` | ✅ 6 piliers DB |
| Cards persos | `apps/site/src/components/landing/CharactersTeaser.tsx` | ✅ filtrées sans placeholder |
| Pages wiki | `apps/site/src/app/wiki/{sagas,films,jeux,episodes,search}/` | ✅ 5 listes + 3 détails |
| Pages légales | `apps/site/src/app/{credits,licence}/page.tsx` | ✅ DMCA contact + licences |
| Image pipeline | `apps/bot/scripts/optimize-assets.sh` + Content-Negotiation | ✅ AVIF/WebP/original |

---

**Référence finale** : ce document est la source de vérité du design system.
Toute nouvelle page Next.js doit s'y conformer. Avant d'ajouter une couleur,
une police, un composant — vérifier qu'il s'aligne sur ces principes.


---

<a name="gemini-md"></a>
## 📄 Fichier : `GEMINI.md`

**Titre original :** GEMINI.md

### GEMINI.md

This repository's operating guide is **[CLAUDE.md](./CLAUDE.md)** — read it first.

`GEMINI.md` is intentionally a thin pointer (deduplicated 2026-06-04): the Gemini
CLI and Claude Code share one source of truth instead of maintaining drifting
copies. The line below imports CLAUDE.md for Gemini CLI's context loader.

@CLAUDE.md

---

<a name="memory-md"></a>
## 📄 Fichier : `MEMORY.md`

**Titre original :** Shenron Monorepo — Learning Memory

### Shenron Monorepo — Learning Memory

## 1. Drizzle Schema Pushes with Custom Postgres Schemas
* **Issue:** In PostgreSQL, Drizzle Kit targets the `"public"` schema by default. When using custom schemas (e.g., `"bot"`), configuring `schemaFilter` in `drizzle.config.ts` causes Drizzle Kit to detect untracked tables created dynamically by the bot/sync scripts (such as `invites_log`, `jails`, `users`) and prompt to drop them, risking massive data loss.
* **Solution:** Avoid running `drizzle-kit push` on database environments with dynamic custom schemas unless the schemas are fully mapped. Instead, apply schema changes using raw SQL migration queries (e.g. `ALTER TABLE bot.db_movies ADD COLUMN IF NOT EXISTS ...`).

## 2. BXC Scraping under Cloudflare
* **Issue:** French manga scan portals (`lelscanfr.com`, `scan-vf.net`) block standard HTTP fetch requests with HTTP 403.
* **Solution:** Use Bxc's headless browser engine via `bxc recon <url> --profile static --json` to bypass Cloudflare and retrieve the structured image asset links.

## 3. Agent Browser Sandbox in Virtual Environments
* **Issue:** Running browser automation inside VM environments fails with Chrome FATAL zygote sandbox errors.
* **Solution:** Always invoke the browser using the `--args "--no-sandbox"` flag (e.g., `agent-browser open <url> --args "--no-sandbox"`) to ensure successful launches.

## 4. TypeScript Union Inference with fetch Headers
* **Issue:** When conditionally defining fetch headers as `ref ? { Referer: ref, Origin: new URL(ref).origin } : {}`, TypeScript infers the union type `{ Referer: string; Origin: string; } | { Referer?: undefined; Origin?: undefined; }`. When passed to `fetch(..., { headers })`, TS throws a TS2769 compilation error because the empty object structure fails index signature checks on `HeadersInit`.
* **Solution:** Explicitly type the headers dictionary as `Record<string, string>` (e.g. `const headers: Record<string, string> = {}` and conditionally populate it) to ensure clean compatibility with `HeadersInit`.

## 5. Bun Spawn Executable Path in systemd Services
* **Issue:** Spawning subprocesses via `Bun.spawn` with a raw executable name (e.g. `"bun"`) fails with `ENOENT` under systemd due to minimal `PATH` environments.
* **Solution:** Always use the absolute executable path (e.g. `/home/ubuntu/.bun/bin/bun`) for Bun when spawning background tasks from the bot service or associated scripts (such as `resolve-streams.ts` or `server.ts`).

## 6. HLS Proxying for Progressive MP4 Sources
* **Issue:** When resolving streams dynamically, some players return progressive MP4 files instead of HLS playlists. Parsing these as text playlists (`up.text()`) causes server memory spikes/leaks, parsing failures, and broken video downloads.
* **Solution:** Intercept the stream type (`type === "mp4"`) before any text parsing occurs, and stream the response body directly to the client with appropriate headers (`video/mp4` and attachment disposition). Enhance the frontend player (using Hls.js) to fall back to native video element source loading if it encounters a fatal error during manifest parsing.

## 7. ESLint 9 Flat Config & FlatCompat under Bun
* **Issue:** Under ESLint 9 with Bun, using `@eslint/eslintrc` `FlatCompat` to wrap legacy configurations (like `eslint-config-next`) fails with a cryptic `TypeError: JSON.stringify cannot serialize cyclic structures` when any validation error occurs (such as using `basePath` instead of `baseDirectory`).
* **Solution:** Migrate to a native ESLint 9 Flat Config array format. For Next.js projects, import and spread `eslint-config-next` directly (e.g., `...nextConfig`) as it natively supports Flat Config format, and override rules in a subsequent flat config block.

## 8. Missing `tsup` Monorepo Dependencies on Remote Environments
* **Issue:** Internal package directories inside a Turborepo monorepo can use build tools (like `tsup`) that are expected to be available globally or via the root workspace. If missing from the root `devDependencies` or the Bun dependencies catalog, remote build environments (like Vercel or compilation containers) will fail with `command not found: tsup` errors during `turbo run build`.
* **Solution:** Explicitly define and pin `tsup` in the root workspace `devDependencies` or monorepo dependency catalog to ensure availability during remote Turbo builds.

## 9. Systemd Protected Namespaces and Directory Initialization
* **Issue:** Systemd services configured with namespace directories or sandboxing parameters (e.g., `ReadWritePaths=` or `ProtectSystem=`) will crash with a `226/NAMESPACE` startup error if any of the target directories inside the sandbox (such as a local `.bun-cache` folder inside the workspace) do not exist on the filesystem.
* **Solution:** Ensure that all directories mapped in systemd configuration files (or folders where runtime engines automatically cache outputs) are pre-initialized during installation/deployment scripts (e.g. `mkdir -p apps/bot/.bun-cache`).

## 10. Bun Bundler Asset Resolution in HTML Templates
* **Issue:** Bun allows importing `.html` files directly in TypeScript, which triggers automatic bundling of all referenced assets in the HTML file. However, if a previous build step modified the HTML template to point to dynamic/hashed output assets (e.g., `<link href="./bot/dashboard-vdfat6mt.css">`), subsequent compilation attempts fail with `Could not resolve` errors.
* **Solution:** Maintain the HTML template with references only to original source asset files (`./src/dashboard/styles.compiled.css`) and restore it (e.g., via `git checkout`) before running compiler/bundler commands.




---

<a name="plan-md"></a>
## 📄 Fichier : `PLAN.md`

**Titre original :** PLAN.md — RAG canon (bxc) + LLM Dragon Ball (aphrody)

### PLAN.md — RAG canon (bxc) + LLM Dragon Ball (aphrody)

> Roadmap exécutable pour porter le RAG Dragon Ball au niveau « corpus canon complet »
> via **bxc** (moteur de scraping), puis bâtir un **assistant LLM Dragon Ball** via
> **aphrody** (gateway Google AI : Gemini / Antigravity / NotebookLM). Chaque phase est
> autonome, vérifiable, et livrable indépendamment.

État au démarrage de ce plan : le RAG runtime est déjà **SOTA** (récupération hybride
BM25 + embeddings denses multilingues, fusion RRF, puis reranking cross-encoder — cf.
`apps/bot/src/lib/rag.ts`, commits `100a8a3` + `eaa3fd8`). Ce qui manque pour « le
meilleur RAG possible » n'est plus l'algorithme mais **le corpus** (1041 chunks, surtout
de la donnée structurée) et **la génération** (réponses en langage naturel). Ce plan
adresse exactement ces deux manques.

---

## 0. Contraintes dures (à garder en tête partout)

| Contrainte | Impact sur le plan |
|---|---|
| **VPS CPU-only** (Cirrus virtuel, pas de GPU) | Pas de fine-tuning/entraînement from-scratch on-VPS. Fine-tune = **GPU loué** (RunPod / Vast.ai / Modal) ou **distillation + RAG-grounded** (sans entraînement). Inférence d'un modèle 2-3B quantifié GGUF en CPU = viable mais lente. |
| **aphrody n'est pas un trainer** | C'est un client Google AI (`antigravity chat`, `gemini`, `notebooklm`, `chat`, `agent`). Il sert à **générer** (distillation de dataset, réponses grondées) — pas à entraîner des poids. |
| **bot à `MemoryMax=1.5G`** | Tout modèle (embeddings, reranker, LLM) vit dans un **sidecar isolé**, jamais dans le process bot. Pattern déjà établi : `shenron-embed.service`. |
| **Ayants droit officiels** (Bandai/Shueisha/Toei — cf. profil owner) | Accès légitime aux sources canon. **Préserver l'attribution** (`db_sources`/`db_licenses`) à chaque chunk. Respecter robots.txt / ToS des sources tierces, proxy résidentiel pour les IP datacenter filtrées (`dragonball.news`, `bandai`). |
| **Wiki = Neon source de vérité, SQLite = replica** | Le corpus RAG (`rag_chunks`/`rag_vectors`) est **dérivé local** (pas du wiki éditorial) — pas concerné par les gardes `wiki-write-guard`. Mais les sources scrapées qui enrichissent `db_*` passent par Neon (`/api/wiki-admin`). |
| **Coûts API Gemini** | La distillation (B3) peut générer des dizaines de milliers d'appels. Budgétiser, batcher, cacher, et plafonner. |

---

## PARTIE A — « Entraîner » le RAG : ingénierie de corpus via bxc

> « Train the RAG » ≠ entraîner un modèle. C'est **construire le meilleur corpus indexable
> possible** : couverture canon maximale, chunks propres et sémantiquement cohérents,
> métadonnées riches, et ré-indexation continue. La qualité du RAG est désormais bornée
> par le corpus, pas par l'algo.

Fondations déjà en place à étendre : `apps/bot/scripts/rag-recon.ts` (bxc recon → `data/rag/<slug>.md` + `corpus.json`), `apps/bot/scripts/ingest/bxc-ingest.ts`, `apps/bot/scripts/rag-build.ts` (chunk + embed + rerank-ready).

### A0 — Baseline & harnais d'évaluation *(préalable non négociable)*
- Construire un **gold set** : 50-100 questions FR réalistes (langage naturel, paraphrases, noms JP) → doc(s) attendu(s). Fichier `apps/bot/tests/rag-gold.jsonl` (`{query, expected_urls[], expected_kinds[]}`).
- Script d'éval `apps/bot/scripts/rag-eval.ts` : pour chaque question, lance `hybridSearch` (et les 3 modes : lexical / hybrid / hybrid+rerank) et calcule **Recall@{1,3,5,10}**, **MRR**, **nDCG@10**.
- **Mesurer la baseline AVANT tout changement de corpus.** Tout commit d'enrichissement doit améliorer (ou ne pas régresser) ces métriques → **gate CI**.
- Livrable : `apps/bot/reports/rag-eval-baseline.md`.

### A1 — Inventaire des sources & priorisation canon
- Lister depuis `db_sources` + compléter. **Priorité canon décroissante** :
  1. **Kanzenshuu** (Daizenshuu, guides, traductions de référence) — la bible fan canon.
  2. **Fandom** FR + EN + JA (`dragonball.fandom.com`) — personnages, sagas, techniques, épisodes (déjà partiellement ingéré : `ingest-fandom-*.ts`).
  3. **Officiel** : `dragon-ball-official.com` (FR/EN), `dragonball.jp`, Toei, Shueisha, Bandai (catalogues jeux), Viz/Shonen Jump+ (résumés manga).
  4. **Bases tierces** : `dragonball-api.com`, AniList/Jikan/Kitsu (métadonnées épisodes/films).
- Tagger chaque source : `license_key`, langue, type de contenu (lore / épisode / manga / jeu / news), fragilité (cert/IP).
- Livrable : `reference/db-recon/SOURCES-RAG.md` (matrice source × couverture × licence × stratégie de fetch).

### A2 — Récolte via bxc *(le cœur « bxc »)*
- Étendre `rag-recon.ts` → `rag-harvest.ts` orchestrant les bons sous-outils bxc selon la source :
  - `bxc recon <url>` → HTML propre → Markdown (pages lore).
  - `bxc scrape --selector <css>` → extraction ciblée (tableaux de techniques, listes d'épisodes).
  - `bxc mirror <url>` → site entier (sources compactes officielles).
  - `bxc search "<requête>"` → découverte de pages canon manquantes.
  - `bxc crawl-worker` (daemon 24/7) → crawl récursif borné par domaine pour la couverture de masse.
- Profils : `static|fast|http|stealth|max` selon l'anti-bot (cf. `BXC_PROFILE`). **Proxy résidentiel** (`--proxy`) pour `dragonball.news` / `bandai` (IP datacenter VPS filtrée).
- Discipline : rate-limit + backoff, `bxc har` pour rejouer/déboguer, jamais d'écriture destructive.
- Sortie : `apps/bot/data/rag/raw/<source>/<page>.md` + manifeste `harvest.json` (url, source_id, license, lang, fetched_at, hash).
- Livrable : corpus brut versionné (hash-tracké), rapport de couverture vs A1.

### A3 — Nettoyage & normalisation
- Strip boilerplate (nav, pubs, "modifier", catégories Fandom), normaliser le markdown.
- **Déduplication** cross-source : MinHash/SimHash sur shingles → fusionner les quasi-doublons (FR/EN qui se recouvrent), garder la version la plus riche + cumuler les attributions.
- **Canonicalisation des entités** : aliasing des noms (Son Goku = Sangoku = Kakarot = 孫悟空) via une table d'alias → meilleur rappel cross-langue.
- Détection de langue par chunk (champ `lang`).
- Livrable : `data/rag/clean/*.md` + `alias-map.json`.

### A4 — Chunking sémantique *(remplace le découpage naïf 900 chars)*
- Découpage **phrase-aware** par fenêtres de 256-512 tokens avec **overlap** 15 %, respectant les frontières de section (titres markdown).
- Métadonnées par chunk : `source_id`, `license_key`, `lang`, `entity` (résolu via alias-map), `section`, `url` profond.
- Garder la donnée structurée `db_*` (déjà excellente) comme chunks « fiche » + ajouter les chunks « narratif » du corpus.
- Livrable : `corpus.json` v2 (schéma enrichi) + `rag-build.ts` adapté pour ingérer ces métadonnées dans `rag_chunks` (colonnes `lang`, `source_id`, `entity`).

### A5 — Embeddings & index
- `rag:build` ré-embed tout (`multilingual-e5-small` actuel). **Décision de scale** :
  - Corpus < ~20 k chunks → brute-force cosine actuel reste optimal (zéro changement).
  - Corpus > ~50 k chunks → passer à `sqlite-vec` (ANN) ou monter le modèle (`bge-m3`, `multilingual-e5-base` 768d) si l'éval le justifie. Décider **par les métriques A0**, pas par dogme.
- Reranker déjà en place (`bge-reranker-base`) — réévaluer `bge-reranker-v2-m3` si gain mesuré.
- Livrable : `rag_vectors` reconstruit + `rag_meta` versionné.

### A6 — Évaluation & A/B
- Relancer `rag-eval.ts` → comparer à la baseline A0. Cibles : **Recall@5 ≥ 0.9**, **MRR ≥ 0.8** sur le gold set.
- Ablations : lexical vs hybrid vs hybrid+rerank ; impact taille corpus ; impact modèle.
- Livrable : `apps/bot/reports/rag-eval-<date>.md` + verdict go/no-go.

### A7 — Rafraîchissement continu
- `bxc crawl-worker` en daemon + nouveau timer `shenron-rag-refresh.timer` (hebdo) → fetch incrémental (par hash), re-chunk des pages changées, **ré-embed incrémental** (seulement les nouveaux/modifiés chunks).
- News : déjà `sync-news.ts` ; brancher l'ingest news dans le corpus RAG.
- Livrable : `deploy/systemd/shenron-rag-refresh.{service,timer}` + doc.

### A8 — Garde-fous
- **Attribution préservée** end-to-end (du chunk au snippet affiché) ; respect robots/ToS ; proxy pour les sources sensibles.
- **Gate qualité** : aucun déploiement de corpus si l'éval régresse (CI).
- Pas de fuite de contenu sous copyright dans des réponses verbatim longues (la génération B cite + paraphrase).

---

## PARTIE B — Assistant LLM Dragon Ball via aphrody

> Objectif produit : `/ask` (Discord) et une page `/ask` (site) qui répondent en **langage
> naturel**, en **voix de persona**, **grondées sur le RAG** (zéro hallucination, citations).
> Plus, à terme, un **modèle fine-tuné** propre. aphrody est le gateway de génération.

### B0 — Matrice de décision (quel « LLM » ?)

| Approche | Entraînement | Infra | Délai | Qualité | Coût récurrent |
|---|---|---|---|---|---|
| **B1 RAG-grounded (Gemini via aphrody)** | aucun | aphrody → Google AI | **jours** | très haute (Gemini 2.x) | appels API |
| **B2 NotebookLM** | aucun | aphrody notebooklm | jours | haute (grondé sources) | quota Google |
| **B4 Fine-tune LoRA open model** | GPU loué | dataset B3 + RunPod | semaines | haute, **souveraine, offline** | GPU one-shot + inférence CPU |

**Recommandation** : livrer **B1 maintenant** (valeur immédiate, c'est le vrai « LLM Dragon Ball » au sens produit), construire **B3 (dataset)** en parallèle comme actif, garder **B4 (fine-tune)** comme objectif souveraineté/offline activable quand le dataset est mûr.

### B1 — RAG-grounded generation *(SHIP EN PREMIER)*
- Nouveau module `apps/bot/src/lib/llm.ts` : `answer(question, persona)` =
  1. `hybridSearch(db, question, 8)` → passages (déjà SOTA).
  2. Construire un **prompt grondé** : contexte = passages cités + consignes anti-hallucination (« réponds UNIQUEMENT à partir du contexte ; si absent, dis-le ; cite les sources »).
  3. Génération via **`aphrody antigravity chat --model gemini-2.x --prompt <f>`** en sous-process (JSON out), parse `candidates[0].content`. Fallback `aphrody gemini` / `aphrody chat`.
  4. Post-traitement : injecter les liens sources, ton de la **persona** (Whis/Shenron — réutiliser les fiches persona skills).
- Sidecar dédié optionnel `shenron-llm.service` si on veut isoler/cacher (sinon appel direct aphrody depuis le bot, court-circuit réseau local).
- Brancher dans `/ask` (Discord) → réponse rédigée + sources (au lieu de la liste brute actuelle), et nouvelle page site `/ask` (streaming SSE).
- **Garde-fous** : timeout + dégradation vers la liste RAG brute actuelle si la génération échoue (jamais de régression). Cache des réponses (clé = hash question) pour coût + latence.
- Éval : faithfulness (la réponse est-elle dérivable du contexte ?), exactitude canon vs gold, cohérence persona.
- Livrables : `lib/llm.ts`, `/ask` v2, page site `/ask`, `reports/llm-eval-b1.md`.

### B2 — NotebookLM comme cerveau grondé *(alternative / complément éditorial)*
- `aphrody notebooklm create` → notebook « Dragon Ball Canon ».
- `aphrody notebooklm upload` → pousser le corpus A (URLs + `.md`) comme sources.
- `aphrody notebooklm chat` → Q/R grondées ; `generate`/`download` → artefacts (audio overview FR, study guides) réutilisables côté site/Discord.
- Usage : back-office éditorial (vérification canon, génération de synthèses), pas le hot-path runtime.
- Livrable : notebook provisionné + script `scripts/notebooklm-sync.ts` (upload corpus).

### B3 — Dataset d'instruction (distillation) *(l'actif pour B4)*
- Générer un dataset SFT Dragon Ball depuis le corpus A via **`aphrody antigravity chat` (Gemini)** :
  - Pour chaque entité/chunk → générer N paires `{instruction, input, output}` (questions factuelles, comparaisons de puissance, chronologie, « explique X », réécriture en voix de persona).
  - Schéma JSONL `apps/bot/data/llm/dbz-sft.jsonl` : `{instruction, input, output, persona, lang, source_urls[], quality}`.
- Qualité : filtrage (longueur, refus, doublons via embeddings), **grounding** (chaque output traçable à des sources), split train/val/test.
- Volume cible : 20-50 k exemples FR (+ sous-ensemble EN/JA).
- Script `scripts/llm/build-sft-dataset.ts` (batché, repris sur interruption, plafond de coût).
- Livrable : dataset versionné (hors git si volumineux — stockage objet) + `reports/dataset-card.md`.

### B4 — Fine-tune (off-VPS, GPU loué) *(souveraineté / offline)*
- **Base** : modèle ouvert multilingue petit — `google/gemma-2-2b-it` ou `Qwen/Qwen2.5-3B-Instruct` (bon FR+JP, quantifiable, inférence CPU viable).
- **Méthode** : LoRA/QLoRA via **Unsloth** ou **llama-factory** sur GPU loué (RunPod/Vast.ai/Modal, ~A10/A100 quelques heures). Dataset = B3.
- **Sortie** : merge LoRA → quantize **GGUF q4_k_m** (llama.cpp).
- **Eval** : perplexité + benchmark canon (gold set), comparaison vs B1 (Gemini) — n'adopter B4 que si l'écart qualité/coût/souveraineté le justifie.
- Livrable : `dbz-<base>-lora.gguf` + carte modèle.

### B5 — Service d'inférence on-VPS *(si B4 adopté)*
- `shenron-llm.service` : serveur **llama.cpp** (`llama-server`) chargeant le GGUF, loopback, MemoryMax dédié (2-3B q4 ≈ 2-3 Go RAM). On a la RAM (23 Go libres).
- `lib/llm.ts` route vers le LLM local (même contrat que B1) → **assistant 100 % souverain, offline, sans coût API**.
- Garder Gemini (B1) en fallback qualité.
- Livrable : unit systemd + bascule config (`LLM_BACKEND=local|gemini`).

### B6 — Évaluation & sûreté (transverse B)
- **Faithfulness / anti-hallucination** : la réponse doit être dérivable du contexte RAG (éval type RAGAS : answer-relevance, faithfulness, context-precision).
- **Exactitude canon** vs gold set ; **refus** sur hors-canon (« je n'ai pas cette info dans les archives »).
- **Cohérence persona** (Whis ≠ Beerus ≠ Shenron).
- Tests automatisés `apps/bot/tests/llm-*.test.ts`, gate avant deploy.

---

## Séquencement & jalons

| Jalon | Contenu | Dépend de | Sortie mesurable |
|---|---|---|---|
| **M1** | A0 (éval) + B1 (RAG-grounded `/ask` v2) | RAG SOTA (fait) | gold set + `/ask` répond en FR grondé |
| **M2** | A1→A6 (corpus canon complet via bxc) | M1 | Recall@5 ≥ 0.9, corpus ≥ 10× chunks |
| **M3** | A7 (refresh continu) + B2 (NotebookLM) | M2 | timer hebdo + notebook canon |
| **M4** | B3 (dataset distillation) | M2 (corpus) | `dbz-sft.jsonl` 20-50k, dataset-card |
| **M5** | B4 + B5 (fine-tune + service local) | M4 | GGUF déployé, assistant offline souverain |

**Chemin critique court (valeur immédiate)** : M1 → M2. Le fine-tune (M5) est optionnel/souveraineté.

## KPIs

- **RAG** : Recall@5, MRR, nDCG@10 (gold set) ; couverture corpus (entités canon couvertes %) ; fraîcheur (âge médian des chunks).
- **LLM** : faithfulness, exactitude canon, taux de refus correct (hors-canon), latence p50/p95, coût/req (B1) vs 0 (B5).
- **Produit** : usage `/ask`, satisfaction, part de réponses avec sources cliquées.

## Risques & mitigations

| Risque | Mitigation |
|---|---|
| IP VPS filtrée par sources | proxy résidentiel `--proxy`, profils stealth/max, `bxc har` debug |
| Coût Gemini (distillation) | batch + cache + plafond ; NotebookLM en alternative quota |
| Hallucination LLM | grounding strict + faithfulness gate + refus hors-contexte + fallback liste RAG |
| Pas de GPU | GPU loué one-shot (B4) ; sinon B1/B5 suffisent |
| Régression corpus | gate éval (A0) en CI, build idempotent reconstruisible |
| Droits/attribution | attribution par chunk préservée, paraphrase (pas de verbatim long), robots/ToS |

## Carte fichiers & commandes (récap)

```
apps/bot/
  scripts/
    rag-recon.ts            # existant — bxc recon → corpus (A2, à étendre en rag-harvest.ts)
    ingest/bxc-ingest.ts    # existant — ingest bxc
    rag-build.ts            # existant — chunk + embed (A4/A5)
    rag-eval.ts             # NOUVEAU — Recall@k/MRR/nDCG (A0/A6)
    llm/build-sft-dataset.ts# NOUVEAU — distillation Gemini → JSONL (B3)
    notebooklm-sync.ts      # NOUVEAU — upload corpus → NotebookLM (B2)
  src/lib/
    rag.ts                  # existant — pipeline hybride+rerank (runtime)
    embeddings.ts           # existant — modèles (sidecar only)
    llm.ts                  # NOUVEAU — answer(question, persona) grondé (B1/B5)
  tests/
    rag-gold.jsonl          # NOUVEAU — gold set (A0)
    llm-*.test.ts           # NOUVEAU — faithfulness/persona (B6)
  data/
    rag/{raw,clean}/        # corpus brut/propre (A2/A3)
    llm/dbz-sft.jsonl       # dataset SFT (B3)
deploy/systemd/
    shenron-rag-refresh.*   # NOUVEAU — refresh hebdo (A7)
    shenron-llm.service     # NOUVEAU — llama.cpp local (B5, si B4)
```

```bash
### A — corpus
bun apps/bot/scripts/rag-eval.ts                    # baseline / mesure (A0/A6)
BXC_DIR=/home/ubuntu/bxc bun apps/bot/scripts/rag-recon.ts   # récolte (A2)
bun --filter @shenron/bot run rag:build             # chunk + embed (A4/A5)
sudo systemctl restart shenron                      # recharge l'index

### B — LLM
aphrody antigravity chat --model gemini-2.0-flash --prompt "<grounded prompt>" | jq '.candidates[0].content'  # B1/B3
aphrody notebooklm create / upload / chat           # B2
### fine-tune off-VPS (RunPod) → GGUF → shenron-llm.service (B4/B5)
```

---

*Plan vivant — cocher/mettre à jour au fil des jalons. Source de vérité runtime : `apps/bot/src/lib/rag.ts`. Contexte : `CLAUDE.md` (sections RAG hybride, sidecar, GraphQL/OpenAPI).*


---

<a name="prompt-md"></a>
## 📄 Fichier : `PROMPT.md`

**Titre original :** PROMPT.md — Sprint DBFR (Shenron bot + site public)

### PROMPT.md — Sprint DBFR (Shenron bot + site public)

**Mission** : boucler en parallèle (Claude Code + Gemini) tous les bugs bot + un nouveau site public communautaire DBFR, lié au Discord. Objectif 30 min. Pas de questions, pas de plan, pas d'`ExitPlanMode` — décide et exécute. Mode autonome maximal (cf. `~/.claude/CLAUDE.md`).

## Contexte source

Conversation Discord entre Yoyo (dev) et Omar / kazu_solo (admin DBFR). Demandes consolidées ci-dessous.

### Bugs bot à corriger (Track A — Claude Code)

1. **`/jail` retourne `Missing Permission`**. Vérifier :
   - Hiérarchie de rôle `jailRoleId` vs rôle bot Enma sur la guild.
   - Permission `ManageRoles` côté persona Enma (`DISCORD_TOKEN_ENMA`).
   - Scope OAuth `bot + applications.commands` à l'invite (cf. CLAUDE.md "scope OAuth `applications.commands`").
   - Fichier : `src/commands/Jail.ts`, `src/services/JailService.ts`.

2. **Shop attribue le rôle direct au membre au lieu de l'inventaire**.
   - L'achat **doit créer une entrée `inventory`** (type `role_title` / `role_color` / `banner`), **pas** appeler `member.roles.add()`.
   - L'attribution réelle se fait via une commande séparée `/inventaire equip <item>`.
   - Fichiers : `src/commands/Shop.ts`, `src/services/ShopService.ts`, schema `inventory`.

3. **Shop embed = texte plat, sans previews**.
   - Ajouter preview bannière (rendu via `CardService` ou ratio asset).
   - Couleur rôle dans `embed.color` (lire `role.color`).
   - Mention rôle titre `<@&id>` dans la description.

4. **Dashboard : pas de role picker** sur Settings / Levels / level-rewards.
   - Remplacer les `<input>` ID rôle bruts par `<select>` peuplé live.
   - Nouvelle route API : `GET /api/bots/shenron/guild/roles` (auth Bearer admin) → `[{ id, name, color, position, managed }]`.
   - Pages dashboard : `src/dashboard/pages/Settings.tsx`, `Levels.tsx`.

5. **Bannières niveaux** : 19 images fournies par Omar à intégrer.
   - Copier dans `assets/banners/` (gitignored).
   - Seed `level_rewards` correspondants via `bun run db:seed-all` (étendre le seed si nécessaire).
   - Régénérer cache `BackgroundCacheService`.

### Routes API publiques à ajouter (Track A)

À exposer depuis `apps/shenron/src/api/` pour le site (CORS allowlist `https://dbfr.fr`, `https://dragonballfr.com` (ex- `shenron.rpbey.fr` / `dbfr.vercel.app`, legacy)).

- `GET /api/public/user/:discordId` → `{ level, xp, zeni, banner, achievements, inventory }` (read-only, rate-limit 60 req/min/IP, **pas d'auth**).
- `GET /api/public/shop` → catalogue items publics.
- `GET /api/public/leaderboard?limit=100` → top XP.
- `GET /api/bots/shenron/guild/roles` (auth Bearer admin) → role picker dashboard.

### Site public DBFR (Track B — Gemini)

**Stack** : Next.js 15 App Router + Tailwind v4 + shadcn/ui new-york + Prisma → Neon + next-auth Discord provider. Deploy **Vercel** (jamais sur le VPS, cf. `~/vps/CLAUDE.md`).

**Repo cible** : nouveau submodule `apps/dbfr-site` pointant sur `github.com/rose-griffon/dbfr` (à créer).

#### Pages publiques

| Route | Contenu |
|---|---|
| `/` | Blog feed (10/page, tri date desc, cover + excerpt + auteur + date) |
| `/post/[slug]` | Article markdown rendu (`react-markdown` + `remark-gfm`) + commentaires (auth requis) |
| `/wiki` | Arbre catégories/sous-catégories paramétrable, sidebar nav |
| `/wiki/[...slug]` | Page wiki rendue, breadcrumb |
| `/about` | Page MDX statique courte |
| `/shop` | Vitrine items (read `GET /api/public/shop` shenron). Achat reste sur Discord. |
| `/profil/me` ou `/profil/[discordId]` | Profil mirror Discord : XP, zéni, level, bannière, succès, inventaire (read `GET /api/public/user/:id`) |
| `/admin/*` | CMS posts + wiki + catégories (guard role admin) |

#### Composant global

**`<DiscordInviteFAB />`** : bouton flottant `bottom-left`, présent sur toutes pages.
- CTA : "Rejoindre le Discord" → `https://discord.gg/<INVITE>`.
- `❌` top-right du FAB pour dismiss.
- Persistance `localStorage.dbfr_fab_dismissed`.
- Animation glow pulse violet/bleu.

#### Schéma Prisma

```prisma
model User {
  id          String   @id @default(cuid())
  discordId   String   @unique
  username    String
  avatar      String?
  roleAdmin   Boolean  @default(false)
  createdAt   DateTime @default(now())
  posts       Post[]
  comments    Comment[]
}

model Post {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  cover       String?
  excerpt     String
  body        String   @db.Text
  published   Boolean  @default(false)
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  comments    Comment[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Comment {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  body      String
  createdAt DateTime @default(now())
}

model WikiCategory {
  id        String         @id @default(cuid())
  parentId  String?
  parent    WikiCategory?  @relation("CategoryTree", fields: [parentId], references: [id])
  children  WikiCategory[] @relation("CategoryTree")
  name      String
  slug      String         @unique
  order     Int            @default(0)
  pages     WikiPage[]
}

model WikiPage {
  id          String        @id @default(cuid())
  categoryId  String
  category    WikiCategory  @relation(fields: [categoryId], references: [id])
  title       String
  slug        String        @unique
  body        String        @db.Text
  order       Int           @default(0)
  updatedAt   DateTime      @updatedAt
}
```

## Charte graphique (NON NÉGOCIABLE)

- **Fond noir** : base `#0a0a14`, gradient radial subtil vers `#1a0d2e`.
- **Texte blanc** : body `#f5f5ff`, titres `#ffffff`.
- **Accents bleu + violet** : gradient principal `linear-gradient(135deg, #4a5cff 0%, #8b4dff 100%)` sur CTA, focus rings, badges actifs.
- **Esthétique galactique** : starfield CSS (particles légères ou SVG noise), glow/halo sur hover, nebula radial blobs décoratifs (`mix-blend-mode: screen`, low opacity).
- **Interdits absolus** : fond blanc, palette Discord brute (`#5865F2` flat), Material flat, neumorphism.
- **Typographie** : `Inter` (UI) + `Space Grotesk` (titres) via `next/font/google`.

## Contraintes dures

- **Pas de `bun run build`** sur shenron avant restart — corrompt `dashboard.html` (cf. CLAUDE.md). Préférer `sudo systemctl restart shenron`.
- **Site = Vercel uniquement**, jamais VPS (cf. `~/vps/CLAUDE.md` "Workflow PRODUCTION").
- **Commits FR 1-ligne conventional** (`feat|fix|chore(scope): ...`), pas d'emoji, pas de `Co-Authored-By: Claude`, pas de `Generated with…`.
- **Aucune édition directe** dans submodules apps Vercel — PR sur le repo dédié.
- **Mode autonome maximal** — pas d'`AskUserQuestion`, pas de confirmation, pas d'`ExitPlanMode`.
- **Bun obligatoire** — pas de `node`/`npm`/`tsx`.
- **`bun run gen:entries`** OBLIGATOIRE après tout ajout command/event.

## Coordination Claude ↔ Gemini

Fichier : `apps/shenron/.coord/tasks.json` (lecture/écriture atomique avec lock `flock`). Chaque agent :

1. Lit `tasks.json` au démarrage.
2. Pick la première tâche `status=pending` assignée à son `agent`.
3. Patch `status=in_progress`, écrit son `pid` + `started_at`.
4. À la fin : `status=done` + `commit_hash` + `notes`.
5. Si blocage : `status=blocked` + `blocker` (texte court).

L'autre agent lit les `done` pour débloquer ses tâches `deps`.

## Boucle 30 min — ordre

**Track A (Claude Code, branche `fix/shop-jail-dashboard`)** : tâches `shenron-*`.

**Track B (Gemini, repo neuf `dbfr-site`)** : tâches `site-*`.

Les deux tracks tournent en parallèle. Ordre interne défini par `deps[]` dans `tasks.json`.

## Definition of Done

- [ ] `/jail` fonctionne (test guild dev).
- [ ] Shop stocke en inventaire, `/inventaire equip` opère l'attribution.
- [ ] Shop embed : preview bannière + couleur + mention rôle.
- [ ] Dashboard Settings/Levels : role picker dropdown peuplé live.
- [ ] 19 bannières level-rewards en DB + assets.
- [ ] Routes `/api/public/*` opérationnelles, CORS OK.
- [ ] Site Vercel déployé, 7 pages publiques + `/admin/*` fonctionnel.
- [ ] OAuth Discord lié, `/profil/me` affiche XP/zéni live.
- [ ] Wiki CRUD via `/admin/wiki`.
- [ ] FAB Discord présent + dismiss persistant.
- [ ] Charte galactique respectée (zéro blanc, zéro blurple).
- [ ] `bun run gen:entries && bun run type-check && bun run test && bun run lint` verts côté shenron.
- [ ] `pnpm build` (ou équivalent) vert côté site.
- [ ] Commits poussés, submodules sync.

Récap final unique en fin de sprint : ce qui est fait, ce qui reste, URL preview Vercel, hash commits.


---

<a name="readme-md"></a>
## 📄 Fichier : `README.md`

**Titre original :** 1. Bun ≥ 1.3


> ⚠️ **INFRASTRUCTURE GÉRÉE PAR ANTIGRAVITY (GOD MODE)**
> Ce projet opère sous la **Directive Omega**. L'architecture, les dépendances, et le code sont gérés et refactorisés de manière 100% autonome. Aucune sécurité conservative n'est appliquée. La performance brute est l'unique métrique.
\n# Shenron

Bot Discord thémé Dragon Ball pour un serveur communautaire — modération avancée, système de niveaux en "unités" de ki, économie en zéni, jeux, tickets, vocaux temporaires, cartes de profil rendues en canvas, et wiki des personnages.

> _« Tu as réuni les sept Dragon Balls. Fais ton vœu. »_

[![Bun](https://img.shields.io/badge/runtime-Bun%201.3-black?logo=bun)](https://bun.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![discord.js](https://img.shields.io/badge/discord.js-14.26-5865f2?logo=discord&logoColor=white)](https://discord.js.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-0.44-c5f74f)](https://orm.drizzle.team/)
[![SQLite](https://img.shields.io/badge/bun%3Asqlite-WAL-003b57?logo=sqlite&logoColor=white)](https://bun.com/docs/api/sqlite)
[![License](https://img.shields.io/badge/license-Apache_2.0-blue)](#licence)
[![GitHub](https://img.shields.io/badge/github-aphrody--code%2Fshenron-181717?logo=github)](https://github.com/aphrody-code/shenron)
[![CI](https://github.com/aphrody-code/shenron/actions/workflows/ci.yml/badge.svg)](https://github.com/aphrody-code/shenron/actions/workflows/ci.yml)
[![CodeQL](https://github.com/aphrody-code/shenron/actions/workflows/codeql.yml/badge.svg)](https://github.com/aphrody-code/shenron/actions/workflows/codeql.yml)

---

## Sommaire

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Démarrage rapide (2 minutes)](#démarrage-rapide-2-minutes)
- [Configuration](#configuration)
- [Mise en route](#mise-en-route)
- [Commandes](#commandes)
- [Système XP & Zéni](#système-xp--zéni)
- [Shop & customisation](#shop--customisation)
- [Succès](#succès)
- [Architecture](#architecture)
- [Scripts](#scripts)
- [Déploiement](#déploiement) — voir aussi [DEPLOY.md](DEPLOY.md) (guide complet)
- [Dépannage](#dépannage)
- [FAQ](#faq)
- [Licence](#licence)

---

## Aperçu

**Shenron** est un bot Discord complet conçu pour animer un serveur communautaire autour de l'univers Dragon Ball. Il combine tout ce qu'on attend d'un bot généraliste (modération, logs, économie, niveaux, tickets) avec une couche thématique : l'XP s'appelle "unités" de ki, les paliers vont de `1 000` à `9 000 000` unités (`IT'S OVER 9 MILLION`), les messages de progression citent Kami-sama, Maître Roshi ou Végéta, et les cartes de profil sont rendues façon scouter.

Le bot tourne exclusivement sur **[Bun](https://bun.com)** — pas de Node requis, aucun `node_modules` qui exige le loader Node. La persistance est locale via `bun:sqlite` + Drizzle ORM.

### Architecture multi-bot

Depuis 2026-05-01, **Shenron orchestre 6 personas Discord dans 1 process Bun** — chaque persona = 1 application Discord distincte avec son propre token, son set de slash commands, et ses events :

| Persona | Rôle | Commandes |
|---|---|---|
| **Shenron** | Admin · héberge l'API REST (5006) + dashboard | `/admin /config /ids /niveau /succes` |
| **Beerus** | Modération | `/warn /mute /ban /kick /clear /purge /role /lock /slowmode /nick /note /stats /sstats` |
| **Whis** | Utility | `/help /scan /ticket /wiki /races /planete /ask` |
| **Grand Prêtre** | Logs | (events only — `MessageLog`, `JoinLeave`, `BioRole`, `AuditLog`, `InteractionLog`) |
| **Enma** | Détention | `/jail /unjail` |
| **Kaïo** | Jeux + économie | `/shop /buy /eprofil /fusion /defusion /solde /gay /raciste /custom /bingo /morpion /pendu /pfc /giveaway /profil /top /voc` |

Toutes les personas partagent la même DB SQLite + les mêmes singletons tsyringe (cohérence transactionnelle). Le routage par persona se fait via `@Discord()` + `@Bot("<id>")` du fork [`@rpbey/discordy`](https://github.com/rpbey/discordx). Le mapping vit dans [`src/lib/personas.ts`](src/lib/personas.ts).

### Site compagnon

Un site Next.js public accompagne le bot, en prod sur **[dragonballfr.com](https://dragonballfr.com)** (canonical ; alias legacy `dbfr.vercel.app` conservés). L'API REST et les assets du bot sont exposés sur **`bot.dragonballfr.com`** (alias `bot.rpbey.fr`).

- **Home cinématique** (`apps/site/src/components/home/`) : accueil full-page scroll-snap, une scène plein écran par ère Dragon Ball avec fonds animés des meilleures scènes, navigation molette / clavier / tactile, et état live du bot en temps réel.
- **Animations cinématiques** (`apps/site/src/components/ViewTransition.tsx`) : **View Transitions API** (morph d'élément partagé grille→fiche personnages/planètes, slides directionnels), scroll-driven animations CSS natives (`animation-timeline: view()`), ki-glow au survol — `prefers-reduced-motion` respecté, cache CDN préservé, zéro framer-motion.
- **Wiki Dragon Ball** : personnages, sagas, films, jeux, manga, épisodes — lu directement dans Postgres (Neon, schéma `bot`) côté serveur, sans API bot.
- **Scènes d'épisode** (`/wiki/episodes/[id]`) : galeries de frames stockées en `db_episodes.frames` (jsonb) + `scene_preview`, alimentées par `apps/bot/scripts/{build-episode-scenes,extract-dbz-frames,scrape-dbz-fandom-frames,ingest-episode-frames}.ts`.

## Fonctionnalités

### Modération

- Commandes : `/warn` `/unwarn` `/mute` `/unmute` `/jail` `/unjail` `/ban` `/unban` `/kick` `/clear` `/stats` `/sstats` `/role`
- **Anti-lien Discord externe** : suppression + jail automatique si un membre poste un lien `discord.gg/...` pointant vers un autre serveur (whitelist auto de l'invite configurée)
- **Logs catégorisés** : un salon par type (messages, sanctions, économie, join/leave, niveau/rôle, tickets, notifs mods)
- **Jail expiry** : auto-unjail à la fin du délai imparti (ticker 60 s)
- **Invite tracker** : détecte qui a invité chaque nouveau membre

### Niveaux & économie

- XP texte (15–25 par message, cooldown 60 s)
- XP vocal (20 par minute, exclu si micro coupé)
- Paliers DBZ (`1k` → `9M` unités) avec bonus zéni et rôles cumulables
- Cartes de profil rendues via `@napi-rs/canvas` — 8 thèmes (`default`, `goku`, `vegeta`, `kaio`, `ssj`, `blue`, `rose`, `ultra`) + backgrounds custom
- Shop : cartes, badges, couleurs, titres
- Fusion (`/fusion` : canvas dual-portrait avec halo rainbow à l'acceptation) : bonus **+10 %** XP et zéni partagés
- Quête quotidienne : +200 zéni par jour, streak tracking

### Jeux & fun

- `/pfc` `/morpion` `/bingo` `/pendu` — mode bot ou joueur, gains **+100 zéni** au gagnant, **-50** au perdant. **Mode joueur** : message de défi avec boutons **Accepter / Refuser** (timeout 60 s) — pas de partie démarrée tant que l'adversaire n'accepte pas
- `/pendu` affiche le **nombre de lettres**, les lettres trouvées vs ratées, et un visuel ASCII du pendu (6 erreurs max)
- `/scan` — image scouter avec lecture de ki, **double-police** Saiyan Sans + Inter Display Black superposée
- `/gay` `/raciste` — commandes de pourcentage aléatoire déterministe par jour, avec override statique sur `OWNER_ID`. Titre rendu en **double-police** pour effet relief DBZ
- `/translate` — OCR + traduction d'image en VF (ou EN/ES/DE/IT/JA), 100 % FOSS via **Tesseract** + **LibreTranslate**. Aussi disponible en **menu contextuel** (clic droit sur un message → Apps → "Traduire en VF")

### Communautaire

- Tickets : panel avec 4 boutons (signaler, achat, shop, abus de perm), modal de contexte, `/ticket add/remove`, fermeture par bouton ou `/close`
- Vocaux temporaires : auto-créés en rejoignant un salon hub, auto-supprimés 60 s après départ du dernier membre. `/voc kick|ban|unban` pour le propriétaire
- Giveaway : `/giveaway` avec ticker automatique et tirage aléatoire
- Rôle URL en bio : attribué automatiquement aux membres qui affichent l'invite du serveur dans leur statut

### Wiki Dragon Ball

- `/wiki <personnage>` — fiche complète avec transformations (autocomplete)
- `/races <race>` — liste des personnages par race
- `/planete <planète>` — fiche planète
- `/ask <question>` — question en langage naturel FR → **recherche RAG hybride+rerank** sur le wiki → réponse sourcée (résultats classés, snippets, liens vers le site) + bouton « Ouvrir le meilleur résultat ». Persona Whis
- Données seedées depuis [dragonball-api.com](https://dragonball-api.com) avec images locales

### Outils

- `/translate` — OCR + traduction d'image (Tesseract + LibreTranslate, 100 % FOSS, zero clé commerciale). Slash command **et** menu contextuel "Traduire en VF". Hard caps prod-ready : image 10 MiB max, timeout tesseract 30 s, timeout LibreTranslate 8 s, garde SSRF
- `/config` — **dashboard côté Discord** (slash group admin) : XP rates, cooldowns, level rewards, salons. Tout est persisté dans la table `guild_settings` (cache 30 s) et override les constantes hardcodées sans redéploiement. Vérifie la hiérarchie de rôles avant d'enregistrer un level-reward (refuse si rôle au-dessus du bot)

### API REST (dashboard web)

Le bot expose une API REST `Bun.serve` interne (`127.0.0.1:5006` par défaut) **tscord-compatible** — surface alignée sur les controllers de [`@rpbey/tscord`](../../packages/tscord/), donc un fork de [`barthofu/tscord-dashboard`](https://github.com/barthofu/tscord-dashboard) peut consommer cette API directement.

| Catégorie | Routes | Auth |
|---|---|---|
| **Public** | `/health/check` `/health/latency` `/openapi` `/` | aucune |
| **Health admin** | `/health/usage` `/health/host` `/health/monitoring` | Bearer |
| **Stats** | `/stats/totals` `/stats/interaction/last` `/stats/guilds/last` | Bearer |
| **Bot** | `/bot/guilds` `/bot/commands` `/bot/commands/:name` | Bearer |
| **Cron** | `GET /cron` · `POST /cron/:name/trigger` | Bearer |
| **Services** | `GET /services` · `POST /services/:service/:action` | Bearer |
| **Database CRUD** | `GET /database/tables` · `GET /database/:table` · `GET/PUT/DELETE /database/:table/:id` · `POST /database/:table` | Bearer |

**Cron jobs registrés** (auto via `CronRegistry`) : `voice-xp-tick`, `jail-expiry`, `bio-role-scan`. Trigger manuel via dashboard.

**Tables CRUD** (whitelist `mutableColumns` par sécurité) : `users`, `shop_items`, `achievement_triggers`, `level_rewards`, `guild_settings`, `warns`, `jails`, `tickets`, `giveaways`, `db_planets`, `db_characters`, `db_transformations`. Read-only : `inventory`, `achievements`, `fusions`, `action_logs`.

**Services exposables** (whitelist d'actions) : `achievements.{refresh,list,grant}`, `economy.{addZeni,removeZeni}`, `level.{addXP,getUser}`, `settings.{list,set,unset}`, `translate.probe`, `moderation.{countWarns,removeLastWarn}`, `wiki.{search,count}`.

Auth via `API_ADMIN_TOKEN` env (Bearer). Spec OpenAPI 3.0.1 sur `/openapi`. Pour exposer hors VPS, ajouter un vhost nginx (`api.shenron.example`) qui proxy vers `127.0.0.1:5006` + injecte TLS.

### API publique : REST + GraphQL + OpenAPI

Au-delà du dashboard admin, le même `Bun.serve` expose une **surface publique** (CORS ouvert, sans Bearer) consommée par le site, l'app et la commande `/ask` :

| Surface | Endpoint | Détail |
|---|---|---|
| **REST** | `/api/public/rag/search` + wiki / insights / médias | endpoints publics du wiki et de la recherche |
| **GraphQL** | `/graphql` | read-only, code-first **Pothos** + **graphql-yoga**, GraphiQL activé, garde-fou profondeur max 10. Expose le wiki (`characters`, `planets`, `sagas`, `episodes`, `techniques`, `transformations`, `movies`, `games`, `races`) + relations + `ragSearch` + `counts` |
| **OpenAPI 3.1** | `/api/openapi.json` | spec statique (CORS public, cache 1 h) couvrant la surface REST publique (RAG / Wiki / Insights / Médias) |
| **Docs** | `/api/docs` | UI interactive **Scalar** (CDN, zéro dépendance) |

### Recherche RAG (hybride + rerank)

La recherche sémantique du wiki est un pipeline **2 étages, 100 % local** (FR + JP), sans clé ni service externe :

1. **Récupération hybride** — BM25 (`rag_chunks` FTS5) + embeddings denses multilingues (`Xenova/multilingual-e5-small`, 384d, cosinus exact) fusionnés en **RRF** (k=60).
2. **Reranking cross-encoder** (`Xenova/bge-reranker-base`) du top-15.

Les modèles tournent dans un **sidecar dédié** (`shenron-embed.service`, port 5007, `MemoryMax=3G`) — le process bot (1.5G) ne charge jamais de modèle : `src/lib/embeddings.ts` (heavy) n'est importé que par le sidecar, `src/lib/rag.ts` (runtime léger) fetch HTTP le sidecar. **Dégradation gracieuse** sur 3 niveaux (`hybrid+rerank → hybrid → lexical`).

Consommateurs : `/api/public/rag/search` (REST), `ragSearch` (GraphQL), commande Discord `/ask`, recherche du site. Build offline du corpus : `bun --filter @shenron/bot run rag:build` (voir [DEPLOY.md](DEPLOY.md#sidecar-embeddings-rag-shenron-embedservice)).

## Stack technique

| Couche | Outil |
|---|---|
| Runtime | **Bun 1.3+** (aucune dépendance Node) |
| Langage | TypeScript 5.9 |
| Framework | [`@rpbey/discordy`](https://www.npmjs.com/package/@rpbey/discordy) (décorateurs sur `discord.js` v14) |
| DI | `tsyringe` + `reflect-metadata` |
| Database | `bun:sqlite` + `drizzle-orm` 0.44 |
| Validation | `zod` 4 |
| Logging | `pino` + `pino-pretty` |
| Canvas | `@napi-rs/canvas` (profil, scan, top podium, fusion, gauges) |
| Lint | `oxlint` (Rust, 135 règles actives) |
| Tests | `bun:test` — 42 smoke tests, 1 par slash command |

## Démarrage rapide (2 minutes)

### One-liner

Choisis celui qui correspond à ton shell / environnement.

**🐧 Linux / macOS (bash)**

```bash
curl -fsSL https://raw.githubusercontent.com/aphrody-code/shenron/main/scripts/install.sh | bash
```

**🪟 Windows (PowerShell)**

```powershell
irm https://raw.githubusercontent.com/aphrody-code/shenron/main/scripts/install.ps1 | iex
```

**🥟 Bun (cross-platform — Linux, macOS, Windows)**

```bash
bun run https://raw.githubusercontent.com/aphrody-code/shenron/main/scripts/install.ts
```

**📦 npm / bunx (si tu as déjà Node)**

```bash
bunx tiged aphrody-code/shenron shenron && cd shenron && bash scripts/setup.sh
```

(`tiged` = clone shallow sans git history · fonctionne aussi avec `degit`)

**Variables d'env (toutes variantes)** :

| Variable | Effet | Défaut |
|---|---|---|
| `SHENRON_DIR` | Dossier d'installation | `./shenron` |
| `SHENRON_BRANCH` | Branche git | `main` |
| `SHENRON_REPO` | URL du repo | `https://github.com/aphrody-code/shenron.git` |
| `SKIP_WIKI_SEED=1` | Skip le fetch wiki (~60 s) | off |

Exemple :

```bash
curl -fsSL .../install.sh | SHENRON_DIR=/opt/shenron SHENRON_BRANCH=dev bash
```

### Pas à pas (équivalent)

```bash
git clone https://github.com/aphrody-code/shenron.git
cd shenron
bash scripts/setup.sh        # installe Bun si absent, deps, .env, migrations, seeds
bash scripts/doctor.sh       # check santé (token, DB, perms)
bash scripts/start.sh        # lance en mode watch
```

Le `setup.sh` s'arrêtera en te demandant d'ouvrir `.env` si tu n'as pas encore tes identifiants Discord. Les sections ci-dessous expliquent **où les trouver**.

> [!TIP]
> Si tu préfères tout faire à la main : voir [Installation manuelle](#installation-manuelle).

### Où récupérer les 3 identifiants obligatoires

**1. `DISCORD_TOKEN`** — le secret qui authentifie ton bot.

1. Va sur [discord.com/developers/applications](https://discord.com/developers/applications)
2. **New Application** → donne un nom → **Create**
3. Onglet **Bot** à gauche → **Reset Token** → copie la valeur
4. Toujours dans **Bot**, active les trois _Privileged Gateway Intents_ :
   - `Presence Intent` (détection URL en bio)
   - `Server Members Intent` (join/leave)
   - `Message Content Intent` (XP texte, anti-lien, succès regex)

> [!WARNING]
> Ne commit **jamais** le token. Le fichier `.env` est ignoré par git et créé en `chmod 600` par `setup.sh`.

**2. `GUILD_ID`** — l'ID de ton serveur Discord.

1. Dans Discord : **Paramètres utilisateur** → **Avancé** → active **Mode développeur**
2. Clic droit sur l'icône de ton serveur → **Copier l'identifiant du serveur**

**3. `OWNER_ID`** — ton propre ID Discord.

- Clic droit sur ton pseudo → **Copier l'identifiant utilisateur**

### Inviter le bot sur ton serveur

Dans le portail dev : **OAuth2** → **URL Generator** → coche `bot` + `applications.commands`, puis permissions :
`Manage Roles, Manage Channels, Kick Members, Ban Members, Moderate Members, Manage Messages, Read Message History, Embed Links, Attach Files, Add Reactions, Connect, Move Members, Mute Members`.

Ou utilise directement ce lien en remplaçant `CLIENT_ID` par ton `APPLICATION_ID` (portail dev → **General Information** → Application ID) :

```
https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot+applications.commands&permissions=1099780074054
```

### Compléter la fiche Developer Portal

Sur `https://discord.com/developers/applications/<APP_ID>/information` (onglet **General Information**), tu peux remplir :

| Champ | Valeur recommandée |
|---|---|
| **Name** | `Shenron` |
| **Description** (≤ 400) | `Bot Discord thématique Dragon Ball — modération, niveaux (unités de ki), économie en zéni, tickets, vocaux tempo, cartes canvas, wiki DBZ. Bun-only.` |
| **Tags** (5 max) | `Moderation` · `Levels` · `Economy` · `Games` · `Utility` |
| **App Icon** | Upload depuis `assets/logo.webp` |
| **Cover Image** | Upload depuis `assets/backgrounds/galaxy/spiral-galaxy-m83.webp` (optionnel, régénère via `bun run bg:fetch` si gitignoré) |
| **Privacy Policy URL** | `https://github.com/aphrody-code/shenron/blob/main/PRIVACY.md` |
| **Terms of Service URL** | `https://github.com/aphrody-code/shenron/blob/main/TERMS.md` |
| **Interactions Endpoint URL** | **Laisser vide** — Shenron passe par la Gateway WebSocket, pas les webhooks HTTP |
| **Install Link** | `Discord Provided Link` (utilise celui du header ci-dessus) |

Onglets connexes :
- **Bot** → activer `Presence Intent`, `Server Members Intent`, `Message Content Intent`
- **OAuth2** → URL Generator pour régénérer le lien d'invitation si tu changes de permissions
- **Installation** → `User Install` désactivé (Shenron est guild-install uniquement)

### Docs Discord utiles

- [Developer Portal](https://discord.com/developers/applications) — créer/gérer l'app
- [Documentation API Discord](https://discord.com/developers/docs/intro) — ref complète
- [Gateway Intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) — explique les Privileged Intents
- [OAuth2 Scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes) — scopes disponibles
- [Permissions Bitwise](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags) — calculer le permissions integer
- [Slash Commands](https://discord.com/developers/docs/interactions/application-commands#slash-commands) — spec des commandes
- [Rate Limits](https://discord.com/developers/docs/topics/rate-limits) — éviter les 429

Libs utilisées par Shenron :
- [discord.js v14 guide](https://discordjs.guide/) · [API docs](https://discord.js.org/docs/packages/discord.js/main)
- [`@rpbey/discordy`](https://github.com/rpbey/discordx) — décorateurs (fork de discordx)
- [`@rpbey/pagination`](https://github.com/rpbey/pagination) — pagination bouton/select
- [`@napi-rs/canvas`](https://github.com/Brooooooklyn/canvas) — rendu 2D natif

### Structure Discord à préparer (optionnel mais recommandé)

Les IDs suivants sont **optionnels** dans `.env` — la feature associée reste inactive si l'ID est vide, rien ne crashe. Crée-les au fur et à mesure quand tu en as besoin :

- Un **rôle "Jail"** (permissions refusées partout sauf un salon dédié) → `JAIL_ROLE_ID`
- Un **rôle "URL en bio"** (décoratif) → `URL_IN_BIO_ROLE_ID`
- Une **catégorie "Tickets"** → `TICKET_CATEGORY_ID`
- Un **salon vocal "Hub"** → `VOCAL_TEMPO_HUB_ID`
- Jusqu'à **7 salons de logs** → `LOG_*_CHANNEL_ID` + `MOD_NOTIFY_CHANNEL_ID`

### Auto-détection des IDs

Plutôt que copier-coller chaque ID à la main, deux chemins automatiques :

**Depuis le terminal** — scanne la guild via REST et peut patcher `.env` en place :

```bash
bun run ids                  # liste rôles + salons + bloc .env (heuristique nom → clé)
bun run ids -- --patch       # écrit directement dans .env les clés vides matchées
bun run ids -- --json        # sortie brute JSON (pipe, automation)
```

L'heuristique reconnaît des noms courants (insensible à la casse/accents) :
- Rôles : `jail`, `prison`, `mute` → `JAIL_ROLE_ID` · `bio`, `url`, `vip`, `pub` → `URL_IN_BIO_ROLE_ID`
- Salons : `log-messages`, `log-sanctions`, `log-eco`, `log-join-leave`, `log-level`, `log-tickets`, `mod-notif`, `ticket` (catégorie), `hub`/`tempo` (vocal)

**Depuis Discord** — commande admin :

```
/ids quoi:tout            # rôles + salons en ephemeral
/ids quoi:roles
/ids quoi:salons
```

Les IDs non reconnus par l'heuristique s'affichent quand même, il suffit de copier la ligne correspondante dans `.env`.

### Scripts bash disponibles

| Script | Usage | Fait quoi |
|---|---|---|
| `bash scripts/setup.sh` | One-shot setup | Vérifie Bun, installe les deps, copie `.env.example` → `.env`, applique les migrations, seed les triggers, (optionnel) seed du wiki |
| `bash scripts/doctor.sh` | Health check | Vérifie Bun, `node_modules`, `.env` (3 champs requis, valeurs masquées), DB + migrations, **valide le token** via REST Discord, détecte process en cours |
| `bash scripts/start.sh` | Launcher | `--prod` (pas de watch) / `--compiled` (binaire `dist/shenron`) / `--bg` (détaché + logs datés dans `logs/`) |
| `bun scripts/deploy.ts --help` | Pipeline de déploiement | Build + type-check + lint + migrations + restart systemd avec options granulaires |

### Installation manuelle

Si tu préfères ne pas utiliser les scripts :

```bash
### 1. Bun ≥ 1.3
curl -fsSL https://bun.com/install | bash
bun --version   # doit afficher ≥ 1.3

### 2. Deps + config
bun install
cp .env.example .env
### édite .env : DISCORD_TOKEN, GUILD_ID, OWNER_ID au minimum

### 3. DB
mkdir -p data
bun run db:migrate
bun run db:seed-triggers        # 15 succès (instantané, offline)
bun run db:seed-wiki            # wiki DBZ (~60 s, fetch dragonball-api.com)

### 4. Run
bun run dev                     # hot reload
### ou : bun run start            # sans watch
### ou : bun run compile && ./dist/shenron   # binaire standalone
```

## Configuration

Toutes les variables sont validées via `zod` dans `src/lib/env.ts`. Les IDs Discord optionnels qui ne sont pas renseignés font **no-op silencieusement** — la feature correspondante reste inactive.

### Variables requises

| Variable | Type | Description |
|---|---|---|
| `DISCORD_TOKEN_SHENRON` (alias `DISCORD_TOKEN`) | string | Token du bot Shenron (admin + API REST) |
| `DISCORD_TOKEN_BEERUS` | string | Token du bot Beerus (modération) |
| `DISCORD_TOKEN_WHIS` | string | Token du bot Whis (utility) |
| `DISCORD_TOKEN_GRAND_PRETRE` | string | Token du bot Grand Prêtre (logs — **privileged intents requis**) |
| `DISCORD_TOKEN_ENMA` | string | Token du bot Enma (jail/unjail) |
| `DISCORD_TOKEN_KAIO` | string | Token du bot Kaïo (jeux + éco — **MESSAGE CONTENT INTENT requis**) |
| `GUILD_ID` | snowflake | ID du serveur — les 6 bots sont mono-guild forcé sur cette guild |
| `OWNER_ID` | snowflake | ID du propriétaire (garde `OwnerOnly`, overrides statiques dans certaines commandes) |

> **Privileged intents** : Grand Prêtre nécessite `SERVER MEMBERS INTENT` + `PRESENCE INTENT` + `MESSAGE CONTENT INTENT` activés sur son app du dev portal Discord. Kaïo nécessite `MESSAGE CONTENT INTENT`. Sans ça, ces bots refusent le login (`Used disallowed intents`) — le service continue à tourner sans eux (login non-bloquant), Shenron seul est obligatoire.

> **Scope OAuth** : inviter chaque bot avec `scope=bot+applications.commands` (sans `applications.commands`, les slashes ne s'enregistrent pas → `Missing Access 50001` côté Discord, bot connecté au gateway mais 0 commande visible).

### Variables optionnelles

| Variable | Description |
|---|---|
| `DATABASE_PATH` | Chemin vers le fichier SQLite (défaut : `./data/bot.db`) |
| `LOG_MESSAGE_CHANNEL_ID` | Salon où envoyer les logs de messages supprimés/édités |
| `LOG_SANCTION_CHANNEL_ID` | Salon logs sanctions (jail, mute, ban, warn, kick) |
| `LOG_ECONOMY_CHANNEL_ID` | Salon logs économiques |
| `LOG_JOIN_LEAVE_CHANNEL_ID` | Salon logs arrivées/départs (avec tracking de l'invitant) |
| `LOG_LEVEL_ROLE_CHANNEL_ID` | Salon logs progression de niveau et attribution de rôles |
| `LOG_TICKET_CHANNEL_ID` | Salon logs ouverture/fermeture de tickets |
| `MOD_NOTIFY_CHANNEL_ID` | Salon où sont notifiés les mods à l'ouverture d'un ticket |
| `JAIL_ROLE_ID` | Rôle appliqué par `/jail` (doit restreindre tous les salons sauf ticket) |
| `URL_IN_BIO_ROLE_ID` | Rôle auto-attribué si l'invite est détectée dans le statut |
| `TICKET_CATEGORY_ID` | Catégorie sous laquelle les tickets sont créés |
| `VOCAL_TEMPO_HUB_ID` | Salon vocal hub — le rejoindre crée un vocal perso |
| `ANNOUNCE_CHANNEL_ID` | Salon des annonces générales (quête quotidienne, level-up) |
| `ACHIEVEMENT_CHANNEL_ID` | Salon dédié aux **🏆 accomplissements**. Si absent, retombe sur `ANNOUNCE_CHANNEL_ID`. Permet d'isoler les notifs de succès dans un canal cosmétique |
| `COMMANDS_CHANNEL_ID` | Salon où les slash commands user (jeux, fun, profil) sont autorisées (les autres salons → message d'erreur) |
| `LIBRETRANSLATE_URL` | Endpoint LibreTranslate (défaut : `http://127.0.0.1:5000` — assume self-host Docker, voir [setup-translate.sh](#scripts)) |
| `LIBRETRANSLATE_API_KEY` | Clé optionnelle pour endpoint public `https://libretranslate.com` |
| `API_ENABLED` | Démarrer ou pas l'API REST `Bun.serve` (défaut : `true`) |
| `API_PORT` | Port d'écoute (défaut : `5006`) |
| `API_HOST` | Bind address (défaut : `127.0.0.1` — exposer hors VPS via nginx vhost dédié) |
| `API_ADMIN_TOKEN` | Bearer token pour routes admin. Si vide, routes admin → 503. Génère via `head -c 32 /dev/urandom \| base64` |
| `SERVER_INVITE_URL` | URL d'invite du serveur (défaut : `discord.gg/`) — whitelist anti-lien + détection bio |
| `LOG_LEVEL` | Niveau pino : `trace`, `debug`, `info`, `warn`, `error`, `fatal` (défaut : `info`) |
| `NODE_ENV` | `development`, `production`, `test` (défaut : `development`) |

> **Stack `/translate` (FOSS)** — pas de clé requise. Installer via `sudo bash scripts/setup-translate.sh` :
> - **Tesseract OCR** (Apache 2.0) installé en `apt` avec packs langue `fra/eng/jpn/spa/deu/ita`
> - **LibreTranslate** (AGPL-3.0) lancé en Docker container (port 5000 bind 127.0.0.1, modèles `en,fr,ja,es,de,it`)
>
> Les commandes `/translate` sont automatiquement désactivées si l'un des deux est down (probe au boot dans `boot-audit.ts`, message d'erreur explicite à l'user).

## Mise en route

Une fois `.env` rempli :

```bash
bun run db:migrate           # applique les migrations SQL
bun run db:seed-all          # peuple le wiki + les triggers de succès
bun run dev                  # mode watch (hot reload)
```

Sur le serveur Discord, publie le panel de tickets (une seule fois) dans le salon dédié :

```
/ticket-panel
```

Puis crée quelques entrées de shop en base (voir [Shop](#shop--customisation)), configure les paliers de récompense dans `level_rewards` si tu veux attribuer des rôles, et tu es opérationnel.

## Commandes

### Utilisateur

<details>
<summary><strong>Niveaux & profil</strong></summary>

| Commande | Description |
|---|---|
| `/profil [membre]` | Carte de profil (canvas 1000×360, 8 thèmes avec backgrounds NASA) |
| `/top` | Classement : **canvas podium 1-2-3** + liste 4-10, boutons Précédent/Suivant FR |
| `/solde [membre]` | Voir le solde de zéni |
| `/scan [membre]` | Scouter mini-card (canvas 500×200 avec scanlines et font DBS Scouter) |

</details>

<details>
<summary><strong>Économie</strong></summary>

| Commande | Description |
|---|---|
| `/shop` | Shop paginé (cartes, badges, couleurs, titres) |
| `/buy <clé>` | Acheter un objet |
| `/eprofil` | Éditer le profil (modal : carte / badge / couleur / titre) |
| `/fusion <membre>` | **Canvas dual-portrait** (propose → success après accept) — bonus +10 % XP et zéni partagés |
| `/defusion` | Rompre la fusion |

</details>

<details>
<summary><strong>Jeux</strong></summary>

| Commande | Description |
|---|---|
| `/pfc <bot\|joueur> [adversaire]` | Pierre-Feuille-Ciseaux |
| `/morpion <bot\|joueur> [adversaire]` | Morpion (IA défensive : gagner > bloquer > centre > coin, ligne gagnante surlignée vert) |
| `/bingo <bot\|joueur> [adversaire]` | Devine le nombre (1–100) |
| `/pendu <bot\|joueur> [adversaire]` | Pendu avec mots DBZ — embed avec nb lettres, lettres trouvées/ratées, ASCII art |

Gains : **+100 zéni** au gagnant · **-50 zéni** au perdant (mode joueur).

**Mode joueur** : `/pendu` `/morpion` (et bientôt `/bingo`) envoient un **message de défi** avec boutons **✅ Accepter** / **❌ Refuser** au lieu de démarrer la partie immédiatement. La partie ne démarre qu'après acceptation explicite de l'adversaire (timeout 60 s).

</details>

<details>
<summary><strong>Tickets</strong></summary>

| Commande | Description |
|---|---|
| `/ticket-panel` | (admin) publie le panel à 4 boutons |
| `/ticket add\|remove <utilisateur\|rôle>` | Ajouter / retirer quelqu'un du ticket courant |
| `/close` | Fermer le ticket courant |

</details>

<details>
<summary><strong>Vocaux temporaires</strong></summary>

| Commande | Description |
|---|---|
| `/voc kick <membre>` | Expulser un membre du vocal |
| `/voc ban <membre>` | Bannir un membre du vocal |
| `/voc unban <membre>` | Débannir |

Le vocal est automatiquement créé en rejoignant le hub configuré, et supprimé 60 secondes après le départ du dernier membre.

</details>

<details>
<summary><strong>Fun</strong></summary>

| Commande | Description |
|---|---|
| `/gay <membre>` | **Canvas scouter gauge** — % déterministe par jour (override : `0` si cible = `OWNER_ID`) |
| `/raciste <membre>` | **Canvas scouter gauge** rouge — override : `101` (overflow) si cible = `OWNER_ID` |
| `/translate [image] [url] [langue]` | **OCR Tesseract + LibreTranslate** — 100 % FOSS, langues : FR/EN/ES/DE/IT/JA. Cap image 10 MiB, timeout tesseract 30 s, timeout LibreTranslate 8 s, garde SSRF (refuse IPs privées et `file://`) |
| **menu contextuel "Traduire en VF"** | Clic droit sur un message → Apps → traduit la 1re image attachée |

</details>

<details>
<summary><strong>Wiki Dragon Ball</strong></summary>

| Commande | Description |
|---|---|
| `/wiki <personnage>` | Fiche avec transformations (autocomplete sur tous les persos) |
| `/races <race>` | Personnages par race (Saiyan, Namekian, Android…) |
| `/planete <planète>` | Fiche planète |
| `/ask <question>` | Question FR en langage naturel → **RAG hybride+rerank** → réponse sourcée + bouton « Ouvrir le meilleur résultat » |

</details>

### Modération

| Commande | Perm requise | Description |
|---|---|---|
| `/warn <membre> [raison]` | Moderate Members | Avertissement (persisté) |
| `/unwarn <membre>` | Moderate Members | Retire le dernier warn actif |
| `/mute <membre> <durée> [raison]` | Moderate Members | Timeout natif Discord (format `10m`, `1h`, `1d`) |
| `/unmute <membre>` | Moderate Members | Retire le timeout |
| `/jail <membre> [durée] [raison]` | Moderate Members | Isole dans le jail (rôles sauvegardés pour restauration) |
| `/unjail <membre>` | Moderate Members | Libère et restaure les rôles |
| `/ban <membre> [raison]` | Ban Members | Ban définitif |
| `/unban <userid> [raison]` | Ban Members | Unban par ID |
| `/kick <membre> [raison]` | Kick Members | Expulsion |
| `/clear <nombre> [membre]` | Manage Messages | Purge jusqu'à 100 messages, filtre optionnel par auteur |
| `/stats [membre]` | — | Stats de modération d'un membre |
| `/sstats` | Administrator | Stats du serveur |
| `/role give\|remove <rôle> [membre]` | Manage Roles | Attribution de rôle (si membre vide : action globale, réservée admin) |

### Administration

| Commande | Description |
|---|---|
| `/niveau give\|remove niveau\|exp <montant> [membre\|rôle\|all]` | Modifier XP ou niveau |
| `/zeni give\|remove <montant> [membre\|rôle\|all]` | Modifier le solde |
| `/custom give\|remove <card\|badge\|color\|title\|succes> <clé> [membre\|rôle\|all]` | Donner / retirer un objet custom ou un succès |
| `/giveaway <titre> <récompense> <gagnants> <durée> [salon] [description]` | Créer un giveaway |
| `/succes set <code> <pattern> [description] [flags]` | Créer/éditer un trigger de succès |
| `/succes list` | Lister les triggers |
| `/succes remove <code>` | Supprimer un trigger |
| `/ids [quoi: roles\|salons\|tout]` | Liste les IDs rôles/salons de la guild (ephemeral, pratique pour remplir `.env`) |
| `/config list` | Liste les overrides runtime (XP rates, cooldowns, salons) avec leur valeur effective vs défaut |
| `/config set <key> <value>` | Définit une surcharge runtime (clés : `xp.message.{min,max,cooldown_ms}`, `xp.voice.per_minute`, `zeni.daily_quest`) |
| `/config unset <key>` | Supprime une surcharge (revient au défaut hardcodé) |
| `/config channel <type> <salon>` | Raccourci pour redéfinir un salon (annonces, accomplissements, commandes) sans toucher au `.env` |
| `/config level-reward-set <level> <role> [xp-threshold] [zeni-bonus]` | Configure un palier niveau → rôle. **Vérifie la hiérarchie de rôles** : refuse si le rôle est au-dessus de celui du bot (sinon attribution silencieusement cassée au level-up) |
| `/config level-reward-remove <level>` | Supprime un palier |
| `/config level-rewards` | Liste les paliers configurés |

## Système XP & Zéni

Le XP est exposé aux users comme **"unités"** de ki. Les niveaux (1 à 10) ne sont qu'un repère interne pour les rôles de palier et les bonus de zéni.

### Paliers

| Niveau | Unités | Flavor |
|---:|---:|---|
| 1 | 1 000 | Premier souffle (dépasse un humain normal) |
| 2 | 5 000 | Niveau Krilin |
| 3 | 10 000 | Saga Saiyan (tient tête à Nappa) |
| 4 | 25 000 | Saga Namek (affronte les soldats de Freezer) |
| 5 | 50 000 | Saga Cyborgs (Dr. Gero t'a à l'œil) |
| 6 | 100 000 | Super Saiyan débloqué |
| 7 | 250 000 | Super Saiyan 2 |
| 8 | 500 000 | Super Saiyan 3 |
| 9 | 1 000 000 | Super Saiyan Blue |
| 10 | 9 000 000 | IT'S OVER 9 MILLION — Ultra Instinct |

Chaque passage de palier déclenche un message DBZ-flavored, un bonus de **1 000 zéni**, et l'attribution du rôle configuré dans la table `level_rewards` (si présent).

### Quête quotidienne

Premier message dans la journée : **+200 zéni** et incrément du `dailyStreak`. Le streak ne reset que si un jour entier passe sans message.

### Fusion

Deux membres fusionnent via `/fusion` (embed de proposition, boutons accept/refuse). Une fois actée :

- Chaque gain d'XP alimente aussi le/la partenaire à **+10 %**
- Idem pour les gains de zéni
- Nom fusionné calculé via `lib/fusion-names.ts` (canon pour les couples iconiques : Goku + Végéta = **Vegito**, Goten + Trunks = **Gotenks**, etc. Sinon génération par mélange de syllabes)

## Shop & customisation

La table `shop_items` est vide au départ. Exemple d'insertion :

```sql
INSERT INTO shop_items (key, type, name, price, role_id, description) VALUES
  ('saiyan_blue',  'color', 'Saiyan Blue',        5000, '123456789012345678', 'Cyan intense — pseudo en bleu ciel'),
  ('veteran',      'title', 'Vétéran de la Z-Team', 2500, NULL,                'Titre affiché sur la carte profil'),
  ('senzu',        'badge', 'Senzu',              1000, NULL,                'Badge haricot magique');
```

Ou à la volée avec `/custom` (admin).

### Cartes profil

Les 8 thèmes sont pré-câblés dans `CardService`. Pour ajouter une carte avec un background personnalisé :

1. Dépose un `.webp` (ou `.png`/`.jpg`) dans `assets/cards/<clé>.webp`
2. Insère une ligne `shop_items` avec `type='card'` et `key='<clé>'`
3. L'user achète via `/buy <clé>` puis équipe via `/eprofil`

### Niveau → rôle

Remplis la table `level_rewards` pour attribuer automatiquement un rôle à chaque palier :

```sql
INSERT INTO level_rewards (level, role_id, zeni_bonus, xp_threshold) VALUES
  (3, '111111111111111111', 1000, 10000),
  (6, '222222222222222222', 2000, 100000);
```

## Succès

15 triggers DBZ sont pré-seedés (Kamehameha, Over 9000, Genkidama, Kaio-ken, Ultra Instinct, Final Flash, Galick Gun, Makankōsappō, etc.). Quand un membre écrit un message matchant une regex, le succès est débloqué et annoncé dans le salon.

Ajouter un trigger custom :

```
/succes set code:DOUBLE_SUNDAY pattern:"double\s*sunday" description:"Technique de Trunks"
```

Le succès `FIRST_MESSAGE` est hardcodé pour le premier message du membre.

## Architecture

```text
src/
├── index.ts                    bootstrap (intents, DI, migrations, login)
├── _entries.ts                 barrel statique (généré par gen-entries.ts)
├── db/
│   ├── index.ts                DatabaseService (bun:sqlite + drizzle)
│   ├── schema.ts               19 tables
│   ├── migrations/             SQL généré par drizzle-kit
│   ├── migrate.ts              runner standalone
│   ├── seed-wiki.ts            fetch dragonball-api.com
│   └── seed-triggers.ts        15 patterns de succès DBZ
├── lib/
│   ├── env.ts                  zod validation
│   ├── logger.ts               pino
│   ├── constants.ts            seuils XP, prix, durées, regex invite
│   ├── xp.ts                   levelForXP, formatXP, randomInt
│   ├── dbz-flavor.ts           messages level-up (3 variantes/palier) + quête (31 phrases + variantes streak + rare drops)
│   ├── fusion-names.ts         canoniques + générateur
│   ├── slash-user.ts           userTransformer (GuildMember → User) pour @SlashOption
│   ├── canvas-kit.ts           primitives 2D partagées (fonts, shapes, text, effects, textDoubleFont, Dragon Ball)
│   ├── challenge.ts            helper Accept/Decline réutilisable (challenge:<scope>:<action>:<key>)
│   ├── embeds.ts               brandedEmbed/successEmbed/errorEmbed/warningEmbed (inspirés tscord)
│   ├── announce.ts             resolveAnnounceChannel + resolveAchievementChannel
│   ├── boot-audit.ts           check salons + rôles + probe Tesseract/LibreTranslate au démarrage
│   └── preload.ts              reflect-metadata (bunfig preload)
├── services/                   @singleton() tsyringe
│   ├── LevelService
│   ├── EconomyService
│   ├── ModerationService
│   ├── TicketService
│   ├── VocalTempoService
│   ├── LogService
│   ├── InviteTracker
│   ├── CardService             @napi-rs/canvas — 8 thèmes avec backgrounds NASA
│   ├── LeaderboardService      canvas podium (/top)
│   ├── FusionService           canvas dual-portrait (/fusion propose + success)
│   ├── GaugeService            canvas scouter gauge double-police (/gay, /raciste)
│   ├── AchievementService      regex cache (TTL 5 min)
│   ├── SettingsService         table guild_settings — XP rates, salons, level rewards override (cache 30 s)
│   ├── TranslateService        Tesseract CLI (Bun.spawn) + LibreTranslate (HTTP), probe au boot
│   └── WikiService
├── guards/                     GuildOnly · ModOnly · AdminOnly · OwnerOnly
├── commands/                   @Discord + @Slash
│   ├── admin/Achievements      /succes set|list|remove
│   ├── admin/Config            /config list|set|unset|channel|level-reward-* (slash group dashboard)
│   ├── admin/Ids               /ids (liste rôles + salons, ephemeral)
│   ├── moderation/Moderation   warn, jail, mute, ban, kick, clear, stats, role
│   ├── economy/Economy         shop, buy, eprofil, fusion, solde, zeni, custom
│   ├── level/Level             profil, top, niveau
│   ├── ticket/Ticket           panel, ticket, close
│   ├── vocal/Vocal             voc kick|ban|unban
│   ├── giveaway/Giveaway       giveaway + ticker
│   ├── games/{Pfc,Morpion,Bingo,Pendu}    challenge buttons (Accept/Decline) en mode joueur
│   ├── fun/{Fun,Scan,Translate}           gay, raciste, scan, translate (slash + context-menu)
│   └── wiki/Wiki               wiki, races, planete (autocomplete)
├── events/                     @Discord + @On
│   ├── MessageXP               XP + quête + anti-lien + succès regex
│   ├── VoiceXP                 ticker XP vocal + création tempo
│   ├── JoinLeave               logs + invite tracker
│   ├── MessageLog              delete / update
│   ├── BioRole                 presenceUpdate + scan horaire
│   ├── JailExpiry              auto-unjail 60 s
│   └── ready                   (event: "clientReady" — discord.js v14.22+)
└── assets/
    ├── fonts/                  Inter, Teko, Saiyan Sans, DBS Scouter, Noto Color Emoji
    ├── cards/                  backgrounds custom achetables (optionnel, via shop)
    ├── backgrounds/            19 images NASA public domain (6 thèmes) — gitignoré, regen via `bun run bg:all`
    └── dbz/                    ~130 images (persos + transfos + planètes)
```

### Pipeline DI + décorateurs

L'ordre de bootstrap dans `src/index.ts` est critique :

1. `import "reflect-metadata"` (préloadé via `bunfig.toml`)
2. `DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container)`
3. `import "./_entries"` — charge tous les modules `@Discord` à effet de bord
4. `client.login()`

`_entries.ts` est un barrel **généré** par `scripts/gen-entries.ts`. Ne pas l'éditer à la main — il est nécessaire pour que `bun build --compile` fonctionne (pas de dynamic import dans un standalone binary).

## Scripts

### Bash (wrappers one-shot)

| Script | Usage | Notes |
|---|---|---|
| `curl -fsSL .../install.sh \| bash` | Installer one-liner | Clone le repo + lance setup + doctor. Variables : `SHENRON_DIR`, `SHENRON_BRANCH`. |
| `bash scripts/setup.sh` | Setup de A à Z | Installe Bun si absent, `bun install`, `.env` depuis l'exemple, migrations, seeds. Idempotent. |
| `bash scripts/doctor.sh` | Health check | Vérifie Bun, deps, `.env`, DB, **ping le token via REST Discord**, détecte instances en cours. Code retour non-zéro si problème. |
| `bash scripts/start.sh` | Launcher | Flags : `--prod` (pas de watch), `--compiled` (binaire `dist/shenron`), `--bg` (détaché, logs dans `logs/`) |
| `sudo bash scripts/setup-translate.sh` | Stack `/translate` FOSS | Installe `tesseract-ocr` + packs langue (apt) + lance LibreTranslate en Docker (`127.0.0.1:5000`, modèles `en,fr,ja,es,de,it`). Idempotent. **Requiert Docker.** |

### Bun (tâches granulaires)

| Script | Usage |
|---|---|
| `bun run dev` | Mode watch (hot reload) |
| `bun run start` | Démarrage prod |
| `bun run deploy -- --help` | Pipeline de déploiement composable (build, type-check, lint, migrate, seed, restart systemd) |
| `bun run test` | Smoke tests — un test par slash command, DB isolée |
| `bun run lint` / `lint:fix` | oxlint |
| `bun run type-check` | `tsc --noEmit` |
| `bun run build` | Bundle → `dist/index.js` |
| `bun run compile` | Binaire standalone → `dist/shenron` |
| `bun run gen:entries` | Régénère `src/_entries.ts` (à lancer après ajout de commande/event) |
| `bun run db:migrate` | Applique les migrations SQL |
| `bun run db:generate` | Génère une migration depuis `schema.ts` |
| `bun run db:push` | Sync direct du schema sans migration (dev only) |
| `bun run db:studio` | UI Drizzle |
| `bun run db:seed-wiki` | Peuple le wiki depuis dragonball-api.com (~60 s) |
| `bun run db:seed-triggers` | Seed les 15 triggers de succès (offline, instantané) |
| `bun run db:seed-all` | Les deux |
| `bun run ids` / `ids -- --patch` | Liste les IDs rôles+salons de la guild (REST), patch `.env` par heuristique nom |
| `bun run bg:fetch` / `bg:optimize` / `bg:all` | Télécharge + compresse les 19 backgrounds NASA (1.7 MB WebP) |

## Déploiement

### Réactivation propre et complète (VPS)

Pour réactiver proprement l'ensemble des services de Shenron sur le VPS (nettoyage des caches, réinstallation propre des dépendances, application des migrations SQLite, génération des commandes statiques, compilation CSS du dashboard, build de l'index RAG, mise à jour des units systemd et démarrage des services/timers) :

```bash
bash scripts/reactivate.sh
```

Ce script effectue les actions suivantes :
1. Nettoie les dossiers `node_modules` et les caches de build.
2. Installe proprement toutes les dépendances via `bun install`.
3. Applique les migrations de base de données SQLite.
4. Génère les entrées statiques du bot (`gen:entries`).
5. Compile les styles CSS Tailwind v4 du Dashboard.
6. Génère l'index RAG (`rag:build`).
7. Met à jour et recharge les configurations systemd.
8. Active et démarre les services (`shenron.service`, `shenron-embed.service`) et les timers de synchronisation/sauvegarde (`shenron-backup.timer`, `shenron-neon-sync.timer`, `shenron-neon-pull.timer`).
9. Effectue un healthcheck sur le port d'API locale (5006).

### Binaire standalone


```bash
bun run compile           # produit dist/shenron (inclut tout, pas de node_modules requis)
./dist/shenron
```

### Systemd

Exemple de service :

```ini
[Unit]
Description=Shenron Discord bot
After=network.target

[Service]
Type=simple
WorkingDirectory=/srv/shenron
ExecStart=/srv/shenron/dist/shenron
EnvironmentFile=/srv/shenron/.env
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

### Docker

Le repo inclut un `Dockerfile` production-ready (multi-stage, user non-root, volume `/data`) et un `.dockerignore` strict. Build local :

```bash
docker build --build-arg GH_PACKAGES_TOKEN=<ton-PAT> -t shenron .
docker run -d --name shenron \
  -v $(pwd)/data:/data \
  --env-file .env \
  shenron
```

### Fly.io (recommandé pour déploiement cloud simple)

Le projet inclut `fly.toml`, `Dockerfile` et `scripts/fly-init.sh`. Bootstrap en 1 commande après avoir installé `flyctl` et fait `fly auth login` :

```bash
bash scripts/fly-init.sh
### Lit .env, crée l'app, crée le volume 3 GB, pousse les secrets, deploy
```

**Variables facultatives** : `APP=mon-bot REGION=ams VOLUME_SIZE=5 bash scripts/fly-init.sh`

**CI/CD automatique** : le workflow `.github/workflows/deploy-fly.yml` déploie sur push `main` (après CI vert). Pré-requis :

1. `fly auth token` → secret GH `FLY_API_TOKEN`
2. Secret `GH_PACKAGES_TOKEN` (déjà configuré pour le CI) — réutilisé pour l'auth `@rpbey/*` au build

**Coût estimé** : shared-cpu-1x 1 GB RAM + volume 3 GB = **~3 $ / mois**.

**Ce qui est fait dans le conteneur** :

- Build : `bun install --frozen-lockfile` + `gen:entries` + seed des backgrounds NASA
- Runtime : user non-root `shenron` (UID 1001), volume `/data` pour `bot.db`
- `release_command = "bun src/db/migrate.ts"` — applique les migrations avant chaque deploy
- Pas de `[http_service]` — Shenron = worker Gateway WebSocket uniquement, machine toujours-on

**Commandes utiles** :

```bash
fly logs --app shenron-bot
fly status --app shenron-bot
fly ssh console --app shenron-bot          # shell interactif dans le conteneur
fly secrets set DISCORD_TOKEN=… --app shenron-bot
fly deploy --build-arg GH_PACKAGES_TOKEN=…  # redeploy manuel
```

### Sauvegarde DB

```bash
### Snapshot à chaud (SQLite avec VACUUM INTO)
bun -e "import {Database} from 'bun:sqlite'; new Database('./data/bot.db').exec(\"VACUUM INTO './data/bot.bak.db'\")"
```

## Dépannage

**`bun: command not found` après `setup.sh`**
Ouvre un nouveau shell (ou `source ~/.bashrc`) — l'installeur Bun ajoute `~/.bun/bin` au `PATH` au prochain login. Sinon : `export PATH="$HOME/.bun/bin:$PATH"`.

**`doctor.sh` dit "Token refusé (HTTP 401)"**
Le token dans `.env` n'est plus valide. Régénère-le sur le portail dev (**Bot → Reset Token**), remplace la ligne `DISCORD_TOKEN=…` dans `.env`, relance.

**`Used disallowed intents` au démarrage**
Les _Privileged Gateway Intents_ ne sont pas activés : portail dev → **Bot** → active `Presence`, `Server Members` et `Message Content`.

**Les slash commands n'apparaissent pas sur le serveur**
Vérifie que `GUILD_ID` correspond bien au serveur où tu as invité le bot. Les commandes sont enregistrées **par guild** (propagation instantanée) et non globalement.

**`Missing Permissions` sur `/jail`, `/ban`, etc.**
Le rôle du bot doit être **au-dessus** des rôles qu'il veut gérer dans la hiérarchie Discord (serveur → Paramètres → Rôles → glisse le rôle du bot vers le haut).

**Le seed wiki échoue / timeout**
L'API `dragonball-api.com` peut être temporairement down. Relance `bun run db:seed-wiki` plus tard ou skip : tout le reste fonctionne sans le wiki, seules les commandes `/wiki /races /planete` seront vides.

**Arrêter le bot lancé avec `start.sh --bg`**
`pkill -f 'bun src/index.ts'` (watch) ou `pkill -f 'bun.*index.ts'` (prod).

## FAQ

**Pourquoi Bun et pas Node ?**
Démarrage plus rapide, `bun:sqlite` natif (aucune dépendance native à compiler), support TypeScript et décorateurs sans transpilation, binaire standalone via `--compile`. Le projet n'utilise aucune API Node-only incompatible.

**Le vocal ne donne pas d'XP ?**
Vérifie que `GuildVoiceStates` est bien dans les intents (c'est le cas par défaut), que le micro n'est pas coupé (self-mute désactive l'XP par design), et que le salon n'est pas le hub des vocaux temporaires (le hub ne donne pas d'XP — on crée juste le vocal perso).

**Les cartes de profil ne s'affichent pas ?**
Les fonts doivent être présentes dans `assets/fonts/`. Le log au démarrage indique quelles fonts ont échoué. Fallback automatique sur sans-serif.

**Un membre quitte le serveur, que se passe-t-il ?**
Son profil (XP, zéni, inventaire, succès) est **supprimé** par `CASCADE` via `JoinLeave.onLeave`. Les logs de modération restent pour traçabilité.

**Multi-serveurs ?**
Non par défaut — les commandes sont enregistrées sur `GUILD_ID` uniquement (déploiement quasi-instantané en dev). Pour multi-guild, retirer `botGuilds` dans `src/index.ts` et compter 1 h pour la propagation globale. Note : Shenron est **mono-guild forcé** sur les 6 personas (chaque `clientReady` quitte automatiquement toute guild ≠ `GUILD_ID`).

**Multi-bot — pourquoi 6 apps Discord pour 1 bot ?**
Pour avoir une UX où chaque catégorie de commandes a un personnage iconique du lore (Beerus = modération, Whis = utility, Grand Prêtre = logs, Enma = jail, Kaïo = jeux/éco). Ce sont 6 apps Discord distinctes avec leurs propres tokens, mais **1 seul process Bun** (DB + services partagés). Le routage commands/events se fait via `@Bot("<persona>")` du fork `@rpbey/discordy`. Mapping dans `src/lib/personas.ts`. Pour ajouter/retirer un persona, éditer ce fichier + ajouter `DISCORD_TOKEN_<NAME>` dans `.env`.

**Comment backup la DB ?**
Le fichier est `data/bot.db`. Snapshot via `VACUUM INTO` (voir [Déploiement](#déploiement)) ou `cp data/bot.db data/bot.bak` à chaud (WAL-safe).

## Licence

Apache-2.0 — voir [`LICENSE`](LICENSE). Code ouvert depuis le 2026-06-02. Politique de sécurité : [`SECURITY.md`](SECURITY.md).

---

Sources best practices README consultées : [Make a README](https://www.makeareadme.com/), [The Good Docs Project](https://www.thegooddocsproject.dev/template/readme), [jehna/readme-best-practices](https://github.com/jehna/readme-best-practices), [banesullivan/README](https://github.com/banesullivan/README), [Codacy](https://blog.codacy.com/best-practices-to-manage-an-open-source-project).


---

<a name="security-md"></a>
## 📄 Fichier : `SECURITY.md`

**Titre original :** Politique de sécurité

### Politique de sécurité

## Signaler une vulnérabilité

Merci de **ne pas** ouvrir d'issue publique pour une faille de sécurité.

Privilégier le canal privé de GitHub :
**Security → Report a vulnerability** (Private Vulnerability Reporting) sur
`github.com/aphrody-code/shenron`.

À défaut, contact direct : **contact@aphrody-code.dev**.

Merci d'inclure si possible :
- une description de la faille et de son impact ;
- les étapes de reproduction (PoC) ;
- les versions / commits concernés.

## Délais indicatifs

- Accusé de réception : sous **72 h**.
- Évaluation initiale et plan de correction : sous **7 jours**.
- Les rapports valides sont traités en priorité ; un correctif est publié
  avant toute divulgation publique coordonnée.

## Périmètre

Ce dépôt contient un bot Discord (`apps/bot`) et un site compagnon
(`apps/site`). Sont particulièrement sensibles :

- l'API REST du bot et son dashboard admin (auth, tokens) ;
- l'authentification Discord OAuth (Better Auth, côté bot **et** site) ;
- l'exposition de données membres (les dumps SQLite et exports runtime sont
  **exclus du dépôt** — cf. `.gitignore`).

## Bonnes pratiques contributeurs

- Aucun secret dans le dépôt : `.env` est ignoré, la production utilise des
  variables d'environnement (Vercel / systemd). Voir `apps/bot/.env.example`
  pour la liste des variables attendues (valeurs factices uniquement).
- Ne jamais committer `apps/bot/data/*.db`, `guild-scan.json`, ni aucun export
  de données utilisateurs.


---

<a name="apps-bot-data-rag-anilist-md"></a>
## 📄 Fichier : `apps/bot/data/rag/anilist.md`

**Titre original :** Recon report — https://anilist.co/

### Recon report — https://anilist.co/

Date: 2026-05-21 05:18 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 5049 (5 KB)
- **goto duration**: 208 ms
- **Server**: `cloudflare`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: Cloudflare
- **Trace/Ray ID**: `9ff11e8c0feb3620-FRA`
- **Cache-Control**: `no-cache, private`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (8 total)

| Host | Asset count |
|---|---|
| `anilist.co` | 4 |
| `fonts.googleapis.com` | 1 |
| `hb.vntsm.com` | 1 |
| `challenges.cloudflare.com` | 1 |
| `static.cloudflareinsights.com` | 1 |

### stylesheet (1)

- https://fonts.googleapis.com/css?family=Overpass:400,600,700,800

### script (7)

- https://hb.vntsm.com/v3/live/ad-manager.min.js
- https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit
- https://anilist.co/js/chunk-vendors.10841b02.js
- https://anilist.co/js/main.9622c464.js
- https://anilist.co/js/chunk-vendors-legacy.0b291f75.js
- https://anilist.co/js/main-legacy.b7550e57.js
- https://static.cloudflareinsights.com/beacon.min.js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447

## CSS selectors (0 total) — sample top 50

```css
```



---

<a name="apps-bot-data-rag-bandai-eu-md"></a>
## 📄 Fichier : `apps/bot/data/rag/bandai-eu.md`

**Titre original :** Recon report — https://en.bandainamcoent.eu/dragon-ball

### Recon report — https://en.bandainamcoent.eu/dragon-ball

Date: 2026-05-21 05:17 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 12447 (12 KB)
- **goto duration**: 418 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `V5nojjvLnkT_qDZ03r0UKX80Ulz0YaX6eXTbkIWMxOQSO9MeYVNa5g==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (12 total)

| Host | Asset count |
|---|---|
| `cdn.jsdelivr.net` | 8 |
| `en.bandainamcoent.eu` | 3 |
| `p325k7wa.twic.pics` | 1 |

### stylesheet (10)

- https://en.bandainamcoent.eu/sites/default/files/css/css_XnNWnRMednqhlRzkeyRN_EuoSIGno-NcssuMz3b085s.css?delta=0&amp;language=en&amp;theme=bne_main&amp;include=eJx1jFFuwzAMQy_kWcAuZMgxE7iwo9SS06Wnb5atQ4F0P6TERynOCIPUKjP9mBukgVLrCxefMheZ3OXa0bbQc-BusveWAgO9Lu7a853UtgJ1uqmhUmSFW3OCBNSIFMaMkqhBF5k1r_g44F7BTelQXyX1AndDHKVV-nXPF_46hSiomM0ntvPFH4RxLupNpunN42etQpWn_7nuw2CfJ_4tzzBEEVNrvNApeQCB6o0W
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/css/bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.4.0/8.x-3.x/drupal-bootstrap.min.css
- https://en.bandainamcoent.eu/sites/default/files/css/css_rK4jhT2bdSNylljCKVapcrV40lkltQk4mi-Z5toM1k8.css?delta=9&amp;language=en&amp;theme=bne_main&amp;include=eJx1jFFuwzAMQy_kWcAuZMgxE7iwo9SS06Wnb5atQ4F0P6TERynOCIPUKjP9mBukgVLrCxefMheZ3OXa0bbQc-BusveWAgO9Lu7a853UtgJ1uqmhUmSFW3OCBNSIFMaMkqhBF5k1r_g44F7BTelQXyX1AndDHKVV-nXPF_46hSiomM0ntvPFH4RxLupNpunN42etQpWn_7nuw2CfJ_4tzzBEEVNrvNApeQCB6o0W

### script (2)

- https://p325k7wa.twic.pics/?v1&amp;anticipation=0.5
- https://en.bandainamcoent.eu/sites/default/files/js/js_ZvUeuHVpBFilQ_ZkT2Bh3PLxA-jqXXUXI3KlmhA-uG4.js?scope=header&amp;delta=0&amp;language=en&amp;theme=bne_main&amp;include=eJyFkOGOwyAIgF-o0eReiKAy56JihHa3t197vestm8v-AH4fCYirBJ5L4Wr3NLlKBFGL_SvMJrAGGaiAihlv1AeOFqq6cyHs_gzYkn16A87K64CWSWlyzCrasdmjgtYJUk36IBs3XraZB1HmrKlNnjvZ0OeG2YSEmaPBC35PS6Kr2J-4gyu5E_dif_MYUqay_sEEUkxZjOBCH5uUY8zv2wqJYHzvZS28ftBfL34LQ2i2A8OJ_SxjL7MrSYGrP5aC_8O-kDs759s9

## CSS selectors (3075 total) — sample top 50

```css
#features-filter .form-item.form-type-checkbox {}
#navbar-administration.navbar-oriented .navbar-tray-vertical {}
#overlay-container {}
#toolbar {}
* {}
*:after {}
*:before {}
.affix {}
.ajax-progress {}
.ajax-progress-bar {}
.ajax-progress-bar .message {}
.ajax-progress-bar .percentage {}
.ajax-progress-bar .progress {}
.ajax-progress-fullscreen {}
.ajax-progress-throbber .message {}
.ajax-progress-throbber .throbber {}
.ajax-progress.ajax-progress-fullscreen {}
.alert {}
.alert .alert-link {}
.alert a {}
.alert a.btn {}
.alert a.btn:focus {}
.alert a.btn:hover {}
.alert h4 {}
.alert-danger {}
.alert-danger .alert-link {}
.alert-danger a {}
.alert-danger a:focus {}
.alert-danger a:hover {}
.alert-danger hr {}
.alert-dismissable {}
.alert-dismissable .close {}
.alert-dismissible {}
.alert-dismissible .close {}
.alert-info {}
.alert-info .alert-link {}
.alert-info a {}
.alert-info a:focus {}
.alert-info a:hover {}
.alert-info hr {}
.alert-sm {}
.alert-success {}
.alert-success .alert-link {}
.alert-success a {}
.alert-success a:focus {}
.alert-success a:hover {}
.alert-success hr {}
.alert-warning {}
.alert-warning .alert-link {}
.alert-warning a {}
/* ... 3025 more (use --snapshot-dir to dump full list) */
```



---

<a name="apps-bot-data-rag-dbofficial-en-md"></a>
## 📄 Fichier : `apps/bot/data/rag/dbofficial-en.md`

**Titre original :** Recon report — https://en.dragon-ball-official.com/

### Recon report — https://en.dragon-ball-official.com/

Date: 2026-05-21 05:17 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 461 (0 KB)
- **goto duration**: 1137 ms
- **Server**: `nginx`
- **X-Powered-By**: `PHP/8.1.29`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `tMI6OFCkJAECLB5c0iyhUxH3X-DH_XoVn1BpYHMpD_Wwu5NF4VpCpQ==`
- **Cache-Control**: `no-cache, private`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (1 total)

| Host | Asset count |
|---|---|
| `cdn.cookielaw.org` | 1 |

### script (1)

- https://cdn.cookielaw.org/scripttemplates/otSDKStub.js

## CSS selectors (0 total) — sample top 50

```css
```



---

<a name="apps-bot-data-rag-dbofficial-fr-md"></a>
## 📄 Fichier : `apps/bot/data/rag/dbofficial-fr.md`

**Titre original :** Recon report — https://fr.dragon-ball-official.com/

### Recon report — https://fr.dragon-ball-official.com/

Date: 2026-05-21 05:17 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 465 (0 KB)
- **goto duration**: 1095 ms
- **Server**: `nginx`
- **X-Powered-By**: `PHP/8.1.29`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `cCVCdIbv4ZI1eY-jaX8nzvAsgS-hG51UB8UDqmT9G7GEK4m07BDaDg==`
- **Cache-Control**: `no-cache, private`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (1 total)

| Host | Asset count |
|---|---|
| `cdn.cookielaw.org` | 1 |

### script (1)

- https://cdn.cookielaw.org/scripttemplates/otSDKStub.js

## CSS selectors (0 total) — sample top 50

```css
```



---

<a name="apps-bot-data-rag-jikan-md"></a>
## 📄 Fichier : `apps/bot/data/rag/jikan.md`

**Titre original :** Recon report — https://jikan.moe/

### Recon report — https://jikan.moe/

Date: 2026-05-21 05:18 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 4231 (4 KB)
- **goto duration**: 233 ms
- **Server**: `Netlify`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: netlify
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `public,max-age=0,must-revalidate`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (2 total)

| Host | Asset count |
|---|---|
| `jikan.moe` | 1 |
| `www.googletagmanager.com` | 1 |

### stylesheet (1)

- https://jikan.moe/scss/bootstrap.scss

### script (1)

- https://www.googletagmanager.com/gtag/js?id=G-S3KKT32CL5

## CSS selectors (0 total) — sample top 50

```css
```



---

<a name="apps-bot-data-rag-kanzenshuu-md"></a>
## 📄 Fichier : `apps/bot/data/rag/kanzenshuu.md`

**Titre original :** Recon report — https://kanzenshuu.com/

### Recon report — https://kanzenshuu.com/

Date: 2026-05-21 05:18 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 16307 (16 KB)
- **goto duration**: 1449 ms
- **Server**: `Sucuri/Cloudproxy`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: sucuri/cloudproxy
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `max-age=600`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (10 total)

| Host | Asset count |
|---|---|
| `www.kanzenshuu.com` | 8 |
| `fonts.googleapis.com` | 1 |
| `ajax.googleapis.com` | 1 |

### stylesheet (9)

- https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700;900&amp;family=Noto+Sans+TC:wght@400;500&amp;family=Noto+Sans+JP:wght@300;400;500;700;900&amp;family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&amp;family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&amp;family=Roboto+Slab:wght@400;600;700;900&amp;display=swap
- https://www.kanzenshuu.com/wp-content/uploads/shadowbox-js/src/shadowbox.css?ver=3.0.3
- https://www.kanzenshuu.com/wp-content/plugins/shadowbox-js/css/extras.css?ver=3.0.3.10
- https://www.kanzenshuu.com/wp-includes/css/dist/block-library/style.min.css?ver=6.9.4
- https://www.kanzenshuu.com/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=6.1.5
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/style.css?ver=1.0.5z
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/responsive.css?ver=1.0.5z
- https://www.kanzenshuu.com/wp-content/plugins/cleaner-gallery/css/gallery.min.css?ver=20130526
- https://www.kanzenshuu.com/wp-content/plugins/add-to-any/addtoany.min.css?ver=1.16

### script (1)

- https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js?ver=6.9.4

## CSS selectors (1041 total) — sample top 50

```css
" i]) {}
#end-resizable-editor-section {}
#sb-body {}
#sb-body img {}
#sb-body-inner {}
#sb-container {}
#sb-counter {}
#sb-counter a {}
#sb-counter a.sb-counter-current {}
#sb-info {}
#sb-info-inner {}
#sb-loading {}
#sb-loading-inner {}
#sb-loading-inner span {}
#sb-nav {}
#sb-nav a {}
#sb-nav-close {}
#sb-nav-next {}
#sb-nav-pause {}
#sb-nav-play {}
#sb-nav-previous {}
#sb-overlay {}
#sb-player.html {}
#sb-title {}
#sb-title-inner {}
#sb-wrapper {}
#sb-wrapper-inner {}
.aligncenter {}
.alignright) {}
.blocks-gallery-grid:not(.has-nested-images) {}
.blocks-gallery-grid:not(.has-nested-images) figcaption {}
.blocks-gallery-grid:not(.has-nested-images).aligncenter .blocks-gallery-item figure {}
.comment-awaiting-moderation {}
.editor-styles-wrapper {}
.entry-content {}
.has-avatars .wp-block-latest-comments__comment {}
.has-avatars .wp-block-latest-comments__comment .wp-block-latest-comments__comment-excerpt {}
.has-avatars .wp-block-latest-comments__comment .wp-block-latest-comments__comment-meta {}
.has-black-background-color {}
.has-black-border-color {}
.has-black-color {}
.has-blush-bordeaux-gradient-background {}
.has-blush-light-purple-gradient-background {}
.has-cool-to-warm-spectrum-gradient-background {}
.has-cyan-bluish-gray-background-color {}
.has-cyan-bluish-gray-border-color {}
.has-cyan-bluish-gray-color {}
.has-dates :where(.wp-block-latest-comments:not([style*=line-height])) {}
.has-drop-cap:not(:focus):first-letter {}
.has-electric-grass-gradient-background {}
/* ... 991 more (use --snapshot-dir to dump full list) */
```



---

<a name="apps-bot-data-rag-kitsu-md"></a>
## 📄 Fichier : `apps/bot/data/rag/kitsu.md`

**Titre original :** Recon report — https://kitsu.io/

### Recon report — https://kitsu.io/

Date: 2026-05-21 05:18 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 4869 (5 KB)
- **goto duration**: 328 ms
- **Server**: `cloudflare`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html`
- **CDN fingerprint**: Cloudflare
- **Trace/Ray ID**: `9ff11e941ef19b7d-FRA`
- **Cache-Control**: `max-age=0, no-cache`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (1 total)

| Host | Asset count |
|---|---|
| `cdnjs.cloudflare.com` | 1 |

### script (1)

- https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=default,Intl,IntersectionObserver,fetch&amp;flags=gated&amp;unknown=polyfill

## CSS selectors (0 total) — sample top 50

```css
```



---

<a name="apps-bot-data-rag-shonenjump-plus-md"></a>
## 📄 Fichier : `apps/bot/data/rag/shonenjump-plus.md`

**Titre original :** Recon report — https://shonenjumpplus.com/

### Recon report — https://shonenjumpplus.com/

Date: 2026-05-21 05:17 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 199212 (195 KB)
- **goto duration**: 97 ms
- **Server**: `nginx`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=utf-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `hW5LWZv3lIvDIrb60lbil3BrS5APTtJ-pzHbbhzeZYZ-L3SzvhSLnA==`
- **Cache-Control**: `no-cache="Set-Cookie", max-age=5, stale-while-revalidate=10, stale-if-error=60`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (231 total)

| Host | Asset count |
|---|---|
| `cdn-scissors.gigaviewer.com` | 181 |
| `cdn-ak.shonenjumpplus.com` | 36 |
| `shonenjumpplus.com` | 6 |
| `cdn.image.st-hatena.com` | 3 |
| `www.googletagmanager.com` | 2 |
| `www.facebook.com` | 2 |
| `connect.facebook.net` | 1 |

### stylesheet (2)

- https://cdn-ak.shonenjumpplus.com/css/jump_plus.css?1779171028
- https://cdn-ak.shonenjumpplus.com/css/top_modal.css?1779171028

### script (4)

- https://connect.facebook.net/en_US/fbevents.js
- https://www.googletagmanager.com/gtm.js?id=GTM-MQT32T2
- https://cdn-ak.shonenjumpplus.com/js/jquery-slick.js?1779171014
- https://cdn-ak.shonenjumpplus.com/js/bundle.js?1779171056

### image (224)

- https://cdn-ak.shonenjumpplus.com/images/user/close-button.png?1779170903
- https://cdn-ak.shonenjumpplus.com/images/user/close-button.png?1779170903
- https://cdn-ak.shonenjumpplus.com/images/android-icon-144.png?1779170903
- https://cdn-ak.shonenjumpplus.com/images/i-attention_black.svg?1779170903
- https://cdn-ak.shonenjumpplus.com/images/close-button.png?1779170903
- https://cdn-ak.shonenjumpplus.com/images/i-attention_black.svg?1779170903
- https://cdn-ak.shonenjumpplus.com/images/close-button.png?1779170903
- https://cdn-ak.shonenjumpplus.com/images/jump_icon.svg?1779170903
- https://cdn-ak.shonenjumpplus.com/images/user/close-button.png?1779170903
- https://cdn-scissors.gigaviewer.com/image/scale/e046da0a6f8f4fa041e3e3de769698c499b76b96/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589753427861-f00d62715f164e760101a59fc3a4b08d%3F1778821902
- https://cdn-scissors.gigaviewer.com/image/scale/e046da0a6f8f4fa041e3e3de769698c499b76b96/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589753427861-f00d62715f164e760101a59fc3a4b08d%3F1778821902
- https://cdn-scissors.gigaviewer.com/image/scale/e046da0a6f8f4fa041e3e3de769698c499b76b96/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589753427861-f00d62715f164e760101a59fc3a4b08d%3F1778821902
- https://cdn-scissors.gigaviewer.com/image/scale/1ac417ee3bd779f1b98e5da891a81f6071ed85b5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589237822802-412a6bb86d4b09c2c00b56c90dc9932b%3F1777518703
- https://cdn-scissors.gigaviewer.com/image/scale/1ac417ee3bd779f1b98e5da891a81f6071ed85b5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589237822802-412a6bb86d4b09c2c00b56c90dc9932b%3F1777518703
- https://cdn-scissors.gigaviewer.com/image/scale/1ac417ee3bd779f1b98e5da891a81f6071ed85b5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589237822802-412a6bb86d4b09c2c00b56c90dc9932b%3F1777518703
- https://cdn-scissors.gigaviewer.com/image/scale/15aa2f59dd7ebb09831c0a11ca8c37caa7a141d0/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589594917484-fa7a1f01f6b2aeb5a31ef6657d1a4a10%3F1778729610
- https://cdn-scissors.gigaviewer.com/image/scale/15aa2f59dd7ebb09831c0a11ca8c37caa7a141d0/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589594917484-fa7a1f01f6b2aeb5a31ef6657d1a4a10%3F1778729610
- https://cdn-scissors.gigaviewer.com/image/scale/15aa2f59dd7ebb09831c0a11ca8c37caa7a141d0/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589594917484-fa7a1f01f6b2aeb5a31ef6657d1a4a10%3F1778729610
- https://cdn-scissors.gigaviewer.com/image/scale/bca997aa4995236bc9e14d7d35556a40899a0e22/enlarge=0;height=348;no_unsharpmask=1;quality=90;version=1;width=725/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fseries-sub-thumbnail-horizontal-with-logo%2F17106567261425153061-73976aa8904fac52d70b58ae785108e1%3F1771891076
- https://cdn-scissors.gigaviewer.com/image/scale/755784787d344eccf244434da3aa6fb9c07a3746/enlarge=0;height=482;no_unsharpmask=1;quality=90;version=1;width=482/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fseries-sub-thumbnail-square-with-logo%2F17106567261425153061-0f7090d10a73b0f8cef2ac823b3afbaf%3F1771891076
- _... 204 more_

### iframe (1)

- https://www.googletagmanager.com/ns.html?id=GTM-MQT32T2

## CSS selectors (2767 total) — sample top 50

```css
#content.content-vertical .ad-container {}
#content.content-vertical .ad-nav-area-content {}
#content:not(.content-vertical) .ad-nav-area-content {}
#content:not(.content-vertical) .ad-nav-area-wrap {}
#nprogress {}
#nprogress .bar {}
#nprogress .peg {}
#nprogress .spinner {}
#nprogress .spinner-icon {}
#page-jumpPlus-premium-bakuageSignup .modal-window .setting-footer {}
#page-jumpPlus-premium-bakuageSignup .setting-container {}
#page-jumpPlus-premium-bakuageSignup .setting-footer {}
#page-jumpPlus-series-finished .nav-series-finished {}
#page-jumpPlus-series-finished .nav-series-finished::after {}
#page-jumpPlus-series-finished .nav-series-finished::before {}
#page-jumpPlus-series-list .nav-series-list {}
#page-jumpPlus-series-list .nav-series-list::after {}
#page-jumpPlus-series-list .nav-series-list::before {}
#page-jumpPlus-series-oneshot .nav-series-oneshot {}
#page-jumpPlus-series-oneshot .nav-series-oneshot::after {}
#page-jumpPlus-series-oneshot .nav-series-oneshot::before {}
#page-searchTop .search-container {}
#page-viewer .header {}
#page-viewer.page-viewer-rockingyou {}
#page-viewer.page-viewer-rockingyou #ru-header-container .episode-header-share {}
#page-viewer.page-viewer-rockingyou #ru-header-container h1 {}
#page-viewer.page-viewer-rockingyou #ru-header-container h1 img {}
#page-viewer.page-viewer-rockingyou .episode-header {}
#page-viewer.page-viewer-rockingyou .episode-header-container {}
#page-viewer.page-viewer-rockingyou .footer {}
#page-viewer.page-viewer-rockingyou .page-footer {}
#page-viewer.page-viewer-rockingyou .ru-contents-container {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .contents-button {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .contents-button img {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .contents-button:last-child {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .contents-button:nth-child(3n) {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .contents-comic {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .contents-comic img {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .contents-comic:last-child {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .contents-title {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .series-author {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .series-contents-wrapper {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .series-description {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .series-description-spotify {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .series-image {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .series-image-wrapper {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .series-image-wrapper::after {}
#page-viewer.page-viewer-rockingyou .ru-contents-container .series-title {}
#page-viewer.page-viewer-rockingyou .ru-contents-container a:hover {}
#page-viewer.page-viewer-rockingyou .spotify-playlist-wrapper {}
/* ... 2717 more (use --snapshot-dir to dump full list) */
```



---

<a name="apps-bot-data-rag-shueisha-md"></a>
## 📄 Fichier : `apps/bot/data/rag/shueisha.md`

**Titre original :** Recon report — https://www.shueisha.co.jp/

### Recon report — https://www.shueisha.co.jp/

Date: 2026-05-21 05:17 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 81938 (80 KB)
- **goto duration**: 2283 ms
- **Server**: `Accelia`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `Da5SrzaSvzE5MDuF62tbmXoPCjkxv8bH8B-i7yua4cZ1qaSWP4We9w==`
- **Cache-Control**: `n/a`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (186 total)

| Host | Asset count |
|---|---|
| `www.shueisha.co.jp` | 182 |
| `fonts.googleapis.com` | 2 |
| `www.googletagmanager.com` | 2 |

### stylesheet (10)

- https://www.shueisha.co.jp/wp-includes/css/dist/block-library/style.min.css?ver=6.7
- https://www.shueisha.co.jp/wp-content/plugins/user-access-manager/assets/css/uamLoginForm.css?ver=2.2.23
- https://fonts.googleapis.com/css2?family=Noto+Sans+JP%3Awght%40400%3B700&amp;display=swap&amp;ver=1.0
- https://fonts.googleapis.com/css2?family=Source+Serif+Pro&amp;display=swap&amp;text=QA&amp;ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/css/common.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/css/base.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/slick/slick.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/aos/aos.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/css/script.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/100th/style.css

### script (9)

- https://www.googletagmanager.com/gtm.js?id=GTM-WLM2C6G
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/jquery-3.5.1.min.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/common.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/navigation.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/slick/slick.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/slick/slick-setting-top.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/script.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/mainvisual.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/100th/script.js

### image (166)

- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/logo-header.svg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/company01.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/company02.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/company03.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/company04.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/company05.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/news01.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/news02.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/news03.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/news04.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/recruit01.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/recruit02.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/recruit03.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/image/logo-100th-guide.png
- https://www.shueisha.co.jp/wp-content/themes/shueisha/image/mv/mv.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/image/mv/mv.jpg
- https://www.shueisha.co.jp/wp-content/themes/shueisha/image/mv/mv_subtitle_02.png
- https://www.shueisha.co.jp/wp-content/themes/shueisha/image/mv/mv_subtitle_01.png
- https://www.shueisha.co.jp/wp-content/themes/shueisha/image/mv/mv_subtitle_02.png
- https://www.shueisha.co.jp/wp-content/uploads/2026/05/20260515-main-324x216.jpg
- _... 146 more_

### iframe (1)

- https://www.googletagmanager.com/ns.html?id=GTM-WLM2C6G

## CSS selectors (1063 total) — sample top 50

```css
#end-resizable-editor-section {}
* {}
.aligncenter {}
.alignright) {}
.blocks-gallery-grid:not(.has-nested-images) {}
.blocks-gallery-grid:not(.has-nested-images) figcaption {}
.blocks-gallery-grid:not(.has-nested-images).aligncenter .blocks-gallery-item figure {}
.clearfix:after {}
.comment-awaiting-moderation {}
.editor-styles-wrapper {}
.entry-content {}
.has-avatars .wp-block-latest-comments__comment {}
.has-avatars .wp-block-latest-comments__comment .wp-block-latest-comments__comment-excerpt {}
.has-avatars .wp-block-latest-comments__comment .wp-block-latest-comments__comment-meta {}
.has-black-background-color {}
.has-black-border-color {}
.has-black-color {}
.has-blush-bordeaux-gradient-background {}
.has-blush-light-purple-gradient-background {}
.has-cool-to-warm-spectrum-gradient-background {}
.has-cyan-bluish-gray-background-color {}
.has-cyan-bluish-gray-border-color {}
.has-cyan-bluish-gray-color {}
.has-dates :where(.wp-block-latest-comments:not([style*=line-height])) {}
.has-drop-cap:not(:focus):first-letter {}
.has-electric-grass-gradient-background {}
.has-excerpts :where(.wp-block-latest-comments:not([style*=line-height])) {}
.has-huge-font-size {}
.has-large-font-size {}
.has-larger-font-size {}
.has-light-green-cyan-background-color {}
.has-light-green-cyan-border-color {}
.has-light-green-cyan-color {}
.has-light-green-cyan-to-vivid-green-cyan-gradient-background {}
.has-luminous-dusk-gradient-background {}
.has-luminous-vivid-amber-background-color {}
.has-luminous-vivid-amber-border-color {}
.has-luminous-vivid-amber-color {}
.has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background {}
.has-luminous-vivid-orange-background-color {}
.has-luminous-vivid-orange-border-color {}
.has-luminous-vivid-orange-color {}
.has-luminous-vivid-orange-to-vivid-red-gradient-background {}
.has-medium-font-size {}
.has-midnight-gradient-background {}
.has-modal-open .admin-bar .is-menu-open .wp-block-navigation__responsive-dialog {}
.has-modal-open .wp-block-cover .wp-block-cover__inner-container {}
.has-modal-open .wp-block-cover-image .wp-block-cover__inner-container {}
.has-modal-open .wp-block-navigation__responsive-close {}
.has-normal-font-size {}
/* ... 1013 more (use --snapshot-dir to dump full list) */
```



---

<a name="apps-bot-data-rag-toei-animation-md"></a>
## 📄 Fichier : `apps/bot/data/rag/toei-animation.md`

**Titre original :** Recon report — https://www.toei-animation.com/catalog/dragon-ball/

### Recon report — https://www.toei-animation.com/catalog/dragon-ball/

Date: 2026-05-21 05:18 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 120838 (118 KB)
- **goto duration**: 116 ms
- **Server**: `OVHcloud`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: ovhcloud
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `max-age=0`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (88 total)

| Host | Asset count |
|---|---|
| `www.toei-animation.com` | 84 |
| `fonts.googleapis.com` | 3 |
| `www.google.com` | 1 |

### stylesheet (10)

- https://fonts.googleapis.com/css?family=Acme%7COpen%20Sans%3A400%2C700%7CAbril%20FatFace%3A400%2C400i%2C700%2C700i%7CAlegreya%3A400%2C400i%2C700%2C700i%7CAlegreya%20Sans%3A400%2C400i%2C700%2C700i%7CAmatic%20SC%3A400%2C400i%2C700%2C700i%7CAnonymous%20Pro%3A400%2C400i%2C700%2C700i%7CArchitects%20Daughter%3A400%2C400i%2C700%2C700i%7CArchivo%3A400%2C400i%2C700%2C700i%7CArchivo%20Narrow%3A400%2C400i%2C700%2C700i%7CAsap%3A400%2C400i%2C700%2C700i%7CBarlow%3A400%2C400i%2C700%2C700i%7CBioRhyme%3A400%2C400i%2C700%2C700i%7CBonbon%3A400%2C400i%2C700%2C700i%7CCabin%3A400%2C400i%2C700%2C700i%7CCairo%3A400%2C400i%2C700%2C700i%7CCardo%3A400%2C400i%2C700%2C700i%7CChivo%3A400%2C400i%2C700%2C700i%7CConcert%20One%3A400%2C400i%2C700%2C700i%7CCormorant%3A400%2C400i%2C700%2C700i%7CCrimson%20Text%3A400%2C400i%2C700%2C700i%7CEczar%3A400%2C400i%2C700%2C700i%7CExo%202%3A400%2C400i%2C700%2C700i%7CFira%20Sans%3A400%2C400i%2C700%2C700i%7CFjalla%20One%3A400%2C400i%2C700%2C700i%7CFrank%20Ruhl%20Libre%3A400%2C400i%2C700%2C700i%7CGreat%20Vibes%3A400%2C400i%2C700%2C700i%7CHeebo%3A400%2C400i%2C700%2C700i%7CIBM%20Plex%3A400%2C400i%2C700%2C700i%7CInconsolata%3A400%2C400i%2C700%2C700i%7CIndie%20Flower%3A400%2C400i%2C700%2C700i%7CInknut%20Antiqua%3A400%2C400i%2C700%2C700i%7CInter%3A400%2C400i%2C700%2C700i%7CKarla%3A400%2C400i%2C700%2C700i%7CLibre%20Baskerville%3A400%2C400i%2C700%2C700i%7CLibre%20Franklin%3A400%2C400i%2C700%2C700i%7CMontserrat%3A400%2C400i%2C700%2C700i%7CNeuton%3A400%2C400i%2C700%2C700i%7CNotable%3A400%2C400i%2C700%2C700i%7CNothing%20You%20Could%20Do%3A400%2C400i%2C700%2C700i%7CNoto%20Sans%3A400%2C400i%2C700%2C700i%7CNunito%3A400%2C400i%2C700%2C700i%7COld%20Standard%20TT%3A400%2C400i%2C700%2C700i%7COxygen%3A400%2C400i%2C700%2C700i%7CPacifico%3A400%2C400i%2C700%2C700i%7CPoppins%3A400%2C400i%2C700%2C700i%7CProza%20Libre%3A400%2C400i%2C700%2C700i%7CPT%20Sans%3A400%2C400i%2C700%2C700i%7CPT%20Serif%3A400%2C400i%2C700%2C700i%7CRakkas%3A400%2C400i%2C700%2C700i%7CReenie%20Beanie%3A400%2C400i%2C700%2C700i%7CRoboto%20Slab%3A400%2C400i%2C700%2C700i%7CRopa%20Sans%3A400%2C400i%2C700%2C700i%7CRubik%3A400%2C400i%2C700%2C700i%7CShadows%20Into%20Light%3A400%2C400i%2C700%2C700i%7CSpace%20Mono%3A400%2C400i%2C700%2C700i%7CSpectral%3A400%2C400i%2C700%2C700i%7CSue%20Ellen%20Francisco%3A400%2C400i%2C700%2C700i%7CTitillium%20Web%3A400%2C400i%2C700%2C700i%7CUbuntu%3A400%2C400i%2C700%2C700i%7CVarela%3A400%2C400i%2C700%2C700i%7CVollkorn%3A400%2C400i%2C700%2C700i%7CWork%20Sans%3A400%2C400i%2C700%2C700i%7CYatra%20One%3A400%2C400i%2C700%2C700i&amp;display=swap
- https://fonts.googleapis.com/css?family=Acme%7COpen%20Sans%3A400%2C700%7CAbril%20FatFace%3A400%2C400i%2C700%2C700i%7CAlegreya%3A400%2C400i%2C700%2C700i%7CAlegreya%20Sans%3A400%2C400i%2C700%2C700i%7CAmatic%20SC%3A400%2C400i%2C700%2C700i%7CAnonymous%20Pro%3A400%2C400i%2C700%2C700i%7CArchitects%20Daughter%3A400%2C400i%2C700%2C700i%7CArchivo%3A400%2C400i%2C700%2C700i%7CArchivo%20Narrow%3A400%2C400i%2C700%2C700i%7CAsap%3A400%2C400i%2C700%2C700i%7CBarlow%3A400%2C400i%2C700%2C700i%7CBioRhyme%3A400%2C400i%2C700%2C700i%7CBonbon%3A400%2C400i%2C700%2C700i%7CCabin%3A400%2C400i%2C700%2C700i%7CCairo%3A400%2C400i%2C700%2C700i%7CCardo%3A400%2C400i%2C700%2C700i%7CChivo%3A400%2C400i%2C700%2C700i%7CConcert%20One%3A400%2C400i%2C700%2C700i%7CCormorant%3A400%2C400i%2C700%2C700i%7CCrimson%20Text%3A400%2C400i%2C700%2C700i%7CEczar%3A400%2C400i%2C700%2C700i%7CExo%202%3A400%2C400i%2C700%2C700i%7CFira%20Sans%3A400%2C400i%2C700%2C700i%7CFjalla%20One%3A400%2C400i%2C700%2C700i%7CFrank%20Ruhl%20Libre%3A400%2C400i%2C700%2C700i%7CGreat%20Vibes%3A400%2C400i%2C700%2C700i%7CHeebo%3A400%2C400i%2C700%2C700i%7CIBM%20Plex%3A400%2C400i%2C700%2C700i%7CInconsolata%3A400%2C400i%2C700%2C700i%7CIndie%20Flower%3A400%2C400i%2C700%2C700i%7CInknut%20Antiqua%3A400%2C400i%2C700%2C700i%7CInter%3A400%2C400i%2C700%2C700i%7CKarla%3A400%2C400i%2C700%2C700i%7CLibre%20Baskerville%3A400%2C400i%2C700%2C700i%7CLibre%20Franklin%3A400%2C400i%2C700%2C700i%7CMontserrat%3A400%2C400i%2C700%2C700i%7CNeuton%3A400%2C400i%2C700%2C700i%7CNotable%3A400%2C400i%2C700%2C700i%7CNothing%20You%20Could%20Do%3A400%2C400i%2C700%2C700i%7CNoto%20Sans%3A400%2C400i%2C700%2C700i%7CNunito%3A400%2C400i%2C700%2C700i%7COld%20Standard%20TT%3A400%2C400i%2C700%2C700i%7COxygen%3A400%2C400i%2C700%2C700i%7CPacifico%3A400%2C400i%2C700%2C700i%7CPoppins%3A400%2C400i%2C700%2C700i%7CProza%20Libre%3A400%2C400i%2C700%2C700i%7CPT%20Sans%3A400%2C400i%2C700%2C700i%7CPT%20Serif%3A400%2C400i%2C700%2C700i%7CRakkas%3A400%2C400i%2C700%2C700i%7CReenie%20Beanie%3A400%2C400i%2C700%2C700i%7CRoboto%20Slab%3A400%2C400i%2C700%2C700i%7CRopa%20Sans%3A400%2C400i%2C700%2C700i%7CRubik%3A400%2C400i%2C700%2C700i%7CShadows%20Into%20Light%3A400%2C400i%2C700%2C700i%7CSpace%20Mono%3A400%2C400i%2C700%2C700i%7CSpectral%3A400%2C400i%2C700%2C700i%7CSue%20Ellen%20Francisco%3A400%2C400i%2C700%2C700i%7CTitillium%20Web%3A400%2C400i%2C700%2C700i%7CUbuntu%3A400%2C400i%2C700%2C700i%7CVarela%3A400%2C400i%2C700%2C700i%7CVollkorn%3A400%2C400i%2C700%2C700i%7CWork%20Sans%3A400%2C400i%2C700%2C700i%7CYatra%20One%3A400%2C400i%2C700%2C700i&amp;display=swap
- https://fonts.googleapis.com/css?family=Acme%7COpen%20Sans%3A400%2C700%7CAbril%20FatFace%3A400%2C400i%2C700%2C700i%7CAlegreya%3A400%2C400i%2C700%2C700i%7CAlegreya%20Sans%3A400%2C400i%2C700%2C700i%7CAmatic%20SC%3A400%2C400i%2C700%2C700i%7CAnonymous%20Pro%3A400%2C400i%2C700%2C700i%7CArchitects%20Daughter%3A400%2C400i%2C700%2C700i%7CArchivo%3A400%2C400i%2C700%2C700i%7CArchivo%20Narrow%3A400%2C400i%2C700%2C700i%7CAsap%3A400%2C400i%2C700%2C700i%7CBarlow%3A400%2C400i%2C700%2C700i%7CBioRhyme%3A400%2C400i%2C700%2C700i%7CBonbon%3A400%2C400i%2C700%2C700i%7CCabin%3A400%2C400i%2C700%2C700i%7CCairo%3A400%2C400i%2C700%2C700i%7CCardo%3A400%2C400i%2C700%2C700i%7CChivo%3A400%2C400i%2C700%2C700i%7CConcert%20One%3A400%2C400i%2C700%2C700i%7CCormorant%3A400%2C400i%2C700%2C700i%7CCrimson%20Text%3A400%2C400i%2C700%2C700i%7CEczar%3A400%2C400i%2C700%2C700i%7CExo%202%3A400%2C400i%2C700%2C700i%7CFira%20Sans%3A400%2C400i%2C700%2C700i%7CFjalla%20One%3A400%2C400i%2C700%2C700i%7CFrank%20Ruhl%20Libre%3A400%2C400i%2C700%2C700i%7CGreat%20Vibes%3A400%2C400i%2C700%2C700i%7CHeebo%3A400%2C400i%2C700%2C700i%7CIBM%20Plex%3A400%2C400i%2C700%2C700i%7CInconsolata%3A400%2C400i%2C700%2C700i%7CIndie%20Flower%3A400%2C400i%2C700%2C700i%7CInknut%20Antiqua%3A400%2C400i%2C700%2C700i%7CInter%3A400%2C400i%2C700%2C700i%7CKarla%3A400%2C400i%2C700%2C700i%7CLibre%20Baskerville%3A400%2C400i%2C700%2C700i%7CLibre%20Franklin%3A400%2C400i%2C700%2C700i%7CMontserrat%3A400%2C400i%2C700%2C700i%7CNeuton%3A400%2C400i%2C700%2C700i%7CNotable%3A400%2C400i%2C700%2C700i%7CNothing%20You%20Could%20Do%3A400%2C400i%2C700%2C700i%7CNoto%20Sans%3A400%2C400i%2C700%2C700i%7CNunito%3A400%2C400i%2C700%2C700i%7COld%20Standard%20TT%3A400%2C400i%2C700%2C700i%7COxygen%3A400%2C400i%2C700%2C700i%7CPacifico%3A400%2C400i%2C700%2C700i%7CPoppins%3A400%2C400i%2C700%2C700i%7CProza%20Libre%3A400%2C400i%2C700%2C700i%7CPT%20Sans%3A400%2C400i%2C700%2C700i%7CPT%20Serif%3A400%2C400i%2C700%2C700i%7CRakkas%3A400%2C400i%2C700%2C700i%7CReenie%20Beanie%3A400%2C400i%2C700%2C700i%7CRoboto%20Slab%3A400%2C400i%2C700%2C700i%7CRopa%20Sans%3A400%2C400i%2C700%2C700i%7CRubik%3A400%2C400i%2C700%2C700i%7CShadows%20Into%20Light%3A400%2C400i%2C700%2C700i%7CSpace%20Mono%3A400%2C400i%2C700%2C700i%7CSpectral%3A400%2C400i%2C700%2C700i%7CSue%20Ellen%20Francisco%3A400%2C400i%2C700%2C700i%7CTitillium%20Web%3A400%2C400i%2C700%2C700i%7CUbuntu%3A400%2C400i%2C700%2C700i%7CVarela%3A400%2C400i%2C700%2C700i%7CVollkorn%3A400%2C400i%2C700%2C700i%7CWork%20Sans%3A400%2C400i%2C700%2C700i%7CYatra%20One%3A400%2C400i%2C700%2C700i&#038;display=swap
- https://www.toei-animation.com/wp-includes/css/dist/block-library/style.min.css?ver=6.0.11
- https://www.toei-animation.com/wp-content/cache/min/1/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=1708670107
- https://www.toei-animation.com/wp-content/themes/toei/dist/css/vendors.min.css?ver=1645683979
- https://www.toei-animation.com/wp-content/cache/min/1/wp-content/themes/toei/dist/css/custom.min.css?ver=1708670107
- https://www.toei-animation.com/wp-content/themes/toei/dist/js/tac/css/tarteaucitron.min.css?ver=1670954403
- https://www.toei-animation.com/wp-content/themes/toei/fonts/icons/toeicon.ttf?fadem6
- https://www.toei-animation.com/wp-content/cache/min/1/wp-content/plugins/mailpoet/assets/dist/css/mailpoet-public.55cd0214.css?ver=1708670107

### script (17)

- https://www.toei-animation.com/wp-content/themes/toei/dist/js/tac/js.cookie.min.js?ver=1670947202
- https://www.toei-animation.com/wp-content/themes/toei/dist/js/tac/tarteaucitron_matomo.min.js?ver=1670947202
- https://www.toei-animation.com/wp-content/themes/toei/dist/js/tac/tarteaucitron.rnd_scripts_matomo.min.js?ver=1671019203
- https://www.toei-animation.com/wp-content/themes/toei/dist/js/tac/tarteaucitron.rnd_init_matomo.min.js?ver=1703005202
- https://www.toei-animation.com/wp-content/themes/toei/dist/js/tac/tarteaucitron.services.min.js?ver=1702566002
- https://www.toei-animation.com/wp-content/cache/min/1/wp-content/plugins/contact-form-7/includes/swv/js/index.js?ver=1708670107
- https://www.toei-animation.com/wp-content/cache/min/1/wp-content/plugins/contact-form-7/includes/js/index.js?ver=1708670107
- https://www.toei-animation.com/wp-content/themes/toei/dist/js/vendors.min.js?ver=1645683979
- https://www.toei-animation.com/wp-content/themes/toei/dist/js/custom.min.js?ver=1706806802
- https://www.google.com/recaptcha/api.js?render=6Lcq9PoUAAAAAKmXodV0koAin4RI0n3L3c8p6mlQ&amp;ver=3.0
- https://www.toei-animation.com/wp-includes/js/dist/vendor/regenerator-runtime.min.js?ver=0.13.9
- https://www.toei-animation.com/wp-includes/js/dist/vendor/wp-polyfill.min.js?ver=3.15.0
- https://www.toei-animation.com/wp-content/cache/min/1/wp-content/plugins/contact-form-7/modules/recaptcha/index.js?ver=1708670107
- https://www.toei-animation.com/wp-includes/js/jquery/jquery.min.js?ver=3.6.0
- https://www.toei-animation.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.3.2
- https://www.toei-animation.com/wp-content/cache/min/1/wp-content/plugins/mailpoet/assets/dist/js/public.js?ver=1708670107
- https://www.toei-animation.com/wp-content/plugins/wp-rocket/assets/js/lazyload/17.5/lazyload.min.js

### image (60)

- https://www.toei-animation.com/wp-content/uploads/2019/03/logo.svg
- https://www.toei-animation.com/wp-content/uploads/2019/03/logo.svg
- https://www.toei-animation.com/wp-content/uploads/2019/02/cover-3-db.jpg
- https://www.toei-animation.com/wp-content/uploads/2019/02/cover-3-db.jpg
- https://www.toei-animation.com/wp-content/uploads/2019/02/dr_slump_arale_product-148x118.jpg
- https://www.toei-animation.com/wp-content/uploads/2019/02/dr_slump_arale_product-148x118.jpg
- https://www.toei-animation.com/wp-content/uploads/2025/01/magic_NYCC_sub08-148x118.png
- https://www.toei-animation.com/wp-content/uploads/2025/01/magic_NYCC_sub08-148x118.png
- https://www.toei-animation.com/wp-content/uploads/2019/02/dragon_ball_product.jpg
- https://www.toei-animation.com/wp-content/uploads/2019/02/dragon_ball_product.jpg
- https://www.toei-animation.com/wp-content/uploads/2019/02/OP_138-896x509.png
- https://www.toei-animation.com/wp-content/uploads/2019/02/OP_138-896x509.png
- https://www.toei-animation.com/wp-content/uploads/2024/02/Logo-RTLZWEI-166x126.png
- https://www.toei-animation.com/wp-content/uploads/2024/02/Logo-RTLZWEI-166x126.png
- https://www.toei-animation.com/wp-content/uploads/2024/01/TURNER_Logo-1024x422-1-166x126.png
- https://www.toei-animation.com/wp-content/uploads/2024/01/TURNER_Logo-1024x422-1-166x126.png
- https://www.toei-animation.com/wp-content/uploads/2019/02/New-ADN-logo-166x126.png
- https://www.toei-animation.com/wp-content/uploads/2019/02/New-ADN-logo-166x126.png
- https://www.toei-animation.com/wp-content/uploads/2019/01/tv_crunchyroll.jpeg
- https://www.toei-animation.com/wp-content/uploads/2019/01/tv_crunchyroll.jpeg
- _... 40 more_

### font (1)

- https://www.toei-animation.com/wp-content/themes/toei/fonts/icons/toeicon.ttf?fadem6

## CSS selectors (1441 total) — sample top 50

```css
#end-resizable-editor-section {}
#mailpoet_form_1 {}
#mailpoet_form_1 .last .mailpoet_paragraph:last-child {}
#mailpoet_form_1 .mailpoet_checkbox {}
#mailpoet_form_1 .mailpoet_divider {}
#mailpoet_form_1 .mailpoet_form {}
#mailpoet_form_1 .mailpoet_form_column:last-child .mailpoet_paragraph:last-child {}
#mailpoet_form_1 .mailpoet_message {}
#mailpoet_form_1 .mailpoet_paragraph {}
#mailpoet_form_1 .mailpoet_paragraph.last {}
#mailpoet_form_1 .mailpoet_submit input {}
#mailpoet_form_1 .mailpoet_text {}
#mailpoet_form_1 .mailpoet_textarea {}
#mailpoet_form_1 .mailpoet_validate_error {}
#mailpoet_form_1 .mailpoet_validate_success {}
#mailpoet_form_1 form.mailpoet_form {}
.aligncenter {}
.blocks-gallery-caption {}
.blocks-gallery-grid:not(.has-nested-images) {}
.blocks-gallery-grid:not(.has-nested-images) figcaption {}
.blocks-gallery-grid:not(.has-nested-images).aligncenter .blocks-gallery-item figure {}
.fancybox-active {}
.fancybox-animated {}
.fancybox-bg {}
.fancybox-button {}
.fancybox-button div {}
.fancybox-button svg {}
.fancybox-button svg path {}
.fancybox-button--fsenter svg:nth-child(2) {}
.fancybox-button--fsexit svg:nth-child(1) {}
.fancybox-button--pause svg:nth-child(1) {}
.fancybox-button--play svg:nth-child(2) {}
.fancybox-button.fancybox-focus {}
.fancybox-button:focus {}
.fancybox-button:hover {}
.fancybox-button:link {}
.fancybox-button:visited {}
.fancybox-button[disabled] {}
.fancybox-button[disabled]:hover {}
.fancybox-can-pan .fancybox-content {}
.fancybox-can-swipe .fancybox-content {}
.fancybox-can-zoomIn .fancybox-content {}
.fancybox-can-zoomOut .fancybox-content {}
.fancybox-caption {}
.fancybox-caption a {}
.fancybox-caption a:hover {}
.fancybox-caption a:link {}
.fancybox-caption a:visited {}
.fancybox-caption--separate {}
.fancybox-caption__body {}
/* ... 1391 more (use --snapshot-dir to dump full list) */
```



---

<a name="apps-bot-data-rag-viz-media-md"></a>
## 📄 Fichier : `apps/bot/data/rag/viz-media.md`

**Titre original :** Recon report — https://www.viz.com/shonenjump/chapters/dragon-ball-super

### Recon report — https://www.viz.com/shonenjump/chapters/dragon-ball-super

Date: 2026-05-21 05:18 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 1763 (2 KB)
- **goto duration**: 324 ms
- **Server**: `nginx/1.27.5`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=utf-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `BrLGOiWyqpUqHlwIRwfq4Qoo4qegA5ILeCm-13DuOvqWcYp8ntaVqA==`
- **Cache-Control**: `max-age=163, public, s-maxage=1636`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (2 total)

| Host | Asset count |
|---|---|
| `www.googletagmanager.com` | 1 |
| `code.jquery.com` | 1 |

### script (2)

- https://www.googletagmanager.com/gtm.js?id=GTM-NL4KN8G&amp;gtm_auth=ZarF2Qyfj6o5KCl8wozoZA&amp;gtm_preview=env-2&amp;gtm_cookies_win=x
- https://code.jquery.com/jquery-1.11.3.min.js

## CSS selectors (0 total) — sample top 50

```css
```



---

<a name="apps-bot-data-rag-wiki-db-md"></a>
## 📄 Fichier : `apps/bot/data/rag/wiki-db.md`

**Titre original :** Recon report — https://en.wikipedia.org/wiki/Dragon_Ball

### Recon report — https://en.wikipedia.org/wiki/Dragon_Ball

Date: 2026-05-21 05:18 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 567054 (554 KB)
- **goto duration**: 156 ms
- **Server**: `mw-web.eqiad.main-55bdddf8d4-c4t6d`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: mw-web.eqiad.main-55bdddf8d4-c4t6d
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `private, s-maxage=0, max-age=0, must-revalidate, no-transform`

### CSP-allowed hosts (1)

- `commons.wikimedia.org`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (25 total)

| Host | Asset count |
|---|---|
| `upload.wikimedia.org` | 13 |
| `en.wikipedia.org` | 12 |

### stylesheet (2)

- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=ext.cite.styles%7Cext.uls.interlanguage%7Cext.visualEditor.desktopArticleTarget.noscript%7Cext.wikimediaBadges%7Cext.wikimediamessages.styles%7Cjquery.makeCollapsible.styles%7Cskins.vector.icons%2Cstyles%7Cskins.vector.search.codex.styles%7Cwikibase.client.init&amp;only=styles&amp;skin=vector-2022
- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=site.styles&amp;only=styles&amp;skin=vector-2022

### script (4)

- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=startup&amp;only=scripts&amp;raw=1&amp;skin=vector-2022
- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=ext.gadget.ReferenceTooltips%2Cswitcher&amp;skin=vector-2022&amp;version=na1av
- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=ext.visualEditor.core.utils.parsing%7Cext.visualEditor.desktopArticleTarget.init%7Cext.visualEditor.progressBarWidget%2CsupportCheck%2CtargetLoader%2CtempWikitextEditorWidget%2Ctrack%2Cve&amp;skin=vector-2022&amp;version=1pizk
- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=ext.centralNotice.bannerHistoryLogger%2CchoiceData%2Cdisplay%2CgeoIP%2CimpressionDiet%2CkvStore%2ClargeBannerLimit%2ClegacySupport%2CstartUp%7Cext.centralauth.ForeignApi%2Ccentralautologin%7Cext.checkUser.clientHints%7Cext.cite.ux-enhancements%7Cext.cx.eventlogging.campaigns%7Cext.cx.model%7Cext.cx.uls.quick.actions%7Cext.echo.centralauth%7Cext.eventLogging%2CnavigationTiming%2Cpopups%2CtestKitchen%2CwikimediaEvents%7Cext.eventLogging.metricsPlatform%7Cext.growthExperiments.SuggestedEditSession%7Cext.parsermigration.survey%7Cext.quicksurveys.init%2Clib%7Cext.uls.common%2Cinterface%2Cpreferences%2Cwebfonts%7Cext.uls.rewrite.entrypoints%7Cext.urlShortener.toolbar%7Cext.wikimediaEvents.testKitchen%7Cjquery%2Coojs%2Csite%7Cjquery.client%2CmakeCollapsible%2Cspinner%2CtextSelection%7Cjquery.spinner.styles%7Cjquery.uls.data%7Cmediawiki.ForeignApi%2CString%2CTitle%2Capi%2Cbase%2Ccldr%2Ccookie%2Cexperiments%2CjqueryMsg%2Clanguage%2Crouter%2Cstorage%2Ctoc%2Cuser%2Cutil%2CvisibleTimeout%7Cmediawiki.ForeignApi.core%7Cmediawiki.editfont.styles%7Cmediawiki.libs.pluralruleparser%7Cmediawiki.page.media%2Cready%7Cmediawiki.page.watch.ajax%7Cmmv.bootstrap%2Ccodex%7Cmw.cx.SiteMapper%7Cskins.vector.clientPreferences%2Cjs%7Cskins.vector.icons.js%7Cwikibase.client.vector-2022%7Cwikibase.databox.fromWikidata&amp;skin=vector-2022&amp;version=vkrwx

### image (19)

- https://en.wikipedia.org/static/images/icons/enwiki-25.svg
- https://en.wikipedia.org/static/images/mobile/copyright/wikipedia-wordmark-en-25.svg
- https://en.wikipedia.org/static/images/mobile/copyright/wikipedia-tagline-en-25.svg
- https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Semi-protection-shackle.svg/20px-Semi-protection-shackle.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Dragon_Ball_manga_1st_Japanese_edition_logo.svg/330px-Dragon_Ball_manga_1st_Japanese_edition_logo.svg.png
- https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Wiki_DragonBall_Earth.png/250px-Wiki_DragonBall_Earth.png
- https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Weekly_Sh%C5%8Dnen_Jump_No._51_%28Dec._1984%29_is_the_first_appearance_of_Goku._Cover_art_by_Akira_Toriyama.jpg/250px-Weekly_Sh%C5%8Dnen_Jump_No._51_%28Dec._1984%29_is_the_first_appearance_of_Goku._Cover_art_by_Akira_Toriyama.jpg
- https://upload.wikimedia.org/wikipedia/en/thumb/e/ea/Dragon_Ball_Z_arcade_conversion_kit_by_Banpresto.jpg/250px-Dragon_Ball_Z_arcade_conversion_kit_by_Banpresto.jpg
- https://upload.wikimedia.org/wikipedia/en/thumb/d/d0/Db_TCI.jpg/250px-Db_TCI.jpg
- https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Commons-logo.svg/40px-Commons-logo.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Wikiquote-logo.svg/40px-Wikiquote-logo.svg.png
- https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Symbol_category_class.svg/20px-Symbol_category_class.svg.png
- https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Symbol_category_class.svg/20px-Symbol_category_class.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Rubik%27s_cube_v3.svg/20px-Rubik%27s_cube_v3.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Wikipe-tan_face.svg/20px-Wikipe-tan_face.svg.png
- https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg/20px-OOjs_UI_icon_edit-ltr-progressive.svg.png
- https://en.wikipedia.org/wiki/Special:CentralAutoLogin/start?useformat=desktop&amp;type=1x1&amp;usesul3=1
- https://en.wikipedia.org/static/images/footer/wikimedia.svg
- https://en.wikipedia.org/w/resources/assets/mediawiki_compact.svg

## CSS selectors (131 total) — sample top 50

```css
.mw-parser-output .citation .mw-selflink {}
.mw-parser-output .citation q {}
.mw-parser-output .citation:target {}
.mw-parser-output .cs1-code {}
.mw-parser-output .cs1-format {}
.mw-parser-output .cs1-hidden-error {}
.mw-parser-output .cs1-kern-left {}
.mw-parser-output .cs1-kern-right {}
.mw-parser-output .cs1-maint {}
.mw-parser-output .cs1-visible-error {}
.mw-parser-output .cs1-ws-icon a {}
.mw-parser-output .hatnote {}
.mw-parser-output .hatnote i {}
.mw-parser-output .hatnote+link+.hatnote {}
.mw-parser-output .hatnote+span.mw-empty-elt+.hatnote {}
.mw-parser-output .hlist .mw-empty-li {}
.mw-parser-output .hlist dd {}
.mw-parser-output .hlist dd ol&gt;li:first-child::before {}
.mw-parser-output .hlist dd::after {}
.mw-parser-output .hlist dd:last-child::after {}
.mw-parser-output .hlist dl {}
.mw-parser-output .hlist dt {}
.mw-parser-output .hlist dt ol&gt;li:first-child::before {}
.mw-parser-output .hlist dt::after {}
.mw-parser-output .hlist dt:last-child::after {}
.mw-parser-output .hlist li {}
.mw-parser-output .hlist li ol&gt;li:first-child::before {}
.mw-parser-output .hlist li::after {}
.mw-parser-output .hlist li:last-child::after {}
.mw-parser-output .hlist ol {}
.mw-parser-output .hlist ol&gt;li {}
.mw-parser-output .hlist ol&gt;li::before {}
.mw-parser-output .hlist ul {}
.mw-parser-output .id-lock-free.id-lock-free a {}
.mw-parser-output .id-lock-limited.id-lock-limited a {}
.mw-parser-output .id-lock-registration.id-lock-registration a {}
.mw-parser-output .id-lock-subscription.id-lock-subscription a {}
.mw-parser-output .infobox .navbar {}
.mw-parser-output .infobox .side-box {}
.mw-parser-output .infobox-3cols-child {}
.mw-parser-output .infobox-subbox {}
.mw-parser-output .navbar {}
.mw-parser-output .navbar a&gt;abbr {}
.mw-parser-output .navbar a&gt;span {}
.mw-parser-output .navbar li {}
.mw-parser-output .navbar ul {}
.mw-parser-output .navbar-boxtext {}
.mw-parser-output .navbar-brackets::after {}
.mw-parser-output .navbar-brackets::before {}
.mw-parser-output .navbar-collapse {}
/* ... 81 more (use --snapshot-dir to dump full list) */
```



---

<a name="apps-bot-data-rag-wiki-dbsuper-md"></a>
## 📄 Fichier : `apps/bot/data/rag/wiki-dbsuper.md`

**Titre original :** Recon report — https://en.wikipedia.org/wiki/Dragon_Ball_Super

### Recon report — https://en.wikipedia.org/wiki/Dragon_Ball_Super

Date: 2026-05-21 05:18 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 257702 (252 KB)
- **goto duration**: 143 ms
- **Server**: `mw-web.eqiad.main-5d6f67cd87-wvlcf`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: mw-web.eqiad.main-5d6f67cd87-wvlcf
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `private, s-maxage=0, max-age=0, must-revalidate, no-transform`

### CSP-allowed hosts (1)

- `commons.wikimedia.org`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (15 total)

| Host | Asset count |
|---|---|
| `en.wikipedia.org` | 9 |
| `upload.wikimedia.org` | 6 |

### stylesheet (2)

- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=ext.cite.styles%7Cext.uls.interlanguage%7Cext.visualEditor.desktopArticleTarget.noscript%7Cext.wikimediamessages.styles%7Cjquery.makeCollapsible.styles%7Cskins.vector.icons%2Cstyles%7Cskins.vector.search.codex.styles%7Cwikibase.client.init&amp;only=styles&amp;skin=vector-2022
- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=site.styles&amp;only=styles&amp;skin=vector-2022

### script (1)

- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=startup&amp;only=scripts&amp;raw=1&amp;skin=vector-2022

### image (12)

- https://en.wikipedia.org/static/images/icons/enwiki-25.svg
- https://en.wikipedia.org/static/images/mobile/copyright/wikipedia-wordmark-en-25.svg
- https://en.wikipedia.org/static/images/mobile/copyright/wikipedia-tagline-en-25.svg
- https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Dragon_Ball_Super_Volume_1.png/250px-Dragon_Ball_Super_Volume_1.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Wikipe-tan_face.svg/20px-Wikipe-tan_face.svg.png
- https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Symbol_category_class.svg/20px-Symbol_category_class.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Wikipe-tan_face.svg/20px-Wikipe-tan_face.svg.png
- https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/40px-Flag_of_Japan.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/IPhone5white.png/20px-IPhone5white.png
- https://en.wikipedia.org/wiki/Special:CentralAutoLogin/start?useformat=desktop&amp;type=1x1&amp;usesul3=1
- https://en.wikipedia.org/static/images/footer/wikimedia.svg
- https://en.wikipedia.org/w/resources/assets/mediawiki_compact.svg

## CSS selectors (119 total) — sample top 50

```css
.mw-parser-output .citation .mw-selflink {}
.mw-parser-output .citation q {}
.mw-parser-output .citation:target {}
.mw-parser-output .cs1-code {}
.mw-parser-output .cs1-format {}
.mw-parser-output .cs1-hidden-error {}
.mw-parser-output .cs1-kern-left {}
.mw-parser-output .cs1-kern-right {}
.mw-parser-output .cs1-maint {}
.mw-parser-output .cs1-visible-error {}
.mw-parser-output .cs1-ws-icon a {}
.mw-parser-output .hatnote {}
.mw-parser-output .hatnote i {}
.mw-parser-output .hatnote+link+.hatnote {}
.mw-parser-output .hatnote+span.mw-empty-elt+.hatnote {}
.mw-parser-output .hlist .mw-empty-li {}
.mw-parser-output .hlist dd {}
.mw-parser-output .hlist dd ol&gt;li:first-child::before {}
.mw-parser-output .hlist dd::after {}
.mw-parser-output .hlist dd:last-child::after {}
.mw-parser-output .hlist dl {}
.mw-parser-output .hlist dt {}
.mw-parser-output .hlist dt ol&gt;li:first-child::before {}
.mw-parser-output .hlist dt::after {}
.mw-parser-output .hlist dt:last-child::after {}
.mw-parser-output .hlist li {}
.mw-parser-output .hlist li ol&gt;li:first-child::before {}
.mw-parser-output .hlist li::after {}
.mw-parser-output .hlist li:last-child::after {}
.mw-parser-output .hlist ol {}
.mw-parser-output .hlist ol&gt;li {}
.mw-parser-output .hlist ol&gt;li::before {}
.mw-parser-output .hlist ul {}
.mw-parser-output .id-lock-free.id-lock-free a {}
.mw-parser-output .id-lock-limited.id-lock-limited a {}
.mw-parser-output .id-lock-registration.id-lock-registration a {}
.mw-parser-output .id-lock-subscription.id-lock-subscription a {}
.mw-parser-output .infobox .navbar {}
.mw-parser-output .infobox-3cols-child {}
.mw-parser-output .infobox-subbox {}
.mw-parser-output .navbar {}
.mw-parser-output .navbar a&gt;abbr {}
.mw-parser-output .navbar a&gt;span {}
.mw-parser-output .navbar li {}
.mw-parser-output .navbar ul {}
.mw-parser-output .navbar-boxtext {}
.mw-parser-output .navbar-brackets::after {}
.mw-parser-output .navbar-brackets::before {}
.mw-parser-output .navbar-collapse {}
.mw-parser-output .navbar-ct-full {}
/* ... 69 more (use --snapshot-dir to dump full list) */
```



---

<a name="apps-bot-data-rag-wiki-dbz-md"></a>
## 📄 Fichier : `apps/bot/data/rag/wiki-dbz.md`

**Titre original :** Recon report — https://en.wikipedia.org/wiki/Dragon_Ball_Z

### Recon report — https://en.wikipedia.org/wiki/Dragon_Ball_Z

Date: 2026-05-21 05:18 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 428967 (419 KB)
- **goto duration**: 150 ms
- **Server**: `ATS/9.2.13`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: ats/9.2.13
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `private, s-maxage=0, max-age=0, must-revalidate, no-transform`

### CSP-allowed hosts (1)

- `commons.wikimedia.org`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (25 total)

| Host | Asset count |
|---|---|
| `upload.wikimedia.org` | 13 |
| `en.wikipedia.org` | 12 |

### stylesheet (2)

- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=ext.cite.styles%7Cext.uls.interlanguage%7Cext.visualEditor.desktopArticleTarget.noscript%7Cext.wikimediaBadges%7Cext.wikimediamessages.styles%7Cjquery.makeCollapsible.styles%7Cskins.vector.icons%2Cstyles%7Cskins.vector.search.codex.styles%7Cwikibase.client.init&amp;only=styles&amp;skin=vector-2022
- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=site.styles&amp;only=styles&amp;skin=vector-2022

### script (4)

- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=startup&amp;only=scripts&amp;raw=1&amp;skin=vector-2022
- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=ext.gadget.ReferenceTooltips%2Cswitcher&amp;skin=vector-2022&amp;version=na1av
- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=ext.visualEditor.core.utils.parsing%7Cext.visualEditor.desktopArticleTarget.init%7Cext.visualEditor.progressBarWidget%2CsupportCheck%2CtargetLoader%2CtempWikitextEditorWidget%2Ctrack%2Cve&amp;skin=vector-2022&amp;version=1pizk
- https://en.wikipedia.org/w/load.php?lang=en&amp;modules=ext.centralNotice.bannerHistoryLogger%2CchoiceData%2Cdisplay%2CgeoIP%2CimpressionDiet%2CkvStore%2ClargeBannerLimit%2ClegacySupport%2CstartUp%7Cext.centralauth.ForeignApi%2Ccentralautologin%7Cext.checkUser.clientHints%7Cext.cite.ux-enhancements%7Cext.cx.eventlogging.campaigns%7Cext.cx.model%7Cext.cx.uls.quick.actions%7Cext.echo.centralauth%7Cext.eventLogging%2CnavigationTiming%2Cpopups%2CtestKitchen%2CwikimediaEvents%7Cext.eventLogging.metricsPlatform%7Cext.growthExperiments.SuggestedEditSession%7Cext.parsermigration.survey%7Cext.quicksurveys.init%2Clib%7Cext.uls.common%2Cinterface%2Cpreferences%2Cwebfonts%7Cext.uls.rewrite.entrypoints%7Cext.urlShortener.toolbar%7Cext.wikimediaEvents.testKitchen%7Cjquery%2Coojs%2Csite%7Cjquery.client%2CmakeCollapsible%2Cspinner%2CtextSelection%7Cjquery.spinner.styles%7Cjquery.uls.data%7Cmediawiki.ForeignApi%2CString%2CTitle%2Capi%2Cbase%2Ccldr%2Ccookie%2Cexperiments%2CjqueryMsg%2Clanguage%2Crouter%2Cstorage%2Ctoc%2Cuser%2Cutil%2CvisibleTimeout%7Cmediawiki.ForeignApi.core%7Cmediawiki.editfont.styles%7Cmediawiki.libs.pluralruleparser%7Cmediawiki.page.media%2Cready%7Cmediawiki.page.watch.ajax%7Cmmv.bootstrap%2Ccodex%7Cmw.cx.SiteMapper%7Cskins.vector.clientPreferences%2Cjs%7Cskins.vector.icons.js%7Cwikibase.client.vector-2022%7Cwikibase.databox.fromWikidata&amp;skin=vector-2022&amp;version=vkrwx

### image (19)

- https://en.wikipedia.org/static/images/icons/enwiki-25.svg
- https://en.wikipedia.org/static/images/mobile/copyright/wikipedia-wordmark-en-25.svg
- https://en.wikipedia.org/static/images/mobile/copyright/wikipedia-tagline-en-25.svg
- https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Semi-protection-shackle.svg/20px-Semi-protection-shackle.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Dragon_Ball_Z_logo.svg/250px-Dragon_Ball_Z_logo.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Christopher_Sabat_%26_Sean_Schemmel_by_Gage_Skidmore.jpg/500px-Christopher_Sabat_%26_Sean_Schemmel_by_Gage_Skidmore.jpg
- https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Dragon_Ball.jpg/250px-Dragon_Ball.jpg
- https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Symbol_category_class.svg/20px-Symbol_category_class.svg.png
- https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Symbol_category_class.svg/20px-Symbol_category_class.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Wikipe-tan_face.svg/20px-Wikipe-tan_face.svg.png
- https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/40px-Flag_of_Japan.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Rubik%27s_cube_v3.svg/20px-Rubik%27s_cube_v3.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/EC1835_C_cut.jpg/20px-EC1835_C_cut.jpg
- https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Commons-logo.svg/20px-Commons-logo.svg.png
- https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Wikiquote-logo.svg/20px-Wikiquote-logo.svg.png
- https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg/20px-OOjs_UI_icon_edit-ltr-progressive.svg.png
- https://en.wikipedia.org/wiki/Special:CentralAutoLogin/start?useformat=desktop&amp;type=1x1&amp;usesul3=1
- https://en.wikipedia.org/static/images/footer/wikimedia.svg
- https://en.wikipedia.org/w/resources/assets/mediawiki_compact.svg

## CSS selectors (136 total) — sample top 50

```css
.mw-parser-output .citation .mw-selflink {}
.mw-parser-output .citation q {}
.mw-parser-output .citation:target {}
.mw-parser-output .cs1-code {}
.mw-parser-output .cs1-format {}
.mw-parser-output .cs1-hidden-error {}
.mw-parser-output .cs1-kern-left {}
.mw-parser-output .cs1-kern-right {}
.mw-parser-output .cs1-maint {}
.mw-parser-output .cs1-visible-error {}
.mw-parser-output .cs1-ws-icon a {}
.mw-parser-output .hatnote {}
.mw-parser-output .hatnote i {}
.mw-parser-output .hatnote+link+.hatnote {}
.mw-parser-output .hatnote+span.mw-empty-elt+.hatnote {}
.mw-parser-output .hlist .mw-empty-li {}
.mw-parser-output .hlist dd {}
.mw-parser-output .hlist dd ol&gt;li:first-child::before {}
.mw-parser-output .hlist dd::after {}
.mw-parser-output .hlist dd:last-child::after {}
.mw-parser-output .hlist dl {}
.mw-parser-output .hlist dt {}
.mw-parser-output .hlist dt ol&gt;li:first-child::before {}
.mw-parser-output .hlist dt::after {}
.mw-parser-output .hlist dt:last-child::after {}
.mw-parser-output .hlist li {}
.mw-parser-output .hlist li ol&gt;li:first-child::before {}
.mw-parser-output .hlist li::after {}
.mw-parser-output .hlist li:last-child::after {}
.mw-parser-output .hlist ol {}
.mw-parser-output .hlist ol&gt;li {}
.mw-parser-output .hlist ol&gt;li::before {}
.mw-parser-output .hlist ul {}
.mw-parser-output .ib-tv {}
.mw-parser-output .ib-tv .infobox-above {}
.mw-parser-output .ib-tv .infobox-header {}
.mw-parser-output .ib-tv img {}
.mw-parser-output .ib-tv-aka {}
.mw-parser-output .ib-tv-network-release td {}
.mw-parser-output .ib-tv-network-release th {}
.mw-parser-output .id-lock-free.id-lock-free a {}
.mw-parser-output .id-lock-limited.id-lock-limited a {}
.mw-parser-output .id-lock-registration.id-lock-registration a {}
.mw-parser-output .id-lock-subscription.id-lock-subscription a {}
.mw-parser-output .infobox .navbar {}
.mw-parser-output .infobox-3cols-child {}
.mw-parser-output .infobox-subbox {}
.mw-parser-output .navbar {}
.mw-parser-output .navbar a&gt;abbr {}
.mw-parser-output .navbar a&gt;span {}
/* ... 86 more (use --snapshot-dir to dump full list) */
```



---

<a name="apps-site-agents-md"></a>
## 📄 Fichier : `apps/site/AGENTS.md`

**Titre original :** This is NOT the Next.js you know

<!-- BEGIN:nextjs-agent-rules -->
### This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- Monorepo note: `next` is hoisted to the repo root, so from this app dir the
     bundled docs are at `../../node_modules/next/dist/docs/` (the root
     `AGENTS.md` references them with the resolved `node_modules/...` path). -->


---

<a name="apps-site-claude-md"></a>
## 📄 Fichier : `apps/site/CLAUDE.md`

**Titre original :** CLAUDE.md

@AGENTS.md


---

<a name="apps-site-readme-md"></a>
## 📄 Fichier : `apps/site/README.md`

**Titre original :** or

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
### or
yarn dev
### or
pnpm dev
### or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


---

<a name="deploy-readme-md"></a>
## 📄 Fichier : `deploy/README.md`

**Titre original :** deploy/ — provisioning self-contained du monorepo

### deploy/ — provisioning self-contained du monorepo

Tout ce qu'il faut pour faire tourner **shenron** sur un hôte Linux + systemd
**vit ici, dans le repo** (plus de dépendance à `~/vps/`). Le repo est la source
de vérité des units systemd, des vhosts nginx et des scripts d'ops.

## Contenu

| Chemin | Rôle |
|---|---|
| `deploy/systemd/shenron.service` | Bot prod (`bun src/index.ts`, hardening, MemoryMax 1.5G). |
| `deploy/systemd/shenron-backup.{service,timer}` | Backup SQLite `VACUUM INTO` quotidien 03:00 UTC (rétention 14j). |
| `deploy/systemd/shenron-guild-sync.{service,timer}` | Réconciliation DB↔Discord 04:00 UTC (**opt-in**, désactivé par défaut). |
| `deploy/systemd/shenron-neon-sync.{service,timer}` | Forward SQLite→Neon (runtime + `db_news`, wiki exclu) toutes les 30 min. |
| `deploy/systemd/shenron-neon-pull.{service,timer}` | Reverse Neon→SQLite (wiki éditorial, replica de lecture du bot) toutes les 15 min. |
| `deploy/nginx/bot.dragonballfr.com.conf` | Vhost API publique du bot (proxy `:5006`), domaine prod. |
| `deploy/nginx/bot.rpbey.fr.conf` | Vhost API publique du bot (proxy `:5006`), alias historique. |
| `deploy/nginx/shenron.conf` | Vhost dashboard SPA + upstream `shenron_api`. |
| `deploy/install.sh` | Installeur idempotent (copie units + reload + enable, `--nginx`, `--start`). |
| `scripts/backup-shenron-sqlite.sh` | Script du backup (appelé par le timer). |
| `scripts/shenron-guild-sync.sh` | Script de la réconciliation. |
| `scripts/deploy-shenron.sh` | Pull + lint/tsc + dashboard:css + restart + smoke `/auth/me` + rollback auto. |
| `apps/bot/scripts/sync-sqlite-to-neon.ts` | Forward mirror runtime+news (timer neon-sync). |
| `apps/bot/scripts/sync-neon-to-sqlite.ts` | Reverse mirror wiki Neon→SQLite (timer neon-pull). |
| `Dockerfile`, `fly.toml`, `.dockerignore` (**racine**) | Cible conteneur / Fly.io monorepo-aware (alternative sans VPS). |

## Déploiement bare-metal (VPS systemd)

```bash
git clone https://github.com/aphrody-code/shenron ~/shenron && cd ~/shenron
bun install
cp apps/bot/.env.example apps/bot/.env   # puis remplir les 6 tokens + secrets
### Miroir Neon : créer /home/ubuntu/.shenron-neon.env avec DATABASE_URL=… (600)
bun --filter @shenron/bot run db:migrate
bash deploy/install.sh --nginx --start
```

`install.sh` est ré-exécutable : après un `git pull` qui touche
`deploy/systemd/*` ou `deploy/nginx/*`, relancer `bash deploy/install.sh`
(ajouter `--nginx` si les vhosts ont changé) pour propager.

## Mise à jour applicative (sans toucher l'infra)

```bash
bash scripts/deploy-shenron.sh --pull   # pull + build + restart + smoke test
```

## Hypothèses de chemins

Les units référencent des chemins absolus : repo en `/home/ubuntu/shenron`,
Bun en `/home/ubuntu/.bun/bin/bun`, secrets Neon en
`/home/ubuntu/.shenron-neon.env`. Sur un autre layout, éditer
`deploy/systemd/*.service` (`WorkingDirectory`, `ExecStart`, `EnvironmentFile`,
`ReadWritePaths`) avant `install.sh`.

## Prérequis nginx

Les vhosts utilisent une zone de rate-limit partagée `rpb_api` qui doit être
déclarée dans le bloc `http {}` de `nginx.conf` (infra mutualisée, hors repo) :

```nginx
limit_req_zone $binary_remote_addr zone=rpb_api:10m rate=30r/s;
```

ainsi que des certificats letsencrypt pour les domaines servis :

```bash
sudo certbot --nginx -d bot.dragonballfr.com   # API bot (domaine prod)
sudo certbot --nginx -d bot.rpbey.fr            # API bot (alias historique)
sudo certbot --nginx -d shenron.rpbey.fr        # dashboard SPA (alias historique)
```

Le site (`dragonballfr.com`) est servi par Vercel, hors nginx VPS — pas de cert
local pour l'apex.

## Alternative sans VPS (conteneur)

Le `Dockerfile` + `fly.toml` à la **racine** (monorepo-aware : build au root,
run `apps/bot`) permettent un déploiement Fly.io (workflow
`.github/workflows/deploy-fly.yml`, déclenché si `FLY_API_TOKEN` configuré).
Le site est déjà 100 % Vercel. Seul le SQLite (`DATABASE_PATH=/data/bot.db`)
suppose un volume persistant — sur Fly, le mount `shenron_data` → `/data`.
Build : `docker build -f Dockerfile --build-arg GH_PACKAGES_TOKEN=<PAT> .`
(le token sert au fork privé `@aphrody-code/canvas` ; les `@rpbey/*` sont des
workspaces locaux).


---

<a name="docs-archive-db_expansion_report-md"></a>
## 📄 Fichier : `docs/archive/DB_EXPANSION_REPORT.md`

**Titre original :** 🐉 Rapport d'Expansion de la Base de Données Dragon Ball

### 🐉 Rapport d'Expansion de la Base de Données Dragon Ball

Date : 19 Mai 2026
Statut : ✅ Expansion Majeure Terminée

## 📊 Statistiques de Couverture

| Entité | Avant | Après | Source Principale |
|---|---|---|---|
| **Personnages** | 58 | 2783 | Jikan (MAL), Fandom FR/EN, AniList |
| **Planètes** | 20 | 73 | Fandom FR, dragonball-api |
| **Transformations** | 43 | 112 | Fandom FR, dragonball-api |
| **Épisodes** | 0 | 557 | Jikan (MAL) |
| **Films** | 0 | 14 | Jikan (MAL) |
| **Volumes Manga** | 0 | 64 | AniList |
| **Techniques** | 120 | 170 | Fandom FR/EN |
| **Sagas** | 0 | 29 | Manuel (Canon) |
| **Arcs** | 0 | 23 | Manuel (Canon) |
| **Jeux** | 0 | 59 | Manuel (Canon) |
| **News** | 0 | 5 | Site Officiel (Sitemap) |

## 🛠 Travaux Réalisés

1.  **Ingestion Massive de Personnages** :
    *   Création de `ingest-characters.ts` pour extraire les personnages de toutes les séries anime via Jikan.
    *   Création de `ingest-fandom-characters.ts` pour récupérer tous les noms de personnages depuis les catégories Fandom FR et EN.
    *   Enrichissement multilingue (Japonais/Romaji) via AniList.

2.  **Couverture Narrative** :
    *   Peuplement des tables `db_sagas` et `db_races` via `seed-canon.ts`.
    *   Création de `seed-arcs.ts` pour couvrir les arcs majeurs de DB, DBZ et DBS.
    *   Ingestion de tous les épisodes et films via `ingest-jikan.ts`.

3.  **Expansion du Lore** :
    *   Récupération des planètes et transformations supplémentaires via Fandom.
    *   Mise à jour de `seed-manga.ts` pour générer tous les volumes basés sur les données AniList.

4.  **Maintenance & Fiabilité** :
    *   Correction de bugs dans les scripts de seed (`join` non défini, slugs de sagas incorrects).
    *   Résolution du **schema drift** (colonnes `banner_url` et `equipped_banner` manquantes localement).
    *   Optimisation du script `unify-markdown.ts` pour éviter les segfaults sur les gros volumes de données (passage en mode append).

## 🚀 Prochaines Étapes

*   **Images** : Beaucoup de nouveaux personnages ont des images placeholders. Un script de mirroring d'assets pourrait être lancé pour télécharger les images réelles.
*   **Descriptions** : Les personnages Fandom n'ont que des descriptions génériques. Un scraper de texte wiki pourrait enrichir ces fiches.
*   **Fusions** : La table `fusions` reste à peupler.


---

<a name="docs-archive-dbo_fr-md"></a>
## 📄 Fichier : `docs/archive/dbo_fr.md`

**Titre original :** Recon report — https://fr.dragon-ball-official.com/

### Recon report — https://fr.dragon-ball-official.com/

Date: 2026-05-19 01:43 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 22317 (22 KB)
- **goto duration**: 1700 ms
- **Server**: `nginx`
- **X-Powered-By**: `PHP/8.1.29`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `etweemoHvsQ98ZFWjNIOX6pMGa0ZtloPp4uz91Y-1fOuGFtJcsiCnQ==`
- **Cache-Control**: `no-cache, private`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (40 total)

| Host | Asset count |
|---|---|
| `fr.dragon-ball-official.com` | 35 |
| `platform.twitter.com` | 2 |
| `www.googletagmanager.com` | 2 |
| `cdn.cookielaw.org` | 1 |

### script (15)

- https://cdn.cookielaw.org/scripttemplates/otSDKStub.js
- https://platform.twitter.com/widgets.js
- https://platform.twitter.com/widgets.js
- https://fr.dragon-ball-official.com/assets/js/jquery-3.5.0.min.js
- https://fr.dragon-ball-official.com/assets/js/Jquery.mysuggest.js
- https://fr.dragon-ball-official.com/assets/js/en.TextShortCut.js
- https://fr.dragon-ball-official.com/assets/js/modaal.min.js
- https://fr.dragon-ball-official.com/assets/js/TweenMax.js
- https://fr.dragon-ball-official.com/assets/js/jquery.inview.min.js
- https://fr.dragon-ball-official.com/assets/js/simplebar.min.js
- https://fr.dragon-ball-official.com/assets/js/shared.js
- https://fr.dragon-ball-official.com/assets/js/project.js
- https://fr.dragon-ball-official.com/assets/js/swiper.js
- https://fr.dragon-ball-official.com/assets/js/core.js
- https://fr.dragon-ball-official.com/assets/js/common.js

### image (23)

- https://fr.dragon-ball-official.com/assets/img/intro/icon_ball.png
- https://fr.dragon-ball-official.com/assets/img/shared/icon_x.png
- https://fr.dragon-ball-official.com/assets/img/shared/logo_title.png
- https://fr.dragon-ball-official.com/dragonball/fr/banner/2026/05/gwxwiECkwcraqwqp/X_0509_1200_675_FR.jpg
- https://fr.dragon-ball-official.com/assets/img/top/indicator.png
- https://fr.dragon-ball-official.com/dragonball/fr/banner/2026/01/eTprNieDh7PDeoKd/DBOS_770_404_en.jpg
- https://fr.dragon-ball-official.com/assets/img/top/indicator.png
- https://fr.dragon-ball-official.com/dragonball/fr/banner/2026/01/I4p87cfJ4Y008yXW/yoko_RGB_en.jpg
- https://fr.dragon-ball-official.com/assets/img/top/indicator.png
- https://fr.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://fr.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://fr.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://fr.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://fr.dragon-ball-official.com/assets/img/top/anime_super_banner.jpg
- https://fr.dragon-ball-official.com/assets/img/top/battle2026_banner.jpg
- https://fr.dragon-ball-official.com/assets/img/top/store_banner.png
- https://fr.dragon-ball-official.com/assets/img/top/daima_banner.jpg
- https://fr.dragon-ball-official.com/assets/img/top/squadra_banner.png
- https://fr.dragon-ball-official.com/assets/img/top/bn06.png
- https://fr.dragon-ball-official.com/assets/img/top/bn05.png
- _... 3 more_

### iframe (2)

- https://www.googletagmanager.com/ns.html?id=GTM-TW3DK5K
- https://www.googletagmanager.com/ns.html?id=GTM-TCJ83M8

## CSS selectors (0 total) — sample top 50

```css
```


---

<a name="docs-archive-fandom_fr-md"></a>
## 📄 Fichier : `docs/archive/fandom_fr.md`

**Titre original :** Recon report — https://dragonball.fandom.com/fr/wiki/Wiki_Dragon_Ball

### Recon report — https://dragonball.fandom.com/fr/wiki/Wiki_Dragon_Ball

Date: 2026-05-19 01:43 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 403
- **Body bytes**: 5612 (5 KB)
- **goto duration**: 96 ms
- **Server**: `cloudflare`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: Cloudflare
- **Trace/Ray ID**: `9fdf696b09dad396-FRA`
- **Cache-Control**: `private, s-maxage=0, max-age=0, must-revalidate`

### CSP-allowed hosts (1)

- `challenges.cloudflare.com`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (0 total)

| Host | Asset count |
|---|---|

## CSS selectors (5 total) — sample top 50

```css
#challenge-error-text {}
* {}
.main-content {}
body {}
html {}
```


---

<a name="docs-archive-news-md"></a>
## 📄 Fichier : `docs/archive/news.md`

**Titre original :** Recon report — https://fr.dragon-ball-official.com/news/

### Recon report — https://fr.dragon-ball-official.com/news/

Date: 2026-05-19 01:41 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 32343 (32 KB)
- **goto duration**: 1824 ms
- **Server**: `nginx`
- **X-Powered-By**: `PHP/8.1.29`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `u00xpwk82D0eT0H-_M-CmYQ8zYze2elXj01FyepmmAV4ntZ079MAwQ==`
- **Cache-Control**: `no-cache, private`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (35 total)

| Host | Asset count |
|---|---|
| `fr.dragon-ball-official.com` | 32 |
| `www.googletagmanager.com` | 2 |
| `cdn.cookielaw.org` | 1 |

### stylesheet (3)

- https://fr.dragon-ball-official.com/assets/css/reset.css
- https://fr.dragon-ball-official.com/assets/css/shared.css
- https://fr.dragon-ball-official.com/assets/css/news.css

### script (13)

- https://cdn.cookielaw.org/scripttemplates/otSDKStub.js
- https://fr.dragon-ball-official.com/assets/js/jquery-3.5.0.min.js
- https://fr.dragon-ball-official.com/assets/js/Jquery.mysuggest.js
- https://fr.dragon-ball-official.com/assets/js/en.TextShortCut.js
- https://fr.dragon-ball-official.com/assets/js/modaal.min.js
- https://fr.dragon-ball-official.com/assets/js/TweenMax.js
- https://fr.dragon-ball-official.com/assets/js/jquery.inview.min.js
- https://fr.dragon-ball-official.com/assets/js/simplebar.min.js
- https://fr.dragon-ball-official.com/assets/js/shared.js
- https://fr.dragon-ball-official.com/assets/js/project.js
- https://fr.dragon-ball-official.com/assets/js/swiper.js
- https://fr.dragon-ball-official.com/assets/js/core.js
- https://fr.dragon-ball-official.com/assets/js/common.js

### image (17)

- https://fr.dragon-ball-official.com/assets/img/intro/icon_ball.png
- https://fr.dragon-ball-official.com/assets/img/shared/icon_x.png
- https://fr.dragon-ball-official.com/assets/img/shared/logo_title.png
- https://fr.dragon-ball-official.com/dragonball/jp/news/2026/04/27/chara256_tn.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/dragonball/fr/news/2026/05/15/WDBN%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB_FR.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/dragonball/jp/news/2026/04/20/2794822.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/dragonball/jp/news/2026/05/11/n260518834-1.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/dragonball/jp/news/2026/04/28/h260513854-1.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/dragonball/jp/news/2026/04/20/2795403.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/dragonball/jp/news/2026/04/20/2785232.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/dragonball/jp/news/2026/04/30/h260513853-1.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/dragonball/jp/news/2026/04/20/chara255_tn.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/dragonball/fr/news/2026/05/08/WDBN%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB_FR.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/dragonball/en/news/2026/04/22/01_b_2.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/dragonball/fr/news/2026/05/07/X_0509_1200_675_FR.jpg?_=4d04f8bdb7c8af21c5bdd4863cf85498
- https://fr.dragon-ball-official.com/assets/img/shared/logo_shueisha.png
- https://fr.dragon-ball-official.com/assets/img/shared/logo_BNE.png

### iframe (2)

- https://www.googletagmanager.com/ns.html?id=GTM-TW3DK5K
- https://www.googletagmanager.com/ns.html?id=GTM-TCJ83M8

## CSS selectors (465 total) — sample top 50

```css
#bg-comics {}
#btn-random {}
#btn-random a {}
#btn-random.footer-btm {}
#btn-random.move {}
#btn-random.move a {}
#global-nav {}
#global-nav .keywords-text ul li {}
#global-nav ul {}
#global-nav ul li {}
#global-nav:after {}
#header {}
#header .contents {}
#header .contents li {}
#header .contents li:hover a {}
#header .contents li:hover a:after {}
#header .contents li:hover a:before {}
#header .contents>li {}
#header .contents>li a:after {}
#header .contents>li+li {}
#header .contents>li.about {}
#header .contents>li.about a:after {}
#header .contents>li.about a:before {}
#header .contents>li.features {}
#header .contents>li.features a:after {}
#header .contents>li.features a:before {}
#header .contents>li.highlights {}
#header .contents>li.highlights a:after {}
#header .contents>li.highlights a:before {}
#header .contents>li.home {}
#header .contents>li.home a:before {}
#header .contents>li.news {}
#header .contents>li.news a:after {}
#header .contents>li.news a:before {}
#header .contents>li.videos {}
#header .contents>li.videos a:after {}
#header .contents>li.videos a:before {}
#header .contents>li>a {}
#header .contents>li>a:after {}
#header .contents>li>a:before {}
#header .global-nav-inner {}
#header .global-nav-inner::-webkit-scrollbar {}
#header .global-nav-inner::-webkit-scrollbar-thumb {}
#header .global-nav-inner::-webkit-scrollbar-track {}
#header .global-sub-nav {}
#header .global-sub-nav ul li {}
#header .global-sub-nav ul li a {}
#header .header-sns {}
#header .header-sns li {}
#header .header-sns li a {}
/* ... 415 more (use --snapshot-dir to dump full list) */
```


---

<a name="docs-archive-sparking-fast-md"></a>
## 📄 Fichier : `docs/archive/sparking-fast.md`

**Titre original :** Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

### Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

Date: 2026-05-19 01:42 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 232023 (227 KB)
- **goto duration**: 335 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `2kphaN4-2ojxEsrC0e8SaT6wIAm5iuw1qWD8jKV1zTxE-yYLoRSjwg==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (76 total)

| Host | Asset count |
|---|---|
| `` | 48 |
| `en.bandainamcoent.eu` | 9 |
| `cdn.jsdelivr.net` | 9 |
| `static.bandainamcoent.eu` | 8 |
| `p325k7wa.twic.pics` | 1 |
| `www.youtube-nocookie.com` | 1 |

### stylesheet (10)

- https://en.bandainamcoent.eu/sites/default/files/css/css_XBoVHYZE8IfVKrOc4e5gK-PKirwU8VrvHcg5bwgNYQE.css?delta=0&amp;language=en&amp;theme=bne_main&amp;include=eJx1UO1OBCEMfCGExBciZZnjuADlaLkPn951ddVk9c9MOzNtmgaoYng8OguiP-WytuISGgYVExr8wrVyc59kFh5wccxOxcZMhZO5XCfG08_saSqvuV6gcL8b02lQGtTPsg__KHa2PkPJckY015nfnOizQIw8RVFdIIG55Qj2qGG7EiW6AencJN_wsplrBHdxG9rKcRaYO8KJR3VfbOlCj4OIgoqmNpIeJ75NKOUiVjmlPxbvsQoRSv_7shaLvh78D9hFH5hVdP2NOyjv7EqpuA
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/css/bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.4.0/8.x-3.x/drupal-bootstrap.min.css
- https://en.bandainamcoent.eu/sites/default/files/css/css_rK4jhT2bdSNylljCKVapcrV40lkltQk4mi-Z5toM1k8.css?delta=9&amp;language=en&amp;theme=bne_main&amp;include=eJx1UO1OBCEMfCGExBciZZnjuADlaLkPn951ddVk9c9MOzNtmgaoYng8OguiP-WytuISGgYVExr8wrVyc59kFh5wccxOxcZMhZO5XCfG08_saSqvuV6gcL8b02lQGtTPsg__KHa2PkPJckY015nfnOizQIw8RVFdIIG55Qj2qGG7EiW6AencJN_wsplrBHdxG9rKcRaYO8KJR3VfbOlCj4OIgoqmNpIeJ75NKOUiVjmlPxbvsQoRSv_7shaLvh78D9hFH5hVdP2NOyjv7EqpuA

### script (8)

- https://p325k7wa.twic.pics/?v1&amp;anticipation=0.5
- https://en.bandainamcoent.eu/sites/default/files/js/js_ZvUeuHVpBFilQ_ZkT2Bh3PLxA-jqXXUXI3KlmhA-uG4.js?scope=header&amp;delta=0&amp;language=en&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://en.bandainamcoent.eu/core/assets/vendor/jquery/jquery.min.js?v=4.0.0
- https://en.bandainamcoent.eu/sites/default/files/js/js_0r7mt14oD4r9_aULS_g7loP-AtUIdmGTAiWp9DkVODg.js?scope=header&amp;delta=2&amp;language=en&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://en.bandainamcoent.eu/modules/contrib/webform/js/webform.form.auto_focus.js?teyred
- https://en.bandainamcoent.eu/sites/default/files/js/js_zzLKmcd5j6YXnJR1x1zv8W6Nb-X4J7qRKCBN_5pmDpc.js?scope=footer&amp;delta=0&amp;language=en&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/js/bootstrap.min.js
- https://en.bandainamcoent.eu/sites/default/files/js/js_lPKk7FfeiFiVM1cK39vyFpfomOmNdJVjXZ2aSHmq7_c.js?scope=footer&amp;delta=2&amp;language=en&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof

### image (57)

- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/dbsz-logo.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/dbsz-logo.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/DBSZ-Header-desktop-new.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/dbsz-logo.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/DBSZ_banner_mobile.jpg
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/01-news/DBSZ_LA%20Trailer_Thumbnail_1.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/dbsz-keyfeature-3D-Fights.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz-deco-right-v2.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/dbsz-keyfeature-ground-will-shake.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz-deco-left-v2.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz_keyfeature_blaze_thumbnailfinal.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz-deco-right-v2.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz_keyfeature_create_thumbnailfinal.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz-deco-left-v2.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz_keyfeature_rivals_thumbnailfinal.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz-deco-right-v2.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/DBSZ_AVAILABLENOW_EN_USK-PEGI.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/dbsz-deluxe-EN.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/dbsz-ultimate-en.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/dbsz-collector-premium/dbsz-collector-premium-EN.jpg
- _... 37 more_

### iframe (1)

- https://www.youtube-nocookie.com/embed/4o1AT0-Iw0k?autoplay=0&amp;start=0&amp;rel=0&amp;mute=0

## CSS selectors (3106 total) — sample top 50

```css
#block-views-block-block-news-title-block-1 .arrow {}
#block-views-block-block-news-title-block-1 .view-block-news-title .result .slick-slide:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .news-exposed:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .slick-slide.slick-current.slick-active .news-exposed {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line .key-feature-description .field--name-field-catch-phrase {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line:nth-of-type(2n) .key-feature-description .field--name-field-catch-phrase {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line:nth-of-type(odd) .key-feature-description .field--name-field-catch-phrase {}
#block-views-block-discover-brand-block-1 .view-discover-brand .view-content .field-content .discover_link_brand a:hover {}
#block-views-block-galerie-personnages-block-2 .view-galerie-personnages .modale .slider-characterImage .modal-row .content {}
#block-views-block-galerie-personnages-block-2 .view-galerie-personnages .modale .slider-characterImage .modal-row .header {}
#block-views-block-introduction-teaser-block-1 .view-introduction-teaser .row .col-lg-5 .view-footer .view-platform-title .view-content .group-date .views-row {}
#block-views-block-newsletter-block-1 .view-content {}
#features-filter .form-item.form-type-checkbox {}
#navbar-administration.navbar-oriented .navbar-tray-vertical {}
#overlay-container {}
#toolbar {}
* {}
*:after {}
*:before {}
.affix {}
.ajax-progress {}
.ajax-progress-bar {}
.ajax-progress-bar .message {}
.ajax-progress-bar .percentage {}
.ajax-progress-bar .progress {}
.ajax-progress-fullscreen {}
.ajax-progress-throbber .message {}
.ajax-progress-throbber .throbber {}
.ajax-progress.ajax-progress-fullscreen {}
.alert {}
.alert .alert-link {}
.alert a {}
.alert a.btn {}
.alert a.btn:focus {}
.alert a.btn:hover {}
.alert h4 {}
.alert-danger {}
.alert-danger .alert-link {}
.alert-danger a {}
.alert-danger a:focus {}
.alert-danger a:hover {}
.alert-danger hr {}
.alert-dismissable {}
.alert-dismissable .close {}
.alert-dismissible {}
.alert-dismissible .close {}
.alert-info {}
.alert-info .alert-link {}
.alert-info a {}
.alert-info a:focus {}
/* ... 3056 more (use --snapshot-dir to dump full list) */
```


---

<a name="docs-archive-sparking-md"></a>
## 📄 Fichier : `docs/archive/sparking.md`

**Titre original :** Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

### Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

Date: 2026-05-19 01:41 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 232023 (227 KB)
- **goto duration**: 423 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `PyVSt3Rdw_q-AOCoGGl2iF1W8OleY0voGNKGjqCLW5ZrSugolG80ZA==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (76 total)

| Host | Asset count |
|---|---|
| `` | 48 |
| `en.bandainamcoent.eu` | 9 |
| `cdn.jsdelivr.net` | 9 |
| `static.bandainamcoent.eu` | 8 |
| `p325k7wa.twic.pics` | 1 |
| `www.youtube-nocookie.com` | 1 |

### stylesheet (10)

- https://en.bandainamcoent.eu/sites/default/files/css/css_XBoVHYZE8IfVKrOc4e5gK-PKirwU8VrvHcg5bwgNYQE.css?delta=0&amp;language=en&amp;theme=bne_main&amp;include=eJx1UO1OBCEMfCGExBciZZnjuADlaLkPn951ddVk9c9MOzNtmgaoYng8OguiP-WytuISGgYVExr8wrVyc59kFh5wccxOxcZMhZO5XCfG08_saSqvuV6gcL8b02lQGtTPsg__KHa2PkPJckY015nfnOizQIw8RVFdIIG55Qj2qGG7EiW6AencJN_wsplrBHdxG9rKcRaYO8KJR3VfbOlCj4OIgoqmNpIeJ75NKOUiVjmlPxbvsQoRSv_7shaLvh78D9hFH5hVdP2NOyjv7EqpuA
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/css/bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.4.0/8.x-3.x/drupal-bootstrap.min.css
- https://en.bandainamcoent.eu/sites/default/files/css/css_rK4jhT2bdSNylljCKVapcrV40lkltQk4mi-Z5toM1k8.css?delta=9&amp;language=en&amp;theme=bne_main&amp;include=eJx1UO1OBCEMfCGExBciZZnjuADlaLkPn951ddVk9c9MOzNtmgaoYng8OguiP-WytuISGgYVExr8wrVyc59kFh5wccxOxcZMhZO5XCfG08_saSqvuV6gcL8b02lQGtTPsg__KHa2PkPJckY015nfnOizQIw8RVFdIIG55Qj2qGG7EiW6AencJN_wsplrBHdxG9rKcRaYO8KJR3VfbOlCj4OIgoqmNpIeJ75NKOUiVjmlPxbvsQoRSv_7shaLvh78D9hFH5hVdP2NOyjv7EqpuA

### script (8)

- https://p325k7wa.twic.pics/?v1&amp;anticipation=0.5
- https://en.bandainamcoent.eu/sites/default/files/js/js_ZvUeuHVpBFilQ_ZkT2Bh3PLxA-jqXXUXI3KlmhA-uG4.js?scope=header&amp;delta=0&amp;language=en&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://en.bandainamcoent.eu/core/assets/vendor/jquery/jquery.min.js?v=4.0.0
- https://en.bandainamcoent.eu/sites/default/files/js/js_0r7mt14oD4r9_aULS_g7loP-AtUIdmGTAiWp9DkVODg.js?scope=header&amp;delta=2&amp;language=en&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://en.bandainamcoent.eu/modules/contrib/webform/js/webform.form.auto_focus.js?teyred
- https://en.bandainamcoent.eu/sites/default/files/js/js_zzLKmcd5j6YXnJR1x1zv8W6Nb-X4J7qRKCBN_5pmDpc.js?scope=footer&amp;delta=0&amp;language=en&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/js/bootstrap.min.js
- https://en.bandainamcoent.eu/sites/default/files/js/js_lPKk7FfeiFiVM1cK39vyFpfomOmNdJVjXZ2aSHmq7_c.js?scope=footer&amp;delta=2&amp;language=en&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof

### image (57)

- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/dbsz-logo.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/dbsz-logo.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/DBSZ-Header-desktop-new.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/dbsz-logo.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/DBSZ_banner_mobile.jpg
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/01-news/DBSZ_LA%20Trailer_Thumbnail_1.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/dbsz-keyfeature-3D-Fights.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz-deco-right-v2.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/dbsz-keyfeature-ground-will-shake.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz-deco-left-v2.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz_keyfeature_blaze_thumbnailfinal.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz-deco-right-v2.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz_keyfeature_create_thumbnailfinal.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz-deco-left-v2.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz_keyfeature_rivals_thumbnailfinal.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-sparking-zero/00-page-setup/Page-Setup-Revamp/dbsz-deco-right-v2.png
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/DBSZ_AVAILABLENOW_EN_USK-PEGI.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/dbsz-deluxe-EN.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/dbsz-ultimate-en.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/dbsz-collector-premium/dbsz-collector-premium-EN.jpg
- _... 37 more_

### iframe (1)

- https://www.youtube-nocookie.com/embed/4o1AT0-Iw0k?autoplay=0&amp;start=0&amp;rel=0&amp;mute=0

## CSS selectors (3106 total) — sample top 50

```css
#block-views-block-block-news-title-block-1 .arrow {}
#block-views-block-block-news-title-block-1 .view-block-news-title .result .slick-slide:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .news-exposed:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .slick-slide.slick-current.slick-active .news-exposed {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line .key-feature-description .field--name-field-catch-phrase {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line:nth-of-type(2n) .key-feature-description .field--name-field-catch-phrase {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line:nth-of-type(odd) .key-feature-description .field--name-field-catch-phrase {}
#block-views-block-discover-brand-block-1 .view-discover-brand .view-content .field-content .discover_link_brand a:hover {}
#block-views-block-galerie-personnages-block-2 .view-galerie-personnages .modale .slider-characterImage .modal-row .content {}
#block-views-block-galerie-personnages-block-2 .view-galerie-personnages .modale .slider-characterImage .modal-row .header {}
#block-views-block-introduction-teaser-block-1 .view-introduction-teaser .row .col-lg-5 .view-footer .view-platform-title .view-content .group-date .views-row {}
#block-views-block-newsletter-block-1 .view-content {}
#features-filter .form-item.form-type-checkbox {}
#navbar-administration.navbar-oriented .navbar-tray-vertical {}
#overlay-container {}
#toolbar {}
* {}
*:after {}
*:before {}
.affix {}
.ajax-progress {}
.ajax-progress-bar {}
.ajax-progress-bar .message {}
.ajax-progress-bar .percentage {}
.ajax-progress-bar .progress {}
.ajax-progress-fullscreen {}
.ajax-progress-throbber .message {}
.ajax-progress-throbber .throbber {}
.ajax-progress.ajax-progress-fullscreen {}
.alert {}
.alert .alert-link {}
.alert a {}
.alert a.btn {}
.alert a.btn:focus {}
.alert a.btn:hover {}
.alert h4 {}
.alert-danger {}
.alert-danger .alert-link {}
.alert-danger a {}
.alert-danger a:focus {}
.alert-danger a:hover {}
.alert-danger hr {}
.alert-dismissable {}
.alert-dismissable .close {}
.alert-dismissible {}
.alert-dismissible .close {}
.alert-info {}
.alert-info .alert-link {}
.alert-info a {}
.alert-info a:focus {}
/* ... 3056 more (use --snapshot-dir to dump full list) */
```


---

<a name="packages-di-changelog-md"></a>
## 📄 Fichier : `packages/di/CHANGELOG.md`

**Titre original :** @discordx/di

### @discordx/di

## 3.3.4

### Patch Changes

- fix default di add service instance

## 3.3.3

### Patch Changes

- dep update and eslint

## 3.3.2

### Patch Changes

- build config

## 3.3.1

### Patch Changes

- lint

## 3.3.0

### Minor Changes

- refactor: added clearAllServices method for engine and updated DIService to act as bridge for engine only

## 3.2.0

### Minor Changes

- fix: monorepo


---

<a name="packages-di-readme-md"></a>
## 📄 Fichier : `packages/di/README.md`

**Titre original :** @rpbey/di

### @rpbey/di

> Dependency-injection bridge for **discordy**. Adapters for `tsyringe` and `typedi`.

```bash
bun add @rpbey/di tsyringe reflect-metadata
```

## Usage

```ts
import "reflect-metadata";
import { container } from "tsyringe";
import { tsyringeDependencyRegistryEngine } from "@rpbey/di";
import { DIService } from "@rpbey/discordy";

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);
```

Once registered, every class decorated with `@Discord` is resolved through the container:

```ts
import { injectable } from "tsyringe";
import { Discord, Slash } from "@rpbey/discordy";

@Discord()
@injectable()
class Commands {
  constructor(private readonly db: DatabaseService) {}

  @Slash({ name: "stats" })
  async stats(i: CommandInteraction) {
    const count = await this.db.userCount();
    await i.reply(`Users: ${count}`);
  }
}
```

## Exports

- `tsyringeDependencyRegistryEngine`
- `typeDiDependencyRegistryEngine`
- `DependencyRegistryEngine` (base class)

## License

Apache-2.0


---

<a name="packages-di-security-md"></a>
## 📄 Fichier : `packages/di/SECURITY.md`

**Titre original :** Security Policy

### Security Policy

## Supported Versions

currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

Please report vulnerabilities via github issues, with the prefix starting with `SECURITY:`. If possible, please submit a PR for the fix.


---

<a name="packages-discordy-changelog-md"></a>
## 📄 Fichier : `packages/discordy/CHANGELOG.md`

**Titre original :** discordx

### discordx

## 11.13.3

### Patch Changes

- slash option result type helper

## 11.13.2

### Patch Changes

- fix(discordx): events methods

## 11.13.1

### Patch Changes

- fix: init command

## 11.13.0

### Minor Changes

- refactor: various internal code improvement

### Patch Changes

- Updated dependencies []:
  - @discordx/internal@1.2.0

## 11.12.6

### Patch Changes

- fix: init command crash due to primary entry point command

## 11.12.5

### Patch Changes

- Dep update

## 11.12.4

### Patch Changes

- Updated dependencies []:
  - @discordx/di@3.3.4

## 11.12.3

### Patch Changes

- dep update and eslint

- Updated dependencies []:
  - @discordx/internal@1.1.5
  - @discordx/di@3.3.3

## 11.12.2

### Patch Changes

- fix memory leak in event triggers

## 11.12.1

### Patch Changes

- dep updates and improvements

## 11.12.0

### Minor Changes

- added support for slash command builder

## 11.11.3

### Patch Changes

- allow deleted commands to retain in init

## 11.11.2

### Patch Changes

- fix init commands log

## 11.11.1

### Patch Changes

- build config

- Updated dependencies []:
  - @discordx/internal@1.1.4
  - @discordx/di@3.3.2

## 11.11.0

### Minor Changes

- improve init application commands method

## 11.10.0

### Minor Changes

- removed discordx plugin feature

## 11.9.4

### Patch Changes

- lint

- Updated dependencies []:
  - @discordx/internal@1.1.2
  - @discordx/di@3.3.1

## 11.9.3

### Patch Changes

- internal code improvement

- Updated dependencies []:
  - @discordx/internal@1.1.1

## 11.9.2

### Patch Changes

- [#1012](https://github.com/discordx-ts/discordx/pull/1012) [`77007d5`](https://github.com/discordx-ts/discordx/commit/77007d5b69ce3846c283841a58e8271d072fe07f) Thanks [@vijayymmeena](https://github.com/vijayymmeena)! - remove regex from simple command message instance

## 11.9.1

### Patch Changes

- [#1010](https://github.com/discordx-ts/discordx/pull/1010) [`37753c6`](https://github.com/discordx-ts/discordx/commit/37753c61d07f2ef47fa48ea10404bc992d865f28) Thanks [@vijayymmeena](https://github.com/vijayymmeena)! - fixed issue #1009

## 11.9.0

### Minor Changes

- refactor: added initEvents and removeEvents for binding discordx events

## 11.8.2

### Patch Changes

- refactor: update di

## 11.8.1

### Patch Changes

- fix: metadata cleanup

## 11.8.0

### Minor Changes

- fix: monorepo

### Patch Changes

- Updated dependencies
  - @discordx/internal@1.1.0
  - @discordx/di@3.2.0


---

<a name="packages-discordy-readme-md"></a>
## 📄 Fichier : `packages/discordy/README.md`

**Titre original :** @rpbey/discordy

### @rpbey/discordy

> Core of **discordy** — TypeScript-decorator framework for `discord.js` 14.26+.

```bash
bun add discord.js reflect-metadata @rpbey/discordy
```

## What it does

Wraps `discord.js` in a decorator-driven API: `@Discord`, `@Slash`, `@SlashGroup`, `@SlashOption`, `@SlashChoice`, `@ButtonComponent`, `@ModalComponent`, `@SelectMenuComponent`, `@ContextMenu`, `@On`, `@Once`, `@Reaction`, `@Guard`, `@SimpleCommand`.

Extends `discord.js`'s `Client` with `initApplicationCommands()`, `clearApplicationCommands()`, and an interaction router that dispatches to the right method based on metadata collected at import-time.

## Minimal bot

```ts
import "reflect-metadata";
import { Client, Discord, Slash } from "@rpbey/discordy";
import { IntentsBitField, MessageFlags } from "discord.js";
import type { CommandInteraction } from "discord.js";

@Discord()
class Ping {
  @Slash({ name: "ping", description: "Ping" })
  async run(i: CommandInteraction) {
    await i.reply({ content: "🏓", flags: MessageFlags.Ephemeral });
  }
}

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
  silent: false,
});

client.once("ready", () => client.initApplicationCommands());
await client.login(process.env.DISCORD_TOKEN!);
```

## Requirements

- `tsconfig`: `experimentalDecorators: true`, `emitDecoratorMetadata: true`
- `reflect-metadata` imported **before** any decorator-containing module
- `discord.js` ≥ 14.26 (uses `flags: MessageFlags.Ephemeral`)

## License

Apache-2.0


---

<a name="packages-discordy-security-md"></a>
## 📄 Fichier : `packages/discordy/SECURITY.md`

**Titre original :** Security Policy

### Security Policy

## Supported Versions

currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

Please report vulnerabilities via github issues, with the prefix starting with `SECURITY:`. If possible, please submit a PR for the fix.


---

<a name="packages-importer-changelog-md"></a>
## 📄 Fichier : `packages/importer/CHANGELOG.md`

**Titre original :** @discordx/importer

### @discordx/importer

## 1.3.3

### Patch Changes

- Dep update

## 1.3.2

### Patch Changes

- dep update and eslint

## 1.3.1

### Patch Changes

- build config

## 1.3.0

### Minor Changes

- fix: monorepo


---

<a name="packages-importer-readme-md"></a>
## 📄 Fichier : `packages/importer/README.md`

**Titre original :** @rpbey/importer

### @rpbey/importer

> Bun-native module auto-loader — scans globs, imports all matches.

> ⚠️ **Bun-only.** Uses `Bun.Glob` and `import.meta.dir`. Does not run on Node.

```bash
bun add @rpbey/importer
```

## Usage

```ts
import { importx, dirname } from "@rpbey/importer";

await importx(
  `${dirname(import.meta.url)}/{events,commands,components}/**/*.{ts,js}`,
);
```

Every matched file is dynamically `import()`-ed; side-effects (like `@Discord` class declarations) register themselves in `MetadataStorage`.

## Helpers

- `importx(pattern)` — scan + import all matches
- `dirname(urlOrPath)` — cross-ESM/CJS dir resolution
- `isESM()` — `true` under ESM, `false` under CJS

## Alternative

If you ship a standalone binary with `bun build --compile`, generate a static manifest at build time instead of scanning at runtime.

## License

Apache-2.0


---

<a name="packages-importer-security-md"></a>
## 📄 Fichier : `packages/importer/SECURITY.md`

**Titre original :** Security Policy

### Security Policy

## Supported Versions

currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

Please report vulnerabilities via github issues, with the prefix starting with `SECURITY:`. If possible, please submit a PR for the fix.


---

<a name="packages-internal-changelog-md"></a>
## 📄 Fichier : `packages/internal/CHANGELOG.md`

**Titre original :** @discordx/internal

### @discordx/internal

## 1.2.0

### Minor Changes

- refactor: various internal code improvement

## 1.1.5

### Patch Changes

- dep update and eslint

## 1.1.4

### Patch Changes

- build config

## 1.1.3

### Patch Changes

- description change and minor improvements

## 1.1.2

### Patch Changes

- lint

## 1.1.1

### Patch Changes

- internal code improvement

## 1.1.0

### Minor Changes

- fix: monorepo


---

<a name="packages-internal-readme-md"></a>
## 📄 Fichier : `packages/internal/README.md`

**Titre original :** @rpbey/internal

### @rpbey/internal

> Internal shared types and metadata storage for **discordy**.

> ⚠️ **Not a public API.** Consume `@rpbey/discordy` directly — this package exposes private types needed for plugin and decorator authoring only.

## What's inside

- `MetadataStorage` — global registry collecting decorator metadata at import time
- `Modifier<T>` — helper type for decorator composition
- Shared type aliases used across the framework

## License

Apache-2.0


---

<a name="packages-internal-security-md"></a>
## 📄 Fichier : `packages/internal/SECURITY.md`

**Titre original :** Security Policy

### Security Policy

## Supported Versions

currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

Please report vulnerabilities via github issues, with the prefix starting with `SECURITY:`. If possible, please submit a PR for the fix.


---

<a name="packages-pagination-changelog-md"></a>
## 📄 Fichier : `packages/pagination/CHANGELOG.md`

**Titre original :** @discordx/pagination

### @discordx/pagination

## 4.4.0

### Minor Changes

- refactor(pagination): adapt to builder methods and getter

## 4.3.0

### Minor Changes

- pagination button label optional

## 4.2.0

### Minor Changes

- allow pagination button to be removed

## 4.1.0

### Minor Changes

- page generation improvements

## 4.0.1

### Patch Changes

- fixes pagination exit on same page selection

## 4.0.0

### Major Changes

- pagination upgrade

## 3.6.0

### Minor Changes

- code refactoring

## 3.5.8

### Patch Changes

- Dep update

## 3.5.7

### Patch Changes

- dep update and eslint

## 3.5.6

### Patch Changes

- refactor(pagination): emoji support for button

## 3.5.5

### Patch Changes

- dep updates and improvements

## 3.5.4

### Patch Changes

- build config

## 3.5.3

### Patch Changes

- description change and minor improvements

## 3.5.2

### Patch Changes

- lint

## 3.5.1

### Patch Changes

- fix: payload construction with djs 14.15.1

## 3.5.0

### Minor Changes

- fix: monorepo


---

<a name="packages-pagination-readme-md"></a>
## 📄 Fichier : `packages/pagination/README.md`

**Titre original :** @rpbey/pagination

### @rpbey/pagination

> Button + select-menu pagination for Discord embeds.

```bash
bun add @rpbey/pagination
```

## Usage

```ts
import { Pagination, PaginationType } from "@rpbey/pagination";
import { EmbedBuilder } from "discord.js";

const pages = [
  { embeds: [new EmbedBuilder().setTitle("Page 1")] },
  { embeds: [new EmbedBuilder().setTitle("Page 2")] },
  { embeds: [new EmbedBuilder().setTitle("Page 3")] },
];

const pagination = new Pagination(interaction, pages, {
  type: PaginationType.Button,
  enableExit: true,
  time: 60_000,
});

await pagination.send();
```

## Options

- `type` — `Button` (prev/next/forward/backward/exit) or `SelectMenu`
- `time` — collector timeout in ms
- `enableExit`, `onTimeout`, `onPaginate` callbacks
- Custom labels via `previous`, `next`, `forward`, `backward`, `exit`

## License

Apache-2.0


---

<a name="packages-pagination-security-md"></a>
## 📄 Fichier : `packages/pagination/SECURITY.md`

**Titre original :** Security Policy

### Security Policy

## Supported Versions

currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

Please report vulnerabilities via github issues, with the prefix starting with `SECURITY:`. If possible, please submit a PR for the fix.


---

