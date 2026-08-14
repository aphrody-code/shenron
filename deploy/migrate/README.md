# Kit de migration shenron → nouveau VPS

Migration complète de la stack (bot + site + MCP + sidecar embed + PostgreSQL +
Redis + assets + RAG) d'un VPS vers un autre, à IP différente puis bascule DNS.

Cible de référence de cette migration : `vps-6732365f.vps.ovh.net` (51.255.162.6),
Ubuntu 26.04, 6 vCores / 12 Go / 100 Go, OVH GRA — compte OVH `dragonballfr`.

## Pré-requis d'accès

- Un accès SSH par clé sur la cible (utilisateur `ubuntu`, sudo). Si le VPS OVH est
  nu : `rebuild` via l'API OVH (`/vps/{sn}/rebuild`, image Ubuntu + `sshKey`) — la
  clé atterrit dans `root`, créer ensuite `ubuntu` (clé + sudo) et purger
  l'expiration du mot de passe hérité (`chage --maxdays -1 --lastday today ubuntu`).
- Alias SSH conseillé dans `~/.ssh/config` :
  ```
  Host newvps
    HostName 51.255.162.6
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519
  ```

## Ordre d'exécution

| #   | Script                    | Où                       | Rôle                                                                                                                                                       |
| --- | ------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `10-bootstrap-target.sh`  | **cible**                | paquets OS (PG18, Redis, nginx+brotli, certbot dns-ovh, ffmpeg, cairo/pango, tesseract), Bun canary, rôle+base PG, drop-in nginx (zone `rpb_api` + brotli) |
| 2   | `20-clone-and-install.sh` | **cible**                | `git clone` (repo public) + `bun install` + `gen:entries`                                                                                                  |
| 3   | `30-transfer-data.sh`     | **source**               | secrets (.env/ovh/neon), `bot.db` (VACUUM INTO), `data/rag`, `.models`, `assets`, dump/restore PostgreSQL, dump/restore Redis (RDB)                        |
| 4   | `40-deploy.sh`            | **cible**                | build site, units systemd, **certbot dns-ovh** (avant les vhosts), vhosts `dragonballfr.com` uniquement, démarrage bot/site/embed/mcp, smoke loopback      |
| 5   | `cutover-dns.ts`          | n'importe où (creds OVH) | bascule A+AAAA (`@`,`www`,`bot`,`mcp`) → nouvelle IP + refresh zone                                                                                        |

```bash
# 1) cible
SHENRON_PG_PASSWORD='<mdp du DATABASE_URL>' bash 10-bootstrap-target.sh
bash 20-clone-and-install.sh
# 2) source
TARGET=newvps bash deploy/migrate/30-transfer-data.sh
# 3) cible
CERTBOT_EMAIL=you@example.com bash deploy/migrate/40-deploy.sh
# 4) bascule (après smoke verts) — les smoke passent AVANT via IP directe / Host header :
#    curl -H 'Host: dragonballfr.com' --resolve dragonballfr.com:443:51.255.162.6 https://dragonballfr.com/
OVH_CONF=~/.config/ovh/dbfr.conf bun deploy/migrate/cutover-dns.ts --dry-run   # vérif
OVH_CONF=~/.config/ovh/dbfr.conf bun deploy/migrate/cutover-dns.ts
```

## Points d'attention

- **Vhosts** : seuls les 3 `*.dragonballfr.com` sont posés ; les legacy `*.rpbey.fr`
  du repo référencent des certs d'un autre compte OVH (absents ici) → exclus.
- **Certbot dns-ovh** fonctionne AVANT la bascule DNS (validation DNS-01 via l'API OVH).
- **Redis** : RDB complet copié (choix « dump/restore »), inclut des clés d'autres
  apps de la source — inertes sur la cible dédiée.
- **Mot de passe PG** : le rôle `shenron` doit être créé avec le mot de passe présent
  dans `DATABASE_URL` (URL-décodé) sinon l'app ne se connecte pas.
- **Sidecar LLM** (`shenron-llm`, llama.cpp) : hors périmètre (OFF en prod). Le rebuild
  nécessiterait de recompiler llama.cpp + le GGUF si on le réactive.
- **Source restée en place** : la migration ne coupe rien côté source tant que le DNS
  n'est pas basculé (rollback = repointer l'A record sur l'ancienne IP).
