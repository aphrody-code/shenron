import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { SignInDiscord } from "@/components/SignInDiscord";

const PUBLIC_LINKS = [
	{ href: "/", label: "Accueil" },
	{ href: "/actualites", label: "Blog" },
	{ href: "/personas", label: "Gardiens" },
	{ href: "/wiki/dragon-ball", label: "Wiki" },
	{ href: "/leaderboard", label: "Top" },
	{ href: "/stats", label: "Stats" },
	{ href: "/shop", label: "Shop" },
	{ href: "/jeux", label: "Jeux" },
];

export async function SiteNav() {
	const me = await getCurrentUser();
	const isAdmin = me?.user?.roleAdmin === true;
	const username = me?.user?.username ?? null;
	const avatar = me?.user?.avatar ?? null;

	return (
		<header className="sticky top-0 z-40 bg-dbz-bg/95 backdrop-blur-md border-b-2 border-dbz-border">
			{/* Strip utilitaire */}
			<div className="border-b border-dbz-border/60 bg-black/30">
				<div className="container mx-auto px-4 h-6 flex items-center justify-between text-[10px] font-scouter tracking-[0.3em] text-dbz-blue-light/70">
					<span>
						<span className="text-dbz-orange">●</span> DBFR.FR
					</span>
					<span className="hidden md:inline">
						COMMUNAUTÉ DRAGON BALL FRANCE
					</span>
					<span>FR/JP</span>
				</div>
			</div>

			<div className="container mx-auto px-4 py-3 flex items-stretch gap-4 md:gap-6 overflow-x-auto">
				{/* Logo + katakana */}
				<Link
					href="/"
					className="flex items-center gap-3 group whitespace-nowrap"
				>
					<span
						className="kata-vert font-scouter text-[10px] text-dbz-orange/80 leading-none group-hover:text-dbz-yellow transition-colors"
						aria-hidden
					>
						ドラゴン
					</span>
					<span
						className="font-saiyan text-3xl text-dbz-yellow group-hover:text-dbz-orange transition-colors"
						style={{
							textShadow:
								"2px 2px 0px rgba(255, 107, 26, 0.55), 0 0 20px rgba(75, 168, 255, 0.3)",
						}}
					>
						DBFR
					</span>
					<span className="hidden md:inline-block self-center w-1 h-1 rounded-full bg-dbz-yellow/40" />
				</Link>

				{/* Liens */}
				<nav className="flex items-center gap-4 md:gap-6 text-sm md:text-base flex-1">
					{PUBLIC_LINKS.map((l, i) => (
						<span key={l.href} className="flex items-center gap-4 md:gap-6">
							{i > 0 && (
								<span
									className="hidden md:inline text-dbz-blue/50 text-xs"
									aria-hidden
								>
									·
								</span>
							)}
							<Link
								href={l.href}
								className="link-underline font-saiyan uppercase tracking-wider text-dbz-blue-light hover:text-dbz-orange transition-colors whitespace-nowrap"
							>
								{l.label}
							</Link>
						</span>
					))}
				</nav>

				{/* Zone identité */}
				<div className="flex items-center gap-2">
					{isAdmin && (
						<Link
							href="/admin/dashboard"
							className="group flex items-center gap-2 px-3 py-1 bg-dbz-yellow/10 border-2 border-dbz-yellow text-dbz-yellow hover:bg-dbz-yellow hover:text-black transition-colors whitespace-nowrap"
						>
							<span className="led" aria-hidden />
							<span className="font-saiyan uppercase tracking-widest text-xs">
								ADMIN
							</span>
						</Link>
					)}
					{me ? (
						<Link
							href="/profil/me"
							className="flex items-center gap-2 pl-1 pr-3 py-1 bg-dbz-card border-2 border-dbz-blue-light hover:border-dbz-orange transition-colors whitespace-nowrap group"
						>
							{avatar ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={avatar}
									alt=""
									width={22}
									height={22}
									className="rounded-full border border-dbz-yellow/60"
								/>
							) : (
								<span className="w-[22px] h-[22px] rounded-full bg-dbz-blue grid place-items-center font-saiyan text-[10px] text-dbz-yellow">
									?
								</span>
							)}
							<span className="flex flex-col leading-none">
								<span className="font-scouter text-[8px] tracking-widest text-dbz-blue-light/70 group-hover:text-dbz-orange/80">
									PROFIL
								</span>
								<span className="font-saiyan text-xs tracking-wider text-white max-w-[90px] truncate">
									{username ?? "Saiyan"}
								</span>
							</span>
						</Link>
					) : (
						<SignInDiscord className="group flex items-center gap-2 px-3 py-1.5 bg-dbz-orange border-b-4 border-dbz-orange-dark active:border-b-0 active:translate-y-1 transition-all whitespace-nowrap">
							<span className="font-saiyan uppercase tracking-widest text-xs text-white">
								ENTRER
							</span>
						</SignInDiscord>
					)}
				</div>
			</div>
		</header>
	);
}
