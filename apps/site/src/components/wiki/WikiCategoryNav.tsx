// SPDX-License-Identifier: Apache-2.0

import "server-only";
import Link from "next/link";
import { dbUniverse } from "@/lib/db-universe";

/**
 * Barre de navigation « Univers » : tisse TOUTES les catégories d'entités du
 * wiki (personnages, planètes, races, transformations, techniques, sagas, arcs,
 * films, épisodes, manga, jeux) en une rangée scrollable. Compteurs dérivés des
 * comptes RÉELS de la DB (jamais codés en dur). Server component, sans
 * cookie/header → cache CDN/ISR préservé.
 */
const CATEGORIES = [
	{ key: "personnages", label: "Personnages", href: "/wiki/personnages", countKey: "characters" },
	{ key: "planetes", label: "Planètes", href: "/wiki/planetes", countKey: "planets" },
	{ key: "races", label: "Races", href: "/wiki/races", countKey: "races" },
	{
		key: "transformations",
		label: "Transformations",
		href: "/wiki/transformations",
		countKey: "transformations",
	},
	{
		key: "techniques",
		label: "Techniques",
		href: "/wiki/dragon-ball/techniques",
		countKey: "techniques",
	},
	{ key: "sagas", label: "Sagas", href: "/wiki/sagas", countKey: "sagas" },
	{ key: "arcs", label: "Arcs", href: "/wiki/arcs", countKey: "arcs" },
	{ key: "films", label: "Films", href: "/wiki/films", countKey: "movies" },
	{ key: "episodes", label: "Épisodes", href: "/wiki/episodes", countKey: "episodes" },
	{ key: "manga", label: "Manga", href: "/wiki/manga", countKey: "mangaVolumes" },
	{ key: "jeux", label: "Jeux", href: "/wiki/jeux", countKey: "games" },
] as const;

export async function WikiCategoryNav({
	active,
	className = "",
}: {
	active?: string;
	className?: string;
}) {
	const counts = (await dbUniverse.counts()) ?? {};

	return (
		<nav
			aria-label="Catégories de l'univers"
			className={`flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
		>
			{CATEGORIES.map((c) => {
				const n = (counts as Record<string, number>)[c.countKey];
				const isActive = active === c.key;
				return (
					<Link
						key={c.key}
						href={c.href}
						aria-current={isActive ? "page" : undefined}
						className={`inline-flex items-center gap-1.5 shrink-0 h-9 px-4 rounded-full border text-[13px] font-display font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
							isActive
								? "bg-dbz-orange text-black border-dbz-orange"
								: "bg-white/[0.04] text-white/70 border-white/[0.1] hover:text-white hover:border-white/30"
						}`}
					>
						{c.label}
						{typeof n === "number" && n > 0 && (
							<span
								className={`text-[11px] tabular-nums ${isActive ? "text-black/55" : "text-white/40"}`}
							>
								{n}
							</span>
						)}
					</Link>
				);
			})}
		</nav>
	);
}
