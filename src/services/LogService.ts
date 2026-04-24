import { singleton } from "tsyringe";
import { Client, EmbedBuilder, type TextChannel, type ColorResolvable } from "discord.js";
import { env } from "~/lib/env";
import { logger } from "~/lib/logger";

type LogCategory =
  | "message"
  | "sanction"
  | "economy"
  | "joinLeave"
  | "levelRole"
  | "ticket"
  | "modNotify";

const CHANNELS: Record<LogCategory, string | undefined> = {
  message: env.LOG_MESSAGE_CHANNEL_ID,
  sanction: env.LOG_SANCTION_CHANNEL_ID,
  economy: env.LOG_ECONOMY_CHANNEL_ID,
  joinLeave: env.LOG_JOIN_LEAVE_CHANNEL_ID,
  levelRole: env.LOG_LEVEL_ROLE_CHANNEL_ID,
  ticket: env.LOG_TICKET_CHANNEL_ID,
  modNotify: env.MOD_NOTIFY_CHANNEL_ID,
};

@singleton()
export class LogService {
  async send(client: Client, category: LogCategory, embed: EmbedBuilder) {
    const channelId = CHANNELS[category];
    if (!channelId) return;
    try {
      const ch = await client.channels.fetch(channelId);
      if (ch?.isSendable()) {
        await (ch as TextChannel).send({ embeds: [embed] });
      }
    } catch (err) {
      logger.warn({ err, category, channelId }, "Failed to send log");
    }
  }

  makeEmbed(title: string, color: ColorResolvable = 0x5865f2): EmbedBuilder {
    return new EmbedBuilder().setTitle(title).setColor(color).setTimestamp();
  }
}
