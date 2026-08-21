import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { Markdown } from "@/components/Markdown";
import { SAGAS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";
import { isEditableAsset } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Actualités Dragon Ball",
	description:
		"Dernières news, annonces officielles et rumeurs sur l'univers Dragon Ball (Daima, Sparking ZERO, Manga).",
	alternates: { canonical: "/wiki/news" },
	// Page legacy qui double le titre/canonical de /actualites et reste bloquée en
	// bêta (middleware) → noindex pour éviter le doublon SEO. Le vrai journal = /actualites.
	robots: { index: false, follow: true },
};

export default async function NewsPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const sp = await searchParams;
	const page = Math.max(1, parseInt(sp.page ?? "1", 10));
	const limit = 20;
	// API ne supporte pas encore l'offset — on charge limit * page puis slice
	const data = await dbUniverse.news(limit * page);
	const allNews = data?.news ?? [];
	const news = allNews.slice((page - 1) * limit, page * limit);
	// Estimation conservative : s'il y a exactement limit * page résultats, il peut y en avoir plus
	const hasMore = allNews.length === limit * page;

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Archives"
				title="Actualités"
				image={SAGAS_HERO}
				imageAlt="News Dragon Ball"
			/>

			<div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
				<div className="grid gap-10">
					{news.map((item, idx) => (
						<article
							key={item.id}
							className="dbz-panel flex flex-col md:flex-row overflow-hidden group hover:border-dbz-orange transition-all reveal-up"
							style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
						>
							<div className="w-full md:w-72 lg:w-96 aspect-video md:aspect-square bg-dbz-bg overflow-hidden shrink-0 relative">
								<div className="absolute inset-0 halftone opacity-10 z-10" />
								{item.image ? (
									<Image
										src={assetUrl(item.image)}
										alt={item.title}
										fill
										// Sans `sizes`, Next sert la variante pleine largeur d'écran
										// pour une vignette qui n'occupe qu'une colonne.
										sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
										quality={70}
										unoptimized={isEditableAsset(item.image)}
										className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-zinc-900">
										<span className="text-zinc-700 font-saiyan text-4xl">NEWS</span>
									</div>
								)}
								<div className="absolute top-4 left-4 z-20">
									<span className="bg-dbz-orange text-black font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
										{item.category || "Général"}
									</span>
								</div>
							</div>

							<div className="p-8 flex flex-col justify-center flex-1">
								<div className="flex items-center gap-3 mb-4">
									<span className="scouter-text text-xs text-dbz-orange/60">
										{new Date(item.published_at * 1000).toLocaleDateString("fr-FR", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</span>
									<div className="h-px w-8 bg-dbz-border" />
									<span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
										Source: {new URL(item.source_url).hostname.replace("www.", "")}
									</span>
								</div>

								<h2 className="font-display font-bold text-2xl lg:text-3xl text-white mb-4 group-hover:text-dbz-orange transition-colors leading-tight">
									{item.title}
								</h2>

								{item.excerpt && (
									<Markdown className="text-gray-400 leading-relaxed mb-6 font-sans text-[15px] max-h-[7.5rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent)]">
										{item.excerpt}
									</Markdown>
								)}

								<a
									href={item.source_url}
									target="_blank"
									rel="noopener noreferrer"
									className="dbz-button-ghost self-start group/btn"
								>
									<span>Lire l'article</span>
									<span className="ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
								</a>
							</div>
						</article>
					))}

					{news.length === 0 && (
						<div className="dbz-panel p-12 text-center border-dashed">
							<p className="text-white/50 font-display italic">
								Aucune actualité récente détectée par le Scouter.
							</p>
						</div>
					)}
				</div>

				{/* Pagination */}
				{(page > 1 || hasMore) && (
					<nav className="mt-12 flex items-center justify-center gap-4">
						{page > 1 && (
							<Link href={`/wiki/news?page=${page - 1}`} className="dbz-button-ghost">
								← Page précédente
							</Link>
						)}
						<span className="scouter-text text-dbz-orange px-4">PAGE {page}</span>
						{hasMore && (
							<Link href={`/wiki/news?page=${page + 1}`} className="dbz-button-ghost">
								Page suivante →
							</Link>
						)}
					</nav>
				)}
			</div>
		</div>
	);
}
