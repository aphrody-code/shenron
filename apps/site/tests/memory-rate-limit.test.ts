import { describe, expect, test } from "bun:test";
import { createMemoryRateLimiter } from "../src/lib/memory-rate-limit";

describe("createMemoryRateLimiter", () => {
	test("bloque au-delà du quota puis rouvre à la fenêtre suivante", () => {
		let now = 1_000;
		const limiter = createMemoryRateLimiter({ windowMs: 100, limit: 2, clock: () => now });
		expect(limiter.isLimited("membre")).toBe(false);
		expect(limiter.isLimited("membre")).toBe(false);
		expect(limiter.isLimited("membre")).toBe(true);
		now += 100;
		expect(limiter.isLimited("membre")).toBe(false);
	});

	test("compte les lots pondérés", () => {
		const limiter = createMemoryRateLimiter({ windowMs: 1_000, limit: 5 });
		expect(limiter.isLimited("visiteur", 4)).toBe(false);
		expect(limiter.isLimited("visiteur", 2)).toBe(true);
	});

	test("borne le nombre d'identités suivies sans bloquer les nouvelles", () => {
		const limiter = createMemoryRateLimiter({ windowMs: 10_000, limit: 1, maxEntries: 2 });
		expect(limiter.isLimited("a")).toBe(false);
		expect(limiter.isLimited("b")).toBe(false);
		expect(limiter.isLimited("c")).toBe(false);
		expect(limiter.isLimited("c")).toBe(true);
	});
});
