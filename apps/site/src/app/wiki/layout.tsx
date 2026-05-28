export default function WikiLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Pass-through : chaque page wiki porte son propre container/largeur. Le
	// sidebar de navigation a été retiré (doublon de la nav principale SiteNav).
	return <>{children}</>;
}
