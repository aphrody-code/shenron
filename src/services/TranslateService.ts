import { singleton } from "tsyringe";
import { isIP } from "node:net";
import { env } from "~/lib/env";
import { logger } from "~/lib/logger";

/**
 * OCR + Traduction — stack 100 % FOSS, zero clé commerciale.
 *
 * **OCR : Tesseract** (Apache 2.0)
 *   Installé en système via apt :
 *     sudo apt install tesseract-ocr tesseract-ocr-{fra,eng,jpn,spa,deu,ita}
 *   Doc : https://tesseract-ocr.github.io
 *   Spawn binaire CLI (Bun.spawn), pas de wrapper JS lourd ; image binaire
 *   passée en stdin pour éviter tout fichier temporaire.
 *
 * **Traduction : LibreTranslate** (AGPL-3.0)
 *   Self-host recommandé via Docker :
 *     docker run -d --restart unless-stopped --name libretranslate \
 *       -p 127.0.0.1:5000:5000 \
 *       libretranslate/libretranslate:latest \
 *       --load-only en,fr,ja,es,de,it
 *   Doc : https://github.com/LibreTranslate/LibreTranslate
 *   API publique gratuite (limitée) sur https://libretranslate.com — nécessite
 *   `LIBRETRANSLATE_API_KEY` car le free tier inscriptionnel a été ajouté.
 *
 * Endpoint configurable via `LIBRETRANSLATE_URL` (défaut http://127.0.0.1:5000).
 */

export interface OcrResult {
  text: string;
  language: string;
}

export interface TranslateResult {
  source: string;
  detectedLang: string;
  translated: string;
}

const DEFAULT_TESSERACT_LANGS = "fra+eng+jpn";
const DEFAULT_LIBRETRANSLATE_URL = "http://127.0.0.1:5000";

// Hard caps pour éviter les freeze sur input pourri.
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MiB — Discord upload normal
const TESSERACT_TIMEOUT_MS = 30_000;
const LIBRETRANSLATE_TIMEOUT_MS = 8_000;
const FETCH_IMAGE_TIMEOUT_MS = 10_000;

@singleton()
export class TranslateService {
  /**
   * Cache du test runtime tesseract — set au boot via `probe()`.
   * `null` tant qu'on n'a pas testé, `true`/`false` après.
   */
  private tesseractAvailable: boolean | null = null;
  private libretranslateAvailable: boolean | null = null;

  /** À appeler au boot (boot-audit.ts) — détecte les binaires/services dispos. */
  async probe(): Promise<{ ocr: boolean; translate: boolean }> {
    // 1. Tesseract présent ?
    try {
      const proc = Bun.spawn(["tesseract", "--version"], { stdout: "pipe", stderr: "pipe" });
      const exitCode = await proc.exited;
      this.tesseractAvailable = exitCode === 0;
    } catch {
      this.tesseractAvailable = false;
    }
    // 2. LibreTranslate up ?
    try {
      const base = (env.LIBRETRANSLATE_URL ?? DEFAULT_LIBRETRANSLATE_URL).replace(/\/+$/, "");
      const res = await fetch(`${base}/languages`, { signal: AbortSignal.timeout(3_000) });
      this.libretranslateAvailable = res.ok;
    } catch {
      this.libretranslateAvailable = false;
    }
    const result = { ocr: this.tesseractAvailable, translate: this.libretranslateAvailable };
    logger.info(result, "TranslateService probe");
    return result;
  }

  get available(): { ocr: boolean | null; translate: boolean | null } {
    return { ocr: this.tesseractAvailable, translate: this.libretranslateAvailable };
  }

  /** Bloque file://, IPs privées (SSRF). */
  private validateImageUrl(url: string): URL {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error("URL invalide.");
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("URL doit être http(s).");
    }
    const host = parsed.hostname;
    // IPs privées explicites
    if (isIP(host)) {
      if (
        /^(10\.|127\.|169\.254\.|192\.168\.)/.test(host) ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
        host === "0.0.0.0" ||
        host.startsWith("::1") ||
        host.toLowerCase().startsWith("fc") ||
        host.toLowerCase().startsWith("fd")
      ) {
        throw new Error("URL pointe vers une adresse interne — refusée.");
      }
    }
    if (host === "localhost") throw new Error("URL pointe vers localhost — refusée.");
    return parsed;
  }

  /**
   * OCR via tesseract CLI. Hard cap 10 MiB sur l'image pour éviter le freeze
   * de tesseract sur des PNG malicieux ; hard timeout 30 s.
   */
  async ocrFromUrl(imageUrl: string, langs = DEFAULT_TESSERACT_LANGS): Promise<OcrResult> {
    this.validateImageUrl(imageUrl);

    const res = await fetch(imageUrl, { signal: AbortSignal.timeout(FETCH_IMAGE_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`Téléchargement image HTTP ${res.status}`);
    const contentLength = Number(res.headers.get("content-length") ?? 0);
    if (contentLength > MAX_IMAGE_BYTES) {
      throw new Error(
        `Image trop grosse (${(contentLength / 1024 / 1024).toFixed(1)} MiB > 10 MiB).`,
      );
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > MAX_IMAGE_BYTES) {
      throw new Error(
        `Image trop grosse (${(buf.byteLength / 1024 / 1024).toFixed(1)} MiB > 10 MiB).`,
      );
    }

    try {
      const proc = Bun.spawn(["tesseract", "stdin", "stdout", "-l", langs, "--psm", "6"], {
        stdin: "pipe",
        stdout: "pipe",
        stderr: "pipe",
      });
      // Hard kill si tesseract hang (SIGKILL — pas de cleanup mais on protège l'event loop).
      const killer = setTimeout(() => proc.kill(), TESSERACT_TIMEOUT_MS).unref();
      proc.stdin.write(buf);
      await proc.stdin.end();
      const [stdout, stderr, exitCode] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
        proc.exited,
      ]);
      clearTimeout(killer);
      if (exitCode !== 0) {
        const tail = stderr.split("\n").slice(-3).join(" ").trim();
        throw new Error(`tesseract exit ${exitCode}: ${tail || "erreur inconnue"}`);
      }
      return { text: stdout.replace(/\r/g, "").trim(), language: langs };
    } catch (err) {
      if (err instanceof Error && /ENOENT|not found|spawn/.test(err.message)) {
        this.tesseractAvailable = false;
        throw new Error(
          "`tesseract` introuvable. Installer avec : `sudo apt install tesseract-ocr tesseract-ocr-fra tesseract-ocr-eng tesseract-ocr-jpn`",
          { cause: err },
        );
      }
      throw err;
    }
  }

  /**
   * Traduction via LibreTranslate. Source en `auto` pour laisser le serveur
   * détecter la langue. Si `LIBRETRANSLATE_API_KEY` est défini il est joint à
   * la requête (publique libretranslate.com requiert une key gratuite).
   *
   * Timeout court (8 s) — au-delà l'utilisateur n'attend plus.
   */
  async libretranslate(text: string, target = "fr"): Promise<TranslateResult> {
    if (!text.trim()) return { source: text, detectedLang: "—", translated: "" };
    const base = (env.LIBRETRANSLATE_URL ?? DEFAULT_LIBRETRANSLATE_URL).replace(/\/+$/, "");
    const endpoint = `${base}/translate`;

    const body: Record<string, string> = {
      q: text,
      source: "auto",
      target: target.toLowerCase(),
      format: "text",
    };
    if (env.LIBRETRANSLATE_API_KEY) body.api_key = env.LIBRETRANSLATE_API_KEY;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(LIBRETRANSLATE_TIMEOUT_MS),
    }).catch((err) => {
      if (err?.name === "TimeoutError") {
        throw new Error(
          `LibreTranslate timeout (>${LIBRETRANSLATE_TIMEOUT_MS / 1000}s) — vérifie que ${base} est up.`,
        );
      }
      throw err;
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(`LibreTranslate HTTP ${res.status}: ${msg.slice(0, 200)}`);
    }
    const data = (await res.json()) as {
      translatedText?: string;
      detectedLanguage?: { language: string; confidence: number };
    };
    if (!data.translatedText) throw new Error("LibreTranslate: réponse vide.");
    return {
      source: text,
      detectedLang: data.detectedLanguage?.language ?? "auto",
      translated: data.translatedText,
    };
  }

  async ocrAndTranslate(imageUrl: string, target = "fr"): Promise<TranslateResult | null> {
    const ocr = await this.ocrFromUrl(imageUrl);
    if (!ocr.text) {
      logger.debug({ imageUrl }, "OCR aucun texte");
      return null;
    }
    return this.libretranslate(ocr.text, target);
  }
}
