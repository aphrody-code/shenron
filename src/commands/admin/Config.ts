import { injectable, inject } from "tsyringe";
import {
	Discord,
	Slash,
	SlashOption,
	SlashChoice,
	Guard,
	SlashGroup,
} from "@rpbey/discordx";
import {
	ApplicationCommandOptionType,
	MessageFlags,
	PermissionFlagsBits,
	type Channel,
	type CommandInteraction,
	type Role,
} from "discord.js";
import { eq } from "drizzle-orm";
import { GuildOnly } from "~/guards/GuildOnly";
import { AdminOnly } from "~/guards/AdminOnly";
import { SettingsService, SETTINGS_KEYS } from "~/services/SettingsService";
import { DatabaseService } from "~/db/index";
import { levelRewards } from "~/db/schema";
import { brandedEmbed, errorEmbed, successEmbed } from "~/lib/embeds";

const settingsChoices = SETTINGS_KEYS.map((s) => ({
	name: `${s.key} — ${s.description}`.slice(0, 100),
	value: s.key,
}));

@Discord()
@Guard(GuildOnly, AdminOnly)
@SlashGroup({
	name: "config",
	description: "Admin: configuration runtime du bot (XP, salons, niveaux)",
	defaultMemberPermissions: PermissionFlagsBits.Administrator,
})
@SlashGroup("config")
@injectable()
export class ConfigCommand {
	constructor(
		@inject(SettingsService) private settings: SettingsService,
		@inject(DatabaseService) private dbs: DatabaseService,
	) {}

	@Slash({ name: "list", description: "Lister toutes les valeurs runtime" })
	async list(interaction: CommandInteraction) {
		const rows = await this.settings.list();
		const fields = SETTINGS_KEYS.map((def) => {
			const current = rows.find((r) => r.key === def.key);
			const value = current?.value ?? `*(défaut: ${def.default ?? "—"})*`;
			return {
				name: `\`${def.key}\``,
				value: `${def.description}\n→ ${value}`,
				inline: false,
			};
		});

		const embed = brandedEmbed({
			title: "⚙️ Configuration runtime",
			description: "Surcharges DB qui priment sur env / constantes.",
			kind: "info",
		}).addFields(fields.slice(0, 25));

		await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
	}

	@Slash({ name: "set", description: "Définir une valeur (entier ou ID Discord)" })
	async set(
		@SlashChoice(...settingsChoices.slice(0, 25))
		@SlashOption({
			name: "key",
			description: "Clé à éditer",
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		key: string,
		@SlashOption({
			name: "value",
			description: "Nouvelle valeur (entier ou snowflake)",
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		value: string,
		interaction: CommandInteraction,
	) {
		try {
			await this.settings.set(key, value);
			await interaction.reply({
				embeds: [successEmbed("Setting mise à jour", `\`${key}\` = \`${value}\``)],
				flags: MessageFlags.Ephemeral,
			});
		} catch (err) {
			await interaction.reply({
				embeds: [errorEmbed("Erreur", err instanceof Error ? err.message : "Erreur inconnue")],
				flags: MessageFlags.Ephemeral,
			});
		}
	}

	@Slash({ name: "unset", description: "Supprimer une surcharge (revient au défaut)" })
	async unset(
		@SlashChoice(...settingsChoices.slice(0, 25))
		@SlashOption({
			name: "key",
			description: "Clé à supprimer",
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		key: string,
		interaction: CommandInteraction,
	) {
		await this.settings.unset(key);
		await interaction.reply({
			embeds: [successEmbed("Setting supprimée", `\`${key}\` revient au défaut.`)],
			flags: MessageFlags.Ephemeral,
		});
	}

	@Slash({ name: "channel", description: "Raccourci pour définir un salon" })
	async channel(
		@SlashChoice(
			{ name: "Annonces (général)", value: "channel.announce" },
			{ name: "Accomplissements", value: "channel.achievement" },
			{ name: "Salon des commandes", value: "channel.commands" },
		)
		@SlashOption({
			name: "type",
			description: "Type de salon",
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		type: string,
		@SlashOption({
			name: "salon",
			description: "Salon cible",
			type: ApplicationCommandOptionType.Channel,
			required: true,
		})
		channel: Channel,
		interaction: CommandInteraction,
	) {
		try {
			await this.settings.set(type, channel.id);
			await interaction.reply({
				embeds: [successEmbed("Salon défini", `<#${channel.id}> pour \`${type}\``)],
				flags: MessageFlags.Ephemeral,
			});
		} catch (err) {
			await interaction.reply({
				embeds: [errorEmbed("Erreur", err instanceof Error ? err.message : "Erreur inconnue")],
				flags: MessageFlags.Ephemeral,
			});
		}
	}

	@Slash({ name: "level-reward-set", description: "Lier un rôle à un niveau (level reward)" })
	async levelRewardSet(
		@SlashOption({
			name: "level",
			description: "Niveau (entier ≥ 1)",
			type: ApplicationCommandOptionType.Integer,
			required: true,
			minValue: 1,
			maxValue: 999,
		})
		level: number,
		@SlashOption({
			name: "role",
			description: "Rôle à attribuer",
			type: ApplicationCommandOptionType.Role,
			required: true,
		})
		role: Role,
		@SlashOption({
			name: "xp-threshold",
			description: "XP requise (défaut: calculé)",
			type: ApplicationCommandOptionType.Integer,
			required: false,
			minValue: 0,
		})
		xpThreshold: number | undefined,
		@SlashOption({
			name: "zeni-bonus",
			description: "Bonus zeni (défaut 1000)",
			type: ApplicationCommandOptionType.Integer,
			required: false,
			minValue: 0,
		})
		zeniBonus: number | undefined,
		interaction: CommandInteraction,
	) {
		// Sanity check : le bot doit pouvoir attribuer ce rôle (position < bot.highest)
		const botMember = await interaction.guild?.members.fetchMe();
		if (botMember && role.position >= botMember.roles.highest.position) {
			await interaction.reply({
				embeds: [
					errorEmbed(
						"Rôle au-dessus du bot",
						`${role} (position ${role.position}) ≥ rôle bot (${botMember.roles.highest.position}). ` +
							"Range le rôle du bot au-dessus dans les paramètres serveur, sinon l'attribution échouera silencieusement.",
					),
				],
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		// Formule par défaut alignée sur xp.ts (palier exponentiel doux)
		const computed = xpThreshold ?? Math.floor(100 * level * (level + 1) * 0.5);
		const bonus = zeniBonus ?? 1000;

		await this.dbs.db
			.insert(levelRewards)
			.values({ level, roleId: role.id, xpThreshold: computed, zeniBonus: bonus })
			.onConflictDoUpdate({
				target: levelRewards.level,
				set: { roleId: role.id, xpThreshold: computed, zeniBonus: bonus },
			});

		await interaction.reply({
			embeds: [
				successEmbed(
					"Level reward enregistré",
					`Niveau **${level}** → ${role}\nSeuil XP: \`${computed}\` · Bonus: **${bonus} z**`,
				),
			],
			flags: MessageFlags.Ephemeral,
		});
	}

	@Slash({ name: "level-reward-remove", description: "Supprimer une level reward" })
	async levelRewardRemove(
		@SlashOption({
			name: "level",
			description: "Niveau à supprimer",
			type: ApplicationCommandOptionType.Integer,
			required: true,
			minValue: 1,
		})
		level: number,
		interaction: CommandInteraction,
	) {
		await this.dbs.db.delete(levelRewards).where(eq(levelRewards.level, level));
		await interaction.reply({
			embeds: [successEmbed("Level reward supprimée", `Niveau **${level}**`)],
			flags: MessageFlags.Ephemeral,
		});
	}

	@Slash({ name: "level-rewards", description: "Liste des level rewards configurées" })
	async levelRewardsList(interaction: CommandInteraction) {
		const rows = await this.dbs.db.select().from(levelRewards).orderBy(levelRewards.level);
		if (!rows.length) {
			await interaction.reply({
				embeds: [brandedEmbed({ title: "📜 Level rewards", description: "*(aucune configurée)*", kind: "muted" })],
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const embed = brandedEmbed({ title: "📜 Level rewards", kind: "info" }).addFields(
			rows.slice(0, 25).map((r) => ({
				name: `Niveau ${r.level}`,
				value: `<@&${r.roleId}> · seuil \`${r.xpThreshold}\` XP · +${r.zeniBonus} z`,
				inline: false,
			})),
		);
		await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
	}
}

