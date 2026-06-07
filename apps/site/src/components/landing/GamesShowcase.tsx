import Link from "next/link";
import DragonBall2048 from "@/app/jeux/2048/DragonBall2048";

/**
 * Vitrine des vrais mini-jeux jouables sur le site (pas du texte marketing).
 * Le 2048 (client-only, sans auth) est embarqué jouable directement ici ;
 * les autres jeux renvoient vers leur page dédiée.
 */
type GameCard = {
	name: string;
	emoji: string;
	mode: string;
	desc: string;
	href: string | null;
	accent: string;
};

const GAMES: GameCard[] = [
	{
		name: "Pierre-Feuille-Ciseaux",
		emoji: "✊",
		mode: "Solo vs IA · défi joueur",
		desc: "Mise tes zénis, affronte le bot ou un membre. Victoire = +100 ¥.",
		href: "/jeux/pfc",
		accent: "text-purple-300 border-purple-400/50",
	},
	{
		name: "Morpion",
		emoji: "⭕",
		mode: "vs IA défensive · vs joueur",
		desc: "Tic-tac-toe 3×3, IA qui gagne ou bloque. Ligne gagnante surlignée.",
		href: "/jeux/morpion",
		accent: "text-cyan-300 border-cyan-400/50",
	},
	{
		name: "Bingo",
		emoji: "🎯",
		mode: "vs IA",
		desc: "Devine le nombre 1→100 en 10 essais. Indices plus haut / plus bas.",
		href: "/jeux/bingo",
		accent: "text-dbz-orange border-dbz-orange/50",
	},
	{
		name: "Pendu",
		emoji: "🪢",
		mode: "Discord · /pendu",
		desc: "Devine le mot caché en 7 essais sur le serveur Discord.",
		href: null,
		accent: "text-dbz-yellow border-dbz-yellow/50",
	},
];

export function GamesShowcase() {
	return (
		<section className="relative py-24 md:py-32 border-b border-dbz-border overflow-hidden">
			<div className="absolute inset-0 hud-grid opacity-10 pointer-events-none" />
			<div className="container mx-auto px-4 relative">
				<div className="text-center mb-14">
					<p className="font-scouter text-xs tracking-[0.5em] text-dbz-yellow mb-3">ARÈNE</p>
					<h2 className="font-display font-bold text-4xl md:text-6xl leading-tight text-white">
						Mini-jeux jouables, zénis à la clé.
					</h2>
					<p className="text-white/55 mt-5 max-w-2xl mx-auto text-[15px]">
						Joue directement ici ou sur Discord. Victoire{" "}
						<span className="text-green-400 font-semibold">+100&nbsp;¥</span> · défaite{" "}
						<span className="text-red-400 font-semibold">−50&nbsp;¥</span> · chaque partie compte
						pour ton classement.
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto items-start">
					{/* 2048 jouable en live, sans connexion */}
					<div className="dbz-panel p-5">
						<div className="flex items-baseline justify-between mb-4">
							<h3 className="font-saiyan text-2xl text-dbz-orange uppercase">
								DBZ 2048 · Ki Merge
							</h3>
							<Link
								href="/jeux/2048"
								className="font-scouter text-[10px] tracking-widest text-dbz-blue-light hover:text-dbz-orange transition-colors"
							>
								PLEIN ÉCRAN →
							</Link>
						</div>
						<p className="text-xs text-white/55 mb-4">
							Fusionne Saibaiman → Whis. Jouable tout de suite, aucune connexion requise.
						</p>
						<DragonBall2048 />
					</div>

					{/* Les autres jeux */}
					<div className="grid sm:grid-cols-2 gap-4 content-start">
						{GAMES.map((g) => {
							const inner = (
								<>
									<div className="flex items-center gap-3 mb-2">
										<span className="text-3xl" aria-hidden>
											{g.emoji}
										</span>
										<h3 className="font-saiyan text-xl text-white uppercase leading-tight">
											{g.name}
										</h3>
									</div>
									<div className="text-[10px] uppercase tracking-widest text-dbz-blue-light mb-2">
										{g.mode}
									</div>
									<p className="text-sm text-white/60 leading-relaxed flex-1">{g.desc}</p>
									<span
										className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${g.href ? "text-dbz-orange" : "text-dbz-blue-light/70"}`}
									>
										{g.href ? "JOUER →" : "Sur Discord"}
									</span>
								</>
							);
							return g.href ? (
								<Link
									key={g.name}
									href={g.href}
									className={`dbz-panel p-5 flex flex-col border-l-4 ${g.accent} hover:border-dbz-orange transition-colors group`}
								>
									{inner}
								</Link>
							) : (
								<div key={g.name} className={`dbz-panel p-5 flex flex-col border-l-4 ${g.accent}`}>
									{inner}
								</div>
							);
						})}
					</div>
				</div>

				<div className="text-center mt-12">
					<Link href="/jeux" className="dbz-button !text-sm">
						Tous les jeux & règles
					</Link>
				</div>
			</div>
		</section>
	);
}
