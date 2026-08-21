import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FavoritesList } from "./FavoritesList";

/**
 * `/favoris` — la liste personnelle, rendue **entièrement côté client**.
 *
 * La page elle-même reste un composant serveur statique et ne lit ni cookie ni
 * session : elle est donc cachée par le CDN comme n'importe quelle page
 * publique. Le contenu personnel arrive après l'hydratation, depuis
 * `localStorage` (et depuis `/api/favorites` si l'utilisateur est connecté).
 */
export const metadata: Metadata = {
	title: "Mes favoris",
	description:
		"Les épisodes, films et chapitres que tu as mis de côté sur Dragon Ball France. Conservés sur cet appareil, et synchronisés si tu es connecté.",
	// Page strictement personnelle : rien à indexer.
	robots: { index: false, follow: false },
};

export default function FavorisPage() {
	return (
		<div className="mx-auto w-full max-w-[1180px] px-6 py-12 lg:px-10 lg:py-16">
			<Breadcrumbs className="mb-8" items={[{ label: "Mes favoris" }]} />
			<header className="mb-10">
				<h1 className="font-display text-3xl font-bold text-white lg:text-4xl">Mes favoris</h1>
				<p className="mt-3 max-w-2xl text-white/60">
					Ce que tu as mis de côté. Conservé sur cet appareil — connecte-toi pour le retrouver
					partout.
				</p>
			</header>
			<FavoritesList />
		</div>
	);
}
