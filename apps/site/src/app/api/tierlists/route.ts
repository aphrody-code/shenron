import { getCurrentUser } from "@/lib/session";
import { createTierlist, getTierlistTemplate } from "@/lib/tierlists";
import type { TierlistItem, TierlistTier } from "@/db/schema";

export const dynamic = "force-dynamic";

const MAX_ITEMS = 400;
const MAX_TIERS = 12;

/**
 * Valide l'image d'une carte : URL http(s) OU chemin d'asset self-hosté
 * relatif (`./assets/dbz/…` du pool wiki, `assets/wiki/…` des uploads, `db/…`).
 * Rejette les `data:`/`javascript:`/`blob:` (sinon on stockerait des Mo de
 * base64 en jsonb, ou un vecteur XSS) et la traversée de chemin ; cappe la
 * longueur. NB : les images du pool wiki sont `./assets/dbz/…` → doivent passer.
 */
function asImage(v: unknown): string | null {
	if (typeof v !== "string") return null;
	const s = v.trim();
	if (!s || s.length > 512 || s.includes("..")) return null;
	// URL externe : `https` uniquement (pas de `http` → évite le mixed-content
	// bloqué par le navigateur). NB : une URL externe reste fournie par l'auteur
	// et est rendue en <img src> ; l'upload (rehébergé localement) est la voie
	// recommandée pour une image perso.
	if (/^https:\/\//i.test(s)) return s;
	if (/^\.?\/?(assets\/|wiki\/|db\/)/i.test(s)) return s;
	return null;
}

function asItem(v: unknown): TierlistItem | null {
	if (!v || typeof v !== "object") return null;
	const o = v as Record<string, unknown>;
	if (typeof o.id !== "string" || typeof o.label !== "string") return null;
	return { id: o.id.slice(0, 80), label: o.label.slice(0, 80), image: asImage(o.image) };
}

function asTier(v: unknown): TierlistTier | null {
	if (!v || typeof v !== "object") return null;
	const o = v as Record<string, unknown>;
	if (typeof o.id !== "string" || typeof o.label !== "string") return null;
	const color = typeof o.color === "string" && /^#[0-9a-fA-F]{3,8}$/.test(o.color) ? o.color : "#888";
	const items = Array.isArray(o.items)
		? o.items.map(asItem).filter((x): x is TierlistItem => x !== null)
		: [];
	return { id: o.id.slice(0, 40), label: o.label.slice(0, 24), color, items };
}

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
