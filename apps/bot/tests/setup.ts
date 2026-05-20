/**
 * Test setup — isolate DB et env.
 * Importer ce module **en premier**, avant toute classe du bot.
 */
import "reflect-metadata";
import { mkdirSync, unlinkSync, existsSync } from "node:fs";

Bun.env.NODE_ENV = "test";
Bun.env.DISCORD_TOKEN ??= "test-token";
Bun.env.DISCORD_TOKEN_BEERUS ??= "test-token";
Bun.env.DISCORD_TOKEN_WHIS ??= "test-token";
Bun.env.DISCORD_TOKEN_GRAND_PRETRE ??= "test-token";
Bun.env.DISCORD_TOKEN_ENMA ??= "test-token";
Bun.env.DISCORD_TOKEN_KAIO ??= "test-token";
Bun.env.GUILD_ID ??= "1497167233280118896";
Bun.env.OWNER_ID ??= "11111111111111111";
Bun.env.DATABASE_PATH = "./data/test.db";
Bun.env.LOG_LEVEL = "error"; // silence pino pendant les tests

// Créé ./data/ si absent (CI fresh clone)
mkdirSync("./data", { recursive: true });

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
import { join } from "node:path";
const migrationsFolder = join(import.meta.dir, "../src/db/migrations");
console.log("Migrations folder:", migrationsFolder);
migrate(db, { migrationsFolder });
// Fix schema drift: add columns omitted from migrations but expected by code
try {
	sqlite.exec("ALTER TABLE users ADD COLUMN equipped_banner TEXT;");
	sqlite.exec("ALTER TABLE level_rewards ADD COLUMN banner_url TEXT;");
} catch (e) {
	// ignore if already exists
}
const schemaInfo = sqlite.prepare("PRAGMA table_info(users)").all();
console.log("Users table schema:", JSON.stringify(schemaInfo, null, 2));
sqlite.close();
