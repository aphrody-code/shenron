/**
 * Debug auth endpoint — temporaire, à supprimer une fois login stable.
 * Retourne en JSON : cookies présents, session better-auth, profil DB.
 * Permet de diagnostiquer si le cookie est bien set après OAuth Discord.
 */
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { baUser, baAccount, baSession, users } from "@/db/schema";
import { count } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
	const h = await headers();
	const c = await cookies();
	const cookieList = c.getAll().map((ck) => ({
		name: ck.name,
		valueLen: ck.value.length,
		valuePreview: ck.value.slice(0, 12) + "…",
	}));

	let session: unknown = null;
	let sessionErr: string | null = null;
	try {
		session = await auth.api.getSession({ headers: h });
	} catch (e) {
		sessionErr = e instanceof Error ? e.message : String(e);
	}

	const stats = {
		ba_user: (await db.select({ c: count() }).from(baUser))[0]?.c ?? 0,
		ba_account: (await db.select({ c: count() }).from(baAccount))[0]?.c ?? 0,
		ba_session: (await db.select({ c: count() }).from(baSession))[0]?.c ?? 0,
		User: (await db.select({ c: count() }).from(users))[0]?.c ?? 0,
	};

	return NextResponse.json(
		{
			cookies: cookieList,
			sessionCookieFound: cookieList.some((ck) =>
				ck.name.includes("better-auth"),
			),
			session,
			sessionErr,
			db: stats,
			host: h.get("host"),
			xForwardedHost: h.get("x-forwarded-host"),
		},
		{ headers: { "Cache-Control": "no-store" } },
	);
}
