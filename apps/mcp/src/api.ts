/**
 * api.ts — Client HTTP vers l'API publique du bot Shenron (loopback).
 *
 * Le serveur MCP ne touche JAMAIS la base directement : il proxifie l'API REST
 * publique déjà servie par le bot sur `http://127.0.0.1:5006/api/public/*`
 * (cf. apps/bot/src/api/server.ts). Aucun secret, aucune écriture : tout est
 * lecture seule et déjà exposé publiquement sur `bot.dragonballfr.com`.
 */

/** Base de l'API bot (loopback en prod, surchargée par SHENRON_API_URL). */
export const API_BASE = (process.env.SHENRON_API_URL ?? "http://127.0.0.1:5006").replace(/\/$/, "");
/** Base du site public — pour absolutiser les URLs relatives renvoyées (`/wiki/...`). */
export const SITE_BASE = (process.env.SHENRON_SITE_URL ?? "https://dragonballfr.com").replace(
	/\/$/,
	""
);

/** Erreur normalisée d'un appel upstream (jamais une stacktrace brute côté client). */
export class ApiError extends Error {
	constructor(
		message: string,
		readonly status: number
	) {
		super(message);
		this.name = "ApiError";
	}
}

type Query = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, query?: Query): string {
	const url = new URL(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`);
	if (query) {
		for (const [k, v] of Object.entries(query)) {
			if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
		}
	}
	return url.toString();
}

async function call(
	method: "GET" | "POST",
	path: string,
	opts: { query?: Query; body?: unknown; timeoutMs?: number } = {}
): Promise<unknown> {
	const url = buildUrl(path, opts.query);
	const init: RequestInit = {
		method,
		headers: { accept: "application/json" },
		signal: AbortSignal.timeout(opts.timeoutMs ?? 20_000),
	};
	if (method === "POST" && opts.body !== undefined) {
		init.headers = { ...init.headers, "content-type": "application/json" };
		init.body = JSON.stringify(opts.body);
	}
	let res: Response;
	try {
		res = await fetch(url, init);
	} catch (err) {
		const reason = err instanceof Error && err.name === "TimeoutError" ? "timeout" : "réseau";
		throw new ApiError(`API injoignable (${reason}) sur ${path}`, 503);
	}

	const text = await res.text();
	if (!res.ok) {
		// Message court et spécifique, jamais le corps HTML/stacktrace complet.
		const snippet = text.slice(0, 200).replace(/\s+/g, " ").trim();
		throw new ApiError(`API ${res.status} sur ${path}${snippet ? ` — ${snippet}` : ""}`, res.status);
	}
	try {
		return text ? JSON.parse(text) : null;
	} catch {
		throw new ApiError(`Réponse non-JSON de ${path}`, 502);
	}
}

export function apiGet(path: string, query?: Query, timeoutMs?: number): Promise<unknown> {
	return call("GET", path, { query, timeoutMs });
}

export function apiPost(path: string, body: unknown, timeoutMs?: number): Promise<unknown> {
	return call("POST", path, { body, timeoutMs });
}

/**
 * Absolutise récursivement les URLs relatives renvoyées par l'API : seules les
 * valeurs string des clés `url`/`href` commençant par `/` sont préfixées par
 * SITE_BASE (`/wiki/...` → `https://dragonballfr.com/wiki/...`). Tout le reste
 * de l'arbre est traversé sans modification.
 */
export function absolutize<T>(value: T): T {
	if (Array.isArray(value)) return value.map((v) => absolutize(v)) as unknown as T;
	if (value && typeof value === "object") {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			out[k] =
				(k === "url" || k === "href") && typeof v === "string" && v.startsWith("/")
					? `${SITE_BASE}${v}`
					: absolutize(v);
		}
		return out as unknown as T;
	}
	return value;
}
