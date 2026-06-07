"use client";

/**
 * Éditeur de page wiki : markdown + HTML, preview live côté à côté, upload
 * d'images (insère le snippet à la position du curseur) et raccourcis de mise
 * en page (figure flottante, infobox, galerie). Utilisé en création et édition.
 */
import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { uploadWikiImage } from "@/app/admin/wiki/_actions";
import CodeMirror, { oneDark } from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { useRef, useState, useTransition } from "react";

type Category = { id: string; name: string };

type Placement = "inline" | "wiki-float-right" | "wiki-float-left";

// Extensions CodeMirror (constantes : pas de recréation par rendu).
const CM_EXTENSIONS = [
	markdown({ base: markdownLanguage, codeLanguages: languages }),
	EditorView.lineWrapping,
];

const SNIPPETS: { label: string; insert: string }[] = [
	{
		label: "Infobox",
		insert: '\n<aside class="wiki-infobox">\n\n**Titre**\n\n- Champ : valeur\n\n</aside>\n\n',
	},
	{
		label: "Galerie",
		insert:
			'\n<div class="wiki-grid">\n  <img src="URL1" alt="" />\n  <img src="URL2" alt="" />\n</div>\n\n',
	},
	{ label: "Saut (clear)", insert: '\n<div class="wiki-clear"></div>\n\n' },
];

export function WikiEditor({
	categories,
	action,
	initial,
	submitLabel,
	defaultCategoryId,
}: {
	categories: Category[];
	action: (formData: FormData) => void | Promise<void>;
	initial?: {
		title?: string;
		categoryId?: string;
		body?: string;
		order?: number;
	};
	submitLabel: string;
	defaultCategoryId?: string;
}) {
	const [body, setBody] = useState(initial?.body ?? "");
	const [placement, setPlacement] = useState<Placement>("wiki-float-right");
	const [uploadErr, setUploadErr] = useState<string | null>(null);
	const [uploading, startUpload] = useTransition();
	const viewRef = useRef<EditorView | null>(null);

	// Insère du texte à la position du curseur (ou en fin de doc si l'éditeur n'est pas prêt).
	function insertAtCursor(text: string) {
		const view = viewRef.current;
		if (!view) {
			setBody((b) => b + text);
			return;
		}
		const { from, to } = view.state.selection.main;
		const caret = from + text.length;
		view.dispatch({
			changes: { from, to, insert: text },
			selection: { anchor: caret },
		});
		view.focus();
	}

	// Entoure la sélection (ex. **gras**) ; insère un placeholder si rien n'est sélectionné.
	function wrapSelection(before: string, after: string, placeholder = "texte") {
		const view = viewRef.current;
		if (!view) return;
		const { from, to } = view.state.selection.main;
		const sel = view.state.sliceDoc(from, to) || placeholder;
		view.dispatch({
			changes: { from, to, insert: before + sel + after },
			selection: {
				anchor: from + before.length,
				head: from + before.length + sel.length,
			},
		});
		view.focus();
	}

	// Préfixe chaque ligne de la sélection (titres, listes, citations).
	function prefixLines(prefix: string) {
		const view = viewRef.current;
		if (!view) return;
		const { from, to } = view.state.selection.main;
		const lineStart = view.state.doc.lineAt(from).from;
		const block = view.state.sliceDoc(lineStart, to) || "texte";
		const prefixed = block
			.split("\n")
			.map((l) => prefix + l)
			.join("\n");
		view.dispatch({
			changes: { from: lineStart, to, insert: prefixed },
			selection: { anchor: lineStart, head: lineStart + prefixed.length },
		});
		view.focus();
	}

	const FORMATS: { label: string; title: string; run: () => void }[] = [
		{ label: "B", title: "Gras", run: () => wrapSelection("**", "**") },
		{ label: "I", title: "Italique", run: () => wrapSelection("*", "*") },
		{ label: "H2", title: "Titre", run: () => prefixLines("## ") },
		{ label: "H3", title: "Sous-titre", run: () => prefixLines("### ") },
		{ label: "•", title: "Liste", run: () => prefixLines("- ") },
		{ label: "”", title: "Citation", run: () => prefixLines("> ") },
		{
			label: "🔗",
			title: "Lien",
			run: () => wrapSelection("[", "](https://)", "texte du lien"),
		},
		{ label: "</>", title: "Code", run: () => wrapSelection("`", "`", "code") },
	];

	function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;
		setUploadErr(null);
		const fd = new FormData();
		fd.append("file", file);
		startUpload(async () => {
			const res = await uploadWikiImage(fd);
			if ("error" in res) {
				setUploadErr(res.error);
				return;
			}
			const snippet =
				placement === "inline"
					? `\n\n![](${res.url})\n\n`
					: `\n<figure class="${placement}">\n  <img src="${res.url}" alt="" />\n  <figcaption>Légende</figcaption>\n</figure>\n\n`;
			insertAtCursor(snippet);
		});
	}

	return (
		<form action={action} className="space-y-4">
			<div className="dbz-panel p-6 space-y-4">
				<div>
					<label className="block text-xs uppercase tracking-widest text-dbz-blue-light mb-2">
						Titre
					</label>
					<input
						name="title"
						required
						defaultValue={initial?.title}
						className="w-full p-3 bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange outline-none font-bold text-white"
						placeholder="Ex: Goku Saiyan"
					/>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="sm:col-span-2">
						<label className="block text-xs uppercase tracking-widest text-dbz-blue-light mb-2">
							Catégorie
						</label>
						<select
							name="categoryId"
							required
							defaultValue={initial?.categoryId ?? defaultCategoryId ?? ""}
							className="w-full p-3 bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange outline-none text-white"
						>
							<option value="">— Sélectionner —</option>
							{categories.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-xs uppercase tracking-widest text-dbz-blue-light mb-2">
							Ordre
						</label>
						<input
							type="number"
							name="order"
							defaultValue={initial?.order ?? 0}
							className="w-full p-3 bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange outline-none text-white"
						/>
					</div>
				</div>
			</div>

			{/* Barre de formatage markdown */}
			<div className="dbz-panel p-3 flex flex-wrap items-center gap-1">
				{FORMATS.map((f) => (
					<button
						key={f.label}
						type="button"
						title={f.title}
						onClick={f.run}
						className="min-w-9 px-2.5 py-1.5 text-sm font-bold text-dbz-blue-light hover:text-dbz-yellow hover:bg-dbz-bg border-2 border-transparent hover:border-dbz-border rounded transition-colors"
					>
						{f.label}
					</button>
				))}
			</div>

			{/* Barre d'outils : upload image + raccourcis de mise en page */}
			<div className="dbz-panel p-4 flex flex-wrap items-center gap-3">
				<select
					value={placement}
					onChange={(e) => setPlacement(e.target.value as Placement)}
					className="p-2 text-sm bg-dbz-bg border-2 border-dbz-border outline-none text-white"
					aria-label="Placement de l'image"
				>
					<option value="wiki-float-right">Image → flottante droite</option>
					<option value="wiki-float-left">Image → flottante gauche</option>
					<option value="inline">Image → pleine largeur</option>
				</select>
				<label className="dbz-button !text-sm cursor-pointer">
					{uploading ? "ENVOI…" : "+ IMAGE"}
					<input
						type="file"
						accept="image/png,image/jpeg,image/webp,image/gif"
						className="hidden"
						onChange={onPickFile}
						disabled={uploading}
					/>
				</label>
				<span className="text-dbz-border">|</span>
				{SNIPPETS.map((s) => (
					<button
						key={s.label}
						type="button"
						onClick={() => insertAtCursor(s.insert)}
						className="font-saiyan text-xs uppercase tracking-wider text-dbz-blue-light hover:text-dbz-yellow"
					>
						+ {s.label}
					</button>
				))}
				{uploadErr && <span className="text-sm text-red-400">⚠ {uploadErr}</span>}
			</div>

			{/* Éditeur + preview côte à côte */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="dbz-panel p-4">
					<label className="block text-xs uppercase tracking-widest text-dbz-blue-light mb-2">
						Contenu (markdown + HTML)
					</label>
					{/* CodeMirror ne produit pas de champ form : un input caché alimente FormData. */}
					<input type="hidden" name="body" value={body} />
					<CodeMirror
						value={body}
						onChange={setBody}
						onCreateEditor={(view) => {
							viewRef.current = view;
						}}
						extensions={CM_EXTENSIONS}
						theme={oneDark}
						height="540px"
						placeholder="# Goku&#10;&#10;Le légendaire Saiyan élevé sur Terre…"
						className="border-2 border-dbz-border focus-within:border-dbz-orange text-sm overflow-hidden"
					/>
					<p className="text-xs text-gray-500 mt-2">
						Classes dispo : <code>wiki-float-right</code>, <code>wiki-float-left</code>,{" "}
						<code>wiki-infobox</code>, <code>wiki-grid</code>, <code>wiki-clear</code>.
					</p>
				</div>
				<div className="dbz-panel p-4 overflow-auto">
					<span className="block text-xs uppercase tracking-widest text-dbz-blue-light mb-2">
						Aperçu
					</span>
					<div className="prose prose-invert max-w-none wiki-content">
						{body.trim() ? (
							<WikiMarkdown body={body} />
						) : (
							<p className="text-gray-600 italic">L'aperçu s'affiche ici…</p>
						)}
					</div>
				</div>
			</div>

			<button type="submit" className="dbz-button w-full !text-lg mt-2">
				{submitLabel}
			</button>
		</form>
	);
}
