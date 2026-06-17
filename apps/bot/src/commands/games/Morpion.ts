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
import { container } from "tsyringe";
import { ZENI_GAME_WIN, ZENI_GAME_LOSS_PENALTY } from "~/lib/constants";
import { buildChallengeMessage, challengeIdPattern, parseChallengeId } from "~/lib/challenge";

type Cell = "." | "X" | "O";
interface Game {
	board: Cell[];
	turn: "X" | "O";
	playerX: string;
	playerO: string;
	stake?: number;
}

interface PendingChallenge {
	challengerId: string;
	opponentId: string;
	stake?: number;
}

const games = new Map<string, Game>();
const challenges = new Map<string, PendingChallenge>();

// GC : une partie inactive est supprimée après le TTL configuré. Évite la
// fuite mémoire si les joueurs abandonnent. TTL configurable via setting
// `game.morpion.ttl_ms` (fallback 30 min).
async function scheduleGameGc(gameId: string) {
	const settings = container.resolve(SettingsService);
	const ttl = await settings.getInt("game.morpion.ttl_ms", 30 * 60_000);
	setTimeout(() => games.delete(gameId), ttl).unref();
}

const WIN_LINES = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

function winner(b: Cell[]): { line: number[]; mark: Cell } | "draw" | null {
	for (const line of WIN_LINES) {
		const [a, b2, c] = line;
		if (b[a!] !== "." && b[a!] === b[b2!] && b[a!] === b[c!]) {
			return { line, mark: b[a!] as Cell };
		}
	}
	return b.includes(".") ? null : "draw";
}

function botMove(b: Cell[]): number {
	// Heuristique simple : gagner > bloquer > centre > coin > random
	for (const mark of ["O", "X"] as const) {
		for (const [a, b2, c] of WIN_LINES) {
			const cells = [b[a!], b[b2!], b[c!]];
			if (cells.filter((x) => x === mark).length === 2 && cells.includes(".")) {
				const idx = [a!, b2!, c!][cells.indexOf(".")]!;
				if (mark === "O") return idx; // gagner
				return idx; // bloquer
			}
		}
	}
	if (b[4] === ".") return 4;
	for (const corner of [0, 2, 6, 8]) if (b[corner] === ".") return corner;
	const free = b.map((c, i) => (c === "." ? i : -1)).filter((i) => i >= 0);
	return free[Math.floor(Math.random() * free.length)] ?? 0;
}

function render(g: Game, gameId: string, winLine?: number[]): ActionRowBuilder<ButtonBuilder>[] {
	const rows: ActionRowBuilder<ButtonBuilder>[] = [];
	const winSet = new Set(winLine ?? []);
	for (let r = 0; r < 3; r++) {
		const row = new ActionRowBuilder<ButtonBuilder>();
		for (let c = 0; c < 3; c++) {
			const i = r * 3 + c;
			const cell = g.board[i]!;
			const onWinLine = winSet.has(i);
			const btn = new ButtonBuilder()
				.setCustomId(`morpion:${gameId}:${i}`)
				.setLabel(cell === "." ? "·" : cell)
				.setStyle(
					onWinLine
						? ButtonStyle.Success
						: cell === "X"
							? ButtonStyle.Primary
							: cell === "O"
								? ButtonStyle.Danger
								: ButtonStyle.Secondary
				)
				.setDisabled(cell !== "." || winLine !== undefined);
			row.addComponents(btn);
		}
		rows.push(row);
	}
	return rows;
}

function buildBoardEmbed(
	g: Game,
	status: "playing" | "draw" | "won",
	winnerMark?: Cell
): EmbedBuilder {
	const playerLine = `<@${g.playerX}> **(X)** vs ${g.playerO === "BOT" ? "**Bot** (O)" : `<@${g.playerO}> **(O)**`}`;
	const turnLine =
		status === "playing"
			? `Au tour de **${g.turn}** ${g.turn === "X" ? `<@${g.playerX}>` : g.playerO === "BOT" ? "(Bot)" : `<@${g.playerO}>`}`
			: status === "draw"
				? "🤝 **Égalité**"
				: `🎉 **${winnerMark} gagne !**`;

	const color = status === "won" ? 0x22c55e : status === "draw" ? 0x71717a : 0x3b82f6;
	return new EmbedBuilder()
		.setTitle("⭕ Morpion")
		.setDescription(`${playerLine}\n\n${turnLine}`)
		.setColor(color)
		.setTimestamp(new Date());
}

@Discord()
@Bot("kaio")
@Guard(GuildOnly, CommandsChannelOnly)
@injectable()
export class MorpionCommand {
	constructor(
		@inject(EconomyService) private eco: EconomyService,
		@inject(SettingsService) private settings: SettingsService,
		@inject(MessageTemplateService) private msg: MessageTemplateService
	) {}

	@Slash({ name: "morpion", description: "Morpion (tic-tac-toe)" })
	async morpion(
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
		if (mode === "joueur") {
			if (!opponent || opponent.bot || opponent.id === interaction.user.id) {
				await interaction.reply({ content: "Adversaire invalide.", flags: MessageFlags.Ephemeral });
				return;
			}
			// Si mise, vérifier que les deux joueurs ont le solde
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
				challengerId: interaction.user.id,
				opponentId: opponent.id,
				stake: mise,
			});
			const stakeLine = mise
				? `Mise **${mise} z** par joueur · gagnant **+${mise} z** · perdant **-${mise} z**`
				: `Gagnant **+${ZENI_GAME_WIN} z** · Perdant **-${ZENI_GAME_LOSS_PENALTY} z**`;
			const msg = buildChallengeMessage({
				scope: "morpion",
				key,
				challenger: interaction.user,
				opponent,
				gameTitle: "Morpion — Duel",
				gameEmoji: "⭕",
				stake: stakeLine,
			});
			await interaction.reply(msg);
			setTimeout(() => challenges.delete(key), 60_000).unref();
			return;
		}

		// Mode bot — démarrage immédiat
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
		const gameId = interaction.id;
		games.set(gameId, {
			board: Array(9).fill(".") as Cell[],
			turn: "X",
			playerX: interaction.user.id,
			playerO: "BOT",
			stake: mise,
		});
		scheduleGameGc(gameId);
		await interaction.reply({
			embeds: [buildBoardEmbed(games.get(gameId)!, "playing")],
			components: render(games.get(gameId)!, gameId),
		});
	}

	@ButtonComponent({ id: challengeIdPattern("morpion") })
	async onChallengeButton(interaction: ButtonInteraction) {
		const parsed = parseChallengeId(interaction.customId);
		if (!parsed) return;
		const challenge = challenges.get(parsed.key);
		if (!challenge) {
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
			await interaction.update({
				content: "",
				embeds: [
					new EmbedBuilder()
						.setTitle("⭕ Morpion — Refusé")
						.setDescription(`<@${challenge.opponentId}> a refusé le défi.`)
						.setColor(0xef4444),
				],
				components: [],
			});
			return;
		}
		challenges.delete(parsed.key);
		const gameId = parsed.key;
		games.set(gameId, {
			board: Array(9).fill(".") as Cell[],
			turn: "X",
			playerX: challenge.challengerId,
			playerO: challenge.opponentId,
			stake: challenge.stake,
		});
		scheduleGameGc(gameId);
		await interaction.update({
			content: "",
			embeds: [buildBoardEmbed(games.get(gameId)!, "playing")],
			components: render(games.get(gameId)!, gameId),
		});
	}

	@ButtonComponent({ id: /^morpion:\d+:[0-8]$/ })
	async move(interaction: ButtonInteraction) {
		const [, gameId, cellStr] = interaction.customId.split(":");
		const cell = parseInt(cellStr!, 10);
		const g = games.get(gameId!);
		if (!g) {
			await interaction.reply({ content: "Partie expirée.", flags: MessageFlags.Ephemeral });
			return;
		}
		const currentPlayer = g.turn === "X" ? g.playerX : g.playerO;
		if (currentPlayer !== "BOT" && interaction.user.id !== currentPlayer) {
			await interaction.reply({ content: "Pas ton tour.", flags: MessageFlags.Ephemeral });
			return;
		}
		if (g.board[cell] !== ".") return;
		g.board[cell] = g.turn;
		g.turn = g.turn === "X" ? "O" : "X";

		let result = winner(g.board);

		// Bot move
		if (!result && g.playerO === "BOT" && g.turn === "O") {
			const move = botMove(g.board);
			g.board[move] = "O";
			g.turn = "X";
			result = winner(g.board);
		}

		if (result) {
			if (result === "draw") {
				await interaction.update({
					embeds: [buildBoardEmbed(g, "draw")],
					components: render(g, gameId!),
				});
			} else {
				const winnerId = result.mark === "X" ? g.playerX : g.playerO;
				const loserId = result.mark === "X" ? g.playerO : g.playerX;
				// Si mise fournie au lancement, elle override win/loss. Sinon settings → constantes.
				const defaultWin = await this.settings.getInt("zeni.game.win", ZENI_GAME_WIN);
				const defaultLoss = await this.settings.getInt(
					"zeni.game.loss_penalty",
					ZENI_GAME_LOSS_PENALTY
				);
				const winReward = g.stake ?? defaultWin;
				const lossPenalty = g.stake ?? defaultLoss;
				if (winnerId !== "BOT") await this.eco.addZeni(winnerId, winReward, { kind: "game" });
				if (loserId !== "BOT" && lossPenalty > 0) await this.eco.removeZeni(loserId, lossPenalty);
				if (winnerId !== "BOT") {
					await this.msg.publish(
						"zeni_game_win",
						{ user: `<@${winnerId}>`, zeni: winReward, game: "morpion" },
						interaction.client
					);
				}
				const embed = buildBoardEmbed(g, "won", result.mark).addFields({
					name: "Récompense",
					value:
						winnerId === "BOT"
							? `<@${loserId}> -${lossPenalty} z`
							: loserId === "BOT"
								? `<@${winnerId}> +${winReward} z`
								: `<@${winnerId}> +${winReward} z · <@${loserId}> -${lossPenalty} z`,
				});
				await interaction.update({
					embeds: [embed],
					components: render(g, gameId!, result.line),
				});
			}
			games.delete(gameId!);
			return;
		}
		await interaction.update({
			embeds: [buildBoardEmbed(g, "playing")],
			components: render(g, gameId!),
		});
	}
}
