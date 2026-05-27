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
| `deploy/systemd/shenron-neon-sync.{service,timer}` | Miroir SQLite→Neon (schéma `bot`) toutes les 30 min. |
| `deploy/nginx/bot.rpbey.fr.conf` | Vhost API publique du bot (proxy `:5006`). |
| `deploy/nginx/shenron.conf` | Vhost dashboard SPA + upstream `shenron_api`. |
| `deploy/install.sh` | Installeur idempotent (copie units + reload + enable, `--nginx`, `--start`). |
| `scripts/backup-shenron-sqlite.sh` | Script du backup (appelé par le timer). |
| `scripts/shenron-guild-sync.sh` | Script de la réconciliation. |
| `scripts/deploy-shenron.sh` | Pull + lint/tsc + dashboard:css + restart + smoke `/auth/me` + rollback auto. |
| `apps/bot/scripts/sync-sqlite-to-neon.ts` | Miroir Neon (appelé par le timer). |
| `apps/bot/Dockerfile`, `apps/bot/fly.toml` | Cible conteneur / Fly.io (alternative sans VPS). |

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

ainsi que des certificats letsencrypt pour `bot.rpbey.fr` et
`shenron.rpbey.fr` (`certbot --nginx -d …`).

## Alternative sans VPS (conteneur)

`apps/bot/Dockerfile` + `apps/bot/fly.toml` permettent un déploiement Fly.io
(workflow `.github/workflows/deploy-fly.yml`). Le site est déjà 100 % Vercel.
Seul le SQLite local (`apps/bot/data/bot.db`) suppose un volume persistant —
sur Fly, monter un volume sur `/app/data`.
