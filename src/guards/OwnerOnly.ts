import type { GuardFunction } from "@rpbey/discordx";
import { type CommandInteraction, MessageFlags } from "discord.js";
import { env } from "~/lib/env";

export const OwnerOnly: GuardFunction<CommandInteraction> = async (interaction, _client, next) => {
  if (interaction.user.id !== env.OWNER_ID) {
    if (interaction.isRepliable()) {
      await interaction.reply({
        content: "Commande réservée au propriétaire du bot.",
        flags: MessageFlags.Ephemeral,
      });
    }
    return;
  }
  await next();
};
