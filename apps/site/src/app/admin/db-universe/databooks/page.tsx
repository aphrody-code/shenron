import Image from "next/image";
import { assetCdnUrl } from "../_lib";
import { AdminHeader } from "../_Header";
import { DbAddButton, DbRowActions } from "@/components/admin/DbCrud";
import { listWikiSnake } from "@/lib/wiki-admin";

export const dynamic = "force-dynamic";

const TABLE = "db_databooks";

type Databook = {
	id: number;
	kind: string;
	title: string;
	title_ja: string | null;
	author: string | null;
	published_at: number | null;
	cover: string | null;
	source_url: string | null;
};

function fmtDate(v: number | null): string {
	if (!v) return "—";
	const ms = v >= 1e12 ? v : v * 1000;
	const d = new Date(ms);
	return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("fr-FR");
}

export default async function AdminDatabooksPage() {
	const items = (await listWikiSnake("db_databooks")) as Databook[];

	return (
		<div className="mx-auto w-full max-w-6xl">
			<AdminHeader
				title="Databooks & interviews"
				subtitle={items.length > 0 ? `${items.length} entrée${items.length > 1 ? "s" : ""}` : undefined}
			/>
			<p className="mb-6 text-sm text-white/50">
				Guides officiels, artbooks, daizenshuu et interviews. La catégorie (databook / interview) et
				la date pilotent l&apos;affichage public triable de <code>/wiki/databooks</code>.
			</p>

			<div className="mb-6 flex justify-end">
				<DbAddButton table={TABLE} label="Ajouter une entrée" />
			</div>

			{items.length === 0 ? (
				<div className="dbz-panel p-12 text-center">
					<p className="mb-1 font-saiyan text-xl uppercase text-white/30">Aucune entrée</p>
					<p className="text-sm text-white/40">Ajoutez un databook ou une interview pour commencer.</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b-2 border-dbz-border/60">
								<th className="w-14 p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
									Cover
								</th>
								<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
									Titre
								</th>
								<th className="w-24 p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
									Type
								</th>
								<th className="w-28 p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
									Date
								</th>
								<th className="w-32 p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
									Auteur
								</th>
								<th className="w-20 p-2 text-right text-xs uppercase tracking-widest text-dbz-blue-light">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{items.map((d) => {
								const coverUrl = d.cover
									? /^https?:\/\//.test(d.cover)
										? d.cover
										: assetCdnUrl(d.cover)
									: null;
								return (
									<tr
										key={d.id}
										className="border-b border-dbz-border/30 transition-colors hover:bg-dbz-blue-light/5"
									>
										<td className="p-2">
											{coverUrl ? (
												<Image
													src={coverUrl}
													alt={d.title}
													width={36}
													height={52}
													className="rounded border border-dbz-border object-cover"
													unoptimized
												/>
											) : (
												<div className="flex h-[52px] w-9 items-center justify-center rounded bg-dbz-border/30 text-[9px] uppercase text-white/25">
													n/a
												</div>
											)}
										</td>
										<td className="p-2">
											<div className="text-sm font-medium text-white">{d.title}</div>
											{d.title_ja && (
												<div className="font-jp mt-0.5 text-xs text-dbz-yellow/75">{d.title_ja}</div>
											)}
											{d.source_url && (
												<a
													href={d.source_url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-[10px] text-dbz-orange hover:underline"
												>
													Source
												</a>
											)}
										</td>
										<td className="p-2">
											<span className="text-[10px] font-mono uppercase text-dbz-orange">
												{d.kind === "interview" ? "Interview" : "Databook"}
											</span>
										</td>
										<td className="p-2 text-[11px] text-white/55">{fmtDate(d.published_at)}</td>
										<td className="p-2 text-xs text-white/70">{d.author ?? "—"}</td>
										<td className="p-2">
											<DbRowActions table={TABLE} id={d.id} />
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
