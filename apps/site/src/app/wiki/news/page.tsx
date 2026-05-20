import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { SAGAS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 600;

export const metadata: Metadata = {
	title: "Actualités Dragon Ball — DBFR",
	description:
		"Dernières news, annonces officielles et rumeurs sur l'univers Dragon Ball (Daima, Sparking ZERO, Manga).",
};

export default async function NewsPage() {
	const data = await dbUniverse.news(20);
	const news = data?.news ?? [];

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Archives"
				title="Actualités"
				lead="Restez informé des dernières évolutions de l'univers Dragon Ball. News officielles, sorties manga et mises à jour du bot."
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
										{new Date(item.published_at).toLocaleDateString("fr-FR", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</span>
									<div className="h-px w-8 bg-dbz-border" />
									<span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
										Source: {new URL(item.source_url).hostname.replace("www.", "")}
									</span>
								</div>
								
								<h2 className="font-display font-bold text-2xl lg:text-3xl text-white mb-4 group-hover:text-dbz-orange transition-colors leading-tight">
									{item.title}
								</h2>
								
								{item.excerpt && (
									<p className="text-gray-400 leading-relaxed line-clamp-3 mb-6 font-sans">
										{item.excerpt}
									</p>
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
							<p className="text-white/40 font-display italic">Aucune actualité récente détectée par le Scouter.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
