"use client";

/**
 * Boutique interactive : catalogue public (rendu serveur, caché) + îlot client
 * qui récupère le solde/inventaire du membre connecté (proxy bot-user signé) et
 * permet d'ACHETER et d'ÉQUIPER directement sur le site — plus besoin de Discord.
 * Chaque article montre un aperçu de ce qu'on obtient (fond de carte, couleur…).
 */
import { useCallback, useEffect, useState } from "react";
import { Check, Coins, Loader2, Lock, ShoppingCart } from "lucide-react";

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

	const grouped = items.reduce<Record<string, ShopItem[]>>((acc, it) => {
		(acc[it.type] ??= []).push(it);
		return acc;
	}, {});
	for (const k of Object.keys(grouped)) grouped[k].sort((a, b) => a.price - b.price);

	return (
		<div className="space-y-8">
			{/* Bandeau solde / connexion */}
			<div className="dbz-panel flex flex-wrap items-center justify-between gap-3 p-4">
				{loggedIn === false ? (
					<p className="flex items-center gap-2 text-sm text-white/70">
						<Lock className="h-4 w-4 text-dbz-orange" />
						Connecte-toi avec Discord pour acheter et équiper directement sur le site.
					</p>
				) : loggedIn === null ? (
					<p className="flex items-center gap-2 text-sm text-white/50">
						<Loader2 className="h-4 w-4 animate-spin" /> Chargement de ton solde…
					</p>
				) : (
					<p className="flex items-center gap-2 text-sm text-white/80">
						<Coins className="h-5 w-5 text-dbz-yellow" />
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
									className="dbz-panel group flex flex-col overflow-hidden transition-colors hover:border-dbz-orange"
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
													<Check className="h-4 w-4" /> Équipé
												</div>
											) : isOwned ? (
												<button
													type="button"
													disabled={isBusy}
													onClick={() => equip(it)}
													className="dbz-button w-full justify-center disabled:opacity-50"
												>
													{isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Équiper"}
												</button>
											) : (
												<button
													type="button"
													disabled={isBusy || !canAfford}
													onClick={() => buy(it)}
													className="dbz-button w-full justify-center gap-1 disabled:cursor-not-allowed disabled:opacity-40"
												>
													{isBusy ? (
														<Loader2 className="h-4 w-4 animate-spin" />
													) : (
														<>
															<ShoppingCart className="h-4 w-4" />
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
				{/* eslint-disable-next-line @next/next/no-img-element */}
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
