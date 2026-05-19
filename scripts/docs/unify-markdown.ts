#!/usr/bin/env bun
/**
 * Project Documentation Unifier
 *
 * Crée une base de connaissance unique à partir de tous les fichiers Markdown du projet.
 * Utile pour le contexte IA, l'onboarding ou l'audit de documentation.
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

  // 1. Lister les fichiers MD via find (plus rapide et respecte les ignores)
  const findCmd = await $`find . -name "*.md"`.text();
  const allFiles = findCmd
    .split("\n")
    .filter(f => f.trim() !== "" && !IGNORE_PATTERNS.some(p => f.includes(p)))
    .sort();

  console.log(`📄 ${allFiles.length} fichiers trouvés.`);

  let content = `# 📚 Base de Connaissance Unifiée — ${new Date().toLocaleDateString("fr-FR")}\n\n`;
  content += `> Ce fichier regroupe toute la documentation du projet pour faciliter le contexte et l'analyse.\n\n`;

  // 2. Générer la table des matières
  content += `## 🗂 Sommaire\n\n`;
  for (const file of allFiles) {
    const relPath = file.startsWith("./") ? file.substring(2) : file;
    const title = await extractTitle(file);
    content += `- [${title}](#${slugify(relPath)})\n`;
  }
  content += `\n---\n\n`;

  // 3. Fusionner les contenus
  for (const file of allFiles) {
    const relPath = file.startsWith("./") ? file.substring(2) : file;
    console.log(`  ▸ Intégration : ${relPath}`);

    const fileContent = await Bun.file(file).text();
    const title = await extractTitle(file);

    content += `<a name="${slugify(relPath)}"></a>\n`;
    content += `## 📄 Fichier : \`${relPath}\`\n\n`;
    content += `**Titre original :** ${title}\n\n`;
    
    // Nettoyage éventuel : transformer les headers relatifs pour ne pas casser la structure du document final
    // (Optionnel : on pourrait incrémenter le niveau des headers # -> ###)
    const processedContent = fileContent.replace(/^# /gm, "### ");
    
    content += processedContent;
    content += `\n\n---\n\n`;
  }

  // 4. Écrire le résultat
  await Bun.write(outputFile, content);

  console.log(`\n✅ Unification terminée !`);
  console.log(`📦 Fichier généré : ${outputFile} (${(content.length / 1024).toFixed(2)} KB)`);
}

/**
 * Extrait le premier header H1 d'un fichier Markdown, 
 * sinon retourne le nom du fichier.
 */
async function extractTitle(filePath: string): Promise<string> {
  const content = await Bun.file(filePath).text();
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();
  return filePath.split("/").pop() || filePath;
}

/**
 * Slugifie un chemin pour les ancres internes.
 */
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

main().catch(console.error);
