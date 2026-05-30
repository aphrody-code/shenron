"use client";

import { Download, FileVideo, Video } from "lucide-react";
import { assetUrl } from "@/lib/assets";

interface EpisodeDownloadProps {
	episodeId: number | string;
	videoUrl: string | null;
	streamUrl: string | null;
	title: string;
}

export function EpisodeDownload({
	episodeId,
	videoUrl,
	streamUrl,
	title,
}: EpisodeDownloadProps) {
	const downloadHlsUrl = assetUrl(`/api/hls/${episodeId}/download`);

	// Determiner si on a des options de telechargement
	const hasDirect = !!videoUrl;
	const hasHls = !!streamUrl;

	if (!hasDirect && !hasHls) return null;

	return (
		<section className="dbz-panel p-6 relative overflow-hidden reveal-up mt-8 border border-dbz-border/40 bg-black/40 backdrop-blur-md">
			<div className="absolute top-0 right-0 w-32 h-32 bg-dbz-orange/5 rounded-full blur-2xl -z-10" />
			
			<div className="flex items-center gap-3 mb-5">
				<Download className="w-5 h-5 text-dbz-orange animate-pulse" />
				<h2 className="font-display font-bold text-lg text-white uppercase tracking-widest">
					Téléchargement Natif
				</h2>
			</div>

			<p className="text-zinc-400 text-sm mb-6 leading-relaxed">
				Téléchargez cet épisode directement sur votre appareil pour une lecture hors-ligne en haute qualité.
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{hasHls && (
					<a
						href={downloadHlsUrl}
						download={`episode-${episodeId}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ts`}
						className="group flex items-center justify-between p-4 rounded-lg border border-dbz-orange/30 bg-dbz-orange/5 hover:bg-dbz-orange/15 transition-all duration-300 shadow-md shadow-dbz-orange/5 cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<div className="p-2.5 rounded-md bg-dbz-orange/20 group-hover:scale-110 transition-transform duration-300">
								<FileVideo className="w-5 h-5 text-dbz-orange" />
							</div>
							<div className="text-left">
								<div className="font-display font-bold text-sm text-white group-hover:text-dbz-orange transition-colors">
									Télécharger le Flux HLS
								</div>
								<div className="text-[11px] text-zinc-500 font-mono">
									Format: MPEG-TS (.ts)
								</div>
							</div>
						</div>
						<Download className="w-4 h-4 text-zinc-500 group-hover:text-dbz-orange group-hover:translate-y-0.5 transition-all" />
					</a>
				)}

				{hasDirect && (
					<a
						href={videoUrl}
						download={`episode-${episodeId}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.mp4`}
						target="_blank"
						rel="noreferrer"
						className="group flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-white/[0.02] hover:bg-white/[0.06] hover:border-zinc-700 transition-all duration-300 cursor-pointer"
					>
						<div className="flex items-center gap-3">
							<div className="p-2.5 rounded-md bg-white/[0.04] group-hover:scale-110 transition-transform duration-300">
								<Video className="w-5 h-5 text-zinc-400 group-hover:text-white" />
							</div>
							<div className="text-left">
								<div className="font-display font-bold text-sm text-zinc-300 group-hover:text-white transition-colors">
									Téléchargement Direct
								</div>
								<div className="text-[11px] text-zinc-500 font-mono">
									Format: MP4 (.mp4)
								</div>
							</div>
						</div>
						<Download className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-y-0.5 transition-all" />
					</a>
				)}
			</div>
			
			<div className="mt-4 text-[11px] text-zinc-500 flex items-center gap-2">
				<span className="inline-block w-1.5 h-1.5 rounded-full bg-dbz-orange" />
				Le format MPEG-TS (.ts) est directement lisible avec un lecteur comme VLC ou MPV.
			</div>
		</section>
	);
}
