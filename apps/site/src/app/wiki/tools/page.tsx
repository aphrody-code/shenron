import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SAGAS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Outils & Modding Dragon Ball — DBFR",
	description:
		"Outils communautaires Dragon Ball : modding, shaders, API publiques et utilitaires de recherche.",
};

export default async function ToolsPage() {
	const data = await dbUniverse.tools();
	const tools = data?.tools ?? [];

	const categories = {
		modding: "Modding & Reverse Engineering",
		shader: "Shaders & Graphismes",
		api: "APIs & Données",
		utility: "Utilitaires & Divers",
	};

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Communauté"
				title="Outils & Modding"
				image={SAGAS_HERO}
				imageAlt="Modding Dragon Ball"
			/>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24 space-y-20">
				{Object.entries(categories).map(([key, label]) => {
					const catTools = tools.filter((t) => t.category === key);
					if (catTools.length === 0) return null;

					return (
						<section key={key} className="reveal-up">
							<div className="flex items-center gap-6 mb-10">
								<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest whitespace-nowrap">
									{label}
								</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{catTools.map((tool, idx) => (
									<a
										key={tool.id}
										href={tool.url}
										target="_blank"
										rel="noopener noreferrer"
										className="dbz-panel p-6 hover:border-dbz-orange transition-all group flex flex-col justify-between"
									>
										<div>
											<div className="flex justify-between items-start mb-4">
												<h3 className="text-xl font-bold text-white group-hover:text-dbz-orange transition-colors">
													{tool.name.split("/")[1] || tool.name}
												</h3>
												<span className="scouter-text text-xs text-dbz-orange">
													⭐ {tool.stars}
												</span>
											</div>
											<p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">
												Auteur: {tool.author} · {tool.language || "N/A"}
											</p>
											<p className="text-gray-400 text-sm font-sans leading-relaxed line-clamp-3">
												{tool.description}
											</p>
										</div>
										<div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
											<span className="text-[9px] font-bold text-dbz-orange/60 uppercase tracking-widest">
												{tool.category}
											</span>
											<span className="text-dbz-orange group-hover:translate-x-1 transition-transform">
												VOIR SUR GITHUB →
											</span>
										</div>
									</a>
								))}
							</div>
						</section>
					);
				})}
			</div>
		</div>
	);
}
