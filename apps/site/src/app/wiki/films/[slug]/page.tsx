import { dbUniverse } from "@/lib/db-universe";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const SERIES_LABELS: Record<string, string> = {
	DB_MOVIE: "Film Dragon Ball",
	DBZ_MOVIE: "Film Dragon Ball Z",
	DBS_MOVIE: "Film Dragon Ball Super",
	DB_DAIMA_MOVIE: "Film Daima",
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const m = await dbUniverse.movie(slug);
	if (!m) return { title: "Film — DBFR" };
	return {
		title: `${m.title} — Film | DBFR`,
		description: m.synopsis ?? `${SERIES_LABELS[m.series] ?? "Film"}.`,
	};
}

export default async function FilmPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const m = await dbUniverse.movie(slug);
	if (!m) notFound();

	return (
		<div className="mx-auto max-w-[1180px] px-6 lg:px-10 py-16 lg:py-24">
			<Link
				href="/wiki/films"
				className="inline-flex items-center gap-2 text-[13px] font-display font-semibold tracking-[0.10em] uppercase text-dbz-orange hover:text-white transition-colors mb-8"
			>
				← Tous les films
			</Link>

			<div className="grid md:grid-cols-[280px_1fr] gap-10">
				<div>
					{m.poster && (
						<div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 bg-black">
							<Image
								src={m.poster}
								alt={m.title}
								fill
								sizes="280px"
								className="object-cover"
								priority
							/>
						</div>
					)}
				</div>

				<div>
					<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-3">
						{SERIES_LABELS[m.series] ?? m.series}
					</p>
					<h1 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white mb-3">
						{m.title}
					</h1>
					{m.title_ja && (
						<p className="font-jp text-[20px] text-dbz-orange/85 mb-6">
							{m.title_ja}
						</p>
					)}

					<dl className="grid grid-cols-2 gap-4 mb-8 max-w-md">
						{m.release_date && (
							<div>
								<dt className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-white/45 mb-1">
									Sortie
								</dt>
								<dd className="font-display text-white">
									{new Date(m.release_date).toLocaleDateString("fr-FR", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</dd>
							</div>
						)}
						{m.duration_min && (
							<div>
								<dt className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-white/45 mb-1">
									Durée
								</dt>
								<dd className="font-display text-white">
									{m.duration_min} min
								</dd>
							</div>
						)}
					</dl>

					{m.synopsis && (
						<div>
							<h2 className="font-display font-bold text-[20px] text-white border-b border-white/10 pb-2 mb-4">
								Synopsis
							</h2>
							<p className="text-[16px] leading-relaxed text-white/75 whitespace-pre-line">
								{m.synopsis}
							</p>
						</div>
					)}

					{m.mal_id && (
						<p className="mt-8 text-[12px] text-white/50">
							Source métadonnées :{" "}
							<a
								href={`https://myanimelist.net/anime/${m.mal_id}`}
								target="_blank"
								rel="noopener noreferrer"
								className="underline hover:text-dbz-orange"
							>
								MyAnimeList #{m.mal_id}
							</a>{" "}
							(via Jikan API)
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
