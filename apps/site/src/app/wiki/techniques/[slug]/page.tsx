import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { WikiArticle } from "@/components/wiki/WikiArticle";
import { WikiEntitySections } from "@/components/wiki/WikiEntitySections";
import { WikiEditBar } from "@/components/wiki/WikiEditBar";
import { getShenronTechnique, getShenronTechniques } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Image from "next/image";
import type { Metadata } from "next";
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
			className="mx-auto max-w-[1120px] px-6 lg:px-10 py-16 lg:py-24 reveal-up"
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
					table="db_techniques"
					id={tech.id}
					indexHref="/wiki/techniques"
					label={tech.name}
				/>
			</div>

			<div className="space-y-12">
				<header className="flex flex-col sm:flex-row gap-8 items-start">
					{tech.creatorImage && (
						<Link
							href={tech.creatorId ? `/wiki/personnages/${tech.creatorId}` : "#"}
							className="group relative w-40 sm:w-48 shrink-0 aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-black"
						>
							<Image
								src={assetUrl(tech.creatorImage)}
								alt={tech.creatorName ?? tech.name}
								fill
								sizes="192px"
								className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
								priority
							/>
						</Link>
					)}
					<div className="min-w-0">
						<div className="flex items-center gap-4 mb-4">
							<span className="scouter-text text-xl text-dbz-blue-light">TECH_ID: {tech.id}</span>
							<div className="h-px w-12 bg-dbz-border" />
							<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-white/50">
								{tech.type ?? "Capacité"}
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
					</div>
				</header>

				{tech.article ? (
					<WikiArticle
						article={tech.article}
						sources={tech.articleSources}
						heading="Article"
						accent="blue"
					/>
				) : (
					tech.description && (
						<section className="dbz-panel p-8 relative overflow-hidden">
							<div className="absolute top-0 left-0 w-1 h-full bg-dbz-blue-light" />
							<h2 className="font-saiyan text-2xl text-dbz-blue-light mb-4 uppercase tracking-widest">
								Description & Effets
							</h2>
							<div className="prose prose-invert max-w-none wiki-content">
								<WikiMarkdown body={tech.description} />
							</div>
						</section>
					)
				)}

				<WikiEntitySections entityType="technique" entityId={tech.id} />
			</div>
		</article>
	);
}
