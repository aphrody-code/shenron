import type { users } from "@/db/schema";

export type SiteUser = typeof users.$inferSelect;

export type CurrentUser = {
	sessionUserId: string;
	discordId: string;
	user: SiteUser | null;
};

const resolvedUsers = new Map<string, { at: number; value: CurrentUser }>();
const TTL = 60_000;

export function readCachedCurrentUser(sessionUserId: string): CurrentUser | null {
	const cached = resolvedUsers.get(sessionUserId);
	if (!cached) return null;
	if (Date.now() - cached.at >= TTL) {
		resolvedUsers.delete(sessionUserId);
		return null;
	}
	return cached.value;
}

export function cacheCurrentUser(sessionUserId: string, value: CurrentUser): void {
	resolvedUsers.set(sessionUserId, { at: Date.now(), value });
}

export function invalidateCurrentUser(sessionUserId: string): void {
	resolvedUsers.delete(sessionUserId);
}
