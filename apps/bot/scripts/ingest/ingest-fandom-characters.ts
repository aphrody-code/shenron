import "reflect-metadata";
import "~/db/wiki-write-guard";
import { container } from "tsyringe";
import { DatabaseService } from "~/db/index";
import { dbCharacters } from "~/db/schema";
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

async function runFandomIngest() {
    const dbs = container.resolve(DatabaseService);
    const db = dbs.db;

    logger.info("→ Fetching character names from Fandom FR...");
    const frCharacters = await fetchFandomCategory("Personnages", "fr");
    logger.info(`  Found ${frCharacters.length} characters on Fandom FR.`);

    logger.info("→ Fetching character names from Fandom EN...");
    const enCharacters = await fetchFandomCategory("Characters", "en");
    logger.info(`  Found ${enCharacters.length} characters on Fandom EN.`);

    const allNames = Array.from(new Set([...frCharacters, ...enCharacters]));
    logger.info(`  Total unique names: ${allNames.length}`);

    let inserted = 0;
    for (const name of allNames) {
        // Skip if already exists
        const exists = await db.query.dbCharacters.findFirst({
            where: eq(dbCharacters.name, name)
        });

        if (!exists) {
            await db.insert(dbCharacters).values({
                name,
                description: `Personnage de l'univers Dragon Ball (source: Fandom)`,
                image: "https://dragonball.fandom.com/fr/wiki/Fichier:Logo_Dragon_Ball.png", // Placeholder
                race: "Inconnue",
                gender: "Inconnu",
                ki: "Inconnu",
                maxKi: "Inconnu",
                affiliation: "Inconnue",
            });
            inserted++;
        }
    }

    logger.info(`✓ ${inserted} new characters inserted from Fandom.`);
}

if (import.meta.main) {
    runFandomIngest()
        .then(() => {
            const dbs = container.resolve(DatabaseService);
            dbs.close();
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
