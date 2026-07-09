import Link from "next/link";
import { DragonBall } from "@/components/DragonBall";
import { CommandMenu } from "@/components/CommandMenu";
import { NavAuth } from "@/components/NavAuth";
import { MobileNav } from "@/components/MobileNav";
import { AdminNavLinks } from "@/components/AdminNavLinks";
import { effectiveOpenKeys, LAUNCH_CATEGORIES } from "@/lib/wiki-launch";
import { getOpenCategoryKeys } from "@/lib/wiki-launch-config";

// Nav SANS session : on lit la config de lancement (DB, PAS de cookies/headers)
// → reste cacheable CDN/ISR (revalidée à l'écriture de la config). L'état d'auth
// (avatar, admin, sign-in) est hydraté côté client via `/api/me` (NavAuth).
//
// Les catégories wiki OUVERTES passent en liens publics ; les FERMÉES restent
// réservées aux admins (îlot client `AdminNavLinks`, gate useMe). La bascule se
// fait depuis /admin/lancement (data-driven, cf. wiki-launch.ts).

const STATIC_PUBLIC_HEAD = [{ href: "/", label: "Accueil" }];
const STATIC_PUBLIC_TAIL = [{ href: "/actualites", label: "News" }];
const STATIC_ADMIN = [{ href: "/tierlists", label: "Tierlists" }];

export async function SiteNav() {
	const open = effectiveOpenKeys(await getOpenCategoryKeys());
	const wikiLinks = LAUNCH_CATEGORIES.filter((c) => c.href).map((c) => ({
		href: c.href as string,
		label: c.label,
		open: open.has(c.key),
	}));
	const PUBLIC_LINKS = [
		...STATIC_PUBLIC_HEAD,
		...wikiLinks.filter((l) => l.open).map(({ href, label }) => ({ href, label })),
		...STATIC_PUBLIC_TAIL,
	];
	const ADMIN_LINKS = [
		...wikiLinks.filter((l) => !l.open).map(({ href, label }) => ({ href, label })),
		...STATIC_ADMIN,
	];

	return (
		// `view-transition-name` → la nav reste fixe pendant les slides
		// directionnels (point d'ancrage spatial). CSS dans globals.css.
		<header className="sticky top-0 z-50 w-full" style={{ viewTransitionName: "site-header" }}>
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
					{/* Boule décorative : span aria-hidden → le Link garde son nom unique.
					    Wrapper self-center clampé à la hauteur du wordmark (leading-none 19px)
					    → la boule (22px) déborde symétriquement sans grandir la flex-line,
					    donc items-baseline conserve la position exacte du texte (zéro shift). */}
					<span
						aria-hidden
						className="ml-2 inline-flex h-[19px] w-[22px] shrink-0 items-center justify-center self-center"
					>
						<DragonBall
							stars={4}
							size={22}
							className="drop-shadow-[0_0_6px_rgba(245,191,65,0.35)] transition-transform duration-300 group-hover:rotate-12"
						/>
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
					{/* Sections masquées en bêta — visibles uniquement pour l'admin (îlot client). */}
					<AdminNavLinks links={ADMIN_LINKS} />
				</nav>

				{/* Zone identité desktop — îlot client (auth via /api/me) */}
				<div className="hidden lg:flex items-center gap-2 shrink-0">
					<CommandMenu />
					<NavAuth />
				</div>

				<MobileNav links={PUBLIC_LINKS} adminLinks={ADMIN_LINKS} />
			</div>
		</header>
	);
}
