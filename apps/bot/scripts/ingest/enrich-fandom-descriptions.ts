/**
 * enrich-fandom-descriptions.ts — Renseigne les `description` NULL des entités
 * wiki (personnages, planètes…) avec l'INTRO réelle de l'article Fandom FR.
 *
 * L'API `prop=extracts` est cassée sur ce wiki → on parse le HTML de la section 0
 * (`action=parse&prop=text&section=0`), on retire infobox/refs/balises et on garde
 * le 1er vrai paragraphe. Données réelles, **zéro placeholder** (si rien d'exploitable,
 * on laisse NULL). Idempotent (ne touche que les descriptions vides).
 *
 * Env requis : DATABASE_URL (Neon).
 * Usage : env DATABASE_URL=… bun scripts/ingest/enrich-fandom-descriptions.ts --table db_characters [--limit N]
 */
import postgres from "postgres";

const NEON = process.env.DATABASE_URL;
if (!NEON) {
	console.error("✗ DATABASE_URL requis");
	process.exit(1);
}
const args = process.argv.slice(2);
const argv = (k: string) => {
	const i = args.indexOf(k);
	return i !== -1 ? args[i + 1] : undefined;
};
const TABLE = argv("--table") ?? "db_characters";
const LIMIT = argv("--limit") ? Number(argv("--limit")) : Infinity;
const CONC = 8;

const API = "https://dragonball.fandom.com/fr/api.php";
const UA = "ShenronBot/1.0 (dragonballfr.com)";
const sql = postgres(NEON, { max: 4, prepare: false });

const ENT: Record<string, string> = { "&amp;": "&", "&quot;": '"', "&#160;": " ", "&nbsp;": " ", "&#39;": "'" };

async function introFor(name: string): Promise<string | null> {
	const u = new URL(API);
	u.searchParams.set("action", "parse");
	u.searchParams.set("page", name);
	u.searchParams.set("prop", "text");
	u.searchParams.set("section", "0");
	u.searchParams.set("format", "json");
	u.searchParams.set("redirects", "1");
	u.searchParams.set("disablelimitreport", "1");
	const r = await fetch(u, { headers: { "User-Agent": UA } });
	if (!r.ok) return null;
	const d = (await r.json()) as any;
	let html: string = d.parse?.text?.["*"] ?? "";
	if (!html) return null;
	html = html
		.replace(/<aside[\s\S]*?<\/aside>/gi, "")
		.replace(/<table[\s\S]*?<\/table>/gi, "")
		.replace(/<figure[\s\S]*?<\/figure>/gi, "");
	const paras = [...html.matchAll(/<p>([\s\S]*?)<\/p>/gi)]
		.map((m) =>
			m[1]
				.replace(/<[^>]+>/g, "")
				.replace(/&#?\w+;/g, (c) => ENT[c] ?? " ")
				.replace(/\[\d+\]/g, "")
				.replace(/\s+/g, " ")
				.trim()
		)
		.filter((p) => p.length > 40);
	if (paras.length === 0) return null;
	// Concatène jusqu'à ~600 chars pour une vraie description.
	let out = "";
	for (const p of paras) {
		if (out.length >= 400) break;
		out += (out ? " " : "") + p;
	}
	return out.slice(0, 800) || null;
}

async function main() {
	console.log(`✍️  Enrichissement descriptions [${TABLE}]`);
	const rows = (await sql`
		SELECT id, name FROM bot.${sql(TABLE)}
		WHERE (description IS NULL OR description = '') ORDER BY id`) as { id: number; name: string }[];
	const todo = LIMIT === Infinity ? rows : rows.slice(0, LIMIT);
	console.log(`   ${todo.length} entités sans description`);

	let done = 0;
	let filled = 0;
	for (let i = 0; i < todo.length; i += CONC) {
		const batch = todo.slice(i, i + CONC);
		await Promise.all(
			batch.map(async (row) => {
				try {
					const intro = await introFor(row.name);
					if (intro) {
						await sql`UPDATE bot.${sql(TABLE)} SET description = ${intro} WHERE id = ${row.id}`;
						filled++;
					}
				} catch {
					/* skip */
				}
				done++;
			})
		);
		if (done % 80 === 0) console.log(`   …${done}/${todo.length} (${filled} remplies)`);
		await new Promise((r) => setTimeout(r, 100));
	}
	console.log(`✨ ${TABLE}: ${filled}/${todo.length} descriptions ajoutées.`);
	await sql.end();
}

main().catch((e) => {
	console.error("❌", e);
	process.exit(1);
});
