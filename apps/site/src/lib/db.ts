import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";
import * as schema from "../db/schema";

const globalForDb = globalThis as unknown as {
	pgClient?: SQL;
};

const client =
	globalForDb.pgClient ??
	new SQL(Bun.env.DATABASE_URL!);

if (Bun.env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema, logger: false });
export { schema };
