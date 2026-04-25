import { injectable, inject } from "tsyringe";
import { Discord, On, type ArgsOf } from "@rpbey/discordx";
import { eq } from "drizzle-orm";
import { LevelService } from "~/services/LevelService";
import { EconomyService } from "~/services/EconomyService";
import { AchievementService } from "~/services/AchievementService";
import { DatabaseService } from "~/db/index";
import { users } from "~/db/schema";
import {
  DISCORD_INVITE_REGEX,
  XP_MESSAGE_COOLDOWN_MS,
  XP_PER_MESSAGE_MAX,
  XP_PER_MESSAGE_MIN,
  ZENI_DAILY_QUEST,
} from "~/lib/constants";
import { env } from "~/lib/env";
import { randomInt } from "~/lib/xp";
import { randomDailyQuestMessage } from "~/lib/dbz-flavor";
import { resolveAnnounceChannel, resolveAchievementChannel } from "~/lib/announce";
import { brandedEmbed } from "~/lib/embeds";
import { ModerationService } from "~/services/ModerationService";
import { logger } from "~/lib/logger";
import dayjs from "dayjs";

@Discord()
@injectable()
export class MessageXPEvent {
  constructor(
    @inject(LevelService) private levels: LevelService,
    @inject(EconomyService) private eco: EconomyService,
    @inject(DatabaseService) private dbs: DatabaseService,
    @inject(ModerationService) private mod: ModerationService,
    @inject(AchievementService) private achievements: AchievementService,
  ) {}

  @On({ event: "messageCreate" })
  async onMessage([message]: ArgsOf<"messageCreate">) {
    if (!message.inGuild() || message.author.bot) return;
    const userId = message.author.id;

    // Anti-lien Discord externe (auto-jail)
    const match = message.content.match(DISCORD_INVITE_REGEX);
    if (match) {
      const url = match[0];
      const ownInvite = env.SERVER_INVITE_URL?.replace(/^https?:\/\//, "");
      const isOwn = ownInvite && url.toLowerCase().includes(ownInvite.toLowerCase().split("/").pop() ?? "");
      if (!isOwn && message.member && !message.member.permissions.has("ModerateMembers")) {
        await message.delete().catch(() => {});
        try {
          await this.mod.jail(message.member, message.client.user!.id, "Lien Discord externe détecté", 24 * 3600_000);
          await message.channel.send({ content: `🔒 <@${userId}> a été jailé (lien Discord externe).` });
        } catch (err) {
          logger.warn({ err }, "anti-link jail failed");
        }
        return;
      }
    }

    // XP + quête quotidienne
    await this.levels.ensureUser(userId);
    const user = await this.levels.getUser(userId);
    if (!user) return;
    const now = Date.now();
    const last = user.lastMessageAt?.getTime() ?? 0;

    const announce =
      (await resolveAnnounceChannel(message.client, message.guild ?? undefined)) ??
      ("send" in message.channel ? message.channel : null);
    if (!announce) return;

    // Quête quotidienne
    const today = dayjs(now).startOf("day").valueOf();
    const lastQuest = user.lastDailyQuestAt?.getTime() ?? 0;
    const isNewDay = lastQuest < today;
    if (isNewDay) {
      const yesterdayDelta = today - dayjs(now).subtract(1, "day").startOf("day").valueOf();
      const streak = lastQuest >= today - yesterdayDelta ? user.dailyStreak + 1 : 1;
      await this.dbs.db
        .update(users)
        .set({ lastDailyQuestAt: new Date(now), dailyStreak: streak, zeni: user.zeni + ZENI_DAILY_QUEST })
        .where(eq(users.id, userId));
      await announce.send(randomDailyQuestMessage(userId, ZENI_DAILY_QUEST, streak)).catch(() => {});
    }

    // Salon dédié aux succès (retombe sur announce si ACHIEVEMENT_CHANNEL_ID absent)
    const achievementChannel =
      (await resolveAchievementChannel(message.client, message.guild ?? undefined)) ?? announce;

    // Succès premier message
    if (user.messageCount === 0) {
      await this.eco.grantAchievement(userId, "FIRST_MESSAGE");
      await achievementChannel
        .send({
          content: `<@${userId}>`,
          embeds: [
            brandedEmbed({
              title: "🏆 Accomplissement débloqué",
              description: `<@${userId}> débloque **Premier message** !`,
              kind: "brand",
            }),
          ],
        })
        .catch(() => {});
    }
    await this.dbs.db.update(users).set({ messageCount: user.messageCount + 1 }).where(eq(users.id, userId));

    // Succès déclenchés par pattern (table achievement_triggers)
    const granted = await this.achievements.checkMessage(userId, message.content);
    for (const code of granted) {
      await achievementChannel
        .send({
          content: `<@${userId}>`,
          embeds: [
            brandedEmbed({
              title: "🏆 Accomplissement débloqué",
              description: `<@${userId}> débloque **${code}** !`,
              kind: "brand",
            }),
          ],
        })
        .catch(() => {});
    }

    // XP cooldown
    if (now - last < XP_MESSAGE_COOLDOWN_MS) return;
    const gain = randomInt(XP_PER_MESSAGE_MIN, XP_PER_MESSAGE_MAX);
    await this.dbs.db.update(users).set({ lastMessageAt: new Date(now) }).where(eq(users.id, userId));
    const res = await this.levels.addXP(userId, gain);
    if (res.levelUp && message.member) {
      await this.levels.handleLevelUp(message.member, res.newLevel, announce);
    }
  }
}
