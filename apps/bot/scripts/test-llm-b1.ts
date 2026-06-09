import { Database } from "bun:sqlite";
import { generateLlmAnswer } from "../src/lib/llm";

const dbPath = new URL("../data/bot.db", import.meta.url).pathname;
const db = new Database(dbPath);

async function run() {
	console.log("=== Test 1: Whis persona (known info) ===");
	const q1 = "Qui a entraîné Son Goku après sa mort ?";
	console.log(`Question: "${q1}"`);
	const a1 = await generateLlmAnswer(db, q1, "whis");
	console.log("Answer Whis:\n", a1);

	console.log("\n=== Test 2: Shenron persona (solennel) ===");
	const q2 = "Qui a vaincu Freezer sur Namek ?";
	console.log(`Question: "${q2}"`);
	const a2 = await generateLlmAnswer(db, q2, "shenron");
	console.log("Answer Shenron:\n", a2);

	console.log("\n=== Test 3: Anti-hallucination (not in context) ===");
	const q3 = "Combien de cheveux bleus Bulma a-t-elle exactement ?";
	console.log(`Question: "${q3}"`);
	const a3 = await generateLlmAnswer(db, q3, "whis");
	console.log("Answer Anti-hallucination:\n", a3);

	db.close();
}

run().catch(console.error);
