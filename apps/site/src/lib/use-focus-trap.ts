"use client";

/**
 * Piège de focus pour une boîte de dialogue modale (WCAG 2.4.3 / 2.1.2).
 *
 * Extrait de `components/stream/Modal.tsx`, dont l'implémentation était correcte
 * et complète — mais privée. `wiki/CharacterFilterModal.tsx`, la seule modale
 * réellement atteinte par un visiteur, n'avait, elle, ni déplacement du focus à
 * l'ouverture, ni piège, ni restitution : le focus restait sur le déclencheur
 * derrière le voile, Tab parcourait la page en dessous, et fermer ne rendait le
 * focus à rien.
 *
 * Gère aussi le cas d'échappement : un clic sur du texte non focusable déplace
 * le focus vers `<body>` : la prochaine tabulation le ramène dans le panneau au
 * lieu de repartir en haut du document.
 */
import { useEffect, type RefObject } from "react";

const FOCUSABLE =
	'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
	panelRef: RefObject<HTMLElement | null>,
	active: boolean,
	onEscape?: () => void
): void {
	useEffect(() => {
		if (!active) return;
		const prevFocused = document.activeElement as HTMLElement | null;
		// Le panneau doit porter `tabIndex={-1}` pour pouvoir recevoir le focus.
		panelRef.current?.focus();

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onEscape?.();
				return;
			}
			if (e.key !== "Tab") return;
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
			const current = document.activeElement as HTMLElement | null;
			if (!current || !panel.contains(current)) {
				e.preventDefault();
				(e.shiftKey ? last : first).focus();
			} else if (e.shiftKey && current === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && current === last) {
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
			// Rend le focus au déclencheur : sans ça, fermer la modale laisse
			// l'utilisateur au clavier en haut du document.
			prevFocused?.focus?.();
		};
	}, [panelRef, active, onEscape]);
}
