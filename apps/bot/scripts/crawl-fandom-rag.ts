/**
 * crawl-fandom-rag.ts — Crawl MASSIF du wiki Dragon Ball (fandom FR) vers le corpus RAG.
 *
 * Récupère TOUS les personnages, techniques, lieux, races, transformations, sagas, films et
 * chapitres de manga (texte intégral des pages via l'API extracts), et les fusionne dans
 * data/rag/corpus.json. `rag-build.ts` les chunke ensuite -> le LLM/RAG connaît tout l'univers.
 *
 * Récursion d'1 niveau dans les sous-catégories pour maximiser la couverture. Rate-limité, idempotent
 * (dédoublonnage par slug). Usage : bun apps/bot/scripts/crawl-fandom-rag.ts [--lang fr] [--max N]
 */
const LANG = (() => {
  const i = process.argv.indexOf("--lang");
  return i !== -1 ? process.argv[i + 1] : "fr";
})();
const MAX = (() => {
  const i = process.argv.indexOf("--max");
  return i !== -1 ? Number(process.argv[i + 1]) : Infinity;
})();
const API = `https://dragonball.fandom.com/${LANG}/api.php`;
const CORPUS = new URL("../data/rag/corpus.json", import.meta.url).pathname;

const CATEGORIES = [
  "Personnages", "Personnages de Dragon Ball", "Personnages de Dragon Ball Z",
  "Personnages de Dragon Ball Super", "Saiyans", "Namekiens", "Techniques", "Transformations",
  "Races", "Planètes", "Lieux", "Sagas", "Films", "Combats", "Objets", "Chapitres",
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const slug = (s: string) =>
  "fd-" +
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

async function apiGet(params: Record<string, string>): Promise<any> {
  const url = new URL(API);
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url.toString(), { headers: { "user-agent": "shenron-rag-crawler/1.0" } });
      if (res.status === 429) {
        await sleep(2000);
        continue;
      }
      if (!res.ok) {
        await sleep(400);
        continue;
      }
      return await res.json();
    } catch {
      await sleep(600);
    }
  }
  return null;
}

/** Membres (pages + sous-catégories) d'une catégorie. */
async function categoryMembers(cat: string): Promise<{ pages: string[]; subcats: string[] }> {
  const pages: string[] = [];
  const subcats: string[] = [];
  let cmcontinue: string | undefined;
  do {
    const data = await apiGet({
      action: "query", list: "categorymembers", cmtitle: `Category:${cat}`,
      cmlimit: "500", cmtype: "page|subcat", ...(cmcontinue ? { cmcontinue } : {}),
    });
    const members = data?.query?.categorymembers ?? [];
    for (const m of members) {
      if (m.ns === 0) pages.push(m.title);
      else if (m.ns === 14) subcats.push(m.title.replace(/^Cat[ée]gorie:/i, "").replace(/^Category:/i, ""));
    }
    cmcontinue = data?.continue?.cmcontinue;
    if (cmcontinue) await sleep(150);
  } while (cmcontinue);
  return { pages, subcats };
}

/** Texte intégral d'une page (extract explaintext). */
async function pageExtract(title: string): Promise<string> {
  const data = await apiGet({
    action: "query", prop: "extracts", explaintext: "1", redirects: "1", titles: title,
  });
  const pagesObj = data?.query?.pages ?? {};
  const first = Object.values(pagesObj)[0] as any;
  return (first?.extract ?? "").trim();
}

async function main(): Promise<void> {
  // 1. Collecte des titres (catégories + 1 niveau de sous-catégories)
  const titles = new Set<string>();
  const seenCats = new Set<string>();
  const queue = [...CATEGORIES];
  let depth1 = 0;
  while (queue.length) {
    const cat = queue.shift()!;
    if (seenCats.has(cat)) continue;
    seenCats.add(cat);
    const { pages, subcats } = await categoryMembers(cat);
    for (const p of pages) titles.add(p);
    console.log(`[CRAWL] Category:${cat} -> ${pages.length} pages (total titres: ${titles.size})`);
    // 1 niveau de récursion sur les sous-catégories non encore vues
    if (depth1 < 40) {
      for (const sc of subcats) {
        if (!seenCats.has(sc) && !queue.includes(sc)) {
          queue.push(sc);
          depth1++;
        }
      }
    }
    await sleep(120);
  }
  console.log(`[CRAWL] ${titles.size} pages uniques à récupérer.`);

  // 2. Charger le corpus existant
  let corpus: { generatedAt: string; count: number; docs: any[] } = { generatedAt: "", count: 0, docs: [] };
  try {
    corpus = JSON.parse(await Bun.file(CORPUS).text());
  } catch {
    /* nouveau */
  }
  const byId = new Map<string, any>(corpus.docs.map((d) => [d.id, d]));

  // 3. Récupérer le texte de chaque page
  let added = 0;
  let n = 0;
  for (const title of titles) {
    if (n++ >= MAX) break;
    const text = await pageExtract(title);
    await sleep(120);
    if (text.length < 200) continue; // ignorer les ébauches vides
    const id = slug(title);
    const url = `https://dragonball.fandom.com/${LANG}/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
    const markdown = `# ${title}\n\n${text}`;
    const existed = byId.has(id);
    byId.set(id, { id, name: title, url, chars: markdown.length, markdown });
    if (!existed) added++;
    if (n % 50 === 0) console.log(`[CRAWL] ${n}/${titles.size} récupérés (${added} nouveaux)`);
  }

  // 4. Réécrire le corpus
  const docs = [...byId.values()];
  await Bun.write(
    CORPUS,
    JSON.stringify({ generatedAt: new Date().toISOString(), count: docs.length, docs }, null, 0),
  );
  console.log(`[CRAWL] TERMINÉ — ${docs.length} docs au total (${added} nouveaux). -> ${CORPUS}`);
  console.log(`[CRAWL] Prochaine étape : bun scripts/rag-build.ts`);
}

main().catch((e) => {
  console.error("[CRAWL] erreur :", e);
  process.exit(1);
});
