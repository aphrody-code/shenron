import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { WikiArticle } from "@/components/wiki/WikiArticle";
import { WikiEntitySections } from "@/components/wiki/WikiEntitySections";
import { WikiAdminBar } from "@/components/wiki/WikiAdminBar";
import { EntityRating } from "@/components/ratings/EntityRating";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
	const data = await dbUniverse.sagas();
	const sagas = data?.sagas ?? [];
	const sagaDetails = await Promise.all(sagas.map((s) => dbUniverse.saga(s.slug)));
	return sagaDetails.flatMap((s) => s?.arcs ?? []).map((arc) => ({ slug: arc.slug }));
}

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
		alternates: { canonical: `/wiki/arcs/${slug}` },
	};
}

export default async function ArcPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const data = await dbUniverse.arc(slug);
	if (!data) notFound();
	const { arc, episodes } = data;

	return (
		<div className="mx-auto max-w-[1120px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<Link
				href="/wiki/sagas"
				className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-12 link-underline"
			>
				<span>← Retour aux sagas</span>
			</Link>

			<div className="mb-6">
				<WikiAdminBar table="db_arcs" id={arc.id} indexHref="/wiki/sagas" label={arc.name} />
			</div>

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

				{arc.name_ja && <p className="font-jp text-2xl text-dbz-orange/80 mb-8">{arc.name_ja}</p>}

				{arc.description && (
					<div className="dbz-panel p-8 relative overflow-hidden">
						<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />
						<div className="prose prose-invert max-w-none wiki-content">
							<WikiMarkdown body={arc.description} />
						</div>
					</div>
				)}
			</header>

			{arc.article && (
				<div className="mb-20">
					<WikiArticle article={arc.article} sources={arc.article_sources} heading="Article" />
				</div>
			)}

			<div className="mb-20">
				<WikiEntitySections entityType="arc" entityId={arc.id} />
			</div>

			<div className="mb-20">
				<EntityRating
					targetType="arc"
					targetId={arc.id}
					signinCallback={`/wiki/arcs/${slug}`}
					label="cet arc"
				/>
			</div>

			{episodes.length > 0 && (
				<section className="mb-20">
					<div className="flex items-center gap-6 mb-10">
						<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest">
							Épisodes de l'Arc ({episodes.length})
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
					</div>

					<div className="grid gap-3">
						{episodes.map((ep, idx) => (
							<Link
								key={ep.id}
								href={`/wiki/episodes/${ep.id}`}
								className="dbz-panel p-4 flex items-center gap-4 hover:bg-white/5 transition-all group reveal-up"
								style={{ animationDelay: `${0.1 + idx * 0.02}s` }}
							>
								<span className="scouter-text text-lg text-dbz-orange min-w-[52px] shrink-0">
									#{String(ep.number_in_series).padStart(3, "0")}
								</span>
								{ep.image ? (
									<div className="w-20 aspect-video overflow-hidden rounded bg-dbz-bg shrink-0">
										<img
											src={assetUrl(ep.image)}
											alt=""
											className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
											loading="lazy"
										/>
									</div>
								) : (
									<div className="w-20 aspect-video rounded bg-zinc-900 shrink-0" />
								)}
								<div className="flex-1 min-w-0">
									<p className="font-display font-bold text-[15px] text-white group-hover:text-dbz-orange transition-colors leading-snug">
										{ep.title}
									</p>
									{ep.title_ja && (
										<p className="font-jp text-xs text-white/30 mt-1 truncate">{ep.title_ja}</p>
									)}
								</div>
								<span className="text-dbz-orange opacity-0 group-hover:opacity-100 transition-opacity text-xl shrink-0">
									→
								</span>
							</Link>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
