import Link from "next/link";
import { KintoUn } from "@/components/KintoUn";
import { CommandMenu } from "@/components/CommandMenu";
import { NavAuth } from "@/components/NavAuth";
import { AdminNavLinks } from "@/components/AdminNavLinks";
import { NavMore } from "@/components/NavMore";
import { NavMega, type MegaItem } from "@/components/NavMega";
import { LAUNCH_CATEGORIES, orderedEntries, resolveAccess, type NavGroup } from "@/lib/wiki-launch";
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

const STATIC_PUBLIC_TAIL = [{ href: "/actualites", label: "News" }];
const STATIC_ADMIN = [{ href: "/tierlists", label: "Tierlists" }];

/**
 * Ordre des œuvres dans la barre. Elles sont en lien DIRECT (pas de menu) :
 * ce sont les portes d'entrée du site, et les enfermer dans un déroulant
 * ajoutait un clic pour rien. L'ordre suit la lecture d'une série — ce qu'on
 * regarde, puis ce qu'on lit, puis ce qui documente.
 */
const ORDRE_OEUVRES = ["films", "episodes", "chronologie", "manga", "databooks", "jeux"] as const;

/**
 * Lien de la barre. Le survol pose un TRAIT D'ENCRE sous le libellé plutôt que
 * de changer sa seule couleur : c'est le geste d'un lettrage de planche, et il
 * survit au daltonisme là où un simple virage vers l'or ne dit rien. Le trait
 * pousse depuis la gauche, jamais depuis le centre — un trait qui s'ouvre en
 * deux se lit comme une animation d'interface, pas comme un coup de feutre.
 */
const linkClass =
	"group/lien relative whitespace-nowrap font-display font-medium text-[14px] tracking-normal text-white/72 hover:text-dbz-orange transition-colors px-2.5 py-2 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60 xl:px-3 after:absolute after:left-2.5 after:right-2.5 after:bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:bg-[var(--color-os)] after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none xl:after:left-3 xl:after:right-3";

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
	const placees = new Set<string>([...dansGroupe("univers").map((c) => c.key), ...ORDRE_OEUVRES]);
	const moreWiki = publiques
		.filter((c) => !placees.has(c.key))
		.map((c) => ({ href: c.href as string, label: c.label }));

	// La liste mobile complète a disparu avec le menu hamburger : sous 1024 px,
	// la navigation est portée par `<BarreNavMobile />`, qui tient ses quatre
	// destinations de l'audience mesurée et le reste dans sa feuille « Plus ».
	const adminOnly = [...wikiClosed, ...STATIC_ADMIN];

	return (
		// `view-transition-name` → la nav reste fixe pendant les slides
		// directionnels (point d'ancrage spatial). CSS dans globals.css.
		<header className="sticky top-0 z-50 w-full" style={{ viewTransitionName: "site-header" }}>
			{/* Bord inférieur : 2 px de blanc cassé, pas une hairline orange. C'est le
			    bord de la première case de la planche — la barre cesse d'être une
			    surface flottante pour devenir le haut de la page. L'ombre portée
			    nette, sans flou, donne le poids de l'encre. */}
			<div className="absolute inset-0 -z-10 bg-[rgba(10,10,10,0.86)] backdrop-blur-xl backdrop-saturate-150 border-b-2 border-[color-mix(in_srgb,var(--color-os)_62%,transparent)] shadow-[0_3px_0_rgba(0,0,0,0.55)]" />

			{/* Réserve d'encoche : en plein écran (PWA, mode immersif iOS), une barre
			    `sticky top-0` passe SOUS la barre d'état et le logo se retrouve à
			    moitié caché. `env(safe-area-inset-top)` vaut 0 partout ailleurs, la
			    règle est donc sans effet sur un navigateur de bureau. */}
			<div className="h-[env(safe-area-inset-top)]" />

			{/* 64 px : c'est `m3_comp_app_bar_small_container_height` = 64 dp, la
			    hauteur de la « small top app bar » de Material 3. */}
			<div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-6 lg:px-10 xl:gap-6">
				{/* Wordmark — même structure que le titre de l'accueil : le nom de
				    l'œuvre en sans très gras, le pays en SERIF capitales espacées.
				    C'est la composition des couvertures Daizenshuu (grotesque + serif
				    capitales), et elle règle au passage un défaut de l'ancien
				    wordmark : « Dragon Ball » et « France » y avaient exactement le
				    même poids et la même taille, si bien qu'on lisait trois mots de
				    même rang au lieu d'un nom suivi de sa déclinaison. */}
				<Link
					href="/"
					className="group flex shrink-0 select-none items-center gap-2.5 whitespace-nowrap py-3"
					aria-label="Dragon Ball France — Accueil"
				>
					{/* Le nuage EST le logo : plus de mot-symbole écrit à côté. Le nom du
					    site reste porté par l'`aria-label` du lien et par le titre de la
					    page — un lecteur d'écran entend « Dragon Ball France », il ne perd
					    rien. Au survol le nuage part d'un cran vers la droite, comme il
					    s'envole. */}
					<span
						aria-hidden
						className="inline-flex h-[38px] w-[68px] shrink-0 items-center justify-center"
					>
						<KintoUn
							hauteur={38}
							decorative
							className="drop-shadow-[0_0_10px_rgba(248,235,126,0.35)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
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

					{/* Les six supports en lien direct — à partir de 1280 px SEULEMENT.
					    En dessous, ils ne tenaient pas : mesuré à 1024 px, « Databooks »,
					    « Jeux » et « Plus » passaient SOUS le bouton de recherche, texte
					    par-dessus texte. Une barre qui déborde n'est pas un détail
					    esthétique, elle rend ses derniers liens illisibles et
					    incliquables. */}
					<span className="hidden items-center gap-0.5 xl:flex">
						{oeuvres.map((l) => (
							<Link key={l.href} href={l.href} className={linkClass}>
								{l.label}
							</Link>
						))}
					</span>

					{/* Sous 1280 px, les mêmes supports passent dans un déroulant. Ce
					    n'est pas un doublon de contenu : les deux formes s'excluent au
					    pixel près, seule celle qui tient est rendue. */}
					<span className="flex items-center xl:hidden">
						<NavMega
							label="Œuvres"
							items={oeuvres.map((l) => ({ href: l.href, label: l.label }))}
							linkClass={linkClass}
						/>
					</span>

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

				{/* Sous 1024 px, la barre du haut ne porte plus QUE la recherche et le
				    compte : la navigation est descendue dans `<BarreNavMobile />`, au
				    pouce. Le menu hamburger a donc disparu — deux systèmes de
				    navigation sur le même écran, l'un en haut hors de portée et
				    l'autre en bas, c'était une hésitation et non un choix.
				    Ces deux contrôles restent rendus HORS du conteneur `hidden lg:flex`
				    ci-dessus, sinon ils disparaissent sous 1024 px, c'est-à-dire pour
				    l'essentiel du trafic. */}
				<div className="ml-auto flex items-center gap-1 lg:hidden">
					<CommandMenu variant="icon" />
					<NavAuth variant="compact" />
				</div>
			</div>
		</header>
	);
}
