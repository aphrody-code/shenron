/**
 * POST /api/reports — un membre **connecté** (compte Discord lié) signale une
 * erreur/problème depuis une page. Crée un ticket dans `public.site_reports`,
 * consultable dans /admin/signalements.
 *
 * Auth requise (getCurrentUser → user métier). Rate-limit en mémoire (anti-spam,
 * par userId). Écriture directe Postgres (données côté site, pas le proxy bot).
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { siteReports, type SiteReportInsert } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { sanitizeInternalPath } from "@/lib/internal-path";
import { createMemoryRateLimiter } from "@/lib/memory-rate-limit";
import { REPORT_CATEGORY_KEYS, REPORT_MESSAGE_MAX } from "@/lib/report-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
	path: z.string().min(1).max(512),
	pageTitle: z.string().max(300).nullish(),
	category: z.enum(REPORT_CATEGORY_KEYS as [string, ...string[]]).default("bug"),
	message: z.string().trim().min(5, "message trop court").max(REPORT_MESSAGE_MAX),
});

// Rate-limit en mémoire (best-effort) : 5 signalements / 10 min / utilisateur.
const reportRateLimit = createMemoryRateLimiter({ windowMs: 10 * 60_000, limit: 5 });

export async function POST(req: NextRequest): Promise<NextResponse> {
	// Identité : signalement réservé aux membres connectés (compte Discord lié).
	let me: Awaited<ReturnType<typeof getCurrentUser>> = null;
	try {
		me = await getCurrentUser();
	} catch {
		me = null;
	}
	if (!me?.user?.id) {
		return NextResponse.json({ ok: false, error: "auth_required" }, { status: 401 });
	}

	if (reportRateLimit.isLimited(me.user.id)) {
		return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
	}

	let parsed: z.infer<typeof bodySchema>;
	try {
		parsed = bodySchema.parse(await req.json());
	} catch {
		return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
	}

	// Path same-origin, sans query string / fragment (pas de PII). Ce champ est
	// ensuite rendu comme lien dans l'admin : il ne doit jamais devenir une URL
	// externe déguisée par des antislashs.
	const cleanPath = sanitizeInternalPath(parsed.path.split("?")[0]!.split("#")[0], 512);
	if (!cleanPath) {
		return NextResponse.json({ ok: false, error: "bad_path" }, { status: 400 });
	}
	const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;

	const row: SiteReportInsert = {
		userId: me.user.id,
		discordId: me.user.discordId ?? me.discordId ?? null,
		username: me.user.username ?? null,
		path: cleanPath,
		pageTitle: parsed.pageTitle?.slice(0, 300) ?? null,
		category: parsed.category,
		message: parsed.message,
		userAgent,
		status: "open",
	};

	try {
		await db.insert(siteReports).values(row);
	} catch (err) {
		console.error("[reports] insert failed", err);
		return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
	}

	return NextResponse.json({ ok: true });
}
