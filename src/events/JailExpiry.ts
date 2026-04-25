import { injectable, inject } from "tsyringe";
import { Discord, Once } from "@rpbey/discordx";
import type { Client } from "discord.js";
import { and, isNull, lte } from "drizzle-orm";
import { DatabaseService } from "~/db/index";
import { jails } from "~/db/schema";
import { ModerationService } from "~/services/ModerationService";
import { env } from "~/lib/env";
import { CronRegistry } from "~/api/cron-registry";

@Discord()
@injectable()
export class JailExpiryEvent {
  constructor(
    @inject(DatabaseService) private dbs: DatabaseService,
    @inject(ModerationService) private mod: ModerationService,
    @inject(CronRegistry) private cron: CronRegistry,
  ) {}

  @Once({ event: "clientReady" })
  async start([client]: [Client]) {
    this.cron.register({
      name: "jail-expiry",
      description: "Auto-unjail des membres dont la peine expire",
      intervalMs: 60_000,
      fn: () => this.tick(client),
    });
  }

  async tick(client: Client) {
    const now = new Date();
    const expired = await this.dbs.db
      .select()
      .from(jails)
      .where(and(isNull(jails.releasedAt), lte(jails.expiresAt, now)));
    const guild = client.guilds.cache.get(env.GUILD_ID);
    if (!guild) return;
    for (const j of expired) {
      await this.mod.unjail(guild, j.userId, client.user?.id ?? "bot", "auto-expiry").catch(() => {});
    }
  }
}
