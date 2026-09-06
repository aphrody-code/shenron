"use client";

import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { SignInDiscord } from "@/components/SignInDiscord";
import { SignOut } from "@/components/SignOut";
import { useMe } from "@/lib/use-me";

/**
 * Zone identité de la barre du haut (îlot client). Hydrate l'état d'auth via
 * `/api/me` côté client → le layout + les pages restent statiques/ISR cacheables.
 *
 * `variant="compact"` : sur mobile, la barre du haut ne porte plus que la
 * recherche et le compte — la navigation est descendue dans la barre basse. Il
 * n'y reste donc que l'AVATAR : le pseudo n'y tiendrait pas sous 360 px, et le
 * bouton de déconnexion vit désormais dans la feuille « Plus », pas dans une
 * barre où il jouxterait le lien du profil au pixel près.
 */
export function NavAuth({ variant = "full" }: { variant?: "full" | "compact" }) {
	const me = useMe();
	const compact = variant === "compact";

	// Placeholder de même gabarit tant que /api/me n'a pas répondu (anti-CLS).
	if (me === undefined) {
		return <div className={compact ? "h-11 w-11" : "h-9 w-[120px]"} aria-hidden />;
	}

	if (compact) {
		// 44 px de cible : au-dessus des 24 px exigés par WCAG 2.2 (2.5.8, AA),
		// sous les 48 dp de Material 3 — c'est la taille des autres commandes de
		// cette barre, et l'uniformité prime ici sur les 4 px manquants.
		return me.authenticated ? (
			<Link
				href="/dashboard"
				aria-label={me.username ? `Espace de ${me.username}` : "Mon espace"}
				className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-[var(--color-logo-jaune)]"
			>
				<Avatar src={me.avatar} size={28} className="ring-1 ring-white/15" />
			</Link>
		) : (
			<SignInDiscord
				aria-label="Se connecter avec Discord"
				className="grid h-11 w-11 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--color-logo-jaune)]"
			>
				<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
					<path d="M12 2.6a5.2 5.2 0 0 0-5.2 5.2A5.2 5.2 0 0 0 12 13a5.2 5.2 0 0 0 5.2-5.2A5.2 5.2 0 0 0 12 2.6Zm0 12.2c-4.3 0-8 2.2-8 5v1.6h16v-1.6c0-2.8-3.7-5-8-5Z" />
				</svg>
			</SignInDiscord>
		);
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
						href="/dashboard"
						className="flex items-center gap-2.5 pl-1 pr-3.5 py-1 rounded-full hover:bg-white/[0.06] transition-colors group"
					>
						<Avatar
							src={me.avatar}
							size={28}
							className="ring-1 ring-white/15 transition group-hover:ring-dbz-orange"
						/>
						<span className="font-display text-[13px] font-medium tracking-wide text-white max-w-[120px] truncate">
							{me.username ?? "Mon profil"}
						</span>
					</Link>
					<Link
						href="/parametres"
						aria-label="Paramètres du compte"
						className="hidden xl:grid h-9 w-9 place-items-center rounded-full text-white/55 hover:text-dbz-orange hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
					>
						<span aria-hidden>⚙</span>
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
