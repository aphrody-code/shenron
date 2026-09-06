import { EpisodeCard } from "@/components/stream/EpisodeCard";
import { PosterCard } from "@/components/stream/PosterCard";
import { StreamRow } from "@/components/stream/StreamRow";
import { yearOf } from "@/lib/epoch";
import type { readMediaCatalog } from "@/lib/media-catalog";

export type MediaCatalog = Awaited<ReturnType<typeof readMediaCatalog>>;

const SERIES_LABELS: Record<string, string> = {
	DB: "Dragon Ball",
	DBZ: "Dragon Ball Z",
	DBZ_KAI: "Dragon Ball Z Kai",
	DBGT: "Dragon Ball GT",
	DBS: "Dragon Ball Super",
	DB_DAIMA: "Dragon Ball Daima",
};

export function languageBadges(players: { lang?: "vf" | "vostfr" }[] | null): {
	hasVf: boolean;
	hasVostfr: boolean;
} {
	const safe = Array.isArray(players) ? players : [];
	return {
		hasVf: safe.some((player) => player.lang === "vf"),
		hasVostfr: safe.some((player) => player.lang === "vostfr"),
	};
}

export function seriesLabel(series: string): string {
	return SERIES_LABELS[series] ?? series;
}

/** Rails média partagés par l'accueil public et l'espace membre. */
export function MediaCatalogRails({
	catalog,
	eagerEpisodes = false,
	visible = { episodes: true, movies: true, manga: true, databooks: true },
}: {
	catalog: MediaCatalog;
	eagerEpisodes?: boolean;
	visible?: Partial<Record<keyof MediaCatalog, boolean>>;
}) {
	return (
		<>
			{visible.episodes !== false && catalog.episodes.length > 0 && (
				<StreamRow title="Épisodes à découvrir" seeAllHref="/wiki/episodes">
					{catalog.episodes.map((episode, index) => {
						const languages = languageBadges(episode.players);
						return (
							<EpisodeCard
								key={episode.id}
								href={`/wiki/episodes/${episode.id}`}
								number={episode.number}
								title={episode.title || `Épisode ${episode.number ?? episode.id}`}
								titleJa={episode.titleJa}
								image={episode.image}
								year={yearOf(episode.airDate)}
								hasVf={languages.hasVf}
								hasVostfr={languages.hasVostfr}
								eager={eagerEpisodes && index < 3}
							/>
						);
					})}
				</StreamRow>
			)}
			{visible.movies !== false && catalog.movies.length > 0 && (
				<StreamRow title="Films à voir" seeAllHref="/wiki/films">
					{catalog.movies.map((movie) => {
						const languages = languageBadges(movie.players);
						return (
							<PosterCard
								key={movie.id}
								href={`/wiki/films/${movie.slug}`}
								title={movie.title}
								titleJa={movie.titleJa}
								poster={movie.poster}
								year={yearOf(movie.releaseDate)}
								meta={movie.duration ? `${movie.duration} min` : null}
								hasVf={languages.hasVf}
								hasVostfr={languages.hasVostfr}
								badge="Film"
							/>
						);
					})}
				</StreamRow>
			)}
			{visible.manga !== false && catalog.manga.length > 0 && (
				<StreamRow title="Manga" seeAllHref="/wiki/manga">
					{catalog.manga.map((volume) => (
						<PosterCard
							key={volume.id}
							href={`/wiki/manga/volume/${volume.id}`}
							title={volume.title || `Tome ${volume.number ?? volume.id}`}
							titleJa={volume.titleJa}
							poster={volume.cover}
							year={yearOf(volume.publishedAt)}
							meta={seriesLabel(volume.series)}
							badge={volume.number != null ? `Tome ${volume.number}` : "Manga"}
							action="read"
						/>
					))}
				</StreamRow>
			)}
			{visible.databooks !== false && catalog.databooks.length > 0 && (
				<StreamRow title="Guides et databooks" seeAllHref="/wiki/databooks">
					{catalog.databooks.map((book) => (
						<PosterCard
							key={book.id}
							href={`/wiki/databooks/${book.id}`}
							title={book.title}
							titleJa={book.titleJa}
							poster={book.cover}
							year={yearOf(book.publishedAt)}
							meta={book.category}
							badge={book.kind === "interview" ? "Interview" : "Databook"}
							action="read"
						/>
					))}
				</StreamRow>
			)}
		</>
	);
}
