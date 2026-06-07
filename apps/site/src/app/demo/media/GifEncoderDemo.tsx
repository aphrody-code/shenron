"use client";

import { useState } from "react";
import { encodeFramesToGif } from "@/components/media/encodeGif";

/**
 * Démo client de l'encodage frames → GIF : dessine 24 frames d'une orbe de ki
 * qui tourne dans un canvas, puis les encode en GIF animé avec `modern-gif`.
 * Illustre le pipeline canvas → `encodeFramesToGif` → Blob → URL objet.
 */
export function GifEncoderDemo() {
	const [url, setUrl] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleEncode() {
		setBusy(true);
		setError(null);
		try {
			const size = 160;
			const frameCount = 24;
			const frames = Array.from({ length: frameCount }, (_, i) => {
				const canvas = document.createElement("canvas");
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext("2d");
				if (!ctx) throw new Error("Canvas 2D indisponible");
				const t = (i / frameCount) * Math.PI * 2;

				ctx.fillStyle = "#04050f";
				ctx.fillRect(0, 0, size, size);

				const cx = size / 2 + Math.cos(t) * 38;
				const cy = size / 2 + Math.sin(t) * 38;
				const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 34);
				grad.addColorStop(0, "#ffe9a8");
				grad.addColorStop(0.4, "#ff8a00");
				grad.addColorStop(1, "rgba(255,62,0,0)");
				ctx.fillStyle = grad;
				ctx.beginPath();
				ctx.arc(cx, cy, 34, 0, Math.PI * 2);
				ctx.fill();

				return { data: canvas, delay: 60 };
			});

			const blob = await encodeFramesToGif({
				width: size,
				height: size,
				frames,
				dither: "floyd-steinberg",
			});
			setUrl((prev) => {
				if (prev) URL.revokeObjectURL(prev);
				return URL.createObjectURL(blob);
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="flex flex-wrap items-center gap-6">
			<button
				type="button"
				onClick={handleEncode}
				disabled={busy}
				className="rounded-lg bg-dbz-orange px-5 py-2.5 font-display font-semibold text-black transition-opacity disabled:opacity-50"
			>
				{busy ? "Encodage…" : "Générer un GIF (24 frames)"}
			</button>
			{error && <span className="text-sm text-dbz-red">{error}</span>}
			{url && (
				<figure className="flex flex-col items-center gap-2">
					{/* blob: URL objet local généré côté client (next/image inapplicable). */}
					<img
						src={url}
						alt="GIF de ki encodé via modern-gif"
						width={160}
						height={160}
						className="rounded-lg border border-white/10"
					/>
					<a href={url} download="dbfr-ki.gif" className="text-sm text-dbz-orange underline">
						Télécharger
					</a>
				</figure>
			)}
		</div>
	);
}
