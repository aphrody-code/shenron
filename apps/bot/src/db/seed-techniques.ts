import "reflect-metadata";
import "./wiki-write-guard";
import { container } from "tsyringe";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { DatabaseService } from "~/db/index";
import { dbTechniques, dbCharacterTechniques, dbCharacters } from "~/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "~/lib/logger";

async function runTechniqueSeed() {
	const dbs = container.resolve(DatabaseService);
	const db = dbs.db;

	logger.info("→ Seeding Techniques from Fandom datasets...");

	const allChars = await db.select().from(dbCharacters);
	let techCount = 0;
	let linkCount = 0;

	const sources = [
		{ path: "../../../../reference/db-recon/datasets/fandom-fr/", lang: "fr" },
		{ path: "../../../../reference/db-recon/datasets/fandom-en/", lang: "en" },
	];

	for (const source of sources) {
		const fandomPath = new URL(source.path, import.meta.url).pathname;
		if (!existsSync(fandomPath)) continue;

		const files = readdirSync(fandomPath);
		for (const file of files) {
			if (!file.endsWith(".json")) continue;
			const content = readFileSync(fandomPath + file, "utf-8");
			const data = JSON.parse(content);
			const html = data.parse?.text?.["*"];
			const sections = data.parse?.sections as
				| { line: string; index: string; level: number; anchor: string }[]
				| undefined;
			if (!html || !sections) continue;

			// Match character
			const fandomName = file.replace(".json", "").toLowerCase().replace(/_/g, " ");
			const charMatch = allChars.find((c) => {
				const normDb = c.name.toLowerCase().replace(/[^a-z0-9]/g, "");
				const normFd = fandomName.replace(/[^a-z0-9]/g, "");
				return normDb === normFd || normFd.includes(normDb) || normDb.includes(normFd);
			});

			if (!charMatch) continue;

			// Find "Techniques" or "Abilities" section
			const techSection = sections.find(
				(s) =>
					s.line.includes("Techniques") ||
					s.line.includes("Capacités") ||
					s.line.includes("Abilities")
			);
			if (!techSection) continue;

			const startTag = techSection.anchor;
			const nextSection = sections.find(
				(s) => parseInt(s.index) > parseInt(techSection.index) && s.level === techSection.level
			);

			let subHtml = "";
			if (nextSection) {
				const startIdx = html.indexOf(`id="${startTag}"`);
				const endIdx = html.indexOf(`id="${nextSection.anchor}"`);
				subHtml = html.substring(startIdx, endIdx);
			} else {
				subHtml = html.substring(html.indexOf(`id="${startTag}"`));
			}

			// Better extraction logic: look for <li><b>...</b> or <h3>...</h3>
			// Fandom often uses <h3> for technique names or <li><b>name</b>: desc
			const items = [];

			// Pattern 1: <li><b>Name</b>: Desc
			const liRegex = /<li><b>(.*?)<\/b>\s*[:-]?\s*(.*?)(?=<\/li>|<li>|$)/gs;
			let match;
			while ((match = liRegex.exec(subHtml)) !== null) {
				items.push({ name: match[1], desc: match[2] });
			}

			// Pattern 2: <h3><span class="mw-headline" id="...">Name</span></h3>
			const h3Regex = /<h3[^>]*>.*?<span[^>]*>(.*?)<\/span>.*?<\/h3>(.*?)(?=<h3|<h2|$)/gs;
			while ((match = h3Regex.exec(subHtml)) !== null) {
				items.push({ name: match[1], desc: match[2] });
			}

			for (const item of items) {
				const rawName = item.name.replace(/<[^>]+>/g, "").trim();
				const rawDesc = item.desc
					.replace(/<[^>]+>/g, " ")
					.replace(/\s+/g, " ")
					.trim();

				if (rawName.length < 2 || rawName.length > 100) continue;
				if (rawDesc.length < 10) continue;

				const slug = rawName
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)/g, "");

				try {
					const [tech] = await db
						.insert(dbTechniques)
						.values({
							slug,
							name: rawName,
							description: rawDesc.substring(0, 1500),
							creatorId: charMatch.id,
						})
						.onConflictDoUpdate({
							target: dbTechniques.slug,
							set: { description: rawDesc.substring(0, 1500) },
						})
						.returning();

					if (tech) {
						techCount++;
						await db
							.insert(dbCharacterTechniques)
							.values({
								characterId: charMatch.id,
								techniqueId: tech.id,
							})
							.onConflictDoNothing();
						linkCount++;
					}
				} catch (e) {
					// Ignore duplicates or errors for individual techniques
				}
			}
		}
	}

	logger.info(
		`✓ ${techCount} techniques indexed and ${linkCount} character-technique links created.`
	);
}

if (import.meta.main) {
	runTechniqueSeed()
		.then(() => {
			const dbs = container.resolve(DatabaseService);
			return dbs.close();
		})
		.catch((err) => {
			console.error(err);
			process.exit(1);
		});
}
