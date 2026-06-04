import "./setup";
import { describe, it, expect } from "bun:test";
import { isChitchat, persona } from "../src/lib/llm";

describe("isChitchat (bavardage -> pas de RAG, juste de la conversation)", () => {
  it("détecte les salutations / smalltalk", () => {
    for (const q of ["bonjour", "Salut !", "ça va ?", "coucou", "merci", "lol", "qui es-tu ?", "présente-toi"]) {
      expect(isChitchat(q)).toBe(true);
    }
  });
  it("ne classe PAS une vraie question lore comme bavardage", () => {
    for (const q of ["qui est le plus fort entre goku et vegeta ?", "Parle-moi de la planète Namek", "Qu'est-ce que le Kamehameha ?"]) {
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
