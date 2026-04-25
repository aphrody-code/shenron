import { singleton } from "tsyringe";
import { env } from "~/lib/env";
import { logger } from "~/lib/logger";

/**
 * OCR.space : free tier 25k requêtes/mois, 1 MB par image.
 *   Endpoint  : https://api.ocr.space/parse/imageurl
 *   Doc       : https://ocr.space/ocrapi
 *
 * DeepL Free : 500k caractères/mois.
 *   Endpoint  : https://api-free.deepl.com/v2/translate
 *   Doc       : https://developers.deepl.com/docs
 *
 * Si la key DEEPL ressemble à un compte Pro (suffixe `:fx` absent), on bascule
 * automatiquement sur l'endpoint Pro.
 */

const OCR_LANG_HINTS: Record<string, string> = {
  en: "eng",
  ja: "jpn",
  ko: "kor",
  zh: "chs",
  es: "spa",
  pt: "por",
  de: "ger",
  it: "ita",
  ru: "rus",
  auto: "eng",
};

export interface OcrResult {
  text: string;
  language: string;
  exitCode: number;
}

export interface TranslateResult {
  source: string;
  detectedLang: string;
  translated: string;
}

@singleton()
export class TranslateService {
  get available(): { ocr: boolean; deepl: boolean } {
    return {
      ocr: !!env.OCR_SPACE_API_KEY,
      deepl: !!env.DEEPL_API_KEY,
    };
  }

  async ocrFromUrl(imageUrl: string, languageHint = "auto"): Promise<OcrResult> {
    if (!env.OCR_SPACE_API_KEY) throw new Error("OCR_SPACE_API_KEY non configurée.");
    const lang = OCR_LANG_HINTS[languageHint] ?? "eng";
    const body = new URLSearchParams({
      url: imageUrl,
      language: lang,
      isOverlayRequired: "false",
      detectOrientation: "true",
      scale: "true",
      OCREngine: "2",
    });
    const res = await fetch("https://api.ocr.space/parse/imageurl?" + body.toString(), {
      method: "GET",
      headers: { apikey: env.OCR_SPACE_API_KEY },
    });
    if (!res.ok) {
      throw new Error(`OCR.space HTTP ${res.status}`);
    }
    const data = (await res.json()) as {
      ParsedResults?: Array<{ ParsedText: string; TextOverlay?: unknown }>;
      OCRExitCode?: number;
      IsErroredOnProcessing?: boolean;
      ErrorMessage?: string | string[];
    };
    if (data.IsErroredOnProcessing) {
      const msg = Array.isArray(data.ErrorMessage)
        ? data.ErrorMessage.join(" / ")
        : data.ErrorMessage;
      throw new Error(`OCR.space: ${msg ?? "erreur inconnue"}`);
    }
    const text = (data.ParsedResults ?? [])
      .map((p) => p.ParsedText ?? "")
      .join("\n")
      .replace(/\r/g, "")
      .trim();
    return { text, language: lang, exitCode: data.OCRExitCode ?? 0 };
  }

  async deepl(text: string, target = "FR"): Promise<TranslateResult> {
    if (!env.DEEPL_API_KEY) throw new Error("DEEPL_API_KEY non configurée.");
    if (!text.trim()) return { source: text, detectedLang: "—", translated: "" };

    const isFree = env.DEEPL_API_KEY.endsWith(":fx");
    const endpoint = isFree
      ? "https://api-free.deepl.com/v2/translate"
      : "https://api.deepl.com/v2/translate";

    const body = new URLSearchParams({
      text,
      target_lang: target.toUpperCase(),
    });

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${env.DEEPL_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(`DeepL HTTP ${res.status}: ${msg.slice(0, 200)}`);
    }
    const data = (await res.json()) as {
      translations: Array<{ detected_source_language: string; text: string }>;
    };
    const translation = data.translations?.[0];
    if (!translation) {
      throw new Error("DeepL: réponse vide.");
    }
    return {
      source: text,
      detectedLang: translation.detected_source_language,
      translated: translation.text,
    };
  }

  /** OCR puis traduction. Retourne null si pas de texte détecté. */
  async ocrAndTranslate(imageUrl: string, target = "FR"): Promise<TranslateResult | null> {
    const ocr = await this.ocrFromUrl(imageUrl);
    if (!ocr.text) {
      logger.debug({ imageUrl }, "OCR aucun texte");
      return null;
    }
    return this.deepl(ocr.text, target);
  }
}
