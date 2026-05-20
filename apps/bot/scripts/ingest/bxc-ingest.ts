/**
 * bxc-ingest — Script d'ingestion utilisant le moteur BXC pour scraper
 * les dernières news et assets officiels Dragon Ball.
 */
import { run_shell_command } from "../../src/lib/shell"; // Hypothetical, let's use Bun.spawn
import { db } from "./_db";
import { dbNews } from "../../src/db/schema";
import { eq } from "drizzle-orm";

const SOURCES = [
	{
		name: "Dragon Ball Official (FR)",
		url: "https://dragonball.news/fr/",
		selector: ".m-articleList_item",
		category: "official",
	},
	{
		name: "Bandai Namco News",
		url: "https://en.bandainamcoent.eu/news",
		selector: ".news-item",
		category: "game",
	}
];

async function scrapeWithBxc(url: string, selector: string) {
	console.log(`🌐 Scraping via BXC: ${url}...`);
	const proc = Bun.spawn(["bxc", "scrape", url, selector, "--profile", "fast", "--max", "10"]);
	const output = await new Response(proc.stdout).text();
	return output.split("\n").filter(l => l.trim().length > 0);
}

async function main() {
	console.log("🚀 Lancement de l'ingestion BXC...");

	for (const source of SOURCES) {
		try {
			const items = await scrapeWithBxc(source.url, source.selector);
			console.log(`✅ ${items.length} items trouvés pour ${source.name}`);
			
			for (const title of items) {
				const exists = await db.select().from(dbNews).where(eq(dbNews.title, title)).limit(1);
				if (exists.length === 0) {
					const slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
					await db.insert(dbNews).values({
						sourceId: source.name.toLowerCase().replace(/\s+/g, "-"),
						sourceUrl: `${source.url}#${slug.substring(0, 50)}`, // Unique URL per news
						title: title.substring(0, 255),
						excerpt: "Scrapé via BXC Engine",
						category: source.category,
						publishedAt: new Date(),
					});
					console.log(`  🆕 News importée : ${title.substring(0, 50)}...`);
				}
			}
		} catch (err) {
			console.error(`❌ Erreur sur ${source.name}:`, err);
		}
	}

	console.log("\n✨ Ingestion BXC terminée.");
}

main();
