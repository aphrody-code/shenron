/**
 * API Databooks — transcriptions d'un lot de planches, à la demande.
 *
 *   GET /api/databooks/:id/textes?pages=12,13,14
 *
 * Pourquoi cette route existe : la fiche publique envoyait au navigateur la
 * transcription des planches de l'ouvrage ENTIER, alors qu'on en lit une à la
 * fois. Mesuré le 2026-08-31 sur `/wiki/databooks/4` (Daizenshuu 7, 313
 * planches) : 459 Ko de page, dont 412 Ko de charge RSC, dont l'essentiel est
 * 281 197 signes de japonais que le visiteur ne verra jamais. La fiche
 * n'embarque plus que les premières planches ; le lecteur demande la suite ici,
 * au fil du défilement.
 *
 * Lecture seule, publique (le corpus l'est), et sans cookie ni en-tête de
 * session : la réponse reste cacheable par le CDN.
 */
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { parseDatabookId } from "@/lib/databooks-rules";

export const runtime = "nodejs";

/** Une fenêtre de lecture, pas un moyen d'aspirer l'ouvrage en une requête. */
const MAX_PAGES = 40;

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
	const id = parseDatabookId((await ctx.params).id);
	if (id === null) return NextResponse.json({ error: "Fiche introuvable." }, { status: 404 });

	const demandees = [
		...new Set(
			(new URL(req.url).searchParams.get("pages") ?? "")
				.split(",")
				.map((v) => Number(v.trim()))
				.filter((v) => Number.isSafeInteger(v) && v > 0),
		),
	].slice(0, MAX_PAGES);
	if (demandees.length === 0) return NextResponse.json({ textes: {} });

	// Un seul aller-retour, et le filtrage se fait côté Postgres : rapatrier la
	// colonne `pages` entière pour en extraire trois planches referait, côté
	// serveur, exactement la dépense qu'on cherche à supprimer côté client.
	const lignes = (await db.execute(sql`
		select (e->>'number')::int as numero, e->>'text' as texte
		from bot.db_databooks d, jsonb_array_elements(d.pages) e
		where d.id = ${id}::bigint
		  and (e->>'number')::int in (${sql.join(
				demandees.map((n) => sql`${n}`),
				sql`, `,
			)})
	`)) as unknown as Array<{ numero: number; texte: string | null }>;

	const textes: Record<string, string> = {};
	for (const l of lignes) {
		if (l.texte && l.texte.trim()) textes[String(l.numero)] = l.texte;
	}

	return NextResponse.json(
		{ textes },
		{
			headers: {
				// Le corpus ne bouge qu'au rythme des dépôts de transcription ;
				// une heure de cache, revalidée en arrière-plan, suffit largement.
				"Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
			},
		},
	);
}
