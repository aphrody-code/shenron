import Link from "next/link";

type Pillar = {
	title: string;
	desc: string;
	href: string;
	count?: string;
	accent: "gold" | "red" | "white";
};

const PILLARS: Pillar[] = [
	{
		title: "Personnages",
		desc: "Goku, Vegeta, Freezer, Cell, Buu, Beerus, Jiren — découvre l'arbre complet des guerriers de Dragon Ball.",
		href: "/wiki/dragon-ball",
		count: "58 fiches",
		accent: "gold",
	},
	{
		title: "Planètes & Univers",
		desc: "Terre, Namek, Vegeta, Yardrat, le Monde du Vide — explore chaque lieu de la saga.",
		href: "/wiki",
		count: "20 mondes",
		accent: "white",
	},
	{
		title: "Sagas & arcs",
		desc: "Pilaf, Saiyans, Freezer, Cell, Buu, God, Tournoi du Pouvoir, Super Hero — chaque saga décortiquée.",
		href: "/wiki",
		count: "Anime & Manga",
		accent: "red",
	},
	{
		title: "Actualités Dragon Ball",
		desc: "Sorties anime, manga Super, films, jeux vidéo, événements communauté — tout ce qui bouge dans l'univers DB.",
		href: "/actualites",
		count: "Mises à jour régulières",
		accent: "gold",
	},
	{
		title: "Lexique japonais",
		desc: "Noms en 日本語, romaji canon, attaques (Kamehameha, Genkidama, Galick Gun) — la version originale.",
		href: "/wiki/dragon-ball",
		count: "Termes traduits",
		accent: "white",
	},
	{
		title: "Communauté",
		desc: "Discute avec d'autres fans français, partage tes théories, participe aux events DB et tournois.",
		href: "https://discord.gg/dbfr",
		count: "Discord actif",
		accent: "red",
	},
];

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

export function UniverseGrid() {
	return (
		<section className="relative py-24 md:py-32 border-b border-white/[0.06]">
			<div className="mx-auto max-w-[1280px] px-6 lg:px-10">
				<div
					className="max-w-3xl mb-16"
				>
					<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-4">
						L'univers Dragon Ball
					</p>
					<h2 className="reveal-up font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white">
						Tout Dragon Ball.
						<br />
						<span className="text-white/55">
							En français, à jour, sans détour.
						</span>
					</h2>
				</div>

				<div className="reveal-up-stagger grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06] rounded-2xl overflow-hidden">
					{PILLARS.map((p, _i) => (
						<div
							key={p.title}
						>
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
