"use client";

import Link from "next/link";
import { SignInDiscord } from "@/components/SignInDiscord";
import { SignOut } from "@/components/SignOut";
import { useMe } from "@/lib/use-me";

/**
 * Zone identité de la nav desktop (îlot client). Hydrate l'état d'auth via
 * `/api/me` côté client → le layout + les pages restent statiques/ISR cacheables.
 */
export function NavAuth() {
	const me = useMe();

	// Placeholder de même gabarit tant que /api/me n'a pas répondu (anti-CLS).
	if (me === undefined) {
		return <div className="h-9 w-[120px]" aria-hidden />;
	}

	return (
		<div className="flex items-center gap-2">
			{me.isAdmin && (
				<Link
					href="/admin/dashboard"
					className="font-display font-semibold text-[13px] tracking-normal text-dbz-orange hover:text-black hover:bg-dbz-orange px-3 py-1.5 rounded-full border border-dbz-orange/50 transition-colors"
				>
					Admin
				</Link>
			)}
			{me.authenticated ? (
				<>
					<Link
						href="/profil/me"
						className="flex items-center gap-2.5 pl-1 pr-3.5 py-1 rounded-full hover:bg-white/[0.06] transition-colors group"
					>
						{me.avatar && (
							<img
								src={me.avatar}
								alt=""
								width={28}
								height={28}
								className="w-7 h-7 rounded-full ring-1 ring-white/15 group-hover:ring-dbz-orange transition"
							/>
						)}
						<span className="font-display text-[13px] font-medium tracking-wide text-white max-w-[120px] truncate">
							{me.username ?? "Mon profil"}
						</span>
					</Link>
					<SignOut
						className="grid place-items-center w-9 h-9 rounded-full text-white/55 hover:text-dbz-orange hover:bg-white/[0.06] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
						aria-label="Se déconnecter"
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<polyline points="16 17 21 12 16 7" />
							<line x1="21" y1="12" x2="9" y2="12" />
						</svg>
					</SignOut>
				</>
			) : (
				<SignInDiscord className="inline-flex items-center h-9 px-5 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[14px] tracking-normal transition-colors">
					Connexion
				</SignInDiscord>
			)}
		</div>
	);
}
