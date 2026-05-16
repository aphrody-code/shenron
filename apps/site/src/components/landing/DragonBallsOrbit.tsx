"use client";

/**
 * 7 Dragon Balls cosmiques en orbite — version galactique :
 * sphères verre+gradient violet→cyan avec étoile magenta intérieure,
 * orbite SVG continue. Le centre sert d'ancrage pour le titre.
 */

const STARS = [1, 2, 3, 4, 5, 6, 7] as const;

export function DragonBallsOrbit({
	size = 520,
	className = "",
}: {
	size?: number;
	className?: string;
}) {
	const radius = size * 0.42;
	const ballSize = size * 0.11;
	return (
		<div
			className={`relative ${className}`}
			style={{ width: size, height: size }}
			aria-hidden
		>
			{/* Orbite SVG en pointillés */}
			<svg
				width={size}
				height={size}
				className="absolute inset-0 pointer-events-none"
			>
				<defs>
					<linearGradient id="orbit-grad" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
						<stop offset="50%" stopColor="#38bdf8" stopOpacity="0.6" />
						<stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
					</linearGradient>
				</defs>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="url(#orbit-grad)"
					strokeWidth="1"
					strokeDasharray="2 6"
					className="orbit-spin"
					style={{ transformOrigin: "center" }}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius * 1.08}
					fill="none"
					stroke="rgba(255,107,26,0.15)"
					strokeWidth="1"
				/>
			</svg>

			{/* 7 boules réparties uniformément, animation rotation contraire */}
			<div className="absolute inset-0 ball-orbit">
				{STARS.map((n, i) => {
					const angle = (i / STARS.length) * Math.PI * 2 - Math.PI / 2;
					const x = size / 2 + Math.cos(angle) * radius - ballSize / 2;
					const y = size / 2 + Math.sin(angle) * radius - ballSize / 2;
					return (
						<div
							key={n}
							className="absolute ball-float"
							style={{
								left: x,
								top: y,
								width: ballSize,
								height: ballSize,
								animationDelay: `${i * 0.4}s`,
							}}
						>
							<DragonBall stars={n} size={ballSize} />
						</div>
					);
				})}
			</div>

			<style>{`
				@keyframes orbit-spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
				.orbit-spin { animation: orbit-spin 80s linear infinite; }
				.ball-orbit { animation: orbit-spin 120s linear infinite; }
				@keyframes ball-float {
					0%, 100% { transform: scale(1) translateY(0); filter: brightness(1); }
					50% { transform: scale(1.08) translateY(-4px); filter: brightness(1.3); }
				}
				.ball-float { animation: ball-float 4s ease-in-out infinite; }
			`}</style>
		</div>
	);
}

function DragonBall({ stars, size }: { stars: number; size: number }) {
	const id = `db-${stars}`;
	return (
		<svg viewBox="0 0 100 100" width={size} height={size}>
			<defs>
				<radialGradient id={`${id}-body`} cx="35%" cy="30%" r="75%">
					<stop offset="0%" stopColor="#fef3c7" stopOpacity="0.95" />
					<stop offset="35%" stopColor="#c4b5fd" stopOpacity="0.85" />
					<stop offset="70%" stopColor="#7c3aed" stopOpacity="0.9" />
					<stop offset="100%" stopColor="#3b0764" stopOpacity="1" />
				</radialGradient>
				<radialGradient id={`${id}-shine`} cx="30%" cy="25%" r="25%">
					<stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
					<stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
				</radialGradient>
				<filter id={`${id}-glow`}>
					<feGaussianBlur stdDeviation="3" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			{/* Halo extérieur */}
			<circle cx="50" cy="50" r="48" fill={`url(#${id}-body)`} opacity="0.3" />
			{/* Sphère principale */}
			<circle
				cx="50"
				cy="50"
				r="42"
				fill={`url(#${id}-body)`}
				stroke="rgba(255,107,26,0.4)"
				strokeWidth="0.5"
			/>
			{/* Étoiles rouge/magenta intérieures */}
			<g filter={`url(#${id}-glow)`}>
				{starPositions(stars).map(([cx, cy], i) => (
					<polygon
						key={i}
						points={starPath(cx, cy, 4)}
						fill="#ec4899"
						stroke="#fbbf24"
						strokeWidth="0.4"
					/>
				))}
			</g>
			{/* Reflet brillant */}
			<ellipse cx="38" cy="32" rx="14" ry="8" fill={`url(#${id}-shine)`} />
		</svg>
	);
}

/** Position des étoiles selon le nombre (canon Dragon Ball) */
function starPositions(n: number): Array<[number, number]> {
	const c = 50;
	switch (n) {
		case 1:
			return [[c, c]];
		case 2:
			return [
				[c - 10, c],
				[c + 10, c],
			];
		case 3:
			return [
				[c, c - 10],
				[c - 10, c + 6],
				[c + 10, c + 6],
			];
		case 4:
			return [
				[c - 10, c - 10],
				[c + 10, c - 10],
				[c - 10, c + 10],
				[c + 10, c + 10],
			];
		case 5:
			return [
				[c, c],
				[c - 11, c - 11],
				[c + 11, c - 11],
				[c - 11, c + 11],
				[c + 11, c + 11],
			];
		case 6:
			return [
				[c - 11, c - 11],
				[c, c - 11],
				[c + 11, c - 11],
				[c - 11, c + 11],
				[c, c + 11],
				[c + 11, c + 11],
			];
		case 7:
			return [
				[c, c],
				[c - 12, c - 12],
				[c, c - 12],
				[c + 12, c - 12],
				[c - 12, c + 12],
				[c, c + 12],
				[c + 12, c + 12],
			];
		default:
			return [[c, c]];
	}
}

function starPath(cx: number, cy: number, r: number): string {
	const pts: string[] = [];
	for (let i = 0; i < 10; i++) {
		const angle = (Math.PI / 5) * i - Math.PI / 2;
		const rad = i % 2 === 0 ? r : r * 0.45;
		pts.push(`${cx + Math.cos(angle) * rad},${cy + Math.sin(angle) * rad}`);
	}
	return pts.join(" ");
}
