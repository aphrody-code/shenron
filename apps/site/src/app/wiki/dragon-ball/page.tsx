import { getShenronCharacters, type DBCharacter } from "@/lib/shenron";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { SAGAS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Wiki personnages Dragon Ball — DBFR",
	description:
		"58 personnages canon Dragon Ball : Goku, Vegeta, Piccolo, Cell, Buu, Beerus, Jiren et plus. Fiches complètes avec ki, race, transformations.",
};

const API = "https://shenron.rpbey.fr";

function normalizeImage(p: string): string {
	return `${API}/${p.replace(/^\.\//, "")}`;
}

export default async function DragonBallWikiIndex() {
	const characters = await getShenronCharacters();

	return (
		<>
			<PageHero
				eyebrow="Wiki"
				title="Encyclopédie Dragon Ball"
				lead={`${characters.length} personnages canon — guerriers, dieux, antagonistes. Fiches complètes avec ki, race, transformations et planète d'origine.`}
				image={SAGAS_HERO}
				imageAlt="Personnages Dragon Ball"
			/>

			<div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-16 lg:py-24">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
					{characters.map((char: DBCharacter) => (
						<Link
							key={char.id}
							href={`/wiki/dragon-ball/character/${char.id}`}
							className="group flex flex-col rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.08] hover:border-dbz-orange transition-colors"
						>
							<div className="relative aspect-[3/4] bg-black overflow-hidden">
								<Image
									src={normalizeImage(char.image)}
									alt={char.name}
									fill
									sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
									className="object-cover object-top opacity-95 group-hover:scale-105 transition-transform duration-500"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
								<div className="absolute inset-x-0 bottom-0 p-3">
									<h3 className="font-display font-bold text-[13px] text-white leading-tight">
										{char.name}
									</h3>
									{char.race && (
										<p className="font-display text-[10px] tracking-[0.10em] uppercase text-dbz-orange mt-0.5">
											{char.race}
										</p>
									)}
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}
