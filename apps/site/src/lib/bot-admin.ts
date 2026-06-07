/**
 * Client admin pour les 96 routes API privées du bot Shenron.
 * Utilise SHENRON_ADMIN_TOKEN côté server uniquement (jamais exposé client).
 *
 * Les Server Components / Route Handlers consomment directement `botAdmin.fetch(path)`.
 * Pour le browser, passer par le proxy `/api/bot-admin/[...path]` (forwarde + auth).
 */
import "server-only";
import { API_URL as API } from "@/lib/config";

const TOKEN = process.env.SHENRON_ADMIN_TOKEN ?? "";

export class BotAdminError extends Error {
	constructor(
		public status: number,
		public path: string,
		body?: string
	) {
		super(`bot-admin ${path} → ${status}${body ? `: ${body}` : ""}`);
	}
}

export const botAdmin = {
	async fetch<T = unknown>(
		path: string,
		init?: RequestInit & { revalidate?: number; tags?: string[] }
	): Promise<T> {
		const res = await fetch(`${API}${path}`, {
			...init,
			headers: {
				accept: "application/json",
				authorization: `Bearer ${TOKEN}`,
				...(init?.body ? { "content-type": "application/json" } : {}),
				...init?.headers,
			},
			next: {
				revalidate: init?.revalidate ?? 30,
				tags: init?.tags,
			},
		});
		if (!res.ok) {
			throw new BotAdminError(res.status, path, await res.text().catch(() => undefined));
		}
		return res.json() as Promise<T>;
	},

	// Aliases typés pour les endpoints les plus utilisés
	bots: () =>
		botAdmin.fetch<{
			bots: Array<{
				id: string;
				name: string;
				username: string;
				avatar: string;
				online: boolean;
				uptime: number;
				wsPing: number;
				intents: number;
				guildCount: number;
				commandCount: number;
			}>;
		}>("/api/bots", { revalidate: 10 }),
	bot: (id: string) =>
		botAdmin.fetch<{
			id: string;
			name: string;
			username: string;
			avatar: string;
			online: boolean;
			uptime: number;
			wsPing: number;
			guildCount: number;
			commandCount: number;
			commands: unknown[];
		}>(`/api/bots/${id}`, { revalidate: 10 }),
	commands: (botId: string) =>
		botAdmin.fetch<{
			commands: Array<{
				name: string;
				description: string;
				type: number;
				options?: unknown[];
			}>;
		}>(`/api/bots/${botId}/commands`, { revalidate: 60 }),
	expanded: (botId: string) =>
		botAdmin.fetch<unknown>(`/api/bots/${botId}/expanded`, { revalidate: 60 }),
	roles: (botId: string) =>
		botAdmin.fetch<{
			roles: Array<{
				id: string;
				name: string;
				color: number;
				hexColor: string;
				position: number;
				managed: boolean;
			}>;
		}>(`/api/bots/${botId}/guild/roles`, { revalidate: 60 }),

	cron: () =>
		botAdmin.fetch<{
			jobs: Array<{
				name: string;
				intervalMs: number;
				lastRunAt: number | null;
				lastDurationMs: number | null;
				runCount: number;
				lastError: string | null;
				nextRunAt: number | null;
			}>;
		}>("/api/cron", { revalidate: 5 }),
	cronTrigger: (name: string) =>
		botAdmin.fetch(`/api/cron/${encodeURIComponent(name)}/trigger`, {
			method: "POST",
			body: "{}",
		}),

	services: () => botAdmin.fetch<{ services: string[] }>("/api/services", { revalidate: 60 }),
	serviceCall: (service: string, action: string, body?: unknown) =>
		botAdmin.fetch(`/api/services/${service}/${action}`, {
			method: "POST",
			body: JSON.stringify(body ?? {}),
		}),

	tables: () =>
		botAdmin.fetch<{ tables: string[] }>("/api/database/tables", {
			revalidate: 300,
		}),
	table: (table: string, limit = 100, offset = 0) =>
		botAdmin.fetch<{ rows: unknown[]; total: number; columns: string[] }>(
			`/api/database/${encodeURIComponent(table)}?limit=${limit}&offset=${offset}`,
			{ revalidate: 10 }
		),

	health: () =>
		botAdmin.fetch<{ online: boolean; uptime: number; version: string }>("/api/health/check", {
			revalidate: 5,
		}),
	healthUsage: () => botAdmin.fetch<unknown>("/api/health/usage", { revalidate: 10 }),
	healthHost: () => botAdmin.fetch<unknown>("/api/health/host", { revalidate: 30 }),
	healthLogs: (lines = 100) =>
		botAdmin.fetch<{
			logs: Array<{
				time?: string;
				host?: string;
				unit?: string;
				message?: string;
				raw?: string;
			}>;
			count: number;
		}>(`/api/health/logs?lines=${lines}`, { revalidate: 5 }),

	stats: () =>
		botAdmin.fetch<{ users: number; guilds: number; commands: number }>("/api/stats/totals", {
			revalidate: 30,
		}),

	auditLogs: (limit = 50, offset = 0) =>
		botAdmin.fetch<{ logs: unknown[]; total?: number }>(
			`/api/audit/logs?limit=${limit}&offset=${offset}`,
			{ revalidate: 10 }
		),
	auditDiscord: (limit = 50, actionType?: string) =>
		botAdmin.fetch<{ audit_logs?: unknown[]; entries?: unknown[] }>(
			`/api/discord/audit-logs?limit=${limit}${actionType ? `&action_type=${actionType}` : ""}`,
			{ revalidate: 30 }
		),

	economyStats: () =>
		botAdmin.fetch<{
			zeni: {
				total: number;
				avg: number;
				max: number;
				count: number;
				rich: number;
				zero: number;
			};
			fusions: number;
			inventoryItems: number;
			shopItemsActive: number;
		}>("/api/economy/stats", { revalidate: 30 }),
	economyLeaderboard: (limit = 50) =>
		botAdmin.fetch<{ leaderboard: unknown[] }>(`/api/economy/leaderboard?limit=${limit}`, {
			revalidate: 30,
		}),
	economyTransactions: (limit = 50) =>
		botAdmin.fetch<{ transactions: unknown[] }>(`/api/economy/transactions?limit=${limit}`, {
			revalidate: 30,
		}),
	economyGive: (userId: string, amount: number, reason?: string) =>
		botAdmin.fetch("/api/economy/give", {
			method: "POST",
			body: JSON.stringify({ userId, amount, reason }),
		}),

	discord: {
		channels: () =>
			botAdmin.fetch<{
				channels: Array<{ id: string; name: string; type: number }>;
			}>("/api/discord/channels", { revalidate: 300 }),
		roles: () =>
			botAdmin.fetch<{ roles: unknown[] }>("/api/discord/roles", {
				revalidate: 300,
			}),
		members: () =>
			botAdmin.fetch<{ members: unknown[] }>("/api/discord/members", {
				revalidate: 60,
			}),
		guild: () => botAdmin.fetch<unknown>("/api/discord/guild", { revalidate: 60 }),
	},

	canvas: {
		profileUrl: (userId: string, theme?: string) =>
			`${API}/api/canvas/profile/${userId}${theme ? `?theme=${encodeURIComponent(theme)}` : ""}`,
		leaderboardUrl: () => `${API}/api/canvas/leaderboard`,
		scoutUrl: (userId: string) => `${API}/api/canvas/scouter/${userId}`,
		list: () =>
			botAdmin.fetch<{
				canvases: Array<{ name: string; description: string; path: string }>;
			}>("/api/canvas/list", { revalidate: 300 }),
		themes: () =>
			botAdmin.fetch<{
				rows: Array<{
					id: string;
					name: string;
					accent: string;
					aura: string;
					bgGrad1: string;
					bgGrad2: string;
					bgGrad3: string;
					bgFile: string | null;
					textShadow: string;
					enabled: boolean;
				}>;
			}>("/api/card-themes", { revalidate: 30 }),
		themeCreate: (body: {
			id: string;
			name: string;
			accent: string;
			aura: string;
			bgGrad1: string;
			bgGrad2: string;
			bgGrad3: string;
			bgFile?: string | null;
			textShadow: string;
			enabled?: boolean;
		}) =>
			botAdmin.fetch("/api/card-themes", {
				method: "POST",
				body: JSON.stringify(body),
			}),
		themeUpdate: (id: string, patch: Record<string, unknown>) =>
			botAdmin.fetch(`/api/card-themes/${encodeURIComponent(id)}`, {
				method: "PUT",
				body: JSON.stringify(patch),
			}),
		themeRemove: (id: string) =>
			botAdmin.fetch(`/api/card-themes/${encodeURIComponent(id)}`, {
				method: "DELETE",
			}),
	},

	giveaways: () =>
		botAdmin.fetch<{
			giveaways: Array<{
				id: number;
				messageId: string;
				channelId: string;
				hostId: string;
				title: string;
				reward: string;
				description: string | null;
				winners: number;
				endsAt: number;
				ended: boolean;
				winnerIds: string | null;
			}>;
		}>("/api/giveaways", { revalidate: 30 }),
	giveawayEnd: (id: number) =>
		botAdmin.fetch(`/api/giveaways/${id}/end`, { method: "POST", body: "{}" }),

	levels: {
		config: () => botAdmin.fetch<unknown>("/api/levels/config", { revalidate: 60 }),
		distribution: () =>
			botAdmin.fetch<{ distribution: Array<{ level: number; count: number }> }>(
				"/api/levels/distribution",
				{ revalidate: 60 }
			),
		rewards: () =>
			botAdmin.fetch<{
				rewards: Array<{
					level: number;
					roleId: string;
					zeniBonus: number;
					xpThreshold: number;
					bannerUrl: string | null;
				}>;
			}>("/api/levels/rewards", { revalidate: 60 }),
		top: (limit = 50) =>
			botAdmin.fetch<{ top: unknown[] }>(`/api/levels/top?limit=${limit}`, {
				revalidate: 30,
			}),
	},

	messages: () =>
		botAdmin.fetch<{
			events: Array<{
				event: string;
				enabled: boolean;
				channelId: string | null;
				template?: string | null;
				channelKey?: string | null;
				embed?: unknown;
			}>;
		}>("/api/messages", { revalidate: 60 }),
	messagesUpsert: (
		event: string,
		body: {
			template?: string | null;
			channelKey?: string | null;
			enabled?: boolean;
		}
	) =>
		botAdmin.fetch(`/api/messages/${encodeURIComponent(event)}`, {
			method: "POST",
			body: JSON.stringify(body),
		}),
	messagesRemove: (event: string) =>
		botAdmin.fetch(`/api/messages/${encodeURIComponent(event)}`, {
			method: "DELETE",
		}),
	messagesPreview: (event: string, params?: Record<string, unknown>) =>
		botAdmin.fetch<{
			rendered?: string;
			preview?: string;
			[k: string]: unknown;
		}>(`/api/messages/${encodeURIComponent(event)}/preview`, {
			method: "POST",
			body: JSON.stringify(params ?? {}),
		}),

	commandPerms: {
		list: () =>
			botAdmin.fetch<{
				rows: Array<{
					command: string;
					scope: string;
					roleId?: string | null;
					userId?: string | null;
					allow: boolean;
				}>;
			}>("/api/bot/commands/permissions", { revalidate: 60 }),
		upsert: (body: {
			command: string;
			scope: string;
			roleId?: string | null;
			userId?: string | null;
			allow: boolean;
		}) =>
			botAdmin.fetch("/api/bot/commands/permissions", {
				method: "POST",
				body: JSON.stringify(body),
			}),
		remove: (body: {
			command: string;
			scope: string;
			roleId?: string | null;
			userId?: string | null;
		}) =>
			botAdmin.fetch("/api/bot/commands/permissions/delete", {
				method: "POST",
				body: JSON.stringify(body),
			}),
	},

	economyGiveBulk: (body: {
		mode: "user" | "role" | "all";
		userId?: string;
		roleId?: string;
		amount: number;
		reason?: string;
	}) =>
		botAdmin.fetch<{ ok: boolean; applied?: number; amount?: number }>("/api/economy/give", {
			method: "POST",
			body: JSON.stringify(body),
		}),

	levelsTop: (metric: "xp" | "zeni" | "voice" | "streak" | "messages" = "xp", limit = 50) =>
		botAdmin.fetch<{
			top: Array<{
				rank: number;
				discordId: string;
				username?: string;
				avatarUrl?: string;
				value: number;
				level?: number;
			}>;
		}>(`/api/levels/top?metric=${metric}&limit=${limit}`, { revalidate: 30 }),

	moderation: {
		hierarchy: () =>
			botAdmin.fetch<{
				tiers: Array<{ name: string; roleIds: string[]; level: number }>;
			}>("/api/moderation/hierarchy", { revalidate: 60 }),
		recent: () =>
			botAdmin.fetch<{ actions: unknown[] }>("/api/moderation/recent", {
				revalidate: 10,
			}),
		stats: () =>
			botAdmin.fetch<{
				warns: number;
				jails: number;
				bans: number;
				kicks: number;
				mutes: number;
			}>("/api/moderation/stats", { revalidate: 30 }),
		warns: () =>
			botAdmin.fetch<{
				warns: Array<{
					id: number;
					userId: string;
					moderatorId: string;
					reason: string | null;
					active: boolean;
					createdAt: number;
				}>;
			}>("/api/moderation/warns", { revalidate: 10 }),
		jails: () =>
			botAdmin.fetch<{
				jails: Array<{
					id: number;
					userId: string;
					moderatorId: string;
					reason: string | null;
					expiresAt: number | null;
					releasedAt: number | null;
					createdAt: number;
				}>;
			}>("/api/moderation/jails", { revalidate: 10 }),
	},

	settings: () =>
		botAdmin.fetch<{
			keys: Array<{
				key: string;
				type: string;
				default: unknown;
				current: unknown;
				description: string | null;
			}>;
		}>("/api/settings/schema", { revalidate: 60 }),

	tickets: () =>
		botAdmin.fetch<{
			tickets: Array<{
				id: number;
				channelId: string;
				ownerId: string;
				kind: string;
				context: string | null;
				closed: boolean;
				closedAt: number | null;
				createdAt: number;
			}>;
		}>("/api/tickets", { revalidate: 30 }),

	webhooks: () =>
		botAdmin.fetch<{
			webhooks: Array<{
				id: string;
				name: string;
				channelId: string;
				url?: string;
				type: number;
			}>;
		}>("/api/webhooks", { revalidate: 60 }),

	wikiStats: () =>
		botAdmin.fetch<{
			characters: number;
			planets: number;
			transformations: number;
		}>("/api/wiki/stats", { revalidate: 300 }),

	// ─── Mutations (utilisées via Server Actions) ────────────────────────
	shop: {
		list: () =>
			botAdmin.fetch<{
				items: Array<{
					key: string;
					type: "card" | "badge" | "color" | "title" | "banner";
					name: string;
					description: string | null;
					price: number;
					roleId: string | null;
					meta: string | null;
					enabled: boolean;
				}>;
			}>("/api/shop", { revalidate: 30 }),
		create: (
			body: Record<string, unknown>
		): Promise<{ ok: boolean; key?: string; error?: string }> =>
			botAdmin.fetch("/api/shop", {
				method: "POST",
				body: JSON.stringify(body),
			}),
		update: (key: string, patch: Record<string, unknown>) =>
			botAdmin.fetch(`/api/shop/${encodeURIComponent(key)}`, {
				method: "PUT",
				body: JSON.stringify(patch),
			}),
		toggle: (key: string) =>
			botAdmin.fetch<{ ok: boolean; enabled: boolean }>(`/api/shop/${encodeURIComponent(key)}`, {
				method: "PATCH",
				body: "{}",
			}),
		remove: (key: string) =>
			botAdmin.fetch(`/api/shop/${encodeURIComponent(key)}`, {
				method: "DELETE",
			}),
	},

	settingsSet: (key: string, value: unknown) =>
		botAdmin.fetch(`/api/settings/${encodeURIComponent(key)}`, {
			method: "POST",
			body: JSON.stringify({ value }),
		}),
	settingsUnset: (key: string) =>
		botAdmin.fetch(`/api/settings/${encodeURIComponent(key)}`, {
			method: "DELETE",
		}),

	triggers: {
		list: () =>
			botAdmin.fetch<{
				rows: Array<{
					code: string;
					description: string | null;
					pattern: string;
					flags: string | null;
					enabled: boolean;
				}>;
			}>("/api/triggers", { revalidate: 30 }),
		create: (body: {
			code: string;
			description?: string | null;
			pattern: string;
			flags?: string;
			enabled?: boolean;
		}) =>
			botAdmin.fetch("/api/triggers", {
				method: "POST",
				body: JSON.stringify(body),
			}),
		update: (code: string, patch: Record<string, unknown>) =>
			botAdmin.fetch(`/api/triggers/${encodeURIComponent(code)}`, {
				method: "PUT",
				body: JSON.stringify(patch),
			}),
		remove: (code: string) =>
			botAdmin.fetch(`/api/triggers/${encodeURIComponent(code)}`, {
				method: "DELETE",
			}),
	},

	moderationActions: {
		deleteWarn: (id: number) => botAdmin.fetch(`/api/moderation/warns/${id}`, { method: "DELETE" }),
		clearWarns: (userId: string) =>
			botAdmin.fetch(`/api/moderation/warns/clear/${encodeURIComponent(userId)}`, {
				method: "POST",
				body: "{}",
			}),
		unjail: (userId: string) =>
			botAdmin.fetch(`/api/moderation/jails/${encodeURIComponent(userId)}`, {
				method: "DELETE",
			}),
		updateHierarchy: (levels: string[][]) =>
			botAdmin.fetch("/api/moderation/hierarchy", {
				method: "PUT",
				body: JSON.stringify({ levels }),
			}),
	},

	ticketsClose: (channelId: string) =>
		botAdmin.fetch(`/api/tickets/${encodeURIComponent(channelId)}/close`, {
			method: "POST",
			body: "{}",
		}),

	cronSetInterval: (name: string, intervalMs: number) =>
		botAdmin.fetch(`/api/cron/${encodeURIComponent(name)}/interval`, {
			method: "POST",
			body: JSON.stringify({ intervalMs }),
		}),

	webhooksCreate: (body: { channel_id: string; name: string; avatar?: string | null }) =>
		botAdmin.fetch("/api/webhooks/create", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	webhooksDelete: (id: string) =>
		botAdmin.fetch(`/api/webhooks/${encodeURIComponent(id)}`, {
			method: "DELETE",
		}),
	webhooksExecute: (body: {
		url: string;
		content?: string;
		username?: string;
		avatar_url?: string;
		embeds?: unknown[];
	}) =>
		botAdmin.fetch("/api/webhooks/execute", {
			method: "POST",
			body: JSON.stringify(body),
		}),

	levelsRewardUpsert: (body: {
		level: number;
		roleId: string;
		xpThreshold: number;
		zeniBonus?: number;
	}) =>
		botAdmin.fetch("/api/levels/rewards", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	levelsRewardRemove: (level: number) =>
		botAdmin.fetch(`/api/levels/rewards/${level}`, { method: "DELETE" }),
};

export const BOT_API_URL = API;
