import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { NEWS_HERO } from "@/lib/db-banners";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const POSTS_PER_PAGE = 12;

export const metadata: Metadata = {
	title: "Actualités Dragon Ball — DBFR",
	description:
		"Toutes les actualités Dragon Ball : sorties anime, manga, films, événements communauté française. Mis à jour régulièrement.",
};

export default async function ActualitesPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const sp = await searchParams;
	const page = Math.max(1, parseInt(sp.page ?? "1", 10));
	const offset = (page - 1) * POSTS_PER_PAGE;

	const [posts, total] = await Promise.all([
		db.query.posts.findMany({
			where: (p, { eq }) => eq(p.published, true),
			orderBy: (p, { desc }) => desc(p.createdAt),
			limit: POSTS_PER_PAGE,
			offset,
			with: { author: true },
		}),
		db.query.posts.findMany({
			where: (p, { eq }) => eq(p.published, true),
			columns: { id: true },
		}),
	]);

	const totalCount = total.length;
	const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE));

	return (
		<>
			<PageHero
				eyebrow="Journal"
				title="Actualités Dragon Ball"
				lead={`Sorties anime, chapitres manga, événements, news communauté francophone${totalCount > 0 ? ". " + totalCount + " article" + (totalCount > 1 ? "s" : "") + " publié" + (totalCount > 1 ? "s" : "") + "." : "."}`}
				image={NEWS_HERO}
				imageAlt="Actualités Dragon Ball"
			/>
			<div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-16 lg:py-24">

			{posts.length === 0 ? (
				<div className="p-10 rounded-2xl bg-white/[0.04] border border-white/[0.06] max-w-2xl">
					<h2 className="font-display font-bold text-[20px] text-white mb-3">
						Le journal démarre bientôt
					</h2>
					<p className="text-[15px] text-white/65 leading-relaxed mb-5">
						Pendant que nous préparons les premiers articles, explore le wiki et
						la communauté Discord pour suivre l'actualité Dragon Ball.
					</p>
					<div className="flex flex-wrap gap-3">
						<Link
							href="/wiki/dragon-ball"
							className="inline-flex items-center h-10 px-5 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[12px] tracking-[0.10em] uppercase transition-colors"
						>
							Explorer le wiki
						</Link>
						<a
							href="https://discord.gg/dbfr"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center h-10 px-5 rounded-full border border-white/20 hover:border-dbz-orange text-white font-display font-semibold text-[12px] tracking-[0.10em] uppercase transition-colors"
						>
							Rejoindre Discord
						</a>
					</div>
				</div>
			) : (
				<>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{posts.map((post) => (
							<article
								key={post.id}
								className="group rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:border-dbz-orange/60 transition-colors overflow-hidden flex flex-col"
							>
								{post.cover && (
									<Link
										href={`/post/${post.slug}`}
										className="block aspect-[16/9] relative bg-black overflow-hidden"
									>
										<Image
											src={post.cover}
											alt={post.title}
											fill
											sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
											className="object-cover group-hover:scale-105 transition-transform duration-700"
										/>
									</Link>
								)}
								<div className="p-6 flex-1 flex flex-col">
									<time
										dateTime={post.createdAt.toISOString()}
										className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-dbz-orange mb-3"
									>
										{format(post.createdAt, "d MMM yyyy", { locale: fr })}
									</time>
									<Link href={`/post/${post.slug}`}>
										<h2 className="font-display font-bold text-[20px] text-white group-hover:text-dbz-orange transition-colors mb-3 leading-tight">
											{post.title}
										</h2>
									</Link>
									{post.excerpt && (
										<p className="text-[14px] text-white/65 leading-relaxed mb-5 flex-1 line-clamp-3">
											{post.excerpt}
										</p>
									)}
									<div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
										{post.author.avatar && (
											<img
												src={post.author.avatar}
												alt=""
												width={24}
												height={24}
												className="w-6 h-6 rounded-full"
											/>
										)}
										<span className="text-[13px] font-display font-medium text-white/80">
											{post.author.username}
										</span>
									</div>
								</div>
							</article>
						))}
					</div>

					{totalPages > 1 && (
						<nav
							className="mt-14 flex items-center justify-center gap-2 flex-wrap"
							aria-label="Pagination"
						>
							{page > 1 && (
								<Link
									href={`/actualites?page=${page - 1}`}
									className="h-10 px-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] grid place-items-center font-display font-semibold text-[13px] text-white/80 transition-colors"
								>
									Précédent
								</Link>
							)}
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
								<Link
									key={p}
									href={`/actualites?page=${p}`}
									className={`min-w-[40px] h-10 px-3 rounded-full grid place-items-center font-display font-semibold text-[13px] transition-colors ${
										p === page
											? "bg-dbz-orange text-black"
											: "bg-white/[0.06] text-white/72 hover:bg-white/[0.12]"
									}`}
								>
									{p}
								</Link>
							))}
							{page < totalPages && (
								<Link
									href={`/actualites?page=${page + 1}`}
									className="h-10 px-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] grid place-items-center font-display font-semibold text-[13px] text-white/80 transition-colors"
								>
									Suivant
								</Link>
							)}
						</nav>
					)}
				</>
			)}
		</div>
		</>
	);
}
