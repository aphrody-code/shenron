import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { SignInDiscord } from "@/components/SignInDiscord";
import { MobileNav } from "@/components/MobileNav";

const PUBLIC_LINKS = [
	{ href: "/", label: "Accueil" },
	{ href: "/wiki/dragon-ball", label: "Personnages" },
	{ href: "/wiki/sagas", label: "Sagas" },
	{ href: "/wiki/episodes?series=DBZ", label: "Épisodes" },
	{ href: "/wiki/films", label: "Films" },
	{ href: "/wiki/jeux", label: "Jeux" },
	{ href: "/actualites", label: "News" },
	{ href: "/wiki/search", label: "Recherche" },
];

export async function SiteNav() {
	const me = await getCurrentUser();
	const isAdmin = me?.user?.roleAdmin === true;
	const username = me?.user?.username ?? null;
	const avatar = me?.user?.avatar ?? null;

	return (
		<header className="sticky top-0 z-50 w-full">
			<div className="absolute inset-0 -z-10 bg-[rgba(10,10,10,0.82)] backdrop-blur-xl backdrop-saturate-150 border-b border-[rgba(255,178,0,0.18)]" />

			<div className="mx-auto max-w-[1440px] px-6 lg:px-10 h-16 flex items-center gap-8">
				{/* Wordmark — Oswald gras avec accent doré façon DB Official */}
				<Link
					href="/"
					className="group flex items-baseline shrink-0 select-none"
					aria-label="DBFR — Dragon Ball France — Accueil"
				>
					<span className="font-display font-bold text-[24px] tracking-[0.06em] text-white leading-none">
						DB
					</span>
					<span className="font-display font-bold text-[24px] tracking-[0.06em] text-dbz-orange leading-none transition-colors group-hover:text-white">
						FR
					</span>
				</Link>

				{/* Nav desktop — Oswald 14px uppercase, espacement DB Official */}
				<nav
					className="hidden lg:flex items-center gap-1 flex-1 justify-center"
					aria-label="Navigation principale"
				>
					{PUBLIC_LINKS.map((l) => (
						<Link
							key={l.href}
							href={l.href}
							className="relative font-display font-semibold text-[14px] tracking-[0.10em] uppercase text-white/72 hover:text-dbz-orange transition-colors px-3.5 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
						>
							{l.label}
						</Link>
					))}
				</nav>

				{/* Zone identité desktop */}
				<div className="hidden lg:flex items-center gap-2 shrink-0">
					{isAdmin && (
						<Link
							href="/admin/dashboard"
							className="font-display font-semibold text-[12px] tracking-[0.12em] uppercase text-dbz-orange hover:text-black hover:bg-dbz-orange px-3 py-1.5 rounded-full border border-dbz-orange/50 transition-colors"
						>
							Admin
						</Link>
					)}
					{me ? (
						<Link
							href="/profil/me"
							className="flex items-center gap-2.5 pl-1 pr-3.5 py-1 rounded-full hover:bg-white/[0.06] transition-colors group"
						>
							{avatar && (
								/* eslint-disable-next-line @next/next/no-img-element */
								<img
									src={avatar}
									alt=""
									width={28}
									height={28}
									className="w-7 h-7 rounded-full ring-1 ring-white/15 group-hover:ring-dbz-orange transition"
								/>
							)}
							<span className="font-display text-[13px] font-medium tracking-wide text-white max-w-[120px] truncate">
								{username ?? "Mon profil"}
							</span>
						</Link>
					) : (
						<SignInDiscord className="inline-flex items-center h-9 px-5 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[13px] tracking-[0.10em] uppercase transition-colors">
							Connexion
						</SignInDiscord>
					)}
				</div>

				<MobileNav
					links={PUBLIC_LINKS}
					isAdmin={isAdmin}
					authenticated={!!me}
					username={username}
					avatar={avatar}
				/>
			</div>
		</header>
	);
}
