import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { TrackView } from "@/components/TrackView";
import { ViewTransition } from "@/components/ViewTransition";
import { WikiSources } from "@/components/wiki/WikiArticle";
import { WikiRelatedCharacters } from "@/components/wiki/WikiRelatedCharacters";
import { CharacterSagaVariants } from "@/components/wiki/CharacterSagaVariants";
import { WikiSectionsReader, type ReaderPanel } from "@/components/wiki/WikiSectionsReader";
import { WikiEditBar } from "@/components/wiki/WikiEditBar";
import { WikiImg } from "@/components/wiki/WikiImg";
import { buildWikiContentPanels } from "@/lib/wiki-panels";
import { TECH_SECTION_KEYS, TRANSFO_SECTION_KEYS } from "@/lib/wiki-article-sections";
import {
	getShenronCharacter,
	getShenronCharacterCards,
	getShenronCharacterVariants,
} from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GatedWrap } from "@/components/GatedLink";
import { PWS_GROUP_PRESETS } from "@/lib/wiki-fields";
import { sectionSlug } from "@/lib/wiki-article-sections";
import { cache, type ReactNode } from "react";
import type { Person, WithContext } from "schema-dts";
import type { SectionAccent } from "@/lib/wiki-section-accents";
import { capParams } from "@/lib/prerender";
import { getLaunchConfig } from "@/lib/wiki-launch-config";

export const revalidate = 3600;

export async function generateStaticParams() {
	const list = await getShenronCharacterCards();
	// 1 323 fiches, et la rubrique « personnages » est encore fermée au public :
	// les prérendre toutes au build serait payer un cache que personne ne lit.
	// L'ISR prend le relais à la demande (cf. lib/prerender).
	return capParams(
		list.map((c) => ({ id: String(c.id) })),
		100
	);
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
		alternates: { canonical: `/wiki/personnages/${id}` },
		openGraph: {
			title: `${c.name} — DBFR`,
			description,
			type: "article",
			url: `/wiki/personnages/${id}`,
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

	// Versions saga par saga (bot.db_character_variants) — chargées après la
	// fiche parce qu'elles en dépendent, et lues même quand la liste est vide :
	// une requête indexée sur (character_id, sort_order) coûte moins qu'un
	// aller-retour conditionnel de plus dans le rendu.
	// `access` : la frise est un composant client et ne peut pas lire la
	// configuration de lancement ; on la résout ici et on la lui passe.
	const [variants, access] = await Promise.all([
		getShenronCharacterVariants(character.id),
		getLaunchConfig().catch(() => null),
	]);

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

	// ── Catégories de la fiche ────────────────────────────────────────────────
	// Contenu = article long-format éclaté par titre `##` (Histoire, Personnalité,
	// Pouvoirs et techniques, Transformations, Anecdotes…) + surcharges/ajouts
	// éditoriaux du studio (db_wiki_sections, ex. PWS). Zéro fabrication : on ne
	// fait que structurer du contenu déjà présent, tout rendu côté serveur.
	const contentPanels = await buildWikiContentPanels({
		entityType: "character",
		entityId: character.id,
		article: character.article,
		description: character.description,
	});

	// Galeries relationnelles (vignettes de transformations, fiches techniques).
	// `withHeading=false` quand on les fusionne dans une catégorie de l'article
	// qui porte déjà son titre (évite un double bandeau).
	const transfoGrid = (withHeading: boolean): ReactNode => (
		<section className="space-y-8">
			{withHeading && (
				<div className="flex items-center gap-6">
					<h2 className="font-saiyan text-2xl sm:text-4xl md:text-5xl text-dbz-orange uppercase tracking-widest">
						TRANSFORMATIONS
					</h2>
					<div className="h-px flex-1 bg-gradient-to-r from-dbz-orange/50 to-transparent" />
				</div>
			)}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
				{character.transformations.map((transfo) => (
					<div
						key={transfo.id}
						className="dbz-panel p-4 flex flex-col items-center group hover:scale-105 transition-transform duration-300"
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
						{transfo.ki && <span className="scouter-text text-[10px] mt-2">KI: {transfo.ki}</span>}
					</div>
				))}
			</div>
		</section>
	);

	const techGrid = (withHeading: boolean): ReactNode => (
		<section className="space-y-8">
			{withHeading && (
				<div className="flex items-center gap-6">
					<h2 className="font-saiyan text-2xl sm:text-4xl md:text-5xl text-dbz-blue-light uppercase tracking-widest">
						TECHNIQUES & CAPACITÉS
					</h2>
					<div className="h-px flex-1 bg-gradient-to-r from-dbz-blue-light/50 to-transparent" />
				</div>
			)}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{character.techniques.map(({ technique: tech }) => (
					<div
						key={tech.id}
						className="dbz-panel p-6 hover:border-dbz-blue-light transition-all group"
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
							<GatedWrap
								href={`/wiki/techniques/${tech.slug}`}
								className="text-[10px] font-bold text-dbz-blue-light hover:text-white uppercase tracking-widest transition-colors"
							>
								Détails Technique →
							</GatedWrap>
						</div>
					</div>
				))}
			</div>
		</section>
	);

	// Assemble les pilules : catégories de contenu, puis fusion/ajout des galeries
	// relationnelles, puis Versions et Personnages affiliés.
	const panels: ReaderPanel[] = [...contentPanels];

	const mergeOrAppendGrid = (
		keys: Set<string>,
		has: boolean,
		render: (withHeading: boolean) => ReactNode,
		key: string,
		label: string,
		accent: SectionAccent
	) => {
		if (!has) return;
		const idx = panels.findIndex((p) => keys.has(p.key));
		if (idx >= 0) {
			panels[idx] = {
				...panels[idx],
				node: (
					<div className="space-y-12">
						{panels[idx].node}
						{render(false)}
					</div>
				),
			};
		} else {
			panels.push({ key, label, accent, node: render(true) });
		}
	};

	mergeOrAppendGrid(
		TRANSFO_SECTION_KEYS,
		character.transformations.length > 0,
		transfoGrid,
		"transformations",
		"Transformations",
		"purple"
	);
	mergeOrAppendGrid(
		TECH_SECTION_KEYS,
		character.techniques.length > 0,
		techGrid,
		"techniques",
		"Techniques",
		"blue"
	);

	// Placé AVANT « Versions & apparitions » : la frise des sagas parle du même
	// personnage à des époques différentes, l'autre catégorie parle d'autres
	// fiches (Xeno, futur, GT). Les inverser ferait lire la seconde comme la
	// suite de la première.
	if (variants.length > 0) {
		panels.push({
			key: "sagas",
			label: "Au fil des sagas",
			accent: "gold",
			node: (
				<CharacterSagaVariants
					variants={variants}
					characterName={character.name}
					characterImage={character.image}
					access={access}
				/>
			),
		});
	}

	if (character.versions.length > 0) {
		panels.push({
			key: "versions",
			label: "Versions",
			accent: "blue",
			node: (
				<WikiRelatedCharacters
					heading="Versions & apparitions"
					caption="Autres versions de ce personnage à travers les époques, les timelines et les jeux (GT, Xenoverse, Heroes…)."
					items={character.versions}
					accent="blue"
				/>
			),
		});
	}
	if (character.affiliates.length > 0) {
		panels.push({
			key: "affilies",
			label: "Personnages affiliés",
			accent: "cyan",
			node: (
				<WikiRelatedCharacters
					heading="Personnages affiliés"
					caption={
						character.affiliation
							? `Autres personnages liés à « ${character.affiliation} ».`
							: undefined
					}
					items={character.affiliates}
					accent="cyan"
				/>
			),
		});
	}

	return (
		<article
			data-entity={character.name}
			data-source-id="db_characters"
			data-lang="fr"
			className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24 space-y-12 reveal-up"
		>
			<JsonLd data={personSchema} />
			<TrackView entityType="character" entityId={character.id} entityName={character.name} />
			<Breadcrumbs
				className="mb-4"
				items={[{ label: "L'Univers", href: "/wiki/personnages" }, { label: character.name }]}
			/>
			<WikiEditBar
				sansArticle
				table="db_characters"
				id={character.id}
				indexHref="/wiki/personnages"
				label={character.name}
			/>

			<div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
				<div className="w-full lg:w-2/5 xl:w-1/3">
					<div className="dbz-panel p-6 border-2 border-dbz-orange/30 bg-dbz-card relative overflow-hidden group">
						{/* Cible du morph partagé : même `name` que le thumbnail de la grille
						    → l'image se déplie en continuité depuis la tuile cliquée.
						    WikiImg : repli sur le portrait XV2 puis placeholder si l'image 404. */}
						<ViewTransition name={`character-img-${character.id}`} share="morph">
							<WikiImg
								src={character.image}
								fallback={character.portraitXv2}
								alt={character.name}
								loading="eager"
								className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,178,0,0.3)] group-hover:scale-105 transition-transform duration-700"
								placeholderClassName="relative z-10 w-full aspect-[3/4] flex items-center justify-center bg-dbz-card overflow-hidden rounded"
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

					{(() => {
						// Les valeurs qui ne disent rien ne méritent pas une case. Sur les
						// fiches importées, `ki` vaut très souvent « ? », « ??? » ou « — » :
						// on affichait alors trois panneaux de 100 px de haut pour un point
						// d'interrogation, en tête de fiche, avant le moindre texte.
						const utile = (v?: string | null) => {
							const t = (v ?? "").trim();
							return t && !/^[?？\-—–.\s]+$/.test(t) ? t : null;
						};
						/**
						 * Une stat qui porte le nom d'une rubrique PWS est un DOUBLON :
						 * la fiche affichait « Vitesse : Super-lumineuse » en case, et
						 * juste en dessous les onglets « Vitesse de Combat » et « Vitesse
						 * de Déplacement » du groupe Powerscaling. Deux endroits pour la
						 * même notion, dont un qui n'a pas de place pour la nuancer.
						 * La rubrique PWS gagne : elle est éditable, sourçable et ouverte
						 * à la contribution, là où la case ne tient qu'un mot.
						 */
						const rubriquesPws = new Set(
							PWS_GROUP_PRESETS.flatMap((p) => [sectionSlug(p.label), p.key])
						);
						const doublonPws = (label: string) => {
							const slug = sectionSlug(label);
							if (rubriquesPws.has(slug)) return true;
							// « Vitesse » ↔ « Vitesse de Combat » : la case porte le terme
							// générique, la rubrique le précise. Le préfixe suffit à les
							// rapprocher, et l'inverse est vrai aussi.
							return [...rubriquesPws].some((r) => r.startsWith(slug) || slug.startsWith(r));
						};

						const cases: Array<{ label: string; value: string; accent: string }> = [];
						const ki = utile(character.ki);
						if (ki) cases.push({ label: "Ki", value: ki, accent: "text-dbz-orange" });
						const maxKi = utile(character.maxKi);
						if (maxKi) cases.push({ label: "Ki maximum", value: maxKi, accent: "text-dbz-red" });
						for (const st of character.stats ?? []) {
							const v = utile(st.value);
							const label = st.label || "Stat";
							if (!v || doublonPws(label)) continue;
							cases.push({ label, value: v, accent: "text-dbz-blue-light" });
						}
						if (cases.length === 0) return null;
						return (
							<dl
								// Cases compactes en ligne, et non une grille de panneaux : ce
								// sont des métadonnées, pas des sections. Elles se lisent d'un
								// balayage et laissent la place au contenu.
								className="reveal-up flex flex-wrap gap-x-8 gap-y-4 rounded-xl border border-white/[0.08] px-5 py-4"
								style={{ animationDelay: "0.3s" }}
							>
								{cases.map((c) => (
									<div key={`${c.label}-${c.value}`} className="min-w-0">
										<dt className="font-scouter text-[10px] uppercase tracking-[0.16em] text-white/45">
											{c.label}
										</dt>
										<dd className={`mt-0.5 font-scouter text-[15px] ${c.accent}`}>{c.value}</dd>
									</div>
								))}
								{/* Corriger là où l'on lit. Ces mesures sont un champ LIBRE :
								    un contributeur peut corriger une valeur, en ajouter une,
								    ou remplacer « Ki » par « Santé » — c'est un simple lien
								    rendu côté serveur, pas un îlot client de plus. */}
								<Link
									href={`/wiki/corriger?table=db_characters&row=${character.id}&col=stats`}
									className="ml-auto self-center text-[11px] text-white/30 transition-colors hover:text-dbz-orange"
								>
									Modifier ces mesures
								</Link>
							</dl>
						);
					})()}

					{character.originPlanet && (
						<GatedWrap
							href={`/wiki/cosmologie/${character.originPlanet.id}`}
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
								<p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em] mb-1">
									Planète d'Origine
								</p>
								<p className="text-2xl font-saiyan text-white group-hover:text-dbz-orange transition-colors uppercase tracking-widest">
									{character.originPlanet.name}
								</p>
							</div>
							<span className="text-dbz-orange opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
								→
							</span>
						</GatedWrap>
					)}
				</div>
			</div>

			{/* Sélecteur de catégories : Histoire / Personnalité / Pouvoirs et techniques /
			    Transformations / Anecdotes / PWS… — issu de l'article éclaté + du studio
			    (db_wiki_sections). Barre collante ; tout rendu côté serveur (SEO/ISR). */}
			<WikiSectionsReader panels={panels} />
			<WikiSources sources={character.articleSources} />
		</article>
	);
}
