---
name: toriyama-svg
description: >-
  Dessiner des SVG originaux dans le style Toriyama — nets à toutes les tailles
  et fidèles au manga parce qu'ils sont MESURÉS sur les planches, jamais
  décalqués ni dessinés de mémoire. Déclenche-la dès qu'il faut produire une
  image vectorielle liée à Dragon Ball : un personnage (Goku, Vegeta, Shenron,
  Freezer…), un objet (Kinto-Un, boule de cristal, Radar, capsule, Dragon Ball),
  un logo ou un wordmark, une icône, un jeu de favicons pour toutes les
  plateformes, une illustration de fiche, un fond, un sprite, une animation de
  technique (Kaméhaméha, Genkidama, aura, téléportation), ou un modèle 3D
  dérivé du dessin quand un MCP Blender est branché. Déclenche-la AUSSI quand la
  demande dit seulement « fais-moi un joli X en SVG », « refais le logo », « une
  icône pour le site », « anime ça » dans un contexte Dragon Ball, ou quand un
  asset existant doit être refait, vérifié ou décliné : le réflexe par défaut,
  qui est de composer des courbes de Bézier au jugé d'après le souvenir d'un
  personnage, produit un dessin « presque juste » — mauvaises proportions,
  couleurs délavées, trait absent — et c'est précisément ce que ce cycle de
  travail corrige. NE PAS déclencher pour du dessin vectoriel sans rapport avec
  Dragon Ball, pour retoucher une photo, pour convertir une image en SVG par
  vectorisation automatique, ni pour de l'illustration générée par un modèle
  d'image.
---

# Dessiner à la Toriyama, en vectoriel et en mesuré

Le mot « pixel perfect » mérite d'être défini avant de commencer, parce qu'il
cache deux choses très différentes.

Ce qu'il ne peut pas vouloir dire : reproduire une planche au pixel près. Ce
serait du décalque, donc une copie de l'œuvre de quelqu'un, et le résultat serait
inutilisable comme asset propre.

Ce qu'il veut dire ici, et qui est atteignable : **un dessin dont chaque
décision est un nombre relevé sur la source** — proportions, palette, épaisseur
du trait en pourcentage de la largeur, rythme des lobes — et **qui rend net à
toutes les tailles**, de 1200 px à 16 px, parce qu'on l'a regardé à chacune. Un
lecteur qui compare le dessin à la planche doit reconnaître la même main, sans
qu'aucun tracé ne soit repris.

La différence se joue presque entièrement avant le premier trait. Un dessin
fondé sur le souvenir a l'air « presque juste », ce qui est pire qu'un dessin
franchement différent : on ne sait pas quoi corriger. Un dessin fondé sur des
mesures se corrige en changeant un nombre.

## Le cycle

Six temps. Ils ne sont pas décoratifs : chacun a rattrapé une erreur réelle sur
le travail qui a servi de modèle à ce skill.

### 1. Sourcer

Trouver les images de référence, et les hiérarchiser. Le manga au trait tranche
la FORME, le manga en couleur tranche la COULEUR, l'anime ne tranche ni l'un ni
l'autre mais dépanne. Lire `references/sources.md` pour le corpus local
(planches hébergées, databooks, MCP `dragonball`), la façon de contourner les
403, et pourquoi Fandom est banni.

Travailler dans `/tmp/<sujet>/`. Les références sont du matériel de travail, pas
des livrables.

### 2. Mesurer

```bash
python3 scripts/mesurer.py /tmp/goku/planche.webp --teinte 20 45 --sat 0.3 --k 5
python3 scripts/mesurer.py /tmp/goku/planche.webp --sombre    # épaisseur du trait
```

Le script isole la forme (masque teinte/saturation/valeur, plus grande
composante connexe, trous rebouchés par remplissage depuis le bord), puis sort
la boîte, le ratio, le taux de remplissage, une palette k-means en HEX/RGB/HSL/
OKLCH, les tons par déciles de luminance, le rythme des creux du bord inférieur,
et — en mode `--sombre` — l'épaisseur médiane du trait en pourcentage de la
largeur du sujet. Il écrit aussi le masque et la découpe, **qu'il faut regarder**
pour vérifier que la segmentation n'a pas mangé un bras.

**Ne pas passer à l'étape suivante tant que `mesures.json` n'existe pas.** Ce
n'est pas une formalité : à l'essai, un dessin de Shenron produit sans cette
étape est sorti **turquoise à moustaches roses**, avec un dossier de mesures
vide et un générateur qui avait l'air sérieux. Un script de géométrie bien
commenté donne toutes les apparences du travail mesuré sans en avoir fait la
moitié. La preuve, c'est le fichier de mesures, pas la qualité du code.

Il ne dépend que de Pillow et numpy (`sudo apt-get install -y python3-pil
python3-numpy` ; beaucoup de VPS n'ont ni `pip` ni `ensurepip`, et la création
d'un environnement virtuel y échoue).

Quelques mesures qui reviennent, relevées sur des planches réelles et qui
donnent une idée de ce qu'on cherche :

- le trait d'encre de contour tient entre **0,7 % et 0,9 % de la largeur du
  sujet** — c'est une proportion, pas un nombre de pixels, et c'est ce qui la
  rend transposable à n'importe quel viewBox ;
- les aplats sont **francs, sans dégradé** : deux tons, une frontière nette en
  trois pixels ;
- en passant à l'ombre, le manga **garde la saturation** et fait tourner la
  teinte, alors que l'anime désature à teinte constante. C'est ce détail qui
  fait qu'une ombre copiée sur un cel paraît kaki là où le manga reste doré.

**Contrôle de vraisemblance.** Une mesure n'est pas une vérité, c'est une
lecture. Avant de la retenir, la confronter à ce que le sujet est censé être :
Shenron est vert, le Kinto-Un est jaune, Piccolo est vert et rouge. Si le nombre
dit autre chose, ce n'est presque jamais une découverte — c'est une planche
teintée par le scan, une scène de nuit, une page jaunie, ou un masque qui a
attrapé le décor. Refaire la mesure sur une deuxième planche : deux sources
concordantes tranchent, une seule ne tranche rien. Et si l'écart persiste, le
dire dans le document au lieu de le peindre.

### 3. Consigner

Écrire un document de mesures dans `docs/<sujet>-analyse-visuelle.md` : les
sources et **ce que chacune vaut** (y compris celles qu'on écarte, avec la
raison), les nombres, et un tableau « décision → mesure d'origine ». Ce tableau
est le cœur du document : il permet à la revue suivante de contester une
décision sans refaire les mesures.

Note pour ce dépôt : les `*.md` à la racine sont limités à une liste fixe, tout
le reste va dans `docs/`.

### 4. Dessiner en géométrie

Le geste à reproduire n'est pas « poser une courbe » mais **poser les creux,
puis bomber entre eux**. Une silhouette de manga est une suite d'arcs tendus
entre des points de rupture. Construite ainsi, elle reste modifiable : on
déplace un creux, on change une flèche, la forme suit — alors qu'un chemin de
Bézier écrit à la main est figé dès qu'il est posé.

`scripts/geometrie.ts` fournit les primitives, à copier dans le projet et à
étendre :

| Primitive | Ce qu'elle sert à dessiner |
|---|---|
| `arcs(points, fleches)` | toute silhouette : nuages, chevelures, explosions, corps. Une flèche supérieure à la moitié de la corde donne le lobe pincé |
| `volute(depart, vers, r)` | la spirale rentrante qui termine les lobes de nuage et les tourbillons de poussière |
| `meche(base, pointe, largeur)` | un cheveu : forme pleine large à la racine et effilée, jamais un trait d'épaisseur constante |
| `planDombre(contour, decalage)` | l'ombre comme **le même contour décalé puis découpé par la silhouette** — elle épouse alors exactement les lobes au lieu de flotter à côté |
| `trait(largeur, pct)` | l'épaisseur d'encre exprimée en pourcentage |
| `miroir(points, axe)` | un visage se dessine sur une moitié |

Le code va dans une **bibliothèque de géométrie** (`src/lib/<sujet>.ts`) que
consomment un script générateur, le composant d'interface et le script
d'icônes. Une seule source : sinon l'icône et l'illustration divergent au
premier ajustement, et c'est invisible jusqu'à ce que quelqu'un les voie côte à
côte.

Pour un personnage plutôt qu'un objet, la même méthode tient, mais il faut
mesurer plus : hauteur totale en têtes, largeur des épaules en têtes, hauteur de
l'œil dans le visage, écart entre les yeux, nombre et orientation des mèches,
largeur du trait de bouche. Ces rapports se relèvent sur la planche avec le
mode `--boite` du script de mesure, appliqué successivement à la tête, au torse,
à une mèche. Un personnage dont on n'a pas mesuré la tête finit avec un crâne
d'adulte sur un corps d'enfant.

### 5. Regarder

```bash
bun scripts/rendu.ts dessin.svg --tailles 512 128 64 32 16 --compare /tmp/goku/planche.webp
```

Le script rend chaque taille nativement, l'agrandit au plus proche voisin (on
voit les pixels réels, pas une interpolation qui flatte), et monte une planche
sur fond clair et une sur fond sombre, plus une comparaison côte à côte à
hauteur égale avec la référence.

Le drapeau `--compare` n'est pas optionnel dans les faits : une planche seule
montre si le dessin est net, elle ne montre pas s'il ressemble au sujet. C'est
la vue côte à côte qui fait apparaître qu'une tête est trop longue ou qu'une
couleur a dérivé.

**Puis ouvrir ces planches avec l'outil de lecture d'image.** C'est la seule
étape non négociable du cycle : un SVG qui semble juste dans le code peut avoir
une ombre qui flotte, un trait qui disparaît à 64 px, ou une silhouette qui ne
ressemble plus à rien une fois réduite. Aucune relecture de code ne remplace le
fait de regarder.

Trois vérifications qui ont chacune rattrapé un défaut réel :

- **le ratio d'encre, pas celui du viewBox.** Un viewBox annonçait 1,85 alors
  que le dessin, une fois l'alpha rogné, mesurait 2,29 — 24 % de vide vertical.
  Comparer au ratio mesuré sur la source ;
- **le fond clair.** Un jaune sur un onglet blanc donne un contraste de 1,22:1,
  c'est-à-dire rien. C'est ce qui impose une pastille sombre pour les icônes ;
- **la petite taille.** Sous 96 px, une illustration large devient une lentille
  sans détail. Ce n'est pas un défaut de rendu, c'est le signe qu'il faut une
  variante carrée dessinée à part.

### 6. Décliner

Une illustration ne fait pas une icône. La variante carrée se dessine
séparément : silhouette simplifiée (cinq gros lobes plutôt que quatorze), trait
épaissi à 2–3 % de la largeur, détails supprimés sous 64 px où ils deviennent du
bruit, pastille de fond pour le contraste.

```bash
bun scripts/icones.ts icone.svg --sortie apps/site/public --sortie apps/bot/public
```

Sort le jeu complet — vrai `favicon.ico` multi-tailles, PNG 16/32/48/96, icône
Apple opaque, 192/512 en `any`, une 512 `maskable` distincte, tuile Windows — et
rappelle les balises à câbler. Tout avec `sharp` seul : l'ICO est un conteneur
de PNG, quinze lignes suffisent, et aucune dépendance ajoutée ne casse un
déploiement. Le script explique pourquoi chaque bibliothèque du registre a été
écartée.

Trois pièges que ce script corrige et qu'on retrouve dans presque tous les
projets : un `favicon.ico` qui est en réalité un PNG renommé, une icône Apple
transparente (iOS la compose sur du noir), et une 512 déclarée `any maskable`
alors qu'un même fichier ne peut pas être les deux — Android rogne alors le
dessin d'un quart.

## Animation et 3D

- Mouvement (Kaméhaméha, aura, charge de ki, nuage qui file) :
  `references/animation.md` — le découpage en phases, SMIL contre CSS, les
  motifs utiles, et comment contrôler une animation sans navigateur.
- Volume (modèle 3D, figurine, impression) : `references/blender.md` — comment
  vérifier que Blender est réellement branché, comment préparer une variante
  « plan » du SVG extrudable, et quoi proposer quand le MCP est absent.

## Livrer

Le SVG et le document de mesures entrent dans le dépôt ; les images de
référence, les masques et les rendus de contrôle restent dans `/tmp`. Le script
générateur entre aussi : c'est lui qui rend l'asset reproductible, et sans lui
la prochaine retouche recommence à zéro.

Puis `bun run lint && bun run type-check`, un commit d'une ligne en français, et
le déploiement si l'asset est servi en production. Vérifier ensuite que les
fichiers sortent bien avec le bon type de contenu.

## Pièges mesurés

| Symptôme | Cause | Remède |
|---|---|---|
| L'ombre « flotte » à côté de la forme | ombre dessinée comme un tracé séparé | la faire découper par la silhouette (`planDombre`) |
| Ombre kaki, terne | palette relevée sur un cel d'anime | relever sur le manga couleur : la saturation y tient, c'est la teinte qui bouge |
| Le dessin paraît trop plat | ratio mesuré sur le viewBox et non sur l'encre | rogner l'alpha avant de mesurer |
| Illisible en favicon | downscale d'une illustration large | dessiner une variante carrée |
| Détails en bouillie sous 64 px | trop de motifs conservés | les couper en dessous d'un seuil |
| Silhouette trop régulière, mécanique | lobes de rayon constant | faire varier du simple au triple, comme sur les planches |
| Segmentation qui mange un morceau | trou intérieur (un personnage assis dans la forme) | remplissage depuis le bord, déjà fait par le script |
| `pip` introuvable sur le serveur | ni pip ni ensurepip | `apt-get install python3-pil python3-numpy` |
| Récupération d'image en 403 | filtrage sur l'agent utilisateur | `curl` avec un en-tête de navigateur |

## Trois garde-fous

Ils tiennent en une question chacune, à se poser avant de livrer.

1. **Le fichier de mesures existe-t-il ?** Sinon le dessin vient de la mémoire,
   quelle que soit l'allure du code qui l'a produit.
2. **La couleur retenue est-elle vraisemblable pour ce sujet ?** Un vert qui
   sort turquoise accuse la source, pas le sujet.
3. **Ai-je regardé le dessin à côté de sa référence ?** Pas seulement le dessin
   seul, et pas seulement en grand.

## Ce qu'on ne fait pas

Décalquer un tracé, vectoriser automatiquement une planche, dessiner de mémoire
sans mesurer, inventer une couleur « qui fait Dragon Ball », ou trancher en
silence une contradiction entre sources. Quand deux sources officielles se
contredisent — cela arrive, un databook peut montrer bleu ce que le manga
couleur donne jaune — le dire dans le document de mesures, retenir la source la
mieux placée dans la hiérarchie, et expliquer le choix.
