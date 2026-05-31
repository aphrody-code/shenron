# deploy/ — provisioning self-contained du monorepo

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
# Miroir Neon : créer /home/ubuntu/.shenron-neon.env avec DATABASE_URL=… (600)
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
