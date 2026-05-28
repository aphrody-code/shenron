/**
 * Proxy HLS — relaie le flux résolu (voir-anime → m3u8/segments) à notre player
 * hls.js, en injectant le `Referer` requis côté serveur (le navigateur ne peut
 * pas, et l'hôte du CDN bloque cross-origin / IP). Permet de jouer l'épisode
 * dans NOTRE lecteur (contrôles + sous-titres) au lieu d'un iframe tiers.
 *
 * Routes (catch-all) :
 *   /api/hls/{id}/master.m3u8        → playlist réécrite (URIs → /seg signés)
 *   /api/hls/{id}/seg?u=&r=&sig=     → segment/sous-playlist relayé (Referer r)
 *
 * Anti open-proxy : chaque URL relayée est signée HMAC (secret server-only) ;
 * une URL non signée correctement est refusée → pas de proxy ouvert / SSRF.
 */
import { dbUniverse } from "@/lib/db-universe";
import { env } from "@/lib/env";
import { NextResponse, type NextRequest } from "next/server";
import { createHmac } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET = env.BETTER_AUTH_SECRET ?? "shenron-hls";

function sign(value: string): string {
	return createHmac("sha256", SECRET).update(value).digest("hex").slice(0, 24);
}

/** Réécrit une playlist m3u8 : chaque URI passe par /seg signé. */
function rewritePlaylist(text: string, baseUrl: string, id: string, referer: string): string {
	const segUrl = (abs: string) => {
		const u = encodeURIComponent(abs);
		const r = encodeURIComponent(referer);
		return `/api/hls/${id}/seg?u=${u}&r=${r}&sig=${sign(`${abs}|${referer}`)}`;
	};
	const abs = (uri: string) => {
		try {
			return new URL(uri, baseUrl).toString();
		} catch {
			return uri;
		}
	};
	return text
		.split("\n")
		.map((line) => {
			const l = line.trim();
			if (!l) return line;
			if (l.startsWith("#")) {
				// Réécrit les URI="..." (EXT-X-KEY / MEDIA / MAP / I-FRAME...).
				return line.replace(/URI="([^"]+)"/g, (_m, uri) => `URI="${segUrl(abs(uri))}"`);
			}
			return segUrl(abs(l));
		})
		.join("\n");
}

function isPlaylist(url: string, contentType: string | null, body: string): boolean {
	return (
		/\.m3u8(\?|$)/i.test(url) ||
		(contentType ?? "").includes("mpegurl") ||
		body.startsWith("#EXTM3U")
	);
}

export async function GET(
	req: NextRequest,
	ctx: { params: Promise<{ slug: string[] }> },
) {
	const { slug } = await ctx.params;
	const id = slug?.[0] ?? "";
	const kind = slug?.[1] ?? "";

	if (kind === "master.m3u8") {
		const stream = await dbUniverse.episodeStream(Number(id));
		if (!stream) return new NextResponse("flux indisponible", { status: 404 });
		const referer = stream.headers.Referer ?? stream.headers.referer ?? "";
		let upstream: Response;
		try {
			upstream = await fetch(stream.url, {
				headers: referer ? { Referer: referer, Origin: new URL(referer).origin } : {},
				cache: "no-store",
			});
		} catch {
			return new NextResponse("source injoignable", { status: 502 });
		}
		if (!upstream.ok) return new NextResponse("source en erreur", { status: 502 });
		const text = await upstream.text();
		const out = rewritePlaylist(text, stream.url, id, referer);
		return new NextResponse(out, {
			headers: {
				"content-type": "application/vnd.apple.mpegurl",
				"cache-control": "no-store",
			},
		});
	}

	if (kind === "seg") {
		const u = req.nextUrl.searchParams.get("u") ?? "";
		const r = req.nextUrl.searchParams.get("r") ?? "";
		const sig = req.nextUrl.searchParams.get("sig") ?? "";
		if (!u || sign(`${u}|${r}`) !== sig) {
			return new NextResponse("signature invalide", { status: 403 });
		}
		let upstream: Response;
		try {
			upstream = await fetch(u, {
				headers: r ? { Referer: r, Origin: new URL(r).origin } : {},
				cache: "no-store",
			});
		} catch {
			return new NextResponse("segment injoignable", { status: 502 });
		}
		if (!upstream.ok) return new NextResponse("segment en erreur", { status: upstream.status });
		const ct = upstream.headers.get("content-type");

		// Sous-playlist (variante) → réécrire à son tour.
		const peek = (ct ?? "").includes("mpegurl") || /\.m3u8(\?|$)/i.test(u);
		if (peek) {
			const text = await upstream.text();
			if (isPlaylist(u, ct, text)) {
				const out = rewritePlaylist(text, u, id, r);
				return new NextResponse(out, {
					headers: { "content-type": "application/vnd.apple.mpegurl", "cache-control": "no-store" },
				});
			}
			return new NextResponse(text, { headers: { "content-type": ct ?? "text/plain" } });
		}

		// Segment binaire → relais en streaming.
		return new NextResponse(upstream.body, {
			headers: {
				"content-type": ct ?? "video/mp2t",
				"cache-control": "public, max-age=3600",
			},
		});
	}

	return new NextResponse("route inconnue", { status: 404 });
}
