import { MediaCatalogRails, type MediaCatalog } from "@/components/stream/MediaCatalogRails";
import type { HomeCatalogueConfig, HomeCatalogueHref } from "@/lib/home-scenes";
import type { AccessSnapshot } from "@/lib/wiki-launch";
import { isPathPublic } from "@/lib/wiki-launch";

/** Découverte éditoriale publique, complémentaire au deck narratif de l'accueil. */
export function HomeMediaCatalog({
	catalog,
	access,
	config,
}: {
	catalog: MediaCatalog;
	access: AccessSnapshot;
	config: HomeCatalogueConfig;
}) {
	if (!config.enabled) return null;
	const enabled = new Map<HomeCatalogueHref, boolean>(
		config.destinations.map((destination) => [destination.href, destination.enabled])
	);
	const visible = {
		episodes: enabled.get("/wiki/episodes") === true && isPathPublic("/wiki/episodes", access),
		movies: enabled.get("/wiki/films") === true && isPathPublic("/wiki/films", access),
		manga: enabled.get("/wiki/manga") === true && isPathPublic("/wiki/manga", access),
		databooks: enabled.get("/wiki/databooks") === true && isPathPublic("/wiki/databooks", access),
	};
	const hasContent =
		(visible.episodes && catalog.episodes.length > 0) ||
		(visible.movies && catalog.movies.length > 0) ||
		(visible.manga && catalog.manga.length > 0) ||
		(visible.databooks && catalog.databooks.length > 0);

	if (!hasContent) return null;

	return (
		<section
			aria-labelledby="catalogue-title"
			className="home-discovery-section w-full border-t border-white/10 bg-[radial-gradient(circle_at_15%_0%,rgba(231,130,32,.12),transparent_30%),#0a0908] px-4 py-16 text-white sm:px-6 md:py-24"
		>
			<div className="mx-auto w-full max-w-[1400px]">
				<header className="mb-9 max-w-3xl lg:mb-12">
					<p className="text-xs font-bold uppercase tracking-[0.22em] text-dbz-orange">
						{config.eyebrow}
					</p>
					<h2 id="catalogue-title" className="mt-3 text-balance font-saiyan text-4xl sm:text-6xl">
						{config.title}
					</h2>
					<p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-white/60 sm:text-base">
						{config.subtitle}
					</p>
				</header>
				<MediaCatalogRails catalog={catalog} access={access} visible={visible} />
			</div>
		</section>
	);
}
