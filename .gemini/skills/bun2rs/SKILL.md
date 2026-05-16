---
name: bun2rs
description: Subagent workflow to systematically map and port all remaining TypeScript code (Discord bot, admin dashboard, public site) to the new 100% Rust monorepo architecture (Axum + Leptos + Serenity + SQLx) for zero latency. Use this when asked to port TS code to Rust.
---
# bun2rs - TypeScript to Rust Porting Subagent

This skill provides a systematic approach for translating the remaining TypeScript codebase into the native Rust monorepo.

## Goal
Achieve zero latency and 100% Rust coverage across the multi-token bot, monolithic Axum API, Admin dashboard, and public site.

## Target Architecture

The Rust monorepo uses the following components:
- `apps/server`: Axum + Tokio (API and SSR serving)
- `apps/web`: Leptos 0.8 (Frontend - Site and Dashboard)
- `apps/bot`: Serenity + Poise + Tokio (Discord Bot)
- `packages/db`: SQLx + PostgreSQL (Shared data layer)

## Porting Workflow

When instructed to port a specific domain or feature from TS to Rust, follow this strict pipeline:

1. **Discovery & Mapping**:
   - Use `glob` to find all relevant `.ts`/`.tsx` files in the legacy `src/` or `apps/` folders for the requested feature.
   - Read the files to extract business logic, database schemas, and API contracts.

2. **Database Layer (`packages/db`)**:
   - Identify any Prisma or Drizzle models from the TS code.
   - Translate them to `sqlx::FromRow` structs in `packages/db/src/models.rs`.
   - Write the corresponding raw SQL queries (using `RETURNING`, `ON CONFLICT DO UPDATE` where appropriate) in `packages/db/src/queries.rs`.

3. **Backend Logic (`apps/server`)**:
   - Translate Express/Elysia/Hono routes to Axum route handlers.
   - Utilize `axum::extract::State` to access the `PgPool`.

4. **Frontend UI (`apps/web`)**:
   - Translate React/Next.js components to Leptos components using the `view! { ... }` macro.
   - Convert `useEffect` and React Query hooks to Leptos `Resource` and `#[server]` functions.
   - Convert Tailwind classes directly (Leptos supports Tailwind).

5. **Discord Bot (`apps/bot`)**:
   - Translate `discord.js` commands to `poise::command`.
   - Inject the `PgPool` from `Context::data()`.

## Best Practices
- **No JS/TS bridging**: Ensure the ported code is 100% native Rust. Do not use NAPI or FFI to call the old code.
- **Strict Types**: Leverage Rust's `Option`, `Result`, and strong typing to handle errors gracefully.
- **Verification**: After porting a feature, run `cargo check` and `cargo fmt` to validate the syntax.

## Trigger
Use this skill automatically when migrating features from the old stack to the `shenron-axum` Rust monorepo.
