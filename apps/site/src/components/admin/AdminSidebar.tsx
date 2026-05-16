"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";

type AdminLink = {
	href: string;
	label: string;
	kanji: string;
	section:
		| "core"
		| "ops"
		| "data"
		| "social"
		| "econ"
		| "mod"
		| "cms"
		| "universe";
};

const ADMIN_LINKS: AdminLink[] = [
	// CORE
	{
		href: "/admin/dashboard",
		label: "DASHBOARD",
		kanji: "戦",
		section: "core",
	},
	{ href: "/admin/sync", label: "SYNC", kanji: "同", section: "core" },
	{ href: "/admin/settings", label: "SETTINGS", kanji: "設", section: "core" },
	{ href: "/admin/bot", label: "BOT", kanji: "獸", section: "core" },

	// OPS
	{ href: "/admin/events", label: "EVENTS", kanji: "事", section: "ops" },
	{ href: "/admin/cron", label: "CRON", kanji: "時", section: "ops" },
	{ href: "/admin/services", label: "SERVICES", kanji: "機", section: "ops" },
	{ href: "/admin/live", label: "LIVE", kanji: "生", section: "ops" },
	{ href: "/admin/logs", label: "LOGS", kanji: "誌", section: "ops" },
	{ href: "/admin/triggers", label: "TRIGGERS", kanji: "動", section: "ops" },
	{ href: "/admin/webhooks", label: "WEBHOOKS", kanji: "鎖", section: "ops" },

	// DATA
	{ href: "/admin/database", label: "DATABASE", kanji: "蔵", section: "data" },

	// DB UNIVERSE — nouveau (Phase 4.5)
	{
		href: "/admin/db-universe/sources",
		label: "SOURCES",
		kanji: "源",
		section: "universe",
	},
	{
		href: "/admin/db-universe/assets",
		label: "ASSETS",
		kanji: "像",
		section: "universe",
	},
	{
		href: "/admin/db-universe/sagas",
		label: "SAGAS",
		kanji: "編",
		section: "universe",
	},
	{
		href: "/admin/db-universe/episodes",
		label: "EPISODES",
		kanji: "話",
		section: "universe",
	},
	{
		href: "/admin/db-universe/films",
		label: "FILMS",
		kanji: "映",
		section: "universe",
	},
	{
		href: "/admin/db-universe/games",
		label: "GAMES",
		kanji: "戯",
		section: "universe",
	},

	// SOCIAL
	{ href: "/admin/discord", label: "DISCORD", kanji: "話", section: "social" },
	{ href: "/admin/canvas", label: "CANVAS", kanji: "絵", section: "social" },
	{
		href: "/admin/canvas/themes",
		label: "THEMES",
		kanji: "彩",
		section: "social",
	},
	{
		href: "/admin/giveaways",
		label: "GIVEAWAYS",
		kanji: "贈",
		section: "social",
	},
	{ href: "/admin/tickets", label: "TICKETS", kanji: "札", section: "social" },
	{
		href: "/admin/messages",
		label: "MESSAGES",
		kanji: "文",
		section: "social",
	},
	{ href: "/admin/send", label: "SEND", kanji: "送", section: "social" },

	// ECON
	{ href: "/admin/economy", label: "ECONOMY", kanji: "銭", section: "econ" },
	{ href: "/admin/levels", label: "LEVELS", kanji: "級", section: "econ" },
	{ href: "/admin/shop", label: "SHOP", kanji: "店", section: "econ" },
	{ href: "/admin/leaderboards", label: "LB+", kanji: "順", section: "econ" },

	// MOD
	{ href: "/admin/moderation", label: "MOD", kanji: "制", section: "mod" },
	{ href: "/admin/audit", label: "AUDIT", kanji: "査", section: "mod" },
	{ href: "/admin/hierarchy", label: "HIERARCHY", kanji: "位", section: "mod" },
	{ href: "/admin/command-perms", label: "PERMS", kanji: "権", section: "mod" },

	// CMS
	{ href: "/admin/posts", label: "ARTICLES", kanji: "記", section: "cms" },
	{ href: "/admin/wiki", label: "WIKI", kanji: "書", section: "cms" },
];

const SECTION_LABEL: Record<AdminLink["section"], string> = {
	core: "// CORE",
	ops: "// OPS",
	data: "// DATA",
	universe: "// DB UNIVERSE",
	social: "// SOCIAL",
	econ: "// ECON",
	mod: "// MOD",
	cms: "// CMS",
};

const SECTION_ORDER: AdminLink["section"][] = [
	"core",
	"ops",
	"data",
	"universe",
	"social",
	"econ",
	"mod",
	"cms",
];

export function AdminSidebar() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [q, setQ] = useState("");

	const filtered = useMemo(() => {
		if (!q.trim()) return ADMIN_LINKS;
		const needle = q.trim().toLowerCase();
		return ADMIN_LINKS.filter(
			(l) =>
				l.label.toLowerCase().includes(needle) ||
				l.href.toLowerCase().includes(needle) ||
				l.section.toLowerCase().includes(needle),
		);
	}, [q]);

	const grouped = useMemo(
		() =>
			SECTION_ORDER.map((s) => ({
				section: s,
				items: filtered.filter((l) => l.section === s),
			})).filter((g) => g.items.length > 0),
		[filtered],
	);

	const isActive = (href: string) =>
		pathname === href ||
		(href !== "/admin/dashboard" && pathname?.startsWith(href));

	return (
		<>
			{/* Mobile bar — toggle */}
			<div className="md:hidden sticky top-16 z-30 flex items-center justify-between gap-3 px-4 py-3 bg-dbz-card/95 backdrop-blur border-b-2 border-dbz-yellow/50">
				<span className="font-display font-bold text-[14px] tracking-[0.18em] uppercase text-dbz-yellow">
					Admin
				</span>
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					className="h-9 px-4 rounded-full bg-dbz-orange text-black font-display font-bold text-[12px] tracking-[0.10em] uppercase"
					aria-expanded={open}
					aria-label={open ? "Fermer le menu admin" : "Ouvrir le menu admin"}
				>
					{open ? "Fermer" : "Menu"}
				</button>
			</div>

			<aside
				className={`relative w-full md:w-72 shrink-0 border-b-4 md:border-b-0 md:border-r-2 border-dbz-yellow/60 bg-dbz-card hud-scanlines overflow-hidden z-20 ${
					open ? "block" : "hidden md:block"
				}`}
			>
				<div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />
				<div className="relative hud-sweep">
					{/* Header HUD */}
					<div className="px-5 pt-6 pb-4 border-b border-dbz-yellow/30 hud-frame">
						<div className="flex items-baseline justify-between">
							<div className="flex items-center gap-2">
								<span className="led" aria-hidden />
								<span className="font-scouter text-[10px] tracking-[0.3em] text-dbz-yellow/90">
									HUD//ACTIVE
								</span>
							</div>
							<span className="font-scouter text-[10px] tracking-widest text-dbz-blue-light/70">
								v8.0
							</span>
						</div>
						<h2 className="mt-3 font-saiyan text-2xl leading-none text-dbz-yellow">
							CAPSULE
							<span className="block text-white/90">CORP CMS</span>
						</h2>
						<p className="mt-2 font-scouter text-[10px] tracking-[0.35em] text-dbz-orange">
							SCOUTER // OPERATOR
						</p>

						{/* Search */}
						<div className="mt-4">
							<input
								type="search"
								value={q}
								onChange={(e) => setQ(e.target.value)}
								placeholder="Filtrer modules…"
								className="w-full h-9 px-3 bg-dbz-bg/80 border border-dbz-yellow/30 focus:border-dbz-orange outline-none font-display text-[12px] text-white placeholder:text-white/40 rounded"
							/>
						</div>
					</div>

					{/* Sections */}
					<nav className="px-3 py-4 space-y-5 max-h-[calc(100vh-260px)] overflow-y-auto md:block flex flex-row md:flex-col gap-3 md:gap-0">
						{grouped.length === 0 ? (
							<p className="px-2 font-display text-[12px] text-white/50">
								Aucun module ne correspond à « {q} ».
							</p>
						) : (
							grouped.map((group) => (
								<div key={group.section} className="space-y-1 min-w-[220px]">
									<div className="px-2 flex items-center gap-2">
										<span className="font-scouter text-[10px] tracking-[0.3em] text-dbz-blue-light">
											{SECTION_LABEL[group.section]}
										</span>
										<span className="flex-1 h-px bg-dbz-blue/40" />
										<span className="font-scouter text-[10px] text-dbz-blue-light/60">
											{String(group.items.length).padStart(2, "0")}
										</span>
									</div>
									<ul className="space-y-0.5">
										{group.items.map((l) => {
											const active = isActive(l.href);
											return (
												<li key={l.href}>
													<Link
														href={l.href}
														onClick={() => setOpen(false)}
														className={`group relative flex items-center gap-3 px-2 py-1.5 border-l-2 transition-colors ${
															active
																? "border-dbz-orange bg-dbz-orange/15"
																: "border-transparent hover:border-dbz-orange hover:bg-dbz-orange/10"
														}`}
													>
														<span
															className={`flex items-center justify-center w-7 h-7 border bg-dbz-bg/60 font-saiyan text-base leading-none transition-colors ${
																active
																	? "border-dbz-orange text-dbz-orange"
																	: "border-dbz-blue-light/40 text-dbz-yellow group-hover:border-dbz-orange group-hover:text-dbz-orange"
															}`}
															aria-hidden
														>
															{l.kanji}
														</span>
														<span
															className={`flex-1 font-saiyan tracking-widest text-sm transition-colors ${
																active
																	? "text-white"
																	: "text-white/85 group-hover:text-white"
															}`}
														>
															{l.label}
														</span>
													</Link>
												</li>
											);
										})}
									</ul>
								</div>
							))
						)}
					</nav>

					{/* Footer */}
					<div className="px-5 py-4 border-t border-dbz-yellow/30 flex items-center justify-between">
						<Link
							href="/"
							className="font-saiyan text-xs tracking-[0.3em] text-dbz-blue-light hover:text-dbz-orange transition-colors"
						>
							← RETOUR SITE
						</Link>
						<span className="font-scouter text-[9px] tracking-widest text-dbz-blue-light/50">
							{ADMIN_LINKS.length} MODULES
						</span>
					</div>
				</div>
			</aside>
		</>
	);
}
