"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Feature = {
	title: string;
	desc: string;
	href: string;
	cta: string;
	accent: "fuchsia" | "cyan" | "violet" | "pink";
};

const FEATURES: Feature[] = [
	{
		title: "Mini-jeux Zéni",
		desc: "Pierre-Feuille-Ciseaux, Morpion, Bingo. Tente ta chance et empoche des zénis.",
		href: "/jeux",
		cta: "Jouer",
		accent: "fuchsia",
	},
	{
		title: "Wiki Dragon Ball",
		desc: "58 personnages, 20 planètes, noms japonais et romaji. Toute la saga à portée de main.",
		href: "/wiki",
		cta: "Explorer",
		accent: "cyan",
	},
	{
		title: "Ton profil de guerrier",
		desc: "Niveau, XP, zénis, succès, fusion. Une carte unique à personnaliser.",
		href: "/profil/me",
		cta: "Voir mon profil",
		accent: "violet",
	},
	{
		title: "Boutique cosmétique",
		desc: "Cartes, badges, couleurs, titres, bannières. Tout s'achète en zénis.",
		href: "/shop",
		cta: "Boutique",
		accent: "pink",
	},
	{
		title: "Classement des guerriers",
		desc: "Le top 100 mis à jour en temps réel. Grimpe au sommet du Power Level.",
		href: "/leaderboard",
		cta: "Classement",
		accent: "cyan",
	},
	{
		title: "Actualités",
		desc: "Annonces officielles, événements et nouveautés du serveur.",
		href: "/actualites",
		cta: "Lire le blog",
		accent: "fuchsia",
	},
];

const ACCENT_MAP: Record<
	Feature["accent"],
	{ text: string; border: string; glow: string }
> = {
	fuchsia: {
		text: "text-dbz-yellow",
		border: "border-dbz-orange/40",
		glow: "rgba(217,70,239,0.4)",
	},
	cyan: {
		text: "text-dbz-blue-light",
		border: "border-dbz-blue-light/40",
		glow: "rgba(34,211,238,0.4)",
	},
	violet: {
		text: "text-dbz-yellow",
		border: "border-dbz-orange/40",
		glow: "rgba(139,92,246,0.4)",
	},
	pink: {
		text: "text-pink-300",
		border: "border-pink-500/40",
		glow: "rgba(244,114,182,0.4)",
	},
};

export function FeaturesGrid() {
	return (
		<section className="relative py-24 md:py-32 border-b border-dbz-border">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<p className="font-scouter text-xs tracking-[0.5em] text-dbz-yellow mb-3">
						EXPLORER
					</p>
					<h2 className="title-jagged text-4xl md:text-6xl leading-tight">
						L'univers Dragon Ball, à portée de clic.
					</h2>
				</motion.div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
					{FEATURES.map((f, i) => {
						const a = ACCENT_MAP[f.accent];
						return (
							<motion.div
								key={f.title}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.2 }}
								transition={{ duration: 0.5, delay: i * 0.06 }}
							>
								<Link
									href={f.href}
									className={`dbz-panel p-6 block h-full group hover:!${a.border} transition-all`}
									style={{
										boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
									}}
								>
									<div className="flex items-start justify-end mb-4">
										<span
											className={`font-scouter text-[10px] tracking-[0.3em] ${a.text}`}
											style={{
												filter: `drop-shadow(0 0 12px ${a.glow})`,
											}}
										>
											{String(i + 1).padStart(2, "0")}
										</span>
									</div>
									<h3 className="font-saiyan text-2xl text-white mb-2 leading-tight">
										{f.title}
									</h3>
									<p className="text-sm text-white/60 leading-relaxed mb-5">
										{f.desc}
									</p>
									<div
										className={`text-xs font-semibold ${a.text} group-hover:translate-x-1 transition-transform inline-flex items-center gap-1`}
									>
										{f.cta}
									</div>
								</Link>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
