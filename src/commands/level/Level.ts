import { injectable, inject } from "tsyringe";
import { Discord, Slash, SlashOption, SlashChoice, Guard } from "@rpbey/discordx";
import { userTransformer } from "~/lib/slash-user";
import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits,
  type CommandInteraction,
  type Role,
  type User,
} from "discord.js";
import { Pagination, PaginationResolver } from "@rpbey/pagination";
import { AttachmentBuilder } from "discord.js";
import { GuildOnly } from "~/guards/GuildOnly";
import { CommandsChannelOnly } from "~/guards/CommandsChannelOnly";
import { AdminOnly } from "~/guards/AdminOnly";
import { LevelService } from "~/services/LevelService";
import { EconomyService } from "~/services/EconomyService";
import { CardService } from "~/services/CardService";
import { LeaderboardService, type LeaderboardEntry } from "~/services/LeaderboardService";
import { levelForXP, xpRequiredForLevel } from "~/lib/xp";

@Discord()
@Guard(GuildOnly, CommandsChannelOnly)
@injectable()
export class LevelCommands {
  constructor(
    @inject(LevelService) private levels: LevelService,
    @inject(EconomyService) private eco: EconomyService,
    @inject(CardService) private cards: CardService,
    @inject(LeaderboardService) private leaderboard: LeaderboardService,
  ) {}

  @Slash({ name: "profil", description: "Voir le profil d'un membre (carte image)" })
  async profil(
    @SlashOption({ name: "membre", description: "Membre (défaut: vous)", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    target: User | undefined,
    interaction: CommandInteraction,
  ) {
    await interaction.deferReply();
    const user = target ?? interaction.user;
    const data = await this.levels.getUser(user.id);
    const fusion = await this.eco.getFusion(user.id);
    const rank = await this.levels.rankOf(user.id);

    const buffer = await this.cards.render({
      discordUser: user,
      xp: data?.xp ?? 0,
      zeni: data?.zeni ?? 0,
      messageCount: data?.messageCount ?? 0,
      cardKey: data?.equippedCard ?? null,
      badge: data?.equippedBadge ?? null,
      title: data?.equippedTitle ?? null,
      color: data?.equippedColor ?? null,
      fused: !!fusion,
      rank,
    });
    const file = new AttachmentBuilder(buffer, { name: `profil-${user.id}.png` });
    await interaction.editReply({ files: [file] });
  }

  @Slash({ name: "top", description: "Classement des membres par XP" })
  async top(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;
    await interaction.deferReply();

    const total = await this.levels.totalUsers();
    if (total === 0) {
      await interaction.editReply({ content: "Aucun membre enregistré." });
      return;
    }
    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const guildName = interaction.guild.name;

    // Résout un user Discord → entry leaderboard (avatar + username)
    const toEntry = async (row: { id: string; xp: number; zeni: number }): Promise<LeaderboardEntry> => {
      let username = `Saiyan #${row.id.slice(-4)}`;
      let avatarURL = "https://cdn.discordapp.com/embed/avatars/0.png";
      try {
        const user = await interaction.client.users.fetch(row.id);
        username = user.displayName ?? user.username;
        avatarURL = user.displayAvatarURL({ extension: "png", size: 256, forceStatic: true });
      } catch {
        /* user left Discord ou fetch failed — garde les placeholders */
      }
      return { id: row.id, username, avatarURL, xp: row.xp, zeni: row.zeni };
    };

    // Rend un buffer PNG pour la page demandée (à la volée)
    const renderPage = async (i: number): Promise<AttachmentBuilder> => {
      const rows = await this.levels.top(pageSize, i * pageSize);
      const entries = await Promise.all(rows.map(toEntry));
      const buffer = await this.leaderboard.render(entries, {
        title: "CLASSEMENT",
        subtitle: guildName,
        page: i + 1,
        totalPages,
      });
      return new AttachmentBuilder(buffer, { name: `top-p${i + 1}.png` });
    };

    // 1 page → envoi direct, pas de pagination
    if (totalPages === 1) {
      const file = await renderPage(0);
      await interaction.editReply({ files: [file] });
      return;
    }

    // Cache LRU mémoire trivial pour ne pas re-render quand l'user revient en arrière
    const cache = new Map<number, AttachmentBuilder>();
    const resolver = new PaginationResolver(async (page) => {
      let file = cache.get(page);
      if (!file) {
        file = await renderPage(page);
        cache.set(page, file);
      }
      return { content: "", files: [file] };
    }, totalPages);

    // Plusieurs pages → Pagination lazy (pageResolver) avec labels FR
    const pagination = new Pagination(interaction, resolver, {
      time: 120_000,
      buttons: {
        previous: { label: "Précédent" },
        next: { label: "Suivant" },
        exit: { label: "Fermer" },
      },
      selectMenu: { disabled: true }, // pas pertinent pour un ranking
    });
    await pagination.send();
  }

  // /niveau : admin uniquement
  @Slash({ name: "niveau", description: "Admin: modifier niveau/xp", defaultMemberPermissions: PermissionFlagsBits.Administrator })
  @Guard(AdminOnly)
  async niveauAdmin(
    @SlashChoice({ name: "give", value: "give" })
    @SlashChoice({ name: "remove", value: "remove" })
    @SlashOption({ name: "action", description: "give/remove", type: ApplicationCommandOptionType.String, required: true })
    action: "give" | "remove",
    @SlashChoice({ name: "niveau", value: "niveau" })
    @SlashChoice({ name: "exp", value: "exp" })
    @SlashOption({ name: "type", description: "niveau ou exp", type: ApplicationCommandOptionType.String, required: true })
    kind: "niveau" | "exp",
    @SlashOption({ name: "montant", description: "Montant", type: ApplicationCommandOptionType.Integer, required: true, minValue: 1 })
    amount: number,
    @SlashOption({ name: "membre", description: "Membre", type: ApplicationCommandOptionType.User, required: false }, userTransformer)
    user: User | undefined,
    @SlashOption({ name: "role", description: "Rôle", type: ApplicationCommandOptionType.Role, required: false })
    role: Role | undefined,
    @SlashOption({ name: "all", description: "Tous les inscrits", type: ApplicationCommandOptionType.Boolean, required: false })
    all: boolean | undefined,
    interaction: CommandInteraction,
  ) {
    if (!interaction.inCachedGuild()) return;
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const sign = action === "give" ? 1 : -1;

    // Calcule le XP cible pour un user donné (kind=niveau→translate, kind=exp→delta direct)
    const compute = (currentXP: number): number => {
      if (kind === "exp") return Math.max(0, currentXP + sign * amount);
      const currentLevel = levelForXP(currentXP);
      const newLevel = Math.max(0, currentLevel + sign * amount);
      if (newLevel === 0) return 0;
      return xpRequiredForLevel(newLevel);
    };

    const apply = async (id: string) => {
      const c = await this.levels.getUser(id);
      await this.levels.setXP(id, compute(c?.xp ?? 0));
    };

    if (user) {
      await apply(user.id);
      await interaction.editReply({ content: `✅ Appliqué à ${user}.` });
      return;
    }
    if (role) {
      const members = await interaction.guild.members.fetch();
      let count = 0;
      for (const m of members.values()) {
        if (m.roles.cache.has(role.id)) {
          await apply(m.id);
          count++;
        }
      }
      await interaction.editReply({ content: `✅ Appliqué à ${count} membres avec ${role}.` });
      return;
    }
    if (all) {
      const allUsers = await this.levels.top(10_000, 0);
      for (const u of allUsers) await apply(u.id);
      await interaction.editReply({ content: `✅ Appliqué à ${allUsers.length} membres inscrits.` });
      return;
    }
    await interaction.editReply({ content: "Spécifiez un membre, un rôle, ou all:true." });
  }
}
