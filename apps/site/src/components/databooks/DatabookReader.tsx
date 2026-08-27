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

import type React from "react";
import { type ReactElement, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TranscriptionTexte } from "./TranscriptionTexte";
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
import { Mousewheel, Virtual, Zoom } from "swiper/modules";

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/virtual";

import { assetUrl } from "@/lib/assets";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { optimizedSrc, optimizedSrcSet } from "@/lib/images";

export type DatabookReaderPage = {
	/** Numéro affiché (auto 1…N, modifiable côté admin). */
	number?: number | null;
	image?: string | null;
	text?: string | null;
};

export type DatabookReaderProps = {
	pages: DatabookReaderPage[];
	title: string;
	/** Ouvrage — sert à construire le lien de correction d'une planche. */
	bookId?: number | string | null;
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

export function DatabookReader({ pages, title, bookId }: DatabookReaderProps): ReactElement {
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

	// Détection côté client uniquement (`document` absent au rendu serveur).
	const [fullscreenDispo, setFullscreenDispo] = useState(false);
	useEffect(() => {
		setFullscreenDispo(
			typeof document !== "undefined" &&
				document.fullscreenEnabled &&
				typeof containerRef.current?.requestFullscreen === "function"
		);
	}, []);

	useEffect(() => {
		const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", onChange);
		return () => document.removeEventListener("fullscreenchange", onChange);
	}, []);

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
		// 4 planches de marge (contre 2) : c'est ce qui rend le défilement
		// continu sur un scan de 1 à 2 Mo — le temps qu'une planche arrive à
		// l'écran, son image a déjà commencé à charger.
		overscan: 4,
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

	// Navigation clavier des planches.
	//
	// Une SEULE source de vérité : ce handler, qui passe par `goTo` (donc
	// `slideTo` en mode paginé). Le module `Keyboard` de Swiper est
	// volontairement absent : il écoute lui aussi `keydown`, sur `document`,
	// et faisait AVANCER DEUX FOIS — Swiper glissait d'une planche et émettait
	// `slideChange` (`setCurrent(index)`), puis ce handler ajoutait +1 par-dessus.
	// `current` se décalait durablement de la planche affichée, si bien que la
	// transcription montrée à côté du scan était celle d'une AUTRE page (mesuré
	// sur /wiki/databooks/305 : compteur « n°3 · 3/20 » sur la planche 2).
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
					goTo(current - 1);
					return;
				case "ArrowRight":
					e.preventDefault();
					goTo(current + 1);
					return;
				case "Home":
					e.preventDefault();
					goTo(0);
					return;
				case "End":
					e.preventDefault();
					goTo(total - 1);
					return;
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [lightbox, mode, total, current, goTo]);

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

	// `min-h-10`/`min-w-10` (40 px) : les commandes du lecteur mesuraient 28 à
	// 30 px de haut, sous le seuil tactile. Le padding reste serré à partir de
	// `sm`, où l'on pointe à la souris.
	// Balayage horizontal dans la visionneuse : sur mobile elle n'offrait que deux
	// flèches de 44 px posées sur l'image — le geste naturel (faire glisser la
	// planche) ne faisait rien. Seuil de 48 px, et on ignore les gestes
	// majoritairement verticaux pour ne pas voler un défilement.
	const toucheRef = useRef<{ x: number; y: number } | null>(null);
	const onTouchStart = useCallback((e: React.TouchEvent) => {
		const t = e.touches[0];
		toucheRef.current = t ? { x: t.clientX, y: t.clientY } : null;
	}, []);
	const onTouchEnd = useCallback(
		(e: React.TouchEvent) => {
			const depart = toucheRef.current;
			toucheRef.current = null;
			const t = e.changedTouches[0];
			if (!depart || !t) return;
			const dx = t.clientX - depart.x;
			const dy = t.clientY - depart.y;
			if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
			// `goTo` et non `setCurrent` : il fait suivre le Swiper sous-jacent,
			// sans quoi refermer la visionneuse laisserait la planche paginée sur
			// l'ancienne page.
			goTo(dx < 0 ? current + 1 : current - 1);
		},
		[current, goTo]
	);

	const btnBase =
		"inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-md border bg-dbz-bg px-2.5 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:min-h-0 sm:min-w-0";
	const btn = `${btnBase} border-dbz-border text-dbz-blue-light hover:border-dbz-orange hover:text-dbz-orange disabled:cursor-not-allowed disabled:opacity-40`;
	const btnActive = `${btnBase} border-dbz-orange text-dbz-orange`;

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
					<TranscriptionTexte texte={currentText} bookId={bookId} page={currentNum} />
				) : (
					<p className="text-sm italic text-white/50">Aucune description pour cette page.</p>
				)}
			</div>
		</div>
	);

	return (
		<div
			ref={containerRef}
			// `svh` et non `vh` : sur mobile, `82vh` se calcule barre d'URL RÉTRACTÉE,
			// donc le bas du lecteur (vignettes, saut de page) passait sous la barre
			// tant qu'elle était visible. `svh` prend la plus petite hauteur possible
			// — le lecteur tient toujours entièrement à l'écran.
			// `contain:inline-size` : le carrousel Swiper déclare une largeur
			// MIN-CONTENT énorme (une planche par diapositive, côte à côte). Le
			// conteneur de la fiche, élément flex à marges automatiques, ne peut
			// alors plus être étiré et prend cette largeur : mesuré sur mobile
			// 390 px, la page entière passait à 1 200 px et défilait
			// horizontalement dès le passage en mode paginé. Le confinement coupe
			// cette remontée — la largeur du lecteur vient du parent, jamais du
			// contenu.
			className="flex h-[82svh] min-h-[460px] w-full min-w-0 flex-col overflow-hidden rounded-lg bg-black [contain:inline-size] [&:fullscreen]:h-screen [&:fullscreen]:min-h-screen [&:fullscreen]:rounded-none"
			data-databook-reader
		>
			{/* Barre de contrôles */}
			{/* Barre de contrôles — une seule ligne sur mobile.
			    Le titre y était répété alors que le `<h1>` de la fiche est juste
			    au-dessus : à 390 px, il poussait les commandes sur trois lignes,
			    soit ~90 px de chrome pris sur la planche. Il ne réapparaît qu'à
			    partir de `sm`, où la place existe. */}
			<div className="dbz-panel z-10 flex flex-nowrap items-center gap-1.5 border-b border-dbz-border px-2 py-2 sm:flex-wrap sm:gap-2 sm:px-3">
				<span className="mr-1 hidden min-w-0 max-w-[40ch] truncate text-sm font-bold text-white sm:block">
					{title}
				</span>
				<span className="shrink-0 rounded bg-dbz-bg px-2 py-1 text-xs font-bold tabular-nums text-dbz-orange sm:ml-auto">
					{counter}
				</span>

				<div className="ml-auto flex shrink-0 items-center gap-1.5 sm:ml-0 sm:gap-2">
					<button
						type="button"
						className={mode === "vertical" ? btnActive : btn}
						onClick={() => setMode("vertical")}
						aria-pressed={mode === "vertical"}
						aria-label="Mode vertical (planche + texte)"
						title="Mode vertical (planche + texte)"
					>
						<ScrollText size={16} aria-hidden />
						<span className="hidden sm:inline">Vertical</span>
					</button>
					<button
						type="button"
						className={mode === "paged" ? btnActive : btn}
						onClick={() => setMode("paged")}
						aria-pressed={mode === "paged"}
						aria-label="Mode paginé"
						title="Mode paginé"
					>
						<BookOpen size={16} aria-hidden />
						<span className="hidden sm:inline">Paginé</span>
					</button>
					<button
						type="button"
						className={btn}
						onClick={() => openLightbox()}
						disabled={!currentImage}
						aria-label="Agrandir la planche"
						title="Agrandir la planche"
					>
						<ZoomIn size={16} aria-hidden />
					</button>
					{/* iOS Safari n'implémente pas `requestFullscreen` sur iPhone : le
					    bouton y restait cliquable et sans effet. On ne l'affiche que
					    lorsque l'API est réellement disponible. */}
					{fullscreenDispo && (
						<button
							type="button"
							className={btn}
							onClick={toggleFullscreen}
							aria-label={isFullscreen ? "Quitter le plein écran" : "Activer le plein écran"}
							title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
						>
							{isFullscreen ? (
								<Minimize2 size={16} aria-hidden />
							) : (
								<Maximize2 size={16} aria-hidden />
							)}
						</button>
					)}
				</div>
			</div>

			{/* Zone de lecture */}
			<div className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-dbz-bg">
				{mode === "paged" ? (
					/* Layout côte à côte ≥ lg : planche fixe à gauche, texte scrollable
					   à droite — les légendes longues ne réduisent plus l'image. */
					<div className="flex h-full min-h-0 flex-col lg:flex-row">
						{/* Zone planche */}
						<div className="relative min-h-[52%] min-w-0 flex-[1.6] lg:h-full lg:min-h-0 lg:flex-[1.15]">
							<Swiper
								key="databook-ltr"
								initialSlide={current}
								dir="ltr"
								modules={[Zoom, Virtual, Mousewheel]}
								className="h-full w-full"
								slidesPerView={1}
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
													<img
														src={optimizedSrc(item.imageUrl, 1080)}
														srcSet={optimizedSrcSet(item.imageUrl, [828, 1080, 1920]) || undefined}
														sizes="(min-width: 1024px) 900px, 100vw"
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
						<div className="min-h-0 max-h-[38%] shrink-0 border-t border-dbz-border bg-black/90 px-3 py-2.5 sm:max-h-[48%] sm:px-5 sm:py-4 lg:max-h-none lg:w-[min(420px,38%)] lg:overflow-hidden lg:border-l lg:border-t-0">
							{legendBlock}
						</div>
					</div>
				) : (
					<div
						ref={scrollParentRef}
						tabIndex={0}
						// `overscroll-y-auto` et non `contain` : arrivé en bout de lecteur,
						// la molette doit rendre la main au document. Avec `contain`, le
						// lecteur avalait le geste et la page restait bloquée — on ne
						// pouvait plus descendre vers la suite de la fiche sans sortir la
						// souris de la zone. Le risque d'origine (l'inertie mobile qui
						// éjectait le lecteur en pleine lecture) est traité autrement : les
						// planches s'accrochent au défilement, donc le mouvement s'arrête
						// franchement sur une page au lieu de filer.
						//
						// `snap-y snap-proximity` : le « vrai effet de page » — le
						// défilement s'arrête franchement sur une planche au lieu de
						// s'immobiliser entre deux images. `proximity` et non `mandatory` :
						// la liste est virtualisée (éléments montés/démontés en cours de
						// route, hauteurs mesurées après coup), et une accroche
						// obligatoire se bat avec ces remesures — elle produit des sauts au
						// moment où une planche entre dans la fenêtre.
						className="h-full w-full snap-y snap-proximity overflow-y-auto overflow-x-hidden overscroll-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dbz-orange"
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
										className="snap-start snap-always border-b border-white/5 px-2 py-4 sm:px-4 sm:py-6"
									>
										<div className="group/planche mx-auto flex w-full max-w-3xl flex-col gap-3">
											<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-dbz-orange/70">
												Page {item.number}
											</span>
											{item.imageUrl ? (
												<button
													type="button"
													className="group relative cursor-zoom-in border-0 bg-transparent p-0 text-left focus-visible:outline-none"
													onClick={() => openLightbox(vi.index)}
													aria-label={`Ouvrir la page ${item.number} en plein écran`}
												>
													<img
														src={optimizedSrc(item.imageUrl, 1080)}
														srcSet={optimizedSrcSet(item.imageUrl, [828, 1080, 1920]) || undefined}
														sizes="(min-width: 768px) 768px, 100vw"
														alt={`${title} — page ${item.number}`}
														// Trois planches de part et d'autre chargées d'avance :
														// avec une seule, tourner la page laissait un rectangle
														// vide le temps du téléchargement d'un scan de 1 à 2 Mo.
														loading={Math.abs(vi.index - current) <= 3 ? "eager" : "lazy"}
														// `high` sur la planche courante : le navigateur la sert
														// avant les voisines préchargées.
														fetchPriority={vi.index === current ? "high" : "auto"}
														decoding="async"
														draggable={false}
														className="h-auto w-full rounded-sm bg-black object-contain shadow-[0_0_24px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform group-hover:scale-[1.015] group-hover:shadow-[0_0_60px_rgba(0,0,0,0.75)] group-focus-visible:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none"
													/>
													{/* Appel au plein écran, révélé au survol de la planche. */}
													<span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-black/70 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
														<ZoomIn size={12} aria-hidden />
														Plein écran
													</span>
												</button>
											) : (
												<div className="flex min-h-[120px] items-center justify-center rounded border border-dashed border-white/10 bg-black/40 text-sm text-white/50">
													Pas d&apos;image pour cette page
												</div>
											)}
											{item.text ? (
												<div className="rounded-md border border-dbz-border/40 bg-black/50 px-4 py-3">
													<TranscriptionTexte
														texte={item.text}
														bookId={bookId}
														page={item.number}
													/>
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
									<img
										// Vignette de 48×64 px : elle chargeait le scan source (jusqu'à
										// 5 Mio) pour un timbre-poste, jusqu'à 40 fois par fiche.
										src={optimizedSrc(item.imageUrl, 96)}
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
					<div className="flex items-center gap-3 border-b border-white/10 px-3 py-3 sm:px-4">
						<span className="min-w-0 flex-1 truncate text-sm font-bold text-white">{title}</span>
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
						className="relative flex min-h-0 flex-1 items-center justify-center p-2 sm:p-4"
						onClick={(e) => e.stopPropagation()}
						onTouchStart={onTouchStart}
						onTouchEnd={onTouchEnd}
					>
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
