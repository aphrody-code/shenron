import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

const globalForDb = globalThis as unknown as {
	pgClient?: postgres.Sql;
};

const client =
	globalForDb.pgClient ??
	postgres(process.env.DATABASE_URL!, {
		// PostgreSQL local du VPS (migration Neon → PG local, 2026-06-23) : plus de
		// pooler pgbouncer → prepared statements activés (perf) et pool plus large
		// pour le rendu SSG parallèle (`next build` interroge la base massivement).
		// Repli Neon : repasser prepare:false / max:1 (le pgbouncer transaction-mode
		// ne supporte pas les prepared statements).
		prepare: true,
		max: 10,
		idle_timeout: 60,
		connect_timeout: 10,
	});

// Toujours réutiliser le pool entre invocations (Fluid Compute réutilise les
// instances) — pas seulement en dev, pour éviter les cold connections.
globalForDb.pgClient = client;

export const db = drizzle(client, { schema, logger: false });
export { schema };
