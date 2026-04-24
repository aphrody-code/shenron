# Shenron

Bot Discord thémé Dragon Ball pour un serveur communautaire — modération avancée, système de niveaux en "unités" de ki, économie en zéni, jeux, tickets, vocaux temporaires, cartes de profil rendues en canvas, et wiki des personnages.

> _« Tu as réuni les sept Dragon Balls. Fais ton vœu. »_

[![Bun](https://img.shields.io/badge/runtime-Bun%201.3-black?logo=bun)](https://bun.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![discord.js](https://img.shields.io/badge/discord.js-14.26-5865f2?logo=discord&logoColor=white)](https://discord.js.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-0.44-c5f74f)](https://orm.drizzle.team/)
[![SQLite](https://img.shields.io/badge/bun%3Asqlite-WAL-003b57?logo=sqlite&logoColor=white)](https://bun.com/docs/api/sqlite)
[![License](https://img.shields.io/badge/license-UNLICENSED-red)](#licence)

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
- [Déploiement](#déploiement)
- [Dépannage](#dépannage)
- [FAQ](#faq)
- [Licence](#licence)

---

## Aperçu

**Shenron** est un bot Discord complet conçu pour animer un serveur communautaire autour de l'univers Dragon Ball. Il combine tout ce qu'on attend d'un bot généraliste (modération, logs, économie, niveaux, tickets) avec une couche thématique : l'XP s'appelle "unités" de ki, les paliers vont de `1 000` à `9 000 000` unités (`IT'S OVER 9 MILLION`), les messages de progression citent Kami-sama, Maître Roshi ou Végéta, et les cartes de profil sont rendues façon scouter.

Le bot tourne exclusivement sur **[Bun](https://bun.com)** — pas de Node requis, aucun `node_modules` qui exige le loader Node. La persistance est locale via `bun:sqlite` + Drizzle ORM.

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
- Fusion (`/fusion` avec proposition embed et boutons accept/refuse) : bonus **+10 %** XP et zéni partagés
- Quête quotidienne : +200 zéni par jour, streak tracking

### Jeux & fun

- `/pfc` `/morpion` `/bingo` `/pendu` — mode bot ou joueur, gains **+100 zéni** au gagnant, **-50** au perdant
- `/scan` — image scouter avec lecture de ki
- `/gay` `/raciste` — commandes de pourcentage aléatoire déterministe par jour, avec override statique sur `OWNER_ID`

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
| Canvas | `@napi-rs/canvas` (rendu des cartes profil) |

## Démarrage rapide (2 minutes)

Tout est automatisé par trois scripts bash. Si tu n'as jamais utilisé Bun ni Discord.dev, suis juste ça dans l'ordre.

```bash
git clone <url-du-repo> shenron
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
# 1. Bun ≥ 1.3
curl -fsSL https://bun.com/install | bash
bun --version   # doit afficher ≥ 1.3

# 2. Deps + config
bun install
cp .env.example .env
# édite .env : DISCORD_TOKEN, GUILD_ID, OWNER_ID au minimum

# 3. DB
mkdir -p data
bun run db:migrate
bun run db:seed-triggers        # 15 succès (instantané, offline)
bun run db:seed-wiki            # wiki DBZ (~60 s, fetch dragonball-api.com)

# 4. Run
bun run dev                     # hot reload
# ou : bun run start            # sans watch
# ou : bun run compile && ./dist/shenron   # binaire standalone
```

## Configuration

Toutes les variables sont validées via `zod` dans `src/lib/env.ts`. Les IDs Discord optionnels qui ne sont pas renseignés font **no-op silencieusement** — la feature correspondante reste inactive.

### Variables requises

| Variable | Type | Description |
|---|---|---|
| `DISCORD_TOKEN` | string | Token du bot (portail dev Discord) |
| `GUILD_ID` | snowflake | ID du serveur où enregistrer les slash commands |
| `OWNER_ID` | snowflake | ID du propriétaire (garde `OwnerOnly`, overrides statiques dans certaines commandes) |

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
| `SERVER_INVITE_URL` | URL d'invite du serveur (défaut : `discord.gg/`) — whitelist anti-lien + détection bio |
| `LOG_LEVEL` | Niveau pino : `trace`, `debug`, `info`, `warn`, `error`, `fatal` (défaut : `info`) |
| `NODE_ENV` | `development`, `production`, `test` (défaut : `development`) |

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
| `/profil [membre]` | Carte de profil (image rendue via canvas, 8 thèmes) |
| `/top` | Classement paginé par XP |
| `/solde [membre]` | Voir le solde de zéni |
| `/scan [membre]` | Lecture de ki façon scouter (image) |

</details>

<details>
<summary><strong>Économie</strong></summary>

| Commande | Description |
|---|---|
| `/shop` | Shop paginé (cartes, badges, couleurs, titres) |
| `/buy <clé>` | Acheter un objet |
| `/eprofil` | Éditer le profil (modal : carte / badge / couleur / titre) |
| `/fusion <membre>` | Proposer une fusion — bonus +10 % XP et zéni partagés |
| `/defusion` | Rompre la fusion |

</details>

<details>
<summary><strong>Jeux</strong></summary>

| Commande | Description |
|---|---|
| `/pfc <bot\|joueur> [adversaire]` | Pierre-Feuille-Ciseaux |
| `/morpion <bot\|joueur> [adversaire]` | Morpion |
| `/bingo <bot\|joueur> [adversaire]` | Devine le nombre (1–100) |
| `/pendu <bot\|joueur> [adversaire]` | Pendu avec mots DBZ |

Gains : **+100 zéni** au gagnant · **-50 zéni** au perdant (mode joueur).

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
| `/gay <membre>` | Pourcentage aléatoire déterministe par jour (override : `0` si cible = `OWNER_ID`) |
| `/raciste <membre>` | Pourcentage aléatoire déterministe par jour (override : `101` si cible = `OWNER_ID`) |

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
│   ├── dbz-flavor.ts           messages de level-up + quête quotidienne
│   ├── fusion-names.ts         canoniques + générateur
│   └── preload.ts              reflect-metadata (bunfig preload)
├── services/                   @singleton() tsyringe
│   ├── LevelService
│   ├── EconomyService
│   ├── ModerationService
│   ├── TicketService
│   ├── VocalTempoService
│   ├── LogService
│   ├── InviteTracker
│   ├── CardService             @napi-rs/canvas, 8 thèmes
│   ├── AchievementService      regex cache (TTL 5 min)
│   └── WikiService
├── guards/                     GuildOnly · ModOnly · AdminOnly · OwnerOnly
├── commands/                   @Discord + @Slash
│   ├── admin/Achievements      /succes set|list|remove
│   ├── moderation/Moderation   warn, jail, mute, ban, kick, clear, stats, role
│   ├── economy/Economy         shop, buy, eprofil, fusion, solde, zeni, custom
│   ├── level/Level             profil, top, niveau
│   ├── ticket/Ticket           panel, ticket, close
│   ├── vocal/Vocal             voc kick|ban|unban
│   ├── giveaway/Giveaway       giveaway + ticker
│   ├── games/{Pfc,Morpion,Bingo,Pendu}
│   ├── fun/{Fun,Scan}          gay, raciste, scan
│   └── wiki/Wiki               wiki, races, planete (autocomplete)
├── events/                     @Discord + @On
│   ├── MessageXP               XP + quête + anti-lien + succès regex
│   ├── VoiceXP                 ticker XP vocal + création tempo
│   ├── JoinLeave               logs + invite tracker
│   ├── MessageLog              delete / update
│   ├── BioRole                 presenceUpdate + scan horaire
│   ├── JailExpiry              auto-unjail 60 s
│   └── ready
└── assets/
    ├── fonts/                  Inter, Teko, Saiyan Sans, DBS Scouter
    ├── cards/                  backgrounds custom (optionnel)
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
| `bash scripts/setup.sh` | Setup de A à Z | Installe Bun si absent, `bun install`, `.env` depuis l'exemple, migrations, seeds. Idempotent. |
| `bash scripts/doctor.sh` | Health check | Vérifie Bun, deps, `.env`, DB, **ping le token via REST Discord**, détecte instances en cours. Code retour non-zéro si problème. |
| `bash scripts/start.sh` | Launcher | Flags : `--prod` (pas de watch), `--compiled` (binaire `dist/shenron`), `--bg` (détaché, logs dans `logs/`) |

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

```Dockerfile
FROM oven/bun:1.3-alpine
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY . .
RUN bun run db:migrate
CMD ["bun", "src/index.ts"]
```

### Sauvegarde DB

```bash
# Snapshot à chaud (SQLite avec VACUUM INTO)
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
Non par défaut — les commandes sont enregistrées sur `GUILD_ID` uniquement (déploiement quasi-instantané en dev). Pour multi-guild, retirer `botGuilds` dans `src/index.ts` et compter 1 h pour la propagation globale.

**Comment backup la DB ?**
Le fichier est `data/bot.db`. Snapshot via `VACUUM INTO` (voir [Déploiement](#déploiement)) ou `cp data/bot.db data/bot.bak` à chaud (WAL-safe).

## Licence

UNLICENSED — usage interne. Si tu veux ouvrir le code, ajoute une `LICENSE` (MIT, Apache-2.0, AGPL-3.0) et remplace le badge en haut.

---

Sources best practices README consultées : [Make a README](https://www.makeareadme.com/), [The Good Docs Project](https://www.thegooddocsproject.dev/template/readme), [jehna/readme-best-practices](https://github.com/jehna/readme-best-practices), [banesullivan/README](https://github.com/banesullivan/README), [Codacy](https://blog.codacy.com/best-practices-to-manage-an-open-source-project).
