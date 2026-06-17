# Portraits Xenoverse 2

Portraits de visages (PNG ~45-53 Ko) des personnages, extraits du jeu **Dragon Ball
Xenoverse 2** depuis l'atlas UI `data1/data/ui/texture/CHARA01.emb` via le toolkit
`dbxv2`. Un fichier par **code personnage XV2** à 3 lettres (`GOK`, `VGT`, `FRZ`…).

## Contenu

- `<CODE>.png` — 145 portraits (costume de base par perso).
- `xv2-portraits.json` — manifest : `code → {name, portrait, base_costume, costumes[]}`.
- `_QA.png` — planche-contact des 30 mappings actifs (vérification visuelle).

## Usage dans le bot

La colonne `db_characters.portrait_xv2` pointe vers `./assets/dbz/xv2-portraits/<CODE>.png`.
`/wiki` (`Wiki.ts` → `charEmbed`/`transformationEmbed`) l'affiche **en priorité**, avec
fallback sur `db_characters.image` (artwork générique) si null.

Seed : `bun db:seed-xv2-portraits` (mapping curé dans `src/db/seed-xv2-portraits.ts`).

## Étendre la couverture

30 des 58 persos shenron sont mappés (mapping conservateur : identité certaine
uniquement, pour ne jamais afficher le mauvais portrait). Pour en ajouter :

1. Trouver le code XV2 du perso (voir `xv2-portraits.json` ; codes communautaires).
2. Ajouter `id_db_characters: "CODE"` dans `PORTRAIT_MAP` de `src/db/seed-xv2-portraits.ts`.
3. `bun db:seed-xv2-portraits` puis re-générer `_QA.png` pour vérifier.

Les ~28 persos non mappés sont surtout absents du roster XV2 (Kaïo, Kibito, Babidi,
Zeno, Marcarita…) ou d'identité de code incertaine.

## Régénérer depuis le jeu

Côté toolkit `dbxv2` (jeu possédé légalement) : `_bridge_portraits.py` ré-extrait
les portraits + manifest depuis `output/cpk/data1/.../CHARA01.emb.unpacked/`.
**Ne pas redistribuer les assets du jeu hors de ce dépôt privé.**
