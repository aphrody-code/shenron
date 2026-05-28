import { permanentRedirect } from "next/navigation";
import { dbUniverse } from "@/lib/db-universe";

// Doublon historique de /wiki/films/[slug] (lecture API id-based). On résout le
// slug depuis Neon et on redirige vers la fiche canonique ; fallback liste films.
export default async function MovieIdLegacyRedirect({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const data = await dbUniverse.movies();
	const movie = data?.movies.find((m) => String(m.id) === id);
	if (movie?.slug) permanentRedirect(`/wiki/films/${movie.slug}`);
	permanentRedirect("/wiki/films");
}
