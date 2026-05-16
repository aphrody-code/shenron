import { db } from "@/lib/db";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function ActualitesPage() {
	const posts = await db.query.posts.findMany({
		where: (p, { eq }) => eq(p.published, true),
		orderBy: (p, { desc }) => desc(p.createdAt),
		limit: 30,
		with: { author: true },
	});

	return (
		<div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
			<header className="mb-12 text-center">
				<p className="font-scouter text-xs tracking-[0.5em] text-fuchsia-300 mb-3">
					❯ JOURNAL DE BORD ❮
				</p>
				<h1 className="title-jagged text-5xl md:text-7xl leading-none mb-4">
					Actualités DBFR
				</h1>
				<p className="text-white/55 max-w-xl mx-auto">
					Toutes les annonces, mises à jour bot et événements du hub galactique.
				</p>
			</header>

			{posts.length === 0 ? (
				<div className="dbz-panel p-12 text-center">
					<p className="text-xl font-saiyan text-fuchsia-200 uppercase tracking-wider">
						Aucun article publié pour le moment.
					</p>
				</div>
			) : (
				<div className="grid md:grid-cols-2 gap-6">
					{posts.map((post) => (
						<article
							key={post.id}
							className="dbz-panel p-6 md:p-7 flex flex-col group"
						>
							{post.cover && (
								<Link
									href={`/post/${post.slug}`}
									className="block aspect-[16/9] mb-5 overflow-hidden -mx-7 -mt-7 border-b border-dbz-border"
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={post.cover}
										alt={post.title}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
									/>
								</Link>
							)}
							<time className="font-scouter text-[10px] tracking-[0.3em] text-fuchsia-300 mb-2 uppercase">
								{format(post.createdAt, "d MMMM yyyy", { locale: fr })}
							</time>
							<Link href={`/post/${post.slug}`}>
								<h2 className="text-2xl md:text-3xl text-white group-hover:text-fuchsia-200 transition-colors mb-3 font-saiyan leading-tight">
									{post.title}
								</h2>
							</Link>
							<p className="text-white/65 leading-relaxed mb-5 flex-1">
								{post.excerpt}
							</p>
							<div className="flex items-center justify-between gap-3 pt-4 border-t border-dbz-border/60">
								<div className="flex items-center gap-2 text-xs text-white/50">
									{post.author.avatar && (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={post.author.avatar}
											alt={post.author.username}
											className="w-6 h-6 rounded-full border border-dbz-border"
										/>
									)}
									<span className="text-cyan-300">{post.author.username}</span>
								</div>
								<Link
									href={`/post/${post.slug}`}
									className="dbz-button-ghost !text-[10px] !py-1.5 !px-3"
								>
									Lire →
								</Link>
							</div>
						</article>
					))}
				</div>
			)}
		</div>
	);
}
