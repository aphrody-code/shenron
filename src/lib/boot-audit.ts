import type { Client } from "discord.js";
import { ChannelType } from "discord.js";
import { container } from "tsyringe";
import { DatabaseService } from "~/db/index";
import { levelRewards } from "~/db/schema";
import { env } from "~/lib/env";
import { logger } from "~/lib/logger";
import { TranslateService } from "~/services/TranslateService";

interface ExpectedChannel {
  key: string;
  id: string | undefined;
  expectedType?: ChannelType[];
}

export async function runBootAudit(client: Client) {
  const guild = await client.guilds.fetch(env.GUILD_ID).catch(() => null);
  if (!guild) {
    logger.error({ guildId: env.GUILD_ID }, "boot-audit: GUILD_ID introuvable");
    return;
  }
  await guild.channels.fetch();
  await guild.roles.fetch();
  const me = await guild.members.fetchMe();
  const myHighest = me.roles.highest.position;

  const channelChecks: ExpectedChannel[] = [
    {
      key: "COMMANDS_CHANNEL_ID",
      id: env.COMMANDS_CHANNEL_ID,
      expectedType: [ChannelType.GuildText],
    },
    {
      key: "ANNOUNCE_CHANNEL_ID",
      id: env.ANNOUNCE_CHANNEL_ID,
      expectedType: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
    },
    { key: "LOG_MESSAGE_CHANNEL_ID", id: env.LOG_MESSAGE_CHANNEL_ID },
    { key: "LOG_SANCTION_CHANNEL_ID", id: env.LOG_SANCTION_CHANNEL_ID },
    { key: "LOG_ECONOMY_CHANNEL_ID", id: env.LOG_ECONOMY_CHANNEL_ID },
    { key: "LOG_JOIN_LEAVE_CHANNEL_ID", id: env.LOG_JOIN_LEAVE_CHANNEL_ID },
    { key: "LOG_LEVEL_ROLE_CHANNEL_ID", id: env.LOG_LEVEL_ROLE_CHANNEL_ID },
    { key: "LOG_TICKET_CHANNEL_ID", id: env.LOG_TICKET_CHANNEL_ID },
    { key: "MOD_NOTIFY_CHANNEL_ID", id: env.MOD_NOTIFY_CHANNEL_ID },
    {
      key: "TICKET_CATEGORY_ID",
      id: env.TICKET_CATEGORY_ID,
      expectedType: [ChannelType.GuildCategory],
    },
    {
      key: "VOCAL_TEMPO_HUB_ID",
      id: env.VOCAL_TEMPO_HUB_ID,
      expectedType: [ChannelType.GuildVoice],
    },
  ];

  const problems: string[] = [];

  for (const { key, id, expectedType } of channelChecks) {
    if (!id) continue;
    const ch = guild.channels.cache.get(id);
    if (!ch) {
      problems.push(`${key}=${id} — salon introuvable sur la guild`);
      continue;
    }
    if (expectedType && !expectedType.includes(ch.type)) {
      problems.push(
        `${key}=${id} (${ch.name}) — type ${ChannelType[ch.type]}, attendu ${expectedType.map((t) => ChannelType[t]).join("|")}`,
      );
    }
  }

  const roleChecks: Array<[string, string | undefined]> = [
    ["JAIL_ROLE_ID", env.JAIL_ROLE_ID],
    ["URL_IN_BIO_ROLE_ID", env.URL_IN_BIO_ROLE_ID],
  ];
  for (const [key, id] of roleChecks) {
    if (!id) continue;
    const role = guild.roles.cache.get(id);
    if (!role) {
      problems.push(`${key}=${id} — rôle introuvable`);
      continue;
    }
    if (role.position >= myHighest) {
      problems.push(
        `${key}=${id} (${role.name}) position=${role.position} ≥ bot=${myHighest} — le bot ne pourra pas le gérer`,
      );
    }
  }

  // Level rewards: vérifie que chaque rôle existe et est gérable
  const dbs = container.resolve(DatabaseService);
  const rewards = await dbs.db.select().from(levelRewards);
  for (const r of rewards) {
    const role = guild.roles.cache.get(r.roleId);
    if (!role) {
      problems.push(`level_rewards L${r.level} roleId=${r.roleId} — rôle introuvable`);
    } else if (role.position >= myHighest) {
      problems.push(
        `level_rewards L${r.level} (${role.name}) position=${role.position} ≥ bot=${myHighest} — attribution impossible`,
      );
    }
  }

  // Probe stack /translate — non bloquant
  const translator = container.resolve(TranslateService);
  const tProbe = await translator.probe();
  if (!tProbe.ocr) {
    problems.push(
      "tesseract CLI absent — /translate désactivé. Fix : sudo bash apps/shenron/scripts/setup-translate.sh",
    );
  }
  if (!tProbe.translate) {
    problems.push(
      `LibreTranslate injoignable (${env.LIBRETRANSLATE_URL ?? "http://127.0.0.1:5000"}) — /translate désactivé.`,
    );
  }

  if (problems.length === 0) {
    logger.info(
      {
        guildId: guild.id,
        roles: guild.roles.cache.size,
        channels: guild.channels.cache.size,
      },
      `✓ boot-audit OK — bot role position ${myHighest}`,
    );
    return;
  }

  logger.warn(
    { count: problems.length, botHighest: myHighest },
    "⚠ boot-audit: problèmes détectés",
  );
  for (const p of problems) logger.warn(`  • ${p}`);
}
