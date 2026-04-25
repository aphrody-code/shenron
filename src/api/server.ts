import { singleton, inject, container } from "tsyringe";
import { Client } from "@rpbey/discordx";
import { env } from "~/lib/env";
import { logger } from "~/lib/logger";
import { StatsService } from "~/services/StatsService";
import { checkAdmin, constantTimeEqual } from "./auth";
import {
	createSession,
	verifySession,
	readCookie,
	buildSessionCookie,
	buildLogoutCookie,
} from "./session";
import { CronRegistry } from "./cron-registry";
// HTML import — Bun.serve bundle automatiquement scripts/CSS référencés.
// Le HTML doit être au root du package pour que les chunks soient générés à la racine.
import dashboardHtml from "../../dashboard.html";

// Helper pour servir un fichier statique du dossier `public/` avec content-type
// inféré + cache long (les favicons ont un hash via le manifest, donc immutable
// est OK pour 1 jour ; pas besoin de versioning).
function staticFile(path: string, contentType: string) {
	return () => {
		const file = Bun.file(path);
		return new Response(file as unknown as BodyInit, {
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=86400",
			},
		});
	};
}
import {
	TABLES,
	getTableSpec,
	listRows,
	getRow,
	insertRow,
	updateRow,
	deleteRow,
} from "./db-tables";
import { findAction, listServiceActions, SERVICE_ACTIONS } from "./service-registry";

/**
 * API REST tscord-compatible — `Bun.serve` natif, full read/write.
 *
 * Surface :
 *
 *   PUBLIC
 *     GET  /health/check         online + uptime + version
 *     GET  /health/latency       ws + db
 *     GET  /                     ping + liens docs
 *     GET  /openapi              OpenAPI 3.0.1 spec
 *
 *   ADMIN (Bearer API_ADMIN_TOKEN requis)
 *     GET  /health/usage         pid CPU/mem
 *     GET  /health/host          host CPU/mem
 *     GET  /health/monitoring    aggregate
 *     GET  /health/logs          journalctl -u shenron, JSON parsé
 *
 *     GET  /stats/totals         users/guilds/commands
 *     GET  /stats/interaction/last
 *     GET  /stats/guilds/last
 *
 *     GET  /bot/guilds           liste guilds
 *     GET  /bot/commands         slash commands enregistrées (full schema)
 *     GET  /bot/commands/:name   détails d'une commande
 *
 *     GET  /cron                 liste des jobs périodiques (last/next run, errors)
 *     POST /cron/:name/trigger   trigger manuel
 *
 *     GET  /services             liste des services + actions exposables
 *     POST /services/:service/:action  exécute une action whitelist
 *
 *     GET  /database/tables                  liste les tables CRUD-able
 *     GET  /database/:table?limit&offset     pagination
 *     POST /database/:table                  insert
 *     GET  /database/:table/:id              get one
 *     PUT  /database/:table/:id              update (mutableColumns whitelist)
 *     DELETE /database/:table/:id            delete
 *
 * Bind par défaut sur 127.0.0.1:5006. Auth bearer via `API_ADMIN_TOKEN` env.
 * Compatible avec un dashboard fork de `barthofu/tscord-dashboard`.
 */
@singleton()
export class ApiServer {
	private server: ReturnType<typeof Bun.serve> | null = null;

	constructor(@inject(StatsService) private stats: StatsService) {}

	start(): void {
		if (!env.API_ENABLED) {
			logger.info("API REST désactivée (API_ENABLED=false)");
			return;
		}
		if (this.server) {
			logger.warn("API REST déjà démarrée");
			return;
		}

		this.server = Bun.serve({
			port: env.API_PORT,
			hostname: env.API_HOST,
			development: false,

			routes: {
				// ── Dashboard SPA (HTML imports — Bun bundle scripts/CSS) ─────
				"/": dashboardHtml,
				"/login": dashboardHtml,
				"/bot": dashboardHtml,
				"/cron": dashboardHtml,
				"/services": dashboardHtml,
				"/database": dashboardHtml,
				"/database/:table": dashboardHtml,
				"/database/:table/:id": dashboardHtml,
				"/stats": dashboardHtml,
				"/audit": dashboardHtml,
				"/logs": dashboardHtml,
				"/settings": dashboardHtml,

				// ── Static assets (favicons + manifest) ───────────────────────
				"/favicon.ico": staticFile("public/favicon.ico", "image/x-icon"),
				"/favicon-16.png": staticFile("public/favicon-16.png", "image/png"),
				"/favicon-32.png": staticFile("public/favicon-32.png", "image/png"),
				"/favicon-48.png": staticFile("public/favicon-48.png", "image/png"),
				"/favicon-96.png": staticFile("public/favicon-96.png", "image/png"),
				"/apple-touch-icon.png": staticFile("public/apple-touch-icon.png", "image/png"),
				"/icon-192.png": staticFile("public/icon-192.png", "image/png"),
				"/icon-512.png": staticFile("public/icon-512.png", "image/png"),
				"/manifest.webmanifest": staticFile("public/manifest.webmanifest", "application/manifest+json"),

				// ── Auth (cookie session pour SPA) ────────────────────────────
				"/auth/me": async (req) => {
					const sessionCookie = readCookie(req, "shenron_session");
					const session = await verifySession(sessionCookie);
					return Response.json({ authenticated: !!session });
				},
				"/auth/login": {
					POST: async (req) => {
						if (!env.API_ADMIN_TOKEN) {
							return Response.json({ error: "API_ADMIN_TOKEN non configuré" }, { status: 503 });
						}
						const body = (await req.json().catch(() => null)) as { token?: string } | null;
						if (!body?.token || !constantTimeEqual(body.token, env.API_ADMIN_TOKEN)) {
							return Response.json({ error: "Token invalide" }, { status: 401 });
						}
						const session = await createSession();
						return new Response(JSON.stringify({ ok: true }), {
							status: 200,
							headers: {
								"Content-Type": "application/json",
								"Set-Cookie": buildSessionCookie(session),
							},
						});
					},
				},
				"/auth/logout": {
					POST: () =>
						new Response(JSON.stringify({ ok: true }), {
							status: 200,
							headers: {
								"Content-Type": "application/json",
								"Set-Cookie": buildLogoutCookie(),
							},
						}),
				},

				// ── Public API ────────────────────────────────────────────────
				"/api": () =>
					Response.json({
						name: "shenron-api",
						version: "0.1.0",
						compatible: "tscord controllers (barthofu/tscord-dashboard)",
						endpoints: { docs: "/openapi", health: "/api/health/check" },
					}),
				"/openapi": () => Response.json(buildOpenApiSpec(env.API_PORT)),
				"/api/health/check": () => {
					const client = container.resolve(Client);
					return Response.json({
						online: client.isReady(),
						uptime: client.uptime,
						version: process.env.npm_package_version ?? "0.1.0",
					});
				},
				"/api/health/latency": () => Response.json(this.stats.getLatency()),

				// ── Health admin ──────────────────────────────────────────────
				"/api/health/usage": admin(async () => Response.json(await this.stats.getPidUsage())),
				"/api/health/host": admin(async () => Response.json(await this.stats.getHostUsage())),
				"/api/health/monitoring": admin(async () => {
					const client = container.resolve(Client);
					return Response.json({
						botStatus: { online: client.isReady(), uptime: client.uptime },
						pid: await this.stats.getPidUsage(),
						host: await this.stats.getHostUsage(),
						latency: this.stats.getLatency(),
					});
				}),
				"/api/health/logs": admin(async (req) => {
					// Lecture des derniers logs via journalctl (le service systemd
					// `shenron.service` envoie tout sur stdout/stderr → journald).
					// Format JSON natif pour parser facilement.
					const url = new URL(req.url);
					const lines = Math.min(500, Number(url.searchParams.get("lines")) || 100);
					try {
						const proc = Bun.spawn(
							[
								"journalctl",
								"-u",
								"shenron",
								"-n",
								String(lines),
								"--output=short-iso",
								"--no-pager",
								"--reverse",
							],
							{ stdout: "pipe", stderr: "pipe" },
						);
						const text = await new Response(proc.stdout).text();
						await proc.exited;
						const logs = text
							.split("\n")
							.filter((line) => line.trim() && !line.startsWith("--"))
							.map((line) => {
								const m = line.match(/^(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/);
								if (!m) return { raw: line };
								return { time: m[1], host: m[2], unit: m[3], message: m[4] };
							});
						return Response.json({ logs, count: logs.length });
					} catch (err) {
						return Response.json(
							{
								error: "journalctl indisponible",
								message: err instanceof Error ? err.message : String(err),
							},
							{ status: 500 },
						);
					}
				}),

				// ── Stats ─────────────────────────────────────────────────────
				"/api/stats/totals": admin(async () =>
					Response.json({ stats: await this.stats.getTotalStats() }),
				),
				"/api/stats/interaction/last": admin(async () =>
					Response.json(await this.stats.getLastInteraction()),
				),
				"/api/stats/guilds/last": admin(() => Response.json(this.stats.getLastGuildAdded())),

				// ── Bot ───────────────────────────────────────────────────────
				"/api/bot/guilds": admin(() => {
					const client = container.resolve(Client);
					const guilds = [...client.guilds.cache.values()].map((g) => ({
						id: g.id,
						name: g.name,
						memberCount: g.memberCount,
						iconUrl: g.iconURL({ size: 256 }),
						joinedAt: g.joinedTimestamp ? new Date(g.joinedTimestamp).toISOString() : null,
					}));
					return Response.json({ guilds });
				}),
				"/api/bot/commands": admin(() => {
					const client = container.resolve(Client);
					const commands = (client.applicationCommands ?? []).map((c) => serializeCommand(c));
					return Response.json({ commands, count: commands.length });
				}),
				"/api/bot/commands/:name": admin((req) => {
					const client = container.resolve(Client);
					const found = (client.applicationCommands ?? []).find(
						(c: any) => c.name === req.params.name,
					);
					if (!found) return Response.json({ error: "Commande introuvable" }, { status: 404 });
					return Response.json(serializeCommand(found));
				}),

				// ── Cron ──────────────────────────────────────────────────────
				"/api/cron": admin(() => {
					const cron = container.resolve(CronRegistry);
					return Response.json({ jobs: cron.list() });
				}),
				"/api/cron/:name/trigger": {
					POST: admin(async (req) => {
						const cron = container.resolve(CronRegistry);
						const result = await cron.run(req.params.name);
						return Response.json(result, { status: result.ok ? 200 : 500 });
					}),
				},

				// ── Services ──────────────────────────────────────────────────
				"/api/services": admin(() => Response.json({ actions: listServiceActions() })),
				"/api/services/:service/:action": {
					POST: admin(async (req) => {
						const action = findAction(req.params.service, req.params.action);
						if (!action) return Response.json({ error: "Action inconnue" }, { status: 404 });
						const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
						try {
							const result = await action.handler(body);
							return Response.json({ ok: true, result });
						} catch (err) {
							return Response.json(
								{ ok: false, error: err instanceof Error ? err.message : "erreur" },
								{ status: 400 },
							);
						}
					}),
				},

				// ── Database (CRUD générique whitelist) ───────────────────────
				"/api/database/tables": admin(() =>
					Response.json({
						tables: TABLES.map((t) => ({
							name: t.name,
							pk: t.pk,
							readonly: !!t.readonly,
							mutableColumns: t.mutableColumns ?? [],
							description: t.description ?? null,
						})),
					}),
				),
				"/api/database/:table": {
					GET: admin(async (req) => {
						const spec = getTableSpec(req.params.table);
						if (!spec) return Response.json({ error: "Table inconnue" }, { status: 404 });
						const url = new URL(req.url);
						const limit = Math.min(500, Number(url.searchParams.get("limit")) || 50);
						const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);
						const result = await listRows(spec, limit, offset);
						return Response.json(result);
					}),
					POST: admin(async (req) => {
						const spec = getTableSpec(req.params.table);
						if (!spec) return Response.json({ error: "Table inconnue" }, { status: 404 });
						if (spec.readonly) return Response.json({ error: "Table readonly" }, { status: 403 });
						const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
						if (!body) return Response.json({ error: "JSON body requis" }, { status: 400 });
						try {
							await insertRow(spec, body);
							return Response.json({ ok: true });
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "erreur" },
								{ status: 400 },
							);
						}
					}),
				},
				"/api/database/:table/:id": {
					GET: admin(async (req) => {
						const spec = getTableSpec(req.params.table);
						if (!spec) return Response.json({ error: "Table inconnue" }, { status: 404 });
						const row = await getRow(spec, req.params.id);
						if (!row) return Response.json({ error: "Row introuvable" }, { status: 404 });
						return Response.json(row);
					}),
					PUT: admin(async (req) => {
						const spec = getTableSpec(req.params.table);
						if (!spec) return Response.json({ error: "Table inconnue" }, { status: 404 });
						const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
						if (!body) return Response.json({ error: "JSON body requis" }, { status: 400 });
						try {
							await updateRow(spec, req.params.id, body);
							return Response.json({ ok: true });
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "erreur" },
								{ status: 400 },
							);
						}
					}),
					DELETE: admin(async (req) => {
						const spec = getTableSpec(req.params.table);
						if (!spec) return Response.json({ error: "Table inconnue" }, { status: 404 });
						try {
							await deleteRow(spec, req.params.id);
							return Response.json({ ok: true });
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "erreur" },
								{ status: 400 },
							);
						}
					}),
				},
			},

			fetch() {
				return Response.json({ error: "Not found" }, { status: 404 });
			},

			error(error) {
				logger.error({ err: error }, "API error");
				return Response.json({ error: "Internal server error" }, { status: 500 });
			},
		});

		logger.info(
			{
				port: env.API_PORT,
				host: env.API_HOST,
				adminAuth: !!env.API_ADMIN_TOKEN,
				tables: TABLES.length,
				actions: SERVICE_ACTIONS.length,
			},
			`✓ API REST démarrée sur http://${env.API_HOST}:${env.API_PORT}`,
		);
	}

	async stop(): Promise<void> {
		if (!this.server) return;
		await this.server.stop();
		this.server = null;
	}
}

/** Wrapper qui injecte checkAdmin avant le handler. */
function admin<R extends Request & { params: any }>(
	handler: (req: R) => Response | Promise<Response>,
): (req: R) => Promise<Response> {
	return async (req) => {
		const err = await checkAdmin(req);
		if (err) return err;
		return handler(req);
	};
}

function serializeCommand(cmd: any) {
	return {
		name: cmd.name,
		description: cmd.description,
		type: cmd.type,
		guildId: cmd.guildId ?? null,
		nsfw: cmd.nsfw ?? false,
		options: (cmd.options ?? []).map((o: any) => ({
			name: o.name,
			description: o.description,
			type: o.type,
			required: o.required ?? false,
			choices: o.choices ?? undefined,
		})),
	};
}

function buildOpenApiSpec(port: number) {
	return {
		openapi: "3.0.1",
		info: {
			title: "shenron API",
			version: "0.1.0",
			description: "API REST tscord-compatible pour dashboard. Full read/write sur la DB.",
		},
		servers: [{ url: `http://127.0.0.1:${port}` }],
		paths: {
			"/api/health/check": { get: { summary: "Health public" } },
			"/api/health/latency": { get: { summary: "WS + DB latency" } },
			"/api/health/monitoring": { get: { summary: "Full monitoring", security: [{ bearer: [] }] } },
			"/api/stats/totals": { get: { summary: "Totaux", security: [{ bearer: [] }] } },
			"/api/bot/guilds": { get: { summary: "Guilds", security: [{ bearer: [] }] } },
			"/api/bot/commands": { get: { summary: "Slash commands", security: [{ bearer: [] }] } },
			"/api/cron": { get: { summary: "Cron jobs", security: [{ bearer: [] }] } },
			"/cron/{name}/trigger": { post: { summary: "Trigger cron", security: [{ bearer: [] }] } },
			"/api/services": { get: { summary: "Service actions", security: [{ bearer: [] }] } },
			"/services/{service}/{action}": {
				post: { summary: "Run action", security: [{ bearer: [] }] },
			},
			"/api/database/tables": { get: { summary: "List tables", security: [{ bearer: [] }] } },
			"/database/{table}": {
				get: { summary: "List rows", security: [{ bearer: [] }] },
				post: { summary: "Insert row", security: [{ bearer: [] }] },
			},
			"/database/{table}/{id}": {
				get: { summary: "Get row", security: [{ bearer: [] }] },
				put: { summary: "Update row", security: [{ bearer: [] }] },
				delete: { summary: "Delete row", security: [{ bearer: [] }] },
			},
		},
		components: { securitySchemes: { bearer: { type: "http", scheme: "bearer" } } },
	};
}
