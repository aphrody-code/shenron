import { db } from "@/lib/db";
import { posts as postsTable } from "@/db/schema";
import { and, desc, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Metadata } from "next";

import { publicPostFilter } from "@/lib/posts";

export const revalidate = 300;

/**
 * Les thèmes sont stockés en `jsonb` (tableau de chaînes) sur l'article, avec la
 * casse choisie par la rédaction. L'URL, elle, est toujours en minuscules —
 * d'où la comparaison insensible à la casse, faite en SQL plutôt qu'en mémoire
 * pour ne pas rapatrier tout le journal à chaque page de thème.
 */
function hasTag(tag: string) {
	return sql`EXISTS (
		SELECT 1 FROM jsonb_array_elements_text(${postsTable.tags}) AS t(value)
		WHERE lower(t.value) = ${tag}
	)`;
}

/** Retrouve la casse d'origine du thème pour l'afficher tel que rédigé. */
async function resolveTagLabel(tag: string): Promise<string | null> {
	const rows = await db
		.select({ tags: postsTable.tags })
		.from(postsTable)
		.where(and(publicPostFilter(), hasTag(tag)))
		.limit(1);
	return rows[0]?.tags?.find((t) => t.toLowerCase() === tag) ?? null;
}

export async function generateStaticParams() {
	const rows = await db
		.select({ tags: postsTable.tags })
		.from(postsTable)
		.where(publicPostFilter());
	const seen = new Set<string>();
	for (const r of rows) for (const t of r.tags ?? []) seen.add(t.toLowerCase());
	// Valeur BRUTE, non encodée : Next encode lui-même le segment au pré-rendu.
	// Encoder ici produirait un double encodage (« super-saiyan%2Fbleu »).
	return [...seen].map((tag) => ({ tag }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ tag: string }>;
}): Promise<Metadata> {
	const { tag } = await params;
	const decoded = decodeURIComponent(tag).toLowerCase();
	const label = await resolveTagLabel(decoded);
	if (!label) return { title: "Thème introuvable" };

	return {
		title: `${label} — Le Journal`,
		description: `Tous les articles Dragon Ball classés sous « ${label} » : actualités, analyses et dossiers.`,
		alternates: { canonical: `/actualites/theme/${encodeURIComponent(decoded)}` },
	};
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
	const { tag } = await params;
	const decoded = decodeURIComponent(tag).toLowerCase();

	const label = await resolveTagLabel(decoded);
	// Un thème sans aucun article en ligne n'est pas une page vide : c'est une 404
	// (sinon on ouvre une infinité d'URL indexables et creuses).
	if (!label) notFound();

	const rows = await db.query.posts.findMany({
		where: and(publicPostFilter(), hasTag(decoded)),
		orderBy: [desc(postsTable.publishedAt)],
		limit: 60,
	});

	return (
		<div className="w-full mx-auto max-w-[1180px] px-6 py-14 lg:px-10 lg:py-20">
			<Breadcrumbs
				className="mb-8"
				items={[{ label: "Le Journal", href: "/actualites" }, { label }]}
			/>
			<header className="border-b-2 border-[color:var(--ed-ink)] pb-6">
				<h1 className="ed-title mt-2">{label}</h1>
				<p className="ed-meta mt-5">
					{rows.length} article{rows.length > 1 ? "s" : ""}
				</p>
			</header>

			<div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
				{rows.map((post) => (
					<article key={post.id} className="flex flex-col">
						{post.cover && (
							<Link
								href={`/actualites/${post.slug}`}
								className="group relative mb-4 block aspect-[16/10] overflow-hidden rounded-sm bg-[color:var(--ed-paper-sunken)]"
							>
								<Image
									src={post.cover}
									alt={post.coverAlt ?? ""}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
									className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
								/>
							</Link>
						)}
						<h2 className="text-[1.3125rem] font-semibold leading-[1.2] tracking-[-0.012em]">
							<Link
								href={`/actualites/${post.slug}`}
								className="transition-colors hover:text-[color:var(--ed-accent)]"
							>
								{post.title}
							</Link>
						</h2>
						<p className="mt-2.5 line-clamp-3 flex-1 text-[0.9375rem] leading-relaxed text-[color:var(--ed-ink-soft)]">
							{post.excerpt}
						</p>
						<p className="ed-meta mt-4">
							{post.publishedAt && format(post.publishedAt, "d MMMM yyyy", { locale: fr })} ·{" "}
							{post.readingMinutes} min
						</p>
					</article>
				))}
			</div>
		</div>
	);
}
