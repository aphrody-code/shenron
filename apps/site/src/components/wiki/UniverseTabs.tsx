// SPDX-License-Identifier: Apache-2.0

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CharacterGrid, GridCharacter } from "./CharacterGrid";
import { FilterDropdown } from "./FilterDropdown";
import { ViewTransition } from "@/components/ViewTransition";
import { assetUrl } from "@/lib/assets";
import { ENCYCLOPEDIA_CATEGORIES } from "@/lib/wiki-categories";

// Autres entrées encyclopédiques (hors onglets Perso/Planètes) exposées DANS la
// même barre — Races, Transformations, Techniques, Arcs. On n'y met jamais les
// catégories "media" (Sagas/Films/Épisodes/Manga/Jeux) déjà dans la navbar
// (anti-doublon), ni Perso/Planètes (ce sont les onglets juste à côté).
const OTHER_CATS = ENCYCLOPEDIA_CATEGORIES.filter(
	(c) => c.key !== "personnages" && c.key !== "planetes"
);

export type GridPlanet = {
	id: number;
	name: string;
	nameJa: string | null;
	isDestroyed: boolean;
	image: string | null;
};

type Props = {
	characters: GridCharacter[];
	planets: GridPlanet[];
	initialTab?: string;
	counts?: Record<string, number>;
};

export function UniverseTabs({
	characters,
	planets,
	initialTab = "personnages",
	counts = {},
}: Props) {
	const [activeTab, setActiveTab] = useState<string>(initialTab);
	const [planetStatus, setPlanetStatus] = useState<string[]>([]);

	const filteredPlanets = useMemo(() => {
		if (!planetStatus.length) return planets;
		const set = new Set(planetStatus);
		return planets.filter((p) => set.has(p.isDestroyed ? "destroyed" : "alive"));
	}, [planets, planetStatus]);

	const planetStatusOptions = useMemo(() => {
		const destroyed = planets.filter((p) => p.isDestroyed).length;
		return [
			{ value: "alive", label: "Existantes", count: planets.length - destroyed },
			{ value: "destroyed", label: "Détruites", count: destroyed },
		];
	}, [planets]);

	return (
		<div className="space-y-8">
			{/* Barre unique : onglets Personnages/Planètes (vue inline) + liens vers
			    les autres entrées encyclopédiques (Races, Transformations, Techniques,
			    Arcs). Aucune catégorie de la navbar ici → pas de doublon avec la nav. */}
			<div className="flex items-center overflow-x-auto border-b border-white/[0.08] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<div role="tablist" className="flex shrink-0">
					<button
						type="button"
						role="tab"
						id="universe-tab-personnages"
						aria-selected={activeTab === "personnages"}
						aria-controls="universe-panel-personnages"
						onClick={() => setActiveTab("personnages")}
						className={`px-5 py-3 font-display font-semibold text-sm transition-colors relative whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
							activeTab === "personnages" ? "text-dbz-orange" : "text-white/60 hover:text-white"
						}`}
					>
						Personnages ({characters.length})
						{activeTab === "personnages" && (
							<span className="absolute bottom-0 inset-x-0 h-[2px] bg-dbz-orange" />
						)}
					</button>
					<button
						type="button"
						role="tab"
						id="universe-tab-planetes"
						aria-selected={activeTab === "planetes"}
						aria-controls="universe-panel-planetes"
						onClick={() => setActiveTab("planetes")}
						className={`px-5 py-3 font-display font-semibold text-sm transition-colors relative whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
							activeTab === "planetes" ? "text-dbz-orange" : "text-white/60 hover:text-white"
						}`}
					>
						Planètes ({planets.length})
						{activeTab === "planetes" && (
							<span className="absolute bottom-0 inset-x-0 h-[2px] bg-dbz-orange" />
						)}
					</button>
				</div>

				<span className="mx-2 h-5 w-px shrink-0 bg-white/10" aria-hidden />

				<div className="flex shrink-0 items-center">
					{OTHER_CATS.map((c) => {
						const n = counts[c.countKey];
						return (
							<Link
								key={c.key}
								href={c.href}
								className="px-4 py-3 font-display font-semibold text-sm text-white/55 hover:text-white whitespace-nowrap transition-colors"
							>
								{c.label}
								{typeof n === "number" && n > 0 && (
									<span className="ml-1 text-[11px] text-white/35 tabular-nums">{n}</span>
								)}
							</Link>
						);
					})}
				</div>
			</div>

			{/* Tab Content */}
			{activeTab === "personnages" ? (
				<div role="tabpanel" id="universe-panel-personnages" aria-labelledby="universe-tab-personnages">
					<CharacterGrid characters={characters} />
				</div>
			) : (
				<div
					role="tabpanel"
					id="universe-panel-planetes"
					aria-labelledby="universe-tab-planetes"
					className="space-y-8"
				>
					<div className="flex items-center gap-3">
						<FilterDropdown
							label="Statut"
							options={planetStatusOptions}
							selected={planetStatus}
							onChange={setPlanetStatus}
						/>
						<p className="scouter-text text-[11px] text-dbz-blue-light whitespace-nowrap sm:ml-auto">
							{filteredPlanets.length} / {planets.length} mondes
						</p>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 reveal-grid">
						{filteredPlanets.map((p) => (
						<Link
							key={p.id}
							href={`/wiki/dragon-ball/planet/${p.id}`}
							transitionTypes={["nav-forward"]}
							className="group flex flex-col dbz-panel overflow-hidden hover:scale-[1.02] transition-all duration-300 ki-card"
						>
							<div className="relative aspect-video bg-dbz-bg overflow-hidden p-3">
								<div className="absolute inset-0 starfield opacity-20" />
								<span aria-hidden className="ki-card__glow ki-card__glow--blue" />
								{p.image ? (
									<ViewTransition name={`planet-img-${p.id}`} share="morph">
										<img
											src={assetUrl(p.image)}
											alt={p.name}
											loading="lazy"
											className="relative z-10 w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 drop-shadow-[0_0_20px_rgba(75,168,255,0.2)]"
										/>
									</ViewTransition>
								) : (
									<div className="relative z-10 flex h-full w-full items-center justify-center">
										<span className="text-zinc-700 font-saiyan text-2xl">?</span>
									</div>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-20" />
								{p.isDestroyed && (
									<span className="absolute top-2 right-2 z-30 scouter-text text-[8px] text-dbz-red bg-black/60 px-1.5 py-0.5 rounded">
										DÉTRUITE
									</span>
								)}
								<div className="absolute inset-x-0 bottom-0 p-3 text-center z-30">
									<p className="font-display font-bold text-sm text-white leading-tight group-hover:text-dbz-blue-light transition-colors truncate">
										{p.name}
									</p>
									{p.nameJa && (
										<p className="font-jp text-[10px] text-dbz-blue-light/70 mt-0.5 truncate">
											{p.nameJa}
										</p>
									)}
								</div>
							</div>
						</Link>
					))}
					</div>
				</div>
			)}
		</div>
	);
}
