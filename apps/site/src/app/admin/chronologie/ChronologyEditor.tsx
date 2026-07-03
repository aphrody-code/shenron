"use client";

/**
 * Éditeur de la chronologie universelle (/admin/chronologie).
 *
 * La frise publique `/wiki/chronologie` est FIXE : son ordre officiel est décidé
 * ici. On part du dataset brut (tous les épisodes + films) et on applique une
 * **curation** stockée en DB (`ChronologyConfig`) :
 *   - masquer une entrée,
 *   - forcer son ère (corrige un mauvais bucket auto),
 *   - fixer sa date (comble les trous — ex. DBGT sans date de diffusion),
 *   - surcharger son titre,
 *   - ajouter une note éditoriale,
 *   - réordonner À LA MAIN au sein d'une ère (épingle l'ordre de cette ère).
 *
 * Sans aucune curation, l'ordre reste identique au tri auto « ère ». L'écriture
 * passe par PUT /api/chronologie-config (gate admin) qui revalide la page publique.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	ChevronDown,
	ChevronUp,
	Eye,
	EyeOff,
	ExternalLink,
	Film,
	Tv,
	RotateCcw,
	Save,
	Search,
	Info,
} from "lucide-react";
import { assetUrl } from "@/lib/assets";
import { DragonBallLoader } from "@/components/DragonBall";
import {
	ERA_ORDER,
	ERA_LABELS,
	ERA_ACCENT,
	applyChronology,
	timelineKey,
	DEFAULT_CHRONOLOGY_CONFIG,
	type Era,
	type ChronoOverride,
	type ChronologyConfig,
	type TimelineItem,
	type ResolvedTimelineItem,
} from "@/lib/chronology";

interface LoadResponse {
	config: ChronologyConfig;
	items: TimelineItem[];
}

async function loadData(): Promise<LoadResponse> {
	const r = await fetch("/api/chronologie-config", { credentials: "same-origin" });
	if (!r.ok) throw new Error(`HTTP ${r.status}`);
	return r.json();
}

async function saveData(config: ChronologyConfig): Promise<{ ok: boolean; config: ChronologyConfig }> {
	const r = await fetch("/api/chronologie-config", {
		method: "PUT",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(config),
	});
	if (!r.ok) {
		const t = await r.text().catch(() => "");
		throw new Error(t || `HTTP ${r.status}`);
	}
	return r.json();
}

const toISO = (sec: number | null | undefined): string =>
	sec ? new Date(sec * 1000).toISOString().slice(0, 10) : "";
const fromISO = (s: string): number | undefined => {
	const t = Date.parse(`${s}T00:00:00Z`);
	return Number.isNaN(t) ? undefined : Math.floor(t / 1000);
};

type Overrides = Record<string, ChronoOverride>;

export default function ChronologyEditor() {
	const query = useQuery({ queryKey: ["chronology-config"], queryFn: loadData });
	const [overrides, setOverrides] = useState<Overrides>({});
	const [eraOrder, setEraOrder] = useState<Era[]>([...ERA_ORDER]);
	const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

	// Filtres d'affichage (aides de navigation ; n'altèrent pas la config).
	const [q, setQ] = useState("");
	const [showEpisodes, setShowEpisodes] = useState(true);
	const [showMovies, setShowMovies] = useState(true);
	const [showHidden, setShowHidden] = useState(true);
	const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

	useEffect(() => {
		if (query.data) {
			setOverrides(query.data.config.overrides ?? {});
			setEraOrder(query.data.config.eraOrder ?? [...ERA_ORDER]);
		}
	}, [query.data]);

	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(null), 3500);
		return () => clearTimeout(t);
	}, [toast]);

	const items = useMemo(() => query.data?.items ?? [], [query.data]);
	const rawByKey = useMemo(() => {
		const m = new Map<string, TimelineItem>();
		for (const it of items) m.set(timelineKey(it), it);
		return m;
	}, [items]);

	// Ordre officiel courant : on résout SANS masquer (pour voir/éditer les entrées
	// masquées), puis on style/filtre les masquées côté rendu.
	const resolved: ResolvedTimelineItem[] = useMemo(() => {
		const visibleOverrides: Overrides = {};
		for (const [k, v] of Object.entries(overrides)) {
			const { hidden: _hidden, ...rest } = v;
			visibleOverrides[k] = rest;
		}
		return applyChronology(items, { version: 1, eraOrder, overrides: visibleOverrides });
	}, [items, eraOrder, overrides]);

	const isHidden = useCallback((key: string) => overrides[key]?.hidden === true, [overrides]);

	const stats = useMemo(() => {
		const keys = Object.keys(overrides);
		return {
			total: items.length,
			curated: keys.length,
			hidden: keys.filter((k) => overrides[k]?.hidden).length,
			pinned: keys.filter((k) => typeof overrides[k]?.sort === "number").length,
		};
	}, [overrides, items.length]);

	// Réordonnancement fiable uniquement quand aucun filtre ne cache d'entrées
	// intra-ère (sinon le « monter/descendre » sauterait des voisins invisibles).
	const reorderEnabled = !q.trim() && showEpisodes && showMovies && showHidden;

	// ── Mutations de la config ────────────────────────────────────────────────
	const patchOverride = useCallback((key: string, patch: Partial<ChronoOverride>) => {
		setOverrides((prev) => {
			const cur: ChronoOverride = { ...prev[key] };
			for (const [k, v] of Object.entries(patch)) {
				if (v === undefined || v === null || v === "") {
					delete (cur as Record<string, unknown>)[k];
				} else {
					(cur as Record<string, unknown>)[k] = v;
				}
			}
			const next = { ...prev };
			if (Object.keys(cur).length === 0) delete next[key];
			else next[key] = cur;
			return next;
		});
	}, []);

	const toggleHide = useCallback((key: string) => {
		setOverrides((prev) => {
			const cur: ChronoOverride = { ...prev[key] };
			if (cur.hidden) delete cur.hidden;
			else cur.hidden = true;
			const next = { ...prev };
			if (Object.keys(cur).length === 0) delete next[key];
			else next[key] = cur;
			return next;
		});
	}, []);

	const setEra = useCallback(
		(key: string, era: Era) => {
			const raw = rawByKey.get(key);
			setOverrides((prev) => {
				const cur: ChronoOverride = { ...prev[key] };
				// Changer d'ère invalide le rang manuel (il référait l'ancienne ère).
				delete cur.sort;
				if (raw && era === raw.era) delete cur.era;
				else cur.era = era;
				const next = { ...prev };
				if (Object.keys(cur).length === 0) delete next[key];
				else next[key] = cur;
				return next;
			});
		},
		[rawByKey]
	);

	// Monter/descendre au sein d'une ère → épingle l'ordre de TOUTE l'ère (chaque
	// entrée reçoit un rang `sort` = sa position). L'ère devient ainsi figée.
	const move = useCallback(
		(key: string, dir: -1 | 1) => {
			const target = resolved.find((r) => timelineKey(r) === key);
			if (!target) return;
			const groupKeys = resolved.filter((r) => r.era === target.era).map(timelineKey);
			const idx = groupKeys.indexOf(key);
			const j = idx + dir;
			if (j < 0 || j >= groupKeys.length) return;
			[groupKeys[idx], groupKeys[j]] = [groupKeys[j]!, groupKeys[idx]!];
			setOverrides((prev) => {
				const next = { ...prev };
				groupKeys.forEach((k, i) => {
					next[k] = { ...next[k], sort: i };
				});
				return next;
			});
		},
		[resolved]
	);

	const resetEntry = useCallback((key: string) => {
		setOverrides((prev) => {
			const next = { ...prev };
			delete next[key];
			return next;
		});
	}, []);

	const moveEra = (era: Era, dir: -1 | 1) => {
		setEraOrder((prev) => {
			const i = prev.indexOf(era);
			const j = i + dir;
			if (i < 0 || j < 0 || j >= prev.length) return prev;
			const next = [...prev];
			[next[i], next[j]] = [next[j]!, next[i]!];
			return next;
		});
	};

	const save = useMutation({
		mutationFn: () => saveData({ version: 1, eraOrder, overrides }),
		onSuccess: (res) => {
			setOverrides(res.config.overrides ?? {});
			setEraOrder(res.config.eraOrder ?? [...ERA_ORDER]);
			setToast({ type: "success", msg: "Chronologie enregistrée. La page publique est à jour." });
		},
		onError: (e: Error) => setToast({ type: "error", msg: `Échec : ${e.message}` }),
	});

	// ── Rendu ─────────────────────────────────────────────────────────────────
	if (query.isLoading) {
		return (
			<div className="flex items-center gap-3 text-sm text-zinc-500">
				<DragonBallLoader size={28} /> Chargement de la chronologie…
			</div>
		);
	}
	if (query.isError) {
		return <div className="text-sm text-red-400">Erreur de chargement : {String(query.error)}</div>;
	}

	const needle = q.trim().toLowerCase();
	const rowVisible = (it: ResolvedTimelineItem): boolean => {
		if (it.kind === "episode" && !showEpisodes) return false;
		if (it.kind === "movie" && !showMovies) return false;
		if (!showHidden && isHidden(timelineKey(it))) return false;
		if (needle) {
			const hay = `${it.title} ${it.titleJa ?? ""} ${it.series}`.toLowerCase();
			if (!hay.includes(needle)) return false;
		}
		return true;
	};

	// Groupé par ère (l'ordre résolu est déjà contigu par ère).
	const rows: React.ReactNode[] = [];
	let lastEra: Era | null = null;
	let eraIndex = 0;
	for (const it of resolved) {
		const key = timelineKey(it);
		if (it.era !== lastEra) {
			lastEra = it.era;
			eraIndex = 0;
			const group = resolved.filter((x) => x.era === it.era);
			const anyVisible = group.some(rowVisible);
			if (anyVisible) {
				rows.push(
					<EraHeader
						key={`h:${it.era}`}
						era={it.era}
						count={group.length}
						pos={eraOrder.indexOf(it.era)}
						total={eraOrder.length}
						onMove={(dir) => moveEra(it.era, dir)}
					/>
				);
			}
		}
		const posInEra = eraIndex++;
		if (!rowVisible(it)) continue;
		rows.push(
			<EntryRow
				key={key}
				it={it}
				raw={rawByKey.get(key)}
				override={overrides[key]}
				hidden={isHidden(key)}
				expanded={expanded.has(key)}
				posInEra={posInEra}
				reorderEnabled={reorderEnabled}
				onToggleExpand={() =>
					setExpanded((prev) => {
						const n = new Set(prev);
						if (n.has(key)) n.delete(key);
						else n.add(key);
						return n;
					})
				}
				onMove={(dir) => move(key, dir)}
				onToggleHide={() => toggleHide(key)}
				onSetEra={(era) => setEra(key, era)}
				onSet={(patch) => patchOverride(key, patch)}
				onReset={() => resetEntry(key)}
			/>
		);
	}

	const visibleCount = resolved.filter(rowVisible).length;

	return (
		<div className="space-y-4">
			{toast && (
				<div
					className={`fixed right-4 top-4 z-50 rounded-lg border px-4 py-3 text-sm shadow-xl ${
						toast.type === "success"
							? "border-green-500/50 bg-dbz-card text-green-300"
							: "border-red-500/50 bg-dbz-card text-red-300"
					}`}
				>
					{toast.msg}
				</div>
			)}

			{/* Barre d'action */}
			<div className="dbz-panel flex flex-wrap items-center gap-3 p-4">
				<div className="flex-1 min-w-[240px]">
					<h2 className="font-saiyan text-lg uppercase text-dbz-orange">Chronologie universelle</h2>
					<p className="text-xs text-zinc-400">
						Ordre officiel de <strong className="text-white">{stats.total}</strong> entrées ·{" "}
						{stats.curated} curatée{stats.curated > 1 ? "s" : ""} · {stats.hidden} masquée
						{stats.hidden > 1 ? "s" : ""} · {stats.pinned} épinglée{stats.pinned > 1 ? "s" : ""}. Les
						changements s'appliquent au public après enregistrement.
					</p>
				</div>
				<a
					href="/wiki/chronologie"
					target="_blank"
					rel="noreferrer"
					className="btn btn-ghost"
					title="Voir la frise publique"
				>
					<ExternalLink className="mr-1 h-4 w-4" /> Voir
				</a>
				<button
					type="button"
					onClick={() => {
						if (confirm("Réinitialiser TOUTE la curation (ordre, masquages, dates, notes) ?")) {
							setOverrides({});
							setEraOrder([...DEFAULT_CHRONOLOGY_CONFIG.eraOrder]);
						}
					}}
					className="btn btn-ghost text-amber-300"
				>
					<RotateCcw className="mr-1 h-4 w-4" /> Tout auto
				</button>
				<button type="button" onClick={() => save.mutate()} disabled={save.isPending} className="btn btn-primary">
					<Save className="mr-1 h-4 w-4" /> {save.isPending ? "Enregistrement…" : "Enregistrer"}
				</button>
			</div>

			{/* Filtres */}
			<div className="card flex flex-wrap items-center gap-3 p-3">
				<div className="flex rounded-lg border border-zinc-700 overflow-hidden">
					<FilterToggle
						icon={<Tv className="h-3.5 w-3.5" />}
						label="Épisodes"
						on={showEpisodes}
						onClick={() => setShowEpisodes((v) => !v)}
					/>
					<FilterToggle
						icon={<Film className="h-3.5 w-3.5" />}
						label="Films"
						on={showMovies}
						onClick={() => setShowMovies((v) => !v)}
					/>
				</div>
				<button
					type="button"
					onClick={() => setShowHidden((v) => !v)}
					className={`btn btn-ghost px-2 ${showHidden ? "text-zinc-300" : "text-zinc-500"}`}
					title={showHidden ? "Masquées affichées" : "Masquées cachées"}
				>
					{showHidden ? <Eye className="mr-1 h-4 w-4" /> : <EyeOff className="mr-1 h-4 w-4" />}
					Masquées
				</button>
				<div className="relative min-w-[200px] flex-1">
					<Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
					<input
						type="search"
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="Rechercher un titre / une série…"
						className="input w-full pl-9"
					/>
				</div>
				<span className="text-xs text-zinc-500">{visibleCount} affichée(s)</span>
			</div>

			{!reorderEnabled && (
				<p className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[12px] text-amber-300/90">
					<Info className="h-4 w-4 shrink-0" />
					Le réordonnancement (monter/descendre) est désactivé tant qu'un filtre masque des entrées.
					Réinitialise la recherche et affiche épisodes + films + masquées pour réordonner.
				</p>
			)}

			<div className="space-y-1">{rows}</div>
		</div>
	);
}

// ---------------------------------------------------------------------------

function FilterToggle({
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
			className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold transition-colors ${
				on ? "bg-dbz-orange text-black" : "bg-black/30 text-zinc-400 hover:text-white"
			}`}
		>
			{icon}
			{label}
		</button>
	);
}

function EraHeader({
	era,
	count,
	pos,
	total,
	onMove,
}: {
	era: Era;
	count: number;
	pos: number;
	total: number;
	onMove: (dir: -1 | 1) => void;
}) {
	return (
		<div className="flex items-center gap-3 pt-5 pb-1">
			<span className="h-4 w-1.5 rounded-full" style={{ backgroundColor: ERA_ACCENT[era] }} />
			<h3 className="font-saiyan text-xl uppercase tracking-wide" style={{ color: ERA_ACCENT[era] }}>
				{ERA_LABELS[era]}
			</h3>
			<span className="text-[11px] text-zinc-500 font-mono">{count}</span>
			<span className="flex-1 h-px" style={{ backgroundColor: `${ERA_ACCENT[era]}33` }} />
			<div className="flex items-center gap-0.5">
				<button
					type="button"
					onClick={() => onMove(-1)}
					disabled={pos <= 0}
					className="text-zinc-500 hover:text-dbz-orange disabled:opacity-25"
					title="Monter l'ère"
				>
					<ChevronUp className="h-4 w-4" />
				</button>
				<button
					type="button"
					onClick={() => onMove(1)}
					disabled={pos >= total - 1}
					className="text-zinc-500 hover:text-dbz-orange disabled:opacity-25"
					title="Descendre l'ère"
				>
					<ChevronDown className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}

function EntryRow({
	it,
	raw,
	override,
	hidden,
	expanded,
	posInEra,
	reorderEnabled,
	onToggleExpand,
	onMove,
	onToggleHide,
	onSetEra,
	onSet,
	onReset,
}: {
	it: ResolvedTimelineItem;
	raw: TimelineItem | undefined;
	override: ChronoOverride | undefined;
	hidden: boolean;
	expanded: boolean;
	posInEra: number;
	reorderEnabled: boolean;
	onToggleExpand: () => void;
	onMove: (dir: -1 | 1) => void;
	onToggleHide: () => void;
	onSetEra: (era: Era) => void;
	onSet: (patch: Partial<ChronoOverride>) => void;
	onReset: () => void;
}) {
	const isMovie = it.kind === "movie";
	const accent = ERA_ACCENT[it.era];
	const curated = override && Object.keys(override).length > 0;

	// Brouillons locaux pour titre/note → commit onBlur (évite de recalculer l'ordre
	// à chaque frappe sur 685 lignes).
	const [titleDraft, setTitleDraft] = useState(override?.title ?? "");
	const [noteDraft, setNoteDraft] = useState(override?.note ?? "");
	useEffect(() => setTitleDraft(override?.title ?? ""), [override?.title]);
	useEffect(() => setNoteDraft(override?.note ?? ""), [override?.note]);

	return (
		<div
			className={`rounded-lg border transition-colors ${
				hidden
					? "border-zinc-800 bg-black/20 opacity-50"
					: isMovie
						? "border-dbz-orange/25 bg-dbz-orange/[0.05]"
						: "border-zinc-800 bg-white/[0.02]"
			}`}
			style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
		>
			<div className="flex items-center gap-3 px-3 py-2">
				{/* Réordonnancement */}
				<div className="flex flex-col">
					<button
						type="button"
						onClick={() => onMove(-1)}
						disabled={!reorderEnabled || posInEra === 0}
						className="text-zinc-500 hover:text-dbz-orange disabled:opacity-25"
						title={reorderEnabled ? "Monter" : "Réordonnancement désactivé (filtres actifs)"}
					>
						<ChevronUp className="h-4 w-4" />
					</button>
					<button
						type="button"
						onClick={() => onMove(1)}
						disabled={!reorderEnabled}
						className="text-zinc-500 hover:text-dbz-orange disabled:opacity-25"
						title={reorderEnabled ? "Descendre" : "Réordonnancement désactivé (filtres actifs)"}
					>
						<ChevronDown className="h-4 w-4" />
					</button>
				</div>

				{/* Marqueur */}
				{isMovie ? (
					it.image ? (
						<img
							src={assetUrl(it.image)}
							alt=""
							loading="lazy"
							className="h-11 w-8 shrink-0 rounded object-cover"
						/>
					) : (
						<span className="flex h-11 w-8 shrink-0 items-center justify-center rounded bg-dbz-orange/15 text-dbz-orange">
							<Film className="h-4 w-4" />
						</span>
					)
				) : (
					<span
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-mono font-bold text-black"
						style={{ backgroundColor: accent }}
						title={`${it.series} — épisode`}
					>
						{it.number ?? "?"}
					</span>
				)}

				{/* Titre + méta */}
				<button type="button" onClick={onToggleExpand} className="min-w-0 flex-1 text-left">
					<div className="flex items-center gap-2">
						{isMovie && (
							<span className="rounded bg-dbz-orange px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black">
								Film
							</span>
						)}
						<span className="truncate font-display font-semibold text-[13px] text-white">
							{it.title || "(sans titre)"}
						</span>
						{curated && (
							<span className="rounded bg-dbz-blue-light/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-dbz-blue-light">
								curatée
							</span>
						)}
					</div>
					<div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
						<span>{it.series}</span>
						{it.date && <span>{toISO(it.date)}</span>}
						{it.note && <span className="text-dbz-yellow/70 not-italic normal-case">note</span>}
					</div>
				</button>

				{/* Ère */}
				<select
					value={it.era}
					onChange={(e) => onSetEra(e.target.value as Era)}
					className="input py-1 text-xs w-[7.5rem]"
					title="Ère"
				>
					{ERA_ORDER.map((era) => (
						<option key={era} value={era}>
							{ERA_LABELS[era]}
						</option>
					))}
				</select>

				{/* Masquer */}
				<button
					type="button"
					onClick={onToggleHide}
					className={`btn btn-ghost px-2 ${hidden ? "text-zinc-500" : "text-emerald-400"}`}
					title={hidden ? "Entrée masquée — réafficher" : "Masquer de la frise publique"}
				>
					{hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
				</button>

				<button type="button" onClick={onToggleExpand} className="btn btn-ghost px-2">
					<ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
				</button>
			</div>

			{expanded && (
				<div className="grid gap-3 border-t border-zinc-800 p-3 sm:grid-cols-2">
					<label className="text-xs text-zinc-400">
						Date de diffusion / sortie
						<input
							type="date"
							value={toISO(it.date)}
							onChange={(e) => onSet({ date: e.target.value ? fromISO(e.target.value) : undefined })}
							className="input mt-1"
						/>
						{raw?.date != null && (
							<span className="mt-0.5 block text-[10px] text-zinc-600">
								auto : {toISO(raw.date)}
							</span>
						)}
					</label>
					<label className="text-xs text-zinc-400">
						Titre (surcharge)
						<input
							value={titleDraft}
							onChange={(e) => setTitleDraft(e.target.value)}
							onBlur={() => {
								const v = titleDraft.trim();
								onSet({ title: v && v !== raw?.title ? v : undefined });
							}}
							placeholder={raw?.title ?? "Titre"}
							className="input mt-1"
						/>
					</label>
					<label className="text-xs text-zinc-400 sm:col-span-2">
						Note éditoriale (affichée sous l'entrée)
						<textarea
							value={noteDraft}
							onChange={(e) => setNoteDraft(e.target.value)}
							onBlur={() => onSet({ note: noteDraft.trim() || undefined })}
							rows={2}
							placeholder="Ex. « À regarder après le film 3 », contexte canon/filler…"
							className="input mt-1 w-full"
						/>
					</label>
					<div className="sm:col-span-2 flex items-center justify-between">
						<span className="text-[10px] text-zinc-600 font-mono">{timelineKey(it)}</span>
						<div className="flex items-center gap-2">
							<a
								href={it.href}
								target="_blank"
								rel="noreferrer"
								className="btn btn-ghost px-2 py-1 text-xs"
							>
								<ExternalLink className="mr-1 h-3 w-3" /> Fiche
							</a>
							<button
								type="button"
								onClick={onReset}
								disabled={!curated}
								className="btn btn-ghost px-2 py-1 text-xs text-amber-300 disabled:opacity-30"
								title="Réinitialiser cette entrée (retour à l'auto)"
							>
								<RotateCcw className="mr-1 h-3 w-3" /> Réinitialiser
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
