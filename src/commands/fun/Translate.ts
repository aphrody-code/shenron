import { injectable, inject } from "tsyringe";
import {
	Discord,
	Slash,
	SlashOption,
	SlashChoice,
	Guard,
	ContextMenu,
} from "@rpbey/discordx";
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	MessageFlags,
	type CommandInteraction,
	type MessageContextMenuCommandInteraction,
	type Message,
	type Attachment,
} from "discord.js";
import { GuildOnly } from "~/guards/GuildOnly";
import { CommandsChannelOnly } from "~/guards/CommandsChannelOnly";
import { TranslateService } from "~/services/TranslateService";
import { brandedEmbed, errorEmbed, warningEmbed } from "~/lib/embeds";
import { logger } from "~/lib/logger";

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|bmp)(\?.*)?$/i;
const TARGET_LANGS = [
	{ name: "Français", value: "FR" },
	{ name: "Anglais", value: "EN" },
	{ name: "Espagnol", value: "ES" },
	{ name: "Allemand", value: "DE" },
	{ name: "Italien", value: "IT" },
	{ name: "Japonais", value: "JA" },
];

function pickImage(message: Message): Attachment | null {
	for (const att of message.attachments.values()) {
		const url = att.url ?? "";
		if (att.contentType?.startsWith("image/") || IMAGE_EXT.test(url)) {
			return att;
		}
	}
	return null;
}

function buildResultEmbed(args: {
	imageUrl: string;
	source: string;
	translated: string;
	detected: string;
	target: string;
	authorTag?: string;
}) {
	return brandedEmbed({
		title: "🌐 Traduction d'image",
		kind: "info",
	})
		.setImage(args.imageUrl)
		.addFields(
			{ name: `Source (${args.detected})`, value: codeBlock(args.source), inline: false },
			{ name: `Traduction (${args.target})`, value: codeBlock(args.translated), inline: false },
		)
		.setFooter({ text: `OCR.space + DeepL${args.authorTag ? ` · ${args.authorTag}` : ""}` });
}

function codeBlock(text: string, max = 1000): string {
	const truncated = text.length > max ? `${text.slice(0, max - 3)}...` : text;
	return `\`\`\`\n${truncated || "—"}\n\`\`\``;
}

@Discord()
@Guard(GuildOnly, CommandsChannelOnly)
@injectable()
export class TranslateCommand {
	constructor(@inject(TranslateService) private translator: TranslateService) {}

	@Slash({ name: "translate", description: "OCR + traduction d'une image (DeepL)" })
	async translate(
		@SlashOption({
			name: "image",
			description: "Image à traduire",
			type: ApplicationCommandOptionType.Attachment,
			required: false,
		})
		attachment: Attachment | undefined,
		@SlashOption({
			name: "url",
			description: "URL d'image à utiliser au lieu d'un attachement",
			type: ApplicationCommandOptionType.String,
			required: false,
		})
		url: string | undefined,
		@SlashChoice(...TARGET_LANGS)
		@SlashOption({
			name: "langue",
			description: "Langue cible (par défaut français)",
			type: ApplicationCommandOptionType.String,
			required: false,
		})
		target: string | undefined,
		interaction: CommandInteraction,
	) {
		const avail = this.translator.available;
		if (!avail.ocr || !avail.deepl) {
			await interaction.reply({
				embeds: [
					errorEmbed(
						"OCR / Traduction non configurés",
						`Manquant : ${[!avail.ocr && "`OCR_SPACE_API_KEY`", !avail.deepl && "`DEEPL_API_KEY`"].filter(Boolean).join(", ")} dans le .env du bot.`,
					),
				],
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const imageUrl = attachment?.url ?? url;
		if (!imageUrl) {
			await interaction.reply({
				embeds: [warningEmbed("Pas d'image", "Joins une image OU passe une URL via l'option `url`.")],
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await interaction.deferReply();
		try {
			const result = await this.translator.ocrAndTranslate(imageUrl, target ?? "FR");
			if (!result) {
				await interaction.editReply({
					embeds: [warningEmbed("Pas de texte détecté", "L'OCR n'a rien trouvé sur cette image.")],
				});
				return;
			}
			await interaction.editReply({
				embeds: [
					buildResultEmbed({
						imageUrl,
						source: result.source,
						translated: result.translated,
						detected: result.detectedLang,
						target: target ?? "FR",
						authorTag: interaction.user.tag,
					}),
				],
			});
		} catch (err) {
			logger.warn({ err }, "translate failed");
			await interaction.editReply({
				embeds: [errorEmbed("Échec traduction", err instanceof Error ? err.message : "Erreur inconnue.")],
			});
		}
	}

	@ContextMenu({ name: "Traduire en VF", type: ApplicationCommandType.Message })
	async translateMessage(interaction: MessageContextMenuCommandInteraction) {
		const avail = this.translator.available;
		if (!avail.ocr || !avail.deepl) {
			await interaction.reply({
				embeds: [errorEmbed("OCR / DeepL non configurés.")],
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const target = interaction.targetMessage;
		const image = pickImage(target);
		if (!image) {
			await interaction.reply({
				embeds: [warningEmbed("Aucune image dans ce message.")],
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		await interaction.deferReply();
		try {
			const result = await this.translator.ocrAndTranslate(image.url, "FR");
			if (!result) {
				await interaction.editReply({
					embeds: [warningEmbed("Pas de texte détecté.")],
				});
				return;
			}
			await interaction.editReply({
				embeds: [
					buildResultEmbed({
						imageUrl: image.url,
						source: result.source,
						translated: result.translated,
						detected: result.detectedLang,
						target: "FR",
						authorTag: target.author.tag,
					}),
				],
			});
		} catch (err) {
			logger.warn({ err }, "translate context-menu failed");
			await interaction.editReply({
				embeds: [errorEmbed("Échec traduction", err instanceof Error ? err.message : "Erreur inconnue.")],
			});
		}
	}
}
