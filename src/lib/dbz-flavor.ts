/**
 * Textes DBZ-thémés pour rendre les notifications du bot plus immersives.
 */
import { LEVEL_THRESHOLDS } from "./constants";
import { formatXP } from "./xp";

const DAILY_QUEST_MESSAGES = [
  "🎯 {user} s'est entraîné chez **Kami-sama** : **+{zeni} zéni** (streak {streak})",
  "🥋 {user} a terminé son entraînement avec **Maître Roshi** : **+{zeni} zéni** (streak {streak})",
  "💪 {user} a survécu à un round avec **Végéta** : **+{zeni} zéni** (streak {streak})",
  "⚡ {user} a touché la **Genkidama** : **+{zeni} zéni** (streak {streak})",
  "🐉 {user} a trouvé une **Dragon Ball** : **+{zeni} zéni** (streak {streak})",
  "☁️ {user} a parcouru la **Nuage Magique** : **+{zeni} zéni** (streak {streak})",
  "🔥 {user} a chargé un **Kamehameha** : **+{zeni} zéni** (streak {streak})",
  "🌌 {user} a médité avec **Piccolo** : **+{zeni} zéni** (streak {streak})",
  "🏜️ {user} a battu un **Saibaman** : **+{zeni} zéni** (streak {streak})",
  "🏆 {user} a gagné contre **Mr. Satan** : **+{zeni} zéni** (streak {streak})",
];

export function randomDailyQuestMessage(userId: string, zeni: number, streak: number): string {
  const msg = DAILY_QUEST_MESSAGES[Math.floor(Math.random() * DAILY_QUEST_MESSAGES.length)]!;
  return msg
    .replace("{user}", `<@${userId}>`)
    .replace("{zeni}", String(zeni))
    .replace("{streak}", String(streak));
}

/**
 * Retourne une annonce de palier référencée à un arc DBZ.
 * Les paliers 1-10 correspondent à LEVEL_THRESHOLDS (xp 1k → 9M).
 */
const LEVEL_FLAVOR: Record<number, string> = {
  1: "💨 **Premier souffle** — tu as dépassé un humain normal. Chichi est fière.",
  2: "🥋 **Niveau Krilin** — tu t'entraînes sérieusement.",
  3: "⚔️ **Saga Saiyan** — tu pourrais tenir tête à Nappa.",
  4: "🌍 **Saga Namek** — tu es prêt à affronter les soldats de Freezer.",
  5: "☢️ **Saga Cyborgs** — Dr. Gero t'a à l'œil.",
  6: "💪 **Super Saiyan débloqué** — les cheveux blonds, l'aura dorée.",
  7: "🌟 **Super Saiyan 2** — la foudre crépite autour de toi.",
  8: "🦁 **Super Saiyan 3** — tes cheveux touchent le sol.",
  9: "🌌 **Super Saiyan Blue** — l'union du Super Saiyan et du Kaio-ken.",
  10: "⚡ **IT'S OVER 9 000 000 !** — Ultra Instinct, forme divine.",
};

export function levelUpMessage(userId: string, newLevel: number): string {
  const threshold = LEVEL_THRESHOLDS.find((t) => t.level === newLevel);
  const flavor = LEVEL_FLAVOR[newLevel];
  const header = threshold
    ? `<@${userId}> a atteint les **${formatXP(threshold.xp)} unités** !`
    : `<@${userId}> monte en puissance !`;
  return flavor ? `${header}\n${flavor}` : header;
}
