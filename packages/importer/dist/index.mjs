// src/index.ts
import path from "path";
function isESM() {
  return !!import.meta.url;
}
function dirname(url) {
  if (url.startsWith("file://")) {
    return import.meta.dir;
  }
  return path.dirname(url);
}
async function scan(pattern) {
  const g = new Bun.Glob(pattern);
  const out = [];
  for await (const p of g.scan({ cwd: ".", absolute: true })) out.push(p);
  return out;
}
async function resolve(...paths) {
  const imports = [];
  await Promise.all(
    paths.map(async (ps) => {
      const files = await scan(ps.split(path.sep).join("/"));
      files.forEach((file) => {
        if (!imports.includes(file)) {
          imports.push(`file://${file}`);
        }
      });
    })
  );
  return imports;
}
async function importx(...paths) {
  const files = await resolve(...paths);
  await Promise.all(files.map((file) => import(file)));
}
export {
  dirname,
  importx,
  isESM,
  resolve
};
