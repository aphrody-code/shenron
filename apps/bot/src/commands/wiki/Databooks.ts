import { injectable, inject } from "tsyringe";
import { Bot, Discord, Guard, Slash, SlashGroup, SlashOption } from "@rpbey/discordy";
import {
	ApplicationCommandOptionType,
	EmbedBuilder,
	MessageFlags,
	type APIEmbed,
	type AutocompleteInteraction,
	type CommandInteraction,
} from "discord.js";
import { Pagination } from "@rpbey/pagination";
import { GuildOnly } from "~/guards/GuildOnly";
import { CommandsChannelOnly } from "~/guards/CommandsChannelOnly";
import { FeatureEnabled } from "~/guards/FeatureEnabled";
import {
	DatabooksService,
	type Databook,
	type PlancheTrouvee,
} from "~/services/DatabooksService";

/**
 * `/databooks` — guides officiels, daizenshuu, artbooks et interviews.
 *
 * L'intérêt n'est pas le catalogue (le site l'affiche mieux), c'est
 * **`/databooks recherche`** : les planches sont transcrites depuis les scans
 * japonais, et jusqu'ici ce texte n'était interrogeable nulle part — ni sur le
 * site, ni ici. La sous-commande s'appuie sur l'index trigramme posé sur le
 * PostgreSQL du site (`bot.databook_pages_text`), le seul capable de chercher
 * dans du japonais, une langue sans espaces que la recherche plein texte de
 * PostgreSQL ne sait pas segmenter.
 *
 * Les données viennent de l'API du site, pas du SQLite local : cf. l'en-tête de
 * `DatabooksService` pour la raison (les transcriptions sont PostgreSQL-only).
 */

/** Couleur d'embed par famille d'ouvrage, pour distinguer d'un coup d'œil. */
const COULEURS: Record<string, number> = {
	Databook: 0xf59e0b,
	"Art Book": 0xa855f7,
	Guidebook: 0x38bdf8,
	Interview: 0x22c55e,
};

const COULEUR_DEFAUT = 0xfbbf24;

const SITE = Bun.env.SITE_PUBLIC_URL ?? "https://dragonballfr.com";
const ASSETS = Bun.env.API_PUBLIC_URL ?? "https://bot.dragonballfr.com";

/** Chemin d'asset DB (`./assets/…`) → URL absolue servie par le bot. */
function assetUrl(chemin: string | null): string | null {
	if (!chemin) return null;
	if (chemin.startsWith("http")) return chemin;
	return `${ASSETS}/db/${chemin.replace(/^\.?\/*/, "")}`;
}

/** La recherche nomme le champ `categorie`, l'API de fiche `category` : on prend la valeur. */
function couleur(categorie: string | null): number {
	return COULEURS[categorie ?? ""] ?? COULEUR_DEFAUT;
}

/** Les dates du wiki sont en secondes (cf. normalisation de l'API databooks). */
function annee(published: number | null): string {
	if (!published) return "—";
	const d = new Date(published * 1000);
	return Number.isNaN(d.getTime()) ? "—" : String(d.getUTCFullYear());
}

/**
 * Tronque sans couper un mot en deux, et signale la coupe.
 *
 * Discord plafonne une description d'embed à 4 096 caractères ; une planche peut
 * en faire 8 171. On coupe donc, mais en le disant — un lecteur qui ne voit pas
 * la troncature croit avoir lu la planche entière.
 */
function tronquer(texte: string, max: number): string {
	if (texte.length <= max) return texte;
	const coupe = texte.slice(0, max);
	const espace = coupe.lastIndexOf("\n");
	return `${(espace > max * 0.6 ? coupe.slice(0, espace) : coupe).trimEnd()}\n\n*…texte tronqué*`;
}

@Discord()
@Bot("whis")
@Guard(GuildOnly, CommandsChannelOnly, FeatureEnabled("features.wiki", "Le wiki"))
@SlashGroup({
	name: "databooks",
	description: "Guides officiels, daizenshuu, artbooks et interviews Dragon Ball",
})
@SlashGroup("databooks")
@injectable()
export class DatabooksCommands {
	constructor(@inject(DatabooksService) private api: DatabooksService) {}

	/** Réponse d'autocomplete commune : titre + année, valeur = id. */
	private async completerOuvrage(interaction: AutocompleteInteraction): Promise<void> {
		const focus = interaction.options.getFocused();
		const fiches = await this.api.searchTitles(focus, 25);
		await interaction.respond(
			fiches.map((d) => ({
				name: `${d.title.slice(0, 85)} (${annee(d.published_at)})`,
				value: String(d.id),
			}))
		);
	}

	private ficheEmbed(d: Databook): EmbedBuilder {
		const transcrites = d.pages.filter((p) => (p.text ?? "").trim().length > 0).length;
		const embed = new EmbedBuilder()
			.setTitle(d.title)
			.setURL(`${SITE}/wiki/databooks/${d.id}`)
			.setColor(couleur(d.category))
			.addFields(
				{ name: "Catégorie", value: d.category ?? d.kind ?? "—", inline: true },
				{ name: "Parution", value: annee(d.published_at), inline: true },
				{ name: "Auteur", value: d.author ?? "—", inline: true }
			);

		if (d.title_ja) embed.setAuthor({ name: d.title_ja });
		const cover = assetUrl(d.cover);
		if (cover) embed.setThumbnail(cover);
		if (d.description?.trim()) embed.setDescription(tronquer(d.description.trim(), 1200));

		if (d.pages.length > 0) {
			embed.addFields({
				name: "Planches",
				value:
					`${d.pages.length} planche${d.pages.length > 1 ? "s" : ""} · ` +
					`${transcrites} transcrite${transcrites > 1 ? "s" : ""} ` +
					`(${Math.round((transcrites / d.pages.length) * 100)} %)`,
				inline: false,
			});
		}
		embed.setFooter({
			text: d.pages.length > 0 ? `/databooks planche ouvrage:${d.title.slice(0, 40)}` : "dragonballfr.com",
		});
		return embed;
	}

	@Slash({ name: "fiche", description: "Afficher un ouvrage (couverture, parution, avancement)" })
	async fiche(
		@SlashOption({
			name: "ouvrage",
			description: "Titre de l'ouvrage",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
		})
		requete: string,
		interaction: CommandInteraction | AutocompleteInteraction
	) {
		if (interaction.isAutocomplete()) {
			await this.completerOuvrage(interaction);
			return;
		}
		const cmd = interaction as CommandInteraction;
		await cmd.deferReply();

		const fiche = await this.resoudre(requete);
		if (!fiche) {
			await cmd.editReply({
				content: `Aucun ouvrage ne correspond à « ${requete} ». Utilise l'autocomplete de \`/databooks fiche\`.`,
			});
			return;
		}
		await cmd.editReply({ embeds: [this.ficheEmbed(fiche)] });
	}

	@Slash({
		name: "recherche",
		description: "Chercher une phrase dans le texte transcrit des planches (japonais compris)",
	})
	async recherche(
		@SlashOption({
			name: "terme",
			description: "Mot ou phrase à chercher dans les planches",
			type: ApplicationCommandOptionType.String,
			required: true,
			minLength: 2,
			maxLength: 100,
		})
		terme: string,
		interaction: CommandInteraction
	) {
		await interaction.deferReply();

		const res = await this.api.searchPages(terme, 40);
		if (!res) {
			await interaction.editReply({
				content: "La recherche est momentanément indisponible. Réessaie dans un instant.",
			});
			return;
		}
		if (res.total === 0) {
			await interaction.editReply({
				content: `Aucune planche ne contient « ${terme} ».`,
			});
			return;
		}

		// Une planche par page de pagination : le texte est long, et l'intérêt est
		// de LIRE le passage trouvé, pas d'en survoler dix titres.
		const pages: Array<{ embeds: APIEmbed[] }> = res.items.map((p, i) =>
			({ embeds: [this.resultatEmbed(p, terme, i, res.items.length, res).toJSON()] })
		);

		if (pages.length === 1) {
			await interaction.editReply(pages[0]!);
			return;
		}
		await new Pagination(interaction, pages, { time: 180_000 }).send();
	}

	private resultatEmbed(
		p: PlancheTrouvee,
		terme: string,
		index: number,
		affichees: number,
		res: { total: number; fiches: number }
	): EmbedBuilder {
		const embed = new EmbedBuilder()
			.setTitle(`${p.titre} — planche ${p.numero}`)
			.setURL(`${SITE}/wiki/databooks/${p.databookId}`)
			.setColor(couleur(p.categorie))
			.setDescription(tronquer(this.centrerSur(p.texte, terme), 3800))
			.setFooter({
				text:
					`${index + 1}/${affichees} affichées · ${res.total} planche${res.total > 1 ? "s" : ""} ` +
					`dans ${res.fiches} ouvrage${res.fiches > 1 ? "s" : ""}`,
			});
		const image = assetUrl(p.image);
		if (image) embed.setThumbnail(image);
		return embed;
	}

	/**
	 * Recadre un texte long autour de la première occurrence du terme.
	 *
	 * Sans ça, une planche de 8 000 signes serait tronquée par le début et
	 * n'afficherait pas le passage cherché — le résultat serait juste faux du
	 * point de vue de celui qui a lancé la recherche.
	 */
	private centrerSur(texte: string, terme: string): string {
		const pos = texte.toLocaleLowerCase().indexOf(terme.trim().toLocaleLowerCase());
		if (pos < 0 || pos < 600) return texte;
		return `…${texte.slice(Math.max(0, pos - 600))}`;
	}

	@Slash({ name: "planche", description: "Lire la transcription d'une planche précise" })
	async planche(
		@SlashOption({
			name: "ouvrage",
			description: "Titre de l'ouvrage",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
		})
		requete: string,
		@SlashOption({
			name: "numero",
			description: "Numéro de la planche",
			type: ApplicationCommandOptionType.Integer,
			required: true,
			minValue: 1,
		})
		numero: number,
		interaction: CommandInteraction | AutocompleteInteraction
	) {
		if (interaction.isAutocomplete()) {
			await this.completerOuvrage(interaction);
			return;
		}
		const cmd = interaction as CommandInteraction;
		await cmd.deferReply();

		const fiche = await this.resoudre(requete);
		if (!fiche) {
			await cmd.editReply({ content: `Aucun ouvrage ne correspond à « ${requete} ».` });
			return;
		}
		const planche = fiche.pages.find((p) => p.number === numero);
		if (!planche) {
			const dispo = fiche.pages.length;
			await cmd.editReply({
				content: dispo
					? `« ${fiche.title} » n'a pas de planche n°${numero} (${dispo} planches référencées).`
					: `« ${fiche.title} » n'a encore aucune planche.`,
			});
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle(`${fiche.title} — planche ${planche.number}`)
			.setURL(`${SITE}/wiki/databooks/${fiche.id}`)
			.setColor(couleur(fiche.category))
			.setDescription(
				planche.text?.trim()
					? tronquer(planche.text.trim(), 3900)
					: "*Cette planche n'est pas encore transcrite.*"
			);
		const image = assetUrl(planche.image);
		if (image) embed.setImage(image);
		await cmd.editReply({ embeds: [embed] });
	}

	@Slash({ name: "catalogue", description: "Parcourir les ouvrages référencés" })
	async catalogue(
		@SlashOption({
			name: "categorie",
			description: "Filtrer par catégorie",
			type: ApplicationCommandOptionType.String,
			required: false,
			autocomplete: true,
		})
		categorie: string | undefined,
		interaction: CommandInteraction | AutocompleteInteraction
	) {
		if (interaction.isAutocomplete()) {
			const tous = await this.api.listAll();
			const cats = [...new Set(tous.map((d) => d.category).filter((c): c is string => !!c))].sort();
			const focus = interaction.options.getFocused().toLocaleLowerCase();
			await interaction.respond(
				cats
					.filter((c) => c.toLocaleLowerCase().includes(focus))
					.slice(0, 25)
					.map((c) => ({ name: c, value: c }))
			);
			return;
		}
		const cmd = interaction as CommandInteraction;
		await cmd.deferReply({ flags: MessageFlags.Ephemeral });

		const tous = await this.api.listAll();
		if (tous.length === 0) {
			await cmd.editReply({ content: "Le catalogue est momentanément indisponible." });
			return;
		}
		const fiches = categorie ? tous.filter((d) => d.category === categorie) : tous;
		if (fiches.length === 0) {
			await cmd.editReply({ content: `Aucun ouvrage dans la catégorie « ${categorie} ».` });
			return;
		}

		// Du plus récent au plus ancien : c'est l'ordre du site, et celui qu'on a
		// en tête quand on cherche « le dernier guide sorti ».
		const tries = fiches.slice().sort((a, b) => (b.published_at ?? 0) - (a.published_at ?? 0));
		const PAR_PAGE = 12;
		const pages: Array<{ embeds: APIEmbed[] }> = [];
		for (let i = 0; i < tries.length; i += PAR_PAGE) {
			const lot = tries.slice(i, i + PAR_PAGE);
			pages.push({
				embeds: [
					new EmbedBuilder()
						.setTitle(categorie ? `Databooks — ${categorie}` : "Databooks & interviews")
						.setColor(COULEUR_DEFAUT)
						.setDescription(
							lot
								.map((d) => {
									const n = d.pages.length;
									return `• [**${d.title}**](${SITE}/wiki/databooks/${d.id}) — ${annee(d.published_at)}${n ? ` · ${n} planches` : ""}`;
								})
								.join("\n")
						)
						.setFooter({
							text: `${i + 1}–${Math.min(i + PAR_PAGE, tries.length)} sur ${tries.length} ouvrages`,
						})
						.toJSON(),
				],
			});
		}

		if (pages.length === 1) {
			await cmd.editReply(pages[0]!);
			return;
		}
		await new Pagination(cmd, pages, { time: 180_000 }).send();
	}

	/** Résout un choix d'autocomplete (id) ou une saisie libre (titre). */
	private async resoudre(requete: string): Promise<Databook | null> {
		const id = Number(requete);
		if (Number.isSafeInteger(id) && id > 0) {
			const direct = await this.api.get1(id);
			if (direct) return direct;
		}
		const [premier] = await this.api.searchTitles(requete, 1);
		return premier ? await this.api.get1(premier.id) : null;
	}
}
