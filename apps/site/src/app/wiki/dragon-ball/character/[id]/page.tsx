import { JsonLd } from "@/components/JsonLd";
import { TrackView } from "@/components/TrackView";
import { ViewTransition } from "@/components/ViewTransition";
import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { getShenronCharacter, getShenronCharacters } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import type { BreadcrumbList, Person, WithContext } from "schema-dts";
import { SITE_URL as SITE } from "@/lib/config";

export const revalidate = 3600;

export async function generateStaticParams() {
	const list = await getShenronCharacters();
	return list.map((c) => ({ id: String(c.id) }));
}

// Mémoïsé par requête : generateMetadata + le composant partagent un seul fetch.
const getChar = cache((id: number) => getShenronCharacter(id));

// Résumé texte brut pour <meta description> (markdown/HTML retirés, tronqué).
function plainText(md: string, max = 160): string {
	const t = md
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, "")
		.replace(/[#*_`>~|]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const c = await getChar(parseInt(id, 10));
	if (!c) return { title: "Personnage introuvable" };
	const img = c.image ? assetUrl(c.image) : undefined;
	const description = c.description
		? plainText(c.description)
		: `${c.name} — fiche personnage Dragon Ball : race, techniques, transformations et lore sur DBFR.`;
	return {
		title: c.nameJa ? `${c.name} (${c.nameJa})` : c.name,
		description,
		openGraph: {
			title: `${c.name} — DBFR`,
			description,
			type: "article",
			images: img ? [{ url: img, alt: c.name }] : undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: `${c.name} — DBFR`,
			description,
			images: img ? [img] : undefined,
		},
	};
}

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const character = await getChar(parseInt(id, 10));

	if (!character) notFound();

	const breadcrumb: WithContext<BreadcrumbList> = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE}/` },
			{
				"@type": "ListItem",
				position: 2,
				name: "Personnages",
				item: `${SITE}/wiki/dragon-ball`,
			},
			{ "@type": "ListItem", position: 3, name: character.name },
		],
	};

	const personSchema: WithContext<Person> = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: character.name,
		image: character.image ? assetUrl(character.image) : undefined,
		description: character.description ? plainText(character.description) : undefined,
		alternateName: character.nameJa ?? undefined,
		homeLocation: character.originPlanet
			? {
					"@type": "Place",
					name: character.originPlanet.name,
				}
			: undefined,
	};

	return (
		<article
			data-entity={character.name}
			data-source-id="db_characters"
			data-lang="fr"
			className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24 space-y-12 reveal-up"
		>
			<JsonLd data={breadcrumb} />
			<JsonLd data={personSchema} />
			<TrackView entityType="character" entityId={character.id} entityName={character.name} />
			<Link
				href="/wiki/personnages"
				// `nav-back` → slide directionnel inverse (retour vers la grille).
				transitionTypes={["nav-back"]}
				className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-4 link-underline"
			>
				<span>← Retour aux personnages</span>
			</Link>

			<div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
				<div className="w-full lg:w-2/5 xl:w-1/3">
					<div className="dbz-panel p-6 border-2 border-dbz-orange/30 bg-dbz-card relative overflow-hidden group">
						<div className="absolute inset-0 halftone opacity-20 group-hover:opacity-30 transition-opacity" />
						{/* Cible du morph partagé : même `name` que le thumbnail de la grille
						    → l'image se déplie en continuité depuis la tuile cliquée. */}
						<ViewTransition name={`character-img-${character.id}`} share="morph">
							<img
								src={assetUrl(character.image)}
								alt={character.name}
								className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,178,0,0.3)] group-hover:scale-105 transition-transform duration-700"
							/>
						</ViewTransition>
						<div className="absolute inset-0 bg-gradient-to-t from-dbz-orange/10 to-transparent" />
					</div>
				</div>

				<div className="flex-1 min-w-0 space-y-8">
					<div className="reveal-up" style={{ animationDelay: "0.1s" }}>
						<h1
							className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-saiyan text-white mb-4 leading-none break-words"
							style={{ textShadow: "0 0 20px rgba(255,178,0,0.2)" }}
						>
							{character.name}
						</h1>
						{(character.nameJa || character.nameRomaji) && (
							<div className="flex items-center flex-wrap gap-4 mb-6 text-gray-400">
								{character.nameJa && (
									<span
										className="text-2xl font-bold tracking-widest text-dbz-orange"
										style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
									>
										{character.nameJa}
									</span>
								)}
								{character.nameRomaji && (
									<span className="text-sm italic uppercase tracking-[0.2em] text-white/60">
										{character.nameRomaji}
									</span>
								)}
							</div>
						)}
						<div className="flex flex-wrap gap-3">
							{character.race && (
								<span className="px-4 py-1.5 bg-dbz-orange/10 border border-dbz-orange/40 text-dbz-orange font-bold text-[10px] uppercase tracking-[0.2em]">
									{character.race}
								</span>
							)}
							{character.affiliation && (
								<span className="px-4 py-1.5 bg-white/5 border border-white/20 text-white/80 font-bold text-[10px] uppercase tracking-[0.2em]">
									{character.affiliation}
								</span>
							)}
						</div>
					</div>

					{(character.ki || character.maxKi) && (
						<div
							className="grid grid-cols-1 sm:grid-cols-2 gap-6 reveal-up"
							style={{ animationDelay: "0.3s" }}
						>
							{character.ki && (
								<div className="dbz-panel p-6 border-l-4 border-l-dbz-orange">
									<p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-2">
										KI Actuel
									</p>
									<p className="scouter-text text-4xl text-dbz-orange">{character.ki}</p>
								</div>
							)}
							{character.maxKi && (
								<div className="dbz-panel p-6 border-l-4 border-l-dbz-red">
									<p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-2">
										KI Maximum
									</p>
									<p className="scouter-text text-4xl text-dbz-red">{character.maxKi}</p>
								</div>
							)}
						</div>
					)}

					{character.originPlanet && (
						<Link
							href={`/wiki/dragon-ball/planet/${character.originPlanet.id}`}
							className="dbz-panel p-6 flex items-center gap-6 hover:border-dbz-orange transition-all group reveal-up"
							style={{ animationDelay: "0.4s" }}
						>
							<div className="w-20 h-20 bg-dbz-bg border border-dbz-border p-1 overflow-hidden shrink-0 rounded-lg">
								<img
									src={assetUrl(character.originPlanet.image)}
									alt={character.originPlanet.name}
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
								/>
							</div>
							<div className="flex-1">
								<p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-1">
									Planète d'Origine
								</p>
								<p className="text-2xl font-saiyan text-white group-hover:text-dbz-orange transition-colors uppercase tracking-widest">
									{character.originPlanet.name}
								</p>
							</div>
							<span className="text-dbz-orange opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
								→
							</span>
						</Link>
					)}
				</div>
			</div>

			{character.description && (
				<section className="reveal-up" style={{ animationDelay: "0.45s" }}>
					<div className="dbz-panel p-6 sm:p-8 lg:p-10 overflow-hidden">
						<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />
						<div className="flex items-center gap-6 mb-6">
							<h2 className="text-dbz-orange font-saiyan text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest">
								Archives / Lore
							</h2>
							<div className="h-px flex-1 bg-gradient-to-r from-dbz-orange/50 to-transparent" />
						</div>
						<div className="prose prose-invert max-w-none wiki-content wiki-lore text-justify">
							<WikiMarkdown body={character.description} />
						</div>
					</div>
				</section>
			)}

			{character.transformations && character.transformations.length > 0 && (
				<section className="space-y-8 pt-12 reveal-up" style={{ animationDelay: "0.5s" }}>
					<div className="flex items-center gap-6">
						<h2 className="font-saiyan text-2xl sm:text-4xl md:text-5xl text-dbz-orange uppercase tracking-widest">
							TRANSFORMATIONS
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-dbz-orange/50 to-transparent" />
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
						{character.transformations.map((transfo, idx) => (
							<div
								key={transfo.id}
								className="dbz-panel p-4 flex flex-col items-center group hover:scale-105 transition-transform duration-300"
								style={{ animationDelay: `${0.6 + idx * 0.05}s` }}
							>
								<div className="aspect-square w-full bg-dbz-bg border border-dbz-border p-2 mb-4 overflow-hidden relative rounded-lg">
									<div className="absolute inset-0 halftone opacity-10" />
									<img
										src={assetUrl(transfo.image)}
										alt={transfo.name}
										className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700"
									/>
								</div>
								<h3 className="text-xs font-bold text-white uppercase text-center group-hover:text-dbz-orange transition-colors leading-tight tracking-widest">
									{transfo.name}
								</h3>
								{transfo.ki && (
									<span className="scouter-text text-[10px] mt-2">KI: {transfo.ki}</span>
								)}
							</div>
						))}
					</div>
				</section>
			)}

			{character.techniques && character.techniques.length > 0 && (
				<section className="space-y-8 pt-12 reveal-up" style={{ animationDelay: "0.7s" }}>
					<div className="flex items-center gap-6">
						<h2 className="font-saiyan text-2xl sm:text-4xl md:text-5xl text-dbz-blue-light uppercase tracking-widest">
							TECHNIQUES & CAPACITÉS
						</h2>
						<div className="h-px flex-1 bg-gradient-to-r from-dbz-blue-light/50 to-transparent" />
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{character.techniques.map(({ technique: tech }, idx) => (
							<div
								key={tech.id}
								className="dbz-panel p-6 hover:border-dbz-blue-light transition-all group"
								style={{ animationDelay: `${0.8 + idx * 0.05}s` }}
							>
								<div className="flex justify-between items-start mb-4">
									<h3 className="text-xl font-bold text-white group-hover:text-dbz-blue-light transition-colors uppercase tracking-wider">
										{tech.name}
									</h3>
									<span className="scouter-text text-[10px] text-dbz-blue-light/60">
										TECH_ID: {tech.id}
									</span>
								</div>
								{tech.description && (
									<p className="text-sm text-gray-400 leading-relaxed line-clamp-3 font-sans">
										{tech.description}
									</p>
								)}
								<div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
									<Link
										href={`/wiki/dragon-ball/techniques/${tech.slug}`}
										className="text-[10px] font-bold text-dbz-blue-light hover:text-white uppercase tracking-widest transition-colors"
									>
										Détails Technique →
									</Link>
								</div>
							</div>
						))}
					</div>
				</section>
			)}
		</article>
	);
}
