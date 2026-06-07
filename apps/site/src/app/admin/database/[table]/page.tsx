"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Trash2, Edit, X, AlertTriangle, CheckCircle, Plus } from "lucide-react";
import { useState, type ReactNode, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, apiAt } from "@/lib/admin-api";
import { assetUrl } from "@/lib/assets";
import { TABLE_LABELS, colLabel } from "@/lib/db-labels";
import { WIKI_TABLE_SPECS, crudBase, isWikiTable } from "@/lib/wiki-tables";

interface TableSpec {
	name: string;
	pk: string;
	readonly: boolean;
	mutableColumns: string[];
	description: string | null;
}

export default function TablePage() {
	const { table } = useParams<{ table: string }>();
	const router = useRouter();
	const wiki = isWikiTable(table);
	const client = wiki ? apiAt(crudBase(table)) : api;
	const collection = wiki ? `/${table}` : `/database/${table}`;
	const rowPath = (id: unknown) => `${collection}/${encodeURIComponent(String(id))}`;
	const [page, setPage] = useState(0);
	const [creating, setCreating] = useState(false);
	const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
	const [toast, setToast] = useState<{
		type: "success" | "error";
		msg: string;
	} | null>(null);
	const limit = 25;
	const offset = page * limit;
	const qc = useQueryClient();

	// Auto-dismiss toast
	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(null), 3500);
		return () => clearTimeout(t);
	}, [toast]);

	const wikiSpecRaw = WIKI_TABLE_SPECS[table];
	const tableSpec = useQuery({
		queryKey: ["db", "tables"],
		queryFn: () => api.get<{ tables: TableSpec[] }>("/database/tables"),
		enabled: !wikiSpecRaw,
	});
	const spec: TableSpec | undefined = wikiSpecRaw
		? {
				name: wikiSpecRaw.name,
				pk: Array.isArray(wikiSpecRaw.pk) ? wikiSpecRaw.pk.join(",") : wikiSpecRaw.pk,
				readonly: false,
				mutableColumns: wikiSpecRaw.mutableColumns,
				description: null,
			}
		: tableSpec.data?.tables.find((t) => t.name === table);

	const rows = useQuery({
		queryKey: ["db", table, page],
		queryFn: () =>
			client.get<{ rows: Record<string, unknown>[]; total: number }>(
				`${collection}?limit=${limit}&offset=${offset}`
			),
		enabled: !!table,
	});

	const create = useMutation({
		mutationFn: (body: Record<string, unknown>) => client.post(collection, body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["db", table] });
			setCreating(false);
			setToast({ type: "success", msg: "Entrée créée avec succès." });
		},
		onError: (err: Error) => {
			setToast({ type: "error", msg: `Erreur : ${err.message}` });
		},
	});

	const update = useMutation({
		mutationFn: (data: { id: unknown; body: Record<string, unknown> }) =>
			client.put(rowPath(data.id), data.body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["db", table] });
			setEditing(null);
			setToast({ type: "success", msg: "Entrée modifiée avec succès." });
		},
		onError: (err: Error) => {
			setToast({ type: "error", msg: `Erreur : ${err.message}` });
		},
	});

	const remove = useMutation({
		mutationFn: (id: unknown) => client.delete(rowPath(id)),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["db", table] });
			setDeleteTarget(null);
			setToast({ type: "success", msg: "Entrée supprimée." });
		},
		onError: (err: Error) => {
			setDeleteTarget(null);
			setToast({ type: "error", msg: `Erreur : ${err.message}` });
		},
	});

	const humanLabel = TABLE_LABELS[table] ?? table;
	const cols = rows.data?.rows[0] ? Object.keys(rows.data.rows[0]) : [];
	const total = rows.data?.total ?? 0;
	const totalPages = Math.ceil(total / limit);

	return (
		<div className="space-y-4">
			{/* Toast */}
			{toast && (
				<div
					className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-xl ${
						toast.type === "success"
							? "border-green-500/50 bg-dbz-card text-green-300"
							: "border-red-500/50 bg-dbz-card text-red-300"
					}`}
				>
					{toast.type === "success" ? (
						<CheckCircle className="h-4 w-4 shrink-0" />
					) : (
						<AlertTriangle className="h-4 w-4 shrink-0" />
					)}
					{toast.msg}
				</div>
			)}

			{/* En-tête */}
			<div className="flex items-center gap-3 flex-wrap">
				<button
					type="button"
					onClick={() => router.push("/admin/database")}
					className="btn btn-ghost"
				>
					<ArrowLeft className="h-4 w-4" />
					<span className="sr-only">Retour</span>
				</button>
				<div className="flex-1 min-w-0">
					<h2 className="font-saiyan text-xl uppercase text-dbz-orange">{humanLabel}</h2>
					{spec?.description && <p className="text-xs text-white/50">{spec.description}</p>}
					<code className="text-[10px] text-white/25 font-mono">{table}</code>
				</div>
				<div className="text-sm text-white/40 tabular-nums">
					{total.toLocaleString("fr-FR")} entrée{total > 1 ? "s" : ""} · page {page + 1} sur{" "}
					{Math.max(1, totalPages)}
				</div>
				{spec && !spec.readonly && (
					<button type="button" onClick={() => setCreating(true)} className="btn btn-primary">
						<Plus className="h-4 w-4" />
						Nouvelle entrée
					</button>
				)}
			</div>

			{/* Tableau */}
			{rows.isLoading ? (
				<div className="card animate-pulse h-64" />
			) : rows.isError ? (
				<div className="card text-center py-12">
					<p className="text-dbz-orange font-saiyan uppercase mb-1">Erreur de chargement</p>
					<p className="text-white/50 text-sm">Impossible de récupérer les données.</p>
				</div>
			) : rows.data?.rows.length === 0 ? (
				<div className="card text-center py-12">
					<p className="font-saiyan text-xl uppercase text-white/30 mb-1">Aucune entrée</p>
					<p className="text-white/40 text-sm mb-4">Cette section est vide pour l&apos;instant.</p>
					{spec && !spec.readonly && (
						<button type="button" onClick={() => setCreating(true)} className="btn btn-primary">
							<Plus className="h-4 w-4" />
							Créer la première entrée
						</button>
					)}
				</div>
			) : (
				<div className="card overflow-x-auto p-0">
					<table className="w-full text-sm">
						<thead className="border-b border-dbz-border/60 bg-dbz-card/40">
							<tr>
								{cols.map((c) => (
									<th
										key={c}
										className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light whitespace-nowrap"
										title={c}
									>
										{colLabel(c)}
									</th>
								))}
								<th className="w-20 px-3 py-2" />
							</tr>
						</thead>
						<tbody className="divide-y divide-dbz-border/30">
							{rows.data?.rows.map((row, i) => (
								<tr key={i} className="hover:bg-dbz-orange/5 transition-colors">
									{cols.map((c) => (
										<td key={c} className="max-w-[200px] truncate px-3 py-2 text-xs">
											{renderCell(row[c], c)}
										</td>
									))}
									<td className="px-3 py-2 text-right">
										{!spec?.readonly && (
											<div className="flex justify-end gap-1">
												<button
													type="button"
													onClick={() => setEditing(row)}
													className="btn btn-ghost px-2 h-7 text-xs"
													title="Modifier"
												>
													<Edit className="h-3 w-3" />
												</button>
												<button
													type="button"
													onClick={() => setDeleteTarget(row)}
													className="btn btn-ghost px-2 h-7 text-xs text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
													title="Supprimer"
												>
													<Trash2 className="h-3 w-3" />
												</button>
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={() => setPage((p) => Math.max(0, p - 1))}
					disabled={page === 0}
					className="btn btn-ghost"
				>
					Page précédente
				</button>
				<span className="text-xs text-white/40 tabular-nums">
					{offset + 1}–{Math.min(offset + limit, total)} / {total.toLocaleString("fr-FR")}
				</span>
				<button
					type="button"
					onClick={() => setPage((p) => p + 1)}
					disabled={offset + limit >= total}
					className="btn btn-ghost"
				>
					Page suivante
				</button>
			</div>

			{/* Modale création */}
			{creating && spec && (
				<EditModal
					mode="create"
					row={{}}
					spec={spec}
					onClose={() => setCreating(false)}
					onSave={(body) => create.mutate(body)}
					saving={create.isPending}
				/>
			)}

			{/* Modale édition */}
			{editing && spec && (
				<EditModal
					mode="edit"
					row={editing}
					spec={spec}
					onClose={() => setEditing(null)}
					onSave={(body) => {
						const id = editing[spec.pk];
						update.mutate({ id, body });
					}}
					saving={update.isPending}
				/>
			)}

			{/* Modale confirmation suppression */}
			{deleteTarget && spec && (
				<DeleteModal
					rowId={String(deleteTarget[spec.pk])}
					tableName={humanLabel}
					onClose={() => setDeleteTarget(null)}
					onConfirm={() => remove.mutate(deleteTarget[spec.pk])}
					deleting={remove.isPending}
				/>
			)}
		</div>
	);
}

function renderCell(v: unknown, col?: string): ReactNode {
	if (v === null || v === undefined) return <span className="text-white/25">—</span>;
	if (typeof v === "boolean") return v ? "Oui" : "Non";
	if (typeof v === "object")
		return (
			<code className="text-[10px] text-white/50 font-mono">{JSON.stringify(v).slice(0, 60)}</code>
		);
	const s = String(v);

	// Détection image : chemin DB relatif type "./assets/dbz/characters/goku.webp"
	// → résolu vers le host du bot (bot.dragonballfr.com) via assetUrl (strip "./", pas de /db/).
	const isImageCol = col && /image|cover|poster|photo|avatar/i.test(col);
	const isImagePath = /\.(png|jpe?g|webp|gif|avif)$/i.test(s);
	if (isImageCol && isImagePath && s.length < 200) {
		const src = assetUrl(s);
		return (
			<a href={src} target="_blank" rel="noreferrer" className="inline-block">
				<img
					src={src}
					alt=""
					loading="lazy"
					className="h-10 w-10 rounded object-cover border border-dbz-border"
				/>
			</a>
		);
	}

	// URL externe http(s) → lien tronqué
	if (/^https?:\/\//.test(s)) {
		return (
			<a
				href={s}
				target="_blank"
				rel="noreferrer"
				className="text-dbz-orange/80 hover:text-dbz-orange hover:underline"
			>
				{s.length > 45 ? `${s.slice(0, 45)}…` : s}
			</a>
		);
	}

	// Timestamp numérique Unix ms ou s
	if (col && /date|at$/i.test(col) && /^\d{10,13}$/.test(s)) {
		const ms = s.length === 10 ? Number(s) * 1000 : Number(s);
		return <span className="text-white/70">{new Date(ms).toLocaleDateString("fr-FR")}</span>;
	}

	return <span className="font-mono text-white/80">{s}</span>;
}

interface EditProps {
	row: Record<string, unknown>;
	spec: TableSpec;
	onClose: () => void;
	onSave: (body: Record<string, unknown>) => void;
	saving: boolean;
	mode: "create" | "edit";
}

function EditModal({ row, spec, onClose, onSave, saving, mode }: EditProps) {
	const [draft, setDraft] = useState<Record<string, string>>(() =>
		Object.fromEntries(spec.mutableColumns.map((c) => [c, row[c] != null ? String(row[c]) : ""]))
	);

	const submit = () => {
		const body: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(draft)) {
			if (v === "") continue;
			const original = row[k];
			if (typeof original === "number") body[k] = Number(v);
			else if (typeof original === "boolean") body[k] = v === "true" || v === "1";
			// Création (pas de valeur d'origine) : on déduit le type depuis le texte
			else if (original == null && /^-?\d+(\.\d+)?$/.test(v)) body[k] = Number(v);
			else if (original == null && (v === "true" || v === "false")) body[k] = v === "true";
			else body[k] = v;
		}
		onSave(body);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur">
			<div className="dbz-panel w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6">
				<div className="mb-5 flex items-center justify-between">
					<div>
						<h3 className="font-saiyan text-lg uppercase text-dbz-orange">
							{mode === "create" ? "Nouvelle entrée" : "Modifier l'entrée"}
						</h3>
						<p className="text-xs text-white/40 font-mono mt-0.5">
							{mode === "create"
								? spec.name
								: `${spec.name} · ${spec.pk} = ${String(row[spec.pk])}`}
						</p>
					</div>
					<button type="button" onClick={onClose} className="btn btn-ghost px-2">
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="space-y-3">
					{spec.mutableColumns.map((c) => (
						<div key={c}>
							<label className="mb-1 block text-xs font-semibold text-dbz-blue-light uppercase tracking-wider">
								{colLabel(c)}
								<span className="ml-2 text-white/25 font-mono normal-case font-normal">{c}</span>
							</label>
							<input
								className="input font-mono text-sm"
								value={draft[c] ?? ""}
								onChange={(e) => setDraft({ ...draft, [c]: e.target.value })}
								placeholder={String(row[c] ?? "")}
							/>
						</div>
					))}
				</div>

				<div className="mt-5 flex justify-end gap-2 border-t border-dbz-border/40 pt-4">
					<button type="button" onClick={onClose} className="btn btn-ghost">
						Annuler
					</button>
					<button type="button" onClick={submit} disabled={saving} className="btn btn-primary">
						<Save className="h-3 w-3" />
						{saving ? "Enregistrement…" : "Enregistrer les modifications"}
					</button>
				</div>
			</div>
		</div>
	);
}

interface DeleteProps {
	rowId: string;
	tableName: string;
	onClose: () => void;
	onConfirm: () => void;
	deleting: boolean;
}

function DeleteModal({ rowId, tableName, onClose, onConfirm, deleting }: DeleteProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur">
			<div className="dbz-panel w-full max-w-md p-6">
				<div className="mb-4 flex items-center gap-3">
					<AlertTriangle className="h-6 w-6 text-red-400 shrink-0" />
					<h3 className="font-saiyan text-lg uppercase text-red-400">Supprimer cette entrée ?</h3>
				</div>
				<p className="text-sm text-white/70 mb-1">
					Vous êtes sur le point de supprimer l&apos;entrée{" "}
					<code className="text-dbz-orange font-mono text-xs">{rowId}</code> de la section{" "}
					<strong className="text-white">{tableName}</strong>.
				</p>
				<p className="text-sm text-red-400/80 font-semibold mb-6">Cette action est irréversible.</p>
				<div className="flex justify-end gap-2">
					<button type="button" onClick={onClose} className="btn btn-ghost" disabled={deleting}>
						Annuler
					</button>
					<button type="button" onClick={onConfirm} disabled={deleting} className="btn btn-danger">
						<Trash2 className="h-3.5 w-3.5" />
						{deleting ? "Suppression…" : "Oui, supprimer définitivement"}
					</button>
				</div>
			</div>
		</div>
	);
}
