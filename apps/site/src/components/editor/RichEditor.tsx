"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import type { Editor, JSONContent } from "@tiptap/react";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Code,
	Code2,
	Heading2,
	Heading3,
	Heading4,
	Highlighter,
	ImagePlus,
	Italic,
	Link2,
	Link2Off,
	List,
	ListOrdered,
	Minus,
	Pilcrow,
	Quote,
	Redo2,
	RemoveFormatting,
	Strikethrough,
	Subscript as SubIcon,
	Superscript as SupIcon,
	Table as TableIcon,
	Trash2,
	Underline as UnderlineIcon,
	Undo2,
	// lucide-react v1 a retiré les icônes de marque (plus de logo YouTube) :
	// l'intégration vidéo est signalée par un écran de lecture générique.
	MonitorPlay as VideoEmbedIcon,
} from "lucide-react";

import { postExtensions, EMPTY_DOC } from "@/lib/tiptap";
import { assetUrl } from "@/lib/assets";
import type { PostContentDoc } from "@/db/schema";
import { cn } from "@/lib/utils";

/**
 * Éditeur riche des articles (Tiptap / ProseMirror).
 *
 * Le contenu remonte en **JSON ProseMirror**, jamais en HTML : le HTML public
 * est régénéré côté serveur depuis ce document (`lib/posts.ts`). Le navigateur
 * ne dicte donc pas le balisage publié.
 *
 * La zone de saisie porte les classes `editorial ed-prose` — les mêmes que la
 * page publique. Ce que l'admin voit en écrivant EST la mise en page finale.
 */

export type RichEditorHandle = { editor: Editor | null };

type Props = {
	initialContent: PostContentDoc | null;
	onChange: (doc: PostContentDoc, stats: { words: number; characters: number }) => void;
	placeholder?: string;
	/** Sous-dossier d'upload côté bot (namespace des images d'articles). */
	uploadSubdir?: string;
};

/** Envoie un fichier au endpoint admin et renvoie son URL absolue servie par le bot. */
async function uploadImage(file: File, subdir: string): Promise<string> {
	const body = new FormData();
	body.append("file", file);
	body.append("subdir", subdir);
	const res = await fetch("/api/admin/upload", { method: "POST", body });
	const data = (await res.json().catch(() => ({}))) as { path?: string; error?: string };
	if (!res.ok || !data.path) throw new Error(data.error ?? "Échec de l'upload.");
	return assetUrl(data.path);
}

export function RichEditor({
	initialContent,
	onChange,
	placeholder = "Commencez à écrire…",
	uploadSubdir = "articles",
}: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [linkOpen, setLinkOpen] = useState(false);
	const [linkValue, setLinkValue] = useState("");

	// `onChange` est souvent une closure recréée à chaque rendu du parent. On la
	// garde dans une ref pour ne pas avoir à recréer l'éditeur (ce qui perdrait le
	// focus et l'historique d'annulation à chaque frappe).
	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	const insertImageFiles = useCallback(
		async (editor: Editor, files: File[]) => {
			const images = files.filter((f) => f.type.startsWith("image/"));
			if (images.length === 0) return;
			setUploading(true);
			setUploadError(null);
			try {
				for (const file of images) {
					const src = await uploadImage(file, uploadSubdir);
					editor.chain().focus().setImage({ src, alt: "" }).run();
				}
			} catch (err) {
				setUploadError(err instanceof Error ? err.message : "Échec de l'upload.");
			} finally {
				setUploading(false);
			}
		},
		[uploadSubdir]
	);

	const editor = useEditor({
		// Next.js rend d'abord côté serveur : sans ce drapeau, Tiptap monte pendant
		// le SSR et provoque une erreur d'hydratation.
		immediatelyRender: false,
		extensions: [
			...postExtensions,
			Placeholder.configure({ placeholder }),
			CharacterCount.configure(),
		],
		// `PostContentDoc` est volontairement typé large côté DB (jsonb) ; Tiptap
		// attend son `JSONContent`. La validité réelle du document est vérifiée par
		// ProseMirror au montage, pas par le typage.
		content: (initialContent ?? EMPTY_DOC) as JSONContent,
		editorProps: {
			attributes: {
				class: "ed-prose focus:outline-none",
				spellcheck: "true",
			},
			// Glisser-déposer d'images depuis le bureau.
			handleDrop: (view, event) => {
				const files = Array.from(event.dataTransfer?.files ?? []);
				if (files.some((f) => f.type.startsWith("image/"))) {
					event.preventDefault();
					// `view` est l'instance ProseMirror ; l'éditeur Tiptap est capturé
					// par la closure au moment de l'appel (défini juste après).
					const ed = editorRef.current;
					if (ed) void insertImageFiles(ed, files);
					return true;
				}
				return false;
			},
			// Collage d'une capture d'écran (presse-papiers).
			handlePaste: (view, event) => {
				const files = Array.from(event.clipboardData?.files ?? []);
				if (files.some((f) => f.type.startsWith("image/"))) {
					event.preventDefault();
					const ed = editorRef.current;
					if (ed) void insertImageFiles(ed, files);
					return true;
				}
				return false;
			},
		},
		onUpdate: ({ editor: ed }) => {
			onChangeRef.current(ed.getJSON() as PostContentDoc, {
				words: ed.storage.characterCount?.words?.() ?? 0,
				characters: ed.storage.characterCount?.characters?.() ?? 0,
			});
		},
	});

	// Ref miroir : les handlers `editorProps` sont figés à la création de l'éditeur
	// et ne peuvent pas capturer `editor` (défini seulement après l'appel).
	const editorRef = useRef<Editor | null>(null);
	useEffect(() => {
		editorRef.current = editor;
	}, [editor]);

	const state = useEditorState({
		editor,
		selector: ({ editor: ed }) => {
			if (!ed) return null;
			return {
				bold: ed.isActive("bold"),
				italic: ed.isActive("italic"),
				underline: ed.isActive("underline"),
				strike: ed.isActive("strike"),
				highlight: ed.isActive("highlight"),
				code: ed.isActive("code"),
				codeBlock: ed.isActive("codeBlock"),
				link: ed.isActive("link"),
				h2: ed.isActive("heading", { level: 2 }),
				h3: ed.isActive("heading", { level: 3 }),
				h4: ed.isActive("heading", { level: 4 }),
				paragraph: ed.isActive("paragraph"),
				bulletList: ed.isActive("bulletList"),
				orderedList: ed.isActive("orderedList"),
				blockquote: ed.isActive("blockquote"),
				subscript: ed.isActive("subscript"),
				superscript: ed.isActive("superscript"),
				alignLeft: ed.isActive({ textAlign: "left" }),
				alignCenter: ed.isActive({ textAlign: "center" }),
				alignRight: ed.isActive({ textAlign: "right" }),
				inTable: ed.isActive("table"),
				canUndo: ed.can().undo(),
				canRedo: ed.can().redo(),
				words: ed.storage.characterCount?.words?.() ?? 0,
				characters: ed.storage.characterCount?.characters?.() ?? 0,
			};
		},
	});

	const openLinkEditor = useCallback(() => {
		if (!editor) return;
		setLinkValue((editor.getAttributes("link").href as string) ?? "https://");
		setLinkOpen(true);
	}, [editor]);

	const applyLink = useCallback(() => {
		if (!editor) return;
		const href = linkValue.trim();
		if (!href || href === "https://") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
		} else {
			editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
		}
		setLinkOpen(false);
	}, [editor, linkValue]);

	const addYoutube = useCallback(() => {
		if (!editor) return;
		const url = window.prompt("URL de la vidéo YouTube");
		if (url) editor.commands.setYoutubeVideo({ src: url });
	}, [editor]);

	if (!editor || !state) {
		// Squelette de la hauteur réelle de l'éditeur : évite le saut de mise en page
		// entre le rendu serveur et le montage client.
		return (
			<div className="rounded-xl border border-white/10 bg-white/[0.03]">
				<div className="h-12 border-b border-white/10" />
				<div className="h-[28rem] animate-pulse bg-white/[0.02]" />
			</div>
		);
	}

	return (
		<div className="rounded-xl border border-white/10 bg-[#0e0e10] overflow-hidden">
			{/* ---- Barre d'outils ------------------------------------------------ */}
			<div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 border-b border-white/10 bg-[#141416]/95 px-2 py-1.5 backdrop-blur">
				<TbGroup>
					<TbButton
						icon={Undo2}
						label="Annuler"
						disabled={!state.canUndo}
						onClick={() => editor.chain().focus().undo().run()}
					/>
					<TbButton
						icon={Redo2}
						label="Rétablir"
						disabled={!state.canRedo}
						onClick={() => editor.chain().focus().redo().run()}
					/>
				</TbGroup>

				<TbGroup>
					<TbButton
						icon={Pilcrow}
						label="Paragraphe"
						active={state.paragraph}
						onClick={() => editor.chain().focus().setParagraph().run()}
					/>
					<TbButton
						icon={Heading2}
						label="Titre de section"
						active={state.h2}
						onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					/>
					<TbButton
						icon={Heading3}
						label="Sous-titre"
						active={state.h3}
						onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					/>
					<TbButton
						icon={Heading4}
						label="Titre mineur"
						active={state.h4}
						onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
					/>
				</TbGroup>

				<TbGroup>
					<TbButton
						icon={Bold}
						label="Gras"
						active={state.bold}
						onClick={() => editor.chain().focus().toggleBold().run()}
					/>
					<TbButton
						icon={Italic}
						label="Italique"
						active={state.italic}
						onClick={() => editor.chain().focus().toggleItalic().run()}
					/>
					<TbButton
						icon={UnderlineIcon}
						label="Souligné"
						active={state.underline}
						onClick={() => editor.chain().focus().toggleUnderline().run()}
					/>
					<TbButton
						icon={Strikethrough}
						label="Barré"
						active={state.strike}
						onClick={() => editor.chain().focus().toggleStrike().run()}
					/>
					<TbButton
						icon={Highlighter}
						label="Surligné"
						active={state.highlight}
						onClick={() => editor.chain().focus().toggleHighlight().run()}
					/>
					<TbButton
						icon={SubIcon}
						label="Indice"
						active={state.subscript}
						onClick={() => editor.chain().focus().toggleSubscript().run()}
					/>
					<TbButton
						icon={SupIcon}
						label="Exposant"
						active={state.superscript}
						onClick={() => editor.chain().focus().toggleSuperscript().run()}
					/>
				</TbGroup>

				<TbGroup>
					<TbButton
						icon={Link2}
						label="Insérer un lien"
						active={state.link}
						onClick={openLinkEditor}
					/>
					{state.link && (
						<TbButton
							icon={Link2Off}
							label="Retirer le lien"
							onClick={() => editor.chain().focus().unsetLink().run()}
						/>
					)}
				</TbGroup>

				<TbGroup>
					<TbButton
						icon={List}
						label="Liste à puces"
						active={state.bulletList}
						onClick={() => editor.chain().focus().toggleBulletList().run()}
					/>
					<TbButton
						icon={ListOrdered}
						label="Liste numérotée"
						active={state.orderedList}
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
					/>
					<TbButton
						icon={Quote}
						label="Citation"
						active={state.blockquote}
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
					/>
					<TbButton
						icon={Code}
						label="Code en ligne"
						active={state.code}
						onClick={() => editor.chain().focus().toggleCode().run()}
					/>
					<TbButton
						icon={Code2}
						label="Bloc de code"
						active={state.codeBlock}
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					/>
				</TbGroup>

				<TbGroup>
					<TbButton
						icon={AlignLeft}
						label="Aligner à gauche"
						active={state.alignLeft}
						onClick={() => editor.chain().focus().setTextAlign("left").run()}
					/>
					<TbButton
						icon={AlignCenter}
						label="Centrer"
						active={state.alignCenter}
						onClick={() => editor.chain().focus().setTextAlign("center").run()}
					/>
					<TbButton
						icon={AlignRight}
						label="Aligner à droite"
						active={state.alignRight}
						onClick={() => editor.chain().focus().setTextAlign("right").run()}
					/>
				</TbGroup>

				<TbGroup>
					<TbButton
						icon={ImagePlus}
						label="Insérer une image"
						disabled={uploading}
						onClick={() => fileInputRef.current?.click()}
					/>
					<TbButton icon={VideoEmbedIcon} label="Intégrer une vidéo YouTube" onClick={addYoutube} />
					<TbButton
						icon={TableIcon}
						label="Insérer un tableau"
						active={state.inTable}
						onClick={() =>
							editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
						}
					/>
					{state.inTable && (
						<TbButton
							icon={Trash2}
							label="Supprimer le tableau"
							onClick={() => editor.chain().focus().deleteTable().run()}
						/>
					)}
					<TbButton
						icon={Minus}
						label="Séparateur"
						onClick={() => editor.chain().focus().setHorizontalRule().run()}
					/>
					<TbButton
						icon={RemoveFormatting}
						label="Effacer la mise en forme"
						onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
					/>
				</TbGroup>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/png,image/jpeg,image/webp,image/gif"
					multiple
					className="hidden"
					onChange={(e) => {
						const files = Array.from(e.target.files ?? []);
						if (files.length) void insertImageFiles(editor, files);
						e.target.value = ""; // permet de re-choisir le même fichier
					}}
				/>
			</div>

			{/* ---- Éditeur de lien ------------------------------------------------ */}
			{linkOpen && (
				<div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-[#141416] px-3 py-2">
					<Link2 className="size-4 text-white/40" aria-hidden />
					<input
						autoFocus
						value={linkValue}
						onChange={(e) => setLinkValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								applyLink();
							}
							if (e.key === "Escape") setLinkOpen(false);
						}}
						placeholder="https://exemple.fr/page"
						className="min-w-0 flex-1 rounded-md border border-white/15 bg-black/40 px-3 py-1.5 font-mono text-[13px] text-white outline-none focus:border-white/40"
					/>
					<button
						type="button"
						onClick={applyLink}
						className="rounded-md bg-white px-3 py-1.5 text-[12px] font-semibold text-black hover:bg-white/85"
					>
						Appliquer
					</button>
					<button
						type="button"
						onClick={() => setLinkOpen(false)}
						className="rounded-md px-3 py-1.5 text-[12px] font-medium text-white/60 hover:text-white"
					>
						Annuler
					</button>
				</div>
			)}

			{uploadError && (
				<p className="border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-[13px] text-red-300">
					{uploadError}
				</p>
			)}

			{/* ---- Surface de saisie (mise en page réelle de l'article) ---------- */}
			<div className="editorial ed-editor max-h-[70vh] overflow-y-auto px-6 py-8 sm:px-10 lg:px-14">
				<div className="mx-auto w-full" style={{ maxWidth: "var(--ed-measure)" }}>
					<EditorContent editor={editor} />
				</div>
			</div>

			{/* ---- Pied : statistiques ------------------------------------------- */}
			<div className="flex items-center justify-between gap-4 border-t border-white/10 bg-[#141416] px-4 py-2">
				<span className="text-[11px] tabular-nums text-white/40">
					{state.words} mot{state.words > 1 ? "s" : ""} · {state.characters} signes ·{" "}
					{Math.max(1, Math.round(state.words / 220))} min de lecture
				</span>
				{uploading && <span className="text-[11px] text-white/60">Envoi de l'image…</span>}
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */

function TbGroup({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-0.5 border-white/10 pr-1.5 [&:not(:last-child)]:mr-1.5 [&:not(:last-child)]:border-r">
			{children}
		</div>
	);
}

function TbButton({
	icon: Icon,
	label,
	active,
	disabled,
	onClick,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	active?: boolean;
	disabled?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			title={label}
			aria-label={label}
			aria-pressed={active ?? false}
			disabled={disabled}
			// `onMouseDown` + preventDefault : un clic sur la barre ne doit pas voler
			// le focus à l'éditeur, sinon la sélection courante est perdue avant que
			// la commande ne s'applique.
			onMouseDown={(e) => e.preventDefault()}
			onClick={onClick}
			className={cn(
				"grid size-8 place-items-center rounded-md transition-colors",
				"text-white/65 hover:bg-white/10 hover:text-white",
				"disabled:pointer-events-none disabled:opacity-30",
				active && "bg-white/15 text-white"
			)}
		>
			<Icon className="size-4" />
		</button>
	);
}
