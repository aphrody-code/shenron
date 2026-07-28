"use client";

/**
 * Atlas des portails — chaque destination a un fond clip matché (ère + tags),
 * shuffle par visite, hover SFX select, compteurs live.
 */
import { useMemo } from "react";
import Link from "next/link";
import {
	ATLAS_GROUPS,
	HOME_DESTINATIONS,
	sceneForDestination,
	shuffleWithSeed,
	type HomeDestination,
} from "@/lib/home-media";
import { ERA_ACCENT } from "@/lib/home-scenes";
import { assetUrl } from "@/lib/assets";
import { sfx } from "@/lib/sfx";

export function HomeAtlas({
	seed,
	compact = false,
	counts,
}: {
	seed: number;
	compact?: boolean;
	counts?: Partial<Record<string, number>>;
}) {
	const groups = useMemo(() => {
		return ATLAS_GROUPS.map((g) => {
			const items = shuffleWithSeed(
				HOME_DESTINATIONS.filter((d) => d.group === g.id),
				seed + g.id.length * 31
			).map((d) => ({
				dest: d,
				scene: sceneForDestination(d.id, seed),
			}));
			return { ...g, items };
		}).filter((g) => g.items.length > 0);
	}, [seed]);

	return (
		<div className={`home-atlas reveal-up ${compact ? "home-atlas--compact" : ""}`} data-no-advance>
			{groups.map((g) => (
				<section key={g.id} className="home-atlas__group">
					<header className="home-atlas__group-head">
						<span className="home-atlas__group-kanji" aria-hidden>
							{g.kanji}
						</span>
						<h3 className="home-atlas__group-title">{g.label}</h3>
						<span className="home-atlas__group-count">{g.items.length}</span>
					</header>
					<div className="home-atlas__grid">
						{g.items.map(({ dest, scene }) => (
							<PortalCard
								key={dest.id}
								dest={dest}
								count={counts?.[dest.id]}
								poster={scene?.poster ?? scene?.image}
							/>
						))}
					</div>
				</section>
			))}
		</div>
	);
}

function PortalCard({
	dest,
	count,
	poster,
}: {
	dest: HomeDestination;
	count?: number;
	poster?: string;
}) {
	const accent = ERA_ACCENT[dest.era];
	const bg = poster ? assetUrl(poster) : null;
	return (
		<Link
			href={dest.href}
			data-tilt
			className="home-portal"
			style={{ ["--portal-accent" as string]: accent }}
			onClick={() => {
				sfx.unlock();
				sfx.click();
			}}
		>
			{bg && (
				// eslint-disable-next-line @next/next/no-img-element
				<img src={bg} alt="" className="home-portal__bg" loading="lazy" />
			)}
			<span className="home-portal__veil" aria-hidden />
			<span className="home-portal__kanji" aria-hidden>
				{dest.kanji}
			</span>
			<span className="home-portal__label">{dest.label}</span>
			<span className="home-portal__hint">{dest.hint}</span>
			{typeof count === "number" && count > 0 && (
				<span className="home-portal__count">{count.toLocaleString("fr-FR")}</span>
			)}
			<span className="home-portal__arrow" aria-hidden>
				→
			</span>
		</Link>
	);
}
