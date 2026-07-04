"use client";

/**
 * MotionReveal — entrée animée « à ressort » (motion.dev) du contenu du billboard
 * (fondu + montée). Îlot CLIENT léger enveloppant du contenu rendu SERVEUR (le
 * backdrop LCP reste server/priority hors de cet îlot). Respecte
 * `prefers-reduced-motion` → rendu statique immédiat, aucun mouvement.
 */
import { motion, useReducedMotion } from "motion/react";

export function MotionReveal({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const reduce = useReducedMotion();
	if (reduce) return <div className={className}>{children}</div>;
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 22 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
		>
			{children}
		</motion.div>
	);
}
