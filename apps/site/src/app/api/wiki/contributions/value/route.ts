/**
 * GET /api/wiki/contributions/value?table=&rowId=&column=
 *
 * Valeur ACTUELLE d'un champ éditorial, lue au moment où le contributeur ouvre
 * la modale. Deux raisons de ne pas la passer en prop depuis la page :
 *
 *  - un article long fait des dizaines de Ko ; l'embarquer dans la charge RSC
 *    de chaque fiche la doublerait pour un bouton que peu de gens cliquent ;
 *  - les fiches sont servies en ISR, donc la valeur rendue peut dater. Partir
 *    d'un texte périmé, c'est fabriquer un conflit à l'acceptation.
 *
 * Réservé aux membres connectés : le contenu est public, mais l'endpoint sert
 * la contribution, pas la lecture — inutile d'en faire une surface d'aspiration.
 */
import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getWikiRow } from "@/lib/wiki-admin";
import { targetIsValid } from "@/lib/wiki-contributions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
	let session: Awaited<ReturnType<typeof getCurrentUser>> = null;
	try {
		session = await getCurrentUser();
	} catch {
		session = null;
	}
	if (!session?.user?.id) {
		return NextResponse.json({ ok: false, error: "auth_required" }, { status: 401 });
	}

	const sp = req.nextUrl.searchParams;
	const table = sp.get("table") ?? "";
	const rowId = sp.get("rowId") ?? "";
	const column = sp.get("column") ?? "";
	if (!targetIsValid(table, column) || !rowId) {
		return NextResponse.json({ ok: false, error: "bad_target" }, { status: 400 });
	}

	const row = await getWikiRow(table, rowId).catch(() => null);
	if (!row) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

	const v = (row as Record<string, unknown>)[column];
	return NextResponse.json({ ok: true, value: v == null ? "" : String(v) });
}
