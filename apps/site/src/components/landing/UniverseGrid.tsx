import Link from "next/link";
import { DISCORD_INVITE } from "@/lib/config";
import { SectionHeading } from "./SectionHeading";

type Pillar = {
	title: string;
	desc: string;
	href: string;
	count?: string;
	accent: "gold" | "red" | "white";
};

interface UniverseGridProps {
	wikiCounts: {
		sagas: number;
		episodes: number;
		movies: number;
		characters: number;
		planets: number;
		chapters: number;
	};
}

const ACCENT_BORDER: Record<Pillar["accent"], string> = {
	gold: "hover:border-dbz-orange/70 hover:shadow-[0_0_0_1px_var(--color-dbz-orange)]",
	red: "hover:border-dbz-red/70 hover:shadow-[0_0_0_1px_var(--color-dbz-red)]",
	white: "hover:border-white/70 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.9)]",
};

const ACCENT_TEXT: Record<Pillar["accent"], string> = {
	gold: "text-dbz-orange",
	red: "text-dbz-red",
	white: "text-white",
};

export function UniverseGrid({ wikiCounts }: UniverseGridProps) {
	const pillars: Pillar[] = [
		{
			title: "Personnages",
			desc: "Goku, Vegeta, Freezer, Cell, Buu, Beerus, Jiren.",
			href: "/wiki/personnages?tab=personnages",
			count: wikiCounts.characters > 0 ? `${wikiCounts.characters} fiches personnages` : "Fiches personnages",
			accent: "gold",
		},
		{
			title: "Planètes & Univers",
			desc: "Terre, Namek, Vegeta, Yardrat, le Monde du Vide.",
			href: "/wiki/personnages?tab=planetes",
			count: wikiCounts.planets > 0 ? `${wikiCounts.planets} planètes & mondes` : "Planètes & mondes",
			accent: "white",
		},
		{
			title: "Sagas, Arcs & Épisodes",
			desc: `Suivez les aventures à travers ${wikiCounts.sagas || 12} sagas et ${wikiCounts.episodes || 131} épisodes avec lecteurs et téléchargements.`,
			href: "/wiki/episodes",
			count: wikiCounts.episodes > 0 ? `${wikiCounts.episodes} épisodes répertoriés` : "Anime & Manga",
			accent: "red",
		},
		{
			title: "Films & OAVs",
			desc: "Tous les films de Dragon Ball, Z, GT, Super en streaming et téléchargement direct.",
			href: "/wiki/films",
			count: wikiCounts.movies > 0 ? `${wikiCounts.movies} films de légende` : "Mises à jour",
			accent: "gold",
		},
		{
			title: "Manga & Scan Reader",
			desc: "Lisez les chapitres de Dragon Ball Super en ligne grâce à notre pipeline de scraping natif.",
			href: "/wiki/manga",
			count: wikiCounts.chapters > 0 ? `${wikiCounts.chapters} chapitres DBS disponibles` : "Termes traduits",
			accent: "white",
		},
		{
			title: "Communauté & Bot",
			desc: "Rejoignez le serveur Discord DBFR avec notre bot interactif à 6 personas.",
			href: DISCORD_INVITE,
			count: "6 Personas en ligne",
			accent: "red",
		},
	];

	return (
		<section className="relative py-24 md:py-32 border-b border-white/[0.06]">
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10">
				<div className="max-w-3xl mb-16">
					<SectionHeading
						eyebrow="L'univers Dragon Ball"
						title={
							<>
								Tout Dragon Ball.
								<br />
								<span className="text-white/55">
									En français, à jour, sans détour.
								</span>
							</>
						}
					/>
				</div>

				<div className="reveal-up-stagger grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06] rounded-2xl overflow-hidden">
					{pillars.map((p, _i) => (
						<div key={p.title}>
							<Link
								href={p.href}
								className={`block bg-[#0a0a0a] p-8 h-full transition-all duration-300 border border-transparent ${ACCENT_BORDER[p.accent]} group`}
							>
								{p.count && (
									<p
										className={`font-display font-semibold text-[11px] tracking-[0.18em] uppercase ${ACCENT_TEXT[p.accent]} mb-5`}
									>
										{p.count}
									</p>
								)}
								<h3 className="font-display font-bold text-[24px] tracking-tight text-white mb-3 group-hover:translate-x-1 transition-transform">
									{p.title}
								</h3>
								<p className="text-[15px] leading-relaxed text-white/65">
									{p.desc}
								</p>
								<span
									className={`mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium ${ACCENT_TEXT[p.accent]} opacity-0 group-hover:opacity-100 transition-opacity`}
								>
									Découvrir
									<span aria-hidden>→</span>
								</span>
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
