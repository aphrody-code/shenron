import { injectable, inject } from "tsyringe";
import { Discord, Slash, SlashOption, SlashChoice, Guard, ButtonComponent } from "@rpbey/discordx";
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
import { EconomyService } from "~/services/EconomyService";
import { ZENI_GAME_WIN, ZENI_GAME_LOSS_PENALTY } from "~/lib/constants";

type Choice = "pierre" | "feuille" | "ciseaux";

const EMOJIS: Record<Choice, string> = { pierre: "🪨", feuille: "📄", ciseaux: "✂️" };
const WINS: Record<Choice, Choice> = { pierre: "ciseaux", feuille: "pierre", ciseaux: "feuille" };

const pending = new Map<string, { challenger: string; opponent: string; choice?: Choice }>();

@Discord()
@Guard(GuildOnly)
@injectable()
export class PfcCommand {
  constructor(@inject(EconomyService) private eco: EconomyService) {}

  @Slash({ name: "pfc", description: "Pierre-Feuille-Ciseaux" })
  async pfc(
    @SlashChoice({ name: "bot", value: "bot" })
    @SlashChoice({ name: "joueur", value: "joueur" })
    @SlashOption({ name: "mode", description: "bot ou joueur", type: ApplicationCommandOptionType.String, required: true })
    mode: "bot" | "joueur",
    @SlashOption({ name: "adversaire", description: "Adversaire (si mode=joueur)", type: ApplicationCommandOptionType.User, required: false })
    opponent: User | undefined,
    interaction: CommandInteraction,
  ) {
    if (mode === "bot") {
      const embed = new EmbedBuilder().setTitle("✊📄✂️ Pierre-Feuille-Ciseaux").setDescription("Choisis ton coup :").setColor(0xfbbf24);
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`pfc:bot:pierre:${interaction.user.id}`).setEmoji("🪨").setLabel("Pierre").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`pfc:bot:feuille:${interaction.user.id}`).setEmoji("📄").setLabel("Feuille").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`pfc:bot:ciseaux:${interaction.user.id}`).setEmoji("✂️").setLabel("Ciseaux").setStyle(ButtonStyle.Secondary),
      );
      await interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
      return;
    }

    if (!opponent || opponent.bot || opponent.id === interaction.user.id) {
      await interaction.reply({ content: "Adversaire invalide.", flags: MessageFlags.Ephemeral });
      return;
    }
    const key = `${interaction.id}`;
    pending.set(key, { challenger: interaction.user.id, opponent: opponent.id });

    const embed = new EmbedBuilder()
      .setTitle("✊📄✂️ Duel PFC")
      .setDescription(`${interaction.user} défie ${opponent} !\nChacun choisit en secret.`)
      .setColor(0xfbbf24);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`pfc:duel:pierre:${key}`).setEmoji("🪨").setLabel("Pierre").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`pfc:duel:feuille:${key}`).setEmoji("📄").setLabel("Feuille").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`pfc:duel:ciseaux:${key}`).setEmoji("✂️").setLabel("Ciseaux").setStyle(ButtonStyle.Secondary),
    );
    await interaction.reply({ content: `${opponent}`, embeds: [embed], components: [row] });
  }

  @ButtonComponent({ id: /^pfc:bot:(pierre|feuille|ciseaux):\d+$/ })
  async vsBot(interaction: ButtonInteraction) {
    const [, , player, userId] = interaction.customId.split(":") as [string, string, Choice, string];
    if (interaction.user.id !== userId) {
      await interaction.reply({ content: "Pas ta partie.", flags: MessageFlags.Ephemeral });
      return;
    }
    const botChoice: Choice = (["pierre", "feuille", "ciseaux"] as const)[Math.floor(Math.random() * 3)]!;
    let result: "win" | "lose" | "draw";
    if (player === botChoice) result = "draw";
    else if (WINS[player] === botChoice) result = "win";
    else result = "lose";

    let text = `Tu joues ${EMOJIS[player]} · Bot joue ${EMOJIS[botChoice]}\n\n`;
    if (result === "win") {
      await this.eco.addZeni(userId, ZENI_GAME_WIN);
      text += `🎉 **Victoire** +${ZENI_GAME_WIN} z`;
    } else if (result === "lose") {
      text += "😔 **Défaite**";
    } else {
      text += "🤝 **Égalité**";
    }
    await interaction.update({ embeds: [new EmbedBuilder().setTitle("PFC").setDescription(text).setColor(0xfbbf24)], components: [] });
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
    await interaction.reply({ content: `Choix enregistré : ${EMOJIS[choice]}`, flags: MessageFlags.Ephemeral });

    const cC = (game as Record<string, unknown>).challengerChoice as Choice | undefined;
    const oC = (game as Record<string, unknown>).opponentChoice as Choice | undefined;
    if (cC && oC) {
      let winner: string | null = null;
      if (cC === oC) winner = null;
      else if (WINS[cC] === oC) winner = game.challenger;
      else winner = game.opponent;

      const loser = winner ? (winner === game.challenger ? game.opponent : game.challenger) : null;
      let text = `<@${game.challenger}> ${EMOJIS[cC]} vs ${EMOJIS[oC]} <@${game.opponent}>\n\n`;
      if (winner && loser) {
        await this.eco.addZeni(winner, ZENI_GAME_WIN);
        await this.eco.removeZeni(loser, ZENI_GAME_LOSS_PENALTY);
        text += `🎉 <@${winner}> gagne +${ZENI_GAME_WIN} z · <@${loser}> perd -${ZENI_GAME_LOSS_PENALTY} z`;
      } else {
        text += "🤝 Égalité.";
      }
      const msg = interaction.message;
      await msg.edit({ embeds: [new EmbedBuilder().setTitle("PFC — résultat").setDescription(text).setColor(0xfbbf24)], components: [] }).catch(() => {});
      pending.delete(key);
    }
  }
}
