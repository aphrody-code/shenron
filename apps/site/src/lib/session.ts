import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { baAccount, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { ADMIN_COOKIE, adminTokenEnabled, verifyAdminCookie } from "@/lib/admin-token";

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

// Cache de la résolution token-admin (la valeur ne change jamais) → évite un
// aller-retour Neon à chaque requête, vu que la console admin poll toutes les 5 s.
let tokenAdminCache: { at: number; value: CurrentUser } | null = null;
const TOKEN_ADMIN_TTL = 60_000;
let warnedNoOwner = false;

/**
 * Résout l'admin par token (cookie signé valide). Mappe sur le user métier de
 * l'OWNER si `OWNER_ID` est connu (lecture d'abord, écriture seulement si la
 * ligne manque ou n'est pas encore admin) ; sinon renvoie un admin synthétique.
 * Mémoïsé 60 s. Cf. `@/lib/admin-token`.
 */
async function resolveTokenAdmin(): Promise<CurrentUser> {
	if (tokenAdminCache && Date.now() - tokenAdminCache.at < TOKEN_ADMIN_TTL) {
		return tokenAdminCache.value;
	}
	const ownerId = env.OWNER_ID;
	let value: CurrentUser;
	if (ownerId) {
		const [existing] = await db
			.select()
			.from(users)
			.where(eq(users.discordId, ownerId))
			.limit(1);
		let row = existing;
		// N'écrit QUE si nécessaire (ligne absente ou pas encore admin).
		if (!row || !row.roleAdmin) {
			const inserted = await db
				.insert(users)
				.values({
					discordId: ownerId,
					username: row?.username ?? "Admin (token)",
					avatar: row?.avatar ?? null,
					roleAdmin: true,
				})
				.onConflictDoUpdate({ target: users.discordId, set: { roleAdmin: true } })
				.returning();
			row = inserted[0] ?? row;
		}
		value = { sessionUserId: "token-admin", discordId: ownerId, user: row ?? null };
	} else {
		// Mode dégradé : sans OWNER_ID, pas de ligne `users` → les écritures
		// user-keyed (createTierlist/posts) échoueraient en FK. On garde l'accès
		// admin (lecture + proxy bot-admin) mais on avertit de configurer OWNER_ID.
		if (!warnedNoOwner) {
			console.warn("[auth] admin par token sans OWNER_ID : écritures user-keyed indisponibles.");
			warnedNoOwner = true;
		}
		const synthetic: SiteUser = {
			id: "token-admin",
			discordId: "",
			username: "Admin (token)",
			avatar: null,
			roleAdmin: true,
			createdAt: new Date(),
		};
		value = { sessionUserId: "token-admin", discordId: "", user: synthetic };
	}
	tokenAdminCache = { at: Date.now(), value };
	return value;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
	// Admin par token (sans Discord) — cookie signé httpOnly. Prioritaire et
	// no-op si la fonctionnalité est désactivée (SHENRON_ADMIN_TOKEN absent).
	if (adminTokenEnabled()) {
		const jar = await cookies();
		if (verifyAdminCookie(jar.get(ADMIN_COOKIE)?.value)) {
			return resolveTokenAdmin();
		}
	}

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
