"use client";

import { Building2, ExternalLink, Globe, ShieldCheck } from "lucide-react";

export function MangaInfoSection() {
	return (
		<section className="mt-20 lg:mt-32 space-y-16">
			{/* En-tête de section style Scouter */}
			<div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
				<div className="space-y-2">
					<span className="scouter-text text-sm text-dbz-orange block tracking-[0.2em] font-mono">
						WIKI_DB_MANGA_GUIDE // INTEL
					</span>
					<h2 className="font-saiyan text-4xl lg:text-5xl text-white tracking-widest leading-none">
						Éditeurs & Sources de Lecture
					</h2>
				</div>
				<p className="text-white/50 font-display text-sm max-w-md">
					Retrouvez l&apos;ensemble des éditeurs officiels ainsi que les meilleures plateformes pour
					suivre l&apos;œuvre originale d&apos;Akira Toriyama et de Toyotarou.
				</p>
			</div>

			{/* Grille principale 3 colonnes */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* 1. Éditeurs Officiels */}
				<div className="dbz-panel p-6 border border-white/5 bg-dbz-card relative overflow-hidden group hover:border-dbz-orange/40 hover:shadow-[0_0_20px_rgba(255,178,0,0.05)] transition-all duration-300">
					<div className="absolute inset-0 halftone opacity-10 pointer-events-none" />

					<div className="relative z-10 space-y-6">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-dbz-orange/10 rounded-lg text-dbz-orange border border-dbz-orange/20">
								<Building2 className="w-6 h-6" />
							</div>
							<h3 className="font-display font-extrabold text-lg text-white uppercase tracking-wider">
								Éditeurs Officiels
							</h3>
						</div>

						<p className="text-xs text-white/40 leading-relaxed font-display">
							Les maisons d&apos;édition détentrices des droits de publication et responsables de
							l&apos;impression des tomes physiques.
						</p>

						<div className="space-y-4 pt-2">
							{/* Glénat */}
							<div className="border border-white/5 bg-black/30 p-4 rounded-lg space-y-2 group/item hover:border-white/10 transition-colors">
								<div className="flex items-center justify-between">
									<h4 className="font-display font-bold text-sm text-white group-hover/item:text-dbz-orange transition-colors">
										Glénat Manga (FR)
									</h4>
									<span className="text-[9px] px-2 py-0.5 bg-dbz-orange/20 text-dbz-orange border border-dbz-orange/30 rounded font-mono font-bold uppercase tracking-wider">
										Officiel FR
									</span>
								</div>
								<p className="text-xs text-white/60 font-display leading-relaxed">
									Éditeur historique français depuis 1993. Publie l&apos;édition originale en 42
									volumes, la Perfect Edition (Kanzenban), la version Full Color ainsi que Dragon
									Ball Super.
								</p>
								<a
									href="https://www.glenat.com/manga"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-[10px] text-dbz-orange hover:text-white transition-colors font-mono font-bold uppercase tracking-wider pt-1"
								>
									Visiter le site <ExternalLink className="w-3 h-3" />
								</a>
							</div>

							{/* Shueisha */}
							<div className="border border-white/5 bg-black/30 p-4 rounded-lg space-y-2 group/item hover:border-white/10 transition-colors">
								<div className="flex items-center justify-between">
									<h4 className="font-display font-bold text-sm text-white group-hover/item:text-dbz-orange transition-colors">
										Shueisha (JP)
									</h4>
									<span className="text-[9px] px-2 py-0.5 bg-white/10 text-white/80 border border-white/20 rounded font-mono font-bold uppercase tracking-wider">
										Original JP
									</span>
								</div>
								<p className="text-xs text-white/60 font-display leading-relaxed">
									L&apos;éditeur japonais original de l&apos;œuvre d&apos;Akira Toriyama dans le
									légendaire magazine Weekly Shōnen Jump et de Toyotarou dans le V Jump.
								</p>
								<a
									href="https://www.shueisha.co.jp"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-[10px] text-dbz-orange hover:text-white transition-colors font-mono font-bold uppercase tracking-wider pt-1"
								>
									Visiter le site <ExternalLink className="w-3 h-3" />
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* 2. Lecture Officielle & Légale */}
				<div className="dbz-panel p-6 border border-white/5 bg-dbz-card relative overflow-hidden group hover:border-dbz-orange/40 hover:shadow-[0_0_20px_rgba(255,178,0,0.05)] transition-all duration-300">
					<div className="absolute inset-0 halftone opacity-10 pointer-events-none" />

					<div className="relative z-10 space-y-6">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-dbz-orange/10 rounded-lg text-dbz-orange border border-dbz-orange/20">
								<ShieldCheck className="w-6 h-6" />
							</div>
							<h3 className="font-display font-extrabold text-lg text-white uppercase tracking-wider">
								Lecture Officielle
							</h3>
						</div>

						<p className="text-xs text-white/40 leading-relaxed font-display">
							Les plateformes d&apos;origine ou sous licence officielle pour lire les tomes et
							chapitres au format numérique.
						</p>

						<div className="space-y-4 pt-2">
							{/* Manga Plus */}
							<div className="border border-white/5 bg-black/30 p-4 rounded-lg space-y-2 group/item hover:border-white/10 transition-colors">
								<div className="flex items-center justify-between">
									<h4 className="font-display font-bold text-sm text-white group-hover/item:text-dbz-orange transition-colors">
										MANGA Plus
									</h4>
									<span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono font-bold uppercase tracking-wider">
										Gratuit & Légal
									</span>
								</div>
								<p className="text-xs text-white/60 font-display leading-relaxed">
									L&apos;application officielle mondiale de la Shueisha. Permet de lire gratuitement
									en ligne les derniers chapitres de Dragon Ball Super en simultané avec la
									publication japonaise.
								</p>
								<a
									href="https://mangaplus.shueisha.co.jp"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-[10px] text-dbz-orange hover:text-white transition-colors font-mono font-bold uppercase tracking-wider pt-1"
								>
									Accéder à Manga Plus <ExternalLink className="w-3 h-3" />
								</a>
							</div>

							{/* Izneo / Glénat Numérique */}
							<div className="border border-white/5 bg-black/30 p-4 rounded-lg space-y-2 group/item hover:border-white/10 transition-colors">
								<div className="flex items-center justify-between">
									<h4 className="font-display font-bold text-sm text-white group-hover/item:text-dbz-orange transition-colors">
										Izneo & Glénat
									</h4>
									<span className="text-[9px] px-2 py-0.5 bg-dbz-orange/20 text-dbz-orange border border-dbz-orange/30 rounded font-mono font-bold uppercase tracking-wider">
										Tomes FR
									</span>
								</div>
								<p className="text-xs text-white/60 font-display leading-relaxed">
									Achetez et lisez l&apos;intégrale des volumes officiels de Dragon Ball, Dragon
									Ball Super et spinoffs au format ePub/numérique de haute qualité en français.
								</p>
								<a
									href="https://www.izneo.com"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-[10px] text-dbz-orange hover:text-white transition-colors font-mono font-bold uppercase tracking-wider pt-1"
								>
									Visiter Izneo <ExternalLink className="w-3 h-3" />
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* 3. Scans & Communauté */}
				<div className="dbz-panel p-6 border border-white/5 bg-dbz-card relative overflow-hidden group hover:border-dbz-orange/40 hover:shadow-[0_0_20px_rgba(255,178,0,0.05)] transition-all duration-300">
					<div className="absolute inset-0 halftone opacity-10 pointer-events-none" />

					<div className="relative z-10 space-y-6">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-dbz-orange/10 rounded-lg text-dbz-orange border border-dbz-orange/20">
								<Globe className="w-6 h-6" />
							</div>
							<h3 className="font-display font-extrabold text-lg text-white uppercase tracking-wider">
								Projets Communautaires
							</h3>
						</div>

						<p className="text-xs text-white/40 leading-relaxed font-display">
							Les projets communautaires et fan-mangas d&apos;exception, portés par leurs propres
							auteurs et diffusés avec leur accord.
						</p>

						<div className="space-y-4 pt-2">
							{/* Dragon Ball Multiverse */}
							<div className="border border-white/5 bg-black/30 p-4 rounded-lg space-y-2 group/item hover:border-white/10 transition-colors">
								<div className="flex items-center justify-between">
									<h4 className="font-display font-bold text-sm text-white group-hover/item:text-dbz-orange transition-colors">
										DB Multiverse (DBM)
									</h4>
									<span className="text-[9px] px-2 py-0.5 bg-dbz-orange/20 text-dbz-orange border border-dbz-orange/30 rounded font-mono font-bold uppercase tracking-wider">
										Fan-Manga
									</span>
								</div>
								<p className="text-xs text-white/60 font-display leading-relaxed">
									Le fan-manga de référence absolue mondial par Salagir et Gogeta Jr, proposant une
									suite alternative de type tournoi gigantesque entre divers univers. Traduit en
									plus de 30 langues.
								</p>
								<a
									href="https://www.dragonball-multiverse.com"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-[10px] text-dbz-orange hover:text-white transition-colors font-mono font-bold uppercase tracking-wider pt-1"
								>
									Lire DBM <ExternalLink className="w-3 h-3" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
