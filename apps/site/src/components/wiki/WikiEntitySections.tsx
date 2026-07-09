/**
 * Assemble les sections de contenu d'une entité wiki en un sélecteur de
 * catégories (`WikiSectionsReader`). Combine, dans l'ordre :
 *   1. `leading`  — panneaux « intégrés » de tête (ex. Histoire tirée de l'article) ;
 *   2. les sections éditoriales DB (`bot.db_wiki_sections`, visibles, triées) ;
 *   3. `trailing` — panneaux « intégrés » de queue (ex. Transformations, Techniques).
 *
 * Server Component : lit la DB (`getWikiSections`, server-only) et rend chaque
 * section via `WikiArticle` (même chrome que la biographie). Si aucun panneau →
 * ne rend rien (aucun changement visuel sur les pages sans section).
 */
import { getWikiSections } from "@/lib/shenron";
import { WikiArticle } from "@/components/wiki/WikiArticle";
import { WikiSectionLinks } from "@/components/wiki/WikiSectionLinks";
import { WikiSectionsReader, type ReaderPanel } from "@/components/wiki/WikiSectionsReader";

export async function WikiEntitySections({
	entityType,
	entityId,
	leading = [],
	trailing = [],
}: {
	entityType: string;
	entityId: number;
	leading?: ReaderPanel[];
	trailing?: ReaderPanel[];
}) {
	const sections = await getWikiSections(entityType, entityId);

	const sectionPanels: ReaderPanel[] = sections.map((s) => ({
		key: `sec-${s.id}`,
		label: s.label,
		accent: s.accent,
		group: s.groupLabel,
		node: (
			<div className="space-y-2">
				{s.body.trim() ? (
					<WikiArticle article={s.body} heading={s.label} accent={s.accent ?? "orange"} />
				) : (
					<h2 className="font-saiyan text-2xl text-white">{s.label}</h2>
				)}
				<WikiSectionLinks links={s.links} />
			</div>
		),
	}));

	const panels = [...leading, ...sectionPanels, ...trailing];
	if (panels.length === 0) return null;

	return <WikiSectionsReader panels={panels} />;
}
