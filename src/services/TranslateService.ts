import { singleton } from "tsyringe";
import { isIP } from "node:net";
import { env } from "~/lib/env";
import { logger } from "~/lib/logger";

/**
 * OCR + Traduction.
 *
 * **OCR : Tesseract** (Apache 2.0)
 *   Installé en système via apt :
 *     sudo apt install tesseract-ocr tesseract-ocr-{fra,eng,jpn,spa,deu,ita}
 *   Doc : https://tesseract-ocr.github.io
 *   Spawn binaire CLI (Bun.spawn), pas de wrapper JS lourd ; image binaire
 *   passée en stdin pour éviter tout fichier temporaire.
 *
 * **Traduction : Lingva → Google `gtx` → LibreTranslate → erreur**
 *   Aucun provider ne demande de clé API.
 *
 *   - **Lingva Translate** (AGPL-3.0) — proxy open source autour de Google
 *     Translate. On essaie plusieurs instances publiques en cascade
 *     (configurable via `LINGVA_INSTANCE`). Endpoint :
 *       GET {instance}/api/v1/{source}/{target}/{encodeURIComponent(text)}
 *     Réponse : `{ "translation": "...", "info": { "detectedSource": ".." } }`.
 *     Doc : https://github.com/thedaviddelta/lingva-translate
 *
 *   - **Google `gtx`** — endpoint utilisé par Chrome / extensions, pas de
 *     clé requise. Rate-limité par IP en cas d'abus.
 *       GET https://translate.googleapis.com/translate_a/single
 *           ?client=gtx&sl={src}&tl={tgt}&dt=t&q={text}
 *     Réponse : tableau imbriqué `[[[translated, source, ...], ...], ..., detectedLang]`.
 *
 *   - **LibreTranslate** (AGPL-3.0) — self-host via Docker comme dernier
 *     filet :
 *       docker run -d --restart unless-stopped --name libretranslate \
 *         -p 127.0.0.1:5000:5000 \
 *         libretranslate/libretranslate:latest \
 *         --load-only en,fr,ja,es,de,it
 *     Endpoint configurable via `LIBRETRANSLATE_URL`.
 *
 *   La méthode publique `translate(text, target, source?)` essaie chaque
 *   provider dans l'ordre, fallback auto sur le suivant en cas d'erreur
 *   réseau / quota.
 */

export interface OcrResult {
  text: string;
  language: string;
}

export interface TranslateResult {
  source: string;
  detectedLang: string;
  translated: string;
  /** Provider qui a effectivement servi la requête. */
  provider: "lingva" | "google" | "libretranslate";
}

export type TranslateProbe = {
  ocr: boolean;
  translate: boolean;
  lingva: boolean | null;
  google: boolean | null;
  libretranslate: boolean | null;
};

const DEFAULT_TESSERACT_LANGS = "fra+eng+jpn";
const DEFAULT_LIBRETRANSLATE_URL = "http://127.0.0.1:5000";

/**
 * Instances Lingva publiques connues, essayées en cascade. Réordonnées
 * 2026-04 après vérif live : `lingva.ml` est derrière un challenge
 * Cloudflare (HTML 403 sur les bots), `lingva.thedaviddelta.com` retourne
 * 503 DEPLOYMENT_PAUSED. On garde quand même les 4 — si une revient ou si
 * une nouvelle est ajoutée à la liste officielle on en bénéficie sans
 * redéploiement. Liste de référence :
 * https://github.com/thedaviddelta/lingva-translate#instances
 *
 * Note : la shape réelle observée est `{ "translation": "..." }` sans
 * champ `info.detectedSource` sur les instances actuelles — d'où le
 * fallback `data.info?.detectedSource ?? src` côté client.
 */
const LINGVA_INSTANCES = [
  "https://translate.plausibility.cloud",
  "https://lingva.lunar.icu",
  "https://lingva.ml",
  "https://lingva.thedaviddelta.com",
];

// Hard caps pour éviter les freeze sur input pourri.
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MiB — Discord upload normal
const MAX_TRANSLATE_CHARS = 5_000;
const TESSERACT_TIMEOUT_MS = 30_000;
const LIBRETRANSLATE_TIMEOUT_MS = 8_000;
const LINGVA_TIMEOUT_MS = 8_000;
const GOOGLE_TIMEOUT_MS = 8_000;
const FETCH_IMAGE_TIMEOUT_MS = 10_000;

/**
 * Normalise un code langue utilisateur (court, libre) en code ISO 639-1
 * minuscule pour Lingva / Google / LibreTranslate. Renvoie `"auto"` si
 * `code` est vide ou égal à `auto`.
 */
function normalizeLang(code: string | undefined): string {
  if (!code) return "auto";
  const c = code.trim().toLowerCase();
  if (!c || c === "auto") return "auto";
  // Aliases courants → ISO 639-1
  const aliases: Record<string, string> = {
    jp: "ja",
    "en-us": "en",
    "en-gb": "en",
    "pt-br": "pt",
    "pt-pt": "pt",
    nb: "no",
  };
  return aliases[c] ?? c.split("-")[0]!;
}

@singleton()
export class TranslateService {
  /**
   * Cache du test runtime — set au boot via `probe()`.
   * `null` tant qu'on n'a pas testé, `true`/`false` après.
   */
  private tesseractAvailable: boolean | null = null;
  private libretranslateAvailable: boolean | null = null;
  private lingvaAvailable: boolean | null = null;
  private googleAvailable: boolean | null = null;

  /** À appeler au boot (boot-audit.ts) — détecte les binaires/services dispos. */
  async probe(): Promise<TranslateProbe> {
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
    // 3. Au moins une instance Lingva atteignable ?
    this.lingvaAvailable = false;
    for (const inst of this.lingvaInstances()) {
      try {
        const res = await fetch(`${inst}/api/v1/auto/en/test`, {
          signal: AbortSignal.timeout(3_000),
        });
        if (res.ok) {
          this.lingvaAvailable = true;
          break;
        }
      } catch {
        /* essaie l'instance suivante */
      }
    }
    // 4. Google gtx atteignable ?
    try {
      const res = await fetch(
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fr&dt=t&q=ok",
        { signal: AbortSignal.timeout(3_000) },
      );
      this.googleAvailable = res.ok;
    } catch {
      this.googleAvailable = false;
    }

    const result: TranslateProbe = {
      ocr: this.tesseractAvailable === true,
      translate:
        this.lingvaAvailable === true ||
        this.googleAvailable === true ||
        this.libretranslateAvailable === true,
      lingva: this.lingvaAvailable,
      google: this.googleAvailable,
      libretranslate: this.libretranslateAvailable,
    };
    logger.info(result, "TranslateService probe");
    return result;
  }

  get available(): {
    ocr: boolean | null;
    translate: boolean | null;
    lingva: boolean | null;
    google: boolean | null;
    libretranslate: boolean | null;
  } {
    const flags = [this.lingvaAvailable, this.googleAvailable, this.libretranslateAvailable];
    const translate = flags.includes(true) ? true : flags.every((f) => f === false) ? false : null;
    return {
      ocr: this.tesseractAvailable,
      translate,
      lingva: this.lingvaAvailable,
      google: this.googleAvailable,
      libretranslate: this.libretranslateAvailable,
    };
  }

  /** Indique le provider qui sera tenté en premier (utile pour /audit, dashboard). */
  get primaryProvider(): "lingva" | "google" | "libretranslate" | "none" {
    if (this.lingvaAvailable !== false) return "lingva";
    if (this.googleAvailable !== false) return "google";
    if (this.libretranslateAvailable !== false) return "libretranslate";
    return "none";
  }

  /** Liste des instances Lingva à essayer, override en tête si configuré. */
  private lingvaInstances(): string[] {
    const override = env.LINGVA_INSTANCE?.replace(/\/+$/, "");
    const base = LINGVA_INSTANCES.map((u) => u.replace(/\/+$/, ""));
    if (!override) return base;
    return [override, ...base.filter((u) => u !== override)];
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
   * API publique de traduction. Cascade Lingva → Google → LibreTranslate
   * en sautant chaque provider marqué défaillant.
   *
   * @param text     Texte source — borné à 5 000 chars.
   * @param target   Code langue cible (fr, en, ja, …) — case-insensitive.
   * @param source   Optionnel — si omis : auto-détection.
   */
  async translate(text: string, target = "fr", source?: string): Promise<TranslateResult> {
    if (!text.trim()) {
      return { source: text, detectedLang: "—", translated: "", provider: "lingva" };
    }
    const truncated = text.length > MAX_TRANSLATE_CHARS ? text.slice(0, MAX_TRANSLATE_CHARS) : text;

    // 1. Lingva (Google quality, sans clé, plusieurs instances)
    if (this.lingvaAvailable !== false) {
      try {
        return await this.lingva(truncated, target, source);
      } catch (err) {
        logger.warn({ err: (err as Error).message }, "Lingva failed, fallback Google");
      }
    }

    // 2. Google gtx (sans clé)
    if (this.googleAvailable !== false) {
      try {
        return await this.googleGtx(truncated, target, source);
      } catch (err) {
        logger.warn({ err: (err as Error).message }, "Google gtx failed, fallback LibreTranslate");
      }
    }

    // 3. Fallback LibreTranslate self-host
    return this.libretranslate(truncated, target, source);
  }

  /**
   * Traduction via Lingva Translate. Tente toutes les instances configurées
   * jusqu'à un succès. Marque `lingvaAvailable=false` si toutes échouent.
   */
  async lingva(text: string, target = "fr", source?: string): Promise<TranslateResult> {
    const tgt = normalizeLang(target);
    const src = normalizeLang(source);
    const path = `/api/v1/${encodeURIComponent(src)}/${encodeURIComponent(tgt)}/${encodeURIComponent(text)}`;

    let lastErr: Error | null = null;
    for (const inst of this.lingvaInstances()) {
      try {
        const res = await fetch(`${inst}${path}`, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(LINGVA_TIMEOUT_MS),
        });
        if (!res.ok) {
          lastErr = new Error(`Lingva ${inst} HTTP ${res.status}`);
          continue;
        }
        const data = (await res.json()) as {
          translation?: string;
          info?: { detectedSource?: string };
        };
        if (!data.translation) {
          lastErr = new Error(`Lingva ${inst}: réponse vide`);
          continue;
        }
        return {
          source: text,
          detectedLang: (data.info?.detectedSource ?? src).toLowerCase(),
          translated: data.translation,
          provider: "lingva",
        };
      } catch (err) {
        lastErr = err as Error;
      }
    }
    this.lingvaAvailable = false;
    throw lastErr ?? new Error("Lingva: aucune instance disponible.");
  }

  /**
   * Traduction via l'endpoint Google `translate_a/single` avec `client=gtx`
   * (utilisé par Chrome — pas de clé). Réponse tableau imbriqué : on
   * concatène les `chunks[i][0]` pour reconstituer le texte traduit, et on
   * lit la lang détectée en `data[2]`.
   */
  async googleGtx(text: string, target = "fr", source?: string): Promise<TranslateResult> {
    const tgt = normalizeLang(target);
    const src = normalizeLang(source);
    const params = new URLSearchParams({
      client: "gtx",
      sl: src,
      tl: tgt,
      dt: "t",
      q: text,
    });
    const url = `https://translate.googleapis.com/translate_a/single?${params.toString()}`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(GOOGLE_TIMEOUT_MS),
    }).catch((err) => {
      if (err?.name === "TimeoutError") {
        throw new Error(`Google gtx timeout (>${GOOGLE_TIMEOUT_MS / 1000}s).`);
      }
      throw err;
    });
    if (!res.ok) {
      // 429 / 403 → mémorise pour stop-essayer pendant ce process
      if (res.status === 429 || res.status === 403) this.googleAvailable = false;
      throw new Error(`Google gtx HTTP ${res.status}`);
    }
    const data = (await res.json()) as unknown[];
    if (!Array.isArray(data) || !Array.isArray(data[0])) {
      throw new Error("Google gtx: format inattendu.");
    }
    const chunks = data[0] as Array<unknown[]>;
    const translated = chunks.map((c) => (typeof c[0] === "string" ? c[0] : "")).join("");
    if (!translated) throw new Error("Google gtx: réponse vide.");
    const detected = typeof data[2] === "string" ? data[2] : src;
    return {
      source: text,
      detectedLang: detected.toLowerCase(),
      translated,
      provider: "google",
    };
  }

  /**
   * Traduction via LibreTranslate. Source en `auto` par défaut. Si
   * `LIBRETRANSLATE_API_KEY` est défini il est joint à la requête.
   *
   * Timeout court (8 s) — au-delà l'utilisateur n'attend plus.
   */
  async libretranslate(text: string, target = "fr", source?: string): Promise<TranslateResult> {
    if (!text.trim()) {
      return { source: text, detectedLang: "—", translated: "", provider: "libretranslate" };
    }
    const base = (env.LIBRETRANSLATE_URL ?? DEFAULT_LIBRETRANSLATE_URL).replace(/\/+$/, "");
    const endpoint = `${base}/translate`;

    const body: Record<string, string> = {
      q: text,
      source: normalizeLang(source),
      target: normalizeLang(target),
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
      detectedLang: data.detectedLanguage?.language ?? source ?? "auto",
      translated: data.translatedText,
      provider: "libretranslate",
    };
  }

  async ocrAndTranslate(imageUrl: string, target = "fr"): Promise<TranslateResult | null> {
    const ocr = await this.ocrFromUrl(imageUrl);
    if (!ocr.text) {
      logger.debug({ imageUrl }, "OCR aucun texte");
      return null;
    }
    return this.translate(ocr.text, target);
  }
}
