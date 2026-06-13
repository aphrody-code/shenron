"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { assetUrl } from "@/lib/assets";
import type { TierlistItem, TierlistTier } from "@/db/schema";

interface Board {
	tiers: TierlistTier[];
	pool: TierlistItem[];
}

/**
 * Éditeur de tierlist. Deux interactions complémentaires :
 *  - tap-pour-placer (universel, mobile + desktop) : on sélectionne une carte
 *    puis on tape un tier (ou la réserve) pour l'y déposer ;
 *  - glisser-déposer HTML5 (bonus desktop) : on tire une carte vers un tier.
 * À la publication, POST /api/tierlists → redirection vers la tierlist créée.
 */
export function TierlistEditor({
	templateKey,
	defaultTitle,
	defaultDescription,
	pool,
	initialTiers,
}: {
	templateKey: string | null;
	defaultTitle: string;
	defaultDescription: string;
	pool: TierlistItem[];
	initialTiers: TierlistTier[];
}) {
	const router = useRouter();
	const [title, setTitle] = useState(defaultTitle);
	const [description, setDescription] = useState(defaultDescription);
	const [board, setBoard] = useState<Board>({ tiers: initialTiers, pool });
	const [selected, setSelected] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const dragId = useRef<string | null>(null);

	function place(itemId: string, targetId: string) {
		setBoard((prev) => {
			let moved: TierlistItem | undefined;
			const take = (arr: TierlistItem[]) =>
				arr.filter((i) => {
					if (i.id === itemId) {
						moved = i;
						return false;
					}
					return true;
				});
			const tiers = prev.tiers.map((t) => ({ ...t, items: take(t.items) }));
			let pool2 = take(prev.pool);
			if (!moved) return prev;
			if (targetId === "pool") {
				pool2 = [...pool2, moved];
			} else {
				const t = tiers.find((x) => x.id === targetId);
				if (t) t.items = [...t.items, moved];
				else pool2 = [...pool2, moved];
			}
			return { tiers, pool: pool2 };
		});
		setSelected(null);
	}

	function onTapZone(targetId: string) {
		if (selected) place(selected, targetId);
	}

	function onDrop(targetId: string) {
		if (dragId.current) place(dragId.current, targetId);
		dragId.current = null;
	}

	async function save() {
		setError(null);
		if (title.trim().length < 2) {
			setError("Donne un titre à ta tierlist.");
			return;
		}
		if (board.tiers.every((t) => t.items.length === 0)) {
			setError("Place au moins une carte dans un tier.");
			return;
		}
		setSaving(true);
		try {
			const res = await fetch("/api/tierlists", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: title.trim(),
					description: description.trim() || null,
					templateKey,
					tiers: board.tiers,
				}),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				setError(data?.error ?? "Échec de l'enregistrement.");
				setSaving(false);
				return;
			}
			router.push(`/tierlists/${data.slug}`);
		} catch {
			setError("Réseau indisponible. Réessaie.");
			setSaving(false);
		}
	}

	const renderCard = (it: TierlistItem) => (
		<button
			key={it.id}
			type="button"
			draggable
			onDragStart={() => {
				dragId.current = it.id;
			}}
			onClick={() => setSelected((s) => (s === it.id ? null : it.id))}
			title={it.label}
			className={`relative block h-14 w-14 shrink-0 cursor-grab overflow-hidden rounded-md border bg-white/5 transition-all active:cursor-grabbing sm:h-16 sm:w-16 ${
				selected === it.id
					? "border-[#ffd54f] ring-2 ring-[#ffd54f] scale-105"
					: "border-white/10 hover:border-white/40"
			}`}
		>
			{it.image ? (
				<img
					src={assetUrl(it.image)}
					alt={it.label}
					loading="lazy"
					className="h-full w-full object-cover object-top"
				/>
			) : (
				<span className="flex h-full w-full items-center justify-center px-0.5 text-center text-[8px] font-semibold leading-tight text-white/70">
					{it.label}
				</span>
			)}
		</button>
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-3 sm:grid-cols-2">
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					maxLength={120}
					placeholder="Titre de ta tierlist"
					className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm font-bold text-white outline-none focus:border-[#ffd54f]"
				/>
				<input
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					maxLength={200}
					placeholder="Description (optionnelle)"
					className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white/80 outline-none focus:border-[#ffd54f]"
				/>
			</div>

			<p className="text-[12px] text-white/45">
				Sélectionne une carte puis tape un tier pour la placer — ou glisse-la directement (sur
				ordinateur). {selected ? "Carte sélectionnée : tape un tier." : ""}
			</p>

			{/* Tiers */}
			<div className="flex flex-col gap-1.5">
				{board.tiers.map((t) => (
					<div
						key={t.id}
						onClick={() => onTapZone(t.id)}
						onDragOver={(e) => e.preventDefault()}
						onDrop={() => onDrop(t.id)}
						className={`flex overflow-hidden rounded-lg border transition-colors ${
							selected ? "cursor-pointer border-[#ffd54f]/40" : "border-white/10"
						}`}
					>
						<div
							className="flex w-14 shrink-0 items-center justify-center text-lg font-black text-black/85 sm:w-16"
							style={{ background: t.color }}
						>
							{t.label}
						</div>
						<div className="flex min-h-[4.5rem] flex-1 flex-wrap content-start gap-1 bg-black/30 p-1.5">
							{t.items.map(renderCard)}
						</div>
					</div>
				))}
			</div>

			{/* Réserve (cartes non classées) */}
			<div
				onClick={() => onTapZone("pool")}
				onDragOver={(e) => e.preventDefault()}
				onDrop={() => onDrop("pool")}
				className={`rounded-xl border bg-black/40 p-3 ${
					selected ? "cursor-pointer border-[#ffd54f]/40" : "border-white/10"
				}`}
			>
				<div className="mb-2 flex items-center justify-between">
					<span className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">
						Réserve · {board.pool.length}
					</span>
				</div>
				<div className="flex max-h-72 flex-wrap content-start gap-1 overflow-y-auto">
					{board.pool.map(renderCard)}
					{board.pool.length === 0 && (
						<span className="text-[12px] italic text-white/35">
							Toutes les cartes sont classées.
						</span>
					)}
				</div>
			</div>

			{error && <p className="text-[13px] font-semibold text-rose-400">{error}</p>}

			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={save}
					disabled={saving}
					className="rounded-lg bg-[#ffd54f] px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					{saving ? "Publication…" : "Publier ma tierlist"}
				</button>
				<button
					type="button"
					onClick={() => setBoard({ tiers: initialTiers.map((t) => ({ ...t, items: [] })), pool })}
					className="text-[13px] text-white/50 hover:text-white/80"
				>
					Réinitialiser
				</button>
			</div>
		</div>
	);
}
