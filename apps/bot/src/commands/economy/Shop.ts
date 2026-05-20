import { injectable, inject } from "tsyringe";
import {
	Bot,
	ButtonComponent,
	Discord,
	Guard,
	SelectMenuComponent,
	Slash,
	SlashChoice,
	SlashOption,
} from "@rpbey/discordy";
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageFlags,
	PermissionFlagsBits,
	StringSelectMenuBuilder,
	type ButtonInteraction,
	type CommandInteraction,
	type Role,
	type StringSelectMenuInteraction,
} from "discord.js";
import { GuildOnly } from "~/guards/GuildOnly";
import { AdminOnly } from "~/guards/AdminOnly";
import { EconomyService } from "~/services/EconomyService";
import { formatXP } from "~/lib/xp";

const TYPE_LABELS = {
	card: { label: "Cartes", icon: "🖼️" },
	badge: { label: "Badges", icon: "🎖️" },
	color: { label: "Couleurs", icon: "🎨" },
	title: { label: "Titres", icon: "📜" },
	banner: { label: "Bannières", icon: "🌌" },
} as const;

type ShopType = keyof typeof TYPE_LABELS;

@Discord()
@Bot("kaio")
@Guard(GuildOnly)
@injectable()
export class ShopPanelCommands {
	constructor(@inject(EconomyService) private eco: EconomyService) {}

	// ─────────────────────────────────────────────────────────────────
	// /shop-panel — pose le message persistant (admin)
	// ─────────────────────────────────────────────────────────────────
	@Slash({
		name: "shop-panel",
		description: "Publier le panel shop persistant",
		defaultMemberPermissions: PermissionFlagsBits.Administrator,
	})
	@Guard(AdminOnly)
	async publishPanel(interaction: CommandInteraction) {
		const embed = new EmbedBuilder()
			.setTitle("🏪 Boutique Shenron")
			.setDescription(
				"Cliquez sur **Ouvrir la boutique** pour parcourir les objets disponibles.\n\nVotre interaction est privée — personne ne verra vos choix.",
			)
			.addFields(
				{ name: "🖼️ Cartes", value: "Backgrounds de profil exclusifs", inline: true },
				{ name: "🎖️ Badges", value: "Pastilles à côté du pseudo", inline: true },
				{ name: "🎨 Couleurs", value: "Rôles cosmétiques", inline: true },
				{ name: "📜 Titres", value: "Phrases d'identité", inline: true },
			)
			.setColor(0xfbbf24);

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("shop:open")
				.setLabel("Ouvrir la boutique")
				.setEmoji("🏪")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("shop:eprofil")
				.setLabel("Mon inventaire")
				.setEmoji("✏️")
				.setStyle(ButtonStyle.Secondary),
		);

		await interaction.reply({ embeds: [embed], components: [row] });
	}

	// ─────────────────────────────────────────────────────────────────
	// Bouton "Ouvrir la boutique" → réponse éphémère avec select category
	// ─────────────────────────────────────────────────────────────────
	@ButtonComponent({ id: "shop:open" })
	async openShop(interaction: ButtonInteraction) {
		const select = new StringSelectMenuBuilder()
			.setCustomId("shop:category")
			.setPlaceholder("Choisis une catégorie…")
			.addOptions(
				...Object.entries(TYPE_LABELS).map(([value, { label, icon }]) => ({
					label,
					value,
					emoji: icon,
				})),
			);
		await interaction.reply({
			content: "Quel type d'objet veux-tu voir ?",
			components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)],
			flags: MessageFlags.Ephemeral,
		});
	}

	// ─────────────────────────────────────────────────────────────────
	// Bouton "Mon inventaire" — fast-path /eprofil
	// ─────────────────────────────────────────────────────────────────
	@ButtonComponent({ id: "shop:eprofil" })
	async openProfile(interaction: ButtonInteraction) {
		const inv = await this.eco.listInventory(interaction.user.id);
		if (inv.length === 0) {
			await interaction.reply({
				content: "Ton inventaire est vide. Achète tes premiers objets via le panel !",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const grouped: Record<ShopType, string[]> = { card: [], badge: [], color: [], title: [], banner: [] };
		for (const item of inv) grouped[item.itemType as ShopType].push(item.itemKey);
		const embed = new EmbedBuilder()
			.setTitle("✏️ Ton inventaire")
			.setColor(0xfbbf24)
			.addFields(
				...Object.entries(grouped).map(([type, keys]) => ({
					name: `${TYPE_LABELS[type as ShopType].icon} ${TYPE_LABELS[type as ShopType].label}`,
					value: keys.length ? keys.map((k) => `\`${k}\``).join(", ") : "—",
				})),
			);
		await interaction.reply({
			content: "Utilise `/eprofil` pour équiper un objet précis.",
			embeds: [embed],
			flags: MessageFlags.Ephemeral,
		});
	}

	// ─────────────────────────────────────────────────────────────────
	// Select menu → liste les items de la catégorie choisie
	// ─────────────────────────────────────────────────────────────────
	@SelectMenuComponent({ id: "shop:category" })
	async pickCategory(interaction: StringSelectMenuInteraction) {
		const type = interaction.values[0] as ShopType;
		const items = await this.eco.listShop(type);
		if (items.length === 0) {
			await interaction.update({
				content: `Aucun objet ${TYPE_LABELS[type].label.toLowerCase()} disponible pour le moment.`,
				components: [],
				embeds: [],
			});
			return;
		}

		const ownedSet = new Set(
			(await this.eco.listInventory(interaction.user.id))
				.filter((i) => i.itemType === type)
				.map((i) => i.itemKey),
		);

		// Preview : pour les catégories liées à un rôle (color/title/badge),
		// on tente d'aligner la couleur de l'embed sur le rôle le plus cher
		// (= le plus "premium" du lot) pour donner un indice visuel.
		// Pour les cartes, on pointe setImage sur l'asset preview servi par
		// l'API (cf. /assets/cards/<key>.png — content-nego AVIF/WebP côté serveur).
		let embedColor = 0xfbbf24;
		if ((type === "color" || type === "title" || type === "badge") && interaction.inCachedGuild()) {
			const withRole = items
				.filter((i) => i.roleId)
				.sort((a, b) => b.price - a.price);
			for (const it of withRole) {
				const role = interaction.guild?.roles.cache.get(it.roleId!);
				if (role && role.color !== 0) {
					embedColor = role.color;
					break;
				}
			}
		}

		const embed = new EmbedBuilder()
			.setTitle(`${TYPE_LABELS[type].icon} ${TYPE_LABELS[type].label}`)
			.setColor(embedColor)
			.setDescription(
				items
					.slice(0, 25)
					.map((i) => {
						const owned = ownedSet.has(i.key) ? " ✅" : "";
						const role = i.roleId ? ` <@&${i.roleId}>` : "";
						return `**${i.name}** \`${i.key}\` — ${formatXP(i.price)} z${role}${owned}\n${i.description ?? ""}`;
					})
					.join("\n\n"),
			);

		// Preview visuelle pour la catégorie "card" : 1ère carte du lot
		// rendue par l'API card preview (URL absolue construite depuis
		// API_PUBLIC_URL si dispo, sinon path relatif).
		if (type === "card" && items[0]) {
			const base = Bun.env.API_PUBLIC_URL ?? "https://shenron.rpbey.fr";
			embed.setImage(`${base}/assets/cards/${encodeURIComponent(items[0].key)}.png`);
		}

		// Boutons d'achat (5 max par row, 5 rows max = 25 items pile poil)
		const rows: ActionRowBuilder<ButtonBuilder>[] = [];
		const buyable = items.slice(0, 25).filter((i) => !ownedSet.has(i.key));
		for (let i = 0; i < buyable.length; i += 5) {
			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				...buyable.slice(i, i + 5).map((item) =>
					new ButtonBuilder()
						.setCustomId(`shop:buy:${item.key}`)
						.setLabel(`${item.name} · ${formatXP(item.price)}z`.slice(0, 80))
						.setStyle(ButtonStyle.Success),
				),
			);
			rows.push(row);
		}
		// Toujours laisser 1 row libre pour "Retour"
		const backRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("shop:open")
				.setLabel("← Autre catégorie")
				.setStyle(ButtonStyle.Secondary),
		);
		await interaction.update({
			content: "",
			embeds: [embed],
			components: [...rows.slice(0, 4), backRow],
		});
	}

	// ─────────────────────────────────────────────────────────────────
	// Bouton "Acheter <key>" — purchase + grant role si lié
	// ─────────────────────────────────────────────────────────────────
	@ButtonComponent({ id: /^shop:buy:.+$/ })
	async buyButton(interaction: ButtonInteraction) {
		const key = interaction.customId.slice("shop:buy:".length);
		const res = await this.eco.purchase(interaction.user.id, key);
		if (!res.ok) {
			await interaction.reply({ content: `❌ ${res.reason}`, flags: MessageFlags.Ephemeral });
			return;
		}
		await interaction.reply({
			content: `✅ Acheté **${key}** pour ${res.price}z. Stocké dans ton inventaire — utilise \`/eprofil\` ou \`/inventaire equip\` pour l'équiper.`,
			flags: MessageFlags.Ephemeral,
		});
	}

	// ─────────────────────────────────────────────────────────────────
	// /shop-item — admin : add / set-role / toggle
	// ─────────────────────────────────────────────────────────────────
	@Slash({
		name: "shop-item",
		description: "Admin: ajouter/modifier un objet du shop",
		defaultMemberPermissions: PermissionFlagsBits.Administrator,
	})
	@Guard(AdminOnly)
	async shopItem(
		@SlashChoice({ name: "add", value: "add" })
		@SlashChoice({ name: "set-role", value: "set-role" })
		@SlashChoice({ name: "toggle", value: "toggle" })
		@SlashOption({
			name: "action",
			description: "add | set-role | toggle",
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		action: "add" | "set-role" | "toggle",
		@SlashOption({
			name: "cle",
			description: "Clé unique (ex: titre_legendaire)",
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		key: string,
		@SlashChoice({ name: "card", value: "card" })
		@SlashChoice({ name: "badge", value: "badge" })
		@SlashChoice({ name: "color", value: "color" })
		@SlashChoice({ name: "title", value: "title" })
		@SlashOption({
			name: "type",
			description: "Type (requis pour add)",
			type: ApplicationCommandOptionType.String,
			required: false,
		})
		type: ShopType | undefined,
		@SlashOption({
			name: "nom",
			description: "Nom affiché (requis pour add)",
			type: ApplicationCommandOptionType.String,
			required: false,
		})
		name: string | undefined,
		@SlashOption({
			name: "prix",
			description: "Prix en zéni (requis pour add)",
			type: ApplicationCommandOptionType.Integer,
			required: false,
			minValue: 1,
		})
		price: number | undefined,
		@SlashOption({
			name: "role",
			description: "Rôle attribué à l'achat (set-role / add)",
			type: ApplicationCommandOptionType.Role,
			required: false,
		})
		role: Role | undefined,
		@SlashOption({
			name: "description",
			description: "Description courte",
			type: ApplicationCommandOptionType.String,
			required: false,
		})
		description: string | undefined,
		interaction: CommandInteraction,
	) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		if (action === "add") {
			if (!type || !name || price == null) {
				await interaction.editReply("❌ `type`, `nom` et `prix` sont requis pour `add`.");
				return;
			}
			await this.eco.upsertShopItem({
				key,
				type,
				name,
				price,
				roleId: role?.id ?? null,
				description: description ?? null,
				enabled: true,
			});
			await interaction.editReply(
				`✅ Item **${key}** (${type}, ${price}z) créé/mis à jour${role ? ` avec rôle <@&${role.id}>` : ""}.`,
			);
			return;
		}
		if (action === "set-role") {
			const ok = await this.eco.setShopItemRole(key, role?.id ?? null);
			await interaction.editReply(
				ok
					? `✅ Rôle ${role ? `<@&${role.id}>` : "*(retiré)*"} associé à **${key}**.`
					: `❌ Item **${key}** introuvable.`,
			);
			return;
		}
		// toggle
		const item = await this.eco.getShopItem(key);
		if (!item) {
			await interaction.editReply(`❌ Item **${key}** introuvable.`);
			return;
		}
		await this.eco.upsertShopItem({
			key: item.key,
			type: item.type,
			name: item.name,
			description: item.description,
			price: item.price,
			roleId: item.roleId,
			enabled: !item.enabled,
		});
		await interaction.editReply(
			`✅ Item **${key}** ${!item.enabled ? "activé" : "désactivé"}.`,
		);
	}
}
