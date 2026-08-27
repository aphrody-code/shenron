"use client";

/**
 * Méga-menu de navigation — une famille de rubriques par panneau.
 *
 * Remplace, pour le desktop, la liste plate « 4 liens en ligne + tout le reste
 * dans Plus » : avec 13 rubriques publiques, ce menu fourre-tout ne disait plus
 * ce que le site contient. Ici chaque entrée porte son libellé, sa phrase de
 * situation et, quand elle est mesurée, son volume — c'est ce qui donne envie
 * d'ouvrir « Techniques » plutôt que de repartir sur la recherche.
 *
 * Le contenu vient du registre (`lib/wiki-launch`), déjà filtré sur l'accès
 * réel côté serveur : rien à maintenir ici quand une rubrique s'ouvre.
 */
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export type MegaItem = {
	href: string;
	label: string;
	blurb?: string;
	/** Volume mesuré en base (fiches visibles). Jamais écrit en dur. */
	count?: number;
};

const nf = new Intl.NumberFormat("fr-FR");

export function NavMega({
	label,
	items,
	linkClass,
}: {
	label: string;
	items: MegaItem[];
	linkClass: string;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);
	const panelId = useId();
	// Fermeture différée : traverser les quelques pixels entre le bouton et le
	// panneau ne doit pas refermer le menu (le pointeur quitte le bouton avant
	// d'entrer dans le panneau).
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const ouvrir = () => {
		if (timer.current) clearTimeout(timer.current);
		setOpen(true);
	};
	const fermerBientot = () => {
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => setOpen(false), 120);
	};

	useEffect(() => {
		if (!open) return;
		const onDown = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

	if (items.length === 0) return null;

	return (
		<div ref={ref} className="relative" onPointerEnter={ouvrir} onPointerLeave={fermerBientot}>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-controls={panelId}
				aria-haspopup="true"
				className={`${linkClass} inline-flex items-center gap-1 ${open ? "text-dbz-orange" : ""}`}
			>
				<span>{label}</span>
				<ChevronDown
					className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
					aria-hidden
				/>
			</button>

			{open && (
				<div
					id={panelId}
					className="absolute left-1/2 top-full z-50 mt-1.5 w-[min(92vw,30rem)] -translate-x-1/2 rounded-xl border border-white/10 bg-[rgba(10,10,10,0.97)] p-2 shadow-2xl shadow-black/60 backdrop-blur-xl"
				>
					<ul className="grid gap-0.5 sm:grid-cols-2">
						{items.map((it) => (
							<li key={it.href}>
								<Link
									href={it.href}
									onClick={() => setOpen(false)}
									className="group block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
								>
									<span className="flex items-baseline gap-2">
										<span className="font-display text-[14px] font-semibold text-white/90 transition-colors group-hover:text-dbz-orange">
											{it.label}
										</span>
										{typeof it.count === "number" && it.count > 0 && (
											<span className="font-scouter text-[10px] tabular-nums text-white/40">
												{nf.format(it.count)}
											</span>
										)}
									</span>
									{it.blurb && (
										<span className="mt-0.5 block text-[12px] leading-snug text-white/45">
											{it.blurb}
										</span>
									)}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
