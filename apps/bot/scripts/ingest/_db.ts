import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "../../src/db/schema";

// Le wiki éditorial est passé sur Neon (source de vérité) : le SQLite local est
// un replica de lecture rafraîchi par sync-neon-to-sqlite.ts. Tout (re)seed/ingest
// écrivant ici serait écrasé au prochain reverse-sync → on refuse sauf override.
if (!Bun.env.ALLOW_SQLITE_WIKI_WRITE) {
	console.error(
		"✗ Wiki migré sur Neon (source de vérité). Ce script écrit le SQLite local,\n" +
			"  écrasé par le reverse-sync Neon→SQLite. Seed/ingest doit cibler Neon.\n" +
			"  Override (risqué, perdu au prochain pull) : ALLOW_SQLITE_WIKI_WRITE=1.",
	);
	process.exit(1);
}

const path = Bun.env.DATABASE_PATH ?? "./data/bot.db";
const sqlite = new Database(path);
sqlite.exec("PRAGMA foreign_keys = ON");
export const db = drizzle(sqlite, { schema });
export { sqlite };
