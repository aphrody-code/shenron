/**
 * Résolution admin **directe** pour le proxy (`proxy.ts`), sans aller-retour
 * réseau vers `/api/me`.
 *
 * Historique : le proxy faisait `fetch("/api/me")` sur `request.nextUrl.origin`.
 * Côté VPS, cet origin est en `http://` (connexion interne nginx→Next) → nginx
 * répond `301 → https` et undici (fetch Node) **droppe l'en-tête Cookie** au
 * changement de schéma (origin cross) → `/api/me` ne voit plus la session → admin
 * traité comme anonyme et redirigé vers l'accueil (bug « je ne vois pas les pages
 * wiki/tierlist en tant qu'admin »). En prime : rate-limit nginx `/api/`, TLS et
 * timeout 2500 ms fail-closed.
 *
 * Le proxy Next 16 tourne en **runtime Node.js** (cf. docs `proxy.md` : « Proxy
 * defaults to using the Node.js runtime ») → on peut lire la session Better Auth
 * et la DB Postgres directement, en process, à partir des en-têtes/cookies de la
 * requête (jamais `next/headers`, indispo dans le proxy). Zéro réseau, zéro nginx.
 *
 * Miroir volontaire de `resolveRoleAdmin` (`lib/session.ts`) : token admin OU
 * `roleAdmin` persisté OU Discord ∈ `OWNER_ID`/`OAUTH_ALLOWED_USERS`.
 */
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { baAccount, users } from "@/db/schema";
import { env } from "@/lib/env";
import { ADMIN_COOKIE, verifyAdminCookie } from "@/lib/admin-token";

export interface Visitor {
	/** Staff du site (token admin, `roleAdmin`, owner ou allowlist env). */
	isAdmin: boolean;
	/** Session Better Auth valide (compte lié, pas forcément Discord). */
	authenticated: boolean;
	/** Snowflake Discord lié à la session — nécessaire au gating par rôle. */
	discordId: string | null;
}

/**
 * Identité du visiteur en UN passage : le gating par rôle a besoin du couple
 * (staff ?, quel Discord ?), et refaire deux fois la lecture de session +
 * jointure `baAccount` doublerait le coût sur le hot-path du proxy.
 */
export async function resolveVisitor(request: NextRequest): Promise<Visitor> {
	// 1) Admin par token (cookie signé HMAC) — aucune I/O DB, aucune identité Discord.
	if (verifyAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value)) {
		return { isAdmin: true, authenticated: true, discordId: null };
	}

	// 2) Session Discord (Better Auth) lue depuis les en-têtes de la requête.
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session?.user) return { isAdmin: false, authenticated: false, discordId: null };

	// Discord ID lié → clé du user métier (roleAdmin) et de l'allowlist env.
	const [row] = await db
		.select({ discordId: baAccount.accountId, roleAdmin: users.roleAdmin })
		.from(baAccount)
		.leftJoin(users, eq(users.discordId, baAccount.accountId))
		.where(and(eq(baAccount.userId, session.user.id), eq(baAccount.providerId, "discord")))
		.limit(1);
	if (!row) return { isAdmin: false, authenticated: true, discordId: null };

	const isAdmin =
		row.roleAdmin === true ||
		row.discordId === env.OWNER_ID ||
		env.OAUTH_ALLOWED_USERS.includes(row.discordId);

	return { isAdmin, authenticated: true, discordId: row.discordId ?? null };
}

export async function isRequestAdmin(request: NextRequest): Promise<boolean> {
	return (await resolveVisitor(request)).isAdmin;
}
