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
 * Pour les **personnages**, le pack PWS complet (pack power scaling (sous-catégories PWS))
 * est toujours injecté s'il manque — l'onglet PWS et ses sous-onglets sont
 * présents sur toutes les fiches, vides ou non.
 *
 * db-first-replace (pas un merge) : dès qu'une section existe, masquer /
 * réordonner / supprimer / éditer au studio se répercute fidèlement (l'article
 * n'est plus consulté). Rendu 100 % côté serveur (SEO/ISR préservés).
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
import { PwsStatSection } from "@/components/wiki/PwsStatSection";
import { normalizeWikiSectionGroups, PWS_GROUP_NAME } from "@/lib/wiki-section-groups";
import {
	PWS_GROUP_PRESETS,
	PWS_LEGACY_KEY_ALIASES,
} from "@/lib/wiki-fields";
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
 * Garantit la présence du pack PWS complet (pack PWS complet) sur une fiche
 * personnage. Ne duplique pas une clé/label déjà présent ; mappe les anciennes
 * clés (`puissance-attaque` → `force-de-frappe`, etc.).
 */
export function ensureFullPwsPack(raw: RawSection[]): RawSection[] {
	const normalized = normalizeWikiSectionGroups(raw);
	const byKey = new Map(normalized.map((s) => [s.key, s]));
	const byLabel = new Map(normalized.map((s) => [sectionSlug(s.label), s]));

	// Remap legacy keys → canonical (sans perdre le body).
	for (const [legacy, canon] of Object.entries(PWS_LEGACY_KEY_ALIASES)) {
		const old = byKey.get(legacy);
		if (old && !byKey.has(canon)) {
			const remapped = {
				...old,
				key: canon,
				group: PWS_GROUP_NAME,
			};
			byKey.delete(legacy);
			byKey.set(canon, remapped);
			byLabel.set(sectionSlug(remapped.label), remapped);
		}
	}

	const out = [...byKey.values()].filter((s) => !PWS_LEGACY_KEY_ALIASES[s.key]);

	// Ajoute les presets manquants (body vide → placeholder public).
	for (const preset of PWS_GROUP_PRESETS) {
		const hasKey = out.some((s) => s.key === preset.key);
		const hasLabel = out.some(
			(s) =>
				s.group === PWS_GROUP_NAME &&
				sectionSlug(s.label) === sectionSlug(preset.label)
		);
		if (hasKey || hasLabel) {
			// Force le groupLabel PWS sur les matchs existants.
			for (let i = 0; i < out.length; i++) {
				if (
					out[i].key === preset.key ||
					(out[i].group === PWS_GROUP_NAME &&
						sectionSlug(out[i].label) === sectionSlug(preset.label))
				) {
					out[i] = {
						...out[i],
						group: PWS_GROUP_NAME,
						accent: out[i].accent || preset.accent,
					};
				}
			}
			continue;
		}
		out.push({
			key: preset.key,
			label: preset.label,
			body: "",
			accent: preset.accent,
			group: PWS_GROUP_NAME,
		});
	}

	// Ordonne : non-PWS d'abord (ordre d'origine), puis PWS dans l'ordre des presets.
	const nonPws = out.filter((s) => s.group !== PWS_GROUP_NAME);
	const pwsOrder = PWS_GROUP_PRESETS.map((p) => p.key);
	const pws = out
		.filter((s) => s.group === PWS_GROUP_NAME)
		.sort((a, b) => {
			const ia = pwsOrder.indexOf(a.key);
			const ib = pwsOrder.indexOf(b.key);
			return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
		});

	return [...nonPws, ...pws];
}

/**
 * Sections de contenu d'une entité (source unique : DB → article → description).
 * Retourne des `ContentPanel` prêts pour `WikiSectionsReader`, à clés uniques.
 * Vide si aucune source (sauf personnages : pack PWS minimal toujours présent).
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
		raw = normalizeWikiSectionGroups(
			dbSections.map((s) => ({
				key: s.key || sectionSlug(s.label),
				label: s.label,
				body: s.body,
				accent: s.accent ?? sectionAccent(s.label),
				group: s.groupLabel,
				links: s.links,
			}))
		);
	} else if (article?.trim()) {
		raw = normalizeWikiSectionGroups(
			splitArticleSections(article, fallbackHeading).map((s) => ({
				key: s.key,
				label: s.label,
				body: s.body,
				accent: s.accent,
				group: null as string | null,
			}))
		);
	} else if (description?.trim()) {
		raw = [
			{
				key: sectionSlug(fallbackHeading),
				label: fallbackHeading,
				body: description.trim(),
				accent: "orange",
			},
		];
	} else {
		raw = [];
	}

	// Personnages : toujours le pack PWS complet (sous-catégories power scaling).
	if (entityType === "character") {
		raw = ensureFullPwsPack(raw);
	}

	// Clés uniques (garde-fou : deux sections de même slug ne cassent pas React).
	const seen = new Set<string>();
	return raw.map((s) => {
		let key = s.key;
		let n = 2;
		while (seen.has(key)) key = `${s.key}-${n++}`;
		seen.add(key);
		const links = s.links ?? [];
		const isPws = s.group === PWS_GROUP_NAME;
		return {
			key,
			label: s.label,
			accent: s.accent,
			group: s.group ?? null,
			node: isPws ? (
				<div className="space-y-2">
					<PwsStatSection label={s.label} body={s.body} accent={s.accent} />
					{links.length > 0 && <WikiSectionLinks links={links} />}
				</div>
			) : (
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
