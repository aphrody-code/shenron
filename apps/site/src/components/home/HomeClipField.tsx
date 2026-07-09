"use client";

// Champ de clips cinématiques qui dérivent à travers le héro — tous en même
// temps, chacun à une hauteur, une vitesse, une taille ALÉATOIRES. Le tirage se
// fait exclusivement côté client (useEffect) → aucun mismatch d'hydratation (le
// serveur rend null), et l'ordre/placement changent à chaque visite.
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

// Mélange Fisher-Yates (client-only → Math.random autorisé, pas de SSR ici).
function shuffled<T>(arr: readonly T[]): T[] {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
const rand = (min: number, max: number) => min + Math.random() * (max - min);

// Tirage ALÉATOIRE : on pioche `max` clips au hasard dans TOUT le pool vidéo, et
// chaque clip reçoit une hauteur, une taille, une opacité et une vitesse tirées
// au sort → champ vivant et différent à chaque chargement.
function buildDrifts(scenes: readonly HomeScene[], max: number): Drift[] {
	const pool = scenes.filter((s) => s.video);
	const count = Math.min(max, pool.length);
	return shuffled(pool)
		.slice(0, count)
		.map((sc, i) => {
			const dur = rand(26, 48); // 26–48 s, vitesses variées
			return {
				key: `${sc.id}-${i}`,
				// Version web (720p ~4 Mbps) : nette à la taille d'affichage (≤ ~260px),
				// bien plus légère que le master 1080p (60-90 Mo) → décode fluide même
				// avec plusieurs clips simultanés.
				src: sc.video ? assetUrl(sc.video.replace(/\.mp4$/i, ".web.mp4")) : "",
				poster: sc.poster ? assetUrl(sc.poster) : assetUrl(sc.image),
				top: rand(1, 84), // réparti sur toute la hauteur
				dur,
				// départ déjà en vol, échelonné → le champ est plein dès le 1er rendu
				delay: -rand(0, dur),
				scale: rand(0.82, 1.42), // tailles variées, plus présentes
				opacity: rand(0.6, 0.9), // nettement plus vives/nettes qu'avant (0.42-0.62)
				blur: 0,
				dir: Math.random() < 0.5 ? "ltr" : "rtl",
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
	maxDesktop = 6,
	maxTablet = 3,
}: {
	scenes: readonly HomeScene[];
	active: boolean;
	/** Nombre de clips flottants sur desktop (≥1024px). Configurable depuis /admin/home. */
	maxDesktop?: number;
	/** Nombre de clips flottants sur tablette (641–1023px). Téléphone = toujours 0. */
	maxTablet?: number;
}) {
	// Côté client uniquement → aucun mismatch d'hydratation (serveur renvoie null).
	const [drifts, setDrifts] = useState<readonly Drift[]>([]);

	useEffect(() => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
		if (reduce || conn?.saveData) return;
		// Borne la charge de décodage selon la largeur : desktop, tablette réduite,
		// téléphone aucun (le SceneBackdrop plein écran suffit). Compte piloté par la config.
		const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
		const isPhone = window.matchMedia("(max-width: 640px)").matches;
		const max = isDesktop ? maxDesktop : isPhone ? 0 : maxTablet;
		if (max <= 0) return;
		setDrifts(buildDrifts(scenes, max));
	}, [scenes, maxDesktop, maxTablet]);

	if (drifts.length === 0) return null;

	return (
		<div className={`home-clip-field${active ? " is-live" : ""}`} aria-hidden>
			{drifts.map((d, i) => (
				<ClipVideo key={d.key} drift={d} index={i} active={active} />
			))}
		</div>
	);
}
