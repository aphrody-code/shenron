import { getCurrentUser } from "@/lib/session";
import { dbUniverse } from "@/lib/db-universe";
import { apiUrl } from "@/lib/config";

/**
 * Téléchargement d'un film — **réservé aux membres connectés via Discord**
 * (même politique que les épisodes). Non connecté → /signin ; connecté → MP4
 * direct (`video_url`) sinon flux HLS du bot (`/api/hls/movie-:id/download`).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	if (!/^\d+$/.test(id)) {
		return new Response("Film introuvable.", { status: 404 });
	}

	const m = await dbUniverse.movie(id);
	if (!m) {
		return new Response("Film introuvable.", { status: 404 });
	}

	const me = await getCurrentUser();
	if (!me?.user) {
		// Location relatif (résolu contre l'URL publique côté navigateur).
		const back = encodeURIComponent(`/wiki/films/${m.slug}`);
		return new Response(null, { status: 302, headers: { Location: `/signin?callbackURL=${back}` } });
	}

	if (!m.video_url && !m.stream_url) {
		return new Response("Téléchargement indisponible pour ce film.", { status: 404 });
	}

	const target = m.video_url ? m.video_url : apiUrl(`api/hls/movie-${id}/download`);
	return Response.redirect(target, 302);
}
