"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Client Better Auth — utilisé dans les composants client uniquement.
 *
 * `baseURL` explicite : Better Auth doit connaître l'origine pour construire
 * les URLs OAuth. Sans ça, en SSR/build ou edge runtime, ça peut pointer
 * vers le mauvais host et provoquer des redirects en boucle.
 *
 * On lit `window.location.origin` en runtime (composant client), fallback
 * NEXT_PUBLIC_SITE_URL ou dbfr.vercel.app pour le SSR initial.
 */
const baseURL =
	typeof window !== "undefined"
		? window.location.origin
		: (Bun.env.NEXT_PUBLIC_SITE_URL ?? "https://shenron.rpbey.fr");
export const authClient = createAuthClient({
	baseURL,
});
