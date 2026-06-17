import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

/**
 * Admin par token — accès admin du site SANS Discord OAuth.
 *
 * Filet de sécurité (ex. perte d'accès Discord) : l'admin saisit le
 * `SHENRON_ADMIN_TOKEN` (même secret que le dashboard du bot) sur `/admin-access`.
 * On pose alors un cookie httpOnly **signé** (HMAC `BETTER_AUTH_SECRET`) que
 * `getCurrentUser()` reconnaît pour élever la session en admin.
 *
 * Sécurité :
 *  - comparaison du token en temps constant (`timingSafeEqual`) ;
 *  - le cookie ne contient JAMAIS le token, seulement `expiry.hmac` — non
 *    rejouable après expiration, non forgeable sans le secret serveur ;
 *  - la signature est **liée à l'empreinte du token courant** : faire tourner
 *    `SHENRON_ADMIN_TOKEN` invalide instantanément tous les cookies émis (vraie
 *    réponse à incident) ;
 *  - si `SHENRON_ADMIN_TOKEN` n'est pas configuré, la fonctionnalité est
 *    entièrement désactivée (aucun cookie accepté ni émis).
 */

export const ADMIN_COOKIE = "dbfr_admin";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours (cookie porteur de droits admin)
export const ADMIN_COOKIE_MAX_AGE = Math.floor(TTL_MS / 1000);

/** Empreinte non réversible du token courant : la rotation du token la change. */
function tokenFingerprint(): string {
	return createHash("sha256")
		.update(env.SHENRON_ADMIN_TOKEN ?? "")
		.digest("hex")
		.slice(0, 16);
}

function sign(expiry: number): string {
	return createHmac("sha256", env.BETTER_AUTH_SECRET)
		.update(`admin:${expiry}:${tokenFingerprint()}`)
		.digest("hex");
}

function safeEqual(a: string, b: string): boolean {
	const ab = Buffer.from(a);
	const bb = Buffer.from(b);
	if (ab.length !== bb.length) return false;
	return timingSafeEqual(ab, bb);
}

/** L'accès admin par token est-il activé côté serveur ? */
export function adminTokenEnabled(): boolean {
	return !!env.SHENRON_ADMIN_TOKEN;
}

/** Vrai si `input` == `SHENRON_ADMIN_TOKEN` (temps constant). */
export function tokenMatches(input: string): boolean {
	const t = env.SHENRON_ADMIN_TOKEN;
	if (!t || !input) return false;
	return safeEqual(input, t);
}

/** Valeur du cookie signé à poser après un login token réussi. */
export function buildAdminCookieValue(): string {
	const exp = Date.now() + TTL_MS;
	return `${exp}.${sign(exp)}`;
}

/** Vérifie un cookie admin : non expiré + signature valide. */
export function verifyAdminCookie(value: string | undefined | null): boolean {
	if (!value || !adminTokenEnabled()) return false;
	const dot = value.indexOf(".");
	if (dot < 1) return false;
	const exp = Number(value.slice(0, dot));
	const sig = value.slice(dot + 1);
	if (!Number.isFinite(exp) || exp < Date.now()) return false;
	return safeEqual(sig, sign(exp));
}
