import { cookies } from "next/headers";
import {
	ADMIN_COOKIE,
	ADMIN_COOKIE_MAX_AGE,
	adminTokenEnabled,
	buildAdminCookieValue,
	tokenMatches,
} from "@/lib/admin-token";

/**
 * Login/logout admin par token (sans Discord). POST { token } pose un cookie
 * signé ; DELETE le retire. Cf. `@/lib/admin-token` + `getCurrentUser`.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Anti-bruteforce best-effort (in-process), en complément du rate-limit nginx
// `/api/` (clé = IP socket réelle, non usurpable). Le token a une entropie ≥ 16
// chars comparée en temps constant ; ce throttle limite les tentatives bruyantes.
const attempts = new Map<string, { n: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_TRIES = 10;
const MAX_KEYS = 5_000;

function ipOf(req: Request): string {
	// `x-real-ip` est posé par nginx au $remote_addr (IP socket réelle, non
	// usurpable). On NE fait PAS confiance au 1er élément de X-Forwarded-For
	// (contrôlé par le client). En dernier recours, le dernier hop de XFF.
	const realIp = req.headers.get("x-real-ip")?.trim();
	if (realIp) return realIp;
	const xff = req.headers.get("x-forwarded-for");
	if (xff) {
		const parts = xff
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
		if (parts.length) return parts[parts.length - 1]!;
	}
	return "unknown";
}

function throttled(ip: string): boolean {
	const now = Date.now();
	// Purge bornée : retire les fenêtres expirées (et borne la taille mémoire).
	if (attempts.size > MAX_KEYS) {
		for (const [k, v] of attempts) if (v.resetAt < now) attempts.delete(k);
	}
	const cur = attempts.get(ip);
	if (!cur || cur.resetAt < now) {
		attempts.set(ip, { n: 1, resetAt: now + WINDOW_MS });
		return false;
	}
	cur.n += 1;
	return cur.n > MAX_TRIES;
}

export async function POST(req: Request) {
	if (!adminTokenEnabled()) {
		return Response.json({ error: "Accès admin par token désactivé." }, { status: 503 });
	}
	if (throttled(ipOf(req))) {
		return Response.json(
			{ error: "Trop de tentatives. Réessaie dans une minute." },
			{ status: 429 }
		);
	}
	const body = (await req.json().catch(() => null)) as { token?: string } | null;
	const token = typeof body?.token === "string" ? body.token : "";
	if (!tokenMatches(token)) {
		return Response.json({ error: "Token invalide." }, { status: 401 });
	}
	const jar = await cookies();
	jar.set(ADMIN_COOKIE, buildAdminCookieValue(), {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: ADMIN_COOKIE_MAX_AGE,
	});
	return Response.json({ ok: true });
}

export async function DELETE() {
	const jar = await cookies();
	jar.delete(ADMIN_COOKIE);
	return Response.json({ ok: true });
}
