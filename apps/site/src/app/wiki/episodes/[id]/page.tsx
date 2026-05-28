import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { dbUniverse } from "@/lib/db-universe";
import { assetUrl } from "@/lib/assets";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
// Client Component : un RSC peut le rendre directement. `ssr:false` n'est pas
// autorisé via next/dynamic dans un Server Component (Next 16) → le no-SSR
// (Vidstack touche `window`) est géré à l'intérieur du composant lui-même.
import { VideoPlayer } from "@/components/episodes/VideoPlayer";

export const dynamic = "force-dynamic";

const SERIES_LABELS: Record<string, string> = {
	DB: "Dragon Ball",
	DBZ: "Dragon Ball Z",
	DBZ_KAI: "Dragon Ball Z Kai",
	DBZ_KAI_FINAL: "Dragon Ball Z Kai – Final Chapters",
	DBGT: "Dragon Ball GT",
	DBS: "Dragon Ball Super",
	DB_DAIMA: "Dragon Ball Daima",
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const ep = await dbUniverse.episode(parseInt(id));
	if (!ep) return { title: "Épisode Dragon Ball — DBFR" };
	return {
		title: `Épisode ${ep.number_in_series} : ${ep.title} — ${SERIES_LABELS[ep.series] ?? ep.series} | DBFR`,
		description: ep.synopsis ?? `Fiche détaillée de l'épisode ${ep.number_in_series} de ${ep.series}.`,
	};
}

export default async function EpisodeDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const ep = await dbUniverse.episode(parseInt(id));

	if (!ep) notFound();

	// Helper to extract YouTube ID
	const getYoutubeId = (url: string | null) => {
		if (!url) return null;
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return (match && match[2].length === 11) ? match[2] : null;
	};

	const youtubeId = getYoutubeId(ep.video_url);

	return (
		<div className="mx-auto max-w-[1000px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<Link
				href={`/wiki/episodes?series=${ep.series}`}
				className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-12 link-underline"
			>
				<span>← Retour à la liste</span>
			</Link>

			<div className="space-y-12">
				<header>
					<div className="flex items-center gap-4 mb-4">
						<span className="scouter-text text-xl text-dbz-orange">
							#{String(ep.number_in_series).padStart(3, "0")}
						</span>
						<div className="h-px w-12 bg-dbz-border" />
						<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-white/40">
							{SERIES_LABELS[ep.series] ?? ep.series}
						</p>
					</div>
					
					<h1 className="font-saiyan text-5xl lg:text-7xl text-white mb-6 tracking-widest leading-tight">
						{ep.title}
					</h1>

					{ep.title_ja && (
						<p className="font-jp text-2xl text-dbz-orange/80 mb-8">
							{ep.title_ja}
						</p>
					)}

					<div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest">
						{ep.air_date && (
							<span className="px-3 py-1 bg-white/5 border border-white/10 text-white/60">
								📅 {new Date(ep.air_date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}
							</span>
						)}
						<span className="px-3 py-1 bg-dbz-orange/10 border border-dbz-orange/30 text-dbz-orange">
							CANON
						</span>
					</div>
				</header>

				{ep.video_url ? (
					<VideoPlayer
						src={ep.video_url}
						title={`Épisode ${ep.number_in_series} : ${ep.title ?? ""}`}
						poster={ep.image ? assetUrl(ep.image) : undefined}
					/>
				) : (
					ep.image && (
						<div className="dbz-panel p-2 aspect-video bg-dbz-bg overflow-hidden">
							<img
								src={assetUrl(ep.image)}
								alt={ep.title}
								className="w-full h-full object-cover rounded-lg opacity-90"
							/>
						</div>
					)
				)}

				{ep.synopsis && (
					<section className="dbz-panel p-8 relative overflow-hidden">
						<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />
						<h2 className="font-saiyan text-2xl text-dbz-orange mb-4 uppercase tracking-widest">Synopsis</h2>
						<div className="prose prose-invert max-w-none wiki-content">
							<WikiMarkdown body={ep.synopsis} />
						</div>
					</section>
				)}

				{youtubeId && (
					<section className="space-y-6">
						<div className="flex items-center gap-6">
							<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest whitespace-nowrap">
								Extrait Vidéo
							</h2>
							<div className="h-px flex-1 bg-gradient-to-r from-dbz-red/50 to-transparent" />
						</div>
						<div className="dbz-panel p-2 aspect-video bg-black overflow-hidden">
							<iframe
								width="100%"
								height="100%"
								src={`https://www.youtube.com/embed/${youtubeId}`}
								title={`${ep.title} Video`}
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="rounded-lg"
							></iframe>
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
