import "reflect-metadata";
import { mock } from "bun:test";

// Note : Tailwind v4 est pré-compilé par `bun run dashboard:css` (CLI officiel)
// qui scanne les TSX et génère `src/dashboard/styles.compiled.css`. Le bundler
// HTML import de Bun.serve sert ensuite ce fichier déjà compilé.
// Le plugin `bun-plugin-tailwind` à `Bun.plugin(...)` n'est pas appliqué au
// bundling HTML runtime (testé), d'où le pre-build via CLI.

// ─── Shim canvas pour environnements sans binding natif ─────────────────────
// Le binding natif @aphrody-code/canvas (skia) est compilé contre une GLIBC
// récente absente des runners CI (GLIBC 2.43) et n'a pas de binaire darwin. S'il
// ne charge pas, on substitue un shim no-op : imports et DI ne crashent plus,
// les smoke tests tournent (le rendu réel est couvert par canvas-render.test.ts,
// skippé quand le natif est indisponible — cf. shenronCanvasNativeOk).
// Le binaire skia n'est publié que pour linux-x64-gnu (cf. optionalDependencies
// du lockfile). On ne tente l'import de détection que là : sur macOS/autre, le
// loader @napi-rs émet une "unhandled error" non catchable proprement (aucun
// binaire darwin) qui ferait échouer bun:test malgré 0 fail — donc shim direct.
let canvasNativeOk = false;
// SHENRON_CANVAS_SHIM=1 force le shim (debug / repro CI sur machine au binding OK).
if (
	Bun.env.SHENRON_CANVAS_SHIM !== "1" &&
	process.platform === "linux" &&
	process.arch === "x64"
) {
	try {
		await import("@aphrody-code/canvas");
		canvasNativeOk = true;
	} catch {
		canvasNativeOk = false;
	}
}
(globalThis as Record<string, unknown>).shenronCanvasNativeOk = canvasNativeOk;

if (!canvasNativeOk) {
	const noopCtx = new Proxy(
		{},
		{
			get(_target, prop) {
				if (prop === "measureText") return () => ({ width: 0 });
				if (prop === "createLinearGradient" || prop === "createRadialGradient")
					return () => ({ addColorStop() {} });
				if (prop === "getImageData")
					return () => ({ data: new Uint8ClampedArray(4) });
				return () => undefined;
			},
		},
	);
	class FakeImage {
		width = 0;
		height = 0;
		src: unknown = null;
		onload: (() => void) | null = null;
		onerror: (() => void) | null = null;
	}
	const fakeCanvas = () => ({
		width: 0,
		height: 0,
		getContext: () => noopCtx,
		toBuffer: () => Buffer.alloc(0),
		encode: async () => Buffer.alloc(0),
		toDataURL: () => "data:image/png;base64,",
	});
	mock.module("@aphrody-code/canvas", () => ({
		createCanvas: () => fakeCanvas(),
		loadImage: async () => new FakeImage(),
		Image: FakeImage,
		GlobalFonts: {
			registerFromPath: () => true,
			register: () => true,
			has: () => false,
			get families() {
				return [];
			},
		},
	}));
}
