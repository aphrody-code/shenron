"use client";

/**
 * Lecteur de databook / interview — format manga + légende.
 *
 * Deux modes :
 *  - Vertical (défaut) : défilement webtoon, image puis texte en dessous.
 *  - Paginé : une planche à la fois (Swiper). Sur grand écran, layout
 *    planche | texte côte à côte pour que les légendes longues ne mangent
 *    plus l'image. Clic sur la planche → lightbox plein écran.
 *
 * Les pages sans image ni texte sont filtrées côté public (slots admin vides).
 * LTR par défaut. Affiche le `number` éditorial (pas seulement l'index).
 */

import { type ReactElement, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Maximize2,
	Minimize2,
	ScrollText,
	X,
	ZoomIn,
} from "lucide-react";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { Keyboard, Mousewheel, Virtual, Zoom } from "swiper/modules";

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/virtual";

import { assetUrl } from "@/lib/assets";
import { useFocusTrap } from "@/lib/use-focus-trap";

export type DatabookReaderPage = {
	/** Numéro affiché (auto 1…N, modifiable côté admin). */
	number?: number | null;
	image?: string | null;
	text?: string | null;
};

export type DatabookReaderProps = {
	pages: DatabookReaderPage[];
	title: string;
};

type ViewMode = "paged" | "vertical";

type ResolvedPage = {
	/** Numéro affiché (édition admin) — pas forcément = position dans le lecteur. */
	number: number;
	imageUrl: string | null;
	text: string | null;
};

const SHOW_STRIP_MAX = 40;

function pageNumber(p: DatabookReaderPage, fallback: number): number {
	const raw = p.number as unknown;
	if (typeof raw === "number" && Number.isFinite(raw)) return Math.trunc(raw);
	if (typeof raw === "string" && String(raw).trim() && Number.isFinite(Number(raw))) {
		return Math.trunc(Number(raw));
	}
	return fallback;
}

function resolvePages(pages: DatabookReaderPage[]): ResolvedPage[] {
	const out: ResolvedPage[] = [];
	for (let i = 0; i < pages.length; i++) {
		const p = pages[i];
		const img = typeof p.image === "string" && p.image.trim() ? p.image.trim() : null;
		const text = typeof p.text === "string" && p.text.trim() ? p.text.trim() : null;
		if (!img && !text) continue;
		out.push({
			number: pageNumber(p, i + 1),
			imageUrl: img ? assetUrl(img) : null,
			text,
		});
	}
	return out;
}

export function DatabookReader({ pages, title }: DatabookReaderProps): ReactElement {
	const containerRef = useRef<HTMLDivElement>(null);
	const swiperRef = useRef<SwiperClass | null>(null);
	const lightboxRef = useRef<HTMLDivElement>(null);
	const baseId = useId();

	const items = useMemo(() => resolvePages(pages), [pages]);
	const total = items.length;

	const [mode, setMode] = useState<ViewMode>("vertical");
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [current, setCurrent] = useState(0);
	/** Lightbox plein écran sur la planche courante (indépendant du mode). */
	const [lightbox, setLightbox] = useState(false);
	useFocusTrap(lightboxRef, lightbox, () => setLightbox(false));

	// Clamp l'index si le nombre de pages change (édition live / revalidation).
	useEffect(() => {
		if (current >= total && total > 0) setCurrent(total - 1);
		if (total === 0) setCurrent(0);
	}, [total, current]);

	// Précharge planche courante ± voisines.
	useEffect(() => {
		if (total === 0) return;
		for (const idx of [current - 1, current, current + 1, current + 2]) {
			const url = items[idx]?.imageUrl;
			if (!url) continue;
			const img = new Image();
			img.src = url;
		}
	}, [current, items, total]);

	const toggleFullscreen = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;
		if (document.fullscreenElement) void document.exitFullscreen();
		else void el.requestFullscreen?.();
	}, []);

	useEffect(() => {
		const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", onChange);
		return () => document.removeEventListener("fullscreenchange", onChange);
	}, []);

	// Navigation clavier des planches.
	//
	// Les flèches ne fonctionnaient QUE la visionneuse ouverte : en mode paginé,
	// tourner les pages au clavier était impossible — il fallait viser les deux
	// boutons à la souris. Elles pilotent désormais aussi le mode paginé, et
	// `Début`/`Fin` sautent aux extrémités.
	useEffect(() => {
		const actif = lightbox || mode === "paged";
		if (!actif) return;
		const onKey = (e: KeyboardEvent) => {
			const cible = e.target as HTMLElement | null;
			const tag = cible?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || cible?.isContentEditable) return;
			switch (e.key) {
				case "Escape":
					if (lightbox) setLightbox(false);
					return;
				case "ArrowLeft":
					e.preventDefault();
					setCurrent((c) => Math.max(0, c - 1));
					return;
				case "ArrowRight":
					e.preventDefault();
					setCurrent((c) => Math.min(total - 1, c + 1));
					return;
				case "Home":
					e.preventDefault();
					setCurrent(0);
					return;
				case "End":
					e.preventDefault();
					setCurrent(total - 1);
					return;
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [lightbox, mode, total]);

	// Bloque le scroll body quand lightbox ouverte.
	useEffect(() => {
		if (!lightbox) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [lightbox]);

	const handleSwiper = useCallback((sw: SwiperClass) => {
		swiperRef.current = sw;
		setCurrent(sw.realIndex ?? sw.activeIndex ?? 0);
	}, []);

	const handleSlideChange = useCallback((sw: SwiperClass) => {
		setCurrent(sw.realIndex ?? sw.activeIndex ?? 0);
	}, []);

	/* ------------------------------ Vertical ------------------------------ */

	const scrollParentRef = useRef<HTMLDivElement>(null);
	const virtualizer = useVirtualizer({
		count: total,
		getScrollElement: () => scrollParentRef.current,
		estimateSize: () =>
			typeof window === "undefined" ? 1100 : Math.round(window.innerHeight * 0.95),
		overscan: 2,
	});

	const goTo = useCallback(
		(idx: number) => {
			const i = Math.min(Math.max(idx, 0), Math.max(0, total - 1));
			setCurrent(i);
			if (mode === "paged") swiperRef.current?.slideTo(i);
			else virtualizer.scrollToIndex(i, { align: "start" });
		},
		[mode, total, virtualizer]
	);

	useEffect(() => {
		if (mode !== "vertical") return;
		const el = scrollParentRef.current;
		if (!el) return;
		const onScroll = () => {
			const mid = el.scrollTop + el.clientHeight / 2;
			const item = virtualizer.getVirtualItems().find((vi) => vi.start <= mid && vi.end >= mid);
			if (item) setCurrent(item.index);
		};
		el.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => el.removeEventListener("scroll", onScroll);
	}, [mode, virtualizer]);

	const goPrevPage = useCallback(() => {
		goTo(current - 1);
	}, [current, goTo]);

	const goNextPage = useCallback(() => {
		goTo(current + 1);
	}, [current, goTo]);

	const openLightbox = useCallback(
		(idx?: number) => {
			if (typeof idx === "number") setCurrent(idx);
			const item = items[typeof idx === "number" ? idx : current];
			if (item?.imageUrl) setLightbox(true);
		},
		[items, current]
	);

	const btn =
		"inline-flex items-center justify-center gap-1.5 rounded-md border border-dbz-border bg-dbz-bg px-2.5 py-1.5 text-xs font-bold text-dbz-blue-light transition-colors hover:border-dbz-orange hover:text-dbz-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40";
	const btnActive =
		"inline-flex items-center justify-center gap-1.5 rounded-md border border-dbz-orange bg-dbz-bg px-2.5 py-1.5 text-xs font-bold text-dbz-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black";

	const currentItem = items[current];
	const currentNum = currentItem?.number ?? current + 1;
	const counter = total ? `n°${currentNum} · ${Math.min(current + 1, total)}/${total}` : "0 / 0";
	const currentText = currentItem?.text ?? null;
	const currentImage = currentItem?.imageUrl ?? null;

	if (total === 0) {
		return (
			<div className="dbz-panel flex min-h-[200px] items-center justify-center rounded-lg p-8 text-sm text-white/50">
				Aucune page à afficher pour le moment.
			</div>
		);
	}

	const legendBlock = (
		<div className="flex h-full min-h-0 flex-col">
			<p
				// Région live : tourner une page ne change qu'une image et un bloc de
				// texte, sans rien qui l'annonce. Un lecteur d'écran restait muet sur le
				// changement — l'utilisateur ne savait pas où il en était.
				aria-live="polite"
				aria-atomic="true"
				className="mb-2 shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-dbz-orange/80"
			>
				Page {currentNum}
				<span className="ml-2 font-normal normal-case tracking-normal text-white/50">
					({current + 1}/{total})
				</span>
			</p>
			<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 scrollbar-thin">
				{currentText ? (
					<p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">{currentText}</p>
				) : (
					<p className="text-sm italic text-white/50">Aucune description pour cette page.</p>
				)}
			</div>
		</div>
	);

	return (
		<div
			ref={containerRef}
			className="flex h-[82vh] min-h-[480px] w-full min-w-0 flex-col overflow-hidden rounded-lg bg-black [&:fullscreen]:h-screen [&:fullscreen]:min-h-screen [&:fullscreen]:rounded-none"
			data-databook-reader
		>
			{/* Barre de contrôles */}
			<div className="dbz-panel z-10 flex flex-wrap items-center gap-2 border-b border-dbz-border px-3 py-2">
				<span className="mr-1 min-w-0 max-w-[40ch] truncate text-sm font-bold text-white">
					{title}
				</span>
				<span className="ml-auto rounded bg-dbz-bg px-2 py-1 text-xs font-bold tabular-nums text-dbz-orange">
					{counter}
				</span>

				<button
					type="button"
					className={mode === "vertical" ? btnActive : btn}
					onClick={() => setMode("vertical")}
					aria-pressed={mode === "vertical"}
					title="Mode vertical (planche + texte)"
				>
					<ScrollText size={14} aria-hidden /> Vertical
				</button>
				<button
					type="button"
					className={mode === "paged" ? btnActive : btn}
					onClick={() => setMode("paged")}
					aria-pressed={mode === "paged"}
					title="Mode paginé"
				>
					<BookOpen size={14} aria-hidden /> Paginé
				</button>
				<button
					type="button"
					className={btn}
					onClick={() => openLightbox()}
					disabled={!currentImage}
					aria-label="Agrandir la planche"
					title="Agrandir la planche"
				>
					<ZoomIn size={14} aria-hidden />
				</button>
				<button
					type="button"
					className={btn}
					onClick={toggleFullscreen}
					aria-label={isFullscreen ? "Quitter le plein écran" : "Activer le plein écran"}
					title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
				>
					{isFullscreen ? <Minimize2 size={14} aria-hidden /> : <Maximize2 size={14} aria-hidden />}
				</button>
			</div>

			{/* Zone de lecture */}
			<div className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-dbz-bg">
				{mode === "paged" ? (
					/* Layout côte à côte ≥ lg : planche fixe à gauche, texte scrollable
					   à droite — les légendes longues ne réduisent plus l'image. */
					<div className="flex h-full min-h-0 flex-col lg:flex-row">
						{/* Zone planche */}
						<div className="relative min-h-[42%] min-w-0 flex-[1.15] lg:min-h-0 lg:h-full">
							<Swiper
								key="databook-ltr"
								initialSlide={current}
								dir="ltr"
								modules={[Keyboard, Zoom, Virtual, Mousewheel]}
								className="h-full w-full"
								slidesPerView={1}
								keyboard={{ enabled: true }}
								mousewheel={{ forceToAxis: true }}
								zoom={{ maxRatio: 3, toggle: true }}
								virtual
								onSwiper={handleSwiper}
								onSlideChange={handleSlideChange}
							>
								{items.map((item, i) => (
									<SwiperSlide
										key={`db-page-${item.number}-${i}`}
										virtualIndex={i}
										zoom={Boolean(item.imageUrl)}
										className="flex items-center justify-center"
									>
										<div className="swiper-zoom-container flex h-full w-full items-center justify-center bg-black">
											{item.imageUrl ? (
												<button
													type="button"
													className="group relative flex h-full w-full cursor-zoom-in items-center justify-center border-0 bg-transparent p-0"
													onClick={() => openLightbox(i)}
													aria-label={`Agrandir la page ${item.number}`}
												>
													{/* eslint-disable-next-line @next/next/no-img-element */}
													<img
														src={item.imageUrl}
														alt={`${title} — page ${item.number}`}
														loading={Math.abs(i - current) <= 1 ? "eager" : "lazy"}
														draggable={false}
														className="max-h-full max-w-full object-contain transition-opacity group-hover:opacity-95"
													/>
													<span className="pointer-events-none absolute right-3 bottom-3 rounded-md border border-white/15 bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
														Agrandir
													</span>
												</button>
											) : (
												<div className="px-6 text-center text-sm text-white/50">
													Page {item.number} — pas d&apos;image
												</div>
											)}
										</div>
									</SwiperSlide>
								))}
							</Swiper>

							<button
								type="button"
								aria-label="Page précédente"
								onClick={goPrevPage}
								disabled={current <= 0}
								className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full border border-dbz-border bg-black/60 p-3 text-white transition-colors hover:border-dbz-orange hover:text-dbz-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange disabled:opacity-30"
							>
								<ChevronLeft size={20} aria-hidden />
							</button>
							<button
								type="button"
								aria-label="Page suivante"
								onClick={goNextPage}
								disabled={current >= total - 1}
								className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full border border-dbz-border bg-black/60 p-3 text-white transition-colors hover:border-dbz-orange hover:text-dbz-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange disabled:opacity-30"
							>
								<ChevronRight size={20} aria-hidden />
							</button>
						</div>

						{/* Légende — panneau scrollable indépendant (ne compresse plus l'image). */}
						<div className="min-h-0 max-h-[48%] shrink-0 border-t border-dbz-border bg-black/90 px-4 py-3 sm:px-5 sm:py-4 lg:max-h-none lg:w-[min(420px,38%)] lg:border-t-0 lg:border-l lg:overflow-hidden">
							{legendBlock}
						</div>
					</div>
				) : (
					<div
						ref={scrollParentRef}
						tabIndex={0}
						className="h-full w-full overflow-y-auto overflow-x-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dbz-orange"
						aria-label={`${title} — lecture verticale`}
					>
						<div
							style={{
								height: virtualizer.getTotalSize(),
								width: "100%",
								position: "relative",
							}}
						>
							{virtualizer.getVirtualItems().map((vi) => {
								const item = items[vi.index];
								if (!item) return null;
								return (
									<div
										key={`${baseId}-${vi.key}`}
										data-index={vi.index}
										ref={virtualizer.measureElement}
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											transform: `translateY(${vi.start}px)`,
										}}
										className="border-b border-white/5 px-2 py-4 sm:px-4 sm:py-6"
									>
										<div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
											<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-dbz-orange/70">
												Page {item.number}
											</span>
											{item.imageUrl ? (
												<button
													type="button"
													className="group cursor-zoom-in border-0 bg-transparent p-0 text-left"
													onClick={() => openLightbox(vi.index)}
													aria-label={`Agrandir la page ${item.number}`}
												>
													{/* eslint-disable-next-line @next/next/no-img-element */}
													<img
														src={item.imageUrl}
														alt={`${title} — page ${item.number}`}
														loading={Math.abs(vi.index - current) <= 1 ? "eager" : "lazy"}
														draggable={false}
														className="h-auto w-full rounded-sm bg-black object-contain shadow-[0_0_24px_rgba(0,0,0,0.45)] transition-opacity group-hover:opacity-95"
													/>
												</button>
											) : (
												<div className="flex min-h-[120px] items-center justify-center rounded border border-dashed border-white/10 bg-black/40 text-sm text-white/50">
													Pas d&apos;image pour cette page
												</div>
											)}
											{item.text ? (
												<div className="rounded-md border border-dbz-border/40 bg-black/50 px-4 py-3">
													<p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
														{item.text}
													</p>
												</div>
											) : null}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>

			{/* Bande de vignettes (databooks courts). */}
			{mode === "paged" && total > 0 && total <= SHOW_STRIP_MAX && (
				<div className="z-10 flex items-center gap-4 overflow-x-auto border-t border-dbz-border bg-black/90 px-4 py-3 scrollbar-thin">
					<div className="mx-auto flex gap-2">
						{items.map((item, idx) => (
							<button
								key={`thumb-${item.number}-${idx}`}
								type="button"
								onClick={() => goTo(idx)}
								className={`relative h-16 w-12 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
									current === idx
										? "scale-105 border-dbz-orange shadow-[0_0_10px_rgba(255,178,0,0.4)]"
										: "border-white/10 hover:border-white/30"
								}`}
								title={`Page ${item.number}`}
								aria-label={`Aller à la page ${item.number}`}
								aria-current={current === idx ? "true" : undefined}
							>
								{item.imageUrl ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={item.imageUrl}
										alt=""
										className="h-full w-full object-cover"
										loading="lazy"
									/>
								) : (
									<span className="flex h-full w-full items-center justify-center bg-zinc-900 text-[9px] text-white/50">
										txt
									</span>
								)}
								<span className="absolute inset-x-0 bottom-0 bg-black/70 text-center font-mono text-[8px] font-bold text-white">
									{item.number}
								</span>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Saut direct pour les longs databooks. */}
			{mode === "paged" && total > SHOW_STRIP_MAX && (
				<form
					className="z-10 flex items-center justify-center gap-3 border-t border-dbz-border bg-black/90 px-4 py-3"
					onSubmit={(e) => {
						e.preventDefault();
						const field = e.currentTarget.elements.namedItem("goto") as HTMLInputElement | null;
						const wanted = Number(field?.value);
						if (!Number.isFinite(wanted)) return;
						// Cherche d'abord par numéro éditorial, sinon par position 1-based.
						const byNumber = items.findIndex((it) => it.number === Math.trunc(wanted));
						if (byNumber >= 0) goTo(byNumber);
						else goTo(Math.trunc(wanted) - 1);
					}}
				>
					<label
						htmlFor={`${baseId}-goto`}
						className="text-xs font-bold uppercase tracking-wider text-dbz-blue-light"
					>
						Aller à n°
					</label>
					<input
						id={`${baseId}-goto`}
						name="goto"
						type="number"
						key={currentNum}
						defaultValue={currentNum}
						className="w-20 rounded-md border border-dbz-border bg-dbz-bg px-2 py-1 text-center text-sm font-bold tabular-nums text-dbz-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange"
					/>
					<button
						type="submit"
						className="rounded-md border border-dbz-border bg-dbz-bg px-3 py-1 text-xs font-bold text-dbz-blue-light transition-colors hover:border-dbz-orange hover:text-dbz-orange"
					>
						OK
					</button>
				</form>
			)}

			{/* Lightbox agrandissement planche */}
			{lightbox && currentImage && (
				<div
					ref={lightboxRef}
					// `tabIndex={-1}` : requis par `useFocusTrap`, qui donne le focus au
					// panneau à l'ouverture. Sans piège, la tabulation continuait DERRIÈRE
					// la visionneuse plein écran — le focus disparaissait pour l'utilisateur
					// clavier et pour le lecteur d'écran.
					tabIndex={-1}
					role="dialog"
					aria-modal="true"
					aria-label={`${title} — page ${currentNum} agrandie`}
					className="fixed inset-0 z-[100] flex flex-col bg-black/95"
					onClick={() => setLightbox(false)}
				>
					<div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
						<span className="min-w-0 truncate text-sm font-bold text-white">{title}</span>
						<span className="rounded bg-white/10 px-2 py-0.5 text-xs font-bold tabular-nums text-dbz-orange">
							n°{currentNum}
						</span>
						<button
							type="button"
							className="ml-auto rounded-md border border-white/15 bg-white/5 p-2 text-white hover:border-dbz-orange hover:text-dbz-orange"
							onClick={(e) => {
								e.stopPropagation();
								setLightbox(false);
							}}
							aria-label="Fermer"
						>
							<X size={18} aria-hidden />
						</button>
					</div>
					<div
						className="relative flex min-h-0 flex-1 items-center justify-center p-4"
						onClick={(e) => e.stopPropagation()}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={currentImage}
							alt={`${title} — page ${currentNum}`}
							className="max-h-full max-w-full object-contain"
							draggable={false}
						/>
						<button
							type="button"
							aria-label="Page précédente"
							onClick={() => goTo(current - 1)}
							disabled={current <= 0}
							className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-3 text-white hover:border-dbz-orange hover:text-dbz-orange disabled:opacity-30"
						>
							<ChevronLeft size={22} aria-hidden />
						</button>
						<button
							type="button"
							aria-label="Page suivante"
							onClick={() => goTo(current + 1)}
							disabled={current >= total - 1}
							className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-3 text-white hover:border-dbz-orange hover:text-dbz-orange disabled:opacity-30"
						>
							<ChevronRight size={22} aria-hidden />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
