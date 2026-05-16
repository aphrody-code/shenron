import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { baAccount, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type SiteUser = typeof users.$inferSelect;

export type CurrentUser = {
	sessionUserId: string;
	discordId: string;
	user: SiteUser | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user) return null;

	const [row] = await db
		.select({ account: baAccount, user: users })
		.from(baAccount)
		.leftJoin(users, eq(users.discordId, baAccount.accountId))
		.where(
			and(
				eq(baAccount.userId, session.user.id),
				eq(baAccount.providerId, "discord"),
			),
		)
		.limit(1);

	if (!row?.account) return null;
	return {
		sessionUserId: session.user.id,
		discordId: row.account.accountId,
		user: row.user ?? null,
	};
}

export async function requireUser(callbackURL?: string): Promise<CurrentUser> {
	const me = await getCurrentUser();
	if (!me) {
		const cb = callbackURL
			? `?callbackURL=${encodeURIComponent(callbackURL)}`
			: "";
		redirect(`/api/auth/signin/social/discord${cb}`);
	}
	return me;
}

export async function requireAdmin(): Promise<
	CurrentUser & { user: SiteUser }
> {
	const me = await requireUser();
	if (!me.user?.roleAdmin) redirect("/");
	return me as CurrentUser & { user: SiteUser };
}

export async function isCurrentUserAdmin(): Promise<boolean> {
	const me = await getCurrentUser();
	return me?.user?.roleAdmin === true;
}
