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
import { resolveLevelChannel } from "~/lib/announce";
import { MessageTemplateService } from "~/services/MessageTemplateService";
import { ModerationService } from "~/services/ModerationService";
import { SettingsService } from "~/services/SettingsService";
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
    @inject(MessageTemplateService) private msg: MessageTemplateService,
    @inject(SettingsService) private settings: SettingsService,
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
          await this.msg.publish(
            "anti_link_jail",
            { user: `<@${userId}>`, url },
            message.client,
          );
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
      (await resolveLevelChannel(message.client, message.guild ?? undefined)) ??
      ("send" in message.channel ? message.channel : null);
    if (!announce) return;

    // Quête quotidienne — message rendu par le template `daily_quest`.
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
      await this.msg.publish(
        "daily_quest",
        { user: `<@${userId}>`, zeni: ZENI_DAILY_QUEST, streak },
        message.client,
      );
    }

    // Succès — résolution lazy via le template service (gère canal + texte).
    const isFirstMessage = user.messageCount === 0;
    const granted = await this.achievements.checkMessage(userId, message.content);
    if (isFirstMessage) {
      await this.eco.grantAchievement(userId, "FIRST_MESSAGE");
      await this.msg.publish(
        "first_message",
        { user: `<@${userId}>`, userName: message.author.username },
        message.client,
      );
    }
    for (const code of granted) {
      await this.msg.publish(
        "achievement_unlocked",
        { user: `<@${userId}>`, userName: message.author.username, code },
        message.client,
      );
    }
    await this.dbs.db.update(users).set({ messageCount: user.messageCount + 1 }).where(eq(users.id, userId));

    // XP cooldown
    if (now - last < XP_MESSAGE_COOLDOWN_MS) return;
    let gain = randomInt(XP_PER_MESSAGE_MIN, XP_PER_MESSAGE_MAX);

    // Boost XP par rôle — on prend le MAX (ne stack pas, comportement standard Discord)
    if (message.member) {
      const boosts = await this.settings.getXpBoostRoles();
      let maxMult = 1;
      for (const b of boosts) {
        if (message.member.roles.cache.has(b.roleId) && b.multiplier > maxMult) {
          maxMult = b.multiplier;
        }
      }
      if (maxMult > 1) gain = Math.floor(gain * maxMult);
    }

    await this.dbs.db.update(users).set({ lastMessageAt: new Date(now) }).where(eq(users.id, userId));
    const res = await this.levels.addXP(userId, gain);
    if (res.levelUp && message.member) {
      await this.levels.handleLevelUp(message.member, res.newLevel, announce);
    }
  }
}
