import { injectable, inject } from "tsyringe";
import { Discord, Once } from "@rpbey/discordx";
import type { Client } from "discord.js";
import { and, isNull, lte } from "drizzle-orm";
import { DatabaseService } from "~/db/index";
import { jails } from "~/db/schema";
import { ModerationService } from "~/services/ModerationService";
import { env } from "~/lib/env";

@Discord()
@injectable()
export class JailExpiryEvent {
  constructor(
    @inject(DatabaseService) private dbs: DatabaseService,
    @inject(ModerationService) private mod: ModerationService,
  ) {}

  @Once({ event: "clientReady" })
  async start([client]: [Client]) {
    setInterval(() => this.tick(client).catch(() => {}), 60_000).unref();
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
