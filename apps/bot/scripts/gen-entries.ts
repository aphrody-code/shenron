import { Glob } from "bun";

const header = `// Auto-generated barrel — statique pour compat \`bun build --compile\` et SWC tree-shake.
// Regénérer avec: bun scripts/gen-entries.ts

`;

const patterns = ["src/commands/**/*.ts", "src/events/**/*.ts"];
const excludes = new Set(["src/_entries.ts"]);

const files: string[] = [];
for (const pattern of patterns) {
  const glob = new Glob(pattern);
  for await (const file of glob.scan(".")) {
    if (!excludes.has(file)) files.push(file);
  }
}
files.sort();

const body = files
  .map((f) => `import "${"./" + f.replace(/^src\//, "").replace(/\.ts$/, "")}";`)
  .join("\n");

await Bun.write("src/_entries.ts", header + body + "\n");
console.log(`✓ _entries.ts — ${files.length} modules`);
