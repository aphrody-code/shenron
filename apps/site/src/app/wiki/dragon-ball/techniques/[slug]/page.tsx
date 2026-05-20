import { getShenronTechnique } from "@/lib/shenron";
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
	const tech = await getShenronTechnique(slug);
	if (!tech) return { title: "Technique Dragon Ball — DBFR" };
	return {
		title: `${tech.name} — Technique Dragon Ball | DBFR`,
		description: tech.description ?? `Fiche détaillée de la technique ${tech.name}.`,
	};
}

export default async function TechniqueDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const tech = await getShenronTechnique(slug);

	if (!tech) notFound();

	return (
		<div className="mx-auto max-w-[1000px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<Link
				href="/wiki/dragon-ball/techniques"
				className="inline-flex items-center gap-2 text-dbz-blue-light hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-12 link-underline"
			>
				<span>← Toutes les techniques</span>
			</Link>

			<div className="space-y-12">
				<header>
					<div className="flex items-center gap-4 mb-4">
						<span className="scouter-text text-xl text-dbz-blue-light">
							TECH_ID: {tech.id}
						</span>
						<div className="h-px w-12 bg-dbz-border" />
						<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-white/40">
							Capacité Spéciale
						</p>
					</div>
					
					<h1 className="font-saiyan text-5xl lg:text-7xl text-white mb-6 tracking-widest leading-tight">
						{tech.name}
					</h1>

					<div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest">
						<span className="px-3 py-1 bg-dbz-blue-light/10 border border-dbz-blue-light/30 text-dbz-blue-light">
							OFFENSIF
						</span>
						<span className="px-3 py-1 bg-white/5 border border-white/10 text-white/60">
							KI-BASED
						</span>
					</div>
				</header>

				{tech.description && (
					<section className="dbz-panel p-8 relative overflow-hidden">
						<div className="absolute top-0 left-0 w-1 h-full bg-dbz-blue-light" />
						<h2 className="font-saiyan text-2xl text-dbz-blue-light mb-4 uppercase tracking-widest">Description & Effets</h2>
						<p className="text-gray-300 leading-relaxed text-lg font-sans">
							{tech.description}
						</p>
					</section>
				)}

				<div className="grid md:grid-cols-2 gap-8">
					<div className="dbz-panel p-6 border-l-4 border-l-dbz-orange">
						<h3 className="text-dbz-orange font-bold uppercase tracking-widest text-xs mb-4">Utilisateurs Connus</h3>
						<p className="text-white/60 italic text-sm">Données en cours de synchronisation...</p>
					</div>
					<div className="dbz-panel p-6 border-l-4 border-l-dbz-red">
						<h3 className="text-dbz-red font-bold uppercase tracking-widest text-xs mb-4">Niveau de Danger</h3>
						<div className="flex items-center gap-2">
							<div className="h-2 flex-1 bg-zinc-800 rounded-full overflow-hidden">
								<div className="h-full bg-dbz-red w-[85%]" />
							</div>
							<span className="scouter-text text-dbz-red">85%</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
