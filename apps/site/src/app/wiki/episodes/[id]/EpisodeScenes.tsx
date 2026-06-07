"use client";

/**
 * EpisodeScenes — îlot client de la section « Scènes » d'un épisode.
 *
 * Affiche la grille des frames extraites (`EpisodeFrame[]`) avec badges
 * personnages et mise en avant des frames `isNotable`. Progressive enhancement :
 * permet de sélectionner des frames puis de les exporter en GIF animé côté
 * navigateur (`encodeFramesToGif` → Blob → download).
 *
 * Server-only safe : ce composant n'importe QUE `@/lib/assets` (client-safe)
 * et `@/components/media/encodeGif` (browser-only). Il ne touche jamais
 * `db-universe`/`shenron` → `postgres` ne fuite pas dans le bundle client.
 * Le type `SceneFrame` est dupliqué localement (contrat partagé, identique à
 * `EpisodeFrame` du bot) pour ne pas importer le module server-only
 * `@/db/bot-schema`. `imagePath` peut être null (dry-run) → filtré en amont.
 */

import { useCallback, useMemo, useState } from "react";
import { assetUrl } from "@/lib/assets";
import { encodeFramesToGif } from "@/components/media/encodeGif";

/**
 * Réplique client-safe de `EpisodeFrame` (cf. `@/db/bot-schema`, source de
 * vérité `apps/bot/src/db/episode-frames.ts`). `imagePath` nullable.
 */
export type SceneFrame = {
	source: "ffmpeg" | "fandom";
	sourceId: string;
	sourceUrl: string | null;
	episodeNumber: number;
	imagePath: string | null;
	timecodeSec: number | null;
	width: number | null;
	height: number | null;
	characterNames: string[];
	tags: string[];
	caption: string | null;
	isNotable: boolean;
	sortOrder: number;
};

function formatTimecode(sec: number | null): string | null {
	if (sec == null || !Number.isFinite(sec)) return null;
	const s = Math.max(0, Math.floor(sec));
	const m = Math.floor(s / 60);
	const r = s % 60;
	return `${m}:${String(r).padStart(2, "0")}`;
}

/** Charge une image cross-origin en canvas pour l'encodage GIF. */
function loadFrameCanvas(src: string, width: number, height: number): Promise<HTMLCanvasElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.decoding = "async";
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Canvas 2D indisponible"));
				return;
			}
			// object-cover : remplit le canvas en conservant le ratio.
			const ir = img.width / img.height;
			const cr = width / height;
			let sx = 0;
			let sy = 0;
			let sw = img.width;
			let sh = img.height;
			if (ir > cr) {
				sw = img.height * cr;
				sx = (img.width - sw) / 2;
			} else {
				sh = img.width / cr;
				sy = (img.height - sh) / 2;
			}
			ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
			resolve(canvas);
		};
		img.onerror = () => reject(new Error(`Frame illisible : ${src}`));
		img.src = src;
	});
}

export function EpisodeScenes({
	frames,
	title,
	episodeNumber,
}: {
	frames: SceneFrame[];
	title: string;
	episodeNumber: number;
}) {
	// On ne rend que les frames réellement écrites (imagePath non null : un
	// dry-run du pipeline laisse `imagePath === null`). Tri par `sortOrder`
	// stable pour un affichage déterministe.
	const renderable = useMemo(
		() =>
			frames
				.filter((f): f is SceneFrame & { imagePath: string } => f.imagePath != null)
				.sort((a, b) => a.sortOrder - b.sortOrder),
		[frames]
	);

	// Sélection des frames pour l'export GIF (indices dans `renderable`).
	const [selected, setSelected] = useState<Set<number>>(() => new Set());
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [gifUrl, setGifUrl] = useState<string | null>(null);

	const selectionMode = selected.size > 0;

	const toggle = useCallback((idx: number) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(idx)) next.delete(idx);
			else next.add(idx);
			return next;
		});
	}, []);

	const orderedSelection = useMemo(() => [...selected].sort((a, b) => a - b), [selected]);

	const exportGif = useCallback(async () => {
		setBusy(true);
		setError(null);
		try {
			const width = 480;
			const height = 270;
			const canvases = await Promise.all(
				orderedSelection.map((i) =>
					loadFrameCanvas(assetUrl(renderable[i].imagePath), width, height)
				)
			);
			const blob = await encodeFramesToGif({
				width,
				height,
				frames: canvases.map((c) => ({ data: c, delay: 400 })),
				dither: "floyd-steinberg",
			});
			setGifUrl((prev) => {
				if (prev) URL.revokeObjectURL(prev);
				return URL.createObjectURL(blob);
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(false);
		}
	}, [orderedSelection, renderable]);

	const clearSelection = useCallback(() => {
		setSelected(new Set());
		setGifUrl((prev) => {
			if (prev) URL.revokeObjectURL(prev);
			return null;
		});
		setError(null);
	}, []);

	return (
		<section className="space-y-6 reveal-up">
			<div className="flex items-center gap-6">
				<h2 className="font-display font-bold text-2xl text-white uppercase tracking-widest whitespace-nowrap">
					Scènes
				</h2>
				<div className="h-px flex-1 bg-gradient-to-r from-dbz-orange/50 to-transparent" />
				<span className="scouter-text text-sm text-white/50 whitespace-nowrap">
					{renderable.length} frame{renderable.length > 1 ? "s" : ""}
				</span>
			</div>

			<p className="text-[13px] text-white/55 -mt-2">
				Sélectionnez des frames pour les exporter en GIF animé.
			</p>

			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
				{renderable.map((f, i) => {
					const isSelected = selected.has(i);
					const order = isSelected ? orderedSelection.indexOf(i) + 1 : 0;
					const tc = formatTimecode(f.timecodeSec);
					// Légende : caption éditoriale > liste des personnages détectés.
					const alt =
						f.caption ??
						(f.characterNames.length > 0
							? `Scène avec ${f.characterNames.join(", ")}`
							: `Scène de l'épisode ${episodeNumber}`);
					return (
						<button
							key={`${f.imagePath}-${i}`}
							type="button"
							onClick={() => toggle(i)}
							aria-pressed={isSelected}
							className={`group relative aspect-video overflow-hidden rounded-lg bg-dbz-bg text-left transition-all dbz-panel ${
								isSelected
									? "ring-2 ring-dbz-orange"
									: f.isNotable
										? "ring-1 ring-dbz-orange/40"
										: ""
							}`}
						>
							{/* Frame servie directe par le bot (URL passe-plat). */}
							<img
								src={assetUrl(f.imagePath)}
								alt={alt}
								loading="lazy"
								decoding="async"
								className="h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
							/>
							<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

							{f.isNotable && (
								<span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-dbz-orange/85 text-black text-[9px] font-bold uppercase tracking-widest">
									★ Marquante
								</span>
							)}

							{tc && (
								<span className="absolute top-1.5 right-1.5 scouter-text text-[9px] text-dbz-orange bg-black/60 px-1.5 py-0.5 rounded">
									{tc}
								</span>
							)}

							{(f.caption ?? f.characterNames.length > 0) && (
								<div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-wrap gap-1">
									{f.caption ? (
										<span className="px-1.5 py-0.5 rounded-full bg-black/65 backdrop-blur-sm text-white text-[9px] font-semibold leading-none line-clamp-1">
											{f.caption}
										</span>
									) : (
										f.characterNames.slice(0, 3).map((name) => (
											<span
												key={name}
												className="px-1.5 py-0.5 rounded-full bg-black/65 backdrop-blur-sm text-white text-[9px] font-semibold leading-none line-clamp-1"
											>
												{name}
											</span>
										))
									)}
								</div>
							)}

							{order > 0 && (
								<span className="absolute bottom-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-dbz-orange text-black text-[11px] font-bold">
									{order}
								</span>
							)}
						</button>
					);
				})}
			</div>

			{/* Barre d'export GIF (progressive enhancement) */}
			{selectionMode && (
				<div className="flex flex-wrap items-center gap-4 dbz-panel p-4">
					<span className="text-sm text-white/70">
						{selected.size} frame{selected.size > 1 ? "s" : ""} sélectionnée
						{selected.size > 1 ? "s" : ""}
					</span>
					<button
						type="button"
						onClick={exportGif}
						disabled={busy}
						className="rounded-lg bg-dbz-orange px-4 py-2 font-display font-semibold text-black text-sm transition-opacity disabled:opacity-50"
					>
						{busy ? "Encodage…" : "Exporter en GIF"}
					</button>
					<button
						type="button"
						onClick={clearSelection}
						className="text-sm text-white/50 hover:text-white transition-colors underline"
					>
						Effacer
					</button>
					{error && <span className="text-sm text-dbz-red">{error}</span>}
					{gifUrl && (
						<figure className="flex items-center gap-3">
							{/* blob: URL objet local (next/image inapplicable). */}
							<img
								src={gifUrl}
								alt={`GIF de scènes — ${title}`}
								width={160}
								height={90}
								className="rounded-md border border-white/10"
							/>
							<a
								href={gifUrl}
								download={`dbfr-ep${String(episodeNumber).padStart(3, "0")}-scenes.gif`}
								className="text-sm text-dbz-orange underline"
							>
								Télécharger
							</a>
						</figure>
					)}
				</div>
			)}
		</section>
	);
}
