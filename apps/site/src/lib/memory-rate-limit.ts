type RateLimitOptions = {
	windowMs: number;
	limit: number;
	maxEntries?: number;
	clock?: () => number;
};

/**
 * Limiteur best-effort local au processus. Il borne aussi sa propre mémoire :
 * les anciennes fenêtres expirées sont purgées et, sous forte cardinalité, la
 * plus vieille clé est évincée au lieu de faire croître la Map sans limite.
 */
export function createMemoryRateLimiter({
	windowMs,
	limit,
	maxEntries = 5_000,
	clock = Date.now,
}: RateLimitOptions) {
	if (windowMs <= 0 || limit <= 0 || maxEntries <= 0) {
		throw new RangeError("Configuration de rate-limit invalide");
	}

	const entries = new Map<string, { count: number; resetAt: number }>();
	let checks = 0;

	function prune(now: number): void {
		for (const [key, entry] of entries) {
			if (entry.resetAt <= now) entries.delete(key);
		}
		while (entries.size >= maxEntries) {
			const oldest = entries.keys().next().value as string | undefined;
			if (!oldest) break;
			entries.delete(oldest);
		}
	}

	return {
		isLimited(key: string, cost = 1): boolean {
			const now = clock();
			const weight = Math.max(1, Math.floor(cost));
			checks += 1;
			if (checks % 256 === 0 || entries.size >= maxEntries) prune(now);

			const current = entries.get(key);
			if (!current || current.resetAt <= now) {
				entries.delete(key);
				if (entries.size >= maxEntries) prune(now);
				entries.set(key, { count: weight, resetAt: now + windowMs });
				return weight > limit;
			}

			current.count += weight;
			return current.count > limit;
		},
	};
}
