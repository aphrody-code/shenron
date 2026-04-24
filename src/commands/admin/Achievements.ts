import { injectable, inject } from "tsyringe";
import { Discord, Slash, SlashOption, Guard, SlashGroup } from "@rpbey/discordx";
import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits,
  type CommandInteraction,
} from "discord.js";
import { GuildOnly } from "~/guards/GuildOnly";
import { AdminOnly } from "~/guards/AdminOnly";
import { AchievementService } from "~/services/AchievementService";

@Discord()
@Guard(GuildOnly, AdminOnly)
@SlashGroup({ name: "succes", description: "Admin: gestion des succès auto-déclenchés", defaultMemberPermissions: PermissionFlagsBits.Administrator })
@SlashGroup("succes")
@injectable()
export class AchievementAdmin {
  constructor(@inject(AchievementService) private ach: AchievementService) {}

  @Slash({ name: "set", description: "Créer/éditer un trigger de succès" })
  async set(
    @SlashOption({ name: "code", description: "Code du succès (ex: KAMEHAMEHA)", type: ApplicationCommandOptionType.String, required: true })
    code: string,
    @SlashOption({ name: "pattern", description: "Regex JavaScript à matcher dans les messages", type: ApplicationCommandOptionType.String, required: true })
    pattern: string,
    @SlashOption({ name: "description", description: "Description", type: ApplicationCommandOptionType.String, required: false })
    description: string | undefined,
    @SlashOption({ name: "flags", description: "Flags regex (défaut: i)", type: ApplicationCommandOptionType.String, required: false })
    flags: string | undefined,
    interaction: CommandInteraction,
  ) {
    try {
      new RegExp(pattern, flags ?? "i"); // on valide juste la regex
    } catch (err) {
      await interaction.reply({ content: `❌ Regex invalide : ${(err as Error).message}`, flags: MessageFlags.Ephemeral });
      return;
    }
    await this.ach.upsert({ code, pattern, description, flags });
    await interaction.reply({ content: `✅ Trigger \`${code}\` enregistré : \`/${pattern}/${flags ?? "i"}\``, flags: MessageFlags.Ephemeral });
  }

  @Slash({ name: "list", description: "Lister les triggers" })
  async list(interaction: CommandInteraction) {
    const list = await this.ach.list();
    if (list.length === 0) {
      await interaction.reply({ content: "Aucun trigger.", flags: MessageFlags.Ephemeral });
      return;
    }
    const embed = new EmbedBuilder()
      .setTitle("Triggers de succès")
      .setDescription(
        list
          .map(
            (t) =>
              `**\`${t.code}\`** ${t.enabled ? "✅" : "🚫"}\n` +
              `  regex: \`/${t.pattern}/${t.flags ?? "i"}\`\n` +
              `  ${t.description ?? "—"}`,
          )
          .join("\n\n"),
      )
      .setColor(0xfbbf24);
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }

  @Slash({ name: "remove", description: "Supprimer un trigger" })
  async remove(
    @SlashOption({ name: "code", description: "Code", type: ApplicationCommandOptionType.String, required: true })
    code: string,
    interaction: CommandInteraction,
  ) {
    await this.ach.remove(code);
    await interaction.reply({ content: `✅ Trigger \`${code}\` supprimé.`, flags: MessageFlags.Ephemeral });
  }
}
