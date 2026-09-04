/**
 * icones — jeu de glyphes maison, dessiné pour ce site.
 *
 * Chaque composant est un `Glyphe` figé sur une géométrie de `@/lib/icones`
 * (source unique). Ils remplacent, un pour un, les glyphes `lucide-react` les
 * plus employés de l'interface — même boîte de 24, mêmes props (`size`,
 * `className`, `strokeWidth`, `color`, `absoluteStrokeWidth`), donc un
 * remplacement se réduit à changer la ligne d'import et le nom.
 *
 * Correspondance avec ce qu'ils remplacent, et fréquence mesurée (nombre de
 * fichiers de `apps/site/src` qui importaient le glyphe lucide) :
 *
 * | maison           | lucide          | fichiers |
 * |------------------|-----------------|---------:|
 * | `Chargement`     | `Loader2`       | 35 |
 * | `Croix`          | `X`             | 28 |
 * | `Corbeille`      | `Trash2`        | 23 |
 * | `Plus`           | `Plus`          | 22 |
 * | `Enregistrer`    | `Save`          | 21 |
 * | `Alerte`         | `AlertTriangle` | 17 |
 * | `LienExterne`    | `ExternalLink`  | 17 |
 * | `Recherche`      | `Search`        | 17 |
 * | `ChevronBas`     | `ChevronDown`   | 16 |
 * | `Livre`          | `BookOpen`      | 15 |
 * | `Oeil`           | `Eye`           | 14 |
 * | `Coche`          | `Check`         | 12 |
 * | `ChevronDroite`  | `ChevronRight`  | 11 |
 * | `ChevronGauche`  | `ChevronLeft`   |  8 |
 * | `Etincelle`      | `Sparkles`      |  9 |
 * | `ChevronHaut`    | `ChevronUp`     |  6 |
 *
 * `Chargement` n'impose pas la rotation : comme avec `Loader2`, l'appelant
 * passe `className="animate-spin"`.
 */

import { Glyphe, type ProprietesIcone } from "./Glyphe";

export { Glyphe } from "./Glyphe";
export type { ProprietesIcone } from "./Glyphe";

export const Chargement = (p: ProprietesIcone) => <Glyphe nom="chargement" {...p} />;
export const Croix = (p: ProprietesIcone) => <Glyphe nom="croix" {...p} />;
export const Corbeille = (p: ProprietesIcone) => <Glyphe nom="corbeille" {...p} />;
export const Plus = (p: ProprietesIcone) => <Glyphe nom="plus" {...p} />;
export const Enregistrer = (p: ProprietesIcone) => <Glyphe nom="enregistrer" {...p} />;
export const Alerte = (p: ProprietesIcone) => <Glyphe nom="alerte" {...p} />;
export const LienExterne = (p: ProprietesIcone) => <Glyphe nom="lienExterne" {...p} />;
export const Recherche = (p: ProprietesIcone) => <Glyphe nom="recherche" {...p} />;
export const ChevronBas = (p: ProprietesIcone) => <Glyphe nom="chevronBas" {...p} />;
export const ChevronHaut = (p: ProprietesIcone) => <Glyphe nom="chevronHaut" {...p} />;
export const ChevronDroite = (p: ProprietesIcone) => <Glyphe nom="chevronDroite" {...p} />;
export const ChevronGauche = (p: ProprietesIcone) => <Glyphe nom="chevronGauche" {...p} />;
export const Livre = (p: ProprietesIcone) => <Glyphe nom="livre" {...p} />;
export const Oeil = (p: ProprietesIcone) => <Glyphe nom="oeil" {...p} />;
export const Coche = (p: ProprietesIcone) => <Glyphe nom="coche" {...p} />;
export const Etincelle = (p: ProprietesIcone) => <Glyphe nom="etincelle" {...p} />;
