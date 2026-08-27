# Weekly Character Showcase — illustrations officielles

**2 517 images, 327 Mo** moissonnées le 2026-08-27 sur le site officiel Dragon Ball
via l'API CMS du site (`cmsapi-frontend.dragon-ball-official.com`) : les
**266 chroniques « Weekly ☆ Character Showcase »**, une par personnage, avec
leur artwork couleur de Toriyama, leur illustration de référence et leurs
extraits (planches manga pour l'ère Toriyama, images d'épisode pour Super).
`manifest.json` porte, pour chaque image, son URL source, son rôle et
l'appariement proposé avec `db_characters` quand il est sûr (95 fiches). C'est exactement le registre relevé dans `DESIGN.md` (« Ce que montre
une illustration de Toriyama ») : aplats, contour d'épaisseur variable, aucun
décor.

**Elles ne sont rattachées à aucune fiche.** Mesuré au moment du dépôt : les
1 307 personnages visibles ont **déjà** une image, et 60 tirées au sort
répondent toutes 200 en HTTP — il n'y avait donc aucun trou à combler. Écraser
en masse des images existantes par un lot moissonné serait une régression
silencieuse sur les fiches déjà correctes.

Elles servent de **réserve** : quand une fiche porte une capture d'écran de jeu
ou un scan médiocre, on remplace à la main depuis le studio
(`/admin` → la fiche → champ image), et on prend celle d'ici.

**Limite de résolution, à connaître avant de s'en servir** : ces images
plafonnent à 770 px et font typiquement 518 px. Leur valeur est la légitimité
de la source, pas la définition — elles ne remplacent pas un scan haute
définition.

**Appariement non automatisable pour les transformations** : le lot propose un
Gogeta *Super Saiyan 4* là où la fiche dit « Gogeta SSJ ». Illustrer une
transformation par la mauvaise est une erreur factuelle, pas un détail
esthétique. Le rattachement se fait à la main, en regardant l'image.

Attribution : © Bird Studio / Shueisha / Toei Animation. Usage éditorial,
comme le reste des assets servis par `/db/*`.
