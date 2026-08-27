"use client";

/**
 * Avatar — image de profil avec repli, pour tout ce qui est public.
 *
 * Les composants géraient l'avatar ABSENT (`avatar && <img>`), jamais l'avatar
 * qui répond 404 : une URL `cdn.discordapp.com` devient invalide dès que la
 * personne change d'image, et le navigateur affichait alors son icône d'image
 * brisée au milieu d'une liste de commentaires ou du classement de la home.
 *
 * Le repli est une silhouette neutre, pas une initiale dans un rond coloré :
 * DESIGN.md l'interdit, et une lettre n'identifie personne dans une liste où
 * plusieurs pseudos commencent pareil.
 */
import { useEffect, useState } from "react";

export function Avatar({
	src,
	alt = "",
	size = 28,
	className = "",
}: {
	src?: string | null;
	/** Laisser vide quand le nom est déjà écrit à côté (évite la redite au lecteur d'écran). */
	alt?: string;
	size?: number;
	className?: string;
}) {
	const [casse, setCasse] = useState(false);
	// Une nouvelle URL mérite une nouvelle chance : sans ça, un avatar réparé
	// entre deux rendus resterait sur le repli.
	useEffect(() => setCasse(false), [src]);

	const base = `shrink-0 rounded-full object-cover ${className}`;

	if (!src || casse) {
		return (
			<span
				className={`grid place-items-center bg-white/[0.07] text-white/35 ${base}`}
				style={{ width: size, height: size }}
				role="img"
				aria-label={alt || undefined}
			>
				<svg
					viewBox="0 0 24 24"
					width={Math.round(size * 0.58)}
					height={Math.round(size * 0.58)}
					fill="none"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
					aria-hidden
				>
					<circle cx="12" cy="8.5" r="3.6" />
					<path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
				</svg>
			</span>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			width={size}
			height={size}
			loading="lazy"
			decoding="async"
			onError={() => setCasse(true)}
			className={base}
			style={{ width: size, height: size }}
		/>
	);
}
