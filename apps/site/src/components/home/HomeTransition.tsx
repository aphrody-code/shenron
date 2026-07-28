"use client";

/**
 * Flash de transition entre panneaux — « téléport / scouter lock ».
 * API impérative via `apiRef` pour coller au changement d'index sans re-render.
 */
import { useEffect, useRef, type MutableRefObject } from "react";

export type HomeTransitionApi = {
	/** Flash d'accent (section change). */
	flash: (accentCss?: string) => void;
};

export function HomeTransition({
	apiRef,
}: {
	apiRef: MutableRefObject<HomeTransitionApi | null>;
}) {
	const elRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		apiRef.current = {
			flash: (accent) => {
				const el = elRef.current;
				if (!el) return;
				if (accent) el.style.setProperty("--flash-accent", accent);
				el.classList.remove("is-firing");
				// Force reflow pour rejouer l'anim
				void el.offsetWidth;
				el.classList.add("is-firing");
				window.setTimeout(() => el.classList.remove("is-firing"), 700);
			},
		};
		return () => {
			apiRef.current = null;
		};
	}, [apiRef]);

	return <div ref={elRef} className="home-transition" aria-hidden />;
}
