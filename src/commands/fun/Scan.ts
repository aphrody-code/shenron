import { injectable, inject } from "tsyringe";
import { Discord, Slash, SlashOption, Guard } from "@rpbey/discordx";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder,
  type CommandInteraction,
  type User,
} from "discord.js";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { GuildOnly } from "~/guards/GuildOnly";
import { LevelService } from "~/services/LevelService";
import { formatXP } from "~/lib/xp";

function kiComment(xp: number): { line: string; accent: string } {
  if (xp >= 10_000_000) return { line: "**IT'S OVER 9'000'000 !** ⚡", accent: "#f59e0b" };
  if (xp >= 100_000) return { line: "Puissance hors normes — Super Saiyan détecté", accent: "#facc15" };
  if (xp >= 9_000) return { line: "**IT'S OVER 9000 !!** 😱", accent: "#dc2626" };
  if (xp >= 5_000) return { line: "Niveau Saiyan d'élite", accent: "#f87171" };
  if (xp >= 1_000) return { line: "Guerrier aguerri", accent: "#fb923c" };
  if (xp >= 500) return { line: "Compétent", accent: "#60a5fa" };
  return { line: "Négligeable (Saibaman tier)", accent: "#94a3b8" };
}

/** Mini-card scouter : lecture de ki unique (500×200px). */
async function renderScouter(user: User, xp: number, accent: string): Promise<Buffer> {
  const W = 500 * 2;
  const H = 200 * 2;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2);

  // Fond noir façon scouter
  const grad = ctx.createLinearGradient(0, 0, 500, 200);
  grad.addColorStop(0, "#000000");
  grad.addColorStop(0.5, "#0a0a0a");
  grad.addColorStop(1, "#1a1a1a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 500, 200);

  // Scanlines horizontales
  ctx.strokeStyle = `${accent}22`;
  ctx.lineWidth = 1;
  for (let y = 0; y < 200; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(500, y);
    ctx.stroke();
  }

  // Bordure + glow
  ctx.shadowColor = accent;
  ctx.shadowBlur = 20;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 492, 192);
  ctx.shadowBlur = 0;

  // Label
  ctx.fillStyle = accent;
  ctx.font = "14px 'Inter Bold', sans-serif";
  ctx.fillText("⟪ SCOUTER ⟫ CIBLE", 20, 28);
  ctx.fillText(`ID: ${user.id.slice(-6)}`, 20, 48);

  // Pseudo de la cible
  ctx.font = "bold 22px 'Saiyan Sans', 'Inter Display Black', sans-serif";
  ctx.fillStyle = "#f1f5f9";
  ctx.fillText(user.username.toUpperCase().slice(0, 20), 20, 80);

  // Ki affiché en font Scouter
  ctx.font = "60px 'DBS Scouter', monospace";
  ctx.shadowColor = accent;
  ctx.shadowBlur = 15;
  ctx.fillStyle = accent;
  const kiText = formatXP(xp);
  const textWidth = ctx.measureText(kiText).width;
  ctx.fillText(kiText, 500 - textWidth - 20, 160);
  ctx.shadowBlur = 0;

  // Sous-label
  ctx.font = "11px 'Inter Bold', sans-serif";
  ctx.fillStyle = `${accent}99`;
  ctx.fillText("POWER LEVEL", 500 - textWidth - 20, 175);

  return canvas.toBuffer("image/png");
}

// Réenregistre les fonts au cas où CardService n'a pas encore tourné
const FONT_DIR = `${import.meta.dir}/../../../assets/fonts/`;
try {
  GlobalFonts.registerFromPath(`${FONT_DIR}Inter-Bold.ttf`, "Inter Bold");
  GlobalFonts.registerFromPath(`${FONT_DIR}SaiyanSans.ttf`, "Saiyan Sans");
  GlobalFonts.registerFromPath(`${FONT_DIR}InterDisplay-Black.ttf`, "Inter Display Black");
  GlobalFonts.registerFromPath(`${FONT_DIR}DBSScouter.ttf`, "DBS Scouter");
} catch {}

@Discord()
@Guard(GuildOnly)
@injectable()
export class ScanCommand {
  constructor(@inject(LevelService) private levels: LevelService) {}

  @Slash({ name: "scan", description: "Scanne le ki d'un membre avec ton scouter" })
  async scan(
    @SlashOption({ name: "membre", description: "Cible du scan", type: ApplicationCommandOptionType.User, required: false })
    target: User | undefined,
    interaction: CommandInteraction,
  ) {
    const user = target ?? interaction.user;
    await interaction.deferReply();
    const data = await this.levels.getUser(user.id);
    const xp = data?.xp ?? 0;
    const { line, accent } = kiComment(xp);

    const buf = await renderScouter(user, xp, accent);
    const file = new AttachmentBuilder(buf, { name: "scouter.png" });

    const embed = new EmbedBuilder()
      .setTitle(`🔍 Scan de ${user.username}`)
      .setDescription(`${line}\n\n**Power Level:** \`${formatXP(xp)}\``)
      .setImage("attachment://scouter.png")
      .setColor(Number.parseInt(accent.slice(1), 16));

    await interaction.editReply({ embeds: [embed], files: [file] });
  }
}
