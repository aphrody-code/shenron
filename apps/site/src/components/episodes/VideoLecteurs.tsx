"use client";

import { useState } from "react";

export interface Lecteur {
	name: string;
	provider: string;
	embedUrl: string;
}

/**
 * Sélecteur de « lecteurs » (sources de streaming externes) rendu en `<iframe>`.
 * Notre player hls.js ne peut pas consommer ces embeds (pages-lecteur tierces à
 * token éphémère) → on les affiche en iframe. « Lecteur 1 » = `players[0]` par
 * défaut. Pour une source officielle (HLS/mp4), c'est `VideoPlayer` qui est utilisé.
 */
export function VideoLecteurs({ players }: { players: Lecteur[] }) {
	const [active, setActive] = useState(0);
	const current = players[active] ?? players[0];
	if (!current) return null;

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-2">
				{players.map((p, i) => (
					<button
						key={`${p.provider}-${i}`}
						type="button"
						onClick={() => setActive(i)}
						className={`px-3.5 py-1.5 rounded-full text-[12px] font-display font-semibold tracking-wide transition-colors ${
							i === active
								? "bg-dbz-orange text-black"
								: "bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white"
						}`}
						title={`${p.name} · ${p.provider}`}
					>
						Lecteur {i + 1}
					</button>
				))}
			</div>
			<div className="dbz-panel overflow-hidden rounded-lg border border-dbz-border bg-black p-0">
				<iframe
					key={current.embedUrl}
					src={current.embedUrl}
					title={`Lecteur ${active + 1} — ${current.name}`}
					className="aspect-video w-full rounded-lg bg-black"
					allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
					allowFullScreen
					referrerPolicy="origin"
					loading="lazy"
				/>
			</div>
			<p className="text-[11px] text-white/35">
				Lecteur externe « {current.name} ». Les liens peuvent expirer — relancer l'import si un
				lecteur ne répond pas.
			</p>
		</div>
	);
}
