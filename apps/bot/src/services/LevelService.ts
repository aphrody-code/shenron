import { singleton, inject } from "tsyringe";
import { and, desc, eq, sql, lte } from "drizzle-orm";
import type { GuildMember, TextBasedChannel } from "discord.js";
import { DatabaseService } from "~/db/index";
import { users, levelRewards, actionLogs, fusions } from "~/db/schema";
import { or } from "drizzle-orm";
import { LEVEL_THRESHOLDS, ZENI_PER_LEVEL, FUSION_XP_BONUS_RATIO } from "~/lib/constants";
import { levelForXP, formatXP } from "~/lib/xp";
import { levelUpMessage } from "~/lib/dbz-flavor";
import { levelUpEmbed } from "~/lib/embeds";
import { logger } from "~/lib/logger";
import { MessageTemplateService } from "~/services/MessageTemplateService";
import { SettingsService } from "~/services/SettingsService";

@singleton()
export class LevelService {
	constructor(
		@inject(DatabaseService) private dbs: DatabaseService,
		@inject(MessageTemplateService) private templates: MessageTemplateService,
		@inject(SettingsService) private settings: SettingsService
	) {}

	private get db() {
		return this.dbs.db;
	}

	async ensureUser(userId: string) {
		await this.db.insert(users).values({ id: userId }).onConflictDoNothing();
	}

	async getUser(userId: string) {
		await this.ensureUser(userId);
		return this.db.query.users.findFirst({ where: eq(users.id, userId) });
	}

	async addXP(
		userId: string,
		amount: number,
		options: { propagateFusion?: boolean } = { propagateFusion: true }
	): Promise<{
		before: number;
		after: number;
		levelUp: boolean;
		newLevel: number;
		partnerBonus?: number;
	}> {
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
			const zeniBonus = await this.settings.getInt("zeni.per_level", ZENI_PER_LEVEL);
			await this.db
				.update(users)
				.set({ zeni: sql`${users.zeni} + ${zeniBonus}` })
				.where(eq(users.id, userId));
		}

		// Bonus fusion: le/la partenaire reçoit un % sans propagation inverse
		let partnerBonus: number | undefined;
		if (options.propagateFusion && amount > 0) {
			const partner = await this.partnerOf(userId);
			if (partner) {
				const ratio = await this.settings.getFloat("xp.fusion.bonus_ratio", FUSION_XP_BONUS_RATIO);
				partnerBonus = Math.floor(amount * ratio);
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

	async setXP(
		userId: string,
		xp: number
	): Promise<{ oldLevel: number; newLevel: number; levelUp: boolean }> {
		await this.ensureUser(userId);
		const current = await this.getUser(userId);
		const oldLevel = current?.lastLevelReached ?? levelForXP(current?.xp ?? 0);
		const newLevel = levelForXP(xp);
		await this.db
			.update(users)
			.set({ xp, lastLevelReached: newLevel, updatedAt: new Date() })
			.where(eq(users.id, userId));
		return { oldLevel, newLevel, levelUp: newLevel > oldLevel };
	}

	/**
	 * Top par XP (cohérent partout : slash /top, API /api/public/leaderboard,
	 * dashboard /admin/leaderboards). Filtre xp > 0 pour éliminer les ~5800
	 * users à 0 XP qui sont créés lazy par ensureUser mais n'ont jamais
	 * envoyé de message. Sans ce filter le top affichait des doublons à 0.
	 */
	async top(limit = 10, offset = 0) {
		return this.db
			.select()
			.from(users)
			.where(sql`${users.xp} > 0`)
			.orderBy(desc(users.xp))
			.limit(limit)
			.offset(offset);
	}

	async rankOf(userId: string): Promise<number | null> {
		const u = await this.getUser(userId);
		if (!u || u.xp <= 0) return null;
		const [row] = await this.db
			.select({ c: sql<number>`count(*)` })
			.from(users)
			.where(sql`${users.xp} > ${u.xp}`);
		return Number(row?.c ?? 0) + 1;
	}

	async totalUsers(): Promise<number> {
		const [row] = await this.db
			.select({ c: sql<number>`count(*)` })
			.from(users)
			.where(sql`${users.xp} > 0`);
		return Number(row?.c ?? 0);
	}

	async listRewards() {
		return this.db.select().from(levelRewards).orderBy(levelRewards.level);
	}

	async handleLevelUp(member: GuildMember, newLevel: number, fallbackChannel?: TextBasedChannel) {
		// Récupère toutes les récompenses jusqu'au nouveau niveau (évite de sauter des paliers)
		const allRewards = await this.db
			.select()
			.from(levelRewards)
			.where(lte(levelRewards.level, newLevel))
			.orderBy(levelRewards.level);

		// On ne traite que les récompenses du niveau actuel pour le zeni bonus,
		// mais on s'assure que TOUS les rôles des niveaux précédents sont acquis.
		const currentLevelRewards = allRewards.filter((r) => r.level === newLevel);
		let bonusZeni = 0;

		for (const reward of allRewards) {
			const role =
				member.guild.roles.cache.get(reward.roleId) ??
				(await member.guild.roles.fetch(reward.roleId).catch(() => null));
			const me = member.guild.members.me;

			if (role && me && role.position >= me.roles.highest.position) {
				logger.warn(
					{ roleId: reward.roleId, level: reward.level },
					"level reward role above bot — skipped"
				);
				continue;
			}

			if (role && !member.roles.cache.has(reward.roleId)) {
				try {
					await member.roles.add(reward.roleId, `Récompense niveau ${reward.level}`);
				} catch (err) {
					logger.warn({ err, roleId: reward.roleId }, "Failed to add level role");
					continue;
				}
			}

			// On n'ajoute le zeni bonus que pour le niveau actuel (les niveaux passés
			// sont supposés avoir été déjà crédités, ou on ne veut pas flood).
			if (reward.level === newLevel) {
				bonusZeni += reward.zeniBonus;
			}
		}

		if (bonusZeni > 0) {
			await this.db
				.update(users)
				.set({ zeni: sql`${users.zeni} + ${bonusZeni}` })
				.where(eq(users.id, member.id));
		}

		await this.db.insert(actionLogs).values({
			userId: member.id,
			action: "LEVEL_UP",
			meta: JSON.stringify({
				level: newLevel,
				bonusZeni,
				rewards: currentLevelRewards.map((r) => r.roleId),
			}),
		});

		// Résolution canal via MessageTemplateService
		const target = await this.templates.resolveTarget("level_up", member.client);
		if (target && !target.enabled) return;
		const channel =
			target?.channel ?? (fallbackChannel && "send" in fallbackChannel ? fallbackChannel : null);
		if (!channel) return;

		const u = await this.getUser(member.id);
		const baseLevelZeni = await this.settings.getInt("zeni.per_level", ZENI_PER_LEVEL);
		const embed = levelUpEmbed({
			member,
			level: newLevel,
			xp: u?.xp ?? 0,
			zeniBonus: bonusZeni + baseLevelZeni,
			message: levelUpMessage(member.id, newLevel),
		});
		await channel.send({ content: `<@${member.id}>`, embeds: [embed] }).catch(() => {});
	}
}
