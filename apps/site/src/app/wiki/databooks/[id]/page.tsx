import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, ExternalLink, Mic } from "lucide-react";
import { DatabookReader } from "@/components/databooks/DatabookReader";
import { ViewTransition } from "@/components/ViewTransition";
import { WikiAdminBar } from "@/components/wiki/WikiAdminBar";
import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { resolveDatabookCategory } from "@/lib/databook-categories";
import { assetUrl, dbUniverse } from "@/lib/db-universe";
import { ogMeta } from "@/lib/og";

export const revalidate = 3600;

function formatDate(v: number | null): string {
	if (!v) return "—";
	const ms = v >= 1e12 ? v : v * 1000;
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
	const book = await dbUniverse.databook(parseInt(id, 10));
	if (!book) return { title: "Databook introuvable" };
	const description = book.description
		? plainText(book.description)
		: `${book.title} — guide officiel Dragon Ball sur DBFR.`;
	const cover = book.cover ? assetUrl(book.cover) : undefined;
	return {
		title: `${book.title} — Databooks DBFR`,
		description,
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
	const book = await dbUniverse.databook(parseInt(id, 10));
	if (!book) notFound();

	const category = resolveDatabookCategory(book.category);
	const isInterview = book.kind === "interview" || category === "Interview";
	const cover = book.cover ? assetUrl(book.cover) : null;
	// Pages avec au moins une image ou un texte (les slots vides restent admin-only).
	const filledPages = book.pages.filter(
		(p) => (p.image && p.image.trim()) || (p.text && p.text.trim())
	);
	const hasPages = filledPages.length > 0;

	return (
		<div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<Link
				href="/wiki/databooks"
				transitionTypes={["nav-back"]}
				className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-4 link-underline"
			>
				<span>← Retour aux databooks</span>
			</Link>

			<div className="mb-10">
				<WikiAdminBar
					table="db_databooks"
					id={book.id}
					indexHref="/wiki/databooks"
					label={book.title}
				/>
			</div>

			<div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
				<div className="w-full lg:w-1/3 xl:w-1/4 shrink-0">
					<div className="dbz-panel group relative overflow-hidden border-2 border-dbz-orange/30 bg-dbz-card p-4">
						<div className="absolute inset-0 halftone opacity-20" />
						{cover ? (
							// Morph partagé avec la carte de la grille (view transition).
							<ViewTransition name={`databook-img-${book.id}`} share="morph">
								<img
									src={cover}
									alt={book.title}
									className="relative z-10 h-auto w-full object-contain drop-shadow-[0_0_15px_rgba(255,178,0,0.3)]"
								/>
							</ViewTransition>
						) : (
							<div className="relative z-10 flex aspect-[2/3] items-center justify-center bg-zinc-900">
								{isInterview ? (
									<Mic className="h-16 w-16 text-white/20" />
								) : (
									<BookOpen className="h-16 w-16 text-white/20" />
								)}
							</div>
						)}
					</div>

					<div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-xs font-display">
						<div className="flex justify-between gap-4">
							<span className="text-white/40">Catégorie</span>
							<span className="font-bold tracking-wide text-dbz-orange">{category}</span>
						</div>
						{book.published_at && (
							<div className="flex justify-between gap-4">
								<span className="text-white/40">Publication</span>
								<span className="font-bold text-white">{formatDate(book.published_at)}</span>
							</div>
						)}
						{book.author && (
							<div className="flex justify-between gap-4">
								<span className="text-white/40">Auteur</span>
								<span className="font-bold text-white text-right">{book.author}</span>
							</div>
						)}
						{hasPages && (
							<div className="flex justify-between gap-4">
								<span className="text-white/40">Pages</span>
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
								<ExternalLink className="h-3.5 w-3.5" />
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
						<h1 className="font-saiyan text-4xl uppercase leading-none tracking-wider text-white sm:text-5xl md:text-6xl">
							{book.title}
						</h1>
						{book.title_ja && (
							<p
								className="mt-3 text-xl font-bold tracking-widest text-dbz-yellow/90"
								style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
							>
								{book.title_ja}
							</p>
						)}
					</div>

					{book.description?.trim() ? (
						<div className="dbz-panel prose prose-invert wiki-content max-w-none p-6 sm:p-8">
							<WikiMarkdown body={book.description} />
						</div>
					) : !hasPages ? (
						<div className="dbz-panel p-8 text-center text-sm italic text-white/40">
							Aucune description pour l&apos;instant — le contenu sera ajouté prochainement.
						</div>
					) : null}
				</div>
			</div>

			{/* Lecteur planche par planche (image + texte sous chaque page).
			    Hors du layout 2 colonnes pour maximiser la largeur utile et
			    éviter que le chrome/nav masque le haut des scans. */}
			{hasPages && (
				<section className="mt-16 space-y-4" aria-label="Lecteur de pages">
					<div className="flex items-end justify-between gap-4 border-b border-dbz-border/50 pb-3">
						<h2 className="font-saiyan text-2xl uppercase tracking-wider text-dbz-yellow sm:text-3xl">
							Pages
						</h2>
						<span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
							Planche + description
						</span>
					</div>
					{/* On passe les pages brutes (slots vides filtrés dans le reader)
					    pour conserver les numéros éditoriaux exacts. */}
					<DatabookReader pages={book.pages} title={book.title} />
				</section>
			)}
		</div>
	);
}
