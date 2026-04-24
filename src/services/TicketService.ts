import { singleton, inject } from "tsyringe";
import { and, eq } from "drizzle-orm";
import {
  ChannelType,
  PermissionFlagsBits,
  type CategoryChannel,
  type Guild,
  type TextChannel,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { DatabaseService } from "~/db/index";
import { tickets } from "~/db/schema";
import { env } from "~/lib/env";

type TicketKind = "report" | "achat" | "shop" | "abus";

@singleton()
export class TicketService {
  constructor(@inject(DatabaseService) private dbs: DatabaseService) {}

  private get db() {
    return this.dbs.db;
  }

  async create(guild: Guild, ownerId: string, kind: TicketKind, context: string): Promise<TextChannel> {
    const categoryId = env.TICKET_CATEGORY_ID;
    const category = categoryId ? ((await guild.channels.fetch(categoryId).catch(() => null)) as CategoryChannel | null) : null;

    const owner = await guild.members.fetch(ownerId).catch(() => null);
    const username = owner?.user.username ?? "user";
    const name = `ticket-${kind}-${username}`.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 90);

    const channel = (await guild.channels.create({
      name,
      type: ChannelType.GuildText,
      parent: category?.id,
      topic: `Ticket ${kind} · <@${ownerId}>`,
      permissionOverwrites: [
        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        {
          id: ownerId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.AttachFiles,
          ],
        },
      ],
    })) as TextChannel;

    await this.db.insert(tickets).values({ channelId: channel.id, ownerId, kind, context });

    const embed = new EmbedBuilder()
      .setTitle(`Ticket — ${kind}`)
      .setDescription(context || "Aucun contexte fourni.")
      .addFields({ name: "Ouvert par", value: `<@${ownerId}>` })
      .setColor(0xff9800)
      .setTimestamp();

    const closeBtn = new ButtonBuilder().setCustomId("ticket:close").setLabel("Fermer").setStyle(ButtonStyle.Danger).setEmoji("🔒");
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeBtn);

    await channel.send({
      content: `<@${ownerId}> bienvenue dans votre ticket.`,
      embeds: [embed],
      components: [row],
    });

    return channel;
  }

  async findByChannel(channelId: string) {
    return this.db.query.tickets.findFirst({ where: eq(tickets.channelId, channelId) });
  }

  async close(channelId: string, closerId: string): Promise<boolean> {
    const t = await this.findByChannel(channelId);
    if (!t || t.closed) return false;
    await this.db.update(tickets).set({ closed: true, closedAt: new Date(), closedBy: closerId }).where(eq(tickets.channelId, channelId));
    return true;
  }

  async addUser(guild: Guild, channelId: string, userId: string): Promise<boolean> {
    const ch = (await guild.channels.fetch(channelId).catch(() => null)) as TextChannel | null;
    if (!ch) return false;
    await ch.permissionOverwrites.edit(userId, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
    });
    return true;
  }

  async removeUser(guild: Guild, channelId: string, userId: string): Promise<boolean> {
    const ch = (await guild.channels.fetch(channelId).catch(() => null)) as TextChannel | null;
    if (!ch) return false;
    await ch.permissionOverwrites.delete(userId).catch(() => {});
    return true;
  }
}
