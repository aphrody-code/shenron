import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
import { ogMeta } from "@/lib/og";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VideoPlayer } from "@/components/episodes/VideoPlayer";
import { VideoLecteurs } from "@/components/episodes/VideoLecteurs";
import { EpisodeDownload } from "@/components/episodes/EpisodeDownload";
import { JsonLd } from "@/components/JsonLd";
import type { Movie as MovieSchema, WithContext } from "schema-dts";

export const revalidate = 3600;

export async function generateStaticParams() {
	const r = await dbUniverse.movies();
	return (r?.movies ?? []).map((m) => ({ slug: m.slug }));
}

const SERIES_LABELS: Record<string, string> = {
	DB_MOVIE: "Film Dragon Ball",
	DBZ_MOVIE: "Film Dragon Ball Z",
	DBS_MOVIE: "Film Dragon Ball Super",
	DB_DAIMA_MOVIE: "Film Daima",
	DBZ_OVA: "OVA Dragon Ball Z",
	DBZ_SPECIAL: "Téléfilm Dragon Ball Z",
};

// Retire les mentions de source du dataset (« (Source : ANN) », « [Écrit par
// MAL Rewrite] »…) en fin de synopsis. Boucle pour les balises empilées.
function stripSourceTags(s: string | null): string | null {
	if (!s) return s;
	let out = s;
	let prev: string;
	do {
		prev = out;
		out = out.replace(/\s*[([]\s*(?:source|écrit par)[^)\]]*[)\]]\s*$/i, "");
	} while (out !== prev);
	return out.trimEnd();
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const m = await dbUniverse.movie(slug);
	if (!m) return { title: "Film" };
	const description = stripSourceTags(m.synopsis) ?? `${SERIES_LABELS[m.series] ?? "Film"}.`;
	return {
		title: `${m.title} — Film`,
		description,
		...ogMeta({
			title: `${m.title} — DBFR`,
			description,
			image: m.poster ? assetUrl(m.poster) : undefined,
			type: "video.movie",
			canonical: `/wiki/films/${slug}`,
		}),
	};
}

export default async function FilmPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const m = await dbUniverse.movie(slug);
	if (!m) notFound();

	// Synopsis nettoyé des balises de source du dataset (cf. stripSourceTags).
	const synopsis = stripSourceTags(m.synopsis);

	const getYoutubeId = (url: string | null) => {
		if (!url) return null;
		const match = url.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11})/);
		return match ? match[1] : null;
	};
	const youtubeId = getYoutubeId(m.trailer_url);

	const player =
		m.players && m.players.length > 0 ? (
			<VideoLecteurs players={m.players} />
		) : m.video_url ? (
			<VideoPlayer
				src={m.video_url}
				title={`Film : ${m.title ?? ""}`}
				poster={m.poster ? assetUrl(m.poster) : undefined}
				subtitles={m.subtitles ?? undefined}
			/>
		) : m.stream_url ? (
			<VideoPlayer
				src={assetUrl(`/api/hls/movie-${m.id}/master.m3u8`)}
				title={`Film : ${m.title ?? ""}`}
				poster={m.poster ? assetUrl(m.poster) : undefined}
				subtitles={m.subtitles ?? undefined}
			/>
		) : null;

	// Téléchargement réellement résoluble ? Les lecteurs iframe (`players`) sont
	// lisibles mais PAS téléchargeables : seul un MP4 direct (`video_url`) ou un
	// flux HLS proxifié par le bot (`stream_url` → /api/hls/movie-:id) l'est. On
	// masque le bouton sinon → jamais de lien qui renverrait un 404.
	const canDownload = Boolean(m.video_url) || Boolean(m.stream_url);

	const jsonLdData: WithContext<MovieSchema> = {
		"@context": "https://schema.org",
		"@type": "Movie",
		name: m.title,
		image: m.poster ? assetUrl(m.poster) : undefined,
		description: synopsis ?? undefined,
		dateCreated: m.release_date
			? new Date(m.release_date * 1000).toISOString().split("T")[0]
			: undefined,
		// `datePublished` = propriété schema.org correcte pour une date de sortie.
		datePublished: m.release_date
			? new Date(m.release_date * 1000).toISOString().split("T")[0]
			: undefined,
		duration: m.duration_min ? `PT${m.duration_min}M` : undefined,
	};

	return (
		<div className="mx-auto max-w-[1180px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<JsonLd data={jsonLdData} />
			<Link
				href="/wiki/films"
				className="inline-flex items-center gap-2 text-[13px] font-display font-semibold tracking-[0.10em] uppercase text-dbz-orange hover:text-white transition-colors mb-8 link-underline"
			>
				← Tous les films
			</Link>

			<div className="grid md:grid-cols-[280px_1fr] gap-10">
				<div>
					{m.poster ? (
						<div className="dbz-panel p-4 border-2 border-dbz-orange/30 bg-dbz-card relative overflow-hidden group">
							<div className="absolute inset-0 halftone opacity-20" />
							<Image
								src={assetUrl(m.poster)}
								alt={m.title}
								width={280}
								height={420}
								sizes="280px"
								className="w-full h-auto object-cover relative z-10 drop-shadow-[0_0_15px_rgba(255,178,0,0.3)]"
								priority
							/>
						</div>
					) : (
						<div className="dbz-panel aspect-[2/3] flex items-center justify-center bg-zinc-900">
							<span className="text-zinc-700 font-saiyan text-6xl">?</span>
						</div>
					)}
				</div>

				<div className="space-y-8">
					<header>
						<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-dbz-orange mb-4">
							{SERIES_LABELS[m.series] ?? m.series.replace(/_/g, " ")}
						</p>
						<h1 className="font-saiyan text-5xl lg:text-7xl text-white mb-4 tracking-widest leading-tight">
							{m.title}
						</h1>
						{(m.title_ja || m.title_romaji) && (
							<div className="flex items-center flex-wrap gap-4 mb-6">
								{m.title_ja && (
									<span
										className="text-2xl font-bold tracking-widest text-dbz-orange"
										style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
									>
										{m.title_ja}
									</span>
								)}
								{m.title_romaji && (
									<span className="text-sm italic uppercase tracking-[0.2em] text-white/40">
										{m.title_romaji}
									</span>
								)}
							</div>
						)}

						<dl className="grid grid-cols-2 gap-4 max-w-md">
							{m.release_date && (
								<div>
									<dt className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-white/45 mb-1">
										Sortie
									</dt>
									<dd className="font-display text-white">
										{new Date(m.release_date * 1000).toLocaleDateString("fr-FR", {
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
									<dd className="font-display text-white">{m.duration_min} min</dd>
								</div>
							)}
						</dl>
					</header>

					{player ? (
						<div className="shadow-2xl shadow-black/50 rounded-lg overflow-hidden relative group/player">
							{player}
							{canDownload && (
								<div className="absolute top-3 right-3 z-20">
									<EpisodeDownload
										href={`/api/movies/${m.id}/download`}
										signinCallback={`/wiki/films/${m.slug}`}
										title={m.title}
									/>
								</div>
							)}
						</div>
					) : (
						// Aucun lecteur ni source (ex. Bardock, History of Trunks…) : état
						// vide propre plutôt qu'un embed cassé ou un bouton de téléchargement
						// mort. Le reste de la fiche (poster, infos, synopsis) reste affiché.
						<div className="dbz-panel aspect-video flex flex-col items-center justify-center gap-3 bg-dbz-bg/60 px-6 text-center">
							<span className="font-saiyan text-3xl text-white/25 tracking-widest">
								Lecteur bientôt disponible
							</span>
							<p className="max-w-sm text-[13px] text-white/45">
								Aucune source de lecture n'est disponible pour ce film pour le moment.
							</p>
						</div>
					)}

					{synopsis && (
						<section className="dbz-panel p-8 relative overflow-hidden">
							<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />
							<h2 className="font-saiyan text-2xl text-dbz-orange mb-4 uppercase tracking-widest">
								Synopsis
							</h2>
							<div className="prose prose-invert max-w-none wiki-content">
								<WikiMarkdown body={synopsis} />
							</div>
						</section>
					)}

					{youtubeId && (
						<section className="space-y-4">
							<div className="flex items-center gap-6">
								<h2 className="font-saiyan text-2xl text-white uppercase tracking-widest">
									Trailer Officiel
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-dbz-red/50 to-transparent" />
							</div>
							<div className="dbz-panel p-2 aspect-video bg-black overflow-hidden">
								<iframe
									width="100%"
									height="100%"
									src={`https://www.youtube.com/embed/${youtubeId}`}
									title={`${m.title} Trailer`}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="rounded-lg"
								></iframe>
							</div>
						</section>
					)}

					{m.mal_id && (
						<p className="text-[12px] text-white/50">
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
