import type { GuardFunction } from "@rpbey/discordx";
import { type CommandInteraction, MessageFlags, PermissionFlagsBits } from "discord.js";
import { env } from "~/lib/env";

export const ModOnly: GuardFunction<CommandInteraction> = async (interaction, _client, next) => {
  if (!interaction.inCachedGuild()) return;
  const isOwner = interaction.user.id === env.OWNER_ID || interaction.user.id === env.BOT_DEV_ID;
  const hasPerm = interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers);
  if (!isOwner && !hasPerm) {
    await interaction.reply({
      content: "Permission insuffisante (ModerateMembers requis).",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  await next();
};
