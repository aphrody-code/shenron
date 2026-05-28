import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { dbUniverse } from "@/lib/db-universe";
import type { EpisodeNavItem } from "@/lib/db-universe";
import { assetUrl } from "@/lib/assets";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
// Client Component : un RSC peut le rendre directement. `ssr:false` n'est pas
// autorisé via next/dynamic dans un Server Component (Next 16) → le no-SSR
// (hls.js touche `window`) est géré à l'intérieur du composant lui-même.
import { VideoPlayer } from "@/components/episodes/VideoPlayer";
import { isCurrentUserAdmin } from "@/lib/session";
import { EpisodeMediaEditor } from "./EpisodeMediaEditor";
import { EpisodeLecteurs } from "@/components/episodes/EpisodeLecteurs";
import { KenBurns } from "@/components/KenBurns";

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
		description:
			ep.synopsis ??
			`Fiche détaillée de l'épisode ${ep.number_in_series} de ${ep.series}.`,
	};
}

function getYoutubeId(url: string | null): string | null {
	if (!url) return null;
	const m = url.match(
		/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
	);
	return m && m[2].length === 11 ? m[2] : null;
}

/** Carte de navigation épisode précédent / suivant. */
function NavCard({
	ep,
	dir,
}: {
	ep: EpisodeNavItem;
	dir: "prev" | "next";
}) {
	return (
		<Link
			href={`/wiki/episodes/${ep.id}`}
			className={`group flex items-center gap-4 dbz-panel p-3 flex-1 ${dir === "next" ? "flex-row-reverse text-right" : ""}`}
		>
			<div className="relative w-28 aspect-video shrink-0 overflow-hidden rounded-md bg-dbz-bg">
				{ep.image ? (
					<img
						src={assetUrl(ep.image)}
						alt=""
						className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
						loading="lazy"
					/>
				) : (
					<div className="grid h-full w-full place-items-center text-zinc-700 font-saiyan">
						{String(ep.number_in_series).padStart(3, "0")}
					</div>
				)}
			</div>
			<div className="min-w-0">
				<p className="font-display font-bold text-[10px] tracking-[0.3em] uppercase text-dbz-orange/80">
					{dir === "prev" ? "← Précédent" : "Suivant →"}
				</p>
				<p className="scouter-text text-sm text-white/50">
					#{String(ep.number_in_series).padStart(3, "0")}
				</p>
				<p className="font-display font-semibold text-[13px] text-white leading-snug line-clamp-2 group-hover:text-dbz-orange transition-colors">
					{ep.title}
				</p>
			</div>
		</Link>
	);
}

export default async function EpisodeDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const ep = await dbUniverse.episode(parseInt(id));
	if (!ep) notFound();

	const [isAdmin, nav] = await Promise.all([
		isCurrentUserAdmin(),
		dbUniverse.episodeNav(ep.series, ep.number_in_series),
	]);

	const youtubeId = getYoutubeId(ep.video_url);
	const seriesLabel = SERIES_LABELS[ep.series] ?? ep.series;
	const epNum = String(ep.number_in_series).padStart(3, "0");

	// Priorité aux lecteurs voir-anime (VF/VOSTFR, sources réelles maintenues à
	// jour) : ils priment sur `video_url`/`stream_url` qui pouvaient contenir des
	// flux de test (mux.dev) ou des tokens HLS périmés (IP-bound, ~12 h).
	const player =
		ep.players && ep.players.length > 0 ? (
			<EpisodeLecteurs players={ep.players} />
		) : ep.video_url ? (
			<VideoPlayer
				src={ep.video_url}
				title={`Épisode ${ep.number_in_series} : ${ep.title ?? ""}`}
				poster={ep.image ? assetUrl(ep.image) : undefined}
				subtitles={ep.subtitles ?? undefined}
			/>
		) : ep.stream_url ? (
			<VideoPlayer
				src={assetUrl(`/api/hls/${ep.id}/master.m3u8`)}
				title={`Épisode ${ep.number_in_series} : ${ep.title ?? ""}`}
				poster={ep.image ? assetUrl(ep.image) : undefined}
				subtitles={ep.subtitles ?? undefined}
			/>
		) : ep.image ? (
		<div className="dbz-panel p-2 aspect-video bg-dbz-bg overflow-hidden">
			<img
				src={assetUrl(ep.image)}
				alt={ep.title}
				className="w-full h-full object-cover rounded-lg opacity-90"
			/>
		</div>
	) : null;

	return (
		<div className="relative">
			{/* === Backdrop cinématique plein cadre (vignette épisode floutée) === */}
			<div className="absolute inset-x-0 top-0 h-[70vh] -z-0 overflow-hidden">
				{ep.image ? (
					<KenBurns
						src={assetUrl(ep.image)}
						variant="slow"
						overlay="full"
						blur
					/>
				) : (
					<div className="absolute inset-0 aurora opacity-50" />
				)}
				{/* Fondu vers le fond de page */}
				<div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-dbz-bg to-transparent" />
			</div>

			<div className="relative z-10 mx-auto max-w-[1180px] px-6 lg:px-10 pt-10 pb-20">
				<Link
					href={`/wiki/episodes?series=${ep.series}`}
					className="inline-flex items-center gap-2 text-white/70 hover:text-dbz-orange transition-colors font-bold uppercase text-[11px] tracking-widest mb-10 link-underline"
				>
					<span>← {seriesLabel}</span>
				</Link>

				{/* === En-tête superposé au backdrop === */}
				<header className="mb-8 reveal-up">
					<div className="flex items-center gap-4 mb-4">
						<span className="scouter-text text-2xl text-dbz-orange drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
							#{epNum}
						</span>
						<div className="h-px w-12 bg-dbz-orange/40" />
						<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-white/60">
							{seriesLabel}
						</p>
						<span className="px-2.5 py-0.5 rounded-full bg-dbz-orange/15 border border-dbz-orange/40 text-dbz-orange text-[10px] font-bold uppercase tracking-widest">
							Canon
						</span>
					</div>

					<h1 className="font-display font-bold text-4xl lg:text-6xl text-white leading-[1.02] tracking-tight mb-4 max-w-3xl drop-shadow-[0_4px_28px_rgba(0,0,0,0.65)]">
						{ep.title}
					</h1>

					{ep.title_ja && (
						<p className="font-jp text-xl lg:text-2xl text-dbz-orange/85 mb-4">
							{ep.title_ja}
						</p>
					)}

					{ep.air_date && (
						<p className="text-[13px] font-display tracking-widest uppercase text-white/55">
							Première diffusion —{" "}
							{new Date(ep.air_date * 1000).toLocaleDateString("fr-FR", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</p>
					)}
				</header>

				{/* === Player === */}
				{player && (
					<div className="reveal-up mb-12 shadow-2xl shadow-black/50 rounded-lg">
						{player}
					</div>
				)}

				{isAdmin && (
					<div className="mb-12">
						<EpisodeMediaEditor
							episodeId={ep.id}
							videoUrl={ep.video_url}
							subtitles={ep.subtitles}
						/>
					</div>
				)}

				{/* === Corps : synopsis + nav === */}
				<div className="space-y-12">
					{ep.synopsis && (
						<section className="dbz-panel p-8 relative overflow-hidden reveal-up">
							<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />
							<h2 className="font-display font-bold text-xl text-dbz-orange mb-4 uppercase tracking-widest">
								Synopsis
							</h2>
							<div className="prose prose-invert max-w-none wiki-content">
								<WikiMarkdown body={ep.synopsis} />
							</div>
						</section>
					)}

					{youtubeId && (
						<section className="space-y-6 reveal-up">
							<div className="flex items-center gap-6">
								<h2 className="font-display font-bold text-2xl text-white uppercase tracking-widest whitespace-nowrap">
									Extrait vidéo
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-red/50 to-transparent" />
							</div>
							<div className="dbz-panel p-2 aspect-video bg-black overflow-hidden">
								<iframe
									width="100%"
									height="100%"
									src={`https://www.youtube.com/embed/${youtubeId}`}
									title={`${ep.title} — extrait`}
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="rounded-lg"
								/>
							</div>
						</section>
					)}

					{/* === Navigation précédent / suivant === */}
					{nav && (nav.prev || nav.next) && (
						<nav className="flex flex-col sm:flex-row gap-4">
							{nav.prev ? (
								<NavCard ep={nav.prev} dir="prev" />
							) : (
								<div className="flex-1" />
							)}
							{nav.next ? (
								<NavCard ep={nav.next} dir="next" />
							) : (
								<div className="flex-1" />
							)}
						</nav>
					)}

					{/* === Strip des épisodes voisins === */}
					{nav && nav.around.length > 1 && (
						<section>
							<h2 className="font-display font-bold text-[12px] tracking-[0.3em] uppercase text-white/45 mb-4">
								Dans {seriesLabel}
							</h2>
							<div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 [scrollbar-width:thin]">
								{nav.around.map((e) => {
									const active = e.id === ep.id;
									return (
										<Link
											key={e.id}
											href={`/wiki/episodes/${e.id}`}
											className={`group relative w-40 shrink-0 dbz-panel overflow-hidden ${active ? "ring-2 ring-dbz-orange" : ""}`}
										>
											<div className="relative aspect-video bg-dbz-bg overflow-hidden">
												{e.image ? (
													<img
														src={assetUrl(e.image)}
														alt=""
														className="h-full w-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
														loading="lazy"
													/>
												) : (
													<div className="grid h-full w-full place-items-center text-zinc-700 font-saiyan text-sm">
														{String(e.number_in_series).padStart(3, "0")}
													</div>
												)}
												<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
												<span className="absolute top-1 left-1 scouter-text text-[9px] text-dbz-orange bg-black/60 px-1.5 py-0.5">
													#{String(e.number_in_series).padStart(3, "0")}
												</span>
											</div>
											<p className="p-2 font-display font-semibold text-[10px] text-white leading-tight line-clamp-2 group-hover:text-dbz-orange transition-colors">
												{e.title}
											</p>
										</Link>
									);
								})}
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}
