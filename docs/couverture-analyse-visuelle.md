# La couverture de tankōbon comme source de vérité du design

Toutes les valeurs de ce document sont **relevées** sur des images, jamais
choisies. Chaque décision de la charte renvoie à la ligne de mesure qui la
justifie ; contester une décision, c'est contester un nombre, pas un goût.

## Sources et ce qu'elles valent

| Source | Ce qu'elle tranche | Réserve |
|---|---|---|
| `bot.dragonballfr.com/assets/ext/db_manga_volumes/124.jpg` — 764 × 1200 | **la référence**, désignée telle quelle : palette, typographie du titre, structure de page | JPEG à 227 Ko : les frontières d'aplats portent un liseré de compression de 2 à 3 px, les valeurs sont prises au cœur des aplats, jamais au bord |
| Volumes 125, 126, 127 du même catalogue | contrôle de stabilité de la palette du titre d'un tome à l'autre | ne servent qu'à confirmer, aucune valeur n'en est retenue |
| `fr.dragon-ball-official.com` | l'ancienne calibration des tokens du site (`#ffb200`, `#ff0000`) | **écartée** comme référence primaire : c'est une charte de site marchand, pas l'impression du support |

Les images de travail restent dans `/tmp/couverture-124/` ; ce dépôt ne stocke
que les nombres.

## Ce qui est mesuré

### Structure de page

| Grandeur | Mesure | En proportion |
|---|---|---|
| Page | 764 × 1200 px | ratio **1,571** — identique sur les tomes 125 à 127 |
| Cadre de l'illustration | x 38 → 716, y 355 → 1036 | largeur **88,7 %** de la page |
| Épaisseur du liseré du cadre | 12 px | **1,77 %** de la largeur du cadre |
| Marge latérale | 38 px | **5,0 %** de la largeur |
| Bandeau du titre | y 120 → 216 | **8,0 %** de la hauteur, au-dessus de l'image |

### Trait d'encre

Mesuré par `scripts/mesurer.py --sombre` sur l'illustration seule (654 px de
large) : **4,0 px de médiane, soit 0,61 % de la largeur du sujet**.

C'est la mesure qui confirme le `border: 2px` des cases du site : sur une carte
de 320 px, 0,61 % donne 1,95 px. Le trait n'a pas à grossir avec la carte tant
qu'on reste dans cet ordre de grandeur.

### Palette (k-means par zone, 3 px d'échantillonnage)

| Rôle | Mesure | Part de sa zone | Où |
|---|---|---|---|
| Jaune du titre | `#FEFD03` | 23,7 % du bandeau | « DRAGON », aplat sans dégradé |
| Rouge du titre | `#DE0B36` | 11,1 % du bandeau | « BALL » |
| Orange du gi | `#E78220` | 27,4 % | tenue de Goku |
| Vert de Shenron | `#2E9B41` | 29,4 % | corps du dragon |
| Bleu de la case | `#3F5AA7` | 10,3 % de l'illustration | ciel derrière les personnages |
| Peau | `#F7DBAD` | 15,0 % | visage et bras |
| Jaune pâle des nuages | `#F2DBA1` | 21,8 % du fond de case | volutes du décor |
| Encre | `#131B08` | 12,6 % de l'illustration | contours ; ombre profonde à `#0A0507` |
| Lumière | `#DFDFCE` | — | ton du 9ᵉ décile de luminance |
| Papier | `#FEFDFD` | 70,6 % de la marge | blanc du support |

Deux lectures indépendantes concordent sur le titre : l'échantillonnage direct
donne `#FEFD03` / `#E6002E`, le k-means du bandeau `#FAF515` / `#DC052D`. Sur
les tomes 125 à 127, le jaune reste dans `#FAE50F`–`#FAF118` et le rouge dans
`#DC0A16`–`#E9060F`. **La teinte est la signature, l'écart est du scan.**

### Typographie du titre

| Grandeur | Mesure | Comment |
|---|---|---|
| Hauteur de capitale | 152 px | **20 %** de la largeur de page |
| Inclinaison | **12,3°** | bord gauche du D : x = 28 à y = 80, x = 58 à y = 218 |
| Fût vertical | 32 à 45 px | **ratio 0,30** de la capitale, quand une Black du commerce plafonne à 0,20 |
| Couleurs | deux aplats | jamais un dégradé, jamais une seule couleur |
| Cerne | noir pur | posé sous le remplissage, pas par-dessus |

## Décisions du site → mesure d'origine

| Décision | Mesure qui la fonde |
|---|---|
| `--color-logo-jaune: #fefd03`, `--color-logo-rouge: #de0b36` | palette du bandeau, confirmée sur 4 tomes |
| Titre de l'accueil bicolore, jaune puis rouge | deux aplats mesurés dans le bandeau, jamais un dégradé |
| `skewX(-12.3deg)` sur les titres | inclinaison du bord gauche du D |
| `font-weight: 1000` + `scaleX(.93)` | ratio fût/capitale de 0,30, inatteignable autrement avec Google Sans Flex, qui n'a pas d'axe de largeur |
| `h1` porté à 9,2 vw | capitale à 20 % de la largeur de page ; le titre était à 5,9 % |
| Double cerne noir puis os | cerne noir mesuré ; le cerne clair n'existe pas sur le papier et compense le fond sombre du site |
| `--dbz-orange: #e78220` (était `#ffb200`) | orange du gi, 27,4 % de sa zone. L'ancien doré venait du site officiel, pas du support |
| `--dbz-red: #f10c3b` (était `#ff0000`) | rouge du titre `#de0b36`, **teinte conservée (347,8°) et luminance relevée de 4 %** : le token porte 53 usages dont des messages d'erreur en petit texte, et l'aplat mesuré tombe à 3,97:1. L'aplat exact reste disponible en `--color-logo-rouge` |
| `--dbz-green: #2e9b41` (était `#16a34a`) | corps de Shenron |
| `--dbz-gold: #fefd03` (était `#ffea00`) | jaune du titre |
| `--dbz-encre: #131b08` (était `#12110d`) | encre des contours ; l'écart tient au vert de l'illustration, il est conservé tel quel |
| `border: 2px` des cases, conservé | 0,61 % de la largeur du sujet = 1,95 px sur une carte de 320 px |
| Ratio 3/2 des vignettes de tome, conservé | 1,571 mesuré, constant sur quatre tomes |

## Le piège : les défauts CSS ne décidaient plus rien

Recalibrer les tokens de `globals.css` n'aurait **rien changé au site**. Une
ligne dormait dans `public."SiteTheme"` depuis le 27 août 2026 et surchargeait
`--dbz-*` au runtime, sur chaque page :

```json
{"orange": "#2e7eff", "orangeDark": "#3017ee", "yellow": "#ffc800", "red": "#ff4d4f"}
```

L'accent réellement servi par `dragonballfr.com` n'était donc ni le doré des
défauts ni l'orange du support : c'était un **bleu** `#2e7eff`. Les défauts du
fichier CSS sont un filet, pas la vérité — la vérité est en base. La ligne a été
repointée sur la palette mesurée (`orange #e78220`, `yellow #fefd03`,
`red #f10c3b`, `orangeDark #c46f1b`), `ember`, `ki` et `amber` conservés : ce
sont des couleurs d'effet, elles ne prétendent pas venir du support.

Corollaire pour toute reprise du design : **lire la ligne `SiteTheme` avant de
conclure quoi que ce soit d'une valeur trouvée dans `globals.css`.**

## Ce qui n'est PAS repris de la couverture, et pourquoi

- **Le fond blanc.** Le site est sombre par charte ; transposer le papier
  reviendrait à refaire le site, pas à le calibrer. `--color-os` (`#efe9d8`)
  reste le papier vu en négatif, entre le papier mesuré (`#FEFDFD`) et la
  lumière du dessin (`#DFDFCE`).
- **Le bleu de case comme surface.** `#3F5AA7` est un aplat d'illustration : en
  fond de page il écraserait le texte. Il reste disponible en accent
  (`--color-case-ciel`), il ne devient pas `--dbz-blue`.
- **Le liseré jaune du cadre à 1,77 %.** Sur une carte de 320 px, cela ferait
  5,7 px de bordure — un cadre de couverture n'est pas un trait de case. C'est
  le trait d'encre mesuré (0,61 %) qui pilote les bordures.

## Contrôles

- Planche de contrôle palette contre couverture : `/tmp/couverture-124/controle-palette.png`,
  regardée côte à côte. Vert de dragon, orange de gi, bleu de ciel et duo
  jaune/rouge du titre concordent avec la source.
- Contraste calculé sur le fond `#0a0a0a` (WCAG 2.1) :

  | Couleur | Ratio | Verdict |
  |---|---|---|
  | `#fefd03` jaune du titre | 18,16:1 | partout |
  | `#e78220` orange du gi | 7,18:1 | partout — l'ancien `#ffb200` était à 10,96:1, on perd de la marge sans passer sous AA |
  | `#2e9b41` vert de Shenron | 5,54:1 | partout — l'ancien `#16a34a` était à 6,01:1 |
  | `#de0b36` rouge du titre | 3,97:1 | **texte large (≥ 24 px) et aplats seulement** ; l'ancien `#ff0000` était déjà limite à 4,95:1 |
  | `#3f5aa7` bleu de case | 3,05:1 | aplat de décor, jamais du texte |
