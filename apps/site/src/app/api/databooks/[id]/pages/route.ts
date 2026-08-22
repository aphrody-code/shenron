/**
 * API Databooks — édition d'UNE planche.
 *
 *   PATCH /api/databooks/:id/pages   { number, text }   (admin connecté ou jeton)
 *
 * Le studio sait déjà écrire les pages, mais seulement en bloc : il renvoie le
 * tableau `pages` entier. Pour corriger une ligne dans un ouvrage de 362
 * planches, cela veut dire réémettre ~300 Ko de jsonb — et surtout écraser tout
 * dépôt de transcription arrivé entre-temps, puisque le tableau envoyé date du
 * chargement de la page. C'est intenable pendant que la transcription tourne.
 *
 * Ici l'écriture est **ciblée et atomique** : la substitution se fait en SQL,
 * dans un seul `UPDATE`, sur la seule planche visée. Les autres planches ne sont
 * jamais réécrites, donc jamais perdues.
 *
 * `text: null` efface la transcription de la planche (l'image reste). Une chaîne
 * vide fait la même chose — ici, contrairement au dépôt de masse, l'intention
 * vient d'un humain qui a vidé un champ, pas d'un modèle qui n'a rien su lire.
 */
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { hasValidApiToken } from "@/lib/api-token";
import { db } from "@/lib/db";
import { getDatabook } from "@/lib/databooks";
import { parseDatabookId } from "@/lib/databooks-rules";
import { indexDatabook } from "@/lib/databooks-redis";
import { getCurrentUser } from "@/lib/session";
import { recordRevision } from "@/lib/wiki-revisions";
import { revalidateWikiEntity } from "@/lib/wiki-revalidate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Aligné sur le dépôt de masse : au-delà, c'est une erreur, pas une planche. */
const TEXTE_MAX = 40_000;

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
	const me = await getCurrentUser();
	const admin = me?.user?.roleAdmin === true;
	if (!admin && !hasValidApiToken(req)) {
		return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
	}

	const id = parseDatabookId((await ctx.params).id);
	if (id === null) return NextResponse.json({ error: "Fiche introuvable." }, { status: 404 });

	let corps: { number?: unknown; text?: unknown };
	try {
		corps = (await req.json()) as typeof corps;
	} catch {
		return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
	}

	const numero = Number(corps.number);
	if (!Number.isSafeInteger(numero) || numero <= 0) {
		return NextResponse.json({ error: "`number` doit être un entier positif." }, { status: 400 });
	}
	if (corps.text !== null && typeof corps.text !== "string") {
		return NextResponse.json({ error: "`text` doit être une chaîne ou null." }, { status: 400 });
	}
	const texte = corps.text === null ? null : (corps.text as string).trim().slice(0, TEXTE_MAX) || null;

	const avant = await getDatabook(id);
	if (!avant) return NextResponse.json({ error: "Fiche introuvable." }, { status: 404 });
	if (!avant.pages.some((p) => p.number === numero)) {
		// Plutôt que d'ajouter une planche fantôme : un numéro absent signale un
		// décalage entre l'écran de relecture et la base (fiche rechargée ailleurs).
		return NextResponse.json(
			{ error: `La planche n°${numero} n'existe pas dans cette fiche.` },
			{ status: 404 }
		);
	}

	// Substitution en base : on ne réécrit que l'entrée visée, `ORDER BY ord`
	// préserve l'ordre de lecture. `p - 'text'` retire la clé au lieu d'y poser
	// une chaîne vide — `normalizePages` traite les deux pareil, mais le jsonb
	// stocké reste propre.
	const patch =
		texte === null
			? sql`t.p - 'text'`
			: sql`t.p || jsonb_build_object('text', ${texte}::text)`;

	await db.execute(sql`
		UPDATE bot.db_databooks d
		SET pages = coalesce((
			SELECT jsonb_agg(
				CASE WHEN coalesce((t.p ->> 'number')::int, t.ord::int) = ${numero}
					THEN ${patch}
					ELSE t.p
				END ORDER BY t.ord)
			FROM jsonb_array_elements(
				CASE WHEN jsonb_typeof(d.pages) = 'array' THEN d.pages ELSE '[]'::jsonb END
			) WITH ORDINALITY AS t(p, ord)
		), '[]'::jsonb)
		WHERE d.id = ${id}
	`);

	const apres = await getDatabook(id);
	if (!apres) return NextResponse.json({ error: "Fiche introuvable." }, { status: 404 });

	await indexDatabook(apres);
	await recordRevision({
		table: "db_databooks",
		id: String(id),
		action: "update",
		before: avant as unknown as Record<string, unknown>,
		after: apres as unknown as Record<string, unknown>,
		actor: admin
			? { id: me?.user?.id ?? "admin", name: me?.user?.username ?? "Admin" }
			: { id: "api-transcription", name: "Transcription (API)" },
	});
	revalidateWikiEntity("db_databooks", { id });

	const transcrites = apres.pages.filter((p) => (p.text ?? "").length > 0).length;
	return NextResponse.json({
		id,
		number: numero,
		text: apres.pages.find((p) => p.number === numero)?.text ?? null,
		pagesTotal: apres.pages.length,
		pagesTranscrites: transcrites,
	});
}
