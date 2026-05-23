import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { getShenronRace } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const race = await getShenronRace(slug);
	if (!race) return { title: "Race Dragon Ball — DBFR" };
	return {
		title: `${race.name} — Race Dragon Ball | DBFR`,
		description: race.description ?? `Détails de la race ${race.name}.`,
	};
}

export default async function RaceDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const race = await getShenronRace(slug);

	if (!race) notFound();

	return (
		<div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<Link
				href="/wiki/races"
				className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-12 link-underline"
			>
				<span>← Toutes les races</span>
			</Link>

			<div className="space-y-16">
				<header>
					<div className="flex items-center gap-4 mb-4">
						<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-dbz-orange">
							Classification Biologique
						</p>
						<div className="h-px w-12 bg-dbz-border" />
					</div>
					
					<h1 className="font-saiyan text-5xl lg:text-8xl text-white mb-6 tracking-widest leading-tight">
						{race.name}
					</h1>
					
					{race.nameJa && (
						<p className="font-jp text-3xl text-dbz-orange/80 mb-8">
							{race.nameJa}
						</p>
					)}
					
					{race.description && (
						<div className="dbz-panel p-10 relative overflow-hidden max-w-4xl">
							<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />
							<div className="prose prose-invert max-w-none wiki-content">
								<WikiMarkdown body={race.description} />
							</div>
						</div>
					)}
				</header>

				{race.characters && race.characters.length > 0 && (
					<section className="space-y-10">
						<div className="flex items-center gap-6">
							<h2 className="font-saiyan text-4xl text-white uppercase tracking-widest whitespace-nowrap">
								Représentants Connus ({race.characters.length})
							</h2>
							<div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
						</div>
						
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
							{race.characters.map((char, idx) => (
								<Link
									key={char.id}
									href={`/wiki/dragon-ball/character/${char.id}`}
									className="group dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
									style={{ animationDelay: `${0.1 + idx * 0.03}s` }}
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
		</div>
	);
}
