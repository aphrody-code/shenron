"use client";

/**
 * Édition rapide d'une bannière (hero de page et/ou série) — même pipeline que
 * `/admin/banners` (PageBanners). À monter sur les pages admin catalogues
 * (épisodes, films, sagas…) pour changer le billboard sans quitter le contexte.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Library, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ImageField } from "@/components/admin/ImageField";
import { assetUrl } from "@/lib/assets";
import {
	DEFAULT_PAGE_BANNERS,
	PAGE_HERO_LABELS,
	SERIES_BANNER_LABELS,
	type PageBannersConfig,
	type PageHeroKey,
	type SeriesBannerKey,
} from "@/lib/page-banners";

type LibraryItem = { value: string; url: string; name: string; group: string };

async function loadBanners(): Promise<{ banners: PageBannersConfig }> {
	const r = await fetch("/api/banner-config", { credentials: "same-origin" });
	if (!r.ok) throw new Error(`HTTP ${r.status}`);
	return r.json();
}

async function saveBanners(
	banners: PageBannersConfig
): Promise<{ ok: boolean; banners: PageBannersConfig }> {
	const r = await fetch("/api/banner-config", {
		method: "PUT",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(banners),
	});
	if (!r.ok) throw new Error((await r.text().catch(() => "")) || `HTTP ${r.status}`);
	return r.json();
}

async function loadLibrary(): Promise<LibraryItem[]> {
	const r = await fetch("/api/admin/banner-library", { credentials: "same-origin" });
	if (!r.ok) return [];
	const j = (await r.json()) as { items: LibraryItem[] };
	return j.items ?? [];
}

function preview(path: string): string {
	if (!path) return "";
	if (/^https?:\/\//i.test(path)) return path;
	return assetUrl(path);
}

export function BannerQuickEdit({
	pageKey,
	seriesKey,
	title = "Bannière",
}: {
	/** Hero de landing (ex. `episodes`). */
	pageKey?: PageHeroKey;
	/** Bannière de série (ex. `DBZ`) — vues /wiki/episodes/serie/DBZ. */
	seriesKey?: SeriesBannerKey | string;
	title?: string;
}) {
	const qc = useQueryClient();
	const q = useQuery({ queryKey: ["banner-config"], queryFn: loadBanners });
	const lib = useQuery({ queryKey: ["banner-library"], queryFn: loadLibrary, staleTime: 60_000 });
	const [cfg, setCfg] = useState<PageBannersConfig | null>(null);
	const [libOpen, setLibOpen] = useState(false);
	const [target, setTarget] = useState<"page" | "series">("page");
	const [toast, setToast] = useState<string | null>(null);

	useEffect(() => {
		if (q.data?.banners) setCfg(structuredClone(q.data.banners));
	}, [q.data]);

	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(null), 3000);
		return () => clearTimeout(t);
	}, [toast]);

	const pageVal = pageKey && cfg ? (cfg.pages[pageKey] ?? "") : "";
	const seriesVal = seriesKey && cfg ? (cfg.series[seriesKey] ?? "") : "";
	const pageDefault = pageKey ? DEFAULT_PAGE_BANNERS.pages[pageKey] : "";
	const seriesDefault =
		seriesKey && seriesKey in DEFAULT_PAGE_BANNERS.series
			? DEFAULT_PAGE_BANNERS.series[seriesKey]
			: DEFAULT_PAGE_BANNERS.fallback;

	const save = useMutation({
		mutationFn: () => saveBanners(cfg as PageBannersConfig),
		onSuccess: (res) => {
			setCfg(res.banners);
			qc.setQueryData(["banner-config"], { banners: res.banners });
			setToast("Bannière enregistrée — page revalidée.");
		},
		onError: (e: Error) => setToast(`Échec : ${e.message}`),
	});

	const pick = (value: string) => {
		if (!cfg) return;
		if (target === "page" && pageKey) {
			setCfg({ ...cfg, pages: { ...cfg.pages, [pageKey]: value } });
		} else if (target === "series" && seriesKey) {
			setCfg({ ...cfg, series: { ...cfg.series, [seriesKey]: value } });
		}
		setLibOpen(false);
	};

	const focusHref = useMemo(() => {
		const p = new URLSearchParams();
		if (pageKey) p.set("page", pageKey);
		if (seriesKey) p.set("series", seriesKey);
		return `/admin/banners?${p.toString()}`;
	}, [pageKey, seriesKey]);

	if (q.isLoading || !cfg) {
		return <div className="dbz-panel p-4 text-sm text-white/40">Chargement de la bannière…</div>;
	}

	return (
		<div className="dbz-panel space-y-4 p-5">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h3 className="font-saiyan text-lg uppercase tracking-wider text-dbz-orange">{title}</h3>
					<p className="mt-0.5 text-xs text-white/45">
						Billboard / hero de la page publique. Upload, URL, ou galerie officielle Toei.
					</p>
				</div>
				<Link href={focusHref} className="btn btn-ghost text-xs">
					Éditeur complet
				</Link>
			</div>

			{toast && <p className="text-xs text-dbz-orange">{toast}</p>}

			{pageKey && (
				<div className="space-y-2">
					<div className="flex items-center justify-between gap-2">
						<label className="text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
							{PAGE_HERO_LABELS[pageKey] ?? pageKey}
						</label>
						<button
							type="button"
							className="btn btn-ghost h-7 px-2 text-xs"
							onClick={() => {
								setTarget("page");
								setLibOpen(true);
							}}
						>
							<Library className="h-3.5 w-3.5" />
							Galerie
						</button>
					</div>
					<div className="relative mb-2 h-28 w-full overflow-hidden rounded border border-dbz-border bg-black/40">
						{pageVal ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={preview(pageVal)} alt="" className="h-full w-full object-cover" />
						) : (
							<div className="flex h-full items-center justify-center text-white/20">
								<ImageIcon className="h-8 w-8" />
							</div>
						)}
					</div>
					<ImageField
						value={pageVal}
						onChange={(v) =>
							setCfg((c) => (c && pageKey ? { ...c, pages: { ...c.pages, [pageKey]: v } } : c))
						}
						subdir="banners"
						column={pageKey}
					/>
					{pageVal !== pageDefault && (
						<button
							type="button"
							className="text-[11px] text-white/40 hover:text-dbz-orange"
							onClick={() =>
								setCfg((c) =>
									c && pageKey ? { ...c, pages: { ...c.pages, [pageKey]: pageDefault } } : c
								)
							}
						>
							Revenir au défaut
						</button>
					)}
				</div>
			)}

			{seriesKey && (
				<div className="space-y-2 border-t border-dbz-border/40 pt-4">
					<div className="flex items-center justify-between gap-2">
						<label className="text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
							Série · {(SERIES_BANNER_LABELS as Record<string, string>)[seriesKey] ?? seriesKey}
						</label>
						<button
							type="button"
							className="btn btn-ghost h-7 px-2 text-xs"
							onClick={() => {
								setTarget("series");
								setLibOpen(true);
							}}
						>
							<Library className="h-3.5 w-3.5" />
							Galerie
						</button>
					</div>
					<div className="relative mb-2 h-20 w-full overflow-hidden rounded border border-dbz-border bg-black/40">
						{seriesVal ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={preview(seriesVal)} alt="" className="h-full w-full object-cover" />
						) : (
							<div className="flex h-full items-center justify-center text-white/20">
								<ImageIcon className="h-6 w-6" />
							</div>
						)}
					</div>
					<ImageField
						value={seriesVal}
						onChange={(v) =>
							setCfg((c) =>
								c && seriesKey ? { ...c, series: { ...c.series, [seriesKey]: v } } : c
							)
						}
						subdir="banners"
						column={seriesKey}
					/>
					{seriesVal !== seriesDefault && (
						<button
							type="button"
							className="text-[11px] text-white/40 hover:text-dbz-orange"
							onClick={() =>
								setCfg((c) =>
									c && seriesKey ? { ...c, series: { ...c.series, [seriesKey]: seriesDefault } } : c
								)
							}
						>
							Revenir au défaut
						</button>
					)}
				</div>
			)}

			<button
				type="button"
				className="btn btn-primary w-full"
				disabled={save.isPending}
				onClick={() => save.mutate()}
			>
				<Save className="h-4 w-4" />
				{save.isPending ? "Enregistrement…" : "Enregistrer la bannière"}
			</button>

			{libOpen && (
				<div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur">
					<div className="dbz-panel flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden">
						<div className="flex items-center justify-between border-b border-dbz-border/50 p-4">
							<p className="font-saiyan text-sm uppercase text-dbz-orange">Galerie bannières</p>
							<button type="button" className="btn btn-ghost" onClick={() => setLibOpen(false)}>
								Fermer
							</button>
						</div>
						<div className="overflow-y-auto p-4">
							{lib.isLoading ? (
								<p className="py-8 text-center text-sm text-white/40">Chargement…</p>
							) : (lib.data?.length ?? 0) === 0 ? (
								<p className="py-8 text-center text-sm text-white/40">
									Aucune image trouvée (toei / dbofficial / wiki/banners).
								</p>
							) : (
								<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
									{(lib.data ?? []).map((it) => (
										<button
											key={it.value}
											type="button"
											onClick={() => pick(it.value)}
											className="group overflow-hidden rounded-lg border border-dbz-border bg-black/30 text-left hover:border-dbz-orange"
											title={it.name}
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={it.url}
												alt=""
												className="aspect-[16/7] w-full object-cover opacity-80 group-hover:opacity-100"
												loading="lazy"
											/>
											<p className="truncate px-2 py-1 text-[10px] text-white/50">{it.name}</p>
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
