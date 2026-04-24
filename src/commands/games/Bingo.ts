import { injectable, inject } from "tsyringe";
import { Discord, Slash, SlashOption, SlashChoice, Guard } from "@rpbey/discordx";
import { userTransformer } from "~/lib/slash-user";
import {
  ApplicationCommandOptionType,
  MessageFlags,
  type CommandInteraction,
  type Message,
  type User,
} from "discord.js";
import { GuildOnly } from "~/guards/GuildOnly";
import { EconomyService } from "~/services/EconomyService";
import { ZENI_GAME_WIN, ZENI_GAME_LOSS_PENALTY } from "~/lib/constants";

@Discord()
@Guard(GuildOnly)
@injectable()
export class BingoCommand {
  constructor(@inject(EconomyService) private eco: EconomyService) {}

  @Slash({ name: "bingo", description: "Devine le nombre" })
  async bingo(
    @SlashChoice({ name: "bot", value: "bot" })
    @SlashChoice({ name: "joueur", value: "joueur" })
    @SlashOption({ name: "mode", description: "bot/joueur", type: ApplicationCommandOptionType.String, required: true })
    mode: "bot" | "joueur",
    @SlashOption({ name: "adversaire", description: "Adversaire", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    opponent: User | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.channel || !interaction.channel.isTextBased() || !("send" in interaction.channel)) {
      await interaction.reply({ content: "Non supporté ici.", flags: MessageFlags.Ephemeral });
      return;
    }
    const target = Math.floor(Math.random() * 100) + 1;

    if (mode === "bot") {
      const limitMs = 60_000;
      await interaction.reply({ content: `🎲 J'ai choisi un nombre entre 1 et 100. Tu as ${limitMs / 1000}s pour deviner ! (envoie tes essais dans ce salon)` });
      const collector = interaction.channel.createMessageCollector({
        filter: (m: Message) => m.author.id === interaction.user.id && /^\d+$/.test(m.content),
        time: limitMs,
      });
      collector.on("collect", async (m) => {
        const guess = parseInt(m.content, 10);
        if (guess === target) {
          await this.eco.addZeni(interaction.user.id, ZENI_GAME_WIN);
          await m.reply(`🎉 Bingo ! C'était ${target}. +${ZENI_GAME_WIN} z`);
          collector.stop("won");
        } else {
          await m.reply(guess < target ? "📈 Plus haut" : "📉 Plus bas").catch(() => {});
        }
      });
      collector.on("end", async (_c, reason) => {
        if (reason !== "won") await interaction.followUp({ content: `⌛ Temps écoulé. C'était ${target}.` }).catch(() => {});
      });
      return;
    }

    if (!opponent || opponent.bot || opponent.id === interaction.user.id) {
      await interaction.reply({ content: "Adversaire invalide.", flags: MessageFlags.Ephemeral });
      return;
    }
    await interaction.reply({ content: `🎲 Bingo ! Entre 1 et 100. <@${interaction.user.id}> et ${opponent} : le premier à trouver gagne. Go !` });
    const collector = interaction.channel.createMessageCollector({
      filter: (m: Message) => (m.author.id === interaction.user.id || m.author.id === opponent.id) && /^\d+$/.test(m.content),
      time: 5 * 60_000,
    });
    collector.on("collect", async (m) => {
      const guess = parseInt(m.content, 10);
      if (guess === target) {
        const loserId = m.author.id === interaction.user.id ? opponent.id : interaction.user.id;
        await this.eco.addZeni(m.author.id, ZENI_GAME_WIN);
        await this.eco.removeZeni(loserId, ZENI_GAME_LOSS_PENALTY);
        await m.reply(`🎉 Bingo ! C'était ${target}. <@${m.author.id}> gagne +${ZENI_GAME_WIN} z (<@${loserId}> -${ZENI_GAME_LOSS_PENALTY} z)`);
        collector.stop("won");
      } else {
        await m.react(guess < target ? "📈" : "📉").catch(() => {});
      }
    });
  }
}
