import "./setup";
import { describe, it, expect } from "bun:test";
import {
  cleanChunk,
  startAtSentence,
  bestSentences,
  isGrounded,
  extractiveAnswer,
  type RagHit,
} from "../src/lib/llm";

const hit = (rowid: number, title: string): RagHit => ({ rowid, kind: "character", title, url: "", snippet: "" });

describe("cleanChunk", () => {
  it("retire URLs, footers Source: et puces", () => {
    expect(cleanChunk("Goku. Source: https://x.fr/wiki/Goku • Race: Saiyan")).toBe("Goku. Race: Saiyan");
  });
  it("normalise les espaces", () => {
    expect(cleanChunk("a    b\n\nc")).toBe("a b c");
  });
});

describe("startAtSentence", () => {
  it("saute un fragment coupé en début de chunk", () => {
    expect(startAtSentence("cessaire pour. Goku est un Saiyan.")).toBe("Goku est un Saiyan.");
  });
  it("garde un texte qui commence déjà par une phrase", () => {
    expect(startAtSentence("Goku est un Saiyan.")).toBe("Goku est un Saiyan.");
  });
});

describe("bestSentences", () => {
  it("choisit la phrase la plus pertinente pour la question", () => {
    const text = "La météo est belle aujourd'hui. Le Kamehameha est une onde de ki concentrée. Bulma a les cheveux bleus.";
    expect(bestSentences(text, "Qu'est-ce que le Kamehameha ?", 1)).toContain("Kamehameha");
  });
  it("retourne une chaîne vide si aucune phrase exploitable", () => {
    expect(bestSentences("ok. non.", "question")).toBe("");
  });
});

describe("isGrounded (anti-hallucination — sources = vérité)", () => {
  it("accepte une réponse dont les mots viennent du contexte", () => {
    expect(isGrounded("Goku est un Saiyan puissant", "Goku est un Saiyan de l'Univers 7, très puissant")).toBe(true);
  });
  it("rejette une hallucination peu ancrée dans le contexte", () => {
    expect(isGrounded("Trunks Gotenks Vegeta fusion transformation", "Goku est un Saiyan élevé sur Terre")).toBe(false);
  });
});

describe("extractiveAnswer (jamais vide, ancré)", () => {
  it("renvoie une réplique persona quand il n'y a aucune source", () => {
    const a = extractiveAnswer("Qui est X ?", [], new Map(), "whis");
    expect(a.length).toBeGreaterThan(0);
  });
  it("renvoie une réponse non vide ancrée sur le contenu du chunk", () => {
    const map = new Map([[1, "Goku est un Saiyan de l'Univers 7. Sa technique est le Kamehameha."]]);
    const a = extractiveAnswer("Qui est Goku ?", [hit(1, "Goku")], map, "whis");
    expect(a).toContain("Saiyan");
    expect(a.length).toBeGreaterThan(20);
  });
  it("préfère la voix du persona demandé", () => {
    const map = new Map([[1, "Vegeta est le prince des Saiyans."]]);
    const a = extractiveAnswer("Qui est Vegeta ?", [hit(1, "Vegeta")], map, "beerus");
    expect(a).toContain("Vegeta");
    expect(a.length).toBeGreaterThan(20);
  });
});
