/**
 * Proxy générique /api/bot-admin/* → shenron bot REST API (Bearer).
 * Sécurise le SHENRON_ADMIN_TOKEN côté server (jamais leak au browser).
 * Refuse l'accès sans session admin (NextAuth + DB User.roleAdmin).
 */
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const API = process.env.SHENRON_API_URL ?? "https://shenron.rpbey.fr";
const TOKEN = process.env.SHENRON_ADMIN_TOKEN ?? "";

export const runtime = "nodejs";

async function isAdmin(): Promise<boolean> {
	const session = await auth();
	if (!session?.user) return false;
	const discordId = (session.user as { id?: string }).id;
	if (!discordId) return false;
	const user = await db.query.users.findFirst({
		where: (u, { eq }) => eq(u.discordId, discordId),
	});
	return user?.roleAdmin === true;
}

async function proxy(
	req: NextRequest,
	ctx: { params: Promise<{ path: string[] }> },
) {
	if (!(await isAdmin())) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
	const { path } = await ctx.params;
	const url = `${API}/api/${path.join("/")}${req.nextUrl.search}`;
	const body =
		req.method === "GET" || req.method === "HEAD"
			? undefined
			: await req.text().catch(() => undefined);
	const res = await fetch(url, {
		method: req.method,
		body,
		headers: {
			authorization: `Bearer ${TOKEN}`,
			"content-type": req.headers.get("content-type") ?? "application/json",
			accept: "application/json",
		},
		cache: "no-store",
	});
	const text = await res.text();
	return new NextResponse(text, {
		status: res.status,
		headers: {
			"content-type": res.headers.get("content-type") ?? "application/json",
		},
	});
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
