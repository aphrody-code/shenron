/**
 * Renseigne le nom japonais des techniques canoniques — après vérification.
 *
 *   bun apps/site/scripts/ja-techniques.ts            # simulation (défaut)
 *   bun apps/site/scripts/ja-techniques.ts --apply    # écrit en base
 *
 * Pourquoi ce script existe : les 825 techniques n'ont AUCUN nom japonais en
 * base. C'est la lacune qui plombe tout le reste — le détecteur de fautes n'a
 * rien à quoi rattacher « ギャリック » (de ギャリック砲, le Galick Gun) et le
 * « corrige » en « ガーリック » (Garlic, un personnage) ; la traduction rend
 * 界王拳 par « le poing du roi ».
 *
 * **Chaque graphie proposée est vérifiée contre le corpus** avant d'être
 * retenue : si elle n'apparaît dans aucune des 5 912 planches transcrites, elle
 * est écartée. Une correspondance ne vaut pas parce qu'elle semble juste, mais
 * parce que les databooks l'écrivent. C'est aussi ce qui protège des fautes de
 * frappe : une graphie erronée n'apparaît nulle part et tombe d'elle-même.
 *
 * L'appariement au nom français est volontairement strict (égalité, insensible
 * à la casse et aux accents) : une correspondance approximative poserait un nom
 * japonais sur la mauvaise technique, ce qui est pire que pas de nom du tout.
 */
import postgres from "postgres";

/**
 * Techniques canoniques : nom(s) tels qu'ils figurent en base → graphie japonaise.
 *
 * Restreint aux techniques du manga et de l'anime, dont la graphie est stable.
 * Les centaines de compétences issues des jeux en sont exclues : leurs noms
 * français sont des traductions de localisation, sans graphie japonaise
 * canonique à laquelle les rattacher.
 */
const CANDIDATS: { fr: string[]; ja: string }[] = [
	{ fr: ["Kamehameha", "Kaméhaméha"], ja: "かめはめ波" },
	{ fr: ["Super Kamehameha"], ja: "超かめはめ波" },
	{ fr: ["Kaioken", "Kaïoken", "Attaque Kaioken"], ja: "界王拳" },
	{ fr: ["Genkidama", "Genki Dama"], ja: "元気玉" },
	{ fr: ["Super Genkidama"], ja: "超元気玉" },
	{ fr: ["Makankosappo", "Rayon perforant"], ja: "魔貫光殺砲" },
	{ fr: ["Galick Gun", "Attaque Garric", "Canon Garrick"], ja: "ギャリック砲" },
	{ fr: ["Kienzan", "Disque destructeur"], ja: "気円斬" },
	{ fr: ["Taiyoken", "Poing du soleil"], ja: "太陽拳" },
	{ fr: ["Shunkan Ido", "Téléportation"], ja: "瞬間移動" },
	{ fr: ["Masenko"], ja: "魔閃光" },
	{ fr: ["Bukujutsu", "Vol"], ja: "舞空術" },
	{ fr: ["Zanzoken", "Image rémanente"], ja: "残像拳" },
	{ fr: ["Dodonpa", "Dodon Pa"], ja: "ドドン波" },
	{ fr: ["Fusion"], ja: "フュージョン" },
	{ fr: ["Final Flash"], ja: "ファイナルフラッシュ" },
	{ fr: ["Big Bang", "Big bang", "Big Bang Attack"], ja: "ビッグバンアタック" },
	{ fr: ["Sokidan"], ja: "操気弾" },
	{ fr: ["Ryu Ken", "Poing du dragon"], ja: "龍拳" },
	{ fr: ["Hikou"], ja: "飛行" },
	{ fr: ["Kikoho"], ja: "気功砲" },
	{ fr: ["Tri-Beam"], ja: "気功砲" },
	{ fr: ["Rayon mortel", "Death Beam"], ja: "デスビーム" },
	{ fr: ["Supernova"], ja: "スーパーノヴァ" },
	{ fr: ["Hell Zone Grenade"], ja: "地獄爆弾" },
	{ fr: ["Explosion finale", "Final Explosion"], ja: "ファイナルエクスプロージョン" },
	{ fr: ["Wolf Fang Fist", "Poing du loup"], ja: "狼牙風風拳" },
	{ fr: ["Kamehameha x10", "Kaméhaméha x10"], ja: "十倍かめはめ波" },
	{ fr: ["Instant Transmission"], ja: "瞬間移動" },
	{ fr: ["Mafuba", "Vague maléfique"], ja: "魔封波" },
];

const APPLIQUER = process.argv.includes("--apply");

/** Comparaison de noms : casse et accents ignorés, le reste doit coïncider. */
function cle(s: string): string {
	return s
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.trim();
}

const url = (await Bun.file(new URL("../.env", import.meta.url).pathname).text())
	.split("\n")
	.find((l) => l.startsWith("DATABASE_URL="))
	?.slice("DATABASE_URL=".length)
	.replace(/^"|"$/g, "")
	.trim();
if (!url) throw new Error("DATABASE_URL introuvable dans apps/site/.env");
const sql = postgres(url, { max: 2 });

// Corpus de référence : tout le texte transcrit des databooks.
const planches = await sql<{ texte: string }[]>`
	SELECT p ->> 'text' AS texte
	FROM bot.db_databooks d, LATERAL jsonb_array_elements(d.pages) p
	WHERE nullif(btrim(p ->> 'text'), '') IS NOT NULL
`;
const corpus = planches.map((p) => p.texte).join("\n");
console.log(`corpus : ${planches.length} planches, ${corpus.length.toLocaleString("fr-FR")} signes\n`);

const techniques = await sql<{ id: number; name: string; name_ja: string | null }[]>`
	SELECT id, name, name_ja FROM bot.db_techniques
`;
const parNom = new Map<string, { id: number; name: string; name_ja: string | null }>();
for (const t of techniques) parNom.set(cle(t.name), t);

const aEcrire: { id: number; name: string; ja: string; vu: number }[] = [];
const absentesDuCorpus: string[] = [];
const sansTechnique: string[] = [];

for (const c of CANDIDATS) {
	const vu = corpus.split(c.ja).length - 1;
	if (vu === 0) {
		// La graphie n'est écrite nulle part : soit elle est fautive, soit le
		// corpus n'en parle pas. Dans les deux cas on ne l'invente pas.
		absentesDuCorpus.push(`${c.ja} (${c.fr[0]})`);
		continue;
	}
	const trouvee = c.fr.map((f) => parNom.get(cle(f))).find(Boolean);
	if (!trouvee) {
		sansTechnique.push(`${c.ja} → aucune technique nommée ${c.fr.join(" / ")}`);
		continue;
	}
	if (trouvee.name_ja === c.ja) continue;
	aEcrire.push({ id: trouvee.id, name: trouvee.name, ja: c.ja, vu });
}

console.log(`— ${aEcrire.length} correspondances confirmées par le corpus —`);
for (const e of aEcrire.sort((a, b) => b.vu - a.vu)) {
	console.log(`  ${String(e.vu).padStart(4)}×  ${e.ja.padEnd(14)} → « ${e.name} »`);
}
if (absentesDuCorpus.length > 0) {
	console.log(`\n— ${absentesDuCorpus.length} écartées : graphie absente du corpus —`);
	for (const a of absentesDuCorpus) console.log(`  ${a}`);
}
if (sansTechnique.length > 0) {
	console.log(`\n— ${sansTechnique.length} écartées : pas de technique de ce nom en base —`);
	for (const a of sansTechnique) console.log(`  ${a}`);
}

if (!APPLIQUER) {
	console.log(`\nSimulation. Relancer avec --apply pour écrire ces ${aEcrire.length} valeurs.`);
} else {
	for (const e of aEcrire) {
		await sql`UPDATE bot.db_techniques SET name_ja = ${e.ja} WHERE id = ${e.id}`;
	}
	console.log(`\n✓ ${aEcrire.length} techniques mises à jour.`);
	console.log("Le reverse-sync propagera vers le SQLite du bot (shenron-neon-pull).");
}
await sql.end();
