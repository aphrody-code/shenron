"use client";

/**
 * Modal — coquille de fenêtre « aperçu rapide » façon Netflix, montée par une
 * route d'INTERCEPTION Next.js (`@modal/(.)…`). Quand on clique une carte depuis
 * un catalogue (`/wiki/films`, `/wiki/episodes`), Next intercepte la navigation
 * vers la fiche et rend son contenu ICI, en overlay, SANS quitter le catalogue.
 * Un accès direct / rechargement de l'URL rend la fiche pleine page (fallback
 * `default.tsx` → null pour le slot). Fermeture = `router.back()`.
 *
 * Animations d'entrée/sortie via `motion` (AnimatePresence) : l'exit joue AVANT
 * le `router.back()` (`onExitComplete`). Respecte `prefers-reduced-motion`.
 */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

export function Modal({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const reduce = useReducedMotion();
	const [open, setOpen] = useState(true);
	const close = useCallback(() => setOpen(false), []);

	// Esc pour fermer + verrouillage du scroll de la page derrière la modale.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		document.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [close]);

	return (
		<AnimatePresence onExitComplete={() => router.back()}>
			{open && (
				<motion.div
					className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/80 p-4 backdrop-blur-sm sm:items-center sm:p-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: reduce ? 0 : 0.2 }}
					onClick={close}
					role="dialog"
					aria-modal="true"
				>
					<motion.div
						className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-dbz-border bg-dbz-card shadow-2xl"
						initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
						animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
						exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 12 }}
						transition={{ duration: reduce ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							onClick={close}
							aria-label="Fermer"
							className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition-colors hover:bg-dbz-orange hover:text-black"
						>
							<X className="h-5 w-5" />
						</button>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
