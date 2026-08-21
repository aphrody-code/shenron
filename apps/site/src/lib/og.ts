import type { Metadata } from "next";

/**
 * Fragment de métadonnées Open Graph + Twitter Card réutilisable.
 * `image` doit être une URL ABSOLUE (ex. `assetUrl(...)` renvoie déjà des URLs
 * absolues vers le bot) ; les chemins relatifs ne sont PAS résolus ici — pour
 * un défaut relatif, c'est `metadataBase` du layout + le fichier
 * `app/opengraph-image.tsx` qui s'en chargent.
 * Sans `image`, la clé n'est pas émise du tout — c'est ce qui permet à la page
 * d'hériter de l'OG image de marque (`app/opengraph-image.tsx`). Poser
 * `images: undefined` ne suffit PAS : la clé présente écrase l'héritage.
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
	// La clé `images` est OMISE quand il n'y a pas d'image, au lieu d'être posée à
	// `undefined`. Ce n'était pas équivalent : poser la clé faisait perdre à la
	// page l'image de marque générée par `app/opengraph-image.tsx`. Vérifié en
	// production le 2026-08-21 — `/shop`, `/leaderboard`, `/classements`,
	// `/stats`, `/jeux` et toutes les fiches sans visuel n'émettaient AUCUN
	// `og:image`, donc un partage Discord ou Twitter sans vignette, alors que les
	// pages n'appelant pas ce helper, elles, avaient bien la carte de marque.
	const images = image ? { images: [{ url: image, alt: title }] } : {};
	const twitterImages = image ? { images: [image] } : {};
	return {
		...(canonical ? { alternates: { canonical } } : {}),
		openGraph: {
			title,
			description,
			type: type === "video.episode" || type === "video.movie" ? "video.other" : type,
			...(canonical ? { url: canonical } : {}),
			...images,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...twitterImages,
		},
	};
}
