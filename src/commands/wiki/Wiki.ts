import { injectable, inject } from "tsyringe";
import { Discord, Slash, SlashOption, Guard } from "@rpbey/discordx";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder,
  MessageFlags,
  type CommandInteraction,
  type AutocompleteInteraction,
} from "discord.js";
import { existsSync } from "node:fs";
import { basename } from "node:path";
import { Pagination } from "@rpbey/pagination";
import { GuildOnly } from "~/guards/GuildOnly";
import { WikiService, type CharacterWithRelations, type DBTransformation } from "~/services/WikiService";

const RACE_COLORS: Record<string, number> = {
  Saiyan: 0xf85b1a,
  Namekian: 0x22c55e,
  Human: 0x60a5fa,
  Android: 0x94a3b8,
  "Frieza Race": 0xe879f9,
  "Jiren Race": 0xdc2626,
  God: 0xfacc15,
  Majin: 0xec4899,
  Angel: 0xe2e8f0,
  Evil: 0x7f1d1d,
  "Nucleico benigno": 0x14b8a6,
  Nucleico: 0x6366f1,
  Unknown: 0x64748b,
};

/**
 * Si `image` est un path local, retourne un Attachment + URL attachment://
 * Sinon retourne juste l'URL (HTTP).
 */
function asEmbedImage(imagePath: string): { url: string; attachment: AttachmentBuilder | null } {
  if (imagePath.startsWith("http")) return { url: imagePath, attachment: null };
  if (!existsSync(imagePath)) return { url: imagePath, attachment: null };
  const filename = basename(imagePath).replace(/[^a-zA-Z0-9._-]/g, "_");
  const att = new AttachmentBuilder(imagePath, { name: filename });
  return { url: `attachment://${filename}`, attachment: att };
}

@Discord()
@Guard(GuildOnly)
@injectable()
export class WikiCommands {
  constructor(@inject(WikiService) private api: WikiService) {}

  private charEmbed(c: CharacterWithRelations): { embed: EmbedBuilder; attachment: AttachmentBuilder | null } {
    const color = RACE_COLORS[c.race ?? ""] ?? 0xfbbf24;
    const img = asEmbedImage(c.image);
    const embed = new EmbedBuilder()
      .setTitle(c.name)
      .setColor(color)
      .setThumbnail(img.url)
      .addFields(
        { name: "Race", value: c.race || "—", inline: true },
        { name: "Genre", value: c.gender || "—", inline: true },
        { name: "Affiliation", value: c.affiliation || "—", inline: true },
        { name: "Ki", value: c.ki || "—", inline: true },
        { name: "Ki max", value: c.maxKi || "—", inline: true },
        { name: "Planète d'origine", value: c.originPlanet?.name ?? "—", inline: true },
      )
      .setDescription((c.description ?? "").slice(0, 1500))
      .setFooter({ text: `ID ${c.id} · source: dragonball-api.com` });
    if (c.transformations.length) {
      embed.addFields({
        name: `Transformations (${c.transformations.length})`,
        value: c.transformations.map((t) => `• **${t.name}** — ki ${t.ki}`).join("\n").slice(0, 1024),
      });
    }
    return { embed, attachment: img.attachment };
  }

  private transformationEmbed(c: CharacterWithRelations, t: DBTransformation, idx: number): { embed: EmbedBuilder; attachment: AttachmentBuilder | null } {
    const color = RACE_COLORS[c.race ?? ""] ?? 0xfbbf24;
    const charImg = asEmbedImage(c.image);
    const transfoImg = asEmbedImage(t.image);
    const embed = new EmbedBuilder()
      .setAuthor({ name: c.name, iconURL: charImg.url })
      .setTitle(t.name)
      .setImage(transfoImg.url)
      .setColor(color)
      .addFields({ name: "Ki", value: t.ki || "—", inline: true })
      .setFooter({ text: `Transformation ${idx + 1}/${c.transformations.length} · ${c.name}` });
    return { embed, attachment: transfoImg.attachment };
  }

  @Slash({ name: "wiki", description: "Consulter le wiki Dragon Ball (personnages)" })
  async wiki(
    @SlashOption({
      name: "personnage",
      description: "Nom du personnage (autocomplete)",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    })
    query: string,
    interaction: CommandInteraction | AutocompleteInteraction,
  ) {
    if (interaction.isAutocomplete()) {
      const focus = interaction.options.getFocused();
      const matches = await this.api.search(focus, 25);
      await interaction.respond(matches.map((c) => ({ name: `${c.name} (${c.race ?? "?"})`, value: String(c.id) })));
      return;
    }

    await (interaction as CommandInteraction).deferReply();

    let char: CharacterWithRelations | null = null;
    const maybeId = parseInt(query, 10);
    if (!isNaN(maybeId)) char = await this.api.getCharacter(maybeId);
    if (!char) {
      const matches = await this.api.search(query, 1);
      if (matches.length > 0) char = await this.api.getCharacter(matches[0]!.id);
    }
    if (!char) {
      await (interaction as CommandInteraction).editReply({ content: `❌ Personnage "${query}" introuvable. Lance \`/wiki\` avec l'autocomplete.` });
      return;
    }

    // Pages: [fiche, ...transfo embeds]
    const pages: Array<{ embeds: EmbedBuilder[]; files?: AttachmentBuilder[] }> = [];
    const main = this.charEmbed(char);
    pages.push({ embeds: [main.embed], files: main.attachment ? [main.attachment] : [] });
    char.transformations.forEach((t, i) => {
      const e = this.transformationEmbed(char!, t, i);
      pages.push({ embeds: [e.embed], files: e.attachment ? [e.attachment] : [] });
    });

    if (pages.length === 1) {
      await (interaction as CommandInteraction).editReply(pages[0]!);
      return;
    }
    const pagination = new Pagination(interaction as CommandInteraction, pages, { time: 120_000 });
    await pagination.send();
  }

  @Slash({ name: "races", description: "Liste les personnages par race" })
  async races(
    @SlashOption({
      name: "race",
      description: "Race (ex: Saiyan, Namekian)",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    })
    race: string,
    interaction: CommandInteraction | AutocompleteInteraction,
  ) {
    if (interaction.isAutocomplete()) {
      const races = await this.api.listRaces();
      const focus = interaction.options.getFocused().toLowerCase();
      await interaction.respond(
        races
          .filter((r) => r.toLowerCase().includes(focus))
          .slice(0, 25)
          .map((r) => ({ name: r, value: r })),
      );
      return;
    }

    await (interaction as CommandInteraction).deferReply({ flags: MessageFlags.Ephemeral });
    const filtered = await this.api.listByRace(race);
    if (filtered.length === 0) {
      await (interaction as CommandInteraction).editReply({ content: `Aucun personnage pour la race "${race}".` });
      return;
    }
    const embed = new EmbedBuilder()
      .setTitle(`Race : ${race} (${filtered.length})`)
      .setDescription(filtered.map((c) => `• **${c.name}** — ki ${c.ki ?? "?"}`).join("\n").slice(0, 4000))
      .setColor(RACE_COLORS[race] ?? 0xfbbf24)
      .setFooter({ text: "Local DB" });
    await (interaction as CommandInteraction).editReply({ embeds: [embed] });
  }

  @Slash({ name: "planete", description: "Fiche d'une planète Dragon Ball" })
  async planete(
    @SlashOption({
      name: "planete",
      description: "Nom de la planète",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    })
    query: string,
    interaction: CommandInteraction | AutocompleteInteraction,
  ) {
    if (interaction.isAutocomplete()) {
      // Recherche locale
      const focus = interaction.options.getFocused().toLowerCase();
      const all = await this.api.listPlanets();
      await interaction.respond(
        all
          .filter((p) => p.name.toLowerCase().includes(focus))
          .slice(0, 25)
          .map((p) => ({ name: p.name, value: String(p.id) })),
      );
      return;
    }
    await (interaction as CommandInteraction).deferReply();
    const id = parseInt(query, 10);
    const planet = await this.api.getPlanet(isNaN(id) ? 0 : id);
    if (!planet) {
      await (interaction as CommandInteraction).editReply({ content: `Planète introuvable.` });
      return;
    }
    const img = asEmbedImage(planet.image);
    const embed = new EmbedBuilder()
      .setTitle(planet.name)
      .setColor(planet.isDestroyed ? 0xdc2626 : 0x22c55e)
      .setImage(img.url)
      .setDescription(planet.description?.slice(0, 1500) ?? "—")
      .setFooter({ text: planet.isDestroyed ? "⚠️ Détruite" : "✅ Existante" });
    await (interaction as CommandInteraction).editReply({
      embeds: [embed],
      files: img.attachment ? [img.attachment] : [],
    });
  }
}
