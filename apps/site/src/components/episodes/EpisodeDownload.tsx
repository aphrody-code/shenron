"use client";

import { Download } from "lucide-react";
import { assetUrl } from "@/lib/assets";

interface EpisodeDownloadProps {
	episodeId: number | string;
	videoUrl: string | null;
	streamUrl: string | null;
	title: string;
	className?: string;
}

export function EpisodeDownload({
	episodeId,
	videoUrl,
	streamUrl,
	title,
	className = "",
}: EpisodeDownloadProps) {
	// Prioritize direct MP4 download link, otherwise use HLS stream download API
	const downloadUrl = videoUrl
		? videoUrl
		: streamUrl
			? assetUrl(`/api/hls/${episodeId}/download`)
			: null;

	if (!downloadUrl) return null;

	const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.mp4`;

	return (
		<a
			href={downloadUrl}
			download={filename}
			target={videoUrl ? "_blank" : undefined}
			rel={videoUrl ? "noreferrer" : undefined}
			className={`inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white/80 hover:text-dbz-orange hover:border-dbz-orange hover:scale-105 hover:bg-black/80 transition-all duration-300 shadow-lg cursor-pointer ${className}`}
			title={`Télécharger : ${title}`}
			aria-label="Télécharger"
		>
			<Download className="w-5 h-5" />
		</a>
	);
}
