"use client";

// Home cinématique full-page « Codex Shenron » — chaque facette du site/bot est
// un panneau plein écran avec fond animé (meilleures scènes DB en ken-burns +
// grade d'ère + grain + aura ki). Navigation molette / clavier / tactile →
// transition franche d'un panneau à l'autre (scroll-snap document + contrôleur
// JS déterministe). Tout l'affichage reflète l'état RÉEL et LIVE du bot.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/assets";
import { HERO_SCENES, SECTION_SCENE } from "@/lib/home-scenes";
import { SceneBackdrop } from "./SceneBackdrop";
import {
	useLiveBotState,
	type BotStats,
	type PersonaLive,
} from "./useLiveBotState";

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

const DISCORD_URL = "https://discord.gg/dbfr";

const GUARDIAN_ROLES: Record<
	string,
	{ role: string; line: string; kanji: string }
> = {
	shenron: { role: "Administration · API", line: "Exauce les vœux", kanji: "神龍" },
	beerus: { role: "Modération", line: "La destruction veille", kanji: "破壊神" },
	whis: { role: "Utilitaires · Wiki", line: "L'ange qui guide", kanji: "天使" },
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

const PLAY_CARDS = [
	{ href: "/jeux", title: "Mini-jeux", desc: "2048, Pierre-Feuille-Ciseaux, Morpion, Pendu, Bingo", kanji: "遊" },
	{ href: "/shop", title: "Boutique zéni", desc: "Rôles, bannières, cartes, fusions", kanji: "商" },
	{ href: "/leaderboard", title: "Classement", desc: "Les guerriers les plus puissants", kanji: "番付" },
	{ href: "/profil", title: "Ta carte de combat", desc: "Niveau, XP, succès, inventaire", kanji: "戦士" },
];

function formatBig(n: number): string {
	return n.toLocaleString("fr-FR");
}

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
	stats,
	personas,
	wikiCounts,
	posts,
}: {
	stats: BotStats;
	personas: PersonaLive[];
	wikiCounts: WikiCounts;
	posts: HomePost[];
}) {
	const live = useLiveBotState({ stats, personas });
	const hasNews = posts.length > 0;

	const sections = useMemo(
		() =>
			[
				{ id: "hero", label: "Accueil", kanji: "序" },
				{ id: "universe", label: "L'univers", kanji: "宇宙" },
				{ id: "guardians", label: "Les gardiens", kanji: "神" },
				{ id: "community", label: "Communauté", kanji: "仲間" },
				{ id: "play", label: "Le terrain", kanji: "遊" },
				...(hasNews ? [{ id: "news", label: "Actualités", kanji: "報" }] : []),
				{ id: "summon", label: "Invoquer", kanji: "願" },
			] as const,
		[hasNews],
	);

	const refs = useRef<(HTMLElement | null)[]>([]);
	const [active, setActive] = useState(0);
	const lockRef = useRef(false);
	const reduceRef = useRef(false);

	useEffect(() => {
		reduceRef.current = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		document.documentElement.dataset.home = "1";
		return () => {
			delete document.documentElement.dataset.home;
		};
	}, []);

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
		[sections.length],
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
			{ threshold: [0.55, 0.75] },
		);
		for (const el of refs.current) if (el) obs.observe(el);
		return () => obs.disconnect();
	}, [sections.length]);

	// Molette → une section par geste (libère aux extrémités pour nav/footer)
	useEffect(() => {
		const onWheel = (e: WheelEvent) => {
			if (Math.abs(e.deltaY) < 12) return;
			if (lockRef.current) {
				e.preventDefault();
				return;
			}
			const dir = e.deltaY > 0 ? 1 : -1;
			const target = active + dir;
			if (target < 0 || target >= sections.length) return; // bord → natif
			e.preventDefault();
			goTo(target);
		};
		window.addEventListener("wheel", onWheel, { passive: false });
		return () => window.removeEventListener("wheel", onWheel);
	}, [active, sections.length, goTo]);

	// Clavier
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
					goTo(active + 1);
					break;
				case "ArrowUp":
				case "PageUp":
				case "k":
					e.preventDefault();
					goTo(active - 1);
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

	// Tactile (swipe vertical)
	useEffect(() => {
		let startY = 0;
		const onStart = (e: TouchEvent) => {
			startY = e.touches[0]?.clientY ?? 0;
		};
		const onEnd = (e: TouchEvent) => {
			if (lockRef.current) return;
			const dy = startY - (e.changedTouches[0]?.clientY ?? startY);
			if (Math.abs(dy) > 64) goTo(active + (dy > 0 ? 1 : -1));
		};
		window.addEventListener("touchstart", onStart, { passive: true });
		window.addEventListener("touchend", onEnd, { passive: true });
		return () => {
			window.removeEventListener("touchstart", onStart);
			window.removeEventListener("touchend", onEnd);
		};
	}, [active, goTo]);

	// Rotation lente des scènes héro (crossfade)
	const [heroIdx, setHeroIdx] = useState(0);
	useEffect(() => {
		if (active !== 0 || reduceRef.current) return;
		const id = setInterval(
			() => setHeroIdx((i) => (i + 1) % HERO_SCENES.length),
			6200,
		);
		return () => clearInterval(id);
	}, [active]);

	const activeScene =
		active === 0
			? HERO_SCENES[heroIdx]
			: SECTION_SCENE[sections[active]?.id ?? "summon"] ?? HERO_SCENES[0];

	const setRef = (i: number) => (el: HTMLElement | null) => {
		refs.current[i] = el;
	};
	const idx = (id: string) => sections.findIndex((s) => s.id === id);

	return (
		<div
			className="home-deck"
			style={{ ["--accent" as string]: activeScene?.accent }}
		>
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
				<span className="home-counter__cur">
					{String(active + 1).padStart(2, "0")}
				</span>
				<span className="home-counter__sep">/</span>
				<span>{String(sections.length).padStart(2, "0")}</span>
			</div>

			{/* ── 1. HÉRO ─────────────────────────────────────────────────────── */}
			<section
				ref={setRef(0)}
				id="hero"
				className="home-section home-hero"
				aria-label="Accueil"
			>
				<div className="absolute inset-0">
					{HERO_SCENES.map((sc, i) => (
						<SceneBackdrop
							key={sc.id}
							scene={sc}
							active={active === 0 && i === heroIdx}
							visible={i === heroIdx}
							priority={i === 0}
						/>
					))}
				</div>
				<div className="home-hero__content reveal-up">
					<p className="home-kicker">
						<span className="home-kicker__jp">ドラゴンボール</span>
						<span className="home-kicker__live">
							<span
								className={`home-live-dot ${live.onlineCount > 0 ? "is-on" : ""}`}
							/>
							{live.onlineCount}/6 gardiens en ligne
						</span>
					</p>
					<h1 className="home-wordmark">
						<span>Dragon&nbsp;Ball</span>
						<em>France</em>
					</h1>
					<p className="home-lede">
						Le portail canon de l'univers Dragon Ball — wiki vivant,
						six divinités sur Discord, et la communauté francophone réunie
						en un seul lieu.
					</p>
					<div className="home-cta-row">
						<Link href="/wiki" className="home-cta home-cta--primary">
							Explorer le wiki
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
					<span className="home-hero__caption-kicker">
						{activeScene?.kicker}
					</span>
					<span className="home-hero__caption-title">
						{activeScene?.title}
					</span>
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

			{/* ── 2. L'UNIVERS (wiki, chiffres réels) ──────────────────────────── */}
			<section
				ref={setRef(idx("universe"))}
				id="universe"
				className="home-section"
				aria-label="L'univers"
			>
				<SceneBackdrop scene={SECTION_SCENE.universe} active={active === idx("universe")} />
				<div className="home-panel">
					<header className="home-panel__head reveal-up">
						<span className="home-eyebrow">01 — L'anthologie</span>
						<h2 className="home-title">Tout l'univers, sourcé&nbsp;canon</h2>
						<p className="home-sub">
							Personnages, planètes, sagas, épisodes, films et chapitres —
							une base de données vérifiée, en lien avec les ayants droit.
						</p>
					</header>
					<div className="home-grid-stats">
						{[
							{ k: "characters", label: "Personnages", href: "/wiki/dragon-ball" },
							{ k: "planets", label: "Planètes", href: "/wiki" },
							{ k: "sagas", label: "Sagas", href: "/wiki/sagas" },
							{ k: "episodes", label: "Épisodes", href: "/wiki/episodes" },
							{ k: "movies", label: "Films", href: "/wiki/films" },
							{ k: "chapters", label: "Chapitres", href: "/wiki/manga" },
						].map((t) => (
							<Link key={t.k} href={t.href} className="home-stat-tile reveal-up">
								<span className="home-stat-tile__num">
									<PowerValue
										value={wikiCounts[t.k as keyof WikiCounts] ?? 0}
										active={active === idx("universe")}
									/>
								</span>
								<span className="home-stat-tile__label">{t.label}</span>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* ── 3. LES GARDIENS (6 personas, statut live) ────────────────────── */}
			<section
				ref={setRef(idx("guardians"))}
				id="guardians"
				className="home-section"
				aria-label="Les gardiens"
			>
				<SceneBackdrop scene={SECTION_SCENE.guardians} active={active === idx("guardians")} />
				<div className="home-panel">
					<header className="home-panel__head reveal-up">
						<span className="home-eyebrow">02 — Le bot</span>
						<h2 className="home-title">Six gardiens, un seul process</h2>
						<p className="home-sub">
							Six personas Discord, six personnalités, une seule machine —
							{" "}
							<strong>{live.onlineCount}/6 en ligne</strong> à cet instant.
						</p>
					</header>
					<div className="home-guardians">
						{live.personas.map((p) => {
							const m = guardianMeta(p.name);
							const src = assetUrl(p.avatarUrl ?? p.avatar ?? "");
							return (
								<article key={p.id} className="home-guardian reveal-up">
									<span className="home-guardian__kanji" aria-hidden>
										{m.kanji}
									</span>
									<span className="home-guardian__avatar">
										{src ? (
											<Image
												src={src}
												alt={p.name}
												width={72}
												height={72}
												className="object-cover"
											/>
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
				</div>
			</section>

			{/* ── 4. LA COMMUNAUTÉ (stats live + flux SSE) ─────────────────────── */}
			<section
				ref={setRef(idx("community"))}
				id="community"
				className="home-section"
				aria-label="Communauté"
			>
				<SceneBackdrop scene={SECTION_SCENE.community} active={active === idx("community")} />
				<div className="home-panel">
					<header className="home-panel__head reveal-up">
						<span className="home-eyebrow">03 — La communauté</span>
						<h2 className="home-title">Des milliers de guerriers</h2>
						<p className="home-sub">
							Chiffres réels, mis à jour en direct depuis le bot.
							<span className={`home-live-pill ${live.connected ? "is-on" : ""}`}>
								<span className="home-live-dot is-on" />
								{live.connected ? "Flux en direct" : "Synchronisé"}
							</span>
						</p>
					</header>
					<div className="home-power-grid">
						{[
							{ v: live.stats.users, label: "Guerriers", suffix: "" },
							{ v: live.stats.totalXp, label: "XP cumulé", suffix: "" },
							{ v: live.stats.totalZeni, label: "Zénis en circulation", suffix: "₽" },
							{ v: live.stats.achievementsUnlocked, label: "Succès débloqués", suffix: "" },
						].map((s) => (
							<div key={s.label} className="home-power reveal-up">
								<span className="home-power__num">
									<PowerValue value={s.v} active={active === idx("community")} />
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
				</div>
			</section>

			{/* ── 5. LE TERRAIN (jeux / shop / classement) ─────────────────────── */}
			<section
				ref={setRef(idx("play"))}
				id="play"
				className="home-section"
				aria-label="Le terrain"
			>
				<SceneBackdrop scene={SECTION_SCENE.play} active={active === idx("play")} />
				<div className="home-panel">
					<header className="home-panel__head reveal-up">
						<span className="home-eyebrow">04 — Le terrain</span>
						<h2 className="home-title">Combats, économie, fusions</h2>
						<p className="home-sub">
							Le bot transforme le serveur en terrain de jeu : gagne de l'XP,
							dépense tes zénis, grimpe au classement.
						</p>
					</header>
					<div className="home-cards">
						{PLAY_CARDS.map((c) => (
							<Link key={c.href} href={c.href} className="home-card reveal-up">
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
				</div>
			</section>

			{/* ── 6. ACTUALITÉS (optionnel) ────────────────────────────────────── */}
			{hasNews && (
				<section
					ref={setRef(idx("news"))}
					id="news"
					className="home-section"
					aria-label="Actualités"
				>
					<SceneBackdrop scene={SECTION_SCENE.summon} active={active === idx("news")} />
					<div className="home-panel">
						<header className="home-panel__head reveal-up">
							<span className="home-eyebrow">05 — Actualités</span>
							<h2 className="home-title">Les dernières nouvelles</h2>
						</header>
						<div className="home-news">
							{posts.slice(0, 3).map((p) => (
								<Link
									key={p.id}
									href={`/post/${p.slug}`}
									className="home-news__item reveal-up"
								>
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
									{p.excerpt && (
										<span className="home-news__excerpt">{p.excerpt}</span>
									)}
								</Link>
							))}
						</div>
						<Link href="/actualites" className="home-cta home-cta--ghost">
							Toutes les actualités
						</Link>
					</div>
				</section>
			)}

			{/* ── 7. INVOCATION (CTA final) ────────────────────────────────────── */}
			<section
				ref={setRef(sections.length - 1)}
				id="summon"
				className="home-section home-summon"
				aria-label="Invoquer"
			>
				<SceneBackdrop scene={SECTION_SCENE.summon} active={active === sections.length - 1} priority={false} />
				<div className="home-summon__content reveal-up">
					<span className="home-summon__kanji" aria-hidden>
						神龍
					</span>
					<h2 className="home-summon__title">
						Invoque Shenron.
						<br />
						Fais ton vœu.
					</h2>
					<p className="home-sub">
						Rejoins {formatBig(live.stats.users)} guerriers sur le serveur
						Discord, ou plonge dans le wiki le plus complet en français.
					</p>
					<div className="home-cta-row">
						<a
							href={DISCORD_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="home-cta home-cta--primary"
						>
							Rejoindre le Discord
						</a>
						<Link href="/wiki" className="home-cta home-cta--ghost">
							Ouvrir le wiki
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
