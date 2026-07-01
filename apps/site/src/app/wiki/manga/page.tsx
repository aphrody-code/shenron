import { dbUniverse } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { SAGAS_HERO } from "@/lib/db-banners";
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

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Manga"
				title="Lecteur de scan"
				lead="L'œuvre originale d'Akira Toriyama, planche par planche. Sélectionne un tome ou parcours les chapitres disponibles."
				image={SAGAS_HERO}
				imageAlt="Manga Dragon Ball"
			/>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
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
