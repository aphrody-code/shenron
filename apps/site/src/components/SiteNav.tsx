import Link from "next/link";
import { DragonBall } from "@/components/DragonBall";
import { CommandMenu } from "@/components/CommandMenu";
import { NavAuth } from "@/components/NavAuth";
import { MobileNav } from "@/components/MobileNav";
import { AdminNavLinks } from "@/components/AdminNavLinks";
import { NavMore } from "@/components/NavMore";
import { LAUNCH_CATEGORIES, orderedEntries, resolveAccess } from "@/lib/wiki-launch";
import { getLaunchConfig } from "@/lib/wiki-launch-config";

/**
 * Nav SANS session : config de lancement (DB) uniquement — pas de cookies/headers
 * → cache CDN/ISR préservé. Auth via îlot client `/api/me`.
 *
 * UX calquée sur la nav bêta d'origine :
 *  - barre principale **courte** (spine) pour ne jamais casser le layout ;
 *  - catégories ouvertes en surplus → menu « Plus » ;
 *  - catégories encore fermées → menu « Sections » admin only.
 *
 * Contrôle public : /admin/lancement (« Catégories du site »).
 */

const STATIC_PUBLIC_HEAD = [{ href: "/", label: "Accueil" }];
const STATIC_PUBLIC_TAIL = [{ href: "/actualites", label: "News" }];
const STATIC_ADMIN = [{ href: "/tierlists", label: "Tierlists" }];

/**
 * Nombre max de liens wiki affichés en ligne dans la barre desktop
 * (hors Accueil / News). Au-delà → menu « Plus ».
 * 4 = spine bêta (Épisodes, Films, Chronologie, Manga) sans débordement.
 */
const MAX_INLINE_WIKI = 4;

const linkClass =
	"relative font-display font-medium text-[15px] tracking-normal text-white/72 hover:text-dbz-orange transition-colors px-3.5 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60";

export async function SiteNav() {
	const cfg = await getLaunchConfig();

	// Ordre piloté depuis /admin/lancement (repli : ordre du registre).
	// La nav ne liste QUE les rubriques publiques : elle est rendue dans le layout
	// racine, donc sans session — y afficher les rubriques réservées aux
	// connectés/rôles obligerait à lire les cookies et ferait basculer TOUT le site
	// en `private, no-store` (cf. piège latence). Les membres concernés y accèdent
	// par lien direct ; le staff garde la liste complète dans « Sections ».
	const ordered = orderedEntries(cfg.order, LAUNCH_CATEGORIES);
	const isPublic = (key: string) => resolveAccess(key, cfg).mode === "public";

	const wikiOpen = ordered
		.filter((c) => c.href && isPublic(c.key))
		.map((c) => ({ href: c.href as string, label: c.label }));
	const wikiClosed = ordered
		.filter((c) => c.href && !isPublic(c.key))
		.map((c) => ({ href: c.href as string, label: c.label }));

	const inlineWiki = wikiOpen.slice(0, MAX_INLINE_WIKI);
	const moreWiki = wikiOpen.slice(MAX_INLINE_WIKI);

	// Mobile : tous les liens publics (pas de contrainte largeur).
	const mobilePublic = [...STATIC_PUBLIC_HEAD, ...wikiOpen, ...STATIC_PUBLIC_TAIL];
	const adminOnly = [...wikiClosed, ...STATIC_ADMIN];

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

				{/* Nav desktop — spine compacte + overflow « Plus » + admin Sections */}
				<nav
					className="hidden lg:flex items-center gap-1 flex-1 justify-center min-w-0"
					aria-label="Navigation principale"
				>
					{STATIC_PUBLIC_HEAD.map((l) => (
						<Link key={l.href} href={l.href} className={linkClass}>
							{l.label}
						</Link>
					))}
					{inlineWiki.map((l) => (
						<Link key={l.href} href={l.href} className={linkClass}>
							{l.label}
						</Link>
					))}
					{moreWiki.length > 0 && (
						<NavMore links={moreWiki} label="Plus" hint="Autres sections" />
					)}
					{STATIC_PUBLIC_TAIL.map((l) => (
						<Link key={l.href} href={l.href} className={linkClass}>
							{l.label}
						</Link>
					))}
					{/* Sections encore fermées au public — admins only */}
					<AdminNavLinks links={adminOnly} />
				</nav>

				{/* Zone identité desktop — îlot client (auth via /api/me) */}
				<div className="hidden lg:flex items-center gap-2 shrink-0">
					<CommandMenu />
					<NavAuth />
				</div>

				<MobileNav links={mobilePublic} adminLinks={adminOnly} />
			</div>
		</header>
	);
}
