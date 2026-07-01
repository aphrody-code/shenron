"use client";

// Champ de clips cinématiques qui dérivent à travers le héro — tous en même
// temps, chacun à une hauteur, une vitesse, une taille tirées de l'index
// (déterministe → zéro mismatch d'hydratation, ordre stable).
// Purement décoratif : pointer-events:none, derrière le contenu du héro,
// désactivé en reduced-motion / save-data, mis en pause hors panneau actif.
import { useEffect, useRef, useState } from "react";
import { assetUrl } from "@/lib/assets";
import type { HomeScene } from "@/lib/home-scenes";

interface Drift {
	readonly key: string;
	readonly src: string; // .web.mp4
	readonly poster: string;
	readonly top: number; // %
	readonly dur: number; // s
	readonly delay: number; // s (négatif → déjà en vol)
	readonly scale: number;
	readonly opacity: number;
	readonly blur: number;
	readonly dir: "ltr" | "rtl";
}

// Paramètres déterministes basés sur l'index — même résultat SSR/CSR, pas de shuffle.
function buildDrifts(scenes: readonly HomeScene[], max: number): Drift[] {
	const count = Math.min(max, scenes.length);
	return scenes.slice(0, count).map((sc, i) => {
		const dur = 28 + ((i * 7) % 22); // 28–50 s
		return {
			key: `${sc.id}-${i}`,
			src: sc.video ? assetUrl(sc.video.replace(/\.mp4$/i, ".web.mp4")) : "",
			poster: sc.poster ? assetUrl(sc.poster) : assetUrl(sc.image),
			top: 2 + ((i * 11) % 80), // 2–82 %
			dur,
			delay: -((i * dur) / count), // décale le départ pour remplir le champ dès le premier rendu
			scale: 0.72 + ((i % 4) * 0.18), // 0.72–1.26
			opacity: 0.32 + ((i % 3) * 0.09), // 0.32–0.50
			blur: i % 3 === 0 ? 0.8 : 0,
			dir: i % 2 === 0 ? "ltr" : "rtl",
		};
	});
}

// Composant isolé par clip — chaque vidéo a son propre ref pour play/pause.
// Séparé pour que useEffect ne dépende que des props de CE clip, pas du tableau.
function ClipVideo({ drift, active, index }: { drift: Drift; active: boolean; index: number }) {
	const ref = useRef<HTMLVideoElement>(null);

	// Joue/met en pause selon le panneau actif — évite que les vidéos continuent
	// de décoder hors-champ et freeze quand elles reprennent. Démarrages échelonnés
	// (index * 250 ms) pour ne pas réclamer tous les décodeurs matériels d'un coup.
	useEffect(() => {
		const v = ref.current;
		if (!v) return;
		if (!active) {
			v.pause();
			return;
		}
		const t = setTimeout(() => {
			v.play().catch(() => {});
		}, index * 250);
		return () => clearTimeout(t);
	}, [active, index]);

	if (!drift.src) return null;

	return (
		<div
			className={`home-clip home-clip--${drift.dir}`}
			style={{
				top: `${drift.top}%`,
				animationDuration: `${drift.dur}s`,
				animationDelay: `${drift.delay}s`,
				filter: drift.blur ? `blur(${drift.blur}px)` : undefined,
				["--s" as string]: drift.scale,
				["--o" as string]: drift.opacity,
			}}
		>
			<video
				ref={ref}
				src={drift.src}
				poster={drift.poster}
				loop
				muted
				playsInline
				preload="none"
			/>
		</div>
	);
}

export function HomeClipField({
	scenes,
	active,
}: {
	scenes: readonly HomeScene[];
	active: boolean;
}) {
	// Côté client uniquement → aucun mismatch d'hydratation (serveur renvoie null).
	const [drifts, setDrifts] = useState<readonly Drift[]>([]);

	useEffect(() => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
		if (reduce || conn?.saveData) return;
		// Borne la charge de décodage selon la largeur : desktop léger (4 clips),
		// tablette réduite (2), téléphone aucun (le SceneBackdrop plein écran suffit).
		const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
		const isPhone = window.matchMedia("(max-width: 640px)").matches;
		const max = isDesktop ? 4 : isPhone ? 0 : 2;
		if (max === 0) return;
		setDrifts(buildDrifts(scenes, max));
	}, [scenes]);

	if (drifts.length === 0) return null;

	return (
		<div className={`home-clip-field${active ? " is-live" : ""}`} aria-hidden>
			{drifts.map((d, i) => (
				<ClipVideo key={d.key} drift={d} index={i} active={active} />
			))}
		</div>
	);
}
