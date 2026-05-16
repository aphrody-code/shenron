import "reflect-metadata";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { container } from "tsyringe";
import { DatabaseService } from "./index";

const svc = container.resolve(DatabaseService);
migrate(svc.db, { migrationsFolder: "./src/db/migrations" });
console.log("✓ Migrations applied");
svc.close();
