import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	tablesFilter: [
		"Post",
		"User",
		"Comment",
		"WikiCategory",
		"WikiPage",
		"ba_user",
		"ba_session",
		"ba_account",
		"ba_verification",
		"site_events",
		"user_preferences"
	],
	verbose: true,
	strict: true,
});
