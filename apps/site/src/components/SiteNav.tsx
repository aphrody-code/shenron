import Link from "next/link";
import { DragonBall } from "@/components/DragonBall";
import { CommandMenu } from "@/components/CommandMenu";
import { NavAuth } from "@/components/NavAuth";
import { MobileNav } from "@/components/MobileNav";
import { AdminNavLinks } from "@/components/AdminNavLinks";
import { NavMore } from "@/components/NavMore";
import { NavMega, type MegaItem } from "@/components/NavMega";
import {
	LAUNCH_CATEGORIES,
	orderedEntries,
	resolveAccess,
	type NavGroup,
} from "@/lib/wiki-launch";
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
 * Ordre des œuvres dans la barre. Elles sont en lien DIRECT (pas de menu) :
 * ce sont les portes d'entrée du site, et les enfermer dans un déroulant
 * ajoutait un clic pour rien. L'ordre suit la lecture d'une série — ce qu'on
 * regarde, puis ce qu'on lit, puis ce qui documente.
 */
const ORDRE_OEUVRES = [
	"films",
	"episodes",
	"chronologie",
	"manga",
	"databooks",
	"jeux",
] as const;

const linkClass =
	"relative whitespace-nowrap font-display font-medium text-[14px] tracking-normal text-white/72 hover:text-dbz-orange transition-colors px-2.5 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60 xl:px-3";

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

	const wikiClosed = ordered
		.filter((c) => c.href && !isPublic(c.key))
		.map((c) => ({ href: c.href as string, label: c.label }));

	const publiques = ordered.filter((c) => c.href && isPublic(c.key));
	const dansGroupe = (g: NavGroup) => publiques.filter((c) => c.group === g);

	// Un seul déroulant : « Univers », l'encyclopédie. `blurb` vient du registre —
	// un libellé seul ne dit pas ce qu'on trouve derrière « Arcs » ou « Races ».
	const univers: MegaItem[] = dansGroupe("univers").map((c) => ({
		href: c.href as string,
		label: c.label,
		blurb: c.blurb,
	}));

	// Œuvres en liens directs, dans l'ordre éditorial et non celui de la base.
	const parCle = new Map(publiques.map((c) => [c.key, c]));
	const oeuvres = ORDRE_OEUVRES.map((k) => parCle.get(k))
		.filter((c): c is NonNullable<typeof c> => !!c)
		.map((c) => ({ href: c.href as string, label: c.label }));

	// Tout le reste (contribuer, modifications…) → menu « Plus ». Une rubrique
	// n'apparaît qu'à UN seul endroit de la barre : le doublon vient toujours
	// d'une liste qui repart de toutes les publiques sans retirer ce qui est
	// déjà placé ailleurs dans la barre.
	const placees = new Set<string>([
		...dansGroupe("univers").map((c) => c.key),
		...ORDRE_OEUVRES,
	]);
	const moreWiki = publiques
		.filter((c) => !placees.has(c.key))
		.map((c) => ({ href: c.href as string, label: c.label }));

	// Mobile : tous les liens publics (pas de contrainte largeur).
	const mobilePublic = [
		...STATIC_PUBLIC_HEAD,
		...univers.map((i) => ({ href: i.href, label: i.label })),
		...oeuvres,
		...moreWiki,
		...STATIC_PUBLIC_TAIL,
	];
	const adminOnly = [...wikiClosed, ...STATIC_ADMIN];

	return (
		// `view-transition-name` → la nav reste fixe pendant les slides
		// directionnels (point d'ancrage spatial). CSS dans globals.css.
		<header className="sticky top-0 z-50 w-full" style={{ viewTransitionName: "site-header" }}>
			<div className="absolute inset-0 -z-10 bg-[rgba(10,10,10,0.82)] backdrop-blur-xl backdrop-saturate-150 border-b border-[rgba(255,178,0,0.18)]" />

			<div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-6 lg:px-10 xl:gap-6">
				{/* Wordmark — Google Sans Flex bold + accent doré */}
				<Link
					href="/"
					className="group flex items-baseline shrink-0 select-none whitespace-nowrap py-3"
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
				{/* `justify-start` et non `justify-center` : une nav centrée qui ne
				    tient pas dans l'espace disponible déborde des DEUX côtés, et ses
				    premiers liens passaient sous le wordmark. Alignée à gauche, elle
				    ne peut déborder que du côté où il reste de la place. */}
				{/* Pas d'`overflow-hidden` : le panneau du méga-menu est en position
				    absolue à l'intérieur de cette nav, il serait rogné. */}
				<nav
					className="hidden min-w-0 flex-1 items-center justify-start gap-0.5 lg:flex"
					aria-label="Navigation principale"
				>
					{/* Pas de lien « Accueil » ici : le wordmark à gauche pointe déjà
					    la racine, et c'est la convention que tout visiteur connaît. Il
					    reste dans le menu mobile, où il n'y a pas de wordmark cliquable
					    aussi évident. */}
					<NavMega label="Univers" items={univers} linkClass={linkClass} />
					{oeuvres.map((l) => (
						<Link key={l.href} href={l.href} className={linkClass}>
							{l.label}
						</Link>
					))}
					{moreWiki.length > 0 && <NavMore links={moreWiki} label="Plus" hint="Autres sections" />}
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

				{/* Recherche mobile : rendue HORS du conteneur `hidden lg:flex`
				    ci-dessus, sinon elle disparaît sous 1024 px — c'est-à-dire pour
				    l'essentiel du trafic. */}
				<div className="ml-auto flex items-center lg:hidden">
					<CommandMenu variant="icon" />
				</div>
				<MobileNav links={mobilePublic} adminLinks={adminOnly} />
			</div>
		</header>
	);
}
