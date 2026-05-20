import { drizzle, type BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { singleton } from "tsyringe";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { env } from "~/lib/env";
import * as schema from "./schema";

export type DB = BunSQLiteDatabase<typeof schema>;

@singleton()
export class DatabaseService {
	readonly sqlite: Database;
	readonly db: DB;

	constructor() {
		mkdirSync(dirname(env.DATABASE_PATH), { recursive: true });
		this.sqlite = new Database(env.DATABASE_PATH, { create: true });
		// Concurrence + durabilité raisonnable
		this.sqlite.exec("PRAGMA journal_mode = WAL");
		this.sqlite.exec("PRAGMA synchronous = NORMAL");
		this.sqlite.exec("PRAGMA foreign_keys = ON");
		this.sqlite.exec("PRAGMA busy_timeout = 5000");
		// Performance reads (leaderboard ORDER BY xp, action_logs filtres)
		// - cache_size négatif = KiB (-64000 = 64 MiB, partagé via WAL across readers)
		// - temp_store=MEMORY évite les spills disque sur ORDER BY/GROUP BY
		// - mmap_size=256MiB → page reads zero-copy (cap RAM systemd 1G ⇒ OK)
		this.sqlite.exec("PRAGMA cache_size = -64000");
		this.sqlite.exec("PRAGMA temp_store = MEMORY");
		this.sqlite.exec("PRAGMA mmap_size = 268435456");
		this.db = drizzle(this.sqlite, { schema });
	}

	close() {
		this.sqlite.close();
	}

	runRaw(sql: string) {
		this.sqlite.exec(sql);
	}
}
