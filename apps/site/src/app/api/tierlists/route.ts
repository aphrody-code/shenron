import { getCurrentUser } from "@/lib/session";
import { createTierlist, getTierlistTemplate } from "@/lib/tierlists";
import { MAX_ITEMS, MAX_TIERS, asTier } from "@/lib/tierlist-input";
import type { TierlistTier } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
	const me = await getCurrentUser();
	if (!me?.user) {
		return Response.json({ error: "Connexion requise." }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return Response.json({ error: "Corps JSON invalide." }, { status: 400 });
	}
	const b = (body ?? {}) as Record<string, unknown>;

	const title = typeof b.title === "string" ? b.title.trim() : "";
	if (title.length < 2) {
		return Response.json({ error: "Donne un titre à ta tierlist." }, { status: 400 });
	}

	const templateKey = typeof b.templateKey === "string" ? b.templateKey : null;
	if (templateKey && !getTierlistTemplate(templateKey)) {
		return Response.json({ error: "Template inconnu." }, { status: 400 });
	}

	const tiers = Array.isArray(b.tiers)
		? b.tiers.map(asTier).filter((x): x is TierlistTier => x !== null).slice(0, MAX_TIERS)
		: [];
	if (tiers.length === 0) {
		return Response.json({ error: "Tierlist vide." }, { status: 400 });
	}

	const totalItems = tiers.reduce((n, t) => n + t.items.length, 0);
	if (totalItems === 0) {
		return Response.json(
			{ error: "Place au moins une carte dans un tier avant de publier." },
			{ status: 400 }
		);
	}
	if (totalItems > MAX_ITEMS) {
		return Response.json({ error: "Trop de cartes." }, { status: 400 });
	}

	const description = typeof b.description === "string" ? b.description.trim() : null;

	try {
		const { slug } = await createTierlist({
			title,
			description,
			templateKey,
			tiers,
			authorId: me.user.id,
		});
		return Response.json({ slug }, { status: 201 });
	} catch (e) {
		console.error("createTierlist failed:", e);
		return Response.json({ error: "Échec de l'enregistrement." }, { status: 500 });
	}
}
