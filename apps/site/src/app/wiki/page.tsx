import Link from "next/link";
import { GatedWrap } from "@/components/GatedLink";
import { getShenronCharacterCards, getShenronMovies } from "@/lib/shenron";
import { dbUniverse } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { StreamRow } from "@/components/stream/StreamRow";
import { PosterCard } from "@/components/stream/PosterCard";
import { EpisodeCard } from "@/components/stream/EpisodeCard";
import { CharacterPosterCard } from "@/components/wiki/CharacterPosterCard";
import { RepriseLecture } from "@/components/wiki/RepriseLecture";
import { WIKI_CATEGORIES } from "@/lib/wiki-categories";
import { getLaunchConfig } from "@/lib/wiki-launch-config";
import { isPathPublic } from "@/lib/wiki-launch";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "L'univers Dragon Ball",
	description:
		"Le sommaire de l'encyclopédie : personnages, sagas, planètes, races, techniques, films, épisodes, manga et databooks.",
	alternates: { canonical: "/wiki" },
};

const nf = new Intl.NumberFormat("fr-FR");

/**
 * Sommaire de l'encyclopédie.
 *
 * Réécrit avec les composants du site (`PageHero`, `StreamRow`, `PosterCard`,
 * `EpisodeCard`) au lieu du balisage recopié à la main : la page réimplémentait
 * une carte affiche, une carte épisode et une carte portrait déjà écrites
 * ailleurs, chacune avec ses propres tailles et ses propres replis d'image.
 *
 * Elle portait aussi **onze couleurs de rubrique** (orange, bleu, rouge, jaune,
 * blanc, vert, violet…), un titre en dégradé sur trois teintes et un kanji en
 * filigrane par carte. Sur le support officiel, la couleur occupe 13 à 17 % de
 * la page et sert un seul accent (cf. DESIGN.md, « Analyse du support
 * officiel ») : les rubriques se distinguent maintenant par leur nom et leur
 * volume, pas par un code couleur que personne n'apprend.
 */
export default async function WikiIndex() {
	const [characters, movies, episodesData, counts, access] = await Promise.all([
		getShenronCharacterCards(),
		getShenronMovies(),
		dbUniverse.episodes("DBZ", 12, 0),
		dbUniverse.counts(),
		getLaunchConfig(),
	]);

	const c = (counts ?? {}) as Record<string, number>;
	const total = Object.entries(c)
		.filter(([k]) => k !== "news" && k !== "tools")
		.reduce((n, [, v]) => n + (v ?? 0), 0);

	// Rubriques dans l'ordre du registre partagé — la même liste que la barre de
	// navigation, donc jamais de rubrique visible d'un côté et absente de l'autre.
	// `seeAllHref` d'un rail est un lien comme un autre : il doit disparaître si
	// la rubrique est fermée, sinon le sommaire promet une page qui répond 307.
	// On résout le gating ici (`isPathPublic`), la page étant déjà serveur.
	const ouvert = (href: string) => isPathPublic(href, access);

	const rubriques = WIKI_CATEGORIES.map((cat) => ({
		...cat,
		count: c[cat.countKey] ?? 0,
	}));
	const encyclopedie = rubriques.filter((r) => r.group === "encyclopedia");
	const supports = rubriques.filter((r) => r.group === "media");

	const vedettes = characters.filter((ch) => ch.image).slice(0, 18);
	const films = movies.slice(0, 18);
	const episodes = episodesData?.episodes.slice(0, 12) ?? [];

	return (
		<div>
			<PageHero
				eyebrow="Encyclopédie"
				title="L'univers Dragon Ball"
				lead={`${nf.format(total)} entrées écrites sur les tomes du manga et les planches des databooks — personnages, mondes, récits et supports.`}
			/>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-14 lg:py-20 space-y-16">
				{/* Avant les rubriques : quelqu'un qui revient cherche d'abord où il
				    s'était arrêté. L'îlot ne rend rien s'il n'a rien à proposer. */}
				<RepriseLecture />
				<Rubriques titre="L'univers" items={encyclopedie} />
				<Rubriques titre="Les supports" items={supports} />

				{vedettes.length > 0 && (
					<StreamRow title="Personnages" count={c.characters} seeAllHref={ouvert("/wiki/personnages") ? "/wiki/personnages" : undefined}>
						{vedettes.map((ch) => (
							<CharacterPosterCard
								key={ch.id}
								href={`/wiki/personnages/${ch.id}`}
								name={ch.name}
								race={ch.race}
								image={ch.image}
							/>
						))}
					</StreamRow>
				)}

				{films.length > 0 && (
					<StreamRow title="Films" count={c.movies} seeAllHref={ouvert("/wiki/films") ? "/wiki/films" : undefined}>
						{films.map((m) => (
							<PosterCard
								key={m.id}
								href={`/wiki/films/${m.slug}`}
								title={m.title}
								poster={m.poster}
								badge="Film"
							/>
						))}
					</StreamRow>
				)}

				{episodes.length > 0 && (
					<StreamRow title="Épisodes" count={c.episodes} seeAllHref={ouvert("/wiki/episodes") ? "/wiki/episodes" : undefined}>
						{episodes.map((ep) => (
							<EpisodeCard
								key={ep.id}
								href={`/wiki/episodes/${ep.id}`}
								number={ep.number_in_series}
								title={ep.title}
								image={ep.image}
							/>
						))}
					</StreamRow>
				)}

				<section className="rounded-xl border border-white/[0.08] p-8 lg:p-10">
					<h2 className="font-serif text-[26px] font-semibold tracking-tight text-white">
						Ce wiki n'est pas fini
					</h2>
					<p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
						Il est écrit sur les tomes du manga et les planches des databooks, jamais recopié
						d'ailleurs. Chaque fiche porte un bouton «&nbsp;Proposer une correction&nbsp;» : vous
						modifiez le texte, un relecteur publie, la modification garde votre nom.
					</p>
					<Link
						href="/wiki/contribuer"
						className="mt-6 inline-flex h-11 items-center rounded-full border border-white/15 px-6 font-display text-[14px] font-semibold text-white transition-colors hover:border-dbz-orange/60 hover:text-dbz-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
					>
						Contribuer au wiki
					</Link>
				</section>
			</div>
		</div>
	);
}

/** Grille de rubriques : nom, volume mesuré, rien d'autre. */
function Rubriques({
	titre,
	items,
}: {
	titre: string;
	items: Array<{ key: string; label: string; href: string; count: number }>;
}) {
	if (items.length === 0) return null;
	return (
		<section>
			<h2 className="mb-5 font-scouter text-[11px] uppercase tracking-[0.18em] text-white/45">
				{titre}
			</h2>
			{/* `gap-px` sur un fond clair dessine les filets de séparation. Les
			    cellules manquantes de la dernière ligne doivent donc être comblées :
			    sans elles, la grille laissait deux rectangles gris flottants. */}
			<div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/[0.08] sm:grid-cols-3 lg:grid-cols-4">
				{items.map((r) => (
					<GatedWrap
						key={r.key}
						href={r.href}
						className="group flex items-baseline justify-between gap-3 bg-dbz-bg px-5 py-4 transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dbz-orange/60"
					>
						<span className="font-display text-[15px] font-semibold text-white/90 transition-colors group-hover:text-dbz-orange">
							{r.label}
						</span>
						{r.count > 0 && (
							<span className="font-scouter text-[11px] tabular-nums text-white/40">
								{nf.format(r.count)}
							</span>
						)}
					</GatedWrap>
				))}
				{Array.from({ length: (4 - (items.length % 4)) % 4 }).map((_, i) => (
					<span key={`vide-${i}`} aria-hidden className="hidden bg-dbz-bg lg:block" />
				))}
			</div>
		</section>
	);
}
