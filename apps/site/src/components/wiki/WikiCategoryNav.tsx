// SPDX-License-Identifier: Apache-2.0

import "server-only";
import Link from "next/link";
import { dbUniverse } from "@/lib/db-universe";
import { ENCYCLOPEDIA_CATEGORIES } from "@/lib/wiki-categories";

/**
 * Nav des sous-entités encyclopédiques du wiki (Personnages, Planètes, Races,
 * Transformations, Techniques, Arcs) — **uniquement celles absentes de la
 * navbar principale** (SiteNav porte déjà Sagas/Films/Épisodes/Manga/Jeux) pour
 * ne JAMAIS doubler la sidebar. Compteurs réels (jamais codés en dur). Server
 * component, sans cookie/header → cache CDN/ISR préservé.
 */
export async function WikiCategoryNav({
	active,
	omit = [],
	className = "",
}: {
	active?: string;
	/** Clés à ne pas afficher (ex. perso/planetes quand ce sont déjà des onglets). */
	omit?: string[];
	className?: string;
}) {
	const counts = (await dbUniverse.counts()) ?? {};
	const cats = ENCYCLOPEDIA_CATEGORIES.filter((c) => !omit.includes(c.key));

	return (
		<nav
			aria-label="Catégories de l'encyclopédie"
			className={`flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
		>
			{cats.map((c) => {
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
