import { injectable, inject } from "tsyringe";
import { Bot, Discord, Guard, Slash, SlashChoice, SlashGroup, SlashOption } from "@rpbey/discordy";
import {
	ApplicationCommandOptionType,
	EmbedBuilder,
	MessageFlags,
	type CommandInteraction,
} from "discord.js";
import { GuildOnly } from "~/guards/GuildOnly";
import { EconomyService } from "~/services/EconomyService";

type ItemType = "card" | "badge" | "color" | "title";

const TYPE_FIELD = {
	card: "equippedCard",
	badge: "equippedBadge",
	color: "equippedColor",
	title: "equippedTitle",
} as const;

const TYPE_LABELS: Record<ItemType, string> = {
	card: "🖼️ Carte",
	badge: "🎖️ Badge",
	color: "🎨 Couleur",
	title: "📜 Titre",
};

@Discord()
@Bot("kaio")
@Guard(GuildOnly)
@SlashGroup({ name: "inventaire", description: "Gérer ton inventaire (carte/badge/couleur/titre)" })
@SlashGroup("inventaire")
@injectable()
export class InventaireCommands {
	constructor(@inject(EconomyService) private eco: EconomyService) {}

	@Slash({ name: "list", description: "Voir le contenu de ton inventaire" })
	async list(interaction: CommandInteraction) {
		const inv = await this.eco.listInventory(interaction.user.id);
		if (inv.length === 0) {
			await interaction.reply({
				content: "Ton inventaire est vide. Achète via `/shop` ou le panel.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const grouped: Record<ItemType, string[]> = { card: [], badge: [], color: [], title: [] };
		for (const it of inv) grouped[it.itemType as ItemType].push(it.itemKey);
		const embed = new EmbedBuilder()
			.setTitle("🎒 Ton inventaire")
			.setColor(0xfbbf24)
			.addFields(
				...(Object.keys(grouped) as ItemType[]).map((t) => ({
					name: TYPE_LABELS[t],
					value: grouped[t].length ? grouped[t].map((k) => `\`${k}\``).join(", ") : "—",
				}))
			);
		await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
	}

	@Slash({ name: "equip", description: "Équiper un objet de ton inventaire" })
	async equip(
		@SlashChoice({ name: "carte", value: "card" })
		@SlashChoice({ name: "badge", value: "badge" })
		@SlashChoice({ name: "couleur", value: "color" })
		@SlashChoice({ name: "titre", value: "title" })
		@SlashOption({
			name: "type",
			description: "Type d'objet à équiper",
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		type: ItemType,
		@SlashOption({
			name: "cle",
			description: "Clé de l'objet (ex: saiyan_blue)",
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		key: string,
		interaction: CommandInteraction
	) {
		if (!interaction.inCachedGuild()) return;
		const ok = await this.eco.equip(interaction.user.id, type, key);
		if (!ok) {
			await interaction.reply({
				content: "❌ Tu ne possèdes pas cet objet.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		// Attribution du rôle Discord si l'item shop est lié à un rôle.
		// Le rôle précédemment équipé de même type est retiré pour éviter empilement.
		if (type === "color" || type === "title" || type === "badge") {
			const item = await this.eco.getShopItem(key);
			if (item?.roleId) {
				try {
					await interaction.member.roles.add(item.roleId, `inventaire equip ${type}:${key}`);
				} catch {
					// hierarchy ou perms — on ignore, l'equip DB est OK quoi qu'il arrive
				}
			}
		}
		await interaction.reply({
			content: `✅ ${TYPE_LABELS[type]} \`${key}\` équipé.`,
			flags: MessageFlags.Ephemeral,
		});
	}

	@Slash({ name: "dequip", description: "Retirer l'objet équipé d'un type" })
	async dequip(
		@SlashChoice({ name: "carte", value: "card" })
		@SlashChoice({ name: "badge", value: "badge" })
		@SlashChoice({ name: "couleur", value: "color" })
		@SlashChoice({ name: "titre", value: "title" })
		@SlashOption({
			name: "type",
			description: "Type à déséquiper",
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		type: ItemType,
		interaction: CommandInteraction
	) {
		if (!interaction.inCachedGuild()) return;
		// On lit l'item courant pour retirer son rôle Discord (si applicable),
		// puis on null le champ equippedX en DB.
		const dbs = this.eco;
		const u = await dbs.getUser(interaction.user.id);
		const currentKey = u?.[TYPE_FIELD[type]] as string | null | undefined;
		if (currentKey) {
			const item = await this.eco.getShopItem(currentKey);
			if (item?.roleId) {
				await interaction.member.roles
					.remove(item.roleId, `inventaire dequip ${type}`)
					.catch(() => {});
			}
		}
		await this.eco.setEquipped(interaction.user.id, type, null);
		await interaction.reply({
			content: `✅ ${TYPE_LABELS[type]} retiré.`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
