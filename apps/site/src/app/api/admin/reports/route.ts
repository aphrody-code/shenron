/**
 * /api/admin/reports — back-office des signalements utilisateurs (tickets).
 * Gated admin (isCurrentUserAdmin). Données côté site (Postgres `public`), lues
 * directement via Drizzle (pas le proxy bot).
 *
 *   GET    ?status=open|in_progress|resolved|closed|all  → { items, counts }
 *   PATCH  { id, status?, adminNote? }                    → { ok, row }
 *   DELETE ?id=…                                          → { ok }
 */
import { NextResponse, type NextRequest } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteReports } from "@/db/schema";
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/session";
import { REPORT_STATUS_KEYS, type ReportRow } from "@/lib/report-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toRow(r: typeof siteReports.$inferSelect): ReportRow {
	return {
		id: r.id,
		createdAt: r.createdAt.toISOString(),
		updatedAt: r.updatedAt.toISOString(),
		userId: r.userId,
		discordId: r.discordId,
		username: r.username,
		path: r.path,
		pageTitle: r.pageTitle,
		category: r.category,
		message: r.message,
		userAgent: r.userAgent,
		status: r.status,
		adminNote: r.adminNote,
		resolvedBy: r.resolvedBy,
		resolvedAt: r.resolvedAt ? r.resolvedAt.toISOString() : null,
	};
}

export async function GET(req: NextRequest): Promise<NextResponse> {
	if (!(await isCurrentUserAdmin())) {
		return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
	}
	const statusParam = req.nextUrl.searchParams.get("status") ?? "all";
	try {
		const rows = await db
			.select()
			.from(siteReports)
			.where(
				statusParam !== "all" && REPORT_STATUS_KEYS.includes(statusParam as never)
					? eq(siteReports.status, statusParam)
					: undefined
			)
			.orderBy(desc(siteReports.createdAt))
			.limit(500);

		// Comptage par statut (badges de filtres), toutes lignes confondues.
		const grouped = await db
			.select({ status: siteReports.status, n: sql<number>`count(*)::int` })
			.from(siteReports)
			.groupBy(siteReports.status);
		const counts: Record<string, number> = { all: 0 };
		for (const g of grouped) {
			counts[g.status] = Number(g.n);
			counts.all += Number(g.n);
		}

		return NextResponse.json(
			{ ok: true, items: rows.map(toRow), counts },
			{ headers: { "cache-control": "no-store" } }
		);
	} catch (err) {
		console.error("[admin/reports] query failed", err);
		return NextResponse.json({ ok: false, error: "query_failed" }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
	if (!(await isCurrentUserAdmin())) {
		return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
	}
	let body: { id?: string; status?: string; adminNote?: string };
	try {
		body = (await req.json()) as typeof body;
	} catch {
		return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
	}
	const id = body.id;
	if (!id) return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 });

	const patch: Partial<typeof siteReports.$inferInsert> = { updatedAt: new Date() };
	if (typeof body.status === "string") {
		if (!REPORT_STATUS_KEYS.includes(body.status as never)) {
			return NextResponse.json({ ok: false, error: "bad_status" }, { status: 400 });
		}
		patch.status = body.status;
		// Trace de résolution quand on passe en résolu/fermé.
		if (body.status === "resolved" || body.status === "closed") {
			patch.resolvedAt = new Date();
			const me = await getCurrentUser().catch(() => null);
			patch.resolvedBy = me?.user?.username ?? me?.user?.id ?? "admin";
		} else {
			patch.resolvedAt = null;
			patch.resolvedBy = null;
		}
	}
	if (typeof body.adminNote === "string") {
		patch.adminNote = body.adminNote.slice(0, 2000) || null;
	}

	try {
		const [row] = await db
			.update(siteReports)
			.set(patch)
			.where(eq(siteReports.id, id))
			.returning();
		if (!row) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
		return NextResponse.json({ ok: true, row: toRow(row) });
	} catch (err) {
		console.error("[admin/reports] update failed", err);
		return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
	if (!(await isCurrentUserAdmin())) {
		return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
	}
	const id = req.nextUrl.searchParams.get("id");
	if (!id) return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 });
	try {
		await db.delete(siteReports).where(eq(siteReports.id, id));
		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error("[admin/reports] delete failed", err);
		return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
	}
}
