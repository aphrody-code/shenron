/**
 * Layout du catalogue Épisodes avec slot parallèle `@modal` + route
 * d'interception `@modal/(.)[id]` : cliquer une vignette depuis `/wiki/episodes`
 * ouvre l'aperçu en modale sans quitter le catalogue. Accès direct/refresh de
 * `/wiki/episodes/[id]` = fiche pleine page. Cf. `wiki/films/layout.tsx`.
 */
export default function EpisodesLayout({
	children,
	modal,
}: {
	children: React.ReactNode;
	modal: React.ReactNode;
}) {
	return (
		<>
			{children}
			{modal}
		</>
	);
}
