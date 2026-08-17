/**
 * Identité d'affichage d'un personnage — différencier les versions
 * (Xeno, futur, SDBH…) et la saga d'apparition quand le nom seul ne suffit pas.
 * Module client-safe (pas de DB).
 */

export interface CharacterIdentity {
	/** Nom sans suffixe de version (ex. « Son Goku »). */
	baseName: string;
	/**
	 * Tag de version extrait du nom : parenthèses `(Xeno)`, `(futur)`, `(SDBH)`,
	 * ou suffixe type « Jr. » / « Black ». Null si le nom est « nu ».
	 */
	versionFromName: string | null;
	/**
	 * Libellé court à afficher sous le nom pour désambiguïser :
	 * version du nom en priorité, sinon saga d'apparition.
	 */
	disambiguator: string | null;
}

/** Extrait le nom de base et les tags entre parenthèses en fin de nom. */
export function parseCharacterName(name: string): {
	baseName: string;
	versionFromName: string | null;
} {
	const raw = name.trim();
	// Un ou plusieurs blocs (… ) en fin de nom.
	const paren = raw.match(/^(.*?)\s*((?:\([^)]+\)\s*)+)$/);
	if (paren) {
		const base = paren[1].trim();
		const tags = [...paren[2].matchAll(/\(([^)]+)\)/g)].map((m) => m[1].trim()).filter(Boolean);
		return {
			baseName: base || raw,
			versionFromName: tags.length ? tags.join(" · ") : null,
		};
	}
	// Suffixes courants hors parenthèses.
	const suffix = raw.match(/^(.*?)\s+(Jr\.?|Black|GT)$/i);
	if (suffix && suffix[1].trim().length >= 2) {
		return { baseName: suffix[1].trim(), versionFromName: suffix[2].replace(/\.$/, "") };
	}
	return { baseName: raw, versionFromName: null };
}

/** Raccourcit un nom de saga pour une pastille (retire « Saga de/des/du/d' »). */
export function shortSagaLabel(sagaName: string | null | undefined): string | null {
	if (!sagaName?.trim()) return null;
	return (
		sagaName
			.trim()
			.replace(/^saga\s+(de\s+la\s+|de\s+l['']|des\s+|du\s+|de\s+|d[''])?/i, "")
			.trim() || sagaName.trim()
	);
}

/**
 * Identité d'affichage : version du nom prioritaire, sinon saga d'apparition.
 * @param name nom brut DB
 * @param debutSagaName nom de la saga d'apparition (optionnel)
 */
export function characterIdentity(name: string, debutSagaName?: string | null): CharacterIdentity {
	const { baseName, versionFromName } = parseCharacterName(name);
	const saga = shortSagaLabel(debutSagaName);
	return {
		baseName,
		versionFromName,
		disambiguator: versionFromName ?? saga,
	};
}
