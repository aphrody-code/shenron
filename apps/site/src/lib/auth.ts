import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "../db/schema";
import { env } from "./env";

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
			"dbfr.vercel.app",
			"*.vercel.app",
			"localhost:3000",
			"localhost:5173",
		],
		protocol: "https",
		fallback: "https://dbfr.vercel.app",
	},
	basePath: "/api/auth",
	secret: env.BETTER_AUTH_SECRET,
	// Logger debug : on log TOUT pour diagnostiquer le flow OAuth Discord
	// (sera réduit à 'warn' une fois login confirmé stable).
	logger: {
		disabled: false,
		level: "debug",
		log: (level, message, ...args) => {
			console.log(
				`[AUTH ${level}] ${message}`,
				JSON.stringify(args).slice(0, 500),
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
			redirectURI: `${env.BETTER_AUTH_URL ?? "https://dbfr.vercel.app"}/api/auth/callback/discord`,
		},
	},
	// L'app User row est upsertée lazy depuis getCurrentUser() (lib/session.ts)
	// car databaseHooks.user.create.after se déclenche AVANT que le compte soit
	// commit dans ba_account → la jointure findFirst retournait null → User
	// table jamais peuplée. Le lazy upsert dans session.ts capture le bon
	// moment (premier appel post-login).
	trustedOrigins: ["https://dbfr.vercel.app", "http://localhost:3000"],
	advanced: {
		// @ts-expect-error better-auth supporte trustProxy runtime mais types pas à jour (v1.6.x)
		trustProxy: true,
	},
});
