import "reflect-metadata";
import "~/db/wiki-write-guard";
import { container } from "tsyringe";
import { DatabaseService } from "~/db/index";
import { dbPlanets } from "~/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "~/lib/logger";

const SLEEP = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchFandomCategory(category: string, lang: string = "fr"): Promise<string[]> {
	const baseUrl = `https://dragonball.fandom.com/${lang}/api.php`;
	let cmcontinue: string | undefined;
	const titles: string[] = [];

	do {
		const url = new URL(baseUrl);
		url.searchParams.set("action", "query");
		url.searchParams.set("list", "categorymembers");
		url.searchParams.set("cmtitle", `Category:${category}`);
		url.searchParams.set("cmlimit", "500");
		url.searchParams.set("format", "json");
		url.searchParams.set("origin", "*");
		if (cmcontinue) url.searchParams.set("cmcontinue", cmcontinue);

		const res = await fetch(url.toString());
		if (!res.ok) break;
		const data = await res.json();

		const members = data.query?.categorymembers || [];
		for (const m of members) {
			if (m.ns === 0) titles.push(m.title);
		}

		cmcontinue = data.continue?.cmcontinue;
		if (cmcontinue) await SLEEP(200);
	} while (cmcontinue);

	return titles;
}

async function runPlanetIngest() {
	const dbs = container.resolve(DatabaseService);
	const db = dbs.db;

	logger.info("→ Fetching planets from Fandom FR...");
	const frPlanets = await fetchFandomCategory("Planètes", "fr");
	logger.info(`  Found ${frPlanets.length} planets on Fandom FR.`);

	let inserted = 0;
	for (const name of frPlanets) {
		const exists = await db.query.dbPlanets.findFirst({
			where: eq(dbPlanets.name, name),
		});

		if (!exists) {
			await db.insert(dbPlanets).values({
				name,
				description: `Planète de l'univers Dragon Ball (source: Fandom FR)`,
				image: "https://dragonball.fandom.com/fr/wiki/Fichier:Logo_Dragon_Ball.png",
				isDestroyed: false,
			});
			inserted++;
		}
	}

	logger.info(`✓ ${inserted} new planets inserted.`);
}

if (import.meta.main) {
	runPlanetIngest()
		.then(() => {
			const dbs = container.resolve(DatabaseService);
			return dbs.close();
		})
		.catch((err) => {
			console.error(err);
			process.exit(1);
		});
}
