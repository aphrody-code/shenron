# Filebrowser — serveur de fichiers files.dragonballfr.com

Serveur de fichiers + upload, UI alignée sur le site (navy + or DB + Google Sans Flex),
**locale française forcée**, racine = **tout le dépôt `~/shenron`**.

- Service : `deploy/systemd/filebrowser.service` (loopback `:8081`, root `/home/ubuntu/shenron`).
- Vhost : `deploy/nginx/files.dragonballfr.com.conf` (TLS, upload 2g, rate-limit login,
  `location /brand/` sert la police depuis `/var/www/files-brand/`).
- Branding : `branding/custom.css` + `branding/img/logo.svg` (dragon ball 4 étoiles or).

## Provisioning (première fois, hors install.sh)

```bash
# 1. binaire
curl -fsSL https://github.com/filebrowser/filebrowser/releases/latest/download/linux-amd64-filebrowser.tar.gz \
  | sudo tar xz -C /usr/local/bin filebrowser

# 2. dossiers + branding (assets versionnés ici)
mkdir -p ~/filebrowser/branding
cp -r deploy/filebrowser/branding/* ~/filebrowser/branding/
# police servie par nginx (home en 750 non traversable → /var/www)
sudo install -D -m644 apps/site/public/fonts/google-sans-flex.woff2 /var/www/files-brand/google-sans-flex.woff2

# 3. DB + config (locale fr, racine shenron, branding, thème dark)
DB=~/filebrowser/filebrowser.db
filebrowser config init -d "$DB"
filebrowser config set -d "$DB" --address 127.0.0.1 --port 8081 --root /home/ubuntu/shenron \
  --auth.method=json --locale fr --scope / --branding.theme dark --branding.color "#ffb200" \
  --branding.name "Shenron Files" --branding.files ~/filebrowser/branding --branding.disableExternal
filebrowser users add admin '<motdepasse>' --perm.admin --locale fr -d "$DB"
filebrowser users update admin --perm.execute=false -d "$DB"   # pas de shell

# 4. service + vhost (via l'installeur commun)
bash deploy/install.sh --nginx
```

## Attention (sécurité)

- La racine servie = **le dépôt de prod complet**, en **lecture ET écriture** (uploads).
  `apps/bot/.env` / `apps/site/.env` (secrets live) sont **téléchargeables** via l'UI
  admin, et une modif/suppression touche le **code que les services tournent** en prod.
  Accès protégé par login (admin uniquement) + rate-limit nginx. Changer le mot de passe
  admin régulièrement ; ne jamais partager de lien public vers un `.env`.
- Éditer la config filebrowser (DB bbolt) nécessite d'**arrêter le service** (verrou
  écrivain unique) : `sudo systemctl stop filebrowser && filebrowser config set … && sudo systemctl start filebrowser`.
