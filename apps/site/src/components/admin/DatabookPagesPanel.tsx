"use client";

/**
 * Panneau studio : pages d'un databook / interview (jsonb `pages`).
 *
 * Format manga-like : chaque slot = numéro (auto, modifiable) + image
 * (optionnelle) + texte sous l'image. On fixe d'abord le **nombre de pages**
 * (slots réservés, pas besoin de tout remplir). Save dédiée (jsonb exclu de
 * SmartField / buildSubmitBody).
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Hash, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImageField } from "@/components/admin/ImageField";
import { apiAt } from "@/lib/admin-api";
import { crudBase } from "@/lib/wiki-tables";

export interface DatabookPageDraft {
	/** Clé React stable (jamais persistée). */
	_key: string;
	/** Numéro affiché (auto 1…N, éditable). Stocké en string dans le form. */
	number: string;
	image: string;
	text: string;
}

let keySeq = 0;
function newKey(): string {
	keySeq += 1;
	return `dbp-${Date.now().toString(36)}-${keySeq}`;
}

function parseNumber(raw: unknown, fallback: number): number {
	if (typeof raw === "number" && Number.isFinite(raw)) return Math.trunc(raw);
	if (typeof raw === "string" && raw.trim() && Number.isFinite(Number(raw))) {
		return Math.trunc(Number(raw));
	}
	return fallback;
}

function normalizePages(raw: unknown): DatabookPageDraft[] {
	if (!Array.isArray(raw)) return [];
	return raw
		.filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
		.map((p, i) => ({
			_key: newKey(),
			number: String(parseNumber(p.number, i + 1)),
			image: typeof p.image === "string" ? p.image : "",
			text: typeof p.text === "string" ? p.text : "",
		}));
}

/** Prochain numéro libre = max des numéros existants + 1 (ou 1 si vide). */
function nextAutoNumber(pages: DatabookPageDraft[]): number {
	let max = 0;
	for (const p of pages) {
		const n = Number(p.number);
		if (Number.isFinite(n) && n > max) max = Math.trunc(n);
	}
	return max + 1;
}

function emptyPage(number: number): DatabookPageDraft {
	return { _key: newKey(), number: String(number), image: "", text: "" };
}

/** Snapshot comparable (sans _key) pour dirty detection. */
function snapshot(pages: DatabookPageDraft[]): string {
	return JSON.stringify(
		pages.map((p) => ({
			number: parseNumber(p.number, 0),
			image: p.image.trim(),
			text: p.text.trim(),
		}))
	);
}

export function DatabookPagesPanel({ databookId }: { databookId: string }) {
	const client = apiAt(crudBase("db_databooks"));
	const qc = useQueryClient();
	const [pages, setPages] = useState<DatabookPageDraft[]>([]);
	const [savedSnap, setSavedSnap] = useState("[]");
	const [countInput, setCountInput] = useState("0");
	const [startFrom, setStartFrom] = useState("1");
	const [toast, setToast] = useState<string | null>(null);
	const listEndRef = useRef<HTMLLIElement | null>(null);
	const scrollNew = useRef(false);

	const row = useQuery({
		queryKey: ["wiki-studio", "db_databooks", databookId, "pages"],
		queryFn: () =>
			client.get<Record<string, unknown>>(`/db_databooks/${encodeURIComponent(databookId)}`),
		staleTime: 30_000,
	});

	useEffect(() => {
		if (!row.data) return;
		const next = normalizePages(row.data.pages);
		setPages(next);
		setSavedSnap(snapshot(next));
		setCountInput(String(next.length));
		if (next.length > 0) {
			const first = Number(next[0]?.number);
			if (Number.isFinite(first)) setStartFrom(String(first));
		}
	}, [row.data]);

	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(null), 2800);
		return () => clearTimeout(t);
	}, [toast]);

	// Garde anti-fermeture d'onglet avec modifications non sauvées.
	const dirty = useMemo(() => snapshot(pages) !== savedSnap, [pages, savedSnap]);
	useEffect(() => {
		if (!dirty) return;
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", onBeforeUnload);
		return () => window.removeEventListener("beforeunload", onBeforeUnload);
	}, [dirty]);

	useEffect(() => {
		if (!scrollNew.current) return;
		scrollNew.current = false;
		listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
	}, [pages.length]);

	const save = useMutation({
		mutationFn: async () => {
			const cleaned = pages.map((p, i) => {
				const out: { number: number; image?: string; text?: string } = {
					number: parseNumber(p.number, i + 1),
				};
				const img = p.image.trim();
				const txt = p.text.trim();
				if (img) out.image = img;
				if (txt) out.text = txt;
				return out;
			});
			return client.put(`/db_databooks/${encodeURIComponent(databookId)}`, {
				pages: cleaned,
			});
		},
		onSuccess: () => {
			setSavedSnap(snapshot(pages));
			qc.invalidateQueries({ queryKey: ["wiki-studio", "db_databooks", databookId] });
			setToast("Pages enregistrées — cache public revalidé.");
		},
		onError: (e: Error) => setToast(`Erreur : ${e.message}`),
	});

	const resizeTo = (n: number) => {
		// Certains databooks dépassent 300 planches (ex. illustration books) → plafond 400.
		const target = Math.max(0, Math.min(400, Math.floor(n)));
		setPages((arr) => {
			if (target === arr.length) return arr;
			if (target < arr.length) {
				const dropped = arr.slice(target);
				const lostFilled = dropped.some((p) => p.image.trim() || p.text.trim());
				if (
					lostFilled &&
					typeof window !== "undefined" &&
					!window.confirm(
						`Réduire à ${target} page(s) supprimera ${dropped.length} slot(s) dont du contenu rempli. Continuer ?`
					)
				) {
					setCountInput(String(arr.length));
					return arr;
				}
				return arr.slice(0, target);
			}
			const added: DatabookPageDraft[] = [];
			let nextN = nextAutoNumber(arr);
			for (let k = 0; k < target - arr.length; k++) {
				added.push(emptyPage(nextN));
				nextN += 1;
			}
			if (added.length) scrollNew.current = true;
			return [...arr, ...added];
		});
		setCountInput(String(target));
	};

	/** Renumérote à partir de `startFrom` dans l'ordre actuel. */
	const renumberFrom = () => {
		const start = Math.max(0, Math.trunc(Number(startFrom) || 1));
		setPages((arr) => arr.map((p, i) => ({ ...p, number: String(start + i) })));
		setToast(
			`Numéros remis à ${start}…${start + Math.max(0, pages.length - 1)} (pense à enregistrer).`
		);
	};

	const update = (i: number, patch: Partial<DatabookPageDraft>) =>
		setPages((arr) => arr.map((p, j) => (j === i ? { ...p, ...patch } : p)));

	const move = (i: number, dir: -1 | 1) =>
		setPages((arr) => {
			const j = i + dir;
			if (j < 0 || j >= arr.length) return arr;
			const next = arr.slice();
			[next[i], next[j]] = [next[j], next[i]];
			return next;
		});

	const remove = (i: number) => {
		const page = pages[i];
		if (
			page &&
			(page.image.trim() || page.text.trim()) &&
			typeof window !== "undefined" &&
			!window.confirm(`Supprimer la page n°${page.number || i + 1} (contenu non vide) ?`)
		) {
			return;
		}
		setPages((arr) => {
			const next = arr.filter((_, j) => j !== i);
			setCountInput(String(next.length));
			return next;
		});
	};

	const dupNumbers = useMemo(() => {
		const seen = new Map<string, number>();
		const dups = new Set<string>();
		for (const p of pages) {
			const n = p.number.trim();
			if (!n) continue;
			if (seen.has(n)) dups.add(n);
			else seen.set(n, 1);
		}
		return dups;
	}, [pages]);

	if (row.isLoading) {
		return (
			<div className="dbz-panel flex items-center gap-2 p-5 text-sm text-white/50">
				<Loader2 className="h-4 w-4 animate-spin" /> Chargement des pages…
			</div>
		);
	}

	if (row.isError) {
		return (
			<div className="dbz-panel p-5 text-sm text-red-400">
				Impossible de charger les pages de ce databook.
			</div>
		);
	}

	const filled = pages.filter((p) => p.image.trim() || p.text.trim()).length;

	return (
		<div className="dbz-panel space-y-4 p-5">
			{toast && (
				<div className="rounded border border-dbz-orange/40 bg-dbz-orange/10 px-3 py-2 text-xs text-dbz-orange">
					{toast}
				</div>
			)}

			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h3 className="font-saiyan text-sm uppercase tracking-wider text-dbz-orange">
						Pages du lecteur
					</h3>
					<p className="mt-1 max-w-xl text-[11px] leading-relaxed text-white/50">
						Comme le manga : une planche par page, avec un{" "}
						<strong className="text-white/60">numéro</strong> (auto, modifiable) et un{" "}
						<strong className="text-white/60">texte en dessous</strong>. Fixe le nombre de pages
						d&apos;abord — tu n&apos;es pas obligé de tout remplir. L&apos;ordre de lecture = ordre
						des slots ; le n° est juste l&apos;étiquette affichée.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{dirty && (
						<span className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
							Non enregistré
						</span>
					)}
					<span className="rounded border border-dbz-border/50 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-wider text-white/50">
						{filled}/{pages.length} remplie{pages.length > 1 ? "s" : ""}
					</span>
				</div>
			</div>

			{dupNumbers.size > 0 && (
				<p className="rounded border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-200/90">
					Numéros en double : {Array.from(dupNumbers).join(", ")}. Tu peux les garder (ex.
					recto/verso) ou les corriger / renuméroter.
				</p>
			)}

			{/* Nombre de pages + actions */}
			<div className="flex flex-wrap items-end gap-3 rounded-lg border border-dbz-border/40 bg-black/20 p-3">
				<label className="block">
					<span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
						Nombre de pages
					</span>
					<input
						type="number"
						min={0}
						max={400}
						value={countInput}
						onChange={(e) => setCountInput(e.target.value)}
						onBlur={() => {
							const n = Number(countInput);
							if (Number.isFinite(n)) resizeTo(n);
							else setCountInput(String(pages.length));
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								const n = Number(countInput);
								if (Number.isFinite(n)) resizeTo(n);
							}
						}}
						className="input h-9 w-24 text-center font-mono tabular-nums"
					/>
				</label>
				<button
					type="button"
					className="btn btn-ghost h-9 px-3 text-xs"
					onClick={() => {
						const n = Number(countInput);
						if (Number.isFinite(n)) resizeTo(n);
					}}
				>
					Appliquer
				</button>
				<button
					type="button"
					className="btn btn-ghost h-9 px-3 text-xs"
					onClick={() => {
						setPages((arr) => {
							const next = [...arr, emptyPage(nextAutoNumber(arr))];
							setCountInput(String(next.length));
							scrollNew.current = true;
							return next;
						});
					}}
				>
					<Plus className="h-3.5 w-3.5" />
					Ajouter
				</button>

				<label className="block">
					<span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
						Renuméroter depuis
					</span>
					<input
						type="number"
						min={0}
						value={startFrom}
						onChange={(e) => setStartFrom(e.target.value)}
						className="input h-9 w-20 text-center font-mono tabular-nums"
						title="Premier numéro de la séquence"
					/>
				</label>
				<button
					type="button"
					className="btn btn-ghost h-9 px-3 text-xs"
					disabled={pages.length === 0}
					onClick={renumberFrom}
					title="Remet les numéros en séquence à partir du départ choisi"
				>
					<Hash className="h-3.5 w-3.5" />
					Renuméroter
				</button>

				<button
					type="button"
					className="btn btn-primary ml-auto h-9 px-4 text-xs"
					disabled={save.isPending || !dirty}
					onClick={() => save.mutate()}
				>
					{save.isPending ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<Save className="h-3.5 w-3.5" />
					)}
					Enregistrer les pages
				</button>
			</div>

			{pages.length === 0 ? (
				<p className="py-6 text-center text-sm text-white/50">
					Aucune page. Indique un nombre ci-dessus ou clique « Ajouter ».
				</p>
			) : (
				<ul className="space-y-4">
					{pages.map((page, i) => {
						const displayN = page.number.trim() || String(i + 1);
						const isDup = dupNumbers.has(page.number.trim());
						const isLast = i === pages.length - 1;
						return (
							<li
								key={page._key}
								ref={isLast ? listEndRef : undefined}
								className="rounded-lg border border-dbz-border/50 bg-black/25 p-4"
							>
								<div className="mb-3 flex flex-wrap items-center gap-2">
									<label
										className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 ${
											isDup ? "bg-amber-500/20 ring-1 ring-amber-400/50" : "bg-dbz-orange/15"
										}`}
									>
										<span className="text-[10px] font-bold uppercase tracking-wider text-dbz-orange/80">
											N°
										</span>
										<input
											type="number"
											inputMode="numeric"
											className="w-14 border-0 bg-transparent p-0 text-center font-mono text-[12px] font-bold tabular-nums text-dbz-orange outline-none focus:ring-0"
											value={page.number}
											onChange={(e) => update(i, { number: e.target.value })}
											onBlur={() => {
												const n = Number(page.number);
												if (!Number.isFinite(n)) update(i, { number: String(i + 1) });
												else update(i, { number: String(Math.trunc(n)) });
											}}
											aria-label={`Numéro de la page (slot ${i + 1})`}
											title="Numéro affiché (auto, modifiable)"
										/>
									</label>
									<span className="text-[10px] text-white/50">
										slot {i + 1}
										{displayN !== String(i + 1) ? ` · affiché n°${displayN}` : ""}
									</span>
									{!page.image.trim() && !page.text.trim() && (
										<span className="text-[10px] uppercase tracking-wider text-white/50">
											Slot vide
										</span>
									)}
									{isDup && (
										<span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/90">
											Doublon
										</span>
									)}
									<div className="ml-auto flex items-center gap-1">
										<button
											type="button"
											className="btn btn-ghost h-7 px-2"
											disabled={i === 0}
											onClick={() => move(i, -1)}
											title="Monter (change l'ordre de lecture, pas le n°)"
											aria-label={`Monter la page ${displayN}`}
										>
											<ChevronUp className="h-3.5 w-3.5" />
										</button>
										<button
											type="button"
											className="btn btn-ghost h-7 px-2"
											disabled={i === pages.length - 1}
											onClick={() => move(i, 1)}
											title="Descendre (change l'ordre de lecture, pas le n°)"
											aria-label={`Descendre la page ${displayN}`}
										>
											<ChevronDown className="h-3.5 w-3.5" />
										</button>
										<button
											type="button"
											className="btn btn-ghost h-7 px-2 text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
											onClick={() => remove(i)}
											title="Supprimer ce slot"
											aria-label={`Supprimer la page ${displayN}`}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</button>
									</div>
								</div>

								<div className="grid gap-4 lg:grid-cols-2">
									<div>
										<span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
											Image (planche)
										</span>
										<ImageField
											value={page.image}
											onChange={(v) => update(i, { image: v })}
											subdir="databooks"
											column={`page-${displayN}`}
										/>
									</div>
									<div>
										<label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
											Texte sous l&apos;image
										</label>
										<textarea
											className="input min-h-[140px] w-full resize-y text-sm leading-relaxed"
											placeholder="Description, légende, notes… (affiché sous la planche sur la page publique)"
											value={page.text}
											onChange={(e) => update(i, { text: e.target.value })}
											rows={6}
										/>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			)}

			{pages.length > 0 && (
				<button
					type="button"
					className="btn btn-primary w-full"
					disabled={save.isPending || !dirty}
					onClick={() => save.mutate()}
				>
					{save.isPending ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Save className="h-4 w-4" />
					)}
					{dirty ? "Enregistrer les pages" : "À jour"}
				</button>
			)}
		</div>
	);
}
