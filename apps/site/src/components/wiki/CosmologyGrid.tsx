"use client";

/**
 * Grille de la **cosmologie** : les lieux de l'univers Dragon Ball.
 *
 * La rubrique s'appelait « Planètes », mais `bot.db_planets` ne contient pas
 * que des planètes — L'Autre Monde (あの世), le Noyau du Monde (世界の中心), le
 * temple mobile du Roi de Tout (全王の宮殿, le palais de Zeno), la Planète
 * sacrée (聖地), l'Univers 11 tout entier, les Planètes Emprisonnées, le
 * Royaume des Démons. Ce sont des dimensions, des demeures divines et des
 * univers ; les ranger sous « planètes » était faux pour une entrée sur huit.
 *
 * Le contenu est rendu côté serveur et passé en props : le client ne sert qu'au
 * filtre. La table reste `db_planets` — c'est le vocabulaire affiché qui
 * change, pas le schéma.
 */
import { useMemo, useState } from "react";
import { FilterDropdown } from "@/components/wiki/FilterDropdown";
import { ViewTransition } from "@/components/ViewTransition";
import { assetUrl } from "@/lib/assets";
import { ClientGatedWrap } from "@/components/GatedClientLink";
import type { AccessSnapshot } from "@/lib/wiki-launch";

export type CosmologyPlace = {
	id: number;
	name: string;
	nameJa: string | null;
	isDestroyed: boolean;
	image: string | null;
};

export function CosmologyGrid({
	places,
	access,
}: {
	places: CosmologyPlace[];
	/** Instantané de la configuration de lancement, résolu côté serveur. */
	access?: AccessSnapshot | null;
}) {
	const [statut, setStatut] = useState<string[]>([]);

	const filtres = useMemo(() => {
		const detruits = places.filter((p) => p.isDestroyed).length;
		return [
			{ value: "alive", label: "Existants", count: places.length - detruits },
			{ value: "destroyed", label: "Détruits", count: detruits },
		];
	}, [places]);

	// `places` arrive DÉJÀ trié par la page (composant serveur). Trier ici serait
	// un `localeCompare` exécuté au rendu serveur ET à l'hydratation : deux
	// implémentations d'ICU, donc un ordre potentiellement différent des deux
	// côtés — la recette exacte du mismatch d'hydratation qui fait abandonner la
	// branche à React et gèle les clics le temps qu'elle se regénère.
	const visibles = useMemo(() => {
		if (!statut.length) return places;
		const set = new Set(statut);
		return places.filter((p) => set.has(p.isDestroyed ? "destroyed" : "alive"));
	}, [places, statut]);

	return (
		<div className="space-y-8">
			<div className="flex items-center gap-3">
				<FilterDropdown
					label="Statut"
					options={filtres}
					selected={statut}
					onChange={setStatut}
				/>
				<p className="scouter-text text-[11px] text-dbz-blue-light whitespace-nowrap sm:ml-auto">
					{visibles.length} / {places.length} lieux
				</p>
			</div>

			{visibles.length === 0 ? (
				<p className="py-20 text-center font-sans text-white/50">
					Aucun lieu ne correspond à ce filtre.
				</p>
			) : (
				<div className="reveal-grid grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
					{visibles.map((p) => (
						<ClientGatedWrap
							access={access}
							key={p.id}
							href={`/wiki/cosmologie/${p.id}`}
							transitionTypes={["nav-forward"]}
							className="group ki-card dbz-panel flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02]"
						>
							<div className="relative aspect-video overflow-hidden bg-dbz-bg p-3">
								<div className="starfield absolute inset-0 opacity-20" />
								<span aria-hidden className="ki-card__glow ki-card__glow--blue" />
								{p.image ? (
									<ViewTransition name={`planet-img-${p.id}`} share="morph">
										<img
											src={assetUrl(p.image)}
											alt={p.name}
											loading="lazy"
											className="halo-ki relative z-10 h-full w-full object-contain opacity-100 transition-all duration-700 group-hover:scale-110"
										/>
									</ViewTransition>
								) : (
									<div className="relative z-10 flex h-full w-full items-center justify-center">
										<span className="font-saiyan text-2xl text-zinc-700">?</span>
									</div>
								)}
								<div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
								{p.isDestroyed && (
									<span className="scouter-text absolute right-2 top-2 z-30 rounded bg-black/60 px-1.5 py-0.5 text-[8px] text-dbz-red">
										DÉTRUIT
									</span>
								)}
								<div className="absolute inset-x-0 bottom-0 z-30 p-3 text-center">
									<p className="truncate font-display text-sm font-bold leading-tight text-white transition-colors group-hover:text-dbz-blue-light">
										{p.name}
									</p>
									{p.nameJa && (
										<p className="mt-0.5 truncate font-jp text-[10px] text-dbz-blue-light/70">
											{p.nameJa}
										</p>
									)}
								</div>
							</div>
						</ClientGatedWrap>
					))}
				</div>
			)}
		</div>
	);
}
