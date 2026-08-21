"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Plus,
	Save,
	ShoppingBag,
	Trash2,
	X,
	Search,
	Power,
	PowerOff,
	AlertTriangle,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { api } from "@/lib/admin-api";
import { RoleBadge } from "@/components/admin/RoleSelect";
import { RolePicker } from "@/components/admin/RolePicker";
import { cn } from "@/lib/utils";

interface ShopItem {
	key: string;
	type: "card" | "badge" | "color" | "title" | "banner";
	name: string;
	description: string | null;
	price: number;
	roleId: string | null;
	meta: string | null;
	enabled: boolean;
}

const TYPE_META: Record<ShopItem["type"], { label: string; color: string }> = {
	card: { label: "Carte de profil", color: "text-amber-400" },
	badge: { label: "Badge", color: "text-fuchsia-400" },
	color: { label: "Couleur (rôle)", color: "text-blue-400" },
	title: { label: "Titre", color: "text-purple-400" },
	banner: { label: "Bannière", color: "text-emerald-400" },
};

const FALLBACK_TYPE_META = { label: "Inconnu", color: "text-zinc-400" };

function ConfirmDialog({
	title,
	message,
	confirmLabel,
	onConfirm,
	onCancel,
}: {
	title: string;
	message: string;
	confirmLabel: string;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
			<div className="card w-full max-w-sm space-y-4 border border-red-500/40">
				<div className="flex items-start gap-3">
					<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
					<div>
						<h3 className="font-semibold text-white">{title}</h3>
						<p className="mt-1 text-sm text-zinc-400">{message}</p>
					</div>
					<button
						type="button"
						onClick={onCancel}
						className="ml-auto btn btn-ghost px-1 py-1"
						aria-label="Fermer"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
				<div className="flex justify-end gap-2">
					<button type="button" onClick={onCancel} className="btn btn-ghost">
						Annuler
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="btn btn-primary bg-red-600 hover:bg-red-500 border-red-500"
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}

export default function ShopPage() {
	const qc = useQueryClient();
	const [editing, setEditing] = useState<ShopItem | null>(null);
	const [creating, setCreating] = useState(false);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState<string>("");
	const [confirmDelete, setConfirmDelete] = useState<ShopItem | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	const showSuccess = (msg: string) => {
		setSuccessMsg(msg);
		setTimeout(() => setSuccessMsg(null), 3000);
	};

	const items = useQuery({
		queryKey: ["shop", "items"],
		queryFn: () => api.get<{ rows: ShopItem[]; total: number }>("/database/shop_items?limit=500"),
	});

	const remove = useMutation({
		mutationFn: (key: string) => api.delete(`/database/shop_items/${encodeURIComponent(key)}`),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["shop"] });
			showSuccess("Article supprimé définitivement.");
		},
	});

	const filtered = useMemo(() => {
		const rows = items.data?.rows ?? [];
		return rows.filter((r) => {
			if (typeFilter && r.type !== typeFilter) return false;
			if (search) {
				const s = search.toLowerCase();
				if (!r.key.toLowerCase().includes(s) && !r.name.toLowerCase().includes(s)) return false;
			}
			return true;
		});
	}, [items.data, search, typeFilter]);

	const stats = useMemo(() => {
		const rows = items.data?.rows ?? [];
		return {
			total: rows.length,
			enabled: rows.filter((r) => r.enabled).length,
			byType: rows.reduce(
				(acc, r) => {
					acc[r.type] = (acc[r.type] ?? 0) + 1;
					return acc;
				},
				{} as Record<string, number>
			),
		};
	}, [items.data]);

	return (
		<div className="space-y-4">
			{confirmDelete && (
				<ConfirmDialog
					title={`Supprimer « ${confirmDelete.name} » ?`}
					message="Cet article sera définitivement supprimé de la boutique. Les membres qui l'ont déjà acheté conserveront leur exemplaire dans leur inventaire."
					confirmLabel="Supprimer définitivement"
					onConfirm={() => {
						remove.mutate(confirmDelete.key);
						setConfirmDelete(null);
					}}
					onCancel={() => setConfirmDelete(null)}
				/>
			)}

			{/* En-tête */}
			<div className="card">
				<div className="flex items-center gap-2">
					<ShoppingBag className="h-5 w-5 text-brand-400" />
					<h2 className="text-lg font-semibold">Boutique</h2>
					<span className="ml-2 text-xs text-zinc-500">
						{stats.total} article{stats.total !== 1 ? "s" : ""} · {stats.enabled} actif
						{stats.enabled !== 1 ? "s" : ""}
					</span>
					<button
						type="button"
						className="ml-auto btn btn-primary"
						onClick={() => setCreating(true)}
					>
						<Plus className="h-3 w-3" /> Créer un article
					</button>
				</div>
				<p className="mt-1 text-sm text-zinc-400">
					Gérez les articles disponibles à l&apos;achat avec des zénis. Un article désactivé reste
					en base mais n&apos;est plus affiché dans la boutique.
				</p>
				<div className="mt-3 grid gap-2 sm:grid-cols-3">
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500" />
						<input
							className="input w-full pl-8"
							placeholder="Rechercher par nom ou identifiant"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<select
						className="input"
						value={typeFilter}
						onChange={(e) => setTypeFilter(e.target.value)}
					>
						<option value="">— Tous les types —</option>
						{Object.entries(TYPE_META).map(([t, m]) => (
							<option key={t} value={t}>
								{m.label} ({stats.byType[t] ?? 0})
							</option>
						))}
					</select>
					<div className="flex items-center gap-2 text-xs text-zinc-500">
						{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
					</div>
				</div>
			</div>

			{/* Feedback */}
			{successMsg && (
				<div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
					<CheckCircle2 className="h-4 w-4 shrink-0" />
					{successMsg}
				</div>
			)}

			{/* Chargement */}
			{items.isLoading && (
				<div className="flex items-center gap-2 text-zinc-500 text-sm">
					<Loader2 className="h-4 w-4 animate-spin" />
					Chargement des articles…
				</div>
			)}

			{/* Grille d'articles */}
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{filtered.map((item) => (
					<div key={item.key} className={cn("card", !item.enabled && "opacity-60")}>
						<div className="flex items-start gap-2">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<span
										className={`text-xs font-semibold uppercase tracking-wide ${(TYPE_META[item.type] ?? FALLBACK_TYPE_META).color}`}
									>
										{(TYPE_META[item.type] ?? FALLBACK_TYPE_META).label}
									</span>
									{!item.enabled && <span className="badge badge-error text-[10px]">Masqué</span>}
								</div>
								<h3 className="mt-0.5 truncate font-semibold">{item.name}</h3>
								<code className="block truncate text-[10px] text-zinc-500">{item.key}</code>
							</div>
						</div>
						{item.description && (
							<p className="mt-2 line-clamp-2 text-xs text-zinc-400">{item.description}</p>
						)}
						<div className="mt-3 flex items-center gap-2">
							<span className="badge badge-warning">
								{(item.price ?? 0).toLocaleString("fr-FR")} zénis
							</span>
							{item.roleId && <RoleBadge roleId={item.roleId} />}
						</div>
						<div className="mt-3 flex items-center gap-1 border-t border-zinc-800 pt-3">
							<button
								type="button"
								className="btn btn-ghost flex-1"
								onClick={() => setEditing(item)}
							>
								Modifier
							</button>
							<button
								type="button"
								className="btn btn-ghost px-2 text-red-400"
								title="Supprimer cet article"
								onClick={() => setConfirmDelete(item)}
							>
								<Trash2 className="h-3 w-3" />
							</button>
						</div>
					</div>
				))}
				{filtered.length === 0 && !items.isLoading && (
					<div className="col-span-full card text-center text-zinc-500">
						{search || typeFilter
							? "Aucun article ne correspond à ces filtres."
							: "Aucun article dans la boutique. Créez le premier !"}
					</div>
				)}
			</div>

			{(editing || creating) && (
				<ShopItemEditor
					item={editing}
					onClose={() => {
						setEditing(null);
						setCreating(false);
					}}
					onSaved={() => {
						qc.invalidateQueries({ queryKey: ["shop"] });
						showSuccess(editing ? "Article modifié avec succès." : "Article créé avec succès.");
					}}
				/>
			)}
		</div>
	);
}

function ShopItemEditor({
	item,
	onClose,
	onSaved,
}: {
	item: ShopItem | null;
	onClose: () => void;
	onSaved: () => void;
}) {
	const isCreate = !item;
	const [draft, setDraft] = useState<ShopItem>(
		item ?? {
			key: "",
			type: "title",
			name: "",
			description: "",
			price: 100,
			roleId: null,
			meta: null,
			enabled: true,
		}
	);
	const [error, setError] = useState<string | null>(null);

	const save = useMutation({
		mutationFn: async (payload: ShopItem) => {
			if (isCreate) {
				return api.post("/database/shop_items", payload);
			}
			return api.put(`/database/shop_items/${encodeURIComponent(payload.key)}`, payload);
		},
		onSuccess: () => {
			onSaved();
			onClose();
		},
		onError: (err) => setError((err as Error).message),
	});

	const submit = (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!draft.key || !draft.name) {
			setError("L'identifiant et le nom sont obligatoires.");
			return;
		}
		if (!/^[a-z0-9_-]+$/.test(draft.key)) {
			setError(
				"L'identifiant doit contenir uniquement des lettres minuscules, chiffres, tirets ou underscores."
			);
			return;
		}
		if (draft.meta) {
			try {
				JSON.parse(draft.meta);
			} catch {
				setError("Le champ Méta doit contenir du JSON valide.");
				return;
			}
		}
		save.mutate(draft);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur">
			<form
				onSubmit={submit}
				className="card w-full max-w-2xl space-y-3 max-h-[90vh] overflow-y-auto"
			>
				<div className="flex items-center gap-2">
					<h3 className="text-lg font-semibold">
						{isCreate ? "Créer un article" : `Modifier « ${draft.name} »`}
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="ml-auto btn btn-ghost px-2"
						aria-label="Fermer"
					>
						<X className="h-3 w-3" />
					</button>
				</div>
				{error && (
					<div className="rounded border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-400">
						{error}
					</div>
				)}
				<div className="grid gap-2 sm:grid-cols-2">
					<div>
						<label className="block text-xs text-zinc-500">
							Identifiant (slug)
							<span className="ml-1 text-zinc-600">— lettres minuscules et tirets</span>
						</label>
						<input
							className="input w-full font-mono text-xs"
							value={draft.key}
							onChange={(e) => setDraft({ ...draft, key: e.target.value })}
							disabled={!isCreate}
							placeholder="goku_super_saiyan"
						/>
					</div>
					<div>
						<label className="block text-xs text-zinc-500">Type d&apos;article</label>
						<select
							className="input w-full"
							value={draft.type}
							onChange={(e) => setDraft({ ...draft, type: e.target.value as ShopItem["type"] })}
						>
							{Object.entries(TYPE_META).map(([t, m]) => (
								<option key={t} value={t}>
									{m.label}
								</option>
							))}
						</select>
					</div>
					<div className="sm:col-span-2">
						<label className="block text-xs text-zinc-500">Nom affiché dans la boutique</label>
						<input
							className="input w-full"
							value={draft.name}
							onChange={(e) => setDraft({ ...draft, name: e.target.value })}
							placeholder="Super Saiyan Goku"
						/>
					</div>
					<div className="sm:col-span-2">
						<label className="block text-xs text-zinc-500">Description (optionnelle)</label>
						<textarea
							className="input w-full"
							rows={2}
							value={draft.description ?? ""}
							onChange={(e) => setDraft({ ...draft, description: e.target.value })}
						/>
					</div>
					<div>
						<label className="block text-xs text-zinc-500">Prix en zénis</label>
						<input
							className="input w-full"
							type="number"
							min={0}
							value={draft.price}
							onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) || 0 })}
						/>
					</div>
					<div>
						<label className="block text-xs text-zinc-500">Visibilité dans la boutique</label>
						<button
							type="button"
							className={`btn ${draft.enabled ? "btn-primary" : "btn-ghost"} w-full`}
							onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}
						>
							{draft.enabled ? (
								<>
									<Power className="h-3 w-3" /> Visible (actif)
								</>
							) : (
								<>
									<PowerOff className="h-3 w-3" /> Masqué (inactif)
								</>
							)}
						</button>
					</div>
					{draft.type === "color" && (
						<div className="sm:col-span-2">
							<label className="block text-xs text-zinc-500">
								Rôle Discord attribué à l&apos;achat
								<span className="ml-1 text-zinc-600">— couleurs uniquement</span>
							</label>
							<RolePicker
								value={draft.roleId ?? ""}
								onChange={(v) => setDraft({ ...draft, roleId: v || null })}
							/>
						</div>
					)}
					<div className="sm:col-span-2">
						<label className="block text-xs text-zinc-500">
							Données supplémentaires (JSON optionnel)
							<span className="ml-1 text-zinc-600">— URL d&apos;image, propriétés custom</span>
						</label>
						<textarea
							className="input w-full font-mono text-xs"
							rows={3}
							value={draft.meta ?? ""}
							onChange={(e) => setDraft({ ...draft, meta: e.target.value || null })}
							placeholder='{"image": "https://..."}'
						/>
					</div>
				</div>
				<div className="flex items-center gap-2 border-t border-zinc-800 pt-3">
					<button type="submit" className="btn btn-primary" disabled={save.isPending}>
						<Save className="h-3 w-3" />
						{save.isPending
							? "Enregistrement…"
							: isCreate
								? "Créer l'article"
								: "Enregistrer les modifications"}
					</button>
					<button type="button" className="btn btn-ghost" onClick={onClose}>
						Annuler
					</button>
				</div>
			</form>
		</div>
	);
}
