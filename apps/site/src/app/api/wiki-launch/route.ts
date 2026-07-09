/**
 * /api/wiki-launch — catégories wiki ouvertes au public (gate admin).
 *
 *   GET → { openKeys }         clés ouvertes (inclut les bêta verrouillées)
 *   PUT → { ok, openKeys }     enregistre + revalide le layout (nav/teaser/gating)
 */
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/session";
import { getOpenCategoryKeys, saveOpenCategoryKeys } from "@/lib/wiki-launch-config";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const forbidden = () => NextResponse.json({ error: "Forbidden" }, { status: 403 });

export async function GET() {
	if (!(await isCurrentUserAdmin())) return forbidden();
	return NextResponse.json({ openKeys: await getOpenCategoryKeys() });
}

export async function PUT(req: NextRequest) {
	const me = await getCurrentUser();
	if (!me?.user?.roleAdmin) return forbidden();
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "JSON body requis" }, { status: 400 });
	}
	const keys = Array.isArray((body as { openKeys?: unknown })?.openKeys)
		? ((body as { openKeys: unknown[] }).openKeys.filter((k) => typeof k === "string") as string[])
		: null;
	if (!keys) return NextResponse.json({ error: "openKeys[] attendu" }, { status: 400 });
	const openKeys = await saveOpenCategoryKeys(keys, me.discordId || me.user.id);
	// Le gating/nav/teaser lisent la config dans le layout → revalide tout le site.
	revalidatePath("/", "layout");
	return NextResponse.json({ ok: true, openKeys });
}
