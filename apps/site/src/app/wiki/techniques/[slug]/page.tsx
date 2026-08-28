import { WikiEditBar } from "@/components/wiki/WikiEditBar";
import { WikiFicheVide } from "@/components/wiki/WikiFicheVide";
import { WikiSectionsReader } from "@/components/wiki/WikiSectionsReader";
import { WikiSources } from "@/components/wiki/WikiArticle";
import { buildWikiContentPanels } from "@/lib/wiki-panels";
import { getShenronTechnique, getShenronTechniques } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Image from "next/image";
import type { Metadata } from "next";
import { NOTE_PROVENANCE, estTypeDeJeu, libelleType } from "@/lib/techniques-types";
import { JsonLd } from "@/components/JsonLd";
import type { DefinedTerm, WithContext } from "schema-dts";
import { SITE_URL } from "@/lib/config";
import { ogMeta } from "@/lib/og";
import { capParams } from "@/lib/prerender";
export const revalidate = 3600;
export async function generateStaticParams() {
	const list = await getShenronTechniques();
	// 825 fiches pour une rubrique tout juste ouverte : on prérend les plus
	// susceptibles d'être visitées, l'ISR fait le reste.
	return capParams(
		list.map((t) => ({ slug: t.slug })),
		300
	);
}
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const tech = await getShenronTechnique(slug);
	if (!tech) return { title: "Technique Dragon Ball" };
	const description = tech.description ?? `Fiche détaillée de la technique ${tech.name}.`;
	return {
		title: `${tech.name} — Technique Dragon Ball`,
		description,
		...ogMeta({
			title: `${tech.name} — DBFR`,
			description,
			image: tech.creatorImage ? assetUrl(tech.creatorImage) : undefined,
			canonical: `/wiki/techniques/${slug}`,
		}),
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
	const contentPanels = await buildWikiContentPanels({
		entityType: "technique",
		entityId: tech.id,
		article: tech.article,
		description: tech.description,
		fallbackHeading: "Description",
	});
	const jsonLdData: WithContext<DefinedTerm> = {
		"@context": "https://schema.org",
		"@type": "DefinedTerm",
		name: tech.name,
		description: tech.description ?? undefined,
		termCode: String(tech.id),
		inDefinedTermSet: `${SITE_URL}/wiki/techniques`,
	};
	return (
		<article
			data-entity={tech.name}
			data-source-id="db_techniques"
			data-lang="fr"
			className="w-full mx-auto max-w-[1120px] px-6 lg:px-10 py-16 lg:py-24 reveal-up"
		>
			<JsonLd data={jsonLdData} />
			<Breadcrumbs
				className="mb-12"
				items={[
					{ label: "Techniques", href: "/wiki/techniques" },
					{ label: tech.name },
				]}
			/>
			<div className="mb-6">
				<WikiEditBar
				sansArticle
					table="db_techniques"
					id={tech.id}
					indexHref="/wiki/techniques"
					label={tech.name}
				/>
			</div>
			<div className="space-y-12">
				<header className="flex flex-col sm:flex-row gap-8 items-start">
					{/* Le portrait du créateur mène à sa fiche ; l'illustration Xenoverse,
					    elle, ne mène nulle part — elle montre un pratiquant, elle ne
					    désigne pas l'auteur de la technique. La légende le dit. */}
					{tech.creatorImage ? (
						<Link
							href={tech.creatorId ? `/wiki/personnages/${tech.creatorId}` : "#"}
							className="group relative aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black sm:w-48"
						>
							<Image
								src={assetUrl(tech.creatorImage)}
								alt={tech.creatorName ?? tech.name}
								fill
								sizes="192px"
								className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
								priority
							/>
						</Link>
					) : tech.image ? (
						<figure className="w-40 shrink-0 sm:w-48">
							<div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-black">
								<Image
									src={assetUrl(tech.image)}
									alt=""
									fill
									sizes="192px"
									className="object-cover object-top"
									priority
								/>
							</div>
							<figcaption className="mt-2 text-[11px] leading-snug text-white/40">
								Un personnage qui pratique cette technique dans{" "}
								<em>Dragon Ball Xenoverse 2</em>.
							</figcaption>
						</figure>
					) : null}
					<div className="min-w-0">
						<div className="flex items-center gap-4 mb-4">
							<span className="scouter-text text-xl text-dbz-blue-light">TECH_ID: {tech.id}</span>
							<div className="h-px w-12 bg-dbz-border" />
							<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-white/50">
								{libelleType(tech.type)}
							</p>
						</div>
						<h1 className="font-saiyan text-4xl lg:text-6xl text-white mb-4 tracking-widest leading-tight">
							{tech.name}
						</h1>
						{tech.creatorName && (
							<p className="text-white/70">
								Créateur / utilisateur :{" "}
								<Link
									href={tech.creatorId ? `/wiki/personnages/${tech.creatorId}` : "#"}
									className="text-dbz-orange font-bold hover:text-white transition-colors"
								>
									{tech.creatorName}
								</Link>
							</p>
						)}
						{/* La provenance se dit à l'écran, pas dans un `title` : ce
						    classement vient des slots de compétence d'un jeu, et le
						    lecteur qui voit « Attaques ultimes » sous une technique du
						    manga doit savoir d'où sort l'étiquette. Même phrase que
						    l'index — deux formulations feraient croire à deux réserves
						    de force différente. */}
						{estTypeDeJeu(tech.type) && (
							<p className="mt-3 max-w-xl text-[11px] leading-relaxed text-white/40">
								{NOTE_PROVENANCE}
							</p>
						)}
					</div>
				</header>
				{/* Article éclaté en catégories (Description, Utilisation, Histoire,
				    Anecdotes) plutôt qu'un pavé unique — même lecture que les fiches
				    personnage. Sans aucun texte, l'appel à l'écrire prend la place. */}
				{contentPanels.length > 1 ? (
					<>
						<WikiSectionsReader panels={contentPanels} />
						<WikiSources sources={tech.articleSources} />
					</>
				) : contentPanels.length === 1 ? (
					<>
						{contentPanels[0]!.node}
						<WikiSources sources={tech.articleSources} />
					</>
				) : (
					<WikiFicheVide
						table="db_techniques"
						rowId={tech.id}
						label={tech.name}
						quoi="qui l'emploie, comment elle fonctionne et dans quelle planche elle apparaît"
					/>
				)}
			</div>
		</article>
	);
}
