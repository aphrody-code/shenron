"use client";

/**
 * Galerie médias style Steam pour les fiches jeu :
 *  - preview principale (image ou iframe YouTube)
 *  - bande de vignettes cliquables
 */
import { Film, ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { assetUrl } from "@/lib/assets";
import { youtubeEmbedUrl, youtubeThumbUrl } from "@/lib/youtube";

export type GalleryMedia = {
	type: "image" | "youtube";
	url: string;
	caption?: string | null;
};

function resolvePreview(item: GalleryMedia): {
	kind: "image" | "youtube";
	src: string;
	thumb: string | null;
} | null {
	if (item.type === "youtube") {
		const embed = youtubeEmbedUrl(item.url);
		if (!embed) return null;
		return { kind: "youtube", src: embed, thumb: youtubeThumbUrl(item.url) };
	}
	const src = item.url.startsWith("http") ? item.url : assetUrl(item.url);
	return { kind: "image", src, thumb: src };
}

export function GameMediaGallery({ media, title }: { media: GalleryMedia[]; title: string }) {
	const items = useMemo(
		() =>
			media
				.map((m, i) => {
					const resolved = resolvePreview(m);
					if (!resolved) return null;
					return { ...m, ...resolved, key: `${m.type}-${i}-${m.url}` };
				})
				.filter((x): x is NonNullable<typeof x> => x != null),
		[media]
	);

	const [active, setActive] = useState(0);
	const current = items[Math.min(active, Math.max(0, items.length - 1))];

	if (items.length === 0) return null;

	return (
		<section className="mb-12" aria-label={`Médias — ${title}`}>
			<h2 className="mb-4 border-b border-white/10 pb-2 font-display text-[20px] font-bold text-white">
				Médias
			</h2>

			<div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/40">
				{/* Preview principale */}
				<div className="relative aspect-video w-full bg-black">
					{current?.kind === "youtube" ? (
						<iframe
							key={current.key}
							src={current.src}
							title={current.caption || `${title} — vidéo`}
							className="absolute inset-0 h-full w-full"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
							loading="lazy"
							referrerPolicy="strict-origin-when-cross-origin"
						/>
					) : current ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							key={current.key}
							src={current.src}
							alt={current.caption || `${title} — screenshot`}
							className="absolute inset-0 h-full w-full object-contain"
						/>
					) : null}
				</div>

				{current?.caption && (
					<p className="border-t border-white/[0.06] px-4 py-2 text-center text-[12px] text-white/55">
						{current.caption}
					</p>
				)}

				{/* Vignettes */}
				{items.length > 1 && (
					<div className="flex gap-2 overflow-x-auto border-t border-white/[0.06] bg-black/50 p-3 scrollbar-thin">
						{items.map((item, i) => {
							const isActive = i === active;
							return (
								<button
									key={item.key}
									type="button"
									onClick={() => setActive(i)}
									aria-label={
										item.caption || (item.kind === "youtube" ? `Vidéo ${i + 1}` : `Image ${i + 1}`)
									}
									aria-current={isActive ? "true" : undefined}
									className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
										isActive
											? "border-dbz-orange shadow-[0_0_10px_rgba(255,178,0,0.35)]"
											: "border-white/10 hover:border-white/30"
									}`}
								>
									{item.thumb ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={item.thumb}
											alt=""
											className="h-full w-full object-cover"
											loading="lazy"
										/>
									) : (
										<span className="flex h-full w-full items-center justify-center bg-zinc-900 text-white/30">
											{item.kind === "youtube" ? (
												<Film className="h-5 w-5" />
											) : (
												<ImageIcon className="h-5 w-5" />
											)}
										</span>
									)}
									{item.kind === "youtube" && (
										<span className="absolute inset-0 flex items-center justify-center bg-black/35">
											<span className="rounded-full bg-black/70 p-1.5 text-white">
												<Film className="h-3.5 w-3.5" />
											</span>
										</span>
									)}
								</button>
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
}
