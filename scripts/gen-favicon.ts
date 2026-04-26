#!/usr/bin/env bun
/**
 * Génère le set de favicons depuis l'avatar Discord du bot (ou fallback
 * `assets/logo.webp` si la fetch échoue).
 *
 * Sorties dans `public/` :
 *   favicon-16.png, favicon-32.png, favicon-48.png, favicon-96.png
 *   apple-touch-icon.png   (180×180)
 *   icon-192.png, icon-512.png  (PWA)
 *   manifest.webmanifest
 *
 * Usage :  bun scripts/gen-favicon.ts
 */
import "../src/lib/preload";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { loadImage, createCanvas } from "@aphrody-code/canvas";

const SIZES = [16, 32, 48, 96, 180, 192, 512];

const env = Bun.env;
const TOKEN = env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error("✗ DISCORD_TOKEN manquant — charger via .env");
  process.exit(1);
}

async function fetchBotAvatar(): Promise<Buffer> {
  const res = await fetch("https://discord.com/api/v10/users/@me", {
    headers: { Authorization: `Bot ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Discord API HTTP ${res.status}`);
  const me = (await res.json()) as { id: string; avatar: string | null };
  if (!me.avatar) throw new Error("Bot sans avatar configuré");
  const url = `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=1024`;
  console.log(`→ avatar : ${url}`);
  const imgRes = await fetch(url);
  if (!imgRes.ok) throw new Error(`Avatar HTTP ${imgRes.status}`);
  return Buffer.from(await imgRes.arrayBuffer());
}

async function loadFallback(): Promise<Buffer> {
  const path = "assets/logo.webp";
  if (!existsSync(path)) throw new Error(`Fallback ${path} introuvable`);
  console.log(`→ fallback : ${path}`);
  return (await Bun.file(path).bytes()) as unknown as Buffer;
}

async function resizePng(srcBuf: Buffer, size: number): Promise<Buffer> {
  const img = await loadImage(srcBuf);
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  // Crop carré centré si nécessaire
  const min = Math.min(img.width, img.height);
  const sx = (img.width - min) / 2;
  const sy = (img.height - min) / 2;
  ctx.drawImage(img as any, sx, sy, min, min, 0, 0, size, size);
  return canvas.toBuffer("image/png");
}

async function main() {
  if (!existsSync("public")) await mkdir("public", { recursive: true });

  let src: Buffer;
  try {
    src = await fetchBotAvatar();
  } catch (err) {
    console.warn(`⚠ Avatar Discord KO (${(err as Error).message}), fallback…`);
    src = await loadFallback();
  }

  for (const size of SIZES) {
    const out = await resizePng(src, size);
    const name =
      size === 180
        ? "apple-touch-icon.png"
        : size === 192 || size === 512
          ? `icon-${size}.png`
          : `favicon-${size}.png`;
    await Bun.write(`public/${name}`, out);
    console.log(`✓ public/${name} (${size}×${size}, ${out.byteLength} bytes)`);
  }

  // favicon.ico (32x32) — Bun.write supporte juste PNG, on copie favicon-32
  await Bun.write("public/favicon.ico", await Bun.file("public/favicon-32.png").bytes());
  console.log("✓ public/favicon.ico (alias 32×32)");

  const manifest = {
    name: "Shenron Dashboard",
    short_name: "Shenron",
    description: "Dashboard admin du bot Shenron",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#eab308",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
  await Bun.write("public/manifest.webmanifest", JSON.stringify(manifest, null, 2));
  console.log("✓ public/manifest.webmanifest");

  console.log("\n→ Penser à update dashboard.html et server.ts pour servir /public/*");
}

main().catch((err) => {
  console.error("✗", err);
  process.exit(1);
});
