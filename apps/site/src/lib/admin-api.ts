/**
 * Client API browser pour le dashboard admin du site.
 *
 * Toutes les requêtes passent par le proxy server-side `/api/bot-admin/<path>`
 * (cf. app/api/bot-admin/[...path]/route.ts) qui :
 *   - vérifie la session admin (Better Auth + users.roleAdmin),
 *   - injecte le Bearer SHENRON_ADMIN_TOKEN (jamais exposé au browser),
 *   - forward vers l'API REST du bot `${SHENRON_API_URL}/api/<path>`.
 *
 * Donc `api.get("/economy/stats")` → `/api/bot-admin/economy/stats` → bot `/api/economy/stats`.
 * Mirroir 1:1 du client du dashboard interne du bot (apps/bot/src/dashboard/lib/api.ts)
 * pour permettre le portage quasi-verbatim des pages.
 */
const PROXY_BASE = "/api/bot-admin";

function resolvePath(path: string): string {
	return `${PROXY_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

interface ApiOpts extends RequestInit {
	json?: unknown;
}

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

async function request<T>(path: string, opts: ApiOpts = {}): Promise<T> {
	const headers = new Headers(opts.headers);
	let body: BodyInit | undefined = opts.body as BodyInit | undefined;
	if (opts.json !== undefined) {
		headers.set("Content-Type", "application/json");
		body = JSON.stringify(opts.json);
	}
	const res = await fetch(resolvePath(path), {
		credentials: "same-origin",
		...opts,
		headers,
		body,
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new ApiError(res.status, text || `HTTP ${res.status}`);
	}
	// 204 No Content ou corps vide → renvoie null typé
	if (res.status === 204) return null as T;
	const ct = res.headers.get("content-type") ?? "";
	if (!ct.includes("application/json"))
		return (await res.text()) as unknown as T;
	return (await res.json()) as T;
}

export const api = {
	get: <T = unknown>(path: string) => request<T>(path),
	post: <T = unknown>(path: string, json?: unknown) =>
		request<T>(path, { method: "POST", json }),
	put: <T = unknown>(path: string, json?: unknown) =>
		request<T>(path, { method: "PUT", json }),
	patch: <T = unknown>(path: string, json?: unknown) =>
		request<T>(path, { method: "PATCH", json }),
	delete: <T = unknown>(path: string, json?: unknown) =>
		request<T>(path, { method: "DELETE", json }),
};

/** URL absolue d'un asset/canvas servi par le bot via le proxy (GET only, images). */
export function proxyAsset(path: string): string {
	return resolvePath(path);
}
