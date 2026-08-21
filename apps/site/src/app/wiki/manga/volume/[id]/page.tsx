import { dbUniverse } from "@/lib/db-universe";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { assetUrl } from "@/lib/db-universe";
import { ogMeta } from "@/lib/og";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Book as BookSchema, WithContext } from "schema-dts";
import { JsonLd } from "@/components/JsonLd";
import { VolumeChaptersList } from "@/components/manga/VolumeChaptersList";

/** Libellé de série pour le balisage `BookSeries` (clé DB → nom lisible). */
const SERIES_LABEL: Record<string, string> = {
	DB: "Dragon Ball",
	DBS: "Dragon Ball Super",
	DBZ: "Dragon Ball Z",
};

export const revalidate = 3600;

// Pré-rend les tomes au build → cache CDN (cf. piège generateStaticParams).
// On ne pré-génère QUE les tomes ayant ≥1 chapitre lisible (mêmes ids que la grille
// via scanVolumeIds) : évite de figer en cache ISR des routes de tomes fantômes/vides.
export async function generateStaticParams() {
	const readable = await dbUniverse.readableMangaChapters();
	const volIds = new Set(
		(readable?.chapters ?? []).map((c) => c.volume_id).filter((v): v is number => v != null)
	);
	return [...volIds].map((id) => ({ id: String(id) }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const volume = await dbUniverse.mangaVolume(parseInt(id));
	if (!volume) return { title: "Volume Manga" };
	const description = volume.title ?? `Volume ${volume.volume_number} du manga ${volume.series}.`;
	// Tome sans aucun chapitre lisible = contenu mince (« en cours d'ajout ») :
	// on le dé-indexe (mais reste crawlable) pour ne pas polluer l'index Google.
	const hasReadable = (volume.chapters ?? []).some(
		(c) => Array.isArray(c.pages) && c.pages.length > 0
	);
	return {
		title: `${volume.series} Volume ${volume.volume_number} — Manga Dragon Ball`,
		description,
		...(hasReadable ? {} : { robots: { index: false, follow: true } }),
		...ogMeta({
			title: `${volume.series} — Volume ${volume.volume_number}`,
			description,
			image: volume.cover ? assetUrl(volume.cover) : undefined,
			canonical: `/wiki/manga/volume/${id}`,
		}),
	};
}

export default async function MangaVolumePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const volume = await dbUniverse.mangaVolume(parseInt(id));
	if (!volume) notFound();

	// Balisage `Book` du tome. Les épisodes, films, jeux, personnages, lieux et
	// techniques étaient déjà décrits en JSON-LD ; le manga — la moitié du
	// catalogue — ne l'était pas du tout, donc invisible comme entité pour les
	// moteurs. `isbn` et `datePublished` viennent de la base quand ils y sont.
	const titre = volume.title?.trim() || `Tome ${volume.volume_number}`;
	const jsonLd: WithContext<BookSchema> = {
		"@context": "https://schema.org",
		"@type": "Book",
		name: titre,
		alternateName: volume.title_ja ?? undefined,
		bookFormat: "https://schema.org/Paperback",
		inLanguage: "fr",
		image: volume.cover ? assetUrl(volume.cover) : undefined,
		isbn: volume.isbn ?? undefined,
		datePublished: volume.published_at
			? new Date(volume.published_at * 1000).toISOString().split("T")[0]
			: undefined,
		numberOfPages: undefined,
		position: volume.volume_number || undefined,
		isPartOf: {
			"@type": "BookSeries",
			name: SERIES_LABEL[volume.series] ?? volume.series,
		},
		author: { "@type": "Person", name: "Akira Toriyama" },
	};

	return (
		<>
			<JsonLd data={jsonLd} />
			<div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
				<Breadcrumbs
					className="mb-12"
					items={[
						{ label: "Manga", href: "/wiki/manga" },
						{ label: `Tome ${volume.volume_number}` },
					]}
				/>

				<div className="flex flex-col md:flex-row gap-12 lg:gap-20">
					<div className="w-full md:w-1/3 lg:w-1/4">
						<div className="dbz-panel p-4 border-2 border-dbz-orange/30 bg-dbz-card relative overflow-hidden group">
							<div className="absolute inset-0 halftone opacity-20" />
							{volume.cover ? (
								<img
									src={assetUrl(volume.cover)}
									alt={`Volume ${volume.volume_number}`}
									className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,178,0,0.3)]"
								/>
							) : (
								<div className="aspect-[2/3] flex items-center justify-center bg-zinc-900">
									<span className="text-zinc-700 font-saiyan text-6xl">{volume.volume_number}</span>
								</div>
							)}
						</div>

						{/* Métadonnées du Tome */}
						<div className="mt-8 space-y-4 border-t border-white/10 pt-6 font-display text-xs">
							<div className="flex justify-between">
								<span className="text-white/50">Série :</span>
								<span className="text-white font-bold">
									{volume.series === "DB" ? "Dragon Ball" : "Dragon Ball Super"}
								</span>
							</div>
							{volume.title_ja && (
								<div className="flex justify-between">
									<span className="text-white/50">Titre Original :</span>
									<span className="text-white font-bold font-mono">{volume.title_ja}</span>
								</div>
							)}
							{volume.published_at && (
								<div className="flex justify-between">
									<span className="text-white/50">Publication :</span>
									<span className="text-white font-bold">
										{new Date(volume.published_at * 1000).toLocaleDateString("fr-FR", {
											year: "numeric",
											month: "long",
										})}
									</span>
								</div>
							)}
							{volume.isbn && (
								<div className="flex justify-between flex-wrap gap-2">
									<span className="text-white/50">ISBN :</span>
									<span className="text-white font-mono font-bold break-all">{volume.isbn}</span>
								</div>
							)}
						</div>
					</div>

					<div className="flex-1 space-y-10">
						<header>
							<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-dbz-orange mb-4">
								{volume.series === "DB" ? "Dragon Ball" : "Dragon Ball Super"} · Volume{" "}
								{volume.volume_number}
							</p>
							<h1 className="font-saiyan text-5xl lg:text-7xl text-white mb-6 tracking-widest leading-tight">
								{volume.title || `VOLUME ${volume.volume_number}`}
							</h1>
							<div className="h-1 w-24 bg-dbz-orange" />
						</header>

						<section className="space-y-6">
							<div className="flex items-center gap-6">
								<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest">
									Sommaire des Chapitres
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
							</div>

							<VolumeChaptersList chapters={volume.chapters} />
						</section>
					</div>
				</div>
			</div>
		</>
	);
}
