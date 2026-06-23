/**
 * download-voiranime-mp4.ts — CLI Bun : télécharge des épisodes/films Dragon Ball en
 * MP4 depuis VoirAnime via bxc (`voiranime resolve` embed → lien streaming) + ffmpeg
 * (HLS/m3u8 ou mp4 → mp4). But : NOURRIR Gemma en vidéos pour le test multimodal
 * (scripts/test-gemma-multimodal.ts --video <mp4>).
 *
 * Pipeline : dataset/​info VoirAnime → episode.players[].embedUrl → `bxc voiranime
 * resolve <embed>` → URL stream → ffmpeg → data/dbz-videos/<SÉRIE>-<NNN>-<lang>.mp4.
 * Multi-provider : essaie les hôtes dans l'ordre de fiabilité, tombe sur le suivant si KO.
 *
 * Usage : bun apps/bot/scripts/download-voiranime-mp4.ts <SÉRIE> <ep|début-fin> [opts]
 *   SÉRIE : DB | DBZ | DBS | DBGT | DB_DAIMA
 *   --lang vf|vostfr   (défaut vostfr)
 *   --provider <nom>   force un hôte (vidmoly|filemoon|streamsb|dood…)
 *   --profile <p>      bxc : static|fast|http|stealth|max (défaut stealth)
 *   --duration <sec>   tronque le téléchargement (ex. 120 pour un clip de test)
 *   --out <dir>        défaut apps/bot/data/dbz-videos
 *   --timeout <sec>    timeout par resolve (défaut 120)
 * Env : VOIRANIME_JSON (dataset), BXC_BIN (défaut "bxc")
 */
import { $ } from "bun";
import { existsSync, mkdirSync } from "node:fs";
import os from "node:os";

const ROOT = new URL("..", import.meta.url).pathname; // apps/bot/
const BXC = process.env.BXC_BIN ?? "bxc";

const SERIES_SLUG: Record<string, { vostfr: string; vf?: string }> = {
	DB: { vostfr: "dragon-ball", vf: "dragon-ball-vf" },
	DBZ: { vostfr: "dragon-ball-z", vf: "dragon-ball-z-vf" },
	DBGT: { vostfr: "dragon-ball-gt", vf: "dragon-ball-gt-vf" },
	DBS: { vostfr: "dragon-ball-super", vf: "dragon-ball-super-vf" },
	DB_DAIMA: { vostfr: "dragon-ball-daima" },
};
const PROVIDER_PREF = ["vidmoly", "filemoon", "streamsb", "streamwish", "dood", "mytv"];

const argv = process.argv.slice(2);
const opt = (name: string, def = "") => {
	const i = argv.indexOf(`--${name}`);
	return i >= 0 ? (argv[i + 1] ?? def) : def;
};
const positional = argv.filter((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
const series = (positional[0] ?? "").toUpperCase();
const epArg = positional[1] ?? "";
if (!SERIES_SLUG[series] || !epArg) {
	console.error("Usage: bun scripts/download-voiranime-mp4.ts <DB|DBZ|DBS|DBGT|DB_DAIMA> <ep|a-b> [--lang vf|vostfr] [--provider x] [--duration sec]");
	process.exit(1);
}

const lang = (opt("lang", "vostfr") === "vf" ? "vf" : "vostfr") as "vf" | "vostfr";
const slug = lang === "vf" ? SERIES_SLUG[series].vf : SERIES_SLUG[series].vostfr;
if (!slug) {
	console.error(`✗ ${series} n'a pas de version ${lang}`);
	process.exit(1);
}
const profile = opt("profile", "stealth");
const duration = Number(opt("duration", "0"));
const resolveTimeout = Number(opt("timeout", "120"));
const forceProvider = opt("provider");
const OUT = opt("out") || `${ROOT}data/dbz-videos`;
mkdirSync(OUT, { recursive: true });
const DATASET = process.env.VOIRANIME_JSON ?? `${os.homedir()}/bxc/data/voiranime/dragon-ball-full.json`;

interface Player { name?: string; provider?: string; embedUrl: string }
interface VEpisode { number: number | null; label?: string; players?: Player[] }

/** Récupère les épisodes : dataset local sinon `bxc voiranime info`. */
async function getEpisodes(): Promise<VEpisode[]> {
	if (existsSync(DATASET)) {
		const d = JSON.parse(await Bun.file(DATASET).text()) as { series: { slug: string; episodes: VEpisode[] }[] };
		const s = d.series?.find((x) => x.slug === slug);
		if (s?.episodes?.length) return s.episodes;
	}
	console.log(`→ dataset absent/incomplet, fallback bxc voiranime info ${slug}`);
	const out = await $`${BXC} voiranime info ${slug} --profile ${profile}`.text();
	const j = JSON.parse(out) as { episodes?: VEpisode[] };
	return j.episodes ?? [];
}

/** Extrait l'URL de stream de la sortie de `bxc voiranime resolve` (JSON ou texte brut). */
function parseStream(out: string): string | null {
	try {
		const j = JSON.parse(out) as Record<string, unknown>;
		for (const k of ["url", "stream", "streamUrl", "m3u8", "file", "link", "source", "direct"]) {
			if (typeof j[k] === "string" && /^https?:\/\//.test(j[k] as string)) return j[k] as string;
		}
	} catch {}
	const m = out.match(/https?:\/\/\S+\.(?:m3u8|mp4)\b[^\s"']*/i);
	return m ? m[0] : null;
}

const [from, to] = epArg.includes("-")
	? epArg.split("-").map((n) => Number(n))
	: [Number(epArg), Number(epArg)];

const episodes = (await getEpisodes()).filter((e) => e.number != null && e.number >= from && e.number <= to);
if (!episodes.length) {
	console.error(`✗ aucun épisode ${from}-${to} pour ${slug}`);
	process.exit(1);
}
console.log(`▶ ${series} ${lang} : ${episodes.length} épisode(s) à télécharger → ${OUT}`);

let ok = 0;
for (const ep of episodes) {
	const out = `${OUT}/${series}-${String(ep.number).padStart(3, "0")}-${lang}.mp4`;
	if (existsSync(out)) {
		console.log(`= ep ${ep.number} déjà là, skip`);
		ok++;
		continue;
	}
	const players = (ep.players ?? []).filter((p) =>
		forceProvider ? (p.provider ?? p.name ?? "").toLowerCase().includes(forceProvider) : true
	);
	// trie par préférence d'hôte
	players.sort((a, b) => {
		const r = (p: Player) => {
			const i = PROVIDER_PREF.findIndex((x) => (p.provider ?? p.name ?? "").toLowerCase().includes(x));
			return i < 0 ? 99 : i;
		};
		return r(a) - r(b);
	});

	let done = false;
	for (const p of players) {
		try {
			const res =
				await $`timeout ${resolveTimeout} ${BXC} voiranime resolve ${p.embedUrl} --profile ${profile}`.text();
			const stream = parseStream(res);
			if (!stream) {
				console.log(`  · ep ${ep.number} ${p.provider ?? p.name}: pas de stream`);
				continue;
			}
			const ff = [
				"-y",
				"-headers",
				`Referer: ${new URL(p.embedUrl).origin}/\r\nUser-Agent: Mozilla/5.0`,
				"-i",
				stream,
				...(duration > 0 ? ["-t", String(duration)] : []),
				"-c",
				"copy",
				"-bsf:a",
				"aac_adtstoasc",
				out,
			];
			const r = await $`ffmpeg ${ff}`.quiet().nothrow();
			if (r.exitCode !== 0 || !existsSync(out)) {
				console.log(`  · ep ${ep.number} ${p.provider ?? p.name}: ffmpeg KO (exit ${r.exitCode})`);
				continue;
			}
			const sizeMb = Math.round((await Bun.file(out).size) / 1024 / 1024);
			console.log(`✓ ep ${ep.number} via ${p.provider ?? p.name} → ${out} (${sizeMb} Mo)`);
			ok++;
			done = true;
			break;
		} catch (e) {
			console.log(`  · ep ${ep.number} ${p.provider ?? p.name}: ${(e as Error).message?.slice(0, 80)}`);
		}
	}
	if (!done) console.error(`✗ ep ${ep.number}: tous les hôtes ont échoué`);
}
console.log(`\n${ok}/${episodes.length} épisode(s) téléchargé(s). Tester : bun scripts/test-gemma-multimodal.ts --manga 0 --video "${OUT}/${series}-001-${lang}.mp4"`);
