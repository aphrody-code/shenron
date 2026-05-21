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

	// Upsert dans `users` (le hook databaseHooks a été retiré, cf. auth.ts).
	// On resynchronise username + avatar dès qu'ils diffèrent de la session
	// Discord — sinon un user créé avant l'ajout de l'avatar (ou qui change de
	// photo Discord) reste sans photo, car l'ancienne condition `!appUser`
	// sautait la mise à jour pour un user déjà existant.
	let appUser = row.user;
	const isOwner = row.account.accountId === env.OWNER_ID;
	const isAllowed = env.OAUTH_ALLOWED_USERS.includes(row.account.accountId);
	const shouldBeAdmin = isOwner || isAllowed;

	const wantUsername = session.user.name ?? "Saiyan";
	const wantAvatar = session.user.image ?? null;
	const needsSync =
		!appUser ||
		appUser.username !== wantUsername ||
		appUser.avatar !== wantAvatar ||
		(shouldBeAdmin && !appUser.roleAdmin);

	if (needsSync) {
		const inserted = await db
			.insert(users)
			.values({
				discordId: row.account.accountId,
				username: wantUsername,
				avatar: wantAvatar,
				roleAdmin: shouldBeAdmin,
			})
			.onConflictDoUpdate({
				target: users.discordId,
				set: {
					username: wantUsername,
					avatar: wantAvatar,
					...(shouldBeAdmin ? { roleAdmin: true } : {}),
				},
			})
			.returning();
		appUser = inserted[0] ?? appUser;
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
