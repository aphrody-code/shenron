// SPDX-License-Identifier: Apache-2.0

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getShenronCharacterCards } from "@/lib/shenron";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { WikiCategoryNav } from "@/components/wiki/WikiCategoryNav";
import { CHARACTERS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Transformations Dragon Ball",
	description:
		"Toutes les transformations de l'univers Dragon Ball : Super Saiyan, Super Saiyan God, Ultra Instinct, formes finales et leurs guerriers.",
	alternates: { canonical: "/wiki/transformations" },
};

// Normalise un nom de transformation pour le regroupement (sans accents/casse).
function norm(s: string): string {
	return s
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.trim();
}

type Member = { id: number; name: string; image: string | null };
type Group = { name: string; image: string | null; ki: string | null; members: Member[] };

export default async function TransformationsPage() {
	const [data, characters] = await Promise.all([
		dbUniverse.transformations(),
		getShenronCharacterCards(),
	]);
	const transformations = data?.transformations ?? [];
	const charById = new Map(characters.map((c) => [c.id, c]));

	// Regroupe par nom de transformation (une carte = un TYPE de transformation,
	// pas une par personnage → évite « Super Saiyan » répété 30 fois).
	const groups = new Map<string, Group>();
	for (const t of transformations) {
		const key = norm(t.name);
		if (!key) continue;
		const char = charById.get(t.character_id);
		let g = groups.get(key);
		if (!g) {
			g = { name: t.name, image: t.image, ki: t.ki, members: [] };
			groups.set(key, g);
		}
		if (!g.image && t.image) g.image = t.image;
		if (!g.ki && t.ki) g.ki = t.ki;
		if (char && !g.members.some((m) => m.id === char.id))
			g.members.push({ id: char.id, name: char.name, image: char.image });
	}

	const list = [...groups.values()].sort(
		(a, b) => b.members.length - a.members.length || a.name.localeCompare(b.name)
	);

	return (
		<div className="reveal-up min-h-screen bg-black">
			<PageHero
				eyebrow="Encyclopédie"
				title="Transformations"
				lead={`${list.length} transformations répertoriées — Super Saiyan, formes divines, Ultra Instinct… et les guerriers qui les maîtrisent.`}
				image={CHARACTERS_HERO}
				imageAlt="Transformations Dragon Ball"
			/>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 lg:py-20">
				<Breadcrumbs className="mb-8" items={[{ label: "Transformations" }]} />
				<WikiCategoryNav active="transformations" className="mb-12" />

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
					{list.map((g, idx) => {
						// Image représentative : image de la transfo, sinon portrait du 1er membre.
						const rep = g.members.find((m) => m.image);
						const img = g.image ?? rep?.image ?? null;
						const href = g.members[0]
							? `/wiki/dragon-ball/character/${g.members[0].id}`
							: "/wiki/personnages";
						const avatars = g.members.filter((m) => m.image).slice(0, 4);
						return (
							<Link
								key={g.name}
								href={href}
								className="group relative overflow-hidden rounded-xl border border-amber-500/20 bg-zinc-950/40 transition-all duration-500 hover:scale-[1.02] hover:border-dbz-orange/70 hover:shadow-[0_0_30px_rgba(255,178,0,0.12)] flex flex-col reveal-up"
								style={{ animationDelay: `${0.05 + idx * 0.03}s` }}
							>
								<div className="relative aspect-[4/3] bg-dbz-bg overflow-hidden">
									<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
									{img ? (
										<img
											src={assetUrl(img)}
											alt={g.name}
											loading="lazy"
											className="absolute inset-0 w-full h-full object-cover object-top opacity-100 group-hover:scale-110 transition-all duration-700"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-zinc-900">
											<span className="text-zinc-700 font-saiyan text-3xl">⚡</span>
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
									{g.ki && (
										<span className="absolute top-2 right-2 z-30 scouter-text text-[9px] text-dbz-orange bg-black/60 px-1.5 py-0.5 rounded">
											KI {g.ki}
										</span>
									)}
								</div>

								<div className="relative z-10 p-4 flex flex-col gap-3 flex-1">
									<h2 className="font-saiyan text-lg text-white uppercase tracking-wider leading-tight group-hover:text-dbz-orange transition-colors">
										{g.name}
									</h2>
									<div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
										{avatars.length > 0 ? (
											<div className="flex items-center gap-2.5">
												<div className="flex -space-x-3">
													{avatars.map((m) => (
														<div
															key={m.id}
															className="relative w-7 h-7 rounded-full border border-zinc-900 overflow-hidden bg-zinc-800"
															title={m.name}
														>
															<img
																src={assetUrl(m.image)}
																alt={m.name}
																className="w-full h-full object-cover object-top"
															/>
														</div>
													))}
												</div>
												<span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
													{g.members.length} guerrier{g.members.length > 1 ? "s" : ""}
												</span>
											</div>
										) : (
											<span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
												{g.members.length} guerrier{g.members.length > 1 ? "s" : ""}
											</span>
										)}
										<span className="text-dbz-orange opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
											→
										</span>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
