import { dbUniverse } from "@/lib/db-universe";
import { MangaReader } from "@/components/manga/MangaReader";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

function chapterTitle(chapter: {
	chapter_number: number;
	title: string | null;
}): string {
	return chapter.title
		? `Chapitre ${chapter.chapter_number} — ${chapter.title}`
		: `Chapitre ${chapter.chapter_number}`;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const chapter = await dbUniverse.mangaChapter(Number(id));
	if (!chapter) return { title: "Manga Dragon Ball — DBFR" };
	const label = chapter.title
		? `Chapitre ${chapter.chapter_number} : ${chapter.title}`
		: `Chapitre ${chapter.chapter_number}`;
	return {
		title: `${label} — Manga Dragon Ball | DBFR`,
		description: `Lis le chapitre ${chapter.chapter_number} du manga Dragon Ball planche par planche.`,
	};
}

export default async function MangaReaderPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const chapter = await dbUniverse.mangaChapter(Number(id));

	if (!chapter) notFound();

	return (
		<div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-10 lg:py-16 reveal-up">
			<Link
				href="/wiki/manga"
				className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-8 link-underline"
			>
				<ChevronLeft className="w-4 h-4" aria-hidden="true" />
				<span>Tous les chapitres</span>
			</Link>

			<header className="mb-10">
				<span className="scouter-text text-xl text-dbz-orange block mb-2">
					Chapitre {chapter.chapter_number}
				</span>
				{chapter.title && (
					<h1 className="font-saiyan text-4xl lg:text-6xl text-white tracking-widest leading-tight">
						{chapter.title}
					</h1>
				)}
			</header>

			<MangaReader
				pages={chapter.pages}
				title={chapterTitle(chapter)}
				prevHref={chapter.prev ? `/wiki/manga/${chapter.prev}` : null}
				nextHref={chapter.next ? `/wiki/manga/${chapter.next}` : null}
			/>
		</div>
	);
}
