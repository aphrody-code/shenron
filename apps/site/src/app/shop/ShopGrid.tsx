"use client";

/**
 * Boutique interactive : catalogue public (rendu serveur, caché) + îlot client
 * qui récupère le solde/inventaire du membre connecté (proxy bot-user signé) et
 * permet d'ACHETER et d'ÉQUIPER directement sur le site — plus besoin de Discord.
 * Chaque article montre un aperçu de ce qu'on obtient (fond de carte, couleur…).
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Cadenas, Chargement, Coche, Piece, Sac } from "@/components/icones";

interface ShopItem {
	key: string;
	type: "card" | "badge" | "color" | "title" | "banner";
	name: string;
	description: string | null;
	price: number;
	roleId: string | null;
	roleColor?: string;
	preview?: string;
}

type Balance = {
	balance: number;
	owned: { type: string; key: string }[];
	equipped: Record<string, string | null>;
};

const TYPE_LABELS: Record<string, string> = {
	card: "Carte",
	badge: "Badge",
	color: "Couleur",
	title: "Titre",
	banner: "Bannière",
};
const TYPE_ORDER: ShopItem["type"][] = ["banner", "card", "badge", "color", "title"];

export function ShopGrid({ items }: { items: ShopItem[] }) {
	const [state, setState] = useState<Balance | null>(null);
	const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
	const [busy, setBusy] = useState<string | null>(null);
	const [flash, setFlash] = useState<{ key: string; ok: boolean; msg: string } | null>(null);
	const [selectedKey, setSelectedKey] = useState<string | null>(items[0]?.key ?? null);
	const [filter, setFilter] = useState<ShopItem["type"] | "all">("all");
	const [query, setQuery] = useState("");

	const refresh = useCallback(async () => {
		try {
			const res = await fetch("/api/bot-user/economy/balance");
			if (res.status === 401) {
				setLoggedIn(false);
				return;
			}
			setLoggedIn(true);
			setState((await res.json()) as Balance);
		} catch {
			setLoggedIn(false);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	const owns = (it: ShopItem) => state?.owned.some((o) => o.type === it.type && o.key === it.key);
	const equipped = (it: ShopItem) => state?.equipped[it.type] === it.key;

	async function buy(it: ShopItem) {
		setBusy(it.key);
		setFlash(null);
		try {
			const res = await fetch("/api/bot-user/economy/purchase", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ key: it.key }),
			});
			const data = await res.json();
			if (res.ok && data.ok) {
				setFlash({ key: it.key, ok: true, msg: "Acheté ! Tu peux l'équiper." });
				await refresh();
			} else {
				setFlash({ key: it.key, ok: false, msg: data.reason ?? "Achat impossible." });
				if (typeof data.balance === "number")
					setState((s) => (s ? { ...s, balance: data.balance } : s));
			}
		} catch {
			setFlash({ key: it.key, ok: false, msg: "Erreur réseau." });
		} finally {
			setBusy(null);
		}
	}

	async function equip(it: ShopItem) {
		setBusy(it.key);
		setFlash(null);
		try {
			const res = await fetch("/api/bot-user/economy/equip", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ type: it.type, key: it.key }),
			});
			const data = await res.json();
			if (res.ok && data.ok) {
				setFlash({ key: it.key, ok: true, msg: "Équipé ✓" });
				await refresh();
			} else {
				setFlash({ key: it.key, ok: false, msg: data.reason ?? "Équipement impossible." });
			}
		} catch {
			setFlash({ key: it.key, ok: false, msg: "Erreur réseau." });
		} finally {
			setBusy(null);
		}
	}

	const visibleItems = useMemo(
		() =>
			items.filter(
				(it) =>
					(filter === "all" || it.type === filter) &&
					(!query.trim() || `${it.name} ${it.description ?? ""}`.toLowerCase().includes(query.toLowerCase())),
			),
		[filter, items, query],
	);
	const selected = visibleItems.find((it) => it.key === selectedKey) ?? visibleItems[0] ?? items[0];
	const selectedColor = selected?.roleColor ?? (selected?.type === "color" ? "#7c3aed" : "#f59e0b");
	const grouped = visibleItems.reduce<Record<string, ShopItem[]>>((acc, it) => {
		(acc[it.type] ??= []).push(it);
		return acc;
	}, {});
	for (const k of Object.keys(grouped)) grouped[k].sort((a, b) => a.price - b.price);

	return (
		<div className="space-y-8">
			<header className="relative overflow-hidden rounded-[2rem] border border-dbz-orange/25 bg-[radial-gradient(circle_at_75%_20%,rgba(243,132,24,.25),transparent_35%),#17130e] p-6 md:p-9">
				<div className="relative z-10 max-w-2xl">
					<p className="font-scouter text-[11px] uppercase tracking-[.28em] text-dbz-orange">Le comptoir de Shenron</p>
					<h2 className="mt-2 font-saiyan text-4xl leading-none text-white md:text-6xl">Équipe ton identité.</h2>
					<p className="mt-4 max-w-xl text-sm leading-6 text-white/60">Choisis une couleur, un titre ou une bannière et vois immédiatement son rendu dans ton profil et dans le chat.</p>
				</div>
				<div className="pointer-events-none absolute -right-8 -top-12 text-[12rem] leading-none opacity-[.08]">龍</div>
			</header>

			{/* Bandeau solde / connexion */}
			<div className="dbz-panel flex flex-wrap items-center justify-between gap-3 p-4">
				{loggedIn === false ? (
					<p className="flex items-center gap-2 text-sm text-white/70">
						<Cadenas className="h-4 w-4 text-dbz-orange" />
						Connecte-toi avec Discord pour acheter et équiper directement sur le site.
					</p>
				) : loggedIn === null ? (
					<p className="flex items-center gap-2 text-sm text-white/50">
						<Chargement className="h-4 w-4 animate-spin" /> Chargement de ton solde…
					</p>
				) : (
					<p className="flex items-center gap-2 text-sm text-white/80">
						<Piece className="h-5 w-5 text-dbz-yellow" />
						<span className="font-saiyan text-2xl text-dbz-yellow">
							{(state?.balance ?? 0).toLocaleString("fr-FR")}
						</span>
						<span className="text-xs uppercase tracking-widest text-dbz-orange">zénis</span>
					</p>
				)}
				{loggedIn === false && (
					<a href="/signin" className="dbz-button text-sm">
						Se connecter
					</a>
				)}
			</div>

			{selected && (
				<section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]" aria-labelledby="shop-preview-title">
					<div className="rounded-3xl border border-white/10 bg-[#151412] p-5 md:p-7">
						<div className="flex items-start justify-between gap-4">
							<div><p className="text-[10px] uppercase tracking-[.2em] text-dbz-orange">Aperçu en direct</p><h2 id="shop-preview-title" className="mt-1 font-saiyan text-2xl text-white">Ton rendu dans le serveur</h2></div>
							<span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-white/45">{TYPE_LABELS[selected.type]}</span>
						</div>
						<div className="mt-6 rounded-2xl border border-white/10 bg-[#0d0c0b] p-4" style={{ borderColor: `${selectedColor}55` }}>
							<div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full border-2 border-white/20 bg-gradient-to-br from-dbz-orange to-purple-500" /><div><p className="font-semibold" style={{ color: selectedColor }}>Son Goku <span className="text-white/40">· Niv. 42</span></p><p className="text-[10px] uppercase tracking-wider text-white/35">Dragon Ball France · maintenant</p></div></div>
							<p className="mt-4 rounded-xl border border-white/10 bg-white/[.03] p-4 text-sm text-white/80">Voici exactement le style de ton message avec <strong style={{ color: selectedColor }}>{selected.name}</strong>.</p>
						</div>
						<p className="mt-3 text-xs text-white/40">La couleur est contrôlée pour rester lisible sur le thème du chat. L’équipement est synchronisé avec Discord.</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-[#151412] p-5 md:p-7">
						<p className="text-[10px] uppercase tracking-[.2em] text-dbz-orange">Sélection</p><h2 className="mt-1 font-saiyan text-2xl text-white">{selected.name}</h2>
						<p className="mt-3 text-sm leading-6 text-white/55">{selected.description || "Objet cosmétique de la communauté DBFR."}</p>
						<div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-xs uppercase tracking-wider text-white/40">Valeur</span><strong className="font-saiyan text-3xl text-dbz-yellow">{selected.price.toLocaleString("fr-FR")} <span className="text-xs text-dbz-orange">Z</span></strong></div>
					</div>
				</section>
			)}

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer la boutique">
					{(["all", ...TYPE_ORDER] as const).map((type) => <button key={type} type="button" role="tab" aria-selected={filter === type} onClick={() => setFilter(type)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${filter === type ? "border-dbz-orange bg-dbz-orange text-black" : "border-white/10 text-white/55 hover:border-dbz-orange/60 hover:text-white"}`}>{type === "all" ? "Tout" : TYPE_LABELS[type]}</button>)}
				</div>
				<label className="sr-only" htmlFor="shop-search">Rechercher un article</label><input id="shop-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un article…" className="h-10 rounded-full border border-white/10 bg-[#151412] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-dbz-orange sm:w-64" />
			</div>
			{visibleItems.length === 0 && (
				<div className="rounded-2xl border border-dashed border-white/15 bg-[#151412] p-10 text-center">
					<p className="font-saiyan text-2xl text-dbz-orange">Aucun objet trouvé</p>
					<p className="mt-2 text-sm text-white/45">Essaie une autre recherche ou réinitialise le filtre.</p>
					<button type="button" onClick={() => { setFilter("all"); setQuery(""); }} className="mt-5 rounded-full border border-dbz-orange/50 px-4 py-2 text-xs font-semibold text-dbz-orange hover:bg-dbz-orange hover:text-black">Réinitialiser</button>
				</div>
			)}

			{TYPE_ORDER.filter((t) => grouped[t]?.length).map((type) => (
				<section key={type}>
					<h2 className="mb-5 border-b-4 border-dbz-orange/30 pb-2 font-saiyan text-2xl uppercase text-dbz-orange">
						{TYPE_LABELS[type]}s ({grouped[type].length})
					</h2>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{grouped[type].map((it) => {
							const isOwned = owns(it);
							const isEquipped = equipped(it);
							const canAfford = (state?.balance ?? 0) >= it.price;
							const isBusy = busy === it.key;
							const f = flash?.key === it.key ? flash : null;
							return (
								<article
									key={it.key}
									className={`dbz-panel group flex cursor-pointer flex-col overflow-hidden transition-colors hover:border-dbz-orange ${selected?.key === it.key ? "border-dbz-orange/80 shadow-[0_0_0_1px_rgba(243,132,24,.35)]" : ""}`}
									onClick={() => setSelectedKey(it.key)}
								>
									<ItemPreview item={it} />
									<div className="flex flex-1 flex-col p-4">
										<div className="mb-2 flex items-start justify-between gap-2">
											<h3 className="text-base font-bold leading-tight text-white">{it.name}</h3>
											<div className="text-right">
												<div className="font-saiyan text-xl leading-none text-dbz-yellow">
													{it.price.toLocaleString("fr-FR")}
												</div>
												<div className="text-[9px] font-bold uppercase text-dbz-orange">zénis</div>
											</div>
										</div>
										{it.description && (
											<p className="mb-3 line-clamp-2 flex-1 text-xs text-white/50">
												{it.description}
											</p>
										)}
										{/* Action */}
										<div className="mt-auto">
											{loggedIn !== true ? (
												<div className="rounded border-2 border-dbz-border p-2 text-center text-[11px] text-white/50">
													Connexion requise
												</div>
											) : isEquipped ? (
												<div className="flex items-center justify-center gap-1 rounded border-2 border-green-500/50 bg-green-500/10 p-2 text-sm font-bold text-green-400">
													<Coche className="h-4 w-4" /> Équipé
												</div>
											) : isOwned ? (
												<button
													type="button"
													disabled={isBusy}
													onClick={() => equip(it)}
													className="dbz-button w-full justify-center disabled:opacity-50"
												>
													{isBusy ? <Chargement className="h-4 w-4 animate-spin" /> : "Équiper"}
												</button>
											) : (
												<button
													type="button"
													disabled={isBusy || !canAfford}
													onClick={() => buy(it)}
													className="dbz-button w-full justify-center gap-1 disabled:cursor-not-allowed disabled:opacity-40"
												>
													{isBusy ? (
														<Chargement className="h-4 w-4 animate-spin" />
													) : (
														<>
															<Sac className="h-4 w-4" />
															{canAfford ? "Acheter" : "Solde insuffisant"}
														</>
													)}
												</button>
											)}
											{f && (
												<p
													className={`mt-1.5 text-center text-[11px] ${f.ok ? "text-green-400" : "text-red-400"}`}
												>
													{f.msg}
												</p>
											)}
										</div>
									</div>
								</article>
							);
						})}
					</div>
				</section>
			))}
		</div>
	);
}

/** Aperçu « exemple si achat » selon le type d'article. */
function ItemPreview({ item }: { item: ShopItem }) {
	// Bannière / carte : fond appliqué à la carte de profil → on le montre dans un
	// cadre façon carte pour illustrer « voici le fond de ta carte ».
	if (item.preview) {
		return (
			<div className="relative aspect-[16/9] overflow-hidden border-b-4 border-dbz-border bg-dbz-bg">
				<img
					src={item.preview}
					alt={item.name}
					loading="lazy"
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
				{/* Mock d'éléments de carte pour situer le rendu */}
				<div className="absolute bottom-2 left-2 flex items-center gap-2">
					<div className="h-8 w-8 rounded-full border-2 border-white/70 bg-white/20" />
					<div>
						<div className="h-2 w-16 rounded bg-white/70" />
						<div className="mt-1 h-1.5 w-10 rounded bg-dbz-yellow/80" />
					</div>
				</div>
				<span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white/70">
					Aperçu carte
				</span>
			</div>
		);
	}
	// Couleur : pastille de la couleur du rôle.
	if (item.type === "color") {
		return (
			<div
				className="flex aspect-[16/9] items-center justify-center border-b-4 border-dbz-border"
				style={{ background: item.roleColor ?? "#7c3aed" }}
			>
				<span className="rounded bg-black/40 px-2 py-1 text-xs font-bold uppercase tracking-widest text-white">
					{item.roleColor ?? "Couleur de pseudo"}
				</span>
			</div>
		);
	}
	// Titre / badge : exemple stylé du texte.
	return (
		<div className="flex aspect-[16/9] items-center justify-center border-b-4 border-dbz-border bg-dbz-bg">
			<span
				className="rounded-full border-2 px-3 py-1 text-sm font-bold"
				style={{ borderColor: item.roleColor ?? "#f59e0b", color: item.roleColor ?? "#f59e0b" }}
			>
				{item.type === "badge" ? "✦ " : ""}
				{item.name}
			</span>
		</div>
	);
}
