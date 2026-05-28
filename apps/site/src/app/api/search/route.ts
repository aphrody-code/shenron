/**
 * /api/search — recherche cross-entity du wiki pour la palette ⌘K (client).
 *
 * Server-only : appelle `dbUniverse.search()` (Drizzle/Neon, schéma `bot`) côté
 * serveur → le module `db-universe` (postgres-js) ne fuit jamais dans le bundle
 * client. La palette `CommandMenu` fetch cet endpoint en debounce.
 *
 * Même moteur que la page `/wiki/search` (ILIKE + proximité trigramme pg_trgm
 * + ranking exact > préfixe > similarité) → résultats tolérants aux fautes.
 */
import { dbUniverse, type SearchResults } from "@/lib/db-universe";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const empty = (q: string): SearchResults => ({
	q,
	characters: [],
	planets: [],
	sagas: [],
	movies: [],
	games: [],
	episodes: [],
	techniques: [],
});

export async function GET(req: NextRequest) {
	const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
	if (q.length < 2) return NextResponse.json(empty(q));
	const results = (await dbUniverse.search(q)) ?? empty(q);
	return NextResponse.json(results, {
		headers: {
			"cache-control": "public, max-age=30, stale-while-revalidate=120",
		},
	});
}
