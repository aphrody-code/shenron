#!/usr/bin/env bun
/**
 * bxc-crawl-massive.ts — Script complet de crawl massif et d'indexation RAG
 * basé sur les liens du Google Doc.
 *
 * Usage : bun scripts/bxc-crawl-massive.ts
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

// Paths
const ROOT = join(import.meta.dirname, "..");
const DOC_LINKS_PATH = join(ROOT, "data/doc-links.json");
const RAG_RAW_DIR = join(ROOT, "apps/bot/data/rag/raw/google-doc");
const SHARD_PATH = "/tmp/shard-google-doc.json";
const DB_PROD = join(ROOT, "apps/bot/data/bot.db");
const BXC_DIR = process.env.BXC_DIR ?? join(os.homedir(), "bxc");
const BXC_BIN = join(BXC_DIR, "bin/bxc");

// Config
const CONCURRENCY = 6;

// Ensure bxc exists
const onPath = Bun.which("bxc") != null;
const hasBin = existsSync(BXC_BIN);
if (!onPath && !hasBin) {
	console.error("✗ bxc n'est pas installé. Veuillez installer bxc.");
	process.exit(1);
}

async function execBxcScrape(url: string): Promise<string | null> {
	const cmd = [];
	if (onPath) {
		cmd.push("bxc");
	} else {
		cmd.push(BXC_BIN);
	}
	cmd.push("scrape", url, "--markdown", "--profile", "stealth");

	try {
		const proc = Bun.spawn(cmd, {
			stdout: "pipe",
			stderr: "ignore",
		});

		// Timeout de 30 secondes pour éviter le blocage indéfini
		const timeout = setTimeout(() => {
			try {
				proc.kill();
			} catch {}
		}, 30000);

		const stdout = await new Response(proc.stdout).text();
		const code = await proc.exited;
		clearTimeout(timeout);

		if (code === 0 && stdout.length > 50) {
			return stdout;
		}
	} catch {
		// Fail silently
	}
	return null;
}

function getSlug(urlStr: string): string {
	try {
		const url = new URL(urlStr);
		let path = url.pathname.replace(/^\/|\/$/g, "");
		if (url.search) {
			path += "-" + url.search.replace(/[^a-zA-Z0-9]/g, "-");
		}
		if (url.hash) {
			path += "-" + url.hash.replace(/[^a-zA-Z0-9]/g, "-");
		}
		if (!path) return "index";
		return path
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	} catch {
		return "page-" + Math.random().toString(36).substring(2, 8);
	}
}

async function runCmd(cmd: string[], cwd = ROOT): Promise<void> {
	console.log(`[EXEC] ${cmd.join(" ")}`);
	const proc = Bun.spawn(cmd, {
		cwd,
		stdout: "inherit",
		stderr: "inherit",
	});
	const code = await proc.exited;
	if (code !== 0) {
		throw new Error(`Commande échouée (code: ${code}): ${cmd.join(" ")}`);
	}
}

async function main() {
	console.log("=== DÉBUT DU PIPELINE DE CRAWL MASSIF ET D'ENTRAÎNEMENT ===");

	if (!existsSync(DOC_LINKS_PATH)) {
		console.error(`✗ Fichier de liens introuvable : ${DOC_LINKS_PATH}`);
		process.exit(1);
	}

	const data = JSON.parse(readFileSync(DOC_LINKS_PATH, "utf-8"));
	const urls: string[] = data.urls || [];
	console.log(`Nombre total d'URLs à crawler : ${urls.length}`);

	// Filtrer les domaines non textuels
	const filteredUrls = urls.filter((url) => {
		const u = url.toLowerCase();
		return !u.includes("flickr.com") && !u.includes("youtube.com") && !u.includes("vimeo.com");
	});
	console.log(`URLs filtrées (après exclusion Flickr/médias) : ${filteredUrls.length}`);

	mkdirSync(RAG_RAW_DIR, { recursive: true });

	const shardDocs: any[] = [];
	const queue = [...filteredUrls];

	console.log(`\n[1/4] Lancement du crawl en parallèle (concurrence = ${CONCURRENCY})...`);

	async function worker() {
		while (queue.length > 0) {
			const url = queue.shift();
			if (!url) continue;

			const slug = getSlug(url);
			const host = new URL(url).hostname;
			const fileId = `gdoc-${slug}`;
			const mdPath = join(RAG_RAW_DIR, `${slug}.md`);

			console.log(`[*] Scraping [${host}] ${url}...`);
			const markdown = await execBxcScrape(url);
			if (markdown) {
				writeFileSync(mdPath, markdown, "utf-8");
				shardDocs.push({
					id: fileId,
					name: `Source Google Doc: ${slug}`,
					url: url,
					chars: markdown.length,
					markdown: markdown,
				});
				console.log(`  ✓ Réussi (${markdown.length} chars) -> ${slug}.md`);
			} else {
				console.log(`  ✗ Échec / Vide pour ${url}`);
			}
			// Petit délai de politesse
			await new Promise((r) => setTimeout(r, 500));
		}
	}

	// Lancer les workers de concurrence
	const workers = Array.from({ length: CONCURRENCY }, () => worker());
	await Promise.all(workers);

	console.log(`\n[2/4] Écriture du shard de crawl : ${shardDocs.length} documents collectés.`);
	writeFileSync(SHARD_PATH, JSON.stringify({ docs: shardDocs }, null, 2), "utf-8");

	console.log("\n[3/4] Fusion des documents dans corpus.json...");
	await runCmd(["bun", "apps/bot/scripts/merge-corpus-shards.ts", SHARD_PATH]);

	console.log("\n[4/4] Reconstruction de la base RAG SQLite (FTS5 + embeddings denses)...");
	// On copie d'abord la DB de prod dans /tmp pour faire le build RAG via VACUUM INTO propre
	if (existsSync(DB_PROD)) {
		console.log(`[RAG] Copie propre de la base de prod vers /tmp/rag.db via VACUUM INTO...`);
		if (existsSync("/tmp/rag.db")) {
			try {
				const { unlinkSync } = await import("node:fs");
				unlinkSync("/tmp/rag.db");
			} catch {}
		}
		const { Database } = await import("bun:sqlite");
		const db = new Database(DB_PROD);
		db.run("VACUUM INTO '/tmp/rag.db'");
		db.close();
	}
	process.env.RAG_DB = "/tmp/rag.db";
	await runCmd(["bun", "apps/bot/scripts/rag-build.ts"]);

	// Remplacement de la base RAG de production avec backup
	if (existsSync("/tmp/rag.db")) {
		console.log(`[RAG] Remplacement de ${DB_PROD} par la nouvelle base de données reconstruite...`);
		const dbBackup = `${DB_PROD}.bak`;
		if (existsSync(DB_PROD)) {
			copyFileSync(DB_PROD, dbBackup);
		}
		copyFileSync("/tmp/rag.db", DB_PROD);
		console.log("✓ Base RAG mise à jour en production.");
	}

	console.log("\n=== PIPELINE DE CRAWL TERMINÉ AVEC SUCCÈS ===");
}

main().catch((err) => {
	console.error("✗ Erreur fatale dans le pipeline :", err);
	process.exit(1);
});
