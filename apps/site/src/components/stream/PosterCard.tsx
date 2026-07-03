import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { assetUrl } from "@/lib/assets";

/**
 * PosterCard — carte affiche 2:3 (films, tomes de manga) façon streaming.
 *
 * Composant SERVEUR (aucun JS) : le survol (zoom + révélation play/overlay) est
 * 100 % CSS via `group-hover`. Titre visible en permanence (scan + SEO). Les
 * puces VF/VOSTFR signalent la disponibilité « en lecture ».
 */
export function PosterCard({
	href,
	title,
	titleJa,
	poster,
	year,
	meta,
	hasVf,
	hasVostfr,
	badge,
}: {
	href: string;
	title: string;
	titleJa?: string | null;
	poster: string | null;
	year?: number | null;
	meta?: string | null;
	hasVf?: boolean;
	hasVostfr?: boolean;
	/** Pastille d'angle (ex. « FILM », « TOME 12 »). */
	badge?: string;
}) {
	return (
		<Link
			href={href}
			className="group/card relative block w-[142px] shrink-0 snap-start sm:w-[160px]"
		>
			<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-dbz-card shadow-lg ring-1 ring-white/[0.06] transition-all duration-300 will-change-transform group-hover/card:z-10 group-hover/card:scale-[1.05] group-hover/card:shadow-dbz-orange/20 group-hover/card:ring-dbz-orange/60">
				{poster ? (
					<Image
						src={assetUrl(poster)}
						alt=""
						fill
						sizes="160px"
						className="object-cover transition-transform duration-500 group-hover/card:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-dbz-card to-black">
						<span className="px-2 text-center font-saiyan text-sm uppercase text-white/30">
							{title}
						</span>
					</div>
				)}

				{/* Pastille d'angle */}
				{badge && (
					<span className="absolute left-1.5 top-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-dbz-orange backdrop-blur">
						{badge}
					</span>
				)}

				{/* Puces de langue (haut droite) */}
				{(hasVf || hasVostfr) && (
					<div className="absolute right-1.5 top-1.5 flex gap-1">
						{hasVf && (
							<span className="rounded bg-namek/85 px-1 py-0.5 text-[8px] font-bold uppercase text-black">
								VF
							</span>
						)}
						{hasVostfr && (
							<span className="rounded bg-dbz-blue-light/85 px-1 py-0.5 text-[8px] font-bold uppercase text-black">
								VOSTFR
							</span>
						)}
					</div>
				)}

				{/* Overlay de survol : dégradé + bouton play */}
				<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
					<span className="grid h-11 w-11 place-items-center rounded-full bg-dbz-orange text-black shadow-lg">
						<Play className="h-5 w-5 translate-x-[1px] fill-current" />
					</span>
				</div>
			</div>

			{/* Légende sous l'affiche */}
			<div className="mt-2 px-0.5">
				<p className="truncate font-display text-[13px] font-semibold text-white/90 transition-colors group-hover/card:text-dbz-orange">
					{title}
				</p>
				<p className="truncate text-[11px] text-white/40">
					{[year, meta].filter(Boolean).join(" · ") || titleJa || " "}
				</p>
			</div>
		</Link>
	);
}
