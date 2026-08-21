/**
 * Nom accessible des champs de formulaire côté public.
 *
 * Un `placeholder` n'est PAS un nom accessible : il disparaît à la saisie, et
 * plusieurs lecteurs d'écran ne l'annoncent pas du tout. Le site comptait
 * 26 champs publics dans ce cas — recherche du wiki, saisie de l'assistant,
 * éditeur de tierlist, pistes de sous-titres — donc autant de « zone de texte,
 * vide » sans plus d'indication.
 *
 * Ce test relit les sources : un champ compte comme nommé s'il porte
 * `aria-label`/`aria-labelledby`/`title`, s'il est enveloppé par un `<label>`,
 * ou si un `<label htmlFor>` le désigne à proximité.
 */
import { describe, expect, test } from "bun:test";
import { Glob } from "bun";

/** Primitives génériques : c'est l'appelant qui fournit le nom, par les props. */
const PRIMITIVES = new Set(["src/components/ui/input.tsx", "src/components/ui/textarea.tsx"]);

const racine = new URL("..", import.meta.url).pathname;

async function champsSansNom(): Promise<string[]> {
	const sans: string[] = [];
	for (const dossier of ["src/components", "src/app"]) {
		for await (const rel of new Glob("**/*.tsx").scan({ cwd: `${racine}${dossier}` })) {
			const chemin = `${dossier}/${rel}`;
			// L'admin est hors périmètre public : traité séparément.
			if (chemin.includes("/admin/") || PRIMITIVES.has(chemin)) continue;
			const lignes = (await Bun.file(`${racine}${chemin}`).text()).split("\n");
			for (let i = 0; i < lignes.length; i++) {
				if (!/<(input|select|textarea)\b/.test(lignes[i]!)) continue;
				let bloc = "";
				for (let j = i; j < Math.min(i + 18, lignes.length); j++) {
					bloc += `${lignes[j]}\n`;
					if (/\/>|<\/(input|select|textarea)>/.test(lignes[j]!)) break;
				}
				// Un champ caché n'est pas exposé à l'arbre d'accessibilité.
				if (/type="hidden"/.test(bloc)) continue;
				if (/aria-label|aria-labelledby|\btitle=/.test(bloc)) continue;
				const amont = lignes.slice(Math.max(0, i - 14), i).join("\n");
				const ouvert = amont.lastIndexOf("<label");
				if (ouvert !== -1 && !amont.slice(ouvert).includes("</label>")) continue; // <label> englobant
				if (/<label[^>]*htmlFor/.test(amont + lignes.slice(i, i + 18).join("\n"))) continue;
				sans.push(`${chemin}:${i + 1}`);
			}
		}
	}
	return sans.sort();
}

describe("accessibilité des formulaires publics", () => {
	test("aucun champ public n'est dépourvu de nom accessible", async () => {
		expect(await champsSansNom()).toEqual([]);
	});
});
