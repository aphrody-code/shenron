"use client";

import { motion } from "framer-motion";

export type PersonaCard = {
	id: string;
	name: string;
	tagline: string;
	role: string;
	hue: string; // tailwind color class suffix (dbz-orange etc)
	avatar: string | null;
};

const FALLBACK_HUES: Record<string, string> = {
	shenron: "dbz-orange",
	beerus: "dbz-orange",
	whis: "dbz-blue-light",
	grandPretre: "indigo-400",
	enma: "rose-400",
	kaio: "amber-400",
};

const TAGLINES: Record<string, { tagline: string; role: string }> = {
	shenron: {
		tagline: "Vœu cosmique exaucé.",
		role: "Le dieu dragon",
	},
	beerus: {
		tagline: "Destruction sélective.",
		role: "Gardien de l'ordre",
	},
	whis: {
		tagline: "Élégance servicielle.",
		role: "Aide et accueil",
	},
	grandPretre: {
		tagline: "Œil omniscient.",
		role: "Sage suprême",
	},
	enma: {
		tagline: "Tribunal des âmes.",
		role: "Juge des sanctions",
	},
	kaio: {
		tagline: "Maître du Power Level.",
		role: "Maître de l'arène",
	},
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
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-4">
						En bonus — notre bot Discord
					</p>
					<h2 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white">
						Six gardiens veillent sur le serveur.
					</h2>
					<p className="text-white/55 mt-5 max-w-2xl mx-auto text-[15px] leading-relaxed">
						Sur Discord, six personnages iconiques de Dragon Ball animent la
						communauté : Shenron, Beerus, Whis, le Grand Prêtre, Enma et Kaïo.
						Modération, accueil, jeux, économie — chacun a sa spécialité.
					</p>
				</motion.div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
					{personas
						.filter((p) => !!p.avatar)
						.map((p, i) => {
							const meta = TAGLINES[p.id] ?? {
								tagline: "Persona inconnue.",
								role: "—",
							};
							const hue = FALLBACK_HUES[p.id] ?? "dbz-orange";
							return (
								<motion.div
									key={p.id}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.2 }}
									transition={{ duration: 0.5, delay: i * 0.08 }}
									className="dbz-panel p-6 group relative overflow-hidden"
								>
									<div
										className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-${hue} opacity-10 blur-3xl group-hover:opacity-30 transition-opacity duration-500`}
									/>
									<div className="relative flex items-start gap-4">
										<div className="relative shrink-0">
											<div
												className={`absolute -inset-1 rounded-full bg-${hue} opacity-30 blur-md group-hover:opacity-70 transition-opacity`}
											/>
											{/* eslint-disable-next-line @next/next/no-img-element */}
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
												{meta.role}
											</p>
											<h3 className="font-saiyan text-2xl text-white leading-none mb-2">
												{p.name}
											</h3>
											<p className="text-sm text-white/60 italic">
												« {meta.tagline} »
											</p>
										</div>
									</div>

									{/* Bottom ki-line accent */}
									<div className="mt-5 pt-4 border-t border-dbz-border/60 flex items-center justify-between">
										<span className="font-scouter text-[9px] tracking-[0.3em] text-white/40">
											EN LIGNE
										</span>
										<span className="led" aria-hidden />
									</div>
								</motion.div>
							);
						})}
				</div>
			</div>
		</section>
	);
}
