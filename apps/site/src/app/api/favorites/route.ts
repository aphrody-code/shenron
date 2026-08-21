/**
 * /api/favorites — favoris d'un compte connecté.
 *
 *   GET → { favorites }        la liste enregistrée
 *   PUT → { ok, count }        remplace la liste
 *
 * Stockés dans `public.user_preferences.prefs.favorites` (jsonb libre) : la
 * table existe déjà et son champ `prefs` est fait pour ça, donc aucune
 * migration. La clé d'identité suit la convention du fichier : `u:<userId>`.
 *
 * Le stockage de référence reste le navigateur (cf. `lib/favorites.ts`) : cette
 * route n'est qu'un miroir permettant de retrouver ses favoris d'un appareil à
 * l'autre. Un visiteur anonyme reçoit une liste vide, jamais une erreur — le
 * bouton doit continuer de fonctionner sans compte.
 */
import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userPreferences } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Plafond de la liste : un favori est un raccourci, pas une sauvegarde. */
const MAX = 200;

type Favorite = {
	kind: string;
	id: string;
	title: string;
	href: string;
	image?: string | null;
	caption?: string | null;
	at: number;
};

const KINDS = new Set(["episode", "movie", "chapter", "character", "saga", "game"]);

/** Validation stricte : la charge vient du client, elle est rejouée telle quelle. */
function sanitize(input: unknown): Favorite[] {
	if (!Array.isArray(input)) return [];
	const str = (v: unknown, max: number): string | null =>
		typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

	const out: Favorite[] = [];
	const seen = new Set<string>();
	for (const raw of input.slice(0, MAX)) {
		if (!raw || typeof raw !== "object") continue;
		const f = raw as Record<string, unknown>;
		const kind = str(f.kind, 20);
		const id = str(f.id, 64);
		const title = str(f.title, 200);
		const href = str(f.href, 300);
		if (!kind || !KINDS.has(kind) || !id || !title || !href) continue;
		// `href` sert de cible de lien : on n'accepte que du chemin interne, jamais
		// une URL absolue (qui ferait de la liste un vecteur de redirection).
		if (!href.startsWith("/") || href.startsWith("//")) continue;
		const key = `${kind}:${id}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push({
			kind,
			id,
			title,
			href,
			image: str(f.image, 300),
			caption: str(f.caption, 120),
			at: typeof f.at === "number" && Number.isFinite(f.at) ? f.at : Date.now(),
		});
	}
	return out;
}

const identityOf = (userId: string) => `u:${userId}`;

export async function GET() {
	const me = await getCurrentUser();
	if (!me?.user) return NextResponse.json({ favorites: [] });
	try {
		const [row] = await db
			.select({ prefs: userPreferences.prefs })
			.from(userPreferences)
			.where(eq(userPreferences.identity, identityOf(me.user.id)))
			.limit(1);
		const favorites = sanitize((row?.prefs as Record<string, unknown> | undefined)?.favorites);
		return NextResponse.json(
			{ favorites },
			// Strictement personnel : jamais de cache partagé.
			{ headers: { "cache-control": "private, no-store" } }
		);
	} catch (err) {
		console.error("[favorites] lecture", err);
		return NextResponse.json({ favorites: [] });
	}
}

export async function PUT(req: NextRequest) {
	const me = await getCurrentUser();
	if (!me?.user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "JSON body requis" }, { status: 400 });
	}
	const favorites = sanitize((body as { favorites?: unknown })?.favorites);

	try {
		const identity = identityOf(me.user.id);
		const [existing] = await db
			.select({ prefs: userPreferences.prefs })
			.from(userPreferences)
			.where(eq(userPreferences.identity, identity))
			.limit(1);

		// Fusion et non remplacement du document : `prefs` porte aussi les
		// préférences dérivées de la télémétrie, qu'on n'a pas à écraser.
		const prefs = { ...existing?.prefs, favorites };
		await db
			.insert(userPreferences)
			.values({ identity, userId: me.user.id, prefs })
			.onConflictDoUpdate({
				target: userPreferences.identity,
				set: { prefs, userId: me.user.id, updatedAt: new Date() },
			});
		return NextResponse.json({ ok: true, count: favorites.length });
	} catch (err) {
		console.error("[favorites] écriture", err);
		return NextResponse.json({ error: "Enregistrement impossible" }, { status: 500 });
	}
}
