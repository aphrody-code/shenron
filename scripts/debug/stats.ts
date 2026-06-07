import { DatabaseService } from "./apps/bot/src/db/index";
import { container } from "tsyringe";
import "reflect-metadata";
const dbs = container.resolve(DatabaseService);
const db = dbs.db;
console.log("Stats:");
const tables = ["db_characters", "db_planets", "db_movies", "db_news", "db_transformations"];
for (const t of tables) {
	const count = await db.run(sql`SELECT COUNT(*) as c FROM ${t}`);
	console.log(`${t}: ${count[0].c}`);
}
