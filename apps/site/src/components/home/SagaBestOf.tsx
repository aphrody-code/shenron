"use client";

// Best of des sagas — écran de sélection façon jeu DBZ : un rail de sagas
// (cartes-arcades), une scène centrale (artwork + pitch + stats réelles + CTA)
// et un rail média mixte (épisodes / films / tomes du manga) 100 % SSR, liens
// vers les routes publiques bêta. Le panneau vit dans le deck de la home : tout
// le widget est `data-no-advance` (un clic ici sélectionne, ne change pas de
// panneau) et les rails interceptent la molette (scroll horizontal local).
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import type { BestOfSagaView } from "@/lib/home-bestof";

const pad = (n: number): string => String(n).padStart(2, "0");

/** Molette sur un rail → défilement horizontal local (et jamais le deck). */
function useHorizontalWheel(ref: RefObject<HTMLDivElement | null>) {
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const onWheel = (e: WheelEvent) => {
			const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
			if (!d || el.scrollWidth <= el.clientWidth + 4) return;
			e.preventDefault();
			e.stopPropagation(); // le deck (listener window) ne doit pas changer de panneau
			el.scrollLeft += d;
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, [ref]);
}

const KIND_LABEL: Record<string, string> = {
	episode: "Épisode",
	film: "Film",
	tome: "Manga",
};

export function SagaBestOf({
	sagas,
	active,
	compact = false,
}: {
	sagas: BestOfSagaView[];
	active: boolean;
	/** ≤640px : rails resserrés, description raccourcie (panneau 100svh). */
	compact?: boolean;
}) {
	const [sel, setSel] = useState(0);
	const touchedRef = useRef(false); // première interaction → stop l'auto-défilement
	const railRef = useRef<HTMLDivElement>(null);
	const mediaRef = useRef<HTMLDivElement>(null);
	useHorizontalWheel(railRef);
	useHorizontalWheel(mediaRef);

	const saga = sagas[Math.min(sel, sagas.length - 1)];

	const select = useCallback((i: number, user = true) => {
		if (user) touchedRef.current = true;
		setSel(i);
	}, []);

	// Auto-défilement doux tant que le visiteur n'a pas pris la main (vitrine
	// vivante quand le panneau est actif) — coupé en reduced-motion.
	useEffect(() => {
		if (!active || sagas.length <= 1) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const id = setInterval(() => {
			if (!touchedRef.current) setSel((i) => (i + 1) % sagas.length);
		}, 9000);
		return () => clearInterval(id);
	}, [active, sagas.length]);

	// Centre la carte sélectionnée dans le rail (scrollTo local : jamais de
	// scrollIntoView, qui ferait défiler le deck verticalement).
	useEffect(() => {
		const rail = railRef.current;
		const card = rail?.children[sel] as HTMLElement | undefined;
		if (!rail || !card) return;
		rail.scrollTo({
			left: card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2,
			behavior: "smooth",
		});
		// Le rail média repart au début à chaque changement de saga.
		mediaRef.current?.scrollTo({ left: 0, behavior: "smooth" });
	}, [sel]);

	const onRailKey = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowRight") {
			e.preventDefault();
			select((sel + 1) % sagas.length);
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			select((sel - 1 + sagas.length) % sagas.length);
		}
	};

	if (!saga) return null;

	const stats = [
		saga.stats.episodes > 0 && `${saga.stats.episodes} épisodes`,
		saga.stats.films > 0 && `${saga.stats.films} film${saga.stats.films > 1 ? "s" : ""}`,
		saga.stats.tomes > 0 && `${saga.stats.tomes} tome${saga.stats.tomes > 1 ? "s" : ""}`,
	].filter(Boolean) as string[];

	return (
		<div
			className="bestof reveal-up"
			data-no-advance
			style={{ ["--accent" as string]: saga.accent }}
		>
			{/* ── Rail de sélection des sagas ── */}
			<div
				ref={railRef}
				className="bestof__rail"
				role="tablist"
				aria-label="Choisir une saga"
				onKeyDown={onRailKey}
			>
				{sagas.map((s, i) => (
					<button
						key={s.slug}
						type="button"
						role="tab"
						aria-selected={i === sel}
						data-tilt
						className={`bestof-card${i === sel ? " is-on" : ""}`}
						style={{ ["--accent" as string]: s.accent }}
						onClick={() => select(i)}
					>
						<img src={s.image} alt="" loading="lazy" decoding="async" />
						<span className="bestof-card__shade" aria-hidden />
						<span className="bestof-card__meta">
							<span className="bestof-card__series">{s.seriesLabel}</span>
							<span className="bestof-card__name">{s.name}</span>
						</span>
					</button>
				))}
			</div>

			{/* ── Scène centrale (remontée à chaque saga → animation d'entrée) ── */}
			<div className="bestof__stage" key={saga.slug}>
				<div className="bestof__art" aria-hidden>
					<img src={saga.image} alt="" loading="lazy" decoding="async" />
				</div>
				<div className="bestof__info">
					<p className="bestof__eyebrow">
						<span className="bestof__idx">
							{pad(sel + 1)}/{pad(sagas.length)}
						</span>
						{saga.seriesLabel}
						{saga.years && <span className="bestof__years"> · {saga.years}</span>}
					</p>
					<h3 className="bestof__name">{saga.name}</h3>
					<p className="bestof__tagline">{saga.tagline}</p>
					{!compact && saga.description && <p className="bestof__desc">{saga.description}</p>}
					{stats.length > 0 && (
						<p className="bestof__stats">
							{stats.map((s, i) => (
								<span key={s}>
									{i > 0 && <i aria-hidden>·</i>}
									{s}
								</span>
							))}
						</p>
					)}
					<div className="bestof__ctas">
						<Link href={saga.watchHref} className="home-cta home-cta--primary">
							{saga.watchLabel}
						</Link>
						<Link href="/wiki/chronologie" className="home-cta home-cta--ghost">
							Chronologie complète
						</Link>
					</div>
				</div>
				{/* Flèches de navigation (boucle) */}
				<div className="bestof__arrows" aria-hidden={sagas.length <= 1}>
					<button
						type="button"
						className="bestof__arrow"
						aria-label="Saga précédente"
						onClick={() => select((sel - 1 + sagas.length) % sagas.length)}
					>
						←
					</button>
					<button
						type="button"
						className="bestof__arrow"
						aria-label="Saga suivante"
						onClick={() => select((sel + 1) % sagas.length)}
					>
						→
					</button>
				</div>
			</div>

			{/* ── Rail média : le best of de la saga (épisodes, films, tomes) ── */}
			<div ref={mediaRef} className="bestof__media" key={`media-${saga.slug}`}>
				{saga.media.map((m) => (
					<Link
						key={m.href}
						href={m.href}
						data-tilt
						className={`bestof-media bestof-media--${m.kind}`}
						aria-label={`${KIND_LABEL[m.kind]} — ${m.label}`}
					>
						<img src={m.image} alt="" loading="lazy" decoding="async" />
						<span className="bestof-media__shade" aria-hidden />
						<span className="bestof-media__badge">{m.badge}</span>
						<span className="bestof-media__label">{m.label}</span>
					</Link>
				))}
			</div>
		</div>
	);
}
