/**
 * Construit les **panneaux de contenu** d'une fiche wiki (catégories du
 * sélecteur) à partir d'une **seule source de vérité**, choisie par priorité :
 *
 *   1. les sections éditoriales `bot.db_wiki_sections` (studio) SI la fiche en a
 *      — elles définissent **seules** les catégories (ordre `sort_order`,
 *      masquage `visible`, libellé/corps édités au studio font foi) ;
 *   2. sinon, l'`article` long-format éclaté par titre `##`
 *      (`splitArticleSections`) — bootstrap gratuit d'une fiche non migrée ;
 *   3. sinon, la `description` courte en une seule section « Histoire ».
 *
 * db-first-replace (pas un merge) : dès qu'une section existe, masquer /
 * réordonner / supprimer / éditer au studio se répercute fidèlement (l'article
 * n'est plus consulté). La migration (`scripts/migrate-articles-to-sections.ts`)
 * copie l'intégralité de l'article en sections (préambule rattaché à la 1re) →
 * bascule sans perte. Rendu 100 % côté serveur (SEO/ISR préservés).
 */
import type { WikiSectionLink } from "@/db/bot-schema";
import { getWikiSections, type WikiSource } from "@/lib/shenron";
import {
	sectionAccent,
	sectionSlug,
	splitArticleSections,
	type SectionAccent,
} from "@/lib/wiki-article-sections";
import { WikiArticle } from "@/components/wiki/WikiArticle";
import { WikiSectionLinks } from "@/components/wiki/WikiSectionLinks";
import type { ReaderPanel } from "@/components/wiki/WikiSectionsReader";

export interface ContentPanel extends ReaderPanel {
	/** Slug de section (sert au merge des galeries relationnelles). */
	key: string;
	accent: SectionAccent;
}

interface RawSection {
	key: string;
	label: string;
	body: string;
	accent: SectionAccent;
	group?: string | null;
	links?: WikiSectionLink[];
}

/**
 * Sections de contenu d'une entité (source unique : DB → article → description).
 * Retourne des `ContentPanel` prêts pour `WikiSectionsReader`, à clés uniques.
 * Vide si aucune source.
 */
export async function buildWikiContentPanels({
	entityType,
	entityId,
	article,
	description,
	fallbackHeading = "Histoire",
}: {
	entityType: string;
	entityId: number;
	article?: string | null;
	description?: string | null;
	fallbackHeading?: string;
}): Promise<ContentPanel[]> {
	// Source de vérité : sections DB si présentes (éditables/masquables/ordonnées
	// au studio), sinon l'article éclaté, sinon la description.
	const dbSections = await getWikiSections(entityType, entityId);
	let raw: RawSection[];
	if (dbSections.length > 0) {
		raw = dbSections.map((s) => ({
			key: s.key || sectionSlug(s.label),
			label: s.label,
			body: s.body,
			accent: s.accent ?? sectionAccent(s.label),
			group: s.groupLabel,
			links: s.links,
		}));
	} else if (article?.trim()) {
		raw = splitArticleSections(article, fallbackHeading);
	} else if (description?.trim()) {
		raw = [
			{ key: sectionSlug(fallbackHeading), label: fallbackHeading, body: description.trim(), accent: "orange" },
		];
	} else {
		raw = [];
	}

	// Clés uniques (garde-fou : deux sections de même slug ne cassent pas React).
	const seen = new Set<string>();
	return raw.map((s) => {
		let key = s.key;
		let n = 2;
		while (seen.has(key)) key = `${s.key}-${n++}`;
		seen.add(key);
		const links = s.links ?? [];
		return {
			key,
			label: s.label,
			accent: s.accent,
			group: s.group ?? null,
			node: (
				<div className="space-y-2">
					{s.body.trim() ? (
						<WikiArticle article={s.body} heading={s.label} accent={s.accent} />
					) : (
						<h2 className="font-saiyan text-2xl text-white">{s.label}</h2>
					)}
					{links.length > 0 && <WikiSectionLinks links={links} />}
				</div>
			),
		} satisfies ContentPanel;
	});
}

export type { WikiSource };
