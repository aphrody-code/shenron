/**
 * DragonBall — boule de cristal Dragon Ball en SVG pur (0 JS, server-safe).
 *
 * Basé sur le design svgrepo #484265 (sphère ambrée + reflet clair + glint blanc)
 * étendu pour porter 1 à 7 étoiles rouges (les sept boules canoniques). Réutilisable
 * partout : décor, loader, puce de marque, orbite. Remplace l'ancien rendu
 * procédural crude de `DragonBallsOrbit`.
 */

export type DragonBallStars = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Positions normalisées des étoiles (0 = centre ; unité = fraction du viewBox 512).
const STAR_LAYOUT: Record<number, ReadonlyArray<readonly [number, number]>> = {
	1: [[0, 0]],
	2: [
		[-0.22, 0],
		[0.22, 0],
	],
	3: [
		[0, -0.24],
		[-0.21, 0.13],
		[0.21, 0.13],
	],
	4: [
		[-0.2, -0.2],
		[0.2, -0.2],
		[-0.2, 0.2],
		[0.2, 0.2],
	],
	5: [
		[-0.22, -0.2],
		[0.22, -0.2],
		[0, 0],
		[-0.22, 0.2],
		[0.22, 0.2],
	],
	6: [
		[-0.22, -0.22],
		[0.22, -0.22],
		[-0.22, 0],
		[0.22, 0],
		[-0.22, 0.22],
		[0.22, 0.22],
	],
	7: [
		[0, -0.26],
		[-0.22, -0.11],
		[0.22, -0.11],
		[0, 0.04],
		[-0.22, 0.2],
		[0.22, 0.2],
		[0, 0.28],
	],
};

/** Points d'une étoile à 5 branches centrée en (cx,cy), rayon externe `outer`. */
function starPoints(cx: number, cy: number, outer: number): string {
	const inner = outer * 0.42;
	const pts: string[] = [];
	for (let i = 0; i < 10; i++) {
		const rad = i % 2 === 0 ? outer : inner;
		const ang = -Math.PI / 2 + (i * Math.PI) / 5;
		pts.push(`${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`);
	}
	return pts.join(" ");
}

export function DragonBall({
	stars = 4,
	size = 64,
	className,
	title,
}: {
	stars?: number;
	size?: number;
	className?: string;
	title?: string;
}) {
	const n = Math.min(7, Math.max(1, Math.round(stars)));
	const layout = STAR_LAYOUT[n] ?? STAR_LAYOUT[4];
	// Étoiles plus grandes quand elles sont peu nombreuses.
	const starR = n <= 2 ? 64 : n <= 4 ? 52 : 40;
	const label = title ?? `Dragon Ball à ${n} étoile${n > 1 ? "s" : ""}`;

	return (
		<svg
			viewBox="0 0 512 512"
			width={size}
			height={size}
			className={className}
			role="img"
			aria-label={label}
		>
			{/* Sphère ambrée de base */}
			<circle cx="256" cy="256" r="256" fill="#F5BF41" />
			{/* Ombre portée bas-droite (svgrepo) */}
			<path
				fill="#E9AE3B"
				d="M451.823,319.517c-20.442,62.928-70.588,112.753-133.704,132.757c-6.949,2.207-10.797,9.63-8.591,16.572c2.2,6.943,9.623,10.79,16.566,8.583c71.297-22.633,127.699-78.677,150.827-149.76c2.257-6.928-1.541-14.373-8.469-16.63C461.523,308.791,454.079,312.588,451.823,319.517L451.823,319.517z"
			/>
			{/* Demi-reflet clair haut-gauche (svgrepo) */}
			<path
				fill="#F9D791"
				d="M256,0C114.613,0,0,114.609,0,256c0,82.805,39.349,156.38,100.329,203.174l358.844-358.844C412.38,39.349,338.804,0,256,0z"
			/>
			{/* Glint blanc lustré (svgrepo) */}
			<path
				fill="#FFFFFF"
				d="M199.047,30.816C117.969,51.35,53.872,114.451,31.897,194.949c-1.92,7.029,2.225,14.294,9.257,16.206c7.029,1.921,14.287-2.228,16.207-9.257C76.767,130.644,133.76,74.535,205.516,56.402c7.072-1.792,11.349-8.971,9.558-16.028C213.291,33.302,206.111,29.024,199.047,30.816z"
			/>
			{/* Étoiles rouges (1 à 7) */}
			{layout.map(([nx, ny], i) => (
				<polygon
					key={i}
					points={starPoints(256 + nx * 512, 256 + ny * 512, starR)}
					fill="#E94C1A"
				/>
			))}
		</svg>
	);
}

/** Loader animé : une Dragon Ball qui tourne (état de chargement). */
export function DragonBallLoader({
	size = 40,
	stars = 4,
	className = "",
}: {
	size?: number;
	stars?: DragonBallStars;
	className?: string;
}) {
	return (
		<span
			className={`inline-block ${className}`}
			style={{ width: size, height: size, animation: "db-spin 1.1s linear infinite" }}
			aria-label="Chargement"
			role="status"
		>
			<DragonBall stars={stars} size={size} />
			<style>{`@keyframes db-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){[role=status]{animation:none!important}}`}</style>
		</span>
	);
}
