"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
	PenLine,
	LayoutDashboard,
	Home,
	RefreshCw,
	Settings,
	Bot,
	Brain,
	CalendarDays,
	Clock,
	Server,
	Radio,
	ScrollText,
	ScanText,
	BarChart2,
	Activity,
	Terminal,
	Zap,
	Webhook,
	Database,
	BookOpen,
	ImageIcon,
	Film,
	Gamepad2,
	Tv2,
	Eye,
	MapPin,
	Users,
	UserCircle,
	Palette,
	Layers,
	Gift,
	Ticket,
	MessageSquare,
	Rocket,
	Send,
	Coins,
	TrendingUp,
	ShoppingBag,
	Trophy,
	Shield,
	ClipboardList,
	BookMarked,
	Crown,
	Key,
	FileText,
	BookText,
	ListOrdered,
	History,
	Flag,
	PanelLeftClose,
	PanelLeftOpen,
} from "lucide-react";

// Types internes

type SectionId =
	| "accueil"
	| "systeme"
	| "encyclopedie"
	| "communaute"
	| "economie"
	| "moderation"
	| "contenu";

type AdminLink = {
	href: string;
	/** Libellé court affiché dans la sidebar */
	label: string;
	/** Description courte visible au survol / en sous-titre */
	description: string;
	/** Icône lucide-react */
	icon: React.ReactNode;
	section: SectionId;
};

// ---------------------------------------------------------------------------
// Définition des liens — les href sont INCHANGÉS (ne pas modifier)
// ---------------------------------------------------------------------------

const ADMIN_LINKS: AdminLink[] = [
	// ACCUEIL & ADMINISTRATION GÉNÉRALE
	{
		href: "/admin/dashboard",
		label: "Tableau de bord",
		description: "Vue d'ensemble du bot",
		icon: <LayoutDashboard className="h-4 w-4" />,
		section: "accueil",
	},
	{
		href: "/admin/home",
		label: "Page d'accueil",
		description: "Réorganiser la home : sections, clips de fond, contenu",
		icon: <Home className="h-4 w-4" />,
		section: "accueil",
	},
	{
		href: "/admin/design",
		label: "Design & thème",
		description: "Palette et coins appliqués à tout le site",
		icon: <Palette className="h-4 w-4" />,
		section: "accueil",
	},
	{
		href: "/admin/sync",
		label: "Synchronisation",
		description: "Synchroniser Discord ↔ base de données",
		icon: <RefreshCw className="h-4 w-4" />,
		section: "accueil",
	},
	{
		href: "/admin/settings",
		label: "Paramètres",
		description: "Réglages généraux du bot",
		icon: <Settings className="h-4 w-4" />,
		section: "accueil",
	},
	{
		href: "/admin/bot",
		label: "Gestion du bot",
		description: "État et contrôle des personas",
		icon: <Bot className="h-4 w-4" />,
		section: "accueil",
	},
	{
		href: "/admin/console",
		label: "Console bots",
		description: "Voir les messages d'un salon et faire parler une persona",
		icon: <Send className="h-4 w-4" />,
		section: "accueil",
	},
	{
		href: "/admin/commandes",
		label: "Exécuter une commande",
		description: "Lancer une commande du bot à distance (XP, zénis, races, rôles…)",
		icon: <Terminal className="h-4 w-4" />,
		section: "accueil",
	},

	// SYSTÈME & TECHNIQUE
	{
		href: "/admin/events",
		label: "Événements",
		description: "Événements Discord reçus",
		icon: <CalendarDays className="h-4 w-4" />,
		section: "systeme",
	},
	{
		href: "/admin/cron",
		label: "Tâches planifiées",
		description: "Jobs automatiques (cron)",
		icon: <Clock className="h-4 w-4" />,
		section: "systeme",
	},
	{
		href: "/admin/services",
		label: "Services",
		description: "État des services internes",
		icon: <Server className="h-4 w-4" />,
		section: "systeme",
	},
	{
		href: "/admin/live",
		label: "En direct",
		description: "Activité en temps réel",
		icon: <Radio className="h-4 w-4" />,
		section: "systeme",
	},
	{
		href: "/admin/logs",
		label: "Journaux",
		description: "Logs d'activité du bot",
		icon: <ScrollText className="h-4 w-4" />,
		section: "systeme",
	},
	{
		href: "/admin/stats",
		label: "Statistiques",
		description: "Chiffres globaux d'utilisation",
		icon: <BarChart2 className="h-4 w-4" />,
		section: "systeme",
	},
	{
		href: "/admin/activite",
		label: "Activité du site",
		description: "Audience web : visites, visiteurs, sources, top pages",
		icon: <Activity className="h-4 w-4" />,
		section: "systeme",
	},
	{
		href: "/admin/evaluations",
		label: "Évaluations IA",
		description: "RAG & Jugement du Grand Prêtre",
		icon: <Brain className="h-4 w-4" />,
		section: "systeme",
	},
	{
		href: "/admin/triggers",
		label: "Déclencheurs",
		description: "Réponses automatiques aux messages",
		icon: <Zap className="h-4 w-4" />,
		section: "systeme",
	},
	{
		href: "/admin/webhooks",
		label: "Webhooks",
		description: "Connexions externes et notifications",
		icon: <Webhook className="h-4 w-4" />,
		section: "systeme",
	},
	{
		href: "/admin/database",
		label: "Base de données",
		description: "Accès direct aux tables",
		icon: <Database className="h-4 w-4" />,
		section: "systeme",
	},

	// ENCYCLOPÉDIE / WIKI DBZ
	{
		href: "/admin/lancement",
		label: "Lancement wiki",
		description: "Ouvrir les catégories au public une par une (gating bêta)",
		icon: <Rocket className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/visibilite",
		label: "Visibilité",
		description: "Afficher/masquer chaque entité du wiki sur le site public",
		icon: <Eye className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/db-universe/sources",
		label: "Sources",
		description: "Origines des données wiki",
		icon: <BookOpen className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/db-universe/assets",
		label: "Images & médias",
		description: "Illustrations, icônes et visuels",
		icon: <ImageIcon className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/db-universe/sagas",
		label: "Sagas",
		description: "Arcs narratifs de l'univers DBZ",
		icon: <MapPin className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/db-universe/episodes",
		label: "Épisodes",
		description: "Catalogue des épisodes",
		icon: <Tv2 className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/db-universe/films",
		label: "Films",
		description: "Films et OAV Dragon Ball",
		icon: <Film className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/chronologie",
		label: "Chronologie",
		description: "Ordre officiel de la frise universelle (épisodes + films)",
		icon: <History className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/db-universe/games",
		label: "Jeux vidéo",
		description: "Jeux Dragon Ball référencés",
		icon: <Gamepad2 className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/db-universe/databooks",
		label: "Databooks & interviews",
		description: "Guides officiels, artbooks et interviews (triables par date)",
		icon: <BookOpen className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/databooks",
		label: "Transcriptions",
		description: "Suivi, relecture et recherche du texte des planches",
		icon: <ScanText className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/wiki",
		label: "Wiki (articles libres)",
		description: "Pages wiki rédigées manuellement",
		icon: <BookText className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/wiki/history",
		label: "Historique wiki",
		description: "Journal des révisions du wiki + retour arrière",
		icon: <History className="h-4 w-4" />,
		section: "encyclopedie",
	},
	{
		href: "/admin/posts",
		label: "Articles / Actualités",
		description: "Publications et annonces du serveur",
		icon: <FileText className="h-4 w-4" />,
		section: "contenu",
	},
	{
		href: "/admin/banners",
		label: "Bannières",
		description: "Visuels éditoriaux et annonces mises en avant",
		icon: <ImageIcon className="h-4 w-4" />,
		section: "contenu",
	},

	// COMMUNAUTÉ & SOCIAL
	{
		href: "/admin/discord",
		label: "Serveurs Discord",
		description: "Guildes et membres connectés",
		icon: <Users className="h-4 w-4" />,
		section: "communaute",
	},
	{
		href: "/admin/profile",
		label: "Profils membres",
		description: "Fiches et données des membres",
		icon: <UserCircle className="h-4 w-4" />,
		section: "communaute",
	},
	{
		href: "/admin/canvas",
		label: "Cartes de profil",
		description: "Visuels générés (niveau, profil)",
		icon: <Palette className="h-4 w-4" />,
		section: "communaute",
	},
	{
		href: "/admin/canvas/themes",
		label: "Thèmes visuels",
		description: "Thèmes disponibles pour les cartes",
		icon: <Layers className="h-4 w-4" />,
		section: "communaute",
	},
	{
		href: "/admin/giveaways",
		label: "Cadeaux & Tirages",
		description: "Concours et cadeaux en cours",
		icon: <Gift className="h-4 w-4" />,
		section: "communaute",
	},
	{
		href: "/admin/tickets",
		label: "Tickets de support",
		description: "Demandes d'aide des membres",
		icon: <Ticket className="h-4 w-4" />,
		section: "communaute",
	},
	{
		href: "/admin/signalements",
		label: "Signalements",
		description: "Erreurs remontées par les membres depuis le site",
		icon: <Flag className="h-4 w-4" />,
		section: "communaute",
	},
	{
		href: "/admin/wiki/contributions",
		label: "Contributions wiki",
		description: "Corrections proposées par les membres — à relire et publier",
		icon: <PenLine className="h-4 w-4" />,
		section: "communaute",
	},
	{
		href: "/admin/tierlists",
		label: "Tier lists",
		description: "Modérer, mettre en avant et créer des tier lists officielles",
		icon: <ListOrdered className="h-4 w-4" />,
		section: "communaute",
	},
	{
		href: "/admin/messages",
		label: "Messages",
		description: "Historique des messages importants",
		icon: <MessageSquare className="h-4 w-4" />,
		section: "communaute",
	},
	{
		href: "/admin/send",
		label: "Envoyer un message",
		description: "Diffuser un message via le bot",
		icon: <Send className="h-4 w-4" />,
		section: "communaute",
	},

	// ÉCONOMIE & PROGRESSION
	{
		href: "/admin/economy",
		label: "Économie",
		description: "Soldes, transactions, Zénies",
		icon: <Coins className="h-4 w-4" />,
		section: "economie",
	},
	{
		href: "/admin/levels",
		label: "Niveaux & XP",
		description: "Progression et paliers d'expérience",
		icon: <TrendingUp className="h-4 w-4" />,
		section: "economie",
	},
	{
		href: "/admin/shop",
		label: "Boutique",
		description: "Articles disponibles à l'achat",
		icon: <ShoppingBag className="h-4 w-4" />,
		section: "economie",
	},
	{
		href: "/admin/leaderboards",
		label: "Classements",
		description: "Meilleurs joueurs et combattants",
		icon: <Trophy className="h-4 w-4" />,
		section: "economie",
	},

	// MODÉRATION & SÉCURITÉ
	{
		href: "/admin/moderation",
		label: "Modération",
		description: "Sanctions, mutes, bans",
		icon: <Shield className="h-4 w-4" />,
		section: "moderation",
	},
	{
		href: "/admin/audit",
		label: "Journal de modération",
		description: "Historique des actions de modération",
		icon: <ClipboardList className="h-4 w-4" />,
		section: "moderation",
	},
	{
		href: "/admin/audit-internal",
		label: "Journal interne",
		description: "Logs d'audit internes du bot",
		icon: <BookMarked className="h-4 w-4" />,
		section: "moderation",
	},
	{
		href: "/admin/hierarchy",
		label: "Hiérarchie des rôles",
		description: "Rangs et rôles Discord",
		icon: <Crown className="h-4 w-4" />,
		section: "moderation",
	},
	// Une seule entrée pour une seule page. « Permissions commandes » (Modération)
	// et « Commandes Discord » (Système) menaient à deux écrans distincts qui
	// pilotaient la MÊME table `command_permissions` ; le premier était cassé.
	// Le libellé de Modération est conservé — c'est celui qu'on cherche — et il
	// pointe désormais la page qui fonctionne.
	{
		href: "/admin/commands",
		label: "Permissions commandes",
		description: "Qui peut utiliser quelle commande du bot",
		icon: <Key className="h-4 w-4" />,
		section: "moderation",
	},
];

// ---------------------------------------------------------------------------
// Configuration des sections — libellés et ordre d'affichage
// ---------------------------------------------------------------------------

type SectionConfig = {
	id: SectionId;
	label: string;
	description: string;
};

const SECTIONS: SectionConfig[] = [
	{
		id: "accueil",
		label: "Accueil & Administration",
		description: "Vue d'ensemble et réglages",
	},
	{
		id: "systeme",
		label: "Système & Technique",
		description: "Logs, tâches, services",
	},
	{
		id: "encyclopedie",
		label: "Encyclopédie Dragon Ball",
		description: "Wiki, sagas, films, jeux",
	},
	{
		id: "communaute",
		label: "Communauté & Social",
		description: "Membres, messages, événements",
	},
	{
		id: "economie",
		label: "Économie & Progression",
		description: "Niveaux, boutique, classements",
	},
	{
		id: "moderation",
		label: "Modération & Sécurité",
		description: "Sanctions, rôles, permissions",
	},
	{
		id: "contenu",
		label: "Contenu & Publication",
		description: "Articles, wiki libre",
	},
];

const SECTION_ORDER: SectionId[] = [
	"accueil",
	"systeme",
	"encyclopedie",
	"communaute",
	"economie",
	"moderation",
	"contenu",
];

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export function AdminSidebar() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false); // tiroir mobile
	const [collapsed, setCollapsed] = useState(false); // repli desktop (mode icônes)
	const [q, setQ] = useState("");

	// Restaure l'état replié depuis localStorage au montage
	useEffect(() => {
		setCollapsed(localStorage.getItem("admin-sidebar-collapsed") === "1");
	}, []);

	const toggleCollapsed = () =>
		setCollapsed((v) => {
			const next = !v;
			localStorage.setItem("admin-sidebar-collapsed", next ? "1" : "0");
			if (next) setQ(""); // la recherche est masquée en mode replié
			return next;
		});

	const filtered = useMemo(() => {
		if (!q.trim()) return ADMIN_LINKS;
		const needle = q.trim().toLowerCase();
		return ADMIN_LINKS.filter(
			(l) =>
				l.label.toLowerCase().includes(needle) ||
				l.description.toLowerCase().includes(needle) ||
				l.href.toLowerCase().includes(needle)
		);
	}, [q]);

	const grouped = useMemo(
		() =>
			SECTION_ORDER.map((id) => {
				const config = SECTIONS.find((s) => s.id === id);
				return {
					id,
					label: config?.label ?? id,
					items: filtered.filter((l) => l.section === id),
				};
			}).filter((g) => g.items.length > 0),
		[filtered]
	);

	// Une seule entrée active, même pour les routes imbriquées. Sans le match le
	// plus long, `/admin/canvas/themes` activait aussi `/admin/canvas` et les
	// sous-pages du studio allumaient plusieurs repères à la fois.
	const activeHref = useMemo(
		() =>
			ADMIN_LINKS.filter(
				(link) => pathname === link.href || pathname?.startsWith(`${link.href}/`)
			).toSorted((a, b) => b.href.length - a.href.length)[0]?.href,
		[pathname]
	);

	return (
		<>
			{/* Barre mobile — bouton d'ouverture du tiroir */}
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

			{/*
			  Desktop : sticky sous le SiteNav global (h-16) → top-16 + hauteur
			  réelle calc(100vh-4rem) avec scroll interne sur le <nav> (toutes les
			  sections restent atteignables). Repliable en mode icônes (md:w-16).
			  Mobile : tiroir plein largeur piloté par `open`.
			*/}
			<aside
				className={`${collapsed ? "md:w-16" : "md:w-72"} relative w-full shrink-0 border-b-4 md:border-b-0 md:border-r-2 border-dbz-yellow/60 bg-dbz-card hud-scanlines z-20 md:sticky md:top-16 md:h-[calc(100vh-4rem)] transition-[width] duration-200 ${
					open ? "block" : "hidden md:block"
				}`}
			>
				<div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />
				<div className="relative hud-sweep flex flex-col h-full">
					{/* En-tête HUD */}
					<div className="shrink-0 px-3 md:px-5 pt-5 pb-4 border-b border-dbz-yellow/30 hud-frame">
						{collapsed ? (
							<div className="hidden md:flex flex-col items-center gap-3">
								<span className="led" aria-hidden />
								<button
									type="button"
									onClick={toggleCollapsed}
									title="Déplier le menu"
									aria-label="Déplier le menu"
									className="flex items-center justify-center w-9 h-9 border border-dbz-yellow/30 rounded text-dbz-yellow/80 hover:border-dbz-orange hover:text-dbz-orange transition-colors"
								>
									<PanelLeftOpen className="h-5 w-5" />
								</button>
							</div>
						) : (
							<>
								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-2">
										<span className="led" aria-hidden />
										<span className="font-scouter text-[10px] tracking-[0.3em] text-dbz-yellow/90">
											PANNEAU ADMIN
										</span>
									</div>
									<button
										type="button"
										onClick={toggleCollapsed}
										title="Replier le menu"
										aria-label="Replier le menu"
										className="hidden md:inline-flex items-center justify-center w-7 h-7 border border-dbz-yellow/20 rounded text-dbz-blue-light/70 hover:border-dbz-orange hover:text-dbz-orange transition-colors"
									>
										<PanelLeftClose className="h-4 w-4" />
									</button>
								</div>
								<h2 className="mt-3 font-saiyan text-2xl leading-none text-dbz-yellow">
									DRAGON BALL
									<span className="block text-white/90">FRANCE</span>
								</h2>
								<p className="mt-1 font-scouter text-[10px] tracking-[0.25em] text-dbz-orange">
									Espace administrateur
								</p>

								{/* Champ de recherche */}
								<div className="mt-4">
									<input
										type="search"
										value={q}
										onChange={(e) => setQ(e.target.value)}
										placeholder="Rechercher une section…"
										className="w-full h-9 px-3 bg-dbz-bg/80 border border-dbz-yellow/30 focus:border-dbz-orange outline-none font-display text-[12px] text-white placeholder:text-white/50 rounded"
										aria-label="Filtrer le menu"
									/>
								</div>
							</>
						)}
					</div>

					{/* Navigation par sections — flex-1 + scroll interne */}
					<nav
						className="flex-1 overflow-y-auto px-2 md:px-3 py-4 space-y-5"
						aria-label="Navigation admin"
					>
						{grouped.length === 0 ? (
							<p className="px-2 font-display text-[12px] text-white/50">
								Aucune section ne correspond à &laquo;&nbsp;{q}&nbsp;&raquo;.
							</p>
						) : (
							grouped.map((group) => (
								<div key={group.id} className="space-y-1">
									{/* En-tête de section — masqué en mode replié */}
									{collapsed ? (
										<div className="hidden md:block mx-2 my-1 h-px bg-dbz-yellow/15" />
									) : (
										<div className="px-2 py-1 flex items-center gap-2">
											<span className="font-display font-semibold text-[11px] tracking-[0.15em] uppercase text-dbz-yellow/80">
												{group.label}
											</span>
											<span className="flex-1 h-px bg-dbz-yellow/20" />
											<span className="font-scouter text-[10px] text-dbz-blue-light/50">
												{String(group.items.length).padStart(2, "0")}
											</span>
										</div>
									)}

									{/* Liste des liens de la section */}
									<ul className="space-y-0.5">
										{group.items.map((l) => {
											const active = activeHref === l.href;
											return (
												<li key={l.href}>
													<Link
														href={l.href}
														onClick={() => setOpen(false)}
														title={collapsed ? `${l.label} — ${l.description}` : l.description}
														className={`group relative flex items-center gap-3 px-2 py-2 border-l-2 rounded-r transition-colors ${
															collapsed ? "md:justify-center md:gap-0" : ""
														} ${
															active
																? "border-dbz-orange bg-dbz-orange/15"
																: "border-transparent hover:border-dbz-orange hover:bg-dbz-orange/10"
														}`}
													>
														{/* Icône */}
														<span
															className={`flex items-center justify-center w-7 h-7 border rounded transition-colors shrink-0 ${
																active
																	? "border-dbz-orange text-dbz-orange bg-dbz-orange/10"
																	: "border-dbz-blue-light/30 text-dbz-yellow/70 bg-dbz-bg/40 group-hover:border-dbz-orange group-hover:text-dbz-orange"
															}`}
															aria-hidden
														>
															{l.icon}
														</span>

														{/* Libellé + description — masqués en mode replié (desktop) */}
														<div className={`flex-1 min-w-0 ${collapsed ? "md:hidden" : ""}`}>
															<span
																className={`block font-display font-semibold text-[13px] leading-tight transition-colors ${
																	active ? "text-white" : "text-white/85 group-hover:text-white"
																}`}
															>
																{l.label}
															</span>
															<span className="block font-display text-[10px] text-white/50 truncate mt-0.5 leading-tight">
																{l.description}
															</span>
														</div>
													</Link>
												</li>
											);
										})}
									</ul>
								</div>
							))
						)}
					</nav>

					{/* Pied de page */}
					<div className="shrink-0 px-3 md:px-5 py-4 border-t border-dbz-yellow/30 flex items-center justify-between gap-2">
						<Link
							href="/"
							title="Retour au site"
							className="font-display text-xs tracking-[0.15em] text-dbz-blue-light hover:text-dbz-orange transition-colors"
						>
							{collapsed ? <span aria-hidden>&larr;</span> : "← Retour au site"}
						</Link>
						{!collapsed && (
							<span className="font-scouter text-[9px] tracking-widest text-dbz-blue-light/50">
								{ADMIN_LINKS.length} liens
							</span>
						)}
					</div>
				</div>
			</aside>
		</>
	);
}
