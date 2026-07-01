import { ImageResponse } from "next/og";

export const alt = "Dragon Ball France — le portail francophone";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG image de marque par défaut (1200×630), générée à la volée par `next/og`.
 * Héritée par toutes les routes qui ne définissent pas leur propre image OG.
 * Styles inline uniquement, police système (latin) → aucun fetch externe.
 */
export default function OpengraphImage() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				padding: "80px",
				background:
					"radial-gradient(circle at 75% 30%, rgba(255,178,0,0.35), transparent 55%), radial-gradient(circle at 20% 85%, rgba(217,33,33,0.22), transparent 55%), #0a0a0a",
				color: "white",
				fontFamily: "sans-serif",
			}}
		>
			{/* Dragon Ball 4 étoiles stylisée */}
			<div
				style={{
					position: "absolute",
					top: 70,
					right: 80,
					width: 220,
					height: 220,
					borderRadius: "50%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "radial-gradient(circle at 38% 32%, #ffe39a, #ff8c1a 55%, #e2620a 100%)",
					boxShadow: "0 0 80px rgba(255,150,0,0.5)",
				}}
			>
				<div style={{ display: "flex", gap: 14, fontSize: 64, color: "#c8341f" }}>
					<span>★</span>
					<span>★</span>
				</div>
			</div>

			<div
				style={{
					display: "flex",
					fontSize: 30,
					letterSpacing: 8,
					textTransform: "uppercase",
					color: "#ffb200",
					fontWeight: 700,
					marginBottom: 18,
				}}
			>
				Le portail francophone
			</div>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					fontSize: 104,
					fontWeight: 800,
					lineHeight: 1,
					letterSpacing: -2,
				}}
			>
				<span style={{ color: "white" }}>Dragon&nbsp;Ball&nbsp;</span>
				<span style={{ color: "#ffb200" }}>France</span>
			</div>
			<div
				style={{
					display: "flex",
					marginTop: 34,
					fontSize: 34,
					color: "rgba(255,255,255,0.82)",
					maxWidth: 820,
				}}
			>
				Épisodes, films, manga &amp; actualités — l&apos;univers Dragon Ball en français.
			</div>
			<div
				style={{
					display: "flex",
					marginTop: "auto",
					fontSize: 26,
					color: "rgba(255,255,255,0.5)",
					letterSpacing: 2,
				}}
			>
				dragonballfr.com
			</div>
		</div>,
		size
	);
}
