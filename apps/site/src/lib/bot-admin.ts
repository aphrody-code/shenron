/**
 * Client admin pour les 96 routes API privées du bot Shenron.
 * Utilise SHENRON_ADMIN_TOKEN côté server uniquement (jamais exposé client).
 *
 * Les Server Components / Route Handlers consomment directement `botAdmin.fetch(path)`.
 * Pour le browser, passer par le proxy `/api/bot-admin/[...path]` (forwarde + auth).
 */
import "server-only";

const API = process.env.SHENRON_API_URL ?? "https://shenron.rpbey.fr";
const TOKEN = process.env.SHENRON_ADMIN_TOKEN ?? "";

export class BotAdminError extends Error {
	constructor(
		public status: number,
		public path: string,
		body?: string,
	) {
		super(`bot-admin ${path} → ${status}${body ? `: ${body}` : ""}`);
	}
}

export const botAdmin = {
	async fetch<T = unknown>(
		path: string,
		init?: RequestInit & { revalidate?: number; tags?: string[] },
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
			throw new BotAdminError(
				res.status,
				path,
				await res.text().catch(() => undefined),
			);
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

	services: () =>
		botAdmin.fetch<{ services: string[] }>("/api/services", { revalidate: 60 }),
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
			{ revalidate: 10 },
		),

	health: () =>
		botAdmin.fetch<{ online: boolean; uptime: number; version: string }>(
			"/api/health/check",
			{ revalidate: 5 },
		),
	healthUsage: () =>
		botAdmin.fetch<unknown>("/api/health/usage", { revalidate: 10 }),
	healthHost: () =>
		botAdmin.fetch<unknown>("/api/health/host", { revalidate: 30 }),

	stats: () =>
		botAdmin.fetch<{ users: number; guilds: number; commands: number }>(
			"/api/stats/totals",
			{ revalidate: 30 },
		),

	auditLogs: (limit = 50) =>
		botAdmin.fetch<{ logs: unknown[] }>(`/api/audit/logs?limit=${limit}`, {
			revalidate: 10,
		}),

	economyLeaderboard: (limit = 50) =>
		botAdmin.fetch<{ leaderboard: unknown[] }>(
			`/api/economy/leaderboard?limit=${limit}`,
			{ revalidate: 30 },
		),
	economyTransactions: (limit = 50) =>
		botAdmin.fetch<{ transactions: unknown[] }>(
			`/api/economy/transactions?limit=${limit}`,
			{ revalidate: 30 },
		),
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
		guild: () =>
			botAdmin.fetch<unknown>("/api/discord/guild", { revalidate: 60 }),
	},

	canvas: {
		profileUrl: (userId: string) => `${API}/api/canvas/profile/${userId}`,
		leaderboardUrl: () => `${API}/api/canvas/leaderboard`,
		scoutUrl: (userId: string) => `${API}/api/canvas/scouter/${userId}`,
	},
};

export const BOT_API_URL = API;
