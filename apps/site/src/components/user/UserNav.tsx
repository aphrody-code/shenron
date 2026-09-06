"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, ListOrdered, Settings, UserRound } from "lucide-react";

const ITEMS = [
	{ href: "/dashboard", label: "Vue d’ensemble", icon: LayoutDashboard },
	{ href: "/profil/me", label: "Profil public", icon: UserRound },
	{ href: "/favoris", label: "Favoris", icon: Heart },
	{ href: "/tierlists/mes", label: "Mes tier lists", icon: ListOrdered },
	{ href: "/parametres", label: "Paramètres", icon: Settings },
] as const;

export function UserNav() {
	const pathname = usePathname();
	return (
		<nav
			aria-label="Espace membre"
			className="mb-8 overflow-x-auto rounded-2xl border border-white/10 bg-black/25 p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		>
			<ul className="flex min-w-max gap-1">
				{ITEMS.map(({ href, label, icon: Icon }) => {
					const active =
						href === "/profil/me" ? pathname.startsWith("/profil/") : pathname === href;
					return (
						<li key={href}>
							<Link
								href={href}
								aria-current={active ? "page" : undefined}
								className={`flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-dbz-orange ${active ? "bg-dbz-orange text-black" : "text-white/60 hover:bg-white/[.07] hover:text-white"}`}
							>
								<Icon className="h-4 w-4" aria-hidden />
								{label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
