import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { db } from "@/lib/db";
import { isCurrentUserAdmin } from "@/lib/session";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

/** Extrait lisible du corps markdown, pour la balise description. */
function extrait(body: string, max = 160): string {
	const nu = body
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/[#>*_`|-]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	return nu.length > max ? `${nu.slice(0, max - 1).trimEnd()}…` : nu;
}

// Chaque page wiki éditoriale portait le titre générique du site : ni résultat
// de recherche exploitable, ni aperçu de partage distinct sur Discord.
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const page = await db.query.wikiPages.findFirst({
		where: (p, { eq }) => eq(p.slug, slug[slug.length - 1]!),
		columns: { title: true, body: true },
	});
	if (!page) return { title: "Page introuvable", robots: { index: false, follow: true } };
	return {
		title: page.title,
		// Pas de champ résumé sur `WikiPage` : on dérive un extrait du corps
		// (markdown débarrassé de sa syntaxe la plus bruyante).
		description: extrait(page.body) || `${page.title} — article du wiki Dragon Ball France.`,
		alternates: { canonical: `/wiki/${slug.join("/")}` },
	};
}

export default async function WikiPage({ params }: { params: Promise<{ slug: string[] }> }) {
	const { slug } = await params;
	const pageSlug = slug[slug.length - 1];

	const page = await db.query.wikiPages.findFirst({
		where: (p, { eq }) => eq(p.slug, pageSlug),
		with: { category: { with: { parent: true } } },
	});

	if (!page) notFound();

	const isAdmin = await isCurrentUserAdmin();

	return (
		<div className="w-full mx-auto max-w-[900px] px-6 lg:px-10 py-16 lg:py-24">
			<nav className="flex gap-2 text-xs text-gray-500 mb-8 uppercase tracking-widest">
				<Link href="/wiki">WIKI</Link>
				<span>/</span>
				{page.category.parent && (
					<>
						<span>{page.category.parent.name}</span>
						<span>/</span>
					</>
				)}
				<span>{page.category.name}</span>
			</nav>
			<div className="flex items-start justify-between gap-4 mb-8">
				<h1 className="text-4xl font-black">{page.title}</h1>
				{isAdmin && (
					<Link
						href={`/admin/wiki/page/${page.id}`}
						className="shrink-0 mt-1 inline-flex items-center gap-2 rounded border border-dbz-orange/60 bg-dbz-orange/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-dbz-orange hover:bg-dbz-orange/20 transition-colors"
					>
						Éditer cette page
					</Link>
				)}
			</div>
			<div className="prose prose-invert max-w-none wiki-content">
				<WikiMarkdown body={page.body} />
			</div>
			<div className="mt-16 pt-8 border-t border-dbz-border text-xs text-gray-500">
				Dernière mise à jour le {new Date(page.updatedAt).toLocaleDateString("fr-FR")}
			</div>
		</div>
	);
}

export const dynamic = "force-dynamic";
