/**
 * Contrat de confidentialité de l'espace compte.
 *
 * Ces modules ouvrent PostgreSQL et Better Auth à l'import ; comme les autres
 * tests de garde du dépôt, on vérifie donc leur source sans toucher aux secrets
 * ni exécuter une suppression réelle.
 */
import { describe, expect, test } from "bun:test";

const accountData = await Bun.file(new URL("../src/lib/account-data.ts", import.meta.url)).text();
const auth = await Bun.file(new URL("../src/lib/auth.ts", import.meta.url)).text();
const exportRoute = await Bun.file(
	new URL("../src/app/api/account/export/route.ts", import.meta.url)
).text();

describe("archive personnelle", () => {
	test("refuse un visiteur anonyme avant de lire les données", () => {
		const gate = exportRoute.indexOf("if (!me?.user)");
		const read = exportRoute.indexOf("readAccountData({");
		expect(gate).toBeGreaterThan(-1);
		expect(read).toBeGreaterThan(gate);
		expect(exportRoute).toContain('"Cache-Control": "private, no-store"');
		expect(exportRoute).toContain('"X-Content-Type-Options": "nosniff"');
	});

	test("n'exporte aucun secret d'authentification", () => {
		expect(accountData).not.toMatch(/baAccount|baSession|accessToken|refreshToken|idToken/);
		expect(accountData).toContain("emailVerified: baUser.emailVerified");
		expect(accountData).toContain("activity: events");
		expect(accountData).toContain("community:");
	});
});

describe("suppression du compte", () => {
	test("efface les données personnelles et anonymise l'historique conservé", () => {
		for (const table of [
			"siteEvents",
			"userPreferences",
			"tierlistVotes",
			"siteRatings",
			"editorDrafts",
		]) {
			expect(accountData).toMatch(new RegExp(`tx\\s*\\.delete\\(${table}\\)`));
		}
		for (const table of ["siteReports", "wikiContributions", "wikiRevisions", "users"]) {
			expect(accountData).toMatch(new RegExp(`\\.update\\(${table}\\)`));
		}
		expect(accountData).toContain('username: "Compte supprimé"');
		expect(accountData).toContain("authorDiscordId: null");
		expect(accountData).toContain("userAgent: null");
	});

	test("la purge est branchée après la suppression Better Auth", () => {
		expect(auth).toContain("afterDelete: async (authUser)");
		expect(auth).toContain("await purgeAccountData({");
	});

	test("les mutations de profil sont validées côté serveur", () => {
		expect(auth).toContain('new APIError("BAD_REQUEST"');
		expect(auth).toContain('parsed.protocol !== "https:"');
		expect(auth).toContain("name.length < 2 || name.length > 48");
	});
});
