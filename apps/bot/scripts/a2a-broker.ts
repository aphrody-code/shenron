#!/usr/bin/env bun
/**
 * Bridge A2A Unix socket — variante low-latency du endpoint HTTP /api/a2a/*
 * pour les agents tournant sur le même host. Sert exactement le même payload
 * JSON-RPC 2.0 mais via Unix domain socket → 0 hop réseau, <0.5ms RTT typique.
 *
 * Lancement :
 *   bun scripts/a2a-broker.ts &
 *
 * Test côté client :
 *   curl --unix-socket /tmp/dbfr-a2a.sock http://localhost/.well-known/agent-card.json
 *   curl --unix-socket /tmp/dbfr-a2a.sock -X POST http://localhost/jsonrpc \
 *     -H 'Content-Type: application/json' \
 *     -d '{"jsonrpc":"2.0","id":1,"method":"message/send","params":{"message":{"messageId":"x","role":"user","kind":"message","parts":[{"kind":"text","text":"ping"}]}}}'
 *
 * Le socket file est créé en mode 0666 pour que les 2 agents y accèdent.
 */
import { existsSync, unlinkSync, chmodSync, appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const SOCKET = process.env.A2A_SOCKET ?? "/tmp/dbfr-a2a.sock";
const COORD_DIR =
	process.env.COORD_DIR ??
	`${process.cwd().replace(/\/apps\/bot\/?$/, "")}/.coord`;
const MESSAGES = `${COORD_DIR}/messages.jsonl`;
const TASKS = `${COORD_DIR}/tasks.json`;
const LOCK = "/tmp/dbfr-tasks.lock";

if (existsSync(SOCKET)) unlinkSync(SOCKET);

const subs = new Set<(e: unknown) => void>();
const broadcast = (e: unknown) => {
	for (const sub of subs) {
		try {
			sub(e);
		} catch {
			/* sub closed mid-iteration */
		}
	}
};

function appendMessage(msg: Record<string, unknown>): void {
	// Append-only avec flock pour cohérence avec le bot principal et MCP server
	const code = `flock ${LOCK}-msg bash -c 'cat >> ${MESSAGES}'`;
	const out = spawnSync("bash", ["-c", code], {
		input: JSON.stringify(msg) + "\n",
		encoding: "utf-8",
	});
	if (out.status !== 0) throw new Error(out.stderr);
}

function readTasks(): { tasks: any[] } {
	const f = Bun.file(TASKS);
	// Sync read OK ici — le broker n'est pas hot path
	return JSON.parse(spawnSync("cat", [TASKS]).stdout.toString()) as {
		tasks: any[];
	};
}

function rpcError(id: unknown, code: number, message: string) {
	return Response.json({ jsonrpc: "2.0", id, error: { code, message } });
}

function sseStream(): ReadableStream {
	let cleanup: (() => void) | null = null;
	return new ReadableStream({
		start(controller) {
			const enc = new TextEncoder();
			const sub = (e: unknown) => {
				try {
					controller.enqueue(enc.encode(`data: ${JSON.stringify(e)}\n\n`));
				} catch {
					cleanup?.();
				}
			};
			subs.add(sub);
			const ping = setInterval(() => {
				try {
					controller.enqueue(enc.encode(`: ping\n\n`));
				} catch {
					cleanup?.();
				}
			}, 30_000);
			cleanup = () => {
				subs.delete(sub);
				clearInterval(ping);
			};
			controller.enqueue(
				enc.encode(
					`data: ${JSON.stringify({ kind: "ready", ts: new Date().toISOString() })}\n\n`,
				),
			);
		},
		cancel() {
			cleanup?.();
		},
	});
}

const server = Bun.serve({
	unix: SOCKET,
	async fetch(req) {
		const url = new URL(req.url);

		if (url.pathname === "/.well-known/agent-card.json") {
			return Response.json({
				name: "shenron-coord-unix",
				description: "Bridge A2A via Unix socket (low-latency)",
				version: "1.0.0",
				protocolVersion: "0.3.0",
				url: `unix://${SOCKET}/jsonrpc`,
				capabilities: { streaming: true, pushNotifications: false },
				defaultInputModes: ["text"],
				defaultOutputModes: ["text"],
			});
		}

		if (url.pathname === "/events") {
			return new Response(sseStream(), {
				headers: {
					"Content-Type": "text/event-stream",
					"Cache-Control": "no-cache",
				},
			});
		}

		if (url.pathname !== "/jsonrpc" || req.method !== "POST") {
			return new Response("Not Found", { status: 404 });
		}

		let body: any;
		try {
			body = await req.json();
		} catch {
			return rpcError(null, -32700, "Parse error");
		}
		const { id = null, method, params } = body ?? {};

		try {
			switch (method) {
				case "message/send": {
					const incoming = params?.message;
					if (!incoming?.parts?.length)
						return rpcError(id, -32602, "parts required");
					const text = incoming.parts
						.filter((p: any) => p.kind === "text")
						.map((p: any) => p.text)
						.join("\n");
					const msg = {
						id: incoming.messageId ?? crypto.randomUUID(),
						from: incoming.role === "agent" ? "agent" : "user",
						to: params.to ?? "all",
						type: "request",
						contextId: incoming.contextId ?? null,
						content: text,
						ts: new Date().toISOString(),
					};
					appendMessage(msg);
					broadcast({ kind: "message", message: msg });
					return Response.json({
						jsonrpc: "2.0",
						id,
						result: {
							kind: "message",
							messageId: msg.id,
							role: "agent",
							parts: [{ kind: "text", text: "ack" }],
							contextId: msg.contextId,
						},
					});
				}
				case "message/stream":
					return new Response(sseStream(), {
						headers: {
							"Content-Type": "text/event-stream",
							"Cache-Control": "no-cache",
						},
					});
				case "tasks/list": {
					const { tasks } = readTasks();
					const filtered = tasks.filter((t: any) => {
						if (params?.status && t.status !== params.status) return false;
						if (params?.agent && t.agent !== params.agent) return false;
						return true;
					});
					return Response.json({
						jsonrpc: "2.0",
						id,
						result: { tasks: filtered },
					});
				}
				case "tasks/get": {
					const { tasks } = readTasks();
					return Response.json({
						jsonrpc: "2.0",
						id,
						result: tasks.find((t: any) => t.id === params?.id) ?? null,
					});
				}
				case "ping":
					return Response.json({ jsonrpc: "2.0", id, result: { pong: true } });
				default:
					return rpcError(id, -32601, `Method not found: ${method}`);
			}
		} catch (e: any) {
			return rpcError(id, -32000, e?.message ?? "Internal error");
		}
	},
});

// Permissions socket 0666 — les 2 agents (Claude + Gemini) doivent pouvoir l'ouvrir
try {
	chmodSync(SOCKET, 0o666);
} catch (e) {
	console.error("chmod socket failed:", e);
}

console.error(`[a2a-broker] listening on unix:${SOCKET}`);

// Boucle de keep-alive : sinon Bun ferme le process quand le main termine
await new Promise(() => {});
