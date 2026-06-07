/**
 * rag-refresh.ts — Orchestrateur hebdomadaire de rafraîchissement RAG.
 *
 * 1. Crawl incrémental Fandom FR & EN.
 * 2. Fusion dans corpus.json.
 * 3. Reconstruction de l'index dans /tmp/rag.db.
 * 4. Déploiement propre avec sauvegarde de sécurité.
 * 5. Évaluation RAG.
 *
 * Usage : bun apps/bot/scripts/rag-refresh.ts
 */
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../../", import.meta.url).pathname;
const BOT_DIR = join(ROOT, "apps/bot");
const DB_PROD = join(BOT_DIR, "data/bot.db");
const DB_TMP = "/tmp/rag.db";

async function runCmd(cmd: string[], cwd = ROOT): Promise<void> {
	console.log(`[RAG-REFRESH] Exécution: ${cmd.join(" ")}`);
	const proc = Bun.spawn(cmd, {
		cwd,
		stdout: "inherit",
		stderr: "inherit",
	});
	const code = await proc.exited;
	if (code !== 0) {
		throw new Error(`Échec de la commande (exit code: ${code}): ${cmd.join(" ")}`);
	}
}

async function main() {
	console.log("=== DÉBUT DU RAFRAÎCHISSEMENT RAG HEBDOMADAIRE ===");

	// 1. Crawl Fandom FR (limité pour éviter surcharge et timeouts)
	console.log("\n[RAG-REFRESH] 1. Crawl Fandom FR...");
	const shardFr = "/tmp/shard-fr.json";
	await runCmd([
		"bun",
		"apps/bot/scripts/crawl-fandom-rag.ts",
		"--lang",
		"fr",
		"--max",
		"150",
		"--out",
		shardFr,
		"--concurrency",
		"8",
	]);

	// 2. Crawl Fandom EN
	console.log("\n[RAG-REFRESH] 2. Crawl Fandom EN...");
	const shardEn = "/tmp/shard-en.json";
	await runCmd([
		"bun",
		"apps/bot/scripts/crawl-fandom-rag.ts",
		"--lang",
		"en",
		"--max",
		"150",
		"--out",
		shardEn,
		"--concurrency",
		"8",
	]);

	// 3. Fusion des shards dans corpus.json
	console.log("\n[RAG-REFRESH] 3. Fusion des shards dans corpus.json...");
	await runCmd(["bun", "apps/bot/scripts/merge-corpus-shards.ts", shardFr, shardEn]);

	// 4. Reconstruction de l'index dans /tmp/rag.db
	console.log("\n[RAG-REFRESH] 4. Construction de la base de données RAG /tmp/rag.db...");
	await runCmd(["bun", "apps/bot/scripts/rag-build.ts"]);

	// 5. Déploiement avec backup
	if (existsSync(DB_TMP)) {
		console.log("\n[RAG-REFRESH] 5. Remplacement de la base de production...");
		if (existsSync(DB_PROD)) {
			const dbBackup = `${DB_PROD}.bak`;
			console.log(`[RAG-REFRESH] Sauvegarde de sécurité de ${DB_PROD} vers ${dbBackup}...`);
			copyFileSync(DB_PROD, dbBackup);
		}
		console.log(`[RAG-REFRESH] Copie de ${DB_TMP} vers ${DB_PROD}...`);
		copyFileSync(DB_TMP, DB_PROD);
		console.log("✓ Base RAG mise à jour avec succès.");
	} else {
		throw new Error("Erreur: /tmp/rag.db n'existe pas après le build.");
	}

	// 6. Évaluation RAG
	console.log("\n[RAG-REFRESH] 6. Lancement de l'évaluation RAG...");
	await runCmd(["bun", "apps/bot/scripts/rag-eval.ts"]);

	console.log("\n=== RAFRAÎCHISSEMENT RAG TERMINÉ AVEC SUCCÈS ===");
}

main().catch((err) => {
	console.error("\n✗ [RAG-REFRESH] ERREUR FATALE:", err);
	process.exit(1);
});
