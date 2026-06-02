/**
 * bxc-ingest — Script d'ingestion utilisant le moteur bxc pour scraper
 * les dernières news Dragon Ball et les insérer dans `db_news` (table runtime,
 * forward-syncée vers Neon ; PAS du wiki éditorial → pas de wiki-write-guard).
 *
 * bxc scrape <url> <selector> --json renvoie un array JSON `[{ index, text }]`
 * (textContent des éléments matchés). On dé-doublonne par titre et on insère.
 *
 * Env / flags :
 *   BXC_DIR      racine bxc (défaut /home/ubuntu/bxc) — pour le fallback `bun run`.
 *   BXC_PROFILE  profil bxc (défaut "fast" ; valides: static|fast|http|stealth|max).
 *   --dry-run    n'écrit rien en DB, log seulement ce qui serait inséré.
 *
 * Usage : bun apps/bot/scripts/ingest/bxc-ingest.ts [--dry-run]
 */
// db_news est une table RUNTIME (forward-syncée SQLite→Neon), PAS du wiki
// éditorial → on n'importe PAS ./_db (qui charge wiki-write-guard et exit(1)).
// Connexion SQLite locale dédiée, sans la garde wiki.
import os from "node:os";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { dbNews } from "../../src/db/schema";
import { eq } from "drizzle-orm";

const sqlite = new Database(Bun.env.DATABASE_PATH ?? "./data/bot.db");
sqlite.exec("PRAGMA foreign_keys = ON");
const db = drizzle(sqlite, { schema: { dbNews } });

const BXC_DIR = process.env.BXC_DIR ?? `${os.homedir()}/bxc`;
const BXC_PROFILE = process.env.BXC_PROFILE ?? "fast";
const DRY_RUN = process.argv.includes("--dry-run");

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
  },
];

type BxcScrapeItem = { index: number; text: string };

/** Lance `bxc scrape <url> <selector> --json` et renvoie les textContent non vides. */
async function scrapeWithBxc(url: string, selector: string): Promise<string[]> {
  console.log(`Scraping via bxc (${BXC_PROFILE}): ${url}`);
  // `bxc` doit être sur le PATH ; à défaut, fallback sur `bun run` dans BXC_DIR.
  const onPath = Bun.which("bxc") != null;
  const cmd = onPath
    ? ["bxc", "scrape", url, selector, "--profile", BXC_PROFILE, "--max", "10", "--json"]
    : [
        "bun",
        "run",
        "bxc",
        "scrape",
        url,
        selector,
        "--profile",
        BXC_PROFILE,
        "--max",
        "10",
        "--json",
      ];
  const proc = Bun.spawn(cmd, {
    cwd: onPath ? undefined : BXC_DIR,
    stdout: "pipe",
    stderr: "ignore",
  });
  const out = await new Response(proc.stdout).text();
  const code = await proc.exited;
  if (code !== 0) {
    console.error(`  bxc a quitté avec le code ${code}`);
    return [];
  }
  let items: BxcScrapeItem[];
  try {
    items = JSON.parse(out) as BxcScrapeItem[];
  } catch {
    console.error("  Sortie bxc non-JSON (parse échoué)");
    return [];
  }
  return items.map((it) => it.text?.replace(/\s+/g, " ").trim() ?? "").filter((t) => t.length > 0);
}

async function main() {
  console.log(`Lancement de l'ingestion bxc${DRY_RUN ? " (dry-run)" : ""}.`);

  for (const source of SOURCES) {
    try {
      const items = await scrapeWithBxc(source.url, source.selector);
      console.log(`${items.length} items trouvés pour ${source.name}`);

      for (const title of items) {
        const slug = title
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "");
        const sourceUrl = `${source.url}#${slug.substring(0, 50)}`;
        const sourceId = source.name.toLowerCase().replace(/\s+/g, "-");

        if (DRY_RUN) {
          console.log(`  [dry] ${source.category} — ${title.substring(0, 60)}`);
          continue;
        }

        const exists = await db
          .select()
          .from(dbNews)
          .where(eq(dbNews.sourceUrl, sourceUrl))
          .limit(1);
        if (exists.length > 0) continue;

        await db.insert(dbNews).values({
          sourceId,
          sourceUrl,
          title: title.substring(0, 255),
          excerpt: "Scrapé via bxc",
          category: source.category,
          publishedAt: new Date(),
        });
        console.log(`  News importée : ${title.substring(0, 50)}`);
      }
    } catch (err) {
      console.error(`Erreur sur ${source.name}:`, err);
    }
  }

  console.log("Ingestion bxc terminée.");
}

main();
