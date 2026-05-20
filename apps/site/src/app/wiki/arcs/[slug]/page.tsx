import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const data = await dbUniverse.arc(slug);
	if (!data) return { title: "Arc — DBFR" };
	return {
		title: `${data.arc.name} — Arc Dragon Ball | DBFR`,
		description: data.arc.description ?? `Détails de l'arc ${data.arc.name}.`,
	};
}

export default async function ArcPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const data = await dbUniverse.arc(slug);
	if (!data) notFound();
	const { arc, episodes } = data;

	return (
		<div className="mx-auto max-w-[1000px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<Link
				href="/wiki/sagas"
				className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-12 link-underline"
			>
				<span>← Retour aux sagas</span>
			</Link>

			<header className="mb-16">
				<div className="flex items-center gap-4 mb-4">
					<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-dbz-orange">
						Arc Narratif {arc.order_idx}
					</p>
					<div className="h-px w-12 bg-dbz-border" />
				</div>
				
				<h1 className="font-saiyan text-5xl md:text-7xl text-white mb-6 tracking-widest leading-tight">
					{arc.name}
				</h1>
				
				{arc.name_ja && (
					<p className="font-jp text-2xl text-dbz-orange/80 mb-8">
						{arc.name_ja}
					</p>
				)}
				
				{arc.description && (
					<div className="dbz-panel p-8 relative overflow-hidden">
						<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />
						<p className="text-gray-300 leading-relaxed text-lg font-sans">
							{arc.description}
						</p>
					</div>
				)}
			</header>

			{episodes.length > 0 && (
				<section className="mb-20">
					<div className="flex items-center gap-6 mb-10">
						<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest whitespace-nowrap">
							Épisodes de l'Arc ({episodes.length})
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
					</div>
					
					<div className="grid gap-3">
						{episodes.map((ep, idx) => (
							<Link
								key={ep.id}
								href={`/wiki/episodes/${ep.id}`}
								className="dbz-panel p-5 flex items-center justify-between hover:bg-white/5 transition-all group reveal-up"
								style={{ animationDelay: `${0.1 + idx * 0.02}s` }}
							>
								<div className="flex items-center gap-6">
									<span className="scouter-text text-xl text-dbz-orange min-w-[60px]">
										#{String(ep.number_in_series).padStart(3, "0")}
									</span>
									<div>
										<p className="font-display font-bold text-white group-hover:text-dbz-orange transition-colors">
											{ep.title}
										</p>
										{ep.title_ja && (
											<p className="font-jp text-xs text-white/30 mt-1">
												{ep.title_ja}
											</p>
										)}
									</div>
								</div>
								<span className="text-dbz-orange opacity-0 group-hover:opacity-100 transition-opacity text-xl">→</span>
							</Link>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
