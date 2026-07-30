"use client";

// Home cinématique full-page « Codex Shenron » — chaque facette du site/bot est
// un panneau plein écran avec fond animé (meilleures scènes DB en ken-burns +
// grade d'ère + grain + aura ki). Navigation molette / clavier / tactile →
// transition franche d'un panneau à l'autre (scroll-snap document + contrôleur
// JS déterministe). Tout l'affichage reflète l'état RÉEL et LIVE du bot.
//
// Contenu ÉDITABLE : sections (ordre / activation / clip de fond / textes),
// pool de clips du héro, nombre de clips flottants et cartes du terrain sont
// pilotés par la config résolue (`HomeConfig`) passée en prop — éditée depuis
// /admin/home. Sans config en DB, `getHomeConfig()` renvoie les défauts et la
// home est strictement identique à la version historique en dur.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/assets";
import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import {
	ALL_CLIP_SCENES,
	DEFAULT_PLAY_CARDS,
	type HomeConfig,
	type HomeSectionConfig,
} from "@/lib/home-scenes";
import { SECTION_ENTER_CUE } from "@/lib/home-media";
import type { BestOfSagaView } from "@/lib/home-bestof";
import type { CommunityTopsPayload } from "@/lib/community-tops";
import { CommunityTops } from "@/components/ratings/CommunityTops";
import { SceneBackdrop } from "./SceneBackdrop";
import { HomeClipField } from "./HomeClipField";
import { HomeBattleFx, type HomeBattleFxApi } from "./HomeBattleFx";
import { HomeKiAura } from "./HomeKiAura";
import { SagaBestOf } from "./SagaBestOf";
import {
	useLiveBotState,
	type BotStats,
	type PersonaLive,
	type TopMember,
	type PresenceState,
} from "./useLiveBotState";
import { DISCORD_INVITE } from "@/lib/config";
import { applyHomeFx, sfx } from "@/lib/sfx";

export interface WikiCounts {
	sagas: number;
	episodes: number;
	movies: number;
	characters: number;
	planets: number;
	chapters: number;
}
export interface HomePost {
	id: string;
	slug: string;
	title: string;
	excerpt: string | null;
	cover: string | null;
	createdAt: Date | string;
	author: { username: string | null; avatar: string | null };
}
export interface FeaturedCharacter {
	id: number;
	name: string;
	nameJa: string | null;
	race: string | null;
	ki: string | null;
	image: string | null;
}
export interface SagaTeaser {
	id: number;
	slug: string | null;
	name: string;
	series: string | null;
	description: string | null;
}

const DISCORD_URL = DISCORD_INVITE;

const GUARDIAN_ROLES: Record<string, { role: string; line: string; kanji: string }> = {
	shenron: { role: "Administration · API", line: "Exauce les vœux", kanji: "神龍" },
	beerus: { role: "Modération", line: "La destruction veille", kanji: "破壊神" },
	whis: { role: "Utilitaires · Codex", line: "L'ange qui guide", kanji: "天使" },
	"grand prêtre": { role: "Observation · Logs", line: "Le témoin suprême", kanji: "大神官" },
	enma: { role: "Tribunal des âmes", line: "Le juge de l'au-delà", kanji: "閻魔大王" },
	kaïo: { role: "Jeux · Économie", line: "Maître du Kaïō-ken", kanji: "界王" },
	kaio: { role: "Jeux · Économie", line: "Maître du Kaïō-ken", kanji: "界王" },
};
function guardianMeta(name: string) {
	const k = name.toLowerCase();
	for (const key of Object.keys(GUARDIAN_ROLES)) {
		if (k.includes(key)) return GUARDIAN_ROLES[key];
	}
	return { role: "Gardien", line: "Veille sur le serveur", kanji: "守" };
}

function formatBig(n: number): string {
	return n.toLocaleString("fr-FR");
}

// Replis a11y : jamais de libellé de nav ni de titre de section vide (surtout pour
// les sections personnalisées dont les champs sont saisis à la main).
function sectionLabel(s: HomeSectionConfig): string {
	return s.navLabel.trim() || s.title.trim() || "Section";
}
function sectionTitle(s: HomeSectionConfig): string {
	return s.title.trim() || s.navLabel.trim() || "Section";
}

const pad = (n: number): string => String(n).padStart(2, "0");

// Panthéon : pastille de statut Discord + couleur du rang (podium).
const STATUS_DOT: Record<string, string> = {
	online: "bg-emerald-400",
	idle: "bg-amber-400",
	dnd: "bg-rose-500",
};
const RANK_COLOR = ["text-amber-300", "text-slate-200", "text-orange-400"];

// ── Compteur "power level" qui s'anime quand son panneau devient actif ────────
function PowerValue({ value, active }: { value: number; active: boolean }) {
	const [shown, setShown] = useState(value);
	const fromRef = useRef(0);
	const startedRef = useRef(false);
	useEffect(() => {
		if (!active) {
			startedRef.current = false;
			return;
		}
		const reduce =
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduce) {
			setShown(value);
			return;
		}
		const from = startedRef.current ? fromRef.current : 0;
		startedRef.current = true;
		const start = performance.now();
		const dur = 1200;
		let raf = 0;
		const tick = (t: number) => {
			const p = Math.min(1, (t - start) / dur);
			const e = 1 - Math.pow(1 - p, 3);
			const cur = Math.round(from + (value - from) * e);
			setShown(cur);
			fromRef.current = cur;
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [active, value]);
	return <>{formatBig(shown)}</>;
}

export function HomeExperience({
	config,
	stats,
	personas,
	wikiCounts,
	characters,
	sagas,
	bestof = [],
	communityTops = null,
	posts,
	topMembers = [],
	presence = { total: 0, online: 0, members: [] },
}: {
	config: HomeConfig;
	stats: BotStats;
	personas: PersonaLive[];
	wikiCounts: WikiCounts;
	characters: FeaturedCharacter[];
	sagas: SagaTeaser[];
	bestof?: BestOfSagaView[];
	/** Top 3 notes communautaires (épisodes / films / jeux). */
	communityTops?: CommunityTopsPayload | null;
	posts: HomePost[];
	topMembers?: TopMember[];
	presence?: PresenceState;
}) {
	const live = useLiveBotState({ stats, personas, topMembers, presence });
	const hasNews = posts.length > 0;
	const heroScenes = config.hero.scenes;
	const fx = config.fx;
	const battleApiRef = useRef<HomeBattleFxApi | null>(null);

	// Applique volume / enable / mapping SFX dès que la config home change.
	useEffect(() => {
		applyHomeFx(fx);
	}, [fx]);

	// Sections de contenu affichées = activées en config (news requiert des posts,
	// bestof requiert des sagas assemblées côté serveur).
	// `tops` s'affiche même sans votes (empty state = incitation à noter).
	const contentSections = useMemo(
		() =>
			config.sections.filter(
				(s) =>
					s.enabled &&
					(s.id !== "news" || hasNews) &&
					(s.id !== "bestof" || bestof.length > 0) &&
					(s.id !== "tops" || communityTops != null)
			),
		[config.sections, hasNews, bestof.length, communityTops]
	);

	// Table des panneaux (héro + sections de contenu) pour la nav / le suivi.
	// Repli non vide sur les libellés : une section personnalisée dont le titre ou
	// le libellé n'a pas été rempli ne doit jamais produire un point de nav sans
	// aria-label ni un <h2> vide (a11y). L'éditeur bloque déjà l'enregistrement de
	// ces champs vides ; ceci couvre les données pré-existantes / écritures directes.
	const sections = useMemo(
		() => [
			{ id: "hero", label: "Accueil", kanji: "序" },
			...contentSections.map((s) => ({
				id: s.id,
				label: sectionLabel(s),
				kanji: s.kanji.trim() || "◆",
			})),
		],
		[contentSections]
	);

	const refs = useRef<(HTMLElement | null)[]>([]);
	const deckRef = useRef<HTMLDivElement>(null);
	const burstRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);
	// Mobile (≤640px) : plafonne le contenu du Panthéon pour tenir dans 100svh (le
	// deck hijacke le scroll → le bas d'un panneau trop haut serait inatteignable).
	const [compact, setCompact] = useState(false);
	const lockRef = useRef(false);
	const reduceRef = useRef(false);

	useEffect(() => {
		reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		document.documentElement.dataset.home = "1";
		return () => {
			delete document.documentElement.dataset.home;
		};
	}, []);

	// ── Immersion « jeu 3D » : tilt des cartes [data-tilt] + parallaxe pointeur ──
	// Un seul listener pointermove délégué (rAF-throttlé) : met à jour les vars
	// CSS --phx/--phy (parallaxe du héro) sur le deck et --rx/--ry/--gx/--gy
	// (inclinaison 3D + reflet spéculaire) sur la carte survolée. Pointeur fin +
	// motion OK uniquement — tactile et reduced-motion n'attachent rien.
	useEffect(() => {
		const root = deckRef.current;
		if (!root) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
		let raf = 0;
		let ev: PointerEvent | null = null;
		let tilted: HTMLElement | null = null;
		const resetTilt = (el: HTMLElement) => {
			el.style.removeProperty("--rx");
			el.style.removeProperty("--ry");
		};
		const apply = () => {
			raf = 0;
			const e = ev;
			if (!e) return;
			root.style.setProperty("--phx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
			root.style.setProperty("--phy", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
			const el = (e.target as HTMLElement).closest?.("[data-tilt]") as HTMLElement | null;
			if (tilted && tilted !== el) resetTilt(tilted);
			tilted = el;
			if (!el) return;
			const r = el.getBoundingClientRect();
			const px = (e.clientX - r.left) / Math.max(1, r.width);
			const py = (e.clientY - r.top) / Math.max(1, r.height);
			el.style.setProperty("--rx", `${((0.5 - py) * 9).toFixed(2)}deg`);
			el.style.setProperty("--ry", `${((px - 0.5) * 11).toFixed(2)}deg`);
			el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
			el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
		};
		const onMove = (e: PointerEvent) => {
			ev = e;
			if (!raf) raf = requestAnimationFrame(apply);
		};
		const onLeave = () => {
			if (tilted) {
				resetTilt(tilted);
				tilted = null;
			}
		};
		root.addEventListener("pointermove", onMove, { passive: true });
		root.addEventListener("pointerleave", onLeave);
		return () => {
			root.removeEventListener("pointermove", onMove);
			root.removeEventListener("pointerleave", onLeave);
			if (raf) cancelAnimationFrame(raf);
		};
	}, []);

	// Hold-to-kamehameha : appui long (~450 ms) → charge + beam ; relâchement
	// anticipé annule le son. Simple tap → micro burst CSS silencieux.
	// Gated par `fx.vfx.kameCss` (et canvas optionnel en parallèle).
	const holdRef = useRef<{
		timer: number | null;
		x: number;
		y: number;
		armed: boolean;
		fired: boolean;
		pointerId: number;
	} | null>(null);
	const kameCssOn = fx.vfx.kameCss;
	const battleCanvasOn = fx.vfx.battleCanvas;

	const onDeckPointerDown = useCallback(
		(e: React.PointerEvent) => {
			if (e.button !== 0 || reduceRef.current) return;
			const t = e.target as HTMLElement | null;
			if (t?.closest?.("a,button,input,textarea,[data-no-advance]")) return;

			sfx.unlock();
			sfx.cancelKamehameha();

			try {
				(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
			} catch {
				/* ignore */
			}

			const prev = holdRef.current;
			if (prev?.timer != null) clearTimeout(prev.timer);

			const pointerId = e.pointerId;
			const x = e.clientX;
			const y = e.clientY;
			holdRef.current = {
				timer: window.setTimeout(() => {
					const cur = holdRef.current;
					if (!cur || cur.pointerId !== pointerId) return;
					cur.armed = true;
					sfx.kamehamehaFull();
					if (kameCssOn) {
						const layer = burstRef.current;
						if (layer) {
							const b = document.createElement("span");
							b.className = "ki-burst ki-burst--kame";
							b.style.left = `${cur.x}px`;
							b.style.top = `${cur.y}px`;
							for (let i = 0; i < 10; i++) b.appendChild(document.createElement("i"));
							layer.appendChild(b);
							window.setTimeout(() => b.remove(), 1000);
						}
					}
					if (battleCanvasOn) {
						battleApiRef.current?.burst("kamehameha", cur.x, cur.y);
					}
					cur.fired = true;
				}, 450),
				x,
				y,
				armed: false,
				fired: false,
				pointerId,
			};

			if (kameCssOn) {
				const layer = burstRef.current;
				if (layer) {
					const b = document.createElement("span");
					b.className = "ki-burst";
					b.style.left = `${x}px`;
					b.style.top = `${y}px`;
					for (let i = 0; i < 4; i++) b.appendChild(document.createElement("i"));
					layer.appendChild(b);
					window.setTimeout(() => b.remove(), 600);
				}
			}
			if (battleCanvasOn) {
				battleApiRef.current?.burst("hit", x, y);
			}
		},
		[kameCssOn, battleCanvasOn]
	);

	const onDeckPointerUp = useCallback((e: React.PointerEvent) => {
		const h = holdRef.current;
		if (!h || h.pointerId !== e.pointerId) return;
		if (!h.armed && !h.fired) {
			if (h.timer != null) clearTimeout(h.timer);
			sfx.cancelKamehameha();
		}
		holdRef.current = null;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
		} catch {
			/* ignore */
		}
	}, []);

	const onDeckPointerCancel = useCallback((e: React.PointerEvent) => {
		const h = holdRef.current;
		if (!h || h.pointerId !== e.pointerId) return;
		if (h.timer != null) clearTimeout(h.timer);
		sfx.cancelKamehameha();
		holdRef.current = null;
	}, []);

	// Suit la largeur (≤640px) pour réduire le contenu du Panthéon sur mobile.
	useEffect(() => {
		const mq = window.matchMedia("(max-width: 640px)");
		const apply = () => setCompact(mq.matches);
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, []);

	// Si le nombre de sections change (édition config), borne l'index actif.
	useEffect(() => {
		setActive((a) => Math.min(a, sections.length - 1));
	}, [sections.length]);

	const goTo = useCallback(
		(i: number) => {
			const idx = Math.max(0, Math.min(sections.length - 1, i));
			const el = refs.current[idx];
			if (!el) return;
			lockRef.current = true;
			el.scrollIntoView({
				behavior: reduceRef.current ? "auto" : "smooth",
				block: "start",
			});
			setActive(idx);
			window.setTimeout(() => {
				lockRef.current = false;
			}, 650);
		},
		[sections.length]
	);

	// Clic sur le deck → panneau suivant (boucle). Rend l'expérience interactive au
	// clic en plus de la molette/tactile. Ignore les clics sur un élément interactif
	// (lien, bouton, champ, carte, points de nav) et une sélection de texte en cours.
	const onDeckClick = useCallback(
		(e: React.MouseEvent) => {
			if (lockRef.current) return;
			const t = e.target as HTMLElement;
			if (t.closest("a,button,input,select,textarea,label,[role='button'],[data-no-advance]")) {
				return;
			}
			if (window.getSelection()?.toString()) return;
			goTo((active + 1) % sections.length);
		},
		[active, sections.length, goTo]
	);

	// Suivi du panneau actif (scroll libre, ancrage, etc.)
	useEffect(() => {
		const obs = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting && e.intersectionRatio > 0.55) {
						const i = refs.current.indexOf(e.target as HTMLElement);
						if (i >= 0) setActive(i);
					}
				}
			},
			{ threshold: [0.55, 0.75] }
		);
		for (const el of refs.current) if (el) obs.observe(el);
		return () => obs.disconnect();
	}, [sections.length]);

	// SFX d'entrée de panneau (SECTION_ENTER_CUE) — désactivable via fx.sectionEnterSfx.
	const prevActiveRef = useRef<number | null>(null);
	useEffect(() => {
		if (!fx.sectionEnterSfx || !fx.enabled) {
			prevActiveRef.current = active;
			return;
		}
		if (prevActiveRef.current === null) {
			prevActiveRef.current = active;
			return; // pas de cue au premier paint
		}
		if (prevActiveRef.current === active) return;
		prevActiveRef.current = active;
		const id = sections[active]?.id ?? "hero";
		const cue = SECTION_ENTER_CUE[id] ?? "teleport";
		sfx.unlock();
		const play = sfx[cue as keyof typeof sfx];
		if (typeof play === "function") (play as () => void)();
	}, [active, sections, fx.sectionEnterSfx, fx.enabled]);

	// Molette → une section par geste avec boucle infinie cyclique
	useEffect(() => {
		const onWheel = (e: WheelEvent) => {
			if (Math.abs(e.deltaY) < 12) return;
			if (lockRef.current) {
				e.preventDefault();
				return;
			}
			const dir = e.deltaY > 0 ? 1 : -1;
			const target = (active + dir + sections.length) % sections.length;
			e.preventDefault();
			goTo(target);
		};
		window.addEventListener("wheel", onWheel, { passive: false });
		return () => window.removeEventListener("wheel", onWheel);
	}, [active, sections.length, goTo]);

	// Clavier avec boucle infinie cyclique
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			switch (e.key) {
				case "ArrowDown":
				case "PageDown":
				case " ":
				case "j":
					e.preventDefault();
					goTo((active + 1) % sections.length);
					break;
				case "ArrowUp":
				case "PageUp":
				case "k":
					e.preventDefault();
					goTo((active - 1 + sections.length) % sections.length);
					break;
				case "Home":
					e.preventDefault();
					goTo(0);
					break;
				case "End":
					e.preventDefault();
					goTo(sections.length - 1);
					break;
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [active, sections.length, goTo]);

	// Tactile (swipe vertical avec boucle infinie cyclique)
	useEffect(() => {
		let startY = 0;
		const onStart = (e: TouchEvent) => {
			startY = e.touches[0]?.clientY ?? 0;
		};
		const onEnd = (e: TouchEvent) => {
			if (lockRef.current) return;
			const dy = startY - (e.changedTouches[0]?.clientY ?? startY);
			if (Math.abs(dy) > 64) {
				const dir = dy > 0 ? 1 : -1;
				goTo((active + dir + sections.length) % sections.length);
			}
		};
		window.addEventListener("touchstart", onStart, { passive: true });
		window.addEventListener("touchend", onEnd, { passive: true });
		return () => {
			window.removeEventListener("touchstart", onStart);
			window.removeEventListener("touchend", onEnd);
		};
	}, [active, sections.length, goTo]);

	// Rotation lente des scènes héro (crossfade)
	const [heroIdx, setHeroIdx] = useState(0);
	useEffect(() => {
		if (active !== 0 || reduceRef.current || heroScenes.length <= 1) return;
		const id = setInterval(() => setHeroIdx((i) => (i + 1) % heroScenes.length), 6200);
		return () => clearInterval(id);
	}, [active, heroScenes.length]);
	// Borne l'index héro si le pool a rétréci après édition.
	useEffect(() => {
		setHeroIdx((i) => (i < heroScenes.length ? i : 0));
	}, [heroScenes.length]);

	const activeScene =
		active === 0
			? (heroScenes[heroIdx] ?? heroScenes[0])
			: (contentSections[active - 1]?.scene ?? heroScenes[0]);

	const setRef = (i: number) => (el: HTMLElement | null) => {
		refs.current[i] = el;
	};

	// Contenu propre à chaque section (rendu sous l'en-tête générique).
	const renderBody = (cfg: HomeSectionConfig) => {
		// Section personnalisée : corps riche rendu comme le wiki via WikiMarkdown
		// (sanitizer « contrôle total du design » — média/embeds/HTML/CSS inline
		// autorisés, seul le JS est bloqué ; rédacteur = admin de confiance). L'en-tête
		// (eyebrow/titre/sous-titre) est rendu par la coque générique ; un corps vide
		// affiche donc juste l'en-tête (pas de panneau cassé, pas de crash).
		if (cfg.isCustom) {
			const body = cfg.body?.trim();
			if (!body) return null;
			return (
				<div className="reveal-up home-custom-body mx-auto max-w-2xl text-left leading-relaxed text-white/80">
					<WikiMarkdown body={body} />
				</div>
			);
		}
		switch (cfg.id) {
			case "pantheon":
				return (
					<div className="grid gap-5 reveal-up lg:grid-cols-5">
						{/* Top membres (classement live) */}
						<div className="lg:col-span-3">
							<ol className="flex flex-col gap-1.5">
								{live.topMembers.slice(0, compact ? 6 : 10).map((m) => (
									<li key={m.discordId}>
										<div
											className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors ${
												m.rank <= 3
													? "border-[var(--accent)]/40 bg-[var(--accent)]/10"
													: "border-white/10 bg-black/30"
											}`}
										>
											<span
												className={`w-6 shrink-0 text-center text-sm font-black ${
													m.rank <= 3 ? RANK_COLOR[m.rank - 1] : "text-white/40"
												}`}
											>
												{m.rank}
											</span>
											{m.avatarUrl ? (
												<img
													src={m.avatarUrl}
													alt=""
													width={36}
													height={36}
													loading="lazy"
													className="h-9 w-9 shrink-0 rounded-full border border-white/15 object-cover"
												/>
											) : (
												<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-bold text-white/60">
													{(m.username ?? "?").charAt(0).toUpperCase()}
												</span>
											)}
											<span className="min-w-0 flex-1">
												<span className="block truncate text-[13px] font-bold leading-tight text-white">
													{m.username ?? "Guerrier anonyme"}
												</span>
												<span className="block text-[10px] uppercase tracking-[0.12em] text-white/45">
													Niveau {m.level}
												</span>
											</span>
											<span className="shrink-0 text-right text-[12px] font-semibold text-[var(--accent)]">
												{formatBig(m.xp)} XP
											</span>
										</div>
									</li>
								))}
								{live.topMembers.length === 0 && (
									<li className="text-[13px] text-white/40">Classement momentanément indisponible.</li>
								)}
							</ol>
							<Link href="/leaderboard" className="home-cta home-cta--ghost mt-3">
								Tout le classement
							</Link>
						</div>

						{/* Membres connectés maintenant */}
						<aside className="lg:col-span-2">
							<div className="rounded-2xl border border-white/10 bg-black/40 p-4">
								<div className="flex items-baseline justify-between">
									<span className="text-[13px] font-bold text-white">Connectés maintenant</span>
									<span className="text-[12px] tabular-nums text-white/50">
										{live.presence.online}
										{live.presence.total > 0 ? ` / ${formatBig(live.presence.total)}` : ""}
									</span>
								</div>
								{live.presence.members.length > 0 ? (
									<ul className="mt-3 grid grid-cols-5 gap-2.5 sm:grid-cols-6 lg:grid-cols-5">
										{live.presence.members.slice(0, compact ? 10 : 20).map((u) => (
											<li
												key={u.id}
												className="flex flex-col items-center gap-1"
												title={`${u.username} · ${u.status}`}
											>
												<span className="relative">
													<img
														src={u.avatarUrl}
														alt=""
														width={40}
														height={40}
														loading="lazy"
														className="h-10 w-10 rounded-full border border-white/15 object-cover"
													/>
													<span
														className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black ${
															STATUS_DOT[u.status] ?? "bg-white/40"
														}`}
													/>
												</span>
												<span className="w-full truncate text-center text-[9px] leading-tight text-white/55">
													{u.username}
												</span>
											</li>
										))}
									</ul>
								) : (
									<p className="mt-3 text-[12px] text-white/45">
										{live.presence.online > 0
											? `${live.presence.online} guerrier(s) en ligne sur le serveur.`
											: "Aucun guerrier en ligne pour l'instant."}
									</p>
								)}
								<a
									href={DISCORD_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="home-cta home-cta--ghost mt-4"
								>
									Rejoindre le serveur
								</a>
							</div>
						</aside>
					</div>
				);

			case "universe":
				return (
					<div className="home-grid-stats">
						{[
							// href null → tuile non cliquable en bêta (route /wiki fermée) ; le compteur reste.
							{ k: "characters", label: "Personnages", href: null },
							{ k: "planets", label: "Planètes", href: null },
							{ k: "sagas", label: "Sagas", href: null },
							{ k: "episodes", label: "Épisodes", href: "/wiki/episodes" },
							{ k: "movies", label: "Films", href: "/wiki/films" },
							{ k: "chapters", label: "Chapitres", href: "/wiki/manga" },
						].map((t) => {
							const inner = (
								<>
									<span className="home-stat-tile__num">
										<PowerValue
											value={wikiCounts[t.k as keyof WikiCounts] ?? 0}
											active={active === sections.findIndex((s) => s.id === cfg.id)}
										/>
									</span>
									<span className="home-stat-tile__label">{t.label}</span>
								</>
							);
							return t.href ? (
								<Link key={t.k} href={t.href} data-tilt className="home-stat-tile reveal-up">
									{inner}
								</Link>
							) : (
								<div key={t.k} className="home-stat-tile home-stat-tile--static reveal-up">
									{inner}
								</div>
							);
						})}
					</div>
				);

			case "personnages":
				return (
					<>
						<div className="grid grid-cols-3 gap-3 reveal-up sm:grid-cols-4 lg:grid-cols-6">
							{characters.map((c) => (
								<Link
									key={c.id}
									href={`/wiki/dragon-ball/character/${c.id}`}
									data-tilt
									className="group relative block aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-black/30 transition-colors hover:border-[var(--accent)]"
								>
									{c.image && (
										<img
											src={assetUrl(c.image)}
											alt={c.name}
											loading="lazy"
											className="absolute inset-0 h-full w-full object-cover object-top opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
										/>
									)}
									<span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-2.5 pb-2.5 pt-10">
										<span className="block text-[13px] font-bold leading-tight text-white">
											{c.name}
										</span>
										{c.race && (
											<span className="mt-0.5 block text-[9px] uppercase tracking-[0.14em] text-white/55">
												{c.race}
											</span>
										)}
									</span>
								</Link>
							))}
						</div>
						<Link href="/wiki/personnages" className="home-cta home-cta--ghost">
							Tous les personnages
						</Link>
					</>
				);

			case "bestof":
				return (
					<SagaBestOf
						sagas={bestof}
						active={active === sections.findIndex((s) => s.id === cfg.id)}
						compact={compact}
					/>
				);

			case "tops":
				return communityTops ? (
					<CommunityTops data={communityTops} compact={compact} showHeader={false} />
				) : null;

			case "sagas":
				return (
					<>
						<div className="grid gap-4 reveal-up sm:grid-cols-2 lg:grid-cols-4">
							{sagas.map((s) => (
								<Link
									key={s.id}
									href="/wiki/sagas"
									data-tilt
									className="group flex flex-col gap-1.5 rounded-xl border border-white/10 bg-black/30 p-4 transition-colors hover:border-[var(--accent)]"
								>
									{s.series && (
										<span className="text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
											{s.series}
										</span>
									)}
									<span className="text-[15px] font-bold leading-tight text-white">{s.name}</span>
									{s.description && (
										<span className="line-clamp-3 text-[12px] leading-snug text-white/55">
											{s.description}
										</span>
									)}
								</Link>
							))}
						</div>
						<Link href="/wiki/sagas" className="home-cta home-cta--ghost">
							Toutes les sagas
						</Link>
					</>
				);

			case "guardians":
				return (
					<div className="home-guardians">
						{live.personas.map((p) => {
							const m = guardianMeta(p.name);
							const src = assetUrl(p.avatarUrl ?? p.avatar ?? "");
							return (
								<article key={p.id} data-tilt className="home-guardian reveal-up">
									<span className="home-guardian__kanji" aria-hidden>
										{m.kanji}
									</span>
									<span className="home-guardian__avatar">
										{src ? (
											<Image src={src} alt={p.name} width={72} height={72} className="object-cover" />
										) : null}
										<span
											className={`home-guardian__status ${p.online ? "is-on" : ""}`}
											title={p.online ? "En ligne" : "Hors ligne"}
										/>
									</span>
									<span className="home-guardian__name">{p.name}</span>
									<span className="home-guardian__role">{m.role}</span>
									<span className="home-guardian__line">{m.line}</span>
								</article>
							);
						})}
					</div>
				);

			case "community":
				return (
					<>
						<div className="home-power-grid">
							{[
								{ v: live.stats.users, label: "Guerriers", suffix: "" },
								{ v: live.stats.totalXp, label: "XP cumulé", suffix: "" },
								{ v: live.stats.totalZeni, label: "Zénis en circulation", suffix: "₽" },
								{ v: live.stats.achievementsUnlocked, label: "Succès débloqués", suffix: "" },
							].map((s) => (
								<div key={s.label} className="home-power reveal-up">
									<span className="home-power__num">
										<PowerValue
											value={s.v}
											active={active === sections.findIndex((x) => x.id === cfg.id)}
										/>
										{s.suffix}
									</span>
									<span className="home-power__label">{s.label}</span>
								</div>
							))}
						</div>
						{live.events.length > 0 && (
							<ul className="home-feed" aria-live="polite">
								{live.events.map((ev) => (
									<li key={ev.key} className="home-feed__item">
										<span className="home-feed__dot" />
										{ev.label}
									</li>
								))}
							</ul>
						)}
					</>
				);

			case "play":
				return (
					<div className="home-cards">
						{(cfg.cards ?? DEFAULT_PLAY_CARDS).map((c) => (
							<Link key={c.href + c.title} href={c.href} data-tilt className="home-card reveal-up">
								<span className="home-card__kanji" aria-hidden>
									{c.kanji}
								</span>
								<span className="home-card__title">{c.title}</span>
								<span className="home-card__desc">{c.desc}</span>
								<span className="home-card__arrow" aria-hidden>
									→
								</span>
							</Link>
						))}
					</div>
				);

			case "news":
				return (
					<>
						<div className="home-news">
							{posts.slice(0, 3).map((p) => (
								<Link key={p.id} href={`/post/${p.slug}`} data-tilt className="home-news__item reveal-up">
									{p.cover && (
										<span className="home-news__cover">
											<Image
												src={assetUrl(p.cover)}
												alt=""
												width={420}
												height={236}
												className="object-cover"
											/>
										</span>
									)}
									<span className="home-news__title">{p.title}</span>
									{p.excerpt && <span className="home-news__excerpt">{p.excerpt}</span>}
								</Link>
							))}
						</div>
						<Link href="/actualites" className="home-cta home-cta--ghost">
							Toutes les actualités
						</Link>
					</>
				);

			default:
				return null;
		}
	};

	// Élément dynamique injecté dans le sous-titre de certaines sections (pills live).
	const headerExtra = (id: string) => {
		if (id === "pantheon") {
			return (
				<span className={`home-live-pill ${live.presence.online > 0 ? "is-on" : ""}`}>
					<span className="home-live-dot is-on" />
					{live.presence.online} en ligne
				</span>
			);
		}
		if (id === "guardians") {
			return (
				<>
					{" — "}
					<strong>{live.onlineCount}/6 en ligne</strong> à cet instant.
				</>
			);
		}
		if (id === "community") {
			return (
				<span className={`home-live-pill ${live.connected ? "is-on" : ""}`}>
					<span className="home-live-dot is-on" />
					{live.connected ? "Flux en direct" : "Synchronisé"}
				</span>
			);
		}
		return null;
	};

	const activeAccent = activeScene?.accent ?? "oklch(0.78 0.17 65)";

	return (
		<div
			ref={deckRef}
			className="home-deck"
			data-scene-aura={fx.vfx.sceneAura ? "on" : "off"}
			onClick={onDeckClick}
			onPointerDown={onDeckPointerDown}
			onPointerUp={onDeckPointerUp}
			onPointerCancel={onDeckPointerCancel}
			style={{ ["--accent" as string]: activeAccent }}
		>
			{/* Couche des bursts de ki (clics) — fixe, au-dessus de tout, inerte */}
			{fx.vfx.kameCss && <div ref={burstRef} className="ki-burst-layer" aria-hidden />}
			{fx.vfx.battleCanvas && (
				<HomeBattleFx apiRef={battleApiRef} accent={activeAccent} />
			)}
			{fx.vfx.kiAura && (
				<div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
					<HomeKiAura accent={activeAccent} active />
				</div>
			)}

			{/* Navigation latérale — points HUD scouter */}
			<nav className="home-dots" aria-label="Sections de la page">
				{sections.map((s, i) => (
					<button
						key={s.id}
						type="button"
						onClick={() => goTo(i)}
						aria-current={active === i ? "true" : undefined}
						aria-label={s.label}
						className={`home-dot ${active === i ? "home-dot--on" : ""}`}
					>
						<span className="home-dot__kanji">{s.kanji}</span>
						<span className="home-dot__label">{s.label}</span>
					</button>
				))}
			</nav>

			{/* Compteur de panneaux */}
			<div className="home-counter" aria-hidden>
				<span className="home-counter__cur">{pad(active + 1)}</span>
				<span className="home-counter__sep">/</span>
				<span>{pad(sections.length)}</span>
			</div>

			{/* ── HÉRO ─────────────────────────────────────────────────────────── */}
			<section ref={setRef(0)} id="hero" className="home-section home-hero" aria-label="Accueil">
				<div className="absolute inset-0">
					{heroScenes.map((sc, i) => {
						// Fenêtrage : ne monter que la scène active et ses voisines ±1 (le
						// crossfade n'a besoin que de la précédente et de la suivante).
						const len = heroScenes.length;
						const near =
							i === heroIdx || i === (heroIdx + 1) % len || i === (heroIdx - 1 + len) % len;
						if (!near) return null;
						return (
							<SceneBackdrop
								key={`${sc.id}-${i}`}
								scene={sc}
								active={active === 0 && i === heroIdx}
								visible={i === heroIdx}
								priority={i === 0}
							/>
						);
					})}
				</div>
				{/* Clips qui dérivent à travers le héro : piochés ALÉATOIREMENT dans TOUT
				    le pool vidéo (pas seulement les scènes du héro). Nombre piloté par la config. */}
				<HomeClipField
					scenes={ALL_CLIP_SCENES}
					active={active === 0}
					maxDesktop={config.clips.desktop}
					maxTablet={config.clips.tablet}
				/>
				<div className="home-hero__content reveal-up">
					<p className="home-kicker">
						<span className="home-kicker__jp">ドラゴンボール</span>
						<span className="home-kicker__live">
							<span className={`home-live-dot ${live.onlineCount > 0 ? "is-on" : ""}`} />
							{live.onlineCount}/6 gardiens en ligne
						</span>
					</p>
					<h1 className="home-wordmark">
						<span>Dragon&nbsp;Ball</span>
						<em>France</em>
					</h1>
					<p className="home-lede">{config.hero.lede}</p>
					<div className="home-cta-row">
						<Link href={config.hero.ctaHref} className="home-cta home-cta--primary">
							{config.hero.ctaLabel}
						</Link>
						<a
							href={DISCORD_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="home-cta home-cta--ghost"
						>
							Rejoindre le serveur
						</a>
					</div>
				</div>
				<div className="home-hero__caption" aria-hidden>
					<span className="home-hero__caption-kicker">{activeScene?.kicker}</span>
					<span className="home-hero__caption-title">{activeScene?.title}</span>
				</div>
				<button
					type="button"
					className="home-scroll-hint"
					onClick={() => goTo(1)}
					aria-label="Section suivante"
				>
					<span>Défiler</span>
					<span className="home-scroll-hint__arrow" />
				</button>
			</section>

			{/* ── SECTIONS DE CONTENU (ordre / activation / fond / textes = config) ── */}
			{contentSections.map((cfg, i) => {
				const navIdx = i + 1;
				const subtitle = cfg.subtitle;
				const extra = headerExtra(cfg.id);
				return (
					<section
						key={cfg.id}
						ref={setRef(navIdx)}
						id={cfg.id}
						className="home-section"
						aria-label={sectionLabel(cfg)}
					>
						<SceneBackdrop scene={cfg.scene} active={active === navIdx} />
						<div className="home-panel">
							<header className="home-panel__head reveal-up">
								<span className="home-eyebrow">
									{pad(navIdx)} — {cfg.eyebrow}
								</span>
								<h2 className="home-title">{sectionTitle(cfg)}</h2>
								{(subtitle || extra) && (
									<p className="home-sub">
										{subtitle}
										{extra}
									</p>
								)}
							</header>
							{renderBody(cfg)}
						</div>
					</section>
				);
			})}
		</div>
	);
}
