"use client";

import {
	DefaultVideoLayout,
	defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";

// Styles du layout par défaut (theme + chrome vidéo).
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

export interface VidstackPlayerProps {
	src: string;
	title: string;
	poster?: string;
}

/**
 * Player Vidstack v1 isolé — chargé UNIQUEMENT côté client (cf. VideoPlayer
 * qui l'importe en `dynamic({ ssr:false })`). Vidstack enregistre des custom
 * elements qui touchent `window` ; l'importer côté serveur casse le SSR
 * (ChunkLoadError). HLS (.m3u8) auto, sinon mp4 natif.
 */
export function VidstackPlayer({ src, title, poster }: VidstackPlayerProps) {
	return (
		<MediaPlayer
			className="aspect-video w-full overflow-hidden rounded-lg"
			src={src}
			title={title}
			poster={poster}
			aspectRatio="16/9"
			crossOrigin
			playsInline
		>
			<MediaProvider>
				{poster ? (
					<Poster className="vds-poster" src={poster} alt={title} />
				) : null}
			</MediaProvider>
			<DefaultVideoLayout icons={defaultLayoutIcons} />
		</MediaPlayer>
	);
}
