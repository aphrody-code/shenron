import { SectionHeading } from "./SectionHeading";

const FALLBACK_HUES: Record<string, string> = {
	shenron: "dbz-orange",
	beerus: "dbz-orange",
	whis: "dbz-blue-light",
	grandPretre: "indigo-400",
	enma: "rose-400",
	kaio: "amber-400",
};

const PERSONA_ROLES: Record<string, string> = {
	shenron: "Admin · config · API",
	beerus: "Modération · sanctions",
	whis: "Aide · tickets · wiki",
	grandPretre: "Logs · observation",
	enma: "Tribunal · jail",
	kaio: "Jeux · économie · XP",
};

export function PersonasShowcase({
	personas,
}: {
	personas: Array<{ id: string; name: string; avatar: string | null }>;
}) {
	return (
		<section className="relative py-24 md:py-32 border-b border-dbz-border overflow-hidden">
			<div className="absolute inset-0 pointer-events-none">
				<div
					className="absolute inset-0 opacity-30"
					style={{
						background:
							"radial-gradient(ellipse 60% 60% at 30% 50%, rgba(255,107,26,0.25), transparent), radial-gradient(ellipse 60% 60% at 70% 50%, rgba(255,210,63,0.18), transparent)",
					}}
				/>
			</div>

			<div className="container mx-auto px-4 relative">
				<div className="text-center mb-16">
					<SectionHeading
						eyebrow="En bonus — notre bot Discord"
						title="Six gardiens veillent sur le serveur."
					/>
				</div>

				<div className="reveal-up-stagger grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
					{personas
						.filter((p) => !!p.avatar)
						.map((p, _i) => {
							const role = PERSONA_ROLES[p.id] ?? "";
							const hue = FALLBACK_HUES[p.id] ?? "dbz-orange";
							return (
								<div key={p.id} className="dbz-panel p-6 group relative overflow-hidden">
									<div
										className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-${hue} opacity-10 blur-3xl group-hover:opacity-30 transition-opacity duration-500`}
									/>
									<div className="relative flex items-start gap-4">
										<div className="relative shrink-0">
											<div
												className={`absolute -inset-1 rounded-full bg-${hue} opacity-30 blur-md group-hover:opacity-70 transition-opacity`}
											/>
											{}
											<img
												src={p.avatar!}
												alt={p.name}
												width={64}
												height={64}
												className="relative w-16 h-16 rounded-full border-2 border-dbz-border group-hover:border-dbz-orange/60 transition-colors object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p
												className={`font-scouter text-[10px] tracking-[0.3em] text-${hue} mb-1 uppercase`}
											>
												{role}
											</p>
											<h3 className="font-saiyan text-2xl text-white leading-none">{p.name}</h3>
										</div>
									</div>

									{/* Bottom ki-line accent */}
									<div className="mt-5 pt-4 border-t border-dbz-border/60 flex items-center justify-between">
										<span className="font-scouter text-[9px] tracking-[0.3em] text-white/40">
											EN LIGNE
										</span>
										<span className="led" aria-hidden />
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</section>
	);
}
