import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { SAGAS_HERO } from "@/lib/db-banners";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Manga Dragon Ball — DBFR",
	description:
		"Lis les chapitres du manga Dragon Ball d'Akira Toriyama, planche par planche, dans le lecteur de scan DBFR.",
};

const SERIES_LABELS: Record<string, string> = {
	DB: "Dragon Ball",
	DBZ: "Dragon Ball Z",
	DBS: "Dragon Ball Super",
	DB_DAIMA: "Dragon Ball Daima",
};

export default async function MangaIndexPage() {
	const data = await dbUniverse.readableMangaChapters();
	const chapters = data?.chapters ?? [];

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Manga"
				title="Lecteur de scan"
				lead="L'œuvre originale d'Akira Toriyama, planche par planche. Sélectionne un chapitre pour ouvrir le lecteur."
				image={SAGAS_HERO}
				imageAlt="Manga Dragon Ball"
			/>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
				{chapters.length === 0 ? (
					<div className="dbz-panel p-10 max-w-2xl border-l-4 border-l-dbz-orange">
						<h2 className="font-saiyan text-2xl text-white mb-3 tracking-widest">
							AUCUN CHAPITRE DISPONIBLE
						</h2>
						<p className="text-white/60 leading-relaxed">
							Aucun chapitre lisible n'est encore en ligne. Les scans seront
							ajoutés progressivement — reviens bientôt.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
						{chapters.map((chapter, idx) => (
							<Link
								key={chapter.id}
								href={`/wiki/manga/${chapter.id}`}
								className="group dbz-panel overflow-hidden hover:scale-105 hover:border-dbz-orange transition-all duration-300"
								style={{ animationDelay: `${idx * 0.03}s` }}
							>
								<div className="relative aspect-[3/4] bg-dbz-bg overflow-hidden">
									<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
									{chapter.cover ? (
										<Image
											src={assetUrl(chapter.cover)}
											alt={chapter.title ?? `Chapitre ${chapter.chapter_number}`}
											fill
											sizes="(max-width: 768px) 50vw, 16vw"
											className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
										/>
									) : (
										<div className="grid h-full w-full place-items-center">
											<BookOpen
												className="w-10 h-10 text-dbz-orange/20"
												aria-hidden="true"
											/>
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
									<div className="absolute inset-x-0 bottom-0 p-4 z-30">
										<span className="scouter-text text-xs text-dbz-orange block mb-1">
											Chapitre {chapter.chapter_number}
										</span>
										<p className="font-display font-bold text-sm text-white group-hover:text-dbz-orange transition-colors line-clamp-2">
											{chapter.title ??
												(SERIES_LABELS[chapter.series] ?? chapter.series)}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
