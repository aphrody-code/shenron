# Mission — Migrer le site `apps/site` de Neon → PostgreSQL local (VPS)

> Prompt d'exécution autonome. Repo : `/home/aphrody/shenron` (local) ↔ VPS `~/shenron` (alias ssh `vps`, `bun` en chemin complet `/home/ubuntu/.bun/bin/bun`). Toujours passer par PR + `git pull` côté VPS, jamais d'édition manuelle sur le VPS.

## Contexte & pourquoi

- Le site **dragonballfr.com** tourne sur le VPS (`shenron-site.service`, `next start` sous Bun, fronté nginx) et lit/écrit une base **PostgreSQL Neon** via `DATABASE_URL`.
- **Incident 2026-06-23** : Neon (plan gratuit) a **dépassé son quota de transfert de données** → toutes les requêtes renvoient `XX000 "exceeded the data transfer quota"`. Le `next build` pré-rend les pages en interrogeant Neon → build échoue → `.next` détruit (deploy-site.sh ne sauvegarde pas le build au rollback) → `shenron-site` ne démarre plus → **site DOWN (502)**.
- **Décision (utilisateur)** : NE PAS payer l'upgrade Neon. **Auto-héberger Postgres sur le VPS** (PG 18, zéro quota, gratuit). Cette migration est donc **restauratrice** — le site est down jusqu'à son exécution.

## État de départ (vérifié)

- VPS **Ubuntu 26.04 LTS**, Postgres **non installé** (seulement `libpq5`/`libpq-dev` client). **28 Go** disque libre (86 % plein — surveiller), **45 Go** RAM.
- Driver Postgres **partout = `postgres-js`** (`apps/site/src/lib/db.ts`, sync bot). **Aucun usage de `@neondatabase/serverless`** → postgres-js parle TCP à n'importe quel Postgres → **migration-safe, zéro changement de driver**.
- `apps/site/.env` → `DATABASE_URL` (Neon pooler). `~/.shenron-neon.env` → `DATABASE_URL` (Neon, utilisé par le bot pour les syncs).
- `apps/bot/data/bot.db` (**169 Mo**) = réplica SQLite complet du wiki éditorial + source runtime.

## Architecture DB (rappel précis)

**Deux schémas dans la base :**

- **`public`** (site-owned, migrations Drizzle `apps/site/src/db/migrations/0000..0003`, config `apps/site/drizzle.config.ts`) :
  `User`, `Post`, `Comment`, `Tierlist`, `TierlistVote`, `WikiCategory`, `WikiPage`, `ba_user`, `ba_session`, `ba_account`, `ba_verification`, `site_events`, `user_preferences`.
- **`bot`** (wiki, lu+écrit par le site via `apps/site/src/db/bot-schema.ts` = `pgSchema("bot")`) :
  `db_characters`, `db_transformations`, `db_races`, `db_techniques`, `db_character_techniques`, `db_planets`, `db_sagas`, `db_arcs`, `db_episodes`, `db_movies`, `db_games`, `db_game_characters`, `db_manga_volumes`, `db_manga_chapters`, `db_news`, `db_tools`, `db_sources`, `db_licenses`, `db_assets`.

**⚠️ Colonnes Neon-only (ABSENTES du SQLite bot → un reseed depuis SQLite les laisse NULL) :**
- `db_episodes` : `subtitles`, **`players`** (lecteurs VF/VOSTFR), `stream_url/headers/provider/at`, **`frames`** (scènes), `scene_preview`.
- `db_movies` : `subtitles`, `players`, `stream_*`.
- `db_manga_chapters` : **`pages`** (URLs webp du lecteur de scan — sans elles, le lecteur manga est vide).

**Syncs bot ↔ base (via `DATABASE_URL` de `~/.shenron-neon.env`, postgres-js) :**
- Forward `apps/bot/scripts/sync-sqlite-to-neon.ts` : runtime + `db_news` SQLite→base (exclut wiki éditorial + `ba_*` + FTS5).
- Reverse `apps/bot/scripts/sync-neon-to-sqlite.ts` : wiki éditorial (liste `apps/bot/scripts/_wiki-editorial.ts`) base→SQLite, par **intersection de colonnes** → les colonnes Neon-only sont auto-ignorées au reverse (donc inchangé après migration). Convertit les `Date` Postgres en **secondes** epoch pour SQLite (sinon corruption an ~57000).

## Stratégie de données (CRUCIAL — Neon est inaccessible)

Le quota bloque **tout** `pg_dump` Neon maintenant. Donc :

- **`public.*` (auth, posts, comments, tierlists, télémétrie)** : données UNIQUEMENT dans Neon. Deux options :
  - **(A) Repartir à neuf** (recommandé pour débloquer vite) : recréer les tables vides via Drizzle. On perd : sessions (les users se reconnectent via Discord), posts/comments/tierlists, télémétrie. Acceptable si peu de contenu éditorial.
  - **(B) Backfiller plus tard** : quand le quota Neon se réinitialise (cycle mensuel) ou via un upgrade ponctuel 1 mois, `pg_dump --schema=public` Neon → restore dans le PG local. À programmer.
- **`bot.*` (wiki)** : le SQLite bot est un **réplica complet** → reseed local PG depuis SQLite (étape 7). **MAIS** re-dériver les colonnes Neon-only (étape 8) sinon lecteurs manga/épisodes cassés.

## Runbook

### 1. Installer PostgreSQL 18
```bash
ssh vps 'sudo apt update && sudo apt install -y postgresql postgresql-contrib && sudo systemctl enable --now postgresql && psql --version'
```

### 2. Rôle + base + schéma `bot`
```bash
ssh vps "sudo -u postgres psql -v ON_ERROR_STOP=1 <<'SQL'
CREATE ROLE shenron WITH LOGIN PASSWORD '__CHANGEME_STRONG__';
CREATE DATABASE shenron_site OWNER shenron;
\\c shenron_site
CREATE SCHEMA IF NOT EXISTS bot AUTHORIZATION shenron;
GRANT ALL ON SCHEMA public TO shenron;
ALTER DATABASE shenron_site SET search_path = public, bot;
SQL"
```
- Connexion **locale uniquement** (`127.0.0.1:5432`). Vérifier `listen_addresses='localhost'` (défaut). `pg_hba.conf` : `host shenron_site shenron 127.0.0.1/32 scram-sha-256`.

### 3. Pointer les env vers le PG local (`printf`, jamais `echo` ; chmod 600)
```bash
LOCAL_URL='postgresql://shenron:__CHANGEME_STRONG__@127.0.0.1:5432/shenron_site'
# apps/site/.env : remplacer la ligne DATABASE_URL (garder l'ancienne Neon en commentaire pour backfill B)
# ~/.shenron-neon.env : idem DATABASE_URL=$LOCAL_URL
```
> ⚠️ Le hook PreToolUse bloque l'édition de `.env` par l'agent → l'utilisateur édite ces 2 fichiers à la main, ou via `printf >>` en session `!`.

### 4. (Optionnel) re-tuner `apps/site/src/lib/db.ts`
`prepare:false`/`max:1` étaient pour le pooler pgbouncer de Neon. En local (pas de pgbouncer) on peut `prepare:true`, `max:10`, `idle_timeout:60`. **Optionnel** — l'existant marche tel quel. Si modifié → PR + build.

### 5. Créer le schéma `public` (migrations Drizzle du site)
```bash
ssh vps 'export PATH=$HOME/.bun/bin:$PATH; cd ~/shenron/apps/site && bunx drizzle-kit migrate'
# → crée public.User/Post/.../ba_*/site_events/user_preferences
```

### 6. Créer les tables `bot.*` dans le PG local
Les `bot.*` ne sont PAS dans les migrations du site (lecture seule via `bot-schema.ts`). Générer leur DDL depuis le schéma Drizzle :
```bash
# Créer apps/site/drizzle.config.bot.ts éphémère :
#   schema:"./src/db/bot-schema.ts", out:"./drizzle-bot", dialect:"postgresql",
#   dbCredentials:{url:process.env.DATABASE_URL!}
ssh vps 'export PATH=$HOME/.bun/bin:$PATH; cd ~/shenron/apps/site && \
  bunx drizzle-kit generate --config drizzle.config.bot.ts && \
  bunx drizzle-kit migrate  --config drizzle.config.bot.ts'
ssh vps "sudo -u postgres psql shenron_site -c '\\dt bot.*'"   # toutes les tables présentes (avec colonnes Neon-only)
```

### 7. Seed `bot.*` depuis le SQLite bot
Écrire `apps/bot/scripts/seed-pg-from-sqlite.ts` (inspiré de `sync-sqlite-to-neon.ts` mais **SANS l'exclusion wiki** — on veut éditorial + runtime). Lit `data/bot.db`, INSERT dans `bot.*` du PG local (`DATABASE_URL`). **Respecter l'ordre FK** : `db_planets`/`db_races` → `db_characters` → `db_transformations`/`db_techniques`/`db_character_techniques` ; `db_sagas` → `db_arcs` → `db_episodes` ; `db_manga_volumes` → `db_manga_chapters` ; `db_games` → `db_game_characters` ; `db_sources`/`db_licenses` → `db_assets`. **Convertir les dates** (secondes epoch SQLite → `timestamp`/`bigint` Postgres). Colonnes Neon-only laissées NULL → étape 8.
```bash
ssh vps 'export PATH=$HOME/.bun/bin:$PATH; cd ~/shenron/apps/bot && bun scripts/seed-pg-from-sqlite.ts'
```

### 8. Re-dériver les colonnes Neon-only
- `db_manga_chapters.pages` → re-run l'ingest qui liste les webp par chapitre depuis `apps/bot/assets/manga/` (script d'ingest des pages de chapitre).
- `db_episodes.players` / `db_movies.players` → `bun scripts/import-voiranime-players-vf.ts` + `import-voiranime-players.ts` (dataset `~/bxc/data/voiranime/dragon-ball-full.json`) — écrivent `players` dans la base (= PG local via `DATABASE_URL`).
- `db_episodes.frames` / `scene_preview` → `ingest-episode-frames.ts` (si masters dispo) — **optionnel**, peut attendre.
- **Alternative fidèle** : quand le quota Neon se réinitialise, `pg_dump` ces colonnes depuis Neon → `UPDATE` ciblé en local.

### 9. Rebuild + restart du site
```bash
ssh vps 'sudo systemctl reset-failed shenron-site 2>/dev/null; export PATH=$HOME/.bun/bin:$PATH; cd ~/shenron && bash scripts/deploy-site.sh'
# build contre PG local (zéro quota) → .next valide → shenron-site UP
```

### 10. Restart bot + syncs (pointent désormais le PG local)
```bash
ssh vps 'sudo systemctl restart shenron && \
  sudo systemctl start shenron-neon-sync.service && \
  sudo systemctl start shenron-neon-pull.service && \
  journalctl -u shenron-neon-sync -n 30 --no-pager'
```

### 11. Vérifications
```bash
curl -sI https://dragonballfr.com/wiki/personnages | grep -iE 'HTTP|cache-control'   # 200 + public
curl -s  https://dragonballfr.com/wiki/manga | grep -o 'Cherche une réplique'        # bloc recherche
ssh vps "sudo -u postgres psql shenron_site -c 'select count(*) from bot.db_characters'"  # ~1323
```
- `/wiki/manga` → lecteur OK si pages re-dérivées (étape 8). `/wiki/episodes/<id>` → lecteurs OK si players re-dérivés. Login Discord → session dans `public.ba_session`.

### 12. Durabilité & hardening
- **Backup quotidien** : timer systemd calqué sur `shenron-backup.timer` → `pg_dump shenron_site | gzip > ~/shenron/apps/site/backups/pg-$(date +%F).sql.gz`.
- **Fix la cause de l'outage** : durcir `scripts/deploy-site.sh` → **sauvegarder `.next` avant build** (`mv apps/site/.next apps/site/.next.prev`) et le **restaurer au rollback** (la fonction `rollback()` ne restaure que le git aujourd'hui). C'est l'absence de ça qui a transformé un build raté en site mort.
- Tuning PG modeste (petite base) : `shared_buffers=512MB`, `work_mem=16MB`, `effective_cache_size=2GB`.

## À committer (PR)
- `apps/bot/scripts/seed-pg-from-sqlite.ts` (nouveau).
- `apps/site/drizzle.config.bot.ts` (création schéma bot.*).
- `scripts/deploy-site.sh` : backup/restore `.next` au rollback.
- `apps/site/src/lib/db.ts` : tuning local (si modifié).
- `CLAUDE.md` : remplacer « DB site = Neon » → « **DB site = PostgreSQL local VPS** (`127.0.0.1:5432`, base `shenron_site`, schémas `public` + `bot`) ; Neon décommissionné (backup froid, repli si besoin) ». MAJ sections *Services VPS*, *DB & migrations*, *Sources de vérité*, et les pièges Neon (pooler/serverless).
- Workflows `.github/workflows/{neon-branch,deploy-vercel}.yml` : déjà en standby ; la branche Neon par PR n'a plus d'objet (désactiver/noter).

## Rollback de la migration
- Le **SQLite bot n'est jamais modifié** (source de re-seed) → sûr. Le PG local est jetable (`DROP DATABASE shenron_site`).
- Revenir à Neon : remettre l'ancienne `DATABASE_URL` Neon dans les 2 env (quand le quota sera relevé) + `deploy-site.sh`.

## Risques / points d'attention
1. **Perte `public.*` Neon** (sessions/posts/télémétrie) si option A sans backfill → prévenir l'utilisateur ; option B quand le quota reset.
2. **Colonnes Neon-only** (players/pages/frames) : sans étape 8 → lecteurs manga/épisodes vides.
3. **Ordre FK** + **conversion de dates** au seed (étape 7).
4. **Disque VPS 86 %** : PG + WAL + backups ajoutent ~1 Go — surveiller, prune les backups.
5. **Sécurité** : Postgres local-only, mot de passe fort, jamais committé. `.env` chmod 600.
