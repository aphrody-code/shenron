/**
 * index.ts — Serveur MCP public Dragon Ball (Streamable HTTP, sans état, lecture seule).
 *
 * Expose le RAG et l'API publique du bot Shenron en tant qu'outils MCP, accessibles
 * par tout client compatible MCP (Claude web, Grok, Gemini, Ollama via bridge…).
 *
 *   POST /mcp     → endpoint MCP (JSON-RPC, transport Streamable HTTP, sans session)
 *   GET  /health  → sonde de disponibilité (séparée de /mcp)
 *   GET  /        → page de documentation/connexion (HTML)
 *
 * Transport : `WebStandardStreamableHTTPServerTransport` (handleRequest: Request → Response),
 * natif Bun.serve — pas de node:http, pas de Hono. Stateless : un serveur + un transport
 * neufs par requête (`sessionIdGenerator: undefined`), rien n'est stocké côté serveur.
 *
 * Sécurité : aucune auth (API déjà publique, lecture seule), CORS ouvert (`*`), aucun
 * secret manipulé. Le proxy nginx (mcp.dragonballfr.com) termine TLS + rate-limit.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { API_BASE } from "./api.ts";
import { registerAllTools } from "./tools.ts";

const PORT = Number(process.env.MCP_PORT ?? 5010);
const HOST = process.env.MCP_HOST ?? "127.0.0.1";
const VERSION = "0.1.0";
const SERVER_NAME = "shenron-dragonball";
const PUBLIC_URL = process.env.MCP_PUBLIC_URL ?? "https://mcp.dragonballfr.com";

const TOOL_NAMES = [
	"rag_search",
	"rag_ask",
	"sources",
	"wiki_search",
	"wiki_list",
	"wiki_get",
	"manga_search",
	"manga_tomes",
	"manga_page",
	"bot_stats",
	"bot_personas",
	"bot_leaderboard",
	"bot_commands",
	"news",
];

/** Construit une instance MCP fraîche (stateless : une par requête). */
function buildServer(): McpServer {
	const server = new McpServer(
		{ name: SERVER_NAME, version: VERSION },
		{
			instructions:
				"Base de connaissances et API publique Dragon Ball (dragonballfr.com). " +
				"Pour les questions factuelles, rag_search renvoie des passages sourcés et rag_ask une réponse rédigée. " +
				"Les outils wiki_* parcourent les entités structurées (personnages, planètes, sagas…).",
		}
	);
	registerAllTools(server);
	return server;
}

const CORS_HEADERS: Record<string, string> = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, mcp-session-id, mcp-protocol-version, Last-Event-ID, Accept",
	"Access-Control-Expose-Headers": "mcp-session-id, mcp-protocol-version",
	"Access-Control-Max-Age": "86400",
};

function withCors(res: Response): Response {
	const headers = new Headers(res.headers);
	for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v);
	return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

function json(data: unknown, status = 200): Response {
	return withCors(
		new Response(JSON.stringify(data), {
			status,
			headers: { "content-type": "application/json; charset=utf-8" },
		})
	);
}

/** Traite une requête MCP de façon stateless (serveur + transport neufs, fermés à la fin). */
async function handleMcp(req: Request): Promise<Response> {
	const server = buildServer();
	const transport = new WebStandardStreamableHTTPServerTransport({
		sessionIdGenerator: undefined, // sans session : n'importe quel nœud, pas de Mcp-Session-Id
		enableJsonResponse: true, // réponse JSON bufferisée (pas de flux SSE) → simple et robuste
	});
	try {
		await server.connect(transport);
		const res = await transport.handleRequest(req);
		return withCors(res);
	} finally {
		// enableJsonResponse → réponse déjà bufferisée : fermeture immédiate sûre.
		await transport.close().catch(() => {});
		await server.close().catch(() => {});
	}
}

function landingPage(): Response {
	const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Shenron MCP — RAG & API Dragon Ball</title>
<style>
 :root{color-scheme:dark}
 body{margin:0;font:16px/1.6 system-ui,sans-serif;background:#0b0d12;color:#e7e9ee;padding:2rem;max-width:880px;margin-inline:auto}
 h1{font-size:1.7rem;margin:0 0 .25rem}h2{margin-top:2rem;font-size:1.15rem;color:#ffb347}
 code,pre{font-family:ui-monospace,monospace}code{background:#1b1f2a;padding:.1em .35em;border-radius:4px}
 pre{background:#141821;padding:1rem;border-radius:8px;overflow:auto;border:1px solid #232838}
 a{color:#7cc4ff}.tag{display:inline-block;background:#1b1f2a;border:1px solid #2a3040;border-radius:999px;padding:.1rem .6rem;margin:.15rem;font-size:.85rem}
 .muted{color:#9aa3b2;font-size:.92rem}
</style></head><body>
<h1>🐉 Shenron MCP</h1>
<p class="muted">Serveur <strong>MCP public</strong> (Streamable HTTP, lecture seule) exposant le RAG et l'API publique Dragon&nbsp;Ball de <a href="https://dragonballfr.com">dragonballfr.com</a>. Sans authentification.</p>
<h2>Endpoint</h2>
<pre>${PUBLIC_URL}/mcp</pre>
<p class="muted">Transport : MCP Streamable HTTP, sans état, auth <code>none</code>. Sonde : <a href="/health">/health</a>.</p>
<h2>Outils (${TOOL_NAMES.length})</h2>
<p>${TOOL_NAMES.map((t) => `<span class="tag">${t}</span>`).join("")}</p>
<h2>Connexion</h2>
<p><strong>Claude</strong> (web / desktop) : Réglages → Connecteurs → Ajouter un connecteur personnalisé → URL <code>${PUBLIC_URL}/mcp</code>, authentification « Aucune ».</p>
<p><strong>Claude Code</strong> : <code>claude mcp add --transport http shenron ${PUBLIC_URL}/mcp</code></p>
<p><strong>Gemini / Grok / autres clients MCP</strong> : ajouter un serveur MCP distant de type <em>Streamable HTTP</em> pointant <code>${PUBLIC_URL}/mcp</code> (sans en-tête d'auth).</p>
<p><strong>Ollama</strong> (via un bridge MCP type <code>mcphost</code> / Open WebUI) : déclarer un serveur HTTP <code>${PUBLIC_URL}/mcp</code>.</p>
<p class="muted">Toutes les données sont déjà publiques et servies par <code>bot.dragonballfr.com/api/public</code>. Aucun écrit, aucun secret.</p>
</body></html>`;
	return withCors(
		new Response(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8" } })
	);
}

const server = Bun.serve({
	port: PORT,
	hostname: HOST,
	idleTimeout: 120, // tolère les générations longues (rag_ask)
	async fetch(req) {
		const url = new URL(req.url);

		if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });

		if (url.pathname === "/mcp") {
			try {
				return await handleMcp(req);
			} catch (err) {
				console.error("[mcp] erreur handleRequest:", err);
				return json(
					{ jsonrpc: "2.0", error: { code: -32603, message: "Erreur interne du serveur MCP" }, id: null },
					500
				);
			}
		}

		if (url.pathname === "/health" || url.pathname === "/healthz") {
			let upstream = "unknown";
			try {
				const r = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2500) });
				upstream = r.ok ? "ok" : `http_${r.status}`;
			} catch {
				upstream = "unreachable";
			}
			return json({ status: "ok", server: SERVER_NAME, version: VERSION, tools: TOOL_NAMES.length, upstream });
		}

		if (url.pathname === "/" || url.pathname === "/index.html") return landingPage();
		if (url.pathname === "/favicon.ico") return new Response(null, { status: 204 });

		return json({ error: "not_found", hint: "Endpoint MCP : POST /mcp" }, 404);
	},
});

console.log(`[mcp] Shenron MCP v${VERSION} — http://${server.hostname}:${server.port}/mcp`);
console.log(`[mcp] upstream API: ${API_BASE} — ${TOOL_NAMES.length} outils — public: ${PUBLIC_URL}/mcp`);
