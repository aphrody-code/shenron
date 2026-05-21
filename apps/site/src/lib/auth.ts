import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "../db/schema";
import { env } from "./env";

// URL canonique du site. `.trim()` + strip trailing slash = défense contre une
// valeur d'env polluée (ex. BETTER_AUTH_URL posée via `echo` qui ajoute un \n
// final → redirectURI "https://dbfr.vercel.app\n/api/auth/..." malformé →
// Discord rejette le callback). Ne jamais concaténer une env URL brute.
const SITE_URL = (env.BETTER_AUTH_URL ?? "https://dbfr.vercel.app")
	.trim()
	.replace(/\/+$/, "");

export const auth = betterAuth({
	appName: "DBFR",
	// Dynamic baseURL avec allowlist : sur Vercel chaque déploiement a son host
	// dbfr-xxxxxxxx-aphrody.vercel.app, et l'alias dbfr.vercel.app pointe vers
	// le dernier. Si on hardcode baseURL='https://dbfr.vercel.app' Better Auth
	// pose le cookie sur ce host mais sur preview deploy ça merdoie.
	// allowedHosts couvre prod + preview + dev → cookie domain = host courant.
	// Doc: https://better-auth.com/docs/guides/dynamic-base-url#vercel-deployment
	baseURL: {
		allowedHosts: [
			"shenron.rpbey.fr",
			"dbfr.vercel.app",
			"*.vercel.app",
			"localhost:3000",
		],
		protocol: "https",
		// Fallback = domaine canonique (cf. CLAUDE.md). Doit matcher SITE_URL et
		// le redirectURI Discord pour que le cookie de state OAuth soit posé et
		// relu sur le même host (sinon "invalid_state").
		fallback: SITE_URL,
	},

	basePath: "/api/auth",
	secret: env.BETTER_AUTH_SECRET,
	logger: { level: "debug" },
	// Capture explicite des erreurs d'API (sinon une exception au create user
	// ou à l'échange de code Discord est avalée → 302 vers errorURL sans trace).
	onAPIError: {
		throw: false,
		onError: (error: unknown, ctx) => {
			const e = error as { message?: string; stack?: string; cause?: unknown };
			const path = (ctx as unknown as { path?: string })?.path ?? "?";
			console.error(
				"[better-auth][API ERROR]",
				path,
				e?.message ?? String(error),
				e?.cause ? `cause=${JSON.stringify(e.cause)}` : "",
				e?.stack ?? "",
			);
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
		debugLogs: true,
		schema: {
			user: schema.baUser,
			session: schema.baSession,
			account: schema.baAccount,
			verification: schema.baVerification,
		},
	}),
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
			// Better Auth ajoute déjà 'identify email' implicit. On NE met PAS de
			// scopes ici sinon ils sont dupliqués dans l'URL OAuth (identify
			// identify email email guilds…) ce qui faisait foirer Discord en
			// returning prompt=consent_required. Les scopes guilds sont OK car
			// Discord les fusionne s'ils sont passés UNE seule fois.
			scope: ["guilds", "guilds.members.read"],
			// Redirect URI explicite — évite Better Auth de calculer depuis le
			// host de la requête (qui peut être un preview URL preview-*.vercel.app
			// au lieu de dbfr.vercel.app)
			redirectURI: `${SITE_URL}/api/auth/callback/discord`,
		},
	},
	// Login ouvert à tous les membres Discord — le site est public (suivi de
	// progression, commentaires). PAS de whitelist ici (≠ dashboard admin du bot
	// qui, lui, gate l'accès). L'élévation admin (roleAdmin) est décidée dans
	// lib/session.ts via OWNER_ID / OAUTH_ALLOWED_USERS.
	//
	// L'app User row est upsertée lazy depuis getCurrentUser() (lib/session.ts)
	// car databaseHooks.user.create.after se déclenche AVANT que le compte soit
	// commit dans ba_account → la jointure findFirst retournait null → User
	// table jamais peuplée. Le lazy upsert dans session.ts capture le bon
	// moment (premier appel post-login).
	trustedOrigins: [
		"https://shenron.rpbey.fr",
		"https://dbfr.vercel.app",
		"http://localhost:3000",
	],

	advanced: {
		// @ts-expect-error better-auth supporte trustProxy runtime mais types pas à jour (v1.6.x)
		trustProxy: true,
	},
});
