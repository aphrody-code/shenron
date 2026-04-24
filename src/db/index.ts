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
    this.sqlite.exec("PRAGMA journal_mode = WAL");
    this.sqlite.exec("PRAGMA synchronous = NORMAL");
    this.sqlite.exec("PRAGMA foreign_keys = ON");
    this.sqlite.exec("PRAGMA busy_timeout = 5000");
    this.db = drizzle(this.sqlite, { schema });
  }

  close() {
    this.sqlite.close();
  }
}
