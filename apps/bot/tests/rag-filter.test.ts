import "reflect-metadata";
import "./setup";
import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { container } from "tsyringe";
import { DatabaseService } from "../src/db/index";
import { hybridSearch, type RagHit } from "../src/lib/rag";

describe("RAG Metadata Filtering", () => {
  let dbs: DatabaseService;
  const originalFetch = global.fetch;

  beforeAll(async () => {
    dbs = container.resolve(DatabaseService);

    // Initialisation des tables FTS5 et vecteurs pour le test
    dbs.sqlite.run("DROP TABLE IF EXISTS rag_chunks");
    dbs.sqlite.run("DROP TABLE IF EXISTS rag_vectors");
    dbs.sqlite.run("DROP TABLE IF EXISTS rag_meta");

    dbs.sqlite.run(
      `CREATE VIRTUAL TABLE rag_chunks USING fts5(kind, title, url, content, lang, source_id, entity, tokenize='unicode61 remove_diacritics 2')`
    );
    dbs.sqlite.run(
      `CREATE TABLE rag_vectors (rowid INTEGER PRIMARY KEY, vec BLOB NOT NULL)`
    );
    dbs.sqlite.run(
      `CREATE TABLE rag_meta (model TEXT, dim INTEGER, count INTEGER, built_at INTEGER)`
    );

    // Insertion de données de test
    const insChunk = dbs.sqlite.query(
      "INSERT INTO rag_chunks (rowid, kind, title, url, content, lang, source_id, entity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    const insVector = dbs.sqlite.query(
      "INSERT INTO rag_vectors (rowid, vec) VALUES (?, ?)"
    );

    // Helper pour générer un blob de vecteur factice (384 dimensions)
    const mockVecBlob = (val: number) => {
      const f32 = new Float32Array(384).fill(val);
      return new Uint8Array(f32.buffer);
    };

    // Chunk 1: Goku en Français (db_characters)
    insChunk.run(1, "character", "Goku", "/wiki/goku", "Goku est un puissant guerrier de la race des Saiyans.", "fr", "db_characters", "Goku");
    insVector.run(1, mockVecBlob(0.9));

    // Chunk 2: Goku en Anglais (db_characters)
    insChunk.run(2, "character", "Goku (EN)", "/wiki/goku-en", "Goku is a powerful Saiyan warrior from Earth.", "en", "db_characters", "Goku");
    insVector.run(2, mockVecBlob(0.8));

    // Chunk 3: Vegeta en Français (db_characters)
    insChunk.run(3, "character", "Vegeta", "/wiki/vegeta", "Vegeta est le prince de tous les Saiyans.", "fr", "db_characters", "Vegeta");
    insVector.run(3, mockVecBlob(0.7));

    // Chunk 4: Kamehameha (techniques)
    insChunk.run(4, "technique", "Kamehameha", "/wiki/kamehameha", "Le Kamehameha is la technique signature de Goku.", "fr", "db_techniques", "Goku");
    insVector.run(4, mockVecBlob(0.6));

    // Insertion des méta
    dbs.sqlite.run(
      "INSERT INTO rag_meta (model, dim, count, built_at) VALUES (?, ?, ?, ?)",
      "mock-model",
      384,
      4,
      Date.now()
    );

    // Mock fetch pour l'API embeddings
    global.fetch = async (url, options) => {
      const urlStr = url.toString();
      if (urlStr.endsWith("/embed")) {
        // Renvoie un vecteur d'interrogation fictif
        return new Response(
          JSON.stringify({
            vectors: [Array(384).fill(0.1)],
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }
      return originalFetch(url, options);
    };
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("devrait retourner tous les résultats pertinents sans aucun filtre", async () => {
    const { results } = await hybridSearch(dbs.sqlite, "Goku Saiyan", 10);
    expect(results.length).toBeGreaterThan(0);
    // Devrait contenir Goku FR et Goku EN
    const titles = results.map((r) => r.title);
    expect(titles).toContain("Goku");
    expect(titles).toContain("Goku (EN)");
  });

  it("devrait filtrer les résultats par langue (fr)", async () => {
    const { results } = await hybridSearch(dbs.sqlite, "Goku Saiyan", 10, { lang: "fr" });
    const titles = results.map((r) => r.title);
    expect(titles).toContain("Goku");
    expect(titles).not.toContain("Goku (EN)");
  });

  it("devrait filtrer les résultats par langue (en)", async () => {
    const { results } = await hybridSearch(dbs.sqlite, "Goku Saiyan", 10, { lang: "en" });
    const titles = results.map((r) => r.title);
    expect(titles).not.toContain("Goku");
    expect(titles).toContain("Goku (EN)");
  });

  it("devrait filtrer les résultats par entité (Goku)", async () => {
    const { results } = await hybridSearch(dbs.sqlite, "Saiyan prince", 10, { entity: "Goku" });
    const titles = results.map((r) => r.title);
    // Devrait exclure Vegeta, même s'il correspond à "prince Saiyan", car l'entité est filtrée sur Goku
    expect(titles).not.toContain("Vegeta");
  });

  it("devrait filtrer les résultats par sourceId (db_techniques)", async () => {
    const { results } = await hybridSearch(dbs.sqlite, "Goku", 10, { sourceId: "db_techniques" });
    const titles = results.map((r) => r.title);
    expect(titles).toContain("Kamehameha");
    expect(titles).not.toContain("Goku");
  });

  it("devrait combiner les filtres d'entité et de langue", async () => {
    const { results } = await hybridSearch(dbs.sqlite, "Goku", 10, { entity: "Goku", lang: "fr" });
    const titles = results.map((r) => r.title);
    expect(titles).toContain("Goku");
    expect(titles).not.toContain("Goku (EN)");
    expect(titles).not.toContain("Vegeta");
  });
});
