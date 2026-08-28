"use client";

import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { useEffect, useState } from "react";
import { SignInDiscord } from "@/components/SignInDiscord";
import { SignOut } from "@/components/SignOut";
import { useMe } from "@/lib/use-me";

type Props = {
	links: Array<{ href: string; label: string }>;
	/** Sections masquées au public, affichées uniquement si l'utilisateur est admin. */
	adminLinks?: Array<{ href: string; label: string }>;
};

export function MobileNav({ links, adminLinks = [] }: Props) {
	const [open, setOpen] = useState(false);
	const me = useMe();

	useEffect(() => {
		document.documentElement.style.overflow = open ? "hidden" : "";
		return () => {
			document.documentElement.style.overflow = "";
		};
	}, [open]);

	// Fermeture au clavier (Échap) quand le menu plein écran est ouvert.
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<div className="lg:hidden">
			<button
				type="button"
				aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
				// 44 px : cible tactile minimale, et c'est LE bouton du menu mobile.
				className="w-11 h-11 rounded-full hover:bg-white/[0.08] grid place-items-center text-white transition-colors"
			>
				<span className="relative block w-5 h-[2px] bg-current">
					<span
						className={`absolute left-0 right-0 h-[2px] bg-current transition-transform ${
							open ? "rotate-45 top-0" : "-top-1.5"
						}`}
					/>
					<span
						className={`absolute left-0 right-0 h-[2px] bg-current transition-transform ${
							open ? "-rotate-45 top-0" : "top-1.5"
						}`}
					/>
				</span>
			</button>

			{open && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Menu de navigation"
					className="fixed inset-0 top-16 z-40 bg-[rgba(10,10,10,0.97)] backdrop-blur-xl flex flex-col"
				>
					<nav className="flex flex-col px-6 py-10 gap-2">
						{links.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								onClick={() => setOpen(false)}
								className="font-display font-bold text-[32px] tracking-[0.04em] text-white py-1.5 hover:text-dbz-orange transition-colors"
							>
								{l.label}
							</Link>
						))}
						{me?.isAdmin && adminLinks.length > 0 && (
							<>
								<p className="mt-4 mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-dbz-orange/50">
									Admin · masquées en bêta
								</p>
								{adminLinks.map((l) => (
									<Link
										key={l.href}
										href={l.href}
										onClick={() => setOpen(false)}
										className="font-display font-bold text-[26px] tracking-[0.04em] text-dbz-orange/85 py-1 hover:text-dbz-orange transition-colors"
									>
										{l.label}
									</Link>
								))}
							</>
						)}
					</nav>

					<div className="mt-auto p-6 border-t border-white/10 flex flex-col gap-3">
						{me?.isAdmin && (
							<Link
								href="/admin/dashboard"
								onClick={() => setOpen(false)}
								className="text-center font-display font-semibold text-[13px] tracking-[0.12em] text-dbz-orange border border-dbz-orange/50 rounded-full py-3"
							>
								Tableau de bord
							</Link>
						)}
						{me?.authenticated ? (
							<>
								<Link
									href="/profil/me"
									onClick={() => setOpen(false)}
									className="flex items-center gap-3 bg-white/[0.06] rounded-full p-1 pr-4"
								>
									<Avatar src={me.avatar} size={36} />
									<span className="text-white text-sm font-medium">
										{me.username ?? "Mon profil"}
									</span>
								</Link>
								<SignOut className="text-center font-display font-semibold text-[13px] tracking-[0.12em] text-white/70 border border-white/15 rounded-full py-3 hover:text-dbz-orange hover:border-dbz-orange/50 transition-colors disabled:opacity-50">
									Déconnexion
								</SignOut>
							</>
						) : (
							<SignInDiscord className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[14px] tracking-[0.10em] transition-colors">
								Connexion
							</SignInDiscord>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
