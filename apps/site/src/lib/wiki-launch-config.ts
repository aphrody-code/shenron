/**
 * wiki-launch-config — lecture/écriture **server-only** des catégories wiki
 * ouvertes au public (gating bêta piloté depuis /admin/lancement).
 *
 * Le proxy (`proxy.ts`) lit ceci sur CHAQUE requête → cache module-level à TTL
 * court (30 s) IMPÉRATIF : jamais de round-trip PG par requête anonyme (cf. piège
 * event-loop/CONNECT_TIMEOUT). Ne throw jamais → repli sur les défauts (bêta).
 * Écriture via /api/wiki-launch (gate admin) qui revalide le layout.
 */
import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { wikiLaunch } from "@/db/schema";
import { ALWAYS_OPEN_KEYS, DEFAULT_OPEN_KEYS, GATEABLE_CATEGORIES } from "@/lib/wiki-launch";

const SINGLETON_ID = "default";
const TTL_MS = 30_000;

let cache: { keys: string[]; ts: number } | null = null;

/** Clés valides ouvrables (garde-fou contre des clés obsolètes en base). */
const GATEABLE_KEYS = new Set(GATEABLE_CATEGORIES.map((c) => c.key));

function sanitize(stored: unknown): string[] {
	const arr = Array.isArray((stored as { openKeys?: unknown })?.openKeys)
		? ((stored as { openKeys: unknown[] }).openKeys as unknown[])
		: [];
	const extra = arr.filter((k): k is string => typeof k === "string" && GATEABLE_KEYS.has(k));
	// alwaysOpen toujours inclus ; dédoublonné.
	return Array.from(new Set([...ALWAYS_OPEN_KEYS, ...extra]));
}

/**
 * Clés de catégories ouvertes (cache TTL 30 s). Inclut toujours les alwaysOpen.
 * Utilisé par le proxy (hot-path) + la nav + le teaser.
 */
export async function getOpenCategoryKeys(): Promise<string[]> {
	const now = Date.now();
	if (cache && now - cache.ts < TTL_MS) return cache.keys;
	try {
		const [row] = await db
			.select()
			.from(wikiLaunch)
			.where(eq(wikiLaunch.id, SINGLETON_ID))
			.limit(1);
		const keys = row ? sanitize(row.data) : DEFAULT_OPEN_KEYS;
		cache = { keys, ts: now };
		return keys;
	} catch (e) {
		console.error("[wiki-launch] lecture échouée, repli défauts :", e);
		return cache?.keys ?? DEFAULT_OPEN_KEYS;
	}
}

/** Persiste l'ensemble des clés ouvertes (les alwaysOpen sont réinjectées). */
export async function saveOpenCategoryKeys(keys: string[], by?: string | null): Promise<string[]> {
	const clean = Array.from(
		new Set([...ALWAYS_OPEN_KEYS, ...keys.filter((k) => GATEABLE_KEYS.has(k))])
	);
	const data = { openKeys: clean };
	await db
		.insert(wikiLaunch)
		.values({ id: SINGLETON_ID, data, updatedBy: by ?? null, updatedAt: new Date() })
		.onConflictDoUpdate({
			target: wikiLaunch.id,
			set: { data, updatedBy: by ?? null, updatedAt: new Date() },
		});
	cache = { keys: clean, ts: Date.now() }; // invalide + réchauffe le cache local
	return clean;
}
