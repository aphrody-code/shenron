import type { GuardFunction } from "@rpbey/discordx";
import {
	BaseInteraction,
	type CommandInteraction,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import { container } from "tsyringe";
import { env } from "~/lib/env";
import { CommandPermissionsService } from "~/services/CommandPermissionsService";

/**
 * Guard global : applique les règles de la table `command_permissions` configurées
 * depuis le dashboard. Bypass owner / bot-dev / Administrator natif Discord pour
 * éviter de se lock out.
 *
 * Lookup hiérarchique : `admin reload` → `admin *` → `*` (joker global). La
 * première règle non vide gagne.
 *
 * **Important** : discordx applique les guards globaux à TOUS les @On/@Once
 * events (clientReady, voiceStateUpdate, …), pas juste aux interactions. On
 * détecte le type via `instanceof BaseInteraction` et on passe immédiatement
 * pour les events non-interaction (sinon `EventManager.executeHandlers` avale
 * silencieusement les exceptions et les events ratent — bug subtil sur Bun).
 */
export const CommandPermissions: GuardFunction<CommandInteraction> = async (
	arg,
	_client,
	next,
) => {
	if (!(arg instanceof BaseInteraction)) {
		await next();
		return;
	}

	const interaction = arg;
	if (!interaction.isCommand()) {
		await next();
		return;
	}

	const userId = interaction.user.id;
	if (userId === env.OWNER_ID || userId === env.BOT_DEV_ID) {
		await next();
		return;
	}

	if (
		interaction.inCachedGuild() &&
		interaction.member.permissions.has(PermissionFlagsBits.Administrator)
	) {
		await next();
		return;
	}

	const name = buildCommandName(interaction);
	const userRoleIds = interaction.inCachedGuild()
		? interaction.member.roles.cache.map((r) => r.id)
		: [];
	const service = container.resolve(CommandPermissionsService);
	const result = await service.check(name, userId, userRoleIds);
	if (result.allowed) {
		await next();
		return;
	}

	if (interaction.isRepliable()) {
		await interaction.reply({
			content: explain(result.reason, name),
			flags: MessageFlags.Ephemeral,
		});
	}
};

/**
 * Reconstitue le nom canonique d'une slash command avec son sous-groupe /
 * sous-commande, ex: `admin reload`, `economy give`, `daily`.
 */
function buildCommandName(interaction: CommandInteraction): string {
	const parts: string[] = [interaction.commandName];
	if (interaction.isChatInputCommand()) {
		const sg = interaction.options.getSubcommandGroup(false);
		if (sg) parts.push(sg);
		const sub = interaction.options.getSubcommand(false);
		if (sub) parts.push(sub);
	}
	return parts.join(" ");
}

function explain(reason: string, name: string): string {
	switch (reason) {
		case "disabled":
			return `La commande \`/${name}\` est désactivée.`;
		case "not_in_allowed_roles":
			return `Tu n'as pas le rôle requis pour utiliser \`/${name}\`.`;
		case "in_denied_role":
			return `Un de tes rôles t'interdit d'utiliser \`/${name}\`.`;
		case "in_denied_users":
			return `Tu n'as pas le droit d'utiliser \`/${name}\`.`;
		default:
			return `\`/${name}\` indisponible.`;
	}
}
