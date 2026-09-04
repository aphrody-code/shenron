import Link from "next/link";
import {
	CocheCercle,
	Document,
	FlecheGauche,
	IllustrationAbsente,
	Presse,
} from "@/components/icones";
import { listIncompleteContent } from "@/lib/wiki-admin";
import { assetUrl } from "@/lib/db-universe";
import { TABLE_LABELS } from "@/lib/db-labels";
import { isStudioTable } from "@/lib/wiki-fields";

export const dynamic = "force-dynamic";

export const metadata = { title: "Fiches à compléter" };

function editHref(table: string, id: string): string {
	return isStudioTable(table)
		? `/admin/wiki/studio/${table}/${encodeURIComponent(id)}`
		: `/admin/database/${table}`;
}

export default async function WikiTodoPage() {
	const { groups, order } = await listIncompleteContent(80);
	const total = order.reduce((n, t) => n + (groups[t]?.length ?? 0), 0);

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6">
			<div className="flex items-center gap-3">
				<Link href="/admin/wiki" className="btn btn-ghost">
					<FlecheGauche className="h-4 w-4" />
					<span className="sr-only">Retour au wiki</span>
				</Link>
				<div className="flex-1">
					<h1 className="flex items-center gap-2 font-saiyan text-3xl uppercase text-dbz-orange">
						<Presse className="h-6 w-6" />
						Fiches à compléter
					</h1>
					<p className="mt-1 text-sm text-white/50">
						Les entités dont l'image ou le texte manque encore. Clique pour ouvrir la fiche dans le
						studio et la compléter.
					</p>
				</div>
			</div>

			{total === 0 ? (
				<div className="card py-16 text-center">
					<CocheCercle className="mx-auto mb-3 h-10 w-10 text-green-400" />
					<p className="font-saiyan text-2xl uppercase text-white">Tout est complet</p>
					<p className="mt-1 text-sm text-white/50">
						Chaque fiche suivie possède une image et un texte. Beau travail.
					</p>
				</div>
			) : (
				<>
					<p className="text-sm text-white/50">
						<span className="font-bold text-dbz-orange">{total}</span> fiche{total > 1 ? "s" : ""} à
						compléter (plafonné à 80 par type).
					</p>
					{order.map((table) => {
						const rows = groups[table] ?? [];
						return (
							<section key={table} id={table} className="scroll-mt-24">
								<h2 className="mb-3 flex items-baseline gap-2 font-saiyan text-xl uppercase tracking-widest text-dbz-yellow">
									{TABLE_LABELS[table] ?? table}
									<span className="font-mono text-xs text-white/50">{rows.length}</span>
								</h2>
								<ul className="dbz-panel divide-y divide-dbz-border/40">
									{rows.map((r) => (
										<li key={`${table}-${r.id}`}>
											<Link
												href={editHref(table, r.id)}
												className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-dbz-orange/5"
											>
												<span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded border border-dbz-border bg-dbz-bg">
													{r.image ? (
														<img
															src={assetUrl(r.image)}
															alt=""
															className="h-full w-full object-cover"
															loading="lazy"
														/>
													) : (
														<IllustrationAbsente className="h-4 w-4 text-white/25" />
													)}
												</span>
												<span className="min-w-0 flex-1">
													<span className="block truncate font-semibold text-white">{r.label}</span>
													<span className="font-mono text-[10px] text-white/50">#{r.id}</span>
												</span>
												<span className="flex shrink-0 gap-1.5">
													{r.missingImage && (
														<span className="inline-flex items-center gap-1 rounded border border-dbz-border px-1.5 py-0.5 text-[10px] text-white/55">
															<IllustrationAbsente className="h-3 w-3" />
															image
														</span>
													)}
													{r.missingDesc && (
														<span className="inline-flex items-center gap-1 rounded border border-dbz-border px-1.5 py-0.5 text-[10px] text-white/55">
															<Document className="h-3 w-3" />
															texte
														</span>
													)}
												</span>
											</Link>
										</li>
									))}
								</ul>
							</section>
						);
					})}
				</>
			)}
		</div>
	);
}
