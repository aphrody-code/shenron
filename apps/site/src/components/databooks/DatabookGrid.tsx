"use client";

/**
 * Grille des databooks & interviews : onglets par type (Tout / Databooks /
 * Interviews), tri par date (plus récent / plus ancien) et recherche. Interface
 * calquée sur la grille manga (cartes couverture `dbz-panel`).
 */
import { useMemo, useState } from "react";
import { ArrowDownUp, BookOpen, Mic, Search } from "lucide-react";

export interface DatabookItem {
	id: number;
	kind: string;
	title: string;
	titleJa: string | null;
	author: string | null;
	publishedAt: number | null;
	cover: string | null;
	description: string | null;
	sourceUrl: string | null;
}

const TABS = [
	{ key: "all", label: "Tout", icon: null },
	{ key: "databook", label: "Databooks", icon: BookOpen },
	{ key: "interview", label: "Interviews", icon: Mic },
] as const;

function formatDate(v: number | null): string {
	if (!v) return "—";
	// SmartField stocke les dates en SECONDES (ou ms si ≥13 chiffres) → on normalise.
	const ms = v >= 1e12 ? v : v * 1000;
	try {
		return new Date(ms).toLocaleDateString("fr-FR", { year: "numeric", month: "long" });
	} catch {
		return "—";
	}
}

export function DatabookGrid({ items }: { items: DatabookItem[] }) {
	const [tab, setTab] = useState<string>("all");
	const [q, setQ] = useState("");
	const [order, setOrder] = useState<"desc" | "asc">("desc");

	const filtered = useMemo(() => {
		const needle = q.trim().toLowerCase();
		return items
			.filter((d) => (tab === "all" ? true : d.kind === tab))
			.filter((d) => !needle || `${d.title} ${d.author ?? ""}`.toLowerCase().includes(needle))
			.slice()
			.sort((a, b) => {
				const av = a.publishedAt ?? 0;
				const bv = b.publishedAt ?? 0;
				return order === "desc" ? bv - av : av - bv;
			});
	}, [items, tab, q, order]);

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center gap-3">
				<div className="flex flex-wrap gap-2">
					{TABS.map((t) => {
						const Icon = t.icon;
						const active = tab === t.key;
						return (
							<button
								key={t.key}
								type="button"
								onClick={() => setTab(t.key)}
								className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
									active
										? "border-dbz-orange bg-dbz-orange/10 text-white"
										: "border-dbz-border text-white/60 hover:border-dbz-orange/40 hover:text-white"
								}`}
							>
								{Icon && <Icon className="h-3.5 w-3.5" />}
								{t.label}
							</button>
						);
					})}
				</div>
				<button
					type="button"
					onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
					className="inline-flex items-center gap-1.5 rounded-lg border border-dbz-border px-3 py-1.5 text-sm text-white/70 hover:border-dbz-orange/40 hover:text-white"
					title="Inverser le tri par date"
				>
					<ArrowDownUp className="h-3.5 w-3.5" />
					{order === "desc" ? "Plus récent" : "Plus ancien"}
				</button>
				<div className="relative ml-auto min-w-[200px] flex-1 sm:max-w-xs">
					<Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
					<input
						className="w-full rounded-lg border border-dbz-border bg-dbz-bg px-3 py-1.5 pl-8 text-sm text-white focus:border-dbz-orange focus:outline-none"
						placeholder="Rechercher…"
						value={q}
						onChange={(e) => setQ(e.target.value)}
					/>
				</div>
			</div>

			{filtered.length === 0 ? (
				<p className="py-12 text-center text-sm italic text-white/40">
					Aucun databook ni interview pour l&apos;instant.
				</p>
			) : (
				<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{filtered.map((d) => {
						const Card = d.sourceUrl ? "a" : "div";
						return (
							<Card
								key={d.id}
								{...(d.sourceUrl
									? { href: d.sourceUrl, target: "_blank", rel: "noreferrer" }
									: {})}
								className="dbz-panel group overflow-hidden transition-all duration-300 hover:scale-[1.03]"
							>
								<div className="relative aspect-[2/3] overflow-hidden bg-dbz-bg">
									{d.cover ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={d.cover}
											alt={d.title}
											loading="lazy"
											className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center text-white/20">
											<BookOpen className="h-10 w-10" />
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
									<span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-dbz-orange">
										{d.kind === "interview" ? "Interview" : "Databook"}
									</span>
									<div className="absolute inset-x-0 bottom-0 p-2.5">
										<p className="line-clamp-2 font-display text-sm font-bold leading-tight text-white group-hover:text-dbz-orange">
											{d.title}
										</p>
										<p className="mt-0.5 text-[10px] text-white/50">
											{formatDate(d.publishedAt)}
											{d.author ? ` · ${d.author}` : ""}
										</p>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
