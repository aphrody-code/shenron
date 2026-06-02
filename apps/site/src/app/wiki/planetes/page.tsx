import Link from "next/link";
import { getShenronPlanets } from "@/lib/shenron";
import { assetUrl } from "@/lib/assets";
import { ViewTransition } from "@/components/ViewTransition";
import { PageHero } from "@/components/PageHero";
import { PLANETS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Planètes Dragon Ball — DBFR",
	description:
		"Tous les mondes de l'univers Dragon Ball : Terre, Namek, Vegeta, Beerus. Noms japonais 日本語, statut (détruite ou non) et habitants.",
};

export default async function PlanetesPage() {
	const planets = await getShenronPlanets();

	return (
		<>
			<PageHero
				eyebrow="Encyclopédie"
				title="Planètes"
				lead={`${planets.length} mondes répertoriés à travers les douze univers — de la Terre à la planète Vegeta, de Namek au royaume de Beerus.`}
				image={PLANETS_HERO}
				imageAlt="Planètes de l'univers Dragon Ball"
			/>
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 lg:py-16 reveal-up">
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
			</div>
		</>
	);
}
