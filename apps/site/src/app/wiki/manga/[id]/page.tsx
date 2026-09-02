import { dbUniverse, assetUrl } from "@/lib/db-universe";
import { MangaReader } from "@/components/manga/MangaReader";
import { ogMeta } from "@/lib/og";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TrackHistory } from "@/components/history/TrackHistory";
import { ShareButton } from "@/components/ShareButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import Link from "next/link";
import { Palette, BookOpen } from "lucide-react";
import { estChapitreCouleur, SERIE_COULEUR } from "@/lib/manga-editions";

import type { Metadata } from "next";

export const revalidate = 3600;

// Pré-rend les chapitres lisibles au build → cache CDN (sans ça, Next 16 rend la
// route dynamiquement, no-store). dynamicParams=true : nouveaux chapitres on-demand.
export async function generateStaticParams() {
	const data = await dbUniverse.readableMangaChapters();
	// L'édition couleur est volontairement EXCLUE du pré-rendu : elle ajoute 520
	// pages statiques à un build qui réclame déjà ~26 Gio de mémoire anonyme et
	// qui est mort en OOM à plusieurs reprises. `dynamicParams` restant à `true`,
	// ces chapitres sont rendus à la demande puis mis en cache par l'ISR — le
	// coût est un premier affichage plus lent, pas une page absente.
	return (data?.chapters ?? [])
		.filter((c) => c.series !== SERIE_COULEUR)
		.map((c) => ({ id: String(c.id) }));
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

	const couleur = estChapitreCouleur(chapter);

	return (
		<div className="mx-auto w-full min-w-0 max-w-[1200px] px-6 lg:px-10 py-10 lg:py-16 reveal-up overflow-x-hidden">
			<TrackHistory
				kind="chapter"
				id={chapter.id}
				title={chapterTitle(chapter)}
				href={`/wiki/manga/${chapter.id}`}
				caption={`${chapter.series ?? "Manga"} · chapitre ${chapter.chapter_number}`}
			/>
			<Breadcrumbs
				className="mb-8"
				items={[
					{ label: "Manga", href: "/wiki/manga" },
					{ label: `Chapitre ${chapter.chapter_number}` },
				]}
			/>
			<div className="mb-8 flex flex-wrap items-center gap-3">
				<FavoriteButton
					kind="chapter"
					id={chapter.id}
					title={chapterTitle(chapter)}
					href={`/wiki/manga/${chapter.id}`}
					caption={`${chapter.series ?? "Manga"} · chapitre ${chapter.chapter_number}`}
				/>
				<ShareButton
					title={chapterTitle(chapter)}
					text={`${chapter.series ?? "Manga"} — chapitre ${chapter.chapter_number}`}
					path={`/wiki/manga/${chapter.id}`}
				/>
				{/* Passerelle entre éditions. Elle vise la fiche du TOME et non un
				    chapitre précis : la correspondance exacte n'existe pas dans un
				    sens (un tome noir et blanc = une douzaine de chapitres couleur),
				    et proposer un chapitre au hasard vaudrait moins que de laisser
				    choisir. */}
				{chapter.volume_id !== null && (
					<Link
						href={`/wiki/manga/volume/${chapter.volume_id}?edition=${couleur ? "nb" : "couleur"}`}
						className={`inline-flex h-11 items-center gap-2 rounded px-4 font-display text-sm font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60 ${
							couleur
								? "border border-white/10 bg-black/40 text-white/80 hover:text-white"
								: "bg-gradient-to-r from-fuchsia-500 to-amber-400 text-black"
						}`}
					>
						{couleur ? (
							<BookOpen className="h-4 w-4" aria-hidden="true" />
						) : (
							<Palette className="h-4 w-4" aria-hidden="true" />
						)}
						{couleur ? "Lire en noir & blanc" : "Lire en couleur"}
					</Link>
				)}
			</div>

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
