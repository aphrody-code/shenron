import { LEVEL_THRESHOLDS } from "./constants";

export function levelForXP(xp: number): number {
  let level = 0;
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.xp) level = t.level;
    else break;
  }
  return level;
}

export function xpRequiredForLevel(level: number): number {
  return LEVEL_THRESHOLDS.find((t) => t.level === level)?.xp ?? Infinity;
}

export function nextThresholdFrom(xp: number) {
  return LEVEL_THRESHOLDS.find((t) => t.xp > xp);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatXP(xp: number): string {
  return xp.toLocaleString("fr-FR");
}
