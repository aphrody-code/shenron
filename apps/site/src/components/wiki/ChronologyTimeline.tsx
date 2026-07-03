"use client";

/**
 * ChronologyTimeline — frise **publique et FIXE** de la chronologie universelle.
 *
 * L'ordre officiel est décidé par l'admin (`/admin/chronologie` → `applyChronology`
 * côté serveur) : ce composant reçoit la liste DÉJÀ résolue et ordonnée. Il ne
 * propose que des aides de lecture (filtre par ère, recherche, bascule épisodes/
 * films, tri alternatif diffusion/titre, export de la liste officielle). Aucune
 * composition personnelle — l'édition vit exclusivement côté admin.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Film, Tv, Search, Copy, Check, Download } from "lucide-react";
import { assetUrl } from "@/lib/assets";
import {
	ERA_ORDER,
	ERA_LABELS,
	ERA_ACCENT,
	SORT_LABELS,
	compareTimeline,
	toJSONExport,
	toCSVExport,
	toMarkdownExport,
	timelineKey,
	type Era,
	type SortMode,
	type ResolvedTimelineItem,
} from "@/lib/chronology";

const yearOf = (sec: number | null) => (sec ? new Date(sec * 1000).getFullYear() : null);

const SORTS: SortMode[] = ["era", "date", "title"];

export function ChronologyTimeline({ items }: { items: ResolvedTimelineItem[] }) {
	const [eras, setEras] = useState<Set<Era>>(() => new Set(ERA_ORDER));
	const [showEpisodes, setShowEpisodes] = useState(true);
	const [showMovies, setShowMovies] = useState(true);
	const [q, setQ] = useState("");
	const [sort, setSort] = useState<SortMode>("era");
	const [copied, setCopied] = useState(false);

	// Comptes par ère (dataset complet, pour les puces de filtre).
	const eraCounts = useMemo(() => {
		const m = new Map<Era, number>();
		for (const it of items) m.set(it.era, (m.get(it.era) ?? 0) + 1);
		return m;
	}, [items]);

	const filtered = useMemo(() => {
		const needle = q.trim().toLowerCase();
		const list = items.filter((it) => {
			if (!eras.has(it.era)) return false;
			if (it.kind === "episode" && !showEpisodes) return false;
			if (it.kind === "movie" && !showMovies) return false;
			if (needle) {
				const hay = `${it.title} ${it.titleJa ?? ""} ${it.series}`.toLowerCase();
				if (!hay.includes(needle)) return false;
			}
			return true;
		});
		// « era » = ordre officiel fourni (déjà résolu côté serveur) → on ne re-trie
		// PAS. Les autres modes sont des vues alternatives calculées à la volée.
		return sort === "era" ? list : [...list].sort(compareTimeline(sort));
	}, [items, eras, showEpisodes, showMovies, q, sort]);

	const totalEpisodes = useMemo(() => items.filter((i) => i.kind === "episode").length, [items]);
	const totalMovies = items.length - totalEpisodes;

	function toggleEra(e: Era) {
		setEras((prev) => {
			const n = new Set(prev);
			if (n.has(e)) n.delete(e);
			else n.add(e);
			return n;
		});
	}
	const allEras = () => setEras(new Set(ERA_ORDER));
	const noneEras = () => setEras(new Set());

	function triggerDownload(filename: string, content: string, mime: string) {
		const blob = new Blob([content], { type: mime });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}
	const doExport = (fmt: "json" | "csv" | "md") => {
		if (filtered.length === 0) return;
		const map = {
			json: { fn: toJSONExport, mime: "application/json", ext: "json" },
			csv: { fn: toCSVExport, mime: "text/csv;charset=utf-8", ext: "csv" },
			md: { fn: toMarkdownExport, mime: "text/markdown;charset=utf-8", ext: "md" },
		} as const;
		const { fn, mime, ext } = map[fmt];
		triggerDownload(`chronologie-dragon-ball.${ext}`, fn(filtered), mime);
	};
	async function doCopy() {
		if (filtered.length === 0) return;
		try {
			await navigator.clipboard.writeText(toMarkdownExport(filtered));
			setCopied(true);
			setTimeout(() => setCopied(false), 1600);
		} catch {
			/* clipboard indispo */
		}
	}

	// Rendu : groupé par ère (tri officiel) ou plat (date/titre).
	const rows: React.ReactNode[] = [];
	let lastEra: Era | null = null;
	for (const it of filtered) {
		if (sort === "era" && it.era !== lastEra) {
			lastEra = it.era;
			const c = filtered.filter((x) => x.era === it.era);
			const ep = c.filter((x) => x.kind === "episode").length;
			rows.push(<EraHeader key={`h:${it.era}`} era={it.era} episodes={ep} movies={c.length - ep} />);
		}
		rows.push(<Row key={timelineKey(it)} it={it} grouped={sort === "era"} />);
	}

	return (
		<div className="space-y-6">
			{/* Barre de contrôle */}
			<div className="dbz-panel p-4 sm:p-5 space-y-4">
				{/* Ères */}
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-[11px] font-display font-semibold uppercase tracking-[0.14em] text-white/40 mr-1">
						Ères
					</span>
					{ERA_ORDER.filter((e) => (eraCounts.get(e) ?? 0) > 0).map((e) => {
						const on = eras.has(e);
						return (
							<button
								key={e}
								type="button"
								onClick={() => toggleEra(e)}
								className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-display font-semibold transition-all ${
									on ? "text-black" : "text-white/60 bg-white/5 hover:bg-white/10"
								}`}
								style={on ? { backgroundColor: ERA_ACCENT[e] } : undefined}
							>
								<span
									className="h-2 w-2 rounded-full"
									style={{ backgroundColor: on ? "rgba(0,0,0,0.55)" : ERA_ACCENT[e] }}
								/>
								{ERA_LABELS[e]}
								<span className={on ? "text-black/60" : "text-white/30"}>{eraCounts.get(e)}</span>
							</button>
						);
					})}
					<button
						type="button"
						onClick={eras.size === ERA_ORDER.length ? noneEras : allEras}
						className="ml-auto text-[11px] text-white/40 hover:text-dbz-orange transition-colors"
					>
						{eras.size === ERA_ORDER.length ? "Tout décocher" : "Tout cocher"}
					</button>
				</div>

				{/* Type + recherche + tri */}
				<div className="flex flex-wrap items-center gap-3">
					<div className="flex rounded-lg border border-dbz-border overflow-hidden">
						<TypeToggle
							icon={<Tv className="h-3.5 w-3.5" />}
							label={`Épisodes ${totalEpisodes}`}
							on={showEpisodes}
							onClick={() => setShowEpisodes((v) => !v)}
						/>
						<TypeToggle
							icon={<Film className="h-3.5 w-3.5" />}
							label={`Films ${totalMovies}`}
							on={showMovies}
							onClick={() => setShowMovies((v) => !v)}
						/>
					</div>

					<div className="relative flex-1 min-w-[180px]">
						<Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
						<input
							type="search"
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="Rechercher un titre…"
							className="w-full h-9 pl-9 pr-3 rounded-lg bg-dbz-bg/70 border border-dbz-border focus:border-dbz-orange outline-none text-[13px] text-white placeholder:text-white/35"
						/>
					</div>

					<label className="flex items-center gap-2 text-[12px] text-white/50">
						Vue
						<select
							value={sort}
							onChange={(e) => setSort(e.target.value as SortMode)}
							className="h-9 rounded-lg bg-dbz-bg/70 border border-dbz-border px-2 text-[13px] text-white outline-none focus:border-dbz-orange"
						>
							{SORTS.map((s) => (
								<option key={s} value={s} className="bg-dbz-card">
									{SORT_LABELS[s]}
								</option>
							))}
						</select>
					</label>
				</div>

				{/* Export de la vue courante */}
				<div className="flex flex-wrap items-center gap-2 border-t border-dbz-border pt-3">
					<span className="text-[12px] text-white/50">
						<strong className="text-white">{filtered.length}</strong> entrée
						{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}
					</span>
					<span className="text-white/20">·</span>
					<span className="text-[11px] text-white/40">Exporter :</span>
					<ExportBtn label="JSON" onClick={() => doExport("json")} />
					<ExportBtn label="CSV" onClick={() => doExport("csv")} />
					<ExportBtn label="Markdown" onClick={() => doExport("md")} />
					<ExportBtn
						label={copied ? "Copié !" : "Copier"}
						icon={copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
						onClick={doCopy}
					/>
				</div>
			</div>

			{/* Frise */}
			{filtered.length === 0 ? (
				<p className="dbz-panel py-12 text-center text-white/40">
					Aucune entrée ne correspond aux filtres.
				</p>
			) : (
				<div className="space-y-1.5">{rows}</div>
			)}

			<p className="text-[11px] text-white/30 text-center pt-2">
				Chronologie officielle Dragon Ball France — {items.length} entrées, ordre validé par l'équipe.
			</p>
		</div>
	);
}

// ---------------------------------------------------------------------------

function ExportBtn({
	label,
	icon,
	onClick,
}: {
	label: string;
	icon?: React.ReactNode;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="inline-flex items-center gap-1 rounded-md border border-dbz-border bg-dbz-bg/40 px-2 py-1 text-[11px] font-mono text-white/70 hover:text-white hover:border-dbz-orange/50 transition-colors"
		>
			{icon ?? <Download className="h-3 w-3" />}
			{label}
		</button>
	);
}

function TypeToggle({
	icon,
	label,
	on,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	on: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-display font-semibold transition-colors ${
				on ? "bg-dbz-orange text-black" : "bg-dbz-bg/40 text-white/50 hover:text-white"
			}`}
		>
			{icon}
			{label}
		</button>
	);
}

function EraHeader({ era, episodes, movies }: { era: Era; episodes: number; movies: number }) {
	return (
		<div className="flex items-center gap-3 pt-6 pb-1">
			<span className="h-4 w-1.5 rounded-full" style={{ backgroundColor: ERA_ACCENT[era] }} />
			<h2
				className="font-saiyan text-2xl uppercase tracking-wide"
				style={{ color: ERA_ACCENT[era] }}
			>
				{ERA_LABELS[era]}
			</h2>
			<span className="text-[11px] text-white/35 font-mono">
				{episodes} ép · {movies} film{movies > 1 ? "s" : ""}
			</span>
			<span className="flex-1 h-px" style={{ backgroundColor: `${ERA_ACCENT[era]}33` }} />
		</div>
	);
}

function Row({ it, grouped }: { it: ResolvedTimelineItem; grouped: boolean }) {
	const isMovie = it.kind === "movie";
	const year = yearOf(it.date);
	const accent = ERA_ACCENT[it.era];
	return (
		<div
			className={`group flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
				isMovie
					? "border-dbz-orange/25 bg-dbz-orange/[0.06] hover:border-dbz-orange/50"
					: "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
			}`}
			style={grouped ? { borderLeftColor: accent, borderLeftWidth: 3 } : undefined}
		>
			{/* Marqueur type */}
			{isMovie ? (
				it.image ? (
					<img
						src={assetUrl(it.image)}
						alt=""
						loading="lazy"
						className="h-14 w-10 shrink-0 rounded object-cover"
					/>
				) : (
					<span className="flex h-14 w-10 shrink-0 items-center justify-center rounded bg-dbz-orange/15 text-dbz-orange">
						<Film className="h-4 w-4" />
					</span>
				)
			) : (
				<span
					className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-mono font-bold text-black"
					style={{ backgroundColor: accent }}
					title={`${it.series} — épisode`}
				>
					{it.number ?? "?"}
				</span>
			)}

			{/* Titre + méta */}
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					{isMovie && (
						<span className="rounded bg-dbz-orange px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black">
							Film
						</span>
					)}
					<Link
						href={it.href}
						className="truncate font-display font-semibold text-[14px] text-white hover:text-dbz-orange transition-colors"
					>
						{it.title || "(sans titre)"}
					</Link>
				</div>
				<div className="flex items-center gap-2 text-[11px] text-white/40">
					{!grouped && (
						<span
							className="inline-flex items-center gap-1"
							style={{ color: accent }}
							title={ERA_LABELS[it.era]}
						>
							<span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
							{ERA_LABELS[it.era]}
						</span>
					)}
					{year && <span>{year}</span>}
					{it.hasVf && <span className="text-namek">VF</span>}
					{it.hasVostfr && <span className="text-dbz-blue-light">VOSTFR</span>}
				</div>
				{it.note && (
					<p className="mt-1 text-[11px] leading-snug text-white/55 italic border-l-2 border-dbz-yellow/40 pl-2">
						{it.note}
					</p>
				)}
			</div>
		</div>
	);
}
