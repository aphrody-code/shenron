import Link from "next/link";

export const dynamic = "force-dynamic";

const SECTIONS = [
	{
		title: "Encyclopédie",
		desc: "Personnages, planètes et lore canonique.",
		href: "/wiki/dragon-ball",
		color: "border-dbz-orange text-dbz-orange",
		icon: "🐉",
	},
	{
		title: "Races",
		desc: "Saiyans, Nameks, Cyborgs et plus.",
		href: "/wiki/races",
		color: "border-dbz-blue-light text-dbz-blue-light",
		icon: "🧬",
	},
	{
		title: "Techniques",
		desc: "Kamehameha, Genkidama et attaques cultes.",
		href: "/wiki/dragon-ball/techniques",
		color: "border-dbz-red text-dbz-red",
		icon: "💥",
	},
	{
		title: "Manga",
		desc: "Volumes et chapitres (DB & Super).",
		href: "/wiki/manga",
		color: "border-white text-white",
		icon: "📖",
	},
	{
		title: "Actualités",
		desc: "Dernières news de l'univers Dragon Ball.",
		href: "/wiki/news",
		color: "border-dbz-yellow text-dbz-yellow",
		icon: "📰",
	},
	{
		title: "Recherche",
		desc: "Système de détection Scouter global.",
		href: "/wiki/search",
		color: "border-green-500 text-green-500",
		icon: "🔍",
	},
];

export default function WikiIndex() {
	return (
		<div className="reveal-up">
			<header className="mb-16">
				<h1 className="text-5xl md:text-7xl font-saiyan text-white mb-6 tracking-widest">
					ARCHIVES SHENRON
				</h1>
				<p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
					Bienvenue dans la base de données la plus complète sur l'univers de Dragon Ball. 
					Sélectionnez une section pour commencer votre exploration.
				</p>
			</header>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{SECTIONS.map((s, idx) => (
					<Link
						key={s.title}
						href={s.href}
						className={`dbz-panel p-8 border-l-4 ${s.color} hover:bg-white/5 transition-all group reveal-up`}
						style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
					>
						<div className="text-4xl mb-4">{s.icon}</div>
						<h2 className="text-2xl font-saiyan uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform">
							{s.title}
						</h2>
						<p className="text-gray-400 text-sm font-sans">
							{s.desc}
						</p>
					</Link>
				))}
			</div>

			<section className="mt-20 dbz-panel p-10 bg-dbz-card/30 border-t-4 border-t-dbz-orange relative overflow-hidden">
				<div className="absolute inset-0 halftone opacity-5 pointer-events-none" />
				<div className="relative z-10">
					<h2 className="font-saiyan text-3xl text-white mb-4 tracking-widest">CONTRIBUTION</h2>
					<p className="text-gray-300 max-w-3xl mb-8">
						Ces archives sont alimentées par les données de l'API Shenron et enrichies par la communauté. 
						Si vous repérez une erreur ou souhaitez ajouter du contenu, contactez l'équipe sur Discord.
					</p>
					<Link href="/about" className="dbz-button-ghost">
						EN SAVOIR PLUS
					</Link>
				</div>
			</section>
		</div>
	);
}


