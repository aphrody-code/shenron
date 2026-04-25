import type { Client, Guild, SendableChannels } from "discord.js";
import { env } from "~/lib/env";

export async function resolveAnnounceChannel(
	client: Client,
	guild?: Guild,
): Promise<SendableChannels | null> {
	const id = env.ANNOUNCE_CHANNEL_ID;
	if (!id) return null;
	const cached = (guild ?? client.guilds.cache.first())?.channels.cache.get(id);
	if (cached && "send" in cached) return cached as SendableChannels;
	const fetched = await client.channels.fetch(id).catch(() => null);
	if (fetched && "send" in fetched) return fetched as SendableChannels;
	return null;
}
