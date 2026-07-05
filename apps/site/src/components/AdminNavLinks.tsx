"use client";

/**
 * Liens de navigation **réservés admin** (îlot client) : expose les sections du
 * site encore masquées au public pendant la bêta (personnages, planètes, sagas,
 * races, techniques, transformations, jeux, tierlists). Gated par `useMe().isAdmin`
 * → rendu vide côté serveur/pour le public, donc la nav (statique) reste cacheable
 * CDN/ISR. Présenté en menu déroulant compact pour ne pas déborder la barre.
 */
import Link from "next/link";
import { ChevronDown, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMe } from "@/lib/use-me";

export type NavLink = { href: string; label: string };

export function AdminNavLinks({ links }: { links: NavLink[] }) {
	const me = useMe();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

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

	if (!me?.isAdmin || links.length === 0) return null;

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-haspopup="menu"
				title="Sections masquées au public (visibles en tant qu'admin)"
				className="inline-flex items-center gap-1.5 font-display font-medium text-[15px] tracking-normal text-dbz-orange/85 hover:text-dbz-orange transition-colors px-3.5 py-2 rounded-md border border-dbz-orange/25 hover:border-dbz-orange/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
			>
				<Lock className="h-3.5 w-3.5" />
				<span>Sections</span>
				<ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
			</button>

			{open && (
				<div
					role="menu"
					className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-lg border border-dbz-orange/20 bg-[rgba(10,10,10,0.97)] p-1.5 shadow-xl backdrop-blur-xl"
				>
					<p className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-dbz-orange/50">
						Admin · masquées en bêta
					</p>
					{links.map((l) => (
						<Link
							key={l.href}
							href={l.href}
							role="menuitem"
							onClick={() => setOpen(false)}
							className="block rounded-md px-3 py-2 font-display text-[14px] font-medium text-white/80 transition-colors hover:bg-white/[0.06] hover:text-dbz-orange"
						>
							{l.label}
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
