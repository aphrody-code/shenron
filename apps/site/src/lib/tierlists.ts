import "server-only";
import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tierlists, type TierlistItem, type TierlistTier } from "@/db/schema";
import { botCharacters } from "@/db/bot-schema";

export type { TierlistItem, TierlistTier };

/**
 * Tierlists communautaires : un membre connecté range des « cartes » (images
 * fournies par le wiki) dans des tiers S/A/B/C/D, puis publie sa tierlist sur le
 * site (style forum). Le pool d'images vient d'un template (personnages, etc.) ;
 * la tierlist sauvegardée est un snapshot autonome (items figés en jsonb).
 */

export interface TierlistTemplate {
	key: string;
	title: string;
	description: string;
	/** Source du pool d'images. Pour l'instant : personnages du wiki. */
	source: "characters";
	/** Filtre optionnel sur la race (ex: Saiyans). */
	race?: RegExp;
	/** Nombre max d'items dans le pool (les plus canoniques d'abord). */
	limit?: number;
}

export const TIERLIST_TEMPLATES: TierlistTemplate[] = [
	{
		key: "personnages",
		title: "Personnages Dragon Ball",
		description: "Classe les héros, dieux et vilains de toute la saga.",
		source: "characters",
		limit: 60,
	},
	{
		key: "saiyans",
		title: "Les Saiyans",
		description: "Range les guerriers de la race la plus fière de l'univers.",
		source: "characters",
		race: /saiyan|saïen|saiyen|saïan/i,
		limit: 40,
	},
	{
		key: "personnages-all",
		title: "Tout l'univers (avancé)",
		description: "Le pool complet des personnages avec illustration. Pour les puristes.",
		source: "characters",
		limit: 150,
	},
];

/** Tiers par défaut d'une nouvelle tierlist (vides). */
export const DEFAULT_TIERS: Array<{ label: string; color: string }> = [
	{ label: "S", color: "#ff5252" },
	{ label: "A", color: "#ff9800" },
	{ label: "B", color: "#ffd54f" },
	{ label: "C", color: "#66bb6a" },
	{ label: "D", color: "#42a5f5" },
];

export function getTierlistTemplate(key: string): TierlistTemplate | undefined {
	return TIERLIST_TEMPLATES.find((t) => t.key === key);
}

export function emptyTiers(): TierlistTier[] {
	return DEFAULT_TIERS.map((t, i) => ({
		id: `tier-${i}`,
		label: t.label,
		color: t.color,
		items: [],
	}));
}

/** Charge le pool d'images d'un template depuis le wiki (Neon `bot.*`). */
export async function getTierlistPool(templateKey: string): Promise<TierlistItem[]> {
	const tpl = getTierlistTemplate(templateKey);
	if (!tpl || tpl.source !== "characters") return [];
	try {
		const rows = await db
			.select({
				id: botCharacters.id,
				name: botCharacters.name,
				image: botCharacters.image,
				race: botCharacters.race,
			})
			.from(botCharacters)
			.orderBy(botCharacters.id);
		return rows
			.filter((c) => !!c.image)
			.filter((c) => (tpl.race ? !!c.race && tpl.race.test(c.race) : true))
			.slice(0, tpl.limit ?? 80)
			.map((c) => ({ id: `char:${c.id}`, label: c.name, image: c.image }));
	} catch (e) {
		console.error("getTierlistPool failed:", e);
		return [];
	}
}

function slugify(s: string): string {
	return s
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 48);
}

export interface CreateTierlistInput {
	title: string;
	description?: string | null;
	templateKey?: string | null;
	tiers: TierlistTier[];
	authorId: string;
}

export async function createTierlist(input: CreateTierlistInput): Promise<{ slug: string }> {
	const base = slugify(input.title) || "tierlist";
	const slug = `${base}-${createId().slice(0, 6)}`;
	await db.insert(tierlists).values({
		slug,
		title: input.title.slice(0, 120),
		description: input.description?.slice(0, 500) ?? null,
		templateKey: input.templateKey ?? null,
		tiers: input.tiers,
		authorId: input.authorId,
		published: true,
	});
	return { slug };
}

export type TierlistWithAuthor = Awaited<ReturnType<typeof listTierlists>>[number];

export async function listTierlists(limit = 60) {
	return db.query.tierlists.findMany({
		where: eq(tierlists.published, true),
		orderBy: desc(tierlists.createdAt),
		with: { author: true },
		limit,
	});
}

export async function getTierlistBySlug(slug: string) {
	return db.query.tierlists.findFirst({
		where: and(eq(tierlists.slug, slug), eq(tierlists.published, true)),
		with: { author: true },
	});
}

export async function listTierlistsByAuthor(authorId: string, limit = 30) {
	return db.query.tierlists.findMany({
		where: eq(tierlists.authorId, authorId),
		orderBy: desc(tierlists.createdAt),
		with: { author: true },
		limit,
	});
}
