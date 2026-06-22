/**
 * ingest-fandom-full.ts — Ingestion RICHE de la connaissance Dragon Ball depuis
 * dragonball.fandom.com (FR) vers **Neon** (source de vérité du wiki). Données
 * RÉELLES uniquement (image self-hostée, description, infobox) — **zéro
 * placeholder** (un champ absent reste NULL, jamais "Inconnu").
 *
 * Couvre plusieurs catégories → tables, via l'API MediaWiki (officielle, robuste,
 * paginée). Images téléchargées + WebP dans `assets/wiki/<cat>/`.
 *
 * Env requis : DATABASE_URL (Neon).
 * Usage : env DATABASE_URL=… bun scripts/ingest/ingest-fandom-full.ts --cat characters [--limit N] [--dry-run]
 */
import postgres from "postgres";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const NEON = process.env.DATABASE_URL;
if (!NEON) {
	console.error("✗ DATABASE_URL requis");
	process.exit(1);
}
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const argv = (k: string) => {
	const i = args.indexOf(k);
	return i !== -1 ? args[i + 1] : undefined;
};
const CAT = argv("--cat") ?? "characters";
const LIMIT = argv("--limit") ? Number(argv("--limit")) : Infinity;

const UA = "ShenronBot/1.0 (dragonballfr.com; manga+wiki self-host)";
const API = "https://dragonball.fandom.com/fr/api.php";
const ASSETS = join(import.meta.dir, "..", "..", "assets");
const sql = postgres(NEON, { max: 3, prepare: false });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Cat = {
	category: string;
	table: string;
	dir: string;
	map: (d: ParsedPage) => Record<string, unknown> | null;
};

type ParsedPage = {
	title: string;
	image: string | null; // local path after download
	description: string | null;
	ib: Record<string, string>; // infobox fields (cleaned)
};

/** Nettoie la valeur wikitext d'un champ infobox. */
function clean(v: string): string {
	return v
		.replace(/<br\s*\/?>?/gi, ", ")
		.replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, "$1")
		.replace(/\{\{[^}]*\}\}/g, "")
		.replace(/<[^>]*>?/g, "")
		.replace(/'''?/g, "")
		.replace(/\s+/g, " ")
		.replace(/^[\s,;]+|[\s,;]+$/g, "")
		.trim();
}
const f = (ib: Record<string, string>, ...keys: string[]) => {
	for (const k of keys) {
		const hit = Object.keys(ib).find((x) => x.toLowerCase() === k.toLowerCase());
		if (hit && ib[hit]) return clean(ib[hit]);
	}
	return null;
};
const nn = (v: string | null) => (v && v.length > 0 && v !== "?" ? v : null);

const CATS: Record<string, Cat> = {
	characters: {
		category: "Personnages",
		table: "db_characters",
		dir: "characters",
		map: (d) => {
			if (!d.image) return null; // pas d'image réelle → on n'insère pas (zéro placeholder)
			return {
				name: d.title,
				image: d.image,
				description: nn(d.description),
				race: nn(f(d.ib, "Race")),
				gender: nn(f(d.ib, "Sexe", "Genre")),
				affiliation: nn(f(d.ib, "Statut", "Affiliation")),
				name_ja: nn(f(d.ib, "Nom Original", "Nom Japonais", "Nom original")),
				name_romaji: nn(f(d.ib, "Alias", "Romaji")),
			};
		},
	},
	planets: {
		category: "Planètes",
		table: "db_planets",
		dir: "planets",
		map: (d) => {
			if (!d.image) return null;
			return {
				name: d.title,
				image: d.image,
				description: nn(d.description),
				name_ja: nn(f(d.ib, "Nom Original", "Nom Japonais")),
			};
		},
	},
	locations: {
		category: "Lieux",
		table: "db_locations",
		dir: "locations",
		map: (d) => (d.image ? { name: d.title, image: d.image, description: nn(d.description) } : null),
	},
};

async function fetchTitles(category: string): Promise<string[]> {
	let cmcontinue: string | undefined;
	const titles: string[] = [];
	do {
		const u = new URL(API);
		u.searchParams.set("action", "query");
		u.searchParams.set("list", "categorymembers");
		u.searchParams.set("cmtitle", `Catégorie:${category}`);
		u.searchParams.set("cmlimit", "500");
		u.searchParams.set("cmnamespace", "0");
		u.searchParams.set("format", "json");
		if (cmcontinue) u.searchParams.set("cmcontinue", cmcontinue);
		const r = await fetch(u, { headers: { "User-Agent": UA } });
		if (!r.ok) break;
		const d = (await r.json()) as any;
		for (const m of d.query?.categorymembers ?? []) titles.push(m.title);
		cmcontinue = d.continue?.cmcontinue;
		if (cmcontinue) await sleep(150);
	} while (cmcontinue);
	return titles;
}

/** Batch query (jusqu'à 50 titres) : image + extrait + wikitext (revisions). */
async function fetchBatch(titles: string[]) {
	const u = new URL(API);
	u.searchParams.set("action", "query");
	u.searchParams.set("prop", "pageimages|extracts|revisions");
	u.searchParams.set("piprop", "original");
	u.searchParams.set("exintro", "1");
	u.searchParams.set("explaintext", "1");
	u.searchParams.set("rvprop", "content");
	u.searchParams.set("rvslots", "main");
	u.searchParams.set("titles", titles.join("|"));
	u.searchParams.set("format", "json");
	const r = await fetch(u, { headers: { "User-Agent": UA } });
	if (!r.ok) throw new Error(`batch HTTP ${r.status}`);
	const d = (await r.json()) as any;
	return Object.values(d.query?.pages ?? {}) as any[];
}

function parseInfobox(wikitext: string): Record<string, string> {
	const ib: Record<string, string> = {};
	for (const m of wikitext.matchAll(/\n\s*\|\s*([A-Za-zÀ-ÿ0-9_ ]+?)\s*=\s*([^\n]*)/g)) {
		const k = m[1].trim();
		if (!ib[k]) ib[k] = m[2].trim();
	}
	return ib;
}

async function downloadImage(src: string, dir: string, slug: string): Promise<string | null> {
	const rel = `./assets/wiki/${dir}/${slug}.webp`;
	if (dryRun) return rel;
	try {
		const r = await fetch(src, { headers: { "User-Agent": UA } });
		if (!r.ok) return null;
		const raw = new Uint8Array(await r.arrayBuffer());
		const webp = await sharp(raw)
			.resize(720, 720, { fit: "inside", withoutEnlargement: true })
			.webp({ quality: 82 })
			.toBuffer();
		await mkdir(join(ASSETS, "wiki", dir), { recursive: true });
		await Bun.write(join(ASSETS, "wiki", dir, `${slug}.webp`), webp);
		return rel;
	} catch {
		return null;
	}
}

const slugify = (s: string) =>
	s
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-zA-Z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "")
		.slice(0, 80);

async function main() {
	const cfg = CATS[CAT];
	if (!cfg) {
		console.error(`✗ catégorie inconnue: ${CAT} (dispo: ${Object.keys(CATS).join(", ")})`);
		process.exit(1);
	}
	console.log(`📚 Fandom → Neon [${CAT}] table=${cfg.table}${dryRun ? " (dry-run)" : ""}`);

	const titles = (await fetchTitles(cfg.category)).slice(0, LIMIT === Infinity ? undefined : LIMIT);
	console.log(`   ${titles.length} pages dans Catégorie:${cfg.category}`);

	// Noms déjà présents (pour ne pas dupliquer).
	const existing = new Set(
		(await sql`SELECT name FROM bot.${sql(cfg.table)}`).map((r: any) => r.name)
	);

	let inserted = 0;
	let skipped = 0;
	for (let i = 0; i < titles.length; i += 25) {
		const batch = titles.slice(i, i + 25);
		let pages: any[];
		try {
			pages = await fetchBatch(batch);
		} catch (e) {
			console.warn(`   batch ${i} échec: ${(e as Error).message}`);
			continue;
		}
		for (const p of pages) {
			const title: string = p.title;
			if (existing.has(title)) {
				skipped++;
				continue;
			}
			const imgSrc: string | null = p.original?.source ?? null;
			const wikitext: string = p.revisions?.[0]?.slots?.main?.["*"] ?? p.revisions?.[0]?.["*"] ?? "";
			const local = imgSrc ? await downloadImage(imgSrc, cfg.dir, slugify(title)) : null;
			const parsed: ParsedPage = {
				title,
				image: local,
				description: (p.extract ?? "").trim() || null,
				ib: parseInfobox(wikitext),
			};
			const row = cfg.map(parsed);
			if (!row) {
				skipped++;
				continue;
			}
			if (!dryRun) {
				const cols = Object.keys(row);
				await sql`INSERT INTO bot.${sql(cfg.table)} ${sql(row, ...cols)} ON CONFLICT DO NOTHING`;
			}
			inserted++;
			if (inserted % 25 === 0) console.log(`   …${inserted} insérés`);
		}
		await sleep(120);
	}
	console.log(`✨ ${CAT}: ${inserted} insérés, ${skipped} sautés (existants/sans image).`);
	await sql.end();
}

main().catch((e) => {
	console.error("❌", e);
	process.exit(1);
});
