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
// Rôle de cachot : le re-cachot au rejoin est conditionné à cette variable.
// Sans elle, `JoinLeave.onJoin` ne réapplique rien — c'est d'ailleurs ce qui se
// passait EN PRODUCTION, où elle n'était pas définie (évasion silencieuse).
Bun.env.JAIL_ROLE_ID ??= "1405635615827034194";
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
// Fix schema drift: objets absents des migrations mais attendus par le code
// (posés à la main en prod). Chaque statement est isolé : un « already exists »
// ne doit pas faire sauter les suivants.
const drift = [
	"ALTER TABLE users ADD COLUMN equipped_banner TEXT;",
	"ALTER TABLE level_rewards ADD COLUMN banner_url TEXT;",
	"ALTER TABLE users ADD COLUMN zeni_frozen INTEGER NOT NULL DEFAULT 0;",
	`CREATE TABLE IF NOT EXISTS economy_flags (
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
	);`,
];
for (const stmt of drift) {
	try {
		sqlite.exec(stmt);
	} catch {
		// déjà présent
	}
}
const schemaInfo = sqlite.prepare("PRAGMA table_info(users)").all();
console.log("Users table schema:", JSON.stringify(schemaInfo, null, 2));
sqlite.close();
