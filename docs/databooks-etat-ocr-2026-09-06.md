# État OCR des databooks

## Mesure

- Date de mesure : 2026-09-06
- Source : PostgreSQL `shenron_site`, schéma `bot`, table `db_databooks`
- Méthode : comptage de `pages[].text` non vide, sans modifier la base
- Tunnel utilisé : `127.0.0.1:5432` vers PostgreSQL réel de `dbfr`

| Indicateur | Valeur |
|---|---:|
| Fiches | 370 |
| Planches | 14 233 |
| Planches transcrites | 11 504 |
| Planches non transcrites | 2 729 |
| Taux de transcription | 80,83 % |

## Lots incomplets

Chaque ligne indique le nombre total de planches, le nombre transcrit et le reste à traiter.

| ID | Ouvrage | Catégorie | Total | Transcrites | Reste |
|---:|---|---|---:|---:|---:|
| 1 | Dragon Ball Daizenshuu 1 — Complete Illustrations | Art Book | 233 | 5 | 228 |
| 5 | Dragon Ball Landmark | Databook | 75 | 0 | 75 |
| 22 | Dragon Ball Forever | Databook | 80 | 0 | 80 |
| 28 | Dragon Ball Illustration Book - Akira Toriyama | Art Book | 200 | 133 | 67 |
| 29 | Dragon Ball Anime Illustration Collection: The Golden Warrior | Art Book | 99 | 17 | 82 |
| 33 | Jump Anime Library 1: Dragon Ball Z Movie 12 | Jump Anime Comics | 70 | 66 | 4 |
| 34 | Jump Gold Selection 5: Dragon Ball Z Anime Special Vol. 2 | Weekly Shonen Jump | 127 | 0 | 127 |
| 35 | Jump Gold Selection 4: Dragon Ball Z Anime Special | Weekly Shonen Jump | 124 | 0 | 124 |
| 36 | Dragon Ball: Adventure Special | Weekly Shonen Jump | 140 | 0 | 140 |
| 37 | Akira Toriyama: The World of Dragon Ball 2013 Exhibit Display | Pamphlet & Fair | 9 | 6 | 3 |
| 126 | V Jump Décembre 1995 | V-Jump | 38 | 0 | 38 |
| 312 | DBZ TV Special 1 : Bardock (Le Père de Goku) | Jump Anime Comics | 163 | 118 | 45 |
| 326 | Saikyō Jump Octobre 2013 | Saikyō Jump | 9 | 1 | 8 |
| 327 | Saikyō Jump Septembre 2013 | Saikyō Jump | 7 | 0 | 7 |
| 328 | Saikyō Jump Janvier 2014 | Saikyō Jump | 29 | 0 | 29 |
| 329 | Saikyō Jump Février 2014 | Saikyō Jump | 28 | 0 | 28 |
| 330 | Saikyō Jump Mars 2014 | Saikyō Jump | 26 | 0 | 26 |
| 331 | Saikyō Jump Avril 2014 | Saikyō Jump | 26 | 0 | 26 |
| 332 | Saikyō Jump Mai 2014 | Saikyō Jump | 31 | 0 | 31 |
| 333 | Saikyō Jump Juin 2014 | Saikyō Jump | 31 | 0 | 31 |
| 334 | Saikyō Jump Juillet 2014 | Saikyō Jump | 29 | 0 | 29 |
| 335 | Saikyō Jump Août 2014 | Saikyō Jump | 25 | 0 | 25 |
| 336 | Saikyō Jump Novembre 2014 | Saikyō Jump | 18 | 0 | 18 |
| 337 | Saikyō Jump Septembre 2014 | Saikyō Jump | 32 | 0 | 32 |
| 338 | Saikyō Jump Janvier 2015 | Saikyō Jump | 18 | 0 | 18 |
| 339 | Saikyō Jump Juillet 2015 | Saikyō Jump | 33 | 0 | 33 |
| 340 | Saikyō Jump Mai 2015 | Saikyō Jump | 29 | 0 | 29 |
| 341 | Saikyō Jump Mars 2015 | Saikyō Jump | 25 | 0 | 25 |
| 342 | Saikyō Jump Novembre 2015 | Saikyō Jump | 37 | 0 | 37 |
| 343 | Saikyō Jump Septembre 2015 | Saikyō Jump | 21 | 0 | 21 |
| 344 | Saikyō Jump Janvier 2016 | Saikyō Jump | 45 | 0 | 45 |
| 345 | Saikyō Jump Mars 2016 | Saikyō Jump | 40 | 28 | 12 |
| 346 | Saikyō Jump Mai 2016 | Saikyō Jump | 29 | 2 | 27 |
| 347 | Saikyō Jump Juillet 2016 | Saikyō Jump | 23 | 0 | 23 |
| 348 | Saikyō Jump Septembre 2016 | Saikyō Jump | 21 | 0 | 21 |
| 349 | Saikyō Jump Novembre 2016 | Saikyō Jump | 25 | 0 | 25 |
| 350 | Saikyō Jump Janvier 2017 | Saikyō Jump | 24 | 0 | 24 |
| 351 | Saikyō Jump Mars 2017 | Saikyō Jump | 23 | 0 | 23 |
| 352 | Saikyō Jump Mai 2017 | Saikyō Jump | 40 | 0 | 40 |
| 353 | Saikyō Jump Juillet 2017 | Saikyō Jump | 27 | 0 | 27 |
| 354 | Saikyō Jump Septembre 2017 | Saikyō Jump | 25 | 0 | 25 |
| 355 | Saikyō Jump Novembre 2017 | Saikyō Jump | 28 | 0 | 28 |
| 356 | Saikyō Jump Janvier 2018 | Saikyō Jump | 43 | 0 | 43 |
| 357 | Saikyō Jump Mars 2018 | Saikyō Jump | 33 | 0 | 33 |
| 358 | Saikyō Jump Mai 2018 | Saikyō Jump | 39 | 0 | 39 |
| 359 | Saikyō Jump Juillet 2018 | Saikyō Jump | 29 | 0 | 29 |
| 360 | Saikyō Jump Septembre 2018 | Saikyō Jump | 36 | 0 | 36 |
| 361 | Saikyō Jump Novembre 2018 | Saikyō Jump | 57 | 0 | 57 |
| 362 | Saikyō Jump Septembre 2023 | Saikyō Jump | 81 | 11 | 70 |
| 363 | Saikyō Jump Juin 2022 | Saikyō Jump | 73 | 19 | 54 |
| 364 | Saikyō Jump Septembre 2021 | Saikyō Jump | 69 | 0 | 69 |
| 365 | Saikyō Jump Janvier 2019 | Saikyō Jump | 58 | 0 | 58 |
| 366 | Saikyō Jump Mars 2019 | Saikyō Jump | 55 | 0 | 55 |
| 367 | Saikyō Jump Mai 2019 | Saikyō Jump | 59 | 0 | 59 |
| 368 | Saikyō Jump Juillet 2019 | Saikyō Jump | 59 | 0 | 59 |
| 369 | Saikyō Jump Septembre 2019 | Saikyō Jump | 59 | 0 | 59 |
| 370 | Saikyō Jump Novembre 2019 | Saikyō Jump | 49 | 30 | 19 |
| 371 | Saikyō Jump Janvier 2020 | Saikyō Jump | 53 | 0 | 53 |
| 372 | Saikyō Jump Mars 2020 | Saikyō Jump | 57 | 0 | 57 |
| 373 | Saikyō Jump Mai 2020 | Saikyō Jump | 50 | 0 | 50 |
| 374 | Saikyō Jump Juillet 2020 | Saikyō Jump | 44 | 0 | 44 |

## GPU local

- GPU : NVIDIA GeForce RTX 4070
- VRAM : 12 282 MiB
- Driver : 610.88
- Utilisation au contrôle : 3 %
- RAM système : 32 GB
- CPU : Intel Core i7-13700F
- État Windows : optimisé selon WinClean

Le GPU est disponible et non saturé au moment de la mesure. Cette vérification ne constitue pas une preuve d’inférence OCR GPU active.

## Aphrody OCR

- Binaire : `C:\Users\aphro\.cargo\bin\aphrody.exe`
- Version : `1.0.0-canary`
- Feature OCR : présente (`Built only with --features ocr`)
- Commandes disponibles : `page`, `ppocr`, `audit`, `clean`, `batch`, `databooks`
- La commande `databooks` est le preset sûr pour les lots Shenron.
- Aucun lot n’a été lancé pendant cette vérification.

Contrôle recommandé avant dépôt : exporter un lot de 1 à 4 planches, lancer `aphrody ocr databooks`, puis `bun scripts/databooks.ts verifie <resultats.jsonl>`. Le dépôt doit rester séparé et explicite.
