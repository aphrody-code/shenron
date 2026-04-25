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
import { CommandsChannelOnly } from "~/guards/CommandsChannelOnly";
import { EconomyService } from "~/services/EconomyService";
import { ZENI_GAME_WIN, ZENI_GAME_LOSS_PENALTY } from "~/lib/constants";

const WORDS = [
  "kamehameha", "saiyan", "genkidama", "namek", "capsule", "dragonball", "chichi", "vegeta",
  "freezer", "cell", "bulma", "broly", "majinbuu", "piccolo", "tortue", "orange", "goku",
];

const MAX_ERRORS = 6;

@Discord()
@Guard(GuildOnly, CommandsChannelOnly)
@injectable()
export class PenduCommand {
  constructor(@inject(EconomyService) private eco: EconomyService) {}

  @Slash({ name: "pendu", description: "Jeu du pendu" })
  async pendu(
    @SlashChoice({ name: "bot", value: "bot" })
    @SlashChoice({ name: "joueur", value: "joueur" })
    @SlashOption({ name: "mode", description: "bot/joueur", type: ApplicationCommandOptionType.String, required: true })
    mode: "bot" | "joueur",
    @SlashOption({ name: "adversaire", description: "Adversaire", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    opponent: User | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.channel || !("send" in interaction.channel)) {
      await interaction.reply({ content: "Non supporté ici.", flags: MessageFlags.Ephemeral });
      return;
    }
    const word = WORDS[Math.floor(Math.random() * WORDS.length)]!;
    const guessed = new Set<string>();
    let errors = 0;

    const mask = () => word.split("").map((c) => (guessed.has(c) ? c : "_")).join(" ");
    const allowed = new Set([interaction.user.id, ...(mode === "joueur" && opponent && !opponent.bot ? [opponent.id] : [])]);

    if (mode === "joueur" && (!opponent || opponent.bot || opponent.id === interaction.user.id)) {
      await interaction.reply({ content: "Adversaire invalide.", flags: MessageFlags.Ephemeral });
      return;
    }

    const timeMs = mode === "bot" ? 90_000 : 5 * 60_000;
    await interaction.reply({ content: `🎯 Pendu — ${mask()}\nDevine lettre par lettre (${timeMs / 1000}s max).` });

    const collector = interaction.channel.createMessageCollector({
      filter: (m: Message) => allowed.has(m.author.id) && /^[a-zA-Z]$/.test(m.content.trim()),
      time: timeMs,
    });

    collector.on("collect", async (m) => {
      const letter = m.content.trim().toLowerCase();
      if (guessed.has(letter)) {
        await m.react("🔁").catch(() => {});
        return;
      }
      guessed.add(letter);
      if (word.includes(letter)) {
        await m.react("✅").catch(() => {});
        if (word.split("").every((c) => guessed.has(c))) {
          await this.eco.addZeni(m.author.id, ZENI_GAME_WIN);
          if (mode === "joueur" && opponent) {
            const loserId = m.author.id === interaction.user.id ? opponent.id : interaction.user.id;
            await this.eco.removeZeni(loserId, ZENI_GAME_LOSS_PENALTY);
            await interaction.followUp({ content: `🎉 <@${m.author.id}> gagne ! Mot : **${word}** (+${ZENI_GAME_WIN} z, <@${loserId}> -${ZENI_GAME_LOSS_PENALTY})` });
          } else {
            await interaction.followUp({ content: `🎉 Bravo <@${m.author.id}> ! Mot : **${word}** (+${ZENI_GAME_WIN} z)` });
          }
          collector.stop("won");
        } else {
          await interaction.followUp({ content: `Progress : ${mask()} (erreurs ${errors}/${MAX_ERRORS})` });
        }
      } else {
        errors++;
        await m.react("❌").catch(() => {});
        if (errors >= MAX_ERRORS) {
          await interaction.followUp({ content: `💀 Pendu ! Mot : **${word}**.` });
          collector.stop("lost");
        } else {
          await interaction.followUp({ content: `Erreur ${errors}/${MAX_ERRORS} · ${mask()}` });
        }
      }
    });
  }
}
