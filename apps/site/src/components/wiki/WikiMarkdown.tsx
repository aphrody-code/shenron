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
import { assetUrl } from "@/lib/db-universe";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const schema = {
	...defaultSchema,
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
		"*": [
			...(defaultSchema.attributes?.["*"] ?? []),
			"className",
			"style",
			"id",
		],
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
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
			components={{
				img: ({ src, alt, node: _node, ...props }) => (
					// biome-ignore lint/a11y/useAltText: alt forwardé depuis le markdown
					<img
						{...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
						src={assetUrl(typeof src === "string" ? src : "")}
						alt={alt ?? ""}
						loading="lazy"
					/>
				),
			}}
		>
			{body}
		</ReactMarkdown>
	);
}
