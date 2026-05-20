import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Env typé site (Next 16). Validation au boot, échec rapide en prod.
 * Toutes les vars utilisées dans `apps/site` doivent passer ici — interdire
 * `process.env.X` direct dans le reste du code.
 */
export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.string().url().optional(),
		DISCORD_CLIENT_ID: z.string().min(10),
		DISCORD_CLIENT_SECRET: z.string().min(10),
		SHENRON_API_URL: z.string().url().default("https://shenron.rpbey.fr"),
		SHENRON_ADMIN_TOKEN: z.string().min(16).optional(),
		SHENRON_USER_SECRET: z.string().min(32).optional(),
		OWNER_ID: z.string().regex(/^\d{17,20}$/).optional(),
		OAUTH_ALLOWED_USERS: z
			.string()
			.optional()
			.transform((v) =>
				v
					? v
							.split(",")
							.map((s) => s.trim())
							.filter(Boolean)
					: [],
			),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
	},
	client: {
		NEXT_PUBLIC_SHENRON_ASSETS_URL: z.string().url().optional(),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_SHENRON_ASSETS_URL: process.env.NEXT_PUBLIC_SHENRON_ASSETS_URL,
	},
	// Skip validation au build (Vercel injecte les env vars au runtime,
	// pas toutes en build-time). Le runtime crash de toute façon si une
	// var manque (auth(), db(), etc. throwent leurs propres erreurs).
	skipValidation:
		process.env.SKIP_ENV_VALIDATION === "1" ||
		process.env.npm_lifecycle_event === "lint" ||
		process.env.npm_lifecycle_event === "build" ||
		process.env.NEXT_PHASE === "phase-production-build",
	emptyStringAsUndefined: true,
});
