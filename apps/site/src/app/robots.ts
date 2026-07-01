import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			// /admin + /api (privés) ; /tierlists + /profil (non publics en bêta).
			// NE PAS blanket-disallow /wiki : casserait les sections publiques
			// episodes/films/manga ; le reste de /wiki est déjà 307 via le middleware.
			// TODO(réouverture) : reposer `noindex, follow` sur /wiki/search via meta
			// robots (pas une directive robots.txt) une fois la recherche rouverte.
			disallow: ["/admin/", "/api/", "/tierlists/", "/profil/"],
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
