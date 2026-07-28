/**
 * /api/banner-config — bannières des pages wiki/catalogues (server-only, gate admin).
 *
 *   GET → { banners }           config résolue
 *   PUT → { ok, banners }       upsert singleton + revalidate des pages touchées
 */
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/session";
import { getPageBanners, savePageBanners } from "@/lib/banner-config";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const forbidden = () => NextResponse.json({ error: "Forbidden" }, { status: 403 });
const badRequest = (msg: string) => NextResponse.json({ error: msg }, { status: 400 });

/** Paths publics impactés par une bannière (ISR). */
const REVALIDATE_PATHS = [
	"/wiki/episodes",
	"/wiki/films",
	"/wiki/chronologie",
	"/wiki/personnages",
	"/wiki/sagas",
	"/wiki/arcs",
	"/wiki/races",
	"/wiki/transformations",
	"/wiki/dragon-ball/techniques",
	"/wiki/jeux",
	"/wiki/manga",
	"/wiki/databooks",
	"/wiki/news",
	"/wiki/tools",
	"/actualites",
	"/jeux/2048",
];

export async function GET() {
	if (!(await isCurrentUserAdmin())) return forbidden();
	return NextResponse.json({ banners: await getPageBanners() });
}

export async function PUT(req: NextRequest) {
	const me = await getCurrentUser();
	if (!me?.user?.roleAdmin) return forbidden();
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return badRequest("JSON body requis");
	}
	try {
		const banners = await savePageBanners(body, me.discordId || me.user.id);
		for (const p of REVALIDATE_PATHS) {
			try {
				revalidatePath(p);
			} catch {
				/* best-effort */
			}
		}
		// Layout racine (nav / segments partagés).
		try {
			revalidatePath("/", "layout");
		} catch {
			/* best-effort */
		}
		return NextResponse.json({ ok: true, banners });
	} catch (err) {
		return badRequest(err instanceof Error ? err.message : "erreur");
	}
}
