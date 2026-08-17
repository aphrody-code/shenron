"use client";

/**
 * Grille des databooks & interviews.
 *
 * Filtres **unifiés** (même style de boutons) — un seul plan de catégories :
 *   Tout · Databook · Interview · Art Book · Guidebook · V-Jump · …
 *
 * Un seul filtre actif à la fois + tri date + recherche.
 */
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDownUp, BookOpen, Mic, Palette, BookMarked, Search } from "lucide-react";
import { ViewTransition } from "@/components/ViewTransition";
import { WikiImg } from "@/components/wiki/WikiImg";
import {
	DATABOOK_CATEGORIES,
	resolveDatabookCategory,
	type DatabookCategory,
} from "@/lib/databook-categories";

export interface DatabookItem {
	id: number;
	kind: string;
	/** Catégorie unifiée (Databook, Interview, Art Book, V-Jump…). Null → « Autre ». */
	category: string | null;
	title: string;
	titleJa: string | null;
	author: string | null;
	publishedAt: number | null;
	/** Chemin d'asset brut (résolu via WikiImg / assetUrl), pas une URL absolue. */
	cover: string | null;
	description: string | null;
	sourceUrl: string | null;
}

type FilterTab =
	| { key: "all"; label: string; mode: "all"; icon: null }
	| {
			key: DatabookCategory;
			label: string;
			mode: "category";
			icon: typeof BookOpen | typeof Mic | typeof Palette | typeof BookMarked | null;
	  };

const CATEGORY_ICONS: Partial<
	Record<DatabookCategory, typeof BookOpen | typeof Mic | typeof Palette | typeof BookMarked>
> = {
	Databook: BookOpen,
	Interview: Mic,
	"Art Book": Palette,
	Guidebook: BookMarked,
};

const FILTER_TABS: FilterTab[] = [
	{ key: "all", label: "Tout", mode: "all", icon: null },
	...DATABOOK_CATEGORIES.map(
		(c): FilterTab => ({
			key: c,
			label: c,
			mode: "category",
			icon: CATEGORY_ICONS[c] ?? null,
		})
	),
];

/**
 * Match filtre catégorie + legacy kind.
 * Si `category` est déjà une valeur canonique (≠ Autre), elle prime.
 * Sinon on retombe sur `kind` (données avant unification).
 */
function matchesCategory(d: DatabookItem, cat: DatabookCategory): boolean {
	const resolved = resolveDatabookCategory(d.category);
	if (resolved === cat) return true;
	// Legacy : category vide/Autre + kind type précis
	if (resolved !== "Autre") return false;
	const kind = (d.kind ?? "").toLowerCase();
	if (cat === "Interview" && kind === "interview") return true;
	if (cat === "Art Book" && (kind === "artbook" || kind === "art_book")) return true;
	if (cat === "Guidebook" && (kind === "guidebook" || kind === "guide_book")) return true;
	return false;
}

function formatDate(v: number | null): string {
	if (!v) return "—";
	const ms = v >= 1e12 ? v : v * 1000;
	try {
		return new Date(ms).toLocaleDateString("fr-FR", { year: "numeric", month: "long" });
	} catch {
		return "—";
	}
}

function norm(s: string): string {
	return s
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim();
}

const tabBtn =
	"inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors";
const tabActive = "border-dbz-orange bg-dbz-orange/10 text-white";
const tabIdle = "border-dbz-border text-white/60 hover:border-dbz-orange/40 hover:text-white";

export function DatabookGrid({ items }: { items: DatabookItem[] }) {
	const [filter, setFilter] = useState<string>("all");
	const [q, setQ] = useState("");
	const [order, setOrder] = useState<"desc" | "asc">("desc");

	const activeTab = FILTER_TABS.find((t) => t.key === filter) ?? FILTER_TABS[0]!;

	const filtered = useMemo(() => {
		const needle = norm(q);
		return items
			.filter((d) => {
				if (activeTab.mode === "all") return true;
				return matchesCategory(d, activeTab.key as DatabookCategory);
			})
			.filter((d) => {
				if (!needle) return true;
				const hay = norm(
					`${d.title} ${d.titleJa ?? ""} ${d.author ?? ""} ${resolveDatabookCategory(d.category)}`
				);
				return hay.includes(needle);
			})
			.slice()
			.sort((a, b) => {
				const av = a.publishedAt ?? 0;
				const bv = b.publishedAt ?? 0;
				return order === "desc" ? bv - av : av - bv;
			});
	}, [items, activeTab, q, order]);

	return (
		<div className="space-y-6">
			{/* Une seule rangée de filtres, tous au même plan (même taille / style). */}
			<div className="flex flex-wrap items-center gap-3">
				<div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
					{FILTER_TABS.map((t) => {
						const Icon = t.icon;
						const active = filter === t.key;
						return (
							<button
								key={t.key}
								type="button"
								onClick={() => setFilter(t.key)}
								aria-pressed={active}
								className={`${tabBtn} ${active ? tabActive : tabIdle}`}
							>
								{Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
								{t.label}
							</button>
						);
					})}
				</div>
				<button
					type="button"
					onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
					className={`${tabBtn} ${tabIdle}`}
					title="Inverser le tri par date"
				>
					<ArrowDownUp className="h-3.5 w-3.5" />
					{order === "desc" ? "Plus récent" : "Plus ancien"}
				</button>
				<div className="relative ml-auto min-w-[200px] flex-1 sm:max-w-xs">
					<Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
					<input
						className="w-full rounded-lg border border-dbz-border bg-dbz-bg px-3 py-1.5 pl-8 text-sm text-white focus:border-dbz-orange focus:outline-none"
						placeholder="Rechercher un guide, un auteur…"
						value={q}
						onChange={(e) => setQ(e.target.value)}
						aria-label="Rechercher un databook ou une interview"
					/>
				</div>
				<p className="w-full text-[11px] uppercase tracking-wider text-dbz-orange/80 sm:w-auto sm:ml-0">
					{filtered.length} / {items.length}
				</p>
			</div>

			{filtered.length === 0 ? (
				<p className="py-12 text-center text-sm italic text-white/40">
					{q.trim() ? `Aucun résultat pour « ${q.trim()} ».` : "Aucun résultat pour ce filtre."}
				</p>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
					{filtered.map((d) => {
						const cat = resolveDatabookCategory(d.category);
						const Icon = CATEGORY_ICONS[cat] ?? BookOpen;
						return (
							<Link
								key={d.id}
								href={`/wiki/databooks/${d.id}`}
								transitionTypes={["nav-forward"]}
								aria-label={`${cat} : ${d.title}`}
								className="dbz-panel group ki-card relative cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:border-dbz-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
							>
								<div className="relative aspect-[2/3] overflow-hidden bg-dbz-bg">
									<div className="pointer-events-none absolute inset-0 z-10 halftone opacity-10" />
									{d.cover ? (
										<ViewTransition name={`databook-img-${d.id}`} share="morph">
											<WikiImg
												src={d.cover}
												alt={d.title}
												className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
												loading="lazy"
											/>
										</ViewTransition>
									) : (
										<div className="absolute inset-0 flex items-center justify-center text-white/20">
											<Icon className="h-10 w-10" />
										</div>
									)}
									<div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/25 to-transparent" />
									<span aria-hidden className="ki-card__glow" />
									{/* Un seul badge : la catégorie unifiée */}
									<span className="absolute left-2 top-2 z-30 max-w-[85%] truncate rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-dbz-orange">
										{cat}
									</span>
									<div className="absolute inset-x-0 bottom-0 z-30 p-2.5">
										<p className="line-clamp-2 font-display text-sm font-bold leading-tight text-white transition-colors group-hover:text-dbz-orange">
											{d.title}
										</p>
										{d.titleJa && (
											<p
												className="mt-0.5 line-clamp-1 text-[10px] tracking-wider text-dbz-yellow/70"
												style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
											>
												{d.titleJa}
											</p>
										)}
										<p className="mt-0.5 text-[10px] text-white/50">
											{formatDate(d.publishedAt)}
											{d.author ? ` · ${d.author}` : ""}
										</p>
										<p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-dbz-orange/0 transition-colors group-hover:text-dbz-orange">
											Voir la fiche →
										</p>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
