import { injectable, inject } from "tsyringe";
import { Discord, Slash, SlashOption, SlashChoice, Guard, ButtonComponent } from "@rpbey/discordx";
import { userTransformer } from "~/lib/slash-user";
import {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  type ButtonInteraction,
  type CommandInteraction,
  type User,
} from "discord.js";
import { GuildOnly } from "~/guards/GuildOnly";
import { CommandsChannelOnly } from "~/guards/CommandsChannelOnly";
import { EconomyService } from "~/services/EconomyService";
import { ZENI_GAME_WIN, ZENI_GAME_LOSS_PENALTY } from "~/lib/constants";

type Cell = "." | "X" | "O";
interface Game {
  board: Cell[];
  turn: "X" | "O";
  playerX: string;
  playerO: string;
}

const games = new Map<string, Game>();

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winner(b: Cell[]): Cell | "draw" | null {
  for (const [a, b2, c] of WIN_LINES) {
    if (b[a!] !== "." && b[a!] === b[b2!] && b[a!] === b[c!]) return b[a!] as Cell;
  }
  return b.includes(".") ? null : "draw";
}

function botMove(b: Cell[]): number {
  const free = b.map((c, i) => (c === "." ? i : -1)).filter((i) => i >= 0);
  return free[Math.floor(Math.random() * free.length)] ?? 0;
}

function render(g: Game, gameId: string): ActionRowBuilder<ButtonBuilder>[] {
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  for (let r = 0; r < 3; r++) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    for (let c = 0; c < 3; c++) {
      const i = r * 3 + c;
      const cell = g.board[i]!;
      const btn = new ButtonBuilder()
        .setCustomId(`morpion:${gameId}:${i}`)
        .setLabel(cell === "." ? "·" : cell)
        .setStyle(cell === "X" ? ButtonStyle.Primary : cell === "O" ? ButtonStyle.Danger : ButtonStyle.Secondary)
        .setDisabled(cell !== ".");
      row.addComponents(btn);
    }
    rows.push(row);
  }
  return rows;
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
    @SlashOption({ name: "adversaire", description: "Adversaire", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    opponent: User | undefined,
    interaction: CommandInteraction,
  ) {
    const gameId = interaction.id;
    const isBot = mode === "bot";
    if (!isBot && (!opponent || opponent.bot || opponent.id === interaction.user.id)) {
      await interaction.reply({ content: "Adversaire invalide.", flags: MessageFlags.Ephemeral });
      return;
    }
    const playerO = isBot ? "BOT" : opponent!.id;
    games.set(gameId, {
      board: Array(9).fill(".") as Cell[],
      turn: "X",
      playerX: interaction.user.id,
      playerO,
    });
    await interaction.reply({
      content: `🎯 Morpion — <@${interaction.user.id}> (X) vs ${isBot ? "Bot" : `<@${playerO}>`} (O)\nAu tour de X.`,
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
    let text = `Morpion — <@${g.playerX}> (X) vs ${g.playerO === "BOT" ? "Bot" : `<@${g.playerO}>`} (O)\n`;

    // Bot move
    if (!result && g.playerO === "BOT" && g.turn === "O") {
      const move = botMove(g.board);
      g.board[move] = "O";
      g.turn = "X";
      result = winner(g.board);
    }

    if (result) {
      text += result === "draw" ? "🤝 Égalité." : `🎉 Victoire de ${result}.`;
      if (result === "X" || result === "O") {
        const winnerId = result === "X" ? g.playerX : g.playerO;
        const loserId = result === "X" ? g.playerO : g.playerX;
        if (winnerId !== "BOT") await this.eco.addZeni(winnerId, ZENI_GAME_WIN);
        if (loserId !== "BOT") await this.eco.removeZeni(loserId, ZENI_GAME_LOSS_PENALTY);
      }
      games.delete(gameId!);
      await interaction.update({ content: text, components: render(g, gameId!) });
      return;
    }
    text += `Au tour de ${g.turn}.`;
    await interaction.update({ content: text, components: render(g, gameId!) });
  }
}
