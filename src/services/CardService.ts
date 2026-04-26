import { singleton, inject } from "tsyringe";
import { createCanvas, loadImage, type Image, type SKRSContext2D } from "@napi-rs/canvas";
import { BackgroundCacheService } from "./BackgroundCacheService";
import type { User } from "discord.js";
import { formatXP, levelForXP, nextThresholdFrom } from "~/lib/xp";
import { LEVEL_THRESHOLDS } from "~/lib/constants";
import { logger } from "~/lib/logger";
import {
  drawDragonBall,
  drawImageCover,
  drawStar,
  fillRadialGlow,
  hexToRgb,
  kiScouterLabel,
  rgba,
  roundRectPath,
  textStroked,
  textWithShadow,
} from "~/lib/canvas-kit";

interface CardTheme {
  name: string;
  accent: string; // couleur principale (ring, highlights)
  aura: string; // couleur de l'aura avatar + barre XP
  bgGrad: readonly [string, string, string]; // dégradé de fond si pas d'image
  bgFile?: string; // chemin relatif (assets/backgrounds/...) — overlay obscurci en top
  textShadow: string;
}

// Palettes calquées sur les couleurs officielles de l'anime/manga DBZ.
// Sources : brandpalettes.com pour le logo, schemecolor.com pour Goku/Vegeta.
const CARDS: Record<string, CardTheme> = {
  default: {
    name: "DB Classic",
    accent: "#F3E603",
    aura: "#D67711",
    bgGrad: ["#550000", "#D67711", "#1a0a00"],
    bgFile: "assets/backgrounds/sun/close-up-view-of-an-active-region-of-the.webp",
    textShadow: "rgba(0,0,0,0.8)",
  },
  goku: {
    name: "Goku",
    accent: "#F85B1A",
    aura: "#FA5A1E",
    bgGrad: ["#3b0d00", "#F85B1A", "#072083"],
    bgFile: "assets/backgrounds/earth/earth-observation-from-the-international.webp",
    textShadow: "rgba(7,32,131,0.8)",
  },
  vegeta: {
    name: "Vegeta",
    accent: "#2955DC",
    aura: "#4169E1",
    bgGrad: ["#0a0f3d", "#2955DC", "#181463"],
    bgFile: "assets/backgrounds/galaxy/hubble-peeks-at-a-spiral-galaxy.webp",
    textShadow: "rgba(24,20,99,0.9)",
  },
  kaio: {
    name: "Kaio-ken",
    accent: "#FA0011",
    aura: "#FF3030",
    bgGrad: ["#4a0000", "#FA0011", "#1a0000"],
    bgFile: "assets/backgrounds/nebula/weighing-in-on-the-dumbbell-nebula.webp",
    textShadow: "rgba(74,0,0,0.9)",
  },
  ssj: {
    name: "Super Saiyan",
    accent: "#F9EE54",
    aura: "#FFD700",
    bgGrad: ["#422006", "#F3A903", "#0f0800"],
    bgFile: "assets/backgrounds/sun/full-disk-image-of-the-sun-march-26-2007.webp",
    textShadow: "rgba(66,32,6,0.9)",
  },
  blue: {
    name: "Super Saiyan Blue",
    accent: "#00E5FF",
    aura: "#00B8FF",
    bgGrad: ["#001a3d", "#0369a1", "#00091f"],
    bgFile: "assets/backgrounds/aurora/aurora-borealis-at-kennedy-space-center.webp",
    textShadow: "rgba(0,26,61,0.9)",
  },
  rose: {
    name: "Super Saiyan Rosé",
    accent: "#FF4FB0",
    aura: "#FF1493",
    bgGrad: ["#3a0420", "#9d174d", "#0a0208"],
    bgFile: "assets/backgrounds/nebula/ant-nebula.webp",
    textShadow: "rgba(58,4,32,0.9)",
  },
  ultra: {
    name: "Ultra Instinct",
    accent: "#E5E9F0",
    aura: "#B4C4DD",
    bgGrad: ["#000814", "#475569", "#000000"],
    bgFile: "assets/backgrounds/galaxy/spiral-galaxy-m83.webp",
    textShadow: "rgba(0,8,20,0.95)",
  },
};

export interface CardInput {
  discordUser: User;
  xp: number;
  zeni: number;
  messageCount: number;
  cardKey?: string | null;
  badge?: string | null;
  title?: string | null;
  color?: string | null;
  fused?: boolean;
  rank?: number | null;
}

@singleton()
export class CardService {
  private avatarCache = new Map<string, { image: Image; ts: number }>();
  private bgCache = new Map<string, Image | null>();

  constructor(@inject(BackgroundCacheService) private bgs: BackgroundCacheService) {}

  private async loadAvatar(user: User): Promise<Image | null> {
    const cached = this.avatarCache.get(user.id);
    if (cached && Date.now() - cached.ts < 60 * 60_000) return cached.image;
    const url = user.displayAvatarURL({
      extension: "png",
      size: 512,
      forceStatic: true,
    });
    try {
      const img = await loadImage(url);
      this.avatarCache.set(user.id, { image: img, ts: Date.now() });
      return img;
    } catch {
      return null;
    }
  }

  private async loadBackground(key: string): Promise<Image | null> {
    if (this.bgCache.has(key)) return this.bgCache.get(key) ?? null;
    // 1) bgFile explicite du thème (assets/backgrounds/...) — délégué au cache partagé
    const theme = CARDS[key];
    if (theme?.bgFile) {
      const img = await this.bgs.get(theme.bgFile);
      if (img) {
        this.bgCache.set(key, img);
        return img;
      }
    }
    // 2) convention legacy assets/cards/<key>.(webp|png|jpg) — backgrounds achetables via shop
    for (const ext of ["webp", "png", "jpg"]) {
      const img = await this.bgs.get(`assets/cards/${key}.${ext}`);
      if (img) {
        this.bgCache.set(key, img);
        return img;
      }
    }
    this.bgCache.set(key, null);
    return null;
  }

  listCards(): string[] {
    return Object.keys(CARDS);
  }

  describeCard(key: string): CardTheme | undefined {
    return CARDS[key];
  }

  /**
   * Render the profile card at 2× internal resolution (retina)
   * then return a high-quality PNG buffer.
   */
  async render(input: CardInput): Promise<Buffer> {
    const SCALE = 2;
    const W = 1000 * SCALE;
    const H = 360 * SCALE;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d") as SKRSContext2D;
    ctx.scale(SCALE, SCALE);

    const cardKey = input.cardKey && CARDS[input.cardKey] ? input.cardKey : "default";
    const theme = CARDS[cardKey]!;
    const userColor = input.color || theme.accent;

    const width = 1000;
    const height = 360;
    const PAD = 24;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const CARD_R = 28;
    ctx.save();
    roundRectPath(ctx, 0, 0, width, height, CARD_R);
    ctx.clip();

    const bg = await this.loadBackground(cardKey);
    if (bg) {
      // object-fit: cover — préserve le ratio, crop ce qui dépasse
      drawImageCover(ctx, bg, 0, 0, width, height);
      // Overlay dégradé : obscurci à gauche pour lisibilité de l'avatar/texte
      const overlay = ctx.createLinearGradient(0, 0, width, 0);
      overlay.addColorStop(0, "rgba(0,0,0,0.78)");
      overlay.addColorStop(0.55, "rgba(0,0,0,0.45)");
      overlay.addColorStop(1, "rgba(0,0,0,0.22)");
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, width, height);
      // Teinte thématique légère pour marier bg + palette
      ctx.fillStyle = rgba(theme.aura, 0.08);
      ctx.fillRect(0, 0, width, height);
    } else {
      // Multi-stop linear gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, theme.bgGrad[0]);
      grad.addColorStop(0.5, theme.bgGrad[1]);
      grad.addColorStop(1, theme.bgGrad[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Halo coloré haut-gauche
      const radial = ctx.createRadialGradient(200, 140, 20, 200, 140, 520);
      radial.addColorStop(0, rgba(theme.aura, 0.35));
      radial.addColorStop(1, rgba(theme.aura, 0));
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);
    }

    // Groupe de droite — bien visibles derrière le rang
    ctx.save();
    ctx.globalAlpha = 0.35;
    drawDragonBall(ctx, width - 110, 85, 38, 4);
    drawDragonBall(ctx, width - 55, 155, 26, 5);
    drawDragonBall(ctx, width - 170, 115, 22, 1);
    // Groupe bas-gauche plus discret
    ctx.globalAlpha = 0.18;
    drawDragonBall(ctx, 35, height - 40, 20, 7);
    drawDragonBall(ctx, 85, height - 55, 14, 2);
    ctx.restore();

    // Bande lumineuse en haut
    const topGlow = ctx.createLinearGradient(0, 0, 0, 90);
    topGlow.addColorStop(0, rgba(userColor, 0.22));
    topGlow.addColorStop(1, rgba(userColor, 0));
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, width, 90);

    // Ombre basse pour la profondeur
    const bottomShade = ctx.createLinearGradient(0, height - 80, 0, height);
    bottomShade.addColorStop(0, "rgba(0,0,0,0)");
    bottomShade.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = bottomShade;
    ctx.fillRect(0, height - 80, width, 80);

    const avatar = await this.loadAvatar(input.discordUser);
    const AV_CX = 130;
    const AV_CY = height / 2;
    const AV_R = 85;

    // Aura avatar : trois couches en blend "screen" = effet lumière additive
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (let i = 3; i > 0; i--) {
      const auraR = AV_R + i * 18;
      const auraGrad = ctx.createRadialGradient(AV_CX, AV_CY, AV_R, AV_CX, AV_CY, auraR);
      auraGrad.addColorStop(0, rgba(theme.aura, 0.55));
      auraGrad.addColorStop(0.6, rgba(theme.aura, 0.18));
      auraGrad.addColorStop(1, rgba(theme.aura, 0));
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(AV_CX, AV_CY, auraR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Avatar (découpe ronde)
    ctx.save();
    ctx.beginPath();
    ctx.arc(AV_CX, AV_CY, AV_R, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    if (avatar) {
      ctx.drawImage(avatar, AV_CX - AV_R, AV_CY - AV_R, AV_R * 2, AV_R * 2);
    } else {
      // Avatar introuvable → carré gris
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(AV_CX - AV_R, AV_CY - AV_R, AV_R * 2, AV_R * 2);
    }
    ctx.restore();

    // Ring avatar, couleur équipée
    ctx.lineWidth = 5;
    const ringGrad = ctx.createLinearGradient(
      AV_CX - AV_R,
      AV_CY - AV_R,
      AV_CX + AV_R,
      AV_CY + AV_R,
    );
    ringGrad.addColorStop(0, userColor);
    ringGrad.addColorStop(1, theme.accent);
    ctx.strokeStyle = ringGrad;
    ctx.beginPath();
    ctx.arc(AV_CX, AV_CY, AV_R + 3, 0, Math.PI * 2);
    ctx.stroke();

    // Ring intérieur pour le relief
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(AV_CX, AV_CY, AV_R, 0, Math.PI * 2);
    ctx.stroke();

    const TXT_X = AV_CX + AV_R + 40;
    const name = input.discordUser.displayName || input.discordUser.username;
    const level = levelForXP(input.xp);
    const next = nextThresholdFrom(input.xp);

    // Titre (petit, italique)
    if (input.title) {
      textWithShadow(ctx, input.title, TXT_X, 72, {
        color: "#cbd5e1",
        font: "italic 18px 'Inter SemiBold', Inter, sans-serif",
        shadow: theme.textShadow,
        blur: 4,
      });
    }

    // Pseudo en Saiyan Sans (style logo DBZ)
    const displayName = name.toUpperCase();
    textStroked(ctx, displayName, TXT_X, 120, {
      color: userColor,
      stroke: "rgba(0,0,0,0.8)",
      strokeWidth: 7,
      font: "48px 'Saiyan Sans', 'Inter Display Black', sans-serif",
    });

    // Badge : pastille ronde à côté du pseudo
    if (input.badge) {
      ctx.save();
      ctx.font = "48px 'Saiyan Sans', 'Inter Display Black', sans-serif";
      const nameWidth = ctx.measureText(displayName).width;
      const BADGE_CX = TXT_X + nameWidth + 40;
      const BADGE_CY = 108;
      const BADGE_R = 26;
      // Chip background
      const chipGrad = ctx.createLinearGradient(0, BADGE_CY - BADGE_R, 0, BADGE_CY + BADGE_R);
      chipGrad.addColorStop(0, rgba(theme.accent, 0.9));
      chipGrad.addColorStop(1, rgba(theme.aura, 0.9));
      ctx.fillStyle = chipGrad;
      ctx.beginPath();
      ctx.arc(BADGE_CX, BADGE_CY, BADGE_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Contenu du badge : emoji couleur (Noto) ou texte court
      ctx.font = "30px 'Noto Color Emoji', 'Inter Bold', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1f2937";
      ctx.fillText(input.badge.slice(0, 2), BADGE_CX, BADGE_CY + 2);
      ctx.restore();
    }

    // Ligne de stats (Niveau, Zéni, Fusion)
    const STATS_Y = 165;
    // Chip Niveau
    const levelLabel = `NIVEAU ${level}`;
    const levelW = 140;
    const levelH = 38;
    ctx.save();
    roundRectPath(ctx, TXT_X, STATS_Y - levelH + 6, levelW, levelH, 10);
    ctx.fillStyle = rgba(theme.accent, 0.25);
    ctx.fill();
    ctx.strokeStyle = rgba(theme.accent, 0.6);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
    textWithShadow(ctx, levelLabel, TXT_X + levelW / 2, STATS_Y, {
      color: theme.accent,
      font: "28px 'Teko Bold', Impact, sans-serif",
      align: "center",
      shadow: theme.textShadow,
      blur: 3,
    });

    // Chip Zéni
    const zeniX = TXT_X + levelW + 14;
    const zeniLabel = `${formatXP(input.zeni)} Z`;
    ctx.save();
    ctx.font = "28px 'Teko Bold', Impact, sans-serif";
    const zeniW = Math.max(130, ctx.measureText(zeniLabel).width + 30);
    roundRectPath(ctx, zeniX, STATS_Y - levelH + 6, zeniW, levelH, 10);
    ctx.fillStyle = "rgba(251, 191, 36, 0.2)";
    ctx.fill();
    ctx.strokeStyle = "rgba(251, 191, 36, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
    textWithShadow(ctx, zeniLabel, zeniX + zeniW / 2, STATS_Y, {
      color: "#fde047",
      font: "28px 'Teko Bold', Impact, sans-serif",
      align: "center",
      shadow: "rgba(0,0,0,0.7)",
      blur: 3,
    });

    // Rang (aligné à droite)
    if (input.rank) {
      textWithShadow(ctx, `#${input.rank}`, width - PAD - 30, 90, {
        color: "#f1f5f9",
        font: "48px 'Teko Bold', Impact, sans-serif",
        align: "right",
        shadow: "rgba(0,0,0,0.7)",
        blur: 4,
      });
      ctx.save();
      ctx.letterSpacing = "3px";
      textWithShadow(ctx, "RANG", width - PAD - 30, 115, {
        color: "#94a3b8",
        font: "14px 'Inter SemiBold', sans-serif",
        align: "right",
      });
      ctx.restore();
    }

    // Chip Fusion, à la suite du zéni
    if (input.fused) {
      const fusedX = zeniX + zeniW + 14;
      const fusedW = 150;
      ctx.save();
      roundRectPath(ctx, fusedX, STATS_Y - levelH + 6, fusedW, levelH, 10);
      ctx.fillStyle = "rgba(236, 72, 153, 0.22)";
      ctx.fill();
      ctx.strokeStyle = "rgba(236, 72, 153, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      textWithShadow(ctx, "💞 FUSIONNÉ", fusedX + fusedW / 2, STATS_Y, {
        color: "#f9a8d4",
        font: "22px 'Teko Bold', Impact, sans-serif",
        align: "center",
        shadow: "rgba(80,7,36,0.8)",
        blur: 3,
      });
    }

    const BAR_X = TXT_X;
    const BAR_Y = 238;
    const BAR_W = width - TXT_X - PAD - 20;
    const BAR_H = 28;

    const thresholdMin =
      level === 0 ? 0 : (LEVEL_THRESHOLDS.find((t) => t.level === level)?.xp ?? 0);
    const thresholdMax = next?.xp ?? input.xp;
    const progress =
      thresholdMax > thresholdMin
        ? Math.max(0, Math.min(1, (input.xp - thresholdMin) / (thresholdMax - thresholdMin)))
        : 1;

    // Fond sombre de la barre
    ctx.save();
    roundRectPath(ctx, BAR_X, BAR_Y, BAR_W, BAR_H, BAR_H / 2);
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fill();
    // Ombre interne
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Remplissage
    if (progress > 0) {
      ctx.save();
      roundRectPath(ctx, BAR_X, BAR_Y, BAR_W * progress, BAR_H, BAR_H / 2);
      ctx.clip();
      const fillGrad = ctx.createLinearGradient(BAR_X, BAR_Y, BAR_X + BAR_W * progress, BAR_Y);
      fillGrad.addColorStop(0, theme.aura);
      fillGrad.addColorStop(0.5, theme.accent);
      fillGrad.addColorStop(1, userColor);
      ctx.fillStyle = fillGrad;
      ctx.fillRect(BAR_X, BAR_Y, BAR_W * progress, BAR_H);

      // Reflet du haut
      const hi = ctx.createLinearGradient(0, BAR_Y, 0, BAR_Y + BAR_H / 2);
      hi.addColorStop(0, "rgba(255,255,255,0.35)");
      hi.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = hi;
      ctx.fillRect(BAR_X, BAR_Y, BAR_W * progress, BAR_H / 2);

      // Étincelle d'énergie au bout
      const endX = BAR_X + BAR_W * progress;
      const sparkle = ctx.createRadialGradient(
        endX,
        BAR_Y + BAR_H / 2,
        0,
        endX,
        BAR_Y + BAR_H / 2,
        20,
      );
      sparkle.addColorStop(0, "rgba(255,255,255,0.9)");
      sparkle.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sparkle;
      ctx.fillRect(endX - 20, BAR_Y - 5, 40, BAR_H + 10);
      ctx.restore();
    }

    // Bordure
    ctx.save();
    roundRectPath(ctx, BAR_X, BAR_Y, BAR_W, BAR_H, BAR_H / 2);
    ctx.strokeStyle = rgba(userColor, 0.6);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Label XP au-dessus de la barre
    const xpCurrent = formatXP(input.xp);
    const xpMax = next ? formatXP(next.xp) : "MAX";
    ctx.save();
    ctx.letterSpacing = "2px";
    textWithShadow(ctx, "UNITÉS", BAR_X, BAR_Y - 12, {
      color: "#94a3b8",
      font: "12px 'Inter Bold', sans-serif",
    });
    ctx.restore();
    textWithShadow(ctx, `${xpCurrent} / ${xpMax}`, BAR_X + BAR_W, BAR_Y - 10, {
      color: "#f1f5f9",
      font: "18px 'Teko Bold', Impact, sans-serif",
      align: "right",
      shadow: theme.textShadow,
      blur: 3,
    });

    // % dans la barre
    if (progress > 0.15) {
      const pctText = `${Math.round(progress * 100)}%`;
      textStroked(ctx, pctText, BAR_X + (BAR_W * progress) / 2, BAR_Y + BAR_H / 2 + 5, {
        color: "#ffffff",
        stroke: "rgba(0,0,0,0.5)",
        strokeWidth: 3,
        font: "bold 14px 'Inter Bold', sans-serif",
        align: "center",
      });
    }

    const FOOTER_Y = 310;
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(BAR_X, FOOTER_Y, BAR_W, 1);
    ctx.restore();

    const footerItems: Array<{ label: string; value: string }> = [
      { label: "MESSAGES", value: formatXP(input.messageCount) },
      { label: "CARTE", value: theme.name.toUpperCase() },
    ];
    let footerX = BAR_X;
    for (const item of footerItems) {
      ctx.save();
      // Tracking typographique pour les labels uppercase (style petite capitale)
      ctx.letterSpacing = "1.5px";
      textWithShadow(ctx, item.label, footerX, FOOTER_Y + 18, {
        color: "#64748b",
        font: "11px 'Inter Bold', sans-serif",
      });
      ctx.restore();
      textWithShadow(ctx, item.value, footerX, FOOTER_Y + 36, {
        color: "#e2e8f0",
        font: "18px 'Teko SemiBold', Impact, sans-serif",
      });
      ctx.save();
      ctx.font = "18px 'Teko SemiBold', sans-serif";
      footerX += Math.max(120, ctx.measureText(item.value).width + 36);
      ctx.restore();
    }

    const kiLabel = kiScouterLabel(input.xp).toUpperCase();
    const SCOUTER_R_X = width - PAD - 14;
    const SCOUTER_Y = FOOTER_Y + 14;
    const SCOUTER_H = 32;

    ctx.save();
    // Mesure texte scouter
    ctx.font = `26px 'DBS Scouter', monospace`;
    const scouterTextW = ctx.measureText(kiLabel).width;
    ctx.font = "10px 'Inter Bold', sans-serif";
    const kiLabelW = ctx.measureText("KI LEVEL").width;
    const chipW = Math.max(scouterTextW, kiLabelW) + 26;
    const chipX = SCOUTER_R_X - chipW;
    // Chip bg — écran scouter (vert/ambre selon intensité)
    const kiIntensity = Math.min(1, input.xp / 1_000_000);
    const chipBg = kiIntensity > 0.5 ? "#22c55e" : "#f59e0b"; // vert > 500k, sinon ambre
    roundRectPath(ctx, chipX, SCOUTER_Y, chipW, SCOUTER_H + 18, 6);
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fill();
    ctx.strokeStyle = rgba(chipBg, 0.7);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Label "KI LEVEL" avec tracking pour le côté scouter
    ctx.fillStyle = rgba(chipBg, 0.9);
    ctx.font = "9px 'Inter Bold', sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "2.5px";
    ctx.fillText("KI LEVEL", chipX + chipW / 2, SCOUTER_Y + 11);
    ctx.letterSpacing = "0px";

    // Valeur en font Scouter avec glow
    ctx.shadowColor = chipBg;
    ctx.shadowBlur = 8;
    ctx.fillStyle = chipBg;
    ctx.font = "26px 'DBS Scouter', monospace";
    ctx.fillText(kiLabel, chipX + chipW / 2, SCOUTER_Y + 36);
    ctx.restore();

    textWithShadow(ctx, `#${input.discordUser.id.slice(-6)}`, width - PAD - 30, 135, {
      color: "rgba(148,163,184,0.3)",
      font: "10px 'Inter Medium', sans-serif",
      align: "right",
    });

    ctx.restore(); // undo clip
    ctx.save();
    roundRectPath(ctx, 0, 0, width, height, CARD_R);
    ctx.strokeStyle = rgba(userColor, 0.4);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Encodage WebP async (thread pool libuv, non-bloquant, ~40% plus petit qu'un PNG)
    return await canvas.encode("webp", 92);
  }
}
