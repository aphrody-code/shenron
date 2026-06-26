/**
 * fix-character-images.ts — Récupère les vraies images des personnages dont le
 * fichier est ABSENT (404) en re-mirrorant depuis l'API Fandom (FR puis EN).
 *
 * Contexte : ~17 % des `db_characters.image` pointent vers
 * `assets/wiki/characters/*.webp` jamais écrits sur disque (l'ingest Fandom a
 * posé le chemin sans télécharger le fichier) → vignette cassée. Ce script,
 * pour chaque image manquante, interroge l'API Fandom (`generator=search` +
 * `pageimages`) pour obtenir une miniature, la télécharge sur le disque d'assets
 * du bot et met à jour le chemin en base. Aucun appel LLM (curl/Fandom only).
 *
 * Le placeholder/fallback côté site (WikiImg) couvre ce qui reste introuvable.
 *
 * Usage :
 *   bun apps/bot/scripts/fix-character-images.ts            # dry-run (diagnostic)
 *   bun apps/bot/scripts/fix-character-images.ts --apply    # télécharge + écrit PG
 *   ... [--limit N] [--with-desc] [--all]                   # périmètre
 *
 * Env : DATABASE_URL = PG du site. Assets écrits sous apps/bot/assets/.
 */
import { existsSync, statSync, mkdirSync } from "node:fs";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error("✗ DATABASE_URL requis.");
	process.exit(1);
}
// Le bot sert `/assets/wiki/*` depuis apps/site/public/wiki/* (cf. server.ts:808)
// et les autres `/assets/*` depuis apps/bot/assets/*. On écrit donc les images
// persos (chemins `assets/wiki/characters/*`) dans apps/site/public/wiki/characters/.
const BOT_ASSETS = new URL("../assets/", import.meta.url).pathname; // apps/bot/assets/
const SITE_PUBLIC = new URL("../../site/public/", import.meta.url).pathname; // apps/site/public/
const OUT_DIR = `${SITE_PUBLIC}wiki/characters/`;
const REL_DIR = "assets/wiki/characters"; // chemin DB (sans ./)

const args = new Set(process.argv.slice(2));
const APPLY = args.has("--apply");
const WITH_DESC = args.has("--with-desc");
const ALL = args.has("--all");
const limArg = process.argv.find((a, i) => process.argv[i - 1] === "--limit");
const LIMIT = limArg ? Number(limArg) : Infinity;

const UA = "ShenronWikiBot/1.0 (https://dragonballfr.com; image mirror)";

function diskPathFor(dbImage: string): string {
	const clean = dbImage.replace(/^\.?\/+/, ""); // strip ./ or /
	const sub = clean.replace(/^assets\//, ""); // ex. wiki/characters/X.webp | dbz/characters/Y.webp
	return sub.startsWith("wiki/") ? `${SITE_PUBLIC}${sub}` : `${BOT_ASSETS}${sub}`;
}
function fileOk(p: string): boolean {
	try {
		return existsSync(p) && statSync(p).size > 200;
	} catch {
		return false;
	}
}

/** Normalise pour comparer noms/titres (sans accents, casse, ponctuation). */
function norm(s: string): string {
	return s
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9 ]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}
/** Le titre de page correspond-il assez au nom du perso pour être SÛR ? */
function titleMatches(name: string, title: string): boolean {
	const n = norm(name);
	const t = norm(title);
	if (!n || !t) return false;
	if (n === t || t.includes(n) || n.includes(t)) return true;
	// Recouvrement de tokens fort (≥ 0.6 Jaccard) → tolère « Son Goku » vs « Goku ».
	const ns = new Set(n.split(" "));
	const ts = new Set(t.split(" "));
	let inter = 0;
	for (const w of ns) if (ts.has(w)) inter++;
	const union = new Set([...ns, ...ts]).size;
	return union > 0 && inter / union >= 0.6;
}

interface Thumb {
	url: string;
	title: string;
}
async function apiQuery(url: string): Promise<Record<string, { title?: string; thumbnail?: { source?: string }; missing?: string }> | null> {
	try {
		const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) });
		if (!res.ok) return null;
		const data = (await res.json()) as { query?: { pages?: Record<string, never> } };
		return (data.query?.pages as never) ?? null;
	} catch {
		return null;
	}
}

/**
 * Image Fandom CONFIANTE pour un personnage :
 *  1) page de TITRE EXACT = `name` (haute précision) ;
 *  2) sinon recherche, mais on n'accepte QUE si le titre trouvé matche le nom
 *     (titleMatches) — évite « Acqua → Technique_inondation ».
 */
async function fandomThumb(name: string, lang: "fr" | "en"): Promise<Thumb | null> {
	const api = `https://dragonball.fandom.com/${lang}/api.php`;
	const piprop = "prop=pageimages&piprop=thumbnail&pithumbsize=800";
	// 1) titre exact
	const exact = await apiQuery(
		`${api}?action=query&format=json&redirects=1&titles=${encodeURIComponent(name)}&${piprop}`
	);
	if (exact) {
		for (const k of Object.keys(exact)) {
			const p = exact[k];
			if (p?.missing !== undefined) continue;
			if (p?.thumbnail?.source) return { url: p.thumbnail.source, title: p.title ?? name };
		}
	}
	// 2) recherche gardée
	const found = await apiQuery(
		`${api}?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(
			name
		)}&gsrlimit=3&gsrnamespace=0&${piprop}`
	);
	if (found) {
		for (const k of Object.keys(found)) {
			const p = found[k];
			if (p?.thumbnail?.source && p.title && titleMatches(name, p.title)) {
				return { url: p.thumbnail.source, title: p.title };
			}
		}
	}
	return null;
}

function extOf(u: string): string {
	const m = u.split("?")[0].match(/\.(png|jpe?g|webp|gif)$/i);
	return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "png";
}

async function download(url: string, dest: string): Promise<boolean> {
	try {
		const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
		if (!res.ok) return false;
		const buf = new Uint8Array(await res.arrayBuffer());
		if (buf.byteLength < 200) return false;
		await Bun.write(dest, buf);
		return true;
	} catch {
		return false;
	}
}

async function main() {
	if (APPLY) mkdirSync(OUT_DIR, { recursive: true });
	const pg = postgres(DATABASE_URL!, { max: 1, prepare: false });
	const where = WITH_DESC ? `WHERE length(coalesce(description,''))>0` : "";
	const rows = (await pg.unsafe(
		`SELECT id, name, image FROM bot.db_characters ${where} ORDER BY (length(coalesce(description,''))>0) DESC, id`
	)) as unknown as { id: number; name: string; image: string | null }[];

	let missing = 0,
		fixed = 0,
		nofound = 0,
		processed = 0;
	for (const c of rows) {
		if (!c.image) {
			missing++;
			continue;
		}
		const disk = diskPathFor(c.image);
		if (!ALL && fileOk(disk)) continue; // fichier déjà présent → OK
		missing++;
		if (processed >= LIMIT) continue;
		processed++;

		// 1) FR puis EN (matching conservateur : titre exact, sinon recherche gardée).
		let thumb = await fandomThumb(c.name, "fr");
		if (!thumb) thumb = await fandomThumb(c.name, "en");
		if (!thumb) {
			nofound++;
			if (!APPLY) console.log(`✗ ${c.id} ${c.name} — aucune image Fandom sûre`);
			continue;
		}
		const ext = extOf(thumb.url);
		const rel = `${REL_DIR}/c${c.id}.${ext}`;
		const dest = `${OUT_DIR}c${c.id}.${ext}`;

		if (!APPLY) {
			console.log(`→ ${c.id} ${c.name}  ⟵ « ${thumb.title} »  ${thumb.url.slice(0, 70)}`);
			continue;
		}
		const ok = await download(thumb.url, dest);
		if (!ok) {
			nofound++;
			console.log(`✗ ${c.id} ${c.name} — download échoué`);
			continue;
		}
		await pg`UPDATE bot.db_characters SET image = ${rel} WHERE id = ${c.id}`;
		fixed++;
		if (fixed % 25 === 0) console.log(`… ${fixed} images réparées`);
		await Bun.sleep(120); // politesse API Fandom
	}

	await pg.end();
	console.log(
		`\n${APPLY ? "APPLY" : "DRY-RUN"} · candidats(manquants)=${missing} · traités=${processed} · réparés=${fixed} · introuvables=${nofound}`
	);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
