import type { GuardFunction } from "@rpbey/discordx";
import { type CommandInteraction, MessageFlags, PermissionFlagsBits } from "discord.js";

export const ModOnly: GuardFunction<CommandInteraction> = async (interaction, _client, next) => {
  if (!interaction.inCachedGuild()) return;
  const hasPerm = interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers);
  if (!hasPerm) {
    await interaction.reply({
      content: "Permission insuffisante (ModerateMembers requis).",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  await next();
};
