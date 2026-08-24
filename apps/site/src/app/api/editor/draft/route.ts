/**
 * Brouillons d'édition — l'autosauvegarde serveur du module d'édition.
 *
 * Trois verbes, une clé logique (`key`) par document et un brouillon par
 * utilisateur : `GET` pour la reprise, `PUT` pour l'autosauvegarde, `DELETE`
 * quand le contenu a été réellement enregistré à sa vraie place.
 *
 * Réservé aux comptes connectés (le brouillon est nominatif). L'éditeur double
 * de toute façon cette sauvegarde d'une copie locale : perdre la session ne perd
 * pas le texte.
 */
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { editorDrafts } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// L'identité retenue est `sessionUserId` (Better Auth) : elle existe dès la
// connexion, sans dépendre de l'upsert du user métier.

/** Un brouillon ne doit jamais devenir un canal de stockage : 512 Ko suffisent largement. */
const MAX_CONTENT = 512 * 1024;

export async function GET(req: Request) {
	const user = await getCurrentUser();
	if (!user) return Response.json({ draft: null }, { status: 200 });

	const key = new URL(req.url).searchParams.get("key");
	if (!key) return Response.json({ error: "Clé manquante." }, { status: 400 });

	const [draft] = await db
		.select()
		.from(editorDrafts)
		.where(and(eq(editorDrafts.docKey, key), eq(editorDrafts.userId, user.sessionUserId)))
		.limit(1);

	return Response.json({ draft: draft ?? null });
}

export async function PUT(req: Request) {
	const user = await getCurrentUser();
	if (!user) return Response.json({ error: "Session requise." }, { status: 401 });

	const body = (await req.json().catch(() => null)) as {
		key?: string;
		format?: string;
		content?: string;
		label?: string;
	} | null;
	if (!body?.key || typeof body.content !== "string") {
		return Response.json({ error: "Requête invalide." }, { status: 400 });
	}
	if (body.content.length > MAX_CONTENT) {
		return Response.json({ error: "Brouillon trop volumineux." }, { status: 413 });
	}

	const now = new Date();
	await db
		.insert(editorDrafts)
		.values({
			docKey: body.key,
			userId: user.sessionUserId,
			format: body.format ?? "markdown",
			content: body.content,
			label: body.label ?? null,
			updatedAt: now,
		})
		.onConflictDoUpdate({
			target: [editorDrafts.docKey, editorDrafts.userId],
			set: {
				content: body.content,
				format: body.format ?? "markdown",
				label: body.label ?? null,
				updatedAt: now,
			},
		});

	return Response.json({ ok: true, savedAt: now.toISOString() });
}

/**
 * `sendBeacon` (déchargement de page) ne sait émettre qu'un POST : même
 * traitement que `PUT`, c'est la dernière écriture avant la fermeture de
 * l'onglet.
 */
export const POST = PUT;

export async function DELETE(req: Request) {
	const user = await getCurrentUser();
	if (!user) return Response.json({ ok: true });

	const key = new URL(req.url).searchParams.get("key");
	if (!key) return Response.json({ error: "Clé manquante." }, { status: 400 });

	await db
		.delete(editorDrafts)
		.where(and(eq(editorDrafts.docKey, key), eq(editorDrafts.userId, user.sessionUserId)));

	return Response.json({ ok: true });
}
