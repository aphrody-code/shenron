import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

const globalForDb = globalThis as unknown as {
	pgClient?: postgres.Sql;
};

const client =
	globalForDb.pgClient ??
	postgres(process.env.DATABASE_URL!, {
		// Neon est derrière un pooler pgbouncer (transaction mode) qui ne supporte
		// pas les prepared statements → impératif sinon erreurs intermittentes.
		prepare: false,
		// Serverless / Fluid Compute : peu de connexions par instance, recyclage rapide.
		max: 1,
		idle_timeout: 20,
		connect_timeout: 10,
	});

// Toujours réutiliser le pool entre invocations (Fluid Compute réutilise les
// instances) — pas seulement en dev, pour éviter les cold connections.
globalForDb.pgClient = client;

export const db = drizzle(client, { schema, logger: false });
export { schema };
