/**
 * frames-common.ts — Fondation partagée du pipeline « frames d'épisode » DBZ.
 *
 * Réplique l'architecture rpbey (apps/web/scripts/lib/ghost-scraper.ts) : un type
 * de frame stable, une écriture NON-DESTRUCTIVE (jamais d'écrasement par du vide),
 * et un mapping commun frame ↔ épisode ↔ personnage. Deux producteurs partagent
 * ce contrat :
 *   - extract-dbz-frames.ts   → ffmpeg sur vidéo locale (scene-detection + fps, webp)
 *   - scrape-dbz-fandom-frames.ts → screencaps HQ depuis dragonball.fandom.com
 *
 * AUCUNE écriture DB ici. La sortie est un dataset JSON + des fichiers webp/jpg sur
 * disque ; l'ingestion dans `db_episodes` (Neon, gardé) se fait séparément.
 *
 * Bun-only : `Bun.write`, `Bun.file`, `Bun.spawn`. Pas de node/npm/tsx.
 */

/** Séries DBZ reconnues côté `db_episodes.series`. */
export type Series = "DB" | "DBZ" | "DBGT" | "DBS" | "DB_DAIMA" | "DBZ_KAI";

/**
 * Une frame extraite/scrapée. Schéma stable, repris du `AnimeFrameImport` rpbey
 * et adapté au modèle shenron (asset self-host sous `apps/bot/assets/`).
 */
export interface EpisodeFrame {
  /** Provenance : "ffmpeg" (vidéo locale) ou "fandom" (screencap wiki). */
  source: "ffmpeg" | "fandom";
  /** Id stable côté source (ex. `ffmpeg:dbz:001:00042`, `fandom:<pageid>`). */
  sourceId: string;
  /** URL/chemin d'origine (page wiki, ou chemin de la vidéo source). */
  sourceUrl: string | null;
  /** Numéro d'épisode dans la série (= `db_episodes.number_in_series`). */
  episodeNumber: number;
  /**
   * Chemin d'asset bot RELATIF (`./assets/ext/db_episodes_frames/...`) — servi
   * via `bot.dragonballfr.com/assets/...`. null pour un dry-run (frame non écrite).
   */
  imagePath: string | null;
  /** Timecode dans l'épisode en secondes (ffmpeg), ou null (fandom). */
  timecodeSec: number | null;
  width: number | null;
  height: number | null;
  /** Noms de personnages présents (rempli par le merge, livrable séparé). */
  characterNames: string[];
  tags: string[];
  caption: string | null;
  /** Frame marquante (ex. scene-cut fort, épisode de combat). */
  isNotable: boolean;
  /** Ordre stable pour l'affichage. */
  sortOrder: number;
}

/** Enveloppe du dataset écrit sur disque, par (série, épisode). */
export interface FramesDataset {
  series: Series;
  episodeNumber: number;
  /** Id `db_episodes` si connu (résolu à l'ingestion sinon). */
  episodeId: number | null;
  source: EpisodeFrame["source"];
  /** Métadonnées de la source (chemin vidéo, durée, params ffmpeg, ou URL wiki). */
  meta: Record<string, unknown>;
  scrapedAt: string;
  frames: EpisodeFrame[];
}

/**
 * Écriture NON-DESTRUCTIVE + atomique (calquée sur `writeIfNonEmpty` rpbey) :
 * refuse d'écraser une sortie existante par un payload vide (0 frame) — un échec
 * d'extraction/scrape ne doit pas détruire un dataset déjà constitué.
 */
export async function writeDatasetIfNonEmpty(
  path: string,
  dataset: FramesDataset,
): Promise<boolean> {
  const count = dataset.frames.length;
  if (count <= 0) {
    console.error(`  ✗ 0 frame → ${path} PRÉSERVÉ (non-destructif).`);
    return false;
  }
  const tmp = `${path}.tmp`;
  await Bun.write(tmp, JSON.stringify(dataset, null, 2));
  await Bun.write(path, Bun.file(tmp));
  await Bun.file(tmp)
    .unlink?.()
    .catch(() => {});
  console.log(`  ✓ ${count} frame(s) → ${path}`);
  return true;
}

/** Padding cohérent pour les noms de fichiers/dossiers (ep007, 00042). */
export function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

/**
 * Résout (best-effort, lecture seule) l'`id` et le `number_in_series` d'un
 * épisode depuis le SQLite local, sans jamais écrire. Sert à nommer les assets et
 * pré-câbler `episodeId` dans le dataset. Renvoie null si la DB est absente.
 */
export function resolveEpisode(
  series: Series,
  numberInSeries: number,
): { id: number; numberInSeries: number } | null {
  const dbPath = new URL("../../data/bot.db", import.meta.url).pathname;
  try {
    // Import paresseux : un dry-run sans DB ne doit pas planter.
    const { Database } = require("bun:sqlite") as typeof import("bun:sqlite");
    const db = new Database(dbPath, { readonly: true });
    try {
      const row = db
        .query(
          "SELECT id, number_in_series AS n FROM db_episodes WHERE series = ? AND number_in_series = ? LIMIT 1",
        )
        .get(series, numberInSeries) as { id: number; n: number } | null;
      return row ? { id: row.id, numberInSeries: row.n } : null;
    } finally {
      db.close();
    }
  } catch {
    return null;
  }
}
