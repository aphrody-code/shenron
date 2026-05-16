import { db } from "@/lib/db";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute

export default async function Home() {
	const posts = await db.query.posts.findMany({
		where: (p, { eq }) => eq(p.published, true),
		orderBy: (p, { desc }) => desc(p.createdAt),
		limit: 10,
		with: { author: true },
	});

	return (
		<div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl flex-1 flex flex-col">
			<header className="text-center mb-12">
				<h1
					className="text-5xl md:text-7xl text-dbz-yellow mb-4"
					style={{ textShadow: "4px 4px 0px rgba(229, 90, 0, 0.8)" }}
				>
					ACTUALITÉS DBFR
				</h1>
				<p className="text-dbz-blue-light font-bold tracking-widest uppercase">
					Les dernières nouvelles du hub galactique
				</p>
			</header>

			<div className="flex flex-col gap-8 flex-1">
				{posts.length === 0 ? (
					<div className="dbz-panel p-8 text-center flex-1 flex flex-col justify-center items-center">
						<p className="text-2xl font-saiyan text-dbz-orange uppercase tracking-wider">
							Aucun article publié pour le moment.
						</p>
					</div>
				) : (
					posts.map((post: any) => (
						<article
							key={post.id}
							className="dbz-panel p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start group"
						>
							<div className="flex-1">
								<Link href={`/post/${post.slug}`}>
									<h2 className="text-3xl md:text-4xl text-white group-hover:text-dbz-yellow transition-colors mb-3">
										{post.title}
									</h2>
								</Link>
								<p className="text-gray-300 mb-6 leading-relaxed">
									{post.excerpt}
								</p>
								<div className="flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-wider text-dbz-blue-light">
									{post.author.avatar && (
										<img
											src={post.author.avatar}
											alt={post.author.username}
											className="w-8 h-8 rounded-none border-2 border-dbz-blue-light"
										/>
									)}
									<span className="text-dbz-orange">
										{post.author.username}
									</span>
									<span>•</span>
									<time>
										{format(post.createdAt, "d MMMM yyyy", { locale: fr })}
									</time>
								</div>
							</div>
							<div className="w-full md:w-auto">
								<Link
									href={`/post/${post.slug}`}
									className="dbz-button inline-block w-full text-center"
								>
									LIRE
								</Link>
							</div>
						</article>
					))
				)}
			</div>
		</div>
	);
}
