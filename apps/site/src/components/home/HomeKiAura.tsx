"use client";

/**
 * Aura ki Pixi.js sur le panneau « sagas légendaires ».
 * Couleur pilotée par l'accent de la saga sélectionnée (OKLCH/hex → number).
 * Pause auto hors écran / reduced-motion.
 */
import dynamic from "next/dynamic";
import { useMemo } from "react";

const KiCanvas = dynamic(() => import("@/components/site/KiCanvas").then((m) => m.KiCanvas), {
	ssr: false,
	loading: () => null,
});

/** Parse CSS color (oklch/hex/rgb) → 0xRRGGBB approximatif pour Pixi.
 *  Fallback doré DB (plus de bleu ciel 0x38bdf8 qui lavait l'écran). */
function cssColorToHex(input: string, fallback = 0xffb200): number {
	if (typeof document === "undefined") return fallback;
	try {
		const el = document.createElement("span");
		el.style.color = input;
		document.body.appendChild(el);
		const computed = getComputedStyle(el).color; // rgb(r,g,b)
		document.body.removeChild(el);
		const m = computed.match(/(\d+),\s*(\d+),\s*(\d+)/);
		if (!m) return fallback;
		const r = Number(m[1]);
		const g = Number(m[2]);
		const b = Number(m[3]);
		return ((r & 255) << 16) | ((g & 255) << 8) | (b & 255);
	} catch {
		return fallback;
	}
}

function lighten(hex: number, amount = 0.35): number {
	const r = (hex >> 16) & 255;
	const g = (hex >> 8) & 255;
	const b = hex & 255;
	const lr = Math.min(255, Math.round(r + (255 - r) * amount));
	const lg = Math.min(255, Math.round(g + (255 - g) * amount));
	const lb = Math.min(255, Math.round(b + (255 - b) * amount));
	return (lr << 16) | (lg << 8) | lb;
}

export function HomeKiAura({
	accent,
	active,
	className = "",
}: {
	/** Accent CSS de l'ère/saga (oklch / hex). */
	accent: string;
	active: boolean;
	className?: string;
}) {
	const colors = useMemo(() => {
		const base = cssColorToHex(accent, 0x38bdf8);
		return { color: base, accent: lighten(base, 0.4) };
	}, [accent]);

	if (!active) return null;

	return (
		<div
			className={`pointer-events-none absolute inset-0 z-[1] opacity-70 mix-blend-screen transition-opacity duration-700 ${className}`}
			aria-hidden
		>
			<KiCanvas
				className="absolute inset-0 h-full w-full"
				color={colors.color}
				colorAccent={colors.accent}
				density={0.55}
			/>
		</div>
	);
}
