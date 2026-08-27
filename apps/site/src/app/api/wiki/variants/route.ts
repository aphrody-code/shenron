/**
 * GET /api/wiki/variants — les versions par saga, servies à la demande.
 *
 * Elles ne sont utiles qu'à qui bascule la grille en mode « Versions ». Les
 * embarquer dans la charge de `/wiki/personnages` coûtait **110 Ko à tout le
 * monde** (508 → 618 Ko mesurés en production) pour une vue que la plupart des
 * visiteurs n'ouvriront jamais.
 *
 * Aucune session, aucun cookie : la réponse est identique pour tous et se cache
 * au CDN comme le reste du wiki.
 */
import { NextResponse } from "next/server";
import { getShenronVariantCards } from "@/lib/shenron";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(): Promise<NextResponse> {
	const variants = await getShenronVariantCards().catch(() => []);
	return NextResponse.json(
		{ ok: true, variants },
		{
			headers: {
				"cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
			},
		}
	);
}
