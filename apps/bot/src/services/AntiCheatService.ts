/**
 * Anti-triche économie — détecte les gains de zeni anormaux (spikes, vélocité,
 * plafonds horaire/journalier, ratio zeni/niveau, rafales de jeux) et pose des
 * signalements dans `economy_flags`. Peut geler les gains (`users.zeni_frozen`).
 *
 * Appelé après chaque crédit via `EconomyService.addZeni` (source non-admin).
 * Seuils surchargables via SettingsService (`anticheat.*`).
 */
import { singleton, inject } from "tsyringe";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { DatabaseService } from "~/db/index";
import { actionLogs, economyFlags, users } from "~/db/schema";
import { SettingsService } from "~/services/SettingsService";
import { LogService } from "~/services/LogService";
import { Client, EmbedBuilder } from "discord.js";
import { logger } from "~/lib/logger";

export type ZeniSource =
	| "game"
	| "daily"
	| "drop"
	| "regen"
	| "level"
	| "shop_refund"
	| "admin"
	| "fusion"
	| "other";

export interface GainContext {
	userId: string;
	/** Montant crédité (après multi race), > 0. */
	amount: number;
	/** Solde après crédit. */
	balanceAfter: number;
	source: ZeniSource;
	/** Détail libre (game name, etc.). */
	detail?: string;
}

type Severity = "low" | "medium" | "high" | "critical";

interface Detection {
	code: string;
	severity: Severity;
	reason: string;
	meta: Record<string, unknown>;
	/** Geler les gains immédiatement. */
	freeze?: boolean;
}

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

/** Sources exemptées d'analyse (admin manuel). */
const EXEMPT: ReadonlySet<ZeniSource> = new Set(["admin"]);

@singleton()
export class AntiCheatService {
	constructor(
		@inject(DatabaseService) private dbs: DatabaseService,
		@inject(SettingsService) private settings: SettingsService
	) {
		// Colonnes / tables PG-less : assure le schéma à chaud (SQLite).
		this.ensureSchema();
	}

	private get db() {
		return this.dbs.db;
	}

	/** Idempotent — safe au boot et en multi-instance. */
	ensureSchema() {
		try {
			this.dbs.sqlite.exec(`
				CREATE TABLE IF NOT EXISTS economy_flags (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					user_id TEXT NOT NULL,
					severity TEXT NOT NULL DEFAULT 'medium',
					code TEXT NOT NULL,
					reason TEXT NOT NULL,
					meta TEXT,
					status TEXT NOT NULL DEFAULT 'open',
					created_at INTEGER NOT NULL DEFAULT (CAST(unixepoch() * 1000 AS INTEGER)),
					resolved_at INTEGER,
					resolved_by TEXT,
					resolve_note TEXT
				);
				CREATE INDEX IF NOT EXISTS idx_economy_flags_user ON economy_flags(user_id);
				CREATE INDEX IF NOT EXISTS idx_economy_flags_status ON economy_flags(status);
				CREATE INDEX IF NOT EXISTS idx_economy_flags_created ON economy_flags(created_at);
			`);
			// Colonne users.zeni_frozen (ajoutée après coup).
			const cols = this.dbs.sqlite.query(`PRAGMA table_info(users)`).all() as Array<{
				name: string;
			}>;
			if (!cols.some((c) => c.name === "zeni_frozen")) {
				this.dbs.sqlite.exec(`ALTER TABLE users ADD COLUMN zeni_frozen INTEGER NOT NULL DEFAULT 0`);
			}
		} catch (e) {
			logger.warn({ err: e }, "[anticheat] ensureSchema partial failure");
		}
	}

	/** Analyse un gain et crée des flags si anomalies. Ne throw jamais. */
	async inspect(ctx: GainContext): Promise<Detection[]> {
		if (ctx.amount <= 0 || EXEMPT.has(ctx.source)) return [];
		try {
			const detections = await this.detect(ctx);
			for (const d of detections) {
				await this.raise(ctx.userId, d);
			}
			return detections;
		} catch (e) {
			logger.error({ err: e, userId: ctx.userId }, "[anticheat] inspect failed");
			return [];
		}
	}

	private async thresholds() {
		return {
			// Gain unique max hors admin (défaut 25k — un level up ~1k, jeu ~100).
			maxSingle: await this.settings.getInt("anticheat.zeni.max_single", 25_000),
			// Somme des gains sur 1 h.
			maxHourly: await this.settings.getInt("anticheat.zeni.max_hourly", 80_000),
			// Somme des gains sur 24 h.
			maxDaily: await this.settings.getInt("anticheat.zeni.max_daily", 250_000),
			// Nombre d'événements de gain sur 1 h.
			maxEventsHour: await this.settings.getInt("anticheat.zeni.max_events_hour", 40),
			// Gains « game » sur 1 h.
			maxGameHour: await this.settings.getInt("anticheat.zeni.max_game_hour", 25),
			// Ratio : zeni > (level+1) * ratio → flag.
			levelRatio: await this.settings.getInt("anticheat.zeni.level_ratio", 75_000),
			// Auto-freeze dès severity high/critical.
			autoFreezeHigh: await this.settings.getBool("anticheat.zeni.auto_freeze_high", true),
		};
	}

	private async detect(ctx: GainContext): Promise<Detection[]> {
		const t = await this.thresholds();
		const now = Date.now();
		const out: Detection[] = [];

		// 1) Spike unitaire
		if (ctx.amount >= t.maxSingle) {
			out.push({
				code: "SPIKE",
				severity: ctx.amount >= t.maxSingle * 4 ? "critical" : "high",
				reason: `Gain unitaire anormal : +${ctx.amount} zeni (seuil ${t.maxSingle}) via ${ctx.source}`,
				meta: {
					amount: ctx.amount,
					threshold: t.maxSingle,
					source: ctx.source,
					detail: ctx.detail,
				},
				freeze: true,
			});
		}

		// Ledger récent (action_logs ZENI_GAIN*)
		const sinceHour = new Date(now - HOUR_MS);
		const sinceDay = new Date(now - DAY_MS);
		const recent = await this.db
			.select()
			.from(actionLogs)
			.where(
				and(
					eq(actionLogs.userId, ctx.userId),
					inArray(actionLogs.action, [
						"ZENI_GAIN",
						"ZENI_GAIN_GAME",
						"ZENI_GAIN_DAILY",
						"ZENI_GAIN_DROP",
						"ZENI_GAIN_LEVEL",
						"ZENI_GAIN_REGEN",
						"ZENI_GAIN_FUSION",
						"ZENI_GAIN_OTHER",
					]),
					gte(actionLogs.createdAt, sinceDay)
				)
			)
			.orderBy(desc(actionLogs.createdAt))
			.limit(500);

		const parseMeta = (m: string | null) => {
			try {
				return m ? (JSON.parse(m) as { amount?: number; source?: string }) : {};
			} catch {
				return {};
			}
		};

		const hourRows = recent.filter((r) => {
			const ts = r.createdAt instanceof Date ? r.createdAt.getTime() : Number(r.createdAt);
			return ts >= sinceHour.getTime();
		});

		const sum = (rows: typeof recent) =>
			rows.reduce((s, r) => s + Math.max(0, Number(parseMeta(r.meta).amount) || 0), 0);

		const hourSum = sum(hourRows) + ctx.amount;
		const daySum = sum(recent) + ctx.amount;
		const hourEvents = hourRows.length + 1;
		const gameHour =
			hourRows.filter((r) => parseMeta(r.meta).source === "game").length +
			(ctx.source === "game" ? 1 : 0);

		// 2) Plafond horaire
		if (hourSum >= t.maxHourly) {
			out.push({
				code: "HOURLY_CAP",
				severity: hourSum >= t.maxHourly * 2 ? "critical" : "high",
				reason: `Plafond horaire dépassé : +${hourSum} zeni / 1h (seuil ${t.maxHourly})`,
				meta: { hourSum, threshold: t.maxHourly, events: hourEvents },
				freeze: hourSum >= t.maxHourly * 2,
			});
		}

		// 3) Plafond journalier
		if (daySum >= t.maxDaily) {
			out.push({
				code: "DAILY_CAP",
				severity: "high",
				reason: `Plafond journalier dépassé : +${daySum} zeni / 24h (seuil ${t.maxDaily})`,
				meta: { daySum, threshold: t.maxDaily },
			});
		}

		// 4) Vélocité (trop d'événements)
		if (hourEvents >= t.maxEventsHour) {
			out.push({
				code: "VELOCITY",
				severity: hourEvents >= t.maxEventsHour * 2 ? "high" : "medium",
				reason: `Trop de gains en 1h : ${hourEvents} événements (seuil ${t.maxEventsHour})`,
				meta: { hourEvents, threshold: t.maxEventsHour },
			});
		}

		// 5) Rafale de jeux
		if (gameHour >= t.maxGameHour) {
			out.push({
				code: "GAME_BURST",
				severity: "high",
				reason: `Rafale de gains de jeux : ${gameHour} en 1h (seuil ${t.maxGameHour})`,
				meta: { gameHour, threshold: t.maxGameHour },
			});
		}

		// 6) Ratio zeni / niveau (solde impossible pour le niveau)
		const u = await this.db.query.users.findFirst({ where: eq(users.id, ctx.userId) });
		if (u) {
			const level = Math.max(0, u.lastLevelReached ?? 0);
			const maxReasonable = (level + 1) * t.levelRatio + 5_000;
			if (ctx.balanceAfter > maxReasonable && ctx.balanceAfter > 50_000) {
				out.push({
					code: "RATIO",
					severity: ctx.balanceAfter > maxReasonable * 3 ? "critical" : "medium",
					reason: `Solde ${ctx.balanceAfter} zeni incompatible avec niveau ${level} (plafond estimé ~${maxReasonable})`,
					meta: {
						balance: ctx.balanceAfter,
						level,
						maxReasonable,
						ratio: t.levelRatio,
					},
					freeze: ctx.balanceAfter > maxReasonable * 5,
				});
			}
		}

		// Dédup : si un flag open identique existe déjà dans l'heure, on n'en recrée pas.
		if (out.length === 0) return out;
		const openRecent = await this.db
			.select()
			.from(economyFlags)
			.where(
				and(
					eq(economyFlags.userId, ctx.userId),
					eq(economyFlags.status, "open"),
					gte(economyFlags.createdAt, sinceHour)
				)
			)
			.limit(50);
		const openCodes = new Set(openRecent.map((f) => f.code));
		return out.filter((d) => !openCodes.has(d.code));
	}

	private async raise(userId: string, d: Detection) {
		const t = await this.thresholds();
		const shouldFreeze = Boolean(d.freeze && t.autoFreezeHigh);

		await this.db.insert(economyFlags).values({
			userId,
			severity: d.severity,
			code: d.code,
			reason: d.reason,
			meta: JSON.stringify(d.meta),
			status: "open",
		});

		if (shouldFreeze) {
			await this.db
				.update(users)
				.set({ zeniFrozen: true, updatedAt: new Date() })
				.where(eq(users.id, userId));
		}

		await this.db.insert(actionLogs).values({
			userId,
			action: "ZENI_FRAUD",
			reason: d.reason,
			meta: JSON.stringify({
				code: d.code,
				severity: d.severity,
				freeze: shouldFreeze,
				...d.meta,
			}),
		});

		// Alerte Discord (canal économie / audit) — best-effort.
		try {
			const client = (await import("tsyringe")).container.resolve(Client);
			const logs = (await import("tsyringe")).container.resolve(LogService);
			const color =
				d.severity === "critical"
					? 0xef4444
					: d.severity === "high"
						? 0xf97316
						: d.severity === "medium"
							? 0xeab308
							: 0x94a3b8;
			const embed = new EmbedBuilder()
				.setColor(color)
				.setTitle(`⚠ Anti-triche zeni · ${d.code}`)
				.setDescription(d.reason)
				.addFields(
					{ name: "Joueur", value: `<@${userId}> (\`${userId}\`)`, inline: true },
					{ name: "Sévérité", value: d.severity, inline: true },
					{
						name: "Gel",
						value: shouldFreeze ? "🧊 gains gelés" : "—",
						inline: true,
					}
				)
				.setTimestamp(new Date());
			await logs.send(client, "economy", embed);
		} catch {
			/* pas de client / canal */
		}

		logger.warn(
			{ userId, code: d.code, severity: d.severity, freeze: shouldFreeze },
			"[anticheat] flag raised"
		);
	}

	// ── API admin ────────────────────────────────────────────────────────────

	async listFlags(
		opts: {
			status?: string;
			limit?: number;
			offset?: number;
		} = {}
	) {
		const limit = Math.min(200, opts.limit ?? 50);
		const offset = Math.max(0, opts.offset ?? 0);
		const status = opts.status && opts.status !== "all" ? opts.status : undefined;
		const rows = status
			? await this.db
					.select()
					.from(economyFlags)
					.where(eq(economyFlags.status, status))
					.orderBy(desc(economyFlags.createdAt))
					.limit(limit)
					.offset(offset)
			: await this.db
					.select()
					.from(economyFlags)
					.orderBy(desc(economyFlags.createdAt))
					.limit(limit)
					.offset(offset);
		const [{ value: openCount } = { value: 0 }] = await this.db
			.select({ value: sql<number>`count(*)` })
			.from(economyFlags)
			.where(eq(economyFlags.status, "open"));
		return { rows, openCount: Number(openCount) };
	}

	async resolveFlag(
		id: number,
		by: string,
		status: "resolved" | "false_positive" | "reviewing",
		note?: string
	) {
		const [row] = await this.db.select().from(economyFlags).where(eq(economyFlags.id, id)).limit(1);
		if (!row) return null;
		await this.db
			.update(economyFlags)
			.set({
				status,
				resolvedAt: status === "reviewing" ? null : new Date(),
				resolvedBy: by,
				resolveNote: note ?? null,
			})
			.where(eq(economyFlags.id, id));
		return { ...row, status };
	}

	async setFrozen(userId: string, frozen: boolean, by?: string) {
		await this.db
			.update(users)
			.set({ zeniFrozen: frozen, updatedAt: new Date() })
			.where(eq(users.id, userId));
		await this.db.insert(actionLogs).values({
			userId,
			moderatorId: by ?? null,
			action: frozen ? "ZENI_FREEZE" : "ZENI_UNFREEZE",
			meta: JSON.stringify({ by, source: "anticheat" }),
		});
	}

	/** Scan batch : top riches + gains récents pour flag rétroactif. */
	async scanTop(limit = 30) {
		const top = await this.db
			.select({
				id: users.id,
				zeni: users.zeni,
				level: users.lastLevelReached,
				frozen: users.zeniFrozen,
			})
			.from(users)
			.orderBy(desc(users.zeni))
			.limit(limit);
		const t = await this.thresholds();
		const raised: Array<{ userId: string; code: string }> = [];
		for (const u of top) {
			const maxReasonable = (Math.max(0, u.level) + 1) * t.levelRatio + 5_000;
			if (u.zeni > maxReasonable * 2 && u.zeni > 100_000) {
				const dets = await this.detect({
					userId: u.id,
					amount: 0,
					balanceAfter: u.zeni,
					source: "other",
					detail: "scan",
				});
				if (dets.length > 0) {
					for (const d of dets) {
						await this.raise(u.id, d);
						raised.push({ userId: u.id, code: d.code });
					}
				} else {
					// detect() peut filtrer via dédup open — forcer un RATIO de scan si besoin.
					const openRecent = await this.db
						.select({ code: economyFlags.code })
						.from(economyFlags)
						.where(
							and(
								eq(economyFlags.userId, u.id),
								eq(economyFlags.status, "open"),
								eq(economyFlags.code, "RATIO")
							)
						)
						.limit(1);
					if (openRecent.length === 0) {
						await this.raise(u.id, {
							code: "RATIO",
							severity: u.zeni > maxReasonable * 5 ? "critical" : "medium",
							reason: `Scan : solde ${u.zeni} vs niveau ${u.level} (plafond ~${maxReasonable})`,
							meta: { balance: u.zeni, level: u.level, maxReasonable, scan: true },
						});
						raised.push({ userId: u.id, code: "RATIO" });
					}
				}
			}
		}
		return { scanned: top.length, raised };
	}
}
