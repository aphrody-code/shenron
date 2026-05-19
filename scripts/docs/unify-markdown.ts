#!/usr/bin/env bun
/**
 * Project Documentation Unifier & Meta-Sync
 *
 * Crée une base de connaissance unique et synchronise les métadonnées des agents/skills.
 *
 * Usage:
 *   bun scripts/docs/unify-markdown.ts [output_file]
 */

import { $ } from "bun";
import { join, relative } from "node:path";
import { existsSync } from "node:fs";

const OUTPUT_DEFAULT = "KNOWLEDGE_BASE.md";
const IGNORE_PATTERNS = [
  "node_modules",
  ".next",
  ".turbo",
  ".git",
  "dist",
  "build",
  "venv",
  ".bun-cache"
];

async function main() {
  const outputFile = Bun.argv[2] || OUTPUT_DEFAULT;
  const projectRoot = process.cwd();

  console.log(`🔍 Scan des fichiers Markdown dans ${projectRoot}...`);

  // 1. Lister les fichiers MD via find
  const findCmd = await $`find . -name "*.md"`.text();
  const allFiles = findCmd
    .split("\n")
    .filter(f => f.trim() !== "" && !IGNORE_PATTERNS.some(p => f.includes(p)))
    .sort();

  console.log(`📄 ${allFiles.length} fichiers trouvés.`);

  let content = `# 📚 Base de Connaissance Unifiée — ${new Date().toLocaleDateString("fr-FR")}\n\n`;
  content += `> Ce fichier regroupe toute la documentation du projet pour faciliter le contexte et l'analyse.\n\n`;

  // 2. Section Métadonnées (Skills & Agents)
  content += `## 🤖 Capacités & Agents\n\n`;
  content += await generateAgentMetadata();
  content += `\n---\n\n`;

  // 3. Table des matières
  content += `## 🗂 Sommaire\n\n`;
  for (const file of allFiles) {
    const relPath = file.startsWith("./") ? file.substring(2) : file;
    const title = await extractTitle(file);
    content += `- [${title}](#${slugify(relPath)})\n`;
  }
  content += `\n---\n\n`;

  // 4. Fusionner les contenus
  for (const file of allFiles) {
    const relPath = file.startsWith("./") ? file.substring(2) : file;
    console.log(`  ▸ Intégration : ${relPath}`);

    const fileContent = await Bun.file(file).text();
    const title = await extractTitle(file);

    content += `<a name="${slugify(relPath)}"></a>\n`;
    content += `## 📄 Fichier : \`${relPath}\`\n\n`;
    content += `**Titre original :** ${title}\n\n`;
    
    const processedContent = fileContent.replace(/^# /gm, "### ");
    
    content += processedContent;
    content += `\n\n---\n\n`;
  }

  // 5. Écrire le résultat
  await Bun.write(outputFile, content);

  console.log(`\n✅ Unification terminée !`);
  console.log(`📦 Fichier généré : ${outputFile} (${(content.length / 1024).toFixed(2)} KB)`);
}

async function extractTitle(filePath: string): Promise<string> {
  const content = await Bun.file(filePath).text();
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();
  return filePath.split("/").pop() || filePath;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-./]+/g, "")
    .replace(/\//g, "-")
    .replace(/\./g, "-")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Scanne les dossiers d'agents et de skills pour extraire une vue d'ensemble.
 */
async function generateAgentMetadata(): Promise<string> {
  let meta = "### 🛠 Skills & Compétences\n\n";
  
  const skillDirs = [".gemini/skills", ".agents/skills"];
  for (const dir of skillDirs) {
    if (!existsSync(dir)) continue;
    const skills = await $`ls ${dir}`.text();
    for (const skill of skills.split("\n").filter(Boolean)) {
      const skillPath = join(dir, skill, "SKILL.md");
      if (existsSync(skillPath)) {
        const title = await extractTitle(skillPath);
        meta += `- **${skill}** : ${title} (\`${skillPath}\`)\n`;
      }
    }
  }

  meta += "\n### 🕵️ Agents Spécialisés\n\n";
  const agentDirs = [".claude/agents"];
  for (const dir of agentDirs) {
    if (!existsSync(dir)) continue;
    const agents = await $`ls ${dir}`.text();
    for (const agent of agents.split("\n").filter(Boolean)) {
      const agentPath = join(dir, agent);
      if (agentPath.endsWith(".md")) {
        const title = await extractTitle(agentPath);
        meta += `- **${agent.replace(".md", "")}** : ${title} (\`${agentPath}\`)\n`;
      }
    }
  }

  return meta;
}

main().catch(console.error);
