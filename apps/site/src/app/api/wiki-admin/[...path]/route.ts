/**
 * /api/wiki-admin/* — CRUD **direct sur Neon** (schéma `bot`) pour le wiki
 * éditorial Dragon Ball. Remplace le proxy `/api/bot-admin/database/:table` pour
 * les tables dont Neon est la source de vérité (cf. `WIKI_TABLES`).
 *
 * Server-only : importe `wiki-admin.ts` (Drizzle/Postgres) → jamais bundlé côté
 * client. Gate admin via Better Auth + `users.roleAdmin` (`isCurrentUserAdmin`).
 *
 * Contrat aligné sur l'API bot `/api/database` pour réutiliser les composants
 * Client verbatim :
 *   GET    /:table?limit&offset  → { rows, total, limit, offset }
 *   GET    /:table/:id           → row (objet brut, camelCase) | 404
 *   POST   /:table               → { ok: true, row }
 *   PUT    /:table/:id           → { ok: true, row }
 *   PATCH  /:table/:id           → { ok: true, row }
 *   DELETE /:table/:id           → { ok: true }
 */
import { isCurrentUserAdmin } from "@/lib/session";
import {
	deleteWiki,
	getWikiRow,
	hasVisibility,
	insertWiki,
	isWikiTable,
	listWiki,
	listWikiOptions,
	listWikiRelations,
	listWikiSectionsForEntity,
	listWikiVisibility,
	setAllWikiVisibility,
	setWikiVisibility,
	updateWiki,
} from "@/lib/wiki-admin";
import { publicEntityUrl } from "@/lib/wiki-fields";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path: string[] }> };

/** Pages liste publiques par table (revalidées à chaque écriture). */
const WIKI_LIST_PATHS: Record<string, string[]> = {
	db_characters: ["/wiki/personnages"],
	db_planets: ["/wiki/planetes"],
	db_sagas: ["/wiki/sagas"],
	db_arcs: ["/wiki/sagas"],
	db_movies: ["/wiki/films"],
	db_games: ["/wiki/jeux"],
	db_manga_volumes: ["/wiki/manga"],
	db_manga_chapters: ["/wiki/manga"],
	db_episodes: ["/wiki/episodes"],
	db_techniques: ["/wiki/dragon-ball/techniques"],
	db_races: ["/wiki/races"],
	db_tools: ["/wiki/tools"],
};

/** entity_type d'une section → table wiki de l'entité parente (revalidation). */
const SECTION_ENTITY_TABLE: Record<string, string> = {
	character: "db_characters",
	planet: "db_planets",
	saga: "db_sagas",
	arc: "db_arcs",
	race: "db_races",
	technique: "db_techniques",
	game: "db_games",
	movie: "db_movies",
};

/**
 * Purge le cache ISR des pages publiques impactées par une écriture wiki, pour
 * que l'édition apparaisse tout de suite (au lieu d'attendre la revalidation).
 */
function revalidateWiki(table: string, row?: Record<string, unknown>): void {
	try {
		for (const p of WIKI_LIST_PATHS[table] ?? []) revalidatePath(p);
		revalidatePath("/wiki");
		const detail = row ? publicEntityUrl(table, row) : null;
		if (detail) revalidatePath(detail);
		// Les transformations n'ont pas de page propre → elles s'affichent sur la
		// fiche du personnage.
		if (table === "db_transformations" && row?.characterId != null) {
			revalidatePath(`/wiki/dragon-ball/character/${row.characterId}`);
		}
	} catch {
		/* best-effort : ne jamais faire échouer l'écriture pour une revalidation */
	}
}

/**
 * Purge la page détail de l'entité parente quand une de ses sections change
 * (best-effort : résout le slug/id via la table parente puis `publicEntityUrl`).
 */
async function revalidateSectionParent(row: Record<string, unknown> | undefined): Promise<void> {
	try {
		if (!row) return;
		const entityType = typeof row.entityType === "string" ? row.entityType : "";
		const entityId = row.entityId;
		const table = SECTION_ENTITY_TABLE[entityType];
		if (!table || entityId == null) return;
		const parent = await getWikiRow(table, String(entityId)).catch(() => null);
		const url = parent ? publicEntityUrl(table, parent) : null;
		if (url) revalidatePath(url);
	} catch {
		/* best-effort */
	}
}

const forbidden = () => NextResponse.json({ error: "Forbidden" }, { status: 403 });
const notFound = (msg = "Table inconnue") => NextResponse.json({ error: msg }, { status: 404 });
const badRequest = (msg: string) => NextResponse.json({ error: msg }, { status: 400 });

async function readJson(req: NextRequest): Promise<Record<string, unknown> | null> {
	try {
		return (await req.json()) as Record<string, unknown>;
	} catch {
		return null;
	}
}

export async function GET(req: NextRequest, ctx: Ctx) {
	if (!(await isCurrentUserAdmin())) return forbidden();
	const { path } = await ctx.params;
	const [table, id] = path;
	if (!table || !isWikiTable(table)) return notFound();

	try {
		if (id != null) {
			const row = await getWikiRow(table, decodeURIComponent(id));
			if (!row) return notFound("Row introuvable");
			return NextResponse.json(row);
		}
		const sp = req.nextUrl.searchParams;
		// Picker FK : pk + libellé seulement (léger, trié, non tronqué à 500).
		if (sp.get("as") === "options") {
			return NextResponse.json({ options: await listWikiOptions(table) });
		}
		// Relations N-N : ids liés dans une table de jointure.
		if (sp.get("as") === "relations") {
			const col = sp.get("col") ?? "";
			const relId = sp.get("id") ?? "";
			const target = sp.get("target") ?? "";
			if (!col || !relId || !target) return badRequest("col, id, target requis");
			return NextResponse.json({ ids: await listWikiRelations(table, col, relId, target) });
		}
		// Gestionnaire de visibilité : id + libellé + image + état visible.
		if (sp.get("as") === "visibility") {
			if (!hasVisibility(table)) return badRequest("Table sans colonne de visibilité");
			const q = sp.get("q") ?? undefined;
			return NextResponse.json({ items: await listWikiVisibility(table, { q }) });
		}
		// Sections d'une entité (toutes, masquées comprises) pour le panneau du studio.
		if (sp.get("as") === "sectionsFor") {
			if (table !== "db_wiki_sections") return badRequest("Réservé à db_wiki_sections");
			const entityType = sp.get("entityType") ?? "";
			const entityId = Number(sp.get("entityId"));
			if (!entityType || !Number.isFinite(entityId)) {
				return badRequest("entityType, entityId requis");
			}
			return NextResponse.json({ items: await listWikiSectionsForEntity(entityType, entityId) });
		}
		const limit = Number(sp.get("limit")) || 50;
		const offset = Number(sp.get("offset")) || 0;
		const q = sp.get("q") ?? undefined;
		return NextResponse.json(await listWiki(table, { limit, offset, q }));
	} catch (err) {
		return badRequest(err instanceof Error ? err.message : "erreur");
	}
}

export async function POST(req: NextRequest, ctx: Ctx) {
	if (!(await isCurrentUserAdmin())) return forbidden();
	const { path } = await ctx.params;
	const [table] = path;
	if (!table || !isWikiTable(table)) return notFound();
	const body = await readJson(req);
	if (!body) return badRequest("JSON body requis");
	try {
		// Bascule de visibilité (une ligne ou toute la table) — écrit la colonne
		// `visible` directement (pas via l'allowlist mutable de l'éditeur générique).
		if (req.nextUrl.searchParams.get("as") === "visibility") {
			if (!hasVisibility(table)) return badRequest("Table sans colonne de visibilité");
			const visible = body.visible === true || body.visible === "true" || body.visible === 1;
			if (body.all === true || body.all === "true") {
				const updated = await setAllWikiVisibility(table, visible);
				revalidateWiki(table);
				return NextResponse.json({ ok: true, updated });
			}
			const id = body.id;
			if (id == null || id === "") return badRequest("id ou all requis");
			await setWikiVisibility(table, String(id), visible);
			const row = await getWikiRow(table, String(id)).catch(() => null);
			revalidateWiki(table, row ?? { id });
			return NextResponse.json({ ok: true });
		}
		const row = await insertWiki(table, body);
		revalidateWiki(table, row);
		if (table === "db_wiki_sections") await revalidateSectionParent(row);
		return NextResponse.json({ ok: true, row });
	} catch (err) {
		return badRequest(err instanceof Error ? err.message : "erreur");
	}
}

async function mutate(req: NextRequest, ctx: Ctx) {
	if (!(await isCurrentUserAdmin())) return forbidden();
	const { path } = await ctx.params;
	const [table, id] = path;
	if (!table || !isWikiTable(table)) return notFound();
	if (id == null) return badRequest("id requis");
	const body = await readJson(req);
	if (!body) return badRequest("JSON body requis");
	try {
		const row = await updateWiki(table, decodeURIComponent(id), body);
		revalidateWiki(table, row);
		if (table === "db_wiki_sections") await revalidateSectionParent(row);
		return NextResponse.json({ ok: true, row });
	} catch (err) {
		return badRequest(err instanceof Error ? err.message : "erreur");
	}
}

export const PUT = mutate;
export const PATCH = mutate;

export async function DELETE(req: NextRequest, ctx: Ctx) {
	if (!(await isCurrentUserAdmin())) return forbidden();
	const { path } = await ctx.params;
	const [table, id] = path;
	if (!table || !isWikiTable(table)) return notFound();
	if (id == null) return badRequest("id requis");
	try {
		const decoded = decodeURIComponent(id);
		// On lit la ligne AVANT suppression pour pouvoir purger la page détail
		// (slug/id) qui n'existe plus après coup.
		const before = await getWikiRow(table, decoded).catch(() => null);
		await deleteWiki(table, decoded);
		revalidateWiki(table, before ?? { id: decoded });
		if (table === "db_wiki_sections") await revalidateSectionParent(before ?? undefined);
		return NextResponse.json({ ok: true });
	} catch (err) {
		return badRequest(err instanceof Error ? err.message : "erreur");
	}
}
