"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignInDiscord } from "@/components/SignInDiscord";
import { SignOut } from "@/components/SignOut";

type Props = {
	links: Array<{ href: string; label: string }>;
	isAdmin: boolean;
	authenticated: boolean;
	username: string | null;
	avatar: string | null;
};

export function MobileNav({
	links,
	isAdmin,
	authenticated,
	username,
	avatar,
}: Props) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		document.documentElement.style.overflow = open ? "hidden" : "";
		return () => {
			document.documentElement.style.overflow = "";
		};
	}, [open]);

	return (
		<div className="lg:hidden ml-auto">
			<button
				type="button"
				aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
				className="w-10 h-10 rounded-full hover:bg-white/[0.08] grid place-items-center text-white transition-colors"
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
				<div className="fixed inset-0 top-16 z-40 bg-[rgba(10,10,10,0.97)] backdrop-blur-xl flex flex-col">
					<nav className="flex flex-col px-6 py-10 gap-2">
						{links.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								onClick={() => setOpen(false)}
								className="font-display font-bold text-[32px] tracking-[0.04em] uppercase text-white py-1.5 hover:text-dbz-orange transition-colors"
							>
								{l.label}
							</Link>
						))}
					</nav>

					<div className="mt-auto p-6 border-t border-white/10 flex flex-col gap-3">
						{isAdmin && (
							<Link
								href="/admin/dashboard"
								onClick={() => setOpen(false)}
								className="text-center font-display font-semibold text-[13px] tracking-[0.12em] uppercase text-dbz-orange border border-dbz-orange/50 rounded-full py-3"
							>
								Tableau de bord
							</Link>
						)}
						{authenticated ? (
							<>
								<Link
									href="/profil/me"
									onClick={() => setOpen(false)}
									className="flex items-center gap-3 bg-white/[0.06] rounded-full p-1 pr-4"
								>
									{avatar && (
										/* eslint-disable-next-line @next/next/no-img-element */
										<img
											src={avatar}
											alt=""
											width={36}
											height={36}
											className="w-9 h-9 rounded-full"
										/>
									)}
									<span className="text-white text-sm font-medium">
										{username ?? "Mon profil"}
									</span>
								</Link>
								<SignOut className="text-center font-display font-semibold text-[13px] tracking-[0.12em] uppercase text-white/70 border border-white/15 rounded-full py-3 hover:text-dbz-orange hover:border-dbz-orange/50 transition-colors disabled:opacity-50">
									Déconnexion
								</SignOut>
							</>
						) : (
							<SignInDiscord className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[14px] tracking-[0.10em] uppercase transition-colors">
								Connexion
							</SignInDiscord>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
