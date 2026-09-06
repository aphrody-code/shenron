import { describe, expect, test } from "bun:test";
import {
	MOBILE_MENU_DESTINATIONS,
	MOBILE_MORE_DESTINATIONS,
	MOBILE_PRIMARY_DESTINATIONS,
} from "../src/lib/site-menu";

const source = async (relative: string) => Bun.file(new URL(relative, import.meta.url)).text();

describe("accueil et menu complet", () => {
	test("le registre du menu ne contient aucun doublon", () => {
		const hrefs = MOBILE_MENU_DESTINATIONS.map((destination) => destination.href);
		expect(new Set(hrefs).size).toBe(Number(hrefs.length));
		expect(Number(MOBILE_MENU_DESTINATIONS.length)).toBe(
			Number(MOBILE_PRIMARY_DESTINATIONS.length + MOBILE_MORE_DESTINATIONS.length)
		);
	});

	test("chaque destination du menu possède une section sur l'accueil", async () => {
		const [page, catalog, journey, config] = await Promise.all([
			source("../src/app/page.tsx"),
			source("../src/components/stream/MediaCatalogRails.tsx"),
			source("../src/components/home/HomeMenuJourney.tsx"),
			source("../src/lib/home-scenes.ts"),
		]);
		const homepageSources = `${page}\n${catalog}\n${journey}\n${config}`;

		for (const destination of MOBILE_MENU_DESTINATIONS) {
			if (destination.href === "/") {
				expect(page).toContain("<HomeExperience");
				continue;
			}
			expect(homepageSources).toContain(`"${destination.href}"`);
		}
	});

	test("la barre mobile consomme le registre partagé", async () => {
		const navigation = await source("../src/components/BarreNavMobile.tsx");
		expect(navigation).toContain("MOBILE_PRIMARY_DESTINATIONS.map");
		expect(navigation).toContain("MOBILE_MORE_DESTINATIONS");
	});
});
