"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";

const KiCanvas = dynamic(() => import("./KiCanvas").then((m) => m.KiCanvas), {
	ssr: false,
});

export function DbzHero({
	kicker,
	title,
	subtitle,
}: {
	kicker?: string;
	title: string;
	subtitle?: string;
}) {
	// Respect de prefers-reduced-motion : `initial={false}` fait rendre motion
	// directement à l'état final (aucune animation d'entrée).
	const reduce = useReducedMotion();
	return (
		<section className="relative w-full overflow-hidden border-y-4 border-black bg-dbz-bg">
			{/* Sunburst CSS statique fond */}
			<div className="absolute inset-0 sunburst opacity-30 spin-slow [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />

			{/* WebGPU ki canvas */}
			<KiCanvas className="absolute inset-0 w-full h-full" />

			{/* Speed lines overlay */}
			<div className="absolute inset-0 speed-lines opacity-50" />

			{/* Halftone manga */}
			<div className="absolute inset-0 halftone opacity-50 mix-blend-multiply" />

			{/* Content */}
			<div className="relative container mx-auto px-4 py-20 md:py-32 text-center">
				{kicker && (
					<motion.p
						initial={reduce ? false : { opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="font-scouter text-xs md:text-sm tracking-[0.5em] text-dbz-orange mb-4 ki-pulse"
					>
						{kicker}
					</motion.p>
				)}
				<motion.h1
					initial={reduce ? false : { opacity: 0, scale: 0.85, rotate: -2 }}
					animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
					transition={{ duration: 0.7, type: "spring", bounce: 0.35 }}
					className="title-jagged inline-block text-5xl md:text-8xl uppercase leading-[0.95]"
				>
					{title}
				</motion.h1>
				{subtitle && (
					<motion.p
						initial={reduce ? false : { opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="mt-6 font-saiyan tracking-[0.3em] text-dbz-blue-light text-sm md:text-base uppercase"
					>
						{subtitle}
					</motion.p>
				)}
			</div>

			{/* Bottom ink edge */}
			<svg
				className="absolute bottom-0 left-0 w-full h-6 text-dbz-bg"
				viewBox="0 0 1200 24"
				preserveAspectRatio="none"
				aria-hidden
			>
				<path
					d="M0,24 L0,8 L60,18 L140,6 L240,16 L340,4 L460,18 L580,8 L700,20 L820,6 L940,16 L1060,4 L1200,18 L1200,24 Z"
					fill="currentColor"
				/>
			</svg>
		</section>
	);
}
