"use client";

/**
 * Équivalent client de `GatedLink`/`GatedWrap`.
 *
 * `GatedLink` est un composant serveur : il lit la configuration de lancement
 * lui-même. Les grilles interactives (`CharacterGrid`, `UniverseTabs`,
 * `DatabookGrid`) sont, elles, des composants client — elles ne peuvent pas
 * faire cette lecture. Elles reçoivent donc un `AccessSnapshot` en props, résolu
 * une fois côté serveur par la page, et le passent ici.
 *
 * `isPathPublic` et `AccessSnapshot` vivent dans `lib/wiki-launch.ts`, module
 * client-safe (données pures, aucune connexion Postgres) : rien ne fuite dans le
 * bundle. Sans snapshot (`null`), on laisse le lien — mieux vaut une redirection
 * qu'une grille éteinte parce que la configuration n'a pas pu être lue.
 */
import Link from "next/link";
import type { ComponentProps } from "react";
import { isPathPublic, type AccessSnapshot } from "@/lib/wiki-launch";

/** Toutes les props de `<Link>` (dont `transitionTypes`), plus l'instantané d'accès. */
type Props = ComponentProps<typeof Link> & {
	access: AccessSnapshot | null | undefined;
	href: string;
};

export function ClientGatedWrap({ access, href, children, className = "", style, ...rest }: Props) {
	const open = access ? isPathPublic(href, access) : true;
	if (open) {
		return (
			<Link href={href} className={className} style={style} {...rest}>
				{children}
			</Link>
		);
	}
	// Les props propres à `<Link>` (préchargement, transitions de vue) n'ont plus
	// de sens sur une cible fermée : seul le libellé accessible est repris.
	return (
		<div
			className={`${className} cursor-default opacity-70`}
			style={style}
			aria-label={rest["aria-label"]}
			title="Cette section ouvrira bientôt"
			aria-disabled="true"
		>
			{children}
		</div>
	);
}
