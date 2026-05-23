import { WikiManager } from "./WikiManager";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminWikiPage() {
	const categories = await db.query.wikiCategories.findMany({
		where: (c, { isNull }) => isNull(c.parentId),
		with: {
			children: { with: { pages: true } },
			pages: true,
		},
		orderBy: (c, { asc }) => asc(c.order),
	});

	// Sérialise l'arbre pour le Client Component (recherche live).
	const tree = categories.map((cat) => ({
		id: cat.id,
		name: cat.name,
		slug: cat.slug,
		order: cat.order,
		pages: cat.pages.map((p) => ({ id: p.id, title: p.title, slug: p.slug })),
		children: cat.children.map((sub) => ({
			id: sub.id,
			name: sub.name,
			slug: sub.slug,
			pages: sub.pages.map((p) => ({ id: p.id, title: p.title, slug: p.slug })),
		})),
	}));

	return <WikiManager categories={tree} />;
}
