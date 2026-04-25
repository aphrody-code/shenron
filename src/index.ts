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
import { runBootAudit } from "./lib/boot-audit";
import { ApiServer } from "./api/server";
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

// Enregistre le Client dans le container pour que ApiServer/StatsService puissent le resolve
container.registerInstance(Client, client);

client.once("clientReady", async () => {
  // Mono-guild forcé : quitte automatiquement toute guild ≠ env.GUILD_ID.
  // Le bot et le dashboard sont focus sur Dragon Ball FR uniquement.
  for (const [id, guild] of client.guilds.cache) {
    if (id === env.GUILD_ID) continue;
    logger.warn({ id, name: guild.name }, "guild non-prod détectée, leave en cours");
    await guild.leave().catch((err) => logger.error({ err, id }, "guild.leave failed"));
  }

  await client.initApplicationCommands();
  logger.info(`✓ Connecté en tant que ${client.user?.username} (focus guild ${env.GUILD_ID})`);
  await runBootAudit(client).catch((err) => logger.error({ err }, "boot-audit failed"));
  // API REST (Bun.serve) — démarrée après clientReady pour que le client soit utilisable
  try {
    container.resolve(ApiServer).start();
  } catch (err) {
    logger.error({ err }, "ApiServer start failed");
  }
});

// Refus de rejoindre une nouvelle guild non-prod : leave instantané si invité ailleurs.
client.on("guildCreate", async (guild) => {
  if (guild.id === env.GUILD_ID) return;
  logger.warn(
    { id: guild.id, name: guild.name },
    "guild non-prod a invité le bot, leave instantané",
  );
  await guild.leave().catch((err) => logger.error({ err, id: guild.id }, "guild.leave failed"));
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
