import { inject, injectable } from "tsyringe";
import { Bot, Discord, Guard, Slash, SlashChoice, SlashOption } from "@rpbey/discordy";
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
import { hybridSearch, type SearchOptions } from "~/lib/rag";

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
		@SlashOption({
			name: "personnage",
			description: "Filtrer les archives par personnage (ex. Son Goku, Vegeta)",
			type: ApplicationCommandOptionType.String,
			required: false,
		})
		entity: string | undefined,
		@SlashChoice({ name: "Français", value: "fr" })
		@SlashChoice({ name: "Anglais", value: "en" })
		@SlashOption({
			name: "langue",
			description: "Filtrer par langue des documents (fr ou en)",
			type: ApplicationCommandOptionType.String,
			required: false,
		})
		lang: string | undefined,
		@SlashOption({
			name: "source",
			description: "Filtrer par table/source de données (ex. db_characters, fandom-fr)",
			type: ApplicationCommandOptionType.String,
			required: false,
		})
		sourceId: string | undefined,
		interaction: CommandInteraction
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
			const opts: SearchOptions = {
				lang: lang || undefined,
				entity: entity || undefined,
				sourceId: sourceId || undefined,
			};
			const out = await hybridSearch(this.dbs.sqlite, q, 5, opts);
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

		// Réponse 100 % retrieval (RAG / tools) : on présente directement les
		// passages les plus pertinents des archives, SANS génération LLM. Citations
		// numérotées [n] reliant chaque extrait à la source listée plus bas.
		const top = results[0]!;
		const previews = results
			.slice(0, 3)
			.map((r, i) => {
				const meta = KIND_META[r.kind] ?? { icon: "•", label: r.kind };
				const snip = (r.snippet ?? "").replace(/\s+/g, " ").trim().slice(0, 280);
				const pct = Math.round((r.score ?? 0) * 100);
				return `**[${i + 1}] ${meta.icon} [${r.title}](${siteUrl(r.url)})** · ${pct}%\n> ${snip || "_(voir la source)_"}`;
			})
			.join("\n\n");

		const modeIcon = mode.startsWith("hybrid") ? "🔄" : "📋";
		const embed = new EmbedBuilder()
			.setColor(0x38bdf8)
			.setAuthor({ name: `Whis ${modeIcon} · Archives de l'Univers 7` })
			.setTitle(`❓ ${q.slice(0, 240)}`)
			.setDescription(
				`Voici les passages les plus pertinents de nos archives sur ta question :\n\n${previews}`.slice(
					0,
					4096
				)
			);

		// Ajout des sources consultées (mêmes numéros que les extraits ci-dessus)
		const sourcesText = results
			.map((r, i) => {
				const meta = KIND_META[r.kind] ?? { icon: "•", label: r.kind };
				return `[${i + 1}] ${meta.icon} [${r.title}](${siteUrl(r.url)})`;
			})
			.join("  ·  ");

		embed.addFields({
			name: "📜 Sources consultées",
			value: sourcesText.slice(0, 1024),
		});

		const filterLabels: string[] = [];
		if (entity) filterLabels.push(`personnage: ${entity}`);
		if (lang) filterLabels.push(`langue: ${lang === "fr" ? "Français" : "Anglais"}`);
		if (sourceId) filterLabels.push(`source: ${sourceId}`);
		const filterText = filterLabels.length > 0 ? ` · Filtres : ${filterLabels.join(", ")}` : "";

		embed.setFooter({
			text:
				(mode.startsWith("hybrid")
					? `RAG · Recherche hybride + rerank · ${results.length} sources`
					: `RAG · Recherche lexicale · ${results.length} sources`) + filterText,
		});

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Ouvrir la meilleure source")
				.setURL(siteUrl(top.url))
		);

		await interaction.editReply({ embeds: [embed], components: [row] });
	}
}
