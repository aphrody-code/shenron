import { Discord, Slash, SlashOption, Guard } from "@rpbey/discordx";
import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  type CommandInteraction,
  type User,
} from "discord.js";
import { GuildOnly } from "~/guards/GuildOnly";
import { env } from "~/lib/env";

/**
 * Helper: % aléatoire stable par jour et par user (déterministe dans la journée).
 * Comme ça /gay sur la même cible renvoie le même % tant que c'est le même jour.
 */
function stablePercent(userId: string, salt: string): number {
  const today = Math.floor(Date.now() / 86_400_000);
  let h = 2166136261;
  for (const ch of `${userId}:${salt}:${today}`) {
    h ^= ch.charCodeAt(0);
    h = (h * 16777619) >>> 0;
  }
  return h % 101;
}

@Discord()
@Guard(GuildOnly)
export class FunCommands {
  @Slash({ name: "gay", description: "% aléatoire de gaytitude (fun)" })
  async gay(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true })
    target: User,
    interaction: CommandInteraction,
  ) {
    const pct = target.id === env.OWNER_ID ? 0 : stablePercent(target.id, "gay");
    const bar = "█".repeat(Math.round(pct / 10)) + "░".repeat(10 - Math.round(pct / 10));
    const embed = new EmbedBuilder()
      .setTitle("🌈 Gaydar de Bulma")
      .setDescription(`${target} est gay à **${pct}%**\n\`${bar}\``)
      .setColor(0xec4899)
      .setFooter({ text: "Scanner calibré sur Master Roshi" });
    await interaction.reply({ embeds: [embed] });
  }

  @Slash({ name: "raciste", description: "% aléatoire de racisme (fun)" })
  async raciste(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true })
    target: User,
    interaction: CommandInteraction,
  ) {
    // Spec: si utilisée sur l'owner → 101%
    const pct = target.id === env.OWNER_ID ? 101 : stablePercent(target.id, "raciste");
    const bar = pct >= 100
      ? "██████████"
      : "█".repeat(Math.round(pct / 10)) + "░".repeat(10 - Math.round(pct / 10));
    const embed = new EmbedBuilder()
      .setTitle("🔥 Racism-o-mètre de Mr. Popo")
      .setDescription(`${target} est raciste à **${pct}%**\n\`${bar}\``)
      .setColor(0x991b1b)
      .setFooter({ text: "Scanner calibré sur Commander Red" });
    await interaction.reply({ embeds: [embed] });
  }
}
