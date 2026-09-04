"use client";

/**
 * Recherche plein texte dans les planches transcrites.
 *
 * Le manque que ça comble : jusqu'ici le seul moyen de retrouver un passage
 * était d'ouvrir la bonne fiche et de la parcourir à la main — la recherche
 * existante ne couvrait que titre, titre japonais, auteur et description.
 * Mesuré le 2026-08-22, une phrase japonaise présente dans cinq ouvrages
 * remontait 0 résultat.
 *
 * Les extraits sont découpés côté client par `extraireSegments` : l'API renvoie
 * le texte brut de la planche, jamais du HTML pré-surligné.
 */
import { useMutation } from "@tanstack/react-query";
import { Chargement, Croix, Recherche } from "@/components/icones";
import Link from "next/link";
import { useState } from "react";
import { extraireSegments } from "@/lib/databooks-format";

interface Planche {
	databookId: number;
	titre: string;
	categorie: string | null;
	numero: number;
	image: string | null;
	texte: string;
}

interface Reponse {
	q: string;
	items: Planche[];
	total: number;
	fiches: number;
}

export function TranscriptionSearch() {
	const [terme, setTerme] = useState("");
	const [dernier, setDernier] = useState("");

	const recherche = useMutation({
		mutationFn: async (q: string): Promise<Reponse> => {
			const r = await fetch(
				`/api/databooks/search?q=${encodeURIComponent(q)}&limit=60&includeHidden=1`,
				{ cache: "no-store" }
			);
			if (!r.ok) throw new Error((await r.json().catch(() => null))?.error ?? "Recherche impossible.");
			return r.json();
		},
		onSuccess: (_, q) => setDernier(q),
	});

	const lancer = () => {
		const q = terme.trim();
		if (q) recherche.mutate(q);
	};

	const resultats = recherche.data;

	return (
		<section className="dbz-panel mb-8 p-5">
			<h2 className="mb-1 font-saiyan text-sm uppercase tracking-wider text-dbz-orange">
				Chercher dans les planches
			</h2>
			<p className="mb-3 text-[11px] leading-relaxed text-white/50">
				Cherche une chaîne dans le texte transcrit, japonais compris. Les fiches masquées sont
				incluses.
			</p>

			<div className="flex flex-wrap gap-2">
				<div className="relative min-w-[220px] flex-1">
					<Recherche className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
					<input
						type="search"
						value={terme}
						onChange={(e) => setTerme(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								lancer();
							}
						}}
						placeholder="ギニュー特戦隊, Kaméhaméha, 鳥山明…"
						aria-label="Terme à chercher dans les planches"
						className="input h-10 w-full pl-9"
					/>
					{terme && (
						<button
							type="button"
							onClick={() => {
								setTerme("");
								recherche.reset();
								setDernier("");
							}}
							className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-white/40 hover:text-white"
							aria-label="Effacer la recherche"
						>
							<Croix className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
				<button
					type="button"
					className="btn btn-primary h-10 px-4 text-xs"
					disabled={recherche.isPending || !terme.trim()}
					onClick={lancer}
				>
					{recherche.isPending ? <Chargement className="h-4 w-4 animate-spin" /> : <Recherche className="h-4 w-4" />}
					Chercher
				</button>
			</div>

			{recherche.isError && (
				<p className="mt-3 rounded border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-300">
					{(recherche.error as Error).message}
				</p>
			)}

			{resultats && (
				<div className="mt-4">
					<p className="mb-3 text-xs text-white/60">
						{resultats.total === 0 ? (
							<>
								Aucune planche ne contient « <strong className="text-white">{dernier}</strong> ».
							</>
						) : (
							<>
								<strong className="text-dbz-orange">{resultats.total}</strong> planche
								{resultats.total > 1 ? "s" : ""} dans{" "}
								<strong className="text-dbz-orange">{resultats.fiches}</strong> ouvrage
								{resultats.fiches > 1 ? "s" : ""}
								{resultats.items.length < resultats.total && (
									<span className="text-white/40"> · {resultats.items.length} affichées</span>
								)}
							</>
						)}
					</p>

					<ul className="space-y-2">
						{resultats.items.map((p) => (
							<li
								key={`${p.databookId}-${p.numero}`}
								className="rounded-lg border border-dbz-border/40 bg-black/25 p-3"
							>
								<div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px]">
									<Link
										href={`/admin/databooks/${p.databookId}?planche=${p.numero}`}
										className="font-semibold text-white hover:text-dbz-orange"
									>
										{p.titre}
									</Link>
									<span className="rounded bg-dbz-orange/15 px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums text-dbz-orange">
										p. {p.numero}
									</span>
									{p.categorie && (
										<span className="font-mono text-[10px] uppercase text-white/35">
											{p.categorie}
										</span>
									)}
								</div>
								<p className="font-jp text-[13px] leading-relaxed break-words text-white/75">
									{extraireSegments(p.texte, dernier, { contexte: 70, max: 2 }).map((s, i) =>
										s.correspond ? (
											<mark
												key={i}
												className="rounded bg-dbz-yellow/25 px-0.5 text-dbz-yellow"
											>
												{s.texte}
											</mark>
										) : (
											<span key={i}>{s.texte}</span>
										)
									)}
								</p>
							</li>
						))}
					</ul>
				</div>
			)}
		</section>
	);
}
