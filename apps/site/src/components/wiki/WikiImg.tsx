"use client";

/**
 * WikiImg — image wiki robuste avec chaîne de repli.
 *
 * Beaucoup d'images de personnages (chemins `assets/wiki/characters/*.webp`
 * issus de l'ingest Fandom) renvoient 404 (fichier jamais mirroré). Plutôt
 * qu'une vignette cassée, ce composant essaie successivement `src` puis
 * `fallback` (ex. portrait Xenoverse 2), et si tout échoue affiche un
 * placeholder stylé (initiale + halftone, charte DBZ) au lieu de l'icône
 * d'image brisée du navigateur. Client (gestion `onError`).
 */
import { useState } from "react";
import Image from "next/image";
import { assetUrl } from "@/lib/assets";
import { isEditableAsset } from "@/lib/images";

export function WikiImg({
	src,
	fallback,
	alt,
	className,
	placeholderClassName,
	loading,
	sizes,
}: {
	/** Chemin d'asset BRUT (résolu via assetUrl en interne), ou null. */
	src: string | null | undefined;
	/** Chemin d'asset BRUT de repli (ex. portrait XV2), ou null. */
	fallback?: string | null;
	alt: string;
	className?: string;
	/** Classes du placeholder (par défaut : fond carte DBZ + halftone). */
	placeholderClassName?: string;
	loading?: "lazy" | "eager";
	/**
	 * Largeur de rendu CSS (ex. `"104px"`, `"(min-width:1024px) 200px, 45vw"`).
	 *
	 * Le fournir bascule le rendu sur `next/image` en mode `fill` : l'image est
	 * alors redimensionnée et servie en AVIF/WebP au lieu du JPEG source. À NE
	 * fournir que si le parent est positionné et dimensionné — sinon `fill`
	 * casserait la mise en page (cas de la fiche personnage, en `h-auto`).
	 *
	 * Sans `sizes`, on garde le `<img>` d'origine : hauteur intrinsèque préservée,
	 * comportement inchangé.
	 */
	sizes?: string;
}) {
	// Chaîne d'URL candidates dédupliquée (résolues).
	const chain = [src, fallback]
		.filter((p): p is string => !!p && p.trim().length > 0)
		.map((p) => assetUrl(p));
	const [idx, setIdx] = useState(0);
	const [dead, setDead] = useState(false);

	if (dead || chain.length === 0) {
		// Repli : un cercle en filet, pas une initiale. L'initiale géante en
		// orange à 30 % d'opacité, sous le dégradé noir de la carte, ne se
		// distinguait pas d'un rectangle vide — sur une grille de 1 300
		// personnages dont beaucoup n'ont pas d'illustration, la page paraissait
		// cassée. Un repère neutre dit « pas d'image » sans prétendre informer.
		return (
			<div
				className={
					placeholderClassName ??
					"absolute inset-0 flex items-center justify-center bg-dbz-card overflow-hidden"
				}
				aria-label={alt}
				role="img"
			>
				<div className="absolute inset-0 halftone opacity-[0.06]" />
				<svg
					viewBox="0 0 24 24"
					className="h-7 w-7 text-white/15"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.25"
					aria-hidden
				>
					<circle cx="12" cy="12" r="9" />
					<path d="M4.5 17.5 9 12l3.5 3.5L15.5 13l4 4.5" />
				</svg>
			</div>
		);
	}

	const onError = () => {
		if (idx < chain.length - 1) setIdx(idx + 1);
		else setDead(true);
	};

	if (sizes) {
		return (
			<Image
				src={chain[idx]!}
				alt={alt}
				fill
				sizes={sizes}
				quality={70}
				// Téléversement de l'admin : servi tel quel pour rester frais dès le
				// remplacement (cf. lib/images.ts).
				unoptimized={isEditableAsset(chain[idx])}
				loading={loading ?? "lazy"}
				className={className}
				onError={onError}
			/>
		);
	}

	return (
		<img
			src={chain[idx]}
			alt={alt}
			loading={loading ?? "lazy"}
			className={className}
			onError={onError}
		/>
	);
}
