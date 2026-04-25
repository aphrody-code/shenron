import type { Client, Guild, SendableChannels } from "discord.js";
import { env } from "~/lib/env";

async function resolveById(
  client: Client,
  id: string | undefined,
  guild?: Guild,
): Promise<SendableChannels | null> {
  if (!id) return null;
  const cached = (guild ?? client.guilds.cache.first())?.channels.cache.get(id);
  if (cached && "send" in cached) return cached as SendableChannels;
  const fetched = await client.channels.fetch(id).catch(() => null);
  if (fetched && "send" in fetched) return fetched as SendableChannels;
  return null;
}

export async function resolveAnnounceChannel(
  client: Client,
  guild?: Guild,
): Promise<SendableChannels | null> {
  return resolveById(client, env.ANNOUNCE_CHANNEL_ID, guild);
}

/**
 * Salon des messages "🏆 succès débloqué". Retombe sur ANNOUNCE_CHANNEL_ID si
 * ACHIEVEMENT_CHANNEL_ID n'est pas défini, pour ne pas casser l'install actuelle.
 */
export async function resolveAchievementChannel(
  client: Client,
  guild?: Guild,
): Promise<SendableChannels | null> {
  const dedicated = await resolveById(client, env.ACHIEVEMENT_CHANNEL_ID, guild);
  if (dedicated) return dedicated;
  return resolveAnnounceChannel(client, guild);
}
