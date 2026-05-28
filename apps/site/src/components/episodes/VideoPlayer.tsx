"use client";

import { useEffect, useRef } from "react";

export interface VideoPlayerProps {
	src: string;
	title: string;
	poster?: string;
}

/**
 * Lecteur vidéo des épisodes : `<video>` HTML5 natif (contrôles + clavier +
 * a11y de série) avec support HLS.
 *
 * - Source `.m3u8` : lecture HLS native si le navigateur la supporte (Safari/
 *   iOS), sinon attache hls.js (chargé dynamiquement, donc jamais côté serveur
 *   → SSR-safe et compatible build Turbopack). Source mp4 : lecture directe.
 * - hls.js (plain ESM) remplace Vidstack v1, que Turbopack canary n'arrive pas
 *   à parser au build prod. À réévaluer quand Vidstack sera turbopack-compatible.
 */
export function VideoPlayer({ src, title, poster }: VideoPlayerProps) {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const isHls = src.toLowerCase().includes(".m3u8");
		// mp4 (ou autre) : lecture directe, rien à charger.
		if (!isHls) {
			video.src = src;
			return;
		}
		// HLS natif (Safari/iOS) : pas besoin de hls.js.
		if (video.canPlayType("application/vnd.apple.mpegurl")) {
			video.src = src;
			return;
		}

		let hls: { destroy: () => void } | null = null;
		let cancelled = false;
		void import("hls.js").then(({ default: Hls }) => {
			if (cancelled || !videoRef.current) return;
			if (Hls.isSupported()) {
				const instance = new Hls({ enableWorker: true });
				instance.loadSource(src);
				instance.attachMedia(videoRef.current);
				hls = instance;
			} else {
				videoRef.current.src = src;
			}
		});

		return () => {
			cancelled = true;
			hls?.destroy();
		};
	}, [src]);

	return (
		<div className="dbz-panel overflow-hidden rounded-lg border border-dbz-border bg-black p-0">
			{/* biome-ignore lint/a11y/useMediaCaption: pistes VTT ajoutées via la source quand dispo */}
			<video
				ref={videoRef}
				controls
				playsInline
				preload="metadata"
				crossOrigin="anonymous"
				poster={poster}
				title={title}
				className="aspect-video w-full rounded-lg bg-black"
			/>
		</div>
	);
}
