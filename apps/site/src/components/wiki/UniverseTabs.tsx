// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import Link from "next/link";
import { CharacterGrid, GridCharacter } from "./CharacterGrid";
import { ViewTransition } from "@/components/ViewTransition";
import { assetUrl } from "@/lib/assets";

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
};

export function UniverseTabs({ characters, planets, initialTab = "personnages" }: Props) {
	const [activeTab, setActiveTab] = useState<string>(initialTab);

	return (
		<div className="space-y-8">
			{/* Tab Switcher */}
			<div className="flex border-b border-white/[0.08]">
				<button
					type="button"
					onClick={() => setActiveTab("personnages")}
					className={`px-6 py-3 font-display font-semibold text-sm transition-colors relative ${
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
					onClick={() => setActiveTab("planetes")}
					className={`px-6 py-3 font-display font-semibold text-sm transition-colors relative ${
						activeTab === "planetes" ? "text-dbz-orange" : "text-white/60 hover:text-white"
					}`}
				>
					Planètes ({planets.length})
					{activeTab === "planetes" && (
						<span className="absolute bottom-0 inset-x-0 h-[2px] bg-dbz-orange" />
					)}
				</button>
			</div>

			{/* Tab Content */}
			{activeTab === "personnages" ? (
				<CharacterGrid characters={characters} />
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 reveal-grid">
					{planets.map((p) => (
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
			)}
		</div>
	);
}
