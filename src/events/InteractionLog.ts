import { injectable, inject } from "tsyringe";
import { Discord, On, type ArgsOf } from "@rpbey/discordx";
import { DatabaseService } from "~/db/index";
import { actionLogs } from "~/db/schema";
import { logger } from "~/lib/logger";

/**
 * Trace chaque interaction Discord (slash command, context menu, button) dans
 * la table `action_logs` avec `action = "interaction"`. Permet au dashboard de
 * lire la dernière interaction (`/api/stats/interaction/last`) ainsi que le
 * journal d'audit complet par filtrage.
 *
 * Les `meta` contiennent JSON :
 *   { type, name, options }
 *
 * Insertion en best-effort — un échec d'insert ne casse pas l'exécution de la
 * commande.
 */
@Discord()
@injectable()
export class InteractionLogEvent {
	constructor(@inject(DatabaseService) private dbs: DatabaseService) {}

	@On({ event: "interactionCreate" })
	async log([interaction]: ArgsOf<"interactionCreate">) {
		try {
			let name = "unknown";
			let type = "unknown";
			if (interaction.isChatInputCommand()) {
				name = interaction.commandName;
				type = "chat";
			} else if (interaction.isMessageContextMenuCommand()) {
				name = interaction.commandName;
				type = "context.message";
			} else if (interaction.isUserContextMenuCommand()) {
				name = interaction.commandName;
				type = "context.user";
			} else if (interaction.isButton()) {
				name = interaction.customId;
				type = "button";
			} else if (interaction.isAnySelectMenu()) {
				name = interaction.customId;
				type = "select";
			} else if (interaction.isModalSubmit()) {
				name = interaction.customId;
				type = "modal";
			} else if (interaction.isAutocomplete()) {
				name = interaction.commandName;
				type = "autocomplete";
			} else {
				return;
			}

			const meta = JSON.stringify({
				type,
				name,
				channelId: interaction.channelId,
				guildId: interaction.guildId,
			});

			await this.dbs.db.insert(actionLogs).values({
				userId: interaction.user.id,
				moderatorId: null,
				action: "interaction",
				reason: null,
				meta,
			});
		} catch (err) {
			logger.debug({ err }, "interaction log insert failed");
		}
	}
}
