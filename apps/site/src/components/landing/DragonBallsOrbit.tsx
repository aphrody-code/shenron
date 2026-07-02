/**
 * Les 7 Dragon Balls en orbite — réutilise le composant `DragonBall` (SVG svgrepo
 * ambré + étoiles rouges) positionné sur un cercle, conteneur en rotation lente.
 * Server component, 0 JS (animation CSS pure). Remplace l'ancien rendu procédural.
 */
import { DragonBall } from "@/components/DragonBall";

const STARS = [1, 2, 3, 4, 5, 6, 7] as const;

export function DragonBallsOrbit({
	size = 420,
	className = "",
}: {
	size?: number;
	className?: string;
}) {
	const orbit = size * 0.36;
	const ballSize = Math.round(size * 0.17);

	return (
		<div className={`db-orbit relative ${className}`} style={{ width: size, height: size }}>
			{/* Aura + anneau pointillé */}
			<div
				className="db-orbit__ring absolute rounded-full"
				style={{
					inset: size / 2 - orbit,
					width: orbit * 2,
					height: orbit * 2,
				}}
			/>
			<div className="db-orbit__spin absolute inset-0">
				{STARS.map((s, i) => {
					const angle = (i / STARS.length) * Math.PI * 2 - Math.PI / 2;
					const x = size / 2 + Math.cos(angle) * orbit - ballSize / 2;
					const y = size / 2 + Math.sin(angle) * orbit - ballSize / 2;
					return (
						<div
							key={s}
							className="db-orbit__ball absolute"
							style={{ left: x, top: y, width: ballSize, height: ballSize }}
						>
							<DragonBall
								stars={s}
								size={ballSize}
								className="db-orbit__cr drop-shadow-[0_0_12px_rgba(245,191,65,0.45)]"
							/>
						</div>
					);
				})}
			</div>

			<style>{`
				.db-orbit__ring {
					border: 1px dashed rgba(255,178,0,0.18);
					box-shadow: 0 0 60px 10px rgba(255,152,0,0.12) inset;
				}
				.db-orbit__spin { animation: db-orbit-rot 38s linear infinite; transform-origin: 50% 50%; }
				/* Contre-rotation : les boules restent droites pendant que l'orbite tourne. */
				.db-orbit__cr { animation: db-orbit-rot 38s linear infinite reverse; transform-origin: 50% 50%; }
				@keyframes db-orbit-rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
				@media (prefers-reduced-motion: reduce) {
					.db-orbit__spin, .db-orbit__cr { animation: none; }
				}
			`}</style>
		</div>
	);
}
