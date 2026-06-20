"use client";

// Champ de clips cinématiques qui DÉRIVENT à travers le héro — tous en même
// temps, chacun à une hauteur, une vitesse, une taille et un sens tirés au
// hasard. Remplace l'ancien sélecteur de fond (rangée de vignettes cliquables).
// Purement décoratif : `pointer-events: none`, derrière le contenu du héro,
// désactivé en reduced-motion / save-data, et mis en pause hors panneau actif.
import { useEffect, useState } from "react";
import { assetUrl } from "@/lib/assets";
import type { HomeScene } from "@/lib/home-scenes";

interface Drift {
	readonly key: string;
	readonly src: string;
	readonly top: number; // %
	readonly dur: number; // s
	readonly delay: number; // s (négatif → déjà en vol, décalé)
	readonly scale: number;
	readonly opacity: number;
	readonly blur: number;
	readonly dir: "ltr" | "rtl";
}

export function HomeClipField({
	scenes,
	active,
}: {
	scenes: readonly HomeScene[];
	active: boolean;
}) {
	// Tirage au sort côté client uniquement → aucun mismatch d'hydratation
	// (le serveur et le 1er rendu client renvoient `null`).
	const [drifts, setDrifts] = useState<readonly Drift[]>([]);

	useEffect(() => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
		if (reduce || conn?.saveData) return;

		const pool = [...scenes];
		for (let i = pool.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[pool[i], pool[j]] = [pool[j], pool[i]];
		}
		const count = Math.min(9, pool.length);
		const arr: Drift[] = pool.slice(0, count).map((sc, i) => {
			const dur = 26 + Math.random() * 24; // 26–50 s
			return {
				key: `${sc.id}-${i}`,
				src: assetUrl(sc.poster || sc.image),
				top: 2 + Math.random() * 80, // 2–82 %
				dur,
				delay: -Math.random() * dur, // démarre à un point aléatoire du trajet
				scale: 0.68 + Math.random() * 0.72, // 0.68–1.4
				opacity: 0.16 + Math.random() * 0.2, // 0.16–0.36
				blur: Math.random() < 0.5 ? Math.random() * 1.6 : 0,
				dir: Math.random() < 0.5 ? "ltr" : "rtl",
			};
		});
		setDrifts(arr);
	}, [scenes]);

	if (drifts.length === 0) return null;

	return (
		<div className={`home-clip-field${active ? " is-live" : ""}`} aria-hidden>
			{drifts.map((d) => (
				<div
					key={d.key}
					className={`home-clip home-clip--${d.dir}`}
					style={{
						top: `${d.top}%`,
						animationDuration: `${d.dur}s`,
						animationDelay: `${d.delay}s`,
						filter: d.blur ? `blur(${d.blur}px)` : undefined,
						// custom props consommées par les keyframes
						["--s" as string]: d.scale,
						["--o" as string]: d.opacity,
					}}
				>
					<img src={d.src} alt="" loading="lazy" />
				</div>
			))}
		</div>
	);
}
