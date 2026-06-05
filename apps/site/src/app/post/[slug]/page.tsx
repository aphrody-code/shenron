import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { CommentForm } from "./CommentForm";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import type { BlogPosting, BreadcrumbList, WithContext } from "schema-dts";
import { SITE_URL as SITE } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = await db.query.posts.findFirst({
		where: (p, { eq }) => eq(p.slug, slug),
	});
	if (!post) return { title: "Article — DBFR" };
	return {
		title: `${post.title} — DBFR`,
		description:
			post.excerpt ??
			`Article publié sur DBFR le ${format(post.createdAt, "d MMMM yyyy", { locale: fr })}.`,
		openGraph: {
			title: post.title,
			description: post.excerpt ?? undefined,
			images: post.cover ? [{ url: post.cover }] : undefined,
			type: "article",
			publishedTime: post.createdAt.toISOString(),
		},
		twitter: {
			card: post.cover ? "summary_large_image" : "summary",
			title: post.title,
			description: post.excerpt ?? undefined,
			images: post.cover ? [post.cover] : undefined,
		},
	};
}

function readingTime(body: string): number {
	const words = body.trim().split(/\s+/).length;
	return Math.max(1, Math.round(words / 220)); // ~220 wpm FR
}

export default async function PostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = await db.query.posts.findFirst({
		where: (p, { eq }) => eq(p.slug, slug),
		with: {
			author: true,
			comments: {
				with: { author: true },
				orderBy: (c, { asc }) => asc(c.createdAt),
			},
		},
	});

	if (!post) notFound();

	const me = await getCurrentUser();
	const minutes = readingTime(post.body);

	const relatedPosts = await db.query.posts.findMany({
		where: (p, { eq, and, ne }) =>
			and(eq(p.published, true), ne(p.id, post.id)),
		orderBy: (p, { desc }) => desc(p.createdAt),
		limit: 3,
	});

	const blogPostingSchema: WithContext<BlogPosting> = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.excerpt ?? undefined,
		image: post.cover ? [post.cover] : undefined,
		datePublished: post.createdAt.toISOString(),
		dateModified: post.createdAt.toISOString(),
		author: post.author
			? {
					"@type": "Person",
					name: post.author.username ?? "DBFR",
			  }
			: {
					"@type": "Organization",
					name: "DBFR",
			  },
		publisher: {
			"@type": "Organization",
			name: "DBFR",
			logo: {
				"@type": "ImageObject",
				url: `${SITE}/favicon-96.png`,
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${SITE}/post/${post.slug}`,
		},
	};

	const breadcrumbSchema: WithContext<BreadcrumbList> = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE}/` },
			{
				"@type": "ListItem",
				position: 2,
				name: "Actualités",
				item: `${SITE}/actualites`,
			},
			{ "@type": "ListItem", position: 3, name: post.title },
		],
	};

	return (
		<>
			<JsonLd data={blogPostingSchema} />
			<JsonLd data={breadcrumbSchema} />
			<article className="mx-auto max-w-[820px] px-6 lg:px-10 py-16 lg:py-24">
				<Link
					href="/actualites"
					className="inline-flex items-center gap-2 text-[13px] font-display font-semibold tracking-[0.10em] uppercase text-dbz-orange hover:text-white transition-colors mb-8"
				>
					← Toutes les actualités
				</Link>

				<header className="mb-10">
					<time
						dateTime={post.createdAt.toISOString()}
						className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-4 block"
					>
						{format(post.createdAt, "d MMMM yyyy", { locale: fr })} · {minutes}{" "}
						min de lecture
					</time>
					<h1 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white mb-6">
						{post.title}
					</h1>
					{post.excerpt && (
						<p className="text-[19px] leading-relaxed text-white/75">
							{post.excerpt}
						</p>
					)}
					<div className="flex items-center gap-3 mt-8 pb-8 border-b border-white/[0.06]">
						{post.author.avatar && (
							<img
								src={post.author.avatar}
								alt=""
								width={40}
								height={40}
								className="w-10 h-10 rounded-full"
							/>
						)}
						<div>
							<p className="font-display font-semibold text-[14px] text-white">
								{post.author.username}
							</p>
							<p className="text-[12px] text-white/50">Rédacteur DBFR</p>
						</div>
					</div>
				</header>

				{post.cover && (
					<div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 mb-12 bg-black">
						<Image
							src={post.cover}
							alt={post.title}
							fill
							sizes="(max-width: 820px) 100vw, 820px"
							className="object-cover"
							priority
						/>
					</div>
				)}

				<div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-h2:text-[28px] prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-h3:text-[20px] prose-h3:mt-8 prose-p:text-white/80 prose-p:text-[17px] prose-p:leading-[1.7] prose-a:text-dbz-orange prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-em:text-white/90 prose-li:text-white/80 prose-li:text-[17px] prose-blockquote:border-l-dbz-orange prose-blockquote:text-white/70 prose-code:text-dbz-orange prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-img:rounded-xl">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
				</div>

				<section className="mt-16 pt-12 border-t border-white/[0.06]">
					<h2 className="font-display font-bold text-[24px] text-white mb-8">
						Commentaires{" "}
						<span className="text-white/40 font-normal text-[18px]">
							· {post.comments.length}
						</span>
					</h2>

					{post.comments.length > 0 && (
						<div className="space-y-4 mb-10">
							{post.comments.map((comment) => (
								<div
									key={comment.id}
									className="p-5 rounded-xl bg-white/[0.04] border border-white/[0.06]"
								>
									<div className="flex items-center gap-3 mb-3">
										{comment.author.avatar && (
											<img
												src={comment.author.avatar}
												alt=""
												width={28}
												height={28}
												className="w-7 h-7 rounded-full"
											/>
										)}
										<span className="font-display font-semibold text-[14px] text-white">
											{comment.author.username}
										</span>
										<time
											dateTime={comment.createdAt.toISOString()}
											className="text-[12px] text-white/45"
										>
											{format(comment.createdAt, "d MMM yyyy 'à' HH:mm", {
												locale: fr,
											})}
										</time>
									</div>
									<p className="text-[15px] text-white/80 leading-relaxed whitespace-pre-wrap">
										{comment.body}
									</p>
								</div>
							))}
						</div>
					)}

					{me ? (
						<CommentForm slug={slug} />
					) : (
						<div className="p-6 rounded-xl bg-dbz-orange/10 border border-dbz-orange/30 flex flex-wrap items-center justify-between gap-4">
							<p className="text-[15px] text-white/85">
								Connecte-toi avec Discord pour commenter cet article.
							</p>
							<Link
								href={`/signin?callbackURL=/post/${slug}`}
								className="inline-flex items-center h-10 px-5 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[12px] tracking-[0.10em] uppercase transition-colors whitespace-nowrap"
							>
								Connexion
							</Link>
						</div>
					)}
				</section>
			</article>

			{relatedPosts.length > 0 && (
				<section className="border-t border-white/[0.06] bg-[#080808]">
					<div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-16">
						<h2 className="font-display font-bold text-[24px] text-white mb-8">
							Autres actualités
						</h2>
						<div className="grid md:grid-cols-3 gap-6">
							{relatedPosts.map((p) => (
								<Link
									key={p.id}
									href={`/post/${p.slug}`}
									className="group rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-dbz-orange/60 transition-colors overflow-hidden flex flex-col"
								>
									{p.cover && (
										<div className="relative aspect-[16/9] bg-black">
											<Image
												src={p.cover}
												alt={p.title}
												fill
												sizes="(max-width: 768px) 100vw, 33vw"
												className="object-cover group-hover:scale-105 transition-transform duration-700"
											/>
										</div>
									)}
									<div className="p-5">
										<time
											dateTime={p.createdAt.toISOString()}
											className="font-display font-semibold text-[10px] tracking-[0.16em] uppercase text-dbz-orange mb-2 block"
										>
											{format(p.createdAt, "d MMM yyyy", { locale: fr })}
										</time>
										<h3 className="font-display font-bold text-[16px] text-white group-hover:text-dbz-orange transition-colors leading-tight">
											{p.title}
										</h3>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}
		</>
	);
}
