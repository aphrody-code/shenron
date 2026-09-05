import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LienExterne, Livre, Micro } from "@/components/icones";
import { DatabookReader } from "@/components/databooks/DatabookReader";
import { ViewTransition } from "@/components/ViewTransition";
import { WikiEditBar } from "@/components/wiki/WikiEditBar";
import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { resolveDatabookCategory } from "@/lib/databook-categories";
import { assetUrl, dbUniverse } from "@/lib/db-universe";
import { ogMeta } from "@/lib/og";
import { JsonLd } from "@/components/JsonLd";
import { isDatabookIndexable, parseDatabookId } from "@/lib/databooks-rules";
import { toMillis, yearOf } from "@/lib/epoch";

export const revalidate = 3600;

function formatDate(v: number | null): string {
	if (!v) return "—";
	const ms = toMillis(v);
	try {
		return new Date(ms).toLocaleDateString("fr-FR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch {
		return "—";
	}
}

/**
 * Description de repli, composée à partir des données réelles de la fiche.
 *
 * 272 des 318 databooks n'ont pas de description rédigée. Le repli était une
 * seule phrase gabarit — donc **272 méta-descriptions identiques**, exactement ce
 * qu'un moteur traite comme du contenu dupliqué. Ici, catégorie, auteur, année et
 * nombre de planches produisent une phrase différente par ouvrage, à partir de
 * faits vérifiés plutôt que d'un texte inventé.
 */
function descriptionDeRepli(book: {
	title: string;
	title_ja: string | null;
	author: string | null;
	published_at: number | null;
	category: string | null;
	kind: string;
	pages: { image: string | null }[];
}): string {
	const nature =
		book.kind === "interview"
			? "Interview"
			: book.kind === "artbook"
				? "Artbook"
				: (book.category ?? "Guide officiel");
	const bouts: string[] = [`${nature} Dragon Ball : ${book.title}`];
	if (book.title_ja) bouts.push(book.title_ja);
	const meta: string[] = [];
	if (book.author) meta.push(book.author);
	const annee = yearOf(book.published_at);
	if (annee !== null) meta.push(String(annee));
	const planches = book.pages.filter((p) => p.image).length;
	if (planches > 0) meta.push(`${planches} planche${planches > 1 ? "s" : ""} consultables`);
	if (meta.length) bouts.push(meta.join(" · "));
	return `${bouts.join(" — ")}.`;
}

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

export async function generateStaticParams() {
	const data = await dbUniverse.databooks();
	return (data?.items ?? []).map((d) => ({ id: String(d.id) }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const n = parseDatabookId(id);
	const book = n === null ? null : await dbUniverse.databook(n);
	if (!book) return { title: "Databook introuvable", robots: { index: false, follow: true } };
	const description = book.description ? plainText(book.description) : descriptionDeRepli(book);
	const cover = book.cover ? assetUrl(book.cover) : undefined;
	return {
		title: `${book.title} — Databooks`,
		description,
		// Fiche sans planche ni description : navigable, mais hors index tant
		// qu'elle n'a rien à montrer (cf. `isDatabookIndexable`). La règle se
		// répare seule dès qu'une transcription arrive.
		...(isDatabookIndexable(book) ? {} : { robots: { index: false, follow: true } }),
		...ogMeta({
			title: book.title,
			description,
			image: cover,
			canonical: `/wiki/databooks/${id}`,
		}),
	};
}

export default async function DatabookDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const n = parseDatabookId(id);
	const book = n === null ? null : await dbUniverse.databook(n);
	if (!book) notFound();

	const category = resolveDatabookCategory(book.category);
	const isInterview = book.kind === "interview" || category === "Interview";
	const cover = book.cover ? assetUrl(book.cover) : null;
	// Pages avec au moins une image ou un texte (les slots vides restent admin-only).
	const filledPages = book.pages.filter(
		(p) => (p.image && p.image.trim()) || (p.text && p.text.trim())
	);
	const hasPages = filledPages.length > 0;

	// Charge initiale du lecteur. Mesuré le 2026-08-31 avant ce découpage :
	// `/wiki/databooks/4` (Daizenshuu 7, 313 planches) pesait 459 Ko, dont
	// 412 Ko de charge RSC — l'essentiel étant 281 197 signes de japonais que
	// le visiteur ne verra jamais, puisqu'il lit une planche à la fois. On
	// n'envoie que les premières ; `aDuTexte` dit au lecteur qu'une
	// transcription existe pour les autres, sans la transporter.
	const TEXTES_EMBARQUES = 4;
	const pagesDuLecteur = book.pages.map((p, i) => ({
		number: p.number,
		image: p.image,
		text: i < TEXTES_EMBARQUES ? p.text : null,
		aDuTexte: Boolean(p.text && p.text.trim()),
		// Booléen, donc négligeable dans la charge RSC — contrairement aux
		// transcriptions, qu'on ne transporte plus qu'à la demande.
		verifiee: p.verifiee === true,
	}));

	// Balisage de la fiche. Les 318 databooks n'avaient AUCUN JSON-LD alors que
	// tous les autres types du wiki en ont un : ni type d'entité, ni auteur, ni
	// date pour les moteurs. Une interview est un `Article`, un artbook ou un
	// guide est un `Book`.
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": isInterview ? "Article" : "Book",
		name: book.title,
		headline: book.title,
		alternateName: book.title_ja ?? undefined,
		inLanguage: "fr",
		image: book.cover ? assetUrl(book.cover) : undefined,
		description: book.description ? plainText(book.description, 300) : undefined,
		author: book.author ? { "@type": "Person", name: book.author } : undefined,
		datePublished: book.published_at
			? new Date(toMillis(book.published_at)).toISOString().split("T")[0]
			: undefined,
		// `numberOfPages` n'a de sens que pour un ouvrage réellement paginé.
		// Les planches RÉELLEMENT présentes, pas les emplacements : un ouvrage
		// peut porter des slots créés au studio avant numérisation, et annoncer
		// à Google plus de pages que la fiche n'en montre.
		...(isInterview ? {} : { numberOfPages: filledPages.length || undefined }),
		isBasedOn: book.source_url ?? undefined,
	};

	// `min-w-0` sur le conteneur : c'est un élément flex de `main` (colonne).
	// Sans lui il garde `min-width: auto`, donc la largeur MIN-CONTENT de ses
	// enfants — et le lecteur en mode paginé (carrousel Swiper) la fait exploser.
	// Mesuré sur mobile 390 px : la page passait à 1 200 px de large et défilait
	// horizontalement dès qu'on basculait en mode paginé.
	return (
		<div className="w-full mx-auto min-w-0 max-w-[1200px] px-4 py-10 sm:px-6 sm:py-16 lg:px-10 lg:py-24">
			<JsonLd data={jsonLd as never} />
			<Breadcrumbs
				className="mb-4"
				items={[{ label: "Databooks", href: "/wiki/databooks" }, { label: book.title }]}
			/>

			<div className="mb-10">
				<WikiEditBar
					table="db_databooks"
					id={book.id}
					indexHref="/wiki/databooks"
					label={book.title}
				/>
			</div>

			<div className="flex flex-col gap-8 sm:gap-12 lg:flex-row lg:gap-20">
				{/* Couverture : plein cadre sur mobile mais bornée en hauteur, sinon un
				    scan portrait pousse le titre et la description sous la ligne de
				    flottaison — deux écrans de défilement avant le moindre texte. */}
				<div className="w-full shrink-0 lg:w-1/3 xl:w-1/4">
					<div className="dbz-panel group relative overflow-hidden border-2 border-dbz-orange/30 bg-dbz-card p-4">
						<div className="absolute inset-0 halftone opacity-20" />
						{cover ? (
							// Morph partagé avec la carte de la grille (view transition).
							<ViewTransition name={`databook-img-${book.id}`} share="morph">
								<img
									src={cover}
									alt={book.title}
									className="relative z-10 mx-auto h-auto max-h-[48vh] w-full object-contain drop-shadow-[0_0_15px_rgba(255,178,0,0.3)] lg:max-h-none"
								/>
							</ViewTransition>
						) : (
							<div className="relative z-10 flex aspect-[2/3] items-center justify-center bg-zinc-900">
								{isInterview ? (
									<Micro className="h-16 w-16 text-white/20" />
								) : (
									<Livre className="h-16 w-16 text-white/20" />
								)}
							</div>
						)}
					</div>

					<div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-xs font-display">
						<div className="flex justify-between gap-4">
							<span className="text-white/50">Catégorie</span>
							<span className="font-bold tracking-wide text-dbz-orange">{category}</span>
						</div>
						{book.published_at && (
							<div className="flex justify-between gap-4">
								<span className="text-white/50">Publication</span>
								<span className="font-bold text-white">{formatDate(book.published_at)}</span>
							</div>
						)}
						{book.author && (
							<div className="flex justify-between gap-4">
								<span className="text-white/50">Auteur</span>
								<span className="font-bold text-white text-right">{book.author}</span>
							</div>
						)}
						{hasPages && (
							<div className="flex justify-between gap-4">
								<span className="text-white/50">Pages</span>
								<span className="font-bold text-white">{filledPages.length}</span>
							</div>
						)}
						{book.source_url && (
							<a
								href={book.source_url}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dbz-orange/40 bg-dbz-orange/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-dbz-orange transition-colors hover:bg-dbz-orange/20"
							>
								<LienExterne className="h-3.5 w-3.5" />
								Source officielle
							</a>
						)}
					</div>
				</div>

				<div className="min-w-0 flex-1 space-y-8">
					<div>
						<span className="mb-3 inline-block rounded bg-dbz-orange/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-dbz-orange">
							{isInterview ? "Interview" : "Databook"}
						</span>
						<h1 className="font-saiyan text-[clamp(1.75rem,7vw,2.25rem)] uppercase leading-none tracking-wider text-white [overflow-wrap:anywhere] sm:text-5xl md:text-6xl">
							{book.title}
						</h1>
						{book.title_ja && (
							<p
								className="mt-3 text-lg font-bold tracking-widest text-dbz-yellow/90 [overflow-wrap:anywhere] sm:text-xl"
								style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
							>
								{book.title_ja}
							</p>
						)}
					</div>

					{book.description?.trim() ? (
						<div className="dbz-panel prose prose-invert wiki-content max-w-none p-4 sm:p-8">
							<WikiMarkdown body={book.description} />
						</div>
					) : !hasPages ? (
						<div className="dbz-panel p-8 text-center text-sm italic text-white/50">
							Aucune description pour l&apos;instant — le contenu sera ajouté prochainement.
						</div>
					) : null}
				</div>
			</div>

			{/* Lecteur planche par planche (image + texte sous chaque page).
			    Hors du layout 2 colonnes pour maximiser la largeur utile et
			    éviter que le chrome/nav masque le haut des scans. */}
			{hasPages && (
				<section className="mt-10 min-w-0 space-y-4 sm:mt-16" aria-label="Lecteur de pages">
					<div className="flex items-end justify-between gap-4 border-b border-dbz-border/50 pb-3">
						<h2 className="font-saiyan text-2xl uppercase tracking-wider text-dbz-yellow sm:text-3xl">
							Pages
						</h2>
						<span className="hidden text-[11px] font-bold uppercase tracking-widest text-white/50 sm:inline">
							Planche + description
						</span>
					</div>
					{/* Les numéros éditoriaux exacts sont conservés (les slots vides
					    sont filtrés dans le reader), mais la transcription n'est
					    embarquée que pour les premières planches : le reste arrive
					    de `/api/databooks/:id/textes` au fil de la lecture. */}
					<DatabookReader pages={pagesDuLecteur} title={book.title} bookId={book.id} />
				</section>
			)}
		</div>
	);
}
