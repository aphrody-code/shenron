#!/usr/bin/env bun
/**
 * build-episode-scenes.ts — ORCHESTRATEUR de la feature « Scènes d'épisode ».
 *
 * Combine le pipeline existant en UN seul geste, par (série, épisode) :
 *   1. EXTRACTION — lance le producteur de frames adapté :
 *        - `extract-dbz-frames.ts` (ffmpeg sur master vidéo local) si une source
 *          existe sous `data/dbz-sources/<series>/<ep>.<ext>` ou via `--input` ;
 *        - sinon `scrape-dbz-fandom-frames.ts --download` (screencaps wiki HQ).
 *      Les deux écrivent un dataset `data/dbz-frames/<series>-ep<NNN>.json`
 *      (contrat `frames-common.ts`) + les webp sous
 *      `assets/ext/db_episodes_frames/<series>/ep<NNN>/`.
 *   2. SÉLECTION — relit ce dataset, trie « notable d'abord » puis par `sortOrder`,
 *      cap à `--max` (défaut 24) → les meilleures frames du montage.
 *   3. PREVIEW — ffmpeg génère `preview.mp4` (montage court, ~`--hold` s/frame,
 *      slideshow concat des webp sélectionnés, H.264 yuv420p, web-friendly).
 *   4. DATASET — réécrit `data/dbz-frames/<series>-ep<NNN>.json` au format
 *      orchestrateur : `{ series, number, episodeId, frames: EpisodeFrame[],
 *      scenePreview, meta, scrapedAt }`. `scenePreview` = chemin relatif
 *      `./assets/ext/db_episodes_frames/<series>/ep<NNN>/preview.mp4`.
 *
 * AUCUNE écriture DB ici (ingestion Neon gardée = `ingest-episode-frames.ts`).
 *
 * Bun-only : `Bun.spawn`, `Bun.file`, `Bun.write`. Pas de node/npm/tsx.
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *   bun apps/bot/scripts/build-episode-scenes.ts --series DBZ --ep 1 \
 *       [--max 24] [--hold 0.8] [--input <video>] [--source ffmpeg|fandom|auto] \
 *       [--keep-extract-args "--scene 0.4 --period 6"] [--dry-run]
 *
 *   --series   série db_episodes (DB|DBZ|DBGT|DBS|DB_DAIMA|DBZ_KAI). défaut DBZ
 *   --ep       numberInSeries (obligatoire)
 *   --max      nombre de frames retenues pour le montage (défaut 24)
 *   --hold     durée d'affichage par frame dans le preview, en s (défaut 0.8)
 *   --input    chemin vidéo explicite → force la source ffmpeg
 *   --source   ffmpeg | fandom | auto (défaut auto : ffmpeg si vidéo dispo)
 *   --dry-run  smoke : génère un clip lavfi de test, prouve frames + preview.mp4,
 *              nettoie tout dans /tmp, n'écrit RIEN dans assets/ ni data/.
 */
import { mkdir, readdir, stat, rm } from "node:fs/promises";
import { join } from "node:path";
import { type EpisodeFrame, type Series, pad, resolveEpisode } from "./lib/frames-common.ts";

const SERIES_VALUES: Series[] = ["DB", "DBZ", "DBGT", "DBS", "DB_DAIMA", "DBZ_KAI"];
const ROOT = new URL("../", import.meta.url).pathname; // apps/bot/
const SOURCES_DIR = join(ROOT, "data", "dbz-sources");
const ASSETS_DIR = join(ROOT, "assets", "ext", "db_episodes_frames");
const DATA_DIR = join(ROOT, "data", "dbz-frames");
const SCRIPTS_DIR = join(ROOT, "scripts");
const VIDEO_EXTS = [".mkv", ".mp4", ".m4v", ".webm", ".avi", ".mov", ".ts"];

interface Args {
  series: Series;
  ep: number;
  max: number;
  hold: number;
  input: string | null;
  source: "ffmpeg" | "fandom" | "auto";
  dryRun: boolean;
}

/** Sortie orchestrateur écrite sur disque (superset du contrat partagé). */
interface SceneDataset {
  series: Series;
  /** = number_in_series. Alias `number` exigé par le contrat partagé. */
  number: number;
  episodeId: number | null;
  frames: EpisodeFrame[];
  /** Chemin relatif du MP4 montage (`./assets/.../preview.mp4`). */
  scenePreview: string;
  meta: Record<string, unknown>;
  scrapedAt: string;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const val = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const num = (flag: string, def: number): number => {
    const v = val(flag);
    return v !== undefined && v !== "" ? Number(v) : def;
  };
  const series = (val("--series") ?? "DBZ").toUpperCase() as Series;
  if (!SERIES_VALUES.includes(series)) {
    throw new Error(`--series invalide « ${series} ». Valeurs: ${SERIES_VALUES.join(", ")}`);
  }
  const ep = num("--ep", NaN);
  if (!Number.isInteger(ep) || ep <= 0) {
    throw new Error("--ep <numberInSeries> requis (entier > 0).");
  }
  const rawSource = (val("--source") ?? "auto").toLowerCase();
  if (!["ffmpeg", "fandom", "auto"].includes(rawSource)) {
    throw new Error(`--source invalide « ${rawSource} » (ffmpeg|fandom|auto).`);
  }
  return {
    series,
    ep,
    max: num("--max", 24),
    hold: num("--hold", 0.8),
    input: val("--input") ?? null,
    source: rawSource as Args["source"],
    dryRun: argv.includes("--dry-run"),
  };
}

const exists = (p: string) =>
  stat(p).then(
    () => true,
    () => false,
  );

/** True si un master vidéo local existe pour (série, ep) ou via --input. */
async function hasLocalVideo(args: Args): Promise<boolean> {
  if (args.input) return exists(args.input);
  const dir = join(SOURCES_DIR, args.series);
  if (!(await exists(dir))) return false;
  const files = await readdir(dir);
  const stem = String(args.ep);
  return files.some(
    (f) =>
      VIDEO_EXTS.some((e) => f.toLowerCase().endsWith(e)) &&
      new RegExp(`(^|[^0-9])0*${stem}([^0-9]|$)`).test(f),
  );
}

/** Lance un script producteur en sous-process Bun, hérite stdio. */
async function runProducer(script: string, scriptArgs: string[]): Promise<void> {
  const proc = Bun.spawn(["bun", join(SCRIPTS_DIR, script), ...scriptArgs], {
    cwd: ROOT,
    stdout: "inherit",
    stderr: "inherit",
  });
  const code = await proc.exited;
  if (code !== 0) throw new Error(`${script} a échoué (code ${code}).`);
}

/** Relit le dataset producteur et renvoie ses frames (peut être vide). */
async function readProducerFrames(datasetPath: string): Promise<EpisodeFrame[]> {
  if (!(await exists(datasetPath))) {
    throw new Error(`Dataset producteur introuvable: ${datasetPath}`);
  }
  const raw = (await Bun.file(datasetPath).json()) as { frames?: EpisodeFrame[] };
  return Array.isArray(raw.frames) ? raw.frames : [];
}

/** Tri « notable d'abord » puis ordre stable, cap à `max`. */
function selectTopFrames(frames: EpisodeFrame[], max: number): EpisodeFrame[] {
  return frames
    .filter((f) => f.imagePath) // seules les frames réellement écrites
    .toSorted((a, b) => {
      if (a.isNotable !== b.isNotable) return a.isNotable ? -1 : 1;
      return a.sortOrder - b.sortOrder;
    })
    .slice(0, Math.max(1, max));
}

/** Résout le chemin absolu d'une frame : `/abs` tel quel, sinon `./assets/...` depuis ROOT. */
function frameAbsPath(imagePath: string): string {
  if (imagePath.startsWith("/")) return imagePath;
  return join(ROOT, imagePath.replace(/^\.\//, ""));
}

/**
 * Génère un MP4 montage (slideshow) à partir des frames sélectionnées via ffmpeg
 * `concat demuxer` : chaque image tenue `hold` s, ré-échelonnée en dims paires
 * (yuv420p exige largeur/hauteur paires), H.264 web-friendly (+faststart).
 */
async function buildPreview(
  frames: EpisodeFrame[],
  outMp4: string,
  hold: number,
  workDir: string,
): Promise<void> {
  const abs = frames.map((f) => frameAbsPath(f.imagePath as string));
  // Fichier concat demuxer : `file '<path>'` + `duration <hold>` par image. La
  // dernière image doit être répétée (quirk concat demuxer) pour tenir sa durée.
  const lines: string[] = [];
  for (const p of abs) {
    lines.push(`file '${p.replace(/'/g, "'\\''")}'`);
    lines.push(`duration ${hold}`);
  }
  lines.push(`file '${abs[abs.length - 1].replace(/'/g, "'\\''")}'`);
  const listPath = join(workDir, "concat.txt");
  await Bun.write(listPath, lines.join("\n") + "\n");

  const proc = Bun.spawn(
    [
      "ffmpeg",
      "-hide_banner",
      "-loglevel",
      "error",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listPath,
      // Mise à l'échelle en dims paires + pad pour homogénéiser des frames de
      // tailles différentes (fandom mélange des résolutions).
      "-vf",
      "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p",
      "-r",
      "30",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-movflags",
      "+faststart",
      "-y",
      outMp4,
    ],
    { stdout: "ignore", stderr: "pipe" },
  );
  const stderr = await new Response(proc.stderr).text();
  const code = await proc.exited;
  if (code !== 0) {
    throw new Error(`ffmpeg (preview) a échoué (code ${code}):\n${stderr.slice(-600)}`);
  }
}

/**
 * SMOKE (--dry-run) : génère un clip de test via `ffmpeg -f lavfi`, en extrait
 * des frames webp, monte un preview.mp4, prouve la chaîne, et nettoie tout dans
 * /tmp. N'ÉCRIT RIEN dans assets/ ni data/.
 */
async function smoke(args: Args): Promise<void> {
  const work = join("/tmp", `scenes-smoke-${Date.now()}`);
  await mkdir(work, { recursive: true });
  try {
    // 1. Clip synthétique 5 s (testsrc2) → master local factice.
    const clip = join(work, "clip.mp4");
    const genClip = Bun.spawn(
      [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-f",
        "lavfi",
        "-i",
        "testsrc2=size=320x240:rate=15:duration=5",
        "-pix_fmt",
        "yuv420p",
        "-y",
        clip,
      ],
      { stdout: "ignore", stderr: "pipe" },
    );
    const e1 = await new Response(genClip.stderr).text();
    if ((await genClip.exited) !== 0) throw new Error(`lavfi clip KO:\n${e1.slice(-400)}`);

    // 2. Extraction : 1 frame/s → webp.
    const extractCode = await Bun.spawn(
      [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        clip,
        "-vf",
        "fps=1",
        "-c:v",
        "libwebp",
        "-quality",
        "80",
        "-y",
        join(work, "frame-%05d.webp"),
      ],
      { stdout: "ignore", stderr: "inherit" },
    ).exited;
    if (extractCode !== 0) throw new Error("extraction webp KO");

    const webps = (await readdir(work)).filter((f) => /^frame-\d+\.webp$/.test(f)).toSorted();
    if (webps.length === 0) throw new Error("0 frame webp extraite (smoke)");

    // 3. Frames factices pointant sur les webp /tmp (imagePath absolu via ./ hack).
    const frames: EpisodeFrame[] = webps.map((f, i) => ({
      source: "ffmpeg",
      sourceId: `smoke:${pad(i + 1, 5)}`,
      sourceUrl: clip,
      episodeNumber: args.ep,
      imagePath: join(work, f), // chemin absolu /tmp (frameAbsPath le garde tel quel)
      timecodeSec: i,
      width: 320,
      height: 240,
      characterNames: [],
      tags: ["smoke"],
      caption: null,
      isNotable: i === 0,
      sortOrder: i,
    }));

    const selected = selectTopFrames(frames, args.max);
    const preview = join(work, "preview.mp4");
    await buildPreview(selected, preview, args.hold, work);

    const st = await stat(preview);
    if (st.size <= 0) throw new Error("preview.mp4 vide (smoke)");

    console.log(
      `\n[SMOKE OK] chaîne prouvée dans ${work}\n` +
        `  • clip lavfi    : ${clip}\n` +
        `  • frames webp   : ${webps.length} (sélection ${selected.length})\n` +
        `  • preview.mp4   : ${preview} (${st.size} octets)\n` +
        `  rien écrit dans assets/ ni data/. Nettoyage /tmp…`,
    );
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

async function main(): Promise<void> {
  const args = parseArgs();
  const epTag = `ep${pad(args.ep, 3)}`;

  if (args.dryRun) {
    console.log(
      `build-episode-scenes — ${args.series} ${epTag}  [DRY-RUN / SMOKE]\n` +
        `  (clip lavfi de test, preview montage, nettoyage /tmp — zéro écriture prod)`,
    );
    await smoke(args);
    return;
  }

  // ── 1. EXTRACTION ──────────────────────────────────────────────────────────
  const useFfmpeg =
    args.source === "ffmpeg" || (args.source === "auto" && (await hasLocalVideo(args)));
  const epId = resolveEpisode(args.series, args.ep);

  console.log(
    `build-episode-scenes — ${args.series} ${epTag} (db id ${epId?.id ?? "?"})\n` +
      `  source : ${useFfmpeg ? "ffmpeg (master local)" : "fandom (screencaps wiki)"}\n` +
      `  params : max ${args.max} frames, hold ${args.hold}s/frame`,
  );

  if (useFfmpeg) {
    const extraArgs = ["--series", args.series, "--ep", String(args.ep)];
    if (args.input) extraArgs.push("--input", args.input);
    await runProducer("extract-dbz-frames.ts", extraArgs);
  } else {
    await runProducer("scrape-dbz-fandom-frames.ts", [
      "--series",
      args.series,
      "--from",
      String(args.ep),
      "--to",
      String(args.ep),
      "--max-eps",
      "1",
      "--download",
    ]);
  }

  // ── 2. SÉLECTION ───────────────────────────────────────────────────────────
  const datasetPath = join(DATA_DIR, `${args.series}-${epTag}.json`);
  const allFrames = await readProducerFrames(datasetPath);
  const selected = selectTopFrames(allFrames, args.max);
  if (selected.length === 0) {
    throw new Error(
      "Aucune frame écrite exploitable (imagePath null). Relance le producteur sans --dry-run.",
    );
  }
  console.log(
    `  → ${allFrames.length} frame(s) extraite(s), ${selected.length} retenue(s) pour le montage` +
      ` (${selected.filter((f) => f.isNotable).length} notable).`,
  );

  // ── 3. PREVIEW MP4 ─────────────────────────────────────────────────────────
  const relBase = `${args.series}/${epTag}`;
  const assetDir = join(ASSETS_DIR, relBase);
  await mkdir(assetDir, { recursive: true });
  const previewAbs = join(assetDir, "preview.mp4");
  const previewRel = `./assets/ext/db_episodes_frames/${relBase}/preview.mp4`;
  const work = join("/tmp", `scenes-build-${args.series}-${epTag}-${Date.now()}`);
  await mkdir(work, { recursive: true });
  try {
    await buildPreview(selected, previewAbs, args.hold, work);
  } finally {
    await rm(work, { recursive: true, force: true });
  }
  const previewStat = await stat(previewAbs);
  console.log(`  → preview.mp4 : ${previewRel} (${previewStat.size} octets)`);

  // ── 4. DATASET ORCHESTRATEUR ────────────────────────────────────────────────
  const out: SceneDataset = {
    series: args.series,
    number: args.ep,
    episodeId: epId?.id ?? null,
    frames: selected,
    scenePreview: previewRel,
    meta: {
      producer: useFfmpeg ? "extract-dbz-frames" : "scrape-dbz-fandom-frames",
      totalExtracted: allFrames.length,
      selected: selected.length,
      holdSec: args.hold,
    },
    scrapedAt: new Date().toISOString(),
  };
  await mkdir(DATA_DIR, { recursive: true });
  await Bun.write(datasetPath, JSON.stringify(out, null, 2));

  console.log(
    `\nOK — scène d'épisode prête :\n` +
      `  dataset : ${datasetPath}\n` +
      `  frames  : ${selected.length} webp dans ${assetDir}\n` +
      `  preview : ${previewRel}\n` +
      `  → ingestion Neon (gardée) :\n` +
      `      bun apps/bot/scripts/ingest-episode-frames.ts --series ${args.series} --ep ${args.ep} --apply`,
  );
}

main().catch((e) => {
  console.error("ÉCHEC:", e?.message ?? e);
  process.exit(1);
});
