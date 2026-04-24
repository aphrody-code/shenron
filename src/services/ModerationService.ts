import { singleton, inject } from "tsyringe";
import { and, eq, isNull, sql } from "drizzle-orm";
import type { Guild, GuildMember } from "discord.js";
import { DatabaseService } from "~/db/index";
import { warns, jails, actionLogs } from "~/db/schema";
import { env } from "~/lib/env";
import { logger } from "~/lib/logger";

@singleton()
export class ModerationService {
  constructor(@inject(DatabaseService) private dbs: DatabaseService) {}

  private get db() {
    return this.dbs.db;
  }

  async log(action: string, userId: string | null, moderatorId: string | null, reason?: string, meta?: unknown) {
    await this.db.insert(actionLogs).values({
      action,
      userId: userId ?? null,
      moderatorId: moderatorId ?? null,
      reason: reason ?? null,
      meta: meta ? JSON.stringify(meta) : null,
    });
  }

  // Warns
  async addWarn(userId: string, moderatorId: string, reason?: string) {
    await this.db.insert(warns).values({ userId, moderatorId, reason: reason ?? null });
    await this.log("WARN", userId, moderatorId, reason);
  }

  async removeLastWarn(userId: string): Promise<boolean> {
    const w = await this.db.query.warns.findFirst({
      where: and(eq(warns.userId, userId), eq(warns.active, true)),
      orderBy: (t, { desc }) => desc(t.createdAt),
    });
    if (!w) return false;
    await this.db.update(warns).set({ active: false }).where(eq(warns.id, w.id));
    await this.log("UNWARN", userId, null, `removed warn #${w.id}`);
    return true;
  }

  async countWarns(userId: string): Promise<number> {
    const [row] = await this.db
      .select({ c: sql<number>`count(*)` })
      .from(warns)
      .where(and(eq(warns.userId, userId), eq(warns.active, true)));
    return Number(row?.c ?? 0);
  }

  // Jail
  async jail(member: GuildMember, moderatorId: string, reason?: string, durationMs?: number) {
    const roleId = env.JAIL_ROLE_ID;
    if (!roleId) throw new Error("JAIL_ROLE_ID not configured");

    const prev = member.roles.cache.filter((r) => r.id !== member.guild.id).map((r) => r.id);
    await this.db.insert(jails).values({
      userId: member.id,
      moderatorId,
      reason: reason ?? null,
      expiresAt: durationMs ? new Date(Date.now() + durationMs) : null,
      previousRoles: JSON.stringify(prev),
    });

    await member.roles.set([roleId]).catch((err) => {
      logger.error({ err }, "Failed to set jail role");
      throw err;
    });
    await this.log("JAIL", member.id, moderatorId, reason, { durationMs, previousRoles: prev });
  }

  async unjail(guild: Guild, userId: string, moderatorId: string, reason?: string): Promise<boolean> {
    const j = await this.db.query.jails.findFirst({
      where: and(eq(jails.userId, userId), isNull(jails.releasedAt)),
      orderBy: (t, { desc }) => desc(t.createdAt),
    });
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) return false;

    const roleId = env.JAIL_ROLE_ID;
    const restore: string[] = j?.previousRoles ? (JSON.parse(j.previousRoles) as string[]) : [];

    if (roleId) await member.roles.remove(roleId).catch(() => {});
    for (const r of restore) {
      await member.roles.add(r).catch(() => {});
    }

    if (j) {
      await this.db.update(jails).set({ releasedAt: new Date() }).where(eq(jails.id, j.id));
    }
    await this.log("UNJAIL", userId, moderatorId, reason);
    return true;
  }

  async getActiveJail(userId: string) {
    return this.db.query.jails.findFirst({
      where: and(eq(jails.userId, userId), isNull(jails.releasedAt)),
      orderBy: (t, { desc }) => desc(t.createdAt),
    });
  }
}
