/**
 * Aucune page publique ne doit lier une rubrique fermée.
 *
 * C'est le test qui manquait : au 2026-08-21, `/wiki/sagas` — page publique —
 * émettait **65 liens vers `/wiki/arcs/*`**, rubrique alors fermée, tous soldés
 * par une redirection 307 vers `/wiki-bientot`. Un mur d'impasses pour le
 * visiteur comme pour le crawler, invisible depuis le code puisque chaque lien
 * pris isolément semblait légitime.
 *
 * Le test est STATIQUE (analyse des sources, pas de DB ni de réseau) : il tourne
 * en CI sans dépendance. Il ne peut pas connaître la configuration réelle de
 * production, donc il vérifie la propriété structurelle qui, elle, doit tenir
 * quelle que soit la configuration : une page appartenant à une rubrique
 * gatable ne doit pas écrire en dur un lien vers une AUTRE rubrique gatable —
 * elle doit passer par `GatedLink`/`GatedWrap`, qui neutralisent la cible fermée.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { GATEABLE_CATEGORIES } from "../src/lib/wiki-launch";

const SRC = join(import.meta.dir, "..", "src");
const APP = join(SRC, "app");
const COMPOSANTS = join(SRC, "components");

function walk(dir: string): string[] {
	const out: string[] = [];
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) {
			// L'admin est réservé au staff : le gating n'y a pas cours.
			if (name === "admin" || name === "api") continue;
			out.push(...walk(p));
		} else if (name.endsWith(".tsx")) {
			out.push(p);
		}
	}
	return out;
}

/** Préfixes des rubriques refermables depuis /admin/lancement. */
const GATEABLE_PREFIXES = GATEABLE_CATEGORIES.flatMap((c) => c.prefixes);

/** Fichiers autorisés à mentionner une rubrique fermée. */
const ALLOWED = [
	// Ces composants EXISTENT pour neutraliser un lien fermé.
	"components/GatedLink.tsx",
	"components/GatedClientLink.tsx",
	// La page « bientôt » et la recherche parlent des rubriques par nature.
	"app/wiki-bientot",
	"app/wiki/search",
	// Le plan du site filtre lui-même par `isPathPublic`.
	"app/sitemap.ts",
];

/**
 * Le `href` trouvé est-il porté par un `<GatedLink>` / `<GatedWrap>` ?
 *
 * L'ancienne version se contentait de chercher `<GatedLink` N'IMPORTE OÙ dans le
 * fichier : un seul lien protégé exemptait toute la page. C'est exactement ce qui
 * a laissé passer `/wiki/arcs`, où un `GatedLink` voisinait un `<Link>` nu.
 */
function estProtege(src: string, index: number): boolean {
	// Remonte jusqu'à l'ouverture de balise qui porte cet attribut.
	const debut = src.lastIndexOf("<", index);
	if (debut === -1) return false;
	return /^<(?:Gated(?:Link|Wrap)|ClientGatedWrap)\b/.test(src.slice(debut, debut + 18));
}

describe("liens vers les rubriques gatables", () => {
	// Les composants partagés comptent autant que les pages : `WikiCategoryNav`
	// est monté par TOUTES les pages encyclopédiques, et n'était pas balayé.
	const files = [...walk(APP), ...walk(COMPOSANTS)].filter(
		(f) => !ALLOWED.some((a) => f.includes(a))
	);

	test("le registre expose bien des rubriques refermables", () => {
		expect(GATEABLE_PREFIXES.length).toBeGreaterThan(0);
	});

	test("aucun <Link href> en dur vers une rubrique gatable hors de sa propre rubrique", () => {
		const offenders: string[] = [];

		for (const file of files) {
			const src = readFileSync(file, "utf8");
			// Rubrique à laquelle appartient le fichier : une page de la rubrique X a
			// évidemment le droit de lier X (navigation interne, précédent/suivant).
			const own = GATEABLE_CATEGORIES.filter((c) =>
				c.prefixes.some((p) => file.includes(join(...p.split("/").filter(Boolean))))
			).map((c) => c.key);

			for (const cat of GATEABLE_CATEGORIES) {
				if (own.includes(cat.key)) continue;
				for (const prefix of cat.prefixes) {
					// On ne regarde que les `href` de `<Link>`/`<a>`, pas les chaînes
					// quelconques (libellés, commentaires, `probe` de test).
					const re = new RegExp(`href=(?:"${prefix}(?:/|")|\\{\`${prefix}/)`, "g");
					const nus = [...src.matchAll(re)].filter((m) => !estProtege(src, m.index ?? 0));
					if (nus.length === 0) continue;
					offenders.push(`${file.replace(SRC, "src")} → ${prefix} (${nus.length})`);
				}
			}
		}

		expect(offenders).toEqual([]);
	});

	test("un composant qui déroule un registre de rubriques résout le gating", () => {
		// Cas vécu : `WikiCategoryNav` itérait `ENCYCLOPEDIA_CATEGORIES` et rendait
		// `<Link href={c.href}>` sans condition. Aucun littéral `/wiki/...` dans le
		// fichier → invisible pour le test ci-dessus, alors que chaque page
		// encyclopédique publiait ainsi trois liens morts.
		const REGISTRES = ["ENCYCLOPEDIA_CATEGORIES", "LAUNCH_CATEGORIES", "GATEABLE_CATEGORIES"];
		const offenders: string[] = [];
		for (const file of [...walk(APP), ...walk(COMPOSANTS)]) {
			if (ALLOWED.some((a) => file.includes(a))) continue;
			const src = readFileSync(file, "utf8");
			if (!REGISTRES.some((r) => src.includes(r))) continue;
			if (!/<Link\b|<(?:Gated(?:Link|Wrap)|ClientGatedWrap)\b/.test(src)) continue;
			const resout =
				src.includes("isPathPublic") ||
				src.includes("resolveAccess") ||
				/<(?:Gated(?:Link|Wrap)|ClientGatedWrap)\b/.test(src);
			if (!resout) offenders.push(file.replace(SRC, "src"));
		}
		expect(offenders).toEqual([]);
	});
});
