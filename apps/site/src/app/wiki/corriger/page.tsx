/**
 * /wiki/corriger?table=&row=&col=&retour= — page dédiée à une proposition.
 *
 * Pourquoi une page plutôt que la modale partout : chaque rubrique affichée
 * portait son propre `WikiContribute`, soit un composant client par section sur
 * ~1 400 pages statiques. **Trois builds sont morts en OOM à la compilation**
 * avant que la corrélation soit établie (mêmes conditions mémoire aux six
 * lancements — c'était le code, pas la machine). Les rubriques pointent
 * désormais un lien rendu côté serveur, qui ne coûte rien, et l'éditeur n'est
 * instancié qu'ici, une fois.
 *
 * Bénéfice de côté : l'URL est partageable (« corrige ce paragraphe, tiens »),
 * et la page fonctionne sans avoir à ouvrir une modale par-dessus la lecture.
 */
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { WikiContribute } from "@/components/wiki/WikiContribute";
import { CONTRIBUTABLE_COLUMNS } from "@/lib/contributions-shared";
import { champPlanche, estCiblePlanche, numeroDePlanche } from "@/lib/databook-pages-shared";
import { WIKI_TABLE_SPECS } from "@/lib/wiki-tables";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Proposer une correction",
	// Une page de formulaire paramétrée par query string n'a rien à faire dans
	// l'index : elle n'a pas de contenu propre et sa combinatoire est infinie.
	robots: { index: false, follow: true },
};

export default async function PageCorriger({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const sp = await searchParams;
	const lire = (k: string) => (Array.isArray(sp[k]) ? sp[k][0] : sp[k]) ?? "";

	const table = lire("table");
	const row = lire("row");
	const col = lire("col");
	const retour = lire("retour");

	const spec = WIKI_TABLE_SPECS[table];
	// `pages#42` : la transcription d'UNE planche de databook. Ce n'est pas une
	// colonne de la table, donc ni `CONTRIBUTABLE_COLUMNS` ni `mutableColumns`
	// ne peuvent la valider — c'est `estCiblePlanche` qui fait foi, exactement
	// comme dans le circuit de dépôt.
	const planche = estCiblePlanche(table, col) ? numeroDePlanche(col) : null;
	const champ = planche !== null ? champPlanche(planche) : CONTRIBUTABLE_COLUMNS[col];
	const valide = Boolean(
		row && champ && (planche !== null || (spec && spec.mutableColumns.includes(col)))
	);

	return (
		<div className="mx-auto w-full max-w-3xl px-6 py-12 lg:px-10 lg:py-20">
			<Link
				href={retour && retour.startsWith("/") ? retour : "/wiki/contribuer"}
				className="inline-flex items-center gap-2 text-xs font-semibold text-white/45 transition-colors hover:text-white"
			>
				<ArrowLeft className="h-3.5 w-3.5" /> Revenir
			</Link>

			<h1 className="mt-6 font-saiyan text-3xl uppercase text-white">
				Proposer une correction
			</h1>

			{!valide ? (
				<p className="mt-4 rounded-lg border border-dbz-red/30 bg-dbz-red/[0.07] px-4 py-3 text-sm text-dbz-red">
					Ce lien ne désigne aucun contenu modifiable. Reviens à la fiche et clique sur
					«&nbsp;Corriger&nbsp;» depuis la rubrique concernée.
				</p>
			) : (
				<>
					<p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
						{champ!.hint} Rien n&apos;est publié tant qu&apos;un relecteur n&apos;a pas validé —
						et si ta proposition est retenue, la modification portera ton nom.
					</p>
					<div className="mt-8">
						<WikiContribute table={table} rowId={row} columns={[col]} />
					</div>
					<p className="mt-8 border-t border-white/8 pt-5 text-xs leading-relaxed text-white/40">
						Le wiki se rédige sur le manga et les databooks —{" "}
						<Link
							href="/wiki/contribuer"
							className="text-white/60 underline underline-offset-2 hover:text-dbz-orange"
						>
							ce qui fait une bonne source
						</Link>
						.
					</p>
				</>
			)}
		</div>
	);
}
