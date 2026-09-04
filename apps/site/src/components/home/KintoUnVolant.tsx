"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KintoUn } from "@/components/KintoUn";

/** Les figures déclenchées au clic, dans l'ordre où elles s'enchaînent. */
const FIGURES = ["boucle", "vrille", "trombe", "rebond"] as const;
type Figure = (typeof FIGURES)[number];

/** Durée de chaque figure, calée sur les `@keyframes` (globals.css). */
const DUREE: Record<Figure, number> = { boucle: 1500, vrille: 1100, trombe: 1300, rebond: 1200 };

/**
 * Le Kinto-Un qui vole au-dessus de l'accueil.
 *
 * Trois comportements, et ils ne se marchent pas dessus parce qu'ils agissent
 * sur des couches différentes : le DÉFILEMENT déplace le conteneur (propriétés
 * custom lues en CSS), le SURVOL incline la coque, et le CLIC anime le nuage
 * lui-même. Trois éléments imbriqués, une transformation chacun — les empiler
 * sur le même nœud les ferait s'écraser mutuellement.
 *
 * Le nuage suit le défilement plutôt que de traverser en boucle : le visiteur
 * qui descend a l'impression que le nuage l'accompagne, ce qu'une traversée
 * automatique ne donne jamais puisqu'elle ignore ce qu'il fait.
 */
export function KintoUnVolant() {
	const coque = useRef<HTMLDivElement>(null);
	const [figure, setFigure] = useState<Figure | null>(null);
	const [survol, setSurvol] = useState(false);
	const suivant = useRef(0);
	const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		// Un seul cadre d'animation en vol : le gestionnaire de défilement ne fait
		// que noter la position, tout le calcul se fait dans le cadre suivant.
		let cadre = 0;
		let cible = 0;
		let courant = 0;
		const el = coque.current;
		if (!el) return;

		const mesurer = () => {
			const h = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
			cible = Math.min(1, Math.max(0, window.scrollY / h));
			if (!cadre) cadre = requestAnimationFrame(peindre);
		};
		const peindre = () => {
			cadre = 0;
			// Lissage : le nuage rattrape la position de défilement au lieu de s'y
			// coller. Sans ce retard il paraît vissé à la page, pas en vol.
			courant += (cible - courant) * 0.12;
			// Trajectoire : traversée de gauche à droite sur toute la page, avec une
			// houle verticale qui donne le plané.
			el.style.setProperty("--kt-x", `${-12 + courant * 118}vw`);
			el.style.setProperty("--kt-y", `${Math.sin(courant * Math.PI * 2.4) * 9}vh`);
			el.style.setProperty("--kt-inclinaison", `${Math.cos(courant * Math.PI * 2.4) * 5}deg`);
			// Profondeur : le nuage entre loin derrière la scène (0,66 × et à peine
			// visible), passe au premier plan au tiers du parcours (1,18 ×, opaque)
			// puis s'éloigne à nouveau. C'est cette variation, et non la seule
			// translation, qui le fait appartenir à l'image plutôt que la survoler
			// — une taille constante lit comme un calque posé sur la vidéo.
			const profondeur = Math.sin(courant * Math.PI); // 0 aux bords, 1 au milieu
			el.style.setProperty("--kt-echelle", `${(0.66 + profondeur * 0.52).toFixed(3)}`);
			el.style.setProperty("--kt-opacite", `${(0.45 + profondeur * 0.5).toFixed(3)}`);
			if (Math.abs(cible - courant) > 0.0005) cadre = requestAnimationFrame(peindre);
		};

		mesurer();
		window.addEventListener("scroll", mesurer, { passive: true });
		window.addEventListener("resize", mesurer);
		return () => {
			window.removeEventListener("scroll", mesurer);
			window.removeEventListener("resize", mesurer);
			if (cadre) cancelAnimationFrame(cadre);
		};
	}, []);

	const jouer = useCallback(() => {
		// Les figures s'enchaînent d'un clic à l'autre : cliquer deux fois de suite
		// ne rejoue pas la même, sinon l'objet paraît n'avoir qu'un seul tour.
		const f = FIGURES[suivant.current % FIGURES.length];
		suivant.current += 1;
		if (minuteur.current) clearTimeout(minuteur.current);
		setFigure(null);
		// Un cadre de battement pour que le retrait de classe soit pris en compte,
		// faute de quoi rejouer la même figure ne redémarre pas l'animation.
		requestAnimationFrame(() => {
			setFigure(f);
			minuteur.current = setTimeout(() => setFigure(null), DUREE[f]);
		});
	}, []);

	useEffect(() => () => void (minuteur.current && clearTimeout(minuteur.current)), []);

	return (
		<div ref={coque} className="kt-volant" data-survol={survol || undefined}>
			<button
				type="button"
				className="kt-volant__prise"
				onClick={jouer}
				onPointerEnter={() => setSurvol(true)}
				onPointerLeave={() => setSurvol(false)}
				onFocus={() => setSurvol(true)}
				onBlur={() => setSurvol(false)}
				aria-label="Faire faire une figure au Kinto-Un"
			>
				<span className="kt-volant__nuage" data-figure={figure ?? undefined}>
					<KintoUn hauteur={120} decorative />
				</span>
				<span className="kt-volant__vitesse" aria-hidden />
			</button>
		</div>
	);
}
