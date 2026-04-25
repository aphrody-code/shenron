import { singleton } from "tsyringe";
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

@singleton()
export class TranslateService {
  get available(): { ocr: boolean; translate: boolean } {
    return {
      ocr: true, // assumé : on testera au runtime via spawn
      translate: !!(env.LIBRETRANSLATE_URL ?? DEFAULT_LIBRETRANSLATE_URL),
    };
  }

  /**
   * OCR via tesseract CLI. Si le binaire est absent on lève une erreur
   * explicite (le caller affiche un embed avec la commande apt à exécuter).
   */
  async ocrFromUrl(imageUrl: string, langs = DEFAULT_TESSERACT_LANGS): Promise<OcrResult> {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Téléchargement image HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());

    try {
      const proc = Bun.spawn(["tesseract", "stdin", "stdout", "-l", langs, "--psm", "6"], {
        stdin: "pipe",
        stdout: "pipe",
        stderr: "pipe",
      });
      proc.stdin.write(buf);
      await proc.stdin.end();
      const [stdout, stderr, exitCode] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
        proc.exited,
      ]);
      if (exitCode !== 0) {
        const tail = stderr.split("\n").slice(-3).join(" ").trim();
        throw new Error(`tesseract exit ${exitCode}: ${tail || "erreur inconnue"}`);
      }
      return { text: stdout.replace(/\r/g, "").trim(), language: langs };
    } catch (err) {
      if (err instanceof Error && /ENOENT|not found|spawn/.test(err.message)) {
        throw new Error(
          "`tesseract` introuvable. Installer avec : `sudo apt install tesseract-ocr tesseract-ocr-fra tesseract-ocr-eng tesseract-ocr-jpn`",
        );
      }
      throw err;
    }
  }

  /**
   * Traduction via LibreTranslate. Source en `auto` pour laisser le serveur
   * détecter la langue. Si `LIBRETRANSLATE_API_KEY` est défini il est joint à
   * la requête (publique libretranslate.com requiert une key gratuite).
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
      signal: AbortSignal.timeout(30_000),
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
