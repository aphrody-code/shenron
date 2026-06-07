/**
 * crawl-fandom-rag.ts — Crawl MASSIF & CONCURRENT du wiki Dragon Ball vers le corpus RAG.
 *
 * Récupère le texte intégral des pages (API extracts) de catégories entières (avec récursion
 * d'1 niveau dans les sous-catégories), en PARALLÈLE (pool de concurrence). Multi-wiki (fr/en).
 * Écrit un shard JSON ({generatedAt,count,docs}) fusionnable dans data/rag/corpus.json.
 *
 * Usage : bun scripts/crawl-fandom-rag.ts --lang fr|en [--cats "A,B"] [--out file.json]
 *         [--concurrency 16] [--max N]
 */
function arg(name: string, def?: string): string | undefined {
	const i = process.argv.indexOf(`--${name}`);
	return i !== -1 ? process.argv[i + 1] : def;
}

const LANG = arg("lang", "fr")!;
const CONCURRENCY = Number(arg("concurrency", "16"));
const MAX = Number(arg("max", String(Infinity)));
const OUT = arg("out", new URL("../data/rag/corpus.json", import.meta.url).pathname)!;
const API =
	LANG === "en"
		? "https://dragonball.fandom.com/api.php"
		: `https://dragonball.fandom.com/${LANG}/api.php`;

const DEFAULT_CATS: Record<string, string[]> = {
	fr: [
		"Personnages",
		"Techniques",
		"Transformations",
		"Races",
		"Planètes",
		"Lieux",
		"Sagas",
		"Films",
		"Combats",
		"Objets",
		"Chapitres",
		"Tomes",
	],
	en: [
		"Characters",
		"Techniques",
		"Transformations",
		"Races",
		"Planets",
		"Locations",
		"Sagas",
		"Movies",
		"Battles",
		"Items",
		"Manga chapters",
		"Volumes",
	],
};
const CATS = (arg("cats") ?? DEFAULT_CATS[LANG] ?? DEFAULT_CATS.fr)
	.split(",")
	.map((c) => c.trim())
	.filter(Boolean);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const slug = (s: string) =>
	`fd-${LANG}-` +
	s
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 60);

async function apiGet(params: Record<string, string>): Promise<any> {
	const url = new URL(API);
	url.searchParams.set("format", "json");
	url.searchParams.set("origin", "*");
	for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	for (let attempt = 0; attempt < 5; attempt++) {
		try {
			const res = await fetch(url.toString(), {
				headers: { "user-agent": "shenron-rag-crawler/2.0" },
			});
			if (res.status === 429) {
				await sleep(1500);
				continue;
			}
			if (!res.ok) {
				await sleep(300);
				continue;
			}
			return await res.json();
		} catch {
			await sleep(400);
		}
	}
	return null;
}

async function categoryMembers(cat: string): Promise<{ pages: string[]; subcats: string[] }> {
	const pages: string[] = [];
	const subcats: string[] = [];
	let cmcontinue: string | undefined;
	do {
		const data = await apiGet({
			action: "query",
			list: "categorymembers",
			cmtitle: `Category:${cat}`,
			cmlimit: "500",
			cmtype: "page|subcat",
			...(cmcontinue ? { cmcontinue } : {}),
		});
		for (const m of data?.query?.categorymembers ?? []) {
			if (m.ns === 0) pages.push(m.title);
			else if (m.ns === 14)
				subcats.push(
					String(m.title)
						.replace(/^Cat[ée]gorie:/i, "")
						.replace(/^Category:/i, "")
				);
		}
		cmcontinue = data?.continue?.cmcontinue;
		if (cmcontinue) await sleep(80);
	} while (cmcontinue);
	return { pages, subcats };
}

/** Strip wikitext -> texte lisible (Fandom n'a pas TextExtracts ; on parse le wikitext brut). */
function stripWikitext(wt: string): string {
	let t = wt;
	for (let i = 0; i < 6; i++) t = t.replace(/\{\{[^{}]*\}\}/g, " "); // templates (nesting léger)
	t = t.replace(/\{\|[\s\S]*?\|\}/g, " "); // tables
	t = t.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, " ").replace(/<ref[^>]*\/>/gi, " ");
	t = t.replace(/\[\[(?:Fichier|File|Image|Cat[ée]gorie|Category):[^\]]*\]\]/gi, " ");
	t = t.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1"); // [[a|b]]->b
	t = t.replace(/\[https?:\/\/\S+\s+([^\]]*)\]/g, "$1").replace(/\[https?:\/\/\S+\]/g, " ");
	t = t.replace(/<[^>]+>/g, " ");
	t = t.replace(/'{2,}/g, "");
	t = t.replace(/^=+\s*(.*?)\s*=+\s*$/gm, "$1.");
	t = t.replace(/^[*#:;]+\s*/gm, "");
	t = t.replace(/[{}|]/g, " ");
	return t
		.replace(/\n{2,}/g, "\n")
		.replace(/[ \t]+/g, " ")
		.trim();
}

const MAX_PAGE_CHARS = 12000;
async function pageExtract(title: string): Promise<string> {
	const data = await apiGet({ action: "parse", page: title, prop: "wikitext", redirects: "1" });
	const wt = data?.parse?.wikitext?.["*"] ?? "";
	if (!wt) return "";
	return stripWikitext(wt).slice(0, MAX_PAGE_CHARS);
}

/** Pool de concurrence. */
async function pool<T>(
	items: T[],
	n: number,
	fn: (item: T, idx: number) => Promise<void>
): Promise<void> {
	let i = 0;
	await Promise.all(
		Array.from({ length: Math.min(n, items.length) }, async () => {
			while (i < items.length) {
				const idx = i++;
				await fn(items[idx], idx);
			}
		})
	);
}

async function main(): Promise<void> {
	// 1. Collecte des titres (catégories + 1 niveau de sous-catégories)
	const titles = new Set<string>();
	const seen = new Set<string>();
	const queue = [...CATS];
	let recursed = 0;
	while (queue.length) {
		const cat = queue.shift()!;
		if (seen.has(cat)) continue;
		seen.add(cat);
		const { pages, subcats } = await categoryMembers(cat);
		for (const p of pages) titles.add(p);
		if (recursed < 60)
			for (const sc of subcats)
				if (!seen.has(sc) && !queue.includes(sc)) {
					queue.push(sc);
					recursed++;
				}
	}
	const list = [...titles].slice(0, MAX === Infinity ? undefined : MAX);
	console.log(`[CRAWL ${LANG}] ${list.length} pages à récupérer (concurrence ${CONCURRENCY})`);

	// 2. Récupération concurrente des extraits
	const docs: any[] = [];
	let done = 0;
	await pool(list, CONCURRENCY, async (title) => {
		const text = await pageExtract(title);
		done++;
		if (done % 100 === 0)
			console.log(`[CRAWL ${LANG}] ${done}/${list.length} (${docs.length} retenus)`);
		if (text.length < 200) return;
		const url = `https://dragonball.fandom.com/${LANG === "en" ? "" : LANG + "/"}wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
		const markdown = `# ${title}\n\n${text}`;
		docs.push({
			id: slug(title),
			name: `${title} (${LANG})`,
			url,
			chars: markdown.length,
			markdown,
		});
	});

	await Bun.write(
		OUT,
		JSON.stringify({ generatedAt: new Date().toISOString(), count: docs.length, docs }, null, 0)
	);
	console.log(`[CRAWL ${LANG}] TERMINÉ — ${docs.length} docs -> ${OUT}`);
}

main().catch((e) => {
	console.error(`[CRAWL ${LANG}] erreur :`, e);
	process.exit(1);
});
