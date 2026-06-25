import type { Metadata } from "next";

/**
 * Fragment de métadonnées Open Graph + Twitter Card réutilisable.
 * `image` doit être une URL ABSOLUE (ex. `assetUrl(...)` renvoie déjà des URLs
 * absolues vers le bot) ; les chemins relatifs ne sont PAS résolus ici — pour
 * un défaut relatif, c'est `metadataBase` du layout + le fichier
 * `app/opengraph-image.tsx` qui s'en chargent.
 * Si `image` est absente, on n'émet aucune image : la page hérite alors de
 * l'OG image de marque par défaut (opengraph-image.tsx).
 */
export function ogMeta({
	title,
	description,
	image,
	type = "article",
	canonical,
}: {
	title: string;
	description?: string;
	image?: string | null;
	type?: "article" | "website" | "video.episode" | "video.movie";
	/**
	 * URL canonique auto-référente de la page (chemin relatif, ex. `/wiki/sagas`,
	 * résolu contre `metadataBase` du layout). À renseigner page par page :
	 * une canonical globale pointerait à tort toutes les pages vers la home.
	 */
	canonical?: string;
}): Pick<Metadata, "openGraph" | "twitter" | "alternates"> {
	const images = image ? [{ url: image, alt: title }] : undefined;
	return {
		...(canonical ? { alternates: { canonical } } : {}),
		openGraph: {
			title,
			description,
			type: type === "video.episode" || type === "video.movie" ? "video.other" : type,
			...(canonical ? { url: canonical } : {}),
			images,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: image ? [image] : undefined,
		},
	};
}
