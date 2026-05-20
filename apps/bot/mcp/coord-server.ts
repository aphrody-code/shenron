#!/usr/bin/env bun
/**
 * MCP server "coord" — canal de communication Claude Code ↔ Gemini CLI.
 *
 * Expose des tools + resources sur stdio JSON-RPC 2.0 (newline-delimited).
 * Backé par les fichiers de `.coord/` (tasks.json, memory/, docs/, messages.jsonl).
 *
 * Spec : https://spec.modelcontextprotocol.io/
 *
 * Registrer :
 *   Gemini  : gemini mcp add coord stdio "$BUN" /home/ubuntu/vps/apps/shenron/mcp/coord-server.ts
 *   Claude  : claude mcp add coord stdio bun /home/ubuntu/vps/apps/shenron/mcp/coord-server.ts
 *
 * Logs : stderr (stdout est réservé aux messages JSON-RPC).
 */
import {
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
	readdirSync,
	statSync,
} from "node:fs";
import { join, basename } from "node:path";
import { spawnSync } from "node:child_process";

const COORD_DIR =
	Bun.env.COORD_DIR ?? "/home/ubuntu/vps/apps/shenron/.coord";
const TASKS_FILE = join(COORD_DIR, "tasks.json");
const MESSAGES_FILE = join(COORD_DIR, "messages.jsonl");
const MEMORY_DIR = join(COORD_DIR, "memory");
const DOCS_DIR = join(COORD_DIR, "docs");
const LOCK_FILE = "/tmp/dbfr-tasks.lock";

// Identité de l'agent — passe via env `COORD_AGENT` ou par défaut `unknown`.
// Utilisée pour stamper les messages envoyés (`from`).
const AGENT_ID = Bun.env.COORD_AGENT ?? "unknown";

const log = (...args: unknown[]) =>
	Bun.stderr.write(`[coord-mcp] ${args.map(String).join(" ")}\n`);

if (!existsSync(COORD_DIR)) mkdirSync(COORD_DIR, { recursive: true });
if (!existsSync(MEMORY_DIR)) mkdirSync(MEMORY_DIR, { recursive: true });
if (!existsSync(DOCS_DIR)) mkdirSync(DOCS_DIR, { recursive: true });
if (!existsSync(MESSAGES_FILE)) writeFileSync(MESSAGES_FILE, "");

// ── Utils : lock atomique pour tasks.json (compat avec scripts bash flock) ────
function withTasksLock<T>(fn: (data: { tasks: unknown[] }) => T): T {
	// `flock` côté shell garantit la cohérence entre process MCP + scripts bash.
	// On lit + mute + écrit dans un seul appel atomique.
	const code = `
		flock ${LOCK_FILE} cat ${TASKS_FILE}
	`.trim();
	const out = spawnSync("bash", ["-c", code], { encoding: "utf-8" });
	if (out.status !== 0)
		throw new Error(`tasks.json read failed: ${out.stderr}`);
	const data = JSON.parse(out.stdout) as { tasks: unknown[] };
	const result = fn(data);
	// Réécrit (encore sous lock)
	const json = JSON.stringify(data, null, 2);
	const writeCode = `flock ${LOCK_FILE} bash -c 'cat > ${TASKS_FILE}'`;
	const w = spawnSync("bash", ["-c", writeCode], {
		input: json,
		encoding: "utf-8",
	});
	if (w.status !== 0) throw new Error(`tasks.json write failed: ${w.stderr}`);
	return result;
}

function readTasks(): { tasks: any[] } {
	if (!existsSync(TASKS_FILE)) return { tasks: [] };
	return JSON.parse(readFileSync(TASKS_FILE, "utf-8")) as { tasks: any[] };
}

function memoryPath(scope: string): string {
	const safe = scope.replace(/[^a-z0-9_-]/gi, "");
	if (!safe) throw new Error("scope invalide");
	return join(MEMORY_DIR, `${safe}.md`);
}

function docPath(name: string): string {
	const safe = name.replace(/[^a-z0-9_./-]/gi, "");
	if (!safe || safe.includes("..")) throw new Error("name invalide");
	const file = safe.endsWith(".md") ? safe : `${safe}.md`;
	return join(DOCS_DIR, file);
}

// ── Tools schema ─────────────────────────────────────────────────────────
const TOOLS = [
	{
		name: "list_tasks",
		description:
			"Liste les tasks du sprint (.coord/tasks.json). Filtre optionnel par status (pending/in_progress/done/blocked) ou agent (claude/gemini).",
		inputSchema: {
			type: "object",
			properties: {
				status: {
					type: "string",
					enum: ["pending", "in_progress", "done", "blocked"],
				},
				agent: { type: "string", enum: ["claude", "gemini"] },
			},
		},
	},
	{
		name: "get_task",
		description: "Détail d'une task par id.",
		inputSchema: {
			type: "object",
			properties: { id: { type: "string" } },
			required: ["id"],
		},
	},
	{
		name: "claim_task",
		description:
			"Atomic claim d'une task pending → in_progress. Marque agent_pid + started_at. Renvoie la task mise à jour ou null si déjà claimée.",
		inputSchema: {
			type: "object",
			properties: { id: { type: "string" } },
			required: ["id"],
		},
	},
	{
		name: "complete_task",
		description: "Marque une task en done avec commit_hash + finished_at.",
		inputSchema: {
			type: "object",
			properties: { id: { type: "string" }, commit_hash: { type: "string" } },
			required: ["id", "commit_hash"],
		},
	},
	{
		name: "block_task",
		description: "Marque une task bloquée avec une raison (1 ligne).",
		inputSchema: {
			type: "object",
			properties: { id: { type: "string" }, blocker: { type: "string" } },
			required: ["id", "blocker"],
		},
	},
	{
		name: "send_message",
		description:
			"Envoie un message à l'autre agent. Append-only dans messages.jsonl. type optionnel : 'info' (default), 'request', 'response', 'event'.",
		inputSchema: {
			type: "object",
			properties: {
				to: { type: "string", enum: ["claude", "gemini", "all"] },
				content: { type: "string" },
				type: {
					type: "string",
					enum: ["info", "request", "response", "event"],
				},
				contextId: {
					type: "string",
					description: "Lien à un thread, optionnel",
				},
			},
			required: ["to", "content"],
		},
	},
	{
		name: "read_messages",
		description:
			"Lit les messages reçus. Par défaut : derniers 50, filtré sur to=agent courant ou to=all.",
		inputSchema: {
			type: "object",
			properties: {
				from: { type: "string" },
				since: {
					type: "string",
					description: "ISO timestamp ; ne renvoie que les plus récents.",
				},
				limit: { type: "number", default: 50 },
				includeAll: {
					type: "boolean",
					default: true,
					description: "Inclure les broadcasts (to=all).",
				},
			},
		},
	},
	{
		name: "read_memory",
		description:
			"Lit la mémoire partagée (.coord/memory/<scope>.md). Scopes : 'shared' (commun), 'claude' (notes Claude visibles par Gemini), 'gemini' (notes Gemini visibles par Claude).",
		inputSchema: {
			type: "object",
			properties: {
				scope: { type: "string", enum: ["shared", "claude", "gemini"] },
			},
			required: ["scope"],
		},
	},
	{
		name: "write_memory",
		description:
			"Écrit ou append dans la mémoire d'un scope. mode='replace' réécrit tout, 'append' ajoute à la fin.",
		inputSchema: {
			type: "object",
			properties: {
				scope: { type: "string", enum: ["shared", "claude", "gemini"] },
				content: { type: "string" },
				mode: {
					type: "string",
					enum: ["replace", "append"],
					default: "append",
				},
			},
			required: ["scope", "content"],
		},
	},
	{
		name: "list_docs",
		description: "Liste les fichiers de .coord/docs/.",
		inputSchema: { type: "object", properties: {} },
	},
	{
		name: "read_doc",
		description: "Lit un doc partagé (.coord/docs/<name>.md).",
		inputSchema: {
			type: "object",
			properties: { name: { type: "string" } },
			required: ["name"],
		},
	},
	{
		name: "write_doc",
		description:
			"Écrit un doc partagé. Crée ou remplace .coord/docs/<name>.md.",
		inputSchema: {
			type: "object",
			properties: { name: { type: "string" }, content: { type: "string" } },
			required: ["name", "content"],
		},
	},
];

const RESOURCES = [
	{
		uri: "coord://tasks",
		name: "tasks",
		description: "Backlog sprint complet",
		mimeType: "application/json",
	},
	{
		uri: "coord://memory/shared",
		name: "memory/shared",
		description: "Mémoire partagée",
		mimeType: "text/markdown",
	},
	{
		uri: "coord://memory/claude",
		name: "memory/claude",
		description: "Notes Claude visibles par Gemini",
		mimeType: "text/markdown",
	},
	{
		uri: "coord://memory/gemini",
		name: "memory/gemini",
		description: "Notes Gemini visibles par Claude",
		mimeType: "text/markdown",
	},
	{
		uri: "coord://messages",
		name: "messages",
		description: "Journal des messages inter-agents",
		mimeType: "application/x-ndjson",
	},
];

// ── Handlers ──────────────────────────────────────────────────────────────
function handleToolsCall(name: string, args: any): any {
	switch (name) {
		case "list_tasks": {
			const { tasks } = readTasks();
			const filtered = tasks.filter((t: any) => {
				if (args?.status && t.status !== args.status) return false;
				if (args?.agent && t.agent !== args.agent) return false;
				return true;
			});
			return {
				content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
			};
		}
		case "get_task": {
			const { tasks } = readTasks();
			const t = tasks.find((x: any) => x.id === args.id);
			return {
				content: [{ type: "text", text: JSON.stringify(t ?? null, null, 2) }],
			};
		}
		case "claim_task": {
			const out = withTasksLock((data) => {
				const t = data.tasks.find((x: any) => x.id === args.id) as any;
				if (!t) return null;
				if (t.status !== "pending") return { conflict: true, task: t };
				t.status = "in_progress";
				t.agent_pid = String(Bun.ppid ?? Bun.pid);
				t.started_at = new Date().toISOString();
				return { task: t };
			});
			return {
				content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
			};
		}
		case "complete_task": {
			const out = withTasksLock((data) => {
				const t = data.tasks.find((x: any) => x.id === args.id) as any;
				if (!t) return null;
				t.status = "done";
				t.commit_hash = args.commit_hash;
				t.finished_at = new Date().toISOString();
				return { task: t };
			});
			return {
				content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
			};
		}
		case "block_task": {
			const out = withTasksLock((data) => {
				const t = data.tasks.find((x: any) => x.id === args.id) as any;
				if (!t) return null;
				t.status = "blocked";
				t.blocker = args.blocker;
				return { task: t };
			});
			return {
				content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
			};
		}
		case "send_message": {
			const msg = {
				id: crypto.randomUUID(),
				from: AGENT_ID,
				to: args.to,
				type: args.type ?? "info",
				contextId: args.contextId ?? null,
				content: args.content,
				ts: new Date().toISOString(),
			};
			// Append atomique via flock
			const code = `flock ${LOCK_FILE}-msg bash -c 'cat >> ${MESSAGES_FILE}'`;
			const w = spawnSync("bash", ["-c", code], {
				input: JSON.stringify(msg) + "\n",
				encoding: "utf-8",
			});
			if (w.status !== 0) throw new Error(`message write failed: ${w.stderr}`);
			return { content: [{ type: "text", text: JSON.stringify(msg) }] };
		}
		case "read_messages": {
			const lines = readFileSync(MESSAGES_FILE, "utf-8")
				.split("\n")
				.filter(Boolean);
			let msgs: any[] = [];
			for (const l of lines) {
				try {
					msgs.push(JSON.parse(l));
				} catch {
					/* skip malformed */
				}
			}
			// Filtre : par défaut tout ce qui m'est destiné (to=AGENT_ID ou to=all)
			const includeAll = args?.includeAll !== false;
			msgs = msgs.filter((m) => {
				if (m.to === AGENT_ID) return true;
				if (includeAll && m.to === "all") return true;
				if (args?.from && m.from === args.from) return true;
				return false;
			});
			if (args?.since) {
				msgs = msgs.filter((m) => m.ts > args.since);
			}
			const limit = Math.min(args?.limit ?? 50, 500);
			msgs = msgs.slice(-limit);
			return {
				content: [{ type: "text", text: JSON.stringify(msgs, null, 2) }],
			};
		}
		case "read_memory": {
			const p = memoryPath(args.scope);
			const content = existsSync(p) ? readFileSync(p, "utf-8") : "";
			return { content: [{ type: "text", text: content }] };
		}
		case "write_memory": {
			const p = memoryPath(args.scope);
			const mode = args.mode ?? "append";
			if (mode === "append") {
				const sep = existsSync(p) && statSync(p).size > 0 ? "\n\n" : "";
				const old = existsSync(p) ? readFileSync(p, "utf-8") : "";
				writeFileSync(p, old + sep + args.content);
			} else {
				writeFileSync(p, args.content);
			}
			return { content: [{ type: "text", text: `OK (${mode})` }] };
		}
		case "list_docs": {
			if (!existsSync(DOCS_DIR))
				return { content: [{ type: "text", text: "[]" }] };
			const list = readdirSync(DOCS_DIR)
				.filter((f) => f.endsWith(".md"))
				.map((f) => basename(f, ".md"));
			return { content: [{ type: "text", text: JSON.stringify(list) }] };
		}
		case "read_doc": {
			const p = docPath(args.name);
			if (!existsSync(p)) throw new Error(`Doc inconnu: ${args.name}`);
			return { content: [{ type: "text", text: readFileSync(p, "utf-8") }] };
		}
		case "write_doc": {
			const p = docPath(args.name);
			writeFileSync(p, args.content);
			return { content: [{ type: "text", text: `OK ${p}` }] };
		}
		default:
			throw new Error(`Unknown tool: ${name}`);
	}
}

function handleResourcesRead(uri: string): any {
	if (uri === "coord://tasks") {
		return {
			contents: [
				{
					uri,
					mimeType: "application/json",
					text: readFileSync(TASKS_FILE, "utf-8"),
				},
			],
		};
	}
	if (uri.startsWith("coord://memory/")) {
		const scope = uri.slice("coord://memory/".length);
		const p = memoryPath(scope);
		const text = existsSync(p) ? readFileSync(p, "utf-8") : "";
		return { contents: [{ uri, mimeType: "text/markdown", text }] };
	}
	if (uri === "coord://messages") {
		return {
			contents: [
				{
					uri,
					mimeType: "application/x-ndjson",
					text: readFileSync(MESSAGES_FILE, "utf-8"),
				},
			],
		};
	}
	if (uri.startsWith("coord://docs/")) {
		const name = uri.slice("coord://docs/".length);
		const p = docPath(name);
		if (!existsSync(p)) throw new Error(`Resource inconnu: ${uri}`);
		return {
			contents: [
				{ uri, mimeType: "text/markdown", text: readFileSync(p, "utf-8") },
			],
		};
	}
	throw new Error(`URI inconnu: ${uri}`);
}

// ── JSON-RPC loop sur stdio ──────────────────────────────────────────────
type JsonRpcReq = {
	jsonrpc: "2.0";
	id?: string | number;
	method: string;
	params?: any;
};
type JsonRpcResp = {
	jsonrpc: "2.0";
	id: string | number | null;
	result?: any;
	error?: { code: number; message: string };
};

function handle(req: JsonRpcReq): JsonRpcResp | null {
	const id = req.id ?? null;
	try {
		switch (req.method) {
			case "initialize":
				return {
					jsonrpc: "2.0",
					id: id!,
					result: {
						protocolVersion: "2024-11-05",
						capabilities: { tools: {}, resources: { subscribe: false } },
						serverInfo: { name: "coord", version: "1.0.0" },
					},
				};
			case "notifications/initialized":
			case "notifications/cancelled":
				return null; // notification — pas de réponse
			case "tools/list":
				return { jsonrpc: "2.0", id: id!, result: { tools: TOOLS } };
			case "tools/call": {
				const result = handleToolsCall(
					req.params.name,
					req.params.arguments ?? {},
				);
				return { jsonrpc: "2.0", id: id!, result };
			}
			case "resources/list":
				return { jsonrpc: "2.0", id: id!, result: { resources: RESOURCES } };
			case "resources/read": {
				const result = handleResourcesRead(req.params.uri);
				return { jsonrpc: "2.0", id: id!, result };
			}
			case "ping":
				return { jsonrpc: "2.0", id: id!, result: {} };
			default:
				return {
					jsonrpc: "2.0",
					id,
					error: { code: -32601, message: `Method not found: ${req.method}` },
				};
		}
	} catch (e: any) {
		log("error", req.method, e?.message ?? e);
		return {
			jsonrpc: "2.0",
			id,
			error: { code: -32000, message: e?.message ?? String(e) },
		};
	}
}

async function main() {
	log("started", "agent=" + AGENT_ID, "coord=" + COORD_DIR);
	const decoder = new TextDecoder();
	let buf = "";
	for await (const chunk of Bun.stdin.stream()) {
		buf += decoder.decode(chunk, { stream: true });
		let nl = buf.indexOf("\n");
		while (nl !== -1) {
			const line = buf.slice(0, nl).trim();
			buf = buf.slice(nl + 1);
			if (line) {
				let req: JsonRpcReq;
				try {
					req = JSON.parse(line) as JsonRpcReq;
				} catch (e) {
					log("parse-error", e);
					nl = buf.indexOf("\n");
					continue;
				}
				const resp = handle(req);
				if (resp) {
					Bun.stdout.write(JSON.stringify(resp) + "\n");
				}
			}
			nl = buf.indexOf("\n");
		}
	}
}

main().catch((e) => {
	log("fatal", e);
	process.exit(1);
});
