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
import { LEVEL_THRESHOLDS } from "~/lib/constants";
import { eq, sql, desc } from "drizzle-orm";
import { users, levelRewards } from "~/db/schema";
import { DatabaseService } from "~/db/index";
import { MessageTemplateService } from "~/services/MessageTemplateService";
import { CardService } from "~/services/CardService";
import { GaugeService } from "~/services/GaugeService";
import { FusionService } from "~/services/FusionService";
import { LeaderboardService, type LeaderboardEntry } from "~/services/LeaderboardService";
import { LevelService } from "~/services/LevelService";
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

/**
 * Helper pour wrapper un canvas Buffer en Response avec content-type détecté
 * via les magic bytes (PNG = `89 50 4e 47`, WebP = `52 49 46 46 .. WEBP`).
 *
 * Le rendu Skia coûte 100 ms à 1 s selon le canvas — cache HTTP 60 s pour
 * éviter de re-render à chaque refresh dashboard.
 */
function imageResponse(buffer: Buffer | Uint8Array, cacheSeconds = 60): Response {
	const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
	let contentType = "application/octet-stream";
	if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
		contentType = "image/png";
	} else if (
		bytes[0] === 0x52 &&
		bytes[1] === 0x49 &&
		bytes[2] === 0x46 &&
		bytes[3] === 0x46 &&
		bytes[8] === 0x57 &&
		bytes[9] === 0x45 &&
		bytes[10] === 0x42 &&
		bytes[11] === 0x50
	) {
		contentType = "image/webp";
	} else if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
		contentType = "image/jpeg";
	}
	return new Response(buffer as unknown as BodyInit, {
		headers: {
			"Content-Type": contentType,
			"Cache-Control": `public, max-age=${cacheSeconds}, must-revalidate`,
		},
	});
}

/** Couleur d'accent basée sur l'XP — calque la logique de /scan. */
function xpAccent(xp: number): string {
	if (xp >= 10_000_000) return "#f59e0b";
	if (xp >= 100_000) return "#facc15";
	if (xp >= 9_000) return "#dc2626";
	if (xp >= 5_000) return "#f87171";
	if (xp >= 1_000) return "#fb923c";
	if (xp >= 500) return "#60a5fa";
	return "#94a3b8";
}

const ASSET_CONTENT_TYPES: Record<string, string> = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".ttf": "font/ttf",
	".otf": "font/otf",
	".css": "text/css",
	".js": "application/javascript",
	".json": "application/json",
};

/**
 * Sert un fichier depuis `apps/shenron/assets/` ou refuse :
 *   - path traversal (`..`) interdit
 *   - extensions whitelist (cf ASSET_CONTENT_TYPES)
 *   - tout fichier hors `assets/` interdit
 *
 * URL : `/assets/<sub-path>` → `assets/<sub-path>`. Compat avec les paths DB
 * stockés `./assets/dbz/...` : le client peut soit normaliser côté front (préfixer
 * juste `/`), soit nous y faisons match exact via le pathname.
 */
async function serveAsset(pathname: string): Promise<Response> {
	const sub = decodeURIComponent(pathname.replace(/^\/assets\//, ""));
	if (!sub || sub.includes("..") || sub.startsWith("/") || sub.includes("\0")) {
		return new Response("Chemin d'asset refusé", { status: 400 });
	}
	const ext = (sub.match(/\.[a-z0-9]+$/i)?.[0] ?? "").toLowerCase();
	const contentType = ASSET_CONTENT_TYPES[ext];
	if (!contentType) {
		return new Response("Extension non autorisée", { status: 403 });
	}
	const file = Bun.file(`assets/${sub}`);
	if (!(await file.exists())) {
		return new Response("Asset introuvable", { status: 404 });
	}
	return new Response(file as unknown as BodyInit, {
		headers: {
			"Content-Type": contentType,
			"Cache-Control": "public, max-age=2592000, immutable",
		},
	});
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
				"/levels": dashboardHtml,
				"/messages": dashboardHtml,
				"/canvas": dashboardHtml,
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
				// Filtre mono-guild : on n'expose QUE la guild prod (env.GUILD_ID).
				// Defense in depth — `clientReady` quitte déjà les guilds non-prod.
				"/api/bot/guilds": admin(() => {
					const client = container.resolve(Client);
					const guilds = [...client.guilds.cache.values()]
						.filter((g) => g.id === env.GUILD_ID)
						.map((g) => ({
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

				// ── Niveaux & XP (page dédiée /levels) ────────────────────────
				"/api/levels/config": admin(async () => {
					const dbs = container.resolve(DatabaseService);
					// Lit les surcharges runtime depuis guild_settings (clés `xp.*` + `zeni.*`)
					const settings = await dbs.db.select().from(
						(await import("~/db/schema")).guildSettings,
					);
					const overrides = Object.fromEntries(settings.map((s) => [s.key, s.value]));
					return Response.json({
						thresholds: LEVEL_THRESHOLDS,
						defaults: {
							"xp.message.min": 15,
							"xp.message.max": 25,
							"xp.message.cooldown_ms": 60_000,
							"xp.voice.per_minute": 20,
							"zeni.daily_quest": 200,
							"zeni.per_level": 1_000,
						},
						overrides,
					});
				}),
				"/api/levels/distribution": admin(async () => {
					const dbs = container.resolve(DatabaseService);
					// Compte les users dans chaque tranche de palier (basé sur user.xp).
					const buckets = LEVEL_THRESHOLDS.map((t, i) => ({
						level: t.level,
						minXp: i === 0 ? 0 : LEVEL_THRESHOLDS[i - 1]!.xp,
						maxXp: t.xp,
					}));
					const result: Array<{ level: number; minXp: number; maxXp: number; count: number }> = [];
					for (const b of buckets) {
						const [{ c = 0 } = { c: 0 }] = await dbs.db
							.select({ c: sql<number>`COUNT(*)` })
							.from(users)
							.where(sql`${users.xp} >= ${b.minXp} AND ${users.xp} < ${b.maxXp}`);
						result.push({ ...b, count: Number(c) });
					}
					// Bucket "au-delà" pour ceux qui dépassent le dernier seuil
					const lastXp = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]!.xp;
					const [{ c: cBeyond = 0 } = { c: 0 }] = await dbs.db
						.select({ c: sql<number>`COUNT(*)` })
						.from(users)
						.where(sql`${users.xp} >= ${lastXp}`);
					result.push({ level: 11, minXp: lastXp, maxXp: Number.MAX_SAFE_INTEGER, count: Number(cBeyond) });
					return Response.json({ buckets: result });
				}),
				"/api/levels/rewards": admin(async () => {
					const dbs = container.resolve(DatabaseService);
					const rows = await dbs.db.select().from(levelRewards).orderBy(levelRewards.level);
					return Response.json({ rewards: rows });
				}),
				"/api/levels/top": admin(async (req) => {
					const dbs = container.resolve(DatabaseService);
					const url = new URL(req.url);
					const metric = (url.searchParams.get("metric") ?? "xp") as
						| "xp"
						| "zeni"
						| "voice"
						| "streak"
						| "messages";
					const limit = Math.min(50, Number(url.searchParams.get("limit")) || 10);
					const col =
						metric === "voice"
							? users.totalVoiceMs
							: metric === "streak"
								? users.dailyStreak
								: metric === "zeni"
									? users.zeni
									: metric === "messages"
										? users.messageCount
										: users.xp;
					const rows = await dbs.db
						.select({
							id: users.id,
							xp: users.xp,
							zeni: users.zeni,
							lastLevelReached: users.lastLevelReached,
							messageCount: users.messageCount,
							totalVoiceMs: users.totalVoiceMs,
							dailyStreak: users.dailyStreak,
						})
						.from(users)
						.orderBy(desc(col))
						.limit(limit);
					return Response.json({ metric, limit, users: rows });
				}),
				"/api/levels/users/:userId/xp": {
					POST: admin(async (req) => {
						const dbs = container.resolve(DatabaseService);
						const userId = req.params.userId;
						const body = (await req.json().catch(() => null)) as
							| { mode: "set" | "add"; amount: number }
							| null;
						if (!body || !["set", "add"].includes(body.mode) || typeof body.amount !== "number") {
							return Response.json({ error: "Body attendu : { mode: 'set'|'add', amount: number }" }, { status: 400 });
						}
						const existing = await dbs.db
							.select()
							.from(users)
							.where(eq(users.id, userId))
							.limit(1);
						if (existing.length === 0) {
							return Response.json({ error: "Utilisateur introuvable en base" }, { status: 404 });
						}
						const current = existing[0]!.xp;
						const newXp = body.mode === "set" ? body.amount : Math.max(0, current + body.amount);
						await dbs.db.update(users).set({ xp: newXp }).where(eq(users.id, userId));
						return Response.json({ ok: true, userId, previousXp: current, newXp });
					}),
				},
				"/api/levels/users/:userId/zeni": {
					POST: admin(async (req) => {
						const dbs = container.resolve(DatabaseService);
						const userId = req.params.userId;
						const body = (await req.json().catch(() => null)) as
							| { mode: "set" | "add"; amount: number }
							| null;
						if (!body || !["set", "add"].includes(body.mode) || typeof body.amount !== "number") {
							return Response.json({ error: "Body attendu : { mode: 'set'|'add', amount: number }" }, { status: 400 });
						}
						const existing = await dbs.db
							.select()
							.from(users)
							.where(eq(users.id, userId))
							.limit(1);
						if (existing.length === 0) {
							return Response.json({ error: "Utilisateur introuvable en base" }, { status: 404 });
						}
						const current = existing[0]!.zeni;
						const newZeni = body.mode === "set" ? body.amount : Math.max(0, current + body.amount);
						await dbs.db.update(users).set({ zeni: newZeni }).where(eq(users.id, userId));
						return Response.json({ ok: true, userId, previousZeni: current, newZeni });
					}),
				},

				// ── Canvas (rendu PNG via @napi-rs/canvas) ────────────────────
				// Tous les services renvoient Buffer<PNG>, on les wrappe en Response.
				// Cache HTTP 60 s pour amortir le coût Skia (100 ms - 1 s par render).
				"/api/canvas/profile/:userId": admin(async (req) => {
					const client = container.resolve(Client);
					const userId = req.params.userId;
					const user = await client.users.fetch(userId).catch(() => null);
					if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
					const dbs = container.resolve(DatabaseService);
					const rows = await dbs.db.select().from(users).where(eq(users.id, userId)).limit(1);
					const row = rows[0];
					if (!row) return Response.json({ error: "Pas de profil en base" }, { status: 404 });
					const url = new URL(req.url);
					const card = container.resolve(CardService);
					const buf = await card.render({
						discordUser: user,
						xp: row.xp,
						zeni: row.zeni,
						messageCount: row.messageCount,
						cardKey: url.searchParams.get("theme") ?? row.equippedCard,
						badge: row.equippedBadge,
						title: row.equippedTitle,
						color: row.equippedColor,
					});
					return imageResponse(buf);
				}),
				"/api/canvas/scan/:userId": admin(async (req) => {
					const client = container.resolve(Client);
					const userId = req.params.userId;
					const user = await client.users.fetch(userId).catch(() => null);
					if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
					const levels = container.resolve(LevelService);
					const row = await levels.getUser(userId);
					const xp = row?.xp ?? 0;
					const accent = xpAccent(xp);
					const gauge = container.resolve(GaugeService);
					// Réutilise GaugeService avec un % calculé sur les paliers DBZ
					const pct = Math.min(100, Math.round((xp / 9_000_000) * 100));
					const buf = await gauge.render({
						user,
						title: "SCANNER DE KI",
						subtitle: "Lecture du potentiel",
						pct,
						accent,
						accentDark: "#0a0a0a",
					});
					return imageResponse(buf);
				}),
				"/api/canvas/scouter/:userId": admin(async (req) => {
					const client = container.resolve(Client);
					const userId = req.params.userId;
					const user = await client.users.fetch(userId).catch(() => null);
					if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
					const url = new URL(req.url);
					const type = (url.searchParams.get("type") ?? "gay") as "gay" | "raciste";
					const pct = Math.max(0, Math.min(101, Number(url.searchParams.get("pct") ?? 50)));
					const gauge = container.resolve(GaugeService);
					const config =
						type === "raciste"
							? {
									title: "RACISM-O-MÈTRE",
									subtitle: "Scanner calibré sur Commander Red",
									accent: "#dc2626",
									accentDark: "#4a0000",
								}
							: {
									title: "GAYDAR DE BULMA",
									subtitle: "Scanner calibré sur Master Roshi",
									accent: "#ec4899",
									accentDark: "#3a0420",
								};
					const buf = await gauge.render({ user, ...config, pct });
					return imageResponse(buf);
				}),
				"/api/canvas/fusion": admin(async (req) => {
					const client = container.resolve(Client);
					const url = new URL(req.url);
					const aId = url.searchParams.get("a");
					const bId = url.searchParams.get("b");
					if (!aId || !bId) {
						return Response.json({ error: "Paramètres a + b requis (IDs Discord)" }, { status: 400 });
					}
					const [a, b] = await Promise.all([
						client.users.fetch(aId).catch(() => null),
						client.users.fetch(bId).catch(() => null),
					]);
					if (!a || !b) return Response.json({ error: "Utilisateur(s) introuvable(s)" }, { status: 404 });
					const state = (url.searchParams.get("state") ?? "success") as "propose" | "success";
					const fusedName = url.searchParams.get("name") ?? `${a.username.slice(0, 4)}${b.username.slice(0, 4)}`;
					const fusion = container.resolve(FusionService);
					const buf = await fusion.render({ a, b, state, fusedName });
					return imageResponse(buf);
				}),
				"/api/canvas/leaderboard": admin(async (req) => {
					const client = container.resolve(Client);
					const dbs = container.resolve(DatabaseService);
					const url = new URL(req.url);
					const metric = (url.searchParams.get("metric") ?? "xp") as "xp" | "zeni";
					const limit = Math.min(20, Math.max(3, Number(url.searchParams.get("limit") ?? 10)));
					const col = metric === "zeni" ? users.zeni : users.xp;
					const rows = await dbs.db
						.select({ id: users.id, xp: users.xp, zeni: users.zeni })
						.from(users)
						.orderBy(desc(col))
						.limit(limit);
					const fetched = await Promise.all(
						rows.map(async (r) => {
							const u = await client.users.fetch(r.id).catch(() => null);
							if (!u) return null;
							return {
								id: r.id,
								username: u.username,
								avatarURL: u.displayAvatarURL({ size: 128, extension: "png", forceStatic: true }),
								xp: r.xp,
								zeni: r.zeni,
							} satisfies LeaderboardEntry;
						}),
					);
					const entries = fetched.filter((e): e is LeaderboardEntry => e !== null);
					const lb = container.resolve(LeaderboardService);
					const buf = await lb.render(entries, {
						title: metric === "zeni" ? "Classement zénis" : "Classement XP",
						subtitle: `Top ${entries.length} joueurs`,
						page: 1,
						totalPages: 1,
					});
					return imageResponse(buf);
				}),
				"/api/canvas/list": admin(() =>
					Response.json({
						canvases: [
							{
								id: "profile",
								name: "Carte de profil",
								description: "Carte XP/zéni avec avatar, palier, barre de progression et thème (1000×360)",
								url: "/api/canvas/profile/:userId?theme=goku|vegeta|kaio|ssj|blue|rose|ultra|default",
								params: ["userId", "theme"],
							},
							{
								id: "scouter",
								name: "Scouter (gauge)",
								description: "Gauge style scouter pour /gay et /raciste (700×320)",
								url: "/api/canvas/scouter/:userId?type=gay|raciste&pct=50",
								params: ["userId", "type", "pct"],
							},
							{
								id: "scan",
								name: "Scanner de ki",
								description: "Lecture de ki d'un membre, basée sur l'XP en base",
								url: "/api/canvas/scan/:userId",
								params: ["userId"],
							},
							{
								id: "fusion",
								name: "Fusion",
								description: "Carte fusion dual-portrait (1100×500)",
								url: "/api/canvas/fusion?a=ID1&b=ID2&state=success&name=Gokuetto",
								params: ["a", "b", "state", "name"],
							},
							{
								id: "leaderboard",
								name: "Classement",
								description: "Podium top joueurs (1100×720)",
								url: "/api/canvas/leaderboard?metric=xp&limit=10",
								params: ["metric", "limit"],
							},
						],
					}),
				),

				// ── Discord scan (channels, rôles, members) ───────────────────
				// Source live depuis le cache Discord du bot (pas de fichier scan).
				// Utilisé par le dashboard pour résoudre les IDs en noms.
				"/api/discord/channels": admin(() => {
					const client = container.resolve(Client);
					const guild = client.guilds.cache.get(env.GUILD_ID);
					if (!guild) return Response.json({ channels: [] });
					const channels = [...guild.channels.cache.values()].map((c) => ({
						id: c.id,
						name: c.name,
						type: c.type,
						parentId: c.parentId,
						position: "position" in c ? c.position : 0,
					}));
					channels.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
					return Response.json({ channels, count: channels.length });
				}),
				"/api/discord/roles": admin(() => {
					const client = container.resolve(Client);
					const guild = client.guilds.cache.get(env.GUILD_ID);
					if (!guild) return Response.json({ roles: [] });
					const roles = [...guild.roles.cache.values()]
						.filter((r) => r.name !== "@everyone")
						.map((r) => ({
							id: r.id,
							name: r.name,
							color: r.color,
							hoist: r.hoist,
							position: r.position,
							memberCount: r.members.size,
							managed: r.managed,
						}));
					roles.sort((a, b) => b.position - a.position);
					return Response.json({ roles, count: roles.length });
				}),
				"/api/discord/members": admin(async (req) => {
					const client = container.resolve(Client);
					const guild = client.guilds.cache.get(env.GUILD_ID);
					if (!guild) return Response.json({ members: [] });
					const url = new URL(req.url);
					const limit = Math.min(1000, Number(url.searchParams.get("limit")) || 100);
					const search = (url.searchParams.get("search") ?? "").toLowerCase();
					let members = [...guild.members.cache.values()];
					if (search) {
						members = members.filter(
							(m) =>
								m.user.username.toLowerCase().includes(search) ||
								m.displayName.toLowerCase().includes(search) ||
								m.id.includes(search),
						);
					}
					const result = members.slice(0, limit).map((m) => ({
						id: m.id,
						username: m.user.username,
						displayName: m.displayName,
						avatar: m.user.displayAvatarURL({ size: 64 }),
						bot: m.user.bot,
						joinedAt: m.joinedTimestamp ? new Date(m.joinedTimestamp).toISOString() : null,
						roleIds: [...m.roles.cache.keys()],
					}));
					return Response.json({
						members: result,
						count: result.length,
						total: guild.memberCount,
					});
				}),
				"/api/discord/scan": admin(async () => {
					const client = container.resolve(Client);
					const guild = client.guilds.cache.get(env.GUILD_ID);
					if (!guild) return Response.json({ error: "guild absente" }, { status: 404 });
					const channels = [...guild.channels.cache.values()].map((c) => ({
						id: c.id,
						name: c.name,
						type: c.type,
						parentId: c.parentId,
					}));
					const roles = [...guild.roles.cache.values()].map((r) => ({
						id: r.id,
						name: r.name,
						color: r.color,
						position: r.position,
					}));
					return Response.json({
						guild: {
							id: guild.id,
							name: guild.name,
							memberCount: guild.memberCount,
							iconUrl: guild.iconURL({ size: 256 }),
						},
						channels,
						channelCount: channels.length,
						roles,
						roleCount: roles.length,
						scannedAt: new Date().toISOString(),
					});
				}),

				// ── Templates de messages événementiels ───────────────────────
				"/api/messages": admin(async () => {
					const svc = container.resolve(MessageTemplateService);
					return Response.json({ events: await svc.list() });
				}),
				"/api/messages/:event": {
					GET: admin(async (req) => {
						const svc = container.resolve(MessageTemplateService);
						const list = await svc.list();
						const found = list.find((e) => e.event === req.params.event);
						if (!found) return Response.json({ error: "Événement inconnu" }, { status: 404 });
						return Response.json(found);
					}),
					POST: admin(async (req) => {
						const svc = container.resolve(MessageTemplateService);
						const body = (await req.json().catch(() => null)) as
							| { template?: string | null; channelKey?: string | null; enabled?: boolean }
							| null;
						if (!body) return Response.json({ error: "JSON body requis" }, { status: 400 });
						try {
							await svc.upsert({
								event: req.params.event,
								template: body.template ?? null,
								channelKey: body.channelKey ?? null,
								enabled: body.enabled ?? true,
							});
							return Response.json({ ok: true });
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "erreur" },
								{ status: 400 },
							);
						}
					}),
					DELETE: admin(async (req) => {
						const svc = container.resolve(MessageTemplateService);
						await svc.reset(req.params.event);
						return Response.json({ ok: true });
					}),
				},
				"/api/messages/:event/preview": {
					POST: admin(async (req) => {
						const svc = container.resolve(MessageTemplateService);
						const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
						try {
							return Response.json(await svc.preview(req.params.event, body));
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "erreur" },
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

			fetch(req) {
				const url = new URL(req.url);
				// Sert tout chemin commençant par /assets/ depuis le dossier assets/.
				// Routes Map de Bun ne supporte pas les wildcards multi-segment, donc
				// on les capture ici dans le fallback.
				if (url.pathname.startsWith("/assets/")) {
					return serveAsset(url.pathname);
				}
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
