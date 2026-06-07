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
	EmbedBuilder,
	MessageFlags,
	type ButtonInteraction,
	type CommandInteraction,
	type Message,
	type User,
} from "discord.js";
import { GuildOnly } from "~/guards/GuildOnly";
import { CommandsChannelOnly } from "~/guards/CommandsChannelOnly";
import { EconomyService } from "~/services/EconomyService";
import { ZENI_GAME_WIN, ZENI_GAME_LOSS_PENALTY } from "~/lib/constants";
import { SettingsService } from "~/services/SettingsService";
import { MessageTemplateService } from "~/services/MessageTemplateService";
import { buildChallengeMessage, challengeIdPattern, parseChallengeId } from "~/lib/challenge";

interface PendingChallenge {
	target: number;
	challengerId: string;
	opponentId: string;
	channelId: string;
	stake: number;
	expiresAt: number;
}

const challenges = new Map<string, PendingChallenge>();

@Discord()
@Bot("kaio")
@Guard(GuildOnly, CommandsChannelOnly)
@injectable()
export class BingoCommand {
	constructor(
		@inject(EconomyService) private eco: EconomyService,
		@inject(SettingsService) private settings: SettingsService,
		@inject(MessageTemplateService) private msg: MessageTemplateService
	) {}

	@Slash({ name: "bingo", description: "Devine le nombre" })
	async bingo(
		@SlashChoice({ name: "bot", value: "bot" })
		@SlashChoice({ name: "joueur", value: "joueur" })
		@SlashOption({
			name: "mode",
			description: "bot/joueur",
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		mode: "bot" | "joueur",
		@SlashOption(
			{
				name: "adversaire",
				description: "Adversaire (mode joueur)",
				type: ApplicationCommandOptionType.User,
				required: false,
			},
			userTransformer
		)
		opponent: User | undefined,
		@SlashOption({
			name: "mise",
			description: `Mise zenis mode joueur (défaut ${ZENI_GAME_LOSS_PENALTY}, perdant paie, gagnant +${ZENI_GAME_WIN} bonus)`,
			type: ApplicationCommandOptionType.Integer,
			required: false,
			minValue: 1,
			maxValue: 1_000_000,
		})
		mise: number | undefined,
		interaction: CommandInteraction
	) {
		if (
			!interaction.channel ||
			!interaction.channel.isTextBased() ||
			!("send" in interaction.channel)
		) {
			await interaction.reply({ content: "Non supporté ici.", flags: MessageFlags.Ephemeral });
			return;
		}
		const target = Math.floor(Math.random() * 100) + 1;

		if (mode === "bot") {
			const limitMs = await this.settings.getInt("game.bingo.limit_ms", 60_000);
			const winReward = await this.settings.getInt("zeni.game.win", ZENI_GAME_WIN);
			await interaction.reply({
				content: `🎲 J'ai choisi un nombre entre 1 et 100. Tu as ${limitMs / 1000}s pour deviner ! (envoie tes essais dans ce salon)`,
			});
			const collector = interaction.channel.createMessageCollector({
				filter: (m: Message) => m.author.id === interaction.user.id && /^\d+$/.test(m.content),
				time: limitMs,
			});
			collector.on("collect", async (m) => {
				const guess = parseInt(m.content, 10);
				if (guess === target) {
					await this.eco.addZeni(interaction.user.id, winReward);
					await m.reply(`🎉 Bingo ! C'était ${target}. +${winReward} z`);
					await this.msg.publish(
						"zeni_game_win",
						{ user: `<@${interaction.user.id}>`, zeni: winReward, game: "bingo" },
						interaction.client
					);
					collector.stop("won");
				} else {
					await m.reply(guess < target ? "📈 Plus haut" : "📉 Plus bas").catch(() => {});
				}
			});
			collector.on("end", async (_c, reason) => {
				if (reason !== "won")
					await interaction
						.followUp({ content: `⌛ Temps écoulé. C'était ${target}.` })
						.catch(() => {});
			});
			return;
		}

		// ── Mode joueur ────────────────────────────────────────────────
		if (!opponent || opponent.bot || opponent.id === interaction.user.id) {
			await interaction.reply({ content: "Adversaire invalide.", flags: MessageFlags.Ephemeral });
			return;
		}

		const defaultStake = await this.settings.getInt(
			"zeni.game.loss_penalty",
			ZENI_GAME_LOSS_PENALTY
		);
		const winBonus = await this.settings.getInt("zeni.game.win", ZENI_GAME_WIN);
		const stake = mise ?? defaultStake;
		// Vérification fonds (les deux joueurs doivent pouvoir couvrir la mise)
		const [challengerBal, opponentBal] = await Promise.all([
			this.eco.getBalance(interaction.user.id),
			this.eco.getBalance(opponent.id),
		]);
		if (challengerBal < stake) {
			await interaction.reply({
				content: `💸 Tu n'as que **${challengerBal} z**, mise demandée **${stake} z**. Réduis la mise ou farm un peu d'XP.`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		if (opponentBal < stake) {
			await interaction.reply({
				content: `💸 ${opponent} n'a que **${opponentBal} z** — mise **${stake} z** trop élevée pour son solde.`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const key = interaction.id;
		challenges.set(key, {
			target,
			challengerId: interaction.user.id,
			opponentId: opponent.id,
			channelId: interaction.channel.id,
			stake,
			expiresAt: Date.now() + 60_000,
		});
		const msg = buildChallengeMessage({
			scope: "bingo",
			key,
			challenger: interaction.user,
			opponent,
			gameTitle: "Bingo — Duel",
			gameEmoji: "🎲",
			stake: `Mise **${stake} z** par joueur · gagnant **+${winBonus + stake} z** · perdant **-${stake} z**`,
			extraFields: [{ name: "Plage", value: "1 → 100", inline: true }],
		});
		await interaction.reply(msg);
		setTimeout(() => {
			const c = challenges.get(key);
			if (c && c.expiresAt <= Date.now()) challenges.delete(key);
		}, 65_000).unref();
	}

	@ButtonComponent({ id: challengeIdPattern("bingo") })
	async onChallengeButton(interaction: ButtonInteraction) {
		const parsed = parseChallengeId(interaction.customId);
		if (!parsed) return;
		const challenge = challenges.get(parsed.key);
		if (!challenge || challenge.expiresAt <= Date.now()) {
			challenges.delete(parsed.key);
			await interaction
				.update({ content: "Défi expiré.", embeds: [], components: [] })
				.catch(() => {});
			return;
		}
		if (interaction.user.id !== challenge.opponentId) {
			await interaction.reply({
				content: "Ce défi ne t'est pas adressé.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		if (parsed.action === "decline") {
			challenges.delete(parsed.key);
			const embed = new EmbedBuilder()
				.setTitle("🎲 Bingo — Refusé")
				.setDescription(
					`<@${challenge.opponentId}> a **refusé** le défi de <@${challenge.challengerId}>.`
				)
				.setColor(0xef4444);
			await interaction.update({ content: "", embeds: [embed], components: [] });
			return;
		}
		// accept
		challenges.delete(parsed.key);
		await interaction.update({
			content: "",
			embeds: [
				new EmbedBuilder()
					.setTitle("🎲 Bingo — Duel accepté")
					.setDescription(
						`<@${challenge.opponentId}> accepte le défi de <@${challenge.challengerId}> · mise **${challenge.stake} z** ! 🚀\nPremier à deviner entre **1** et **100** gagne.`
					)
					.setColor(0x22c55e),
			],
			components: [],
		});
		await this.runDuel(interaction, challenge);
	}

	private async runDuel(interaction: ButtonInteraction, challenge: PendingChallenge) {
		if (!interaction.channel || !("createMessageCollector" in interaction.channel)) return;
		const followUpChannel = interaction.channel;
		const challengeTimeoutMs = await this.settings.getInt("game.challenge_timeout_ms", 5 * 60_000);
		const collector = followUpChannel.createMessageCollector({
			filter: (m: Message) =>
				(m.author.id === challenge.challengerId || m.author.id === challenge.opponentId) &&
				/^\d+$/.test(m.content),
			time: challengeTimeoutMs,
		});
		collector.on("collect", async (m) => {
			const guess = parseInt(m.content, 10);
			if (guess < 1 || guess > 100) {
				await m.react("⛔").catch(() => {});
				return;
			}
			if (guess === challenge.target) {
				const winnerId = m.author.id;
				const loserId =
					winnerId === challenge.challengerId ? challenge.opponentId : challenge.challengerId;
				// Re-check des fonds avant débit (peut avoir changé entre challenge accept et match)
				const ok = await this.eco.removeZeni(loserId, challenge.stake);
				if (!ok) {
					await m.reply(
						`⚠️ <@${loserId}> n'a plus assez de zenis pour payer la mise (${challenge.stake} z). Match annulé.`
					);
					collector.stop("insolvent");
					return;
				}
				const winBonus2 = await this.settings.getInt("zeni.game.win", ZENI_GAME_WIN);
				const reward = winBonus2 + challenge.stake;
				await this.eco.addZeni(winnerId, reward);
				await m.reply(
					`🎉 Bingo ! C'était **${challenge.target}**. <@${winnerId}> gagne **+${reward} z** · <@${loserId}> perd **-${challenge.stake} z**.`
				);
				await this.msg.publish(
					"zeni_game_win",
					{ user: `<@${winnerId}>`, zeni: reward, game: "bingo (duel)" },
					m.client
				);
				collector.stop("won");
			} else {
				await m.react(guess < challenge.target ? "📈" : "📉").catch(() => {});
			}
		});
		collector.on("end", async (_c, reason) => {
			if (reason === "time") {
				await followUpChannel
					.send({ content: `⌛ Temps écoulé. C'était **${challenge.target}**. Match nul.` })
					.catch(() => {});
			}
		});
	}
}
