import { injectable, inject } from "tsyringe";
import { Discord, On, Once, type ArgsOf } from "@rpbey/discordx";
import type { Client, GuildMember, VoiceBasedChannel } from "discord.js";
import { LevelService } from "~/services/LevelService";
import { VocalTempoService } from "~/services/VocalTempoService";
import { XP_PER_VOICE_TICK, XP_VOICE_TICK_MS, VOCAL_TEMPO_EMPTY_DELAY_MS } from "~/lib/constants";
import { env } from "~/lib/env";
import { resolveAnnounceChannel } from "~/lib/announce";
import { logger } from "~/lib/logger";
import { ChannelType } from "discord.js";
import { CronRegistry } from "~/api/cron-registry";

interface VoiceSession {
  channelId: string;
  joinedAt: number;
  lastTickAt: number;
}

@Discord()
@injectable()
export class VoiceXPEvent {
  private sessions = new Map<string, VoiceSession>(); // userId -> session
  private emptyTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(
    @inject(LevelService) private levels: LevelService,
    @inject(VocalTempoService) private vts: VocalTempoService,
    @inject(CronRegistry) private cron: CronRegistry,
  ) {}

  @Once({ event: "clientReady" })
  async startTicker([client]: [Client]) {
    this.cron.register({
      name: "voice-xp-tick",
      description: `Distribution d'XP pour les membres en vocal (toutes les ${XP_VOICE_TICK_MS / 1000}s)`,
      intervalMs: XP_VOICE_TICK_MS,
      fn: () => this.tickXP(client),
    });
  }

  private async tickXP(client: Client) {
    const now = Date.now();
    for (const [userId, sess] of this.sessions) {
      if (now - sess.lastTickAt < XP_VOICE_TICK_MS) continue;
      sess.lastTickAt = now;
      const res = await this.levels.addXP(userId, XP_PER_VOICE_TICK);
      if (res.levelUp) {
        const guild = client.guilds.cache.first();
        const member = await guild?.members.fetch(userId).catch(() => null);
        if (member) {
          const announce = await resolveAnnounceChannel(client, guild);
          await this.levels.handleLevelUp(member, res.newLevel, announce ?? undefined);
        }
      }
    }
  }

  @On({ event: "voiceStateUpdate" })
  async onVoice([oldState, newState]: ArgsOf<"voiceStateUpdate">) {
    const userId = newState.id;
    const oldCh = oldState.channel;
    const newCh = newState.channel;

    // Skip muted (no XP) per spec
    const muted = newState.selfMute || newState.mute;

    // LEAVE
    if (oldCh && (!newCh || oldCh.id !== newCh.id)) {
      this.sessions.delete(userId);
      await this.handleMaybeEmpty(oldCh);
    }

    // JOIN / MOVE
    if (newCh && (!oldCh || oldCh.id !== newCh.id)) {
      // Vocal tempo HUB
      if (newCh.id === env.VOCAL_TEMPO_HUB_ID && newState.member) {
        await this.createTempo(newState.member, newCh);
        return;
      }
      if (!muted) {
        this.sessions.set(userId, { channelId: newCh.id, joinedAt: Date.now(), lastTickAt: Date.now() });
      }
    }

    // MUTE TOGGLE within channel
    if (oldCh && newCh && oldCh.id === newCh.id) {
      if (muted) this.sessions.delete(userId);
      else if (!this.sessions.has(userId)) {
        this.sessions.set(userId, { channelId: newCh.id, joinedAt: Date.now(), lastTickAt: Date.now() });
      }
    }
  }

  private async createTempo(member: GuildMember, hub: VoiceBasedChannel) {
    try {
      const parentId = hub.parentId ?? undefined;
      const tempo = await this.vts.createFor(member.guild, member, parentId);
      await member.voice.setChannel(tempo).catch(() => {});
    } catch (err) {
      logger.warn({ err }, "Failed to create vocal tempo");
    }
  }

  private async handleMaybeEmpty(channel: VoiceBasedChannel) {
    if (channel.type !== ChannelType.GuildVoice) return;
    const isTempo = await this.vts.isTempo(channel.id);
    if (!isTempo) return;
    if (channel.members.size > 0) return;

    const prev = this.emptyTimers.get(channel.id);
    if (prev) clearTimeout(prev);
    const timer = setTimeout(async () => {
      const refetched = await channel.fetch().catch(() => null);
      if (!refetched || refetched.members.size > 0) return;
      await refetched.delete("Vocal tempo empty").catch(() => {});
      await this.vts.remove(channel.id);
      this.emptyTimers.delete(channel.id);
    }, VOCAL_TEMPO_EMPTY_DELAY_MS);
    this.emptyTimers.set(channel.id, timer);
  }
}
