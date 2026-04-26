import { container, singleton } from "tsyringe";
import { Client, EmbedBuilder, type TextChannel, type ColorResolvable } from "discord.js";
import { env } from "~/lib/env";
import { logger } from "~/lib/logger";
import { SettingsService } from "./SettingsService";

type LogCategory =
  | "message"
  | "sanction"
  | "economy"
  | "joinLeave"
  | "levelRole"
  | "ticket"
  | "modNotify";

/**
 * Mapping `LogCategory` → setting key (priorité runtime) + env fallback.
 * Permet au dashboard / `/config channel` de surcharger les destinations
 * sans redéploiement.
 */
const CATEGORY_MAP: Record<LogCategory, { settingKey: string; envFallback?: string }> = {
  message: { settingKey: "channel.log_message", envFallback: env.LOG_MESSAGE_CHANNEL_ID },
  sanction: { settingKey: "channel.log_sanction", envFallback: env.LOG_SANCTION_CHANNEL_ID },
  economy: { settingKey: "channel.log_economy", envFallback: env.LOG_ECONOMY_CHANNEL_ID },
  joinLeave: { settingKey: "channel.log_join_leave", envFallback: env.LOG_JOIN_LEAVE_CHANNEL_ID },
  levelRole: { settingKey: "channel.log_level_role", envFallback: env.LOG_LEVEL_ROLE_CHANNEL_ID },
  ticket: { settingKey: "channel.log_ticket", envFallback: env.LOG_TICKET_CHANNEL_ID },
  modNotify: { settingKey: "channel.mod_notify", envFallback: env.MOD_NOTIFY_CHANNEL_ID },
};

@singleton()
export class LogService {
  private async resolveChannelId(category: LogCategory): Promise<string | undefined> {
    const map = CATEGORY_MAP[category];
    const settings = container.resolve(SettingsService);
    const override = await settings.getSnowflake(map.settingKey);
    return override ?? map.envFallback;
  }

  async send(client: Client, category: LogCategory, embed: EmbedBuilder) {
    const channelId = await this.resolveChannelId(category);
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
