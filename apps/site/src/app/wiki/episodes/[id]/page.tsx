import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { dbUniverse } from "@/lib/db-universe";
import type { EpisodeNavItem } from "@/lib/db-universe";
import { assetUrl } from "@/lib/assets";
import { ogMeta } from "@/lib/og";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
// Client Component : un RSC peut le rendre directement. `ssr:false` n'est pas
// autorisé via next/dynamic dans un Server Component (Next 16) → le no-SSR
// (hls.js touche `window`) est géré à l'intérieur du composant lui-même.
import { VideoPlayer } from "@/components/episodes/VideoPlayer";
import { EpisodeAdminEditor } from "./EpisodeAdminEditor";
import { VideoLecteurs } from "@/components/episodes/VideoLecteurs";
import { EpisodeDownload } from "@/components/episodes/EpisodeDownload";
import { KenBurns } from "@/components/KenBurns";
import { AnimatedMedia } from "@/components/media/AnimatedMedia";
import { BackgroundImage } from "@/components/media/BackgroundImage";
import { EpisodeScenes } from "./EpisodeScenes";
import { JsonLd } from "@/components/JsonLd";
import type { TVEpisode, BreadcrumbList, WithContext } from "schema-dts";
import { SITE_URL as SITE } from "@/lib/config";
import { excerpt } from "../_text";

export const revalidate = 3600;

// Pré-rend tous les épisodes au build → cache CDN (sinon Next 16 rend la route
// dynamiquement). L'éditeur admin est un îlot client (useMe) → aucune session SSR.
export async function generateStaticParams() {
	const data = await dbUniverse.episodes(undefined, 100000, 0);
	return (data?.episodes ?? []).map((e) => ({ id: String(e.id) }));
}

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
	if (!ep) return { title: "Épisode Dragon Ball" };
	// Synopsis nettoyé (Markdown retiré) et tronqué ~160 car. pour meta/og :
	// certains synopsis contiennent du Markdown (*_#>) qui fuiterait sinon brut.
	const description =
		excerpt(ep.synopsis) || `Fiche détaillée de l'épisode ${ep.number_in_series} de ${ep.series}.`;
	return {
		title: `Épisode ${ep.number_in_series} : ${ep.title} — ${SERIES_LABELS[ep.series] ?? ep.series}`,
		description,
		...ogMeta({
			title: `${ep.title} — ${SERIES_LABELS[ep.series] ?? ep.series}`,
			description,
			image: ep.image ? assetUrl(ep.image) : undefined,
			type: "video.episode",
			canonical: `/wiki/episodes/${id}`,
		}),
	};
}

function getYoutubeId(url: string | null): string | null {
	if (!url) return null;
	const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
	return m && m[2].length === 11 ? m[2] : null;
}

/** Carte de navigation épisode précédent / suivant. */
function NavCard({ ep, dir }: { ep: EpisodeNavItem; dir: "prev" | "next" }) {
	return (
		<Link
			href={`/wiki/episodes/${ep.id}`}
			className={`group flex items-center gap-4 dbz-panel p-3 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black ${dir === "next" ? "flex-row-reverse text-right" : ""}`}
		>
			<div className="relative w-28 aspect-video shrink-0 overflow-hidden rounded-md bg-dbz-bg">
				{ep.image ? (
					<img
						src={assetUrl(ep.image)}
						alt=""
						aria-hidden
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

export default async function EpisodeDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const ep = await dbUniverse.episode(parseInt(id));
	if (!ep) notFound();

	const nav = await dbUniverse.episodeNav(ep.series, ep.number_in_series);

	const youtubeId = getYoutubeId(ep.video_url);
	const seriesLabel = SERIES_LABELS[ep.series] ?? ep.series;
	const epNum = String(ep.number_in_series).padStart(3, "0");

	// Priorité aux lecteurs voir-anime (VF/VOSTFR, sources réelles maintenues à
	// jour) : ils priment sur `video_url`/`stream_url` qui pouvaient contenir des
	// flux de test (mux.dev) ou des tokens HLS périmés (IP-bound, ~12 h).
	const player =
		ep.players && ep.players.length > 0 ? (
			<VideoLecteurs players={ep.players} />
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

	// Téléchargement réellement résoluble ? Le bot résout à la volée depuis les
	// sources voir-anime (présence de `players`) ou depuis un MP4/HLS stocké
	// (`video_url`/`stream_url`). Un fallback image seul n'est PAS téléchargeable →
	// on masque le bouton pour ne jamais présenter un lien qui renverrait un 404.
	const canDownload =
		(ep.players != null && ep.players.length > 0) || Boolean(ep.video_url) || Boolean(ep.stream_url);

	// === Scènes d'épisode (additif, dégradation gracieuse) ===
	// On ne garde que les frames réellement écrites (imagePath non null : un
	// dry-run du pipeline laisse `imagePath === null`).
	const frames = (ep.frames ?? []).filter((f) => f.imagePath != null);
	const hasFrames = frames.length > 0;
	// Première frame (poster du preview) + meilleure frame marquante (hero fallback).
	const firstFrame = frames[0] ?? null;
	const notableFrame = frames.find((f) => f.isNotable) ?? firstFrame;

	// Bloc « scène » mis en avant : MP4 preview animé > frame marquante en
	// ken-burns. N'apparaît que si on a un montage ou des frames — sinon null,
	// le comportement actuel de la page reste strictement inchangé.
	const sceneHero = ep.scene_preview ? (
		<AnimatedMedia
			src={assetUrl(ep.scene_preview)}
			poster={firstFrame?.imagePath ? assetUrl(firstFrame.imagePath) : undefined}
			alt={`Aperçu animé — ${ep.title}`}
			className="aspect-video w-full rounded-xl"
		/>
	) : notableFrame?.imagePath ? (
		<div className="relative aspect-video w-full overflow-hidden rounded-xl">
			<BackgroundImage
				variant="kenburns"
				src={assetUrl(notableFrame.imagePath)}
				alt={`Scène marquante — ${ep.title}`}
				overlay="bottom"
			/>
		</div>
	) : null;

	const episodeSchema: WithContext<TVEpisode> = {
		"@context": "https://schema.org",
		"@type": "TVEpisode",
		episodeNumber: String(ep.number_in_series),
		name: ep.title,
		description: excerpt(ep.synopsis) || undefined,
		image: ep.image ? assetUrl(ep.image) : undefined,
		partOfSeries: {
			"@type": "TVSeries",
			name: seriesLabel,
		},
		datePublished: ep.air_date ? new Date(ep.air_date * 1000).toISOString() : undefined,
	};

	const breadcrumbSchema: WithContext<BreadcrumbList> = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE}/` },
			{
				"@type": "ListItem",
				position: 2,
				name: "Épisodes",
				item: `${SITE}/wiki/episodes`,
			},
			{ "@type": "ListItem", position: 3, name: `${seriesLabel} — Épisode ${ep.number_in_series}` },
		],
	};

	return (
		<div className="relative">
			<JsonLd data={episodeSchema} />
			<JsonLd data={breadcrumbSchema} />
			{/* === Backdrop cinématique plein cadre (vignette épisode floutée) === */}
			<div className="absolute inset-x-0 top-0 h-[70vh] -z-0 overflow-hidden">
				{ep.image ? (
					<KenBurns src={assetUrl(ep.image)} variant="slow" overlay="full" blur />
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
					</div>

					<h1 className="font-display font-bold text-4xl lg:text-6xl text-white leading-[1.02] tracking-tight mb-4 max-w-3xl drop-shadow-[0_4px_28px_rgba(0,0,0,0.65)]">
						{ep.title}
					</h1>

					{ep.title_ja && (
						<p className="font-jp text-xl lg:text-2xl text-dbz-orange/85 mb-4">{ep.title_ja}</p>
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
					<div className="reveal-up mb-12 shadow-2xl shadow-black/50 rounded-lg relative group/player">
						{player}
						{/* Téléchargement affiché uniquement quand une source est résoluble
						    (résolution HLS on-demand côté bot), réservé aux membres connectés
						    Discord. Masqué sur un fallback image seul → jamais de lien mort. */}
						{canDownload && (
							<div className="absolute top-3 right-3 z-20">
								<EpisodeDownload
									href={`/api/episodes/${ep.id}/download`}
									signinCallback={`/wiki/episodes/${ep.id}`}
									title={ep.title}
								/>
							</div>
						)}
					</div>
				)}

				{/* === Aperçu animé de scène (montage MP4 / frame marquante) ===
				    Affiché en complément du player s'il existe un montage ou des
				    frames. Si aucun player n'existe par ailleurs, ce bloc tient
				    lieu de visuel principal. */}
				{sceneHero && (
					<div className="reveal-up mb-12 shadow-2xl shadow-black/50 rounded-xl overflow-hidden">
						{sceneHero}
					</div>
				)}

				<EpisodeAdminEditor episodeId={ep.id} videoUrl={ep.video_url} subtitles={ep.subtitles} />

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

					{/* === Scènes : grille des frames extraites (îlot client) === */}
					{hasFrames && (
						<EpisodeScenes frames={frames} title={ep.title} episodeNumber={ep.number_in_series} />
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
							{nav.prev ? <NavCard ep={nav.prev} dir="prev" /> : <div className="flex-1" />}
							{nav.next ? <NavCard ep={nav.next} dir="next" /> : <div className="flex-1" />}
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
											className={`group relative w-40 shrink-0 dbz-panel overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black ${active ? "ring-2 ring-dbz-orange" : ""}`}
										>
											<div className="relative aspect-video bg-dbz-bg overflow-hidden">
												{e.image ? (
													<img
														src={assetUrl(e.image)}
														alt=""
														aria-hidden
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
