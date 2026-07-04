"use client";

/**
 * Modal — coquille de fenêtre « aperçu rapide » façon Netflix, montée par une
 * route d'INTERCEPTION Next.js (`@modal/(.)…`). Quand on clique une carte depuis
 * un catalogue (`/wiki/films`), Next intercepte la navigation vers la fiche et
 * rend son contenu ICI, en overlay, SANS quitter le catalogue. Un accès direct /
 * rechargement de l'URL rend la fiche pleine page (fallback `default.tsx` → null
 * pour le slot). Fermeture = `router.back()`.
 *
 * A11y : `role="dialog" aria-modal` sur le PANNEAU, focus déplacé dedans à
 * l'ouverture, **piège de focus** (Tab boucle dans la modale), focus restauré à
 * la fermeture. Esc / clic backdrop / bouton X ferment. Scroll de la page
 * verrouillé. Animations entrée/sortie via `motion` (l'exit joue AVANT le
 * `router.back()` via `onExitComplete`) ; respecte `prefers-reduced-motion`.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

const FOCUSABLE =
	'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

export function Modal({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const reduce = useReducedMotion();
	const [open, setOpen] = useState(true);
	const panelRef = useRef<HTMLDivElement>(null);
	const close = useCallback(() => setOpen(false), []);

	useEffect(() => {
		const prevFocused = document.activeElement as HTMLElement | null;
		// Déplace le focus dans la modale (panneau focusable via tabIndex=-1).
		panelRef.current?.focus();

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				close();
				return;
			}
			if (e.key !== "Tab") return;
			// Piège de focus : Tab/Shift+Tab bouclent dans le panneau.
			const panel = panelRef.current;
			if (!panel) return;
			const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
			if (items.length === 0) {
				e.preventDefault();
				panel.focus();
				return;
			}
			const first = items[0]!;
			const last = items[items.length - 1]!;
			const active = document.activeElement as HTMLElement | null;
			// Le focus s'est échappé du panneau (ex. clic sur du texte non focusable
			// → blur vers <body>) : on le ramène dans la modale.
			if (!active || !panel.contains(active)) {
				e.preventDefault();
				(e.shiftKey ? last : first).focus();
			} else if (e.shiftKey && active === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			}
		};
		document.addEventListener("keydown", onKey);

		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = prevOverflow;
			// Rends le focus à l'élément déclencheur (la carte cliquée).
			prevFocused?.focus?.();
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
				>
					<motion.div
						ref={panelRef}
						tabIndex={-1}
						role="dialog"
						aria-modal="true"
						aria-labelledby="stream-modal-title"
						className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-dbz-border bg-dbz-card shadow-2xl outline-none"
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
							className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition-colors hover:border-dbz-orange hover:bg-dbz-orange hover:text-black"
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
