import type { GuardFunction } from "@rpbey/discordx";
import type { CommandInteraction, ButtonInteraction, ModalSubmitInteraction } from "discord.js";
import { MessageFlags } from "discord.js";
import { container } from "tsyringe";
import { env } from "~/lib/env";
import { SettingsService } from "~/services/SettingsService";

/**
 * Guard : restreint les interactions au salon configuré dans
 * `channel.commands` (priorité runtime) ou `env.COMMANDS_CHANNEL_ID` (fallback).
 */
export const CommandsChannelOnly: GuardFunction<
  CommandInteraction | ButtonInteraction | ModalSubmitInteraction
> = async (interaction, _client, next) => {
  const settings = container.resolve(SettingsService);
  const override = await settings.getSnowflake("channel.commands");
  const target = override ?? env.COMMANDS_CHANNEL_ID;
  if (target && interaction.channelId !== target) {
    if (interaction.isRepliable()) {
      await interaction.reply({
        content: `Utilise <#${target}> pour les commandes.`,
        flags: MessageFlags.Ephemeral,
      });
    }
    return;
  }
  await next();
};
