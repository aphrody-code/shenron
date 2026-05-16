const GAMES = [
	{
		name: "Pendu",
		cmd: "/pendu",
		variant: "solo / joueur",
		desc: "Devine le mot caché, 7 essais. Embed avec lettres trouvées/ratées triées, ASCII frame du pendu, victoire = +100 ¥.",
		palette: "text-dbz-yellow border-dbz-yellow",
		play: null,
	},
	{
		name: "Morpion",
		cmd: "/morpion",
		variant: "vs IA / vs joueur",
		desc: "Tic-tac-toe 3×3. IA défensive (gagner > bloquer > centre > coin > random). Ligne gagnante surlignée en vert.",
		palette: "text-cyan-400 border-cyan-400",
		play: "/jeux/morpion" as string | null,
	},
	{
		name: "PFC",
		cmd: "/pfc",
		variant: "solo / joueur",
		desc: "Pierre Feuille Ciseaux. Adversaire IA random ou défi entre membres avec boutons Accepter/Refuser timeout 60s.",
		palette: "text-purple-400 border-purple-400",
		play: "/jeux/pfc" as string | null,
	},
	{
		name: "Bingo",
		cmd: "/bingo",
		variant: "vs IA",
		desc: "Devine un nombre entre 1 et 100. 10 essais max. Le bot indique plus haut / plus bas après chaque tentative.",
		palette: "text-dbz-orange border-dbz-orange",
		play: "/jeux/bingo" as string | null,
	},
];

export default function JeuxPage() {
	return (
		<div className="container mx-auto px-4 py-12 max-w-5xl">
			<header className="text-center mb-10">
				<h1
					className="text-5xl md:text-7xl text-dbz-yellow mb-4"
					style={{ textShadow: "4px 4px 0px rgba(168, 85, 247, 0.6), 0 0 24px rgba(56, 189, 248, 0.3)" }}
				>
					JEUX
				</h1>
				<p className="text-dbz-blue-light font-bold tracking-widest uppercase">
					4 mini-jeux solo ou multijoueur, gagne du Zéni en jouant
				</p>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{GAMES.map((g) => (
					<article
						key={g.name}
						className={`dbz-panel p-6 flex flex-col border-l-4 ${g.palette} hover:border-dbz-orange transition-colors`}
					>
						<div className="flex items-baseline justify-between mb-3">
							<h2 className={`text-3xl font-saiyan uppercase ${g.palette}`}>
								{g.name}
							</h2>
							<code className="text-dbz-orange font-mono">{g.cmd}</code>
						</div>
						<div className="text-[10px] uppercase tracking-widest text-dbz-blue-light mb-3">
							Mode : {g.variant}
						</div>
						<p className="text-sm text-gray-300 leading-relaxed flex-1">
							{g.desc}
						</p>
						{g.play ? (
							<a href={g.play} className="dbz-button mt-4 self-start !text-sm">
								JOUER
							</a>
						) : (
							<span className="mt-4 self-start font-scouter text-[10px] tracking-widest text-dbz-blue-light/60">
								Discord-only · UI site bientôt
							</span>
						)}
					</article>
				))}
			</div>

			<section className="mt-10 dbz-panel p-6 text-center">
				<p className="font-saiyan text-2xl text-dbz-orange uppercase mb-2">
					Récompenses
				</p>
				<p className="text-sm text-gray-300">
					Victoire : <span className="text-dbz-yellow font-bold">+100 ¥</span> ·
					Défaite : <span className="text-red-400 font-bold">−50 ¥</span>
				</p>
			</section>
		</div>
	);
}
