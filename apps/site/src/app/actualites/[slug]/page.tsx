import { db } from "@/lib/db";
import { posts as postsTable } from "@/db/schema";
import { and, desc, eq, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Metadata } from "next";
import type { Article, BreadcrumbList, WithContext } from "schema-dts";

import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/config";
import { headingsFromHtml, publicPostFilter } from "@/lib/posts";
import { CommentGate } from "./CommentGate";
import { ReadingProgress } from "./ReadingProgress";

export const revalidate = 300;

/**
 * OBLIGATOIRE pour le cache : sous Next 16, une route à segment dynamique sans
 * `generateStaticParams` est rendue dynamiquement (`no-store`) malgré
 * `revalidate` — cf. le piège documenté dans CLAUDE.md.
 */
export async function generateStaticParams() {
	const rows = await db
		.select({ slug: postsTable.slug })
		.from(postsTable)
		.where(publicPostFilter());
	return rows.map((r) => ({ slug: r.slug }));
}

/** Charge un article visible publiquement (brouillons et programmés exclus). */
async function getPost(slug: string) {
	return db.query.posts.findFirst({
		where: and(eq(postsTable.slug, slug), publicPostFilter()),
		with: {
			author: true,
			comments: { with: { author: true }, orderBy: (c, { asc }) => asc(c.createdAt) },
		},
	});
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPost(slug);
	if (!post) return { title: "Article introuvable" };

	const absolute = (u: string | null) =>
		u ? (u.startsWith("http") ? u : new URL(u, SITE_URL).toString()) : undefined;
	const social = absolute(post.ogImage ?? post.cover);
	const description = post.seoDescription ?? post.excerpt;

	return {
		title: post.seoTitle ?? post.title,
		description,
		// Une canonique externe n'est posée que si l'article est republié depuis
		// ailleurs ; sinon la page est sa propre référence.
		alternates: { canonical: post.canonicalUrl ?? `/actualites/${post.slug}` },
		robots: post.noindex ? { index: false, follow: true } : undefined,
		authors: post.author?.username ? [{ name: post.author.username }] : undefined,
		openGraph: {
			type: "article",
			title: post.seoTitle ?? post.title,
			description,
			url: `/actualites/${post.slug}`,
			publishedTime: post.publishedAt?.toISOString(),
			modifiedTime: post.updatedAt.toISOString(),
			authors: post.author?.username ? [post.author.username] : undefined,
			tags: post.tags ?? undefined,
			images: social ? [{ url: social, alt: post.coverAlt ?? post.title }] : undefined,
		},
		twitter: {
			card: social ? "summary_large_image" : "summary",
			title: post.seoTitle ?? post.title,
			description,
			images: social ? [social] : undefined,
		},
	};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = await getPost(slug);
	if (!post) notFound();

	const headings = post.contentHtml ? headingsFromHtml(post.contentHtml) : [];
	const url = `${SITE_URL}/actualites/${post.slug}`;

	const related = await db.query.posts.findMany({
		where: and(publicPostFilter(), ne(postsTable.id, post.id)),
		orderBy: [desc(postsTable.publishedAt)],
		limit: 3,
	});

	const articleSchema: WithContext<Article> = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: post.title,
		description: post.seoDescription ?? post.excerpt,
		image: post.cover ? [post.cover.startsWith("http") ? post.cover : `${SITE_URL}${post.cover}`] : undefined,
		datePublished: post.publishedAt?.toISOString(),
		dateModified: post.updatedAt.toISOString(),
		wordCount: post.wordCount || undefined,
		keywords: post.tags?.length ? post.tags.join(", ") : undefined,
		inLanguage: "fr-FR",
		author: post.author?.username
			? { "@type": "Person", name: post.author.username }
			: { "@type": "Organization", name: "Dragon Ball France" },
		publisher: {
			"@type": "Organization",
			name: "Dragon Ball France",
			logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon-96.png` },
		},
		mainEntityOfPage: { "@type": "WebPage", "@id": url },
	};

	const breadcrumbSchema: WithContext<BreadcrumbList> = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
			{ "@type": "ListItem", position: 2, name: "Le Journal", item: `${SITE_URL}/actualites` },
			{ "@type": "ListItem", position: 3, name: post.title, item: url },
		],
	};

	return (
		<>
			<JsonLd data={articleSchema} />
			<JsonLd data={breadcrumbSchema} />
			<ReadingProgress />

			<div className="mx-auto max-w-[1180px] px-6 py-12 lg:px-10 lg:py-16">
				<nav className="ed-meta ed-no-print mb-10">
					<Link href="/actualites" className="hover:text-[color:var(--ed-accent)]">
						← Le Journal
					</Link>
				</nav>

				{/* ---- Titraille ------------------------------------------------- */}
				<header className="mx-auto max-w-[46rem]">
					{post.tags?.length > 0 && (
						<p className="ed-kicker">
							<Link
								href={`/actualites/theme/${encodeURIComponent(post.tags[0].toLowerCase())}`}
								className="hover:underline"
							>
								{post.tags[0]}
							</Link>
						</p>
					)}
					<h1 className="ed-title mt-3">{post.title}</h1>
					{post.excerpt && <p className="ed-standfirst mt-5">{post.excerpt}</p>}

					<div className="ed-meta mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[color:var(--ed-rule)] py-4">
						{post.author?.username && <span>Par {post.author.username}</span>}
						{post.publishedAt && (
							<time dateTime={post.publishedAt.toISOString()}>
								{format(post.publishedAt, "d MMMM yyyy", { locale: fr })}
							</time>
						)}
						<span aria-hidden>·</span>
						<span>{post.readingMinutes} min de lecture</span>
					</div>
				</header>

				{/* ---- Couverture -------------------------------------------------- */}
				{post.cover && (
					<figure className="mx-auto mt-10 max-w-[62rem]">
						<div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-[color:var(--ed-paper-sunken)]">
							<Image
								src={post.cover}
								alt={post.coverAlt ?? ""}
								fill
								sizes="(max-width: 1024px) 100vw, 992px"
								className="object-cover"
								priority
							/>
						</div>
						{post.coverCaption && (
							<figcaption className="ed-meta mt-3 normal-case tracking-normal">
								{post.coverCaption}
							</figcaption>
						)}
					</figure>
				)}

				{/* ---- Corps + sommaire -------------------------------------------- */}
				<div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,46rem)_1fr] lg:justify-center">
					<article className="min-w-0">
						{post.contentHtml ? (
							// HTML régénéré côté serveur depuis le document Tiptap
							// (`lib/posts.ts`) — jamais du balisage venu du navigateur.
							<div
								className="ed-prose"
								dangerouslySetInnerHTML={{ __html: post.contentHtml }}
							/>
						) : (
							// Repli : articles antérieurs à l'éditeur riche, encore en Markdown.
							<div className="ed-prose">
								<ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
							</div>
						)}

						{post.tags?.length > 0 && (
							<div className="ed-no-print mt-14 flex flex-wrap items-center gap-2 border-t border-[color:var(--ed-rule)] pt-6">
								<span className="ed-meta">Thèmes</span>
								{post.tags.map((tag) => (
									<Link
										key={tag}
										href={`/actualites/theme/${encodeURIComponent(tag.toLowerCase())}`}
										className="rounded-full border border-[color:var(--ed-rule-strong)] px-3 py-1 text-[0.8125rem] transition-colors hover:border-[color:var(--ed-accent)] hover:text-[color:var(--ed-accent)]"
									>
										{tag}
									</Link>
								))}
							</div>
						)}

						{/* ---- Commentaires ------------------------------------------ */}
						<section className="ed-no-print mt-16 border-t border-[color:var(--ed-rule)] pt-10">
							<h2 className="text-[1.5rem] font-semibold tracking-[-0.015em]">
								Commentaires{" "}
								<span className="text-[color:var(--ed-ink-muted)]">
									· {post.comments.length}
								</span>
							</h2>

							{post.comments.length > 0 && (
								<div className="mt-8 space-y-6">
									{post.comments.map((comment) => (
										<div
											key={comment.id}
											className="border-b border-[color:var(--ed-rule)] pb-6 last:border-0"
										>
											<div className="ed-meta flex items-center gap-2.5">
												{comment.author.avatar && (
													/* eslint-disable-next-line @next/next/no-img-element */
													<img
														src={comment.author.avatar}
														alt=""
														width={24}
														height={24}
														className="size-6 rounded-full"
													/>
												)}
												<span>{comment.author.username}</span>
												<time dateTime={comment.createdAt.toISOString()}>
													{format(comment.createdAt, "d MMM yyyy", { locale: fr })}
												</time>
											</div>
											<p className="mt-2.5 whitespace-pre-wrap text-[1rem] leading-relaxed text-[color:var(--ed-ink-soft)]">
												{comment.body}
											</p>
										</div>
									))}
								</div>
							)}

							<div className="mt-8">
								<CommentGate slug={post.slug} />
							</div>
						</section>
					</article>

					{/* ---- Sommaire collant -------------------------------------------- */}
					{headings.length > 1 && (
						<aside className="ed-no-print hidden lg:block">
							<div className="sticky top-24">
								<p className="ed-meta border-b border-[color:var(--ed-rule)] pb-2">
									Sommaire
								</p>
								<nav className="mt-3">
									<ol className="space-y-2">
										{headings.map((h) => (
											<li
												key={h.id}
												style={{ paddingInlineStart: `${(h.level - 2) * 0.85}rem` }}
											>
												<a
													href={`#${h.id}`}
													className="block text-[0.875rem] leading-snug text-[color:var(--ed-ink-muted)] transition-colors hover:text-[color:var(--ed-accent)]"
												>
													{h.text}
												</a>
											</li>
										))}
									</ol>
								</nav>
							</div>
						</aside>
					)}
				</div>

				{/* ---- À lire ensuite ---------------------------------------------- */}
				{related.length > 0 && (
					<section className="ed-no-print mt-24 border-t-2 border-[color:var(--ed-ink)] pt-8">
						<h2 className="ed-kicker">À lire ensuite</h2>
						<div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
							{related.map((p) => (
								<article key={p.id}>
									{p.cover && (
										<Link
											href={`/actualites/${p.slug}`}
											className="group relative mb-3 block aspect-[16/10] overflow-hidden rounded-sm bg-[color:var(--ed-paper-sunken)]"
										>
											<Image
												src={p.cover}
												alt={p.coverAlt ?? ""}
												fill
												sizes="(max-width: 640px) 100vw, 340px"
												className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
											/>
										</Link>
									)}
									<h3 className="text-[1.125rem] font-semibold leading-snug tracking-[-0.01em]">
										<Link
											href={`/actualites/${p.slug}`}
											className="transition-colors hover:text-[color:var(--ed-accent)]"
										>
											{p.title}
										</Link>
									</h3>
									<p className="ed-meta mt-2">
										{p.publishedAt && format(p.publishedAt, "d MMM yyyy", { locale: fr })} ·{" "}
										{p.readingMinutes} min
									</p>
								</article>
							))}
						</div>
					</section>
				)}
			</div>
		</>
	);
}
