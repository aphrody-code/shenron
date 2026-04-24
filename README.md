# dragonball-bot

Bot Discord pour un serveur DragonBall. Modération, système de niveaux et d'économie thématés DBZ,
jeux, tickets, vocaux temporaires, wiki des persos et quelques commandes fun.

Tout le code tourne sous **Bun** (pas de Node), avec `discordx` (décorateurs TypeScript pour
`discord.js` v14), Drizzle + `bun:sqlite` côté DB, `tsyringe` pour l'injection de dépendances.

## Démarrage rapide

```bash
cp .env.example .env
# édite .env : DISCORD_TOKEN, OWNER_ID, IDs des salons de logs, rôles, etc.

bun install
bun run db:migrate
bun run db:seed-all      # seed du wiki + triggers de succès
bun run dev              # démarrage avec --watch
```

Avant le premier lancement, pense à créer dans Discord :

- un rôle pour le jail (pas d'accès sauf le salon ticket)
- un rôle pour "URL du serveur en bio"
- une catégorie pour les tickets
- un salon vocal "hub" pour les vocaux temporaires
- 7 salons de logs (messages, sanctions, économie, arrivées/départs, niveaux/rôles, tickets, notif mods)

Mets les IDs dans `.env` — sinon la feature correspondante reste silencieuse.

## Structure

```
src/
├── index.ts             # bootstrap (intents, DI, migrations, login)
├── _entries.ts          # barrel statique des modules @Discord
├── db/
│   ├── index.ts         # DatabaseService (bun:sqlite + Drizzle)
│   ├── schema.ts        # 19 tables
│   ├── migrate.ts       # runner de migrations
│   ├── seed-wiki.ts     # seed wiki depuis dragonball-api.com
│   └── seed-triggers.ts # seed des 15 succès DBZ pré-remplis
├── lib/
│   ├── env.ts           # validation zod
│   ├── logger.ts        # pino
│   ├── constants.ts     # seuils XP, prix, durées
│   ├── xp.ts            # calculs de niveau
│   ├── dbz-flavor.ts    # messages thémés (quêtes, level-up)
│   └── fusion-names.ts  # Goku + Vegeta = Vegito
├── services/
│   ├── LevelService.ts
│   ├── EconomyService.ts
│   ├── ModerationService.ts
│   ├── TicketService.ts
│   ├── VocalTempoService.ts
│   ├── LogService.ts
│   ├── InviteTracker.ts
│   ├── CardService.ts        # rendu des cartes profil (napi-rs/canvas)
│   ├── AchievementService.ts # auto-grant de succès sur patterns
│   └── WikiService.ts        # wiki DBZ (DB locale)
├── guards/              # GuildOnly, ModOnly, AdminOnly, OwnerOnly
├── commands/
│   ├── moderation/      # jail, mute, warn, ban, kick, clear, stats...
│   ├── ticket/          # panel + boutons + modal + /close
│   ├── level/           # /profil, /top, /niveau
│   ├── economy/         # /shop, /buy, /eprofil, /fusion, /zeni...
│   ├── games/           # /pfc, /morpion, /bingo, /pendu
│   ├── fun/             # /gay, /raciste, /scan
│   ├── giveaway/        # /giveaway
│   ├── vocal/           # /voc kick/ban/unban
│   ├── wiki/            # /wiki, /races, /planete
│   └── admin/           # /succes set/list/remove
├── events/
│   ├── ready.ts
│   ├── MessageXP.ts     # XP texte + quête quotidienne + anti-lien Discord
│   ├── VoiceXP.ts       # XP vocal + création des vocaux temporaires
│   ├── JoinLeave.ts     # logs + tracking de l'invitant
│   ├── MessageLog.ts    # logs delete / update
│   ├── BioRole.ts       # rôle auto si URL du serveur en statut
│   └── JailExpiry.ts    # auto-unjail à l'expiration
└── assets/
    ├── fonts/           # Inter, Teko, Saiyan Sans, DBS Scouter
    ├── cards/           # backgrounds de cartes profil (optionnels)
    └── dbz/             # 58 portraits + 50 transformations + 20 planètes
```

## Système XP / Zéni

Le XP est appelé "unités" dans les messages (thème DragonBall). Les niveaux ne sont qu'un repère
interne pour attribuer les rôles de palier et filer 1000 zéni à chaque passage.

- XP en texte : 15–25 par message, cooldown 60 s
- XP en vocal : 20 par minute, sauf si micro coupé
- Quête quotidienne (1 message par jour) : +200 zéni, streak tracking
- Fusion : +10% XP et zéni partagés automatiquement avec son/sa partenaire

Les paliers vont de 1 000 unités (niveau 1) à 9 000 000 (niveau 10 — "IT'S OVER 9 MILLION" façon
Ultra Instinct). Chaque palier a un message thématique et peut donner un rôle (table
`level_rewards` à remplir en DB).

## Shop

Quatre types d'objets achetables : `card`, `badge`, `color`, `title`.

La table `shop_items` est vide au départ, à toi de la remplir. Pour une couleur, tu mets l'ID
du rôle à donner dans `role_id` :

```sql
INSERT INTO shop_items (key, type, name, price, role_id, description)
VALUES ('saiyan_blue', 'color', 'Saiyan Blue', 5000, '123456789012345678', 'Cyan intense');
```

Les cartes profil disponibles : `default`, `goku`, `vegeta`, `kaio`, `ssj`, `blue`, `rose`,
`ultra`. Pour ajouter une carte avec une image custom, dépose un `.webp` dans `assets/cards/<clé>.webp`.

## Succès auto

Le système de succès pré-seeded déclenche automatiquement sur 15 patterns DBZ :
Kamehameha, Over 9000, Genkidama, Kaio-ken, Ultra Instinct, Final Flash, Galick Gun, etc.
Pour en ajouter :

```
/succes set code:DOUBLE_SUNDAY pattern:"double\s*sunday" description:"Technique de Trunks"
```

## Scripts

| Commande | À quoi ça sert |
|---|---|
| `bun run dev` | Watch mode pour le dev |
| `bun run start` | Démarrage prod (sans watch) |
| `bun run build` | Bundle vers `dist/index.js` |
| `bun run compile` | Binaire standalone |
| `bun run type-check` | `tsc --noEmit` |
| `bun run gen:entries` | Régénère `src/_entries.ts` |
| `bun run db:migrate` | Applique les migrations SQL |
| `bun run db:generate` | Génère une nouvelle migration depuis le schema |
| `bun run db:seed-wiki` | Peuple les tables wiki depuis dragonball-api.com |
| `bun run db:seed-triggers` | Seed les 15 triggers de succès |
| `bun run db:seed-all` | Les deux seeds d'un coup |
| `bun run db:studio` | UI Drizzle |

## À propos de la commande /raciste

Elle est là parce que le cahier des charges la demande (ligne 140). Hardcode 101% sur
`OWNER_ID`, comme spec. Le pourcentage est stable par jour (calcul déterministe), donc ça évite
le spam aléatoire. Si tu veux la retirer, commente juste la méthode `raciste` dans
`src/commands/fun/Fun.ts`.

## Guild

- ID : `934894610545770506`
- Invite : <https://discord.gg/2JayQtyN>

## Notes

- Le bot tourne exclusivement sous Bun, pas de Node. Le package `@discordjs/voice` et `opus`
  n'ont pas été ajoutés — l'XP vocal passe par `voiceStateUpdate` (pas de lecture audio).
- La DB est un fichier `data/bot.db` (SQLite via `bun:sqlite`). Backup : `cp data/bot.db
  data/bot.db.bak` ou `VACUUM INTO`.
- Les commandes sont register sur la guild spécifiée dans `GUILD_ID` (plus rapide que global
  pendant le dev). Pour un deploy multi-serveurs, retirer `botGuilds` dans `src/index.ts`.
