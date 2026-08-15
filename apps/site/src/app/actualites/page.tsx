import { db } from "@/lib/db";
import { posts as postsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { publicPostFilter } from "@/lib/posts";
import { DISCORD_INVITE } from "@/lib/config";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Metadata } from "next";

export const revalidate = 60;

const POSTS_PER_PAGE = 12;

export const metadata: Metadata = {
	title: "Le Journal — actualités Dragon Ball",
	description:
		"Sorties anime, chapitres du manga, films, événements et analyses. Le journal Dragon Ball de la communauté francophone.",
	alternates: {
		canonical: "/actualites",
		types: { "application/rss+xml": [{ url: "/actualites/rss.xml", title: "Le Journal — DBFR" }] },
	},
};

export default async function ActualitesPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const sp = await searchParams;
	const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
	const offset = (page - 1) * POSTS_PER_PAGE;

	const visible = publicPostFilter();

	const [rows, totalCount] = await Promise.all([
		db.query.posts.findMany({
			where: visible,
			orderBy: [desc(postsTable.publishedAt)],
			limit: POSTS_PER_PAGE,
			offset,
			with: { author: true },
		}),
		db.$count(postsTable, visible),
	]);

	const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE));

	// La une n'apparaît que sur la première page : en page 2, elle serait un
	// doublon décoratif d'un article déjà vu.
	const [lead, ...rest] =
		page === 1 ? pickLead(rows) : [null as (typeof rows)[number] | null, ...rows];

	// Thèmes réellement utilisés par les articles en ligne (pas de liste figée qui
	// pointerait vers des pages vides).
	const allTags = await db
		.select({ tags: postsTable.tags })
		.from(postsTable)
		.where(visible)
		.limit(300);
	const tagCounts = new Map<string, number>();
	for (const r of allTags) {
		for (const t of r.tags ?? []) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
	}
	const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

	return (
		<div className="mx-auto max-w-[1180px] px-6 py-14 lg:px-10 lg:py-20">
			{/* ---- Bandeau-titre ------------------------------------------------- */}
			<header className="border-b-2 border-[color:var(--ed-ink)] pb-6">
				<p className="ed-kicker">Dragon Ball France</p>
				<h1 className="ed-title mt-2">Le Journal</h1>
				<p className="ed-standfirst mt-4 max-w-[46rem]">
					Sorties anime, chapitres du manga, films, événements et analyses — suivis et racontés
					par la communauté francophone.
				</p>
				<div className="ed-meta mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
					<span>
						{totalCount} article{totalCount > 1 ? "s" : ""}
					</span>
					<a href="/actualites/rss.xml" className="underline-offset-4 hover:underline">
						Flux RSS
					</a>
				</div>
			</header>

			{topTags.length > 0 && (
				<nav
					aria-label="Thèmes"
					className="ed-meta flex flex-wrap gap-x-4 gap-y-2 border-b border-[color:var(--ed-rule)] py-4"
				>
					{topTags.map(([tag, count]) => (
						<Link
							key={tag}
							href={`/actualites/theme/${encodeURIComponent(tag.toLowerCase())}`}
							className="transition-colors hover:text-[color:var(--ed-accent)]"
						>
							{tag} <span className="opacity-50">{count}</span>
						</Link>
					))}
				</nav>
			)}

			{rows.length === 0 ? (
				<EmptyState />
			) : (
				<>
					{lead && <LeadArticle post={lead} />}

					{rest.length > 0 && (
						<div className="grid gap-x-10 gap-y-12 border-t border-[color:var(--ed-rule)] pt-12 sm:grid-cols-2 lg:grid-cols-3">
							{rest.map((post) => (
								<ArticleCard key={post.id} post={post} />
							))}
						</div>
					)}

					{totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
				</>
			)}
		</div>
	);
}

/** Remonte l'article « à la une » en tête, à défaut le plus récent. */
function pickLead<T extends { featured: boolean }>(rows: T[]): [T | null, ...T[]] {
	if (rows.length === 0) return [null];
	const idx = rows.findIndex((r) => r.featured);
	const i = idx === -1 ? 0 : idx;
	return [rows[i], ...rows.slice(0, i), ...rows.slice(i + 1)];
}

type PostRow = {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	cover: string | null;
	coverAlt: string | null;
	publishedAt: Date | null;
	readingMinutes: number;
	tags: string[];
	author: { username: string; avatar: string | null } | null;
};

function LeadArticle({ post }: { post: PostRow }) {
	return (
		<article className="grid gap-8 py-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
			{post.cover && (
				<Link
					href={`/actualites/${post.slug}`}
					className="group relative block aspect-[16/10] overflow-hidden rounded-sm bg-[color:var(--ed-paper-sunken)]"
				>
					<Image
						src={post.cover}
						alt={post.coverAlt ?? ""}
						fill
						sizes="(max-width: 1024px) 100vw, 600px"
						className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
						priority
					/>
				</Link>
			)}
			<div>
				<p className="ed-kicker">À la une</p>
				<h2 className="mt-3 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
					<Link
						href={`/actualites/${post.slug}`}
						className="transition-colors hover:text-[color:var(--ed-accent)]"
					>
						{post.title}
					</Link>
				</h2>
				<p className="mt-4 text-[1.0625rem] leading-relaxed text-[color:var(--ed-ink-soft)]">
					{post.excerpt}
				</p>
				<Byline post={post} className="mt-6" />
			</div>
		</article>
	);
}

function ArticleCard({ post }: { post: PostRow }) {
	return (
		<article className="flex flex-col">
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
			<h3 className="text-[1.3125rem] font-semibold leading-[1.2] tracking-[-0.012em]">
				<Link
					href={`/actualites/${post.slug}`}
					className="transition-colors hover:text-[color:var(--ed-accent)]"
				>
					{post.title}
				</Link>
			</h3>
			<p className="mt-2.5 line-clamp-3 flex-1 text-[0.9375rem] leading-relaxed text-[color:var(--ed-ink-soft)]">
				{post.excerpt}
			</p>
			<Byline post={post} className="mt-4" compact />
		</article>
	);
}

function Byline({
	post,
	className,
	compact,
}: {
	post: PostRow;
	className?: string;
	compact?: boolean;
}) {
	return (
		<div className={`ed-meta flex flex-wrap items-center gap-x-3 gap-y-1 ${className ?? ""}`}>
			{!compact && post.author?.username && <span>{post.author.username}</span>}
			{post.publishedAt && (
				<time dateTime={post.publishedAt.toISOString()}>
					{format(post.publishedAt, "d MMMM yyyy", { locale: fr })}
				</time>
			)}
			<span aria-hidden>·</span>
			<span>{post.readingMinutes} min</span>
		</div>
	);
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
	const href = (p: number) => (p === 1 ? "/actualites" : `/actualites?page=${p}`);
	return (
		<nav
			aria-label="Pagination"
			className="ed-meta mt-16 flex items-center justify-between border-t border-[color:var(--ed-rule)] pt-6"
		>
			{page > 1 ? (
				<Link href={href(page - 1)} className="hover:text-[color:var(--ed-accent)]">
					← Précédent
				</Link>
			) : (
				<span className="opacity-30">← Précédent</span>
			)}
			<span>
				Page {page} sur {totalPages}
			</span>
			{page < totalPages ? (
				<Link href={href(page + 1)} className="hover:text-[color:var(--ed-accent)]">
					Suivant →
				</Link>
			) : (
				<span className="opacity-30">Suivant →</span>
			)}
		</nav>
	);
}

function EmptyState() {
	return (
		<div className="max-w-[38rem] border-b border-[color:var(--ed-rule)] py-20">
			<h2 className="text-[1.75rem] font-semibold tracking-[-0.015em]">
				Le journal ouvre bientôt
			</h2>
			<p className="mt-4 text-[1.0625rem] leading-relaxed text-[color:var(--ed-ink-soft)]">
				Les premiers articles sont en préparation. En attendant, l&apos;univers est déjà là :
				le manga, les épisodes et les films se parcourent dès maintenant.
			</p>
			<div className="ed-meta mt-8 flex flex-wrap gap-x-6 gap-y-3">
				<Link href="/wiki/manga" className="hover:text-[color:var(--ed-accent)]">
					Lire le manga →
				</Link>
				<a
					href={DISCORD_INVITE}
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-[color:var(--ed-accent)]"
				>
					Rejoindre le Discord →
				</a>
			</div>
		</div>
	);
}
