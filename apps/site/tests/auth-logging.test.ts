/**
 * Journalisation de Better Auth — pas de jeton de session dans les logs.
 *
 * Constat du 2026-08-21 sur la production : `logger: { level: "debug" }` et
 * `debugLogs: true` faisaient écrire à Better Auth, dans le journal systemd, le
 * JETON DE SESSION EN CLAIR de chaque visiteur connecté — 343 jetons, 343
 * e-mails et 686 couples IP/user-agent sur 24 heures. Un jeton de session dans
 * un log se rejoue tel quel en cookie, et `/var/log/journal` est lisible par le
 * groupe `adm`, donc par tout process tournant sous `ubuntu`.
 *
 * Le fichier ne peut pas être importé ici (il ouvre une connexion Postgres et
 * lit des secrets) : on relit sa source.
 */
import { describe, expect, test } from "bun:test";

const src = await Bun.file(new URL("../src/lib/auth.ts", import.meta.url)).text();

describe("journalisation Better Auth", () => {
	test("le niveau de log dépend de l'environnement", () => {
		expect(src).not.toMatch(/logger:\s*\{\s*level:\s*"debug"\s*\}/);
		expect(src).toMatch(/logger:\s*\{\s*level:\s*env\.NODE_ENV/);
	});

	test("les logs de l'adaptateur Drizzle ne sont jamais activés en dur", () => {
		expect(src).not.toMatch(/debugLogs:\s*true/);
		expect(src).toMatch(/debugLogs:\s*env\.NODE_ENV/);
	});
});
