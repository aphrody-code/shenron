/**
 * api.test.ts — couche client HTTP : absolutize + normalisation d'erreurs +
 * construction query/body. `fetch` est moqué (aucun réseau).
 */
import { afterEach, describe, expect, test } from "bun:test";
import { absolutize, apiGet, ApiError, apiPost, SITE_BASE } from "../src/api.ts";

const realFetch = globalThis.fetch;
afterEach(() => {
	globalThis.fetch = realFetch;
});

function mockFetch(impl: (url: string, init: RequestInit) => Response): void {
	globalThis.fetch = ((url: string | URL | Request, init?: RequestInit) =>
		Promise.resolve(impl(String(url), init ?? {}))) as typeof fetch;
}

function jsonResponse(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "content-type": "application/json" },
	});
}

describe("absolutize", () => {
	test("préfixe les url/href relatives par SITE_BASE", () => {
		expect(absolutize({ url: "/wiki/x" })).toEqual({ url: `${SITE_BASE}/wiki/x` });
		expect(absolutize({ href: "/a/b" })).toEqual({ href: `${SITE_BASE}/a/b` });
	});

	test("laisse les URLs absolues intactes", () => {
		const u = "https://dragonball.fandom.com/wiki/Goku";
		expect(absolutize({ url: u })).toEqual({ url: u });
	});

	test("ne touche pas une chaîne vide ni les clés non-url", () => {
		expect(absolutize({ url: "" })).toEqual({ url: "" });
		expect(absolutize({ name: "/not-a-url" })).toEqual({ name: "/not-a-url" });
	});

	test("récursion dans les tableaux et objets imbriqués", () => {
		const input = { results: [{ title: "Goku", url: "/p/1" }, { url: "https://x/y" }] };
		expect(absolutize(input)).toEqual({
			results: [{ title: "Goku", url: `${SITE_BASE}/p/1` }, { url: "https://x/y" }],
		});
	});

	test("primitives renvoyées telles quelles", () => {
		expect(absolutize(42)).toBe(42);
		expect(absolutize("hello")).toBe("hello");
		expect(absolutize(null)).toBe(null);
	});
});

describe("apiGet", () => {
	test("renvoie le JSON parsé et construit la query (omet null/undefined/empty)", async () => {
		let seenUrl = "";
		let seenMethod = "";
		mockFetch((url, init) => {
			seenUrl = url;
			seenMethod = String(init.method);
			return jsonResponse({ ok: true });
		});
		const out = await apiGet("/api/public/x", { q: "goku", limit: 5, empty: "", nope: undefined });
		expect(out).toEqual({ ok: true });
		expect(seenMethod).toBe("GET");
		expect(seenUrl).toContain("q=goku");
		expect(seenUrl).toContain("limit=5");
		expect(seenUrl).not.toContain("empty=");
		expect(seenUrl).not.toContain("nope=");
	});

	test("non-2xx → ApiError avec le bon status", async () => {
		mockFetch(() => new Response("nope", { status: 404 }));
		expect(apiGet("/api/public/missing")).rejects.toBeInstanceOf(ApiError);
		try {
			await apiGet("/api/public/missing");
		} catch (e) {
			expect((e as ApiError).status).toBe(404);
			expect((e as ApiError).message).toContain("/api/public/missing");
		}
	});

	test("erreur réseau → ApiError 503", async () => {
		globalThis.fetch = (() => Promise.reject(new Error("boom"))) as typeof fetch;
		try {
			await apiGet("/api/public/x");
			throw new Error("should have thrown");
		} catch (e) {
			expect(e).toBeInstanceOf(ApiError);
			expect((e as ApiError).status).toBe(503);
		}
	});

	test("corps non-JSON sur 200 → ApiError 502", async () => {
		mockFetch(() => new Response("<html>not json</html>", { status: 200 }));
		try {
			await apiGet("/api/public/x");
			throw new Error("should have thrown");
		} catch (e) {
			expect(e).toBeInstanceOf(ApiError);
			expect((e as ApiError).status).toBe(502);
		}
	});
});

describe("apiPost", () => {
	test("envoie le body JSON + content-type, méthode POST", async () => {
		let seenInit: RequestInit = {};
		mockFetch((_url, init) => {
			seenInit = init;
			return jsonResponse({ answer: "ok" });
		});
		const out = await apiPost("/api/public/rag/chat", { q: "krillin" });
		expect(out).toEqual({ answer: "ok" });
		expect(seenInit.method).toBe("POST");
		expect(seenInit.body).toBe(JSON.stringify({ q: "krillin" }));
		expect((seenInit.headers as Record<string, string>)["content-type"]).toContain(
			"application/json"
		);
	});
});
