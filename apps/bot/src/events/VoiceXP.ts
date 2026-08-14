import { injectable, inject } from "tsyringe";
import { Bot, Discord, On, Once, type ArgsOf } from "@rpbey/discordy";
import type { Client, Guild, GuildMember, VoiceBasedChannel } from "discord.js";
import { LevelService } from "~/services/LevelService";
import { VocalTempoService } from "~/services/VocalTempoService";
import { SettingsService } from "~/services/SettingsService";
import { MessageTemplateService } from "~/services/MessageTemplateService";
import { XP_PER_VOICE_TICK, XP_VOICE_TICK_MS, VOCAL_TEMPO_EMPTY_DELAY_MS } from "~/lib/constants";
import { env } from "~/lib/env";
import { resolveLevelChannel } from "~/lib/announce";
import { boosterXpMultiplier } from "~/lib/booster";
import { voiceXpMultiplier } from "~/lib/races";
import { logger } from "~/lib/logger";
import { ChannelType } from "discord.js";
import { CronRegistry } from "~/api/cron-registry";

interface VoiceSession {
	channelId: string;
	joinedAt: number;
	lastTickAt: number;
}

@Discord()
@Bot("kaio")
@injectable()
export class VoiceXPEvent {
	private sessions = new Map<string, VoiceSession>(); // userId -> session
	private emptyTimers = new Map<string, ReturnType<typeof setTimeout>>();

	constructor(
		@inject(LevelService) private levels: LevelService,
		@inject(VocalTempoService) private vts: VocalTempoService,
		@inject(CronRegistry) private cron: CronRegistry,
		@inject(SettingsService) private settings: SettingsService,
		@inject(MessageTemplateService) private msg: MessageTemplateService
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
		// Toggle features.voice_xp — fallback true (DB vide = activé par défaut).
		if (!(await this.settings.getBool("features.voice_xp", true))) return;
		const now = Date.now();
		// Snapshot des boosts une fois par tick (cache 30s côté SettingsService)
		const boosts = await this.settings.getXpBoostRoles();
		const guild = client.guilds.cache.get(env.GUILD_ID) ?? client.guilds.cache.first();

		// Vérité = état vocal réel de Discord, pas la mémoire d'events passés.
		if (guild) await this.syncSessions(guild, now);

		// Setting xp.voice.per_minute → conversion en per-tick (XP_VOICE_TICK_MS).
		// Fallback constant `XP_PER_VOICE_TICK` si pas de setting.
		const perMinute = await this.settings.getInt("xp.voice.per_minute", 0);
		const baseGain =
			perMinute > 0
				? Math.max(1, Math.round((perMinute * XP_VOICE_TICK_MS) / 60_000))
				: XP_PER_VOICE_TICK;

		for (const [userId, sess] of this.sessions) {
			// Marge de 5s : `setInterval` peut tirer quelques ms trop tôt et faire
			// sauter un tick entier (XP vocal divisé par 2 sans raison visible).
			if (now - sess.lastTickAt < XP_VOICE_TICK_MS - 5_000) continue;
			sess.lastTickAt = now;

			// Boost XP par rôle — MAX (ne stack pas). Inclut le boost booster auto.
			let gain = baseGain;
			if (guild) {
				const member =
					guild.members.cache.get(userId) ?? (await guild.members.fetch(userId).catch(() => null));
				if (member) {
					let maxMult = 1;
					for (const b of boosts) {
						if (member.roles.cache.has(b.roleId) && b.multiplier > maxMult) {
							maxMult = b.multiplier;
						}
					}
					const boosterMult = await boosterXpMultiplier(member, this.settings);
					if (boosterMult > maxMult) maxMult = boosterMult;
					if (maxMult > 1) gain = Math.floor(gain * maxMult);
				}
			}

			// Multiplicateur de RACE vocal (Race de Freezer ×1.4 / Saiyen ×1.25 / Zenkai…).
			const u = await this.levels.getUser(userId);
			gain = Math.floor(gain * voiceXpMultiplier(u?.race, u?.raceBoostUntil?.getTime() ?? 0, now));

			// Temps de présence vocal (classement « vocal » + stats de profil).
			await this.levels.addVoiceTime(userId, XP_VOICE_TICK_MS, new Date(sess.joinedAt));

			const res = await this.levels.addXP(userId, gain);
			if (res.levelUp) {
				const member = await guild?.members.fetch(userId).catch(() => null);
				if (member) {
					const announce = await resolveLevelChannel(client, guild);
					await this.levels.handleLevelUp(member, res.newLevel, announce ?? undefined);
				}
			}
		}
	}

	/**
	 * Réconcilie `sessions` avec l'état vocal réel de la guilde.
	 *
	 * `sessions` n'était alimentée que par `voiceStateUpdate` : après un restart
	 * du bot (ou un event manqué / une reconnexion gateway), tous les membres
	 * déjà connectés en vocal restaient invisibles → **zéro XP vocal** tant
	 * qu'ils ne changeaient pas de salon ou ne re-toggle pas leur micro. Comme
	 * le service redémarre à chaque déploiement, la map restait vide en pratique
	 * (tick à 0 ms, aucun gain, classement figé).
	 */
	private async syncSessions(guild: Guild, now: number) {
		const hubId = (await this.settings.getRaw("channel.vocal_tempo_hub")) ?? env.VOCAL_TEMPO_HUB_ID;
		const eligible = new Set<string>();

		for (const state of guild.voiceStates.cache.values()) {
			const channel = state.channel;
			if (!channel) continue;
			const member = state.member ?? guild.members.cache.get(state.id);
			if (!member || member.user.bot) continue;
			if (channel.id === guild.afkChannelId) continue;
			if (hubId && channel.id === hubId) continue; // salon d'accueil vocal tempo
			if (state.selfMute || state.mute) continue; // muet = pas d'XP (spec)

			eligible.add(state.id);
			const sess = this.sessions.get(state.id);
			if (sess) sess.channelId = channel.id;
			else {
				// Déjà en vocal avant qu'on le sache → éligible dès ce tick.
				this.sessions.set(state.id, {
					channelId: channel.id,
					joinedAt: now,
					lastTickAt: now - XP_VOICE_TICK_MS,
				});
			}
		}

		const stale: string[] = [];
		for (const userId of this.sessions.keys()) {
			if (!eligible.has(userId)) stale.push(userId);
		}
		for (const userId of stale) this.sessions.delete(userId);
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
			// Vocal tempo HUB — priorité au setting runtime (`channel.vocal_tempo_hub`)
			// qui peut être set à chaud sans redémarrer, fallback env legacy.
			const hubId =
				(await this.settings.getRaw("channel.vocal_tempo_hub")) ?? env.VOCAL_TEMPO_HUB_ID;
			if (hubId && newCh.id === hubId && newState.member) {
				await this.createTempo(newState.member, newCh);
				return;
			}
			if (!muted) {
				this.sessions.set(userId, {
					channelId: newCh.id,
					joinedAt: Date.now(),
					lastTickAt: Date.now(),
				});
			}
		}

		// MUTE TOGGLE within channel
		if (oldCh && newCh && oldCh.id === newCh.id) {
			if (muted) this.sessions.delete(userId);
			else if (!this.sessions.has(userId)) {
				this.sessions.set(userId, {
					channelId: newCh.id,
					joinedAt: Date.now(),
					lastTickAt: Date.now(),
				});
			}
		}
	}

	private async createTempo(member: GuildMember, hub: VoiceBasedChannel) {
		try {
			const parentId = hub.parentId ?? undefined;
			const tempo = await this.vts.createFor(member.guild, member, parentId);
			await member.voice.setChannel(tempo).catch(() => {});
			await this.msg.publish(
				"vocal_tempo_created",
				{ user: `<@${member.id}>`, channelId: tempo.id },
				member.client
			);
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
		const delayMs = await this.settings.getInt(
			"vocal.tempo_empty_delay_ms",
			VOCAL_TEMPO_EMPTY_DELAY_MS
		);
		const timer = setTimeout(async () => {
			const refetched = await channel.fetch().catch(() => null);
			if (!refetched || refetched.members.size > 0) return;
			await refetched.delete("Vocal tempo empty").catch(() => {});
			await this.vts.remove(channel.id);
			this.emptyTimers.delete(channel.id);
			await this.msg.publish("vocal_tempo_destroyed", { channelId: channel.id }, channel.client);
		}, delayMs);
		this.emptyTimers.set(channel.id, timer);
	}
}
