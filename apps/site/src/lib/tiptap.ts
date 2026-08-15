/**
 * Configuration Tiptap **partagée** entre l'éditeur (navigateur) et le rendu
 * HTML (serveur).
 *
 * Une seule et même liste d'extensions des deux côtés, c'est la garantie que
 * l'aperçu de l'admin et la page publique parlent du même schéma : une extension
 * présente à la saisie mais absente au rendu ferait silencieusement disparaître
 * du contenu déjà publié.
 *
 * Module **client-safe** : uniquement des extensions `@tiptap/core`, aucune
 * dépendance React ni server-only, pour être importable depuis un Server
 * Component comme depuis un `"use client"`.
 */
import { Image } from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { TextAlign } from "@tiptap/extension-text-align";
import { Youtube } from "@tiptap/extension-youtube";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { StarterKit } from "@tiptap/starter-kit";

/**
 * Protocoles autorisés dans les liens. Tout le reste (`javascript:`, `data:`…)
 * est rejeté par Tiptap à la saisie ET au collage — première ligne de défense
 * contre un XSS stocké, même si l'édition est réservée aux admins.
 */
const ALLOWED_LINK_PROTOCOLS = ["http", "https", "mailto"];

/**
 * Extensions communes. `h1` est volontairement absent des niveaux de titre :
 * le `<h1>` d'une page d'article est son titre, en poser un second dans le
 * corps casse la hiérarchie du document (accessibilité + SEO).
 */
export const postExtensions = [
	StarterKit.configure({
		heading: { levels: [2, 3, 4] },
		link: {
			openOnClick: false, // en édition, cliquer un lien doit placer le curseur
			autolink: true,
			defaultProtocol: "https",
			protocols: ALLOWED_LINK_PROTOCOLS,
			HTMLAttributes: {
				// Les liens sortants s'ouvrent ailleurs ; `noopener` neutralise
				// l'accès à `window.opener` depuis la page cible.
				rel: "noopener noreferrer",
				target: "_blank",
			},
		},
		codeBlock: { languageClassPrefix: "language-" },
		// `TrailingNode` (fourni par StarterKit) garantit un paragraphe vide en fin
		// de document : sans lui, impossible d'écrire après une image ou un tableau
		// terminal — piège classique signalé par les rédacteurs.
	}),
	Image.configure({
		allowBase64: false, // une image collée doit passer par l'upload, pas gonfler le HTML
		HTMLAttributes: { loading: "lazy", decoding: "async" },
	}),
	TextAlign.configure({ types: ["heading", "paragraph"] }),
	TableKit.configure({ table: { resizable: true, allowTableNodeSelection: true } }),
	Youtube.configure({
		nocookie: true, // youtube-nocookie.com : pas de cookie tiers avant lecture
		modestBranding: true,
		HTMLAttributes: { class: "ed-embed-video" },
	}),
	Highlight,
	Subscript,
	Superscript,
];

/** Document Tiptap vide — valeur initiale d'un nouvel article. */
export const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] } as const;
