import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "../db/schema";
import { env } from "./env";

// URL canonique du site. `.trim()` + strip trailing slash = défense contre une
// valeur d'env polluée (ex. BETTER_AUTH_URL posée via `echo` qui ajoute un \n
// final → redirectURI "https://dbfr.vercel.app\n/api/auth/..." malformé →
// Discord rejette le callback). Ne jamais concaténer une env URL brute.
const SITE_URL = (env.BETTER_AUTH_URL ?? "https://dragonballfr.com").trim().replace(/\/+$/, "");

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
			"dragonballfr.com",
			"www.dragonballfr.com",
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
	// Cache de session signé en cookie : getSession lit le cookie au lieu de
	// taper ba_session sur Neon (us-east-1) à CHAQUE requête. Avec les fonctions
	// pinnées en cdg1 (Paris, loin de Neon US), c'est ce qui évite un aller-retour
	// transatlantique par appel admin. maxAge 5 min = fraîcheur roleAdmin acceptable.
	session: {
		cookieCache: { enabled: true, maxAge: 5 * 60 },
	},
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
				e?.stack ?? ""
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
			// CRITIQUE : sans ça, Better Auth émet `prompt=none` → Discord renvoie
			// `consent_required` pour tout utilisateur qui n'a jamais autorisé
			// l'app (= 100 % des nouveaux) → AUCUN login possible (ba_user=0).
			// `consent` force l'écran d'autorisation, qui marche pour tout le monde.
			prompt: "consent",
			// Email Discord parfois null (comptes phone-only) → fallback sur l'ID
			// snowflake pour ne pas planter sur `email_not_found`.
			mapProfileToUser: (profile: { id: string; email?: string | null }) => ({
				email: profile.email ?? `${profile.id}@discord.placeholder.local`,
			}),
			// Pas de redirectURI hardcodé : il est calculé depuis le baseURL
			// dynamique (host courant ∈ allowedHosts). Indispensable pour que le
			// login fonctionne aussi bien sur shenron.rpbey.fr que dbfr.vercel.app —
			// le cookie de state OAuth est posé ET relu sur le MÊME host (sinon
			// "invalid_state" en cross-domain). Le callback de chaque host doit être
			// déclaré côté Discord Developer Portal (Redirects).
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
		"https://dragonballfr.com",
		"https://www.dragonballfr.com",
		"https://shenron.rpbey.fr",
		"https://dbfr.vercel.app",
		"http://localhost:3000",
	],

	advanced: {
		// @ts-expect-error better-auth supporte trustProxy runtime mais types pas à jour (v1.6.x)
		trustProxy: true,
	},
});
