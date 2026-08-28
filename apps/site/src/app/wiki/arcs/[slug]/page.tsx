import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { WikiArticle } from "@/components/wiki/WikiArticle";
import { WikiEntitySections } from "@/components/wiki/WikiEntitySections";
import { WikiEditBar } from "@/components/wiki/WikiEditBar";
import { EntityRating, EntityRatingSummary } from "@/components/ratings/EntityRating";
import { CommunityRankBadge } from "@/components/ratings/CommunityRankBadge";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ogMeta } from "@/lib/og";

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
	if (!data) return { title: "Arc" };
	// `ogMeta` plutôt qu'un `alternates` seul : déclarer `openGraph` sur une page
	// REMPLACE l'objet hérité du layout, image comprise. Sans ce passage, la
	// fiche d'arc ne servait AUCUN `og:image` — un partage Discord tombait sur
	// une carte nue. Un arc n'a pas d'illustration propre : on prend celle de sa
	// saga, qui est bien la scène dont l'arc fait partie.
	return {
		title: `${data.arc.name} — Arc Dragon Ball`,
		description: data.arc.description ?? `Détails de l'arc ${data.arc.name}.`,
		...ogMeta({
			title: `${data.arc.name} — Arc Dragon Ball`,
			description: data.arc.description ?? `Détails de l'arc ${data.arc.name}.`,
			image: data.saga?.image ? assetUrl(data.saga.image) : null,
			canonical: `/wiki/arcs/${slug}`,
		}),
	};
}

export default async function ArcPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const data = await dbUniverse.arc(slug);
	if (!data) notFound();
	const { arc, episodes, saga, sagaEpisodes, sagaVolumes } = data;
	// La fiche est vide quand ni article, ni description, ni rubrique DB ne
	// disent quoi que ce soit — 45 arcs sur 65 sont dans ce cas. L'encart
	// mesuré ne s'affiche QUE là : sur un arc rédigé, il ferait doublon avec
	// le texte, qui est plus précis que des bornes de saga.
	const ficheVide = !arc.article && !arc.description;
	const perimetreMesurable =
		ficheVide && episodes.length === 0 && !!saga && (sagaVolumes.length > 0 || sagaEpisodes.length > 0);

	return (
		<div className="mx-auto max-w-[1120px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<Breadcrumbs
				className="mb-12"
				items={[
					{ label: "Sagas & arcs", href: "/wiki/sagas" },
					{ label: "Arcs", href: "/wiki/arcs" },
					{ label: arc.name },
				]}
			/>

			<div className="mb-6">
				<WikiEditBar table="db_arcs" id={arc.id} indexHref="/wiki/sagas" label={arc.name} />
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

				{arc.name_ja && <p className="font-jp text-2xl text-dbz-orange/80 mb-4">{arc.name_ja}</p>}

				<div className="mb-8 flex flex-wrap items-center gap-2">
					<EntityRatingSummary targetType="arc" targetId={arc.id} />
					<CommunityRankBadge kind="arc" targetId={arc.id} />
				</div>

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

			{episodes.length > 0 && (
				<section className="mb-20">
					<div className="flex items-center gap-6 mb-10">
						<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest">
							Épisodes de l&apos;Arc ({episodes.length})
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
										<p className="font-jp text-xs text-white/50 mt-1 truncate">{ep.title_ja}</p>
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

			{/*
			  Périmètre MESURÉ, quand la fiche n'a rien à dire.

			  Ce ne sont PAS les bornes de l'arc : la base ne les connaît pas
			  (`db_arcs` ne porte aucune borne, et 790 épisodes sur 826 n'ont pas
			  d'`arc_id`). Ce sont celles de la SAGA parente, qui contient l'arc et
			  déborde de lui. On l'écrit tel quel plutôt que de laisser croire à un
			  découpage qu'on n'a pas — c'est la différence entre orienter le lecteur
			  et lui mentir.
			*/}
			{perimetreMesurable && saga && (
				<section className="mb-20">
					<div className="mb-6 flex items-center gap-6">
						<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest">
							Où le lire, où le voir
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
					</div>
					<p className="mb-8 max-w-2xl text-[13px] leading-relaxed text-white/45">
						Cet arc n&apos;a pas encore de texte. Faute d&apos;un découpage propre en
						base, voici le périmètre de la saga{" "}
						<Link
							href={`/wiki/sagas/${saga.slug}`}
							className="font-semibold text-dbz-orange hover:text-white transition-colors"
						>
							{saga.name}
						</Link>
						, dont il fait partie — il la déborde donc en largeur, et ne la
						remplace pas.
					</p>

					{sagaVolumes.length > 0 && (
						<div className="mb-10">
							<p className="mb-4 font-display text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
								Tomes du manga ({sagaVolumes.length})
							</p>
							<div className="flex flex-wrap gap-2">
								{sagaVolumes.map((v) => (
									<Link
										key={v.id}
										href={`/wiki/manga/volume/${v.id}`}
										className="rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 text-[13px] font-display font-semibold text-white/80 transition-colors hover:border-dbz-orange/60 hover:text-white"
									>
										Tome {v.volume_number}
									</Link>
								))}
							</div>
						</div>
					)}

					{sagaEpisodes.length > 0 && (
						<div>
							<p className="mb-4 font-display text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
								Épisodes ({sagaEpisodes.length})
							</p>
							<div className="flex flex-wrap gap-2">
								{sagaEpisodes.map((ep) => (
									<Link
										key={ep.id}
										href={`/wiki/episodes/${ep.id}`}
										title={ep.title}
										className="rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-[13px] font-display font-semibold text-white/70 transition-colors hover:border-dbz-orange/60 hover:text-white"
									>
										#{ep.number_in_series}
									</Link>
								))}
							</div>
						</div>
					)}
				</section>
			)}

			{/* Notes & avis — dernier bloc */}
			<div className="mb-20">
				<EntityRating
					targetType="arc"
					targetId={arc.id}
					signinCallback={`/wiki/arcs/${slug}`}
					label="cet arc"
				/>
			</div>
		</div>
	);
}
