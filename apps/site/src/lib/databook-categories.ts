/**
 * Catégories éditoriales des databooks / interviews — client-safe.
 * Source unique pour la grille publique, le studio (ENUM_OPTIONS) et le schéma.
 */
export const DATABOOK_CATEGORIES = [
	"V-Jump",
	"Weekly Shonen Jump",
	"Light Novel",
	"Jump Anime Comics",
	"Pamphlet & Fair",
	"Autre",
] as const;

export type DatabookCategory = (typeof DATABOOK_CATEGORIES)[number];

export function resolveDatabookCategory(c: string | null | undefined): DatabookCategory {
	const t = (c ?? "").trim();
	if ((DATABOOK_CATEGORIES as readonly string[]).includes(t)) {
		return t as DatabookCategory;
	}
	return "Autre";
}
