# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Runtime constraint

**Bun-only, no Node.** Package manager, runtime, test runner and SQLite driver all come from Bun (`bun:sqlite`, `bun --watch`, `bun build --compile`). Do not introduce Node-only APIs or `node_modules` consumers that require a Node loader; use Bun equivalents (`Bun.file`, `Bun.$`, `Bun.Glob`, `bun:sqlite`). `@discordjs/voice`/`opus` are intentionally absent — voice XP uses `voiceStateUpdate`, never audio decoding.

## Common commands

```bash
bun install
bun run db:migrate        # required before first run
bun run db:seed-all       # seeds wiki (dragonball-api.com) + 15 achievement triggers
bun run dev               # watch mode
bun run type-check        # tsc --noEmit
bun run gen:entries       # regenerate src/_entries.ts barrel after adding command/event files
bun run db:generate       # generate SQL migration after editing src/db/schema.ts
bun run db:studio         # Drizzle UI
bun run build             # bundle to dist/index.js
bun run compile           # standalone binary (dist/dragonball-bot)
```

No test suite is wired in currently — `bunfig.toml` sets a test preload (`reflect-metadata`) but there are no `*.test.ts` files.

## Architecture

### DI + decorators pipeline
`src/index.ts` wires `tsyringe` into `@rpbey/discordx` **before** any decorated class is imported. Order matters:
1. `import "reflect-metadata"` (also preloaded via `bunfig.toml` → `src/lib/preload.ts` so every `bun run` / `bun test` has it, including migration scripts).
2. `DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container)`.
3. `import "./_entries"` — side-effect barrel that loads every `@Discord`-decorated command and event class. This file is **generated** by `scripts/gen-entries.ts`; do not hand-edit it. Running `bun run gen:entries` globs `src/commands/**/*.ts` + `src/events/**/*.ts` and rewrites the static list. A static barrel is required for `bun build --compile` and SWC tree-shaking to work.

Commands register against `GUILD_ID` only (`botGuilds: [env.GUILD_ID]`). Remove that field for multi-guild deployment.

### Layer convention
- `commands/` — `@Discord` classes with `@Slash` methods (one class per feature folder). Guarded with `@Guard(GuildOnly, ModOnly, …)` from `src/guards/`.
- `events/` — `@Discord` classes with `@On` handlers (no direct `client.on` wiring outside `src/index.ts`).
- `services/` — `@singleton()` tsyringe classes that own business logic and DB access. Commands/events should resolve services through constructor injection, not import the DB directly.
- `db/` — `DatabaseService` is the single `bun:sqlite` + Drizzle owner (WAL, foreign_keys ON, busy_timeout 5s). `schema.ts` is the source of truth; generate migrations with `db:generate` and apply them at startup (`src/index.ts` calls `migrate()` before `client.login`).
- `lib/` — pure helpers (`env` zod validation, `logger` pino, `xp` level math, `dbz-flavor` theme strings, `fusion-names` Goku+Vegeta=Vegito, `constants` XP/price thresholds).

### Path alias
`~/*` resolves to `src/*` (see `tsconfig.json` `paths`). Prefer `~/lib/env` over relative `../../lib/env`.

### Env + graceful degradation
Every channel/role ID in `.env` is **optional**. When an ID is missing, the owning feature must no-op silently instead of throwing — the README documents this as intentional (logs channels, jail role, vocal hub, ticket category, URL-in-bio role). Validate new env vars via `src/lib/env.ts` (zod) with sensible defaults.

### Theming rules
XP is surfaced to users as "unités", not XP. Level-up messages and quest flavor live in `src/lib/dbz-flavor.ts` — keep user-facing strings in French DBZ theme. `/raciste` is hardcoded 101% on `OWNER_ID` by spec (deterministic per-day for everyone else); documented in README.

### Achievements
`AchievementService` auto-grants on regex patterns stored in the `triggers` table (seeded via `db:seed-triggers`). Add new patterns with the `/succes set` admin command rather than editing seed data — the seed script is only a first-run convenience.

### Card rendering
`CardService` uses `@napi-rs/canvas`. Fonts in `assets/fonts/` are registered at service init. Custom profile card images go to `assets/cards/<key>.webp` and must be referenced via the `shop_items` table (`type='card'`).

## When adding a feature

1. Create the command/event file under the right folder (one `@Discord` class per file).
2. Run `bun run gen:entries` — without this, your module is never loaded.
3. If it touches persistence, edit `src/db/schema.ts` then `bun run db:generate` → commit the generated SQL migration.
4. Any new external ID gets a field in `src/lib/env.ts` (keep it optional when possible).
