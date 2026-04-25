import { z } from "zod";

const schema = z.object({
	DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN is required"),
	GUILD_ID: z
		.string()
		.regex(/^\d{17,20}$/, "GUILD_ID must be a Discord snowflake"),
	OWNER_ID: z
		.string()
		.regex(/^\d{17,20}$/, "OWNER_ID must be a Discord snowflake"),
	BOT_DEV_ID: z
		.string()
		.regex(/^\d{17,20}$/, "BOT_DEV_ID must be a Discord snowflake")
		.optional(),

	APPLICATION_ID: z
		.string()
		.regex(/^\d{17,20}$/, "APPLICATION_ID must be a Discord snowflake")
		.optional(),
	DISCORD_PUBLIC_KEY: z
		.string()
		.regex(/^[0-9a-f]{64}$/i, "DISCORD_PUBLIC_KEY must be a 64-hex-char key")
		.optional(),

	DATABASE_PATH: z.string().default("./data/bot.db"),

	LOG_MESSAGE_CHANNEL_ID: z.string().optional(),
	LOG_SANCTION_CHANNEL_ID: z.string().optional(),
	LOG_ECONOMY_CHANNEL_ID: z.string().optional(),
	LOG_JOIN_LEAVE_CHANNEL_ID: z.string().optional(),
	LOG_LEVEL_ROLE_CHANNEL_ID: z.string().optional(),
	LOG_TICKET_CHANNEL_ID: z.string().optional(),
	MOD_NOTIFY_CHANNEL_ID: z.string().optional(),
	COMMANDS_CHANNEL_ID: z.string().optional(),
	ANNOUNCE_CHANNEL_ID: z.string().optional(),

	JAIL_ROLE_ID: z.string().optional(),
	URL_IN_BIO_ROLE_ID: z.string().optional(),

	TICKET_CATEGORY_ID: z.string().optional(),
	VOCAL_TEMPO_HUB_ID: z.string().optional(),

	SERVER_INVITE_URL: z.string().default("discord.gg/"),

	LOG_LEVEL: z
		.enum(["trace", "debug", "info", "warn", "error", "fatal"])
		.default("info"),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
	console.error("✗ Invalid environment:");
	for (const issue of parsed.error.issues) {
		console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
	}
	process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof schema>;
