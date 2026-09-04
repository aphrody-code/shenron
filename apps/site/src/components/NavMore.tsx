"use client";

/**
 * Menu « Plus » pour les liens de nav en trop (desktop).
 * Même langage visuel que AdminNavLinks, sans le badge admin / cadenas.
 */
import Link from "next/link";
import { ChevronBas } from "@/components/icones";
import { useEffect, useRef, useState } from "react";

export type NavLink = { href: string; label: string };

export function NavMore({
	links,
	label = "Plus",
	hint,
}: {
	links: NavLink[];
	label?: string;
	/** Sous-titre du menu (optionnel). */
	hint?: string;
}) {
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

	if (links.length === 0) return null;

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-haspopup="menu"
				className="inline-flex items-center gap-1 font-display font-medium text-[15px] tracking-normal text-white/72 hover:text-dbz-orange transition-colors px-3.5 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
			>
				<span>{label}</span>
				<ChevronBas
					className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
					aria-hidden
				/>
			</button>

			{open && (
				<div
					role="menu"
					className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-lg border border-white/10 bg-[rgba(10,10,10,0.97)] p-1.5 shadow-xl backdrop-blur-xl"
				>
					{hint && (
						<p className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
							{hint}
						</p>
					)}
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
