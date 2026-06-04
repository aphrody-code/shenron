import Image from "next/image";
import { assetUrl } from "@/lib/assets";
import type { HomeScene } from "@/lib/home-scenes";

/**
 * Fond cinématique d'un panneau : image (ken-burns quand actif) + color grade
 * d'ère + vignette + grain + aura d'énergie + letterbox. Empilable (les scènes
 * héro se font un crossfade par `opacity`). Pas de hook → léger, rendu dans
 * l'arbre client de HomeExperience.
 */
export function SceneBackdrop({
	scene,
	active,
	priority = false,
	visible = true,
}: {
	scene: HomeScene;
	active: boolean;
	priority?: boolean;
	visible?: boolean;
}) {
	return (
		<div
			aria-hidden
			data-active={active}
			className="scene-backdrop absolute inset-0 overflow-hidden"
			style={{
				// @ts-expect-error custom property
				"--accent": scene.accent,
				opacity: visible ? 1 : 0,
			}}
		>
			{/* Fond multimédia : vidéo en arrière-plan si disponible avec transition fluide, sinon image statique */}
			{scene.video ? (
				<video
					src={scene.video}
					autoPlay
					loop
					muted
					playsInline
					className={`scene-img object-cover object-center absolute inset-0 w-full h-full transition-all duration-1000 ${
						active ? "scale-105 opacity-80" : "scale-100 opacity-20"
					}`}
				/>
			) : (
				<Image
					src={assetUrl(scene.image)}
					alt=""
					fill
					priority={priority}
					sizes="100vw"
					className={`scene-img object-cover object-[center_22%] ${
						active ? "scene-img--live" : ""
					}`}
				/>
			)}

			{/* Color grade d'ère — teinte l'image vers l'accent, fondu vers le noir */}
			<div className="scene-grade absolute inset-0" />
			{/* Lisibilité — dégradés bas + haut */}
			<div className="absolute inset-0 bg-gradient-to-t from-dbz-bg via-dbz-bg/40 to-dbz-bg/70" />
			<div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-dbz-bg/80 to-transparent" />
			{/* Aura d'énergie — halo radial accentué, pulse quand actif */}
			<div
				className={`scene-aura absolute inset-0 ${active ? "ki-pulse" : ""}`}
			/>
			{/* Grain argentique + scanlines HUD discrètes */}
			<div className="film-grain absolute inset-0 opacity-[0.18]" />
			{/* Letterbox cinéma */}
			<div className="scene-bar scene-bar--top" />
			<div className="scene-bar scene-bar--bottom" />
		</div>
	);
}
