import type { GuardFunction } from "@rpbey/discordx";
import type {
	CommandInteraction,
	ButtonInteraction,
	ModalSubmitInteraction,
} from "discord.js";
import { MessageFlags } from "discord.js";
import { env } from "~/lib/env";

export const CommandsChannelOnly: GuardFunction<
	CommandInteraction | ButtonInteraction | ModalSubmitInteraction
> = async (interaction, _client, next) => {
	const target = env.COMMANDS_CHANNEL_ID;
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
