import { singleton, inject } from "tsyringe";
import { eq } from "drizzle-orm";
import { DatabaseService } from "~/db/index";
import { guildSettings } from "~/db/schema";

/**
 * Settings runtime — table key/value persistée en SQLite.
 *
 * - Source de vérité dynamique : si une key existe → override l'env / les
 *   constantes hardcodées.
 * - Cache mémoire (TTL 30s) pour éviter de hammerer la DB depuis les events
 *   chauds (MessageXP, VoiceXP).
 *
 * **Mono-guild assumed** — le bot est verrouillé sur `env.GUILD_ID` (cf.
 * `lib/env.ts`). La table `guild_settings` n'a pas de colonne `guild_id` à
 * dessein. Si un jour on veut multi-guild, ajouter `guild_id text NOT NULL`
 * + PK composite et filtrer toutes les queries — voir `Pendu.ts` et
 * `Morpion.ts` Maps qui sont déjà global aussi.
 *
 * Toujours documenter une nouvelle key dans `SETTINGS_KEYS` ci-dessous : ça
 * sert de schéma + autocomplete pour /config.
 */

export interface SettingDef {
	key: string;
	type: "int" | "snowflake" | "string" | "bool";
	description: string;
	default?: number | string | boolean;
	min?: number;
	max?: number;
}

export const SETTINGS_KEYS: SettingDef[] = [
	{ key: "xp.message.min", type: "int", description: "XP min par message", default: 5, min: 0, max: 1000 },
	{ key: "xp.message.max", type: "int", description: "XP max par message", default: 15, min: 0, max: 1000 },
	{ key: "xp.message.cooldown_ms", type: "int", description: "Cooldown XP message (ms)", default: 60_000, min: 0 },
	{ key: "xp.voice.per_minute", type: "int", description: "XP gagnée par minute en vocal", default: 5, min: 0, max: 1000 },
	{ key: "zeni.daily_quest", type: "int", description: "Récompense quête quotidienne (zeni)", default: 50, min: 0 },
	{ key: "channel.announce", type: "snowflake", description: "Salon des annonces (override env)" },
	{ key: "channel.achievement", type: "snowflake", description: "Salon des accomplissements (override env)" },
	{ key: "channel.commands", type: "snowflake", description: "Salon où /commandes sont autorisées (override env)" },
];

@singleton()
export class SettingsService {
	private cache = new Map<string, string>();
	private cacheTs = 0;
	private TTL = 30_000;

	constructor(@inject(DatabaseService) private dbs: DatabaseService) {}

	private async refresh() {
		const rows = await this.dbs.db.select().from(guildSettings);
		this.cache.clear();
		for (const r of rows) this.cache.set(r.key, r.value);
		this.cacheTs = Date.now();
	}

	private async ensureFresh() {
		if (Date.now() - this.cacheTs > this.TTL) await this.refresh();
	}

	async getRaw(key: string): Promise<string | undefined> {
		await this.ensureFresh();
		return this.cache.get(key);
	}

	async getInt(key: string, fallback: number): Promise<number> {
		const v = await this.getRaw(key);
		if (!v) return fallback;
		const n = Number.parseInt(v, 10);
		return Number.isFinite(n) ? n : fallback;
	}

	async getSnowflake(key: string): Promise<string | undefined> {
		const v = await this.getRaw(key);
		return v && /^\d{17,20}$/.test(v) ? v : undefined;
	}

	async set(key: string, value: string): Promise<void> {
		const def = SETTINGS_KEYS.find((s) => s.key === key);
		if (!def) throw new Error(`Setting inconnue : ${key}`);
		// Validation
		if (def.type === "int") {
			const n = Number.parseInt(value, 10);
			if (!Number.isFinite(n)) throw new Error(`${key} attend un entier.`);
			if (def.min !== undefined && n < def.min) throw new Error(`${key} ≥ ${def.min}.`);
			if (def.max !== undefined && n > def.max) throw new Error(`${key} ≤ ${def.max}.`);
		} else if (def.type === "snowflake") {
			if (!/^\d{17,20}$/.test(value)) throw new Error(`${key} attend un snowflake Discord.`);
		} else if (def.type === "bool") {
			if (!/^(true|false|0|1)$/i.test(value)) throw new Error(`${key} attend true/false.`);
		}
		await this.dbs.db
			.insert(guildSettings)
			.values({ key, value, updatedAt: new Date() })
			.onConflictDoUpdate({
				target: guildSettings.key,
				set: { value, updatedAt: new Date() },
			});
		this.cache.set(key, value);
		this.cacheTs = Date.now(); // évite un refresh DB inutile juste après set
	}

	async unset(key: string): Promise<void> {
		await this.dbs.db.delete(guildSettings).where(eq(guildSettings.key, key));
		this.cache.delete(key);
	}

	async list(): Promise<Array<{ key: string; value: string; def?: SettingDef }>> {
		await this.refresh();
		return [...this.cache.entries()].map(([key, value]) => ({
			key,
			value,
			def: SETTINGS_KEYS.find((s) => s.key === key),
		}));
	}
}
