import { inject, injectable } from "tsyringe";
import { Bot, Discord, Guard, Slash, SlashOption } from "@rpbey/discordy";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  type CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { GuildOnly } from "~/guards/GuildOnly";
import { CommandsChannelOnly } from "~/guards/CommandsChannelOnly";
import { FeatureEnabled } from "~/guards/FeatureEnabled";
import { DatabaseService } from "~/db/index";
import { hybridSearch, generateAnswer } from "~/lib/rag";

const SITE = "https://dragonballfr.com";

/** Métadonnées d'affichage par type de chunk RAG. */
const KIND_META: Record<string, { icon: string; label: string }> = {
  character: { icon: "🥋", label: "Personnage" },
  planet: { icon: "🪐", label: "Planète" },
  race: { icon: "🧬", label: "Race" },
  technique: { icon: "⚡", label: "Technique" },
  transformation: { icon: "🔥", label: "Transformation" },
  saga: { icon: "📖", label: "Saga" },
  movie: { icon: "🎬", label: "Film" },
  game: { icon: "🎮", label: "Jeu" },
  episode: { icon: "📺", label: "Épisode" },
  source: { icon: "📜", label: "Source" },
};

/**
 * Construit l'URL absolue d'un résultat. Les URLs RAG sont relatives au site
 * (`/wiki/...`) ; on préfixe par le domaine de prod.
 */
function siteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * `/ask` — Pose une question en langage naturel sur l'univers Dragon Ball.
 * Retrieval hybride (BM25 + embeddings denses, fusion RRF) sur les archives du
 * wiki ; réponse = passages les plus pertinents, sourcés et liés au site.
 * Persona Whis (savoir / pédagogie). Cf. lib/rag.ts.
 */
@Discord()
@Bot("whis")
@Guard(GuildOnly, CommandsChannelOnly, FeatureEnabled("features.wiki", "Le wiki"))
@injectable()
export class AskCommands {
  constructor(@inject(DatabaseService) private dbs: DatabaseService) {}

  @Slash({
    name: "ask",
    description: "Pose une question sur l'univers Dragon Ball (recherche IA hybride)",
  })
  async ask(
    @SlashOption({
      name: "question",
      description: "Ta question, en français (ex. comment Goku devient Super Saiyan)",
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    question: string,
    interaction: CommandInteraction,
  ) {
    await interaction.deferReply();
    const q = question.trim();
    if (q.length < 3) {
      await interaction.editReply({
        content: "Pose une question un peu plus précise, jeune disciple.",
      });
      return;
    }

    let results: Awaited<ReturnType<typeof hybridSearch>>["results"] = [];
    let mode = "lexical";
    try {
      const out = await hybridSearch(this.dbs.sqlite, q, 5);
      results = out.results;
      mode = out.mode;
    } catch {
      await interaction.editReply({
        content: "Les archives sont momentanément inaccessibles. Réessaie dans un instant.",
      });
      return;
    }

    if (results.length === 0) {
      await interaction.editReply({
        content: `Même les archives de l'Univers 7 restent muettes sur « ${q} ». Reformule ta question.`,
      });
      return;
    }

    // RAG LLM Génératif : Whis rédige une réponse personnalisée basée sur le contexte
    let answer = "";
    try {
      answer = await generateAnswer(this.dbs.sqlite, q, results);
    } catch (err) {
      console.error("Génération de réponse LLM échouée:", err);
    }

    const top = results[0]!;
    const embed = new EmbedBuilder()
      .setColor(0x38bdf8)
      .setAuthor({ name: "Whis · Guide de l'Univers 7" })
      .setTitle(`❓ ${q.slice(0, 240)}`)
      .setDescription(
        answer || "Je n'ai pas trouvé de réponse claire dans nos archives, jeune guerrier. Cependant, voici les documents pertinents :"
      );

    // Ajout des sources consultées
    const sourcesText = results
      .map((r) => {
        const meta = KIND_META[r.kind] ?? { icon: "•", label: r.kind };
        return `${meta.icon} [${r.title}](${siteUrl(r.url)})`;
      })
      .join("  ·  ");

    embed.addFields({
      name: "📜 Sources consultées",
      value: sourcesText.slice(0, 1024),
    });

    embed.setFooter({
      text: mode.startsWith("hybrid")
        ? `RAG LLM · Recherche hybride + rerank · ${results.length} sources`
        : `RAG LLM · Recherche lexicale · ${results.length} sources`,
    });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Ouvrir la meilleure source")
        .setURL(siteUrl(top.url)),
    );

    await interaction.editReply({ embeds: [embed], components: [row] });
  }
}
