/**
 * embed-server.ts — Sidecar d'embeddings (process isolé du bot).
 *
 * Charge le modèle multilingue une fois, le garde chaud, et sert l'embedding
 * de requêtes/passages en HTTP local. Le bot (process à `MemoryMax=1.5G`)
 * l'appelle via `lib/rag.ts` sans jamais charger le modèle lui-même.
 *
 *   POST /embed   {"texts": ["..."], "kind": "query"|"passage"}        → {"vectors": [[...]]}
 *   POST /rerank  {"query": "...", "passages": ["...", "..."]}          → {"scores": [...]}
 *   GET  /health                                                        → {"ok": true, ...}
 *
 * Lancé en service systemd dédié (`shenron-embed.service`). Bind loopback only.
 *
 * Usage : EMBED_PORT=5007 bun apps/bot/embed-server.ts
 */
import {
	type EmbedKind,
	EMBED_DIM,
	EMBED_MODEL,
	embedTexts,
	RERANK_MODEL,
	rerankTexts,
} from "./src/lib/embeddings";

const PORT = Number(process.env.EMBED_PORT ?? 5007);
const HOST = process.env.EMBED_HOST ?? "127.0.0.1";

// Préchauffe le modèle au boot (le premier embed coûte le chargement ONNX).
const warmT0 = Date.now();
await embedTexts(["warmup"], "query", 1);
console.log(
	`[embed] ${EMBED_MODEL} (${EMBED_DIM}d) prêt en ${Date.now() - warmT0} ms — http://${HOST}:${PORT}`
);

Bun.serve({
	port: PORT,
	hostname: HOST,
	// Le chargement modèle peut être long ; les requêtes embed restent courtes.
	idleTimeout: 30,
	async fetch(req) {
		const url = new URL(req.url);

		if (url.pathname === "/health") {
			return Response.json({
				ok: true,
				model: EMBED_MODEL,
				dim: EMBED_DIM,
				reranker: RERANK_MODEL,
			});
		}

		if (url.pathname === "/rerank" && req.method === "POST") {
			let body: { query?: unknown; passages?: unknown };
			try {
				body = (await req.json()) as typeof body;
			} catch {
				return Response.json({ error: "bad_json" }, { status: 400 });
			}
			const query = typeof body.query === "string" ? body.query : "";
			const passages = Array.isArray(body.passages)
				? body.passages.filter((p): p is string => typeof p === "string")
				: [];
			if (!query || passages.length === 0) {
				return Response.json({ error: "missing_query_or_passages" }, { status: 400 });
			}
			if (passages.length > 64) {
				return Response.json({ error: "too_many" }, { status: 413 });
			}
			try {
				const scores = await rerankTexts(query, passages);
				const res = Response.json({ scores });
				Bun.gc(true);
				return res;
			} catch (e) {
				console.error("[embed] rerank error", e);
				return Response.json({ error: "rerank_failed" }, { status: 500 });
			}
		}

		if (url.pathname === "/embed" && req.method === "POST") {
			let body: { texts?: unknown; kind?: unknown };
			try {
				body = (await req.json()) as typeof body;
			} catch {
				return Response.json({ error: "bad_json" }, { status: 400 });
			}
			const texts = Array.isArray(body.texts)
				? body.texts.filter((t): t is string => typeof t === "string")
				: [];
			if (texts.length === 0) {
				return Response.json({ error: "no_texts" }, { status: 400 });
			}
			if (texts.length > 64) {
				return Response.json({ error: "too_many" }, { status: 413 });
			}
			const kind: EmbedKind = body.kind === "passage" ? "passage" : "query";
			try {
				const vecs = await embedTexts(texts, kind);
				const res = Response.json({ vectors: vecs.map((v) => Array.from(v)) });
				Bun.gc(true);
				return res;
			} catch (e) {
				console.error("[embed] error", e);
				return Response.json({ error: "embed_failed" }, { status: 500 });
			}
		}

		return new Response("not found", { status: 404 });
	},
});
