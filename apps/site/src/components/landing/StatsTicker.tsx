"use client";

import {
	motion,
	useInView,
	useMotionValue,
	useTransform,
	animate,
} from "framer-motion";
import { useEffect, useRef } from "react";

type Stats = {
	users: number;
	totalXp: number;
	totalZeni: number;
	achievementsUnlocked: number;
};

const ITEMS: Array<{
	key: keyof Stats;
	label: string;
	suffix?: string;
	tint: string;
	shadow: string;
}> = [
	{
		key: "users",
		label: "Guerriers",
		tint: "text-fuchsia-300",
		shadow: "shadow-fuchsia-500/40",
	},
	{
		key: "totalXp",
		label: "XP cumulé",
		tint: "text-cyan-300",
		shadow: "shadow-cyan-500/40",
	},
	{
		key: "totalZeni",
		label: "Zénis frappés",
		suffix: " z",
		tint: "text-violet-300",
		shadow: "shadow-violet-500/40",
	},
	{
		key: "achievementsUnlocked",
		label: "Succès débloqués",
		tint: "text-pink-300",
		shadow: "shadow-pink-500/40",
	},
];

function Counter({ value, suffix }: { value: number; suffix?: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const motionVal = useMotionValue(0);
	const rounded = useTransform(motionVal, (v) =>
		Math.floor(v).toLocaleString("fr-FR"),
	);
	const inView = useInView(ref, { once: true, amount: 0.3 });
	useEffect(() => {
		if (!inView) return;
		const controls = animate(motionVal, value, {
			duration: 2.4,
			ease: [0.16, 1, 0.3, 1],
		});
		return controls.stop;
	}, [inView, value, motionVal]);
	useEffect(() => {
		const unsub = rounded.on("change", (v) => {
			if (ref.current) ref.current.textContent = String(v);
		});
		return unsub;
	}, [rounded]);
	return <span ref={ref}>0{suffix ?? ""}</span>;
}

export function StatsTicker({ stats }: { stats: Stats }) {
	return (
		<section
			id="stats"
			className="relative py-24 md:py-32 border-b border-dbz-border overflow-hidden"
		>
			<div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />
			<div className="container mx-auto px-4 relative">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<p className="font-scouter text-xs tracking-[0.5em] text-cyan-300 mb-3">
						❯ POWER LEVEL ❮
					</p>
					<h2 className="title-jagged text-4xl md:text-6xl leading-tight">
						Compteur d'énergie cosmique
					</h2>
					<p className="text-white/50 mt-4 max-w-xl mx-auto">
						Données live depuis le bot Discord. Tout est synchronisé en temps
						réel.
					</p>
				</motion.div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
					{ITEMS.map((item, i) => (
						<motion.div
							key={item.key}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className="dbz-panel p-6 text-center relative overflow-hidden group"
						>
							<div
								className={`absolute -inset-1 ${item.shadow} blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
							/>
							<div className="relative">
								<p className="font-scouter text-[10px] tracking-[0.3em] text-white/50 mb-3 uppercase">
									{item.label}
								</p>
								<p
									className={`font-saiyan text-3xl md:text-5xl ${item.tint}`}
									style={{
										textShadow: "0 0 24px currentColor",
									}}
								>
									<Counter value={stats[item.key]} suffix={item.suffix} />
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
