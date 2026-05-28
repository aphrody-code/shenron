"use client";

/**
 * Palette de commande ⌘K — recherche globale du wiki.
 *
 * Ouvre via ⌘K / Ctrl+K (ou le bouton de la nav), tape pour chercher en direct
 * dans `/api/search` (debounce + AbortController). Les résultats viennent déjà
 * filtrés et rankés par Postgres (pg_trgm) → on coupe le filtrage interne de
 * cmdk (`shouldFilter={false}`) pour ne rien re-masquer.
 *
 * Client-only : utilise `@/lib/assets` (jamais db-universe, server-only) pour
 * les vignettes ; le type `SearchResults` est importé en `import type` (effacé
 * au build, donc n'embarque pas postgres dans le bundle).
 */
import { assetUrl } from "@/lib/assets";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// Miroir client de la forme renvoyée par `/api/search` (= `SearchResults` de
// db-universe). Défini localement pour ne pas importer le module server-only
// (postgres) dans le bundle client, même en `import type`.
type SearchResults = {
	q: string;
	characters: Array<{
		id: number;
		name: string;
		name_ja: string | null;
		image: string | null;
		race: string | null;
	}>;
	planets: Array<{
		id: number;
		name: string;
		name_ja: string | null;
		image: string | null;
	}>;
	sagas: Array<{
		id: number;
		slug: string;
		name: string;
		name_ja: string | null;
		series: string | null;
	}>;
	movies: Array<{
		id: number;
		slug: string;
		title: string;
		title_ja: string | null;
		series: string | null;
	}>;
	games: Array<{
		id: number;
		slug: string;
		title: string;
		title_ja: string | null;
	}>;
};

const EMPTY: SearchResults = {
	q: "",
	characters: [],
	planets: [],
	sagas: [],
	movies: [],
	games: [],
};

function count(r: SearchResults): number {
	return (
		r.characters.length +
		r.planets.length +
		r.sagas.length +
		r.movies.length +
		r.games.length
	);
}

export function CommandMenu() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResults>(EMPTY);
	const [loading, setLoading] = useState(false);
	const abortRef = useRef<AbortController | null>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// ⌘K / Ctrl+K — toggle global.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((o) => !o);
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, []);

	// Recherche debouncée ; annule la requête en vol à chaque frappe.
	useEffect(() => {
		const term = query.trim();
		if (debounceRef.current) clearTimeout(debounceRef.current);
		if (term.length < 2) {
			abortRef.current?.abort();
			setResults(EMPTY);
			setLoading(false);
			return;
		}
		setLoading(true);
		debounceRef.current = setTimeout(async () => {
			abortRef.current?.abort();
			const ctrl = new AbortController();
			abortRef.current = ctrl;
			try {
				const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
					signal: ctrl.signal,
				});
				if (!res.ok) throw new Error(String(res.status));
				setResults((await res.json()) as SearchResults);
			} catch (e) {
				if ((e as Error).name !== "AbortError") setResults(EMPTY);
			} finally {
				if (!ctrl.signal.aborted) setLoading(false);
			}
		}, 180);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [query]);

	const go = useCallback(
		(href: string) => {
			setOpen(false);
			setQuery("");
			setResults(EMPTY);
			router.push(href);
		},
		[router],
	);

	const total = count(results);
	const term = query.trim();

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label="Rechercher dans le wiki (Ctrl+K)"
				className="group inline-flex items-center gap-2.5 h-9 pl-3 pr-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-dbz-orange/40 text-white/55 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60"
			>
				<svg
					width="15"
					height="15"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</svg>
				<span className="hidden xl:inline font-display text-[13px] tracking-normal">
					Rechercher…
				</span>
				<kbd className="hidden xl:inline-flex items-center gap-0.5 font-display text-[10px] font-semibold text-white/40 bg-white/[0.06] border border-white/10 rounded px-1.5 py-0.5">
					⌘K
				</kbd>
			</button>

			<Command.Dialog
				open={open}
				onOpenChange={setOpen}
				label="Recherche Dragon Ball"
				shouldFilter={false}
				loop
				overlayClassName="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
				contentClassName="fixed left-1/2 top-[12vh] z-[101] w-[92vw] max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-dbz-border bg-dbz-card/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
			>
				<div className="flex items-center gap-3 border-b border-dbz-border px-4">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-dbz-orange/60 shrink-0"
						aria-hidden="true"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
					<Command.Input
						value={query}
						onValueChange={setQuery}
						placeholder="Goku, Namek, Tournoi du Pouvoir…"
						className="h-14 w-full bg-transparent text-white placeholder:text-white/30 font-display text-base outline-none"
					/>
					{loading && (
						<span
							className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-dbz-orange/30 border-t-dbz-orange"
							aria-hidden="true"
						/>
					)}
				</div>

				<Command.List className="max-h-[60vh] overflow-y-auto overscroll-contain p-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-display [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-white/35">
					{term.length >= 2 && !loading && total === 0 && (
						<Command.Empty className="px-3 py-10 text-center text-sm text-white/45">
							Aucune énergie détectée pour «&nbsp;
							<span className="text-dbz-orange">{term}</span>&nbsp;».
						</Command.Empty>
					)}
					{term.length < 2 && (
						<p className="px-3 py-10 text-center text-sm text-white/35">
							Tape au moins 2 caractères pour scanner l'univers.
						</p>
					)}

					{results.characters.length > 0 && (
						<Command.Group heading="Personnages">
							{results.characters.map((c) => (
								<Item
									key={`char-${c.id}`}
									value={`char-${c.id}-${c.name}`}
									onSelect={() =>
										go(`/wiki/dragon-ball/character/${c.id}`)
									}
									image={c.image}
									title={c.name}
									subtitle={c.name_ja ?? c.race ?? undefined}
									kind="Guerrier"
									accent="orange"
								/>
							))}
						</Command.Group>
					)}

					{results.planets.length > 0 && (
						<Command.Group heading="Lieux">
							{results.planets.map((p) => (
								<Item
									key={`planet-${p.id}`}
									value={`planet-${p.id}-${p.name}`}
									onSelect={() => go(`/wiki/dragon-ball/planet/${p.id}`)}
									image={p.image}
									title={p.name}
									subtitle={p.name_ja ?? undefined}
									kind="Lieu"
									accent="blue"
								/>
							))}
						</Command.Group>
					)}

					{results.sagas.length > 0 && (
						<Command.Group heading="Sagas">
							{results.sagas.map((s) => (
								<Item
									key={`saga-${s.id}`}
									value={`saga-${s.id}-${s.name}`}
									onSelect={() => go(`/wiki/sagas/${s.slug}`)}
									title={s.name}
									subtitle={s.series ?? undefined}
									kind="Saga"
									accent="orange"
								/>
							))}
						</Command.Group>
					)}

					{results.movies.length > 0 && (
						<Command.Group heading="Films">
							{results.movies.map((m) => (
								<Item
									key={`movie-${m.id}`}
									value={`movie-${m.id}-${m.title}`}
									onSelect={() => go(`/wiki/films/${m.slug}`)}
									title={m.title}
									subtitle={m.title_ja ?? m.series ?? undefined}
									kind="Film"
									accent="red"
								/>
							))}
						</Command.Group>
					)}

					{results.games.length > 0 && (
						<Command.Group heading="Jeux">
							{results.games.map((g) => (
								<Item
									key={`game-${g.id}`}
									value={`game-${g.id}-${g.title}`}
									onSelect={() => go(`/wiki/jeux/${g.slug}`)}
									title={g.title}
									subtitle={g.title_ja ?? undefined}
									kind="Jeu"
									accent="blue"
								/>
							))}
						</Command.Group>
					)}

					{total > 0 && (
						<Command.Item
							value="__all-results"
							onSelect={() => go(`/wiki/search?q=${encodeURIComponent(term)}`)}
							className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 font-display text-[13px] text-dbz-orange/80 data-[selected=true]:bg-dbz-orange/15 data-[selected=true]:text-dbz-orange"
						>
							Voir tous les résultats pour «&nbsp;{term}&nbsp;» →
						</Command.Item>
					)}
				</Command.List>
			</Command.Dialog>
		</>
	);
}

const ACCENT = {
	orange: "group-data-[selected=true]:text-dbz-orange",
	blue: "group-data-[selected=true]:text-dbz-blue-light",
	red: "group-data-[selected=true]:text-dbz-red",
} as const;

function Item({
	value,
	onSelect,
	image,
	title,
	subtitle,
	kind,
	accent,
}: {
	value: string;
	onSelect: () => void;
	image?: string | null;
	title: string;
	subtitle?: string;
	kind: string;
	accent: keyof typeof ACCENT;
}) {
	return (
		<Command.Item
			value={value}
			onSelect={onSelect}
			className="group flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 data-[selected=true]:bg-white/[0.06]"
		>
			<span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md bg-dbz-bg ring-1 ring-white/10">
				{image ? (
					<img
						src={assetUrl(image)}
						alt=""
						className="h-full w-full object-cover object-top"
						loading="lazy"
					/>
				) : (
					<span className="font-saiyan text-xs text-white/25">
						{title.charAt(0)}
					</span>
				)}
			</span>
			<span className="min-w-0 flex-1">
				<span className="block truncate font-display text-sm font-medium text-white/90">
					{title}
				</span>
				{subtitle && (
					<span className="block truncate font-display text-[11px] text-white/40">
						{subtitle}
					</span>
				)}
			</span>
			<span
				className={`shrink-0 font-display text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 transition-colors ${ACCENT[accent]}`}
			>
				{kind}
			</span>
		</Command.Item>
	);
}
