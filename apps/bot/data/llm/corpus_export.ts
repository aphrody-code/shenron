/**
 * corpus_export.ts — Construit le jeu d'entraînement de NOTRE LLM Dragon Ball maison.
 *
 * Lit la base wiki (copie read-only, jamais la DB live du bot) et produit :
 *   - corpus.txt  : texte brut DBZ (chunks RAG + descriptions wiki) pour le pré-entraînement (modèle de langue).
 *   - sft.jsonl   : paires d'instruction ANCRÉES { context, persona, instruction, output } générées
 *                   depuis les tables structurées. Le modèle apprend à LIRE le contexte injecté et à
 *                   répondre dans la voix du persona — les faits viennent du contexte (grounding RAG),
 *                   pas de sa mémoire. C'est ce qui rend un petit modèle maison réellement utilisable.
 *
 * Usage : DBZ_DB=/tmp/dbz-train.db bun data/llm/corpus_export.ts
 */
import { Database } from "bun:sqlite";

const DB_PATH = process.env.DBZ_DB ?? "/tmp/dbz-train.db";
const OUT_DIR = new URL(".", import.meta.url).pathname;
const CORPUS = `${OUT_DIR}corpus.txt`;
const SFT = `${OUT_DIR}sft.jsonl`;

const db = new Database(DB_PATH, { readonly: true });

const PERSONAS = ["whis", "beerus", "shenron", "grandpretre", "kaio", "enma"] as const;
type Persona = (typeof PERSONAS)[number];

// Préfaces de style par persona (plusieurs variantes pour éviter le perroquet).
const PREFACE: Record<Persona, string[]> = {
  whis: ["Oh oh, avec plaisir, jeune disciple.", "Oh oh ! Quelle curiosité rafraîchissante.", "Mais bien sûr, cher disciple."],
  beerus: ["Hmpf. Écoute bien, je ne répéterai pas.", "Tu oses me déranger pour ça ? Soit.", "Ne me fais pas perdre mon temps."],
  shenron: ["Je t'écoute, mortel.", "Ton souhait de savoir est entendu.", "Par les Dragon Balls, voici la vérité."],
  grandpretre: ["Du haut de l'omniscience, voici la réponse.", "En tant que guide suprême, je t'éclaire.", "Sache ceci, créature des univers inférieurs."],
  kaio: ["Hé hé hé ! Bonne question !", "Ah ah, laisse le maître t'expliquer !", "Écoute bien, jeune combattant !"],
  enma: ["Suivant ! Voici ton information.", "Par mon registre des âmes, sache que :", "Silence dans la file ! Réponse :"],
};

const SUFFIX: Record<Persona, string[]> = {
  whis: [" Tâchez de bien retenir cela.", " J'espère vous avoir éclairé.", ""],
  beerus: [" Maintenant, disparais.", " C'est tout ce que tu as à savoir.", ""],
  shenron: [" Tel est mon verdict.", "", " Ton vœu de connaissance est exaucé."],
  grandpretre: [" Telle est la vérité absolue.", "", " Médite là-dessus."],
  kaio: [" Et n'oublie pas de t'entraîner !", " Ah ah ah !", ""],
  enma: [" Au suivant !", "", " Dossier classé."],
};

let pIdx = 0;
function nextPersona(): Persona {
  const p = PERSONAS[pIdx % PERSONAS.length];
  pIdx++;
  return p;
}

// Petit PRNG déterministe (pas de Math.random — reproductible).
let seed = 1337;
function rng(): number {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Tronque proprement à <= max : à la dernière fin de phrase, sinon au dernier espace. */
function trimNice(s: string, max = 300): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (lastSentence > max * 0.5) return cut.slice(0, lastSentence + 1).trim();
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

function style(persona: Persona, fact: string): string {
  const pre = pick(PREFACE[persona]);
  const suf = pick(SUFFIX[persona]);
  return `${pre} ${trimNice(fact, 320)}${suf}`.replace(/\s+/g, " ").trim();
}

interface SftRow {
  context: string;
  persona: Persona;
  instruction: string;
  output: string;
}
const sftRows: SftRow[] = [];
function addSft(context: string, instruction: string, fact: string, persona?: Persona): void {
  const p = persona ?? nextPersona();
  if (!instruction.trim() || !fact.trim() || fact.length < 8) return;
  if (isSpanish(fact)) return; // ne pas entraîner sur des réponses espagnoles
  const out = style(p, fact);
  // Contexte court (<=300c) -> le petit modèle trouve plus facilement le fait à recopier.
  sftRows.push({ context: trimNice(context.replace(/\s+/g, " ").trim(), 800), persona: p, instruction: instruction.trim(), output: out });
}

const clean = (s: unknown): string =>
  String(s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Détecte un texte espagnol (le wiki mélange FR/ES ; l'espagnol bruite notre petit modèle FR).
const ES_MARKERS = [
  " está", " según", " también", " después", " aunque", " siendo", " conocido", " película",
  " ciudad", " además", " través", " el que", " los que", " es el ", " es la ", " guerrero",
  " hijo de", " su poder", " príncipe", " mismo", " había", " fue ", " pero ",
];
function isSpanish(t: string): boolean {
  if (/[ñ¿¡]/.test(t)) return true;
  const low = " " + t.toLowerCase() + " ";
  let n = 0;
  for (const m of ES_MARKERS) if (low.includes(m)) n++;
  return n >= 2;
}

// ---------- 1. CORPUS DE PRÉ-ENTRAÎNEMENT ----------
const corpusLines: string[] = [];
function addCorpus(text: string): void {
  const t = clean(text);
  if (t.length < 60) return;
  // Filtrer les passages massivement CJK (japonais) et l'espagnol (bruit pour un petit modèle FR).
  const cjk = (t.match(/[぀-ヿ一-鿿]/g) || []).length;
  if (cjk > t.length * 0.15) return;
  if (isSpanish(t)) return;
  corpusLines.push(t);
}

for (const r of db.query("SELECT content FROM rag_chunks").all() as { content: string }[]) {
  addCorpus(r.content);
}

// ---------- 2. PERSONNAGES ----------
const planetName = new Map<number, string>();
for (const p of db.query("SELECT id, name FROM db_planets").all() as { id: number; name: string }[]) {
  planetName.set(p.id, p.name);
}

const chars = db
  .query(
    "SELECT id, name, name_ja, ki, max_ki, race, gender, affiliation, description, origin_planet_id FROM db_characters",
  )
  .all() as any[];

for (const c of chars) {
  const name = clean(c.name);
  if (!name) continue;
  const desc = clean(c.description);
  const race = clean(c.race);
  const ki = clean(c.ki);
  const maxKi = clean(c.max_ki);
  const aff = clean(c.affiliation);
  const planet = c.origin_planet_id ? clean(planetName.get(c.origin_planet_id)) : "";

  const facts: string[] = [];
  if (race) facts.push(`Race : ${race}`);
  if (ki) facts.push(`Ki : ${ki}`);
  if (maxKi) facts.push(`Ki max : ${maxKi}`);
  if (aff) facts.push(`Affiliation : ${aff}`);
  if (planet) facts.push(`Planète d'origine : ${planet}`);
  const ctx = `Personnage : ${name}. ${facts.join(". ")}. ${desc}`.trim();

  if (desc) addCorpus(`${name}. ${facts.join(". ")}. ${desc}`);

  if (desc) {
    addSft(ctx, `Qui est ${name} ?`, desc);
    addSft(ctx, `Présente-moi ${name}.`, `${name} : ${desc}`);
    addSft(ctx, `Parle-moi de ${name}.`, desc);
  }
  if (race) addSft(ctx, `Quelle est la race de ${name} ?`, `${name} est de race ${race}.`);
  if (ki) addSft(ctx, `Quel est le niveau de puissance (ki) de ${name} ?`, `Le ki de ${name} s'élève à ${ki}.`);
  if (aff) addSft(ctx, `À quelle organisation ou camp appartient ${name} ?`, `${name} est affilié à : ${aff}.`);
  if (planet) addSft(ctx, `De quelle planète vient ${name} ?`, `${name} est originaire de la planète ${planet}.`);
}

// ---------- 3. TECHNIQUES ----------
for (const t of db
  .query("SELECT name, type, description FROM db_techniques")
  .all() as { name: string; type: string; description: string }[]) {
  const name = clean(t.name);
  const type = clean(t.type);
  const desc = clean(t.description);
  if (!name || !desc) continue;
  const ctx = `Technique : ${name}.${type ? ` Type : ${type}.` : ""} ${desc}`;
  addCorpus(ctx);
  addSft(ctx, `Qu'est-ce que la technique ${name} ?`, desc);
  addSft(ctx, `Décris la technique ${name}.`, `${name} est une technique${type ? ` de type ${type}` : ""}. ${desc}`);
  if (type) addSft(ctx, `Quel type de technique est ${name} ?`, `${name} est une technique de type ${type}.`);
}

// ---------- 4. PLANÈTES ----------
for (const p of db
  .query("SELECT name, is_destroyed, description FROM db_planets")
  .all() as { name: string; is_destroyed: number; description: string }[]) {
  const name = clean(p.name);
  const desc = clean(p.description);
  if (!name || !desc) continue;
  const destroyed = p.is_destroyed ? "Cette planète a été détruite." : "Cette planète existe toujours.";
  const ctx = `Planète : ${name}. ${destroyed} ${desc}`;
  addCorpus(ctx);
  addSft(ctx, `Parle-moi de la planète ${name}.`, desc);
  addSft(ctx, `La planète ${name} a-t-elle été détruite ?`, destroyed);
}

// ---------- 5. SAGAS ----------
for (const s of db
  .query("SELECT name, series, description FROM db_sagas")
  .all() as { name: string; series: string; description: string }[]) {
  const name = clean(s.name);
  const desc = clean(s.description);
  if (!name || !desc) continue;
  const series = clean(s.series);
  const ctx = `Saga : ${name}.${series ? ` Série : ${series}.` : ""} ${desc}`;
  addCorpus(ctx);
  addSft(ctx, `Qu'est-ce que la ${name} ?`, desc);
  addSft(ctx, `Résume la saga ${name}.`, desc);
}

// ---------- 6. TRANSFORMATIONS ----------
const charById = new Map<number, string>(chars.map((c) => [c.id, clean(c.name)]));
for (const tr of db
  .query("SELECT name, ki, character_id FROM db_transformations")
  .all() as { name: string; ki: string; character_id: number }[]) {
  const name = clean(tr.name);
  if (!name) continue;
  const ki = clean(tr.ki);
  const who = tr.character_id ? clean(charById.get(tr.character_id)) : "";
  const fact = `${name} est une transformation${who ? ` de ${who}` : ""}${ki ? `, avec un ki de ${ki}` : ""}.`;
  const ctx = `Transformation : ${name}.${who ? ` Personnage : ${who}.` : ""}${ki ? ` Ki : ${ki}.` : ""}`;
  addCorpus(ctx + " " + fact);
  addSft(ctx, `Qu'est-ce que la transformation ${name} ?`, fact);
  if (ki) addSft(ctx, `Quel est le ki de la forme ${name} ?`, `La forme ${name} atteint un ki de ${ki}.`);
}

// ---------- 7. RACES ----------
for (const r of db
  .query("SELECT name, description FROM db_races")
  .all() as { name: string; description: string }[]) {
  const name = clean(r.name);
  const desc = clean(r.description);
  if (!name || !desc) continue;
  const ctx = `Race : ${name}. ${desc}`;
  addCorpus(ctx);
  addSft(ctx, `Décris la race des ${name}.`, desc);
}

// ---------- 8. CURATED (les bonnes lignes hand-authored existantes, en closed-book) ----------
try {
  const old = require("node:fs").readFileSync(`${OUT_DIR}dbz-sft.jsonl`, "utf-8") as string;
  for (const line of old.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    try {
      const o = JSON.parse(t);
      const inst = clean(o.instruction);
      const out = clean(o.output);
      // garder seulement les vraies lignes lore (filtrer le remplissage générique)
      if (inst && out && out.length > 20 && !/sujet tout à fait fascinant qui a marqué/i.test(out)) {
        const persona = (PERSONAS as readonly string[]).includes(o.persona) ? (o.persona as Persona) : nextPersona();
        sftRows.push({ context: "", persona, instruction: inst, output: out });
        addCorpus(`${inst} ${out}`);
      }
    } catch {
      /* ignore */
    }
  }
} catch {
  /* pas de fichier existant */
}

// ---------- ÉCRITURE ----------
await Bun.write(CORPUS, corpusLines.join("\n"));
const sftText = sftRows.map((r) => JSON.stringify(r)).join("\n");
await Bun.write(SFT, sftText);

const corpusChars = corpusLines.reduce((a, l) => a + l.length, 0);
console.log(`[CORPUS] ${corpusLines.length} passages, ${(corpusChars / 1e6).toFixed(2)} M caractères -> ${CORPUS}`);
console.log(`[SFT]    ${sftRows.length} paires d'instruction ancrées -> ${SFT}`);
const byPersona: Record<string, number> = {};
for (const r of sftRows) byPersona[r.persona] = (byPersona[r.persona] || 0) + 1;
console.log(`[SFT]    par persona :`, byPersona);
db.close();
