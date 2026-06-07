"use client";

import { Application, extend, useApplication, useTick } from "@pixi/react";
import { Container, Graphics, Particle, ParticleContainer, RenderTexture } from "pixi.js";
import { BloomFilter } from "pixi-filters";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type {
	Graphics as GraphicsT,
	Container as ContainerT,
	ParticleContainer as ParticleContainerT,
	Texture,
} from "pixi.js";

extend({ Container, Graphics, ParticleContainer });

type KiCanvasProps = {
	className?: string;
	color?: number;
	colorAccent?: number;
	density?: number;
};

export function KiCanvas({
	className = "",
	color = 0xa855f7,
	colorAccent = 0x38bdf8,
	density = 1,
}: KiCanvasProps) {
	const hostRef = useRef<HTMLDivElement | null>(null);

	return (
		<div ref={hostRef} className={className} aria-hidden style={{ pointerEvents: "none" }}>
			<Application
				preference="webgpu"
				backgroundAlpha={0}
				antialias
				autoStart
				resizeTo={hostRef}
				resolution={typeof window !== "undefined" ? Math.min(window.devicePixelRatio ?? 1, 2) : 1}
				autoDensity
				powerPreference="high-performance"
			>
				<Scene color={color} colorAccent={colorAccent} count={Math.floor(220 * density)} />
			</Application>
		</div>
	);
}

function Scene({
	color,
	colorAccent,
	count,
}: {
	color: number;
	colorAccent: number;
	count: number;
}) {
	return (
		<pixiContainer>
			<Halo color={color} colorAccent={colorAccent} />
			<BurstWithBloom color={color} colorAccent={colorAccent} />
			<KiParticles color={color} colorAccent={colorAccent} count={count} />
		</pixiContainer>
	);
}

/* ------- halo radial bi-couche ------- */

function Halo({ color, colorAccent }: { color: number; colorAccent: number }) {
	const { app } = useApplication();
	const draw = useCallback(
		(g: GraphicsT) => {
			g.clear();
			const w = app.screen.width;
			const h = app.screen.height;
			const cx = w / 2;
			const cy = h / 2;
			const r = Math.hypot(w, h) * 0.55;
			g.circle(cx, cy, r).fill({ color, alpha: 0.18 });
			g.circle(cx, cy, r * 0.55).fill({ color: colorAccent, alpha: 0.22 });
		},
		[app, color, colorAccent]
	);
	return <pixiGraphics draw={draw} />;
}

/* ------- sun-burst rotatif + bloom (pixi-filters) ------- */

function BurstWithBloom({ color, colorAccent }: { color: number; colorAccent: number }) {
	const { app } = useApplication();
	const ref = useRef<GraphicsT | null>(null);
	const containerRef = useRef<ContainerT | null>(null);
	const SLICES = 36;

	const bloom = useMemo(
		() =>
			new BloomFilter({
				strength: { x: 8, y: 8 },
			}),
		[]
	);

	useEffect(() => {
		if (containerRef.current) containerRef.current.filters = [bloom];
	}, [bloom]);

	const draw = useCallback(
		(g: GraphicsT) => {
			g.clear();
			const radius = Math.hypot(app.screen.width, app.screen.height) * 0.75;
			for (let i = 0; i < SLICES; i++) {
				const a0 = (i / SLICES) * Math.PI * 2;
				const a1 = ((i + 0.5) / SLICES) * Math.PI * 2;
				g.moveTo(0, 0)
					.lineTo(Math.cos(a0) * radius, Math.sin(a0) * radius)
					.lineTo(Math.cos(a1) * radius, Math.sin(a1) * radius)
					.closePath()
					.fill({ color: i % 2 === 0 ? color : colorAccent, alpha: 0.1 });
			}
		},
		[app, color, colorAccent]
	);

	useTick((t) => {
		if (ref.current) ref.current.rotation += 0.0008 * t.deltaTime;
	});

	return (
		<pixiContainer ref={containerRef} x={app.screen.width / 2} y={app.screen.height / 2}>
			<pixiGraphics ref={ref} draw={draw} />
		</pixiContainer>
	);
}

/* ------- ki particles via ParticleContainer (GPU instanced) ------- */

type ParticleState = {
	p: Particle;
	vx: number;
	vy: number;
	life: number;
	baseAlpha: number;
};

function makeCircleTexture(app: ReturnType<typeof useApplication>["app"]): Texture {
	const size = 16;
	const g = new Graphics()
		.circle(size / 2, size / 2, size / 2 - 1)
		.fill({ color: 0xffffff, alpha: 1 });
	const tex = RenderTexture.create({
		width: size,
		height: size,
		antialias: true,
		resolution: 2,
	});
	app.renderer.render({ container: g, target: tex });
	g.destroy();
	return tex;
}

function KiParticles({
	color,
	colorAccent,
	count,
}: {
	color: number;
	colorAccent: number;
	count: number;
}) {
	const { app } = useApplication();
	const pcRef = useRef<ParticleContainerT | null>(null);
	const stateRef = useRef<ParticleState[]>([]);

	const texture = useMemo(() => makeCircleTexture(app), [app]);

	useEffect(() => {
		const pc = pcRef.current;
		if (!pc) return;
		const w = app.screen.width || 1200;
		const h = app.screen.height || 600;
		const states: ParticleState[] = [];
		for (let i = 0; i < count; i++) {
			const useAccent = Math.random() > 0.6;
			const scale = 0.15 + Math.random() * 0.5;
			const baseAlpha = 0.5 + Math.random() * 0.5;
			const p = new Particle({
				texture,
				x: Math.random() * w,
				y: Math.random() * h,
				scaleX: scale,
				scaleY: scale,
				tint: useAccent ? colorAccent : color,
				alpha: baseAlpha,
			});
			pc.addParticle(p);
			states.push({
				p,
				vx: (Math.random() - 0.5) * 0.4,
				vy: -(0.4 + Math.random() * 1.4),
				life: Math.random(),
				baseAlpha,
			});
		}
		stateRef.current = states;
		return () => {
			for (const s of states) pc.removeParticle(s.p);
			stateRef.current = [];
		};
	}, [app, color, colorAccent, count, texture]);

	useTick((t) => {
		const states = stateRef.current;
		if (states.length === 0) return;
		const w = app.screen.width;
		const h = app.screen.height;
		const dt = t.deltaTime;
		for (const s of states) {
			s.p.x += s.vx * dt;
			s.p.y += s.vy * dt;
			s.life += 0.005 * dt;
			if (s.p.y < -10) {
				s.p.y = h + 10;
				s.p.x = Math.random() * w;
			}
			if (s.p.x < -10) s.p.x = w + 10;
			else if (s.p.x > w + 10) s.p.x = -10;
			s.p.alpha = s.baseAlpha * (0.5 + Math.sin(s.life * 4) * 0.5);
		}
	});

	return (
		<pixiParticleContainer
			ref={pcRef}
			dynamicProperties={{
				position: true,
				color: true,
				scale: false,
				rotation: false,
			}}
		/>
	);
}
