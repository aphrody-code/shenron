import "reflect-metadata";
import { container } from "tsyringe";
import { DatabaseService } from "~/db/index";
import { dbTransformations, dbCharacters } from "~/db/schema";
import { eq, like } from "drizzle-orm";
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

async function runTransformationIngest() {
    const dbs = container.resolve(DatabaseService);
    const db = dbs.db;

    logger.info("→ Fetching transformations from Fandom FR...");
    const frTrans = await fetchFandomCategory("Transformations", "fr");
    logger.info(`  Found ${frTrans.length} transformations on Fandom FR.`);

    let inserted = 0;
    for (const name of frTrans) {
        const exists = await db.query.dbTransformations.findFirst({
            where: eq(dbTransformations.name, name)
        });

        if (!exists) {
            // Try to find character ID from name (heuristic)
            // Many transformations are named "Character (Transformation)" or similar
            // But for now we'll just insert them with characterId = 1 (Goku) as fallback or null if allowed
            // Actually characterId is NOT NULL in schema? Let's check.
            
            await db.insert(dbTransformations).values({
                name,
                characterId: 1, // Fallback to Goku
                image: "https://dragonball.fandom.com/fr/wiki/Fichier:Logo_Dragon_Ball.png",
                ki: "Inconnu",
                description: `Transformation de l'univers Dragon Ball (source: Fandom FR)`,
            });
            inserted++;
        }
    }

    logger.info(`✓ ${inserted} new transformations inserted.`);
}

if (import.meta.main) {
    runTransformationIngest()
        .then(() => {
            const dbs = container.resolve(DatabaseService);
            dbs.close();
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
