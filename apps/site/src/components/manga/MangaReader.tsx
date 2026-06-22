"use client";

/**
 * Lecteur de scan manga complet, 100 % client.
 *
 * Deux modes togglables :
 *  - Paginé   : Swiper (Keyboard, Zoom, Virtual, Mousewheel), RTL réel,
 *               double-page optionnelle sur grand écran.
 *  - Vertical : défilement webtoon virtualisé via `@tanstack/react-virtual`
 *               (mesure dynamique des planches, overscan raisonnable).
 *
 * Les `pages` reçues sont des chemins bruts (`./assets/.../x.webp`) : le
 * composant applique `assetUrl` en interne. Aucun import server-only
 * (`db-universe`/`shenron`) — seulement `@/lib/assets`.
 */

import Link from "next/link";
import { type ReactElement, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";
import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Columns2,
	Maximize2,
	Minimize2,
	MoveHorizontal,
	ScrollText,
	Square,
} from "lucide-react";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { Keyboard, Mousewheel, Virtual, Zoom } from "swiper/modules";

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/virtual";

import { assetUrl } from "@/lib/assets";

export type MangaReaderProps = {
	pages: string[];
	title: string;
	direction?: "rtl" | "ltr";
	prevHref?: string | null;
	nextHref?: string | null;
	prevPages?: string[] | null;
	nextPages?: string[] | null;
	chapterId?: number;
	chapterNumber?: number;
	series?: string;
	chapterTitle?: string | null;
};

type ViewMode = "paged" | "vertical";

const LG_BREAKPOINT = 1024; // Tailwind `lg`

/** Détecte le passage sous/au-delà du breakpoint `lg` pour la double-page. */
function useIsLargeScreen(): boolean {
	const [isLarge, setIsLarge] = useState(false);
	useEffect(() => {
		const mql = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);
		const sync = () => setIsLarge(mql.matches);
		sync();
		mql.addEventListener("change", sync);
		return () => mql.removeEventListener("change", sync);
	}, []);
	return isLarge;
}

export function MangaReader({
	pages,
	title,
	direction = "rtl",
	prevHref = null,
	nextHref = null,
	prevPages = null,
	nextPages = null,
	chapterId,
	chapterNumber,
	series,
	chapterTitle,
}: MangaReaderProps): ReactElement {
	const containerRef = useRef<HTMLDivElement>(null);
	const swiperRef = useRef<SwiperClass | null>(null);

	useEffect(() => {
		if (!chapterId) return;
		try {
			const saved = localStorage.getItem("dbfr_read_chapters");
			let readIds: number[] = [];
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					readIds = parsed.map(Number);
				}
			}
			if (!readIds.includes(chapterId)) {
				readIds.push(chapterId);
				localStorage.setItem("dbfr_read_chapters", JSON.stringify(readIds));
			}

			// Save last read info
			const lastReadInfo = {
				id: chapterId,
				chapter_number: chapterNumber ?? 0,
				title: chapterTitle || null,
				series: series || "DBS",
			};
			localStorage.setItem("dbfr_last_read_chapter", JSON.stringify(lastReadInfo));
		} catch (e) {
			console.error("Failed to save read chapter", e);
		}
	}, [chapterId, chapterNumber, series, chapterTitle]);

	const [mode, setMode] = useState<ViewMode>("paged");
	const [dir, setDir] = useState<"rtl" | "ltr">(direction);
	const [spread, setSpread] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [current, setCurrent] = useState(0);

	const isLarge = useIsLargeScreen();
	// Double-page seulement effective sur grand écran (lisibilité mobile).
	const useSpread = spread && isLarge && mode === "paged";

	// Résolution des URL absolues une seule fois (les chemins sont stables).
	const urls = useMemo(() => pages.map((p) => assetUrl(p)), [pages]);
	const total = urls.length;
	const baseId = useId();

	// Préchargement intelligent des planches en arrière-plan
	useEffect(() => {
		if (urls.length === 0) return;
		// 1. Précharge la page courante, la précédente (retour arrière) et les 3 suivantes
		const indices = [current, current - 1, current + 1, current + 2, current + 3];
		for (const idx of indices) {
			if (idx >= 0 && idx < urls.length) {
				const img = new Image();
				img.src = urls[idx];
			}
		}

		// 2. Précharge les 3 premières pages du chapitre suivant en arrière-plan
		if (nextPages && nextPages.length > 0) {
			nextPages.slice(0, 3).forEach((page) => {
				const img = new Image();
				img.src = assetUrl(page);
			});
		}

		// 3. Précharge les 3 dernières pages du chapitre précédent en arrière-plan (si l'utilisateur veut revenir en arrière)
		if (prevPages && prevPages.length > 0) {
			prevPages.slice(-3).forEach((page) => {
				const img = new Image();
				img.src = assetUrl(page);
			});
		}
	}, [current, urls, prevPages, nextPages]);

	/* ----------------------------- Fullscreen ----------------------------- */

	const toggleFullscreen = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;
		if (document.fullscreenElement) {
			void document.exitFullscreen();
		} else {
			void el.requestFullscreen?.();
		}
	}, []);

	useEffect(() => {
		const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", onChange);
		return () => document.removeEventListener("fullscreenchange", onChange);
	}, []);

	/* ------------------------------- Swiper ------------------------------- */

	const handleSwiper = useCallback((sw: SwiperClass) => {
		swiperRef.current = sw;
		setCurrent(sw.realIndex ?? sw.activeIndex ?? 0);
	}, []);

	const handleSlideChange = useCallback((sw: SwiperClass) => {
		setCurrent(sw.realIndex ?? sw.activeIndex ?? 0);
	}, []);

	// Swiper ne réagit pas seul au changement de `dir`/`spread` : on force
	// une mise à jour de l'instance quand ces options changent.
	useEffect(() => {
		swiperRef.current?.update();
	}, [useSpread]);

	/* ------------------------------ Vertical ------------------------------ */

	const scrollParentRef = useRef<HTMLDivElement>(null);
	const virtualizer = useVirtualizer({
		count: total,
		getScrollElement: () => scrollParentRef.current,
		// Estimation ~ hauteur viewport ; remplacée par la mesure réelle.
		estimateSize: () => (typeof window === "undefined" ? 900 : window.innerHeight),
		overscan: 3,
	});

	// Synchronise le compteur en mode vertical sur la page la plus visible.
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

	/* ------------------------------ Contrôles ----------------------------- */

	const goPrevPage = useCallback(() => {
		if (mode === "paged") swiperRef.current?.slidePrev();
		else virtualizer.scrollToIndex(Math.max(0, current - 1), { align: "start" });
	}, [mode, current, virtualizer]);

	const goNextPage = useCallback(() => {
		if (mode === "paged") swiperRef.current?.slideNext();
		else
			virtualizer.scrollToIndex(Math.min(total - 1, current + 1), {
				align: "start",
			});
	}, [mode, current, total, virtualizer]);

	const btn =
		"inline-flex items-center justify-center gap-1.5 rounded-md border border-dbz-border bg-dbz-bg px-2.5 py-1.5 text-xs font-bold text-dbz-blue-light transition-colors hover:border-dbz-orange hover:text-dbz-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40";
	const btnActive =
		"inline-flex items-center justify-center gap-1.5 rounded-md border border-dbz-orange bg-dbz-bg px-2.5 py-1.5 text-xs font-bold text-dbz-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black";

	const counter = total ? `${Math.min(current + 1, total)} / ${total}` : "0 / 0";

	return (
		<div
			ref={containerRef}
			className="flex h-[78vh] min-h-[420px] w-full min-w-0 flex-col overflow-hidden rounded-lg bg-black [&:fullscreen]:h-screen [&:fullscreen]:min-h-screen [&:fullscreen]:rounded-none"
			data-manga-reader
		>
			{/* Barre de contrôles */}
			<div className="dbz-panel z-10 flex flex-wrap items-center gap-2 border-b border-dbz-border px-3 py-2">
				<span className="mr-1 min-w-0 max-w-[40ch] truncate text-sm font-bold text-white">{title}</span>

				<span className="ml-auto rounded bg-dbz-bg px-2 py-1 text-xs font-bold tabular-nums text-dbz-orange">
					{counter}
				</span>

				{/* Toggle mode lecture */}
				<button
					type="button"
					className={mode === "paged" ? btnActive : btn}
					onClick={() => setMode("paged")}
					aria-pressed={mode === "paged"}
					aria-label="Mode de lecture paginé"
					title="Mode paginé"
				>
					<BookOpen size={14} aria-hidden /> Paginé
				</button>
				<button
					type="button"
					className={mode === "vertical" ? btnActive : btn}
					onClick={() => setMode("vertical")}
					aria-pressed={mode === "vertical"}
					aria-label="Mode de lecture vertical (webtoon)"
					title="Mode vertical (webtoon)"
				>
					<ScrollText size={14} aria-hidden /> Vertical
				</button>

				{/* Toggle sens de lecture */}
				<button
					type="button"
					className={btn}
					onClick={() => setDir((d) => (d === "rtl" ? "ltr" : "rtl"))}
					aria-label={
						dir === "rtl"
							? "Sens de lecture manga (droite vers gauche)"
							: "Sens de lecture BD (gauche vers droite)"
					}
					title={dir === "rtl" ? "Sens manga (droite→gauche)" : "Sens BD (gauche→droite)"}
				>
					<MoveHorizontal size={14} aria-hidden />
					{dir === "rtl" ? "RTL" : "LTR"}
				</button>

				{/* Toggle double-page (paginé + grand écran) */}
				<button
					type="button"
					className={useSpread ? btnActive : btn}
					onClick={() => setSpread((s) => !s)}
					disabled={mode !== "paged" || !isLarge}
					aria-pressed={useSpread}
					aria-label="Affichage double-page (grand écran)"
					title="Double-page (grand écran)"
				>
					{useSpread ? <Columns2 size={14} aria-hidden /> : <Square size={14} aria-hidden />}
					Double
				</button>

				{/* Plein écran */}
				<button
					type="button"
					className={btn}
					onClick={toggleFullscreen}
					aria-label={isFullscreen ? "Quitter le plein écran" : "Activer le plein écran"}
					title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
				>
					{isFullscreen ? <Minimize2 size={14} aria-hidden /> : <Maximize2 size={14} aria-hidden />}
				</button>

				{/* Navigation chapitres */}
				{prevHref ? (
					<Link href={prevHref} className={btn} aria-label="Chapitre précédent" title="Chapitre précédent">
						<ChevronLeft size={14} aria-hidden /> Préc.
					</Link>
				) : (
					<span className={`${btn} pointer-events-none opacity-40`}>
						<ChevronLeft size={14} aria-hidden /> Préc.
					</span>
				)}
				{nextHref ? (
					<Link href={nextHref} className={btn} aria-label="Chapitre suivant" title="Chapitre suivant">
						Suiv. <ChevronRight size={14} aria-hidden />
					</Link>
				) : (
					<span className={`${btn} pointer-events-none opacity-40`}>
						Suiv. <ChevronRight size={14} aria-hidden />
					</span>
				)}
			</div>

			{/* Zone de lecture */}
			<div className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-dbz-bg">
				{total === 0 ? (
					<div className="flex h-full items-center justify-center text-sm text-dbz-blue-light">
						Aucune planche disponible.
					</div>
				) : mode === "paged" ? (
					<>
						<Swiper
							key={`${dir}-${useSpread ? "spread" : "single"}`}
							dir={dir}
							modules={[Keyboard, Zoom, Virtual, Mousewheel]}
							className="h-full w-full"
							slidesPerView={useSpread ? 2 : 1}
							spaceBetween={useSpread ? 8 : 0}
							keyboard={{ enabled: true }}
							mousewheel={{ forceToAxis: true }}
							zoom={{ maxRatio: 3, toggle: true }}
							virtual
							onSwiper={handleSwiper}
							onSlideChange={handleSlideChange}
						>
							{urls.map((url, i) => (
								<SwiperSlide
									key={url + i}
									virtualIndex={i}
									zoom
									className="flex items-center justify-center"
								>
									{/* `swiper-zoom-container` requis par le module Zoom (pan/pinch). */}
									<div className="swiper-zoom-container flex h-full w-full items-center justify-center">
										<img
											src={url}
											alt={`${title} — page ${i + 1}`}
											loading={Math.abs(i - current) <= 1 ? "eager" : "lazy"}
											draggable={false}
											className="max-h-full max-w-full object-contain"
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>

						{/* Flèches de navigation (respectent le sens RTL/LTR). */}
						<button
							type="button"
							aria-label="Page précédente"
							onClick={goPrevPage}
							className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full border border-dbz-border bg-black/60 p-3 text-white transition-colors hover:border-dbz-orange hover:text-dbz-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange"
						>
							{dir === "rtl" ? (
								<ChevronRight size={20} aria-hidden />
							) : (
								<ChevronLeft size={20} aria-hidden />
							)}
						</button>
						<button
							type="button"
							aria-label="Page suivante"
							onClick={goNextPage}
							className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full border border-dbz-border bg-black/60 p-3 text-white transition-colors hover:border-dbz-orange hover:text-dbz-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange"
						>
							{dir === "rtl" ? (
								<ChevronLeft size={20} aria-hidden />
							) : (
								<ChevronRight size={20} aria-hidden />
							)}
						</button>
					</>
				) : (
					<div
						ref={scrollParentRef}
						className="h-full w-full overflow-y-auto overflow-x-hidden"
						aria-label={`${title} — lecture verticale`}
					>
						<div
							style={{
								height: virtualizer.getTotalSize(),
								width: "100%",
								position: "relative",
							}}
						>
							{virtualizer.getVirtualItems().map((vi) => (
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
									className="flex justify-center py-1"
								>
									<img
										src={urls[vi.index]}
										alt={`${title} — page ${vi.index + 1}`}
										loading={Math.abs(vi.index - current) <= 1 ? "eager" : "lazy"}
										draggable={false}
										className="h-auto w-full max-w-3xl object-contain"
									/>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Thumbnail strip / Page navigation at the bottom */}
			{mode === "paged" && total > 0 && (
				<div className="z-10 bg-black/90 border-t border-dbz-border px-4 py-3 flex items-center gap-4 overflow-x-auto scrollbar-thin">
					<div className="flex gap-2 mx-auto">
						{urls.map((url, idx) => (
							<button
								key={url + "-thumb-" + idx}
								type="button"
								onClick={() => {
									setCurrent(idx);
									swiperRef.current?.slideTo(idx);
								}}
								className={`relative flex-shrink-0 w-12 h-16 rounded overflow-hidden border-2 transition-all ${
									current === idx
										? "border-dbz-orange scale-105 shadow-[0_0_10px_rgba(255,178,0,0.4)]"
										: "border-white/10 hover:border-white/30"
								}`}
							>
								<img
									src={url}
									alt={`Page ${idx + 1}`}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
								<span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-bold text-white text-center font-mono">
									{idx + 1}
								</span>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
