"use client";

/**
 * Champ markdown riche réutilisable (description d'entité wiki, articles…) :
 * barre de mise en forme, insertion d'images/gifs **avec taille + placement**,
 * et badge « niveau de puissance » (Ki) embarquable n'importe où (contexte +
 * valeur). Contrôlé (`value`/`onChange`). Aperçu live optionnel (le studio a déjà
 * son propre aperçu → `preview={false}`).
 */
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import CodeMirror, { oneDark } from "@uiw/react-codemirror";
import { Gauge, ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";

const CM_EXTENSIONS = [
	markdown({ base: markdownLanguage, codeLanguages: languages }),
	EditorView.lineWrapping,
];

const IMG_SIZES = [
	{ key: "sm", label: "Petite" },
	{ key: "md", label: "Moyenne" },
	{ key: "lg", label: "Grande" },
	{ key: "full", label: "Pleine" },
];
const PLACEMENTS = [
	{ key: "center", label: "Centrée", cls: "wiki-img" },
	{ key: "left", label: "À gauche", cls: "wiki-float-left" },
	{ key: "right", label: "À droite", cls: "wiki-float-right" },
];

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/** Neutralise HTML + spécials markdown (le texte du badge est inline dans du md). */
function escapeBadge(s: string): string {
	return escapeHtml(s).replace(/[\\`*_[\]()#~|]/g, (c) => `\\${c}`);
}

function imageSnippet(path: string, sizeKey: string, placeKey: string): string {
	const size = IMG_SIZES.find((s) => s.key === sizeKey) ?? IMG_SIZES[1];
	const place = PLACEMENTS.find((p) => p.key === placeKey) ?? PLACEMENTS[0];
	return `\n<figure class="${place.cls} wiki-size-${size.key}">\n  <img src="${path}" alt="" />\n</figure>\n\n`;
}

function kiSnippet(ctx: string, val: string): string {
	return ` <span class="ki-power"><span class="ki-power-ctx">${escapeBadge(
		ctx.trim()
	)}</span><span class="ki-power-val">${escapeBadge(val.trim())}</span></span> `;
}

interface Props {
	value: string;
	onChange: (v: string) => void;
	subdir?: string;
	preview?: boolean;
}

export function MarkdownField({ value, onChange, subdir = "inline", preview = false }: Props) {
	const viewRef = useRef<EditorView | null>(null);
	const fileRef = useRef<HTMLInputElement | null>(null);
	const busyRef = useRef(false);
	const [size, setSize] = useState("md");
	const [placement, setPlacement] = useState("center");
	const [uploading, setUploading] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [err, setErr] = useState<string | null>(null);
	const [kiOpen, setKiOpen] = useState(false);
	const [kiCtx, setKiCtx] = useState("");
	const [kiVal, setKiVal] = useState("");

	function insertAtCursor(text: string) {
		const view = viewRef.current;
		if (!view) {
			onChange(value + text);
			return;
		}
		const { from, to } = view.state.selection.main;
		view.dispatch({ changes: { from, to, insert: text }, selection: { anchor: from + text.length } });
		view.focus();
	}

	function wrap(before: string, after: string, placeholder = "texte") {
		const view = viewRef.current;
		if (!view) return;
		const { from, to } = view.state.selection.main;
		const sel = view.state.sliceDoc(from, to) || placeholder;
		view.dispatch({
			changes: { from, to, insert: before + sel + after },
			selection: { anchor: from + before.length, head: from + before.length + sel.length },
		});
		view.focus();
	}

	function prefix(p: string) {
		const view = viewRef.current;
		if (!view) return;
		const { from, to } = view.state.selection.main;
		const lineStart = view.state.doc.lineAt(from).from;
		const block = view.state.sliceDoc(lineStart, to) || "texte";
		const out = block
			.split("\n")
			.map((l) => p + l)
			.join("\n");
		view.dispatch({ changes: { from: lineStart, to, insert: out } });
		view.focus();
	}

	async function upload(file: File) {
		if (!file.type.startsWith("image/")) {
			setErr("Le fichier n'est pas une image.");
			return;
		}
		if (busyRef.current) return;
		busyRef.current = true;
		setErr(null);
		setUploading(true);
		try {
			const fd = new FormData();
			fd.append("file", file, file.name);
			fd.append("subdir", subdir);
			const res = await fetch("/api/admin/upload", {
				method: "POST",
				body: fd,
				credentials: "same-origin",
			});
			const data = (await res.json().catch(() => ({}))) as { path?: string; error?: string };
			if (!res.ok || !data.path) throw new Error(data.error ?? `Upload échoué (${res.status}).`);
			insertAtCursor(imageSnippet(data.path, size, placement));
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Upload échoué.");
		} finally {
			setUploading(false);
			busyRef.current = false;
		}
	}

	const FORMATS: { label: string; title: string; run: () => void }[] = [
		{ label: "B", title: "Gras", run: () => wrap("**", "**") },
		{ label: "I", title: "Italique", run: () => wrap("*", "*") },
		{ label: "H2", title: "Titre", run: () => prefix("## ") },
		{ label: "H3", title: "Sous-titre", run: () => prefix("### ") },
		{ label: "•", title: "Liste", run: () => prefix("- ") },
		{ label: "”", title: "Citation", run: () => prefix("> ") },
		{ label: "🔗", title: "Lien", run: () => wrap("[", "](https://)", "texte du lien") },
	];

	const editor = (
		<div
			className="relative"
			onDragOver={(e) => {
				if (Array.from(e.dataTransfer.types).includes("Files")) {
					e.preventDefault();
					if (!dragging) setDragging(true);
				}
			}}
			onDragLeave={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
			}}
			onDrop={(e) => {
				e.preventDefault();
				setDragging(false);
				const f = Array.from(e.dataTransfer.files).find((x) => x.type.startsWith("image/"));
				if (f) void upload(f);
				else if (e.dataTransfer.files.length) setErr("Le fichier déposé n'est pas une image.");
			}}
			onPaste={(e) => {
				const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith("image/"));
				if (f) {
					e.preventDefault();
					void upload(f);
				}
			}}
		>
			<CodeMirror
				value={value}
				onChange={onChange}
				onCreateEditor={(view) => {
					viewRef.current = view;
				}}
				extensions={CM_EXTENSIONS}
				theme={oneDark}
				height="260px"
				placeholder="Décris l'entité… (glisse une image, ou insère un badge Ki)"
				className="overflow-hidden rounded border-2 border-dbz-border text-sm focus-within:border-dbz-orange"
			/>
			{dragging && (
				<div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded border-2 border-dashed border-dbz-orange bg-dbz-orange/10 backdrop-blur-sm">
					<span className="font-saiyan text-lg uppercase tracking-widest text-dbz-orange">
						Déposez l&apos;image
					</span>
				</div>
			)}
		</div>
	);

	return (
		<div className="space-y-2">
			{/* Barre d'outils */}
			<div className="flex flex-wrap items-center gap-1 rounded border border-dbz-border/60 bg-dbz-card/40 p-1.5">
				{FORMATS.map((f) => (
					<button
						key={f.label}
						type="button"
						title={f.title}
						onClick={f.run}
						className="min-w-7 rounded px-2 py-1 text-xs font-bold text-dbz-blue-light hover:bg-dbz-bg hover:text-dbz-yellow"
					>
						{f.label}
					</button>
				))}
				<span className="mx-1 text-dbz-border">|</span>
				{/* Image : taille + placement + upload */}
				<select
					value={size}
					onChange={(e) => setSize(e.target.value)}
					className="input h-7 w-auto px-1 py-0 text-xs"
					title="Taille de l'image"
				>
					{IMG_SIZES.map((s) => (
						<option key={s.key} value={s.key}>
							{s.label}
						</option>
					))}
				</select>
				<select
					value={placement}
					onChange={(e) => setPlacement(e.target.value)}
					className="input h-7 w-auto px-1 py-0 text-xs"
					title="Placement de l'image"
				>
					{PLACEMENTS.map((p) => (
						<option key={p.key} value={p.key}>
							{p.label}
						</option>
					))}
				</select>
				<button
					type="button"
					onClick={() => fileRef.current?.click()}
					disabled={uploading}
					className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-dbz-blue-light hover:bg-dbz-bg hover:text-dbz-yellow disabled:opacity-50"
				>
					{uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImagePlus className="h-3 w-3" />}
					Image
				</button>
				<input
					ref={fileRef}
					type="file"
					accept="image/png,image/jpeg,image/webp,image/gif"
					className="hidden"
					onChange={(e) => {
						const f = e.target.files?.[0];
						e.target.value = "";
						if (f) void upload(f);
					}}
				/>
				<span className="mx-1 text-dbz-border">|</span>
				<button
					type="button"
					onClick={() => setKiOpen((o) => !o)}
					title="Insérer un niveau de puissance (Ki) avec son contexte"
					className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${
						kiOpen ? "bg-dbz-orange/20 text-dbz-orange" : "text-dbz-blue-light hover:bg-dbz-bg hover:text-dbz-yellow"
					}`}
				>
					<Gauge className="h-3 w-3" /> Ki
				</button>
			</div>

			{/* Mini-formulaire d'insertion de Ki */}
			{kiOpen && (
				<div className="flex flex-wrap items-end gap-2 rounded border border-dbz-orange/30 bg-dbz-orange/5 p-2">
					<div>
						<label className="mb-0.5 block text-[10px] uppercase tracking-wider text-white/50">
							Contexte (saga / moment)
						</label>
						<input
							className="input h-8 text-sm"
							placeholder="Saga Saiyan"
							value={kiCtx}
							onChange={(e) => setKiCtx(e.target.value)}
						/>
					</div>
					<div>
						<label className="mb-0.5 block text-[10px] uppercase tracking-wider text-white/50">
							Valeur de Ki
						</label>
						<input
							className="input h-8 text-sm"
							placeholder="8 000"
							value={kiVal}
							onChange={(e) => setKiVal(e.target.value)}
						/>
					</div>
					<button
						type="button"
						disabled={!kiVal.trim()}
						onClick={() => {
							insertAtCursor(kiSnippet(kiCtx || "Ki", kiVal));
							setKiCtx("");
							setKiVal("");
							setKiOpen(false);
						}}
						className="btn btn-primary h-8"
					>
						Insérer
					</button>
					<span className="text-[10px] text-white/40">
						S&apos;insère au curseur — répète-le pour chaque palier de puissance.
					</span>
				</div>
			)}

			{err && <p className="text-xs text-red-400">{err}</p>}

			{preview ? (
				<div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
					{editor}
					<div className="dbz-panel overflow-auto p-4">
						<span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
							Aperçu
						</span>
						<div className="prose prose-invert wiki-content max-w-none text-sm">
							{value.trim() ? (
								<WikiMarkdown body={value} />
							) : (
								<p className="italic text-white/30">L&apos;aperçu s&apos;affiche ici…</p>
							)}
						</div>
					</div>
				</div>
			) : (
				editor
			)}
		</div>
	);
}
