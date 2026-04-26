import { injectable, inject } from "tsyringe";
import { Discord, Slash, SlashOption, SlashChoice, Guard, ButtonComponent, ModalComponent } from "@rpbey/discordx";
import { userTransformer } from "~/lib/slash-user";
import {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
  type ButtonInteraction,
  type CommandInteraction,
  type ModalSubmitInteraction,
  type Role,
  type User,
} from "discord.js";
import { Pagination } from "@rpbey/pagination";
import { GuildOnly } from "~/guards/GuildOnly";
import { CommandsChannelOnly } from "~/guards/CommandsChannelOnly";
import { AdminOnly } from "~/guards/AdminOnly";
import { EconomyService } from "~/services/EconomyService";
import { FusionService } from "~/services/FusionService";
import { FusionRoleService } from "~/services/FusionRoleService";
import { formatXP } from "~/lib/xp";
import { fusionName } from "~/lib/fusion-names";

@Discord()
@Guard(GuildOnly, CommandsChannelOnly)
@injectable()
export class EconomyCommands {
  constructor(
    @inject(EconomyService) private eco: EconomyService,
    @inject(FusionService) private fusionCanvas: FusionService,
    @inject(FusionRoleService) private fusionRoles: FusionRoleService,
  ) {}

  // /shop
  @Slash({ name: "shop", description: "Voir et acheter des objets" })
  async shop(interaction: CommandInteraction) {
    const items = await this.eco.listShop();
    if (items.length === 0) {
      await interaction.reply({ content: "Shop vide pour le moment.", flags: MessageFlags.Ephemeral });
      return;
    }
    const grouped = {
      card: items.filter((i) => i.type === "card"),
      badge: items.filter((i) => i.type === "badge"),
      color: items.filter((i) => i.type === "color"),
      title: items.filter((i) => i.type === "title"),
    };

    const mkPage = (label: string, icon: string, list: typeof items) => ({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${icon} ${label}`)
          .setDescription(
            list.length
              ? list.map((i) => `**\`${i.key}\`** · ${i.name} — ${formatXP(i.price)} z\n${i.description ?? ""}`).join("\n\n")
              : "— Rien en vente —",
          )
          .setFooter({ text: "Utilise /buy <clé> pour acheter." })
          .setColor(0xfbbf24)
          .toJSON(), // Pagination fait structuredClone() qui casse les instances
      ],
    });

    const pages = [
      mkPage("Cartes (profil)", "🖼️", grouped.card),
      mkPage("Badges", "🎖️", grouped.badge),
      mkPage("Couleurs", "🎨", grouped.color),
      mkPage("Titres", "📜", grouped.title),
    ];
    const pagination = new Pagination(interaction, pages, { time: 120_000 });
    await pagination.send();
  }

  // /buy
  @Slash({ name: "buy", description: "Acheter un objet du shop" })
  async buy(
    @SlashOption({ name: "cle", description: "Clé de l'objet", type: ApplicationCommandOptionType.String, required: true })
    key: string,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    const res = await this.eco.purchase(interaction.user.id, key);
    if (!res.ok) {
      await interaction.reply({ content: `❌ ${res.reason}`, flags: MessageFlags.Ephemeral });
      return;
    }
    if (res.roleId) {
      const member = interaction.member;
      if (member && "roles" in member && typeof member.roles.add === "function") {
        await member.roles.add(res.roleId).catch(() => {});
      }
    }
    await interaction.reply({ content: `✅ Objet acheté (${res.price} z). Utilise \`/eprofil\` pour l'équiper.` });
  }

  // /eprofil
  @Slash({ name: "eprofil", description: "Éditer votre profil (badge/carte/couleur/titre)" })
  async eprofil(interaction: CommandInteraction) {
    const inv = await this.eco.listInventory(interaction.user.id);
    const group = {
      card: inv.filter((i) => i.itemType === "card"),
      badge: inv.filter((i) => i.itemType === "badge"),
      color: inv.filter((i) => i.itemType === "color"),
      title: inv.filter((i) => i.itemType === "title"),
    };
    const fmt = (arr: typeof inv) => (arr.length ? arr.map((i) => `\`${i.itemKey}\``).join(", ") : "—");

    const embed = new EmbedBuilder()
      .setTitle("✏️ Éditer le profil")
      .setDescription("Cliquez sur un bouton pour choisir ce que vous voulez équiper.")
      .addFields(
        { name: "🖼️ Cartes", value: fmt(group.card) },
        { name: "🎖️ Badges", value: fmt(group.badge) },
        { name: "🎨 Couleurs", value: fmt(group.color) },
        { name: "📜 Titres", value: fmt(group.title) },
      )
      .setColor(0xfbbf24);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("eprofil:equip:card").setLabel("Carte").setEmoji("🖼️").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("eprofil:equip:badge").setLabel("Badge").setEmoji("🎖️").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("eprofil:equip:color").setLabel("Couleur").setEmoji("🎨").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("eprofil:equip:title").setLabel("Titre").setEmoji("📜").setStyle(ButtonStyle.Secondary),
    );
    await interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
  }

  @ButtonComponent({ id: /^eprofil:equip:(card|badge|color|title)$/ })
  async equipBtn(interaction: ButtonInteraction) {
    const type = interaction.customId.split(":")[2] as "card" | "badge" | "color" | "title";
    const modal = new ModalBuilder().setCustomId(`eprofil:submit:${type}`).setTitle(`Équiper un(e) ${type}`);
    const input = new TextInputBuilder()
      .setCustomId("key")
      .setLabel("Clé de l'objet (ex: saiyan_blue)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);
    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await interaction.showModal(modal);
  }

  @ModalComponent({ id: /^eprofil:submit:(card|badge|color|title)$/ })
  async equipModal(interaction: ModalSubmitInteraction) {
    const type = interaction.customId.split(":")[2] as "card" | "badge" | "color" | "title";
    const key = interaction.fields.getTextInputValue("key").trim();
    const ok = await this.eco.equip(interaction.user.id, type, key);
    await interaction.reply({
      content: ok ? `✅ ${type} "${key}" équipé.` : `❌ Tu ne possèdes pas cet objet.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  // /fusion
  @Slash({ name: "fusion", description: "Proposer une fusion (mariage) à un membre" })
  async fusion(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    interaction: CommandInteraction,
  ) {
    if (target.id === interaction.user.id) {
      await interaction.reply({ content: "Impossible de fusionner avec soi-même.", flags: MessageFlags.Ephemeral });
      return;
    }
    if (target.bot) {
      await interaction.reply({ content: "Les bots ne fusionnent pas.", flags: MessageFlags.Ephemeral });
      return;
    }
    const existing = await this.eco.getFusion(interaction.user.id);
    if (existing) {
      await interaction.reply({ content: "Tu es déjà fusionné(e). Fais `/defusion` d'abord.", flags: MessageFlags.Ephemeral });
      return;
    }

    await interaction.deferReply();
    const buf = await this.fusionCanvas.render({
      a: interaction.user,
      b: target,
      state: "propose",
    });
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`fusion:accept:${interaction.user.id}:${target.id}`).setLabel("Accepter").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`fusion:refuse:${interaction.user.id}:${target.id}`).setLabel("Refuser").setStyle(ButtonStyle.Danger),
    );
    await interaction.editReply({
      content: `${target}, ${interaction.user} te propose une fusion !`,
      files: [new AttachmentBuilder(buf, { name: "fusion-propose.png" })],
      components: [row],
    });
  }

  @ButtonComponent({ id: /^fusion:(accept|refuse):\d+:\d+$/ })
  async fusionResponse(interaction: ButtonInteraction) {
    const [, action, proposerId, targetId] = interaction.customId.split(":");
    if (interaction.user.id !== targetId) {
      await interaction.reply({ content: "Seule la cible peut répondre.", flags: MessageFlags.Ephemeral });
      return;
    }
    if (action === "refuse") {
      await interaction.update({ content: `❌ Fusion refusée par <@${targetId}>.`, embeds: [], components: [] });
      return;
    }
    await this.eco.createFusion(proposerId!, targetId!);

    // Rôle "Fusion" — best-effort, log + skip si setting absente / bot pas autorisé
    if (interaction.guild) {
      await this.fusionRoles.applyToPair(interaction.guild, proposerId!, targetId!);
    }

    // Nom fusionné (canon ou généré)
    const proposer = await interaction.client.users.fetch(proposerId!).catch(() => null);
    const target = await interaction.client.users.fetch(targetId!).catch(() => null);
    const a = proposer?.displayName || proposer?.username || "A";
    const b = target?.displayName || target?.username || "B";
    const fused = fusionName(a, b);

    // Canvas fusion réussie
    if (proposer && target) {
      const buf = await this.fusionCanvas.render({
        a: proposer,
        b: target,
        state: "success",
        fusedName: fused,
      });
      await interaction.update({
        content: `<@${proposerId}> et <@${targetId}> sont désormais **${fused}** !\n_+10 % XP & zéni partagés sur toute activité._`,
        embeds: [],
        files: [new AttachmentBuilder(buf, { name: "fusion-success.png" })],
        components: [],
      });
    } else {
      // Fallback texte si l'un des users a quitté Discord
      await interaction.update({
        content: `💫 **FUSION RÉUSSIE** 💫\n<@${proposerId}> et <@${targetId}> sont désormais **${fused}** !`,
        embeds: [],
        components: [],
      });
    }
  }

  @Slash({ name: "defusion", description: "Annuler votre fusion" })
  async defusion(interaction: CommandInteraction) {
    // Récupère le partenaire AVANT de casser la fusion (sinon plus de trace en DB)
    const partner = await this.eco.partnerOf(interaction.user.id);
    const ok = await this.eco.breakFusion(interaction.user.id);
    if (ok && partner && interaction.guild) {
      await this.fusionRoles.removeFromPair(interaction.guild, interaction.user.id, partner);
    }
    await interaction.reply({
      content: ok ? "💔 Fusion annulée." : "Tu n'es pas fusionné(e).",
      flags: ok ? undefined : MessageFlags.Ephemeral,
    });
  }

  // /solde
  @Slash({ name: "solde", description: "Voir votre solde de zéni" })
  async solde(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    target: User | undefined,
    interaction: CommandInteraction,
  ) {
    const user = target ?? interaction.user;
    const bal = await this.eco.getBalance(user.id);
    await interaction.reply({ content: `💰 **${user.username}** : ${formatXP(bal)} zéni` });
  }

  // Admin: /zeni give|remove
  @Slash({ name: "zeni", description: "Admin: donner/retirer des zéni", defaultMemberPermissions: PermissionFlagsBits.Administrator })
  @Guard(AdminOnly)
  async zeniAdmin(
    @SlashChoice({ name: "give", value: "give" })
    @SlashChoice({ name: "remove", value: "remove" })
    @SlashOption({ name: "action", description: "give/remove", type: ApplicationCommandOptionType.String, required: true })
    action: "give" | "remove",
    @SlashOption({ name: "montant", description: "Montant", type: ApplicationCommandOptionType.Integer, required: true, minValue: 1 })
    amount: number,
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    user: User | undefined,
    @SlashOption({ name: "role", description: "Rôle (tous les membres avec ce rôle)", type: ApplicationCommandOptionType.Role, required: false })
    role: Role | undefined,
    @SlashOption({ name: "all", description: "Appliquer à tous les membres inscrits", type: ApplicationCommandOptionType.Boolean, required: false })
    all: boolean | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const signed = action === "give" ? amount : -amount;

    if (user) {
      if (signed > 0) await this.eco.addZeni(user.id, signed);
      else await this.eco.removeZeni(user.id, -signed);
      await interaction.editReply({ content: `✅ ${user} : ${signed > 0 ? "+" : ""}${signed} z` });
      return;
    }
    if (role) {
      const members = await interaction.guild.members.fetch();
      let count = 0;
      for (const m of members.values()) {
        if (m.roles.cache.has(role.id)) {
          if (signed > 0) await this.eco.addZeni(m.id, signed, { propagateFusion: false });
          else await this.eco.removeZeni(m.id, -signed);
          count++;
        }
      }
      await interaction.editReply({ content: `✅ Appliqué à ${count} membres avec ${role}.` });
      return;
    }
    if (all) {
      const ids = await this.eco.listRegisteredIds();
      for (const id of ids) {
        if (signed > 0) await this.eco.addZeni(id, signed, { propagateFusion: false });
        else await this.eco.removeZeni(id, -signed);
      }
      await interaction.editReply({ content: `✅ Appliqué à ${ids.length} membres inscrits.` });
      return;
    }
    await interaction.editReply({ content: "Spécifiez un membre, un rôle, ou all:true." });
  }

  // Admin: /custom give|remove type key @cible
  @Slash({ name: "custom", description: "Admin: donner/retirer un objet custom", defaultMemberPermissions: PermissionFlagsBits.Administrator })
  @Guard(AdminOnly)
  async customAdmin(
    @SlashChoice({ name: "give", value: "give" })
    @SlashChoice({ name: "remove", value: "remove" })
    @SlashOption({ name: "action", description: "give/remove", type: ApplicationCommandOptionType.String, required: true })
    action: "give" | "remove",
    @SlashChoice({ name: "card", value: "card" })
    @SlashChoice({ name: "badge", value: "badge" })
    @SlashChoice({ name: "color", value: "color" })
    @SlashChoice({ name: "title", value: "title" })
    @SlashChoice({ name: "succes", value: "succes" })
    @SlashOption({ name: "type", description: "Type d'objet", type: ApplicationCommandOptionType.String, required: true })
    type: "card" | "badge" | "color" | "title" | "succes",
    @SlashOption({ name: "cle", description: "Clé", type: ApplicationCommandOptionType.String, required: true })
    key: string,
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    user: User | undefined,
    @SlashOption({ name: "role", description: "Rôle", type: ApplicationCommandOptionType.Role, required: false })
    role: Role | undefined,
    @SlashOption({ name: "all", description: "Appliquer à tous les inscrits", type: ApplicationCommandOptionType.Boolean, required: false })
    all: boolean | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const targets: string[] = [];
    if (user) targets.push(user.id);
    else if (role) {
      const members = await interaction.guild.members.fetch();
      for (const m of members.values()) if (m.roles.cache.has(role.id)) targets.push(m.id);
    } else if (all) {
      const ids = await this.eco.listRegisteredIds();
      targets.push(...ids);
    } else {
      await interaction.editReply({ content: "Spécifiez un membre, un rôle, ou all:true." });
      return;
    }

    for (const uid of targets) {
      if (type === "succes") {
        if (action === "give") await this.eco.grantAchievement(uid, key);
        else await this.eco.revokeAchievement(uid, key);
      } else {
        if (action === "give") await this.eco.grantItem(uid, type, key);
        else await this.eco.removeItem(uid, type, key);
      }
    }
    await interaction.editReply({ content: `✅ ${type}:${key} ${action === "give" ? "donné" : "retiré"} à ${targets.length} membre(s).` });
  }
}
