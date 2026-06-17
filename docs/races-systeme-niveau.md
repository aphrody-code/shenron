# Plan — Système de races & niveaux (inspiré Xenoverse 2)

> Statut : **proposition / design**. Objet : permettre à un membre de choisir une
> **race** (Saiyan, Terrien, Namek, Majin, Race de Freezer, Android) qui modifie
> son **système de progression** (XP, perks, paliers, économie), façon Xenoverse 2.
> Découpé en 3 phases livrables indépendamment. Ancré dans le code existant.

---

## 1. Objectif

- Donner une **identité de jeu** à chaque membre via une race choisie une fois.
- Faire **varier la progression par race** (vitesse d'XP, bonus passifs, paliers,
  zeni) pour récompenser des styles de présence différents (chat, vocal, jeux…).
- Rester **réversible et additif** : aucune régression sur le leveling actuel des
  membres sans race (race = couche au-dessus).

Non-objectif (Phase 1) : un vrai moteur RPG (stats HP/Ki/combat). Voir Phase 3.

---

## 2. Référence Xenoverse 2 (résumé des partis pris)

Dans Xenoverse 2, chaque race a des forces/faiblesses sur des **stats** (Santé, Ki,
Stamina, Attaque de base/Frappe, Ki Blast, Charge) et des **traits** :

| Race | Traits marquants Xenoverse |
|---|---|
| Saiyan | Monte vite, **boost quand HP bas** (zenkai), accès Super Saiyan, polyvalent |
| Terrien (Humain) | Équilibré, **meilleure récup Ki/Stamina**, fort aux objets |
| Namek | **Régénération de santé** passive, grosse défense, attaque faible |
| Majin | Grosse **Santé/Stamina**, mâles tanks / femelles agiles, imprévisible |
| Race de Freezer | **Récup Ki rapide**, fort en mêlée, faible santé |
| (Bio-)Android | Pas de régénération de stamina « naturelle », tient dans la durée |

On **transpose ces traits** sur nos leviers réels (XP, cooldowns, zeni, vocal,
jeux), pas sur un combat. Cf. table §3.

---

## 3. Les races DBFR + table de design (Phase 1)

6 races, **rôles Discord mutuellement exclusifs**. Chaque race mappe les traits
Xenoverse sur les leviers existants du bot.

| Race | Multiplicateur XP | Perk passif principal | Faiblesse / contrepartie | Saveur |
|---|---|---|---|---|
| **Saiyan** | ×1.25 (chat+vocal) | « Zenkai » : +50 % XP pendant 1 h après un palier | Coût zeni des paliers ↑ | Monte vite, combattant né |
| **Terrien** | ×1.0 | **+25 % zeni** (drops + daily) | Pas de boost XP | Polyvalent, économe |
| **Namek** | ×1.0 | **Régén quotidienne** : +X XP/zeni passifs même inactif (1×/j) | XP de message légèrement ↓ | Patient, régénérant |
| **Majin** | ×1.1 | **+50 % gains aux jeux** (pfc/morpion/bingo) | Aléa : ±10 % sur les drops | Imprévisible, joueur |
| **Race de Freezer** | ×1.2 **vocal** / ×1.0 chat | Récompense **présence vocale** (cooldown vocal ↓) | XP chat normal | Efficace, vif |
| **Android** | ×1.05 | **Pas de cooldown XP** (gain régulier, anti-spam léger maintenu) | Pas de daily quest bonus | Constant, infatigable |

> Les valeurs sont des **points de départ à équilibrer** (toutes pilotables en
> settings, cf. §5). Règle clé : un membre ne doit jamais se sentir « puni »
> d'avoir choisi une race — chaque race est forte sur **un** axe.

**Paliers par race** : chaque race a sa **piste de rôles de palier** (ex. Saiyan
niv. 50 → « Super Saiyan », Namek niv. 50 → « Namek Ultime »…), en plus des
paliers communs. Réutilise `level_rewards` (cf. §5).

---

## 4. Ce qui existe déjà (réutilisé — gros gain de temps)

Le bot a quasiment toute la plomberie. Fichiers concernés :

- **XP & niveau** : `apps/bot/src/events/MessageXP.ts`, `events/VoiceXP.ts`,
  `services/LevelService.ts` (`addXP()`, `handleLevelUp()`), courbe
  `lib/xp.ts` (`levelForXP`) + table `LEVEL_THRESHOLDS` (`lib/constants.ts`).
- **Multiplicateur d'XP par rôle** : `xp.boost.role.<roleId>` (préfixe settings,
  `SettingsService.getXpBoostRoles()`). MessageXP/VoiceXP appliquent **le plus
  grand** multiplicateur parmi les rôles du membre (ne stacke pas). → **Le
  multiplicateur de race Phase 1 = juste poser un `xp.boost.role.<raceRoleId>`.**
- **Récompenses de palier** : table `level_rewards` (`level` PK, `role_id`,
  `zeni_bonus`, `xp_threshold`, `banner_url`) + `handleLevelUp` qui pose les rôles.
- **Économie** : `EconomyService` (zeni), settings `zeni.*` (daily quest, drops,
  gains de jeux).
- **Jeux** : `services/games/*` (pfc, morpion, bingo) — pour le perk Majin.
- **Réglages runtime** : `SettingsService` + `SETTINGS_KEYS` (modifiables depuis le
  dashboard, sans redeploy).
- **Données races** : `bot.db_races` (Saiyan, Humain, Namek…) déjà dans le wiki +
  pages site `/wiki/races` → réutilisables pour la page « choisis ta race ».
- **Multi-persona** : `lib/personas.ts` — la commande `/race` sera portée par un
  persona qui a déjà les intents membres (kaïo : `GuildMembers`).

⚠️ Avant tout edit de `personas.ts` ou ajout d'event : lancer le subagent
`intent-auditor` (cf. CLAUDE.md, piège « intent ↔ event mismatch »).

---

## 5. Architecture & modèle de données

### 5.1 Source de vérité : SQLite bot (runtime)

La progression/économie est **runtime** → vit dans `apps/bot/data/bot.db`
(SQLite, Drizzle) et remonte vers Neon par le **forward-sync** (runtime inclus,
wiki exclu). **Ne PAS** écrire ça dans le wiki éditorial (garde
`wiki-write-guard`). Cf. CLAUDE.md.

### 5.2 Nouvelle colonne `users.race`

Migration Drizzle (`apps/bot/drizzle/`) :

```ts
// apps/bot/src/db/schema.ts — table users
race: text("race"),              // "saiyan" | "terrien" | "namek" | "majin" | "freezer" | "android" | null
raceChosenAt: integer("race_chosen_at"), // epoch ms — pour cooldown de changement
```

Pas de nouvelle table nécessaire en Phase 1 (1 race par user). Si on veut un
historique de changements → table `race_changes` (Phase 2, optionnel).

### 5.3 Catalogue de races (code, pas DB)

`apps/bot/src/lib/races.ts` (nouveau) — **source de vérité du design**, typé :

```ts
export interface RaceDef {
  id: RaceId;                 // "saiyan" | ...
  name: string;               // "Saiyan"
  roleIdSetting: string;      // clé settings du rôle Discord exclusif
  xpMultiplier: number;       // appliqué via xp.boost.role.<roleId> (config)
  perks: RacePerk[];          // effets passifs (voir §6.3)
  color: string; emoji: string;
}
export const RACES: Record<RaceId, RaceDef> = { /* … */ };
```

Les **rôles Discord** et **multiplicateurs** restent pilotables en settings
(`race.role.<id>`, `xp.boost.role.<roleId>`) pour équilibrer sans redeploy.

### 5.4 Nouvelles clés `SETTINGS_KEYS`

```
race.enabled                 (bool)   — feature flag global
race.change.cost_zeni        (int)    — coût d'un changement de race (0 = gratuit)
race.change.cooldown_days    (int)    — délai entre 2 changements
race.role.saiyan|terrien|... (snowflake) — rôle Discord par race
race.<id>.xp_mult            (float)  — multiplicateur (ou via xp.boost.role)
race.<id>.zeni_mult          (float)  — multiplicateur de zeni
race.namek.daily_regen_xp    (int)    — perk Namek
race.majin.game_bonus_ratio  (float)  — perk Majin
```

---

## 6. Phase 1 — Races + progression (le sweet spot)

**But** : choix de race + effets sur XP/zeni/paliers. **Réutilise l'existant ;
surtout de la config + une commande + un peu de glue.** Faible risque.

### 6.1 Choix de race
- Commande **`/race choisir`** (ou menu de rôles avec boutons) portée par **kaïo**
  (intents membres OK). Affiche les 6 races (embed + boutons), applique le rôle
  exclusif (retire les autres rôles de race), écrit `users.race` + `raceChosenAt`.
- **`/race info`** : fiche de ma race (perks, multiplicateurs, paliers à venir).
- **`/race changer`** : gated par `race.change.cost_zeni` + `race.change.cooldown_days`.
- Garde-fou : un seul rôle de race à la fois (réconciliation au choix + au
  `guild-sync` quotidien).

### 6.2 Effet XP (zéro changement de courbe)
- On garde la **courbe unique** (`LEVEL_THRESHOLDS`). La race agit comme
  **multiplicateur d'XP** → pose `xp.boost.role.<raceRoleId> = race.<id>.xp_mult`.
  MessageXP/VoiceXP l'appliquent déjà (max des rôles). **Zéro code XP à toucher.**
- Variante vocal-only (Freezer) : si on veut un multiplicateur différent
  chat vs vocal, ajouter un petit hook dans `VoiceXP` lisant `race.<id>.voice_mult`
  (≈10 lignes).

### 6.3 Perks passifs (glue légère)
- **Zenkai (Saiyan)** : dans `LevelService.handleLevelUp`, si race=saiyan, poser un
  boost temporaire 1 h (clé Redis `race:zenkai:<userId>` lue par MessageXP, ou un
  champ `users.boost_until`). MessageXP applique +50 % si actif.
- **+zeni (Terrien)** : dans `EconomyService` (drops + daily), multiplier par
  `race.terrien.zeni_mult` si race=terrien.
- **Régén Namek** : timer quotidien (réutiliser un timer existant type
  `shenron-guild-sync` ou un cron in-process) → +X XP/zeni aux Nameks inactifs.
- **Bonus jeux (Majin)** : dans `services/games/*` résolveurs de gains, ×
  `race.majin.game_bonus_ratio` si race=majin.
- **No-cooldown (Android)** : MessageXP lit la race ; si android, ignore le
  cooldown `xp.message.cooldown_ms` (anti-spam minimal conservé).

> Tous les perks sont **gated par `race.enabled`** et lisent des settings → on peut
> désactiver/équilibrer à chaud.

### 6.4 Paliers par race
- Étendre `level_rewards` avec une colonne optionnelle `race` (null = palier
  commun ; sinon réservé à cette race). `handleLevelUp` ne pose un reward de race
  que si `member.race === reward.race`. Migration + petite condition.

### 6.5 Site (léger)
- Page **`/race`** (ou section profil) : présentation des 6 races (depuis
  `db_races` + `lib/races`), CTA « choisis sur Discord ». Lecture seule, cacheable.
- Carte de profil / `/profil/me` : afficher la race (badge).

### Fichiers Phase 1 (récap)
```
NEW  apps/bot/src/lib/races.ts                 (catalogue + types)
NEW  apps/bot/src/commands/.../Race.ts          (/race choisir|info|changer)  → gen:entries
EDIT apps/bot/src/db/schema.ts                  (users.race, raceChosenAt ; level_rewards.race)
NEW  apps/bot/drizzle/XXXX_race.sql             (migration)
EDIT apps/bot/src/services/SettingsService.ts   (SETTINGS_KEYS race.*)
EDIT apps/bot/src/services/LevelService.ts      (zenkai + reward de race)
EDIT apps/bot/src/events/MessageXP.ts           (zenkai + no-cooldown android)
EDIT apps/bot/src/services/EconomyService.ts    (zeni race mult)
EDIT apps/bot/src/services/games/*              (bonus Majin)
NEW  apps/site/src/app/race/page.tsx            (présentation races)
```

---

## 7. Phase 2 — Identité de race (moyen)

- **Transformations par race** branchées sur les fusions / l'économie (ex.
  débloquer « Super Saiyan » à un palier → boost cosmétique + rôle).
- **Courbes d'XP par race** (vrai différenciateur) : `levelForXP(xp, race)` +
  tables de seuils par race dans `lib/constants.ts`. Plus impactant que le simple
  multiplicateur, mais demande de re-tester rank/leaderboard.
- **Carte profil canvas** : visuel par race (couleur/aura).
- **Page site enrichie** : « choisis ta race » avec stats comparatives, lien wiki.
- **Historique** : table `race_changes` si on veut tracer/limiter.

---

## 8. Phase 3 — Stats & combat (gros, optionnel)

Vrai layer RPG : stats Santé/Ki/Stamina par race, forces/faiblesses, et un
**mini-combat** (PvE boss hebდo / PvP duel) qui consomme/َrécompense l'XP & zeni.
C'est un **projet à part entière** (semaines) avec game design dédié :
- À quoi servent les stats ? (combat, events, classement de puissance)
- Où se joue le combat ? (commande Discord, mini-jeu site canvas/Pixi)
- Équilibrage + anti-abus.
Recommandation : ne lancer la Phase 3 que si la Phase 1/2 a de l'adoption.

---

## 9. Commandes & UX

| Surface | Élément |
|---|---|
| Discord | `/race choisir` (boutons), `/race info`, `/race changer` |
| Discord | Embed de level-up mentionnant la race + perk déclenché |
| Site | `/race` (présentation), badge race sur `/profil/me` + carte canvas |
| Admin | Dashboard : éditer `race.*` settings, voir répartition des races (stats) |

---

## 10. Migrations & seeds

- Migration Drizzle SQLite : `users.race`, `users.race_chosen_at`,
  `level_rewards.race`. Générer via `bun --filter @shenron/bot run db:migrate`
  (cf. CLAUDE.md ; **ne pas** lancer drizzle-kit pendant que le bot tourne →
  risque de lock SQLite, redémarrer après).
- Pas de seed wiki (les races existent déjà dans `db_races`). Le **catalogue de
  design** (`lib/races.ts`) est du code, pas un seed.
- Refléter les colonnes côté site (`apps/site/src/db/bot-schema.ts`) si on lit la
  race depuis le site (Neon).

---

## 11. Pièges & contraintes (CLAUDE.md)

- **Intents** : porter `/race` sur **kaïo** (a `GuildMembers`). Lancer
  `intent-auditor` avant edit de `personas.ts`.
- **`_entries.ts`** : `bun run gen:entries` après ajout de la commande (hook
  PostToolUse le fait sur edit dans `commands/`).
- **Wiki-write-guard** : la race est du **runtime** (SQLite users) → autorisé.
  Ne JAMAIS l'écrire dans les tables wiki éditoriales.
- **Sync** : `users.race` remonte vers Neon via le forward-sync runtime (déjà
  inclus). Le site lit la race depuis Neon (eu-central-1 — cf. mémoire
  `neon-prod-db-eu-central`, **pas** le MCP patient-star).
- **DI tsyringe** : `import { Class }` sans `type` pour les services injectés.
- **SQLite lock** : redémarrer `shenron` après migration.
- **Bun-only**, catalog de versions, commits FR 1-ligne sans Co-Authored-By.

---

## 12. Tests & rollout

1. `bun run lint` + `bun run type-check` + `bun --filter @shenron/bot test`.
2. Tester `/race` sur un serveur de staging (ou rôle test) : choix, exclusivité,
   multiplicateur effectif (envoyer des messages, vérifier l'XP gagné), level-up
   reward de race, perks (zenkai/zeni/jeux).
3. Déploiement progressif : `race.enabled=false` au déploiement, activer ensuite
   via le dashboard une fois les rôles Discord créés et câblés dans `race.role.*`.
4. Annonce communautaire + `/race` épinglé.

---

## 13. Décisions à trancher (avant Phase 1)

1. **Changement de race** : définitif, ou changeable ? Si changeable : gratuit ou
   coût zeni + cooldown ? (défaut proposé : changeable, coût zeni + 7 j de cooldown)
2. **6 races** ci-dessus OK, ou en ajouter (Bio-Android distinct, Ange/Dieu) ?
3. **Multiplicateurs de départ** (table §3) à valider/équilibrer.
4. **Rétroactif** : les membres existants gardent leur niveau ; race = neutre tant
   que non choisie. OK ?
5. **Paliers par race** dès la Phase 1, ou paliers communs d'abord ?

---

## 14. Estimation d'effort

| Phase | Effort | Risque |
|---|---|---|
| **Phase 1** (races + XP/perks/paliers + page site) | ~1–2 j | Faible (réutilise tout) |
| **Phase 2** (transfos, courbes par race, canvas, historique) | ~3–5 j | Moyen |
| **Phase 3** (stats + combat RPG) | semaines | Élevé (game design) |

**Recommandation** : livrer la **Phase 1** d'abord (80 % du ressenti Xenoverse pour
20 % de l'effort, réversible via `race.enabled`), mesurer l'adoption, puis Phase 2.
