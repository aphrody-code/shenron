import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
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
	description: string | null;
	source_url: string | null;
	category?: string | null;
	pages?: unknown;
	visible?: boolean | null;
};

function pagesCount(pages: unknown): number {
	return Array.isArray(pages) ? pages.length : 0;
}

function fmtDate(v: number | null): string {
	if (!v) return "—";
	const ms = v >= 1e12 ? v : v * 1000;
	const d = new Date(ms);
	return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("fr-FR");
}

function publishedMs(v: number | null): number {
	if (!v) return 0;
	return v >= 1e12 ? v : v * 1000;
}

const GROUPS: { key: string; label: string }[] = [
	{ key: "databook", label: "Databooks" },
	{ key: "interview", label: "Interviews" },
	{ key: "artbook", label: "Art Books" },
	{ key: "guidebook", label: "Guidebooks" },
];

function resolveKind(d: Databook): string {
	const cat = (d.category ?? "").trim();
	if (cat === "Interview") return "interview";
	if (cat === "Art Book") return "artbook";
	if (cat === "Guidebook") return "guidebook";
	if (cat === "Databook") return "databook";
	const k = (d.kind ?? "").toLowerCase();
	if (k === "interview" || k === "artbook" || k === "guidebook" || k === "databook") return k;
	return "databook";
}

function categoryBadge(d: Databook): string {
	const cat = (d.category ?? "").trim();
	if (cat) return cat;
	const k = resolveKind(d);
	if (k === "interview") return "Interview";
	if (k === "artbook") return "Art Book";
	if (k === "guidebook") return "Guidebook";
	return "Databook";
}

export default async function AdminDatabooksPage() {
	const raw = (await listWikiSnake("db_databooks", { limit: 500 })) as Databook[];
	const items = raw
		.slice()
		.sort((a, b) => publishedMs(b.published_at) - publishedMs(a.published_at) || a.id - b.id);

	const byKind = GROUPS.map((g) => ({
		...g,
		items: items.filter((d) => resolveKind(d) === g.key),
	})).filter((g) => g.items.length > 0);

	// Entrées avec un kind hors enum connu (saisie libre / legacy).
	const other = items.filter((d) => !GROUPS.some((g) => g.key === resolveKind(d)));
	if (other.length > 0) {
		byKind.push({ key: "other", label: "Autres", items: other });
	}

	const visibleCount = items.filter((d) => d.visible !== false).length;
	const withCover = items.filter((d) => !!d.cover).length;
	const withDesc = items.filter((d) => !!d.description?.trim()).length;
	const withPages = items.filter((d) => pagesCount(d.pages) > 0).length;
	const totalPages = items.reduce((n, d) => n + pagesCount(d.pages), 0);

	return (
		<div className="mx-auto w-full max-w-6xl">
			<AdminHeader
				title="Databooks & interviews"
				subtitle={
					items.length > 0
						? `${items.length} entrée${items.length > 1 ? "s" : ""} · ${visibleCount} visible${visibleCount > 1 ? "s" : ""}`
						: undefined
				}
			/>
			<p className="mb-4 text-sm text-white/50">
				Guides officiels, artbooks, daizenshuu et interviews. L&apos;édition se fait dans le{" "}
				<strong className="text-white/70">studio visuel</strong> (aperçu live, upload couverture,
				markdown) — comme pour les personnages. L&apos;index public triable est sur{" "}
				<code className="text-dbz-orange/80">/wiki/databooks</code>.
			</p>

			{items.length > 0 && (
				<div className="mb-6 flex flex-wrap gap-3 text-[11px] uppercase tracking-wider text-white/45">
					<span className="rounded border border-dbz-border/50 bg-white/[0.03] px-2.5 py-1">
						{withCover}/{items.length} covers
					</span>
					<span className="rounded border border-dbz-border/50 bg-white/[0.03] px-2.5 py-1">
						{withDesc}/{items.length} descriptions
					</span>
					<span className="rounded border border-dbz-border/50 bg-white/[0.03] px-2.5 py-1">
						{withPages}/{items.length} avec pages · {totalPages} planches
					</span>
					<span className="rounded border border-dbz-border/50 bg-white/[0.03] px-2.5 py-1">
						{items.filter((d) => resolveKind(d) === "databook").length} databooks ·{" "}
						{items.filter((d) => resolveKind(d) === "interview").length} interviews ·{" "}
						{items.filter((d) => resolveKind(d) === "artbook").length} art books ·{" "}
						{items.filter((d) => resolveKind(d) === "guidebook").length} guides
					</span>
				</div>
			)}

			<div className="mb-6 flex justify-end">
				<DbAddButton table={TABLE} label="Ajouter une entrée" />
			</div>

			{items.length === 0 ? (
				<div className="dbz-panel p-12 text-center">
					<p className="mb-1 font-saiyan text-xl uppercase text-white/30">Aucune entrée</p>
					<p className="text-sm text-white/40">
						Ajoutez un databook ou une interview pour commencer.
					</p>
				</div>
			) : (
				byKind.map((g) => (
					<section key={g.key} className="mb-10">
						<h2 className="mb-3 border-b-2 border-dbz-yellow/30 pb-2 font-saiyan text-2xl uppercase text-dbz-yellow">
							{g.label}{" "}
							<span className="font-sans text-sm font-normal normal-case text-white/40">
								{g.items.length}
							</span>
						</h2>
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
										<th className="w-28 p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
											Date
										</th>
										<th className="w-32 p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
											Auteur
										</th>
										<th className="w-20 p-2 text-center text-xs uppercase tracking-widest text-dbz-blue-light">
											Contenu
										</th>
										<th className="w-16 p-2 text-center text-xs uppercase tracking-widest text-dbz-blue-light">
											Vis.
										</th>
										<th className="w-24 p-2 text-right text-xs uppercase tracking-widest text-dbz-blue-light">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{g.items.map((d) => {
										const coverUrl = d.cover
											? /^https?:\/\//.test(d.cover)
												? d.cover
												: assetCdnUrl(d.cover)
											: null;
										const hasDesc = !!d.description?.trim();
										const isVisible = d.visible !== false;
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
													<Link
														href={`/admin/wiki/studio/${TABLE}/${d.id}`}
														className="text-sm font-medium text-white hover:text-dbz-orange"
													>
														{d.title}
													</Link>
													{d.title_ja && (
														<div className="font-jp mt-0.5 text-xs text-dbz-yellow/75">
															{d.title_ja}
														</div>
													)}
													<div className="mt-1 flex flex-wrap items-center gap-2">
														<span className="text-[10px] font-mono uppercase text-dbz-orange">
															{categoryBadge(d)}
														</span>
														{d.source_url && (
															<a
																href={d.source_url}
																target="_blank"
																rel="noopener noreferrer"
																className="text-[10px] text-dbz-orange/80 hover:underline"
															>
																Source
															</a>
														)}
														<a
															href={`/wiki/databooks/${d.id}`}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center gap-0.5 text-[10px] text-white/40 hover:text-dbz-orange"
															title="Page publique"
														>
															<ExternalLink className="h-2.5 w-2.5" />
															Public
														</a>
													</div>
												</td>
												<td className="p-2 text-[11px] text-white/55">
													{fmtDate(d.published_at)}
												</td>
												<td className="p-2 text-xs text-white/70">{d.author ?? "—"}</td>
												<td className="p-2 text-center">
													<span
														className={`inline-block h-2 w-2 rounded-full ${
															hasDesc ? "bg-green-400" : "bg-white/20"
														}`}
														title={hasDesc ? "Description renseignée" : "Description manquante"}
													/>
													{pagesCount(d.pages) > 0 && (
														<span className="ml-1 text-[10px] font-mono text-dbz-orange/80">
															{pagesCount(d.pages)}p
														</span>
													)}
												</td>
												<td className="p-2 text-center">
													<span
														className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
															isVisible
																? "bg-green-500/15 text-green-300"
																: "bg-white/5 text-white/35"
														}`}
													>
														{isVisible ? "ON" : "OFF"}
													</span>
												</td>
												<td className="p-2">
													<DbRowActions table={TABLE} id={d.id} />
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>
				))
			)}
		</div>
	);
}
