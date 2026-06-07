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

/**
 * Pipeline auth admin — source unique de vérité.
 *
 * 1. Discord OAuth (Better Auth) → ba_user / ba_account / ba_session (Neon).
 * 2. getCurrentUser() lit la session, joint ba_account (provider discord) pour
 *    récupérer le Discord ID, puis upsert le user métier (`users`) en
 *    resynchronisant username/avatar et en calculant roleAdmin.
 * 3. requireAdmin() / isCurrentUserAdmin() gatent /admin/* et le proxy bot-admin.
 *
 * roleAdmin = OWNER_ID ou membre de OAUTH_ALLOWED_USERS (cf. env). Déterminé à
 * chaque requête (pas seulement à la création) → robuste aux changements d'env.
 */
function resolveRoleAdmin(discordId: string): boolean {
	return discordId === env.OWNER_ID || env.OAUTH_ALLOWED_USERS.includes(discordId);
}

// Mémoïsation in-process de la jointure ba_account→users, par sessionUserId.
// Évite un aller-retour Neon (us-east-1) sur chaque requête depuis cdg1 : sur une
// instance chaude (Fluid Compute), la 2e+ résolution est servie depuis la RAM.
// TTL court → un changement de roleAdmin/username se propage en ≤ 60 s.
const userResolveCache = new Map<string, { at: number; value: CurrentUser }>();
const USER_RESOLVE_TTL = 60_000;

export async function getCurrentUser(): Promise<CurrentUser | null> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user) return null;

	const cached = userResolveCache.get(session.user.id);
	if (cached && Date.now() - cached.at < USER_RESOLVE_TTL) return cached.value;

	// Compte Discord lié → fournit le Discord ID (= clé du user métier).
	const [row] = await db
		.select({ account: baAccount, user: users })
		.from(baAccount)
		.leftJoin(users, eq(users.discordId, baAccount.accountId))
		.where(and(eq(baAccount.userId, session.user.id), eq(baAccount.providerId, "discord")))
		.limit(1);

	// Session valide mais compte pas encore lié (race au tout premier login) :
	// on renvoie la session sans user métier ; ça se résout au call suivant.
	if (!row?.account) {
		return { sessionUserId: session.user.id, discordId: "", user: null };
	}

	const discordId = row.account.accountId;
	const shouldBeAdmin = resolveRoleAdmin(discordId);
	const wantUsername = session.user.name ?? "Saiyan";
	const wantAvatar = session.user.image ?? null;

	// Upsert/resync : crée le user métier au 1er passage, et garde
	// username/avatar/roleAdmin alignés ensuite (resync si divergence).
	let appUser = row.user;
	const needsSync =
		!appUser ||
		appUser.username !== wantUsername ||
		appUser.avatar !== wantAvatar ||
		(shouldBeAdmin && !appUser.roleAdmin);

	if (needsSync) {
		const wasAdmin = appUser?.roleAdmin === true;
		const inserted = await db
			.insert(users)
			.values({
				discordId,
				username: wantUsername,
				avatar: wantAvatar,
				roleAdmin: shouldBeAdmin,
			})
			.onConflictDoUpdate({
				target: users.discordId,
				set: {
					username: wantUsername,
					avatar: wantAvatar,
					// On n'élève jamais à false ici (révocation = manuelle) ; on
					// élève à true si l'env le dit.
					...(shouldBeAdmin ? { roleAdmin: true } : {}),
				},
			})
			.returning();
		appUser = inserted[0] ?? appUser;
		if (shouldBeAdmin && !wasAdmin) {
			console.info(`[auth] admin élevé : discordId=${discordId}`);
		}
	}

	const result: CurrentUser = {
		sessionUserId: session.user.id,
		discordId,
		user: appUser,
	};
	userResolveCache.set(session.user.id, { at: Date.now(), value: result });
	return result;
}

export async function requireUser(callbackURL?: string): Promise<CurrentUser> {
	const me = await getCurrentUser();
	if (!me) {
		const cb = callbackURL ? `?callbackURL=${encodeURIComponent(callbackURL)}` : "";
		redirect(`/signin${cb}`);
	}
	return me;
}

export async function requireAdmin(): Promise<CurrentUser & { user: SiteUser }> {
	const me = await requireUser();
	if (!me.user?.roleAdmin) redirect("/");
	return me as CurrentUser & { user: SiteUser };
}

export async function isCurrentUserAdmin(): Promise<boolean> {
	const me = await getCurrentUser();
	return me?.user?.roleAdmin === true;
}
