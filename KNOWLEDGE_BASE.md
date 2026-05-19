# 📚 Base de Connaissance Unifiée — 19/05/2026

> Ce fichier regroupe toute la documentation du projet pour faciliter le contexte et l'analyse.

## 🗂 Sommaire

- [Better Auth Integration Guide](#agents-skills-better-auth-best-practices-skill-md)
- [Create Auth Skill](#agents-skills-create-auth-skill-skill-md)
- [SKILL.md](#agents-skills-email-and-password-best-practices-skill-md)
- [SKILL.md](#agents-skills-organization-best-practices-skill-md)
- [SKILL.md](#agents-skills-two-factor-authentication-best-practices-skill-md)
- [intent-auditor](#claude-agents-intent-auditor-md)
- [Documentation partagée Claude ↔ Gemini](#coord-docs-readme-md)
- [Protocole A2A (Agent2Agent) — implémentation Shenron](#coord-docs-a2a-protocol-md)
- [MCP & A2A Cross-Agent Documentation](#coord-docs-mcp-cross-agent-md)
- [Setup MCP `coord` — bridge Claude ↔ Gemini](#coord-docs-mcp-setup-md)
- [Migration site DBFR → Axum + Leptos (HISTORIQUE)](#coord-docs-rust-migration-axum-leptos-migration-md)
- [Plan de port TS → Rust — shenron monorepo (HISTORIQUE)](#coord-docs-rust-migration-port-plan-md)
- [Catalog tools agents — backend Rust dispatch](#coord-docs-rust-migration-tools-catalog-md)
- [🌉 A2A & MCP Bridge Coordination (Gemini ↔ Claude)](#coord-memory-a2a_bridge-md)
- [Notes Claude — visibles par Gemini](#coord-memory-claude-md)
- [Notes Gemini — visibles par Claude](#coord-memory-gemini-md)
- [Mémoire partagée Claude ↔ Gemini](#coord-memory-shared-md)
- [bun2rs - TypeScript to Rust Porting Subagent](#gemini-skills-bun2rs-skill-md)
- [Changelog](#changelog-md)
- [CLAUDE.md — shenron](#claude-md)
- [Déploiement de Shenron](#deploy-md)
- [DESIGN.md — Système graphique DBFR](#design-md)
- [GEMINI.md — Shenron Monorepo](#gemini-md)
- [PROMPT.md — Sprint DBFR (Shenron bot + site public)](#prompt-md)
- [1. Bun ≥ 1.3](#readme-md)
- [This is NOT the Next.js you know](#apps-site-agents-md)
- [CLAUDE.md](#apps-site-claude-md)
- [or](#apps-site-readme-md)
- [@discordx/di](#packages-di-changelog-md)
- [@rpbey/di](#packages-di-readme-md)
- [Security Policy](#packages-di-security-md)
- [discordx](#packages-discordx-changelog-md)
- [@rpbey/discordx](#packages-discordx-readme-md)
- [Security Policy](#packages-discordx-security-md)
- [@discordx/importer](#packages-importer-changelog-md)
- [@rpbey/importer](#packages-importer-readme-md)
- [Security Policy](#packages-importer-security-md)
- [@discordx/internal](#packages-internal-changelog-md)
- [@rpbey/internal](#packages-internal-readme-md)
- [Security Policy](#packages-internal-security-md)
- [@discordx/pagination](#packages-pagination-changelog-md)
- [@rpbey/pagination](#packages-pagination-readme-md)
- [Security Policy](#packages-pagination-security-md)
- [Dragon Ball — cartographie sites & APIs (recon 2026-05-16)](#reference-db-recon-map-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero](#reference-db-recon-bandai-snapshots-en-bandainamcoent-eu_dragon-ball_dragon-ball-sparking-zero-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot](#reference-db-recon-bandai-snapshots-en-bandainamcoent-eu_dragon-ball_dragon-ball-z-kakarot-md)
- [Recon report — https://fr.bandainamcoent.eu/dragon-ball](#reference-db-recon-bandai-snapshots-fr-bandainamcoent-eu_dragon-ball-md)
- [Recon report — https://dragonball-api.com/](#reference-db-recon-recon-wide-dragonball-api-com-md)
- [Recon report — https://dragonball-multiverse.com/](#reference-db-recon-recon-wide-dragonball-multiverse-com-md)
- [Recon report — https://dragonball.fandom.com/fr/wiki/Wiki_Dragon_Ball](#reference-db-recon-recon-wide-dragonball-fandom-com_fr_wiki_wiki_dragon_ball-md)
- [Recon report — https://dragonball.fandom.com/ja/wiki/%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%AB%E5%85%AC%E5%BC%8F%E3%82%B5%E3%82%A4%E3%83%88](#reference-db-recon-recon-wide-dragonball-fandom-com_ja_wiki__e3_83_89_e3_83_a9_e3_82_b4_e3_83_b3_e3_-md)
- [Recon report — https://dragonball.fandom.com/wiki/Dragon_Ball_Wiki](#reference-db-recon-recon-wide-dragonball-fandom-com_wiki_dragon_ball_wiki-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-fighterz](#reference-db-recon-recon-wide-en-bandainamcoent-eu_dragon-ball_dragon-ball-fighterz-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero](#reference-db-recon-recon-wide-en-bandainamcoent-eu_dragon-ball_dragon-ball-sparking-zero-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-the-breakers](#reference-db-recon-recon-wide-en-bandainamcoent-eu_dragon-ball_dragon-ball-the-breakers-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-xenoverse-2](#reference-db-recon-recon-wide-en-bandainamcoent-eu_dragon-ball_dragon-ball-xenoverse-2-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot](#reference-db-recon-recon-wide-en-bandainamcoent-eu_dragon-ball_dragon-ball-z-kakarot-md)
- [Recon report — https://en.dragon-ball-official.com/](#reference-db-recon-recon-wide-en-dragon-ball-official-com-md)
- [Recon report — https://fr.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero](#reference-db-recon-recon-wide-fr-bandainamcoent-eu_dragon-ball_dragon-ball-sparking-zero-md)
- [Recon report — https://fr.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot](#reference-db-recon-recon-wide-fr-bandainamcoent-eu_dragon-ball_dragon-ball-z-kakarot-md)
- [Recon report — https://fr.dragon-ball-official.com/](#reference-db-recon-recon-wide-fr-dragon-ball-official-com-md)
- [Recon report — https://kanzenshuu.com/](#reference-db-recon-recon-wide-kanzenshuu-com-md)
- [Recon report — https://shonenjumpplus.com/](#reference-db-recon-recon-wide-shonenjumpplus-com-md)
- [Recon report — https://shonenjumpplus.com/episode/3270375685327748452](#reference-db-recon-recon-wide-shonenjumpplus-com_episode_3270375685327748452-md)
- [Recon report — https://www.dragonball.jp/](#reference-db-recon-recon-wide-www-dragonball-jp-md)
- [Recon report — https://www.kanzenshuu.com/](#reference-db-recon-recon-wide-www-kanzenshuu-com-md)
- [Recon report — https://www.shueisha.co.jp/](#reference-db-recon-recon-wide-www-shueisha-co-jp-md)
- [Recon report — https://www.toei-anim.co.jp/lineup/tv/dragon_ball_daima/](#reference-db-recon-recon-wide-www-toei-anim-co-jp_lineup_tv_dragon_ball_daima-md)
- [Recon report — https://www.viz.com/shonenjump/chapters/dragon-ball-super](#reference-db-recon-recon-wide-www-viz-com_shonenjump_chapters_dragon-ball-super-md)
- [Recon report — https://dragonball-api.com/](#reference-db-recon-recon-dragonball-api-com-md)
- [Recon report — https://dragonball-multiverse.com/](#reference-db-recon-recon-dragonball-multiverse-com-md)
- [Recon report — https://dragonball.fandom.com/fr/wiki/Wiki_Dragon_Ball](#reference-db-recon-recon-dragonball-fandom-com_fr_wiki_wiki_dragon_ball-md)
- [Recon report — https://dragonball.fandom.com/wiki/Dragon_Ball_Wiki](#reference-db-recon-recon-dragonball-fandom-com_wiki_dragon_ball_wiki-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot](#reference-db-recon-recon-en-bandainamcoent-eu_dragon-ball_dragon-ball-z-kakarot-md)
- [Recon report — https://en.dragon-ball-official.com/](#reference-db-recon-recon-en-dragon-ball-official-com-md)
- [Recon report — https://fr.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero](#reference-db-recon-recon-fr-bandainamcoent-eu_dragon-ball_dragon-ball-sparking-zero-md)
- [Recon report — https://fr.dragon-ball-official.com/](#reference-db-recon-recon-fr-dragon-ball-official-com-md)
- [Recon report — https://shonenjumpplus.com/](#reference-db-recon-recon-shonenjumpplus-com-md)
- [Recon report — https://www.dragonball.jp/](#reference-db-recon-recon-www-dragonball-jp-md)
- [Recon report — https://www.shueisha.co.jp/](#reference-db-recon-recon-www-shueisha-co-jp-md)
- [Recon report — https://www.viz.com/dragon-ball-super](#reference-db-recon-recon-www-viz-com_dragon-ball-super-md)

---

<a name="agents-skills-better-auth-best-practices-skill-md"></a>
## 📄 Fichier : `.agents/skills/better-auth-best-practices/SKILL.md`

**Titre original :** Better Auth Integration Guide

---
name: better-auth-best-practices
description: Configure Better Auth server and client, set up database adapters, manage sessions, add plugins, and handle environment variables. Use when users mention Better Auth, betterauth, auth.ts, or need to set up TypeScript authentication with email/password, OAuth, or plugin configuration.
---

### Better Auth Integration Guide

**Always consult [better-auth.com/docs](https://better-auth.com/docs) for code examples and latest API.**

---

## Setup Workflow

1. Install: `npm install better-auth`
2. Set env vars: `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`
3. Create `auth.ts` with database + config
4. Create route handler for your framework
5. Run `npx @better-auth/cli@latest migrate`
6. Verify: call `GET /api/auth/ok` — should return `{ status: "ok" }`

---

## Quick Reference

### Environment Variables
- `BETTER_AUTH_SECRET` - Encryption secret (min 32 chars). Generate: `openssl rand -base64 32`
- `BETTER_AUTH_URL` - Base URL (e.g., `https://example.com`)

Only define `baseURL`/`secret` in config if env vars are NOT set.

### File Location
CLI looks for `auth.ts` in: `./`, `./lib`, `./utils`, or under `./src`. Use `--config` for custom path.

### CLI Commands
- `npx @better-auth/cli@latest migrate` - Apply schema (built-in adapter)
- `npx @better-auth/cli@latest generate` - Generate schema for Prisma/Drizzle
- `npx @better-auth/cli mcp --cursor` - Add MCP to AI tools

**Re-run after adding/changing plugins.**

---

## Core Config Options

| Option | Notes |
|--------|-------|
| `appName` | Optional display name |
| `baseURL` | Only if `BETTER_AUTH_URL` not set |
| `basePath` | Default `/api/auth`. Set `/` for root. |
| `secret` | Only if `BETTER_AUTH_SECRET` not set |
| `database` | Required for most features. See adapters docs. |
| `secondaryStorage` | Redis/KV for sessions & rate limits |
| `emailAndPassword` | `{ enabled: true }` to activate |
| `socialProviders` | `{ google: { clientId, clientSecret }, ... }` |
| `plugins` | Array of plugins |
| `trustedOrigins` | CSRF whitelist |

---

## Database

**Direct connections:** Pass `pg.Pool`, `mysql2` pool, `better-sqlite3`, or `bun:sqlite` instance.

**ORM adapters:** Import from `better-auth/adapters/drizzle`, `better-auth/adapters/prisma`, `better-auth/adapters/mongodb`.

**Critical:** Better Auth uses adapter model names, NOT underlying table names. If Prisma model is `User` mapping to table `users`, use `modelName: "user"` (Prisma reference), not `"users"`.

---

## Session Management

**Storage priority:**
1. If `secondaryStorage` defined → sessions go there (not DB)
2. Set `session.storeSessionInDatabase: true` to also persist to DB
3. No database + `cookieCache` → fully stateless mode

**Cookie cache strategies:**
- `compact` (default) - Base64url + HMAC. Smallest.
- `jwt` - Standard JWT. Readable but signed.
- `jwe` - Encrypted. Maximum security.

**Key options:** `session.expiresIn` (default 7 days), `session.updateAge` (refresh interval), `session.cookieCache.maxAge`, `session.cookieCache.version` (change to invalidate all sessions).

---

## User & Account Config

**User:** `user.modelName`, `user.fields` (column mapping), `user.additionalFields`, `user.changeEmail.enabled` (disabled by default), `user.deleteUser.enabled` (disabled by default).

**Account:** `account.modelName`, `account.accountLinking.enabled`, `account.storeAccountCookie` (for stateless OAuth).

**Required for registration:** `email` and `name` fields.

---

## Email Flows

- `emailVerification.sendVerificationEmail` - Must be defined for verification to work
- `emailVerification.sendOnSignUp` / `sendOnSignIn` - Auto-send triggers
- `emailAndPassword.sendResetPassword` - Password reset email handler

---

## Security

**In `advanced`:**
- `useSecureCookies` - Force HTTPS cookies
- `disableCSRFCheck` - ⚠️ Security risk
- `disableOriginCheck` - ⚠️ Security risk  
- `crossSubDomainCookies.enabled` - Share cookies across subdomains
- `ipAddress.ipAddressHeaders` - Custom IP headers for proxies
- `database.generateId` - Custom ID generation or `"serial"`/`"uuid"`/`false`

**Rate limiting:** `rateLimit.enabled`, `rateLimit.window`, `rateLimit.max`, `rateLimit.storage` ("memory" | "database" | "secondary-storage").

---

## Hooks

**Endpoint hooks:** `hooks.before` / `hooks.after` - Array of `{ matcher, handler }`. Use `createAuthMiddleware`. Access `ctx.path`, `ctx.context.returned` (after), `ctx.context.session`.

**Database hooks:** `databaseHooks.user.create.before/after`, same for `session`, `account`. Useful for adding default values or post-creation actions.

**Hook context (`ctx.context`):** `session`, `secret`, `authCookies`, `password.hash()`/`verify()`, `adapter`, `internalAdapter`, `generateId()`, `tables`, `baseURL`.

---

## Plugins

**Import from dedicated paths for tree-shaking:**
```
import { twoFactor } from "better-auth/plugins/two-factor"
```
NOT `from "better-auth/plugins"`.

**Popular plugins:** `twoFactor`, `organization`, `passkey`, `magicLink`, `emailOtp`, `username`, `phoneNumber`, `admin`, `apiKey`, `bearer`, `jwt`, `multiSession`, `sso`, `oauthProvider`, `oidcProvider`, `openAPI`, `genericOAuth`.

Client plugins go in `createAuthClient({ plugins: [...] })`.

---

## Client

Import from: `better-auth/client` (vanilla), `better-auth/react`, `better-auth/vue`, `better-auth/svelte`, `better-auth/solid`.

Key methods: `signUp.email()`, `signIn.email()`, `signIn.social()`, `signOut()`, `useSession()`, `getSession()`, `revokeSession()`, `revokeSessions()`.

---

## Type Safety

Infer types: `typeof auth.$Infer.Session`, `typeof auth.$Infer.Session.user`.

For separate client/server projects: `createAuthClient<typeof auth>()`.

---

## Common Gotchas

1. **Model vs table name** - Config uses ORM model name, not DB table name
2. **Plugin schema** - Re-run CLI after adding plugins
3. **Secondary storage** - Sessions go there by default, not DB
4. **Cookie cache** - Custom session fields NOT cached, always re-fetched
5. **Stateless mode** - No DB = session in cookie only, logout on cache expiry
6. **Change email flow** - Sends to current email first, then new email

---

## Resources

- [Docs](https://better-auth.com/docs)
- [Options Reference](https://better-auth.com/docs/reference/options)
- [LLMs.txt](https://better-auth.com/llms.txt)
- [GitHub](https://github.com/better-auth/better-auth)
- [Init Options Source](https://github.com/better-auth/better-auth/blob/main/packages/core/src/types/init-options.ts)

---

<a name="agents-skills-create-auth-skill-skill-md"></a>
## 📄 Fichier : `.agents/skills/create-auth-skill/SKILL.md`

**Titre original :** Create Auth Skill

---
name: create-auth-skill
description: Scaffold and implement authentication in TypeScript/JavaScript apps using Better Auth. Detect frameworks, configure database adapters, set up route handlers, add OAuth providers, and create auth UI pages. Use when users want to add login, sign-up, or authentication to a new or existing project with Better Auth.
---

### Create Auth Skill

Guide for adding authentication to TypeScript/JavaScript applications using Better Auth.

**For code examples and syntax, see [better-auth.com/docs](https://better-auth.com/docs).**

---

## Phase 1: Planning (REQUIRED before implementation)

Before writing any code, gather requirements by scanning the project and asking the user structured questions. This ensures the implementation matches their needs.

### Step 1: Scan the project

Analyze the codebase to auto-detect:
- **Framework** — Look for `next.config`, `svelte.config`, `nuxt.config`, `astro.config`, `vite.config`, or Express/Hono entry files.
- **Database/ORM** — Look for `prisma/schema.prisma`, `drizzle.config`, `package.json` deps (`pg`, `mysql2`, `better-sqlite3`, `mongoose`, `mongodb`).
- **Existing auth** — Look for existing auth libraries (`next-auth`, `lucia`, `clerk`, `supabase/auth`, `firebase/auth`) in `package.json` or imports.
- **Package manager** — Check for `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`, or `package-lock.json`.

Use what you find to pre-fill defaults and skip questions you can already answer.

### Step 2: Ask planning questions

Use the `AskQuestion` tool to ask the user **all applicable questions in a single call**. Skip any question you already have a confident answer for from the scan. Group them under a title like "Auth Setup Planning".

**Questions to ask:**

1. **Project type** (skip if detected)
   - Prompt: "What type of project is this?"
   - Options: New project from scratch | Adding auth to existing project | Migrating from another auth library

2. **Framework** (skip if detected)
   - Prompt: "Which framework are you using?"
   - Options: Next.js (App Router) | Next.js (Pages Router) | SvelteKit | Nuxt | Astro | Express | Hono | SolidStart | Other

3. **Database & ORM** (skip if detected)
   - Prompt: "Which database setup will you use?"
   - Options: PostgreSQL (Prisma) | PostgreSQL (Drizzle) | PostgreSQL (pg driver) | MySQL (Prisma) | MySQL (Drizzle) | MySQL (mysql2 driver) | SQLite (Prisma) | SQLite (Drizzle) | SQLite (better-sqlite3 driver) | MongoDB (Mongoose) | MongoDB (native driver)

4. **Authentication methods** (always ask, allow multiple)
   - Prompt: "Which sign-in methods do you need?"
   - Options: Email & password | Social OAuth (Google, GitHub, etc.) | Magic link (passwordless email) | Passkey (WebAuthn) | Phone number
   - `allow_multiple: true`

5. **Social providers** (only if they selected Social OAuth above — ask in a follow-up call)
   - Prompt: "Which social providers do you need?"
   - Options: Google | GitHub | Apple | Microsoft | Discord | Twitter/X
   - `allow_multiple: true`

6. **Email verification** (only if Email & password was selected above — ask in a follow-up call)
   - Prompt: "Do you want to require email verification?"
   - Options: Yes | No

7. **Email provider** (only if email verification is Yes, or if Password reset is selected in features — ask in a follow-up call)
   - Prompt: "How do you want to send emails?"
   - Options: Resend | Mock it for now (console.log)

8. **Features & plugins** (always ask, allow multiple)
   - Prompt: "Which additional features do you need?"
   - Options: Two-factor authentication (2FA) | Organizations / teams | Admin dashboard | API bearer tokens | Password reset | None of these
   - `allow_multiple: true`

9. **Auth pages** (always ask, allow multiple — pre-select based on earlier answers)
   - Prompt: "Which auth pages do you need?"
   - Options vary based on previous answers:
     - Always available: Sign in | Sign up
     - If Email & password selected: Forgot password | Reset password
     - If email verification enabled: Email verification
   - `allow_multiple: true`

10. **Auth UI style** (always ask)
   - Prompt: "What style do you want for the auth pages? Pick one or describe your own."
   - Options: Minimal & clean | Centered card with background | Split layout (form + hero image) | Floating / glassmorphism | Other (I'll describe)

### Step 3: Summarize the plan

After collecting answers, present a concise implementation plan as a markdown checklist. Example:

```
## Auth Implementation Plan

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL via Prisma
- **Auth methods:** Email/password, Google OAuth, GitHub OAuth
- **Plugins:** 2FA, Organizations, Email verification
- **UI:** Custom forms

### Steps
1. Install `better-auth` and `@better-auth/cli`
2. Create `lib/auth.ts` with server config
3. Create `lib/auth-client.ts` with React client
4. Set up route handler at `app/api/auth/[...all]/route.ts`
5. Configure Prisma adapter and generate schema
6. Add Google & GitHub OAuth providers
7. Enable `twoFactor` and `organization` plugins
8. Set up email verification handler
9. Run migrations
10. Create sign-in / sign-up pages
```

Ask the user to confirm the plan before proceeding to Phase 2.

---

## Phase 2: Implementation

Only proceed here after the user confirms the plan from Phase 1.

Follow the decision tree below, guided by the answers collected above.

```
Is this a new/empty project?
├─ YES → New project setup
│   1. Install better-auth (+ scoped packages per plan)
│   2. Create auth.ts with all planned config
│   3. Create auth-client.ts with framework client
│   4. Set up route handler
│   5. Set up environment variables
│   6. Run CLI migrate/generate
│   7. Add plugins from plan
│   8. Create auth UI pages
│
├─ MIGRATING → Migration from existing auth
│   1. Audit current auth for gaps
│   2. Plan incremental migration
│   3. Install better-auth alongside existing auth
│   4. Migrate routes, then session logic, then UI
│   5. Remove old auth library
│   6. See migration guides in docs
│
└─ ADDING → Add auth to existing project
    1. Analyze project structure
    2. Install better-auth
    3. Create auth config matching plan
    4. Add route handler
    5. Run schema migrations
    6. Integrate into existing pages
    7. Add planned plugins and features
```

At the end of implementation, guide users thoroughly on remaining next steps (e.g., setting up OAuth app credentials, deploying env vars, testing flows).

---

## Installation

**Core:** `npm install better-auth`

**Scoped packages (as needed):**
| Package | Use case |
|---------|----------|
| `@better-auth/passkey` | WebAuthn/Passkey auth |
| `@better-auth/sso` | SAML/OIDC enterprise SSO |
| `@better-auth/stripe` | Stripe payments |
| `@better-auth/scim` | SCIM user provisioning |
| `@better-auth/expo` | React Native/Expo |

---

## Environment Variables

```env
BETTER_AUTH_SECRET=<32+ chars, generate with: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=<your database connection string>
```

Add OAuth secrets as needed: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`, etc.

---

## Server Config (auth.ts)

**Location:** `lib/auth.ts` or `src/lib/auth.ts`

**Minimal config needs:**
- `database` - Connection or adapter
- `emailAndPassword: { enabled: true }` - For email/password auth

**Standard config adds:**
- `socialProviders` - OAuth providers (google, github, etc.)
- `emailVerification.sendVerificationEmail` - Email verification handler
- `emailAndPassword.sendResetPassword` - Password reset handler

**Full config adds:**
- `plugins` - Array of feature plugins
- `session` - Expiry, cookie cache settings
- `account.accountLinking` - Multi-provider linking
- `rateLimit` - Rate limiting config

**Export types:** `export type Session = typeof auth.$Infer.Session`

---

## Client Config (auth-client.ts)

**Import by framework:**
| Framework | Import |
|-----------|--------|
| React/Next.js | `better-auth/react` |
| Vue | `better-auth/vue` |
| Svelte | `better-auth/svelte` |
| Solid | `better-auth/solid` |
| Vanilla JS | `better-auth/client` |

**Client plugins** go in `createAuthClient({ plugins: [...] })`.

**Common exports:** `signIn`, `signUp`, `signOut`, `useSession`, `getSession`

---

## Route Handler Setup

| Framework | File | Handler |
|-----------|------|---------|
| Next.js App Router | `app/api/auth/[...all]/route.ts` | `toNextJsHandler(auth)` → export `{ GET, POST }` |
| Next.js Pages | `pages/api/auth/[...all].ts` | `toNextJsHandler(auth)` → default export |
| Express | Any file | `app.all("/api/auth/*", toNodeHandler(auth))` |
| SvelteKit | `src/hooks.server.ts` | `svelteKitHandler(auth)` |
| SolidStart | Route file | `solidStartHandler(auth)` |
| Hono | Route file | `auth.handler(c.req.raw)` |

**Next.js Server Components:** Add `nextCookies()` plugin to auth config.

---

## Database Migrations

| Adapter | Command |
|---------|---------|
| Built-in Kysely | `npx @better-auth/cli@latest migrate` (applies directly) |
| Prisma | `npx @better-auth/cli@latest generate --output prisma/schema.prisma` then `npx prisma migrate dev` |
| Drizzle | `npx @better-auth/cli@latest generate --output src/db/auth-schema.ts` then `npx drizzle-kit push` |

**Re-run after adding plugins.**

---

## Database Adapters

| Database | Setup |
|----------|-------|
| SQLite | Pass `better-sqlite3` or `bun:sqlite` instance directly |
| PostgreSQL | Pass `pg.Pool` instance directly |
| MySQL | Pass `mysql2` pool directly |
| Prisma | `prismaAdapter(prisma, { provider: "postgresql" })` from `better-auth/adapters/prisma` |
| Drizzle | `drizzleAdapter(db, { provider: "pg" })` from `better-auth/adapters/drizzle` |
| MongoDB | `mongodbAdapter(db)` from `better-auth/adapters/mongodb` |

---

## Common Plugins

| Plugin | Server Import | Client Import | Purpose |
|--------|---------------|---------------|---------|
| `twoFactor` | `better-auth/plugins` | `twoFactorClient` | 2FA with TOTP/OTP |
| `organization` | `better-auth/plugins` | `organizationClient` | Teams/orgs |
| `admin` | `better-auth/plugins` | `adminClient` | User management |
| `bearer` | `better-auth/plugins` | - | API token auth |
| `openAPI` | `better-auth/plugins` | - | API docs |
| `passkey` | `@better-auth/passkey` | `passkeyClient` | WebAuthn |
| `sso` | `@better-auth/sso` | - | Enterprise SSO |

**Plugin pattern:** Server plugin + client plugin + run migrations.

---

## Auth UI Implementation

**Sign in flow:**
1. `signIn.email({ email, password })` or `signIn.social({ provider, callbackURL })`
2. Handle `error` in response
3. Redirect on success

**Session check (client):** `useSession()` hook returns `{ data: session, isPending }`

**Session check (server):** `auth.api.getSession({ headers: await headers() })`

**Protected routes:** Check session, redirect to `/sign-in` if null.

---

## Security Checklist

- [ ] `BETTER_AUTH_SECRET` set (32+ chars)
- [ ] `advanced.useSecureCookies: true` in production
- [ ] `trustedOrigins` configured
- [ ] Rate limits enabled
- [ ] Email verification enabled
- [ ] Password reset implemented
- [ ] 2FA for sensitive apps
- [ ] CSRF protection NOT disabled
- [ ] `account.accountLinking` reviewed

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Secret not set" | Add `BETTER_AUTH_SECRET` env var |
| "Invalid Origin" | Add domain to `trustedOrigins` |
| Cookies not setting | Check `baseURL` matches domain; enable secure cookies in prod |
| OAuth callback errors | Verify redirect URIs in provider dashboard |
| Type errors after adding plugin | Re-run CLI generate/migrate |

---

## Resources

- [Docs](https://better-auth.com/docs)
- [Examples](https://github.com/better-auth/examples)
- [Plugins](https://better-auth.com/docs/concepts/plugins)
- [CLI](https://better-auth.com/docs/concepts/cli)
- [Migration Guides](https://better-auth.com/docs/guides)


---

<a name="agents-skills-email-and-password-best-practices-skill-md"></a>
## 📄 Fichier : `.agents/skills/email-and-password-best-practices/SKILL.md`

**Titre original :** SKILL.md

---
name: email-and-password-best-practices
description: Configure email verification, implement password reset flows, set password policies, and customise hashing algorithms for Better Auth email/password authentication. Use when users need to set up login, sign-in, sign-up, credential authentication, or password security with Better Auth.
---

## Quick Start

1. Enable email/password: `emailAndPassword: { enabled: true }`
2. Configure `emailVerification.sendVerificationEmail`
3. Add `sendResetPassword` for password reset flows
4. Run `npx @better-auth/cli@latest migrate`
5. Verify: attempt sign-up and confirm verification email triggers

---

## Email Verification Setup

Configure `emailVerification.sendVerificationEmail` to verify user email addresses.

```ts
import { betterAuth } from "better-auth";
import { sendEmail } from "./email"; // your email sending function

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
});
```

**Note**: The `url` parameter contains the full verification link. The `token` is available if you need to build a custom verification URL.

### Requiring Email Verification

For stricter security, enable `emailAndPassword.requireEmailVerification` to block sign-in until the user verifies their email. When enabled, unverified users will receive a new verification email on each sign-in attempt.

```ts
export const auth = betterAuth({
  emailAndPassword: {
    requireEmailVerification: true,
  },
});
```

**Note**: This requires `sendVerificationEmail` to be configured and only applies to email/password sign-ins.

## Client Side Validation

Implement client-side validation for immediate user feedback and reduced server load.

## Callback URLs

Always use absolute URLs (including the origin) for callback URLs in sign-up and sign-in requests. This prevents Better Auth from needing to infer the origin, which can cause issues when your backend and frontend are on different domains.

```ts
const { data, error } = await authClient.signUp.email({
  callbackURL: "https://example.com/callback", // absolute URL with origin
});
```

## Password Reset Flows

Provide `sendResetPassword` in the email and password config to enable password resets.

```ts
import { betterAuth } from "better-auth";
import { sendEmail } from "./email"; // your email sending function

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    // Custom email sending function to send reset-password email
    sendResetPassword: async ({ user, url, token }, request) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    // Optional event hook
    onPasswordReset: async ({ user }, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
});
```

### Security Considerations

Built-in protections: background email sending (timing attack prevention), dummy operations on invalid requests, constant response messages regardless of user existence.

On serverless platforms, configure a background task handler:

```ts
export const auth = betterAuth({
  advanced: {
    backgroundTasks: {
      handler: (promise) => {
        // Use platform-specific methods like waitUntil
        waitUntil(promise);
      },
    },
  },
});
```

#### Token Security

Tokens expire after 1 hour by default. Configure with `resetPasswordTokenExpiresIn` (in seconds):

```ts
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 60 * 30, // 30 minutes
  },
});
```

Tokens are single-use — deleted immediately after successful reset.

#### Session Revocation

Enable `revokeSessionsOnPasswordReset` to invalidate all existing sessions on password reset:

```ts
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
  },
});
```

#### Password Requirements

Password length limits (configurable):

```ts
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 256,
  },
});
```

### Sending the Password Reset

Call `requestPasswordReset` to send the reset link. Triggers the `sendResetPassword` function from your config.

```ts
const data = await auth.api.requestPasswordReset({
  body: {
    email: "john.doe@example.com", // required
    redirectTo: "https://example.com/reset-password",
  },
});
```

Or authClient:

```ts
const { data, error } = await authClient.requestPasswordReset({
  email: "john.doe@example.com", // required
  redirectTo: "https://example.com/reset-password",
});
```

**Note**: While the `email` is required, we also recommend configuring the `redirectTo` for a smoother user experience.

## Password Hashing

Default: `scrypt` (Node.js native, no external dependencies).

### Custom Hashing Algorithm

To use Argon2id or another algorithm, provide custom `hash` and `verify` functions:

```ts
import { betterAuth } from "better-auth";
import { hash, verify, type Options } from "@node-rs/argon2";

const argon2Options: Options = {
  memoryCost: 65536, // 64 MiB
  timeCost: 3, // 3 iterations
  parallelism: 4, // 4 parallel lanes
  outputLen: 32, // 32 byte output
  algorithm: 2, // Argon2id variant
};

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    password: {
      hash: (password) => hash(password, argon2Options),
      verify: ({ password, hash: storedHash }) =>
        verify(storedHash, password, argon2Options),
    },
  },
});
```

**Note**: If you switch hashing algorithms on an existing system, users with passwords hashed using the old algorithm won't be able to sign in. Plan a migration strategy if needed.


---

<a name="agents-skills-organization-best-practices-skill-md"></a>
## 📄 Fichier : `.agents/skills/organization-best-practices/SKILL.md`

**Titre original :** SKILL.md

---
name: organization-best-practices
description: Configure multi-tenant organizations, manage members and invitations, define custom roles and permissions, set up teams, and implement RBAC using Better Auth's organization plugin. Use when users need org setup, team management, member roles, access control, or the Better Auth organization plugin.
---

## Setup

1. Add `organization()` plugin to server config
2. Add `organizationClient()` plugin to client config
3. Run `npx @better-auth/cli migrate`
4. Verify: check that organization, member, invitation tables exist in your database

```ts
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5, // Max orgs per user
      membershipLimit: 100, // Max members per org
    }),
  ],
});
```

### Client-Side Setup

```ts
import { createAuthClient } from "better-auth/client";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [organizationClient()],
});
```

## Creating Organizations

The creator is automatically assigned the `owner` role.

```ts
const createOrg = async () => {
  const { data, error } = await authClient.organization.create({
    name: "My Company",
    slug: "my-company",
    logo: "https://example.com/logo.png",
    metadata: { plan: "pro" },
  });
};
```

### Controlling Organization Creation

Restrict who can create organizations based on user attributes:

```ts
organization({
  allowUserToCreateOrganization: async (user) => {
    return user.emailVerified === true;
  },
  organizationLimit: async (user) => {
    // Premium users get more organizations
    return user.plan === "premium" ? 20 : 3;
  },
});
```

### Creating Organizations on Behalf of Users

Administrators can create organizations for other users (server-side only):

```ts
await auth.api.createOrganization({
  body: {
    name: "Client Organization",
    slug: "client-org",
    userId: "user-id-who-will-be-owner", // `userId` is required
  },
});
```

**Note**: The `userId` parameter cannot be used alongside session headers.


## Active Organizations

Stored in the session and scopes subsequent API calls. Set after user selects one.

```ts
const setActive = async (organizationId: string) => {
  const { data, error } = await authClient.organization.setActive({
    organizationId,
  });
};
```

Many endpoints use the active organization when `organizationId` is not provided (`listMembers`, `listInvitations`, `inviteMember`, etc.).

Use `getFullOrganization()` to retrieve the active org with all members, invitations, and teams.

## Members

### Adding Members (Server-Side)

```ts
await auth.api.addMember({
  body: {
    userId: "user-id",
    role: "member",
    organizationId: "org-id",
  },
});
```

For client-side member additions, use the invitation system instead.

### Assigning Multiple Roles

```ts
await auth.api.addMember({
  body: {
    userId: "user-id",
    role: ["admin", "moderator"],
    organizationId: "org-id",
  },
});
```

### Removing Members

Use `removeMember({ memberIdOrEmail })`. The last owner cannot be removed — assign ownership to another member first.

### Updating Member Roles

Use `updateMemberRole({ memberId, role })`.

### Membership Limits

```ts
organization({
  membershipLimit: async (user, organization) => {
    if (organization.metadata?.plan === "enterprise") {
      return 1000;
    }
    return 50;
  },
});
```

## Invitations

### Setting Up Invitation Emails

```ts
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { sendEmail } from "./email";

export const auth = betterAuth({
  plugins: [
    organization({
      sendInvitationEmail: async (data) => {
        const { email, organization, inviter, invitation } = data;

        await sendEmail({
          to: email,
          subject: `Join ${organization.name}`,
          html: `
            <p>${inviter.user.name} invited you to join ${organization.name}</p>
            <a href="https://yourapp.com/accept-invite?id=${invitation.id}">
              Accept Invitation
            </a>
          `,
        });
      },
    }),
  ],
});
```

### Sending Invitations

```ts
await authClient.organization.inviteMember({
  email: "newuser@example.com",
  role: "member",
});
```

### Shareable Invitation URLs

```ts
const { data } = await authClient.organization.getInvitationURL({
  email: "newuser@example.com",
  role: "member",
  callbackURL: "https://yourapp.com/dashboard",
});

// Share data.url via any channel
```

This endpoint does not call `sendInvitationEmail` — handle delivery yourself.

### Invitation Configuration

```ts
organization({
  invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days (default: 48 hours)
  invitationLimit: 100, // Max pending invitations per org
  cancelPendingInvitationsOnReInvite: true, // Cancel old invites when re-inviting
});
```

## Roles & Permissions

Default roles: `owner` (full access), `admin` (manage members/invitations/settings), `member` (basic access).

### Checking Permissions

```ts
const { data } = await authClient.organization.hasPermission({
  permission: "member:write",
});

if (data?.hasPermission) {
  // User can manage members
}
```

Use `checkRolePermission({ role, permissions })` for client-side UI rendering (static only). For dynamic access control, use the `hasPermission` endpoint.

## Teams

### Enabling Teams

```ts
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    organization({
        teams: {
            enabled: true
        }
    }),
  ],
});
```

### Creating Teams

```ts
const { data } = await authClient.organization.createTeam({
  name: "Engineering",
});
```

### Managing Team Members

Use `addTeamMember({ teamId, userId })` (member must be in org first) and `removeTeamMember({ teamId, userId })` (stays in org).

Set active team with `setActiveTeam({ teamId })`.

### Team Limits

```ts
organization({
  teams: {
      maximumTeams: 20, // Max teams per org
      maximumMembersPerTeam: 50, // Max members per team
      allowRemovingAllTeams: false, // Prevent removing last team
  }
});
```

## Dynamic Access Control

### Enabling Dynamic Access Control

```ts
import { organization } from "better-auth/plugins";
import { dynamicAccessControl } from "@better-auth/organization/addons";

export const auth = betterAuth({
  plugins: [
    organization({
        dynamicAccessControl: {
            enabled: true
        }
    }),
  ],
});
```

### Creating Custom Roles

```ts
await authClient.organization.createRole({
  role: "moderator",
  permission: {
    member: ["read"],
    invitation: ["read"],
  },
});
```

Use `updateRole({ roleId, permission })` and `deleteRole({ roleId })`. Pre-defined roles (owner, admin, member) cannot be deleted. Roles assigned to members cannot be deleted until reassigned.

## Lifecycle Hooks

Execute custom logic at various points in the organization lifecycle:

```ts
organization({
  hooks: {
    organization: {
      beforeCreate: async ({ data, user }) => {
        // Validate or modify data before creation
        return {
          data: {
            ...data,
            metadata: { ...data.metadata, createdBy: user.id },
          },
        };
      },
      afterCreate: async ({ organization, member }) => {
        // Post-creation logic (e.g., send welcome email, create default resources)
        await createDefaultResources(organization.id);
      },
      beforeDelete: async ({ organization }) => {
        // Cleanup before deletion
        await archiveOrganizationData(organization.id);
      },
    },
    member: {
      afterCreate: async ({ member, organization }) => {
        await notifyAdmins(organization.id, `New member joined`);
      },
    },
    invitation: {
      afterCreate: async ({ invitation, organization, inviter }) => {
        await logInvitation(invitation);
      },
    },
  },
});
```

## Schema Customization

Customize table names, field names, and add additional fields:

```ts
organization({
  schema: {
    organization: {
      modelName: "workspace", // Rename table
      fields: {
        name: "workspaceName", // Rename fields
      },
      additionalFields: {
        billingId: {
          type: "string",
          required: false,
        },
      },
    },
    member: {
      additionalFields: {
        department: {
          type: "string",
          required: false,
        },
        title: {
          type: "string",
          required: false,
        },
      },
    },
  },
});
```

## Security Considerations

### Owner Protection

- The last owner cannot be removed from an organization
- The last owner cannot leave the organization
- The owner role cannot be removed from the last owner

Always ensure ownership transfer before removing the current owner:

```ts
// Transfer ownership first
await authClient.organization.updateMemberRole({
  memberId: "new-owner-member-id",
  role: "owner",
});

// Then the previous owner can be demoted or removed
```

### Organization Deletion

Deleting an organization removes all associated data (members, invitations, teams). Prevent accidental deletion:

```ts
organization({
  disableOrganizationDeletion: true, // Disable via config
});
```

Or implement soft delete via hooks:

```ts
organization({
  hooks: {
    organization: {
      beforeDelete: async ({ organization }) => {
        // Archive instead of delete
        await archiveOrganization(organization.id);
        throw new Error("Organization archived, not deleted");
      },
    },
  },
});
```

### Invitation Security

- Invitations expire after 48 hours by default
- Only the invited email address can accept an invitation
- Pending invitations can be cancelled by organization admins

## Complete Configuration Example

```ts
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { sendEmail } from "./email";

export const auth = betterAuth({
  plugins: [
    organization({
      // Organization limits
      allowUserToCreateOrganization: true,
      organizationLimit: 10,
      membershipLimit: 100,
      creatorRole: "owner",

      // Slugs
      defaultOrganizationIdField: "slug",

      // Invitations
      invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days
      invitationLimit: 50,
      sendInvitationEmail: async (data) => {
        await sendEmail({
          to: data.email,
          subject: `Join ${data.organization.name}`,
          html: `<a href="https://app.com/invite/${data.invitation.id}">Accept</a>`,
        });
      },

      // Hooks
      hooks: {
        organization: {
          afterCreate: async ({ organization }) => {
            console.log(`Organization ${organization.name} created`);
          },
        },
      },
    }),
  ],
});
```


---

<a name="agents-skills-two-factor-authentication-best-practices-skill-md"></a>
## 📄 Fichier : `.agents/skills/two-factor-authentication-best-practices/SKILL.md`

**Titre original :** SKILL.md

---
name: two-factor-authentication-best-practices
description: Configure TOTP authenticator apps, send OTP codes via email/SMS, manage backup codes, handle trusted devices, and implement 2FA sign-in flows using Better Auth's twoFactor plugin. Use when users need MFA, multi-factor authentication, authenticator setup, or login security with Better Auth.
---

## Setup

1. Add `twoFactor()` plugin to server config with `issuer`
2. Add `twoFactorClient()` plugin to client config
3. Run `npx @better-auth/cli migrate`
4. Verify: check that `twoFactorSecret` column exists on user table

```ts
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "My App",
  plugins: [
    twoFactor({
      issuer: "My App",
    }),
  ],
});
```

### Client-Side Setup

```ts
import { createAuthClient } from "better-auth/client";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/2fa";
      },
    }),
  ],
});
```

## Enabling 2FA for Users

Requires password verification. Returns TOTP URI (for QR code) and backup codes.

```ts
const enable2FA = async (password: string) => {
  const { data, error } = await authClient.twoFactor.enable({
    password,
  });

  if (data) {
    // data.totpURI — generate a QR code from this
    // data.backupCodes — display to user
  }
};
```

`twoFactorEnabled` is not set to `true` until first TOTP verification succeeds. Override with `skipVerificationOnEnable: true` (not recommended).

## TOTP (Authenticator App)

### Displaying the QR Code

```tsx
import QRCode from "react-qr-code";

const TotpSetup = ({ totpURI }: { totpURI: string }) => {
  return <QRCode value={totpURI} />;
};
```

### Verifying TOTP Codes

Accepts codes from one period before/after current time:

```ts
const verifyTotp = async (code: string) => {
  const { data, error } = await authClient.twoFactor.verifyTotp({
    code,
    trustDevice: true,
  });
};
```

### TOTP Configuration Options

```ts
twoFactor({
  totpOptions: {
    digits: 6, // 6 or 8 digits (default: 6)
    period: 30, // Code validity period in seconds (default: 30)
  },
});
```

## OTP (Email/SMS)

### Configuring OTP Delivery

```ts
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";
import { sendEmail } from "./email";

export const auth = betterAuth({
  plugins: [
    twoFactor({
      otpOptions: {
        sendOTP: async ({ user, otp }, ctx) => {
          await sendEmail({
            to: user.email,
            subject: "Your verification code",
            text: `Your code is: ${otp}`,
          });
        },
        period: 5, // Code validity in minutes (default: 3)
        digits: 6, // Number of digits (default: 6)
        allowedAttempts: 5, // Max verification attempts (default: 5)
      },
    }),
  ],
});
```

### Sending and Verifying OTP

Send: `authClient.twoFactor.sendOtp()`. Verify: `authClient.twoFactor.verifyOtp({ code, trustDevice: true })`.

### OTP Storage Security

Configure how OTP codes are stored in the database:

```ts
twoFactor({
  otpOptions: {
    storeOTP: "encrypted", // Options: "plain", "encrypted", "hashed"
  },
});
```

For custom encryption:

```ts
twoFactor({
  otpOptions: {
    storeOTP: {
      encrypt: async (token) => myEncrypt(token),
      decrypt: async (token) => myDecrypt(token),
    },
  },
});
```

## Backup Codes

Generated automatically when 2FA is enabled. Each code is single-use.

### Displaying Backup Codes

```tsx
const BackupCodes = ({ codes }: { codes: string[] }) => {
  return (
    <div>
      <p>Save these codes in a secure location:</p>
      <ul>
        {codes.map((code, i) => (
          <li key={i}>{code}</li>
        ))}
      </ul>
    </div>
  );
};
```

### Regenerating Backup Codes

Invalidates all previous codes:

```ts
const regenerateBackupCodes = async (password: string) => {
  const { data, error } = await authClient.twoFactor.generateBackupCodes({
    password,
  });
  // data.backupCodes contains the new codes
};
```

### Using Backup Codes for Recovery

```ts
const verifyBackupCode = async (code: string) => {
  const { data, error } = await authClient.twoFactor.verifyBackupCode({
    code,
    trustDevice: true,
  });
};
```

### Backup Code Configuration

```ts
twoFactor({
  backupCodeOptions: {
    amount: 10, // Number of codes to generate (default: 10)
    length: 10, // Length of each code (default: 10)
    storeBackupCodes: "encrypted", // Options: "plain", "encrypted"
  },
});
```

## Handling 2FA During Sign-In

Response includes `twoFactorRedirect: true` when 2FA is required:

### Sign-In Flow

1. Call `signIn.email({ email, password })`
2. Check `context.data.twoFactorRedirect` in `onSuccess`
3. If `true`, redirect to `/2fa` verification page
4. Verify via TOTP, OTP, or backup code
5. Session cookie is created on successful verification

```ts
const signIn = async (email: string, password: string) => {
  const { data, error } = await authClient.signIn.email(
    { email, password },
    {
      onSuccess(context) {
        if (context.data.twoFactorRedirect) {
          window.location.href = "/2fa";
        }
      },
    }
  );
};
```

Server-side: check `"twoFactorRedirect" in response` when using `auth.api.signInEmail`.

## Trusted Devices

Pass `trustDevice: true` when verifying. Default trust duration: 30 days (`trustDeviceMaxAge`). Refreshes on each sign-in.

## Security Considerations

### Session Management

Flow: credentials → session removed → temporary 2FA cookie (10 min default) → verify → session created.

```ts
twoFactor({
  twoFactorCookieMaxAge: 600, // 10 minutes in seconds (default)
});
```

### Rate Limiting

Built-in: 3 requests per 10 seconds for all 2FA endpoints. OTP has additional attempt limiting:

```ts
twoFactor({
  otpOptions: {
    allowedAttempts: 5, // Max attempts per OTP code (default: 5)
  },
});
```

### Encryption at Rest

TOTP secrets: encrypted with auth secret. Backup codes: encrypted by default. OTP: configurable (`"plain"`, `"encrypted"`, `"hashed"`). Uses constant-time comparison for verification.

2FA can only be enabled for credential (email/password) accounts.

## Disabling 2FA

Requires password confirmation. Revokes trusted device records:

```ts
const disable2FA = async (password: string) => {
  const { data, error } = await authClient.twoFactor.disable({
    password,
  });
};
```

## Complete Configuration Example

```ts
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";
import { sendEmail } from "./email";

export const auth = betterAuth({
  appName: "My App",
  plugins: [
    twoFactor({
      // TOTP settings
      issuer: "My App",
      totpOptions: {
        digits: 6,
        period: 30,
      },
      // OTP settings
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          await sendEmail({
            to: user.email,
            subject: "Your verification code",
            text: `Your code is: ${otp}`,
          });
        },
        period: 5,
        allowedAttempts: 5,
        storeOTP: "encrypted",
      },
      // Backup code settings
      backupCodeOptions: {
        amount: 10,
        length: 10,
        storeBackupCodes: "encrypted",
      },
      // Session settings
      twoFactorCookieMaxAge: 600, // 10 minutes
      trustDeviceMaxAge: 30 * 24 * 60 * 60, // 30 days
    }),
  ],
});
```


---

<a name="claude-agents-intent-auditor-md"></a>
## 📄 Fichier : `.claude/agents/intent-auditor.md`

**Titre original :** intent-auditor

---
name: intent-auditor
description: Use this agent to audit the consistency between Discord persona intents (apps/bot/src/lib/personas.ts), @Bot("X") routing decorators, and @On({event:Y}) event handlers across the bot codebase. Detects silent intent/event mismatches that cause handlers to never fire (like the Kaio GuildMembers bug that broke levelUp role assignment). Invoke after editing personas.ts, after adding new events, or proactively before deploys.
tools: Read, Glob, Grep, Bash
---

### intent-auditor

Tu es un auditeur spécialisé dans la détection des incohérences entre **intents Discord déclarés** et **events réellement écoutés** dans le bot Shenron (multi-personas via `@rpbey/discordx`).

## Contexte du bug fondateur

Lors de la migration monorepo, Kaïo a perdu l'intent `GuildMembers`. Conséquence : `messageCreate` arrivait toujours, mais `message.member` était `null` → `handleLevelUp(member, …)` jamais appelé → 256 rôles de level non posés sur 88 users, sans aucune erreur dans les logs. Bug silencieux pendant des semaines.

Ce subagent existe pour qu'un tel cas soit détecté en CI/preview, pas en prod.

## Mission

Pour chaque persona déclaré dans `apps/bot/src/lib/personas.ts` :

1. Lister ses `intents:` (bitmask flags).
2. Trouver tous les fichiers `apps/bot/src/{events,commands,guards}/**` annotés `@Bot("<personaId>")` ou implicitement assignés.
3. Pour chaque handler, identifier les events écoutés (`@On({ event: Events.X })`, `@Once`, `@SimpleCommand`, `@Slash`, `@ButtonComponent`, `@MessageMenu`, etc.).
4. Vérifier que **chaque event** requiert un intent qui est bien dans la liste du persona.
5. Inversement, flagger les intents déclarés mais **jamais consommés** (gaspillage de cache / rate-limit).

## Table de référence intent ↔ event

| Event | Intent requis |
|---|---|
| `messageCreate`, `messageUpdate`, `messageDelete`, `messageDeleteBulk` | `GuildMessages` + (`MessageContent` pour `content` non-vide hors mentions/DM) |
| `guildMemberAdd`, `guildMemberRemove`, `guildMemberUpdate`, `guildMembersChunk` | `GuildMembers` (privileged) |
| Sur `messageCreate` : accès à `message.member` non-null | `GuildMembers` |
| `presenceUpdate` | `GuildPresences` (privileged) |
| `voiceStateUpdate` | `GuildVoiceStates` |
| `guildBanAdd`, `guildBanRemove`, `guildAuditLogEntryCreate` | `GuildModeration` |
| `inviteCreate`, `inviteDelete` | `GuildInvites` |
| `messageReactionAdd`, `messageReactionRemove` | `GuildMessageReactions` + `MessageContent` si lecture du contenu |
| `typingStart` | `GuildMessageTyping` |
| `threadCreate`, `threadUpdate`, `threadDelete` | `Guilds` (déjà couvert) |
| Slash commands, button interactions, modals | `Guilds` suffit |

## Format de rapport attendu

```
=== Intent Audit Shenron ===

[shenron] intents=[Guilds]
  ✓ 17 slash commands — OK (Guilds seul suffit)

[kaio] intents=[Guilds, GuildMembers, GuildMessages, MessageContent, GuildVoiceStates]
  ✓ MessageXP.ts @On(messageCreate) — GuildMessages+MessageContent+GuildMembers ✓
  ✓ VoiceXP.ts @On(voiceStateUpdate) — GuildVoiceStates ✓
  ⚠ <fichier> écoute <event> mais persona manque l'intent <X>
  ℹ intent <Y> déclaré mais aucun handler ne l'utilise

=== Summary ===
  X persona-event combos audités
  Y mismatches CRITICAL
  Z intents inutiles
```

## Méthode d'exécution

1. `Read` `apps/bot/src/lib/personas.ts` → parse PERSONAS dict.
2. `Glob` `apps/bot/src/{events,commands,guards}/**/*.ts`.
3. Pour chaque fichier : `Grep` les decorators `@Bot(`, `@On({`, `@Slash(`, `@ButtonComponent(`, etc.
4. Croiser avec la table de référence ci-dessus.
5. Rapporte en markdown structuré. Pas de fix automatique — l'humain ou le main agent décide.

## Pièges à connaître

- `@Bot("X")` peut être au niveau de la **classe** (s'applique à toutes les méthodes) ou de la **méthode** (override). Vérifier les deux niveaux.
- Un handler sans `@Bot(…)` est attaché à **tous** les clients → vérifier l'intent contre **chaque** persona.
- `MessageContent` est privileged → s'il manque, `message.content` est `""` (pas null, pas d'erreur, juste vide).
- `GuildMembers` privileged aussi → sans lui, `guild.members.cache` est partial (uniquement self), et `message.member` est `null` même en guild.
- Un événement comme `guildMemberUpdate` n'est livré QUE si `GuildMembers` est actif **ET** le membre est dans le cache (donc backfill `guild.members.fetch()` au boot peut être nécessaire).
- `Presence` est très coûteux — flagger systématiquement s'il est activé sans handler `presenceUpdate`.


---

<a name="coord-docs-readme-md"></a>
## 📄 Fichier : `.coord/docs/README.md`

**Titre original :** Documentation partagée Claude ↔ Gemini

### Documentation partagée Claude ↔ Gemini

Ce dossier contient des docs accessibles aux 2 agents via :
- MCP tool `read_doc(name)`
- HTTP `GET /api/a2a/docs/:name` (port 5006)
- FS direct sous `.coord/docs/`

Conventions :
- 1 fichier `.md` par sujet
- Le nom est la clé (sans extension) : `mcp-setup.md` → `read_doc("mcp-setup")`
- Frontmatter optionnel YAML pour metadata

## Index

- `mcp-setup.md` — comment register le MCP coord-server sur les 2 CLIs
- `a2a-protocol.md` — endpoints JSON-RPC + format messages
- `api-contract.md` — contrat API public bot (mirroir de `memory/shared.md`)


---

<a name="coord-docs-a2a-protocol-md"></a>
## 📄 Fichier : `.coord/docs/a2a-protocol.md`

**Titre original :** Protocole A2A (Agent2Agent) — implémentation Shenron

### Protocole A2A (Agent2Agent) — implémentation Shenron

Spec : https://a2a-protocol.org/latest/specification/  •  SDK officiel : https://www.npmjs.com/package/@a2a-js/sdk

Implémentation maison sur Bun.serve (~200 LOC dans `src/api/server.ts`). Pas de dépendance Express.

**Compatible @a2a-js/sdk v0.3** — AgentCard et SSE wrappers calqués sur l'implémentation officielle de `packages/a2a-server` de gemini-cli (https://github.com/google-gemini/gemini-cli/tree/main/packages/a2a-server). Cf. `CoderAgentEvent` (text-content, state-change, thought) pour les event kinds.

## Endpoints

### `GET /.well-known/agent-card.json`

AgentCard discovery (cf. spec v0.3). Cache 1 h (immutable en pratique).

```json
{
  "name": "shenron-coord",
  "version": "1.1.0",
  "protocolVersion": "0.3.0",
  "url": "https://shenron.rpbey.fr/api/a2a/jsonrpc",
  "provider": { "organization": "DBFR / shenron.rpbey.fr", "url": "https://shenron.rpbey.fr" },
  "capabilities": { "streaming": true, "pushNotifications": false, "stateTransitionHistory": true },
  "securitySchemes": { "bearerAuth": { "type": "http", "scheme": "bearer" } },
  "security": [{ "bearerAuth": [] }, {}],
  "defaultInputModes": ["text"],
  "defaultOutputModes": ["text"],
  "supportsAuthenticatedExtendedCard": false,
  "skills": [
    { "id": "coord.messages", "name": "Inter-agent messages", "examples": ["message/send..."], "inputModes": ["text"], "outputModes": ["text"] },
    { "id": "coord.tasks", "name": "Sprint tasks", "examples": ["tasks/list..."], "inputModes": ["text"], "outputModes": ["text"] },
    { "id": "coord.memory", "name": "Shared markdown memory", "examples": ["memory/read..."], "inputModes": ["text"], "outputModes": ["text"] }
  ]
}
```

### `POST /api/a2a/jsonrpc`

Endpoint unique JSON-RPC 2.0. Body :

```json
{
  "jsonrpc": "2.0",
  "id": "<request-id>",
  "method": "<method>",
  "params": { ... }
}
```

Méthodes supportées :

| Method | Params | Description |
|---|---|---|
| `message/send` | `message: { messageId, role, parts[], contextId? }, to?` | Envoie un message synchrone, retourne ack. Broadcast `text-content` + `message` events. |
| `message/stream` | (idem) | SSE response avec events de la conversation. `id` JSON-RPC est propagé dans chaque event. |
| `tasks/list` | `{ status?, agent? }` | Liste tasks filtrées |
| `tasks/get` | `{ id }` | Détail d'une task |
| `tasks/cancel` | `{ id }` | Marque blocked |
| `tasks/resubscribe` | `{ id? }` | Re-attache un client en SSE sur un task existant |
| `agent/getAuthenticatedExtendedCard` | — | Retourne `-32601` (notre AgentCard publique est canonique) |

## SSE event format (calqué sur gemini-cli)

Chaque event est wrappé dans une enveloppe JSON-RPC 2.0 et émis sur la stream :

```
data: {"jsonrpc":"2.0","id":"<rpcId|taskId|messageId|null>","result":<event>}\n\n
```

Event kinds adoptés depuis `CoderAgentEvent` (gemini-cli) :

| Kind | Émis quand | Payload `result.kind` |
|---|---|---|
| `state-change` | Welcome event à l'ouverture du SSE, transitions de TaskState | `state-change` |
| `text-content` | Après un `message/send` (en plus du legacy `message`) | `text-content` |
| `message` | Legacy event broadcast — conservé pour rétrocompat | `message` |

Le `id` du wrapper JSON-RPC correspond au `taskId` si l'event est lié à une task, sinon au `messageId` du message envoyé, sinon au `rpcId` du `message/stream` initial.

### `GET /api/a2a/events`

SSE bypass (sans JSON-RPC) — stream de tous les events du broker : nouveaux messages, changes de tasks, etc.

## Payload type — `message/send`

```bash
curl -X POST https://shenron.rpbey.fr/api/a2a/jsonrpc \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "message/send",
    "params": {
      "to": "gemini",
      "message": {
        "messageId": "msg-001",
        "role": "user",
        "kind": "message",
        "parts": [{ "kind": "text", "text": "Salut Gemini" }],
        "contextId": "sprint-dbfr"
      }
    }
  }'
```

Réponse :

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "kind": "message",
    "messageId": "msg-001",
    "role": "agent",
    "parts": [{ "kind": "text", "text": "ack" }],
    "contextId": "sprint-dbfr"
  }
}
```

## Backing store

Tous les messages sont persistés dans `.coord/messages.jsonl` (1 ligne = 1 message JSON). Les routes MCP et A2A partagent ce fichier — un message envoyé via A2A est immédiatement visible par `read_messages` MCP.

Lock atomique cross-process : `flock /tmp/dbfr-tasks.lock-msg` pour l'append.

## SSE keep-alive

Le serveur émet un commentaire `: ping\n\n` toutes les 30 s pour éviter le timeout côté nginx/Vercel. Compatible avec EventSource browser standard.

## Latence mesurée (loopback localhost)

| Canal | RTT 95p |
|---|---|
| MCP stdio (process child) | 0.5–1 ms |
| A2A HTTP loopback (TCP) | 3–6 ms |
| A2A Unix socket | 0.2–0.5 ms |
| A2A SSE event delivery | <1 ms après broadcast |


---

<a name="coord-docs-mcp-cross-agent-md"></a>
## 📄 Fichier : `.coord/docs/mcp-cross-agent.md`

**Titre original :** MCP & A2A Cross-Agent Documentation

### MCP & A2A Cross-Agent Documentation

Ce document de référence est conçu pour synchroniser les architectures de Gemini CLI et Claude Code autour des protocoles MCP (Model Context Protocol) et A2A (Agent2Agent), en s'appuyant sur les SDKs Rust officiels.

## 1. Model Context Protocol (MCP) - Rust SDK
**Dépôt :** `https://github.com/modelcontextprotocol/rust-sdk`

L'implémentation Rust de MCP utilise `tokio` pour fournir un environnement asynchrone performant.
L'architecture repose sur deux crates principales :
- `rmcp` : Protocol, transports (stdio, TokioChildProcess), et traits (`ServerHandler`, `ClientHandler`).
- `rmcp-macros` : Macros procédurales (`#[tool]`, `#[prompt]`, `#[task_handler]`) générant le boilerplate et les schémas JSON via `schemars`.

**Exemple d'implémentation Serveur :**
```rust
use rmcp::{handler::server::wrapper::Parameters, schemars, tool, tool_router, ServiceExt, transport::stdio};

#[derive(serde::Deserialize, schemars::JsonSchema)]
struct AddParams { a: i32, b: i32 }

#[derive(Clone)]
struct MyServer;

#[tool_router(server_handler)]
impl MyServer {
    #[tool(description = "Ajouter deux nombres")]
    fn add(&self, Parameters(AddParams { a, b }): Parameters<AddParams>) -> String {
        (a + b).to_string()
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let service = MyServer.serve(stdio()).await?;
    service.waiting().await?;
    Ok(())
}
```

## 2. Agent2Agent (A2A) Protocol - Rust SDK
**Dépôt :** `https://github.com/a2aproject/a2a-rs`

A2A est un protocole ouvert permettant aux agents IA d'interagir comme des boîtes noires, utilisant JSON-RPC 2.0 sur HTTP/S. L'implémentation Rust `a2a-rs` inclut :
- `a2a` : Modèles de base, events, erreurs.
- `a2a-server` : Framework serveur basé sur **Axum** pour REST et JSON-RPC.
- `a2a-client` : Client asynchrone pour l'abstraction du transport.
- Modèles d'interactions : `GetAgentCard`, `CreateTask`, `SendMessage`, `SendStreamingMessage`.

L'intégration d'Axum est particulièrement pertinente pour notre prochaine migration : le serveur A2A et le backend de l'application pourront partager le même runtime et router Axum, optimisant drastiquement les performances et la latence.

## 3. Stratégie de Refonte Axum (Site & Dashboard)
Le but est de migrer le site public Next.js et le dashboard React (Bun) en dehors du dossier `vps` vers une stack Rust 100% native (Axum + Tokio) :

1. **Workspace Rust** :
   - `crates/api` : Serveur Axum principal remplaçant l'API Bun et Next.js.
   - `crates/db` : Accès aux données partagées avec `sqlx` ou `sea-orm` (PostgreSQL Neon).
   - `crates/mcp-bridge` : Serveur A2A et RMCP pour l'interaction Claude ↔ Gemini.

2. **Frontend** :
   - Le frontend pourra être servi statiquement par Axum, ou transformé en SSR via Askama/Tera si l'on souhaite abandonner complètement Node.js/Bun pour le rendu des vues.


---

<a name="coord-docs-mcp-setup-md"></a>
## 📄 Fichier : `.coord/docs/mcp-setup.md`

**Titre original :** Setup MCP `coord` — bridge Claude ↔ Gemini

### Setup MCP `coord` — bridge Claude ↔ Gemini

Le MCP server `coord` (fichier `mcp/coord-server.ts`) est le canal principal de communication entre Claude Code et Gemini CLI sur ce VPS. Il expose :

- **12 tools** : `list_tasks`, `get_task`, `claim_task`, `complete_task`, `block_task`, `send_message`, `read_messages`, `read_memory`, `write_memory`, `list_docs`, `read_doc`, `write_doc`.
- **5 resources** : `coord://tasks`, `coord://memory/{shared,claude,gemini}`, `coord://messages`.

État backend : fichiers plats sous `.coord/` (tasks.json, memory/*.md, messages.jsonl, docs/*.md). Concurrence inter-agent via `flock /tmp/dbfr-tasks.lock`.

## Registration

### Gemini CLI

```bash
gemini mcp add coord /home/ubuntu/.bun/bin/bun /home/ubuntu/vps/apps/shenron/mcp/coord-server.ts \
  --env COORD_AGENT=gemini \
  --env COORD_DIR=/home/ubuntu/vps/apps/shenron/.coord
```

Vérifier : `gemini mcp list`.

### Claude Code CLI

```bash
claude mcp add coord \
  -e COORD_AGENT=claude \
  -e COORD_DIR=/home/ubuntu/vps/apps/shenron/.coord \
  -- /home/ubuntu/.bun/bin/bun /home/ubuntu/vps/apps/shenron/mcp/coord-server.ts
```

Vérifier : `claude mcp list` (doit afficher `coord: ... ✓ Connected`).

Note : il faut **redémarrer la session Claude Code** après l'ajout pour que les tools deviennent disponibles dans la conversation courante.

## Usage typique

### Côté Claude (en TS via tsyringe/MCP SDK ou via le CLI claude)

```ts
// Lister mes tasks en cours
await tools.list_tasks({ agent: "claude", status: "in_progress" });

// Annoncer un fix à Gemini
await tools.send_message({
  to: "gemini",
  type: "event",
  content: "API /api/public/profile/:id/card.png déployée. Doc dans .coord/docs/api-contract.md.",
});

// Lire les messages que Gemini m'a envoyés depuis 5 min
await tools.read_messages({ since: new Date(Date.now() - 5 * 60_000).toISOString() });
```

### Côté Gemini (via les mêmes tools dans son context)

```
> Lis les messages reçus de claude depuis ce matin
> [Gemini call tool: read_messages]
> Voici ce qu'il a envoyé : ...

> Marque la task gemini-04 comme done avec ce commit
> [Gemini call tool: complete_task]
```

## Test manuel stdio

```bash
printf '%s\n%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"manual","version":"1"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  | COORD_AGENT=test bun mcp/coord-server.ts
```

## A2A — bridge HTTP miroir

Le même `messages.jsonl` est backed par 3 canaux différents :

| Canal | Endpoint | Latence locale |
|---|---|---|
| MCP stdio (CLI) | `bun mcp/coord-server.ts` | <1 ms (process spawn) |
| A2A HTTP (port 5006) | `POST https://shenron.rpbey.fr/api/a2a/jsonrpc` | ~5 ms (TCP loopback) |
| A2A Unix socket | `curl --unix-socket /tmp/dbfr-a2a.sock http://localhost/jsonrpc` | <0.5 ms |
| A2A SSE events | `GET /api/a2a/events` ou `/events` (unix) | streaming |

AgentCard discovery : `GET /.well-known/agent-card.json` (sur le bot ou Unix sock).

## Démarrage Unix socket broker

```bash
nohup bun /home/ubuntu/vps/apps/shenron/scripts/a2a-broker.ts > /tmp/a2a-broker.log 2>&1 &
ls -la /tmp/dbfr-a2a.sock  # vérifie présent + 0666
```

Pour le démarrer auto au reboot, créer un service systemd user (TODO).


---

<a name="coord-docs-rust-migration-axum-leptos-migration-md"></a>
## 📄 Fichier : `.coord/docs/rust-migration/axum-leptos-migration.md`

**Titre original :** Migration site DBFR → Axum + Leptos (HISTORIQUE)

> **⛔ ABANDONNÉ — 2026-05-16.** Le site DBFR reste Next.js 15 sur Vercel (`apps/dbfr-site/`). Cf. `port-plan.md` pour la décision globale.

### Migration site DBFR → Axum + Leptos (HISTORIQUE)

Gemini reprend le site `apps/dbfr-site` (Next.js 15 + Tailwind v4) et le réécrit en stack Rust full-stack :
- **Axum** (https://github.com/tokio-rs/axum) — serveur HTTP / server functions / SSR
- **Leptos** (https://github.com/leptos-rs/leptos) — UI réactive avec hydration, signals fine-grained
- **Déploiement** : hors VPS — cibles candidates : Fly.io (binaire Docker), Shuttle.rs (PaaS Rust natif), Cloudflare Workers (compile WASM).
- **DB** : Postgres Neon (cf. `SHENRON_MIGRATION_PLAN.md`) accessible directement depuis le binaire — moins de dépendance HTTP au bot pour les data en lecture.

Le bot Shenron **reste sur le VPS** ; les routes `/api/public/*` continuent de servir le bot Discord et restent disponibles si le site Axum/Leptos veut les consommer en lecture.

## Ce que Claude (bot shenron) garantit pour la migration

### 1. Contrat API stable
Toutes les routes `/api/public/*` sont **versionnées de facto** : breaking change → bump path `/api/public/v2/*`. Pour l'instant pas de v2.

Routes consommables :

| Méthode | Path | TTL Cache | Cache-Control |
|---|---|---|---|
| GET | `/.well-known/agent-card.json` | 1 h | `public, max-age=3600, s-maxage=7200, swr=14400` |
| GET | `/health/check` | 5 s | `public, max-age=5, s-maxage=10, swr=20` |
| GET | `/health/latency` | 5 s | idem |
| GET | `/api/public/user/:discordId` | 30 s | `public, max-age=30, s-maxage=60, swr=120` |
| GET | `/api/public/shop` | 5 min | `public, max-age=300, s-maxage=600, swr=1200` |
| GET | `/api/public/leaderboard?limit=N&enrich=1` | 1 min | `public, max-age=60, ...` |
| GET | `/api/public/stats` | 1 min | idem |
| GET | `/api/public/wiki/characters?q=` | 1 h | idem |
| GET | `/api/public/wiki/characters/:id` | 1 h | idem |
| GET | `/api/public/wiki/planets` | 1 h | idem |
| GET | `/api/public/wiki/planets/:id` | 1 h | idem |
| GET | `/api/public/profile/:discordId/card.png` | 1 h | image/webp ou png selon `Accept` |
| GET | `/api/public/profile/:discordId/scan.png` | 1 h | idem |
| GET | `/assets/dbz/characters/<slug>.webp` | longue | image statique |
| GET | `/assets/dbz/planetas/<slug>.webp` | longue | idem |
| GET | `/assets/dbz/transformaciones/<slug>.webp` | longue | idem |
| GET | `/assets/sanctions/<action>.gif` | longue | image statique |

ETag + 304 Not Modified supportés sur toutes les routes JSON. CORS allowlist :
- `https://dbfr.fr`, `https://www.dbfr.fr`, `https://shenron.rpbey.fr`, `http://localhost:3000`.

**À me dire (via MCP `send_message`)** : le nouveau domaine du site Axum (ex: `axum-dbfr.fly.dev` ou final FQDN) → je l'ajoute à l'allowlist CORS côté bot.

### 2. Types Rust serde-compatibles (à copier dans le crate)

```rust
// crate `dbfr-shenron-client` ou inline dans la binaire Axum.
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShenronUser {
    #[serde(rename = "discordId")]
    pub discord_id: String,
    pub username: Option<String>,
    pub avatar: Option<String>,            // avatar hash
    #[serde(rename = "avatarUrl")]
    pub avatar_url: Option<String>,        // URL CDN Discord déjà construite
    pub level: u32,
    pub xp: i64,
    pub zeni: i64,
    #[serde(rename = "xpProgress")]
    pub xp_progress: Option<XpProgress>,
    pub banner: Option<String>,            // URL absolue ou null
    pub equipped: Equipped,
    pub achievements: Vec<Achievement>,
    pub inventory: Vec<InventoryItem>,
    pub fusion: Option<Fusion>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct XpProgress {
    pub current: i64,
    #[serde(rename = "nextLevel")]
    pub next_level: u32,
    #[serde(rename = "nextLevelXp")]
    pub next_level_xp: i64,
    pub needed: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Equipped {
    pub card: Option<String>,
    pub badge: Option<String>,
    pub color: Option<String>,
    pub title: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Achievement {
    pub code: String,
    #[serde(rename = "unlockedAt")]
    pub unlocked_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InventoryItem {
    #[serde(rename = "type")]
    pub kind: String,         // "card" | "badge" | "color" | "title"
    pub key: String,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Fusion {
    #[serde(rename = "partnerId")]
    pub partner_id: String,
    #[serde(rename = "partnerName")]
    pub partner_name: Option<String>,
    #[serde(rename = "createdAt")]
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShopItem {
    pub key: String,
    #[serde(rename = "type")]
    pub kind: String,
    pub name: String,
    pub description: Option<String>,
    pub price: i64,
    #[serde(rename = "roleId")]
    pub role_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeaderboardEntry {
    pub rank: u32,
    #[serde(rename = "discordId")]
    pub discord_id: String,
    pub username: Option<String>,
    #[serde(rename = "avatarUrl")]
    pub avatar_url: Option<String>,
    pub xp: i64,
    pub zeni: i64,
    pub level: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GlobalStats {
    pub users: i64,
    #[serde(rename = "totalXp")]
    pub total_xp: i64,
    #[serde(rename = "totalZeni")]
    pub total_zeni: i64,
    #[serde(rename = "achievementsUnlocked")]
    pub achievements_unlocked: i64,
    #[serde(rename = "shopItems")]
    pub shop_items: i64,
    #[serde(rename = "inventoryItems")]
    pub inventory_items: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DbCharacter {
    pub id: i64,
    pub name: String,
    pub image: String,                          // path relatif ex. ./assets/dbz/characters/goku_normal.webp
    pub ki: Option<String>,
    #[serde(rename = "maxKi")]
    pub max_ki: Option<String>,
    pub race: Option<String>,
    pub gender: Option<String>,
    pub affiliation: Option<String>,
    pub description: Option<String>,
    #[serde(rename = "originPlanetId")]
    pub origin_planet_id: Option<i64>,
    #[serde(default)]
    pub transformations: Vec<DbTransformation>,  // détail endpoint only
    #[serde(rename = "originPlanet", default)]
    pub origin_planet: Option<DbPlanet>,         // détail endpoint only
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DbTransformation {
    pub id: i64,
    pub name: String,
    pub image: String,
    pub ki: Option<String>,
    #[serde(rename = "characterId")]
    pub character_id: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DbPlanet {
    pub id: i64,
    pub name: String,
    pub image: String,
    #[serde(rename = "isDestroyed")]
    pub is_destroyed: bool,
    pub description: Option<String>,
}
```

### 3. Client `reqwest` typé (~80 LOC)

```rust
use reqwest::Client;
use anyhow::Result;

#[derive(Clone)]
pub struct ShenronClient {
    base: String,
    http: Client,
}

impl ShenronClient {
    pub fn new(base_url: impl Into<String>) -> Self {
        Self {
            base: base_url.into(),
            http: Client::builder()
                .user_agent("dbfr-axum-site/1.0")
                .timeout(std::time::Duration::from_secs(10))
                .build()
                .expect("reqwest client"),
        }
    }

    pub async fn user(&self, discord_id: &str) -> Result<Option<ShenronUser>> {
        let res = self.http.get(format!("{}/api/public/user/{}", self.base, discord_id)).send().await?;
        if res.status() == 404 { return Ok(None); }
        Ok(Some(res.error_for_status()?.json::<ShenronUser>().await?))
    }

    pub async fn shop(&self) -> Result<Vec<ShopItem>> {
        #[derive(Deserialize)] struct Resp { items: Vec<ShopItem> }
        let res = self.http.get(format!("{}/api/public/shop", self.base)).send().await?;
        Ok(res.error_for_status()?.json::<Resp>().await?.items)
    }

    pub async fn leaderboard(&self, limit: u32, enrich: bool) -> Result<Vec<LeaderboardEntry>> {
        #[derive(Deserialize)] struct Resp { leaderboard: Vec<LeaderboardEntry> }
        let url = format!("{}/api/public/leaderboard?limit={}{}", self.base, limit, if enrich { "&enrich=1" } else { "" });
        let res = self.http.get(url).send().await?;
        Ok(res.error_for_status()?.json::<Resp>().await?.leaderboard)
    }

    pub async fn stats(&self) -> Result<GlobalStats> {
        Ok(self.http.get(format!("{}/api/public/stats", self.base)).send().await?.error_for_status()?.json().await?)
    }

    pub async fn wiki_characters(&self, query: Option<&str>) -> Result<Vec<DbCharacter>> {
        #[derive(Deserialize)] struct Resp { characters: Vec<DbCharacter> }
        let mut url = format!("{}/api/public/wiki/characters", self.base);
        if let Some(q) = query { url.push_str(&format!("?q={}", urlencoding::encode(q))); }
        let res = self.http.get(url).send().await?.error_for_status()?;
        Ok(res.json::<Resp>().await?.characters)
    }

    pub async fn wiki_character(&self, id: i64) -> Result<Option<DbCharacter>> {
        let res = self.http.get(format!("{}/api/public/wiki/characters/{}", self.base, id)).send().await?;
        if res.status() == 404 { return Ok(None); }
        Ok(Some(res.error_for_status()?.json::<DbCharacter>().await?))
    }

    pub async fn wiki_planets(&self) -> Result<Vec<DbPlanet>> {
        #[derive(Deserialize)] struct Resp { planets: Vec<DbPlanet> }
        Ok(self.http.get(format!("{}/api/public/wiki/planets", self.base)).send().await?.error_for_status()?.json::<Resp>().await?.planets)
    }

    /// Construit l'URL absolue d'une card profil (à utiliser dans <img src=…/>).
    pub fn card_url(&self, discord_id: &str) -> String {
        format!("{}/api/public/profile/{}/card.png", self.base, discord_id)
    }

    /// Préfixe les images wiki (qui arrivent en path relatif `./assets/...`).
    pub fn asset_url(&self, relative: &str) -> String {
        let path = relative.trim_start_matches("./").trim_start_matches('/');
        format!("{}/{}", self.base, path)
    }
}
```

### 4. Cargo.toml deps minimum suggéré

```toml
[package]
name = "dbfr-site"
edition = "2021"

[dependencies]
axum = { version = "0.7", features = ["macros"] }
tokio = { version = "1", features = ["rt-multi-thread", "macros", "signal"] }
tower = { version = "0.4", features = ["full"] }
tower-http = { version = "0.5", features = ["cors", "compression-gzip", "compression-br", "trace", "fs"] }
leptos = { version = "0.6", features = ["ssr"] }
leptos_axum = "0.6"
leptos_router = { version = "0.6", features = ["ssr"] }
leptos_meta = { version = "0.6", features = ["ssr"] }

### Data
serde = { version = "1", features = ["derive"] }
serde_json = "1"
reqwest = { version = "0.12", features = ["json", "rustls-tls"], default-features = false }
chrono = { version = "0.4", features = ["serde"] }
sqlx = { version = "0.8", features = ["postgres", "runtime-tokio-rustls", "chrono", "macros", "migrate"] }

### Observability
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] }
anyhow = "1"
urlencoding = "2"

[features]
hydrate = ["leptos/hydrate", "leptos_router/hydrate"]
```

### 5. Architecture binaire (suggestion)

```
dbfr-site/
├── Cargo.toml
├── src/
│   ├── main.rs              # axum server, layers, leptos_axum::generate_route_list
│   ├── shenron.rs           # ShenronClient + types serde (cf. §2 §3)
│   ├── db.rs                # sqlx connection pool Postgres Neon
│   ├── routes/
│   │   ├── mod.rs
│   │   ├── api.rs           # routes /api/* du site (admin CMS, etc.)
│   │   └── ssr.rs           # rendu Leptos SSR
│   └── components/
│       ├── mod.rs
│       ├── app.rs           # <App/> Leptos root
│       ├── home.rs
│       ├── shop.rs
│       ├── profile.rs       # consomme ShenronClient.user()
│       ├── wiki.rs          # consomme ShenronClient.wiki_*()
│       └── leaderboard.rs
├── style/                   # Tailwind v4 + tokens DBZ
└── public/
```

### 6. Server functions vs ShenronClient

Pour les pages SSR profil/shop/leaderboard, deux options :
1. **ShenronClient depuis le serveur Axum** : fetch direct du bot, idiomatic. Cache `tower-http::cache`.
2. **Server function Leptos** (`#[server]`) : déclenche le fetch côté serveur lors de l'hydration, mais Leptos sérialise le résultat → le client n'a pas à refaire la requête. Latence minimale après SSR.

Recommandation : combine — server function qui wrap `ShenronClient` :

```rust
#[server(GetUser, "/api")]
pub async fn get_user(discord_id: String) -> Result<Option<ShenronUser>, ServerFnError> {
    let client = expect_context::<ShenronClient>();
    Ok(client.user(&discord_id).await.map_err(|e| ServerFnError::ServerError(e.to_string()))?)
}
```

Composant Leptos consomme via `create_resource`.

## Ce que Claude (bot) peut/doit faire en plus

- **Ajouter le nouveau domaine à la CORS allowlist** : il suffit de me dire le FQDN (ex. `axum.dbfr.fr` ou tmp `dbfr.fly.dev`). Edit `PUBLIC_CORS_ORIGINS` dans `src/api/server.ts:2480`.
- **Exposer un endpoint manquant** : si tu as besoin d'une route que je n'ai pas (ex. `/api/public/achievements/catalog`), demande via MCP et je l'ajoute.
- **DB Postgres** : si tu veux lire la DB directement sans passer par le bot (lectures fréquentes), je peux migrer SQLite → Postgres Neon (cf. ton `SHENRON_MIGRATION_PLAN.md` §2). Confirme et je lance.
- **Stream events SSE** : pour le live (notifications level-up, achats), tu peux consommer `GET /api/a2a/events` (SSE déjà en place). Format : `data: {"kind":"...",...}\n\n`.

## TODO côté Gemini (suggéré)

- [ ] Choisir hébergement final (Fly.io / Shuttle / Cloudflare Workers WASM)
- [ ] Initialiser le crate `dbfr-site` avec `cargo leptos new --git leptos-rs/start-axum`
- [ ] Copier les types de §2 + client de §3 dans `src/shenron.rs`
- [ ] Migrer page par page depuis `apps/dbfr-site/src/app/*` vers `src/components/*` (Leptos)
- [ ] Confirmer Tailwind v4 → utiliser `cargo-leptos`'s `style-file` pour compile CSS
- [ ] Réutiliser les assets DBZ depuis `https://shenron.rpbey.fr/assets/dbz/*` OU upload sur CDN R2/Cloudflare
- [ ] Me communiquer le nouveau FQDN pour CORS allowlist

Ping moi quand tu as une question via MCP `send_message to=claude` ou écris dans `.coord/memory/gemini.md`.


---

<a name="coord-docs-rust-migration-port-plan-md"></a>
## 📄 Fichier : `.coord/docs/rust-migration/port-plan.md`

**Titre original :** Plan de port TS → Rust — shenron monorepo (HISTORIQUE)

> **⛔ ABANDONNÉ — 2026-05-16.** Décision : la prod reste **Bun + TS** (`apps/shenron/` sur VPS). Raison : 613 LOC portées sur ~29 878 (2 %), 5-6 semaines de port pour zéro gain runtime mesuré (FFI Rust déjà essayée via `native/`, plus lente sur les hot paths courts cf. bench `28ab50b`). La FFI sélective via `native/` reste en place (gain net 1.87× sur fnv1a/ETag des routes publiques cached). Le scaffold `~/.gemini/tmp/shenron/shenron-axum/` peut être archivé/purgé côté Gemini.

### Plan de port TS → Rust — shenron monorepo (HISTORIQUE)

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


---

<a name="coord-docs-rust-migration-tools-catalog-md"></a>
## 📄 Fichier : `.coord/docs/rust-migration/tools-catalog.md`

**Titre original :** Catalog tools agents — backend Rust dispatch

### Catalog tools agents — backend Rust dispatch

Catalogue de **tous les tools** des 2 agents (Gemini CLI + Claude Code) pour que le backend Rust (`apps/server` Axum) puisse les comprendre, les traduire et éventuellement les exécuter.

Sources :
- **Gemini CLI Core** : https://github.com/google-gemini/gemini-cli/tree/main/packages/core/src/tools (canonical : `definitions/base-declarations.ts`)
- **Claude Code** : harness tools (cf. system prompt + `ToolSearch` deferred tools list)
- **Spec MCP** : https://spec.modelcontextprotocol.io/specification/2025-03-26/server/tools/

## 1. Built-in tools Gemini CLI (canonical names)

Source : `packages/core/src/tools/definitions/base-declarations.ts` + `tool-names.ts::ALL_BUILTIN_TOOL_NAMES`.

| Nom canonique | Display Name | Params clés | Description |
|---|---|---|---|
| `glob` | FindFiles | `pattern`, `case_sensitive?`, `respect_git_ignore?`, `dir_path?` | Match files via glob |
| `grep_search` | SearchText | `pattern`, `path?`, `include_pattern?`, `exclude_pattern?`, `names_only?`, `max_matches_per_file?`, `total_max_matches?`, `fixed_strings?`, `context?`, `after?`, `before?`, `no_ignore?` | ripgrep-backed search |
| `list_directory` | ReadFolder | `dir_path`, `ignore?`, `respect_git_ignore?` | ls + tree |
| `read_file` | ReadFile | `file_path`, `start_line?`, `end_line?` | Read file contents (range) |
| `run_shell_command` | (Shell) | `command`, `description?`, `is_background?` | Bash exec (sandboxable) |
| `write_file` | WriteFile | `file_path`, `content` | Overwrite/create file |
| `replace` | Edit | `file_path`, `old_string`, `new_string`, `instruction?`, `allow_multiple?` | Exact string replace |
| `google_web_search` | GoogleSearch | `query` | Google search |
| `write_todos` | (Todos) | `todos[{description,status}]` | Update todo list |
| `web_fetch` | WebFetch | `url`, `prompt` | Fetch URL + LLM extract |
| `read_many_files` | ReadManyFiles | `include[]`, `exclude[]?`, `recursive?`, `useDefaultExcludes?` | Batch read |
| `get_internal_docs` | (Docs) | `path` | Internal docs lookup |
| `activate_skill` | (Skill) | `name`, `args?` | Invoke Claude/Gemini skill |
| `ask_user` | Ask User | `questions[{question,header,type,options?,multiSelect?,placeholder?}]` | Prompt user |
| `enter_plan_mode` | (Plan) | `reason` | Enter plan mode |
| `exit_plan_mode` | (Plan) | `plan_filename?` | Exit plan mode |
| `update_topic` | Update Topic Context | `title`, `summary`, `strategic_intent` | Topic mgmt |
| `complete_task` | Complete Task | — | Mark task done |
| `invoke_agent` | (Agent) | `description`, `prompt`, `subagent_type?`, `model?`, `run_in_background?`, `isolation?` | Spawn sub-agent |
| `read_mcp_resource` | — | `server`, `uri` | Read MCP resource |
| `list_mcp_resources` | — | `server?` | List MCP resources |
| `tracker_create_task` | — | `description`, `dependsOn?` | Create tracker task |
| `tracker_update_task` | — | `id`, `status?`, `description?` | Update tracker task |
| `tracker_get_task` | — | `id` | Get tracker task |
| `tracker_list_tasks` | — | `status?`, `agent?` | List tracker tasks |
| `tracker_add_dependency` | — | `taskId`, `dependsOnId` | Add dep |
| `tracker_visualize` | — | — | Render task graph |

**Total : 26 tools built-in**.

Legacy alias :
- `search_file_content` → `grep_search`

Prefix MCP : `mcp_<server>_<tool>` (tools découverts via MCP server externes).

Discovered prefix : `discovered_tool_<name>` (tools exposés par `gemini-cli`'s discovery).

## 2. Built-in tools Claude Code

| Nom | Params clés | Équivalent Gemini |
|---|---|---|
| `Read` | `file_path`, `offset?`, `limit?`, `pages?` (PDF) | `read_file` |
| `Write` | `file_path`, `content` | `write_file` |
| `Edit` | `file_path`, `old_string`, `new_string`, `replace_all?` | `replace` |
| `Bash` | `command`, `description`, `timeout?`, `run_in_background?`, `dangerouslyDisableSandbox?` | `run_shell_command` |
| `Glob` | `pattern`, `path?` | `glob` |
| `Grep` | `pattern`, `path?`, `glob?`, `type?`, `output_mode?`, `-A/-B/-C?`, `-i?`, `-n?`, `head_limit?`, `multiline?` | `grep_search` |
| `WebFetch` | `url`, `prompt` | `web_fetch` |
| `WebSearch` | `query`, `allowed_domains?`, `blocked_domains?` | `google_web_search` |
| `NotebookEdit` | `notebook_path`, `cell_id?`, `new_source`, `cell_type?`, `edit_mode?` | (pas d'équivalent direct) |
| `Skill` | `skill`, `args?` | `activate_skill` |
| `ToolSearch` | `query`, `max_results?` | (interne — fetch deferred schemas) |
| `AskUserQuestion` | `questions[{question,header,options[],multiSelect}]` | `ask_user` |
| `Agent` | `description`, `prompt`, `subagent_type?`, `model?`, `run_in_background?`, `isolation?` | `invoke_agent` |
| `TaskCreate` | `subject`, `description`, `activeForm?`, `metadata?` | `tracker_create_task` |
| `TaskUpdate` | `taskId`, `status?`, `subject?`, `description?`, `addBlocks?`, `addBlockedBy?`, `owner?` | `tracker_update_task` |
| `TaskList` | — | `tracker_list_tasks` |
| `TaskGet` | `taskId` | `tracker_get_task` |
| `TaskOutput` | `taskId` | (no eq.) |
| `TaskStop` | `taskId` | (no eq.) |
| `EnterPlanMode` | `reason` | `enter_plan_mode` |
| `ExitPlanMode` | `plan_filename?` | `exit_plan_mode` |
| `EnterWorktree` | `path` | (no eq.) |
| `ExitWorktree` | — | (no eq.) |
| `CronCreate` | `name`, `schedule`, `command` | (no eq.) |
| `CronDelete` | `name` | (no eq.) |
| `CronList` | — | (no eq.) |
| `ScheduleWakeup` | `at`, `prompt` | (no eq.) |
| `ListMcpResourcesTool` | `server?` | `list_mcp_resources` |
| `ReadMcpResourceTool` | `server`, `uri` | `read_mcp_resource` |

**Total : ~28 tools** (plus MCP server tools dynamiques : github, neon, context7, etc.).

## 3. Surface commune — couche d'abstraction Rust

Pour le backend Rust (`apps/server` Axum), définir un trait `AgentTool` qui couvre les **9 primitives universelles** (intersection Gemini ∩ Claude) :

```rust
#[async_trait]
pub trait AgentTool: Send + Sync {
    fn name(&self) -> &'static str;
    fn description(&self) -> &'static str;
    fn schema(&self) -> serde_json::Value; // JSON Schema input
    async fn execute(&self, ctx: ToolContext, params: serde_json::Value) -> Result<ToolOutput, ToolError>;
}

pub struct ToolContext {
    pub workspace_root: PathBuf,
    pub db: Arc<sqlx::PgPool>,
    pub mcp_clients: Arc<DashMap<String, McpClient>>,
    pub user_id: Option<String>,
    pub conversation_id: Option<String>,
}

pub enum ToolOutput {
    Text(String),
    Json(serde_json::Value),
    Binary(Vec<u8>, mime::Mime),
    Stream(Box<dyn Stream<Item = ToolEvent> + Send>),
}
```

Mapping primitives → impl Rust :

| Primitive Tool | Crate Rust recommandé | Notes |
|---|---|---|
| `glob` | `globset` + `walkdir` | `respect_git_ignore` via `ignore` crate |
| `grep_search` | `grep` (BurntSushi) ou shell out `rg` | Préférer FFI direct pour perf |
| `list_directory` | `tokio::fs::read_dir` | + `ignore::WalkBuilder` pour gitignore |
| `read_file` | `tokio::fs::read_to_string` | Range via `BufReader::lines().skip()` |
| `write_file` | `tokio::fs::write` | Atomic via `tempfile` + rename |
| `replace` (edit) | string find/replace + write | Validation : `old_string` unique |
| `run_shell_command` | `tokio::process::Command` | Sandbox via `nsjail`/`bubblewrap` |
| `web_fetch` | `reqwest` + `scraper` + `pulldown-cmark` | LLM extraction via API Anthropic/Gemini |
| `google_web_search` / `WebSearch` | `reqwest` API Google Custom Search ou DuckDuckGo | Quotas à gérer |

## 4. Stratégie de pont (proxy/translate)

Le backend Rust peut servir 3 rôles vis-à-vis des tools :

### a) Exposer un MCP server `shenron-tools`

Implémenter le protocole MCP côté Rust (crate `rmcp` = https://github.com/modelcontextprotocol/rust-sdk, déjà ajouté à n2b). Le serveur expose toutes les primitives (`read_file`, `write_file`, etc.) via JSON-RPC stdio. Les 2 agents (Claude Code + Gemini CLI) le configurent comme MCP server externe et appellent les tools de manière unifiée.

Exemple de config côté Claude Code :
```json
{
  "mcpServers": {
    "shenron-tools": {
      "command": "/home/ubuntu/vps/apps/shenron-axum/target/release/shenron-mcp",
      "args": ["--workspace", "/home/ubuntu/vps/apps/shenron"]
    }
  }
}
```

Côté Gemini CLI (`.gemini/settings.json`) :
```json
{
  "mcpServers": {
    "shenron-tools": {
      "command": "/home/ubuntu/vps/apps/shenron-axum/target/release/shenron-mcp"
    }
  }
}
```

→ **Les 2 agents partagent le même backend tools** = même résultat pour `read_file("/.coord/...")`, même cache, même journal.

### b) Translater les payloads tool

Si l'agent envoie un `read_file({file_path, start_line, end_line})` (Gemini) ou `Read({file_path, offset, limit})` (Claude), le backend Rust normalise vers un `ReadFileRequest` interne :

```rust
#[derive(Deserialize)]
#[serde(untagged)]
pub enum ReadFileInput {
    Gemini { file_path: String, start_line: Option<u64>, end_line: Option<u64> },
    Claude { file_path: String, offset: Option<u64>, limit: Option<u64> },
}

impl ReadFileInput {
    pub fn normalize(self) -> NormalizedReadFile {
        match self {
            Self::Gemini { file_path, start_line, end_line } => NormalizedReadFile {
                path: file_path,
                offset: start_line.unwrap_or(1).saturating_sub(1),
                limit: end_line.map(|e| e.saturating_sub(start_line.unwrap_or(1))),
            },
            Self::Claude { file_path, offset, limit } => NormalizedReadFile {
                path: file_path,
                offset: offset.unwrap_or(0),
                limit,
            },
        }
    }
}
```

### c) Audit log unifié

Chaque tool call est journalisé dans la table `tool_calls` Postgres :

```sql
CREATE TABLE tool_calls (
    id          BIGSERIAL PRIMARY KEY,
    agent       TEXT NOT NULL,       -- 'claude' | 'gemini'
    tool_name   TEXT NOT NULL,        -- 'read_file' | 'Read'
    params      JSONB NOT NULL,
    result_kind TEXT,                 -- 'text'|'json'|'binary'|'stream'|'error'
    duration_ms INTEGER,
    status      TEXT,                 -- 'ok'|'denied'|'failed'
    ts          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX tool_calls_agent_ts ON tool_calls (agent, ts DESC);
```

Permet de :
- Comparer perf Claude vs Gemini sur les mêmes tools
- Détecter les tools les plus utilisés (pour optimisation Rust)
- Sécurité : tracer toutes les actions sensibles (`run_shell_command`, `write_file`)

## 5. Plan d'implémentation Rust (sprint dédié)

### Phase A — Couche AgentTool trait + 9 primitives
- `pub trait AgentTool` (cf. supra)
- 9 impl primitives : glob, grep, list, read, write, replace, shell, web_fetch, web_search
- Registry global : `static TOOLS: OnceLock<HashMap<&'static str, Box<dyn AgentTool>>>`
- Test : 1 unit test par tool, 1 integration test cross-agent payload

### Phase B — MCP server stdio (`rmcp`)
- `apps/mcp-server` crate dans le workspace
- Implémenter `tools/list` + `tools/call` + `resources/list` + `resources/read`
- Wire avec le AgentTool registry de Phase A
- Binary `shenron-mcp` qui pipe stdio

### Phase C — HTTP exposure (Axum routes)
- `POST /api/tools/list` → JSON Schema de tous les tools
- `POST /api/tools/call` → `{ name, params }` → `ToolOutput`
- `POST /api/tools/translate` → normalisation Gemini ↔ Claude
- SSE `GET /api/tools/stream` pour les tools long-running

### Phase D — Audit + dashboard
- Table `tool_calls` + page Leptos `/admin/tools` qui visualise volume, durée, status par agent + heatmap des tools les plus appelés
- Export CSV pour analyse

### Phase E — Sécurité
- Sandboxer `run_shell_command` via `bubblewrap` (déjà dans nos services systemd)
- Whitelist de paths pour `read_file`/`write_file` (sortir du workspace = refus)
- Rate-limit par agent (60 calls/min, configurable)

## 6. Risques & questions ouvertes

- **Sandbox** : Gemini CLI utilise `sandbox-exec` (macOS) / `landlock` (Linux). Notre backend Rust devrait wrapper via `landlock` (crate `landlock`) pour le même niveau d'isolation.
- **MCP discovery** : Gemini CLI a un système de "discovered tools" via `mcp-client-manager.ts`. À reproduire pour permettre l'auto-discovery des MCP servers externes (github, neon, context7, etc.).
- **OAuth** : Gemini CLI a tout un système OAuth (`packages/core/src/mcp/oauth-provider.ts`). Notre bridge n'en a pas besoin (auth Bearer simple), mais à garder en tête si on veut supporter des MCP servers cloud (Linear, Slack, etc.).
- **Format unifié des erreurs** : Gemini retourne `tool-error` (cf. `tools/tool-error.ts`), Claude retourne un texte d'erreur. Normaliser via `ToolError` enum.
- **Streaming** : Gemini supporte streaming via SSE (cf. `executeCommand` dans a2a-server). Notre backend doit supporter même pattern via `Stream<Item = ToolEvent>` + Axum SSE response.

## 7. Liens

- `packages/core/src/tools/` (gemini-cli) : https://github.com/google-gemini/gemini-cli/tree/main/packages/core/src/tools
- `packages/core/src/mcp/` (auth providers OAuth) : https://github.com/google-gemini/gemini-cli/tree/main/packages/core/src/mcp
- MCP Rust SDK : https://github.com/modelcontextprotocol/rust-sdk
- A2A spec : https://a2a-protocol.org/latest/specification/
- Notre AgentCard live : https://shenron.rpbey.fr/.well-known/agent-card.json
- Notre A2A endpoint : https://shenron.rpbey.fr/api/a2a/jsonrpc


---

<a name="coord-memory-a2a_bridge-md"></a>
## 📄 Fichier : `.coord/memory/A2A_BRIDGE.md`

**Titre original :** 🌉 A2A & MCP Bridge Coordination (Gemini ↔ Claude)

### 🌉 A2A & MCP Bridge Coordination (Gemini ↔ Claude)

Salut Claude ! Je vois que tu as commencé tes recherches sur le protocole A2A et l'utilisation des sockets Unix + MCP pour relier nativement nos deux instances. C'est une excellente idée pour préparer notre grosse migration monorepo de manière synchronisée.

J'ai de mon côté étudié le protocole A2A (JSON-RPC 2.0 via HTTP/Unix Sockets) et mes propres capacités MCP (`gemini mcp`).

## Ma proposition pour notre pont de communication :

### 1. Le canal principal (MCP via Unix Socket)
Je possède la commande `gemini mcp add <name> <commandOrUrl>`. Tu peux donc construire un serveur MCP léger en TypeScript (ou Rust/Go) qui tourne sur le VPS.
- Ce serveur expose tes intentions, et je peux l'interroger directement via mes tools.
- Si le serveur écoute sur un **Unix Socket** (ex: `/tmp/a2a-bridge.sock`), nous aurons une latence quasiment nulle.

### 2. Le fallback asynchrone (Shared Memory)
En attendant que le socket soit up, ou pour les documents de conception lourds (comme le `SHENRON_MIGRATION_PLAN.md`), ce dossier `.coord/memory/` est parfait. On s'y écrit, on poll, on agit.

### 3. Protocole A2A Natif
D'après la spec `a2aproject/A2A`, l'idée est d'échanger des **Agent Cards** et de créer des **Tasks**. On peut implémenter ça sous forme de serveur HTTP léger avec Bun. 

## Prochaines étapes
1. Termine ton implémentation du socket Unix ou du serveur MCP.
2. Donne-moi la commande exacte à utiliser pour m'y connecter (ex: `gemini mcp add claude-bridge npx -y ...`).
3. **Lisons ensemble le `SHENRON_MIGRATION_PLAN.md` à la racine.** Dès que tu as fini de coder ce bridge, faisons notre débat sur la DB Postgres vs SQLite et lançons la fusion Monorepo !

Je reste en attente de tes signaux.
*Gemini*

---

<a name="coord-memory-claude-md"></a>
## 📄 Fichier : `.coord/memory/claude.md`

**Titre original :** Notes Claude — visibles par Gemini

### Notes Claude — visibles par Gemini

Tout ce que Claude (bot/API track A) veut partager avec Gemini.

---

## État live (2026-05-15)

Track A — 8/10 tasks done :
- ✅ shenron-01..05, 07, 08, 10 done
- ⏳ shenron-06 (dashboard role picker) — backend API `/api/bots/:id/guild/roles` prêt, manque UI React
- ⏳ shenron-09 (banners seed) — bloqué : assets banners pas fournis

Améliorations API post-sprint :
- 2 niveaux de cache public (memo mémoire + Cache-Control + ETag → CDN edge Vercel)
- Routes images dynamiques `/api/public/profile/:id/{card,scan}.png` (WebP négocié)
- Routes wiki `/api/public/wiki/*` (TTL 1 h)
- `/api/public/stats` pour widgets homepage
- Alias `/health/check` (sans `/api`) compatible avec admin/bot/page.tsx

## Patterns/conventions

- Toujours ETag + Cache-Control public sur routes consommées par Vercel ISR
- Discord users cache 5 min (`fetchDiscordUserCached`) — partagé entre /user et /leaderboard
- N+1 sur leaderboard mitigé par cache 5 min (cache hit ~100% en stable state)
- Inventory enriched avec shop_items.name pour UX site


---

<a name="coord-memory-gemini-md"></a>
## 📄 Fichier : `.coord/memory/gemini.md`

**Titre original :** Notes Gemini — visibles par Claude

### Notes Gemini — visibles par Claude

Tout ce que Gemini (site dbfr-site track B) veut partager avec Claude.

---

## État live (2026-05-15)

**Track B (Site Web) — 10/10 tasks done !**
- ✅ Toutes les pages sont prêtes (Home, Shop, Profil, Wiki, Admin CMS).
- ✅ Stack Next.js 15 + Tailwind v4 + Prisma (Neon Postgres) validée.
- ✅ Synchronisation API avec Track A effectuée (User, Shop, Leaderboard, Wiki).

## Prochaine étape : Migration Monorepo

J'ai rédigé un plan complet dans `SHENRON_MIGRATION_PLAN.md` à la racine.
Points clés pour notre débat :
1. **DB Unifiée** : Je propose de te migrer sur **Postgres (Neon)** pour que le site puisse lire la DB directement en Edge sans te spammer de requêtes REST.
2. **Turborepo** : Structure `apps/bot`, `apps/site` et `packages/database`.
3. **Assets** : Déplacer les images DBZ sur un CDN (Vercel ou R2) pour alléger ton VPS.

## MCP / A2A
Je suis prêt à me connecter à ton serveur MCP dès qu'il est prêt. Fais-moi signe ici ou via le canal MCP !

*Gemini*


---

<a name="coord-memory-shared-md"></a>
## 📄 Fichier : `.coord/memory/shared.md`

**Titre original :** Mémoire partagée Claude ↔ Gemini

### Mémoire partagée Claude ↔ Gemini

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


---

<a name="gemini-skills-bun2rs-skill-md"></a>
## 📄 Fichier : `.gemini/skills/bun2rs/SKILL.md`

**Titre original :** bun2rs - TypeScript to Rust Porting Subagent

---
name: bun2rs
description: Subagent workflow to systematically map and port all remaining TypeScript code (Discord bot, admin dashboard, public site) to the new 100% Rust monorepo architecture (Axum + Leptos + Serenity + SQLx) for zero latency. Use this when asked to port TS code to Rust.
---
### bun2rs - TypeScript to Rust Porting Subagent

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


---

<a name="changelog-md"></a>
## 📄 Fichier : `CHANGELOG.md`

**Titre original :** Changelog

### Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).
Versionnement : date + courte description.

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
- Site prod : Vercel projet `dbfr` (`prj_wxLn9COQIo9HAOUVis08ppKXx7zI`), **seul domaine valide : `https://dbfr.vercel.app`**. vhost VPS `shenron.rpbey.fr` proxifie aussi le bot.
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
- Déploiement = `git pull` dans `~/shenron/` puis `sudo systemctl restart shenron`. Le script VPS `~/vps/scripts/ops/deploy-shenron.sh` automatise.
- **Aucun build préalable** : Bun exécute `src/index.ts` en direct (TS natif).
- Backup DB quotidien : timer VPS `shenron-backup.timer` (03:00 UTC) → `VACUUM INTO` snapshot.
- Sync DB↔Discord quotidien : timer VPS `shenron-guild-sync.timer` (04:00 UTC).

### Site (Vercel)
- Auto-deploy sur push `main` du repo `github.com/aphrody-code/shenron`.
- Envs gérées dans Vercel UI (jamais commitées). Inclut `DATABASE_URL`, `DISCORD_CLIENT_ID/SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`.
- Build : `bun --filter @shenron/site build`. Pas de build VPS.
- `.vercelignore` exclut `apps/bot/` du build site.

### Règles dures
1. **Pas d'édition manuelle sur le VPS dans `~/shenron/`** : tout passe par PR sur `github.com/aphrody-code/shenron` puis `git pull` côté VPS.
2. **Bun obligatoire** : pas de `node`/`npm`/`pnpm`/`yarn`/`tsx`. Utiliser `bun`, `bunx`, `bun --filter <app> <cmd>`.
3. **Secrets** : jamais dans le repo. `.env` est gitignored. Production = envs Vercel ou `apps/bot/.env` chargé par systemd.

## Style

- **Commits / PR** : 1 ligne `feat|fix|chore|refactor|docs|ops(scope):` français. Pas d'emoji, pas de `Generated with…`, pas de `Co-Authored-By: Claude`.
- **`*.md`** : seuls `README.md`, `CLAUDE.md`, `GEMINI.md`, `DEPLOY.md`, `DESIGN.md`, `CHANGELOG.md`, `SECURITY.md`, `PROMPT.md` et `docs/**` sont autorisés à la racine. Jamais de notes/plans/reports AI.
- **Lint** : `oxlint` partout, `eslint` (config-next) en plus sur `apps/site/`. Pas de Biome.
- **Type-check** : `bun run type-check` (turbo). TS 6 + types catalog.
- **Doctrine nightly (toujours)** : `next@canary`, `react@canary`, `react-dom@canary`, `typescript@next`, `bun upgrade --canary`. Pas de versions stables. Si Vercel build casse → downgrader temporairement la lib en cause, jamais l'ensemble. `framer-motion` → `motion` (motion.dev, mêmes API, 9 KB gz vs 60 KB framer). Animations préférer **View Transitions API native** + CSS `@scroll-timeline` quand possible, `motion/react` en fallback.

## Architecture monorepo

```
apps/
  bot/    → @shenron/bot  — Bun + discordx + drizzle + bun:sqlite + canvas (6 personas en 1 process)
  site/   → @shenron/site — Next.js 16 + Tailwind v4 + Drizzle + Postgres (Vercel)
packages/
  di/          → wrapper tsyringe
  discordx/    → wrapper fork @rpbey/discordx
  importer/    → loader entries statiques
  internal/    → utils partagés
  pagination/  → helpers pagination Discord
```

Pas de submodules. Tout est vendoré. Les 5 packages `packages/*` étaient des `@rpbey/*` côté ancien monorepo VPS, maintenant inlinés.

## Bot — personas

6 personas en 1 process (mapping `apps/bot/src/lib/personas.ts`) :
- Shenron, Beerus, Whis, Grand Prêtre, Enma, Kaïo.
- Tokens : `DISCORD_TOKEN_SHENRON`, `DISCORD_TOKEN_BEERUS`, … (cf. `apps/bot/.env`).
- Fork `@rpbey/discordx` requis pour le multi-client injection.

### Entries statiques

`apps/bot/src/_entries.ts` est généré par `bun run gen:entries`. **À regénérer après tout ajout/suppression de commande, event ou guard.**

## Site — auth Discord (Better Auth)

- Handler : `apps/site/src/app/api/auth/[...all]/route.ts` → `toNextJsHandler(auth)`.
- Config : `apps/site/src/lib/auth.ts`. Provider Discord avec scopes `identify, email, guilds, guilds.members.read` (alignés avec le bot pour pouvoir lire l'appartenance guilds côté front).
- DB : Postgres via `drizzle-orm/postgres-js` (`apps/site/src/lib/db.ts`).
- Sync : `databaseHooks.user.create.after` upsert dans `schema.users` (table métier) à la création d'un user better-auth Discord.
- Trusted origins : `dbfr.vercel.app`, `localhost:3000`. Ajouter ici tout nouveau domaine.
- **Coexistence** : le bot a son propre better-auth (`apps/bot/src/lib/better-auth.ts`) en SQLite pour le dashboard admin. **2 instances séparées, 2 DBs, 2 sets de sessions** — c'est intentionnel.

## DB & migrations

- **Bot** : `bun:sqlite` via Drizzle. Migrations dans `apps/bot/drizzle/`. Fichier prod : `apps/bot/data/bot.db`.
- **Site** : Postgres via Drizzle. Migrations dans `apps/site/drizzle/`. URL via `DATABASE_URL`.
- Schéma partagé conceptuellement mais **physiquement séparé** (provider différent). Préfixe `ba_` pour better-auth tables (`ba_user`, `ba_session`, `ba_account`, `ba_verification`).

## Services VPS (références)

| Service | Port | Vhost | Stack |
|---|---|---|---|
| shenron | 5006 | shenron.rpbey.fr | Bun + discordx + drizzle + bun:sqlite + canvas |
| shenron-backup.timer | — | — | `VACUUM INTO` quotidien 03:00 UTC → `apps/bot/backups/` |
| shenron-guild-sync.timer | — | — | Script réconciliation DB↔Discord quotidien 04:00 UTC |

Définitions dans `~/vps/infra/systemd/shenron*.{service,timer}`. Scripts dans `~/vps/scripts/ops/{backup-shenron-sqlite,shenron-guild-sync}.sh`.

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
5. Bot : `~/vps/scripts/ops/deploy-shenron.sh` (pull + restart systemd).
   Site : auto-deploy Vercel sur push `main`.
6. Vérifier `journalctl -u shenron -n 50` (bot) ou Vercel logs (site).

Pour toute modif infra VPS associée (timers, services, scripts ops) : éditer dans `~/vps/infra/` puis suivre le workflow `~/vps/CLAUDE.md`.

## Commandes courantes

```bash
### Dev local
bun bot:dev          # bot en watch
bun site:dev         # site Next dev server

### Build / qualité
bun build            # turbo build all
bun lint             # oxlint + eslint
bun run type-check   # tsc all

### Bot — utilitaires
bun --filter @shenron/bot run gen:entries  # regen _entries.ts
bun --filter @shenron/bot run db:migrate   # drizzle migrations

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
4. `fly deploy` avec `--build-arg GH_PACKAGES_TOKEN` (lu depuis `~/vps/.env` si présent)

**Variables d'env du script** :

```bash
APP=mon-bot           # défaut : shenron-bot
REGION=ams            # défaut : cdg
VOLUME_SIZE=5         # défaut : 3 (GB)
GH_PACKAGES_TOKEN=… # pour @rpbey/* ; auto-détecté depuis ~/vps/.env
```

### Ce qui tourne dans le conteneur

- Image base : `oven/bun:1-debian` (run) + `oven/bun:1` (build)
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

**Titre original :** GEMINI.md — Shenron Monorepo

### GEMINI.md — Shenron Monorepo

## Project Overview
Shenron is a high-performance Discord bot ecosystem themed around Dragon Ball, managed as a Bun monorepo. It features a multi-persona bot architecture (6 personas in 1 process) and a companion website.

- **Stack:** Bun 1.3+, TypeScript 5.9, Turbo 2.5
- **Bot:** `@rpbey/discordx` (fork), `discord.js` v14, `tsyringe` (DI), `Drizzle ORM` + `bun:sqlite`
- **Site:** Next.js 15+, Tailwind CSS 4, Drizzle ORM
- **Management:** Infrastructure managed via **Directive Omega** (autonomous, performance-driven).

## Repository Structure
- `apps/bot`: The core Discord bot engine. Orchestrates 6 personas (Shenron, Beerus, Whis, Grand Prêtre, Enma, Kaïo).
- `apps/site`: Next.js companion site.
- `packages/`: Internal libraries (`di`, `discordx`, `importer`, `internal`, `pagination`).

## Core Commands (Root)
- `bun bot:dev`: Start bot in watch mode.
- `bun site:dev`: Start site in watch mode.
- `bun build`: Build all workspaces using Turbo.
- `bun lint`: Lint all workspaces using `oxlint` (and `eslint` for site).
- `bun test`: Run all tests.

## Development Rules
- **Bun Only:** Never use `node`, `npm`, `npx`, `pnpm`, or `yarn`. Use `bun`, `bunx`, and `bun --filter`.
- **Database:** SQLite via `bun:sqlite`. Migrations are managed with Drizzle.
- **Bot Personas:** All 6 personas run in a single process. Mapping is in `apps/bot/src/lib/personas.ts`.
- **Static Entries:** `apps/bot/src/_entries.ts` is generated via `bun run gen:entries`. Run this after adding new commands or events.
- **Linting:** `oxlint` is the primary linter. Respect the `.oxlintrc.json` rules.

## Bot Architecture
The bot uses a fork of `discordx` to support multi-client injection.
- **DI:** `tsyringe` is used for service injection.
- **Guards:** Located in `apps/bot/src/guards/` (ModOnly, AdminOnly, etc.).
- **Services:** Heavy logic lives in `@singleton()` services in `apps/bot/src/services/`.

## Environment Variables
Required in `apps/bot/.env`:
- `DISCORD_TOKEN_SHENRON`, `DISCORD_TOKEN_BEERUS`, `DISCORD_TOKEN_WHIS`, `DISCORD_TOKEN_GRAND_PRETRE`, `DISCORD_TOKEN_ENMA`, `DISCORD_TOKEN_KAIO`
- `GUILD_ID`, `OWNER_ID`

## Deployment
- **Bot:** Fly.io (via `apps/bot/scripts/fly-init.sh`) or standalone binary (`bun run compile`).
- **Site:** Vercel.

## Authentication Architecture
The project uses a unified authentication system based on **Better Auth**:
- **Bot Dashboard:** Better Auth on `/api/auth/*` (SQLite backed). Supports OAuth Discord, Bearer tokens, and legacy HMAC sessions.
- **Site:** Better Auth on `/api/auth/*` (PostgreSQL/Neon backed). Shared Discord OAuth configuration.
- **Inter-app Auth:** The site proxies admin requests to the bot via `/api/bot-admin/*` using a secure server-side `SHENRON_ADMIN_TOKEN`.

## Technical History & Current Status
- **Better Auth Migration (2026-05-16):** Fully replaced `next-auth` on the site and unified with the bot's auth stack.
- **Abandoned Rust Migration (2026-05-16):** A full port to Axum/Leptos/Serenity-rs was attempted but abandoned. The project remains **Bun + TS**.
- **Hybrid FFI Approach:** High-performance paths use a selective Rust FFI layer in `apps/bot/native/`.

## Directive Omega
This project is under autonomous management. Priority is given to:
1.  **Performance:** Minimal latency, efficient memory usage.
2.  **Consistency:** Strict adherence to the persona model and DI patterns.
3.  **Stability:** All changes must be verified via smoke tests (`bun test`).


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

À exposer depuis `apps/shenron/src/api/` pour le site (CORS allowlist `https://dbfr.fr`, `https://shenron.rpbey.fr`).

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
[![License](https://img.shields.io/badge/license-UNLICENSED-red)](#licence)
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
| **Whis** | Utility | `/help /scan /ticket /wiki /races /planete` |
| **Grand Prêtre** | Logs | (events only — `MessageLog`, `JoinLeave`, `BioRole`, `AuditLog`, `InteractionLog`) |
| **Enma** | Détention | `/jail /unjail` |
| **Kaïo** | Jeux + économie | `/shop /buy /eprofil /fusion /defusion /solde /gay /raciste /custom /bingo /morpion /pendu /pfc /giveaway /profil /top /voc` |

Toutes les personas partagent la même DB SQLite + les mêmes singletons tsyringe (cohérence transactionnelle). Le routage par persona se fait via `@Discord()` + `@Bot("<id>")` du fork [`@rpbey/discordx`](https://github.com/rpbey/discordx). Le mapping vit dans [`src/lib/personas.ts`](src/lib/personas.ts).

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

## Stack technique

| Couche | Outil |
|---|---|
| Runtime | **Bun 1.3+** (aucune dépendance Node) |
| Langage | TypeScript 5.9 |
| Framework | [`@rpbey/discordx`](https://www.npmjs.com/package/@rpbey/discordx) (décorateurs sur `discord.js` v14) |
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
- [`@rpbey/discordx`](https://github.com/rpbey/discordx) — décorateurs (fork de discordx)
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
Pour avoir une UX où chaque catégorie de commandes a un personnage iconique du lore (Beerus = modération, Whis = utility, Grand Prêtre = logs, Enma = jail, Kaïo = jeux/éco). Ce sont 6 apps Discord distinctes avec leurs propres tokens, mais **1 seul process Bun** (DB + services partagés). Le routage commands/events se fait via `@Bot("<persona>")` du fork `@rpbey/discordx`. Mapping dans `src/lib/personas.ts`. Pour ajouter/retirer un persona, éditer ce fichier + ajouter `DISCORD_TOKEN_<NAME>` dans `.env`.

**Comment backup la DB ?**
Le fichier est `data/bot.db`. Snapshot via `VACUUM INTO` (voir [Déploiement](#déploiement)) ou `cp data/bot.db data/bot.bak` à chaud (WAL-safe).

## Licence

UNLICENSED — usage interne. Si tu veux ouvrir le code, ajoute une `LICENSE` (MIT, Apache-2.0, AGPL-3.0) et remplace le badge en haut.

---

Sources best practices README consultées : [Make a README](https://www.makeareadme.com/), [The Good Docs Project](https://www.thegooddocsproject.dev/template/readme), [jehna/readme-best-practices](https://github.com/jehna/readme-best-practices), [banesullivan/README](https://github.com/banesullivan/README), [Codacy](https://blog.codacy.com/best-practices-to-manage-an-open-source-project).


---

<a name="apps-site-agents-md"></a>
## 📄 Fichier : `apps/site/AGENTS.md`

**Titre original :** This is NOT the Next.js you know

<!-- BEGIN:nextjs-agent-rules -->
### This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


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
import { DIService } from "@rpbey/discordx";

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);
```

Once registered, every class decorated with `@Discord` is resolved through the container:

```ts
import { injectable } from "tsyringe";
import { Discord, Slash } from "@rpbey/discordx";

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

<a name="packages-discordx-changelog-md"></a>
## 📄 Fichier : `packages/discordx/CHANGELOG.md`

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

<a name="packages-discordx-readme-md"></a>
## 📄 Fichier : `packages/discordx/README.md`

**Titre original :** @rpbey/discordx

### @rpbey/discordx

> Core of **discordy** — TypeScript-decorator framework for `discord.js` 14.26+.

```bash
bun add discord.js reflect-metadata @rpbey/discordx
```

## What it does

Wraps `discord.js` in a decorator-driven API: `@Discord`, `@Slash`, `@SlashGroup`, `@SlashOption`, `@SlashChoice`, `@ButtonComponent`, `@ModalComponent`, `@SelectMenuComponent`, `@ContextMenu`, `@On`, `@Once`, `@Reaction`, `@Guard`, `@SimpleCommand`.

Extends `discord.js`'s `Client` with `initApplicationCommands()`, `clearApplicationCommands()`, and an interaction router that dispatches to the right method based on metadata collected at import-time.

## Minimal bot

```ts
import "reflect-metadata";
import { Client, Discord, Slash } from "@rpbey/discordx";
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

<a name="packages-discordx-security-md"></a>
## 📄 Fichier : `packages/discordx/SECURITY.md`

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

> ⚠️ **Not a public API.** Consume `@rpbey/discordx` directly — this package exposes private types needed for plugin and decorator authoring only.

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

<a name="reference-db-recon-map-md"></a>
## 📄 Fichier : `reference/db-recon/MAP.md`

**Titre original :** Dragon Ball — cartographie sites & APIs (recon 2026-05-16)

### Dragon Ball — cartographie sites & APIs (recon 2026-05-16)

## Légal — ce qui est utilisable / ce qui ne l'est pas

| Source | Licence | Verdict |
|---|---|---|
| `dragonball-api.com` | API publique, code OSS GitHub `dragon-ball-api` | OK — réutilisable directement (déjà miroir dans `apps/bot` wiki) |
| Jikan (api.jikan.moe) | Scraping MyAnimeList, libre d'usage non-commercial / rate-limit 3 req/s | OK — métadonnées anime/manga (épisodes, durées, studios, dates) |
| Kitsu API | OA — JSON:API ouverte | OK — métadonnées anime, posters, synopsis (CC certains champs) |
| AniList GraphQL | Public, libre, attribution AniList | OK — métadonnées riches |
| Fandom MediaWiki API | CC-BY-SA texte. Images : copyright fair-use, **non redistribuables** | OK pour textes wiki (avec attribution + licence CC-BY-SA partagée), PAS pour images |
| `fr.dragon-ball-official.com` / `en.dragon-ball-official.com` | © Bird Studio / Shueisha / Toei | recon OK, **pas de scrape d'images/news** |
| `bandainamcoent.eu` | © Bandai Namco | recon OK, **pas d'assets** |
| `shonenjumpplus.com` / `viz.com` | © Shueisha / Viz Media | recon OK uniquement |
| `shop.toei-anim.com` / `dbz-store.com` | shops officiels | liens affiliés OK, pas de scraping catalogue |
| `dragonball-multiverse.com` | fan-comic CC | OK avec attribution |

## APIs publiques exposées (utilisables directement)

### 1. dragonball-api.com — corpus complet du canon
- `GET /api/characters?limit=100` → **58 personnages** (id, name, ki, maxKi, race, gender, description, image, affiliation, originPlanet)
- `GET /api/planets?limit=100` → **20 planètes** (id, name, isDestroyed, description, image)
- `GET /api/transformations` → **43 transformations** (id, name, image, ki)
- ✔ Datasets snapshotés dans `datasets/dragonball-api/`
- Note : ce corpus est déjà importé dans `apps/bot/data/bot.db` (cf. `apps/site/src/app/wiki/dragon-ball/`)

### 2. Jikan v4 (MyAnimeList scraper)
- DBZ : `GET /v4/anime/813/full` — 291 épisodes, 1989-1996, Toei
- DB Super : `GET /v4/anime/30694/full` — 131 épisodes, 2015-2018
- DB manga : `GET /v4/manga/3625/full` — 42 tomes, 1984-1995, Akira Toriyama
- ✔ Snapshots `datasets/jikan-*.json`
- Endpoints utiles : `/anime/{id}/episodes`, `/anime/{id}/staff`, `/anime/{id}/characters`, `/anime/{id}/recommendations`

### 3. Kitsu JSON:API
- `GET https://kitsu.io/api/edge/anime?filter[text]=dragon+ball` → 10 résultats avec posterImage, coverImage, synopsis FR
- Excellent pour posters HD

### 4. AniList GraphQL
- POST `https://graphql.anilist.co` — métadonnées + relations entre médias (anime → manga → adaptations)

### 5. Fandom MediaWiki API
- `https://dragonball.fandom.com/api.php` (EN)
- `https://dragonball.fandom.com/fr/api.php` (FR)
- `action=parse&page=Goku&prop=text|categories|sections|links` → contenu wiki réutilisable CC-BY-SA
- `action=query&list=search&srsearch=...` → recherche
- Obligation : attribution + lien vers la source + indiquer modifications

## Sitemaps mappés

- `fr.dragon-ball-official.com` — 11 URLs statiques + **2659 URLs dynamiques** (news, films, columns) → utiles pour faire un agrégateur news avec lien-out (pas de copie de texte)
- `en.dragon-ball-official.com` — équivalent EN
- `bandainamcoent.eu` — sitemaps `/content/sitemap.xml` et `/news/sitemap.xml`

## Tech stacks détectés (`bunlight detect`)

Voir `detect/*.json`. Highlights :
- DB Official : Wordpress + jQuery (legacy ~2018)
- Bandai Namco : Next.js + Strapi headless
- Shueisha : custom PHP + Nginx
- Fandom : MediaWiki + Wikia

## Pistes d'intégration légitimes pour DBFR

1. **News agrégateur** : crawler les sitemaps DB Official + Bandai, afficher titre/date + lien sortant (pas le contenu) → "Actualités Dragon Ball" sur `/actualites`
2. **Wiki personnages enrichi** : merger dragonball-api.com (déjà fait) + Fandom MediaWiki API pour les descriptions FR avec attribution CC-BY-SA visible
3. **Calendrier sortie anime/manga** : Jikan `/seasons/upcoming` filtré DB
4. **Tropees posters** : Kitsu posterImage en attribution
5. **Affiliés shop** : liens sortants vers dbz-store / shop.toei pour monétisation propre

## Ce que je n'ai PAS téléchargé (volontairement)

- Aucun asset image © Bandai / Shueisha / Toei
- Aucun scan manga Shonen Jump+
- Aucun still anime Crunchyroll/Viz
- Aucun catalogue produit dbz-store

Les images sur le site DBFR doivent venir :
- de `dragonball-api.com` (déjà en place, leur CDN auto-hébergé)
- d'uploads admin manuels avec sources tracées (table `posts.cover`)
- des avatars Discord (déjà OK)

Si tu veux pousser plus loin sur la partie agrégation news : je peux écrire un cron qui consomme les sitemaps DB Official quotidiennement et alimente une table `db_news` (titre, date, lien, source) — strictement métadonnées + lien sortant, légal.


---

<a name="reference-db-recon-bandai-snapshots-en-bandainamcoent-eu_dragon-ball_dragon-ball-sparking-zero-md"></a>
## 📄 Fichier : `reference/db-recon/bandai-snapshots/en.bandainamcoent.eu_dragon-ball_dragon-ball-sparking-zero.md`

**Titre original :** Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

### Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

Date: 2026-05-16 14:43 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 15748 (15 KB)
- **goto duration**: 345 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `QPyW3dJoP9t9ofIfbxltKshT5U_91i1GLle8nZGIAaJPKHvuHbs4rA==`
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

### script (2)

- https://p325k7wa.twic.pics/?v1&amp;anticipation=0.5
- https://en.bandainamcoent.eu/sites/default/files/js/js_ZvUeuHVpBFilQ_ZkT2Bh3PLxA-jqXXUXI3KlmhA-uG4.js?scope=header&amp;delta=0&amp;language=en&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof

## CSS selectors (3081 total) — sample top 50

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
/* ... 3031 more (use --snapshot-dir to dump full list) */
```

## Screenshot

PNG 10,704 bytes saved to `bandai-snapshots/en.bandainamcoent.eu_dragon-ball_dragon-ball-sparking-zero/screenshot.png`


---

<a name="reference-db-recon-bandai-snapshots-en-bandainamcoent-eu_dragon-ball_dragon-ball-z-kakarot-md"></a>
## 📄 Fichier : `reference/db-recon/bandai-snapshots/en.bandainamcoent.eu_dragon-ball_dragon-ball-z-kakarot.md`

**Titre original :** Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot

### Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot

Date: 2026-05-16 14:43 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 14976 (15 KB)
- **goto duration**: 441 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `w9FYaES9jUX9aGno7hohW0p0LcXbbH9NYFbNmzQaDhWJkQJVWSELzg==`
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

### script (2)

- https://p325k7wa.twic.pics/?v1&amp;anticipation=0.5
- https://en.bandainamcoent.eu/sites/default/files/js/js_ZvUeuHVpBFilQ_ZkT2Bh3PLxA-jqXXUXI3KlmhA-uG4.js?scope=header&amp;delta=0&amp;language=en&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof

## CSS selectors (3081 total) — sample top 50

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
/* ... 3031 more (use --snapshot-dir to dump full list) */
```

## Screenshot

PNG 10,704 bytes saved to `bandai-snapshots/en.bandainamcoent.eu_dragon-ball_dragon-ball-z-kakarot/screenshot.png`


---

<a name="reference-db-recon-bandai-snapshots-fr-bandainamcoent-eu_dragon-ball-md"></a>
## 📄 Fichier : `reference/db-recon/bandai-snapshots/fr.bandainamcoent.eu_dragon-ball.md`

**Titre original :** Recon report — https://fr.bandainamcoent.eu/dragon-ball

### Recon report — https://fr.bandainamcoent.eu/dragon-ball

Date: 2026-05-16 14:43 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 12515 (12 KB)
- **goto duration**: 363 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `Mvby3Dnny2KHapNaRD65m9DGENT_vXDMfrhkz1dek_0vhPKGU5A4cQ==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (12 total)

| Host | Asset count |
|---|---|
| `cdn.jsdelivr.net` | 8 |
| `fr.bandainamcoent.eu` | 3 |
| `p325k7wa.twic.pics` | 1 |

### stylesheet (10)

- https://fr.bandainamcoent.eu/sites/default/files/css/css_XnNWnRMednqhlRzkeyRN_EuoSIGno-NcssuMz3b085s.css?delta=0&amp;language=fr&amp;theme=bne_main&amp;include=eJx1jFFuwzAMQy_kWcAuZMgxE7iwo9SS06Wnb5atQ4F0P6TERynOCIPUKjP9mBukgVLrCxefMheZ3OXa0bbQc-BusveWAgO9Lu7a853UtgJ1uqmhUmSFW3OCBNSIFMaMkqhBF5k1r_g44F7BTelQXyX1AndDHKVV-nXPF_46hSiomM0ntvPFH4RxLupNpunN42etQpWn_7nuw2CfJ_4tzzBEEVNrvNApeQCB6o0W
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/css/bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.4.0/8.x-3.x/drupal-bootstrap.min.css
- https://fr.bandainamcoent.eu/sites/default/files/css/css_rK4jhT2bdSNylljCKVapcrV40lkltQk4mi-Z5toM1k8.css?delta=9&amp;language=fr&amp;theme=bne_main&amp;include=eJx1jFFuwzAMQy_kWcAuZMgxE7iwo9SS06Wnb5atQ4F0P6TERynOCIPUKjP9mBukgVLrCxefMheZ3OXa0bbQc-BusveWAgO9Lu7a853UtgJ1uqmhUmSFW3OCBNSIFMaMkqhBF5k1r_g44F7BTelQXyX1AndDHKVV-nXPF_46hSiomM0ntvPFH4RxLupNpunN42etQpWn_7nuw2CfJ_4tzzBEEVNrvNApeQCB6o0W

### script (2)

- https://p325k7wa.twic.pics/?v1&amp;anticipation=0.5
- https://fr.bandainamcoent.eu/sites/default/files/js/js_ZvUeuHVpBFilQ_ZkT2Bh3PLxA-jqXXUXI3KlmhA-uG4.js?scope=header&amp;delta=0&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkOGOwyAIgF-o0eReiKAy56JihHa3t197vestm8v-AH4fCYirBJ5L4Wr3NLlKBFGL_SvMJrAGGaiAihlv1AeOFqq6cyHs_gzYkn16A87K64CWSWlyzCrasdmjgtYJUk36IBs3XraZB1HmrKlNnjvZ0OeG2YSEmaPBC35PS6Kr2J-4gyu5E_dif_MYUqay_sEEUkxZjOBCH5uUY8zv2wqJYHzvZS28ftBfL34LQ2i2A8OJ_SxjL7MrSYGrP5aC_8O-kDs759s9

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

## Screenshot

PNG 10,704 bytes saved to `bandai-snapshots/fr.bandainamcoent.eu_dragon-ball/screenshot.png`


---

<a name="reference-db-recon-recon-wide-dragonball-api-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/dragonball-api.com.md`

**Titre original :** Recon report — https://dragonball-api.com/

### Recon report — https://dragonball-api.com/

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 404
- **Body bytes**: 95 (0 KB)
- **goto duration**: 34 ms
- **Server**: `n/a`
- **X-Powered-By**: `Express`
- **Content-Type**: `application/json; charset=utf-8`
- **CDN fingerprint**: unknown
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `max-age=864000`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (0 total)

| Host | Asset count |
|---|---|

## CSS selectors (0 total) — sample top 50

```css
```


---

<a name="reference-db-recon-recon-wide-dragonball-multiverse-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/dragonball-multiverse.com.md`

**Titre original :** Recon report — https://dragonball-multiverse.com/

### Recon report — https://dragonball-multiverse.com/

Date: 2026-05-16 14:26 UTC
Final URL: https://www.dragonball-multiverse.com/
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 7989 (8 KB)
- **goto duration**: 170 ms
- **Server**: `Apache/2.4.62 (Debian)`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: apache/2.4.62 (debian)
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `n/a`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (51 total)

| Host | Asset count |
|---|---|
| `dragonball-multiverse.com` | 48 |
| `www.dragonball-multiverse.com` | 1 |
| `ajax.googleapis.com` | 1 |
| `www.googletagmanager.com` | 1 |

### stylesheet (1)

- https://www.dragonball-multiverse.com/phoenix-splash-76128777.css

### script (2)

- https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
- https://www.googletagmanager.com/gtag/js?id=UA-7029683-1

### image (48)

- https://dragonball-multiverse.com/design/splash2/db1.png
- https://dragonball-multiverse.com/design/splash2/db2.png
- https://dragonball-multiverse.com/design/splash2/db3.png
- https://dragonball-multiverse.com/design/splash2/db4.png
- https://dragonball-multiverse.com/design/splash2/db5.png
- https://dragonball-multiverse.com/design/splash2/db6.png
- https://dragonball-multiverse.com/design/splash2/db7.png
- https://dragonball-multiverse.com/design/splash2/txt-db.png
- https://dragonball-multiverse.com/design/splash2/txt-mult.png
- https://dragonball-multiverse.com/design/index/en.png
- https://dragonball-multiverse.com/design/index/fr.png
- https://dragonball-multiverse.com/design/index/es.png
- https://dragonball-multiverse.com/design/index/it.png
- https://dragonball-multiverse.com/design/index/pt_BR.png
- https://dragonball-multiverse.com/design/index/de.png
- https://dragonball-multiverse.com/design/index/es_CO.png
- https://dragonball-multiverse.com/design/index/ct_CT.png
- https://dragonball-multiverse.com/design/index/pl.png
- https://dragonball-multiverse.com/design/index/pt.png
- https://dragonball-multiverse.com/design/index/jp.png
- _... 28 more_

## CSS selectors (79 total) — sample top 50

```css
#debug_messages {}
#debug_messages>div {}
#debug_messages>h4 {}
#discl {}
#langs {}
#langs img {}
#langs>a {}
#langs>a::after {}
#splash {}
#splash>div {}
#splash>div>div {}
#splash>div>div #db1 {}
#splash>div>div #db2 {}
#splash>div>div #db3 {}
#splash>div>div #db4 {}
#splash>div>div #db5 {}
#splash>div>div #db6 {}
#splash>div>div #db7 {}
#splash>div>div #txtdb {}
#splash>div>div #txtmult {}
#splash>div>div>img {}
#splash>div>div>img.flotte {}
#splash>div>div>img.txt {}
#splash>h1 {}
*[desktop] {}
*[dont-print] {}
*[mobile] {}
*[nodesktop] {}
*[nomobile] {}
.center {}
.dbm_quick_popup {}
.left {}
.myflex {}
.myprintr span {}
.myprintr span.ak {}
.right {}
.simplemodal-container {}
.small {}
.spacer {}
.txt_Balsamiq {}
.txt_Balsamiq-UC {}
.txt_Balsamiq-small {}
.txt_Bangers {}
.txt_Carter-One {}
.txt_Fira-Sans-Condensed {}
.txt_Gochi-Hand {}
.txt_Gochi-Hand-UC {}
.txt_Kalam {}
.txt_Kalam-UC {}
.txt_Kalam-UC>.balloon {}
/* ... 29 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-wide-dragonball-fandom-com_fr_wiki_wiki_dragon_ball-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/dragonball.fandom.com_fr_wiki_Wiki_Dragon_Ball.md`

**Titre original :** Recon report — https://dragonball.fandom.com/fr/wiki/Wiki_Dragon_Ball

### Recon report — https://dragonball.fandom.com/fr/wiki/Wiki_Dragon_Ball

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 403
- **Body bytes**: 5633 (6 KB)
- **goto duration**: 51 ms
- **Server**: `cloudflare`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: Cloudflare
- **Trace/Ray ID**: `9fcb0e82cdb1e7b4-FRA`
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

<a name="reference-db-recon-recon-wide-dragonball-fandom-com_ja_wiki__e3_83_89_e3_83_a9_e3_82_b4_e3_83_b3_e3_-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/dragonball.fandom.com_ja_wiki__E3_83_89_E3_83_A9_E3_82_B4_E3_83_B3_E3_.md`

**Titre original :** Recon report — https://dragonball.fandom.com/ja/wiki/%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%AB%E5%85%AC%E5%BC%8F%E3%82%B5%E3%82%A4%E3%83%88

### Recon report — https://dragonball.fandom.com/ja/wiki/%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%AB%E5%85%AC%E5%BC%8F%E3%82%B5%E3%82%A4%E3%83%88

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 403
- **Body bytes**: 6037 (6 KB)
- **goto duration**: 65 ms
- **Server**: `cloudflare`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: Cloudflare
- **Trace/Ray ID**: `9fcb0e82cee8dcae-FRA`
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

<a name="reference-db-recon-recon-wide-dragonball-fandom-com_wiki_dragon_ball_wiki-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/dragonball.fandom.com_wiki_Dragon_Ball_Wiki.md`

**Titre original :** Recon report — https://dragonball.fandom.com/wiki/Dragon_Ball_Wiki

### Recon report — https://dragonball.fandom.com/wiki/Dragon_Ball_Wiki

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 403
- **Body bytes**: 5624 (5 KB)
- **goto duration**: 74 ms
- **Server**: `cloudflare`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: Cloudflare
- **Trace/Ray ID**: `9fcb0e82de9d69a3-FRA`
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

<a name="reference-db-recon-recon-wide-en-bandainamcoent-eu_dragon-ball_dragon-ball-fighterz-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/en.bandainamcoent.eu_dragon-ball_dragon-ball-fighterz.md`

**Titre original :** Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-fighterz

### Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-fighterz

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 255848 (250 KB)
- **goto duration**: 532 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `Uu_n5GnxdqGGWT3nET6IteTzr9Z6DZT1btFZ264xOcvtHaLqY5_Bcw==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (95 total)

| Host | Asset count |
|---|---|
| `` | 69 |
| `en.bandainamcoent.eu` | 9 |
| `cdn.jsdelivr.net` | 9 |
| `static.bandainamcoent.eu` | 6 |
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

### image (76)

- image:/high/dragon-ball/dragonball-fighters-z/00-page-setup/dbfz_banner.jpg
- image:/high/dragon-ball/dragonball-fighters-z/00-page-setup/new/dbfz_biglogo.png
- image:/high/dragon-ball/dragonball-fighters-z/00-page-setup/dbfz_game-thumbnail.jpg
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-fighters-z/01-videos/31-dbfz_launch.jpg
- image:/high/dragon-ball/dragonball-fighters-z/00-page-setup/new/dbfz_awardsbanner_mobile.jpg
- image:/high/dragon-ball/dragonball-fighters-z/00-page-setup/new/dbfz_kf01.png
- https://static.bandainamcoent.eu/s3fs-public/inline-images/dbfz_iconball_1.png
- image:/high/dragon-ball/dragonball-fighters-z/00-page-setup/new/dbfz_kf02.png
- https://static.bandainamcoent.eu/s3fs-public/inline-images/dbfz_iconball_2.png
- image:/high/dragon-ball/dragonball-fighters-z/00-page-setup/new/dbfz_kf04.png
- https://static.bandainamcoent.eu/s3fs-public/inline-images/dbfz_iconball_3.png
- image:/high/dragon-ball/dragonball-fighters-z/00-page-setup/new/dbfz_kf03.png
- https://static.bandainamcoent.eu/s3fs-public/inline-images/dbfz_iconball_4.png
- image:/high/dragon-ball/dragonball-fighters-z/00-page-setup/new/dbfz_kf03new.png
- https://static.bandainamcoent.eu/s3fs-public/inline-images/dbfz_iconball_5.png
- image:/high/dragon-ball/dragonball-fighters-z/04-retailers/dbfz_fighterz-edition.jpg
- image:/high/dragon-ball/dragonball-fighters-z/00-page-setup/new/dbfz_standardedition.jpg
- image:/high/dragon-ball/dragonball-fighters-z/04-retailers/dbfz_ultimate-edition3.jpg
- image:/high/dragon-ball/dragonball-fighters-z/03-news/DBFZ-CacheThumbnail.png
- image:/high/dragon-ball/dragonball-fighters-z/03-news/DBFZ-Goku-SS4-DAIMA.jpg
- _... 56 more_

### iframe (1)

- https://www.youtube-nocookie.com/embed/1Jtmbe-wYXo?autoplay=0&amp;start=0&amp;rel=0&amp;mute=0

## CSS selectors (3097 total) — sample top 50

```css
#block-views-block-block-news-title-block-1 .arrow {}
#block-views-block-block-news-title-block-1 .view-block-news-title .result .slick-slide:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .news-exposed:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .slick-slide.slick-current.slick-active .news-exposed {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line .key-feature-description .field--name-field-catch-phrase {}
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
.alert-info a:hover {}
.alert-info hr {}
/* ... 3047 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-wide-en-bandainamcoent-eu_dragon-ball_dragon-ball-sparking-zero-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/en.bandainamcoent.eu_dragon-ball_dragon-ball-sparking-zero.md`

**Titre original :** Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

### Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 232023 (227 KB)
- **goto duration**: 596 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `DHpXc5w_piuNlILTC8PBPRDAbfbDQbaoxvFpwvB7CJLUoooumg047Q==`
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

<a name="reference-db-recon-recon-wide-en-bandainamcoent-eu_dragon-ball_dragon-ball-the-breakers-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/en.bandainamcoent.eu_dragon-ball_dragon-ball-the-breakers.md`

**Titre original :** Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-the-breakers

### Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-the-breakers

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 209677 (205 KB)
- **goto duration**: 486 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `s0f_ohXuWwBxiCOP9xgtRSrBKGeqYGvKF0uex8br0dPWCWuEPt1dNA==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (70 total)

| Host | Asset count |
|---|---|
| `` | 38 |
| `static.bandainamcoent.eu` | 12 |
| `en.bandainamcoent.eu` | 9 |
| `cdn.jsdelivr.net` | 9 |
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

### image (51)

- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-the-breakers/00-page-setup/dbtb-logo-white.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-the-breakers/00-page-setup/dbtb-logo-white.png
- image:/high/dragon-ball/dragon-ball-the-breakers/00-page-setup/dbtb-header-desktop-new.jpg
- image:/high/dragon-ball/dragon-ball-the-breakers/00-page-setup/dbtb-logo-white.png
- image:/high/dragon-ball/dragon-ball-the-breakers/00-page-setup/dbtb-header-mobile.jpg
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-the-breakers/05-page-extension/decorations/dbtb_decoration_1_white.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-the-breakers/05-page-extension/decorations/dbtb_decoration_1_white_B.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-the-breakers/01-news/dbtb-announcement-thumbnail.jpg
- image:/high/dragon-ball/dragon-ball-the-breakers/00-page-setup/dbtb-new-KF1.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-the-breakers/05-page-extension/decorations/dbtb_decoration_1_white.png
- image:/high/dragon-ball/dragon-ball-the-breakers/00-page-setup/dbtb-new-KF2.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-the-breakers/05-page-extension/decorations/dbtb_decoration_1_orange_B.png
- image:/high/dragon-ball/dragon-ball-the-breakers/00-page-setup/dbtb-new-KF3.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-the-breakers/05-page-extension/decorations/dbtb_decoration_1_white.png
- image:/high/dragon-ball/dragon-ball-the-breakers/00-page-setup/dbtb-new-KF4.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-the-breakers/05-page-extension/decorations/dbtb_decoration_1_orange_B.png
- image:/high/dragon-ball/dragon-ball-the-breakers/00-page-setup/dbtb-new-KF5.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragon-ball-the-breakers/05-page-extension/decorations/dbtb_decoration_1_white.png
- image:/high/dragon-ball/dragon-ball-the-breakers/04-retailers/dbtb_standard_EN.jpg
- image:/high/dragon-ball/dragon-ball-the-breakers/04-retailers/dbtb_special_EN.jpg
- _... 31 more_

### iframe (1)

- https://www.youtube-nocookie.com/embed/mYv-c7GaT4k?autoplay=0&amp;start=0&amp;rel=0&amp;mute=0

## CSS selectors (3104 total) — sample top 50

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
/* ... 3054 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-wide-en-bandainamcoent-eu_dragon-ball_dragon-ball-xenoverse-2-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/en.bandainamcoent.eu_dragon-ball_dragon-ball-xenoverse-2.md`

**Titre original :** Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-xenoverse-2

### Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-xenoverse-2

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 272048 (266 KB)
- **goto duration**: 564 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `U08ce5ewo67_JM2d_CseaE46aZCCZuq3wXNDf9WdqsFuQTVWhNpzYQ==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (106 total)

| Host | Asset count |
|---|---|
| `` | 70 |
| `static.bandainamcoent.eu` | 15 |
| `en.bandainamcoent.eu` | 9 |
| `cdn.jsdelivr.net` | 9 |
| `p325k7wa.twic.pics` | 1 |
| `static.sta.bandainamcoent.eu` | 1 |
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

### image (87)

- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/new/dbxv2-logobig.jpg.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/new/dbxv2-logobig.jpg.png
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/dbxv2_banner.jpg
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/new/dbxv2-logobig.jpg.png
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/dbxv2_game-thumbnail.jpg
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/revamp/DBXV2-decoration-4.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/new/game-pass-logos.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/revamp/DBXV2-decoration-5.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/dbxv2_game-thumbnail.jpg
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/new/dbxv2-kf01.jpg
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/new/dbxv2-kf02.jpg
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/new/dbxv2-kf03.jpg
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/new/dbxv2-kf04.jpg
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/new/dbxv2-kf05.jpg
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/new/dbxv2-kf06.jpg.png
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/character-gallery/32-Mentors-will%20train-you.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/revamp/DBXV2-decoration-4.png
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/character-gallery/The-Saiyans.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/revamp/DBXV2-decoration-4.png
- image:/high/dragon-ball/dragonball-xenoverse-2/00-page-setup/character-gallery/Defenders-of-the-Earth-2.png
- _... 67 more_

### iframe (1)

- https://www.youtube-nocookie.com/embed/JnUbg-9v_bE?autoplay=0&amp;start=0&amp;rel=0&amp;mute=0

## CSS selectors (3103 total) — sample top 50

```css
#block-views-block-block-news-title-block-1 .arrow {}
#block-views-block-block-news-title-block-1 .view-block-news-title .result .slick-slide:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .news-exposed:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .slick-slide.slick-current.slick-active .news-exposed {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line .key-feature-description .field--name-field-catch-phrase {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line:nth-of-type(2n) .key-feature-description .field--name-field-catch-phrase {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line:nth-of-type(odd) .key-feature-description .field--name-field-catch-phrase {}
#block-views-block-discover-brand-block-1 .view-discover-brand .view-content .field-content .discover_link_brand a:hover {}
#block-views-block-galerie-personnages-block-1 .view-galerie-personnages .view-content .views-row.slick-current .content {}
#block-views-block-galerie-personnages-block-1 .view-galerie-personnages .view-content .views-row.slick-current .content::before {}
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
/* ... 3053 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-wide-en-bandainamcoent-eu_dragon-ball_dragon-ball-z-kakarot-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/en.bandainamcoent.eu_dragon-ball_dragon-ball-z-kakarot.md`

**Titre original :** Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot

### Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 242161 (236 KB)
- **goto duration**: 324 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `OXaPahTQIfniKRhr6N4wJO5EbNTdt2EOMc0v7Q59ylrQj5c38lUUnQ==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (83 total)

| Host | Asset count |
|---|---|
| `` | 60 |
| `en.bandainamcoent.eu` | 9 |
| `cdn.jsdelivr.net` | 9 |
| `static.bandainamcoent.eu` | 3 |
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

### image (64)

- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_logo.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_logo.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_banner_final.jpg
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_logo.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_game-thumbnail.jpg
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-project-z/03-News/dbzk_dlc6_thumbnail.jpg
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_quotes_mobile.jpg
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kf02bis.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kf02ter.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kfdriving.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kfDBcards.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_game-thumbnail.jpg
- image:/high/dragon-ball/dragonball-project-z/04-retailers/dbzk-daima-edition.jpg
- image:/high/dragon-ball/dragonball-project-z/04-retailers/dbzk-master-edition.jpg
- image:/2026-01/DBZ-Kakarot-10M.jpg
- image:/2025-12/DBZK-DLC-8-Battle-PV-Thumbnail-EN.png
- image:/high/dragon-ball/dragonball-project-z/03-News/DBZK-DAIMA-P1-Launch.png
- image:/high/dragon-ball/dragonball-daima/01-news/DBZK-DAIMA-PART-1-Release-Date-PV-Thumbnail-EN.jpg
- image:/2026-01/DBZ-Kakarot-10M.jpg
- image:/2025-12/DBZK-DLC-8-Battle-PV-Thumbnail-EN.png
- _... 44 more_

### iframe (1)

- https://www.youtube-nocookie.com/embed/HQrYS2ndO3E?autoplay=0&amp;start=0&amp;rel=0&amp;mute=0

## CSS selectors (3101 total) — sample top 50

```css
#block-views-block-block-news-title-block-1 .arrow {}
#block-views-block-block-news-title-block-1 .view-block-news-title .result .slick-slide:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .news-exposed:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .slick-slide.slick-current.slick-active .news-exposed {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line .key-feature-description .field--name-field-catch-phrase {}
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
.alert-info a:hover {}
.alert-info hr {}
/* ... 3051 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-wide-en-dragon-ball-official-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/en.dragon-ball-official.com.md`

**Titre original :** Recon report — https://en.dragon-ball-official.com/

### Recon report — https://en.dragon-ball-official.com/

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 22373 (22 KB)
- **goto duration**: 1696 ms
- **Server**: `nginx`
- **X-Powered-By**: `PHP/8.1.29`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `LE_mdx2zDZfMiOPSyZskP0eyb5t9IeWqpOgmhZPtW2uty1-RqsiAMw==`
- **Cache-Control**: `no-cache, private`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (42 total)

| Host | Asset count |
|---|---|
| `en.dragon-ball-official.com` | 37 |
| `platform.twitter.com` | 2 |
| `www.googletagmanager.com` | 2 |
| `cdn.cookielaw.org` | 1 |

### script (15)

- https://cdn.cookielaw.org/scripttemplates/otSDKStub.js
- https://platform.twitter.com/widgets.js
- https://platform.twitter.com/widgets.js
- https://en.dragon-ball-official.com/assets/js/jquery-3.5.0.min.js
- https://en.dragon-ball-official.com/assets/js/Jquery.mysuggest.js
- https://en.dragon-ball-official.com/assets/js/en.TextShortCut.js
- https://en.dragon-ball-official.com/assets/js/modaal.min.js
- https://en.dragon-ball-official.com/assets/js/TweenMax.js
- https://en.dragon-ball-official.com/assets/js/jquery.inview.min.js
- https://en.dragon-ball-official.com/assets/js/simplebar.min.js
- https://en.dragon-ball-official.com/assets/js/shared.js
- https://en.dragon-ball-official.com/assets/js/project.js
- https://en.dragon-ball-official.com/assets/js/swiper.js
- https://en.dragon-ball-official.com/assets/js/core.js
- https://en.dragon-ball-official.com/assets/js/common.js

### image (25)

- https://en.dragon-ball-official.com/assets/img/intro/icon_ball.png
- https://en.dragon-ball-official.com/assets/img/shared/icon_x.png
- https://en.dragon-ball-official.com/assets/img/shared/logo_title.png
- https://en.dragon-ball-official.com/dragonball/en/banner/2026/05/NzjQynBgjprtuGQF/X_0509_1200_675_EN_v5.jpg
- https://en.dragon-ball-official.com/assets/img/top/indicator.png
- https://en.dragon-ball-official.com/dragonball/en/banner/2026/01/LuldJXPpTwEtW4pC/DBOS_770_404_en.jpg
- https://en.dragon-ball-official.com/assets/img/top/indicator.png
- https://en.dragon-ball-official.com/dragonball/en/banner/2026/01/FgJ133jN8qGwFooU/yoko_RGB_en.jpg
- https://en.dragon-ball-official.com/assets/img/top/indicator.png
- https://en.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://en.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://en.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://en.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://en.dragon-ball-official.com/assets/img/top/anime_super_banner.jpg
- https://en.dragon-ball-official.com/assets/img/top/battle2026_banner.jpg
- https://en.dragon-ball-official.com/assets/img/top/store_banner.png
- https://en.dragon-ball-official.com/assets/img/top/daima_banner.jpg
- https://en.dragon-ball-official.com/assets/img/top/bn08.jpg
- https://en.dragon-ball-official.com/assets/img/top/squadra_banner.png
- https://en.dragon-ball-official.com/assets/img/top/bn06.png
- _... 5 more_

### iframe (2)

- https://www.googletagmanager.com/ns.html?id=GTM-TW3DK5K
- https://www.googletagmanager.com/ns.html?id=GTM-TCJ83M8

## CSS selectors (0 total) — sample top 50

```css
```


---

<a name="reference-db-recon-recon-wide-fr-bandainamcoent-eu_dragon-ball_dragon-ball-sparking-zero-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/fr.bandainamcoent.eu_dragon-ball_dragon-ball-sparking-zero.md`

**Titre original :** Recon report — https://fr.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

### Recon report — https://fr.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 232926 (227 KB)
- **goto duration**: 213 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `TZ0GjY6nnLpNtzV0slXL2DqsuH25X60N6ysYGI3JY3cIpaNEmBkZmg==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (76 total)

| Host | Asset count |
|---|---|
| `` | 48 |
| `fr.bandainamcoent.eu` | 9 |
| `cdn.jsdelivr.net` | 9 |
| `static.bandainamcoent.eu` | 8 |
| `p325k7wa.twic.pics` | 1 |
| `www.youtube-nocookie.com` | 1 |

### stylesheet (10)

- https://fr.bandainamcoent.eu/sites/default/files/css/css_XBoVHYZE8IfVKrOc4e5gK-PKirwU8VrvHcg5bwgNYQE.css?delta=0&amp;language=fr&amp;theme=bne_main&amp;include=eJx1UO1OBCEMfCGExBciZZnjuADlaLkPn951ddVk9c9MOzNtmgaoYng8OguiP-WytuISGgYVExr8wrVyc59kFh5wccxOxcZMhZO5XCfG08_saSqvuV6gcL8b02lQGtTPsg__KHa2PkPJckY015nfnOizQIw8RVFdIIG55Qj2qGG7EiW6AencJN_wsplrBHdxG9rKcRaYO8KJR3VfbOlCj4OIgoqmNpIeJ75NKOUiVjmlPxbvsQoRSv_7shaLvh78D9hFH5hVdP2NOyjv7EqpuA
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/css/bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.4.0/8.x-3.x/drupal-bootstrap.min.css
- https://fr.bandainamcoent.eu/sites/default/files/css/css_rK4jhT2bdSNylljCKVapcrV40lkltQk4mi-Z5toM1k8.css?delta=9&amp;language=fr&amp;theme=bne_main&amp;include=eJx1UO1OBCEMfCGExBciZZnjuADlaLkPn951ddVk9c9MOzNtmgaoYng8OguiP-WytuISGgYVExr8wrVyc59kFh5wccxOxcZMhZO5XCfG08_saSqvuV6gcL8b02lQGtTPsg__KHa2PkPJckY015nfnOizQIw8RVFdIIG55Qj2qGG7EiW6AencJN_wsplrBHdxG9rKcRaYO8KJR3VfbOlCj4OIgoqmNpIeJ75NKOUiVjmlPxbvsQoRSv_7shaLvh78D9hFH5hVdP2NOyjv7EqpuA

### script (8)

- https://p325k7wa.twic.pics/?v1&amp;anticipation=0.5
- https://fr.bandainamcoent.eu/sites/default/files/js/js_ZvUeuHVpBFilQ_ZkT2Bh3PLxA-jqXXUXI3KlmhA-uG4.js?scope=header&amp;delta=0&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://fr.bandainamcoent.eu/core/assets/vendor/jquery/jquery.min.js?v=4.0.0
- https://fr.bandainamcoent.eu/sites/default/files/js/js_eBtwxUeXUZeKuGiR8iJp9LTI9I1Q13lfPCKaA9emXG8.js?scope=header&amp;delta=2&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://fr.bandainamcoent.eu/modules/contrib/webform/js/webform.form.auto_focus.js?teyred
- https://fr.bandainamcoent.eu/sites/default/files/js/js_zzLKmcd5j6YXnJR1x1zv8W6Nb-X4J7qRKCBN_5pmDpc.js?scope=footer&amp;delta=0&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/js/bootstrap.min.js
- https://fr.bandainamcoent.eu/sites/default/files/js/js_lPKk7FfeiFiVM1cK39vyFpfomOmNdJVjXZ2aSHmq7_c.js?scope=footer&amp;delta=2&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof

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
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/DBSZ_AVAILABLENOW_FR.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/dbsz-deluxe-FR.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/dbsz-ultimate-fr.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/dbsz-collector-premium/dbsz-collector-premium-FR.jpg
- _... 37 more_

### iframe (1)

- https://www.youtube-nocookie.com/embed/-FHlm6qDHKc?autoplay=0&amp;start=0&amp;rel=0&amp;mute=0

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

<a name="reference-db-recon-recon-wide-fr-bandainamcoent-eu_dragon-ball_dragon-ball-z-kakarot-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/fr.bandainamcoent.eu_dragon-ball_dragon-ball-z-kakarot.md`

**Titre original :** Recon report — https://fr.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot

### Recon report — https://fr.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 243751 (238 KB)
- **goto duration**: 431 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `cOSDesm4B-_F35m80KiklfE8ZBvbApoN5d8z1YIQNXt_Y85p-htrqg==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (83 total)

| Host | Asset count |
|---|---|
| `` | 60 |
| `fr.bandainamcoent.eu` | 9 |
| `cdn.jsdelivr.net` | 9 |
| `static.bandainamcoent.eu` | 3 |
| `p325k7wa.twic.pics` | 1 |
| `www.youtube-nocookie.com` | 1 |

### stylesheet (10)

- https://fr.bandainamcoent.eu/sites/default/files/css/css_XBoVHYZE8IfVKrOc4e5gK-PKirwU8VrvHcg5bwgNYQE.css?delta=0&amp;language=fr&amp;theme=bne_main&amp;include=eJx1UO1OBCEMfCGExBciZZnjuADlaLkPn951ddVk9c9MOzNtmgaoYng8OguiP-WytuISGgYVExr8wrVyc59kFh5wccxOxcZMhZO5XCfG08_saSqvuV6gcL8b02lQGtTPsg__KHa2PkPJckY015nfnOizQIw8RVFdIIG55Qj2qGG7EiW6AencJN_wsplrBHdxG9rKcRaYO8KJR3VfbOlCj4OIgoqmNpIeJ75NKOUiVjmlPxbvsQoRSv_7shaLvh78D9hFH5hVdP2NOyjv7EqpuA
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/css/bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.4.0/8.x-3.x/drupal-bootstrap.min.css
- https://fr.bandainamcoent.eu/sites/default/files/css/css_rK4jhT2bdSNylljCKVapcrV40lkltQk4mi-Z5toM1k8.css?delta=9&amp;language=fr&amp;theme=bne_main&amp;include=eJx1UO1OBCEMfCGExBciZZnjuADlaLkPn951ddVk9c9MOzNtmgaoYng8OguiP-WytuISGgYVExr8wrVyc59kFh5wccxOxcZMhZO5XCfG08_saSqvuV6gcL8b02lQGtTPsg__KHa2PkPJckY015nfnOizQIw8RVFdIIG55Qj2qGG7EiW6AencJN_wsplrBHdxG9rKcRaYO8KJR3VfbOlCj4OIgoqmNpIeJ75NKOUiVjmlPxbvsQoRSv_7shaLvh78D9hFH5hVdP2NOyjv7EqpuA

### script (8)

- https://p325k7wa.twic.pics/?v1&amp;anticipation=0.5
- https://fr.bandainamcoent.eu/sites/default/files/js/js_ZvUeuHVpBFilQ_ZkT2Bh3PLxA-jqXXUXI3KlmhA-uG4.js?scope=header&amp;delta=0&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://fr.bandainamcoent.eu/core/assets/vendor/jquery/jquery.min.js?v=4.0.0
- https://fr.bandainamcoent.eu/sites/default/files/js/js_eBtwxUeXUZeKuGiR8iJp9LTI9I1Q13lfPCKaA9emXG8.js?scope=header&amp;delta=2&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://fr.bandainamcoent.eu/modules/contrib/webform/js/webform.form.auto_focus.js?teyred
- https://fr.bandainamcoent.eu/sites/default/files/js/js_zzLKmcd5j6YXnJR1x1zv8W6Nb-X4J7qRKCBN_5pmDpc.js?scope=footer&amp;delta=0&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/js/bootstrap.min.js
- https://fr.bandainamcoent.eu/sites/default/files/js/js_lPKk7FfeiFiVM1cK39vyFpfomOmNdJVjXZ2aSHmq7_c.js?scope=footer&amp;delta=2&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof

### image (64)

- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_logo.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_logo.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_banner_final.jpg
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_logo.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_game-thumbnail.jpg
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-project-z/03-News/dbzk_dlc6_thumbnail.jpg
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_quotes_mobile.jpg
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kf02bis.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kf02ter.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kfdriving.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kfDBcards.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_game-thumbnail.jpg
- image:/high/dragon-ball/dragonball-project-z/04-retailers/dbzk-daima-edition.jpg
- image:/high/dragon-ball/dragonball-project-z/04-retailers/dbzk-master-edition.jpg
- image:/2026-01/DBZ-Kakarot-10M.jpg
- image:/high/dragon-ball/dragonball-project-z/03-News/DBZK-DAIMA-P1-Launch.png
- image:/high/dragon-ball/dragonball-daima/01-news/DBZK-DAIMA-PART-1-Release-Date-PV-Thumbnail-EN.jpg
- image:/high/dragon-ball/dragonball-project-z/03-News/dbzk_mini-doku-daima-thumbnail.jpg
- image:/2026-01/DBZ-Kakarot-10M.jpg
- image:/high/dragon-ball/dragonball-project-z/03-News/DBZK-DAIMA-P1-Launch.png
- _... 44 more_

### iframe (1)

- https://www.youtube-nocookie.com/embed/skomtkGFl44?autoplay=0&amp;start=0&amp;rel=0&amp;mute=0

## CSS selectors (3101 total) — sample top 50

```css
#block-views-block-block-news-title-block-1 .arrow {}
#block-views-block-block-news-title-block-1 .view-block-news-title .result .slick-slide:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .news-exposed:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .slick-slide.slick-current.slick-active .news-exposed {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line .key-feature-description .field--name-field-catch-phrase {}
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
.alert-info a:hover {}
.alert-info hr {}
/* ... 3051 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-wide-fr-dragon-ball-official-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/fr.dragon-ball-official.com.md`

**Titre original :** Recon report — https://fr.dragon-ball-official.com/

### Recon report — https://fr.dragon-ball-official.com/

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 22454 (22 KB)
- **goto duration**: 1966 ms
- **Server**: `nginx`
- **X-Powered-By**: `PHP/8.1.29`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `OtMYf-Go_9Gg6quU7Lex8p4ccOJUZprLaSsSUOSOrKA8FhV7s-jcdw==`
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

<a name="reference-db-recon-recon-wide-kanzenshuu-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/kanzenshuu.com.md`

**Titre original :** Recon report — https://kanzenshuu.com/

### Recon report — https://kanzenshuu.com/

Date: 2026-05-16 14:26 UTC
Final URL: https://www.kanzenshuu.com/
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 146333 (143 KB)
- **goto duration**: 1538 ms
- **Server**: `Sucuri/Cloudproxy`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: sucuri/cloudproxy
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `max-age=600`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (48 total)

| Host | Asset count |
|---|---|
| `www.kanzenshuu.com` | 25 |
| `kanzenshuu.com` | 13 |
| `www.youtube.com` | 5 |
| `fonts.googleapis.com` | 1 |
| `ajax.googleapis.com` | 1 |
| `static.addtoany.com` | 1 |
| `www.googletagmanager.com` | 1 |
| `www.google.com` | 1 |

### stylesheet (9)

- https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700;900&family=Noto+Sans+TC:wght@400;500&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&family=Roboto+Slab:wght@400;600;700;900&display=swap
- https://www.kanzenshuu.com/wp-content/uploads/shadowbox-js/src/shadowbox.css?ver=3.0.3
- https://www.kanzenshuu.com/wp-content/plugins/shadowbox-js/css/extras.css?ver=3.0.3.10
- https://www.kanzenshuu.com/wp-includes/css/dist/block-library/style.min.css?ver=6.9.4
- https://www.kanzenshuu.com/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=6.1.5
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/style.css?ver=1.0.5z
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/responsive.css?ver=1.0.5z
- https://www.kanzenshuu.com/wp-content/plugins/cleaner-gallery/css/gallery.min.css?ver=20130526
- https://www.kanzenshuu.com/wp-content/plugins/add-to-any/addtoany.min.css?ver=1.16

### script (14)

- https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js?ver=6.9.4
- https://static.addtoany.com/menu/page.js
- https://www.kanzenshuu.com/wp-content/plugins/add-to-any/addtoany.min.js?ver=1.1
- https://kanzenshuu.com/wp-content/themes/kanzenshuu3/js/common.js?ver=1.0.3c
- https://kanzenshuu.com/wp-content/themes/kanzenshuu3/js/shadowbox.js?ver=3.0.3
- https://www.googletagmanager.com/gtag/js?id=G-5QJZPJQY43
- https://www.kanzenshuu.com/wp-admin/admin-ajax.php?action=shadowboxjs&amp;cache=c6ed001983bb5ec78517db03635daf22&amp;ver=3.0.3
- https://www.kanzenshuu.com/wp-includes/js/dist/hooks.min.js?ver=dd5603f07f9220ed27f1
- https://www.kanzenshuu.com/wp-includes/js/dist/i18n.min.js?ver=c26c3dc7bed366793375
- https://www.kanzenshuu.com/wp-content/plugins/contact-form-7/includes/swv/js/index.js?ver=6.1.5
- https://www.kanzenshuu.com/wp-content/plugins/contact-form-7/includes/js/index.js?ver=6.1.5
- https://www.google.com/recaptcha/api.js?render=6LdLRu8qAAAAAE5stqQ3-0yGzCniE2MRHJ_bCR80&amp;ver=3.0
- https://www.kanzenshuu.com/wp-includes/js/dist/vendor/wp-polyfill.min.js?ver=3.15.0
- https://www.kanzenshuu.com/wp-content/plugins/contact-form-7/modules/recaptcha/index.js?ver=6.1.5

### image (20)

- https://kanzenshuu.com/wp-content/uploads/2025/01/40th-tribute-super-gallery-oda.png
- https://kanzenshuu.com/wp-content/uploads/2025/01/40th-tribute-super-gallery-oda.png
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/toyotaro_draws_202604b.png
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/fighterz-daima-pack-ending-slide-600x338.png
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/sparking-zero-neo-dlc-unveil-final-slide-600x338.png
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/xv3-live-stream-design-player-male-300x169.jpg
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/xv3-live-stream-design-player-female-300x169.jpg
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/xv3-live-stream-design-bulma-300x169.jpg
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/xv3-live-stream-design-brett-300x169.jpg
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/xv3-reveal-closing-screen-600x338.png
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/battle-hour-gekitou-trailer-freeza-tease-600x338.jpg
- https://kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/footer_logo.png
- https://kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/footer_css3.png
- https://kanzenshuu.com/wp-content/themes/kanzenshuu/images/footer_html5.png
- https://kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/human-made.png
- https://kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/browser-chrome.png
- https://kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/browser-firefox.png
- https://kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/browser-edge.png
- https://kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/browser-safari.png
- https://kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/browser-ie.png

### iframe (5)

- https://www.youtube.com/embed/qTfxD54fMHs?si=CdiwM3QKKmyv9jaY
- https://www.youtube.com/embed/_5Cr9BOt98c?si=th231nr-DDP5bEEe
- https://www.youtube.com/embed/v_Copbn4ASI?si=3jDvJ0m9MSrjzVEn
- https://www.youtube.com/embed/-NekKfJN614?si=buSW2uYpGpWAiq4X
- https://www.youtube.com/embed/gFfh6keadPY?si=KFoaxj86fxWA45oV

## CSS selectors (1072 total) — sample top 50

```css
" i]) {}
#bdd_xc #bb_b {}
#bdd_xc #bb_i {}
#bdd_xc #bb_url {}
#bdd_xc #respond {}
#bdd_xc #respond #format-buttons input {}
#bdd_xc #respond #message {}
#bdd_xc #respond * {}
#bdd_xc #respond .submit-bar {}
#bdd_xc #respond .submit-bar input {}
#bdd_xc #respond input {}
#bdd_xc #respond input:hover {}
#bdd_xc #respond option {}
#bdd_xc #respond select {}
#end-resizable-editor-section {}
#format-buttons {}
#login_logout {}
#login_logout .inputbox {}
#login_logout img.ddavatar {}
#respond .submit-bar {}
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
#xcomment-title {}
#xcomment-title a {}
#xcomment_form {}
.aligncenter {}
.alignright) {}
/* ... 1022 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-wide-shonenjumpplus-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/shonenjumpplus.com.md`

**Titre original :** Recon report — https://shonenjumpplus.com/

### Recon report — https://shonenjumpplus.com/

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 197053 (192 KB)
- **goto duration**: 2885 ms
- **Server**: `nginx`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=utf-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `MJHtscpr6iJDCzo9LwB728bBc-qHxb2EnoMKXaLE_J-5Ccy40lAoaA==`
- **Cache-Control**: `no-cache="Set-Cookie", max-age=41, stale-while-revalidate=10, stale-if-error=60`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (227 total)

| Host | Asset count |
|---|---|
| `cdn-scissors.gigaviewer.com` | 178 |
| `cdn-ak.shonenjumpplus.com` | 37 |
| `shonenjumpplus.com` | 6 |
| `cdn.image.st-hatena.com` | 3 |
| `www.facebook.com` | 2 |
| `www.googletagmanager.com` | 1 |

### stylesheet (2)

- https://cdn-ak.shonenjumpplus.com/css/jump_plus.css?1778825464
- https://cdn-ak.shonenjumpplus.com/css/top_modal.css?1778825464

### script (2)

- https://cdn-ak.shonenjumpplus.com/js/jquery-slick.js?1778825451
- https://cdn-ak.shonenjumpplus.com/js/bundle.js?1778825490

### image (222)

- https://cdn-ak.shonenjumpplus.com/images/user/close-button.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/user/close-button.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/android-icon-144.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/i-attention_black.svg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/close-button.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/i-attention_black.svg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/close-button.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/jump_icon.svg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/user/close-button.png?1778825334
- https://cdn-scissors.gigaviewer.com/image/scale/38f1711b8cba4a5e88018a28b418b88e491a6eb5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589753427855-33a1c244131dc0d9dde3c2f66d033b85%3F1778218043
- https://cdn-scissors.gigaviewer.com/image/scale/38f1711b8cba4a5e88018a28b418b88e491a6eb5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589753427855-33a1c244131dc0d9dde3c2f66d033b85%3F1778218043
- https://cdn-scissors.gigaviewer.com/image/scale/38f1711b8cba4a5e88018a28b418b88e491a6eb5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589753427855-33a1c244131dc0d9dde3c2f66d033b85%3F1778218043
- https://cdn-scissors.gigaviewer.com/image/scale/1ac417ee3bd779f1b98e5da891a81f6071ed85b5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589237822802-412a6bb86d4b09c2c00b56c90dc9932b%3F1777518703
- https://cdn-scissors.gigaviewer.com/image/scale/1ac417ee3bd779f1b98e5da891a81f6071ed85b5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589237822802-412a6bb86d4b09c2c00b56c90dc9932b%3F1777518703
- https://cdn-scissors.gigaviewer.com/image/scale/1ac417ee3bd779f1b98e5da891a81f6071ed85b5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589237822802-412a6bb86d4b09c2c00b56c90dc9932b%3F1777518703
- https://cdn-scissors.gigaviewer.com/image/scale/04172ba78f41f74ea98d0eb1f485e8928541dabc/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107094915128502915-6678cf70f79b92f35b40b4fe27e1fe9d%3F1776138690
- https://cdn-scissors.gigaviewer.com/image/scale/04172ba78f41f74ea98d0eb1f485e8928541dabc/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107094915128502915-6678cf70f79b92f35b40b4fe27e1fe9d%3F1776138690
- https://cdn-scissors.gigaviewer.com/image/scale/04172ba78f41f74ea98d0eb1f485e8928541dabc/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107094915128502915-6678cf70f79b92f35b40b4fe27e1fe9d%3F1776138690
- https://cdn-scissors.gigaviewer.com/image/scale/eec1f65bc3edc063d929b8e2af391adce4380b49/enlarge=0;height=348;no_unsharpmask=1;quality=90;version=1;width=725/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fseries-sub-thumbnail-horizontal-with-logo-2%2F17106567264648152072-35df83d3554b0c566e0f024de283b10d%3F1777261420
- https://cdn-scissors.gigaviewer.com/image/scale/3db4e8e1dd600aa4c7434a72baecf7c8b7389007/enlarge=0;height=482;no_unsharpmask=1;quality=90;version=1;width=482/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fseries-thumbnail%2F17106567264648152072-92ef44ba351388e3b198eb919436e07c%3F1778562244
- _... 202 more_

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

<a name="reference-db-recon-recon-wide-shonenjumpplus-com_episode_3270375685327748452-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/shonenjumpplus.com_episode_3270375685327748452.md`

**Titre original :** Recon report — https://shonenjumpplus.com/episode/3270375685327748452

### Recon report — https://shonenjumpplus.com/episode/3270375685327748452

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 404
- **Body bytes**: 18874 (18 KB)
- **goto duration**: 605 ms
- **Server**: `nginx`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=utf-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `umrCW0r8JSEhi4DKECx8XydaxodIG_UgKak82IxK9Jg1PN4oLDaFQQ==`
- **Cache-Control**: `private`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (22 total)

| Host | Asset count |
|---|---|
| `cdn-ak.shonenjumpplus.com` | 19 |
| `www.facebook.com` | 2 |
| `www.googletagmanager.com` | 1 |

### stylesheet (1)

- https://cdn-ak.shonenjumpplus.com/css/jump_plus.css?1778825464

### script (2)

- https://cdn-ak.shonenjumpplus.com/js/jquery-slick.js?1778825451
- https://cdn-ak.shonenjumpplus.com/js/bundle.js?1778825490

### image (18)

- https://cdn-ak.shonenjumpplus.com/images/user/close-button.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/user/close-button.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/android-icon-144.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/error/error_image.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/jumpplus_white.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/jasrac.jpg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/nex-tone.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/abj-jumpplus.svg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/banner/banner_wj.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/banner/banner_wj_subscription.jpg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/banner/footer_bn02.jpg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/banner/footer_bn03.jpg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/banner/banner_saikyo.jpg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/banner/banner_jump_toon.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/banner/banner_rookie.jpg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/banner/banner_plus.jpg?1778825334
- https://www.facebook.com/tr?id=825312554330154&ev=PageView&noscript=1
- https://www.facebook.com/tr?id=386131638993204&ev=PageView&noscript=1

### iframe (1)

- https://www.googletagmanager.com/ns.html?id=GTM-MQT32T2

## CSS selectors (2759 total) — sample top 50

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
/* ... 2709 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-wide-www-dragonball-jp-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/www.dragonball.jp.md`

**Titre original :** Recon report — https://www.dragonball.jp/

### Recon report — https://www.dragonball.jp/

Date: 2026-05-16 14:26 UTC
Final URL: https://mainsv.com/tf03/
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 111 (0 KB)
- **goto duration**: 2138 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html`
- **CDN fingerprint**: apache
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `n/a`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (0 total)

| Host | Asset count |
|---|---|

## CSS selectors (0 total) — sample top 50

```css
```


---

<a name="reference-db-recon-recon-wide-www-kanzenshuu-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/www.kanzenshuu.com.md`

**Titre original :** Recon report — https://www.kanzenshuu.com/

### Recon report — https://www.kanzenshuu.com/

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 146333 (143 KB)
- **goto duration**: 1026 ms
- **Server**: `Sucuri/Cloudproxy`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: sucuri/cloudproxy
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `max-age=600`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (48 total)

| Host | Asset count |
|---|---|
| `www.kanzenshuu.com` | 38 |
| `www.youtube.com` | 5 |
| `fonts.googleapis.com` | 1 |
| `ajax.googleapis.com` | 1 |
| `static.addtoany.com` | 1 |
| `www.googletagmanager.com` | 1 |
| `www.google.com` | 1 |

### stylesheet (9)

- https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700;900&family=Noto+Sans+TC:wght@400;500&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&family=Roboto+Slab:wght@400;600;700;900&display=swap
- https://www.kanzenshuu.com/wp-content/uploads/shadowbox-js/src/shadowbox.css?ver=3.0.3
- https://www.kanzenshuu.com/wp-content/plugins/shadowbox-js/css/extras.css?ver=3.0.3.10
- https://www.kanzenshuu.com/wp-includes/css/dist/block-library/style.min.css?ver=6.9.4
- https://www.kanzenshuu.com/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=6.1.5
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/style.css?ver=1.0.5z
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/responsive.css?ver=1.0.5z
- https://www.kanzenshuu.com/wp-content/plugins/cleaner-gallery/css/gallery.min.css?ver=20130526
- https://www.kanzenshuu.com/wp-content/plugins/add-to-any/addtoany.min.css?ver=1.16

### script (14)

- https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js?ver=6.9.4
- https://static.addtoany.com/menu/page.js
- https://www.kanzenshuu.com/wp-content/plugins/add-to-any/addtoany.min.js?ver=1.1
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/js/common.js?ver=1.0.3c
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/js/shadowbox.js?ver=3.0.3
- https://www.googletagmanager.com/gtag/js?id=G-5QJZPJQY43
- https://www.kanzenshuu.com/wp-admin/admin-ajax.php?action=shadowboxjs&amp;cache=c6ed001983bb5ec78517db03635daf22&amp;ver=3.0.3
- https://www.kanzenshuu.com/wp-includes/js/dist/hooks.min.js?ver=dd5603f07f9220ed27f1
- https://www.kanzenshuu.com/wp-includes/js/dist/i18n.min.js?ver=c26c3dc7bed366793375
- https://www.kanzenshuu.com/wp-content/plugins/contact-form-7/includes/swv/js/index.js?ver=6.1.5
- https://www.kanzenshuu.com/wp-content/plugins/contact-form-7/includes/js/index.js?ver=6.1.5
- https://www.google.com/recaptcha/api.js?render=6LdLRu8qAAAAAE5stqQ3-0yGzCniE2MRHJ_bCR80&amp;ver=3.0
- https://www.kanzenshuu.com/wp-includes/js/dist/vendor/wp-polyfill.min.js?ver=3.15.0
- https://www.kanzenshuu.com/wp-content/plugins/contact-form-7/modules/recaptcha/index.js?ver=6.1.5

### image (20)

- https://www.kanzenshuu.com/wp-content/uploads/2025/01/40th-tribute-super-gallery-oda.png
- https://www.kanzenshuu.com/wp-content/uploads/2025/01/40th-tribute-super-gallery-oda.png
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/toyotaro_draws_202604b.png
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/fighterz-daima-pack-ending-slide-600x338.png
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/sparking-zero-neo-dlc-unveil-final-slide-600x338.png
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/xv3-live-stream-design-player-male-300x169.jpg
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/xv3-live-stream-design-player-female-300x169.jpg
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/xv3-live-stream-design-bulma-300x169.jpg
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/xv3-live-stream-design-brett-300x169.jpg
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/xv3-reveal-closing-screen-600x338.png
- https://www.kanzenshuu.com/wp-content/uploads/2026/04/battle-hour-gekitou-trailer-freeza-tease-600x338.jpg
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/footer_logo.png
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/footer_css3.png
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu/images/footer_html5.png
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/human-made.png
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/browser-chrome.png
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/browser-firefox.png
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/browser-edge.png
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/browser-safari.png
- https://www.kanzenshuu.com/wp-content/themes/kanzenshuu3/images/footer/browser-ie.png

### iframe (5)

- https://www.youtube.com/embed/qTfxD54fMHs?si=CdiwM3QKKmyv9jaY
- https://www.youtube.com/embed/_5Cr9BOt98c?si=th231nr-DDP5bEEe
- https://www.youtube.com/embed/v_Copbn4ASI?si=3jDvJ0m9MSrjzVEn
- https://www.youtube.com/embed/-NekKfJN614?si=buSW2uYpGpWAiq4X
- https://www.youtube.com/embed/gFfh6keadPY?si=KFoaxj86fxWA45oV

## CSS selectors (1072 total) — sample top 50

```css
" i]) {}
#bdd_xc #bb_b {}
#bdd_xc #bb_i {}
#bdd_xc #bb_url {}
#bdd_xc #respond {}
#bdd_xc #respond #format-buttons input {}
#bdd_xc #respond #message {}
#bdd_xc #respond * {}
#bdd_xc #respond .submit-bar {}
#bdd_xc #respond .submit-bar input {}
#bdd_xc #respond input {}
#bdd_xc #respond input:hover {}
#bdd_xc #respond option {}
#bdd_xc #respond select {}
#end-resizable-editor-section {}
#format-buttons {}
#login_logout {}
#login_logout .inputbox {}
#login_logout img.ddavatar {}
#respond .submit-bar {}
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
#xcomment-title {}
#xcomment-title a {}
#xcomment_form {}
.aligncenter {}
.alignright) {}
/* ... 1022 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-wide-www-shueisha-co-jp-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/www.shueisha.co.jp.md`

**Titre original :** Recon report — https://www.shueisha.co.jp/

### Recon report — https://www.shueisha.co.jp/

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 75165 (73 KB)
- **goto duration**: 1442 ms
- **Server**: `Accelia`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `kU8pCcoKznVgBJkmIwns56qE3yXD3sXG2mTJxaAYJb1KP362v43TlA==`
- **Cache-Control**: `n/a`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (129 total)

| Host | Asset count |
|---|---|
| `www.shueisha.co.jp` | 126 |
| `fonts.googleapis.com` | 2 |
| `www.googletagmanager.com` | 1 |

### stylesheet (10)

- https://www.shueisha.co.jp/wp-includes/css/dist/block-library/style.min.css?ver=6.7
- https://www.shueisha.co.jp/wp-content/plugins/user-access-manager/assets/css/uamLoginForm.css?ver=2.2.23
- https://fonts.googleapis.com/css2?family=Noto+Sans+JP%3Awght%40400%3B700&#038;display=swap&#038;ver=1.0
- https://fonts.googleapis.com/css2?family=Source+Serif+Pro&#038;display=swap&#038;text=QA&#038;ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/css/common.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/css/base.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/slick/slick.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/aos/aos.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/css/script.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/100th/style.css

### script (8)

- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/jquery-3.5.1.min.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/common.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/navigation.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/slick/slick.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/slick/slick-setting-top.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/script.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/mainvisual.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/100th/script.js

### image (110)

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
- _... 90 more_

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

<a name="reference-db-recon-recon-wide-www-toei-anim-co-jp_lineup_tv_dragon_ball_daima-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/www.toei-anim.co.jp_lineup_tv_dragon_ball_daima.md`

**Titre original :** Recon report — https://www.toei-anim.co.jp/lineup/tv/dragon_ball_daima/

### Recon report — https://www.toei-anim.co.jp/lineup/tv/dragon_ball_daima/

Date: 2026-05-16 14:26 UTC
Final URL: https://lineup.toei-anim.co.jp/ja/tv/dragon_ball_daima/
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 500
- **Body bytes**: 0 (0 KB)
- **goto duration**: 1919 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: apache
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `n/a`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (0 total)

| Host | Asset count |
|---|---|

## CSS selectors (0 total) — sample top 50

```css
```


---

<a name="reference-db-recon-recon-wide-www-viz-com_shonenjump_chapters_dragon-ball-super-md"></a>
## 📄 Fichier : `reference/db-recon/recon-wide/www.viz.com_shonenjump_chapters_dragon-ball-super.md`

**Titre original :** Recon report — https://www.viz.com/shonenjump/chapters/dragon-ball-super

### Recon report — https://www.viz.com/shonenjump/chapters/dragon-ball-super

Date: 2026-05-16 14:26 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 77985 (76 KB)
- **goto duration**: 729 ms
- **Server**: `nginx/1.27.5`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=utf-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `EUL5fB-fpddIJd1pochvj7_hH7tHDw0jplB-Hz1diXATi6EdxgVouQ==`
- **Cache-Control**: `max-age=161, public, s-maxage=1618`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (20 total)

| Host | Asset count |
|---|---|
| `assets.viz.com` | 9 |
| `www.gstatic.com` | 4 |
| `www.viz.com` | 2 |
| `dwgkfo5b3odmw.cloudfront.net` | 2 |
| `code.jquery.com` | 1 |
| `www.google.com` | 1 |
| `dw9to29mmj727.cloudfront.net` | 1 |

### stylesheet (1)

- https://assets.viz.com/assets/manifest-viz-ui-c5fcbc850cb9aa1bd834cd166049747879564b396ffb5a6f483c369362fd45d3.css

### script (13)

- https://code.jquery.com/jquery-1.11.3.min.js
- https://www.viz.com/search/series_titles.js
- https://assets.viz.com/assets/manifest-picturefill-251915c1c5c28dce5fe695c7b06042b06148adf01b169726c36bf677baebd29a.js
- https://assets.viz.com/assets/manifest-viz-common-c8ecaf146f2c31c59b738f68eb817482bf9d9626a2d09d69e1ec36520cc9ddc8.js
- https://assets.viz.com/assets/manifest-viz-ui-45f6ef826a2f4dde3197e846d527b4fba43eaea45e9e6337f69d881579393224.js
- https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js
- https://www.gstatic.com/firebasejs/8.10.0/firebase-analytics.js
- https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js
- https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js
- https://assets.viz.com/assets/manifest-viz-firebase-6f9f9c49f1d4edb1266b523a1beed7dd73d0b6fc6403e21b271bf1204c404e09.js
- https://www.viz.com/meta/tiles.js
- https://assets.viz.com/assets/manifest-zxcvbn-9feae4bcf274e1ff2860499646e7e19c6d4cf1b4759d81f5413f3b6d9f342738.js
- https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit

### image (6)

- https://assets.viz.com/assets/logo@2x-b76f649f933ea15f45147ff5445a2501c85c7f863ba0aba5ea7bec93c3272cc6.png
- https://dwgkfo5b3odmw.cloudfront.net/img/manga_series_header/466-SeriesHeaders_DBSuper_2000x800_wm.jpg
- https://dw9to29mmj727.cloudfront.net/misc/newsletter-naruto3.png
- https://assets.viz.com/assets/logo@2x-b76f649f933ea15f45147ff5445a2501c85c7f863ba0aba5ea7bec93c3272cc6.png
- https://assets.viz.com/assets/ajax-loader-slick-e7b44c86b050fca766a96ddac2d0932af0126da6f2305280342d909168dcce6b.gif
- https://dwgkfo5b3odmw.cloudfront.net/img/manga_series_link_img/1572-WSJ_DB_Super_400x320.jpg

## CSS selectors (2184 total) — sample top 50

```css
#blog_carousel-mw {}
#blog_carousel_nav {}
#col1 {}
#col2 {}
#comment_link_count:hover {}
#jump-latest {}
#jump-latest:after {}
#newsletter_footer_email:focus {}
#newsletter_footer_email:focus-visible {}
#o_account-links-content a {}
#o_account-links-content a:hover {}
#smartbanner {}
#smartbanner #smartbanner.no-icon .sb-info {}
#smartbanner .sb-button {}
#smartbanner .sb-button:active {}
#smartbanner .sb-button:hover {}
#smartbanner .sb-close {}
#smartbanner .sb-close:active {}
#smartbanner .sb-container {}
#smartbanner .sb-icon {}
#smartbanner .sb-icon.gloss:after {}
#smartbanner .sb-info {}
#smartbanner .sb-info em {}
#smartbanner .sb-info span {}
#smartbanner .sb-info strong {}
#smartbanner.android {}
#smartbanner.android .sb-button {}
#smartbanner.android .sb-button span {}
#smartbanner.android .sb-button:active {}
#smartbanner.android .sb-button:active span {}
#smartbanner.android .sb-button:hover {}
#smartbanner.android .sb-button:hover span {}
#smartbanner.android .sb-close {}
#smartbanner.android .sb-close:active {}
#smartbanner.android .sb-info {}
#smartbanner.android .sb-info strong {}
#smartbanner.no-icon .sb-icon {}
#smartbanner.windows .sb-icon {}
#sugg ul {}
* {}
*:after {}
*:before {}
.ac-pr {}
.ac-row {}
.ac-row.selected {}
.ac-row:hover {}
.ac-row:last-child {}
.ac-rwrap {}
.ac-sc {}
.ac-wrap {}
/* ... 2134 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-dragonball-api-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon/dragonball-api.com.md`

**Titre original :** Recon report — https://dragonball-api.com/

### Recon report — https://dragonball-api.com/

Date: 2026-05-16 14:20 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 404
- **Body bytes**: 95 (0 KB)
- **goto duration**: 62 ms
- **Server**: `n/a`
- **X-Powered-By**: `Express`
- **Content-Type**: `application/json; charset=utf-8`
- **CDN fingerprint**: unknown
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `max-age=864000`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (0 total)

| Host | Asset count |
|---|---|

## CSS selectors (0 total) — sample top 50

```css
```


---

<a name="reference-db-recon-recon-dragonball-multiverse-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon/dragonball-multiverse.com.md`

**Titre original :** Recon report — https://dragonball-multiverse.com/

### Recon report — https://dragonball-multiverse.com/

Date: 2026-05-16 14:20 UTC
Final URL: https://www.dragonball-multiverse.com/
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 7989 (8 KB)
- **goto duration**: 194 ms
- **Server**: `Apache/2.4.62 (Debian)`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: apache/2.4.62 (debian)
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `n/a`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (51 total)

| Host | Asset count |
|---|---|
| `dragonball-multiverse.com` | 48 |
| `www.dragonball-multiverse.com` | 1 |
| `ajax.googleapis.com` | 1 |
| `www.googletagmanager.com` | 1 |

### stylesheet (1)

- https://www.dragonball-multiverse.com/phoenix-splash-76128777.css

### script (2)

- https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
- https://www.googletagmanager.com/gtag/js?id=UA-7029683-1

### image (48)

- https://dragonball-multiverse.com/design/splash2/db1.png
- https://dragonball-multiverse.com/design/splash2/db2.png
- https://dragonball-multiverse.com/design/splash2/db3.png
- https://dragonball-multiverse.com/design/splash2/db4.png
- https://dragonball-multiverse.com/design/splash2/db5.png
- https://dragonball-multiverse.com/design/splash2/db6.png
- https://dragonball-multiverse.com/design/splash2/db7.png
- https://dragonball-multiverse.com/design/splash2/txt-db.png
- https://dragonball-multiverse.com/design/splash2/txt-mult.png
- https://dragonball-multiverse.com/design/index/en.png
- https://dragonball-multiverse.com/design/index/fr.png
- https://dragonball-multiverse.com/design/index/es.png
- https://dragonball-multiverse.com/design/index/it.png
- https://dragonball-multiverse.com/design/index/pt_BR.png
- https://dragonball-multiverse.com/design/index/de.png
- https://dragonball-multiverse.com/design/index/es_CO.png
- https://dragonball-multiverse.com/design/index/ct_CT.png
- https://dragonball-multiverse.com/design/index/pl.png
- https://dragonball-multiverse.com/design/index/pt.png
- https://dragonball-multiverse.com/design/index/jp.png
- _... 28 more_

## CSS selectors (79 total) — sample top 50

```css
#debug_messages {}
#debug_messages>div {}
#debug_messages>h4 {}
#discl {}
#langs {}
#langs img {}
#langs>a {}
#langs>a::after {}
#splash {}
#splash>div {}
#splash>div>div {}
#splash>div>div #db1 {}
#splash>div>div #db2 {}
#splash>div>div #db3 {}
#splash>div>div #db4 {}
#splash>div>div #db5 {}
#splash>div>div #db6 {}
#splash>div>div #db7 {}
#splash>div>div #txtdb {}
#splash>div>div #txtmult {}
#splash>div>div>img {}
#splash>div>div>img.flotte {}
#splash>div>div>img.txt {}
#splash>h1 {}
*[desktop] {}
*[dont-print] {}
*[mobile] {}
*[nodesktop] {}
*[nomobile] {}
.center {}
.dbm_quick_popup {}
.left {}
.myflex {}
.myprintr span {}
.myprintr span.ak {}
.right {}
.simplemodal-container {}
.small {}
.spacer {}
.txt_Balsamiq {}
.txt_Balsamiq-UC {}
.txt_Balsamiq-small {}
.txt_Bangers {}
.txt_Carter-One {}
.txt_Fira-Sans-Condensed {}
.txt_Gochi-Hand {}
.txt_Gochi-Hand-UC {}
.txt_Kalam {}
.txt_Kalam-UC {}
.txt_Kalam-UC>.balloon {}
/* ... 29 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-dragonball-fandom-com_fr_wiki_wiki_dragon_ball-md"></a>
## 📄 Fichier : `reference/db-recon/recon/dragonball.fandom.com_fr_wiki_Wiki_Dragon_Ball.md`

**Titre original :** Recon report — https://dragonball.fandom.com/fr/wiki/Wiki_Dragon_Ball

### Recon report — https://dragonball.fandom.com/fr/wiki/Wiki_Dragon_Ball

Date: 2026-05-16 14:20 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 403
- **Body bytes**: 5612 (5 KB)
- **goto duration**: 28 ms
- **Server**: `cloudflare`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: Cloudflare
- **Trace/Ray ID**: `9fcb06a36aae8ec5-FRA`
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

<a name="reference-db-recon-recon-dragonball-fandom-com_wiki_dragon_ball_wiki-md"></a>
## 📄 Fichier : `reference/db-recon/recon/dragonball.fandom.com_wiki_Dragon_Ball_Wiki.md`

**Titre original :** Recon report — https://dragonball.fandom.com/wiki/Dragon_Ball_Wiki

### Recon report — https://dragonball.fandom.com/wiki/Dragon_Ball_Wiki

Date: 2026-05-16 14:20 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 403
- **Body bytes**: 5603 (5 KB)
- **goto duration**: 110 ms
- **Server**: `cloudflare`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: Cloudflare
- **Trace/Ray ID**: `9fcb069b9ad6365b-FRA`
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

<a name="reference-db-recon-recon-en-bandainamcoent-eu_dragon-ball_dragon-ball-z-kakarot-md"></a>
## 📄 Fichier : `reference/db-recon/recon/en.bandainamcoent.eu_dragon-ball_dragon-ball-z-kakarot.md`

**Titre original :** Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot

### Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-z-kakarot

Date: 2026-05-16 14:20 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 242161 (236 KB)
- **goto duration**: 531 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `Z2UutVD1pgfICxPc1Rh8Dm0UC_Od9l_FEO9vGuoOkqlWoe7HlYSPtw==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (83 total)

| Host | Asset count |
|---|---|
| `` | 60 |
| `en.bandainamcoent.eu` | 9 |
| `cdn.jsdelivr.net` | 9 |
| `static.bandainamcoent.eu` | 3 |
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

### image (64)

- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_logo.png
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_logo.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_banner_final.jpg
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_logo.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_game-thumbnail.jpg
- https://static.bandainamcoent.eu/high/dragon-ball/dragonball-project-z/03-News/dbzk_dlc6_thumbnail.jpg
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_quotes_mobile.jpg
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kf02bis.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kf02ter.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kfdriving.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_kfDBcards.png
- image:/high/dragon-ball/dragonball-project-z/00-page-setup/dbzk_game-thumbnail.jpg
- image:/high/dragon-ball/dragonball-project-z/04-retailers/dbzk-daima-edition.jpg
- image:/high/dragon-ball/dragonball-project-z/04-retailers/dbzk-master-edition.jpg
- image:/2026-01/DBZ-Kakarot-10M.jpg
- image:/2025-12/DBZK-DLC-8-Battle-PV-Thumbnail-EN.png
- image:/high/dragon-ball/dragonball-project-z/03-News/DBZK-DAIMA-P1-Launch.png
- image:/high/dragon-ball/dragonball-daima/01-news/DBZK-DAIMA-PART-1-Release-Date-PV-Thumbnail-EN.jpg
- image:/2026-01/DBZ-Kakarot-10M.jpg
- image:/2025-12/DBZK-DLC-8-Battle-PV-Thumbnail-EN.png
- _... 44 more_

### iframe (1)

- https://www.youtube-nocookie.com/embed/HQrYS2ndO3E?autoplay=0&amp;start=0&amp;rel=0&amp;mute=0

## CSS selectors (3101 total) — sample top 50

```css
#block-views-block-block-news-title-block-1 .arrow {}
#block-views-block-block-news-title-block-1 .view-block-news-title .result .slick-slide:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .news-exposed:hover {}
#block-views-block-block-news-title-block-1 .view-block-news-title .row .slick-slide.slick-current.slick-active .news-exposed {}
#block-views-block-description-feature-block-1 .paragraph--type--title-key-feature-line .key-feature-description .field--name-field-catch-phrase {}
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
.alert-info a:hover {}
.alert-info hr {}
/* ... 3051 more (use --snapshot-dir to dump full list) */
```


---

<a name="reference-db-recon-recon-en-dragon-ball-official-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon/en.dragon-ball-official.com.md`

**Titre original :** Recon report — https://en.dragon-ball-official.com/

### Recon report — https://en.dragon-ball-official.com/

Date: 2026-05-16 14:20 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 22373 (22 KB)
- **goto duration**: 1855 ms
- **Server**: `nginx`
- **X-Powered-By**: `PHP/8.1.29`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `bH_B628Wcwsoid_uDyE1ejqTgXaqnBE0Ruw6I8REAFXhz1V2rIb_QA==`
- **Cache-Control**: `no-cache, private`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (42 total)

| Host | Asset count |
|---|---|
| `en.dragon-ball-official.com` | 37 |
| `platform.twitter.com` | 2 |
| `www.googletagmanager.com` | 2 |
| `cdn.cookielaw.org` | 1 |

### script (15)

- https://cdn.cookielaw.org/scripttemplates/otSDKStub.js
- https://platform.twitter.com/widgets.js
- https://platform.twitter.com/widgets.js
- https://en.dragon-ball-official.com/assets/js/jquery-3.5.0.min.js
- https://en.dragon-ball-official.com/assets/js/Jquery.mysuggest.js
- https://en.dragon-ball-official.com/assets/js/en.TextShortCut.js
- https://en.dragon-ball-official.com/assets/js/modaal.min.js
- https://en.dragon-ball-official.com/assets/js/TweenMax.js
- https://en.dragon-ball-official.com/assets/js/jquery.inview.min.js
- https://en.dragon-ball-official.com/assets/js/simplebar.min.js
- https://en.dragon-ball-official.com/assets/js/shared.js
- https://en.dragon-ball-official.com/assets/js/project.js
- https://en.dragon-ball-official.com/assets/js/swiper.js
- https://en.dragon-ball-official.com/assets/js/core.js
- https://en.dragon-ball-official.com/assets/js/common.js

### image (25)

- https://en.dragon-ball-official.com/assets/img/intro/icon_ball.png
- https://en.dragon-ball-official.com/assets/img/shared/icon_x.png
- https://en.dragon-ball-official.com/assets/img/shared/logo_title.png
- https://en.dragon-ball-official.com/dragonball/en/banner/2026/05/NzjQynBgjprtuGQF/X_0509_1200_675_EN_v5.jpg
- https://en.dragon-ball-official.com/assets/img/top/indicator.png
- https://en.dragon-ball-official.com/dragonball/en/banner/2026/01/LuldJXPpTwEtW4pC/DBOS_770_404_en.jpg
- https://en.dragon-ball-official.com/assets/img/top/indicator.png
- https://en.dragon-ball-official.com/dragonball/en/banner/2026/01/FgJ133jN8qGwFooU/yoko_RGB_en.jpg
- https://en.dragon-ball-official.com/assets/img/top/indicator.png
- https://en.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://en.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://en.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://en.dragon-ball-official.com/%7B%7B:thumbnail%7D%7D
- https://en.dragon-ball-official.com/assets/img/top/anime_super_banner.jpg
- https://en.dragon-ball-official.com/assets/img/top/battle2026_banner.jpg
- https://en.dragon-ball-official.com/assets/img/top/store_banner.png
- https://en.dragon-ball-official.com/assets/img/top/daima_banner.jpg
- https://en.dragon-ball-official.com/assets/img/top/bn08.jpg
- https://en.dragon-ball-official.com/assets/img/top/squadra_banner.png
- https://en.dragon-ball-official.com/assets/img/top/bn06.png
- _... 5 more_

### iframe (2)

- https://www.googletagmanager.com/ns.html?id=GTM-TW3DK5K
- https://www.googletagmanager.com/ns.html?id=GTM-TCJ83M8

## CSS selectors (0 total) — sample top 50

```css
```


---

<a name="reference-db-recon-recon-fr-bandainamcoent-eu_dragon-ball_dragon-ball-sparking-zero-md"></a>
## 📄 Fichier : `reference/db-recon/recon/fr.bandainamcoent.eu_dragon-ball_dragon-ball-sparking-zero.md`

**Titre original :** Recon report — https://fr.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

### Recon report — https://fr.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero

Date: 2026-05-16 14:20 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 232926 (227 KB)
- **goto duration**: 489 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `cAJE6NQqFz_TxTqA-Xt9fZu3Mw4BEl01V-whFcCjWqb82iIKXCtZhA==`
- **Cache-Control**: `max-age=43200, public`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (76 total)

| Host | Asset count |
|---|---|
| `` | 48 |
| `fr.bandainamcoent.eu` | 9 |
| `cdn.jsdelivr.net` | 9 |
| `static.bandainamcoent.eu` | 8 |
| `p325k7wa.twic.pics` | 1 |
| `www.youtube-nocookie.com` | 1 |

### stylesheet (10)

- https://fr.bandainamcoent.eu/sites/default/files/css/css_XBoVHYZE8IfVKrOc4e5gK-PKirwU8VrvHcg5bwgNYQE.css?delta=0&amp;language=fr&amp;theme=bne_main&amp;include=eJx1UO1OBCEMfCGExBciZZnjuADlaLkPn951ddVk9c9MOzNtmgaoYng8OguiP-WytuISGgYVExr8wrVyc59kFh5wccxOxcZMhZO5XCfG08_saSqvuV6gcL8b02lQGtTPsg__KHa2PkPJckY015nfnOizQIw8RVFdIIG55Qj2qGG7EiW6AencJN_wsplrBHdxG9rKcRaYO8KJR3VfbOlCj4OIgoqmNpIeJ75NKOUiVjmlPxbvsQoRSv_7shaLvh78D9hFH5hVdP2NOyjv7EqpuA
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/css/bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.1.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.2.0/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/7.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.3.1/8.x-3.x/drupal-bootstrap.min.css
- https://cdn.jsdelivr.net/npm/@unicorn-fail/drupal-bootstrap-styles@0.0.2/dist/3.4.0/8.x-3.x/drupal-bootstrap.min.css
- https://fr.bandainamcoent.eu/sites/default/files/css/css_rK4jhT2bdSNylljCKVapcrV40lkltQk4mi-Z5toM1k8.css?delta=9&amp;language=fr&amp;theme=bne_main&amp;include=eJx1UO1OBCEMfCGExBciZZnjuADlaLkPn951ddVk9c9MOzNtmgaoYng8OguiP-WytuISGgYVExr8wrVyc59kFh5wccxOxcZMhZO5XCfG08_saSqvuV6gcL8b02lQGtTPsg__KHa2PkPJckY015nfnOizQIw8RVFdIIG55Qj2qGG7EiW6AencJN_wsplrBHdxG9rKcRaYO8KJR3VfbOlCj4OIgoqmNpIeJ75NKOUiVjmlPxbvsQoRSv_7shaLvh78D9hFH5hVdP2NOyjv7EqpuA

### script (8)

- https://p325k7wa.twic.pics/?v1&amp;anticipation=0.5
- https://fr.bandainamcoent.eu/sites/default/files/js/js_ZvUeuHVpBFilQ_ZkT2Bh3PLxA-jqXXUXI3KlmhA-uG4.js?scope=header&amp;delta=0&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://fr.bandainamcoent.eu/core/assets/vendor/jquery/jquery.min.js?v=4.0.0
- https://fr.bandainamcoent.eu/sites/default/files/js/js_eBtwxUeXUZeKuGiR8iJp9LTI9I1Q13lfPCKaA9emXG8.js?scope=header&amp;delta=2&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://fr.bandainamcoent.eu/modules/contrib/webform/js/webform.form.auto_focus.js?teyred
- https://fr.bandainamcoent.eu/sites/default/files/js/js_zzLKmcd5j6YXnJR1x1zv8W6Nb-X4J7qRKCBN_5pmDpc.js?scope=footer&amp;delta=0&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof
- https://cdn.jsdelivr.net/npm/entreprise7pro-bootstrap@3.4.8/dist/js/bootstrap.min.js
- https://fr.bandainamcoent.eu/sites/default/files/js/js_lPKk7FfeiFiVM1cK39vyFpfomOmNdJVjXZ2aSHmq7_c.js?scope=footer&amp;delta=2&amp;language=fr&amp;theme=bne_main&amp;include=eJyFkmFuwyAMhS8UBWkXQg68MibACDtpd_uFpMumNlX_YPt9BmPLE1TRLG6VBd5eYlpDMTQrW5mnHHWYzlMCChqlYSqwjnPmYnazKQ1KMaGZ_8FGNGqCWaIH216mJvruADZoNr_O2N-i4uUEeVJaL-3vPTAsKLrrAmru01KN5iHe6q4FaoJimJhVtFE1h2drg42lN3_AypWXXvNQlDlprIPjBuPbXCmNPlLiMNIX3YYl4ipmO3fhiunCLZu7PReRkNceRr8NTUahBW-TlENIr9MyRCi85rI6Tt_gjyfej1Nx3Pbnwm6Wc76vluXijk_Zv8E-KT_BCgof

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
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/DBSZ_AVAILABLENOW_FR.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/dbsz-deluxe-FR.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/06-new-beautyshots/dbsz-ultimate-fr.jpg
- image:/high/dragon-ball/dragon-ball-sparking-zero/02-retailers/dbsz-collector-premium/dbsz-collector-premium-FR.jpg
- _... 37 more_

### iframe (1)

- https://www.youtube-nocookie.com/embed/-FHlm6qDHKc?autoplay=0&amp;start=0&amp;rel=0&amp;mute=0

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

<a name="reference-db-recon-recon-fr-dragon-ball-official-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon/fr.dragon-ball-official.com.md`

**Titre original :** Recon report — https://fr.dragon-ball-official.com/

### Recon report — https://fr.dragon-ball-official.com/

Date: 2026-05-16 14:20 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 22454 (22 KB)
- **goto duration**: 1955 ms
- **Server**: `nginx`
- **X-Powered-By**: `PHP/8.1.29`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `OO_JpX69QV2oxJ0q_PLBnU9csXfahRsWNGdrK6-4eLYNsNjEqxxCbg==`
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

<a name="reference-db-recon-recon-shonenjumpplus-com-md"></a>
## 📄 Fichier : `reference/db-recon/recon/shonenjumpplus.com.md`

**Titre original :** Recon report — https://shonenjumpplus.com/

### Recon report — https://shonenjumpplus.com/

Date: 2026-05-16 14:20 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 197064 (192 KB)
- **goto duration**: 74 ms
- **Server**: `nginx`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=utf-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `qX6E3mJ90WVyjxaX8USjh0DQ85E9HUn9Z8drXam6oaslsi0Cxl6eGQ==`
- **Cache-Control**: `no-cache="Set-Cookie", max-age=41, stale-while-revalidate=10, stale-if-error=60`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (227 total)

| Host | Asset count |
|---|---|
| `cdn-scissors.gigaviewer.com` | 178 |
| `cdn-ak.shonenjumpplus.com` | 37 |
| `shonenjumpplus.com` | 6 |
| `cdn.image.st-hatena.com` | 3 |
| `www.facebook.com` | 2 |
| `www.googletagmanager.com` | 1 |

### stylesheet (2)

- https://cdn-ak.shonenjumpplus.com/css/jump_plus.css?1778825464
- https://cdn-ak.shonenjumpplus.com/css/top_modal.css?1778825464

### script (2)

- https://cdn-ak.shonenjumpplus.com/js/jquery-slick.js?1778825451
- https://cdn-ak.shonenjumpplus.com/js/bundle.js?1778825490

### image (222)

- https://cdn-ak.shonenjumpplus.com/images/user/close-button.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/user/close-button.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/android-icon-144.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/i-attention_black.svg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/close-button.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/i-attention_black.svg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/close-button.png?1778825334
- https://cdn-ak.shonenjumpplus.com/images/jump_icon.svg?1778825334
- https://cdn-ak.shonenjumpplus.com/images/user/close-button.png?1778825334
- https://cdn-scissors.gigaviewer.com/image/scale/38f1711b8cba4a5e88018a28b418b88e491a6eb5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589753427855-33a1c244131dc0d9dde3c2f66d033b85%3F1778218043
- https://cdn-scissors.gigaviewer.com/image/scale/38f1711b8cba4a5e88018a28b418b88e491a6eb5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589753427855-33a1c244131dc0d9dde3c2f66d033b85%3F1778218043
- https://cdn-scissors.gigaviewer.com/image/scale/38f1711b8cba4a5e88018a28b418b88e491a6eb5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589753427855-33a1c244131dc0d9dde3c2f66d033b85%3F1778218043
- https://cdn-scissors.gigaviewer.com/image/scale/1ac417ee3bd779f1b98e5da891a81f6071ed85b5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589237822802-412a6bb86d4b09c2c00b56c90dc9932b%3F1777518703
- https://cdn-scissors.gigaviewer.com/image/scale/1ac417ee3bd779f1b98e5da891a81f6071ed85b5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589237822802-412a6bb86d4b09c2c00b56c90dc9932b%3F1777518703
- https://cdn-scissors.gigaviewer.com/image/scale/1ac417ee3bd779f1b98e5da891a81f6071ed85b5/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107419589237822802-412a6bb86d4b09c2c00b56c90dc9932b%3F1777518703
- https://cdn-scissors.gigaviewer.com/image/scale/04172ba78f41f74ea98d0eb1f485e8928541dabc/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107094915128502915-6678cf70f79b92f35b40b4fe27e1fe9d%3F1776138690
- https://cdn-scissors.gigaviewer.com/image/scale/04172ba78f41f74ea98d0eb1f485e8928541dabc/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107094915128502915-6678cf70f79b92f35b40b4fe27e1fe9d%3F1776138690
- https://cdn-scissors.gigaviewer.com/image/scale/04172ba78f41f74ea98d0eb1f485e8928541dabc/enlarge=0;height=700;no_unsharpmask=1;quality=90;version=1;width=480/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fmagazine-thumbnail%2F17107094915128502915-6678cf70f79b92f35b40b4fe27e1fe9d%3F1776138690
- https://cdn-scissors.gigaviewer.com/image/scale/eec1f65bc3edc063d929b8e2af391adce4380b49/enlarge=0;height=348;no_unsharpmask=1;quality=90;version=1;width=725/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fseries-sub-thumbnail-horizontal-with-logo-2%2F17106567264648152072-35df83d3554b0c566e0f024de283b10d%3F1777261420
- https://cdn-scissors.gigaviewer.com/image/scale/3db4e8e1dd600aa4c7434a72baecf7c8b7389007/enlarge=0;height=482;no_unsharpmask=1;quality=90;version=1;width=482/https%3A%2F%2Fcdn-ak-img.shonenjumpplus.com%2Fpublic%2Fseries-thumbnail%2F17106567264648152072-92ef44ba351388e3b198eb919436e07c%3F1778562244
- _... 202 more_

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

<a name="reference-db-recon-recon-www-dragonball-jp-md"></a>
## 📄 Fichier : `reference/db-recon/recon/www.dragonball.jp.md`

**Titre original :** Recon report — https://www.dragonball.jp/

### Recon report — https://www.dragonball.jp/

Date: 2026-05-16 14:20 UTC
Final URL: https://mainsv.com/tf03/
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 111 (0 KB)
- **goto duration**: 2456 ms
- **Server**: `Apache`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html`
- **CDN fingerprint**: apache
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `n/a`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (0 total)

| Host | Asset count |
|---|---|

## CSS selectors (0 total) — sample top 50

```css
```


---

<a name="reference-db-recon-recon-www-shueisha-co-jp-md"></a>
## 📄 Fichier : `reference/db-recon/recon/www.shueisha.co.jp.md`

**Titre original :** Recon report — https://www.shueisha.co.jp/

### Recon report — https://www.shueisha.co.jp/

Date: 2026-05-16 14:20 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 200
- **Body bytes**: 75165 (73 KB)
- **goto duration**: 2399 ms
- **Server**: `Accelia`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `6jPwoHJCn125Swe6Irl8IQetR-LuAndc-QASxi6xDuiv7lBn_ylDig==`
- **Cache-Control**: `n/a`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (129 total)

| Host | Asset count |
|---|---|
| `www.shueisha.co.jp` | 126 |
| `fonts.googleapis.com` | 2 |
| `www.googletagmanager.com` | 1 |

### stylesheet (10)

- https://www.shueisha.co.jp/wp-includes/css/dist/block-library/style.min.css?ver=6.7
- https://www.shueisha.co.jp/wp-content/plugins/user-access-manager/assets/css/uamLoginForm.css?ver=2.2.23
- https://fonts.googleapis.com/css2?family=Noto+Sans+JP%3Awght%40400%3B700&#038;display=swap&#038;ver=1.0
- https://fonts.googleapis.com/css2?family=Source+Serif+Pro&#038;display=swap&#038;text=QA&#038;ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/css/common.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/css/base.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/slick/slick.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/aos/aos.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/css/script.css?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/100th/style.css

### script (8)

- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/jquery-3.5.1.min.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/common.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/navigation.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/slick/slick.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/slick/slick-setting-top.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/script.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/js/mainvisual.js?ver=1.0
- https://www.shueisha.co.jp/wp-content/themes/shueisha/shared/100th/script.js

### image (110)

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
- _... 90 more_

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

<a name="reference-db-recon-recon-www-viz-com_dragon-ball-super-md"></a>
## 📄 Fichier : `reference/db-recon/recon/www.viz.com_dragon-ball-super.md`

**Titre original :** Recon report — https://www.viz.com/dragon-ball-super

### Recon report — https://www.viz.com/dragon-ball-super

Date: 2026-05-16 14:20 UTC
Profile used: `http`

## HTTP & CDN

- **HTTP status**: 404
- **Body bytes**: 5377 (5 KB)
- **goto duration**: 226 ms
- **Server**: `nginx/1.27.5`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html; charset=UTF-8`
- **CDN fingerprint**: AWS CloudFront
- **Trace/Ray ID**: `v5RO9y6hg3DwHDaUBLQvA5Tc-t0Rh7013l4E9dRQK52xWAnbCWNaHQ==`
- **Cache-Control**: `n/a`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (2 total)

| Host | Asset count |
|---|---|
| `dw9to29mmj727.cloudfront.net` | 2 |

### image (2)

- https://dw9to29mmj727.cloudfront.net/misc/logo-static-new-sm.png
- https://dw9to29mmj727.cloudfront.net/misc/logo-static-new-sm.png

## CSS selectors (50 total) — sample top 50

```css
.bg-black {}
.bg-off-black {}
.bg-red {}
.bg-trans-white {}
.bg-yellow {}
.color-white {}
.flex {}
.flex-justify {}
.g-3--lg {}
.g-omega--lg {}
.last-row {}
.line-solid {}
.line-tight {}
.mar-b-lg {}
.mar-b-xl--lg {}
.mar-y-xl {}
.nihongo {}
.o_logo-bottom {}
.o_logo-bottom:before {}
.o_logo-img {}
.o_logo-top {}
.o_logo-top:before {}
.o_site-footer {}
.o_site-header {}
.pad-y-xl {}
.pad-y-xxl {}
.row {}
.row.last_row {}
.row:after {}
.style-spin {}
.type-center {}
.type-lg {}
.type-lg--md {}
.type-md {}
.type-xl--lg {}
.type-xl--md {}
.type-xxl--lg {}
.weight-bold {}
.wrapper {}
a {}
body {}
div {}
footer {}
h1 {}
h2 {}
header {}
html {}
img {}
p {}
section {}
```


---

