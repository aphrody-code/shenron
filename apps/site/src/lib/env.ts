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
	// En dev/build SSG sans vraie DB on skip pour ne pas casser CI.
	skipValidation:
		process.env.SKIP_ENV_VALIDATION === "1" ||
		process.env.npm_lifecycle_event === "lint",
	emptyStringAsUndefined: true,
});
