import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export async function SiteNav() {
	const session = await auth();
	const discordId = (session?.user as { id?: string } | undefined)?.id;
	const user = discordId
		? await db.query.users.findFirst({
				where: (u, { eq }) => eq(u.discordId, discordId),
			})
		: null;

	return (
		<nav className="sticky top-0 z-40 bg-dbz-bg/95 backdrop-blur border-b-2 border-dbz-border">
			<div className="container mx-auto px-4 py-3 flex items-center gap-3 md:gap-6 overflow-x-auto">
				<Link
					href="/"
					className="font-saiyan text-2xl text-dbz-yellow hover:text-dbz-orange transition-colors whitespace-nowrap"
					style={{ textShadow: "2px 2px 0px rgba(229, 90, 0, 0.6)" }}
				>
					DBFR
				</Link>
				<div className="flex gap-2 md:gap-4 text-sm md:text-base flex-1">
					{[
						{ href: "/", label: "Blog" },
						{ href: "/personas", label: "Personas" },
						{ href: "/commands", label: "Cmds" },
						{ href: "/wiki/dragon-ball", label: "Wiki" },
						{ href: "/leaderboard", label: "Top" },
						{ href: "/stats", label: "Stats" },
						{ href: "/shop", label: "Shop" },
						{ href: "/jeux", label: "Jeux" },
						{ href: "/canvas", label: "Canvas" },
						{ href: "/api-docs", label: "API" },
					].map((l) => (
						<Link
							key={l.href}
							href={l.href}
							className="font-saiyan uppercase tracking-wider text-dbz-blue-light hover:text-dbz-orange transition-colors whitespace-nowrap"
						>
							{l.label}
						</Link>
					))}
				</div>
				<div className="flex gap-2 items-center">
					{user?.roleAdmin && (
						<Link
							href="/admin/dashboard"
							className="font-saiyan uppercase tracking-wider text-xs px-3 py-1 bg-dbz-orange/20 border-2 border-dbz-orange text-dbz-orange hover:bg-dbz-orange hover:text-white transition-colors whitespace-nowrap"
						>
							ADMIN
						</Link>
					)}
					{session ? (
						<Link
							href="/profil/me"
							className="font-saiyan uppercase tracking-wider text-xs px-3 py-1 bg-dbz-blue-light/20 border-2 border-dbz-blue-light text-dbz-blue-light hover:bg-dbz-blue-light hover:text-white transition-colors whitespace-nowrap"
						>
							PROFIL
						</Link>
					) : (
						<Link
							href="/api/auth/signin"
							className="font-saiyan uppercase tracking-wider text-xs px-3 py-1 bg-dbz-blue-light/20 border-2 border-dbz-blue-light text-dbz-blue-light hover:bg-dbz-blue-light hover:text-white transition-colors whitespace-nowrap"
						>
							LOGIN
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
