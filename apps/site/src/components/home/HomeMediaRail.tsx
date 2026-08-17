"use client";

/**
 * Rail média cinématique — première carte en « feature », hover glow d'ère,
 * molette locale, SFX select (pas de spam click), snap scroll.
 */
import { useEffect, useRef } from "react";
import Link from "next/link";
import { assetUrl } from "@/lib/assets";
import type { FeaturedCard } from "@/lib/home-media";
import { sfx } from "@/lib/sfx";

export function HomeMediaRail({
	items,
	compact = false,
	aspect = "poster",
	featureFirst = true,
}: {
	items: FeaturedCard[];
	compact?: boolean;
	aspect?: "poster" | "wide" | "square";
	/** Première carte plus large (affiche « en une »). */
	featureFirst?: boolean;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const onWheel = (e: WheelEvent) => {
			const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
			if (!d || el.scrollWidth <= el.clientWidth + 4) return;
			e.preventDefault();
			e.stopPropagation();
			el.scrollLeft += d;
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, []);

	if (items.length === 0) {
		return (
			<p className="text-[13px] text-white/45">
				Aucun média pour ce panneau — reviens après la prochaine sync wiki.
			</p>
		);
	}

	const aspectClass =
		aspect === "wide"
			? "home-media-card--wide"
			: aspect === "square"
				? "home-media-card--square"
				: "home-media-card--poster";

	return (
		<div
			ref={ref}
			className={`home-media-rail reveal-up ${compact ? "home-media-rail--compact" : ""}`}
			data-no-advance
		>
			{items.map((item, idx) => {
				const feature = featureFirst && idx === 0 && !compact;
				return (
					<Link
						key={`${item.id}-${item.href}`}
						href={item.href}
						data-tilt
						className={`home-media-card ${aspectClass} ${feature ? "home-media-card--feature" : ""}`}
						onClick={() => {
							sfx.unlock();
							sfx.click();
						}}
					>
						<span className="home-media-card__art">
							{item.image ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={assetUrl(item.image)}
									alt=""
									loading={idx < 4 ? "eager" : "lazy"}
									className="home-media-card__img"
								/>
							) : (
								<span className="home-media-card__ph" aria-hidden />
							)}
							<span className="home-media-card__shine" aria-hidden />
							{item.badge && <span className="home-media-card__badge">{item.badge}</span>}
							{feature && <span className="home-media-card__feature-tag">À la une</span>}
						</span>
						<span className="home-media-card__meta">
							<span className="home-media-card__title">{item.title}</span>
							{item.subtitle && <span className="home-media-card__sub">{item.subtitle}</span>}
						</span>
					</Link>
				);
			})}
		</div>
	);
}
