import Link from "next/link";

const COLUMNS = [
	{
		title: "Explorer",
		links: [
			{ href: "/wiki/personnages", label: "Wiki personnages" },
			{ href: "/wiki", label: "Planètes & sagas" },
			{ href: "/actualites", label: "Actualités" },
			{ href: "/leaderboard", label: "Classement" },
		],
	},
	{
		title: "Communauté",
		links: [
			{ href: "https://discord.gg/dbfr", label: "Rejoindre le Discord" },
			{ href: "/personas", label: "Le bot du serveur" },
			{ href: "/shop", label: "Boutique zénis" },
			{ href: "/jeux", label: "Mini-jeux" },
		],
	},
	{
		title: "Légal",
		links: [
			{ href: "/credits", label: "Crédits & sources" },
			{ href: "/licence", label: "Licence & usage" },
			{ href: "/credits#contact", label: "Signaler un contenu" },
		],
	},
];

export function SiteFooter() {
	return (
		<footer className="relative mt-auto bg-[#070707] border-t border-white/[0.06]">
			<div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-16 grid gap-10 lg:grid-cols-[1.4fr_3fr]">
				<div>
					<Link
						href="/"
						className="flex items-baseline select-none mb-5"
						aria-label="DBFR"
					>
						<span className="font-display font-bold text-[28px] tracking-[0.06em] text-white leading-none">
							DB
						</span>
						<span className="font-display font-bold text-[28px] tracking-[0.06em] text-dbz-orange leading-none">
							FR
						</span>
					</Link>
					<p className="text-[14px] text-white/60 leading-relaxed max-w-sm">
						Le plus grand serveur Dragon Ball francophone — wiki, actualités,
						personnages, communauté Discord active. Site fan, non affilié aux
						ayants droit.
					</p>
				</div>

				<div className="grid sm:grid-cols-3 gap-8">
					{COLUMNS.map((col) => (
						<div key={col.title}>
							<h4 className="font-display font-semibold text-[12px] tracking-[0.16em] uppercase text-dbz-orange mb-4">
								{col.title}
							</h4>
							<ul className="space-y-2.5">
								{col.links.map((l) => (
									<li key={l.href}>
										<Link
											href={l.href}
											className="text-[14px] text-white/72 hover:text-white transition-colors"
										>
											{l.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className="border-t border-white/[0.06]">
				<div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-3 text-[12px] text-white/45">
					<p className="leading-relaxed max-w-3xl">
						© {new Date().getFullYear()} DBFR — site communautaire de fans.
						Dragon Ball, Dragon Ball Z, Dragon Ball Super, Dragon Ball Daima et
						tous les personnages associés sont © Bird Studio / Shueisha / Toei
						Animation. Marque déposée Toei Animation.{" "}
						<Link
							href="/credits"
							className="underline decoration-white/30 hover:decoration-dbz-orange hover:text-white"
						>
							Voir crédits et sources
						</Link>
						.
					</p>
					<p className="shrink-0">FR · 日本語</p>
				</div>
			</div>
		</footer>
	);
}
