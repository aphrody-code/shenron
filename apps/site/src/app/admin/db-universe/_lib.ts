/**
 * Helper interne admin pour consommer l'API publique du bot avec no-cache.
 * L'admin doit voir la vraie data temps-réel, pas la version cachée Vercel.
 */
import { env } from "@/lib/env";

const API = env.SHENRON_API_URL ?? "https://shenron.rpbey.fr";

export async function adminFetch<T>(path: string): Promise<T | null> {
	try {
		const r = await fetch(`${API}${path}`, { cache: "no-store" });
		if (!r.ok) return null;
		return (await r.json()) as T;
	} catch {
		return null;
	}
}

export function assetCdnUrl(path: string): string {
	return `${API}/db/${path.replace(/^\//, "")}`;
}
