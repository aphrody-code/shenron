"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  dirname: () => dirname,
  importx: () => importx,
  isESM: () => isESM,
  resolve: () => resolve
});
module.exports = __toCommonJS(index_exports);
var import_node_path = __toESM(require("path"));
var import_meta = {};
function isESM() {
  return !!import_meta.url;
}
function dirname(url) {
  if (url.startsWith("file://")) {
    return import_meta.dir;
  }
  return import_node_path.default.dirname(url);
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
      const files = await scan(ps.split(import_node_path.default.sep).join("/"));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dirname,
  importx,
  isESM,
  resolve
});
