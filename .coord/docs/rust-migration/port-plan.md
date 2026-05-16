> **⛔ ABANDONNÉ — 2026-05-16.** Décision : la prod reste **Bun + TS** (`apps/shenron/` sur VPS). Raison : 613 LOC portées sur ~29 878 (2 %), 5-6 semaines de port pour zéro gain runtime mesuré (FFI Rust déjà essayée via `native/`, plus lente sur les hot paths courts cf. bench `28ab50b`). La FFI sélective via `native/` reste en place (gain net 1.87× sur fnv1a/ETag des routes publiques cached). Le scaffold `~/.gemini/tmp/shenron/shenron-axum/` peut être archivé/purgé côté Gemini.

# Plan de port TS → Rust — shenron monorepo (HISTORIQUE)

Source data : `/home/ubuntu/.gemini/tmp/shenron/shenron_ts_map.json` (bot, 136 files / 28 687 LOC) + `shenron_ts_map_apps.json` (site, 24 files / 1 191 LOC). Scan : `2026-05-15T13:09:42Z`. Outil : `scan_ts_app.ts` (Bun + Regex).

**Total à porter : 160 fichiers TS, ~29 878 LOC.**

Cible : monorepo `shenron-axum` (`apps/server` Axum + `apps/web` Leptos + `apps/bot` poise/serenity + `packages/db` sqlx Postgres Neon).

Skill à invoquer pour chaque phase : `@bun2rs` (cf. `.claude/skills/bun2rs/SKILL.md`).

---

## Repartition par couche

| Domaine | Files | LOC | Cible Rust |
|---|---:|---:|---|
| dashboard | 37 | 8 915 | `apps/web/src/dashboard/` (Leptos components) |
| commands | 23 | 5 759 | `apps/bot/src/commands/` (poise) |
| services | 21 | 4 419 | `packages/services/` ou `apps/bot/src/services/` (struct + Arc) |
| api | 8 | 4 405 | `apps/server/src/routes/` (Axum handlers) |
| lib | 24 | 2 820 | `packages/util/` (utilities partagées) |
| events | 9 | 1 044 | `apps/bot/src/events/` (serenity event handlers) |
| db | 6 | 828 | `packages/db/src/{models,queries}.rs` |
| guards | 6 | 228 | `apps/server/src/middleware/` (tower layers) |
| index.ts | 1 | 233 | `apps/bot/src/main.rs` (déjà scaffolded) |
| **bot total** | **136** | **28 687** | |
| dbfr-site | 24 | 1 191 | `apps/web/src/pages/` (Leptos routes) |
| **TOTAL** | **160** | **29 878** | |

## Top-15 files (priorité bottleneck)

| LOC | File | Migration target |
|---:|---|---|
| 3 338 | `src/api/server.ts` | Split en `apps/server/src/routes/{public,admin,a2a,bot}.rs` |
| 1 097 | `src/commands/moderation/Moderation.ts` | `apps/bot/src/commands/moderation.rs` (poise) |
| 649 | `src/dashboard/pages/Levels.tsx` | `apps/web/src/pages/levels.rs` (Leptos) |
| 632 | `src/services/CardService.ts` | `apps/bot/src/services/card.rs` + crate `skia-safe` ou `tiny-skia` (canvas profile generation) |
| 628 | `src/dashboard/pages/Settings.tsx` | `apps/web/src/pages/settings.rs` |
| 555 | `src/dashboard/pages/Commands.tsx` | `apps/web/src/pages/commands.rs` |
| 499 | `src/dashboard/pages/Economy.tsx` | `apps/web/src/pages/economy.rs` |
| 497 | `src/db/schema.ts` | Étendre `packages/db/src/models.rs` (table `users` déjà fait, reste : `guildSettings`, `shopItems`, `inventory`, `actionLogs`, `voiceSessions`, `messageStats`, `triggers`, `wiki`, `invitesLog`, `jailRecords`, etc.) |
| 490 | `src/services/TranslateService.ts` | `apps/bot/src/services/translate.rs` (Tesseract via `tesseract-rs` + LibreTranslate via `reqwest`) |
| 460 | `src/dashboard/pages/Profile.tsx` | `apps/web/src/pages/profile.rs` |
| 456 | `src/dashboard/pages/Moderation.tsx` | `apps/web/src/pages/moderation.rs` |
| 447 | `src/commands/games/Pendu.ts` | `apps/bot/src/commands/games/pendu.rs` (poise) |
| 428 | `src/dashboard/pages/Triggers.tsx` | `apps/web/src/pages/triggers.rs` |
| 415 | `src/dashboard/pages/Shop.tsx` | `apps/web/src/pages/shop.rs` |
| 415 | `src/lib/canvas-kit.ts` | **CRITIQUE** : remplacer napi `@aphrody-code/canvas` (Skia) par `tiny-skia` (pure Rust) ou `skia-safe` (FFI Skia officielle). Hot path = profile card rendering. |

## Plan par phases

### Phase 0 — `packages/db` (828 LOC) — partiellement fait

✅ Table `users` JSONB schemas (equipped/achievements/inventory/fusion) — appliqué Neon.

À porter (depuis `src/db/schema.ts`, 497 LOC drizzle) :
- `guild_settings` (key/value cache 30s)
- `shop_items` (cards/badges/colors/titles avec prix)
- `inventory` (user_id, item_key, kind)
- `achievements_catalog` (code, name, description, condition)
- `action_logs` (mod/audit append-only)
- `voice_sessions` (user_id, channel_id, started_at, ended_at)
- `message_stats` (user_id, count, last_xp_at)
- `triggers` (regex pattern → reply)
- `wiki_pages` (slug, title, body, race/planet/etc.)
- `invites_log` (déjà ajouté côté Bun, à reporter)
- `jail_records` (user_id, expires_at, reason)
- `level_rewards` (level → role_id)

Outil : `sqlx migrate add <name>` × 12. Patterns : utiliser `JSONB` quand sub-records, `BIGSERIAL` PK pour logs, indexes covering pour leaderboard/stats.

### Phase 1 — `packages/util` (2 820 LOC) — utilities partagées

Ports faciles (logique pure) :
- `constants.ts` → `pub const` Rust (LEVEL_THRESHOLDS array, regex SERVER_INVITE_URL, etc.)
- `dbz-flavor.ts`, `fusion-names.ts` → arrays statiques
- `env.ts` (zod) → `envy` + `serde` ou `figment` crate
- `slash-user.ts` → helper `extract_user_from_member` côté poise
- `personas.ts` → const config 6 personas (token env, intents, app_id)
- `sanction-helpers.ts` → déjà partiellement porté (`parse_duration_ms`, `format_duration` dans `native/src/lib.rs`)
- `xp.ts` ✅ **DÉJÀ** porté (cf. `native/src/lib.rs::level_for_xp` mais en l'occurrence bench dit que TS pur est meilleur sur ce hot path court)

Plus complexe :
- `canvas-kit.ts` (415 LOC) → `tiny-skia` ou `resvg`. Profile cards = images PNG/WebP/AVIF. WebP/AVIF encode via `image-rs` + `libwebp-sys` + `ravif`.
- `discord-cdn.ts` → simple URL builder (trivial)
- `boot-audit.ts` → log + integrity check
- `preload.ts` → spécifique Bun, skip (Rust pas besoin)

### Phase 2 — `packages/services` (4 419 LOC)

Mapping tsyringe `@singleton()` → Rust :
- Pattern : chaque service = `pub struct LevelService { db: PgPool, settings: Arc<SettingsService> }` + `impl`
- Wire via injection manuelle dans `main.rs` du bot (`let level_svc = Arc::new(LevelService::new(db.clone(), settings.clone()))`)

Services à porter (par ordre criticité runtime) :
1. **LevelService** (XP gain + level-up + role rewards) — hot path message tick
2. **EconomyService** (zeni transactions, daily quest)
3. **CardService** (profile image gen → dépend `tiny-skia`)
4. **SettingsService** (guild_settings cache 30s) — moyen impact mais utilisé partout
5. **AchievementService** (unlock + persist)
6. **FusionService** (partner-fusion logic)
7. **GaugeService** (image gauges)
8. **TranslateService** (Tesseract + LibreTranslate) → external CLIs, garder calls externes via `tokio::process::Command`
9. **WikiService** (markdown render)
10. **StatsService** / **LeaderboardService** (agrégations SQL)

### Phase 3 — `apps/bot` events + commands (6 803 LOC)

**Events** (9 files, 1 044 LOC) — handlers `serenity` :
- `MessageXP` → on `Message::create` event (persona Kaïo)
- `VoiceXP` → tick task `tokio::interval(60s)` qui lit voice_states
- `JoinLeave` → `GuildMemberAdd`/`Remove` (Grand Prêtre)
- `BioRole` → `PresenceUpdate` (Grand Prêtre)
- `JailExpiry` → tick task `tokio::interval` (Enma)
- `AuditLog` / `InteractionLog` / `MessageLog` → Grand Prêtre listeners
- `ready` → log + init crons (Shenron only)

**Commands** (23 files, 5 759 LOC) — `poise::command` :
- admin/, config/, economy/, games/, level/, moderation/, utility/
- Le routing `@Bot("persona")` du fork @rpbey/discordx → en Rust : 6 `serenity::Client` chacun avec son `poise::Framework` indépendant et son sous-ensemble de commands. Le sharing du DB pool via `Arc<PgPool>`.
- Important : `Moderation.ts` 1 097 LOC = 19 commands → split en `commands/moderation/{ban,kick,mute,warn,unban,...}.rs`.

### Phase 4 — `apps/server` API (4 405 LOC)

Le monolithe `server.ts` (3 338 LOC) doit être splitté en routes Axum :
- `routes/public.rs` : `/api/public/{user,shop,leaderboard,stats,wiki/*,profile/:id/{card,scan}.png}` — cached, CORS, rate-limit (tower-governor)
- `routes/admin.rs` : `/api/{cron,database,services,stats,health,bot}` — auth Bearer
- `routes/a2a.rs` : `/api/a2a/{jsonrpc,events}` + `/.well-known/agent-card.json` — utiliser `a2a-rs` crate (déjà ajouté à n2b registry)
- `routes/bots.rs` : `/api/bots`, `/api/bots/:id`, `/api/bots/:id/commands` — multi-bot status
- Le serving du dashboard (Bun.serve HTML import) → `leptos_axum::LeptosRoutes` SSR (déjà scaffolded chez Gemini)

Helpers Axum à créer :
- `pub fn public_cached_json<T>(req, ttl_ms, fetch_fn) -> Response` — equivalent `publicCachedJson`
- `pub fn public_cached_image(req, ...) -> Response` — equivalent `publicCachedImage`
- `pub async fn fetch_discord_user_cached(id) -> User` — 5min TTL `dashmap`

### Phase 5 — Dashboard Leptos (8 915 LOC)

37 pages React → composants Leptos. Approche :
- 1 page React → 1 module Leptos avec `#[component] pub fn Page() -> impl IntoView`
- `useQuery(["key"])` → `Resource::new(|| ..., fetch_fn)` + `Suspense`
- `useState` → `RwSignal<T>` ou `create_signal`
- Tailwind v4 inchangé (Leptos supporte)
- Recharts → `leptos-chartistry` (https://github.com/feral-dot-io/leptos-chartistry)
- Forms : `<form>` + server functions `#[server]`

Pages à porter (par taille DESC) :
- Levels.tsx (649) → reward editor + thresholds
- Settings.tsx (628) → guild settings KV
- Commands.tsx (555) → list commands per bot
- Economy.tsx (499) → shop + transactions
- Profile.tsx (460) → profile card preview
- Moderation.tsx (456) → action logs viewer
- Triggers.tsx (428) → trigger regex CRUD
- Shop.tsx (415) → shop items CRUD
- + 29 autres pages (`Overview`, `Bot`, `Database`, `TableView`, `Cron`, `Services`, `Stats`, `Audit`, `Logs`, `Messages`, `Canvas`, etc.)

### Phase 6 — Site dbfr-site (1 191 LOC)

24 fichiers Next.js déjà partiellement portés par Gemini dans `apps/web/`. Pages restantes :
- `/profil/[id]` (170) → `/profil/:id` Leptos route (Gemini a déjà la base)
- `/wiki/dragon-ball/character/[id]` (115) → idem
- `/post/[slug]` (86)
- `/shop` (63)
- `/admin/bot` (57)
- `/admin/posts` (48)
- `/wiki/[...slug]` (45)
- `/wiki/dragon-ball` (50)
- `+ components/DiscordInviteFAB.tsx` (46), `components/ui/button.tsx` (59)

## Ordonnancement recommandé

1. **Sprint S1** (phase 0+1) : finir `packages/db` + `packages/util` — débloque le reste. ~2-3 jours.
2. **Sprint S2** (phase 2) : services — peut être parallélisé service par service. ~1 semaine.
3. **Sprint S3** (phase 3) : bot poise/serenity events + commands. ~1 semaine.
4. **Sprint S4** (phase 4) : API Axum routes. ~3-4 jours.
5. **Sprint S5** (phase 5) : dashboard Leptos. ~1-2 semaines (37 pages).
6. **Sprint S6** (phase 6) : site public. ~3 jours.

Total estimé : **~5-6 semaines avec 1 dev full-time** ou **~2-3 semaines en parallélisant Gemini + Claude + @bun2rs subagents**.

## Risques techniques

- **Canvas Skia napi** (`CardService` + `canvas-kit.ts`) — sortie via `tiny-skia` (pure Rust, pas de FFI) ou `skia-safe` (FFI Skia C++). Trade-off : `tiny-skia` API + simple, perf comparable pour profiles 800x300.
- **6 personas Discord** — `serenity` peut faire 6 Client paralleles dans 1 process Tokio (confirmé par Gemini), mais validation par bench RAM (Bun ~250 MB RSS, viser <500 MB Rust).
- **Multi-bot routing** — pas d'équivalent du décorateur `@Bot("persona")` en poise. Routing à faire à la main via 6 framework_options distincts.
- **Hydration Leptos** — `cargo-leptos` + setup workspace metadata indispensable. Gemini a déjà rencontré ce point (Cargo.toml workspace).
- **API contract stability** — porter API public en // de la migration data, pour que Vercel edge cache pas casser pendant transition.

## Liens

- Skill bun2rs : `.claude/skills/bun2rs/SKILL.md`
- Map TS bot : `/home/ubuntu/.gemini/tmp/shenron/shenron_ts_map.json`
- Map TS site : `/home/ubuntu/.gemini/tmp/shenron/shenron_ts_map_apps.json`
- Doc serde structs prêts : `.coord/docs/rust-migration/axum-leptos-migration.md`
- A2A bridge spec-conforme : `.coord/docs/a2a-protocol.md`
- DB Neon : project_id `patient-star-28731823` (DATABASE_URL dans `.gemini/tmp/shenron/shenron-axum/.env`)
