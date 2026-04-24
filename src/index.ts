import "reflect-metadata";
import { container } from "tsyringe";
import { Client, DIService } from "@rpbey/discordx";
import { tsyringeDependencyRegistryEngine } from "@rpbey/di";

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

import { IntentsBitField, Partials, Options } from "discord.js";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { env } from "./lib/env";
import { logger } from "./lib/logger";
import { DatabaseService } from "./db/index";
import { existsSync } from "node:fs";

// Side-effect barrel — charge toutes les classes decorées @Discord
import "./_entries";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildPresences, // URL-in-bio detection
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.GuildMember,
    Partials.User,
    Partials.Reaction,
  ],
  silent: env.NODE_ENV === "production",
  botGuilds: [env.GUILD_ID],
  makeCache: Options.cacheWithLimits({
    MessageManager: 100,
    ThreadManager: 50,
    ReactionManager: 0,
    GuildStickerManager: 0,
    GuildScheduledEventManager: 0,
    AutoModerationRuleManager: 0,
  }),
  sweepers: {
    ...Options.DefaultSweeperSettings,
    messages: { interval: 3600, lifetime: 1800 },
    threads: { interval: 3600, lifetime: 3600 },
  },
});

// Applique les migrations avant connexion
const dbService = container.resolve(DatabaseService);
if (existsSync("./src/db/migrations")) {
  try {
    migrate(dbService.db, { migrationsFolder: "./src/db/migrations" });
    logger.info("✓ DB migrations applied");
  } catch (err) {
    logger.warn({ err }, "DB migration step skipped (first run?)");
  }
}

client.once("ready", async () => {
  await client.initApplicationCommands();
  logger.info(`✓ Logged in as ${client.user?.username} (${client.guilds.cache.size} guilds)`);
});

client.on("interactionCreate", (interaction) => {
  client.executeInteraction(interaction);
});

async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down…`);
  try {
    await client.destroy();
    dbService.close();
  } catch (err) {
    logger.error({ err }, "Error during shutdown");
  }
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled rejection");
});
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception");
  process.exit(1);
});

await client.login(env.DISCORD_TOKEN);
