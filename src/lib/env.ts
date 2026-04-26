import { z } from "zod";

const schema = z.object({
  DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN is required"),
  GUILD_ID: z.string().regex(/^\d{17,20}$/, "GUILD_ID must be a Discord snowflake"),
  OWNER_ID: z.string().regex(/^\d{17,20}$/, "OWNER_ID must be a Discord snowflake"),
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
  ACHIEVEMENT_CHANNEL_ID: z.string().optional(),

  // /translate (OCR Tesseract + cascade providers sans clé)
  // - Lingva Translate (proxy Google, instances publiques rotatives)
  // - Google translate.googleapis.com `gtx` (endpoint Chrome, sans clé)
  // - LibreTranslate (self-host, fallback)
  LIBRETRANSLATE_URL: z.string().url().optional(), // défaut http://127.0.0.1:5000
  LIBRETRANSLATE_API_KEY: z.string().optional(),
  // Override l'instance Lingva primaire (ex: https://lingva.ml). Si absent,
  // on essaie en cascade les instances publiques connues.
  LINGVA_INSTANCE: z.string().url().optional(),

  // API REST (Bun.serve) — surface tscord-compatible pour dashboard
  API_PORT: z.coerce.number().int().min(1).max(65535).default(5006),
  API_HOST: z.string().default("127.0.0.1"),
  API_ADMIN_TOKEN: z.string().min(16).optional(), // bearer token requis sur les routes /bot, /database, /stats, /health/monitoring|/logs
  API_ENABLED: z.coerce.boolean().default(true),

  // OAuth2 Discord (login dashboard)
  // Le client_secret ne doit JAMAIS être commit ; uniquement dans .env (gitignored).
  // SESSION_SECRET = clé HMAC pour signer le cookie session (séparée d'API_ADMIN_TOKEN
  // pour que rotation token n'invalide pas les sessions OAuth en cours).
  DISCORD_CLIENT_ID: z
    .string()
    .regex(/^\d{17,20}$/)
    .optional(),
  DISCORD_CLIENT_SECRET: z.string().min(16).optional(),
  OAUTH_REDIRECT_URI: z.string().url().optional(),
  // CSV de snowflakes autorisés à se connecter ; OWNER_ID est implicitement whitelisté.
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
  SESSION_SECRET: z.string().min(32).optional(),

  JAIL_ROLE_ID: z.string().optional(),
  URL_IN_BIO_ROLE_ID: z.string().optional(),

  TICKET_CATEGORY_ID: z.string().optional(),
  VOCAL_TEMPO_HUB_ID: z.string().optional(),

  SERVER_INVITE_URL: z.string().default("discord.gg/"),

  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
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
