import Link from "next/link";
import { CommandMenu } from "@/components/CommandMenu";
import { NavAuth } from "@/components/NavAuth";
import { MobileNav } from "@/components/MobileNav";

// Nav 100 % statique : aucune lecture de session côté serveur (pas de
// `headers()`), sinon TOUTES les pages basculeraient en rendu dynamique et ne
// seraient jamais mises en cache CDN/ISR. L'état d'auth (avatar, admin, sign-in)
// est hydraté côté client via `/api/me` (cf. NavAuth / MobileNav + useMe).

const PUBLIC_LINKS = [
	{ href: "/", label: "Accueil" },
	{ href: "/wiki/personnages", label: "Personnages" },
	{ href: "/wiki/sagas", label: "Sagas" },
	{ href: "/wiki/episodes?series=DBZ", label: "Épisodes" },
	{ href: "/wiki/films", label: "Films" },
	{ href: "/wiki/manga", label: "Manga" },
	{ href: "/wiki/jeux", label: "Jeux" },
	{ href: "/actualites", label: "News" },
	{ href: "/wiki/search", label: "Recherche" },
];

export function SiteNav() {
	return (
		// `view-transition-name` → la nav reste fixe pendant les slides
		// directionnels (point d'ancrage spatial). CSS dans globals.css.
		<header
			className="sticky top-0 z-50 w-full"
			style={{ viewTransitionName: "site-header" }}
		>
			<div className="absolute inset-0 -z-10 bg-[rgba(10,10,10,0.82)] backdrop-blur-xl backdrop-saturate-150 border-b border-[rgba(255,178,0,0.18)]" />

			<div className="mx-auto max-w-[1440px] px-6 lg:px-10 h-16 flex items-center gap-8">
				{/* Wordmark — Google Sans Flex bold + accent doré */}
				<Link
					href="/"
					className="group flex items-baseline shrink-0 select-none whitespace-nowrap"
					aria-label="Dragon Ball France — Accueil"
				>
					<span className="font-display font-bold text-[19px] tracking-tight text-white leading-none">
						Dragon&nbsp;Ball&nbsp;
					</span>
					<span className="font-display font-bold text-[19px] tracking-tight text-dbz-orange leading-none transition-colors group-hover:text-white">
						France
					</span>
				</Link>

				{/* Nav desktop — Google Sans Flex 14px uppercase */}
				<nav
					className="hidden lg:flex items-center gap-1 flex-1 justify-center"
					aria-label="Navigation principale"
				>
					{PUBLIC_LINKS.map((l) => (
						<Link
							key={l.href}
							href={l.href}
							className="relative font-display font-medium text-[15px] tracking-normal text-white/72 hover:text-dbz-orange transition-colors px-3.5 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
						>
							{l.label}
						</Link>
					))}
				</nav>

				{/* Zone identité desktop — îlot client (auth via /api/me) */}
				<div className="hidden lg:flex items-center gap-2 shrink-0">
					<CommandMenu />
					<NavAuth />
				</div>

				<MobileNav links={PUBLIC_LINKS} />
			</div>
		</header>
	);
}
