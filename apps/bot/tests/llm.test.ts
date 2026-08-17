import "./setup";
import { describe, it, expect } from "bun:test";
import { isChitchat, persona, generateLlmAnswer } from "../src/lib/llm";
import { Database } from "bun:sqlite";

describe("isChitchat (bavardage -> pas de RAG, juste de la conversation)", () => {
	it("détecte les salutations / smalltalk", () => {
		for (const q of [
			"bonjour",
			"Salut !",
			"ça va ?",
			"coucou",
			"merci",
			"lol",
			"qui es-tu ?",
			"présente-toi",
		]) {
			expect(isChitchat(q)).toBe(true);
		}
	});
	it("ne classe PAS une vraie question lore comme bavardage", () => {
		for (const q of [
			"qui est le plus fort entre goku et vegeta ?",
			"Parle-moi de la planète Namek",
			"Qu'est-ce que le Kamehameha ?",
		]) {
			expect(isChitchat(q)).toBe(false);
		}
	});
});

describe("persona (normalisation + défaut)", () => {
	it("normalise et reconnaît les personas connus", () => {
		expect(persona("Whis")).toBe("whis");
		expect(persona("grandPretre")).toBe("grandpretre");
		expect(persona("BEERUS")).toBe("beerus");
	});
	it("retombe sur whis pour un persona inconnu ou vide", () => {
		expect(persona("inconnu")).toBe("whis");
		expect(persona("")).toBe("whis");
	});
});

describe("generateLlmAnswer (chemin conversationnel & repli)", () => {
	it("génère une réponse de repli appropriée si le serveur local est injoignable", async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = () => Promise.resolve(new Response("", { status: 500 }));

		// Mock Bun.spawn to prevent hanging on subprocess calls
		const originalSpawn = Bun.spawn;
		Bun.spawn = (args: any, opts: any) => {
			if (args[0] && args[0].includes("aphrody")) {
				return {
					stdout: new Response("").body,
					stderr: new Response("").body,
					exited: Promise.resolve(0),
					kill: () => {},
				} as any;
			}
			return originalSpawn(args, opts);
		};

		const db = new Database(":memory:");
		db.exec("CREATE TABLE IF NOT EXISTS rag_chunks (rowid INTEGER PRIMARY KEY, content TEXT)");

		try {
			const ans = await generateLlmAnswer(db, "Salut !", [], "whis");
			expect(ans).toContain("Oh oh, pardonnez-moi");
		} finally {
			globalThis.fetch = originalFetch;
			Bun.spawn = originalSpawn;
			db.close();
		}
	});

	it("renvoie la réponse du repli Beerus en cas d'erreur de serveur", async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = () => Promise.resolve(new Response("", { status: 500 }));

		const originalSpawn = Bun.spawn;
		Bun.spawn = (args: any, opts: any) => {
			if (args[0] && args[0].includes("aphrody")) {
				return {
					stdout: new Response("").body,
					stderr: new Response("").body,
					exited: Promise.resolve(0),
					kill: () => {},
				} as any;
			}
			return originalSpawn(args, opts);
		};

		const db = new Database(":memory:");
		db.exec("CREATE TABLE IF NOT EXISTS rag_chunks (rowid INTEGER PRIMARY KEY, content TEXT)");

		try {
			const ans = await generateLlmAnswer(db, "Hé !", [], "beerus");
			expect(ans).toContain("Hmpf");
		} finally {
			globalThis.fetch = originalFetch;
			Bun.spawn = originalSpawn;
			db.close();
		}
	});
});
