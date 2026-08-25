import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StreamRail } from "./StreamRail";

/**
 * StreamRow — section titrée « à la Netflix » : en-tête (barre d'accent + titre +
 * compteur + lien « Tout voir ») au-dessus d'un rail horizontal. Server Component :
 * seul le rail (défilement) est client ; les cartes enfant sont rendues serveur.
 */
export function StreamRow({
	title,
	accent,
	count,
	seeAllHref,
	seeAllLabel = "Tout voir",
	children,
}: {
	title: string;
	accent?: string;
	count?: number;
	seeAllHref?: string;
	seeAllLabel?: string;
	children: React.ReactNode;
}) {
	return (
		<section className="mb-9 lg:mb-12">
			<div className="mb-3 flex items-end justify-between gap-4">
				<h2 className="flex items-center gap-2.5 font-display text-[19px] font-bold text-white sm:text-[22px]">
					{accent && (
						<span className="h-5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
					)}
					{title}
					{count != null && (
						<span className="font-mono text-[13px] font-normal text-white/55">{count}</span>
					)}
				</h2>
				{seeAllHref && (
					<Link
						href={seeAllHref}
						className="group/see -my-2 inline-flex min-h-11 shrink-0 items-center gap-0.5 py-2 text-[12px] font-display font-semibold uppercase tracking-wider text-white/60 transition-colors hover:text-dbz-orange"
					>
						{seeAllLabel}
						<ChevronRight className="h-4 w-4 transition-transform group-hover/see:translate-x-0.5" />
					</Link>
				)}
			</div>
			<StreamRail ariaLabel={title}>{children}</StreamRail>
		</section>
	);
}
