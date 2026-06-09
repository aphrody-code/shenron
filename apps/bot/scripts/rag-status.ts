#!/usr/bin/env bun
/**
 * rag-status.ts — Script de diagnostic et statut du RAG et de la base Dragon Ball.
 *
 * Ce script :
 * 1. Vérifie la taille et l'existence des fichiers de base de données.
 * 2. Analyse le contenu de rag_chunks (par type, langue, source).
 * 3. Affiche les métadonnées de la table rag_meta (modèle, dim, date de compilation).
 * 4. Calcule la taille moyenne des chunks.
 * 5. Teste la connectivité avec le serveur d'embeddings sidecar.
 * 6. Compte les lignes des tables structurées principales (personnages, techniques, planètes).
 * 7. Donne l'état du dataset SFT (dbz-sft.jsonl).
 *
 * Usage : bun apps/bot/scripts/rag-status.ts
 */

import { Database } from "bun:sqlite";
import { existsSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import * as sqliteVec from "sqlite-vec";

const ROOT = new URL("../../../", import.meta.url).pathname;
const DB_PROD = join(ROOT, "apps/bot/data/bot.db");
const DB_TMP = "/tmp/rag.db";
const SFT_PATH = join(ROOT, "apps/bot/data/llm/dbz-sft.jsonl");
const SFT_DRYRUN_PATH = join(ROOT, "apps/bot/data/llm/dbz-sft-dryrun.jsonl");
const EMBED_URL = process.env.EMBED_URL ?? "http://127.0.0.1:5007";

function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function printHeader(title: string) {
	console.log(`\n================================================================================`);
	console.log(`⚡ ${title.toUpperCase()}`);
	console.log(`================================================================================`);
}

async function checkSidecar(): Promise<{ status: string; latency?: number; details?: string }> {
	const t0 = Date.now();
	try {
		const res = await fetch(`${EMBED_URL}/health`, {
			method: "GET",
			signal: AbortSignal.timeout(1500),
		});
		if (res.ok) {
			return { status: "ONLINE", latency: Date.now() - t0, details: `HTTP ${res.status}` };
		}
		return { status: "ERROR", details: `HTTP ${res.status}` };
	} catch (err: any) {
		return { status: "OFFLINE", details: err.message };
	}
}

function analyzeDb(dbPath: string, label: string) {
	if (!existsSync(dbPath)) {
		console.log(`❌ Base de données ${label} non trouvée à : ${dbPath}`);
		return;
	}

	const fileStats = statSync(dbPath);
	console.log(`📂 Fichier : ${dbPath}`);
	console.log(`   Taille : ${formatBytes(fileStats.size)}`);
	console.log(`   Modifié le : ${fileStats.mtime.toLocaleString()}`);

	let db: Database;
	try {
		db = new Database(dbPath, { readonly: true });
		sqliteVec.load(db);
	} catch (err: any) {
		console.log(`❌ Impossible d'ouvrir la base de données : ${err.message}`);
		return;
	}

	try {
		// 1. Métadonnées RAG
		let meta: any = null;
		try {
			meta = db.query("SELECT * FROM rag_meta LIMIT 1").get();
		} catch {}

		if (meta) {
			console.log(`\n🏷️  MÉTA-DONNÉES RAG :`);
			console.log(`   Modèle d'embeddings : ${meta.model}`);
			console.log(`   Dimensions          : ${meta.dim}`);
			console.log(`   Nombre de vecteurs  : ${meta.count}`);
			console.log(`   Indexé le           : ${new Date(meta.built_at).toLocaleString()}`);
		} else {
			console.log(`\n⚠️  Aucune méta-donnée RAG (rag_meta vide ou absente).`);
		}

		// 2. Volume de chunks
		const chunkCount = (db.query("SELECT COUNT(*) c FROM rag_chunks").get() as any).c;
		const vecCount = (db.query("SELECT COUNT(*) c FROM vec_chunks").get() as any).c;
		console.log(`\n📊 CHUNKS DANS L'INDEX :`);
		console.log(`   Total chunks (FTS5 text)    : ${chunkCount}`);
		console.log(`   Total vecteurs (sqlite-vec) : ${vecCount}`);

		if (chunkCount > 0) {
			// 3. Répartition par type (kind)
			const kinds = db
				.query("SELECT kind, COUNT(*) c FROM rag_chunks GROUP BY kind ORDER BY c DESC")
				.all() as any[];
			console.log(`\n🧩 Répartition par catégorie (kind) :`);
			for (const k of kinds) {
				console.log(`   - ${k.kind.padEnd(20)}: ${k.c.toString().padStart(6)} chunks`);
			}

			// 4. Répartition par langue (lang)
			const langs = db
				.query("SELECT lang, COUNT(*) c FROM rag_chunks GROUP BY lang ORDER BY c DESC")
				.all() as any[];
			console.log(`\n🌐 Répartition par langue (lang) :`);
			for (const l of langs) {
				console.log(`   - ${l.lang.padEnd(20)}: ${l.c.toString().padStart(6)} chunks`);
			}

			// 5. Répartition par source_id (top 10)
			const sources = db
				.query(
					"SELECT source_id, COUNT(*) c FROM rag_chunks GROUP BY source_id ORDER BY c DESC LIMIT 10"
				)
				.all() as any[];
			console.log(`\n🔌 Top 10 des sources (source_id) :`);
			for (const s of sources) {
				console.log(`   - ${s.source_id.padEnd(25)}: ${s.c.toString().padStart(6)} chunks`);
			}

			// 6. Longueur moyenne des contenus
			const avgLen = (db.query("SELECT AVG(LENGTH(content)) a FROM rag_chunks").get() as any).a;
			console.log(`\n📏 Taille moyenne des chunks : ${Math.round(avgLen)} caractères`);
		}

		// 7. Statistiques des tables structurées principales
		console.log(`\n🗄️  DONNÉES STRUCTURÉES :`);
		const tables = [
			"db_characters",
			"db_planets",
			"db_races",
			"db_techniques",
			"db_transformations",
			"db_sagas",
			"db_movies",
			"db_games",
			"db_episodes",
			"db_manga_volumes",
			"db_manga_chapters",
		];

		for (const tbl of tables) {
			try {
				const count = (db.query(`SELECT COUNT(*) c FROM ${tbl}`).get() as any).c;
				console.log(`   - ${tbl.padEnd(22)}: ${count.toString().padStart(5)} enregistrements`);
			} catch {
				console.log(`   - ${tbl.padEnd(22)}: non disponible`);
			}
		}
	} catch (err: any) {
		console.log(`❌ Erreur d'analyse de la base de données : ${err.message}`);
	} finally {
		db.close();
	}
}

function analyzeSftDataset(path: string, label: string) {
	if (!existsSync(path)) {
		console.log(`❌ Dataset SFT ${label} non trouvé à : ${path}`);
		return;
	}

	const fileStats = statSync(path);
	const content = readFileSync(path, "utf-8");
	const lines = content.split("\n").filter((l) => l.trim().length > 0);

	console.log(`📂 Fichier : ${path}`);
	console.log(`   Taille : ${formatBytes(fileStats.size)}`);
	console.log(`   Nombre d'exemples SFT : ${lines.length}`);

	if (lines.length > 0) {
		try {
			const first = JSON.parse(lines[0]);
			console.log(`   Exemple de structure :`);
			console.log(`     - Persona   : ${first.persona}`);
			console.log(`     - Langue    : ${first.lang}`);
			console.log(`     - Sources   : ${JSON.stringify(first.source_urls)}`);
			console.log(`     - Question  : ${first.instruction.substring(0, 80)}...`);
			console.log(`     - Réponse   : ${first.output.substring(0, 80)}...`);
		} catch (err) {
			console.log(`   ⚠️ Erreur de parsing JSON sur la première ligne : ${err}`);
		}
	}
}

async function main() {
	printHeader("Sidecar d'embeddings");
	const sidecar = await checkSidecar();
	console.log(`🔌 Status   : ${sidecar.status}`);
	if (sidecar.latency !== undefined) {
		console.log(`⏱️  Latence  : ${sidecar.latency} ms`);
	}
	console.log(`💬 Détails  : ${sidecar.details}`);
	console.log(`🔗 URL      : ${EMBED_URL}`);

	printHeader("Base de données active (bot.db)");
	analyzeDb(DB_PROD, "active (production)");

	if (existsSync(DB_TMP)) {
		printHeader("Base de données temporaire de build (/tmp/rag.db)");
		analyzeDb(DB_TMP, "temporaire (build)");
	}

	printHeader("Dataset d'instruction SFT");
	console.log("--- PRODUCTION DATASET ---");
	analyzeSftDataset(SFT_PATH, "Production");
	console.log("\n--- DRYRUN DATASET ---");
	analyzeSftDataset(SFT_DRYRUN_PATH, "Dryrun");

	console.log(`\n================================================================================`);
	console.log(`⭐ Diagnostic terminé le ${new Date().toISOString()}`);
	console.log(`================================================================================\n`);
}

main().catch(console.error);
