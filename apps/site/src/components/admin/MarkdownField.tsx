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
import { Film, Gauge, ImagePlus, LayoutTemplate, ListTree, Loader2, Palette } from "lucide-react";
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

/**
 * Catégorie/section repliable au nom LIBRE (sous-catégorie). Bloc `<details>`
 * natif → la page publique le replie par défaut (page compacte). Le nom est
 * totalement libre (arc, « Histoire », « Pouvoirs », « Relations »…) : aucune
 * liste figée. Les lignes vides autour du contenu permettent d'y écrire du
 * markdown (images, badges Ki…). On peut en empiler autant qu'on veut.
 */
function sectionSnippet(name: string): string {
	return `\n<details class="wiki-section">\n<summary>${escapeBadge(
		name.trim() || "Section"
	)}</summary>\n\nÉcris le contenu de cette section ici…\n\n</details>\n\n`;
}

// ── Blocs « Design » : du HTML que le sanitizer ouvert rend tel quel. Les
// lignes vides autour du contenu permettent d'écrire du markdown DEDANS (même
// astuce que <details>). ────────────────────────────────────────────────────
function escapeAttr(s: string): string {
	return escapeHtml(s.trim());
}

/** Disposition en N colonnes (markdown autorisé dans chaque colonne). */
function colsSnippet(n: number): string {
	const cols = Array.from({ length: n }, (_, i) => `<div>\n\nColonne ${i + 1}\n\n</div>`).join(
		"\n"
	);
	return `\n<div class="wiki-cols wiki-cols-${n}">\n${cols}\n</div>\n\n`;
}

const CALLOUTS = [
	{ key: "info", label: "Info (bleu)" },
	{ key: "success", label: "Succès (vert)" },
	{ key: "warn", label: "Attention (or)" },
	{ key: "danger", label: "Danger (rouge)" },
	{ key: "neutral", label: "Neutre" },
];
function calloutSnippet(kind: string): string {
	return `\n<div class="wiki-callout wiki-callout--${kind}">\n\nÉcris ton encadré ici…\n\n</div>\n\n`;
}

function buttonSnippet(label: string, href: string): string {
	return ` <a class="wiki-btn" href="${escapeAttr(href) || "#"}">${escapeHtml(
		label.trim() || "Bouton"
	)}</a> `;
}

/** Normalise une URL YouTube (watch/short/youtu.be) vers l'URL d'embed. */
function toEmbedUrl(url: string): string {
	const m = url
		.trim()
		.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
	if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}`;
	return url.trim();
}
function embedSnippet(url: string): string {
	return `\n<div class="wiki-embed">\n<iframe src="${escapeAttr(
		toEmbedUrl(url)
	)}" title="Vidéo" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n</div>\n\n`;
}

function bannerSnippet(path: string): string {
	return `\n<figure class="wiki-banner" style="background-image:url('${escapeAttr(
		path
	)}')">\n<figcaption>Titre de la bannière</figcaption>\n</figure>\n\n`;
}

function gallerySnippet(): string {
	return `\n<div class="wiki-grid">\n<img src="" alt="" />\n<img src="" alt="" />\n<img src="" alt="" />\n</div>\n\n`;
}

function spacerSnippet(): string {
	return `\n<div class="wiki-spacer" style="height:48px"></div>\n\n`;
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
	const uploadModeRef = useRef<"image" | "banner">("image");
	const [size, setSize] = useState("md");
	const [placement, setPlacement] = useState("center");
	const [uploading, setUploading] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [err, setErr] = useState<string | null>(null);
	const [kiOpen, setKiOpen] = useState(false);
	const [kiCtx, setKiCtx] = useState("");
	const [kiVal, setKiVal] = useState("");
	const [secOpen, setSecOpen] = useState(false);
	const [secName, setSecName] = useState("");
	const [designOpen, setDesignOpen] = useState(false);
	const [calloutKind, setCalloutKind] = useState("info");
	const [btnLabel, setBtnLabel] = useState("");
	const [btnHref, setBtnHref] = useState("");
	const [embedUrl, setEmbedUrl] = useState("");
	const [textColor, setTextColor] = useState("#ffb200");

	function insertAtCursor(text: string) {
		const view = viewRef.current;
		if (!view) {
			onChange(value + text);
			return;
		}
		const { from, to } = view.state.selection.main;
		view.dispatch({
			changes: { from, to, insert: text },
			selection: { anchor: from + text.length },
		});
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
			insertAtCursor(
				uploadModeRef.current === "banner"
					? bannerSnippet(data.path)
					: imageSnippet(data.path, size, placement)
			);
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

	const designBtn =
		"rounded border border-dbz-border/60 bg-dbz-bg px-2 py-1 font-semibold text-dbz-blue-light hover:border-dbz-orange hover:text-dbz-yellow";
	const designLabel = "w-16 shrink-0 text-[10px] uppercase tracking-wider text-white/50";

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
				if (f) {
					uploadModeRef.current = "image";
					void upload(f);
				} else if (e.dataTransfer.files.length) setErr("Le fichier déposé n'est pas une image.");
			}}
			onPaste={(e) => {
				const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith("image/"));
				if (f) {
					e.preventDefault();
					uploadModeRef.current = "image";
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
					onClick={() => {
						uploadModeRef.current = "image";
						fileRef.current?.click();
					}}
					disabled={uploading}
					className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-dbz-blue-light hover:bg-dbz-bg hover:text-dbz-yellow disabled:opacity-50"
				>
					{uploading ? (
						<Loader2 className="h-3 w-3 animate-spin" />
					) : (
						<ImagePlus className="h-3 w-3" />
					)}
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
						kiOpen
							? "bg-dbz-orange/20 text-dbz-orange"
							: "text-dbz-blue-light hover:bg-dbz-bg hover:text-dbz-yellow"
					}`}
				>
					<Gauge className="h-3 w-3" /> Ki
				</button>
				<button
					type="button"
					onClick={() => setSecOpen((o) => !o)}
					title="Insérer une catégorie repliable (nom libre) pour trier le contenu"
					className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${
						secOpen
							? "bg-dbz-orange/20 text-dbz-orange"
							: "text-dbz-blue-light hover:bg-dbz-bg hover:text-dbz-yellow"
					}`}
				>
					<ListTree className="h-3 w-3" /> Section
				</button>
				<button
					type="button"
					onClick={() => setDesignOpen((o) => !o)}
					title="Blocs de mise en page : colonnes, encadrés, bouton, bannière, vidéo, couleurs…"
					className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${
						designOpen
							? "bg-dbz-orange/20 text-dbz-orange"
							: "text-dbz-blue-light hover:bg-dbz-bg hover:text-dbz-yellow"
					}`}
				>
					<LayoutTemplate className="h-3 w-3" /> Design
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
					<span className="text-[10px] text-white/50">
						S&apos;insère au curseur — répète-le pour chaque palier de puissance.
					</span>
				</div>
			)}

			{/* Mini-formulaire d'insertion de section repliable (par arc) */}
			{secOpen && (
				<div className="flex flex-wrap items-end gap-2 rounded border border-dbz-orange/30 bg-dbz-orange/5 p-2">
					<div>
						<label className="mb-0.5 block text-[10px] uppercase tracking-wider text-white/50">
							Nom de la catégorie (libre)
						</label>
						<input
							className="input h-8 text-sm"
							placeholder="Ex. Histoire, Pouvoirs, Saga des Saiyans…"
							value={secName}
							onChange={(e) => setSecName(e.target.value)}
						/>
					</div>
					<button
						type="button"
						disabled={!secName.trim()}
						onClick={() => {
							insertAtCursor(sectionSnippet(secName));
							setSecName("");
							setSecOpen(false);
						}}
						className="btn btn-primary h-8"
					>
						Insérer
					</button>
					<span className="text-[10px] text-white/50">
						Catégorie au nom de ton choix — écris dedans (images, badges Ki…). Empiles-en autant que
						tu veux.
					</span>
				</div>
			)}

			{/* Panneau Design — blocs de mise en page (HTML rendu tel quel par le wiki) */}
			{designOpen && (
				<div className="space-y-2 rounded border border-dbz-orange/30 bg-dbz-orange/5 p-2.5 text-xs">
					<div className="flex flex-wrap items-center gap-1.5">
						<span className={designLabel}>Colonnes</span>
						<button
							type="button"
							className={designBtn}
							onClick={() => insertAtCursor(colsSnippet(2))}
						>
							2 colonnes
						</button>
						<button
							type="button"
							className={designBtn}
							onClick={() => insertAtCursor(colsSnippet(3))}
						>
							3 colonnes
						</button>
						<button
							type="button"
							className={designBtn}
							onClick={() => insertAtCursor(gallerySnippet())}
						>
							Galerie d'images
						</button>
					</div>

					<div className="flex flex-wrap items-center gap-1.5">
						<span className={designLabel}>Encadré</span>
						<select
							value={calloutKind}
							onChange={(e) => setCalloutKind(e.target.value)}
							className="input h-7 w-auto px-1 py-0 text-xs"
						>
							{CALLOUTS.map((c) => (
								<option key={c.key} value={c.key}>
									{c.label}
								</option>
							))}
						</select>
						<button
							type="button"
							className={designBtn}
							onClick={() => insertAtCursor(calloutSnippet(calloutKind))}
						>
							Insérer l'encadré
						</button>
					</div>

					<div className="flex flex-wrap items-center gap-1.5">
						<span className={designLabel}>Bouton</span>
						<input
							className="input h-7 w-28 text-xs"
							placeholder="Libellé"
							value={btnLabel}
							onChange={(e) => setBtnLabel(e.target.value)}
						/>
						<input
							className="input h-7 w-44 text-xs"
							placeholder="https://…"
							value={btnHref}
							onChange={(e) => setBtnHref(e.target.value)}
						/>
						<button
							type="button"
							className={designBtn}
							onClick={() => {
								insertAtCursor(buttonSnippet(btnLabel, btnHref));
								setBtnLabel("");
								setBtnHref("");
							}}
						>
							Insérer
						</button>
					</div>

					<div className="flex flex-wrap items-center gap-1.5">
						<span className={designLabel}>Vidéo</span>
						<input
							className="input h-7 w-56 text-xs"
							placeholder="URL YouTube (watch / short / youtu.be)…"
							value={embedUrl}
							onChange={(e) => setEmbedUrl(e.target.value)}
						/>
						<button
							type="button"
							disabled={!embedUrl.trim()}
							className={`${designBtn} inline-flex items-center gap-1 disabled:opacity-40`}
							onClick={() => {
								insertAtCursor(embedSnippet(embedUrl));
								setEmbedUrl("");
							}}
						>
							<Film className="h-3 w-3" /> Insérer
						</button>
					</div>

					<div className="flex flex-wrap items-center gap-1.5">
						<span className={designLabel}>Bannière</span>
						<button
							type="button"
							className={designBtn}
							onClick={() => {
								uploadModeRef.current = "banner";
								fileRef.current?.click();
							}}
						>
							Choisir une image…
						</button>
						<span className="text-[10px] text-white/50">Image de fond + titre superposé.</span>
					</div>

					<div className="flex flex-wrap items-center gap-1.5">
						<span className={designLabel}>Texte</span>
						<Palette className="h-3.5 w-3.5 text-white/50" />
						<input
							type="color"
							value={textColor}
							onChange={(e) => setTextColor(e.target.value)}
							className="h-7 w-9 cursor-pointer rounded border border-dbz-border/60 bg-transparent p-0.5"
							title="Couleur du texte"
						/>
						<button
							type="button"
							className={designBtn}
							onClick={() => wrap(`<span style="color:${textColor}">`, "</span>")}
						>
							Colorer la sélection
						</button>
						<span className="mx-1 text-dbz-border">|</span>
						<button
							type="button"
							className={designBtn}
							title="Aligner à gauche"
							onClick={() => wrap('\n<div style="text-align:left">\n\n', "\n\n</div>\n\n")}
						>
							⟸
						</button>
						<button
							type="button"
							className={designBtn}
							title="Centrer"
							onClick={() => wrap('\n<div style="text-align:center">\n\n', "\n\n</div>\n\n")}
						>
							≡
						</button>
						<button
							type="button"
							className={designBtn}
							title="Aligner à droite"
							onClick={() => wrap('\n<div style="text-align:right">\n\n', "\n\n</div>\n\n")}
						>
							⟹
						</button>
						<button
							type="button"
							className={designBtn}
							title="Justifier"
							onClick={() => wrap('\n<div style="text-align:justify">\n\n', "\n\n</div>\n\n")}
						>
							☰
						</button>
						<span className="mx-1 text-dbz-border">|</span>
						<button
							type="button"
							className={designBtn}
							onClick={() => insertAtCursor("\n\n---\n\n")}
						>
							Séparateur
						</button>
						<button
							type="button"
							className={designBtn}
							onClick={() => insertAtCursor(spacerSnippet())}
						>
							Espace
						</button>
					</div>

					<p className="text-[10px] leading-snug text-white/50">
						Tu peux aussi écrire du HTML/CSS libre directement (mise en page, couleurs, polices…).
						Seul le JavaScript est bloqué pour la sécurité du site.
					</p>
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
								<p className="italic text-white/50">L&apos;aperçu s&apos;affiche ici…</p>
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
