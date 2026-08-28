import Link from "next/link";
import { DragonBall } from "@/components/DragonBall";
import { FooterFabGuard } from "@/components/FooterFabGuard";
import { DISCORD_INVITE } from "@/lib/config";
import { isPathPublic } from "@/lib/wiki-launch";
import { getLaunchConfig } from "@/lib/wiki-launch-config";

const COLUMNS = [
	{
		title: "Explorer",
		links: [
			{ href: "/wiki/episodes", label: "Épisodes" },
			{ href: "/wiki/manga", label: "Manga" },
			{ href: "/wiki/films", label: "Films" },
			{ href: "/wiki/sagas", label: "Sagas & arcs" },
			{ href: "/wiki/chronologie", label: "Chronologie" },
			// Le pied de page était la SEULE porte d'entrée de plusieurs sections ;
			// `/ask` (l'assistant, 570 lignes) et `/wiki/hasard` n'y figuraient pas
			// et n'avaient donc aucun lien entrant sur tout le site.
			{ href: "/wiki/hasard", label: "Une fiche au hasard" },
			{ href: "/favoris", label: "Mes favoris" },
			{ href: "/actualites", label: "Actualités" },
		],
	},
	{
		title: "Communauté",
		links: [
			{ href: DISCORD_INVITE, label: "Rejoindre le Discord" },
			{ href: "/ask", label: "Assistant Dragon Ball" },
			{ href: "/personas", label: "Le bot du serveur" },
			{ href: "/commands", label: "Commandes du bot" },
			{ href: "/leaderboard", label: "Classement XP" },
			{ href: "/classements", label: "Top 3 notes" },
			{ href: "/shop", label: "Boutique zénis" },
			{ href: "/jeux", label: "Mini-jeux" },
			{ href: "/stats", label: "Statistiques" },
		],
	},
	{
		title: "Légal",
		links: [
			{ href: "/about", label: "À propos" },
			{ href: "/credits", label: "Crédits & sources" },
			{ href: "/licence", label: "Licence & usage" },
			{ href: "/confidentialite", label: "Confidentialité" },
			{ href: "/credits#contact", label: "Signaler un contenu" },
		],
	},
];

export async function SiteFooter() {
	// Le pied de page liste des rubriques refermables depuis /admin/lancement : sans
	// cette lecture, il continuait de les annoncer sur TOUTES les pages du site
	// (une fermeture de « Sagas & arcs » y laissait un 307 en bas de chaque page).
	const cfg = await getLaunchConfig().catch(() => null);
	const ouvert = (href: string) => (cfg ? isPathPublic(href, cfg) : true);

	return (
		<footer className="relative mt-auto bg-[#070707] border-t border-white/[0.06]">
			{/* Sentinelle : efface les boutons flottants dès que le pied de page
			    arrive, sinon ils recouvrent ses liens (cf. FooterFabGuard). */}
			<FooterFabGuard />
			<div className="w-full mx-auto max-w-[1440px] px-6 lg:px-10 py-16 grid gap-10 lg:grid-cols-[1.4fr_3fr]">
				<div>
					<Link href="/" className="flex items-baseline select-none mb-5" aria-label="DBFR">
						<span className="font-display font-bold text-[28px] tracking-[0.06em] text-white leading-none">
							DB
						</span>
						<span className="font-display font-bold text-[28px] tracking-[0.06em] text-dbz-orange leading-none">
							FR
						</span>
						{/* Boule décorative centrée sur le wordmark (leading-none 28px) sans
						    grandir la flex-line → items-baseline garde le texte à sa place. */}
						<span
							aria-hidden
							className="ml-2 inline-flex h-[28px] w-[20px] shrink-0 items-center justify-center self-center"
						>
							<DragonBall stars={4} size={20} />
						</span>
					</Link>
					<p className="text-[14px] text-white/60 leading-relaxed max-w-sm">
						Le plus grand serveur Dragon Ball francophone — épisodes, films, manga, actualités et
						une communauté Discord active. Site fan, non affilié aux ayants droit.
					</p>
				</div>

				<div className="grid sm:grid-cols-3 gap-8">
					{COLUMNS.map((col) => (
						<div key={col.title}>
							<h4 className="font-display font-semibold text-[12px] tracking-[0.16em] uppercase text-dbz-orange mb-4">
								{col.title}
							</h4>
							<ul className="space-y-2.5">
								{col.links
									.filter((l) => l.href.startsWith("http") || ouvert(l.href))
									.map((l) => (
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
				<div className="w-full mx-auto max-w-[1440px] px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-3 text-[12px] text-white/50">
					<p className="leading-relaxed max-w-3xl">
						© {new Date().getFullYear()} DBFR — site communautaire de fans. Dragon Ball, Dragon Ball
						Z, Dragon Ball Super, Dragon Ball Daima et tous les personnages associés sont © Bird
						Studio / Shueisha / Toei Animation. Marque déposée Toei Animation.{" "}
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
