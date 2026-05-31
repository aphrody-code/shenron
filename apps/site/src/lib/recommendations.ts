/**
 * recommendations — fondation reco / personnalisation (server-only).
 *
 * Agrège la télémétrie web (`site_events`) en :
 *   - préférences dérivées par identité (`getUserPreferences`) : entités les
 *     plus vues, types/sections privilégiés, séries préférées… (matérialisées
 *     dans `user_preferences` pour éviter de re-scanner à chaque requête),
 *   - recommandations item-to-item (`getRecommendations`) : « les visiteurs qui
 *     ont vu X ont aussi vu Y » via co-occurrence dans une même session, plus un
 *     repli personnalisé sur l'historique de l'identité.
 *
 * Server-only : tape Neon via Drizzle (`db`) → ne doit jamais fuiter au client.
 * Aucune dépendance au gameplay du bot : c'est de la reco WEB pure.
 */
import "server-only";
import { and, desc, eq, gt, inArray, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteEvents, userPreferences } from "@/db/schema";

// --- Identité ----------------------------------------------------------------

export type Identity = { userId?: string | null; anonId?: string | null };

/** Clé d'identité unique (préfixée) pour `user_preferences.identity`. */
function identityKey(id: Identity): string | null {
	if (id.userId) return `u:${id.userId}`;
	if (id.anonId) return `a:${id.anonId}`;
	return null;
}

/** Filtre Drizzle « events de cette identité » (userId prioritaire). */
function identityFilter(id: Identity) {
	if (id.userId) return eq(siteEvents.userId, id.userId);
	if (id.anonId) return eq(siteEvents.anonId, id.anonId);
	return undefined;
}

// --- Types de sortie ---------------------------------------------------------

export type EntityRef = { entityType: string; entityId: string };

export type DerivedPreferences = {
	/** Entités les plus vues (toutes catégories), triées par fréquence. */
	topEntities: Array<EntityRef & { count: number; lastName?: string }>;
	/** Répartition par type d'entité (character, saga…), triée. */
	topEntityTypes: Array<{ entityType: string; count: number }>;
	/** Séries préférées dérivées des props (Dragon Ball, Z, Super…). */
	topSeries: Array<{ series: string; count: number }>;
	/** Sections de la home les plus cliquées. */
	topSections: Array<{ section: string; count: number }>;
	/** Recherches récentes (déduplifiées). */
	recentSearches: string[];
	/** Nombre total d'events pris en compte (poids de confiance). */
	eventCount: number;
};

const EMPTY_PREFS: DerivedPreferences = {
	topEntities: [],
	topEntityTypes: [],
	topSeries: [],
	topSections: [],
	recentSearches: [],
	eventCount: 0,
};

// --- Agrégation des préférences ---------------------------------------------

/**
 * Calcule les préférences dérivées d'une identité à partir de ses events.
 * Fenêtre glissante 90 j (comportement récent > historique ancien).
 */
async function computePreferences(id: Identity): Promise<DerivedPreferences> {
	const who = identityFilter(id);
	if (!who) return EMPTY_PREFS;

	const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

	// Top entités vues (wiki_view) — agrégation SQL.
	const entities = await db
		.select({
			entityType: siteEvents.entityType,
			entityId: siteEvents.entityId,
			count: sql<number>`count(*)::int`,
			lastName: sql<
				string | null
			>`(array_agg(${siteEvents.props}->>'entityName' order by ${siteEvents.ts} desc))[1]`,
		})
		.from(siteEvents)
		.where(
			and(
				who,
				eq(siteEvents.type, "wiki_view"),
				gt(siteEvents.ts, since),
				sql`${siteEvents.entityType} is not null and ${siteEvents.entityId} is not null`,
			),
		)
		.groupBy(siteEvents.entityType, siteEvents.entityId)
		.orderBy(desc(sql`count(*)`))
		.limit(20);

	// Répartition par type.
	const types = await db
		.select({
			entityType: siteEvents.entityType,
			count: sql<number>`count(*)::int`,
		})
		.from(siteEvents)
		.where(and(who, eq(siteEvents.type, "wiki_view"), gt(siteEvents.ts, since)))
		.groupBy(siteEvents.entityType)
		.orderBy(desc(sql`count(*)`))
		.limit(10);

	// Séries préférées (props.series).
	const series = await db
		.select({
			series: sql<string>`${siteEvents.props}->>'series'`,
			count: sql<number>`count(*)::int`,
		})
		.from(siteEvents)
		.where(
			and(who, gt(siteEvents.ts, since), sql`${siteEvents.props}->>'series' is not null`),
		)
		.groupBy(sql`${siteEvents.props}->>'series'`)
		.orderBy(desc(sql`count(*)`))
		.limit(5);

	// Sections home cliquées.
	const sections = await db
		.select({
			section: sql<string>`${siteEvents.props}->>'section'`,
			count: sql<number>`count(*)::int`,
		})
		.from(siteEvents)
		.where(
			and(who, eq(siteEvents.type, "home_section"), sql`${siteEvents.props}->>'section' is not null`),
		)
		.groupBy(sql`${siteEvents.props}->>'section'`)
		.orderBy(desc(sql`count(*)`))
		.limit(8);

	// Recherches récentes.
	const searches = await db
		.select({ query: sql<string>`${siteEvents.props}->>'query'` })
		.from(siteEvents)
		.where(
			and(who, eq(siteEvents.type, "search"), sql`${siteEvents.props}->>'query' is not null`),
		)
		.orderBy(desc(siteEvents.ts))
		.limit(30);

	const seen = new Set<string>();
	const recentSearches: string[] = [];
	for (const s of searches) {
		const q = s.query?.trim();
		if (q && !seen.has(q.toLowerCase())) {
			seen.add(q.toLowerCase());
			recentSearches.push(q);
		}
		if (recentSearches.length >= 8) break;
	}

	const eventCount = entities.reduce((a, e) => a + e.count, 0);

	return {
		topEntities: entities
			.filter((e) => e.entityType && e.entityId)
			.map((e) => ({
				entityType: e.entityType!,
				entityId: e.entityId!,
				count: e.count,
				lastName: e.lastName ?? undefined,
			})),
		topEntityTypes: types
			.filter((t) => t.entityType)
			.map((t) => ({ entityType: t.entityType!, count: t.count })),
		topSeries: series.filter((s) => s.series).map((s) => ({ series: s.series, count: s.count })),
		topSections: sections
			.filter((s) => s.section)
			.map((s) => ({ section: s.section, count: s.count })),
		recentSearches,
		eventCount,
	};
}

/**
 * Préférences dérivées d'une identité, avec cache matérialisé.
 *
 * Sert depuis `user_preferences` si frais (< `maxAgeMs`), sinon recalcule et
 * ré-écrit l'agrégat (upsert). Sans identité → préférences vides.
 */
export async function getUserPreferences(
	id: Identity,
	opts?: { maxAgeMs?: number; forceRefresh?: boolean },
): Promise<DerivedPreferences> {
	const key = identityKey(id);
	if (!key) return EMPTY_PREFS;
	const maxAge = opts?.maxAgeMs ?? 6 * 60 * 60 * 1000; // 6 h

	if (!opts?.forceRefresh) {
		const [cached] = await db
			.select()
			.from(userPreferences)
			.where(eq(userPreferences.identity, key))
			.limit(1);
		if (cached && Date.now() - cached.updatedAt.getTime() < maxAge) {
			return { ...EMPTY_PREFS, ...(cached.prefs as Partial<DerivedPreferences>) };
		}
	}

	const prefs = await computePreferences(id);

	// Matérialise (upsert) — best-effort, n'échoue pas la requête appelante.
	try {
		await db
			.insert(userPreferences)
			.values({
				identity: key,
				userId: id.userId ?? null,
				anonId: id.anonId ?? null,
				prefs: prefs as unknown as Record<string, unknown>,
				eventCount: prefs.eventCount,
				updatedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: userPreferences.identity,
				set: {
					prefs: prefs as unknown as Record<string, unknown>,
					eventCount: prefs.eventCount,
					userId: id.userId ?? null,
					anonId: id.anonId ?? null,
					updatedAt: new Date(),
				},
			});
	} catch (err) {
		console.error("[recommendations] prefs upsert failed", err);
	}

	return prefs;
}

// --- Recommandations item-to-item -------------------------------------------

export type RecommendationContext = {
	/** Entité de référence (page courante) pour le « aussi consulté ». */
	entityType?: string;
	entityId?: string | number;
	limit?: number;
};

export type Recommendation = EntityRef & {
	score: number;
	name?: string;
	reason: "co_view" | "affinity" | "popular";
};

/**
 * Recommandations pour une identité dans un contexte donné.
 *
 * Stratégie en cascade :
 *   1. **co_view** — si un `entityType/entityId` de contexte est fourni :
 *      co-occurrence en session (« vu aussi par les visiteurs de cette fiche »).
 *   2. **affinity** — complète avec les entités préférées de l'identité.
 *   3. **popular** — repli sur les entités globalement les plus vues (90 j).
 *
 * Anonyme/cold-start sans contexte → renvoie directement le populaire.
 */
export async function getRecommendations(
	id: Identity,
	ctx: RecommendationContext = {},
): Promise<Recommendation[]> {
	const limit = ctx.limit ?? 8;
	const out = new Map<string, Recommendation>();
	const refId = ctx.entityId != null ? String(ctx.entityId) : null;
	const refKey = ctx.entityType && refId ? `${ctx.entityType}:${refId}` : null;

	const add = (r: Recommendation) => {
		const k = `${r.entityType}:${r.entityId}`;
		if (k === refKey) return; // jamais se recommander soi-même
		const prev = out.get(k);
		if (!prev || r.score > prev.score) out.set(k, r);
	};

	const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

	// 1) Co-view en session : sessions ayant vu l'entité de référence → autres
	//    entités vues dans ces mêmes sessions, pondérées par fréquence.
	if (ctx.entityType && refId) {
		const sessionsSub = db
			.select({ sessionId: siteEvents.sessionId })
			.from(siteEvents)
			.where(
				and(
					eq(siteEvents.type, "wiki_view"),
					eq(siteEvents.entityType, ctx.entityType),
					eq(siteEvents.entityId, refId),
					gt(siteEvents.ts, since),
				),
			);

		const coViews = await db
			.select({
				entityType: siteEvents.entityType,
				entityId: siteEvents.entityId,
				count: sql<number>`count(distinct ${siteEvents.sessionId})::int`,
				name: sql<
					string | null
				>`(array_agg(${siteEvents.props}->>'entityName' order by ${siteEvents.ts} desc))[1]`,
			})
			.from(siteEvents)
			.where(
				and(
					eq(siteEvents.type, "wiki_view"),
					gt(siteEvents.ts, since),
					inArray(siteEvents.sessionId, sessionsSub),
					sql`${siteEvents.entityType} is not null and ${siteEvents.entityId} is not null`,
					sql`not (${siteEvents.entityType} = ${ctx.entityType} and ${siteEvents.entityId} = ${refId})`,
				),
			)
			.groupBy(siteEvents.entityType, siteEvents.entityId)
			.orderBy(desc(sql`count(distinct ${siteEvents.sessionId})`))
			.limit(limit * 2);

		for (const c of coViews) {
			if (!c.entityType || !c.entityId) continue;
			add({
				entityType: c.entityType,
				entityId: c.entityId,
				name: c.name ?? undefined,
				score: c.count * 3, // co-view = signal fort
				reason: "co_view",
			});
		}
	}

	// 2) Affinité perso : entités préférées de l'identité.
	if (out.size < limit) {
		const prefs = await getUserPreferences(id);
		for (const e of prefs.topEntities) {
			add({
				entityType: e.entityType,
				entityId: e.entityId,
				name: e.lastName,
				score: e.count, // poids = fréquence personnelle
				reason: "affinity",
			});
		}
	}

	// 3) Repli populaire global (cold-start / complément).
	if (out.size < limit) {
		const popular = await db
			.select({
				entityType: siteEvents.entityType,
				entityId: siteEvents.entityId,
				count: sql<number>`count(*)::int`,
				name: sql<
					string | null
				>`(array_agg(${siteEvents.props}->>'entityName' order by ${siteEvents.ts} desc))[1]`,
			})
			.from(siteEvents)
			.where(
				and(
					eq(siteEvents.type, "wiki_view"),
					gt(siteEvents.ts, since),
					sql`${siteEvents.entityType} is not null and ${siteEvents.entityId} is not null`,
					...(ctx.entityType ? [eq(siteEvents.entityType, ctx.entityType)] : []),
					...(refKey ? [ne(sql`${siteEvents.entityType} || ':' || ${siteEvents.entityId}`, refKey)] : []),
				),
			)
			.groupBy(siteEvents.entityType, siteEvents.entityId)
			.orderBy(desc(sql`count(*)`))
			.limit(limit * 2);

		for (const p of popular) {
			if (!p.entityType || !p.entityId) continue;
			add({
				entityType: p.entityType,
				entityId: p.entityId,
				name: p.name ?? undefined,
				score: Math.max(1, Math.log2(p.count + 1)), // popularité = signal faible
				reason: "popular",
			});
		}
	}

	return [...out.values()].sort((a, b) => b.score - a.score).slice(0, limit);
}
