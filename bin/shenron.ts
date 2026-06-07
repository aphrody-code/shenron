#!/usr/bin/env bun
/**
 * 🐉 SHENRON CLI — Outil d'administration et de gestion du monorepo.
 *
 * Développé en TypeScript pur natif Bun pour une vitesse d'exécution maximale.
 * Gère le déploiement, les cron-jobs, les DB (SQLite/Postgres), le RAG, le crawling,
 * la recherche sémantique, la qualité de code, Git, les bots, le site, le LLM local et les médias.
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";

// Palette de couleurs ANSI pour un rendu premium dans le terminal
const c = {
  r: "\x1b[0m",
  b: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

const ROOT = "/home/ubuntu/shenron";

// Nettoyer les codes ANSI pour calculer la longueur réelle du texte
function cleanAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

// Formater et aligner le texte avec des espaces en tenant compte des codes de couleur
function padText(text: string, length: number): string {
  const visibleLen = cleanAnsi(text).length;
  const paddingNeeded = Math.max(0, length - visibleLen);
  return text + " ".repeat(paddingNeeded);
}

// Récupérer la DATABASE_URL depuis les différents fichiers d'environnement
function getDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // 1. Lire .env.local ou .env du site Next.js
  const siteEnvPath = join(ROOT, "apps/site/.env");
  if (existsSync(siteEnvPath)) {
    try {
      const content = readFileSync(siteEnvPath, "utf-8");
      const match = content.match(/^DATABASE_URL\s*=\s*["']?(.*?)["']?$/m);
      if (match && match[1]) return match[1].trim();
    } catch {}
  }

  // 2. Lire le fichier d'environnement global systemd (.shenron-neon.env)
  const globalEnvPath = "/home/ubuntu/.shenron-neon.env";
  if (existsSync(globalEnvPath)) {
    try {
      const content = readFileSync(globalEnvPath, "utf-8");
      const match = content.match(/^DATABASE_URL\s*=\s*["']?(.*?)["']?$/m);
      if (match && match[1]) return match[1].trim();
    } catch {}
  }

  return undefined;
}

// -----------------------------------------------------------------------------
// 1. DEPLOYMENT COMMANDS
// -----------------------------------------------------------------------------
async function runDeploy(target: string, options: { pull?: boolean; restart?: boolean; build?: boolean }) {
  const { $ } = await import("bun");
  
  if (target === "bot" || target === "all") {
    console.log(`\n🚀 ${c.b}${c.cyan}Déploiement du BOT (VPS)${c.r}...`);
    const deployArgs = [];
    if (options.pull) deployArgs.push("--pull");
    if (options.restart) deployArgs.push("--restart");
    if (options.build) deployArgs.push("--build");
    
    try {
      await $`bash ${ROOT}/scripts/deploy-shenron.sh ${deployArgs}`;
      console.log(`\n✅ ${c.green}Déploiement du BOT réussi !${c.r}`);
    } catch (err) {
      console.error(`\n❌ ${c.red}Échec du déploiement du BOT.${c.r}`);
      if (target === "all") {
        console.log(`⚠️  Déploiement du SITE annulé suite à l'échec du BOT.`);
      }
      process.exit(1);
    }
  }
  
  if (target === "site" || target === "all") {
    console.log(`\n🚀 ${c.b}${c.magenta}Déploiement du SITE (Vercel)${c.r}...`);
    try {
      const hasGlobalVercel = Bun.which("vercel") !== null;
      const vercelCmd = hasGlobalVercel ? "vercel" : join(ROOT, "node_modules/.bin/vercel");
      
      await $`${vercelCmd} deploy --prod --yes`.cwd(ROOT);
      console.log(`\n✅ ${c.green}Déploiement du SITE réussi !${c.r}`);
    } catch (err) {
      console.error(`\n❌ ${c.red}Échec du déploiement du SITE.${c.r}`);
      process.exit(1);
    }
  }
}

// -----------------------------------------------------------------------------
// 2. CRON & TIMERS COMMANDS
// -----------------------------------------------------------------------------
async function runCron(sub: string, timerName?: string) {
  const { $ } = await import("bun");
  
  const timers = [
    "shenron-backup.timer",
    "shenron-guild-sync.timer",
    "shenron-neon-sync.timer",
    "shenron-neon-pull.timer"
  ];
  
  const services = [
    "shenron.service",
    "shenron-embed.service",
    "shenron-llm.service",
    "shenron-rag-refresh.service"
  ];

  if (sub === "list" || sub === "status") {
    console.log(`\n⚙️  ${c.b}STATUT DES SERVICES & TIMERS SYSTEMD${c.r}`);
    
    console.log(`\n${c.b}Services applicatifs :${c.r}`);
    for (const s of services) {
      try {
        const isActive = (await $`systemctl is-active ${s}`.text()).trim();
        const activeColor = isActive === "active" ? c.green : c.red;
        console.log(`  ● ${padText(s, 28)} : ${activeColor}${isActive.toUpperCase()}${c.r}`);
      } catch (e) {
        console.log(`  ● ${padText(s, 28)} : ${c.yellow}INDISPONIBLE / ERREUR${c.r}`);
      }
    }
    
    console.log(`\n${c.b}Timers (Cron) :${c.r}`);
    for (const t of timers) {
      try {
        const isActive = (await $`systemctl is-active ${t}`.text()).trim();
        const activeColor = isActive === "active" ? c.green : c.red;
        
        const statusOutput = await $`systemctl status ${t}`.text();
        const triggerMatch = statusOutput.match(/Trigger:\s*(.*)/);
        const nextRun = triggerMatch ? triggerMatch[1].trim() : "N/A";
        
        console.log(`  ⏰ ${padText(t, 26)} : ${activeColor}${isActive.toUpperCase()}${c.r}`);
        if (nextRun !== "N/A") {
          console.log(`     └─ Prochain run : ${c.dim}${nextRun}${c.r}`);
        }
      } catch (e) {
        console.log(`  ⏰ ${padText(t, 26)} : ${c.yellow}INDISPONIBLE / ERREUR${c.r}`);
      }
    }
  } else if (sub === "trigger") {
    if (!timerName) {
      console.error(`❌ ${c.red}Erreur : Un nom de timer ou de service est requis.${c.r}`);
      console.log(`Timers disponibles : ${timers.map((t: string) => t.replace(".timer", "")).join(", ")}`);
      process.exit(1);
    }
    
    let targetService = timerName;
    if (!targetService.endsWith(".service") && !targetService.endsWith(".timer")) {
      if (timers.includes(`${targetService}.timer`)) {
        targetService = `${targetService}.service`;
      } else if (services.includes(`${targetService}.service`)) {
        targetService = `${targetService}.service`;
      } else {
        const matchT = timers.find((t: string) => t.includes(targetService));
        const matchS = services.find((s: string) => s.includes(targetService));
        if (matchT) {
          targetService = matchT.replace(".timer", ".service");
        } else if (matchS) {
          targetService = matchS;
        } else {
          console.error(`❌ ${c.red}Service ou timer inconnu : ${timerName}${c.r}`);
          process.exit(1);
        }
      }
    } else if (targetService.endsWith(".timer")) {
      targetService = targetService.replace(".timer", ".service");
    }
    
    console.log(`⚡ ${c.b}Déclenchement manuel de ${c.cyan}${targetService}${c.r}...`);
    try {
      await $`sudo systemctl start ${targetService}`;
      console.log(`✅ ${c.green}Service démarré avec succès !${c.r}`);
    } catch (e: any) {
      console.error(`❌ ${c.red}Erreur lors du démarrage du service : ${e.message}${c.r}`);
    }
  }
}

// -----------------------------------------------------------------------------
// 3. DATABASE COMMANDS
// -----------------------------------------------------------------------------
async function runDb(sub: string, extra?: string) {
  const { $ } = await import("bun");
  
  if (sub === "status") {
    console.log(`\n⚙️  ${c.b}STATUT DES BASES DE DONNÉES (SQLite & Neon)${c.r}`);
    
    // SQLite Status
    const dbPath = join(ROOT, "apps/bot/data/bot.db");
    let sqliteOnline = false;
    let sqliteCounts: Record<string, number> = {};
    let sqliteMeta: any = null;
    let sqliteSize = "N/A";
    let sqliteMtime = "N/A";
    
    if (existsSync(dbPath)) {
      sqliteOnline = true;
      try {
        const stats = statSync(dbPath);
        sqliteSize = (stats.size / 1024 / 1024).toFixed(2) + " MB";
        sqliteMtime = stats.mtime.toLocaleString();
        
        const { Database } = await import("bun:sqlite");
        let sqliteVec;
        try {
          sqliteVec = await import("sqlite-vec");
        } catch {
          sqliteVec = await import(join(ROOT, "apps/bot/node_modules/sqlite-vec"));
        }
        
        const db = new Database(dbPath, { readonly: true });
        sqliteVec.load(db);
        
        const tables = ["db_characters", "db_techniques", "db_planets", "db_episodes", "db_sagas", "db_news", "rag_chunks", "vec_chunks"];
        for (const t of tables) {
          try {
            const res = db.query(`SELECT COUNT(*) c FROM ${t}`).get() as any;
            sqliteCounts[t] = res.c;
          } catch {
            sqliteCounts[t] = -1;
          }
        }
        
        try {
          sqliteMeta = db.query("SELECT * FROM rag_meta LIMIT 1").get();
        } catch {}
        
        db.close();
      } catch (e: any) {
        sqliteOnline = false;
        console.error(`⚠️  Erreur lecture SQLite : ${e.message}`);
      }
    }
    
    // Neon Status
    let neonOnline = false;
    let neonCounts: Record<string, number> = {};
    let neonLatency = 0;
    let neonError = "";
    
    const dbUrl = getDatabaseUrl();
    if (dbUrl) {
      try {
        let postgresLib;
        try {
          postgresLib = (await import("postgres")).default;
        } catch {
          postgresLib = (await import(join(ROOT, "apps/site/node_modules/postgres"))).default;
        }
        
        const sql = postgresLib(dbUrl, { max: 1, timeout: 3000 });
        const start = Date.now();
        await sql`SELECT 1`;
        neonLatency = Date.now() - start;
        neonOnline = true;
        
        const botTables = ["db_characters", "db_techniques", "db_planets", "db_episodes", "db_sagas", "db_news"];
        for (const t of botTables) {
          try {
            const res = await sql`SELECT COUNT(*) c FROM ${sql(`bot.${t}`)}`;
            neonCounts[t] = parseInt(res[0].c, 10);
          } catch {
            neonCounts[t] = -1;
          }
        }
        
        const publicTables = ["User", "Post", "Comment", "WikiCategory", "WikiPage", "site_events", "user_preferences"];
        for (const t of publicTables) {
          try {
            const tableName = ["User", "Post", "Comment", "WikiCategory", "WikiPage"].includes(t) ? `"${t}"` : t;
            const res = await sql.unsafe(`SELECT COUNT(*) c FROM public.${tableName}`);
            neonCounts[t] = parseInt(res[0].c, 10);
          } catch {
            neonCounts[t] = -1;
          }
        }
        
        await sql.end();
      } catch (e: any) {
        neonOnline = false;
        neonError = e.message;
      }
    } else {
      neonError = "DATABASE_URL non configurée";
    }
    
    // Print stats
    console.log(`\n${c.b}Connexions :${c.r}`);
    console.log(`  ● SQLite (Replica Bot)  : ${sqliteOnline ? c.green + "ONLINE" : c.red + "OFFLINE"}${c.r}`);
    if (sqliteOnline) {
      console.log(`     ├─ Fichier : ${c.dim}${dbPath}${c.r}`);
      console.log(`     ├─ Taille  : ${c.dim}${sqliteSize}${c.r}`);
      console.log(`     └─ Modifié : ${c.dim}${sqliteMtime}${c.r}`);
    }
    console.log(`  ● Neon (Postgres Site)  : ${neonOnline ? c.green + "ONLINE (" + neonLatency + "ms)" : c.red + "OFFLINE (" + neonError + ")"}${c.r}`);
    
    if (sqliteMeta) {
      console.log(`\n${c.b}RAG Meta (SQLite) :${c.r}`);
      console.log(`  └─ Modèle : ${c.dim}${sqliteMeta.model} (${sqliteMeta.dim}d)${c.r} · Indexé le : ${c.dim}${new Date(sqliteMeta.built_at).toLocaleString()}${c.r}`);
    }
    
    // Table listing
    console.log(`\n${c.b}Comparaison des Volumes de Tables :${c.r}`);
    console.log(`  ${c.b}${padText("Nom de la Table", 25)} | ${padText("SQLite (Replica)", 18)} | ${padText("Neon (Postgres)", 18)} | Statut${c.r}`);
    console.log(`  ${"-".repeat(25)}-+-${"-".repeat(18)}-+-${"-".repeat(18)}-+-${"-".repeat(12)}`);
    
    const allTables = [
      { name: "db_characters", type: "wiki" },
      { name: "db_techniques", type: "wiki" },
      { name: "db_planets", type: "wiki" },
      { name: "db_episodes", type: "wiki" },
      { name: "db_sagas", type: "wiki" },
      { name: "db_news", type: "runtime" },
      { name: "rag_chunks", type: "rag" },
      { name: "vec_chunks", type: "rag" },
      { name: "User", type: "site" },
      { name: "Post", type: "site" },
      { name: "site_events", type: "telemetry" },
      { name: "user_preferences", type: "telemetry" },
    ];
    
    for (const t of allTables) {
      const sqVal = sqliteCounts[t.name] !== undefined ? sqliteCounts[t.name] : -1;
      const pgVal = neonCounts[t.name] !== undefined ? neonCounts[t.name] : -1;
      
      const sqStr = sqVal === -1 ? `${c.dim}N/A${c.r}` : sqVal.toLocaleString();
      const pgStr = pgVal === -1 ? `${c.dim}N/A${c.r}` : pgVal.toLocaleString();
      
      let statusStr = "";
      if (t.type === "wiki" || t.type === "runtime") {
        if (sqVal === -1 || pgVal === -1) {
          statusStr = `${c.yellow}Inconnu${c.r}`;
        } else if (sqVal === pgVal) {
          statusStr = `${c.green}In Sync${c.r}`;
        } else {
          statusStr = `${c.red}Desync${c.r}`;
        }
      } else {
        statusStr = `${c.dim}-${c.r}`;
      }
      
      console.log(`  ${padText(t.name, 25)} | ${padText(sqStr, 18)} | ${padText(pgStr, 18)} | ${statusStr}`);
    }
  } else if (sub === "migrate") {
    const target = extra || "all";
    if (target === "bot" || target === "all") {
      console.log(`\n⚙️  Exécution des migrations SQLite (Bot)...`);
      await $`bun --filter @shenron/bot run db:migrate`.cwd(ROOT);
    }
    if (target === "site" || target === "all") {
      console.log(`\n⚙️  Exécution des migrations Postgres (Site)...`);
      const dbUrl = getDatabaseUrl();
      if (!dbUrl) {
        console.error(`❌ ${c.red}DATABASE_URL requise pour les migrations du site.${c.r}`);
        process.exit(1);
      }
      const env = { ...process.env, DATABASE_URL: dbUrl };
      await $`bun --filter @shenron/site db:push`.cwd(ROOT).env(env);
    }
    console.log(`\n✅ Migrations terminées !`);
  } else if (sub === "sync") {
    const direction = extra;
    const dbUrl = getDatabaseUrl();
    if (!dbUrl) {
      console.error(`❌ ${c.red}DATABASE_URL requise pour synchroniser.${c.r}`);
      process.exit(1);
    }
    
    const env = { ...process.env, DATABASE_URL: dbUrl };
    
    if (direction === "push" || direction === "sqlite-to-neon") {
      console.log(`\n📤 Synchronisation : ${c.b}SQLite ➔ Neon (Postgres)${c.r}...`);
      await $`bun apps/bot/scripts/sync-sqlite-to-neon.ts`.cwd(ROOT).env(env);
      console.log(`\n✅ Sync push terminée !`);
    } else if (direction === "pull" || direction === "neon-to-sqlite") {
      console.log(`\n📥 Synchronisation : ${c.b}Neon (Postgres) ➔ SQLite${c.r}...`);
      await $`bun apps/bot/scripts/sync-neon-to-sqlite.ts`.cwd(ROOT).env(env);
      console.log(`\n✅ Sync pull terminée !`);
    } else {
      console.error(`❌ ${c.red}Direction de sync invalide. Spécifier 'push' ou 'pull'.${c.r}`);
      console.log(`Usage :`);
      console.log(`  shenron db sync push    (Transférer SQLite local vers Neon Postgres)`);
      console.log(`  shenron db sync pull    (Récupérer Neon Postgres vers SQLite local)`);
      process.exit(1);
    }
  }
}

// -----------------------------------------------------------------------------
// 4. RAG COMMANDS
// -----------------------------------------------------------------------------
async function runRag(sub: string) {
  const { $ } = await import("bun");
  
  if (sub === "status") {
    console.log(`\n🔍 ${c.b}STATUT DU SYSTÈME RAG${c.r}`);
    await $`bun apps/bot/scripts/rag-status.ts`.cwd(ROOT);
  } else if (sub === "build") {
    console.log(`\n🏗️  ${c.b}CONSTRUCTION DE L'INDEX RAG${c.r}...`);
    await $`bun --filter @shenron/bot run rag:build`.cwd(ROOT);
    
    console.log(`\n🔄 Redémarrage du bot pour appliquer le nouvel index...`);
    try {
      await $`sudo systemctl restart shenron`;
      console.log(`✅ Bot redémarré.`);
    } catch {
      console.log(`⚠️  Échec du redémarrage de shenron (nécessite les privilèges sudo).`);
    }
  } else if (sub === "refresh") {
    console.log(`\n🔄 ${c.b}RAFRAÎCHISSEMENT DE L'INDEX RAG${c.r}...`);
    try {
      console.log(`Démarrage de shenron-rag-refresh.service...`);
      await $`sudo systemctl restart shenron-rag-refresh.service`;
      console.log(`✅ Service de rafraîchissement RAG démarré.`);
    } catch {
      console.log(`Exécution manuelle en avant-plan...`);
      await $`bun apps/bot/scripts/rag-refresh.ts`.cwd(ROOT);
    }
  } else if (sub === "eval") {
    console.log(`\n🧪 ${c.b}ÉVALUATION DU RAG (Gold Set)${c.r}...`);
    await $`bun --filter @shenron/bot rag:eval`.cwd(ROOT);
  }
}

// -----------------------------------------------------------------------------
// 5. CRAWL & HARVESTING COMMANDS
// -----------------------------------------------------------------------------
async function runCrawl(sub: string, sourceId?: string, extraArgs: string[] = []) {
  const { $ } = await import("bun");
  
  if (sub === "sources") {
    console.log(`\n🌐 ${c.b}SOURCES DE CRAWL / HARVESTING DISPONIBLES${c.r}`);
    await $`bun apps/bot/scripts/rag-harvest.ts --help`.cwd(ROOT);
  } else {
    let cmdArgs = [sub];
    if (sub === "run") {
      cmdArgs = ["crawl-worker"];
      if (sourceId) cmdArgs.push(`--source-id`, sourceId);
    } else if (sub === "seeds") {
      cmdArgs = ["run-seeds"];
    } else {
      if (sourceId) cmdArgs.push(sourceId);
    }
    
    cmdArgs.push(...extraArgs);
    
    console.log(`\n🕷️  ${c.b}Lancement du Crawl :${c.r} ${c.cyan}rag-harvest.ts ${cmdArgs.join(" ")}${c.r}...`);
    await $`bun apps/bot/scripts/rag-harvest.ts ${cmdArgs}`.cwd(ROOT);
  }
}

// -----------------------------------------------------------------------------
// 6. SEARCH & QA COMMANDS
// -----------------------------------------------------------------------------
async function runSearch(query: string, limitVal: number = 5, modeVal?: string) {
  if (!query) {
    console.error(`❌ ${c.red}Erreur : Un terme de recherche est requis.${c.r}`);
    process.exit(1);
  }
  
  console.log(`\n🔍 ${c.b}Recherche Hybride pour :${c.r} "${c.cyan}${query}${c.r}"...`);
  
  const dbPath = join(ROOT, "apps/bot/data/bot.db");
  if (!existsSync(dbPath)) {
    console.error(`❌ ${c.red}Fichier de base de données non trouvé à : ${dbPath}${c.r}`);
    process.exit(1);
  }
  
  try {
    const { Database } = await import("bun:sqlite");
    let sqliteVec;
    try {
      sqliteVec = await import("sqlite-vec");
    } catch {
      sqliteVec = await import(join(ROOT, "apps/bot/node_modules/sqlite-vec"));
    }
    const { hybridSearch } = await import(join(ROOT, "apps/bot/src/lib/rag"));
    
    const db = new Database(dbPath, { readonly: true });
    sqliteVec.load(db);
    
    if (modeVal === "lexical") {
      process.env.RAG_RERANK = "0";
      process.env.EMBED_URL = "http://invalid-url";
    } else if (modeVal === "hybrid") {
      process.env.RAG_RERANK = "0";
    } else if (modeVal === "hybrid+rerank") {
      process.env.RAG_RERANK = "1";
    }
    
    const start = Date.now();
    const { results, mode } = await hybridSearch(db, query, limitVal);
    const elapsed = Date.now() - start;
    
    console.log(`✨ ${c.green}Recherche complétée en ${elapsed}ms (mode: ${mode})${c.r}`);
    console.log(`📂 Chunks trouvés : ${results.length}\n`);
    
    if (results.length === 0) {
      console.log(`  ${c.dim}Aucun résultat trouvé.${c.r}`);
    } else {
      results.forEach((hit: any, idx: number) => {
        console.log(`${c.b}[${idx + 1}] ${hit.title}${c.r} ${c.dim}(Type : ${hit.kind})${c.r}`);
        console.log(`    🔗 Source : ${c.blue}${hit.url}${c.r}`);
        console.log(`    💬 Extrait: ${c.dim}${hit.snippet.replace(/\n/g, " ").trim()}${c.r}`);
        console.log();
      });
    }
    
    db.close();
  } catch (e: any) {
    console.error(`❌ ${c.red}Erreur lors de la recherche : ${e.message}${c.r}`);
    process.exit(1);
  }
}

async function runSearchWithAnswer(query: string, limitVal: number = 5, modeVal?: string, persona: string = "whis") {
  console.log(`\n🔍 ${c.b}Génération d'une réponse pour :${c.r} "${c.cyan}${query}${c.r}" avec la persona ${c.magenta}${persona}${c.r}...`);
  
  const dbPath = join(ROOT, "apps/bot/data/bot.db");
  if (!existsSync(dbPath)) {
    console.error(`❌ ${c.red}Fichier de base de données non trouvé à : ${dbPath}${c.r}`);
    process.exit(1);
  }
  
  try {
    const { Database } = await import("bun:sqlite");
    let sqliteVec;
    try {
      sqliteVec = await import("sqlite-vec");
    } catch {
      sqliteVec = await import(join(ROOT, "apps/bot/node_modules/sqlite-vec"));
    }
    const { hybridSearch } = await import(join(ROOT, "apps/bot/src/lib/rag"));
    const { generateLlmAnswer } = await import(join(ROOT, "apps/bot/src/lib/llm"));
    
    const db = new Database(dbPath, { readonly: true });
    sqliteVec.load(db);
    
    if (modeVal === "lexical") {
      process.env.RAG_RERANK = "0";
      process.env.EMBED_URL = "http://invalid-url";
    } else if (modeVal === "hybrid") {
      process.env.RAG_RERANK = "0";
    } else if (modeVal === "hybrid+rerank") {
      process.env.RAG_RERANK = "1";
    }
    
    console.log(`🤖 Récupération des passages (RAG)...`);
    const { results, mode } = await hybridSearch(db, query, limitVal);
    console.log(`   └─ Mode RAG : ${mode} (${results.length} passages récupérés)`);
    
    console.log(`🧠 Inférence LLM locale (${persona})...`);
    const t0 = Date.now();
    const answer = await generateLlmAnswer(db, query, results, persona);
    const elapsed = Date.now() - t0;
    
    console.log(`\n💬 ${c.b}Réponse générée en ${elapsed}ms :${c.r}`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(answer);
    console.log(`--------------------------------------------------------------------------------`);
    
    db.close();
  } catch (e: any) {
    console.error(`❌ ${c.red}Erreur lors de la génération de la réponse : ${e.message}${c.r}`);
    process.exit(1);
  }
}

// -----------------------------------------------------------------------------
// 7. LINT & QUALITY COMMANDS
// -----------------------------------------------------------------------------
async function runLint(sub: string) {
  const { $ } = await import("bun");
  
  if (sub === "check") {
    console.log(`\n🛡️  ${c.b}Contrôle Qualité du Code (LINT, TYPES & FORMAT)${c.r}...`);
    
    console.log(`\n1. Lancement de oxlint & eslint (turbo)...`);
    await $`bun run lint`.cwd(ROOT);
    
    console.log(`\n2. Vérification des types TypeScript (turbo)...`);
    await $`bun run type-check`.cwd(ROOT);
    
    console.log(`\n3. Vérification du formatage (oxfmt)...`);
    await $`bun run format:check`.cwd(ROOT);
    
    console.log(`\n✅ Tout est conforme aux standards !`);
  } else if (sub === "fix") {
    console.log(`\n🔧 ${c.b}Auto-correction des lints et formats${c.r}...`);
    
    console.log(`\n1. Correction lint (oxlint --fix)...`);
    await $`bun run lint:fix`.cwd(ROOT);
    
    console.log(`\n2. Correction formatage (oxfmt)...`);
    await $`bun run format`.cwd(ROOT);
    
    console.log(`\n✅ Auto-corrections appliquées.`);
  } else if (sub === "typecheck") {
    console.log(`\nTypeScript ${c.b}Type-Checking${c.r}...`);
    await $`bun run type-check`.cwd(ROOT);
  }
}

// -----------------------------------------------------------------------------
// 8. GIT & CONVENTIONAL COMMITS COMMANDS
// -----------------------------------------------------------------------------
function validateCommitMessage(msg: string): { valid: boolean; reason?: string } {
  const line = msg.trim().split("\n")[0];
  const regex = /^(feat|fix|chore|refactor|docs|ops)(?:\(([^)]+)\))?:\s+(.+)$/;
  const match = line.match(regex);
  if (!match) {
    return {
      valid: false,
      reason: "Le format de la première ligne doit être : type(scope): description ou type: description\nTypes autorisés : feat, fix, chore, refactor, docs, ops",
    };
  }
  const [,, , desc] = match;
  if (desc.trim().length === 0) {
    return { valid: false, reason: "La description ne doit pas être vide." };
  }
  
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}]/u;
  if (emojiRegex.test(line)) {
    return { valid: false, reason: "Les commit messages ne doivent pas contenir d'émojis selon CLAUDE.md." };
  }
  
  if (msg.includes("Generated with") || msg.includes("Co-Authored-By")) {
    return { valid: false, reason: "Les commit messages ne doivent pas contenir 'Generated with' ou 'Co-Authored-By' selon CLAUDE.md." };
  }
  
  return { valid: true };
}

async function runGit(sub: string) {
  const { $ } = await import("bun");
  
  if (sub === "status" || sub === "check") {
    console.log(`\n🔎 ${c.b}GIT STATUS & VÉRIFICATION DES CONVENTIONS${c.r}`);
    
    console.log(`\nFichiers modifiés / non commités :`);
    await $`git status -s`.cwd(ROOT);
    
    console.log(`\nVérification du dernier commit message :`);
    const lastCommitMsg = (await $`git log -1 --pretty=%B`.text()).trim();
    console.log(`   Message : "${c.dim}${lastCommitMsg}${c.r}"`);
    
    const check = validateCommitMessage(lastCommitMsg);
    if (check.valid) {
      console.log(`   Statut  : ${c.green}CONFORME AUX CONVENTIONS CLAUDE.md${c.r}`);
    } else {
      console.log(`   Statut  : ${c.red}NON CONFORME${c.r}`);
      console.log(`   Raison  : ${c.yellow}${check.reason}${c.r}`);
    }
  } else if (sub === "commit") {
    console.log(`\n✍️  ${c.b}ASSISTANT DE COMMIT CONVENTIONNEL (CLAUDE.md)${c.r}`);
    
    const staged = (await $`git diff --cached --name-only`.text()).trim();
    if (!staged) {
      console.log(`⚠️  ${c.yellow}Aucun fichier n'est indexé (staged) pour commit.${c.r}`);
      const addAll = prompt("Voulez-vous ajouter tous les fichiers modifiés ? (y/n) [n] :");
      if (addAll?.toLowerCase() === "y" || addAll?.toLowerCase() === "yes") {
        await $`git add .`.cwd(ROOT);
      } else {
        console.log("Opération annulée. Faites d'abord 'git add <fichiers>'.");
        process.exit(0);
      }
    }
    
    const types = ["feat", "fix", "chore", "refactor", "docs", "ops"];
    console.log(`\nTypes de commits :`);
    types.forEach((t: string, i: number) => console.log(`  [${i + 1}] ${t}`));
    
    const typeIdxStr = prompt("Sélectionnez le type (1-6) :");
    const typeIdx = parseInt(typeIdxStr || "", 10) - 1;
    if (isNaN(typeIdx) || typeIdx < 0 || typeIdx >= types.length) {
      console.error(`❌ ${c.red}Type de commit invalide.${c.r}`);
      process.exit(1);
    }
    const type = types[typeIdx];
    
    const scope = prompt("Scope (ex: bot, site, db, infra - Entrée pour aucun) :")?.trim() || undefined;
    
    const description = prompt("Description en français (pas d'émoji) :")?.trim();
    if (!description) {
      console.error(`❌ ${c.red}La description est obligatoire.${c.r}`);
      process.exit(1);
    }
    
    const commitMsg = `${type}${scope ? `(${scope})` : ""}: ${description}`;
    
    const check = validateCommitMessage(commitMsg);
    if (!check.valid) {
      console.error(`❌ ${c.red}Le message généré ne respecte pas les conventions :${c.r}`);
      console.error(`   ${c.yellow}${check.reason}${c.r}`);
      process.exit(1);
    }
    
    console.log(`\nMessage prêt : "${c.b}${c.green}${commitMsg}${c.r}"`);
    const confirm = prompt("Créer le commit ? (y/n) [y] :");
    if (confirm === "" || confirm?.toLowerCase() === "y" || confirm?.toLowerCase() === "yes") {
      await $`git commit -m ${commitMsg}`.cwd(ROOT);
      console.log(`\n✅ ${c.green}Commit créé avec succès !${c.r}`);
    } else {
      console.log("Commit annulé.");
    }
  }
}

// -----------------------------------------------------------------------------
// 9. BOT MANAGEMENT COMMANDS
// -----------------------------------------------------------------------------
async function runBot(sub: string) {
  const { $ } = await import("bun");
  
  if (sub === "doctor") {
    console.log(`\n🏥 ${c.b}Lancement du Diagnostic Bot (Doctor)${c.r}...`);
    await $`bash apps/bot/scripts/doctor.sh`.cwd(ROOT).nothrow();
  } else if (sub === "gen-entries") {
    console.log(`\n🏷️  ${c.b}Génération de _entries.ts pour les commands / events${c.r}...`);
    await $`bun --filter @shenron/bot run gen:entries`.cwd(ROOT);
    console.log(`✅ Fichier _entries.ts régénéré avec succès.`);
  } else if (sub === "seed") {
    console.log(`\n🌱 ${c.b}Seeding des données runtime (rewards, banners, triggers)${c.r}...`);
    await $`bun --filter @shenron/bot run db:seed-all`.cwd(ROOT);
  } else if (sub === "logs") {
    console.log(`\n📋 ${c.b}Affichage et surveillance des logs du bot${c.r}...`);
    await $`bun --filter @shenron/bot run watch-logs`.cwd(ROOT);
  } else {
    console.error(`❌ ${c.red}Sous-commande bot inconnue : ${sub}${c.r}`);
    console.log(`Usage :`);
    console.log(`  shenron bot doctor      (Diagnostic complet du bot et de son environnement)`);
    console.log(`  shenron bot gen-entries (Générer src/_entries.ts pour charger commands/events)`);
    console.log(`  shenron bot seed        (Insérer les configurations & données initiales)`);
    console.log(`  shenron bot logs        (Surveiller les logs en temps réel)`);
  }
}

// -----------------------------------------------------------------------------
// 10. SITE MANAGEMENT COMMANDS
// -----------------------------------------------------------------------------
async function runSite(sub: string) {
  const { $ } = await import("bun");
  
  if (sub === "build") {
    console.log(`\n🏗️  ${c.b}Compilation du Site Next.js (Turbopack)${c.r}...`);
    await $`bun site:build`.cwd(ROOT);
  } else if (sub === "typecheck") {
    console.log(`\n🧪 ${c.b}Vérification des types du Site (tsc)${c.r}...`);
    await $`bun --filter @shenron/site type-check`.cwd(ROOT);
  } else {
    console.error(`❌ ${c.red}Sous-commande site inconnue : ${sub}${c.r}`);
    console.log(`Usage :`);
    console.log(`  shenron site build      (Compiler le projet Next.js de production)`);
    console.log(`  shenron site typecheck  (Lancer le compilateur TS pour typecheck)`);
  }
}

// -----------------------------------------------------------------------------
// 11. LLM MANAGEMENT COMMANDS
// -----------------------------------------------------------------------------
async function runLlmStatus() {
  console.log(`\n🧠 ${c.b}STATUT DES MODÈLES LLM MAISON & DISTILLATION${c.r}`);
  
  const llmDir = join(ROOT, "apps/bot/data/llm");
  const models = [
    { name: "dbz_own_model.pt", desc: "Modèle PyTorch entraîné maison" },
    { name: "dbz_scratch_model.pt", desc: "Modèle scratch d'évaluation" },
    { name: "dbz_tokenizer.json", desc: "Tokenizer BPE entraîné" },
    { name: "dbz-sft.jsonl", desc: "Dataset d'instructions (SFT)" },
    { name: "sft.jsonl", desc: "Dataset SFT secondaire/étendu" },
    { name: "corpus.txt", desc: "Texte brut exporté pour pré-entraînement" }
  ];
  
  console.log(`\n${c.b}Fichiers et Actifs LLM :${c.r}`);
  for (const m of models) {
    const p = join(llmDir, m.name);
    if (existsSync(p)) {
      const stats = statSync(p);
      const sizeStr = (stats.size / 1024 / 1024).toFixed(2) + " MB";
      console.log(`  ● ${padText(m.name, 22)} : ${c.green}${sizeStr.padStart(9)}${c.r} · ${c.dim}${m.desc}${c.r}`);
    } else {
      console.log(`  ● ${padText(m.name, 22)} : ${c.red}${"ABSENT".padStart(9)}${c.r} · ${c.dim}${m.desc}${c.r}`);
    }
  }
  
  const { $ } = await import("bun");
  console.log(`\n${c.b}Services LLM locaux (Ports de communication) :${c.r}`);
  const ports = [
    { port: 5008, desc: "Serveur LLM local (llama.cpp / Qwen3B)" },
    { port: 5009, desc: "Serveur LLM d'évaluation maison (dbz_llm.py)" }
  ];
  
  for (const p of ports) {
    try {
      const res = await fetch(`http://127.0.0.1:${p.port}/health`, { method: "GET", signal: AbortSignal.timeout(1000) });
      const statusColor = res.ok ? c.green : c.yellow;
      console.log(`  ● Port ${p.port} (${p.desc}) : ${statusColor}${res.ok ? "ONLINE" : "ERROR (" + res.status + ")"}${c.r}`);
    } catch (err: any) {
      console.log(`  ● Port ${p.port} (${p.desc}) : ${c.red}OFFLINE (${err.message})${c.r}`);
    }
  }
}

async function runLlm(sub: string, extraArgs: string[] = []) {
  const { $ } = await import("bun");
  
  if (sub === "status") {
    await runLlmStatus();
  } else if (sub === "train") {
    console.log(`\n🏋️  ${c.b}Lancement du Pipeline d'Entraînement LLM (CPU/Local)${c.r}...`);
    await $`bash scripts/train-llm-pipeline.sh --train`.cwd(ROOT);
  } else if (sub === "distill") {
    console.log(`\n⚗️  ${c.b}Distillation de dataset SFT via Gemini (aphrody)${c.r}...`);
    await $`bun apps/bot/scripts/llm/build-sft-dataset.ts ${extraArgs}`.cwd(ROOT);
  } else if (sub === "eval") {
    console.log(`\n🧪 ${c.b}Évaluation des performances du modèle LLM local${c.r}...`);
    await $`bun apps/bot/scripts/llm/eval-own.ts ${extraArgs}`.cwd(ROOT);
  } else {
    console.error(`❌ ${c.red}Sous-commande llm inconnue : ${sub}${c.r}`);
    console.log(`Usage :`);
    console.log(`  shenron llm status      (Afficher les modèles, datasets et ports d'API)`);
    console.log(`  shenron llm train       (Lancer la compilation et l'entraînement du modèle)`);
    console.log(`  shenron llm distill     (Générer des paires d'instruction SFT synthétiques)`);
    console.log(`  shenron llm eval        (Évaluer les métriques d'inférence et grounding)`);
  }
}

// -----------------------------------------------------------------------------
// 12. MEDIA & ASSETS COMMANDS
// -----------------------------------------------------------------------------
async function runMedia(sub: string, extraArgs: string[] = []) {
  const { $ } = await import("bun");
  
  if (sub === "fetch-assets") {
    console.log(`\n📥 ${c.b}Téléchargement des ressources d'images DBZ (Fandom/Kits)${c.r}...`);
    await $`bun apps/bot/scripts/fetch-dbz-assets.ts --download`.cwd(ROOT);
  } else if (sub === "optimize") {
    console.log(`\n🖼️  ${c.b}Optimisation et compression des images d'arrière-plan${c.r}...`);
    await $`bun apps/bot/scripts/optimize-backgrounds.ts`.cwd(ROOT);
  } else if (sub === "scenes") {
    console.log(`\n🎞️  ${c.b}Extraction et génération de frames d'épisodes (Fandom/Video)${c.r}...`);
    await $`bun apps/bot/scripts/build-episode-scenes.ts ${extraArgs}`.cwd(ROOT);
  } else if (sub === "sync-notebook") {
    console.log(`\n📓 ${c.b}Synchronisation des corpus markdown vers NotebookLM (Google)${c.r}...`);
    await $`bun apps/bot/scripts/notebooklm-sync.ts`.cwd(ROOT);
  } else {
    console.error(`❌ ${c.red}Sous-commande media inconnue : ${sub}${c.r}`);
    console.log(`Usage :`);
    console.log(`  shenron media fetch-assets   (Télécharger les illustrations statiques de cartes)`);
    console.log(`  shenron media optimize       (Compresser et traiter les images d'arrière-plan)`);
    console.log(`  shenron media scenes         (Générer des captures notables d'épisodes)`);
    console.log(`  shenron media sync-notebook  (Synchroniser le RAG avec NotebookLM)`);
  }
}

// -----------------------------------------------------------------------------
// HELP & ENTRY POINT
// -----------------------------------------------------------------------------
function printHelp() {
  console.log(`
${c.yellow}                       🐉  ${c.b}SHENRON CLI${c.r}${c.yellow}  🐉${c.r}
${c.dim}        Contrôle et gestion du monorepo Dragon Ball (Bun/TS)${c.r}

${c.b}Usage :${c.r}
  bun shenron <commande> <sous-commande> [options]

${c.b}Commandes principales :${c.r}
  ${c.green}deploy${c.r} [bot|site|all]           Déployer le bot (VPS) ou le site (Vercel)
     ${c.dim}--pull${c.r}                      Git pull avant déploiement du bot
     ${c.dim}--restart${c.r}                   Redémarrer le bot sans compilation CSS
     ${c.dim}--build${c.r}                     Compiler uniquement le CSS (skip restart)

  ${c.green}bot${c.r} [doctor|gen-entries|seed|logs]  Administrer l'application Discord (Bot)
     ${c.dim}doctor${c.r}                      Vérifier le runtime, le token et la santé
     ${c.dim}gen-entries${c.r}                 Générer src/_entries.ts pour auto-load commands
     ${c.dim}seed${c.r}                        Initialiser les triggers et rewards SQLite
     ${c.dim}logs${c.r}                        Inspecter les logs applicatifs du bot

  ${c.green}site${c.r} [build|typecheck]          Gérer le site Next.js de production
     ${c.dim}build${c.r}                       Compiler le site avec Next compiler (Turbopack)
     ${c.dim}typecheck${c.r}                   Lancer le compilateur TypeScript sur le code site

  ${c.green}db${c.r} [status|migrate|sync]       Gérer SQLite & Neon (Postgres)
     ${c.dim}status${c.r}                      Taille, connexion et comparaison des tables
     ${c.dim}migrate [bot|site|all]${c.r}       Exécuter les migrations Drizzle
     ${c.dim}sync [push|pull]${c.r}              Transférer la DB (push SQLite➔Neon, pull Neon➔SQLite)

  ${c.green}rag${c.r} [status|build|refresh|eval]  Gérer l'index RAG et les embeddings
     ${c.dim}status${c.r}                      Diagnostic du RAG, chunks et sidecar embed
     ${c.dim}build${c.r}                       Reconstruire l'index RAG local
     ${c.dim}refresh${c.r}                     Mettre à jour l'index (timers/service)
     ${c.dim}eval${c.r}                        Lancer les évaluations du RAG (gold set)

  ${c.green}llm${c.r} [status|train|distill|eval]  Gérer les modèles IA textuels locaux
     ${c.dim}status${c.r}                      Afficher les fichiers binaires, tokenizers et ports
     ${c.dim}train${c.r}                       Entraîner le tokenizer BPE + modèle local
     ${c.dim}distill${c.r}                     Générer le dataset SFT (build-sft-dataset.ts)
     ${c.dim}eval${c.r}                        Calculer la fidélité de réponse (eval-own.ts)

  ${c.green}media${c.r} [fetch-assets|optimize|scenes|sync-notebook] Gérer les ressources
     ${c.dim}fetch-assets${c.r}               Télécharger les assets du wiki
     ${c.dim}optimize${c.r}                   Optimiser et compresser les backgrounds
     ${c.dim}scenes${c.r}                     Extraire des scènes d'épisodes clés
     ${c.dim}sync-notebook${c.r}               Pousser les articles RAG vers NotebookLM

  ${c.green}crawl${c.r} [sources|run|seeds]       Lancer des récoltes de données avec bxc
     ${c.dim}sources${c.r}                     Lister les sources configurées
     ${c.dim}run <source-id>${c.r}              Démarrer le crawl d'une source spécifique
     ${c.dim}seeds${c.r}                       Lancer la récolte de toutes les seeds

  ${c.green}search${c.r} <query> [options]        Rechercher dans l'index RAG
     ${c.dim}--limit <n>${c.r}                 Nombre de résultats (def: 5)
     ${c.dim}--mode <mode>${c.r}                Mode: lexical, hybrid, hybrid+rerank
     ${c.dim}--answer${c.r}                    Générer une réponse avec le LLM local
     ${c.dim}--persona <nom>${c.r}             Persona du LLM: whis, shenron, beerus...

  ${c.green}lint${c.r} [check|fix|typecheck]     Contrôle qualité du code
     ${c.dim}check${c.r}                       Lancer lint + type-check + format check
     ${c.dim}fix${c.r}                         Appliquer oxlint --fix + oxfmt

  ${c.green}git${c.r} [status|commit]             Gestion Git & conventions
     ${c.dim}status${c.r}                      Statut de travail & contrôle conventions commit
     ${c.dim}commit${c.r}                      Assistant de commit interactif (CLAUDE.md)
`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    printHelp();
    process.exit(0);
  }
  
  const cmd = args[0];
  const sub = args[1];
  
  switch (cmd) {
    case "deploy": {
      const { values, positionals } = parseArgs({
        args: args.slice(1),
        options: {
          pull: { type: "boolean" },
          restart: { type: "boolean" },
          build: { type: "boolean" },
        },
        strict: true,
        allowPositionals: true,
      });
      const target = ["bot", "site", "all"].includes(positionals[0]) ? positionals[0] : "all";
      await runDeploy(target, values);
      break;
    }
      
    case "cron": {
      const cronSub = ["list", "status", "trigger"].includes(sub) ? sub : "list";
      const timerName = args[2];
      await runCron(cronSub, timerName);
      break;
    }
      
    case "db": {
      const dbSub = ["status", "migrate", "sync"].includes(sub) ? sub : "status";
      const dbExtra = args[2];
      await runDb(dbSub, dbExtra);
      break;
    }
      
    case "rag": {
      const ragSub = ["status", "build", "refresh", "eval"].includes(sub) ? sub : "status";
      await runRag(ragSub);
      break;
    }
      
    case "crawl": {
      const crawlSub = ["sources", "run", "recon", "scrape", "mirror", "search", "seeds"].includes(sub) ? sub : "sources";
      const sourceId = args[2];
      const extraArgs = args.slice(3);
      await runCrawl(crawlSub, sourceId, extraArgs);
      break;
    }
      
    case "search": {
      const { values, positionals } = parseArgs({
        args: args.slice(1),
        options: {
          limit: { type: "string" },
          mode: { type: "string" },
          answer: { type: "boolean" },
          persona: { type: "string" },
        },
        strict: true,
        allowPositionals: true,
      });
      const queryStr = positionals.join(" ");
      const limitVal = values.limit ? parseInt(values.limit, 10) : 5;
      const modeVal = values.mode;
      const answerVal = !!values.answer;
      const personaVal = values.persona || "whis";
      
      if (answerVal) {
        await runSearchWithAnswer(queryStr, limitVal, modeVal, personaVal);
      } else {
        await runSearch(queryStr, limitVal, modeVal);
      }
      break;
    }
      
    case "lint": {
      const lintSub = ["check", "fix", "typecheck"].includes(sub) ? sub : "check";
      await runLint(lintSub);
      break;
    }
      
    case "git": {
      const gitSub = ["status", "check", "commit"].includes(sub) ? sub : "status";
      await runGit(gitSub);
      break;
    }
    
    case "bot": {
      const botSub = ["doctor", "gen-entries", "seed", "logs"].includes(sub) ? sub : "doctor";
      await runBot(botSub);
      break;
    }
    
    case "site": {
      const siteSub = ["build", "typecheck"].includes(sub) ? sub : "build";
      await runSite(siteSub);
      break;
    }
    
    case "llm": {
      const llmSub = ["status", "train", "distill", "eval"].includes(sub) ? sub : "status";
      const extraArgs = args.slice(2);
      await runLlm(llmSub, extraArgs);
      break;
    }
    
    case "media": {
      const mediaSub = ["fetch-assets", "optimize", "scenes", "sync-notebook"].includes(sub) ? sub : "fetch-assets";
      const extraArgs = args.slice(2);
      await runMedia(mediaSub, extraArgs);
      break;
    }
      
    default:
      console.error(`❌ ${c.red}Commande principale inconnue : ${cmd}${c.r}`);
      printHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`❌ ${c.red}Erreur fatale :${c.r}`, err);
  process.exit(1);
});
