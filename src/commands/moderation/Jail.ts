import { injectable, inject } from "tsyringe";
import { Bot, Discord, Guard, Slash, SlashOption } from "@rpbey/discordx";
import { userTransformer } from "~/lib/slash-user";
import {
  ApplicationCommandOptionType,
  ChannelType,
  type CommandInteraction,
  type GuildChannel,
  type User,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import { ModOnly } from "~/guards/ModOnly";
import { AdminOnly } from "~/guards/AdminOnly";
import { GuildOnly } from "~/guards/GuildOnly";
import { ModerationService } from "~/services/ModerationService";
import { LogService } from "~/services/LogService";
import { sanctionEmbed, brandedEmbed, errorEmbed, successEmbed } from "~/lib/embeds";
import { canModerate } from "~/lib/hierarchy";
import { gifFor } from "~/lib/sanction-gif";
import { parseDuration, formatDuration, notifyMember } from "~/lib/sanction-helpers";
import { env } from "~/lib/env";

@Discord()
@Bot("enma")
@Guard(GuildOnly)
@injectable()
export class JailCommands {
  constructor(
    @inject(ModerationService) private mod: ModerationService,
    @inject(LogService) private logs: LogService,
  ) {}

  // ────────────────────────────── /jail
  @Slash({ name: "jail", description: "Envoyer un membre en jail" })
  @Guard(ModOnly)
  async jail(
    @SlashOption({ name: "membre", description: "Membre à jail", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    @SlashOption({ name: "duree", description: "Durée optionnelle (ex: 1h)", type: ApplicationCommandOptionType.String, required: false })
    duration: string | undefined,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    @SlashOption({ name: "discret", description: "Réponse visible uniquement par toi (cache le GIF)", type: ApplicationCommandOptionType.Boolean, required: false })
    discret: boolean | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      await interaction.reply({ embeds: [errorEmbed("Membre introuvable")], flags: MessageFlags.Ephemeral });
      return;
    }
    const allowed = await canModerate(interaction.member, member);
    if (!allowed.ok) {
      await interaction.reply({ embeds: [errorEmbed("Hiérarchie staff", allowed.reason ?? "")], flags: MessageFlags.Ephemeral });
      return;
    }
    if (!member.manageable) {
      await interaction.reply({
        embeds: [errorEmbed("Hiérarchie", `Le bot ne peut pas modifier les rôles de ${target} (rôle plus haut).`)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const ms = parseDuration(duration);
    try {
      await this.mod.jail(member, interaction.user.id, reason, ms);
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed("Échec jail", (err as Error).message)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const embed = sanctionEmbed({
      target,
      moderator: interaction.user,
      action: "jail",
      reason,
      duration: ms ? formatDuration(ms) : "Indéfinie",
      gifUrl: await gifFor("jail"),
    });
    const dmOk = await notifyMember(
      target,
      brandedEmbed({
        title: "⛓️ Tu as été jailé",
        description: `Tu es en jail sur **${interaction.guild.name}**${ms ? ` pour **${formatDuration(ms)}**` : ""}.\n\nMotif : ${reason ?? "*(non précisé)*"}`,
        kind: "error",
      }),
      {
        kind: "jail",
        reason: reason ?? "*(non précisé)*",
        duration: ms ? formatDuration(ms) : "Indéfinie",
        moderator: interaction.user.username,
        guildName: interaction.guild.name,
      },
    );

    await interaction.reply({
      embeds: [embed.addFields({ name: "DM", value: dmOk ? "✅ envoyé" : "❌ DM fermés", inline: true })],
      flags: discret ? MessageFlags.Ephemeral : undefined,
    });
    await this.logs.send(interaction.client, "sanction", embed);
  }

  // ────────────────────────────── /unjail
  @Slash({ name: "unjail", description: "Libérer un membre de jail" })
  @Guard(ModOnly)
  async unjail(
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: true }, userTransformer)
    target: User,
    @SlashOption({ name: "raison", description: "Raison", type: ApplicationCommandOptionType.String, required: false })
    reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    // unjail effectue 1 PATCH role.remove + N PATCH role.add → peut dépasser les
    // 3s d'ack Discord. defer immédiat sinon "Unknown interaction" (10062).
    await interaction.deferReply();
    const ok = await this.mod.unjail(interaction.guild, target.id, interaction.user.id, reason);
    if (!ok) {
      await interaction.editReply({ embeds: [errorEmbed("Membre introuvable ou pas en jail")] });
      return;
    }
    const embed = sanctionEmbed({ target, moderator: interaction.user, action: "unjail", reason, gifUrl: await gifFor("unjail") });
    await interaction.editReply({ embeds: [embed] });
    await this.logs.send(interaction.client, "sanction", embed);
  }

  // ────────────────────────────── /jail-setup
  /**
   * Verrouille le rôle `JAIL_ROLE_ID` sur tout le serveur en une fois :
   * deny ViewChannel + SendMessages + AddReactions + Connect + Speak + Stream
   * + threads + slash commands sur **toutes les catégories** (les salons enfants
   * héritent automatiquement) + tous les **salons orphelins** (sans parent).
   *
   * Si `salon-jail` est fourni, le rôle reçoit un override **allow ViewChannel
   * + SendMessages + ReadMessageHistory** sur ce salon spécifique pour pouvoir
   * communiquer avec les mods. Les autres permissions restent deny.
   *
   * Idempotent : applique `permissionOverwrites.edit` (merge) plutôt que
   * `set` (replace) — relancer la commande ne casse pas les overrides
   * existants pour d'autres rôles.
   */
  @Slash({ name: "jail-setup", description: "Verrouiller le rôle jail dans tous les salons (rouge partout)" })
  @Guard(AdminOnly)
  async jailSetup(
    @SlashOption({
      name: "salon-jail",
      description: "Salon où le rôle jail garde l'accès (lecture+écriture). Optionnel.",
      type: ApplicationCommandOptionType.Channel,
      required: false,
      channelTypes: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
    })
    jailChannel: GuildChannel | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    const roleId = env.JAIL_ROLE_ID;
    if (!roleId) {
      await interaction.reply({
        embeds: [errorEmbed("JAIL_ROLE_ID non configuré", "Définis `JAIL_ROLE_ID` dans `.env` puis redémarre Shenron.")],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const role = interaction.guild.roles.cache.get(roleId)
      ?? await interaction.guild.roles.fetch(roleId).catch(() => null);
    if (!role) {
      await interaction.reply({
        embeds: [errorEmbed("Rôle introuvable", `JAIL_ROLE_ID=\`${roleId}\` ne correspond à aucun rôle de la guild.`)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const me = await interaction.guild.members.fetchMe();
    if (!me.permissions.has(PermissionFlagsBits.ManageChannels) || !me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await interaction.reply({
        embeds: [errorEmbed("Perms bot insuffisantes", "Le bot a besoin de `Manage Channels` + `Manage Roles`.")],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.deferReply();

    // Deny massif : tout ce qui permet de voir, écrire, parler, réagir.
    // ViewChannel:false suffirait à tout cacher mais on est defensive in depth
    // au cas où un override allow plus haut force ViewChannel sur un enfant.
    const denyAll = {
      ViewChannel: false,
      SendMessages: false,
      AddReactions: false,
      AttachFiles: false,
      EmbedLinks: false,
      Connect: false,
      Speak: false,
      Stream: false,
      SendMessagesInThreads: false,
      CreatePublicThreads: false,
      CreatePrivateThreads: false,
      UseApplicationCommands: false,
      UseExternalEmojis: false,
      UseExternalStickers: false,
    } as const;

    const allCategories = [...interaction.guild.channels.cache.values()]
      .filter((c) => c.type === ChannelType.GuildCategory);
    // Salons orphelins (sans catégorie) — ne peuvent pas hériter, on doit
    // les traiter explicitement. Les salons sous une catégorie héritent du
    // deny via Discord directement (sauf si un override les écrase déjà).
    // On exclut les threads (pas de permissionOverwrites propres).
    const nonThreadTypes = new Set<number>([
      ChannelType.GuildText,
      ChannelType.GuildVoice,
      ChannelType.GuildAnnouncement,
      ChannelType.GuildStageVoice,
      ChannelType.GuildForum,
      ChannelType.GuildMedia,
    ]);
    const orphanChannels = [...interaction.guild.channels.cache.values()].filter(
      (c) => !c.parentId && nonThreadTypes.has(c.type),
    ) as GuildChannel[];

    let okCat = 0;
    let okCh = 0;
    const failed: string[] = [];

    for (const cat of allCategories) {
      const c = cat as GuildChannel;
      try {
        await c.permissionOverwrites.edit(role.id, denyAll, { reason: `jail-setup by ${interaction.user.username}` });
        okCat++;
      } catch (err) {
        failed.push(`📁 ${c.name}: ${(err as Error).message}`);
      }
    }
    for (const ch of orphanChannels) {
      try {
        await ch.permissionOverwrites.edit(role.id, denyAll, { reason: `jail-setup by ${interaction.user.username}` });
        okCh++;
      } catch (err) {
        failed.push(`#${ch.name}: ${(err as Error).message}`);
      }
    }

    // Override allow sur le salon de jail dédié
    let jailChannelStatus = "*non configuré*";
    if (jailChannel) {
      try {
        await jailChannel.permissionOverwrites.edit(
          role.id,
          {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            AddReactions: false,
            AttachFiles: false,
            EmbedLinks: false,
          },
          { reason: `jail-setup salon dédié by ${interaction.user.username}` },
        );
        jailChannelStatus = `<#${jailChannel.id}> ✅`;
      } catch (err) {
        jailChannelStatus = `<#${jailChannel.id}> ❌ ${(err as Error).message}`;
      }
    }

    await this.mod.log("JAIL_SETUP", null, interaction.user.id, undefined, {
      roleId: role.id,
      categories: okCat,
      orphanChannels: okCh,
      jailChannelId: jailChannel?.id,
      failed: failed.length,
    });

    const desc = [
      `**Rôle ciblé :** <@&${role.id}>`,
      `**Catégories verrouillées :** ${okCat}/${allCategories.length}`,
      `**Salons orphelins verrouillés :** ${okCh}/${orphanChannels.length}`,
      `**Salon jail (allow) :** ${jailChannelStatus}`,
      failed.length ? `\n**Échecs (${failed.length}) :**\n${failed.slice(0, 10).map((f) => `• ${f}`).join("\n")}${failed.length > 10 ? `\n…+${failed.length - 10}` : ""}` : "",
    ].filter(Boolean).join("\n");

    await interaction.editReply({
      embeds: [successEmbed("⛓️ Jail-setup terminé", desc)],
    });
  }
}
