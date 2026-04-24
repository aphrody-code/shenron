import { singleton } from "tsyringe";
import {
	createCanvas,
	loadImage,
	type Image,
	type SKRSContext2D,
} from "@napi-rs/canvas";
import {
	drawDragonBall,
	drawImageCover,
	kiScouterLabel,
	rgba,
	roundRectPath,
	textStroked,
	textWithShadow,
} from "~/lib/canvas-kit";

export interface LeaderboardEntry {
	id: string;
	username: string;
	avatarURL: string;
	xp: number;
	zeni: number;
}

export interface LeaderboardMeta {
	title: string;
	subtitle?: string;
	page: number;
	totalPages: number;
}

const BG_FILE =
	"assets/backgrounds/nebula/weighing-in-on-the-dumbbell-nebula.webp";

// Couleurs podium (or / argent / bronze)
const MEDAL = {
	1: { ring: "#facc15", glow: "#fde047" },
	2: { ring: "#cbd5e1", glow: "#e2e8f0" },
	3: { ring: "#b45309", glow: "#d97706" },
} as const;

@singleton()
export class LeaderboardService {
	private avatarCache = new Map<string, Image>();
	private bg: Image | null = null;

	private async loadAvatar(url: string): Promise<Image | null> {
		if (this.avatarCache.has(url)) return this.avatarCache.get(url)!;
		try {
			const img = await loadImage(url);
			this.avatarCache.set(url, img);
			return img;
		} catch {
			return null;
		}
	}

	private async loadBg(): Promise<Image | null> {
		if (this.bg) return this.bg;
		try {
			this.bg = await loadImage(`./${BG_FILE}`);
			return this.bg;
		} catch {
			return null;
		}
	}

	async render(
		entries: LeaderboardEntry[],
		meta: LeaderboardMeta,
	): Promise<Buffer> {
		const SCALE = 2;
		const W = 1100;
		const H = 720;
		const canvas = createCanvas(W * SCALE, H * SCALE);
		const ctx = canvas.getContext("2d") as SKRSContext2D;
		ctx.scale(SCALE, SCALE);
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = "high";

		// ── Fond ───────────────────────────────────────────────────────────
		const CARD_R = 32;
		ctx.save();
		roundRectPath(ctx, 0, 0, W, H, CARD_R);
		ctx.clip();

		const bg = await this.loadBg();
		if (bg) {
			drawImageCover(ctx, bg, 0, 0, W, H);
			ctx.fillStyle = "rgba(0,0,0,0.72)";
			ctx.fillRect(0, 0, W, H);
		} else {
			const grad = ctx.createLinearGradient(0, 0, 0, H);
			grad.addColorStop(0, "#1a0a2e");
			grad.addColorStop(1, "#0a0a0a");
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, W, H);
		}

		// Dragon Balls décoratives
		ctx.save();
		ctx.globalAlpha = 0.2;
		drawDragonBall(ctx, W - 70, 80, 40, 4);
		drawDragonBall(ctx, 80, 80, 30, 7);
		ctx.restore();

		// ── En-tête ────────────────────────────────────────────────────────
		textWithShadow(ctx, meta.title, W / 2, 70, {
			font: "bold 42px 'Saiyan Sans', 'Inter Display Black', sans-serif",
			color: "#fbbf24",
			shadow: "rgba(0,0,0,0.8)",
			blur: 14,
			align: "center",
		});
		if (meta.subtitle) {
			textWithShadow(ctx, meta.subtitle, W / 2, 100, {
				font: "500 16px 'Inter', sans-serif",
				color: "rgba(255,255,255,0.65)",
				align: "center",
			});
		}

		// ── Podium (top 3) ─────────────────────────────────────────────────
		const podium = entries.slice(0, 3);
		const slots: Array<{
			rank: 1 | 2 | 3;
			cx: number;
			cy: number;
			avR: number;
			height: number;
		}> = [];
		if (podium.length >= 1)
			slots.push({ rank: 1, cx: W / 2, cy: 220, avR: 70, height: 210 });
		if (podium.length >= 2)
			slots.push({ rank: 2, cx: W / 2 - 260, cy: 260, avR: 56, height: 170 });
		if (podium.length >= 3)
			slots.push({ rank: 3, cx: W / 2 + 260, cy: 260, avR: 56, height: 140 });

		for (const slot of slots) {
			const entry = podium[slot.rank - 1];
			if (!entry) continue;
			await this.drawPodiumSlot(ctx, entry, slot);
		}

		// ── Liste (positions 4-10) ─────────────────────────────────────────
		const rest = entries.slice(3);
		const LIST_Y = 450;
		const ROW_H = 34;
		const LIST_X = 80;
		const LIST_W = W - 160;

		if (rest.length > 0) {
			ctx.save();
			roundRectPath(ctx, LIST_X, LIST_Y, LIST_W, ROW_H * rest.length + 20, 16);
			ctx.fillStyle = "rgba(0,0,0,0.45)";
			ctx.fill();
			ctx.restore();

			for (let i = 0; i < rest.length; i++) {
				const e = rest[i]!;
				const y = LIST_Y + 20 + i * ROW_H;
				const rank = (meta.page - 1) * 10 + 4 + i;

				// Rang
				textWithShadow(ctx, `#${rank}`, LIST_X + 20, y + 15, {
					font: "bold 16px 'Inter Bold', sans-serif",
					color: "#fbbf24",
					align: "left",
				});

				// Pseudo
				textWithShadow(ctx, truncate(e.username, 24), LIST_X + 75, y + 15, {
					font: "500 15px 'Inter', sans-serif",
					color: "#f1f5f9",
					align: "left",
				});

				// XP (scouter style)
				textWithShadow(
					ctx,
					`${kiScouterLabel(e.xp)} u`,
					LIST_X + LIST_W - 160,
					y + 15,
					{
						font: "500 14px 'DBS Scouter', 'Inter', monospace",
						color: "#f9a8d4",
						align: "left",
					},
				);

				// Zéni
				textWithShadow(
					ctx,
					`${kiScouterLabel(e.zeni)} z`,
					LIST_X + LIST_W - 80,
					y + 15,
					{
						font: "500 14px 'DBS Scouter', 'Inter', monospace",
						color: "#fbbf24",
						align: "left",
					},
				);
			}
		}

		// ── Footer ─────────────────────────────────────────────────────────
		textWithShadow(
			ctx,
			`Page ${meta.page}/${meta.totalPages}  ·  ${entries.length} combattants`,
			W / 2,
			H - 22,
			{
				font: "500 14px 'Inter', sans-serif",
				color: "rgba(255,255,255,0.6)",
				align: "center",
			},
		);

		ctx.restore();
		return canvas.toBuffer("image/png");
	}

	private async drawPodiumSlot(
		ctx: SKRSContext2D,
		entry: LeaderboardEntry,
		slot: {
			rank: 1 | 2 | 3;
			cx: number;
			cy: number;
			avR: number;
			height: number;
		},
	): Promise<void> {
		const { rank, cx, cy, avR, height } = slot;
		const medal = MEDAL[rank];

		// Plateau / piédestal
		const P_W = 170;
		const P_H = height;
		const P_TOP_Y = cy + avR + 30;
		ctx.save();
		roundRectPath(ctx, cx - P_W / 2, P_TOP_Y, P_W, P_H, 10);
		const pGrad = ctx.createLinearGradient(0, P_TOP_Y, 0, P_TOP_Y + P_H);
		pGrad.addColorStop(0, rgba(medal.ring, 0.35));
		pGrad.addColorStop(1, "rgba(0,0,0,0.65)");
		ctx.fillStyle = pGrad;
		ctx.fill();
		ctx.strokeStyle = rgba(medal.ring, 0.7);
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.restore();

		// Numéro sur le piédestal
		textStroked(ctx, String(rank), cx, P_TOP_Y + P_H - 32, {
			font: "bold 72px 'Saiyan Sans', 'Inter Display Black', sans-serif",
			color: medal.ring,
			stroke: "rgba(0,0,0,0.8)",
			strokeWidth: 4,
			align: "center",
		});

		// Aura autour de l'avatar (3 couches additive)
		ctx.save();
		ctx.globalCompositeOperation = "screen";
		for (let i = 3; i > 0; i--) {
			const auraR = avR + i * 14;
			const g = ctx.createRadialGradient(cx, cy, avR * 0.5, cx, cy, auraR);
			g.addColorStop(0, rgba(medal.glow, 0.35));
			g.addColorStop(1, rgba(medal.glow, 0));
			ctx.fillStyle = g;
			ctx.fillRect(cx - auraR, cy - auraR, auraR * 2, auraR * 2);
		}
		ctx.restore();

		// Avatar
		const avatar = await this.loadAvatar(entry.avatarURL);
		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, avR, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();
		if (avatar) {
			ctx.drawImage(avatar, cx - avR, cy - avR, avR * 2, avR * 2);
		} else {
			ctx.fillStyle = "#374151";
			ctx.fillRect(cx - avR, cy - avR, avR * 2, avR * 2);
		}
		ctx.restore();

		// Ring médaille
		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, avR + 3, 0, Math.PI * 2);
		ctx.strokeStyle = medal.ring;
		ctx.lineWidth = 5;
		ctx.shadowColor = medal.glow;
		ctx.shadowBlur = 18;
		ctx.stroke();
		ctx.restore();

		// Pseudo sous l'avatar
		textWithShadow(ctx, truncate(entry.username, 16), cx, cy + avR + 18, {
			font: "bold 18px 'Inter Bold', sans-serif",
			color: "#f1f5f9",
			shadow: "rgba(0,0,0,0.9)",
			blur: 6,
			align: "center",
		});

		// Score (XP scouter-style) au milieu du piédestal
		textWithShadow(ctx, kiScouterLabel(entry.xp), cx, P_TOP_Y + 38, {
			font: "bold 26px 'DBS Scouter', 'Inter Display Black', monospace",
			color: medal.ring,
			shadow: "rgba(0,0,0,0.9)",
			blur: 8,
			align: "center",
		});
		textWithShadow(ctx, "unités", cx, P_TOP_Y + 58, {
			font: "500 12px 'Inter', sans-serif",
			color: "rgba(255,255,255,0.6)",
			align: "center",
		});
	}
}

function truncate(s: string, max: number): string {
	return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}
