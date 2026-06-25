import React from "react";
import Link from "next/link";
import { Sparkles, Users, Award, Shield, MessageSquare, BookOpen } from "lucide-react";
import { DISCORD_INVITE } from "@/lib/config";

export const metadata = {
	title: "À propos — DBFR",
	description: "Découvrez DBFR, le hub communautaire français dédié à l'univers de Dragon Ball. Wiki, bot interactif et communauté active.",
	alternates: { canonical: "/about" },
};

export default function AboutPage() {
	return (
		<div className="mx-auto max-w-[1000px] px-6 lg:px-10 py-16 lg:py-24 space-y-20">
			{/* En-tête */}
			<header className="text-center max-w-3xl mx-auto space-y-6">
				<p className="font-display font-semibold text-[12px] tracking-[0.2em] uppercase text-dbz-orange">
					QUI SOMMES-NOUS ?
				</p>
				<h1 className="text-4xl md:text-6xl font-saiyan tracking-wider text-white">
					L'ALLIANCE DBFR
				</h1>
				<p className="text-lg text-zinc-400 leading-relaxed font-sans">
					DBFR est le plus grand sanctuaire francophone dédié à la légende de Dragon Ball. Unissant une base de connaissances encyclopédique à un écosystème communautaire unique.
				</p>
			</header>

			{/* Les Piliers */}
			<section className="grid gap-6 md:grid-cols-3">
				<div className="dbz-panel p-6 bg-dbz-card/30 border border-white/5 flex flex-col justify-between group hover:border-dbz-orange/30 transition-all duration-300">
					<div className="space-y-4">
						<div className="w-12 h-12 rounded-xl bg-dbz-orange/10 flex items-center justify-center text-dbz-orange">
							<BookOpen className="w-6 h-6" />
						</div>
						<h2 className="text-xl font-display font-bold text-white group-hover:text-dbz-orange transition-colors">
							Archives de Shenron
						</h2>
						<p className="text-sm text-zinc-400 font-sans leading-relaxed">
							Une base de données exhaustive et rigoureuse sur tous les aspects de la saga : personnages, techniques, sagas, films, mangas et jeux vidéo.
						</p>
					</div>
					<Link href="/wiki" className="text-xs font-bold text-dbz-orange uppercase tracking-wider mt-6 inline-flex items-center gap-1">
						Explorer la base →
					</Link>
				</div>

				<div className="dbz-panel p-6 bg-dbz-card/30 border border-white/5 flex flex-col justify-between group hover:border-dbz-orange/30 transition-all duration-300">
					<div className="space-y-4">
						<div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
							<Sparkles className="w-6 h-6" />
						</div>
						<h2 className="text-xl font-display font-bold text-white group-hover:text-purple-400 transition-colors">
							Écosystème Divin
						</h2>
						<p className="text-sm text-zinc-400 font-sans leading-relaxed">
							Six gardiens virtuels (Beerus, Whis, Shenron, etc.) animés par une IA de pointe et connectés en temps réel pour animer et protéger la communauté.
						</p>
					</div>
					<Link href="/personas" className="text-xs font-bold text-purple-400 uppercase tracking-wider mt-6 inline-flex items-center gap-1">
						Consulter les Dieux →
					</Link>
				</div>

				<div className="dbz-panel p-6 bg-dbz-card/30 border border-white/5 flex flex-col justify-between group hover:border-dbz-orange/30 transition-all duration-300">
					<div className="space-y-4">
						<div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
							<Users className="w-6 h-6" />
						</div>
						<h2 className="text-xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
							La Communauté
						</h2>
						<p className="text-sm text-zinc-400 font-sans leading-relaxed">
							Des milliers de combattants échangeant chaque jour sur le Discord, progressant dans les niveaux de puissance, et participant à des quêtes légendaires.
						</p>
					</div>
					<a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan-400 uppercase tracking-wider mt-6 inline-flex items-center gap-1">
						Rejoindre le front →
					</a>
				</div>
			</section>

			{/* Notre Vision */}
			<section className="dbz-panel p-8 md:p-12 bg-dbz-card/20 border border-white/5 backdrop-blur-md relative overflow-hidden">
				<div className="absolute inset-0 halftone opacity-5 pointer-events-none" />
				<div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dbz-orange/20 bg-dbz-orange/10 text-dbz-orange text-xs font-display font-semibold uppercase tracking-wider">
							<Award className="w-3.5 h-3.5" />
							Notre Philosophie
						</div>
						<h2 className="text-3xl font-display font-bold text-white">
							Unir les générations de fans
						</h2>
						<p className="text-sm text-zinc-400 font-sans leading-relaxed">
							Que vous ayez vibré devant le Club Dorothée dans les années 90, découvert le Super Saiyan à l'ère de Dragon Ball Z Kai, ou que vous suiviez avec ferveur les arcs de Dragon Ball Super et Daima, vous faites partie de notre clan.
						</p>
						<p className="text-sm text-zinc-400 font-sans leading-relaxed">
							Nous militons pour un espace d'échange sain, de respect mutuel, et de célébration de l'œuvre d'Akira Toriyama.
						</p>
					</div>
					
					{/* Valeurs / Liste */}
					<div className="space-y-4">
						<div className="flex gap-4 items-start p-4 rounded-xl bg-black/30 border border-white/5">
							<div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
								<Shield className="w-4 h-4" />
							</div>
							<div>
								<h4 className="text-sm font-display font-bold text-white">Rigueur Canonique</h4>
								<p className="text-xs text-zinc-500 font-sans mt-0.5">Toutes nos fiches et informations sont sourcées et validées par les archives officielles.</p>
							</div>
						</div>
						<div className="flex gap-4 items-start p-4 rounded-xl bg-black/30 border border-white/5">
							<div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
								<MessageSquare className="w-4 h-4" />
							</div>
							<div>
								<h4 className="text-sm font-display font-bold text-white">Entraide & Partage</h4>
								<p className="text-xs text-zinc-500 font-sans mt-0.5">Les plus expérimentés guident les nouveaux venus à travers les sagas et techniques.</p>
							</div>
						</div>
						<div className="flex gap-4 items-start p-4 rounded-xl bg-black/30 border border-white/5">
							<div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
								<Award className="w-4 h-4" />
							</div>
							<div>
								<h4 className="text-sm font-display font-bold text-white">Innovation Technologique</h4>
								<p className="text-xs text-zinc-500 font-sans mt-0.5">Intégration d'outils interactifs de pointe comme notre Oracle RAG Hybride.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Appel à l'action */}
			<section className="text-center space-y-6 max-w-xl mx-auto py-8">
				<h3 className="text-2xl font-display font-bold text-white">Prêt à entamer votre voyage ?</h3>
				<p className="text-sm text-zinc-400 font-sans leading-relaxed">
					Rejoignez notre armée de guerriers sur Discord ou plongez directement dans l'exploration de notre vaste univers.
				</p>
				<div className="flex justify-center gap-4">
					<a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-xl bg-dbz-orange hover:bg-white text-black font-display font-bold text-xs tracking-wider uppercase transition-all hover:scale-105 active:scale-98 shadow-lg shadow-dbz-orange/20">
						Rejoindre le Discord
					</a>
					<Link href="/wiki" className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-white font-display font-bold text-xs tracking-wider uppercase transition-all hover:scale-105 active:scale-98 bg-white/5">
						Visiter le Codex
					</Link>
				</div>
			</section>
		</div>
	);
}
