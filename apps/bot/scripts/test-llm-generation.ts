import { Database } from "bun:sqlite";
import { generateLlmAnswer } from "../src/lib/llm";
import { hybridSearch } from "../src/lib/rag";

const dbPath = new URL("../data/bot.db", import.meta.url).pathname;
const db = new Database(dbPath);

async function test() {
	const query = "Qui a entraîné Son Goku après sa mort ?";
	console.log(`Querying: "${query}"`);

	// 1. hybrid search
	const { results, mode } = await hybridSearch(db, query, 5);
	console.log(`Hybrid search mode: ${mode}`);
	console.log(`Found ${results.length} hits.`);

	// 2. Generate answer
	console.log("\nGenerating answer...");
	const t0 = Date.now();
	const answer = await generateLlmAnswer(db, query, results, "whis");
	const elapsed = Date.now() - t0;

	console.log(`\nResponse (in ${elapsed}ms):`);
	console.log(answer);

	db.close();
}

test().catch(console.error);
