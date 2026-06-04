import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = new URL("../data/rag/", import.meta.url).pathname;
const CORPUS_PATH = join(OUT_DIR, "corpus.json");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type PageSeed = {
  id: string;
  name: string;
  page: string;
  lang: "fr" | "en";
};

const SEEDS: PageSeed[] = [
  // Fandom FR
  { id: "fandom-goku-fr", name: "Son Goku (FR)", page: "Son_Goku", lang: "fr" },
  { id: "fandom-vegeta-fr", name: "Vegeta (FR)", page: "Vegeta", lang: "fr" },
  { id: "fandom-frieza-fr", name: "Freezer (FR)", page: "Freezer", lang: "fr" },
  { id: "fandom-gohan-fr", name: "Son Gohan (FR)", page: "Son_Gohan", lang: "fr" },
  { id: "fandom-piccolo-fr", name: "Piccolo (FR)", page: "Piccolo", lang: "fr" },
  { id: "fandom-buu-fr", name: "Majin Boo (FR)", page: "Majin_Boo", lang: "fr" },
  { id: "fandom-cell-fr", name: "Cell (FR)", page: "Cell", lang: "fr" },
  { id: "fandom-trunks-fr", name: "Trunks (FR)", page: "Trunks", lang: "fr" },
  { id: "fandom-gotenks-fr", name: "Gotenks (FR)", page: "Gotenks", lang: "fr" },
  { id: "fandom-vegito-fr", name: "Vegetto (FR)", page: "Vegetto", lang: "fr" },
  { id: "fandom-gogeta-fr", name: "Gogeta (FR)", page: "Gogeta", lang: "fr" },
  { id: "fandom-beerus-fr", name: "Beerus (FR)", page: "Beerus", lang: "fr" },
  { id: "fandom-whis-fr", name: "Whis (FR)", page: "Whis", lang: "fr" },
  { id: "fandom-broly-fr", name: "Broly (FR)", page: "Broly", lang: "fr" },
  { id: "fandom-bardock-fr", name: "Bardock (FR)", page: "Bardock", lang: "fr" },
  { id: "fandom-jiren-fr", name: "Jiren (FR)", page: "Jiren", lang: "fr" },
  { id: "fandom-krilin-fr", name: "Krilin (FR)", page: "Krilin", lang: "fr" },
  { id: "fandom-c17-fr", name: "C-17 (FR)", page: "C-17", lang: "fr" },
  { id: "fandom-c18-fr", name: "C-18 (FR)", page: "C-18", lang: "fr" },
  { id: "fandom-gokublack-fr", name: "Goku Black (FR)", page: "Goku_Black", lang: "fr" },
  { id: "fandom-zamasu-fr", name: "Zamasu (FR)", page: "Zamasu", lang: "fr" },
  { id: "fandom-ki-fr", name: "Ki (FR)", page: "Ki", lang: "fr" },
  { id: "fandom-dragonballs-fr", name: "Dragon Balls (FR)", page: "Dragon_Ball_(objet)", lang: "fr" },
  { id: "fandom-transformations-fr", name: "Transformations (FR)", page: "Transformations", lang: "fr" },
  { id: "fandom-sagas-fr", name: "Sagas (FR)", page: "Sagas", lang: "fr" },

  // Fandom EN
  { id: "fandom-goku-en", name: "Goku (EN)", page: "Goku", lang: "en" },
  { id: "fandom-vegeta-en", name: "Vegeta (EN)", page: "Vegeta", lang: "en" },
  { id: "fandom-frieza-en", name: "Frieza (EN)", page: "Frieza", lang: "en" },
  { id: "fandom-gohan-en", name: "Gohan (EN)", page: "Son_Gohan", lang: "en" },
  { id: "fandom-piccolo-en", name: "Piccolo (EN)", page: "Piccolo", lang: "en" },
  { id: "fandom-buu-en", name: "Majin Buu (EN)", page: "Majin_Buu", lang: "en" },
  { id: "fandom-cell-en", name: "Cell (EN)", page: "Cell", lang: "en" },
  { id: "fandom-trunks-en", name: "Trunks (EN)", page: "Trunks", lang: "en" },
  { id: "fandom-gotenks-en", name: "Gotenks (EN)", page: "Gotenks", lang: "en" },
  { id: "fandom-vegito-en", name: "Vegito (EN)", page: "Vegito", lang: "en" },
  { id: "fandom-gogeta-en", name: "Gogeta (EN)", page: "Gogeta", lang: "en" },
  { id: "fandom-beerus-en", name: "Beerus (EN)", page: "Beerus", lang: "en" },
  { id: "fandom-whis-en", name: "Whis (EN)", page: "Whis", lang: "en" },
  { id: "fandom-broly-en", name: "Broly (EN)", page: "Broly", lang: "en" },
  { id: "fandom-bardock-en", name: "Bardock (EN)", page: "Bardock", lang: "en" },
  { id: "fandom-jiren-en", name: "Jiren (EN)", page: "Jiren", lang: "en" },
  { id: "fandom-krillin-en", name: "Krillin (EN)", page: "Krillin", lang: "en" },
  { id: "fandom-android17-en", name: "Android 17 (EN)", page: "Android_17", lang: "en" },
  { id: "fandom-android18-en", name: "Android 18 (EN)", page: "Android_18", lang: "en" },
  { id: "fandom-gokublack-en", name: "Goku Black (EN)", page: "Goku_Black", lang: "en" },
  { id: "fandom-zamasu-en", name: "Zamasu (EN)", page: "Zamasu", lang: "en" },
  { id: "fandom-ki-en", name: "Ki (EN)", page: "Ki", lang: "en" },
  { id: "fandom-dragonballs-en", name: "Dragon Balls (EN)", page: "Dragon_Ball_(object)", lang: "en" },
  { id: "fandom-transformations-en", name: "Transformations (EN)", page: "Transformation", lang: "en" },
];

/** Nettoie le HTML de l'API MediaWiki pour en faire un texte structuré lisible pour l'IA */
function cleanMediaWikiHtml(html: string): string {
  let cleaned = html;

  // Enlever les balises style et script
  cleaned = cleaned.replace(/<(script|style|noscript|template|svg|head)\b[^>]*>[\s\S]*?<\/\1>/gi, "");

  // Enlever les infoboxes Fandom complexes (généralement dans des tables ou des balises aside)
  cleaned = cleaned.replace(/<table\b[^>]*class="[^"]*(?:portable-infobox|infobox)[^"]*"[^>]*>[\s\S]*?<\/table>/gi, "");
  cleaned = cleaned.replace(/<aside\b[^>]*class="[^"]*(?:portable-infobox|infobox)[^"]*"[^>]*>[\s\S]*?<\/aside>/gi, "");

  // Enlever les tables de navigation en bas de page
  cleaned = cleaned.replace(/<table\b[^>]*class="[^"]*(?:navbox|ambox)[^"]*"[^>]*>[\s\S]*?<\/table>/gi, "");

  // Remplacer les balises de titre (h1, h2, h3, h4) par des titres Markdown correspondants
  cleaned = cleaned.replace(/<h1\b[^>]*>[\s\S]*?<span class="mw-headline"[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/h1>/gi, "\n# $1\n");
  cleaned = cleaned.replace(/<h2\b[^>]*>[\s\S]*?<span class="mw-headline"[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/h2>/gi, "\n## $1\n");
  cleaned = cleaned.replace(/<h3\b[^>]*>[\s\S]*?<span class="mw-headline"[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/h3>/gi, "\n### $1\n");
  cleaned = cleaned.replace(/<h4\b[^>]*>[\s\S]*?<span class="mw-headline"[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/h4>/gi, "\n#### $1\n");

  // Remplacer h1, h2 simples s'ils n'ont pas la classe mw-headline
  cleaned = cleaned.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (match, level, content) => {
    const headerText = content.replace(/<[^>]+>/g, "").trim();
    return `\n${"#".repeat(parseInt(level))} ${headerText}\n`;
  });

  // Remplacer les paragraphes et retours à la ligne
  cleaned = cleaned.replace(/<p\b[^>]*>/gi, "\n");
  cleaned = cleaned.replace(/<\/p>/gi, "\n");
  cleaned = cleaned.replace(/<br\s*\/?>/gi, "\n");

  // Remplacer les listes ordonnées et non ordonnées
  cleaned = cleaned.replace(/<li\b[^>]*>/gi, "\n- ");
  cleaned = cleaned.replace(/<\/li>/gi, "");

  // Supprimer toutes les autres balises HTML en gardant le texte brut
  cleaned = cleaned.replace(/<[^>]+>/g, "");

  // Remplacer les entités HTML courantes
  cleaned = cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Nettoyer les retours à la ligne et les espaces superflus
  cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, "\n\n");
  cleaned = cleaned.replace(/[ \t]+/g, " ");
  
  return cleaned.trim();
}

async function scrapeFandomPage(seed: PageSeed): Promise<string | null> {
  const apiBase = seed.lang === "fr" 
    ? "https://dragonball.fandom.com/fr/api.php" 
    : "https://dragonball.fandom.com/api.php";
  
  const url = new URL(apiBase);
  url.searchParams.set("action", "parse");
  url.searchParams.set("page", seed.page);
  url.searchParams.set("format", "json");
  url.searchParams.set("redirects", "1");
  url.searchParams.set("origin", "*");

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
      }
    });

    if (!res.ok) {
      console.error(`  [${seed.lang.toUpperCase()}] ${seed.page} : HTTP error ${res.status}`);
      return null;
    }

    const json = await res.json() as any;
    if (json.error) {
      console.error(`  [${seed.lang.toUpperCase()}] ${seed.page} : API error ${json.error.info}`);
      return null;
    }

    const html = json.parse?.text?.["*"];
    if (!html) {
      console.error(`  [${seed.lang.toUpperCase()}] ${seed.page} : Empty content`);
      return null;
    }

    const title = json.parse?.title || seed.page;
    const text = cleanMediaWikiHtml(html);
    
    return `# ${title}\n\nSource: ${seed.lang === "fr" ? `https://dragonball.fandom.com/fr/wiki/${seed.page}` : `https://dragonball.fandom.com/wiki/${seed.page}`}\n\n${text}`;
  } catch (err) {
    console.error(`  [${seed.lang.toUpperCase()}] ${seed.page} : Request failed`, err);
    return null;
  }
}

async function main() {
  console.log("=== MASSIF CRAWL FANDOM API ===");
  console.log(`Cible : ${SEEDS.length} pages de référence.`);
  console.log(`Sortie : ${OUT_DIR}`);

  const corpusDocs: Array<{
    id: string;
    name: string;
    url: string;
    chars: number;
    markdown: string;
  }> = [];

  // Charger le corpus existant si disponible pour conserver les autres sources
  if (existsSync(CORPUS_PATH)) {
    try {
      const existing = JSON.parse(readFileSync(CORPUS_PATH, "utf-8")) as {
        docs: typeof corpusDocs;
      };
      
      // Filtrer pour ne conserver que les sources non Fandom afin de ne pas dupliquer
      const nonFandom = existing.docs.filter(d => !d.id.startsWith("fandom-"));
      corpusDocs.push(...nonFandom);
      console.log(`Corpus existant chargé. ${nonFandom.length} documents conservés (hors fandom).`);
    } catch (err) {
      console.error("Impossible de lire le corpus existant, réinitialisation.", err);
    }
  }

  // Scraper par paquets pour respecter les serveurs
  const concurrency = 4;
  for (let i = 0; i < SEEDS.length; i += concurrency) {
    const chunk = SEEDS.slice(i, i + concurrency);
    const promises = chunk.map(async (seed) => {
      console.log(`→ Scraping [${seed.lang.toUpperCase()}] : ${seed.page}...`);
      const md = await scrapeFandomPage(seed);
      if (md) {
        const outPath = join(OUT_DIR, `${seed.id}.md`);
        writeFileSync(outPath, md);
        console.log(`  ✓ Enregistré : ${seed.id}.md (${md.length} chars)`);
        
        corpusDocs.push({
          id: seed.id,
          name: seed.name,
          url: seed.lang === "fr" ? `https://dragonball.fandom.com/fr/wiki/${seed.page}` : `https://dragonball.fandom.com/wiki/${seed.page}`,
          chars: md.length,
          markdown: md,
        });
      } else {
        console.log(`  ✗ Échec : ${seed.id}`);
      }
    });

    await Promise.all(promises);
    await sleep(500); // Petite pause
  }

  // Écrire le corpus mis à jour
  writeFileSync(
    CORPUS_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: corpusDocs.length,
        docs: corpusDocs,
      },
      null,
      0
    )
  );

  console.log(`\n=== CRAWL TERMINE ===`);
  console.log(`Corpus finalisé : ${corpusDocs.length} documents dans ${CORPUS_PATH}`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
