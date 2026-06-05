import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/config";

/**
 * API Route Next.js proxying requests to the bot's grounded RAG chat endpoint.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const persona = searchParams.get("persona") ?? "whis";
  const context = searchParams.get("context") ?? "";
  const session = searchParams.get("session") ?? ""; // mémoire de conversation par navigateur
  const lang = searchParams.get("lang") ?? "";
  const entity = searchParams.get("entity") ?? "";
  const sourceId = searchParams.get("sourceId") ?? "";

  if (!q) {
    return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }

  try {
    let botUrl =
      `${API_URL}/api/public/rag/chat?q=${encodeURIComponent(q)}&persona=${encodeURIComponent(persona)}` +
      `&context=${encodeURIComponent(context)}${session ? `&session=${encodeURIComponent(session)}` : ""}`;
    if (lang) botUrl += `&lang=${encodeURIComponent(lang)}`;
    if (entity) botUrl += `&entity=${encodeURIComponent(entity)}`;
    if (sourceId) botUrl += `&sourceId=${encodeURIComponent(sourceId)}`;

    const res = await fetch(botUrl, {
      method: "GET",
      // Caching disabled for real-time conversation queries
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Bot API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[NEXT CHAT PROXY] Failed to fetch bot RAG chat API:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
