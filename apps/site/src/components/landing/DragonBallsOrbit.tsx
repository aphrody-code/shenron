/**
 * 7 Dragon Balls réalistes en orbite — pure SVG, server component, 0 JS.
 * Sphère orange ambrée (canon Toriyama) + 1-7 étoiles rouges + reflet vitré.
 */

const STARS_PER_BALL = [1, 2, 3, 4, 5, 6, 7] as const;

const STAR_POS: Record<number, Array<[number, number]>> = {
	1: [[0, 0]],
	2: [
		[-0.22, 0],
		[0.22, 0],
	],
	3: [
		[0, -0.25],
		[-0.22, 0.13],
		[0.22, 0.13],
	],
	4: [
		[-0.22, -0.22],
		[0.22, -0.22],
		[-0.22, 0.22],
		[0.22, 0.22],
	],
	5: [
		[-0.25, -0.22],
		[0.25, -0.22],
		[0, 0],
		[-0.25, 0.22],
		[0.25, 0.22],
	],
	6: [
		[-0.25, -0.25],
		[0.25, -0.25],
		[-0.25, 0],
		[0.25, 0],
		[-0.25, 0.25],
		[0.25, 0.25],
	],
	7: [
		[0, -0.3],
		[-0.25, -0.12],
		[0.25, -0.12],
		[0, 0.06],
		[-0.25, 0.24],
		[0.25, 0.24],
		[0, 0.3],
	],
};

function DragonBall({
	stars,
	size,
	x,
	y,
}: {
	stars: number;
	size: number;
	x: number;
	y: number;
}) {
	const r = size / 2;
	const positions = STAR_POS[stars] ?? [];
	return (
		<g transform={`translate(${x} ${y})`}>
			<circle cx="0" cy="0" r={r} fill={`url(#dbf-grad)`} />
			<ellipse
				cx={-r * 0.3}
				cy={-r * 0.35}
				rx={r * 0.35}
				ry={r * 0.22}
				fill="white"
				opacity="0.55"
			/>
			<ellipse
				cx={r * 0.35}
				cy={r * 0.3}
				rx={r * 0.15}
				ry={r * 0.08}
				fill="white"
				opacity="0.15"
			/>
			{positions.map(([sx, sy], i) => (
				<polygon
					key={`${stars}-${i}`}
					points="0,-12 3.5,-3.7 11.4,-3.7 5,1.4 7,11.4 0,5.7 -7,11.4 -5,1.4 -11.4,-3.7 -3.5,-3.7"
					transform={`translate(${sx * size} ${sy * size}) scale(${size / 110})`}
					fill="#c81b1b"
				/>
			))}
			<circle
				cx="0"
				cy="0"
				r={r - 0.5}
				fill="none"
				stroke="rgba(0,0,0,0.25)"
				strokeWidth="1"
			/>
		</g>
	);
}

export function DragonBallsOrbit({
	size = 420,
	className = "",
}: {
	size?: number;
	className?: string;
}) {
	const cx = size / 2;
	const cy = size / 2;
	const orbit = size * 0.36;
	const ballSize = size * 0.16;

	return (
		<div
			className={`relative ${className}`}
			style={{ width: size, height: size }}
		>
			<svg
				viewBox={`0 0 ${size} ${size}`}
				width={size}
				height={size}
				aria-label="Sept Dragon Balls"
				role="img"
			>
				<defs>
					<radialGradient id="dbf-grad" cx="0.32" cy="0.32" r="0.85">
						<stop offset="0%" stopColor="#ffe9a8" />
						<stop offset="35%" stopColor="#ffb74d" />
						<stop offset="70%" stopColor="#f57c00" />
						<stop offset="100%" stopColor="#b34700" />
					</radialGradient>
					<radialGradient id="dbf-aura" cx="0.5" cy="0.5" r="0.5">
						<stop offset="0%" stopColor="#ffb74d" stopOpacity="0.5" />
						<stop offset="60%" stopColor="#ff9800" stopOpacity="0.15" />
						<stop offset="100%" stopColor="#ff9800" stopOpacity="0" />
					</radialGradient>
				</defs>

				<circle
					cx={cx}
					cy={cy}
					r={orbit + ballSize / 2}
					fill="url(#dbf-aura)"
				/>
				<circle
					cx={cx}
					cy={cy}
					r={orbit}
					fill="none"
					stroke="rgba(255,178,0,0.18)"
					strokeWidth="1"
					strokeDasharray="3 6"
				/>

				<g className="dbf-spin" style={{ transformOrigin: `${cx}px ${cy}px` }}>
					{STARS_PER_BALL.map((stars, i) => {
						const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
						return (
							<DragonBall
								key={stars}
								stars={stars}
								size={ballSize}
								x={cx + Math.cos(angle) * orbit}
								y={cy + Math.sin(angle) * orbit}
							/>
						);
					})}
				</g>
			</svg>

			<style>{`
				.dbf-spin { animation: dbf-rotate 38s linear infinite; }
				@keyframes dbf-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
				@media (prefers-reduced-motion: reduce) { .dbf-spin { animation: none; } }
			`}</style>
		</div>
	);
}
