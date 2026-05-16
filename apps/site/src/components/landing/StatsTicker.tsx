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
}> = [
	{ key: "users", label: "Guerriers", tint: "text-dbz-orange" },
	{ key: "totalXp", label: "XP cumulé", tint: "text-white" },
	{
		key: "totalZeni",
		label: "Zénis frappés",
		suffix: " z",
		tint: "text-dbz-orange",
	},
	{
		key: "achievementsUnlocked",
		label: "Succès débloqués",
		tint: "text-white",
	},
];

export function StatsTicker({ stats }: { stats: Stats }) {
	return (
		<section
			id="stats"
			className="relative py-24 md:py-32 border-b border-white/[0.06] overflow-hidden"
		>
			<div className="absolute inset-0 hud-grid opacity-15 pointer-events-none" />
			<div className="mx-auto max-w-[1280px] px-6 lg:px-10 relative">
				<div className="text-center mb-16">
					<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-4">
						Power Level
					</p>
					<h2 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white">
						Compteur d'énergie de la communauté
					</h2>
					<p className="text-white/55 mt-5 max-w-xl mx-auto text-[15px]">
						Données live depuis le bot Discord, synchronisées en temps réel.
					</p>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
					{ITEMS.map((item) => (
						<div
							key={item.key}
							className="p-6 text-center rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:border-dbz-orange/40 transition-colors"
						>
							<p className="font-display font-semibold text-[10px] tracking-[0.18em] text-white/50 mb-3 uppercase">
								{item.label}
							</p>
							<p
								className={`font-display font-bold text-3xl md:text-5xl ${item.tint} tabular-nums`}
							>
								{stats[item.key].toLocaleString("fr-FR")}
								{item.suffix ?? ""}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
