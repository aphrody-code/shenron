"use client";

/**
 * Effets de combat style DBZ (canvas 2D) :
 *  - hit / select sparks
 *  - kamehameha : charge (boule + anneaux) → beam bleu → flash
 *
 * API impérative via `apiRef` pour coller aux SFX sans re-render.
 * Pas d'assets copyrightés — rendu original inspiré de l'animé.
 */
import { useEffect, useRef, type MutableRefObject } from "react";

export type BurstKind = "hit" | "kamehameha" | "select" | "power";

export type HomeBattleFxApi = {
	burst: (kind: BurstKind, x: number, y: number, accentCss?: string) => void;
};

type Burst = {
	kind: BurstKind;
	x: number;
	y: number;
	t0: number;
	color: [number, number, number];
	dir: number;
};

function parseAccent(css: string | undefined): [number, number, number] {
	if (!css || typeof document === "undefined") return [56, 189, 248];
	try {
		const el = document.createElement("span");
		el.style.color = css;
		document.body.appendChild(el);
		const c = getComputedStyle(el).color;
		document.body.removeChild(el);
		const m = c.match(/(\d+),\s*(\d+),\s*(\d+)/);
		if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
	} catch {
		/* ignore */
	}
	return [56, 189, 248];
}

function rgba(r: number, g: number, b: number, a: number) {
	return `rgba(${r},${g},${b},${a})`;
}

export function HomeBattleFx({
	apiRef,
	accent,
}: {
	apiRef: MutableRefObject<HomeBattleFxApi | null>;
	accent?: string;
}) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const burstsRef = useRef<Burst[]>([]);
	const rafRef = useRef(0);
	const accentRef = useRef(accent);

	useEffect(() => {
		accentRef.current = accent;
	}, [accent]);

	useEffect(() => {
		const ensureLoop = () => {
			if (rafRef.current) return;
			const tick = (now: number) => {
				const canvas = canvasRef.current;
				if (!canvas) {
					rafRef.current = 0;
					return;
				}
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					rafRef.current = 0;
					return;
				}
				const dpr = Math.min(window.devicePixelRatio || 1, 2);
				const w = window.innerWidth;
				const h = window.innerHeight;
				if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
					canvas.width = Math.floor(w * dpr);
					canvas.height = Math.floor(h * dpr);
					canvas.style.width = `${w}px`;
					canvas.style.height = `${h}px`;
					ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
				}
				ctx.clearRect(0, 0, w, h);

				const next: Burst[] = [];
				for (const b of burstsRef.current) {
					const age = (now - b.t0) / 1000;
					const [r, g, bl] = b.color;

					if (b.kind === "hit") {
						if (age > 0.45) continue;
						const p = age / 0.45;
						ctx.beginPath();
						ctx.arc(b.x, b.y, 8 + p * 52, 0, Math.PI * 2);
						ctx.strokeStyle = rgba(r, g, bl, 1 - p);
						ctx.lineWidth = 3 * (1 - p);
						ctx.stroke();
						for (let i = 0; i < 10; i++) {
							const a = b.dir + (i / 10) * Math.PI * 2;
							const dist = 14 + p * 80;
							ctx.beginPath();
							ctx.moveTo(b.x, b.y);
							ctx.lineTo(b.x + Math.cos(a) * dist, b.y + Math.sin(a) * dist);
							ctx.strokeStyle = rgba(255, 255, 255, (1 - p) * 0.9);
							ctx.lineWidth = 2;
							ctx.stroke();
						}
						next.push(b);
					} else if (b.kind === "select" || b.kind === "power") {
						if (age > 0.65) continue;
						const p = age / 0.65;
						for (let k = 0; k < 4; k++) {
							const rp = (p + k * 0.18) % 1;
							ctx.beginPath();
							ctx.arc(b.x, b.y, 18 + rp * 130, 0, Math.PI * 2);
							ctx.strokeStyle = rgba(r, g, bl, (1 - rp) * 0.6);
							ctx.lineWidth = 3;
							ctx.stroke();
						}
						const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 40 + p * 40);
						grd.addColorStop(0, rgba(r, g, bl, 0.35 * (1 - p)));
						grd.addColorStop(1, rgba(r, g, bl, 0));
						ctx.fillStyle = grd;
						ctx.beginPath();
						ctx.arc(b.x, b.y, 80, 0, Math.PI * 2);
						ctx.fill();
						next.push(b);
					} else if (b.kind === "kamehameha") {
						// Timings alignés sur sfx.kamehamehaFull() :
						// charge ~1.05 s (ki-charge) → beam long (clip kamehameha).
						if (age > 4.2) continue;
						const chargeEnd = 1.05;
						const beamEnd = 3.4;

						if (age < chargeEnd) {
							const p = age / chargeEnd;
							const rad = 16 + p * 52;
							const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, rad);
							grd.addColorStop(0, "rgba(255,255,255,0.98)");
							grd.addColorStop(0.3, "rgba(140,210,255,0.95)");
							grd.addColorStop(0.65, "rgba(50,130,255,0.55)");
							grd.addColorStop(1, "rgba(20,80,255,0)");
							ctx.beginPath();
							ctx.arc(b.x, b.y, rad, 0, Math.PI * 2);
							ctx.fillStyle = grd;
							ctx.fill();
							for (let k = 0; k < 4; k++) {
								const rp = (p * 1.2 + k * 0.22) % 1;
								ctx.beginPath();
								ctx.arc(b.x, b.y, 24 + rp * 100, 0, Math.PI * 2);
								ctx.strokeStyle = `rgba(100,180,255,${(1 - rp) * 0.55})`;
								ctx.lineWidth = 2.5;
								ctx.stroke();
							}
							for (let i = 0; i < 20; i++) {
								const a = (i / 20) * Math.PI * 2 + age * 10;
								const dist = rad * 0.75 + (i % 4) * 5;
								ctx.fillStyle = "rgba(200,235,255,0.85)";
								ctx.fillRect(b.x + Math.cos(a) * dist - 1.5, b.y + Math.sin(a) * dist - 1.5, 3, 3);
							}
						} else if (age < beamEnd) {
							const p = (age - chargeEnd) / (beamEnd - chargeEnd);
							const len = Math.max(w, h) * 1.45;
							const ang = b.dir;
							const ex = b.x + Math.cos(ang) * len;
							const ey = b.y + Math.sin(ang) * len;
							const width = 22 + (1 - p) * 32;

							ctx.save();
							ctx.globalCompositeOperation = "lighter";
							const beamGrad = ctx.createLinearGradient(b.x, b.y, ex, ey);
							beamGrad.addColorStop(0, `rgba(255,255,255,${0.98 * (1 - p * 0.25)})`);
							beamGrad.addColorStop(0.12, "rgba(150,220,255,0.95)");
							beamGrad.addColorStop(0.45, "rgba(50,150,255,0.7)");
							beamGrad.addColorStop(1, "rgba(20,60,200,0)");
							ctx.strokeStyle = beamGrad;
							ctx.lineCap = "round";
							ctx.lineWidth = width * 2.4;
							ctx.beginPath();
							ctx.moveTo(b.x, b.y);
							ctx.lineTo(ex, ey);
							ctx.stroke();
							ctx.strokeStyle = `rgba(255,255,255,${0.95 * (1 - p * 0.35)})`;
							ctx.lineWidth = width * 0.4;
							ctx.beginPath();
							ctx.moveTo(b.x, b.y);
							ctx.lineTo(ex, ey);
							ctx.stroke();

							const br = 32 + 12 * Math.sin(age * 42);
							const g2 = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, br);
							g2.addColorStop(0, "#fff");
							g2.addColorStop(0.35, "rgba(160,220,255,0.95)");
							g2.addColorStop(1, "rgba(40,100,255,0)");
							ctx.beginPath();
							ctx.arc(b.x, b.y, br, 0, Math.PI * 2);
							ctx.fillStyle = g2;
							ctx.fill();

							for (let i = 0; i < 28; i++) {
								const u = (i / 28 + age * 0.8) % 1;
								const px = b.x + Math.cos(ang) * len * u;
								const py = b.y + Math.sin(ang) * len * u;
								const off = Math.sin(i * 2.3 + age * 22) * width * 0.7;
								const nx = -Math.sin(ang) * off;
								const ny = Math.cos(ang) * off;
								ctx.fillStyle = `rgba(190,230,255,${(1 - u) * 0.75})`;
								ctx.beginPath();
								ctx.arc(px + nx, py + ny, 2 + (1 - u) * 3.5, 0, Math.PI * 2);
								ctx.fill();
							}
							ctx.restore();
							ctx.fillStyle = `rgba(80,160,255,${0.1 * (1 - p)})`;
							ctx.fillRect(0, 0, w, h);
						} else {
							const p = (age - beamEnd) / 0.4;
							ctx.fillStyle = `rgba(180,220,255,${0.28 * (1 - p)})`;
							ctx.fillRect(0, 0, w, h);
						}
						next.push(b);
					}
				}
				burstsRef.current = next;
				if (next.length > 0) rafRef.current = requestAnimationFrame(tick);
				else {
					rafRef.current = 0;
					ctx.clearRect(0, 0, w, h);
				}
			};
			rafRef.current = requestAnimationFrame(tick);
		};

		apiRef.current = {
			burst: (kind, x, y, accentCss) => {
				const color = parseAccent(accentCss ?? accentRef.current);
				const dir =
					kind === "kamehameha" ? -0.12 + (Math.random() - 0.5) * 0.2 : Math.random() * Math.PI * 2;
				burstsRef.current.push({ kind, x, y, t0: performance.now(), color, dir });
				ensureLoop();
			},
		};
		return () => {
			apiRef.current = null;
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [apiRef]);

	return (
		<canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[45]" aria-hidden />
	);
}
