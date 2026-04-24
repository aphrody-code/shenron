import type { GuardFunction } from "@rpbey/discordx";
import { type CommandInteraction, MessageFlags } from "discord.js";
import { env } from "~/lib/env";

export const OwnerOnly: GuardFunction<CommandInteraction> = async (
	interaction,
	_client,
	next,
) => {
	const allowed =
		interaction.user.id === env.OWNER_ID ||
		interaction.user.id === env.BOT_DEV_ID;
	if (!allowed) {
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
