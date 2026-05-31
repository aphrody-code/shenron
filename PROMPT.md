# PROMPT.md — Sprint DBFR (Shenron bot + site public)

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
