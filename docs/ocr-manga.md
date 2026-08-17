# OCR des planches → markdown

Objectif : transcrire le texte des planches manga (bulles + cartouches) en
**markdown** par tome — pour la lecture texte, l'accessibilité et l'indexation RAG.
Le manga self-hosté est majoritairement **français** (VF) ; cf.
[`docs/manga-scans.md`](manga-scans.md).

## Pourquoi pas Tesseract seul

Tesseract `fra` sur une planche extrait des fragments de bulles mais avec du **bruit
issu des dessins** et **sans ordre de lecture des cases** → markdown inutilisable tel
quel. Il faut une étape de **détection des bulles + ordre de lecture** en amont.

## Options évaluées (FR, CPU, à l'échelle)

| Approche                                                       | Layout / ordre  | Langue         | CPU          | Note                                                                                        |
| -------------------------------------------------------------- | --------------- | -------------- | ------------ | ------------------------------------------------------------------------------------------- |
| **comic-text-detector** → crop → **PaddleOCR/Tesseract `fra`** | oui (détecteur) | FR ✅          | oui          | Pipeline 2 étages, agnostique de la langue pour la détection. **Meilleur compromis local.** |
| **VLM vision** (dots.ocr OSS ; ou modèle vision cloud)         | oui (1 passe)   | multilingue ✅ | lent sur CPU | Meilleure qualité « layout+texte+markdown » en un coup. dots.ocr = OSS le plus proche.      |
| manga-ocr (kha-white)                                          | bulles          | **JP only ❌** | oui          | Inadapté au VF.                                                                             |
| PaddleOCR seul / docTR                                         | partiel         | FR ✅          | oui          | Recognition correcte, layout faible.                                                        |

## Recommandation

- **Qualité maximale** : un **VLM vision** lit la page holistiquement (ordre des cases,
  ignore les dessins, sort du markdown propre). Coûteux/lent à 12 700 planches.
- **Meilleur local gratuit** : pipeline **comic-text-detector** (boîtes bulles +
  ordre) → **PaddleOCR `fr`** (reconnaissance FR). Tourne sur le VPS CPU (lent mais
  faisable par lots).

Démarrer par la **VF Dragon Ball original (42 tomes)** ; un tome = un fichier
markdown `# Tome N` avec un bloc par case/bulle dans l'ordre de lecture.

## Pipeline cible

1. Pour chaque planche WebP : détection des zones de texte (comic-text-detector) →
   tri en ordre de lecture (haut→bas, droite→gauche par défaut manga, à confirmer
   sur la VF qui est souvent re-paginée gauche→droite).
2. Crop de chaque zone → reconnaissance FR (PaddleOCR `fr` / Tesseract `fra`).
3. Assemblage markdown par tome (`assets/manga/.../transcripts/tome-N.md`),
   réinjectable dans le corpus RAG (`docs[].markdown`).

## Statut

Plan validé, options recherchées. Implémentation à faire (script
`apps/bot/scripts/transcribe-manga.ts`) après installation du détecteur + PaddleOCR.
