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

const WORDS = [
	"kamehameha",
	"saiyan",
	"genkidama",
	"namek",
	"capsule",
	"dragonball",
	"chichi",
	"vegeta",
	"freezer",
	"cell",
	"bulma",
	"broly",
	"majinbuu",
	"piccolo",
	"tortue",
	"orange",
	"goku",
];

const MAX_ERRORS = 6;
const HANGMAN_FRAMES = [
	"```\n        \n        \n        \n        \n        \n========\n```",
	"```\n  +---+\n  |   |\n      |\n      |\n      |\n========\n```",
	"```\n  +---+\n  |   |\n  O   |\n      |\n      |\n========\n```",
	"```\n  +---+\n  |   |\n  O   |\n  |   |\n      |\n========\n```",
	"```\n  +---+\n  |   |\n  O   |\n /|   |\n      |\n========\n```",
	"```\n  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n========\n```",
	"```\n  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n========\n```",
];

interface PendingChallenge {
	word: string;
	challengerId: string;
	opponentId: string;
	channelId: string;
	expiresAt: number;
	stake?: number;
}

const challenges = new Map<string, PendingChallenge>();

@Discord()
@Bot("kaio")
@Guard(GuildOnly, CommandsChannelOnly)
@injectable()
export class PenduCommand {
	constructor(
		@inject(EconomyService) private eco: EconomyService,
		@inject(SettingsService) private settings: SettingsService,
		@inject(MessageTemplateService) private msg: MessageTemplateService
	) {}

	/** MAX_ERRORS borné par HANGMAN_FRAMES.length-1 (=6). Setting peut être configuré 3-6. */
	private async maxErrors(): Promise<number> {
		const v = await this.settings.getInt("game.pendu.max_errors", MAX_ERRORS);
		return Math.max(3, Math.min(MAX_ERRORS, v));
	}

	@Slash({ name: "pendu", description: "Jeu du pendu (mot DBZ)" })
	async pendu(
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
			description: "Mise en zénis (optionnel, override les gains par défaut)",
			type: ApplicationCommandOptionType.Integer,
			required: false,
			minValue: 1,
			maxValue: 1_000_000,
		})
		mise: number | undefined,
		interaction: CommandInteraction
	) {
		if (!interaction.channel || !("send" in interaction.channel)) {
			await interaction.reply({ content: "Non supporté ici.", flags: MessageFlags.Ephemeral });
			return;
		}
		const word = WORDS[Math.floor(Math.random() * WORDS.length)]!;

		if (mode === "joueur") {
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
			const key = interaction.id;
			challenges.set(key, {
				word,
				challengerId: interaction.user.id,
				opponentId: opponent.id,
				channelId: interaction.channel.id,
				expiresAt: Date.now() + 60_000,
				stake: mise,
			});
			const stakeLine = mise
				? `Mise **${mise} z** par joueur · gagnant **+${mise} z** · perdant **-${mise} z**`
				: `Gagnant **+${ZENI_GAME_WIN} z** · Perdant **-${ZENI_GAME_LOSS_PENALTY} z**`;
			const msg = buildChallengeMessage({
				scope: "pendu",
				key,
				challenger: interaction.user,
				opponent,
				gameTitle: "Pendu — Duel",
				gameEmoji: "🎯",
				stake: stakeLine,
				extraFields: [
					{ name: "Mot mystère", value: `**${word.length} lettres**`, inline: true },
					{ name: "Durée", value: "5 min", inline: true },
				],
			});
			await interaction.reply(msg);
			// GC après expiration (.unref() pour ne pas garder l'event-loop éveillé)
			setTimeout(() => {
				const c = challenges.get(key);
				if (c && c.expiresAt <= Date.now()) challenges.delete(key);
			}, 65_000).unref();
			return;
		}

		if (mise !== undefined) {
			const bal = await this.eco.getBalance(interaction.user.id);
			if (bal < mise) {
				await interaction.reply({
					content: `💸 Tu n'as que **${bal} z** (mise **${mise} z**).`,
					flags: MessageFlags.Ephemeral,
				});
				return;
			}
		}
		await this.startSoloPendu(interaction, word, mise);
	}

	@ButtonComponent({ id: challengeIdPattern("pendu") })
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
				.setTitle("🎯 Pendu — Refusé")
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
					.setTitle("🎯 Pendu — Duel accepté")
					.setDescription(`<@${challenge.opponentId}> accepte ! La partie démarre…`)
					.setColor(0x22c55e),
			],
			components: [],
		});
		await this.runDuelPendu(
			interaction,
			challenge.word,
			challenge.challengerId,
			challenge.opponentId,
			challenge.stake
		);
	}

	/** Mode solo (vs bot) — déclenché direct depuis /pendu mode:bot. */
	private async startSoloPendu(interaction: CommandInteraction, word: string, stake?: number) {
		if (!interaction.channel || !("createMessageCollector" in interaction.channel)) return;
		const guessed = new Set<string>();
		let errors = 0;
		const allowed = new Set([interaction.user.id]);
		const defaultWin = await this.settings.getInt("zeni.game.win", ZENI_GAME_WIN);
		const defaultLoss = await this.settings.getInt(
			"zeni.game.loss_penalty",
			ZENI_GAME_LOSS_PENALTY
		);
		const winReward = stake ?? defaultWin;
		const lossPenalty = stake ?? defaultLoss;
		const maxErrors = await this.maxErrors();

		const buildEmbed = (status: "playing" | "won" | "lost") =>
			this.buildPenduEmbed({ word, guessed, errors, status, players: [interaction.user.id] });

		await interaction.reply({ embeds: [buildEmbed("playing")] });

		const collector = interaction.channel.createMessageCollector({
			// Accepte 1 lettre OU le mot entier (≥2 lettres) pour deviner d'un coup.
			filter: (m: Message) => allowed.has(m.author.id) && /^[a-zA-Z]{1,32}$/.test(m.content.trim()),
			time: 90_000,
		});

		collector.on("collect", async (m) => {
			const guess = m.content.trim().toLowerCase();
			// ── Tentative de mot complet ────────────────────────────────────
			if (guess.length > 1) {
				if (guess === word) {
					for (const c of word) guessed.add(c);
					await m.react("🏆").catch(() => {});
					await this.eco.addZeni(interaction.user.id, winReward, { kind: "game" });
					await this.msg.publish(
						"zeni_game_win",
						{ user: `<@${interaction.user.id}>`, zeni: winReward, game: "pendu" },
						interaction.client
					);
					await interaction.followUp({ embeds: [buildEmbed("won")] });
					collector.stop("won");
					return;
				}
				// Mauvaise réponse : pénalise une erreur (ne peut deviner à l'infini)
				errors++;
				await m.react("❌").catch(() => {});
				if (errors >= maxErrors) {
					if (lossPenalty > 0) await this.eco.removeZeni(interaction.user.id, lossPenalty);
					await interaction.followUp({ embeds: [buildEmbed("lost")] });
					collector.stop("lost");
					return;
				}
				await interaction.followUp({ embeds: [buildEmbed("playing")] });
				return;
			}
			// ── Tentative d'une lettre ──────────────────────────────────────
			const letter = guess;
			if (guessed.has(letter)) {
				await m.react("🔁").catch(() => {});
				return;
			}
			guessed.add(letter);
			if (word.includes(letter)) {
				await m.react("✅").catch(() => {});
				if (word.split("").every((c) => guessed.has(c))) {
					await this.eco.addZeni(interaction.user.id, winReward, { kind: "game" });
					await this.msg.publish(
						"zeni_game_win",
						{ user: `<@${interaction.user.id}>`, zeni: winReward, game: "pendu" },
						interaction.client
					);
					await interaction.followUp({ embeds: [buildEmbed("won")] });
					collector.stop("won");
					return;
				}
			} else {
				errors++;
				await m.react("❌").catch(() => {});
				if (errors >= maxErrors) {
					if (lossPenalty > 0) await this.eco.removeZeni(interaction.user.id, lossPenalty);
					await interaction.followUp({ embeds: [buildEmbed("lost")] });
					collector.stop("lost");
					return;
				}
			}
			await interaction.followUp({ embeds: [buildEmbed("playing")] });
		});

		collector.on("end", async (_c, reason) => {
			if (reason === "time") {
				if (lossPenalty > 0)
					await this.eco.removeZeni(interaction.user.id, lossPenalty).catch(() => {});
				await interaction.followUp({ embeds: [buildEmbed("lost")] }).catch(() => {});
			}
		});
	}

	/** Duel joueur vs joueur — démarré après acceptance du challenge. */
	private async runDuelPendu(
		interaction: ButtonInteraction,
		word: string,
		challengerId: string,
		opponentId: string,
		stake?: number
	) {
		if (!interaction.channel || !("createMessageCollector" in interaction.channel)) return;
		const guessed = new Set<string>();
		let errors = 0;
		const allowed = new Set([challengerId, opponentId]);

		const buildEmbed = (status: "playing" | "won" | "lost", winnerId?: string) =>
			this.buildPenduEmbed({
				word,
				guessed,
				errors,
				status,
				players: [challengerId, opponentId],
				winnerId,
			});

		const followUpChannel = interaction.channel;
		await followUpChannel.send({ embeds: [buildEmbed("playing")] });
		const defaultWin = await this.settings.getInt("zeni.game.win", ZENI_GAME_WIN);
		const defaultLoss = await this.settings.getInt(
			"zeni.game.loss_penalty",
			ZENI_GAME_LOSS_PENALTY
		);
		const winReward = stake ?? defaultWin;
		const lossPenalty = stake ?? defaultLoss;
		const maxErrors = await this.maxErrors();

		const challengeTimeoutMs = await this.settings.getInt("game.challenge_timeout_ms", 5 * 60_000);
		const collector = followUpChannel.createMessageCollector({
			filter: (m: Message) => allowed.has(m.author.id) && /^[a-zA-Z]{1,32}$/.test(m.content.trim()),
			time: challengeTimeoutMs,
		});

		const finishWin = async (winnerId: string) => {
			const loserId = winnerId === challengerId ? opponentId : challengerId;
			await this.eco.addZeni(winnerId, winReward, { kind: "game" });
			if (lossPenalty > 0) await this.eco.removeZeni(loserId, lossPenalty);
			await this.msg.publish(
				"zeni_game_win",
				{ user: `<@${winnerId}>`, zeni: winReward, game: "pendu (duel)" },
				followUpChannel.client
			);
			await followUpChannel.send({ embeds: [buildEmbed("won", winnerId)] });
			collector.stop("won");
		};

		collector.on("collect", async (m) => {
			const guess = m.content.trim().toLowerCase();
			// ── Mot complet ────────────────────────────────────────────────
			if (guess.length > 1) {
				if (guess === word) {
					for (const c of word) guessed.add(c);
					await m.react("🏆").catch(() => {});
					await finishWin(m.author.id);
					return;
				}
				errors++;
				await m.react("❌").catch(() => {});
				if (errors >= maxErrors) {
					await followUpChannel.send({ embeds: [buildEmbed("lost")] });
					collector.stop("lost");
					return;
				}
				await followUpChannel.send({ embeds: [buildEmbed("playing")] });
				return;
			}
			// ── Lettre seule ───────────────────────────────────────────────
			const letter = guess;
			if (guessed.has(letter)) {
				await m.react("🔁").catch(() => {});
				return;
			}
			guessed.add(letter);
			if (word.includes(letter)) {
				await m.react("✅").catch(() => {});
				if (word.split("").every((c) => guessed.has(c))) {
					await finishWin(m.author.id);
					return;
				}
			} else {
				errors++;
				await m.react("❌").catch(() => {});
				if (errors >= maxErrors) {
					await followUpChannel.send({ embeds: [buildEmbed("lost")] });
					collector.stop("lost");
					return;
				}
			}
			await followUpChannel.send({ embeds: [buildEmbed("playing")] });
		});

		collector.on("end", async (_c, reason) => {
			if (reason === "time") {
				await followUpChannel.send({ embeds: [buildEmbed("lost")] }).catch(() => {});
			}
		});
	}

	private buildPenduEmbed(args: {
		word: string;
		guessed: Set<string>;
		errors: number;
		status: "playing" | "won" | "lost";
		players: string[];
		winnerId?: string;
	}): EmbedBuilder {
		const { word, guessed, errors, status, players, winnerId } = args;
		const reveal = word
			.split("")
			.map((c) => (status !== "playing" || guessed.has(c) ? c : "·"))
			.join(" ")
			.toUpperCase();
		const wrong =
			[...guessed]
				.filter((l) => !word.includes(l))
				.toSorted()
				.join(" · ")
				.toUpperCase() || "—";
		const right =
			[...guessed]
				.filter((l) => word.includes(l))
				.toSorted()
				.join(" · ")
				.toUpperCase() || "—";

		const color = status === "won" ? 0x22c55e : status === "lost" ? 0xef4444 : 0xfbbf24;

		const title =
			status === "won"
				? `🎉 Pendu — ${winnerId ? `<@${winnerId}> gagne` : "Victoire"} !`
				: status === "lost"
					? "💀 Pendu — Perdu"
					: "🎯 Pendu";

		const playersLine =
			players.length === 1 ? `<@${players[0]}>` : `<@${players[0]}> vs <@${players[1]}>`;

		const embed = new EmbedBuilder()
			.setTitle(title)
			.setDescription(
				[
					`**Joueurs :** ${playersLine}`,
					`**Mot (${word.length} lettres)** : \`${reveal}\``,
					HANGMAN_FRAMES[errors] ?? HANGMAN_FRAMES[HANGMAN_FRAMES.length - 1]!,
				].join("\n")
			)
			.addFields(
				{ name: "Erreurs", value: `${errors} / ${MAX_ERRORS}`, inline: true },
				{ name: "Lettres trouvées", value: right, inline: true },
				{ name: "Lettres ratées", value: wrong, inline: true }
			)
			.setColor(color);

		if (status === "playing") {
			embed.setFooter({
				text: "Réponds avec une lettre, ou tente le mot complet (risque +1 erreur).",
			});
		} else if (status === "lost") {
			embed.addFields({ name: "Mot", value: `||${word}||`, inline: false });
		} else if (status === "won") {
			const reward =
				players.length === 2
					? `**+${ZENI_GAME_WIN} z** au gagnant · **-${ZENI_GAME_LOSS_PENALTY} z** au perdant`
					: `**+${ZENI_GAME_WIN} zenis**`;
			embed.addFields({ name: "Récompense", value: reward, inline: false });
		}
		return embed;
	}
}
