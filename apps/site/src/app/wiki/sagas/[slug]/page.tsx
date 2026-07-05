import { Suspense } from "react";
import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { WikiArticle } from "@/components/wiki/WikiArticle";
import { WikiEntitySections } from "@/components/wiki/WikiEntitySections";
import { WikiAdminBar } from "@/components/wiki/WikiAdminBar";
import WikiRagArchives from "@/components/wiki/WikiRagArchives";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import type { CreativeWork, WithContext } from "schema-dts";

export const revalidate = 3600;

export async function generateStaticParams() {
	const r = await dbUniverse.sagas();
	return (r?.sagas ?? []).map((s) => ({ slug: s.slug }));
}

const SERIES_LABELS: Record<string, string> = {
	DB: "Dragon Ball",
	DBZ: "Dragon Ball Z",
	DBGT: "Dragon Ball GT",
	DBS: "Dragon Ball Super",
	DB_DAIMA: "Dragon Ball Daima",
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const data = await dbUniverse.saga(slug);
	if (!data) return { title: "Saga — DBFR" };
	const description =
		data.description ?? `Saga ${data.name} de ${SERIES_LABELS[data.series] ?? data.series}.`;
	return {
		title: `${data.name} — Saga Dragon Ball | DBFR`,
		description,
		...ogMeta({
			title: `${data.name} — DBFR`,
			description,
			image: data.image ? assetUrl(data.image) : undefined,
			canonical: `/wiki/sagas/${slug}`,
		}),
	};
}

export default async function SagaPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const data = await dbUniverse.saga(slug);
	if (!data) notFound();
	const saga = data;
	const arcs = data.arcs ?? [];
	const seriesLabel = SERIES_LABELS[saga.series] ?? saga.series;

	const jsonLdData: WithContext<CreativeWork> = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: saga.name,
		image: saga.image ? assetUrl(saga.image) : undefined,
		description: saga.description ?? undefined,
		isPartOf: {
			"@type": "CreativeWorkSeries",
			name: seriesLabel,
		},
	};

	return (
		<div className="mx-auto max-w-[1120px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<JsonLd data={jsonLdData} />
			<Link
				href="/wiki/sagas"
				className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-12 link-underline"
			>
				<span>← Toutes les sagas</span>
			</Link>

			<div className="mb-6">
				<WikiAdminBar table="db_sagas" id={saga.id} indexHref="/wiki/sagas" label={saga.name} />
			</div>

			<header className="mb-16">
				<div className="flex items-center gap-4 mb-4">
					<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-dbz-orange">
						{seriesLabel} · Saga {saga.order_idx}
					</p>
					<div className="h-px w-12 bg-dbz-border" />
				</div>

				<h1 className="font-saiyan text-5xl md:text-7xl text-white mb-6 tracking-widest leading-tight">
					{saga.name}
				</h1>

				{saga.name_ja && <p className="font-jp text-2xl text-dbz-orange/80 mb-8">{saga.name_ja}</p>}

				{saga.description && (
					<div className="dbz-panel p-8 relative overflow-hidden">
						<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />
						<div className="prose prose-invert max-w-none wiki-content">
							<WikiMarkdown body={saga.description} />
						</div>
					</div>
				)}
			</header>

			{saga.article && (
				<div className="mb-20">
					<WikiArticle article={saga.article} sources={saga.article_sources} heading="Article" />
				</div>
			)}

			<div className="mb-20">
				<WikiEntitySections entityType="saga" entityId={saga.id} />
			</div>

			{arcs.length > 0 && (
				<section className="mb-20">
					<div className="flex items-center gap-6 mb-10">
						<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest">
							Arcs Narratifs ({arcs.length})
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
					</div>

					<div className="grid gap-4">
						{arcs.map((a, idx) => (
							<Link
								key={a.id}
								href={`/wiki/arcs/${a.slug}`}
								className="dbz-panel p-6 hover:bg-white/5 transition-all group reveal-up"
								style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
							>
								<div className="flex justify-between items-start">
									<div>
										<p className="scouter-text text-xs text-dbz-orange mb-2">
											ARC_SEQUENCE: {a.order_idx}
										</p>
										<h3 className="font-display font-bold text-xl text-white group-hover:text-dbz-orange transition-colors">
											{a.name}
										</h3>
										{a.name_ja && <p className="font-jp text-sm text-white/40 mt-1">{a.name_ja}</p>}
									</div>
									<span className="text-dbz-orange opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
										→
									</span>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}

			<section className="dbz-panel p-10 border-t-4 border-t-dbz-orange bg-dbz-card/30">
				<h2 className="font-saiyan text-3xl text-white mb-6 tracking-widest">EXPLORATION</h2>
				<div className="flex flex-wrap gap-4">
					<Link href={`/wiki/episodes/serie/${saga.series}`} className="dbz-button">
						VOIR LES ÉPISODES
					</Link>
					<Link href="/wiki/personnages" className="dbz-button-ghost">
						PERSONNAGES
					</Link>
				</div>
			</section>

			{/* Passages liés du RAG (sourcés). Îlot Suspense : la requête RAG stream
			    indépendamment et ne bloque jamais le rendu de la saga. */}
			<Suspense fallback={null}>
				<WikiRagArchives query={saga.name} limit={4} />
			</Suspense>
		</div>
	);
}
