import { injectable, inject } from "tsyringe";
import {
	Bot,
	ButtonComponent,
	Discord,
	Guard,
	Slash,
	SlashChoice,
	SlashOption,
} from "@rpbey/discordy";
import { userTransformer } from "~/lib/slash-user";
import {
	ApplicationCommandOptionType,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageFlags,
	type ButtonInteraction,
	type CommandInteraction,
	type User,
} from "discord.js";
import { GuildOnly } from "~/guards/GuildOnly";
import { CommandsChannelOnly } from "~/guards/CommandsChannelOnly";
import { EconomyService } from "~/services/EconomyService";
import { SettingsService } from "~/services/SettingsService";
import { MessageTemplateService } from "~/services/MessageTemplateService";
import { ZENI_GAME_WIN, ZENI_GAME_LOSS_PENALTY } from "~/lib/constants";
import { type PfcChoice as Choice, decideBotChoice, resolvePfc } from "~/services/games/pfc";

const EMOJIS: Record<Choice, string> = { pierre: "🪨", feuille: "📄", ciseaux: "✂️" };

const pending = new Map<
	string,
	{ challenger: string; opponent: string; choice?: Choice; stake?: number }
>();
// Track la mise du mode bot par userId, lu au moment du callback button.
const botStakes = new Map<string, number>();

@Discord()
@Bot("kaio")
@Guard(GuildOnly, CommandsChannelOnly)
@injectable()
export class PfcCommand {
	constructor(
		@inject(EconomyService) private eco: EconomyService,
		@inject(SettingsService) private settings: SettingsService,
		@inject(MessageTemplateService) private msg: MessageTemplateService
	) {}

	@Slash({ name: "pfc", description: "Pierre-Feuille-Ciseaux" })
	async pfc(
		@SlashChoice({ name: "bot", value: "bot" })
		@SlashChoice({ name: "joueur", value: "joueur" })
		@SlashOption({
			name: "mode",
			description: "bot ou joueur",
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		mode: "bot" | "joueur",
		@SlashOption(
			{
				name: "adversaire",
				description: "Adversaire (si mode=joueur)",
				type: ApplicationCommandOptionType.User,
				required: false,
			},
			userTransformer
		)
		opponent: User | undefined,
		@SlashOption({
			name: "mise",
			description: "Mise en zénis (optionnel, override les gains par défaut)",
			type: ApplicationCommandOptionType.Integer,
			required: false,
			minValue: 1,
			maxValue: 1_000_000,
		})
		mise: number | undefined,
		interaction: CommandInteraction
	) {
		if (mode === "bot") {
			if (mise !== undefined) {
				const bal = await this.eco.getBalance(interaction.user.id);
				if (bal < mise) {
					await interaction.reply({
						content: `💸 Tu n'as que **${bal} z** (mise **${mise} z**).`,
						flags: MessageFlags.Ephemeral,
					});
					return;
				}
				botStakes.set(interaction.user.id, mise);
				// Auto-cleanup au cas où le user n'utilise pas son button (setting éditable)
				const cleanupMs = await this.settings.getInt("game.pfc.stake_cleanup_ms", 5 * 60_000);
				setTimeout(() => botStakes.delete(interaction.user.id), cleanupMs).unref();
			} else {
				botStakes.delete(interaction.user.id);
			}
			const titleLine = mise
				? `Mise **${mise} z** · win = +${mise}, lose = -${mise}`
				: "Choisis ton coup :";
			const embed = new EmbedBuilder()
				.setTitle("✊📄✂️ Pierre-Feuille-Ciseaux")
				.setDescription(titleLine)
				.setColor(0xfbbf24);
			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId(`pfc:bot:pierre:${interaction.user.id}`)
					.setEmoji("🪨")
					.setLabel("Pierre")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId(`pfc:bot:feuille:${interaction.user.id}`)
					.setEmoji("📄")
					.setLabel("Feuille")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId(`pfc:bot:ciseaux:${interaction.user.id}`)
					.setEmoji("✂️")
					.setLabel("Ciseaux")
					.setStyle(ButtonStyle.Secondary)
			);
			await interaction.reply({
				embeds: [embed],
				components: [row],
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		if (!opponent || opponent.bot || opponent.id === interaction.user.id) {
			await interaction.reply({ content: "Adversaire invalide.", flags: MessageFlags.Ephemeral });
			return;
		}
		if (mise !== undefined) {
			const [bal1, bal2] = await Promise.all([
				this.eco.getBalance(interaction.user.id),
				this.eco.getBalance(opponent.id),
			]);
			if (bal1 < mise) {
				await interaction.reply({
					content: `💸 Tu n'as que **${bal1} z** (mise **${mise} z**).`,
					flags: MessageFlags.Ephemeral,
				});
				return;
			}
			if (bal2 < mise) {
				await interaction.reply({
					content: `💸 ${opponent} n'a que **${bal2} z** (mise **${mise} z**).`,
					flags: MessageFlags.Ephemeral,
				});
				return;
			}
		}
		const key = `${interaction.id}`;
		pending.set(key, { challenger: interaction.user.id, opponent: opponent.id, stake: mise });
		// Auto-purge : si l'adversaire ne joue jamais, l'entrée resterait à vie (fuite
		// mémoire sur un process long-lived). On nettoie après le timeout du duel.
		const duelTtl = await this.settings.getInt("game.pfc.duel_timeout_ms", 10 * 60_000);
		setTimeout(() => pending.delete(key), duelTtl).unref();

		const stakeDesc = mise ? `\n💰 Mise : **${mise} z** par joueur` : "";
		const embed = new EmbedBuilder()
			.setTitle("✊📄✂️ Duel PFC")
			.setDescription(
				`${interaction.user} défie ${opponent} !\nChacun choisit en secret.${stakeDesc}`
			)
			.setColor(0xfbbf24);
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(`pfc:duel:pierre:${key}`)
				.setEmoji("🪨")
				.setLabel("Pierre")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`pfc:duel:feuille:${key}`)
				.setEmoji("📄")
				.setLabel("Feuille")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`pfc:duel:ciseaux:${key}`)
				.setEmoji("✂️")
				.setLabel("Ciseaux")
				.setStyle(ButtonStyle.Secondary)
		);
		await interaction.reply({ content: `${opponent}`, embeds: [embed], components: [row] });
	}

	@ButtonComponent({ id: /^pfc:bot:(pierre|feuille|ciseaux):\d+$/ })
	async vsBot(interaction: ButtonInteraction) {
		const [, , player, userId] = interaction.customId.split(":") as [
			string,
			string,
			Choice,
			string,
		];
		if (interaction.user.id !== userId) {
			await interaction.reply({ content: "Pas ta partie.", flags: MessageFlags.Ephemeral });
			return;
		}
		const botChoice = decideBotChoice();
		const result = resolvePfc(player, botChoice);

		let text = `Tu joues ${EMOJIS[player]} · Bot joue ${EMOJIS[botChoice]}\n\n`;
		const defaultWin = await this.settings.getInt("zeni.game.win", ZENI_GAME_WIN);
		const defaultLoss = await this.settings.getInt(
			"zeni.game.loss_penalty",
			ZENI_GAME_LOSS_PENALTY
		);
		const stake = botStakes.get(userId);
		botStakes.delete(userId);
		const winReward = stake ?? defaultWin;
		const lossPenalty = stake ?? defaultLoss;
		if (result === "win") {
			await this.eco.addZeni(userId, winReward, { kind: "game" });
			text += `🎉 **Victoire** +${winReward} z`;
			await this.msg.publish(
				"zeni_game_win",
				{ user: `<@${userId}>`, zeni: winReward, game: "pfc" },
				interaction.client
			);
		} else if (result === "lose") {
			if (lossPenalty > 0) await this.eco.removeZeni(userId, lossPenalty);
			text += `😔 **Défaite** -${lossPenalty} z`;
		} else {
			text += "🤝 **Égalité**";
		}
		await interaction.update({
			embeds: [new EmbedBuilder().setTitle("PFC").setDescription(text).setColor(0xfbbf24)],
			components: [],
		});
	}

	@ButtonComponent({ id: /^pfc:duel:(pierre|feuille|ciseaux):\d+$/ })
	async vsPlayer(interaction: ButtonInteraction) {
		const [, , choice, key] = interaction.customId.split(":") as [string, string, Choice, string];
		const game = pending.get(key);
		if (!game) {
			await interaction.reply({ content: "Partie expirée.", flags: MessageFlags.Ephemeral });
			return;
		}
		if (interaction.user.id !== game.challenger && interaction.user.id !== game.opponent) {
			await interaction.reply({ content: "Pas ta partie.", flags: MessageFlags.Ephemeral });
			return;
		}
		const isChallenger = interaction.user.id === game.challenger;
		const field = isChallenger ? "challengerChoice" : "opponentChoice";
		const current = (game as Record<string, unknown>)[field] as Choice | undefined;
		if (current) {
			await interaction.reply({ content: "Tu as déjà joué.", flags: MessageFlags.Ephemeral });
			return;
		}
		(game as Record<string, unknown>)[field] = choice;
		await interaction.reply({
			content: `Choix enregistré : ${EMOJIS[choice]}`,
			flags: MessageFlags.Ephemeral,
		});

		const cC = (game as Record<string, unknown>).challengerChoice as Choice | undefined;
		const oC = (game as Record<string, unknown>).opponentChoice as Choice | undefined;
		if (cC && oC) {
			let winner: string | null = null;
			const duelResult = resolvePfc(cC, oC);
			if (duelResult === "win") winner = game.challenger;
			else if (duelResult === "lose") winner = game.opponent;

			const loser = winner ? (winner === game.challenger ? game.opponent : game.challenger) : null;
			let text = `<@${game.challenger}> ${EMOJIS[cC]} vs ${EMOJIS[oC]} <@${game.opponent}>\n\n`;
			if (winner && loser) {
				const defaultWin = await this.settings.getInt("zeni.game.win", ZENI_GAME_WIN);
				const defaultLoss = await this.settings.getInt(
					"zeni.game.loss_penalty",
					ZENI_GAME_LOSS_PENALTY
				);
				const winReward = game.stake ?? defaultWin;
				const lossPenalty = game.stake ?? defaultLoss;
				await this.eco.addZeni(winner, winReward, { kind: "game" });
				if (lossPenalty > 0) await this.eco.removeZeni(loser, lossPenalty);
				text += `🎉 <@${winner}> gagne +${winReward} z · <@${loser}> perd -${lossPenalty} z`;
				await this.msg.publish(
					"zeni_game_win",
					{ user: `<@${winner}>`, zeni: winReward, game: "pfc (duel)" },
					interaction.client
				);
			} else {
				text += "🤝 Égalité.";
			}
			const msg = interaction.message;
			await msg
				.edit({
					embeds: [
						new EmbedBuilder().setTitle("PFC — résultat").setDescription(text).setColor(0xfbbf24),
					],
					components: [],
				})
				.catch(() => {});
			pending.delete(key);
		}
	}
}
