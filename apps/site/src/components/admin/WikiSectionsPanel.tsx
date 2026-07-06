"use client";

/**
 * Gestion des **sections de contenu** d'une entité wiki depuis le studio
 * (`bot.db_wiki_sections`) : blocs markdown nommés (« Histoire », « Personnalité »,
 * « Anecdotes », « PWS »…) qui composent le sélecteur de catégories de la fiche
 * publique. Ajout par preset ou libellé libre, réordonnancement, masquage
 * individuel, édition riche (MarkdownField) et suppression.
 *
 * Écrit via le CRUD wiki (`/api/wiki-admin/db_wiki_sections`) — la page publique
 * lit `getWikiSections` (server-only). Monté uniquement en mode édition (l'entité
 * doit exister pour porter des sections).
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ChevronDown,
	ChevronUp,
	Eye,
	EyeOff,
	Layers,
	Loader2,
	Plus,
	Save,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { MarkdownField } from "@/components/admin/MarkdownField";
import { apiAt } from "@/lib/admin-api";
import { SECTION_PRESETS, sectionKeyFromLabel, uploadSubdir } from "@/lib/wiki-fields";
import { crudBase } from "@/lib/wiki-tables";

interface Section {
	id: number;
	entityType: string;
	entityId: number;
	key: string;
	label: string;
	accent: string | null;
	body: string | null;
	sortOrder: number;
	visible: boolean;
}

const ACCENTS = [
	{ key: "orange", label: "Orange", dot: "bg-dbz-orange" },
	{ key: "blue", label: "Bleu", dot: "bg-dbz-blue-light" },
	{ key: "red", label: "Rouge", dot: "bg-dbz-red" },
];

export function WikiSectionsPanel({
	table,
	entityId,
	entityType,
}: {
	table: string;
	entityId: string;
	entityType: string;
}) {
	const qc = useQueryClient();
	const client = apiAt(crudBase("db_wiki_sections"));
	const [customLabel, setCustomLabel] = useState("");

	const key = ["wiki-sections", entityType, entityId];
	const invalidate = () => qc.invalidateQueries({ queryKey: key });

	const query = useQuery({
		queryKey: key,
		queryFn: () =>
			client.get<{ items: Section[] }>(
				`/db_wiki_sections?as=sectionsFor&entityType=${encodeURIComponent(entityType)}&entityId=${encodeURIComponent(entityId)}`
			),
	});
	const sections = query.data?.items ?? [];

	const add = useMutation({
		mutationFn: (preset: { key: string; label: string; accent: string }) =>
			client.post(`/db_wiki_sections`, {
				entityType,
				entityId,
				key: preset.key,
				label: preset.label,
				accent: preset.accent,
				body: "",
				sortOrder: sections.length,
			}),
		onSuccess: invalidate,
	});

	const reorder = useMutation({
		mutationFn: async (orderedIds: number[]) => {
			await Promise.all(
				orderedIds.map((id, i) => client.patch(`/db_wiki_sections/${id}`, { sortOrder: i }))
			);
		},
		onSuccess: invalidate,
	});

	function move(index: number, dir: -1 | 1) {
		const next = index + dir;
		if (next < 0 || next >= sections.length) return;
		const ids = sections.map((s) => s.id);
		[ids[index], ids[next]] = [ids[next], ids[index]];
		reorder.mutate(ids);
	}

	function addCustom() {
		const label = customLabel.trim();
		if (!label) return;
		add.mutate({ key: sectionKeyFromLabel(label), label, accent: "orange" });
		setCustomLabel("");
	}

	return (
		<div className="dbz-panel space-y-4 p-5">
			<div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
				<Layers className="h-3.5 w-3.5" /> Sections de contenu
				<span className="text-white/30">({sections.length})</span>
				{(query.isFetching || reorder.isPending || add.isPending) && (
					<Loader2 className="h-3 w-3 animate-spin text-white/40" />
				)}
			</div>

			<p className="text-xs text-white/45">
				Blocs affichés en catégories sélectionnables sur la fiche (« Histoire », « Personnalité »,
				« Anecdotes », « PWS »…). Dès qu&apos;une fiche a des sections ici, elles définissent
				<strong className="text-white/70"> seules</strong> ses catégories (le champ « Article »
				n&apos;est plus affiché) : masquage, ordre et édition font foi. Techniques et
				transformations restent gérées dans « Relations ».
			</p>

			{query.isError ? (
				<p className="text-xs text-red-400">Chargement des sections échoué.</p>
			) : sections.length === 0 ? (
				<p className="text-xs italic text-white/30">Aucune section pour l&apos;instant.</p>
			) : (
				<div className="space-y-2">
					{sections.map((s, i) => (
						<SectionRow
							key={s.id}
							section={s}
							table={table}
							isFirst={i === 0}
							isLast={i === sections.length - 1}
							onMoveUp={() => move(i, -1)}
							onMoveDown={() => move(i, 1)}
							onChanged={invalidate}
						/>
					))}
				</div>
			)}

			{/* Ajout rapide */}
			<div className="space-y-2 border-t border-white/10 pt-3">
				<div className="flex flex-wrap gap-1.5">
					{SECTION_PRESETS.map((p) => (
						<button
							key={p.key}
							type="button"
							disabled={add.isPending}
							onClick={() => add.mutate(p)}
							className="inline-flex items-center gap-1 rounded border border-dbz-border bg-dbz-card/60 px-2 py-1 text-xs text-white/80 transition-colors hover:border-dbz-orange hover:text-white disabled:opacity-50"
						>
							<Plus className="h-3 w-3" /> {p.label}
						</button>
					))}
				</div>
				<div className="flex gap-2">
					<input
						className="input flex-1 text-sm"
						placeholder="Section personnalisée…"
						value={customLabel}
						onChange={(e) => setCustomLabel(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addCustom();
							}
						}}
					/>
					<button
						type="button"
						onClick={addCustom}
						disabled={add.isPending || !customLabel.trim()}
						className="btn btn-ghost shrink-0"
					>
						<Plus className="h-4 w-4" /> Ajouter
					</button>
				</div>
				{add.isError && <p className="text-xs text-red-400">Ajout échoué. Réessaie.</p>}
			</div>
		</div>
	);
}

function SectionRow({
	section,
	table,
	isFirst,
	isLast,
	onMoveUp,
	onMoveDown,
	onChanged,
}: {
	section: Section;
	table: string;
	isFirst: boolean;
	isLast: boolean;
	onMoveUp: () => void;
	onMoveDown: () => void;
	onChanged: () => void;
}) {
	const client = apiAt(crudBase("db_wiki_sections"));
	const [open, setOpen] = useState(false);
	const [label, setLabel] = useState(section.label);
	const [accent, setAccent] = useState(section.accent ?? "orange");
	const [body, setBody] = useState(section.body ?? "");

	const dirty =
		label !== section.label || accent !== (section.accent ?? "orange") || body !== (section.body ?? "");

	const save = useMutation({
		mutationFn: () => client.patch(`/db_wiki_sections/${section.id}`, { label, accent, body }),
		onSuccess: onChanged,
	});
	const toggleVisible = useMutation({
		mutationFn: () =>
			client.patch(`/db_wiki_sections/${section.id}`, { visible: !section.visible }),
		onSuccess: onChanged,
	});
	const remove = useMutation({
		mutationFn: () => client.delete(`/db_wiki_sections/${section.id}`),
		onSuccess: onChanged,
	});

	const dot =
		ACCENTS.find((a) => a.key === (section.accent ?? "orange"))?.dot ?? "bg-dbz-orange";

	return (
		<div className="rounded border border-dbz-border bg-dbz-card/40">
			<div className="flex items-center gap-2 px-2.5 py-2">
				<span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
				<button
					type="button"
					onClick={() => setOpen((o) => !o)}
					className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-white/90 hover:text-dbz-orange"
				>
					{section.label}
					{!section.visible && (
						<span className="ml-2 text-[10px] uppercase tracking-widest text-white/35">masquée</span>
					)}
				</button>
				<div className="flex shrink-0 items-center gap-0.5 text-white/50">
					<button
						type="button"
						title="Monter"
						disabled={isFirst}
						onClick={onMoveUp}
						className="rounded p-1 hover:text-white disabled:opacity-25"
					>
						<ChevronUp className="h-3.5 w-3.5" />
					</button>
					<button
						type="button"
						title="Descendre"
						disabled={isLast}
						onClick={onMoveDown}
						className="rounded p-1 hover:text-white disabled:opacity-25"
					>
						<ChevronDown className="h-3.5 w-3.5" />
					</button>
					<button
						type="button"
						title={section.visible ? "Masquer" : "Afficher"}
						onClick={() => toggleVisible.mutate()}
						className="rounded p-1 hover:text-white"
					>
						{section.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
					</button>
					<button
						type="button"
						title="Supprimer"
						onClick={() => {
							if (window.confirm(`Supprimer la section « ${section.label} » ?`)) remove.mutate();
						}}
						className="rounded p-1 text-red-400 hover:text-red-300"
					>
						<Trash2 className="h-3.5 w-3.5" />
					</button>
					<button
						type="button"
						onClick={() => setOpen((o) => !o)}
						className="rounded p-1 hover:text-white"
						title={open ? "Replier" : "Éditer"}
					>
						{open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
					</button>
				</div>
			</div>

			{open && (
				<div className="space-y-3 border-t border-white/10 p-3">
					<div className="flex flex-wrap gap-3">
						<label className="flex-1">
							<span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
								Titre
							</span>
							<input
								className="input text-sm"
								value={label}
								onChange={(e) => setLabel(e.target.value)}
							/>
						</label>
						<label>
							<span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
								Accent
							</span>
							<select
								className="input text-sm"
								value={accent}
								onChange={(e) => setAccent(e.target.value)}
							>
								{ACCENTS.map((a) => (
									<option key={a.key} value={a.key}>
										{a.label}
									</option>
								))}
							</select>
						</label>
					</div>
					<MarkdownField
						value={body}
						onChange={setBody}
						subdir={uploadSubdir(table)}
						preview={false}
					/>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => save.mutate()}
							disabled={save.isPending || !dirty}
							className="btn btn-primary"
						>
							<Save className="h-4 w-4" />
							{save.isPending ? "Enregistrement…" : "Enregistrer la section"}
						</button>
						{save.isError && <span className="text-xs text-red-400">Échec de l&apos;enregistrement.</span>}
						{save.isSuccess && !dirty && <span className="text-xs text-green-400">Enregistré.</span>}
					</div>
				</div>
			)}
		</div>
	);
}
