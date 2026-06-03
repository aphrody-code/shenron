#!/usr/bin/env bun
/**
 * scrape-dbz-fandom-frames.ts — Capture les FRAMES/screencaps HQ d'épisodes DBZ
 * depuis dragonball.fandom.com (API MediaWiki) → dataset JSON + (option) download
 * local en webp/jpg sous apps/bot/assets/.
 *
 * Réplique EXACTEMENT la méthode rpbey `scrape-fandom-frames.ts` (zéro ffmpeg,
 * zéro vidéo) : on parcourt la catégorie des pages d'épisode, on lit chaque
 * infobox pour récupérer le numéro d'épisode (`|Series=` + `|Number=`), puis
 * `generator=images` + `imageinfo` pour lister les fichiers liés, on filtre les
 * screencaps HQ (jpeg/png, largeur ≥ 700, ratio ~4:3/16:9, hors logos/titlecards)
 * et on émet une frame par capture. C'est l'ALTERNATIVE au pipeline ffmpeg quand
 * on n'a pas le master vidéo : on s'appuie sur les captures déjà sur le wiki.
 *
 *   Différences vs Beyblade : le wiki Dragon Ball nomme les épisodes par TITRE
 *   (pas « Série - Episode NN ») → le numéro vient du wikitext de l'infobox, et le
 *   filtre `|Series=` distingue DB/DBZ/DBGT/DBS au sein d'une même catégorie.
 *
 * Sortie NON-DESTRUCTIVE (writeDatasetIfNonEmpty), un dataset PAR ÉPISODE
 * (`apps/bot/data/dbz-frames/<series>-ep<NNN>.json`, contrat frames-common.ts).
 * Par défaut on n'écrit QUE le JSON (URLs distantes). Avec `--download`, on
 * rapatrie chaque capture en webp dans assets/ext/db_episodes_frames/.
 * AUCUNE écriture DB (ingestion Neon séparée, gardée).
 *
 * Bun-only : `fetch`, `Bun.write`, `Bun.spawn(["ffmpeg",...])` pour le webp. Pas de node.
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *   bun apps/bot/scripts/scrape-dbz-fandom-frames.ts --series DBZ \
 *       [--max-eps N] [--from N] [--to N] [--min-width 700] [--download] [--quality 82]
 *
 *   --series    DB|DBZ|DBGT|DBS|DB_DAIMA  (défaut DBZ). Filtre l'infobox |Series=.
 *   --from/--to borne le numéro d'épisode (inclus).
 *   --max-eps   limite le nombre d'épisodes traités.
 *   --min-width largeur mini d'une capture retenue (défaut 700).
 *   --download  rapatrie les captures en webp local (sinon JSON d'URLs seulement).
 *   --quality   qualité webp si --download (défaut 82).
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import {
  type EpisodeFrame,
  type FramesDataset,
  type Series,
  pad,
  resolveEpisode,
  writeDatasetIfNonEmpty,
} from "./lib/frames-common.js";

const API = "https://dragonball.fandom.com/api.php";
const ROOT = new URL("../", import.meta.url).pathname; // apps/bot/
const ASSETS_DIR = join(ROOT, "assets", "ext", "db_episodes_frames");
const DATA_DIR = join(ROOT, "data", "dbz-frames");
const THUMB_W = 360;
const THROTTLE_MS = 350;
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Série DB → catégorie MediaWiki des pages d'épisode + valeur attendue de |Series=. */
const SERIES_CFG: Record<string, { category: string; infoboxSeries: string[]; label: string }> = {
  DB: {
    category: "Category:Dragon Ball episodes",
    infoboxSeries: ["DB"],
    label: "Dragon Ball",
  },
  DBZ: {
    category: "Category:Dragon Ball Z episodes",
    infoboxSeries: ["DBZ"],
    label: "Dragon Ball Z",
  },
  DBGT: {
    category: "Category:Dragon Ball GT episodes",
    infoboxSeries: ["DBGT", "GT"],
    label: "Dragon Ball GT",
  },
  DBS: {
    category: "Category:Dragon Ball Super episodes",
    infoboxSeries: ["DBS", "Super"],
    label: "Dragon Ball Super",
  },
  DB_DAIMA: {
    category: "Category:Dragon Ball Daima episodes",
    infoboxSeries: ["DB_DAIMA", "Daima", "DAIMA"],
    label: "Dragon Ball Daima",
  },
};

interface Args {
  series: Series;
  maxEps: number;
  from: number;
  to: number;
  minWidth: number;
  download: boolean;
  quality: number;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const val = (flag: string) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const num = (flag: string, def: number) => {
    const v = val(flag);
    return v !== undefined && v !== "" ? Number(v) : def;
  };
  const series = (val("--series") ?? "DBZ").toUpperCase() as Series;
  if (!SERIES_CFG[series]) {
    throw new Error(
      `--series invalide « ${series} ». Valeurs: ${Object.keys(SERIES_CFG).join(", ")}`,
    );
  }
  return {
    series,
    maxEps: num("--max-eps", Infinity),
    from: num("--from", 1),
    to: num("--to", Infinity),
    minWidth: num("--min-width", 700),
    download: argv.includes("--download"),
    quality: num("--quality", 82),
  };
}

async function apiJson(params: Record<string, string>): Promise<any> {
  const qs = new URLSearchParams({ format: "json", ...params }).toString();
  const res = await fetch(`${API}?${qs}`, {
    headers: { "user-agent": UA, accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`API MediaWiki HTTP ${res.status} (${qs.slice(0, 70)})`);
  return res.json();
}

/** Titres des pages d'une catégorie (pagination cmcontinue). */
async function categoryPages(cat: string): Promise<string[]> {
  const titles: string[] = [];
  let cont: string | undefined;
  do {
    const j = await apiJson({
      action: "query",
      list: "categorymembers",
      cmtitle: cat,
      cmtype: "page",
      cmlimit: "500",
      ...(cont ? { cmcontinue: cont } : {}),
    });
    for (const m of j.query?.categorymembers ?? []) {
      // Écarte les pages-listes ("List of …") qui ne sont pas des épisodes.
      if (!/^List of /i.test(m.title)) titles.push(m.title);
    }
    cont = j.continue?.cmcontinue;
    await sleep(THROTTLE_MS);
  } while (cont);
  return titles;
}

/** Lit le numéro + la série d'un épisode depuis l'infobox (section 0), batché. */
async function episodeMeta(
  titles: string[],
): Promise<Map<string, { number: number; series: string }>> {
  const out = new Map<string, { number: number; series: string }>();
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    const j = await apiJson({
      action: "query",
      prop: "revisions",
      rvprop: "content",
      rvslots: "main",
      rvsection: "0",
      titles: batch.join("|"),
    });
    for (const p of Object.values<any>(j.query?.pages ?? {})) {
      const wt: string = p.revisions?.[0]?.slots?.main?.["*"] ?? "";
      if (!p.title || !wt) continue;
      const num = Number(wt.match(/\|\s*Number\s*=\s*0*(\d{1,4})/i)?.[1]);
      const ser = (wt.match(/\|\s*Series\s*=\s*([^\n|]+)/i)?.[1] ?? "").trim();
      if (Number.isFinite(num)) out.set(p.title, { number: num, series: ser });
    }
    await sleep(THROTTLE_MS);
  }
  return out;
}

interface FileImg {
  pageid: number;
  name: string;
  url: string;
  thumb: string | null;
  width: number;
  height: number;
  mime: string;
}

/** Tous les fichiers liés à une page (generator=images, pagination gimcontinue). */
async function pageImages(title: string): Promise<FileImg[]> {
  const out: FileImg[] = [];
  let cont: Record<string, string> | undefined;
  do {
    const j = await apiJson({
      action: "query",
      generator: "images",
      titles: title,
      gimlimit: "200",
      prop: "imageinfo",
      iiprop: "url|size|mime",
      iiurlwidth: String(THUMB_W),
      ...cont,
    });
    for (const p of Object.values<any>(j.query?.pages ?? {})) {
      const ii = p.imageinfo?.[0];
      if (!ii || !p.pageid) continue;
      out.push({
        pageid: p.pageid,
        name: String(p.title).replace(/^File:/, ""),
        url: ii.url,
        thumb: ii.thumburl ?? null,
        width: ii.width ?? 0,
        height: ii.height ?? 0,
        mime: ii.mime ?? "",
      });
    }
    cont = j.continue ? { gimcontinue: j.continue.gimcontinue } : undefined;
    if (cont) await sleep(THROTTLE_MS);
  } while (cont);
  return out;
}

/**
 * Garde les screencaps HQ, écarte logos/titlecards/artworks (calqué sur rpbey).
 * jpeg/png, largeur ≥ minWidth, ratio paysage (1.1..2.1), nom non typé.
 */
const REJECT_NAME =
  /logo|title|titlecard|card|render|box|promo|cover|menu|flag|symbol|emblem|infobox|wiki|wordmark|favicon|stub|button|icon/i;
function isScreencap(f: FileImg, minWidth: number): boolean {
  if (!/^image\/(jpe?g|png)$/.test(f.mime)) return false;
  if (f.width < minWidth || f.height < 380) return false;
  const ratio = f.width / f.height;
  if (ratio < 1.1 || ratio > 2.1) return false;
  if (REJECT_NAME.test(f.name)) return false;
  return true;
}

/** Télécharge une image distante → webp local via ffmpeg. Renvoie w/h ou null. */
async function downloadWebp(
  url: string,
  dest: string,
  quality: number,
): Promise<{ width: number | null; height: number | null } | null> {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, accept: "image/*" },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 1024) return null;
    // ffmpeg lit le buffer sur stdin (-i pipe:0) → webp sur disque.
    const proc = Bun.spawn(
      [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        "pipe:0",
        "-frames:v",
        "1",
        "-c:v",
        "libwebp",
        "-quality",
        String(quality),
        "-y",
        dest,
      ],
      { stdin: buf, stdout: "ignore", stderr: "pipe" },
    );
    const code = await proc.exited;
    if (code !== 0) return null;
    const probe = Bun.spawn(
      [
        "ffprobe",
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height",
        "-of",
        "csv=p=0",
        dest,
      ],
      { stdout: "pipe", stderr: "ignore" },
    );
    const txt = (await new Response(probe.stdout).text()).trim();
    await probe.exited;
    const [w, h] = txt.split(",").map((n) => Number(n));
    return { width: Number.isFinite(w) ? w : null, height: Number.isFinite(h) ? h : null };
  } catch {
    return null;
  }
}

function matchesSeries(infoboxSeries: string, expected: string[]): boolean {
  const v = infoboxSeries.toLowerCase();
  // Vide = on ne sait pas → on garde (la catégorie filtre déjà la série).
  if (!v) return true;
  return expected.some((e) => v.includes(e.toLowerCase()));
}

async function main() {
  const args = parseArgs();
  const cfg = SERIES_CFG[args.series];
  console.log(
    `Recon Fandom DBZ — « ${cfg.label} » → ${cfg.category}` +
      (args.download ? "  [DOWNLOAD webp]" : "  [JSON URLs only]"),
  );

  const pageTitles = await categoryPages(cfg.category);
  console.log(`  ${pageTitles.length} page(s) d'épisode dans la catégorie.`);
  if (pageTitles.length === 0) throw new Error("0 page d'épisode — catégorie vide ou bloquée.");

  const metas = await episodeMeta(pageTitles);
  let eps = [...metas.entries()]
    .map(([title, m]) => ({ title, number: m.number, series: m.series }))
    .filter((e) => matchesSeries(e.series, cfg.infoboxSeries))
    .filter((e) => e.number >= args.from && e.number <= args.to)
    .toSorted((a, b) => a.number - b.number);
  if (Number.isFinite(args.maxEps)) eps = eps.slice(0, args.maxEps);
  console.log(
    `  ${eps.length} épisode(s) retenu(s) (|Series| match + bornes #${args.from}..${args.to === Infinity ? "∞" : args.to}).`,
  );
  if (eps.length === 0) throw new Error("0 épisode après filtre — vérifier --series/--from/--to.");

  await mkdir(DATA_DIR, { recursive: true });
  let totalCaps = 0;
  let totalDl = 0;

  for (const ep of eps) {
    const epId = resolveEpisode(args.series, ep.number);
    const epTag = `ep${pad(ep.number, 3)}`;
    const imgs = await pageImages(ep.title);
    await sleep(THROTTLE_MS);
    const caps = imgs.filter((f) => isScreencap(f, args.minWidth));

    const relBase = `${args.series}/${epTag}`;
    const assetDir = join(ASSETS_DIR, relBase);
    if (args.download && caps.length > 0) await mkdir(assetDir, { recursive: true });

    const frames: EpisodeFrame[] = [];
    let sortOrder = 0;
    for (const f of caps) {
      const idx = pad(sortOrder + 1, 5);
      let imagePath: string | null = null;
      let width: number | null = f.width || null;
      let height: number | null = f.height || null;
      if (args.download) {
        const fileName = `frame-${f.pageid}.webp`;
        const dest = join(assetDir, fileName);
        const dims = await downloadWebp(f.url, dest, args.quality);
        if (dims) {
          imagePath = `./assets/ext/db_episodes_frames/${relBase}/${fileName}`;
          width = dims.width ?? width;
          height = dims.height ?? height;
          totalDl++;
        }
        await sleep(120);
      }
      frames.push({
        source: "fandom",
        sourceId: `fandom:${f.pageid}`,
        sourceUrl: `https://dragonball.fandom.com/wiki/File:${encodeURIComponent(f.name)}`,
        episodeNumber: ep.number,
        // Sans --download : on conserve l'URL distante dans imagePath (à
        // rapatrier à l'ingestion via mirror-media), sinon le chemin local.
        imagePath: imagePath ?? f.url,
        timecodeSec: null,
        width,
        height,
        characterNames: [],
        tags: ["fandom-screencap"],
        caption: null,
        isNotable: false,
        sortOrder: sortOrder++,
      });
    }

    totalCaps += frames.length;
    console.log(
      `  ${epTag} (#${ep.number}, db id ${epId?.id ?? "?"}) : ${frames.length} cap(s)` +
        ` / ${imgs.length} fichiers liés — « ${ep.title} »`,
    );

    if (frames.length === 0) continue;
    const dataset: FramesDataset = {
      series: args.series,
      episodeNumber: ep.number,
      episodeId: epId?.id ?? null,
      source: "fandom",
      meta: {
        wikiPage: `https://dragonball.fandom.com/wiki/${encodeURIComponent(ep.title)}`,
        wikiTitle: ep.title,
        infoboxSeries: ep.series,
        downloaded: args.download,
      },
      scrapedAt: new Date().toISOString(),
      frames,
    };
    const out = join(DATA_DIR, `${args.series}-${epTag}.json`);
    await writeDatasetIfNonEmpty(out, dataset);
  }

  console.log(
    `\nOK — ${totalCaps} capture(s) sur ${eps.length} épisode(s)` +
      (args.download
        ? `, ${totalDl} webp téléchargé(s) dans ${ASSETS_DIR}`
        : " (URLs distantes en JSON)") +
      `.\n  Datasets : ${DATA_DIR}/${args.series}-epNNN.json` +
      `\n  Ingestion DB (gardée) à faire séparément (Neon db_episodes).`,
  );
}

main().catch((e) => {
  console.error("ÉCHEC:", e?.message ?? e);
  process.exit(1);
});
