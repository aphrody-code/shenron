/**
 * /api/wiki-admin/* — CRUD **direct sur Neon** (schéma `bot`) pour le wiki
 * éditorial Dragon Ball. Remplace le proxy `/api/bot-admin/database/:table` pour
 * les tables dont Neon est la source de vérité (cf. `WIKI_TABLES`).
 *
 * Server-only : importe `wiki-admin.ts` (Drizzle/Postgres) → jamais bundlé côté
 * client. Gate admin via Better Auth + `users.roleAdmin` (`isCurrentUserAdmin`).
 *
 * Contrat aligné sur l'API bot `/api/database` pour réutiliser les composants
 * Client verbatim :
 *   GET    /:table?limit&offset  → { rows, total, limit, offset }
 *   GET    /:table/:id           → row (objet brut, camelCase) | 404
 *   POST   /:table               → { ok: true, row }
 *   PUT    /:table/:id           → { ok: true, row }
 *   PATCH  /:table/:id           → { ok: true, row }
 *   DELETE /:table/:id           → { ok: true }
 */
import { isCurrentUserAdmin } from "@/lib/session";
import {
	deleteWiki,
	getWikiRow,
	insertWiki,
	isWikiTable,
	listWiki,
	listWikiOptions,
	listWikiRelations,
	updateWiki,
} from "@/lib/wiki-admin";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path: string[] }> };

const forbidden = () => NextResponse.json({ error: "Forbidden" }, { status: 403 });
const notFound = (msg = "Table inconnue") => NextResponse.json({ error: msg }, { status: 404 });
const badRequest = (msg: string) => NextResponse.json({ error: msg }, { status: 400 });

async function readJson(req: NextRequest): Promise<Record<string, unknown> | null> {
	try {
		return (await req.json()) as Record<string, unknown>;
	} catch {
		return null;
	}
}

export async function GET(req: NextRequest, ctx: Ctx) {
	if (!(await isCurrentUserAdmin())) return forbidden();
	const { path } = await ctx.params;
	const [table, id] = path;
	if (!table || !isWikiTable(table)) return notFound();

	try {
		if (id != null) {
			const row = await getWikiRow(table, decodeURIComponent(id));
			if (!row) return notFound("Row introuvable");
			return NextResponse.json(row);
		}
		const sp = req.nextUrl.searchParams;
		// Picker FK : pk + libellé seulement (léger, trié, non tronqué à 500).
		if (sp.get("as") === "options") {
			return NextResponse.json({ options: await listWikiOptions(table) });
		}
		// Relations N-N : ids liés dans une table de jointure.
		if (sp.get("as") === "relations") {
			const col = sp.get("col") ?? "";
			const relId = sp.get("id") ?? "";
			const target = sp.get("target") ?? "";
			if (!col || !relId || !target) return badRequest("col, id, target requis");
			return NextResponse.json({ ids: await listWikiRelations(table, col, relId, target) });
		}
		const limit = Number(sp.get("limit")) || 50;
		const offset = Number(sp.get("offset")) || 0;
		return NextResponse.json(await listWiki(table, { limit, offset }));
	} catch (err) {
		return badRequest(err instanceof Error ? err.message : "erreur");
	}
}

export async function POST(req: NextRequest, ctx: Ctx) {
	if (!(await isCurrentUserAdmin())) return forbidden();
	const { path } = await ctx.params;
	const [table] = path;
	if (!table || !isWikiTable(table)) return notFound();
	const body = await readJson(req);
	if (!body) return badRequest("JSON body requis");
	try {
		const row = await insertWiki(table, body);
		return NextResponse.json({ ok: true, row });
	} catch (err) {
		return badRequest(err instanceof Error ? err.message : "erreur");
	}
}

async function mutate(req: NextRequest, ctx: Ctx) {
	if (!(await isCurrentUserAdmin())) return forbidden();
	const { path } = await ctx.params;
	const [table, id] = path;
	if (!table || !isWikiTable(table)) return notFound();
	if (id == null) return badRequest("id requis");
	const body = await readJson(req);
	if (!body) return badRequest("JSON body requis");
	try {
		const row = await updateWiki(table, decodeURIComponent(id), body);
		return NextResponse.json({ ok: true, row });
	} catch (err) {
		return badRequest(err instanceof Error ? err.message : "erreur");
	}
}

export const PUT = mutate;
export const PATCH = mutate;

export async function DELETE(req: NextRequest, ctx: Ctx) {
	if (!(await isCurrentUserAdmin())) return forbidden();
	const { path } = await ctx.params;
	const [table, id] = path;
	if (!table || !isWikiTable(table)) return notFound();
	if (id == null) return badRequest("id requis");
	try {
		await deleteWiki(table, decodeURIComponent(id));
		return NextResponse.json({ ok: true });
	} catch (err) {
		return badRequest(err instanceof Error ? err.message : "erreur");
	}
}
