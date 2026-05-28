import type { Thing, WithContext } from "schema-dts";

/**
 * Injecte un bloc JSON-LD (schema.org) typé via schema-dts pour les rich
 * results Google. Server Component inerte (aucun JS exécuté côté client).
 *
 * `<` / `>` / `&` sont échappés en \\uXXXX pour empêcher toute rupture du
 * `<script>` (le contenu vient de données wiki, pas d'input arbitraire, mais
 * l'échappement reste la règle pour du JSON-LD inline).
 */
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
	const json = JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026");
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD échappé
			dangerouslySetInnerHTML={{ __html: json }}
		/>
	);
}
