import { getCurrentUser } from "@/lib/session";
import { dbUniverse } from "@/lib/db-universe";
import { apiUrl } from "@/lib/config";

/**
 * Téléchargement d'un film — **réservé aux membres connectés via Discord**
 * (même politique que les épisodes). Non connecté → /signin.
 *
 * Ordre de résolution :
 *   1. `video_url` (MP4 direct stocké) → redirection ;
 *   2. source téléchargeable dérivée des lecteurs (`players`) — Archive.org (MP4
 *      dérivé de l'API metadata) ou embed déjà direct (`.mp4`/`.m3u8`) ;
 *   3. repli sur le résolveur du bot (`/api/hls/movie-:id/download`) pour une
 *      source stockée (`stream_url` HLS), qui 404 proprement si rien.
 *
 * NB : la dérivation Archive.org se fait **ici** (le site lit `players` en PG
 * direct), car le replica SQLite du bot ne porte pas la colonne `players` →
 * le résolveur du bot ne pourrait pas la voir. Aucun lecteur iframe tiers
 * (vidmoly/voe/mailru) n'est téléchargeable → pas de bouton mort côté fiche.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Extrait l'identifiant Archive.org d'une URL `embed`/`download`. `null` sinon. */
function archiveIdentifier(embedUrl: string): string | null {
	const m = /archive\.org\/(?:embed|download)\/([^/?#]+)/i.exec(embedUrl);
	return m ? m[1] : null;
}

/**
 * Dérive le MP4 direct d'un item Archive.org via l'API metadata publique :
 * `https://archive.org/metadata/<id>` → plus gros `.mp4` de `files[]` →
 * `https://archive.org/download/<id>/<name>` (id + nom url-encodés). `null` si
 * l'item n'a aucun MP4 ou en cas d'erreur réseau (dégradation propre).
 */
async function resolveArchiveMp4(identifier: string): Promise<string | null> {
	try {
		const res = await fetch(`https://archive.org/metadata/${encodeURIComponent(identifier)}`);
		if (!res.ok) return null;
		const meta = (await res.json()) as { files?: { name?: string; size?: string }[] };
		const files = (meta.files ?? []).filter((f) => /\.mp4$/i.test(f.name ?? ""));
		if (files.length === 0) return null;
		const largest = files.toSorted((a, b) => Number(b.size ?? 0) - Number(a.size ?? 0))[0];
		if (!largest?.name) return null;
		return `https://archive.org/download/${encodeURIComponent(identifier)}/${encodeURIComponent(largest.name)}`;
	} catch {
		return null;
	}
}

/** URL téléchargeable dérivée des lecteurs (`players`), sinon `null`. */
async function resolveDownloadFromPlayers(
	players: { provider: string; embedUrl: string }[] | null | undefined
): Promise<string | null> {
	// Embed déjà direct (MP4/HLS) : utilisable tel quel.
	for (const p of players ?? []) {
		if (/\.(mp4|m3u8)(\?|$)/i.test(p.embedUrl)) return p.embedUrl;
	}
	// Archive.org : MP4 direct dérivé de l'API metadata.
	for (const p of players ?? []) {
		const identifier =
			p.provider === "archive" || /archive\.org\/(?:embed|download)\//i.test(p.embedUrl)
				? archiveIdentifier(p.embedUrl)
				: null;
		if (identifier) {
			const mp4 = await resolveArchiveMp4(identifier);
			if (mp4) return mp4;
		}
	}
	return null;
}

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

	// 1) MP4 direct stocké. Guard `URL.canParse` : une valeur admin non-absolue
	// ferait throw `Response.redirect` → 500 ; on retombe alors sur le résolveur bot.
	if (m.video_url && URL.canParse(m.video_url)) {
		return Response.redirect(m.video_url, 302);
	}
	// 2) Source téléchargeable dérivée des lecteurs (Archive.org MP4 / embed direct).
	const derived = await resolveDownloadFromPlayers(m.players);
	if (derived && URL.canParse(derived)) {
		return Response.redirect(derived, 302);
	}
	// 3) Repli : le bot résout une source stockée (stream_url HLS). 404 propre sinon.
	return Response.redirect(apiUrl(`api/hls/movie-${id}/download`), 302);
}
