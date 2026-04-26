import { singleton, inject } from "tsyringe";
import { and, desc, eq, sql } from "drizzle-orm";
import type { GuildMember, TextBasedChannel } from "discord.js";
import { DatabaseService } from "~/db/index";
import { users, levelRewards, actionLogs, fusions } from "~/db/schema";
import { or } from "drizzle-orm";
import { LEVEL_THRESHOLDS, ZENI_PER_LEVEL, FUSION_XP_BONUS_RATIO } from "~/lib/constants";
import { levelForXP, formatXP } from "~/lib/xp";
import { levelUpMessage } from "~/lib/dbz-flavor";
import { levelUpEmbed } from "~/lib/embeds";
import { logger } from "~/lib/logger";

@singleton()
export class LevelService {
  constructor(@inject(DatabaseService) private dbs: DatabaseService) {}

  private get db() {
    return this.dbs.db;
  }

  async ensureUser(userId: string) {
    await this.db
      .insert(users)
      .values({ id: userId })
      .onConflictDoNothing();
  }

  async getUser(userId: string) {
    await this.ensureUser(userId);
    return this.db.query.users.findFirst({ where: eq(users.id, userId) });
  }

  async addXP(
    userId: string,
    amount: number,
    options: { propagateFusion?: boolean } = { propagateFusion: true },
  ): Promise<{ before: number; after: number; levelUp: boolean; newLevel: number; partnerBonus?: number }> {
    await this.ensureUser(userId);
    const current = await this.getUser(userId);
    const before = current?.xp ?? 0;
    const after = before + amount;
    const oldLevel = levelForXP(before);
    const newLevel = levelForXP(after);
    const levelUp = newLevel > oldLevel;

    await this.db
      .update(users)
      .set({
        xp: after,
        lastLevelReached: newLevel,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    if (levelUp) {
      await this.db
        .update(users)
        .set({ zeni: sql`${users.zeni} + ${ZENI_PER_LEVEL}` })
        .where(eq(users.id, userId));
    }

    // Bonus fusion: le/la partenaire reçoit un % sans propagation inverse
    let partnerBonus: number | undefined;
    if (options.propagateFusion && amount > 0) {
      const partner = await this.partnerOf(userId);
      if (partner) {
        partnerBonus = Math.floor(amount * FUSION_XP_BONUS_RATIO);
        if (partnerBonus > 0) {
          await this.addXP(partner, partnerBonus, { propagateFusion: false });
        }
      }
    }

    return { before, after, levelUp, newLevel, partnerBonus };
  }

  async partnerOf(userId: string): Promise<string | null> {
    const f = await this.db.query.fusions.findFirst({
      where: or(eq(fusions.userA, userId), eq(fusions.userB, userId)),
    });
    if (!f) return null;
    return f.userA === userId ? f.userB : f.userA;
  }

  async setXP(userId: string, xp: number) {
    await this.ensureUser(userId);
    await this.db.update(users).set({ xp, lastLevelReached: levelForXP(xp), updatedAt: new Date() }).where(eq(users.id, userId));
  }

  async top(limit = 10, offset = 0) {
    return this.db
      .select()
      .from(users)
      .orderBy(desc(users.xp))
      .limit(limit)
      .offset(offset);
  }

  async rankOf(userId: string): Promise<number | null> {
    const u = await this.getUser(userId);
    if (!u) return null;
    const [row] = await this.db
      .select({ c: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.xp} > ${u.xp}`);
    return Number(row?.c ?? 0) + 1;
  }

  async totalUsers(): Promise<number> {
    const [row] = await this.db.select({ c: sql<number>`count(*)` }).from(users);
    return Number(row?.c ?? 0);
  }

  async listRewards() {
    return this.db.select().from(levelRewards).orderBy(levelRewards.level);
  }

  async handleLevelUp(member: GuildMember, newLevel: number, channel?: TextBasedChannel) {
    const rewards = await this.db.select().from(levelRewards).where(eq(levelRewards.level, newLevel));
    for (const reward of rewards) {
      if (!member.roles.cache.has(reward.roleId)) {
        await member.roles.add(reward.roleId).catch((err) => logger.warn({ err, roleId: reward.roleId }, "Failed to add level role"));
      }
    }
    await this.db.insert(actionLogs).values({
      userId: member.id,
      action: "LEVEL_UP",
      meta: JSON.stringify({ level: newLevel }),
    });

    if (channel && "send" in channel) {
      const u = await this.getUser(member.id);
      const reward = rewards[0];
      const embed = levelUpEmbed({
        member,
        level: newLevel,
        xp: u?.xp ?? 0,
        zeniBonus: (reward?.zeniBonus ?? 0) + ZENI_PER_LEVEL,
        message: levelUpMessage(member.id, newLevel),
      });
      await channel.send({ content: `<@${member.id}>`, embeds: [embed] }).catch(() => {});
    }
  }
}
