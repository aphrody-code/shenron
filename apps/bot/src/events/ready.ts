import { Bot, Discord, Once } from "@rpbey/discordy";
import type { Client } from "discord.js";
import { logger } from "~/lib/logger";

@Discord()
@Bot("shenron")
export class ReadyEvent {
  @Once({ event: "clientReady" })
  ready([client]: [Client]) {
    logger.info(`✓ Bot ready — ${client.user?.username} on ${client.guilds.cache.size} guild(s)`);
  }
}
