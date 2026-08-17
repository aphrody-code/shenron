import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				// /admin + /api (privés) ; /tierlists + /profil (non publics en bêta).
				// NE PAS blanket-disallow /wiki : casserait les sections publiques
				// episodes/films/manga ; le reste de /wiki est déjà 307 via le middleware.
				// TODO(réouverture) : reposer `noindex, follow` sur /wiki/search via meta
				// robots (pas une directive robots.txt) une fois la recherche rouverte.
				disallow: ["/admin/", "/api/", "/tierlists/", "/profil/"],
			},
			// Robots publicitaires Google. Ils n'indexent RIEN : ils explorent la page
			// pour en déduire le ciblage contextuel (Mediapartners-Google = AdSense) ou
			// pour contrôler la qualité de la page de destination (AdsBot). Les laisser
			// tomber sur le `Disallow` générique dégrade la pertinence des annonces —
			// et donc le revenu — et fait remonter « erreurs d'exploration » côté
			// AdSense. Une règle nommée remplace intégralement `*` pour ces agents,
			// d'où la reprise explicite des chemins privés.
			{
				userAgent: ["Mediapartners-Google", "AdsBot-Google", "AdsBot-Google-Mobile"],
				allow: "/",
				disallow: ["/admin/", "/api/"],
			},
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
