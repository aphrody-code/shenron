/**
 * icones — source UNIQUE de la géométrie des glyphes maison du site.
 *
 * Pourquoi ce module existe : l'interface était habillée par 178 glyphes
 * `lucide-react` distincts, dont la forme (bouts arrondis, angles arrondis,
 * grille molle) est celle de n'importe quel tableau de bord. Ce jeu-ci reprend
 * la façon dont le support est encré, mesurée dans
 * `docs/couverture-analyse-visuelle.md` :
 *
 * 1. **Trait d'épaisseur constante.** Le trait d'encre du support fait 4,0 px
 *    de médiane sur une illustration de 654 px, soit **0,61 % de la largeur du
 *    sujet** ; le document en tire lui-même la transposition qui nous
 *    intéresse : sur une carte de 320 px cela donne 1,95 px, et « le trait n'a
 *    pas à grossir » au-delà. Sur la boîte de 24 unités, l'équivalent visuel de
 *    ce filet de 2 px est `TRAIT_ICONE = 2`. Jamais de trait qui s'affine :
 *    aucune géométrie d'ici n'utilise de variation d'épaisseur.
 * 2. **Angles vifs.** `stroke-linejoin: miter` et `stroke-linecap: butt` — le
 *    trait est coupé net, les coudes sont pointus. C'est la différence de forme
 *    la plus visible avec lucide (`round` / `round`), et elle se lit à 16 px.
 * 3. **Aplat sans dégradé.** Les parties pleines (`aplats`) sont peintes en
 *    `currentColor`, jamais en dégradé : le support ne connaît que l'aplat.
 * 4. **Silhouette coupée.** Les formes fermées sont octogonales ou en amande à
 *    pointes, pas circulaires : la loupe, l'œil et la disquette portent des
 *    coins tranchés plutôt que des rayons.
 *
 * Les coordonnées sont sur une boîte `0 0 24 24`, identique à lucide, pour que
 * le remplacement d'un glyphe soit un simple changement d'import — mêmes
 * dimensions rendues, même inertie optique, mêmes props (`size`, `className`,
 * `strokeWidth`).
 *
 * Rendu : `apps/site/src/components/icones/` (composants React). Contrôle
 * visuel : `apps/site/scripts/rend-icones.ts` (SVG → PNG à 16/24/32 px).
 */

/** Côté de la boîte de dessin, en unités SVG. Identique à lucide. */
export const BOITE_ICONE = 24;

/**
 * Épaisseur du trait d'encre, en unités de la boîte. Transposition du
 * `0,61 % de la largeur du sujet` mesuré sur la couverture (cf. en-tête).
 */
export const TRAIT_ICONE = 2;

/** Limite de pointe : au-delà, un coude très aigu serait tronqué en biseau. */
export const POINTE_ICONE = 10;

export type GeometrieIcone = {
	/** Nom lisible, utilisé par le script de contrôle et les tests. */
	readonly titre: string;
	/** Chemins encrés (`fill: none`, trait d'épaisseur constante). */
	readonly traits?: readonly string[];
	/** Chemins en aplat (`fill: currentColor`, aucun trait, aucun dégradé). */
	readonly aplats?: readonly string[];
};

/**
 * Géométrie de chaque glyphe. Clés en français, une entrée = un dessin ; les
 * quatre chevrons partagent la même construction (branche de 7 unités, coude
 * mitré au centre) déclinée sur les quatre orientations plutôt qu'une rotation
 * CSS, pour que chaque chemin reste lisible et mesurable tel quel.
 */
export const GEOMETRIES = {
	/**
	 * Arc de 270° coupé net aux deux bouts. Remplace `Loader2` : les appelants
	 * continuent de passer `className="animate-spin"`, la rotation n'est pas
	 * imposée ici. La goutte d'encre qui marquait la tête a été retirée après
	 * contrôle — à 16 px elle se soudait à l'arc et ne lisait plus que comme un
	 * empâtement.
	 */
	chargement: {
		titre: "Chargement",
		traits: ["M 12 3 A 9 9 0 1 1 3 12"],
	},

	/** Croix d'annulation : deux traits pleine boîte, bouts coupés net. */
	croix: {
		titre: "Fermer",
		traits: ["M 4.5 4.5 L 19.5 19.5", "M 19.5 4.5 L 4.5 19.5"],
	},

	/** Croix d'ajout : deux traits pleine boîte, bouts coupés net. */
	plus: {
		titre: "Ajouter",
		traits: ["M 12 3.5 L 12 20.5", "M 3.5 12 L 20.5 12"],
	},

	/** Coche à coude mitré : la pointe est franche, pas arrondie. */
	coche: {
		titre: "Valider",
		traits: ["M 3.5 12.5 L 9.5 18.5 L 20.5 5.5"],
	},

	/**
	 * Corbeille à cuve tronconique : les flancs fuient vers le fond, le
	 * couvercle et l'anse sont rectilignes. Deux fentes seulement — trois
	 * deviennent une bouillie à 16 px (mesuré au rendu PNG).
	 */
	corbeille: {
		titre: "Supprimer",
		traits: [
			"M 3 6 L 21 6",
			"M 9.5 6 L 9.5 3.5 L 14.5 3.5 L 14.5 6",
			"M 5.5 6 L 6.9 21 L 17.1 21 L 18.5 6",
			"M 9.8 10 L 9.8 17.5",
			"M 14.2 10 L 14.2 17.5",
		],
	},

	/**
	 * Disquette à coin coupé : le coin supérieur droit est biseauté (silhouette
	 * tranchée) et l'obturateur est un aplat. L'étiquette du bas a été RETIRÉE
	 * après contrôle : à 16 px ses deux montants venaient toucher le cadre et la
	 * silhouette s'empâtait en rectangle noir.
	 */
	enregistrer: {
		titre: "Enregistrer",
		traits: ["M 3.5 3.5 L 16.5 3.5 L 20.5 7.5 L 20.5 20.5 L 3.5 20.5 Z"],
		aplats: ["M 7.5 3.5 L 15.5 3.5 L 15.5 9.5 L 7.5 9.5 Z"],
	},

	/**
	 * Triangle d'alerte à trois pointes vives (lucide arrondit les siennes) ;
	 * la barre est un trait, le point un losange en aplat.
	 */
	alerte: {
		titre: "Alerte",
		traits: ["M 12 2.5 L 22 20.5 L 2 20.5 Z", "M 12 8.5 L 12 13.6"],
		aplats: ["M 12 16.2 L 13.6 17.8 L 12 19.4 L 10.4 17.8 Z"],
	},

	/**
	 * Lien externe : cadre ouvert sur son coin supérieur droit + hampe et
	 * pointe en aplat. La pointe pleine est la signature d'encrage — deux
	 * traits en chevron feraient une flèche de barre d'outils.
	 */
	lienExterne: {
		titre: "Ouvrir dans un nouvel onglet",
		traits: ["M 19.5 13 L 19.5 20.5 L 3.5 20.5 L 3.5 4.5 L 11 4.5", "M 12 12 L 18.5 5.5"],
		aplats: ["M 21.5 2.5 L 21.5 10 L 14 2.5 Z"],
	},

	/**
	 * Loupe à monture octogonale : les coins de la lentille sont tranchés, la
	 * poignée part à 45° et se termine coupée net.
	 */
	recherche: {
		titre: "Rechercher",
		traits: [
			"M 6.2 3.6 L 13.8 3.6 L 16.4 6.2 L 16.4 13.8 L 13.8 16.4 L 6.2 16.4 L 3.6 13.8 L 3.6 6.2 Z",
			"M 15.6 15.6 L 20.8 20.8",
		],
	},

	/**
	 * Chevrons : branche de 7 unités, coude mitré. Quatre orientations, même
	 * construction — c'est le glyphe le plus répandu de l'interface, donc celui
	 * où l'angle vif se remarque le plus.
	 */
	chevronBas: { titre: "Dérouler", traits: ["M 4.5 8.5 L 12 16 L 19.5 8.5"] },
	chevronHaut: { titre: "Replier", traits: ["M 4.5 15.5 L 12 8 L 19.5 15.5"] },
	chevronDroite: { titre: "Suivant", traits: ["M 8.5 4.5 L 16 12 L 8.5 19.5"] },
	chevronGauche: { titre: "Précédent", traits: ["M 15.5 4.5 L 8 12 L 15.5 19.5"] },

	/**
	 * Livre ouvert : deux pages en trapèze, dos vertical au centre. Tous les
	 * coins sont des sommets, aucun arrondi.
	 */
	livre: {
		titre: "Lire",
		traits: ["M 12 7.5 L 2.5 4.5 L 2.5 18.5 L 12 21.5 L 21.5 18.5 L 21.5 4.5 Z", "M 12 7.5 L 12 21.5"],
	},

	/**
	 * Œil en amande à pointes : les deux courbes se rejoignent en angle, comme
	 * un œil de planche, et la pupille est un aplat. Pas d'ellipse.
	 */
	oeil: {
		titre: "Afficher",
		traits: ["M 2 12 C 6.5 4.4 17.5 4.4 22 12 C 17.5 19.6 6.5 19.6 2 12 Z"],
		aplats: ["M 12 9.2 A 2.8 2.8 0 1 1 11.99 9.2 Z"],
	},

	/**
	 * Éclat de ki : quatre pointes concaves, la forme la plus reconnaissable du
	 * support. Un seul aplat, aucune bordure — il doit rester net à 16 px.
	 */
	etincelle: {
		titre: "Mise en avant",
		aplats: [
			"M 10.5 3.5 L 12.4 11.1 L 20 13 L 12.4 14.9 L 10.5 22.5 L 8.6 14.9 L 1 13 L 8.6 11.1 Z",
			"M 19 1 L 20.1 3.9 L 23 5 L 20.1 6.1 L 19 9 L 17.9 6.1 L 15 5 L 17.9 3.9 Z",
		],
	},
} as const satisfies Record<string, GeometrieIcone>;

export type NomIcone = keyof typeof GEOMETRIES;

/** Liste stable des noms, pour le script de contrôle et les tests. */
export const NOMS_ICONES = Object.keys(GEOMETRIES) as NomIcone[];

/**
 * Rend une géométrie en document SVG autonome. Sert au contrôle visuel
 * (rasterisation par `sharp`) et à tout usage hors React ; les composants React
 * n'en dépendent pas — ils lisent `GEOMETRIES` directement.
 */
export function svgIcone(
	nom: NomIcone,
	{ taille = 24, couleur = "#131B08", trait = TRAIT_ICONE }: { taille?: number; couleur?: string; trait?: number } = {}
): string {
	const g: GeometrieIcone = GEOMETRIES[nom];
	const traits = (g.traits ?? [])
		.map((d) => `<path d="${d}" fill="none" stroke="${couleur}" stroke-width="${trait}" />`)
		.join("");
	const aplats = (g.aplats ?? []).map((d) => `<path d="${d}" fill="${couleur}" stroke="none" />`).join("");
	return (
		`<svg xmlns="http://www.w3.org/2000/svg" width="${taille}" height="${taille}" viewBox="0 0 ${BOITE_ICONE} ${BOITE_ICONE}" ` +
		`stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="${POINTE_ICONE}">${traits}${aplats}</svg>`
	);
}
