/**
 * index-discord-full.ts — Indexation COMPLÈTE de TOUT le serveur Discord dans Redis (REST-only).
 *
 * Pagine via l'API REST Discord (pas de gateway -> zéro conflit avec le bot live) l'INTÉGRALITÉ de
 * l'historique de chaque salon + tous les membres. Écrit dans Redis avec la même structure que le
 * worker (dbz:message / dbz:user / dbz:channel + analytics lore + sentiment). Idempotent (hset).
 *
 * Env : DISCORD_TOKEN_GRAND_PRETRE (perms lecture + intent GuildMembers activé). REDIS_URL -> db0.
 * Usage : bun apps/bot/scripts/index-discord-full.ts [--max <N par salon, défaut illimité>]
 */
import { redis } from "bun";
import { env } from "../src/lib/env";

const TOKEN = env.DISCORD_TOKEN_GRAND_PRETRE;
const API = "https://discord.com/api/v10";
const args = process.argv.slice(2);
const maxArg = args.indexOf("--max");
const MAX_PER_CHANNEL = maxArg !== -1 ? Number(args[maxArg + 1]) : Infinity;

const LORE = ["goku", "vegeta", "freezer", "cell", "buu", "gohan", "trunks", "piccolo", "whis", "beerus",
  "bulma", "krillin", "broly", "bardock", "kamehameha", "fusion", "daima", "saiyan", "namek", "shenron"];
const LORE_RE = LORE.map((e) => [e, new RegExp(`\\b${e}\\b`, "i")] as const);
const POS = ["cool", "génial", "super", "aimer", "adore", "bien", "fort", "incroyable", "magnifique", "hype", "stylé"];
const NEG = ["nul", "mauvais", "déteste", "triste", "colère", "faible", "moche", "horrible", "déçu", "naze"];
const POS_RE = POS.map((w) => new RegExp(`\\b${w}`, "i"));
const NEG_RE = NEG.map((w) => new RegExp(`\\b${w}`, "i"));

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET REST avec gestion du rate-limit (429 -> retry-after). */
async function api<T>(path: string): Promise<T | null> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bot ${TOKEN}` } });
    if (res.status === 429) {
      const body = (await res.json().catch(() => ({}))) as { retry_after?: number };
      await sleep(Math.ceil((body.retry_after ?? 1) * 1000) + 250);
      continue;
    }
    if (res.status === 403 || res.status === 404) return null; // pas d'accès à ce salon
    if (!res.ok) {
      await sleep(500);
      continue;
    }
    // marge anti-rate-limit globale
    await sleep(60);
    return (await res.json()) as T;
  }
  return null;
}

let totalMsg = 0;
let totalUsers = 0;

async function indexMessages(msgs: any[]): Promise<void> {
  const p: Promise<unknown>[] = [];
  for (const m of msgs) {
    if (m.author?.bot) continue;
    const content = m.content || "";
    p.push(redis.hset(`dbz:message:${m.id}`, {
      id: m.id, content, authorId: m.author?.id ?? "", channelId: m.channel_id ?? "", createdAt: m.timestamp ?? "",
    }));
    if (m.author?.id) {
      p.push(redis.hset(`dbz:user:${m.author.id}`, {
        id: m.author.id, username: m.author.username ?? "", displayName: m.author.global_name ?? m.author.username ?? "", bot: "false",
      }));
      p.push(redis.sadd("dbz:users", m.author.id));
      p.push(redis.hincrby(`dbz:user:${m.author.id}:stats`, "messages", 1));
    }
    for (const [e, re] of LORE_RE) {
      if (re.test(content)) {
        p.push(redis.hincrby(`dbz:user:${m.author?.id}:lore`, e, 1));
        p.push(redis.hincrby("dbz:global:lore", e, 1));
      }
    }
    let pos = 0, neg = 0;
    for (const re of POS_RE) if (re.test(content)) pos++;
    for (const re of NEG_RE) if (re.test(content)) neg++;
    const bucket = pos > neg ? "positive" : neg > pos ? "negative" : "neutral";
    p.push(redis.hincrby("dbz:global:sentiment", bucket, 1));
  }
  await Promise.all(p);
  totalMsg += msgs.filter((m) => !m.author?.bot).length;
}

async function main(): Promise<void> {
  const guilds = (await api<any[]>("/users/@me/guilds")) ?? [];
  console.log(`[FULL-INDEX] ${guilds.length} guild(s)`);
  for (const g of guilds) {
    const channels = (await api<any[]>(`/guilds/${g.id}/channels`)) ?? [];
    const textCh = channels.filter((c) => c.type === 0 || c.type === 5); // GUILD_TEXT / ANNOUNCEMENT
    console.log(`[FULL-INDEX] guild ${g.name} — ${textCh.length} salons texte`);

    // Membres (pagination after)
    let after = "0";
    for (;;) {
      const members = await api<any[]>(`/guilds/${g.id}/members?limit=1000&after=${after}`);
      if (!members || members.length === 0) break;
      const p: Promise<unknown>[] = [];
      for (const mem of members) {
        const u = mem.user;
        if (!u) continue;
        p.push(redis.hset(`dbz:user:${u.id}`, {
          id: u.id, username: u.username ?? "", displayName: mem.nick ?? u.global_name ?? u.username ?? "", bot: u.bot ? "true" : "false",
        }));
        p.push(redis.sadd("dbz:users", u.id));
      }
      await Promise.all(p);
      totalUsers += members.length;
      after = members[members.length - 1].user.id;
      if (members.length < 1000) break;
    }

    // Messages — pagination complète par salon
    for (const ch of textCh) {
      await Promise.all([
        redis.hset(`dbz:channel:${ch.id}`, { id: ch.id, name: ch.name ?? "", type: String(ch.type), parentId: ch.parent_id ?? "" }),
        redis.sadd("dbz:channels", ch.id),
      ]);
      let before: string | undefined;
      let fetched = 0;
      for (;;) {
        const q = `/channels/${ch.id}/messages?limit=100${before ? `&before=${before}` : ""}`;
        const msgs = await api<any[]>(q);
        if (!msgs || msgs.length === 0) break;
        await indexMessages(msgs);
        fetched += msgs.length;
        before = msgs[msgs.length - 1].id;
        if (msgs.length < 100 || fetched >= MAX_PER_CHANNEL) break;
      }
      if (fetched > 0) console.log(`[FULL-INDEX]   #${ch.name}: ${fetched} msgs (cumul ${totalMsg})`);
    }
  }
  console.log(`[FULL-INDEX] TERMINÉ — ${totalMsg} messages, ${totalUsers} membres vus.`);
  process.exit(0);
}

main().catch((e) => {
  console.error("[FULL-INDEX] erreur :", e);
  process.exit(1);
});
