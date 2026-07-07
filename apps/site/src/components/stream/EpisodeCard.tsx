import Link from "next/link";
import { Play } from "lucide-react";
import { assetUrl } from "@/lib/assets";

/**
 * EpisodeCard — carte vignette 16:9 (épisodes) façon streaming.
 *
 * Composant SERVEUR (aucun JS) : survol/focus = zoom + bouton play (100 % CSS).
 * `<img loading="lazy" decoding="async">` → seules les vignettes visibles se
 * chargent/décodent. Numéro d'épisode en pastille HUD, puces VF/VOSTFR pour la
 * disponibilité en lecture. `synopsis` n'est rendu qu'en `width="full"` (grille).
 */
export function EpisodeCard({
	href,
	number,
	title,
	titleJa,
	image,
	synopsis,
	year,
	hasVf,
	hasVostfr,
	width = "rail",
	eager = false,
}: {
	href: string;
	number: number | null;
	title: string;
	titleJa?: string | null;
	image: string | null;
	synopsis?: string | null;
	year?: number | null;
	hasVf?: boolean;
	hasVostfr?: boolean;
	/** "rail" = largeur fixe pour un rail horizontal ; "full" = pleine largeur (grille). */
	width?: "rail" | "full";
	/** Charge la vignette immédiatement (1er rail visible) — évite le flash de carte vide. */
	eager?: boolean;
}) {
	const num = number != null ? String(number).padStart(3, "0") : "—";
	return (
		<Link
			href={href}
			className={`group/card block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange focus-visible:ring-offset-2 focus-visible:ring-offset-dbz-bg ${
				width === "rail" ? "w-[260px] shrink-0 snap-start sm:w-[300px]" : "w-full"
			}`}
		>
			<div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-dbz-card to-black shadow-lg ring-1 ring-white/[0.06] transition-all duration-300 group-hover/card:z-10 group-hover/card:ring-dbz-orange/60 group-focus-visible/card:ring-dbz-orange/60">
				{/* Filigrane du numéro : visible tant que la vignette n'a pas peint
				    (la carte ne paraît jamais « vide/cassée » pendant le chargement). */}
				<span className="pointer-events-none absolute inset-0 flex items-center justify-center font-saiyan text-2xl text-white/10">
					{num}
				</span>
				{image && (
					<img
						src={assetUrl(image)}
						alt=""
						loading={eager ? "eager" : "lazy"}
						decoding="async"
						fetchPriority={eager ? "high" : "auto"}
						className="relative h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
					/>
				)}

				{/* Dégradé permanent bas + numéro HUD */}
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
				<span className="scouter-text absolute left-2 top-2 bg-black/60 px-1.5 py-0.5 text-[10px] text-dbz-orange">
					#{num}
				</span>
				{(hasVf || hasVostfr) && (
					<div className="absolute right-2 top-2 flex gap-1">
						{hasVf && (
							<span className="rounded bg-namek/85 px-1 py-0.5 text-[10px] font-bold uppercase text-black">
								VF
							</span>
						)}
						{hasVostfr && (
							<span className="rounded bg-dbz-blue-light/85 px-1 py-0.5 text-[10px] font-bold uppercase text-black">
								VOSTFR
							</span>
						)}
					</div>
				)}

				{/* Bouton play au survol/focus */}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-focus-visible/card:opacity-100">
					<span className="grid h-12 w-12 place-items-center rounded-full bg-dbz-orange text-black shadow-lg">
						<Play className="h-5 w-5 translate-x-[1px] fill-current" />
					</span>
				</div>

				{/* Titre en bas de la vignette */}
				<div className="absolute inset-x-0 bottom-0 p-2.5">
					<p className="line-clamp-1 font-display text-[13px] font-bold text-white drop-shadow">
						{title}
					</p>
					<p className="line-clamp-1 text-[10px] text-white/50">
						{[year].filter(Boolean).join(" · ") || titleJa || " "}
					</p>
				</div>
			</div>
			{/* Synopsis en grille (width="full") uniquement */}
			{synopsis && width === "full" && (
				<p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-white/50">{synopsis}</p>
			)}
		</Link>
	);
}
