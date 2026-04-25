import { singleton, inject } from "tsyringe";
import { sql } from "drizzle-orm";
import { Client } from "@rpbey/discordx";
import { DatabaseService } from "~/db/index";
import { users } from "~/db/schema";
import { logger } from "~/lib/logger";

/**
 * Stats agrégées exposées par l'API REST (`/health/*`, `/stats/*`).
 *
 * Surface compatible avec [`@rpbey/tscord`'s `Stats` service](../../packages/tscord/src/services/Stats.ts)
 * pour qu'un dashboard tscord-shaped (ex. `barthofu/tscord-dashboard`) puisse
 * consommer l'API shenron sans adapter le client.
 *
 * Implémentation minimale, sans `pidusage` ou `node-os-utils` (deps system Linux
 * lourdes) : on lit directement `/proc/self/stat` pour le CPU/RAM du process et
 * `os` Node-compat pour le host. Suffisant pour un dashboard générique.
 */

export interface PidUsage {
	cpu: number;          // % CPU
	memory: number;       // bytes
	uptime: number;       // ms
	rss: number;          // bytes
}

export interface HostUsage {
	cpu: { count: number; usage: number };  // count of cores, % overall
	memory: { total: number; free: number; used: number; usage: number };
	platform: string;
	uptime: number;       // s
}

export interface LatencyStats {
	ws: number;           // ms
	db: number;           // ms
}

export interface TotalStats {
	totalUsers: number;
	totalGuilds: number;
	totalActiveUsers: number;  // users avec messageCount > 0
	totalCommands: number;     // commands enregistrées sur le client
}

@singleton()
export class StatsService {
	constructor(
		@inject(DatabaseService) private dbs: DatabaseService,
		@inject(Client) private client: Client,
	) {}

	getLatency(): LatencyStats {
		const ws = Math.max(0, this.client.ws.ping);
		// Latence DB : ping query simple
		const t0 = performance.now();
		try {
			this.dbs.sqlite.query("SELECT 1").get();
		} catch (err) {
			logger.debug({ err }, "DB latency probe failed");
		}
		const db = performance.now() - t0;
		return { ws, db: Math.round(db * 100) / 100 };
	}

	async getPidUsage(): Promise<PidUsage> {
		const memUsage = process.memoryUsage();
		const cpu = process.cpuUsage();
		const totalCpu = (cpu.user + cpu.system) / 1000; // ms
		const upMs = Math.round(process.uptime() * 1000);
		// CPU % approximé : (cpu time used / wall time) * 100. Rough mais sans deps.
		const cpuPct = upMs > 0 ? Math.min(100, (totalCpu / upMs) * 100) : 0;
		return {
			cpu: Math.round(cpuPct * 100) / 100,
			memory: memUsage.heapUsed,
			rss: memUsage.rss,
			uptime: upMs,
		};
	}

	async getHostUsage(): Promise<HostUsage> {
		const os = await import("node:os");
		const cpus = os.cpus();
		const totalMem = os.totalmem();
		const freeMem = os.freemem();
		// CPU usage moyenne sur tous les cores depuis boot (cumulative).
		// Pas un % instantané, mais représentatif de la charge système.
		let total = 0;
		let idle = 0;
		for (const c of cpus) {
			for (const t of Object.values(c.times)) total += t;
			idle += c.times.idle;
		}
		const usage = total > 0 ? ((total - idle) / total) * 100 : 0;
		return {
			cpu: { count: cpus.length, usage: Math.round(usage * 100) / 100 },
			memory: {
				total: totalMem,
				free: freeMem,
				used: totalMem - freeMem,
				usage: Math.round(((totalMem - freeMem) / totalMem) * 10_000) / 100,
			},
			platform: os.platform(),
			uptime: Math.round(os.uptime()),
		};
	}

	async getTotalStats(): Promise<TotalStats> {
		const [{ count: total } = { count: 0 }] = await this.dbs.db
			.select({ count: sql<number>`COUNT(*)` })
			.from(users);
		const [{ count: active } = { count: 0 }] = await this.dbs.db
			.select({ count: sql<number>`COUNT(*)` })
			.from(users)
			.where(sql`${users.messageCount} > 0`);

		const totalCommands = this.client.applicationCommands?.length ?? 0;

		return {
			totalUsers: Number(total ?? 0),
			totalGuilds: this.client.guilds.cache.size,
			totalActiveUsers: Number(active ?? 0),
			totalCommands,
		};
	}

	getLastInteraction(): { date: string | null } {
		// Pas de table dédiée — pour un MVP on retourne null, le dashboard fallback
		return { date: null };
	}

	getLastGuildAdded(): { id: string; name: string; joinedAt: string } | null {
		const guilds = [...this.client.guilds.cache.values()].sort(
			(a, b) => (b.joinedTimestamp ?? 0) - (a.joinedTimestamp ?? 0),
		);
		const last = guilds[0];
		if (!last) return null;
		return {
			id: last.id,
			name: last.name,
			joinedAt: new Date(last.joinedTimestamp ?? 0).toISOString(),
		};
	}
}
