import { Discord, Once } from "@rpbey/discordx";
import type { Client } from "discord.js";
import { logger } from "~/lib/logger";

@Discord()
export class ReadyEvent {
  @Once({ event: "ready" })
  ready([client]: [Client]) {
    logger.info(`✓ Bot ready — ${client.user?.username} on ${client.guilds.cache.size} guild(s)`);
  }
}
