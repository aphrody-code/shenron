import { Breadcrumbs } from "@/components/Breadcrumbs";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { SERIES_BANNERS } from "@/lib/db-banners";
import { MangaVolumeGrid } from "@/components/manga/MangaVolumeGrid";
import { MangaInfoSection } from "@/components/manga/MangaInfoSection";
import { MangaDialogueSearch } from "@/components/manga/MangaDialogueSearch";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Manga Dragon Ball",
	description:
		"Découvre les tomes de Dragon Ball et Dragon Ball Super, et lis les chapitres planche par planche dans le lecteur de scan DBFR.",
	alternates: { canonical: "/wiki/manga" },
};

export default async function MangaIndexPage() {
	const [dbVols, dbsVols, readableData] = await Promise.all([
		dbUniverse.mangaVolumes("DB"),
		dbUniverse.mangaVolumes("DBS"),
		dbUniverse.readableMangaChapters(),
	]);

	const dbVolumes = (dbVols?.volumes ?? [])
		.filter((v) => v.title?.startsWith("Dragon Ball Vol. "))
		.map((v) => ({
			id: v.id,
			series: v.series,
			volumeNumber: v.volume_number,
			title: v.title,
			cover: v.cover,
		}));

	const dbsVolumes = (dbsVols?.volumes ?? [])
		.filter((v) => v.title?.startsWith("Dragon Ball Super Vol. "))
		.map((v) => ({
			id: v.id,
			series: v.series,
			volumeNumber: v.volume_number,
			title: v.title,
			cover: v.cover,
		}));

	const readableChapters = (readableData?.chapters ?? []).map((ch) => ({
		id: ch.id,
		chapter_number: ch.chapter_number,
		title: ch.title,
		series: ch.series,
		cover: ch.cover,
		pages: ch.pages,
		volume_id: ch.volume_id,
	}));

	// Hero = vraie couverture de tome (l'œuvre elle-même) plutôt qu'un bandeau
	// événementiel générique ; repli sur la bannière d'ère si aucun tome.
	const heroCover = dbVolumes[0]?.cover ?? dbsVolumes[0]?.cover ?? null;
	const heroImage = heroCover ? assetUrl(heroCover) : SERIES_BANNERS.DB;

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Manga"
				title="Lecteur de scan"
				lead="L'œuvre originale d'Akira Toriyama, planche par planche. Sélectionne un tome ou parcours les chapitres disponibles."
				image={heroImage}
				imageAlt="Couverture du manga Dragon Ball"
				imagePosition="top"
			/>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
				<Breadcrumbs className="mb-8" items={[{ label: "Manga" }]} />
				<MangaDialogueSearch />

				<MangaVolumeGrid
					dbVolumes={dbVolumes}
					dbsVolumes={dbsVolumes}
					readableChapters={readableChapters}
				/>

				<MangaInfoSection />
			</div>
		</div>
	);
}
