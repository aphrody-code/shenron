import type { GuardFunction } from "@rpbey/discordx";
import { type CommandInteraction, MessageFlags, PermissionFlagsBits } from "discord.js";

export const AdminOnly: GuardFunction<CommandInteraction> = async (interaction, _client, next) => {
  if (!interaction.inCachedGuild()) return;
  const hasPerm = interaction.member.permissions.has(PermissionFlagsBits.Administrator);
  if (!hasPerm) {
    await interaction.reply({
      content: "Permission insuffisante (Administrator requis).",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  await next();
};
