/**
 * Rendu markdown enrichi pour les pages wiki libres (table WikiPage).
 *
 * Contrairement au rendu markdown basique, ce composant active :
 *   - `rehype-raw` : le HTML inline écrit dans le markdown est rendu (figures
 *     flottantes, colonnes, infobox…), ce qui permet une vraie mise en page wiki.
 *   - `rehype-sanitize` : nettoie ce HTML (schéma étendu, mais pas de <script>).
 *   - réécriture des `src` d'images : un chemin DB (`./assets/...`) ou relatif est
 *     converti en URL CDN du bot via assetUrl().
 *
 * Le seul rédacteur est l'admin authentifié (owner) → on autorise `className` et
 * `style` pour laisser la liberté de mise en page. `style` ne peut pas exécuter
 * de JS (les navigateurs bloquent `javascript:`/`expression()` en CSS).
 *
 * Isomorphe : utilisable en RSC (page wiki) comme en Client Component (preview
 * de l'éditeur). Ne pas ajouter "use client" ici.
 */
import { assetUrl } from "@/lib/assets";
import { ZoomableImage } from "./ZoomableImage";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

const schema = {
	...defaultSchema,
	// rehype-sanitize préfixe les `id` en `user-content-` par défaut (anti DOM
	// clobbering). Or les ancres de titres (rehype-autolink-headings) pointent sur
	// `#slug` sans préfixe → désynchro qui casse le scroll. On vide le préfixe : le
	// seul rédacteur est l'admin (owner), pas de contenu hostile.
	clobberPrefix: "",
	tagNames: [
		...(defaultSchema.tagNames ?? []),
		"figure",
		"figcaption",
		"mark",
		"details",
		"summary",
		"abbr",
		"u",
	],
	attributes: {
		...defaultSchema.attributes,
		"*": [...(defaultSchema.attributes?.["*"] ?? []), "className", "style", "id"],
		img: [
			...(defaultSchema.attributes?.img ?? []),
			"src",
			"alt",
			"title",
			"width",
			"height",
			"loading",
		],
		a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
	},
};

export function WikiMarkdown({ body }: { body: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm, remarkBreaks]}
			// Ordre critique : slug + autolink AVANT sanitize. rehype-slug pose un
			// `id` sur chaque titre (deep-link `#ancre`), autolink-headings emballe
			// le titre dans un `<a href="#id">`. `id` est déjà whitelisté (sur `*`)
			// dans `schema`, donc sanitize ne strippe pas les ancres.
			rehypePlugins={[
				rehypeRaw,
				rehypeSlug,
				[rehypeAutolinkHeadings, { behavior: "wrap" }],
				[rehypeSanitize, schema],
			]}
			components={{
				img: ({ src, alt, node: _node, ...props }) => (
					<ZoomableImage
						{...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
						src={assetUrl(typeof src === "string" ? src : "")}
						alt={alt ?? ""}
					/>
				),
				// Sous-catégories repliables : ouvertes par défaut (sinon la page paraît
				// vide derrière des sections fermées). L'utilisateur peut toujours les
				// replier — `open` reste un état natif <details>.
				details: ({ node: _node, open, children, ...props }) => (
					<details
						{...(props as React.DetailsHTMLAttributes<HTMLDetailsElement>)}
						open={(open as boolean | undefined) ?? true}
					>
						{children}
					</details>
				),
			}}
		>
			{body}
		</ReactMarkdown>
	);
}
