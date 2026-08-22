/**
 * API Databooks — recherche DANS LE TEXTE DES PLANCHES.
 *
 *   GET /api/databooks/search?q=…&limit=&databook=&includeHidden=1
 *
 * `/api/databooks?q=` cherche dans les métadonnées (titre, titre japonais,
 * auteur, description) : c'est ce qu'il faut pour trouver un ouvrage. Cette
 * route-ci cherche dans les **transcriptions** — le contenu des planches — et
 * répond à l'autre question : « dans quel ouvrage, à quelle page, ce passage
 * apparaît-il ? ». Mesuré le 2026-08-22 avant son ajout : une phrase japonaise
 * présente dans cinq ouvrages remontait 0 résultat.
 *
 * Chaque item porte son numéro de planche et son texte intégral ; le découpage
 * en extraits surlignés est fait côté client (`extraireSegments`), ce qui évite
 * de renvoyer du HTML depuis la base.
 *
 * Lecture publique, alignée sur `/api/databooks` : seules les fiches
 * `visible = true` sortent, sauf appel porteur d'un jeton valide.
 */
import { NextResponse } from "next/server";
import { hasValidApiToken } from "@/lib/api-token";
import { chercherDansPlanches } from "@/lib/databooks-transcription";
import { parseDatabookId } from "@/lib/databooks-rules";

export const dynamic = "force-dynamic";

const CORS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Access-Control-Max-Age": "86400",
};

/** Au-delà, le motif n'est plus une recherche mais un balayage déguisé. */
const TERME_MAX = 200;

export function OPTIONS() {
	return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(req: Request) {
	const url = new URL(req.url);
	const terme = (url.searchParams.get("q") ?? "").trim().slice(0, TERME_MAX);
	if (!terme) {
		return NextResponse.json(
			{ error: "Paramètre `q` requis." },
			{ status: 400, headers: CORS }
		);
	}

	const limitBrut = Number(url.searchParams.get("limit"));
	const cible = url.searchParams.get("databook");
	const autorise = hasValidApiToken(req);

	try {
		const r = await chercherDansPlanches(terme, {
			limit: Number.isFinite(limitBrut) ? limitBrut : undefined,
			includeHidden: autorise && url.searchParams.get("includeHidden") === "1",
			databookId: cible ? (parseDatabookId(cible) ?? undefined) : undefined,
		});
		return NextResponse.json(
			{ q: terme, ...r },
			{ headers: { ...CORS, "Cache-Control": "public, max-age=60, s-maxage=300" } }
		);
	} catch (e) {
		console.error("[api/databooks/search] a échoué:", e);
		return NextResponse.json({ error: "Recherche impossible." }, { status: 500, headers: CORS });
	}
}
