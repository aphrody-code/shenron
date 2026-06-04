# Système de Synchronisation Google Drive (Wiki Assets)

Ce document décrit le fonctionnement de la synchronisation automatique du dossier Google Drive contenant les médias du Wiki dans le projet **Shenron**.

---

## 📋 Informations du Dossier Drive

*   **URL du dossier** : `https://drive.google.com/drive/folders/1I_qmhLcgrWEVBeO9YXEj_tqqhH3-9DmW`
*   **Identifiant du dossier** : `1I_qmhLcgrWEVBeO9YXEj_tqqhH3-9DmW`
*   **Dossier local de destination** : `apps/site/public/wiki/` (situé dans le répertoire racine de Shenron)

---

## ⚙️ Architecture de Synchronisation

La synchronisation s'articule autour de trois éléments principaux :

1.  **Script Python de Téléchargement Parallèle (`scripts/download_gdrive.py`)** :
    *   Résout récursivement les dossiers du Drive via `gdown`.
    *   Télécharge les fichiers de manière asynchrone (multithreading avec pool de threads).
    *   Supporte la reprise des téléchargements partiels/interrompus (`--resume`).
    *   Gère automatiquement l'installation locale de ses dépendances via le moteur de script `uv`.

2.  **Wrapper Shell (`scripts/shenron-drive-sync.sh`)** :
    *   Encapsule l'appel au script Python avec des paramètres optimaux (par exemple, concurrence limitée à 4 téléchargements pour éviter le bannissement d'API / limitation de débit par Google).
    *   Marqué comme exécutable.

3.  **Planification systemd (`deploy/systemd/`)** :
    *   **`shenron-drive-sync.service`** : Tâche unitaire (`Type=oneshot`) qui exécute le script shell.
    *   **`shenron-drive-sync.timer`** : Planifie le service pour qu'il s'exécute quotidiennement (`OnCalendar=daily`).

---

## 🚀 Commandes d'Administration

### Lancement manuel de la synchronisation
Vous pouvez exécuter le script de synchronisation manuellement à tout moment :
```bash
bash scripts/shenron-drive-sync.sh
```

### Vérification de l'état du Timer systemd
Pour vérifier la planification automatique et l'heure du prochain passage :
```bash
systemctl list-timers "shenron-drive-sync*"
systemctl status shenron-drive-sync.timer
```

### Consultation des journaux (Logs) du service
Pour consulter la sortie de la dernière synchronisation effectuée par systemd :
```bash
journalctl -u shenron-drive-sync.service -n 50 --no-pager
```
