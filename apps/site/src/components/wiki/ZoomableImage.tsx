"use client";

import { useCallback, useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { createPortal } from "react-dom";

/**
 * Image de contenu wiki cliquable → ouvre une lightbox plein écran (zoom).
 * Rendue à la place du <img> par WikiMarkdown, donc le src arrive déjà résolu
 * (CDN bot) — on ne re-passe PAS par assetUrl ici.
 *
 * Portail sur <body> : les panneaux `.reveal-up`/`.dbz-panel` posent un
 * `transform`/`animation` qui établirait un bloc conteneur et casserait un
 * `position: fixed`. Le portail garantit un overlay vraiment plein écran.
 */
export function ZoomableImage({
	src,
	alt,
	className,
	...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
	const [open, setOpen] = useState(false);
	const closeBtn = useRef<HTMLButtonElement>(null);
	const close = useCallback(() => setOpen(false), []);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		closeBtn.current?.focus();
		return () => {
			document.body.style.overflow = prevOverflow;
			window.removeEventListener("keydown", onKey);
		};
	}, [open, close]);

	const label = typeof alt === "string" && alt ? alt : "Image agrandie";

	return (
		<>
			{/* biome-ignore lint/a11y/useAltText: alt forwardé depuis le markdown */}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: image-bouton (lightbox) */}
			<img
				{...rest}
				src={src}
				alt={alt ?? ""}
				loading="lazy"
				onClick={() => setOpen(true)}
				className={`wiki-zoomable${className ? ` ${className}` : ""}`}
			/>
			{open &&
				typeof document !== "undefined" &&
				createPortal(
					// biome-ignore lint/a11y/noStaticElementInteractions: overlay fermable au clic
					// biome-ignore lint/a11y/useKeyWithClickEvents: Échap géré globalement (useEffect)
					<div
						className="wiki-lightbox"
						role="dialog"
						aria-modal="true"
						aria-label={label}
						onClick={close}
					>
						<button
							ref={closeBtn}
							type="button"
							className="wiki-lightbox__close"
							aria-label="Fermer"
							onClick={close}
						>
							×
						</button>
						{/* biome-ignore lint/a11y/useAltText: décoratif, déjà annoncé par le dialog */}
						<img src={src} alt={alt ?? ""} className="wiki-lightbox__img" />
						{typeof alt === "string" && alt ? (
							<span className="wiki-lightbox__cap">{alt}</span>
						) : null}
					</div>,
					document.body
				)}
		</>
	);
}
