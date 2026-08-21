"use client";

/**
 * Déclencheur de la recherche globale (bouton de la nav + raccourci ⌘K).
 *
 * Volontairement minuscule : ce composant est monté par `SiteNav`, donc présent
 * sur TOUTES les pages. La palette elle-même (`CommandPalette`, avec `cmdk` et
 * ses douze groupes de résultats) est chargée à la demande — au premier survol
 * ou focus du bouton, ou à la première pression de ⌘K. Un visiteur qui ne
 * cherche jamais ne télécharge jamais ce code.
 */
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

// `ssr: false` : la palette n'a rien à rendre côté serveur (elle est fermée) et
// n'existe que suite à une interaction.
const CommandPalette = dynamic(() => import("@/components/CommandPalette"), { ssr: false });

export function CommandMenu({ variant = "bar" }: { variant?: "bar" | "icon" } = {}) {
	const [open, setOpen] = useState(false);
	// Une fois armé, le module reste monté : rouvrir est instantané.
	const [arme, setArme] = useState(false);

	const armer = useCallback(() => setArme(true), []);

	const basculer = useCallback((v: boolean | ((o: boolean) => boolean)) => {
		setArme(true);
		setOpen(v);
	}, []);

	// ⌘K / Ctrl+K — bascule globale. Vit ici pour rester actif sans charger la palette.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				basculer((o) => !o);
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [basculer]);

	return (
		<>
			<button
				type="button"
				onClick={() => basculer(true)}
				onPointerEnter={armer}
				onFocus={armer}
				aria-label="Rechercher dans l'univers Dragon Ball (Ctrl+K)"
				className={
					variant === "icon"
						? // Déclencheur compact de l'en-tête mobile : la palette n'était
							// rendue que dans un conteneur `hidden lg:flex`, donc AUCUNE
							// recherche n'existait sous 1024 px — ni bouton, ni champ, et le
							// raccourci ⌘K ne veut rien dire sans clavier.
							"grid h-10 w-10 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
						: "group inline-flex items-center gap-2.5 h-9 pl-3 pr-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-dbz-orange/40 text-white/55 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
				}
			>
				<svg
					width="15"
					height="15"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</svg>
				{variant === "bar" && (
					<>
						{/* Visible dès `lg` et non `xl` : entre 1024 et 1280 px la barre est
						    large, et le bouton n'affichait qu'une loupe muette. */}
						<span className="hidden lg:inline font-display text-[13px] tracking-normal">
							Rechercher…
						</span>
						<kbd className="hidden lg:inline-flex items-center gap-0.5 font-display text-[10px] font-semibold text-white/50 bg-white/[0.06] border border-white/10 rounded px-1.5 py-0.5">
							⌘K
						</kbd>
					</>
				)}
			</button>

			{arme && <CommandPalette open={open} onOpenChange={setOpen} />}
		</>
	);
}
