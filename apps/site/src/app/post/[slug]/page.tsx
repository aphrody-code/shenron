import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { CommentForm } from "./CommentForm";

export const dynamic = "force-dynamic";

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

	return (
		<article className="container mx-auto px-4 py-12 max-w-4xl">
			<header className="mb-10">
				<h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
					{post.title}
				</h1>
				<div className="flex items-center gap-3 text-sm text-white/60">
					{post.author.avatar && (
						<img
							src={post.author.avatar}
							alt={post.author.username}
							className="w-8 h-8 rounded-full border border-dbz-border"
						/>
					)}
					<span className="text-fuchsia-300">{post.author.username}</span>
					<span className="text-white/30">·</span>
					<time>{format(post.createdAt, "d MMMM yyyy", { locale: fr })}</time>
				</div>
			</header>

			{post.cover && (
				<img
					src={post.cover}
					alt={post.title}
					className="w-full aspect-video object-cover rounded-xl mb-12 border border-dbz-border shadow-2xl"
				/>
			)}

			<div className="prose prose-invert prose-headings:text-white prose-a:text-fuchsia-300 prose-strong:text-cyan-200 max-w-none mb-16">
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
			</div>

			<section className="border-t border-dbz-border pt-10">
				<h2 className="text-2xl font-bold mb-6 text-white">
					Commentaires{" "}
					<span className="text-white/40 font-normal">
						({post.comments.length})
					</span>
				</h2>

				{post.comments.length > 0 && (
					<div className="space-y-4 mb-10">
						{post.comments.map(
							(comment: {
								id: string;
								body: string;
								createdAt: Date;
								author: {
									username: string;
									avatar: string | null;
								};
							}) => (
								<div key={comment.id} className="dbz-panel p-4">
									<div className="flex items-center gap-3 mb-2">
										{comment.author.avatar && (
											<img
												src={comment.author.avatar}
												alt={comment.author.username}
												className="w-7 h-7 rounded-full border border-dbz-border"
											/>
										)}
										<span className="font-semibold text-sm text-white">
											{comment.author.username}
										</span>
										<span className="text-xs text-white/40">
											{format(comment.createdAt, "d MMM yyyy", { locale: fr })}
										</span>
									</div>
									<p className="text-white/80 whitespace-pre-wrap leading-relaxed">
										{comment.body}
									</p>
								</div>
							),
						)}
					</div>
				)}

				{me ? (
					<CommentForm slug={slug} />
				) : (
					<div className="dbz-panel p-6 text-center">
						<p className="text-white/70 mb-3">
							Connecte-toi avec Discord pour participer.
						</p>
						<Link
							href={`/signin?callbackURL=/post/${slug}`}
							className="dbz-button !text-xs"
						>
							Se connecter
						</Link>
					</div>
				)}
			</section>
		</article>
	);
}
