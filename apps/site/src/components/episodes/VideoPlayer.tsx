"use client";

import dynamic from "next/dynamic";

export interface VideoPlayerProps {
	src: string;
	title: string;
	poster?: string;
}

// Vidstack n'est pas SSR-safe (custom elements + accès `window`). On le charge
// donc en `ssr:false` — autorisé ici car VideoPlayer est un Client Component
// (interdit seulement depuis un Server Component sous Next 16). Le fallback
// `loading` tient la place (ratio 16/9) sans layout-shift le temps du chunk.
const VidstackPlayer = dynamic(
	() => import("./VidstackPlayer").then((m) => m.VidstackPlayer),
	{
		ssr: false,
		loading: () => (
			<div
				className="aspect-video w-full animate-pulse rounded-lg bg-dbz-bg"
				aria-hidden
			/>
		),
	},
);

/**
 * Lecteur vidéo des épisodes. Wrapper léger : panel dbz + Vidstack chargé
 * côté client. Le `DefaultVideoLayout` de Vidstack fournit contrôles,
 * raccourcis clavier et a11y.
 */
export function VideoPlayer({ src, title, poster }: VideoPlayerProps) {
	return (
		<div className="dbz-panel overflow-hidden rounded-lg border border-dbz-border bg-black p-0">
			<VidstackPlayer src={src} title={title} poster={poster} />
		</div>
	);
}
