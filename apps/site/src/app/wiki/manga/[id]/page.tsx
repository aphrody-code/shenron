import { dbUniverse, assetUrl } from "@/lib/db-universe";
import { MangaReader } from "@/components/manga/MangaReader";
import { ogMeta } from "@/lib/og";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";

import type { Metadata } from "next";

export const revalidate = 3600;

// Pré-rend les chapitres lisibles au build → cache CDN (sans ça, Next 16 rend la
// route dynamiquement, no-store). dynamicParams=true : nouveaux chapitres on-demand.
export async function generateStaticParams() {
	const data = await dbUniverse.readableMangaChapters();
	return (data?.chapters ?? []).map((c) => ({ id: String(c.id) }));
}

// Un titre est « générique » quand il ne fait que répéter le numéro (« Chapitre 12 »,
// « Tome 3 », « Chapter 5 ») : dans ce cas on n'affiche pas de sous-titre pour éviter
// la redondance « Chapitre N — Chapitre N » (145/147 chapitres sont dans ce cas).
const isGenericTitle = (t?: string | null) =>
	!t || /^(chapitre|tome|chapter)\s*\d+$/i.test(t.trim());

function chapterTitle(chapter: { chapter_number: number; title: string | null }): string {
	return isGenericTitle(chapter.title)
		? `Chapitre ${chapter.chapter_number}`
		: `Chapitre ${chapter.chapter_number} — ${chapter.title}`;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const chapter = await dbUniverse.mangaChapter(Number(id));
	if (!chapter) return { title: "Manga Dragon Ball" };
	const label = isGenericTitle(chapter.title)
		? `Chapitre ${chapter.chapter_number}`
		: `Chapitre ${chapter.chapter_number} : ${chapter.title}`;
	const description = `Lis le chapitre ${chapter.chapter_number} du manga Dragon Ball planche par planche.`;
	return {
		title: `${label} — Manga Dragon Ball`,
		description,
		...ogMeta({
			title: label,
			description,
			image: chapter.cover ? assetUrl(chapter.cover) : undefined,
			canonical: `/wiki/manga/${id}`,
		}),
	};
}

export default async function MangaReaderPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const chapter = await dbUniverse.mangaChapter(Number(id));

	if (!chapter) notFound();

	return (
		<div className="mx-auto w-full min-w-0 max-w-[1200px] px-6 lg:px-10 py-10 lg:py-16 reveal-up overflow-x-hidden">
			<Breadcrumbs
				className="mb-8"
				items={[
					{ label: "Manga", href: "/wiki/manga" },
					{ label: `Chapitre ${chapter.chapter_number}` },
				]}
			/>

			<header className="mb-10">
				{/* Eyebrow « Chapitre N » uniquement quand le titre est un vrai sous-titre :
				    sinon le h1 porte déjà « Chapitre N » (pas de doublon). */}
				{!isGenericTitle(chapter.title) && (
					<span className="scouter-text text-xl text-dbz-orange block mb-2">
						Chapitre {chapter.chapter_number}
					</span>
				)}
				<h1 className="font-saiyan text-2xl sm:text-4xl lg:text-6xl text-white tracking-widest leading-tight break-words">
					{isGenericTitle(chapter.title) ? `Chapitre ${chapter.chapter_number}` : chapter.title}
				</h1>
			</header>

			<MangaReader
				pages={chapter.pages}
				title={chapterTitle(chapter)}
				prevHref={chapter.prev ? `/wiki/manga/${chapter.prev}` : null}
				nextHref={chapter.next ? `/wiki/manga/${chapter.next}` : null}
				prevPages={chapter.prevPages}
				nextPages={chapter.nextPages}
				chapterId={chapter.id}
				chapterNumber={chapter.chapter_number}
				series={chapter.series}
				chapterTitle={chapter.title}
			/>
		</div>
	);
}
