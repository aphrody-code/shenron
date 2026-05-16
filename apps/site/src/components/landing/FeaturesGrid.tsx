"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Feature = {
	icon: string;
	title: string;
	desc: string;
	href: string;
	cta: string;
	accent: "fuchsia" | "cyan" | "violet" | "pink";
};

const FEATURES: Feature[] = [
	{
		icon: "⚔",
		title: "Mini-jeux Zéni",
		desc: "PFC, Morpion, Bingo. Mêmes règles que Discord, même solde Zéni. Jouables sans ouvrir l'app.",
		href: "/jeux",
		cta: "Combattre l'IA",
		accent: "fuchsia",
	},
	{
		icon: "📖",
		title: "Wiki Dragon Ball",
		desc: "58 personnages, 20 planètes, noms 日本語 + romaji canon. Catégories paramétrables.",
		href: "/wiki",
		cta: "Explorer",
		accent: "cyan",
	},
	{
		icon: "👤",
		title: "Profil unifié",
		desc: "Ton level, XP et zénis Discord directement sur le web. Carte personnalisable.",
		href: "/profil/me",
		cta: "Voir mon profil",
		accent: "violet",
	},
	{
		icon: "💎",
		title: "Boutique cosmétique",
		desc: "Cartes, badges, couleurs, titres, bannières. Tout achetable en zénis.",
		href: "/shop",
		cta: "Boutique",
		accent: "pink",
	},
	{
		icon: "📡",
		title: "Commandes du bot",
		desc: "Catalogue complet des slash-commands. Help, succès, fusion, level, modération.",
		href: "/commands",
		cta: "Voir les commandes",
		accent: "fuchsia",
	},
	{
		icon: "🏆",
		title: "Classement live",
		desc: "Le top 100 des guerriers, mis à jour en temps réel via la même DB que le bot.",
		href: "/leaderboard",
		cta: "Classement",
		accent: "cyan",
	},
];

const ACCENT_MAP: Record<
	Feature["accent"],
	{ text: string; border: string; glow: string }
> = {
	fuchsia: {
		text: "text-fuchsia-300",
		border: "border-fuchsia-500/40",
		glow: "rgba(217,70,239,0.4)",
	},
	cyan: {
		text: "text-cyan-300",
		border: "border-cyan-500/40",
		glow: "rgba(34,211,238,0.4)",
	},
	violet: {
		text: "text-violet-300",
		border: "border-violet-500/40",
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
					<p className="font-scouter text-xs tracking-[0.5em] text-violet-300 mb-3">
						// MODULES //
					</p>
					<h2 className="title-jagged text-4xl md:text-6xl leading-tight">
						Tout le bot, depuis le navigateur.
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
									<div className="flex items-start justify-between mb-4">
										<span
											className="text-4xl"
											style={{
												filter: `drop-shadow(0 0 16px ${a.glow})`,
											}}
										>
											{f.icon}
										</span>
										<span
											className={`font-scouter text-[10px] tracking-[0.3em] ${a.text}`}
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
										{f.cta} <span>→</span>
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
