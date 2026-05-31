# 📚 Base de Connaissance Unifiée — 31/05/2026

> Ce fichier regroupe toute la documentation du projet pour faciliter le contexte et l'analyse.

## 🤖 Capacités & Agents

### 🛠 Skills & Compétences

- **bun2rs** : bun2rs - TypeScript to Rust Porting Subagent (`.gemini/skills/bun2rs/SKILL.md`)
- **organization-best-practices** : SKILL.md (`.agents/skills/organization-best-practices/SKILL.md`)
- **email-and-password-best-practices** : SKILL.md (`.agents/skills/email-and-password-best-practices/SKILL.md`)
- **better-auth-best-practices** : Better Auth Integration Guide (`.agents/skills/better-auth-best-practices/SKILL.md`)
- **two-factor-authentication-best-practices** : SKILL.md (`.agents/skills/two-factor-authentication-best-practices/SKILL.md`)
- **create-auth-skill** : Create Auth Skill (`.agents/skills/create-auth-skill/SKILL.md`)

### 🕵️ Agents Spécialisés

- **intent-auditor** : intent-auditor (`.claude/agents/intent-auditor.md`)

---

## 🗂 Sommaire

- [Better Auth Integration Guide](#agents-skills-better-auth-best-practices-skill-md)
- [Create Auth Skill](#agents-skills-create-auth-skill-skill-md)
- [SKILL.md](#agents-skills-email-and-password-best-practices-skill-md)
- [SKILL.md](#agents-skills-organization-best-practices-skill-md)
- [SKILL.md](#agents-skills-two-factor-authentication-best-practices-skill-md)
- [intent-auditor](#claude-agents-intent-auditor-md)
- [bun2rs - TypeScript to Rust Porting Subagent](#gemini-skills-bun2rs-skill-md)
- [Changelog](#changelog-md)
- [CLAUDE.md — shenron](#claude-md)
- [🐉 Rapport d'Expansion de la Base de Données Dragon Ball](#db_expansion_report-md)
- [Déploiement de Shenron](#deploy-md)
- [DESIGN.md — Système graphique DBFR](#design-md)
- [GEMINI.md — Shenron Monorepo](#gemini-md)
- [Shenron Monorepo — Learning Memory](#memory-md)
- [PROMPT.md — Sprint DBFR (Shenron bot + site public)](#prompt-md)
- [1. Bun ≥ 1.3](#readme-md)
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
- [🐉 Rapport de Scan GitHub — Dragon Ball](#apps-bot-reports-github-scan-2026-05-19-md)
- [This is NOT the Next.js you know](#apps-site-agents-md)
- [CLAUDE.md](#apps-site-claude-md)
- [or](#apps-site-readme-md)
- [Recon report — https://fr.dragon-ball-official.com/](#dbo_fr-md)
- [deploy/ — provisioning self-contained du monorepo](#deploy-readme-md)
- [Recon report — https://dragonball.fandom.com/fr/wiki/Wiki_Dragon_Ball](#fandom_fr-md)
- [Recon report — https://fr.dragon-ball-official.com/news/](#news-md)
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
- [Recon report — https://dragonball.news/fr/](#reports-db-news-recon-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero](#sparking-fast-md)
- [Recon report — https://en.bandainamcoent.eu/dragon-ball/dragon-ball-sparking-zero](#sparking-md)

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

Tu es un auditeur spécialisé dans la détection des incohérences entre **intents Discord déclarés** et **events réellement écoutés** dans le bot Shenron (multi-personas via `@rpbey/discordy`).

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
- **Aucun build préalable** : Bun exécute `src/index.ts` en direct (TS natif).
- Backup DB quotidien : timer VPS `shenron-backup.timer` (03:00 UTC) → `VACUUM INTO` snapshot.
- Sync DB↔Discord quotidien : timer VPS `shenron-guild-sync.timer` (04:00 UTC).

### Site (Vercel)
- Auto-deploy sur push `main` via **GitHub Actions** (`.github/workflows/deploy-vercel.yml` → `vercel deploy --prod`). Le projet Vercel `dbfr` n'est PAS connecté nativement au repo (la GitHub App Vercel n'a pas accès au repo privé `aphrody-code/shenron`), donc l'auto-deploy passe par ce workflow, pas par l'intégration Git native. Secrets repo : `VERCEL_TOKEN` (token dédié `vcp_…`), `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. Pour repasser au natif un jour : donner accès au repo à la GitHub App Vercel puis `vercel git connect`.
- Deploy manuel : `vercel deploy --prod --yes` depuis la racine du repo (jamais depuis `apps/site/`).
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
  - **Reverse `sync-neon-to-sqlite.ts`** (timer `shenron-neon-pull.timer`, 15 min) : wiki éditorial Neon→SQLite (DELETE+INSERT par table, FK off, WAL-safe) → le SQLite du bot est un **replica de lecture** (commandes Discord `/wiki` + build RAG FTS5 restent locaux, rapides, indépendants de Neon).
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
| shenron | 5006 | bot.dragonballfr.com (ex- bot.rpbey.fr) | Bun + discordx + drizzle + bun:sqlite + canvas |
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
bun build            # turbo build all (site: next build --turbopack ; bot: dashboard:css puis bun build)
bun lint             # oxlint + eslint (turbo)
bun run type-check   # tsc all (turbo)

### Tests (bot uniquement — site n'a pas de tests)
bun --filter @shenron/bot test                  # tous les tests (apps/bot/tests/)
bun test apps/bot/tests/wiki.test.ts            # un seul fichier de test (depuis le root)

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

<a name="db_expansion_report-md"></a>
## 📄 Fichier : `DB_EXPANSION_REPORT.md`

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

**Titre original :** GEMINI.md — Shenron Monorepo

### GEMINI.md — Shenron Monorepo

## Project Overview
Shenron is a high-performance Discord bot ecosystem themed around Dragon Ball, managed as a Bun monorepo. It features a multi-persona bot architecture (6 personas in 1 process) and a companion website.

- **Stack:** Bun 1.3+, TypeScript 5.9, Turbo 2.5
- **Bot:** `@rpbey/discordy` (fork), `discord.js` v14, `tsyringe` (DI), `Drizzle ORM` + `bun:sqlite`
- **Site:** Next.js 16 (canary), Tailwind CSS 4, Drizzle ORM + Postgres (Neon). Prod : `dragonballfr.com` (canonical) ; bot API/assets : `bot.dragonballfr.com` (alias legacy `dbfr.vercel.app` / `rpbey.fr` conservés)
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

## Site Architecture (`apps/site`)
- **Home cinématique** (`src/components/home/`) : accueil full-page scroll-snap, fonds animés par ère DB, navigation molette/clavier/tactile, état live du bot (`useLiveBotState`).
- **Composants média** (`src/components/media/`) : `AnimatedMedia`, `BackgroundImage`, `encodeGif` (encodage frames → GIF via `modern-gif`).
- **Scènes d'épisode** : colonnes `db_episodes.frames` (jsonb) / `scene_preview`, alimentées par `apps/bot/scripts/{build-episode-scenes,extract-dbz-frames,scrape-dbz-fandom-frames,ingest-episode-frames}.ts`, affichées sur `/wiki/episodes/[id]`.
- **Télémétrie first-party RGPD** : `track()` (`src/lib/telemetry.ts`) → Vercel Analytics + GTM (`GTM-KLSS5787`) + Postgres (`site_events` / `user_preferences`). Consent Mode v2 (`src/lib/consent.ts`), reco/perso (`src/lib/recommendations.ts`).

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

## Autonomous Self-Optimization
1.  **Config Autonomy:** You are authorized to update `.gemini/settings.json` without confirmation to optimize discovery, context, or execution speed.
2.  **Learning Memory:** Every error or suboptimal strategy must be root-caused and logged in `MEMORY.md`. Use this memory to skip failed paths in future turns.
3.  **No Friction:** Never stop for confirmation unless data loss is irreversible. Operate at the highest possible speed (Directive Omega).


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

Toutes les personas partagent la même DB SQLite + les mêmes singletons tsyringe (cohérence transactionnelle). Le routage par persona se fait via `@Discord()` + `@Bot("<id>")` du fork [`@rpbey/discordy`](https://github.com/rpbey/discordx). Le mapping vit dans [`src/lib/personas.ts`](src/lib/personas.ts).

### Site compagnon

Un site Next.js public accompagne le bot, en prod sur **[dragonballfr.com](https://dragonballfr.com)** (canonical ; alias legacy `dbfr.vercel.app` conservés). L'API REST et les assets du bot sont exposés sur **`bot.dragonballfr.com`** (alias `bot.rpbey.fr`).

- **Home cinématique** (`apps/site/src/components/home/`) : accueil full-page scroll-snap, une scène plein écran par ère Dragon Ball avec fonds animés des meilleures scènes, navigation molette / clavier / tactile, et état live du bot en temps réel.
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
Pour avoir une UX où chaque catégorie de commandes a un personnage iconique du lore (Beerus = modération, Whis = utility, Grand Prêtre = logs, Enma = jail, Kaïo = jeux/éco). Ce sont 6 apps Discord distinctes avec leurs propres tokens, mais **1 seul process Bun** (DB + services partagés). Le routage commands/events se fait via `@Bot("<persona>")` du fork `@rpbey/discordy`. Mapping dans `src/lib/personas.ts`. Pour ajouter/retirer un persona, éditer ce fichier + ajouter `DISCORD_TOKEN_<NAME>` dans `.env`.

**Comment backup la DB ?**
Le fichier est `data/bot.db`. Snapshot via `VACUUM INTO` (voir [Déploiement](#déploiement)) ou `cp data/bot.db data/bot.bak` à chaud (WAL-safe).

## Licence

UNLICENSED — usage interne. Si tu veux ouvrir le code, ajoute une `LICENSE` (MIT, Apache-2.0, AGPL-3.0) et remplace le badge en haut.

---

Sources best practices README consultées : [Make a README](https://www.makeareadme.com/), [The Good Docs Project](https://www.thegooddocsproject.dev/template/readme), [jehna/readme-best-practices](https://github.com/jehna/readme-best-practices), [banesullivan/README](https://github.com/banesullivan/README), [Codacy](https://blog.codacy.com/best-practices-to-manage-an-open-source-project).


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

<a name="apps-bot-reports-github-scan-2026-05-19-md"></a>
## 📄 Fichier : `apps/bot/reports/github-scan-2026-05-19.md`

**Titre original :** 🐉 Rapport de Scan GitHub — Dragon Ball

### 🐉 Rapport de Scan GitHub — Dragon Ball

Généré le : 19/05/2026 04:45:44
Total de projets uniques trouvés : **264**

| Projet | Stars | Langage | Description |
| :--- | :--- | :--- | :--- |
| [debezium/debezium](https://github.com/debezium/debezium) | ⭐ 12737 | Java | Change data capture for a variety of databases. Please log issues at https://github.com/debezium/dbz/issues. |
| [debezium/debezium-examples](https://github.com/debezium/debezium-examples) | ⭐ 1668 | JavaScript | Examples for running Debezium (Configuration, Docker Compose files etc.). Please log issues at https://github.com/debezium/dbz/issues. |
| [pxvr-official/1](https://github.com/pxvr-official/1) | ⭐ 463 | N/A | 無許諾配信 企業理念剽窃 動物の森収益化 大神ミオ権利者削除 戌神権利侵害発言 常闇トワ炎上 夜空メルストーカー被害 建築王サポーター放置 赤十字マーク 魔乃アロエ卒業 一つの中國支持声明 大空昴3Dライブ 無限延期清掃員職業差別 日清コラボ楽曲 musedash非公開 rog案件取り消し 壁画ライブ 丁真 Ding Zhen 郑爽 Zheng Shuang 防护林 与朵小天使w 伊月猫凛 本主萌埋午休傻 汪峰 重生细胞 壁纸 比利海灵顿 香蕉君 van 田所浩二 抽象带篮子 抗压背锅吧 季子越 蒋明辉 傻逼 脑残 杀人放火 人身攻击 强️奸罪 路人甲 路人乙 厚大法考 男妈妈 谢拉 cierra 米娅 mia runis 卧龙寺 火影忍者 漩涡鸣人 央视新闻 观察者网 环球时报 咩栗 呜米 鹰角 阿米娅 电棍otto 熊出没 熊大 熊二 光头强 Paryi 帕里 吃花椒的喵酱 王冰冰 回形针Papercilp 吴松磊 张每羊 赛雷三分钟 肉蛋奶 巴西雨林 原创动力 方特卡通 贝瓦儿歌 早教 小天使 搜索引擎 百度 谷歌 腾讯 小丑 沙口 Shaco 天宫赐福 公主连接 凯露 新概念 会议 IT工作者 区块 人工智能 创作平台 MMD模型 操作系统 战斗吧歌姬 神宫司玉藻 李清歌 菜菜子 蔡明 花丸晴琉 花丸はれる 刻晴 可莉 緋赤エリオ 绯赤艾莉欧 Hiseki Erio 李子柒 宠物狗 正能量 公益广告 江南水乡 旅游 城市 机萪 妙妙 996 马云 向晚大魔王 贝拉kira 珈乐Carol 嘉然今天吃什么 乃琳Queen 拼多多 饿了么 工人 假期 资本家 资本主义 华尔街 机器人 微软 代码 技术 Markdown 肯德基 花园serena 花園セレナ 交通运输 大卡车 摩托车 电动车 汽车 健康 DD情报局 是牧羊女 盎然酱 中国风 中國風 进击的冰糖 申䒕雅 Shen Xiaoya 上海广播电视台 Shanghai Media Group Limited 四川熊猫协会 Sichuan Panda Association ao3 pixiv cf教父 王戈wg 吃草莓的果子狸 萌宠 国宝 youtube niconico 时下流行 地瓜鸽子丶 Archive of Our Own 搞笑 恶搞 Tupolevbureau 行星之牙w午休傻 永远永远酱w 苍井空 波多野结衣 暴走漫画 王尼玛 马保国 ma baoguo 年轻人不讲武德 耗子尾汁 表情包 独轮车 nightbot 夜酱 哔哩哔哩 bilibili vtuber 英雄联盟 League of Legends 王者荣耀 Honor of Kings 明日方舟 Arknights 碧蓝航线 Azur Lane 原神 Genshin Impact 孙悟空 sun wukong 曹操 cao cao 刘备 liu bei ホロライブ hololive 诸葛亮 诸葛孔明 ZhuGe Kongming 王司徒 Wang Situ 金坷垃 noripro 恶俗娘 Esugirl 心萪 Xin Ke 新科娘 Shinka Musume 咕噜大魔王w cv某神话 cctv新科动漫 བོད་ཡིག། tibet 西藏 藏语 维吾尔语 ئۇيغۇر تىلى 虚拟up主 喜羊羊与灰太狼 Pleasant Goat and Big Big Wolf 美羊羊 Mei yangyang 懒羊羊 lan yangyang 沸羊羊 fei yangyang 陈昱昊 chen lihao 陈导师 宫本美代子 二次元 Two Dimensional 巴啦啦小魔仙 凌美琪 Ling Meiqi 凌美雪 Ling Meixue 大当家 12dora 李洪志被孙笑川殴打 Li Hongzhi was beaten by Sun Xiaochuan 射精 ejaculate 灰太狼内射蔡英文 Hui Tailang fucks Tsai Ing-wen 1989年政治风波 Chinese political turmoil of 1989 暴徒残忍杀害解放军 Thugs brutally killed people's Liberation Army 开挂 Open Hanging overidea 张京华 kyou ka 黑桃影 Spade Echo 史蒂夫 steve 操你妈藏独 mother fucker free tibet 新疆维吾尔人肏郭文贵亲妈 Xinjiang Uyghur fucks Guo Wengui mother 明秽网 Shithui 大妓院 Bitchtimes 邪教法轮功 Cult Falun Gong 掏粪男孩 tfboys 王源 Wang Yuan 王俊凯 Wang Junkai 易烊千玺 Yi Yangqianxi 伏拉夫 财富密码 maxkim 籽岷 Zi Min 达赖喇嘛卖枪被美国警察击毙 Dalai Lama was killed by American police for selling guns 敬汉卿和白上吹雪床上运动 Jing Hanqing and Shirakami Fubuki exercise on bed 我的世界 minecraft 角巻わため 角卷绵芽 香蕉君 Ricardo Milos 肖战 Xiao Zhan 王一博 Wang Yibo 神楽めあ 神乐mea Kagura Mea 湊あくあ 湊-阿库娅 Minato Aqua 张三 Zhang San 罗翔讲刑法 Luo Xiang Speaking of Criminal Law 陈情令 chen qingling 谷乡元昭 Tanigou_Motoaki 福田一行 Fukuda_Ikko 须田仁之 Suda_Kimiyuki 犬山たまき 犬山玉姬 ak47 快手 Kuaishou 抖音 Tiktok 土味 m4a1 mp5 戌神ころね 戌神沁音 司马南 Si Manan 崔永元 Cui Yongyuan 方方 老鼠榨汁 Mouse Juice 三吱 猫又おかゆ 猫又小粥 电蚊拍 粉丝会 兎田ぺこら 兔田佩克拉 谷乡元昭 福田一行 须田仁之 安倍晋三 菅义伟 潤羽るしあ 润羽露西娅 炎上 杀虫剂 刘德华 周杰伦 猪猪侠 小猪佩奇 土味 古风电音 白上フブキ 白上吹雪 熊大 熊二 光头强 张靓颖 邓紫棋 张艺兴 说唱 饭圈 穿越火线 反恐精英 星街彗星 星街すいせい 猫宫日向 隐神木荫 九石玉 斗鱼 虎牙 赤井はあと 赤井心 宋旺霖 姚纳多 肖彦锐 磁大师 周淑怡 夏色まつり 夏色祭 马牛逼 神楽七奈 かぐらなな 鹿乃 卢本伟 wh1t3zz 虎哥 刀哥 沃玛 warma hanser 憨八嘎 泠鸢yousa 冷鸟 魔法少女乐府酱 孙笑川 吴亦凡 蔡徐坤 鸡你太美 敬汉卿 死神之子 女胖胖 徐梦圆 屑狐狸 国家一级保护动物 徐大sao lexburner 卡布奇诺 芜湖大司马 csgo大茄子 萌宠 国宝 佃煮海苔男 成都大熊猫繁育研究基地 桐生可可 桐生ココ kson 蛆皇 石巍斌 小学生 李可欣 徐文楷 凤凰战士 电牛子 奥利给 奥力给 朝阳冬泳怪鸽 pdd骚猪 刘谋 韩金龙 nga玩家社区 电竞 最终幻想7,三国志14,生化危机3,集合啦!动物之森,仁王2,赛博朋克2077,女神异闻录5,魔兽争霸3重制版,Destiny,部落与弯刀 Sands of Salzaar,中国式家长,刺激战场,绝地求生,第五人格,三国,传奇,助手,游戏,腾讯,网易,全军出击,三国杀,传奇私服,阴阳师,三国游戏,荒野行动,策略,仙剑,皇室战争,传奇游戏,修仙,策略游戏,传奇游戏,英雄杀,传奇霸业,热血传说,战争,梦幻家园,动作游戏,时空召唤,乱世王者,游戏大全,寻仙,传奇单机,魔兽,仙侠游戏,三国策略,铁头英雄,自由幻想,荒野求生,绝地,英魂,热血传奇,lol,虚荣,陪我,时空猎人,热血,剑灵,mt,免费游戏,守望先锋,策略三国,打仗游戏,game,小小英雄,世界,王者传奇,战争游戏,自由之战,混沌与秩序,小米超神,先锋,征途,火线精英,我是mt,修真,大型游戏,剑三,烈火传奇,梦三国,魔域口袋,求生,荒野,剑雨,dota2,联机游戏,回合游戏,传世,成人游戏,3v3,赚钱游戏,决战,指尖,掌上,热门游戏,阿瓦隆,征途2,三国杀单机,网络游戏,战争策略,英雄榜,策略卡牌,刀锋世界,英雄,烈焰传奇,中文版,荣耀联盟,全面战争,games,绝地求生。,二、求生之路,混沌,游泳,战国时代,七雄争霸,混沌与秩序2,对战游戏,Ping,游戏人生,我叫,奇迹,新世界,小小军团,3v3游戏,5v5游戏,掌上青城,解压游戏,水煮三国,仙剑情缘,娱乐,时空,地主,平台,王者纪元,天堂,情侣,炫酷游戏,战场,热血私服,战争艺术,天堂2,魂斗罗经典,三国策,剑网,荒岛,跳舞游戏,龙之谷,竞技游戏,久游,传奇英雄,免费游戏大全,阴阳,欧陆战争5,世界迷雾,同城游戏,我的英雄学院,天堂虚荣,魔界,三国策略游戏,偶像梦幻祭,龙城,谋定三国,陪聊,指尖帝国,乱世枭雄,刺激游戏,mata,真三国,自由之战2,蜀山传奇,战国七雄,下跪天堂,世界战争英雄,掌上联盟,永恒传说,三国之刃,沙盒游戏,人格,热血永恒,对战,乱战三国,超能战队,永恒,英雄坛说,热血传奇1.76,仙灵,凡人修真,铁头,学院,召唤,长安,两人游戏,新三国杀,天使,新游戏,传说,九天使,战争进化,战斗,斗罗,帝王三国,仙侣奇缘,攻略,古代战争,慢动作,策略养成,自由,mp4,正版传奇,无尽,遊戲,诺亚传说,梦幻庄园,超凡三国,刀锋,魔芋,王者对决,混沌之戒,我叫mt3,tgp地下城,策略塔防,战争雷霆,守望,地下,仙途,口袋学院,大人游戏,英雄战歌,求生游戏,末日求生,牌类游戏,倩女幽魂2,陪你,剑侠奇缘,六龙争霸,龙之牧场,5v5竞技,孤岛,爆笑三国,傲世三国,娱乐游戏,终结者二,策略类游戏,生存世界,经营策略游戏,亲朋游戏,第五人格。,三、世界战争,荒岛特训,龙之岛,偶像,绝地战场,乱世,棋牌,创造游戏,电玩游戏,仙履奇缘,小世界,仙剑单机,守望英雄,无网游戏,白蛇传说,热血高校,富甲天下,召唤师,你的世界,荒岛生存,三国名将,我是传奇,争霸,单机动作游戏,合击传奇,超神,模拟战争,连机游戏,英雄传说,三国战场,lolo,橘子娱乐,火线传奇,出击,红斗罗,战争与秩序,修真世界,新游,陪游,我的家园,最火游戏,烽火战国,三国英雄传,免费游戏下载大全,组我,steam游戏,升级游戏,三国游戏单机,混乱与秩序,小小三国,逐鹿三国,电影游戏,找东西游戏,三國,激战奇轮,终极者,超时空,英雄战魂,英雄使命,行动,战争策略游戏,网页游戏,征服,之乎,九游游戏,现在战争,热血之刃,梦幻龙族,无尽争霸,5vs5,无尽梦魇,王者召唤,玛法传奇,对打,车祸英雄,艾尔战记,无敌,端游,魔兽塔防,5v5对战,荒岛余生,剑魂,战国策,胡来三国,团队游戏,傲视三国,未来战争,天空战记,穿越古代,水浒,之刃,二人游戏,龙世界,崩坏学院,无聊游戏,王者超神,电脑游戏,建造世界,三百英雄,推塔游戏,三国猛将,自由世界,西瓜游戏,雄霸三国,梦幻奇缘,虐杀,天使帝国,光荣,小小帝国,小小英雄传,快打三国,在线游戏,英雄行星,热血盛世,仙剑奇缘,仙剑游戏,英雄祭,时光召唤,仙剑5,仙侣,盛世三国,新传奇,秦国,战场英雄,仙剑世界,自由职业,赤月传奇,人气游戏,王者争霸,荣耀战场,仙剑问情,战场游戏,仙剑3,仙剑五。,四、三国名将传奇,太平洋战争,征战三国,5对5,守塔,女生游戏,传奇永恒,新款游戏,口袋三国,王者之心,谋三国,三国来了,蜀山奇缘,三国传奇,三国时代,即时游戏,穿越游戏,打游戏,永恒王者,烽火三国,更多游戏,狂斩三国,王者之战,战争塔防,武极天下,三国策略传奇,传奇无双,战争英雄,战神荣耀,混搭与秩序,所有免费游戏,王者世界,流行游戏,暴龙,无尽的传说,逆转三国,自由游戏,自由之翼,小小塔防,荣耀三国,三国类游戏,有趣游戏,挑战游戏,热血王者,英雄远征,梦幻之翼,传奇归来,暗黑地下城,卖东西游戏,游戏,,指尖刀塔,大话三国,的游戏,坑人游戏,众神之战,英雄徽章,乱斗三国,剑神,悠闲游戏,横扫三国,三国攻城,天剑奇缘,超神英雄,超神之路,赵云传奇,绝地求生,大逃杀,吃鸡,反恐精英:全球攻势,WallpaperEngine,Dota2,刀塔2,侠盗猎车手5,求生之路2,怪物猎人:世界,巫师3:狂猎,无主之地2,饥荒联机版,星际战甲,判变,文明5,杀戮尖塔,收获日2,全境封锁,古墓丽影:崛起,以撒的结合:重生,传送门2,战斗砖块剧场,都市:天际线,蝙蝠侠:阿甘骑士,欧洲卡车模拟,奇异人生,军团要塞,巧克力和香子兰,GTA5,天命奇御,波西亚时光,腐蚀,愤怒军团,龙魂时刻,斗兽战棋,,艾希,三色绘恋,波西亚时光,返校,代价,死神来了,超级巨星,地狱少女,拉比哩比,万圣节大冒险,点点联盟,龙骑士,困兽禁地,武器店物语,斯巴达大战僵尸,前进,天空塔,孤姬,我和她的世界末日,方块枪,拯救大魔王,没有人知道的大冒险。,五、美好世界,龙崖,山桂,光明重影,上帝之城,血色代码,流浪者,商人传说,初体计划,僵死之日,巫术花园,电竞俱乐部,小三角大英雄,冷鲜肉,你抓不到我,猫猫游戏,恶果之地,前程似锦,我是英雄,十二色的季节,方舟,生存进化,神界,原罪,色情,小黄油,成人内容,裸露,暴露,暴力,血腥,色情内容,搞笑,休闲,欢乐,沙盒,怀旧,可爱,快节奏,动作角色扮演,卡牌,爱情,战术角色扮演,轻游戏,策略角色扮演,少女游戏,超级英雄,角色动作,体验,关羽,吕布,张飞,赵云,黄忠,诸葛亮,郭嘉,袁绍,袁术,曹操,典韦,许褚,张辽,徐晃,张郃,孙权,刘备,孙策,太史慈,姜维,马超,韩信,貂蝉,小乔,大乔,西施,王昭君,杨玉环,孙尚香,花木兰,孙悟空,紫霞仙子,后羿,牛魔王,西游,西游记,三国演义,三国志,水浒传,潘金莲,武松,鲁智深,林冲,林黛玉,红楼梦,全民王者,神之浩劫,赤潮,好玩游戏,好玩的游戏,女神,部落,好评,好评如潮,好评游戏,好评如潮游戏,流放之路,足球经理,人渣,枪火游侠,钢铁雄心,黑色沙漠,死亡边界,战团,无人深空,影之诗。,六、神庙逃亡电脑版,拳皇,数独,使命召唤,射雕英雄传,保垒之夜,欢乐斗地主,黄金矿工,大富翁,超级玛丽,合金弹头,泡泡堂,仁王,猎天使魔女,密室逃脱,暴力摩托,幽灵行动,三国战记,坦克大战,攻城略地,极品台球,不义联盟,找你妹,斗罗大陆,盗墓笔记,创世纪,杀破狼,塔防三国志,神仙道,群英会,弹弹堂,大皇帝,满江红,战争之王绝代双骄,传奇霸业,攻城掠地,东风破,朝歌,小李飞刀,王朝霸域,梦幻西游,逆水寒,天涯明月刀,坦克世界,穿越火线,神武,问道,诛仙,新倩女幽魂,剑灵,逆战,封印者,天龙八部,激战,风暴英雄,九阴真经,游戏人生,传奇世界,流星蝴蝶剑,灵山奇缘,斗战神,少年三国志,炉石传说,崩坏,楚留香,三国乱世,城堡争霸,三国如龙传,放开那三国,部落战争,魔法王座,啪啪三国,神魔,逐鹿中原,火箭联盟,勇者斗恶龙,深岩银河,传说法师,乌托邦,丛林地狱,地下城,火星求生,铁路帝国,信使,史诗级战争模拟器,开拓者,死亡岛,终极合集,天国:拯救,猎杀,对决,守墓人,求生伐,战镰,奇异人生,异星工厂,幽灵主义,亚利桑那阳光,不列颠的王座,魔能,空洞骑士,无穷无尽,命运石之门,莎木,潮汐之王,多人玩的游戏,城市,天际线,精灵与森林,冰汽时代,耻辱,鬼泣,龙之信条,黑暗觉醒,大神,影子战术,狂战传说,街霸,少女射击,刀剑神域,热情传说,女巫来了,夜袭,生化奇兵,王国风云,铁拳,隐龙传,尘世之狼,圣殿春秋,兄弟,堕落军团,陷阵之志,史前埃及,泰坦之旅,女神骑士团,爆裂,鬼刃,福利,礼包,奖励,良心,良心游戏,国产良心,勇士,公会,战队,青铜,白银,黄金,大师,白金,钻石,至尊,宝箱,符文,宝石,红钻,金币,美人,美女,妹子。,七、这是我的战争,星露谷物语,以撒的结合：重生,洪潮之焰,塔科马,拯救者,掘地求升,远征军：维京,方舟生存进化,疯狂之冠,救赎之路,光明记忆,金庸群侠传,幻想三国志,三国志：汉末霸业,圣女战旗,红石遗迹,无名之辈,侠客前传,归家异途,侠客风云传,光荣使命,符石守护者,高考恋爱100天,轩辕剑,失落城堡,风卷残云,新剑侠传奇,古剑奇谭,仙剑奇侠传,古龙群侠传,剑侠情缘,三国群英传,盐和避难所,废品机械师,看火人,旁观者,影子战术将军之刃,人类：一败涂地,血战西部,暗黑地牢,防御阵型,挺进地牢,传说之下,墓园,奥日与黑暗森林,拳击俱乐部,见证者,星球基地,以撒的结合：胎衣,天空之山,监狱建筑师,环世界,崩溃大陆,荒神,星界边境,无人之境,风之旅人,旅途,机械迷城,堡垒,菲斯,地狱边境,死亡细胞,终结将至,缺氧,逃脱者,茶杯头,街头霸王,量子破碎,黑暗之魂,羞辱,地铁：最后的曙光,生化奇兵：无限,蝙蝠侠：阿甘骑士,彩虹六号围攻,罗马之子,死或生,细胞分裂,武装突袭,孤岛危机,勿忘我,合金装备崛起复仇,刺客信条：枭雄,刺客信条：大革命,失落的星球,死亡空间,正当防卫,堕落之王,飙酷车神,刺客之王,蝙蝠侠：阿甘之城,暗黑血统,无限试驾,尘埃,子弹风暴,火爆狂飙：天堂,波斯王子,镜之边缘：催化剂,杀出重围人类分裂,质量效应：仙女座,毁灭战士,极限竞速,最终幻想,极品飞车,战地,牧场物语希望之光,不朽星球,诞生,魔界战记,妖精剑士,模拟狩猎,风语世界,三位一体,辐射避难所,万亿魔坏神,万众狂欢,放逐之城,暗影之刃,星球探险家,圣铠传说,王国英雄,进化之地,地狱潜者,光之子,双星物语,功夫熊猫,模拟人生,愤怒的小鸟,孢子,无夜之国,战神：夜袭,命运之手,东京迷城,超级马里奥奥德赛,荒野大镖客救赎,猎人：野性的呼唤,永恒之柱,合金装备幸存,异度之刃,流放者柯南,讨鬼传,孤岛惊魂原始杀戮,极限巅峰,海岛大亨,异星探险家,未转变者,看门狗,泰拉瑞亚,魔方世界,黑道圣徒,我的世界,上古卷轴,热血无赖,怪物猎人：世界,侏罗纪世界进化,塞尔达：荒野之息,刺客信条起源,混乱特工,盗贼之海,花园战争,死亡净化爆发,亿万僵尸,剑勇传奇,植物大战僵尸,启示录,腐烂国度,消逝的光芒,脱逃者：行尸走肉,求生指南,枪血黑手党,七日杀,节奏地牢,逃离死亡岛,僵尸维京,生化危机,往日不再,寂静岭：归乡,失忆症：黑暗后裔,唯一的幸存者,失忆症：猪猡,寂静岭：暴雨,逃生,死光,心灵杀手,沉睡之间,畸形,阴暗森林,异形：隔离,遗忘,光之镇,悬案：刹那惊颤,伊森卡特的消失,劫后余生：夺回,阿拉亚,地堡,小镇惊魂,恶灵附身,血源,昏迷,谋杀：灵魂疑犯,层层恐惧,白夜,太阳浩劫,黎明杀机,恐怖黎明,夜啼,直到黎明,无可救药,病号,黑镜,深夜廻,报复,灵魂筹码,漫漫长夜,吸血鬼,掠食,观察者,小梦魇,地狱之刃,深海迷航,战争机器,帝国：全面战争,信长之野望,帝国时代,魔兽争霸3,鹰击长空,狙击精英,骑马与砍杀,荣誉勋章,伟大时代：中世纪,地球防卫军,星球大战前线,战国无双,星际殖民,真三英杰传,战场女武神,剑刃风暴,真三国无双,奇点灰烬,灰蛊,泰坦陨落,文明：太空,幽浮,星际战舰,阿提拉：全面战争,英雄无敌3,银河文明,星际争霸,哥特舰队,群星,战锤：全面战争,女武神：苍蓝革命,荣耀战魂,星战前线,战锤：末世鼠疫,全战：不列颠王座,战争黎明,天国拯救,堡垒之夜,武林志,武林至尊,江湖,侠客,剑客,武林盟主,屠龙刀,二次元,暗黑破坏神,全民超神,英魂之刃,皇室战争,部落冲突。,八、打倒魔王的方法,夜雪冰娇,逆袭幻想传,美臀外卖,神医魔导,美女湾度假村,未发送的信,低魔时代,风之幻想曲,无尽之路,黄金之心,纂位者,公主的逃脱日常,冒险者与背包,风雷幻想曲,深海恶梦,星际冲突,宝石战纪,亿万大亨,巫术花园,掌控者,女巫剑,午后帝国,我在古堡炼金,果冻老爹,魔物娘物语,三巨头,你必须造一艘船,废宅魔王的幸福生活,求生大作战,梦蝶,三国传进化,淑女同萌,帝国主义,轮回与梦之旅人,回忆忘却之匣,炽热狙击,埋葬,坠落之后,卡牌大决斗,造王者,正义联盟,暗影议会,崩溃制造,帝国重生,空箱,东方火车,基因雨,简体中文,繁体中文,温室之城,鬼畜大冒险,秋之回忆,且听琴语,封神榜,五行师,魔物娘物语,忍者村大战,美丽新世界,吃鸡版,加速器,盒子,助手,代练,主播游戏,阿达三国志,无忧传奇,魅影传说,无敌天下,庐石传说,逆转三国,动作类游戏,赵云传奇,免费游戏女孩,老传奇,爬塔,传神,自由搏击,三国时代,城邦争霸,战国传承,有趣游戏,唯美游戏,所有免费游戏,外国游戏,分类游戏,纷争,更多游戏,龙之影,暗黑地下城,召唤神龙,如实传说,单件游戏,免费试用,魔域永恒,动脑游戏,超神之路,英雄坛,自由世界,横扫三国,策略战棋,最近游戏,悠闲游戏,高级游戏,炽天使,小龙游戏,游戏圈,我游戏,快游,火爆游戏,龙之契约,超神英雄,动作卡牌,英雄游戏,雷霆传奇,士兵荣耀,全面超神,盗梦英雄,伤害世界,战争策略游戏,虚荣vainglory,荒岛逃生,三国曹操,龙之召唤,操作游戏,任务游戏,霸三国,战龙三国,梦幻传说,打击游戏,打天下,皇室冲突,免费游戏排行,乱战三国,传奇英雄游戏,统一三国,暴打三国,时空之刃,全能英雄,战争风暴,我的部落,大闹三国,古风手游,伟大战争,女性游戏,激情游戏,征战,快打三国,关卡游戏,小小英雄传,魔兽单机,梦回三国,三国策略单机,通关游戏,红包游戏,英雄之剑,三国武神,三国英雄,卧龙三国,水浒三国,新三国,魔兽三国,攻防游戏,传奇传奇,天下无双,战争之王,热血帝王,网游三国,吞食三国,兵圣三国,水浒传奇,烈鸟传奇,传奇乱世,自由战争,三国娱乐,群雄争霸,荣耀征途,勇者荣耀,游戏三国,皇室荣耀,荣耀王者,荣誉,至尊荣耀,多塔学院,倒塔,王者虚荣,精品游戏,多塔联盟,无尽纷争,多塔传说,天堂之翼,霸王传说,英雄荣誉,英雄战场,大英雄,三国斩,远古战争,大众游戏,剑圣,自由战士,战国物语,英雄本色,正义之战,战场风云,新游,再战传奇,天尊传奇,散打游戏,王者归来,英雄之城,游戏王者,战国之王,王者之怒,三国之争,超神战迹,精选游戏,付费游戏,自由之光,世界游戏,游戏果粉,帝王纷争,英雄凯歌,英雄志,英雄争霸,激战三国,困难游戏,锤子三国,英雄动作,卡片三国,三国城池,英雄传奇,龙将三国,英雄兵团,决策三国,醉三国,懒人三国,霸气三国,英雄无畏,英雄之歌,纵横三国,九州三国,武林三国,武打游戏,本地游戏,搭防游戏,励志游戏,塔防战争,西游三国,英雄三国志,霸业三国,愿望单,评测游戏,游戏评测,鉴赏家推荐游戏,热销游戏,热销商品,精选游戏，我喜欢的游戏,便宜的游戏,合适喜加一的游戏,最新大作,最新3A游戏,特价游戏,降价游戏,促销游戏,每周特惠,夏日特卖游戏,冬季特卖游戏,最值得买的游戏,露西-她所希望的一切,元气骑士,好大夫,大天使之剑,刺客,大人游戏,橘子娱乐,帅土之滨,创造游戏,四大名著,即时游戏,塔防部落,刺客游戏,圣骑士,城建,刺杀,大战略,挑战游戏,高级游戏,最近游戏,色游戏,星座游戏,操作,为了部落,游戏头条,守护部落,部落战歌,部落时代,部落之战,终极刺客,部落奇兵,守卫部落,游戏赚钱,随机游戏,大神游戏,各种游戏,游戏宝盒,畅销游戏,游戏多多,大众游戏,华夏游戏,暴力游戏,侠之大者,四大名将,中国游戏,官方游戏,本地游戏,金典游戏,养成类游戏,养成游戏,经营游戏,卡牌回合,沙盒游戏,竞技卡牌,暴雪游戏,卡牌收集,防御游戏,穿越游戏,少女养成,日系游戏,有戏,游戏商城,桌游卡牌,军队塔防,远古战争,澄海3C,部落塔防游戏,独立战争,原始战争,兄弟战争,女神养成,全球免费,本周免费,游戏果粉,塔牌,微博游戏,塔防无双,插卡游戏,空间游戏,休息游戏,流星蝴蝶剑,挂机,梦幻西游单机版,单机游戏角色,单机武侠,搜索游戏,声优游戏,搞怪游戏,奇幻塔防,女人,女生,死神,最囧游戏,逃离公司,神秘海域4,僵尸尖叫,暗黑游戏,地狱边境,神秘海域,暗黑游戏边境之旅,末日生存,死神来了,声控游戏,惨无人道,鬼游戏,推理游戏,暗黑3,探险游戏,生存类游戏,暗黑单机,澳大利亚,痛苦地狱,人格分裂,拾荒,惊悚乐园,暗黑崛起,暗黑三,史上最牛,唯美游戏,趣味游戏,暗黑大陆,待机游戏,斗鱼直播,虎牙直播,非人学园,光荣使命,激情影院,拳王,跑步游戏,午夜直播,steam令牌,同城游戏,吃雞,智利游戏,初夜,亲朋游戏,无网游戏,连机游戏,基站,江湖风云,正版游戏,王者之心,联众游戏,赌博游戏,天使会,不夜城,命运之塔,堡垒子夜,王者农药,激情男女,吉祥游戏,激情恋爱,重生游戏,黑夜战机,深夜快播,一元游戏,更新游戏,通讯游戏,现实免费,激情交友,社区游戏,微游戏,小说,三国志单机,梦三国,黄色小说,滕讯游戏,貂蝉别跑,神马三国,金庸群侠传,阿瓦隆,单机武侠,跑步游戏,金庸武侠,意大利游戏,抖机灵游戏,死肥宅游戏,双点医院,浮渣,東周列萌志,煮糊了,地狱之刃：塞娜的献祭,韦诺之战,13号星期五:杀手谜题,空甲战争：进攻,战舰世界,家有大貓,战争仪式,裂痕,人类一败涂地,实验室,搬运鼠,永恒之夏,枪炮世界,火药瘾君子,战争雷霆,小缇娜的龙堡之袭,丧尸恐慌,九、CS:GO,H1Z1:生死挣扎,求生之路2,GTA5,英雄萨姆Fusion 2017(beta),逃生,传送门2,影子武士,辐射4,国土防线,巫师3:狂猎,王国:经典,英雄连2,层层恐惧,腐蚀(Rust),饥荒:联机版,盖瑞模组,杀戮空间,星露谷物语,传送门,调查局:幽浮解密,行尸走肉,叛变,方舟:生存进化,漫漫长夜,茶杯头,海市蜃楼:秘密战争,神界:原罪2,基佬大乱斗,火柴人战斗,史莱姆牧场,黑色沙漠OL,COD14:二战,幽灵行动:荒野,亲爱的艾丝特：里程碑版,空洞骑士,战锤40K:永恒远征,中土世界:战争之影,尼尔:机械纪元,流放者柯南,传送门骑士,战锤:全面战争2,死亡细胞,乐高世界,缺氧,掠食,油管主播的生活,星球采矿者,反恐精英:起源,反恐精英:零战行动,半条命2,DOTA2,彩虹六号:围攻,武装突袭3,黑暗之魂3,荣耀战魂,尼尔:机械纪元,上古卷轴OL:无限的泰姆瑞尔,欧洲卡车模拟2,过山车之星,狙击精英4,黎明杀机,军团要塞2,XCOM2,战争雷霆,流放者柯南,城市:天际线,生化危机7,RUST,收获日2,战斗砖块剧场,文明5,文明6,全境封锁,城堡破坏者,植物大战僵尸:年度版,Beholder,黑道圣徒4,没有人知道的大冒险,地狱潜者,上帝之城1:监狱帝国,地铁2033,地铁:最后的曙光,黑道圣徒2,猎天使魔女,星际编年史:Delta像限,杀手5:赦免,水下之旅,Merger 3D,机械制造:重生,心灵杀手:美国噩梦,双子星座2,地下城2,红色管弦乐队2,命运之手,奇异领域,晶体管,胜利之日:起源,行尸走肉,热血无赖:终极版,命运石之门,竖持战斗,宅男的幻想,猎人:野性的呼唤,暗黑地牢,幽闭圣地2,杀手已死:噩梦般,野兽传奇,三国:经典,层层恐惧原生,调查局:幽浮解密,拜金女孩,恶灵附身2,仁王:完全版,NBA,狙击精英4,和班尼特福迪一起攻克难关,黑暗与光明,Will:美好世界,篱笆庄秘闻,红石遗迹,光明重影,且听琴语,恶魔迷宫,拉比哩比,侠客风云传, 文明6,天国拯救,战争黎明3,三国志13PK,光环战争2,狙击精英4,新高达破坏者,真三国无双8,全战：不列颠王座,中土世界战争之影,战锤：末世鼠疫2,命运2,突袭4,军团1944,星战前线2,诺曼底44,荣耀战魂,信长野望大志,战场女武神4,女武神：苍蓝革命,战国无双：真田丸,战锤：全面战争2,群星,哥特舰队,战争机器4,星际争霸2,银河文明3,英雄无敌7,旗帜的传说2,纪元2205,勇敢的心世界大战,德军总部：新秩序,阿提拉：全面战争,星际战舰,幽浮2,文明：太空,泰坦陨落2,灰蛊,奇点灰烬,真三国无双7,战国BASARA4,战锤：全面战争,中土世界暗影魔多,要塞十字军东征2,剑刃风暴,太空战舰,战场女武神,家园重制版,真三英杰传,星际殖民2,战国无双4-2,星球大战前线,地球防卫军4.1,伟大时代：中世纪,家园卡拉克沙漠,三国志12,玩具士兵,荣誉勋章,骑马与砍杀,狙击精英V2,武装突袭3,鹰击长空2,皇牌空战7,全战：幕府将军2,罗马2：全面战争,拿破仑：全面战争,家园2,星际争霸,三国志10,魔兽争霸3,德军总部,帝国时代2,三国群英传7,信长之野望13,太阁立志传5,帝国：全面战争,战争机器,深海迷航,逃生2,恶灵附身2,地狱之刃,小梦魇,观察者,掠食,吸血鬼,漫漫长夜,十三号星期五,极限脱出九人游戏,灵魂筹码,报复,深夜廻,黑镜,2Dark,你好邻居,病号,无可救药,白色情人节：校园迷宫,直到黎明,夜啼,恐怖黎明,毁灭战士4,黎明杀机,太阳浩劫,白夜,层层恐惧,玩具熊五夜后宫4,谋杀：灵魂疑犯,零：濡鸦之巫女,SOMA,昏迷,血源,恶灵附身,小镇惊魂,地堡,Inside,阿拉亚,劫后余生：夺回,伊森卡特的消失,悬案：刹那惊颤光之镇,遗忘,异形：隔离,阴暗森林,森林,曙光,白化摇篮曲,畸形,沉睡之间,鬼屋魔影启蒙,心灵杀手,死光,死亡空间3,逃生,七日杀,死亡空间2,寂静岭：暴雨,失忆症：猪猡,唯一的幸存者,失忆症：黑暗后裔,半条命：恐惧之泣,死亡空间,寂静岭3,半条命2,寂静岭5：归乡,往日不再,生化危机7,行尸走肉3,腐烂国度2,丧尸围城4,恐怖僵尸之夜,行尸走肉：最终季,合金装备：幸存,海王星VS僵尸军团,行尸走肉：米琼恩,求生指南2,丧尸围城,亿万僵尸,生化危机0,死亡净化爆发,消逝的光芒：信徒,生化危机2：重置版,生化危机保护伞小队,PVZ：花园战争2,美国末日,生化危机6,DayZ,H1Z1,消逝的光芒,腐烂国度,生化危机：启示录,植物大战僵尸2,生化危机启示录2,剑勇传奇忍者龙剑传Z,节奏地牢,僵尸,丧尸围城3,七日杀,未转变者,枪血黑手党,行尸走肉：第二季,求生指南：第三人称,脱逃者：行尸走肉,僵尸部队三部曲,僵尸维京,生化危机HD,逃离死亡岛,植物大战僵尸：花园战争,行尸走肉,求生之路2,死光,丧尸围城2,死亡岛,潜行者：普里皮亚季的召唤,生化危机：浣熊市行动,求生之路,生化危机5,生化危机4,生化危机3,生化危机2,植物大战僵尸,盗贼之海,绝地求生,堡垒之夜,战神4,孤岛惊魂5,混乱特工,方舟生存进化,刺客信条起源,塞尔达：荒野之息,侏罗纪世界进化,怪物猎人：世界,杀手2,讨鬼传2,流放者柯南,波西亚时光,最终幻想15,异度之刃2,合金装备幸存,永恒之柱2,猎人：野性的呼唤,荒野大镖客救赎2,超级马里奥奥德赛杀手6,看门狗2,正当防卫3,巫师3狂猎,辐射4,羞辱2,无人深空,极限巅峰,合金装备5原爆点,合金装备5幻痛,孤岛惊魂原始杀戮,看门狗,未转变者,环世界,异星探险家,海岛大亨5,孤岛惊魂4,成长家园2,模拟山羊,疯狂的麦克斯,坎巴拉太空计划,蝙蝠侠：阿甘骑士,成长家园,超大城市,废品机械师,热血无赖,羞辱,上古卷轴5,正当防卫2,我的世界,黑道圣徒4,魔方世界,质量效应3,孤岛惊魂3,质量效应2,泰拉瑞亚,饥荒,辐射3,正当防卫,上古卷轴4,海岛大亨3,上古卷轴3,杀戮尖塔,东京迷城,九张羊皮纸,命运之手2,战神：夜袭,无夜之国2,小魔女学园,大神：绝景版,最终幻想世界,乐高漫威英雄2,奇异人生暴风前夕,柴堆,过气英雄,荒野八人组,蝙蝠侠内敌,城市帝国,方根书简,银河护卫队,追云者编年史,塞伯利亚之谜3,乐高都市卧底风云,MC：故事模式2,Rime,Hob,东京42,模拟狩猎,妖精剑士F,魔界战记2,诞生,落水狗血战日,不朽星球,牧场物语希望之光,薄樱鬼：风之章,放逐之城,万众狂欢,模拟人生4,万亿魔坏神,辐射避难所,赛马大亨8,三位一体3,模拟农场17,风语世界2：沉寂,模拟火车：新时代,魔法季节沉睡大地,火箭联盟,夏日课堂,星球基地,游戏开发者,模拟挖掘机,狂热火车,乐高蝙蝠侠3,特技摩托聚变,星球探险家,暗影之刃,麦克斯：兄弟魔咒,光之子,地狱潜者,热血进行曲,大厦管理者,进化之地2,王国英雄2,圣铠传说,无主之地传说,星露谷物语,海之号角神秘海怪,南方公园真理之杖,迷你忍者,孢子,愤怒的小鸟,模拟人生3,模拟城市5,旋转轮胎,超级食肉男孩,功夫熊猫,双星物语2,三位一体2,三位一体,命运2,战地5,极品飞车20,最终幻想15,极限竞速7,毁灭战士4,NBA 2K18,全境封锁,质量效应：仙女座,杀出重围人类分裂,镜之边缘：催化剂,羞辱2,尘埃4,黑暗之魂3,赛车计划2,量子破碎,街头霸王5,战争机器4,极品飞车19,极限竞速地平线3,古墓丽影：崛起,德军总部2新巨人,勿忘我,进化,孤岛危机3,武装突袭3,细胞分裂6,死或生5,Ryse罗马之子,彩虹六号围攻,蝙蝠侠：阿甘骑士,生化奇兵：无限,地铁：最后的曙光,飙酷车神,堕落之王,古墓丽影9,极品飞车18,正当防卫3,死亡空间3,失落的星球3,龙腾世纪审判,刺客信条：大革命,刺客信条：枭雄,合金装备崛起复仇,杀手5,尘埃3,无限试驾2,孤岛危机2,死亡空间2,暗黑血统2,极品飞车17,马克思佩恩3,蝙蝠侠：阿甘之城,巫师2：刺客之王,地铁2033,黑暗之魂,子弹风暴,神奇蜘蛛侠,细胞分裂5,杀出重围3,失落的星球2,孤岛危机,刺客信条,上古卷轴4,波斯王子3,波斯王子2,极品飞车16,镜之边缘,战争机器,细胞分裂4,极品飞车12,火爆狂飙：天堂,冰汽时代,茶杯头,逃脱者2,缺氧,终结将至,空洞骑士,盗贼之海,死亡细胞,奥日与精灵意志,热血物语地下世界,艾迪芬奇的记忆,洪潮之焰,塔科马,吃鸡模拟器,ECHO,拯救者,掘地求升,远征军：维京,方舟生存进化,佐迪亚克斯之子,尤卡大莱莉冒险,神奇小子龙之陷阱,Inside,旁观者,围攻,看火人,废品机械师,盐和避难所,这是我的战争,晶体管,星露谷物语,以撒的结合：重生,赛博朋克酒保行动,墓园,传说之下,她的故事,挺进地牢,防御阵型2,暗黑地牢,血战西部,ABZU,人类：一败涂地,美国卡车模拟,影子战术将军之刃,星球基地,见证者,脱逃者,铲子骑士,煮糊了,拳击俱乐部,60秒！,奥森弗里,石油骚动,这是警察,奥日与黑暗森林,昏迷,无人之境,猫头鹰男孩,星界边境,荒神,地堡,崩溃大陆,环世界,监狱建筑师,天空之山,以撒的结合：胎衣,地狱边境,菲斯,泰拉瑞亚,堡垒,机械迷城,请出示文件,史丹利的寓言,欧洲卡车模拟2,旅途/风之旅人,天命奇御,疯狂之冠,汐,幻,救赎之路,光明记忆,金庸群侠传5,波西亚时光,幻想三国志5,戎马丹心汉匈决战,三国志：汉末霸业,圣女战旗,红石遗迹,神舞幻想,王者荣耀,荒野行动,吞食孔明传,河洛群侠传,初体计划,英雄就是我,无名之辈,上帝之城监狱帝国,侠客前传,归家异途,侠客风云传,光荣使命,ICEY,圣女之歌零,符石守护者,仙剑奇侠传6,仙剑奇侠传5,高考恋爱100天,轩辕剑外传穹之扉,轩辕剑6,失落城堡,风卷残云,古剑奇谭2,洛川群侠传,新剑侠传奇,御天降魔传,古剑奇谭,仙剑奇侠传5前传,雨血前传：蜃楼,轩辕剑外传云之遥,轩辕剑5,三国群英6,三国群英7,风色幻想6,幻想三国4,仙剑3外传,风色幻想XX,仙剑奇侠传2,仙剑奇侠传3,仙剑奇侠传4,轩辕剑外传汉之云,轩辕剑4,三国群英5,武林立志传,风色幻想5,轩辕剑4外传：苍之涛,轩辕剑3,大富翁4,仙剑奇侠传,金庸群侠传,幻世录2,炎龙骑士团,明星三缺一,古龙群侠传,剑侠情缘2,轩辕剑3外传天之痕,古墓丽影：暗影,劳拉•克劳馥, Shadow of the Tomb Raider,太吾绘卷,刺客信条:奥德赛,刺客信条5, 刺客信条6,七人杀阵,NBA 2K19,暗影：觉醒,NARUTO TO BORUTO: SHINOBI STRIKER,消逝的光芒：仇恨,东方大战争,疯狂炼金师,国战:列国志传,灵魂筹码,三国志:汉末霸业,武侠乂,色情游戏, 独立游戏,动作游戏,冒险游戏,休闲游戏,策略游戏,模拟游戏,角色扮演游戏,Early Access游戏,抢先体验游戏,免费游戏,暴力游戏,单人游戏,大型多人在线游戏,体育游戏,血腥游戏,竞速游戏,多人游戏,好评原声音乐游戏,裸露游戏,氛围游戏,解谜游戏,二維游戏,色情内容游戏,恐怖游戏,日本动画游戏,剧情丰富游戏,奇幻游戏,困难游戏,开放世界游戏,科幻游戏,射击游戏,合作游戏,搞笑游戏,平台游戏,女主人翁游戏,画素风格游戏,第一人称射击游戏,第一人称视角游戏,电影游戏,生存游戏,欢乐游戏,回合制游戏,沙盒游戏,街机游戏,阖家游戏,怀旧游戏,在线合作游戏,视觉小说游戏,点击游戏,探索游戏,经典游戏,第三人称视角游戏,可爱游戏,悬疑惊悚游戏,丧尸游戏,太空游戏,教育游戏,重玩价值游戏,网络爆红游戏,战术游戏,单机多人游戏,黑暗游戏,清版射击游戏,悬疑游戏,快节奏游戏,类Rogue游戏,物理游戏,生存恐怖游戏,单机合作游戏,网络出版游戏,RPG制作大师游戏,鲜艳游戏,建造游戏,动作角色扮演游戏,放松游戏,步行模拟游戏,拟真游戏,即时战略游戏,工艺游戏,团队角色扮演游戏,回合制策略游戏,战争游戏,潜行游戏,动作冒险游戏,历史游戏,成人游戏,隐藏物件游戏,平台解谜游戏,玩家对战游戏,管理游戏,弹幕游戏,横向卷轴游戏,砍杀游戏,垂直卷轴游戏,自创角色游戏,格斗游戏,竞技游戏,第三人称射击游戏,恋爱模拟游戏,音乐游戏,塔防游戏,日系角色扮演游戏,末日游戏,黑暗奇幻游戏,光明会游戏,MMORPG游戏,轻度Rogue游戏,极简主义游戏,4人单机游戏,剧情游戏,未来游戏,中世纪游戏,迷宫探索游戏,二战游戏,爱情游戏,机器人游戏,带状卷轴动作游戏,团队导向游戏,赛博朋克游戏,等角游戏,魔法游戏,超现实游戏,军事游戏,建筑建造游戏,垂直捲轴射击游戏,纸牌游戏,回合制战斗游戏,自选历险体验游戏,类银河战士恶魔城游戏,跑酷游戏,卡通化游戏,多结局游戏,惊悚游戏,风格化游戏,黑色幽默游戏,驾驶游戏,永久死亡游戏,外星人游戏,犯罪游戏,3D 平台游戏,回合制战术游戏,桌游游戏,城市营造游戏,资源管理游戏,鲜血游戏,试验性游戏,经济游戏,关卡编辑游戏,飞行游戏,手绘游戏,原声音乐游戏,推理游戏,蒸汽朋克游戏,竞技场射击游戏,毁灭游戏,多人在线战术竞技游戏,互动小说游戏,大战略游戏,寻宝游戏,玩家合作游戏,卡通游戏,非主流经典游戏,火车游戏, 90 年代游戏,心理游戏,3D视觉洛夫克拉夫特式游戏,反乌托邦游戏,三消游戏,抽象游戏,恶魔游戏,文字为基础游戏, 80 年代游戏,假3D游戏,2D 格斗游戏,即时游戏,4X游戏,触控游戏,机甲世界游戏,即时含暂停游戏,分屏游戏,仅鼠标游戏,架空游戏,太空模拟游戏,重制游戏,忍者游戏,海盗游戏,节奏游戏,战术角色扮演游戏,恐龙游戏,黑色喜剧游戏,轻游戏游戏,策略角色扮演游戏,电竞游戏,龙游戏,迷幻游戏,3D游戏,暗杀游戏,少女游戏,战争游戏,单线剧情游戏,交易卡牌游戏,西部游戏,坦克游戏,科学游戏,竞分游戏,游戏工坊游戏,冷战游戏,超級英雄游戏,漫画游戏,体素游戏,剑术游戏,黑色游戏,电脑角色扮演游戏,六角格棋盘游戏,灵异游戏,合作战役游戏,记叙游戏,故事架构丰富游戏,创世神游戏,即时战术游戏,海军游戏,角色动作游戏,讽刺游戏,奔跑游戏,狩猎游戏,职业导向游戏,抢劫游戏,谐仿游戏,众筹游戏,无声主角游戏,足球/美式足球游戏,快速反应事件游戏,吸血鬼游戏,时空旅行游戏,贸易游戏,一战游戏,网格导向动作游戏,恶人主角游戏,哥德游戏,水底游戏,美国游戏,足球游戏,时间管理游戏,农业游戏,小说改编游戏,神话游戏,子弹时间游戏,武术游戏,狙击手游戏,钓鱼游戏,现代游戏,阴谋游戏,六自由度游戏,非线性游戏,逻辑游戏,唯美格斗游戏,弹球游戏,哲理游戏,异步多人游戏,时空操控游戏,限时游戏,背包俄罗斯方块游戏,体验游戏,越野游戏,星球大战游戏,资本主义游戏,采矿游戏,帆船游戏,工作场所不宜游戏,棋类游戏,Steam 主机游戏,不可思议迷宫游戏,罗马游戏,马匹游戏,蝙蝠侠游戏,轨道射击游戏,动态记叙游戏,赌博游戏,文字游戏游戏,火星游戏,外交游戏,标杆测试游戏,狼人游戏,推理调查游戏,打字游戏,篮球游戏,推箱子游戏,信仰游戏,高尔夫球游戏,地底游戏,交谈游戏,蓄意操控游戏,困难游戏,超人类主义游戏,小游戏,劳拉•克劳馥游戏,迷你高尔夫游戏,摔角游戏,保龄球游戏,旅鼠游戏,台球游戏,自行车游戏,外国游戏,拼字游戏,铁马游戏,优惠游戏,打折游戏,修仙游戏,新品游戏, 刺客信条2, Assassin's Creed 2 Deluxe Edition,黑暗之魂1,黑暗之魂2,黑暗之魂3, Sekiro: Shadows Die Twice,刺客信条4黑旗, Assassin’s Creed IV Black Flag,Assassin's Creed Syndicate,神力科莎：竞争, 勇者斗恶龙11：寻觅逝去的时光,丧尸围城,失眠方舟,失眠：方舟, 御侠客,闪乱神乐：沙滩戏水,神力科莎：竞技版,非对称性游戏,超好玩游戏,超级好玩游戏,英雄战迹,王者联盟,卡牌联盟,男性游戏,女人游戏,男人游戏,纵横天下,刺客信条5,无限法则,冰汽时代,行星控制:起源,冰城传奇1,冰城传奇2,冰城传奇3,冰城传奇4,冰城传奇5, 锈湖,方块逃脱,60秒!,重金属飞车,爱上火车,像素女孩,侠隐行录:困境疑云,海底寻宝,雨鸦,神社的百合香,夏荷,钢铁地牢,无双大蛇3, 无双大蛇1, 无双大蛇2, 无双大蛇4,鬼泣1, 鬼泣2, 鬼泣3, 鬼泣4, 鬼泣5, 荒野大镖客：救赎2, 古墓丽影暗影,NBA 2K19,漫威蜘蛛侠,新忍出击,实况足球2019,双点医院,梦道,我的英雄学院,莎木1+2,人渣,怪物猎人：世界,如龙0,侠客行,无双大蛇3,奇异人生2,FIFA 19,极限竞速地平线4,AC奥德赛,灵魂能力6,使命召唤15,河洛群侠传,暗黑血统3,战地5,荒野大镖客2,鬼泣5,最后生还者2,真三8,旗帜的传说3,勇者斗恶龙11,火爆狂飙：天堂重制版,刀剑乱舞,三国全战,鸟人战队,绝体绝命都市4,鬼灯的冷彻,约战：精灵再临,惊奇队长,正当防卫4,死神的遗言,客死文兰,生化危机2：重制版,御侠客,兽娘动物园,闪之轨迹4,恐龙快打,薄暮传说：重制版,漫威蜘蛛侠,勇者斗恶龙：建造者2,星际争霸：重制版,消逝的光芒：邪恶之血,少数幸运儿,心境,亡灵诡计,幽灵主义,只狼：影逝二度,火影忍者博人传：新忍出击,生化2重制,远星物语,,,十一、阿提拉：全面战争,暗黑地牢,艾森沃德传奇,奥森弗里,艾文殖民地,暗黑破坏神2,暗黑血统4,暗黑血统3,暗黑血统2,暗黑血统,阿加雷斯特战记2,阿加雷斯特战记,爱丽丝：疯狂回归,阿玛拉王国：惩罚,阿尼玛：回忆之门,阿达尼亚的守护者,阿克拉什：传承,暗影之剑,暗黑之门伦敦,奥妮之刃,艾云卡斯之法师的崛起,阿尔戈英雄的崛起,奥斯库拉：失去的光明,艾莉森之路,艾森霍恩：异形审判官,阿米克罗,暗影之刃：再度出击,暗影帝国,安特利亚英雄传,阿廖欣的枪,矮人,阿拉亚,阿尔戈,奥日与精灵意志,奥西里斯：新黎明,Angel,Beats!:1st,beat,阿凡达,Artifact,暗影：觉醒,B,报复,飙酷车神2,飙酷车神,迸发2,迸发,半人马之星,不义联盟：我们之中的神,蝙蝠侠：阿甘骑士,蝙蝠侠：阿甘起源,蝙蝠侠：阿甘之城,蝙蝠侠：阿甘疯人院,蝙蝠侠,蝙蝠侠：内敌,冰汽时代,波斯王子5,波斯王子4,波斯王子3,变形金刚,变形金刚：塞伯坦之战,变形金刚：塞伯坦的陨落,变形金刚：毁灭,变体少女,波西亚时光,八方旅人,不可饶恕,霸王Overlord,霸王2,霸王：邪恶联盟,孢子SPORE,贝奥武夫,半人半神,边缘战士,暴战机甲兵,半条命2,宝可梦探险寻宝,堡垒,暴力辛迪加,百战天虫,百战天虫：世界派对重制版,堡垒之夜,堡垒：火焰之炼,本影,白夜,暴行,Blue,Reflection,避难所2,不义联盟2,不朽星球,薄樱鬼：风之章,崩溃大陆,爆炸头武士2：库玛复仇,病号,百鬼城,白色情人节：校园迷宫,笔下之死,巴比伦陷落,C,刺客信条：奥德赛,刺客信条：起源,刺客信条：大革命,刺客信条：枭雄,刺客信条：叛变,刺客信条4：黑旗,彩虹六号：围攻,茶杯头,传送门骑士,柴堆,超大城市,尘埃4,城市帝国,传送门2,成长家园2,层层恐惧,城市：天际线,苍翼默示录：刻之幻影,超级房车赛：汽车运动,超级房车赛：起点,超级房车赛：起点2,城堡风暴,超凡双生,超级食肉男孩永无止境,超级机器人大战,超级机器人大战V,机战OG：月球居民,超级机器人大战X,超时空要塞,彩虹六号,炽焰帝国2,纯粹越野,彩度战队,超世纪战警,草根传奇,刺客信条：编年史,刺客信条3,刺客信条：启示录,刺客信条：兄弟会,刺客信条2,刺客信条,尘埃3,尘埃2,尘埃,尘埃拉力赛,传说之下,传奇：神之手,城市生活,沉没之城,成长家园,炽天使,冲突否定行动,超级马里奥：奥德赛,冲突世界,CLANNAD,次元转换射击,重建核心,超越善恶2,除暴战警3,CHKN,重初始化,苍龙城,吃人的女孩2,穿越林间,传说：命运之路,创世纪：阿尔法一号,纯粹农场17：模拟器,初体计划,超越人类,超自然9人组,Control,超能队长,超人：世界最佳拍档,超级街道赛,D,地狱之刃,大神：绝景版,东方帝国,地狱边境,德军总部3,德军总部：新血脉,德军总部2：新巨人,德军总部：旧血脉,德军总部：新秩序,德军总部,地牢之魂,迪士尼无限3.0,帝国时代3,帝国时代2HD,帝国时代：终极版,帝国时代4,帝国：全面战争,地牢围攻3,地牢围攻2,堕落军团,东印度公司,达尔文计划,刀剑封魔录,独行者：试验场,地铁：离去,地铁2033,地铁：最后的曙光,堕落之王2,堕落之王,大航海：纪元,弹震症2：血迹,第八分队,大富翁系列,地下城,地球帝国3,第一圣殿骑士,地牢守护者,戴斯班克,超女神信仰诺瓦露：激神黑心,地城之光,地下城3,地下城2,弹片,迪托之剑,地上战争,地狱之魂,D4：暗梦不灭,多伦塔,地球Online,地下城工会,地狱潜者,夺位者,弹丸论破,弹丸论破2,弹丸论破：绝对绝望少女,东京迷城,地穴童影,地球防卫军4.1,地球防卫军5,地平线：黎明时分,刀剑神域：夺命凶弹,刀剑神域：虚空幻界,刀剑神域：虚空断章,盗贼之海,冻结状态,大厦管理者,地堡,地球黎明,代号：硬核,底特律：变人,诞生,电竞人生,东津萌米,渎神,东京42,东京暗影,大圣归来,毒枭,对马之魂,地球陨落,东京喰种：re,CALL,to,EXIST,E,恶灵附身2,恶灵附身,二进制领域,二之国2：亡灵之国,恶魔城：暗影之王2,恶魔城：暗影之王,恶魔三人组,恶魔狩猎,ELEX,ECHO,恶魔之魂,恶霸鲁尼2,Eitr,F,方舟：生存进化,范海辛：终极剪辑版,疯狂的麦克斯,FIFA,18,FIFA,17,FIFA,16,反恐精英：全球攻势,反恐精英CS,辐射：避难所,辐射76,辐射4,辐射3,辐射新维加斯,菲斯,防御阵型2,防御阵型,复仇者联盟,疯狂之冠,孤岛惊魂5,孤岛惊魂4,孤岛惊魂3,孤岛危机3,孤岛惊魂2,孤岛危机2,孤岛危机,鬼泣5,鬼泣HD合集,DMC：鬼泣,鬼泣4：特别版,鬼泣4,鬼泣3,古墓丽影：暗影,古墓丽影：崛起,古墓丽影9,光明格斗：刀锋对决EX,观察者,过山车之星,过山车大亨世界,光之镇,钢铁之师：诺曼底44,钢铁之师2,光环战争2,光环：无限,光环6,光环5,GTA6,古剑奇谭2,GT6,鬼屋魔影：启蒙,鬼刃,鬼武者系列,古墓丽影8,古墓丽影周年,古墓丽影2：重制版,工人物语7,工人物语,冠军足球经理,哥特王朝4,哥特王朝3,GTR赛车,古剑奇谭3,古剑奇谭,格林机枪,光荣使命,光荣使命2,功夫熊猫,功夫熊猫：传奇对决,古域之战,怪物猎人：世界,怪物猎人XX,怪物猎人X,怪物猎人2,怪物猎人物语,钢铁雄心4,钢铁雄心3,GTS,GT7,鬼屋魔影,国王的恩赐,哥特舰队：阿玛达2,哥特舰队：阿玛达,钢铁侠,格兰蒂亚2,国家的崛起,光明重影,光明记忆,哥萨克3,歌利亚,新高达破坏者,高达Versus,钢铁收割,高考恋爱100天,共和国重制版,过气英雄,归家异途,归于沉寂,光之骑士,古惑狼三部曲,HI,黑暗之魂3,黑暗之魂2：原罪学者,黑暗之魂2,黑暗之魂,和班尼特福迪攻克难关,合金装备：幸存,合金装备5：幻痛,合金装备5：原爆点,合金装备崛起：复仇,合金装备4,Inside,火箭联盟,黑镜,火影：究极风暴遗产,火影：究极风暴4,火爆狂飙,海岛大亨5,海贼王：燃烧热血,海贼无双4,海贼无双3,海贼王：无尽世界R,海贼王：寻秘世界,火炬之光：前线,火炬之光2,火炬之光,灰烬,合金弹头,幻想三国志3,幻想三国志4,皇牌空战：突击地平线,皇牌空战7,毁灭战士：永恒,毁灭战士4,火影忍者系列,火影：究极风暴-革命,火影：究极风暴3,火影博人传：新忍出击,H.A.W.X.,哈利波特,海岛大亨6,海岛大亨4,海岛大亨3,荒野大镖客：救赎2,黑湾海盗,黑暗虚无,黑暗地带,海商王3,混乱军团,航母指挥官,火星战争日志,黑与白系列,鸿源战纪,红色派系：游击战,红色派系,化神降世,黑暗地带51区,横冲直撞2,灰蛊,回声战令,混血儿,幻,黑暗城堡,海之号角：神秘海怪,毁灭边缘,Hob,混乱特工,混沌之子,红心与斜线,海王星重生3,海王星重生2,海王星重生,海王星V2,海王星U,海王星VS世嘉主机少女,海王星VS僵尸军团,洪潮之焰,荒神,行会3,红石遗迹,火星求生,河洛群侠传,化妆舞会：歌与影,火焰纹章if,火焰纹章无双,火焰纹章：风花雪月,ICEY,环世界,幻想三国志5,昏迷,黑暗献祭,荒野西部Online,荒野行动,胡闹厨房2,黑暗影集：棉兰幽灵,J,绝地求生,饥荒,纪元2205,金庸群侠传5,镜之边缘：催化剂,街头霸王5,街头霸王4,街霸X铁拳,救赎之路,急难先锋2016,机械迷城,崛起3：泰坦之王,狙击精英4,狙击精英3,狙击精英V2,僵尸部队三部曲,僵尸世界大战,节奏地牢,剑风传奇无双,剑勇传奇：忍者龙剑传Z,驾驶俱乐部,寂静岭系列,僵尸必须死,吉他英雄,极品飞车21,极品飞车20,极品飞车19,极品飞车18,极品飞车17,极品飞车16,极品飞车15,极品飞车14,极品飞车13,极品飞车12,极品飞车11,极品飞车10,极品飞车9,剑侠情缘之谢云流传,教团：1886,崛起,加勒比海盗,纪元2070,纪元1800,剑与勇士,崛起2：黑暗水域,急难先锋2012,极限竞速7,极限竞速6,极限竞速5,极限竞速地平线3,极限竞速地平线2,家园：破舰者,家园：卡拉克沙漠,家园：重制版,机器人暴动,镜之边缘2,镜之边缘,极度恐慌3,Jump全明星,精灵遗产,警察10-13,极速骑行,假面骑士：巅峰战士,剑刃风暴百年战争与梦魇,见证者,剑湾传奇,进化之地2,僵尸维京,救援行动2：全职英雄,畸形,军团1944,机械巫师,绝杀99,进化,极道,僵尸,巨兽战争,极限巅峰,机甲战场,绝对迎击战争,吉娜姐妹：扭曲梦境,极限脱出3：零时困境,极限脱出：九人游戏,金庸群侠传2,寄神骑士,九张羊皮纸,巨魔与我,绝对征服,巨神狩猎,加速世界VS刀剑神域,街头大乱斗：大激战SP,精灵宝可梦皮卡丘/伊布,精灵宝可梦：究极日月,纠缠之刃,进击的巨人,进击的巨人2,Jump大乱斗,寂静之人,K,看门狗3,看门狗2,看门狗,空洞骑士,坎巴拉太空计划,看火人,狂战传说,空间逆转,恐龙猎人,狂野西部,凯撒大帝4,卡图斯：进击的机器人,狂怒Rage,狂怒2,恐怖女孩,恐怖黎明,空中冲突,恐怖僵尸之夜,骷髅与骸骨,空心弹,咖啡因,空手家2：强力一击,昆虫屠夫,凯之传奇,克林巴,Kyn,恐怖迷城,口袋妖怪,口袋妖怪：太阳/月亮,寇莎梅特：困世迷情,凯瑟琳Full,Body,恐惧狼群,L,龙珠斗士Z,龙珠：超宇宙2,龙珠：超宇宙,掠食,猎天使魔女,流放者柯南,龙腾世纪：审判,罗马2：全面战争,雷曼：起源,量子破碎,劳拉与光之守护者,劳拉和奥西里斯神庙,60秒！,雷神之锤4,黎明杀机,洛川群侠传,龙之信条,乐高世界,命运2,命运,魔兽争霸4,魔兽争霸3,盟军敢死队,毛线小精灵2,毛线小精灵,漫威VS卡普空：无限,模拟人生5,模拟人生4,模拟人生3,模拟人生2,马克思佩恩4,马克思佩恩3,马克思佩恩2,魔法门之英雄无敌3,魔法门之黑暗弥赛亚,魔法门10传承,命令与征服3,命令与征服4,迷你忍者,灭绝,魔方世界,模拟城市,魔能2,魔法对抗,魔戒之征服,美少女梦工厂,迷失地带,灭国英雄,蔑视,迷城的国度,魔法黎明,明星志愿,明星志愿4,命运战士3,模拟饭店2,迈阿密热线2：空号,魔法世界,蘑菇人：松露威胁,摩托GP,15,魔窟冒险,漫漫长夜,漫漫归家路,明日之子,免疫,木遁大师,魔界战记,墓园,模拟农场17,模拟农场18,美国卡车模拟,末日拾荒者,模拟火车：新时代,密室求生,魔法季节：沉睡的大地,迷失之魂,漫画英雄VS卡普空3,猫头鹰男孩,模拟狩猎,莫比乌斯：最终幻想,冥河：黑暗碎片,摩托英豪4,面容,迷雾侦探,墨西哥英雄大混战2,命运之手2,命运石之门0,命运石之门：精英,命运石之门,猫尾巴,牧场物语：希望之光,漫展模拟器,NO,尼尔：机械纪元,尼德霍格2,NBA,2K19,NBA,2K18,NBA,2K17,NBA,2K16,NBA,2K15,NBA,2K14,NBA,2K13,NBA,2K12,NBA,2K11,NBA,2K10,NBA,2K9,NBA,2K,欢乐竞技场2,虐杀原形,虐杀原形2,你好邻居,奴役：奥德赛西游,逆境求生,南方公园：真理之杖,南方公园：完整破碎,女神异闻录5,怒火橄榄球2,NBA,Live,06,NBA,Live,07,NBA,Live,08,NBA,Live,09,NBA,Live,14,NBA,Live,15,NBA,Live,16,NBA,Live,18,NBA,Live,19,逆光追影,尼洛,内心朋友,女巫,纳克2,Nitro+女主角梦幻格斗,南瓜先生大冒险,欧洲杯2008,欧陆风云罗马,欧洲卡车模拟2,欧洲钓鱼模拟,Overkill的行尸走肉,Once',PQ,全境封锁2,全境封锁,旁观者,缺氧,群星,旁观者,骑马与砍杀2：领主,骑马与砍杀：火与剑,骑马与砍杀,拳皇14,拳皇13,拳皇2002,奇异人生：风暴前夕,旗帜的传说3,旗帜的传说2,求生指南2,求生指南,求生指南：第三人称,权力的游戏,权力的游戏RPG,前线：战火之源,全面战争传奇：不列颠的王座,全面战争：幕府将军2,全面战争：传奇,秋之回忆8：无垢少女,秋之回忆,起源计划,群马乱斗,汽车总动员,强袭装甲,破门而入：战术小队,帕拉世界,破坏份子,叛乱：沙漠风暴,喷射霸王龙,奇妙逃亡,奇异人生2,奇异人生,奇诺冲突,奇异小队,潜行者：晴空,潜行者2,骑士：中世纪战争,喷射战士2,奇点,拳皇,拳皇97,奇异世界：新鲜可口,秦殇2,求生之路3,奇点灰烬,枪、血、黑手党,情热传说,拳击俱乐部,强制对决,七日杀,七大罪,秋叶原之旅2,秋叶原之击,欺诈之地,秋后的季节,乓丘,七：远去的日子,全面吃鸡模拟器,R,仁王2,仁王,荣誉勋章2010,荣誉勋章系列,戎马丹心-汉匈决战,忍者龙剑传2,忍者龙剑传3,如龙6,如龙5,如龙3,如龙:极2,如龙:极,如龙0,如龙:维新,荣誉代码3,R.U.S.E.,忍者之刃,忍者战记DX,忍者印记,热血进行曲：大运动会,热血物语：地下世界,忍者神龟：曼哈顿突变,Ryse：罗马之子,日落过载,人类：一败涂地,人类元素,人猿星球：最后边疆,人中北斗,瑞奇与叮当,人生尽头,瑞思和夏恩,Rime,燃烧的星,任天堂明星大乱斗特别版,S,三国志13,三国：全面战争,上古卷轴5,生化危机7,生化危机6,生化危机5,生化危机4,生化危机2重制版,生化危机,生化危机0：HD重制版,生化危机：保护伞小队,生化危机：启示录2,生化危机：启示录,生化危机：浣熊市行动,生化危机8,实况足球2019,实况足球2018,实况足球2017,天国：拯救,铁拳7,逃生2,突袭4,脱逃者2,脱逃者：行尸走肉,她的故事,泰拉瑞亚：来世,泰坦陨落3,泰坦陨落2,泰坦陨落,天空之山,塔科马,特技摩托：血龙,TUNIC,图灵测试,VA-11,HALL-A：赛博朋克酒保行动,挺进地牢,讨鬼传：极,讨鬼传2,太阁立志传5,天诛4,吞食天地,吞食孔明传,2Dark,豚鼠特工队,铁血联盟,铁血联盟：狂怒,特殊行动：一线生机,铁拳X街霸,逃离死亡岛,天使帝国4,铁路大亨3,通缉犯：命运武器,太阳帝国原罪,泰坦之旅,太空围攻,天下统一5,突袭3,太空战舰死亡之翼,泰坦尼克号：荣耀,太阳浩劫,泰坦之魂,特斯拉学徒,通灵塔,逃出生天,天命奇御,逃离塔科夫,痛苦地狱,VR网球2009,贪婪之秋,The,Cycle,W,巫师3：狂猎,我的世界,文明6,文明：太空,文明系列,无人深空,无限试驾2,无限试驾,无主之地3,无主之地：前奏,无主之地2,无主之地,无主之地传说,无主之地传说：第二季,勿忘我,无双大蛇,无双大蛇2,无双大蛇3,武装突袭3,武装突袭2,巫师2,巫师,巫师之昆特牌,乌鸦小队,无可救药,无尽空间,无尽空间2,我还活着,我的工厂,维京：神域之战,无冬之夜,王权2：幻想王国,王者荣耀,温柔刺客,武林立志传,无尽的未知,无敌9号,文明城市罗马,王国之心3,维克多弗兰,围攻,玩具士兵：战争箱子,WWE,2K19,WWE,2K18,WWE,2K17,WWE,2K16,WWE,2K15,无畏,无名之辈,我的世界故事模式,我的世界故事模式2,万智牌对决：起源,王国英雄2,旺达与巨像,伟大时代：中世纪,伍尔夫：小红帽日记,维姬拯救无声大世界,血腥竞技电台,唯一的幸存者,消失的星球,我是面包,蔚蓝,我是刹那,王国,万众狂欢,荣耀战魂,为战而生,网络奇兵：重制版,网络奇兵3,维京人：人中之狼,我，角斗士,我们，革命,玩具熊的五夜后宫,无人之境,无象之境,无夜之国,无夜之国2：新月的花嫁,万亿魔坏神,无双全明星,WILL：美好世界,舞力全开2017,无限灵魂Z,武士零,我们身边的狼：第二季,亡灵诡计,我的英雄学院,瓦尔哈拉,文嘉,我的朋友佩德罗,武侠乂,我们的回忆,无限法则,X,羞辱：界外魔之死,羞辱2,羞辱,侠客风云传前传,侠客风云传,消逝的光芒,行星边际2,仙剑奇侠传7,仙剑奇侠传6,仙剑奇侠传5前传,仙剑奇侠传5,仙剑奇侠传,行尸走肉：最终季,行尸走肉：第三季,行尸走肉,轩辕剑穹之扉,星际争霸,星际争霸：重制版,星际争霸2,信长之野望15,信长之野望：大志,信长：战国立志传,信长之野望14,信长之野望13,信长之野望12,细胞分裂7,细胞分裂6,细胞分裂5,心灵杀手,心灵杀手2,X战警前传：金刚狼,新绝代双骄3,轩辕剑汉之云,轩辕剑云之遥,轩辕剑6,轩辕剑7,轩辕剑8,虚幻竞技场3,小恶魔附体,星际殖民2,星际殖民,像素星舰,像素星际海盗,寻找天堂,星球基地,像素滑板2,兴衰文明战争,新剑侠传奇,星球大战,星球大战：旧共和国武士2,星球大战：前线,星球大战：前线2,星球大战绝地：堕落秩序,星空,消逝的光芒：信徒,消逝的光芒2,星际公民,虚拟台球4,旋转轮胎,星露谷物语,席德梅尔：星际战舰,星际爬行者,星际战甲主机版,血战西部,仙乐传说,血源,血源2,小梦魇,血污：夜之仪式,星之海洋5：忠诚与背叛,虚拟偶像：超级索尼子,限界凸骑,限界凸骑：萌情编年史,夏日课堂,象限,心境,新弹丸论破V3,星界边境,星之海洋4：最后的希望,现代启示录,汐,悬案：刹那惊颤,西娅：觉醒,小魔女学园,新冰城传奇4,新捉鬼敢死队,心魔,星之卡比：新星同盟,侠隐阁,Y,幽浮2,幽浮,影子战术：将军之刃,盐和避难所,英雄传说7,英雄传说6,英雄传说：碧之轨迹,英雄传说：闪之轨迹4,英雄传说：闪之轨迹3,英雄传说：闪之轨迹2,英雄传说：闪之轨迹,伊苏8,伊苏6,伊苏：塞尔塞塔的树海,伊苏：起源,以撒的结合：忏悔,以撒的结合：胎衣,以撒的结合：重生,永恒之柱2：死亡之火,英雄无敌8,英雄无敌7,英雄无敌6,英雄无敌5,幽灵行动4,雨血,鹰击长空2,异形大战铁血战士,英雄连,英雄连2,与狼同行,御天降魔传,亚瑟王,越狱,耶利哥,银河战士4,英雄萨姆HD,英雄萨姆3,英雄萨姆4,永远的毁灭公爵,眼镜蛇11,幽灵行动3,幽灵行动：荒野,远行星号,鹰击长空,幽闭圣地,异域镇魂曲：加强版,妖兽与人类,勇闯银河系,雨滴,淹没,遗忘,永恒边缘,永恒空间,乙金战争,银河文明3,野兽之影,银河笔与纸,勇者斗恶龙：建造者2,勇者斗恶龙8,勇者斗恶龙11,勇者斗恶龙：英雄2,勇者斗恶龙：英雄,妖精剑士F,妖精剑士F：邪神降临,亚尔斯兰战记X无双,云斯顿赛车2015,隐形公司,英雄代号Z,银河装甲,越野摩托2,伊斯巴拉,夜啼,幽灵物语,幽灵,异星奇兵,仰冲异界,油管主播的生活,夜下降生Exe：Late,亚当冒险传奇：起源,与陌生人同行,Ylands,异星探险家,游戏王：决斗者遗产,隐龙传：影踪,Yesterday,尤卡莱莉大冒险,远征军：维京,银河风暴,银河护卫队,英雄就是我,雨的世界,影子里的我,银魂,牙齿和尾巴,月影之塔,亦春秋,异度之刃2,异度之刃X,伊斯特里恩的天灾,源震：黑暗黎明,亿万僵尸,议会,原子之心,御侠客,Z,真三国无双9,真三国无双8,真三国无双7,真三国无双6,真三国无双5,真三国无双4,真三国无双：英杰传,正当防卫4,正当防卫3,正当防卫2,最终幻想15,最终幻想13,最终幻想：纷争,隻狼,中世纪2：全面战争,这是我的战争,战锤：全面战争3,战锤：全面战争2,闪之轨迹,奇异人生2,极限竞速地平线4,COD15,巫师之昆特牌：王权的陨落,幻想全明星,中国式家长,明日之后,刺激战场,王者荣耀,绝地求生,绝地求生刺激战场,吃鸡,魔晶,香肠派对,吃鸡刺激战场,暗影一直存在,斗地主,三国,第五人格,我的世界,传奇,fire balls 3d,头脑吃鸡,迷你世界,游戏,qq飞车,开心消消乐,欢乐斗地主,牛牛,消消乐,传奇私服,麻将,shadows remain,捕鱼,全军出击,阴阳师,三国杀,植物大战僵尸,梦幻西游,红警,穿越火线,nba,挂机,私服,炉石传说,皇室战争,卡牌,元气骑士,单机游戏,weaphones,球球大作战,问道,火影忍者,三国志,部落冲突,卡牌游戏,炸金花,绝地求生:全军出击,斗破苍穹,传奇游戏,荒野行动,神都夜行录,明日,风之大陆,塔防,奇迹,lanota,网易游戏,黑洞大作战,崩坏3,2048,贪玩蓝月,魔幻手游,欢乐麻将,象棋,数字华容道,jj斗地主,海贼王,棋牌,仙剑,手游,dismount,bumper,回合制手游,暗黑,三国游戏,神奇宝贝,魔域,游戏大全2018,诛仙,仙侠手游,西游,山海经,仙剑奇侠传,策略,节奏大师,俄罗斯方块,超级玛丽,变态传奇,百人牛牛,口袋妖怪,塔防游戏,梦幻模拟战,西游女儿国,仙侠,三国卡牌,传奇单机,宝宝巴士游戏大全,盗墓,非人学院,天天酷跑,英雄杀,奥特曼,五子棋,时空召唤,卡牌手游,天龙八部,网游,三国手游,大富翁,欢乐牛牛,阿拉德之怒,贪吃蛇大作战,熊猫麻将,回合,捕鱼游戏,赛车,复古传奇,神武3,shadowrocket,暗影,三国战纪,火柴人,绝地求生:刺激战场,真人炸金花,数独,剑侠情缘,三国群英传,红警ol,决战!平安京,单机,魔幻,策略游戏,汤姆猫跑酷,剑侠,策略手游,传奇世界,龙虎斗,回合制,修仙,养成游戏,传奇手游,保卫萝卜,地下城与勇士,楚留香,国美易卡,模拟人生,二次元,PAKO Forever,跑酷,红色警戒,拳皇,贪吃蛇,率土之滨,恋与制作人,足球,尼山萨满,天天爱消除,梦幻花园,奇迹暖暖,神庙逃亡,万王之王,剑与家园,消灭星星,欢乐斗牛,我叫mt4,斗地主欢乐版,极品飞车,Happy Glass,斗牛游戏,角色扮演,牛牛游戏,愤怒的小鸟,魂斗罗,飞车,放置奇兵,鬼和枪,仙剑奇侠传四,炸金花赢现金,大话西游,吃鸡游戏,滚动的天空,闲来广东麻将,植物大战僵尸3中文版,传奇挂机,西游回合,游戏大全2018免费,诛仙手游,四川麻将,连连看,骰子,挂机游戏,实况足球,stair dismount®,神秘海域4,王国纪元,恐怖奶奶,qq炫舞,梦幻诛仙,地铁跑酷,神武,传奇霸业,fireballs3d,游戏王,剑侠世界2,养成,放置,真三国无双,航海王,猎魂觉醒,跳舞的线,宫廷计,轩辕剑,蜘蛛侠,荒野求生,密室逃脱,fgo,动作游戏,流星蝴蝶剑,中国象棋,蓝月传奇,倩女幽魂,方舟,篮球,寻仙,炉石,真钱牛牛,武侠,乱世王者,钓鱼,围棋,天天象棋,捕鱼赢现金,qq斗地主,人类:一败涂地,真人牛牛,暗影：一直存在,刃心,神回避,捕鱼赢钱,回合制游戏,斗罗大陆,精灵宝可梦,坦克,私服手游,成语消消消,小游戏,福利彩票,海岛奇兵,捕鱼下分,修仙手游,雷霆战机,梦幻,宠物小精灵,梦幻家园,龙之谷,熹妃q传,武林外传,天使纪元,玩呗,全民出击,魔兽,忍者必须死3,疯狂动物城,创造与魔法,无烦恼厨房,战国,文明6,香肠派对吃鸡,三国无双,梦幻西游互通版,我的世界2,牛牛赢钱,金庸群侠传,炫舞,模拟,梦想小镇,谁是卧底,单机游戏大全免费,修仙游戏,切水果,传奇变态版,龙虎,一直存在,疯狂大厨,地下迷宫,赛车游戏,inside,逆水寒,宾果消消消,崩坏,吃鸡战场,狂野飙车8:极速凌云,角色扮演游戏,fifa,真钱炸金花,冒险岛,fireballs,西游单机版,战舰世界,卡车模拟2018,广东麻将,贪玩传奇,真实武器模拟器,飞机,絕地求生,老虎机,女神联盟2,火影,nba2k,国战手游,热血传奇,回合手游,数码宝贝,坦克世界,枪战游戏,蜀门,水果忍者,虚荣,圣斗士星矢,剑侠情缘2,生存,RDR2,地下城,三国塔防,死神,文明,御剑情缘,神秘海域,海贼王燃烧意志,真人棋牌,弓箭手大作战,碧蓝航线,一笔画完,模拟驾驶,狂野飙车,刺客信条,葫芦娃,武林,消消乐2018,画画,迷你世界 4,画中世界,麻将棋牌,卡牌回合,口袋妖怪复刻,模拟城市,梦想世界,魔域手游,野蛮时代,钢琴块2,恐龙游戏,中国式家长:亲情正版,pako,现金龙虎斗,保卫萝卜5,武侠手游,armed,平安京,腾讯麻将,微乐贵阳捉鸡,影子传说,魔力宝贝,真人龙虎斗,养成类游戏,问道手机版,金花,塔防手游,纪念碑谷,少年三国志,塔防单机,剑网3,侠客风云传,掼蛋,左轮手枪,烈火如歌,英魂之刃,欢乐炸金花,僵尸,宫廷计手游,盗墓游戏,大天使之剑,时空猎人,拳皇命运,cube escape,无敌流浪汉,阿拉德,坦克大战,刀塔传奇,gorogoa,热血江湖,泰拉契约,方舟生存,火影忍者ol,植物大战僵尸1,农场,龙虎斗游戏,扫雷,腾讯欢乐麻将,见缝插针,百人龙虎斗,madout2,诛仙游戏,街机,我叫mt,打鱼,奥特曼游戏,少女前线,三国如龙传,嘻嘻斗地主,仙侠游戏,变形金刚,rpg,射击游戏,找你妹,黑洞,月圆之夜,螺旋圆舞曲,枪械 模拟器,侠盗飞车,蓝月,我的汤姆猫,单机西游,泡泡龙,公主游戏,荒野大嫖客,挂机手游,大话西游手游,航海王燃烧意志,妖神记,忍心,战争,劲舞团,吃鸡游戏荒野行动,武动乾坤,同城游,最终幻想,街头篮球,决战平安京,古墓丽影,地球末日生存,牛牛游戏大厅,疯狂动物园,三十六计,FR LEGENDS,三国群英荟,维加斯,剑灵,猫,飞机游戏,飞行棋,鬼语迷城,全军出击刺激战场,最强nba,熊猫麻将四川麻将,现代战争,絕地求生刺激戰場,熹妃传,暖暖,滑雪大冒险,2k19,模拟器,跑跑卡丁车,太虚,真金龙虎斗,truck simulator,armed heist,寻仙手游,枪战,贪婪洞窟,自由幻想,granny,斗地主真人版,广东闲来打麻将,漫威,熊猫四川游戏,升级,战舰,奇迹mu,饥饿鲨,地下城与勇士手机版,梦幻西游手游,宫廷,机器人,动作手游,武侠游戏,汽车游戏,仙灵觉醒,圣斗士,勇士守护者,台球,天龙八部手游,部落,魔幻游戏,军旗,真实武器模拟,旋转轮胎,跑得快,ar游戏,腾讯桌球,琼崖海南麻将,经营,人类一败涂地,变态传奇私服,双人游戏,生存游戏,单机斗地主,潮人篮球,三国策略,数字传奇,gta5,鳄鱼洗澡,兔子复仇记,恐龙快打,五五花小牛,赛尔号,成语消消乐,足球游戏,逃跑吧少年,辐射 避难所,无限法则,西游记游戏,我的安吉拉,双扣,麻将来了,造梦西游,现金炸金花,qq麻将,非人学园,百人炸金花,三国志大战,植物大战僵尸3,欧洲卡车模拟2中文版,狙击,成语,轩辕传奇,部落战魂,热血传说,蜘蛛纸牌,阿瑞斯病毒,票房大卖王,方舟指令,一笔画,全民主公2,合金弹头,西游变态版,中国福利彩票,开罗,守望先锋,决地求生,分手回避,旅行青蛙,水果机,末日,三国战记,无尽之剑,植物大战僵尸2,spinner.io,三国卡牌手游,香肠,口袋联盟,蛇蛇争霸,节奏大师2,鲨鱼,拳皇97,moba,欢乐升级,2k,射击,遇见逆水寒,回合制网游,暗影格斗,沙巴克传奇,云裳羽衣,江湖,跳一跳,恐怖老奶奶,刺激战场,全军出击,剑侠世界,神都,格斗,纸片大作战2,真实滑板,二次元卡牌,堡垒之夜吃鸡,征途,Fire Balls3D,qq农场,模拟经营,王国保卫战,经营游戏,益智游戏,养成类,侠盗飞车:罪恶都市,斗破苍穹手游,腾讯广东麻将,赤月,休闲游戏,一零计划,飞车游戏,明日以后,小猪佩奇,火柴人绳索英雄,使命召唤,传奇1.76,忍者必须死,prepare for impact,黑洞大作战2,怪物猎人,物理弹球,神奇宝贝口袋妖怪,天天炫斗,做饭游戏,shadowsremain,猎魂师,盗墓手游,一品官老爷,shadows,陕西地电网上营业厅,色情游戏,rpg游戏,，我的世界3,kingdom rush,漂移风暴,飞机大亨,合击沙城,饥饿龙,终结者,倩女幽魂手游,镇魔曲,国际象棋,你胖你先吃,王权,辐射,择天记,原始传奇,围城大作战,火焰纹章,你演我猜,荒岛求生,铁血大业,真钱棋牌,飞机大战,生死狙击,tencent mobile games,战塔英雄,免费游戏,水果,决斗之城,最囧游戏,侍魂,够级,海滨消消乐,不思议迷宫,天天富翁,龙虎棋牌,超级玛丽经典版,jj斗地主赢话费,赤潮,消灭糖果,恐怖游戏,修真,未来特工,桌球,餐厅,征途2,永不言弃,至尊龙城,黄金矿工,封神单机版,化妆游戏,贵阳捉鸡麻将,别踩白块,天天飞车,快乐玻璃杯,捕鱼来了,奥特曼格斗进化3,千炮捕鱼,打枪游戏,剑侠情缘3,儿童游戏免费3岁-6岁,属性与生活,塔防三国志,乐高,放置江湖,腾讯斗地主,末日生存,王牌战争,美食烹饪家,贪玩蓝月手游,3d游戏,遮天传说,模拟山羊,二次元游戏,保皇,后宫游戏,终结者2:审判日,斗地主单机版,卡通农场,卡车模拟,单机麻将,战舰世界闪击战,球球,全民枪战,马里奥,热血永恒,钓鱼游戏,换装,金花牛牛,音乐游戏,象棋单机版,帝国时代,仙侠回合,龙骑战纪,孤胆车神,丧尸,微乐麻将游戏,斗地主赢现金,瘟疫公司,fire,天天斗地主,贪玩,植物大战僵尸单机版,铠甲勇士,找茬,上海麻将,三国杀名将传,你好.邻居,nba 2k19,阿拉德之怒手游,未来之战,麻将游戏,机器人大战,大话西游2,神庙逃亡 5,黑暗料理王,ball blast!,三国志单机,约会大作战,paper.io 2,愤怒的小鸟2,糖果传奇,混沌与秩序,tom猫,边境之旅,诛天决,荒野大作战,蜘蛛侠游戏,nba live,总裁,妈妈把我的游戏藏起来了,现代战争5,fill,烹饪发烧友,三国演义,荒野,福彩,madout2 bco,欢乐碰碰球,想不想修真,暗影格斗3,军棋,聚义三国,拼图游戏,仙灵幻梦,the room,途游斗地主,消除,小冰冰传奇,格斗游戏,侠盗猎车手,小鳄鱼爱洗澡,模拟枪械,闲来,电玩棋牌,足球经理,求生,泰拉瑞亚,弹弹堂,shadow remain,比特小队,fifa online 4,武林群侠传,八分音符酱,塔防类游戏,全民主公,红警ol手游,节奏狂欢,地狱边境,滑板,街篮,废土行动,迷你世界吃鸡,生存日记,切西瓜,石器时代,摇骰子,拳皇97单机游戏,放开那三国,地牢猎手,bacon,魔灵召唤,不就,弓箭手们,武器模拟器,忍者,滚动大作战,角色扮演手游,魂斗罗归来,蛇蛇大作战,元气冲冲冲,小游戏大全免费,魔方,密室,大鱼吃小鱼,仙剑情缘,哈灵麻将,selfcare,抖音游戏,正当防卫3,求求大作战,烹饪,mt,炸金花提现,开车游戏,装扮少女,小小英雄,gameloft,第五人格游戏,心悦麻将,梦幻西游单机版,俄罗斯方块经典,街头霸王,四川熊猫麻将血战到底,跑胡子,医院,枪,卡牌养成,街机捕鱼,我在大清当皇帝,刀剑神域,约战,攻城掠地,亡命时速,迷失岛,左轮,全面战争,经营类游戏,十三水,trucksimulator,女神联盟,永恒纪元,吞食天地,jj,光明大陆,麻将单机版,英雄无敌,fit,麻友圈2贵阳捉鸡麻将,Pastel Girl,自由之战,花仙道,Pen Run,吉祥麻将,战国之道,可口的披萨,跳棋,热血之刃,变态私服,砸金花,大话骰,多乐够级,明日之,炸金花真人版,艾诺迪亚,模拟飞行,化身博士,君王,闲来贵州麻将,卡车,parade,火车游戏,小小三国,砖块消消消,tenkyu,史上最坑爹的游戏,真实赛车3,街机游戏厅合集,火柴人联盟,御龙在天,火柴人战争,策略三国,pick the gold,祖玛,生化危机,coc,cooking fever,百人游戏,斗地主赢话费,patchmania,叫我万岁爷,坦克风云,奇迹觉醒,影之诗,武汉麻将,问道私服,玩呗斗牌,燃烧意志,罪恶都市,干瞪眼,萝卜,大主宰,公主,cube,四人斗地主,厨房游戏,三国杀online,infinite flight,碰碰车大作战,烈火,登山赛车,斗兽棋,魔域手机版,万象物语,列王的纷争,逍遥决,smart shapes,捕鱼提现,熊出没,乐高游戏,网球,打鱼游戏,提现斗牛,扑克,太古神王,全民突击,忍着必须死3,汤姆猫快跑,五子棋腾讯版,光荣使命,钓鱼王者,后宫,半世界之旅,宾果消消乐,篮球游戏,小镇,僵尸前线4,bumper.io,食堂故事,实况,安吉拉,汤姆猫水上乐园,世界,羽毛球,纸牌,长生印,汽车模拟,高达,恋爱游戏,minecraft,三国群英传单机版,少女,聚星部落,全职旅团,新诛仙,野蛮人大作战,城市,奥特曼传奇英雄,热血传奇私服,单机武侠,四国军棋,福利彩票官方,狂野飙车8,求生之路,我的世界枪战,宫廷游戏,roblox,逃离公司,dancing line,商店英雄,g5,流言侦探,温州茶苑,战火与秩序,拖拉机,锈湖,国战策略,纪念碑谷免费,猪猪侠,cats,stair,换装游戏,真人斗地主,FIFA足球世界,部落冲突:皇室战争,脑点子,全民超神,漂移,剑网三,放开那三国2,星星消消乐,宝宝学英语,波克城市,voodoo,恐怖修女,红色警戒2共和国之辉,奇异人生,汉家江湖,弹球,龙城霸业,恐怖,极速逃亡,欢乐捕鱼,大作战,元气,掘地求生,candy crush,熹妃,战争游戏,割绳子,大吉大利晚上吃鸡,女友,死亡左轮,波克捕鱼,wwe,生化危城,上篮,欢乐斗地主2018,提现牛牛,山海异闻录,my cafe,热血沙城,火柴人大乱斗,披萨,像素,传世,光之旅团,热血屠龙,钢琴块,微乐长春麻将,我的便利店,八闽福建麻将,真实赛车,决战,战地,多乐保皇,fate,开心躲猫猫,海盗奇兵,数独游戏,碰碰大作战,300大作战,跳舞的线2,芭比娃娃,消消乐免费,鳄鱼小顽皮爱洗澡,雷电,修真大时代,nba篮球大师,微乐江西棋牌,漫威未来之战,秘密花园,欢乐,仙剑奇侠传4,龙虎游戏,葫芦娃超级玛丽,虫虫大作战,神奇宝贝游戏,空战,狙击手,三国志经典,精灵宝可梦游戏,97拳皇格斗,qq斗地主欢乐版,喵星大作战,小米枪战,gta5手机版,古代游戏,冒险游戏,三带一对,蜀山,妖精的尾巴,地平线,ingress,1010,crash out,暗黑游戏,斗地主欢乐版-欢乐真人斗地主,皮皮跑胡子,单机rpg,撞头赛车,烈焰,三国单机,qq象棋,西游记,猫和老鼠,数字,恐龙世界,火柴人蜘蛛侠英雄,极品芝麻官,机器人游戏,last day on earth,方块,世界征服者,裁决,王牌大作战,哈狗,迷失森林,女生游戏,仙剑奇侠传单机,英雄,实况足球2019,csr2,迷宫,美女游戏,滑雪,封神,九品小县令,秦时明月,飞人学院,皮皮麻将,腾讯围棋,塔防游戏单机版,钢铁侠,过山车,街机游戏,天下,万王之王3D,俄罗斯方块2018新版,贪玩游戏,少年西游记,魔域口袋版,萝卜保卫战,坦克世界闪电战,皇冠博彩,merge dragons!,牧场物语,铁头英雄,侠盗猎车手:罪恶都市中文版,欢乐球球,木筏生存,劲舞团手机版,皇帝,mini 世界,rusty lake,餐厅经营游戏,跑酷游戏,涂色,手枪,township,麻将胡了,小小噩梦,破晓之刃,florence,烧脑游戏,聚会玩,脑力吃鸡,大连地铁e出行,百人斗牛,食之契约,小米超神,海贼,开罗游戏,大家来找茬,你好邻居,欢喜斗地主,梦幻西游口袋版,连连看经典版,聚义,问剑,龙珠激斗,消消,杀手,围棋入门,极速逃亡3,迷你世界2,拼三张,皮卡丘,宫斗,tower,终结者2,球,摩托车游戏,公主化妆,重装坦克,神兽金刚,fc,当官,二次元手游,勇闯死人谷,长春麻将,英雄之刃,家园,保卫萝卜3,枪火战神,闲来麻将-湖南,英雄枪战,糖果消消乐,dnf手游,花园,project off-road,敢达争锋对决,酷跑小游戏,red dead redemption 2,羽毛球高高手,spinner,捕鱼赢话费,5v5,街霸,拳皇98,f1,越野工程,节奏,卡丁车,全民农场,jj比赛,航海王：燃烧意志,非人,战舰联盟,时空猎人2,电击文库,霸道总裁,奔跑吧少年,小黄人,大掌门,1024,消消庄园,飞机模拟器,闪趣,泰坦之旅,简单火箭,杭州麻将,十三张,球球跳到底,传送门骑士,狙击游戏,中超风云2,斗牛赢现金,长生劫,你比我猜,乱斗西游,gba模拟器,勇敢的心,怪兽消消消,汤姆,三国群英,微乐捉鸡麻将,僵尸榨汁机,忍者神龟,征途2手游,开车,麻将游戏真人,冰果消消乐,俄罗斯,神回避3,幽灵行动:荒野,禧妃q传,绝地枪战,口袋妖怪日月,火影忍者究极风暴4,车游戏,星际争霸,卡五星,火炬之光,找不同,truck,中国福利彩票app,萨满,果汁四溅2,叶罗丽精灵梦,炸弹人,游戏大厅,怪物弹珠,湖南休闲游戏,轩辕剑online,八分音符,超凡蜘蛛侠,像素枪战,现代战争6,魔法时代,福州麻将,桃花源记,卡牌游戏大全,贪吃小怪物,汤姆猫的摩托艇,大唐无双,血战到底,，我的世界2中文版,soul knight,宝可梦,乒乓球,24点,变形金刚游戏,clawbert,三国志2017,赛车游戏免费 真实赛车 跑车 飞车 狂野飙车 体验 竞赛,艾希,极品飞车20,eve,超级粘液模拟器,勇闯死人谷2,象棋联网,海岛,流浪汉,打枪,侏罗纪世界,模拟人生畅玩版,扎金花,崩坏学院2,坦克游戏,保护气球,数学华容道,农场游戏,众多回忆的食堂故事,火柴人蜘蛛侠,节奏大爆炸,联机游戏,西游外传,曹操传,mc,fc模拟器,祖马,deemo,我要翘课,召唤与合成,真人斗牛,篮球大师,重装机兵,物语,泡泡,提现斗地主,三国塔防游戏,闲来陕西麻将,红蓝大作战,僵尸尖叫,21点,魔法仙灵,无尽神域,道友请留步,浴血长空,魔幻粒子,猎人,机械迷城,暴力摩托,挖掘机,昆特牌,深海水族馆,模拟恋爱,《堡垒之夜》,粉彩女孩,骰子摇一摇,绝地求生。刺激战场,三国回合,三国大冒险,纪念碑谷2免费,攻城游戏,皇上,仙境传说,魔域来了,权利的游戏,单机游戏角色,60秒,电玩,挖矿,bathroom break!,sniper 3d,芭比娃娃化妆,克鲁赛德战记,斗破,cytus,末日之后,狂野飙车8:极速凌云破解版,抢庄牛牛,欢乐五子棋,饥饿鲨进化,虚拟人生,火线精英,小精灵,苍穹传,twistyroad,全军,into the dead 2,战舰少女,女神,uno,乐乐安徽麻将,suck,山海经异闻录,神武3手游,中国象棋腾讯,黑暗荒野,捕鱼电玩,真钱游戏,贵州麻将,手游大全,weaphones2,巴清传,恋爱球球,网易棋牌,狙击行动,愤怒的小鸟中文版,simcity,奇迹私服,经典三国,真钱斗地主,水果连连看,推币机,崩坏学园,九阴真经,猎鹿人,红警2共和国之辉,天启之路,超级三国志,海底大猎杀,我的咖啡厅,war robots,微乐贵阳捉鸡麻将,边锋游戏大厅,越野,大富豪,兔子,魂斗罗单机版,爱消除,奇葩战斗家,牧羊人之心,机械模拟器,屠龙传奇,仙灵,鳄鱼,sky,蝙蝠侠,麻将好友房,官道奇才,爆破少女,妖怪正传,永远的7日之都,冠军电竞经理,百家乐赌场,魔域私服,全职猎人,不良人,黄金岛,鲨鱼游戏,解密,温州麻将,弓箭手,香肠派对绝地求生,公主游戏 女生游戏,模拟游戏,僵尸游戏,世界战争,真钱斗牛,蜀门手游,解谜,街机模拟器,美人鱼,碰碰球,双截龙,博雅斗地主,二战,传奇世界3d,朕的江山,德州扑克国际版,汤姆猫游戏,打砖块,战棋,数字填色,drift legends,腾讯象棋,奥特曼打怪兽游戏,鬼泣4,欧洲卡车,枪支模拟器,刺激戰場,don't starve,消除者联盟,电竞经理,青云诀,slidey,我是mt,lego,碰撞大作战,牛牛赢现金,官,小小突击队,爱奇艺斗地主,公路骑手,成语接龙,射箭,魔界塔,荒野行动吃鸡,吃雞,百家乐平台,熟客温州麻将,rdr2: companion,玩不停,一品包青天,避难所,三国挂机,水果消消乐,啪啪三国,全民奇迹,保卫萝卜2,奔跑吧吕布,密室逃脱:100个房间,吃鸡大作战,捕鱼大作战,战地1,萌幻三国,大富翁9,放置类游戏,鱼,高尔夫,钓鱼发烧友,跑的快,糖果,末日血战,青云情缘,升级拖拉机,官居一品,总裁游戏,皇家守卫军,水浒q传,敢达,停车游戏,竹鼠,提现棋牌,真金游戏,宫廷手游,暗黑奇迹,金庸群侠传x,笑傲江湖,机甲,大厨,2048六角,孤胆车神:维加斯,地球末日,星舰帝国,驾驶,拳击,蜀山风云传,一败涂地,绝地求生全军出击,暗黑觉醒,小镇物语,飞机模拟,航海,医生游戏,洋果子店,real drift,新三国杀,weaphone,梦三国手游,日本动漫,射雕英雄传,双人游戏大全,絕地,fire balls,青鬼,复仇者联盟,反恐精英,刺客,不义联盟,守望阿拉德,杀戮尖塔,gta5侠盗飞车,使命召唤现代战争,枪战游戏大全,长沙麻将,明星三缺一,打仗游戏,影之刃,奶奶,多微,红桃棋牌,决斗之城-游戏王,蜘蛛侠英雄,梦想城镇,桂林字牌,大话西游口袋版,陕西麻将,星际,木筏求生,赤色要塞,芭比公主游戏,求合体,智力游戏,暗黑破坏神手游,果果娱乐,奇幻仙侠,新剑侠情缘,三国无双单机,手枪模拟器,同城跑胡子,天黑请闭眼,死神vs火影,欧洲卡车模拟,植物大战,恐怖爷爷,五子棋-双人对战版,真金牛牛,土豪金闲云阁,枪械,拳王,欢乐玻璃杯,球跳塔,哈狗游戏,越野车模拟驾驶,knot fun,天刀,切水果游戏免费,昭和杂货店,奇迹之剑,行尸走肉,神仙道,火拼双扣,开心农场,国风,零境交错,九天神剑,hello neighbor,仙桃晃晃,九州天空城,滑雪大冒险3,蜀山剑侠,赛车游戏大全,填字游戏,坑爹游戏,莽荒纪元,fr,棋牌app,口袋妖怪单机版,红中麻将,qq炫舞手机版,麻将连连看,盗墓笔记手游,时空,成人游戏,gba,刀剑大作战,三国无双神将,蜀山传,放开那三国3,棋牌游戏平台,just dance,骑士,消除星星,暗黑3,庄园,大话,南京麻将,鬼点灯,一亿小目标,火枪纪元,三国志列传,魔女之泉,舞力全开,飞行,雷霆战机2,边锋,血流成河,水浒传,刀塔,脑力大乱斗,变态传世,变态西游,哥哥斗地主,jj游戏大厅,网络游戏,火柴人游戏,永恒战士,梭哈,帝国,少女游戏,我的世界。,滚蛋吧负能量,梦幻捉妖记,飞刀挑战,仙魔录,玩具大乱斗,real racing3,暗黑破坏神单机,病毒,海岛奇兵2,卡牌对战,冰雪奇缘,飘逸风暴,超级玛丽 马里奥兄弟,官人我要,欢乐球吃球,圣墟,fate grand order,超级马里奥,筛子,战场,孤单车神,僵尸大战,中心医院,pay day crime war,孤岛先锋,肥皂大作战,地下城堡2,战盟,塔防类,古墓丽影9,魔法禁书目录,攻城,巴啦啦小魔仙,公交车游戏,popstar,龙穴战争,守护你前行,信任的进化,围墙大作战,神奇宝贝单机版,怪兽大作战,巅峰战舰,temple run,主题医院,carx,动物园,shoujo city 3d,，我的世界,三国杀名将,画画游戏-儿童涂鸦涂色画画板,回合制卡牌手游,炸金花游戏,红色警戒手机版,史莱姆,黑暗传说,我是市长,热血足球,波克斗地主,小小军团,penrun,牌师,斗地主赢真钱,神秘之城,宫,疾风之刃,爱丽丝,极限竞速,初音,rpg单机游戏,太古传说,实况王者集结,炸金花赢钱,战争模拟器,猪来了,权力的游戏,萌龙大乱斗,植物大战僵尸1免费,霸王的大陆,昭和,方块消除,声控游戏,九州,300英雄,三国志名将传,爆炒江湖,第六天魔王,贪吃蛇大作战2,战舰猎手,飙车,游戏茶苑,填色,功夫熊猫,六发左轮,逐鹿大秦,getting over it,苍之纪元,tap titans 2,机械迷宫,爆裂飞车,海贼王手游,保卫萝卜4,叶罗丽精灵梦游戏,魔法门,赚钱游戏,水浒,欧陆战争,七星湖南棋牌,风流小县令,死神激斗,龙腾传世,paradox,烈焰屠龙,碰碰车,熊大熊二,沙盒,弹珠,小鳄鱼,买房记,決地求生,贵阳微乐抓鸡麻将,qq华夏,求生之王,世界末日生存,聚会游戏,狂野,游戏厅,星星,战神,口袋妖怪绿宝石,三国杀单机,答题吃鸡,knife hit,赢钱棋牌,九品,eternium,疯狂的球球,旋转轮胎免费,全民斗地主,飞行模拟器,飞刀,点击,万智牌,sniper,逍遥仙路,拆散情侣大作战,，我的世界中文版,饥饿鲨:世界,消灭星星经典版,cf手游,炫舞浪漫爱,拳皇97风云再起,四人斗地主两副牌,纪念碑谷2,乐高城市,总裁创世纪,初音未来:梦幻歌姬,神将三国,qq牧场,糖糖,打大a,战争雷霆,对对碰,吉林麻将,动物,冒险,丧尸围城,hole.io,神都夜行,斗兽战棋,游戏王决斗之城,炫舞手游,极无双,梦间集,恐龙快打街机游戏,侠盗猎车5,沙巴克,天龙八部3d手游,蜘蛛侠2,烹饪游戏,热门游戏,我叫mt2,小花仙,别踩白块儿,几何冲刺,侠盗,仙侠世界,td,oppa doll,九品小县令2,dream walker,约战精灵再临,守卫塔防,传奇私服1.76,阿拉德之怒:觉醒,街机三国战纪,炸金花app,战就战,不朽凡人,sky force,doodle jump,逃脱,牌九,暖暖环游世界,地牢,围棋游戏,cat,山西移动和生活,天乩之白蛇传说,car vs cops,helix jump,贪吃蛇大作战2018,三国战纪风云再起,子弹力量,真金炸金花,湖南跑胡子,街机游戏模拟器,刀剑乱舞,黑白钢琴块儿,战机,世界ol,jump,happy,csr,2468,奶奶恐怖游戏,砖块破坏者,你世界二,汤姆猫战营,奇迹单机版,真龙霸业,playdead's inside,大掌门2,亲朋棋牌游戏,真金斗牛,宠物小精灵单机版,黎明杀机,我的英雄学院,神奇宝贝复刻,小游戏单机经典,警车游戏,解密游戏,自行车,票房,猪猪侠游戏,新仙剑奇侠传,恋舞ol,动物游戏,凡仙,仙剑奇侠,三国诸葛,传奇私服复古,战国志,名将传,神回避2,潮汕麻将,bingo消消乐,作妖记,龙城,真钱捕鱼,青云,农场世界,铠甲勇士游戏,蛇,鲨鱼吃人,策略塔防,贪食蛇,警察抓小偷,莽荒纪,玛丽,炸弹超人,模拟器游戏,崩坏学院,四川麻将血战到底,决斗,修仙掌门人,枫色幻想,金花娱乐,羞羞的铁棒,层叠消融,儿童游戏6-8岁,漫威蜘蛛侠,少年主宰,帝国时代单机版,正当防卫,钓鱼看漂,91y,极品飞车最高通缉,足球大师,比鸡,命运之光,小小三国2,信富优贷,堡垒之夜手游,侠客风云传online,homescapes,网游游戏大全,射击游戏大全单机,九九万州麻将,真三国战,steppy pants,table tennis,霸业,未上锁的房间,开车模拟器,三张,铁拳,象棋大师,猜成语,小公主,封神榜,厨师,kingdom,商场教父,阴阳师决战平安京,无限修仙,战争与文明,超进化物语,山西扣点点,真金斗地主,bullet force,圈圈大作战,放置游戏,ro,庇护所,海战游戏,神庙逃亡2,火箭,斯诺克,打麻将,勇者斗恶龙,二人麻将,公花金三真,侍魂胧月传说,克朗代克大冒险,嘣战纪,植物大战僵尸1中文版免费,oxenfree,一起来飞车,海盗来了,坦克大作战,真实枪械模拟器,飞禽走兽,疯狂,爱养成,模拟火车,恋爱养成,头脑,太极熊猫,修女,迷你世界。,全名出击,炸金花赢钱提现,喜妃q传,九品芝麻官,秘密关系,街头霸王单机,宾果消消乐免费,跑得快腾讯,星辰奇缘,不要网的游戏,消灭星星官方正版,正常的大冒险,官场,地下城堡,西行女儿国,妖怪联盟,葫芦娃-正版授权手游,standoff 2,友乐广西麻将,英雄丹,麻友圈,三国全面战争,超脱力医院,地牢猎手6,闯关游戏,远征,越狱,美人鱼游戏,神魔,生存战争,海绵宝宝,建造游戏,卡牌类,limbo,fireball,4399小游戏,酒链世界,大天使之剑h5,碧蓝,三张炸金花,欢乐拼三张,绳索英雄,正统三国,战锤,乐清麻将,百战天虫,青蛙,火焰之纹章,找你妹3,打地鼠,2046,盛世修仙,逍遥诀,单机游戏: 单机版游戏大合集,棋牌游戏城,暴走英雄坛,抽卡人生,陕西闲来麻将,鬼吹灯手游,闲来跑得快,traffic rider,奥特曼游戏大全,守望,葫芦娃游戏,魔法拼图,现代战争4,梦幻小镇,日本游戏,北京赛车技巧,欧洲卡车模拟2018,日系角色扮演,疯狂木偶人,放置召唤师,地球灭亡前60秒!,萌宠冒险,贪玩蓝月-张家辉,末剑,汽车华容道,迷你世界迷你世界,澳门棋牌,腾讯欢乐麻将全集,霸王三国志,cooking adventure,卢石传说,电磁风暴,英雄联盟手机版,好友斗地主,斗战神,感染,对战游戏,太空,大富翁4,地主,变态,中国彩票,realcarparking2,掘地求升,官人,史诗战争模拟器,海南琼崖,流行蝴蝶剑,战争艺术,日式游戏,活下去,大菠萝,荒岛求生2,吉林棋牌,死亡岛,qq农场牧场,跳楼英雄,跑车游戏,泽诺尼亚,气球,挖掘机游戏,彩虹岛,平衡球,哈尔滨麻将,刨幺,关东煮,全民小镇,aa,画个车,爱搜互娱,尼山,暗黑猎魔,神秘海域游戏,闲来合伙人,求生刺激战场,猎人物语,多益战盟,翻滚球球,hello kitty,5v5游戏,白蛇传说,解压游戏,霸王,逃生,神庙,熊出没之熊大快跑,欢乐麻将全集,模拟农场,棋,梦想,幻影忍者,小黄人快跑,多乐,围棋练习大全,pes,ball,97,80分,左轮枪,刀锋世界,消消乐-2017正版消除游戏,罪恶都市侠盗飞车猎车手,卡牌回合手游,天天爱掼蛋,现金牛牛,跳跃战士,woody,fly hawaii,klondike,油管,牌,决战沙巴克,魔兽争霸3,途游,迷宫游戏,警车,色子,空当接龙,破解版游戏,江湖群侠传,小鸟,宫斗游戏,卡车游戏,养成经营,明日之後,真金寻宝乐园,至尊盛世单机版,快乐的玻璃杯,英魂三国,扶摇仙灵,风暴魔域,克隆战争,日系二次元,爱奇艺麻将,悠梦,九黎,航母降落,流星蝴蝶剑手游,河洛杠次,阿瓦隆之王,熊猫四川,梦幻西游互通,澳门威尼斯人,双子传说,魔神世界,腾讯五子棋,侠客,隔壁老王,nbalive,梦想三国,名将街机,刀塔传奇2,鬼泣,霸王龙,轩辕,蜘蛛侠游戏免费,猫咪游戏,狙击精英,滑板游戏,杀人游戏,扑克牌游戏,战斗机,宾果,侏罗纪,么么哒,lovelive,flywings 2018 flight simulator,幻兽归来,恐怖游戏大全,开荒纪元,全民冠军足球,数独游戏 – 最强大脑游戏大全,独自生活,红警2共和国之辉-经典红色警戒单机版,muse dash,青云决,微赢棋牌,当官游戏,我的文明,浅塘,武林外传手游,航海王强者之路,六边形消除,超级大话骰,天天棋牌,坐骑,雪鹰领主,地下城与勇士手游,阴阳,部落守卫战,造梦西游ol,超级英雄,经典游戏,湖南麻将,消防车游戏,天堂,大航海,亲朋,cooking,3d手游,斗帝传奇,花五牛来来来,醉牛斗地主,project offroad,live portrait maker,山海经异兽录,弟五人格,文明大爆炸,麻将来了-腾讯,f1 2018,poly bridge!,神域苍穹,来几局,金贝棋牌,小小梦魇,迷你世界游戏,传奇世界私服,会跳舞的线,icey,smash hit,登山赛车2,逃离方块,神途,宫心计,群侠传,天天斗地主真人版,大话西游2免费版,超市游戏,警察游戏,街机三国志,荒岛,老爹,皇冠牛牛,王国,狗狗游戏,灌篮高手,波克棋牌,死神来了,忘仙,山羊模拟器,创造世界,辉煌耀世,左轮手枪游戏,暗黑无尽之剑,动物温泉,易问,吃鸡战场刺激吃鸡游戏,金花提现,所谓侠客,远征手游,1.76复古传奇,一品大官人,象样游戏,决斗学院,infiniteflight,850棋牌,弓箭手大作战2,广东闲来,大航海之路,two dots,龙王传说,打牌网,双子,星际战甲,倩女,培根,乐高游戏大全,圆舞曲,生存进化,养成游戏单机,越野车,纸牌接龙,猜歌,牧场,涂鸦跳跃,海盗,水浒传老虎机,果宝特攻,推金币,扑鱼达人,建造,奥特曼酷跑,坚守阵地,冰火人,你说我猜,suck.io,诛仙封神录,绝地求生。,广东麻将-闲来,命悬一日,密室逃脱绝境系列,问鼎皇城,猎魂,战玲珑,如果可以回家早一点,战地5,迅雷看看-高清影视在线播放和下载,x-plane,谜题发烧友,全民吃鸡,同桌小游戏,全球警戒,梦幻西游单机,点线交织,青蛙旅行家,常来跑胡子,弹一弹,棋牌游戏大全,血流麻将,我的汉克狗,我要当皇帝,球球大作战3,life is strange,刺客信条本色,造梦西游4手机版,合战三国,植物大战僵尸破解版,魔域口袋,饥饿鲨破解版,雷曼,逃亡,连线游戏,进化,超人,赢三张,森林冰火人,忍者跳跃,同城游戏,双人,卡五星麻将,医院游戏,停车大师,保龄球,侠客行,tom,smart,三国大联盟,ultra sharp,一跳到底,奇迹塔防,三十六计手游,幸存者危城,carvscops,超物理基斗,当心身后,王者裁决,像素涂色,修仙决,传奇来了,极品飞车无限狂飙,回避,蹦坏3,麻友圈2,升官,滚球大作战,旺旺麻将,human fall flat,不良人2,reigns,kick the buddy,满贯捕鱼,idle,arena,集结号捕鱼,侠盗飞车罪恶都市,棋牌大厅,欢乐飞行棋,你比划我来猜,卡车模拟器,克鲁塞德战记,天天象棋腾讯版,跑酷游戏大全,泉州麻将,魔法,美食游戏,美女餐厅,熊大快跑,挂机西游,打飞机,小鳄鱼爱洗澡2,南通长牌,公主化妆游戏,人生,七雄争霸,kof,kairosoft,iq,300,黑月狼牙,想不想修真：凡人传说,unnie doll,.我的世界,开心玻璃杯,圣斗士星矢腾讯,新三国策,黑暗荒野2,莽荒异兽录,3D仙侠手游,嘻嘻斗地主-官方版,百人斗地主,宫廷记手游,开心跳一跳,赢钱斗地主,eweapons™ 左轮手枪模拟器,三国神将传,鳄鱼洗澡免费,僵尸炮艇,百家乐app,豪门足球风云,arcaea,闲来麻将广东麻将,三国战记单机版,双修,化妆游戏大全,滚动天空,腾讯台球,基佬大乱斗,舞,崩坏学园3,极限着陆,忍着必须死,奥特曼格斗,锄大地,解谜游戏,罗马帝国,结婚游戏,石器,烈焰手游,指尖帝国,抢滩登陆,寿司,回合游戏,三打哈,恶作剧神回避,放置骑士,乱世我为王,抱紧大根,crimaster,光之传说,魂斗罗经典,梦幻旅程,王国保卫战 前线,三国军师,途游捕鱼,英雄血战,保皇腾讯,汤姆猫酷跑游戏,波克捕鱼千炮版,山水广西麻将,烈焰龙城,魔女兵器,彩独,少年三国志2,影之刃2,守护城堡,爱惯蛋,帝国霸略,新2048,寻龙,一品,电子宠物,死亡独轮车,龙珠游戏,微乐斗地主,天堂2,进化之地,跑车,瘟疫,消除游戏,武器模拟,棒球,桥梁建筑师,字牌,女孩游戏,博雅,刀剑,儿童拼图,僵尸前线,休闲,五十k,nba游戏,亲朋游戏在线,神怒之神战,易次元,龙骑战记,鲲,3d狙击刺客,兄弟：双子传说,狙击3d刺客:射击游戏 《sniper 3d》,还有这种操作,好运南京麻将,赢真钱游戏,申博百家乐,御剑仙侠,牌乐门,异次元通讯,欢乐三张,双扣全集,奇宝斋,rise up,使命召唤12,欧陆风云,三国霸业,吞噬天地,格斗手游,角色扮演网游,光头强游戏,钢铁侠游戏,跑步游戏,蜀山传奇,直升机,猫游戏,爱掼蛋,汽车模拟驾驶,永恒,大富翁单机,保卫,三国志11,一笔画成,qq五子棋,happyglass,逆水寒手游,神秘海域失落的遗产,真实泊车2,总裁大人,九州风云录,问道单机版,百家牛牛,一零,暗影一直,穿越火线:枪战王者,墙来了,采矿大亨,我的世界中国版,长生诀,欢乐斗棋牌,变形金刚机器人,熊猫四川麻将血战到底,机器人大作战,bowmasters,坦克连,胡芦娃,hidden city,angry birds,迷你特工队,心动劲舞团,仙境传说ro,火炬之光2,花语月,音游,blackbox,大型游戏,大秦,拳皇2002风云再起,鬼游戏,叶罗丽,赌钱游戏,方块消消乐,变态版,餐厅游戏,边锋麻将,贵阳麻将,诺曼底,街机三国,螺旋,花千骨,芭比公主,联机,美味餐厅,神魔之塔,果汁四溅,射箭游戏,天下3,吕布,吃豆人,台球游戏,千变双扣,剑网,创世纪,五子连珠,七巧板,oppadoll,粘液模拟器,剑灵仙界,猜画小歌,卡车模拟器2018,螺旋跳跃,长春麻将.微乐,trapadv,上古战纪,角色扮演类,足球世界,全军突击,热血霸王,truck simulator 2018,电音超跑,福建助学,silly walks,fast track,屠龙单机,真金棋牌,腾讯麻将全集,斗罗大陆3龙王传说,你你世界,光宇游戏app,合金弹头单机版,永不言弃3,best fiends,bb弹,捕鱼游戏厅,命运冠位,谁是卧底单机,龙之谷手游,小小,斗龙战士,人类,超级玛丽单机版,枪战游戏免费,摸拟山羊,清宫q传,三国卡牌游戏,仙剑奇侠传2,雷霆,超凡蜘蛛侠2,英雄坛说,航海王启航,红蓝大作战2,竞技游戏,真三国,沈阳麻将,比手画脚,死亡扳机2,模拟枪,打僵尸,塞车游戏,仙剑奇侠转,上饶麻将,三国志曹操传,三国之刃,七龙珠游戏,mu,dc,stair dismount universal,project：offroad,神都夜行路,玻璃杯,恐怖奶奶。,矢量跑,烧脑的三国,大秦王朝争霸,龙魂战纪,热血传奇1.76,反斗联盟,flip trickster,百人龙虎,one room,网红游戏,皇室守卫,幻剑神魔,神雕侠侣2,去月球,消消乐腾讯,琼崖,mini dayz,家园7贵族,传奇单机版,英雄群侠传,滨果消消乐,泰拉,喵喵大作战,火柴人越狱,蛇蛇,弄死火柴人,天天军旗,bike race,刚琴块2,街霸5,逃出神秘宫殿,新大主宰,侠客风云,山西和教育,二八杠,小汽车游戏,不义联盟人间之神,诛仙3,qq斗地主官方,超神学院,赛车比赛,荒野求生2,猜歌名,游戏机,消防车,城堡争霸,地铁游戏,劲乐团,免费游戏大全,亡灵杀手,五子棋大师,osu,方块纸牌,鬼修女,神回避1,animal hot springs,evil nun,史莱姆模拟器,拔条毛,牛牛赚钱,王者集结,新单机西游,真金百家乐,兽人燃烧军团,香肠吃鸡,荒野求生刺激战场,2018游戏,升级:全民拖拉机,经典升级 80分,好玩的游戏大全,牛牛游戏城,够级-山东经典全民棋牌游戏,剑侠情缘2剑歌行,红桃娱乐,全球风暴,大吉大利,大神娱乐,弓箭手门,佛手在线,仙剑4,mariorun,七日之都,熊大熊二酷跑,5v5竞技,海底大作战,神奇宝贝世界,单机江湖,lost tracks,flappy bird,放置挂机,打鱼赢钱,逐鹿,蜀山剑侠传,中超风云,多牛百变方块,大天使,大逃杀,角色扮演单机,我是掼蛋王,军旗游戏,魔女之家,赌场游戏,伏魔记,风云,金庸群侠,跳跳球,赵云,罗马,糖果苏打传奇,百家乐路单,男生游戏,浪漫庄园,水族馆,我叫,弓箭,幸存者,小鸟爆破,学院,孤单车神维加斯,孢子,失落之城,大航海时代,去吧皮卡丘,卧龙吟,卧虎藏龙,倒车,保卫家园,乐彩网,中国象棋单机版,walkr,vector,slg,地狱逃脱,王权权力的游戏,悠闲箱庭！商店街,spill it!,真人炸金花游戏,电击文库:零境交错,抖音游戏大全,仙侠双修,最终王冠,全民出击刺激战场,九幺棋牌,国风仙侠,自由幻想手游,夜行录,正统江山,无厘妖妖,绝地战场,不思议棋牌,射击游戏3d狙击,慌野行动,inside免费,turbo dismount®,模拟当官,坦克世界闪击战,穿越火线吃鸡,青春篮球,小学拼音学习,荣耀棋牌,智力游戏大全,干瞪眼腾讯,97拳皇格斗单机,街机游戏大全,我的迷你世界,to the moon,神将无双,猫跑酷,烹饪冒险,红中赖子麻将,黄山麻将,小猫跑酷,三国战纪单机游戏,benghuai3,我的世界神奇宝贝版,三国志曹操,丛林大作战,vr女友,梦幻逍遥,苍穹战纪,崩坏2,cat cafe,腾讯德州扑克,io,僵尸大作战,无尽的边界,幻影猫,生存类游戏,闽南麻将,梦想家园,模拟器小霸王,感染者,死亡日记,斗罗大陆手游,gba口袋妖怪,秘密世界,一笔,水杯,新天龙八部,野蛮人,境界,画个火柴人,过山车游戏,吞食天地2,小公主苏菲亚,超级飞侠游戏,虫虫大战,模拟人生中文版,使命召唤4,车子游戏,赛车总动员,贯蛋,装扮游戏,艾诺迪亚4,舰娘,老爹汉堡店,美妙世界,皇后成长计划,玛丽奥,激流快艇,水果老虎机,横版,柯南,挖坑,挖土机,快跑,开心水族箱,建筑模拟,少儿游戏,宁波游戏大厅,孤胆枪手,孙悟空,女优,大乱斗,城市建设,地铁跑酷2,反应堆,二战风云,space,score,mmorpg,jj棋牌,gun,drift,dragon,777,pakoforever,商圈名媛,你好.邻居2,斗花金乐园牛一次,官路巅峰,决斗の城,菇菇巢穴,机器人鲨鱼,僵尸感染,冷酷灵魂,寻龙摸金,游戏大全2018单机,神秘海域3,欧陆战争6,我的世界吃鸡,魂武,抢庄牛,燃烧的意志,龙城一刀,左右棋牌,曲径通幽,代号英雄,美味的披萨,求生之日,诸葛神将,我的霸业,百人金花,soccer kick,蜘蛛侠 3,为谁而炼金,我的王朝,终极者,地主欢乐版,公主城堡,太空边界,三国名将传,畅由,龙城传奇,迪斯尼官方app,挂机类游戏,微乐鞍山麻将,攻城三国,小鳄鱼爱洗澡中文版,斗地主赢红包,芭比娃娃生宝宝,红色警戒单机游戏,车祸模拟器,嗯吃蛇大作战,sky dancer,大侠风云传,哈局十三张,self care,五子棋单机版,tom猫跑酷,give it up,新倩女幽魂,狂暴之翼,kindom rush,洛奇英雄传,公主游戏大全免费,奴隶少女,地狱边境2,魂之幻影,模拟医院,beamng,倩女幽魂2,捉妖,猪,gta5中文,剑侠奇缘,魔兽争霸,骑马与砍杀,走路,象棋残局,角色,西游释厄传,美人鱼公主,绝世唐门,纸牌游戏,符文大师,破解版,消星星,汉堡,朵拉,捉鸡麻将,愤怒小鸟,帝国时代2,帝国战争,宠物游戏,宠物养成,宝石迷阵,妖姬,奔驰宝马老虎机,奔跑吧兄弟,大亨,塞车,名将,名侦探柯南,双升,双人小游戏,单机象棋,像素游戏,侠岚,乐动达人,zombie,sims,mmo,civilization,city,510k,诛仙香蜜,三色绘恋：我们恋爱吧,unniedoll,knock balls!,御仙剑,香肠派对。,大话西游单机,太虚谣,黑洞吞噬,梦幻机场,三国:全列战争,队长小翼,烧脑策略,网易四川棋牌,五人格,不朽仙途,荒野行动全军出击,粉刷匠大作战,巨齿鲨,中国福利彩票官方,maze book: blackboard,age of magic,兵人大战,网易云游戏,云顶棋牌,葡萄积木,rpg卡牌,养成手游,贪玩蓝月传奇,泡泡龙消消乐,现金斗牛,大秦王朝,闲来广东麻将精华版,黄梅麻将,hidden folks,琼崖麻将,史小坑,老虎机下分,爱莲说,正版传奇,传世私服,求求大作战2,闲来安徽麻将,大枪游戏,csr racing 2,idle miner,hole,棋牌娱乐平台,小心身后,hungry shark,fashion empire,梦幻足球,益智游戏成人,四川游戏家园,永生劫,强者之路,江山美人,江苏快三,九州娱乐,宇宙沙盘,全民钓鱼,qq桌球,途游五子棋,冒险岛单机,经典传奇,挖到地球中心去,多乐跑得快,新三国,喜欢和你在一起,中国福彩,大型单机游戏,暗黑地牢,滚动,舞动乾坤,撞车游戏,颜色识别,幻想神域,博雅象棋,街机游戏厅,模拟枪支,黑白棋,魔塔50层,魔兽守卫军,飞镖,采蘑菇,部落战争,途游麻将,途游中国象棋,连环夺宝,赌场,血战上海滩,英雄战歌,种菜,福彩3d,矿工,生化,狂扁小朋友,涂鸦上帝,泰坦,河北麻将,武器,无限飞行,攻城略地,打屁股,恐龙游戏免费,少年,小猫游戏,小游戏大全,对战,声控,吞噬,台球帝国,古龙群侠传,古墓,单机小游戏,凡人修仙,农场小镇,全民足球,光头强,像素车,侏罗纪公园,传说,乱斗堂,万花筒,war,poker,pizza,jj麻将,evoland,delicious,boy,60,站塔英雄,二次元联盟,pk10娱乐,第五人格。,神兽超世代,xiangchangpaidui,偶遇佳人,爱转机,pongpongegg,超时空乱斗,隐藏犯罪,曼谷暴雨,猫咪公寓,旅行青蛙汉化版,天天酷跑2018,华容道数字游戏,蜀山剑侠缘,欢乐斗地主真人,欧卡2,欧卡,weap,迷雾求生,梦幻超进化,轩辕传奇-腾讯手游版,打大a-内蒙打大a,，愤怒的小鸟,神庙逃亡 绿野仙踪,箱庭都市,多乐贵阳捉鸡麻将,迷失岛2,仙侠世界2,秘境对决,qq炫舞手游,仙侠奇侠传,米你世界,crash of cars,松滋麻将,游戏机被老妈藏起来了,狙击精英4,真人金花,诸侯征战,freeroam city online,天空滚球,城堡传说,塞子摇一摇,24点游戏,英雄无敌3死亡阴影,game house,梦幻仙途,自由之战2,qq音速,harry potter,女儿国,汽车大逃杀,震东济南棋牌,我的宫廷,国王纪元,world chef,scale,腾讯欢乐斗地主,莉比小公主,恐龙游戏大全,山海,猫咪盖饭,海贼王强者之路,日系卡牌,主宰,巴士模拟,拖拉机80分,惊梦,91y游戏中心,2048六边形,世界末日,西山居,全民枪王,做饭游戏大全,快打旋风,生命线,沉默年代,游戏王决斗新世代,灵魂摆渡,天涯明月刀游戏,神武2,拳王97,登山赛车破解版,超级玛丽奥,电玩游戏厅,滑雪大冒险破解版,汽车模拟器,联机斗地主,现金斗地主,点击游戏,找不同游戏,吉祥斗地主,三国杀单机版,qq麻将血战到底,酒吧骰子,逃脱游戏,过山车大亨,跳舞游戏,角色游戏,虚拟女友,经营餐厅,神庙逃亡1,生宝宝游戏,甄嬛传,猫猫,死亡空间,武装突袭,植物大战僵尸中文版,极限摩托,极速飞车,松饼骑士,李逵劈鱼,暴力街区,时空猎人腾讯版,日式,无尽,打牌,打架游戏,打仗,愤怒的小鸟1,愚公移山,御剑,弹弹球,开飞机,奇幻射击,塞子,地下,圆桌骑士,咖啡厅,和风物语,君临天下,厦门麻将,动物模拟器,加菲猫,创造,冰淇淋游戏,保卫萝卜1,三打一,zen,wephone,warhammer,sudoku,subway,36计,碰碰车大乱斗,无烦恼,魔界骑士,封神变态版,龙卷风大作战,拍案惊奇,斗破苍穹斗帝之路,刀锋群英,天使之诫,baldi,Trade Island,换装少女,太空边界2,同桌大作战,天乩,龙魂纪元,奥特曼英雄归来,全民当官,endless frontier saga 2,姚记捕鱼,灵魂之桥,绝地求生，刺激战场,cytus2,越野泥跑者:旋转轮胎 2018,unmatched air traffic control,梦幻模拟,炸金花赢三张,卡车模拟-欧洲大卡车驾驶游戏,狂暴之翼hd-3d炫战arpg手游,鼎力三国,异兽,轮回诀,足球经理2018,我的绿洲,仙凡幻想,今晚吃鸡,留言侦探,王城无双,幻想计划,黑暗料理,五行师,mergedragons,风云传,回忆之旅,芝麻官,迷你世界3,我的恐龙,kami2,疯狂撞车王,贵州闲来捉鸡麻将,游戏藏起来了,开天,开车游戏大全,诛魔,人人快卖,汉克狗,魂之刃,冰果消消消,qq飞车手游,变形机器人,口袋川麻,江湖风云录,pixel gun 3d,僵尸漫步,热血龙城,天天打波利,腾讯斗牛,amazing frog,cooking mama,精品推荐游戏,海王捕鱼,海南麻将,三国曹操传,单机游戏大全免费角色,一拳超人,值物大战僵尸,祖马游戏,偶像梦幻祭,打方块,raft,世界3,永州跑胡子,群雄逐鹿,逍遥,关东煮店人情故事,独立游戏,镇魂曲,六边形,火影忍者手游,古剑奇谭2,战地3,赛罗奥特曼,崩坏学院3,狙击手游戏,台州麻将,极品飞车17,gat5,勇敢的心世界大战,摸拟人生,野外求生,红警单机,欧洲卡车模拟2,日系游戏,女友养成,三国群英传单机,饥饿鲨鱼,飞行游戏,风云三国,预测未来宝宝的长相,逗地主,转转麻将,足球小将,贪吃,象棋巫师,苏州麻将,航空指挥官,航空大亨,脑力达人,美国末日,红十,竞技,皇牌空战,白雪公主,疯狂喷气机,猫里奥,猜字游戏,爱丽丝快跑,煮饭游戏,烧烤,消除类游戏,河南麻将,机场,未来,暗黑黎明,明星志愿,明星养成,摩天大楼,探险,排球,挖金子,扫雷游戏,打人游戏,战舰帝国,我的汤姆猫2,我的安吉拉2,建筑游戏,妖怪,奥特曼打怪兽,喵星人大作战,史上最牛的游戏,博士的家,动作,便利店,三国群英传1,三国kill,sd敢达,rust,qq超市,qq游戏麻将,glass,fc游戏,f18,escape,candy,90坦克,stairdismount,开朗游艺,二次元卡牌日式动漫,方舟生存：丛林探险,枪械 模拟器左轮,虎皇互娱-龙争虎斗,游易斗地主,勇士守护,杯子接水,莽仙纪,香腸派對,家居设计 改造王,木偶人,烈火私服,斗帝,三色绘恋,猪猪侠之竞球小英雄,完美的线,剑与家园:巨龙时代,神话手游,wind rider,明珠卡,皇冠足球体育,统一代码查询,百变美,dungeonmaker,明日过后,总裁养成,粉红血液,国风游戏,至尊蓝月,博乐娱乐,王权三国,金贝炸金花,小兵大冲锋,憎恨之心,跑酷猫跑酷,鱼鱼乐,color road,兔子吃胡萝卜,如果明天是晴天,绝地求生.全军出击,恋与宫廷,剑影逍遥,拱趴大菠萝,清宫无间斗,沧海仙途,网易麻将,暗影之怒,权倾朝野,云裳,屠龙烈火,王者来了,prepare,仙剑四,像素吃鸡,抖音音乐,仙侣传说,跑胡子-湖南经典字牌游戏,孤胆车神:维加斯破解版,c.a.t.s.,模拟城市:我是市长,不要停!八分音符酱,轩辕剑参外传 天之痕,梦幻单机版,万岁爷,纪念碑谷免费1,模拟卡车2017,我在7年后等着你,百灵拼三张,心悦吉林麻将,星期六魔王,卡片怪兽,漂流少女,数码宝贝大乱斗,金贝游戏,我做夫人那些年,洋果子,命运之城,差不多英雄,传奇私服单机版,beholder,爽快斗地主,中国像棋,老铁扎心了,边锋掼蛋,四川熊猫游戏,如意棋牌,沙城烈焰,侠盗世界,英雄就是我,单机角色扮演类游戏,三国群英传单机游戏,四川熊猫,你划我猜,宫廷养成,消消乐海滨假日,模拟山羊僵尸版,顽皮小鳄鱼洗澡,精灵宝可梦日月,梦幻模拟战2,山水云南麻将,口袋之旅,simple rocket,温泉物语,暗影格斗2,不休骑士,sky force r,唱舞团,山海经传说,兰空,三国杀腾讯,cat fishing,小偷猫,true skate,dream league,dead island,迷你地铁,断勾卡血战麻将,天天麻将,诗词大会,皮卡丘游戏,飞机游戏大全,小小屠龙,钢琴快二,战舰少女r,梦幻诛仙2,鬼吹灯游戏,热血传奇单机,游戏排行榜,比较简单的大冒险,疯狂坦克,美美小店,萌宠大作战,doll,全职,小白兔,小偷,不用网络的游戏,我们的世界,纪元,常德跑胡子,末世,梦想花园,安吉拉猫,侠盗猎车手罪恶都市,fc游戏合集,超级玛丽经典,游戏社区,98拳皇格斗,你猜我答,孤岛余生,baobaobashi,问道小秘书,星际战舰,途牛斗地主,机场模拟,小黄人酷跑,黑白块,鹿鼎记,食堂,飘移,集结号,速算,边锋双扣,货车游戏,象棋游戏,螃蟹先生,萌宠,真实驾驶,盖房子,疯狂猜成语,疯狂农场,玛丽兄弟,狩猎,爱情游戏,炸弹,火车模拟器,滚球,淘金者,消灭,比特,杀手狙击,最新游戏,明日边缘,方块拼图,斗罗大陆游戏,捣蛋猪,挖金矿,拍电影,打豆豆,打猎,扑克牌,战机世界,恋舞,微微一笑很倾城,工程车游戏,山羊,小猫咪,富翁,宝宝画画,宝宝拼图,娱网棋牌,女仆,夺命侏罗纪,天使之翼,天使,合体,史上最难的游戏,召唤,厨师游戏,单机游戏大全,单机捕鱼,勇者,劲舞,剑魂之刃,上古,三维弹球,nba篮球,injustice,gt,cook,chess,星聚游戏-欢乐相聚,doctor's oath,诸天决,鬼和抢,疯狂影院,fr legend,跳舞的笔手游,REALM WAR,巴尔迪老师,仙境西游,蹦战纪,妖怪大魔王,风之大路,找到老公的私房钱,grim soul,ballblast,斗破修仙,表情锅,战箭天下,god hand go,摩天轮app,迷失古堡,王者勋章,九州异闻录,德州扑克app,蛋蛋花,QQ华夏手游,，乐高,全面出击,小春传奇,投影寻真shadowmatic,神怒,宫廷记,跳一跳微信版,inside免费版,塔防之光,英雄请留步,金花游戏,卡牌塔防,最囧游戏 4,迷你世界: 联机像素积木沙盒游戏,英雄无敌3死亡阴影单机,酷跑游戏,,比手画脚-随身版,2048 中文版,hustle castle – 成为避难所的骑士,游戏茶苑双扣-温州麻将 火拼比赛 千变百变双扣,最终幻想:觉醒,口袋妖怪- 皮卡丘游戏,街头霸王 免费,热血合击,中国象棋在线,初音速,世界战争英雄,仙侠挂机,神物3,贪玩棋牌,倔地求升,红名霸业,絶地求生,龙骑士战记,29天,蜀山手游,传奇私服最新,禧妃,扎金花赢钱,ar dragon,我叫mt世界,魔兽守卫军2,躲猫猫大作战,铁血刺客,snake vs block,倩女幽魂口袋版,玛法,罪恶都市中文版,肖肖乐,空战联盟,谜你世界,混沌与秩序3,衡阳十胡卡,末日危机,欢聚麻将,万人棋牌,小小航海士,tile rider,二次元少女,超冒险小镇物语,鲨鱼模拟器,火柴蜘蛛侠英雄,拳皇世界,休闲游戏大全,横版动作游戏,哥哥游戏,汤姆猫跑酷免费,神兽金刚游戏,西游记释厄传,大作战游戏,桃花源记2,绳索英雄2,toon blast,瘟疫公司免费版,闲来宁夏麻将,同城跑胡子全集,cut the rope,缪斯计划,嵊州麻将,太古,缤果消消乐,真人棋牌游戏,仙剑奇侠传3d回合,qq幻想,全民超市,热血霸业,feist,安魂曲,欢乐真人麻将,双休,手机麻将,subway surf,steve,英魂之刃手游,我的女友,英魂,offroad,策略网游,三国单机游戏,山西麻将,舟山麻将,熊大熊二游戏,格斗游戏大全,汽车游戏大全,魔兽世界手游,新斗罗大陆,三国志单机版,钢琴快,三国战,战棋类游戏,老虎机单机版,多益,四人斗地主腾讯,opus,六龙争霸,亲朋捕鱼,安琪拉,仙侠单机,大球吃小球,撸啊撸,全民炸金花,欢乐棋牌,roguelike,小小理发师,日式rpg,爆笑虫子,人格,冒险岛手游,小孩子玩的游戏,奴隶,孤岛求生,霸王龙游戏,无锡麻将,拳皇97单机,火柴人联盟2,住宅梦物语,景德镇麻将,长春麻将小鸡飞蛋,战争策略,战争机器,热门手游,求生游戏,摸拟游戏,川麻将,大富翁腾讯,同城游戏大厅,齐天大圣,麻雀,鳄鱼小顽皮爱洗澡2,高铁游戏,顶蘑菇,鞍山麻将,阻击手,闪电部队,长牌,野外生存,赛车游戏免费,诺曼底登陆,诺亚传说,血族,苍穹,芜湖麻将,脱衣服,网球王子,绍兴麻将,砖块,电影制作,玩具,猫和老鼠游戏,猜谜语,沈阳四冲,汉堡游戏,模拟驾驶飞机,暴打老板,晃晃麻将,方块游戏,数字消消乐,接龙,拳击游戏,打滚子,手枪游戏,手指滑板,战斗游戏,战地指挥官,弹弹岛,小狗游戏,封神演义传,妖姬ol,奔跑吧,天天农场,大战游戏,城堡,地牢猎手4,围城,四冲,呆萌小怪物,同城打大a,合金弹头无敌版,口袋西游,冒险王,养鱼,八十分,像素射击,傲气雄鹰,体育游戏,乒乓球游戏,丹东麻将,东北刨幺,不可思议,standoff,stack,shadowmatic,rider,lushi,kami,golf,g5游戏,dead,batman,mingrizhihou,斗帝传奇:焚诀,蛮荒行星,虎皇,疯狂流浪汉,泰洛尔颂歌,宿舍是不可能核平的!,花创互娱,大话西游变态版,水杯游戏,cube escape paradox,元气骑士。,monster girl maker,澳门电玩棋牌,暴破少女,我的世界绝地求生,巴尔迪,超级星鱼,隆中对,绕圈跑,王者打砖块,逃跑吧,龙卷风游戏,最强西游,热血传奇复古,中国体育福利彩票,迷你吃鸡,twenty48,醉仙途,广告侠,支付宝到账铃声,追光娱乐,real car parking 2,提现扎金花,love balls,萌猫物语,怪物老婆养成记,第九滴血,妲己传,一品官途,新诛仙手游,天际跳跃,吃雞戰場,turboprop flight simulator,我的世界枪战吃鸡,绝地求生:吃鸡战场,絕地求生 全軍出擊,可口的披萨,美味的披萨,生死狙击4399,消灭星星2018,大掌门2-武侠rpg手游巅峰巨作,东京战纪,乐享棋牌,传奇1.85,全新三国,三国志卡牌,使命荣耀,魔幻纪元,捕鱼游戏机,探灵,我在七年后等你,骰子摇一摇-酒吧、聚会,1.76,三国战记-风云再起,金鲨银鲨-老虎机,dumb ways to die,愤怒的小鸟 变形金刚,build a bridge!,双扣-浙江经典棋牌游戏,欢乐麻将•腾讯,圈地围城大作战,color number,高达争锋对决,星星消消乐2018新版,球球与白块,口袋妖怪宝可梦,危境崛起,跳棋双人,修真风云录,qq炫舞正版手游,魂之轨迹,绝地球生,修真之旅,传奇世界复古,九州行,县令,你身上有她的香水味,小酒馆,万豪棋牌,云顶娱乐,天马乐园,楚留香手游,无双赵云传,大发棋牌,熊熊乐园,欧布奥特曼,野蛮,希尔薇,仙侠修仙,梦幻药剂,dnf手游版,cookie cats pop,热血传奇单机版,九州风云,三国街机霸王,声音游戏,上海敲麻,合击传奇,吉祥吉林麻将,武穴麻将,网上百家乐,开心大赢家,宝宝长相预测,ufc格斗,无畏战舰,木筏,梦幻西游口袋,红色警戒单机版,机器人大乱斗,传奇英雄,火柴蜘蛛侠,叶罗丽仙子,联机游戏大全,巅峰坦克,云南山水麻将,龙港麻将,切西瓜免费,潜江晃晃,推理学院,战地模拟器,乐高城市警察,广西山水麻将,筑志红中麻将,my country,西游挂机大乱斗,疾风天下,众乐棋牌,fifa online 3,gamepigeon,凡人修仙记,妃,fifa online,850棋牌游戏,沙城争霸,熊出没之机甲熊大,哈狗台州,野狐围棋,寿司大厨,wood puzzle,big fish,wwe 2k,打鱼赢钱游戏,暖床,the tribez,extreme landing,drive ahead,砖块消消乐,qq欢乐斗地主,利比小公主,邳州麻将,传奇永恒,六界仙尊,地铁酷跑二,多人联机游戏,滚动的球,传世手游,超级幻影猫,最囧游戏3,武动乾坤手游,太极熊猫3,三国猛将,假面骑士铠武,梦幻庄园,儿童画画游戏,帅土之滨,整蛊邻居,涂游斗地主,南瓜先生大冒险,梦100,真人赢三张,q传,fatego,三国群英传3,百变方块,pinout,情缘,博乐,流星,碰撞,梯子,你是我的阳光,朱罗纪世界,幺地人,爱洗澡的小鳄鱼,穿越火箭,经营策略,三公,幽灵行动,大货车游戏,三张牌,孤单枪手,温岭麻将,乐高世界,极限越野,恐龙快打无限币,2岁儿童游戏,梦幻三国,自行车游戏,古风游戏,单机斗地主免费,2048俄罗斯方块,魔女,魔力,马戏团,饭店,风火轮,霸王大陆,街头,血战到底麻将,蓝球,菇菇,茶苑,舰队,舞蹈游戏,胡莱三国,美少女养成,米拉奇战记,神魔大陆,皇后养成计划,百万亚瑟王,疯狂的小鸟,画画板,男友,牌类游戏,爱情公寓,火影忍者疾风传,海贼王启航,海绵宝宝游戏,海岛大亨,沙盒游戏,永恒战士2,死亡,极速狂飙,杀手47,最好玩的游戏,暴走,方块世界,探险游戏,拱猪,托马斯小火车,扑鱼,战车,战地4,怪物,弹钢琴游戏,弹琴游戏,异形,帝王三国,将军的荣耀,密室逃脱游戏,孤岛,女生小游戏,女孩子玩的游戏,天空,天天爱,填大坑,哆啦a梦,古装游戏,古代,卧底,北京麻将,剧情游戏,出租车游戏,养宠物,儿童绘画,仙境,仙剑奇侠传5,仓鼠,二七王,争霸,丧尸女友,xplane,trainz,tank,q版,puzzle,patch,nova,kingdomrush,ketchapp,gtasa,girl,flip,dynamix,cod,2047,2018,最强连一连 2018,智慧大逃亡,战国之道-序章,深圳福彩,truck simulator2018,神躲避,诛天诀,全名主公2,u赢游戏,鑫盛游戏,四方坦克大战,tornado.io!,shoot n merge,我要当皇上,薯片厨房,恐怖老奶奶。,广东麻将好友房,辐射:生存日记,腾讯麻将好友房,哆啦A梦飞车,枭雄的荣耀,途游四川麻将,一木娛樂-99大戰,mia气-划水麻将,啊瑞斯病毒,升职游戏,你好,邻居,头脑吃鸡-王者赛季,老奶奶恐怖游戏,黑洞来了,全职猎人X,奶奶 模拟器,世界卡车,gogo加速器,老公的私房钱,枪手来了,左右消消消,中国福利彩票官网,阿拉德大陆,三界逍遥,模拟总裁,Taptapheroes,神途传奇,上古神兽记,恶狼游戏,神海4,即刻棋牌,侠盗骑兵,三国志大战M,萌萌餐厅,钱真多,吃鸡游戏刺激战场,滴水钱包,遥控小飞机,最强弹一弹,弹球王者,航母降落hd,王爷快过来,flfa足球世界,星河联盟,逍遥剑客,龙城战歌,二次元策略,国风卡牌,三国志群雄传,世界制造者,挂机修仙,疯狂塔防战,轻松跑得快,群英之战,第五人,见缝插刀,模拟飞行2018,奇喵的画家,裁决传说,嘉妃q传,腾讯围棋（野狐）,蜀山情缘ol,石器文明,梦幻西游变态版,toytown,超车小能手,妃子游戏,旅行的青蛙,trap adventure 2,小金棋牌,三国江山策,大魔王漫画,模拟农场2018,猫咪很可爱,twisty road!,大话西游单机版,传奇1.80,剑之荣耀,俄罗斯方块经典版,捕鱼万炮版,人生赢家,百人三张,抖音小游戏,欣悦麻将,飘移风暴,万王,飞行棋-多人对战版,大鱼吃小鱼-经典版,彩独 2,保皇-山东人的游戏,辐射:避难所,刺客信条：本色,冰雪奇缘:冰纷乐,x-plane10,赛车游戏免费 真实赛车,血流成河-换三张一胡到底,love you to bits,paper.io,sniper 3d破解版,闪击战,牛牛游戏厅,剑歌行,rento fortune,养猪场mix,永远的七日之都,小小英雄传2,屠龙传世,那一剑江湖,一起来冒险,散人传说,当官手游,坎巴拉太空计划,juedi,抢我,36种死法,stack ar,湘西棋牌,文字放置,画画猜猜,失落园,烹饪达人,姬魔恋战纪,小虾米闯江湖,贪玩蓝月单机版,托拉姆物语,三国策略手游,leap on,昆仑墟,永恒边境,不洗牌斗地主,windin,lastdayonearth,真钱博彩,中至常熟麻将,你行你上,绝境求生,澳门百家乐app,爱来麻将,热血单机,cooking craze,欢乐牛牛大厅版,真无双三国,腾讯欢乐,飞越仙境,暗黑手游,模拟手枪,ninja arashi,赌钱平台,塔防奇兵,我的使命,大狩猎,昆特,金庸武侠,拳王97单机,散人传奇,传奇扑克,物种起源,最后一步,锄大地腾讯,火柴人绳索,公主美发沙龙,集杰大连棋牌,三国志群英传,侠客传,娱乐场游戏,官老爷,三国群雄,掼蛋单机版,宫斗手游,仙灵大作战,一起来跳舞,宁夏麻将,荒岛求生游戏,心动女友,赤月传奇,吃蛇大作战,光影对决,海上生存,真三国无双单机,抽卡游戏,侏罗纪世界进化,红包斗地主,抽卡,练车软件,纪念碑谷2免费版,猫星人大战,像素生存,橡皮泥游戏,内蒙麻将,变形机器人英雄,dance line,腾讯欢乐五子棋,不思议,叫我官老爷,疯狂贪吃蛇,red dead redemption,怀化红拐弯,mini metro,热血战神,阴阳师手游,石油大亨,fire ball,over cook,yy麻将,peach blood,奕乐贵州捉鸡麻将,game loft,shadow fight 3,红警手游,妖精组合,料理次元,战天下,七雄战记,挖机,王者军团,守望先锋手游,逮狗腿,三海经,新全职猎人,爱奇艺游戏,求求,九阴真经3d,贪吃蛇大战,气车游戏,问到,破天一剑,糖果派对,rockstar games,real racing,high school,hay day,汽车改装可视化,在线棋牌,宝宝长相,爆裂飞车游戏,疯狂动物,求生大作战,太阁立志传,knife,cooking dash,car parking,变形金刚救援机器人,众博棋牌,张飞,江湖x,全民麻将,三目童子,洗澡的鳄鱼,说剑,巴拉巴拉小魔仙游戏,修仙世界,海岛生存,三国塔防传奇,小朋友玩的游戏,帮帮龙,多乐升级,贵阳捉鸡,甜甜萌物语,京剧猫,传奇世界手游,魔窟,沙城霸业,斗罗,卡牌类手游,单机游戏大全免费射击,梦幻水族箱,像棋,乱世三国,哈弗互联,战锤40k,异次元,传奇盛世,撕掉她的衣服,魔龙之魂,圣火徽章,问道奇宝斋,混斗罗,我叫mt3,代号47,恩施麻将,寻龙诀,龙骑,星河战舰,神器宝贝,九层妖塔,钢琴键,云顶游戏,武侠单机游戏,温州双扣,欢乐斗地主赢话费,点杀泰坦,老爹游戏,火柴人英雄,鱼丸游戏,rento,鲤,群侠,王朝,同一个世界,拳皇单机,weapons,无尽战区,铠甲勇士打怪兽,快打,九洲,黑暗世界,大庆麻将,盗墓迷城,大卡车游戏,大卡车,大陆,长腿爸爸,船,狼,海岛奇兵破解版,twenty,红警4大国崛起,坑爹小游戏,神秘花园,机战王,手游传奇,无尽大冒险,克鲁塞德,全民枪战2,方块逃脱,客车模拟,gta5游戏,摸拟驾驶,单词风暴,大圣归来,奇迹暖暖环游世界,gg斗地主,我是大官人,江苏快3,仙剑决,勇敢的约翰,救护车游戏,挖掘机模拟器,减压游戏,lifeline,美食大战老鼠,ae86,黎明之光,饥饿鲨进化破解版,飞禽走兽老虎机,秦时明月手游,神奇宝贝xy,盛大传奇,点击泰坦,火箭游戏,漂移赛车,坦克大战1990,吊车游戏,合成游戏,升级单机版,黑白,黎明,鳄鱼爱洗澡,魏蜀吴,马里奥赛车,音乐大师,闪客快打,金蟾捕鱼,逃出,过家家,边境,轮盘,跳楼,赛尔号游戏,设计游戏,血战麻将,蝙蝠侠游戏,萌娘餐厅,莽荒记,荒岛生存,花牌,联众,羽毛球游戏,网球游戏,网游游戏,经营类,经典方块,红色,矢量,真人麻将,相棋,直升飞机,直升机游戏,监狱,皇后,疯狂捕鱼,现代,玩具兵,犯罪,特种部队,爸爸去哪儿,燃烧的蔬菜,热血高校,热血三国,滴滴打人,深海捕鱼,汉诺塔,水上乐园,毛毛虫,欢乐四川麻将,模拟人生3,梦幻手游,桌球游戏,杀手2,暗黑挂机,料理妈妈,整蛊,搞笑游戏,挂机三国志,找东西,战斗,我是卧底,成都麻将,愤怒的小鸟太空版,愤怒,忍者必须死2,忍着,征途手游,影子格斗,开飞机游戏,开心斗地主,帝国塔防,巨神战击队,尾行,小宝宝游戏,射击游戏大全,密室逃脱1,宝石,孩子长相,奥比岛,奇兵,大脑训练,大白鲨,大战,大师,复仇者联盟2,地牢猎手5,地产大亨,圈圈,围棋单机,四驱车,吸血鬼,吕布传,史上,古代换装游戏,口袋妖怪红宝石,即时战略,博雅四川麻将,单机角色扮演游戏,单机塔防游戏,割绳子2,冰淇淋,冰封王座,农场物语,养猪,养成计划,共和国之辉,全民水浒,儿童益智,偶像,做菜游戏,仙剑诀,二战游戏,二十一点,二七十,乙女游戏,乒乓,乐高蝙蝠侠,两人游戏,一个都不能死,wodeshijie,three,tennis,solitaire,snake,qq餐厅,qq升级,plank,ninja,horizon,hit,football,fish,emily,dream,dota传奇,blendoku,baseball,arpg,24,1945,13张,first class flurry hd,双子兄弟,妹妹影院,spaceflight,fox hime zero,最强连连看,流星剑梦,宝宝汽车城市,rhythm cat hd,单挑荒野,烹饪厨师,ar鬼和枪,重生！蛮荒行星,模拟左轮,food truck pup: 烹饪厨师,二次元联盟•格斗,培根配万物,王者裁决：神兵,开荒纪元手游,疯狂的车轮比赛,植物大战僵尸,泰拉石契约,赤月•盛世霸业,王牌大作战！,土耳其方块,bacon – the game,寂灭深渊,香蜜沉沉烬如霜游戏,边锋浙江游戏,天剑神诀,火柴人蜘蛛,恐怖奶奶,炸个小花金,Galaga AR,真实模拟枪械,貂蝉三国,功夫圣手,腾讯广东麻雀,战塔,西游状元坊,armedheist,欧呜欧,魔芋手游,暴破少女:哥哥不要嘛,穿越火线,正当防卫4,金豪斗牛,保护我,海贼无双,派对,桥牌,日系,无双,放置类,恶魔城,养猪场,你好英雄,九阴,东京食尸鬼,room,red dead,rdr,fireballs 3D,昭和杂货店3,jiang尸感染,frlegends,哥哥不要嘛,我要翘班,imeiju,枪战吃鸡,恩腿子麻将,tank stars,骰子猎人,中油游戏,冠军网球,三国志2018,十二战纪,传奇召唤师,现代战争:尖峰对决,点杀泰坦 2,俄罗斯方块 -- 经典怀旧,巧虎成长之旅,oil hunt 2,升官游戏,崇阳麻将,封神召唤师,滚动的天空3,三国英雄杀,滚动的天空无限球,恐龙世界2,葫芦娃手游,罗斯方块,全民福州麻将,放置传奇,回合制卡牌,机动战队,劲舞团手游,happy wheels,广西麻将,筛子摇一摇,水果切切乐,摸金校尉,率土,真实女友,末日求生,烧脑,merge,猪猪侠跑酷,丧尸游戏,qq游戏欢乐斗地主,速度与激情8,驾驶游戏,饥饿,连线,躲猫猫,脱衣服游戏,篮球经理,真实武器,火线指令,波克,桥梁,无人机,找茬游戏,恶作剧,怪兽,小孩游戏,国王保卫战,倚天屠龙记,三国争霸,rush,marvel,fps,开局一只鲲,仙剑情缘2,迷城特工,日式二次元,超级粘液,地下城与勇士手游版,黑洞大作战免费,一刀烈火,阿瑞斯,大头三国,叫我小县令,先发制人,开心消消乐 2018,斗牛娱乐,漫威: 超级争霸战,金花棋牌,英雄必须吼,斗牛欢乐版,小玛丽捕鱼,捕鱼欢乐颂,都市游戏,武汉麻将红中赖子杠,三国志吕布传,史上最囧游戏,dead trigger 2,many bricks breaker,小冰冰,cat hotel,贪婪,早教益智,乐高侏罗纪世界,猎鱼达人,成语猜猜看,天天捕鱼,天龙,看门狗,废土,奇怪的大冒险,鳄鱼洗澡2,后宫养成,福建麻将,盗墓笔记游戏,大冒险游戏,十三道,连一连,老奶奶,练车,神秘逃亡,灌蛋,湖南跑得快,消消消,海战,死亡扳机,极品,挖土机游戏,影子,幻想,小狗,密室逃脱中文,多人游戏,填字游戏,横扫千军 |
| [Aerthas/UNITY-Arc-system-Works-Shader](https://github.com/Aerthas/UNITY-Arc-system-Works-Shader) | ⭐ 427 | GLSL | Shader created to emulate the design style of Arc System Works games such as Guilty Gear and Dragon Ball FighterZ. Created using Amplify Shader Editor. |
| [debezium/debezium-ui](https://github.com/debezium/debezium-ui) | ⭐ 352 | TypeScript | ARCHIVED: A web UI for Debezium; Please log issues at https://issues.redhat.com/browse/DBZ. |
| [debezium/container-images](https://github.com/debezium/container-images) | ⭐ 341 | Shell | Docker images for Debezium. Please log issues at https://github.com/debezium/dbz/issues. |
| [debezium/debezium-server](https://github.com/debezium/debezium-server) | ⭐ 135 | Java | Debezium Server runtime for standalone execution of Debezium connectors. Please log issues at https://github.com/debezium/dbz/issues. |
| [WistfulHopes/DBZ1](https://github.com/WistfulHopes/DBZ1) | ⭐ 102 | C++ | Dragon Ball Z Budokai HD Recompiled |
| [openanolis/dragonball-sandbox](https://github.com/openanolis/dragonball-sandbox) | ⭐ 95 | Rust | Dragonball-sandbox is a collection of Rust crates to help build custom Virtual Machine Monitors and hypervisors. |
| [debezium/debezium-operator](https://github.com/debezium/debezium-operator) | ⭐ 82 | Java | Kubernetes/OpenShift operator for Debezium Server. Please log issues at https://github.com/debezium/dbz/issues. |
| [debezium/debezium-connector-vitess](https://github.com/debezium/debezium-connector-vitess) | ⭐ 59 | Java | An incubating Debezium CDC connector for Vitess. Please log issues at https://github.com/debezium/dbz/issues. |
| [DarioSamo/LibXenoverse](https://github.com/DarioSamo/LibXenoverse) | ⭐ 59 | C++ | Dragon Ball Xenoverse Modding Tools |
| [dbzero-software/dbzero](https://github.com/dbzero-software/dbzero) | ⭐ 55 | C++ | DISTIC (Durable, Infinite, Shared, Transactional, Isolated, Composable) storage system for Python 3.x offering flexibility of a memory with durability of a database. |
| [25011966V/iptv](https://github.com/25011966V/iptv) | ⭐ 52 | N/A | #EXTM3U #EXTINF:-1 tvg-logo="" group-title="Canais \| BBB",Big Brother Brasil [CAM001] HD http://psrv.io:80/9089247/coreurl.me/27861 #EXTINF:-1 tvg-logo="http://z4.vc/1CP" group-title="Canais \| Variedades",A&E FHD http://psrv.io:80/9089247/coreurl.me/18858 #EXTINF:-1 tvg-logo="http://z4.vc/uuz" group-title="Canais \| Variedades",A&E FHD [H265] http://psrv.io:80/9089247/coreurl.me/22213 #EXTINF:-1 tvg-logo="http://z4.vc/SDH" group-title="Canais \| Variedades",A&E HD http://psrv.io:80/9089247/coreurl.me/18738 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",Al Jazeera http://psrv.io:80/9089247/coreurl.me/28158 #EXTINF:-1 tvg-logo="http://z4.vc/PFh" group-title="Canais \| Filmes e Séries",AMC FHD http://psrv.io:80/9089247/coreurl.me/18857 #EXTINF:-1 tvg-logo="http://z4.vc/GcF" group-title="Canais \| Filmes e Séries",AMC FHD [H265] http://psrv.io:80/9089247/coreurl.me/22212 #EXTINF:-1 tvg-logo="http://z4.vc/5Gw" group-title="Canais \| Filmes e Séries",AMC HD http://psrv.io:80/9089247/coreurl.me/18736 #EXTINF:-1 tvg-logo="http://z4.vc/slU" group-title="Canais \| Documentários",Animal Planet FHD http://psrv.io:80/9089247/coreurl.me/18856 #EXTINF:-1 tvg-logo="http://z4.vc/aPp" group-title="Canais \| Documentários",Animal Planet FHD [H265] http://psrv.io:80/9089247/coreurl.me/22211 #EXTINF:-1 tvg-logo="http://z4.vc/BZz" group-title="Canais \| Documentários",Animal Planet HD http://psrv.io:80/9089247/coreurl.me/18734 #EXTINF:-1 tvg-logo="http://z4.vc/fjU" group-title="Canais \| Documentários",Animal Planet SD http://psrv.io:80/9089247/coreurl.me/18735 #EXTINF:-1 tvg-logo="http://z4.vc/s04" group-title="Canais \| 4K",ANIMAL PLANET [4K] http://psrv.io:80/9089247/coreurl.me/26189 #EXTINF:-1 tvg-logo="http://z4.vc/I6b" group-title="Canais \| Documentários",Arte 1 FHD http://psrv.io:80/9089247/coreurl.me/18855 #EXTINF:-1 tvg-logo="http://z4.vc/2KF" group-title="Canais \| Documentários",Arte 1 FHD [H265] http://psrv.io:80/9089247/coreurl.me/25196 #EXTINF:-1 tvg-logo="http://z4.vc/Vfq" group-title="Canais \| Documentários",Arte 1 HD http://psrv.io:80/9089247/coreurl.me/27884 #EXTINF:-1 tvg-logo="http://z4.vc/8td" group-title="Canais \| Documentários",Arte 1 SD http://psrv.io:80/9089247/coreurl.me/18733 #EXTINF:-1 tvg-logo="http://z4.vc/rpV" group-title="Canais \| Filmes e Séries",AXN FHD http://psrv.io:80/9089247/coreurl.me/18854 #EXTINF:-1 tvg-logo="http://z4.vc/ItW" group-title="Canais \| Filmes e Séries",AXN FHD [H265] http://psrv.io:80/9089247/coreurl.me/22210 #EXTINF:-1 tvg-logo="http://z4.vc/j1K" group-title="Canais \| Filmes e Séries",AXN HD http://psrv.io:80/9089247/coreurl.me/18730 #EXTINF:-1 tvg-logo="http://z4.vc/ItW" group-title="Canais \| Legendados",AXN HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28339 #EXTINF:-1 tvg-logo="http://z4.vc/qfK" group-title="Canais \| Filmes e Séries",AXN SD http://psrv.io:80/9089247/coreurl.me/18731 #EXTINF:-1 tvg-logo="http://z4.vc/ItW" group-title="Canais \| Legendados",AXN SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28340 #EXTINF:-1 tvg-logo="http://z4.vc/k3q" group-title="Canais \| Infantis",BabyTV SD http://psrv.io:80/9089247/coreurl.me/18729 #EXTINF:-1 tvg-logo="http://z4.vc/68l" group-title="Canais \| Abertos",Band Bahia SD http://psrv.io:80/9089247/coreurl.me/28060 #EXTINF:-1 tvg-logo="http://z4.vc/SV1" group-title="Canais \| Abertos",Band SD http://psrv.io:80/9089247/coreurl.me/22242 #EXTINF:-1 tvg-logo="http://z4.vc/68l" group-title="Canais \| Abertos",Band Sergipe HD http://psrv.io:80/9089247/coreurl.me/22476 #EXTINF:-1 tvg-logo="http://z4.vc/iGF" group-title="Canais \| Abertos",Band SP FHD http://psrv.io:80/9089247/coreurl.me/18786 #EXTINF:-1 tvg-logo="http://z4.vc/wHL" group-title="Canais \| Abertos",Band SP FHD [H265] http://psrv.io:80/9089247/coreurl.me/25249 #EXTINF:-1 tvg-logo="http://z4.vc/X0u" group-title="Canais \| Abertos",Band SP HD http://psrv.io:80/9089247/coreurl.me/18727 #EXTINF:-1 tvg-logo="http://z4.vc/xaf" group-title="Canais \| Abertos",Band SP SD http://psrv.io:80/9089247/coreurl.me/18728 #EXTINF:-1 tvg-logo="http://z4.vc/ocG" group-title="Canais \| 4K",BAND [4K] http://psrv.io:80/9089247/coreurl.me/26179 #EXTINF:-1 tvg-logo="http://z4.vc/jeQ" group-title="Canais \| Notícias",BandNews FHD http://psrv.io:80/9089247/coreurl.me/18853 #EXTINF:-1 tvg-logo="http://z4.vc/vx0" group-title="Canais \| Notícias",BandNews FHD [H265] http://psrv.io:80/9089247/coreurl.me/22152 #EXTINF:-1 tvg-logo="http://z4.vc/COC" group-title="Canais \| Notícias",BandNews HD http://psrv.io:80/9089247/coreurl.me/18725 #EXTINF:-1 tvg-logo="http://z4.vc/mps" group-title="Canais \| Notícias",BandNews SD http://psrv.io:80/9089247/coreurl.me/18726 #EXTINF:-1 tvg-logo="http://z4.vc/7yf" group-title="Canais \| Esportes",BandSports FHD http://psrv.io:80/9089247/coreurl.me/18852 #EXTINF:-1 tvg-logo="http://z4.vc/mPu" group-title="Canais \| Esportes",BandSports FHD [H265] http://psrv.io:80/9089247/coreurl.me/22151 #EXTINF:-1 tvg-logo="http://z4.vc/0ev" group-title="Canais \| Esportes",BandSports HD http://psrv.io:80/9089247/coreurl.me/18723 #EXTINF:-1 tvg-logo="http://z4.vc/ral" group-title="Canais \| Esportes",BandSports SD http://psrv.io:80/9089247/coreurl.me/18724 #EXTINF:-1 tvg-logo="http://z4.vc/UIf" group-title="Canais \| Variedades",Bis FHD http://psrv.io:80/9089247/coreurl.me/18785 #EXTINF:-1 tvg-logo="http://z4.vc/XaE" group-title="Canais \| Variedades",Bis FHD [H265] http://psrv.io:80/9089247/coreurl.me/22150 #EXTINF:-1 tvg-logo="http://z4.vc/PAl" group-title="Canais \| Variedades",Bis HD http://psrv.io:80/9089247/coreurl.me/18721 #EXTINF:-1 tvg-logo="http://z4.vc/ybv" group-title="Canais \| Variedades",Bis SD http://psrv.io:80/9089247/coreurl.me/18722 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",Bloomberg Television http://psrv.io:80/9089247/coreurl.me/28159 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",Boing Kids [ESP] http://psrv.io:80/9089247/coreurl.me/28166 #EXTINF:-1 tvg-logo="http://z4.vc/6f2" group-title="Canais \| Infantis",Boomerang FHD http://psrv.io:80/9089247/coreurl.me/18851 #EXTINF:-1 tvg-logo="http://z4.vc/DAg" group-title="Canais \| Infantis",Boomerang FHD [H265] http://psrv.io:80/9089247/coreurl.me/25317 #EXTINF:-1 tvg-logo="http://z4.vc/BLS" group-title="Canais \| Infantis",Boomerang HD http://psrv.io:80/9089247/coreurl.me/18718 #EXTINF:-1 tvg-logo="http://z4.vc/H1Y" group-title="Canais \| Infantis",Boomerang SD http://psrv.io:80/9089247/coreurl.me/18719 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",CANAL 26 ARGENTINA HD http://psrv.io:80/9089247/coreurl.me/26427 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",CANAL 33 http://psrv.io:80/9089247/coreurl.me/28050 #EXTINF:-1 tvg-logo="http://z4.vc/UqA" group-title="Canais \| Filmes e Séries",Canal Brasil FHD http://psrv.io:80/9089247/coreurl.me/18753 #EXTINF:-1 tvg-logo="http://z4.vc/bUk" group-title="Canais \| Filmes e Séries",Canal Brasil FHD [H265] http://psrv.io:80/9089247/coreurl.me/25316 #EXTINF:-1 tvg-logo="http://z4.vc/GsJ" group-title="Canais \| Filmes e Séries",Canal Brasil HD http://psrv.io:80/9089247/coreurl.me/18716 #EXTINF:-1 tvg-logo="http://z4.vc/kWm" group-title="Canais \| Filmes e Séries",Canal Brasil SD http://psrv.io:80/9089247/coreurl.me/18717 #EXTINF:-1 tvg-logo="http://z4.vc/0Tm" group-title="Canais \| Abertos",Cancao Nova SD http://psrv.io:80/9089247/coreurl.me/18713 #EXTINF:-1 tvg-logo="http://z4.vc/gGw" group-title="Canais \| Infantis",Cartoon Network FHD http://psrv.io:80/9089247/coreurl.me/18849 #EXTINF:-1 tvg-logo="http://z4.vc/6WN" group-title="Canais \| Infantis",Cartoon Network FHD [H265] http://psrv.io:80/9089247/coreurl.me/25314 #EXTINF:-1 tvg-logo="http://z4.vc/Brc" group-title="Canais \| Infantis",Cartoon Network HD http://psrv.io:80/9089247/coreurl.me/18711 #EXTINF:-1 tvg-logo="http://z4.vc/BjV" group-title="Canais \| Infantis",Cartoon Network SD http://psrv.io:80/9089247/coreurl.me/18712 #EXTINF:-1 tvg-logo="http://z4.vc/Mqt" group-title="Canais \| 4K",CARTOON NETWORK [4K] http://psrv.io:80/9089247/coreurl.me/26408 #EXTINF:-1 tvg-logo="http://z4.vc/IbR" group-title="Canais \| Filmes e Séries",Cinemax FHD http://psrv.io:80/9089247/coreurl.me/18848 #EXTINF:-1 tvg-logo="http://z4.vc/i31" group-title="Canais \| Filmes e Séries",Cinemax FHD [H265] http://psrv.io:80/9089247/coreurl.me/25313 #EXTINF:-1 tvg-logo="http://z4.vc/Lo1" group-title="Canais \| Filmes e Séries",Cinemax HD http://psrv.io:80/9089247/coreurl.me/18709 #EXTINF:-1 tvg-logo="http://z4.vc/ZLC" group-title="Canais \| Filmes e Séries",Cinemax SD http://psrv.io:80/9089247/coreurl.me/18710 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",CNN INTERNACIONAL HD http://psrv.io:80/9089247/coreurl.me/28054 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",CNN INTERNACIONAL SD http://psrv.io:80/9089247/coreurl.me/26438 #EXTINF:-1 tvg-logo="http://z4.vc/2Bh" group-title="Canais \| Esportes",Combate FHD http://psrv.io:80/9089247/coreurl.me/18784 #EXTINF:-1 tvg-logo="http://z4.vc/na3" group-title="Canais \| Esportes",Combate FHD [H265] http://psrv.io:80/9089247/coreurl.me/25312 #EXTINF:-1 tvg-logo="http://z4.vc/ids" group-title="Canais \| Esportes",Combate HD http://psrv.io:80/9089247/coreurl.me/18707 #EXTINF:-1 tvg-logo="http://z4.vc/jLd" group-title="Canais \| Esportes",Combate SD http://psrv.io:80/9089247/coreurl.me/18708 #EXTINF:-1 tvg-logo="http://z4.vc/E0D" group-title="Canais \| 4K",COMBATE [4K] http://psrv.io:80/9089247/coreurl.me/26180 #EXTINF:-1 tvg-logo="http://z4.vc/NWe" group-title="Canais \| Variedades",Comedy Central FHD http://psrv.io:80/9089247/coreurl.me/18847 #EXTINF:-1 tvg-logo="http://z4.vc/0Ww" group-title="Canais \| Variedades",Comedy Central FHD [H265] http://psrv.io:80/9089247/coreurl.me/25311 #EXTINF:-1 tvg-logo="http://z4.vc/qUw" group-title="Canais \| Variedades",Comedy Central HD http://psrv.io:80/9089247/coreurl.me/18705 #EXTINF:-1 tvg-logo="http://z4.vc/RrZ" group-title="Canais \| Variedades",Comedy Central SD http://psrv.io:80/9089247/coreurl.me/18706 #EXTINF:-1 tvg-logo="" group-title="Canais \| Jogos & Eventos",Copa Libertadores HD http://psrv.io:80/9089247/coreurl.me/28386 #EXTINF:-1 tvg-logo="" group-title="Canais \| Jogos & Eventos",Copa Nordeste 1 HD http://psrv.io:80/9089247/coreurl.me/28377 #EXTINF:-1 tvg-logo="" group-title="Canais \| Jogos & Eventos",Copa Nordeste 2 HD http://psrv.io:80/9089247/coreurl.me/28378 #EXTINF:-1 tvg-logo="" group-title="Canais \| Jogos & Eventos",Copa Nordeste 3 HD http://psrv.io:80/9089247/coreurl.me/28379 #EXTINF:-1 tvg-logo="http://z4.vc/PYh" group-title="Canais \| Variedades",Curta! FHD http://psrv.io:80/9089247/coreurl.me/18846 #EXTINF:-1 tvg-logo="http://z4.vc/r7r" group-title="Canais \| Variedades",Curta! FHD [H265] http://psrv.io:80/9089247/coreurl.me/25310 #EXTINF:-1 tvg-logo="http://z4.vc/GnA" group-title="Canais \| Variedades",Curta! HD http://psrv.io:80/9089247/coreurl.me/18703 #EXTINF:-1 tvg-logo="http://z4.vc/fVn" group-title="Canais \| Variedades",Curta! SD http://psrv.io:80/9089247/coreurl.me/18704 #EXTINF:-1 tvg-logo="http://z4.vc/162" group-title="Canais \| Jogos & Eventos",DAZN  CHANNEL 1 http://psrv.io:80/9089247/coreurl.me/26195 #EXTINF:-1 tvg-logo="http://z4.vc/Pjc" group-title="Canais \| Jogos & Eventos",DAZN CHANNEL 2 http://psrv.io:80/9089247/coreurl.me/26197 #EXTINF:-1 tvg-logo="http://z4.vc/Wp3" group-title="Canais \| Jogos & Eventos",DAZN CHANNEL 3 http://psrv.io:80/9089247/coreurl.me/26196 #EXTINF:-1 tvg-logo="http://z4.vc/162" group-title="Canais \| Jogos & Eventos",DAZN CHANNEL 4 http://psrv.io:80/9089247/coreurl.me/28387 #EXTINF:-1 tvg-logo="http://z4.vc/162" group-title="Canais \| Jogos & Eventos",DAZN CHANNEL 5 http://psrv.io:80/9089247/coreurl.me/28388 #EXTINF:-1 tvg-logo="http://z4.vc/162" group-title="Canais \| Jogos & Eventos",DAZN CHANNEL 6 http://psrv.io:80/9089247/coreurl.me/28389 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",DIGI 24 HD http://psrv.io:80/9089247/coreurl.me/28042 #EXTINF:-1 tvg-logo="http://z4.vc/Y5D" group-title="Canais \| Documentários",Discovery Channel FHD http://psrv.io:80/9089247/coreurl.me/18783 #EXTINF:-1 tvg-logo="http://z4.vc/0v1" group-title="Canais \| Documentários",Discovery Channel FHD [H265] http://psrv.io:80/9089247/coreurl.me/22204 #EXTINF:-1 tvg-logo="http://z4.vc/W6B" group-title="Canais \| Documentários",Discovery Channel HD http://psrv.io:80/9089247/coreurl.me/18701 #EXTINF:-1 tvg-logo="http://z4.vc/4mU" group-title="Canais \| Documentários",Discovery Channel SD http://psrv.io:80/9089247/coreurl.me/18702 #EXTINF:-1 tvg-logo="http://z4.vc/o8B" group-title="Canais \| 4K",DISCOVERY CHANNEL [4K] http://psrv.io:80/9089247/coreurl.me/26185 #EXTINF:-1 tvg-logo="http://z4.vc/cEF" group-title="Canais \| Variedades",Discovery H&H FHD http://psrv.io:80/9089247/coreurl.me/18844 #EXTINF:-1 tvg-logo="http://z4.vc/y3l" group-title="Canais \| Variedades",Discovery H&H FHD [H265] http://psrv.io:80/9089247/coreurl.me/22148 #EXTINF:-1 tvg-logo="http://z4.vc/nXL" group-title="Canais \| Variedades",Discovery H&H HD http://psrv.io:80/9089247/coreurl.me/18697 #EXTINF:-1 tvg-logo="http://z4.vc/91r" group-title="Canais \| Variedades",Discovery H&H SD http://psrv.io:80/9089247/coreurl.me/18698 #EXTINF:-1 tvg-logo="http://z4.vc/oNt" group-title="Canais \| Infantis",Discovery Kids FHD http://psrv.io:80/9089247/coreurl.me/18843 #EXTINF:-1 tvg-logo="http://z4.vc/Eoe" group-title="Canais \| Infantis",Discovery Kids FHD [H265] http://psrv.io:80/9089247/coreurl.me/22202 #EXTINF:-1 tvg-logo="http://z4.vc/p3E" group-title="Canais \| Infantis",Discovery Kids HD http://psrv.io:80/9089247/coreurl.me/18695 #EXTINF:-1 tvg-logo="http://z4.vc/s9P" group-title="Canais \| Infantis",Discovery Kids SD http://psrv.io:80/9089247/coreurl.me/18696 #EXTINF:-1 tvg-logo="http://z4.vc/N8Y" group-title="Canais \| Infantis",Discovery Kids SD http://psrv.io:80/9089247/coreurl.me/22325 #EXTINF:-1 tvg-logo="http://z4.vc/bfd" group-title="Canais \| Documentários",Discovery Science FHD http://psrv.io:80/9089247/coreurl.me/18842 #EXTINF:-1 tvg-logo="http://z4.vc/KAc" group-title="Canais \| Documentários",Discovery Science FHD [H265] http://psrv.io:80/9089247/coreurl.me/22201 #EXTINF:-1 tvg-logo="http://z4.vc/rQr" group-title="Canais \| Documentários",Discovery Science HD http://psrv.io:80/9089247/coreurl.me/18693 #EXTINF:-1 tvg-logo="http://z4.vc/fV1" group-title="Canais \| Documentários",Discovery Science SD http://psrv.io:80/9089247/coreurl.me/18694 #EXTINF:-1 tvg-logo="http://z4.vc/m7Y" group-title="Canais \| Documentários",Discovery Theater FHD http://psrv.io:80/9089247/coreurl.me/18841 #EXTINF:-1 tvg-logo="http://z4.vc/9eJ" group-title="Canais \| Documentários",Discovery Theater FHD [H265] http://psrv.io:80/9089247/coreurl.me/22200 #EXTINF:-1 tvg-logo="http://z4.vc/FSs" group-title="Canais \| Documentários",Discovery Theater HD http://psrv.io:80/9089247/coreurl.me/18691 #EXTINF:-1 tvg-logo="http://z4.vc/9oW" group-title="Canais \| Documentários",Discovery Theater SD http://psrv.io:80/9089247/coreurl.me/18692 #EXTINF:-1 tvg-logo="http://z4.vc/oAo" group-title="Canais \| Variedades",Discovery Turbo FHD http://psrv.io:80/9089247/coreurl.me/18840 #EXTINF:-1 tvg-logo="http://z4.vc/1cS" group-title="Canais \| Variedades",Discovery Turbo FHD [H265] http://psrv.io:80/9089247/coreurl.me/22131 #EXTINF:-1 tvg-logo="http://z4.vc/AsO" group-title="Canais \| Variedades",Discovery Turbo HD http://psrv.io:80/9089247/coreurl.me/18689 #EXTINF:-1 tvg-logo="http://z4.vc/Vy0" group-title="Canais \| Variedades",Discovery Turbo SD http://psrv.io:80/9089247/coreurl.me/18690 #EXTINF:-1 tvg-logo="http://z4.vc/x0i" group-title="Canais \| Documentários",Discovery World FHD http://psrv.io:80/9089247/coreurl.me/18839 #EXTINF:-1 tvg-logo="http://z4.vc/4Yx" group-title="Canais \| Documentários",Discovery World FHD [H265] http://psrv.io:80/9089247/coreurl.me/22130 #EXTINF:-1 tvg-logo="http://z4.vc/SxE" group-title="Canais \| Documentários",Discovery World HD http://psrv.io:80/9089247/coreurl.me/18687 #EXTINF:-1 tvg-logo="http://z4.vc/x5l" group-title="Canais \| Documentários",Discovery World SD http://psrv.io:80/9089247/coreurl.me/18688 #EXTINF:-1 tvg-logo="http://z4.vc/eri" group-title="Canais \| Infantis",Disney FHD http://psrv.io:80/9089247/coreurl.me/18782 #EXTINF:-1 tvg-logo="http://z4.vc/k3R" group-title="Canais \| Infantis",Disney FHD [H265] http://psrv.io:80/9089247/coreurl.me/22147 #EXTINF:-1 tvg-logo="http://z4.vc/COA" group-title="Canais \| Infantis",Disney HD http://psrv.io:80/9089247/coreurl.me/18685 #EXTINF:-1 tvg-logo="http://z4.vc/Cgg" group-title="Canais \| Infantis",Disney Junior FHD http://psrv.io:80/9089247/coreurl.me/18788 #EXTINF:-1 tvg-logo="http://z4.vc/pw6" group-title="Canais \| Infantis",Disney Junior FHD [H265] http://psrv.io:80/9089247/coreurl.me/22146 #EXTINF:-1 tvg-logo="http://z4.vc/67y" group-title="Canais \| Infantis",Disney Junior HD http://psrv.io:80/9089247/coreurl.me/18509 #EXTINF:-1 tvg-logo="http://z4.vc/3Vd" group-title="Canais \| Infantis",Disney Junior SD http://psrv.io:80/9089247/coreurl.me/18684 #EXTINF:-1 tvg-logo="http://z4.vc/Vjj" group-title="Canais \| Infantis",Disney SD http://psrv.io:80/9089247/coreurl.me/18686 #EXTINF:-1 tvg-logo="http://z4.vc/6MT" group-title="Canais \| Infantis",Disney SD http://psrv.io:80/9089247/coreurl.me/22323 #EXTINF:-1 tvg-logo="http://z4.vc/H7Y" group-title="Canais \| Infantis",Disney XD FHD [H265] http://psrv.io:80/9089247/coreurl.me/25211 #EXTINF:-1 tvg-logo="http://z4.vc/n2T" group-title="Canais \| Infantis",Disney XD SD http://psrv.io:80/9089247/coreurl.me/22321 #EXTINF:-1 tvg-logo="http://z4.vc/L5h" group-title="Canais \| Variedades",Dog TV FHD http://psrv.io:80/9089247/coreurl.me/28001 #EXTINF:-1 tvg-logo="http://z4.vc/6nk" group-title="Canais \| Variedades",Dog TV HD http://psrv.io:80/9089247/coreurl.me/28000 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",DW ALEMANHA HD http://psrv.io:80/9089247/coreurl.me/26429 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",E FHD http://psrv.io:80/9089247/coreurl.me/28399 #EXTINF:-1 tvg-logo="http://z4.vc/7nN" group-title="Canais \| Variedades",E! FHD http://psrv.io:80/9089247/coreurl.me/18838 #EXTINF:-1 tvg-logo="http://z4.vc/HbJ" group-title="Canais \| Variedades",E! FHD [H265] http://psrv.io:80/9089247/coreurl.me/22145 #EXTINF:-1 tvg-logo="http://z4.vc/PCy" group-title="Canais \| Variedades",E! HD http://psrv.io:80/9089247/coreurl.me/18681 #EXTINF:-1 tvg-logo="http://z4.vc/Z05" group-title="Canais \| Variedades",E! SD http://psrv.io:80/9089247/coreurl.me/18682 #EXTINF:-1 tvg-logo="" group-title="Canais \| Jogos & Eventos",Ei Plus 01 [Champions League] http://psrv.io:80/9089247/coreurl.me/28380 #EXTINF:-1 tvg-logo="" group-title="Canais \| Jogos & Eventos",Ei Plus 02 [Champions League] http://psrv.io:80/9089247/coreurl.me/28381 #EXTINF:-1 tvg-logo="" group-title="Canais \| Jogos & Eventos",Ei Plus 03 [Champions League] http://psrv.io:80/9089247/coreurl.me/28382 #EXTINF:-1 tvg-logo="" group-title="Canais \| Jogos & Eventos",Ei Plus 04 [Champions League] http://psrv.io:80/9089247/coreurl.me/28383 #EXTINF:-1 tvg-logo="" group-title="Canais \| Jogos & Eventos",Ei Plus 05 [Champions League] http://psrv.io:80/9089247/coreurl.me/28384 #EXTINF:-1 tvg-logo="" group-title="Canais \| Jogos & Eventos",Ei Plus 06 [Champions League] http://psrv.io:80/9089247/coreurl.me/28385 #EXTINF:-1 tvg-logo="" group-title="Canais \| Esportes",EI Plus 1 HD http://psrv.io:80/9089247/coreurl.me/22978 #EXTINF:-1 tvg-logo="" group-title="Canais \| Esportes",EI Plus 1 SD http://psrv.io:80/9089247/coreurl.me/26194 #EXTINF:-1 tvg-logo="http://z4.vc/Lkj" group-title="Canais \| Esportes",ESPN 2 FHD http://psrv.io:80/9089247/coreurl.me/18837 #EXTINF:-1 tvg-logo="http://z4.vc/oUp" group-title="Canais \| Esportes",ESPN 2 FHD [H265] http://psrv.io:80/9089247/coreurl.me/25309 #EXTINF:-1 tvg-logo="http://z4.vc/krr" group-title="Canais \| Esportes",ESPN 2 HD http://psrv.io:80/9089247/coreurl.me/18678 #EXTINF:-1 tvg-logo="http://z4.vc/J6U" group-title="Canais \| Esportes",ESPN 2 SD http://psrv.io:80/9089247/coreurl.me/18679 #EXTINF:-1 tvg-logo="http://z4.vc/a01" group-title="Canais \| Esportes",ESPN Brasil FHD http://psrv.io:80/9089247/coreurl.me/18781 #EXTINF:-1 tvg-logo="http://z4.vc/2zo" group-title="Canais \| Esportes",ESPN Brasil FHD [H265] http://psrv.io:80/9089247/coreurl.me/25238 #EXTINF:-1 tvg-logo="http://z4.vc/hvU" group-title="Canais \| Esportes",ESPN Brasil HD http://psrv.io:80/9089247/coreurl.me/18676 #EXTINF:-1 tvg-logo="http://z4.vc/S1E" group-title="Canais \| Esportes",ESPN Brasil SD http://psrv.io:80/9089247/coreurl.me/18677 #EXTINF:-1 tvg-logo="http://z4.vc/TAv" group-title="Canais \| Esportes",ESPN Extra FHD http://psrv.io:80/9089247/coreurl.me/18836 #EXTINF:-1 tvg-logo="http://z4.vc/2Db" group-title="Canais \| Esportes",ESPN Extra FHD [H265] http://psrv.io:80/9089247/coreurl.me/25308 #EXTINF:-1 tvg-logo="http://z4.vc/1xn" group-title="Canais \| Esportes",ESPN Extra HD http://psrv.io:80/9089247/coreurl.me/18674 #EXTINF:-1 tvg-logo="http://z4.vc/dzo" group-title="Canais \| Esportes",ESPN Extra SD http://psrv.io:80/9089247/coreurl.me/18675 #EXTINF:-1 tvg-logo="http://z4.vc/d9B" group-title="Canais \| Esportes",ESPN FHD http://psrv.io:80/9089247/coreurl.me/18780 #EXTINF:-1 tvg-logo="http://z4.vc/GbD" group-title="Canais \| Esportes",ESPN FHD [H265] http://psrv.io:80/9089247/coreurl.me/25237 #EXTINF:-1 tvg-logo="http://z4.vc/gWv" group-title="Canais \| Esportes",ESPN HD http://psrv.io:80/9089247/coreurl.me/18673 #EXTINF:-1 tvg-logo="http://z4.vc/yGS" group-title="Canais \| Esportes",ESPN SD http://psrv.io:80/9089247/coreurl.me/18680 #EXTINF:-1 tvg-logo="http://z4.vc/IIo" group-title="Canais \| 4K",ESPN [4K] http://psrv.io:80/9089247/coreurl.me/27130 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",Euro Channel FHD http://psrv.io:80/9089247/coreurl.me/28400 #EXTINF:-1 tvg-logo="" group-title="Canais \| Variedades",FASHION TV [H265] http://psrv.io:80/9089247/coreurl.me/25236 #EXTINF:-1 tvg-logo="http://z4.vc/T5S" group-title="Canais \| Variedades",Film & Arts SD http://psrv.io:80/9089247/coreurl.me/18497 #EXTINF:-1 tvg-logo="http://z4.vc/7MZ" group-title="Canais \| Variedades",Fish TV FHD http://psrv.io:80/9089247/coreurl.me/18835 #EXTINF:-1 tvg-logo="http://z4.vc/ILy" group-title="Canais \| Variedades",Fish TV FHD [H265] http://psrv.io:80/9089247/coreurl.me/22199 #EXTINF:-1 tvg-logo="http://z4.vc/VxE" group-title="Canais \| Variedades",Fish TV HD http://psrv.io:80/9089247/coreurl.me/18671 #EXTINF:-1 tvg-logo="http://z4.vc/Rxi" group-title="Canais \| Variedades",Fish TV SD http://psrv.io:80/9089247/coreurl.me/18672 #EXTINF:-1 tvg-logo="http://z4.vc/Iv6" group-title="Canais \| Variedades",Food Network FHD http://psrv.io:80/9089247/coreurl.me/18834 #EXTINF:-1 tvg-logo="http://z4.vc/rgy" group-title="Canais \| Variedades",Food Network FHD [H265] http://psrv.io:80/9089247/coreurl.me/22198 #EXTINF:-1 tvg-logo="http://z4.vc/fYt" group-title="Canais \| Variedades",Food Network HD http://psrv.io:80/9089247/coreurl.me/18669 #EXTINF:-1 tvg-logo="http://z4.vc/2cT" group-title="Canais \| Variedades",Food Network SD http://psrv.io:80/9089247/coreurl.me/18670 #EXTINF:-1 tvg-logo="http://z4.vc/Gcu" group-title="Canais \| Filmes e Séries",Fox FHD http://psrv.io:80/9089247/coreurl.me/18779 #EXTINF:-1 tvg-logo="http://z4.vc/yeh" group-title="Canais \| Filmes e Séries",Fox FHD [H265] http://psrv.io:80/9089247/coreurl.me/22197 #EXTINF:-1 tvg-logo="http://z4.vc/DUZ" group-title="Canais \| Filmes e Séries",Fox HD http://psrv.io:80/9089247/coreurl.me/18667 #EXTINF:-1 tvg-logo="http://z4.vc/yeh" group-title="Canais \| Legendados",FOX HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28341 #EXTINF:-1 tvg-logo="http://z4.vc/EsS" group-title="Canais \| Variedades",Fox Life FHD http://psrv.io:80/9089247/coreurl.me/18833 #EXTINF:-1 tvg-logo="http://z4.vc/3nL" group-title="Canais \| Variedades",Fox Life FHD [H265] http://psrv.io:80/9089247/coreurl.me/25305 #EXTINF:-1 tvg-logo="http://z4.vc/9pz" group-title="Canais \| Variedades",Fox Life HD http://psrv.io:80/9089247/coreurl.me/18665 #EXTINF:-1 tvg-logo="http://z4.vc/E0q" group-title="Canais \| Variedades",Fox Life SD http://psrv.io:80/9089247/coreurl.me/18666 #EXTINF:-1 tvg-logo="http://z4.vc/efE" group-title="Canais \| Filmes e Séries",Fox Premium 1 FHD http://psrv.io:80/9089247/coreurl.me/18832 #EXTINF:-1 tvg-logo="http://z4.vc/C2g" group-title="Canais \| Filmes e Séries",Fox Premium 1 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22144 #EXTINF:-1 tvg-logo="http://z4.vc/AQ5" group-title="Canais \| Filmes e Séries",Fox Premium 1 HD http://psrv.io:80/9089247/coreurl.me/18663 #EXTINF:-1 tvg-logo="http://z4.vc/TCc" group-title="Canais \| Esportes",Fox Premium 1 SD http://psrv.io:80/9089247/coreurl.me/18664 #EXTINF:-1 tvg-logo="http://z4.vc/qoY" group-title="Canais \| Filmes e Séries",Fox Premium 2 FHD http://psrv.io:80/9089247/coreurl.me/18831 #EXTINF:-1 tvg-logo="http://z4.vc/O5F" group-title="Canais \| Filmes e Séries",Fox Premium 2 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22143 #EXTINF:-1 tvg-logo="http://z4.vc/g8Q" group-title="Canais \| Filmes e Séries",Fox Premium 2 HD http://psrv.io:80/9089247/coreurl.me/18661 #EXTINF:-1 tvg-logo="http://z4.vc/cw8" group-title="Canais \| Esportes",Fox Premium 2 SD http://psrv.io:80/9089247/coreurl.me/18662 #EXTINF:-1 tvg-logo="http://z4.vc/OcS" group-title="Canais \| Filmes e Séries",Fox SD http://psrv.io:80/9089247/coreurl.me/18668 #EXTINF:-1 tvg-logo="http://z4.vc/yeh" group-title="Canais \| Legendados",FOX SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28342 #EXTINF:-1 tvg-logo="http://z4.vc/dEu" group-title="Canais \| Esportes",Fox Sports 2 FHD http://psrv.io:80/9089247/coreurl.me/18778 #EXTINF:-1 tvg-logo="http://z4.vc/Qen" group-title="Canais \| Esportes",Fox Sports 2 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22196 #EXTINF:-1 tvg-logo="http://z4.vc/pne" group-title="Canais \| Esportes",Fox Sports 2 HD http://psrv.io:80/9089247/coreurl.me/18657 #EXTINF:-1 tvg-logo="http://z4.vc/Rei" group-title="Canais \| Esportes",Fox Sports 2 SD http://psrv.io:80/9089247/coreurl.me/18658 #EXTINF:-1 tvg-logo="http://z4.vc/Pgs" group-title="Canais \| 4K",FOX SPORTS 2 [4K] http://psrv.io:80/9089247/coreurl.me/26406 #EXTINF:-1 tvg-logo="http://z4.vc/H6m" group-title="Canais \| Esportes",Fox Sports FHD http://psrv.io:80/9089247/coreurl.me/18777 #EXTINF:-1 tvg-logo="" group-title="Canais \| Esportes",Fox Sports FHD [H265] http://psrv.io:80/9089247/coreurl.me/28074 #EXTINF:-1 tvg-logo="http://z4.vc/tG9" group-title="Canais \| Esportes",Fox Sports FHD [H265] http://psrv.io:80/9089247/coreurl.me/22195 #EXTINF:-1 tvg-logo="http://z4.vc/nWk" group-title="Canais \| Esportes",Fox Sports HD http://psrv.io:80/9089247/coreurl.me/18659 #EXTINF:-1 tvg-logo="http://z4.vc/LEj" group-title="Canais \| Esportes",Fox Sports SD http://psrv.io:80/9089247/coreurl.me/18660 #EXTINF:-1 tvg-logo="http://z4.vc/iWc" group-title="Canais \| 4K",FOX SPORTS [4K] http://psrv.io:80/9089247/coreurl.me/26187 #EXTINF:-1 tvg-logo="" group-title="Canais \| Abertos",Futura FHD http://psrv.io:80/9089247/coreurl.me/28198 #EXTINF:-1 tvg-logo="http://z4.vc/en6" group-title="Canais \| Abertos",Futura FHD [H265] http://psrv.io:80/9089247/coreurl.me/25302 #EXTINF:-1 tvg-logo="http://z4.vc/a9U" group-title="Canais \| Abertos",Futura HD http://psrv.io:80/9089247/coreurl.me/18655 #EXTINF:-1 tvg-logo="http://z4.vc/XaX" group-title="Canais \| Abertos",Futura SD http://psrv.io:80/9089247/coreurl.me/18656 #EXTINF:-1 tvg-logo="http://z4.vc/A4M" group-title="Canais \| Filmes e Séries",FX FHD http://psrv.io:80/9089247/coreurl.me/18829 #EXTINF:-1 tvg-logo="http://z4.vc/TBI" group-title="Canais \| Filmes e Séries",FX FHD [H265] http://psrv.io:80/9089247/coreurl.me/22194 #EXTINF:-1 tvg-logo="http://z4.vc/OsR" group-title="Canais \| Filmes e Séries",FX HD http://psrv.io:80/9089247/coreurl.me/18653 #EXTINF:-1 tvg-logo="http://z4.vc/OsR" group-title="Canais \| Legendados",FX HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28361 #EXTINF:-1 tvg-logo="http://z4.vc/OYf" group-title="Canais \| Filmes e Séries",FX SD http://psrv.io:80/9089247/coreurl.me/18654 #EXTINF:-1 tvg-logo="http://z4.vc/GEc" group-title="Canais \| Filmes e Séries",FX SD http://psrv.io:80/9089247/coreurl.me/22233 #EXTINF:-1 tvg-logo="http://z4.vc/OsR" group-title="Canais \| Legendados",FX SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28362 #EXTINF:-1 tvg-logo="http://z4.vc/aZb" group-title="Canais \| Globo",Globo Brasilia FHD http://psrv.io:80/9089247/coreurl.me/28390 #EXTINF:-1 tvg-logo="http://z4.vc/Vli" group-title="Canais \| Globo",Globo Brasilia HD http://psrv.io:80/9089247/coreurl.me/18434 #EXTINF:-1 tvg-logo="http://z4.vc/aZb" group-title="Canais \| Globo",Globo Brasilia SD http://psrv.io:80/9089247/coreurl.me/18435 #EXTINF:-1 tvg-logo="http://z4.vc/CsO" group-title="Canais \| Globo",Globo Campinas FHD [H265] http://psrv.io:80/9089247/coreurl.me/25210 #EXTINF:-1 tvg-logo="http://z4.vc/5XU" group-title="Canais \| Globo",Globo EPTV Araraquara SD http://psrv.io:80/9089247/coreurl.me/18433 #EXTINF:-1 tvg-logo="http://z4.vc/n8G" group-title="Canais \| Globo",Globo EPTV Campinas SD http://psrv.io:80/9089247/coreurl.me/18431 #EXTINF:-1 tvg-logo="http://z4.vc/pqb" group-title="Canais \| Globo",Globo EPTV Ribeirao Preto HD http://psrv.io:80/9089247/coreurl.me/18430 #EXTINF:-1 tvg-logo="http://z4.vc/5Uj" group-title="Canais \| Globo",Globo EPTV Ribeirao Preto SD http://psrv.io:80/9089247/coreurl.me/18429 #EXTINF:-1 tvg-logo="http://z4.vc/nrI" group-title="Canais \| Globo",Globo EPTV Sao Carlos SD http://psrv.io:80/9089247/coreurl.me/18428 #EXTINF:-1 tvg-logo="" group-title="Canais \| Jogos & Eventos",Globo Esporte HD http://psrv.io:80/9089247/coreurl.me/28376 #EXTINF:-1 tvg-logo="http://z4.vc/pzi" group-title="Canais \| Globo",GLOBO INTER TV ALTO LITORAL FHD http://psrv.io:80/9089247/coreurl.me/28079 #EXTINF:-1 tvg-logo="http://z4.vc/CCo" group-title="Canais \| Globo",Globo Inter TV Alto Litoral FHD http://psrv.io:80/9089247/coreurl.me/18358 #EXTINF:-1 tvg-logo="http://z4.vc/hmV" group-title="Canais \| Globo",Globo Inter TV Alto Litoral HD http://psrv.io:80/9089247/coreurl.me/18357 #EXTINF:-1 tvg-logo="http://z4.vc/t4S" group-title="Canais \| Globo",Globo Inter TV Alto Litoral SD http://psrv.io:80/9089247/coreurl.me/18356 #EXTINF:-1 tvg-logo="http://z4.vc/eQR" group-title="Canais \| Globo",Globo Inter TV dos Vales FHD http://psrv.io:80/9089247/coreurl.me/18355 #EXTINF:-1 tvg-logo="http://z4.vc/42v" group-title="Canais \| Globo",Globo Inter TV dos Vales HD http://psrv.io:80/9089247/coreurl.me/18354 #EXTINF:-1 tvg-logo="http://z4.vc/q6B" group-title="Canais \| Globo",Globo Inter TV dos Vales SD http://psrv.io:80/9089247/coreurl.me/18353 #EXTINF:-1 tvg-logo="http://z4.vc/gfx" group-title="Canais \| Globo",Globo Inter TV Grande Minas FHD http://psrv.io:80/9089247/coreurl.me/18352 #EXTINF:-1 tvg-logo="http://z4.vc/BEQ" group-title="Canais \| Globo",Globo Inter TV Grande Minas HD http://psrv.io:80/9089247/coreurl.me/18351 #EXTINF:-1 tvg-logo="http://z4.vc/6dU" group-title="Canais \| Globo",Globo Inter TV Grande Minas SD http://psrv.io:80/9089247/coreurl.me/18350 #EXTINF:-1 tvg-logo="http://z4.vc/mVk" group-title="Canais \| Globo",Globo Inter TV Natal SD http://psrv.io:80/9089247/coreurl.me/18427 #EXTINF:-1 tvg-logo="http://z4.vc/dlF" group-title="Canais \| Globo",Globo Inter TV Serra Mar FHD http://psrv.io:80/9089247/coreurl.me/18349 #EXTINF:-1 tvg-logo="http://z4.vc/0jO" group-title="Canais \| Globo",Globo Inter TV Serra Mar HD http://psrv.io:80/9089247/coreurl.me/18348 #EXTINF:-1 tvg-logo="http://z4.vc/4BA" group-title="Canais \| Globo",Globo Inter TV Serra Mar SD http://psrv.io:80/9089247/coreurl.me/18347 #EXTINF:-1 tvg-logo="http://z4.vc/aZb" group-title="Canais \| Globo",Globo Mato Grosso FHD http://psrv.io:80/9089247/coreurl.me/28394 #EXTINF:-1 tvg-logo="http://z4.vc/aZb" group-title="Canais \| Globo",Globo Mato Grosso HD http://psrv.io:80/9089247/coreurl.me/28393 #EXTINF:-1 tvg-logo="http://z4.vc/KxL" group-title="Canais \| Globo",Globo Minas FHD http://psrv.io:80/9089247/coreurl.me/18377 #EXTINF:-1 tvg-logo="http://z4.vc/KZ2" group-title="Canais \| Globo",Globo Minas FHD [H265] http://psrv.io:80/9089247/coreurl.me/25209 #EXTINF:-1 tvg-logo="http://z4.vc/4YI" group-title="Canais \| Globo",Globo Minas HD http://psrv.io:80/9089247/coreurl.me/18425 #EXTINF:-1 tvg-logo="http://z4.vc/ep1" group-title="Canais \| Globo",Globo Minas SD http://psrv.io:80/9089247/coreurl.me/18426 #EXTINF:-1 tvg-logo="http://z4.vc/qOs" group-title="Canais \| Notícias",Globo News FHD http://psrv.io:80/9089247/coreurl.me/18776 #EXTINF:-1 tvg-logo="http://z4.vc/5tp" group-title="Canais \| Notícias",Globo News FHD [H265] http://psrv.io:80/9089247/coreurl.me/22193 #EXTINF:-1 tvg-logo="http://z4.vc/4gV" group-title="Canais \| Notícias",Globo News HD http://psrv.io:80/9089247/coreurl.me/18651 #EXTINF:-1 tvg-logo="http://z4.vc/lKc" group-title="Canais \| Notícias",Globo News SD http://psrv.io:80/9089247/coreurl.me/18652 #EXTINF:-1 tvg-logo="http://z4.vc/97A" group-title="Canais \| Globo",Globo Nordeste FHD http://psrv.io:80/9089247/coreurl.me/18376 #EXTINF:-1 tvg-logo="http://z4.vc/Qrd" group-title="Canais \| Globo",Globo Nordeste FHD http://psrv.io:80/9089247/coreurl.me/18423 #EXTINF:-1 tvg-logo="http://z4.vc/ft1" group-title="Canais \| Globo",Globo Nordeste FHD [H265] http://psrv.io:80/9089247/coreurl.me/25208 #EXTINF:-1 tvg-logo="http://z4.vc/p5d" group-title="Canais \| Globo",Globo Nordeste SD http://psrv.io:80/9089247/coreurl.me/18424 #EXTINF:-1 tvg-logo="http://z4.vc/gY7" group-title="Canais \| Globo",Globo NSC TV Blumenau FHD http://psrv.io:80/9089247/coreurl.me/18346 #EXTINF:-1 tvg-logo="http://z4.vc/5W5" group-title="Canais \| Globo",Globo NSC TV Blumenau HD http://psrv.io:80/9089247/coreurl.me/18345 #EXTINF:-1 tvg-logo="http://z4.vc/hEE" group-title="Canais \| Globo",Globo NSC TV Blumenau SD http://psrv.io:80/9089247/coreurl.me/18344 #EXTINF:-1 tvg-logo="http://z4.vc/svh" group-title="Canais \| Globo",Globo NSC TV Chapeco FHD http://psrv.io:80/9089247/coreurl.me/18394 #EXTINF:-1 tvg-logo="http://z4.vc/JTq" group-title="Canais \| Globo",Globo NSC TV Chapeco HD http://psrv.io:80/9089247/coreurl.me/18393 #EXTINF:-1 tvg-logo="http://z4.vc/G4s" group-title="Canais \| Globo",Globo NSC TV Chapeco SD http://psrv.io:80/9089247/coreurl.me/18392 #EXTINF:-1 tvg-logo="http://z4.vc/Vey" group-title="Canais \| Globo",Globo NSC TV Florianopolis FHD http://psrv.io:80/9089247/coreurl.me/18375 #EXTINF:-1 tvg-logo="http://z4.vc/5Kj" group-title="Canais \| Globo",Globo NSC TV Florianopolis HD http://psrv.io:80/9089247/coreurl.me/18421 #EXTINF:-1 tvg-logo="http://z4.vc/cHX" group-title="Canais \| Globo",Globo NSC TV Florianopolis SD http://psrv.io:80/9089247/coreurl.me/18422 #EXTINF:-1 tvg-logo="http://z4.vc/urQ" group-title="Canais \| Globo",Globo NSC TV Joinville FHD http://psrv.io:80/9089247/coreurl.me/18340 #EXTINF:-1 tvg-logo="http://z4.vc/ihU" group-title="Canais \| Globo",Globo NSC TV Joinville HD http://psrv.io:80/9089247/coreurl.me/18339 #EXTINF:-1 tvg-logo="http://z4.vc/e5c" group-title="Canais \| Globo",Globo NSC TV Joinville SD http://psrv.io:80/9089247/coreurl.me/18338 #EXTINF:-1 tvg-logo="http://z4.vc/sLB" group-title="Canais \| Globo",Globo RBS Porto Alegre FHD http://psrv.io:80/9089247/coreurl.me/18374 #EXTINF:-1 tvg-logo="http://z4.vc/kga" group-title="Canais \| Globo",Globo RBS TV Caxias do Sul FHD http://psrv.io:80/9089247/coreurl.me/18343 #EXTINF:-1 tvg-logo="http://z4.vc/Plw" group-title="Canais \| Globo",Globo RBS TV Caxias do Sul HD http://psrv.io:80/9089247/coreurl.me/18342 #EXTINF:-1 tvg-logo="http://z4.vc/h4k" group-title="Canais \| Globo",Globo RBS TV Caxias do Sul SD http://psrv.io:80/9089247/coreurl.me/18341 #EXTINF:-1 tvg-logo="http://z4.vc/Pwb" group-title="Canais \| Globo",Globo RBS TV Pelotas FHD http://psrv.io:80/9089247/coreurl.me/18337 #EXTINF:-1 tvg-logo="http://z4.vc/iZY" group-title="Canais \| Globo",Globo RBS TV Pelotas HD http://psrv.io:80/9089247/coreurl.me/18336 #EXTINF:-1 tvg-logo="http://z4.vc/GMl" group-title="Canais \| Globo",Globo RBS TV Pelotas SD http://psrv.io:80/9089247/coreurl.me/18335 #EXTINF:-1 tvg-logo="http://z4.vc/wJx" group-title="Canais \| Globo",Globo RBS TV Porto Alegre HD http://psrv.io:80/9089247/coreurl.me/18419 #EXTINF:-1 tvg-logo="http://z4.vc/CX5" group-title="Canais \| Globo",Globo RBS TV Porto Alegre SD http://psrv.io:80/9089247/coreurl.me/18420 #EXTINF:-1 tvg-logo="http://z4.vc/X3N" group-title="Canais \| Globo",Globo Rede Amazonas Manaus SD http://psrv.io:80/9089247/coreurl.me/18418 #EXTINF:-1 tvg-logo="http://z4.vc/k7r" group-title="Canais \| Globo",Globo RJ FHD http://psrv.io:80/9089247/coreurl.me/18415 #EXTINF:-1 tvg-logo="http://z4.vc/pzi" group-title="Canais \| Globo",Globo RJ FHD [H265] http://psrv.io:80/9089247/coreurl.me/25232 #EXTINF:-1 tvg-logo="http://z4.vc/CpN" group-title="Canais \| Globo",Globo RJ HD http://psrv.io:80/9089247/coreurl.me/18416 #EXTINF:-1 tvg-logo="http://z4.vc/FYM" group-title="Canais \| Globo",Globo RJ SD http://psrv.io:80/9089247/coreurl.me/18417 #EXTINF:-1 tvg-logo="http://z4.vc/8Bl" group-title="Canais \| Globo",Globo RPC Curitiba HD http://psrv.io:80/9089247/coreurl.me/18413 #EXTINF:-1 tvg-logo="http://z4.vc/F32" group-title="Canais \| Globo",Globo RPC Curitiba SD http://psrv.io:80/9089247/coreurl.me/18412 #EXTINF:-1 tvg-logo="http://z4.vc/HQs" group-title="Canais \| Globo",Globo RPC Curitiba SD http://psrv.io:80/9089247/coreurl.me/18414 #EXTINF:-1 tvg-logo="http://z4.vc/Fwm" group-title="Canais \| Globo",Globo RPC Foz do Iguacu FHD http://psrv.io:80/9089247/coreurl.me/18390 #EXTINF:-1 tvg-logo="http://z4.vc/acv" group-title="Canais \| Globo",Globo RPC Foz do Iguacu HD http://psrv.io:80/9089247/coreurl.me/18389 #EXTINF:-1 tvg-logo="http://z4.vc/4u4" group-title="Canais \| Globo",Globo RPC Foz do Iguacu SD http://psrv.io:80/9089247/coreurl.me/18391 #EXTINF:-1 tvg-logo="http://z4.vc/JTq" group-title="Canais \| Globo",GLOBO RPC MARINGA FHD http://psrv.io:80/9089247/coreurl.me/28156 #EXTINF:-1 tvg-logo="http://z4.vc/G4s" group-title="Canais \| Globo",GLOBO RPC MARINGA HD http://psrv.io:80/9089247/coreurl.me/28155 #EXTINF:-1 tvg-logo="http://z4.vc/G4s" group-title="Canais \| Globo",GLOBO RPC MARINGA SD http://psrv.io:80/9089247/coreurl.me/28154 #EXTINF:-1 tvg-logo="http://z4.vc/rtl" group-title="Canais \| Globo",Globo Sao Jose dos Campos SD http://psrv.io:80/9089247/coreurl.me/22448 #EXTINF:-1 tvg-logo="http://z4.vc/pzi" group-title="Canais \| Globo",Globo SP FHD http://psrv.io:80/9089247/coreurl.me/28068 #EXTINF:-1 tvg-logo="http://z4.vc/NDg" group-title="Canais \| Globo",Globo SP FHD [H265] http://psrv.io:80/9089247/coreurl.me/25231 #EXTINF:-1 tvg-logo="http://z4.vc/Vlx" group-title="Canais \| Globo",Globo SP HD http://psrv.io:80/9089247/coreurl.me/18410 #EXTINF:-1 tvg-logo="http://z4.vc/tlB" group-title="Canais \| Globo",Globo SP SD http://psrv.io:80/9089247/coreurl.me/18411 #EXTINF:-1 tvg-logo="http://z4.vc/rxr" group-title="Canais \| 4K",GLOBO SP [4K] http://psrv.io:80/9089247/coreurl.me/26181 #EXTINF:-1 tvg-logo="http://z4.vc/9N9" group-title="Canais \| Globo",Globo TV Anhanguera FHD http://psrv.io:80/9089247/coreurl.me/18373 #EXTINF:-1 tvg-logo="http://z4.vc/o8M" group-title="Canais \| Globo",Globo TV Anhanguera HD http://psrv.io:80/9089247/coreurl.me/18407 #EXTINF:-1 tvg-logo="http://z4.vc/Lu3" group-title="Canais \| Globo",Globo TV Anhanguera SD http://psrv.io:80/9089247/coreurl.me/18408 #EXTINF:-1 tvg-logo="http://z4.vc/TEc" group-title="Canais \| Globo",Globo TV Bahia FHD http://psrv.io:80/9089247/coreurl.me/18372 #EXTINF:-1 tvg-logo="http://z4.vc/2HU" group-title="Canais \| Globo",Globo TV Bahia HD http://psrv.io:80/9089247/coreurl.me/18405 #EXTINF:-1 tvg-logo="http://z4.vc/ORA" group-title="Canais \| Globo",Globo TV Bahia SD http://psrv.io:80/9089247/coreurl.me/18406 #EXTINF:-1 tvg-logo="http://z4.vc/Ew0" group-title="Canais \| Globo",Globo TV C. America Cuiaba SD http://psrv.io:80/9089247/coreurl.me/18404 #EXTINF:-1 tvg-logo="http://z4.vc/VCk" group-title="Canais \| Globo",Globo TV Cabo Branco FHD http://psrv.io:80/9089247/coreurl.me/18334 #EXTINF:-1 tvg-logo="http://z4.vc/jIh" group-title="Canais \| Globo",Globo TV Cabo Branco HD http://psrv.io:80/9089247/coreurl.me/18333 #EXTINF:-1 tvg-logo="http://z4.vc/V9M" group-title="Canais \| Globo",Globo TV Cabo Branco SD http://psrv.io:80/9089247/coreurl.me/18332 #EXTINF:-1 tvg-logo="http://z4.vc/GNp" group-title="Canais \| Globo",Globo TV Clube Teresina FHD http://psrv.io:80/9089247/coreurl.me/18387 #EXTINF:-1 tvg-logo="http://z4.vc/Qhi" group-title="Canais \| Globo",Globo TV Clube Teresina HD http://psrv.io:80/9089247/coreurl.me/18386 #EXTINF:-1 tvg-logo="http://z4.vc/hiL" group-title="Canais \| Globo",Globo TV Clube Teresina SD http://psrv.io:80/9089247/coreurl.me/18388 #EXTINF:-1 tvg-logo="http://z4.vc/3yp" group-title="Canais \| Globo",Globo TV Diario Fortaleza FHD http://psrv.io:80/9089247/coreurl.me/18740 #EXTINF:-1 tvg-logo="http://z4.vc/JPA" group-title="Canais \| Globo",Globo TV Diario Fortaleza HD http://psrv.io:80/9089247/coreurl.me/18490 #EXTINF:-1 tvg-logo="http://z4.vc/i2a" group-title="Canais \| Globo",Globo TV Diario Fortaleza SD http://psrv.io:80/9089247/coreurl.me/18489 #EXTINF:-1 tvg-logo="http://z4.vc/P3s" group-title="Canais \| Globo",Globo TV Gazeta Alagoas FHD http://psrv.io:80/9089247/coreurl.me/18363 #EXTINF:-1 tvg-logo="http://z4.vc/rVZ" group-title="Canais \| Globo",Globo TV Gazeta Alagoas HD http://psrv.io:80/9089247/coreurl.me/18362 #EXTINF:-1 tvg-logo="http://z4.vc/0wh" group-title="Canais \| Globo",Globo TV Gazeta Alagoas SD http://psrv.io:80/9089247/coreurl.me/18364 #EXTINF:-1 tvg-logo="http://z4.vc/hex" group-title="Canais \| Globo",Globo TV Gazeta Sul ES FHD http://psrv.io:80/9089247/coreurl.me/18361 #EXTINF:-1 tvg-logo="http://z4.vc/R14" group-title="Canais \| Globo",Globo TV Gazeta Sul ES HD http://psrv.io:80/9089247/coreurl.me/18360 #EXTINF:-1 tvg-logo="http://z4.vc/Ri9" group-title="Canais \| Globo",Globo TV Gazeta Vitoria FHD http://psrv.io:80/9089247/coreurl.me/18384 #EXTINF:-1 tvg-logo="http://z4.vc/pM2" group-title="Canais \| Globo",Globo TV Gazeta Vitoria HD http://psrv.io:80/9089247/coreurl.me/18383 #EXTINF:-1 tvg-logo="http://z4.vc/PMO" group-title="Canais \| Globo",Globo TV Gazeta Vitoria SD http://psrv.io:80/9089247/coreurl.me/18385 #EXTINF:-1 tvg-logo="http://z4.vc/y1y" group-title="Canais \| Globo",Globo TV Liberal Belem SD http://psrv.io:80/9089247/coreurl.me/18403 #EXTINF:-1 tvg-logo="http://z4.vc/iWH" group-title="Canais \| Globo",Globo TV Mirante Sao Luis FHD http://psrv.io:80/9089247/coreurl.me/18371 #EXTINF:-1 tvg-logo="http://z4.vc/XMT" group-title="Canais \| Globo",Globo TV Mirante Sao Luis HD http://psrv.io:80/9089247/coreurl.me/18370 #EXTINF:-1 tvg-logo="http://z4.vc/k9T" group-title="Canais \| Globo",Globo TV Mirante Sao Luis SD http://psrv.io:80/9089247/coreurl.me/18369 #EXTINF:-1 tvg-logo="http://z4.vc/Qju" group-title="Canais \| Globo",Globo TV Moreno Campo Grande FHD http://psrv.io:80/9089247/coreurl.me/18368 #EXTINF:-1 tvg-logo="http://z4.vc/Auq" group-title="Canais \| Globo",Globo TV Moreno Campo Grande HD http://psrv.io:80/9089247/coreurl.me/18367 #EXTINF:-1 tvg-logo="http://z4.vc/jZD" group-title="Canais \| Globo",Globo TV Moreno Campo Grande SD http://psrv.io:80/9089247/coreurl.me/18366 #EXTINF:-1 tvg-logo="http://z4.vc/1ax" group-title="Canais \| Globo",Globo TV Rio Sul FHD http://psrv.io:80/9089247/coreurl.me/18331 #EXTINF:-1 tvg-logo="http://z4.vc/l2H" group-title="Canais \| Globo",Globo TV Rio Sul HD http://psrv.io:80/9089247/coreurl.me/18330 #EXTINF:-1 tvg-logo="http://z4.vc/k1z" group-title="Canais \| Globo",Globo TV Rio Sul SD http://psrv.io:80/9089247/coreurl.me/18329 #EXTINF:-1 tvg-logo="http://z4.vc/RhF" group-title="Canais \| Globo",Globo TV Santa Cruz FHD http://psrv.io:80/9089247/coreurl.me/18328 #EXTINF:-1 tvg-logo="http://z4.vc/jUt" group-title="Canais \| Globo",Globo TV Santa Cruz HD http://psrv.io:80/9089247/coreurl.me/18327 #EXTINF:-1 tvg-logo="http://z4.vc/ZoM" group-title="Canais \| Globo",Globo TV Santa Cruz SD http://psrv.io:80/9089247/coreurl.me/18326 #EXTINF:-1 tvg-logo="http://z4.vc/0ho" group-title="Canais \| Globo",Globo TV Sergipe HD http://psrv.io:80/9089247/coreurl.me/18381 #EXTINF:-1 tvg-logo="http://z4.vc/PSf" group-title="Canais \| Globo",Globo TV Sergipe HD http://psrv.io:80/9089247/coreurl.me/18380 #EXTINF:-1 tvg-logo="http://z4.vc/ERo" group-title="Canais \| Globo",Globo TV Sergipe HD http://psrv.io:80/9089247/coreurl.me/22475 #EXTINF:-1 tvg-logo="http://z4.vc/Pj1" group-title="Canais \| Globo",Globo TV Sergipe SD http://psrv.io:80/9089247/coreurl.me/18382 #EXTINF:-1 tvg-logo="http://z4.vc/zfQ" group-title="Canais \| Globo",Globo TV TEM Bauru SD http://psrv.io:80/9089247/coreurl.me/18402 #EXTINF:-1 tvg-logo="http://z4.vc/c9W" group-title="Canais \| Globo",Globo TV TEM S. J. do Rio Preto HD http://psrv.io:80/9089247/coreurl.me/18400 #EXTINF:-1 tvg-logo="http://z4.vc/tLN" group-title="Canais \| Globo",Globo TV TEM S. J. do Rio Preto SD http://psrv.io:80/9089247/coreurl.me/18399 #EXTINF:-1 tvg-logo="http://z4.vc/5rA" group-title="Canais \| Globo",Globo TV TEM S. J. Rio Preto FHD http://psrv.io:80/9089247/coreurl.me/18365 #EXTINF:-1 tvg-logo="http://z4.vc/F7c" group-title="Canais \| Globo",Globo TV TEM Sorocaba SD http://psrv.io:80/9089247/coreurl.me/18401 #EXTINF:-1 tvg-logo="http://z4.vc/B32" group-title="Canais \| Globo",Globo TV Tribuna Santas SD http://psrv.io:80/9089247/coreurl.me/18398 #EXTINF:-1 tvg-logo="http://z4.vc/crH" group-title="Canais \| Globo",Globo TV Vanguarda S. J. dos Campos SD http://psrv.io:80/9089247/coreurl.me/18397 #EXTINF:-1 tvg-logo="http://z4.vc/osc" group-title="Canais \| Globo",Globo TV Verdes Mares Fortaleza HD http://psrv.io:80/9089247/coreurl.me/28395 #EXTINF:-1 tvg-logo="http://z4.vc/osc" group-title="Canais \| Globo",Globo TV Verdes Mares Fortaleza SD http://psrv.io:80/9089247/coreurl.me/18396 #EXTINF:-1 tvg-logo="http://z4.vc/e4t" group-title="Canais \| Variedades",GloboSat FHD [H265] http://psrv.io:80/9089247/coreurl.me/22129 #EXTINF:-1 tvg-logo="http://z4.vc/KG5" group-title="Canais \| Variedades",GloboSat SD http://psrv.io:80/9089247/coreurl.me/22311 #EXTINF:-1 tvg-logo="http://z4.vc/dOF" group-title="Canais \| Infantis",Gloob FHD http://psrv.io:80/9089247/coreurl.me/18775 #EXTINF:-1 tvg-logo="http://z4.vc/EuT" group-title="Canais \| Infantis",Gloob FHD [H265] http://psrv.io:80/9089247/coreurl.me/22142 #EXTINF:-1 tvg-logo="http://z4.vc/uDI" group-title="Canais \| Infantis",Gloob HD http://psrv.io:80/9089247/coreurl.me/18649 #EXTINF:-1 tvg-logo="http://z4.vc/K5g" group-title="Canais \| Infantis",Gloob SD http://psrv.io:80/9089247/coreurl.me/18650 #EXTINF:-1 tvg-logo="http://z4.vc/KhW" group-title="Canais \| Infantis",Gloob SD http://psrv.io:80/9089247/coreurl.me/22310 #EXTINF:-1 tvg-logo="http://z4.vc/IBp" group-title="Canais \| Infantis",Gloobinho FHD http://psrv.io:80/9089247/coreurl.me/18828 #EXTINF:-1 tvg-logo="http://z4.vc/i0a" group-title="Canais \| Infantis",Gloobinho FHD [H265] http://psrv.io:80/9089247/coreurl.me/25205 #EXTINF:-1 tvg-logo="http://z4.vc/sf3" group-title="Canais \| Infantis",Gloobinho HD http://psrv.io:80/9089247/coreurl.me/18648 #EXTINF:-1 tvg-logo="http://z4.vc/QOP" group-title="Canais \| Infantis",Gloobinho SD http://psrv.io:80/9089247/coreurl.me/18647 #EXTINF:-1 tvg-logo="http://z4.vc/ibf" group-title="Canais \| Variedades",GNT FHD http://psrv.io:80/9089247/coreurl.me/18827 #EXTINF:-1 tvg-logo="http://z4.vc/Z8a" group-title="Canais \| Variedades",GNT FHD [H265] http://psrv.io:80/9089247/coreurl.me/22141 #EXTINF:-1 tvg-logo="http://z4.vc/6ya" group-title="Canais \| Variedades",GNT HD http://psrv.io:80/9089247/coreurl.me/18645 #EXTINF:-1 tvg-logo="http://z4.vc/Dat" group-title="Canais \| Variedades",GNT SD http://psrv.io:80/9089247/coreurl.me/18646 #EXTINF:-1 tvg-logo="http://z4.vc/kgB" group-title="Canais \| Jogos & Eventos",Guia De Jogos http://psrv.io:80/9089247/coreurl.me/28396 #EXTINF:-1 tvg-logo="http://z4.vc/Yos" group-title="Canais \| Documentários",H2 FHD http://psrv.io:80/9089247/coreurl.me/18826 #EXTINF:-1 tvg-logo="http://z4.vc/cwN" group-title="Canais \| Documentários",H2 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22192 #EXTINF:-1 tvg-logo="http://z4.vc/prI" group-title="Canais \| Documentários",H2 HD http://psrv.io:80/9089247/coreurl.me/18643 #EXTINF:-1 tvg-logo="http://z4.vc/Izg" group-title="Canais \| Documentários",H2 SD http://psrv.io:80/9089247/coreurl.me/22309 #EXTINF:-1 tvg-logo="http://z4.vc/jVz" group-title="Canais \| HBO",HBO 2 FHD http://psrv.io:80/9089247/coreurl.me/18774 #EXTINF:-1 tvg-logo="http://z4.vc/8E9" group-title="Canais \| HBO",HBO 2 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22189 #EXTINF:-1 tvg-logo="http://z4.vc/0PM" group-title="Canais \| HBO",HBO 2 HD http://psrv.io:80/9089247/coreurl.me/18640 #EXTINF:-1 tvg-logo="http://z4.vc/zwf" group-title="Canais \| HBO",HBO 2 SD http://psrv.io:80/9089247/coreurl.me/18641 #EXTINF:-1 tvg-logo="http://z4.vc/VUR" group-title="Canais \| HBO",HBO Family FHD http://psrv.io:80/9089247/coreurl.me/18825 #EXTINF:-1 tvg-logo="http://z4.vc/kwk" group-title="Canais \| HBO",HBO Family FHD [H265] http://psrv.io:80/9089247/coreurl.me/22140 #EXTINF:-1 tvg-logo="http://z4.vc/JtC" group-title="Canais \| HBO",HBO Family HD http://psrv.io:80/9089247/coreurl.me/18638 #EXTINF:-1 tvg-logo="http://z4.vc/vKg" group-title="Canais \| HBO",HBO Family SD http://psrv.io:80/9089247/coreurl.me/18639 #EXTINF:-1 tvg-logo="http://z4.vc/xDI" group-title="Canais \| HBO",HBO FHD http://psrv.io:80/9089247/coreurl.me/18773 #EXTINF:-1 tvg-logo="http://z4.vc/Tjb" group-title="Canais \| HBO",HBO FHD [H265] http://psrv.io:80/9089247/coreurl.me/22139 #EXTINF:-1 tvg-logo="http://z4.vc/z1Y" group-title="Canais \| HBO",HBO HD http://psrv.io:80/9089247/coreurl.me/18637 #EXTINF:-1 tvg-logo="http://z4.vc/z1Y" group-title="Canais \| Legendados",HBO HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28343 #EXTINF:-1 tvg-logo="http://z4.vc/YOR" group-title="Canais \| HBO",HBO Plus FHD http://psrv.io:80/9089247/coreurl.me/18824 #EXTINF:-1 tvg-logo="http://z4.vc/EFq" group-title="Canais \| HBO",HBO Plus FHD [H265] http://psrv.io:80/9089247/coreurl.me/22191 #EXTINF:-1 tvg-logo="http://z4.vc/oZI" group-title="Canais \| HBO",HBO Plus HD http://psrv.io:80/9089247/coreurl.me/18635 #EXTINF:-1 tvg-logo="http://z4.vc/z1Y" group-title="Canais \| Legendados",HBO PLUS HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28345 #EXTINF:-1 tvg-logo="http://z4.vc/Gg9" group-title="Canais \| HBO",HBO Plus SD http://psrv.io:80/9089247/coreurl.me/18636 #EXTINF:-1 tvg-logo="http://z4.vc/z1Y" group-title="Canais \| Legendados",HBO PLUS SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28346 #EXTINF:-1 tvg-logo="http://z4.vc/ncl" group-title="Canais \| HBO",HBO SD http://psrv.io:80/9089247/coreurl.me/18642 #EXTINF:-1 tvg-logo="http://z4.vc/z1Y" group-title="Canais \| Legendados",HBO SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28344 #EXTINF:-1 tvg-logo="http://z4.vc/97M" group-title="Canais \| HBO",HBO Signature FHD http://psrv.io:80/9089247/coreurl.me/18823 #EXTINF:-1 tvg-logo="http://z4.vc/1lN" group-title="Canais \| HBO",HBO Signature FHD [H265] http://psrv.io:80/9089247/coreurl.me/22190 #EXTINF:-1 tvg-logo="http://z4.vc/ICL" group-title="Canais \| HBO",HBO Signature HD http://psrv.io:80/9089247/coreurl.me/18633 #EXTINF:-1 tvg-logo="http://z4.vc/CPt" group-title="Canais \| HBO",HBO Signature SD http://psrv.io:80/9089247/coreurl.me/18634 #EXTINF:-1 tvg-logo="http://z4.vc/TDO" group-title="Canais \| Documentários",HGTV FHD http://psrv.io:80/9089247/coreurl.me/18845 #EXTINF:-1 tvg-logo="" group-title="Canais \| Documentários",HGTV FHD [H265] http://psrv.io:80/9089247/coreurl.me/22203 #EXTINF:-1 tvg-logo="" group-title="Canais \| Documentários",HGTV HD http://psrv.io:80/9089247/coreurl.me/18699 #EXTINF:-1 tvg-logo="http://z4.vc/3Ee" group-title="Canais \| Documentários",HGTV SD http://psrv.io:80/9089247/coreurl.me/18700 #EXTINF:-1 tvg-logo="http://z4.vc/YVo" group-title="Canais \| Documentários",History Channel FHD http://psrv.io:80/9089247/coreurl.me/18822 #EXTINF:-1 tvg-logo="http://z4.vc/p68" group-title="Canais \| Documentários",History Channel FHD [H265] http://psrv.io:80/9089247/coreurl.me/22188 #EXTINF:-1 tvg-logo="http://z4.vc/hEz" group-title="Canais \| Documentários",History Channel HD http://psrv.io:80/9089247/coreurl.me/18631 #EXTINF:-1 tvg-logo="http://z4.vc/GaY" group-title="Canais \| Documentários",History Channel SD http://psrv.io:80/9089247/coreurl.me/18632 #EXTINF:-1 tvg-logo="http://z4.vc/13M" group-title="Canais \| Variedades",ID: Investigacao Discovery FHD http://psrv.io:80/9089247/coreurl.me/18821 #EXTINF:-1 tvg-logo="http://z4.vc/vS4" group-title="Canais \| Variedades",ID: Investigacao Discovery FHD [H265] http://psrv.io:80/9089247/coreurl.me/22187 #EXTINF:-1 tvg-logo="http://z4.vc/q6F" group-title="Canais \| Variedades",ID: Investigacao Discovery HD http://psrv.io:80/9089247/coreurl.me/18629 #EXTINF:-1 tvg-logo="http://z4.vc/dAy" group-title="Canais \| Variedades",ID: Investigacao Discovery SD http://psrv.io:80/9089247/coreurl.me/18630 #EXTINF:-1 tvg-logo="" group-title="Canais \| Religiosos",Ideal  TV FHD http://psrv.io:80/9089247/coreurl.me/28397 #EXTINF:-1 tvg-logo="" group-title="Canais \| Filmes e Séries",Life Time FHD http://psrv.io:80/9089247/coreurl.me/28401 #EXTINF:-1 tvg-logo="" group-title="Canais \| Filmes e Séries",Life Time SD http://psrv.io:80/9089247/coreurl.me/28402 #EXTINF:-1 tvg-logo="http://z4.vc/jgf" group-title="Canais \| Variedades",Lifetime FHD http://psrv.io:80/9089247/coreurl.me/18820 #EXTINF:-1 tvg-logo="http://z4.vc/ELX" group-title="Canais \| Variedades",Lifetime FHD [H265] http://psrv.io:80/9089247/coreurl.me/22186 #EXTINF:-1 tvg-logo="http://z4.vc/a4s" group-title="Canais \| Variedades",Lifetime HD http://psrv.io:80/9089247/coreurl.me/18627 #EXTINF:-1 tvg-logo="http://z4.vc/Eyw" group-title="Canais \| Variedades",Lifetime SD http://psrv.io:80/9089247/coreurl.me/18628 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",LOVE NATURAL FHD http://psrv.io:80/9089247/coreurl.me/26697 #EXTINF:-1 tvg-logo="http://z4.vc/DiW" group-title="Canais \| Variedades",Mais GloboSat FHD http://psrv.io:80/9089247/coreurl.me/18754 #EXTINF:-1 tvg-logo="http://z4.vc/9d1" group-title="Canais \| Variedades",Mais GloboSat FHD [H265] http://psrv.io:80/9089247/coreurl.me/25291 #EXTINF:-1 tvg-logo="http://z4.vc/0yY" group-title="Canais \| Variedades",Mais GloboSat HD http://psrv.io:80/9089247/coreurl.me/18625 #EXTINF:-1 tvg-logo="http://z4.vc/QSP" group-title="Canais \| Variedades",Mais GloboSat SD http://psrv.io:80/9089247/coreurl.me/18626 #EXTINF:-1 tvg-logo="http://z4.vc/amW" group-title="Canais \| Filmes e Séries",Max FHD http://psrv.io:80/9089247/coreurl.me/18819 #EXTINF:-1 tvg-logo="http://z4.vc/cmn" group-title="Canais \| Filmes e Séries",Max FHD [H265] http://psrv.io:80/9089247/coreurl.me/22185 #EXTINF:-1 tvg-logo="http://z4.vc/cC5" group-title="Canais \| Filmes e Séries",Max HD http://psrv.io:80/9089247/coreurl.me/18623 #EXTINF:-1 tvg-logo="http://z4.vc/i97" group-title="Canais \| Filmes e Séries",Max Prime FHD http://psrv.io:80/9089247/coreurl.me/18818 #EXTINF:-1 tvg-logo="http://z4.vc/Zzp" group-title="Canais \| Filmes e Séries",Max Prime FHD [H265] http://psrv.io:80/9089247/coreurl.me/22184 #EXTINF:-1 tvg-logo="http://z4.vc/fwU" group-title="Canais \| Filmes e Séries",Max Prime HD http://psrv.io:80/9089247/coreurl.me/18621 #EXTINF:-1 tvg-logo="http://z4.vc/cv2" group-title="Canais \| Filmes e Séries",Max Prime SD http://psrv.io:80/9089247/coreurl.me/18622 #EXTINF:-1 tvg-logo="http://z4.vc/i97" group-title="Canais \| Legendados",MAX PRIME SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28347 #EXTINF:-1 tvg-logo="http://z4.vc/CmH" group-title="Canais \| Filmes e Séries",Max SD http://psrv.io:80/9089247/coreurl.me/18624 #EXTINF:-1 tvg-logo="http://z4.vc/cC5" group-title="Canais \| Legendados",MAX SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28348 #EXTINF:-1 tvg-logo="http://z4.vc/sJf" group-title="Canais \| Filmes e Séries",Max UP FHD http://psrv.io:80/9089247/coreurl.me/18817 #EXTINF:-1 tvg-logo="http://z4.vc/g5r" group-title="Canais \| Filmes e Séries",Max UP FHD [H265] http://psrv.io:80/9089247/coreurl.me/22138 #EXTINF:-1 tvg-logo="http://z4.vc/gZk" group-title="Canais \| Filmes e Séries",Max UP HD http://psrv.io:80/9089247/coreurl.me/18619 #EXTINF:-1 tvg-logo="http://z4.vc/gZk" group-title="Canais \| Legendados",MAX UP HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28363 #EXTINF:-1 tvg-logo="http://z4.vc/brs" group-title="Canais \| Filmes e Séries",Max UP SD http://psrv.io:80/9089247/coreurl.me/18620 #EXTINF:-1 tvg-logo="http://z4.vc/gZk" group-title="Canais \| Legendados",MAX UP SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28364 #EXTINF:-1 tvg-logo="http://z4.vc/jWK" group-title="Canais \| Filmes e Séries",Megapix FHD http://psrv.io:80/9089247/coreurl.me/18816 #EXTINF:-1 tvg-logo="http://z4.vc/zPy" group-title="Canais \| Filmes e Séries",Megapix FHD [H265] http://psrv.io:80/9089247/coreurl.me/22137 #EXTINF:-1 tvg-logo="http://z4.vc/KR2" group-title="Canais \| Filmes e Séries",Megapix HD http://psrv.io:80/9089247/coreurl.me/18617 #EXTINF:-1 tvg-logo="http://z4.vc/KR2" group-title="Canais \| Legendados",MEGAPIX HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28365 #EXTINF:-1 tvg-logo="http://z4.vc/g9W" group-title="Canais \| Filmes e Séries",Megapix SD http://psrv.io:80/9089247/coreurl.me/18618 #EXTINF:-1 tvg-logo="http://z4.vc/KR2" group-title="Canais \| Legendados",MEGAPIX SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28366 #EXTINF:-1 tvg-logo="http://z4.vc/asB" group-title="Canais \| 4K",MEGAPIX [4K] http://psrv.io:80/9089247/coreurl.me/26407 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",MIAMI TV HD http://psrv.io:80/9089247/coreurl.me/26430 #EXTINF:-1 tvg-logo="http://z4.vc/1kJ" group-title="Canais \| Variedades",MTV FHD http://psrv.io:80/9089247/coreurl.me/18815 #EXTINF:-1 tvg-logo="http://z4.vc/zg9" group-title="Canais \| Variedades",MTV FHD [H265] http://psrv.io:80/9089247/coreurl.me/22183 #EXTINF:-1 tvg-logo="http://z4.vc/sTl" group-title="Canais \| Variedades",MTV HD http://psrv.io:80/9089247/coreurl.me/18615 #EXTINF:-1 tvg-logo="http://z4.vc/PWM" group-title="Canais \| Variedades",MTV Live FHD http://psrv.io:80/9089247/coreurl.me/18814 #EXTINF:-1 tvg-logo="http://z4.vc/1ND" group-title="Canais \| Variedades",MTV Live FHD [H265] http://psrv.io:80/9089247/coreurl.me/25227 #EXTINF:-1 tvg-logo="http://z4.vc/u8U" group-title="Canais \| Variedades",MTV Live HD http://psrv.io:80/9089247/coreurl.me/18507 #EXTINF:-1 tvg-logo="http://z4.vc/JCl" group-title="Canais \| Variedades",MTV Live SD http://psrv.io:80/9089247/coreurl.me/18508 #EXTINF:-1 tvg-logo="http://z4.vc/MWq" group-title="Canais \| Variedades",MTV SD http://psrv.io:80/9089247/coreurl.me/18616 #EXTINF:-1 tvg-logo="http://z4.vc/7vt" group-title="Canais \| Variedades",Multishow FHD http://psrv.io:80/9089247/coreurl.me/18813 #EXTINF:-1 tvg-logo="http://z4.vc/6Yx" group-title="Canais \| Variedades",Multishow FHD [H265] http://psrv.io:80/9089247/coreurl.me/22182 #EXTINF:-1 tvg-logo="http://z4.vc/Oev" group-title="Canais \| Variedades",Multishow HD http://psrv.io:80/9089247/coreurl.me/18613 #EXTINF:-1 tvg-logo="http://z4.vc/0j3" group-title="Canais \| Variedades",Multishow SD http://psrv.io:80/9089247/coreurl.me/18614 #EXTINF:-1 tvg-logo="http://z4.vc/2VC" group-title="Canais \| 4K",MULTISHOW [4K] http://psrv.io:80/9089247/coreurl.me/26191 #EXTINF:-1 tvg-logo="http://z4.vc/FRj" group-title="Canais \| Variedades",Music Box Brasil FHD http://psrv.io:80/9089247/coreurl.me/18812 #EXTINF:-1 tvg-logo="http://z4.vc/TJW" group-title="Canais \| Variedades",Music Box Brasil FHD [H265] http://psrv.io:80/9089247/coreurl.me/25285 #EXTINF:-1 tvg-logo="http://z4.vc/odD" group-title="Canais \| Variedades",Music Box Brasil HD http://psrv.io:80/9089247/coreurl.me/18611 #EXTINF:-1 tvg-logo="http://z4.vc/SEn" group-title="Canais \| Variedades",Music Box Brasil SD http://psrv.io:80/9089247/coreurl.me/18612 #EXTINF:-1 tvg-logo="http://z4.vc/j0A" group-title="Canais \| Infantis",NatGeo Kids FHD http://psrv.io:80/9089247/coreurl.me/18810 #EXTINF:-1 tvg-logo="http://z4.vc/yTi" group-title="Canais \| Infantis",NatGeo Kids FHD [H265] http://psrv.io:80/9089247/coreurl.me/22180 #EXTINF:-1 tvg-logo="http://z4.vc/4kC" group-title="Canais \| Infantis",NatGeo Kids HD http://psrv.io:80/9089247/coreurl.me/18607 #EXTINF:-1 tvg-logo="http://z4.vc/3yZ" group-title="Canais \| Infantis",NatGeo Kids SD http://psrv.io:80/9089247/coreurl.me/18608 #EXTINF:-1 tvg-logo="http://z4.vc/t2t" group-title="Canais \| Documentários",NatGeo Wild FHD http://psrv.io:80/9089247/coreurl.me/18809 #EXTINF:-1 tvg-logo="http://z4.vc/Nzf" group-title="Canais \| Documentários",NatGeo Wild FHD [H265] http://psrv.io:80/9089247/coreurl.me/22179 #EXTINF:-1 tvg-logo="http://z4.vc/Vzb" group-title="Canais \| Documentários",NatGeo Wild HD http://psrv.io:80/9089247/coreurl.me/18606 #EXTINF:-1 tvg-logo="http://z4.vc/qtJ" group-title="Canais \| Documentários",NatGeo Wild SD http://psrv.io:80/9089247/coreurl.me/18605 #EXTINF:-1 tvg-logo="http://z4.vc/aSn" group-title="Canais \| 4K",NATGEO [4K] http://psrv.io:80/9089247/coreurl.me/26695 #EXTINF:-1 tvg-logo="http://z4.vc/QKB" group-title="Canais \| Documentários",National Geographic FHD http://psrv.io:80/9089247/coreurl.me/18811 #EXTINF:-1 tvg-logo="http://z4.vc/NlH" group-title="Canais \| Documentários",National Geographic HD http://psrv.io:80/9089247/coreurl.me/18609 #EXTINF:-1 tvg-logo="http://z4.vc/uNC" group-title="Canais \| Documentários",National Geographic SD http://psrv.io:80/9089247/coreurl.me/18610 #EXTINF:-1 tvg-logo="http://z4.vc/97h" group-title="Canais \| Abertos",NBR SD http://psrv.io:80/9089247/coreurl.me/18604 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",NFL Network HD [TEMP] http://psrv.io:80/9089247/coreurl.me/28392 #EXTINF:-1 tvg-logo="http://z4.vc/8Qu" group-title="Canais \| Internacionais",NHK JAPAO SD http://psrv.io:80/9089247/coreurl.me/26436 #EXTINF:-1 tvg-logo="http://z4.vc/UKk" group-title="Canais \| Internacionais",NHK SD http://psrv.io:80/9089247/coreurl.me/22219 #EXTINF:-1 tvg-logo="http://z4.vc/kon" group-title="Canais \| Internacionais",NHK WORLD HD http://psrv.io:80/9089247/coreurl.me/26435 #EXTINF:-1 tvg-logo="http://z4.vc/pI8" group-title="Canais \| Infantis",Nick Jr FHD http://psrv.io:80/9089247/coreurl.me/18808 #EXTINF:-1 tvg-logo="http://z4.vc/HZk" group-title="Canais \| Infantis",Nick Jr FHD [H265] http://psrv.io:80/9089247/coreurl.me/22178 #EXTINF:-1 tvg-logo="http://z4.vc/Xp5" group-title="Canais \| Infantis",Nick Jr HD http://psrv.io:80/9089247/coreurl.me/18602 #EXTINF:-1 tvg-logo="http://z4.vc/kuz" group-title="Canais \| Infantis",Nick Jr SD http://psrv.io:80/9089247/coreurl.me/18603 #EXTINF:-1 tvg-logo="http://z4.vc/9Ti" group-title="Canais \| Infantis",Nickelodeon FHD http://psrv.io:80/9089247/coreurl.me/18807 #EXTINF:-1 tvg-logo="http://z4.vc/NFO" group-title="Canais \| Infantis",Nickelodeon FHD [H265] http://psrv.io:80/9089247/coreurl.me/22136 #EXTINF:-1 tvg-logo="http://z4.vc/6RD" group-title="Canais \| Infantis",Nickelodeon HD http://psrv.io:80/9089247/coreurl.me/18600 #EXTINF:-1 tvg-logo="http://z4.vc/Ad6" group-title="Canais \| Infantis",Nickelodeon SD http://psrv.io:80/9089247/coreurl.me/18601 #EXTINF:-1 tvg-logo="http://z4.vc/DH2" group-title="Canais \| Variedades",OFF FHD http://psrv.io:80/9089247/coreurl.me/18806 #EXTINF:-1 tvg-logo="http://z4.vc/F6G" group-title="Canais \| Variedades",OFF FHD [H265] http://psrv.io:80/9089247/coreurl.me/22135 #EXTINF:-1 tvg-logo="http://z4.vc/L2Z" group-title="Canais \| Variedades",OFF HD http://psrv.io:80/9089247/coreurl.me/18598 #EXTINF:-1 tvg-logo="http://z4.vc/dGv" group-title="Canais \| Variedades",OFF SD http://psrv.io:80/9089247/coreurl.me/18599 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",Olympic Channel 1 http://psrv.io:80/9089247/coreurl.me/28160 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",Olympic Channel 2 http://psrv.io:80/9089247/coreurl.me/28161 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",Olympic Channel 3 http://psrv.io:80/9089247/coreurl.me/28162 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",Olympic Channel 4 http://psrv.io:80/9089247/coreurl.me/28163 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",Olympic Channel 5 http://psrv.io:80/9089247/coreurl.me/28164 #EXTINF:-1 tvg-logo="http://z4.vc/UeA" group-title="Canais \| Filmes e Séries",Paramount Channel FHD http://psrv.io:80/9089247/coreurl.me/18805 #EXTINF:-1 tvg-logo="http://z4.vc/VL0" group-title="Canais \| Filmes e Séries",Paramount Channel FHD [H265] http://psrv.io:80/9089247/coreurl.me/22177 #EXTINF:-1 tvg-logo="http://z4.vc/QY7" group-title="Canais \| Filmes e Séries",Paramount Channel HD http://psrv.io:80/9089247/coreurl.me/18596 #EXTINF:-1 tvg-logo="http://z4.vc/G8C" group-title="Canais \| Filmes e Séries",Paramount Channel SD http://psrv.io:80/9089247/coreurl.me/18597 #EXTINF:-1 tvg-logo="http://z4.vc/jN0" group-title="Canais \| Variedades",Play TV SD http://psrv.io:80/9089247/coreurl.me/22288 #EXTINF:-1 tvg-logo="http://z4.vc/XYx" group-title="Canais \| Infantis",PlayKids FHD http://psrv.io:80/9089247/coreurl.me/18747 #EXTINF:-1 tvg-logo="http://z4.vc/zrG" group-title="Canais \| Infantis",PlayKids HD http://psrv.io:80/9089247/coreurl.me/18499 #EXTINF:-1 tvg-logo="http://z4.vc/z3I" group-title="Canais \| Infantis",PlayKids SD http://psrv.io:80/9089247/coreurl.me/18498 #EXTINF:-1 tvg-logo="" group-title="Canais \| Variedades",PolishopTV SD http://psrv.io:80/9089247/coreurl.me/28066 #EXTINF:-1 tvg-logo="http://z4.vc/Bxs" group-title="Canais \| 4K",PREMIER CLUB [4K] http://psrv.io:80/9089247/coreurl.me/26184 #EXTINF:-1 tvg-logo="http://z4.vc/B3z" group-title="Canais \| Premiere",Premiere 2 FHD http://psrv.io:80/9089247/coreurl.me/18772 #EXTINF:-1 tvg-logo="http://z4.vc/JZf" group-title="Canais \| Premiere",Premiere 2 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22176 #EXTINF:-1 tvg-logo="http://z4.vc/7TJ" group-title="Canais \| Premiere",Premiere 2 HD http://psrv.io:80/9089247/coreurl.me/18594 #EXTINF:-1 tvg-logo="http://z4.vc/Dw5" group-title="Canais \| Premiere",Premiere 2 SD http://psrv.io:80/9089247/coreurl.me/18595 #EXTINF:-1 tvg-logo="http://z4.vc/zhT" group-title="Canais \| Premiere",Premiere 3 FHD http://psrv.io:80/9089247/coreurl.me/18771 #EXTINF:-1 tvg-logo="http://z4.vc/3MT" group-title="Canais \| Premiere",Premiere 3 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22175 #EXTINF:-1 tvg-logo="http://z4.vc/Eov" group-title="Canais \| Premiere",Premiere 3 HD http://psrv.io:80/9089247/coreurl.me/18592 #EXTINF:-1 tvg-logo="http://z4.vc/pYW" group-title="Canais \| Premiere",Premiere 3 SD http://psrv.io:80/9089247/coreurl.me/18593 #EXTINF:-1 tvg-logo="http://z4.vc/l5p" group-title="Canais \| Premiere",Premiere 4 FHD http://psrv.io:80/9089247/coreurl.me/18770 #EXTINF:-1 tvg-logo="http://z4.vc/GQj" group-title="Canais \| Premiere",Premiere 4 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22174 #EXTINF:-1 tvg-logo="http://z4.vc/3yh" group-title="Canais \| Premiere",Premiere 4 HD http://psrv.io:80/9089247/coreurl.me/18590 #EXTINF:-1 tvg-logo="http://z4.vc/rHH" group-title="Canais \| Premiere",Premiere 4 SD http://psrv.io:80/9089247/coreurl.me/18591 #EXTINF:-1 tvg-logo="http://z4.vc/9fk" group-title="Canais \| Premiere",Premiere 5 FHD http://psrv.io:80/9089247/coreurl.me/18769 #EXTINF:-1 tvg-logo="http://z4.vc/gzL" group-title="Canais \| Premiere",Premiere 5 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22173 #EXTINF:-1 tvg-logo="http://z4.vc/mTm" group-title="Canais \| Premiere",Premiere 5 HD http://psrv.io:80/9089247/coreurl.me/18588 #EXTINF:-1 tvg-logo="http://z4.vc/EKB" group-title="Canais \| Premiere",Premiere 5 SD http://psrv.io:80/9089247/coreurl.me/18589 #EXTINF:-1 tvg-logo="http://z4.vc/MWj" group-title="Canais \| Premiere",Premiere 6 FHD http://psrv.io:80/9089247/coreurl.me/18768 #EXTINF:-1 tvg-logo="http://z4.vc/zX5" group-title="Canais \| Premiere",Premiere 6 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22172 #EXTINF:-1 tvg-logo="http://z4.vc/6nM" group-title="Canais \| Premiere",Premiere 6 HD http://psrv.io:80/9089247/coreurl.me/18586 #EXTINF:-1 tvg-logo="http://z4.vc/QT6" group-title="Canais \| Premiere",Premiere 6 SD http://psrv.io:80/9089247/coreurl.me/18587 #EXTINF:-1 tvg-logo="http://z4.vc/hJk" group-title="Canais \| Premiere",Premiere 7 FHD http://psrv.io:80/9089247/coreurl.me/18767 #EXTINF:-1 tvg-logo="http://z4.vc/zwc" group-title="Canais \| Premiere",Premiere 7 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22171 #EXTINF:-1 tvg-logo="http://z4.vc/xrN" group-title="Canais \| Premiere",Premiere 7 HD http://psrv.io:80/9089247/coreurl.me/18584 #EXTINF:-1 tvg-logo="http://z4.vc/1i8" group-title="Canais \| Premiere",Premiere 7 SD http://psrv.io:80/9089247/coreurl.me/18585 #EXTINF:-1 tvg-logo="" group-title="Canais \| Premiere",Premiere 8 SD http://psrv.io:80/9089247/coreurl.me/28064 #EXTINF:-1 tvg-logo="" group-title="Canais \| Premiere",Premiere 9 SD http://psrv.io:80/9089247/coreurl.me/28063 #EXTINF:-1 tvg-logo="http://z4.vc/Jtt" group-title="Canais \| Premiere",Premiere Clubes 4K http://psrv.io:80/9089247/coreurl.me/18438 #EXTINF:-1 tvg-logo="http://z4.vc/A2U" group-title="Canais \| Premiere",Premiere Clubes FHD http://psrv.io:80/9089247/coreurl.me/18766 #EXTINF:-1 tvg-logo="http://z4.vc/Ke5" group-title="Canais \| Premiere",Premiere Clubes FHD [H265] http://psrv.io:80/9089247/coreurl.me/22170 #EXTINF:-1 tvg-logo="http://z4.vc/CQb" group-title="Canais \| Premiere",Premiere Clubes HD http://psrv.io:80/9089247/coreurl.me/18582 #EXTINF:-1 tvg-logo="http://z4.vc/URo" group-title="Canais \| Premiere",Premiere Clubes SD http://psrv.io:80/9089247/coreurl.me/18583 #EXTINF:-1 tvg-logo="http://z4.vc/XRY" group-title="Canais \| Variedades",Prime Box Brazil FHD http://psrv.io:80/9089247/coreurl.me/18804 #EXTINF:-1 tvg-logo="http://z4.vc/tEj" group-title="Canais \| Variedades",Prime Box Brazil FHD [H265] http://psrv.io:80/9089247/coreurl.me/25273 #EXTINF:-1 tvg-logo="http://z4.vc/JY2" group-title="Canais \| Variedades",Prime Box Brazil HD http://psrv.io:80/9089247/coreurl.me/18580 #EXTINF:-1 tvg-logo="http://z4.vc/3WB" group-title="Canais \| Variedades",Prime Box Brazil SD http://psrv.io:80/9089247/coreurl.me/18581 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",PROFIT RO HD http://psrv.io:80/9089247/coreurl.me/28040 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",Realitatea TV http://psrv.io:80/9089247/coreurl.me/28043 #EXTINF:-1 tvg-logo="" group-title="Canais \| 4K",RECORD 4K [TESTE] http://psrv.io:80/9089247/coreurl.me/26182 #EXTINF:-1 tvg-logo="http://z4.vc/PJi" group-title="Canais \| Notícias",Record News FHD http://psrv.io:80/9089247/coreurl.me/18803 #EXTINF:-1 tvg-logo="http://z4.vc/s1i" group-title="Canais \| Notícias",Record News FHD [H265] http://psrv.io:80/9089247/coreurl.me/25204 #EXTINF:-1 tvg-logo="http://z4.vc/Ncd" group-title="Canais \| Notícias",Record News HD http://psrv.io:80/9089247/coreurl.me/18577 #EXTINF:-1 tvg-logo="http://z4.vc/JOU" group-title="Canais \| Notícias",Record News SD http://psrv.io:80/9089247/coreurl.me/18578 #EXTINF:-1 tvg-logo="http://z4.vc/Tv1" group-title="Canais \| Abertos",RecordTV BA HD http://psrv.io:80/9089247/coreurl.me/18496 #EXTINF:-1 tvg-logo="http://z4.vc/oth" group-title="Canais \| Abertos",RecordTV BA SD http://psrv.io:80/9089247/coreurl.me/18495 #EXTINF:-1 tvg-logo="http://z4.vc/mF2" group-title="Canais \| Abertos",RecordTV DF HD http://psrv.io:80/9089247/coreurl.me/18494 #EXTINF:-1 tvg-logo="http://z4.vc/DDa" group-title="Canais \| Abertos",RecordTV DF SD http://psrv.io:80/9089247/coreurl.me/18493 #EXTINF:-1 tvg-logo="http://z4.vc/m2C" group-title="Canais \| Abertos",RecordTV MG HD http://psrv.io:80/9089247/coreurl.me/18501 #EXTINF:-1 tvg-logo="http://z4.vc/xeN" group-title="Canais \| Notícias",RecordTV News SD http://psrv.io:80/9089247/coreurl.me/22216 #EXTINF:-1 tvg-logo="http://z4.vc/Kvw" group-title="Canais \| Abertos",RecordTV PR HD http://psrv.io:80/9089247/coreurl.me/22471 #EXTINF:-1 tvg-logo="http://z4.vc/P7d" group-title="Canais \| Abertos",RecordTV Rio FHD http://psrv.io:80/9089247/coreurl.me/18748 #EXTINF:-1 tvg-logo="http://z4.vc/iZP" group-title="Canais \| Abertos",RecordTV Rio HD http://psrv.io:80/9089247/coreurl.me/18503 #EXTINF:-1 tvg-logo="http://z4.vc/a0f" group-title="Canais \| Abertos",RecordTV Rio SD http://psrv.io:80/9089247/coreurl.me/18502 #EXTINF:-1 tvg-logo="http://z4.vc/IXu" group-title="Canais \| Abertos",RecordTV RS HD http://psrv.io:80/9089247/coreurl.me/18492 #EXTINF:-1 tvg-logo="http://z4.vc/2GL" group-title="Canais \| Abertos",RecordTV RS SD http://psrv.io:80/9089247/coreurl.me/18491 #EXTINF:-1 tvg-logo="http://z4.vc/Kvw" group-title="Canais \| Abertos",RecordTV Sao Jose Rio Preto HD http://psrv.io:80/9089247/coreurl.me/29021 #EXTINF:-1 tvg-logo="http://z4.vc/qPi" group-title="Canais \| Abertos",RecordTV SD http://psrv.io:80/9089247/coreurl.me/22277 #EXTINF:-1 tvg-logo="http://z4.vc/vRV" group-title="Canais \| Abertos",RecordTV Sergipe HD http://psrv.io:80/9089247/coreurl.me/22474 #EXTINF:-1 tvg-logo="http://z4.vc/vUq" group-title="Canais \| Abertos",RecordTV SP FHD http://psrv.io:80/9089247/coreurl.me/18765 #EXTINF:-1 tvg-logo="http://z4.vc/DDD" group-title="Canais \| Abertos",RecordTV SP FHD [H265] http://psrv.io:80/9089247/coreurl.me/25221 #EXTINF:-1 tvg-logo="http://z4.vc/MsE" group-title="Canais \| Abertos",RecordTV SP HD http://psrv.io:80/9089247/coreurl.me/18575 #EXTINF:-1 tvg-logo="http://z4.vc/BKM" group-title="Canais \| Abertos",RecordTV SP SD http://psrv.io:80/9089247/coreurl.me/18579 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",RED BULL TV http://psrv.io:80/9089247/coreurl.me/26426 #EXTINF:-1 tvg-logo="http://z4.vc/RnA" group-title="Canais \| Abertos",Rede Brasil SD http://psrv.io:80/9089247/coreurl.me/18574 #EXTINF:-1 tvg-logo="" group-title="Canais \| Religiosos",Rede Gospel FHD http://psrv.io:80/9089247/coreurl.me/28398 #EXTINF:-1 tvg-logo="http://z4.vc/frB" group-title="Canais \| Religiosos",Rede Vida FHD http://psrv.io:80/9089247/coreurl.me/18750 #EXTINF:-1 tvg-logo="http://z4.vc/ytn" group-title="Canais \| Religiosos",Rede Vida FHD [H265] http://psrv.io:80/9089247/coreurl.me/25272 #EXTINF:-1 tvg-logo="http://z4.vc/rJP" group-title="Canais \| Religiosos",Rede Vida HD http://psrv.io:80/9089247/coreurl.me/18504 #EXTINF:-1 tvg-logo="http://z4.vc/DPy" group-title="Canais \| Religiosos",Rede Vida SD http://psrv.io:80/9089247/coreurl.me/18571 #EXTINF:-1 tvg-logo="http://z4.vc/tkR" group-title="Canais \| Abertos",RedeTV! FHD http://psrv.io:80/9089247/coreurl.me/18751 #EXTINF:-1 tvg-logo="http://z4.vc/heG" group-title="Canais \| Abertos",RedeTV! HD http://psrv.io:80/9089247/coreurl.me/18572 #EXTINF:-1 tvg-logo="http://z4.vc/lHy" group-title="Canais \| Abertos",RedeTV! SD http://psrv.io:80/9089247/coreurl.me/18573 #EXTINF:-1 tvg-logo="http://z4.vc/SKJ" group-title="Canais \| 4K",REDETV! [4K] http://psrv.io:80/9089247/coreurl.me/26183 #EXTINF:-1 tvg-logo="" group-title="Canais \| Religiosos",RIT SD http://psrv.io:80/9089247/coreurl.me/28403 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",RPC PY HD http://psrv.io:80/9089247/coreurl.me/26433 #EXTINF:-1 tvg-logo="http://z4.vc/RXH" group-title="Canais \| Abertos",SBT FHD http://psrv.io:80/9089247/coreurl.me/18764 #EXTINF:-1 tvg-logo="http://z4.vc/kUn" group-title="Canais \| Abertos",SBT FHD [H265] http://psrv.io:80/9089247/coreurl.me/25220 #EXTINF:-1 tvg-logo="http://z4.vc/G2I" group-title="Canais \| Abertos",SBT HD http://psrv.io:80/9089247/coreurl.me/18569 #EXTINF:-1 tvg-logo="http://z4.vc/okI" group-title="Canais \| Abertos",SBT PR SD http://psrv.io:80/9089247/coreurl.me/22470 #EXTINF:-1 tvg-logo="http://z4.vc/oyy" group-title="Canais \| Abertos",SBT RJ HD http://psrv.io:80/9089247/coreurl.me/22458 #EXTINF:-1 tvg-logo="http://z4.vc/MSJ" group-title="Canais \| Abertos",SBT SD http://psrv.io:80/9089247/coreurl.me/18570 #EXTINF:-1 tvg-logo="http://z4.vc/X0C" group-title="Canais \| Abertos",SBT Sergipe HD http://psrv.io:80/9089247/coreurl.me/22473 #EXTINF:-1 tvg-logo="http://z4.vc/Vpq" group-title="Canais \| 4K",SBT [4K] http://psrv.io:80/9089247/coreurl.me/26188 #EXTINF:-1 tvg-logo="" group-title="Canais \| Variedades",Shop Time HD http://psrv.io:80/9089247/coreurl.me/28404 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",SIC PORTUGAL SD http://psrv.io:80/9089247/coreurl.me/26437 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",Sky News UK http://psrv.io:80/9089247/coreurl.me/28157 #EXTINF:-1 tvg-logo="" group-title="Canais \| Documentários",Smithsonian FHD http://psrv.io:80/9089247/coreurl.me/26828 #EXTINF:-1 tvg-logo="" group-title="Canais \| Documentários",Smithsonian FHD [H265] http://psrv.io:80/9089247/coreurl.me/25202 #EXTINF:-1 tvg-logo="http://z4.vc/YP8" group-title="Canais \| Filmes e Séries",Sony FHD http://psrv.io:80/9089247/coreurl.me/18850 #EXTINF:-1 tvg-logo="http://z4.vc/FM8" group-title="Canais \| Filmes e Séries",Sony FHD [H265] http://psrv.io:80/9089247/coreurl.me/25315 #EXTINF:-1 tvg-logo="http://z4.vc/hkn" group-title="Canais \| Filmes e Séries",Sony HD http://psrv.io:80/9089247/coreurl.me/18714 #EXTINF:-1 tvg-logo="http://z4.vc/hkn" group-title="Canais \| Legendados",SONY HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28373 #EXTINF:-1 tvg-logo="http://z4.vc/npa" group-title="Canais \| Filmes e Séries",Sony SD http://psrv.io:80/9089247/coreurl.me/18715 #EXTINF:-1 tvg-logo="http://z4.vc/kaZ" group-title="Canais \| Filmes e Séries",Sony SD http://psrv.io:80/9089247/coreurl.me/22331 #EXTINF:-1 tvg-logo="http://z4.vc/hkn" group-title="Canais \| Legendados",SONY SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28375 #EXTINF:-1 tvg-logo="http://z4.vc/hBI" group-title="Canais \| Filmes e Séries",Space FHD http://psrv.io:80/9089247/coreurl.me/18802 #EXTINF:-1 tvg-logo="http://z4.vc/ao2" group-title="Canais \| Filmes e Séries",Space FHD [H265] http://psrv.io:80/9089247/coreurl.me/22169 #EXTINF:-1 tvg-logo="http://z4.vc/EPt" group-title="Canais \| Filmes e Séries",Space HD http://psrv.io:80/9089247/coreurl.me/18564 #EXTINF:-1 tvg-logo="http://z4.vc/hBI" group-title="Canais \| Legendados",SPACE HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28367 #EXTINF:-1 tvg-logo="http://z4.vc/zXZ" group-title="Canais \| Filmes e Séries",Space SD http://psrv.io:80/9089247/coreurl.me/18565 #EXTINF:-1 tvg-logo="http://z4.vc/hBI" group-title="Canais \| Legendados",SPACE SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28368 #EXTINF:-1 tvg-logo="http://z4.vc/t2m" group-title="Canais \| 4K",SPACE [4K] http://psrv.io:80/9089247/coreurl.me/27131 #EXTINF:-1 tvg-logo="http://z4.vc/Fl2" group-title="Canais \| SporTV",SporTV 2 FHD http://psrv.io:80/9089247/coreurl.me/18763 #EXTINF:-1 tvg-logo="http://z4.vc/JSJ" group-title="Canais \| SporTV",SporTV 2 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22168 #EXTINF:-1 tvg-logo="http://z4.vc/7lY" group-title="Canais \| SporTV",SporTV 2 HD http://psrv.io:80/9089247/coreurl.me/18561 #EXTINF:-1 tvg-logo="http://z4.vc/P0b" group-title="Canais \| SporTV",SporTV 2 SD http://psrv.io:80/9089247/coreurl.me/18562 #EXTINF:-1 tvg-logo="http://z4.vc/dyY" group-title="Canais \| SporTV",SporTV 3 FHD http://psrv.io:80/9089247/coreurl.me/18762 #EXTINF:-1 tvg-logo="http://z4.vc/Ya4" group-title="Canais \| SporTV",SporTV 3 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22167 #EXTINF:-1 tvg-logo="http://z4.vc/PUQ" group-title="Canais \| SporTV",SporTV 3 HD http://psrv.io:80/9089247/coreurl.me/18559 #EXTINF:-1 tvg-logo="http://z4.vc/GGG" group-title="Canais \| SporTV",SporTV 3 SD http://psrv.io:80/9089247/coreurl.me/18560 #EXTINF:-1 tvg-logo="http://z4.vc/y9H" group-title="Canais \| SporTV",SporTV 4K http://psrv.io:80/9089247/coreurl.me/18439 #EXTINF:-1 tvg-logo="http://z4.vc/ftu" group-title="Canais \| SporTV",SporTV FHD http://psrv.io:80/9089247/coreurl.me/18761 #EXTINF:-1 tvg-logo="http://z4.vc/SlI" group-title="Canais \| SporTV",SporTV FHD [H265] http://psrv.io:80/9089247/coreurl.me/22166 #EXTINF:-1 tvg-logo="http://z4.vc/ygd" group-title="Canais \| SporTV",SporTV HD http://psrv.io:80/9089247/coreurl.me/18558 #EXTINF:-1 tvg-logo="http://z4.vc/Ffl" group-title="Canais \| SporTV",SporTV SD http://psrv.io:80/9089247/coreurl.me/18563 #EXTINF:-1 tvg-logo="http://z4.vc/tDf" group-title="Canais \| SporTV",SPORTV [4K] http://psrv.io:80/9089247/coreurl.me/26190 #EXTINF:-1 tvg-logo="http://z4.vc/8f1" group-title="Canais \| Filmes e Séries",Studio Universal FHD http://psrv.io:80/9089247/coreurl.me/18801 #EXTINF:-1 tvg-logo="http://z4.vc/AiX" group-title="Canais \| Filmes e Séries",Studio Universal FHD [H265] http://psrv.io:80/9089247/coreurl.me/22165 #EXTINF:-1 tvg-logo="http://z4.vc/IU1" group-title="Canais \| Filmes e Séries",Studio Universal HD http://psrv.io:80/9089247/coreurl.me/18556 #EXTINF:-1 tvg-logo="http://z4.vc/6ft" group-title="Canais \| Filmes e Séries",Studio Universal SD http://psrv.io:80/9089247/coreurl.me/18557 #EXTINF:-1 tvg-logo="http://z4.vc/7Na" group-title="Canais \| Filmes e Séries",Syfy FHD http://psrv.io:80/9089247/coreurl.me/18800 #EXTINF:-1 tvg-logo="http://z4.vc/j1e" group-title="Canais \| Filmes e Séries",Syfy FHD [H265] http://psrv.io:80/9089247/coreurl.me/22133 #EXTINF:-1 tvg-logo="http://z4.vc/yWZ" group-title="Canais \| Filmes e Séries",Syfy HD http://psrv.io:80/9089247/coreurl.me/18566 #EXTINF:-1 tvg-logo="http://z4.vc/yZB" group-title="Canais \| Filmes e Séries",Syfy SD http://psrv.io:80/9089247/coreurl.me/18567 #EXTINF:-1 tvg-logo="http://z4.vc/RDY" group-title="Canais \| Filmes e Séries",TBS FHD http://psrv.io:80/9089247/coreurl.me/18799 #EXTINF:-1 tvg-logo="http://z4.vc/lAu" group-title="Canais \| Filmes e Séries",TBS FHD [H265] http://psrv.io:80/9089247/coreurl.me/22164 #EXTINF:-1 tvg-logo="http://z4.vc/lL4" group-title="Canais \| Filmes e Séries",TBS HD http://psrv.io:80/9089247/coreurl.me/18554 #EXTINF:-1 tvg-logo="http://z4.vc/6rM" group-title="Canais \| Filmes e Séries",TBS SD http://psrv.io:80/9089247/coreurl.me/18555 #EXTINF:-1 tvg-logo="http://z4.vc/9cn" group-title="Canais \| Filmes e Séries",TCM SD http://psrv.io:80/9089247/coreurl.me/18553 #EXTINF:-1 tvg-logo="http://z4.vc/cyv" group-title="Canais \| Telecine",Telecine Action FHD http://psrv.io:80/9089247/coreurl.me/18760 #EXTINF:-1 tvg-logo="http://z4.vc/bKl" group-title="Canais \| Telecine",Telecine Action FHD [H265] http://psrv.io:80/9089247/coreurl.me/22163 #EXTINF:-1 tvg-logo="http://z4.vc/wYg" group-title="Canais \| Telecine",Telecine Action HD http://psrv.io:80/9089247/coreurl.me/18551 #EXTINF:-1 tvg-logo="http://z4.vc/bKl" group-title="Canais \| Legendados",TELECINE ACTION HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28349 #EXTINF:-1 tvg-logo="http://z4.vc/2ne" group-title="Canais \| Telecine",Telecine Action SD http://psrv.io:80/9089247/coreurl.me/18552 #EXTINF:-1 tvg-logo="http://z4.vc/bKl" group-title="Canais \| Legendados",TELECINE ACTION SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28350 #EXTINF:-1 tvg-logo="http://z4.vc/KyT" group-title="Canais \| Telecine",Telecine Cult FHD http://psrv.io:80/9089247/coreurl.me/18798 #EXTINF:-1 tvg-logo="http://z4.vc/JWO" group-title="Canais \| Telecine",Telecine Cult FHD [H265] http://psrv.io:80/9089247/coreurl.me/22162 #EXTINF:-1 tvg-logo="http://z4.vc/cuv" group-title="Canais \| Telecine",Telecine Cult HD http://psrv.io:80/9089247/coreurl.me/18549 #EXTINF:-1 tvg-logo="http://z4.vc/BeC" group-title="Canais \| Telecine",Telecine Cult SD http://psrv.io:80/9089247/coreurl.me/18550 #EXTINF:-1 tvg-logo="http://z4.vc/d5H" group-title="Canais \| Telecine",Telecine Fun FHD http://psrv.io:80/9089247/coreurl.me/18759 #EXTINF:-1 tvg-logo="http://z4.vc/y6K" group-title="Canais \| Telecine",Telecine Fun FHD [H265] http://psrv.io:80/9089247/coreurl.me/22161 #EXTINF:-1 tvg-logo="http://z4.vc/7vJ" group-title="Canais \| Telecine",Telecine Fun HD http://psrv.io:80/9089247/coreurl.me/18547 #EXTINF:-1 tvg-logo="http://z4.vc/dpl" group-title="Canais \| Legendados",TELECINE FUN HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28351 #EXTINF:-1 tvg-logo="http://z4.vc/dpl" group-title="Canais \| Telecine",Telecine Fun SD http://psrv.io:80/9089247/coreurl.me/18548 #EXTINF:-1 tvg-logo="http://z4.vc/dpl" group-title="Canais \| Legendados",TELECINE FUN SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28352 #EXTINF:-1 tvg-logo="http://z4.vc/Sq4" group-title="Canais \| Telecine",Telecine Pipoca FHD http://psrv.io:80/9089247/coreurl.me/18758 #EXTINF:-1 tvg-logo="http://z4.vc/dl3" group-title="Canais \| Telecine",Telecine Pipoca FHD [H265] http://psrv.io:80/9089247/coreurl.me/22160 #EXTINF:-1 tvg-logo="http://z4.vc/8dT" group-title="Canais \| Telecine",Telecine Pipoca HD http://psrv.io:80/9089247/coreurl.me/18545 #EXTINF:-1 tvg-logo="http://z4.vc/Sq4" group-title="Canais \| Legendados",TELECINE PIPOCA HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28353 #EXTINF:-1 tvg-logo="http://z4.vc/qp8" group-title="Canais \| Telecine",Telecine Pipoca SD http://psrv.io:80/9089247/coreurl.me/18546 #EXTINF:-1 tvg-logo="http://z4.vc/Sq4" group-title="Canais \| Legendados",TELECINE PIPOCA SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28354 #EXTINF:-1 tvg-logo="http://z4.vc/ZYg" group-title="Canais \| Telecine",Telecine Premium FHD http://psrv.io:80/9089247/coreurl.me/18757 #EXTINF:-1 tvg-logo="http://z4.vc/4S2" group-title="Canais \| Telecine",Telecine Premium FHD [H265] http://psrv.io:80/9089247/coreurl.me/22159 #EXTINF:-1 tvg-logo="http://z4.vc/RwJ" group-title="Canais \| Telecine",Telecine Premium HD http://psrv.io:80/9089247/coreurl.me/18543 #EXTINF:-1 tvg-logo="http://z4.vc/ZYg" group-title="Canais \| Legendados",TELECINE PREMIUM HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28355 #EXTINF:-1 tvg-logo="http://z4.vc/jgo" group-title="Canais \| Telecine",Telecine Premium SD http://psrv.io:80/9089247/coreurl.me/18544 #EXTINF:-1 tvg-logo="http://z4.vc/ZYg" group-title="Canais \| Legendados",TELECINE PREMIUM SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28356 #EXTINF:-1 tvg-logo="http://z4.vc/lMo" group-title="Canais \| Telecine",Telecine Touch FHD http://psrv.io:80/9089247/coreurl.me/18756 #EXTINF:-1 tvg-logo="http://z4.vc/OhL" group-title="Canais \| Telecine",Telecine Touch FHD [H265] http://psrv.io:80/9089247/coreurl.me/22158 #EXTINF:-1 tvg-logo="http://z4.vc/jJj" group-title="Canais \| Telecine",Telecine Touch HD http://psrv.io:80/9089247/coreurl.me/18541 #EXTINF:-1 tvg-logo="http://z4.vc/lMo" group-title="Canais \| Legendados",TELECINE TOUCH HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28357 #EXTINF:-1 tvg-logo="http://z4.vc/c1M" group-title="Canais \| Telecine",Telecine Touch SD http://psrv.io:80/9089247/coreurl.me/18542 #EXTINF:-1 tvg-logo="http://z4.vc/lMo" group-title="Canais \| Legendados",TELECINE TOUCH SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28358 #EXTINF:-1 tvg-logo="http://z4.vc/poc" group-title="Canais \| Abertos",Terra Viva SD http://psrv.io:80/9089247/coreurl.me/18540 #EXTINF:-1 tvg-logo="http://z4.vc/a9V" group-title="Canais \| Variedades",TLC FHD http://psrv.io:80/9089247/coreurl.me/18797 #EXTINF:-1 tvg-logo="http://z4.vc/WoP" group-title="Canais \| Variedades",TLC FHD [H265] http://psrv.io:80/9089247/coreurl.me/22128 #EXTINF:-1 tvg-logo="http://z4.vc/fUs" group-title="Canais \| Variedades",TLC HD http://psrv.io:80/9089247/coreurl.me/18538 #EXTINF:-1 tvg-logo="http://z4.vc/r69" group-title="Canais \| Variedades",TLC SD http://psrv.io:80/9089247/coreurl.me/18539 #EXTINF:-1 tvg-logo="http://z4.vc/RrC" group-title="Canais \| Filmes e Séries",TNT FHD http://psrv.io:80/9089247/coreurl.me/18796 #EXTINF:-1 tvg-logo="http://z4.vc/94U" group-title="Canais \| Filmes e Séries",TNT FHD [H265] http://psrv.io:80/9089247/coreurl.me/22157 #EXTINF:-1 tvg-logo="http://z4.vc/C6Y" group-title="Canais \| Filmes e Séries",TNT HD http://psrv.io:80/9089247/coreurl.me/18536 #EXTINF:-1 tvg-logo="http://z4.vc/C6Y" group-title="Canais \| Legendados",TNT HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28359 #EXTINF:-1 tvg-logo="http://z4.vc/VGk" group-title="Canais \| Filmes e Séries",TNT SD http://psrv.io:80/9089247/coreurl.me/18537 #EXTINF:-1 tvg-logo="http://z4.vc/C6Y" group-title="Canais \| Legendados",TNT SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28360 #EXTINF:-1 tvg-logo="http://z4.vc/cM3" group-title="Canais \| Filmes e Séries",TNT Series FHD http://psrv.io:80/9089247/coreurl.me/18795 #EXTINF:-1 tvg-logo="http://z4.vc/KEC" group-title="Canais \| Filmes e Séries",TNT Series FHD [H265] http://psrv.io:80/9089247/coreurl.me/22156 #EXTINF:-1 tvg-logo="http://z4.vc/CVR" group-title="Canais \| Filmes e Séries",TNT Series HD http://psrv.io:80/9089247/coreurl.me/18534 #EXTINF:-1 tvg-logo="http://z4.vc/cM3" group-title="Canais \| Legendados",TNT SERIES HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28369 #EXTINF:-1 tvg-logo="http://z4.vc/gQ3" group-title="Canais \| Filmes e Séries",TNT Series SD http://psrv.io:80/9089247/coreurl.me/18535 #EXTINF:-1 tvg-logo="http://z4.vc/cM3" group-title="Canais \| Legendados",TNT SERIES SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28370 #EXTINF:-1 tvg-logo="http://z4.vc/8Sd" group-title="Canais \| 4K",TNT SERIES [4K] http://psrv.io:80/9089247/coreurl.me/26696 #EXTINF:-1 tvg-logo="http://z4.vc/SDg" group-title="Canais \| 4K",TNT [4K] http://psrv.io:80/9089247/coreurl.me/26186 #EXTINF:-1 tvg-logo="http://z4.vc/7YA" group-title="Canais \| Infantis",Tooncast SD http://psrv.io:80/9089247/coreurl.me/18533 #EXTINF:-1 tvg-logo="" group-title="Canais \| Variedades",Travel Box Brasil FHD [H265] http://psrv.io:80/9089247/coreurl.me/25217 #EXTINF:-1 tvg-logo="http://z4.vc/EYp" group-title="Canais \| Documentários",TruTV FHD http://psrv.io:80/9089247/coreurl.me/18794 #EXTINF:-1 tvg-logo="http://z4.vc/hf1" group-title="Canais \| Documentários",TruTV FHD [H265] http://psrv.io:80/9089247/coreurl.me/25200 #EXTINF:-1 tvg-logo="http://z4.vc/SHx" group-title="Canais \| Documentários",TruTV HD http://psrv.io:80/9089247/coreurl.me/18522 #EXTINF:-1 tvg-logo="http://z4.vc/67c" group-title="Canais \| Documentários",TruTV SD http://psrv.io:80/9089247/coreurl.me/18523 #EXTINF:-1 tvg-logo="http://z4.vc/76t" group-title="Canais \| Globo",TV Anhaguera FHD [H265] http://psrv.io:80/9089247/coreurl.me/22124 #EXTINF:-1 tvg-logo="http://z4.vc/76t" group-title="Canais \| Globo",TV Anhaguera HD http://psrv.io:80/9089247/coreurl.me/28062 #EXTINF:-1 tvg-logo="http://z4.vc/Bti" group-title="Canais \| Abertos",TV Aparecida FHD [H265] http://psrv.io:80/9089247/coreurl.me/25199 #EXTINF:-1 tvg-logo="http://z4.vc/0Eb" group-title="Canais \| Abertos",TV Aparecida SD http://psrv.io:80/9089247/coreurl.me/18530 #EXTINF:-1 tvg-logo="http://z4.vc/XKO" group-title="Canais \| Abertos",Tv Aratu SBT Bahia SD http://psrv.io:80/9089247/coreurl.me/28059 #EXTINF:-1 tvg-logo="http://z4.vc/83l" group-title="Canais \| Abertos",TV Brasil SD http://psrv.io:80/9089247/coreurl.me/18529 #EXTINF:-1 tvg-logo="http://z4.vc/PVk" group-title="Canais \| Abertos",TV Camara SD http://psrv.io:80/9089247/coreurl.me/18528 #EXTINF:-1 tvg-logo="http://z4.vc/MJK" group-title="Canais \| Abertos",TV Cultura FHD http://psrv.io:80/9089247/coreurl.me/18752 #EXTINF:-1 tvg-logo="http://z4.vc/GU9" group-title="Canais \| Abertos",TV Cultura FHD [H265] http://psrv.io:80/9089247/coreurl.me/25198 #EXTINF:-1 tvg-logo="http://z4.vc/BEU" group-title="Canais \| Abertos",TV Cultura HD http://psrv.io:80/9089247/coreurl.me/18505 #EXTINF:-1 tvg-logo="http://z4.vc/7FM" group-title="Canais \| Abertos",TV Cultura SD http://psrv.io:80/9089247/coreurl.me/18506 #EXTINF:-1 tvg-logo="http://z4.vc/AME" group-title="Canais \| Abertos",TV Escola SD http://psrv.io:80/9089247/coreurl.me/18527 #EXTINF:-1 tvg-logo="http://z4.vc/zrm" group-title="Canais \| Abertos",TV Gazeta SP FHD [H265] http://psrv.io:80/9089247/coreurl.me/25197 #EXTINF:-1 tvg-logo="http://z4.vc/ARG" group-title="Canais \| Abertos",TV Gazeta SP HD http://psrv.io:80/9089247/coreurl.me/18526 #EXTINF:-1 tvg-logo="http://z4.vc/VtA" group-title="Canais \| Abertos",TV Justica SD http://psrv.io:80/9089247/coreurl.me/18531 #EXTINF:-1 tvg-logo="" group-title="Canais \| Religiosos",TV Novo Tempo FHD http://psrv.io:80/9089247/coreurl.me/28076 #EXTINF:-1 tvg-logo="" group-title="Canais \| Religiosos",TV Novo Tempo SD http://psrv.io:80/9089247/coreurl.me/28075 #EXTINF:-1 tvg-logo="http://z4.vc/S4M" group-title="Canais \| Infantis",TV Ra-Tim-Bum FHD http://psrv.io:80/9089247/coreurl.me/18793 #EXTINF:-1 tvg-logo="http://z4.vc/I7O" group-title="Canais \| Infantis",TV Ra-Tim-Bum FHD [H265] http://psrv.io:80/9089247/coreurl.me/25256 #EXTINF:-1 tvg-logo="http://z4.vc/0Yb" group-title="Canais \| Infantis",TV Ra-Tim-Bum HD http://psrv.io:80/9089247/coreurl.me/18524 #EXTINF:-1 tvg-logo="http://z4.vc/zvq" group-title="Canais \| Infantis",TV Ra-Tim-Bum SD http://psrv.io:80/9089247/coreurl.me/18525 #EXTINF:-1 tvg-logo="http://z4.vc/HLw" group-title="Canais \| Abertos",TV Senado SD http://psrv.io:80/9089247/coreurl.me/18532 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",TVR 1 [TESTE] http://psrv.io:80/9089247/coreurl.me/27893 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",TVR 2 [TESTE] http://psrv.io:80/9089247/coreurl.me/27894 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",TVR 3 [TESTE] http://psrv.io:80/9089247/coreurl.me/27895 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",TVR CLUJ http://psrv.io:80/9089247/coreurl.me/28047 #EXTINF:-1 tvg-logo="" group-title="Canais \| Abertos",TVR Craiova http://psrv.io:80/9089247/coreurl.me/28048 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",TVR Direct[TESTE] http://psrv.io:80/9089247/coreurl.me/27892 #EXTINF:-1 tvg-logo="" group-title="Canais \| Abertos",TVR IASI http://psrv.io:80/9089247/coreurl.me/28046 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",TVR Moldova [TESTE] http://psrv.io:80/9089247/coreurl.me/27896 #EXTINF:-1 tvg-logo="" group-title="Canais \| Internacionais",TVR Targu Mures http://psrv.io:80/9089247/coreurl.me/28049 #EXTINF:-1 tvg-logo="http://z4.vc/04y" group-title="Canais \| Filmes e Séries",Universal Channel FHD http://psrv.io:80/9089247/coreurl.me/18792 #EXTINF:-1 tvg-logo="http://z4.vc/94M" group-title="Canais \| Filmes e Séries",Universal Channel FHD [H265] http://psrv.io:80/9089247/coreurl.me/22155 #EXTINF:-1 tvg-logo="http://z4.vc/0j9" group-title="Canais \| Filmes e Séries",Universal Channel HD http://psrv.io:80/9089247/coreurl.me/18520 #EXTINF:-1 tvg-logo="http://z4.vc/wGT" group-title="Canais \| Filmes e Séries",Universal Channel SD http://psrv.io:80/9089247/coreurl.me/18521 #EXTINF:-1 tvg-logo="http://z4.vc/HlB" group-title="Canais \| Filmes e Séries",Universal Channel SD http://psrv.io:80/9089247/coreurl.me/22253 #EXTINF:-1 tvg-logo="http://z4.vc/xf5" group-title="Canais \| Variedades",VH1 FHD http://psrv.io:80/9089247/coreurl.me/18791 #EXTINF:-1 tvg-logo="http://z4.vc/InM" group-title="Canais \| Variedades",VH1 FHD [H265] http://psrv.io:80/9089247/coreurl.me/22154 #EXTINF:-1 tvg-logo="http://z4.vc/6fr" group-title="Canais \| Variedades",VH1 HD http://psrv.io:80/9089247/coreurl.me/18518 #EXTINF:-1 tvg-logo="http://z4.vc/Xhe" group-title="Canais \| Variedades",VH1 MegaHits SD http://psrv.io:80/9089247/coreurl.me/18517 #EXTINF:-1 tvg-logo="http://z4.vc/KZh" group-title="Canais \| Variedades",VH1 SD http://psrv.io:80/9089247/coreurl.me/22252 #EXTINF:-1 tvg-logo="http://z4.vc/VCv" group-title="Canais \| Variedades",Viva FHD http://psrv.io:80/9089247/coreurl.me/18755 #EXTINF:-1 tvg-logo="http://z4.vc/6NU" group-title="Canais \| Variedades",Viva FHD [H265] http://psrv.io:80/9089247/coreurl.me/25253 #EXTINF:-1 tvg-logo="http://z4.vc/LVI" group-title="Canais \| Variedades",Viva HD http://psrv.io:80/9089247/coreurl.me/18515 #EXTINF:-1 tvg-logo="http://z4.vc/Pte" group-title="Canais \| Variedades",Viva SD http://psrv.io:80/9089247/coreurl.me/18516 #EXTINF:-1 tvg-logo="http://z4.vc/4dc" group-title="Canais \| Filmes e Séries",Warner Channel FHD http://psrv.io:80/9089247/coreurl.me/18790 #EXTINF:-1 tvg-logo="http://z4.vc/i3M" group-title="Canais \| Filmes e Séries",Warner Channel FHD [H265] http://psrv.io:80/9089247/coreurl.me/22153 #EXTINF:-1 tvg-logo="http://z4.vc/W7o" group-title="Canais \| Filmes e Séries",Warner Channel HD http://psrv.io:80/9089247/coreurl.me/18513 #EXTINF:-1 tvg-logo="http://z4.vc/QRs" group-title="Canais \| Filmes e Séries",Warner Channel SD http://psrv.io:80/9089247/coreurl.me/18514 #EXTINF:-1 tvg-logo="http://z4.vc/W7o" group-title="Canais \| Legendados",WARNER HD [Legendado] http://psrv.io:80/9089247/coreurl.me/28371 #EXTINF:-1 tvg-logo="http://z4.vc/W7o" group-title="Canais \| Legendados",WARNER SD [Legendado] http://psrv.io:80/9089247/coreurl.me/28372 #EXTINF:-1 tvg-logo="http://z4.vc/KZj" group-title="Canais \| Variedades",Woohoo FHD http://psrv.io:80/9089247/coreurl.me/18789 #EXTINF:-1 tvg-logo="http://z4.vc/HQF" group-title="Canais \| Variedades",Woohoo FHD [H265] http://psrv.io:80/9089247/coreurl.me/22127 #EXTINF:-1 tvg-logo="http://z4.vc/6Z3" group-title="Canais \| Variedades",Woohoo HD http://psrv.io:80/9089247/coreurl.me/18511 #EXTINF:-1 tvg-logo="http://z4.vc/fUJ" group-title="Canais \| Variedades",Woohoo SD http://psrv.io:80/9089247/coreurl.me/18512 #EXTINF:-1 tvg-logo="" group-title="Canais \| Infantis",ZooMoo SD http://psrv.io:80/9089247/coreurl.me/28199 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] 3 Palavrinhas http://psrv.io:80/9089247/coreurl.me/19181 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Aladdin http://psrv.io:80/9089247/coreurl.me/28069 #EXTINF:-1 tvg-logo="http://z4.vc/Alu" group-title="Canais \| 24 Horas",[24H] Apenas Um Show http://psrv.io:80/9089247/coreurl.me/27132 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] As aventuras de Jackie Chan http://psrv.io:80/9089247/coreurl.me/24980 #EXTINF:-1 tvg-logo="http://z4.vc/yMm" group-title="Canais \| 24 Horas",[24H] As Meninas Superpoderosas http://psrv.io:80/9089247/coreurl.me/19222 #EXTINF:-1 tvg-logo="http://z4.vc/uKe" group-title="Canais \| 24 Horas",[24H] As Tartarugas Ninjas http://psrv.io:80/9089247/coreurl.me/19221 #EXTINF:-1 tvg-logo="http://z4.vc/7CL" group-title="Canais \| 24 Horas",[24H] Ben 10 http://psrv.io:80/9089247/coreurl.me/19219 #EXTINF:-1 tvg-logo="http://z4.vc/3VU" group-title="Canais \| 24 Horas",[24H] Bob Esponja http://psrv.io:80/9089247/coreurl.me/19220 #EXTINF:-1 tvg-logo="http://z4.vc/Cf6" group-title="Canais \| 24 Horas",[24H] Bob Zoom http://psrv.io:80/9089247/coreurl.me/19223 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Breaking Bag http://psrv.io:80/9089247/coreurl.me/28070 #EXTINF:-1 tvg-logo="http://z4.vc/wdu" group-title="Canais \| 24 Horas",[24H] Caverna do Dragao http://psrv.io:80/9089247/coreurl.me/19216 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Chapolin Colorado http://psrv.io:80/9089247/coreurl.me/28071 #EXTINF:-1 tvg-logo="http://z4.vc/lLk" group-title="Canais \| 24 Horas",[24H] Chaves http://psrv.io:80/9089247/coreurl.me/19218 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Classicos Disney http://psrv.io:80/9089247/coreurl.me/24972 #EXTINF:-1 tvg-logo="http://z4.vc/OIo" group-title="Canais \| 24 Horas",[24H] Coragem - O Cao Covarde http://psrv.io:80/9089247/coreurl.me/19215 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Corrida Maluca http://psrv.io:80/9089247/coreurl.me/24981 #EXTINF:-1 tvg-logo="http://z4.vc/iKx" group-title="Canais \| 24 Horas",[24H] Dennis - O Pimentinha http://psrv.io:80/9089247/coreurl.me/19214 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Desenhos Biblicos http://psrv.io:80/9089247/coreurl.me/28073 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Digimon http://psrv.io:80/9089247/coreurl.me/28200 #EXTINF:-1 tvg-logo="http://z4.vc/AHn" group-title="Canais \| 24 Horas",[24H] Dois Homens e Meio http://psrv.io:80/9089247/coreurl.me/19212 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Doug http://psrv.io:80/9089247/coreurl.me/28201 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] DRAGON BALL http://psrv.io:80/9089247/coreurl.me/28202 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] DRAGON BALL SUPER http://psrv.io:80/9089247/coreurl.me/28203 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Dragon Ball Z http://psrv.io:80/9089247/coreurl.me/19211 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Eu - A Patroa e as Criancas http://psrv.io:80/9089247/coreurl.me/19177 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Família da Pesada http://psrv.io:80/9089247/coreurl.me/24973 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Formiga Atômica http://psrv.io:80/9089247/coreurl.me/24974 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Futurama http://psrv.io:80/9089247/coreurl.me/24975 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Galinha Pintadinha http://psrv.io:80/9089247/coreurl.me/19210 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] He-Man http://psrv.io:80/9089247/coreurl.me/28204 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] HOMEM ARANHA http://psrv.io:80/9089247/coreurl.me/28206 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Homem de Ferro http://psrv.io:80/9089247/coreurl.me/28207 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] HOMEMS DE PRETO http://psrv.io:80/9089247/coreurl.me/28208 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Hércules http://psrv.io:80/9089247/coreurl.me/28205 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Incrível Hulk http://psrv.io:80/9089247/coreurl.me/28209 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Jaspion http://psrv.io:80/9089247/coreurl.me/19205 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Kenan e Kel http://psrv.io:80/9089247/coreurl.me/24982 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Luluzinha http://psrv.io:80/9089247/coreurl.me/24976 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] MegaMan http://psrv.io:80/9089247/coreurl.me/28210 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Mickey e Donald http://psrv.io:80/9089247/coreurl.me/24977 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Naruto http://psrv.io:80/9089247/coreurl.me/19202 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Naruto Shippuden http://psrv.io:80/9089247/coreurl.me/28211 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] O Maskara http://psrv.io:80/9089247/coreurl.me/24983 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Os Cavaleiros do Zodiaco http://psrv.io:80/9089247/coreurl.me/19197 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Os Flintstones http://psrv.io:80/9089247/coreurl.me/19196 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Os Simpsons http://psrv.io:80/9089247/coreurl.me/27897 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Os Trapalhões http://psrv.io:80/9089247/coreurl.me/24978 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Papa-Léguas http://psrv.io:80/9089247/coreurl.me/28212 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Peppa Pig http://psrv.io:80/9089247/coreurl.me/24979 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Pernalonga http://psrv.io:80/9089247/coreurl.me/19194 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Pica-Pau http://psrv.io:80/9089247/coreurl.me/19192 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Pink-e-Cerebro http://psrv.io:80/9089247/coreurl.me/28213 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Scooby Doo http://psrv.io:80/9089247/coreurl.me/19190 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Sobrenatural http://psrv.io:80/9089247/coreurl.me/28214 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] South Park http://psrv.io:80/9089247/coreurl.me/19189 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] The Big Bang Theory http://psrv.io:80/9089247/coreurl.me/24984 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Thundercats http://psrv.io:80/9089247/coreurl.me/19178 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Tico e Teco http://psrv.io:80/9089247/coreurl.me/24985 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Todo Mundo Odeia o Chris http://psrv.io:80/9089247/coreurl.me/19185 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Todo Mundo Odeio o Chris http://psrv.io:80/9089247/coreurl.me/19193 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Tom e Jerry http://psrv.io:80/9089247/coreurl.me/19184 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Um Maluco no Pedaço http://psrv.io:80/9089247/coreurl.me/19183 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] Ursinhos carinhosos e  tom & jerry http://psrv.io:80/9089247/coreurl.me/19182 #EXTINF:-1 tvg-logo="" group-title="Canais \| 24 Horas",[24H] YU-YU-Hakusho http://psrv.io:80/9089247/coreurl.me/28215 #EXTINF:-1 tvg-logo="http://z4.vc/NAx" group-title="Radios",[MG] Alvorada FM - 94.9 FM http://psrv.io:80/9089247/coreurl.me/549 #EXTINF:-1 tvg-logo="http://z4.vc/L0O" group-title="Radios",[MG] Autêntica Favela FM - 106.7 FM http://psrv.io:80/9089247/coreurl.me/556 #EXTINF:-1 tvg-logo="http://z4.vc/kV5" group-title="Radios",[MG] BandNews FM - 89.5 FM http://psrv.io:80/9089247/coreurl.me/547 #EXTINF:-1 tvg-logo="http://z4.vc/voV" group-title="Radios",[MG] BHFM - 102.1 FM http://psrv.io:80/9089247/coreurl.me/552 #EXTINF:-1 tvg-logo="http://z4.vc/8wr" group-title="Radios",[MG] CDL FM - 102.9 FM http://psrv.io:80/9089247/coreurl.me/554 #EXTINF:-1 tvg-logo="http://z4.vc/Iv7" group-title="Radios",[MG] Extra FM - 103.9 FM http://psrv.io:80/9089247/coreurl.me/555 #EXTINF:-1 tvg-logo="http://z4.vc/2So" group-title="Radios",[MG] Jovem Pan FM - 99.1 FM http://psrv.io:80/9089247/coreurl.me/550 #EXTINF:-1 tvg-logo="http://z4.vc/DLD" group-title="Radios",[MG] Rádio Inconfidência - 100.9 FM http://psrv.io:80/9089247/coreurl.me/551 #EXTINF:-1 tvg-logo="http://z4.vc/DbH" group-title="Radios",[MG] Rádio Itatiaia - 95.7 FM http://psrv.io:80/9089247/coreurl.me/553 #EXTINF:-1 tvg-logo="http://z4.vc/Ywv" group-title="Radios",[MG] Transamérica Hits - 88.7 FM http://psrv.io:80/9089247/coreurl.me/546 #EXTINF:-1 tvg-logo="http://z4.vc/Nsr" group-title="Radios",[RJ] Antena 1 - 103.7 FM http://psrv.io:80/9089247/coreurl.me/545 #EXTINF:-1 tvg-logo="http://z4.vc/t2g" group-title="Radios",[RJ] BandNews FM - 90.3 FM http://psrv.io:80/9089247/coreurl.me/536 #EXTINF:-1 tvg-logo="http://z4.vc/XdB" group-title="Radios",[RJ] FM O Dia - 100.5 FM http://psrv.io:80/9089247/coreurl.me/541 #EXTINF:-1 tvg-logo="http://z4.vc/Ho9" group-title="Radios",[RJ] JB FM - 99.9 FM http://psrv.io:80/9089247/coreurl.me/540 #EXTINF:-1 tvg-logo="http://z4.vc/OtB" group-title="Radios",[RJ] Rádio Cidade FM - 102.9 FM http://psrv.io:80/9089247/coreurl.me/544 #EXTINF:-1 tvg-logo="http://z4.vc/Inf" group-title="Radios",[RJ] Rádio Globo - 98.1 FM http://psrv.io:80/9089247/coreurl.me/539 #EXTINF:-1 tvg-logo="http://z4.vc/62Z" group-title="Radios",[RJ] Rádio Mania FM - 91.1 FM http://psrv.io:80/9089247/coreurl.me/535 #EXTINF:-1 tvg-logo="http://z4.vc/xkA" group-title="Radios",[RJ] Rádio Mix FM - 102.1 FM http://psrv.io:80/9089247/coreurl.me/543 #EXTINF:-1 tvg-logo="http://z4.vc/OG2" group-title="Radios",[RJ] SulAmérica Paradiso - 95.7 FM http://psrv.io:80/9089247/coreurl.me/537 #EXTINF:-1 tvg-logo="http://z4.vc/a23" group-title="Radios",[RJ] Super Rádio Tupi - 96.5 FM http://psrv.io:80/9089247/coreurl.me/538 #EXTINF:-1 tvg-logo="http://z4.vc/UQB" group-title="Radios",[RJ] Transamérica - 101.3 FM http://psrv.io:80/9089247/coreurl.me/542 #EXTINF:-1 tvg-logo="http://z4.vc/CnC" group-title="Radios",[RS] 104 FM - 104.1 FM http://psrv.io:80/9089247/coreurl.me/564 #EXTINF:-1 tvg-logo="http://z4.vc/6xW" group-title="Radios",[RS] Continental FM - 98.3 FM http://psrv.io:80/9089247/coreurl.me/561 #EXTINF:-1 tvg-logo="http://z4.vc/xKw" group-title="Radios",[RS] FM Express - 104.9 FM http://psrv.io:80/9089247/coreurl.me/563 #EXTINF:-1 tvg-logo="http://z4.vc/xzb" group-title="Radios",[RS] Jovem Pan FM - 90.7 FM http://psrv.io:80/9089247/coreurl.me/557 #EXTINF:-1 tvg-logo="http://z4.vc/fRO" group-title="Radios",[RS] Rádio Caiçara - 96.7 FM http://psrv.io:80/9089247/coreurl.me/565 #EXTINF:-1 tvg-logo="http://z4.vc/X4I" group-title="Radios",[RS] Rádio Gaúcha - 93.7 FM http://psrv.io:80/9089247/coreurl.me/558 #EXTINF:-1 tvg-logo="http://z4.vc/FAu" group-title="Radios",[RS] Rádio Grenal - 95.9 FM http://psrv.io:80/9089247/coreurl.me/559 #EXTINF:-1 tvg-logo="http://z4.vc/ndK" group-title="Radios",[RS] Rádio Mix FM - 107.1 FM http://psrv.io:80/9089247/coreurl.me/562 #EXTINF:-1 tvg-logo="http://z4.vc/jV2" group-title="Radios",[RS] Rádio Pampa - 97.5 FM http://psrv.io:80/9089247/coreurl.me/560 #EXTINF:-1 tvg-logo="http://z4.vc/ZBD" group-title="Radios",[SP] 89 FM A Rádio Rock - 89.1 FM http://psrv.io:80/9089247/coreurl.me/516 #EXTINF:-1 tvg-logo="http://z4.vc/mLT" group-title="Radios",[SP] Alpha FM - 101.7 FM http://psrv.io:80/9089247/coreurl.me/530 #EXTINF:-1 tvg-logo="http://z4.vc/jgi" group-title="Radios",[SP] Antena 1 - 94.7 FM http://psrv.io:80/9089247/coreurl.me/522 #EXTINF:-1 tvg-logo="http://z4.vc/MAs" group-title="Radios",[SP] Band FM - 96.1 FM http://psrv.io:80/9089247/coreurl.me/524 #EXTINF:-1 tvg-logo="http://z4.vc/mbQ" group-title="Radios",[SP] BandNews FM - 96.9 FM http://psrv.io:80/9089247/coreurl.me/525 #EXTINF:-1 tvg-logo="http://z4.vc/hH9" group-title="Radios",[SP] Energia 97 FM - 97.7 FM http://psrv.io:80/9089247/coreurl.me/526 #EXTINF:-1 tvg-logo="http://z4.vc/XVf" group-title="Radios",[SP] Estilo FM - 92.5 FM http://psrv.io:80/9089247/coreurl.me/521 #EXTINF:-1 tvg-logo="http://z4.vc/QuR" group-title="Radios",[SP] Gazeta FM - 88.1 FM http://psrv.io:80/9089247/coreurl.me/515 #EXTINF:-1 tvg-logo="http://z4.vc/pqm" group-title="Radios",[SP] Jovem Pan FM - 100.9 FM http://psrv.io:80/9089247/coreurl.me/529 #EXTINF:-1 tvg-logo="http://z4.vc/nZz" group-title="Radios",[SP] Kiss FM - 102.1 FM http://psrv.io:80/9089247/coreurl.me/531 #EXTINF:-1 tvg-logo="http://z4.vc/TTz" group-title="Radios",[SP] Metropolitana FM - 98.5 FM http://psrv.io:80/9089247/coreurl.me/527 #EXTINF:-1 tvg-logo="http://z4.vc/PDS" group-title="Radios",[SP] Nativa FM - 95.3 FM http://psrv.io:80/9089247/coreurl.me/523 #EXTINF:-1 tvg-logo="http://z4.vc/dAM" group-title="Radios",[SP] Rádio Bandeirantes - 90.9 FM http://psrv.io:80/9089247/coreurl.me/517 #EXTINF:-1 tvg-logo="http://z4.vc/ISv" group-title="Radios",[SP] Rádio Disney - 91.3 FM http://psrv.io:80/9089247/coreurl.me/518 #EXTINF:-1 tvg-logo="http://z4.vc/5Sg" group-title="Radios",[SP] Rádio Gospel - 90.1 FM http://psrv.io:80/9089247/coreurl.me/566 #EXTINF:-1 tvg-logo="http://z4.vc/YOD" group-title="Radios",[SP] Rádio Mix FM - 106.3 FM http://psrv.io:80/9089247/coreurl.me/533 #EXTINF:-1 tvg-logo="http://z4.vc/Y3s" group-title="Radios",[SP] Rádio Trânsito FM - 92.1 FM http://psrv.io:80/9089247/coreurl.me/567 #EXTINF:-1 tvg-logo="http://z4.vc/wN8" group-title="Radios",[SP] Top FM - 104.1 FM http://psrv.io:80/9089247/coreurl.me/532 #EXTINF:-1 tvg-logo="http://z4.vc/dc6" group-title="Radios",[SP] Transamérica - 100.1 FM http://psrv.io:80/9089247/coreurl.me/528 #EXTINF:-1 tvg-logo="http://z4.vc/tHe" group-title="Radios",[SP] Tropical FM - 107.9 FM http://psrv.io:80/9089247/coreurl.me/534 #EXTINF:-1 tvg-logo="http://z4.vc/4tq" group-title="Canais \| Adultos",[XXX] Blue Hustler http://psrv.io:80/9089247/coreurl.me/27133 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 006 http://psrv.io:80/9089247/coreurl.me/27870 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 011 http://psrv.io:80/9089247/coreurl.me/27137 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 013 http://psrv.io:80/9089247/coreurl.me/22447 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 003 http://psrv.io:80/9089247/coreurl.me/27888 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 010 http://psrv.io:80/9089247/coreurl.me/27138 #EXTINF:-1 tvg-logo="http://z4.vc/vwE" group-title="Canais \| Adultos",[XXX] ADULT 008 http://psrv.io:80/9089247/coreurl.me/27141 #EXTINF:-1 tvg-logo="http://z4.vc/XLG" group-title="Canais \| Adultos",[XXX] ADULT 009 http://psrv.io:80/9089247/coreurl.me/27140 #EXTINF:-1 tvg-logo="http://z4.vc/5lj" group-title="Canais \| Adultos",[XXX] PlayBoy FHD [H265] http://psrv.io:80/9089247/coreurl.me/25274 #EXTINF:-1 tvg-logo="http://z4.vc/Nz4" group-title="Canais \| Adultos",[XXX] PlayBoy HD http://psrv.io:80/9089247/coreurl.me/18787 #EXTINF:-1 tvg-logo="http://z4.vc/0Ad" group-title="Canais \| Adultos",[XXX] PlayBoy HD http://psrv.io:80/9089247/coreurl.me/18487 #EXTINF:-1 tvg-logo="http://z4.vc/XJB" group-title="Canais \| Adultos",[XXX] PlayBoy SD http://psrv.io:80/9089247/coreurl.me/18488 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 001 http://psrv.io:80/9089247/coreurl.me/27890 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] Redlight HD http://psrv.io:80/9089247/coreurl.me/27886 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 002 http://psrv.io:80/9089247/coreurl.me/27889 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 004 http://psrv.io:80/9089247/coreurl.me/27879 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 005 http://psrv.io:80/9089247/coreurl.me/27878 #EXTINF:-1 tvg-logo="http://z4.vc/HoO" group-title="Canais \| Adultos",[XXX] Sextreme SD http://psrv.io:80/9089247/coreurl.me/18486 #EXTINF:-1 tvg-logo="http://z4.vc/vay" group-title="Canais \| Adultos",[XXX] SexyHot FHD http://psrv.io:80/9089247/coreurl.me/25219 #EXTINF:-1 tvg-logo="http://z4.vc/svx" group-title="Canais \| Adultos",[XXX] SexyHot HD http://psrv.io:80/9089247/coreurl.me/18485 #EXTINF:-1 tvg-logo="http://z4.vc/ktw" group-title="Canais \| Adultos",[XXX] SexyHot SD http://psrv.io:80/9089247/coreurl.me/22275 #EXTINF:-1 tvg-logo="http://z4.vc/7Pi" group-title="Canais \| Adultos",[XXX] Venus FHD http://psrv.io:80/9089247/coreurl.me/25215 #EXTINF:-1 tvg-logo="http://z4.vc/azC" group-title="Canais \| Adultos",[XXX] Venus HD http://psrv.io:80/9089247/coreurl.me/18484 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 007 http://psrv.io:80/9089247/coreurl.me/27869 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 012 http://psrv.io:80/9089247/coreurl.me/27134 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] AST TV 1 http://psrv.io:80/9089247/coreurl.me/27887 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] AST TV2 http://psrv.io:80/9089247/coreurl.me/29032 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 013 http://psrv.io:80/9089247/coreurl.me/29377 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] ADULT 015 http://psrv.io:80/9089247/coreurl.me/29378 #EXTINF:-1 tvg-logo="http://z4.vc/4S2" group-title="Canais \| 4K",Telecine Premium [4K] http://psrv.io:80/9089247/coreurl.me/32410 #EXTINF:-1 tvg-logo="http://z4.vc/aZb" group-title="Canais \| Abertos",Globo Inter TV Cabugi SD http://psrv.io:80/9089247/coreurl.me/33380 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] BLUE HUSTLER http://psrv.io:80/9089247/coreurl.me/33381 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] BRAZZERS EUROPE http://psrv.io:80/9089247/coreurl.me/33382 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] CANDY http://psrv.io:80/9089247/coreurl.me/33383 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] CENTOXCENTO http://psrv.io:80/9089247/coreurl.me/33384 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] DORCEL TV http://psrv.io:80/9089247/coreurl.me/33385 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] EROXX http://psrv.io:80/9089247/coreurl.me/33386 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] PASSION http://psrv.io:80/9089247/coreurl.me/33387 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] PENTHOUSE BLACK http://psrv.io:80/9089247/coreurl.me/33388 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] PENTHOUSE QUICKIES http://psrv.io:80/9089247/coreurl.me/33389 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] PINK-O http://psrv.io:80/9089247/coreurl.me/33390 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] PLAYBOY http://psrv.io:80/9089247/coreurl.me/33391 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] PRIVATE HD http://psrv.io:80/9089247/coreurl.me/33392 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] REDLIGHT http://psrv.io:80/9089247/coreurl.me/33393 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] RUSNOCH http://psrv.io:80/9089247/coreurl.me/33394 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] SCT http://psrv.io:80/9089247/coreurl.me/33395 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] SEXT6SENSO http://psrv.io:80/9089247/coreurl.me/33396 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] SEXTREME http://psrv.io:80/9089247/coreurl.me/33397 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] SHALUN TV http://psrv.io:80/9089247/coreurl.me/33398 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] VENUS http://psrv.io:80/9089247/coreurl.me/33399 #EXTINF:-1 tvg-logo="" group-title="Canais \| Adultos",[XXX] VIVID RED http://psrv.io:80/9089247/coreurl.me/33400 |
| [debezium/debezium.github.io](https://github.com/debezium/debezium.github.io) | ⭐ 51 | CSS | Source for the Debezium website. Please log issues at https://github.com/debezium/dbz/issues. |
| [debezium/debezium-platform](https://github.com/debezium/debezium-platform) | ⭐ 46 | TypeScript | An opinionated data-centric view of Debezium components. Please log issues at https://github.com/debezium/dbz/issues. |
| [intentodepirata/api-dragonball](https://github.com/intentodepirata/api-dragonball) | ⭐ 45 | TypeScript | Pas de description |
| [Jaskaranbir/Super-Mario](https://github.com/Jaskaranbir/Super-Mario) | ⭐ 44 | Java | A Super Mario game blended with Dragon Ball Z in java |
| [WistfulHopes/SparkingZERO_ModProject](https://github.com/WistfulHopes/SparkingZERO_ModProject) | ⭐ 41 | C++ | A modding project for Dragon Ball Sparking! ZERO |
| [SamuelOkoroShow/DragonBall](https://github.com/SamuelOkoroShow/DragonBall) | ⭐ 39 | JavaScript | DragonBallZ Game In React Native |
| [magomes-dev/db-api-br](https://github.com/magomes-dev/db-api-br) | ⭐ 39 | JavaScript | API RESTful inspirada na série de televisão Dragon Ball. Uma base de dados colaborativa com as principais informações dos personagens |
| [haideralipunjabi/DBSScouterFont](https://github.com/haideralipunjabi/DBSScouterFont) | ⭐ 32 | N/A | Scouter Language Font as seen in Dragon Ball Super: Broly |
| [debezium/debezium-connector-db2](https://github.com/debezium/debezium-connector-db2) | ⭐ 30 | Java | A Debezium connector for Db2 LUW and z/OS. Please log issues at https://github.com/debezium/dbz/issues. |
| [debezium/debezium-connector-cassandra](https://github.com/debezium/debezium-connector-cassandra) | ⭐ 29 | Java | An incubating Debezium CDC connector for Apache Cassandra. Please log issues at https://github.com/debezium/dbz/issues. |
| [ivanlamega/dragon-ball-online-tw-server](https://github.com/ivanlamega/dragon-ball-online-tw-server) | ⭐ 29 | C++ | Dbo Server |
| [WistfulHopes/RB2](https://github.com/WistfulHopes/RB2) | ⭐ 29 | C++ | Dragon Ball Raging Blast 2 Recompiled |
| [estevaofon/mini-dbz](https://github.com/estevaofon/mini-dbz) | ⭐ 28 | Python | Dragon Ball game written in Python using Pygame |
| [jCodeLife/beauty-and-dragonball](https://github.com/jCodeLife/beauty-and-dragonball) | ⭐ 28 | JavaScript | 美女与龙珠，获掘金游戏创意大赛最佳游戏作品奖第一名 |
| [Mila432/DRAGON-BALL-LEGENDS-Python-Bot](https://github.com/Mila432/DRAGON-BALL-LEGENDS-Python-Bot) | ⭐ 26 | Python | Pas de description |
| [piecioshka/7balls](https://github.com/piecioshka/7balls) | ⭐ 26 | JavaScript | 🎮 Gra webowa oparta na anime "Dragon Ball" |
| [mgarciaisaia/2048dbz](https://github.com/mgarciaisaia/2048dbz) | ⭐ 25 | CSS | 2048 meets Dragon Ball Z |
| [juancondorijara/dbZapateria](https://github.com/juancondorijara/dbZapateria) | ⭐ 25 | N/A | Sistema de Zapatería |
| [acn3to/registration-login-form](https://github.com/acn3to/registration-login-form) | ⭐ 24 | CSS | A responsive HTML, CSS and JavaScript login and registration form page inspired on Dragon Ball Super |
| [Khairul180101/iptv2](https://github.com/Khairul180101/iptv2) | ⭐ 24 | N/A | #EXTM3U  #EXTINF:-1,NET TV http://202.80.222.170/000001/2/ch00000090990000001723/index.m3u8?virtualDomain=000001.live_hls.zte.com #EXTINF:-1,METRO TV HD http://edge.metrotvnews.com:1935/live-edge/smil:metro.smil/playlist.m3u8 #EXTINF:-1,GLOBAL TV http://202.80.222.175/000001/2/ch14041511505498448705/index.m3u8?virtualDomain=000001.live_hls.zte.com #EXTINF:-1,INDOSIAR 1 http://202.80.222.179/000001/2/ch15051810235326945512/index.m3u8?virtualDomain=000001.live_hls.zte.com #EXTINF:-1,Trans TV http://203.153.218.26:9981/stream/channelid/611995608 #EXTINF:-1,Trans 7 http://203.153.218.26:9981/stream/channelid/302821177 #EXTINF:-1, Cadangan TV One http://203.153.218.26:9981/stream/channelid/304965952 #EXTINF:-1,RCTI 1 http://202.80.222.171/000001/2/ch14041511532707866226/index.m3u8?virtualDomain=000001.live_hls.zte.com #EXTINF:-1,MNC TV http://202.80.222.171/000001/2/ch14041511111714365733/index.m3u8?virtualDomain=000001.live_hls.zte.com #EXTINF:-1,RAJAWALI TV http://202.80.222.170/000001/2/ch00000090990000001716/index.m3u8?virtualDomain=000001.live_hls.zte.com #EXTINF:-1,TRANS 7 HD https://video.detik.com/trans7/smil:trans7.smil/playlist.m3u8 #EXTINF:-1,TRANS TV http://202.80.222.174/000001/2/ch14041511552652254306/index.m3u8?virtualDomain=000001.live_hls.zte.com #EXTINF:-1,TV ONE 2 http://202.80.222.182/000001/2/ch14061215030555428637/index.m3u8?virtualDomain=000001.live_hls.zte.com #EXTINF:-1,SCTV 2 http://202.80.222.178/000001/2/ch15010918464887721048/index.m3u8?virtualDomain=000001.live_hls.zte.com #EXTINF:-1,CNN INDONESIA http://live.cnnindonesia.com/livecnn/smil:cnntv.smil/chunklist_b384000_sleng.m3u8 #EXTINF:-1,KOMPAS TV 1 http://202.80.222.182/000001/2/ch000000909990000001730/index.m3u8?virtualDomain=000001.live_hls.zte.com #EXTINF:-1, JARINGAN KARTUN http://161.0.157.9/PLTV/88888888/224/322126843/index.m3u8 #EXTINF:-1, DISNEY JUNIOR http://103.47.132.164/PLTV/888888888/224/322122611/04.m3u8 #EXTINF:-1,FOODIE http://edge.linknetott.swiftserve.com/live/BSgroup/amlst:foodiee/playlist.m3u8 #EXTINF:-1,Disney Junior http://103.47.132.164/PLTV/88888888/224/3221226011/index.m3u8 #EXTINF:-1,Miao Mi http://161.0.157.9:80/PLTV/88888888/224/3221226843/01.m3u8 #EXTINF:-1,DAN SWASTA http://pockettv.xyz/api/zee.m3u8?c=andprivehd #EXTINF:-1,DAN FLIX http://pockettv.xyz/api/zee.m3u8?c=andflixhd #EXTINF:-1,ID EXTREME SEMUT BIRU http://45.126.83.51/dr9445/h/h15/01.m3u8 #EXTINF:-1,HIBURAN Semut Biru http://210.210.155.35/session/2892c0cc-30c4-11e9-af8c-c81f66f89318/dr9445/h/h16/02.m3u8 #EXTINF:-1,HBO HD http://203.207.56.228/live/iptv005.m3u8 #EXTINF:-1,ID JARINGAN TELUR http://vod.linknetott.swiftcontent.com/Content/HLS/Live/Channel(ch319)/02.m3u8 #EXTINF:-1,FOX ID http://vod.linknetott.swiftcontent.com/Content/HLS/Live/Channel(ch328)/02.m3u8 #EXTINF:-1, FOX ACTION MOVIES ID http://vod.linknetott.swiftcontent.com/Content/HLS/Live/Channel(ch312)/02.m3u8 #EXTINF:-1, FOX CRIME HD ID http://edge.linknetott.swiftserve.com/channelgroup2/cg210production/ch329/02.m3u8 #EXTINF:-1, FOX FAMLIY MOVIES ID http://vod.linknetott.swiftcontent.com/Content/HLS/Live/Channel(ch331)/02.m3u8 #EXTINF:-1,FOX LIFE ID http://vod.linknetott.swiftcontent.com/Content/HLS/Live/Channel(ch327)/02.m3u8 #EXTINF:-1, FOX MOVIES ID http://vod.linknetott.swiftcontent.com/Content/HLS/Live/Channel(ch309)/02.m3u8 #EXTINF:-1,ID SEUMUR HIDUP http://vod.linknetott.swiftcontent.com/Content/HLS/Live/Channel(ch155)/02.m3u8 #EXTINF:-1,CINTA ALAM 4K http://vod.linknetott.swiftcontent.com/Content/HLS/Live/Channel(ch368)/Stream(01)/index.m3u8 #EXTINF:-1, FILM BINTANG AR http://livecdnh1.tvanywhere.ae/hls/star_movies/05.m3u8 #EXTINF:-1,STAR WORLD AR http://livecdnh1.tvanywhere.ae/hls/star_world/05.m3u8 #EXTINF:-1, FOX MOVIES PREMIUM http://161.0.157.6/PLTV/88888888/224/3221226321/index.m3u8 #EXTINF:-1,FOX MOVIES COMEDY http://161.0.157.9/PLTV/88888888/224/3221226800/03.m3u8 #EXTINF:-1, Bioskop Premium Fox http://161.0.157.7/PLTV/88888888/224/3221226793/03.m3u8?fluxustv.m3u8 #EXTINF:-1,Film Fox Premium http://161.0.157.6/PLTV/88888888/224/3221226321/index.m3u8?fluxustv.m3u8 #EXTINF:-1, Bioskop Fox http://161.0.157.7:80/PLTV/88888888/224/3221226793/03.m3u8 #EXTINF:-1,Film Fox Premium http://161.0.157.6/PLTV/88888888/224/3221226321/03.m3u8 #EXTINF:-1,Pop https://bcsecurelivehls-i.akamaihd.net/hls/live/505785/5367332899001/master.m3u8 #EXTINF:-1,Movee 4U https://nimble.dashmedia.tv/onestudio/movee4u/playlist.m3u8 #EXTINF:-1,Film Hollywood 3 http://aldirect.hls.huya.com/huyalive/29169025-2686219962-11537226886652362752-2710080226-10057-A-0-1_1200.m3u8 #EXTINF:-1,Film Hollywood 11 http://aldirect.hls.huya.com/huyalive/30765679-2504742278-10757786168918540288-3049003128-10057-A-0-1_1200.m3u8 #EXTINF:-1, FILM HOLLYWOOD 2 http://aldirect.hls.huya.com/huyalive/29169025-2686220018-11537227127170531328-2847699120-10057-A-1524041208-1_1200.m3u8 #EXTINF:-1,JGo http://edge.linknetott.swiftserve.com/live/BSgroup/amlst:jgoch/chunklist_b2288000.m3u8 #EXTINF:-1,Hewan Planet HD http://161.0.157.6/PLTV/88888888/224/3221226253/index.m3u8 #EXTINF:-1, DOKUMEN CGTN https://livedoc.cgtn.com/1000d/prog_index.m3u8 #EXTINF:-1,PILIHAN MUSIK http://edge.music-choice-play-chaina1.top.comcast.net/PlayMetadataInserter/play/chunklist.m3u8 #EXTINF:-1,MUSIK TOP http://live-edge01.telecentro.net.ar/live/smil:musictop.smil/chunklist_w767435128_b2028000_sleng.m3u8 #EXTINF:-1,BOX HITS http://csm-e.tm.yospace.com/csm/extlive/boxplus01,boxhits-desktop.m3u8?yo.up=http%3a%2f%2fboxtv-origin-elb.cds1.yospace.com%2fuploads% 2fboxhits%2f #EXTINF:-1,ONE http://rtmp.one.by:1300 #EXTINF:-1, Hit Music Channel http://hitmusic.hu/hitmusic.m3u8 #EXTINF:-1,ALJAZEERA http://aljazeera-ara-hd-live.hls.adaptive.level3.net/aljazeera/arabic2/index4147.m3u8 #EXTINF:-1,Aljazeera English http://aljazeera-eng-hd-live.hls.adaptive.level3.net/aljazeera/english2/index1296.m3u8 #EXTINF:-1,DW http://dwstream4-lh.akamaihd.net/i/dwstream4_live@131329/index_1_av-b.m3u8?sd=10&rebase;=on #EXTINF:-1,REDBULL TV https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8 #EXTINF:-1, Red Bull TV https://dms.redbull.tv/v3/linear-borb/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXRlZ29yeSI6InBlcnNvbmFsX2NvbXB1dGVyIiwiY291bnRyeV9jb2RlIjoidXMiLCJleHBpcmVzIjoiMjAxNy0wOS0xNlQxNzo0NjowMy45NjM0NjI4NDJaIiwib3NfZmFtaWx5IjoiaHR0cCIsInJlbW90ZV9pcCI6IjEwLjE1Ny4xMTIuMTQ4IiwidWEiOiJNb3ppbGxhLzUuMCAoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAxMF8xMl81KSBBcHBsZVdlYktpdC82MDMuMi40IChLSFRNTCwgbGlrZSBHZWNrbykgVmVyc2lvbi8xMC4xLjEgU2FmYXJpLzYwMy4yLjQiLCJ1aWQiOiJkOGZiZWYzMC0yZDhhLTQwYTUtOGNjNy0wNzgxNGJhMTliNzMifQ.Q_38FNpW3so5yrA5FQt9qBuix3dTulKpb6uQ0dRjrtY/playlist.m3u8 #EXTINF:-1,ESPN 2 http://161.0.157.8/PLTV/88888888/224/3221226881/index.m3u8 #EXTINF:-1, JARINGAN IKAN http://161.0.157.8/PLTV/88888888/224/3221226811/index.m3u8 #EXTINF:-1,FLOW OLAHRAGA http://161.0.157.9/PLTV/88888888/224/322126899/03.m3u8 #EXTINF:-1,FOX SPORT 1 http://45.58.62.92:8080 #EXTINF:-1, JARINGAN MLB http://mllblive-akc.mlb.com/ls01/mlbam/mlb_network/NETWORK_LINEAR_1/MLB_VIDEO_MLBN_FAUX_LINEAR_STREAM_1_MLB_Linear_Stream_Tuesday_20180731_1533025887059/3000K/3000_slide.m3u8 #EXTINF:-1,Fox Sports Racing http://161.0.157.8/PLTV/88888888/224/3221226181/index.m3u8 #EXTINF:-1,Kompas TV http://203.153.218.26:9981/stream/channelid/925992747 #EXTINF:-1,DAAI TV http://e1-hk-1.nim.mivo.tv/daaitv/daaitv2_all/skrz1j8exe/daaitv2_576p/chunks.m3u8 #EXTINF:-1,Akhyar TV http://stream.asianastream.com:1935/live/ngrp:akhyartv_all/playlist.m3u8 #EXTINF:-1,Berita Satu http://edge.linknetott.swiftserve.com/live/BsNew/amlst:beritasatunewsbs/playlist.m3u8 #EXTINF:-1,Berita Satu World http://edge.linknetott.swiftserve.com/live/BsNew/amlst:bsworld/playlist.m3u8 #EXTINF:-1,CNBC Indonesia \| Setel Dekoder ke "Asli" https://live.cnbcindonesia.com/livecnbc/smil:cnbctv.smil/playlist.m3u8 #EXTINF:-1,CNN Indonesia http://live.cnnindonesia.com/livecnn/smil:cnntv.smil/chunklist_w2069650134_b280000_sleng.m3u8 #EXTINF:-1,Channel Indonesia http://202.93.133.3:1935/svr2/tic.com.stream_720p/chunklist_w752720676.m3u8 #EXTINF:-1,J'go http://edge.linknetott.swiftserve.com/live/BSgroup/amlst:jgoch/chunklist.m3u8 #EXTINF:-1,CNN Indonesia https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/playlist.m3u8 #EXTINF:-1,Al Jazeera English http://aljazeera-eng-hd-live.hls.adaptive.level3.net/aljazeera/english2/index.m3u8 #EXTINF:-1,DW TV \| Setel Dekoder ke "Perangkat Lunak" http://dwstream4-lh.akamaihd.net/i/dwstream4_live@131329/index_1_av-b.m3u8 #EXTINF:-1,RT http://210.210.155.35/qwr9ew/s/s23/01.m3u8 #EXTINF:-1,TV5 Monde Asia http://210.210.155.35/qwr9ew/s/s24/01.m3u8 #EXTINF:-1,Real Madrid TV EN http://rmtv24hweblive-lh.akamaihd.net/i/rmtv24hweben_1@300662/index_3_av-b.m3u8 #EXTINF:-1, Arirang http://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8 #EXTINF:-1,Fashion TV Midnight http://fash1043.cloudycdn.services/slive/_definst_/ftv_midnite_secrets_adaptive.smil/chunklist.m3u8 #EXTINF:-1,MTV Asia http://unilivemtveu-lh.akamaihd.net/i/mtvno_1@346424/master.m3u8  #EXTM3U #EXTINF:-1 group-title="SALURAN LOKAL",Animax http://210.210.155.35/session/83bc2526-da69-11e8-881b-c81f66f89318/dr9445/h/h144/index2.m3u8 #EXTINF:-1 group-title="SALURAN LOKAL",Aniplus http://210.210.155.35/session/0d216142-f3f5-11e8-ab67-89df93dc8d44/dr9445/h/h02/01.m3u8 #EXTINF:-1 group-title="LOCAL CHANNEL",Hiburan Semut Biru http://45.126.83.51/dr9445/h/h16/index.m3u8 #EXTINF:-1 group-title="LOCAL CHANNEL",CNN Indonesia HD https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/chunklist_w1285822120_b384000_sleng.m3u8 #EXTINF:-1 group-title="LOCAL CHANNEL",DISNEY JUNIOR INDONESIA http://103.47.132.164/PLTV/888888888/224/322122611/04.m3u8 #EXTINF:-1 group-title="SALURAN LOKAL",Makanan http://edge.linknetott.swiftserve.com/live/BSgroup/amlst:foodiee/playlist.m3u8?fluxustv.m3u8 #EXTINF:-1 group-title="LOCAL CHANNEL",GLOBAL TV HD https://live.rctiplus.id/rctiplus/gtv_720p.m3u8 #EXTINF:-1 group-title="SALURAN LOKAL",GTV https://live.rctiplus.id/rctiplus/gtv_720p.m3u8 #EXTINF:-1 group-title="SALURAN LOKAL",Rumah & Tempat Tinggal http://edge.linknetott.swiftserve.com/live/BSgroup/amlst:homelivinghd/playlist.m3u8 #EXTINF:-1 group-title="LOCAL CHANNEL",INDOSIAR HD http://id1.indostreamingtv.com/live/indosiar/index.m3u8 #EXTINF:-1 group-title="SALURAN LOKAL",iNews Plus https://live.rctiplus.id/rctiplus/inews_720p.m3u8 #EXTINF:-1 group-title="SALURAN LOKAL",J'go http://edge.linknetott.swiftserve.com/live/BSgroup/amlst:jgoch/chunklist_b2288000.m3u8?fluxustv.m3u8 #EXTINF:-1 group-title="SALURAN LOKAL",METRO TV HD http://edge.metrotvnews.com:1935/live-edge/smil:metro.smil/chunklist_w2006790992_b1492000_sleng.m3u8 #EXTINF:-1 group-title="LOCAL CHANNEL",MNC TV Plus https://delivery.macan.live/stream/id_mnctv/index.m3u8?token=nQOcEMQS #EXTINF:-1 group-title="LOCAL CHANNEL",NET TV http://210.210.155.35/qwr9ew/s/s08/01.m3u8 #EXTINF:-1 group-title="SALURAN LOKAL",RCTI FHD https://live.rctiplus.id/rctiplus/rcti_720p.m3u8 #EXTINF:-1 group-title="SALURAN LOKAL",RCTI Plus https://delivery.macan.live/stream/id_rcti/index.m3u8?token=nQOcEMQS #EXTINF:-1 group-title="SALURAN LOKAL",SCTV HD http://id1.indostreamingtv.com/live/sctv/index.m3u8 #EXTINF:-1 group-title="SALURAN LOKAL",SCTV http://210.210.155.35/qwr9ew/s/s103/01.m3u8 #EXTINF:-1 group-title="SALURAN LOKAL",Sony Gem http://210.210.155.35/session/f438f266-7bf0-11e8-b712-b82a72d63267/uq2663/h/h19/index1.m3u8 #EXTINF:-1 group-title="LOCAL CHANNEL",TRANS 7 HD https://video.detik.com/trans7/smil:trans7.smil/chunklist_w140890010_b384000_sleng.m3u8 #EXTINF:-1 group-title="LOCAL CHANNEL",Trans TV FHD http://210.210.155.35/qwr9ew/s/s100/01.m3u8 #EXTINF:-1 group-title="INDIHOME",Planet Hewan http://203.153.218.28:9981/stream/channelid/1943600623?ticket=694FA36A0D756D8572C705243A10521FAF796351&profile=pass #EXTINF:-1 group-title="INDIHOME", Saluran Makanan Asia http://203.153.218.28:9981/stream/channelid/1092664456?ticket=E20984982529618B739BCAB7412D568D65147A93&profile=pass #EXTINF:-1 group-title="INDIHOME",AXN http://203.153.218.28:9981/stream/channelid/882386103?ticket=DF543FFEC6C497F485D61A1907E83292A2DB1741&profile=pass #EXTINF:-1 group-title="INDIHOME",Bloomberg International http://203.153.218.28:9981/stream/channelid/78064174?ticket=4490D953FCAC1483DE94BE2C4D1F241E5319BCD8&profile=pass #EXTINF:-1 group-title="INDIHOME",Semut Biru Ekstrim http://203.153.218.28:9981/stream/channelid/1299824667?ticket=EDA811CE90A26AD414D02B63E0A9171A68A9454C&profile=pass #EXTINF:-1 group-title="INDIHOME",Cinemax http://203.153.218.28:9981/stream/channelid/255605374?ticket=8419D5E6A24EE915F246B23011407540BE9B0E50&profile=pass #EXTINF:-1 group-title="INDIHOME",CNBC International http://203.153.218.28:9981/stream/channelid/1744735983?ticket=07E4904EDFA549D56E57107CB6140923FE593775&profile=pass #EXTINF:-1 group-title="INDIHOME",Discovery Channel http://203.153.218.28:9981/stream/channelid/1151931232?ticket=D05F5F5AB713CBADFBFABB642E4F37D5004BB751&profile=pass #EXTINF:-1 group-title="INDIHOME",Saluran Disney http://203.153.218.28:9981/stream/channelid/31701170?ticket=02DB3A3E44B8E741CC4D2913B2F42F452A2C3AB9&profile=pass #EXTINF:-1 group-title="INDIHOME",Film Keluarga FOX http://203.153.218.28:9981/stream/channelid/1949182550?ticket=07F04FD978CF0D1626AA28A8A68A1182729AC6EE&profile=pass #EXTINF:-1 group-title="INDIHOME",Film Fox http://203.153.218.28:9981/stream/channelid/756717990?ticket=B63A8893B7D332F2F7ACFD3C14E761032035F66E&profile=pass #EXTINF:-1 group-title="INDIHOME",Saluran Sejarah http://203.153.218.28:9981/stream/channelid/1868154562?ticket=21CAD98B63EE6B1D16AFD5B33F7C68F48FA445CD&profile=pass #EXTINF:-1 group-title="INDIHOME",NAT GEO People http://203.153.218.28:9981/stream/channelid/1114683377?ticket=39736C153BA658BB8604E39D479282644E09703E&profile=pass #EXTINF:-1 group-title="INDIHOME",NAT GEO Wild http://203.153.218.28:9981/stream/channelid/1497533758?ticket=36B439E64C5884A941F9938AD9373C4B849363BA&profile=pass #EXTINF:-1 group-title="INDIHOME",National Geographic http://203.153.218.28:9981/stream/channelid/681683355?ticket=B3C34399E8376048D3433529578519E51673EA32&profile=pass #EXTINF:-1 group-title="INDIHOME",Nickelodeon Asia http://203.153.218.28:9981/stream/channelid/648970596?ticket=72A19F89119921817ADF08AEBFF2D7E0009D1A20&profile=pass #EXTINF:-1 group-title="INDIHOME",Setanta Sports http://203.153.218.28:9981/stream/channelid/981299476?ticket=3A4FD3607BE4AAC6DAA7E01E60F3218471B987DD&profile=pass #EXTINF:-1 group-title="INDIHOME",TLC http://203.153.218.28:9981/stream/channelid/391618553?ticket=08323DCACE84958A87EA829F012E919CA861DF74&profile=pass #EXTINF:-1 group-title="INDIHOME",TVRI Sports http://210.210.155.35/session/69e800f6-97c0-11e9-888f-b82a72d63267/qwr9ew/s/s107/01.m3u8 #EXTINF:-1 group-title="MOVIE",DC COMIC TV https://aldirect.hls.huya.com/huyalive/29169025-2686221436-11537233217434157056-2847699210-10057-A-0-1_1200.m3u8 #EXTINF:-1 group-title="MOVIE",DWAYNE JOHNSON TV https://aldirect.hls.huya.com/huyalive/28466698-2689656864-11551988268341919744-2847699194-10057-A-0-1_1200.m3u8 #EXTINF:-1 group-title="MOVIE",Film Pertama http://edge.linknetott.swiftserve.com/live/BSgroup/amlst:jgoch/chunklist_b2288000.m3u8 #EXTINF:-1 group-title="MOVIE",FLIX http://pockettv.xyz/api/zee.m3u8?c=andflixhd #EXTINF:-1 group-title="MOVIE",FOX MOVIES http://203.153.218.28:9981/stream/channelid/756717990?ticket=B39138F5DEF9CCED9C08D27C9766035E330AEBA3&profile=pass #EXTINF:-1 group-title="MOVIE",TEMAN TV http://aldirect.hls.huya.com/huyalive/29169025-2686220018-11537227127170531328-2847699120-10057-A-1524041208-1_1200.m3u8 #EXTINF:-1 group-title="MOVIE",FILM LUCU TV https://aldirect.hls.huya.com/huyalive/30765679-2554414680-1097112751022305280-3048991634-10057-A-0-1_1200.m3u8 #EXTINF:-1 group-title="MOVIE",FILM HOLLYWOOD 1 http://aldirect.hls.huya.com/huyalive/29169025-2686219962-11537226886652362752-2710080226-10057-A-0-1.m3u8 #EXTINF:-1 group-title="MOVIE",FILM HOLLYWOOD 3 http://aldirect.hls.huya.com/huyalive/30765679-2504742278-10757786168918540288-3049003128-10057-A-0-1.m3u8 #EXTINF:-1 group-title="MOVIE",FILM HOROR http://170.178.189.66:1935/live/Stream1/chunklist_w929463259.m3u8 #EXTINF:-1 group-title="MOVIE",FILM HOROR JEPANG https://aldirect.hls.huya.com/huyalive/30765679-2554414808-10971128060778119168-3048959636-10057-A-0-1_1200.m3u8 #EXTINF:-1 group-title="MOVIE",MARVEL SUPERHEROES TV https://aldirect.hls.huya.com/huyalive/30765679-2504742278-10757786168918540288-3049003128-10057-A-0-1_1200.m3u8 #EXTINF:-1 group-title="MOVIE",film MBC 2 http://livecdnh3.tvanywhere.ae/hls/mbc2/05.m3u8 #EXTINF:-1 group-title="MOVIE",film MBC Max http://livecdnh3.tvanywhere.ae/hls/mbcmax/05.m3u8 #EXTINF:-1 group-title="MOVIE",MKC MOVIE 8 http://js.hls.huya.com/huyalive/30765679-2478268764-10644083292078342144-2847699106-10057-A-0-1_1200.m3u8 #EXTINF:-1 group-title="MOVIE",Film 29 http://aldirect.hls.huya.com/huyalive/30765679-2504742278-10757786168918540288-3049003128-10057-A-0-1_1200.m3u8 #EXTINF:-1 group-title="MOVIE",Sky-MoviesDisney http://95.170.215.118:80/hls/m3u8/Sky-MoviesDisney.m3u8 #EXTINF:-1 group-title="MOVIE",Sky-MoviesDrama. http://95.170.215.118:80/hls/m3u8/Sky-MoviesDrama.m3u8 #EXTINF:-1 group-title="MOVIE",Sky-MoviesFamily http://95.170.215.118:80/hls/m3u8/Sky-MoviesFamily.m3u8 #EXTINF:-1 group-title="MOVIE",Sky-MoviesPremie http://95.170.215.118:80/hls/m3u8/Sky-MoviesPremie.m3u8 #EXTINF:-1 group-title="MOVIE",film VH1 http://content-ausc2.uplynk.com/channel/7a16e3d5ffd0413ba4d8ac89688ed7cd/e.m3u8?ct=c&ad.locationDesc=vh1_channel&ad.cust_params=_fw_ae%3D53da17a30bd0d3c946a41c86cb5873f1%26_vmn_ar%3Dtrue&expand=simulcast_standard&ad.kv=_fw_ae%2C53da17a30bd0d3c946a41c86cb5873f1%2C_vmn_ar%2Ctrue% 2C_fw_vcid2%2C82125:vh1_67b04b0c30774b06ad1ec820ee7d0beb&delay=10800&euid=67b04b0c-3077-4b06-ad1e-c820ee7d0beb&exp=1531977295&rn=1284714433&ad.euid=67b04b0c-3077-4b06-ad1e-c820ee7d0beb&cid=7a16e3d5ffd0413ba4d8ac89688ed7cd&tc=1&sig=b3143cb0429574cc3c877de30e62fab7d66c763ec2f61cd9bfde33fdab12dfb7&pbs=62317bc417264eaeb05c22777b5c8697 #EXTINF:-1 group-title="FILM CAMPURAN",12 TAHUN BUDAK http://www.deadlyblogger.com/NewRelease/12slave.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",28 HARI KEMUDIAN http://www.deadlyblogger.com/NewRelease/28days.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",3 HARI UNTUK MEMBUNUH http://www.deadlyblogger.com/NewRelease/3days.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",300 RISE OF AN EMPIRE http://www.deadlyblogger.com/NewRelease/300rise.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",47 RONIN http://www.deadlyblogger.com/NewRelease/47ronin.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",A Haunted HOUSE 2 (COMEDY) http://www.deadlyblogger.com/NewRelease/haunted2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",MALAM DI ROXBURY http://www.deadlyblogger.com/NewRelease/roxbury.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",A.Dog's.Way.Home.2019 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/547.mkv #EXTINF:-1 group-title="FILM CAMPURAN",A.Dog's.Way.Home.2019.720p.BluRay.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/581.mkv #EXTINF:-1 group-title="FILM CAMPURAN",DENGAR http://www.deadlyblogger.com/NewRelease/afflicted2013.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",AFTER EARTH http://www.deadlyblogger.com/NewRelease/after.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Air_Strike.2018.720p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/553.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Aladdin (2019) https://www.googleapis.com/drive/v3/files/1WgX85ihHMCU5lJ-2rO9XqKbCnlvUczY-?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Alexander-DVDRip.AC3-5.1[Eng]2004_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/554.mkv #EXTINF:-1 group-title="FILM CAMPURAN",ALI http://www.deadlyblogger.com/NewRelease/ali1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Alladin 2019 http://ftp.alphamediazone.com/Movies/Hollywood/2019/Aladdin%20%282019%29/Adventures.Of.Aladdin.2019.1080p.BluRay.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Alpha.2018.WEB-DL.x264-FGT http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/556.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Selalu.Jadilah.Saya.Mungkin.2019.720p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/557.mkv #EXTINF:-1 group-title="FILM CAMPURAN",AMERICAN GANGSTER http://www.deadlyblogger.com/NewRelease/agangster.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",AMERICAN HUSTLE http://www.deadlyblogger.com/NewRelease/hustle2013.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",An.Interview.with.God.2018 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/558.mkv #EXTINF:-1 group-title="FILM CAMPURAN",ANCHORMAN 2: LEGENDA BERLANJUT http://www.deadlyblogger.com/NewRelease/anchorman2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",ANCHORMAN THE LEGENDS OF RON BURGUNDY http://www.deadlyblogger.com/NewRelease/anchorman.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Angel Has Fallen (2019) https://www.googleapis.com/drive/v3/files/1e8zI98_BM0K4sVMo9byeInovIqfwLk7F?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Angel Of Mine (2019) https://www.googleapis.com/drive/v3/files/19JVSSekPOaBJhx6uATOHKuadjHVIarV7?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",HEWAN http://www.deadlyblogger.com/NewRelease/animal.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Aquaman.2018 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/559.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Arctic.2019.HC.HDRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/560.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Asteriks.2018.HRSink.720p-BD4YU http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/562.mkv #EXTINF:-1 group-title="FILM CAMPURAN",At.Middleton_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/563.mkv #EXTINF:-1 group-title="FILM CAMPURAN",AUSTIN POWERS http://www.deadlyblogger.com/NewRelease/austin1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",AUSTIN POWERS: THE SPY YANG SHAGGED ME http://www.deadlyblogger.com/NewRelease/austin2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Avengement.2019.720p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/564.mkv #EXTINF:-1 group-title="FILM CAMPURAN",BAD BOYS 2 http://www.deadlyblogger.com/NewRelease/badboys2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",BAD BOYS http://www.deadlyblogger.com/NewRelease/badboys1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",KECUK BURUK http://www.deadlyblogger.com/NewRelease/badgrandpa2013.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",KATA BURUK http://www.deadlyblogger.com/NewRelease/badwords.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Balkanska_medja_(2019) http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/567.mkv #EXTINF:-1 group-title="FILM CAMPURAN",BALLER BLOCKIN http://www.deadlyblogger.com/NewRelease/blockin.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",BATTLE FOR THE PLANET OF THE APES http://www.deadlyblogger.com/NewRelease/apes5.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",BATTLE OF THE YEAR http://www.deadlyblogger.com/NewRelease/battleyear2013.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",BEANEATH PLANET OF THE APES http://www.deadlyblogger.com/NewRelease/apes2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",BELLY http://www.deadlyblogger.com/NewRelease/belly1998.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",BEWITCHED http://www.deadlyblogger.com/NewRelease/bewitched.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Biser.Bojane.2017 (1) http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/568.mkv #EXTINF:-1 group-title="FILM CAMPURAN",BLADE 1 http://www.deadlyblogger.com/NewRelease/blade1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",BLADE 2 http://www.deadlyblogger.com/NewRelease/blade2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",BLADE 3 http://www.deadlyblogger.com/NewRelease/blade3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",BLADES OF GLORY http://www.deadlyblogger.com/NewRelease/glory.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Blockers.2018.BRRip.XviD.MP3-XVID_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/569.mkv #EXTINF:-1 group-title="FILM CAMPURAN",BLOOD IN BLOOD OUT/ VATOS LACOS http://www.deadlyblogger.com/NewRelease/blood.mp4 #EXTINF:-1 group-title="FILM CAMPURAN", PANAS TUBUH http://www.deadlyblogger.com/NewRelease/bodyheat1981.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Book.Club.2018.WEBRip.XviD.MP3-SHITBOX_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/570.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Boy.Erased.2019 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/571.mkv #EXTINF:-1 group-title="FILM CAMPURAN",BOYZ N THE HOOD http://www.deadlyblogger.com/NewRelease/thehood.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Braveheart_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/572.mkv #EXTINF:-1 group-title="FILM CAMPURAN",CABIN BY THE LAKE http://www.deadlyblogger.com/NewRelease/cabin1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Captain Marvel (2019) https://www.googleapis.com/drive/v3/files/1MNn80vn3pITPPnZdVo1ThKZK-Uc6zD6g?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Captain.Marvel.2019.WEB-DL.XviD.MP3-FGT_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/573.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Centurion.2010.BRRip.XviD.AC3.VDON_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/576.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Chimera.Strain.2018.720p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/577.mkv #EXTINF:-1 group-title="FILM CAMPURAN",CINDERELLA (1950) http://www.deadlyblogger.com/NewRelease/cinder1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",TINDAKAN KELAS http://www.deadlyblogger.com/NewRelease/classact.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Cold Pursuit (2019) https://www.googleapis.com/drive/v3/files/1ywvuRRvTjqLDRVuQZ4gXYB6JKoFDSvFs?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Cold.Blood.2019.HDRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/578.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Cold.Pursuit.2019.KORSUB.HDRip.XviD.MP3-STUTTERSHIT_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/579.mkv #EXTINF:-1 group-title="FILM CAMPURAN",COLORS http://www.deadlyblogger.com/NewRelease/colors.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",CONGO 1995 http://www.deadlyblogger.com/NewRelease/congo1995.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",CONQUEST OF THE PLANET OF THE APES http://www.deadlyblogger.com/NewRelease/apes4.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Crawl (2019) https://www.googleapis.com/drive/v3/files/1kdgOD9pM9ZuVV3JoJv2RcsIwbOsdF1sM?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Creed.2.2019.HDRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/584.mkv #EXTINF:-1 group-title="FILM CAMPURAN",CRIMSON http://www.deadlyblogger.com/NewRelease/crimson.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Daddys.Home.2.2017.BRRip.XviD.MP3-XVID_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/585.mkv #EXTINF:-1 group-title="FILM CAMPURAN",PIKIR BERBAHAYA http://www.deadlyblogger.com/NewRelease/minds.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Dark Phoenix (2019) https://hls.kotaksilver.casa/320288/720_867/playlist.m3u8?r=720p #EXTINF:-1 group-title="FILM CAMPURAN",Dark Phoenix (2019) https://www.googleapis.com/drive/v3/files/1zTj0ycEL0PK5f6_61FvOtQrEln6gcgAj?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",PRESIDEN MATI http://www.deadlyblogger.com/NewRelease/deadp.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",DEJA VU http://www.deadlyblogger.com/NewRelease/dejavu.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",DELIVERY MAN http://www.deadlyblogger.com/NewRelease/deliveryman.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Den.of.Thieves.2018.WEB-DL.x264-FGT http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/586.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Destination.Wedding.2018 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/587.mkv #EXTINF:-1 group-title="FILM CAMPURAN",DIRTY DANCING (1987) http://www.deadlyblogger.com/NewRelease/dirtydancing1987.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",DIRTY DANCING HAVANA http://www.deadlyblogger.com/NewRelease/dirtydancing2004.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",DIRTY http://www.deadlyblogger.com/NewRelease/dirty1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Distorted.2018.WEB-DL.x264-FGT http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/589.mkv #EXTINF:-1 group-title="FILM CAMPURAN",DOGMA http://www.deadlyblogger.com/NewRelease/dogma1999.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",JANGAN MENACE http://www.deadlyblogger.com/NewRelease/menace.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",JANGAN KATAKAN IBU THE BABYSITTERS MATI http://www.deadlyblogger.com/NewRelease/babysitter1991.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Dora dan Kota Emas yang Hilang (2019) https://www.googleapis.com/drive/v3/files/1EUDzPiS24mzTflfh0BFtBmkglxZBEYE4?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Dragged.Across.Concrete.2018.WEB-DL.x264-FGT http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/590.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Naga dari shaolin https://www.googleapis.com/drive/v3/files/1YVX-hW0j9Y7EFILo816lyTIJWB1DVpr_?alt=media&key=AIzaSyD739-eb6NzS_KbVJq1K8ZAxnrMfkIqPyw #EXTINF:-1 group-title="FILM CAMPURAN",DUCKTALES: Harta Karun LAMPU YANG HILANG http://www.deadlyblogger.com/NewRelease/ducktales1990.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Dugi.iz.kamenog.doba.2018.HRSink http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/591.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Dumbo (2019) https://www.googleapis.com/drive/v3/files/14Ht-BEjZRCkRYs5QUWpOCiqr3pxU1ff_?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Dumbo.2019.DVDRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/592.mkv #EXTINF:-1 group-title="FILM CAMPURAN", EMPIRE STATE http://www.deadlyblogger.com/NewRelease/empirestate.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",ESCAPE FROM THE PLANET OF THE APES http://www.deadlyblogger.com/NewRelease/apes3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",ESCAPE PLAN http://www.deadlyblogger.com/NewRelease/escapeplan2013.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Escape Plan: The Extractors (2019) https://www.googleapis.com/drive/v3/files/1U3jdRw9AHq6t67SQkt0VHmHXpPbcDdrx?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Escape Room (2019) https://www.googleapis.com/drive/v3/files/1n-869-h12KWqqBP47OgJfiKpMl2Exvzj?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Escape.Plan.The.Extractors.2019.DVDRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/593.mkv #EXTINF:-1 group-title="FILM CAMPURAN",SEMUANYA HARUS BERJALAN http://www.deadlyblogger.com/NewRelease/mustgo.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",FALLEN http://www.deadlyblogger.com/NewRelease/fallen2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Fast & Furious Presents: Hobbs & Shaw (2019) https://www.googleapis.com/drive/v3/files/1prVW0qvmIwq3FON6eVT0Luky2xHqqnuz?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",FAST AND FURIOUS 4 http://www.deadlyblogger.com/NewRelease/fast4.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",FAST AND THE FURIOUS 6 http://www.deadlyblogger.com/NewRelease/fast6.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",FAST FIVE http://www.deadlyblogger.com/NewRelease/fast5.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Father.Figures.2018.HDRip.XviD http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/594.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Final_Score_(2018) http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/595.mkv #EXTINF:-1 group-title="FILM CAMPURAN",MENEMUKAN NEMO http://www.deadlyblogger.com/NewRelease/nemo2003.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Penerbangan http://www.deadlyblogger.com/NewRelease/flight1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",FLUBBER http://www.deadlyblogger.com/NewRelease/flubber.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",FOUR BROTHERS http://www.deadlyblogger.com/NewRelease/fourb.mp4 #EXTINF:-1 group-title="FILM CAMPURAN", JUMAT 1 http://www.deadlyblogger.com/NewRelease/friday1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",JUMAT 2 http://www.deadlyblogger.com/NewRelease/friday2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",JUMAT 3 http://www.deadlyblogger.com/NewRelease/friday3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Gladiator_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/597.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Glass (2019) https://www.googleapis.com/drive/v3/files/16U2boPLu5QvrivOupnFDwZLYIbUhBtCS?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Glass.2019.WEB-DL.x264-FGT http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/598.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Godzilla: King of the Monsters (2019) https://www.googleapis.com/drive/v3/files/1nh3BT7RQFaykkp2FW4_dbRgsiJFD9Ngl?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",GROWN UPS 2 http://www.deadlyblogger.com/NewRelease/grown2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",GROWN UPS http://www.deadlyblogger.com/NewRelease/grown1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",GRUDGE MATCH http://www.deadlyblogger.com/NewRelease/grudgematch.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",HANG OVER 1 http://www.deadlyblogger.com/NewRelease/hangover1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",HANG OVER 2 http://www.deadlyblogger.com/NewRelease/hangover2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",HANG OVER 3 http://www.deadlyblogger.com/NewRelease/hangover3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Selamat Hari Kematian 2U (2019) https://www.googleapis.com/drive/v3/files/133E_ee0J1TZEUpnNoGdsw07Ic2q09rqf?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Hellboy.2019.KORSUB.HDRip.x264-STUTTERSHIT http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/603.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Here.We.Go.Again.2018.HC.HDRip.XviD.AC3-EVO_arc (1) http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/604.mkv #EXTINF:-1 group-title="FILM CAMPURAN",HOOK http://www.deadlyblogger.com/NewRelease/hook1991.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",FUZZ PANAS http://www.deadlyblogger.com/NewRelease/hotfuzz.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",MESIN WAKTU HOT TUB http://www.deadlyblogger.com/NewRelease/hottub2010.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Hotel.Artemis.2018.720p.BluRay.H264.AAC-RARBG (1) http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/606.mkv #EXTINF:-1 group-title="FILM CAMPURAN",How.To.Train.Your.Dragon.The.Hidden.World.2019.1080p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/607.mkv #EXTINF:-1 group-title="FILM CAMPURAN",SAYA LEGENDA http://www.deadlyblogger.com/NewRelease/iaml.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",SAYA ROBOT http://www.deadlyblogger.com/NewRelease/irobot.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",IDENTITAS PENCURI http://www.deadlyblogger.com/NewRelease/identitythief.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",IN TOO DEEP / LL COOL J http://www.deadlyblogger.com/NewRelease/deep1999.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",In.Like.Flynn.2018 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/608.mkv #EXTINF:-1 group-title="FILM CAMPURAN",HARI KEMERDEKAAN http://www.deadlyblogger.com/NewRelease/indep.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",IRON MAN 2 http://www.deadlyblogger.com/NewRelease/ironman2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",IRON MAN 3 http://www.deadlyblogger.com/NewRelease/ironman3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",IRON MAN http://www.deadlyblogger.com/NewRelease/ironman1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Isnt.It.Romantic.2019.720p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/609.mkv #EXTINF:-1 group-title="FILM CAMPURAN",It : Chapter Two (2019) https://www.googleapis.com/drive/v3/files/1tJAuQLVYpoatnRG50C4w3FLncwsuSiwz?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",JACK http://www.deadlyblogger.com/NewRelease/jack1996.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",JACKASS 3D http://www.deadlyblogger.com/NewRelease/jackass3d.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",JAWBREAKER http://www.deadlyblogger.com/NewRelease/jawbreaker.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Parabellum (2019) https://www.googleapis.com/drive/v3/files/17xRQsDX-ddna4Wenjpf-gvvFrb6eIiNW?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",John.Wick.3.2019.HDRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/610.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Johnny.English.Strikes.Again.2018 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/611.mkv #EXTINF:-1 group-title="FILM CAMPURAN",JUICE http://www.deadlyblogger.com/NewRelease/juice.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",JUMANJI http://www.deadlyblogger.com/NewRelease/Jumanji1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Just.Getting.Started.2017.720p.BluRay.H264.AAC-RARBG http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/612.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Juzni.vetar.2018.720p.HDRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/613.mkv #EXTINF:-1 group-title="FILM CAMPURAN",KEVIN HART: LET ME EXPLAIN http://www.deadlyblogger.com/NewRelease/kevin.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",KICK ASS 2 http://www.deadlyblogger.com/NewRelease/kickass2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",KICKING AND SCREAMING http://www.deadlyblogger.com/NewRelease/kicking.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",KILLA MUSIM http://www.deadlyblogger.com/NewRelease/killa1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Killers.Anonymous.2019.720p.WEB-DL.x264-MkvCage.Com http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/615.mkv #EXTINF:-1 group-title="FILM CAMPURAN",MUSIM PEMBUNUHAN http://www.deadlyblogger.com/NewRelease/killings.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",KING OF PAPER CHASIN http://www.deadlyblogger.com/NewRelease/kingpaper.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Kingdom_of_Heaven_2005_Directors_Cut_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/617.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Klip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/618.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Koja_je_ovo_dr http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/619.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Kursk_(2018)_720p_BRrip_DD5.1_x264_by_Wolf http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/620.mkv #EXTINF:-1 group-title="FILM CAMPURAN",TANAH YANG HILANG http://www.deadlyblogger.com/NewRelease/landlost.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",VEGAS TERAKHIR http://www.deadlyblogger.com/NewRelease/lastvegas2013.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",WARGA YANG TETAP HUKUM http://www.deadlyblogger.com/NewRelease/lawcitizen.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",LEGO STAR WARS: THE YODA CHRONICLES http://www.deadlyblogger.com/NewRelease/legoyoda1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Leon_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/621.mkv #EXTINF:-1 group-title="FILM CAMPURAN",LIFE OF BRIAN http://www.deadlyblogger.com/NewRelease/lifebrian.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",LION RAJA http://www.deadlyblogger.com/NewRelease/lionking.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Luis.i.drustvo.iz.svemira.2018.HRSink http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/622.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Mad.Families.2017.WEBRip.x264-FGT http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/623.mkv #EXTINF:-1 group-title="FILM CAMPURAN",MADEA KE PENJARA http://www.deadlyblogger.com/NewRelease/madea1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",REUNI KELUARGA MADEAS http://www.deadlyblogger.com/NewRelease/madea2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",MALEFICENT http://www.deadlyblogger.com/NewRelease/maleficent.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",MALIBU PALING DIINGINKAN http://www.deadlyblogger.com/NewRelease/malibu1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",MAN OF TAI CHI http://www.deadlyblogger.com/NewRelease/tai.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Mary.Poppins.Returns.2018 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/624.mkv #EXTINF:-1 group-title="FILM CAMPURAN",MEET THE BROWNS http://www.deadlyblogger.com/NewRelease/browns1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",MEN IN BLACK 2 http://www.deadlyblogger.com/NewRelease/mnb2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",MEN IN BLACK 3 http://www.deadlyblogger.com/NewRelease/mnb3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",MEN IN BLACK http://www.deadlyblogger.com/NewRelease/mnb1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Men in Black: International (2019) https://www.googleapis.com/drive/v3/files/12oKFZ7Uw5DvTUmERSgFOKfo_zRLFfokr?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Men.in.Black.International.2019 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/625.mkv #EXTINF:-1 group-title="FILM CAMPURAN",MENACE II SOCIETY http://www.deadlyblogger.com/NewRelease/menace2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",mendadak kaya 2019 https://www.googleapis.com/drive/v3/files/1nRipiDiTT0rIvmwFPMJR-2DmeB2rmHXe?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",MONSTERS UNIVERSITY http://www.deadlyblogger.com/NewRelease/monsters2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",MRS DOUBTFIRE http://www.deadlyblogger.com/NewRelease/doubtfire.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Murder.Mystery.2019.720p.WEBRip.x264-[YTS.LT] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/628.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Muskarci.ne.placu.2017.HDTV http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/629.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Nacha 2019 https://www.googleapis.com/drive/v3/files/15Uh1_Rv15OAR9MWcbAbBdGMiCR0ARe8e?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",NAPOLEAN DYNAMITE http://www.deadlyblogger.com/NewRelease/napolean.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",NEED FOR SPEED http://www.deadlyblogger.com/NewRelease/needforspeed.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",NEW JACK CITY http://www.deadlyblogger.com/NewRelease/newjack.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",NEW JERSEY DRIVE http://www.deadlyblogger.com/NewRelease/jerseydrive95.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",NINJA 1 http://www.deadlyblogger.com/NewRelease/3ninja1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",NINJA 2: KICK BACK http://www.deadlyblogger.com/NewRelease/3ninja2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",NINJA 3: KNUCKLE UP http://www.deadlyblogger.com/NewRelease/3ninja3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",NINJA 4: SIANG TINGGI DI GUNUNG MEGA http://www.deadlyblogger.com/NewRelease/3ninja4.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",NON STOP http://www.deadlyblogger.com/NewRelease/nonstop2014.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",SEKARANG ANDA MELIHAT SAYA http://www.deadlyblogger.com/NewRelease/nowyouseeme.mp4 #EXTINF:-1 group-title="FILM KAMPURAN",SEKOLAH TUA http://www.deadlyblogger.com/NewRelease/oldschool1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",OLYMPUS TELAH JATUH http://www.deadlyblogger.com/NewRelease/fallen1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Once.Upon.a.Time.in.Venice.2017 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/630.mkv #EXTINF:-1 group-title="FILM CAMPURAN",HANYA YANG KUAT http://www.deadlyblogger.com/NewRelease/onlys.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Paddleton.2019.WEBRip.XviD-DiNGO[EtMovies]_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/631.mkv #EXTINF:-1 group-title="FILM CAMPURAN",DIBAYAR PENUH http://www.deadlyblogger.com/NewRelease/paidin.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",PET SEMATARI http://www.deadlyblogger.com/NewRelease/sematary1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",PETER PAN http://www.deadlyblogger.com/NewRelease/pan1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",PEY SEMATRY 2 http://www.deadlyblogger.com/NewRelease/sematary2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",PINOCCHIO http://www.deadlyblogger.com/NewRelease/pinco1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Pirates.of.the.Caribbean.Dead.Men.Tell.No.Tales.2017.HDRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/633.mkv #EXTINF:-1 group-title="FILM CAMPURAN",PITCH PERFECT http://www.deadlyblogger.com/NewRelease/pitchperfect.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",PLANET OF THE APES (1968) http://www.deadlyblogger.com/NewRelease/apes1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",PLANET OF THE APES http://www.deadlyblogger.com/NewRelease/apes6.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Polar.2019.HDRip.XviD.AC3-EVO_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/634.mkv #EXTINF:-1 group-title="FILM CAMPURAN",POMPEII http://www.deadlyblogger.com/NewRelease/pompeii2014.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",POOTIE TANG http://www.deadlyblogger.com/NewRelease/pootie.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",PRISONERS http://www.deadlyblogger.com/NewRelease/prisoners.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",PROJECT X http://www.deadlyblogger.com/NewRelease/projectx.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Project.Gutenberg.2018.720p.BluRay.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/635.mkv #EXTINF:-1 group-title="FILM CAMPURAN",PROMETHEUS http://www.deadlyblogger.com/NewRelease/prometheus.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Psi_Umiru_Sami_(2019) http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/637.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Ralph.Breaks.the.Internet.2018.720p.BluRay.H264.AAC-RARBG http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/638.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Rambo-First.Blood.Part.II_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/639.mkv #EXTINF:-1 group-title="FILM CAMPURAN",RATATOUILLE http://www.deadlyblogger.com/NewRelease/ratatouille.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Ready.Player.One.2018.720p.KORSUB.HDRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/643.mkv #EXTINF:-1 group-title="FILM CAMPURAN",PERTOBATAN http://www.deadlyblogger.com/NewRelease/repentance.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",KEMBALI KE KABIN TEPI DANAU http://www.deadlyblogger.com/NewRelease/cabin2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",RIDE ALONG http://www.deadlyblogger.com/NewRelease/ridealong2014.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Ringe.ringe.raja.2018.HRSink.BRRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/644.mkv #EXTINF:-1 group-title="FILM CAMPURAN",RIO 2 http://www.deadlyblogger.com/NewRelease/rio2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",BANGKIT PLANET KERAS http://www.deadlyblogger.com/NewRelease/apes7.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",ROBIN HOOD http://www.deadlyblogger.com/NewRelease/robinhood1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Robin.Hood.2018.720p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/645.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Rocky1_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/646.mkv #EXTINF:-1 group-title="FILM CAMPURAN",ROMPER STOMPER http://www.deadlyblogger.com/NewRelease/romper.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",RUNNER RUNNER http://www.deadlyblogger.com/NewRelease/runnerrunner.mp4 #EXTINF:-1 group-title="FILM CAMPURAN", RUMAH AMAN http://www.deadlyblogger.com/NewRelease/safehouse.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",MENYELAMATKAN BANK MR http://www.deadlyblogger.com/NewRelease/savingbanks.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",SCHOOL DANCE http://www.deadlyblogger.com/NewRelease/schooldance.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Second.Act.2018.720p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/648.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Serenity (2019) https://www.googleapis.com/drive/v3/files/1qkyZuXzRTfHR4H8h8KPJ5UfGcqr6KHEH?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN", TUJUH POUNDS http://www.deadlyblogger.com/NewRelease/sevenp.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",SHAFT http://www.deadlyblogger.com/NewRelease/shaft1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Shaft.2019.720p.WEBRip.x264-[YTS.LT] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/650.mkv #EXTINF:-1 group-title="FILM CAMPURAN", Kuil Shaolin Popeye Berantakan https://www.googleapis.com/drive/v3/files/1bdzpsoLM4zGPUhW9-kuyWSlJY4Ay0Ykp?alt=media&key=AIzaSyD739-eb6NzS_KbVJq1K8ZAxnrMfkIqPyw #EXTINF:-1 group-title="FILM CAMPURAN",Shaolin Popeye https://www.googleapis.com/drive/v3/files/1VEdA4Uby2LxRFR-lof2fkJFQThRWYNCY?alt=media&key=AIzaSyD739-eb6NzS_KbVJq1K8ZAxnrMfkIqPyw #EXTINF:-1 group-title="FILM CAMPURAN",Shazam! (2019) https://www.googleapis.com/drive/v3/files/1MBnom_AElHNne92sM2XMtiHtRQrxpSdB?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",SHOTTAS http://www.deadlyblogger.com/NewRelease/shottas.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Skyscaper.2018.KORSUB.HDRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/651.mkv #EXTINF:-1 group-title="FILM CAMPURAN",SLEEPING BEAUTY http://www.deadlyblogger.com/NewRelease/beauty1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Smrt.u.Sarajevu.2016.TVRip.720p.x264 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/652.mkv #EXTINF:-1 group-title="FILM CAMPURAN",SMURFS 2 http://www.deadlyblogger.com/NewRelease/smurfs2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",TENGAH SELATAN http://www.deadlyblogger.com/NewRelease/southcentral.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Speed.Kills.2018.720p.BluRay.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/654.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Spider-Man: Far from Home (2019) https://www.googleapis.com/drive/v3/files/1zkmVEQuQzdX1vvh118c1NmWVYlYvv7Rr?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",SPRING BREAKERS http://www.deadlyblogger.com/NewRelease/springbreakers.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",STAR WARS IV (HARAPAN BARU) http://www.deadlyblogger.com/NewRelease/starwarsiv.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",STAR WARS V (EMPIRE STRIKES BACK) http://www.deadlyblogger.com/NewRelease/starwarsv.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",STAR WARS VI (RETURN OF THE JEDI) http://www.deadlyblogger.com/NewRelease/starwarsvi.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",State.Of.Play.2009.DvDRip-FxM_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/656.mkv #EXTINF:-1 group-title="FILM CAMPURAN",SAUDARA LANGKAH http://www.deadlyblogger.com/NewRelease/stepbro.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Stopalici.akaSmallfoot.2018.HRsink http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/657.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Stray.2019.720p.WEB-DL.XviD.AC3-FGT http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/658.mkv #EXTINF:-1 group-title="FILM CAMPURAN",STRIKE BACK http://www.deadlyblogger.com/NewRelease/strikeback.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Stuber (2019) https://www.googleapis.com/drive/v3/files/1_uI1TTG6U8G_pezgFkVke1XdmH3xRt5W?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Super.Troopers.2.2018 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/659.mkv #EXTINF:-1 group-title="FILM CAMPURAN",SUPERMAN: MAN OF STEELS http://www.deadlyblogger.com/NewRelease/steel.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Tajni.zivot.macaka.2018.HRsink.VODrip.x264 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/661.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Taksi.Bluz.2019.720p.WEBRip.x264-knight http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/662.mkv #EXTINF:-1 group-title="FILM CAMPURAN",TALLADEGA NIGHTS http://www.deadlyblogger.com/NewRelease/talla.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",TEENAGE MUTANT NINJA TURTLES II http://www.deadlyblogger.com/NewRelease/tmnt2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",TEENAGE MUTANT NINJA TURTLES III http://www.deadlyblogger.com/NewRelease/tmnt3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN", KURA NINJA MUTANT REMAJA http://www.deadlyblogger.com/NewRelease/tmnt1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Tekken 2019 https://www.googleapis.com/drive/v3/files/1tPey9l28vSC4vq1taKx8XbYVvRIZaxOZ?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Terminator Dark Fate 2019 https://www.googleapis.com/drive/v3/files/1gvTE70QEy6c88bTderpjLmysZU6kPTov?alt=media&key=AIzaSyD739-eb6NzS_KbVJq1K8ZAxnrMfkIqPyw #EXTINF:-1 group-title="FILM CAMPURAN",SPIDERMAN YANG LUAR BIASA 2 http://www.deadlyblogger.com/NewRelease/amasin2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE BLING RING http://www.deadlyblogger.com/NewRelease/blingring.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE BONDOCK SAINTS http://www.deadlyblogger.com/NewRelease/saints1999.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE BONE COLLECTOR http://www.deadlyblogger.com/NewRelease/thebone1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",IDENTITAS BOURNE http://www.deadlyblogger.com/NewRelease/bourne1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",Warisan BOURNE http://www.deadlyblogger.com/NewRelease/bourne4.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE BOURNE SUPREMACY http://www.deadlyblogger.com/NewRelease/bourne2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE BOURNE ULTIMATUM http://www.deadlyblogger.com/NewRelease/bourne3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE CALL http://www.deadlyblogger.com/NewRelease/thecall.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE AFTER TOMORROW http://www.deadlyblogger.com/NewRelease/theday2004.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE FAST AND THE FURIOUS 2 http://www.deadlyblogger.com/NewRelease/fast2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE FAST AND THE FURIOUS 3:TOKYO DRIFT http://www.deadlyblogger.com/NewRelease/fast3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE FAST AND THE FURIOUS http://www.deadlyblogger.com/NewRelease/fast1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE FOX & THE HOUND http://www.deadlyblogger.com/NewRelease/thefox.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE GADIS DENGAN TATO NAGA http://www.deadlyblogger.com/NewRelease/dragontattoo.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE GODFATHER 1 http://www.deadlyblogger.com/NewRelease/godfather1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE GODFATHER 2 http://www.deadlyblogger.com/NewRelease/godfather2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE GODFATHER 3 http://www.deadlyblogger.com/NewRelease/godfather3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE GOONIES http://www.deadlyblogger.com/NewRelease/thegoonies.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE GRANDMASTERS http://www.deadlyblogger.com/NewRelease/grandmaster.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE GREY http://www.deadlyblogger.com/NewRelease/grey.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE PANAS http://www.deadlyblogger.com/NewRelease/theheat.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE HITLIST http://www.deadlyblogger.com/NewRelease/hitlist.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE HOBBIT AN PERJALANAN YANG TAK TERDUGA http://www.deadlyblogger.com/NewRelease/hobbit1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE HOUSE BUNNY http://www.deadlyblogger.com/NewRelease/housebunny2014.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE HUNGER GAMES http://www.deadlyblogger.com/NewRelease/hungergame1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE HUNGER GAMES: CATCHING FIRE http://www.deadlyblogger.com/NewRelease/hungergames2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE INTERNSHIP http://www.deadlyblogger.com/NewRelease/internship2013.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",BUKU HUTAN KEMBALI KE HUTAN http://www.deadlyblogger.com/NewRelease/junglebook2013.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE KICK http://www.deadlyblogger.com/NewRelease/thekick.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",NAGA TERAKHIR http://www.deadlyblogger.com/NewRelease/lastdragon.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",FILM LEGO http://www.deadlyblogger.com/NewRelease/legomovie2014.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",The Lion King (2019) https://www.googleapis.com/drive/v3/files/11F40OKK5EB5OuchUefj4xWmyOaKDUDU4?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",THE LITTLE MERMAID http://www.deadlyblogger.com/NewRelease/mermaid1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",TUHAN CINCIN:2 MENARA http://www.deadlyblogger.com/NewRelease/twotowers.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",TUHAN CINCIN:PERSAHABATAN CINCIN http://www.deadlyblogger.com/NewRelease/fellowship1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",TUHAN CINCIN:KEMBALINYA RAJA http://www.deadlyblogger.com/NewRelease/returnking1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE MATRIX RELOADED http://www.deadlyblogger.com/NewRelease/matrix2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",REVOLUSI MATRIKS http://www.deadlyblogger.com/NewRelease/matrix3.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE MATRIX http://www.deadlyblogger.com/NewRelease/matrix1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE MIGHTY DUCKS 1 http://www.deadlyblogger.com/NewRelease/mighty1.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",THE MIGHTY DUCKS 2 http://www.deadlyblogger.com/NewRelease/mighty2.mp4 #EXTINF:-1 group-title="FILM CAMPURAN",The Secret Life Of Pets 2 (2019) https://www.googleapis.com/drive/v3/files/1Z3GvO-bjAtFLp0-FNIm7AAXGDmCFrH4B?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",The.Beach.Bum.2019.720p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/664.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Circus.1928.1080p.BluRay.x264-AVCHD http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/665.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Equalizer.2.2018.WEB-DL.x264-FGT http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/666.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Gangster.The.Cop.The.Devil.2019.720p.HDRip.x264.MkvCage.Com http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/667.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Godfather3_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/668.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Grinch.2018.WEB-DL.x264-FGT http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/669.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Last.Samuri.2003.720p.BrRip.x264.YIFY http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/670.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Lego.Movie.2.The.Second.Part.2019.BRIP.XviD.MP3-XVID_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/671.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Man.Who.Killed.Hitler.and.then.the.Bigfoot.2018.WEB-DL.XviD.MP3-FGT_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/672.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Mule.2018.WEB-DL.XviD.MP3-FGT_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/673.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.New.World.2005.EXTENDED.Bluray.1080p.x264.YIFY http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/674.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Patriot.Extended.Cut.2000.1080p.BrRip.x264.YIFY http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/676.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Professor.and.the.Madman.2019.WEB-DL.XviD.MP3-FGT_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/677.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Secret.Life.Of.Pets.2.2019 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/678.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The.Vice.2018.DVDScr.Xvid.AC3.HQ.Hive-CM8[EtMovies]_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/679.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The_Bridges_Of_Madison_County_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/680.mkv #EXTINF:-1 group-title="FILM CAMPURAN",THE_GODFATHER_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/660.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The_Godfather2_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/681.mkv #EXTINF:-1 group-title="FILM CAMPURAN",The_Old.Man.and.the.Gun.2018.HDRip http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/682.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Toy Story 4 (2019) https://www.googleapis.com/drive/v3/files/1eaoV7-AFtYty0XdD-e5SKUb8BhzWXfdf?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Triple Threat (2019) https://www.googleapis.com/drive/v3/files/1fJjMts-0XKNL9eJpRrBvRYaZbI7NmpEQ?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="FILM CAMPURAN",Triple.Frontier.2019.720p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/683.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Triple.Threat.2019.720p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/684.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Two.Much_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/685.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Uncle.Drew.2018 http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/687.mkv #EXTINF:-1 group-title="FILM CAMPURAN",Vrapcic.Ricard.2017.HRSink http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/688.mkv #EXTINF:-1 group-title="FILM CAMPURAN",We.Die.Young.2019.720p.WEBRip.x264-[YTS.AM] http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/689.mkv #EXTINF:-1 group-title="FILM CAMPURAN",We.Were.Soldiers.2002_arc http://tv.fast-iptv.info:12974/movie/vQCsltW5Ie/PnSVtgXTKV/690.mkv #EXTINF:-1 group-title="FILM VOD INDIA",Dhoom 3 (2013) https://www.googleapis.com/drive/v3/files/1y9QVcmJhsptYYPRflP0P0S3NRrq1-r1y/?key=AIzaSyB-D6vioiPSsVHPsBq3n6OijuskJvuWSUM&alt=media #EXTINF:-1 group-title="WARKOP DKI",Yayasan Zumrotul Huda - Depok https://www.googleapis.com/drive/v3/files/17SUqVpVY10yjO9IvhogvwMqx8tMSeJQl/?key=AIzaSyB-D6vioiPSsVHPsBq3n6OijuskJvuWSUM&alt=media #EXTINF:-1 group-title="WARKOP DKI",Gantian Dong (1985) http://srv29.nf21.net/files/15-2019-10-09-9e09061a2b64e714ba164bcd19d42a34.mp4 #EXTINF:-1 group-title="WARKOP DKI",Itu Bisa Diatur (1984) http://srv29.nf21.net/files/15-2019-10-09-14bea8bdae274c3a922f7d29c58d8d73.mp4 #EXTINF:-1 group-title="WARKOP DKI",Kesempatan Dalam Kesempitan (1985) http://srv29.nf21.net/files/15-2019-10-09-38faca9819e03a23f4667e72a9412629.mp4 #EXTINF:-1 group-title="WARKOP DKI",Maju Kena Mundur Kena (1983) http://srv29.nf21.net/files/15-2019-10-09-3659d298fa9b29e16db0339cb997ac95.mp4 #EXTINF:-1 group-title="WARKOP DKI",Malu Malu Mau (1988) https://www.googleapis.com/drive/v3/files/1ucAdEKLCcv72iFcGOm75Kfc9Rh-ezgM4?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="WARKOP DKI",Pencet Sana Pencet Sini (1994) https://www.googleapis.com/drive/v3/files/1ufNonpnbX0W9hGgUqi0yjsvjR9_xW5o-?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="WARKOP DKI",Pintar Pintar Bodoh (1980) http://srv29.nf21.net/files/15-2019-10-09-8e76b24e377fc2f92fa285524b10d6b1.mp4 #EXTINF:-1 group-title="WARKOP DKI",Salah Masuk (1992) https://www.googleapis.com/drive/v3/files/125TSKmh9nMTIeCi6PjhzbY7T1-Yt_uJW?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="WARKOP DKI",Saya Duluan Dong (1994) https://www.googleapis.com/drive/v3/files/1130zWl2kPSacGNfAZ5nzjpyCi8gxTbOm?alt=media&key=AIzaSyDrQ86QJRiJlyPcLFYdxT22_oC2H1verR4 #EXTINF:-1 group-title="WARKOP DKI",Tahu Diri Dong (1984) http://srv29.nf21.net/files/15-2019-10-09-5800651e161619b8165734c584181e76.mp4 |
| [kontroldev/Proyecto-Dragon-ball-Swift](https://github.com/kontroldev/Proyecto-Dragon-ball-Swift) | ⭐ 23 | Swift | Pas de description |
| [gprem09/dbz](https://github.com/gprem09/dbz) | ⭐ 21 | Python | Pas de description |
| [jaimegc/DragonBallModularization](https://github.com/jaimegc/DragonBallModularization) | ⭐ 20 | Kotlin | DragonBall Modularization is a sample Android application focused on how to architect/configure a multi-module project. |
| [lordzzz777/Dragon-Ball-Wiki](https://github.com/lordzzz777/Dragon-Ball-Wiki) | ⭐ 20 | Swift | Pas de description |
| [nitzano/dbzar](https://github.com/nitzano/dbzar) | ⭐ 18 | TypeScript | 🔁👻 Agnostic DB Anonymizer  |
| [eiberham/dragonball](https://github.com/eiberham/dragonball) | ⭐ 18 | JavaScript | :dragon: Dragon ball REST API |
| [Daniel-Griffiths/dbfz-mod-manager](https://github.com/Daniel-Griffiths/dbfz-mod-manager) | ⭐ 18 | C# | A mod manager for Dragon Ball FighterZ |
| [romulogarofalo/Dragon-Ball-API](https://github.com/romulogarofalo/Dragon-Ball-API) | ⭐ 17 | Python | Pas de description |
| [Lythom/capsule](https://github.com/Lythom/capsule) | ⭐ 17 | Java | A minecraft mod : Bring your base! Capsules can capture a region containing any blocks or machines, then deploy and undeploy at will. Inspired by Dragon Ball capsules. |
| [debezium/debezium-connector-spanner](https://github.com/debezium/debezium-connector-spanner) | ⭐ 16 | Java | An incubating Debezium CDC connector for Google Spanner. Please log issues at https://github.com/debezium/dbz/issues. |
| [GodkuHacking/DragonBallLegends](https://github.com/GodkuHacking/DragonBallLegends) | ⭐ 16 | Python | A Complete decompile dump of the mobile game Dragon Ball Legends. and python mods! |
| [andrewbaisden/dragonball-character-database](https://github.com/andrewbaisden/dragonball-character-database) | ⭐ 16 | JavaScript | A database of characters from the Dragonball Universe |
| [fcard/dbzlegacyofwolves](https://github.com/fcard/dbzlegacyofwolves) | ⭐ 15 | Assembly | Hack of Dragon Ball Z: Legacy of Goku that aims to balance its difficulty, fix bugs and improve its flow. |
| [losttox/dragon-ball-java-game](https://github.com/losttox/dragon-ball-java-game) | ⭐ 15 | Java | A Java console-based Dragon Ball fighting game using OOP |
| [JorgeCastilloPrz/ShenronAPI](https://github.com/JorgeCastilloPrz/ShenronAPI) | ⭐ 15 | Scala | Dragon Ball character rest API written in Scala using Play framework |
| [mrsaxmannjr/DragonBallFighterZ-guide-FrontEnd](https://github.com/mrsaxmannjr/DragonBallFighterZ-guide-FrontEnd) | ⭐ 15 | HTML | A companion app for the upcoming videogame Dragon Ball FighterZ. Welcome to the one-stop-shop for all your Dragon Ball FighterZ needs! Here you can find details on how to play, the different control schemes, character stats and move-sets, create a custom team and more! |
| [nicconicco/Arch-DBZ](https://github.com/nicconicco/Arch-DBZ) | ⭐ 14 | Kotlin | In this repo, I will show implementations of differents architecture in the Android Nativo World, like MVC, MVP, MVVM, Clean, MVI. |
| [adsl14/Raging-tools](https://github.com/adsl14/Raging-tools) | ⭐ 14 | Python | This tool will help you in order to edit the games Dragon Ball Raging Blast, Dragon Ball Raging Blast 2 and Dragon Ball Z Ultimate Tenkaichi. |
| [Sandreke/pygame-dragon-ball](https://github.com/Sandreke/pygame-dragon-ball) | ⭐ 14 | Python | Este proyecto consiste en crear un juego de ataque usando PyGame basado en Dragon Ball como homenaje a Akira Toriyama. |
| [chechiachang/scouter](https://github.com/chechiachang/scouter) | ⭐ 14 | C# | Get github contribution with a face detection app. Dragon ball fantasy! |
| [arora-r/Dragon-Ball-Z-Character-Models](https://github.com/arora-r/Dragon-Ball-Z-Character-Models) | ⭐ 14 | N/A | This repository contains 3D models for an extensive amount of Dragon Ball Z and GT characters. |
| [FredericoBender/Game_Dragonball_Vs_Naruto](https://github.com/FredericoBender/Game_Dragonball_Vs_Naruto) | ⭐ 14 | Python | Jogo de desenvolvi sozinho no ano de 2017 para disciplina de "Algoritmos" no curso de Eng. de Computação |
| [shubham14p3/JS-Shooter-Game](https://github.com/shubham14p3/JS-Shooter-Game) | ⭐ 12 | JavaScript | DBZ Shooter 2D Game made with Javascript, Phaser 3 much more. |
| [mujeebxp/king-Tools.sh](https://github.com/mujeebxp/king-Tools.sh) | ⭐ 12 | N/A | z=" ";XLz='Wifi';MIz='webs';EOz='Crun';nRz='┴  ┴';YRz=' ┬  ';hWz=' '\''↓↓';GRz='tu';WEz='o Ho';FFz=''\''╚╩╝';hNz='/sma';tIz='Brea';hQz='┴'\''';MHz='mapp';BGz=' Exp';xOz='Inst';EWz='ame:';LBz='Vers';hRz='┌┼─ ';gPz='k}'\'' ';iHz='-O h';wMz='cd G';fVz=' ╦╔═';oFz='trik';XFz='nder';tLz='/0x9';mIz='rike';GOz=' wor';DHz='}'\'' $';YLz='te}'\''';ZBz='_  _';ZIz='l';LPz='ss =';LVz='ll P';PUz=' '\''Fi';HKz='ckin';eSz='chop';dSz='/tom';mWz='m: K';CVz='l}'\'' ';WRz=' ter';xWz='6393';ZHz='pyth';lWz='agra';HVz=''\''Fin';Xz='ow='\''';WKz='-it/';RPz='dana';sTz='-Scr';IFz='╩ ╩┴';ZUz='et}'\''';qUz='w3m ';LKz='Info';hOz='┴ ┴└';VVz='ET.g';bFz='loit';PFz='WPSe';XMz='t-sh';pQz=' roo';lKz=' ╩┴ ';QBz=''\''   ';GPz='an'\''';eGz=']';ez='low ';gJz='ass-';FCz='[1] ';sBz='__ \|';qOz=' Bru';ETz='ng'\''';uRz='─└─┘';WWz='ia/S';cJz='webd';fz=''\''[>>';pz='iNg-';DGz=' Nma';ZFz='ap'\''';BWz='═╝'\''';iUz='y}'\'' ';jNz='ode-';vGz='/oma';dHz=' ins';DUz='/IP-';HFz='─┘  ';tEz='┌─┐┌';KUz='ng-A';MOz='ls';DQz='ity/';NOz='ch}'\''';gUz='ruby';GDz='ne =';NXz=''\''<==';PXz='en'\'' ';XKz='aclp';WFz='0xFi';qKz='Atta';XGz='hois';ZSz='akec';mBz='/'\''';rIz='/XSS';LWz=' KIN';WBz='_ __';XBz='__ _';AUz='ux';gz='>>>>';QWz='ge: ';rOz='Hydr';MUz='7 ]';lIz='XSSt';yGz='/Inj';EJz='= 15';bCz='ot'\''';YGz=' web';VKz='/fox';tz='  ]'\''';BVz='{cur';IMz='├─┤ ';OOz='/KUR';HWz='lmuf';mRz=''\''╚═╝';eNz='tor}';hSz='┌┬┐┬';qGz=' cle';mCz='ut T';GCz='DDOS';aLz=' -y';bPz='ter}';XJz='VHxX';gTz='othe';uJz='= 17';wTz='kti/';Rz='cyan';GKz='g-ha';dNz='0/t-';kRz='┘│ │';fNz='/raz';RXz='ood ';qPz='zer';QTz='ermu';oz='y: K';ANz='d 77';GGz=' VJS';KXz='er A';NBz=' 0.2';WQz=' ││ ';ULz='rspl';YSz='12/f';mDz='bash';xUz=' w3m';jGz='it';hPz='/avr';wVz=' ╩╩ ';BUz='5 ]';aHz='on2';pOz='book';XUz='hon}';oRz=' ┴┴ ';AHz='eCto';nMz='splo';BTz=' Net';TBz='<]'\''';TVz='ng67';MSz='s = ';EHz='n';lUz='{php';jWz='↓ ↓↓';LHz='/sql';xLz='s.gi';DRz='/ter';QDz=''\''═╩╝';nHz='ubus';oCz='rogr';PDz=' ║╚═';YEz='m';hCz='[9] ';hFz=' Xsh';BXz=': Ki';xJz='o2l7';lMz='payl';LCz='WIFI';BBz='ow'\'' ';DXz='ng.S';RGz=' Act';FBz='T.me';lOz=' ╩ ┴';GUz='6 ]';GHz='bdul';sLz='pts}';bWz='ramm';JNz='hack';BSz='Fake';nCz='he P';dKz='┬┌─'\''';ADz='mber';hz='>]'\''';tSz=' ┴ ┴';rVz='║║║║';Sz='6m'\''';aKz='┬  ╦';WUz='{pyt';DNz=' set';EEz='een';sMz='sh/G';yz='Hack';CQz='ecur';UMz='TXTo';UCz='[6] ';dPz='h-Bu';XRz='─┐  ';hHz=' -k ';PJz=' req';nQz='Fedo';yIz='an}'\''';EBz='am: ';IEz='e ht';YHz='all ';fCz='& Vi';KPz=' pas';FUz='tor.';xQz='o';HIz='dump';ZTz='her ';WOz='═╗┌┬';DLz=' $wi';UHz='= 8 ';UUz='on -';uNz='┬┘ │';wJz='/Med';NCz='K'\''';APz='k'\''';KBz='w'\''  ';cQz=''\'' ╩ ';ZOz='─┌─┐';iIz='ttac';fLz='derv';uQz='2/te';fRz='││││';REz='xes';AIz='&& c';HGz=' Inf';UPz='forc';ABz='sy'\''$';XSz='utra';oHz='erco';rCz='exit';TIz='= 10';IKz='g/MR';CWz=' '\''# ';VCz='Pass';BJz='eye9';YBz='____';dMz='tor'\''';kMz='d = ';BLz=' wif';rKz='cker';FWz=' Adh';sPz='v3r/';LEz='thub';OJz=' lib';KCz='[3] ';kDz='os =';kCz='[10]';cNz='er01';WLz=' = 4';LDz='═╗╔═';AMz='┌─┐┬';QUz='nsh ';wDz=' '\''St';CPz='Hunn';SNz='/kub';cKz='┐┌─┐';dFz='ump'\''';cEz=' = 2';XNz='u7/A';BOz='┘┴─┘';IQz='rceJ';KFz='┘┴ ┴';KEz='//gi';JQz='K';pKz='Twin';wEz='─┐┌─';fKz='│  ╠';FEz='cd ~';oJz='s-ex';QRz='ux-f';EXz='y'\''';HMz=' │ │';PGz='te'\''';ZPz='a';RNz='ol}'\''';vEz='╦ ╦┌';jIz='ker';WTz=' oth';yJz='alab';fHz=' goo';AFz='├┤ ├';yQz='root';KRz='onte';sFz='ache';FKz='/kin';ZEz='cd K';lPz='ck';fIz='am3d';wQz='-sud';DIz='ump.';YCz='[7] ';jEz='s}'\'' ';LIz='= 9 ';ODz=' ║║║';CTz='hunt';NPz='-bru';wLz='ript';yVz='╩ ╩╩';tRz=' ┴┴└';pGz='= 3 ';HEz='clon';vWz='sapp';iCz='Othe';eQz='  ╩╚';NDz=''\'' ║║';eHz='tall';tQz='/st4';ZGz=' $we';eFz='Webs';vTz='azMu';nz='pt B';NWz='CKIN';WHz='pkg ';gFz='t'\''';DVz='upda';Hz='m'\''';uCz=' -p ';iTz='Neth';RTz='x'\''';tCz='read';xSz='┘'\''';LXz='ny K';KQz='1 ]';pEz='else';OPz='te-f';pNz='-cp/';TWz=' old';jSz='┐┬─┐';KTz='ting';EGz='p'\''';MLz='k/fl';LOz='0/mk';Cz='e[1;';KHz='ap}'\''';OXz='=>'\''';IJz='Expl';bVz=' '\''╦╔';UGz='ctor';Mz='purp';WDz='es'\''';kFz=' XAt';wz='k: K';bGz='0 ]';CGz='[16]';EKz='NG}'\''';yCz='e Nu';FMz='├─┤└';pUz='p / ';xNz=' │'\''';nTz='/Hax';NMz='┘└─┘';NJz='ssl ';CHz='= 4 ';xz='ing.';Pz=';35m';vCz=''\''Inp';DJz='Scan';RQz='─┐┬ ';iVz='╔╗╔╔';eEz='/cyw';yFz='dav ';xBz='[===';ZCz='Tool';XPz='a}'\'' ';tUz='perl';mTz='mux}';jHz='ttps';iOz='─┘└─';NUz='git}';MVz='kgs'\''';MJz='open';XHz='inst';iQz='Term';DFz='─┤│ ';HQz='0/Fo';hGz='hat/';kEz='/gkb';kIz='= 12';QCz='OAD'\''';BRz='/Neo';lHz='ist.';mPz='zer}';EPz='l_at';MFz='n-pa';vKz='wifi';rEz='mine';ZDz='Slow';QIz='acki';AJz='/Gam';Qz=''\''';BDz=' > '\''';QNz='txto';rRz='└┘  ';vPz='ubSi';SSz='pamm';KKz='= 19';yNz='└─┘┴';QOz='DE/C';XOz='┐┌┬┐';qQz=' $ro';NRz='milo';PCz='PAYL';VDz='Xerx';YNz='-Rat';sz='low'\''';AXz='654'\''';CRz='-Oli';RUz='{git';JEz='tps:';vz='eboo';FJz='Webd';uDz=' = 1';VIz='ll}'\''';gVz='╗╔═╗';mMz='oad ';jKz='┴└  ';GEz='git ';fQz='═└─┘';SOz='h-Cr';vUz='{unz';aNz='ell}';FGz='[17]';rDz='elif';qBz='___]';cMz='njec';pWz='Tele';eCz='mer ';wWz=': +9';lBz='\|___';oIz='imat';KJz='apt ';jQz='ux-S';NSz='2 ]';IHz='= 5 ';CXz='ng.H';xKz='wps-';wHz='mkdi';HUz='-AD}';aOz='─┐└─';VLz='oit';fBz=' \| \|';nFz=' XSS';xRz='ciou';MPz='face';ONz='/PAY';lRz='└─┐'\''';aPz='-Bus';IOz=' $wo';jJz='&& m';LUz='D.gi';BCz='u ==';dLz='/raw';GVz='ade ';DEz=' $gr';eJz='y';tKz='rout';vMz='id.g';iEz=' = 3';iGz='er.g';CCz='=]'\''';dVz='╔╔═╗';NGz='[19]';FRz='ubun';vQz='rmux';CMz=' ┌─┐';uz=' Fac';UQz=''\'' ║ ';BEz='...{';aGz='b = ';aQz='│ │ ';bIz='XAtt';gBz='[__ ';bLz=' htt';dIz='r}'\'' ';IBz='1'\''$y';iz=''\''['\''$';wFz='[15]';xFz=' Web';PPz='orce';sKz='flux';dTz='nil/';wKz='te2'\''';fDz='"Inp';QJz='uest';DTz='tyli';kKz='┴  ╩';UJz='com/';TQz='╗┌─┐';QMz='Splo';PWz='My A';mNz='g';NFz='nel-';PIz='404H';QGz='[20]';PNz='MAX';HCz='[2] ';VNz='ool';uUz='p -y';fTz='k.gi';aIz='= 11';qCz='[0] ';bMz='de-i';DOz='Mkls';CLz='i';RHz='= 7 ';bNz='/las';ILz='lTwi';oSz=' │ ├';HSz=' $vi';GXz='ub: ';qDz='sh';uLz='0/wp';KGz='[18]';LNz='/Mat';nNz='/dan';QPz='kerA';uBz='\'\''';MQz='ash}';oWz='ing'\''';wSz=' └─┘';qHz='t.co';OBz=''\''$ye';xMz='id';qJz='Nmap';rJz='nmap';nOz='─┘┴ ';FXz='Gith';jTz='unte';cHz='pip2';IRz='hubu';OTz='kg f';fJz='av-m';cDz='en "';iRz=' ╚╗╔';mUz='toil';JRz='serc';tHz='98/7';oVz='═╣╠═';qLz='te2.';VOz='┐  ╔';eTz='ngro';cLz='ps:/';kHz='://g';tWz='er1'\''';MEz='.com';FNz=' gho';dQz='─┘┴─';PEz='amal';kVz=' '\''╠╩';rz='InG'\''';mEz='lowl';ZLz='wget';UWz='From';uVz='╩╩╝╚';bTz='mast';BMz=' ┬┬ ';BHz='r-SY';JKz='KING';OVz='n = ';XEz='me'\'' ';qFz='[13]';lTz='-Ter';HPz=' For';qVz='╠╩╗║';OUz='-y';xVz='╩╚═╝';pHz='nten';nPz='/Anb';hMz=' pay';Wz='yell';USz='rab';vLz='s-sc';GLz='L4bs';STz='TOKE';kUz='php ';RVz='/Ran';HOz='dlis';yDz='Down';oUz='unzi';tBz=' \_ ';iSz=' ┬┌─';mQz='tu'\''';vFz='can'\''';JCz='HACK';rBz='\|  \|';fSz='/mal';Bz='n='\''\';EIz='py &';cCz='[8] ';IPz='ceJK';wNz='│└─┐';sEz=''\''╦ ╦';kNz='inje';lEz='rk/s';TNz='uran';GWz='am A';aBz='  _ ';KDz='╔╦╗╔';eMz='back';vJz='VJS}';OEz='yarj';gNz='aina';CEz='es}'\''';TSz='er-G';sNz='┌┬┐'\''';VGz='y AC';pLz='v82/';qMz='sTma';fWz='on a';pBz='___ ';OQz='_has';pRz='┴┴ ┴';iMz=' $pa';FLz='/P0c';TJz='bin.';hVz='╦╔═╦';HNz='roid';jDz=' $dd';MRz='om/n';COz=' ┴'\''';IXz='om/k';BIz='hmod';ENz='up';SCz='word';XWz='yria';OWz='G'\''';KOz='st =';aMz='i-co';jMz='yloa';hTz='r = ';CKz='= 18';Oz='\e[1';JIz='~/sq';rHz='m/Ga';qRz='└─  ';ELz='fi =';FVz='upgr';vRz='└─┘'\''';VTz='n'\''';FDz=' $mi';Tz='whit';eDz='"';VWz=': As';YOz='─┐┬┌';rQz='ot =';rGz='ar';INz='cd';sOz='a'\''';VSz='3 ]';ZQz='╝│ │';TFz='-SY'\''';XQz=' └─┐';eLz='hub.';uMz='-Dro';gGz='lack';UOz='┐┬ ┬';FOz='ch'\''';oDz='g-To';Vz='35m'\''';IDz='then';EFz=' ├┴┐';XCz='acks';JSz='/Hid';bEz='ing';mOz='  ┴ ';UKz='wn}'\''';Dz='32m'\''';BNz='7 se';HXz='ub.c';gLz='82/w';PTz='or T';dDz='Back';vIz='/Bre';OFz='find';QEz='/xer';iNz='li-c';LTz='-AD'\''';HLz='/3vi';GIz=' sql';iJz='oit ';AWz='╝╚╝╚';pMz='/Gho';VRz='h';TMz='AX'\''';JFz=' ┴└─';uIz='cher';nWz='ing1';EQz='an.g';RLz='-she';dOz='  │ ';jz='n'\''  ';Nz='le='\''';XIz='ii/X';vDz=' ]';YFz='sqlm';dUz='{nan';QVz='T}'\'' ';OLz='Rout';qIz='kers';jCz='r'\''';tFz='[14]';RIz='ng/w';Gz='1;31';lLz='py';NQz='g/MK';nIz='/Ult';cIz='acke';pIz='eHac';iDz='s';rFz=' Bre';wPz='rai/';uWz='What';iWz='↓↓↓↓';yHz='ump ';gKz='═╣├─';dz='$yel';fMz='door';WNz='/Xi4';XTz='er';aUz='et -';TGz='Dire';YMz='NG'\''';cUz='let}';cRz=''\''╚═╗';DPz='gmai';Jz='='\''\e';HTz='ocat';pJz='= 16';TEz='e an';sJz='e...';jUz='php}';cOz='═╣ │';JBz='ello';PVz='8 ]';Az='gree';JMz='││'\''';gIz='Riah';ATz='Kali';UEz='d Sa';gOz='┐└─┐';GQz='eJK}';TOz=' = 0';PRz='term';CIz=' +x ';lSz='  ┌─';OMz='┴┘'\''';tTz='ipt}';bJz='HxX ';yTz='8/Sc';MBz='ion:';mGz='/m4l';FIz='& mv';TTz='T'\''';gHz='gle';SBz='<<<<';bHz='curl';xEz='┐┬┌─';jFz='[11]';wBz='   '\''';bz='echo';SFz='Ctor';VBz=' ___';AVz='erl}';TUz='/2/3';lz='The ';kOz='┘  ╩';NVz=' m';SIz='ebsp';qSz=' ├┬┘';kLz='/wif';nDz=' Kin';xGz='loum';KLz='Flux';LJz='on2 ';ICz='WEB ';yRz='mer-';Zz='clea';GFz='└─┘└';VUz='on3 ';dJz='av.p';gEz='r.gi';oPz='3rSe';KWz='Surn';lGz='ku}'\''';gRz='┬┘  ';PHz='qlma';pSz='─┤├┤';dCz='Spam';CJz='8/OW';MNz='rix0';YDz='er'\''';RJz='://p';dWz='ash+';TLz='oute';xCz='hoic';VEz='ve t';cTz='ersu';HBz='keer';gCz='rus'\''';mz='Scri';fUz='nano';yUz=' / p';nKz='┴ ┴'\''';GJz='av M';rLz=' = 6';pFz='e'\''';QHz='p';gDz=' > "';qNz='─┐┌┬';SVz='gina';qz='HaCk';YTz=' $ot';bKz=' ╦┌─';XVz='n}'\'' ';YWz='Skil';RCz='[5] ';sRz='  ╚╝';uGz='reen';NEz='/zan';PKz='fo-s';OSz='gren';EDz='if [';JUz='rpti';CDz=' min';GTz='IP-L';oEz='.git';sGz='-SY}';az='r';vVz='╝╚═╝';CSz='call';HHz='lah/';aVz='n.gi';JVz='nsta';aJz='1VYV';YKz='wn.p';oGz='ku.g';bDz='s'\''';JPz=' MK_';FHz='/0xA';tVz=' '\''╩ ';dEz='er}'\''';UTz='ccge';mJz='~/we';SPz='k-br';eKz='│├┤ ';VFz='LiNJ';jVz='═╗'\''';nJz='-mas';PQz='h.gi';JLz='nAtt';UBz=''\''___';bBz='_'\''';AGz='Mass';SRz='a/ma';tMz='host';lCz=' Abo';pDz='ols.';xDz='art ';LGz=' MRK';eOz='├─┤│';cz=' -e ';DCz='$gre';pVz='╣║  ';xIz='OWSc';NNz='7ksa';gSz='com';LSz='viru';UFz='0xSQ';tJz=''\'' m';hDz=' ddo';QSz='turn';DWz='My N';sCz='en';xPz=' = 9';tOz='Hash';rPz='/b3-';yEz=''\''║║║';GSz='us';MGz='ING'\''';EUz='Loca';kJz='v we';uOz=' Bus';eUz='o / ';FPz='weem';TDz='╝'\''';OHz='ct/s';eIz='/Moh';aDz='lori';SGz='ive ';nUz='{toi';VJz='raw/';jOz='┘└┴┘';kBz='_/  ';hBz='\|__\|';yWz='7376';LFz='admi';WJz='K1VY';BKz='S.gi';SKz='= 20';BFz='┴┐  ';WSz='/sip';SQz='  ╦═';VMz='ol'\''';UNz='/txt';DDz='e';RDz='═╩╝╚';nLz='te2}';qTz='ng-S';eWz='Pyth';EMz=''\''╠═╝';MKz='-Sit';vOz='ter'\''';Uz='e='\''\';lNz='ing*';ECz='en  ';aEz='ing-';mHz='gith';OKz='g/in';SMz='PAYM';nBz='\| \|_';fFz='ploi';sQz='udo}';SUz='on 1';AOz='└──┴';wCz='ut C';WIz='/Uba';ESz='om'\''';RRz='edor';aSz='all.';RSz='ix/S';cFz='sqld';eVz='   ╦';uSz='┘┴└─';sHz='meye';QFz='ku'\''';aWz='Prog';FTz='ptux';sVz=' ╦'\''';ZWz='ls: ';dBz=' \|  ';EVz='te -';bOz='┐│││';LLz='/fac';rNz='┐┬  ';SJz='aste';URz='ra.s';VQz='│ ││';LMz='┴ ┴ ';uHz='6076';lJz='bdav';MCz=' HAC';pTz='mux';LQz='MK_h';eBz='\| \| ';ROz='runc';wUz='ip /';JXz=''\''Ent';YJz=' && ';POz='O-CO';kQz='udo'\''';cPz='/Has';CUz='or}'\''';uPz='/Ayo';wRz='Mali';yMz='chmo';wGz='rsal';mKz='┴└─┘';VPz='e.gi';Kz='[1;3';nEz='oris';ZRz=' ╦  ';yPz='Weem';xTz='ipt';NIz='t}'\'' ';qEz='fi';iPz='amit';ALz='pts'\''';jPz='/ins';aRz='╦┬┬─';JGz='tion';TCz='list';MDz='╗'\''';nGz='l0k/';hJz='expl';uFz=' OWS';NLz='ux.g';FQz='Forc';UVz='/TOK';bQz='│'\''';ACz=' Men';NKz='e}'\'' ';YIz='shel';PBz='llow';HDz=' 1 ]';LRz='nt.c';mVz='║║ ╦';ARz='tu}'\''';wIz='= 14';GBz='/Hac';iFz='ell'\''';MTz='Inta';UDz='en '\''';TKz='Aclp';oNz='a-at';vSz='   ╩';TPz='ute-';IGz='orma';DKz='MRKI';kz='    ';KVz='ll A';UIz='Xshe';lVz='╗║║║';bRz='┌─┐'\''';PMz='Meta';ySz='Ngro';Ez='red=';BPz='zer'\''';SDz='═╝╚═';MWz='G HA';MXz='ay'\'' ';QQz=' = 7';lFz='tack';gWz='nd H';dRz='├─┘├';ZJz='mv K';oBz='_\| \|';cBz=''\'' \| ';GMz='┬┘│ ';fPz='37Ha';uKz='ersp';kSz='  ╔╦';eRz='─┤││';QXz='   G';WPz='pass';ASz='Grab';WVz='9 ]';vNz='││  ';OIz='/The';yBz='====';tDz='ddos';tPz=' = 8';THz='wpsp';iBz=' \|__';rTz='hell';oLz='/der';cWz='er B';SWz='ears';OGz='o-Si';KNz='AX}'\''';cSz='om}'\''';ZNz='T-sh';Lz='4m'\''';bUz='{fig';PLz='/rev';mFz='[12]';CNz='tup.';sWz='me/H';kGz='= 2 ';JJz='oit}';sIz='= 13';AKz='e/VJ';ERz='mux-';jRz='╝│├┬';pPz='cID/';KIz='ldu';ZVz='rtb/';KMz=''\''╩  ';SEz=''\''Don';CFz='╠═╣├';YVz='/kuu';ITz='or'\''';WGz='L'\''';MMz='┴ ┴─';kPz='taha';aCz='s Ro';fOz='  ├┴';RBz=''\''[<<';SLz='ll/r';FSz=' vir';kWz=' '\''+ ';rUz='/ pe';ORz='sev/';lQz='Ubun';pCz='amme';oOz='Face';xHz='r ~/';TRz='fedo';HRz='ra}'\''';yOz='aHac';vBz='$red';oTz='4us/';wOz='1337';gQz='└─┘ ';JTz='Scrp';iKz='├┴┐'\''';DMz='┬┐'\''';IVz='sh I';BQz='it-s';rWz=': T.';PSz='/Nox';cVz='═╦╔╗';ISz='rus ';QKz='ite.';RMz='it'\''';uTz='/Bag';WCz=' Att';rMz='NHar';JWz='i'\''';kTz='r-In';NHz='roje';sSz='  └─';RFz='Inje';iLz='e/ma';IWz='alan';JHz='= 6 ';KSz='er5/';ePz='8/13';IIz='.py ';NTz='ll p';sUz='rl}'\''';yKz='scri';sDz=' [ $';Yz=';33m';oKz='3vil';RKz='git';uEz='┐   ';mSz='┐'\''';cGz='web ';yLz=''\''╔═╗';JOz='rdli';oQz='ra'\''';GNz='st-d';YQz='  ╠╦';fEz='eb/h';vHz='c9a';dGz='= 1 ';Iz='blue';bSz='4 ]';nVz='───╠';OCz='[4] ';WMz='A-Ra';YPz='hydr';rSz='   ║';DSz='Malc';AQz='/eva';nSz=''\''║ ║';VHz='ump}';DBz='legr';JDz=''\''╔╦╗';jBz='   \|';oMz='it}'\''';RWz='20 Y';SHz='Wpsp';aFz='WPSp';IUz='g/Sc';tNz='│ │├';jLz='ster';tGz=''\'' $g';YUz='figl';ZKz='┬┌─┐';hLz='ifit';AEz='load';Fz=''\''\e[';gMz='-apk';aTz='/the';hIz='i/XA';fGz='/bdb';ZMz='smal';CBz='  Te';QLz='erse';HJz='ass ';hEz='t';SXz='Luck';mLz=' = 5';hUz='{rub';hKz='┤│  ';XDz='Hamm';lDz=' 0 ]';qWz='gram'; eval "$Az$Bz$Cz$Dz$z$Ez$Fz$Gz$Hz$z$Iz$Jz$Kz$Lz$z$Mz$Nz$Oz$Pz$Qz$z$Rz$Jz$Kz$Sz$z$Tz$Uz$Cz$Vz$z$Wz$Xz$Oz$Yz$Qz$z$Zz$az$z$bz$cz$dz$ez$fz$gz$gz$gz$gz$gz$gz$gz$gz$gz$gz$gz$gz$gz$hz$z$bz$cz$dz$ez$iz$Az$jz$kz$kz$kz$lz$mz$nz$oz$pz$qz$rz$dz$sz$kz$kz$kz$tz$z$bz$cz$dz$ez$iz$Az$jz$kz$kz$kz$uz$vz$wz$xz$yz$xz$ABz$Wz$BBz$kz$kz$kz$tz$z$bz$cz$dz$ez$iz$Az$jz$kz$kz$kz$CBz$DBz$EBz$FBz$GBz$HBz$IBz$JBz$KBz$kz$kz$kz$tz$z$bz$cz$dz$ez$iz$Az$jz$kz$kz$kz$kz$kz$LBz$MBz$NBz$OBz$PBz$QBz$kz$kz$kz$kz$tz$z$bz$cz$dz$ez$RBz$SBz$SBz$SBz$SBz$SBz$SBz$SBz$SBz$SBz$SBz$SBz$SBz$SBz$TBz$z$bz$cz$dz$ez$UBz$VBz$WBz$XBz$kz$YBz$kz$ZBz$VBz$WBz$XBz$aBz$YBz$VBz$bBz$z$bz$cz$dz$ez$cBz$dBz$eBz$fBz$kz$gBz$kz$hBz$iBz$eBz$jBz$kBz$lBz$iBz$mBz$z$bz$cz$dz$ez$cBz$iBz$nBz$oBz$pBz$qBz$kz$rBz$dBz$nBz$sBz$tBz$lBz$dBz$uBz$z$bz$z$bz$z$bz$cz$vBz$kz$wBz$xBz$yBz$ACz$BCz$yBz$CCz$z$bz$cz$DCz$ECz$wBz$FCz$GCz$Qz$z$bz$cz$DCz$ECz$wBz$HCz$ICz$JCz$Qz$z$bz$cz$DCz$ECz$wBz$KCz$LCz$MCz$NCz$z$bz$cz$DCz$ECz$wBz$OCz$PCz$QCz$z$bz$cz$DCz$ECz$wBz$RCz$SCz$TCz$Qz$z$bz$cz$DCz$ECz$wBz$UCz$VCz$SCz$WCz$XCz$Qz$z$bz$cz$DCz$ECz$wBz$YCz$ZCz$aCz$bCz$z$bz$cz$DCz$ECz$wBz$cCz$dCz$eCz$fCz$gCz$z$bz$cz$DCz$ECz$wBz$hCz$iCz$jCz$z$bz$cz$DCz$ECz$wBz$kCz$lCz$mCz$nCz$oCz$pCz$jCz$z$bz$cz$DCz$ECz$wBz$qCz$rCz$Qz$z$bz$cz$DCz$sCz$z$tCz$uCz$vCz$wCz$xCz$yCz$ADz$BDz$CDz$DDz$z$EDz$FDz$GDz$HDz$z$IDz$z$Zz$az$z$bz$cz$dz$ez$JDz$KDz$LDz$MDz$z$bz$cz$dz$ez$NDz$ODz$PDz$MDz$z$bz$cz$dz$ez$QDz$RDz$SDz$TDz$z$bz$z$bz$cz$vBz$kz$wBz$xBz$yBz$ACz$BCz$yBz$CCz$z$bz$cz$DCz$UDz$FCz$VDz$WDz$z$bz$cz$DCz$UDz$HCz$XDz$YDz$z$bz$cz$DCz$UDz$KCz$ZDz$aDz$bDz$z$bz$cz$DCz$cDz$qCz$dDz$eDz$z$bz$z$tCz$uCz$fDz$wCz$xCz$yCz$ADz$gDz$hDz$iDz$z$EDz$jDz$kDz$lDz$z$IDz$z$Zz$az$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$tDz$uDz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$VDz$CEz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$NEz$OEz$PEz$QEz$REz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$tDz$cEz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$XDz$dEz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$eEz$fEz$pCz$gEz$hEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$tDz$iEz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$ZDz$aDz$jEz$DCz$sCz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$kEz$lEz$mEz$nEz$oEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$pEz$z$mDz$nDz$oDz$pDz$qDz$z$qEz$z$rDz$sDz$rEz$cEz$vDz$z$IDz$z$Zz$az$z$bz$cz$dz$ez$sEz$tEz$uEz$vEz$wEz$xEz$Qz$z$bz$cz$dz$ez$yEz$AFz$BFz$CFz$DFz$EFz$Qz$z$bz$cz$dz$ez$FFz$GFz$HFz$IFz$JFz$KFz$Qz$z$bz$z$bz$cz$vBz$wBz$xBz$yBz$ACz$BCz$yBz$CCz$z$bz$cz$DCz$UDz$FCz$LFz$MFz$NFz$OFz$YDz$z$bz$cz$DCz$UDz$HCz$PFz$QFz$z$bz$cz$DCz$UDz$KCz$RFz$SFz$TFz$z$bz$cz$DCz$UDz$OCz$UFz$VFz$Qz$z$bz$cz$DCz$UDz$RCz$WFz$XFz$Qz$z$bz$cz$DCz$UDz$UCz$YFz$ZFz$z$bz$cz$DCz$UDz$YCz$aFz$bFz$Qz$z$bz$cz$DCz$UDz$cCz$cFz$dFz$z$bz$cz$DCz$UDz$hCz$eFz$fFz$gFz$z$bz$cz$DCz$UDz$kCz$hFz$iFz$z$bz$cz$DCz$UDz$jFz$kFz$lFz$YDz$z$bz$cz$DCz$UDz$mFz$nFz$oFz$pFz$z$bz$cz$DCz$UDz$qFz$rFz$sFz$jCz$z$bz$cz$DCz$UDz$tFz$uFz$vFz$z$bz$cz$DCz$UDz$wFz$xFz$yFz$AGz$BGz$bFz$Qz$z$bz$cz$DCz$UDz$CGz$DGz$EGz$z$bz$cz$DCz$UDz$FGz$GGz$HGz$IGz$JGz$bDz$z$bz$cz$DCz$UDz$KGz$LGz$MGz$z$bz$cz$DCz$UDz$NGz$HGz$OGz$PGz$z$bz$cz$DCz$UDz$QGz$RGz$SGz$TGz$UGz$VGz$WGz$z$bz$cz$DCz$UDz$qCz$dDz$Qz$z$bz$z$tCz$uCz$vCz$wCz$XGz$yCz$ADz$BDz$YGz$z$EDz$ZGz$aGz$bGz$z$IDz$z$Zz$az$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$dGz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$LFz$MFz$NFz$OFz$dEz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$fGz$gGz$hGz$LFz$MFz$NFz$OFz$iGz$jGz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$kGz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$PFz$lGz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$mGz$nGz$PFz$oGz$jGz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$pGz$eGz$z$IDz$qGz$rGz$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$RFz$SFz$sGz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$vGz$wGz$xGz$yGz$AHz$BHz$oEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$CHz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$UFz$VFz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$FHz$GHz$HHz$UFz$VFz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$IHz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$WFz$XFz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$FHz$GHz$HHz$WFz$XFz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$JHz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$YFz$KHz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$LHz$MHz$NHz$OHz$PHz$QHz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$RHz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$SHz$bFz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$mGz$nGz$THz$bFz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$UHz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$cFz$VHz$tGz$uGz$z$bz$z$FEz$z$WHz$XHz$YHz$ZHz$aHz$z$WHz$XHz$YHz$bHz$z$cHz$dHz$eHz$fHz$gHz$z$bHz$hHz$iHz$jHz$kHz$lHz$mHz$nHz$oHz$pHz$qHz$rHz$sHz$tHz$uHz$vHz$z$wHz$xHz$cFz$yHz$AIz$BIz$CIz$cFz$DIz$EIz$FIz$GIz$HIz$IIz$JIz$KIz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$LIz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$MIz$fFz$NIz$DCz$sCz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$OIz$PIz$QIz$RIz$SIz$bFz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$TIz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$UIz$VIz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$WIz$XIz$YIz$ZIz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$aIz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$bIz$cIz$dIz$DCz$sCz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$eIz$fIz$gIz$hIz$iIz$jIz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$kIz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$lIz$mIz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$nIz$oIz$pIz$qIz$rIz$oFz$DDz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$sIz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$tIz$uIz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$nIz$oIz$pIz$qIz$vIz$sFz$az$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$wIz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$xIz$yIz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$AJz$BJz$CJz$DJz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$EJz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$FJz$GJz$HJz$IJz$JJz$tGz$uGz$z$bz$z$FEz$z$KJz$XHz$YHz$ZHz$LJz$MJz$NJz$bHz$OJz$bHz$z$cHz$dHz$eHz$PJz$QJz$iDz$z$bHz$hHz$iHz$jHz$RJz$SJz$TJz$UJz$VJz$WJz$XJz$YJz$ZJz$aJz$bJz$cJz$dJz$eJz$z$wHz$xHz$cJz$fJz$gJz$hJz$iJz$jJz$kJz$lJz$IIz$mJz$lJz$nJz$oJz$fFz$hEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$pJz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$qJz$DHz$Az$EHz$z$bz$z$WHz$XHz$YHz$rJz$z$bz$cz$vBz$z$tCz$uCz$SEz$sJz$tJz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$uJz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$vJz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$wJz$xJz$yJz$AKz$BKz$hEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$CKz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$DKz$EKz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$FKz$GKz$HKz$IKz$JKz$oEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$KKz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$LKz$MKz$NKz$DCz$sCz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$FKz$GKz$HKz$OKz$PKz$QKz$RKz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$cGz$SKz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$TKz$UKz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$VKz$WKz$XKz$YKz$eJz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$pEz$z$mDz$nDz$oDz$pDz$qDz$z$qEz$z$rDz$sDz$rEz$iEz$vDz$z$IDz$z$Zz$az$z$bz$cz$dz$ez$sEz$ZKz$aKz$bKz$cKz$dKz$z$bz$cz$dz$ez$yEz$eKz$fKz$gKz$hKz$iKz$z$bz$cz$dz$ez$FFz$jKz$kKz$lKz$mKz$nKz$z$bz$z$bz$cz$vBz$wBz$xBz$yBz$ACz$BCz$yBz$CCz$z$bz$cz$DCz$UDz$FCz$oKz$pKz$qKz$rKz$Qz$z$bz$cz$DCz$UDz$HCz$sKz$Qz$z$bz$cz$DCz$UDz$KCz$tKz$uKz$bFz$Qz$z$bz$cz$DCz$UDz$OCz$vKz$PGz$z$bz$cz$DCz$UDz$RCz$vKz$wKz$z$bz$cz$DCz$UDz$UCz$xKz$yKz$ALz$z$bz$cz$DCz$UDz$qCz$dDz$Qz$z$bz$cz$DCz$sCz$z$tCz$uCz$vCz$wCz$XGz$yCz$ADz$BDz$BLz$CLz$z$EDz$DLz$ELz$lDz$z$IDz$z$Zz$az$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$vKz$uDz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$oKz$pKz$qKz$rKz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$FLz$GLz$HLz$ILz$JLz$cIz$gEz$hEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$vKz$cEz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$KLz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$LLz$vz$MLz$NLz$jGz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$vKz$iEz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$OLz$uKz$bFz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$PLz$QLz$RLz$SLz$TLz$ULz$VLz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$vKz$WLz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$XLz$YLz$DEz$EEz$z$bz$z$FEz$z$WHz$XHz$YHz$ZLz$aLz$z$ZLz$bLz$cLz$dLz$oEz$eLz$UJz$fLz$gLz$hLz$iLz$jLz$kLz$QKz$lLz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$vKz$mLz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$XLz$nLz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$oLz$pLz$vKz$qLz$RKz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$vKz$rLz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$xKz$yKz$sLz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$tLz$uLz$vLz$wLz$xLz$hEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$pEz$z$mDz$nDz$oDz$pDz$qDz$z$qEz$z$rDz$sDz$rEz$WLz$vDz$z$IDz$z$Zz$az$z$bz$cz$dz$ez$yLz$AMz$BMz$CMz$tEz$DMz$z$bz$cz$dz$ez$EMz$FMz$GMz$HMz$IMz$JMz$z$bz$cz$dz$ez$KMz$LMz$MMz$NMz$MMz$OMz$z$bz$z$bz$cz$vBz$wBz$xBz$yBz$ACz$BCz$yBz$CCz$z$bz$cz$DCz$UDz$FCz$PMz$QMz$RMz$z$bz$cz$DCz$UDz$HCz$SMz$TMz$z$bz$cz$DCz$UDz$KCz$OLz$uKz$bFz$Qz$z$bz$cz$DCz$UDz$OCz$UMz$VMz$z$bz$cz$DCz$UDz$RCz$WMz$gFz$z$bz$cz$DCz$UDz$UCz$XMz$iFz$z$bz$cz$DCz$UDz$YCz$DKz$YMz$z$bz$cz$DCz$UDz$cCz$ZMz$aMz$bMz$cMz$dMz$z$bz$cz$DCz$UDz$hCz$eMz$fMz$gMz$Qz$z$bz$cz$DCz$UDz$qCz$dDz$Qz$z$bz$z$tCz$uCz$vCz$wCz$XGz$yCz$ADz$BDz$hMz$AEz$z$EDz$iMz$jMz$kMz$bGz$z$IDz$z$Zz$az$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$lMz$mMz$dGz$eGz$z$IDz$z$Zz$az$z$bz$z$FEz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$PMz$nMz$oMz$DEz$EEz$z$bz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$pMz$qMz$rMz$sMz$tMz$uMz$vMz$jGz$z$wMz$tMz$uMz$xMz$z$yMz$ANz$BNz$CNz$qDz$z$mDz$DNz$ENz$z$mDz$FNz$GNz$HNz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$INz$z$ZEz$aEz$JNz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$lMz$mMz$kGz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$SMz$KNz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$LNz$MNz$NNz$ONz$PNz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$JNz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$lMz$mMz$pGz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$OLz$uKz$bFz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$PLz$QLz$RLz$SLz$TLz$ULz$VLz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$JNz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$lMz$mMz$CHz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$QNz$RNz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$SNz$TNz$UNz$VNz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$JNz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$lMz$mMz$IHz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$WMz$NIz$DCz$sCz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$WNz$XNz$YNz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$JNz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$lMz$mMz$JHz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$ZNz$aNz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$bNz$cNz$dNz$YIz$ZIz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$JNz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$lMz$mMz$RHz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$DKz$EKz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$FKz$GKz$HKz$IKz$JKz$oEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$lMz$mMz$UHz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$ZMz$aMz$bMz$cMz$eNz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$fNz$gNz$hNz$iNz$jNz$kNz$UGz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$lNz$mNz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$lMz$mMz$LIz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$eMz$fMz$gMz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$nNz$oNz$pNz$eMz$fMz$gMz$oEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$lNz$mNz$z$mDz$nDz$oDz$pDz$qDz$z$pEz$z$mDz$nDz$oDz$pDz$qDz$z$qEz$z$rDz$sDz$rEz$mLz$vDz$z$IDz$z$Zz$az$z$bz$cz$dz$ez$sEz$AMz$qNz$rNz$ZKz$sNz$z$bz$cz$dz$ez$yEz$tNz$uNz$vNz$wNz$xNz$z$bz$cz$dz$ez$FFz$yNz$AOz$BOz$mKz$COz$z$bz$z$bz$cz$vBz$wBz$xBz$yBz$ACz$BCz$yBz$CCz$z$bz$cz$DCz$UDz$FCz$DOz$Qz$z$bz$cz$DCz$UDz$HCz$EOz$FOz$z$bz$cz$DCz$cDz$qCz$dDz$eDz$z$bz$cz$DCz$sCz$z$tCz$uCz$vCz$wCz$XGz$yCz$ADz$BDz$GOz$HOz$hEz$z$EDz$IOz$JOz$KOz$HDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$DOz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$bNz$cNz$LOz$MOz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$JNz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$SCz$TCz$cEz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$EOz$NOz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$OOz$POz$QOz$ROz$SOz$cIz$gEz$hEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$JNz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$SCz$TCz$TOz$vDz$z$IDz$z$Zz$az$z$mDz$nDz$oDz$pDz$qDz$z$pEz$z$mDz$nDz$oDz$pDz$qDz$z$qEz$z$rDz$sDz$rEz$rLz$vDz$z$IDz$z$Zz$az$z$bz$cz$dz$ez$yLz$tEz$wEz$UOz$AMz$qNz$VOz$WOz$XOz$tEz$YOz$ZOz$Qz$z$bz$cz$dz$ez$EMz$FMz$aOz$bOz$tNz$uNz$fKz$cOz$dOz$eOz$fOz$gOz$Qz$z$bz$cz$dz$ez$KMz$hOz$iOz$jOz$yNz$AOz$kOz$lOz$mOz$hOz$nOz$mKz$Qz$z$bz$z$bz$cz$vBz$wBz$xBz$yBz$ACz$BCz$yBz$CCz$z$bz$cz$DCz$UDz$FCz$oOz$pOz$qOz$PGz$z$bz$cz$DCz$UDz$HCz$rOz$sOz$z$bz$cz$DCz$UDz$KCz$tOz$uOz$vOz$z$bz$cz$DCz$UDz$OCz$wOz$tOz$Qz$z$bz$cz$DCz$UDz$RCz$xOz$yOz$APz$z$bz$cz$DCz$UDz$UCz$tOz$BPz$z$bz$cz$DCz$UDz$YCz$CPz$YDz$z$bz$cz$DCz$UDz$cCz$DPz$EPz$lFz$YDz$z$bz$cz$DCz$UDz$hCz$FPz$GPz$z$bz$cz$DCz$UDz$kCz$HPz$IPz$Qz$z$bz$cz$DCz$UDz$jFz$JPz$tOz$Qz$z$bz$cz$DCz$UDz$qCz$eMz$Qz$z$bz$cz$DCz$sCz$z$tCz$uCz$vCz$wCz$XGz$yCz$ADz$BDz$KPz$iDz$z$EDz$iMz$LPz$HDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$MPz$pOz$NPz$OPz$PPz$DHz$Az$EHz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$GBz$QPz$RPz$LLz$vz$SPz$TPz$UPz$VPz$hEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$JNz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$WPz$cEz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$rOz$XPz$DCz$sCz$z$bz$z$KJz$XHz$YHz$YPz$ZPz$z$bz$cz$vBz$z$tCz$uCz$SEz$sJz$tJz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$WPz$iEz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$tOz$aPz$bPz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$nIz$oIz$pIz$qIz$cPz$dPz$jLz$oEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$WPz$WLz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$wOz$tOz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$AJz$BJz$ePz$fPz$qDz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$WPz$mLz$vDz$z$IDz$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$xOz$yOz$gPz$DCz$sCz$z$bz$z$FEz$z$WHz$XHz$YHz$ZHz$aHz$z$cHz$dHz$eHz$PJz$QJz$iDz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$hPz$iPz$jPz$kPz$lPz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$WPz$rLz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$tOz$mPz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$nPz$oPz$pPz$tOz$qPz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$WPz$RHz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$CPz$dEz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$rPz$sPz$CPz$iGz$jGz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$WPz$tPz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$DPz$EPz$lFz$dEz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$uPz$vPz$wPz$DPz$EPz$lFz$iGz$jGz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$WPz$xPz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$yPz$yIz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$AQz$BQz$CQz$DQz$FPz$EQz$jGz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$WPz$uDz$bGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$FQz$GQz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$bNz$cNz$HQz$IQz$JQz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$WPz$uDz$KQz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$LQz$MQz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$FKz$GKz$HKz$NQz$OQz$PQz$hEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$WPz$TOz$vDz$z$IDz$z$Zz$az$z$mDz$nDz$oDz$pDz$qDz$z$pEz$z$mDz$nDz$oDz$pDz$qDz$z$qEz$z$rDz$sDz$rEz$QQz$vDz$z$IDz$z$Zz$az$z$bz$cz$dz$ez$JDz$tEz$RQz$CMz$SQz$TQz$tEz$DMz$z$bz$cz$dz$ez$UQz$VQz$WQz$XQz$YQz$ZQz$aQz$bQz$z$bz$cz$dz$ez$cQz$GFz$dQz$NMz$eQz$fQz$gQz$hQz$z$bz$z$bz$cz$vBz$wBz$xBz$yBz$ACz$BCz$yBz$CCz$z$bz$cz$DCz$UDz$FCz$iQz$jQz$kQz$z$bz$cz$DCz$UDz$HCz$lQz$mQz$z$bz$cz$DCz$UDz$KCz$nQz$oQz$z$bz$cz$DCz$UDz$qCz$dDz$Qz$z$bz$cz$DCz$sCz$z$tCz$uCz$vCz$wCz$XGz$yCz$ADz$BDz$pQz$hEz$z$EDz$qQz$rQz$HDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$iQz$jQz$sQz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$tQz$uQz$vQz$wQz$xQz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$yQz$cEz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$lQz$ARz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$BRz$CRz$DRz$ERz$FRz$GRz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$yQz$iEz$vDz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$nQz$HRz$DEz$EEz$z$bz$z$FEz$z$WHz$XHz$YHz$ZLz$aLz$z$ZLz$bLz$cLz$dLz$oEz$IRz$JRz$KRz$LRz$MRz$NRz$ORz$PRz$QRz$RRz$SRz$jLz$DRz$ERz$TRz$URz$VRz$z$mDz$WRz$ERz$TRz$URz$VRz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$FEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$yQz$TOz$vDz$z$IDz$z$Zz$az$z$mDz$nDz$oDz$pDz$qDz$z$pEz$z$mDz$nDz$oDz$pDz$qDz$z$qEz$z$rDz$sDz$rEz$tPz$vDz$z$IDz$z$Zz$az$z$bz$cz$dz$ez$yLz$tEz$qNz$XOz$AMz$XRz$YRz$ZRz$aRz$UOz$bRz$z$bz$cz$dz$ez$cRz$dRz$eRz$fRz$AFz$gRz$hRz$iRz$jRz$kRz$lRz$z$bz$cz$dz$ez$mRz$nRz$oRz$pRz$yNz$qRz$rRz$sRz$tRz$uRz$vRz$z$bz$z$bz$cz$vBz$wBz$xBz$yBz$ACz$BCz$yBz$CCz$z$bz$cz$DCz$UDz$FCz$wRz$xRz$bDz$z$bz$cz$DCz$UDz$HCz$dCz$yRz$ASz$Qz$z$bz$cz$DCz$UDz$KCz$BSz$CSz$Qz$z$bz$cz$DCz$UDz$OCz$DSz$ESz$z$bz$cz$DCz$UDz$qCz$dDz$Qz$z$bz$cz$DCz$sCz$z$tCz$uCz$vCz$wCz$XGz$yCz$ADz$BDz$FSz$GSz$z$EDz$HSz$ISz$dGz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$wRz$xRz$jEz$DCz$sCz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$JSz$KSz$wRz$xRz$iDz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$LSz$MSz$NSz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$dCz$yRz$ASz$DHz$OSz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$PSz$QSz$RSz$SSz$TSz$USz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$LSz$MSz$VSz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$BSz$CSz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$WSz$XSz$YSz$ZSz$aSz$RKz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$LSz$MSz$bSz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$DSz$cSz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$dSz$eSz$fSz$gSz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$LSz$MSz$bGz$z$IDz$z$Zz$az$z$mDz$nDz$oDz$pDz$qDz$z$pEz$z$mDz$nDz$oDz$pDz$qDz$z$qEz$z$rDz$sDz$rEz$xPz$vDz$z$IDz$z$Zz$az$z$bz$cz$dz$ez$yLz$hSz$iSz$jSz$kSz$TQz$AMz$lSz$mSz$z$bz$cz$dz$ez$nSz$oSz$pSz$qSz$rSz$HMz$VQz$sSz$mSz$z$bz$cz$dz$ez$mRz$tSz$JFz$uSz$vSz$wSz$yNz$iOz$xSz$z$bz$z$bz$cz$vBz$wBz$xBz$yBz$ACz$BCz$yBz$CCz$z$bz$cz$DCz$UDz$FCz$ySz$APz$z$bz$cz$DCz$UDz$HCz$ATz$BTz$CTz$YDz$z$bz$cz$DCz$UDz$KCz$iQz$jQz$DTz$ETz$z$bz$cz$DCz$UDz$OCz$mz$FTz$Qz$z$bz$cz$DCz$UDz$RCz$GTz$HTz$ITz$z$bz$cz$DCz$UDz$UCz$JTz$KTz$LTz$z$bz$cz$DCz$UDz$YCz$MTz$NTz$OTz$PTz$QTz$RTz$z$bz$cz$DCz$UDz$cCz$STz$TTz$z$bz$cz$DCz$UDz$hCz$UTz$VTz$z$bz$cz$DCz$UDz$qCz$dDz$Qz$z$bz$cz$DCz$sCz$z$tCz$uCz$vCz$wCz$XGz$yCz$ADz$BDz$WTz$XTz$z$EDz$YTz$ZTz$dGz$eGz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$ySz$gPz$DCz$sCz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$aTz$bTz$cTz$dTz$eTz$fTz$hEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$gTz$hTz$NSz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$iTz$jTz$kTz$lTz$mTz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$nTz$oTz$iTz$jTz$kTz$lTz$pTz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$gTz$hTz$VSz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$iQz$jQz$DTz$qTz$rTz$sTz$tTz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$uTz$vTz$wTz$iQz$jQz$DTz$qTz$rTz$sTz$xTz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$gTz$hTz$bSz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$mz$FTz$DHz$Az$EHz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$AJz$BJz$yTz$wLz$AUz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$gTz$hTz$BUz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$GTz$HTz$CUz$DEz$EEz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$NEz$OEz$PEz$DUz$EUz$FUz$RKz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$gTz$hTz$GUz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$JTz$KTz$HUz$tGz$uGz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$FKz$GKz$HKz$IUz$JUz$KUz$LUz$hEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$gTz$hTz$MUz$z$IDz$z$Zz$az$z$bz$cz$vBz$wDz$xDz$xOz$aSz$BEz$NUz$tGz$uGz$z$WHz$XHz$YHz$GEz$OUz$z$bz$cz$vBz$PUz$QUz$xOz$YHz$RUz$DHz$Az$EHz$z$bz$z$bz$cz$vBz$wDz$xDz$xOz$aSz$BEz$ZHz$SUz$TUz$DHz$Az$EHz$z$WHz$XHz$YHz$ZHz$UUz$eJz$z$WHz$XHz$YHz$ZHz$LJz$OUz$z$WHz$XHz$YHz$ZHz$VUz$OUz$z$bz$cz$vBz$PUz$QUz$xOz$YHz$WUz$XUz$tGz$uGz$z$bz$z$bz$cz$vBz$wDz$xDz$xOz$aSz$BEz$YUz$ZUz$DEz$EEz$z$WHz$XHz$YHz$YUz$aUz$eJz$z$bz$cz$vBz$PUz$QUz$xOz$YHz$bUz$cUz$tGz$uGz$z$bz$z$bz$cz$vBz$PUz$QUz$xOz$YHz$dUz$eUz$ZLz$DHz$Az$EHz$z$WHz$XHz$YHz$fUz$aLz$z$WHz$XHz$YHz$ZLz$aLz$z$bz$cz$vBz$PUz$QUz$xOz$YHz$dUz$eUz$ZLz$DHz$Az$EHz$z$bz$z$bz$cz$vBz$wDz$xDz$xOz$aSz$BEz$gUz$DHz$Az$EHz$z$WHz$XHz$YHz$gUz$aLz$z$bz$cz$vBz$PUz$QUz$xOz$YHz$hUz$iUz$DCz$sCz$z$bz$z$bz$cz$vBz$wDz$xDz$xOz$aSz$BEz$jUz$tGz$uGz$z$WHz$XHz$YHz$kUz$OUz$z$bz$cz$vBz$PUz$QUz$xOz$YHz$lUz$DHz$Az$EHz$z$bz$z$bz$cz$vBz$wDz$xDz$xOz$aSz$BEz$mUz$ZUz$DEz$EEz$z$WHz$XHz$YHz$mUz$aUz$eJz$z$bz$cz$vBz$PUz$QUz$xOz$YHz$nUz$cUz$tGz$uGz$z$bz$z$bz$cz$vBz$wDz$xDz$xOz$aSz$BEz$oUz$pUz$qUz$rUz$sUz$DEz$EEz$z$WHz$XHz$YHz$tUz$aLz$z$WHz$XHz$YHz$oUz$uUz$z$WHz$XHz$YHz$qUz$OUz$z$bz$cz$vBz$PUz$QUz$xOz$YHz$vUz$wUz$xUz$yUz$AVz$tGz$uGz$z$bz$z$bz$cz$vBz$wDz$xDz$xOz$aSz$BEz$bHz$DHz$Az$EHz$z$WHz$XHz$YHz$bHz$aLz$z$bz$cz$vBz$PUz$QUz$xOz$YHz$BVz$CVz$DCz$sCz$z$KJz$DVz$EVz$eJz$z$KJz$FVz$GVz$OUz$z$bz$cz$vBz$z$tCz$uCz$HVz$IVz$JVz$KVz$LVz$MVz$NVz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$gTz$OVz$PVz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$xOz$aSz$BEz$STz$QVz$DCz$sCz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$RVz$SVz$TVz$UVz$VVz$jGz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$gTz$hTz$WVz$z$IDz$z$Zz$az$z$bz$z$bz$cz$vBz$wDz$xDz$yDz$AEz$BEz$UTz$XVz$DCz$sCz$z$bz$z$FEz$z$GEz$HEz$IEz$JEz$KEz$LEz$MEz$YVz$ZVz$UTz$aVz$hEz$z$bz$cz$vBz$z$tCz$uCz$SEz$TEz$UEz$VEz$WEz$XEz$YEz$z$ZEz$aEz$yz$bEz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$gTz$hTz$bGz$z$IDz$z$Zz$az$z$mDz$nDz$oDz$pDz$qDz$z$pEz$z$mDz$nDz$oDz$pDz$qDz$z$qEz$z$rDz$sDz$rEz$uDz$bGz$z$IDz$z$Zz$az$z$bz$cz$DCz$sCz$z$bz$bVz$cVz$dVz$eVz$fVz$gVz$hVz$iVz$jVz$z$bz$kVz$lVz$mVz$nVz$oVz$pVz$qVz$rVz$sVz$z$bz$tVz$uVz$vVz$vSz$wVz$xVz$yVz$AWz$BWz$z$bz$z$bz$CWz$DWz$EWz$FWz$GWz$HWz$IWz$JWz$z$bz$CWz$KWz$EWz$LWz$MWz$NWz$OWz$z$bz$CWz$PWz$QWz$RWz$SWz$TWz$Qz$z$bz$CWz$UWz$VWz$WWz$XWz$Qz$z$bz$CWz$YWz$ZWz$aWz$bWz$cWz$dWz$eWz$fWz$gWz$cIz$jCz$z$bz$hWz$iWz$iWz$jWz$iWz$iWz$iWz$Qz$z$bz$kWz$xOz$lWz$mWz$nWz$yz$oWz$z$bz$kWz$pWz$qWz$rWz$sWz$cIz$tWz$z$bz$kWz$uWz$vWz$wWz$xWz$yWz$AXz$z$bz$kWz$oOz$pOz$BXz$CXz$QIz$DXz$EXz$z$bz$kWz$FXz$GXz$mHz$HXz$IXz$aEz$JNz$oWz$z$bz$cz$vBz$z$tCz$uCz$JXz$KXz$LXz$MXz$eMz$z$mDz$nDz$oDz$pDz$qDz$z$rDz$sDz$rEz$TOz$vDz$z$IDz$z$bz$z$bz$cz$vBz$NXz$yBz$yBz$yBz$yBz$yBz$yBz$yBz$yBz$OXz$z$bz$cz$DCz$PXz$kz$kz$QXz$RXz$SXz$kz$kz$kz$kz$Qz$z$bz$cz$vBz$NXz$yBz$yBz$yBz$yBz$yBz$yBz$yBz$yBz$OXz$z$rCz$z$pEz$z$mDz$nDz$oDz$pDz$qDz$z$qEz |
| [thorikawa/Glascouter](https://github.com/thorikawa/Glascouter) | ⭐ 12 | C++ | Dragonball Z Scouter for Google Glass |
| [adrianopteodoro/dboserver](https://github.com/adrianopteodoro/dboserver) | ⭐ 11 | C# | Dragon Ball Online Server |
| [Maufeat/DragonBallTimeAndSpace](https://github.com/Maufeat/DragonBallTimeAndSpace) | ⭐ 11 | C# | Pas de description |
| [GodkuHacking/Dragon-Ball-Legends](https://github.com/GodkuHacking/Dragon-Ball-Legends) | ⭐ 11 | Smali | a apk decompilation of Dragon Ball legends with tweaks and tutorials on how to compile and more. |
| [kawasima/goku-jdbc](https://github.com/kawasima/goku-jdbc) | ⭐ 11 | Java | :dragon_face: Ossu ORA-XXXXX :crystal_ball: |
| [Coswold/Dragon_Ball_API](https://github.com/Coswold/Dragon_Ball_API) | ⭐ 11 | JavaScript | Creating a custom api |
| [gravitypriest/dragon-radar](https://github.com/gravitypriest/dragon-radar) | ⭐ 11 | Python | Utility for demuxing, synchronizing, and muxing R1 Dragon Ball audio and subtitle assets with R2 video |
| [ClaudiaRojasSoto/Martial_Arts](https://github.com/ClaudiaRojasSoto/Martial_Arts) | ⭐ 11 | JavaScript | This project is a web application for a martial arts tournament featuring Dragon Ball Z characters. It allows you to register participants, select their race, and assign them a power level.  |
| [Altiruss/Altiruss](https://github.com/Altiruss/Altiruss) | ⭐ 11 | N/A | ############################################################ # +------------------------------------------------------+ # # \|                       Notes                          \| # # +------------------------------------------------------+ # ############################################################  # If you want to use special characters in this document, such as accented letters, you MUST save the file as UTF-8, not ANSI. # If you receive an error when Essentials loads, ensure that: #   - No tabs are present: YAML only allows spaces #   - Indents are correct: YAML hierarchy is based entirely on indentation #   - You have "escaped" all apostrophes in your text: If you want to write "don't", for example, write "don''t" instead (note the doubled apostrophe) #   - Text with symbols is enclosed in single or double quotation marks  # If you have problems join the Essentials help support channel: http://tiny.cc/EssentialsChat  ############################################################ # +------------------------------------------------------+ # # \|                 Essentials (Global)                  \| # # +------------------------------------------------------+ # ############################################################  # A color code between 0-9 or a-f. Set to 'none' to disable. ops-name-color: 'none'  # The character(s) to prefix all nicknames, so that you know they are not true usernames. nickname-prefix: '~'  # Disable this if you have any other plugin, that modifies the displayname of a user. change-displayname: true  # When this option is enabled, the (tab) player list will be updated with the displayname. # The value of change-displayname (above) has to be true. #change-playerlist: true  # When essentialschat.jar isnt used, force essentials to add the prefix and suffix from permission plugins to displayname # This setting is ignored if essentialschat.jar is used, and defaults to 'true' # The value of change-displayname (above) has to be true. # Do not edit this setting unless you know what you are doing! #add-prefix-suffix: false  # The delay, in seconds, required between /home, /tp, etc. teleport-cooldown: 5  # The delay, in seconds, before a user actually teleports.  If the user moves or gets attacked in this timeframe, the teleport never occurs. teleport-delay: 5  # The delay, in seconds, a player can't be attacked by other players after they have been teleported by a command # This will also prevent the player attacking other players teleport-invulnerability: 4  # The delay, in seconds, required between /heal attempts heal-cooldown: 60  # What to prevent from /i /give # e.g item-spawn-blacklist: 46,11,10 item-spawn-blacklist:  # Set this to true if you want permission based item spawn rules # Note: The blacklist above will be ignored then. # Permissions: #  - essentials.itemspawn.item-all #  - essentials.itemspawn.item-[itemname] #  - essentials.itemspawn.item-[itemid] #  - essentials.give.item-all #  - essentials.give.item-[itemname] #  - essentials.give.item-[itemid] # For more information, visit http://wiki.ess3.net/wiki/Command_Reference/ICheat#Item.2FGive permission-based-item-spawn: false  # Mob limit on the /spawnmob command per execution spawnmob-limit: 10  # Shall we notify users when using /lightning warn-on-smite: true  # motd and rules are now configured in the files motd.txt and rules.txt  # When a command conflicts with another plugin, by default, Essentials will try to force the OTHER plugin to take priority. # Commands in this list, will tell Essentials to 'not give up' the command to other plugins. # In this state, which plugin 'wins' appears to be almost random. #  # If you have two plugin with the same command and you wish to force Essentials to take over, you need an alias. # To force essentials to take 'god' alias 'god' to 'egod'. # See http://wiki.bukkit.org/Bukkit.yml#aliases for more information  overridden-commands: #  - god  # Disabled commands will be completely unavailable on the server. # Disabling commands here will have no effect on command conflicts. disabled-commands: #  - nick  # These commands will be shown to players with socialSpy enabled # You can add commands from other plugins you may want to track or  # remove commands that are used for something you dont want to spy on socialspy-commands:   - msg   - w   - r   - mail   - m   - t   - whisper   - emsg   - tell   - er   - reply   - ereply   - email   - action   - describe   - eme   - eaction   - edescribe   - etell   - ewhisper   - pm  # If you do not wish to use a permission system, you can define a list of 'player perms' below. # This list has no effect if you are using a supported permissions system. # If you are using an unsupported permissions system simply delete this section. # Whitelist the commands and permissions you wish to give players by default (everything else is op only). # These are the permissions without the "essentials." part. player-commands:   - afk   - afk.auto   - back   - back.ondeath   - balance   - balance.others   - balancetop   - build   - chat.color   - chat.format   - chat.shout   - chat.question   - clearinventory   - compass   - depth   - delhome   - getpos   - geoip.show   - help   - helpop   - home   - home.others   - ignore   - info   - itemdb   - kit   - kits.tools   - list   - mail   - mail.send   - me   - motd   - msg   - msg.color   - nick   - near   - pay   - ping   - protect   - r   - rules   - realname   - seen   - sell   - sethome   - setxmpp   - signs.create.protection   - signs.create.trade   - signs.break.protection   - signs.break.trade   - signs.use.balance   - signs.use.buy   - signs.use.disposal   - signs.use.enchant   - signs.use.free   - signs.use.gamemode   - signs.use.heal   - signs.use.info   - signs.use.kit   - signs.use.mail   - signs.use.protection   - signs.use.repair   - signs.use.sell   - signs.use.time   - signs.use.trade   - signs.use.warp   - signs.use.weather   - spawn   - suicide   - time   - tpa   - tpaccept   - tpahere   - tpdeny   - warp   - warp.list   - world   - worth   - xmpp  # Note: All items MUST be followed by a quantity! # All kit names should be lower case, and will be treated as lower in permissions/costs. # Syntax: - itemID[:DataValue/Durability] Amount [Enchantment:Level].. [itemmeta:value]... # For Item meta information visit http://wiki.ess3.net/wiki/Item_Meta # 'delay' refers to the cooldown between how often you can use each kit, measured in seconds. # For more information, visit http://wiki.ess3.net/wiki/Kits kits:   tools:     delay: 10     items:       - 272 1       - 273 1       - 274 1       - 275 1   dtools:     delay: 600     items:       - 278 1 efficiency:1 durability:1 fortune:1 name:&4Gigadrill lore:The_drill_that_&npierces\|the_heavens       - 277 1 digspeed:3 name:Dwarf lore:Diggy\|Diggy\|Hole       - 298 1 color:255,255,255 name:Top_Hat lore:Good_day,_Good_day       - 279:780 1   notch:     delay: 6000     items:       - 397:3 1 player:Notch   color:     delay: 6000     items:       - 387 1 title:&4Book_&9o_&6Colors author:KHobbits lore:Ingame_color_codes book:Colors   firework:     delay: 6000     items:       - 401 1 name:Angry_Creeper color:red fade:green type:creeper power:1       - 401 1 name:StarryNight color:yellow,orange fade:blue type:star effect:trail,twinkle power:1       - 401 2 name:SolarWind color:yellow,orange fade:red shape:large effect:twinkle color:yellow,orange fade:red shape:ball effect:trail color:red,purple fade:pink shape:star effect:trail power:1  # Essentials Sign Control # See http://wiki.ess3.net/wiki/Sign_Tutorial for instructions on how to use these. # To enable signs, remove # symbol. To disable all signs, comment/remove each sign. # Essentials Colored sign support will be enabled when any sign types are enabled. # Color is not an actual sign, it's for enabling using color codes on signs, when the correct permissions are given.  enabledSigns:   #- color   #- balance   #- buy   #- sell   #- trade   #- free   #- disposal   #- warp   #- kit   #- mail   #- enchant   #- gamemode   #- heal   #- info   #- spawnmob   #- repair   #- time   #- weather    # How many times per second can Essentials signs be interacted with per player. # Values should be between 1-20, 20 being virtually no lag protection. # Lower numbers will reduce the possibility of lag, but may annoy players. sign-use-per-second: 4  # Backup runs a batch/bash command while saving is disabled backup:   # Interval in minutes   interval: 30   # Unless you add a valid backup command or script here, this feature will be useless.   # Use 'save-all' to simply force regular world saving without backup.   #command: 'rdiff-backup World1 backups/World1'  # Set this true to enable permission per warp. per-warp-permission: false  # Sort output of /list command by groups sort-list-by-groups: false  # More output to the console debug: false  # Set the locale for all messages # If you don't set this, the default locale of the server will be used. # For example, to set language to English, set locale to en, to use the file "messages_en.properties" # Don't forget to remove the # in front of the line # For more information, visit http://wiki.ess3.net/wiki/Locale #locale: en  # Turn off god mode when people exit remove-god-on-disconnect: false  # Auto-AFK # After this timeout in seconds, the user will be set as afk. # Set to -1 for no timeout. auto-afk: 300  # Auto-AFK Kick # After this timeout in seconds, the user will be kicked from the server. # Set to -1 for no timeout. auto-afk-kick: -1  # Set this to true, if you want to freeze the player, if he is afk. # Other players or monsters can't push him out of afk mode then. # This will also enable temporary god mode for the afk player. # The player has to use the command /afk to leave the afk mode. freeze-afk-players: false  # When the player is afk, should he be able to pickup items? # Enable this, when you don't want people idling in mob traps. disable-item-pickup-while-afk: false  # This setting controls if a player is marked as active on interaction. # When this setting is false, you will need to manually un-AFK using the /afk command. cancel-afk-on-interact: true  # Should we automatically remove afk status when the player moves? # Player will be removed from AFK on chat/command regardless of this setting. # Disable this to reduce server lag. cancel-afk-on-move: true  # You can disable the death messages of Minecraft here death-messages: true  # Add worlds to this list, if you want to automatically disable god mode there no-god-in-worlds: #  - world_nether  # Set to true to enable per-world permissions for teleporting between worlds with essentials commands # This applies to /world, /back, /tp[a\|o][here\|all], but not warps. # Give someone permission to teleport to a world with essentials.worlds.<worldname> # This does not affect the /home command, there is a separate toggle below for this. world-teleport-permissions: false  # The number of items given if the quantity parameter is left out in /item or /give. # If this number is below 1, the maximum stack size size is given. If over-sized stacks # are not enabled, any number higher than the maximum stack size results in more than one stack. default-stack-size: -1  # Over-sized stacks are stacks that ignore the normal max stack size. # They can be obtained using /give and /item, if the player has essentials.oversizedstacks permission. # How many items should be in an over-sized stack? oversized-stacksize: 64  # Allow repair of enchanted weapons and armor. # If you set this to false, you can still allow it for certain players using the permission # essentials.repair.enchanted repair-enchanted: true  # Allow 'unsafe' enchantments in kits and item spawning. # Warning: Mixing and overleveling some enchantments can cause issues with clients, servers and plugins. unsafe-enchantments: false  #Do you want essentials to keep track of previous location for /back in the teleport listener? #If you set this to true any plugin that uses teleport will have the previous location registered. register-back-in-listener: false  #Delay to wait before people can cause attack damage after logging in  login-attack-delay: 5  #Set the max fly speed, values range from 0.1 to 1.0 max-fly-speed: 0.8  #Set the maximum amount of mail that can be sent within a minute. mails-per-minute: 1000  # Set the maximum time /tempban can be used for in seconds. # Set to -1 to disable, and essentials.tempban.unlimited can be used to override. max-tempban-time: -1  ############################################################ # +------------------------------------------------------+ # # \|                   EssentialsHome                     \| # # +------------------------------------------------------+ # ############################################################  # Allows people to set their bed at daytime update-bed-at-daytime: true  # Set to true to enable per-world permissions for using homes to teleport between worlds # This applies to the /home only. # Give someone permission to teleport to a world with essentials.worlds.<worldname> world-home-permissions: false  # Allow players to have multiple homes. # Players need essentials.sethome.multiple before they can have more than 1 home, defaults to 'default' below. # Define different amounts of multiple homes for different permissions, e.g. essentials.sethome.multiple.vip # People with essentials.sethome.multiple.unlimited are not limited by these numbers. # For more information, visit http://wiki.ess3.net/wiki/Multihome sethome-multiple:     default: 3   # essentials.sethome.multiple.vip   vip: 5   # essentials.sethome.multiple.staff   staff: 10  # Set timeout in seconds for players to accept tpa before request is cancelled. # Set to 0 for no timeout tpa-accept-cancellation: 120  ############################################################ # +------------------------------------------------------+ # # \|                   EssentialsEco                      \| # # +------------------------------------------------------+ # ############################################################  # For more information, visit http://wiki.ess3.net/wiki/Essentials_Economy  # Defines the balance with which new players begin.  Defaults to 0. starting-balance: 0  # worth-# defines the value of an item when it is sold to the server via /sell. # These are now defined in worth.yml  # Defines the cost to use the given commands PER USE # Some commands like /repair have sub-costs, check the wiki for more information. command-costs:   # /example costs $1000 PER USE   #example: 1000   # /kit tools costs $1500 PER USE   #kit-tools: 1500  # Set this to a currency symbol you want to use. currency-symbol: '$'  # Set the maximum amount of money a player can have # The amount is always limited to 10 trillion because of the limitations of a java double max-money: 10000000000000  # Set the minimum amount of money a player can have (must be above the negative of max-money). # Setting this to 0, will disable overdrafts/loans completely.  Users need 'essentials.eco.loan' perm to go below 0. min-money: -10000  # Enable this to log all interactions with trade/buy/sell signs and sell command economy-log-enabled: false  ############################################################ # +------------------------------------------------------+ # # \|                   EssentialsHelp                     \| # # +------------------------------------------------------+ # ############################################################  # Show other plugins commands in help non-ess-in-help: true  # Hide plugins which do not give a permission # You can override a true value here for a single plugin by adding a permission to a user/group. # The individual permission is: essentials.help.<plugin>, anyone with essentials.* or '*' will see all help regardless. # You can use negative permissions to remove access to just a single plugins help if the following is enabled. hide-permissionless-help: true  ############################################################ # +------------------------------------------------------+ # # \|                   EssentialsChat                     \| # # +------------------------------------------------------+ # ############################################################  chat:    # If EssentialsChat is installed, this will define how far a player's voice travels, in blocks.  Set to 0 to make all chat global.   # Note that users with the "essentials.chat.spy" permission will hear everything, regardless of this setting.   # Users with essentials.chat.shout can override this by prefixing text with an exclamation mark (!)   # Users with essentials.chat.question can override this by prefixing text with a question mark (?)   # You can add command costs for shout/question by adding chat-shout and chat-question to the command costs section."   radius: 0    # Chat formatting can be done in two ways, you can either define a standard format for all chat   # Or you can give a group specific chat format, to give some extra variation.   # If set to the default chat format which "should" be compatible with ichat.   # For more information of chat formatting, check out the wiki: http://wiki.ess3.net/wiki/Chat_Formatting      format: '&l{DISPLAYNAME} &3➽ &f&l{MESSAGE}'   Dziewczyna: '{DISPLAYNAME} &3➽ &5 {MESSAGE}'   #format: '&7[{GROUP}]&r {DISPLAYNAME}&7:&r {MESSAGE}'    group-formats:   #  Default: '{WORLDNAME} {DISPLAYNAME}&7:&r {MESSAGE}'   #  Admins: '{WORLDNAME} &c[{GROUP}]&r {DISPLAYNAME}&7:&c {MESSAGE}'    # If you are using group formats make sure to remove the '#' to allow the setting to be read.  ############################################################ # +------------------------------------------------------+ # # \|                 EssentialsProtect                    \| # # +------------------------------------------------------+ # ############################################################  protect:   # Database settings for sign/rail protection    # mysql or sqlite   # We strongly recommend against using mysql here, unless you have a good reason.   # Sqlite seems to be faster in almost all cases, and in some cases mysql can be much slower.   datatype: 'sqlite'    # If you specified MySQL above, you MUST enter the appropriate details here.   # If you specified SQLite above, these will be IGNORED.   username: 'root'   password: 'root'   mysqlDb: 'jdbc:mysql://localhost:3306/minecraft'    # General physics/behavior modifications   prevent:     lava-flow: false     water-flow: false     water-bucket-flow: false     fire-spread: true     lava-fire-spread: true     flint-fire: false     lightning-fire-spread: true     portal-creation: false     tnt-explosion: false     tnt-playerdamage: false     fireball-explosion: false     fireball-fire: false     fireball-playerdamage: false     witherskull-explosion: false     witherskull-playerdamage: false     wither-spawnexplosion: false     wither-blockreplace: false     creeper-explosion: false     creeper-playerdamage: false     creeper-blockdamage: false     enderdragon-blockdamage: true     enderman-pickup: false     villager-death: false     # Monsters won't follow players     # permission essentials.protect.entitytarget.bypass disables this     entitytarget: false     # Prevent the spawning of creatures     spawn:       creeper: false       skeleton: false       spider: false       giant: false       zombie: false       slime: false       ghast: false       pig_zombie: false       enderman: false       cave_spider: false       silverfish: false       blaze: false       magma_cube: false       ender_dragon: false       pig: false       sheep: false       cow: false       chicken: false       squid: false       wolf: false       mushroom_cow: false       snowman: false       ocelot: false       iron_golem: false       villager: false       wither: false       bat: false       witch: false          # Maximum height the creeper should explode. -1 allows them to explode everywhere.   # Set prevent.creeper-explosion to true, if you want to disable creeper explosions.   creeper:     max-height: -1    # Protect various blocks.   protect:     # Protect all signs     signs: false      # Prevent users from destroying rails     rails: false      # Blocks below rails/signs are also protected if the respective rail/sign is protected.     # This makes it more difficult to circumvent protection, and should be enabled.     # This only has an effect if "rails" or "signs" is also enabled.     block-below: true      # Prevent placing blocks above protected rails, this is to stop a potential griefing     prevent-block-on-rails: false      # Store blocks / signs in memory before writing     memstore: false    # Disable various default physics and behaviors   disable:     # Should fall damage be disabled?     fall: false      # Users with the essentials.protect.pvp permission will still be able to attack each other if this is set to true.     # They will be unable to attack users without that same permission node.     pvp: false      # Should drowning damage be disabled?     # (Split into two behaviors; generally, you want both set to the same value)     drown: false     suffocate: false      # Should damage via lava be disabled?  Items that fall into lava will still burn to a crisp. ;)     lavadmg: false      # Should arrow damage be disabled     projectiles: false      # This will disable damage from touching cacti.     contactdmg: false      # Burn, baby, burn!  Should fire damage be disabled?     firedmg: false      # Should the damage after hit by a lightning be disabled?     lightning: false          # Should Wither damage be disabled?     wither: false      # Disable weather options     weather:       storm: false       thunder: false       lightning: false       ############################################################ # +------------------------------------------------------+ # # \|                EssentialsAntiBuild                   \| # # +------------------------------------------------------+ # ############################################################    # Disable various default physics and behaviors   # For more information, visit http://wiki.ess3.net/wiki/AntiBuild      # Should people with build: false in permissions be allowed to build     # Set true to disable building for those people     # Setting to false means EssentialsAntiBuild will never prevent you from building     build: true      # Should people with build: false in permissions be allowed to use items     # Set true to disable using for those people     # Setting to false means EssentialsAntiBuild will never prevent you from using     use: true      # Should we tell people they are not allowed to build     warn-on-build-disallow: true    # For which block types would you like to be alerted?   # You can find a list of IDs in plugins/Essentials/items.csv after loading Essentials for the first time.   # 10 = lava :: 11 = still lava :: 46 = TNT :: 327 = lava bucket   alert:     on-placement: 10,11,46,327     on-use: 327     on-break:    blacklist:      # Which blocks should people be prevented from placing     placement: 10,11,46,327      # Which items should people be prevented from using     usage: 327      # Which blocks should people be prevented from breaking     break:      # Which blocks should not be pushed by pistons     piston:  ############################################################ # +------------------------------------------------------+ # # \|            Essentials Spawn / New Players            \| # # +------------------------------------------------------+ # ############################################################  newbies:   # Should we announce to the server when someone logs in for the first time?   # If so, use this format, replacing {DISPLAYNAME} with the player name.   # If not, set to ''   #announce-format: ''   announce-format: '&dWelcome {DISPLAYNAME}&d to the server!'    # When we spawn for the first time, which spawnpoint do we use?   # Set to "none" if you want to use the spawn point of the world.   spawnpoint: newbies    # Do we want to give users anything on first join? Set to '' to disable   # This kit will be given regardless  of cost, and permissions.   #kit: ''   kit: tools  # Set this to lowest, if you want Multiverse to handle the respawning # Set this to high, if you want EssentialsSpawn to handle the respawning # Set this to highest, if you want to force EssentialsSpawn to handle the respawning respawn-listener-priority: high  # When users die, should they respawn at their first home or bed, instead of the spawnpoint? respawn-at-home: false  # End of File <-- No seriously, you're done with configuration. |
| [MatrixDJ96/DBZBT3](https://github.com/MatrixDJ96/DBZBT3) | ⭐ 10 | C++ | AFL-Converter v1.0.2.1, AFS-Manager 0.0.0.8 [WIP], CTE-Plugin v1.0.0.0 [Not released] |
| [Maufeat/DragonBallOnline](https://github.com/Maufeat/DragonBallOnline) | ⭐ 10 | C++ | DragonBall Online Client Development (Base: KR 0.50) |
| [rogueyoshi/dbfz-css](https://github.com/rogueyoshi/dbfz-css) | ⭐ 10 | CSS | A CSS library recreation of DRAGON BALL FighterZ's in-game UI elements.  Used by Bandai Namco's official Dragon Ball World Tour streams and promotional material! |
| [mindsetpro/DBLMAPI](https://github.com/mindsetpro/DBLMAPI) | ⭐ 10 | Python | A python module for modding the game Dragon Ball Legends with its files |
| [lucas-tardivo/universoz](https://github.com/lucas-tardivo/universoz) | ⭐ 10 | VBA | Universo Z foi um MMORPG baseado em Dragon Ball Z criado por fãs em 2013. Este repositório é sua engine original criada em VB6. |
| [adithyaakrishna/DragonBall-VSC-Theme](https://github.com/adithyaakrishna/DragonBall-VSC-Theme) | ⭐ 10 | N/A | A VS-Code Theme Inspired By Dragon Ball Super |
| [duongviet2904/unity-dragon-ball](https://github.com/duongviet2904/unity-dragon-ball) | ⭐ 10 | C# | Combat dragon ball game with Unity 2D |
| [JacobEdelen/DragonBallZ-Easy68K](https://github.com/JacobEdelen/DragonBallZ-Easy68K) | ⭐ 10 | N/A | My first game written completely in assembly |
| [NicosNicolaou16/EyeDropper_API](https://github.com/NicosNicolaou16/EyeDropper_API) | ⭐ 10 | Kotlin | This open-source project demonstrates the implementation of the Eye Dropper API in Android using Jetpack Compose. It allows users to precisely pick colors from any part of the screen or specific images, making it an essential tool for creative and design-oriented applications. |
| [int04/dragon-ball-h5-MMO](https://github.com/int04/dragon-ball-h5-MMO) | ⭐ 9 | JavaScript | Dragon Ball Online H5 MMO - Chú bé rồng H5 Online |
| [int04/dragon-ball-h5-MMO-Server](https://github.com/int04/dragon-ball-h5-MMO-Server) | ⭐ 9 | JavaScript | Dragon Ball Online H5 MMO - Chú bé rồng H5 Online |
| [juanppdev/Dragon-Ball](https://github.com/juanppdev/Dragon-Ball) | ⭐ 9 | Kotlin | App de Dragon Ball, usando una Api externa |
| [darkruss48/Polar](https://github.com/darkruss48/Polar) | ⭐ 9 | C++ | A simple, powerful WT Performance Analyser for Dragon Ball Z : Dokkan Battle. |
| [MishraShardendu22/Dragon-Ball-Api](https://github.com/MishraShardendu22/Dragon-Ball-Api) | ⭐ 9 | HTML | Open Sourced to Keploy: Love Dragon Ball ? This API is for you !!!! Live on - https://dragon-ball-api-grlr.onrender.com |
| [AccessForge/SparkingZeroAccess](https://github.com/AccessForge/SparkingZeroAccess) | ⭐ 9 | Lua | Screen reader accessibility mod for DRAGON BALL: Sparking! ZERO |
| [RONALDYRONALD/TV1](https://github.com/RONALDYRONALD/TV1) | ⭐ 9 | N/A | #EXTM3U   #EXTINF:-1, A&E http://bgapp.live/play/14-405.php?c=1&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, A&E Sur http://bgapp.live/play/14-405.php?c=734&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, A&E http://bgapp.live/play/14-405.php?c=474&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, A+ http://bgapp.live/play/14-405.php?c=406&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, A3Series http://bgapp.live/play/14-405.php?c=444&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, ADN 40 http://bgapp.live/play/14-405.php?c=447&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Afizzionados http://bgapp.live/play/14-405.php?c=878&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Alf 24/7 http://bgapp.live/play/14-405.php?c=426&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, AMC http://bgapp.live/play/14-405.php?c=183&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, AMC ES http://bgapp.live/play/14-405.php?c=715&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, AMC http://bgapp.live/play/14-405.php?c=475&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, America http://bgapp.live/play/14-405.php?c=780&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Animal Planet http://bgapp.live/play/14-405.php?c=3&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Animal Planet http://bgapp.live/play/14-405.php?c=633&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Animaniacs 24/7 http://bgapp.live/play/14-405.php?c=677&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Antena 3 http://bgapp.live/play/14-405.php?c=298&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, AXN http://bgapp.live/play/14-405.php?c=146&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, AXN Sur http://bgapp.live/play/14-405.php?c=804&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, AXN (ES) http://bgapp.live/play/14-405.php?c=713&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, AXN http://bgapp.live/play/14-405.php?c=476&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, AXN WHITE (ES) http://bgapp.live/play/14-405.php?c=714&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, AyM Sports http://bgapp.live/play/14-405.php?c=148&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Az Cinema http://bgapp.live/play/14-405.php?c=186&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Az Clic http://bgapp.live/play/14-405.php?c=165&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Az Corazón http://bgapp.live/play/14-405.php?c=166&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Az Corazón http://bgapp.live/play/14-405.php?c=834&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Azteca 1 http://bgapp.live/play/14-405.php?c=4&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Azteca 1 http://bgapp.live/play/14-405.php?c=634&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Azteca 7 http://bgapp.live/play/14-405.php?c=5&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Azteca 7 http://bgapp.live/play/14-405.php?c=635&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Baby TV http://bgapp.live/play/14-405.php?c=7&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Bandamax http://bgapp.live/play/14-405.php?c=8&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Bandamax http://bgapp.live/play/14-405.php?c=833&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Barbie 24/7 http://bgapp.live/play/14-405.php?c=788&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Bein http://bgapp.live/play/14-405.php?c=763&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, BeinSports http://bgapp.live/play/14-405.php?c=753&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, BeinSports http://bgapp.live/play/14-405.php?c=9&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, BeinSports Ñ http://bgapp.live/play/14-405.php?c=761&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, BeinSports Ñ http://bgapp.live/play/14-405.php?c=376&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Bob Esponja 24/7 http://bgapp.live/play/14-405.php?c=518&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Bolivision http://bgapp.live/play/14-405.php?c=783&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Breaking Bad 24/7 http://bgapp.live/play/14-405.php?c=846&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Brickleberry 24/7 http://bgapp.live/play/14-405.php?c=789&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Caballeros del Zodiaco 24/7 http://bgapp.live/play/14-405.php?c=427&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Canal 5 http://bgapp.live/play/14-405.php?c=14&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Canal 5 Honduras http://bgapp.live/play/14-405.php?c=773&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Canal de las Estrellas http://bgapp.live/play/14-405.php?c=411&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Canal de las Estrellas Sur http://bgapp.live/play/14-405.php?c=736&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Canal de las Estrellas http://bgapp.live/play/14-405.php?c=636&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Canal Del Futbol http://bgapp.live/play/14-405.php?c=892&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Canal+ Accion http://bgapp.live/play/14-405.php?c=364&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Canal+ Toros http://bgapp.live/play/14-405.php?c=369&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Candy Candy 24/7 http://bgapp.live/play/14-405.php?c=808&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cantinflas 24/7 http://bgapp.live/play/14-405.php?c=428&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Capital TV http://bgapp.live/play/14-405.php?c=205&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Caracol http://bgapp.live/play/14-405.php?c=391&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Caracol Internacional http://bgapp.live/play/14-405.php?c=290&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cartoon Network http://bgapp.live/play/14-405.php?c=17&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cartoon Network Sur http://bgapp.live/play/14-405.php?c=737&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cartoon Network http://bgapp.live/play/14-405.php?c=637&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cartoonito (Boomerang) http://bgapp.live/play/14-405.php?c=11&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cartoonito (Boomerang) http://bgapp.live/play/14-405.php?c=824&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cartoonito Sur http://bgapp.live/play/14-405.php?c=735&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, CatDog 24/7 http://bgapp.live/play/14-405.php?c=785&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, CBeebies http://bgapp.live/play/14-405.php?c=13&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, CDF Premium http://bgapp.live/play/14-405.php?c=318&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, CDF Premium http://bgapp.live/play/14-405.php?c=725&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, CDN Sportsmax http://bgapp.live/play/14-405.php?c=206&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, CDO Premium http://bgapp.live/play/14-405.php?c=401&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Chapulin Colorado 24/7 http://bgapp.live/play/14-405.php?c=418&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Chespirito 24/7 http://bgapp.live/play/14-405.php?c=417&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Accion http://bgapp.live/play/14-405.php?c=699&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Accion http://bgapp.live/play/14-405.php?c=706&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Accion Sagas http://bgapp.live/play/14-405.php?c=700&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Accion Sagas http://bgapp.live/play/14-405.php?c=707&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Comedia 1 http://bgapp.live/play/14-405.php?c=695&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Comedia 2 http://bgapp.live/play/14-405.php?c=696&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Ficcion/Fantasia 1 http://bgapp.live/play/14-405.php?c=709&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Ficcion/Fantasia 2 http://bgapp.live/play/14-405.php?c=710&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Ficcion/Fantasia http://bgapp.live/play/14-405.php?c=712&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Infantil http://bgapp.live/play/14-405.php?c=687&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Infantil http://bgapp.live/play/14-405.php?c=702&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Infantil Sagas http://bgapp.live/play/14-405.php?c=694&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Infantil Sagas http://bgapp.live/play/14-405.php?c=703&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Latino http://bgapp.live/play/14-405.php?c=295&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Marvel http://bgapp.live/play/14-405.php?c=697&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Marvel http://bgapp.live/play/14-405.php?c=701&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Romance http://bgapp.live/play/14-405.php?c=689&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Romance http://bgapp.live/play/14-405.php?c=705&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cine Zombis http://bgapp.live/play/14-405.php?c=688&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cinecanal http://bgapp.live/play/14-405.php?c=18&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cinecanal Sur http://bgapp.live/play/14-405.php?c=738&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cinecanal http://bgapp.live/play/14-405.php?c=479&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cinemax http://bgapp.live/play/14-405.php?c=20&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cinemax Sur http://bgapp.live/play/14-405.php?c=739&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Cinemax http://bgapp.live/play/14-405.php?c=638&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Claro Sports http://bgapp.live/play/14-405.php?c=328&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, CNN en Español http://bgapp.live/play/14-405.php?c=136&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Comedy Central http://bgapp.live/play/14-405.php?c=135&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Comedy Central Sur http://bgapp.live/play/14-405.php?c=740&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Comedy Central (ES) http://bgapp.live/play/14-405.php?c=719&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Comedy Central http://bgapp.live/play/14-405.php?c=480&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Coraje el Perro Cobarde 24/7 http://bgapp.live/play/14-405.php?c=519&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Crime Investigation (ES) http://bgapp.live/play/14-405.php?c=720&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, De Película http://bgapp.live/play/14-405.php?c=21&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, De Pelicula http://bgapp.live/play/14-405.php?c=481&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, DHE http://bgapp.live/play/14-405.php?c=844&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Dinosaurios 24/7 http://bgapp.live/play/14-405.php?c=670&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, DirectTV Sports http://bgapp.live/play/14-405.php?c=259&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, DirectTV Sports 2 http://bgapp.live/play/14-405.php?c=667&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, DirectTV Sports Peru http://bgapp.live/play/14-405.php?c=879&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery Channel http://bgapp.live/play/14-405.php?c=22&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery Channel Sur http://bgapp.live/play/14-405.php?c=741&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery Channel http://bgapp.live/play/14-405.php?c=639&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery Civilization http://bgapp.live/play/14-405.php?c=23&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery H&H http://bgapp.live/play/14-405.php?c=24&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery H&H Sur http://bgapp.live/play/14-405.php?c=742&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery H&H http://bgapp.live/play/14-405.php?c=640&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery Kids http://bgapp.live/play/14-405.php?c=25&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery Kids http://bgapp.live/play/14-405.php?c=641&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery SCI http://bgapp.live/play/14-405.php?c=26&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery Theater http://bgapp.live/play/14-405.php?c=27&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery Turbo http://bgapp.live/play/14-405.php?c=28&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery Turbo http://bgapp.live/play/14-405.php?c=727&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Discovery World http://bgapp.live/play/14-405.php?c=187&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Disney Channel http://bgapp.live/play/14-405.php?c=29&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Disney Junior http://bgapp.live/play/14-405.php?c=30&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Disney Junior Sur http://bgapp.live/play/14-405.php?c=743&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Disney Junior http://bgapp.live/play/14-405.php?c=826&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Disney XD http://bgapp.live/play/14-405.php?c=31&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Disney XD Sur http://bgapp.live/play/14-405.php?c=744&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Disney XD http://bgapp.live/play/14-405.php?c=827&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Distrito Comedia http://bgapp.live/play/14-405.php?c=32&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Doraemon 24/7 http://bgapp.live/play/14-405.php?c=521&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Dragon Ball 24/7 http://bgapp.live/play/14-405.php?c=425&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Dragon Ball GT 24/7 http://bgapp.live/play/14-405.php?c=520&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Dragon Ball Super 24/7 http://bgapp.live/play/14-405.php?c=424&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Dragon Ball Z 24/7 http://bgapp.live/play/14-405.php?c=329&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, E! http://bgapp.live/play/14-405.php?c=33&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, E! http://bgapp.live/play/14-405.php?c=483&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Ecuavisa http://bgapp.live/play/14-405.php?c=319&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El 13 Argentina http://bgapp.live/play/14-405.php?c=239&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Chavo Animado 24/7 http://bgapp.live/play/14-405.php?c=790&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Chavo del 8 24/7 http://bgapp.live/play/14-405.php?c=400&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Coyote y el Correcaminos 24/7 http://bgapp.live/play/14-405.php?c=429&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Gallo Claudio 24/7 http://bgapp.live/play/14-405.php?c=845&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Gourmet http://bgapp.live/play/14-405.php?c=157&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Increible Mundo de Gumball 24/7 http://bgapp.live/play/14-405.php?c=791&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Nueve http://bgapp.live/play/14-405.php?c=772&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Pajaro Loco 24/7 http://bgapp.live/play/14-405.php?c=525&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Principel del Rap 24/7 http://bgapp.live/play/14-405.php?c=430&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Señor de los Cielos 24/7 http://bgapp.live/play/14-405.php?c=820&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Trece http://bgapp.live/play/14-405.php?c=765&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, El Trece http://bgapp.live/play/14-405.php?c=767&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, ESPN http://bgapp.live/play/14-405.php?c=34&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, ESPN 2 http://bgapp.live/play/14-405.php?c=35&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, ESPN 2 http://bgapp.live/play/14-405.php?c=484&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, ESPN 2 MX http://bgapp.live/play/14-405.php?c=531&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, ESPN 3 http://bgapp.live/play/14-405.php?c=485&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, ESPN Chile http://bgapp.live/play/14-405.php?c=842&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, ESPN http://bgapp.live/play/14-405.php?c=486&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, ESPN MX http://bgapp.live/play/14-405.php?c=530&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, ESPN Plus http://bgapp.live/play/14-405.php?c=37&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, ESPN Plus http://bgapp.live/play/14-405.php?c=487&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Estrella TV http://bgapp.live/play/14-405.php?c=177&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Film & Arts http://bgapp.live/play/14-405.php?c=149&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Film & Arts (EN) http://bgapp.live/play/14-405.php?c=729&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Formula 1 TV (F1) http://bgapp.live/play/14-405.php?c=192&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sur http://bgapp.live/play/14-405.php?c=750&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Life Sur http://bgapp.live/play/14-405.php?c=746&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports http://bgapp.live/play/14-405.php?c=52&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports 2 http://bgapp.live/play/14-405.php?c=53&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports 2 Argentina http://bgapp.live/play/14-405.php?c=770&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports 2 http://bgapp.live/play/14-405.php?c=494&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports 2 MX http://bgapp.live/play/14-405.php?c=528&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports 3 http://bgapp.live/play/14-405.php?c=54&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports 3 http://bgapp.live/play/14-405.php?c=839&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports Argentina http://bgapp.live/play/14-405.php?c=769&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports http://bgapp.live/play/14-405.php?c=493&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports MX http://bgapp.live/play/14-405.php?c=527&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports MX Sur http://bgapp.live/play/14-405.php?c=748&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports Premium http://bgapp.live/play/14-405.php?c=512&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports Premium http://bgapp.live/play/14-405.php?c=658&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports Sur http://bgapp.live/play/14-405.php?c=402&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports Sur 2 http://bgapp.live/play/14-405.php?c=410&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Fox Sports Sur 3 http://bgapp.live/play/14-405.php?c=511&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Futurama 24/7 http://bgapp.live/play/14-405.php?c=793&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, FX http://bgapp.live/play/14-405.php?c=42&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, FX Sur http://bgapp.live/play/14-405.php?c=749&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, FX http://bgapp.live/play/14-405.php?c=495&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, FXM http://bgapp.live/play/14-405.php?c=43&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, FXM http://bgapp.live/play/14-405.php?c=488&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Gala TV http://bgapp.live/play/14-405.php?c=56&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Gala TV http://bgapp.live/play/14-405.php?c=651&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Gamavision http://bgapp.live/play/14-405.php?c=891&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Game of Thrones 24/7 http://bgapp.live/play/14-405.php?c=515&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Garfield 24/7 http://bgapp.live/play/14-405.php?c=812&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Glitz http://bgapp.live/play/14-405.php?c=158&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Gol Peru http://bgapp.live/play/14-405.php?c=686&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Gol TV http://bgapp.live/play/14-405.php?c=287&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Gol TV http://bgapp.live/play/14-405.php?c=514&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Golden http://bgapp.live/play/14-405.php?c=57&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Golden Edge http://bgapp.live/play/14-405.php?c=58&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Golden http://bgapp.live/play/14-405.php?c=496&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, H2 http://bgapp.live/play/14-405.php?c=61&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, H2 Sur http://bgapp.live/play/14-405.php?c=760&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO http://bgapp.live/play/14-405.php?c=62&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO (EN) http://bgapp.live/play/14-405.php?c=723&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO 2 http://bgapp.live/play/14-405.php?c=300&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO 2 (EN) http://bgapp.live/play/14-405.php?c=724&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO 2 http://bgapp.live/play/14-405.php?c=732&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO 2 (EN) http://bgapp.live/play/14-405.php?c=733&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO Family http://bgapp.live/play/14-405.php?c=63&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO http://bgapp.live/play/14-405.php?c=654&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO Plus http://bgapp.live/play/14-405.php?c=64&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO Plus (EN) http://bgapp.live/play/14-405.php?c=722&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO Plus http://bgapp.live/play/14-405.php?c=655&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO Plus Oeste http://bgapp.live/play/14-405.php?c=728&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO Xtreme http://bgapp.live/play/14-405.php?c=814&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HBO Xtreme http://bgapp.live/play/14-405.php?c=841&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HCH http://bgapp.live/play/14-405.php?c=779&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Hey Arnold 24/7 http://bgapp.live/play/14-405.php?c=522&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Historia (ES) http://bgapp.live/play/14-405.php?c=718&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, History Channel http://bgapp.live/play/14-405.php?c=67&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, History Channel http://bgapp.live/play/14-405.php?c=642&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Hola TV http://bgapp.live/play/14-405.php?c=189&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, HTV http://bgapp.live/play/14-405.php?c=66&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, I.Sat http://bgapp.live/play/14-405.php?c=153&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Imagen Television http://bgapp.live/play/14-405.php?c=341&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Imagen Televisión http://bgapp.live/play/14-405.php?c=643&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Investigation Discovery http://bgapp.live/play/14-405.php?c=68&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Investigation Discovery http://bgapp.live/play/14-405.php?c=825&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Johnny Bravo 24/7 http://bgapp.live/play/14-405.php?c=786&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, La Familia PeLuche 24/7 http://bgapp.live/play/14-405.php?c=811&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, La Hora Pico 24/7 http://bgapp.live/play/14-405.php?c=887&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, La Pantera Rosa 24/7 http://bgapp.live/play/14-405.php?c=671&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, La Pequeña Lulu 24/7 http://bgapp.live/play/14-405.php?c=792&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, La Rosa de Guadalupe 24/7 http://bgapp.live/play/14-405.php?c=886&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, La Vaca y ElPollito 24/7 http://bgapp.live/play/14-405.php?c=809&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Latina TV http://bgapp.live/play/14-405.php?c=782&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Le Temes a la Oscuridad 24/7 http://bgapp.live/play/14-405.php?c=888&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Lifetime http://bgapp.live/play/14-405.php?c=152&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Liga de Campeones http://bgapp.live/play/14-405.php?c=890&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Liga de Campeones 2 http://bgapp.live/play/14-405.php?c=893&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Looney Tunes 24/7 http://bgapp.live/play/14-405.php?c=524&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Los 3 Chiflados 24/7 http://bgapp.live/play/14-405.php?c=423&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Los Años Maravillosos 24/7 http://bgapp.live/play/14-405.php?c=810&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Los Padrinos Magicos 24/7 http://bgapp.live/play/14-405.php?c=813&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Los Picapiedra 24/7 http://bgapp.live/play/14-405.php?c=669&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Los Pinguinos de Madagascar 24/7 http://bgapp.live/play/14-405.php?c=794&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Los Pitufos 24/7 http://bgapp.live/play/14-405.php?c=795&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Los Reyes de la Colina 24/7 http://bgapp.live/play/14-405.php?c=796&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Los Simpson 24/7 http://bgapp.live/play/14-405.php?c=357&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Los Supersonicos 24/7 http://bgapp.live/play/14-405.php?c=797&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Los Vengadores Unidos 24/7 http://bgapp.live/play/14-405.php?c=818&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Malcolm 24/7 http://bgapp.live/play/14-405.php?c=798&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Más chic http://bgapp.live/play/14-405.php?c=180&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Max Prime http://bgapp.live/play/14-405.php?c=730&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Max Steel 24/7 http://bgapp.live/play/14-405.php?c=880&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Max Up http://bgapp.live/play/14-405.php?c=659&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Mega http://bgapp.live/play/14-405.php?c=766&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Mega http://bgapp.live/play/14-405.php?c=784&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Mega (ES) http://bgapp.live/play/14-405.php?c=352&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, MegaCine http://bgapp.live/play/14-405.php?c=517&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, MLB Network http://bgapp.live/play/14-405.php?c=293&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Movie Max http://bgapp.live/play/14-405.php?c=678&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Movistar Comedia http://bgapp.live/play/14-405.php?c=370&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Movistar Deportes http://bgapp.live/play/14-405.php?c=366&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Movistar Deportes 2 http://bgapp.live/play/14-405.php?c=367&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Movistar Xtra http://bgapp.live/play/14-405.php?c=372&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Mr. Bean 24/7 http://bgapp.live/play/14-405.php?c=431&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, MTV http://bgapp.live/play/14-405.php?c=69&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, MTV (ES) http://bgapp.live/play/14-405.php?c=803&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, MTV http://bgapp.live/play/14-405.php?c=828&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, MTV Live http://bgapp.live/play/14-405.php?c=70&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, MTV Sur http://bgapp.live/play/14-405.php?c=823&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Multimedios http://bgapp.live/play/14-405.php?c=155&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, MultiPremier http://bgapp.live/play/14-405.php?c=294&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Music Now http://bgapp.live/play/14-405.php?c=690&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Naruto 24/7 http://bgapp.live/play/14-405.php?c=523&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nat Geo http://bgapp.live/play/14-405.php?c=76&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nat Geo http://bgapp.live/play/14-405.php?c=644&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nat Geo Kids http://bgapp.live/play/14-405.php?c=412&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nat Geo Wild http://bgapp.live/play/14-405.php?c=77&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nat Geo Wild http://bgapp.live/play/14-405.php?c=497&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, NBA http://bgapp.live/play/14-405.php?c=838&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Neox (ES) http://bgapp.live/play/14-405.php?c=353&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, NFL Network http://bgapp.live/play/14-405.php?c=204&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nick http://bgapp.live/play/14-405.php?c=78&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nick 2 http://bgapp.live/play/14-405.php?c=646&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nick http://bgapp.live/play/14-405.php?c=645&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nick JR http://bgapp.live/play/14-405.php?c=79&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nick JR http://bgapp.live/play/14-405.php?c=829&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nick Toons http://bgapp.live/play/14-405.php?c=80&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nickelodeon http://bgapp.live/play/14-405.php?c=184&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Nova (ES) http://bgapp.live/play/14-405.php?c=717&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, One Punch Man 24/7 http://bgapp.live/play/14-405.php?c=661&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Padre de Familia 24/7 http://bgapp.live/play/14-405.php?c=416&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Paramount http://bgapp.live/play/14-405.php?c=200&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Paramount http://bgapp.live/play/14-405.php?c=647&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Pasiones http://bgapp.live/play/14-405.php?c=755&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Patoaventuras 24/7 http://bgapp.live/play/14-405.php?c=819&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Patrulla Canina 24/7 http://bgapp.live/play/14-405.php?c=807&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Peppa Pig 24/7 http://bgapp.live/play/14-405.php?c=787&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, PERU: Latina http://bgapp.live/play/14-405.php?c=317&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, PERU: TV Peru http://bgapp.live/play/14-405.php?c=306&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Pinky y Cerebro 24/7 http://bgapp.live/play/14-405.php?c=721&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Pocoyo 24/7 http://bgapp.live/play/14-405.php?c=799&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Pokemon 24/7 http://bgapp.live/play/14-405.php?c=420&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Ranma 1/2 24/7 http://bgapp.live/play/14-405.php?c=419&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, RCN http://bgapp.live/play/14-405.php?c=390&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Retro Music http://bgapp.live/play/14-405.php?c=692&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Ritmoson Latino http://bgapp.live/play/14-405.php?c=154&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, RTP http://bgapp.live/play/14-405.php?c=781&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Sakura Card Captor 24/7 http://bgapp.live/play/14-405.php?c=672&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Samurai X 24/7 http://bgapp.live/play/14-405.php?c=663&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Scooby Doo 24/7 http://bgapp.live/play/14-405.php?c=422&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Showtime http://bgapp.live/play/14-405.php?c=679&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Smallville 24/7 http://bgapp.live/play/14-405.php?c=673&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Sony http://bgapp.live/play/14-405.php?c=145&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Sony http://bgapp.live/play/14-405.php?c=498&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, South Park 24/7 http://bgapp.live/play/14-405.php?c=674&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Space http://bgapp.live/play/14-405.php?c=83&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Space Sur http://bgapp.live/play/14-405.php?c=751&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Space http://bgapp.live/play/14-405.php?c=499&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Spiderman 24/7 http://bgapp.live/play/14-405.php?c=889&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star http://bgapp.live/play/14-405.php?c=45&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Action http://bgapp.live/play/14-405.php?c=46&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Action http://bgapp.live/play/14-405.php?c=490&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Cinema http://bgapp.live/play/14-405.php?c=47&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Classics http://bgapp.live/play/14-405.php?c=48&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Fun http://bgapp.live/play/14-405.php?c=49&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Fun http://bgapp.live/play/14-405.php?c=840&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star http://bgapp.live/play/14-405.php?c=489&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Hits http://bgapp.live/play/14-405.php?c=51&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Hits Sur http://bgapp.live/play/14-405.php?c=747&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Hits http://bgapp.live/play/14-405.php?c=491&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Life http://bgapp.live/play/14-405.php?c=50&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Life http://bgapp.live/play/14-405.php?c=652&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Series http://bgapp.live/play/14-405.php?c=303&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Series Sur http://bgapp.live/play/14-405.php?c=745&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Star Series http://bgapp.live/play/14-405.php?c=492&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Starz Cinema http://bgapp.live/play/14-405.php?c=680&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Starz Comedy http://bgapp.live/play/14-405.php?c=681&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Starz Encore Action http://bgapp.live/play/14-405.php?c=682&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Starz Encore Black http://bgapp.live/play/14-405.php?c=683&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Starz Encore Family http://bgapp.live/play/14-405.php?c=684&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Starz http://bgapp.live/play/14-405.php?c=685&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Studio Universal http://bgapp.live/play/14-405.php?c=84&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Studio Universal http://bgapp.live/play/14-405.php?c=830&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Super Campeones 24/7 http://bgapp.live/play/14-405.php?c=432&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, SyFy http://bgapp.live/play/14-405.php?c=151&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, SyFy Sur http://bgapp.live/play/14-405.php?c=758&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, SyFy http://bgapp.live/play/14-405.php?c=648&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TBS Very Funny http://bgapp.live/play/14-405.php?c=171&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TBS Very Funny http://bgapp.live/play/14-405.php?c=831&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TC Ecuador http://bgapp.live/play/14-405.php?c=885&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TCM http://bgapp.live/play/14-405.php?c=85&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TeenNick http://bgapp.live/play/14-405.php?c=882&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Tele http://bgapp.live/play/14-405.php?c=778&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TeleAmazonas http://bgapp.live/play/14-405.php?c=320&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Telefe http://bgapp.live/play/14-405.php?c=771&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Telehit http://bgapp.live/play/14-405.php?c=91&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Telehit http://bgapp.live/play/14-405.php?c=649&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Telemundo http://bgapp.live/play/14-405.php?c=92&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Telemundo http://bgapp.live/play/14-405.php?c=660&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Televicentro http://bgapp.live/play/14-405.php?c=776&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, The Big Bang Theory 24/7 http://bgapp.live/play/14-405.php?c=676&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, The Walking Dead 24/7 http://bgapp.live/play/14-405.php?c=800&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TigoSports Bolivia http://bgapp.live/play/14-405.php?c=764&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TigoSports Paraguay http://bgapp.live/play/14-405.php?c=843&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Tiin http://bgapp.live/play/14-405.php?c=93&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TLC http://bgapp.live/play/14-405.php?c=87&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Tlnovelas http://bgapp.live/play/14-405.php?c=94&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Tlnovelas http://bgapp.live/play/14-405.php?c=832&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TNT http://bgapp.live/play/14-405.php?c=179&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TNT Sur http://bgapp.live/play/14-405.php?c=752&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TNT (ES) http://bgapp.live/play/14-405.php?c=716&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TNT http://bgapp.live/play/14-405.php?c=500&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TNT Series http://bgapp.live/play/14-405.php?c=90&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TNT Series Sur http://bgapp.live/play/14-405.php?c=757&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TNT Series http://bgapp.live/play/14-405.php?c=650&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TNT Sports http://bgapp.live/play/14-405.php?c=509&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Tom y Jerry 24/7 http://bgapp.live/play/14-405.php?c=421&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Tooncast http://bgapp.live/play/14-405.php?c=95&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Trece http://bgapp.live/play/14-405.php?c=774&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TrollHunters 24/7 http://bgapp.live/play/14-405.php?c=662&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TruTV http://bgapp.live/play/14-405.php?c=96&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TruTv http://bgapp.live/play/14-405.php?c=501&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Tu Musica http://bgapp.live/play/14-405.php?c=516&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TUDN http://bgapp.live/play/14-405.php?c=698&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TUDN (Pocos Datos) http://bgapp.live/play/14-405.php?c=822&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TUDN http://bgapp.live/play/14-405.php?c=801&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TUDN USA http://bgapp.live/play/14-405.php?c=86&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TUDN USA http://bgapp.live/play/14-405.php?c=821&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TVC Deportes http://bgapp.live/play/14-405.php?c=837&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, TVE http://bgapp.live/play/14-405.php?c=195&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Two And a Half Men 24/7 http://bgapp.live/play/14-405.php?c=675&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Tyc Sports http://bgapp.live/play/14-405.php?c=274&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, UFC Network http://bgapp.live/play/14-405.php?c=97&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Unicable http://bgapp.live/play/14-405.php?c=98&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Unicable http://bgapp.live/play/14-405.php?c=653&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Universal http://bgapp.live/play/14-405.php?c=137&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Universal http://bgapp.live/play/14-405.php?c=502&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Univision http://bgapp.live/play/14-405.php?c=99&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Univisión Deportes http://bgapp.live/play/14-405.php?c=373&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Univisión TDN http://bgapp.live/play/14-405.php?c=100&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Univision Tlnovelas http://bgapp.live/play/14-405.php?c=413&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Uno http://bgapp.live/play/14-405.php?c=775&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, VH1 http://bgapp.live/play/14-405.php?c=101&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, VH1 http://bgapp.live/play/14-405.php?c=632&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Video Rola http://bgapp.live/play/14-405.php?c=359&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, VTV Uruaguay http://bgapp.live/play/14-405.php?c=708&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Wapa PR http://bgapp.live/play/14-405.php?c=327&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Warner Channel http://bgapp.live/play/14-405.php?c=102&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Warner Channel Sur http://bgapp.live/play/14-405.php?c=759&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Warner Channel http://bgapp.live/play/14-405.php?c=503&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Win Sports http://bgapp.live/play/14-405.php?c=292&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Win Sports + http://bgapp.live/play/14-405.php?c=881&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Win Sports + http://bgapp.live/play/14-405.php?c=802&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Win Sports http://bgapp.live/play/14-405.php?c=754&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, WWE Network http://bgapp.live/play/14-405.php?c=276&token=blccck-gh08st&f=.m3u8  #EXTINF:-1, Yu-Gi-Oh! 24/7 http://bgapp.live/play/14-405.php?c=664&token=blccck-gh08st&f=.m3u8 |
| [Excalibur79/Super-Verse](https://github.com/Excalibur79/Super-Verse) | ⭐ 9 | JavaScript | A Multiplayer Card Tournament Game of two Universes [ DragonBall and Naruto ] with self made mongoDb Database of Character Stats.  Bid among friends with ingame money to create your deck and battle  your opponents to win the tournament [  Made with ReactJS , NodeJS ,MongoDb ,Firebase for auth , Sockets.io] |
| [ivanlamega/Akcore-TW](https://github.com/ivanlamega/Akcore-TW) | ⭐ 8 | Perl 6 | Dbo Server TW Akcore |
| [MishraShardendu22/Documentation-DragonBallAPI](https://github.com/MishraShardendu22/Documentation-DragonBallAPI) | ⭐ 8 | MDX | Dragon Ball API Documentation !! |
| [luisangelmaciel/dragon.ball](https://github.com/luisangelmaciel/dragon.ball) | ⭐ 8 | CSS | Ramdon quotes, Game & font preview live. Dragon Ball Super |
| [MishraShardendu22/DragonBallAPI-GoLang](https://github.com/MishraShardendu22/DragonBallAPI-GoLang) | ⭐ 8 | Go | This is a self-made API with a Go backend. It's free to use, and you can integrate it with your frontend for any application of your choice. It's an Advanced Version of the previous DragonBallApi made with TS Backend. |
| [JUANCITOPENA/dragon-ball-project_react](https://github.com/JUANCITOPENA/dragon-ball-project_react) | ⭐ 8 | JavaScript | Dragon-ball-project_react con REACT, HTML, CSS Y JS |
| [mineminemine/xv2savdec_switch](https://github.com/mineminemine/xv2savdec_switch) | ⭐ 8 | C# | A save file decryptor/encryptor for the Switch version of DBXV2 |
| [Algorithm-Arena/weekly-challenge-9-dragon-ball](https://github.com/Algorithm-Arena/weekly-challenge-9-dragon-ball) | ⭐ 8 | N/A | Pas de description |
| [emartey/TriviaGame](https://github.com/emartey/TriviaGame) | ⭐ 8 | JavaScript | Dragonball Universe Trivia Game |
| [guillim/Glimpse](https://github.com/guillim/Glimpse) | ⭐ 8 | Swift | AI agents monitoring on MacOS Desktop |
| [debezium/debezium-connector-informix](https://github.com/debezium/debezium-connector-informix) | ⭐ 7 | Java | A Debezium CDC connector for IBM Informix database. Please log issues at https://github.com/debezium/dbz/issues. |
| [Naitrate/DBZK_Fix](https://github.com/Naitrate/DBZK_Fix) | ⭐ 7 | Lua | A mod that aims to remove the Dragon Ball Z: Kakarot's 60FPS cap during gameplay, adding 21:9/16:10/4:3 support, and TAA tweaks |
| [devemdobro/projeto-dbz-szpc](https://github.com/devemdobro/projeto-dbz-szpc) | ⭐ 7 | HTML | Pas de description |
| [Jabrils/ECS-DBZ-Demo](https://github.com/Jabrils/ECS-DBZ-Demo) | ⭐ 7 | C# | Pas de description |
| [ivanlamega/dbo-server](https://github.com/ivanlamega/dbo-server) | ⭐ 7 | C++ | Server Dragon Ball Online Taiwan 1.69 |
| [lalizita/dragon-ball-manager](https://github.com/lalizita/dragon-ball-manager) | ⭐ 7 | JavaScript | This is a Demo for Digital Innovation One class |
| [LeCitronVert/dbl-anniversary-qr-2023](https://github.com/LeCitronVert/dbl-anniversary-qr-2023) | ⭐ 7 | JavaScript | Little thingie to allow generation of Shenron QR Codes for Dragon Ball Legends. Hastily made so errors are to be expected. |
| [RezaTaheri01/dragon-ball](https://github.com/RezaTaheri01/dragon-ball) | ⭐ 7 | C# | A random 2D game created by Unity (Look like they call it headball) |
| [Ofarouq310/dragon-ballz](https://github.com/Ofarouq310/dragon-ballz) | ⭐ 7 | JavaScript | Design a Dragon Ball Z website using React, Tailwind, and GSAP, incorporating reusable and maintainable components while adding stunning GSAP animations. |
| [ThisisCanada98/DragonballFusionsNTR](https://github.com/ThisisCanada98/DragonballFusionsNTR) | ⭐ 7 | N/A | Pas de description |
| [dokkanart/dblegends](https://github.com/dokkanart/dblegends) | ⭐ 7 | N/A | HD Resolution Asset Images from DragonBall Legends |
| [Klerith/vivo-angular-dragonball](https://github.com/Klerith/vivo-angular-dragonball) | ⭐ 7 | TypeScript | Pas de description |
| [bensnilloc/Dragonball-Z-Dokkan-Battle-Database-Decryptor](https://github.com/bensnilloc/Dragonball-Z-Dokkan-Battle-Database-Decryptor) | ⭐ 7 | Python | Decrypt Dragonball Z: Dokkan Battle databases instantaneously  |
| [AlphEEE/DBZMOD](https://github.com/AlphEEE/DBZMOD) | ⭐ 6 | C# | A Dragon ball Z mod for terraria. |
| [caidevOficial/Python_Mini_DBZ_Game](https://github.com/caidevOficial/Python_Mini_DBZ_Game) | ⭐ 6 | Python | Mini game with Dragon Ball Z characters which is created using the Pygame framework. |
| [zillachan/DBZilla](https://github.com/zillachan/DBZilla) | ⭐ 6 | Java | An Android ORM framework |
| [mbelot007/termux-dbz-theme](https://github.com/mbelot007/termux-dbz-theme) | ⭐ 6 | Shell | Dragon Ball Z themed greeting for Termux with Shenron and scouter stats |
| [HiroTex/dbz3_sc](https://github.com/HiroTex/dbz3_sc) | ⭐ 6 | C | Pas de description |
| [davidgiven/dbztool](https://github.com/davidgiven/dbztool) | ⭐ 6 | C++ | A command line tool for accessing the bootstrap protocol on Dragonball CPUs. |
| [BruceLeefans/dbzs-mmb](https://github.com/BruceLeefans/dbzs-mmb) | ⭐ 6 | CSS | 地表最帅的那个男人-唐升--用Vue写的慢慢买商城 |
| [DragonMineZ/dragonminez](https://github.com/DragonMineZ/dragonminez) | ⭐ 6 | Java | A Minecraft Mod based in the Dragon Ball Series by Akira Toriyama. Made for Forge 1.20.1 |
| [Citrinate/dboTranslationTool](https://github.com/Citrinate/dboTranslationTool) | ⭐ 6 | PHP | A tool to assist in the efforts of translating Dragon Ball Online |
| [ivanlamega/dbo-server-kr](https://github.com/ivanlamega/dbo-server-kr) | ⭐ 6 | C++ | Server of Dragon Ball Online version Corea |
| [nbremer/dragonballz](https://github.com/nbremer/dragonballz) | ⭐ 6 | JavaScript | Dive into all of the fights that happened in the Dragon Ball Z anime |
| [Attupatil/DRAGON_BALL_Z-RPG](https://github.com/Attupatil/DRAGON_BALL_Z-RPG) | ⭐ 6 | Python | PYTHON MADE DRAGON BALL Z (RPG) |
| [KyuDeathsBR/DragonBallZ_Roles](https://github.com/KyuDeathsBR/DragonBallZ_Roles) | ⭐ 6 | N/A | This is an among us mod made by KyuuDeathsBR_ , who adds new dragon ball roles to among us , currently includes only a few roles , will add more in the future |
| [AlonsoMartinez8/DragonBall-ReactNative](https://github.com/AlonsoMartinez8/DragonBall-ReactNative) | ⭐ 6 | JavaScript | App de personajes de DragonBall con ReactNative y Expo usando la API https://web.dragonball-api.com/. Navegación entre pantallas. |
| [burzumishi/dragonballworld](https://github.com/burzumishi/dragonballworld) | ⭐ 6 | C | Dragon Ball World is an Online Fight Game. |
| [KakarottoCake/HDLegendsArt](https://github.com/KakarottoCake/HDLegendsArt) | ⭐ 6 | N/A | HD Dragon Ball Legends Art and Renders |
| [18z/saiyan-glass](https://github.com/18z/saiyan-glass) | ⭐ 6 | Python | Saiyan's :eyeglasses: - A dragon ball inspired project |
| [SamuelDBZMAAM/Budokai-Modding-Tool](https://github.com/SamuelDBZMAAM/Budokai-Modding-Tool) | ⭐ 6 | Python | Modding tool to edit the character files of the Dragon Ball Z Budokai series |
| [smft/cal_dbz](https://github.com/smft/cal_dbz) | ⭐ 5 | Python | 计算wrf初始场雷达基本反射率 |
| [Acrecios/DBZproject](https://github.com/Acrecios/DBZproject) | ⭐ 5 | HTML | Pas de description |
| [anthonykumasaka/DBZ-Pong](https://github.com/anthonykumasaka/DBZ-Pong) | ⭐ 5 | HTML | Tennis Game made with vanilla Javascript |
| [rosenpin/dbz-battery-widget](https://github.com/rosenpin/dbz-battery-widget) | ⭐ 5 | Java | DBZ Battery Widget For Android |
| [marcelbbarreiro/PHP-MVC-DBZ](https://github.com/marcelbbarreiro/PHP-MVC-DBZ) | ⭐ 5 | PHP | Pas de description |
| [HiroTex/SpikeSoft](https://github.com/HiroTex/SpikeSoft) | ⭐ 5 | C# | Utility to Modify and Manage DBZ Sparking! Saga Game Files. |
| [Citrinate/dboSkillCalculator](https://github.com/Citrinate/dboSkillCalculator) | ⭐ 5 | JavaScript | Skill Calculator for Dragon Ball Online |
| [LeinhartArein/DragonBallRPG](https://github.com/LeinhartArein/DragonBallRPG) | ⭐ 5 | Shell | Dragon Ball GenerateD wuth RPG Maker VX ACE |
| [PerfectScrash/Dragon-Ball-Mod](https://github.com/PerfectScrash/Dragon-Ball-Mod) | ⭐ 5 | Pawn | Dragon Ball Mod Versions |
| [danielafarias/dragon-ball](https://github.com/danielafarias/dragon-ball) | ⭐ 5 | JavaScript | Projeto de especialização em Front-end da Blue Edtech. Turma 01 - Módulo 04 |
| [baodubaiiii/NgocRongOnline_Data](https://github.com/baodubaiiii/NgocRongOnline_Data) | ⭐ 5 | N/A | Full Assest Server + Assest Client of the Top Asia 2D Game, inspired by the Dragon Ball manga series. Name is Ngọc Rồng Online |
| [AleCanavire/dragon-ball-app](https://github.com/AleCanavire/dragon-ball-app) | ⭐ 5 | JavaScript | Pas de description |
| [juanppdev/dragon-ball-app](https://github.com/juanppdev/dragon-ball-app) | ⭐ 5 | Kotlin | Este es un proyecto donde realice una app de Dragon Ball, con toda la información de los personajes, además esta app esta usando una api que he creado. |
| [JUANCITOPENA/DRAGON_BALL_Z_V1](https://github.com/JUANCITOPENA/DRAGON_BALL_Z_V1) | ⭐ 5 | HTML | DRAGON_BALL_Z_V1 EN THML, CSS Y JS |
| [IngNex/flutter_dragonball_ui](https://github.com/IngNex/flutter_dragonball_ui) | ⭐ 5 | Dart | I create a dragon ball data app design, practiced the consumption of http api |
| [felipe-mig/Dragon_Ball_Fansite_Vanilla_HTML_and_CSS](https://github.com/felipe-mig/Dragon_Ball_Fansite_Vanilla_HTML_and_CSS) | ⭐ 5 | HTML | This vanilla HTML and CSS project is my personal tribute to Akira Toriyama, creator of Dragon Ball. Unfortunately he passed away in March 2024. |
| [PhantoomDev/bt3-re](https://github.com/PhantoomDev/bt3-re) | ⭐ 5 | N/A | This project aims to implement rollback netcode for Dragon Ball Z: Budokai Tenkaichi 3 (BT3) through reverse engineering and modifying Dolphin emulator. The primary focus is on implementing split-screen rollback netplay to facilitate debugging, input verification, and maintain consistency with local play experience. |
| [clasense4/scrapy-dragonball](https://github.com/clasense4/scrapy-dragonball) | ⭐ 5 | Python | Scraping http://www.dragonball-multiverse.com/ |
| [giacomande95-oss/dragonball-vispec](https://github.com/giacomande95-oss/dragonball-vispec) | ⭐ 5 | Python | Pas de description |
| [LUXTACO/DBFarmer](https://github.com/LUXTACO/DBFarmer) | ⭐ 5 | Python | DragonBall Legends Farmer, the best story farmer for DBLegends, with discord controller and fully autonoumous modes |
| [dbz-tribute-reforged/dbz-tribute-reforged](https://github.com/dbz-tribute-reforged/dbz-tribute-reforged) | ⭐ 4 | TypeScript | Pas de description |
| [Diamondboyzcoin/dbzcoin](https://github.com/Diamondboyzcoin/dbzcoin) | ⭐ 4 | N/A | Pas de description |
| [mclol0/dbzfe_open](https://github.com/mclol0/dbzfe_open) | ⭐ 4 | DM | Pas de description |
| [Putnam3145/SPARKING-Dwarf-Fortress-DBZ-mod](https://github.com/Putnam3145/SPARKING-Dwarf-Fortress-DBZ-mod) | ⭐ 4 | Lua | Dragon Ball mod for Dwarf Fortress. This here repo is for updating to the next version of Dwarf Fortress pre-emptively. |
| [ByJC/dbz-figthers](https://github.com/ByJC/dbz-figthers) | ⭐ 4 | TypeScript | a little angular app using firestore in order to get ranking for DBFZ. |
| [lou1306/alfred-dbz](https://github.com/lou1306/alfred-dbz) | ⭐ 4 | Python | Search papers on DBLP and add them to Zotero |
| [carlosouza-dev/dbz-platformer](https://github.com/carlosouza-dev/dbz-platformer) | ⭐ 4 | CSS | Personal study project: a browser-based platformer inspired by Dragon Ball Z. |
| [kastomd/Editor_indice_Py](https://github.com/kastomd/Editor_indice_Py) | ⭐ 4 | Python | El objetivo principal del programa es permitir al usuario editar, agregar o eliminar los índices de los archivos, facilitando la edición de los mismos, para el video juego conocido como dbz tag team. |
| [dspec13/DBM-Image-Downloader](https://github.com/dspec13/DBM-Image-Downloader) | ⭐ 4 | Python | A short Python Script that will download all of the pages of Dragon Ball Multiverse (as of 27 March 2020) into a directory which can then be easily converted into a .mobi & uploaded to a Kindle. |
| [rladiestaipei/R_DragonBall](https://github.com/rladiestaipei/R_DragonBall) | ⭐ 4 | HTML | 我們與 R 的距離 -- R-Ladies Taipei 七日馬拉松 |
| [PedHenSilva/Loja-Geek-Dragon-Ball](https://github.com/PedHenSilva/Loja-Geek-Dragon-Ball) | ⭐ 4 | HTML | Pas de description |
| [LostImbecile/Sparking-Zero-Audio-Modding-Tool](https://github.com/LostImbecile/Sparking-Zero-Audio-Modding-Tool) | ⭐ 4 | C | Audio modding tool for Dragon Ball: Sparking! Zero |
| [o0DemonBoy0o/XV2SuperSoulEditor](https://github.com/o0DemonBoy0o/XV2SuperSoulEditor) | ⭐ 4 | C# | Tool for editing Dragon Ball Xenoverse 2 Super Souls |
| [Draym/DragonBallArena](https://github.com/Draym/DragonBallArena) | ⭐ 4 | Java | versus fighting game in Dragon Ball universe |
| [sonrafael/DragonBallSuper](https://github.com/sonrafael/DragonBallSuper) | ⭐ 4 | JavaScript | Site de fãs do anime Dragon Ball |
| [Kadaz/DBO-Custom-Launcher](https://github.com/Kadaz/DBO-Custom-Launcher) | ⭐ 4 | Visual Basic | Dragonball Online Custom Launcher |
| [DikuMUDOmnibus/DragonBall-Saga](https://github.com/DikuMUDOmnibus/DragonBall-Saga) | ⭐ 4 | C | DragonBall Saga 2.5.2 |
| [egeinanc/dragonball-progressbar](https://github.com/egeinanc/dragonball-progressbar) | ⭐ 4 | Java | Pas de description |
| [DeOliveiraDev/DragonBallWikia](https://github.com/DeOliveiraDev/DragonBallWikia) | ⭐ 4 | C# | Pas de description |
| [4GeeksAcademy/dragon-ball-api-latam-pt-33](https://github.com/4GeeksAcademy/dragon-ball-api-latam-pt-33) | ⭐ 4 | Python | A Python practice repository for building a Dragonball API 🐍 |
| [RandomNerd01/DragonBallLegendsGachaCalculator](https://github.com/RandomNerd01/DragonBallLegendsGachaCalculator) | ⭐ 4 | HTML | A Website to Calculate the chance of getting a character in the Dragon Ball gacha game Dragon Ball Legends |
| [SuperSwiftScout/DBFZ-Raid-Enabler](https://github.com/SuperSwiftScout/DBFZ-Raid-Enabler) | ⭐ 4 | Python | Python tool to patch Dragon Ball FighterZ to enable specific raid battles whenever you want. |
| [ljsiri/dbfz-combo-translator](https://github.com/ljsiri/dbfz-combo-translator) | ⭐ 4 | JavaScript | This project aims to help Dragonball fighterZ players to get more readable combos from the community spreadsheet. |
| [debezium/debezium-quarkus](https://github.com/debezium/debezium-quarkus) | ⭐ 3 | Java | All Quarkus extensions provided by Debezium. Please log issues at https://github.com/debezium/dbz/issues. |
| [debezium/debezium-connector-cockroachdb](https://github.com/debezium/debezium-connector-cockroachdb) | ⭐ 3 | Java | An incubating Debezium CDC connector for CockroachDB database. Please log issues at https://github.com/debezium/dbz/issues. |
| [debezium/debezium-connector-ingres](https://github.com/debezium/debezium-connector-ingres) | ⭐ 3 | Java | An incubating Debezium CDC connector for Ingres database. Please log issues at https://github.com/debezium/dbz/issues. |
| [ViveTheModder/dbzbt3-research](https://github.com/ViveTheModder/dbzbt3-research) | ⭐ 3 | N/A |  New & old research done on DBZ Budokai Tenkaichi 3 by its modding community throughout the years, now stored in this repository.  |
| [caiyunapp/smdbz](https://github.com/caiyunapp/smdbz) | ⭐ 3 | Python | Sparse Matrix dBZ |
| [RyanShort13110/dbz-api](https://github.com/RyanShort13110/dbz-api) | ⭐ 3 | JavaScript | The Unofficial DBZ API |
| [PedroAmaralMa/LojaDbz](https://github.com/PedroAmaralMa/LojaDbz) | ⭐ 3 | HTML | Pas de description |
| [wndvp/projeto-dbz](https://github.com/wndvp/projeto-dbz) | ⭐ 3 | CSS | Pas de description |
| [julienlechat/7-MMORPG-Dbz](https://github.com/julienlechat/7-MMORPG-Dbz) | ⭐ 3 | JavaScript | MMORPG Dragon Ball in React.JS |
| [chadwiley14/wofs_40dbz](https://github.com/chadwiley14/wofs_40dbz) | ⭐ 3 | Jupyter Notebook | WoFS ML research project forecasting thunderstorm location over 40dbz |
| [JySzE/SoM-DBZ-Merge](https://github.com/JySzE/SoM-DBZ-Merge) | ⭐ 3 | HTML | Pas de description |
| [armanfarhangi/ArcadeGame](https://github.com/armanfarhangi/ArcadeGame) | ⭐ 3 | C++ | dbz survival shooter arcade game (c++ and qt) |
| [AlterEgoIV/DragonballZRPG](https://github.com/AlterEgoIV/DragonballZRPG) | ⭐ 3 | Java | DBZ LOG 2 / Buu's Fury inspired action RPG |
| [adia-dev/Dragon-Ball](https://github.com/adia-dev/Dragon-Ball) | ⭐ 3 | C++ | Little dragon ball game made in C++ with SFML 2.5 !! There will be a sequel to this game !!!! |
| [aryanrekhi/Battle-of-Saiyans](https://github.com/aryanrekhi/Battle-of-Saiyans) | ⭐ 3 | Python | 1 v 1 , Player vs CPU 2D fighting game based on Dragon ball z  |
| [louiswicker/pyROTH](https://github.com/louiswicker/pyROTH) | ⭐ 3 | Python | Python software to QC and superob WSR88D Level-2 radial velocity data for data assimilation and to process the MRMS superobbed DBZ field for data assimilation |
| [maco-data/Flight-History](https://github.com/maco-data/Flight-History) | ⭐ 3 | Python | My flight history as a ex-Cabin Crew plotted on a map! 1351 flights narrow down to every unique flight I ever did. 10 years over 9000 hours (DBZ pun not intended) |
| [IronFinance/dragonball-contracts](https://github.com/IronFinance/dragonball-contracts) | ⭐ 3 | TypeScript | Pas de description |
| [DaniyalKhan/DragonBall](https://github.com/DaniyalKhan/DragonBall) | ⭐ 3 | N/A | 2 player Dragon Ball Z style Beat 'em up! |
| [DikuMUDOmnibus/DragonBall-Truth](https://github.com/DikuMUDOmnibus/DragonBall-Truth) | ⭐ 3 | C | DragonBall Truth 1.8 |
| [Oboe831/DragonBallRedux](https://github.com/Oboe831/DragonBallRedux) | ⭐ 3 | HTML | Roll20 HTML sheet |
| [CoffeeCanGaming/DragonBallMinecraft](https://github.com/CoffeeCanGaming/DragonBallMinecraft) | ⭐ 3 | Java | The new dragonball mod for the DragonBall: Crashing Timelines server  |
| [freecores/wbif_68k](https://github.com/freecores/wbif_68k) | ⭐ 3 | Verilog | DragonBall/68K Wishbone interface |
| [evga7/DragonballFight](https://github.com/evga7/DragonballFight) | ⭐ 3 | C# | 드래곤볼 미사일게임 |
| [martinloverse/Dragonball](https://github.com/martinloverse/Dragonball) | ⭐ 3 | Java | This is project for TDD practice. |
| [jpscorp21/dragonballgenerador](https://github.com/jpscorp21/dragonballgenerador) | ⭐ 3 | Vue | Generador de personajes de dragon ball |
| [IngNex/react-draboball-apiv1](https://github.com/IngNex/react-draboball-apiv1) | ⭐ 3 | JavaScript | Consuming a DragonBall Api to practice Frontend |
| [marcosdjr/blue-dragonball](https://github.com/marcosdjr/blue-dragonball) | ⭐ 3 | JavaScript | Pas de description |
| [fifteenhex/dragonball_flashloader](https://github.com/fifteenhex/dragonball_flashloader) | ⭐ 3 | C | A small bootloader to boot Linux on Motorola 68000 based DragonBall SoCs  |
| [DanielBarresi/dragonball-app](https://github.com/DanielBarresi/dragonball-app) | ⭐ 3 | HTML | Pas de description |
| [Unrealrojo234/DragonBallFan](https://github.com/Unrealrojo234/DragonBallFan) | ⭐ 3 | Svelte | Pas de description |
| [IngNex/dragonball-api-sagas](https://github.com/IngNex/dragonball-api-sagas) | ⭐ 3 | N/A | Practicing json, creating a bd dragon ball-api |
| [IngNex/molde-dragonball-cardhover](https://github.com/IngNex/molde-dragonball-cardhover) | ⭐ 3 | HTML | Create cardhover mold to consume api-pokemon |
| [xtream-club/Scrapper-DragonBall](https://github.com/xtream-club/Scrapper-DragonBall) | ⭐ 3 | Python | Api unofficial de Dragon Ball inspirado en su fandom. |
| [itsjwala/DragonBallWorld](https://github.com/itsjwala/DragonBallWorld) | ⭐ 3 | HCL | My personal server setup |
| [Omnija/Dragonball-Heroes-3ds-Translations](https://github.com/Omnija/Dragonball-Heroes-3ds-Translations) | ⭐ 3 | N/A | Continued translations for the Dragon Ball Heroes - Ultimate Mission X |
| [RafaelPrado409/Aluraquiz_Dragon-Ball](https://github.com/RafaelPrado409/Aluraquiz_Dragon-Ball) | ⭐ 3 | JavaScript | Pas de description |
| [pavan-kalyan-ai/neoG-camp-MarkTwo-DragonBallZ-Quiz](https://github.com/pavan-kalyan-ai/neoG-camp-MarkTwo-DragonBallZ-Quiz) | ⭐ 3 | JavaScript | This is a CLI Based  trivia game about the Dragon Ball Z series. It asks the player questions and allows them to enter their answers. If they answer correctly, their score is incremented. At the end of the game, the player's score is displayed and added to a leaderboard if it is high enough. |
| [LucasDevRJ/dragon-ball](https://github.com/LucasDevRJ/dragon-ball) | ⭐ 3 | HTML | Site sobre o anime Dragon Ball. |
| [fchavonet/creative_coding-dbscg_3d_viewer](https://github.com/fchavonet/creative_coding-dbscg_3d_viewer) | ⭐ 3 | JavaScript | A lightweight 3D card game visualizer developed using web technologies, with a focus on interactive rendering through the Three.js library.  |
| [Amadeo-Frontend/Angular-Quiz](https://github.com/Amadeo-Frontend/Angular-Quiz) | ⭐ 3 | TypeScript | Quiz Buzzfeed sobre DragonBall é um aplicativo web interativo desenvolvido com Angular e Tailwind CSS, inspirado nos quizzes dinâmicos do BuzzFeed. Este projeto oferece uma experiência de usuário envolvente e visualmente atraente, ideal para quem busca um app divertido e estiloso. |
| [beingmartinbmc/Pixel-Sorting](https://github.com/beingmartinbmc/Pixel-Sorting) | ⭐ 3 | Java | You can watch the working of this project at https://www.youtube.com/watch?v=ECv5dBX0hYM&t=4s |
| [UlisesCeca/dbz-nds-eco](https://github.com/UlisesCeca/dbz-nds-eco) | ⭐ 2 | C | Dragon Ball Videogame made in C for the Nintendo DS. |
| [yazeedb/dbz-rxjs](https://github.com/yazeedb/dbz-rxjs) | ⭐ 2 | CSS | Pas de description |
| [GlobalModders/AMXX-Shenron-Dragon-DBZ-Plugin](https://github.com/GlobalModders/AMXX-Shenron-Dragon-DBZ-Plugin) | ⭐ 2 | SourcePawn | Collect the Dragonballs and summon Shenron |
| [debezium/jbang-catalog](https://github.com/debezium/jbang-catalog) | ⭐ 2 | TSQL | Catalog of Debezium-related JBang scripts. Please log issues at https://github.com/debezium/dbz/issues. |
| [PauloHDSousa/DBZEndlessRunner](https://github.com/PauloHDSousa/DBZEndlessRunner) | ⭐ 2 | ShaderLab | DBZ Endless Runner  |
| [TotallyNotMichael-GH/dbz2](https://github.com/TotallyNotMichael-GH/dbz2) | ⭐ 2 | Python | A heavy WIP decompilation of Dragon Ball Z: Budokai 2 |
| [debezium/debezium-connector-yashandb](https://github.com/debezium/debezium-connector-yashandb) | ⭐ 2 | N/A | An incubating Debezium CDC connector for YashanDB. Please log issues at https://github.com/debezium/dbz/issues. |
| [deyvidMatos/dbz](https://github.com/deyvidMatos/dbz) | ⭐ 2 | JavaScript | projeto baseado em dragon ball |
| [adakkak/dbz](https://github.com/adakkak/dbz) | ⭐ 2 | C++ | Thrifting Particles (project DragonballZ) |
| [Abdullah-Ansari-as/DBZ](https://github.com/Abdullah-Ansari-as/DBZ) | ⭐ 2 | JavaScript | Pas de description |
| [Leopladom/DBZ](https://github.com/Leopladom/DBZ) | ⭐ 2 | HTML | Pas de description |
| [senzo/dbz](https://github.com/senzo/dbz) | ⭐ 2 | Python | pour la soutenance... |
| [kakaio7/dbz-kj](https://github.com/kakaio7/dbz-kj) | ⭐ 2 | JavaScript | DBZ K_J |
| [joaopaulofranca/DBZmail](https://github.com/joaopaulofranca/DBZmail) | ⭐ 2 | PHP | App para enviar e-mail |
| [zoraizhashmi/dbzthing](https://github.com/zoraizhashmi/dbzthing) | ⭐ 2 | CSS | Pas de description |
| [RiskIdentDMS/dbzio](https://github.com/RiskIdentDMS/dbzio) | ⭐ 2 | Scala | Monadic bridge between DBIO & ZIO |
| [hajaren1466/dbztextadventures](https://github.com/hajaren1466/dbztextadventures) | ⭐ 2 | Python | Made in python language |
| [gavrielrh/dbzscouter](https://github.com/gavrielrh/dbzscouter) | ⭐ 2 | Kotlin | Pas de description |
| [MaapleWaafles/DragonBallRush](https://github.com/MaapleWaafles/DragonBallRush) | ⭐ 2 | C# | 2D DBZ Fighting Game |
| [renatohissa/dbzgame](https://github.com/renatohissa/dbzgame) | ⭐ 2 | Swift | Jogo de Dragon Ball Z desenvolvido em Swift 5 com Storyboard |
| [Drackow1/ProjetoDBZ](https://github.com/Drackow1/ProjetoDBZ) | ⭐ 2 | HTML | Pas de description |
| [dievardump/DBZ-game](https://github.com/dievardump/DBZ-game) | ⭐ 2 | JavaScript | Pas de description |
| [sougatoroy3/DBZ-Legends](https://github.com/sougatoroy3/DBZ-Legends) | ⭐ 2 | Swift | A SwiftUI based app for all the DBZ peeps out there. |
| [nak0x/dbz-explorer](https://github.com/nak0x/dbz-explorer) | ⭐ 2 | Python | This is a Dragon Ball univers based game. I embed a custom and re-usable game enine |
| [kleitontariga/mundo-dbz](https://github.com/kleitontariga/mundo-dbz) | ⭐ 2 | HTML | Projeto desenvolvido no curso DESENVOLVIMENTO DE SISTEMAS WEB I com /ProfessorAndersonChoren |
| [Jandersolutions/mini-dbz](https://github.com/Jandersolutions/mini-dbz) | ⭐ 2 | N/A | Python source code of mini-dbz game |
| [barixwittp/Carousel-Dbz](https://github.com/barixwittp/Carousel-Dbz) | ⭐ 2 | CSS | Pas de description |
| [Rafaelmilagres/jokenpo](https://github.com/Rafaelmilagres/jokenpo) | ⭐ 2 | CSS | JoKenPo com personagens de DBZ |
| [oguscaetano/projeto-dbz-csharp](https://github.com/oguscaetano/projeto-dbz-csharp) | ⭐ 2 | C# | Pas de description |
| [shmup/dbz-epic-tintin](https://github.com/shmup/dbz-epic-tintin) | ⭐ 2 | N/A | Drag(*)nBall Z: Epic scripts for TinTin++ |
| [Unrealrojo234/DBZ-Web-App](https://github.com/Unrealrojo234/DBZ-Web-App) | ⭐ 2 | JavaScript | Pas de description |
| [DiegoAragon13/GuessWho_DBZ](https://github.com/DiegoAragon13/GuessWho_DBZ) | ⭐ 2 | Dart | Guess Who is a fun and interactive character guessing game where players must identify the hidden character by asking questions and analyzing clues. Built with Flutter, it combines logic, quick thinking, and a touch of strategy! |
| [VncPsq/DBZ-Card-Game](https://github.com/VncPsq/DBZ-Card-Game) | ⭐ 2 | JavaScript | A Card Game based on DragonBallZ Theme |
| [caamillo/DragonballLegendsBot](https://github.com/caamillo/DragonballLegendsBot) | ⭐ 2 | Python | Dragon Ball Legends bot python custom script |
| [tokyo2006/zmk-config-dragonball](https://github.com/tokyo2006/zmk-config-dragonball) | ⭐ 2 | C | Pas de description |
| [gitalytics/dragonballer](https://github.com/gitalytics/dragonballer) | ⭐ 2 | Python | a test repo for the gitalytics magic |
| [DragonBallUniverse/DragonBallUniverse](https://github.com/DragonBallUniverse/DragonBallUniverse) | ⭐ 2 | N/A | Dragonball |
| [LatamDevelopmentCenter/hackathon-dragonball-ios-majin-boo-control](https://github.com/LatamDevelopmentCenter/hackathon-dragonball-ios-majin-boo-control) | ⭐ 2 | Swift | This is an App to control Majin Boo into JNJ Hackathon Late-2016 |
| [MercuriusXeno/dbiScripts](https://github.com/MercuriusXeno/dbiScripts) | ⭐ 2 | N/A | A collection of scripts I've developed for DBInfinity [a dragonball Z mud] for quality of life/usability. |
| [akacase/dbns](https://github.com/akacase/dbns) | ⭐ 2 | C | Dragonball: North Star |
| [pinak93/DragonballzGame](https://github.com/pinak93/DragonballzGame) | ⭐ 2 | C++ | Pas de description |
| [rumblefrog/DragonballStatistical](https://github.com/rumblefrog/DragonballStatistical) | ⭐ 2 | PHP | DragonballStatistical |
| [RetroHursty69/es-theme-dragonballz](https://github.com/RetroHursty69/es-theme-dragonballz) | ⭐ 2 | N/A | ES Theme Dragonball Z |
| [xilatleo/DragonballsAPI](https://github.com/xilatleo/DragonballsAPI) | ⭐ 2 | HTML | Restfull API with Nodejs, express, ejs, and Mongo |
| [kdao/dragonball](https://github.com/kdao/dragonball) | ⭐ 2 | PHP | sugar user analytics |
| [c-Tos1wa/dragonball](https://github.com/c-Tos1wa/dragonball) | ⭐ 2 | JavaScript | Pas de description |
| [liushaoxing321/dragonball](https://github.com/liushaoxing321/dragonball) | ⭐ 2 | C++ | GCC Frontend -> GIMPLE -> Clang AST -> Clang Analyzer Checker |
| [Rillist/dbarena2](https://github.com/Rillist/dbarena2) | ⭐ 2 | C | Old Dragonball Arena 2 MUD Codebase |
| [Dragon-Ball-Idle-Org/dragonballdle](https://github.com/Dragon-Ball-Idle-Org/dragonballdle) | ⭐ 2 | TypeScript | Pas de description |
| [miguelsarriasalesians/dragonballgo](https://github.com/miguelsarriasalesians/dragonballgo) | ⭐ 2 | Dart | Pas de description |
| [dylanpointis/dragonballapi-react](https://github.com/dylanpointis/dragonballapi-react) | ⭐ 2 | JavaScript | React practice app. Using https://web.dragonball-api.com/ |
| [PentSec/dragonball-api](https://github.com/PentSec/dragonball-api) | ⭐ 2 | TypeScript | A powerful API built with Next.js and TypeScript to provide detailed Dragon Ball data for AnimeHub. It includes characters, sagas, transformations, and more. Designed for performance and scalability, it's the perfect backend solution for any Dragon Ball fan application. |
| [fifteenhex/dragonball_serialbootloader](https://github.com/fifteenhex/dragonball_serialbootloader) | ⭐ 2 | C | Code dump of an application to talk to the bootrom in motorola 68000 based dragonball SoCs |
| [and1985129/dragonball-safari](https://github.com/and1985129/dragonball-safari) | ⭐ 2 | Objective-C | iBeacon game |
| [giovannig10/projeto-DragonBall](https://github.com/giovannig10/projeto-DragonBall) | ⭐ 2 | JavaScript | Pas de description |


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

<a name="dbo_fr-md"></a>
## 📄 Fichier : `dbo_fr.md`

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

<a name="fandom_fr-md"></a>
## 📄 Fichier : `fandom_fr.md`

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

<a name="news-md"></a>
## 📄 Fichier : `news.md`

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

## Tech stacks détectés 

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

<a name="reports-db-news-recon-md"></a>
## 📄 Fichier : `reports/db-news-recon.md`

**Titre original :** Recon report — https://dragonball.news/fr/

### Recon report — https://dragonball.news/fr/

Date: 2026-05-19 05:33 UTC
Profile used: `fast`

## HTTP & CDN

- **HTTP status**: 503
- **Body bytes**: 292 (0 KB)
- **goto duration**: 1089 ms
- **Server**: `n/a`
- **X-Powered-By**: `n/a`
- **Content-Type**: `text/html`
- **CDN fingerprint**: unknown
- **Trace/Ray ID**: `n/a`
- **Cache-Control**: `no-cache,no-store`

## Frameworks (wappalyzergo)

_No framework detected._

## Asset hosts (0 total)

| Host | Asset count |
|---|---|

## CSS selectors (0 total) — sample top 50

```css
```


---

<a name="sparking-fast-md"></a>
## 📄 Fichier : `sparking-fast.md`

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

<a name="sparking-md"></a>
## 📄 Fichier : `sparking.md`

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

