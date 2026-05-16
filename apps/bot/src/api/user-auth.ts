/**
 * Auth user-acting pour les routes de jeu accessibles depuis le site.
 *
 * Flow :
 *   site (Next, server-side)
 *     → vérifie session Better Auth → récupère discordId
 *     → signe `${discordId}:${timestampMs}` via HMAC-SHA256(API_USER_SECRET)
 *     → POST bot avec headers :
 *         X-Acting-User: <discordId>
 *         X-Acting-Ts:   <timestampMs>
 *         X-Acting-Sig:  <hex sig>
 *
 * Le bot vérifie : signature valide, timestamp dans une fenêtre ±5min
 * (anti-replay). Retourne `discordId` ou `null`.
 *
 * Note : cette auth NE remplace PAS Bearer admin. Les routes admin restent
 * gated par `checkAdmin()`. Les routes user-only doivent appeler
 * `verifyActingUser(req)`.
 */
import { env } from "~/lib/env";
import { logger } from "~/lib/logger";

const SKEW_MS = 5 * 60 * 1000;

function hmacHex(secret: string, msg: string): string {
	const hasher = new Bun.CryptoHasher("sha256", secret);
	hasher.update(msg);
	return hasher.digest("hex");
}

function constantTimeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let r = 0;
	for (let i = 0; i < a.length; i++) {
		r |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return r === 0;
}

/** Retourne le `discordId` de l'utilisateur agissant, ou null si invalide. */
export function verifyActingUser(req: Request): string | null {
	if (!env.API_USER_SECRET) {
		logger.warn("API_USER_SECRET non configuré — routes user-auth désactivées");
		return null;
	}
	const userId = req.headers.get("x-acting-user");
	const tsRaw = req.headers.get("x-acting-ts");
	const sig = req.headers.get("x-acting-sig");
	if (!userId || !tsRaw || !sig) return null;
	if (!/^\d{17,20}$/.test(userId)) return null;
	const ts = Number(tsRaw);
	if (!Number.isFinite(ts)) return null;
	if (Math.abs(Date.now() - ts) > SKEW_MS) return null;
	const expected = hmacHex(env.API_USER_SECRET, `${userId}:${ts}`);
	if (!constantTimeEqual(expected, sig.toLowerCase())) return null;
	return userId;
}
