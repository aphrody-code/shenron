import "reflect-metadata";
import { container } from "tsyringe";
import { Client, DIService } from "@rpbey/discordy";
import { tsyringeDependencyRegistryEngine } from "@rpbey/di";

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

import { Partials, Options } from "discord.js";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { env } from "./lib/env";
import { logger } from "./lib/logger";
import { DatabaseService } from "./db/index";
import { runBootAudit } from "./lib/boot-audit";
import { ApiServer } from "./api/server";
import { existsSync } from "node:fs";
import { PERSONAS, PERSONA_IDS, type PersonaId } from "./lib/personas";

// Side-effect barrel — charge toutes les classes decorées @Discord
import "./_entries";
import { CommandPermissions } from "./guards/CommandPermissions";

// Migrations DB AVANT la création des clients (DatabaseService est singleton partagé)
const dbService = container.resolve(DatabaseService);
if (existsSync("./src/db/migrations")) {
	try {
		migrate(dbService.db, { migrationsFolder: "./src/db/migrations" });
		logger.info("✓ DB migrations applied");
	} catch (err) {
		logger.warn({ err }, "DB migration step skipped (first run?)");
	}
}

// ────────────────────────────────────────────────────────
// Création des 6 clients discord.js, un par persona.
// Chaque client a son propre token + intents minimaux + botId discordx.
// Les modules @Discord({ botIds: [...] }) sont filtrés par botId au moment
// d'initApplicationCommands → chaque bot ne register que ses propres commands.
// ────────────────────────────────────────────────────────
// Cache & partials différenciés : seuls Grand Prêtre (logs message) et Kaïo
// (XP via messageCreate + voice) ont besoin de message cache. Les 4 autres
// servent surtout des slash interactions → cache 0 ⇒ -30 à -50% RAM.
function cacheFor(id: PersonaId) {
	switch (id) {
		case "grandPretre":
			// Logs MessageDelete/MessageUpdate : besoin du contenu récent en cache
			return Options.cacheWithLimits({
				MessageManager: 200,
				ThreadManager: 50,
				ReactionManager: 0,
				GuildStickerManager: 0,
				GuildScheduledEventManager: 0,
				AutoModerationRuleManager: 0,
			});
		case "kaio":
			// XP messageCreate (anti-lien + achievements regex) + voiceStateUpdate
			return Options.cacheWithLimits({
				MessageManager: 100,
				ThreadManager: 0,
				ReactionManager: 0,
				GuildStickerManager: 0,
				GuildScheduledEventManager: 0,
				AutoModerationRuleManager: 0,
			});
		default:
			// Shenron, Beerus, Whis, Enma : pas d'event message → 0
			return Options.cacheWithLimits({
				MessageManager: 0,
				ThreadManager: 0,
				ReactionManager: 0,
				GuildStickerManager: 0,
				GuildScheduledEventManager: 0,
				AutoModerationRuleManager: 0,
				GuildEmojiManager: 0,
				GuildBanManager: 0,
				PresenceManager: 0,
			});
	}
}

function partialsFor(id: PersonaId): Partials[] {
	switch (id) {
		case "grandPretre":
			// Logs : besoin de tous les partials pour fetch on-demand
			return [
				Partials.Channel,
				Partials.Message,
				Partials.GuildMember,
				Partials.User,
				Partials.Reaction,
			];
		case "kaio":
			return [Partials.Channel, Partials.Message];
		case "enma":
			return [Partials.Channel, Partials.GuildMember];
		default:
			return [Partials.Channel];
	}
}

const clients = new Map<PersonaId, Client>();

for (const id of PERSONA_IDS) {
	const persona = PERSONAS[id];
	const c = new Client({
		botId: id,
		intents: persona.intents,
		partials: partialsFor(id),
		silent: env.NODE_ENV === "production",
		botGuilds: [env.GUILD_ID],
		guards: [CommandPermissions],
		makeCache: cacheFor(id),
		sweepers: {
			...Options.DefaultSweeperSettings,
			messages: { interval: 3600, lifetime: 1800 },
			threads: { interval: 3600, lifetime: 3600 },
		},
	});
	clients.set(id, c);
}

// Shenron est le client "principal" — exposé en singleton pour DI
// (LogService, MessageTemplateService, StatsService, ApiServer le résolvent
// implicitement via @inject(Client)).
const shenron = clients.get("shenron")!;
container.registerInstance(Client, shenron);
container.register("ClientMap", { useValue: clients });

// ────────────────────────────────────────────────────────
// Wiring identique pour tous les clients :
// - clientReady : mono-guild lock + initApplicationCommands
// - guildCreate : leave instantané si invité hors GUILD_ID
// - interactionCreate : routage discordx (filtré par botIds)
// Seul Shenron déclenche l'API REST + le boot audit.
// ────────────────────────────────────────────────────────
for (const [id, client] of clients) {
	client.once("clientReady", async () => {
		// Mono-guild forcé sur chaque persona
		for (const [gid, guild] of client.guilds.cache) {
			if (gid === env.GUILD_ID) continue;
			logger.warn(
				{ persona: id, gid, name: guild.name },
				"guild non-prod détectée, leave en cours",
			);
			await guild
				.leave()
				.catch((err) => logger.error({ err, gid }, "guild.leave failed"));
		}

		await client.initApplicationCommands();
		logger.info(
			`✓ ${PERSONAS[id].name} connecté en tant que ${client.user?.username} (botId=${id})`,
		);

		if (id === "shenron") {
			await runBootAudit(client).catch((err) =>
				logger.error({ err }, "boot-audit failed"),
			);
			try {
				container.resolve(ApiServer).start();
			} catch (err) {
				logger.error({ err }, "ApiServer start failed");
			}
		}
	});

	client.on("guildCreate", async (guild) => {
		if (guild.id === env.GUILD_ID) return;
		logger.warn(
			{ persona: id, gid: guild.id, name: guild.name },
			"guild non-prod a invité le bot, leave instantané",
		);
		await guild
			.leave()
			.catch((err) =>
				logger.error({ err, gid: guild.id }, "guild.leave failed"),
			);
	});

	client.on("interactionCreate", (interaction) => {
		client.executeInteraction(interaction);
	});
}

async function shutdown(signal: string) {
	logger.info(`Received ${signal}, shutting down…`);
	try {
		await Promise.allSettled([...clients.values()].map((c) => c.destroy()));
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

// Login : Shenron en premier (ApiServer dépend de son clientReady),
// les 5 autres en parallèle (Discord rate-limit identify est par-token, pas global)
// → boot ~10 s → ~2-3 s.
// Non-bloquant : si un persona échoue (privileged intents, token révoqué…),
// on log et on continue avec les autres. Shenron reste obligatoire.
try {
	await clients.get("shenron")!.login(PERSONAS.shenron.token);
} catch (err) {
	logger.fatal(
		{ err },
		"Shenron failed to start — aborting (no API REST possible)",
	);
	process.exit(1);
}

const otherIds = PERSONA_IDS.filter((id) => id !== "shenron");
await Promise.allSettled(
	otherIds.map(async (id) => {
		try {
			await clients.get(id)!.login(PERSONAS[id].token);
		} catch (err) {
			logger.error(
				{ err, persona: id },
				`Login failed for ${PERSONAS[id].name} — bot disabled`,
			);
		}
	}),
);

// ── Auto-seed wiki si DB vide (self-healing après perte bot.db) ─────────
// Non-bloquant : tourne en background après boot, idempotent (skip si seedé).
// Évite que les endpoints `/api/public/wiki/*` répondent `{characters: []}`
// après un recovery comme commit 8d9fc49.
void (async () => {
	try {
		const { runWikiSeed } = await import("~/db/seed-wiki");
		const result = await runWikiSeed({
			log: (m) => logger.info({ subsystem: "wiki-seed" }, m),
		});
		if (!result.skipped) {
			logger.info(
				{
					planets: result.planets,
					characters: result.characters,
					transformations: result.transformations,
				},
				"wiki auto-seeded on boot",
			);
		}
	} catch (err) {
		logger.warn({ err }, "wiki auto-seed failed (non-fatal)");
	}
})();
