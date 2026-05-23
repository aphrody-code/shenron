import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { getShenronPlanet } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PlanetPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const planet = await getShenronPlanet(parseInt(id));

	if (!planet) notFound();

	return (
		<div className="space-y-12 reveal-up">
			<Link
				href="/wiki/dragon-ball"
				className="inline-flex items-center gap-2 text-dbz-blue-light hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-4 link-underline"
			>
				<span>← Retour à l'index</span>
			</Link>

			<div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
				<div className="w-full lg:w-2/5 xl:w-1/2">
					<div className="dbz-panel p-8 border-2 border-dbz-blue-light/30 bg-dbz-bg relative overflow-hidden group">
						<div className="absolute inset-0 starfield opacity-30 group-hover:opacity-40 transition-opacity" />
						<img
							src={assetUrl(planet.image)}
							alt={planet.name}
							className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_30px_rgba(75,168,255,0.3)] group-hover:scale-110 transition-transform duration-1000"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-dbz-blue/40 to-transparent" />
					</div>
				</div>

				<div className="flex-1 space-y-8">
					<div className="reveal-up" style={{ animationDelay: "0.1s" }}>
						<h1
							className="text-5xl md:text-6xl lg:text-8xl font-saiyan text-white mb-4 leading-none"
							style={{ textShadow: "0 0 20px rgba(75,168,255,0.2)" }}
						>
							{planet.name}
						</h1>
						{(planet.nameJa || planet.nameRomaji) && (
							<div className="flex items-center flex-wrap gap-4 mb-6 text-gray-400">
								{planet.nameJa && (
									<span className="text-2xl font-bold tracking-widest text-dbz-blue-light" style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
										{planet.nameJa}
									</span>
								)}
								{planet.nameRomaji && (
									<span className="text-sm italic uppercase tracking-[0.2em] text-white/60">
										{planet.nameRomaji}
									</span>
								)}
							</div>
						)}
						<div className="flex flex-wrap gap-3">
							{planet.isDestroyed ? (
								<span className="px-4 py-1.5 bg-red-900/20 border border-red-500/40 text-red-500 font-bold text-[10px] uppercase tracking-[0.2em]">
									Détruite
								</span>
							) : (
								<span className="px-4 py-1.5 bg-green-900/20 border border-green-500/40 text-green-500 font-bold text-[10px] uppercase tracking-[0.2em]">
									Intacte
								</span>
							)}
						</div>
					</div>

					{planet.description && (
						<div className="dbz-panel p-8 reveal-up" style={{ animationDelay: "0.2s" }}>
							<div className="absolute top-0 left-0 w-1 h-full bg-dbz-blue-light" />
							<h3 className="text-dbz-blue-light font-saiyan text-3xl mb-4 uppercase tracking-widest">Archives / Lore</h3>
							<div className="prose prose-invert max-w-none wiki-content text-justify">
								<WikiMarkdown body={planet.description} />
							</div>
						</div>
					)}
				</div>
			</div>

			{planet.characters && planet.characters.length > 0 && (
				<section className="space-y-8 pt-12 reveal-up" style={{ animationDelay: "0.4s" }}>
					<div className="flex items-center gap-6">
						<h2 className="font-saiyan text-4xl md:text-5xl text-dbz-orange uppercase tracking-widest whitespace-nowrap">
							HABITANTS DÉTECTÉS
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-dbz-orange/50 to-transparent" />
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
						{planet.characters.map((char, idx) => (
							<Link
								key={char.id}
								href={`/wiki/dragon-ball/character/${char.id}`}
								className="group dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
								style={{ animationDelay: `${0.5 + idx * 0.05}s` }}
							>
								<div className="relative aspect-[3/4] bg-dbz-bg overflow-hidden">
									<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
									<img
										src={assetUrl(char.image)}
										alt={char.name}
										className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
									<div className="absolute inset-x-0 bottom-0 p-4 z-30">
										<p className="font-display font-bold text-sm text-white group-hover:text-dbz-orange transition-colors">
											{char.name}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
