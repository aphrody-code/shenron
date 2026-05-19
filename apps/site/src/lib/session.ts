import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { baAccount, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

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

	// Si pas d'account discord lié (premier login en cours, race avec hook),
	// on retourne quand même le session.user pour ne pas casser le state UI.
	if (!row?.account) {
		return {
			sessionUserId: session.user.id,
			discordId: "",
			user: null,
		};
	}

	// Lazy upsert dans `users` si le hook databaseHooks n'a pas tourné (timing).
	let appUser = row.user;
	const isOwner = row.account.accountId === env.OWNER_ID;
	const isAllowed = env.OAUTH_ALLOWED_USERS.includes(row.account.accountId);
	const shouldBeAdmin = isOwner || isAllowed;

	if (!appUser || (shouldBeAdmin && !appUser.roleAdmin)) {
		const inserted = await db
			.insert(users)
			.values({
				discordId: row.account.accountId,
				username: session.user.name ?? "Saiyan",
				avatar: session.user.image ?? null,
				roleAdmin: shouldBeAdmin,
			})
			.onConflictDoUpdate({
				target: users.discordId,
				set: {
					username: session.user.name ?? "Saiyan",
					avatar: session.user.image ?? null,
					...(shouldBeAdmin ? { roleAdmin: true } : {}),
				},
			})
			.returning();
		appUser = inserted[0] ?? null;
	}

	return {
		sessionUserId: session.user.id,
		discordId: row.account.accountId,
		user: appUser,
	};
}

export async function requireUser(callbackURL?: string): Promise<CurrentUser> {
	const me = await getCurrentUser();
	if (!me) {
		const cb = callbackURL
			? `?callbackURL=${encodeURIComponent(callbackURL)}`
			: "";
		redirect(`/signin${cb}`);
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
