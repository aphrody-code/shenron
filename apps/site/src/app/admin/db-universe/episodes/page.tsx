import { adminFetch } from "../_lib";
import { AdminHeader } from "../_Header";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SERIES = [
	"DB",
	"DBZ",
	"DBZ_KAI",
	"DBZ_KAI_FINAL",
	"DBGT",
	"DBS",
	"DB_DAIMA",
];

type Episode = {
	id: number;
	series: string;
	number_in_series: number;
	title: string;
	title_ja: string | null;
	air_date: number | null;
	mal_id: number | null;
};

export default async function AdminEpisodesPage({
	searchParams,
}: {
	searchParams: Promise<{ series?: string }>;
}) {
	const sp = await searchParams;
	const series = sp.series ?? "DBZ";
	const data = await adminFetch<{ episodes: Episode[]; total: number }>(
		`/api/public/wiki/episodes?series=${series}&limit=500`,
	);
	const eps = data?.episodes ?? [];
	const total = data?.total ?? 0;

	return (
		<div className="w-full max-w-6xl mx-auto">
			<AdminHeader
				title="DB Universe // Episodes"
				subtitle={`${series} · ${total} épisodes`}
			/>

			<nav className="mb-6 flex flex-wrap gap-2">
				{SERIES.map((s) => (
					<Link
						key={s}
						href={`/admin/db-universe/episodes?series=${s}`}
						className={`px-3 py-1.5 border-2 font-saiyan tracking-widest text-xs uppercase transition-colors ${
							s === series
								? "border-dbz-orange bg-dbz-orange/15 text-dbz-orange"
								: "border-dbz-blue-light/30 text-white/70 hover:border-dbz-orange/60 hover:text-white"
						}`}
					>
						{s}
					</Link>
				))}
			</nav>

			<table className="w-full">
				<thead>
					<tr className="border-b-2 border-dbz-border/60">
						<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-16">
							#
						</th>
						<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
							Titre
						</th>
						<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-32">
							Diffusion
						</th>
						<th className="p-2 text-right text-xs uppercase tracking-widest text-dbz-blue-light w-20">
							MAL
						</th>
					</tr>
				</thead>
				<tbody>
					{eps.map((ep) => (
						<tr
							key={ep.id}
							className="border-b border-dbz-border/30 hover:bg-dbz-blue-light/5"
						>
							<td className="p-2 font-mono text-xs text-dbz-orange tabular-nums">
								{String(ep.number_in_series).padStart(3, "0")}
							</td>
							<td className="p-2">
								<div className="text-sm text-white">{ep.title}</div>
								{ep.title_ja && (
									<div className="font-jp text-xs text-dbz-yellow/75 mt-0.5">
										{ep.title_ja}
									</div>
								)}
							</td>
							<td className="p-2 text-[11px] text-white/55">
								{ep.air_date
									? new Date(ep.air_date).toLocaleDateString("fr-FR")
									: "—"}
							</td>
							<td className="p-2 text-right">
								{ep.mal_id && (
									<a
										href={`https://myanimelist.net/anime/${ep.mal_id}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-[10px] font-mono text-dbz-blue-light/70 hover:text-dbz-orange"
									>
										#{ep.mal_id}
									</a>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
