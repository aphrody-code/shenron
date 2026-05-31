import { getShenronCharacters } from "@/lib/shenron";
import { PageHero } from "@/components/PageHero";
import { CharacterGrid } from "@/components/wiki/CharacterGrid";
import { CHARACTERS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Personnages Dragon Ball — DBFR",
	description:
		"Tous les personnages canon de Dragon Ball : Saiyans, Nameks, Dieux, androïdes. Fiches avec ki, noms japonais 日本語 et romaji, filtrables par race.",
};

export default async function PersonnagesPage() {
	const characters = await getShenronCharacters();

	return (
		<>
			<PageHero
				eyebrow="Encyclopédie"
				title="Personnages"
				lead={`${characters.length} guerriers de tout l'univers Dragon Ball — fiches croisées API + Fandom, ki, noms natifs et race.`}
				image={CHARACTERS_HERO}
				imageAlt="Personnages Dragon Ball"
			/>
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 lg:py-16 reveal-up">
				<CharacterGrid
					characters={characters.map((c) => ({
						id: c.id,
						name: c.name,
						nameJa: c.nameJa,
						race: c.race,
						ki: c.ki,
						image: c.image,
					}))}
				/>
			</div>
		</>
	);
}
