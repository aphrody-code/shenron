import { Suspense } from "react";
import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { WikiArticle } from "@/components/wiki/WikiArticle";
import { WikiEntitySections } from "@/components/wiki/WikiEntitySections";
import { WikiEditBar } from "@/components/wiki/WikiEditBar";
import WikiRagArchives from "@/components/wiki/WikiRagArchives";
import { AggregateRatingBanner } from "@/components/ratings/EntityRating";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
import { getAggregateSummary, getRatingSummaries } from "@/lib/ratings";
import { getShenronSagaCharacters } from "@/lib/shenron";
import { WikiImg } from "@/components/wiki/WikiImg";
import { ogMeta } from "@/lib/og";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GatedLink, GatedWrap } from "@/components/GatedLink";
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
	if (!data) return { title: "Saga" };
	const description =
		data.description ?? `Saga ${data.name} de ${SERIES_LABELS[data.series] ?? data.series}.`;
	return {
		title: `${data.name} — Saga Dragon Ball`,
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
	const arcIds = arcs.map((a) => String(a.id));
	// `personnages` : lecture inverse de bot.db_character_variants — qui a été
	// relevé dans cette saga. Lancé avec les notes, jamais après : les trois
	// requêtes sont indépendantes de la saga déjà chargée.
	const [sagaAvg, arcRatings, personnages] = await Promise.all([
		getAggregateSummary("arc", arcIds),
		getRatingSummaries("arc", arcIds),
		getShenronSagaCharacters(saga.id),
	]);

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
		<div className="mx-auto max-w-[1120px] px-6 lg:px-10 py-16 lg:py-24">
			<JsonLd data={jsonLdData} />
			<Breadcrumbs
				className="mb-12"
				items={[{ label: "Sagas & arcs", href: "/wiki/sagas" }, { label: saga.name }]}
			/>

			<div className="mb-6">
				<WikiEditBar table="db_sagas" id={saga.id} indexHref="/wiki/sagas" label={saga.name} />
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

				<div className="mt-8">
					<AggregateRatingBanner
						average={sagaAvg.average}
						count={sagaAvg.count}
						subtitle={
							sagaAvg.count > 0
								? `${sagaAvg.count} note${sagaAvg.count > 1 ? "s" : ""} cumulées sur les arcs`
								: "Note les arcs pour faire remonter la moyenne de la saga"
						}
					/>
				</div>
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
							<GatedWrap
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
										{a.name_ja && <p className="font-jp text-sm text-white/50 mt-1">{a.name_ja}</p>}
										{(() => {
											const r = arcRatings.get(String(a.id));
											if (!r || r.count <= 0) return null;
											return (
												<p className="mt-2 text-[12px] font-display font-semibold text-dbz-orange">
													★ {r.average.toFixed(1)}{" "}
													<span className="text-white/50 font-normal">({r.count})</span>
												</p>
											);
										})()}
									</div>
									<span className="text-dbz-orange opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
										→
									</span>
								</div>
							</GatedWrap>
						))}
					</div>
				</section>
			)}

			{personnages.length > 0 && (
				<section className="mb-20">
					<div className="flex items-center gap-6 mb-6">
						<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest">
							Personnages ({personnages.length})
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
					</div>
					{/* Ce que la liste dit exactement — le relevé porte sur le TEXTE du
					    manga : un personnage mort peut y être nommé pendant des tomes.
					    L'annoncer vaut mieux que de laisser lire « qui combat ici ». */}
					<p className="mb-8 max-w-3xl text-sm text-white/50">
						Personnages dont le nom est relevé dans les planches du manga et les résumés
						d&apos;épisode couvrant cette saga, du plus cité au moins cité. Une citation n&apos;est
						pas une apparition.
					</p>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
						{personnages.map((p) => (
							<GatedWrap
								key={p.characterId}
								href={`/wiki/personnages/${p.characterId}`}
								className="dbz-panel group flex flex-col items-center p-3 transition-transform duration-300 hover:scale-105"
							>
								<div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg border border-dbz-border bg-dbz-bg p-1">
									<div aria-hidden className="halftone absolute inset-0 opacity-10" />
									<WikiImg
										src={p.image}
										alt={p.name}
										sizes="(min-width: 1280px) 160px, (min-width: 768px) 22vw, 45vw"
										loading="lazy"
										className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
										placeholderClassName="relative z-10 flex h-full w-full items-center justify-center rounded"
									/>
								</div>
								<p className="text-center text-xs font-bold uppercase tracking-wider text-white transition-colors group-hover:text-dbz-orange">
									{p.name}
								</p>
								{(p.planches || p.synopsis) && (
									<p className="mt-1 text-[10px] tabular-nums uppercase tracking-widest text-white/40">
										{[
											p.planches ? `${p.planches} planches` : null,
											p.synopsis ? `${p.synopsis} résumés` : null,
										]
											.filter(Boolean)
											.join(" · ")}
									</p>
								)}
							</GatedWrap>
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
					<GatedLink href="/wiki/personnages" className="dbz-button-ghost">
						PERSONNAGES
					</GatedLink>
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
