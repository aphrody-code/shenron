import { injectable, inject } from "tsyringe";
import { Discord, Slash, SlashOption, SlashChoice, Guard, ButtonComponent } from "@rpbey/discordx";
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
import { ZENI_GAME_WIN, ZENI_GAME_LOSS_PENALTY } from "~/lib/constants";
import {
  buildChallengeMessage,
  challengeIdPattern,
  parseChallengeId,
} from "~/lib/challenge";

type Cell = "." | "X" | "O";
interface Game {
  board: Cell[];
  turn: "X" | "O";
  playerX: string;
  playerO: string;
}

interface PendingChallenge {
  challengerId: string;
  opponentId: string;
}

const games = new Map<string, Game>();
const challenges = new Map<string, PendingChallenge>();

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
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
                : ButtonStyle.Secondary,
        )
        .setDisabled(cell !== "." || winLine !== undefined);
      row.addComponents(btn);
    }
    rows.push(row);
  }
  return rows;
}

function buildBoardEmbed(g: Game, status: "playing" | "draw" | "won", winnerMark?: Cell): EmbedBuilder {
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
@Guard(GuildOnly, CommandsChannelOnly)
@injectable()
export class MorpionCommand {
  constructor(@inject(EconomyService) private eco: EconomyService) {}

  @Slash({ name: "morpion", description: "Morpion (tic-tac-toe)" })
  async morpion(
    @SlashChoice({ name: "bot", value: "bot" })
    @SlashChoice({ name: "joueur", value: "joueur" })
    @SlashOption({ name: "mode", description: "bot/joueur", type: ApplicationCommandOptionType.String, required: true })
    mode: "bot" | "joueur",
    @SlashOption({ name: "adversaire", description: "Adversaire (mode joueur)", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    opponent: User | undefined,
    interaction: CommandInteraction,
  ) {
    if (mode === "joueur") {
      if (!opponent || opponent.bot || opponent.id === interaction.user.id) {
        await interaction.reply({ content: "Adversaire invalide.", flags: MessageFlags.Ephemeral });
        return;
      }
      const key = interaction.id;
      challenges.set(key, { challengerId: interaction.user.id, opponentId: opponent.id });
      const msg = buildChallengeMessage({
        scope: "morpion",
        key,
        challenger: interaction.user,
        opponent,
        gameTitle: "Morpion — Duel",
        gameEmoji: "⭕",
        stake: `Gagnant **+${ZENI_GAME_WIN} z** · Perdant **-${ZENI_GAME_LOSS_PENALTY} z**`,
      });
      await interaction.reply(msg);
      setTimeout(() => challenges.delete(key), 60_000);
      return;
    }

    // Mode bot — démarrage immédiat
    const gameId = interaction.id;
    games.set(gameId, {
      board: Array(9).fill(".") as Cell[],
      turn: "X",
      playerX: interaction.user.id,
      playerO: "BOT",
    });
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
      await interaction.update({ content: "Défi expiré.", embeds: [], components: [] }).catch(() => {});
      return;
    }
    if (interaction.user.id !== challenge.opponentId) {
      await interaction.reply({ content: "Ce défi ne t'est pas adressé.", flags: MessageFlags.Ephemeral });
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
    });
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
        if (winnerId !== "BOT") await this.eco.addZeni(winnerId, ZENI_GAME_WIN);
        if (loserId !== "BOT") await this.eco.removeZeni(loserId, ZENI_GAME_LOSS_PENALTY);
        const embed = buildBoardEmbed(g, "won", result.mark).addFields({
          name: "Récompense",
          value:
            winnerId === "BOT"
              ? `<@${loserId}> -${ZENI_GAME_LOSS_PENALTY} z`
              : loserId === "BOT"
                ? `<@${winnerId}> +${ZENI_GAME_WIN} z`
                : `<@${winnerId}> +${ZENI_GAME_WIN} z · <@${loserId}> -${ZENI_GAME_LOSS_PENALTY} z`,
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
