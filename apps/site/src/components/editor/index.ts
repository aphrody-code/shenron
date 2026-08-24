/**
 * Module d'édition du site — point d'entrée unique.
 *
 * Tout ce qui saisit du texte sur dragonballfr.com passe par ici :
 *   - `ShenronEditor` : éditeur riche (articles, wiki, sections CMS, home) ;
 *   - `PlainField`    : texte simple (commentaires, signalements, avis, admin) —
 *     à importer **directement** depuis `@/components/editor/PlainField` hors des
 *     écrans d'administration : ce point d'entrée tire l'éditeur riche
 *     (ProseMirror, CodeMirror, feuilles de style), qui n'a rien à faire dans le
 *     paquet d'une page de commentaires ;
 *   - `buildExtensions` / `serializeMarkdown` / `parseMarkdown` : le schéma et le
 *     pont markdown, partagés avec le rendu serveur.
 */
export { ShenronEditor } from "./Editor";
export type { EditorFormat, EditorMode, EditorStats, ShenronEditorProps } from "./Editor";
export { PlainField } from "./PlainField";
export type { PlainFieldProps } from "./PlainField";
export { EMPTY_DOC, EDITOR_PRESETS, buildExtensions } from "./schema";
export type { PresetName, PresetConfig } from "./schema";
export { serializeMarkdown } from "./markdown/serialize";
export { markdownToHtml, parseMarkdown, roundTripReport } from "./markdown/parse";
export { ALL_ACTIONS, actionsFor, insertActionsFor } from "./commands";
export type { EditorAction, EditorDialogs } from "./commands";
