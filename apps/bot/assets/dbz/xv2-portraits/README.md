# Données Dragon Ball Xenoverse 2

Assets et données extraits du jeu **Dragon Ball Xenoverse 2** (v1.25.02, FR) via le
toolkit `dbxv2`, pour enrichir le wiki/économie de Shenron.

## Contenu

- `<CODE>.png` — 145 portraits de visages (atlas UI `CHARA01.emb`), 1 par code perso XV2 3 lettres.
- `xv2-portraits.json` — manifest brut des portraits (code → costume de base).
- `../xv2-catalog.json` — **source de vérité** : noms FR exacts du jeu (`.msg`) :
  - `characters` : 169 codes → noms (Son Goku, Krilin, Bulma…).
  - `skills` : 4 catégories — `super`, `ultimate`, `awoken`, `evasive` (~730 noms uniques) + descriptions.
- `_QA.png` — planche-contact des portraits posés (vérification visuelle).

## Seeds (catalogue-driven)

Tout est piloté par `xv2-catalog.json` (noms factuels du jeu = vérité), **pas** par un
mapping en dur (qui s'était révélé erroné : `G13`="Bulma" et non Android 13, `BUU`="Fu"
et non Majin Buu). L'appariement se fait par **nom normalisé + synonymes**.

| Script | Effet |
|--------|-------|
| `bun db:seed-xv2-portraits` | Pose `db_characters.portrait_xv2` sur les persos existants appariés par nom (32/58). |
| `bun db:seed-xv2-characters` | Ajoute les persos XV2 absents qui ont un portrait (forme de base, hors transfos/NPC/grands singes). |
| `bun db:seed-xv2-techniques` | Importe les compétences XV2 absentes dans `db_techniques` (type = catégorie XV2). |

Tous additifs/idempotents (dédup par nom canonique, `onConflictDoNothing`).

## Couverture obtenue

- **db_characters : 58 → 103** persos (77 avec portrait XV2).
- **db_techniques : 120 → 825** (super 428, ultime 211, esquive 50, awoken 16 ajoutées).

`/wiki` (`Wiki.ts`) affiche `portrait_xv2` en priorité, fallback `image`.

## Régénérer depuis le jeu

Côté toolkit `dbxv2` (jeu possédé légalement) :
- `_bridge_portraits.py` → ré-extrait les portraits + manifest depuis `CHARA01.emb.unpacked`.
- `_xv2_catalog.py` → ré-extrait `xv2-catalog.json` (parser `.msg` maison : clés + valeurs FR).

**Ne pas redistribuer les assets du jeu hors de ce dépôt privé.**
