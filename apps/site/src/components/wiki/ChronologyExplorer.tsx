"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
	Film,
	Tv,
	Search,
	Download,
	Copy,
	Check,
	Plus,
	ArrowUp,
	ArrowDown,
	X,
	ListOrdered,
	Trash2,
} from "lucide-react";
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
	type Era,
	type SortMode,
	type TimelineItem,
} from "@/lib/chronology";

const keyOf = (it: TimelineItem) => `${it.kind}:${it.id}`;
const yearOf = (sec: number | null) => (sec ? new Date(sec * 1000).getFullYear() : null);

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

const EXPORTERS = {
	json: { fn: toJSONExport, mime: "application/json", ext: "json" },
	csv: { fn: toCSVExport, mime: "text/csv;charset=utf-8", ext: "csv" },
	md: { fn: toMarkdownExport, mime: "text/markdown;charset=utf-8", ext: "md" },
} as const;

const SORTS: SortMode[] = ["era", "date", "title"];
const SEL_STORAGE = "dbfr_chrono_selection";

export function ChronologyExplorer({ items }: { items: TimelineItem[] }) {
	const [eras, setEras] = useState<Set<Era>>(() => new Set(ERA_ORDER));
	const [showEpisodes, setShowEpisodes] = useState(true);
	const [showMovies, setShowMovies] = useState(true);
	const [q, setQ] = useState("");
	const [sort, setSort] = useState<SortMode>("era");
	const [selection, setSelection] = useState<string[]>([]);
	const [panelOpen, setPanelOpen] = useState(false);
	const [copied, setCopied] = useState<string | null>(null);

	// Sélection personnelle persistée (localStorage) → « ta » chronologie.
	useEffect(() => {
		try {
			const raw = localStorage.getItem(SEL_STORAGE);
			if (raw) setSelection(JSON.parse(raw) as string[]);
		} catch {
			/* ignore */
		}
	}, []);
	useEffect(() => {
		try {
			localStorage.setItem(SEL_STORAGE, JSON.stringify(selection));
		} catch {
			/* ignore */
		}
	}, [selection]);

	const byKey = useMemo(() => {
		const m = new Map<string, TimelineItem>();
		for (const it of items) m.set(keyOf(it), it);
		return m;
	}, [items]);

	// Comptes par ère (sur le dataset complet, pour les puces de filtre).
	const eraCounts = useMemo(() => {
		const m = new Map<Era, number>();
		for (const it of items) m.set(it.era, (m.get(it.era) ?? 0) + 1);
		return m;
	}, [items]);

	const filtered = useMemo(() => {
		const needle = q.trim().toLowerCase();
		return items
			.filter((it) => {
				if (!eras.has(it.era)) return false;
				if (it.kind === "episode" && !showEpisodes) return false;
				if (it.kind === "movie" && !showMovies) return false;
				if (needle) {
					const hay = `${it.title} ${it.titleJa ?? ""} ${it.series}`.toLowerCase();
					if (!hay.includes(needle)) return false;
				}
				return true;
			})
			.sort(compareTimeline(sort));
	}, [items, eras, showEpisodes, showMovies, q, sort]);

	const selectedItems = useMemo(
		() => selection.map((k) => byKey.get(k)).filter((x): x is TimelineItem => Boolean(x)),
		[selection, byKey]
	);

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

	const inSelection = (it: TimelineItem) => selection.includes(keyOf(it));
	const addSel = (it: TimelineItem) =>
		setSelection((p) => (p.includes(keyOf(it)) ? p : [...p, keyOf(it)]));
	const removeSel = (k: string) => setSelection((p) => p.filter((x) => x !== k));
	const moveSel = (i: number, dir: -1 | 1) =>
		setSelection((p) => {
			const j = i + dir;
			if (j < 0 || j >= p.length) return p;
			const n = [...p];
			[n[i], n[j]] = [n[j]!, n[i]!];
			return n;
		});

	function doExport(list: TimelineItem[], fmt: keyof typeof EXPORTERS) {
		if (list.length === 0) return;
		const { fn, mime, ext } = EXPORTERS[fmt];
		triggerDownload(`chronologie-dragon-ball.${ext}`, fn(list), mime);
	}
	async function doCopy(list: TimelineItem[], tag: string) {
		if (list.length === 0) return;
		try {
			await navigator.clipboard.writeText(toMarkdownExport(list));
			setCopied(tag);
			setTimeout(() => setCopied((c) => (c === tag ? null : c)), 1600);
		} catch {
			/* clipboard indispo */
		}
	}

	// Rendu de la liste : groupée par ère (tri « era ») ou plate (date/titre).
	const rows: React.ReactNode[] = [];
	let lastEra: Era | null = null;
	for (const it of filtered) {
		if (sort === "era" && it.era !== lastEra) {
			lastEra = it.era;
			const c = filtered.filter((x) => x.era === it.era);
			const ep = c.filter((x) => x.kind === "episode").length;
			rows.push(
				<EraHeader key={`h:${it.era}`} era={it.era} episodes={ep} movies={c.length - ep} />
			);
		}
		rows.push(
			<Row
				key={keyOf(it)}
				it={it}
				selected={inSelection(it)}
				onAdd={() => addSel(it)}
				grouped={sort === "era"}
			/>
		);
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
								<span className={on ? "text-black/60" : "text-white/30"}>
									{eraCounts.get(e)}
								</span>
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
						Tri
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

				{/* Export de la vue courante + accès à la sélection */}
				<div className="flex flex-wrap items-center gap-2 border-t border-dbz-border pt-3">
					<span className="text-[12px] text-white/50">
						<strong className="text-white">{filtered.length}</strong> entrée
						{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}
					</span>
					<span className="text-white/20">·</span>
					<span className="text-[11px] text-white/40">Exporter :</span>
					<ExportBtn label="JSON" onClick={() => doExport(filtered, "json")} />
					<ExportBtn label="CSV" onClick={() => doExport(filtered, "csv")} />
					<ExportBtn label="Markdown" onClick={() => doExport(filtered, "md")} />
					<ExportBtn
						label={copied === "view" ? "Copié !" : "Copier"}
						icon={copied === "view" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
						onClick={() => doCopy(filtered, "view")}
					/>
					<button
						type="button"
						onClick={() => setPanelOpen((v) => !v)}
						className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-dbz-orange/15 border border-dbz-orange/40 px-3 py-1.5 text-[12px] font-display font-semibold text-dbz-orange hover:bg-dbz-orange/25 transition-colors"
					>
						<ListOrdered className="h-3.5 w-3.5" />
						Ma chronologie
						{selection.length > 0 && (
							<span className="rounded-full bg-dbz-orange text-black px-1.5 text-[10px]">
								{selection.length}
							</span>
						)}
					</button>
				</div>
			</div>

			{/* Panneau « Ma chronologie » (construis ton ordre) */}
			{panelOpen && (
				<SelectionPanel
					items={selectedItems}
					copied={copied === "sel"}
					onClose={() => setPanelOpen(false)}
					onMove={moveSel}
					onRemove={removeSel}
					onClear={() => setSelection([])}
					onExport={(fmt) => doExport(selectedItems, fmt)}
					onCopy={() => doCopy(selectedItems, "sel")}
				/>
			)}

			{/* Frise */}
			{filtered.length === 0 ? (
				<p className="dbz-panel py-12 text-center text-white/40">
					Aucune entrée ne correspond aux filtres.
				</p>
			) : (
				<div className="space-y-1.5">{rows}</div>
			)}

			<p className="text-[11px] text-white/30 text-center pt-2">
				Astuce : ajoute des entrées à « Ma chronologie » (bouton ＋), réordonne-les à ta guise, puis
				exporte ta liste — tu composes ton propre ordre de visionnage.
			</p>
		</div>
	);
}

// ---------------------------------------------------------------------------

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

function EraHeader({ era, episodes, movies }: { era: Era; episodes: number; movies: number }) {
	return (
		<div className="flex items-center gap-3 pt-6 pb-1">
			<span className="h-4 w-1.5 rounded-full" style={{ backgroundColor: ERA_ACCENT[era] }} />
			<h2 className="font-saiyan text-2xl uppercase tracking-wide" style={{ color: ERA_ACCENT[era] }}>
				{ERA_LABELS[era]}
			</h2>
			<span className="text-[11px] text-white/35 font-mono">
				{episodes} ép · {movies} film{movies > 1 ? "s" : ""}
			</span>
			<span className="flex-1 h-px" style={{ backgroundColor: `${ERA_ACCENT[era]}33` }} />
		</div>
	);
}

function Row({
	it,
	selected,
	onAdd,
	grouped,
}: {
	it: TimelineItem;
	selected: boolean;
	onAdd: () => void;
	grouped: boolean;
}) {
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
			</div>

			{/* Ajouter à ma chronologie */}
			<button
				type="button"
				onClick={onAdd}
				disabled={selected}
				title={selected ? "Déjà dans ta chronologie" : "Ajouter à ma chronologie"}
				className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
					selected
						? "border-namek/50 text-namek cursor-default"
						: "border-dbz-border text-white/40 hover:border-dbz-orange hover:text-dbz-orange"
				}`}
			>
				{selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
			</button>
		</div>
	);
}

function SelectionPanel({
	items,
	copied,
	onClose,
	onMove,
	onRemove,
	onClear,
	onExport,
	onCopy,
}: {
	items: TimelineItem[];
	copied: boolean;
	onClose: () => void;
	onMove: (i: number, dir: -1 | 1) => void;
	onRemove: (key: string) => void;
	onClear: () => void;
	onExport: (fmt: "json" | "csv" | "md") => void;
	onCopy: () => void;
}) {
	return (
		<div className="dbz-panel border-dbz-orange/40 p-4 sm:p-5">
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-saiyan text-xl text-dbz-orange uppercase flex items-center gap-2">
					<ListOrdered className="h-5 w-5" />
					Ma chronologie ({items.length})
				</h3>
				<button
					type="button"
					onClick={onClose}
					className="text-white/40 hover:text-white"
					aria-label="Fermer"
				>
					<X className="h-5 w-5" />
				</button>
			</div>

			{items.length === 0 ? (
				<p className="text-white/45 text-sm py-6 text-center">
					Ajoute des épisodes et films depuis la frise (bouton ＋) pour composer ton ordre de
					visionnage, puis réordonne-les ici.
				</p>
			) : (
				<>
					<div className="flex flex-wrap items-center gap-2 mb-4">
						<ExportBtn label="JSON" onClick={() => onExport("json")} />
						<ExportBtn label="CSV" onClick={() => onExport("csv")} />
						<ExportBtn label="Markdown" onClick={() => onExport("md")} />
						<ExportBtn
							label={copied ? "Copié !" : "Copier"}
							icon={copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
							onClick={onCopy}
						/>
						<button
							type="button"
							onClick={onClear}
							className="ml-auto inline-flex items-center gap-1 text-[11px] text-white/40 hover:text-dbz-red transition-colors"
						>
							<Trash2 className="h-3 w-3" />
							Vider
						</button>
					</div>
					<ol className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
						{items.map((it, i) => (
							<li
								key={keyOf(it)}
								className="flex items-center gap-3 rounded-lg bg-dbz-bg/40 border border-dbz-border px-3 py-2"
							>
								<span className="font-saiyan text-lg text-dbz-yellow/70 w-7 text-center shrink-0">
									{i + 1}
								</span>
								<span className="shrink-0" style={{ color: ERA_ACCENT[it.era] }}>
									{it.kind === "movie" ? <Film className="h-4 w-4" /> : <Tv className="h-4 w-4" />}
								</span>
								<Link
									href={it.href}
									className="flex-1 min-w-0 truncate text-[13px] text-white hover:text-dbz-orange transition-colors"
								>
									{it.title || "(sans titre)"}
								</Link>
								<div className="flex items-center gap-1 shrink-0">
									<IconBtn label="Monter" onClick={() => onMove(i, -1)} disabled={i === 0}>
										<ArrowUp className="h-3.5 w-3.5" />
									</IconBtn>
									<IconBtn
										label="Descendre"
										onClick={() => onMove(i, 1)}
										disabled={i === items.length - 1}
									>
										<ArrowDown className="h-3.5 w-3.5" />
									</IconBtn>
									<IconBtn label="Retirer" onClick={() => onRemove(keyOf(it))}>
										<X className="h-3.5 w-3.5" />
									</IconBtn>
								</div>
							</li>
						))}
					</ol>
				</>
			)}
		</div>
	);
}

function IconBtn({
	children,
	label,
	onClick,
	disabled,
}: {
	children: React.ReactNode;
	label: string;
	onClick: () => void;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
			title={label}
			className="flex h-7 w-7 items-center justify-center rounded border border-dbz-border text-white/50 hover:border-dbz-orange hover:text-dbz-orange disabled:opacity-30 disabled:hover:border-dbz-border disabled:hover:text-white/50 transition-colors"
		>
			{children}
		</button>
	);
}
