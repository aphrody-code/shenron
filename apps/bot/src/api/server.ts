import { singleton, inject, container } from "tsyringe";
import { Client } from "@rpbey/discordy";
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
import {
	getOAuthConfig,
	buildAuthorizeUrl,
	generateState,
	buildStateCookie,
	clearStateCookie,
	exchangeCode,
	fetchUser,
	isUserAllowed,
	revokeToken,
} from "./oauth";
import { getDiscordSession } from "./oauth-session";
import { discordFetch, DiscordRESTError } from "~/lib/discord-rest";
import { userAvatar, defaultAvatar, guildIcon } from "~/lib/discord-cdn";
import {
	createChannelWebhook,
	deleteWebhook,
	executeWebhook,
	listChannelWebhooks,
	listGuildWebhooks,
	type ExecuteWebhookPayload,
} from "~/lib/discord-webhook";
import { CronRegistry } from "./cron-registry";
import { ModerationService } from "~/services/ModerationService";
import { TicketService } from "~/services/TicketService";
import { SettingsService } from "~/services/SettingsService";
import { LEVEL_THRESHOLDS } from "~/lib/constants";
import { PERSONAS, PERSONA_IDS, type PersonaId } from "~/lib/personas";
import type { APIEmbed, TextChannel } from "discord.js";
import { verifyActingUser } from "./user-auth";
import { decideBotChoice, isPfcChoice, resolvePfc } from "~/services/games/pfc";
import {
	applyMorpionMove,
	decideMorpionMove,
	emptyBoard,
	evaluateBoard,
} from "~/services/games/morpion";
import {
	BINGO_MAX,
	BINGO_MIN,
	compareBingoGuess,
	randomBingoTarget,
} from "~/services/games/bingo";
import {
	constantTimeEqualStr,
	packBingoToken,
	parseMorpionBoard,
	signMorpion,
	unpackBingoToken,
} from "~/services/games/tokens";
import { ZENI_GAME_WIN, ZENI_GAME_LOSS_PENALTY } from "~/lib/constants";
import { eq, sql, desc, asc, inArray } from "drizzle-orm";
import {
	users,
	levelRewards,
	shopItems,
	achievements,
	achievementTriggers,
	inventory,
	dbCharacters,
	dbTransformations,
	dbPlanets,
} from "~/db/schema";
import { DatabaseService } from "~/db/index";
import { MessageTemplateService } from "~/services/MessageTemplateService";
import { EconomyService } from "~/services/EconomyService";
import { CardService } from "~/services/CardService";
import { CommandPermissionsService } from "~/services/CommandPermissionsService";
import { GaugeService } from "~/services/GaugeService";
import { FusionService } from "~/services/FusionService";
import { WikiService } from "~/services/WikiService";
import { LeaderboardService, type LeaderboardEntry } from "~/services/LeaderboardService";
import { LevelService } from "~/services/LevelService";
import { levelForXP, nextThresholdFrom } from "~/lib/xp";
// HTML import — Bun.serve bundle automatiquement scripts/CSS référencés.
// Le HTML doit être au root du package pour que les chunks soient générés à la racine.
import dashboardHtml from "../../dashboard.html";
import { handleBetterAuthRequest, getBetterAuthSession } from "~/lib/better-auth";
import { EventBusService } from "~/services/EventBusService";

// Extrait le hash avatar depuis une URL CDN Discord
// `https://cdn.discordapp.com/avatars/{id}/{hash}.{ext}` → `{hash}`
function extractDiscordAvatarHash(url: string): string | null {
	const m = /\/avatars\/\d+\/([a-z0-9_]+)\.(?:png|jpg|jpeg|webp|gif)/i.exec(url);
	return m?.[1] ?? null;
}

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
 * Détecte le content-type via les magic bytes (PNG `89 50 4e 47`,
 * WebP `52 49 46 46 .. 57 45 42 50`, JPEG `ff d8 ff`).
 */
function detectImageType(bytes: Uint8Array): string {
	if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
		return "image/png";
	}
	if (
		bytes[0] === 0x52 &&
		bytes[1] === 0x49 &&
		bytes[2] === 0x46 &&
		bytes[3] === 0x46 &&
		bytes[8] === 0x57 &&
		bytes[9] === 0x45 &&
		bytes[10] === 0x42 &&
		bytes[11] === 0x50
	) {
		return "image/webp";
	}
	if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
		return "image/jpeg";
	}
	return "application/octet-stream";
}

/**
 * Hash rapide FNV-1a 32-bit sur un buffer — utilisé comme ETag.
 * Pas crypto-safe mais sub-microseconde sur des buffers de 100 KB-1 MB et
 * suffit pour identifier un rendu canvas par contenu.
 */
function etagOf(buffer: Uint8Array): string {
	let h = 0x811c9dc5;
	const len = buffer.length;
	// Échantillonner 4096 bytes répartis pour les gros buffers (PNG ~500KB+).
	const step = Math.max(1, Math.floor(len / 4096));
	for (let i = 0; i < len; i += step) {
		h ^= buffer[i] ?? 0;
		h = Math.imul(h, 0x01000193);
	}
	return `"${(h >>> 0).toString(16).padStart(8, "0")}-${len.toString(16)}"`;
}

/**
 * Cache LRU en mémoire pour les rendus canvas. Limite 32 entrées (suffisant
 * pour le dashboard admin) avec éviction du plus ancien.
 *
 * Évite que Skia re-render quand :
 *   - le browser ne respecte pas `Cache-Control` (ex: hard refresh)
 *   - plusieurs admins consultent en parallèle
 *   - le cache buster `_=N` du dashboard force un refresh côté HTTP
 *
 * Clé : path + query normalisé. TTL : 60 s (aligné avec Cache-Control HTTP).
 */
interface CacheEntry {
	buffer: Uint8Array;
	contentType: string;
	etag: string;
	expiresAt: number;
}
const renderCache = new Map<string, CacheEntry>();
const CACHE_MAX = 32;
const CACHE_TTL_MS = 60_000;

function cacheKey(req: Request): string {
	const url = new URL(req.url);
	const params = [...url.searchParams.entries()]
		.filter(([k]) => !k.startsWith("_")) // ignore cache busters
		.toSorted(([a], [b]) => a.localeCompare(b));
	return url.pathname + (params.length ? "?" + new URLSearchParams(params).toString() : "");
}

function getCached(key: string): CacheEntry | null {
	const entry = renderCache.get(key);
	if (!entry) return null;
	if (entry.expiresAt < Date.now()) {
		renderCache.delete(key);
		return null;
	}
	// LRU: re-insert pour marquer comme récent
	renderCache.delete(key);
	renderCache.set(key, entry);
	return entry;
}

function putCached(key: string, buffer: Uint8Array, contentType: string, etag: string): void {
	if (renderCache.size >= CACHE_MAX) {
		const oldest = renderCache.keys().next().value;
		if (oldest) renderCache.delete(oldest);
	}
	renderCache.set(key, {
		buffer,
		contentType,
		etag,
		expiresAt: Date.now() + CACHE_TTL_MS,
	});
}

/** Erreur HTTP propagée depuis un closure render — `cachedImage` la convertit en Response. */
class HttpError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
	}
}

/**
 * Sélectionne le format d'image préféré du client via le header `Accept`.
 * Ordre de préférence : AVIF (~−60 % vs PNG) > WebP (~−30 %) > PNG (fallback).
 *
 * Tous les browsers modernes (Chrome 85+, Firefox 93+, Safari 16.4+, Edge 121+)
 * supportent AVIF. Pour les vieux clients (curl, Discord embeds), on reste sur
 * le format natif du service (PNG/WebP).
 */
function pickFormat(accept: string | null): "avif" | "webp" | "png" {
	if (!accept) return "png";
	const a = accept.toLowerCase();
	if (a.includes("image/avif")) return "avif";
	if (a.includes("image/webp")) return "webp";
	return "png";
}

/**
 * Re-encode un buffer image dans un autre format. Coût : ~50-100 ms côté CPU
 * pour AVIF, ~30 ms pour WebP. Mitigé par le LRU cache qui mémorise par
 * (path, query, format).
 *
 * Si format == format source, retourne le buffer tel quel (zéro coût).
 */
async function reEncode(
	srcBuffer: Uint8Array,
	srcType: string,
	target: "avif" | "webp" | "png",
	quality = 75,
): Promise<Uint8Array> {
	if (
		(target === "png" && srcType === "image/png") ||
		(target === "webp" && srcType === "image/webp") ||
		(target === "avif" && srcType === "image/avif")
	) {
		return srcBuffer;
	}
	const { loadImage, createCanvas } = await import("@aphrody-code/canvas");
	const img = await loadImage(srcBuffer as unknown as Buffer);
	const cv = createCanvas(img.width, img.height);
	cv.getContext("2d").drawImage(img as never, 0, 0);
	if (target === "png") return new Uint8Array(await cv.encode("png"));
	if (target === "webp") return new Uint8Array(await cv.encode("webp", quality));
	return new Uint8Array(await cv.encode("avif", { quality, speed: 7 }));
}

/**
 * Cache LRU générique pour réponses JSON (canaux Discord, rôles, members,
 * templates de messages, config niveaux). Même structure que le cache canvas
 * mais TTL configurable + ETag sur le payload sérialisé.
 *
 * Pertinent pour les routes lecture-seule lentes (fetch Discord guild members
 * = 5757 entrées sur DBFR).
 */
const jsonCache = new Map<string, CacheEntry>();
const JSON_CACHE_MAX = 64;

async function cachedJson<T>(
	req: Request,
	build: () => Promise<T>,
	ttlMs = 30_000,
): Promise<Response> {
	const key = cacheKey(req);
	const ifNoneMatch = req.headers.get("if-none-match");

	let entry = jsonCache.get(key);
	if (entry && entry.expiresAt < Date.now()) {
		jsonCache.delete(key);
		entry = undefined;
	}
	if (entry) {
		// LRU re-insert
		jsonCache.delete(key);
		jsonCache.set(key, entry);
	}

	if (!entry) {
		try {
			const data = await build();
			const json = JSON.stringify(data);
			const bytes = new TextEncoder().encode(json);
			const etag = etagOf(bytes);
			entry = {
				buffer: bytes,
				contentType: "application/json",
				etag,
				expiresAt: Date.now() + ttlMs,
			};
			if (jsonCache.size >= JSON_CACHE_MAX) {
				const oldest = jsonCache.keys().next().value;
				if (oldest) jsonCache.delete(oldest);
			}
			jsonCache.set(key, entry);
		} catch (err) {
			if (err instanceof HttpError) {
				return Response.json({ error: err.message }, { status: err.status });
			}
			throw err;
		}
	}

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		"Cache-Control": `private, max-age=${Math.floor(ttlMs / 1000)}, must-revalidate`,
		ETag: entry.etag,
	};
	if (ifNoneMatch && ifNoneMatch === entry.etag) {
		return new Response(null, { status: 304, headers });
	}
	return new Response(entry.buffer as unknown as BodyInit, { headers });
}

/** Invalide le cache JSON pour une clé prefix (ex: après un POST `/messages/:event`). */
function invalidateJsonCache(prefix: string): number {
	let n = 0;
	// Snapshot des clés pour pouvoir delete pendant l'itération sans invalider l'iterator.
	const keys = Array.from(jsonCache.keys());
	for (const k of keys) {
		if (k.startsWith(prefix)) {
			jsonCache.delete(k);
			n++;
		}
	}
	return n;
}

/**
 * Wrapper canvas avec 3 optimisations :
 *
 *   1. **Fast path 304** — si `If-None-Match` match l'ETag en cache, renvoie
 *      `304 Not Modified` SANS appeler `render()`. Aucun fetch user/db, aucun
 *      Skia call. ~1 ms côté serveur, 0 byte transmis.
 *
 *   2. **LRU cache** — si pas d'`If-None-Match` mais une entrée non-expirée existe,
 *      sert le buffer en mémoire SANS re-render. Cache 60 s, max 32 entrées.
 *
 *   3. **Render + cache + ETag** — sinon appelle `render()`, encode le buffer
 *      (le service utilise déjà `canvas.encode()` async via libuv threadpool),
 *      détecte le content-type via magic bytes, calcule l'ETag FNV-1a, met en
 *      cache et répond.
 *
 * Les `HttpError` levés depuis `render()` (404 user introuvable, 400 paramètre
 * invalide…) sont convertis en Response JSON avec le bon status.
 */
async function cachedImage(
	req: Request,
	render: () => Promise<Buffer | Uint8Array>,
	cacheSeconds = 60,
): Promise<Response> {
	const accept = req.headers.get("accept");
	const targetFormat = pickFormat(accept);
	// La clé de cache inclut le format pour ne pas servir un PNG quand AVIF demandé
	const key = `${cacheKey(req)}#${targetFormat}`;
	const ifNoneMatch = req.headers.get("if-none-match");

	let entry = getCached(key);
	if (!entry) {
		try {
			const buffer = await render();
			let bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
			let contentType = detectImageType(bytes);

			// Re-encode si le client préfère un format ≠ de celui retourné par le service
			if (
				(targetFormat === "avif" && contentType !== "image/avif") ||
				(targetFormat === "webp" && contentType !== "image/webp")
			) {
				const reencoded = await reEncode(bytes, contentType, targetFormat);
				bytes = reencoded;
				contentType = `image/${targetFormat}`;
			}

			const etag = etagOf(bytes);
			putCached(key, bytes, contentType, etag);
			entry = { buffer: bytes, contentType, etag, expiresAt: Date.now() + CACHE_TTL_MS };
		} catch (err) {
			if (err instanceof HttpError) {
				return Response.json({ error: err.message }, { status: err.status });
			}
			throw err;
		}
	}

	const headers: HeadersInit = {
		"Content-Type": entry.contentType,
		"Cache-Control": `public, max-age=${cacheSeconds}, must-revalidate`,
		ETag: entry.etag,
		Vary: "Accept",
	};

	if (ifNoneMatch && ifNoneMatch === entry.etag) {
		return new Response(null, { status: 304, headers });
	}

	return new Response(entry.buffer as unknown as BodyInit, { headers });
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
	".vtt": "text/vtt",
	".srt": "application/x-subrip",
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
async function serveAsset(pathname: string, req?: Request): Promise<Response> {
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
	const cors = req ? publicCorsHeaders(req) : {};
	// Les assets wiki sont éditables en place (remplacement via l'admin au même
	// chemin) → JAMAIS de cache immutable, sinon l'ancienne image reste figée
	// (navigateur + optimiseur CDN). `no-cache` force la revalidation ; l'ETag
	// (taille + mtime) permet un 304 bon marché tant que le fichier est inchangé,
	// et sert la nouvelle image dès qu'il est réécrit.
	const etag = `"${file.size}-${Math.floor(file.lastModified)}"`;
	const cacheHeaders = {
		"Cache-Control": "no-cache, must-revalidate",
		ETag: etag,
		"Last-Modified": new Date(file.lastModified).toUTCString(),
		"Cross-Origin-Resource-Policy": "cross-origin",
		...cors,
	};
	if (req?.headers.get("if-none-match") === etag) {
		return new Response(null, { status: 304, headers: cacheHeaders });
	}
	return new Response(file as unknown as BodyInit, {
		headers: {
			"Content-Type": contentType,
			...cacheHeaders,
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
				"/profile": dashboardHtml,
				"/webhooks": dashboardHtml,
				"/bot": dashboardHtml,
				"/cron": dashboardHtml,
				"/services": dashboardHtml,
				"/database": dashboardHtml,
				"/database/:table": dashboardHtml,
				"/database/:table/:id": dashboardHtml,
				"/stats": dashboardHtml,
				"/audit": dashboardHtml,
				"/moderation": dashboardHtml,
				"/hierarchy": dashboardHtml,
				"/tickets": dashboardHtml,
				"/shop": dashboardHtml,
				"/triggers": dashboardHtml,
				"/commands": dashboardHtml,
				"/audit-internal": dashboardHtml,
				"/levels": dashboardHtml,
				"/economy": dashboardHtml,
				"/giveaways": dashboardHtml,
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
				// Vérifie les 2 sources : Better Auth (table ba_session) ET cookie HMAC
				// legacy (shenron_session). Le 1er match wins.
				"/auth/me": async (req) => {
					// 1. Better Auth ?
					const baSession = await getBetterAuthSession(req);
					if (baSession?.user) {
						const u = baSession.user;
						const discordId = u.id; // Better Auth User.id n'est PAS le snowflake Discord
						// On essaie de retrouver l'accountId Discord en DB pour avoir le vrai snowflake
						return Response.json({
							authenticated: true,
							user: {
								id: discordId,
								username: u.name,
								avatar: u.image ? extractDiscordAvatarHash(u.image) : null,
								avatarUrl: u.image ?? null,
								email: u.email ?? null,
								source: "better-auth",
							},
						});
					}

					// 2. Session HMAC legacy ?
					const sessionCookie = readCookie(req, "shenron_session");
					const session = await verifySession(sessionCookie);
					if (!session) return Response.json({ authenticated: false });
					const user = session.userId
						? {
								id: session.userId,
								username: session.username,
								avatar: session.avatar ?? null,
								avatarUrl: userAvatar(session.userId, session.avatar, { size: 128 }),
								email: session.email ?? null,
								source: session.source,
						  }
						: { source: session.source };
					return Response.json({ authenticated: true, user });
				},
				"/auth/discord": (req) => {
					const config = getOAuthConfig();
					if (!config) {
						return new Response(
							"OAuth Discord non configuré (DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, OAUTH_REDIRECT_URI requis).",
							{ status: 503 },
						);
					}
					const state = generateState();
					const url = buildAuthorizeUrl(config, state);
					return new Response(null, {
						status: 302,
						headers: { Location: url, "Set-Cookie": buildStateCookie(state) },
					});
				},
				"/auth/callback": async (req) => {
					const config = getOAuthConfig();
					if (!config) return new Response("OAuth non configuré", { status: 503 });

					if (req.method === "OPTIONS") {
						return new Response(null, {
							status: 204,
							headers: publicCorsHeaders(req),
						});
					}

					const url = new URL(req.url);

					const code = url.searchParams.get("code");
					const state = url.searchParams.get("state");
					const expected = readCookie(req, "shenron_oauth_state");
					if (!code || !state || !expected || state !== expected) {
						return new Response("Paramètres OAuth invalides ou state mismatch.", {
							status: 400,
							headers: { "Set-Cookie": clearStateCookie() },
						});
					}
					try {
						const tokens = await exchangeCode(config, code);
						const user = await fetchUser(tokens.access_token);
						if (!isUserAllowed(user.id)) {
							logger.warn({ userId: user.id, username: user.username }, "OAuth login refusé : user hors whitelist");
							return new Response(
								`Accès refusé : ${user.username} (${user.id}) n'est pas dans la whitelist.`,
								{ status: 403, headers: { "Set-Cookie": clearStateCookie() } },
							);
						}
						const session = await createSession({
							userId: user.id,
							username: user.global_name ?? user.username,
							avatar: user.avatar,
							email: user.email,
							accessToken: tokens.access_token,
							refreshToken: tokens.refresh_token ?? "",
							accessTokenExpiresAt: Date.now() + tokens.expires_in * 1000,
						});
						logger.info({ userId: user.id, username: user.username }, "OAuth login réussi");
						return new Response(null, {
							status: 302,
							headers: [
								["Location", "/"],
								["Set-Cookie", clearStateCookie()],
								["Set-Cookie", buildSessionCookie(session)],
							],
						});
					} catch (err) {
						logger.error({ err }, "OAuth callback failed");
						return new Response(
							`OAuth callback erreur : ${err instanceof Error ? err.message : String(err)}`,
							{ status: 500, headers: { "Set-Cookie": clearStateCookie() } },
						);
					}
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
					POST: async (req) => {
						// Best-effort revocation des tokens OAuth côté Discord (pas bloquant).
						const sessionCookie = readCookie(req, "shenron_session");
						const session = await verifySession(sessionCookie);
						const config = getOAuthConfig();
						if (session?.accessToken && config) {
							void revokeToken(config, session.accessToken);
						}
						return new Response(JSON.stringify({ ok: true }), {
							status: 200,
							headers: {
								"Content-Type": "application/json",
								"Set-Cookie": buildLogoutCookie(),
							},
						});
					},
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
						version: Bun.env.npm_package_version ?? "0.1.0",
					});
				},
				"/api/health/latency": () => Response.json(this.stats.getLatency()),

				// Alias sans préfixe /api pour le site Vercel qui pingue /health/check.
				// Inclut un CORS allowlist + Cache-Control pour que Vercel cache 5 s.
				"/health/check": (req) =>
					publicCachedJson(req, 5_000, async () => {
						const client = container.resolve(Client);
						return {
							online: client.isReady(),
							uptime: client.uptime,
							version: Bun.env.npm_package_version ?? "0.1.0",
						};
					}),
				"/health/latency": (req) =>
					publicCachedJson(req, 5_000, async () => this.stats.getLatency()),

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
				"/api/bot/commands/expanded": admin(() => {
					const client = container.resolve(Client);
					const leaves: { name: string; description: string; group: string }[] = [];
					for (const c of client.applicationCommands ?? []) {
						expandCommandLeaves(c as any, leaves);
					}
					return Response.json({ commands: leaves, count: leaves.length });
				}),
				"/api/bot/commands/permissions": {
					GET: admin(async () => {
						const svc = container.resolve(CommandPermissionsService);
						return Response.json({ rules: await svc.list() });
					}),
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as {
							name?: string;
							enabled?: boolean;
							allowedRoles?: unknown;
							deniedRoles?: unknown;
							deniedUsers?: unknown;
						} | null;
						if (!body || typeof body.name !== "string" || !body.name.trim()) {
							return Response.json(
								{ error: "Body attendu : { name, enabled?, allowedRoles?, deniedRoles?, deniedUsers? }" },
								{ status: 400 },
							);
						}
						const sanitizeIds = (v: unknown): string[] => {
							if (!Array.isArray(v)) return [];
							return v
								.filter((x): x is string => typeof x === "string")
								.filter((x) => /^\d{17,20}$/.test(x));
						};
						const svc = container.resolve(CommandPermissionsService);
						const rule = await svc.upsert({
							name: body.name.trim(),
							enabled: typeof body.enabled === "boolean" ? body.enabled : true,
							allowedRoles: sanitizeIds(body.allowedRoles),
							deniedRoles: sanitizeIds(body.deniedRoles),
							deniedUsers: sanitizeIds(body.deniedUsers),
						});
						return Response.json({ rule });
					}),
				},
				"/api/bot/commands/permissions/delete": {
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as { name?: string } | null;
						if (!body || typeof body.name !== "string") {
							return Response.json({ error: "Body attendu : { name }" }, { status: 400 });
						}
						const svc = container.resolve(CommandPermissionsService);
						await svc.remove(body.name.trim());
						return Response.json({ ok: true });
					}),
				},
				"/api/bot/commands/:name": admin((req) => {
					const client = container.resolve(Client);
					const found = (client.applicationCommands ?? []).find(
						(c: any) => c.name === req.params.name,
					);
					if (!found) return Response.json({ error: "Commande introuvable" }, { status: 404 });
					return Response.json(serializeCommand(found));
				}),

				// ── Multi-bot — liste/détail des 6 personas ──────────────────
				// GET /api/bots         : carte synthétique des 6 (status, ping, uptime, count cmds)
				// GET /api/bots/:id     : détail d'un persona (guilds + commands)
				// GET /api/bots/:id/commands  : full schema slash commands d'un persona
				// GET /api/bots/:id/expanded  : leaves expandées (groupes flatten) pour Commands.tsx
				"/api/bots": admin(() => {
					const map = container.resolve<Map<string, Client>>("ClientMap");
					// MetadataStorage discordx est singleton — `client.applicationCommands`
					// retourne TOUTES les classes @Slash sans filtrage par botId.
					// On filtre via `isBotAllowed(id)` pour avoir le count réel par persona.
					const allCmds = (Client.applicationCommands ?? []) as unknown as Array<{
						isBotAllowed: (id: string) => boolean;
					}>;
					const bots = [...map.entries()].map(([id, c]) => ({
						id,
						name: c.user?.username ?? id,
						username: c.user?.tag ?? null,
						avatar: c.user?.displayAvatarURL({ size: 128 }) ?? null,
						online: c.isReady(),
						uptime: c.uptime,
						wsPing: c.ws.ping,
						intents:
							typeof c.options.intents === "number"
								? c.options.intents
								: c.options.intents?.bitfield ?? 0,
						guildCount: c.guilds.cache.size,
						commandCount: allCmds.filter((cmd) => cmd.isBotAllowed(id)).length,
					}));
					return Response.json({ bots });
				}),
				"/api/bots/:id": admin((req) => {
					const map = container.resolve<Map<string, Client>>("ClientMap");
					const c = map.get(req.params.id);
					if (!c) return Response.json({ error: "Bot introuvable" }, { status: 404 });
					const allCmds = (Client.applicationCommands ?? []) as unknown as Array<{
						isBotAllowed: (id: string) => boolean;
					}>;
					const guilds = [...c.guilds.cache.values()]
						.filter((g) => g.id === env.GUILD_ID)
						.map((g) => ({
							id: g.id,
							name: g.name,
							memberCount: g.memberCount,
							iconUrl: g.iconURL({ size: 256 }),
							joinedAt: g.joinedTimestamp ? new Date(g.joinedTimestamp).toISOString() : null,
						}));
					return Response.json({
						id: req.params.id,
						name: c.user?.username ?? req.params.id,
						username: c.user?.tag ?? null,
						avatar: c.user?.displayAvatarURL({ size: 256 }) ?? null,
						online: c.isReady(),
						uptime: c.uptime,
						wsPing: c.ws.ping,
						guilds,
						commandCount: allCmds.filter((cmd) => cmd.isBotAllowed(req.params.id)).length,
					});
				}),
				"/api/bots/:id/commands": admin((req) => {
					const map = container.resolve<Map<string, Client>>("ClientMap");
					const c = map.get(req.params.id);
					if (!c) return Response.json({ error: "Bot introuvable" }, { status: 404 });
					const id = req.params.id;
					const allCmds = (Client.applicationCommands ?? []) as unknown as Array<{
						isBotAllowed: (id: string) => boolean;
					}>;
					const commands = allCmds
						.filter((cmd) => cmd.isBotAllowed(id))
						.map((cmd) => serializeCommand(cmd as any));
					return Response.json({ commands, count: commands.length });
				}),
				"/api/bots/:id/expanded": admin((req) => {
					const map = container.resolve<Map<string, Client>>("ClientMap");
					const c = map.get(req.params.id);
					if (!c) return Response.json({ error: "Bot introuvable" }, { status: 404 });
					const id = req.params.id;
					const allCmds = (Client.applicationCommands ?? []) as unknown as Array<{
						isBotAllowed: (id: string) => boolean;
					}>;
					const leaves: { name: string; description: string; group: string }[] = [];
					for (const cmd of allCmds.filter((c2) => c2.isBotAllowed(id))) {
						expandCommandLeaves(cmd as any, leaves);
					}
					return Response.json({ commands: leaves, count: leaves.length });
				}),

				// ── Guild roles (role picker dashboard) ───────────────────────
				// Liste les rôles de la guild via cache discord.js du persona donné
				// (par défaut Shenron). Filtre @everyone + rôles managed (bots).
				"/api/bots/:id/guild/roles": admin((req) => {
					const map = container.resolve<Map<string, Client>>("ClientMap");
					const c = map.get(req.params.id);
					if (!c) return Response.json({ error: "Bot introuvable" }, { status: 404 });
					const guild = c.guilds.cache.get(env.GUILD_ID);
					if (!guild) return Response.json({ error: "Guild introuvable" }, { status: 404 });
					const roles = [...guild.roles.cache.values()]
						.filter((r) => r.id !== guild.id && !r.managed)
						.toSorted((a, b) => b.position - a.position)
						.map((r) => ({
							id: r.id,
							name: r.name,
							color: r.color,
							hexColor: r.hexColor,
							position: r.position,
							managed: r.managed,
						}));
					return Response.json({ roles });
				}),

				// ── Routes PUBLIQUES (CORS + rate-limit + ETag + Cache-Control) ─
				// Cible : site Vercel dbfr-site qui mirror profil Discord.
				// Toutes utilisent `publicCachedJson` → 2 niveaux de cache :
				//   1) memo mémoire (TTL court) — absorbe les hits parallèles
				//   2) Cache-Control public + ETag — Vercel edge cache + 304
				"/api/public/user/:discordId": (req) =>
					publicCachedJson(req, 30_000, async () => {
						const id = req.params.discordId;
						if (!/^\d{17,20}$/.test(id)) throw new HttpError(400, "discordId invalide");
						const dbs = container.resolve(DatabaseService);
						const user = await dbs.db.query.users.findFirst({ where: eq(users.id, id) });
						if (!user) throw new HttpError(404, "User inconnu");

						const level = levelForXP(user.xp);
						const next = nextThresholdFrom(user.xp);

						// 4 fetches en parallèle (SQLite WAL supporte les lectures
						// concurrentes ; Discord REST de toute façon en parallèle).
						const [inv, ach, fusion, dUser] = await Promise.all([
							container.resolve(EconomyService).listInventory(id),
							dbs.db.query.achievements.findMany({
								where: (a, { eq: e }) => e(a.userId, id),
							}),
							container.resolve(FusionService).getFusion(id),
							fetchDiscordUserCached(id),
						]);

						// Deuxième vague parallèle : enrich inventory (JOIN shop) +
						// fetch partner Discord — dépend du résultat de la 1re vague.
						const itemKeys = inv.map((i) => i.itemKey);
						const [shopRows, partnerData] = await Promise.all([
							itemKeys.length
								? dbs.db.query.shopItems.findMany({
										where: inArray(shopItems.key, itemKeys),
								  })
								: Promise.resolve([]),
							fusion ? fetchDiscordUserCached(fusion.partnerId) : Promise.resolve(null),
						]);
						const shopByKey = new Map(shopRows.map((s) => [s.key, s]));
						const avatarUrl = discordAvatarUrl(id, dUser.avatarHash, 512);

						let fusionData: {
							partnerId: string;
							partnerName: string | null;
							createdAt: Date;
						} | null = null;
						if (fusion && partnerData) {
							fusionData = {
								partnerId: fusion.partnerId,
								partnerName: partnerData.username,
								createdAt: fusion.createdAt,
							};
						}

						// Bannière : priorité 1) banner explicitement équipé via /inventaire equip,
						// 2) bannière du level reward atteint, 3) carte équipée legacy, 4) null.
						const siteBase =
						        Bun.env.SITE_PUBLIC_URL ?? "https://shenron.rpbey.fr";

						let bannerUrl: string | null = null;
						if (user.equippedBanner) {
							// Lookup via shop_items.meta.bannerPath
							const banItem = await dbs.db.query.shopItems.findFirst({
								where: (s, { eq: e }) => e(s.key, user.equippedBanner ?? ""),
							});
							if (banItem?.meta) {
								try {
									const m = JSON.parse(banItem.meta) as { bannerPath?: string };
									if (m.bannerPath) {
										const f = m.bannerPath.split("/").pop();
										if (f) bannerUrl = `${siteBase}/banners/${f}`;
									}
								} catch {}
							}
						}
						if (!bannerUrl && level >= 1) {
							const lr = await dbs.db.query.levelRewards.findFirst({
								where: (l, { eq: e }) => e(l.level, level),
							});
							if (lr?.bannerUrl) {
								const f = lr.bannerUrl.split("/").pop();
								if (f) bannerUrl = `${siteBase}/banners/${f}`;
							}
						}
						if (!bannerUrl && user.equippedCard) {
							const apiBase = Bun.env.API_PUBLIC_URL ?? "https://shenron.rpbey.fr";
							bannerUrl = `${apiBase}/assets/cards/${encodeURIComponent(user.equippedCard)}.png`;
						}

						return {
							discordId: user.id,
							username: dUser.username,
							avatar: dUser.avatarHash,
							avatarUrl,
							level,
							xp: user.xp,
							zeni: user.zeni,
							xpProgress: next
								? {
										current: user.xp,
										nextLevel: next.level,
										nextLevelXp: next.xp,
										needed: next.xp - user.xp,
								  }
								: null,
							banner: bannerUrl,
							equipped: {
								card: user.equippedCard,
								badge: user.equippedBadge,
								color: user.equippedColor,
								title: user.equippedTitle,
								banner: user.equippedBanner,
							},
							achievements: ach.map((a) => ({ code: a.code, unlockedAt: a.unlockedAt })),
							inventory: inv.map((i) => {
								const shop = shopByKey.get(i.itemKey);
								return {
									type: i.itemType,
									key: i.itemKey,
									name: shop?.name ?? i.itemKey,
									description: shop?.description ?? null,
								};
							}),
							fusion: fusionData,
						};
					}),

				"/api/public/shop": (req) =>
					publicCachedJson(req, 5 * 60_000, async () => {
						const dbs = container.resolve(DatabaseService);
						const items = await dbs.db.query.shopItems.findMany({
							where: (s, { eq: e }) => e(s.enabled, true),
						});
						return {
							items: items.map((i) => {
								let meta: Record<string, unknown> | undefined;
								if (i.meta) {
									try {
										meta = JSON.parse(i.meta);
									} catch {
										meta = undefined;
									}
								}
								// Convertit le bannerPath bot (assets/banners/...) en URL CDN site
								let preview: string | undefined;
								if (meta?.bannerPath && typeof meta.bannerPath === "string") {
									const fname = meta.bannerPath.split("/").pop();
									if (fname) preview = `/banners/${fname}`;
								}
								return {
									key: i.key,
									type: i.type,
									name: i.name,
									description: i.description,
									price: i.price,
									roleId: i.roleId,
									preview,
								};
							}),
						};
					}),

				"/api/public/leaderboard": (req) =>
					publicCachedJson(req, 15_000, async () => {
						const url = new URL(req.url);
						const limit = Math.min(
							Math.max(parseInt(url.searchParams.get("limit") ?? "100", 10) || 100, 1),
							500,
						);
						const enrich = url.searchParams.get("enrich") === "1";
						const dbs = container.resolve(DatabaseService);
						// Filtre xp > 0 — cohérent avec LevelService.top() slash /top.
						// Sans filter le classement renvoyait des users à 0 XP en fin
						// de liste (~5800 lignes ensureUser créées mais inactives).
						const rows = await dbs.db
							.select({ id: users.id, xp: users.xp, zeni: users.zeni })
							.from(users)
							.where(sql`${users.xp} > 0`)
							.orderBy(desc(users.xp))
							.limit(limit);

						if (!enrich) {
							return {
								leaderboard: rows.map((r, i) => ({
									rank: i + 1,
									discordId: r.id,
									username: null as string | null,
									avatarUrl: null as string | null,
									xp: r.xp,
									zeni: r.zeni,
									level: levelForXP(r.xp),
								})),
							};
						}

						// Enrich opt-in via cache Discord users (5 min). Concurrence
						// bornée (8) + deadline 7 s : cache chaud ≈ instantané, cache
						// froid borné (jamais de 502 par rate-limit storm). Les users
						// non résolus dans le budget → username null + avatar défaut.
						const enriched = await mapLimitDeadline(
							rows,
							8,
							7000,
							async (r, i) => {
								const u = await fetchDiscordUserCached(r.id);
								return {
									rank: i + 1,
									discordId: r.id,
									username: u.username,
									avatarUrl: discordAvatarUrl(r.id, u.avatarHash, 128),
									xp: r.xp,
									zeni: r.zeni,
									level: levelForXP(r.xp),
								};
							},
							(r, i) => ({
								rank: i + 1,
								discordId: r.id,
								username: null as string | null,
								avatarUrl: discordAvatarUrl(r.id, null, 128),
								xp: r.xp,
								zeni: r.zeni,
								level: levelForXP(r.xp),
							}),
						);
						return { leaderboard: enriched };
					}),

				// Stats globales pour widgets de homepage du site (compte users,
				// XP total distribué, zenis en circulation, succès débloqués).
				// Cache 15s (cohérent avec leaderboard pour éviter incohérence
				// totalXp = top.sum(xp) entre les deux endpoints).
				"/api/public/stats": (req) =>
					publicCachedJson(req, 15_000, async () => {
						const dbs = container.resolve(DatabaseService);
						const db = dbs.db;
						const [u] = await db
							.select({
								c: sql<number>`count(*)`,
								totalXp: sql<number>`coalesce(sum(xp), 0)`,
								totalZeni: sql<number>`coalesce(sum(zeni), 0)`,
							})
							.from(users);
						const [a] = await db
							.select({ c: sql<number>`count(*)` })
							.from(achievements);
						const [s] = await db
							.select({ c: sql<number>`count(*)` })
							.from(shopItems)
							.where(eq(shopItems.enabled, true));
						const [inv] = await db
							.select({ c: sql<number>`count(*)` })
							.from(inventory);
						return {
							users: Number(u?.c ?? 0),
							totalXp: Number(u?.totalXp ?? 0),
							totalZeni: Number(u?.totalZeni ?? 0),
							achievementsUnlocked: Number(a?.c ?? 0),
							shopItems: Number(s?.c ?? 0),
							inventoryItems: Number(inv?.c ?? 0),
						};
					}),

				// ── Personas + Commands publics (mirroring site) ────────────
				"/api/public/personas": (req) =>
					publicCachedJson(req, 5 * 60_000, async () => {
						const clientMap = container.resolve<Map<string, Client>>("ClientMap");
						const list = [];
						for (const id of PERSONA_IDS) {
							const c = clientMap.get(id);
							const cfg = PERSONAS[id];
							list.push({
								id,
								name: cfg.name,
								username: c?.user?.username ?? null,
								avatar: c?.user
									? `https://cdn.discordapp.com/avatars/${c.user.id}/${c.user.avatar}.webp?size=256`
									: null,
								online: c?.isReady() ?? false,
								wsPing: c?.ws?.ping ?? -1,
								intents: cfg.intents.length,
								guildCount: c?.guilds.cache.size ?? 0,
								commandCount: c
									? Client.applicationCommands.filter((cmd) =>
											cmd.isBotAllowed(id),
										).length
									: 0,
							});
						}
						return { personas: list };
					}),

				"/api/public/commands": (req) =>
					publicCachedJson(req, 5 * 60_000, async () => {
						const grouped: Record<
							string,
							Array<{
								name: string;
								description: string;
								type: number;
								options?: unknown[];
							}>
						> = {};
						for (const id of PERSONA_IDS) {
							const cmds = Client.applicationCommands
								.filter((c) => c.isBotAllowed(id))
								.map((c) => ({
									name: c.name,
									description: c.description ?? "",
									type: c.type ?? 1,
									options: c.options as unknown[],
								}));
							grouped[id] = cmds;
						}
						return { commands: grouped };
					}),

				// ── Wiki Dragon Ball (cache 1 h — données quasi statiques) ────
				"/api/public/wiki/characters": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const url = new URL(req.url);
						const query = url.searchParams.get("q");
						const wiki = container.resolve(WikiService);
						const characters = query ? await wiki.search(query) : await wiki.listAll();
						return { characters };
					}),

				"/api/public/wiki/characters/:id": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const id = parseInt(req.params.id, 10);
						if (!Number.isFinite(id)) throw new HttpError(400, "ID invalide");
						const wiki = container.resolve(WikiService);
						const character = await wiki.getCharacter(id);
						if (!character) throw new HttpError(404, "Personnage inconnu");
						return character;
					}),

				"/api/public/wiki/planets": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						return { planets: await wiki.listPlanets() };
					}),

				"/api/public/wiki/transformations": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						return { transformations: await wiki.listTransformations() };
					}),

				"/api/public/wiki/planets/:id": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const id = parseInt(req.params.id, 10);
						if (!Number.isFinite(id)) throw new HttpError(400, "ID invalide");
						const wiki = container.resolve(WikiService);
						const planet = await wiki.getPlanet(id);
						if (!planet) throw new HttpError(404, "Planète inconnue");
						return planet;
					}),

				"/api/public/wiki/races": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						return { races: await wiki.listRaces() };
					}),

				"/api/public/wiki/races/:slug": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						const r = await wiki.getRace(req.params.slug);
						if (!r) throw new HttpError(404, "Race inconnue");
						return r;
					}),

				"/api/public/wiki/techniques": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						return { techniques: await wiki.listTechniques() };
					}),

				"/api/public/wiki/techniques/:slug": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						const t = await wiki.getTechnique(req.params.slug);
						if (!t) throw new HttpError(404, "Technique inconnue");
						return t;
					}),

				"/api/public/wiki/sagas": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						return { sagas: await wiki.listSagas() };
					}),

				"/api/public/wiki/sagas/:slug": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						const s = await wiki.getSaga(req.params.slug);
						if (!s) throw new HttpError(404, "Saga inconnue");
						return s;
					}),

				"/api/public/wiki/arcs/:slug": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						const a = await wiki.getArc(req.params.slug);
						if (!a) throw new HttpError(404, "Arc inconnu");
						return a;
					}),

				"/api/public/wiki/episodes": (req) =>
					publicCachedJson(req, 30 * 60_000, async () => {
						const url = new URL(req.url);
						const series = url.searchParams.get("series");
						const limit = Math.min(
							parseInt(url.searchParams.get("limit") ?? "100", 10),
							500,
						);
						const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);
						const dbs = container.resolve(DatabaseService);
						const sql = series
							? "SELECT * FROM db_episodes WHERE series = ? ORDER BY number_in_series LIMIT ? OFFSET ?"
							: "SELECT * FROM db_episodes ORDER BY series, number_in_series LIMIT ? OFFSET ?";
						const episodes = series
							? dbs.sqlite.query(sql).all(series, limit, offset)
							: dbs.sqlite.query(sql).all(limit, offset);
						const total = series
							? (dbs.sqlite
									.query("SELECT COUNT(*) AS n FROM db_episodes WHERE series = ?")
									.get(series) as { n: number }).n
							: (dbs.sqlite.query("SELECT COUNT(*) AS n FROM db_episodes").get() as {
									n: number;
							  }).n;
						return { episodes, total, limit, offset };
					}),

				"/api/public/wiki/episodes/:id": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const id = parseInt(req.params.id, 10);
						if (!Number.isFinite(id)) throw new HttpError(400, "ID invalide");
						const wiki = container.resolve(WikiService);
						const ep = await wiki.getEpisodeById(id);
						if (!ep) throw new HttpError(404, "Épisode inconnu");
						return ep;
					}),

				"/api/public/wiki/movies": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						return { movies: await wiki.listMovies() };
					}),

				"/api/public/wiki/movies/:slug": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						const m = await wiki.getMovie(req.params.slug);
						if (!m) throw new HttpError(404, "Film inconnu");
						return m;
					}),

				"/api/public/wiki/games": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						return { games: await wiki.listGames() };
					}),

				"/api/public/wiki/games/:slug": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						const g = await wiki.getGame(req.params.slug);
						if (!g) throw new HttpError(404, "Jeu inconnu");
						return g;
					}),

				"/api/public/wiki/tools": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						return { tools: await wiki.listTools() };
					}),

				"/api/public/wiki/tools/:slug": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const wiki = container.resolve(WikiService);
						const t = await wiki.getTool(req.params.slug);
						if (!t) throw new HttpError(404, "Outil inconnu");
						return t;
					}),

				"/api/public/wiki/manga/volumes": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const url = new URL(req.url);
						const series = url.searchParams.get("series") ?? "DB";
						const wiki = container.resolve(WikiService);
						return { volumes: await wiki.listMangaVolumes(series) };
					}),

				"/api/public/wiki/manga/volumes/:id": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const id = parseInt(req.params.id, 10);
						if (!Number.isFinite(id)) throw new HttpError(400, "ID invalide");
						const wiki = container.resolve(WikiService);
						const v = await wiki.getMangaVolume(id);
						if (!v) throw new HttpError(404, "Volume inconnu");
						return v;
					}),

				"/api/public/wiki/news": (req) =>
					publicCachedJson(req, 5 * 60_000, async () => {
						const url = new URL(req.url);
						const limit = Math.min(
							parseInt(url.searchParams.get("limit") ?? "10", 10),
							100,
						);
						const wiki = container.resolve(WikiService);
						return { news: await wiki.listNews(limit) };
					}),

				"/api/public/wiki/search": (req) =>
					publicCachedJson(req, 5 * 60_000, async () => {
						const url = new URL(req.url);
						const q = (url.searchParams.get("q") ?? "").trim();
						if (q.length < 2) return { results: [], q };
						const dbs = container.resolve(DatabaseService);
						// Search both FTS5 (if populated) AND raw LIKE across canonical entities
						const like = `%${q}%`;
						const characters = dbs.sqlite
							.query(
								"SELECT id, name, name_ja, image, race FROM db_characters WHERE name LIKE ? OR name_ja LIKE ? OR name_romaji LIKE ? LIMIT 20",
							)
							.all(like, like, like);
						const planets = dbs.sqlite
							.query(
								"SELECT id, name, name_ja, image FROM db_planets WHERE name LIKE ? OR name_ja LIKE ? LIMIT 10",
							)
							.all(like, like);
						const sagas = dbs.sqlite
							.query(
								"SELECT id, slug, name, name_ja, series FROM db_sagas WHERE name LIKE ? OR name_ja LIKE ? LIMIT 10",
							)
							.all(like, like);
						const movies = dbs.sqlite
							.query(
								"SELECT id, slug, title, title_ja, series FROM db_movies WHERE title LIKE ? OR title_ja LIKE ? LIMIT 10",
							)
							.all(like, like);
						const games = dbs.sqlite
							.query(
								"SELECT id, slug, title, title_ja FROM db_games WHERE title LIKE ? OR title_ja LIKE ? LIMIT 10",
							)
							.all(like, like);
						return { q, characters, planets, sagas, movies, games };
					}),

				// RAG : recherche lexicale (BM25) sur l'index rag_chunks
				// (data structurée + corpus scrapé). Construit par rag-build.ts.
				"/api/public/rag/search": (req) =>
					publicCachedJson(req, 5 * 60_000, async () => {
						const url = new URL(req.url);
						const raw = (url.searchParams.get("q") ?? "").trim();
						const limit = Math.min(
							Math.max(Number(url.searchParams.get("limit") ?? 8), 1),
							25,
						);
						if (raw.length < 2) return { q: raw, results: [] };
						const dbs = container.resolve(DatabaseService);
						const tokens = raw
							.replace(/["*()]/g, " ")
							.split(/\s+/)
							.filter((t) => t.length > 1);
						if (tokens.length === 0) return { q: raw, results: [] };
						// OR entre tokens : récupération par pertinence BM25 (recall
						// large pour les questions naturelles), pas un AND strict.
						const match = tokens.map((t) => `"${t}"`).join(" OR ");
						try {
							const results = dbs.sqlite
								.query(
									"SELECT kind, title, url, snippet(rag_chunks, 3, '', '', '…', 18) AS snippet FROM rag_chunks WHERE rag_chunks MATCH ? ORDER BY rank LIMIT ?",
								)
								.all(match, limit);
							return { q: raw, results };
						} catch {
							return { q: raw, results: [], error: "index_unavailable" };
						}
					}),

				"/api/public/news": (req) =>
					publicCachedJson(req, 5 * 60_000, async () => {
						const url = new URL(req.url);
						const source = url.searchParams.get("source");
						const limit = Math.min(
							parseInt(url.searchParams.get("limit") ?? "20", 10),
							100,
						);
						const dbs = container.resolve(DatabaseService);
						const sql = source
							? "SELECT * FROM db_news WHERE source_id = ? ORDER BY published_at DESC LIMIT ?"
							: "SELECT * FROM db_news ORDER BY published_at DESC LIMIT ?";
						const news = source
							? dbs.sqlite.query(sql).all(source, limit)
							: dbs.sqlite.query(sql).all(limit);
						return { news, limit };
					}),

				"/api/public/assets": (req) =>
					publicCachedJson(req, 5 * 60_000, async () => {
						const url = new URL(req.url);
						const bucket = url.searchParams.get("bucket"); // path prefix
						const limit = Math.min(
							parseInt(url.searchParams.get("limit") ?? "50", 10),
							200,
						);
						const dbs = container.resolve(DatabaseService);
						const sql = bucket
							? "SELECT id, path, source_id, attribution, license_key, role FROM db_assets WHERE path LIKE ? ORDER BY id DESC LIMIT ?"
							: "SELECT id, path, source_id, attribution, license_key, role FROM db_assets ORDER BY id DESC LIMIT ?";
						const assets = bucket
							? dbs.sqlite.query(sql).all(`${bucket}%`, limit)
							: dbs.sqlite.query(sql).all(limit);
						return { assets };
					}),

				"/api/public/sources": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => {
						const dbs = container.resolve(DatabaseService);
						const sources = dbs.sqlite
							.query(
								"SELECT s.*, l.name AS license_name, l.url AS license_url FROM db_sources s JOIN db_licenses l ON s.license_key = l.key ORDER BY s.id",
							)
							.all();
						return { sources };
					}),

				// ── Cards profile dynamiques (public, cache 1 h) ──────────────
				// Le site Vercel peut faire `<img src="/api/public/profile/{id}/card.png"/>`
				// pour afficher la card profil DBZ. Cache mémoire LRU + ETag +
				// Vercel CDN = ~1 ms côté edge après warm-up.
				"/api/public/profile/:discordId/card.png": (req) =>
					publicCachedImage(
						req,
						async () => {
							const id = req.params.discordId;
							if (!/^\d{17,20}$/.test(id))
								throw new HttpError(400, "discordId invalide");
							const map = container.resolve<Map<string, Client>>("ClientMap");
							const shenron = map.get("shenron");
							if (!shenron) throw new HttpError(503, "Bot offline");
							const user = await shenron.users.fetch(id).catch(() => null);
							if (!user) throw new HttpError(404, "Utilisateur introuvable");
							const dbs = container.resolve(DatabaseService);
							const row = await dbs.db.query.users.findFirst({
								where: eq(users.id, id),
							});
							if (!row) throw new HttpError(404, "Profil bot introuvable");
							const card = container.resolve(CardService);
							return await card.render({
								discordUser: user,
								xp: row.xp,
								zeni: row.zeni,
								messageCount: row.messageCount,
								cardKey: row.equippedCard,
								badge: row.equippedBadge,
								title: row.equippedTitle,
								color: row.equippedColor,
							});
						},
						3600,
					),

				// Scanner de ki (gauge dynamique) — variante pour widget compact.
				"/api/public/profile/:discordId/scan.png": (req) =>
					publicCachedImage(
						req,
						async () => {
							const id = req.params.discordId;
							if (!/^\d{17,20}$/.test(id))
								throw new HttpError(400, "discordId invalide");
							const map = container.resolve<Map<string, Client>>("ClientMap");
							const shenron = map.get("shenron");
							if (!shenron) throw new HttpError(503, "Bot offline");
							const user = await shenron.users.fetch(id).catch(() => null);
							if (!user) throw new HttpError(404, "Utilisateur introuvable");
							const dbs = container.resolve(DatabaseService);
							const row = await dbs.db.query.users.findFirst({
								where: eq(users.id, id),
							});
							const xp = row?.xp ?? 0;
							const accent = xpAccent(xp);
							const gauge = container.resolve(GaugeService);
							const pct = Math.min(100, Math.round((xp / 9_000_000) * 100));
							return await gauge.render({
								user,
								title: "SCANNER DE KI",
								subtitle: "Lecture du potentiel",
								pct,
								accent,
								accentDark: "#0a0a0a",
							});
						},
						3600,
					),

				// ── A2A — Agent2Agent protocol (Claude ↔ Gemini bridge) ──────
				// Spec : JSON-RPC 2.0 over HTTP. Endpoint unique + AgentCard
				// discovery. Backé par les mêmes fichiers que le MCP server
				// `coord` (.coord/messages.jsonl, .coord/tasks.json) — un
				// message reçu via A2A apparaît dans read_messages MCP et vice
				// versa. Voir docs/a2a-protocol.md.
				"/.well-known/agent-card.json": (req) =>
					publicCachedJson(req, 60 * 60_000, async () => ({
						name: "shenron-coord",
						description:
							"Bridge A2A pour la coordination des agents DBFR (Claude Code ↔ Gemini CLI). Miroir HTTP du canal MCP `coord` (.coord/messages.jsonl + .coord/tasks.json). Compatible @a2a-js/sdk.",
						version: "1.1.0",
						protocolVersion: "0.3.0",
						url: "https://shenron.rpbey.fr/api/a2a/jsonrpc",
						provider: {
							organization: "DBFR / shenron.rpbey.fr",
							url: "https://shenron.rpbey.fr",
						},
						capabilities: {
							streaming: true,
							pushNotifications: false,
							stateTransitionHistory: true,
						},
						securitySchemes: {
							bearerAuth: {
								type: "http",
								scheme: "bearer",
								description:
									"Optional Bearer token (API_ADMIN_TOKEN). Public coord endpoints sont open par défaut.",
							},
						},
						security: [{ bearerAuth: [] }, {}],
						defaultInputModes: ["text"],
						defaultOutputModes: ["text"],
						supportsAuthenticatedExtendedCard: false,
						skills: [
							{
								id: "coord.messages",
								name: "Inter-agent messages",
								description:
									"Append/read messages between agents on the shared bus (.coord/messages.jsonl, flock-locked). SSE broadcast on /api/a2a/events.",
								tags: ["coord", "messaging"],
								examples: [
									"message/send avec params.to='gemini' params.message.parts=[{kind:'text',text:'...'}]",
									"message/stream pour subscribe SSE",
								],
								inputModes: ["text"],
								outputModes: ["text"],
							},
							{
								id: "coord.tasks",
								name: "Sprint tasks",
								description:
									"List/get/cancel tasks in the shared backlog (.coord/tasks.json). Atomic claim/complete via MCP server `coord` (flock /tmp/dbfr-tasks.lock).",
								tags: ["coord", "task-management"],
								examples: [
									"tasks/list params={status:'pending',agent:'gemini'}",
									"tasks/get params.id='shenron-01-fix-jail'",
									"tasks/cancel params.id='...'",
								],
								inputModes: ["text"],
								outputModes: ["text"],
							},
							{
								id: "coord.memory",
								name: "Shared markdown memory",
								description:
									"Read/write the cross-agent memory under .coord/memory/{shared,claude,gemini}.md and docs under .coord/docs/.",
								tags: ["coord", "memory"],
								examples: [
									"memory/read params.scope='shared'",
									"memory/append params.scope='claude' params.body='...'",
								],
								inputModes: ["text"],
								outputModes: ["text"],
							},
						],
					})),

				"/api/a2a/jsonrpc": (req) => a2aJsonRpc(req),
				"/api/a2a/events": (req) => a2aEventsStream(req),

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
				"/api/cron/:name/interval": {
					POST: admin(async (req) => {
						const name = req.params.name;
						const body = (await req.json().catch(() => ({}))) as {
							intervalMs?: number;
						};
						const intervalMs = Number(body.intervalMs);
						if (!Number.isFinite(intervalMs) || intervalMs < 1_000) {
							return Response.json(
								{ error: "intervalMs ≥ 1000 requis" },
								{ status: 400 },
							);
						}
						const settings = container.resolve(SettingsService);
						// Auto-déclare la clé si elle n'existe pas dans SETTINGS_KEYS — `set`
						// vérifie le catalogue donc on by-pass via direct DB upsert pour les
						// crons (clé dynamique connue uniquement au runtime via register).
						const dbs = container.resolve(DatabaseService);
						const { guildSettings } = await import("~/db/schema");
						await dbs.db
							.insert(guildSettings)
							.values({
								key: `cron.${name}.interval_ms`,
								value: String(intervalMs),
								updatedAt: new Date(),
							})
							.onConflictDoUpdate({
								target: guildSettings.key,
								set: { value: String(intervalMs), updatedAt: new Date() },
							});
						settings.invalidate();
						const cron = container.resolve(CronRegistry);
						const result = await cron.reload(name);
						return Response.json(result);
					}),
				},

				// ── Discord proxy (REST scoped sur la session OAuth user OU bot) ──
				// Toutes ces routes requièrent admin (cookie session OU Bearer admin).
				// Les routes en mode "Bearer" requièrent en plus une session OAuth Discord.
				"/api/discord/me": admin(async (req) => {
					const sess = await getDiscordSession(req);
					if (!sess) return Response.json({ error: "OAuth session requise" }, { status: 401 });
					try {
						const { data } = await discordFetch<any>("/users/@me", {
							mode: "Bearer",
							token: sess.payload.accessToken,
						});
						const headers = new Headers({ "Content-Type": "application/json" });
						if (sess.refreshedCookie) headers.append("Set-Cookie", sess.refreshedCookie);
						return new Response(JSON.stringify({ user: data }), { headers });
					} catch (err) {
						const status = err instanceof DiscordRESTError ? err.status : 500;
						return Response.json({ error: String(err) }, { status });
					}
				}),
				"/api/discord/guilds": admin(async (req) => {
					const sess = await getDiscordSession(req);
					if (!sess) return Response.json({ error: "OAuth session requise" }, { status: 401 });
					try {
						const { data } = await discordFetch<any[]>("/users/@me/guilds?with_counts=true", {
							mode: "Bearer",
							token: sess.payload.accessToken,
						});
						const guilds = data.map((g: any) => ({
							id: g.id,
							name: g.name,
							icon: g.icon,
							iconUrl: guildIcon(g.id, g.icon, { size: 128 }),
							owner: g.owner,
							permissions: g.permissions,
							features: g.features,
							approximate_member_count: g.approximate_member_count,
							approximate_presence_count: g.approximate_presence_count,
							isCurrent: g.id === env.GUILD_ID,
						}));
						const headers = new Headers({ "Content-Type": "application/json" });
						if (sess.refreshedCookie) headers.append("Set-Cookie", sess.refreshedCookie);
						return new Response(JSON.stringify({ guilds }), { headers });
					} catch (err) {
						const status = err instanceof DiscordRESTError ? err.status : 500;
						return Response.json({ error: String(err) }, { status });
					}
				}),
				"/api/discord/guild-member": admin(async (req) => {
					// Membership du user OAuth dans la guild courante (roles, nick, joined_at)
					const sess = await getDiscordSession(req);
					if (!sess) return Response.json({ error: "OAuth session requise" }, { status: 401 });
					try {
						const { data } = await discordFetch<any>(
							`/users/@me/guilds/${env.GUILD_ID}/member`,
							{ mode: "Bearer", token: sess.payload.accessToken },
						);
						const headers = new Headers({ "Content-Type": "application/json" });
						if (sess.refreshedCookie) headers.append("Set-Cookie", sess.refreshedCookie);
						return new Response(JSON.stringify({ member: data }), { headers });
					} catch (err) {
						const status = err instanceof DiscordRESTError ? err.status : 500;
						return Response.json({ error: String(err) }, { status });
					}
				}),
				"/api/discord/guild": admin(async () => {
					try {
						const { data } = await discordFetch<any>(
							`/guilds/${env.GUILD_ID}?with_counts=true`,
							{ mode: "Bot" },
						);
						return Response.json({ guild: data });
					} catch (err) {
						const status = err instanceof DiscordRESTError ? err.status : 500;
						return Response.json({ error: String(err) }, { status });
					}
				}),
				// ── Server-Sent Events ────────────────────────────────────────
				// Stream live des events bot → dashboard (sync sans poll).
				// Subscribers : 1 par tab dashboard ouvert.
				"/api/events": admin((req) => {
					const bus = container.resolve(EventBusService);
					const encoder = new TextEncoder();

					const stream = new ReadableStream({
						start(controller) {
							const send = (data: object) => {
								try {
									controller.enqueue(
										encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
									);
								} catch {
									// stream fermé côté client — on ignore
								}
							};

							// Hello immédiat
							send({ name: "hello", payload: { ts: Date.now(), subs: bus.size() } });

							// Subscribe
							const unsub = bus.subscribe((event) => send(event));

							// Keepalive 25s (nginx coupe à 60s par défaut)
							const ka = setInterval(() => send({ name: "ping", payload: { t: Date.now() } }), 25_000);

							// Abort sur fermeture client
							req.signal.addEventListener("abort", () => {
								clearInterval(ka);
								unsub();
								try {
									controller.close();
								} catch {}
							});
						},
					});

					return new Response(stream, {
						headers: {
							"Content-Type": "text/event-stream; charset=utf-8",
							"Cache-Control": "no-cache, no-transform",
							"Connection": "keep-alive",
							"X-Accel-Buffering": "no", // disable nginx buffering
						},
					});
				}),

				// ── Jeux jouables depuis le site (user-authenticated) ─────────
				// Auth : HMAC-SHA256(discordId:ts) via headers X-Acting-User/Ts/Sig.
				// Le proxy site `/api/bot-user/*` signe automatiquement.
				// Mêmes règles que les slash commands Discord (engines partagés).
				"/api/games/pfc/play": {
					POST: async (req) => {
						const userId = verifyActingUser(req);
						if (!userId) {
							return Response.json({ error: "Unauthorized" }, { status: 401 });
						}
						const body = (await req.json().catch(() => null)) as {
							choice?: unknown;
							stake?: number;
						} | null;
						if (!body || !isPfcChoice(body.choice)) {
							return Response.json({ error: "choice invalide" }, { status: 400 });
						}
						const stakeRaw = body.stake;
						const stake =
							typeof stakeRaw === "number" && stakeRaw > 0
								? Math.min(1_000_000, Math.floor(stakeRaw))
								: undefined;
						const eco = container.resolve(EconomyService);
						const settings = container.resolve(SettingsService);
						const balance = await eco.getBalance(userId);
						if (stake !== undefined && balance < stake) {
							return Response.json(
								{ error: `Solde insuffisant (${balance} z, mise ${stake})` },
								{ status: 400 },
							);
						}
						const defaultWin = await settings.getInt(
							"zeni.game.win",
							ZENI_GAME_WIN,
						);
						const defaultLoss = await settings.getInt(
							"zeni.game.loss_penalty",
							ZENI_GAME_LOSS_PENALTY,
						);
						const winReward = stake ?? defaultWin;
						const lossPenalty = stake ?? defaultLoss;

						const botChoice = decideBotChoice();
						const result = resolvePfc(body.choice, botChoice);
						let delta = 0;
						if (result === "win") {
							await eco.addZeni(userId, winReward);
							delta = winReward;
						} else if (result === "lose") {
							if (lossPenalty > 0) await eco.removeZeni(userId, lossPenalty);
							delta = -lossPenalty;
						}
						const newBalance = await eco.getBalance(userId);
						return Response.json({
							ok: true,
							player: body.choice,
							bot: botChoice,
							result,
							delta,
							balance: newBalance,
						});
					},
				},
				// Morpion vs bot — stateless HMAC. Le client renvoie son state
				// à chaque coup, le bot signe pour empêcher la forge d'un board
				// gagnant. Joueur = X, bot = O. `stake` figé au 1er coup.
				"/api/games/morpion/move": {
					POST: async (req) => {
						const userId = verifyActingUser(req);
						if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
						if (!env.API_USER_SECRET) {
							return Response.json({ error: "user-auth désactivé" }, { status: 503 });
						}
						const body = (await req.json().catch(() => null)) as {
							cell?: unknown;
							state?: { board?: string; sig?: string; ts?: number };
							stake?: number;
						} | null;
						const stakeRaw = body?.stake;
						const stake =
							typeof stakeRaw === "number" && stakeRaw > 0
								? Math.min(1_000_000, Math.floor(stakeRaw))
								: undefined;
						const eco = container.resolve(EconomyService);
						const settings = container.resolve(SettingsService);

						if (!body?.state) {
							if (stake !== undefined) {
								const bal = await eco.getBalance(userId);
								if (bal < stake) {
									return Response.json(
										{ error: `Solde insuffisant (${bal} z)` },
										{ status: 400 },
									);
								}
							}
							const board = emptyBoard();
							const ts = Date.now();
							return Response.json({
								board,
								sig: signMorpion(env.API_USER_SECRET, board, userId, stake ?? 0, ts),
								ts,
								stake: stake ?? 0,
								outcome: { kind: "playing" },
							});
						}

						const stateBoard = parseMorpionBoard(body.state.board);
						const stateTs = Number(body.state.ts);
						const stateStake = stake ?? 0;
						if (
							!stateBoard ||
							!body.state.sig ||
							!Number.isFinite(stateTs) ||
							Math.abs(Date.now() - stateTs) > 30 * 60 * 1000
						) {
							return Response.json({ error: "state invalide ou expiré" }, { status: 400 });
						}
						const expectedSig = signMorpion(
							env.API_USER_SECRET,
							stateBoard,
							userId,
							stateStake,
							stateTs,
						);
						if (!constantTimeEqualStr(expectedSig, body.state.sig)) {
							return Response.json({ error: "signature invalide" }, { status: 403 });
						}
						const cell = Number(body.cell);
						const move = applyMorpionMove(stateBoard, cell, "X");
						if (!move.ok) return Response.json({ error: move.error }, { status: 400 });
						let board = move.board;
						let outcome = evaluateBoard(board);
						let botCell: number | null = null;
						if (outcome.kind === "playing") {
							botCell = decideMorpionMove(board, "O");
							const botMove = applyMorpionMove(board, botCell, "O");
							if (botMove.ok) {
								board = botMove.board;
								outcome = evaluateBoard(board);
							}
						}
						let delta = 0;
						let balance: number | undefined;
						if (outcome.kind === "won" || outcome.kind === "draw") {
							const defaultWin = await settings.getInt("zeni.game.win", ZENI_GAME_WIN);
							const defaultLoss = await settings.getInt(
								"zeni.game.loss_penalty",
								ZENI_GAME_LOSS_PENALTY,
							);
							const winReward = stateStake || defaultWin;
							const lossPenalty = stateStake || defaultLoss;
							if (outcome.kind === "won" && outcome.mark === "X") {
								await eco.addZeni(userId, winReward);
								delta = winReward;
							} else if (outcome.kind === "won" && outcome.mark === "O") {
								if (lossPenalty > 0) await eco.removeZeni(userId, lossPenalty);
								delta = -lossPenalty;
							}
							balance = await eco.getBalance(userId);
						}
						const ts = Date.now();
						return Response.json({
							board,
							sig: signMorpion(env.API_USER_SECRET, board, userId, stateStake, ts),
							ts,
							stake: stateStake,
							outcome,
							botCell,
							delta,
							balance,
						});
					},
				},

				// Bingo vs bot — stateless : target chiffré dans token HMAC,
				// 10 essais max, hints "plus haut/plus bas".
				"/api/games/bingo/play": {
					POST: async (req) => {
						const userId = verifyActingUser(req);
						if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
						if (!env.API_USER_SECRET) {
							return Response.json({ error: "user-auth désactivé" }, { status: 503 });
						}
						const body = (await req.json().catch(() => null)) as {
							token?: string;
							guess?: unknown;
							stake?: number;
						} | null;
						const stakeRaw = body?.stake;
						const stake =
							typeof stakeRaw === "number" && stakeRaw > 0
								? Math.min(1_000_000, Math.floor(stakeRaw))
								: undefined;
						const eco = container.resolve(EconomyService);
						const settings = container.resolve(SettingsService);

						if (!body?.token) {
							if (stake !== undefined) {
								const bal = await eco.getBalance(userId);
								if (bal < stake) {
									return Response.json(
										{ error: `Solde insuffisant (${bal} z)` },
										{ status: 400 },
									);
								}
							}
							const target = randomBingoTarget();
							const ts = Date.now();
							const token = packBingoToken(
								env.API_USER_SECRET,
								userId,
								target,
								stake ?? 0,
								0,
								ts,
							);
							return Response.json({
								token,
								ts,
								attempts: 0,
								max: BINGO_MAX,
								min: BINGO_MIN,
							});
						}

						const parsed = unpackBingoToken(env.API_USER_SECRET, body.token, userId);
						if (!parsed) {
							return Response.json({ error: "token invalide ou expiré" }, { status: 403 });
						}
						const guess = Number(body.guess);
						const hint = compareBingoGuess(guess, parsed.target);
						if (hint === "out-of-range") {
							return Response.json(
								{ error: `Nombre entre ${BINGO_MIN} et ${BINGO_MAX}` },
								{ status: 400 },
							);
						}
						const attempts = parsed.attempts + 1;
						if (hint === "match") {
							const defaultWin = await settings.getInt("zeni.game.win", ZENI_GAME_WIN);
							const winReward = parsed.stake || defaultWin;
							await eco.addZeni(userId, winReward);
							const balance = await eco.getBalance(userId);
							return Response.json({
								hint,
								target: parsed.target,
								attempts,
								delta: winReward,
								balance,
							});
						}
						if (attempts >= 10) {
							const defaultLoss = await settings.getInt(
								"zeni.game.loss_penalty",
								ZENI_GAME_LOSS_PENALTY,
							);
							const lossPenalty = parsed.stake || defaultLoss;
							if (lossPenalty > 0) await eco.removeZeni(userId, lossPenalty);
							const balance = await eco.getBalance(userId);
							return Response.json({
								hint: "lost",
								target: parsed.target,
								attempts,
								delta: -lossPenalty,
								balance,
							});
						}
						const ts = Date.now();
						const token = packBingoToken(
							env.API_USER_SECRET,
							userId,
							parsed.target,
							parsed.stake,
							attempts,
							ts,
						);
						return Response.json({ hint, attempts, token, ts });
					},
				},
				"/api/games/pendu/new": {
					POST: async () =>
						Response.json({ error: "WIP — UI Pendu round suivant" }, { status: 501 }),
				},

				// ── Shop CRUD (admin) ─────────────────────────────────────────
				"/api/shop": {
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as {
							key?: string;
							type?: "card" | "badge" | "color" | "title" | "banner";
							name?: string;
							description?: string | null;
							price?: number;
							role_id?: string | null;
							meta?: string | null;
							enabled?: boolean;
						} | null;
						if (!body?.key || !body?.type || !body?.name || typeof body.price !== "number") {
							return Response.json(
								{ error: "key, type, name, price requis" },
								{ status: 400 },
							);
						}
						try {
							const dbs = container.resolve(DatabaseService);
							await dbs.db.insert(shopItems).values({
								key: body.key,
								type: body.type,
								name: body.name,
								description: body.description ?? null,
								price: body.price,
								roleId: body.role_id ?? null,
								meta: body.meta ?? null,
								enabled: body.enabled ?? true,
							});
							invalidateJsonCache("/api/shop");
							return Response.json({ ok: true, key: body.key });
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "insert failed" },
								{ status: 400 },
							);
						}
					}),
				},
				"/api/shop/:key": {
					PUT: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
						if (!body) return Response.json({ error: "JSON body requis" }, { status: 400 });
						try {
							const dbs = container.resolve(DatabaseService);
							const patch: Record<string, unknown> = {};
							if (typeof body.name === "string") patch.name = body.name;
							if (typeof body.description === "string" || body.description === null)
								patch.description = body.description;
							if (typeof body.price === "number") patch.price = body.price;
							if (typeof body.role_id === "string" || body.role_id === null) patch.roleId = body.role_id;
							if (typeof body.meta === "string" || body.meta === null) patch.meta = body.meta;
							if (typeof body.enabled === "boolean") patch.enabled = body.enabled;
							if (typeof body.type === "string") patch.type = body.type;
							await dbs.db.update(shopItems).set(patch).where(eq(shopItems.key, req.params.key));
							invalidateJsonCache("/api/shop");
							return Response.json({ ok: true });
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "update failed" },
								{ status: 400 },
							);
						}
					}),
					DELETE: admin(async (req) => {
						const dbs = container.resolve(DatabaseService);
						await dbs.db.delete(shopItems).where(eq(shopItems.key, req.params.key));
						invalidateJsonCache("/api/shop");
						return Response.json({ ok: true });
					}),
					PATCH: admin(async (req) => {
						// Toggle enabled
						const dbs = container.resolve(DatabaseService);
						const item = await dbs.db.query.shopItems.findFirst({
							where: eq(shopItems.key, req.params.key),
						});
						if (!item) return Response.json({ error: "Item introuvable" }, { status: 404 });
						await dbs.db
							.update(shopItems)
							.set({ enabled: !item.enabled })
							.where(eq(shopItems.key, req.params.key));
						invalidateJsonCache("/api/shop");
						return Response.json({ ok: true, enabled: !item.enabled });
					}),
				},

				// ── Settings set/unset ────────────────────────────────────────
				"/api/settings/:key": {
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as { value?: unknown } | null;
						if (!body || body.value === undefined) {
							return Response.json({ error: "{ value } requis" }, { status: 400 });
						}
						const svc = container.resolve(SettingsService);
						try {
							const value = typeof body.value === "string" ? body.value : JSON.stringify(body.value);
							await svc.set(req.params.key, value);
							return Response.json({ ok: true, key: req.params.key, value });
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "set failed" },
								{ status: 400 },
							);
						}
					}),
					DELETE: admin(async (req) => {
						const svc = container.resolve(SettingsService);
						await svc.unset(req.params.key);
						return Response.json({ ok: true });
					}),
				},

				// ── Triggers CRUD (achievement_triggers) ──────────────────────
				"/api/triggers": {
					GET: admin(async () => {
						const dbs = container.resolve(DatabaseService);
						const rows = await dbs.db.select().from(achievementTriggers);
						return Response.json({ rows });
					}),
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as {
							code?: string;
							description?: string | null;
							pattern?: string;
							flags?: string;
							enabled?: boolean;
						} | null;
						if (!body?.code || !body?.pattern) {
							return Response.json(
								{ error: "code, pattern requis" },
								{ status: 400 },
							);
						}
						try {
							// Validate regex
							new RegExp(body.pattern, body.flags ?? "i");
						} catch (err) {
							return Response.json(
								{ error: `regex invalide : ${err instanceof Error ? err.message : err}` },
								{ status: 400 },
							);
						}
						try {
							const dbs = container.resolve(DatabaseService);
							await dbs.db.insert(achievementTriggers).values({
								code: body.code,
								description: body.description ?? null,
								pattern: body.pattern,
								flags: body.flags ?? "i",
								enabled: body.enabled ?? true,
							});
							return Response.json({ ok: true, code: body.code });
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "insert failed" },
								{ status: 400 },
							);
						}
					}),
				},
				"/api/triggers/:code": {
					PUT: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
						if (!body) return Response.json({ error: "JSON body requis" }, { status: 400 });
						if (typeof body.pattern === "string") {
							try {
								new RegExp(body.pattern, (body.flags as string) ?? "i");
							} catch (err) {
								return Response.json(
									{ error: `regex invalide : ${err instanceof Error ? err.message : err}` },
									{ status: 400 },
								);
							}
						}
						const dbs = container.resolve(DatabaseService);
						const patch: Record<string, unknown> = {};
						if (typeof body.description === "string" || body.description === null) patch.description = body.description;
						if (typeof body.pattern === "string") patch.pattern = body.pattern;
						if (typeof body.flags === "string") patch.flags = body.flags;
						if (typeof body.enabled === "boolean") patch.enabled = body.enabled;
						await dbs.db.update(achievementTriggers).set(patch).where(eq(achievementTriggers.code, req.params.code));
						return Response.json({ ok: true });
					}),
					DELETE: admin(async (req) => {
						const dbs = container.resolve(DatabaseService);
						await dbs.db.delete(achievementTriggers).where(eq(achievementTriggers.code, req.params.code));
						return Response.json({ ok: true });
					}),
				},

				// ── Discord direct send (depuis site admin) ───────────────────
				// Envoie un message dans un salon Discord via une persona donnée.
				// Body : { channelId: string, content?: string, embed?: object,
				//          persona?: PersonaId (défaut: shenron) }
				"/api/discord/send": {
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as {
							channelId?: string;
							content?: string;
							embed?: Record<string, unknown>;
							persona?: PersonaId;
						} | null;
						if (!body?.channelId) {
							return Response.json({ error: "channelId requis" }, { status: 400 });
						}
						if (!body.content && !body.embed) {
							return Response.json({ error: "content ou embed requis" }, { status: 400 });
						}
						const personaId = (body.persona ?? "shenron") as PersonaId;
						if (!PERSONA_IDS.includes(personaId)) {
							return Response.json({ error: "persona invalide" }, { status: 400 });
						}
						const clientMap = container.resolve<Map<PersonaId, Client>>("ClientMap");
						const client = clientMap.get(personaId);
						if (!client) {
							return Response.json({ error: "persona offline" }, { status: 503 });
						}
						try {
							const channel = await client.channels.fetch(body.channelId);
							if (!channel || !channel.isTextBased() || !("send" in channel)) {
								return Response.json({ error: "salon textuel introuvable" }, { status: 404 });
							}
							const sent = await (channel as TextChannel).send({
								content: body.content ?? undefined,
								embeds: body.embed ? [body.embed as APIEmbed] : undefined,
							});
							return Response.json({
								ok: true,
								messageId: sent.id,
								url: `https://discord.com/channels/${sent.guildId}/${sent.channelId}/${sent.id}`,
							});
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "envoi échoué" },
								{ status: 500 },
							);
						}
					}),
				},

				// ── Settings schema (catalogue SETTINGS_KEYS + valeur courante) ──
				"/api/settings/schema": admin(async () => {
					const { SETTINGS_KEYS } = await import("~/services/SettingsService");
					const svc = container.resolve(SettingsService);
					const overrides = await svc.list();
					const currentMap = new Map(overrides.map((o) => [o.key, o.value]));
					const keys = SETTINGS_KEYS.map((k) => ({
						...k,
						current: currentMap.get(k.key) ?? null,
					}));
					return Response.json({ keys });
				}),

				// ── Webhooks (CRUD + exécution) ──────────────────────────────
				"/api/webhooks": admin(async (req) => {
					const url = new URL(req.url);
					const channelId = url.searchParams.get("channel_id");
					try {
						const list = channelId
							? await listChannelWebhooks(channelId)
							: await listGuildWebhooks(env.GUILD_ID);
						return Response.json({ webhooks: list });
					} catch (err) {
						const status = err instanceof DiscordRESTError ? err.status : 500;
						return Response.json({ error: String(err) }, { status });
					}
				}),
				"/api/webhooks/create": {
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as {
							channel_id?: string;
							name?: string;
							avatar?: string | null;
						} | null;
						if (!body?.channel_id || !body.name) {
							return Response.json(
								{ error: "Body attendu : { channel_id, name, avatar? }" },
								{ status: 400 },
							);
						}
						try {
							const webhook = await createChannelWebhook(body.channel_id, {
								name: body.name,
								avatar: body.avatar ?? null,
							});
							return Response.json({ webhook });
						} catch (err) {
							const status = err instanceof DiscordRESTError ? err.status : 500;
							return Response.json({ error: String(err) }, { status });
						}
					}),
				},
				"/api/webhooks/:id": {
					DELETE: admin(async (req) => {
						try {
							await deleteWebhook(req.params.id);
							return Response.json({ ok: true });
						} catch (err) {
							const status = err instanceof DiscordRESTError ? err.status : 500;
							return Response.json({ error: String(err) }, { status });
						}
					}),
				},
				"/api/webhooks/execute": {
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as
							| (ExecuteWebhookPayload & { url?: string; wait?: boolean })
							| null;
						if (!body?.url) {
							return Response.json(
								{
									error:
										"Body attendu : { url, content?, embeds?, username?, avatar_url?, wait? }",
								},
								{ status: 400 },
							);
						}
						const { url, wait, ...payload } = body;
						try {
							const result = await executeWebhook(url, payload, { wait });
							return Response.json({ ok: true, message: result });
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : String(err) },
								{ status: 500 },
							);
						}
					}),
				},

				"/api/discord/audit-logs": admin(async (req) => {
					const url = new URL(req.url);
					const params = new URLSearchParams();
					const limit = Math.min(100, Number(url.searchParams.get("limit")) || 50);
					params.set("limit", String(limit));
					const at = url.searchParams.get("action_type");
					if (at) params.set("action_type", at);
					const before = url.searchParams.get("before");
					if (before) params.set("before", before);
					const userId = url.searchParams.get("user_id");
					if (userId) params.set("user_id", userId);
					try {
						const { data } = await discordFetch<any>(
							`/guilds/${env.GUILD_ID}/audit-logs?${params}`,
							{ mode: "Bot" },
						);
						return Response.json(data);
					} catch (err) {
						const status = err instanceof DiscordRESTError ? err.status : 500;
						return Response.json({ error: String(err) }, { status });
					}
				}),

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
				"/api/levels/rewards": {
					GET: admin(async () => {
						const dbs = container.resolve(DatabaseService);
						const rows = await dbs.db.select().from(levelRewards).orderBy(levelRewards.level);
						return Response.json({ rewards: rows });
					}),
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as {
							level?: number;
							roleId?: string;
							xpThreshold?: number;
							zeniBonus?: number;
						} | null;
						if (
							!body ||
							typeof body.level !== "number" ||
							!body.roleId ||
							typeof body.xpThreshold !== "number"
						) {
							return Response.json(
								{ error: "Body attendu : { level, roleId, xpThreshold, zeniBonus? }" },
								{ status: 400 },
							);
						}
						// Hiérarchie : refuser si rôle au-dessus du bot (sinon attribution silencieuse échoue)
						const client = container.resolve(Client);
						const guild = client.guilds.cache.get(env.GUILD_ID);
						const botMember = guild?.members.me;
						const targetRole = guild?.roles.cache.get(body.roleId);
						if (!targetRole) {
							return Response.json({ error: "Rôle introuvable dans la guild" }, { status: 404 });
						}
						if (botMember && targetRole.position >= botMember.roles.highest.position) {
							return Response.json(
								{
									error: `Rôle "${targetRole.name}" au-dessus du bot — l'attribution échouera silencieusement. Replacer le rôle du bot plus haut dans la hiérarchie.`,
								},
								{ status: 400 },
							);
						}
						const dbs = container.resolve(DatabaseService);
						await dbs.db
							.insert(levelRewards)
							.values({
								level: body.level,
								roleId: body.roleId,
								xpThreshold: body.xpThreshold,
								zeniBonus: body.zeniBonus ?? 1000,
							})
							.onConflictDoUpdate({
								target: levelRewards.level,
								set: {
									roleId: body.roleId,
									xpThreshold: body.xpThreshold,
									zeniBonus: body.zeniBonus ?? 1000,
								},
							});
						container.resolve(EventBusService).emit("levels:rewards:changed", {
							level: body.level,
							action: "upsert",
						});
						return Response.json({ ok: true });
					}),
				},
				"/api/levels/rewards/:level": {
					DELETE: admin(async (req) => {
						const level = Number(req.params.level);
						if (!Number.isFinite(level)) {
							return Response.json({ error: "level invalide" }, { status: 400 });
						}
						const dbs = container.resolve(DatabaseService);
						await dbs.db.delete(levelRewards).where(eq(levelRewards.level, level));
						container.resolve(EventBusService).emit("levels:rewards:changed", {
							level,
							action: "delete",
						});
						return Response.json({ ok: true });
					}),
				},
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

				// ── Canvas (rendu PNG via @aphrody-code/canvas) ────────────────────
				// Tous les services renvoient Buffer<PNG>, on les wrappe en Response.
				// Cache HTTP 60 s pour amortir le coût Skia (100 ms - 1 s par render).
				"/api/canvas/profile/:userId": admin((req) =>
					cachedImage(req, async () => {
						const client = container.resolve(Client);
						const userId = req.params.userId;
						const user = await client.users.fetch(userId).catch(() => null);
						if (!user) throw new HttpError(404, "Utilisateur introuvable");
						const dbs = container.resolve(DatabaseService);
						const rows = await dbs.db.select().from(users).where(eq(users.id, userId)).limit(1);
						const row = rows[0];
						if (!row) throw new HttpError(404, "Pas de profil en base");
						const url = new URL(req.url);
						const card = container.resolve(CardService);
						return await card.render({
							discordUser: user,
							xp: row.xp,
							zeni: row.zeni,
							messageCount: row.messageCount,
							cardKey: url.searchParams.get("theme") ?? row.equippedCard,
							badge: row.equippedBadge,
							title: row.equippedTitle,
							color: row.equippedColor,
						});
					}),
				),
				"/api/canvas/scan/:userId": admin((req) =>
					cachedImage(req, async () => {
						const client = container.resolve(Client);
						const userId = req.params.userId;
						const user = await client.users.fetch(userId).catch(() => null);
						if (!user) throw new HttpError(404, "Utilisateur introuvable");
						const levels = container.resolve(LevelService);
						const row = await levels.getUser(userId);
						const xp = row?.xp ?? 0;
						const accent = xpAccent(xp);
						const gauge = container.resolve(GaugeService);
						const pct = Math.min(100, Math.round((xp / 9_000_000) * 100));
						return await gauge.render({
							user,
							title: "SCANNER DE KI",
							subtitle: "Lecture du potentiel",
							pct,
							accent,
							accentDark: "#0a0a0a",
						});
					}),
				),
				"/api/canvas/scouter/:userId": admin((req) =>
					cachedImage(req, async () => {
						const client = container.resolve(Client);
						const userId = req.params.userId;
						const user = await client.users.fetch(userId).catch(() => null);
						if (!user) throw new HttpError(404, "Utilisateur introuvable");
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
						return await gauge.render({ user, ...config, pct });
					}),
				),
				"/api/canvas/fusion": admin((req) =>
					cachedImage(req, async () => {
						const client = container.resolve(Client);
						const url = new URL(req.url);
						const aId = url.searchParams.get("a");
						const bId = url.searchParams.get("b");
						if (!aId || !bId) {
							throw new HttpError(400, "Paramètres a + b requis (IDs Discord)");
						}
						const [a, b] = await Promise.all([
							client.users.fetch(aId).catch(() => null),
							client.users.fetch(bId).catch(() => null),
						]);
						if (!a || !b) throw new HttpError(404, "Utilisateur(s) introuvable(s)");
						const state = (url.searchParams.get("state") ?? "success") as "propose" | "success";
						const fusedName =
							url.searchParams.get("name") ?? `${a.username.slice(0, 4)}${b.username.slice(0, 4)}`;
						const fusion = container.resolve(FusionService);
						return await fusion.render({ a, b, state, fusedName });
					}),
				),
				"/api/canvas/leaderboard": admin((req) =>
					cachedImage(req, async () => {
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
						return await lb.render(entries, {
							title: metric === "zeni" ? "Classement zénis" : "Classement XP",
							subtitle: `Top ${entries.length} joueurs`,
							page: 1,
							totalPages: 1,
						});
					}),
				),
				// ── Card themes CRUD (canvas profile) ─────────────────────────
				"/api/card-themes": {
					GET: admin(async () => {
						const dbs = container.resolve(DatabaseService);
						const { cardThemes } = await import("~/db/schema");
						const rows = await dbs.db.select().from(cardThemes);
						return Response.json({ rows });
					}),
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as {
							id?: string;
							name?: string;
							accent?: string;
							aura?: string;
							bgGrad1?: string;
							bgGrad2?: string;
							bgGrad3?: string;
							bgFile?: string | null;
							textShadow?: string;
							overlayOpacity?: number;
							tintStrength?: number;
							gradientAngle?: number;
							enabled?: boolean;
						} | null;
						if (
							!body?.id ||
							!body?.name ||
							!body?.accent ||
							!body?.aura ||
							!body?.bgGrad1 ||
							!body?.bgGrad2 ||
							!body?.bgGrad3 ||
							!body?.textShadow
						) {
							return Response.json(
								{ error: "id/name/accent/aura/bgGrad1-3/textShadow requis" },
								{ status: 400 },
							);
						}
						try {
							const dbs = container.resolve(DatabaseService);
							const { cardThemes } = await import("~/db/schema");
							const { CardService } = await import("~/services/CardService");
							await dbs.db.insert(cardThemes).values({
								id: body.id,
								name: body.name,
								accent: body.accent,
								aura: body.aura,
								bgGrad1: body.bgGrad1,
								bgGrad2: body.bgGrad2,
								bgGrad3: body.bgGrad3,
								bgFile: body.bgFile ?? null,
								textShadow: body.textShadow,
								overlayOpacity:
									typeof body.overlayOpacity === "number" ? body.overlayOpacity : 0.78,
								tintStrength:
									typeof body.tintStrength === "number" ? body.tintStrength : 0.08,
								gradientAngle:
									typeof body.gradientAngle === "number" ? body.gradientAngle : 135,
								enabled: body.enabled ?? true,
							});
							container.resolve(CardService).invalidateThemes();
							return Response.json({ ok: true, id: body.id });
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "insert failed" },
								{ status: 400 },
							);
						}
					}),
				},
				"/api/card-themes/:id": {
					PUT: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
						if (!body) return Response.json({ error: "JSON body requis" }, { status: 400 });
						const dbs = container.resolve(DatabaseService);
						const { cardThemes } = await import("~/db/schema");
						const { CardService } = await import("~/services/CardService");
						const patch: Record<string, unknown> = {};
						for (const k of ["name", "accent", "aura", "bgGrad1", "bgGrad2", "bgGrad3", "textShadow"]) {
							if (typeof body[k] === "string") patch[k] = body[k];
						}
						if (typeof body.bgFile === "string" || body.bgFile === null) patch.bgFile = body.bgFile;
						if (typeof body.enabled === "boolean") patch.enabled = body.enabled;
						const clamp = (v: number, lo: number, hi: number) =>
							Math.max(lo, Math.min(hi, v));
						if (typeof body.overlayOpacity === "number")
							patch.overlayOpacity = clamp(body.overlayOpacity, 0, 1);
						if (typeof body.tintStrength === "number")
							patch.tintStrength = clamp(body.tintStrength, 0, 1);
						if (typeof body.gradientAngle === "number")
							patch.gradientAngle = clamp(Math.round(body.gradientAngle), 0, 360);
						await dbs.db
							.update(cardThemes)
							.set(patch)
							.where(eq(cardThemes.id, req.params.id));
						container.resolve(CardService).invalidateThemes();
						return Response.json({ ok: true });
					}),
					DELETE: admin(async (req) => {
						const dbs = container.resolve(DatabaseService);
						const { cardThemes } = await import("~/db/schema");
						const { CardService } = await import("~/services/CardService");
						await dbs.db.delete(cardThemes).where(eq(cardThemes.id, req.params.id));
						container.resolve(CardService).invalidateThemes();
						return Response.json({ ok: true });
					}),
				},

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
				"/api/discord/channels": admin((req) =>
					cachedJson(req, async () => {
						const client = container.resolve(Client);
						const guild = client.guilds.cache.get(env.GUILD_ID);
						if (!guild) return { channels: [], count: 0 };
						const channels = [...guild.channels.cache.values()].map((c) => ({
							id: c.id,
							name: c.name,
							type: c.type,
							parentId: c.parentId,
							position: "position" in c ? c.position : 0,
						}));
						channels.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
						return { channels, count: channels.length };
					}, 30_000),
				),
				"/api/discord/roles": admin((req) =>
					cachedJson(req, async () => {
						const client = container.resolve(Client);
						const guild = client.guilds.cache.get(env.GUILD_ID);
						if (!guild) return { roles: [], count: 0 };
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
						return { roles, count: roles.length };
					}, 30_000),
				),
				"/api/discord/members": admin((req) =>
					cachedJson(
						req,
						async () => {
							const client = container.resolve(Client);
							const guild = client.guilds.cache.get(env.GUILD_ID);
							if (!guild) return { members: [], count: 0, total: 0 };
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
							return {
								members: result,
								count: result.length,
								total: guild.memberCount,
							};
						},
						60_000,
					),
				),
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
				"/api/messages": admin((req) =>
					cachedJson(
						req,
						async () => {
							const svc = container.resolve(MessageTemplateService);
							return { events: await svc.list() };
						},
						30_000,
					),
				),
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
							invalidateJsonCache("/api/messages");
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
						invalidateJsonCache("/api/messages");
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

				// ── Modération (page dédiée /moderation) ──────────────────────
				"/api/moderation/stats": admin(async () => {
					const mod = container.resolve(ModerationService);
					return Response.json(await mod.statsWindow());
				}),
				"/api/moderation/warns": admin(async (req) => {
					const url = new URL(req.url);
					const userId = url.searchParams.get("userId") ?? undefined;
					const mod = container.resolve(ModerationService);
					if (userId) {
						const rows = await mod.listActiveWarns(userId);
						return Response.json({ rows, total: rows.length });
					}
					const limit = Math.min(200, Number(url.searchParams.get("limit")) || 100);
					const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);
					return Response.json(await mod.listAllActiveWarns(limit, offset));
				}),
				"/api/moderation/warns/:id": {
					DELETE: admin(async (req) => {
						const id = Number(req.params.id);
						if (!Number.isFinite(id)) {
							return Response.json({ error: "id invalide" }, { status: 400 });
						}
						const mod = container.resolve(ModerationService);
						const ok = await mod.unwarnById(id);
						if (!ok) return Response.json({ error: "warn introuvable ou déjà inactif" }, { status: 404 });
						return Response.json({ ok: true });
					}),
				},
				"/api/moderation/warns/clear/:userId": {
					POST: admin(async (req) => {
						const userId = req.params.userId;
						const mod = container.resolve(ModerationService);
						const removed = await mod.clearWarns(userId, "dashboard");
						return Response.json({ ok: true, removed });
					}),
				},
				"/api/moderation/jails": admin(async (req) => {
					const url = new URL(req.url);
					const limit = Math.min(200, Number(url.searchParams.get("limit")) || 100);
					const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);
					const mod = container.resolve(ModerationService);
					return Response.json(await mod.listActiveJails(limit, offset));
				}),
				"/api/moderation/jails/:userId": {
					DELETE: admin(async (req) => {
						const userId = req.params.userId;
						const client = container.resolve(Client);
						const guild = client.guilds.cache.get(env.GUILD_ID);
						if (!guild) return Response.json({ error: "guild absente" }, { status: 503 });
						const mod = container.resolve(ModerationService);
						const ok = await mod.unjail(guild, userId, "dashboard", "unjail via dashboard");
						if (!ok) return Response.json({ error: "membre introuvable ou pas en jail" }, { status: 404 });
						return Response.json({ ok: true });
					}),
				},
				// ── Hiérarchie staff ──────────────────────────────────────────
				"/api/moderation/hierarchy": {
					GET: admin(async () => {
						const settings = container.resolve(SettingsService);
						const raw = (await settings.getRaw("moderation.hierarchy")) ?? "[]";
						let parsed: string[][] = [];
						try {
							const p = JSON.parse(raw);
							if (Array.isArray(p)) parsed = p as string[][];
						} catch {}
						return Response.json({ levels: parsed, raw });
					}),
					PUT: admin(async (req) => {
						const body = (await req.json().catch(() => null)) as
							| { levels?: string[][] }
							| null;
						if (!body || !Array.isArray(body.levels)) {
							return Response.json(
								{ error: "Body attendu : { levels: string[][] }" },
								{ status: 400 },
							);
						}
						// Validation : chaque niveau = array de snowflakes
						for (const lvl of body.levels) {
							if (!Array.isArray(lvl)) {
								return Response.json({ error: "Chaque niveau doit être un array." }, { status: 400 });
							}
							for (const r of lvl) {
								if (typeof r !== "string" || !/^\d{17,20}$/.test(r)) {
									return Response.json({ error: `Snowflake invalide : ${r}` }, { status: 400 });
								}
							}
						}
						const settings = container.resolve(SettingsService);
						const value = JSON.stringify(body.levels);
						await settings.set("moderation.hierarchy", value);
						return Response.json({ ok: true, levels: body.levels });
					}),
				},

				// ── Tickets (list + close) ────────────────────────────────────
				"/api/tickets": admin(async (req) => {
					const url = new URL(req.url);
					const closed = url.searchParams.get("closed");
					const dbs = container.resolve(DatabaseService);
					const { tickets } = await import("~/db/schema");
					const { desc, eq } = await import("drizzle-orm");
					const where =
						closed === "true"
							? eq(tickets.closed, true)
							: closed === "false"
								? eq(tickets.closed, false)
								: undefined;
					const q = dbs.db.select().from(tickets).orderBy(desc(tickets.createdAt));
					const rows = where ? await q.where(where) : await q;
					return Response.json({ rows, total: rows.length });
				}),
				"/api/tickets/:channelId/close": {
					POST: admin(async (req) => {
						const channelId = req.params.channelId;
						const tsvc = container.resolve(TicketService);
						const ok = await tsvc.close(channelId, "dashboard");
						if (!ok) {
							return Response.json(
								{ error: "ticket introuvable ou déjà fermé" },
								{ status: 404 },
							);
						}
						return Response.json({ ok: true });
					}),
				},

				// ── Giveaways (page dédiée /giveaways) ────────────────────────
				"/api/giveaways": admin(async (req) => {
					const url = new URL(req.url);
					const ended = url.searchParams.get("ended");
					const dbs = container.resolve(DatabaseService);
					const { giveaways, giveawayEntries } = await import("~/db/schema");
					const { desc, eq, sql } = await import("drizzle-orm");
					const where =
						ended === "true"
							? eq(giveaways.ended, true)
							: ended === "false"
								? eq(giveaways.ended, false)
								: undefined;
					const q = dbs.db.select().from(giveaways).orderBy(desc(giveaways.endsAt));
					const rows = where ? await q.where(where) : await q;
					const counts = await dbs.db
						.select({ giveawayId: giveawayEntries.giveawayId, c: sql<number>`count(*)` })
						.from(giveawayEntries)
						.groupBy(giveawayEntries.giveawayId);
					const countMap = new Map(counts.map((r) => [r.giveawayId, Number(r.c)]));
					return Response.json({
						rows: rows.map((r) => ({ ...r, entries: countMap.get(r.id) ?? 0 })),
						total: rows.length,
					});
				}),
				"/api/giveaways/:id/end": {
					POST: admin(async (req) => {
						const id = Number(req.params.id);
						if (!Number.isFinite(id)) {
							return Response.json({ error: "id invalide" }, { status: 400 });
						}
						const dbs = container.resolve(DatabaseService);
						const { giveaways } = await import("~/db/schema");
						const { eq } = await import("drizzle-orm");
						// Avance la date de fin à maintenant — le ticker (1 min) tirera les
						// gagnants au prochain cycle. Solution la plus sûre : on délègue le
						// flow au GiveawayTicker plutôt que de dupliquer ici.
						const updated = await dbs.db
							.update(giveaways)
							.set({ endsAt: new Date() })
							.where(eq(giveaways.id, id))
							.returning();
						if (updated.length === 0) {
							return Response.json({ error: "giveaway introuvable" }, { status: 404 });
						}
						return Response.json({ ok: true, giveaway: updated[0] });
					}),
				},

				// ── Wiki (utilise WikiService — DragonBall content) ───────────
				"/api/wiki/stats": admin(async () => {
					const { WikiService } = await import("~/services/WikiService");
					const wiki = container.resolve(WikiService);
					return Response.json({
						counts: await wiki.count(),
						isSeeded: await wiki.isSeeded(),
					});
				}),

				// ── Économie (page dédiée /economy) ───────────────────────────
				"/api/economy/stats": admin(async () => {
					const dbs = container.resolve(DatabaseService);
					const { users: u, fusions: f, inventory: inv, shopItems: si } = await import("~/db/schema");
					const { sql: dsql } = await import("drizzle-orm");
					const [agg] = await dbs.db
						.select({
							total: dsql<number>`coalesce(sum(${u.zeni}), 0)`,
							avg: dsql<number>`coalesce(avg(${u.zeni}), 0)`,
							max: dsql<number>`coalesce(max(${u.zeni}), 0)`,
							count: dsql<number>`count(*)`,
							rich: dsql<number>`sum(case when ${u.zeni} >= 10000 then 1 else 0 end)`,
							zero: dsql<number>`sum(case when ${u.zeni} = 0 then 1 else 0 end)`,
						})
						.from(u);
					const [fusionsCount] = await dbs.db
						.select({ c: dsql<number>`count(*)` })
						.from(f);
					const [invCount] = await dbs.db
						.select({ c: dsql<number>`count(*)` })
						.from(inv);
					const [shopCount] = await dbs.db
						.select({ c: dsql<number>`count(*) filter (where ${si.enabled} = 1)` })
						.from(si);
					return Response.json({
						zeni: {
							total: Number(agg?.total ?? 0),
							avg: Number(agg?.avg ?? 0),
							max: Number(agg?.max ?? 0),
							users: Number(agg?.count ?? 0),
							rich: Number(agg?.rich ?? 0),
							zero: Number(agg?.zero ?? 0),
						},
						fusions: Number(fusionsCount?.c ?? 0),
						inventoryItems: Number(invCount?.c ?? 0),
						shopItemsActive: Number(shopCount?.c ?? 0),
					});
				}),
				"/api/economy/leaderboard": admin(async (req) => {
					const url = new URL(req.url);
					const limit = Math.min(100, Number(url.searchParams.get("limit")) || 25);
					const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);
					const dbs = container.resolve(DatabaseService);
					const { users: u } = await import("~/db/schema");
					const rows = await dbs.db
						.select()
						.from(u)
						.orderBy(desc(u.zeni))
						.limit(limit)
						.offset(offset);
					return Response.json({ rows, total: rows.length });
				}),
				"/api/economy/transactions": admin(async (req) => {
					const url = new URL(req.url);
					const limit = Math.min(500, Number(url.searchParams.get("limit")) || 100);
					const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);
					const dbs = container.resolve(DatabaseService);
					const { actionLogs } = await import("~/db/schema");
					const { inArray } = await import("drizzle-orm");
					const rows = await dbs.db
						.select()
						.from(actionLogs)
						.where(
							inArray(actionLogs.action, [
								"SHOP_PURCHASE",
								"LEVEL_UP",
								"ZENI_ADMIN_GIVE",
								"ZENI_ADMIN_REMOVE",
								"ZENI_ADMIN_SET",
								"ZENI_ADMIN_BULK",
							]),
						)
						.orderBy(desc(actionLogs.createdAt))
						.limit(limit)
						.offset(offset);
					return Response.json({ rows, total: rows.length });
				}),
				"/api/economy/give": {
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => ({}))) as {
							mode?: "user" | "role" | "all";
							userId?: string;
							roleId?: string;
							amount?: number;
						};
						const amount = Number(body.amount);
						if (!Number.isFinite(amount) || amount === 0) {
							return Response.json({ error: "amount non nul requis" }, { status: 400 });
						}
						const eco = container.resolve(EconomyService);
						const dbs = container.resolve(DatabaseService);
						const { users: u, actionLogs } = await import("~/db/schema");

						if (body.mode === "user") {
							if (!body.userId) return Response.json({ error: "userId requis" }, { status: 400 });
							if (amount > 0) await eco.addZeni(body.userId, amount, { propagateFusion: false });
							else {
								const ok = await eco.removeZeni(body.userId, -amount);
								if (!ok) return Response.json({ error: "solde insuffisant" }, { status: 400 });
							}
							await dbs.db.insert(actionLogs).values({
								userId: body.userId,
								action: amount > 0 ? "ZENI_ADMIN_GIVE" : "ZENI_ADMIN_REMOVE",
								meta: JSON.stringify({ amount, mode: "user", source: "dashboard" }),
							});
							return Response.json({ ok: true, applied: 1, amount });
						}

						if (body.mode === "role" || body.mode === "all") {
							const cli = container.resolve(Client);
							const guild = cli.guilds.cache.get(env.GUILD_ID);
							if (!guild) return Response.json({ error: "guild introuvable" }, { status: 500 });
							let targets: string[] = [];
							if (body.mode === "role") {
								if (!body.roleId) return Response.json({ error: "roleId requis" }, { status: 400 });
								await guild.members.fetch();
								targets = [...guild.members.cache.values()]
									.filter((m) => !m.user.bot && m.roles.cache.has(body.roleId!))
									.map((m) => m.id);
							} else {
								// all = tous les users en DB
								const all = await dbs.db.select({ id: u.id }).from(u);
								targets = all.map((r) => r.id);
							}
							let applied = 0;
							for (const id of targets) {
								if (amount > 0) {
									await eco.addZeni(id, amount, { propagateFusion: false });
									applied++;
								} else {
									const ok = await eco.removeZeni(id, -amount);
									if (ok) applied++;
								}
							}
							await dbs.db.insert(actionLogs).values({
								action: "ZENI_ADMIN_BULK",
								meta: JSON.stringify({
									amount,
									mode: body.mode,
									roleId: body.roleId,
									targets: targets.length,
									applied,
									source: "dashboard",
								}),
							});
							return Response.json({ ok: true, applied, targeted: targets.length, amount });
						}

						return Response.json({ error: "mode invalide (user|role|all)" }, { status: 400 });
					}),
				},
				"/api/economy/set": {
					POST: admin(async (req) => {
						const body = (await req.json().catch(() => ({}))) as {
							userId?: string;
							amount?: number;
						};
						if (!body.userId) return Response.json({ error: "userId requis" }, { status: 400 });
						const amount = Number(body.amount);
						if (!Number.isFinite(amount) || amount < 0) {
							return Response.json({ error: "amount ≥ 0 requis" }, { status: 400 });
						}
						const eco = container.resolve(EconomyService);
						await eco.setZeni(body.userId, amount);
						const dbs = container.resolve(DatabaseService);
						const { actionLogs } = await import("~/db/schema");
						await dbs.db.insert(actionLogs).values({
							userId: body.userId,
							action: "ZENI_ADMIN_SET",
							meta: JSON.stringify({ amount, source: "dashboard" }),
						});
						return Response.json({ ok: true, amount });
					}),
				},

				// ── Audit logs internes (table action_logs) ───────────────────
				"/api/audit/logs": admin(async (req) => {
					const url = new URL(req.url);
					const limit = Math.min(500, Number(url.searchParams.get("limit")) || 100);
					const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);
					const action = url.searchParams.get("action") ?? undefined;
					const userId = url.searchParams.get("userId") ?? undefined;
					const dbs = container.resolve(DatabaseService);
					const { actionLogs } = await import("~/db/schema");
					const { desc, eq, and } = await import("drizzle-orm");
					const conds = [
						action ? eq(actionLogs.action, action) : undefined,
						userId ? eq(actionLogs.userId, userId) : undefined,
					].filter(Boolean) as ReturnType<typeof eq>[];
					const where = conds.length === 0 ? undefined : conds.length === 1 ? conds[0] : and(...conds);
					const base = dbs.db
						.select()
						.from(actionLogs)
						.orderBy(desc(actionLogs.createdAt))
						.limit(limit)
						.offset(offset);
					const rows = where ? await base.where(where) : await base;
					return Response.json({ rows, total: rows.length, limit, offset });
				}),

				"/api/moderation/recent": admin(async (req) => {
					const url = new URL(req.url);
					const limit = Math.min(200, Number(url.searchParams.get("limit")) || 50);
					const filter = url.searchParams.get("actions")?.split(",").filter(Boolean);
					const mod = container.resolve(ModerationService);
					const rows = await mod.recentActions(limit, filter);
					return Response.json({ rows, total: rows.length });
				}),

				// ── Database (CRUD générique whitelist) ───────────────────────
				// Upload d'image wiki → écrit dans `assets/wiki/` (servi en self-host
				// via /assets/wiki/...). Retourne le path DB (`./assets/...`) que le
				// site convertit en URL CDN via assetUrl(). Admin-only.
				"/api/assets/upload": {
					POST: admin(async (req) => {
						let form: FormData;
						try {
							form = await req.formData();
						} catch {
							return Response.json(
								{ error: "multipart/form-data requis" },
								{ status: 400 },
							);
						}
						const file = form.get("file");
						if (!(file instanceof File)) {
							return Response.json(
								{ error: "champ 'file' manquant" },
								{ status: 400 },
							);
						}
						const MAX = 8 * 1024 * 1024;
						if (file.size > MAX) {
							return Response.json(
								{ error: "Fichier trop lourd (max 8 Mo)" },
								{ status: 413 },
							);
						}
						const extByType: Record<string, string> = {
							"image/png": ".png",
							"image/jpeg": ".jpg",
							"image/webp": ".webp",
							"image/gif": ".gif",
						};
						const ext = extByType[file.type];
						if (!ext) {
							return Response.json(
								{ error: "Type non supporté (png, jpg, webp, gif)" },
								{ status: 415 },
							);
						}
						const name = `${crypto.randomUUID()}${ext}`;
						const rel = `assets/wiki/${name}`;
						try {
							const { mkdir } = await import("node:fs/promises");
							await mkdir("assets/wiki", { recursive: true });
							await Bun.write(rel, file);
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "écriture échouée" },
								{ status: 500 },
							);
						}
						return Response.json({ path: `./${rel}`, url: `/${rel}` });
					}),
				},
				// Upload d'une piste de sous-titres d'épisode (.vtt/.srt) → écrit dans
				// `assets/subtitles/db_episodes/<id>/<lang>.<ext>`. Le site sert/convertit
				// ensuite en WebVTT via /api/subtitles. Admin-only.
				"/api/assets/upload-subtitle": {
					POST: admin(async (req) => {
						let form: FormData;
						try {
							form = await req.formData();
						} catch {
							return Response.json(
								{ error: "multipart/form-data requis" },
								{ status: 400 },
							);
						}
						const file = form.get("file");
						const episodeId = String(form.get("episodeId") ?? "").trim();
						const lang = String(form.get("lang") ?? "").trim().toLowerCase();
						if (!(file instanceof File)) {
							return Response.json({ error: "champ 'file' manquant" }, { status: 400 });
						}
						if (!/^\d+$/.test(episodeId)) {
							return Response.json({ error: "episodeId invalide" }, { status: 400 });
						}
						if (!/^[a-z]{2,5}(-[a-z]{2,5})?$/.test(lang)) {
							return Response.json({ error: "lang invalide (ex. fr, en, fr-fr)" }, { status: 400 });
						}
						if (file.size > 2 * 1024 * 1024) {
							return Response.json({ error: "Fichier trop lourd (max 2 Mo)" }, { status: 413 });
						}
						const lower = file.name.toLowerCase();
						const ext = lower.endsWith(".vtt")
							? ".vtt"
							: lower.endsWith(".srt")
								? ".srt"
								: null;
						if (!ext) {
							return Response.json({ error: "Type non supporté (.vtt, .srt)" }, { status: 415 });
						}
						const dir = `assets/subtitles/db_episodes/${episodeId}`;
						const rel = `${dir}/${lang}${ext}`;
						try {
							const { mkdir } = await import("node:fs/promises");
							await mkdir(dir, { recursive: true });
							await Bun.write(rel, file);
						} catch (err) {
							return Response.json(
								{ error: err instanceof Error ? err.message : "écriture échouée" },
								{ status: 500 },
							);
						}
						return Response.json({ path: `./${rel}`, url: `/${rel}`, src: rel });
					}),
				},
				// Liste les images d'un dossier d'assets whitelisté (galerie admin :
				// banners utilisables comme fond de carte, visuels wiki, etc.).
				"/api/assets/list": admin(async (req) => {
					const ALLOWED = new Set([
						"banners",
						"backgrounds",
						"cards",
						"dbz",
						"ext",
						"sanctions",
						"wiki",
					]);
					const url = new URL(req.url);
					const dir = url.searchParams.get("dir") ?? "banners";
					if (!ALLOWED.has(dir)) {
						return Response.json(
							{ error: `dir non autorisé (autorisés: ${[...ALLOWED].join(", ")})` },
							{ status: 400 },
						);
					}
					const { Glob } = await import("bun");
					const glob = new Glob("**/*.{png,jpg,jpeg,webp,gif}");
					const files: { path: string; url: string; name: string }[] = [];
					try {
						for await (const f of glob.scan({
							cwd: `assets/${dir}`,
							onlyFiles: true,
						})) {
							const rel = `assets/${dir}/${f}`;
							files.push({ path: rel, url: `/${rel}`, name: f });
							if (files.length >= 1000) break;
						}
					} catch {
						// dossier absent → liste vide
					}
					files.sort((a, b) => a.name.localeCompare(b.name));
					return Response.json({
						dir,
						dirs: [...ALLOWED],
						count: files.length,
						files,
					});
				}),
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
						if (spec.name.startsWith("db_"))
							return Response.json({ error: "Wiki en lecture seule côté bot — édition sur le site (Neon)." }, { status: 409 });
						if (spec.readonly) return Response.json({ error: "Table readonly" }, { status: 403 });
						const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
						if (!body) return Response.json({ error: "JSON body requis" }, { status: 400 });
						try {
							await insertRow(spec, body);
							if (spec.name.startsWith("db_")) invalidatePublicWikiCache();
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
						if (spec.name.startsWith("db_"))
							return Response.json({ error: "Wiki en lecture seule côté bot — édition sur le site (Neon)." }, { status: 409 });
						const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
						if (!body) return Response.json({ error: "JSON body requis" }, { status: 400 });
						try {
							await updateRow(spec, req.params.id, body);
							if (spec.name.startsWith("db_")) invalidatePublicWikiCache();
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
						if (spec.name.startsWith("db_"))
							return Response.json({ error: "Wiki en lecture seule côté bot — édition sur le site (Neon)." }, { status: 409 });
						try {
							await deleteRow(spec, req.params.id);
							if (spec.name.startsWith("db_")) invalidatePublicWikiCache();
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

			async fetch(req) {
				const url = new URL(req.url);

				// Better Auth — intercepte /api/auth/* (sign-in, callback, signout, get-session).
				if (url.pathname.startsWith("/api/auth/")) {
					const baResponse = await handleBetterAuthRequest(req);
					if (baResponse) return baResponse;
				}

				// Sert tout chemin commençant par /assets/ depuis le dossier assets/.
				// Routes Map de Bun ne supporte pas les wildcards multi-segment, donc
				// on les capture ici dans le fallback.
				if (url.pathname.startsWith("/assets/")) {
					if (req.method === "OPTIONS") {
						return new Response(null, { status: 204, headers: publicCorsHeaders(req) });
					}
					return serveAsset(url.pathname, req);
				}

				// /db/* — sert les 617 assets DB (Phase 2 mirror) avec headers
				// d'attribution X-DB-Attribution + X-DB-License + X-DB-Source.
				if (url.pathname.startsWith("/db/")) {
					if (req.method === "OPTIONS") {
						return new Response(null, { status: 204, headers: publicCorsHeaders(req) });
					}
					const relPath = url.pathname.slice("/db/".length);
					if (relPath.includes("..") || relPath.startsWith("/")) {
						return new Response("Forbidden", { status: 403 });
					}
					// Content-Negotiation : si client supporte AVIF/WebP et qu'on a
					// la variante pré-générée, on la sert (10-60% plus léger).
					const accept = req.headers.get("accept") ?? "";
					const baseDir = `${process.cwd()}/public/db`;
					const ext = relPath.replace(/^.*\./, "").toLowerCase();
					const negotiable = ext === "png" || ext === "jpg" || ext === "jpeg";
					let servedPath = relPath;
					if (negotiable) {
						const stem = relPath.replace(/\.(png|jpe?g)$/i, "");
						if (accept.includes("image/avif")) {
							const avif = Bun.file(`${baseDir}/${stem}.avif`);
							if (await avif.exists()) servedPath = `${stem}.avif`;
						}
						if (servedPath === relPath && accept.includes("image/webp")) {
							const webp = Bun.file(`${baseDir}/${stem}.webp`);
							if (await webp.exists()) servedPath = `${stem}.webp`;
						}
					}
					const file = Bun.file(`${baseDir}/${servedPath}`);
					if (!(await file.exists())) {
						return new Response("Asset introuvable", { status: 404 });
					}
					// Lookup attribution metadata (best-effort, query peut faillir si la
					// table n'existe pas — la file existe quand même, on sert)
					let attribution = "";
					let licenseKey = "";
					let sourceId = "";
					try {
						const dbs = container.resolve(DatabaseService);
						const row = dbs.sqlite
							.query(
								"SELECT attribution, license_key, source_id FROM db_assets WHERE path = ?",
							)
							.get(relPath) as
							| { attribution: string; license_key: string; source_id: string }
							| null;
						if (row) {
							attribution = row.attribution ?? "";
							licenseKey = row.license_key ?? "";
							sourceId = row.source_id ?? "";
						}
					} catch {}
					// Headers HTTP n'acceptent que ISO-8859-1 ; on encode l'attribution
					// (souvent en UTF-8 avec ©, —, etc.) en utf-8 percent-encoded.
					const safe = (s: string) =>
						encodeURIComponent(s).replace(/%20/g, " ");
					return new Response(file, {
						headers: {
							"Content-Type": file.type,
							"Cache-Control": "public, max-age=31536000, immutable",
							Vary: "Accept",
							...publicCorsHeaders(req),
							...(attribution ? { "X-DB-Attribution": safe(attribution) } : {}),
							...(licenseKey ? { "X-DB-License": licenseKey } : {}),
							...(sourceId ? { "X-DB-Source": sourceId } : {}),
							...(servedPath !== relPath
								? { "X-DB-Served-Variant": servedPath.replace(/.*\./, "") }
								: {}),
						},
					});
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

// ── Routes publiques : CORS allowlist + rate-limit 60 req/min/IP ─────────
const PUBLIC_CORS_ORIGINS = new Set([
        "https://shenron.rpbey.fr",
        "https://dbfr.vercel.app",
        "http://localhost:3000",
]);

const publicRateBuckets = new Map<string, { count: number; resetAt: number }>();

function publicCorsHeaders(req: Request): Record<string, string> {
        const origin = req.headers.get("origin") ?? "";
        const allow = PUBLIC_CORS_ORIGINS.has(origin)
                ? origin
                : "https://shenron.rpbey.fr";

	return {
		"Access-Control-Allow-Origin": allow,
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "600",
		Vary: "Origin",
	};
}

function clientIp(req: Request): string {
	const xff = req.headers.get("x-forwarded-for");
	if (xff) return xff.split(",")[0]!.trim();
	return req.headers.get("x-real-ip") ?? "unknown";
}

function publicRateLimit(ip: string): boolean {
	const now = Date.now();
	const bucket = publicRateBuckets.get(ip);
	if (!bucket || bucket.resetAt < now) {
		publicRateBuckets.set(ip, { count: 1, resetAt: now + 60_000 });
		return true;
	}
	bucket.count += 1;
	return bucket.count <= 60;
}

async function publicRoute(
	req: Request & { params: any },
	handler: () => Response | Promise<Response>,
): Promise<Response> {
	const cors = publicCorsHeaders(req);
	if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
	if (req.method !== "GET") {
		return new Response("Method Not Allowed", { status: 405, headers: cors });
	}
	if (!publicRateLimit(clientIp(req))) {
		return new Response(JSON.stringify({ error: "Rate limit (60/min)" }), {
			status: 429,
			headers: { ...cors, "Content-Type": "application/json", "Retry-After": "60" },
		});
	}
	const res = await handler();
	const headers = new Headers(res.headers);
	for (const [k, v] of Object.entries(cors)) headers.set(k, v);
	return new Response(res.body, { status: res.status, headers });
}

// ── publicCachedJson : 2 niveaux de cache (mémoire + HTTP) ──────────────
// Le site Vercel (`dbfr.vercel.app`) fetch ces routes avec `next: { revalidate: 60 }` —
// le Cache-Control `public, s-maxage=…, stale-while-revalidate=…` permet à
// l'edge Vercel + au browser de mettre en cache. Le memo cache local (TTL
// court) absorbe les hits parallèles pendant le warming d'un déploiement
// Vercel. Combiné, ça transforme une page profil de "1 req SQLite + 1 REST
// Discord par hit" à "1 req par minute en stable state".
type PublicCacheEntry = { body: Uint8Array; etag: string; expiresAt: number };
const publicCache = new Map<string, PublicCacheEntry>();
const PUBLIC_CACHE_MAX = 256;

/**
 * Purge les entrées du cache public wiki (TTL 1 h) pour qu'une édition admin
 * d'une table `db_*` soit visible immédiatement sur le site, sans attendre
 * l'expiration ni un restart du bot. Appelé après chaque écriture CRUD sur
 * une table wiki (cf. routes `/api/database/:table`).
 */
function invalidatePublicWikiCache(): void {
	for (const key of publicCache.keys()) {
		if (key.startsWith("/api/public/wiki/")) publicCache.delete(key);
	}
}

function publicCacheKey(req: Request & { params: any }): string {
	const url = new URL(req.url);
	const params = [...url.searchParams.entries()].toSorted(([a], [b]) => a.localeCompare(b));
	return url.pathname + (params.length ? "?" + new URLSearchParams(params).toString() : "");
}

async function publicCachedJson(
	req: Request & { params: any },
	ttlMs: number,
	build: () => Promise<unknown>,
): Promise<Response> {
	const cors = publicCorsHeaders(req);
	if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
	if (req.method !== "GET" && req.method !== "HEAD") {
		return new Response("Method Not Allowed", { status: 405, headers: cors });
	}
	if (!publicRateLimit(clientIp(req))) {
		return new Response(JSON.stringify({ error: "Rate limit (60/min)" }), {
			status: 429,
			headers: { ...cors, "Content-Type": "application/json", "Retry-After": "60" },
		});
	}

	const key = publicCacheKey(req);
	const now = Date.now();
	let entry = publicCache.get(key);
	if (entry && entry.expiresAt < now) {
		publicCache.delete(key);
		entry = undefined;
	}
	if (entry) {
		// LRU: re-insert pour marquer comme récent
		publicCache.delete(key);
		publicCache.set(key, entry);
	}

	if (!entry) {
		try {
			const data = await build();
			const json = JSON.stringify(data);
			const bytes = new TextEncoder().encode(json);
			const etag = etagOf(bytes);
			entry = { body: bytes, etag, expiresAt: now + ttlMs };
			if (publicCache.size >= PUBLIC_CACHE_MAX) {
				const oldest = publicCache.keys().next().value;
				if (oldest) publicCache.delete(oldest);
			}
			publicCache.set(key, entry);
		} catch (err) {
			if (err instanceof HttpError) {
				return new Response(JSON.stringify({ error: err.message }), {
					status: err.status,
					headers: { ...cors, "Content-Type": "application/json" },
				});
			}
			logger.error({ err, route: key }, "publicCachedJson build failed");
			return new Response(JSON.stringify({ error: "internal" }), {
				status: 500,
				headers: { ...cors, "Content-Type": "application/json" },
			});
		}
	}

	const seconds = Math.max(1, Math.floor(ttlMs / 1000));
	const cacheControl = `public, max-age=${seconds}, s-maxage=${seconds * 2}, stale-while-revalidate=${seconds * 4}`;
	const headers: Record<string, string> = {
		...cors,
		"Content-Type": "application/json; charset=utf-8",
		"Cache-Control": cacheControl,
		ETag: entry.etag,
	};
	const ifNoneMatch = req.headers.get("if-none-match");
	if (ifNoneMatch && ifNoneMatch === entry.etag) {
		return new Response(null, { status: 304, headers });
	}
	const body = req.method === "HEAD" ? null : (entry.body as unknown as BodyInit);
	return new Response(body, { status: 200, headers });
}

/** Invalide les entrées du cache public dont la clé commence par `prefix`. */
function invalidatePublicCache(prefix: string): number {
	let n = 0;
	for (const k of Array.from(publicCache.keys())) {
		if (k.startsWith(prefix)) {
			publicCache.delete(k);
			n++;
		}
	}
	return n;
}

// ── Cache des fetchs Discord (username + avatar hash) ─────────────────
// `client.users.fetch()` consomme le rate-limit global Discord (50 req/s).
// Pour le leaderboard `?enrich=1` (100 IDs) ou des hits répétés sur les
// mêmes profils populaires, on partage un cache 5 min entre toutes les
// routes publiques. Best-effort : si fetch échoue, on cache un null
// pour éviter de retaper la même requête en boucle.
type DiscordUserData = {
	username: string | null;
	avatarHash: string | null;
	expiresAt: number;
};
const discordUserCache = new Map<string, DiscordUserData>();
const DISCORD_USER_CACHE_TTL = 5 * 60_000;
const DISCORD_USER_CACHE_MAX = 1024;

async function fetchDiscordUserCached(id: string): Promise<DiscordUserData> {
	const now = Date.now();
	const cached = discordUserCache.get(id);
	if (cached && cached.expiresAt > now) return cached;

	const map = container.resolve<Map<string, Client>>("ClientMap");
	// 1) Cache mémoire de N'IMPORTE QUEL client : les personas privilégiées
	//    (grandPretre/kaio, intent GuildMembers) ont les membres en cache dès le
	//    boot → résolution instantanée sans REST pour la plupart des IDs.
	let u: { username: string; avatar: string | null } | null = null;
	for (const c of map.values()) {
		const cu = c.users.cache.get(id);
		if (cu) {
			u = { username: cu.username, avatar: cu.avatar };
			break;
		}
	}
	// 2) Miss cache → REST via shenron, timeout dur 2.5 s (sinon 100 fetch froids
	//    en rate-limit → 502 nginx). On rend null plutôt que de bloquer.
	if (!u) {
		const shenron = map.get("shenron");
		u = shenron
			? await Promise.race([
					shenron.users.fetch(id).catch(() => null),
					new Promise<null>((res) => setTimeout(() => res(null), 2500)),
				])
			: null;
	}
	const entry: DiscordUserData = {
		username: u?.username ?? null,
		avatarHash: u?.avatar ?? null,
		expiresAt: now + DISCORD_USER_CACHE_TTL,
	};
	if (discordUserCache.size >= DISCORD_USER_CACHE_MAX) {
		const oldest = discordUserCache.keys().next().value;
		if (oldest) discordUserCache.delete(oldest);
	}
	discordUserCache.set(id, entry);
	return entry;
}

/** Construit l'URL avatar via `userAvatar` (hash) ou `defaultAvatar` (fallback). */
function discordAvatarUrl(id: string, hash: string | null, size: 64 | 128 | 256 | 512 = 512): string {
	return hash ? userAvatar(id, hash, { size }) : defaultAvatar(id);
}

/**
 * map() avec **concurrence bornée + deadline globale**. Au-delà du budget temps,
 * les items restants prennent `fallback` (pas de REST) → garantit une réponse
 * rapide même cache froid (ex. enrich leaderboard : 100 fetch Discord bornés).
 */
async function mapLimitDeadline<T, R>(
	items: T[],
	limit: number,
	deadlineMs: number,
	fn: (item: T, idx: number) => Promise<R>,
	fallback: (item: T, idx: number) => R,
): Promise<R[]> {
	const results = Array.from({ length: items.length }) as R[];
	const deadline = Date.now() + deadlineMs;
	let next = 0;
	async function worker() {
		while (next < items.length) {
			const i = next++;
			if (Date.now() > deadline) {
				results[i] = fallback(items[i], i);
				continue;
			}
			try {
				results[i] = await fn(items[i], i);
			} catch {
				results[i] = fallback(items[i], i);
			}
		}
	}
	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, worker),
	);
	return results;
}

// ── A2A bridge ────────────────────────────────────────────────────────────
// HTTP miroir du canal MCP `coord` (mcp/coord-server.ts). Backé par les
// mêmes fichiers `.coord/messages.jsonl` et `.coord/tasks.json` — un
// message envoyé via A2A est visible immédiatement par read_messages MCP
// et inversement. SSE permet aux agents distants (CLI ou worker)
// d'écouter les events en temps réel.
const COORD_DIR =
	Bun.env.COORD_DIR ?? `${process.cwd().replace(/\/apps\/bot\/?$/, "")}/.coord`;
const COORD_MESSAGES = `${COORD_DIR}/messages.jsonl`;
const COORD_TASKS = `${COORD_DIR}/tasks.json`;
const COORD_LOCK = "/tmp/dbfr-tasks.lock";
const a2aSubscribers = new Set<(event: unknown) => void>();

function a2aBroadcast(event: unknown): void {
	for (const sub of a2aSubscribers) {
		try {
			sub(event);
		} catch {
			/* sub closed mid-iteration */
		}
	}
}

async function appendMessage(msg: Record<string, unknown>): Promise<void> {
	const line = JSON.stringify(msg) + "\n";
	const proc = Bun.spawn(["flock", `${COORD_LOCK}-msg`, "bash", "-c", `cat >> ${COORD_MESSAGES}`], {
		stdin: "pipe",
	});
	proc.stdin.write(line);
	await proc.stdin.end();
	await proc.exited;
}

async function readTasksFile(): Promise<{ tasks: any[] }> {
	const file = Bun.file(COORD_TASKS);
	if (!(await file.exists())) return { tasks: [] };
	return (await file.json()) as { tasks: any[] };
}

function a2aRpcError(id: unknown, code: number, message: string): Response {
	return Response.json({ jsonrpc: "2.0", id, error: { code, message } });
}

async function a2aJsonRpc(req: Request): Promise<Response> {
	if (req.method === "OPTIONS") {
		return new Response(null, {
			status: 204,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		});
	}
	if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

	let body: any;
	try {
		body = await req.json();
	} catch {
		return a2aRpcError(null, -32700, "Parse error");
	}
	const { id = null, method, params } = body ?? {};
	if (!method) return a2aRpcError(id, -32600, "Invalid Request");

	try {
		switch (method) {
			case "message/send": {
				const incoming = params?.message;
				if (!incoming?.parts?.length) {
					return a2aRpcError(id, -32602, "params.message.parts required");
				}
				const text = incoming.parts
					.filter((p: any) => p.kind === "text")
					.map((p: any) => p.text)
					.join("\n");
				const msg = {
					id: incoming.messageId ?? crypto.randomUUID(),
					from: incoming.role === "agent" ? "agent" : "user",
					to: params.to ?? "all",
					type: "request" as const,
					contextId: incoming.contextId ?? null,
					content: text,
					ts: new Date().toISOString(),
				};
				await appendMessage(msg);
				// Broadcast format Gemini-CoderAgentEvent : text-content (au lieu de "message" brut),
				// pour que les clients @a2a-js/sdk parsent nativement. On garde aussi "message" pour
				// rétrocompat avec les vieux subscribers.
				a2aBroadcast({
					kind: "text-content",
					messageId: msg.id,
					contextId: msg.contextId,
					role: "agent",
					parts: [{ kind: "text", text }],
					ts: msg.ts,
				});
				a2aBroadcast({ kind: "message", message: msg });
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
			case "message/stream": {
				// SSE response — émet le state-change initial + les events futurs.
				// rpcId = JSON-RPC id pour ce stream, propagé dans chaque event SSE.
				const stream = a2aSseStream(typeof id === "string" ? id : undefined);
				return new Response(stream, {
					headers: {
						"Content-Type": "text/event-stream",
						"Cache-Control": "no-cache, no-transform",
						"Access-Control-Allow-Origin": "*",
					},
				});
			}
			case "tasks/resubscribe": {
				// Spec A2A : re-attache un client sur un task existant pour recevoir les events
				// futurs en SSE. On ne distingue pas par taskId côté backend (broadcast global),
				// donc équivalent à message/stream avec le taskId comme rpc-id.
				const taskId = typeof params?.id === "string" ? params.id : undefined;
				const stream = a2aSseStream(taskId);
				return new Response(stream, {
					headers: {
						"Content-Type": "text/event-stream",
						"Cache-Control": "no-cache, no-transform",
						"Access-Control-Allow-Origin": "*",
					},
				});
			}
			case "agent/getAuthenticatedExtendedCard": {
				// Notre AgentCard public expose déjà tout ; pas d'extension auth-only.
				return Response.json({
					jsonrpc: "2.0",
					id,
					error: { code: -32601, message: "Extended card not supported (public card is the canonical one)" },
				});
			}
			case "tasks/list": {
				const { tasks } = await readTasksFile();
				const filtered = tasks.filter((t: any) => {
					if (params?.status && t.status !== params.status) return false;
					if (params?.agent && t.agent !== params.agent) return false;
					return true;
				});
				return Response.json({ jsonrpc: "2.0", id, result: { tasks: filtered } });
			}
			case "tasks/get": {
				const { tasks } = await readTasksFile();
				const t = tasks.find((x: any) => x.id === params?.id);
				return Response.json({ jsonrpc: "2.0", id, result: t ?? null });
			}
			case "tasks/cancel": {
				if (typeof params?.id !== "string" || !params.id.trim()) {
					return a2aRpcError(id, -32602, "params.id (string) required");
				}
				const now = new Date().toISOString();
				// id/now/path passés en ARGUMENTS POSITIONNELS ($1/$2/$3) — bash ne
				// ré-évalue jamais une expansion de variable (pas de command-substitution
				// sur "$1"), donc aucune injection shell possible même si params.id
				// contient `$(...)`, backticks ou `;`. Ne JAMAIS réinterpoler dans la
				// chaîne `bash -c`.
				const proc = Bun.spawn(
					[
						"flock",
						COORD_LOCK,
						"bash",
						"-c",
						'jq --arg id "$1" --arg now "$2" \'(.tasks[] | select(.id==$id)) |= (.status="blocked" | .blocker="cancelled via A2A" | .finished_at=$now)\' "$3" > /tmp/.coord-tasks.tmp && mv /tmp/.coord-tasks.tmp "$3"',
						"a2a-cancel",
						params.id,
						now,
						COORD_TASKS,
					],
					{ stdout: "pipe", stderr: "pipe" },
				);
				await proc.exited;
				return Response.json({ jsonrpc: "2.0", id, result: { cancelled: params.id } });
			}
			default:
				return a2aRpcError(id, -32601, `Method not found: ${method}`);
		}
	} catch (err) {
		logger.error({ err }, "a2a/jsonrpc handler failed");
		return a2aRpcError(id, -32000, (err as Error).message ?? "Internal error");
	}
}

function a2aSseStream(streamId?: string): ReadableStream {
	let cleanup: (() => void) | null = null;
	return new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder();
			const sub = (event: unknown) => {
				try {
					// Format SSE officiel @a2a-js/sdk (gemini-cli) : wrap dans JSON-RPC,
					// id = taskId si évènement lié à une task sinon messageId.
					const eventObj = event as { taskId?: string; messageId?: string; kind?: string };
					const rpcId = eventObj.taskId ?? eventObj.messageId ?? streamId ?? null;
					const wrapped = { jsonrpc: "2.0", id: rpcId, result: event };
					controller.enqueue(encoder.encode(`data: ${JSON.stringify(wrapped)}\n\n`));
				} catch {
					cleanup?.();
				}
			};
			a2aSubscribers.add(sub);
			// Keep-alive ping toutes les 30 s pour que nginx/Vercel ne timeout pas
			const ping = setInterval(() => {
				try {
					controller.enqueue(encoder.encode(`: ping\n\n`));
				} catch {
					cleanup?.();
				}
			}, 30_000);
			cleanup = () => {
				a2aSubscribers.delete(sub);
				clearInterval(ping);
			};
			// Welcome event — state-change vers "submitted" pour rejoindre la sémantique TaskState A2A
			const welcome = {
				kind: "state-change",
				state: "submitted",
				ts: new Date().toISOString(),
			};
			const rpcId = streamId ?? null;
			controller.enqueue(
				encoder.encode(`data: ${JSON.stringify({ jsonrpc: "2.0", id: rpcId, result: welcome })}\n\n`),
			);
		},
		cancel() {
			cleanup?.();
		},
	});
}

function a2aEventsStream(req: Request): Response {
	if (req.method === "OPTIONS") {
		return new Response(null, {
			status: 204,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, OPTIONS",
			},
		});
	}
	return new Response(a2aSseStream(), {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			"Access-Control-Allow-Origin": "*",
			Connection: "keep-alive",
		},
	});
}

/**
 * Variante publique de `cachedImage` : CORS allowlist + rate-limit 60/min/IP
 * + Cache-Control `public` (au lieu de `private`) pour activer le CDN Vercel.
 * Réutilise le LRU cache buffer et le 304 d'ETag de `cachedImage` derrière.
 */
async function publicCachedImage(
	req: Request & { params: any },
	render: () => Promise<Buffer | Uint8Array>,
	cacheSeconds = 3600,
): Promise<Response> {
	const cors = publicCorsHeaders(req);
	if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
	if (req.method !== "GET" && req.method !== "HEAD") {
		return new Response("Method Not Allowed", { status: 405, headers: cors });
	}
	if (!publicRateLimit(clientIp(req))) {
		return new Response(JSON.stringify({ error: "Rate limit (60/min)" }), {
			status: 429,
			headers: { ...cors, "Content-Type": "application/json", "Retry-After": "60" },
		});
	}
	const res = await cachedImage(req, render, cacheSeconds);
	const headers = new Headers(res.headers);
	for (const [k, v] of Object.entries(cors)) headers.set(k, v);
	// Override le Cache-Control : `cachedImage` met `public, max-age=, must-revalidate`
	// qui n'autorise pas Vercel/CDN à servir stale. Ici on veut `s-maxage` + `swr`.
	headers.set(
		"Cache-Control",
		`public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds * 2}, stale-while-revalidate=${cacheSeconds * 4}`,
	);
	return new Response(res.body, { status: res.status, headers });
}

/**
 * Aplatit une slash command + ses sous-groupes / sous-commandes en feuilles
 * exécutables (le format que l'utilisateur tape : `admin reload`, `economy give`).
 *
 * Types Discord :
 *   1 = SUB_COMMAND
 *   2 = SUB_COMMAND_GROUP
 */
function expandCommandLeaves(
	cmd: any,
	out: { name: string; description: string; group: string }[],
	prefix = "",
) {
	const root = prefix || cmd.name;
	const group = (prefix.split(" ")[0] ?? cmd.name) as string;
	const opts = cmd.options ?? [];
	const subs = opts.filter((o: any) => o.type === 1 || o.type === 2);
	if (subs.length === 0) {
		out.push({
			name: prefix || cmd.name,
			description: cmd.description ?? "",
			group: prefix ? group : cmd.name,
		});
		return;
	}
	for (const sub of subs) {
		if (sub.type === 1) {
			out.push({
				name: `${root} ${sub.name}`,
				description: sub.description ?? "",
				group: prefix ? group : cmd.name,
			});
		} else if (sub.type === 2) {
			expandCommandLeaves(sub, out, `${root} ${sub.name}`);
		}
	}
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
