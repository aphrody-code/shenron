/**
 * API Databooks — dépôt d'une transcription.
 *
 *   POST /api/databooks/:id/transcription   (jeton porteur requis)
 *
 * Conçue pour la transcription de masse image → texte : le corpus compte
 * **11 513 planches, dont 11 277 sans texte**. Un modèle local rend un lot,
 * cette route le réinjecte page par page.
 *
 * Corps :
 *   {
 *     "mode": "merge" | "replace",          // défaut : merge
 *     "pages": [{ "number": 1, "text": "…" }],
 *     "description": "…"                    // facultatif : chapô de la fiche (markdown)
 *   }
 *
 * `merge` (défaut) ne touche QUE le champ `text` des pages citées : l'image et
 * les pages absentes du corps restent intactes. C'est le mode sûr pour un
 * traitement par lots qu'on peut relancer — il est idempotent.
 * `replace` remplace tout le tableau de pages : à réserver à une reprise complète.
 *
 * Chaque dépôt enregistre une révision (`public.wiki_revisions`), donc reste
 * consultable et réversible depuis /admin/wiki/history — une transcription
 * automatique est une proposition, pas une vérité.
 */
import { NextResponse } from "next/server";
import { hasValidApiToken } from "@/lib/api-token";
import { getDatabook, updateDatabook } from "@/lib/databooks";
import { parseDatabookId, type DatabookPageInput } from "@/lib/databooks-rules";
import { recordRevision } from "@/lib/wiki-revisions";

export const dynamic = "force-dynamic";

const CORS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Access-Control-Max-Age": "86400",
};

/** Un texte de planche plus long que ça relève de l'erreur, pas de l'OCR. */
const TEXTE_MAX = 40_000;
/** Garde-fou de charge : au-delà, découper en plusieurs appels. */
const PAGES_MAX = 2_000;

export function OPTIONS() {
	return new NextResponse(null, { status: 204, headers: CORS });
}

interface Corps {
	mode?: "merge" | "replace";
	pages?: { number?: unknown; text?: unknown; image?: unknown }[];
	description?: string | null;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
	if (!hasValidApiToken(req)) {
		return NextResponse.json(
			{ error: "Jeton porteur requis." },
			{ status: 401, headers: { ...CORS, "WWW-Authenticate": "Bearer" } }
		);
	}
	const id = parseDatabookId((await ctx.params).id);
	if (id === null) {
		return NextResponse.json({ error: "Fiche introuvable." }, { status: 404, headers: CORS });
	}

	let corps: Corps;
	try {
		corps = (await req.json()) as Corps;
	} catch {
		return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400, headers: CORS });
	}

	const entrees = Array.isArray(corps.pages) ? corps.pages : [];
	if (entrees.length === 0 && corps.description === undefined) {
		return NextResponse.json(
			{ error: "Rien à déposer : fournir `pages` et/ou `description`." },
			{ status: 400, headers: CORS }
		);
	}
	if (entrees.length > PAGES_MAX) {
		return NextResponse.json(
			{ error: `Trop de pages en un appel (max ${PAGES_MAX}).` },
			{ status: 413, headers: CORS }
		);
	}

	const avant = await getDatabook(id);
	if (!avant) {
		return NextResponse.json({ error: "Fiche introuvable." }, { status: 404, headers: CORS });
	}

	// Textes déposés, indexés par numéro de page.
	const textes = new Map<number, string>();
	let ignorees = 0;
	for (const e of entrees) {
		const n = Number(e?.number);
		const t = typeof e?.text === "string" ? e.text.trim() : "";
		if (!Number.isSafeInteger(n) || n <= 0 || !t) {
			ignorees++;
			continue;
		}
		textes.set(n, t.slice(0, TEXTE_MAX));
	}

	const mode = corps.mode === "replace" ? "replace" : "merge";
	let pages: DatabookPageInput[];
	let inconnues = 0;

	if (mode === "replace") {
		// Reprise complète : l'appelant fournit le tableau entier. On conserve
		// l'image existante quand il ne la redonne pas — perdre le chemin d'une
		// planche serait irréversible côté fichiers.
		const parNumero = new Map(avant.pages.map((p) => [p.number, p]));
		pages = entrees
			.map((e, i) => {
				const n = Number(e?.number);
				const numero = Number.isSafeInteger(n) && n > 0 ? n : i + 1;
				const ancienne = parNumero.get(numero);
				const image =
					typeof e?.image === "string" && e.image.trim()
						? e.image.trim()
						: (ancienne?.image ?? null);
				return { number: numero, image, text: textes.get(numero) ?? null };
			})
			.sort((a, b) => a.number - b.number);
	} else {
		pages = avant.pages.map((p) => {
			const t = textes.get(p.number);
			return t === undefined ? p : { ...p, text: t };
		});
		const connus = new Set(avant.pages.map((p) => p.number));
		for (const n of textes.keys()) if (!connus.has(n)) inconnues++;
	}

	const apres = await updateDatabook(id, {
		pages,
		...(corps.description !== undefined ? { description: corps.description } : {}),
	});
	if (!apres) {
		return NextResponse.json({ error: "Fiche introuvable." }, { status: 404, headers: CORS });
	}

	// Trace réversible : une transcription automatique reste une proposition.
	await recordRevision({
		table: "db_databooks",
		id: String(id),
		action: "update",
		before: avant as unknown as Record<string, unknown>,
		after: apres as unknown as Record<string, unknown>,
		actor: { id: "api-transcription", name: "Transcription (API)" },
	});

	const transcrites = apres.pages.filter((p) => (p.text ?? "").length > 0).length;
	return NextResponse.json(
		{
			id,
			mode,
			deposees: textes.size,
			ignorees,
			// En `merge`, un numéro absent de la fiche est signalé plutôt qu'inventé :
			// c'est le symptôme d'un décalage entre le lot exporté et la base.
			pagesInconnues: inconnues,
			pagesTotal: apres.pages.length,
			pagesTranscrites: transcrites,
		},
		{ headers: CORS }
	);
}
