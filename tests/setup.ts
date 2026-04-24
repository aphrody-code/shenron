/**
 * Test setup — isolate DB et env.
 * Importer ce module **en premier**, avant toute classe du bot.
 */
import { unlinkSync, existsSync } from "node:fs";

process.env.NODE_ENV = "test";
process.env.DISCORD_TOKEN ??= "test-token";
process.env.GUILD_ID ??= "1497167233280118896";
process.env.OWNER_ID ??= "11111111111111111";
process.env.DATABASE_PATH = "./data/test.db";
process.env.LOG_LEVEL = "error"; // silence pino pendant les tests

const dbPath = "./data/test.db";
for (const ext of ["", "-journal", "-wal", "-shm"]) {
	const p = `${dbPath}${ext}`;
	if (existsSync(p)) unlinkSync(p);
}

// Applique les migrations sur la DB fraîche
const { drizzle } = await import("drizzle-orm/bun-sqlite");
const { migrate } = await import("drizzle-orm/bun-sqlite/migrator");
const { Database } = await import("bun:sqlite");
const sqlite = new Database(dbPath);
sqlite.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: "./src/db/migrations" });
sqlite.close();
